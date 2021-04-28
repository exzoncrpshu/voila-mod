const { MessageEmbed } = require("discord.js");
const coin = require("../Models/exzowoncy.js");
const conf = require("../exzsettings/config.json")
const cfLimit = new Map();
const ms = require("parse-ms")
const moment = require("moment")
const qdb = require("quick.db");

module.exports.execute = async(client, message, args, ayar, emoji) => {

  let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

if(!uye) return message.channel.send(`**${message.author.username} |** parasını çalmak istediğiniz birisini etiketleyin!`)
if(message.author.id === uye.id) return message.channel.send(`**${message.author.usernsme} |** kendinden exzowoncy çalamazsın!`)
let checkself = await qdb.get(`bank.account.${message.author.id}`)
  if (!checkself) {
    message.channel.send(`**${message.author.username} |** Bu oyunu oynamak için bir banka hesabına sahip olmalısın! **!hesap oluştur** yazarak oluşturabilirsin.`)
    return
  }
  let check = await qdb.get(`bank.account.${uye.id}`)
  if (!check) {
    message.channel.send(`**${message.author.username} |** üzgünüm ${uye.user.username}'nin henüz banka hesabı yok.`)
    return
  }
  const coinData = await coin.findOne({ userID: message.author.id }); // ${coinData.toLocaleString() ? coinData.coin.toLocaleString() : 0}
  const robCoin = await coin.findOne({ userID: uye.id });
  //if(message.author.id !== "518104479317360663") return message.react("🚫")
    let balance = coinData.coin 
    let uyeBalance = robCoin.coin
    let timeout = 1000*60*60*2
    let bump = await qdb.get(`cooldowns.rob.${message.author.id}`)
    if (bump !== null && timeout - (Date.now() - bump) > 0) {
      let time = ms(timeout - (Date.now() - bump))
      return message.channel.send(`**:stopwatch: |** Nu! **${message.author.username}!** Lütfen ${time.hours} saat, ${time.minutes} dakika, ${time.seconds} saniye bekle.`)
    }
    let selfBalance = Math.floor(Math.random() * 200000) + 100000; 
    let vergi = Math.floor(Math.random() * 95000) + 5000; 
   if(!balance) return message.channel.send(`**${message.author.username} |** hiç exzowoncy bakiyen bulunmuyor.`)
   if(-50000 > balance) return message.channel.send(`**${message.author.username} |** Bakiyen çok düşük!`)
if(uyeBalance < 150000) return message.channel.send(`**${message.author.username} |** ${uye.user.username}'nin yeterli parası yok!`)

let sans = Math.floor(Math.random() * 2+1);
let para = Math.floor(Math.random() * 95000) + 5000;
if(message.author.id === "518104479317360663") {
  await qdb.set(`cooldowns.rob.${message.author.id}`, Date.now())
  await coin.findOneAndUpdate({ userID: message.author.id }, { $inc: { coin: para } }, { upsert: true });
  await coin.findOneAndUpdate({ userID: uye.id }, { $inc: { coin: -para } }, { upsert: true });
  uye.send(`**${message.author.username} |** senden ${para} exzowoncy çaldı!`).catch(err => message.channel.send(`:moneybag: ${uye}, **${message.author.username}** senden ${para} exzowoncy çaldı!`))
message.channel.send(`**${message.author.username} |** ${uye.user.username} üyesinin ${para} exzocowoncy bakiyesini çaldın! `)
return;
}
if(uye.id === "518104479317360663") {
  message.channel.send(`**${message.author.username} |** üzgünüm ${uye.user.username}'den para çalarken yakalandın! Hapisten çıkmak için ${vergi} exzowoncy ödedin`)
  await coin.findOneAndUpdate({userID: message.author.id }, { $inc: { coin: -vergi } }, { upsert: true });
  await qdb.set(`cooldowns.rob.${message.author.id}`, Date.now())
  await coin.findOneAndUpdate({ userID: uye.id }, { $inc: { coin: vergi } }, { upsert: true });
  uye.send(`**${message.author.username} |** sana ${vergi} exzowoncy ödedi!`).catch(err => message.channel.send(`:moneybag: ${uye}, **${message.author.username}** sana ${vergi} exzowoncy ödedi!`))
return;
}
if(sans === 1) {
  message.channel.send(`**${message.author.username} |** üzgünüm ${uye.user.username}'den para çalarken yakalandın! Hapisten çıkmak için ${vergi} exzowoncy ödedin`)
  await coin.findOneAndUpdate({ userID: message.author.id }, { $inc: { coin: -para } }, { upsert: true });
  await qdb.set(`cooldowns.rob.${message.author.id}`, Date.now())
  await coin.findOneAndUpdate({ userID: uye.id }, { $inc: { coin: para } }, { upsert: true });
  uye.send(`**${message.author.username} |** sana ${vergi} exzowoncy ödedi!`).catch(err => message.channel.send(`:moneybag: ${uye}, **${message.author.username}** sana ${vergi} exzowoncy ödedi!`))
return;
} else if(sans === 2) {
  await qdb.set(`cooldowns.rob.${message.author.id}`, Date.now())
  await coin.findOneAndUpdate({ userID: message.author.id }, { $inc: { coin: para } }, { upsert: true });
  await coin.findOneAndUpdate({ userID: uye.id }, { $inc: { coin: -para } }, { upsert: true });
  uye.send(`**${message.author.username} |** senden ${para} exzowoncy çaldı!`).catch(err => message.channel.send(`:moneybag: ${uye}, **${message.author.username}** senden ${para} exzowoncy çaldı!`))
message.channel.send(`**${message.author.username} |** ${uye.user.username} üyesinin ${para} exzocowoncy bakiyesini çaldın! `)

}


};
module.exports.configuration = {
    name: "rob",
    aliases: ["çal"],
    usage: "rob [üye]",
    description: "Belirtilen miktarda iddiaya girersiniz."
};