const User = require("../models/user");
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
    const players = await User.find({ role: "Player" });
    return res.status(201).json({ data: players });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get("/organizers", async (req, res) => {
  try {
    const organizers = await User.find({ role: "Organizer" });
    return res.status(201).json({ data: organizers });
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

module.exports = router;
