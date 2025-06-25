import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import WeatherPg from './pages/WeatherPg';
import CurrencyPg from './pages/CurrencyPg';
import NotFoundPg from './pages/NotFoundPg';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      {isAuthenticated && (
      <nav style={{
        padding: '1rem',
        backgroundColor: '#0077cc',
        fontSize: '18px',
        fontWeight: '500',
        fontFamily: 'Arial, sans-serif'
      }}>
        <Link to="/" style={{ marginRight: '2rem', color: '#fff', textDecoration: 'none' }}>Home</Link>
        <Link to="/weather" style={{ marginRight: '2rem', color: '#fff', textDecoration: 'none' }}>Weather</Link>
        <Link to="/currency" style={{ marginRight: '2rem', color: '#fff', textDecoration: 'none' }}>Currency</Link>
      </nav>
      )}

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/weather" element={isAuthenticated ? <WeatherPg /> : <Navigate to="/login" />} />
        <Route path="/currency" element={isAuthenticated ? <CurrencyPg /> : <Navigate to="/login" />} />

        {/* Catch-all */}
        <Route path="*" element={<NotFoundPg />} />
      </Routes>
    </Router>
  );
}

export default App;



