import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import WeatherPg from './pages/WeatherPg';
import CurrencyPg from './pages/CurrencyPg';
import PlacesPg from './pages/PlacesPg';
import FavouritesPg from './pages/FavouritesPg';
import NotFoundPg from './pages/NotFoundPg';

function App() {
  return (
    <Router>
      <nav style={{ padding: '1rem', backgroundColor: '#f0f0f0' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Places</Link>
        <Link to="/weather" style={{ marginRight: '1rem' }}>Weather</Link>
        <Link to="/currency" style={{ marginRight: '1rem' }}>Currency</Link>
        <Link to="/favourites">Favourites</Link>
      </nav>

      <Routes>
        <Route path="/" element={<PlacesPg />} />
        <Route path="/weather" element={<WeatherPg />} />
        <Route path="/currency" element={<CurrencyPg />} />
        <Route path="/favourites" element={<FavouritesPg />} />
        <Route path="*" element={<NotFoundPg />} />
      </Routes>
    </Router>
  );
}

export default App;

