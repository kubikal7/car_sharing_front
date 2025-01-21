import React from 'react';
import '../Styles/Layout.css';
import { useNavigate, Link } from 'react-router-dom';

function LayoutAdmin({ children }) {
    const navigate = useNavigate(); 
  
    //Funkcja do wylogowania 
    const handleLogout = () => {
      localStorage.removeItem('token'); //Usuwamy token
      navigate('/');
    };
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
                <li><Link to="/admin-payments">Płatności</Link></li>
                <li><Link to="/admin-add">Dodaj admina</Link></li>
                <li><Link to="/admin-service-history">Historia serwisowa</Link></li>
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
