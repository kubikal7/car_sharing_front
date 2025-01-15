import React, { useState } from 'react';
import axios from 'axios';

function ClientPanel() {
  const [seats, setSeats] = useState(null); 
  const [price, setPrice] = useState(500); 
  const [cars, setCars] = useState([]);

  //kliknięcia przycisku liczby miejsc
  const handleSelectSeats = (val) => {
    setSeats(val);
  };

  //suwak ceny
  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  //wyszukaj auta
  const handleSearch = async () => {
    try {

      const res = await axios.get('http://localhost:8080/cars/all');
      let filtered = res.data;
      if (seats !== null) {
        filtered = filtered.filter((car) => {
          const nrSeats = car.carType ? car.carType.nrOfSeats : 0; 
          return seats === 5 ? nrSeats >= 5 : nrSeats === seats;
        });
      }
      filtered = filtered.filter((car) => car.price_per_day <= price);
      setCars(filtered);
    } catch (err) {
      console.error('Błąd przy pobieraniu aut:', err);
    }
  };

  return (
    <div>
      <h2>Panel Klienta - Filtrowanie</h2>
      <div>
        <p>Liczba miejsc</p>
        <button onClick={() => handleSelectSeats(1)}>1</button>
        <button onClick={() => handleSelectSeats(2)}>2</button>
        <button onClick={() => handleSelectSeats(3)}>3</button>
        <button onClick={() => handleSelectSeats(5)}>5+</button>
      </div>
      <div>
        <p>Cena: {price} zł</p>
        <input
          type="range"
          min="0"
          max="1000"
          step="50"
          value={price}
          onChange={handlePriceChange}
        />
      </div>
      <button onClick={handleSearch}>Szukaj</button>
      {cars.length === 0 ? (
        <p>Brak wyników / nie wyszukano jeszcze.</p>
      ) : (
        <ul>
          {cars.map((car) => (
            <li key={car.id}>
              {car.id} | Cena: {car.price_per_day} zł/dzień | Miejsc: 
              {car.carType ? car.carType.nrOfSeats : '?'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ClientPanel;
