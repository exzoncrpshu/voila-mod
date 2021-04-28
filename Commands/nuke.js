const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const db = new qdb.table("ayarlar");
const conf = require('../exzsettings/ayarlar.json');

module.exports.execute = (client, message, args, ayar, emoji) => {
	if(!conf.sahip.includes(message.author.id))
	if((message.guild.ownerID != message.author.id)) return message.react("❌");

  message.channel.clone().then(chnl => {
    let position = message.channel.position;
    chnl.setPosition(position).then(x => x.send('https://tenor.com/view/explosion-mushroom-cloud-atomic-bomb-bomb-boom-gif-4464831'));
    message.channel.delete();
  });

};
module.exports.configuration = {
    name: "nuke",
    aliases: ["nuk"],
    usage: "nuke",
    description: "Kanalı sıfırlar."
};