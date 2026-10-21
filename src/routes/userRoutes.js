const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateToken = require("../middleware/authenticateToken");
const { loginLimiter, registerLimiter } = require("../middleware/rateLimiter");


// Route for user registration
router.post("/auth/register", registerLimiter, userController.register);
router.post("/auth/login", loginLimiter, userController.login);
router.post("/auth/logout", userController.logout);
router.get("/auth/me", authenticateToken, userController.currentUser);


module.exports = router;
