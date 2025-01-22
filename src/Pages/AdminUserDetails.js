// src/Pages/AdminUserDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import LayoutAdmin from '../Components/Layout-admin';

function AdminUserDetails() {
  const { userId } = useParams();
  const token = localStorage.getItem('token') || '';

  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    country: '',
    date_of_birth: '',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/user/all`, {
        headers: { Authorization: token },
      });
      const found = res.data.find((u) => u.id === Number(userId));
      if (!found) {
        setError('Nie znaleziono użytkownika o ID=' + userId);
      } else {
        setUserData(found);
      }
    } catch (err) {
      console.error('Błąd pobierania usera:', err);
      setError('Nie udało się pobrać użytkownika');
    }
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`http://localhost:8080/user/delete/${userId}`, {
        headers: { Authorization: token },
      });
      alert('Użytkownik usunięty!');
      // Możesz przekierować na listę
      window.location.href = '/admin-users';
    } catch (err) {
      console.error('Błąd przy usuwaniu użytkownika:', err);
      alert('Nie udało się usunąć użytkownika.');
    }
  };

  const startEditing = () => {
    setEditMode(true);
    // wypełniamy formData danymi usera
    setFormData({
      name: userData.name,
      surname: userData.surname,
      email: userData.email,
      password: '', // hasło puste, jeśli chcesz wymagać nowego
      country: userData.country,
      date_of_birth: userData.date_of_birth,
    });
  };

  const cancelEditing = () => {
    setEditMode(false);
    setFormData({
      name: '',
      surname: '',
      email: '',
      password: '',
      country: '',
      date_of_birth: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8080/user/modify/${userId}`,
        formData,
        { headers: { Authorization: token } }
      );
      alert('Użytkownik zaktualizowany!');
      setEditMode(false);
      // odśwież
      fetchUser();
    } catch (err) {
      console.error('Błąd przy aktualizacji użytkownika:', err);
      alert('Nie udało się zaktualizować użytkownika.');
    }
  };

  if (error) {
    return <LayoutAdmin><p style={{ color: 'red' }}>{error}</p></LayoutAdmin>;
  }
  if (!userData) {
    return <LayoutAdmin>Ładowanie danych użytkownika...</LayoutAdmin>;
  }

  return (
    <LayoutAdmin>
      <h2>Szczegóły użytkownika</h2>
      {!editMode ? (
        // Widok "podglądu" danych
        <div>
          <p><strong>ID:</strong> {userData.id}</p>
          <p><strong>Imię:</strong> {userData.name}</p>
          <p><strong>Nazwisko:</strong> {userData.surname}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Kraj:</strong> {userData.country}</p>
          <p><strong>Data urodzenia:</strong> {userData.date_of_birth}</p>
          <p><strong>Rola:</strong> {userData.role}</p>

          <button onClick={startEditing}>Edytuj</button>
          <button onClick={handleDeleteUser} style={{ marginLeft: '1rem' }}>
            Usuń
          </button>
        </div>
      ) : (
        // Widok edycji
        <form onSubmit={handleUpdateUser}>
          <div>
            <label>Imię:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Nazwisko:</label>
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Hasło:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Kraj:</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Data urodzenia:</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit">Zapisz</button>
          <button type="button" onClick={cancelEditing} style={{ marginLeft: '1rem' }}>
            Anuluj
          </button>
        </form>
      )}

      <Link to="/admin-users" style={{ display: 'inline-block', marginTop: '1rem' }}>
        Powrót do listy użytkowników
      </Link>
    </LayoutAdmin>
  );
}

export default AdminUserDetails;