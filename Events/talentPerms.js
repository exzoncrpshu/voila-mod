﻿﻿const { MessageEmbed } = require("discord.js");
const conf = require('../exzsettings/ayarlar.json');
const qdb = require("quick.db");
const cdb = new qdb.table("cezalar");
const db = new qdb.table("ayarlar");
const client = global.client;

client.komutlar = [

  /*{isim: "yetkilial1", rol: ["773957556418510858", "773957556782759937"]},
  {isim: "rolver", rol: ["773957573954502716", "773957574936494090"]},
*/
];

module.exports = (message) => {
  if (!message.content.startsWith(conf.prefix)) return;
  let ayar = db.get('ayar') || {};
  let args = message.content.substring(conf.prefix.length).split(" ");
  let command = args[0];
  args = args.splice(1);
  let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if (!uye) return;
  let komut = client.komutlar.find(k => k.isim === command);
/*  if (komut && (komut.isim === "yetkilial1")) {
    if (!message.member.roles.cache.has("756853980339896441") && !message.member.roles.cache.has(ayar.sahipRolu) && !conf.sahip.some(id => message.author.id === id)) return message.react("❌");
    uye.roles.add(["773957556418510858", "773957556782759937"]);
    return message.react(client.emojiler.onay);
  };
  if (komut && (komut.isim === "rolver")) {
    if (!message.member.roles.cache.has("773957534888755230") && !message.member.roles.cache.has("773957556782759937") && !message.member.roles.cache.has(ayar.sahipRolu) && !conf.sahip.some(id => message.author.id === id)) return message.react("❌");
    uye.roles.add(["773957573954502716", "773957574936494090"]);
    return message.react(client.emojiler.onay);
  };*/
};

module.exports.configuration = {
  name: "message"
};