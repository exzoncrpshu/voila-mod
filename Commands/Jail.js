const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const jdb = new qdb.table("cezalar");
const db = new qdb.table("ayarlar");
const kdb = new qdb.table("kullanici");
const moment = require('moment');
moment.locale('tr');
const yetkili = require("../models/yetkili.js");
const coin = require("../Models/coin.js");
const jailLimit = new Map();
module.exports.execute = async (client, message, args, ayar, emoji) => {
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor("RANDOM");
  if(!ayar.jailRolu || !ayar.jailciRolleri) return message.channel.csend("**Roller ayarlanmamış!**").then(x => x.delete({timeout: 5000}));
  if(!ayar.jailciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.roles.cache.has(ayar.sahipRolu)) return message.react('❌');
  let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  let reason = args.splice(1).join(" ");
  let tarih = Date.now()
  let cezano = qdb.fetch(`CezaNo.${message.guild.name}`) + 1;
  if(!uye || !reason) return message.channel.send(embed.setDescription("Geçerli bir üye ve sebep belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  if (message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(embed.setDescription(`Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!`)).then(x => x.delete({timeout: 5000}));
  if (3 > 0 && jailLimit.has(message.author.id) && jailLimit.get(message.author.id) == 3) return message.inlineReply("3 Dakikada üç kere kullanabilirsin!").then(x => x.delete({timeout: 5000}));
  let jaildekiler = jdb.get(`jail`) || [];
  await uye.roles.set(uye.roles.cache.has(ayar.boosterRolu) ? [ayar.jailRolu, ayar.boosterRolu] : [ayar.jailRolu]).catch();
  if (!jaildekiler.some(j => j.includes(uye.id))) {
    jdb.push(`jail`, `j${uye.id}`);
    kdb.add(`kullanici.${message.author.id}.jail`, 1);
    kdb.push(`kullanici.${uye.id}.sicil`, {
      Yetkili: message.author.id,
      Tip: "JAIL",
      Sebep: reason,
      Zaman: Date.now()
    });
  };
  qdb.add(`CezaNo.${message.guild.name}`, 1)
  await coin.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: 10 } }, { upsert: true });
  await yetkili.findByIdAndUpdate(message.author.id, { $inc: { topceza: 1, chatmute: 0, sesmute: 0, jail: 1, kick: 0, ban: 0 } }, { upsert: true });
  if(uye.voice.channel) uye.voice.kick().catch();
  message.channel.send(embed.setDescription(`${uye} üyesi, ${uye.roles.cache.filter(a => a.name !== "@everyone").map(x => x).join(', ')} rolleri verilerek jaile atıldı! Sebep: \`${reason}\` (\`#${cezano}\`)`)).catch();
  if(ayar.jailLogKanali && client.channels.cache.has(ayar.jailLogKanali)) client.channels.cache.get(ayar.jailLogKanali).send(new MessageEmbed().setColor("RED").setDescription(`${uye} üyesi, ${uye.roles.cache.filter(a => a.name !== "@everyone").map(x => x).join(', ')} rolleri verilerek jaile atıldı!\n\n• Ceza ID: \`#${cezano}\`\n• Jaile Atılan Üye: ${uye} (\`${uye.user.tag}\` - \`${uye.user.id}\`)\n• Jaile Atan Yetkili: ${message.author} (\`${message.author.tag}\` - \`${message.author.id}\`)\n• Jaile Atma Tarihi: \`${moment(tarih).format('DD MMMM YYYY HH:mm')}\`\n• Jaile Atılma Sebebi: \`${reason}\``)).catch();

  if (3 > 0) {
    if (!jailLimit.has(message.author.id)) jailLimit.set(message.author.id, 1);
    else jailLimit.set(message.author.id, jailLimit.get(message.author.id) + 1);
    setTimeout(() => {
      if (jailLimit.has(message.author.id)) jailLimit.delete(message.author.id);
    }, 1000 * 60 * 3);
  };
};
module.exports.configuration = {
  name: "jail",
  aliases: ['cezalı', 'ceza'],
  usage: "jail [üye] [sebep]",
  description: "Belirtilen üyeyi jaile atar."
};