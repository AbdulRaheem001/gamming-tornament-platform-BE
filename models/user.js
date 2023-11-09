const { Schema, mongo, default: mongoose } = require("mongoose");

const userSchema = new Schema({
  firstName: {type: String, require: true },
  lastName: {type: String, require: true },
  email: { type: String, unique: true, require: true },
  password: {type: String, require: true },
  country: {type: String, require: true },
  phoneNumber: {type: Number, require: true },
  role: { type: String, enum: ["player", "organizer"] },
  ban: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
