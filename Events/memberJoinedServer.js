const {MessageEmbed}= require("discord.js");
const qdb = require("quick.db");
const jdb = new qdb.table("cezalar");
const db = new qdb.table("ayarlar");

module.exports = async (member) => {
  let client = global.client;
  let ayarlar = db.get("ayar") || {};
  let jaildekiler = jdb.get("jail") || [];
  let tempjaildekiler = jdb.get("tempjail") || [{id: null}];
  let muteliler = jdb.get("mute") || [];
  let tempmute = jdb.get("tempmute") || [{id: null}];
  let seslimute = jdb.get("tempsmute") || [{id: null}];
  let yasakTaglilar = jdb.get("yasakTaglilar") || [];
  let guvenilirlik = Date.now()-member.user.createdTimestamp < 1000*60*60*24*7;
  if (ayarlar.yasakTaglar && !ayarlar.yasakTaglar.some(tag => member.user.username.includes(tag)) && yasakTaglilar.some(x => x.includes(member.id))) await jdb.set('yasakTaglilar', yasakTaglilar.filter(x => !x.includes(member.id)));
  if(jaildekiler.some(x => x.includes(member.id)) || tempjaildekiler.some(x => x.id === member.id)){
    if(ayarlar.jailRolu) member.roles.set([ayarlar.jailRolu]).catch();
  } else if (ayarlar.yasakTaglar && ayarlar.yasakTaglar.some(tag => member.user.username.includes(tag))) {
    if(ayarlar.jailRolu) member.roles.set([ayarlar.jailRolu]).catch();
    if (!yasakTaglilar.some(id => id.includes(member.id))) jdb.push('yasakTaglilar', `y${member.id}`);
    member.send(`**${member.guild.name}** adlı sunucumuzun yasaklı taglarından birine sahip olduğun için jaile atıldın! Tagı bıraktığın zaman jailden çıkabilirsin.`).catch();
  } else if (guvenilirlik) {
    if(ayarlar.fakeHesapRolu) member.roles.set([ayarlar.fakeHesapRolu]).catch();
    if(ayarlar.fakeHesapLogKanali && member.guild.channels.cache.has(ayarlar.fakeHesapLogKanali)) return member.guild.channels.cache.get(ayarlar.fakeHesapLogKanali).send(`${member} (\`${member.user.username}\`) üyesi sunucuya katıldı fakat hesabı ${member.client.tarihHesapla(member.user.createdAt)} açıldığı için jaile atıldı!`);
  } else if(ayarlar.teyitsizRolleri) member.roles.add(ayarlar.teyitsizRolleri).catch();
  if(tempmute.some(x => x.id === member.id) || muteliler.some(x => x.includes(member.id))) member.roles.add(ayarlar.muteRolu).catch();
  if(seslimute.some(x => x.id === member.id) && member.voice.channel) member.voice.setMute(true).catch();
  //member.send(new MessageEmbed().setImage('https://cdn.discordapp.com/icons/745593326627192832/a_addd6efbf2ca9872b8d07ef79cbe1144.gif?size=2048').setColor(client.randomColor()).setDescription(`**${client.emoji("gif1")} ${member} Sunucuya Hoş geldin!\n${client.emoji("gif2")} kayıt olmak için habbo oynuyorsan habbo nickini oynamıyorsan isim ve yaşını belirterek \`Staffs\` rolünü etiketleyebilirsin.\n${client.emoji("gif3")} Seninle beraber sunucumuz \`${member.guild.memberCount}\` sayısına ulaştı.\n${client.emoji("gif4")} Yetkili olmak için \`ysf#9699\`'a ulaşabilirsin.**`))
  let embed = new MessageEmbed()
  .setColor(member.client.randomColor())
  .setDescription(`
  **${client.emoji("gif1")} • Sunucuya hoş geldin ${member}, seninle \`${member.guild.memberCount}\` kişiyiz!**
  **${client.emoji("gif2")} • Tanrı seçerek sunucuya kaydolabilirsim**
  **${client.emoji("gif3")} • Hesabın Açılış Süresi: ${member.client.tarihHesapla(member.user.createdAt)}**
  **${client.emoji("gif4")} • Hesap ${guvenilirlik ? "Tehlikeli!" : "Güvenli!"}**
  `);
  if(ayarlar.ikinciTag) member.setNickname(`${ayarlar.ikinciTag} ${member.displayName}`).catch();
  else if(ayarlar.tag) member.setNickname(`${ayarlar.tag} ${member.displayName}`).catch();
 // if (ayarlar.embedImage) embed.setImage(ayarlar.embedImage);
 // if(ayarlar.teyitKanali && member.guild.channels.cache.has(ayarlar.teyitKanali)) member.guild.channels.cache.get(ayarlar.teyitKanali).send({ embed: embed }); 

}
module.exports.configuration = {
  name: "guildMemberAdd"
}