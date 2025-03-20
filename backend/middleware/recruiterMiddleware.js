// middleware/recruiterMiddleware.js
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Always attach the decoded payload to req.user
    req.user = decoded;
    
    // If the token is for a recruiter (has recruiter_id), attach it to req.recruiter as well
    if (decoded.recruiter_id) {
      req.recruiter = decoded;
    }
    
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = authenticateToken;
