
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Register user
async function registerUser(email, password) {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email is already registered.");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      passwordHash,
    },
  });
}

// Login user
async function loginUser(email, password) {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid credentials.");
  }
  // console.log(user);

  const isMatch = await bcrypt.compare(
    password,
    user.passwordHash
    
  );
  // console.log(isMatch);

  if (!isMatch) {
    throw new Error("Invalid credentials.");
  }

  return user;
}

module.exports = {
  registerUser,
  loginUser,
}