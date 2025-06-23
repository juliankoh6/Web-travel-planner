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

    // Convert iat and exp to readable format
    const iatReadable = new Date(decoded.iat * 1000).toLocaleString();
    const expReadable = new Date(decoded.exp * 1000).toLocaleString();

    console.log('✅ Authenticated user:', {
      id: decoded.id,
      username: decoded.username,
      iat: `${decoded.iat} (${iatReadable})`,
      exp: `${decoded.exp} (${expReadable})`
    });

    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};
