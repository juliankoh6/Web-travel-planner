const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();
console.log('Loaded .env file:', process.env);


console.log('Script started...');
console.log('API_KEY:', process.env.CURRENCY_API_KEY);
console.log('MONGO_URI starts with:', process.env.MONGO_URI?.slice(0, 20));

const Currency = require('../models/Currency');

const API_KEY = process.env.CURRENCY_API_KEY;
const MONGO_URI = process.env.MONGO_URI;

async function fetchAndSaveAllCurrencies() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');

    const response = await axios.get('https://api.currencyapi.com/v3/latest', {
      params: {
        apikey: API_KEY,
        base_currency: 'USD'
      }
    });

    const allRates = response.data.data;

    if (!allRates) {
      console.log('No rates found in API response');
      return;
    }

    const currencyDocs = Object.entries(allRates).map(([code, details]) => ({
      from: 'USD',
      to: code,
      rate: details.value,
      fetchedAt: new Date()
    }));

    await Currency.insertMany(currencyDocs);
    console.log(`✅ Inserted ${currencyDocs.length} currency entries`);

    mongoose.disconnect();
  } catch (err) {
    console.error('❌ ERROR:', err);
    mongoose.disconnect();
  }
}

// ✅ CALL THE FUNCTION
fetchAndSaveAllCurrencies();
