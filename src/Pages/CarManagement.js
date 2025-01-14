import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CarManagement() {
  const [cars, setCars] = useState([]);
  const [newCar, setNewCar] = useState({
    id: '',
    car_type_id: 1, 
    year: '',
    color: '',
    price_per_day: '',
    status: 'available',
  });
  const [editCarId, setEditCarId] = useState(null);
  const [editCarData, setEditCarData] = useState({});

  const token = localStorage.getItem('token');

  // 1. Pobranie listy samochodów
  const fetchCars = async () => {
    try {
      const res = await axios.get('http://localhost:8080/cars/all');
      setCars(res.data);
    } catch (err) {
      console.error('Błąd przy pobieraniu listy samochodów:', err);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

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

  // 3. Rozpoczęcie edycji
  const startEdit = (car) => {
    setEditCarId(car.id);
    setEditCarData({ ...car });
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

  return (
    <div>
      <h2>Zarządzanie samochodami</h2>

      {/* FORMULARZ DODAWANIA */}
      <form onSubmit={handleAddCar}>
        <h3>Dodaj samochód</h3>
        <label>ID (np. unikalny VIN):</label>
        <input
          type="text"
          name="id"
          value={newCar.id}
          onChange={handleNewCarChange}
          required
        />
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
                <b>{car.id}</b> ({car.color}, {car.price_per_day} zł/dzień) [{car.status}]
                <button onClick={() => startEdit(car)}>Edytuj</button>
                <button onClick={() => handleDeleteCar(car.id)}>Usuń</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CarManagement;
