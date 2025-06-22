const mongoose = require('mongoose');

const currencySchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  rate: { type: Number, required: true },
  fetchedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Currency', currencySchema, 'currency');
