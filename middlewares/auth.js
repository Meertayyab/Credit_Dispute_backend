
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Check if Authorization header exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided or invalid format" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Standardize the field to req.user.id
    req.user = { id: decoded.id, email: decoded.email }; // ✅ make sure `email` is included

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
