const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const weatherRoutes = require('./routes/weather');

// App setup
const app = express();
app.use(cors());
app.use(express.json());

// Use routes
app.use('/api/weather', weatherRoutes);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
console.log("Trying to connect to MongoDB...");

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
