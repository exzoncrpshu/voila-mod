const mongoose = require("mongoose");

const teyitci = mongoose.Schema({
  _id: String,
  teyitler: Number,
  erkek: Number,
  kiz: Number
});

module.exports = mongoose.model("teyitci", teyitci);