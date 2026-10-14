const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateToken = require("../middleware/authenticateToken");

// Route for user registration
router.post("/auth/register", userController.register);
router.post("/auth/login", userController.login);
router.get("/auth/me", authenticateToken, userController.currentUser);

module.exports = router;
