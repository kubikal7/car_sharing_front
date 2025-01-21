import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LayoutAdmin from '../Components/Layout-admin';
import { Link } from 'react-router-dom';

function ReservationsManagement() {
  const [reservations, setReservations] = useState([]);
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    fetchAllReservations();
  }, []);

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

  return (
    <LayoutAdmin>
      <h2>Zarządzaj rezerwacjami</h2>
      {reservations.length === 0 ? (
        <p>Brak rezerwacji.</p>
      ) : (
        <ul>
          {reservations.map((r) => (
            <li key={r.id}>
              <strong>ID:</strong> {r.id},
              <strong> Użytkownik:</strong> {r.user?.name} {r.user?.surname},
              <strong> Samochód:</strong> {r.car?.id},
              <strong> Status:</strong> {r.status}
              {/* szczegóły */}
              {' '}
              <Link to={`/admin/reservation/${r.id}`}>Szczegóły</Link>
            </li>
          ))}
        </ul>
      )}
    </LayoutAdmin>
  );
}

export default ReservationsManagement;
