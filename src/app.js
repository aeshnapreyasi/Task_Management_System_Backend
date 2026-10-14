const express = require("express");
const app = express();
const userRoutes = require("./routes/index");
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);

app.use(express.json());
app.use(cookieParser())
app.use("/api", userRoutes);

module.exports = app;
