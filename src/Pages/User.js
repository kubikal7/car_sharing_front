import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../Components/Layout';
import { Link } from 'react-router-dom';
import "../Styles/User.css"

function User() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    surname: '',
    email: '',
    date_of_birth: '',
    country: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token') || '';

    if (!token) {
      setError('Nie ma tokenu! Musisz być zalogowany.');
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/user/', {
          headers: { Authorization: token },
        });
        setUserData(response.data);
        setEditData({
          name: response.data.name,
          surname: response.data.surname,
          email: response.data.email,
          date_of_birth: response.data.date_of_birth,
          country: response.data.country,
        });
      } catch (err) {
        setError('Błąd podczas pobierania danych użytkownika.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserReservations = async () => {
      try {
        const res = await axios.get('http://localhost:8080/reservation/user/reservations', {
          headers: { Authorization: token },
        });
        setReservations(res.data);
      } catch (err) {
        console.error('Błąd pobierania rezerwacji:', err);
      }
    };

    fetchUserData();
    fetchUserReservations();
  }, []);

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem('token') || '';
    try {
      await axios.put(
        `http://localhost:8080/user/modify/${userData.id}`,
        editData,
        { headers: { Authorization: token } }
      );
      alert('Zmiany zostały zapisane!');
      setUserData({ ...userData, ...editData });
      setEditMode(false);
    } catch (err) {
      console.error('Błąd zapisywania zmian:', err);
      alert('Nie udało się zapisać zmian.');
    }
  };

  if (loading) {
    return <div>Ładowanie...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!userData) {
    return <div>Brak danych użytkownika.</div>;
  }

  return (
    <Layout>
      <div className="user-info-container">
        <h1>Informacje o użytkowniku</h1>
        {editMode ? (
          <div>
            <label>
              Imię:
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Nazwisko:
              <input
                type="text"
                name="surname"
                value={editData.surname}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Data urodzenia:
              <input
                type="date"
                name="date_of_birth"
                value={editData.date_of_birth}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Kraj:
              <input
                type="text"
                name="country"
                value={editData.country}
                onChange={handleInputChange}
              />
            </label>
            <button onClick={handleSaveChanges}>Zapisz zmiany</button>
            <button onClick={handleEditToggle}>Anuluj</button>
          </div>
        ) : (
          <div>
            <p><strong>Imię:</strong> {userData.name}</p>
            <p><strong>Nazwisko:</strong> {userData.surname}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Data urodzenia:</strong> {userData.date_of_birth}</p>
            <p><strong>Kraj:</strong> {userData.country}</p>
            <button onClick={handleEditToggle}>Edytuj dane</button>
          </div>
        )}
      </div>

      <div className="reservations-container">
        <h2>Moje rezerwacje</h2>
        {reservations.length === 0 ? (
          <p>Brak rezerwacji.</p>
        ) : (
          <ul>
            {reservations.map((res) => (
              <li key={res.id}>
                <strong>ID rezerwacji:</strong> {res.id},
                <strong> Samochód:</strong> {res.car?.id}
                <Link to={`/user/reservation/${res.id}`}>Szczegóły</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}

export default User;
