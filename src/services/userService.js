const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const Prisma = new PrismaClient();

async function registerUser(email, password) {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const existingUser = await Prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email is already registered.");
  }

  return Prisma.user.create({
    data: { email, passwordHash },
  });
}

module.exports = { registerUser };
