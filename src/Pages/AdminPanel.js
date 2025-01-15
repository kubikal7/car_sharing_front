import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../Components/Layout';

function AdminPanel() {
  const token = localStorage.getItem('token') || '';

  const [reservations, setReservations] = useState([]);
  const [cars, setCars] = useState([]);
  const [carTypes, setCarTypes] = useState([]);

  useEffect(() => {
    //wszystkie rezerwacje
    const fetchReservations = async () => {
      try {
        const res = await axios.get('http://localhost:8080/reservation/all', {
          headers: { Authorization: token }
        });
        setReservations(res.data);
      } catch (err) {
        console.error('Błąd pobierania rezerwacji:', err);
      }
    };

    //wszystkie samochody
    const fetchCars = async () => {
      try {
        const res = await axios.get('http://localhost:8080/cars/all', {
          headers: { Authorization: token }
        });
        setCars(res.data);
      } catch (err) {
        console.error('Błąd pobierania samochodów:', err);
      }
    };

    //wszystkie typy samochodów
    const fetchCarTypes = async () => {
      try {
        const res = await axios.get('http://localhost:8080/cartype/all', {
          headers: { Authorization: token }
        });
        setCarTypes(res.data);
      } catch (err) {
        console.error('Błąd pobierania typów samochodów:', err);
      }
    };

    fetchReservations();
    fetchCars();
    fetchCarTypes();
  }, [token]);

  return (
    <Layout>
      <h1>Panel Administratora</h1>

      {/* REZERWACJE */}
      <section style={{ marginTop: '2rem' }}>
        <h2>Wszystkie rezerwacje</h2>
        {reservations.length === 0 ? (
          <p>Brak rezerwacji.</p>
        ) : (
          <ul>
            {reservations.map((r) => (
              <li key={r.id}>
                ID: {r.id}, Użytkownik: {r.user?.name} {r.user?.surname},
                Samochód: {r.car?.id}, Od: {r.startDate}, Do: {r.endDate}, 
                Status: {r.status}, Cena: {r.price}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* SAMOCHODY */}
      <section style={{ marginTop: '2rem' }}>
        <h2>Wszystkie samochody</h2>
        {cars.length === 0 ? (
          <p>Brak samochodów.</p>
        ) : (
          <ul>
            {cars.map((c) => (
              <li key={c.id}>
                ID: {c.id}, Rok: {c.year}, Kolor: {c.color}, Cena/dzień: {c.price_per_day}, 
                Status: {c.status}
                {c.carType && (
                  <>,&nbsp;Typ: {c.carType.brand} {c.carType.model} ({c.carType.nrOfSeats} miejsc)</>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* TYPY SAMOCHODÓW */}
      <section style={{ marginTop: '2rem' }}>
        <h2>Wszystkie typy samochodów</h2>
        {carTypes.length === 0 ? (
          <p>Brak typów samochodów.</p>
        ) : (
          <ul>
            {carTypes.map((ct) => (
              <li key={ct.id}>
                ID typu: {ct.id}, {ct.brand} {ct.model}, miejsc: {ct.nrOfSeats}
              </li>
            ))}
          </ul>
        )}
      </section>
    </Layout>
  );
}

export default AdminPanel;
