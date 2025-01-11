import React, { useState } from 'react';
import axios from 'axios';
import Layout from '../Components/Layout';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    country: '',
    date_of_birth: '',
    role: 'user',
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || '';
  }); 
  const [error, setError] = useState(null);

  // Obsługa zmiany danych w formularzu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Obsługa wysyłania formularza
  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:8080/auth/register',
        formData,
        {
          headers: {
            'Authorization': token || '', // Możesz ustawić pusty header na razie
          },
        }
      );

      if (response.status === 200) {
        alert('Rejestracja zakończona sukcesem!');
        // Możesz dodać logikę przekierowania po udanej rejestracji
      }
    } catch (error) {
      setError('Błąd rejestracji: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  /*const handleClick = async (e) => {
    console.log(formData);
  }*/

  return (
    <Layout>
      <h2>Rejestracja</h2>
      <form>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <label>
          Imię:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <br />

        <label>
          Nazwisko:
          <input
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            required
          />
        </label>
        <br />

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <br />

        <label>
          Hasło:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        <br />

        <label>
          Kraj:
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </label>
        <br />

        <label>
          Data urodzenia:
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            required
          />
        </label>
        <br />

        <button type="button" onClick={handleClick}>Zarejestruj się</button>
      </form>
    </Layout>
  );
}

export default Register;
