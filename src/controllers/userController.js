const { registerUser } = require("../services/userService");

async function register(req, res) {
  const { email, password } = req.body;

  try {
    const newUser = await registerUser(email, password);

    return res.status(201).json({
      message: "Registration successful",
      user: { id: newUser.id, email: newUser.email },
    });
  } catch (error) {
    console.error("Error registering user: ", error);
    if (error.message === "Email is already registered.") {
      return res.status(409).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  register,
};
