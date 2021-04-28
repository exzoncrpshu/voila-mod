const { MessageEmbed } = require("discord.js");
const teyitci = require("../models/teyitci.js");

module.exports.execute = async(client, message, args, ayar, emoji) => {
  let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.displayAvatarURL({ dynamic: true })).setColor("RANDOM");
  let memberData = await teyitci.findById(member.id);
  if (!memberData) return message.channel.send(embed.setDescription(`${member} üyesinin teyit verisi bulunamadı!`));
  message.channel.send(embed.setDescription(`${member} üyesinin teyit bilgileri; **${memberData.teyitler}** toplam (**${memberData.erkek}** erkek, **${memberData.kiz}** kız)`));
};

module.exports.configuration = {
  name: "teyitbilgi",
  description: "Belirtilen yetkilinin teyit bilgisi.",
  usage: "teyitbilgi [üye]",
  aliases: ["teyit-bilgi", "teyit"],
};
