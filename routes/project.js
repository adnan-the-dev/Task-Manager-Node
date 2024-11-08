const router = require("express").Router();
const Project = require("../models/Project");
const Stage = require("../models/Stage");
const Task = require("../models/Task");

// Add a new project
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const newProject = new Project({
      name,
    });

    await newProject.save();
    res
      .status(201)
      .json({ data: newProject, message: "Project added successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Internal server error", error: error.message });
  }
});

// get all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json({ data: projects });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// delete a project
router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});


module.exports = router;
