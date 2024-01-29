const mongoose = require("mongoose");
const launchesSchema = new mongoose.Schema({
  flightNumber: {
    type: Number,
    required: true,
  },
  launchDate: {
    type: Date,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  rocket: {
    type: String,
    required: true,
  },
  target: {
    type: String,
    required: true,
  },
  customers: {
    type: [String],
  },
  success: {
    type: Boolean,
    required: true,
    default: true,
  },
  upcoming: {
    type: Boolean,
    required: true,
  },
});

// Connects launches schema to launches collection
const launchModel = mongoose.model("Launch", launchesSchema);
module.exports = launchModel;
