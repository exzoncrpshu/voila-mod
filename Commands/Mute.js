const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const db = new qdb.table("ayarlar");
const jdb = new qdb.table("cezalar");
const kdb = new qdb.table("kullanici");
const ms = require('ms');
const moment = require('moment');
moment.locale('tr');
const yetkili = require("../models/yetkili.js");
const coin = require("../Models/coin.js");
const muteLimit = new Map();

module.exports.execute = async (client, message, args, ayar, emoji) => {
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor("RANDOM");
  if(!ayar.muteRolu || !ayar.muteciRolleri) return message.channel.csend("**Roller ayarlanmamış!**").then(x => x.delete({timeout: 5000}));
  if(!ayar.muteciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.roles.cache.has(ayar.sahipRolu)) return message.react('❌');
  let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if(!uye) return message.channel.send(embed.setDescription("Geçerli bir üye belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  if (message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(embed.setDescription(`Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!`)).then(x => x.delete({timeout: 5000}));
  if (5 > 0 && muteLimit.has(message.author.id) && muteLimit.get(message.author.id) == 5) return message.inlineReply("3 Dakikada beş kere kullanabilirsin!").then(x => x.delete({timeout: 5000}));
  let muteler = jdb.get(`tempmute`) || [];
  let sure = args[1];
  let reason = args.splice(2).join(" ");
  let tarih = Date.now()
  let cezano = qdb.fetch(`CezaNo.${message.guild.name}`) + 1;
  if(!sure || !ms(sure) || !reason) return message.channel.send(embed.setDescription("Geçerli bir süre ve sebep belirt!")).then(x => x.delete({timeout: 5000}));
  await uye.roles.add(ayar.muteRolu).catch();
  if (!muteler.some(j => j.id == uye.id)) {
    jdb.push(`tempmute`, {id: uye.id, kalkmaZamani: Date.now()+ms(sure)})
    kdb.add(`kullanici.${message.author.id}.mute`, 1);
    kdb.push(`kullanici.${uye.id}.sicil`, {
      Yetkili: message.author.id,
      Tip: "MUTE",
      Sebep: reason,
      Zaman: Date.now()
    });
  };
  qdb.add(`CezaNo.${message.guild.name}`, 1)
  await coin.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: 10 } }, { upsert: true });
  await yetkili.findByIdAndUpdate(message.author.id, { $inc: { topceza: 1, chatmute: 0, sesmute: 1, jail: 0, kick: 0, ban: 0 } }, { upsert: true });
  message.channel.send(embed.setDescription(`${uye} üyesi, **${client.convertDuration(ms(sure))}** süresince susturuldu! Sebep: \`${reason}\` (\`#${cezano}\`)`)).catch();
  if(ayar.muteLogKanali && client.channels.cache.has(ayar.muteLogKanali)) client.channels.cache.get(ayar.muteLogKanali).send(new MessageEmbed().setColor("RED").setDescription(`${uye} üyesi metin kanallarında **${client.convertDuration(ms(sure))}** süresince susturuldu!\n\n• Ceza ID: \`#${cezano}\`\n• Susturulan Üye: ${uye} (\`${uye.user.tag} - ${uye.user.id}\`)\n• Susturan Yetkili: ${message.author} (\`${message.author.tag} - ${message.author.id}\`)\n• Susturulma Tarihi: \`${moment(tarih).format('DD MMMM YYYY HH:mm')}\`\n• Bitiş Tarihi: \`${moment(tarih+ms(sure)).format('DD MMMM YYYY HH:mm')}\`\n• Sebep: \`${reason}\``)).catch();

  if (5 > 0) {
    if (!muteLimit.has(message.author.id)) muteLimit.set(message.author.id, 1);
    else muteLimit.set(message.author.id, muteLimit.get(message.author.id) + 1);
    setTimeout(() => {
      if (muteLimit.has(message.author.id)) muteLimit.delete(message.author.id);
    }, 1000 * 60 * 3);
  };
};
module.exports.configuration = {
  name: "mute",
  aliases: ['susturmak'],
  usage: "mute [üye] [süre] [sebep]",
  description: "Belirtilen üyeyi süreli muteler."
};