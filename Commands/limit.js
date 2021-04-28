
const Discord = require('discord.js');

module.exports.execute = async (client, message, args, ayar, emoji) => {
  let geciciOdaSembol = "⭐"; 
  if (!message.member.voice.channel || !(message.member.voice.channel.name).startsWith(geciciOdaSembol) || !message.member.voice.channel.permissionsFor(message.author).has('MUTE_MEMBERS') || !args[0] || isNaN(args[0]) || Number(args[0]) > 99) return message.react(client.emojiler.iptal);
  message.member.voice.channel.setUserLimit(args[0]);
  message.react(client.emojiler.onay);
};

module.exports.configuration = {
  name: "limit",
  aliases: ["sınır"],
  usage: "limit [sayı]",
  description: "Belirtilen üyenin avatarını gösterir."
};