const { MessageEmbed } = require("discord.js");
const exzowoncy = require("../Models/exzowoncy.js");
const inventory = require(`../Models/inventory.js`);
const items = require('../exzsettings/shopItems.js');
const ms = require("parse-ms")
const moment = require("moment")
module.exports.execute = async(client, message, args, ayar, emoji) => {
  //  if(message.author.id !== "518104479317360663") return message.react("🚫")
  const qdb = require("quick.db");
  let check = await qdb.get(`bank.account.${message.author.id}`)
  if (!check) {
    message.channel.send(`**🚫 ${message.author.username} |** Bu oyunu oynamak için bir banka hesabına sahip olmalısın! **!hesap oluştur** yazarak oluşturabilirsin.`)
    return
  }
 const coinData = await exzowoncy.findOne({ userID: message.author.id }); // ${coinData.toLocaleString() ? coinData.coin.toLocaleString() : 0}
if(!coinData) return message.channel.send(`**${client.emoji("exzowoncy")} | ${message.author.username},** hiç exzowoncy bulunmuyor.`)
 

if (!args[0]) return message.channel.send(`**🚫 ${message.author.username} |** almak istediğin ürün ismini yazmalısın... :c`).then(cryonicx2 => cryonicx2.delete({ timeout: 15000 }));
const itemToBuy = args[0].toLowerCase();
const validItem = !!items.find((val) => val.item.toLowerCase() === itemToBuy);
if (!validItem) return message.channel.send(`**🚫 ${message.author.username} |** böyle bir item bulunmuyor... :c`);
const itemPrice = items.find((val) => val.item.toLowerCase() === itemToBuy)
    .price;
const userBalance = coinData.coin
if (userBalance < itemPrice)
    return message.channel.send(`**🚫 ${message.author.username} |** bu itemi alabilmek için **${itemPrice} exzowoncy'e** ihtiyacın var`) 
const params = {
    Guild: message.guild.id,
    User: message.author.id
};
inventory.findOne(params, async(err, data) => {
    if (data) {
        const hasItem = Object.keys(data.Inventory).includes(itemToBuy);
        if (!hasItem) {
            data.Inventory[itemToBuy] = 1;
        } else {
            data.Inventory[itemToBuy]++
        }
        await inventory.findOneAndUpdate(params, data);
    } else {
        new inventory({
            Guild: message.guild.id,
            User: message.author.id,
            Inventory: {
                [itemToBuy]: 1,
            },
        }).save();
    }
 
    message.channel.send(`**:moneybag: ${message.author.username} |** almak istediğin **${itemToBuy}** isimli ürün alınıp veriler kaydediliyor.`).then(x => {
    setTimeout(() => { 
        x.edit(`**:moneybag: ${message.author.username} |** başarıyla **${itemToBuy}** isimli ürün satın alındı.`).then(x => x.react('🪙'))
     }, 3000)
    })
    await exzowoncy.findOneAndUpdate({ userID: message.author.id }, { $inc: { coin: -itemPrice } }, { upsert: true })

    await inventory.findOneAndUpdate({ User: message.author.id }, { $inc: { cash: itemPrice } }, { upsert: true });
});
};
module.exports.configuration = {
    name: "buy",
    aliases: ["al", "satınal", "satın-al"],
    usage: "buy",
    description: "Belirtilen üyenin avatarını gösterir."
};