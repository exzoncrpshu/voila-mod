const { MessageEmbed } = require("discord.js");
const exzowoncy = require("../Models/exzowoncy.js");

module.exports.execute = async(client, message, args, ayar, emoji) => {

  const qdb = require("quick.db");
  let check = await qdb.get(`bank.account.${message.author.id}`)
  if (!check) {
    message.channel.send(`**${message.author.username} |** Bu oyunu oynamak için bir banka hesabına sahip olmalısın! **!hesap oluştur** yazarak oluşturabilirsin.`)
    return
  }
//  if(!ayar.teyitciRolleri) return message.channel.csend("**Roller ayarlanmamış!**").then(x => x.delete({timeout: 5000}));
  //if(!ayar.teyitciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.roles.cache.has(ayar.sahipRolu)) return message.react('🚫');
  const coinData = await exzowoncy.findOne({ userID: message.author.id }); // ${coinData.toLocaleString() ? coinData.coin.toLocaleString() : 0}
if(!coinData) return message.channel.send(`**🚫 ${message.author.username} |** hiç exzowoncy bakiyen bulunmuyor!`)
message.channel.send(`**${client.emoji("exzowoncy")} | ${message.author.username},** bakiyende olan **__${coinData.toLocaleString() ? coinData.coin.toLocaleString() : 0}__ exzowoncy!**`)

};
module.exports.configuration = {
    name: "cash",
    aliases: ["xp", "puanım", "bakiye", "bakiyem"],
    usage: "cash",
    description: "Belirtilen üyenin avatarını gösterir."
};