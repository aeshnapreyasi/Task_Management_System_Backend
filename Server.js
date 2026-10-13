const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require("express");
const bcrypt = require('bcrypt');


const app = express();
app.use(express.json());

app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }
  try {
    // checking if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered. " });
    }

    // inserting a new user into the database
    const newUser = await prisma.user.create({
      data: {
        email: email,
        passwordHash : passwordHash,
      },
    });

    // responding with a success message
    res.status(201).json({
      message: "Registration successful.",
      user: { id: newUser.id, email: newUser.email },
    });
  } catch (error) {
    console.log("Registration error:", error);
    res.status(500).json({ message: "Internal server error. " });
  }
});

//start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
