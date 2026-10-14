
const jwt = require("jsonwebtoken");
const {
  registerUser,
  loginUser,
} = require("../services/userService");

// Register controller
async function register(req, res) {
  const { email, password } = req.body;

  try {
    const newUser = await registerUser(email, password);

    return res.status(201).json({
      message: "Registration successful",
      user: {
        id: newUser.id,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    if (error.message === "Email is already registered.") {
      return res.status(409).json({
        message: error.message,
      });
    }

    if (error.message === "Email and password are required.") {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

// Login controller
async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await loginUser(email, password);

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured.");
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log(token);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    if (error.message === "Email and password are required.") {
      return res.status(400).json({
        message: error.message,
      });
    }

    if (error.message === "Invalid credentials.") {
      return res.status(401).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = {
  register,
  login,
};
