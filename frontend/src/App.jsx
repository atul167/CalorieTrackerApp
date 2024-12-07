// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/navbar';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Login from './pages/Login';
import DailyChart from './pages/DailyChart';
import Tracker from './pages/Tracker';
function App() {

  return (
    <div>
      <Navbar />
      <Routes>
        <Route
          path="/"
        element ={ <Navigate to="/login" />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
        <Route
          path="/analytics"
          element={<DailyChart />}
        />
         <Route
          path="/tracker"
          element={<Tracker />}
        />
      </Routes>
    </div>
  );
}

export default App;
