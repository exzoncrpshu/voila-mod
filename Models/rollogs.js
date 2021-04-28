const mongoose = require("mongoose");

const rolLogs = mongoose.Schema({
  guildID: String,
  kullanıcıID: String,
  rolveridb: { type: Array, default: [] }
});
module.exports = mongoose.model("rolLog", rolLogs);