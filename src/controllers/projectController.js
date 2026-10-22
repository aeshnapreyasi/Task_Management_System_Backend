// handle the request and response

const {
  getUserProjects,
  createProject,
  isEmployee,
  viewProjectById,
  updateProjectById,
  deleteProjectById,
  getAllEmployees,
} = require("../services/projectService");

// get the projects of the user
async function listProjects(req, res) {
  try {
    const projects = await getUserProjects(req.userId, req.userRole);

    return res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("List projects error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

// controller for creating the user project
async function createProjectController(req, res) {
  try {
    const { name, description, userId } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project name is required",
      });
    }
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Employee selection is required",
      });
    }

    const validEmployee = await isEmployee(userId);

    if (!validEmployee) {
      return res.status(400).json({
        success: false,
        message: "Selected employee does not exist",
      });
    }

    const project = await createProject(
      userId, // id of the employee as manager tries to assign the project
      name.trim(),
      description?.trim() || null,
    );

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("Create project error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// accessing the project of the user by id so that no the other user could get
async function getProjectDetails(req, res) {
  try {
    const { id } = req.params;

    const project = await viewProjectById(id, req.userId, req.userRole);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("Error in getting the project details", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// updating the detail of the project by id
async function updateProjectController(req, res) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    //validate project name if provided
    if (name !== undefined && (typeof name !== "string" || !name.trim())) {
      return res.status(400).json({
        success: false,
        message: "Project name cannot be empty",
      });
    }

    //validate description if provided
    if (
      description !== undefined &&
      description !== null &&
      typeof description !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Description must be a string or null.",
      });
    }

    //check whether at least one field is provided
    if (name === undefined && description === undefined) {
      return res.status(400).json({
        success: false,
        message: "Provide name or description to update",
      });
    }

    const data = {};
    if (name !== undefined) {
      data.name = name.trim();
    }

    if (description !== undefined) {
      data.description = description?.trim() || null;
    }

    const result = await updateProjectById(id, req.userId, data);

    if (result.count === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const updatedProject = await viewProjectById(id, req.userId, req.userRole);

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Update project error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function deleteProjectController(req, res) {
  try {
    const { id } = req.params;
    const result = await deleteProjectById(id);

    if (result.count === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// controller to get the list of the employees for the manager in the form of dropdown

async function getAllEmployeesController(req, res) {
  try {
    const employees = await getAllEmployees();

    return res.status(200).json({
      success: true,
      employees,
    });
  } catch (error) {
    console.error("Get employees error", error);

    return res.status(500).json({
      success: false,
      messae: "Internal server error",
    });
  }
}
module.exports = {
  listProjects,
  createProject: createProjectController,
  getProjectDetails,
  updateProjectController,
  deleteProjectController,
  getAllEmployeesController,
};
