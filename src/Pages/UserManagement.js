import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LayoutAdmin from '../Components/Layout-admin';
import { checkAdminStatus } from '../Scripts/checkAdmin';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [editUserID, setEditUserID] = useState({});
  const [editUserData, setEditUserData] = useState({});

  const token = localStorage.getItem('token');

  const [isAdmin, setIsAdmin] = useState(null);
  useEffect(() => {
    (async () => {
      setIsAdmin(await checkAdminStatus(token) ? true : false);
    })();
  }, [token]);

  // 1. Pobranie listy samochodów
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

  useEffect(() => {
    if (isAdmin === null || isAdmin === false) return;
    fetchUsers();
  }, [isAdmin]);

  // 3. Rozpoczęcie edycji
  const startEdit = (user) => {
    setEditUserID(user.id);
    setEditUserData({ ...user });
  };

  // 4. Zmiana pól edytowanego samochodu
  const handleEditUserChange = (e) => {
    const { name, value } = e.target;
    setEditUserData((prev) => ({ ...prev, [name]: value }));
  };

  // 5. Zatwierdzenie edycji
  const handleUpdateUser = async (e) => {
    console.log(editUserData);
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8080/user/modify/${editUserID}`,
        editUserData,
        { headers: { Authorization: token } }
      );
      alert('Użytkownik zaktualizowany!');
      setEditUserID(null);
      fetchUsers();
    } catch (err) {
      console.error('Błąd przy aktualizacji uzytkownika:', err);
      alert('Nie udało się zaktualizować uzytkownika.');
    }
  };

  // 6. Usuwanie samochodu
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:8080/user/delete/${userId}`, {
        headers: { Authorization: token },
      });
      alert('Uzytkownik usunięty!');
      fetchUsers();
    } catch (err) {
      console.error('Błąd przy usuwaniu uzytkownika:', err);
      alert('Nie udało się usunąć uzytkownika.');
    }
  };

  return (
    <LayoutAdmin>
      <h2>Zarządzanie użytkownikami</h2>

      {/* LISTA UŻYTKOWNIKÓW i EDYCJA */}
      <h3>Lista użytkowników</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {editUserID === user.id ? (
              <form onSubmit={handleUpdateUser}>
                <input
                  type="text"
                  name="name"
                  value={editUserData.name}
                  onChange={handleEditUserChange}
                />
                <input
                  type="text"
                  name="surname"
                  value={editUserData.surname}
                  onChange={handleEditUserChange}
                />
                <input
                  type="text"
                  name="email"
                  value={editUserData.email}
                  onChange={handleEditUserChange}
                />
                <input
                  type="text"
                  name="country"
                  value={editUserData.country}
                  onChange={handleEditUserChange}
                />
                <input
                  type="date-local"
                  name="date_of_birth"
                  value={editUserData.date_of_birth}
                  onChange={handleEditUserChange}
                />
                <button type="submit">Zapisz</button>
                <button onClick={() => setEditUserID(null)}>Anuluj</button>
              </form>
            ) : (
              <>
                <b>{user.id}</b> ({user.name}, {user.surname}, {user.email}, {user.country}, {user.date_of_birth}, {user.role})
                <button onClick={() => startEdit(user)}>Edytuj</button>
                <button onClick={() => handleDeleteUser(user.id)}>Usuń</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </LayoutAdmin>
  );
}

export default UserManagement;