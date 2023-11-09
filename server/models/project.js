const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: String,
  organizer: ObjectId,
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
