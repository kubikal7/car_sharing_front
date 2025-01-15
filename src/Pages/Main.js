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

  // zmiana startDate i endDate 
  const handleSearchDatesChange = (e) => {
    const { name, value } = e.target;
    setSearchDates((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  //wyszukiwanie dostępnych samochodów
  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
   
    try {
      const response = await axios.get('http://localhost:8080/availability/available', {
        params: searchDates,
      });
      setAvailableCars(response.data);
    } catch (err) {
      console.error(err);
      setError('Nie znaleziono dostępnych samochodów lub błąd serwera.');
    }
  };

  // rezerwacja wybranego samochodu
  const handleReserve = async (carId) => {
    const token = localStorage.getItem('token') || '';
    if (!token) {
      alert('Musisz być zalogowany, żeby rezerwować samochody.');
      return;
    }

    try {
      const res = await axios.post(
          'http://localhost:8080/reservation/reserve',
          {
            carId: carId,
            startDate: searchDates.startDate,
            endDate: searchDates.endDate
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

      {/* podanie dat */}
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

      {/* dostępne samochody */}
      {availableCars.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Dostępne samochody:</h3>
          <ul>
            {availableCars.map((car) => (
              <li key={car.id}>
                ID: {car.id}, kolor: {car.color}, rok: {car.year}, cena/dzień: {car.price_per_day}
                {car.carType && (
                  <>
                    , typ: {car.carType.brand} {car.carType.model} ({car.carType.nrOfSeats} miejsc)
                  </>
                )}
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
