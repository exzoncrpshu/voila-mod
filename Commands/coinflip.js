const { MessageEmbed } = require("discord.js");
const coin = require("../Models/exzowoncy.js");
const conf = require("../exzsettings/config.json")
const cfLimit = new Map();
const ms = require("parse-ms")
const moment = require("moment")
const qdb = require("quick.db");

module.exports.execute = async(client, message, args, ayar, emoji) => {

 
  let check = await qdb.get(`bank.account.${message.author.id}`)
  if (!check) {
    message.channel.send(`**${message.author.username} |** Bu oyunu oynamak için bir banka hesabına sahip olmalısın! **!hesap oluştur** yazarak oluşturabilirsin.`)
    return
  }
  const coinData = await coin.findOne({ userID: message.author.id }); // ${coinData.toLocaleString() ? coinData.coin.toLocaleString() : 0}


// if(message.author.id !== "518104479317360663") return message.react("🚫")
    let balance = coinData.coin
 
    let timeout = 1000*15
    let bump = await qdb.get(`cooldowns.cf.${message.author.id}`)
    if (bump !== null && timeout - (Date.now() - bump) > 0) {
      let time = ms(timeout - (Date.now() - bump))
      return message.channel.send(`**:stopwatch: |** Nu! **${message.author.username}!** Lütfen ${time.seconds+1} saniye bekle.`)
    }

   if(!balance) return message.channel.send(`**🚫 ${message.author.username} |** hiç exzowoncy bakiyen bulunmuyor.`)
    if (args[1] < 5) return message.channel.send(`**🚫 ${message.author.username} |** Bu oyunda en az **5 exzowoncy** oynayabilirsin!`).then(x => x.delete({timeout: 10000}))
    if (!(args[0])) return message.channel.send(`**🚫 ${message.author.username} |** Bu oyunu başlatmak için bir seçim yap, **yazı** mı **tura** mı?`).then(x => x.delete({timeout: 10000}))
    if (!isNaN(args[0])) return message.channel.send(`**🚫 ${message.author.username} |** Bu oyunu başlatmak için bir seçim yap, **yazı** mı **tura** mı?`).then(x => x.delete({timeout: 10000}))
    if (isNaN(args[1])) return message.channel.send(`**🚫 ${message.author.username} |**  oynamak istediğin miktarı belirt!`).then(x => x.delete({timeout: 10000}))
    if (args[1] > 50000) return message.channel.send(`**🚫 ${message.author.username} |** Bu oyunda en fazla **50.000 exzowoncy** oynayabilirsin!`).then(x => x.delete({timeout: 10000}))
    if (args[1] > balance) return message.channel.send(`**🚫 ${message.author.username} |** Oynamak istediğin exzowoncy miktarına sahip değilsin!`).then(x => x.delete({timeout: 10000}))
    if (!args[0] || (args[0] !== 'yazı' && args[0] !== 'yazi' && args[0] !== 'tura')) return message.channel.send(`**${message.author.username} |** Bu oyunu başlatmak için bir seçim yap, **yazı** mı **tura** mı?`).then(x => x.delete({timeout: 10000}))
    let chances = ["yazı","tura"].random()
  
    if (chances === "yazı" || chances === "yazi") { // ${client.emoji("")}
      if (args[0] === "yazı" || args[0] === "yazi") {
        message.channel.send(`**${message.author.username}** | ${client.emoji("exzowoncy")} **${args[1]} exzowoncy** harcadı ve **yazı** seçti!\nPara dönüyor... ${client.emoji("coinflip")}`).then(x => { 
          setTimeout(function(){
          x.edit(`**${message.author.username}** | ${client.emoji("exzowoncy")} **${args[1]} exzowoncy** harcadı ve **yazı** seçti!\nPara dönüyor... ${client.emoji("tail")} ve ${client.emoji("exzowoncy")} **${args[1] * 2} exzowoncy** kazandın!!`)
          },2500)
          }
          );
          await coin.findOneAndUpdate({ userID: message.author.id }, { $inc: { coin: args[1] } }, { upsert: true });
          await qdb.set(`cooldowns.cf.${message.author.id}`, Date.now())
          return
  
      } else {
        message.channel.send(`**${message.author.username}** | ${client.emoji("exzowoncy")} **${args[1]} exzowoncy** harcadı ve **tura** seçti!\nPara dönüyor... ${client.emoji("coinflip")}`).then(x => { 
          setTimeout(function(){ // 
          x.edit(`**${message.author.username}** | ${client.emoji("exzowoncy")} **${args[1]} exzowoncy** harcadı ve **tura** seçti!\nPara dönüyor... ${client.emoji("tail")} ve hepsini kaybettin... :c`)
          },2500)
          }
          );
          await coin.findOneAndUpdate({ userID: message.author.id }, { $inc: { coin: -args[1] } }, { upsert: true });
          await qdb.set(`cooldowns.cf.${message.author.id}`, Date.now())
          return
      }
    } 
  
    if (chances === "tura") {
      if (args[0] === "tura") { 
        message.channel.send(`**${message.author.username}** | ${client.emoji("exzowoncy")} **${args[1]} exzowoncy** harcadı ve **tura** seçti!\nPara dönüyor... ${client.emoji("coinflip")}`).then(x => { 
          setTimeout(function(){
          x.edit(`**${message.author.username}** | ${client.emoji("exzowoncy")} **${args[1]} exzowoncy** harcadı ve **tura** seçti!\nPara dönüyor... ${client.emoji("head")} ve ${client.emoji("exzowoncy")} **${args[1] * 2} exzowoncy** kazandın!!`)
          },2500)
          }
          );
          await coin.findOneAndUpdate({ userID: message.author.id }, { $inc: { coin: args[1] } }, { upsert: true });
          await qdb.set(`cooldowns.cf.${message.author.id}`, Date.now())
          return
  
      } else {
        message.channel.send(`**${message.author.username}** | ${client.emoji("exzowoncy")} **${args[1]} exzowoncy** harcadı ve **yazı** seçti!\nPara dönüyor... ${client.emoji("coinflip")}`).then(x => { 
          setTimeout(function(){
          x.edit(`**${message.author.username}** | ${client.emoji("exzowoncy")} **${args[1]} exzowoncy** harcadı ve **yazı** seçti!\nPara dönüyor... ${client.emoji("head")} ve sen hepsini kaybettin... :c`)
          },2500)
          }
          );
          await coin.findOneAndUpdate({ userID: message.author.id }, { $inc: { coin: -args[1] } }, { upsert: true });
          await qdb.set(`cooldowns.cf.${message.author.id}`, Date.now())
          return
      }
    } 

};
module.exports.configuration = {
    name: "coinflip",
    aliases: ["cf", "yazıtura"],
    usage: "coinflip [yazı/tura] [miktar]",
    description: "Belirtilen miktarda iddiaya girersiniz."
};