// src/Pages/UserManagement.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LayoutAdmin from '../Components/Layout-admin';
import { Link } from 'react-router-dom';
import { checkAdminStatus } from '../Scripts/checkAdmin';
import "../Styles/UserManagement.css"

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userID, setUserID] = useState(null);
  const token = localStorage.getItem('token') || '';
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setIsAdmin(await checkAdminStatus(token));
    })();
  }, [token]);

  /*useEffect(() => {
    if (!isAdmin) return;
    fetchUsers();
  }, [isAdmin]);*/

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8080/user/all', {
        headers: { Authorization: token },
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Błąd przy pobieraniu listy użytkowników:', err);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/user/all`, {
        headers: { Authorization: token },
      });
      const found = res.data.find((u) => u.id === Number(userID));
      if (!found) {
        setError('Nie znaleziono użytkownika o ID=' + userID);
      } else {
        setUsers([found]);
      }
    } catch (err) {
      console.error('Błąd pobierania usera:', err);
      setError('Nie udało się pobrać użytkownika');
    }
  };

  if (!isAdmin) {
    return <LayoutAdmin>Brak autoryzacji lub ładowanie...</LayoutAdmin>;
  }

  console.log(users)

  return (
    <LayoutAdmin>
      <div className="admin-users-page">
      <h2>Zarządzanie użytkownikami</h2>
      <div className="search-container">
        <label>
          ID użytkownika:
          <input
            type="text"
            value={userID}
            onChange={(e) => setUserID(e.target.value)}
          />
        </label>
        <button onClick={fetchUser}>Wyszukaj</button>
        <button onClick={fetchUsers}>Wyszukaj wszystkich</button>
      </div>
      <h3>Lista użytkowników</h3>
      {users.length === 0 ? (
        <p>Brak użytkowników.</p>
      ) : (
        <ul className="user-list">
          {users.map((user) => (
            <li key={user.id} className="user-item">
              <div className="user-info">
                {user.name} {user.surname}
              </div>
              <div>
                <Link to={`/admin-user/${user.id}`} className="user-details-link">
                  Szczegóły
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
      </div>

    </LayoutAdmin>
  );
}

export default UserManagement;
