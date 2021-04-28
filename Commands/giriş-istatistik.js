const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const db = new qdb.table("ayarlar");
const kdb = new qdb.table("kullanici");
const moment = require("moment");

module.exports.execute = async (client, message, args, ayar, emoji) => {

let Time = 1000 * 60 * 60 * 24
message.reply('**_Veriler alınıyor..._**').then(sila => { 

  setTimeout(() => { 

sila.edit('\u200B');
sila.edit(new MessageEmbed().setColor(client.randomColor()).setTimestamp().setFooter(`${message.member.displayName} tarafından istendi!`, message.author.avatarURL()).setAuthor(message.guild.name, message.guild.iconURL()).setDescription(`**${message.guild.name}** Sunucusuna giriş yapan üyelerin süreye göre istatistiği;`).addField('1 Günlük Giriş', `${message.guild.members.cache.filter(a => (new Date().getTime() - a.joinedTimestamp) < Time).size} Kişi`, true).addField('7 Günlük Giriş', `${message.guild.members.cache.filter(a => (new Date().getTime() - a.joinedTimestamp) < Time * 7).size} Kişi`, true).addField('2 Haftalık Giriş', `${message.guild.members.cache.filter(a => (new Date().getTime() - a.joinedTimestamp) < Time * 14).size} Kişi`, true).addField('1 Aylık Giriş', `${message.guild.members.cache.filter(a => (new Date().getTime() - a.joinedTimestamp) < Time * 28).size} Kişi`, true).addField('3 Aylık Giriş', `${message.guild.members.cache.filter(a => (new Date().getTime() - a.joinedTimestamp) < Time * 90).size} Kişi`, true).addField('4 Aylık Giriş', `${message.guild.members.cache.filter(a => (new Date().getTime() - a.joinedTimestamp) < Time * 120).size} Kişi`, true).addField('6 Aylık Giriş', `${message.guild.members.cache.filter(a => (new Date().getTime() - a.joinedTimestamp) < Time * 180).size} Kişi`, true).addField('9 Aylık Giriş', `${message.guild.members.cache.filter(a => (new Date().getTime() - a.joinedTimestamp) < Time * 270).size} Kişi`, true).addField('1 Yıllık Giriş', `${message.guild.members.cache.filter(a => (new Date().getTime() - a.joinedTimestamp) < Time * 365).size} Kişi`, true))
  }, 5000)
})


};
module.exports.configuration = {
  name: "giriş-istatistik",
  aliases: ["sunucu-istatistik", "si", "gi"],
  usage: "giriş-istatistik",
  description: "Sunucuya giriş istatistiklerini listeler."
};