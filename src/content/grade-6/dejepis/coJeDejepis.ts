/**
 * Dějepis 6. ročník — Co je dějepis (význam studia minulosti), select_one.
 *
 * Rozšířeno 2026-09-11 (audit 6. ročníku): dřív čtyři úlohy na úroveň, teď
 * aspoň třináct, každá s vlastním zněním a vlastní malou nápovědou.
 * Chybový model beze změny — každý distraktor = jeden typický omyl: záměna
 * pojmů (dějiny × dějepis), historik „věští“ budoucnost, dějepis = příroda
 * nebo výmysl, „studujeme minulost, abychom ji změnili“.
 *  • L1 — definice pojmu (věda × události) a který čas dějepis zkoumá.
 *  • L2 — pojem použitý na popsanou situaci (událost → dějiny, práce s prameny → dějepis).
 *  • L3 — hraniční případy: co do práce historika nepatří, a proč minulost studovat.
 *
 * GIVEAWAY: v definičních otázkách se hledaný pojem nevyskytuje ve znění otázky.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pickN, buildChoiceTask as choice } from "./_shared";

const DEJINY = "Dějiny";
const DEJEPIS = "Dějepis";

// ── L1 ──────────────────────────────────────────────────────────────────────
const VEDA_DISTRAKTORY = [
  { value: DEJINY, why: "Dějiny jsou to, co se v minulosti SKUTEČNĚ STALO — samotné události. VĚDA, která je zkoumá, se jmenuje dějepis." },
  { value: "Zeměpis", why: "Zeměpis zkoumá Zemi, krajinu a státy v prostoru, ne minulost lidí. Vědě o minulosti říkáme dějepis." },
  { value: "Přírodopis", why: "Přírodopis zkoumá živou přírodu (rostliny, živočichy), ne lidskou minulost. Tu zkoumá dějepis." },
];
const VEDA_VYSVETLENI = "Dějepis je VĚDA (obor), která zkoumá lidskou minulost z pramenů. Dějiny naproti tomu jsou samotné události — to, co se skutečně stalo.";
const VEDA: [string, string, string][] = [
  ["Jak se jmenuje VĚDA (obor), která zkoumá lidskou minulost?", "Hledáš název školního OBORU / vědy, ne to, co se stalo.", "Je to věda, která pracuje s historickými prameny a zkoumá, jak žili lidé dřív."],
  ["Který školní obor zkoumá, jak žili lidé před stovkami let?", "Hledáš předmět, ve kterém se učíš o životě lidí v minulosti.", "Nejde o samotné události, ale o obor, který je poznává z pramenů — z kronik, listin a vykopávek."],
  ["Jak se jmenuje věda, která zkoumá minulost podle pramenů?", "S prameny pracuje historik. Jak se jmenuje jeho věda?", "Prameny jsou listiny, kroniky nebo vykopávky; věda, která z nich poznává minulost, je školní předmět, který znáš."],
  ["Který obor studuje historik?", "Historik je vědec. Jak se jmenuje obor, kterému se věnuje?", "Historik nezkoumá přírodu ani krajinu, ale minulost lidí; jeho obor se učí i ve škole."],
  ["Jak se jmenuje věda, jejímž předmětem jsou události minulosti?", "Události minulosti jsou jedno slovo, věda o nich je druhé. Které hledáš?", "Věda a její předmět jsou dvě různá slova; hledáš to, které označuje obor, ne samotné události."],
];
const UDALOST_DISTRAKTORY = [
  { value: DEJEPIS, why: "Dějepis je VĚDA, která minulost zkoumá. Samotné události, které se staly, se nazývají dějiny." },
  { value: "Báje", why: "Báje je smyšlený příběh (často o bozích a vzniku světa). To, co se opravdu stalo, jsou dějiny." },
  { value: "Budoucnost", why: "Budoucnost se teprve stane a neznáme ji. To, co už proběhlo, jsou dějiny." },
];
const UDALOST_VYSVETLENI = "Dějiny jsou souhrn všeho, co se v minulosti skutečně stalo (události samy). Dějepis je až VĚDA, která tyto dějiny zkoumá z pramenů.";
const UDALOST: [string, string, string][] = [
  ["Jak označujeme vše, co se v minulosti SKUTEČNĚ STALO (samotné události)?", "Nehledáš název vědy, ale označení pro samotné UDÁLOSTI, které proběhly.", "Je to souhrn toho, co se opravdu odehrálo — ne věda, která to zkoumá."],
  ["Jak se souhrnně nazývá všechno, co se stalo?", "Myslí se tu události samy, ne jejich zkoumání.", "Bitvy, objevy, vznik států — to všechno se stalo a dohromady to má jeden název; věda o tom má jiný."],
  ["Bitvy, objevy a stavby, které proběhly: jak se jim souhrnně říká?", "Bitva nebo objev se prostě stane. Jak se říká všemu, co se takhle stalo?", "Hledáš slovo pro události samotné; slovo pro vědu, která je zkoumá, je jiné."],
  ["Jak nazveš samotné události minulosti, ne vědu o nich?", "Zadání samo říká, že nechceš název vědy.", "Samotné události minulosti mají vlastní označení; obor, který je zkoumá, se jmenuje jinak."],
  ["Jak říkáme všemu, co už proběhlo v životě lidí?", "Co už proběhlo, je minulost lidí sama o sobě. Jak se jí říká?", "Nejde o školní předmět, ale o to, co se skutečně odehrálo — o události."],
];
const CAS_A = ["To, co už bylo a stalo se", "To, co se děje právě teď", "To, co teprve nastane", "Všechny tři doby najednou stejně"];
const CAS_B = ["Minulost — to, co už proběhlo", "Přítomnost — to, co se děje teď", "Budoucnost — to, co teprve nastane", "Žádnou, dějepis zkoumá jen přírodu"];

const L1: PracticeTask[] = [
  ...VEDA.map(([q, h0, h1]) => choice(q, DEJEPIS, VEDA_DISTRAKTORY, { hints: [h0, h1], explanation: VEDA_VYSVETLENI })),
  ...UDALOST.map(([q, h0, h1]) => choice(q, DEJINY, UDALOST_DISTRAKTORY, { hints: [h0, h1], explanation: UDALOST_VYSVETLENI })),
  choice("Doplň dvojici: „……… je věda, která zkoumá ……… (to, co se stalo).“", `${DEJEPIS} — dějiny`, [
    { value: "Dějiny — dějepis", why: "Prohodil jsi pojmy. VĚDA je dějepis; to, co se stalo, jsou dějiny. Správně: dějepis zkoumá dějiny." },
    { value: "Dějepis — dějepis", why: "Obě slova nemohou být stejná. Věda (dějepis) zkoumá něco jiného — dějiny (události)." },
    { value: "Dějiny — dějiny", why: "Obě slova nemohou být stejná. Hledá se dvojice věda + její předmět: dějepis zkoumá dějiny." },
  ], {
    hints: ["Na první místo patří VĚDA, na druhé to, co tato věda zkoumá.", "Věda a její předmět jsou dvě různá slova — nesmí být stejná."],
    explanation: "Dějepis (věda) zkoumá dějiny (události, které se staly). Jsou to dva různé pojmy: jeden je obor, druhý je jeho předmět zkoumání.",
  }),
  choice("Kterou dobu (čas) zkoumá dějepis?", CAS_A[0], [
    { value: CAS_A[1], why: "To, co probíhá právě teď, je přítomnost. Dějepis se ale dívá dozadu — zkoumá, co se už stalo." },
    { value: CAS_A[2], why: "To, co se teprve stane, je budoucnost a tu nikdo přesně nezná. Dějepis zkoumá minulost — co už proběhlo." },
    { value: CAS_A[3], why: "Dějepis se nezabývá vším stejně — soustředí se na to, co se už stalo (minulost), ne na teď a na budoucnost." },
  ], {
    hints: ["Historik se vždy dívá dozadu — k tomu, co je už za námi.", "Vyber dobu, kterou nelze změnit, protože už proběhla."],
    explanation: "Dějepis zkoumá minulost — to, co se už stalo a co už nelze změnit. Přítomnost (teď) a budoucnost (co teprve bude) předmětem dějepisu nejsou.",
  }),
  choice("Kterou dobu zkoumá dějepis — a kterou už ne?", CAS_B[0], [
    { value: CAS_B[1], why: "Co se děje teď, se jednou stane minulostí — zkoumat to jako dějiny ale jde až potom." },
    { value: CAS_B[2], why: "Budoucnost nikdo nezná a nelze ji zkoumat z pramenů." },
    { value: CAS_B[3], why: "Přírodu zkoumá přírodopis; dějepis zkoumá minulost lidí." },
  ], {
    hints: ["Z čeho historik zkoumá? Z pramenů — a ty zbyly jen po tom, co už je za námi.", "Prameny (kroniky, listiny, vykopávky) vznikly v době, která už skončila. Jiné doby dějepis z pramenů zkoumat nemůže."],
    explanation: "Dějepis zkoumá minulost, protože jen po ní zůstaly prameny. Přítomnost se minulostí teprve stane a budoucnost nikdo nezná.",
  }),
];

// ── L2 ──────────────────────────────────────────────────────────────────────
const UDALOST_MOZNOSTI = [
  { value: "Věda, která zkoumá minulost (dějepis)", why: "Tady se popisuje UDÁLOST, která proběhla — patří do dějin. Dějepis je až věda, která takové události zkoumá." },
  { value: "Předpověď, co se teprve stane", why: "Rok v zadání je dávno v minulosti — událost už proběhla. Není to předpověď budoucnosti." },
  { value: "Smyšlený příběh (báje)", why: "Tahle událost se opravdu stala, není to báje. Patří do dějin." },
];
const UDALOSTI: [string, string, string][] = [
  ["Bitva u Lipan se odehrála roku 1434. Čím je tato bitva?", "bitva u Lipan", "Bitva u Lipan"],
  ["Karlův most byl postaven ve 14. století. Čím je jeho stavba?", "stavba Karlova mostu", "Postavení Karlova mostu"],
  ["Karlova univerzita vznikla roku 1348. Čím je její založení?", "založení univerzity", "Založení Karlovy univerzity"],
  ["Poprava Jana Husa se odehrála roku 1415. Čím je tato událost?", "poprava Jana Husa", "Poprava Jana Husa"],
  ["Bitva na Bílé hoře se odehrála roku 1620. Čím je tato bitva?", "bitva na Bílé hoře", "Bitva na Bílé hoře"],
  ["Československo vzniklo roku 1918. Čím je jeho vznik?", "vznik Československa", "Vznik Československa"],
  ["Kolumbova plavba do Ameriky se odehrála roku 1492. Čím je tato plavba?", "Kolumbova plavba", "Kolumbova plavba do Ameriky"],
  ["Hrad Karlštejn byl postaven ve 14. století. Čím je jeho stavba?", "stavba Karlštejna", "Postavení Karlštejna"],
  ["Sametová revoluce se odehrála roku 1989. Čím je tato revoluce?", "sametová revoluce", "Sametová revoluce"],
];
const VYZKUM_MOZNOSTI = [
  { value: "Vytváří novou událost (dějiny)", why: "Žádnou událost nevytváří — zkoumá prameny o minulosti. To je práce historika, tedy dějepis." },
  { value: "Předpovídá, co se stane příští rok", why: "Nezkoumá budoucnost, ale minulost. Předpovídání není úkol dějepisu." },
  { value: "Zkoumá přírodu a počasí", why: "Prameny o životě lidí nejsou příroda ani počasí. Zkoumání minulosti lidí z pramenů je dějepis." },
];
const VYZKUMY: [string, string][] = [
  ["Paní učitelka zkoumá staré listiny, aby zjistila, jak žili lidé ve středověku. Co dělá?", "paní učitelka"],
  ["Archeolog zkoumá zbytky pravěkého sídliště. Co dělá?", "archeolog"],
  ["Badatelka v archivu čte prameny o třicetileté válce. Co dělá?", "badatelka v archivu"],
  ["Student zkoumá staré fotografie svého města, aby poznal jeho minulost. Co dělá?", "student"],
  ["Pan Novák zkoumá kroniku, aby zjistil, proč vypukla válka. Co dělá?", "pan Novák"],
  ["Paní Malá zkoumá zbytky středověké tvrze. Co dělá?", "paní Malá"],
];

const L2: PracticeTask[] = [
  ...UDALOSTI.map(([q, co, Co]) => choice(q, "Událost, která se stala (dějiny)", UDALOST_MOZNOSTI, {
    hints: [
      `Mluví se tu o tom, co se samo odehrálo (${co}), nebo o někom, kdo to dnes zkoumá?`,
      "To, co se v určitém roce odehrálo, je samo o sobě minulost; věda o minulosti přijde až potom, když to někdo zkoumá z pramenů.",
    ],
    explanation: `${Co} je konkrétní událost, která se v minulosti odehrála — patří tedy do dějin. Dějepis by byl až popis a zkoumání této události historikem.`,
  })),
  ...VYZKUMY.map(([q, kdo]) => choice(q, "Pracuje jako historik (dějepis)", VYZKUM_MOZNOSTI, {
    hints: [
      `Co přesně dělá ${kdo} — děje se tu něco samo, nebo někdo zkoumá prameny o minulosti?`,
      "Práce s prameny (listiny, kroniky, fotografie, vykopávky) s cílem poznat minulost je úkol vědy o minulosti — ne událost sama.",
    ],
    explanation: "Zkoumání pramenů s cílem zjistit, jak lidé dřív žili nebo proč se něco stalo, je práce historika — tedy dějepis (věda). Sama o sobě to není událost.",
  })),
  choice("Kterou z těchto věcí ZKOUMÁ historik?", "Jak žili lidé v minulosti", [
    { value: "Jaké bude zítra počasí", why: "Počasí na zítřek je budoucnost a patří meteorologii, ne dějepisu. Historik zkoumá minulost lidí." },
    { value: "Které číslo padne v loterii", why: "Náhodný výsledek v budoucnu nikdo nezkoumá. Historik se zabývá tím, co už se stalo." },
    { value: "Jak se rozmnožují rostliny", why: "Rozmnožování rostlin patří přírodopisu. Historik zkoumá minulost lidí, ne přírodní děje." },
  ], {
    hints: ["Historik se vždy dívá dozadu, do minulosti — ne do budoucna a ne na přírodu bez lidí.", "Vyber to, co se týká života LIDÍ v minulosti."],
    explanation: "Historik zkoumá minulost lidí — jak žili, mysleli a proč jednali. Počasí na zítřek (budoucnost) ani přírodní děje bez lidí do dějepisu nepatří.",
  }),
  choice("Hrad byl postaven ve 13. století. Archeolog dnes zkoumá jeho zbytky. Co je co?", "Stavba hradu = dějiny, zkoumání = dějepis", [
    { value: "Stavba hradu = dějepis, zkoumání = dějiny", why: "Prohodil jsi to. Postavení hradu je UDÁLOST (dějiny); jeho dnešní zkoumání je práce vědy (dějepis)." },
    { value: "Obojí jsou dějiny", why: "Dnešní zkoumání není událost z minulosti — je to práce historika, tedy dějepis. Dějiny jsou jen stavba hradu." },
    { value: "Obojí je dějepis", why: "Postavení hradu se stalo — to jsou dějiny (událost). Dějepis je až dnešní zkoumání jeho zbytků." },
  ], {
    hints: ["Co se v minulosti STALO, jsou dějiny; co dnes někdo ZKOUMÁ, je dějepis.", "Jedna část je dávná událost, druhá je dnešní práce s prameny."],
    explanation: "Postavení hradu ve 13. století je událost — patří do dějin. To, že ho dnes archeolog zkoumá, je práce vědy o minulosti — dějepis. Jsou to dvě různé věci.",
  }),
];

// ── L3 ──────────────────────────────────────────────────────────────────────
interface Hranice { q: string; ne: [string, string]; ano: [string, string][]; hints: [string, string]; explanation: string }
const HRANICE: Hranice[] = [
  {
    q: "Která z těchto věcí NEPATŘÍ do práce historika?", ne: ["Přesně předpovědět, co se stane příští rok", ""],
    ano: [["Zkoumat, jak lidé žili před tisíci lety", "To je přímo náplň dějepisu — poznávat minulost lidí."], ["Hledat příčiny, proč vypukla válka", "Hledat příčiny dávných událostí je úkol historika."], ["Číst staré kroniky a listiny", "Práce s písemnými prameny je základ dějepisu."]],
    hints: ["Tři z možností míří do minulosti, jedna do budoucnosti — ta je mimo dějepis.", "Historik umí vysvětlit, co se STALO; co teprve nastane, to s jistotou neví nikdo."],
    explanation: "Historik zkoumá MINULOST — prameny, příčiny, život lidí. Budoucnost přesně předpovědět nedokáže, proto tahle činnost do dějepisu nepatří.",
  },
  {
    q: "Která činnost NEPATŘÍ do práce historika v archivu?", ne: ["Zjišťovat, jaké bude zítra počasí", ""],
    ano: [["Číst listiny o založení města", "Čtení listin je v archivu hlavní práce historika."], ["Hledat v kronikách, jak se dřív obchodovalo", "Z kronik se historik dozví o obchodu v minulosti."], ["Porovnávat prameny o válce z různých let", "Porovnávání pramenů patří k práci historika."]],
    hints: ["V archivu se pracuje se starými písemnostmi. Která činnost s nimi vůbec nesouvisí?", "Archiv uchovává prameny o tom, co už se stalo; o zítřku v něm nic nenajdeš."],
    explanation: "V archivu historik čte a porovnává prameny o minulosti. Počasí na zítřek je budoucnost a do práce historika nepatří.",
  },
  {
    q: "Která činnost NEPATŘÍ do výzkumu historika, který píše knihu o středověku?", ne: ["Uhodnout čísla v příští loterii", ""],
    ano: [["Zkoumat, jak žili rytíři na hradech", "Život rytířů je téma středověkých dějin."], ["Hledat příčiny husitských válek", "Příčiny válek zkoumá historik."], ["Číst středověké kroniky", "Kroniky jsou pro historika důležitý pramen."]],
    hints: ["Kniha o středověku potřebuje fakta o minulosti. Která činnost s minulostí nemá nic společného?", "Náhodu v budoucnosti žádná věda o minulosti nezkoumá."],
    explanation: "Historik píšící o středověku zkoumá rytíře, války a kroniky. Loterie je náhoda v budoucnosti — to do dějepisu nepatří.",
  },
  {
    q: "Co historik NEzkoumá?", ne: ["Jak rostou rostliny na louce", ""],
    ano: [["Proč zanikla starověká říše", "Zánik říší je klasické téma dějepisu."], ["Jaké nástroje používali pravěcí lovci", "Nástroje dávných lidí zkoumá dějepis."], ["Jak žili lidé v době Karla IV.", "Život lidí v minulosti je jádro dějepisu."]],
    hints: ["Tři možnosti se týkají lidí v minulosti. Která se lidí vůbec netýká?", "Dějepis je věda o minulosti lidí; přírodní děje zkoumají jiné vědy, třeba přírodopis."],
    explanation: "Historik zkoumá minulost lidí. Růst rostlin je přírodní děj — zkoumá ho přírodopis, ne dějepis.",
  },
  {
    q: "Co z toho historik při své práci NEzkoumá?", ne: ["Příběh draka, který hlídal poklad", ""],
    ano: [["Listiny, které vydal král", "Listiny jsou písemné prameny."], ["Příčiny válek mezi státy", "Příčiny válek hledá historik."], ["Jak lidé dřív slavili svátky", "Každodenní život v minulosti zkoumá dějepis."]],
    hints: ["Historik staví na tom, co lze doložit. Co z nabídky je jen smyšlenka?", "Pohádkové bytosti se nikdy neodehrály, proto o nich nejsou žádné prameny."],
    explanation: "Historik zkoumá doloženou minulost: listiny, příčiny válek, život lidí. Drak je smyšlený — patří do pohádek a bájí.",
  },
  {
    q: "Čím se historik NEzabývá?", ne: ["Sopečnou činností na pusté planetě bez lidí", ""],
    ano: [["Tím, jak se ve městě dřív obchodovalo", "Každodenní život lidí v minulosti (obchod) je jádro dějepisu."], ["Tím, jaké nástroje používali dávní lovci", "Nástroje dávných lidí zkoumá dějepis i archeologie."], ["Tím, proč zanikla starověká říše", "Příčiny zániku říší jsou klasické téma dějepisu."]],
    hints: ["Dějepis je věda o minulosti LIDÍ — kde nejsou lidé, tam nemá co zkoumat.", "Vyber to, co se vůbec netýká lidí a jejich života."],
    explanation: "Dějepis zkoumá minulost LIDÍ. Přírodní jev na planetě bez lidí se lidské minulosti netýká, proto do dějepisu nepatří.",
  },
  {
    q: "Čím se historik při výzkumu pravěku NEzabývá?", ne: ["Dobrodružstvím vymyšleného hrdiny z filmu", ""],
    ano: [["Tím, jaké nástroje vyráběli lovci mamutů", "Nástroje pravěkých lidí zkoumá dějepis s archeologií."], ["Tím, jak žili první zemědělci", "Život prvních zemědělců je téma pravěku."], ["Tím, co prozrazují prameny z vykopávek", "Vykopávky jsou hlavní prameny k pravěku."]],
    hints: ["Pravěk poznáváme z vykopávek. Co z nabídky se nikdy doopravdy nestalo?", "Filmový hrdina je výmysl; historik se drží toho, co dokládají prameny."],
    explanation: "Historik zkoumá pravěk podle pramenů z vykopávek — nástroje, sídla, život lidí. Vymyšlený filmový hrdina do dějin nepatří.",
  },
];
const NE_WHY: Record<string, string> = {
  "Přesně předpovědět, co se stane příští rok": "",
};

const PROC: { q: string; key: string; d: [string, string][]; hints: [string, string]; explanation: string }[] = [
  {
    q: "Proč má smysl studovat minulost?", key: "Abychom se z ní poučili a lépe rozuměli dnešku",
    d: [["Abychom mohli změnit, co se kdysi stalo", "Minulost změnit NELZE — už se stala. Studujeme ji kvůli poučení a pochopení dneška."], ["Abychom přesně předpověděli, co nás čeká", "Z minulosti se poučíme, ale přesně předpovědět budoucnost neumíme."], ["Abychom se nemuseli učit nic nového", "Studium minulosti naopak rozšiřuje vědění."]],
    hints: ["Co se už stalo, nezměníme — tak k čemu nám poznání minulosti vlastně je?", "Mysli na poučení, na kořeny dneška a na pochopení, proč je svět takový, jaký je."],
    explanation: "Minulost už nelze změnit. Studujeme ji proto, abychom se poučili z chyb i úspěchů, poznali kořeny dneška a lépe rozuměli tomu, proč svět vypadá, jak vypadá.",
  },
  {
    q: "Proč je dobré studovat minulost i dnes?", key: "Abychom pochopili kořeny dnešního světa",
    d: [["Abychom mohli vrátit čas", "Čas vrátit nejde; minulost se dá jen poznat."], ["Abychom věděli, kdo vyhraje zítřejší zápas", "Budoucnost dějepis neodhalí."], ["Protože se od té doby nic nezměnilo", "Svět se naopak hodně změnil — a dějepis vysvětluje jak."]],
    hints: ["Z čeho dnešní svět vyrostl? Jazyk, města, státy — odkud se vzaly?", "Dnešní svět má svůj původ v minulosti; kdo ji zná, lépe rozumí tomu, proč je dnes všechno tak, jak je."],
    explanation: "Dnešní svět vyrostl z minulosti. Kdo ji studuje, chápe, odkud se vzaly dnešní státy, města i zvyky.",
  },
  {
    q: "Proč má smysl studovat minulost, když ji nemůžeme změnit?", key: "Aby se poučili z chyb i úspěchů předků",
    d: [["Aby ji nakonec přece jen změnili", "Minulost změnit nejde ani po studiu."], ["Aby nemuseli nic plánovat", "Poznání minulosti plánování neodstraní."], ["Protože je to jen zábava bez užitku", "Studium minulosti má užitek: poučení a pochopení."]],
    hints: ["Co ti dá, když víš, jak dopadla rozhodnutí lidí před tebou?", "Z úspěchů i omylů předků se dá odnést zkušenost, kterou není nutné platit vlastními chybami."],
    explanation: "Minulost změnit nemůžeme, ale můžeme se z ní poučit — z chyb i z úspěchů lidí, kteří žili před námi.",
  },
];

const L3: PracticeTask[] = [
  ...HRANICE.map((h) => choice(h.q, h.ne[0], h.ano.map(([value, why]) => ({ value, why: `${why} Tahle činnost do práce historika patří.` })), { hints: h.hints, explanation: h.explanation })),
  ...PROC.map((p) => choice(p.q, p.key, p.d.map(([value, why]) => ({ value, why })), { hints: p.hints, explanation: p.explanation })),
  choice("Které z toho je téma pro historika (skutečná minulost), a ne výmysl?", "Život rytířů na středověkém hradě doložený prameny", [
    { value: "Příběh draka, který hlídal poklad v jeskyni", why: "Drak je smyšlený — patří do bájí, ne do dějin. Historik zkoumá to, co je doložené prameny." },
    { value: "Dobrodružství vymyšleného hrdiny z filmu", why: "Vymyšlená filmová postava se nestala doopravdy. Dějepis se zabývá skutečnou, doloženou minulostí." },
    { value: "Co se podle pověsti stane na hradě za sto let", why: "To míří do budoucnosti a je to navíc pověst. Historik zkoumá doloženou minulost." },
  ], {
    hints: ["Historik staví na tom, co lze doložit prameny — ne na smyšlených příbězích.", "Vyber to, co se opravdu odehrálo a o čem máme doklady."],
    explanation: "Dějepis zkoumá skutečnou minulost doloženou prameny (např. život rytířů na hradě). Draci, vymyšlení hrdinové a pověsti o budoucnosti jsou fikce — do dějin nepatří.",
  }),
  choice("Které z toho zkoumá historik, a ne spisovatel pohádek?", "Jak žili lidé v pravěkých vesnicích", [
    { value: "Příběh o drakovi z pohádky", why: "Drak z pohádky je výmysl, nemá prameny." },
    { value: "Pověst o zlatém pokladu pod hradem", why: "Pověst není doložená událost." },
    { value: "Hrdina z vymyšleného filmu", why: "Filmová postava se doopravdy nestala." },
  ], {
    hints: ["Která možnost se opravdu stala a zůstaly po ní vykopávky?", "Spisovatel pohádek si příběh vymyslí; historik zkoumá, co dokládají prameny — třeba zbytky pravěkých domů."],
    explanation: "Život v pravěkých vesnicích dokládají vykopávky, proto ho zkoumá historik. Drak, pověst i filmový hrdina jsou výmysly.",
  }),
];
void NE_WHY;

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? L1 : level === 2 ? L2 : L3;
  return pickN(pool, pool.length);
}

// ── Topic ────────────────────────────────────────────────────────────────
export const CO_JE_DEJEPIS: TopicMetadata[] = [
  {
    id: "g6-dej-co-je-dejepis-6",
    rvpNodeId:
      "g6-dejepis-uvod-do-dejepisu-historie-a-historicke-prameny-co-je-dejepis-vyznam-studia-minulosti",
    displayName: "Co je dějepis",
    title: "Co je dějepis – význam studia minulosti",
    studentTitle: "Co je dějepis",
    subject: "dejepis",
    category: "Úvod do dějepisu",
    topic: "Historie a historické prameny",
    briefDescription: "Rozlišíš dějiny (co se stalo) od dějepisu (vědy) a proč minulost studujeme.",
    keywords: [
      "dějepis", "dějiny", "historik", "minulost", "význam studia minulosti",
      "věda o minulosti", "prameny", "poučení", "čas", "události",
    ],
    goals: [
      "Rozlišit dějiny (co se skutečně stalo) od dějepisu (vědy, která to zkoumá).",
      "Rozhodnout, čím se historik zabývá a čím ne (minulost lidí ano, budoucnost ne).",
      "Vysvětlit, proč studujeme minulost (poučení, pochopení dneška).",
    ],
    boundaries: [
      "Jen rozlišení pojmů dějiny/dějepis a náplně práce historika.",
      "Hranice vědy: budoucnost, příroda bez lidí a výmysl do dějepisu nepatří.",
      "Nezahrnuje konkrétní dějinné události zpaměti ani periodizaci.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 4,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Dějiny = co se v minulosti SKUTEČNĚ STALO (události). Dějepis = VĚDA, která tyto dějiny zkoumá z pramenů. Historik zkoumá minulost lidí — ne budoucnost, ne přírodu bez lidí, ne výmysly.",
      steps: [
        "Ptej se: jde o samotnou UDÁLOST (dějiny), nebo o ZKOUMÁNÍ minulosti (dějepis)?",
        "Historik se dívá do minulosti lidí — budoucnost ani počasí nezkoumá.",
        "Minulost studujeme kvůli poučení a pochopení dneška, ne abychom ji změnili.",
      ],
      commonMistake: "Zaměnit dějiny a dějepis (věda × události), nebo myslet, že historik předpovídá budoucnost.",
      example: "Bitva roku 1434 = dějiny (událost). Zkoumání starých listin = dějepis (věda).",
    },
  },
];
