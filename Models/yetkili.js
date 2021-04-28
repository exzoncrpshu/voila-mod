const mongoose = require("mongoose");

const yetkili = mongoose.Schema({
  _id: String,
  topceza: Number,
  chatmute: Number,
  sesmute: Number,
  jail: Number,
  kick: Number,
  ban: Number
});

module.exports = mongoose.model("yetkili", yetkili);