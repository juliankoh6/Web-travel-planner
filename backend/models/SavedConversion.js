// backend/models/SavedConversion.js
const mongoose = require('mongoose');

const savedConversionSchema = new mongoose.Schema({
  userID: { type: String, required: true },
  from: String,
  to: String,
  amount: Number,
  convertedAmount: Number,
  note: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SavedConversion', savedConversionSchema);
