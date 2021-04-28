const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db")
module.exports.execute = async(client, message, args, ayar, emoji) => {

  if(!ayar.teyitciRolleri) return message.channel.csend("**Roller ayarlanmamış!**").then(x => x.delete({timeout: 5000}));
  if(!ayar.teyitciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.roles.cache.has(ayar.sahipRolu)) return message.react('🚫');
  let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
  let user = message.guild.member(member)
  
  let embesd = new MessageEmbed().setColor('RANDOM').setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true }))
  if (!user) return message.channel.send(embesd.setDescription(`Bir üye belirt!`))
  if (!user.voice.channel) return message.channel.send(embesd.setDescription(`Bu üye ses kanalında değil!`))
  let embed = new MessageEmbed().setColor('RANDOM').setAuthor(member.user.tag, member.user.avatarURL({ dynamic: true }))

  let kanal = user.voice.channel
  let mik = user.voice.selfMute ? "Kapalı" : "Açık"
  let kulak = user.voice.selfDeaf ? "Kapalı" : "Açık"
  let kanalinfo = user.voice.channel.userLimit
  let kanaldakiler = message.guild.members.cache.filter(x => x.voice.channel && x.voice.channel.id === kanal.id).size
  let voiceTime = await qdb.get(`voiceTime.${user.id}.${message.guild.id}`)
  let time = client.tarihHesapla(voiceTime)
  kanal.createInvite().then(invite => { 
  if (kanal && user.voice.channel) {
      message.channel.send(embed.setDescription(`${user} kişisi ${kanal} kanalında. adlı ses kanalında. **Mikrofonu:** ${mik}, **Kulaklığı:** ${kulak}. **Kanal Bilgisi:** ${kanaldakiler}/${kanalinfo}\n\nKanala gitmek için [tıklaman](https://discord.gg/${invite.code}) yeterli.\n\nKişi ${kanal} kanalında ${time} katılmış.`))
  }
})
};
module.exports.configuration = {
    name: "sesbilgi",
    aliases: ['ses-bilgi', 'ses', 'nerede'],
    usage: "ses-bilgi [üye]",
    description: "Belirtilen üyenin ses bilgisini gösterir."
};