import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../Components/Layout';
import { Link } from 'react-router-dom';

function User() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const [reservations, setReservations] = useState([]);

  //przechowujemy dane do edycji (transakcja ID oraz nowe daty)
  const [editReservationId, setEditReservationId] = useState(null);
  const [editDates, setEditDates] = useState({ newStart: '', newEnd: '' });


  useEffect(() => {
    //token z localStorage
    const token = localStorage.getItem('token') || '';

    if (!token) {
      setError('Nie ma tokenu! Musisz być zalogowany.');
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/user/', {
          headers: {
            'Authorization': token //Dodaj token do nagłówka
          },
        });
        setUserData(response.data); //Ustaw dane użytkownika
      } catch (err) {
        setError('Błąd podczas pobierania danych użytkownika.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    //rezerwacje użytkownika
    const fetchUserReservations = async () => {
      try {
        const res = await axios.get('http://localhost:8080/reservation/user/reservations', {
          headers: { Authorization: token }
        });
        setReservations(res.data); //Zapisz rezerwacje w stanie
      } catch (err) {
        console.error('Błąd pobierania rezerwacji:', err);
      }
    };
    fetchUserData(); 
    fetchUserReservations(); 
  }, []);

     //OBSŁUGA EDYCJI REZERWACJI 
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditDates((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const startEditing = (reservationId) => {
    setEditReservationId(reservationId);
    setEditDates({ newStart: '', newEnd: '' });
  };

  const cancelEditing = () => {
    setEditReservationId(null);
    setEditDates({ newStart: '', newEnd: '' });
  };

  const handleSaveChanges = async (reservationId) => {
    const token = localStorage.getItem('token') || '';
    const newStartSeconds = editDates.newStart.length === 16
      ? editDates.newStart 
      : editDates.newStart;
    const newEndSeconds = editDates.newEnd.length === 16
      ? editDates.newEnd
      : editDates.newEnd;
    try {
      console.log({
        newStart: newStartSeconds,
        newEnd: newEndSeconds
      })
      await axios.put(
        `http://localhost:8080/reservation/modify/${reservationId}`,
        {
          newStart: newStartSeconds,
          newEnd: newEndSeconds
        },
        {
          headers: { Authorization: token }
        }
      );
      alert('Rezerwacja zaktualizowana!');
      // Odśwież listę
      const newList = await axios.get('http://localhost:8080/reservation/user/reservations', {
        headers: { Authorization: token }
      });
      setReservations(newList.data);
      setEditReservationId(null);
      setEditDates({ newStart: '', newEnd: '' });
    } catch (err) {
      console.error('Błąd przy edycji rezerwacji:', err);
      alert('Nie udało się zmodyfikować rezerwacji.');
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
        <div>
        <h1>Informacje o użytkowniku</h1>
        <p><strong>Imię:</strong> {userData.name}</p>
        <p><strong>Nazwisko:</strong> {userData.surname}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Data urodzenia:</strong> {userData.date_of_birth}</p>
        <p><strong>Kraj:</strong> {userData.country}</p>
        <p><strong>Rola:</strong> {userData.role}</p>
        </div>
         {/* Lista rezerwacji i edycja */}
      <div style={{ marginTop: '2rem' }}>
        <h2>Moje rezerwacje</h2>
        {reservations.length === 0 ? (
          <p>Brak rezerwacji.</p>
        ) : (
          <ul>
            {reservations.map((res) => (
              <li key={res.id}>
              <strong>ID rezerwacji:</strong> {res.id},
              <strong> Samochód:</strong> {res.car?.id} {/* skrót */}
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