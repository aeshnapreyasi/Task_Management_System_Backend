// define the api ends : GET/api/projects

const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authenticateToken");
const { listProjects, createProject, getProjectDetails, updateProjectController, deleteProjectController } = require("../controllers/projectController");

router.get("/", authenticateToken, listProjects);
router.post("/", authenticateToken, createProject);
router.get("/:id", authenticateToken, getProjectDetails);
router.put("/:id", authenticateToken, updateProjectController);
router.delete("/:id", authenticateToken, deleteProjectController);

module.exports = router;