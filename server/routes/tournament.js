const express = require('express');
const router = express.Router();
const Tournament = require('../models/tornament'); 
// Create a new tournament
router.post('/createTournament', async (req, res) => {
  try {
    console.log(req.body);
    const newTournament = new Tournament(req.body);
    const savedTournament = await newTournament.save(); 
    res.json(savedTournament); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/tournaments/:organizerId', async (req, res) => {
  try {
    const organizerId = req.params.organizerId;
    console.log("I am Called",organizerId);
    const tournaments = await Tournament.find({ organizerID: organizerId });
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
