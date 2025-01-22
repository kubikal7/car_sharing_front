import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import LayoutAdmin from '../Components/Layout-admin';
import "../Styles/AdminReservationDetails.css"

function AdminReservationDetails() {
  const { id } = useParams();
  const [reservation, setReservation] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:8080/reservation/all', {
          headers: { Authorization: token },
        });
        const found = res.data.find((r) => r.id === Number(id));
        if (!found) {
          setError('Nie znaleziono rezerwacji o ID=' + id);
        } else {
          setReservation(found);
          setNewStartDate(found.startDate || '');
          setNewEndDate(found.endDate || '');
        }
      } catch (err) {
        console.error(err);
        setError('Błąd przy pobieraniu rezerwacji.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, token]);

  // Anulowanie rezerwacji
  const handleCancel = async () => {
    if (!reservation) return;
    try {
      await axios.put(
        `http://localhost:8080/reservation/cancel/${reservation.id}`,
        null,
        { headers: { Authorization: token } }
      );
      alert('Rezerwacja anulowana!');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Błąd przy anulowaniu.');
    }
  };

  // Oznaczenie jako opłacone
  const handlePay = async (payType) => {
    if (!reservation) return;
    try {
      await axios.post(
        `http://localhost:8080/payment/pay/${reservation.id}`,
        { type: payType },
        { headers: { Authorization: token } }
      );
      alert('Rezerwacja opłacona metodą: ' + payType);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Błąd przy oznaczaniu płatności. Może już zapłacone?');
    }
  };

  // Aktualizacja dat
  const handleUpdateDates = async () => {
    if (!reservation) return;
    try {
      await axios.put(
        `http://localhost:8080/reservation/modify/${reservation.id}`,
        { newStart: newStartDate, newEnd: newEndDate },
        { headers: { Authorization: token } }
      );
      alert('Daty zaktualizowane!');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Błąd przy aktualizacji dat.');
    }
  };

  if (loading) {
    return <LayoutAdmin>Ładowanie...</LayoutAdmin>;
  }

  if (error) {
    return (
      <LayoutAdmin>
        <p style={{ color: 'red' }}>{error}</p>
      </LayoutAdmin>
    );
  }

  if (!reservation) {
    return <LayoutAdmin>Brak danych rezerwacji</LayoutAdmin>;
  }

  const isPaid = !!reservation.payment;

  return (
    <LayoutAdmin>
      <h2>Szczegóły rezerwacji</h2>
      <div class="reservation-details">
        <p><strong>ID:</strong> {reservation.id}</p>
        <p><strong>Użytkownik:</strong> {reservation.user?.name} {reservation.user?.surname}</p>
        <p><strong>Samochód:</strong> {reservation.car?.id}</p>
        <p><strong>Od:</strong> {reservation.startDate}</p>
        <p><strong>Do:</strong> {reservation.endDate}</p>
        <p><strong>Status:</strong> {reservation.status}</p>
        <p><strong>Cena:</strong> {reservation.price} zł</p>

        {isPaid ? (
          <div class="paid-status">
            <p><strong>OPŁACONE</strong></p>
            <p>Metoda płatności: {reservation.payment?.type}</p>
            <p>Data płatności: {reservation.payment?.date}</p>
          </div>
        ) : (
          <div class="unpaid-status">
            <p><strong>NIEOPŁACONE</strong></p>
            <button onClick={() => handlePay('cash')}>Oznacz jako opłacone (CASH)</button>
            <button onClick={() => handlePay('card')} style={{ marginLeft: '1rem' }}>
              Oznacz jako opłacone (CARD)
            </button>
          </div>
        )}

        {reservation.status !== 'canceled' && (
          <button onClick={handleCancel} class="cancel-button">
            Anuluj rezerwację
          </button>
        )}

        <div class="edit-dates">
          <h3>Edytuj daty rezerwacji</h3>
          <label>
            Nowa data rozpoczęcia:
            <input
              type="datetime-local"
              value={newStartDate}
              onChange={(e) => setNewStartDate(e.target.value)}
              class="datetime-input"
            />
          </label>
          <br />
          <label>
            Nowa data zakończenia:
            <input
              type="datetime-local"
              value={newEndDate}
              onChange={(e) => setNewEndDate(e.target.value)}
              class="datetime-input"
            />
          </label>
          <br />
          <button
            onClick={handleUpdateDates}
            class="save-button"
          >
            Zapisz zmiany
          </button>
        </div>

        <Link to="/admin-reservations" class="back-link">
          Powrót do listy
        </Link>
      </div>

    </LayoutAdmin>
  );
}

export default AdminReservationDetails;
