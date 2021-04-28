const { Schema, model } = require("mongoose");

const schema = Schema({
  userID: { type: String, default: "" },
  coin: { type: Number, default: 0 }
});

module.exports = model("exzowoncy", schema);
