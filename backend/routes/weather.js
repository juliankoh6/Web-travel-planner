const express = require('express');
const axios = require('axios');
const Weather = require('../models/Weather');
const router = express.Router();
require('dotenv').config();

// 🔹 POST /api/weather/fetch — Fetch weather data from API (preview only)
router.post('/fetch', async (req, res) => {
  const { city } = req.body;

  if (!city) {
    return res.status(400).json({ message: 'City name is required' });
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          q: city,
          appid: process.env.WEATHER_API_KEY,
          units: 'metric'
        }
      }
    );

    const weatherData = {
      city: response.data.name,
      temperature: response.data.main.temp,
      description: response.data.weather[0].description
    };

    res.status(200).json(weatherData); // 🔸 Just preview, don't save
  } catch (error) {
    console.error('🔥 FETCH ERROR:', error.message);
    res.status(500).json({ message: 'Error fetching weather data' });
  }
});

// 🔹 POST /api/weather/save — Save weather to MongoDB
router.post('/save', async (req, res) => {
  const { city, temperature, description } = req.body;

  if (!city || !temperature || !description) {
    return res.status(400).json({ message: 'Missing required weather data' });
  }

  try {
    const saved = await Weather.create({ city, temperature, description });
    res.status(201).json(saved);
  } catch (error) {
    console.error('🔥 SAVE ERROR:', error.message);
    res.status(500).json({ message: 'Error saving weather data' });
  }
});

// 🔹 GET /api/weather — Get all saved weather entries
router.get('/', async (req, res) => {
  try {
    const all = await Weather.find();
    res.status(200).json(all);
  } catch (error) {
    console.error('🔥 GET ERROR:', error.message);
    res.status(500).json({ message: 'Error retrieving weather data' });
  }
});

// 🔹 DELETE /api/weather/:id — Delete a specific entry
router.delete('/:id', async (req, res) => {
  try {
    await Weather.findByIdAndDelete(req.params.id);
    res.json({ message: 'Weather entry deleted' });
  } catch (error) {
    console.error('🔥 DELETE ERROR:', error.message);
    res.status(500).json({ message: 'Error deleting weather entry' });
  }
});

module.exports = router;
