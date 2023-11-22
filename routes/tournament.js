const express = require("express");
const router = express.Router();
const Tournament = require("../models/tornament");
// Create a new tournament
router.post("/createTournament", async (req, res) => {
  try {
    console.log(req.body);
    const newTournament = new Tournament(req.body);
    const savedTournament = await newTournament.save();
    res.json(savedTournament);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/tournaments/:organizerId", async (req, res) => {
  try {
    const organizerId = req.params.organizerId;
    console.log("I am Called", organizerId);
    const tournaments = await Tournament.find({ organizerID: organizerId });
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/", async (req, res) => {
  try {
    const tournaments = await Tournament.find({});
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/addPlayer", async (req, res) => {
  const { playerID, tournamentId } = req.body;
  console.log(req.body);
  try {
    // Find the tournament by ID
    const tournamentData = await Tournament.findById(tournamentId);

    if (!tournamentData) {
      return res.status(404).json({ error: "Tournament not found" });
    }

    if (tournamentData.status !== 'Start') {
      return res.status(404).json({ error: "Tournament not in Start mode" });
    }

    // Check if the player is already registered for the tournament
    const isPlayerAlreadyRegistered = tournamentData.players.includes(playerID);

    if (isPlayerAlreadyRegistered) {
      return res.status(400).json({ error: "Player is already registered for the tournament" });
    }

    // Check if the teamSize limit is reached
    if (tournamentData.players.length >= tournamentData.teamSize) {
      return res.status(400).json({ error: "Team size limit reached" });
    }

    // Add the player to the tournament's player array
    tournamentData.players.push(playerID);
    await tournamentData.save();

    res.status(200).json({ message: "Player added to the tournament" });
  } catch (error) {
    console.error("Error finding tournament:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// {Get} http://localhost:8000/tornament/getTournamentById/:tournamentId
router.get("/getTournamentById/:tournamentId", async (req, res) => {
  const { tournamentId } = req.params; // Use "tournamentId" here, not "tornamentId"
  console.log(tournamentId);

  try {
    const tournament = await Tournament.findById(tournamentId)
      .populate({
        path: "gameID",
        select: "name + platform",
      })
      .populate({
        path: "organizerID",
        select: "firstName + lastName", // Select the fields you want to populate (e.g., username, email)
      })
      .exec();
    console.log(tournament);
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    res.status(200).json(tournament);
  } catch (err) {
    res.status(500).json({ message: "Error getting Tournament" });
  }
});

// {PUT} http://localhost:8000/tornament/updateTournament/:tournamentId
router.put("/updateTournament/:tournamentId", async (req, res) => {
  const { tournamentId } = req.params;
  const { tournamentName, timezone, description, rules } = req.body;
  const started = new Date(timezone).getTime();
  console.log("Update", tournamentName, started);
  try {
    const tournament = await Tournament.findByIdAndUpdate(tournamentId, {
      tournamentName,
      started,
      description,
      rules,
    });
    console.log("test11");

    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    res.status(200).json({ message: "Tournament updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating Tournament", error: err.message });
  }
});

// {Get} http://localhost:8000/tornament/getPlayerDetails/:tournamentId

router.get("/getPlayerDetails/:tournamentId", async (req, res) => {
  try {
    const { tournamentId } = req.params;
    console.log('ID', tournamentId);
    const tournamentDetails = await Tournament.findById(tournamentId)
      .populate({
        path: "players",
        model: "User", // Assuming 'User' is the name of your User model
        select: "firstName + lastName", // Select the 'name' field of the User model to populate
      })
      .exec();
    console.log(tournamentDetails);
    res.status(200).json({tournamentDetails})
  } catch (err) {
    res.status(400).json({message: "Failed to get user details", error: err.message})
  }
});

// {Post}  http://localhost:8000/tornament/removeParticipant
router.post('/removeParticipant', async (req, res) => {
  try {
    const { tournamentId, playerId } = req.body; // Retrieve tournamentId and playerId from request body

    // Remove the participant by ID from the tournament
    console.log('My data for Id',tournamentId);
    const tournament = await Tournament.findByIdAndUpdate(
      { _id: tournamentId }, // Specify the tournament ID where the participant needs to be removed
      { $pull: { players: playerId } }, // Remove the participant with the provided ID from the 'players' array
      { new: true }
    );

    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    res.status(200).json({ message: `Participant with ID ${playerId} removed successfully from tournament ${tournamentId}` });
  } catch (error) {
    res.status(500).json({ message: 'Error removing participant', error: error.message });
  }
});

// {Post}  http://localhost:8000/tornament/close
router.post('/close', async (req, res) => {
  try {
    const { tournamentId } = req.body;

    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    if (tournament.status !== 'Start') {
      return res.status(400).json({ message: 'Tournament is not in "Start" status, cannot be closed' });
    }

    const updatedTournament = await Tournament.findByIdAndUpdate(
      { _id: tournamentId },
      { $set: { status: 'Close' } },
      { new: true }
    );

    res.status(200).json({ message: `Tournament with ID ${tournamentId} closed successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Error closing tournament', error: error.message });
  }
});

module.exports = router;
