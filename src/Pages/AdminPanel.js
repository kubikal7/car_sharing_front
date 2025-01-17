import React, { useEffect, useState } from 'react';
import LayoutAdmin from '../Components/Layout-admin';
import { checkAdminStatus } from '../Scripts/checkAdmin';

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

  // Jeśli wystąpił błąd, wyświetlamy komunikat
  if (isAdmin === false) {
    return <div>Blad autoryzacji</div>;
  }

  return (
    <LayoutAdmin>
      <h1>Panel Administratora</h1>
    </LayoutAdmin>
  );
}

export default AdminPanel;
