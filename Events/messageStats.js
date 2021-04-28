const MemberStats = require('../Models/MemberStats.js');
const qdb = require("quick.db");
const db = new qdb.table("ayarlar");
const coin = require("../Models/coin.js");
const exzowoncy = require("../Models/exzowoncy.js");
const conf = require("../exzsettings/sunucuAyar.js")
let ayar = db.get('ayar') || {};
const nums = new Map();
const exzwoncy = new Map();
module.exports = async (message) => {

  if (message.author.bot || !message.guild) return;
  if(message.channel.name.includes("priv-chat")) return;
  if(message.channel.name.includes("basvuru")) return;
  if (ayar.teyitciRolleri.some(x => message.member.roles.cache.has(x))) {
    const num = nums.get(message.author.id);
    if (num && (num % 1) === 0) {
      nums.set(message.author.id, num + 1);
      await coin.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: 0.1 } }, { upsert: true });
      const coinData = await coin.findOne({ guildID: message.guild.id, userID: message.author.id });
      if (coinData && client.ranks.some(x => coinData.coin === x.coin)) {
        let newRank = client.ranks.filter(x => coinData.coin >= x.coin);
        newRank = newRank[newRank.length-1];
        const oldRank = client.ranks[client.ranks.indexOf(newRank)-1];
        message.member.roles.add(newRank.role);
        if (oldRank && Array.isArray(oldRank.role) && oldRank.role.some(x => message.member.roles.cache.has(x)) || oldRank && !Array.isArray(oldRank.role) && message.member.roles.cache.has(oldRank.role)) message.member.roles.remove(oldRank.role);
        message.guild.channels.cache.get(conf.yetkirankup).send(`${message.member.toString()} yetkilisi **${(coinData.coin).toLocaleString()}** XP sayısına ulaşarak **"${Array.isArray(newRank.role) ? newRank.role.map(x => `<@&${x}>`).join(", ") : `${user.guild.roles.cache.get(newRank.role).name}`}"** yetkisine yükseltildi!`);
      }
    } else nums.set(message.author.id, num ? num + 1 : 1);
  }
  
const exowoncy = Math.floor(Math.random() * 65000) + 10000
const ysf = Math.floor(Math.random() * 150) + 100
  const exz = exzwoncy.get(message.author.id);
  if (exz && (exz % ysf) === 0) {
    exzwoncy.set(message.author.id, exz + 1);
    await exzowoncy.findOneAndUpdate({userID: message.author.id }, { $inc: { coin: exowoncy } }, { upsert: true }).then(x => { client.channels.cache.get(conf.exzowoncyearn).send(`**${client.emoji("exzowoncy")} ${message.author.username} |** Tebrikler, **${ysf}** mesaj atarak **${exowoncy}** exzowoncy kazandın!`).then(y => y.react('🪙')) });
    const exzowoncyData = await coin.findOne({serID: message.author.id });
  } else exzwoncy.set(message.author.id, exz ? exz + 1 : 1);

  MemberStats.findOne({ guildID: message.guild.id, userID: message.author.id }, (err, data) => {
    let kanalID = message.channel.id;
    if (!data) {
      let voiceMap = new Map();
      let chatMap = new Map();
      chatMap.set(kanalID, 1);
      let newMember = new MemberStats({
        guildID: message.guild.id,
        userID: message.author.id,
        voiceStats: voiceMap,
        totalVoiceStats: 0,
        chatStats: chatMap,
        totalChatStats: 1
      });
      newMember.save();
    } else {
      let onceki = data.chatStats.get(kanalID) || 0;
      data.chatStats.set(kanalID, Number(onceki)+1);
      data.totalChatStats++;
      data.save();
    };
  });
};

module.exports.configuration = {
  name: "message"
};