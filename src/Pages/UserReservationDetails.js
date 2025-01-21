import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../Components/Layout';

function UserReservationDetails() {
  const { reservationId } = useParams();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        //WSZYSTKIE rezerwacje zalogowanego usera
        const res = await axios.get(
          'http://localhost:8080/reservation/user/reservations',
          {
            headers: { Authorization: token },
          }
        );
        //rezerwacjE o id = reservationId
        const found = res.data.find(
          (r) => r.id === Number(reservationId)
        );
        if (!found) {
          setError('Nie znaleziono rezerwacji o ID=' + reservationId);
        } else {
          setReservation(found);
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

  //ser płaci online
  const handlePayOnline = async () => {
    if (!reservation) return;
    try {
      await axios.post(
        `http://localhost:8080/payment/pay/${reservation.id}`,
        { type: 'ONLINE' },
        { headers: { Authorization: token } }
      );
      alert('Dziękujemy za płatność!');

      // odświeżamy rezerwacje payment != null
      const res = await axios.get(
        'http://localhost:8080/reservation/user/reservations',
        { headers: { Authorization: token } }
      );
      const updated = res.data.find(
        (r) => r.id === Number(reservationId)
      );
      setReservation(updated);
    } catch (err) {
      console.error(err);
      alert('Błąd przy płaceniu. Może już zapłacono?');
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

  //czy rezerwacja jest opłacona (payment != null)
  const isPaid = !!reservation.payment;
  return (
    <Layout>
      <h2>Szczegóły rezerwacji</h2>
      <p><strong>ID:</strong> {reservation.id}</p>
      <p><strong>Samochód:</strong> {reservation.car?.id}</p>
      <p><strong>Od:</strong> {reservation.startDate}</p>
      <p><strong>Do:</strong> {reservation.endDate}</p>
      <p><strong>Cena:</strong> {reservation.price} zł</p>
      <p><strong>Status:</strong> {reservation.status}</p>

      {isPaid ? (
        <div style={{ color: 'green' }}>
          <p><strong>OPŁACONE</strong></p>
          <p>Metoda płatności: {reservation.payment?.type}</p>
          <p>Data płatności: {reservation.payment?.date}</p>
        </div>
      ) : (
        <div style={{ color: 'red' }}>
          <p><strong>NIEOPŁACONE</strong></p>
          <button onClick={handlePayOnline}>
            Zapłać (online)
          </button>
        </div>
      )}
      <Link to="/user" style={{ marginTop: '1rem', display: 'inline-block' }}>
        Powrót do listy rezerwacji
      </Link>
    </Layout>
  );
}

export default UserReservationDetails;
