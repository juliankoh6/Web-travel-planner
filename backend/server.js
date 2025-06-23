const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes from both files
const weatherRoutes = require('./routes/weather');
const placeRoutes = require('./routes/places'); 
const currencyRoutes = require('./routes/currency');
const destinationRoutes = require('./routes/destinations');
const authRoutes = require('./routes/auth');

// App setup
const app = express();
app.use(cors());
app.use(express.json());

// Use all routes
app.use('/api/weather', weatherRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/currency', currencyRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/auth', authRoutes); 

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
console.log("Trying to connect to MongoDB...");

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
