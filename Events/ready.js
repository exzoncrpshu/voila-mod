const qdb = require("quick.db");
const db = new qdb.table("ayarlar");
const ayar = db.get('ayar') || {};
const client = global.client;
const conf = require("../exzsettings/ayarlar.json");
const data = require("../Models/alarmMod.js")
const { MessageEmbed } = require("discord.js")
module.exports = async () => {
  
  console.log("Bot aktif!");
 client.user.setStatus("dnd"); // client.user.setPresence({ activity: { name: conf.Activity }, status: conf.Status })
  if (ayar.botSesKanali && client.channels.cache.has(ayar.botSesKanali)) client.channels.cache.get(ayar.botSesKanali).join().catch();


  setInterval(async () => {
    let muted = await data.find({
        "alarm": true,
        "endDate": {
            $lte: Date.now()
        }
    })

    muted.forEach(async memberdata => {
        let sunucu = client.guilds.cache.get(conf.sunucuId)
        if (!sunucu) return;
        let member = sunucu.members.cache.get(memberdata.user) || await sunucu.members.cache.fetch(memberdata.user).catch((err) => {
            data.deleteOne({ user: memberdata.user }, async (err) => {
                if (err) { console.log("Silinemedi") }
            })

        });
        if (!member) return;
        let kanal = sunucu.channels.cache.get(memberdata.channel)
        kanal.send(`${member} sana hatırlatma zamanım geldi!`, {embed: new MessageEmbed().setColor("RANDOM").setTimestamp().setDescription(memberdata.sebep)})
        //kanal.send(":alarm_clock: | <@!" + member + "> **" + memberdata.sebep + "** sebebi ile alarm kurmamı istemiştin.")
        let mem = sunucu.members.cache.get(memberdata.user)
        //mem.send(`${member} sana hatırlatma zamanım geldi!`, {embed: new MessageEmbed().setColor("RANDOM").setTimestamp().setDescription(memberdata.sebep)})
        data.deleteOne({ user: memberdata.user }, async (err) => {
            if (err) { console.log("Silinemedi") }
        })
    });
}, 5000);  

}
module.exports.configuration = {
  name: "ready"
}