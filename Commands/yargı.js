const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const kdb = new qdb.table("kullanici");
const moment = require('moment');
moment.locale('tr');
const yetkili = require("../models/yetkili.js");
const coin = require("../Models/coin.js");
const banLimit = new Map();
module.exports.execute = async(client, message, args, ayar, emoji) => {
  //if(message.author.id !== "518104479317360663") return message.react("🚫");
  let embed = new MessageEmbed().setAuthor(message.guild.name, client.user.avatarURL({dynamic: true})).setColor("BLACK");
  if(!ayar.banciRolleri) return message.channel.csend(embed.setDescription("Sunucuda herhangi bir `YASAKLAMA(BAN)` rolü tanımlanmamış. `PANEL` komutunu kullanmayı deneyin.")).then(x => x.delete({timeout: 5000}));
  if(!ayar.banciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.roles.cache.has(ayar.sahipRolu)) return message.react('❌');
  let victim = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  let cezano = qdb.fetch(`CezaNo.${message.guild.name}`) + 1;
  let reason = args.splice(1).join(" ")
  if (!victim) {
    let kisi = await client.users.fetch(args[0]);
    if(kisi) {
      message.guild.members.ban(kisi.id, {reason: reason, days: 7 }).catch();
      message.channel.send(embed.setDescription(`**${kisi.tag}** sunucudan yasaklandı! ${reason ? `**Sebep:** ${reason}` :"Belirtilmedi!"} (\`#${cezano}\`)`).setImage("https://i.pinimg.com/originals/b2/84/33/b28433c392959f923ff0d736cd89dcbd.gif"))
      qdb.add(`CezaNo.${message.guild.name}`, 1)
    return;
    } else {
      message.channel.send(embed.setDescription("Geçerli bir üye ve sebep belirtmelisin!")).then(x => x.delete({timeout: 5000}));
   return;
    };
  };

  if(message.member.roles.highest.position <= victim.roles.highest.position) return message.channel.send(embed.setDescription("Banlamaya çalıştığın üye senle aynı yetkide veya senden üstün!")).then(x => x.delete({timeout: 5000}));
  if (5 > 0 && banLimit.has(message.author.id) && banLimit.get(message.author.id) == 5) return message.inlineReply("3 Dakikada beş kere kullanabilirsin!").then(x => x.delete({timeout: 5000}));
  if(!victim.bannable) return message.channel.send(embed.setDescription("Botun yetkisi belirtilen üyeyi banlamaya yetmiyor!")).then(x => x.delete({timeout: 5000}));
  victim.send(embed.setDescription(`${message.author} tarafından **${reason}** sebebiyle sunucudan banlandın.`)).catch();
  message.guild.members.ban(victim.id, {reason: reason, days: 7 }).catch();
  kdb.add(`kullanici.${message.author.id}.ban`, 1);
  kdb.push(`kullanici.${victim.id}.sicil`, {
      Yetkili: message.author.id,
      Tip: "BAN",
      Sebep: reason,
      Zaman: Date.now()
    });
  qdb.add(`CezaNo.${message.guild.name}`, 1)
  await coin.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: 10 } }, { upsert: true });
  await yetkili.findByIdAndUpdate(message.author.id, { $inc: { topceza: 1, chatmute: 0, sesmute: 0, jail: 0, kick: 0, ban: 1 } }, { upsert: true });
  message.channel.send(embed.setDescription(`**${victim.user.tag}** sunucudan yasaklandı! ${reason ? `**Sebep:** ${reason}` :"Belirtilmedi!"} (\`#${cezano}\`)`).setImage("https://i.pinimg.com/originals/b2/84/33/b28433c392959f923ff0d736cd89dcbd.gif"))
  if (5 > 0) {
    if (!banLimit.has(message.author.id)) banLimit.set(message.author.id, 1);
    else banLimit.set(message.author.id, banLimit.get(message.author.id) + 1);
    setTimeout(() => {
      if (banLimit.has(message.author.id)) banLimit.delete(message.author.id);
    }, 1000 * 60 * 3);
  };
};
module.exports.configuration = {
    name: "yargı",
    aliases: ["yargi"],
    usage: "yargı [üye]",
    description: "Belirtilen üyenin avatarını gösterir."
};