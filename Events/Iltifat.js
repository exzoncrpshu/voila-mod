const discord = require("discord.js");
const qdb = require("quick.db");
const db = new qdb.table("ayarlar");

let iltifatSayi = 0;
let iltifatlar = [   
  "Biliyor muydun? Antik Yunan'da zengin aile çocukları hayatları boyunca kılsız olmaları için doğdukları anda zeytinyağına batırılırlardı.",
  "Biliyor muydun? Dünyanın en geniş yolu olan Brezilya'daki Anıtsal Eksen'de 160 araba yan yana gidebilir",
  "Biliyor muydun? Hamam böcekleri kafaları kopsa bile birkaç hafta daha yaşayabilirler",
  "Biliyor muydun? Japon balıklarının hatırlama ömürleri yaklaşık 3 saniyedir",
  "Biliyor muydun? Suudi Arabistan'da kadın kocasına kahve yapmazsa boşanma yaşanabilir.",
  "Biliyor muydun? Atlı insan heykellerinde, atın iki ön ayağı da havadaysa kişi savaşta ölmüştür, atın tek ayağı havadaysa kişi savaşta aldığı yaralar yüzünden ölmüştür, atın tüm ayakları yere değiyorsa o kişi doğal sebeplerden ölmüştür.",
  "Biliyor muydun? Her yıl uçak kazalarında ölen insan sayısından daha fazla insan eşekler tarafından öldürülüyor.",
  "Biliyor muydun? Peynir ve bitter çikolata diş çürümesini önlemektedir.",
  "Biliyor muydun? Charles Osborne isimli bir adamın hıçkırığı 69 yıl sürdü.",
  "Biliyor muydun? Dünyanın en sessiz odası -9 desibeldir. Burada bir insan damarlarında akan kanın sesini bile duyabilir.",
  "Biliyor muydun? 18 Şubat 1979 tarihinde Sahra Çölü'ne kar yağmıştır.",
  "Biliyor muydun? Bukalemunların dilleri vücutlarından iki kat daha uzundur.",
  "Biliyor muydun? Doktorların kötü yazıları nedeniyle yılda 7 bin kişi hayatını kaybetmektedir.",
  "Biliyor muydun? Hapşırdığınız zaman, kalbiniz de dahil olmak üzere bütün vücut fonksiyonlarınız bir an için durur. Ayrıca az sayıda da olsa beyin hücrenizi kaybedersiniz.",
  "Biliyor muydun? Bir kişinin ağzında bulunan bakteri sayısı dünya nüfusundan daha fazladır.",
  "Biliyor muydun? Su aygırları üzüldüklerinde terleri kırmızı renk alır.",
  "Biliyor muydun? Mavi rengi görebilen tek kuş türü, baykuştur.",     
"Biliyor muydun? Kaju olarak bildiğimiz çerez aslında kaju meyvesinin sapıdır.",
"Biliyor muydun? Ananas aslında meyve değildir ve tarlada bu şekilde büyür.",
"Biliyor muydun? Su aygırının sütü pembe renklidir.",
"Biliyor muydun? Mavi balinaların kalbi o kadar büyüktür ki bir insan atardamarları içerisinde rahatlıkla yüzebilir.",
"Biliyor muydun? Kuzey Kore ile Finlandiya'yı ayıran tek ülke Rusya'dır.",
"Biliyor muydun? 'Duck Hunt' aslında iki kişilik bir oyundur. İkinci oyuncu ördeği kontrol eder.",
"Biliyor muydun? Plüton keşfedildiği tarihten itibaren bir kez bile güneşin etrafında tam tur dönmemiştir. Bu yüzden artık bir gezegen olarak kabul edilmiyor.",
"Biliyor muydun? Bal güneş görmediği sürece asla bozulmaz.",
"Biliyor muydun? Mario blokları eliyle kırar, kafasıyla değil",
"Biliyor muydun? 19. yüzyıldaki tüm insanlar, şuan 2 dakikada çekilen fotoğraflar kadar fotoğraf çekememişti.",
"Biliyor muydun? Yer fıstığı aslında bir baklagildir ve toprağın altında büyür.",
"Biliyor muydun? Her 5000 bebekten birisi anüsü olmadan (imperforate anus) doğuyor ve hastane ortamında anüs yapılması gerekiyor.",
"Biliyor muydun? Gökyüzündeki yıldız sayısı dünya üzerindeki tüm plajlardaki kum tanesi sayısından fazladır.",
"Biliyor muydun? Bin saniye yaklaşık 16 dakika, bir milyon saniye yaklaşık 11 gün, bir milyar saniye yaklaşık 32 yıl ve bir trilyon saniye yaklaşık 32.000 yıl eder.",
"Biliyor muydun? İnsan DNA'sı %50 oranında muz DNA'sı ile aynıdır.",
"Biliyor muydun? İlk 'Star Wars' Filmi yayınlandığında (25 Mayıs 1977) Fransa'da hala giyotin ile idam yasaldı. Giyotin, kelle vurdurtmaya benzer bişeydir.",
"Biliyor muydun? Rusya, Pluto'dan daha büyük bir yüzölçümüne sahiptir.",
"Biliyor muydun? Ahtapotların üç tane kalbi vardır.",
"Biliyor muydun? Fareler ve atlar kusamaz.",
"Biliyor muydun? Yasalara göre; Belçika'da her ilkokul öğrencisinin mızıka dersi alması zorunludur.",
"Biliyor muydun? Şayet soğan doğrarken sakız çiğnerseniz; evet, ağlamazsınız.",
"Biliyor muydun? İnsanoğlunun vücudundaki en güçlü kas, çene kasıdır.",
"Biliyor muydun? Bir okyanusun en derin yerinde, demir bir topun dibe çökmesi bir saatten uzun sürer.",
"Biliyor muydun? Bugüne kadar ölçülmüş en büyük buz dağı, 200 mil uzunluğunda ve 60 mil genişliğindedir ve Belçika'dan daha büyük bir yüzölçümüne sahiptir.",
"Biliyor muydun? İnsanın gözü tam olarak 576 megapikseldir.",
"Biliyor muydun? Işık saniyede 300.000 km yol alıyor.",
"Biliyor muydun? Su samurları el ele tutuşarak uyuyorlar.",
"Biliyor muydun? Dünyanın en uzun süren trafik sıkışıklığı 12 gün sürdü, 100 km kuyruk oluştu ve araçlar günde 1 kilometre ilerleyebildiler",
"Biliyor muydun? Taklitçi ahtapot isimli ahtapot, sadece renk değiştirmekle kalmıyor, aynı zamanda dil balığı, aslan balığı ve deniz yılanı gibi hayvanların şekline de bürünebiliyor.",
"Biliyor muydun? Kadın Memesi Ellemek Stresi Erkeklerde %70 Azaltıyor.",
  "Gözlerindeki saklı cenneti benden başkası fark etsin istemiyorum.",
  "Yaşanılacak en güzel mevsim sensin.",
  "Sıradanlaşmış her şeyi, ne çok güzelleştiriyorsun.",
  "Gönlüm bir şehir ise o şehrin tüm sokakları sana çıkar.",
  "Birilerinin benim için ettiğinin en büyük kanıtı seninle karşılaşmam.",
  "Denize kıyısı olan şehrin huzuru birikmiş yüzüne.",
  "Ben çoktan şairdim ama senin gibi şiiri ilk defa dinliyorum.",
  "Gece yatağa yattığımda aklımda kalan tek gerçek şey sen oluyorsun.",
  "Ne tatlısın sen öyle. Akşam gel de iki bira içelim.",
  "Bir gamzen var sanki cennette bir çukur.",
  "Gecemi aydınlatan yıldızımsın.",
  "Ponçik burnundan ısırırım seni",
  "Bu dünyanın 8. harikası olma ihtimalin?",
  "fıstık naber?",
  "Sevgi de yetmiyormuş. Çok eskiden rastlaşacaktık.",
"Her kadın saçma sapan bir adam sevmeden olgunlaşmaz. Muhakkak en güzel duygularını, en ruhsuz adamlar öldürür...",
"Verebileceğin en cesurca karar, kalbini ve ruhunu inciten her şeyi bırakmandır.",
"Hava soğudu..Kasımın son günleri kar yağacak, bembeyaz olacak unutmuşluğum.",
"İyi insan ol, fakat bunu istaplamak için vakit harcama.",
"Oysa ben hiç insan kaybetmedim. Sadece zamanı geldiğinde vazgeçmeyi bildim o kadar.",
"Seçilmiş bir yalnızlık, insanın sahip olabileceği en büyük lükstür.",
"İyiyim desem inanacak, o kadar habersiz benden.",
"Senin bana nasip olman, şahsi hayatımın en değer biçilmez talihidir.",
"En güvendiğin insanların, bir yanılgıdan ibaret olduğunu anlayınca, köşene çekilirsin.",
"Ve nelere baskın gelmezdi ki seni düşünmenin tadı",
"Tarifini sorsalar...Her baktığımda, ilk defa görüyormuş  gibi... Az kalsın ölüyormuşum gibi",
"Yüzümü elinle silmene muhtacım diyip önünde küçük düşsem de ben böyleyim",
"Bir anım olsa o an ahım tutsa yine istemem incinme sen. Bir hayal kursam içine seni koysam hiç gitme sen",
"Seni sevdim. Seni birden bire değil usul usul sevdim. 'Uyandım bir sabah' gibi değil, öyle değil.",
"Yokluğunda ömrümün yarısı çekip gitmişti belki de, şimdi varlığın tutmalı kayıp yaşlarımın ellerini",
"Ateşe hakiki bir çay koyalım",
"Kenti unutanlardan olalım.",
"Onu kırmış olmalı yaşamında birisi… Dinlendikçe susması, düşündükçe susması… Tek başına iki kişi olmuş kendisiyle gölgesi",
"Uykunun içinde bir rüya, rüyamda bir gece, gecede ben. Bir yere gidiyorum, delice. Aklımda sen",
"Bu kadar az şey söylerken, bu kadar mı çok şey söyleyebilir bir şiir.. Bu kadar 'demeyeceğim' derken, bu kadar mı 'gitme' denebilir.",
  "Dilek tutman için yıldızların kayması mı gerekiyor illa ki? Gönlüm gönlüne kaydı yetmez mi?",
  "Süt içiyorum yarım yağlı, mutluluğum sana bağlı.",
  "Müsaitsen aklım bu gece sende kalacak.",
  "Gemim olsa ne yazar liman sen olmadıktan sonra...",
  "Gözlerimi senden alamıyorum çünkü benim tüm dünyam sensin.",
  "Sabahları görmek istediğim ilk şey sensin.",
  "Mutluluk ne diye sorsalar- cevabı gülüşünde ve o sıcak bakışında arardım.",
  "Hayatım ne kadar saçma olursa olsun, tüm hayallerimi destekleyecek bir kişi var. O da sensin, mükemmel insan.",
  "Bir adada mahsur kalmak isteyeceğim kişiler listemde en üst sırada sen varsın.",
  "Sesini duymaktan- hikayelerini dinlemekten asla bıkmayacağım. Konuşmaktan en çok zevk aldığım kişi sensin.",
  "Üzerinde pijama olsa bile, nasıl oluyor da her zaman bu kadar güzel görünüyorsun? Merhaba, neden bu kadar güzel olduğunu bilmek istiyorum.",
  "Çok yorulmuş olmalısın. Bütün gün aklımda dolaşıp durdun.",
  "Çocukluk yapsan da gönlüme senin için salıncak mı kursam?",
  "Sen birazcık huzur aradığımda gitmekten en çok hoşlandığım yersin.",
  "Hangi çiçek anlatır güzelliğini? Hangi mevsime sığar senin adın. Hiçbir şey yeterli değil senin güzelliğine erişmeye. Sen eşsizsin...",
  "Rotanızı geçen her geminin ışığıyla değil, yıldızlara göre ayarlayın.",
  "Telaşımı hoş gör, ıslandığım ilk yağmursun.",
  "Gülüşün ne güzel öyle- cumhuriyetin gelişi gibi...",
  "Burada ki en zeki ikinci kişisin Yusufdan sonra...",
  "Canım ortadan kaybolmak istiyor suc ortağım olur musun?",
  "Gözlerin adeta bir derya icinde boğulduğum...",
  "Falında bir sonsuzluk var o sonsuzlukta benimle kaybolur musun?",
  "İhtişamın gözlerimi büyülüyor hep böyle misindir?",
  "Seviyorsan git konuş bence demişler, evet! seviyorum seni benimle cıkar mısın?",
  "Bu kaşın gözün temeli nereden bu güzelliği allah özene bözene yaratmış maşallah",
  "Soruyorlar bu sözleri nereden buluyorsun... bi anda ilham geliyor.",
  "Cok kızla tanıştım, aşık oldum sandım, ama seni sevince onların yalan olduğunu anladım.",
  "Bazen gülüyorum ansızın... bu busenin sebebi sensin.",
  "Seni görünce icimde kelebekler ucusuyor... sebebi olmak nasıl bir duygu?",
  "Hayatımda, ne kadar saçma olursa olsun, tüm hayallerimi destekleyecek bir kişi var. O da sensin, mükemmel insan.",
"Baharda açan çiçeklerinden bile daha güzelsin. Eğer bir şair olsaydım, güzelliğine adanacak yüzlerce şiir yazabilirdim.",
"İnsanların bana aklımdan ne geçirdiğimi sorduklarında, senden başka hiçbir şey söyleyemiyorum.",
"Bu mesajımı sana kalbimin en şiddetli sesiyle yolluyorum, seni seviyorum...",
"ayyyyyyy çok şekersinnnnnn",
"kilo almışsınn sankiiii",
"bana kalbine giden yolu tarif eder misin",
"senin evin yok mu? sürekli aklımdasın.",
"romantik bir yemeğe ne dersin?",
"çok sinirlendim seni görünce pamuk gibi oldum.",
"1 milyon lira verseler yine gülüşünle değişmem",
"kimseyi tanımadım ben senden daha güzel.",
"o beni anladııı dibineee kadaaar",
"kime neee banaa neee bu. aşk beni yoraaar",
"şey utanıyorumda sanaa söylemem gereken bir şey var... ||galiba sana aşık oldum :c||",
"biliyorum bana aşıksın ama sevgilim var.",
"elimde yüzük kalbimde sen benimle evlenir misin?",
"şu sunucuda bir şeyi kıskanıyorum o da senin müthişliğin ya",
"ben sana düştüm ama yaa napıcazzz",
"karıncalar göbüşünü yesin senin :p",
"ne zaman uyanırsın? Güneşin doğuşunu izlemek istiyorum da :p", 
"iyi ki varsın ❤",
"çok tatlısın sankiiii",
"çok çirkinsin :c",
"Seni seviyorum. Je t'aime. Ich liebe dich. Aishiteru. Kocham cie. Ya lyublyu tebya. Te quiero. Ti amo.",
"yataktan paraşütle mi iniyorsun? Gözüme biraz 1.55 gibi geldin de.", 
"ayyyyyyy çok şekersinnnnnnn",
"onun dilinde sen, aklında ben varım. Sevgilimden uzak dur.",
"aşk kaç beden giyer",
"kilo vermen gerekiyor biraz kilo almışsın sankiiiii",
"of tamam git onunla konuş, belli ki yeni sevgili yapmışsın. Yazmasana bana bir daha?",
"belki biraz seni kıskanmış olabilirimmm. Ama çok harikasın neden kıskanmayayım :(",
"şimdi sana yürüsem ne yapabilirsin kiii",
"kendini sevmelisin çünkü ben çok seviyorum 😘",
"Güneş mi doğmuş yoksa sen mi gülümsedin."
];

module.exports = (message) => {
  if (db.get("ayar.chatKanali") && message.channel.id === db.get("ayar.chatKanali") && !message.author.bot) {
    iltifatSayi++;
    if (iltifatSayi >= 50) {
      iltifatSayi = 0;
      message.reply(iltifatlar.random());
    };
  };
};

module.exports.configuration = {
  name: "message"
};