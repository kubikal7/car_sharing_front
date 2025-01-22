import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LayoutAdmin from '../Components/Layout-admin';
import { checkAdminStatus } from '../Scripts/checkAdmin';
import { Link } from 'react-router-dom';
import "../Styles/CarManagement.css"

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
    car_type_id: 1,
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
      <div class="car-management">
  <h2 class="page-title">Zarządzanie samochodami</h2>

  <form class="car-type-form" onSubmit={handleAddCarType}>
    <h3 class="section-title">Dodaj typ samochodu</h3>
    <label class="form-label">Brand:</label>
    <input
      type="text"
      name="brand"
      value={newCarType.brand}
      onChange={handleNewCarTypeChange}
      class="form-input"
    />
    <label class="form-label">Model:</label>
    <input
      type="text"
      name="model"
      value={newCarType.model}
      onChange={handleNewCarTypeChange}
      class="form-input"
    />
    <label class="form-label">Liczba miejsc:</label>
    <input
      type="number"
      name="nrOfSeats"
      value={newCarType.nrOfSeats}
      onChange={handleNewCarTypeChange}
      class="form-input"
    />
    <button type="submit" class="form-button">Dodaj</button>
  </form>

  <h3 class="section-title">Lista typów samochodów</h3>
  <ul class="car-type-list">
    {carTypes.map((carType) => (
      <li key={carType.id} class="car-type-item">
        {editCarTypeID === carType.id ? (
          <form class="edit-car-type-form" onSubmit={handleUpdateCarType}>
            <input
              type="text"
              name="brand"
              value={editCarTypeData.brand}
              onChange={handleEditCarTypeChange}
              class="form-input"
            />
            <input
              type="text"
              name="model"
              value={editCarTypeData.model}
              onChange={handleEditCarTypeChange}
              class="form-input"
            />
            <input
              type="number"
              name="nrOfSeats"
              value={editCarTypeData.nrOfSeats}
              onChange={handleEditCarTypeChange}
              class="form-input"
            />
            <button type="submit" class="form-button">Zapisz</button>
            <button
              type="button"
              onClick={() => setEditCarTypeID(null)}
              class="form-button cancel-button"
            >
              Anuluj
            </button>
          </form>
        ) : (
          <>
            <b class="car-type-id">{carType.id}</b> {carType.brand}, {carType.model} (
            {carType.nrOfSeats} miejsc)
            <button
              onClick={() => startEditType(carType)}
              class="action-button edit-button"
            >
              Edytuj
            </button>
            <button
              onClick={() => handleDeleteCarType(carType.id)}
              class="action-button delete-button"
            >
              Usuń
            </button>
          </>
        )}
      </li>
    ))}
  </ul>

  <form class="add-car-form" onSubmit={handleAddCar}>
    <h3 class="section-title">Dodaj samochód</h3>
    <label class="form-label">Numer rejestracyjny:</label>
    <input
      type="text"
      name="id"
      value={newCar.id}
      onChange={handleNewCarChange}
      class="form-input"
      required
    />
    <select
      name="car_type_id"
      value={newCar.car_type_id}
      onChange={handleNewCarChange}
      class="form-select"
    >
      {carTypes.map((ct) => (
        <option key={ct.id} value={ct.id}>
          {ct.brand}, {ct.model}, {ct.nrOfSeats}
        </option>
      ))}
    </select>
    <label class="form-label">Rok:</label>
    <input
      type="number"
      name="year"
      value={newCar.year}
      onChange={handleNewCarChange}
      class="form-input"
    />
    <label class="form-label">Kolor:</label>
    <input
      type="text"
      name="color"
      value={newCar.color}
      onChange={handleNewCarChange}
      class="form-input"
    />
    <label class="form-label">Cena / dzień:</label>
    <input
      type="number"
      name="price_per_day"
      value={newCar.price_per_day}
      onChange={handleNewCarChange}
      class="form-input"
    />
    <button type="submit" class="form-button">Dodaj</button>
  </form>

  <h3 class="section-title">Lista samochodów</h3>
  <ul class="car-list">
    {cars.map((car) => (
      <li key={car.id} class="car-item">
        <strong class="car-id">{car.id}</strong>{car.carType.brand} {car.carType.model}, status: {car.status}{' '}
        <Link
          to={`/admin-car/${car.id}`}
          class="details-link"
        >
          Szczegóły
        </Link>
      </li>
    ))}
  </ul>
</div>

    </LayoutAdmin>
  );
}

export default CarManagement;
