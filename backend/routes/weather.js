const express = require('express');
const axios = require('axios');
const Weather = require('../models/Weather');
const router = express.Router();

// POST: Fetch weather data and save to MongoDB
router.post('/fetch', async (req, res) => {
  const { city } = req.body;

  try {
    console.log('API Key:', process.env.WEATHER_API_KEY);

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );

    const weatherData = {
      city: response.data.name,
      temperature: response.data.main.temp,
      description: response.data.weather[0].description
    };

    const saved = await Weather.create(weatherData);
    res.status(201).json(saved);
  } catch (error) {
    console.error('🔥 ERROR:', error); // Show real error
    res.status(500).json({ message: 'Error fetching weather data' });
  }
});

// GET: Get all saved weather entries
router.get('/', async (req, res) => {
  try {
    const all = await Weather.find();
    res.json(all);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving weather data' });
  }
});

// DELETE: Remove a specific weather entry
router.delete('/:id', async (req, res) => {
  try {
    await Weather.findByIdAndDelete(req.params.id);
    res.json({ message: 'Weather entry deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting weather entry' });
  }
});

module.exports = router;
