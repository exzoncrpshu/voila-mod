const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const moment = require("moment");
require("moment-duration-format");
const db = new qdb.table("ayarlar");
const kdb = new qdb.table("kullanici");

module.exports.execute = async(client, message, args, ayar, emoji) => {
  if(!ayar.sahipRolu) return message.channel.csend("**Roller ayarlanmamış!**").then(x => x.delete({timeout: 5000}));
  if(!message.member.hasPermission("ADMINISTRATOR") && !message.member.roles.cache.has(ayar.sahipRolu)) return message.react('❌');
  let kullanici = message.mentions.users.first() || client.users.cache.get(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(" ").toLowerCase())).first(): message.author) || message.author;
  let uye = message.guild.member(kullanici);
  let sicil = kdb.get(`kullanici.${uye.id}.sicil`) || [];
  sicil = sicil.reverse();
  let güvenlilik;
  if(sicil.length > 9){ güvenlilik = "Şüpheli!"}
  if(sicil.length < 6){ güvenlilik = "Güvenli!"}
  if(sicil.length < 3){ güvenlilik = "Çok Güvenli!"}
  if(sicil.length > 10){ güvenlilik = "Tehlikeli!"}
  if(sicil.length > 15){ güvenlilik = "Çok Tehlikeli!"}
  let listedPenal = sicil.length > 0 ? sicil.map((value, index) => `\`${index + 1}.\` **[${value.Tip}]** ${new Date(value.Zaman).toTurkishFormatDate()} tarihinde \`${value.Sebep ? value.Sebep :"Bulunmuyor!"}\` nedeniyle ${message.guild.members.cache.has(value.Yetkili) ? message.guild.members.cache.get(value.Yetkili) : value.Yetkili} tarafından cezalandırıldı. Ek Not: \`${value.Ceza ? value.Ceza :"Bulunmuyor!"}\``).join("\n") : "Temiz!";
  client.splitEmbedWithDesc(`**${uye} Üyesinin Sicili (\`${güvenlilik}\`)**\n\n ${listedPenal}`,
                           {name: message.guild.name, icon: message.guild.iconURL({dynamic: true, size: 2048})},
                           {name: ``, icon: false},
                           {setColor: ["3498DB"], setTimestamp: [Date.now()]}).then(list => {
    list.forEach(item => {
      message.channel.send(item);
    });
  });
}; //${client.users.cache.get("518104479317360663").tag}
module.exports.configuration = {
    name: "sicil",
    aliases: ["geçmiş"],
    usage: "sicil [üye]",
    description: "Belirtilen üyenin tüm sicilini gösterir."
};