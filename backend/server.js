const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const weatherRoutes = require('./routes/weather');
const currencyRoutes = require('./routes/currency');
const destinationRoutes = require('./routes/destinations');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/weather', weatherRoutes);
app.use('/api/currency', currencyRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/auth', authRoutes);

app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// MongoDB + start server
const PORT = process.env.PORT || 5000;
console.log("Trying to connect to MongoDB...");

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
