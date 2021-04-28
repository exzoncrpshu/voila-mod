const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const moment = require("moment");
moment.locale('tr');
require("moment-duration-format");
const db = new qdb.table("ayarlar");
const mdb = new qdb.table("level");
const sdb = new qdb.table("istatistik");
const kdb = new qdb.table("kullanici");
const teyitci = require("../models/teyitci.js");
const yetkili = require("../models/yetkili.js");
module.exports.execute = async(client, message, args, ayar, emoji) => {
  let kullanici = message.mentions.users.first() || client.users.cache.get(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(" ").toLowerCase())).first(): message.author) || message.author;
  let uye = message.guild.member(kullanici);
  

  let guild = message.guild;
  let yetkiliBilgisi = ``;
  if((ayar.sahipRolu && uye.roles.cache.has(ayar.sahipRolu)) || (ayar.teyitciRolleri && ayar.teyitciRolleri.some(rol => uye.roles.cache.has(rol)))) {
    let memberData = await teyitci.findById(uye.id);
    if(memberData){
     let teyitToplam = memberData.teyitler || 0;
     let erkekTeyit = memberData.erkek || 0;
     let kizTeyit = memberData.kiz || 0;
      yetkiliBilgisi += `${client.emoji("st")} **Teyitleri:** ${teyitToplam} (**${erkekTeyit}** erkek, **${kizTeyit}** kiz)\n`;
    }
};
const roles = uye.roles.cache.filter(role => role.id !== message.guild.id).sort((a, b) => b.position - a.position).map(role => `<@&${role.id}>`);
 const rolleri = [] 
if (roles.length > 6) { 
const lent = roles.length - 6 
let itemler = roles.slice(0, 6) 
itemler.map(x => rolleri.push(x)) 
rolleri.push(`(+${lent})`)
 } else { 
roles.map(x => rolleri.push(x))
 }
let x;
if(kullanici.presence.activities[0]) {
if(kullanici.presence.activities !== null && kullanici.presence.activities[0].type === "CUSTOM_STATUS") x = `${kullanici.presence.activities[0].emoji ? kullanici.presence.activities[0].emoji : ""} ${kullanici.presence.activities[0].state ? kullanici.presence.activities[0].state : ""}` || "Oynuyor kısmı boş."
}
let durum = ``;
if(x) {
  durum += `\n${client.emoji("st")} **Özel Durum:** ${x}`
}
  if((ayar.sahipRolu && uye.roles.cache.has(ayar.sahipRolu)) || (ayar.muteciRolleri && ayar.muteciRolleri.some(rol => uye.roles.cache.has(rol))) || (ayar.banciRolleri && ayar.banciRolleri.some(rol => uye.roles.cache.has(rol))) || (ayar.banciRolleri && ayar.banciRolleri.some(rol => uye.roles.cache.has(rol))) || (ayar.jailciRolleri && ayar.jailciRolleri.some(rol => uye.roles.cache.has(rol)))) {
    let staffsData = await yetkili.findById(uye.id);
    if(staffsData) { 
    let chatMute = staffsData.chatmute || 0;
    let sesMute = staffsData.sesmute || 0;
    let kick = staffsData.kick || 0;
    let ban = staffsData.ban || 0;
    let jail = staffsData.jail || 0;
    let toplam = staffsData.topceza || 0;
    yetkiliBilgisi += `${client.emoji("st")} **Cezalandırmaları:** ${toplam} (**${chatMute}** chat | **${sesMute}** ses mute, **${jail}** jail, **${kick}** kick, **${ban}** ban)`;
  };
};
  let victim = kullanici;
  const embed = new MessageEmbed().setColor("BLACK").setAuthor(`${kullanici.tag.replace("`", "")}`, kullanici.avatarURL({dynamic: true, size: 2048})).setThumbnail(kullanici.avatarURL({dynamic: true, size: 2048}))
  .addField(`__**Kullanıcı Bilgisi**__`, `${client.emoji("st")} **ID:** ${kullanici.id}\n${client.emoji("st")} **Profil:** ${kullanici}${durum}\n${client.emoji("st")} **Durum:** ${(kullanici.presence.status).replace("offline", emoji("gorunmez")).replace("online", emoji("cevrimici")).replace("idle", emoji("bosta")).replace("dnd", emoji("rahatsizetmeyin"))} ${kullanici.presence.activities[0] ? kullanici.presence.activities[0].name + ` ${(kullanici.presence.activities[0].type)}`.replace("PLAYING", "Oynuyor").replace("STREAMING", "Yayında").replace("LISTENING", "Dinliyor").replace("WATCHING", "İzliyor").replace("CUSTOM_STATUS", "") : (kullanici.presence.status).replace("offline", "Görünmez/Çevrimdışı").replace("online", "Çevrimiçi").replace("idle", "Boşta").replace("dnd", "Rahatsız Etmeyin")}\n${client.emoji("st")} **Oluşturulma Tarihi:** ${moment(kullanici.createdAt).format(`DD MMMM YYYY HH:mm`)} (${client.infoHesapla(kullanici.createdAt)})`)
  .addField(`__**Üyelik Bilgisi**__`, `${client.emoji("st")} **Takma Adı:** ${uye.displayName.replace("`", "")} ${uye.nickname ? "" : "[Yok]"}\n${client.emoji("st")} **Katılma Tarihi:** ${moment(uye.joinedAt).format(`DD MMMM YYYY HH:mm`)} (${client.infoHesapla(uye.joinedAt)})\n${client.emoji("st")} **Katılım Sırası:** ${(message.guild.members.cache.filter(a => a.joinedTimestamp <= uye.joinedTimestamp).size).toLocaleString()}/${(message.guild.memberCount).toLocaleString()}\n${yetkiliBilgisi}\n\n${client.emoji("st")} **Rolleri (${uye.roles.cache.size-1}):** ${rolleri.join(', ')}`);  

        //return message.channel.send(embed);
    message.channel.send(embed);
};
module.exports.configuration = {
    name: "istatistik",
    aliases: ["bilgi", "i", "user"],
    usage: "istatistik [üye]",
    description: "Belirtilen üyenin tüm bilgilerini gösterir."
};

