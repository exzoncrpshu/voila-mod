const { MessageEmbed } = require("discord.js");
const exzowoncy = require("../Models/exzowoncy.js");
const inventory = require(`../Models/inventory.js`);
module.exports.execute = async(client, message, args, ayar, emoji) => {
 // if(message.author.id !== "518104479317360663") return message.react("🚫")
  const qdb = require("quick.db");
  let check = await qdb.get(`bank.account.${message.author.id}`)
  if (!check) {
    message.channel.send(`**🚫 ${message.author.username} |** Bu oyunu oynamak için bir banka hesabına sahip olmalısın! **!hesap oluştur** yazarak oluşturabilirsin.`)
    return
  }
  const inv = await inventory.findOne({ Guild: message.guild.id, User: message.author.id });
  if(!inv) return message.channel.send(`**🚫 ${message.author.username} |** envanterin boş gözüküyor... :c`)
  let cash = inv.cash
inventory.findOne({ Guild: message.guild.id, User: message.author.id }, async(err, data) => {
  if (!data) return message.channel.send(`**🚫 ${message.author.username} |** Envanterin boş gözüküyor... :c`)
  const mappadData = Object.keys(data.Inventory).map((key) => {
      cryonicx = new MessageEmbed()
      return `${key} (${data.Inventory[key]})`;
  })
  cryonicx.setColor("RANDOM")
  cryonicx.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
  cryonicx.setDescription(`${message.author} Tüm mal varlıklarınız aşağıda listelenmiştir. Tüm mal varlıklarınızın değeri: **${cash.toLocaleString()}  exzowoncy**\n\n${mappadData.join("\n")}`)
  message.channel.send(cryonicx)
})
};
module.exports.configuration = {
    name: "inventory",
    aliases: ["envanter", "varlıklarım", "inv"],
    usage: "inventory",
    description: "Belirtilen üyenin avatarını gösterir."
};