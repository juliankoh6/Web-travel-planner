import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
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
        <nav style={{ padding: '1rem', backgroundColor: '#f0f0f0' }}>
          <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
          <Link to="/weather" style={{ marginRight: '1rem' }}>Weather</Link>
          <Link to="/currency" style={{ marginRight: '1rem' }}>Currency</Link>
        </nav>
      )}

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/places" element={isAuthenticated ? <PlacesPg /> : <Navigate to="/login" />} />
        <Route path="/weather" element={isAuthenticated ? <WeatherPg /> : <Navigate to="/login" />} />
        <Route path="/currency" element={isAuthenticated ? <CurrencyPg /> : <Navigate to="/login" />} />

        {/* Catch-all */}
        <Route path="*" element={<NotFoundPg />} />
      </Routes>
    </Router>
  );
}

export default App;


