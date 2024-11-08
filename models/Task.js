// models/Task.js
const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  stage: { type: mongoose.Schema.Types.ObjectId, ref: "Stage", required: true },
  dueDate: { type: String },
  assignedUser: { type: String },
});

module.exports = mongoose.model("Task", TaskSchema);
