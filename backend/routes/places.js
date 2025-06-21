const express = require('express');
const router = express.Router();

// Placeholder GET route
router.get('/', (req, res) => {
  res.json({ message: 'Places route placeholder' });
});

module.exports = router;
