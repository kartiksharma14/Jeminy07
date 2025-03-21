
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// Admin Authentication Middleware (Unchanged)
module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, 'your_super_secret_key');
    req.admin = decoded; // Attach admin data to the request object
    next();
  } catch (err) {
    res.status(404).json({ error: 'Invalid token.' });
  }
};

// Multer storage configuration for handling CSV/Excel file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// File filter to allow only CSV and Excel files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /csv|xlsx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype.includes('spreadsheet') || file.mimetype.includes('csv');

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only CSV and Excel files are allowed!'), false);
  }
};

// Multer middleware for file uploads
const upload = multer({ storage, fileFilter });

module.exports.upload = upload;
