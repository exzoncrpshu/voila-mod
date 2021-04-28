const { MessageEmbed } = require('discord.js');
const qdb = require('quick.db');
const moment = require('moment');
moment.locale('tr');
const snipeLimit = new Map();

module.exports.execute = async(client, message, args, ayar, emoji) => {
  if (1 > 0 && snipeLimit.has(message.channel.id) && snipeLimit.get(message.channel.id) == 1) return message.inlineReply("Bu komut 5 dakikada bir kere kullanılabilir!").then(x => x.delete({timeout: 5000}));
  let mesaj = qdb.get(`snipe.${message.guild.id}.${message.channel.id}`);
  if (!mesaj) return message.reply('Kanalda silinmiş bir mesaj yok!')
  let mesajYazari = await client.users.fetch(mesaj.yazar);
  let embed = new MessageEmbed().setColor("RANDOM").setTimestamp().setDescription(`\`• Mesajı Yazan:\` ${mesajYazari} (${mesajYazari.id})\n\`• Mesajın Yazılma Tarihi:\` ${moment(mesaj.yazilmaTarihi).format("DD MMMM YYYY HH:mm:ss")}\n\`• Mesajın Silinme Tarihi:\` ${moment(mesaj.silinmeTarihi).format("DD MMMM YYYY HH:mm:ss")}\n\`• Mesaj İçeriği:\` ${mesaj.icerik ? mesaj.icerik :"Atılan Mesaj Dosya İçeriyor."}`).setFooter(message.author.tag + " tarafından istendi!", message.author.avatarURL({display: true, size: 2048}));
  message.inlineReply(embed);

  if (1 > 0) {
    if (!snipeLimit.has(message.channel.id)) snipeLimit.set(message.channel.id, 1);
    else snipeLimit.set(message.channel.id, snipeLimit.get(message.channel.id) + 1);
    setTimeout(() => {
      if (snipeLimit.has(message.channel.id)) snipeLimit.delete(message.channel.id);
    }, 1000 * 60 * 5);
  };
};

module.exports.configuration = {
  name: "snipe",
  aliases: ["snipe"],
  usage: "snipe",
  description: "Kanalda silinen son mesajı gösterir."
};