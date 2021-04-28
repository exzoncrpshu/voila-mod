const { MessageEmbed } = require("discord.js");
const qdb = require('quick.db');
const kdb = new qdb.table("kullanici");
const db = new qdb.table("ayarlar");
const jdb = new qdb.table("cezalar");
const ms = require('ms');
const moment = require('moment');
moment.locale('tr');
const cezaLimit = new Map();
const yetkili = require("../models/yetkili.js");
const coin = require("../Models/coin.js");

module.exports.execute = async (client, message, args, ayar, emoji) => {
  let embed = new MessageEmbed().setColor(client.randomColor()).setAuthor(message.member.displayName, message.author.avatarURL({display: true, size: 2048}))
  if((!ayar.erkekRolleri && !ayar.kizRolleri) || !ayar.teyitciRolleri) return message.channel.send("**Roller ayarlanmamış!**").then(x => x.delete({timeout: 5000}));
  if(!ayar.teyitciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.roles.cache.has(ayar.sahipRolu)) return message.react('❌');
  let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if(!uye) return message.channel.send(embed.setDescription("Geçerli bir üye belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  if (message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(embed.setDescription(`Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!`)).then(x => x.delete({timeout: 5000}));
  if (5 > 0 && cezaLimit.has(message.author.id) && cezaLimit.get(message.author.id) == 5) return message.inlineReply("3 Dakikada beş kere kullanabilirsin!").then(x => x.delete({timeout: 5000}));
  let reason = args.splice(1).join(" ");
  let tarih = Date.now()
  let cezano = qdb.fetch(`CezaNo.${message.guild.name}`) + 1;
  //cezalar
let a = `İşlemi iptal et.`
let b = `Seste Küfür/Hakaret`
let c = `Seste Dini/Milli/Ailevi Küfür`
let d = `Seste Bass/Müzik`
let e = `Chatte Küfür/Hakaret`
let f = `Chatte Dini/Milli/Ailevi Küfür`
let g = `Chatte tilt edici davranış ve Kışkırtma`
let h = `Flood/Spam/Abartı Capslock`
let ı = `Metin kanallarını amacı dışında kullanma`
let o = `Sunucu üyelerine rahatsızlık`
let ö = `Genel Troll`
let u = `Reklam`
  const mesaj = await message.channel.send(embed.setDescription(`${uye} üyesine verilecek cezayı seç.
  
  \`0.\` ${a}
  \`1.\` ${b}
  \`2.\` ${c}
  \`3.\` ${d}
  \`4.\` ${e}
  \`5.\` ${f}
  \`6.\` ${g}
  \`7.\` ${h}
  \`8.\` ${ı}
  \`9.\` ${o}
  \`10.\` ${ö}
  \`11.\` ${u}`))

        const response = await message.channel.awaitMessages(neblm => neblm.author.id === message.author.id, { max: 1, time: 30000 });
        const choice = response.first().content

        if(choice == '0') { 
          message.channel.send(embed.setDescription(`${message.author} işlem iptal edildi.`)).then(x => x.delete({timeout: 5000}))
        mesaj.delete()
      }
      if(choice == '1') { 
        mesaj.delete()
        let muteler = jdb.get(`tempmute`) || [];
        if (!muteler.some(j => j.id == uye.id)) {
          jdb.push(`tempsmute`, {id: uye.id, kalkmaZamani: Date.now()+ms("10m")})
          kdb.add(`kullanici.${message.author.id}.sesmute`, 1);
          kdb.push(`kullanici.${uye.id}.sicil`, {
            Yetkili: message.author.id,
            Tip: "VMUTE",
            Ceza: reason,
            Sebep: b,
            Zaman: Date.now()
          });
        };
        await coin.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: 10 } }, { upsert: true });
        await yetkili.findByIdAndUpdate(message.author.id, { $inc: { topceza: 1, chatmute: 0, sesmute: 1, jail: 0, kick: 0, ban: 0 } }, { upsert: true });
        if(uye.voice.channel) uye.voice.setMute(true).catch();
        await message.channel.send(embed.setDescription(`${uye} üyesi, \`${b}\` ${reason ? reason :""} sebebiyle cezalandırıldı. (\`#${cezano}\`)`))
        if(ayar.muteLogKanali && client.channels.cache.has(ayar.muteLogKanali)) client.channels.cache.get(ayar.muteLogKanali).send(new MessageEmbed().setColor("RED").setAuthor(uye.user.tag, uye.user.avatarURL({display: true, size: 2048})).setDescription(`${uye} (\`${uye.user.tag}\` - \`${uye.user.id}\`) üyesi 10 dakika süreliğine ses kanallarında susturuldu.\n\n• Ceza ID: \`#${cezano}\`\n• Ses Mute Yetkili: ${message.author} (\`${message.author.tag}\` - \`${message.author.id}\`)\n• Ses Mute Atılma: \`${moment(tarih).format('DD MMMM YYYY HH:mm')}\`\n• Ses Mute Bitiş: \`${moment(tarih+ms("10m")).format('DD MMMM YYYY HH:mm')}\`\n• Chat Mute Sebep: \`${b}\` ${reason ? reason :""}`)).catch();
    }
    if(choice == '2') { 
      mesaj.delete()
      let muteler = jdb.get(`tempmute`) || [];
      if (!muteler.some(j => j.id == uye.id)) {
        jdb.push(`tempsmute`, {id: uye.id, kalkmaZamani: Date.now()+ms("10m")})
        kdb.add(`kullanici.${message.author.id}.sesmute`, 1);
        kdb.push(`kullanici.${uye.id}.sicil`, {
          Yetkili: message.author.id,
          Tip: "VMUTE",
          Ceza: reason,
          Sebep: c,
          Zaman: Date.now()
        });
      };
      await coin.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: 10 } }, { upsert: true });
      await yetkili.findByIdAndUpdate(message.author.id, { $inc: { topceza: 1, chatmute: 0, sesmute: 1, jail: 0, kick: 0, ban: 0 } }, { upsert: true });
      if(uye.voice.channel) uye.voice.setMute(true).catch();
      await message.channel.send(embed.setDescription(`${uye} üyesi, \`${c}\` ${reason ? reason :""} sebebiyle cezalandırıldı. (\`#${cezano}\`)`))
      if(ayar.muteLogKanali && client.channels.cache.has(ayar.muteLogKanali)) client.channels.cache.get(ayar.muteLogKanali).send(new MessageEmbed().setColor("RED").setAuthor(uye.user.tag, uye.user.avatarURL({display: true, size: 2048})).setDescription(`${uye} (\`${uye.user.tag}\` - \`${uye.user.id}\`) üyesi 10 dakika süreliğine ses kanallarında susturuldu.\n\n• Ceza ID: \`#${cezano}\`\n• Ses Mute Yetkili: ${message.author} (\`${message.author.tag}\` - \`${message.author.id}\`)\n• Ses Mute Atılma: \`${moment(tarih).format('DD MMMM YYYY HH:mm')}\`\n• Ses Mute Bitiş: \`${moment(tarih+ms("10m")).format('DD MMMM YYYY HH:mm')}\`\n• Ses Mute Sebep: \`${c}\` ${reason ? reason :""}`)).catch();
    }
  if(choice == '3') { 
    mesaj.delete()
    let muteler = jdb.get(`tempmute`) || [];
    if (!muteler.some(j => j.id == uye.id)) {
      jdb.push(`tempsmute`, {id: uye.id, kalkmaZamani: Date.now()+ms("10m")})
      kdb.add(`kullanici.${message.author.id}.sesmute`, 1);
      kdb.push(`kullanici.${uye.id}.sicil`, {
        Yetkili: message.author.id,
        Tip: "VMUTE",
        Ceza: reason,
        Sebep: d,
        Zaman: Date.now()
      });
    };
    await coin.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: 10 } }, { upsert: true });
    await yetkili.findByIdAndUpdate(message.author.id, { $inc: { topceza: 1, chatmute: 0, sesmute: 1, jail: 0, kick: 0, ban: 0 } }, { upsert: true });
    if(uye.voice.channel) uye.voice.setMute(true).catch();
    await message.channel.send(embed.setDescription(`${uye} üyesi, \`${d}\` ${reason ? reason :""} sebebiyle cezalandırıldı. (\`#${cezano}\`)`))
    if(ayar.muteLogKanali && client.channels.cache.has(ayar.muteLogKanali)) client.channels.cache.get(ayar.muteLogKanali).send(new MessageEmbed().setColor("RED").setAuthor(uye.user.tag, uye.user.avatarURL({display: true, size: 2048})).setDescription(`${uye} (\`${uye.user.tag}\` - \`${uye.user.id}\`) üyesi 10 dakika süreliğine ses kanallarında susturuldu.\n\n• Ceza ID: \`#${cezano}\`\n• Ses Mute Yetkili: ${message.author} (\`${message.author.tag}\` - \`${message.author.id}\`)\n• Ses Mute Atılma: \`${moment(tarih).format('DD MMMM YYYY HH:mm')}\`\n• Ses Mute Bitiş: \`${moment(tarih+ms("10m")).format('DD MMMM YYYY HH:mm')}\`\n• Ses Mute Sebep: \`${d}\` ${reason ? reason :""}`)).catch();
}
if (choice == '4') { 
  mesaj.delete()
  if(!ayar.muteciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.roles.cache.has(ayar.sahipRolu)) return message.react('❌');
  let muteler = jdb.get(`tempmute`) || [];   
  if (!muteler.some(j => j.id == uye.id)) {
          jdb.push(`tempmute`, {id: uye.id, kalkmaZamani: Date.now()+ms("10m")})
          kdb.add(`kullanici.${message.author.id}.mute`, 1);
          kdb.push(`kullanici.${uye.id}.sicil`, {
            Yetkili: message.author.id,
            Tip: "MUTE",
            Ceza: reason,
            Sebep: e,
            Zaman: Date.now()
          });
        };    
        await coin.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: 10 } }, { upsert: true });
        await yetkili.findByIdAndUpdate(message.author.id, { $inc: { topceza: 1, chatmute: 1, sesmute: 0, jail: 0, kick: 0, ban: 0 } }, { upsert: true });
        await uye.roles.add(ayar.muteRolu).catch();
        await message.channel.send(embed.setDescription(`${uye} üyesi, \`${e}\` ${reason ? reason :""} sebebiyle cezalandırıldı. (\`#${cezano}\`)`))
        if(ayar.muteLogKanali && client.channels.cache.has(ayar.muteLogKanali)) client.channels.cache.get(ayar.muteLogKanali).send(new MessageEmbed().setColor("RED").setAuthor(uye.user.tag, uye.user.avatarURL({display: true, size: 2048})).setDescription(`${uye} (\`${uye.user.tag}\` - \`${uye.user.id}\`) üyesi 10 dakika süreliğine metin kanallarında susturuldu.\n\n• Ceza ID: \`#${cezano}\`\n• Chat Mute Yetkili: ${message.author} (\`${message.author.tag}\` - \`${message.author.id}\`)\n• Chat Mute Atılma: \`${moment(tarih).format('DD MMMM YYYY HH:mm')}\`\n• Chat Mute Bitiş: \`${moment(tarih+ms("10m")).format('DD MMMM YYYY HH:mm')}\`\n• Chat Mute Sebep: \`${e}\` ${reason ? reason :""}`)).catch();
      }
      if(choice == '5') { 
        mesaj.delete()
        if(!ayar.muteciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.roles.cache.has(ayar.sahipRolu)) return message.react('❌');
        let muteler = jdb.get(`tempmute`) || [];   
        if (!muteler.some(j => j.id == uye.id)) {
                jdb.push(`tempmute`, {id: uye.id, kalkmaZamani: Date.now()+ms("10m")})
                kdb.add(`kullanici.${message.author.id}.mute`, 1);
                kdb.push(`kullanici.${uye.id}.sicil`, {
                  Yetkili: message.author.id,
                  Tip: "MUTE",
                  Ceza: reason,
                  Sebep: f,
                  Zaman: Date.now()
                });
              };    
              await coin.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: 10 } }, { upsert: true });
              await yetkili.findByIdAndUpdate(message.author.id, { $inc: { topceza: 1, chatmute: 1, sesmute: 0, jail: 0, kick: 0, ban: 0 } }, { upsert: true });
              await uye.roles.add(ayar.muteRolu).catch();
              await message.channel.send(embed.setDescription(`${uye} üyesi, \`${f}\` ${reason ? reason :""} sebebiyle cezalandırıldı. (\`#${cezano}\`)`))
              if(ayar.muteLogKanali && client.channels.cache.has(ayar.muteLogKanali)) client.channels.cache.get(ayar.muteLogKanali).send(new MessageEmbed().setColor("RED").setAuthor(uye.user.tag, uye.user.avatarURL({display: true, size: 2048})).setDescription(`${uye} (\`${uye.user.tag}\` - \`${uye.user.id}\`) üyesi 10 dakika süreliğine metin kanallarında susturuldu.\n\n• Ceza ID: \`#${cezano}\`\n• Chat Mute Yetkili: ${message.author} (\`${message.author.tag}\` - \`${message.author.id}\`)\n• Chat Mute Atılma: \`${moment(tarih).format('DD MMMM YYYY HH:mm')}\`\n• Chat Mute Bitiş: \`${moment(tarih+ms("10m")).format('DD MMMM YYYY HH:mm')}\`\n• Chat Mute Sebep: \`${f}\` ${reason ? reason :""}`)).catch();
    }
    if(choice == '6') { 
      mesaj.delete()
      if(!ayar.muteciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.roles.cache.has(ayar.sahipRolu)) return message.react('❌');
      let muteler = jdb.get(`tempmute`) || [];   
      if (!muteler.some(j => j.id == uye.id)) {
              jdb.push(`tempmute`, {id: uye.id, kalkmaZamani: Date.now()+ms("10m")})
              kdb.add(`kullanici.${message.author.id}.mute`, 1);
              kdb.push(`kullanici.${uye.id}.sicil`, {
                Yetkili: message.author.id,
                Tip: "MUTE",
                Ceza: reason,
                Sebep: g,
                Zaman: Date.now()
              });
            };    
            await coin.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: 10 } }, { upsert: true });
            await yetkili.findByIdAndUpdate(message.author.id, { $inc: { topceza: 1, chatmute: 1, sesmute: 0, jail: 0, kick: 0, ban: 0 } }, { upsert: true });
            await uye.roles.add(ayar.muteRolu).catch();
            await message.channel.send(embed.setDescription(`${uye} üyesi, \`${g}\` ${reason ? reason :""} sebebiyle cezalandırıldı. (\`#${cezano}\`)`))
            if(ayar.muteLogKanali && client.channels.cache.has(ayar.muteLogKanali)) client.channels.cache.get(ayar.muteLogKanali).send(new MessageEmbed().setColor("RED").setAuthor(uye.user.tag, uye.user.avatarURL({display: true, size: 2048})).setDescription(`${uye} (\`${uye.user.tag}\` - \`${uye.user.id}\`) üyesi 10 dakika süreliğine metin kanallarında susturuldu.\n\n• Ceza ID: \`#${cezano}\`\n• Chat Mute Yetkili: ${message.author} (\`${message.author.tag}\` - \`${message.author.id}\`)\n• Chat Mute Atılma: \`${moment(tarih).format('DD MMMM YYYY HH:mm')}\`\n• Chat Mute Bitiş: \`${moment(tarih+ms("10m")).format('DD MMMM YYYY HH:mm')}\`\n• Chat Mute Sebep: \`${g}\` ${reason ? reason :""}`)).catch();
  }
  if(choice == '7') { 
    mesaj.delete()
    if(!ayar.muteciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.roles.cache.has(ayar.sahipRolu)) return message.react('❌');
    let muteler = jdb.get(`tempmute`) || [];   
    if (!muteler.some(j => j.id == uye.id)) {
            jdb.push(`tempmute`, {id: uye.id, kalkmaZamani: Date.now()+ms("10m")})
            kdb.add(`kullanici.${message.author.id}.mute`, 1);
            kdb.push(`kullanici.${uye.id}.sicil`, {
              Yetkili: message.author.id,
              Tip: "MUTE",
              Ceza: reason,
              Sebep: h,
              Zaman: Date.now()
            });
          };    
          await coin.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: 10 } }, { upsert: true });
          await yetkili.findByIdAndUpdate(message.author.id, { $inc: { topceza: 1, chatmute: 1, sesmute: 0, jail: 0, kick: 0, ban: 0 } }, { upsert: true });
          await uye.roles.add(ayar.muteRolu).catch();
          await message.channel.send(embed.setDescription(`${uye} üyesi, \`${h}\` ${reason ? reason :""} sebebiyle cezalandırıldı. (\`#${cezano}\`)`))
          if(ayar.muteLogKanali && client.channels.cache.has(ayar.muteLogKanali)) client.channels.cache.get(ayar.muteLogKanali).send(new MessageEmbed().setColor("RED").setAuthor(uye.user.tag, uye.user.avatarURL({display: true, size: 2048})).setDescription(`${uye} (\`${uye.user.tag}\` - \`${uye.user.id}\`) üyesi 10 dakika süreliğine metin kanallarında susturuldu.\n\n• Ceza ID: \`#${cezano}\`\n• Chat Mute Yetkili: ${message.author} (\`${message.author.tag}\` - \`${message.author.id}\`)\n• Chat Mute Atılma: \`${moment(tarih).format('DD MMMM YYYY HH:mm')}\`\n• Chat Mute Bitiş: \`${moment(tarih+ms("10m")).format('DD MMMM YYYY HH:mm')}\`\n• Chat Mute Sebep: \`${h}\` ${reason ? reason :""}`)).catch();
}
if(choice == '8') { 
  mesaj.delete()
  if(!ayar.muteciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.roles.cache.has(ayar.sahipRolu)) return message.react('❌');
  let muteler = jdb.get(`tempmute`) || [];   
  if (!muteler.some(j => j.id == uye.id)) {
          jdb.push(`tempmute`, {id: uye.id, kalkmaZamani: Date.now()+ms("10m")})
          kdb.add(`kullanici.${message.author.id}.mute`, 1);
          kdb.push(`kullanici.${uye.id}.sicil`, {
            Yetkili: message.author.id,
            Tip: "MUTE",
            Ceza: reason,
            Sebep: ı,
            Zaman: Date.now()
          });
        };    
        await coin.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: 10 } }, { upsert: true });
        await yetkili.findByIdAndUpdate(message.author.id, { $inc: { topceza: 1, chatmute: 1, sesmute: 0, jail: 0, kick: 0, ban: 0 } }, { upsert: true });
        await uye.roles.add(ayar.muteRolu).catch();
        await message.channel.send(embed.setDescription(`${uye} üyesi, \`${ı}\` ${reason ? reason :""} sebebiyle cezalandırıldı. (\`#${cezano}\`)`))
        if(ayar.muteLogKanali && client.channels.cache.has(ayar.muteLogKanali)) client.channels.cache.get(ayar.muteLogKanali).send(new MessageEmbed().setColor("RED").setAuthor(uye.user.tag, uye.user.avatarURL({display: true, size: 2048})).setDescription(`${uye} (\`${uye.user.tag}\` - \`${uye.user.id}\`) üyesi 10 dakika süreliğine metin kanallarında susturuldu.\n\n• Ceza ID: \`#${cezano}\`\n• Chat Mute Yetkili: ${message.author} (\`${message.author.tag}\` - \`${message.author.id}\`)\n• Chat Mute Atılma: \`${moment(tarih).format('DD MMMM YYYY HH:mm')}\`\n• Chat Mute Bitiş: \`${moment(tarih+ms("10m")).format('DD MMMM YYYY HH:mm')}\`\n• Chat Mute Sebep: \`${ı}\` ${reason ? reason :""}`)).catch();
}
if(choice == '9') { 
  mesaj.delete()
  if(!ayar.muteciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.roles.cache.has(ayar.sahipRolu)) return message.react('❌');
  let muteler = jdb.get(`tempmute`) || [];   
  if (!muteler.some(j => j.id == uye.id)) {
          jdb.push(`tempmute`, {id: uye.id, kalkmaZamani: Date.now()+ms("10m")})
          kdb.add(`kullanici.${message.author.id}.mute`, 1);
          kdb.push(`kullanici.${uye.id}.sicil`, {
            Yetkili: message.author.id,
            Tip: "MUTE",
            Ceza: reason,
            Sebep: o,
            Zaman: Date.now()
          });
        };    
        await coin.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: 10 } }, { upsert: true });
        await yetkili.findByIdAndUpdate(message.author.id, { $inc: { topceza: 1, chatmute: 1, sesmute: 0, jail: 0, kick: 0, ban: 0 } }, { upsert: true });
        await uye.roles.add(ayar.muteRolu).catch();
        await message.channel.send(embed.setDescription(`${uye} üyesi, \`${o}\` ${reason ? reason :""} sebebiyle cezalandırıldı. (\`#${cezano}\`)`))
        if(ayar.muteLogKanali && client.channels.cache.has(ayar.muteLogKanali)) client.channels.cache.get(ayar.muteLogKanali).send(new MessageEmbed().setColor("RED").setAuthor(uye.user.tag, uye.user.avatarURL({display: true, size: 2048})).setDescription(`${uye} (\`${uye.user.tag}\` - \`${uye.user.id}\`) üyesi 10 dakika süreliğine metin kanallarında susturuldu.\n\n• Ceza ID: \`#${cezano}\`\n• Chat Mute Yetkili: ${message.author} (\`${message.author.tag}\` - \`${message.author.id}\`)\n• Chat Mute Atılma: \`${moment(tarih).format('DD MMMM YYYY HH:mm')}\`\n• Chat Mute Bitiş: \`${moment(tarih+ms("10m")).format('DD MMMM YYYY HH:mm')}\`\n• Chat Mute Sebep: \`${o}\` ${reason ? reason :""}`)).catch();
}
if(choice == '10') { 
  mesaj.delete()
  if(!ayar.jailciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.roles.cache.has(ayar.sahipRolu)) return message.react('❌');
  qdb.add(`CezaNo.${message.guild.name}`, 1)
  await uye.roles.set(uye.roles.cache.has(ayar.boosterRolu) ? [ayar.jailRolu, ayar.boosterRolu] : [ayar.jailRolu]).catch();
  let jaildekiler = jdb.get(`jail`) || [];
  if (!jaildekiler.some(j => j.includes(uye.id))) {
    jdb.push(`jail`, `j${uye.id}`);
    kdb.add(`kullanici.${message.author.id}.jail`, 1);
    kdb.push(`kullanici.${uye.id}.sicil`, {
      Yetkili: message.author.id,
      Tip: "JAIL",
      Ceza: reason,
      Sebep: ö,
      Zaman: Date.now()
    });
  };
  await coin.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: 10 } }, { upsert: true });
  await yetkili.findByIdAndUpdate(message.author.id, { $inc: { topceza: 1, chatmute: 1, sesmute: 0, jail: 0, kick: 0, ban: 0 } }, { upsert: true });
  if(uye.voice.channel) uye.voice.kick().catch();
  message.channel.send(embed.setDescription(`${uye} üyesi, \`${ö}\` ${reason ? reason :""} sebebiyle cezalandırıldı! (\`#${cezano}\`)`)).catch(); // ${uye.roles.cache.filter(a => a.name !== "@everyone").map(x => x).join(', ')}
  if(ayar.jailLogKanali && client.channels.cache.has(ayar.jailLogKanali)) client.channels.cache.get(ayar.jailLogKanali).send(new MessageEmbed().setColor("RED").setAuthor(uye.user.tag, uye.user.avatarURL({display: true, size: 2048})).setDescription(`${uye} (\`${uye.user.tag}\` - \`${uye.user.id}\`) kalıcı olarak jaile atıldı!\n\n• Ceza ID: \`#${cezano}\`\n• Jail Yetkili: ${message.author} (\`${message.author.tag}\` - \`${message.author.id}\`)\n• Jail Tarih: \`${moment(tarih).format('DD MMMM YYYY HH:mm')}\`\n• Jail Sebep: \`${ö}\` ${reason ? reason :""}`)).catch();

}
if(choice == '11') { 
  mesaj.delete()
 // if(!ayar.jailciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.roles.cache.has(ayar.sahipRolu)) return message.react('❌');
  qdb.add(`CezaNo.${message.guild.name}`, 1)
  await uye.roles.set(uye.roles.cache.has(ayar.boosterRolu) ? [ayar.jailRolu, ayar.boosterRolu] : [ayar.jailRolu]).catch();
  let jaildekiler = jdb.get(`jail`) || [];
  if (!jaildekiler.some(j => j.includes(uye.id))) {
    jdb.push(`jail`, `j${uye.id}`);
    kdb.add(`kullanici.${message.author.id}.jail`, 1);
    kdb.push(`kullanici.${uye.id}.sicil`, {
      Yetkili: message.author.id,
      Tip: "JAIL",
      Ceza: reason,
      Sebep: u,
      Zaman: Date.now()
    });
  };
  await coin.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: 10 } }, { upsert: true });
  await yetkili.findByIdAndUpdate(message.author.id, { $inc: { topceza: 1, chatmute: 1, sesmute: 0, jail: 0, kick: 0, ban: 0 } }, { upsert: true });
  if(uye.voice.channel) uye.voice.kick().catch();
  message.channel.send(embed.setDescription(`${uye} üyesi, \`${u}\` ${reason ? reason :""} sebebiyle cezalandırıldı! (\`#${cezano}\`)`)).catch(); // ${uye.roles.cache.filter(a => a.name !== "@everyone").map(x => x).join(', ')}
  if(ayar.jailLogKanali && client.channels.cache.has(ayar.jailLogKanali)) client.channels.cache.get(ayar.jailLogKanali).send(new MessageEmbed().setColor("RED").setAuthor(uye.user.tag, uye.user.avatarURL({display: true, size: 2048})).setDescription(`${uye} (\`${uye.user.tag}\` - \`${uye.user.id}\`) kalıcı olarak jaile atıldı!\n\n• Ceza ID: \`#${cezano}\`\n• Jail Yetkili: ${message.author} (\`${message.author.tag}\` - \`${message.author.id}\`)\n• Jail Tarih: \`${moment(tarih).format('DD MMMM YYYY HH:mm')}\`\n• Jail Sebep: \`${u}\` ${reason ? reason :""}`)).catch();
}
if (5 > 0) {
  if (!cezaLimit.has(message.author.id)) cezaLimit.set(message.author.id, 1);
  else cezaLimit.set(message.author.id, cezaLimit.get(message.author.id) + 1);
  setTimeout(() => {
    if (cezaLimit.has(message.author.id)) cezaLimit.delete(message.author.id);
  }, 1000 * 60 * 3);
};
qdb.add(`CezaNo.${message.guild.name}`, 1)

 };
module.exports.configuration = {
  name: "ceza",
  aliases: ["ceza"],
  usage: "ceza",
  description: "Belirtilen üyeyi cezalandırır."
};