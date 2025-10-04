const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema({
  batch_no: { type: String, required: true },
  fat: Number,
  snf: Number,
  water: Number,
  protein: Number,
  date: { type: Date, required: true } // only admin-entered date
} { timestamps: true });

module.exports = mongoose.model("Batch", batchSchema);
