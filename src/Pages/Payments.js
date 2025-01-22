import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../Components/Layout';

function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token') || '';
    if (!token) {
      setError('Brak tokenu, zaloguj się najpierw.');
      setLoading(false);
      return;
    }

    const fetchUserRole = async () => {
      try {
        const userRes = await axios.get('http://localhost:8080/user/', {
          headers: { Authorization: token }
        });
        if (userRes.data && userRes.data.role === 'admin') {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error('Błąd przy pobieraniu usera (rola):', err);
        setError('Nie udało się pobrać danych zalogowanego użytkownika.');
      }
    };

    const fetchPayments = async (admin) => {
      try {
        const endpoint = admin 
          ? 'http://localhost:8080/payment/all'
          : 'http://localhost:8080/payment/user';

        const payRes = await axios.get(endpoint, {
          headers: { Authorization: token }
        });
        setPayments(payRes.data);
      } catch (err) {
        console.error('Błąd przy pobieraniu płatności:', err);
        setError('Błąd pobierania płatności.');
      } finally {
        setLoading(false);
      }
    };
    
    (async () => {
      await fetchUserRole();
      await fetchPayments(isAdmin);
    })();
  }, [isAdmin]);


  if (loading) {
    return (
      <Layout>
        <div>Ładowanie płatności...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div style={{ color: 'red' }}>{error}</div>
      </Layout>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <Layout>
        <h1>Płatności</h1>
        <div>Brak płatności do wyświetlenia.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1>Płatności</h1>
      <p>{isAdmin ? 'Widok administratora (wszystkie płatności).' : 'Widok użytkownika (tylko Twoje płatności).'}</p>

      <ul>
        {payments.map((p) => (
          <li key={p.id} style={{ marginBottom: '0.5rem' }}>
            <div>
              <strong>ID płatności:</strong> {p.id} 
            </div>
            <div>
              <strong>Data:</strong> {p.date}
            </div>
            <div>
              <strong>Typ płatności:</strong> {p.type} 
            </div>

            {/* bo kwwota w detailsOfTransaction.price */}
            {p.detailsOfTransaction && (
              <div>
                <strong>Kwota (price z rezerwacji):</strong> {p.detailsOfTransaction.price} zł
              </div>
            )}

            {/* dodatkowe info do jakiej transakcji należy płatność */}
            {p.detailsOfTransaction && (
              <div>
                <em>(Transakcja #{p.detailsOfTransaction.id}, od {p.detailsOfTransaction.startDate} do {p.detailsOfTransaction.endDate})</em>
              </div>
            )}

            {/* kto zapłacił */}
            {p.user && (
              <div>
                <strong>Płacący użytkownik:</strong> {p.user.name} {p.user.surname}
              </div>
            )}
          </li>
        ))}
      </ul>
    </Layout>
  );
}

export default Payments;
