const { Schema, mongo, default: mongoose } = require("mongoose");
const { strict } = require("yargs");

const tornamentSchema = new Schema({
  tournamentName: { type: String, require: true },
  teamSize: { type: String, require: true },
  fee: { type: Number, require: true },
  winningPrice: { type: Number, require: true },
  gameID: {
    type: mongoose.Types.ObjectId,
    ref: 'Game',
    required: true,
  },
  organizerID: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  started: { type: Number, require: true },
  description: { type: String, default: "No description given" },
  rules: { type: String, default: "No rule yet define" },
  status: { type: String, default: "Start" },
});

const Tournament = mongoose.model("Tournament", tornamentSchema);

module.exports = Tournament;
