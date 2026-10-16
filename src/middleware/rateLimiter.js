const rateLimit = require("express-rate-limit");

// Allow up to 5 login attempts per 15 minutes.
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 5,
  message: {
    error: "Too many login attempts. Please try again after 5 minutes.",
  },
  statusCode: 429,
  standardHeaders: true,
  legacyHeaders: false,
});

// Allow up to 3 registration attempts per hour.
const registerLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 3,
  message: {
    error: "Too many registration attempts. Please try again later.",
  },
  statusCode: 429,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  loginLimiter,
  registerLimiter,
};