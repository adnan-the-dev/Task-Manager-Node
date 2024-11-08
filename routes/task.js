const router = require("express").Router();
const Task = require("../models/Task");
const Stage = require("../models/Stage");
const User = require("../models/User");

// Create a new task
router.post("/", async (req, res) => {
  try {
    const { title, description, stageId, dueDate, assignedUserId } = req.body;
    const stage = await Stage.findById(stageId);
    if (!stage) {
      return res.status(404).json({ message: "Stage not found" });
    }

    let assignedUser = null;
    if (assignedUserId) {
      assignedUser = await User.findById(assignedUserId);
      if (!assignedUser) {
        return res.status(404).json({ message: "Assigned user not found" });
      }
    }
    const newTask = new Task({
      title,
      description,
      stage: stageId,
      dueDate,
      assignedUser: assignedUserId,
    });

    await newTask.save();

    res
      .status(201)
      .json({ data: newTask, message: "Task created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Move Task API
router.put("/:taskId/move", async (req, res) => {
  try {
    const { taskId } = req.params;
    const { stage: newStageId } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    const oldStageId = task.stage;
    if (newStageId === oldStageId) {
      return res.status(400).json({
        message: "Parent ID cannot be the same as the current parent",
      });
    }

    const newParent = await Stage.findById(newStageId);
    if (!newParent) {
      return res.status(404).json({ message: "New parent stage not found" });
    }

    await Stage.findByIdAndUpdate(oldStageId, { $pull: { tasks: taskId } });

    await Stage.findByIdAndUpdate(newStageId, { $push: { tasks: taskId } });

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { stage: newStageId },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error moving task:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// delete task by id
router.delete("/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const stage = await Stage.findByIdAndUpdate(
      task.stage,
      { $pull: { tasks: taskId } },
      { new: true }
    );

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


module.exports = router;
