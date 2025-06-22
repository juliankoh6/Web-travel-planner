const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  rating: String,
  reviews: String,
  price: String,
  address: String,
  location_name: String,
  userID: { type: String, required: true },
  date_saved: {
    type: Date,
    default: Date.now,
  }
});

// Unique index to avoid user conflict
destinationSchema.index({ title: 1, address: 1, userID: 1 }, { unique: true });

module.exports = mongoose.model('Destination', destinationSchema);

