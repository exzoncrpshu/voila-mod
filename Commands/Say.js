const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const db = new qdb.table("ayarlar");

// module.exports.onLoad = (client) => {}
module.exports.execute = (client, message, args, ayar, emoji) => {
  if((!ayar.erkekRolleri && !ayar.kizRolleri) || !ayar.teyitciRolleri) return message.channel.csend("**Roller ayarlanmamış!**").then(x => x.delete({timeout: 5000}));
  if(!ayar.teyitciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.roles.cache.has(ayar.sahipRolu)) return message.react('❌');

  let ekipRolu = ayar.ekipRolu || undefined;
  let boosterRolu = ayar.boosterRolu || undefined;
 let symbole = `•` //ayar.tag || undefined;
  const embed = new MessageEmbed().setColor("RANDOM") //.setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }));
  message.channel.send(embed.setDescription(`\`${symbole}\` Sunucuda Toplam \`${message.guild.memberCount}\` üye bulunuyor.\n\`${symbole}\` Sunucuda çevrim içi \`${message.guild.members.cache.filter(u => u.presence.status != "offline").size}\` üye bulunuyor.\n\`${symbole}\` Sunucu tagında toplam \`${message.guild.roles.cache.get(ekipRolu).members.size}\` üye bulunuyor.\n\`${symbole}\` Sunucuyu toplam \`${message.guild.roles.cache.get(boosterRolu).members.size}\` üye boostluyor.\n\`${symbole}\` Sunucu ses kanallarında \`${message.guild.channels.cache.filter(channel => channel.type == "voice").map(channel => channel.members.size).reduce((a, b) => a + b)}\` üye bulunuyor.`));
};

module.exports.configuration = {
    name: "say",
    aliases: ["count","yoklama"],
    usage: "say",
    description: "Sunucu sayımı."
};