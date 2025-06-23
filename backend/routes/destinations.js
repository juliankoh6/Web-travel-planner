const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { getLearnInfo } = require('../controllers/destinationController');
const { updateNotes } = require('../controllers/destinationController');
const {
  fetchPopularDestinations,
  getSaved,
  saveDestination,
  updateDestination,
  deleteDestination,
} = require('../controllers/destinationController');

router.get('/popular/:city', fetchPopularDestinations);

router.get('/saved', verifyToken, getSaved);
router.post('/saved', verifyToken, saveDestination);
router.put('/saved/:id', verifyToken, updateDestination);
router.delete('/saved/:id', verifyToken, deleteDestination);
router.patch('/saved/:id/notes', verifyToken, updateNotes);
router.get('/learn', getLearnInfo);
module.exports = router;
