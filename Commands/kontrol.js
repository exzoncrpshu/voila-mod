const { MessageEmbed, Message } = require('discord.js');
const moment = require('moment');
moment.locale('tr');
 
module.exports.execute = (client, message, args, ayar, emoji) => {
  
	if(!conf.sahip.includes(message.author.id))
  if((message.guild.ownerID != message.author.id)) return message.react("❌");
  
  const Config = {
    GuildID: "745593326627192832",
    OneWeek: "836249653766914090",
    TwoWeek: "836250237395140608",
    OneMonth: "836250190817656862",
    SixWeek: "836249641694789722",
    TwoMonth: "836250047309676584"
  };

    let Guild = client.guilds.cache.get(Config.GuildID);
    let Now = Date.now();
    let Time = 1000 * 60 * 60 * 24 * 28;
    let a = message.guild.roles.cache.get(Config.OneWeek).members.size
    let b = message.guild.roles.cache.get(Config.TwoWeek).members.size
    let c = message.guild.roles.cache.get(Config.OneMonth).members.size
    let d = message.guild.roles.cache.get(Config.SixWeek).members.size
    let e = message.guild.roles.cache.get(Config.TwoMonth).members.size


 
  Guild.members.cache.filter((member) => (Now - member.joinedTimestamp) >= Time).forEach((member) => member.roles.add(Config.OneWeek));

    Guild.members.cache.filter((member) => (Now - member.joinedTimestamp) >= Time * 2).forEach((member) => member.roles.add(Config.TwoWeek));

    Guild.members.cache.filter((member) => (Now - member.joinedTimestamp) >= Time * 3).forEach((member) => member.roles.add(Config.OneMonth));

    Guild.members.cache.filter((member) => (Now - member.joinedTimestamp) >= Time * 6).forEach((member) => member.roles.add(Config.SixWeek));
 
    Guild.members.cache.filter((member) => (Now - member.joinedTimestamp) >= Time * 12).forEach((member) => member.roles.add(Config.TwoMonth));

message.inlineReply(new MessageEmbed().setColor("RANDOM").setAuthor(message.member.displayName, message.author.avatarURL()).setDescription(`${message.author}, üye katılım rolleri dağıtımı bitti. (\`${moment(Now).format('DD MMMM YYYY HH:mm')}\`)`).addField('Rol Üye Sayıları', `+1 Month Old (\`${a}\`) +3 Months Old (\`${b}\`) +6 Months Old: (\`${c}\`) +9 Months Old: (\`${d}\`) +1 Year Old: (\`${e}\`)`).setFooter(`${message.guild.name} | ${message.guild.memberCount} Üyeden ${a} kişiye dağıtıldı.`, message.guild.iconURL()))



  message.inlineReply('Ekip rolleri kontrol ediliyor.')
  message.guild.members.cache.filter(s => !s.user.bot && !s.hasPermission('ADMINISTRATOR') && !s.roles.cache.has(ayar.jailRolu) && !s.roles.cache.has(ayar.sahipRolu) && !s.roles.cache.has(ayar.teyitsizRolleri)).filter(member => member.user.username.includes(ayar.tag)).forEach(x => {
    x.setNickname(x.displayName.replace(ayar.ikinciTag, ayar.tag))
    x.roles.add(ayar.ekipRolu)
    //message.channel.send(`${x} ${x.user.tag} ekip rolü aldı.`)
   });
 /*
   message.guild.members.cache.forEach((uye, async) => {
    await coin.findOneAndUpdate({ guildID: message.guild.id, userID: uye.user.id }, { $inc: { coin: 1 } }, { upsert: true });

  })*/
 
  };
  module.exports.configuration = {
    name: "roldağıt",
    aliases: ["roldağıt", "kontrol"],
    usage: "kontrol",
    description: "Haftalık, aylık rollerini sunucuda ki üyeleri kontrol ederek dağıtır."
};