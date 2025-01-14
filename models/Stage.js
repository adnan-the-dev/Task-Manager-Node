const mongoose = require("mongoose");

const StageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
});

module.exports = mongoose.model("Stage", StageSchema);
