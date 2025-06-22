const express = require('express');
const axios = require('axios');
const router = express.Router();
const Currency = require('../models/Currency');
require('dotenv').config();

const API_KEY = process.env.CURRENCY_API_KEY;

// Route: GET /api/currency?from=USD&to=MYR
router.get('/', async (req, res) => {
  const { from, to } = req.query;

  if (!from || !to) {
    return res.status(400).json({ error: 'Please provide from and to currencies' });
  }

  try {
    // Try to find rate from MongoDB
    const existingRate = await Currency.findOne({ from, to }).sort({ fetchedAt: -1 });

    if (existingRate && (Date.now() - new Date(existingRate.fetchedAt).getTime()) < 24 * 60 * 60 * 1000) {
      return res.json(existingRate);
    }

    // If not found or outdated, fetch from currencyapi
    const response = await axios.get('https://api.currencyapi.com/v3/latest', {
      params: {
        apikey: API_KEY,
        base_currency: from,
        currencies: to
      }
    });

    const rate = response.data.data[to].value;

    // Save new rate to DB
    const currencyEntry = new Currency({
      from,
      to,
      rate
    });

    await currencyEntry.save();

    res.json(currencyEntry);
  } catch (error) {
    console.error('API or DB error:', error.message);
    res.status(500).json({ error: 'Failed to fetch or save currency data' });
  }
});

// Route: GET /api/currency/list – Return unique currency codes for dropdown
router.get('/list', async (req, res) => {
  try {
    const currencies = await Currency.find().select('to -_id');
    const codes = [...new Set(currencies.map(c => c.to))].sort();
    res.json(codes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch currency list' });
  }
});

module.exports = router;
