const { MessageEmbed } = require('discord.js');
const MemberStats = require('../Models/MemberStats.js');
const coin = require("../Models/coin.js");
const exz = require("../Models/exzowoncy.js");

module.exports.execute = async(client, message, args,ayar) => {

   // if(!message.member.roles.cache.array().some(rol => message.guild.roles.cache.get(ayar.staffrole).rawPosition <= rol.rawPosition)) return  message.reply("`Bu komut yetkililere özeldir.`");
    const embed = new MessageEmbed().setColor(client.randomColor()).setAuthor(message.guild.name, message.guild.iconURL({dynamic: true, size: 2048}));
   
    const coinData = await coin.find({ guildID: message.guild.id }).sort({ coin: -1 });

    let coinSum = 0;

        const coinUsers = coinData.splice(0, 20).map((x, index) => {
  coinSum += x.coin;
  return `**${index+1}.** <@${x.userID}>: ${Number(x.coin).toLocaleString()} XP`
}).join(`\n`);

const exzData = await exz.find({}).sort({ coin: -1 });

let exzSum = 0;

    const exzUsers = exzData.splice(0, 20).map((x, index) => {
exzSum += x.coin;
return `**${index+1}.** <@${x.userID}>: ${Number(x.coin).toLocaleString()} exzowoncy`

}).join(`\n`);

    MemberStats.find({guildID: message.guild.id}).exec((err, data) => {
        data = data.filter(m => message.guild.members.cache.has(m.userID));
        let toplamSesSiralama = data.sort((uye1, uye2) => Number(uye2.totalVoiceStats)-Number(uye1.totalVoiceStats)).slice(0, 10).map((m, index) => `**${index+1}.** ${message.guild.members.cache.get(m.userID).toString()} ${client.convertDuration(Number(m.totalVoiceStats))}`).join('\n');
        let haftalikSesSiralama = data.sort((uye1, uye2) => {
            let uye2Toplam = 0;
            uye2.voiceStats.forEach(x => uye2Toplam += x);
            let uye1Toplam = 0;
            uye1.voiceStats.forEach(x => uye1Toplam += x);
            return uye2Toplam-uye1Toplam;
        }).slice(0, 10).map((m, index) => {
            let uyeToplam = 0;
            m.voiceStats.forEach(x => uyeToplam += x);
            return `**${index+1}.** ${message.guild.members.cache.get(m.userID).toString()} ${client.convertDuration(uyeToplam)}`;
        }).join('\n');

        let toplamChatSiralama = data.sort((uye1, uye2) => Number(uye2.totalChatStats)-Number(uye1.totalChatStats)).slice(0, 10).map((m, index) => `**${index+1}.** ${message.guild.members.cache.get(m.userID).toString()} ${(Number(m.totalChatStats)).toLocaleString()} mesaj`).join('\n');
        let haftalikChatSiralama = data.sort((uye1, uye2) => {
            let uye2Toplam = 0;
            uye2.chatStats.forEach(x => uye2Toplam += x);
            let uye1Toplam = 0;
            uye1.chatStats.forEach(x => uye1Toplam += x);
            return uye2Toplam-uye1Toplam;
        }).slice(0, 10).map((m, index) => {
            let uyeToplam = 0;
            m.chatStats.forEach(x => uyeToplam += x);
            return `**${index+1}.** ${message.guild.members.cache.get(m.userID).toString()} ${Number(uyeToplam).toLocaleString()} mesaj`;
        }).join('\n');


        if(!args[0]) return message.channel.send(embed.setDescription(`Hangi top sıralamaya bakacağını belirtmelisin! (top <haftalık/genel/xp/exzowoncy>)`))
        if(args[0] === "haftalık") { 
         message.channel.send(embed.setDescription(`\`${message.guild.name}\` sunucusunun **haftalık** ses ve chat istatistikleri sıralaması;`).addField('Ses', haftalikSesSiralama).addField('Chat', haftalikChatSiralama))
        }
    if(args[0] === "genel") {
        message.channel.send(embed.setDescription(`\`${message.guild.name}\` sunucunun **genel** ses ve chat istatistikleri sıralaması;`).addField('Ses', toplamSesSiralama).addField('Chat', toplamChatSiralama))
  
    }

    if(args[0] === "xp" || args[0] === "coin") { 
        message.channel.send(embed.setDescription(`\`${message.guild.name}\` sunucusunun **genel** XP sıralaması;\n\`•\` Toplam XP Sayısı: \`${coinSum.toLocaleString()}\``).addField('XP', `${coinUsers ? coinUsers :"Bulunamadı!"}`))

    }

    if(args[0] === "exzowoncy" || args[0] === "exz") { 
        message.channel.send(embed.setDescription(`\`${message.guild.name}\` sunucusunun **genel** exzowoncy sıralaması;\n\`•\` Toplam exzowoncy Sayısı: \`${exzSum.toLocaleString()}\``).addField('exzowoncy', `${exzUsers ? exzUsers :"Bulunamadı!"}`))

    }
})


};

module.exports.configuration = {
    name: 'top',
    aliases: ['top10'],
    usage: 'top (top <genel/haftalık/xp)',
    description: 'Top 10 istatistikler.',
    permLevel: 0
};