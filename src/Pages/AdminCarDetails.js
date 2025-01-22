// src/Pages/AdminCarDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import LayoutAdmin from '../Components/Layout-admin';
import "../Styles/AdminCarDetails.css"

function AdminCarDetails() {
  const { id } = useParams(); // nr rejestracyjny
  const [car, setCar] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [carTypes, setCarTypes] = useState([]);
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    fetchCar();
    fetchCarTypes();
  }, [id]);

  const fetchCar = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/cars/${id}`);
      setCar(res.data);
    } catch (err) {
      console.error('Błąd przy pobieraniu samochodu:', err);
    }
  };

  const fetchCarTypes = async () => {
    try {
      const res = await axios.get('http://localhost:8080/cartype/all');
      setCarTypes(res.data);
    } catch (err) {
      console.error('Błąd przy pobieraniu typów:', err);
    }
  };

  const handleDeleteCar = async () => {
    try {
      await axios.delete(`http://localhost:8080/cars/${id}`, {
        headers: { Authorization: token },
      });
      alert('Samochód usunięty!');
      window.location.href = '/admin-cars';
    } catch (err) {
      console.error('Błąd usuwania samochodu:', err);
      alert('Nie udało się usunąć');
    }
  };

  const startEditing = () => {
    if (!car) return;
    setEditMode(true);
    setFormData({
      car_type_id: car.carType?.id || '',
      year: car.year,
      color: car.color,
      price_per_day: car.price_per_day,
      status: car.status,
    });
  };

  const cancelEditing = () => {
    setEditMode(false);
    setFormData({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateCar = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8080/cars/${id}`,
        formData,
        { headers: { Authorization: token } }
      );
      alert('Zaktualizowano!');
      setEditMode(false);
      fetchCar();
    } catch (err) {
      console.error('Błąd aktualizacji:', err);
      alert('Nie udało się zaktualizować');
    }
  };

  if (!car) {
    return <LayoutAdmin>Ładowanie...</LayoutAdmin>;
  }

  return (
    <LayoutAdmin>
      <div className="car-details">
  <h2>Szczegóły samochodu</h2>
  {!editMode ? (
    <div>
      <p>
        <strong>Numer rej.:</strong> {car.id}
      </p>
      {car.carType && (
        <p>
          <strong>Typ:</strong> {car.carType.brand}, {car.carType.model}, {car.carType.nrOfSeats} miejsc
        </p>
      )}
      <p>
        <strong>Rok:</strong> {car.year}
      </p>
      <p>
        <strong>Kolor:</strong> {car.color}
      </p>
      <p>
        <strong>Cena / dzień:</strong> {car.price_per_day} zł
      </p>
      <p>
        <strong>Status:</strong> {car.status}
      </p>

      <button onClick={startEditing}>Edytuj</button>
      <button onClick={handleDeleteCar} className="delete-button">
        Usuń
      </button>
    </div>
  ) : (
    <form onSubmit={handleUpdateCar}>
      <div>
        <label>Typ (car_type_id):</label>
        <select
          name="car_type_id"
          value={formData.car_type_id}
          onChange={handleChange}
        >
          {carTypes.map((ct) => (
            <option key={ct.id} value={ct.id}>
              {ct.brand},{ct.model},{ct.nrOfSeats}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Rok:</label>
        <input
          type="number"
          name="year"
          value={formData.year}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Kolor:</label>
        <input
          type="text"
          name="color"
          value={formData.color}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Cena / dzień:</label>
        <input
          type="number"
          name="price_per_day"
          value={formData.price_per_day}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Status:</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="available">available</option>
          <option value="rent">rent</option>
          <option value="not">not</option>
        </select>
      </div>
      <button type="submit">Zapisz</button>
      <button type="button" onClick={cancelEditing} className="delete-button">
        Anuluj
      </button>
    </form>
  )}

  <Link to="/admin-cars" className="back-link">
    Powrót do listy
  </Link>
</div>
    </LayoutAdmin>
  );
}

export default AdminCarDetails;
