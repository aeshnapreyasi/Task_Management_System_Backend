const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Register user
async function registerUser(name, email, password) {
  if (!name || !email || !password) {
    throw new Error("Name, Email and password are required.");
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
      name,
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

  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isMatch) {
    throw new Error("Invalid credentials.");
  }

  return user;
}

async function getUserById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

module.exports = {
  registerUser,
  loginUser,
  getUserById,
};
