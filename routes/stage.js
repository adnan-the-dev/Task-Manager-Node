const router = require("express").Router();
const Stage = require("../models/Stage");
const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");

// Create a new stage
router.post("/", async (req, res) => {
  try {
    const { name, projectId } = req.body;

    if (!projectId) {
      return res.status(404).json({ message: "Project not found" });
    }

    const newStage = new Stage({ name, projectId });
    await newStage.save();

    res
      .status(201)
      .json({ data: newStage, message: "Stage created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// get stage by project id with tasks
// router.get("/:projectId/stages", async (req, res) => {
//   try {
//     const { projectId } = req.params;
//     const stages = await Stage.find({ projectId });
//     const stagesWithTasks = await Promise.all(
//       stages.map(async (stage) => {
//         const tasks = await Task.find({ stage: stage._id }).populate(
//           "assignedUser"
//         );
//         return {
//           ...stage.toObject(),
//           tasks,
//         };
//       })
//     );

//     res.status(200).json(stagesWithTasks);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// });


router.get("/:projectId/stages", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit of 10 tasks

    const stages = await Stage.find({ projectId });
    const stagesWithTasks = await Promise.all(
      stages.map(async (stage) => {
        const tasks = await Task.find({ stage: stage._id })
          .populate("assignedUser")
          .skip((page - 1) * limit)
          .limit(Number(limit));
        
        const totalTasks = await Task.countDocuments({ stage: stage._id });
        const totalPages = Math.ceil(totalTasks / limit);

        return {
          ...stage.toObject(),
          tasks,
          pagination: {
            totalTasks,
            currentPage: Number(page),
            totalPages,
            pageSize: Number(limit),
          }
        };
      })
    );

    res.status(200).json(stagesWithTasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// delete stage by id
router.delete("/:stageId", async (req, res) => {
  try {
    const { stageId } = req.params;

    const stage = await Stage.findByIdAndDelete(stageId);

    if (!stage) {
      return res.status(404).json({ message: "Stage not found" });
    }

    res.status(200).json({ message: "Stage deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
