import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WeatherPg.css';

function WeatherPg() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [savedWeather, setSavedWeather] = useState([]);

  const BASE_URL = 'https://web-travel-planner.onrender.com'; // 🔁 use this for all requests

  // 1. Load all saved entries
  useEffect(() => {
    fetchSavedWeather();
  }, []);

  const fetchSavedWeather = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/weather`);
      setSavedWeather(res.data);
    } catch (err) {
      console.error('Error fetching saved weather:', err);
    }
  };

  // 2. Preview weather (not saving)
  const fetchWeather = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/weather/fetch`, { city });
      setWeather({
        city: res.data.city,
        temperature: res.data.temperature,
        description: res.data.description
      });
      setError('');
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError('Could not fetch weather data.');
      setWeather(null);
    }
  };

  // 3. Save current weather to DB
  const saveWeather = async () => {
    if (!weather) return;
    try {
      const res = await axios.post(`${BASE_URL}/api/weather/save`, {
        city: weather.city,
        temperature: weather.temperature,
        description: weather.description
      });
      setSavedWeather((prev) => [...prev, res.data]);
    } catch (err) {
      console.error('Error saving weather:', err);
    }
  };

  // 4. Delete entry
  const deleteWeather = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/weather/${id}`);
      setSavedWeather((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Error deleting weather:', err);
    }
  };

  return (
    <div className="weather-container">
      <h2>Weather Forecast</h2>

      <form onSubmit={fetchWeather}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Get Weather</button>
      </form>

      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-result">
          <p><strong>City:</strong> {weather.city}</p>
          <p><strong>Temperature:</strong> {weather.temperature}°C</p>
          <p><strong>Description:</strong> {weather.description}</p>
          <button onClick={saveWeather}>Save</button>
        </div>
      )}

      <h3>Saved Weather Entries</h3>
      {savedWeather.length === 0 ? (
        <p>No saved weather yet.</p>
      ) : (
        <ul className="saved-list">
          {savedWeather.map((entry) => (
            <li key={entry._id}>
              {entry.city} — {entry.temperature}°C — {entry.description}
              <button onClick={() => deleteWeather(entry._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default WeatherPg;

