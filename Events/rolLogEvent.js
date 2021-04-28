const { MessageEmbed, WebhookClient } = require("discord.js");
const qdb = require("quick.db");
const db = new qdb.table("ayarlar");
const RoleDatabase = require("../Models/rollogs.js");
const moment = require("moment")
module.exports = async (oldMember, newMember) => {

    let aldiverdi;
    if(oldMember.roles.cache.size < newMember.roles.cache.size){ aldiverdi = `${client.emoji("onay")}` } else { aldiverdi = `${client.emoji("iptal")}`}
    if(oldMember.roles.cache.size !== newMember.roles.cache.size) {
    let rolveren = await oldMember.guild.fetchAuditLogs({ type: 'GUILD_MEMBER_UPDATE' }).then(audit => audit.entries.first());
    let role = oldMember.roles.cache.find(s => !newMember.roles.cache.has(s.id)) || newMember.roles.cache.find(s => !oldMember.roles.cache.has(s.id))
    let dta = await RoleDatabase.findOne({ guildID: newMember.guild.id, kullanıcıID: newMember.id }) 
    if(!dta){
      let newRoleData = new RoleDatabase({
        guildID: newMember.guild.id,
        kullanıcıID: newMember.id,
        rolveridb: { staffID: rolveren.executor.id, tarih: Date.now(), rolid: role.id, type: aldiverdi }
      }).save(); } else {
        dta.rolveridb.push({ staffID: rolveren.executor.id, tarih: Date.now(), rolid: role.id, type: aldiverdi })
        dta.save()
      }
  }
    


    Date.prototype.toTurkishFormatDate = function () {
      return moment.tz(this, "Europe/Istanbul").format('LL');
    };
}
module.exports.configuration = {
  name: "guildMemberUpdate"
};