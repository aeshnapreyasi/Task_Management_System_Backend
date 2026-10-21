const {
  createTask,
} = require("../services/taskService");

// creating a task 
async function createTaskController(req, res) {
  try{
    const {projectId, title, description, priority, dueDate} = req.body;

    //validate title 
    if(typeof title !== "string" || !title.trim()){
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    // now we have to validate the project id
    if(typeof projectId !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project Id is requird",
      });
    }

    // now we have to validate the description 
    if(
      description !== undefined &&
      description !== null &&
      typeof description !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Description must be a string or null",
      });
    }

    //validate priority
    const allowedPriorities = ["LOW", "MEDIUM", "HIGN"];

    if(priority !== undefined && !allowedPriorities.includes (priority)){
      return res.status(400).json({
        success: false,
        message: "Priority must be LOW, MEDIUM, HIGH",
      });
    }

    //now we have to validate the due date 
    if(dueDate !== undefined && dueDate !== null){
      if(typeof dueDate !== "string" ||
        dueDate.trim() === "" || 
        Number.isNaN(Date.parse(dueDate))
    ){
      return res.status(400).json({
        success: false,
        message: "Due date must a vlid date",
      });
    }}
  }