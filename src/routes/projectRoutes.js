// define the api ends : GET/api/projects

const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authenticateToken");
const { listProjects, createProject, getProjectDetails, updateProjectController, deleteProjectController, getAllEmployeesController } = require("../controllers/projectController");
const authorizeManager = require("../middleware/authorizeMiddleware");

router.get("/", authenticateToken, listProjects); // both can access the functionlity to access the project.

router.post("/", authenticateToken, authorizeManager, createProject); // only manager is allowed to access all the projects

router.get("/employees", authenticateToken, authenticateToken, getAllEmployeesController);

router.get("/:id", authenticateToken, getProjectDetails); // employess are allowed to access there projects only

router.put("/:id", authenticateToken, authorizeManager, updateProjectController); // only manager is allowed to update the project

router.delete("/:id", authenticateToken, authorizeManager, deleteProjectController); //only manager is allowed to delete the project



module.exports = router;