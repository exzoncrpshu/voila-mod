const { MessageEmbed } = require("discord.js");
const coin = require("../Models/exzowoncy.js");
const conf = require("../exzsettings/config.json")
const slotLimit = new Map();
const ms = require("parse-ms")
const moment = require("moment")
moment.locale("tr")
const qdb = require("quick.db");
const code = require("@codedipper/random-code")

module.exports.execute = async(client, message, args, ayar, emoji) => {

  if(!args[0]) return message.channel.send(`**${message.author.username} |** banka hesabı oluşturmak için **!hesap oluştur** komutunu kullan. Böylece **50,000 exzowoncy** kazanacaksın!`)
  if (args[0] === "oluştur") {

    let check = await qdb.get(`bank.account.${message.author.id}`)
    if (check) {
      message.channel.send(`**${message.author.username} |**  zaten bir banka hesabın var.`)
      return
    }
 
    let kod = code(6, ["0","1","2","3","4","5","6"])
await qdb.set(`bank.infos.${kod}`, {
  Name: message.author.id,
  CardName: "Kişisel",
  Found: Date.now()
})

await qdb.set(`bank.account.${message.author.id}`, kod)
    await coin.findOneAndUpdate({userID: message.author.id }, { $inc: { coin: 50000 } }, { upsert: true });3
    message.channel.send(`**${message.author.username} |** Artık bir banka hesabına sahipsin, hesabına yaklaşık **50,000 exzowoncy** yatırıldı iyi eğlenceler!`)
      return
    }
    

};
module.exports.configuration = {
    name: "hesap",
    aliases: ["acc", "account"],
    usage: "account",
    description: "Banka hesabı açarsınız."
};