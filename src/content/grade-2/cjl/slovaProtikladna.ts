import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "@/content/grade-3/_shared";

// Přepsáno 2026-09-11 (inventura obsahu): původní banky měly po 8 úlohách,
// jednu nápovědu a žádnou zpětnou vazbu u chybných možností. Teď tři oddělené
// banky, každá úloha má vlastní dvě nápovědy, vysvětlení PROČ a zpětnou vazbu
// ke každé chybné možnosti.
//   L1 rozpoznání: opak běžného slova (protikladná slova)
//   L2 aplikace:   slovo se stejným významem (souznačná slova) — past je opak
//   L3 transfer:   opak nebo souznačné slovo přímo ve větě, kde záleží na tom,
//                  o čem věta mluví (starý děda × starý dům × starý chleba…)

type Chybna = [string, string];

interface Opak {
  w: string;
  a: string;
  /** Malá nápověda — situace, ve které dítě opak samo uvidí. */
  clue: string;
  /** O čem slovo vypovídá (doplňuje se za „říká, …“). */
  o: string;
  proc: string;
  d: [Chybna, Chybna, Chybna];
  e: string;
}

const POOL_L1: Opak[] = [
  { w: "velký", a: "malý", e: "🐘", clue: "Slon je obrovské zvíře. Jaký je proti němu mravenec?", o: "jak velké něco je",
    proc: "Slon je velký, mravenec je malý — o velikosti říkají pravý opak.",
    d: [["veliký", "„Veliký“ znamená skoro totéž co „velký“ — je to slovo souznačné, ne opak."],
      ["dlouhý", "„Dlouhý“ říká, jakou má něco délku, ne velikost celé věci."],
      ["těžký", "„Těžký“ říká, kolik něco váží. Opak slova „velký“ to není."]] },
  { w: "rychlý", a: "pomalý", e: "🐌", clue: "Závodní auto uhání po dráze. Jaký je proti němu šnek?", o: "jak rychle se něco pohybuje",
    proc: "Závodní auto je rychlé, šnek je pomalý — o rychlosti říkají pravý opak.",
    d: [["hbitý", "„Hbitý“ znamená taky rychlý a obratný — to je slovo podobné, ne opak."],
      ["hlasitý", "„Hlasitý“ říká, jak silný je zvuk, ne jak rychle se něco pohybuje."],
      ["veselý", "„Veselý“ říká, jakou má kdo náladu. S rychlostí nesouvisí."]] },
  { w: "den", a: "noc", e: "🌙", clue: "Ráno vyjde slunce a začne den. Co přijde, když slunce zapadne a svítí hvězdy?", o: "jestli venku svítí slunce",
    proc: "Ve dne svítí slunce, v noci je tma — den a noc jsou protikladná slova.",
    d: [["večer", "„Večer“ je jen konec dne, kdy se stmívá. Pravý opak dne je až tma bez slunce."],
      ["poledne", "„Poledne“ je uprostřed dne — to je pořád den, ne jeho opak."],
      ["týden", "„Týden“ je sedm dní za sebou. Opak dne to není."]] },
  { w: "nahoru", a: "dolů", e: "🛗", clue: "Výtah vyjel do nejvyššího patra. Kam pojede, až se bude vracet do přízemí?", o: "kterým směrem se jde",
    proc: "Nahoru znamená výš, dolů znamená níž — jsou to opačné směry.",
    d: [["výš", "„Výš“ míří stejným směrem jako „nahoru“ — to je skoro totéž, ne opak."],
      ["doprava", "„Doprava“ je směr do strany. Opak slova „nahoru“ míří přímo proti němu."],
      ["dopředu", "„Dopředu“ je směr před sebe. Opak slova „nahoru“ to není."]] },
  { w: "veselý", a: "smutný", e: "😢", clue: "Dítě dostalo dárek a směje se. Jaké je dítě, kterému se ztratila hračka?", o: "jakou má kdo náladu",
    proc: "Veselý člověk se směje, smutný pláče — o náladě říkají pravý opak.",
    d: [["radostný", "„Radostný“ znamená skoro totéž co „veselý“ — je to slovo souznačné."],
      ["hladový", "„Hladový“ říká, že má někdo chuť k jídlu. S náladou nesouvisí."],
      ["tichý", "Smutné dítě bývá i tiché, ale „tichý“ říká, jak hlasitý kdo je. Opak slova „veselý“ to není."]] },
  { w: "nový", a: "starý", e: "🚲", clue: "Kolo je dnes poprvé venku z krabice. Jaké bude, až na něm budeš jezdit dvacet let?", o: "jak dlouho už věc máme",
    proc: "Nová věc je právě koupená, stará už dlouho slouží — nový a starý jsou protikladná slova.",
    d: [["moderní", "„Moderní“ znamená podle nové módy — je to skoro totéž jako nový, ne opak."],
      ["čistý", "„Čistý“ říká, že věc není špinavá. I nová věc může být špinavá."],
      ["drahý", "„Drahý“ říká, kolik věc stojí. Opak slova „nový“ to není."]] },
  { w: "teplý", a: "studený", e: "🧊", clue: "Čaj v hrnku hřeje do dlaní. Jaký je na dotek led?", o: "jakou má něco teplotu",
    proc: "Teplý čaj hřeje, studený led chladí — o teplotě říkají pravý opak.",
    d: [["horký", "„Horký“ je ještě víc než teplý — míří stejným směrem, ne opačně."],
      ["mokrý", "„Mokrý“ říká, že je na něčem voda. S teplotou to nesouvisí."],
      ["sladký", "„Sladký“ říká, jakou má něco chuť, ne teplotu."]] },
  { w: "plný", a: "prázdný", e: "🥛", clue: "Hrnek je mlékem až po okraj. Jaký bude, když všechno vypiješ?", o: "kolik je v něčem uvnitř",
    proc: "V plném hrnku je všechno, v prázdném nic — plný a prázdný jsou protikladná slova.",
    d: [["naplněný", "„Naplněný“ znamená skoro totéž co „plný“ — to je podobné slovo, ne opak."],
      ["čistý", "Vypitý hrnek může být čistý i špinavý. „Čistý“ neříká, kolik je v hrnku."],
      ["malý", "„Malý“ říká velikost hrnku. I malý hrnek může být plný."]] },
  { w: "otevřít", a: "zavřít", e: "🪟", clue: "Ráno otevřeš okno, aby šel dovnitř vzduch. Co s ním uděláš, když začne foukat studený vítr?", o: "co děláš s oknem nebo dveřmi",
    proc: "Otevřeným oknem jde vzduch dovnitř, zavřeným ne — otevřít a zavřít jsou opačné činnosti.",
    d: [["rozevřít", "„Rozevřít“ znamená skoro totéž co „otevřít“ — to je podobné slovo, ne opak."],
      ["umýt", "Umýt můžeš okno otevřené i zavřené. Opak slova „otevřít“ to není."],
      ["otočit", "„Otočit“ znamená pohnout věcí dokola. Opak slova „otevřít“ to není."]] },
  { w: "začátek", a: "konec", e: "📖", clue: "Pohádka se rozjede slovy „Bylo, nebylo…“. Co přijde se slovy „Zazvonil zvonec“?", o: "ve které části něco je",
    proc: "Začátek je tam, kde něco začíná, konec tam, kde to skončí — jsou to opačné části.",
    d: [["úvod", "„Úvod“ je jiné slovo pro začátek — znamená skoro totéž, ne opak."],
      ["střed", "„Střed“ je uprostřed mezi začátkem a koncem. Opak začátku to není."],
      ["přestávka", "„Přestávka“ je chvilka, kdy se na chvíli přestane. Pak se zase pokračuje."]] },
  { w: "přijít", a: "odejít", e: "🚪", clue: "Tatínek odpoledne vejde dveřmi a je doma. Co udělá ráno, když jde do práce?", o: "jestli se jde k někomu, nebo pryč",
    proc: "Kdo přijde, je tady, kdo odejde, je pryč — přijít a odejít jsou opačné pohyby.",
    d: [["dorazit", "„Dorazit“ znamená skoro totéž co „přijít“ — to je podobné slovo."],
      ["sedět", "„Sedět“ znamená zůstat na místě. Opak slova „přijít“ je pohyb pryč."],
      ["zavolat", "Zavolat můžeš na někoho odkudkoli. S příchodem ani odchodem to nesouvisí."]] },
  { w: "mokrý", a: "suchý", e: "👕", clue: "Tričko zmoklo v dešti. Jaké bude, když ho pověsíš na slunce?", o: "jestli je na něčem voda",
    proc: "Na mokré věci je voda, na suché žádná — mokrý a suchý jsou protikladná slova.",
    d: [["vlhký", "„Vlhký“ znamená trochu mokrý — míří stejným směrem, ne opačně."],
      ["čistý", "Tričko se na slunci neumyje. „Čistý“ neříká nic o vodě."],
      ["teplý", "Slunce tričko ohřeje, ale „teplý“ říká teplotu, ne jestli je na něm voda."]] },
  { w: "vysoký", a: "nízký", e: "⛪", clue: "Kostelní věž sahá až k mrakům. Jaký je proti ní plůtek kolem záhonu?", o: "kam až něco sahá",
    proc: "Vysoká věž sahá k mrakům, nízký plůtek jen po kolena — o výšce říkají pravý opak.",
    d: [["veliký", "„Veliký“ znamená skoro totéž co velký. Opak slova „vysoký“ to není."],
      ["široký", "„Široký“ říká, jak je něco široké do stran, ne kam až sahá."],
      ["dlouhý", "„Dlouhý“ říká délku věci, třeba silnice. Opak slova „vysoký“ to není."]] },
  { w: "hlasitý", a: "tichý", e: "🥁", clue: "Bubny na koncertě duní celým sálem. Jaký je proti nim šepot?", o: "jak silný je zvuk",
    proc: "Hlasitý zvuk slyšíš z dálky, tichý sotva zblízka — o zvuku říkají pravý opak.",
    d: [["hlučný", "„Hlučný“ znamená skoro totéž co „hlasitý“ — je to podobné slovo."],
      ["pomalý", "„Pomalý“ říká rychlost, ne sílu zvuku."],
      ["veselý", "„Veselý“ říká náladu. I veselá písnička může být hlasitá."]] },
  { w: "těžký", a: "lehký", e: "🎈", clue: "Batoh plný knih táhne ramena dolů. Jaký je proti němu nafukovací balonek?", o: "kolik něco váží",
    proc: "Těžký batoh táhne dolů, lehký balonek skoro nic neváží — o váze říkají pravý opak.",
    d: [["tvrdý", "„Tvrdý“ říká, jestli jde něco zmáčknout. Kámen je tvrdý i těžký, ale to jsou dvě různé vlastnosti."],
      ["malý", "„Malý“ říká velikost. I malý kamínek může být těžký."],
      ["měkký", "„Měkký“ je opak slova tvrdý, ne slova „těžký“."]] },
];

interface Souznacne {
  w: string;
  a: string;
  clue: string;
  /** Věta se slovem w — do ní dítě zkouší dosadit možnosti. */
  veta: string;
  proc: string;
  d: [Chybna, Chybna, Chybna];
  e: string;
}

const POOL_L2: Souznacne[] = [
  { w: "chlapec", a: "kluk", e: "👦", clue: "Jak si chlapci říkají mezi sebou na hřišti, když nemluví spisovně?", veta: "Ten chlapec hraje fotbal.",
    proc: "„Chlapec“ i „kluk“ označují stejné dítě — „kluk“ se říká hlavně v běžné řeči. Jsou to slova souznačná.",
    d: [["dívka", "„Dívka“ je opak — holka, ne chlapec."],
      ["muž", "„Muž“ je dospělý člověk, ne dítě."],
      ["kamarád", "Kamarádem může být i holka nebo dospělý. „Kamarád“ neznamená totéž co „chlapec“."]] },
  { w: "dívka", a: "holka", e: "👧", clue: "Jak se dívce říká v běžné řeči mezi kamarády?", veta: "Ta dívka skáče přes švihadlo.",
    proc: "„Dívka“ i „holka“ označují stejné dítě — „holka“ se říká v běžné řeči. Jsou to slova souznačná.",
    d: [["chlapec", "„Chlapec“ je opak dívky, ne totéž."],
      ["žena", "„Žena“ je dospělá, dívka je ještě dítě."],
      ["sestra", "„Sestra“ je dívka jen v rodině, a navíc může být i dospělá."]] },
  { w: "hezký", a: "pěkný", e: "🖼️", clue: "Jak jinak pochválíš obrázek, který se ti líbí?", veta: "Namaloval jsi hezký obrázek.",
    proc: "„Hezký“ i „pěkný“ říkají, že se nám něco líbí — znamenají totéž.",
    d: [["ošklivý", "„Ošklivý“ je opak — to se nám nelíbí."],
      ["velký", "„Velký“ říká velikost. Velký obrázek nemusí být hezký."],
      ["barevný", "„Barevný“ říká, že má obrázek hodně barev. To neznamená totéž jako hezký."]] },
  { w: "mluvit", a: "hovořit", e: "🗣️", clue: "Jak jinak, trochu slavnostněji, řekneš, že někdo mluví?", veta: "Paní ředitelka bude mluvit k dětem.",
    proc: "„Mluvit“ i „hovořit“ znamenají říkat něco nahlas — „hovořit“ je jen slavnostnější.",
    d: [["mlčet", "„Mlčet“ je opak — kdo mlčí, neříká nic."],
      ["psát", "„Psát“ znamená dávat slova na papír, ne je říkat nahlas."],
      ["poslouchat", "Poslouchá ten, kdo slyší druhého. Mluví ten druhý."]] },
  { w: "malý", a: "drobný", e: "🌼", clue: "Jak jinak řekneš o myšce, že není vůbec velká?", veta: "Na louce roste malý kvítek.",
    proc: "„Malý“ i „drobný“ říkají, že něco není velké — jsou to slova souznačná.",
    d: [["velký", "„Velký“ je opak slova malý."],
      ["mladý", "„Mladý“ říká věk. Malý kvítek nemusí být mladý."],
      ["krátký", "„Krátký“ říká jen délku. Malý kvítek je malý celý, ne jen krátký."]] },
  { w: "auto", a: "vůz", e: "🚗", clue: "Jak se autu říká jiným, trochu starším slovem?", veta: "Před domem stojí naše auto.",
    proc: "„Auto“ a „vůz“ označují stejný dopravní prostředek — „vůz“ je jen jiné slovo.",
    d: [["kolo", "„Kolo“ je jiný dopravní prostředek — jezdíš na něm sám a šlapeš."],
      ["autobus", "„Autobus“ je jiný dopravní prostředek pro mnoho lidí."],
      ["garáž", "„Garáž“ je místo, kde auto parkuje. Auto to není."]] },
  { w: "smutný", a: "nešťastný", e: "😞", clue: "Jak jinak řekneš o dítěti, kterému se ztratil pejsek?", veta: "Honzík je dnes smutný.",
    proc: "„Smutný“ i „nešťastný“ říkají, že je někomu do pláče — znamenají skoro totéž.",
    d: [["veselý", "„Veselý“ je opak — to se někdo směje."],
      ["unavený", "„Unavený“ je ten, kdo potřebuje odpočívat. Může být i veselý."],
      ["zlý", "„Zlý“ je ten, kdo ubližuje. Smutný člověk nikomu neubližuje."]] },
  { w: "dívat se", a: "koukat", e: "👀", clue: "Jak se v běžné řeči řekne, že se někdo dívá na pohádku?", veta: "Večer se dívám na pohádku.",
    proc: "„Dívat se“ i „koukat“ znamenají sledovat něco očima — „koukat“ se říká v běžné řeči.",
    d: [["poslouchat", "Poslouchá se ušima, ne očima."],
      ["mrkat", "„Mrkat“ znamená na chvilku zavřít oči. Tím se nedíváš."],
      ["ukazovat", "Ukazuje se prstem. Tím nic nesleduješ."]] },
  { w: "spěchat", a: "pospíchat", e: "🏃", clue: "Jak jinak řekneš, že musíš rychle do školy, abys nepřišel pozdě?", veta: "Ráno spěchám do školy.",
    proc: "„Spěchat“ i „pospíchat“ znamenají jít rychle, aby člověk nepřišel pozdě — jsou to slova souznačná.",
    d: [["loudat se", "„Loudat se“ je opak — jít pomalu a nikam nespěchat."],
      ["odpočívat", "„Odpočívat“ znamená nic nedělat a nabírat síly."],
      ["skákat", "„Skákat“ je jiný pohyb — odrážíš se od země."]] },
  { w: "kamarád", a: "přítel", e: "🤝", clue: "Jak jinak nazveš dítě, se kterým si rád hraješ a věříš mu?", veta: "Petr je můj kamarád.",
    proc: "Kamarád i přítel je člověk, kterého máme rádi a věříme mu — slova „kamarád“ a „přítel“ jsou souznačná.",
    d: [["nepřítel", "„Nepřítel“ je opak — to je ten, kdo nám chce ublížit."],
      ["soused", "„Soused“ bydlí vedle nás. Nemusí to být kamarád."],
      ["spolužák", "„Spolužák“ chodí do stejné třídy. Kamarád to být může, ale nemusí."]] },
  { w: "brečet", a: "plakat", e: "😭", clue: "Jak se slušněji řekne, že malé dítě brečí?", veta: "Miminko v kočárku brečí.",
    proc: "„Brečet“ i „plakat“ znamenají, že někomu tečou slzy — „brečet“ je jen z běžné řeči.",
    d: [["smát se", "„Smát se“ je opak — to má někdo radost."],
      ["křičet", "„Křičet“ znamená hlasitě volat. Slzy u toho téct nemusí."],
      ["kýchat", "Kýcháš, když tě zašimrá v nose. S pláčem to nesouvisí."]] },
  { w: "chytrý", a: "bystrý", e: "💡", clue: "Jak jinak pochválíš spolužáka, který rychle přijde na řešení?", veta: "Náš Pepík je chytrý.",
    proc: "Chytrý i bystrý je ten, kdo rychle přemýšlí a na všechno přijde — slova „chytrý“ a „bystrý“ znamenají skoro totéž.",
    d: [["hloupý", "„Hloupý“ je opak slova chytrý."],
      ["silný", "„Silný“ má velkou sílu ve svalech, ne v hlavě."],
      ["hodný", "„Hodný“ je ten, kdo se chová pěkně. Nemusí být chytrý."]] },
  { w: "začít", a: "zahájit", e: "🎬", clue: "Jak jinak, slavnostněji, řekne paní učitelka, že besídka začíná?", veta: "Besídku začneme písničkou.",
    proc: "„Začít“ i „zahájit“ znamenají udělat první krok — „zahájit“ je slavnostnější.",
    d: [["skončit", "„Skončit“ je opak — to je až konec."],
      ["pokračovat", "„Pokračovat“ znamená dělat dál to, co už začalo."],
      ["čekat", "„Čekat“ znamená ještě nezačínat."]] },
  { w: "hodně", a: "mnoho", e: "🌷", clue: "Jak jinak řekneš, že je na louce spousta květin?", veta: "Na louce je hodně květin.",
    proc: "„Hodně“ i „mnoho“ říkají, že je něčeho velké množství — jsou to slova souznačná.",
    d: [["málo", "„Málo“ je opak — to je jen pár květin."],
      ["často", "„Často“ říká, kolikrát se něco děje, ne kolik čeho je."],
      ["dlouho", "„Dlouho“ říká, kolik času něco trvá, ne množství."]] },
  { w: "běžet", a: "utíkat", e: "🐕", clue: "Jak jinak řekneš, že pes pádí přes zahradu?", veta: "Pes běží přes zahradu.",
    proc: "„Běžet“ i „utíkat“ znamenají rychlý pohyb po nohou — jsou to slova souznačná.",
    d: [["stát", "„Stát“ je opak — kdo stojí, nehýbe se z místa."],
      ["jít", "„Jít“ je pomalejší než běh, neznamená totéž."],
      ["skákat", "„Skákat“ je jiný pohyb — odrážíš se od země nahoru."]] },
];

interface VeVete {
  /** opak = hledá se protikladné slovo, totez = souznačné */
  typ: "opak" | "totez";
  w: string;
  s: string;
  a: string;
  clue: string;
  /** K čemu musí odpověď ve větě pasovat (dosazuje se za „pasovat“). */
  k: string;
  proc: string;
  d: [Chybna, Chybna, Chybna];
  e: string;
}

const POOL_L3: VeVete[] = [
  { typ: "opak", w: "starý", s: "Děda je starý.", a: "mladý", e: "👴", k: "k člověku, ne k věci ani k jídlu",
    clue: "Věta mluví o dědovi, tedy o člověku. Jaký opak se říká u lidí?",
    proc: "O lidech říkáme starý × mladý. „Nový“ patří k věcem a „čerstvý“ k jídlu.",
    d: [["nový", "„Nový“ je opak slova starý jen u věcí — nový hrnek, nové auto. O dědovi to říct nejde."],
      ["čerstvý", "„Čerstvý“ je opak slova starý u jídla, třeba u chleba. O dědovi to říct nejde."],
      ["malý", "„Malý“ je opak slova velký. S věkem nesouvisí."]] },
  { typ: "opak", w: "starý", s: "Máme starý dům.", a: "nový", e: "🏠", k: "k věci, ne k člověku",
    clue: "Věta mluví o domě, tedy o věci. Jaký opak se říká u věcí?",
    proc: "U věcí říkáme starý × nový: starý dům stojí už dlouho, nový je právě postavený.",
    d: [["mladý", "„Mladý“ je opak slova starý jen u lidí a zvířat. O domě se to neříká."],
      ["čerstvý", "„Čerstvý“ se říká o jídle. Čerstvý dům neexistuje."],
      ["velký", "„Velký“ říká velikost. Starý dům může být velký i malý."]] },
  { typ: "opak", w: "starý", s: "Ten chleba je starý.", a: "čerstvý", e: "🍞", k: "k jídlu",
    clue: "Věta mluví o chlebu, tedy o jídle. Jaký opak se říká u jídla?",
    proc: "U jídla říkáme starý × čerstvý: starý chleba je tvrdý a okoralý, čerstvý je právě upečený.",
    d: [["nový", "„Nový“ je opak slova starý u věcí. O chlebu se tak neříká."],
      ["mladý", "„Mladý“ se říká o lidech a zvířatech, ne o chlebu."],
      ["měkký", "Chleba po upečení bývá měkký, ale „měkký“ je opak slova tvrdý, ne slova starý."]] },
  { typ: "opak", w: "tlustý", s: "Náš kocour je tlustý.", a: "hubený", e: "🐈", k: "ke zvířeti",
    clue: "Věta mluví o kocourovi. Jaký opak se říká u zvířat a lidí?",
    proc: "O lidech a zvířatech říkáme tlustý × hubený. „Tenký“ se říká o věcech, třeba o knize nebo niti.",
    d: [["tenký", "„Tenký“ je opak slova tlustý u věcí — tenká kniha, tenká nit. O kocourovi se tak neříká."],
      ["slabý", "„Slabý“ je opak slova silný. Tlustý kocour může být silný i slabý."],
      ["malý", "„Malý“ je opak slova velký. Opak slova „tlustý“ to není."]] },
  { typ: "opak", w: "tlustá", s: "Ta kniha je tlustá.", a: "tenká", e: "📕", k: "k věci",
    clue: "Věta mluví o knize, tedy o věci. Jaký opak se říká u věcí?",
    proc: "U věcí říkáme tlustý × tenký: tlustá kniha má hodně stránek, tenká jen pár.",
    d: [["hubená", "„Hubený“ je opak slova tlustý u lidí a zvířat. Hubená kniha neexistuje."],
      ["lehká", "Kniha s málo stránkami bývá lehká, ale „lehký“ je opak slova těžký."],
      ["malá", "„Malá“ je opak slova velká. Malá kniha může mít i hodně stránek."]] },
  { typ: "opak", w: "vstal", s: "Děda vstal ze židle.", a: "sedl si", e: "🪑", k: "k židli",
    clue: "Odkud děda vstal? Co se na tom místě obvykle dělá?",
    proc: "Ze židle se vstává a na židli se sedá — opak slova „vstal“ je tady „sedl si“.",
    d: [["lehl si", "Lehnout si je opak vstávání z postele. Na židli si nelehneš."],
      ["stál", "„Stál“ znamená, že už je na nohou a nehýbe se. Opak vstávání je pohyb dolů."],
      ["spadl", "„Spadl“ znamená, že upadl nechtěně. To není opak slova vstal."]] },
  { typ: "opak", w: "vstal", s: "Děda vstal z postele.", a: "lehl si", e: "🛏️", k: "k posteli",
    clue: "Odkud děda vstal? Co se na tom místě dělá večer?",
    proc: "Z postele se vstává a do postele se lehá — opak slova „vstal“ je tady „lehl si“.",
    d: [["sedl si", "Sednout si je opak vstávání ze židle. Z postele vstáváš, když jsi předtím ležel."],
      ["spal", "„Spal“ znamená, že už ležel a spal. Opak vstávání je pohyb do postele."],
      ["ustlal", "Ustlat znamená upravit peřiny. To není opak slova vstal."]] },
  { typ: "opak", w: "naměkko", s: "Uvařím vajíčko naměkko.", a: "natvrdo", e: "🥚", k: "k vaření vajíčka",
    clue: "Jak se vaří vajíčko, když má mít žloutek pevný, ne tekutý?",
    proc: "Vajíčko se vaří naměkko, nebo natvrdo — naměkko má tekutý žloutek, natvrdo pevný.",
    d: [["tvrdě", "„Tvrdě“ se říká třeba o spánku: spí tvrdě. U vajíčka se to neříká."],
      ["dokřupava", "Dokřupava se peče třeba rohlík nebo řízek, ne vařené vajíčko."],
      ["nazlátko", "Nazlátko se opéká topinka. Opak slova „naměkko“ to není."]] },
  { typ: "opak", w: "hluboký", s: "Rybník je hluboký.", a: "mělký", e: "🏞️", k: "k vodě",
    clue: "Věta mluví o vodě. Jaký je rybník, když v něm stojíš jen po kotníky?",
    proc: "U vody říkáme hluboký × mělký: v hlubokém rybníku nedosáhneš na dno, v mělkém ano.",
    d: [["nízký", "„Nízký“ je opak slova vysoký, třeba u plotu. O vodě v rybníku se tak neříká."],
      ["úzký", "„Úzký“ je opak slova široký. Říká, jak je rybník široký, ne jak hluboký."],
      ["malý", "„Malý“ říká, jak velký je celý rybník. I malý rybník může být hluboký."]] },
  { typ: "opak", w: "široká", s: "Řeka je široká.", a: "úzká", e: "🌊", k: "k řece",
    clue: "Představ si, jak daleko je to z jednoho břehu řeky na druhý.",
    proc: "Široká řeka má břehy daleko od sebe, úzká blízko — široký a úzký jsou protikladná slova.",
    d: [["mělká", "„Mělká“ je opak slova hluboká. Říká, kde je dno, ne jak daleko jsou břehy."],
      ["krátká", "„Krátká“ je opak slova dlouhá. Říká, jak daleko řeka teče."],
      ["pomalá", "„Pomalá“ je opak slova rychlá. Říká, jak rychle voda teče."]] },
  { typ: "totez", w: "bystrý", s: "Honza je bystrý kluk.", a: "chytrý", e: "🧒", k: "ke klukovi",
    clue: "Věta mluví o klukovi a o tom, jak mu to myslí.",
    proc: "O člověku znamená „bystrý“ totéž co „chytrý“ — rychle přemýšlí. O potoku by znamenal něco jiného.",
    d: [["rychlý", "„Rychlý“ znamená totéž co „bystrý“ jen u vody, třeba u potoka. U kluka jde o přemýšlení."],
      ["hloupý", "„Hloupý“ je opak — to by smysl věty obrátilo."],
      ["silný", "„Silný“ znamená velkou sílu ve svalech, ne v hlavě."]] },
  { typ: "totez", w: "bystrý", s: "Potok je bystrý.", a: "rychlý", e: "💧", k: "k vodě v potoce",
    clue: "Věta mluví o vodě v potoce. Co ta voda dělá?",
    proc: "O vodě znamená „bystrý“ totéž co „rychlý“ — bystrý potok teče rychle. O klukovi by znamenal něco jiného.",
    d: [["chytrý", "„Chytrý“ znamená totéž co „bystrý“ jen u lidí. Potok přemýšlet neumí."],
      ["pomalý", "„Pomalý“ je opak — to by smysl věty obrátilo."],
      ["studený", "Voda v potoce bývá studená, ale „studený“ říká teplotu, ne rychlost."]] },
  { typ: "totez", w: "hodná", s: "Babička je hodná.", a: "laskavá", e: "👵", k: "k tomu, jak se babička chová",
    clue: "Věta mluví o tom, jak se babička chová k ostatním.",
    proc: "Hodná i laskavá je babička, která se k ostatním chová mile a pomáhá — slova „hodná“ a „laskavá“ znamenají skoro totéž.",
    d: [["zlá", "„Zlá“ je opak — to by smysl věty obrátilo."],
      ["stará", "„Stará“ říká věk. Babička může být stará a hodná zároveň, ale neznamená to totéž."],
      ["veselá", "„Veselá“ říká náladu. Hodná babička nemusí být pořád veselá."]] },
  { typ: "totez", w: "vypráví", s: "Dědeček vypráví pohádku.", a: "povídá", e: "📚", k: "k tomu, co dědeček s pohádkou dělá",
    clue: "Věta říká, co dědeček dělá s pohádkou pro vnoučata.",
    proc: "Vyprávět i povídat pohádku znamenají říkat ji nahlas vlastními slovy — věta znamená totéž.",
    d: [["čte", "„Čte“ znamená, že má pohádku v knize před sebou. Vyprávět můžeš i zpaměti."],
      ["poslouchá", "Poslouchá ten, kdo pohádku slyší. Dědeček ji ale říká."],
      ["píše", "„Píše“ znamená, že dává slova na papír, ne že je říká."]] },
  { typ: "totez", w: "těžký", s: "Ten příklad je těžký.", a: "obtížný", e: "✏️", k: "k příkladu z matematiky, ne ke kufru",
    clue: "Věta mluví o příkladu z matematiky, ne o kufru. Příklad se přece nedá zvednout.",
    proc: "U úlohy znamená „těžký“ totéž co „obtížný“ — dá hodně práce ji vyřešit. U kufru by „těžký“ znamenal, že hodně váží.",
    d: [["lehký", "„Lehký“ je opak — to by smysl věty obrátilo."],
      ["dlouhý", "Dlouhý příklad může být i snadný. „Dlouhý“ neznamená totéž co těžký."],
      ["nový", "„Nový“ říká, že příklad vidíš poprvé. Nový příklad může být i snadný."]] },
];

const dis = (d: [Chybna, Chybna, Chybna]) => d.map(([value, why]) => ({ value, why })) as [Distractor, Distractor, Distractor];

function opak(r: Opak): PracticeTask {
  return {
    ...choice(`Které slovo je opakem slova „${r.w}“?`, r.a, dis(r.d), {
      hints: [
        r.clue,
        `Slovo „${r.w}“ říká, ${r.o}. Hledej slovo, které o tom říká pravý opak — ne něco podobného a ne něco úplně jiného.`,
      ],
      explanation: r.proc.includes("protikladná") ? r.proc : `${r.proc} Slova s opačným významem se jmenují protikladná.`,
    }),
    emoji: r.e,
  };
}

function souznacne(r: Souznacne): PracticeTask {
  return {
    ...choice(`Které slovo znamená skoro totéž jako „${r.w}“?`, r.a, dis(r.d), {
      hints: [
        r.clue,
        `Dosaď každou možnost do věty „${r.veta}“ místo slova „${r.w}“. Správné slovo nechá větu znamenat pořád totéž, jen jinými slovy. Opak by smysl obrátil.`,
      ],
      explanation: r.proc,
    }),
    emoji: r.e,
  };
}

function veVete(r: VeVete): PracticeTask {
  const q = r.typ === "opak"
    ? `Jaký je opak slova „${r.w}“ ve větě „${r.s}“?`
    : `Které slovo má ve větě „${r.s}“ stejný význam jako „${r.w}“?`;
  const h1 = r.typ === "opak"
    ? `Dosaď každou možnost do věty „${r.s}“ místo slova „${r.w}“. Opak musí pasovat ${r.k}. Slovo, které je opakem „${r.w}“ jen u jiných věcí, sem nesedí.`
    : `Dosaď každou možnost do věty „${r.s}“ místo slova „${r.w}“. Věta musí znamenat pořád totéž. Pozor: „${r.w}“ může u různých věcí znamenat něco jiného, tady musí slovo pasovat ${r.k}.`;
  return {
    ...choice(q, r.a, dis(r.d), { hints: [r.clue, h1], explanation: r.proc }),
    emoji: r.e,
  };
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return shuffle(POOL_L1).map(opak);
  if (level === 2) return shuffle(POOL_L2).map(souznacne);
  return shuffle(POOL_L3).map(veVete);
}

export const SLOVAPROTIKLADNA: TopicMetadata[] = [
  {
    id: "g2-cjl-jazykova-vychova-slovni-zasoba-slova-protikladna-a-souznacna",
    rvpNodeId: "g2-cjl-jazykova-vychova-slovni-zasoba-slova-protikladna-a-souznacna",
    title: "Slova protikladná a souznačná",
    studentTitle: "Opak a to samé",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Slovní zásoba",
    briefDescription: "Naučíš se slova opačného a podobného významu.",
    keywords: ["protikladná", "souznačná", "antonyma", "synonyma", "velký malý", "chlapec kluk"],
    goals: [
      "Vědět, co jsou protikladná slova (antonyma).",
      "Vědět, co jsou souznačná slova (synonyma).",
      "Najít opak nebo synonymum k zadanému slovu.",
    ],
    boundaries: ["Pouze základní slova 2. třídy.", "Význam slova podle věty (starý děda × starý dům) jen na L3."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Protikladná = opačný význam (velký × malý). Souznačná = podobný/stejný význam (chlapec = kluk).",
      steps: ["Přečti otázku.", "Hledáš opak nebo synonymum?", "Vyber slovo, které opačně nebo stejně znamená."],
      commonMistake: "Záměna protikladu a synonyma — 'velký × malý' je protiklad, 'velký = obrovský' je synonymum.",
      example: "Opak 'rychlý' → 'pomalý'. Synonymum 'chlapec' → 'kluk'.",
    },
  },
];
