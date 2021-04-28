const { MessageEmbed } = require("discord.js");
const conf = require("../exzsettings/ayarlar.json");
const qdb =require("quick.db");
const db = new qdb.table("ayarlar");

module.exports.execute = async (client, message, args, ayar, emoji) => {
  if(!conf.sahip.includes(message.author.id))
	if((message.guild.ownerID != message.author.id)) return message.react("🚫");
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor("RANDOM");
  let command = args[0]
	if (global.commands.has(command)) {
		command = global.commands.get(command)
		embed
      .setDescription(`**= Komut Bilgi =**\n\`Adı:\` ${command.configuration.name}\n\`Açıklama:\` ${command.configuration.description}\n\`Kullanım:\` ${command.configuration.usage}\n\`Alternatif(ler):\` ${command.configuration.aliases[0] ? command.configuration.aliases.join(', ') : 'Bulunmuyor'}`)
      .setTimestamp()
			.setColor(client.randomColor())
		message.channel.send(embed)
    return;
	}
  let yazı = "";
  let ozelkomutlar = db.get(`özelkomut`) || [];
  global.commands.forEach(command => {
    yazı += `\`${conf.prefix}${command.configuration.usage}\` \n`;
  });
  message.channel.send(embed.setDescription(yazı+`\n${client.komutlar.map(x => `\`${conf.prefix+x.isim}\``).join('\n')}`)); //.addField('Özel Komutlar', ozelkomutlar.length > 0 ? ozelkomutlar.map(x => "**"+x.isim+"**").join(' \`|\` ') : "Bulunamadı!")
};
module.exports.configuration = {
  name: "yardım",
  aliases: ['help', 'y'],
  usage: "yardım [komut adı]",
  description: "Botta bulunan tüm komutları listeler."
};