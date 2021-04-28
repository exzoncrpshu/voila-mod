const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const db = new qdb.table("ayarlar");
const jdb = new qdb.table("cezalar");
const kdb = new qdb.table("kullanici");
const ms = require('ms');
const yetkili = require("../models/yetkili.js");
const coin = require("../Models/coin.js");

module.exports.execute = async (client, message, args, ayar, emoji) => {
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor("RANDOM");
  if(!ayar.muteciRolleri) return message.channel.csend("**Roller ayarlanmamış!**").then(x => x.delete({timeout: 5000}));
  if(!ayar.muteciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.roles.cache.has(ayar.sahipRolu)) return message.react('❌');
  let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if(!uye) return message.channel.send(embed.setDescription("Geçerli bir üye belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  if (message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(embed.setDescription(`Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!`)).then(x => x.delete({timeout: 5000}));
  let muteler = jdb.get(`tempsmute`) || [];
  let sure = args[1];
  let reason = args.splice(2).join(" ");
  let cezano = qdb.fetch(`CezaNo.${message.guild.name}`) + 1;
  if(!sure || !ms(sure) || !reason) return message.channel.send(embed.setDescription("Geçerli bir süre ve sebel belirt!")).then(x => x.delete({timeout: 5000}));
  if(uye.voice.channel) uye.voice.setMute(true).catch();
  if (!muteler.some(j => j.id == uye.id)) {
    jdb.push(`tempsmute`, {id: uye.id, kalkmaZamani: Date.now()+ms(sure)})
    kdb.add(`kullanici.${message.author.id}.sesmute`, 1);
    kdb.push(`kullanici.${uye.id}.sicil`, {
      Yetkili: message.author.id,
      Tip: "VMUTE",
      Sebep: reason,
      Zaman: Date.now()
    });
  };
  qdb.add(`CezaNo.${message.guild.name}`, 1)
  await coin.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: 10 } }, { upsert: true });
  await yetkili.findByIdAndUpdate(message.author.id, { $inc: { topceza: 1, chatmute: 0, sesmute: 1, jail: 0, kick: 0, ban: 0 } }, { upsert: true });
  message.channel.send(embed.setDescription(`${uye} üyesi, ${sure} süresince seste susturuldu! Sebep: \`${reason}\` (\`#${cezano}\`)`)).catch();
};
module.exports.configuration = {
  name: "sesmute",
  aliases: ['ses-mute', 'voice-mute', 'sestesustur', 'vmute'],
  usage: "sesmute [üye] [süre] [sebep]",
  description: "Belirtilen üyeyi seste belirtilen süre kadar muteler."
};