const { MessageEmbed } = require("discord.js");
const inventory = require(`../Models/inventory.js`);
const conf = require("../exzsettings/config.json")
const cfLimit = new Map();
const ms = require("parse-ms")
const moment = require("moment")
const qdb = require("quick.db");
const exzo = require("../Models/exzowoncy.js");
module.exports.execute = async(client, message, args, ayar, emoji) => {

 
  let check = await qdb.get(`bank.account.${message.author.id}`)
  if (!check) {
    message.channel.send(`**${message.author.username} |** Bu oyunu oynamak için bir banka hesabına sahip olmalısın! **!hesap oluştur** yazarak oluşturabilirsin.`)
    return
  }
  const inv = await inventory.findOne({ User: message.author.id }); // ${coinData.toLocaleString() ? coinData.coin.toLocaleString() : 0}
let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({display: true})).setColor("RANDOM")
if(!inv) return message.channel.send(`**🚫 ${message.author.username} |** hiç mal varlığın bulunmuyor.`)

    let cash = inv.cash
    var money = Math.floor(Math.random() * (cash/25)) + (cash/100)
    let timeout = 1000*60*60*24
    let bump = await qdb.get(`cooldowns.claim.${message.author.id}`)
    if (bump !== null && timeout - (Date.now() - bump) > 0) {
      let time = ms(timeout - (Date.now() - bump))
      return message.channel.send(`**:stopwatch: |** Nu! **${message.author.username}!** Lütfen ${time.hours} saat, ${time.minutes} dakika, ${time.seconds+1} saniye bekle.`)
    }

 
    await exzo.findOneAndUpdate({ userID: message.author.id }, { $inc: { coin: money } }, { upsert: true });
    message.channel.send(`**:moneybag: ${message.author.username},** mal varlıklarından kazandığın paraları topluyorsun! **${client.emoji("exzowoncy")} ${money} exzowoncy** paran bakiyene eklendi! Daha sonra tekrar gelip almayı unutma.`)
    await qdb.set(`cooldowns.claim.${message.author.id}`, Date.now())
  

};
module.exports.configuration = {
    name: "claim",
    aliases: ["topla"],
    usage: "claim",
    description: "Belirtilen miktarda iddiaya girersiniz."
};