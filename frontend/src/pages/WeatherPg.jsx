import React, { useState } from 'react';
import axios from 'axios';
import './WeatherPg.css';


function WeatherPg() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const fetchWeather = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/weather/fetch', { city });
      setWeather(res.data);
      setError('');
    } catch (err) {
      setError('Could not fetch weather data.');
      setWeather(null);
    }
  };

  return (
   <div className="weather-container">
  <h2>Weather Forecast</h2>
  <input
    type="text"
    placeholder="Enter city name"
    value={city}
    onChange={(e) => setCity(e.target.value)}
  />
  <button onClick={fetchWeather}>Get Weather</button>

  {weather && (
    <div className="weather-result">
      <p><strong>City:</strong> {weather.city}</p>
      <p><strong>Temperature:</strong> {weather.temperature}°C</p>
      <p><strong>Description:</strong> {weather.description}</p>
    </div>
  )}
</div>

    
  );
}

export default WeatherPg;

