const { MessageEmbed, WebhookClient } = require("discord.js");
const qdb = require("quick.db");
const db = new qdb.table("ayarlar");
const fetch = require('node-fetch');
const client = global.client;
//const modlog = new WebhookClient('795401630265638943', 'Kd2Bpj6qhdeR3NV_inPipboUIfPbB5PLLx8U7aPnbaWgLCEiSw1P4kuXhiIqdF3991Sc');

module.exports = async message => {

  if (message.channel.type === "dm" || !message.guild || message.author.bot) return;
  await qdb.set(`snipe.${message.guild.id}.${message.channel.id}`, { yazar: message.author.id, yazilmaTarihi: message.createdTimestamp, silinmeTarihi: Date.now(), dosya: message.attachments.first() ? true : false });
  if (message.content) qdb.set(`snipe.${message.guild.id}.${message.channel.id}.icerik`, message.content);
  
  let ayar = db.get('ayar') || {};
if (ayar.chatLogKanali && client.channels.cache.has(ayar.chatLogKanali)) {
  let logKanali = client.channels.cache.get(ayar.chatLogKanali);

  if(message.length > 1024) return;
  if (message.author.bot) return;
const embed = new MessageEmbed()
.setColor("RED")
.setTitle("Mesaj Silindi!")
.setDescription(`${message.author} (\`${message.author.tag}\` - \`${message.author.id}\`) üyesi tarafından <#${message.channel.id}> kanalına gönderilen mesaj silindi! \n\n\`•\` Mesaj İçeriği: ${message.content}`)
.setTimestamp()
logKanali.csend(embed);
}
}
module.exports.configuration = {
  name: "messageDelete"
};