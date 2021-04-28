const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const db = new qdb.table("ayarlar");
const kayitsizLimit = new Map();
module.exports.execute = async (client, message, args, ayar, emoji) => {
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor("RANDOM");
  if(!ayar.teyitciRolleri) return message.channel.csend("**Roller ayarlanmamış!**").then(x => x.delete({timeout: 5000}));
  if(!ayar.teyitciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.roles.cache.has(ayar.sahipRolu)) return message.react('❌');
  let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if(!uye) return message.channel.send(embed.setDescription("Geçerli bir üye belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  if (message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(embed.setDescription(`Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!`)).then(x => x.delete({timeout: 5000}));
  if (5 > 0 && kayitsizLimit.has(message.author.id) && kayitsizLimit.get(message.author.id) == 5) return message.inlineReply("3 Dakikada beş kere kullanabilirsin!").then(x => x.delete({timeout: 5000}));
  if(uye.manageable) uye.setNickname(uye.user.username).catch();
  await uye.roles.set(ayar.teyitsizRolleri || []).catch();
  message.channel.send(embed.setDescription(`${uye} üyesi, ${message.author} tarafından kayıtsıza atıldı!`)).catch();

  if (5 > 0) {
    if (!kayitsizLimit.has(message.author.id)) kayitsizLimit.set(message.author.id, 1);
    else kayitsizLimit.set(message.author.id, kayitsizLimit.get(message.author.id) + 1);
    setTimeout(() => {
      if (kayitsizLimit.has(message.author.id)) kayitsizLimit.delete(message.author.id);
    }, 1000 * 60 * 3);
  };
};
module.exports.configuration = {
  name: "kayıtsız",
  aliases: [],
  usage: "kayıtsız [üye]",
  description: "Belirtilen üyeyi kayıtsıza atar."
};