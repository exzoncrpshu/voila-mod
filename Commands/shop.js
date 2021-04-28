const { MessageEmbed } = require("discord.js");
const exzowoncy = require("../Models/exzowoncy.js");
const items = require('../exzsettings/shopItems.js');

module.exports.execute = async(client, message, args, ayar, emoji) => {

  const qdb = require("quick.db");
  let check = await qdb.get(`bank.account.${message.author.id}`)
  if (!check) {
    message.channel.send(`**🚫 ${message.author.username} |** Shopa bakmak için bir banka hesabına sahip olmalısın! **!hesap oluştur** yazarak oluşturabilirsin.`)
    return
  }
  const coinData = await exzowoncy.findOne({ userID: message.author.id }); // ${coinData.toLocaleString() ? coinData.coin.toLocaleString() : 0}
if(!coinData) return message.channel.send(`**${client.emoji("exzowoncy")} | ${message.author.username},** hiç exzowoncy bulunmuyor.`)
let bal = coinData.coin
if (!items.length === 0) return message.reply(`**🚫 ${message.author.username} |** Markete daha ürün gelmemiş!`)
const shopList = items.map((value, index) => {
    cryonicx = new MessageEmbed()
    cryonicx.setColor("RANDOM")
    cryonicx.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
    cryonicx.setFooter(`Satın almak için: !buy [item-ismi]`)
    if (bal > value.price) {
        return `✅ #${index+1} ${value.item} ==> ${value.price} 🪙`
    } else {
        return `🚫 #${index+1} ${value.item} ==> ${value.price} 🪙`
    }
});
cryonicx.setDescription(`Aşağıdan exzowoncy bakiyenizin yettiği ürünü satın alabilirsiniz. Toplam bakiyeniz: **${bal.toLocaleString()}**\n\n${shopList.join("\n")}`)
message.channel.send(cryonicx)


};
module.exports.configuration = {
    name: "shop",
    aliases: ["mağaza", "market"],
    usage: "shop",
    description: "Belirtilen üyenin avatarını gösterir."
};