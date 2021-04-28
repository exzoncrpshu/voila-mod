const { MessageEmbed } = require("discord.js");
const coin = require("../Models/exzowoncy.js");
const conf = require("../exzsettings/config.json")

module.exports.execute = async(client, message, args, ayar, emoji) => {
let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({display: true})).setColor("RANDOM")

const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if (!member) return message.channel.send(`**${message.author.username} |** exzowoncy göndermek istediğin kişiyi belirt!`);
const qdb = require("quick.db");
let check = await qdb.get(`bank.account.${message.author.id}`)
if (!check) {
  message.channel.send(`**${message.author.username} |** Bu oyunu oynamak için bir banka hesabına sahip olmalısın! **!hesap oluştur** yazarak oluşturabilirsin.`)
  return
}
  if (member.user.id === message.author.id) return message.channel.send(`**${message.author.username} |** kendine exzowoncy gönderdin ama neden?`);
  const count = parseInt(args[1]);
  if (!count) return message.channel.send(`**${message.author.username} |** göndermek istediğin exzowoncy miktarını belirt!`)
  if (!count < 0) return message.channel.send(`**${message.author.username} |** göndermek istediğin exzowoncy miktarını belirt!`);
  let coinData = await coin.findOne({ userID: message.author.id });
  if (!coinData || coinData && count > coinData.coin) return message.channel.send(`**${message.author.username} |** bu kadar exzowoncy'ye sahip değilsin!`)

  await coin.findOneAndUpdate({ userID: member.user.id }, { $inc: { coin: count } }, { upsert: true });
  await coin.findOneAndUpdate({ userID: message.author.id }, { $inc: { coin: -count } }, { upsert: true });
  coinData = await coin.findOne({ userID: message.author.id });

  
  message.channel.send(`**:credit_card: ${message.author.username}** bakiyenden **${count} exzowoncy** ${member.user.username} kullanıcısına gönderildi.`);

};
module.exports.configuration = {
    name: "send",
    aliases: ["gönder", "ver"],
    usage: "send [üye] [miktar]",
    description: "Belirtilen üyeye belirtilen xpyi gönderir."
};