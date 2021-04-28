const { MessageEmbed, WebhookClient, Message } = require("discord.js");
const qdb = require('quick.db');
const moment = require('moment');
moment.locale('tr');
const MemberStats = require('../Models/MemberStats.js');
const Database = require('../models/inviter.js');
const code = require("@codedipper/random-code")

module.exports.execute = async (client, message, args, ayar, emoji) => {
let embed = new MessageEmbed().setColor(client.randomColor()).setAuthor(message.guild.name, message.guild.iconURL({display: true}))
if(!message.member.user.username.includes(ayar.tag)) return message.reply(`İsmine sunucu tagımızı (\`${ayar.tag}\`) alarak tekrar dene! \`!tag\` yazabilirsin.`)
if(ayar.teyitciRolleri.some(rol => message.member.roles.cache.has(rol))) return message.react('🚫');
var time = moment().format('DD MMMM YYYY , hh:mm');
var room;
var title;
var duration;
 let sınıf;
 let derslink;
var zaman;
var currentTime = new Date(),
hours = currentTime.getHours(),
minutes = currentTime.getMinutes(),
done = currentTime.getMinutes() + duration,
seconds = currentTime.getSeconds();

if (minutes < 10) {
minutes = "0" + minutes;
}
var suffix = "AM";
if (hours >= 24) {
suffix = "PM";
hours = hours - 24;
}
if (hours == 0) {
hours = 24;
}
/*if(hours <= 1){
  return message.reply("Bu komutu yalnızca 01:00 - 24:00 saatleri arasında kullanabilirsin.")
}
//82800
if(hours >= 24){
  return message.reply("Bu komutu yalnızca 01:00 - 24:00 saatleri arasında kullanabilirsin.")
}*/
var filter = m => m.author.id === message.author.id;
    message.react('✅');

    let modRole = message.guild.roles.cache.find(r => r.id === "815319656574222396")

    if (!modRole) {
        message.channel.send('Yetkili rolü bulunamadı!');
    }

    message.guild.channels.create(`basvuru-${message.author.username}`, {
        topic: `Başvuru Sahibi: ${message.author} `,
        type: 'text',
        parent: "815129698178039828",
        permissionOverwrites: [
            { id: message.guild.id, deny: ['VIEW_CHANNEL'] },
            { id: modRole.id, allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'] },
            { id: message.author.id, allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'] }
        ]
    }).then(c => { 

      message.reply(`başvurunuzu tamamlamak için açılan kanalda (${c}) sorulan sorulara cevap veriniz!`)

  c.send(`${message.author}`, {embed: embed.setDescription(`Öncelikle selam başvurunuz için teşekkürler! isim ve yaşınızı söyler misiniz?`)}).then(msg => {
  c.awaitMessages(filter, {
    max: 1,
    time: 120000,
    errors: ['time']
  }).then(collected => {
    let room = client.channels.cache.get("828741032724136006")
    if(!room) return message.channel.send('Başvuru log kanalı bulunmuyor.');
    room = collected.first().content;
    let dersadi = collected.first().content;
    collected.first();
    
    c.send(`${message.author}`, {embed: embed.setDescription(`Günlük aktiflik süreniz ne kadar ve ses teyit yapabilir misiniz?`)}).then(msg => {
        c.awaitMessages(filter, {
          max: 1,
          time: 120000,
          errors: ['time']
        }).then(collected => {
          
          let duration = collected.first().content
        collected.first()

        c.send(`${message.author}`, {embed: embed.setDescription(`Sunucumuzun büyümesi için invite yapmanız çok önemli haftalık olarak kaç invite yapabilirsiniz ve bunu devam ettirebilicek misiniz?`)}).then(msg => {
      c.awaitMessages(filter, {
        max: 1,
        time: 120000,
        errors: ['time']
      }).then(collected => {
        
        let sınıf = collected.first().content
      collected.first()
        
        c.send(`${message.author}`, {embed: embed.setDescription(`Ses ve chat kanallarında yeterli aktifliği sağlayabilir misiniz?`)}).then(msg => {
      c.awaitMessages(filter, {
        max: 1,
        time: 120000,
        errors: ['time']
      }).then(collected => {
        
        let dersid = collected.first().content
      collected.first()
        
         c.send(`${message.author}`, {embed: embed.setDescription(`Çıkan tartışma ve kavgalarda sakinliğinizi koruyabilir misiniz? kavgayı nasıl bitirirsiniz?`)}).then(msg => {
      c.awaitMessages(filter, {
        max: 1,
        time: 120000,
        errors: ['time']
      }).then(collected => {
        
        let derspw = collected.first().content
      collected.first()
        
      
        
      message.author.send(`Başvurunuz için teşekkürler. Başvurunuz alınmış yetkililer tarafından kontrolü beklemektedir.`)

            c.send(`<@&${ayar.yetkiliAlim}>`, { embed: embed.setDescription(`Başvuruyu onaylıyorsanız: \`!yetki @üye ver\`\nBaşvuruyu reddediyorsanız: \`/kapat\`\n\nKomutunu kullanın.`)})
              
            let giveEmbed = new MessageEmbed().setColor("BLACK").setAuthor(message.guild.name, message.guild.iconURL({display: true})).setDescription(`
            Adı ve Yaşı: ${dersadi}
            Aktiflik Süresi: ${duration}
            Invite Sayısı: ${sınıf}
            Aktiflik durumu: ${dersid}
            Tartışmalarda ki Tavrı: ${derspw}`).addField('Başvuru yapan kişinin bilgileri;', `ID: ${message.author.id}\nKişi: ${message.author.tag}\nEtiketli hali: <@${message.author.id}>`)
           client.channels.cache.get("828741032724136006").send(giveEmbed)                 
{
let memberr = message.member.id;
    c.createOverwrite(memberr, {
    VIEW_CHANNEL: false,
    SEND_MESSAGES: false
    })}
//1800000);
        
          });
        });
      });
      });
    
  
});
});
  

});
})
  
})
})
    }
) 

    
};
module.exports.configuration = {
  name: "başvuru",
  aliases: [],
  usage: "başvuru",
  description: "Yetki başvurusu yaparsınız."
};
