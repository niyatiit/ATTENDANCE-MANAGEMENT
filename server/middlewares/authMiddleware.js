const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).send({ error: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, "secretkey");
    req.user = decoded; // Add user info to request object
    next();
  } catch (error) {
    res.status(400).send({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;
