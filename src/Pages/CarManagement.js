import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LayoutAdmin from '../Components/Layout-admin';
import { checkAdminStatus } from '../Scripts/checkAdmin';

function CarManagement() {
  const [cars, setCars] = useState([]);
  const [newCar, setNewCar] = useState({
    id: '',
    car_type_id: 0, 
    year: '',
    color: '',
    price_per_day: '',
    status: 'available',
  });
  const [editCarId, setEditCarId] = useState(null);
  const [editCarData, setEditCarData] = useState({
    car_type_id: 1, 
    year: '',
    color: '',
    price_per_day: '',
    status: 'available',
  });

  const [carTypes, setCarTypes] = useState([]);
  const [newCarType, setNewCarType] = useState({ 
    brand: '',
    model: '',
    nrOfSeats: 5,
  });
  const [editCarTypeID, setEditCarTypeID] = useState(null);
  const [editCarTypeData, setEditCarTypeData] = useState({});

  const token = localStorage.getItem('token');

  const [isAdmin, setIsAdmin] = useState(null);
  useEffect(() => {
    (async () => {
      setIsAdmin(await checkAdminStatus(token) ? true : false);
    })();
  }, [token]);

  // 1. Pobranie listy samochodów
  const fetchCars = async () => {
    try {
      const res = await axios.get('http://localhost:8080/cars/all');
      setCars(res.data);
    } catch (err) {
      console.error('Błąd przy pobieraniu listy samochodów:', err);
    }
  };
  const fetchCarsTypes = async () => {
    try {
      const res = await axios.get('http://localhost:8080/cartype/all');
      setCarTypes(res.data);
    } catch (err) {
      console.error('Błąd przy pobieraniu listy samochodów:', err);
    }
  };

  useEffect(() => {
    if (isAdmin === null || isAdmin === false) return;
    fetchCars();
    fetchCarsTypes();
  }, [isAdmin]);

  // 2. Dodawanie nowego samochodu
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
      fetchCars(); // odśwież listę
    } catch (err) {
      console.error('Błąd przy dodawaniu samochodu:', err);
      alert('Nie udało się dodać samochodu.');
    }
  };

  const handleNewCarTypeChange = (e) => {
    const { name, value } = e.target;
    setNewCarType((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCarType = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:8080/cartype/add',
        newCarType,
        { headers: { Authorization: token } }
      );
      alert('Samochód dodany!');
      fetchCarsTypes(); // odśwież listę
    } catch (err) {
      console.error('Błąd przy dodawaniu typu samochodu:', err);
      alert('Nie udało się dodać typu samochodu.');
    }
  };

  // 3. Rozpoczęcie edycji
  const startEdit = (car) => {
    setEditCarId(car.id);
    setEditCarData((prev) => ({
      ...prev, // Kopiowanie poprzedniego stanu
      car_type_id: car.carType.id, // Nadpisanie tylko car_type_id
      year: car.year, // Nadpisanie year
      color: car.color, // Nadpisanie color
      price_per_day: car.price_per_day, // Nadpisanie price_per_day
      status: car.status, // Nadpisanie status
    }));
  };

  const startEditType = (carType) => {
    setEditCarTypeID(carType.id);
    setEditCarTypeData({ ...carType });
  };

  // 4. Zmiana pól edytowanego samochodu
  const handleEditCarChange = (e) => {
    const { name, value } = e.target;
    setEditCarData((prev) => ({ ...prev, [name]: value }));
  };

  // 5. Zatwierdzenie edycji
  const handleUpdateCar = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8080/cars/${editCarId}`,
        editCarData,
        { headers: { Authorization: token } }
      );
      alert('Samochód zaktualizowany!');
      setEditCarId(null);
      fetchCars();
    } catch (err) {
      console.error('Błąd przy aktualizacji samochodu:', err);
      alert('Nie udało się zaktualizować samochodu.');
    }
  };

  const handleEditCarTypeChange = (e) => {
    const { name, value } = e.target;
    setEditCarTypeData((prev) => ({ ...prev, [name]: value }));
  };

  // 5. Zatwierdzenie edycji
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
      fetchCarsTypes();
    } catch (err) {
      console.error('Błąd przy aktualizacji typu samochodu:', err);
      alert('Nie udało się zaktualizować typu samochodu.');
    }
  };

  // 6. Usuwanie samochodu
  const handleDeleteCar = async (carId) => {
    try {
      await axios.delete(`http://localhost:8080/cars/${carId}`, {
        headers: { Authorization: token },
      });
      alert('Samochód usunięty!');
      fetchCars();
    } catch (err) {
      console.error('Błąd przy usuwaniu samochodu:', err);
      alert('Nie udało się usunąć samochodu.');
    }
  };

  const handleDeleteCarType = async (carTypeID) => {
    try {
      await axios.delete(`http://localhost:8080/cartype/${carTypeID}`, {
        headers: { Authorization: token },
      });
      alert('Typ samochodu usunięty!');
      fetchCarsTypes();
    } catch (err) {
      console.error('Błąd przy usuwaniu typu samochodu:', err);
      alert('Nie udało się usunąć typu samochodu.');
    }
  };

  return (
    <LayoutAdmin>
      <h2>Zarządzanie samochodami</h2>

      {/* FORMULARZ DODAWANIA */}
      <form onSubmit={handleAddCarType}>
        <h3>Dodaj typ samochodu</h3>
        <label>Brand:</label>
        <input
          type="text"
          name="brand"
          value={newCar.brand}
          onChange={handleNewCarTypeChange}
        />
        <label>Model:</label>
        <input
          type="text"
          name="model"
          value={newCar.model}
          onChange={handleNewCarTypeChange}
        />
        <label>Liczba miejsc:</label>
        <input
          type="number"
          name="nrOfSeats"
          value={newCar.nrOfSeats}
          onChange={handleNewCarTypeChange}
        />
        <button type="submit">Dodaj</button>
      </form>

      {/* LISTA SAMOCHODÓW i EDYCJA */}
      <h3>Lista typów samochodów</h3>
      <ul>
        {carTypes.map((carType) => (
          <li key={carType.id}>
            {editCarTypeID === carType.id ? (
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
                <button onClick={() => setEditCarTypeID(null)}>Anuluj</button>
              </form>
            ) : (
              <>
                <b>{carType.id}</b> {carType.brand}, {carType.model}, {carType.nrOfSeats}
                <button onClick={() => startEditType(carType)}>Edytuj</button>
                <button onClick={() => handleDeleteCarType(carType.id)}>Usuń</button>
              </>
            )}
          </li>
        ))}
      </ul>

      

      {/* FORMULARZ DODAWANIA */}
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
          {carTypes.map((carType) => (
            <option key={carType.id} value={carType.id}>{carType.brand},{carType.model},{carType.nrOfSeats}</option>
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

      {/* LISTA SAMOCHODÓW i EDYCJA */}
      <h3>Lista samochodów</h3>
      <ul>
        {cars.map((car) => (
          <li key={car.id}>
            {editCarId === car.id ? (
              <form onSubmit={handleUpdateCar}>
                <select
                  name="car_type_id"
                  value={editCarData.car_type_id}
                  onChange={handleEditCarChange}
                >
                  {carTypes.map((carType) => (
                    <option key={carType.id} value={carType.id}>{carType.brand},{carType.model},{carType.nrOfSeats}</option>
                  ))}
                </select>
                <input
                  type="number"
                  name="year"
                  value={editCarData.year}
                  onChange={handleEditCarChange}
                />
                <input
                  type="text"
                  name="color"
                  value={editCarData.color}
                  onChange={handleEditCarChange}
                />
                <input
                  type="number"
                  name="price_per_day"
                  value={editCarData.price_per_day}
                  onChange={handleEditCarChange}
                />
                <select
                  name="status"
                  value={editCarData.status}
                  onChange={handleEditCarChange}
                >
                  <option value="available">available</option>
                  <option value="rent">rent</option>
                  <option value="not">not</option>
                </select>
                <button type="submit">Zapisz</button>
                <button onClick={() => setEditCarId(null)}>Anuluj</button>
              </form>
            ) : (
              <>
                <b>{car.id}</b> {car.carType.brand}, {car.carType.model}, {car.carType.nrOfSeats}, {car.year}, {car.color}, {car.price_per_day} zł/dzień [{car.status}]
                <button onClick={() => startEdit(car)}>Edytuj</button>
                <button onClick={() => handleDeleteCar(car.id)}>Usuń</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </LayoutAdmin>
  );
}

export default CarManagement;
