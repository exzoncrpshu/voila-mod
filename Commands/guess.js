const { MessageEmbed } = require("discord.js");
const coin = require("../Models/exzowoncy.js");
const conf = require("../exzsettings/config.json")
const cfLimit = new Map();
const ms = require("parse-ms")
const moment = require("moment")
const qdb = require("quick.db");
const Discord = require('discord.js');
const { stripIndents } = require('common-tags');
  this.games = new Set();

module.exports.execute = async(client, message, args, ayar, emoji) => {

 
  let check = await qdb.get(`bank.account.${message.author.id}`)
  if (!check) {
    message.channel.send(`**${message.author.username} |** Bu oyunu oynamak için bir banka hesabına sahip olmalısın! **!hesap oluştur** yazarak oluşturabilirsin.`)
    return
  }
  const coinData = await coin.findOne({ userID: message.author.id }); // ${coinData.toLocaleString() ? coinData.coin.toLocaleString() : 0}
let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({display: true})).setColor("RANDOM")


 //if(message.author.id !== "518104479317360663") return message.react("🚫")
    let balance = coinData.coin
 

let bhs = args[0]
   if(!balance) return message.channel.send(`**🚫 ${message.author.username} |** hiç exzowoncy bakiyen bulunmuyor.`)
    if (args[0] < 5) return message.channel.send(`**🚫 ${message.author.username} |** Bu oyunda en az **5 exzowoncy** oynayabilirsin!`).then(x => x.delete({timeout: 10000}))
   if (isNaN(args[0])) return message.channel.send(`**🚫 ${message.author.username} |**  oynamak istediğin miktarı belirt!`).then(x => x.delete({timeout: 10000}))
    if (args[0] > 50000) return message.channel.send(`**🚫 ${message.author.username} |** Bu oyunda en fazla **50.000 exzowoncy** oynayabilirsin!`).then(x => x.delete({timeout: 10000}))
    if (args[0] > balance) return message.channel.send(`**🚫${message.author.username} |** Oynamak istediğin exzowoncy miktarına sahip değilsin!`).then(x => x.delete({timeout: 10000}))
  
      /*    await coin.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: -args[1] } }, { upsert: true });
         await qdb.set(`cooldowns.guess.${message.author.id}`, Date.now()) */
 
  if(this.games.has(message.channel.id)) return message.channel.send(`**🚫 ${message.author.username} |** kanalda şuan da devam eden bir oyun zaten var... :c`)
    const islem = Math.floor(Math.random() * (100 - 1)) + 1
    const fixedlisonuç = islem
    let choice;
    let haklar = 5
    await message.react('👌')
    this.games.add(message.channel.id);
    await message.channel.send(stripIndents`${message.author}, 0 ve 100 arasında ki numarayı tahmin etmek için **${bhs} exzowoncy** oynadın!\n${haklar} Deneme Hakkın Var.`);
           let uwu = false;
            while (!uwu && haklar !== 0) {
                const response = await message.channel.awaitMessages(neblm => neblm.author.id === message.author.id, { max: 1, time: 15000 });
              if(!response.first()) { 
                this.games.delete(message.channel.id);
                message.channel.send(`**🚫 ${message.author.username} |** zaman doldu ve **${bhs} exzowoncy** kaybettin... Sayı: **${fixedlisonuç}** :c`)
                await coin.findOneAndUpdate({ userID: message.author.id }, { $inc: { coin: -bhs } }, { upsert: true });
               await qdb.set(`cooldowns.guess.${message.author.id}`, Date.now())
              }              
                const choice = response.first().content
                if(isNaN(choice)) {
                  continue;
                }
                if (choice !== fixedlisonuç)  {
                  haklar -= 1
                  if(fixedlisonuç > choice) {
                  await message.channel.send(stripIndents`
					          ${message.author}, ${client.emoji("up")} Daha büyük bir numara söylemelisin!
					          **${haklar}** Deneme Hakkın Var.
				          `);
                  continue;
                  }
                  if(fixedlisonuç < choice) {
                    await message.channel.send(stripIndents`
					          ${message.author}, ${client.emoji("down")} Daha küçük bir numara söylemelisin!
					          **${haklar}** Deneme Hakkın Var.
				          `);
                  continue;
                  }
                }
                if (choice == fixedlisonuç) {
                  uwu = true
                }
                }  if (uwu) {
                  this.games.delete(message.channel.id);
                  await message.channel.send(`${message.author}, sayıyı doğru tahmin ettiğin için **${bhs} exzowoncy kazandın!** Sayı: **${fixedlisonuç}** :tada:`)
                  await coin.findOneAndUpdate({ userID: message.author.id }, { $inc: { coin: bhs } }, { upsert: true });
                  await qdb.set(`cooldowns.guess.${message.author.id}`, Date.now())
                  this.games.delete(message.channel.id);
                } else if (haklar == 0) {
                  this.games.delete(message.channel.id);
                  await message.channel.send(`${message.author}, sayıyı tahmin edemediğin için **${bhs} exzowoncy** kaybettin! Sayı: **${fixedlisonuç}** :shrug:`)
                  await coin.findOneAndUpdate({ userID: message.author.id }, { $inc: { coin: -bhs } }, { upsert: true });
                  await qdb.set(`cooldowns.guess.${message.author.id}`, Date.now())
                }

              
};
module.exports.configuration = {
    name: "guess",
    aliases: ["tahmin"],
    usage: "guess [bahis]",
    description: "Belirtilen miktarda iddiaya girersiniz."
};