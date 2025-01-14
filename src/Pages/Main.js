import React, { useState } from 'react';
import axios from 'axios';
import Layout from '../Components/Layout';

function Main() {
  const [searchDates, setSearchDates] = useState({
    startDate: '',
    endDate: ''
  });
  const [availableCars, setAvailableCars] = useState([]);
  const [error, setError] = useState('');

  // Zmiana pól startDate i endDate w formularzu
  const handleSearchDatesChange = (e) => {
    const { name, value } = e.target;
    setSearchDates((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Wyszukiwanie dostępnych samochodów
  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
   const startWithSeconds = searchDates.startDate.length === 16 
     ? searchDates.startDate + ':00' 
     : searchDates.startDate;
   const endWithSeconds = searchDates.endDate.length === 16 
     ? searchDates.endDate + ':00' 
     : searchDates.endDate;
    try {
     const response = await axios.post({
         method: 'GET',
         url: 'http://localhost:8080/availability/available',
         headers: {
           'Content-Type': 'application/json'
         },
         data: {
           startDate: startWithSeconds,
           endDate: endWithSeconds
         }
       });
      setAvailableCars(response.data);
    } catch (err) {
      console.error(err);
      setError('Nie znaleziono dostępnych samochodów lub błąd serwera.');
    }
  };

  // Rezerwacja wybranego samochodu
  const handleReserve = async (carId) => {
    const token = localStorage.getItem('token') || '';
    if (!token) {
      alert('Musisz być zalogowany, żeby rezerwować samochody.');
      return;
    }
    const startWithSeconds = searchDates.startDate.length === 16 
      ? searchDates.startDate + ':00' 
      : searchDates.startDate;
    const endWithSeconds = searchDates.endDate.length === 16 
      ? searchDates.endDate + ':00' 
      : searchDates.endDate;

    try {
      const res = await axios.post(
          'http://localhost:8080/reservation/reserve',
          {
            carId: carId,
            startDate: startWithSeconds,
            endDate: endWithSeconds
          },
          {
            headers: { Authorization: token }
          }
        );
      if (res.status === 200) {
        alert('Rezerwacja zakończona sukcesem!');
      }
    } catch (err) {
      console.error(err);
      alert('Nie udało się zarezerwować. Być może ktoś Cię ubiegł.');
    }
  };

  return (
    <Layout>
      <h2>Strona główna</h2>
      <p>Wyszukaj dostępne samochody w podanym terminie:</p>

      {/* Formularz do podania dat */}
      <form onSubmit={handleSearch}>
        <div>
          <label>Data początkowa (LocalDateTime):</label>
          <input
            type="datetime-local"
            name="startDate"
            value={searchDates.startDate}
            onChange={handleSearchDatesChange}
            required
          />
        </div>
        <div>
          <label>Data końcowa (LocalDateTime):</label>
          <input
            type="datetime-local"
            name="endDate"
            value={searchDates.endDate}
            onChange={handleSearchDatesChange}
            required
          />
        </div>
        <button type="submit">Szukaj samochodów</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Wyświetlanie dostępnych samochodów */}
      {availableCars.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Dostępne samochody:</h3>
          <ul>
            {availableCars.map((car) => (
              <li key={car.id}>
                ID: {car.id}, kolor: {car.color}, rok: {car.year}, cena/dzień: {car.price_per_day}
                &nbsp;
                <button onClick={() => handleReserve(car.id)}>Rezerwuj</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Layout>
  );
}
export default Main;
