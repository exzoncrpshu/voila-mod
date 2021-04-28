const { MessageEmbed } = require("discord.js");
const moment = require("moment");
moment.locale("tr");

module.exports.execute = (client, message, args, ayar, emoji) => {
	let victim = message.mentions.users.first() || client.users.cache.get(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(" ").toLowerCase())).first(): message.author) || message.author;

  let durum = (victim.presence.status).replace("offline", "Görünmez/Çevrimdışı").replace("online", "Çevrim içi").replace("idle", "Boşta").replace("dnd", "Rahatsız Etmeyin")
  let p = Object.keys(victim.presence.clientStatus).join('\n')
  let cihazisim = p
  .replace(`mobile`,`\`•\` Mobil Cihaz (${durum})`)
  .replace(`desktop`,`\`•\` Bilgisayar Uygulaması (${durum})`)
  .replace(`web`,`\`•\` İnternet Tarayıcısı (${durum})`)
  let embed = new MessageEmbed()
	.setColor("RANDOM")
  .setAuthor(`${victim.tag} (${victim.id})`, victim.avatarURL())
	.setDescription(`${victim} üyesinin cihazları;\n\n${cihazisim ? cihazisim :"\`•\` Kullanıcı aktif değil."}`)
	message.inlineReply(embed);
};
module.exports.configuration = {
    name: "cihaz",
    aliases: ["cihaz"],
    usage: "cihaz [üye]",
    description: "Belirtilen üyenin avatarını gösterir."
};