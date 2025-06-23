// backend/routes/currency.js
const express = require('express');
const axios = require('axios');
const router = express.Router();
const Currency = require('../models/Currency');
const SavedConversion = require('../models/SavedConversion');
require('dotenv').config();

const API_KEY = process.env.CURRENCY_API_KEY;

// 🔁 GET conversion rate with caching
router.get('/', async (req, res) => {
  const { from, to, amount = 1 } = req.query;
  if (!from || !to) return res.status(400).json({ error: 'Missing from/to' });

  try {
    const existingRate = await Currency.findOne({ from, to }).sort({ fetchedAt: -1 });
    if (existingRate && (Date.now() - new Date(existingRate.fetchedAt).getTime()) < 24 * 60 * 60 * 1000) {
      return res.json({
        from, to, rate: existingRate.rate,
        amount, converted: (amount * existingRate.rate).toFixed(2)
      });
    }

    const response = await axios.get('https://api.currencyapi.com/v3/latest', {
      params: {
        apikey: API_KEY,
        base_currency: from,
        currencies: to
      }
    });

    const rate = response.data.data[to].value;
    const currencyEntry = new Currency({ from, to, rate });
    await currencyEntry.save();

    res.json({
      from, to, rate,
      amount,
      converted: (amount * rate).toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ error: 'API error' });
  }
});

// ✅ Save a conversion (POST)
router.post('/save', async (req, res) => {
  const { userID, from, to, amount, convertedAmount, note } = req.body;
  if (!userID) return res.status(400).json({ error: 'Missing userID' });

  try {
    const saved = new SavedConversion({ userID, from, to, amount, convertedAmount, note });
    await saved.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save conversion' });
  }
});

// ✅ Get saved conversions for user
router.get('/saved', async (req, res) => {
  const userID = req.query.userID;
  if (!userID) return res.status(400).json({ error: 'Missing userID' });

  try {
    const records = await SavedConversion.find({ userID }).sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch saved conversions' });
  }
});

// ✅ Update
router.put('/saved/:id', async (req, res) => {
  try {
    const updated = await SavedConversion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Update failed' });
  }
});

// ✅ Delete
router.delete('/saved/:id', async (req, res) => {
  try {
    await SavedConversion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ error: 'Delete failed' });
  }
});

// ✅ Currency codes for dropdown
router.get('/codes', async (req, res) => {
  try {
    const currencies = await Currency.find().select('from to -_id');
    const codes = new Set();
    currencies.forEach(c => {
      if (c.from) codes.add(c.from);
      if (c.to) codes.add(c.to);
    });
    res.json([...codes].sort());
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch currency codes' });
  }
});

module.exports = router;
