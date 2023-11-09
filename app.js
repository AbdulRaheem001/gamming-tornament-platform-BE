const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const envPath = path.join(__dirname, "config.env");
const cors = require("cors");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const gameRouter = require("./routes/game");
const tornament = require('./routes/tournament')
const projectRouter = require("./routes/project");
const packageRouter = require("./routes/package");
require("dotenv").config({ path: envPath });

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/game", gameRouter);
app.use("/tornament", tornament);
app.use("/project", projectRouter);
app.use("/package", packageRouter);

 console.log(process.env.MONGOURI);

mongoose
  .connect(process.env.MONGOURI)
  .then(() => {
    app.listen(8000, () => {
      console.log("http://localhost:8000/");
    });
  })
  .catch((err) => {
    console.log(err);
  });
