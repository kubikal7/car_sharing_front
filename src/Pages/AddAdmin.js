import React, { useState } from 'react';
import axios from 'axios';
import LayoutAdmin from '../Components/Layout-admin';

function AddAdmin() {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    country: 'CarSharing',
    date_of_birth: '1900-01-01',
    role: 'admin',
  });

  const token = localStorage.getItem('token') || "";

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
            'Authorization': token, // Możesz ustawić pusty header na razie
          },
        }
      );

      if (response.status === 200) {
        alert('Rejestracja zakończona sukcesem!');
        // Możesz dodać logikę przekierowania po udanej rejestracji
      }
    } catch (error) {
      alert('Błąd rejestracji: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  /*const handleClick = async (e) => {
    console.log(formData);
  }*/

  return (
    <LayoutAdmin>
      <h2>Rejestracja</h2>
      <form>

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

        <button type="button" onClick={handleClick}>Dodaj admina</button>
      </form>
    </LayoutAdmin>
  );
}

export default AddAdmin;