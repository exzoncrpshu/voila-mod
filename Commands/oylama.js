const Discord = require('discord.js')
const qdb = require('quick.db');


module.exports.execute = (client, message, args, ayar, emoji) => {
  if(message.author.id !== "518104479317360663") return message.react("🚫")
   let type = args.slice(0).join(' ');
    if (type.length < 1) return message.reply(`Oylanacak metni yazmalısın!`)

    message.delete()

const embed2 = new Discord.MessageEmbed().setColor('BLUE').setAuthor(message.guild.name, message.guild.iconURL({display: true, size: 2048})).setDescription(type)
message.channel.send(embed2).then(function(message) {
  message.react('✅');
  message.react('❌');
  }); 

};

module.exports.configuration = {
  name: "oylama",
  aliases: ['oylama'],
  usage: "oylama [metin]",
  description: "İstek öneri veya şikayet belirtmenizi sağlar."
};