
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({
      message: "Authentication is not configured.",
    });
  }

  // Read token from cookie
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      message: "Authentication token is required.",
    });
  }

  try {
    const payload = jwt.verify(token, secret);

    if (
      typeof payload !== "object" ||
      payload === null ||
      typeof payload.userId !== "string" ||
      payload.userId.length === 0
    ) {
      return res.status(401).json({
        message: "Invalid authentication token.",
      });
    }

    req.userId = payload.userId;

    return next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired authentication token.",
    });
  }
}

module.exports = authenticateToken;
