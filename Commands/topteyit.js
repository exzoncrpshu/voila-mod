const { MessageEmbed } = require("discord.js");
const teyitci = require("../models/teyitci.js");

module.exports.execute = async(client, message, args, ayar, emoji) => {
  let embed = new MessageEmbed().setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true })).setColor("RANDOM");
  let data = await teyitci.find().sort({ teyitler: "descending" });
  message.channel.send(embed.setDescription(`${data.length ? data.slice(0, 30).map((d, index) => `**${index+1}.** <@${d._id}>: **${d.teyitler}** (**${d.erkek}** erkek, **${d.kiz}** kız)`).join("\n") : "Bulunamadı!"}`));
};

module.exports.configuration = {
  name: "topteyit",
  aliases: ["top-teyit"],
  usage: "topteyit",
  description: "En fazla teyit yapanları sıralar."
};