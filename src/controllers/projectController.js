// handle the request and response

const {
  getUserProjects,
  createProject,
  viewProjectById,
  updateProjectById,
  deleteProjectById,
} = require("../services/projectService");

// get the projects of the user
async function listProjects(req, res) {
  try {
    const projects = await getUserProjects(req.userId);

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
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project name is required",
      });
    }

    const project = await createProject(
      req.userId,
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

    const project = await viewProjectById(id, req.userId);

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
  try{
    const {id} = req.params;
    const { name, description } = req.body;

    //validate project name if provided
    if(name !== undefined && (typeof name !== 'string' || !name.trim())){
      return res.status(400).json({
        success: false,
        message: "Project name cannot be empty",
      });
    } 

    //validate description if provided
    if(description !== undefined && description !== null && typeof description !== "string"){
      return res.status(400).json({
        success: false,
        message: "Description must be a string or null.",
      });
    }

    //check whether at least one field is provided 
    if(name === undefined && description === undefined){
      return res.success(400).json({
        success: false,
        message: "Provide name or description to update",
      });
    }

    const data = {};
    if(name !== undefined){
      data.name = name.trim();
    }

    if(description !== undefined){
      data.description = description?.trim() || null;
    }

    const result = await updateProjectById(id, req.userId, data);

    if(result.count === 0){
      return res.status(404).json({
        success: false, 
        message: "Project not found",
      });
    }

    const updatedProject = await viewProjectById(id, req.userId);
    
    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project: updatedProject,
    });
} catch(error){
  console.error("Update project error:", error);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
}

async function deleteProjectController(req, res) {
  try{
    const {id} = req.params;
    const project = await deleteProjectById(id, req.userId);

    if(!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      project,
    });
  } catch(error) {
    console.error("Error in getting the project detials", error);

    return res.status(500).json({
      success: false,
      message: "Internal server Error",
    });
  }

}
module.exports = {
  listProjects,
  createProject: createProjectController,
  getProjectDetails,
  updateProjectController,
  deleteProjectController,
};
