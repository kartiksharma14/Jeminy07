/*const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try {
        // Extract the token from the "Authorization" header
        const token = req.headers.authorization?.split(' ')[1];

        // Check if the token is provided
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: Token is missing' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach candidate_id (decoded data) to the request object
        // Ensure the decoded token contains `candidate_id` as expected
        if (!decoded.candidate_id) {
            return res.status(401).json({ error: 'Invalid token: Candidate ID missing' });
        }

        req.candidate_id = decoded.candidate_id; // Attach `candidate_id` to the request object

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Error verifying token:', error.message);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = { verifyToken };


/*const jwt = require('jsonwebtoken');
const pool = require('../db'); // Adjust this path if needed

// Verify token and fetch user details
const verifyTokenAndFetchDetails = async (req, res, next) => {
    // Step 1: Verify the token
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ error: 'Token is missing' });
    }

    try {
        // Verify the token and decode it
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded token data to the request

        // Step 2: Fetch user details from the database using userId from the token
        const userId = decoded.userId;

        if (!userId) {
            return res.status(403).json({ error: 'No userId in token' });
        }

        const query = 'SELECT * FROM signin WHERE candidate_id = ?';
        
        // Query the database
        pool.query(query, [userId], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Candidate not found' });
            }

            // Attach candidate details to the request object
            req.candidate = results[0];

            // Proceed to the next middleware or route handler
            next();
        });
    } catch (err) {
        console.error('Token verification error:', err);
        res.status(403).json({ error: 'Invalid or expired token' });
    }
};

module.exports = { verifyTokenAndFetchDetails };*/




// Middleware for verifying JWT token
// middleware/authMiddleware.js
// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET);

    // Token is valid, proceed to next middleware
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(500).json({ error: 'Failed to authenticate token' });
  }
};