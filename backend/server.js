// server.js (root of your backend/)
const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const path      = require('path');
require('dotenv').config();

// Import your route modules
const weatherRoutes     = require('./routes/weather');
const currencyRoutes    = require('./routes/currency');
const destinationRoutes = require('./routes/destinations');
const authRoutes        = require('./routes/auth');

const app = express();

// 🛡️ Middlewares
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/weather',     weatherRoutes);
app.use('/api/currency',    currencyRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/auth',        authRoutes);


app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// 🔌 Connect to MongoDB & start the server
const PORT = process.env.PORT || 5000;
console.log('Trying to connect to MongoDB...');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser:    true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
