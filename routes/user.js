const router = require("express").Router();
const User = require("../models/User");
// Create a new task
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const newUser = new User({
      name,
    });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json({ data: users });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;
