const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const db = new qdb.table("ayarlar");
const kdb = new qdb.table("kullanici");

module.exports.execute = (client, message, args, ayar, emoji) => {
 
 if(!message.member.roles.cache.has(ayar.boosterRolu) && !message.member.roles.cache.has(ayar.sahipRolu)) return message.react('❌');
  let isim = args.slice(0).join(' ');
  if(!args[0]) return message.channel.send(new MessageEmbed().setDescription(`Gecerli bir isim yazmalısın.`).setAuthor(message.member.displayName, message.author.avatarURL()).setColor(client.randomColor())).then(x => x.delete({timeout: 5000}))
  yazilacakIsim = `${message.author.username.includes(ayar.tag) ? ayar.tag : (ayar.ikinciTag ? ayar.ikinciTag : (ayar.tag || ""))} ${isim}`;
 message.member.setNickname(`${yazilacakIsim}`)
  let embed = new MessageEmbed().setDescription(`${message.author} ismin "${yazilacakIsim}" olarak ayarlandı.`).setColor("RANDOM").setAuthor(message.member.displayName, message.author.avatarURL())
	message.inlineReply(embed);
};
module.exports.configuration = {
    name: "bisim",
    aliases: ["zengin", "bi"],
    usage: "bisim [isim]",
    description: "Kullanan üyenin ismini değiştirir."
};