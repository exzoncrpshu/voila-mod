const Discord = require('discord.js');
const { stripIndents } = require('common-tags');
const { randomRange, verify } = require('../util/Util.js');
const qdb = require("quick.db");
const coin = require("../Models/exzowoncy.js");

module.exports.execute = async(client, message, args, ayar, emoji) => {
  let embed = new Discord.MessageEmbed().setColor(client.randomColor())
  this.fighting = new Set();
  
  let opponent = message.mentions.users.first() || message.guild.members.cache.get(args[0])
  let bahis = args[1]
  if (!opponent) return message.channel.send(`**🚫 ${message.author.username} |** Birisini etiketlemelisin!`)

  let checkself = await qdb.get(`bank.account.${message.author.id}`)
  if (!checkself) {
    message.channel.send(`**${message.author.username} |** Bu oyunu oynamak için bir banka hesabına sahip olmalısın! **!hesap oluştur** yazarak oluşturabilirsin.`)
    return
  }
let check = await qdb.get(`bank.account.${opponent.id}`)
  if (!check) {
    message.channel.send(`**${message.author.username} |** ${opponent.username}'nin bu oyunu oynamak için bir banka hesabına sahip olması gerekiyor! **!hesap oluştur** yazarak banka hesabı oluşturabilir.`)
    return
  }
  const coinSelf = await coin.findOne({userID: message.author.id });
  const coinOpponent = await coin.findOne({userID: opponent.id });
  let balanceSelf = coinSelf.coin
  let balance = coinOpponent.coin
if (opponent.bot) return message.channel.send(`**🚫 ${message.author.username} |** Botlar ile oynayamazsın!`).then(x => x.delete({timeout: 10000}))
if (opponent.id === message.author.id) return message.channel.send(`**🚫 ${message.author.username} |** kendin ile düello oynayamazsın!`).then(x => x.delete({timeout: 10000}))
if(balance < bahis) return message.channel.send(`**🚫 ${message.author.username} |** ${opponent.username}'nin bu kadar bakiyesi bulunmuyor!`).then(x => x.delete({timeout: 10000}))
if(balanceSelf < bahis) return message.channel.send(`**🚫 ${message.author.username} |** oynadığın bahis kadar bakiyen bulunmuyor!`).then(x => x.delete({timeout: 10000}))
if (isNaN(bahis)) return message.channel.send(`**🚫 ${message.author.username} |**  oynamak istediğin miktarı belirt!`).then(x => x.delete({timeout: 10000}))
if (bahis < 5000) return message.channel.send(`**🚫 ${message.author.username} |** Bu oyunda en az **5000 exzowoncy** oynayabilirsin!`).then(x => x.delete({timeout: 10000}))
if (bahis > 500000) return message.channel.send(`**🚫 ${message.author.username} |** Bu oyunda en fazla **500.000 exzowoncy** oynayabilirsin!`)	.then(x => x.delete({timeout: 10000}))

if (this.fighting.has(message.channel.id)) return message.channel.send(`**🚫 ${message.author.username} |** şuan da devam eden bir düello zaten var!`).then(x => x.delete({timeout: 10000}))
		this.fighting.add(message.channel.id);
		try {
			if (!opponent.bot) {
                await message.channel.send(`**${message.author.username} |** tarafından düello isteği geldi kabul etmek için **evet** reddetmek için **hayır** yazın! ${opponent}`)
				const verification = await verify(message.channel, opponent);
				if(verification) {
			    await coin.findOneAndUpdate({ userID: opponent.id }, { $inc: { coin: -bahis } }, { upsert: true });
				await coin.findOneAndUpdate({ userID: message.author.id }, { $inc: { coin: -bahis } }, { upsert: true });
				}
				if (!verification) {
					this.fighting.delete(message.channel.id);
					return message.channel.send(`**${message.author.username} |** düello kabul edilmedi!`).then(x => x.delete({timeout: 10000}))
				}
			}
			let userHP = 500;
			let oppoHP = 500;
			let userTurn = false;
			let guard = false;
			const reset = (changeGuard = true) => {
				userTurn = !userTurn;
				if (changeGuard && guard) guard = false;
			};
			const dealDamage = damage => {
				if (userTurn) oppoHP -= damage;
				else userHP -= damage;
			};
			const forfeit = () => {
				if (userTurn) userHP = 0;
				else oppoHP = 0;
			};
			while (userHP > 0 && oppoHP > 0) { // eslint-disable-line no-unmodified-loop-condition
				const user = userTurn ? message.author : opponent;
				let choice;
				if (!opponent.bot || (opponent.bot && userTurn)) {
					await message.channel.send(`${user} yapmak istediğin hamleyi belirt! (**saldır**, **savun**, **ultra güç** veya **kaç**)\n\n${message.author}: ${userHP} :heartpulse:\n${opponent}: ${oppoHP} :heartpulse:`);
					const filter = res =>
						res.author.id === user.id && ['saldır', 'savun', 'ultra güç', 'kaç'].includes(res.content.toLowerCase());
					const turn = await message.channel.awaitMessages(filter, {
						max: 1,
						time: 30000
					});
					if (!turn.size) {
						await message.reply(`süre doldu!`);
						reset();
						continue;
					}
					choice = turn.first().content.toLowerCase();
				} else {
					const choices = ['saldır', 'savun', 'ultra güç'];
					choice = choices[Math.floor(Math.random() * choices.length)];
				}
				if (choice === 'saldır') {
					const damage = Math.floor(Math.random() * (guard ? 10 : 100)) + 1;
					await message.channel.send(`**${user.username} |** **${damage}** hasar vurdu!`);
					dealDamage(damage);
					reset();
				} else if (choice === 'savun') {
					await message.channel.send(`**${user.username} |** kendisini süper kalkan ile savundu!`);
					guard = true;
					reset(false);
				} else if (choice === 'ultra güç') {
					const miss = Math.floor(Math.random() * 4);
					if (!miss) {
						const damage = randomRange(100, guard ? 150 : 300);
						await message.channel.send(`**${user.username} |** ultra güç kullandı ve **${damage}** hasar vurdu!`)
						dealDamage(damage);
					} else {
						await message.channel.send(`**${user.username} |** Ultra gücü değerlendiremedi!`)
					}
					reset();
				} else if (choice === 'kaç') {
					await message.channel.send(`**${user.username} |** kaçtı korkak!`)
					forfeit();
					break;
				} else {
					await message.reply('Ne yapmak istediğini anlamadım.');
				}
			}
			this.fighting.delete(message.channel.id);
            const winner = userHP > oppoHP ? message.author : opponent;
			await message.channel.send(`Oyun bitti! Tebrikler, **${winner}** **${bahis} exzowoncy** kazandı!\n\n**${message.author}**: ${userHP} :heartpulse: \n**${opponent}**: ${oppoHP} :heartpulse:`);
		    await coin.findOneAndUpdate({ userID: winner.id }, { $inc: { coin: bahis*2 } }, { upsert: true });
			return;
		} catch (err) {
			this.fighting.delete(message.channel.id);
			throw err;
		}
  }
  module.exports.configuration = {
    name: "düello",
    aliases: ["savaş"],
    usage: "düello [üye] [iddia]",
    description: "Belirtilen üyeyle düello oynatır."
};

