import React, { useEffect, useState } from 'react';
import LayoutAdmin from '../Components/Layout-admin';
import { checkAdminStatus } from '../Scripts/checkAdmin';
import { useNavigate, Link } from 'react-router-dom';
import "../Styles/AdminPanel.css"

function AdminPanel() {
  const token = localStorage.getItem('token') || '';

  const [isAdmin, setIsAdmin] = useState(null);
  useEffect(() => {
    (async () => {
      setIsAdmin(await checkAdminStatus(token) ? true : false);
    })();
  }, [token]);


  if (isAdmin === null) {
    return <div>Ładowanie...</div>;
  }

  if (isAdmin === false) {
    return <div>Blad autoryzacji</div>;
  }

  return (
    <div className="layout-container">
      <header className="layout-header">
        <h1>CarSharing</h1>
      </header>
      <main className="layout-main">
      <div className="admin-dashboard">
        <Link to="/admin-reservations">
          <div className="dashboard-tile">
            Rezerwacje
          </div>
        </Link>
        <Link to="/admin-cars">
          <div className="dashboard-tile">
            Samochody
          </div>
        </Link>
        <Link to="/admin-users">
          <div className="dashboard-tile">
            Użytkownicy
          </div>
        </Link>
        <Link to="/admin-payments">
          <div className="dashboard-tile">
            Płatności
          </div>
        </Link>
        <Link to="/admin-add">
          <div className="dashboard-tile">
            Dodaj admina
          </div>
        </Link>
        <Link to="/admin-service-history">
          <div className="dashboard-tile">
            Historia serwisowa
          </div>
        </Link>
      </div>
      </main>
      <footer className="layout-footer">
        <p>© 2025 CarSharing. Wszystkie prawa zastrzeżone.</p>
      </footer>
      </div>
  );
}

export default AdminPanel;
