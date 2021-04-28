const Discord = require("discord.js");
const ms = require("parse-ms")
const moment = require("moment")
const qdb = require("quick.db");
const coin = require("../Models/exzowoncy.js");
const conf = require("../exzsettings/config.json")

module.exports.execute = async(client, message, args, ayar, emoji) => {

    let check = await qdb.get(`bank.account.${message.author.id}`)
    if (!check) {
      message.channel.send(`**${message.author.username} |** Bu oyunu oynamak için bir banka hesabına sahip olmalısın! **!hesap oluştur** yazarak oluşturabilirsin.`)
      return
    }
    const coinData = await coin.findOne({userID: message.author.id }); // ${coinData.toLocaleString() ? coinData.coin.toLocaleString() : 0}
  
  
  // if(message.author.id !== "518104479317360663") return message.react("🚫")
      let balance = coinData.coin
   
      let timeout = 1000*15
      let bump = await qdb.get(`cooldowns.bj.${message.author.id}`)
      if (bump !== null && timeout - (Date.now() - bump) > 0) {
        let time = ms(timeout - (Date.now() - bump))
        return message.channel.send(`**:stopwatch: |** Nu! **${message.author.username}!** Lütfen ${time.seconds} saniye bekle.`)
      }

  const money = parseInt(args[0])

  if(!balance) return message.channel.send(`**🚫 ${message.author.username} |** hiç exzowoncy bakiyen bulunmuyor.`)
  if (money < 5) return message.channel.send(`**🚫 ${message.author.username} |** Bu oyunda en az **5 exzowoncy** oynayabilirsin!`).then(x => x.delete({timeout: 10000}))
  if (money > 50000) return message.channel.send(`**🚫 ${message.author.username} |** Bu oyunda en fazla **50.000 exzowoncy** oynayabilirsin!`).then(x => x.delete({timeout: 10000}))
  if (money > balance) return message.channel.send(`**🚫 ${message.author.username} |** Oynamak istediğin exzowoncy miktarına sahip değilsin!`).then(x => x.delete({timeout: 10000}))
if (isNaN(money) || !money) return message.channel.send(`**🚫 ${message.author.username} |** bahis miktarı girmelisin.`)


var numCardsPulled = 0;
var gameOver = false;

var player = {
    cards: [],
    score: 0
};
var dealer = {
    cards: [],
    score: 0
};

function getCardsValue(a) {
    var cardArray = [],
        sum = 0,
        i = 0,
        dk = 10.5,
        doubleking = "QQ",
        aceCount = 0;
    cardArray = a;
    for (i; i < cardArray.length; i += 1) {
        if (cardArray[i].rank === "J" || cardArray[i].rank === "Q" || cardArray[i].rank === "K") {
            sum += 10;
        } else if (cardArray[i].rank === "A") {
            sum += 11;
            aceCount += 1;
        } else if (cardArray[i].rank === doubleking) {
            sum += dk
        } else {
            sum += cardArray[i].rank;
        }
    }
    while (aceCount > 0 && sum > 21) {
        sum -= 10;
        aceCount -= 1;
    }
    return sum;
}

var deck = {
    deckArray: [],
    initialize: function() {
        var suitArray, rankArray, s, r, n;
        suitArray = ["b", "d", "g", "s"];
        rankArray = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
        n = 13;

        for (s = 0; s < suitArray.length; s += 1) {
            for (r = 0; r < rankArray.length; r += 1) {
                this.deckArray[s * n + r] = {
                    rank: rankArray[r],
                    suit: suitArray[s]
                };
            }
        }
    },
    shuffle: function() {
        var temp, i, rnd;
        for (i = 0; i < this.deckArray.length; i += 1) {
            rnd = Math.floor(Math.random() * this.deckArray.length);
            temp = this.deckArray[i];
            this.deckArray[i] = this.deckArray[rnd];
            this.deckArray[rnd] = temp;
        }
    }
};

deck.initialize();
deck.shuffle();

async function bet(outcome) {
  if (outcome === "win") {
    await coin.findOneAndUpdate({userID: message.author.id }, { $inc: { coin: money } }, { upsert: true });
    await qdb.set(`cooldowns.bj.${message.author.id}`, Date.now())
  }
  if (outcome === "lose") {
    await coin.findOneAndUpdate({userID: message.author.id }, { $inc: { coin: -money } }, { upsert: true });
    await qdb.set(`cooldowns.bj.${message.author.id}`, Date.now())
  }
}

function endMsg(f, msg, cl, dealerC) {
    let cardsMsg = "";
    player.cards.forEach(function(card) {
      var emAR = ["â™¥","â™¦","â™ ","â™£"]
      var t = emAR[Math.floor(Math.random() * emAR.length)];
        cardsMsg += "[`" +t+ card.rank.toString();
        if (card.suit == "d1") cardsMsg += "â™¥"
        if (card.suit == "d2") cardsMsg += "â™¦"
        if (card.suit == "d3") cardsMsg += "â™ "
        if (card.suit == "d4") cardsMsg += "â™£"
        cardsMsg += "`](https://www.instagram.com/yuusufdmr/) "
    });
    cardsMsg += " > " + player.score.toString()

    var dealerMsg = "";
    if (!dealerC) {
      var emAR = ["â™¥","â™¦","â™ ","â™£"]
      var t = emAR[Math.floor(Math.random() * emAR.length)];
        dealerMsg = "[`" +t+ dealer.cards[0].rank.toString();
        if (dealer.cards[0].suit == "d1") dealerMsg += "â™¥"
        if (dealer.cards[0].suit == "d2") dealerMsg += "â™¦"
        if (dealer.cards[0].suit == "d3") dealerMsg += "â™ "
        if (dealer.cards[0].suit == "d4") dealerMsg += "â™£"
        dealerMsg += " ? ?`](https://www.instagram.com/yuusufdmr/)"
    } else {
        dealerMsg = "";
        dealer.cards.forEach(function(card) {
          var emAR = ["â™¥","â™¦","â™ ","â™£"]
          var t = emAR[Math.floor(Math.random() * emAR.length)];
            dealerMsg += "[`" +t+ card.rank.toString();
            if (card.suit == "d1") dealerMsg += "â™¥"
            if (card.suit == "d2") dealerMsg += "â™¦"
            if (card.suit == "d3") dealerMsg += "â™ "
            if (card.suit == "d4") dealerMsg += "â™£"
            dealerMsg += "`](https://www.instagram.com/yuusufdmr/) "
        });
        dealerMsg += " > " + dealer.score.toString()
    }

    const gambleEmbed = new Discord.MessageEmbed()
        .setColor(cl)
        .setAuthor(`${message.author.username} bahise ${money} koydu`, message.author.avatarURL({display: true, size: 2048}))
        .addField('Sen', cardsMsg, true)
        .addField('Banka', dealerMsg, true)
        .addField(f, msg)

    message.channel.send(gambleEmbed);
}

async function endGame() {
    if (player.score === 21) {
        bet('win');
        gameOver = true;
        await endMsg(`🎲 ~ Sen kazandın!`,`Bankanın eli: ${dealer.score.toString()}`, `#32FF00`)
    }
    if (player.score > 21) {
        bet('lose');
        gameOver = true;
        await endMsg(`🎲 ~ Kaybettin 21'i geçtin!`,`Bankanın eli: ${dealer.score.toString()}`, `#B20000`)
    }
    if (dealer.score === 21) {
        bet('lose');
        gameOver = true;
        await endMsg(`🎲 ~ Kaybettin bankanın eli 21!`,`Bankanın eli: ${dealer.score.toString()}`, `#B20000`)
    }
    if (dealer.score > 21) {
        bet('win');
        gameOver = true;
        await endMsg(`🎲 ~ Kazandın banka 21'i geçti!`,`Bankanın eli: ${dealer.score.toString()}`, `#32FF00`)
    }
    if (dealer.score >= 17 && player.score > dealer.score && player.score < 21) {
        bet('win');
        gameOver = true;
        await endMsg(`🎲 ~ Kazandın, bankayı alt ettin!`,`Bankanın eli: ${dealer.score.toString()}`, `#32FF00`)
    }
    if (dealer.score >= 17 && player.score < dealer.score && dealer.score < 21) {
        bet('lose');
        gameOver = true;
        await endMsg(`🎲 ~ Kaybettin banka kazandı!`,`Bankanın eli: ${dealer.score.toString()}`, `#B20000`)
    }
    if (dealer.score >= 17 && player.score === dealer.score && dealer.score < 21) {
        gameOver = true;
        await endMsg(`🎲 ~ Berabere!`,`Bankanın eli: ${dealer.score.toString()}`, `#B20000`)
    }
}

function dealerDraw() {

    dealer.cards.push(deck.deckArray[numCardsPulled]);
    dealer.score = getCardsValue(dealer.cards);
    numCardsPulled += 1;
}

function newGame() {
    hit();
    hit();
    dealerDraw();
    endGame();
}

function hit() {
    player.cards.push(deck.deckArray[numCardsPulled]);
    player.score = getCardsValue(player.cards);

    numCardsPulled += 1;
    if (numCardsPulled > 2) {
        endGame();
    }
}

function stand() {
    while (dealer.score < 17) {
        dealerDraw();
    }
    endGame();
}
// END Javascript blackjack game from echohatch1. Modified for Grape. **

newGame();
async function loop() {
    if (gameOver) return;

    endMsg('Elini arttırmak için **hit**, yerinde kalmak için **stand** yaz!',`İyi Şanslar!`, `#504f4e`)

    let filter = m => m.author.id === message.author.id;
    message.channel.awaitMessages(filter, {
        max: 1,
        time: 1200000,
        errors: ['time']
    }).then(message => {
        message = message.first()
        if (message.content === "h" || message.content === "hit") {
            hit();
            loop();
            return
        } else if (message.content === "s" || message.content === "stand") {
            stand();
            loop();
            return
        } else {
            bet("lose");
            return
        }
    }).catch(_ => {
        message.channel.send("Hepsini kaybettin nub xdxd");
        bet("lose");
        return
    })
}

await loop()

};
module.exports.configuration = {
    name: "blackjack",
    aliases: ["bj"],
    usage: "blackjack",
    description: "Belirtilen üyenin avatarını gösterir."
};
 