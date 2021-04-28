const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const db = new qdb.table("ayarlar");
const kdb = new qdb.table("kullanici");
const moment = require('moment');
moment.locale('tr');

module.exports.execute = async(client, message, args, ayar, emoji) => {
 /* if(!conf.sahip.includes(message.author.id))
	if((message.guild.ownerID != message.author.id)) return message.react("❌");*/

  if((!ayar.yetkiliAlim) || !ayar.yetkiliAlim) return message.channel.csend("**Roller ayarlanmamış!**").then(x => x.delete({timeout: 5000}));
  if(!ayar.yetkiliAlim.some(rol => message.member.roles.cache.has(rol)) && !message.member.roles.cache.has(ayar.sahipRolu)) return message.react('❌');
 

  const yt = {
    staffs: "836192530323341372",
    rol1: "836181266616549376",
    rol2: "814574368713342986",
    rol3: "",
    rol4: "",
    rol5: "",
    rol6: ""
  }
  let tarih = Date.now()
  let embed = new MessageEmbed().setColor("RANDOM").setAuthor(message.member.displayName, message.author.avatarURL())
	let victim = message.mentions.users.first() || client.users.cache.get(args[0]);
  let uye = message.guild.member(victim);
 if(!victim) return message.reply(`Bir kişi belirtmelisin.`); 
if(!args[1]) return message.reply(`yetki vermek için \`!yetki [üye] ver\`, yetkisini almak için \`!yetki [üye] al\``)
/*if(!uye.roles.cache.has("797828775974404107")) return message.reply(`Üyenin yetkili olabilmesi için \`1 haftadan\` fazla üye olması gerekli.`)
if(!uye.roles.cache.has("805540664993513512")) return message.reply(`Üyenin yetkili olabilmesi için sunucunun rank botunda \`5 seviye\` olmalı.`)*/
if(args[1] === "ver") {
 // if (!victim.username.includes(ayar.tag)) return message.channel.send(embed.setDescription("Bu üyenin isminde tag bulunmuyor! Tagı ismine aldıktan sonra tekrar deneyin."));
  await message.channel.send(embed.setDescription(`${victim} üyesine <@&${yt.rol1}> yetkisi verildi.`))
  await uye.roles.add([yt.staffs, yt.rol1])
  client.channels.cache.get("836376680666628117").send(`${uye} (\`${victim.tag}\` - \`${victim.id}\`) üyesi yetkiye alındı (\`${moment(tarih).format('DD MMMM YYYY HH:mm')}\`)`)
  return
}

if(args[1] === "al") {

  if(ayar.enAltYetkiliRolu){
    let yetkiRol = message.guild.roles.cache.get(ayar.enAltYetkiliRolu);
    await message.channel.send(embed.setDescription(`${victim} üyesi yetkiden ${uye.roles.cache.filter(rol => yetkiRol.position <= rol.position).map(x => x.toString()).join(', ')} rolleri alınarak çıkarıldı!`))
  uye.roles.remove(uye.roles.cache.filter(rol => yetkiRol.position <= rol.position)).catch()

  }
}
};
module.exports.configuration = {
    name: "yetki",
    aliases: [],
    usage: "yetki [üye] ver/al",
    description: "Belirtilen üyeye yetki verir."
};