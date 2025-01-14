import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ReservationsManagement() {
  const [reservations, setReservations] = useState([]);
  const token = localStorage.getItem('token');

  // 1. Pobierz wszystkie rezerwacje (endpoint np. GET /reservation/all)
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

  useEffect(() => {
    fetchAllReservations();
  }, []);

  // 2. Anuluj rezerwację
  const handleCancel = async (resId) => {
    try {
      await axios.put(`http://localhost:8080/reservation/cancel/${resId}`, null, {
        headers: { Authorization: token },
      });
      alert('Rezerwacja anulowana!');
      fetchAllReservations();
    } catch (err) {
      console.error('Błąd przy anulowaniu rezerwacji:', err);
      alert('Nie udało się anulować rezerwacji.');
    }
  };

  return (
    <div>
      <h2>Zarządzaj rezerwacjami</h2>
      {reservations.length === 0 ? (
        <p>Brak rezerwacji.</p>
      ) : (
        <ul>
          {reservations.map((r) => (
            <li key={r.id}>
              ID: {r.id}, Użytkownik: {r.user?.name} {r.user?.surname},
              Samochód: {r.car?.id},
              Od: {r.startDate}, Do: {r.endDate}, Status: {r.status}
              {r.status !== 'canceled' && (
                <button onClick={() => handleCancel(r.id)}>Anuluj</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ReservationsManagement;
