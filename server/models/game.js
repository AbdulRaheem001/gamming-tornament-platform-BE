const monmgoose = require("mongoose");

const gameSchema = new monmgoose.Schema({
  name: {type: String, require: true },
  fee: {type: Number, require: true },
  platform: { type: String, enum: ["PC", "Mobile", "Play-Station","X-Box"] },
  image: {type: Buffer, require: true },
});

const Game = monmgoose.model("Game", gameSchema);

module.exports = Game;
