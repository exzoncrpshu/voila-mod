const { MessageEmbed } = require("discord.js");
const MemberStats = require('../Models/MemberStats.js');
const joinedAt = require("../Models/voiceJoinedAt.js");
const coin = require("../Models/coin.js");
const qdb = require("quick.db");
const conf = require("../exzsettings/sunucuAyar.js")
const db = new qdb.table("ayarlar");
let ayar = db.get('ayar') || {};
const sesli = new Map();

const client = global.client;
const sunucuAyar = global.sunucuAyar;
client.on("ready", async () => {
  client.guilds.cache.get(sunucuAyar.guildID).channels.cache.filter(e => e.type == "voice" && e.members.size > 0).forEach(channel => {
    channel.members.filter(member => !member.user.bot && !member.voice.selfDeaf).forEach(member => {
      sesli.set(member.id, {
	      channel: channel.parentID || channel.id,
	      duration: Date.now()
      });
    });
  });

  setInterval(() => {
    sesli.forEach((value, key) => {
      voiceInit(key, value.channel, getDuraction(value.duration));
      sesli.set(key, {
        channel: value.channel,
        duration: Date.now()
      });
    });
  }, 120000);
});

module.exports = async(oldState, newState) => {
  if(oldState.member && (oldState.member.user.bot || newState.selfDeaf)) return;

  if(newState.channelID != null) {
    qdb.set(`voiceTime.${oldState.id}.${oldState.guild.id}`, new Date());
    }
    if(newState.channelID == null) {
    qdb.delete(`voiceTime.${oldState.id}.${oldState.guild.id}`)
    }
    if (oldState.channelID  != newState.channelID  ) {
    qdb.delete(`voiceTime.${oldState.id}.${oldState.guild.id}`)
    qdb.set(`voiceTime.${oldState.id}.${oldState.guild.id}`, new Date());
    }
  if (!oldState.channelID && newState.channelID) await joinedAt.findOneAndUpdate({ userID: newState.id }, { $set: { date: Date.now() } }, { upsert: true });

  let joinedAtData = await joinedAt.findOne({ userID: oldState.id });

  if (!joinedAtData) await joinedAt.findOneAndUpdate({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
  joinedAtData = await joinedAt.findOne({ userID: oldState.id });
  const yusuf = Date.now() - joinedAtData.date;

  if (oldState.channelID && !newState.channelID) {
    await saveDatas(oldState, oldState.channel, yusuf);
    await joinedAt.deleteOne({ userID: oldState.id });
  } else if (oldState.channelID && newState.channelID) {
    await saveDatas(oldState, oldState.channel, yusuf);
    await joinedAt.findOneAndUpdate({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
  }

  async function saveDatas(user, channel, yusuf) {
    if (ayar.teyitciRolleri.some(x => user.member.roles.cache.has(x))) {
    if (yusuf >= (1000 * 60) * 1) await coin.findOneAndUpdate({ guildID: user.guild.id, userID: user.id }, { $inc: { coin: 0.2 * parseInt(yusuf/1000/60) } }, { upsert: true });
      const coinData = await coin.findOne({ guildID: user.guild.id, userID: user.id });
      if (coinData && client.ranks.some(x => x.coin >= 0.2)) {
        let newRank = client.ranks.filter(x => coinData.coin >= x.coin);
        newRank = newRank[newRank.length-1];
        if (newRank && Array.isArray(newRank.role) && !newRank.role.some(x => user.member.roles.cache.has(x)) || newRank && !Array.isArray(newRank.role) && !user.member.roles.cache.has(newRank.role)) {
          const oldRank = client.ranks[client.ranks.indexOf(newRank)-1];
          user.member.roles.add(newRank.role);
          if (oldRank && Array.isArray(oldRank.role) && oldRank.role.some(x => user.member.roles.cache.has(x)) || oldRank && !Array.isArray(oldRank.role) && user.member.roles.cache.has(oldRank.role)) user.member.roles.remove(oldRank.role);
          user.guild.channels.cache.get(conf.yetkirankup).send(`${user.member.toString()} yetkilisi **${(coinData.coin).toLocaleString()}** XP sayısına ulaşarak **"${Array.isArray(newRank.role) ? newRank.role.map(x => `<@&${x}>`).join(", ") :`${user.guild.roles.cache.get(newRank.role).name}`}"** yetkisine yükseltildi!`);
        }
      }
    }
  }

  if (!oldState.channelID && newState.channelID) {
    sesli.set(oldState.id, {
      channel: newState.guild.channels.cache.get(newState.channelID).parentID || newState.channelID,
      duration: Date.now()
    });
  }
  if (!sesli.has(oldState.id))
    sesli.set(oldState.id, {
      channel: newState.guild.channels.cache.get(oldState.channelID || newState.channelID).parentID || newState.channelID,
      duration: Date.now()
    });

  let data = sesli.get(oldState.id);
  let duration = getDuraction(data.duration);
  if (oldState.channelID && !newState.channelID) {
    voiceInit(oldState.id, data.channel, duration);
    sesli.delete(oldState.id);
  } else if (oldState.channelID && newState.channelID) {
    voiceInit(oldState.id, data.channel, duration);
    sesli.set(oldState.id, {
      channel: newState.guild.channels.cache.get(newState.channelID).parentID || newState.channelID,
      duration: Date.now()
    });
  }

};

module.exports.configuration = {
  name: "voiceStateUpdate"
};

function getDuraction(ms) {
  return Date.now() - ms;
};

function voiceInit(memberID, categoryID, duraction) {
  MemberStats.findOne({guildID: sunucuAyar.guildID, userID: memberID}, (err, data) => {
    if (!data) {
      let voiceMap = new Map();
      let chatMap = new Map();
      voiceMap.set(categoryID, duraction);
      let newMember = new MemberStats({
        guildID: sunucuAyar.guildID,
        userID: memberID,
        voiceStats: voiceMap,
        totalVoiceStats: duraction,
        chatStats: chatMap,
        totalChatStats: 0
      });
      newMember.save();
    } else {
      let onceki = data.voiceStats.get(categoryID) || 0;
      data.voiceStats.set(categoryID, Number(onceki)+duraction);
      data.totalVoiceStats = Number(data.totalVoiceStats)+duraction;
      data.save();
    };
  });
};