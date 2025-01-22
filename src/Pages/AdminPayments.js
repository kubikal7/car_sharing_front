import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LayoutAdmin from '../Components/Layout-admin';

function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');
  const [userID, setUserID] = useState(null);
  const token = localStorage.getItem('token') || '';

  const fetchPayments = async () => {
    try {
      const res = await axios.get('http://localhost:8080/payment/all', {  //GET /payment/all
        headers: { Authorization: token }
      });
      setPayments(res.data);
    } catch (err) {
      console.error('błąd przy pobieraniu płatności:', err);
      setError('nie udało się pobrać płatnoścci');
    }
  };

  /*useEffect(() => {
    fetchPayments();
  }, [token]);*/

  const searchByUser = async () => {
    if (!userID) return;
    try {
      const res = await axios.get(
        `http://localhost:8080/payment/user/${userID}`,
        { headers: { Authorization: token } }
      );
      setPayments(res.data);
      setError('');
    } catch (err) {
      console.error('Błąd przy pobieraniu historii serwisowej:', err);
      setError('Nie udało się pobrać historii');
    }
  };

  return (
    <LayoutAdmin>
      <h2>Płatności</h2>
      <div className="search-container">
        <label>
          ID użytkownika:
          <input
            type="text"
            value={userID}
            onChange={(e) => setUserID(e.target.value)}
          />
        </label>
        <button onClick={searchByUser}>Wyszukaj</button>
        <button onClick={fetchPayments}>Wyszukaj wszystkich</button>
      </div>
      {error && <p 
      style={{ color: 'red' }}>{error}
      </p>}

      {payments.length === 0 ? (<p>Brak płatności.</p>) : 
      (
        <ul>
          {payments.map((pay) => (
            <li key={pay.id}>
              <strong>ID płatności:</strong> {pay.id},{' '}
              <strong>Data:</strong> {pay.date},{' '}
              <strong>Typ płatności:</strong> {pay.type}
              
              {pay.detailsOfTransaction && (
                <>
                  , <strong>ID transakcji:</strong> {pay.detailsOfTransaction.id}
                  , <strong>Kwota:</strong> {pay.detailsOfTransaction.price} zł
                </>
              )}

              {pay.user && (
                <>
                  , <strong>Użytkownik:</strong> {pay.user.name} {pay.user.surname}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </LayoutAdmin>
  );
}

export default AdminPayments;
