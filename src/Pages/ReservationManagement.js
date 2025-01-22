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
        <div className="admin-reservations-page">
          <h2>Zarządzaj rezerwacjami</h2>
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
