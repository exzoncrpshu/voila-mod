const { MessageEmbed } = require("discord.js");

module.exports.execute = async(client, message, args, ayar, emoji) => {
 
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.react("❌");
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!uye || !args[1] || isNaN(args[1]) || Number(args[1]) < 1 || Number(args[1]) > 99) return message.channel.csend(new MessageEmbed().setColor(client.randomColor()).setAuthor(message.member.displayName, message.author.avatarURL()).setDescription(`Bir üye ve silinicek mesaj sayısını belirtmelisin!`)).then(x => x.delete({timeout: 5000}));
    await message.delete();
    let mesajlar = await message.channel.messages.fetch();
   await message.channel.bulkDelete(mesajlar.filter(msj => msj.author.id === uye.id).array().slice(0, Number(args[1]))).then(() => message.channel.send(new MessageEmbed().setColor(client.randomColor()).setAuthor(message.member.displayName, message.author.avatarURL()).setDescription(`${uye} üyesinin mesajları silindi!`)).then(uyari => uyari.delete({timeout: 5000}))).catch(hata => message.channel.send("Bir hatayla karşılaşıldı!"));


};
module.exports.configuration = {
    name: "temizle-üye",
    aliases: ["üt", "clm", "ys"],
    usage: "temizle-üye [üye] [miktar] (1-100)",
    description: "Belirtilen üyenin mesajlarını siler."
};