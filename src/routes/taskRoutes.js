const express = require("express");
const router = express.Router();

//Authentifcation: checks whether the user is logged in
const authenticationToken = require("../middleware/authenticateToken");

//Authorization: allows onlye managers to create tasks
const authorizeManager = require("../middleware/authorizeMiddleware");

// controller function that handles task creation
const {
  createTaskController,
  getTasksController,
  getTaskByIdController,
  updateTaskByIdController,
  deleteTaskByIdController,
  updateTaskStatusController,
} = require("../controllers/taskController");

//route to get tasks from the logged in user
router.get("/", authenticationToken, getTasksController);

//getting the one task by ID
router.get("/:id", authenticationToken, getTaskByIdController);

// POST /api/tasks
// User must be logged in, and only a manager can create a task
router.post("/", authenticationToken, authorizeManager, createTaskController);

// api to update task by id, only manager can update the task
router.put("/:id", authenticationToken, authorizeManager, updateTaskByIdController);

//api to delete task by id, only manager can delete the task 
router.delete("/:id", authenticationToken, authorizeManager, deleteTaskByIdController);

//api to allow the logged-in employees to update their assigned task status
router.patch("/:id/status", authenticationToken, updateTaskStatusController);

module.exports = router;
