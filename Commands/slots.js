const { MessageEmbed } = require("discord.js");
const coin = require("../Models/exzowoncy.js");
const conf = require("../exzsettings/config.json")
const slotLimit = new Map();
const ms = require("parse-ms")
const moment = require("moment")

module.exports.execute = async(client, message, args, ayar, emoji) => {  

  
const qdb = require("quick.db");
let check = await qdb.get(`bank.account.${message.author.id}`)
if (!check) {
  message.channel.send(`**${message.author.username} |** Bu oyunu oynamak için bir banka hesabına sahip olmalısın! **!hesap oluştur** yazarak oluşturabilirsin.`)
  return
}
  const coinData = await coin.findOne({ userID: message.author.id }); // ${coinData.toLocaleString() ? coinData.coin.toLocaleString() : 0}
let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({display: true})).setColor("RANDOM")

  let money = client.emojis.cache.get("827432000218333246") // lemon
  let chery = client.emojis.cache.get("827533635774185502") // garnet
  let heart = client.emojis.cache.get("827533431276830750") // avacado
  let patlıcan = client.emojis.cache.get("827533499664826410") // coconut
  let unread = client.emojis.cache.get("827533396955365437")

  let slot = [chery, heart, patlıcan];


  let balance = coinData.coin
  if(!balance) return message.channel.send(`**${message.author.username} |** hiç exzowoncy bakiyen bulunmuyor.`).then(x => x.delete({timeout: 10000}))
  let timeout = 1000*15
  let bump = await qdb.get(`cooldowns.slots.${message.author.id}`)
  if (bump !== null && timeout - (Date.now() - bump) > 0) {
    let time = ms(timeout - (Date.now() - bump))
    return message.channel.send(`**:stopwatch: |** Nu! **${message.author.username}!** Lütfen ${time.seconds} saniye bekle.`)
  }
  if (!args[0]) return message.channel.send(`**${message.author.username} |** slot oynamak için exzowoncy miktarı gir!`).then(x => x.delete({timeout: 10000}))
  if (isNaN(args[0])) return message.channel.send(`**${message.author.username} |** slot oynamak için exzowoncy miktarı gir!`).then(x => x.delete({timeout: 10000}))
  if (args[0] > balance) return message.channel.send(`**${message.author.username} |** bakiyen yetersiz!`).then(x => x.delete({timeout: 10000}))
  if (args[0] > 50000) return message.channel.send(`**${message.author.username} |** Bu oyunda en fazla **50.000 exzowoncy** oynayabilirsin!`).then(x => x.delete({timeout: 10000}))
  if (args[0] < 5) return message.channel.send(`**${message.author.username} |** Bu oyunda en az **5 exzowoncy** oynayabilirsin!`).then(x => x.delete({timeout: 10000}))
  var slot1 = slot.random()
  var slot2 = slot.random()
  var slot3 = slot.random()
  

  if (slot1 === slot2 && slot1 === slot3) {
    await coin.findOneAndUpdate({ userID: message.author.id }, { $inc: { coin: args[0]*5 } }, { upsert: true });
    await qdb.set(`cooldowns.slots.${message.author.id}`, Date.now())
message.channel.send(`\`___SLOTS___\`\n${unread} ${unread} ${unread} ${message.author.username} ${money} ${args[0]} iddiaya koydu\n\`|         |\`\n\`|         |\``).then(x => { 
  setTimeout(function(){
  x.edit(`\`___SLOTS___\`\n${slot1} ${slot2} ${slot3} ${message.author.username} ${money} ${args[0]} iddiaya koydu\n\`|         |\` ve ${money} ${args[0]*5} kazandın!\n\`|         |\``)
  }, 5000)
  }
  )

  } else {
    await coin.findOneAndUpdate({ userID: message.author.id }, { $inc: { coin: -args[0] } }, { upsert: true });
    await qdb.set(`cooldowns.slots.${message.author.id}`, Date.now())
    message.channel.send(`\`___SLOTS___\`\n${unread} ${unread} ${unread} ${message.author.username} ${money} ${args[0]} iddiaya koydu\n\`|         |\`\n\`|         |\``).then(x => { 
      setTimeout(function(){
      x.edit(`\`___SLOTS___\`\n${slot1} ${slot2} ${slot3} ${message.author.username} ${money} ${args[0]} iddiaya koydu\n\`|         |\` ve ${money} ${args[0]} kaybettin!\n\`|         |\``)
      }, 5000)
      }
      );

  }
};
module.exports.configuration = {
    name: "slot",
    aliases: ["slots", "s"],
    usage: "slots [miktar]",
    description: "Belirtilen miktarda iddiaya girersiniz."
};