const axios = require('axios');
const Destination = require('../models/Destination');

exports.fetchPopularDestinations = async (req, res) => {
  const { city } = req.params;
  console.log('Fetching attractions for:', city);

  try {
    const response = await axios.get('https://serpapi.com/search.json', {
      params: {
        engine: 'google',
        q: `top tourist attractions in ${city}`,
        google_domain: 'google.com',
        api_key: process.env.SERPAPI_KEY
      }
    });

    const sights = response.data?.top_sights?.sights || [];

    const destinations = sights.slice(0, 6).map(sight => ({
      title: sight.title || 'Untitled',
      description: sight.description || 'No description available',
      image: sight.thumbnail || sight.image || 'https://via.placeholder.com/300x200?text=No+Image',
      location_name: sight.location_name || city,
      rating: sight.rating || 'N/A',
      reviews: sight.reviews || '0',
      price: sight.price || 'N/A'
    }));

    res.json(destinations);
  } catch (err) {
    console.error('SerpAPI fetch failed:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch attractions from SerpAPI' });
  }
};

exports.getSaved = async (req, res) => {
  try {
    const saved = await Destination.find({ userID: req.user.id });
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get saved destinations' });
  }
};


exports.saveDestination = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized. No user found.' });
  }

  try {
    const dest = new Destination({
      ...req.body,
      address: req.body.address || 'Unknown',
      userID: userId,
      notes: req.body.notes || '' // Add notes field if sent
    });

    await dest.save();
    console.log('✅ Saved:', dest);
    res.status(201).json(dest);
  } catch (err) {
    console.error('Save error:', err.message);

    if (err.code === 11000) {
      return res.status(400).json({ error: 'You already saved this location.' });
    }

    res.status(500).json({ error: 'Failed to save destination' });
  }
};


exports.getLearnInfo = async (req, res) => {
  const place = req.query.place;
  if (!place) {
    return res.status(400).json({ error: 'Missing place query parameter' });
  }

  try {
    const response = await axios.get('https://serpapi.com/search.json', {
      params: {
        engine: 'google',
        q: `What is ${place}?`,
        api_key: process.env.SERPAPI_KEY
      }
    });

    const snippet = response.data?.organic_results?.[0]?.snippet || 'No additional info found.';
    res.json({ snippet });
  } catch (err) {
    console.error('Learn failed:', err.message);
    res.status(500).json({ error: 'Failed to retrieve info' });
  }
};

exports.updateDestination = async (req, res) => {
  try {
    const updated = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update destination' });
  }
};

exports.deleteDestination = async (req, res) => {
  try {
    await Destination.findByIdAndDelete(req.params.id);
    res.json({ message: 'Destination deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete destination' });
  }
};

exports.updateNotes = async (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;

  try {
    const updated = await Destination.findByIdAndUpdate(
      id,
      { notes },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error('❌ Error updating notes:', err.message);
    res.status(500).json({ error: 'Failed to update notes' });
  }
};
