const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const db = new qdb.table("ayarlar");
const kdb = new qdb.table("kullanici");
const data = require("../Models/alarmMod.js")
const ms = require("ms")
const moment = require("moment")
require("moment-duration-format")
module.exports.execute = async(client, message, args, ayar, emoji) => {
 if(!message.author.username.includes(ayar.tag) && message.author.id !== "518104479317360663") return message.react("🚫")
  await data.findOne({ user: message.author.id }, async (err, res) => {
    let time = args[0]
    if (!time || isNaN(ms(time))) return message.reply(`Alarmı kurmak için bir süre belirt!`)
    if (!args.slice(1).join(" ")) return message.reply(`Alarm sebebini belirt!`)
    let regex = /h?t?t?p?s?:?\/?\/?discord.?gg\/?[a-zA-Z0-9]+/
    let regexSecond = /h?t?t?p?s?:?\/?\/?discorda?p?p?.?com\/?invites\/?[a-zA-Z0-9]+/
    if (regex.test(message.content) == true || regexSecond.test(message.content) == true) return message.reply(`yapacağın reklamı mı hatırlayacaksın :rofl:`)
    if (message.content.includes("@here" || "@everyone")) return
    if (!res) {
        const newData = new data({
            user: message.author.id,
            alarm: true,
            sebep: args.slice(1).join(" "),
            endDate: Date.now() + ms(args[0]),
            channel: message.channel.id
        })
        newData.save().catch(e => console.log(e))
    } else {
        res.user = message.author.id
        res.alarm = true
        res.sebep = args.slice(1).join(" ")
        res.endDate = Date.now() + ms(args[0])
        res.channel = message.channel.id
        res.save().catch(e => console.log(e))
    }
    let tamam = moment(Date.now() + ms(args[0])).fromNow()
    message.reply(`**${args.slice(1).join(" ")}** sebebiyle ${tamam} sana bunu hatırlatacağım.`)
})

};
module.exports.configuration = {
    name: "alarm",
    aliases: ["alarmkur"],
    usage: "alarm [süre] [sebep]",
    description: "Belirtilen üyenin tüm sicilini gösterir."
};