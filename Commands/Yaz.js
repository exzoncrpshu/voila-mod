const { MessageEmbed } = require("discord.js");

module.exports.execute = async(client, message, args, ayar, emoji) => {
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor("RANDOM");
  if (!message.member.hasPermission("ADMINISTRATOR")) return message.react("🚫")
  if(!args[0]) return message.channel.send(embed.setDescription("Bota yazdırılacak metni belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  message.delete({timeout: 100});
  message.channel.send(args.join(' '));
};
module.exports.configuration = {
    name: "yaz",
    aliases: ["type", 'say'],
    usage: "yaz [metin]",
    description: "Belirtilen mesajı bota gönderir."
};