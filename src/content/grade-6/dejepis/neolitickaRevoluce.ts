/**
 * Dějepis 6. ročník — Neolitická revoluce: zemědělství a chov dobytka (select_one).
 *
 * Napsáno 2026-09-14, opraveno týž den podle žáka, pedagoga a fakt-experta.
 * Téma stojí na vztahu příčiny a důsledku
 * (zemědělství → usedlost → zásoby → přebytky), proto jediný typ select_one:
 *  • L1 — zapamatování: pojmy (neolit, usedlost) a znaky neolitu
 *    (místo, plodiny, zvířata, nástroje, datace).
 *  • L2 — použití: znak neolitu rozpoznaný v nálezu nebo v popisu skupiny lidí.
 *  • L3 — analýza: řetězce příčin a důsledků, nejvýš 4 obrácené otázky „NENÍ“.
 *    Distraktory L3 jsou převážně ze stejné doby a pletou příčinu s důsledkem;
 *    klíčem obrácených otázek je většinou jev ze stejné doby, který je PŘÍČINOU,
 *    ne důsledkem (jen jednou jev ze starší doby).
 *
 * Chybový model (každý distraktor je jedna z těchto chyb):
 *  1. anachronismus (kov, kůň, slepice, plodiny z Ameriky),
 *  2. záměna s paleolitem a mezolitem (kočování, stany, mamuti),
 *  3. přehozená příčina a důsledek, vedlejší vliv místo hlavní příčiny,
 *     nebo přeskočený mezikrok (města, králové),
 *  4. „revoluce“ jako náhlý objev jednoho člověka nebo začátek v Evropě.
 *
 * Fakta zúžená podle fakt-experta: keramiku znali už někteří lovci (východní
 * Asie), ve střední Evropě se ale rozšířila spolu se zemědělstvím; broušení
 * kamene není vynález neolitu, v neolitu se broušené sekery rozšířily; po
 * neolitu následuje eneolit (stále doba kamenná, už s mědí).
 *
 * Každá úroveň je pevná banka, generátor vrací všechny úlohy
 * s nově zamíchanými možnostmi — ≥12 různých úloh je zaručeno deterministicky.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildChoiceTask as choice } from "./_shared";

interface Polozka {
  q: string;
  key: string;
  /** [možnost, proč je to chyba] */
  d: [string, string][];
  /** Velká nápověda musí být aspoň o pětinu delší než malá, jinak ji `_shared` doplní obecnou větou. */
  h: [string, string];
  e: string;
}

const uloha = (p: Polozka): PracticeTask =>
  choice(p.q, p.key, p.d.map(([value, why]) => ({ value, why })), { hints: [...p.h], explanation: p.e });

// ── L1 — zapamatování ────────────────────────────────────────────────────
const L1: Polozka[] = [
  {
    q: "Jak se česky nazývá neolit?",
    key: "mladší doba kamenná",
    d: [
      ["starší doba kamenná", "Starší doba kamenná je paleolit, doba lovců mamutů."],
      ["střední doba kamenná", "Střední doba kamenná je mezolit. Lidé v ní po skončení doby ledové ještě lovili a sbírali."],
      ["doba bronzová", "Doba bronzová přišla až po době kamenné. Neolitičtí lidé bronz ještě neznali."],
    ],
    h: [
      "Předpona neo- znamená nový. Neolit tedy přišel až po paleolitu a mezolitu.",
      "Paleolit je starší doba kamenná a mezolit střední doba kamenná. Která část doby kamenné přišla po nich, když lidé ještě neměli kovové nástroje?",
    ],
    e: "Neolit je mladší doba kamenná. Předcházel mu paleolit (starší doba kamenná) a mezolit (střední doba kamenná). Lidé v neolitu začali pěstovat plodiny a chovat zvířata, nástroje ale měli pořád z kamene, dřeva a kosti.",
  },
  {
    q: "Co znamená, že lidé v neolitu žili usedle?",
    key: "bydleli trvale na jednom místě",
    d: [
      ["sedávali večer společně u ohně", "Usedlý neznamená, že lidé hodně seděli. Znamená, že zůstávali bydlet na jednom místě."],
      ["stěhovali se jen dvakrát do roka", "Kdo se stěhuje, i když jen občas, usedlý není. Usedlí lidé zůstávali na jednom místě celé roky."],
      ["stavěli si stany z kůží", "Stany z kůží se dají složit a přenést. Stavěli si je lovci, kteří táhli za zvěří."],
    ],
    h: [
      "Slovo usedlý souvisí se slovesem usadit se. Co udělá člověk, který se někde usadí?",
      "Zemědělec nemohl odejít od pole, které zasel. Porovnej ho s lovcem, který táhl za zvěří, a nenech se splést tím, že slovo zní podobně jako sedět.",
    ],
    e: "Usedlí lidé bydleli trvale na jednom místě. Zemědělci museli zůstat u svých polí a stád, a proto si stavěli pevné domy. Lovci a sběrači se naopak stěhovali za potravou a nosili obydlí s sebou.",
  },
  {
    q: "Které zvíře ochočili lidé jako první, ještě před vznikem zemědělství?",
    key: "psa",
    d: [
      ["kozu", "Kozy ochočili až první zemědělci na Blízkém východě."],
      ["kočku", "Kočky se k lidem přidaly až u zemědělských vesnic, kde lovily myši u zásob obilí."],
      ["koně", "Koně se začali chovat až dlouho po vzniku zemědělství."],
    ],
    h: [
      "Hledej zvíře, které mohlo pomáhat už lovcům při lovu a hlídat jejich tábor.",
      "U každého zvířete se zeptej, k čemu by bylo lovcům, kteří se stěhovali. Zvíře, které dává mléko nebo chytá myši u zásob obilí, dává smysl až ve vesnici.",
    ],
    e: "Prvním ochočeným zvířetem byl pes. Z vlků ho ochočili lovci a sběrači ještě v době ledové, tisíce let před prvními poli. Kozy a kočky se k lidem přidaly až se zemědělstvím a koně se chovali ještě později.",
  },
  {
    q: "Kde začali lidé nejdříve pěstovat obilí a chovat zvířata?",
    key: "v Úrodném půlměsíci na Blízkém východě",
    d: [
      ["na území dnešních Čech a Moravy", "K nám přišlo zemědělství až kolem roku 5500 př. n. l., o tisíce let později. Přinesli ho lidé, kteří se sem postupně šířili z jihovýchodu."],
      ["ve starověkém Egyptě u pyramid", "Pyramidy vznikly o tisíce let později. Zemědělství bylo v té době už staré a začalo jinde."],
      ["v severní Evropě u okraje ledovce", "U ledovce bylo příliš chladno a obilí by nedozrálo. Žili tam lovci sobů."],
    ],
    h: [
      "Hledej krajinu s teplým podnebím, kde divoce rostly trávy s velkými zrny a žila zvířata, která se dala ochočit.",
      "Zemědělství vzniklo tam, kde rostli divocí předkové obilí. Odtud se tisíce let šířilo dál, takže místa v Evropě i mnohem pozdější říše vyřaď.",
    ],
    e: "Nejstarší pole a stáda známe z Úrodného půlměsíce na Blízkém východě (například z dnešního Iráku, Sýrie, Turecka, Íránu nebo Jordánska), z doby před více než 10 000 lety. Rostly tam divoké druhy pšenice a ječmene a žily divoké ovce a kozy. Do Evropy se zemědělství šířilo tisíce let.",
  },
  {
    q: "Kterou plodinu pěstovali první zemědělci na Blízkém východě?",
    key: "pšenici",
    d: [
      ["kukuřici", "Kukuřice pochází z Ameriky. Do Evropy a na Blízký východ se dostala až v novověku."],
      ["brambory", "Brambory pocházejí z Jižní Ameriky. Do Evropy je přivezli až mořeplavci v novověku."],
      ["cukrovou řepu", "Cukrovou řepu lidé vyšlechtili až v novověku. První zemědělci ji znát nemohli."],
    ],
    h: [
      "U každé plodiny se zeptej, odkud pochází a kdy se dostala do Evropy. Plodina z jiného světadílu tu být nemohla.",
      "První zemědělci pěstovali to, co u nich rostlo divoce. Plodiny z Ameriky přivezli mořeplavci až v novověku a některé rostliny lidé vyšlechtili teprve nedávno.",
    ],
    e: "První zemědělci pěstovali pšenici (hlavně jednozrnku a dvouzrnku), protože její divoké druhy rostly přímo na Blízkém východě. Kukuřice a brambory pocházejí z Ameriky a cukrová řepa se pěstuje až od novověku.",
  },
  {
    q: "Kterou luštěninu pěstovali první zemědělci?",
    key: "hrách",
    d: [
      ["fazole", "Naše běžné fazole pocházejí z Ameriky. Do Evropy se dostaly až v novověku."],
      ["sóju", "Sója pochází z Číny. Do Evropy se dostala až mnohem později."],
      ["arašídy", "Arašídy pocházejí z Jižní Ameriky. První zemědělci na Blízkém východě je neznali."],
    ],
    h: [
      "Luštěniny rostou v luscích. U každé si ověř, jestli rostla divoce na Blízkém východě, nebo ji lidé poznali jinde.",
      "Vzpomeň si, odkud k nám přišly plodiny z Ameriky a které přivezli obchodníci z dalekého východu Asie. Luštěnina prvních zemědělců musela růst divoce přímo v Úrodném půlměsíci.",
    ],
    e: "Hrách patří k nejstarším pěstovaným luštěninám. Rostl divoce na Blízkém východě a zemědělci ho pěstovali od počátku. Fazole a arašídy pocházejí z Ameriky, sója z Číny.",
  },
  {
    q: "Z čeho získávali neolitičtí lidé vlákno na tkaní látek?",
    key: "ze stonků lnu",
    d: [
      ["z bavlny", "Bavlna se pěstovala v Indii a v Americe. Do střední Evropy se dostala až ve středověku."],
      ["z hedvábí", "Hedvábí pochází z Číny. Do Evropy se dostalo až ve starověku a bylo velmi vzácné."],
      ["z listů kukuřice", "Kukuřice pochází z Ameriky. V neolitu ji v Evropě nikdo neznal."],
    ],
    h: [
      "Hledej rostlinu, která dobře roste i v Evropě a jejíž stonek je plný pevných vláken.",
      "Vyřaď suroviny, které přišly z Indie, Číny nebo Ameriky. Neolitičtí tkalci si museli vystačit s tím, co vypěstovali na vlastním poli.",
    ],
    e: "Len se pěstoval od počátku zemědělství. Ze stonků lnu se získávalo vlákno, na vřetenu s přeslenem se spředlo do nitě a na stavu se utkalo. Bavlna, hedvábí i kukuřice se k nám dostaly o tisíce let později.",
  },
  {
    q: "Které zvíře chovali první zemědělci na Blízkém východě?",
    key: "ovci",
    d: [
      ["koně", "Koně lidé v době kamenné hlavně lovili. Chovat se začali až později, první zemědělci je nechovali."],
      ["slepici", "Slepice pochází z jihovýchodní Asie. Na Blízký východ a do Evropy se dostala až o mnoho tisíc let později."],
      ["lamu", "Lama žije v Jižní Americe. Na Blízkém východě ji nikdo neznal."],
    ],
    h: [
      "Hledej zvíře, které žilo divoce v horách Blízkého východu a dalo se snadno pást ve stádu.",
      "Ptej se u každého zvířete, kde žili jeho divocí předkové a kdy ho lidé ochočili. Zvířata z jiného světadílu nebo ochočená až v době kovů vyřaď.",
    ],
    e: "Ovce patří k nejstarším hospodářským zvířatům. Divoké ovce žily v horách Blízkého východu a první zemědělci je chovali ve stádech. Koně se začali chovat později, slepice přišly z Asie a lamy žijí v Jižní Americe.",
  },
  {
    q: "Které velké zvíře chovali první zemědělci na našem území kvůli masu?",
    key: "tura",
    d: [
      ["koně", "Koně první zemědělci na našem území nechovali. Chovat se začali až později."],
      ["soba", "Soby lovili lovci v době ledové. Ta skončila dávno před příchodem zemědělců."],
      ["velblouda", "Velbloud žije v pouštích Asie a Afriky. V pravěku se u nás nechoval."],
    ],
    h: [
      "Hledej velké zvíře, které se pase na louce a které se ve stádech chová i dnes. Ověř, jestli ho znali už první zemědělci.",
      "Vyřaď zvíře, které žije jen v poušti, zvíře, které lovili lovci doby ledové, a zvíře, které se začalo chovat až v době kovů. Zbude zvíře, jehož divoký předek žil v lesích Evropy i Asie.",
    ],
    e: "Tur domácí (skot) patřil k hlavním zvířatům prvních zemědělců. Dával maso a kůži. Soby lovili lovci doby ledové, velbloud k nám nepatří a koně se chovali až později.",
  },
  {
    q: "Který nový nástroj pomáhal lidem v neolitu kácet stromy?",
    key: "broušená kamenná sekera",
    d: [
      ["bronzová sekera", "Bronz lidé uměli vyrobit až v době bronzové, po skončení doby kamenné."],
      ["železná pila", "Železo se zpracovávalo až v době železné, tisíce let po neolitu."],
      ["pěstní klín ze štípaného kamene", "Pěstní klín je prastarý nástroj lovců a sběračů. Nový nebyl a na kácení stromů se nehodil."],
    ],
    h: [
      "Neolit je mladší doba kamenná, kdy lidé ještě nepoužívali kovové nástroje. Z jakého materiálu tedy mohl nový nástroj být?",
      "Neolitičtí lidé kovové nástroje ještě neměli, takže kovové možnosti vyřaď. Mezi kamennými rozhodni, který je prastarý a který se rozšířil až v mladší době kamenné.",
    ],
    e: "V neolitu se rozšířily broušené kamenné nástroje. Broušená sekera byla pevná a ostrá, takže se jí daly kácet stromy na pole a domy. Pěstní klín je o statisíce let starší, bronz a železo přišly až po době kamenné.",
  },
  {
    q: "Čím sklízeli neolitičtí zemědělci obilí?",
    key: "srpem s pazourkovými čepelkami",
    d: [
      ["kosou se železnou čepelí", "Železo i kosa přišly až tisíce let po neolitu."],
      ["srpem s bronzovou čepelí", "Srp ano, ale bronz neolitičtí lidé ještě neznali."],
      ["harpunou s kostěným hrotem", "Harpunou lovili lovci ryby. Obilí se jí sklízet nedá."],
    ],
    h: [
      "Zeptej se u každého nástroje, jestli ho lidé v době kamenné uměli vyrobit, a pak, jestli se jím dá obilí sklízet.",
      "Neolitičtí lidé kovové nástroje ještě neměli. Hledej nástroj na řezání stébel, jehož ostří je z kamene, a vyřaď nástroje k lovu. Stébla se řežou, ne probodávají.",
    ],
    e: "Neolitický srp byl ze dřeva nebo z parohu a byly do něj vsazené ostré pazourkové čepelky. Kovové srpy a kosy přišly až v dobách kovů a harpuna sloužila k lovu ryb.",
  },
  {
    q: "Z čeho stavěli první zemědělci dlouhé domy?",
    key: "z dřevěných kůlů a proutí omazaného hlínou",
    d: [
      ["z kůží natažených na mamutích klech", "Obydlí z mamutích kostí a kůží stavěli lovci v době ledové. Zemědělci mamuty už nepotkali."],
      ["z tesaných kamenných kvádrů spojených maltou", "Stavby z tesaného kamene s maltou stavěly až starověké říše."],
      ["z větví opřených o stěnu jeskyně", "Přístřešky u jeskyní stavěli lovci a sběrači, kteří se často stěhovali."],
    ],
    h: [
      "Dlouhý dům stál na jednom místě mnoho let. Jaký materiál měli zemědělci po ruce v lese a na poli?",
      "Vyřaď obydlí lovců, kteří se stěhovali, i stavby, které se uměly stavět až o tisíce let později. Zemědělci stavěli z toho, co získali v okolí vesnice, a bez kovových nástrojů.",
    ],
    e: "Neolitické dlouhé domy měly kostru z dřevěných kůlů. Stěny byly z proutí omazaného hlínou (mazanice) a střecha z rákosu nebo slámy. V jednom domě bydlela velká rodina.",
  },
  {
    q: "K čemu sloužily neolitickým zemědělcům hliněné nádoby?",
    key: "k uchování zásob obilí",
    d: [
      ["k odlévání bronzových nástrojů", "Bronz se začal odlévat až v době bronzové, po skončení doby kamenné."],
      ["k přenášení ohně při kočování", "Zemědělci nekočovali, zůstávali u svých polí. Ve střední Evropě se keramika rozšířila spolu s usedlým zemědělstvím."],
      ["k ražení prvních mincí", "Mince vznikly až ve starověku, tisíce let po neolitu."],
    ],
    h: [
      "Představ si rok zemědělce od jedné sklizně do druhé. K čemu by mu pevná nádoba s víkem byla nejvíc potřeba?",
      "Vyřaď činnosti z doby kovů a činnosti kočovných lovců. Neolitický zemědělec žil na jednom místě a musel ochránit úrodu před vlhkem a myšmi.",
    ],
    e: "Hliněné nádoby (keramika) se v Evropě rozšířily spolu s usedlým zemědělstvím. Chránily obilí a další zásoby před vlhkem a hlodavci a dalo se v nich i vařit. Bronz a mince přišly až o tisíce let později.",
  },
  {
    q: "Kdy přišli první zemědělci na naše území?",
    key: "kolem roku 5500 př. n. l.",
    d: [
      ["kolem roku 55 000 př. n. l.", "Tak dávno žili na našem území jen lovci a sběrači doby ledové."],
      ["kolem roku 550 př. n. l.", "Kolem roku 550 př. n. l. už byla u nás doba železná. Zemědělství bylo tehdy už tisíce let staré."],
      ["kolem roku 1500 n. l.", "To je konec středověku. Zemědělství je u nás o tisíce let starší."],
    ],
    h: [
      "Zemědělství vzniklo na Blízkém východě a do střední Evropy se šířilo několik tisíc let. Který letopočet leží ještě v době kamenné, ale už po době ledové?",
      "Seřaď si nabízené letopočty podle stáří. Vyřaď ten z doby ledové, kdy u nás žili jen lovci, i ty z doby kovů a z konce středověku. Pozor na počet nul a na to, jestli jde o rok před naším letopočtem, nebo našeho letopočtu.",
    ],
    e: "První zemědělci přišli na naše území kolem roku 5500 př. n. l. z Podunají. Archeologové jim podle zdobení nádob říkají lid s lineární keramikou. Doba ledová skončila dávno předtím, doba železná a středověk přišly o tisíce let později.",
  },
  {
    q: "Kdy lidé na Blízkém východě poprvé začali pěstovat obilí?",
    key: "asi před 11 000 lety",
    d: [
      ["asi před 100 000 lety", "Tak dávno žili všichni lidé jako lovci a sběrači. Zemědělství přišlo mnohem později."],
      ["asi před 3 000 lety", "Před 3 000 lety už lidé znali kovy a na Blízkém východě stály starověké říše."],
      ["asi před 1 000 lety", "Před 1 000 lety byl středověk. Zemědělství je mnohem starší."],
    ],
    h: [
      "Zemědělství přišlo až po skončení poslední doby ledové, ale dávno předtím, než lidé poznali kovy. Kterou z možností to splňuje?",
      "Poslední doba ledová skončila zhruba dvanáct tisíc let zpátky a kovy se objevily až mnohem později. Hledej údaj, který leží mezi těmito mezníky, a vyřaď ten, který spadá do středověku.",
    ],
    e: "Nejstarší doklady pěstování obilí v Úrodném půlměsíci jsou staré více než 10 000 let. Před 100 000 lety žili jen lovci a sběrači, před 3 000 lety už lidé znali kovy a před 1 000 lety byl středověk.",
  },
  {
    q: "Jak se nazývá přechod lidí od lovu a sběru k pěstování plodin a chovu zvířat?",
    key: "neolitická revoluce",
    d: [
      ["průmyslová revoluce", "Průmyslová revoluce přinesla stroje a továrny až v novověku."],
      ["hominizace", "Hominizace je vývoj člověka z dávných předků, ne přechod k zemědělství."],
      ["stěhování národů", "Stěhování národů proběhlo na konci starověku, dávno po vzniku zemědělství."],
    ],
    h: [
      "Název obsahuje jméno doby, ve které se to stalo. Ve které části pravěku se lidé naučili pěstovat a chovat?",
      "Urči nejdřív, ve které části doby kamenné lidé začali pěstovat plodiny. Pak vyřaď pojmy, které patří do jiných dob, i pojem, který popisuje vývoj lidského těla.",
    ],
    e: "Přechodu k zemědělství se říká neolitická revoluce podle neolitu, mladší doby kamenné. Hominizace je vývoj člověka, stěhování národů patří na konec starověku a průmyslová revoluce do novověku.",
  },
];

// ── L2 — použití znaku na nález nebo situaci ─────────────────────────────
const L2: Polozka[] = [
  {
    q: "Archeologové našli v pravěké chatě kamennou zrnotěrku a zuhelnatělá zrna. O jaké činnosti nález svědčí?",
    key: "o pěstování a zpracování obilí",
    d: [
      ["o lovu velké zvěře na pastvinách", "Zrnotěrka ani zrna s lovem nesouvisejí. Po lovu by zůstaly kosti divokých zvířat a hroty zbraní."],
      ["o tavení a odlévání bronzu", "Po tavení bronzu zůstávají kousky kovu a hliněné formy. Zrnotěrka je kamenný nástroj na zrno."],
      ["o sběru lesních plodů při kočování", "Kočovní sběrači by těžkou kamennou zrnotěrku s sebou nenosili. Nález v chatě patří usedlým lidem."],
    ],
    h: [
      "Zrnotěrka je těžký plochý kámen, na kterém se něco drtí. Co asi lidé drtili, když vedle ní leží zrna?",
      "Ptej se, kdo by takový těžký nástroj potřeboval a kdo by ho nechal v chatě. Vyřaď činnosti lidí, kteří se stěhovali, i práci s kovem, kterou neolitičtí lidé ještě neznali.",
    ],
    e: "Zrnotěrka sloužila k drcení zrn na mouku nebo kaši. Spolu se zuhelnatělými zrny ukazuje, že lidé obilí pěstovali, sklízeli a zpracovávali. Takový nález patří usedlým zemědělcům neolitu.",
  },
  {
    q: "Archeologové našli v jámě u domu kosti ovcí a koz, ale žádné kosti divokých zvířat. Co z toho plyne?",
    key: "Lidé tato zvířata chovali a nelovili je.",
    d: [
      ["Lidé tato zvířata lovili v okolních lesích.", "Ovce a kozy nejsou lesní zvířata. Kdyby lidé lovili, našly by se i kosti jelenů nebo divokých prasat."],
      ["Lidé táhli za stády jako kočovní lovci.", "Kočovní lovci by neměli stálý dům s jámou na odpadky. Kosti leží u domu, kde lidé zůstávali."],
      ["Lidé tato zvířata zapřahali do železného pluhu.", "Železný pluh se objevil až o tisíce let později. Ovce ani kozy se navíc nezapřahají."],
    ],
    h: [
      "Všimni si, které kosti v jámě chybějí. Co by tam leželo, kdyby se lidé živili hlavně lovem?",
      "Porovnej, jak lidé získají maso z divokého zvířete a jak ze zvířete, které mají u domu. Vyřaď i možnosti, které odpovídají kočovnému životu nebo nástrojům z doby kovů.",
    ],
    e: "V jámě jsou jen kosti ovcí a koz, tedy zvířat, která první zemědělci chovali. Chybějí kosti jelenů a divokých prasat, takže lidé maso nezískávali lovem, ale z vlastního stáda.",
  },
  {
    q: "Čtyři skupiny lidí žijí různým způsobem. Která z nich už žije jako první zemědělci?",
    key: "Skupina bydlí u pole v domě z kůlů.",
    d: [
      ["Skupina kočuje za stády sobů.", "Za stády sobů kočovali lovci v době ledové. Zemědělec zůstává u svého pole."],
      ["Skupina přespává v jeskyni u ohně.", "Jeskyně byly úkrytem lovců a sběračů. Zemědělci si stavěli domy u polí."],
      ["Skupina loví ryby harpunou z parohu.", "Rybolov harpunou je typický pro lovce a sběrače střední doby kamenné. Zemědělce neprozrazuje."],
    ],
    h: [
      "Hledej znak, který lovci a sběrači mít nemohli. Co člověk potřebuje, když chce každý rok sklidit úrodu?",
      "Lovci a sběrači se stěhovali za potravou, zemědělci museli zůstat u toho, co zaseli. Vyřaď popisy, ve kterých se lidé stěhují nebo žijí jen z toho, co ulovili.",
    ],
    e: "Zemědělci zůstávali u pole, protože ho museli osít, hlídat a sklidit. Proto si stavěli pevné domy z kůlů. Kočování za soby, jeskyně i lov harpunou patří lovcům a sběračům.",
  },
  {
    q: "Archeologové našli zbytky lněné tkaniny a několik hliněných přeslenů. Které řemeslo tu lidé provozovali?",
    key: "předení a tkaní",
    d: [
      ["zpracování bronzu", "Bronz neolitičtí lidé ještě neznali a přeslen s kovem nesouvisí."],
      ["kování železa", "Železo se kovalo až v době železné. Lněná tkanina prozrazuje jiné řemeslo."],
      ["štípání pěstních klínů", "Pěstní klíny štípali lovci ve starší době kamenné. S tkaninou nesouvisejí."],
    ],
    h: [
      "Přeslen je hliněné kolečko na dřevěné tyčince, která se roztáčela. Co se s ní dalo dělat s vlákny lnu?",
      "Uvaž, jak se z rostliny stane oblečení a ke kterému kroku přeslen patří. Vyřaď práci s kovem, kterou neolitičtí lidé ještě neznali, i výrobu nástrojů lovců.",
    ],
    e: "Přeslen zatěžoval vřeteno, na kterém se ze lněných vláken spřádala nit. Z nití se pak na stavu tkala látka. Předení na vřetenu s přeslenem a tkaní lněných látek se rozšířily v neolitu spolu s pěstováním lnu.",
  },
  {
    q: "Archeologové našli srp s pazourkovými čepelkami. Do kterého období nález patří?",
    key: "do mladší doby kamenné (neolitu)",
    d: [
      ["do starší doby kamenné (paleolitu)", "V paleolitu lidé obilí nepěstovali, takže srp nepotřebovali."],
      ["do střední doby kamenné (mezolitu)", "V mezolitu žili ještě lovci a sběrači. Obilí se u nás začalo sklízet až později."],
      ["do doby bronzové", "Pazourkové čepelky jsou z kamene. V době bronzové se srpy odlévaly z kovu."],
    ],
    h: [
      "Srp je nástroj ke sklizni. Ve kterém období lidé poprvé sklízeli úrodu z vlastního pole?",
      "Urči dvě věci: z jakého materiálu je ostří a k jaké práci srp slouží. Materiál ti řekne, jestli jde o dobu kamennou, a práce ti řekne, o kterou její část.",
    ],
    e: "Srp s pazourkovými čepelkami je kamenný nástroj na sklizeň obilí. Obilí se začalo pěstovat až v neolitu, mladší době kamenné. Lovci paleolitu a mezolitu srp nepotřebovali a v době bronzové už byly srpy kovové.",
  },
  {
    q: "Archeologové našli hladce broušenou kamennou sekeru s otvorem pro topůrko. Do kterého období patří?",
    key: "do mladší doby kamenné (neolitu)",
    d: [
      ["do starší doby kamenné (paleolitu)", "V paleolitu se kamenné nástroje vyráběly hlavně štípáním. Broušené sekery se rozšířily až v neolitu."],
      ["do doby bronzové", "Sekera je z kamene. V době bronzové by byla z kovu."],
      ["do doby železné", "Doba železná přišla o tisíce let později a nástroje v ní byly železné."],
    ],
    h: [
      "Všimni si dvou věcí: z jakého materiálu je sekera a jak byl kámen opracovaný.",
      "Materiál rozhodne, jestli jde o dobu kamennou, nebo o dobu kovů. Způsob opracování kamene pak rozliší, jestli jde o lovce, nebo o pozdější lidi, kteří už káceli les na pole.",
    ],
    e: "Broušené kamenné sekery s otvorem pro topůrko jsou typické pro neolit, mladší dobu kamennou. Starší lovci vyráběli kamenné nástroje hlavně štípáním. Sekera je kamenná, takže nepatří do doby bronzové ani železné.",
  },
  {
    q: "Archeologové našli pod podlahou domu velkou hliněnou nádobu se zbytky obilí. Co nález prozrazuje o způsobu života?",
    key: "Lidé žili usedle a dělali si zásoby.",
    d: [
      ["Lidé kočovali a nosili jídlo s sebou.", "Velkou hliněnou nádobu by kočovníci nosit nemohli. Nádoba stojí v domě."],
      ["Lidé jedli jen to, co ten den ulovili.", "Kdo jí jen úlovek dne, nemá co ukládat. Obilí v nádobě bylo schované na později."],
      ["Lidé směňovali obilí za bronzové nástroje.", "Bronz v neolitu ještě nebyl. Nádoba navíc ukazuje uskladnění, ne obchod."],
    ],
    h: [
      "Velká hliněná nádoba je těžká a křehká. Kdo si ji mohl dovolit mít a proč v ní obilí leželo?",
      "Zeptej se, na jak dlouho lidé obilí do nádoby dávali a co to říká o tom, jestli se stěhovali. Vyřaď i možnost s kovem, který neolitičtí zemědělci ještě neměli.",
    ],
    e: "Obilí se sklízelo jednou za rok a muselo vydržet do další sklizně. Proto ho lidé ukládali do velkých hliněných nádob v domě. Velká nádoba plná obilí pod podlahou domu ukazuje na usedlé zemědělce.",
  },
  {
    q: "Archeologové odkryli několik dlouhých řad kůlových jam, které spolu tvoří dlouhý obdélník. Co tu kdysi stálo?",
    key: "dlouhý dům zemědělců",
    d: [
      ["stan lovců mamutů", "Stan lovců se nezakládal na silných kůlech zapuštěných do země. Lovci ho stěhovali."],
      ["chrám z kamenných kvádrů", "Po kamenném chrámu by zůstaly kameny a základy zdí, ne jámy po dřevěných kůlech."],
      ["keltské opevněné oppidum", "Oppidum je celé opevněné sídlo z doby železné, ne jedna dlouhá stavba."],
    ],
    h: [
      "Silné kůly zapuštěné do země nesly těžkou stavbu na mnoho let. Kdo takovou stavbu potřeboval a z jaké byla doby?",
      "Kůlové jámy prozrazují dřevěnou stavbu, která stála dlouho na jednom místě. Vyřaď obydlí, která se stěhovala, stavby z kamene i celá opevněná sídla z doby železné.",
    ],
    e: "Řady kůlových jam jsou typickou stopou neolitického dlouhého domu. Kůly nesly stěny i střechu a mezi stěnovými kůly bylo proutí omazané hlínou. Stan lovců nestál tak dlouho a chrám ani oppidum by nezanechaly jen obdélník kůlových jam.",
  },
  {
    q: "Skupina lidí se každou zimu stěhuje za stády sobů a nosí s sebou stany z kůží. Jak se živí?",
    key: "lovem zvěře a sběrem plodů",
    d: [
      ["pěstováním obilí na poli", "Kdo pěstuje obilí, nemůže se každou zimu stěhovat. Pole by zůstalo bez péče."],
      ["chovem ovcí a koz v ohradě", "Ohrada stojí na jednom místě. Tahle skupina ale nosí celé obydlí s sebou."],
      ["obchodem s bronzovými nástroji", "Bronz přišel až po době kamenné. Stěhování za soby patří lovcům doby ledové."],
    ],
    h: [
      "Všimni si, že skupina nosí obydlí s sebou. Mohla by se takto stěhovat, kdyby měla pole nebo ohradu?",
      "Způsob obživy prozrazuje, jestli lidé zůstávají na místě. Vyřaď všechno, co vyžaduje stálé místo, i to, co patří až do doby kovů.",
    ],
    e: "Kdo táhne za stády sobů a nosí stany z kůží, žije lovem a sběrem jako lovci doby ledové. Pole i ohrada by vyžadovaly zůstat na místě a bronz přišel až po době kamenné.",
  },
  {
    q: "Archeologové našli na jednom místě kosti jelenů, harpuny z parohu a štípané pazourky, ale žádné střepy nádob. Kdo tu žil?",
    key: "lovci a sběrači střední doby kamenné",
    d: [
      ["zemědělci pěstující obilí a chovající ovce", "Zemědělci by po sobě nechali střepy hliněných nádob, zrnotěrky a kosti domácích zvířat. Tady nic z toho není."],
      ["Keltové z doby železné", "Keltové používali železo a keramiku. Na místě nejsou střepy ani kov."],
      ["řemeslníci z doby bronzové", "V době bronzové by se našly kovové předměty a hliněné nádoby."],
    ],
    h: [
      "Všimni si, co na místě chybí. Které skupiny lidí by po sobě nechaly střepy hliněných nádob?",
      "Kosti divokých zvířat a harpuny svědčí o obživě, štípaný kámen o době. Vyřaď skupiny, které už měly keramiku, domácí zvířata nebo kov.",
    ],
    e: "Kosti jelenů a harpuny ukazují lov, štípané pazourky dobu kamennou a chybějící keramika ukazuje, že nejde o usedlé zemědělce. Takto žili lovci a sběrači mezolitu. Zemědělci, Keltové i lidé doby bronzové už používali hliněné nádoby.",
  },
  {
    q: "Archeologové našli v hrobě střepy nádob zdobené rytými čarami, broušenou sekeru a zrnotěrku. Kým byl pohřbený člověk?",
    key: "zemědělcem z mladší doby kamenné",
    d: [
      ["lovcem mamutů ze starší doby kamenné", "Lovci mamutů hliněné nádoby neměli a kámen na nástroje hlavně štípali."],
      ["keltským bojovníkem z doby železné", "Keltský bojovník by měl v hrobě železné zbraně, ne kamennou sekeru."],
      ["kovotepcem z doby bronzové", "Kovotepec by měl u sebe kovové předměty. Všechny věci v hrobě jsou z kamene a z hlíny."],
    ],
    h: [
      "Projdi předměty z hrobu jeden po druhém a u každého se zeptej, v jaké době a k jaké práci ho lidé používali.",
      "Keramika a zrnotěrka ukazují způsob obživy, broušená sekera ukazuje dobu. Vyřaď lidi, kteří kámen na nástroje hlavně štípali, i lidi z doby kovů.",
    ],
    e: "Keramika zdobená rytými čarami, broušená sekera a zrnotěrka jsou typické věci neolitických zemědělců. Na našem území jim archeologové říkají lid s lineární keramikou. Lovci mamutů hliněné nádoby neměli a v dobách kovů by v hrobě byl kov.",
  },
  {
    q: "Skupina lidí vyrábí z hlíny misky a hrnce a pak je vypaluje v ohni. Které řemeslo provozuje?",
    key: "hrnčířství",
    d: [
      ["kovářství", "Kovář pracuje s rozžhaveným kovem, ne s hlínou. Kovářství přišlo až v době kovů."],
      ["slévání bronzu", "Při slévání bronzu se kov taví a lije do formy. Misky z hlíny tak nevznikají."],
      ["štípání pazourku", "Štípáním pazourku vznikají kamenné nástroje, ne nádoby z hlíny."],
    ],
    h: [
      "Všimni si, z jakého materiálu skupina vyrábí a co z něj vzniká. Které řemeslo pracuje právě s tímto materiálem?",
      "Vyřaď řemesla, která pracují s kovem nebo s kamenem. Zbude řemeslo, které se v Evropě rozšířilo spolu s usedlým zemědělstvím a jehož výrobky archeologové nacházejí jako střepy.",
    ],
    e: "Výroba nádob z hlíny a jejich vypalování v ohni je hrnčířství. Ve střední Evropě se rozšířilo v neolitu, protože usedlí zemědělci potřebovali nádoby na zásoby a vaření. Kovářství a slévání bronzu pracují s kovem, štípání pazourku s kamenem.",
  },
  {
    q: "Archeologové zjistili, že kolem neolitické vesnice rychle ubylo stromů a přibylo obilí a trav. Co se v okolí dělo?",
    key: "Lidé káceli les a zakládali pole.",
    d: [
      ["Lesy vypálili lovci při honu na mamuty.", "Mamuti v neolitu už nežili. Obilí po honu samo nevyroste."],
      ["Krajinu zničila těžba železné rudy.", "Železo se těžilo až v době železné. Obilí na místě lesa ukazuje něco jiného."],
      ["Les zničila přirozená změna podnebí.", "Změna podnebí by nepůsobila rychle a jen kolem jedné vesnice. Obilí navíc samo od sebe nevyroste, musí ho někdo zasít."],
    ],
    h: [
      "Obilí samo od sebe na místě lesa nevyroste. Co museli lidé z vesnice udělat, aby tam mohlo růst?",
      "Hledej příčinu, která spojuje ubývání stromů s přibýváním obilí. Vyřaď vysvětlení se zvířaty, která už vyhynula, s těžbou kovu, kterou neolit neznal, i změnu, která by obilí nezasela.",
    ],
    e: "Zemědělci potřebovali volné místo na pole, a proto kolem vesnic káceli a vypalovali les. Tam, kde byl les, pak rostlo obilí. Změna podnebí by nepůsobila jen kolem jedné vesnice, mamuti v neolitu už nežili a železo se těžilo až o tisíce let později.",
  },
  {
    q: "Skupina lidí má na jednom místě domy, pole i ohradu se zvířaty a žije tam mnoho let. Které období tento způsob života přineslo?",
    key: "mladší doba kamenná (neolit)",
    d: [
      ["starší doba kamenná (paleolit)", "V paleolitu lidé žili lovem a sběrem a stěhovali se za zvěří."],
      ["střední doba kamenná (mezolit)", "V mezolitu lidé ještě lovili, rybařili a sbírali, pole ani stáda neměli."],
      ["doba železná", "V době železné lidé také měli pole a zvířata, ale tento způsob života vznikl o tisíce let dřív."],
    ],
    h: [
      "Otázka se ptá, kdy lidé takto žili POPRVÉ. Ve kterém období začali lidé zůstávat na jednom místě u polí?",
      "Vyřaď období, kdy lidé žili jen lovem a sběrem. Pozor i na pozdější období: tam lidé také měli pole, ale nebylo to poprvé. Hledej tedy nejstarší období, kdy už lidé měli pole.",
    ],
    e: "Stálé domy, pole a chov zvířat přinesl neolit, mladší doba kamenná. V paleolitu a mezolitu lidé lovili a sbírali. V době železné lidé žili podobně, ale zemědělství bylo tehdy už tisíce let staré.",
  },
  {
    q: "Archeologové našli ve vesnici kosti tura, ovce a prasete a vedle nich zbytky proutěné ohrady. Čím se lidé kromě pěstování obilí zabývali?",
    key: "chovem hospodářských zvířat",
    d: [
      ["lovem mamutů a sobů", "Mamuti a sobi v okolí neolitické vesnice nežili. Nalezené kosti patří jiným zvířatům."],
      ["chovem koní a slepic", "Koně a slepice první zemědělci nechovali. Kosti v nálezu jsou jiných zvířat."],
      ["rybolovem pomocí harpun", "Po rybolovu by zůstaly rybí kosti a harpuny. Tady jsou kosti velkých zvířat."],
    ],
    h: [
      "Všimni si, k čemu slouží ohrada. Proč by lidé stavěli ohradu, kdyby zvířata jen lovili?",
      "Ohrada a kosti zvířat, která žijí ve stádě u lidí, ukazují na jednu činnost. Vyřaď zvířata, která v neolitu u vesnice nežila nebo se začala chovat až později.",
    ],
    e: "Tur, ovce a prase patřily k hlavním zvířatům prvních zemědělců. Ohrada ukazuje, že je lidé drželi u vesnice a chovali. Mamuti a sobi tu nežili, koně a slepice se začali chovat později a po rybolovu by zbyly rybí kosti.",
  },
];

// ── L3 — řetězce příčin a důsledků ───────────────────────────────────────
const L3: Polozka[] = [
  {
    q: "Proč se s pěstováním obilí ve střední Evropě rozšířily velké hliněné nádoby?",
    key: "Protože zrno muselo vydržet celý rok do další sklizně.",
    d: [
      ["Protože bez hliněných nádob nešlo obilí vůbec zasít.", "K setí nádoby potřeba nejsou. Zemědělci je potřebovali na zásoby, které musely vydržet do další sklizně."],
      ["Protože v nich zemědělci nosili vodu na zalévání polí.", "Pole ve střední Evropě zaléval déšť. Velké nádoby sloužily hlavně k uložení úrody."],
      ["Protože usedlí lidé přestali jíst maso a vařili jen kaši.", "Zemědělci maso jedli dál, chovali zvířata a někdy i lovili. Hlavní potřebou bylo uchovat úrodu."],
    ],
    h: [
      "Představ si zemědělce po sklizni. Jak dlouho musí úroda vydržet a co jí hrozí, když leží volně?",
      "Nádoba řeší nějakou potřebu. Zeptej se, kolikrát do roka zemědělec sklízí a kolikrát jí. Pak ověř, jestli ostatní důvody opravdu sedí na práci zemědělce ve střední Evropě.",
    ],
    e: "Obilí se sklízelo jednou za rok, ale jíst se muselo celý rok. Úrodu bylo nutné ochránit před vlhkem a myšmi, a proto se ve střední Evropě spolu s usedlým zemědělstvím rozšířily pevné hliněné nádoby. Samotnou keramiku ale znali už někteří lovci a sběrači, hlavně ve východní Asii.",
  },
  {
    q: "Zemědělci vypěstovali víc obilí, než sami snědli. Co jim to umožnilo?",
    key: "Někteří lidé mohli víc času věnovat řemeslu a výměně zboží.",
    d: [
      ["Hned mohla vzniknout první města s králi, úředníky a vojáky.", "Přeskočil jsi mezikroky. Města a králové přišli až o tisíce let později, nejdřív se rozvíjela řemesla a výměna zboží."],
      ["Všichni lidé mohli až do příští sklizně přestat pracovat na poli.", "Pole se muselo znovu osít a o zvířata se starat. Přebytek dal víc času jen některým lidem."],
      ["Lidé mohli přestat chovat zvířata a živit se jen uloženým obilím.", "Přebytek obilí chov nenahradil. Zvířata dávala maso a kůži, které obilí nedá."],
    ],
    h: [
      "Když jídla zbývá, nemusí na poli pořád pracovat úplně všichni. Co mohou dělat ostatní?",
      "Hledej nejbližší důsledek, ne ten, který přišel až po tisících let. Zvaž také, jestli přebytek z jedné sklizně opravdu uživí všechny lidi i bez práce a jestli nahradí maso a kůži.",
    ],
    e: "Přebytek obilí uživil i lidi, kteří zrovna na poli nepracovali. Ti mohli víc času věnovat hrnčířství, tkaní nebo výrobě nástrojů a přebytky vyměňovat se sousedy. Tak začínala dělba práce. Města a králové přišli až mnohem později.",
  },
  {
    q: "Proč se v neolitu začal rychleji zvyšovat počet lidí?",
    key: "Protože usedlé rodiny se zásobami mohly mít víc dětí.",
    d: [
      ["Protože se oteplilo a v lesích přibylo zvěře k lovu.", "Oteplení přišlo už před neolitem a lovem by se neuživilo tolik lidí. Rozhodla usedlost se zásobami."],
      ["Protože zemědělci byli zdravější a nikdy nehladověli.", "Zemědělci naopak často trpěli nemocemi a při neúrodě i hladem. Počet lidí rostl, protože rodiny měly víc dětí."],
      ["Protože v pevných domech lidé přestali umírat na nemoci.", "V hustě obydlených vesnicích se nemoci šířily spíš víc. Počet lidí rostl hlavně proto, že se rodilo víc dětí."],
    ],
    h: [
      "Zeptej se, co se v neolitu změnilo na tom, kde lidé bydleli a jak získávali jídlo. Co to znamenalo pro rodiny?",
      "Lovci se často stěhovali a malé děti museli nosit s sebou, a tak jich měli méně. Porovnej je s rodinou, která zůstává na místě a má zásoby. Pozor na možnosti, které zemědělcům připisují lepší zdraví.",
    ],
    e: "Zemědělci měli zásoby a nemuseli se stěhovat, a tak rodiny mohly mít víc dětí. Proto počet lidí rostl rychleji než v době lovců a sběračů, i když zemědělci často trpěli nemocemi a při neúrodě i hladem.",
  },
  {
    q: "Který z jevů NENÍ důsledkem toho, že se lidé usadili u svých polí?",
    key: "začátek pěstování obilí",
    d: [
      ["stavba pevných dlouhých domů", "Pevné domy jsou důsledkem usazení. Kdo zůstává na místě, staví si trvalé obydlí."],
      ["ukládání zásob do hliněných nádob", "Zásoby ve velkých nádobách jsou důsledkem usazení. Kočovník by je neunesl."],
      ["hromadění majetku a sporů o půdu", "Majetek a spory o půdu jsou důsledkem usazení. Půdu a zásoby lze vlastnit."],
    ],
    h: [
      "Otázka se ptá obráceně. U každé možnosti se zeptej, jestli ji usazení způsobilo, nebo jestli bylo naopak jeho důvodem.",
      "Důsledek přichází až PO usazení. Zkus u každé možnosti větu: Lidé se usadili u polí, a proto nastalo tohle. Kde věta nedává smysl, protože to muselo přijít dřív, našel jsi odpověď.",
    ],
    e: "Z usazení vyplývají pevné domy, zásoby v nádobách i hromadění majetku. Pěstování obilí ale důsledkem usazení není, je jeho příčinou: lidé zůstali na jednom místě právě proto, že museli pečovat o pole.",
  },
  {
    q: "Proč se po přechodu k zemědělství objevily spory o majetek?",
    key: "Protože pole, stáda a zásoby šlo hromadit.",
    d: [
      ["Protože zemědělci měli méně práce a víc volného času.", "Zemědělci měli práce spíš víc. A volný čas spory nevysvětluje, přít se dá jen o něco, co lze vlastnit."],
      ["Protože lovci a sběrači se nikdy o nic nedělili.", "Lovci a sběrači se naopak o úlovek dělili. Spory o majetek přišly, když bylo co hromadit."],
      ["Protože lidé začali vyrábět hliněné nádoby a sekery.", "Nástroje a nádoby měl skoro každý. Spory vznikaly o půdu, stáda a zásoby."],
    ],
    h: [
      "Zeptej se, co měl zemědělec, a lovec to neměl. O co se dá přít?",
      "Spor o majetek potřebuje něco, co jeden má a druhý chce, a co se dá schovat nebo nashromáždit. Porovnej, co si lovec mohl nechat a co zemědělec.",
    ],
    e: "Lovci toho moc nevlastnili, protože všechno nosili s sebou. Zemědělci měli pole, stáda a zásoby, které šlo hromadit. Některé rodiny měly víc než jiné, a tak vznikaly majetkové rozdíly a spory.",
  },
  {
    q: "Proč se přechodu k zemědělství říká revoluce, když trval tisíce let?",
    key: "Protože od základu změnil způsob života lidí.",
    d: [
      ["Protože ho vymyslel jeden vynálezce během jednoho roku.", "Zemědělství nevymyslel jeden člověk. Vznikalo postupně a šířilo se tisíce let."],
      ["Protože zemědělci svrhli vládu lovců a sběračů.", "Lovci a sběrači žádnou vládu neměli. Slovo revoluce tu neznamená boj o moc."],
      ["Protože začal nejdřív na území dnešních Čech.", "Zemědělství začalo na Blízkém východě. K nám dorazilo až o tisíce let později."],
    ],
    h: [
      "Slovo revoluce může znamenat rychlý převrat, ale i velkou změnu. Který význam sedí na změnu trvající tisíce let?",
      "Porovnej život lovce a život zemědělce: obživu, bydlení i majetek. Jak moc se liší? Pak zvaž, jestli zemědělství mohl vymyslet jeden člověk, jestli šlo o boj o moc a kde začalo.",
    ],
    e: "Neolitická revoluce nebyla rychlá. Revoluce se jí říká proto, že úplně změnila život lidí: z kočovných lovců se stali usedlí zemědělci se zásobami, domy a majetkem. Nevymyslel ji jeden člověk a začala na Blízkém východě.",
  },
  {
    q: "Proč neolitičtí zemědělci po několika letech zakládali nová pole o kus dál v lese?",
    key: "Protože úroda na starých polích po letech slábla.",
    d: [
      ["Protože dlouhé domy vydržely jen jednu zimu.", "Dlouhé domy stály i desítky let. Nová pole lidé zakládali, protože stará už tolik nerodila."],
      ["Protože zemědělci stále kočovali za divokou zvěří.", "Zemědělci byli usedlí a zvěř nebyla jejich hlavní obživou. Pole posouvali kvůli slábnoucí úrodě."],
      ["Protože se na starých polích zase rychle rozrostl les.", "Les se vrací až na pole, která lidé opustí. Tady zaměňuješ důsledek s příčinou."],
    ],
    h: [
      "Pole se obdělávalo rok co rok. Co se po letech mohlo stát s tím, kolik na něm vyrostlo?",
      "Uvaž, jak dlouho stály neolitické domy a jestli zemědělci ještě kočovali. Pak se zeptej, co přišlo dřív: odchod lidí z pole, nebo les na jeho místě.",
    ],
    e: "Pole se obdělávala rok co rok a úroda na nich po čase slábla. Lidé proto vykáceli kus lesa o něco dál a založili nová pole, někdy postavili i nové domy. Tak člověk začal krajinu trvale a výrazně přetvářet.",
  },
  {
    q: "Proč museli zemědělci na rozdíl od lovců zůstávat na jednom místě?",
    key: "Protože pole a stáda vyžadovaly péči po celý rok.",
    d: [
      ["Protože si nejdřív postavili domy a pak hledali pole.", "Pořadí je obrácené. Domy si lidé stavěli u polí, protože u nich museli zůstat."],
      ["Protože broušené kamenné sekery nešly přenášet.", "Sekeru člověk snadno unesl. Zemědělce drželo na místě pole a stádo."],
      ["Protože v okolí vymřela všechna divoká zvěř.", "Divoká zvěř nevymřela. Zemědělci někdy lovili dál, jen to nebyla hlavní obživa."],
    ],
    h: [
      "Projdi rok zemědělce: setí, hlídání pole, sklizeň, péče o zvířata. Co by se stalo, kdyby odešel?",
      "Najdi důvod, který vychází přímo z práce zemědělce. U ostatních ověř, jestli neotáčejí pořadí, jestli se nástroj opravdu nedal nosit a jestli zvěř skutečně zmizela.",
    ],
    e: "Pole se musí osít, chránit před zvěří a sklidit a zvířata potřebují pastvu a hlídání. To trvá celý rok, a proto zemědělec nemohl odejít. Usedlost je důsledkem zemědělství a domy jsou až důsledkem usedlosti.",
  },
  {
    q: "Co z toho, že se lidé usadili, plynulo pro jejich stavby?",
    key: "Začali stavět pevné domy z kůlů a mazanice.",
    d: [
      ["Začali stavět lehké stany, které se dají snadno přenést.", "Lehké přenosné stany potřebovali lovci, kteří se stěhovali. Usedlí lidé je nepotřebovali."],
      ["Začali stavět kruhové chýše z mamutích kostí.", "Chýše z mamutích kostí stavěli lovci mamutů v době ledové. Mamuti v neolitu už nežili."],
      ["Začali obehnávat vesnice vysokými kamennými hradbami.", "Kamenné hradby přišly až mnohem později. Neolitické vesnice chránily nanejvýš příkopy a dřevěné ploty."],
    ],
    h: [
      "Kdo neodchází, nemusí obydlí nosit s sebou. Co se mu pak vyplatí postavit?",
      "Hledej nejbližší důsledek usazení. U každé stavby zjisti, kdo ji stavěl a jestli ji bylo nutné stěhovat. Pozor na stavby lovců doby ledové i na stavby, které se objevily až o hodně později.",
    ],
    e: "Usedlí lidé už nemuseli obydlí nosit s sebou, a tak se vyplatilo postavit velký pevný dům z kůlů a mazanice. Stany a chýše z mamutích kostí patří lovcům, kamenné hradby až pozdějším dobám.",
  },
  {
    q: "Proč se v neolitu mohli někteří lidé víc věnovat řemeslu, například hrnčířství?",
    key: "Protože přebytky potravy uživily i ty, kdo zrovna nepracovali na poli.",
    d: [
      ["Protože hrnčířství bylo mnohem lehčí práce než péče o pole a o stáda.", "Lehkost práce nerozhoduje. Kdo nepěstuje, musí jídlo odněkud získat, a to umožnily až přebytky."],
      ["Protože lovci přinesli z lesa tolik masa, že pole už nebylo potřeba.", "Pole bylo potřeba dál, zemědělci žili hlavně z úrody. Čas na řemeslo daly přebytky z polí."],
      ["Protože řemeslníci vládli vesnici a ostatní museli pracovat na poli pro ně.", "V neolitických vesnicích nevládli řemeslníci ani králové. Řemeslu se lidé mohli věnovat díky přebytkům jídla."],
    ],
    h: [
      "Řemeslník celý den vyrábí a nepracuje na poli. Z čeho se tedy najedl?",
      "Nejdřív urči, co muselo být dřív: dost jídla, nebo řemeslníci. Pak ověř, jestli ostatní možnosti opravdu vysvětlují, odkud měl řemeslník jídlo.",
    ],
    e: "Když zemědělci vypěstovali víc, než potřebovali, mohli přebytkem uživit i lidi, kteří zrovna na poli nepracovali. Ti mohli víc času věnovat řemeslu a výrobky vyměňovat za jídlo. Tak začínala dělba práce. Hrnčířství a tkaní ale v neolitu zůstávaly hlavně prací v domácnosti.",
  },
  {
    q: "Vesnice měla víc obilí, než potřebovala, ale chyběl jí kvalitní pazourek. Co z toho mohlo plynout?",
    key: "výměna obilí se sousedy za pazourek",
    d: [
      ["odchod celé vesnice k ložisku pazourku", "Kvůli jedné surovině by vesnice neopustila pole a domy. Snazší bylo pazourek vyměnit."],
      ["přechod vesnice od pěstování obilí k lovu", "Přebytek obilí je výhoda, ne důvod se ho vzdát. Chybějící surovinu šlo získat výměnou."],
      ["výměna obilí za bronzové sekery", "Výměna ano, ale bronz v neolitu ještě nebyl."],
    ],
    h: [
      "Vesnice má něčeho moc a něčeho málo. Jak mohli lidé bez peněz získat, co jim chybí?",
      "Hledej nejbližší a nejsnazší řešení, které odpovídá neolitu. Zvaž, jestli by usedlí lidé kvůli jedné surovině opustili pole a jestli je přebytek obilí důvod pěstování vzdát.",
    ],
    e: "Přebytek obilí se dal vyměnit za suroviny, které vesnici chyběly, například za kvalitní pazourek. Tak vznikala výměna zboží mezi vesnicemi, dávno před penězi. Opustit kvůli tomu pole by se nevyplatilo a bronz přišel až o tisíce let později.",
  },
  {
    q: "Který jev NEVYPLÝVÁ z toho, že lidé začali mít zásoby jídla?",
    key: "ochočení ovcí a koz",
    d: [
      ["přežití zimy bez hladovění", "Přežití zimy ze zásob je přímý důsledek toho, že lidé měli uložené jídlo."],
      ["výroba nádob na uskladnění obilí", "Nádoby na obilí se rozšířily právě proto, že bylo co uskladnit."],
      ["rozdíly mezi bohatšími a chudšími rodinami", "Zásoby se daly hromadit, a tak některé rodiny měly víc než jiné."],
    ],
    h: [
      "Otázka se ptá obráceně. U každé možnosti se zeptej, jestli by bez zásob dávala smysl, nebo jestli ji zásoby umožnily.",
      "Zásoby musely nejdřív odněkud vzniknout. Najdi jev, který nepřišel až po zásobách, ale byl naopak jedním z důvodů, proč lidé vůbec měli co uložit.",
    ],
    e: "Ze zásob plyne přežití zimy, potřeba nádob i majetkové rozdíly. Ochočení ovcí a koz přišlo na začátku zemědělství a samo pomáhalo zásoby vytvářet. Není tedy důsledkem zásob, ale jednou z jejich příčin.",
  },
  {
    q: "Který z těchto jevů NENÍ důsledkem přechodu k zemědělství?",
    key: "ústup ledovců na konci doby ledové",
    d: [
      ["kácení lesů kvůli zakládání nových polí", "Kácení lesů je důsledek zemědělství. Pole potřebovala místo."],
      ["rychlejší růst počtu lidí ve vesnicích", "Růst počtu lidí je důsledek zemědělství. Usedlé rodiny se zásobami mohly mít víc dětí."],
      ["vznik stálých vesnic u polí a pastvin", "Stálé vesnice jsou důsledek zemědělství. Zemědělci museli zůstat u polí."],
    ],
    h: [
      "Otázka se ptá obráceně. Seřaď si v duchu, co bylo dřív a co přišlo až po zemědělství.",
      "Důsledek musí přijít až po zemědělství. Najdi jev, který přišel dřív a který zemědělství spíš umožnil, než aby z něj vyplynul.",
    ],
    e: "Kácení lesů, růst počtu lidí i stálé vesnice přišly až se zemědělstvím. Ústup ledovců na konci doby ledové proběhl dřív a díky oteplení mohlo zemědělství vzniknout. Je tedy spíš podmínkou než důsledkem.",
  },
  {
    q: "Který jev NENÍ důsledkem toho, že zemědělci vypěstovali přebytky?",
    key: "přechod lidí k usedlému životu",
    d: [
      ["výměna potravin se sousedy", "Výměna je důsledek přebytků. Co zbylo, dalo se vyměnit."],
      ["víc času na řemeslo pro některé lidi", "Čas na řemeslo je důsledek přebytků. Přebytek jídla uživil i ty, kdo zrovna nepracovali na poli."],
      ["hromadění majetku v některých rodinách", "Hromadění majetku je důsledek přebytků. Kdo měl víc, mohl si víc schovat."],
    ],
    h: [
      "Otázka se ptá obráceně. U každé možnosti se zeptej, jestli by vznikla i bez nadbytku jídla.",
      "Přebytek vzniká až na poli, o které se někdo stará. Najdi jev, který musel přijít dřív než přebytky a který byl spíš jejich předpokladem než důsledkem.",
    ],
    e: "Z přebytků plyne výměna zboží, čas na řemeslo i hromadění majetku. Lidé se ale usadili už kvůli péči o pole, dřív, než měli přebytky. Usedlost je tedy předpokladem přebytků, ne jejich důsledkem.",
  },
  {
    q: "Proč se v neolitu rozšířily broušené kamenné sekery?",
    key: "Protože na nová pole bylo nutné vykácet les.",
    d: [
      ["Protože se jimi dalo sklízet obilí rychleji než srpem.", "Obilí se sklízelo srpem s pazourkovými čepelkami. Sekera se hodila na dřevo."],
      ["Protože se jimi lovilo víc zvěře než dřív.", "Lov nebyl hlavní obživou zemědělců a sekera není lovecká zbraň. Sekery potřebovali na kácení."],
      ["Protože štípat kámen už v neolitu nikdo neuměl.", "Neolitičtí lidé kámen dál štípali, třeba na čepelky do srpů. Broušená sekera se ale lépe hodila na kácení."],
    ],
    h: [
      "Zeptej se, k jaké práci se sekera hodí a co zemědělci museli udělat, než mohli začít sít.",
      "Zemědělci museli nejdřív uvolnit místo pro pole a získat dřevo na domy. Který nástroj se hodí na tuhle práci? Pozor: drobné kamenné čepelky se v neolitu štípaly dál.",
    ],
    e: "Zemědělci potřebovali místo na pole a dřevo na domy. Proto museli kácet stromy a k tomu potřebovali pevnou broušenou sekeru. Rozšíření seker je tedy důsledkem zemědělství.",
  },
];

function gen(level: number): PracticeTask[] {
  const banka = level === 1 ? L1 : level === 2 ? L2 : L3;
  return banka.map(uloha);
}

// ── Topic ────────────────────────────────────────────────────────────────
export const NEOLITICKA_REVOLUCE: TopicMetadata[] = [
  {
    id: "g6-dej-neoliticka-revoluce-6",
    rvpNodeId: "g6-dejepis-pravek-vyvoj-cloveka-neoliticka-revoluce-zemedelstvi-chov-dobytka",
    displayName: "Neolitická revoluce",
    title: "Neolitická revoluce – zemědělství, chov dobytka",
    studentTitle: "Jak se z lovců stali zemědělci",
    subject: "dejepis",
    category: "Pravěk",
    topic: "Vývoj člověka",
    briefDescription: "Poznáš, jak zemědělství a chov zvířat změnily život pravěkých lidí.",
    keywords: [
      "neolit", "neolitická revoluce", "zemědělství", "chov dobytka", "mladší doba kamenná",
      "Úrodný půlměsíc", "keramika", "usedlost", "přebytky", "dlouhý dům", "broušená sekera",
    ],
    goals: [
      "Poznat znaky neolitu: plodiny, zvířata, nástroje, bydlení a dataci.",
      "Rozpoznat znaky neolitu v archeologickém nálezu nebo v popisu způsobu života.",
      "Vysvětlit řetězec příčin a důsledků: zemědělství, usedlost, zásoby, přebytky, dělba práce.",
    ],
    boundaries: [
      "Jen základní fakta, na kterých se shodují učebnice 6. ročníku.",
      "Datace jen přibližně (asi, kolem), bez přesných roků.",
      "Nezahrnuje podrobné dějiny jednotlivých neolitických kultur.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "U každé možnosti se zeptej, jestli ji lidé v mladší době kamenné už znali, a u příčin a důsledků si nejdřív urči, co bylo dřív.",
      steps: [
        "Vyřaď vše, co patří do doby kovů nebo pochází z Ameriky.",
        "Vyřaď vše, co patří kočovným lovcům a sběračům.",
        "U otázek Proč hledej nejbližší příčinu nebo důsledek, ne jev o tisíce let pozdější.",
      ],
      commonMistake: "Přisoudit neolitu kov, koně nebo brambory, nebo otočit pořadí příčiny a důsledku (třeba že přebytky byly dřív než pole).",
      example: "Zemědělství → lidé zůstávají u polí → dělají si zásoby → ve střední Evropě se s tím rozšiřují hliněné nádoby.",
    },
  },
];
