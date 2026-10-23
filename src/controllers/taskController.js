const {
  createTask,
  getTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
  updateTaskStatus,
} = require("../services/taskService");

// controller for creating a task

async function createTaskController(req, res) {
  try {
    // only managers can create tasks

    if (req.userRole !== "MANAGER") {
      return res.status(403).json({
        success: false,
        message: "Only managers can create tasks",
      });
    }

    const { projectId, title, description, priority, dueDate } = req.body;

    // now we will validate project id
    if (typeof projectId !== "string" || !projectId.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    // now we will validate task title
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    // now we will validate description
    if (
      description !== undefined &&
      description !== null &&
      typeof description !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Description must be a string or null",
      });
    }

    // validating priority
    const allowedPriorites = ["LOW", "MEDIUM", "HIGH"];

    if (priority !== undefined && !allowedPriorites.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Priority must be LOW, MEDIUM or HIGH",
      });
    }

    // validating due date
    if (dueDate !== undefined && dueDate !== null) {
      if (
        typeof dueDate !== "string" ||
        !dueDate.trim() ||
        Number.isNaN(Date.parse(dueDate))
      ) {
        return res.status(400).json({
          success: false,
          message: "Due date must be a valid date",
        });
      }
    }
    console.log("incoming task data", req.body);
    const task = await createTask(
      projectId.trim(), // remove the extra space of id
      title.trim(), // to remove the extra space of title
      description?.trim() || null, // return null if the description is empty
      priority, //set only Low, medium and high
      dueDate,
    );

    console.log("Task is:", task);

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    if (error.message === "Project not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Create task error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create task",
    });
  }
}

//controller for getting the tasks according to the user's role
async function getTasksController(req, res) {
  try {
    // getting the logged in user's ID and role from authentication
    const userId = req.userId;
    const userRole = req.userRole;

    // fetching tasks according to the user's role
    const tasks = await getTasks(userId, userRole);

    //sending the fetched tasks to the client
    return res.status(200).json({
      success: true,
      count: tasks.length, // number of tasks returned
      tasks,
    });
  } catch (error) {
    console.log("Get tasks error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch tasks,",
    });
  }
}

async function getTaskByIdController(req, res) {
  try {
    // read the task id from the url
    const { id } = req.params;

    //get the logged-in user's ID and role
    const userId = req.userId;
    const userRole = req.userRole;

    //fetch the task and check access permissions
    const task = await getTaskById(id, userId, userRole);

    // task not found or employee is not allowed to view it
    if (!task) {
      return res.status(400).json({
        success: false,
        message: "Task not found",
      });
    }

    //now returning the task details
    return res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    console.error("Get task by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch task",
    });
  }
}

async function updateTaskByIdController(req, res) {
  try {
    // Only manager is allowed to update the task details
    if (req.userRole !== "MANAGER") {
      return res.status(403).json({
        success: false,
        message: "Only managers can update tasks",
      });
    }

    //read task id from url and update the fields from requested body
    const { id } = req.params;
    const { title, description, priority, status, dueDate } = req.body;

    const data = {};

    //validate and prepare title if required
    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Title must be a non-empty string",
        });
      }

      data.title = title.trim();
    }

    //Validate and prepare description if required
    if (description !== undefined) {
      if (description !== null && typeof description !== "string") {
        return res.status(400).json({
          success: false,
          message: "Description must be string or null",
        });
      }
      data.description = description?.trim() || null;
    }

    //only allow valid priority values
    if (priority !== undefined) {
      if (!["LOW", "MEDIUM", "HIGH"].includes(priority)) {
        return res.status(400).json({
          success: false,
          message: "Priority must be LOW,MEDIUM, HIGH",
        });
      }
      data.priority = priority;
    }

    //Only allow valid status values
    if (status !== undefined) {
      if (!["TODO", "IN_PROGRESS", "COMPLETED"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid task status",
        });
      }

      //Record when the task is completed, clear the data if reopened
      data.completedAt = status === "COMPLETED" ? new Date() : null;
    }

    //validate due date if provided
    if (dueDate !== undefined) {
      if (
        dueDate !== null &&
        (typeof dueDate !== "string" ||
          !dueDate.trim() ||
          Number.isNaN(Date.parse(dueDate)))
      ) {
        return res.status(400).json({
          success: false,
          message: "Due date must be a valid date or null",
        });
      }
      data.dueDate = dueDate ? new Date(dueDate) : null;
    }
    // Ensure at least one field was supplied
    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field to update",
      });
    }

    // checking before updating that task is present inside the project
    const existingTask = await getTaskById(id, req.userId, req.userRole);

    if (!existingTask) {
      return res.status(400).json({
        success: false,
        message: "Task not found",
      });
    }

    // Save the changes to the database after updation
    const updateTask = await updateTaskById(id, data);

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: updateTask,
    });
  } catch (error) {
    console.error("Update task error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update task",
    });
  }
}

async function deleteTaskByIdController(req, res) {
  try {
    // only managers can delete tasks
    if (req.userRole !== "MANAGER") {
      return res.status(403).json({
        success: false,
        message: "Only managers can delete task.",
      });
    }
    console.log("user id:", req.userId);
    console.log("user role:", req.userRole);

    //Get the task ID from the URL
    const { id } = req.params;

    //check whether the task exists
    const existingTask = await getTaskById(id, req.userId, req.userRole);

    if (!existingTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Delete the task from the database
    await deleteTaskById(id);

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete task",
    });
  }
}

// applying the controller for the updateStatus functionlity
async function updateTaskStatusController(req, res) {
  try {
    // read task id from the url and status from the request body
    const { id } = req.params;
    const { status } = req.body;

    // now allowing only three task statuses
    const allowedStatuses = ["TODO", "IN_PROGRESS", "COMPLETED"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be TODO, IN_PROGRESS, COMPLETED",
      });
    }

    //update status only if this task belogns to the logged-in employee
    const updatedTask = await updateTaskStatus(id, req.userId, status);

    //No matching task means it doesn't exist or isn't assigned to the logged-in employee
    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found or not assigned to you",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error in updating task:", error);
  }
}

module.exports = {
  createTaskController,
  getTasksController,
  getTaskByIdController,
  updateTaskByIdController,
  updateTaskByIdController,
  deleteTaskByIdController,
  updateTaskStatusController,
};
