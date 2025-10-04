const mongoose = require("mongoose");

const phoneSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Phone", phoneSchema);
