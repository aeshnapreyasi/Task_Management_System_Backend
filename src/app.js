const express = require("express");
const app = express();
const userRoutes = require("./routes/index");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const projectRoutes = require("./routes/projectRoutes")
const taskRoutes = require("./routes/taskRoutes");
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
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);


module.exports = app;
