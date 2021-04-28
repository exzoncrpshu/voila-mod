const { MessageEmbed } = require("discord.js");
const moment = require("moment");
moment.locale("tr");

module.exports.execute = (client, message, args, ayar, emoji) => {
	let victim = message.mentions.users.first() || client.users.cache.get(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(" ").toLowerCase())).first(): message.author) || message.author;
  let uye = message.guild.member(victim);
  let hesapla = victim.createdAt
  let katilma = uye.joinedAt
  let embed = new MessageEmbed()
	.setColor("RANDOM")
  .setAuthor(victim.tag, victim.avatarURL())
	.setDescription(`${victim}, Hesabın \`${moment(hesapla).format('DD MMMM YYYY HH:mm')}\` tarihinde yaklaşık ${client.tarihHesapla(hesapla)} oluşturulmuş. Sunucuya katılma tarihin \`${moment(katilma).format('DD MMMM YYYY HH:mm')}\` tarihinde yaklaşık ${client.tarihHesapla(katilma)} sunucuya katılmışsın.`)
	message.inlineReply(embed);
};
module.exports.configuration = {
    name: "hesapla",
    aliases: ["hesap"],
    usage: "hesapla [üye]",
    description: "Belirtilen üyenin avatarını gösterir."
};