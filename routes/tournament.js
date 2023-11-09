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

    // Check if the player is already in the player array
    const isPlayerAlreadyInArray = tournamentData.players.some((player) =>
      player.equals(playerID)
    );

    if (isPlayerAlreadyInArray) {
      return res
        .status(400)
        .json({ error: "Player is already in the tournament" });
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
router.get("/getTournamentById/:tournamentId", async (req, res) => {
  const { tournamentId } = req.params; // Use "tournamentId" here, not "tornamentId"
  console.log(tournamentId);

  try {
    const tournament = await Tournament.findById(tournamentId);
    console.log(tournament)
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }
    
    res.status(200).json(tournament);
  } catch (err) {
    res.status(500).json({ message: "Error getting Tournament" });
  }
});

module.exports = router;
