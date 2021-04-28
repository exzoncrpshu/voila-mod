const { MessageEmbed } = require("discord.js");

module.exports.execute = (client, message, args, ayar, emoji) => {


  if(message.author.id !== '518104479317360663') return;
  
  message.reply(`**_5 saniye içinde yeniden başlatılıyor._**`).then(sila => { 
  setTimeout(() => { 
    sila.edit('\u200B');
    sila.edit(new MessageEmbed().setColor(client.randomColor()).setAuthor(client.user.username, client.user.avatarURL()).setDescription(`Bot yeniden başlatıldı... Ping: ${client.ws.ping}ms`))
  
  }, 5000)
  })
  setTimeout(() => { 
  
  process.exit(0)
  
  }, 6000)

};
module.exports.configuration = {
    name: "reboot",
    aliases: ["başlat"],
    usage: "reboot",
    description: "Belirtilen üyenin avatarını gösterir."
};