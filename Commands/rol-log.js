const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const moment = require("moment");
require("moment-duration-format");
const db = new qdb.table("ayarlar");
const kdb = new qdb.table("kullanici");
const RoleDatabase = require("../Models/rollogs.js");

module.exports.execute = async(client, message, args, ayar, emoji) => {
  if(!ayar.muteRolu || !ayar.muteciRolleri) return message.channel.csend("**Roller ayarlanmamış!**").then(x => x.delete({timeout: 5000}));
  if(!ayar.teyitciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.roles.cache.has(ayar.sahipRolu)) return message.react('❌');

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!member) return message.channel.send(new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL()).setDescription(`Geçerli bir üye belirt!`)).then(x => x.delete({timeout: 5000}))
    let embed = new MessageEmbed().setColor("RANDOM").setAuthor(member.user.tag, member.user.avatarURL({ dynamic: true }))
    let Stark = await RoleDatabase.findOne({ guildID: message.guild.id, kullanıcıID: member.id })
    if(!Stark) message.channel.send(embed.setDescription(`Veri tabanında geçmiş rol değişimleri bulunamadı!`))
    let listening = Stark.rolveridb.slice(0, 10).map((v, i) => `${v.type} Rol: ${message.guild.roles.cache.get(v.rolid)} Yetkili: ${message.guild.members.cache.get(v.staffID)}\nTarih: \`${new Date(v.tarih).toTurkishFormatDate()}\` ` || "Veri bulunmuyor.").join("\n\n")
  
    message.channel.send(embed.setDescription(`${member} üyesinin toplamda **${Stark.rolveridb.length ? Stark.rolveridb.length : "0" }** rol bilgisi bulunmaktadır.\n\n${listening}`))
  

};
module.exports.configuration = {
    name: "rol-log",
    aliases: ["rollog"],
    usage: "rollog [üye]",
    description: "Belirtilen üyenin tüm sicilini gösterir."
};