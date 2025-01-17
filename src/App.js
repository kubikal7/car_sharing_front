import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './Pages/login';
import Register from './Pages/Register';
import Main from './Pages/Main';
import User from './Pages/User';
import ReservationsManagement from './Pages/ReservationManagement';
import ClientPanel from './Pages/ClientPanel';
import CarManagement from './Pages/CarManagement';
import AdminPanel from './Pages/AdminPanel';
import UserManagement from './Pages/UserManagement';
import AddAdmin from './Pages/AddAdmin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/user" element={<User/>}/>
        <Route path="/admin-cars" element={<CarManagement/>} />
        <Route path="/admin-reservations" element={<ReservationsManagement/>} />
        <Route path="/client-panel" element={<ClientPanel />} />
        <Route path="/admin" element={<AdminPanel/>}/>
        <Route path="/admin-users" element={<UserManagement/>}/>
        <Route path="/admin-add" element={<AddAdmin/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
