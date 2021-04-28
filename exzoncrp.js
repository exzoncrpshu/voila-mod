const { Client, Discord, MessageEmbed, Collection, WebhookClient, GuildMember, Guild, TextChannel, Message, MessageAttachment } = require('discord.js');
const client = global.client = new Client({fetchAllMembers: true});
const qdb = require('quick.db');
const db = new qdb.table("ayarlar");
const mongoose = require('mongoose');
const conf = require("./exzsettings/ayarlar.json");
mongoose.connect(conf.mongoURL, {useNewUrlParser: true, useUnifiedTopology: true,  useFindAndModify: false});
const moment = require('moment');
require('moment-duration-format');
const { botOwner, guildID, inviteChannelID } = require('./exzsettings/invitesettings.json');
const guildInvites = new Map();
require('moment-timezone');
moment.locale('tr');
const coin = require('./Models/coin.js')
const exz = require('./Models/exzowoncy.js')
require('./exzsettings/inlinereply.js')
const MemberStats = require('./Models/MemberStats.js');
const fs = require("fs");
const sunucuAyar = global.sunucuAyar = require("./exzsettings/sunucuAyar.js");
const fetch = require('node-fetch');
const logs = require('discord-logs');
logs(client);
const webhooks = {};
const Levels = require("discord-xp");
Levels.setURL(conf.mongoURL);
const ms = require("ms")
global.conf = conf; // guildMemberAdd, userUpdate gibi etkinliklerde işimiz kolaylaşsın.


client.ranks = [
  { role: "836181262493286455", coin: 1690 }, // titan
  { role: "836180707184476191", coin: 2890 }, // nereus 
  { role: "836180529329995776", coin: 4890 }, // reaper 
  { role: "836180688267903047", coin: 6790 }, // solder 
  { role: "836284377528926208", coin: 9390 }, // knight 
  { role: "836284550362824725", coin: 11790 }, // leapor 
  { role: "836284706482946078", coin: 13890 }, // metrus 
  { role: "836180043029151754", coin: 15490 }, // philospoho 
  { role: "836285297012113418", coin: 18890 }, // studioso
  { role: "836285305451577384", coin: 22890 }, // ifestus
  { role: "836285311180865546", coin: 27890 }, // detroit 
  { role: "836285337818234890", coin: 30890 } // athena 
  ]

const commands = new Map();
global.commands = commands;
const aliases = new Map();
global.aliases = aliases;
global.client = client;
fs.readdir("./Commands", (err, files) => {
    if(err) return console.error(err);
    files = files.filter(file => file.endsWith(".js"));
    console.log(`${files.length} komut yüklenecek.`);
    files.forEach(file => {
        let prop = require(`./Commands/${file}`);
        if(!prop.configuration) return;
        console.log(`${prop.configuration.name} komutu yükleniyor!`);
        if(typeof prop.onLoad === "function") prop.onLoad(client);
        commands.set(prop.configuration.name, prop);
        if(prop.configuration.aliases) prop.configuration.aliases.forEach(aliase => aliases.set(aliase, prop));
    });
});

fs.readdir("./Events", (err, files) => {
    if(err) return console.error(err);
    files.filter(file => file.endsWith(".js")).forEach(file => {
        let prop = require(`./Events/${file}`);
        if(!prop.configuration) return;
        client.on(prop.configuration.name, prop);
    });
});

client.emoji = function(x) {
  return client.emojis.cache.get(client.emojiler[x]);
};
const emoji = global.emoji;

const sayiEmojiler = {
  0: "728170898904973353",
  1: "728170917024235561",
  2: "728170941254860801",
  3: "728170959311208469",
  4: "728170977791311942",
  5: "728171127427563530",
  6: "728171144766816326",
  7: "728171149397327893",
  8: "728171179109515345",
  9: "728171187712163931"
};

client.emojiSayi = function(sayi) {
  var yeniMetin = "";
  var arr = Array.from(sayi);
  for (var x = 0; x < arr.length; x++) {
    yeniMetin += (sayiEmojiler[arr[x]] === "" ? arr[x] : sayiEmojiler[arr[x]]);
  }
  return yeniMetin;
};

client.emojiler = {
  onay: "747355909948440578",
  iptal: "747355910975782994",
  cevrimici: "756691181001244823",
  rahatsizetmeyin: "756691108624597095",
  bosta: "756691160969248821",
  gorunmez: "756691139603595297",
  erkekEmoji: "747355948623986708",
  kizEmoji: "740922172427599935",
  gif1: "784350165146140672",
  gif2: "747355963635400744",
  gif3: "796779319786864712",
  gif4: "791903924318896168",
  booster: "781423725232783380",
  st: "836271007864979557",
  dolubar: "836270568637857792",
  bosbar: "836270856371306498",
  dolubas: "836270471640776754",
  bosson: "836270884636852324",
  doluson: "836271188388872193",
  exzowoncy: "836271300535123999",
  tail: "837048527774285834",
  coinflip: "837048575724093450",
  head: "837048601292177430",
  down: "832568432742498326",
  up: "832568367423553546"
};

global.emoji = client.emoji = function(x) {
  return client.emojis.cache.get(client.emojiler[x]);
};

client.sayilariCevir = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};


const waitLimit = {};
client.on("message", (message) => {
  if (message.content.toLowerCase().startsWith('!link') || message.content.toLowerCase().startsWith('.link')) {
    if (beklemeSuresi.has(message.author.id+2)) return;
    message.channel.send(`${sunucuAyar.invitelink} ${message.author}`);
    beklemeSuresi.add(message.author.id+2);
    setTimeout(() => { beklemeSuresi.delete(message.author.id+2); }, 15000);
    return;
  }
  if (message.content.toLowerCase().startsWith('!tag') || message.content.toLowerCase().startsWith('.tag')) {
    if (beklemeSuresi.has(message.author.id+2)) return;
    message.channel.send(sunucuAyar.symbol);
    beklemeSuresi.add(message.author.id+2);
    setTimeout(() => { beklemeSuresi.delete(message.author.id+2); }, 15000);
    return;
  }

      let prefix = conf.prefix.find((x) => message.content.toLowerCase().startsWith(x));
      if (message.author.bot ||!message.content.startsWith(prefix) || !message.channel || message.channel.type == "dm") return;
      if (waitLimit[message.author.id] && (Date.now() - waitLimit[message.author.id]) / (1000) <= conf.waitLimit) return;
      let args = message.content.substring(prefix.length).trim().split(" ");
      let command = args[0].toLowerCase();
      let bot = message.client;
      args = args.splice(1);
      let ayar = db.get("ayar") || {};
      let emoji = global.emoji;
      let calistirici;
      if (commands.has(command)) {
        calistirici = commands.get(command);
        if (message.member.roles.cache.has(ayar.jailRolu) || (ayar.teyitsizRolleri && ayar.teyitsizRolleri.some(rol => message.member.roles.cache.has(rol)))) return;
        calistirici.execute(bot, message, args, ayar, emoji);
      } else if (aliases.has(command)) {
        calistirici = aliases.get(command);
        if (message.member.roles.cache.has(ayar.jailRolu) || (ayar.teyitsizRolleri && ayar.teyitsizRolleri.some(rol => message.member.roles.cache.has(rol)))) return;
        calistirici.execute(bot, message, args, ayar, emoji);
      }
      waitLimit[message.member.id] = Date.now();
});


client.on("message", (message) => {

  var dm = client.users.cache.get("518104479317360663")
  if(message.channel.type === "dm") {
  if(message.author.id === client.user.id) return;
  const botdm = new MessageEmbed().setAuthor(`${message.author.tag} (${message.author.id})`, message.author.avatarURL()).setThumbnail(message.author.avatarURL()).setColor('2F3136').setDescription(`${message.author} tarafından bir mesaj gönderildi.\n\n\`•\` Mesaj İçeriği: ${message.content}`)
   dm.send(botdm)
  
  }
  if(message.channel.bot) return;
  
})



client.renk = {
  //"renksiz": "2F3136", // 0x36393E
 // "mor": "#3c0149",
  "mavi": "#10033d",
  "turkuaz": "#00ffcb",
  "kirmizi": "#750b0c",
  "bosbordaga": "#3F0000"
};

client.randomColor = function () {
  return client.renk[Object.keys(client.renk).random()];
};

let kufurler = ["allahoc","allahoç","allahamk","allahaq","0r0spuc0cu","4n4n1 sk3r1m","p1c","@n@nı skrm","evladi","orsb","orsbcogu","amnskm","anaskm","oc","abaza","abazan","ag","a\u011fz\u0131na s\u0131\u00e7ay\u0131m","fuck","shit","ahmak","seks","sex","allahs\u0131z","amar\u0131m","ambiti","am biti","amc\u0131\u011f\u0131","amc\u0131\u011f\u0131n","amc\u0131\u011f\u0131n\u0131","amc\u0131\u011f\u0131n\u0131z\u0131","amc\u0131k","amc\u0131k ho\u015faf\u0131","amc\u0131klama","amc\u0131kland\u0131","amcik","amck","amckl","amcklama","amcklaryla","amckta","amcktan","amcuk","am\u0131k","am\u0131na","amına","am\u0131nako","am\u0131na koy","am\u0131na koyar\u0131m","am\u0131na koyay\u0131m","am\u0131nakoyim","am\u0131na koyyim","am\u0131na s","am\u0131na sikem","am\u0131na sokam","am\u0131n feryad\u0131","am\u0131n\u0131","am\u0131n\u0131 s","am\u0131n oglu","am\u0131no\u011flu","am\u0131n o\u011flu","am\u0131s\u0131na","am\u0131s\u0131n\u0131","amina","amina g","amina k","aminako","aminakoyarim","amina koyarim","amina koyay\u0131m","amina koyayim","aminakoyim","aminda","amindan","amindayken","amini","aminiyarraaniskiim","aminoglu","amin oglu","amiyum","amk","amkafa","amk \u00e7ocu\u011fu","amlarnzn","aml\u0131","amm","ammak","ammna","amn","amna","amnda","amndaki","amngtn","amnn","amona","amq","ams\u0131z","amsiz","amsz","amteri","amugaa","amu\u011fa","amuna","ana","anaaann","anal","analarn","anam","anamla","anan","anana","anandan","anan\u0131","anan\u0131","anan\u0131n","anan\u0131n am","anan\u0131n am\u0131","anan\u0131n d\u00f6l\u00fc","anan\u0131nki","anan\u0131sikerim","anan\u0131 sikerim","anan\u0131sikeyim","anan\u0131 sikeyim","anan\u0131z\u0131n","anan\u0131z\u0131n am","anani","ananin","ananisikerim","anani sikerim","ananisikeyim","anani sikeyim","anann","ananz","anas","anas\u0131n\u0131","anas\u0131n\u0131n am","anas\u0131 orospu","anasi","anasinin","anay","anayin","angut","anneni","annenin","annesiz","anuna","aq","a.q","a.q.","aq.","ass","atkafas\u0131","atm\u0131k","att\u0131rd\u0131\u011f\u0131m","attrrm","auzlu","avrat","ayklarmalrmsikerim","azd\u0131m","azd\u0131r","azd\u0131r\u0131c\u0131","babaannesi ka\u015far","baban\u0131","baban\u0131n","babani","babas\u0131 pezevenk","baca\u011f\u0131na s\u0131\u00e7ay\u0131m","bac\u0131na","bac\u0131n\u0131","bac\u0131n\u0131n","bacini","bacn","bacndan","bacy","bastard","b\u0131z\u0131r","bitch","biting","boner","bosalmak","bo\u015falmak","cenabet","cibiliyetsiz","cibilliyetini","cibilliyetsiz","cif","cikar","cim","\u00e7\u00fck","dalaks\u0131z","dallama","daltassak","dalyarak","dalyarrak","dangalak","dassagi","diktim","dildo","dingil","dingilini","dinsiz","dkerim","domal","domalan","domald\u0131","domald\u0131n","domal\u0131k","domal\u0131yor","domalmak","domalm\u0131\u015f","domals\u0131n","domalt","domaltarak","domalt\u0131p","domalt\u0131r","domalt\u0131r\u0131m","domaltip","domaltmak","d\u00f6l\u00fc","d\u00f6nek","d\u00fcd\u00fck","eben","ebeni","ebenin","ebeninki","ebleh","ecdad\u0131n\u0131","ecdadini","embesil","emi","fahise","fahi\u015fe","feri\u015ftah","ferre","fuck","fucker","fuckin","fucking","gavad","gavat","giberim","giberler","gibis","gibi\u015f","gibmek","gibtiler","goddamn","godo\u015f","godumun","gotelek","gotlalesi","gotlu","gotten","gotundeki","gotunden","gotune","gotunu","gotveren","goyiim","goyum","goyuyim","goyyim","g\u00f6t","g\u00f6t deli\u011fi","g\u00f6telek","g\u00f6t herif","g\u00f6tlalesi","g\u00f6tlek","g\u00f6to\u011flan\u0131","g\u00f6t o\u011flan\u0131","g\u00f6to\u015f","g\u00f6tten","g\u00f6t\u00fc","g\u00f6t\u00fcn","g\u00f6t\u00fcne","g\u00f6t\u00fcnekoyim","g\u00f6t\u00fcne koyim","g\u00f6t\u00fcn\u00fc","g\u00f6tveren","g\u00f6t veren","g\u00f6t verir","gtelek","gtn","gtnde","gtnden","gtne","gtten","gtveren","hasiktir","hassikome","hassiktir","has siktir","hassittir","haysiyetsiz","hayvan herif","ho\u015faf\u0131","h\u00f6d\u00fck","hsktr","huur","\u0131bnel\u0131k","ibina","ibine","ibinenin","ibne","ibnedir","ibneleri","ibnelik","ibnelri","ibneni","ibnenin","ibnerator","ibnesi","idiot","idiyot","imansz","ipne","iserim","i\u015ferim","ito\u011flu it","kafam girsin","kafas\u0131z","kafasiz","kahpe","kahpenin","kahpenin feryad\u0131","kaka","kaltak","kanc\u0131k","kancik","kappe","karhane","ka\u015far","kavat","kavatn","kaypak","kayyum","kerane","kerhane","kerhanelerde","kevase","keva\u015fe","kevvase","koca g\u00f6t","kodu\u011fmun","kodu\u011fmunun","kodumun","kodumunun","koduumun","koyarm","koyay\u0131m","koyiim","koyiiym","koyim","koyum","koyyim","krar","kukudaym","laciye boyad\u0131m","libo\u015f","madafaka","malafat","malak","mcik","meme","memelerini","mezveleli","minaamc\u0131k","mincikliyim","mna","monakkoluyum","motherfucker","mudik","oc","ocuu","ocuun","O\u00c7","o\u00e7","o. \u00e7ocu\u011fu","o\u011flan","o\u011flanc\u0131","o\u011flu it","orosbucocuu","orospu","orospucocugu","orospu cocugu","orospu \u00e7oc","orospu\u00e7ocu\u011fu","orospu \u00e7ocu\u011fu","orospu \u00e7ocu\u011fudur","orospu \u00e7ocuklar\u0131","orospudur","orospular","orospunun","orospunun evlad\u0131","orospuydu","orospuyuz","orostoban","orostopol","orrospu","oruspu","oruspu\u00e7ocu\u011fu","oruspu \u00e7ocu\u011fu","osbir","ossurduum","ossurmak","ossuruk","osur","osurduu","osuruk","osururum","otuzbir","\u00f6k\u00fcz","\u00f6\u015fex","patlak zar","penis","pezevek","pezeven","pezeveng","pezevengi","pezevengin evlad\u0131","pezevenk","pezo","pic","pici","picler","pi\u00e7","pi\u00e7in o\u011flu","pi\u00e7 kurusu","pi\u00e7ler","pipi","pipi\u015f","pisliktir","porno","pussy","pu\u015ft","pu\u015fttur","rahminde","revizyonist","s1kerim","s1kerm","s1krm","sakso","saksofon","saxo","sekis","serefsiz","sevgi koyar\u0131m","sevi\u015felim","sexs","s\u0131\u00e7ar\u0131m","s\u0131\u00e7t\u0131\u011f\u0131m","s\u0131ecem","sicarsin","sie","sik","sikdi","sikdi\u011fim","sike","sikecem","sikem","siken","sikenin","siker","sikerim","sikerler","sikersin","sikertir","sikertmek","sikesen","sikesicenin","sikey","sikeydim","sikeyim","sikeym","siki","sikicem","sikici","sikien","sikienler","sikiiim","sikiiimmm","sikiim","sikiir","sikiirken","sikik","sikil","sikildiini","sikilesice","sikilmi","sikilmie","sikilmis","sikilmi\u015f","sikilsin","sikim","sikimde","sikimden","sikime","sikimi","sikimiin","sikimin","sikimle","sikimsonik","sikimtrak","sikin","sikinde","sikinden","sikine","sikini","sikip","sikis","sikisek","sikisen","sikish","sikismis","siki\u015f","siki\u015fen","siki\u015fme","sikitiin","sikiyim","sikiym","sikiyorum","sikkim","sikko","sikleri","sikleriii","sikli","sikm","sikmek","sikmem","sikmiler","sikmisligim","siksem","sikseydin","sikseyidin","siksin","siksinbaya","siksinler","siksiz","siksok","siksz","sikt","sikti","siktigimin","siktigiminin","sikti\u011fim","sikti\u011fimin","sikti\u011fiminin","siktii","siktiim","siktiimin","siktiiminin","siktiler","siktim","siktim","siktimin","siktiminin","siktir","siktir et","siktirgit","siktir git","siktirir","siktiririm","siktiriyor","siktir lan","siktirolgit","siktir ol git","sittimin","sittir","skcem","skecem","skem","sker","skerim","skerm","skeyim","skiim","skik","skim","skime","skmek","sksin","sksn","sksz","sktiimin","sktrr","skyim","slaleni","sokam","sokar\u0131m","sokarim","sokarm","sokarmkoduumun","sokay\u0131m","sokaym","sokiim","soktu\u011fumunun","sokuk","sokum","soku\u015f","sokuyum","soxum","sulaleni","s\u00fclaleni","s\u00fclalenizi","s\u00fcrt\u00fck","\u015ferefsiz","\u015f\u0131ll\u0131k","taaklarn","taaklarna","tarrakimin","tasak","tassak","ta\u015fak","ta\u015f\u015fak","tipini s.k","tipinizi s.keyim","tiyniyat","toplarm","topsun","toto\u015f","vajina","vajinan\u0131","veled","veledizina","veled i zina","verdiimin","weled","weledizina","whore","xikeyim","yaaraaa","yalama","yalar\u0131m","yalarun","yaraaam","yarak","yaraks\u0131z","yaraktr","yaram","yaraminbasi","yaramn","yararmorospunun","yarra","yarraaaa","yarraak","yarraam","yarraam\u0131","yarragi","yarragimi","yarragina","yarragindan","yarragm","yarra\u011f","yarra\u011f\u0131m","yarra\u011f\u0131m\u0131","yarraimin","yarrak","yarram","yarramin","yarraminba\u015f\u0131","yarramn","yarran","yarrana","yarrrak","yavak","yav\u015f","yav\u015fak","yav\u015fakt\u0131r","yavu\u015fak","y\u0131l\u0131\u015f\u0131k","yilisik","yogurtlayam","yo\u011furtlayam","yrrak","z\u0131kk\u0131m\u0131m","zibidi","zigsin","zikeyim","zikiiim","zikiim","zikik","zikim","ziksiiin","ziksiin","zulliyetini","zviyetini"];
client.chatKoruma = async mesajIcerik => {
  if (!mesajIcerik) return;
    let inv = /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i;  
    if (inv.test(mesajIcerik)) return true;

    let link = /(http[s]?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/gi;  
    if (link.test(mesajIcerik)) return true;

    if ((kufurler).some(word => new RegExp("(\\b)+(" + word + ")+(\\b)", "gui").test(mesajIcerik))) return true;
  return false;
};

client.splitEmbedWithDesc = async function(description, author = false, footer = false, features = false) {
  let embedSize = parseInt(`${description.length/2048}`.split('.')[0])+1
  let embeds = new Array()
  for (var i = 0; i < embedSize; i++) {
    let desc = description.split("").splice(i*2048, (i+1)*2048)
    let x = new MessageEmbed().setDescription(desc.join(""))
    if (i == 0 && author) x.setAuthor(author.name, author.icon ? author.icon : null)
    if (i == embedSize-1 && footer) x.setFooter(footer.name, footer.icon ? footer.icon : null)
    if (i == embedSize-1 && features && features["setTimestamp"]) x.setTimestamp(features["setTimestamp"])
    if (features) {
      let keys = Object.keys(features)
      keys.forEach(key => {
        if (key == "setTimestamp") return
        let value = features[key]
        if (i !== 0 && key == 'setColor') x[key](value[0])
        else if (i == 0) {
          if(value.length == 2) x[key](value[0], value[1])
          else x[key](value[0])
        }
      })
    }
    embeds.push(x)
  }
  return embeds
};

TextChannel.prototype.csend = async function (content, options) {
  if (webhooks[this.id]) return (await webhooks[this.id].send(content, options));
  let webhookss = await this.fetchWebhooks();
  let wh = webhookss.find(e => e.name == client.user.username),
      result;
  if (!wh) {
      wh = await this.createWebhook(client.user.username, {
          avatar: client.user.avatarURL()
      });
      webhooks[this.id] = wh;
      result = await wh.send(content, options);
  } else {
      webhooks[this.id] = wh;
      result = await wh.send(content, options);
  }
  return result;
};


Date.prototype.toTurkishFormatDate = function () {
  return moment.tz(this, "Europe/Istanbul").format('LLL');
};

client.convertDuration = (date) => {
  return moment.duration(date).format('H [saat,] m [dakika]');
};

client.tarihHesapla = (date) => {
  const startedAt = Date.parse(date);
  var msecs = Math.abs(new Date() - startedAt);

  const years = Math.floor(msecs / (1000 * 60 * 60 * 24 * 365));
  msecs -= years * 1000 * 60 * 60 * 24 * 365;
  const months = Math.floor(msecs / (1000 * 60 * 60 * 24 * 30));
  msecs -= months * 1000 * 60 * 60 * 24 * 30;
  const weeks = Math.floor(msecs / (1000 * 60 * 60 * 24 * 7));
  msecs -= weeks * 1000 * 60 * 60 * 24 * 7;
  const days = Math.floor(msecs / (1000 * 60 * 60 * 24));
  msecs -= days * 1000 * 60 * 60 * 24;
  const hours = Math.floor(msecs / (1000 * 60 * 60));
  msecs -= hours * 1000 * 60 * 60;
  const mins = Math.floor((msecs / (1000 * 60)));
  msecs -= mins * 1000 * 60;
  const secs = Math.floor(msecs / 1000);
  msecs -= secs * 1000;

  var string = "";
  if (years > 0) string += `${years} yıl ${months} ay`
  else if (months > 0) string += `${months} ay ${weeks > 0 ? weeks+" hafta" : ""}`
  else if (weeks > 0) string += `${weeks} hafta ${days > 0 ? days+" gün" : ""}`
  else if (days > 0) string += `${days} gün ${hours > 0 ? hours+" saat" : ""}`
  else if (hours > 0) string += `${hours} saat ${mins > 0 ? mins+" dakika" : ""}`
  else if (mins > 0) string += `${mins} dakika ${secs > 0 ? secs+" saniye" : ""}`
  else if (secs > 0) string += `${secs} saniye`
  else string += `saniyeler`;

  string = string.trim();
  return `\`${string} önce\``;
};

client.infoHesapla = (date) => {
  const startedAt = Date.parse(date);
  var msecs = Math.abs(new Date() - startedAt);

  const years = Math.floor(msecs / (1000 * 60 * 60 * 24 * 365));
  msecs -= years * 1000 * 60 * 60 * 24 * 365;
  const months = Math.floor(msecs / (1000 * 60 * 60 * 24 * 30));
  msecs -= months * 1000 * 60 * 60 * 24 * 30;
  const weeks = Math.floor(msecs / (1000 * 60 * 60 * 24 * 7));
  msecs -= weeks * 1000 * 60 * 60 * 24 * 7;
  const days = Math.floor(msecs / (1000 * 60 * 60 * 24));
  msecs -= days * 1000 * 60 * 60 * 24;
  const hours = Math.floor(msecs / (1000 * 60 * 60));
  msecs -= hours * 1000 * 60 * 60;
  const mins = Math.floor((msecs / (1000 * 60)));
  msecs -= mins * 1000 * 60;
  const secs = Math.floor(msecs / 1000);
  msecs -= secs * 1000;

  var string = "";
  if (years > 0) string += `${years} yıl`
  else if (months > 0) string += `${months} ay`
  else if (weeks > 0) string += `${weeks} hafta`
  else if (days > 0) string += `${days} gün`
  else if (hours > 0) string += `${hours} saat}`
  else if (mins > 0) string += `${mins} dakika`
  else if (secs > 0) string += `${secs} saniye`
  else string += `saniyeler`;

  string = string.trim();
  return `\`${string} önce\``;
};

client.wait = async function(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
};

Array.prototype.temizle = function() {
 let yeni = [];
  for (let i of this) {
   if (!yeni.includes(i)) yeni.push(i);
  }
  return yeni;
};





//bot guard

client.on("guildMemberAdd", member => {
  let guvenlik = qdb.fetch(`bottemizle_${member.guild.id}`);
  if (!guvenlik) return;
  if (member.user.bot !== true) {
  } else {
    member.kick(member);
  }
});

const Config = {
  GuildID: "745593326627192832",
  OneWeek: "836249653766914090",
  TwoWeek: "836250237395140608",
  OneMonth: "836250190817656862",
  SixWeek: "836249641694789722",
  TwoMonth: "836250047309676584"
};

var CronJob = require('cron').CronJob;

//const { CronJob } = require("cron");
const CheckRoles = new CronJob("00 00 00 * * 2", async function () {
  let Guild = client.guilds.cache.get(Config.GuildID);
  let Now = Date.now();
  let Time = 1000 * 60 * 60 * 24 * 28;

  let a = Guild.roles.cache.get(Config.OneWeek).members.size
  let b = Guild.roles.cache.get(Config.TwoWeek).members.size
  let c = Guild.roles.cache.get(Config.OneMonth).members.size
  let d = Guild.roles.cache.get(Config.SixWeek).members.size
  let e = Guild.roles.cache.get(Config.TwoMonth).members.size

  Guild.members.cache.filter((member) => (Now - member.joinedTimestamp) >= Time).forEach((member) => member.roles.add(Config.OneWeek));
    Guild.members.cache.filter((member) => (Now - member.joinedTimestamp) >= Time * 2).forEach((member) => member.roles.add(Config.TwoWeek));
    Guild.members.cache.filter((member) => (Now - member.joinedTimestamp) >= Time * 3).forEach((member) => member.roles.add(Config.OneMonth));
    Guild.members.cache.filter((member) => (Now - member.joinedTimestamp) >= Time * 6).forEach((member) => member.roles.add(Config.SixWeek));
    Guild.members.cache.filter((member) => (Now - member.joinedTimestamp) >= Time * 12).forEach((member) => member.roles.add(Config.TwoMonth));
  
    client.users.cache.get("518104479317360663").send(new MessageEmbed().setDescription(`Sunucuda ki zaman rollerinin dağıtımı bitti. (\`${moment(Now).format('DD MMMM YYYY HH:mm')}\`)`).addField('Rol Üye Sayıları', `+1 Month Old (\`${a}\`) +3 Months Old (\`${b}\`) +6 Months Old: (\`${c}\`) +9 Months Old: (\`${d}\`) +1 Year Old: (\`${e}\`)`).setFooter(`${Guild.memberCount} üyeden ${a} kişiye roller dağıtıldı.`).setAuthor(Guild.name, Guild.iconURL()).setColor(client.randomColor()))

}, null, true, "Europe/Istanbul");
CheckRoles.start();



  // şş ey stats 

var resetStats = new CronJob('00 00 00 * * 1', async function() { // 1 = Pazartesi // 1 = Monday
  let guild = client.guilds.cache.get(sunucuAyar.guildID);
  let newData = new Map();
  await MemberStats.updateMany({ guildID: guild.id }, { voiceStats: newData, chatStats: newData });
  let stats = await MemberStats.find({ guildID: guild.id });
  stats.filter(s => !guild.members.cache.has(s.userID)).forEach(s => MemberStats.findByIdAndDelete(s._id));
  console.log('Haftalık istatistikler sıfırlandı!');
  client.users.cache.get("518104479317360663").send('Haftalık chat-ses istatistikleri sıfırlandı!')
}, null, true, 'Europe/Istanbul');
resetStats.start();

let beklemeSuresi = new Set();



client.on("ready", async () => {
  client.guilds.cache.forEach(guild => {
    guild.fetchInvites().then(invites => guildInvites.set(guild.id, invites)).catch(err => console.log(err));
  });
});

client.on("inviteCreate", async invite => guildInvites.set(invite.guild.id, await invite.guild.fetchInvites()));
client.on("inviteDelete", invite => setTimeout(async () => { guildInvites.set(invite.guild.id, await invite.guild.fetchInvites()); }, 5000));
const Database = require('./models/inviter.js');
client.on("guildMemberAdd", async member => {

  let teyitKanali = db.get(`ayar.teyitKanali`)
  let ayar = db.get('ayar') || {};
  let cachedInvites = guildInvites.get(member.guild.id);
  let newInvites = await member.guild.fetchInvites();
  let usedInvite = newInvites.find(inv => cachedInvites.get(inv.code).uses < inv.uses) || cachedInvites.find(inv => !newInvites.has(inv.code)) || {code: member.guild.vanityURLCode, uses: null, inviter: {id: null}};
  let inviter = client.users.cache.get(usedInvite.inviter.id) || {id: member.guild.id};
  let isMemberFake = (Date.now() - member.user.createdTimestamp) < 15*24*60*60*1000;
  let inviteChannel = client.channels.cache.get(inviteChannelID);
  Database.findOne({ guildID: member.guild.id, userID: member.id }, (err, joinedMember) => {
    if (!joinedMember) {
      let newJoinedMember = new Database({
          _id: new mongoose.Types.ObjectId(),
          guildID: member.guild.id,
          userID: member.id,
          inviterID: inviter.id,
          regular: 0,
          bonus: 0,
          fake: 0
      });
      newJoinedMember.save();
    } else {
      joinedMember.inviterID = inviter.id;
      joinedMember.save();
    };
  });
  if (isMemberFake) {
    Database.findOne({ guildID: member.guild.id, userID: inviter.id }, (err, inviterData) => {
      if (!inviterData) {
        let newInviter = new Database({
          _id: new mongoose.Types.ObjectId(),
          guildID: member.guild.id,
          userID: inviter.id,
          inviterID: null,
          regular: 0,
          bonus: 0,
          fake: 1
        });
        newInviter.save().then(x => {
          if (inviteChannel) inviteChannel.send(`${member} katıldı! **Davet eden**: ${inviter.id == member.guild.id ? member.guild.name : inviter.tag.replace("`", "")} (**${(x.regular ? x.regular : 0)+(x.bonus ? x.bonus : 0)}** davet \`❌\`)`).catch(err => {});
          if(teyitKanali && client.channels.cache.has(teyitKanali)) client.channels.cache.get(teyitKanali).send(`${member.guild.name}'ya hoş geldin, ${member}! Hesabın ${moment(member.user.createdAt).format('DD MMMM YYYY HH:mm')} tarihinde oluşturulmuş. ${isMemberFake ? "🚫" :""}\n\nSunucuya erişebilmek için hesabının 15 günden daha eski olmalıdır. Hesabın ${member.client.tarihHesapla(member.user.createdAt)} açılmış.\n\nSeninle beraber ${member.guild.memberCount} kişiyiz. ${inviter.id == member.guild.id ? ":tada::tada::tada:" : `${inviter} tarafından davet edildi.`}`)
        });
      } else {
        inviterData.fake++
        inviterData.save().then(x => {
          if (inviteChannel) inviteChannel.send(`${member} katıldı! **Davet eden**: ${inviter.id == member.guild.id ? member.guild.name : inviter.tag.replace("`", "")} (**${(x.regular ? x.regular : 0)+(x.bonus ? x.bonus : 0)}** davet \`❌\`)`).catch(err => {});
          if(teyitKanali && client.channels.cache.has(teyitKanali)) client.channels.cache.get(teyitKanali).send(`${member.guild.name}'ya hoş geldin, ${member}! Hesabın ${moment(member.user.createdAt).format('DD MMMM YYYY HH:mm')} tarihinde oluşturulmuş. ${isMemberFake ? "🚫" :""}\n\nSunucuya erişebilmek için hesabının 15 günden daha eski olmalıdır. Hesabın ${member.client.tarihHesapla(member.user.createdAt)} açılmış.\n\nSeninle beraber ${member.guild.memberCount} kişiyiz. ${inviter.id == member.guild.id ? ":tada::tada::tada:" : `${inviter} tarafından davet edildi.`}`)
        });
      };
    });
  } else {
    await coin.findOneAndUpdate({ guildID: member.guild.id, userID: inviter.id }, { $inc: { coin: 10 } }, { upsert: true });
    Database.findOne({ guildID: member.guild.id, userID: inviter.id }, (err, inviterData) => {
        if (!inviterData) {
          let newInviter = new Database({
            _id: new mongoose.Types.ObjectId(),
            guildID: member.guild.id,
            userID: inviter.id,
            inviterID: null,
            regular: 1,
            bonus: 0,
            fake: 0
          });
          newInviter.save().then(x => {
            if (inviteChannel) inviteChannel.send(`${member} katıldı! **Davet eden**: ${inviter.id == member.guild.id ? member.guild.name : inviter.tag.replace("`", "")} (**${(x.regular ? x.regular : 0)+(x.bonus ? x.bonus : 0)}** davet \`✅\`)`).catch(err => {});
            if(teyitKanali && client.channels.cache.has(teyitKanali)) client.channels.cache.get(teyitKanali).send(`${member.guild.name}'ya hoş geldin, ${member}! Hesabın ${moment(member.user.createdAt).format('DD MMMM YYYY HH:mm')} tarihinde oluşturulmuş. ${isMemberFake ? "🚫" :""}\n\nSunucuya erişebilmek için "V.Confirmed" odalarında kayıt olup isim yaş belirtmen gerekmektedir.\n<#836169952804601896> kanalından sunucu kurallarımızı okumayı ihmal etme! <@&836192530323341372> rolünde ki yetkililer seninle ilgilenecektir.\n\nSeninle beraber ${member.guild.memberCount} kişiyiz. ${inviter.id == member.guild.id ? ":tada::tada::tada:" : `${inviter} tarafından davet edildi ve bu kişinin ${(x.regular ? x.regular : 0)+(x.bonus ? x.bonus : 0)} daveti oldu. :tada::tada::tada:`}`)
          });
        } else {
          inviterData.regular++;
          inviterData.save().then(x => {
            if (inviteChannel) inviteChannel.send(`${member} katıldı! **Davet eden**: ${inviter.id == member.guild.id ? member.guild.name : inviter.tag.replace("`", "")} (**${(x.regular ? x.regular : 0)+(x.bonus ? x.bonus : 0)}** davet \`✅\`)`).catch(err => {});
            if(teyitKanali && client.channels.cache.has(teyitKanali)) client.channels.cache.get(teyitKanali).send(`${member.guild.name}'ya hoş geldin, ${member}! Hesabın ${moment(member.user.createdAt).format('DD MMMM YYYY HH:mm')} tarihinde oluşturulmuş. ${isMemberFake ? "🚫" :""}\n\nSunucuya erişebilmek için "V.Confirmed" odalarında kayıt olup isim yaş belirtmen gerekmektedir.\n<#836169952804601896> kanalından sunucu kurallarımızı okumayı ihmal etme! <@&836192530323341372> rolünde ki yetkililer seninle ilgilenecektir.\n\nSeninle beraber ${member.guild.memberCount} kişiyiz. ${inviter.id == member.guild.id ? ":tada::tada::tada:" : `${inviter} tarafından davet edildi ve bu kişinin ${(x.regular ? x.regular : 0)+(x.bonus ? x.bonus : 0)} daveti oldu. :tada::tada::tada:`}`)
          });
        };
      });
  };
  guildInvites.set(member.guild.id, newInvites);
});

client.on("guildMemberRemove", async member => {
 
  let isMemberFake = (Date.now() - member.user.createdTimestamp) < 7*24*60*60*1000;
  let inviteChannel = client.channels.cache.get(inviteChannelID);
  Database.findOne({ guildID: member.guild.id, userID: member.id }, async (err, memberData) => {
    if (memberData && memberData.inviterID) {
      let inviter = client.users.cache.get(memberData.inviterID) || {id: member.guild.id};
      await coin.findOneAndUpdate({ guildID: member.guild.id, userID: inviter.id }, { $inc: { coin: -10 } }, { upsert: true });
        Database.findOne({ guildID: member.guild.id, userID: memberData.inviterID }, async (err, inviterData) => {
        if (!inviterData) {
         let newInviter = new Database({
            _id: new mongoose.Types.ObjectId(),
            guildID: member.guild.id,
            userID: inviter.id,
            inviterID: null,
            regular: 0,
            bonus: 0,
            fake: 0
          });
          newInviter.save();
        } else {
          if (isMemberFake) {
            if (inviterData.fake-1 >= 0) inviterData.fake--;
          } else {
            if (inviterData.regular-1 >= 0) inviterData.regular--;
          };
          inviterData.save().then(x => {
            if (inviteChannel) inviteChannel.send(`\`${member.user.tag}\` ayrıldı! ${inviter.tag ? `**Davet eden**: ${inviter.id == member.guild.id ? member.guild.name : inviter.tag.replace("`", "")} (**${(x.regular ? x.regular : 0)+(x.bonus ? x.bonus : 0)}** davet)` : `Davetçi bulunamadı!`}`).catch(err => {});
          });
        };
      });
    } else {
      if (inviteChannel) inviteChannel.send(`\`${member.user.tag}\` ayrıldı! Davetçi bulunamadı!`).catch(err => {});
    };
  });
});

client.on("message", async message => {
  let prefixies = conf.prefix.find((x) => message.content.toLowerCase().startsWith(x));
  if (message.author.bot || !message.guild || !message.content.toLowerCase().startsWith(prefixies)) return;
  let args = message.content.split(' ').slice(1);
  let prefix = conf.prefix.find((x) => message.content.toLowerCase().startsWith(x));
  let command = message.content.split(' ')[0].slice(prefixies.length);



  if (command === "davet" || command === "info" || command === "invites") {
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    let embed = new MessageEmbed().setAuthor(uye.displayName, uye.user.displayAvatarURL({dynamic: true})).setColor(uye.displayHexColor).setFooter(`${message.guild.name} Invite Manager`).setTimestamp();
    Database.findOne({guildID: message.guild.id, userID: uye.id}, (err, inviterData) => {
      if (!inviterData) {
        embed.setDescription(`Davet bilgileri bulunmamaktadır!`);
        message.channel.send(embed);
      } else {
        Database.find({guildID: message.guild.id, inviterID: uye.id}).sort().exec((err, inviterMembers) => {
          let dailyInvites = 0;
          let weeklyInvites = 0;
          if (inviterMembers.length) {
            dailyInvites = inviterMembers.filter(x => message.guild.members.cache.has(x.userID) && (Date.now() - message.guild.members.cache.get(x.userID).joinedTimestamp) < 1000*60*60*24).length;
            weeklyInvites = inviterMembers.filter(x => message.guild.members.cache.has(x.userID) && (Date.now() - message.guild.members.cache.get(x.userID).joinedTimestamp) < 1000*60*60*24*7).length;
          };

      /*    if(inviterData.regular+inviterData.bonus >= 5) { uye.roles.add(davetconf.davet5) }
          if(inviterData.regular+inviterData.bonus >= 10) { uye.roles.add(davetconf.davet10) }
          if(inviterData.regular+inviterData.bonus >= 15) { uye.roles.add(davetconf.davet15) }
          if(inviterData.regular+inviterData.bonus >= 20) { uye.roles.add(davetconf.davet20) }
          if(inviterData.regular+inviterData.bonus >= 25) { uye.roles.add(davetconf.davet25) }
          if(inviterData.regular+inviterData.bonus >= 30) { uye.roles.add(davetconf.davet30) }
          if(inviterData.regular+inviterData.bonus >= 35) { uye.roles.add(davetconf.davet35) }
          if(inviterData.regular+inviterData.bonus >= 40) { uye.roles.add(davetconf.davet40) }
          if(inviterData.regular+inviterData.bonus >= 45) { uye.roles.add(davetconf.davet45) }
          if(inviterData.regular+inviterData.bonus >= 50) { uye.roles.add(davetconf.davet50) }*/

          embed.setDescription(`Toplam **${inviterData.regular+inviterData.bonus}** davete sahip! (**${inviterData.regular}** gerçek, **${inviterData.bonus}** bonus, **${inviterData.fake}** fake, **${dailyInvites}** günlük, **${weeklyInvites}** haftalık)`);
          message.channel.send(embed);
        });
      };
    });
  };

  if (command === "bonus") {
    if (!message.member.hasPermission("ADMINISTRATOR")) return;
    let uye = message.mentions.members.first () || message.guild.members.cache.get(args[0]);
    let sayi = args[1];
    if (!uye || !sayi) return message.reply(`Geçerli bir üye ve sayı belirtmelisin! (${conf.prefix}bonus @üye +10/-10)`);
    Database.findOne({guildID: message.guild.id, userID: uye.id}, (err, inviterData) => {
      if (!inviterData) {
        let newInviter = new Database({
          _id: new mongoose.Types.ObjectId(),
          guildID: message.guild.id,
          userID: uye.id,
          inviterID: null,
          regular: 0,
          bonus: sayi,
          fake: 0
        });
        newInviter.save().then(x => message.reply(`Belirtilen üyenin bonus daveti **${sayi}** olarak ayarlandı!`));
      } else {
        eval(`inviterData.bonus = inviterData.bonus+${Number(sayi)}`);
        inviterData.save().then(x => message.reply(`Belirtilen üyenin bonus davetine **${sayi}** eklendi!`));
      };
    });
  };

  if (command === "üyeler" || command === "davet-members") {
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    let embed = new MessageEmbed().setColor(uye.displayHexColor).setAuthor(uye.displayName + " Üyeleri", uye.user.displayAvatarURL({dynamic: true})).setFooter(message.member.displayName + " tarafından istendi!", message.author.displayAvatarURL({dynamic: true})).setThumbnail().setFooter(`${message.guild.name} Invite Manager`);
    let currentPage = 1;
    Database.find({guildID: message.guild.id, inviterID: uye.id}).sort([["descending"]]).exec(async (err, pageArray) => {
      pageArray = pageArray.filter(x => message.guild.members.cache.has(x.userID));
      if (err) console.log(err);
      if (!pageArray.length) {
        Database.findOne({guildID: message.guild.id, userID: uye.id}, async (err, uyeData) => {
          if (!uyeData) uyeData = {inviterID: null};
          let inviterUye = client.users.cache.get(uyeData.inviterID) || {id: message.guild.id};
          message.channel.send(embed.setDescription(`${uye} üyesini davet eden: ${inviterUye.id == message.guild.id ? message.guild.name : inviterUye.toString()}\n\nDavet ettiği üye bulunamadı!`));
        });
      } else {
        let pages = pageArray.chunk(10);
        if (!pages.length || !pages[currentPage - 1].length) return message.channel.send("Davet ettiği üye bulunamadı!");
        let msg = await message.channel.send(embed);
        let reactions = ["◀", "❌", "▶"];
        for (let reaction of reactions) await msg.react(reaction);
        Database.findOne({guildID: message.guild.id, userID: uye.id}, async (err, uyeData) => {
          let inviterUye = client.users.cache.get(uyeData.inviterID) || {id: message.guild.id};
          if (msg) await msg.edit(embed.setDescription(`${uye} üyesini davet eden: ${inviterUye.id == message.guild.id ? message.guild.name : inviterUye.toString()}\n\n${pages[currentPage - 1].map((kisi, index) => { let kisiUye = message.guild.members.cache.get(kisi.userID); return `\`${index+1}.\` ${kisiUye.toString()} | ${client.tarihHesapla(kisiUye.joinedAt)}`; }).join('\n')}`).setFooter(`Şu anki sayfa: ${currentPage}`)).catch(err => {});
        });
        const back = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "◀" && user.id == message.author.id,
              { time: 20000 }),
            x = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "❌" && user.id == message.author.id, 
              { time: 20000 }),
            go = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "▶" && user.id == message.author.id,
              { time: 20000 });
          back.on("collect", async reaction => {
            await reaction.users.remove(message.author.id).catch(err => {});
            if (currentPage == 1) return;
            currentPage--;
            if (msg) msg.edit(embed.setDescription(`${pages[currentPage - 1].map((kisi, index) => { let kisiUye = message.guild.members.cache.get(kisi.userID); return `\`${index+1}.\` ${kisiUye.toString()} | ${client.tarihHesapla(kisiUye.joinedAt)}`; }).join('\n')}`).setFooter(`Şu anki sayfa: ${currentPage}`)).catch(err => {});
          });
          go.on("collect", async reaction => {
            await reaction.users.remove(message.author.id).catch(err => {});
            if (currentPage == pages.length) return;
            currentPage++;
            if (msg) msg.edit(embed.setDescription(`${pages[currentPage - 1].map((kisi, index) => { let kisiUye = message.guild.members.cache.get(kisi.userID); return `\`${index+1}.\` ${kisiUye.toString()} | ${client.tarihHesapla(kisiUye.joinedAt)}`; }).join('\n')}`).setFooter(`Şu anki sayfa: ${currentPage}`));
          });
          x.on("collect", async reaction => {
            await back.stop();
            await go.stop();
            await x.stop();
            if (message) message.delete().catch(err => {});
            if (msg) return msg.delete().catch(err => {});
          });
          back.on("end", async () => {
            await back.stop();
            await go.stop();
            await x.stop();
            if (message) message.delete().catch(err => {});
            if (msg) return msg.delete().catch(err => {});
          });
      };
    });
  };

  if (command === "davet-top" || command === "davet-sıralama") {
    let embed = new MessageEmbed().setColor(message.member.displayHexColor).setAuthor("Davet Sıralaması", message.guild.iconURL({dynamic: true})).setFooter(message.member.displayName + " tarafından istendi!", message.author.displayAvatarURL({dynamic: true})).setThumbnail().setFooter(`${client.users.cache.get(botOwner).tag} was here!`);
    let currentPage = 1;
    Database.find({guildID: message.guild.id}).sort().exec(async (err, pageArray) => {
      pageArray = pageArray.filter(x => message.guild.members.cache.has(x.userID)).sort((uye1, uye2) => ((uye2.regular ? uye2.regular : 0)+(uye2.bonus ? uye2.bonus : 0))-((uye1.regular ? uye1.regular : 0)+(uye1.bonus ? uye1.bonus : 0)));
      if (err) console.log(err);
      if (!pageArray.length) {
        message.channel.send(embed.setDescription("Davet verisi bulunamadı!"));
      } else {
        let pages = pageArray.chunk(10);
        if (!pages.length || !pages[currentPage - 1].length) return message.channel.send("Daveti olan üye bulunamadı!");
        let msg = await message.channel.send(embed);
        let reactions = ["◀", "❌", "▶"];
        for (let reaction of reactions) await msg.react(reaction);
        if (msg) await msg.edit(embed.setDescription(`${pages[currentPage - 1].map((kisi, index) => `\`${index+1}.\` ${message.guild.members.cache.get(kisi.userID).toString()} | **${kisi.regular+kisi.bonus}** davet`).join('\n')}`).setFooter(`Şu anki sayfa: ${currentPage}`));
        const back = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "◀" && user.id == message.author.id,
              { time: 20000 }),
            x = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "❌" && user.id == message.author.id, 
              { time: 20000 }),
            go = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "▶" && user.id == message.author.id,
              { time: 20000 });
          back.on("collect", async reaction => {
          await reaction.users.remove(message.author.id).catch(err => {});
          if (currentPage == 1) return;
            currentPage--;
            if (msg) msg.edit(embed.setDescription(`${pages[currentPage - 1].map((kisi, index) => `\`${index+1}.\` ${message.guild.members.cache.get(kisi.userID).toString()} | **${kisi.regular+kisi.bonus}** davet`).join('\n')}`).setFooter(`Şu anki sayfa: ${currentPage}`));
          });
          go.on("collect", async reaction => {
            await reaction.users.remove(message.author.id).catch(err => {});
              if (currentPage == pages.length) return;
              currentPage++;
              if (msg) msg.edit(embed.setDescription(`${pages[currentPage - 1].map((kisi, index) => `\`${index+1}.\` ${message.guild.members.cache.get(kisi.userID).toString()} | **${kisi.regular+kisi.bonus}** davet`).join('\n')}`).setFooter(`Şu anki sayfa: ${currentPage}`));
          });
          x.on("collect", async reaction => {
            await back.stop();
            await go.stop();
            await x.stop();
            if (message) message.delete().catch(err => {});
            if (msg) return msg.delete().catch(err => {});
          });
          back.on("end", async () => {
            await back.stop();
            await go.stop();
            await x.stop();
            if (message) message.delete().catch(err => {});
            if (msg) return msg.delete().catch(err => {});
          });
      };
    });
  };
});

Array.prototype.chunk = function(chunk_size) {
  let myArray = Array.from(this);
  let tempArray = [];
  for (let index = 0; index < myArray.length; index += chunk_size) {
    let chunk = myArray.slice(index, index + chunk_size);
    tempArray.push(chunk);
  }
  return tempArray;
};



client.login(conf.token).then(console.log("Bot başarılı bir şekilde giriş yaptı.")).catch(err => console.error("Bot giriş yapamadı | Hata: " + err));