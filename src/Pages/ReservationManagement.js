import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LayoutAdmin from '../Components/Layout-admin';
import { Link } from 'react-router-dom';

function ReservationsManagement() {
  const [reservations, setReservations] = useState([]);
  const [userID, setUserID] = useState(null);
  const [reservationID, setReservationID] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token') || '';

  /*useEffect(() => {
    fetchAllReservations();
  }, []);*/

  const fetchAllReservations = async () => {
    try {
      const res = await axios.get('http://localhost:8080/reservation/all', {
        headers: { Authorization: token },
      });
      setReservations(res.data);
    } catch (err) {
      console.error('Błąd przy pobieraniu rezerwacji:', err);
    }
  };

  const searchByUser = async () => {
    if (!userID) return;
    try {
      const res = await axios.get(
        `http://localhost:8080/reservation/user/${userID}`,
        { headers: { Authorization: token } }
      );
      setReservations(res.data);
      setError('');
    } catch (err) {
      console.error('Błąd przy pobieraniu historii serwisowej:', err);
      setError('Nie udało się pobrać historii');
    }
  };

    return (
      <LayoutAdmin>
        <div className="admin-reservations-page">
          <h2>Zarządzaj rezerwacjami</h2>
          <div className="search-container">
            <label>
              ID użytkownika:
              <input
                type="text"
                value={userID}
                onChange={(e) => setUserID(e.target.value)}
              />
            </label>
            <button onClick={searchByUser}>Wyszukaj</button>
            <button onClick={fetchAllReservations}>Wyszukaj wszystkich</button>
          </div>
          <ul className="reservation-list">
            {reservations.map((r) => (
              <li key={r.id} className="reservation-item">
                <div className="reservation-info">
                  <strong>ID: {r.id}</strong>, 
                  Użytkownik: {r.user?.name} {r.user?.surname}, 
                  Samochód: {r.car?.id}, 
                  Status: {r.status}
                </div>
                <div>
                  <Link to={`/admin/reservation/${r.id}`} className="reservation-details-link">
                    Szczegóły
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </LayoutAdmin>
    );

}

export default ReservationsManagement;
