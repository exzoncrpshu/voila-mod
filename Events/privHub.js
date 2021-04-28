const { MessageEmbed, WebhookClient } = require("discord.js");
const qdb = require("quick.db");
const db = new qdb.table("ayarlar");


module.exports = async (oldState, newState) => {

  let geciciOda = "814921187809165391"; 
  let geciciOdaSembol = "⭐"; 
  
  if (!newState.member.user.bot && newState.guild.channels.cache.has(geciciOda) && newState.member.voice.channel && newState.member.voice.channel.id === geciciOda) {
    try {
      newState.member.guild.channels.create(geciciOdaSembol + " " + (newState.member.displayName).replace(/[^a-zA-ZığüşöçĞÜŞİÖÇ0123456789 ]+/g, ''), { type: "voice", parent: newState.member.guild.channels.cache.get(geciciOda).parentID }).then(async kanal => {
        await kanal.createOverwrite(newState.member.id, { VIEW_CHANNEL: true, CONNECT: true, SPEAK: true, MUTE_MEMBERS: true, MOVE_MEMBERS: true, DEAFEN_MEMBERS: true, MANAGE_CHANNELS: false, MANAGE_ROLES: false, MANAGE_WEBHOOKS: false });
        await newState.member.voice.setChannel(kanal.id);
      });
    } catch (yashinu) { console.error(yashinu) };
  };
  
if (oldState.channel && oldState.channel.name.startsWith(geciciOdaSembol) && oldState.channel.members.filter(x => !x.user.bot).size < 1) oldState.channel.delete();


}
module.exports.configuration = {
  name: "voiceStateUpdate"
};