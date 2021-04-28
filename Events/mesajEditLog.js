const { MessageEmbed, WebhookClient } = require("discord.js");
const qdb = require("quick.db");
const db = new qdb.table("ayarlar");
const fetch = require('node-fetch');
const client = global.client;
//const modlog = new WebhookClient('795401630265638943', 'Kd2Bpj6qhdeR3NV_inPipboUIfPbB5PLLx8U7aPnbaWgLCEiSw1P4kuXhiIqdF3991Sc');

module.exports = async (oldMsg, newMsg) => {

  let ayar = db.get('ayar') || {};
if (ayar.chatLogKanali && client.channels.cache.has(ayar.chatLogKanali)) {
  let logKanali = client.channels.cache.get(ayar.chatLogKanali);

  if(oldMsg.length > 1024) return;
  if (oldMsg.author.bot) return;
  var user = oldMsg.author;
  const embed2 = new MessageEmbed()
  .setColor("RED")
  .setDescription(`**Mesajın düzenlendiği kanal <#${oldMsg.channel.id}>**`)
  .setAuthor(oldMsg.author.tag, oldMsg.author.avatarURL())
  .addField("Eski Mesaj",`  ${oldMsg.content}  `)
  .addField("Yeni Mesaj", `${newMsg.content}`)
  .setFooter(`Kullanıcı ID: ${oldMsg.author.id}`)
  .setTimestamp()
logKanali.csend(embed2);  
}

}
module.exports.configuration = {
  name: "messageUpdate"
};