const { MessageEmbed } = require("discord.js");
const coin = require("../Models/exzowoncy.js");
const conf = require("../exzsettings/config.json")
module.exports.execute = async(client, message, args, ayar, emoji) => {
let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({display: true})).setColor("RANDOM")
  if(message.author.id !==  "518104479317360663") return;
  const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
  if (!member) return message.channel.send(embed.setDescription("Bir kullanıcı belirtmelisin!"));

  if (args[0] === "ekle" || args[0] === "add") {
    if (!message.member.hasPermission(8)) return;
    const count = parseInt(args[2]);
    if (!count) return message.channel.send(embed.setDescription("Eklemek için bir sayı belirtmelisin!"));
    if (!count < 0) return message.channel.send(embed.setDescription("Eklenecek sayı 0'dan küçük olamaz!"));

    await coin.findOneAndUpdate({ userID: member.id }, { $inc: { coin: count } }, { upsert: true });
    message.channel.send(embed.setDescription(`Başarıyla ${member.toString()} kullanıcısından **${count}** adet coin eklendi!`));
  } else if (args[0] === "sil" || args[0] === "remove") {
    if (!message.member.hasPermission(8)) return;

    const count = parseInt(args[2]);
    if (!count) return message.channel.send(embed.setDescription("Çıkarılacak için bir sayı belirtmelisin!"));
    if (!count < 0) return message.channel.send(embed.setDescription("Çıkarılacak sayı 0'dan küçük olamaz!"));

    await coin.findOneAndUpdate({ userID: member.user.id }, { $inc: { coin: -count } }, { upsert: true });

    message.channel.send(embed.setDescription(`Başarıyla ${member.toString()} kullanıcısından **${count}** adet coin çıkarıldı!`));
  } else if (args[0] === "ver" || args[0] === "give" || args[0] === "gönder") {
    if (member.user.id === message.author.id) return message.channel.send(embed.setDescription("Kendine coin veremezsin!"));
    const count = parseInt(args[2]);
    if (!count) return message.channel.send(embed.setDescription("Coin vermek için bir sayı belirtmelisin!"));
    if (!count < 0) return message.channel.send(embed.setDescription("Verilecek sayı 0'dan küçük olamaz!"));
    let coinData = await coin.findOne({ userID: message.author.id });
    if (!coinData || coinData && count > coinData.coin) return message.channel.send(embed.setDescription("Göndereceğin sayı kendi coininden yüksek olamaz!"));

    await coin.findOneAndUpdate({ userID: member.user.id }, { $inc: { coin: count } }, { upsert: true });
    await coin.findOneAndUpdate({ userID: message.author.id }, { $inc: { coin: -count } }, { upsert: true });

    
    message.channel.send(embed.setDescription(`${member.toString()} kişisine başarıyla **${count}** coin gönderildi!`));
  }
};
module.exports.configuration = {
    name: "exzowoncy",
    aliases: ["exz"],
    usage: "exzowoncy ekle/sil/gönder [üye] [miktar]",
    description: "Belirtilen eylemi coinler üzerinde gerçekleştirir."
};