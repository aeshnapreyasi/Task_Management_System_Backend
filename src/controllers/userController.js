const jwt = require("jsonwebtoken");
const {
  registerUser,
  loginUser,
  getUserById,
} = require("../services/userService");

// Register controller
async function register(req, res) {
  const { name, email, password } = req.body;

  try {
    const newUser = await registerUser(name, email, password);

    return res.status(201).json({
      message: "Registration successful",
      user: {
        id: newUser.id,
        name: newUser.name,
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

    if (error.message === "Name, Email and password are required.") {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

//defining the generatorJWT function
function generateJWT(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured.");
  }
  return jwt.sign(
    { userId: user.id },
    secret, 
    { expiresIn: "1h" });
}

// Login controller

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await loginUser(email, password);

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured.");
    }

    const token = generateJWT(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: user.id,
        name: user.name,
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

async function currentUser(req, res) {
  try {
    const user = await getUserById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Current user lookup error:", error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
}

module.exports = {
  register,
  login,
  currentUser,
};
