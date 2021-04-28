const { MessageEmbed } = require('discord.js');
const MemberStats = require('../Models/MemberStats.js');
const conf = require('../exzsettings/ayarlar.json');


module.exports.execute = async (client, message, args) => {
    if(!conf.sahip.includes(message.author.id))
        if((message.guild.ownerID != message.author.id)) return message.channel.csend('**Bunu yapmak için yeterli yetkin yok!**');
    let secim = args[0];
    const embed = new MessageEmbed().setColor(client.randomColor()).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true }));
    if (secim === 'sıfırla') {
        if (!args[1] || (args[1] !== 'ses' && args[1] !== 'chat' )) return message.channel.csend(embed.setDescription('Sıfırlanacak veriyi belirtmelisin! (ses/chat)')).then(x => x.delete({timeout: 5000}));
        if (args[1] === 'ses') {
            let newData = new Map();
            await MemberStats.updateMany({ guildID: message.guild.id }, { voiceStats: newData });
        }

        if (args[1] === 'chat') {
            let newData = new Map();
            await MemberStats.updateMany({ guildID: message.guild.id }, { chatStats: newData });
        }
        return     message.channel.csend( embed.setDescription('Başarıyla belirtilen istatistik verileri sıfırlandı!'));
    }
    if (!secim) return message.channel.csend(embed.setDescription('Ses, chat veya teyit istatistiklerini sıfırlamak istiyorsan **sıfırla ses/chat** olarak hangi veriyi sıfırlamak istediğini belirtmelisin.'));
};

module.exports.configuration = {
    name: 'statspanel',
    aliases: ['statsayar','statsayarlar'],
    usage: 'statspanel [seçim] [ayar]',
    description: 'Sunucu ayarları.',
   // permLevel: 0
};
