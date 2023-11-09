const { Schema, mongo, default: mongoose } = require("mongoose");

const coinPackageSchema = new Schema({
  name: {type: String, require: true, unique: true },
  coin: {type: Number, require: true },
  price: { type: Number, require: true },
});

const Package = mongoose.model("Package", coinPackageSchema);

module.exports = Package;
