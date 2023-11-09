const User = require("../models/user");
const Game = require("../models/game");
const express = require("express");

const router = express.Router();

router.get("/allPlayer", async (req, res) => {
  try {
    const user = await User.find({ role: "Player" }).countDocuments();
    return res.status(201).json({ data: user });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get("/allOrganizer", async (req, res) => {
  try {
    const user = await User.find({ role: "Organizer" }).countDocuments();
    return res.status(201).json({ data: user });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get("/players", async (req, res) => {
  try {
    const players = await User.find({ role: "player" });
    return res.status(201).json( players );
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get("/organizers", async (req, res) => {
  try {
    const organizers = await User.find({ role: "organizer" });
    return res.status(201).json( organizers);
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get("/ban/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email });
    if (user.ban == false) {
      user.ban = true;
    } else {
      user.ban = false;
    }
    await user.save();
    return res.status(201).json({ data: user });
  } catch (error) {
    res.status(500).json({ error });
  }
});
router.get("/userCount", async (req, res) => {
  try {
    const users = await User.find();
    const gameCount = await Game.countDocuments();
    let playerCount=0;
    let organizerCount=0
    if (users) {
      users.forEach(user => {
        if(user.role=='player'){
          playerCount++;
        }
        else if(user.role=='organizer'){
          organizerCount++;
        }
      });
      return res.status(200).json({ playerCount, organizerCount,gameCount});
    } else {
      res.status(500).json({ error });
    }
    
  } catch (error) {
    res.status(500).json({ error });
  }
});
router.get("/organizerName/:organizerId",async(req, res) =>{
  try {
    const organizerId = req.params.organizerId;
    const organizer = await User.findById(organizerId);

    if (!organizer) {
      return res.status(404).json({ error: 'Organizer not found' });
    }
    console.log(organizer);
    res.json({
      name: organizer.firstName + ' ' + organizer.lastName
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

module.exports = router;
