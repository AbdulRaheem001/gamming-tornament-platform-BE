const express = require("express");
const Project = require("../models/project");
const { default: mongoose } = require("mongoose");

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const { name, organizer } = req.body;
    if (!name || !organizer) {
      return res.status(401).json({ message: "Fill All Fields" });
    }
    const project = new Project();
    project.name = name;
    project.organizer = organizer;
    const data = await project.save();
    res.status(201).json({ data });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

router.get("/all/:orgId", async (req, res) => {
  try {
    // console.log("all");
    const orgId = new mongoose.Types.ObjectId(req.params.orgId);
    const data = await Project.find({ organizer: orgId });
    // console.log(data);
    res.status(201).json({ data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;
