const { MessageEmbed } = require('discord.js');

module.exports.execute = (client, message, args, ayar, emoji) => {

  if (!message.member.hasPermission("ADMINISTRATOR")) return message.react('❌');
  let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(rol => rol.name === args.join(' '))
  if (!rol) return message.channel.send(new MessageEmbed().setDescription('Bir rol belirtmeyi unutma.').setColor("RANDOM").setAuthor(message.member.displayName, message.author.avatarURL({display: true, size: 2048})));
let sayi = message.guild.roles.cache.get(rol.id).members.size
  message.channel.send(new MessageEmbed().setColor(client.randomColor()).setDescription(`${rol} (\`${sayi}\`) Rolünün Üye Listesi\n\n${rol.members.map(üye => "<@" + üye.user.id.toString() + ">").join("\n ")}`));
};

module.exports.configuration = {
  name: "members",
  aliases: [],
  usage: "members [rol isim/etiket]",
  description: "Belirtilen rolün üyelerini sıralar."
};