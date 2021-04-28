const { MessageEmbed } = require("discord.js");
const qdb = require('quick.db');
const kdb = new qdb.table("kullanici");
const moment = require('moment');
moment.locale('tr');
const yetkili = require("../models/yetkili.js");
const coin = require("../Models/coin.js");
const kickLimit = new Map();
module.exports.execute = async (client, message, args, ayar, emoji) => {
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor("RAMDOM");
  if(!ayar.banciRolleri) return message.channel.csend(embed.setDescription("Sunucuda herhangi bir `YASAKLAMA(BAN)` rolü tanımlanmamış. `PANEL` komutunu kullanmayı deneyin.")).then(x => x.delete({timeout: 5000}));
  if(!ayar.banciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.roles.cache.has(ayar.sahipRolu)) return message.react('❌');
  let victim = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  let reason = args.splice(1).join(" ");
  let tarih = Date.now()
  let cezano = qdb.fetch(`CezaNo.${message.guild.name}`) + 1;
  if (!victim || !reason) return message.channel.send(embed.setDescription("Geçerli bir üye ve sebep belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  if(message.member.roles.highest.position <= victim.roles.highest.position) return message.channel.csend(embed.setDescription("Kicklemeye çalıştığın üye senle aynı yetkide veya senden üstün!")).then(x => x.delete({timeout: 5000}));
  if (5 > 0 && kickLimit.has(message.author.id) && kickLimit.get(message.author.id) == 5) return message.inlineReply("3 Dakikada beş kere kullanabilirsin!").then(x => x.delete({timeout: 5000}));
  if(!victim.kickable) return message.channel.send(embed.setDescription("Botun yetkisi belirtilen üyeyi kicklemeye yetmiyor!")).then(x => x.delete({timeout: 5000}));
  await victim.send(embed.setDescription(`${message.author} tarafından **${reason}** sebebiyle sunucudan kicklendin.`)).catch();
  victim.kick({reason: reason}).catch();
  kdb.add(`kullanici.${message.author.id}.kick`, 1);
    kdb.push(`kullanici.${victim.id}.sicil`, {
      Yetkili: message.author.id,
      Tip: "KICK",
      Sebep: reason,
      Zaman: Date.now()
    });
    qdb.add(`CezaNo.${message.guild.name}`, 1)
    await coin.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: 10 } }, { upsert: true });
    await yetkili.findByIdAndUpdate(message.author.id, { $inc: { topceza: 1, chatmute: 0, sesmute: 1, jail: 0, kick: 0, ban: 0 } }, { upsert: true });
  message.channel.send(embed.setDescription(`\`${victim.user.tag}\` üyesi sunucudan atıldı! Sebep: \`${reason}\` (\`#${cezano}\`)`));
  if(ayar.banLogKanali && client.channels.cache.has(ayar.banLogKanali)) client.channels.cache.get(ayar.banLogKanali).csend(new MessageEmbed().setDescription(`${victim} üyesi sunucudan atıldı!\n\n• Ceza ID: \`#${cezano}\`\n• Yasaklanan Üye: ${victim} (\`${victim.user.tag} - ${victim.user.id}\`)\n• Yasaklayan Yetkili: ${message.author} (\`${message.author.tag} - ${message.author.id}\`)\n• Yasaklama Tarihi: \`${moment(tarih).format('DD MMMM YYYY HH:mm')}\`\n• Sebep: \`${reason}\``).setColor("BLACK"))

  if (5 > 0) {
    if (!kickLimit.has(message.author.id)) kickLimit.set(message.author.id, 1);
    else kickLimit.set(message.author.id, kickLimit.get(message.author.id) + 1);
    setTimeout(() => {
      if (kickLimit.has(message.author.id)) kickLimit.delete(message.author.id);
    }, 1000 * 60 * 3);
  };
};
module.exports.configuration = {
  name: "kick",
  aliases: ["at"],
  usage: "kick [üye] [sebep]",
  description: "Belirtilen üyeyi sunucudan atar."
};