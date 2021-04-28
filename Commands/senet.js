const { MessageEmbed } = require("discord.js");
const coin = require("../Models/exzowoncy.js");
const conf = require("../exzsettings/config.json")
const ms = require("parse-ms")
const moment = require("moment")
const qdb = require("quick.db");
const code = require("@codedipper/random-code")

module.exports.execute = async(client, message, args, ayar, emoji) => {


  let check = await qdb.get(`bank.account.${message.author.id}`)
  if (!check) {
    message.channel.send(`**${message.author.username} |** Bu oyunu oynamak için bir banka hesabına sahip olmalısın! **!hesap oluştur** yazarak oluşturabilirsin.`)
    return
  }

  const coinData = await coin.findOne({ userID: message.author.id }); // ${coinData.toLocaleString() ? coinData.coin.toLocaleString() : 0}
let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({display: true})).setColor("RANDOM")
   //if(message.author.id !== "518104479317360663") return message.react("🚫")

   let balance = coinData.coin

  
    if (args[0] === "çek") {
      if (!args[1]) {
         await message.channel.send(`**${message.author.username} |** tahsil edilecek senetin kodunu gir!`).then(x => x.delete({timeout: 10000}))
         return
      }
      let cheque = await qdb.get(`cheque.${args[1]}`)
      if (!cheque) {
         await message.channel.send(`**${message.author.username} |** böyle bir senet bulunmuyor!`).then(x => x.delete({timeout: 10000}))
         return
      }
      await coin.findOneAndUpdate({ userID: message.author.id }, { $inc: { coin: cheque } }, { upsert: true });
      await qdb.delete(`cheque.${args[1]}`)
      await message.channel.send(`**:moneybag: ${message.author.username},** Girdiğin çekten toplamda **${cheque}** exzowoncy çekildi!`)
      return
    }
  
    if (!args[0]) {
       await message.channel.send(`**${message.author.username} |** çekte kaç exzowoncy olmasını istediğini belirt!\nNot: DM kutunun açık olduğundan emin ol!`)
       return
      }
    if (isNaN(args[0])) {
      await message.channel.send(`**${message.author.username} |** çekte kaç exzowoncy olmasını istediğini belirt!\nNot: DM kutunun açık olduğundan emin ol!`)
    }
    if (args[0] > balance) {
       message.channel.send(`**${message.author.username} |** bakiyende bu kadar exzowoncy bulunmuyor!`)
       return
    }
    let kod = code(30, ["X","Z","Y","A","B","C","D","E","F","G","H","I","J","K","Y","M","N","O"])
    await coin.findOneAndUpdate({ userID: message.author.id }, { $inc: { coin: -args[0] } }, { upsert: true });
  await qdb.set(`cheque.${kod}`, args[0])
  message.author.send(`**${message.author.username} |** **${args[0]} exzowoncy** değerinde ki senetiniz oluşturuldu! Bu çeki birisine verebilirsiniz veya tekrar kullanabilirsiniz.\n\nÇek Kodu: ||\`${kod}\`||`).catch(err => { 
    message.channel.send(`DM Kutun kapalı olduğu için kodu gönderemiyorum! Kodunu \`${client.users.cache.get("518104479317360663").tag} yetkilisinden isteyebilirsin.`)
  client.users.cache.get("518104479317360663").send(`Kod İletilemedi! Kod bilgileri;\n\nSahip: ${message.author} (\`${message.author.tag}\` - \`${message.author.id}\`)\nKod: ||\`${kod}\`||`)
  })
  await message.channel.send(`**${message.author.username} |** istenilen çeki oluşturup bilgilerini özelden attım!`);
  return


};
module.exports.configuration = {
    name: "senet",
    aliases: ["çekoluştur", "senetler"],
    usage: "senet",
    description: "senet oluşturur."
};