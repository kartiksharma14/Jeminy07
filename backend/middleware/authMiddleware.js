const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    //jwt.verify(token, process.env.JWT_SECRET);
    // Verify token AND decode it
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Set the user data in the request object
    req.user = {
        candidate_id: decoded.userId,  // Map userId to candidate_id
        email: decoded.email
      };
      
    // Token is valid, proceed to next middleware
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(500).json({ error: "Failed to authenticate token" });
  }
};
