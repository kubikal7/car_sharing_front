// src/Pages/UserManagement.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LayoutAdmin from '../Components/Layout-admin';
import { Link } from 'react-router-dom';
import { checkAdminStatus } from '../Scripts/checkAdmin';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    (async () => {
      setIsAdmin(await checkAdminStatus(token));
    })();
  }, [token]);

  useEffect(() => {
    if (!isAdmin) return;
    fetchUsers();
  }, [isAdmin]);

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

  if (!isAdmin) {
    return <LayoutAdmin>Brak autoryzacji lub ładowanie...</LayoutAdmin>;
  }

  return (
    <LayoutAdmin>
      <h2>Zarządzanie użytkownikami</h2>
      <h3>Lista użytkowników</h3>
      {users.length === 0 ? (
        <p>Brak użytkowników.</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <strong>{user.name} {user.surname}</strong>{' '}
              {/* Link do nowej podstrony */}
              <Link to={`/admin-user/${user.id}`} style={{ marginLeft: '1rem' }}>
                Szczegóły
              </Link>
            </li>
          ))}
        </ul>
      )}
    </LayoutAdmin>
  );
}

export default UserManagement;
