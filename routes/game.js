const express = require("express");
const Game = require("../models/game");

const router = express.Router();
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post("/addGame", upload.single('image'),async (req, res) => {
  console.log("addGame-1");
  console.log(req.body);
  try {
    const { Game_name, Game_Platform, Game_fee} = req.body;
    if (!Game_name || !Game_Platform || !Game_fee ) {
      return res.status(400).json({ error: "Fill Feilds" });
    } else {
      const game = new Game();
      game.name = Game_name;
      game.platform= Game_Platform;
      game.fee = Game_fee;
      game.image = req.file.buffer;
      await game.save();
      res.status(201).json({data: game} );
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

router.get("/allGames", async (req, res) => {
  try {
    let games = await Game.find({});
    console.log(games.length);
    res.status(200).json(games);

  } catch (error) {
    res.status(500).json({ error });
  }
});
router.get('/:gameId', async (req, res) => {
  try {
    const gameId = req.params.gameId;
    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.json({
      name: game.name,
      description: game.description,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get("/deleteGame/:name", async (req, res) => {
  try {
    const name = req.params.name;
    await Game.deleteOne({ name: { $regex: name, $options: "i" } });
    return res.status(201).json({ data: "Success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

router.post("/updateGame/:name", async (req, res) => {
  try {
    const name = req.params.name;
    const { gname, description, fee, picture, console } = req.body;
    if (!name || !description || !fee || !picture || !console) {
      return res.status(400).json({ error: "Fill Feilds" });
    } else {
      const game = await Game.findOne({
        name: { $regex: name, $options: "i" },
      });
      game.name = gname;
      game.description = description;
      game.fee = fee;
      game.console = console;
      game.picture = picture.toLowerCase();
      await game.save();
      res.status(201).json({ data: game });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get("/gameCount", async (req, res) => {
  try {
    const count = await Game.find().countDocuments();
    return res.status(201).json({ data: count });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
