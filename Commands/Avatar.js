const { MessageEmbed } = require("discord.js");

module.exports.execute = (client, message, args, ayar, emoji) => {
  if(message.channel.id === "814957173288992788") return;
	let victim = message.mentions.users.first() || client.users.cache.get(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(" ").toLowerCase())).first(): message.author) || message.author;
	let avatar = victim.avatarURL({ dynamic: true, size: 2048 });
  let embed = new MessageEmbed()
	.setColor('2F3136')
  .setAuthor(victim.tag, avatar)
  .setFooter(`${message.member.displayName} tarafından istendi!`, message.author.avatarURL({ dynamic: true }))
	.setImage(avatar)
	message.inlineReply(embed);
};
module.exports.configuration = {
    name: "avatar",
    aliases: ["pp", "av"],
    usage: "avatar [üye]",
    description: "Belirtilen üyenin avatarını gösterir."
};