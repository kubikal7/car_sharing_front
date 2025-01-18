import React from 'react';
import '../Styles/Layout.css'; // Importowanie pliku CSS
import { useNavigate, Link } from 'react-router-dom';

function LayoutAdmin({ children }) {
    const navigate = useNavigate(); // Hook do nawigacji
  
    // Funkcja do wylogowania (czyszczenie tokenu z localStorage)
    const handleLogout = () => {
      localStorage.removeItem('token'); // Usuwamy token
      navigate('/'); // Programowo przekierowujemy na stronę główną
    };

    // Sprawdzamy, czy token jest zapisany w localStorage
    const token = localStorage.getItem('token');

  return (
    <div className="layout-container">
      <header className="layout-header">
        <h1>CarSharing</h1>
      </header>
      <nav className="layout-nav">
        <ul>
          <li><Link to="/">Strona główna</Link></li>
          {token && (
            <>
                <li><Link to="/admin-reservations">Rezerwacje</Link></li>
                <li><Link to="/admin-cars">Samochody</Link></li>
                <li><Link to="/admin-users">Użytkownicy</Link></li>
                <li><Link to="/admin-add">Dodaj admina</Link></li>
                <li><button onClick={handleLogout}>Wyloguj się</button></li>
            </>
          )}
          {!token && (
            <>
                <li><Link to="/login">Zaloguj się</Link></li>
            </>
          )}
        </ul>
      </nav>
      <main className="layout-main">
        {children}
      </main>
      <footer className="layout-footer">
        <p>© 2025 CarSharing. Wszystkie prawa zastrzeżone.</p>
      </footer>
    </div>
  );
}

export default LayoutAdmin;