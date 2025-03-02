const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    req.admin = decoded; // Attach admin data to the request object
    next();
  } catch (err) {
    res.status(404).json({ error: 'Invalid token.' });
  }
};
