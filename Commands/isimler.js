const { MessageEmbed } = require("discord.js");
const kayitlar = require("../models/kayitlar.js");

module.exports.execute = async(client, message, args, ayar, emoji) => {
  let embeed = new MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true })).setColor("RANDOM");
  let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if (!member) return message.channel.send(embeed.setDescription("Geçerli bir üye belirtmelisin!")).then(x => x.delete({ timeout: 5000 }));
  let embed = new MessageEmbed().setAuthor(member.user.tag, member.user.avatarURL({ dynamic: true })).setColor("RANDOM");
  let memberData = await kayitlar.findById(member.id);
  if (!memberData) return message.channel.send(embed.setDescription(`Veritabanında kayıtlı ismi bulunamadı.`));
  message.channel.send(embed.setDescription(`${member} üyesinin sunucuda kaydedilmiş ${memberData.kayitlar.length} ismi bulundu:\n\n${memberData.kayitlar.reverse().slice(0, 30).map((data, index) => `\`${index+1}.\` \`${data.isim}\` (${data.roller.map(r => `<@&${r}>`).join(", ")})`).join("\n")}`));
};

module.exports.configuration = {
  name: "kayıtlar",
  aliases: ["isimler", "teyitler"],
  usage: "isimler [üye]",
  description: "Belirtilen üyenin kayıt geçmişi."
};