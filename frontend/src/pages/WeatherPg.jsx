import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WeatherPg.css';

function WeatherPg() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [savedWeather, setSavedWeather] = useState([]);

  // 1. Load all saved entries when component mounts
  useEffect(() => {
    fetchSavedWeather();
  }, []);

  const fetchSavedWeather = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/weather');
      setSavedWeather(res.data);
    } catch (err) {
      console.error('Error fetching saved weather:', err);
    }
  };

  // 2. Fetch & preview weather via your backend (does NOT save)
  const fetchWeather = async (e) => {
    e.preventDefault();
    try {
      // POST to /api/weather/fetch, backend uses your API key
      const res = await axios.post('http://localhost:5000/api/weather/fetch', { city });
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

  // 3. Save the currently previewed weather to MongoDB
  const saveWeather = async () => {
    if (!weather) return; // nothing to save
    try {
      // Send the same data back to your save route
      const res = await axios.post('http://localhost:5000/api/weather/save', {
        city: weather.city,
        temperature: weather.temperature,
        description: weather.description
      });
      setSavedWeather((prev) => [...prev, res.data]);
    } catch (err) {
      console.error('Error saving weather:', err);
    }
  };

  // 4. Delete a saved entry
  const deleteWeather = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/weather/${id}`);
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


