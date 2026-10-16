const express = require("express");
const router = express.Router();

const userRouter = require("./userRoutes");
const projectRouter = require("./projectRoutes");

router.use("/", userRouter);
router.use("/api/projects", projectRouter);

module.exports = router; 
