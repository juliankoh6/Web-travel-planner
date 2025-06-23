const express = require('express');
const axios = require('axios');
const router = express.Router();

const api_key = process.env.SERPAPI_KEY 

router.get('/attractions', async (req, res) => {
  const country = req.query.country;

  if (!country) {
    return res.status(400).json({ error: 'Country name is required' });
  }

  try {
    const response = await axios.get('https://serpapi.com/search.json', {
      params: {
        engine: 'google',
        q: `${country} attractions`,
        google_domain: 'google.com',
        api_key: api_key
      }
    });

    console.log('SerpAPI raw data:', JSON.stringify(response.data, null, 2));

    const sights = response.data?.top_sights?.sights || [];

    res.json({ sights });
  } catch (err) {
    console.error('SerpAPI attraction fetch failed:', err.message);
    res.status(200).json({ sights: [] }); 
  }
});

module.exports = router;
