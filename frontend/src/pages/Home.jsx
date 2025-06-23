import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SearchForm from './SearchForm';
import DestinationList from './DestinationList';
import SavedList from './SavedList';

function Home() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const username = localStorage.getItem('username');
    const userID = localStorage.getItem('userID');
    return username && userID ? { username, id: userID } : null;
  });

  const [results, setResults] = useState([]);
  const [saved, setSaved] = useState([]);
  const API_BASE = 'http://localhost:5000/api/destinations';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  useEffect(() => {
    if (user) fetchSaved();
  }, [user]);

  const fetchSaved = async () => {
    try {
      const res = await axios.get(`${API_BASE}/saved`);
      setSaved(res.data);
    } catch (err) {
      console.error('Failed to fetch saved:', err.message);
    }
  };

  const handleSearch = async (city) => {
    try {
      const res = await axios.get(`${API_BASE}/popular/${city}`);
      setResults(res.data);
    } catch (err) {
      console.error('Search failed:', err.message);
    }
  };

  const handleSave = async (place) => {
  const data = {
    title: place.title || 'Untitled',
    description: place.description || 'No description',
    image: place.image || place.thumbnail || '',
    rating: place.rating || 'N/A',
    reviews: place.reviews || '0',
    price: place.price || '',
    location_name: place.location_name || '',
  };

  try {
    await axios.post(`${API_BASE}/saved`, data);
    fetchSaved();
    alert('✅ Saved!');
  } catch (err) {
    console.error('Save failed:', err.message);
    alert('Error saving location');
  }
};



  const handleLearn = async (placeName) => {
  try {
    const res = await axios.get(`${API_BASE}/learn`, {
      params: { place: placeName }
    });

    return res.data?.snippet || 'No detailed info found.';
  } catch (err) {
    console.error('❌ Learn fetch failed:', err.message);
    return '⚠️ Could not retrieve more info.';
  }
};

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/saved/${id}`);
      fetchSaved();
    } catch (err) {
      console.error('Delete failed:', err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userID');
    localStorage.removeItem('username');
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        <p>⚠️ Not logged in.</p>
        <a href="/login">Go to Login</a>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>🌍 Travel Finder</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🔓 Logout
        </button>
      </div>

      <p>👋 Welcome, <strong>{user.username}</strong></p>
      <SearchForm onSearch={handleSearch} />
      <DestinationList destinations={results} onSave={handleSave} onLearn={handleLearn} />
      <SavedList saved={saved} onDelete={handleDelete} />
    </div>
  );
}

export default Home;
