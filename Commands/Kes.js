const { MessageEmbed } = require("discord.js");

module.exports.execute = async(client, message, args, ayar, emoji) => {
  if(!ayar.teyitciRolleri) return message.channel.csend("**Roller ayarlanmamış!**").then(x => x.delete({timeout: 5000}));
  if(!ayar.teyitciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.roles.cache.has(ayar.sahipRolu)) return message.react('❌');
	let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor("RANDOM");
  if (!uye) return message.channel.send(embed.setDescription("Ses bağlantısı kesilecek üyeyi belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  if (!uye.voice.channel) return message.channel.send(embed.setDescription("Üye zaten seste bulunmuyor!")).then(x => x.delete({timeout: 5000}));

  message.inlineReply(embed.setDescription(`${uye} üyesi, "${uye.voice.channel.name}" isimli ses kanalından çıkarıldı!`))
  if(uye.voice.channel) uye.voice.kick()
};
module.exports.configuration = {
    name: "kes",
    aliases: ["kes"],
    usage: "kes [üye]",
    description: "Belirtilen üyenin ses bağlantısını keser."
};