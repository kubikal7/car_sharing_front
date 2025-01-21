import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../Components/Layout';
import "../Styles/UserReservationDetails.css"

function UserReservationDetails() {
  const { reservationId } = useParams();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await axios.get(
          'http://localhost:8080/reservation/user/reservations',
          {
            headers: { Authorization: token },
          }
        );
        const found = res.data.find((r) => r.id === Number(reservationId));
        if (!found) {
          setError('Nie znaleziono rezerwacji o ID=' + reservationId);
        } else {
          setReservation(found);
          setNewStartDate(found.startDate || '');
          setNewEndDate(found.endDate || '');
        }
      } catch (err) {
        console.error(err);
        setError('Błąd przy pobieraniu Twoich rezerwacji');
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, [reservationId, token]);

  const handlePayOnline = async () => {
    if (!reservation) return;
    try {
      await axios.post(
        `http://localhost:8080/payment/pay/${reservation.id}`,
        { type: 'online' },
        { headers: { Authorization: token } }
      );
      alert('Dziękujemy za płatność!');

      const res = await axios.get(
        'http://localhost:8080/reservation/user/reservations',
        { headers: { Authorization: token } }
      );
      const updated = res.data.find((r) => r.id === Number(reservationId));
      setReservation(updated);
    } catch (err) {
      console.error(err);
      alert('Błąd przy płaceniu. Może już zapłacono?');
    }
  };

  // Funkcja do żądania zmiany daty
  const handleRequestDateChange = async () => {
    if (!reservation) return;
    try {
      await axios.put(
        `http://localhost:8080/reservation/modify/${reservation.id}`,
        { newStart: newStartDate, newEnd: newEndDate },
        { headers: { Authorization: token } }
      );
      alert('Zmieniono daty rezerwacji!');
      setReservation({
        ...reservation,
        startDate: newStartDate,
        endDate: newEndDate,
      });
    } catch (err) {
      console.error(err);
      alert('Błąd przy zmianie dat. Być może samochód nie jest dostępny.');
    }
  };

  if (loading) {
    return <Layout>Ładowanie...</Layout>;
  }
  if (error) {
    return (
      <Layout>
        <p style={{ color: 'red' }}>{error}</p>
      </Layout>
    );
  }
  if (!reservation) {
    return (
      <Layout>
        <p>Brak danych rezerwacji</p>
      </Layout>
    );
  }

  const isPaid = !!reservation.payment;
  return (
    <Layout>
      <div className="reservation-details-container">
        <h2>Szczegóły rezerwacji</h2>
        <p><span className="label">ID:</span> {reservation.id}</p>
        <p><span className="label">Samochód:</span> {reservation.car?.id}</p>
        <p><span className="label">Od:</span> {reservation.startDate}</p>
        <p><span className="label">Do:</span> {reservation.endDate}</p>
        <p><span className="label">Cena:</span> {reservation.price} zł</p>
        <p><span className="label">Status:</span> {reservation.status}</p>

        <div className={`payment-status ${isPaid ? 'paid' : 'unpaid'}`}>
          {isPaid ? (
            <>
              <p>OPŁACONE</p>
              <p>Metoda płatności: {reservation.payment?.type}</p>
              <p>Data płatności: {reservation.payment?.date}</p>
            </>
          ) : (
            <>
              <p>NIEOPŁACONE</p>
              <button onClick={handlePayOnline}>Zapłać (online)</button>
            </>
          )}
        </div>

        {/* Sekcja edycji dat */}
        {reservation.status !== 'canceled' && (
          <div className="edit-dates">
            <h3>Edytuj daty rezerwacji</h3>
            <label>
              Nowa data rozpoczęcia:
              <input
                type="datetime-local"
                value={newStartDate}
                onChange={(e) => setNewStartDate(e.target.value)}
              />
            </label>
            <br />
            <label>
              Nowa data zakończenia:
              <input
                type="datetime-local"
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
              />
            </label>
            <br />
            <button onClick={handleRequestDateChange}>Zmień daty</button>
          </div>
        )}

        <Link to="/user" className="back-link">
          Powrót do listy rezerwacji
        </Link>
      </div>
    </Layout>
  );
}

export default UserReservationDetails;
