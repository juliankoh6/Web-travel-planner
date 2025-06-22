const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    console.error('No Authorization header found');
    return res.status(401).json({ error: 'Access denied — no token sent' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    console.error('Token not found in Authorization header:', authHeader);
    return res.status(401).json({ error: 'Access denied — token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      console.error('Decoded token missing "id":', decoded);
      return res.status(401).json({ error: 'Invalid token payload (no user ID)' });
    }

    req.user = decoded;
    console.log('Authenticated user:', req.user);
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};
