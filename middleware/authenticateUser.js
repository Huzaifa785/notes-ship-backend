const jwt = require("jsonwebtoken");

const JWT_SECRET = "9fmq`qpA4uLJSj(m";

const authenticateUser = (req, res, next) => {
  // Get the user from jwt token and addid to req object
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ message: "Access Denied!" });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Access Denied!" });
  }
};

module.exports = authenticateUser;