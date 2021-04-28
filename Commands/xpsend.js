const { MessageEmbed } = require("discord.js");
const coin = require("../Models/coin.js");
const conf = require("../exzsettings/config.json")

module.exports.execute = async(client, message, args, ayar, emoji) => {
let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({display: true})).setColor("RANDOM")

const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if (!member) return message.channel.send(embed.setDescription("Bir kullanıcı belirtmelisin!"));

  if (member.user.id === message.author.id) return message.channel.send(embed.setDescription("Kendine coin veremezsin!"));
  const count = parseInt(args[1]);
  if (!count) return message.channel.send(embed.setDescription("Coin vermek için bir sayı belirtmelisin!"));
  if (!count < 0) return message.channel.send(embed.setDescription("Verilecek sayı 0'dan küçük olamaz!"));
  let coinData = await coin.findOne({ guildID: message.guild.id, userID: message.author.id });
  if (!coinData || coinData && count > coinData.coin) return message.channel.send(embed.setDescription("Göndereceğin sayı kendi coininden yüksek olamaz!"));

  await coin.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { coin: count } }, { upsert: true });
  await coin.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: -count } }, { upsert: true });
  coinData = await coin.findOne({ guildID: message.guild.id, userID: message.author.id });
  if (coinData && client.ranks.some(x => coinData.coin < x.coin && message.member.roles.cache.has(x.role))) {
    const roles = client.ranks.filter(x =>  coinData.coin < x.coin && message.member.roles.cache.has(x.role));
    roles.forEach(x => {
      if (x.hammer) message.member.roles.remove(x.hammer)
      message.member.roles.remove(x.role)
    });
  }
  const coinData2 = await coin.findOne({ guildID: message.guild.id, userID: member.user.id });
  if (coinData2 && client.ranks.some(x => coinData2.coin >= x.coin && !member.roles.cache.has(x.role))) {
    const roles = client.ranks.filter(x => coinData2.coin >= x.coin && !member.roles.cache.has(x.role));
    member.roles.add(roles[roles.length-1].role);
    if (roles[roles.length-1].hammer) member.roles.add(roles[roles.length-1].hammer);
  }
  
  message.channel.send(embed.setDescription(`${member.toString()} kişisine başarıyla **${count}** coin gönderildi!`));

};
module.exports.configuration = {
    name: "xpsend",
    aliases: ["xpgönder", "xpver"],
    usage: "xpsend [üye] [miktar]",
    description: "Belirtilen üyeye belirtilen xpyi gönderir."
};