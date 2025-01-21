import React, { useState } from 'react';
import axios from 'axios';
import LayoutAdmin from '../Components/Layout-admin';

function AdminServiceHistory() {
  const token = localStorage.getItem('token') || '';
  
  const [carId, setCarId] = useState('');
  const [serviceHistory, setServiceHistory] = useState([]);
  const [error, setError] = useState('');

  //dodania nowego wpisu
  const [carIdForAdd, setCarIdForAdd] = useState(''); 
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [problem, setProblem] = useState('');

  //historia dla carId
  const fetchServiceHistory = async () => {
    if (!carId) return;
    try {
      const res = await axios.get(
        `http://localhost:8080/service-history/car/${carId}`,
        { headers: { Authorization: token } }
      );
      setServiceHistory(res.data);
      setError('');
    } catch (err) {
      console.error('Błąd przy pobieraniu historii serwisowej:', err);
      setError('Nie udało się pobrać historii');
    }
  };

  //nowy wpis serwisowy
  const handleAddHistory = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:8080/service-history/add',
        {
          carId: carIdForAdd,  
          startDate: startDate,
          endDate: endDate,
          problem: problem,
        },
        { headers: { Authorization: token } }
      );
      alert('Dodano historię serwisową!');
      if (carIdForAdd === carId) {
        fetchServiceHistory();
      }

      setCarIdForAdd('');
      setStartDate('');
      setEndDate('');
      setProblem('');
    } catch (err) {
      console.error('Błąd przy dodawaniu historii:', err);
      alert('Nie udało się dodać historii');
    }
  };

  return (
    <LayoutAdmin>
      <h2>Historia serwisowa</h2>

      {/*pobieranie historii dla danej rejestracji */}
      <div>
        <label>Numer rejestracyjny (carId): </label>
        <input
          type="text"
          value={carId}
          onChange={(e) => setCarId(e.target.value)}
        />
        <button onClick={fetchServiceHistory}>Pobierz historię</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {serviceHistory.length > 0 && (
        <ul>
          {serviceHistory.map((item) => (
            <li key={item.id}>
              <strong>Start:</strong> {item.start_date},
              <strong> Koniec:</strong> {item.end_date},
              <strong> Problem:</strong> {item.problem}
            </li>
          ))}
        </ul>
      )}

      {/* dodawanie nowego wpisu */}
      <h3>Dodaj wpis serwisowy</h3>
      <form onSubmit={handleAddHistory}>
        <div>
          <label>Numer rejestracyjny (carId):</label>
          <input
            type="text"
            value={carIdForAdd}
            onChange={(e) => setCarIdForAdd(e.target.value)}
          />
        </div>
        <div>
          <label>Data startu:</label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label>Data końca:</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div>
          <label>Opis problemu:</label>
          <input
            type="text"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
          />
        </div>
        <button type="submit">Dodaj</button>
      </form>
    </LayoutAdmin>
  );
}

export default AdminServiceHistory;
