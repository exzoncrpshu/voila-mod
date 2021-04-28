const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const db = new qdb.table("ayarlar");
const kdb = new qdb.table("kullanici");
const moment = require("moment");
moment.locale('tr');
const teyitci = require("../models/teyitci.js");
const kayitlar = require("../models/kayitlar.js");
const coin = require("../Models/coin.js");
const isimLimit = new Map();

module.exports.execute = async (client, message, args, ayar, emoji) => {
  const yuusuf = new MessageEmbed().setColor("RANDOM").setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true}))
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor("RANDOM");
  if(!ayar.teyitciRolleri) return message.channel.csend("**Roller ayarlanmamış!**").then(x => x.delete({timeout: 5000}));
  if(!ayar.teyitciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.roles.cache.has(ayar.sahipRolu)) return message.react('🚫');
  let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  let Time = Date.now()
  if(!uye) return message.channel.send(embed.setDescription("Geçerli bir üye belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  if (5 > 0 && isimLimit.has(message.author.id) && isimLimit.get(message.author.id) == 5) return message.inlineReply("3 Dakikada beş kere kullanabilirsin!").then(x => x.delete({timeout: 5000}));
  if (message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(embed.setDescription(`Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!`)).then(x => x.delete({timeout: 5000}));
  args = args.filter(a => a !== "" && a !== " ").splice(1);
  let yazilacakIsim;
  if (db.get(`ayar.isim-yas`)) {
    let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
    let yaş = args.filter(arg => !isNaN(arg))[0] || undefined;
    if(!isim || !yaş) return message.channel.send(embed.setDescription("Geçerli bir isim ve yaş belirtmelisin!")).then(x => x.delete({timeout: 5000}));
    yazilacakIsim = `${uye.user.username.includes(ayar.tag) ? ayar.tag : (ayar.ikinciTag ? ayar.ikinciTag : (ayar.tag || ""))} ${isim} | ${yaş}`;
  } else {

    let isim = args.join(' ');
    if(!isim) return message.channel.send(embed.setDescription("Geçerli bir isim belirtmelisin!")).then(x => x.delete({timeout: 5000}));
    yazilacakIsim = `${uye.user.username.includes(ayar.tag) ? ayar.tag : (ayar.ikinciTag ? ayar.ikinciTag : (ayar.tag || ""))} ${isim}`;
  };
  let isimlerii = ``;
  let memberData = await kayitlar.findById(uye.id);
  if(memberData) {
    let isimsira = `${client.emoji("iptal")} Bu kullanıcı önceden aşağıda ki isimler ile de kayıt olmuş:\n\n${memberData.kayitlar.reverse().slice(0, 7).map((data, index) => `\`•\` \`${data.isim}\``).join("\n")}\n\nTüm isim geçmişine \`!isimler @üye\` ile bakmanız önerilir.`
    isimlerii += `${isimsira}`
  }
  let staffData = await teyitci.findById(message.author.id);
  if(staffData) yuusuf.setFooter(`Yetkilinin kayıt sayısı: ${staffData.teyitler+1 || 0}`)
  uye.setNickname(`${yazilacakIsim}`).catch(e => message.inlineReply(embed.setDescription(`Yapılacak isim 32 karakterden uzun veya botun yetkisi yetmiyor!`)));
  const mesaj = await message.channel.send(yuusuf.setDescription(`${uye} üyesinin ismi "${yazilacakIsim}" olarak değiştirildi.\n\n${isimlerii ? isimlerii :""}`)).catch();
  if (5 > 0) {
    if (!isimLimit.has(message.author.id)) isimLimit.set(message.author.id, 1);
    else isimLimit.set(message.author.id, isimLimit.get(message.author.id) + 1);
    setTimeout(() => {
      if (isimLimit.has(message.author.id)) isimLimit.delete(message.author.id);
    }, 1000 * 60 * 3);
  };
let choice;
  const filter = res =>
  res.author.id === message.author.id && ['!erkek', '!e', '.erkek', '.e', '!k', '!kız', '!kadın', '.k', '.kız', '.kadın'].includes(res.content.toLowerCase());
const turn = await message.channel.awaitMessages(filter, {
  max: 1,
  time: 60000
});
if (!turn.size) return;
choice = turn.first().content.toLowerCase();
if (choice === "!erkek" || choice === "!e" || choice === ".erkek" || choice === ".e") {

  if (ayar.teyitsizRolleri && ayar.teyitsizRolleri.some(rol => uye.roles.cache.has(rol))) {
    await coin.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: 6 } }, { upsert: true });
    await teyitci.findByIdAndUpdate(message.author.id, { $inc: { teyitler: 1, erkek: 1, kiz: 0 } }, { upsert: true });
    await kayitlar.findByIdAndUpdate(uye.id, { $push: { kayitlar: [{ isim: yazilacakIsim, roller: ayar.erkekRolleri, tarih: Date.now() }] } }, { upsert: true });
  }
  await uye.roles.set(ayar.erkekRolleri || []).catch();
  await message.channel.send(yuusuf.setDescription(`${uye} üyesine ${uye.roles.highest.toString()} verildi.`));
  if(ayar.kayitLog && client.channels.cache.has(ayar.kayitLog)) client.channels.cache.get(ayar.kayitLog).send(new MessageEmbed().setColor(client.randomColor()).setDescription(`${uye} üyesi erkek olarak kaydedildi!\n\n• Kaydolan Üye: ${uye} (\`${uye.user.tag} - ${uye.id}\`)\n• Kaydeden Yetkili: ${message.author} (\`${message.author.tag} - ${message.author.id}\`)\n• Kaydedildiği Tarih: \`${moment(Time).format('DD MMMM YYYY HH:mm')}\`\n• Verilen Roller: ${uye.roles.cache.filter(a => a.name !== "@everyone").map(x => x).join(', ')}\n• Kaydedildiği İsim: \`${yazilacakIsim}\``));
  if(ayar.chatKanali && client.channels.cache.has(ayar.chatKanali)) client.channels.cache.get(ayar.chatKanali).send(`${uye} sunucuya giriş yaptı.`)

} else if(choice === "!kız" || choice === "!k" || choice === ".kız" || choice === ".k" || choice === ".kadın" || choice === "!kadın") {

    if (ayar.teyitsizRolleri && ayar.teyitsizRolleri.some(rol => uye.roles.cache.has(rol))) { 
      await coin.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: 6 } }, { upsert: true });
      await teyitci.findByIdAndUpdate(message.author.id, { $inc: { teyitler: 1, erkek: 0, kiz: 1 } }, { upsert: true });
      await kayitlar.findByIdAndUpdate(uye.id, { $push: { kayitlar: [{ isim: yazilacakIsim, roller: ayar.kizRolleri, tarih: Date.now() }] } }, { upsert: true });
    }
    await uye.roles.set(ayar.kizRolleri || []).catch();
    await message.channel.send(yuusuf.setDescription(`${uye} üyesine ${uye.roles.highest.toString()} verildi.`));
    if(ayar.kayitLog && client.channels.cache.has(ayar.kayitLog)) client.channels.cache.get(ayar.kayitLog).send(new MessageEmbed().setColor(client.randomColor()).setDescription(`${uye} üyesi kız olarak kaydedildi!\n\n• Kaydolan Üye: ${uye} (\`${uye.user.tag} - ${uye.id}\`)\n• Kaydeden Yetkili: ${message.author} (\`${message.author.tag} - ${message.author.id}\`)\n• Kaydedildiği Tarih: \`${moment(Time).format('DD MMMM YYYY HH:mm')}\`\n• Verilen Roller: ${uye.roles.cache.filter(a => a.name !== "@everyone").map(x => x).join(', ')}\n• Kaydedildiği İsim: \`${yazilacakIsim}\``));
    if(ayar.chatKanali && client.channels.cache.has(ayar.chatKanali)) client.channels.cache.get(ayar.chatKanali).send(`${uye} sunucuya giriş yaptı.`)

  }


};
module.exports.configuration = {
  name: "isim",
  aliases: ["name", "nick", "kayıt", "regist"],
  usage: "isim [üye] [isim] [yaş]",
  description: "Belirtilen üyenin isim ve yaşını değiştirir."
};