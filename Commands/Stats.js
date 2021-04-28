const { MessageEmbed } = require('discord.js');
const MemberStats = require('../Models/MemberStats.js');
const Database = require('../models/inviter.js');
const sunucuAyar = global.sunucuAyar = require("../exzsettings/sunucuAyar.js");
const coin = require("../Models/coin.js");
const taggeds = require("../Models/taggeds.js");
const conf = require("../exzsettings/config.json");
const qdb = require("quick.db")
const kdb = new qdb.table("kullanici");
const teyitci = require("../models/teyitci.js");
const yetkili = require("../models/yetkili.js");
module.exports.execute = async(client, message, args,ayar,emoji) => {
    var sayi = 1
    var sayii = 1
   // if(!message.member.roles.cache.array().some(rol => message.guild.roles.cache.get(ayar.staffrole).rawPosition <= rol.rawPosition)) return  message.reply("`Bu komut yetkililere özeldir.`");
    let kullanici = message.mentions.users.first() || client.users.cache.get(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(' ').toLowerCase())).first(): message.author) || message.author;
    let uye = message.guild.member(kullanici);
    const hata = new MessageEmbed().setColor(client.randomColor()).setAuthor(kullanici.tag.replace('`', '')+` (` + kullanici.id + `)` , kullanici.avatarURL({dynamic: true, size: 2048}));
    const embed = new MessageEmbed().setColor(client.randomColor()).setAuthor(kullanici.tag.replace('`', '')+` (` + kullanici.id + `)` , kullanici.avatarURL({dynamic: true, size: 2048})).setThumbnail(kullanici.avatarURL({dynamic: true, size: 2048}));
  

    let yetkiliBilgisi = ``;
    if((ayar.sahipRolu && uye.roles.cache.has(ayar.sahipRolu)) || (ayar.teyitciRolleri && ayar.teyitciRolleri.some(rol => uye.roles.cache.has(rol)))) {
      let memberData = await teyitci.findById(uye.id);
      if(memberData){
       let teyitToplam = memberData.teyitler || 0;
       let erkekTeyit = memberData.erkek || 0;
       let kizTeyit = memberData.kiz || 0;
        yetkiliBilgisi += `${client.emoji("st")} **Teyitleri:** ${teyitToplam} (**${erkekTeyit}** erkek, **${kizTeyit}** kiz)\n`;
      }
}
if((ayar.sahipRolu && uye.roles.cache.has(ayar.sahipRolu)) || (ayar.muteciRolleri && ayar.muteciRolleri.some(rol => uye.roles.cache.has(rol))) || (ayar.banciRolleri && ayar.banciRolleri.some(rol => uye.roles.cache.has(rol))) || (ayar.banciRolleri && ayar.banciRolleri.some(rol => uye.roles.cache.has(rol))) || (ayar.jailciRolleri && ayar.jailciRolleri.some(rol => uye.roles.cache.has(rol)))) {
  let staffsData = await yetkili.findById(uye.id);
  if(staffsData) { 
  let chatMute = staffsData.chatmute || 0;
  let sesMute = staffsData.sesmute || 0;
  let kick = staffsData.kick || 0;
  let ban = staffsData.ban || 0;
  let jail = staffsData.jail || 0;
  let toplam = staffsData.topceza || 0;
  yetkiliBilgisi += `${client.emoji("st")} **Cezalandırmaları:** ${toplam} (**${chatMute}** chat | **${sesMute}** ses mute, **${jail}** jail, **${kick}** kick, **${ban}** ban)`;
};
};

    MemberStats.findOne({ guildID: message.guild.id, userID: uye.id }, (err, data) => {
        if (!data) return global.send(message.channel, embed.setDescription('Belirtilen üyeye ait herhangi bir veri bulunamadı!'));
        let haftalikSesToplam = 0;
        data.voiceStats.forEach(c => haftalikSesToplam += c);
        let haftalikSesListe = '';
        data.voiceStats.forEach((value, key) => haftalikSesListe += `**${sayii++}.** ${message.guild.channels.cache.has(key) ? message.guild.channels.cache.get(key) : '#deleted-channel'}: ${client.convertDuration(value)}\n`);
        let haftalikChatToplam = 0;
        data.chatStats.forEach(c => haftalikChatToplam += c);
        let haftalikChatListe = '';
        data.chatStats.forEach((value, key) => haftalikChatListe += `**${sayi++}.** ${message.guild.channels.cache.has(key) ? message.guild.channels.cache.get(key) : '#deleted-channel'}: ${value.toLocaleString()} mesaj\n`);
  
        Database.findOne({guildID: message.guild.id, userID: uye.id}, (err, inviterData) => {
            if (!inviterData) {
                hata.setDescription(`Bu üyenin Stats bilgisi için en az **1 davete** sahip olması gerekiyor!`);
                message.channel.send(hata);
              } else {
              Database.find({guildID: message.guild.id, inviterID: uye.id}).sort().exec((err, inviterMembers) => {
                let dailyInvites = 0;
                let weeklyInvites = 0;
                if (inviterMembers.length) {
                 // dailyInvites = inviterMembers.filter(x => message.guild.members.cache.has(x.userID) && (Date.now() - message.guild.members.cache.get(x.userID).joinedTimestamp) < 1000*60*60*24).length;
                  weeklyInvites = inviterMembers.filter(x => message.guild.members.cache.has(x.userID) && (Date.now() - message.guild.members.cache.get(x.userID).joinedTimestamp) < 1000*60*60*24*7).length;
                }
              


 

        embed.setDescription(`${kullanici} üyesinin **ses, chat ve davet** istatistikleri;\n\n${client.emoji("st")} **Genel Toplam Ses:** ${client.convertDuration(data.totalVoiceStats || 0)}\n${client.emoji("st")} **Genel Toplam Chat:** ${data.totalChatStats.toLocaleString() || 0} mesaj\n\n${client.emoji("st")} **Haftalık Ses:** ${client.convertDuration(haftalikSesToplam)}\n${client.emoji("st")} **Haftalık Chat:** ${haftalikChatToplam.toLocaleString() || 0} mesaj\n${client.emoji("st")} **Davetleri:** ${inviterData.regular+inviterData.bonus} (**${inviterData.regular}** gerçek, **${inviterData.bonus}** bonus, **${inviterData.fake}** fake, **${weeklyInvites}** haftalık)\n${yetkiliBilgisi}`);
        embed.addField('Haftalık Ses',`${haftalikSesListe ? haftalikSesListe :"Bulunamadı!"}`);
        embed.addField('Haftalık Chat',`${haftalikChatListe ? haftalikChatListe :"Bulunamadı!"}`);
    message.channel.send(embed).catch(e => message.inlineReply(hata.setDescription(`Kanal listeniz embed'e (kutucuğa) sığmadığı için gönderemiyoruz! \`!totalstat\` komutunu kullan!`)))

    
 
            });
          }
    
        });
      });

};
module.exports.configuration = {
    name: 'stat',
    aliases: ['stats', 'vinfo', 'cinfo'],
    usage: 'stat [üye]',
    description: 'Belirtilen üyenin tüm ses ve chat bilgilerini gösterir.',
    permLevel: 0
};

function progressBar(value, maxValue, size) {
  const progress = Math.round(size * ((value / maxValue) > 1 ? 1 : (value / maxValue)));
  const emptyProgress = size - progress > 0 ? size - progress : 0;
  
  const progressText = "<a:exz_dolubar:820237009569579019>".repeat(progress);
  const emptyProgressText = "<:exz_bosbar:820237076138164265>".repeat(emptyProgress);
  
  return emptyProgress > 0 ? `<a:exz_dolubarbas:820236979345031170>${progressText}${emptyProgressText}<:exz_bosbarson:820237126179749918>` : `<a:exz_dolubarbas:820236979345031170>${progressText}${emptyProgressText}<a:exz_dolubarson:820239068893282354>`;
  };