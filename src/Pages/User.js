import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../Components/Layout';

function User() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Pobierz token z localStorage
    const token = localStorage.getItem('token') || '';

    if (!token) {
      setError('Nie ma tokenu! Musisz być zalogowany.');
      setLoading(false);
      return;
    }

    // Wyślij zapytanie GET do serwera z tokenem w nagłówku Authorization
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/user/', {
          headers: {
            'Authorization': token // Dodaj token do nagłówka
          },
        });
        setUserData(response.data); // Ustaw dane użytkownika
      } catch (err) {
        setError('Błąd podczas pobierania danych użytkownika.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData(); // Uruchom funkcję pobierania danych
  }, []); // Efekt jest wywoływany tylko raz, przy renderowaniu komponentu

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
        <div>
        <h1>Informacje o użytkowniku</h1>
        <p><strong>Imię:</strong> {userData.name}</p>
        <p><strong>Nazwisko:</strong> {userData.surname}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Data urodzenia:</strong> {userData.date_of_birth}</p>
        <p><strong>Kraj:</strong> {userData.country}</p>
        <p><strong>Rola:</strong> {userData.role}</p>
        </div>
    </Layout>
  );
}

export default User;