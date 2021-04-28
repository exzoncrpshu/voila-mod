const { MessageEmbed } = require("discord.js");
const coin = require("../Models/exzowoncy.js");
const conf = require("../exzsettings/config.json")
const ms = require("parse-ms")
const moment = require("moment")
const qdb = require("quick.db");

module.exports.execute = async(client, message, args, ayar, emoji) => {


  let check = await qdb.get(`bank.account.${message.author.id}`)
  if (!check) {
    message.channel.send(`**${message.author.username} |** Bu oyunu oynamak için bir banka hesabına sahip olmalısın! **!hesap oluştur** yazarak oluşturabilirsin.`)
    return
  }

  const coinData = await coin.findOne({ userID: message.author.id }).catch(err => message.reply(`Bir hata bulundu! <@518104479317360663> `)) // ${coinData.toLocaleString() ? coinData.coin.toLocaleString() : 0}
let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({display: true})).setColor("RANDOM")
   //if(message.author.id !== "518104479317360663") return message.react("🚫")
   var money = Math.floor(Math.random() * 75000) + 25000
    let balance = coinData.coin
 

    let timeout = 1000*60*60*24*7
    let bump = await qdb.get(`cooldowns.weekly.${message.author.id}`)
    if (bump !== null && timeout - (Date.now() - bump) > 0) {
      let time = ms(timeout - (Date.now() - bump))
      return message.channel.send(`**:stopwatch: |** Nu! **${message.author.username}!** Lütfen ${time.days} gün, ${time.hours} saat, ${time.minutes} dakika, ${time.seconds} saniye bekle.`)
    }
  

  
    await coin.findOneAndUpdate({ userID: message.author.id }, { $inc: { coin: money } }, { upsert: true });
    message.channel.send(`**:moneybag: ${message.author.username},** senin  haftalık **${client.emoji("exzowoncy")} ${money} exzowoncy** paran burada!`)
    await qdb.set(`cooldowns.weekly.${message.author.id}`, Date.now())
};
module.exports.configuration = {
    name: "weekly",
    aliases: ["haftalık"],
    usage: "weekly",
    description: "Günlük exzowoncy paranızı alırsınız."
};