const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const db = new qdb.table("ayarlar");
const kdb = new qdb.table("kullanici");

module.exports.execute = (client, message, args, ayar, emoji) => {
    if((!ayar.erkekRolleri && !ayar.kizRolleri) || !ayar.teyitciRolleri) return message.channel.csend("**Roller ayarlanmamış!**").then(x => x.delete({timeout: 5000}));
    if(!message.member.hasPermission("ADMINISTRATOR") && !message.member.roles.cache.has(ayar.sahipRolu)) return message.react('❌');
 
    message.delete({timeout: 1000})
    if (message.channel.type == 'text') {
    message.channel.messages.fetch().then(messages => {
    const botlar = messages.filter(msg => msg.author.bot) 
    message.channel.bulkDelete(botlar);
    var totalSilinen = botlar.array().length
    message.reply(`**${totalSilinen}** mesaj silindi! (bot)`).then(x => x.delete({timeout: 5000}))
        }).catch(err => {
            console.log('Hata Oluştu!');
            console.log(err);
        });
    };
};
module.exports.configuration = {
    name: "bot-temizle",
    aliases: ["tb", "temizle-bot", "ysf"],
    usage: "temizle-bot",
    description: "Kanalda ki bot mesajlarını siler."
};