import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LayoutAdmin from '../Components/Layout-admin';
import { checkAdminStatus } from '../Scripts/checkAdmin';
// Uwaga: Link do szczegółów
import { Link } from 'react-router-dom';

function CarManagement() {
  const [cars, setCars] = useState([]);
  const [carTypes, setCarTypes] = useState([]);

  // Sekcja typów samochodów
  const [newCarType, setNewCarType] = useState({
    brand: '',
    model: '',
    nrOfSeats: 5,
  });
  const [editCarTypeID, setEditCarTypeID] = useState(null);
  const [editCarTypeData, setEditCarTypeData] = useState({});

  // Sekcja konkretnych samochodów
  const [newCar, setNewCar] = useState({
    id: '',
    car_type_id: 0,
    year: '',
    color: '',
    price_per_day: '',
    status: 'available',
  });

  const [token] = useState(localStorage.getItem('token') || '');
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    (async () => {
      // Sprawdzanie czy user jest adminem
      setIsAdmin(await checkAdminStatus(token));
    })();
  }, [token]);

  useEffect(() => {
    if (!isAdmin) return;
    fetchCarTypes();
    fetchCars();
  }, [isAdmin]);

  // ------------ Funkcje do CarType ------------
  const fetchCarTypes = async () => {
    try {
      const res = await axios.get('http://localhost:8080/cartype/all');
      setCarTypes(res.data);
    } catch (err) {
      console.error('Błąd przy pobieraniu typów samochodów:', err);
    }
  };

  const handleNewCarTypeChange = (e) => {
    const { name, value } = e.target;
    setNewCarType((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCarType = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/cartype/add', newCarType, {
        headers: { Authorization: token },
      });
      alert('Typ samochodu dodany!');
      fetchCarTypes();
    } catch (err) {
      console.error('Błąd przy dodawaniu typu samochodu:', err);
      alert('Nie udało się dodać typu samochodu.');
    }
  };

  const startEditType = (carType) => {
    setEditCarTypeID(carType.id);
    setEditCarTypeData({ ...carType });
  };

  const handleEditCarTypeChange = (e) => {
    const { name, value } = e.target;
    setEditCarTypeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateCarType = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8080/cartype/${editCarTypeID}`,
        editCarTypeData,
        { headers: { Authorization: token } }
      );
      alert('Typ samochodu zaktualizowany!');
      setEditCarTypeID(null);
      fetchCarTypes();
    } catch (err) {
      console.error('Błąd przy aktualizacji typu samochodu:', err);
      alert('Nie udało się zaktualizować typu samochodu.');
    }
  };

  const handleDeleteCarType = async (carTypeID) => {
    try {
      await axios.delete(`http://localhost:8080/cartype/${carTypeID}`, {
        headers: { Authorization: token },
      });
      alert('Typ samochodu usunięty!');
      fetchCarTypes();
    } catch (err) {
      console.error('Błąd przy usuwaniu typu samochodu:', err);
      alert('Nie udało się usunąć typu samochodu.');
    }
  };

  // ------------ Funkcje do Car ------------
  const fetchCars = async () => {
    try {
      const res = await axios.get('http://localhost:8080/cars/all');
      setCars(res.data);
    } catch (err) {
      console.error('Błąd przy pobieraniu listy samochodów:', err);
    }
  };

  const handleNewCarChange = (e) => {
    const { name, value } = e.target;
    setNewCar((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCar = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:8080/cars/add',
        newCar,
        { headers: { Authorization: token } }
      );
      alert('Samochód dodany!');
      fetchCars();
    } catch (err) {
      console.error('Błąd przy dodawaniu samochodu:', err);
      alert('Nie udało się dodać samochodu.');
    }
  };

  // (Edycję i usuwanie przenosimy do osobnej podstrony – AdminCarDetails.js)

  if (isAdmin === null) {
    return <LayoutAdmin>Ładowanie...</LayoutAdmin>;
  }
  if (!isAdmin) {
    return <LayoutAdmin>Brak uprawnień.</LayoutAdmin>;
  }

  return (
    <LayoutAdmin>
      <h2>Zarządzanie samochodami</h2>

      {/* SEKCJA TYPÓW SAMOCHODU (bez zmian) */}
      <form onSubmit={handleAddCarType}>
        <h3>Dodaj typ samochodu</h3>
        <label>Brand:</label>
        <input
          type="text"
          name="brand"
          value={newCarType.brand}
          onChange={handleNewCarTypeChange}
        />
        <label>Model:</label>
        <input
          type="text"
          name="model"
          value={newCarType.model}
          onChange={handleNewCarTypeChange}
        />
        <label>Liczba miejsc:</label>
        <input
          type="number"
          name="nrOfSeats"
          value={newCarType.nrOfSeats}
          onChange={handleNewCarTypeChange}
        />
        <button type="submit">Dodaj</button>
      </form>

      <h3>Lista typów samochodów</h3>
      <ul>
        {carTypes.map((carType) => (
          <li key={carType.id}>
            {editCarTypeID === carType.id ? (
              // Edycja typu
              <form onSubmit={handleUpdateCarType}>
                <input
                  type="text"
                  name="brand"
                  value={editCarTypeData.brand}
                  onChange={handleEditCarTypeChange}
                />
                <input
                  type="text"
                  name="model"
                  value={editCarTypeData.model}
                  onChange={handleEditCarTypeChange}
                />
                <input
                  type="number"
                  name="nrOfSeats"
                  value={editCarTypeData.nrOfSeats}
                  onChange={handleEditCarTypeChange}
                />
                <button type="submit">Zapisz</button>
                <button type="button" onClick={() => setEditCarTypeID(null)}>
                  Anuluj
                </button>
              </form>
            ) : (
              <>
                <b>{carType.id}</b> {carType.brand}, {carType.model} ({carType.nrOfSeats} miejsc)
                <button onClick={() => startEditType(carType)}>Edytuj</button>
                <button onClick={() => handleDeleteCarType(carType.id)}>Usuń</button>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* SEKCJA SAMOCHODÓW KONKRETNYCH (zredukowana lista) */}
      <form onSubmit={handleAddCar}>
        <h3>Dodaj samochód</h3>
        <label>Numer rejestracyjny:</label>
        <input
          type="text"
          name="id"
          value={newCar.id}
          onChange={handleNewCarChange}
          required
        />
        <select
          name="car_type_id"
          value={newCar.car_type_id}
          onChange={handleNewCarChange}
        >
          {carTypes.map((ct) => (
            <option key={ct.id} value={ct.id}>
              {ct.brand}, {ct.model}, {ct.nrOfSeats}
            </option>
          ))}
        </select>
        <label>Rok:</label>
        <input
          type="number"
          name="year"
          value={newCar.year}
          onChange={handleNewCarChange}
        />
        <label>Kolor:</label>
        <input
          type="text"
          name="color"
          value={newCar.color}
          onChange={handleNewCarChange}
        />
        <label>Cena / dzień:</label>
        <input
          type="number"
          name="price_per_day"
          value={newCar.price_per_day}
          onChange={handleNewCarChange}
        />
        <button type="submit">Dodaj</button>
      </form>

      <h3>Lista samochodów</h3>
      <ul>
        {cars.map((car) => (
          <li key={car.id}>
            {/* TYLKO podstawowe info, plus link do szczegółów */}
            <strong>{car.id}</strong> {/* rejestracja */}
            , rok: {car.year}
            , status: {car.status}
            {' '}
            {/* Link do nowej podstrony: /admin-car/:id */}
            <Link to={`/admin-car/${car.id}`} style={{ marginLeft: '1rem' }}>
              Szczegóły
            </Link>
          </li>
        ))}
      </ul>
    </LayoutAdmin>
  );
}

export default CarManagement;
