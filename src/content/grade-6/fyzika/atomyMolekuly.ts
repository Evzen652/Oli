/**
 * Fyzika 6. ročník — Atomy a molekuly, úvod do mikrosvěta.
 *
 * Třetí téma okruhu „Látky a tělesa" a první téma podokruhu „Částicová stavba
 * látek". Navazuje na `skupenstviLatek.ts`: tam se skupenství popisovalo zvenku
 * (tvar, objem), tady se ptáme, proč se látka takhle chová — a odpověď je
 * v mezerách mezi částicemi.
 *
 * **Miskoncepce, na kterou téma cílí, je jedna jediná a je to ta klasická:**
 * žák si částici představuje jako malinký kousek téže látky. Molekula vody je
 * pak mokrá, atom mědi červenohnědý, atom železa tvrdý a atom rtuti kapalný.
 * Celá L3 je postavená na jejím rozbití: vlastnosti jako barva, tvrdost nebo
 * skupenství vznikají až ze spolupráce obrovského množství částic. Druhá půlka
 * téže miskoncepce zní „když se látka zahřeje, částice se zvětší" — i ta má
 * v L3 svoje úlohy.
 *
 * Gradace:
 *  • **L1 rozpoznání** — kolik atomů má molekula, když znám její složení.
 *    Čtení a sčítání, nejlehčí patro.
 *  • **L2 aplikace** — použij částicový model na běžný jev (stlačený vzduch,
 *    rozpuštěná sůl, nafouknutý balonek na váze).
 *  • **L3 přenos** — rozhodni, co z vlastností látky patří jedné částici.
 *    Tady intuice táhne ke špatné odpovědi, takže samotná znalost definice
 *    nestačí.
 *
 * ## Rozhodnutí, která stojí za vysvětlení
 *
 * **Banka otázek, ne jedna šablona.** L2 i L3 jsou pojmové: nejde je odvodit
 * z parametru, musely by se opakovat. `CONTENT_AUTHORING` na to má pravidlo
 * („faktická témata = banka otázek"), takže obě úrovně mají po dvanácti ručně
 * napsaných položkách včetně vlastních distraktorů.
 *
 * **Velké nápovědy nepřevyprávějí klíč, ale domýšlejí chybnou odpověď.**
 * „Kdyby drátu atomy přibyly, byl by po zahřátí těžší — a to se nestane."
 * Dělá to dvě věci naráz: je to skutečná strategie (ověř důsledek), a zároveň
 * to nepodléhá úniku, protože věta s klíčem nesdílí skoro žádné slovo.
 *
 * **Pohyb částic tu není.** Difúze i Brownův pohyb mají vlastní téma hned
 * za tímhle; zůstává tady jen stavba a rozestupy.
 *
 * **Pojmy „prvek" a „sloučenina" tu nejsou.** Patří do chemie 8. ročníku
 * a téma je bez nich úplné — atom a molekula na částicový model stačí.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pad } from "@/lib/czechGrammar";
import { pick, buildChoiceTask as task, ruzneUlohy } from "./_shared";

/**
 * Molekuly pro L1. `koho` je hotový druhý pád (vazba „molekula čeho"), protože
 * z prvního pádu se odvodit nedá — „oxid uhličitý" → „oxidu uhličitého".
 * `slozeni` je celá vedlejší věta včetně předložky, ať se skloňování nedostane
 * do šablony. Táž zásada jako `zLatky` v `latkaATeleso.ts`.
 *
 * `druhy` a `maxJednoho` nesou obě typické chyby: dítě spočítá druhy atomů
 * místo kusů, nebo jen tu početnější část složení.
 */
const MOLEKULY: {
  koho: string;
  slozeni: string;
  pocet: number;
  druhy: number;
  maxJednoho: number;
  /** Nejpočetnější část složení — kotví velkou nápovědu v téhle konkrétní molekule. */
  kotva: string;
}[] = [
  { koho: "vody", slozeni: "ze dvou atomů vodíku a jednoho atomu kyslíku", pocet: 3, druhy: 2, maxJednoho: 2, kotva: "dvou atomů vodíku" },
  { koho: "oxidu uhličitého", slozeni: "z jednoho atomu uhlíku a dvou atomů kyslíku", pocet: 3, druhy: 2, maxJednoho: 2, kotva: "dvou atomů kyslíku" },
  { koho: "kyslíku", slozeni: "ze dvou atomů kyslíku", pocet: 2, druhy: 1, maxJednoho: 2, kotva: "dvou atomů kyslíku" },
  { koho: "dusíku", slozeni: "ze dvou atomů dusíku", pocet: 2, druhy: 1, maxJednoho: 2, kotva: "dvou atomů dusíku" },
  { koho: "vodíku", slozeni: "ze dvou atomů vodíku", pocet: 2, druhy: 1, maxJednoho: 2, kotva: "dvou atomů vodíku" },
  { koho: "ozonu", slozeni: "ze tří atomů kyslíku", pocet: 3, druhy: 1, maxJednoho: 3, kotva: "tří atomů kyslíku" },
  { koho: "amoniaku", slozeni: "z jednoho atomu dusíku a tří atomů vodíku", pocet: 4, druhy: 2, maxJednoho: 3, kotva: "tří atomů vodíku" },
  { koho: "metanu", slozeni: "z jednoho atomu uhlíku a čtyř atomů vodíku", pocet: 5, druhy: 2, maxJednoho: 4, kotva: "čtyř atomů vodíku" },
  { koho: "chlorovodíku", slozeni: "z jednoho atomu vodíku a jednoho atomu chloru", pocet: 2, druhy: 2, maxJednoho: 1, kotva: "jednoho atomu chloru" },
  { koho: "oxidu siřičitého", slozeni: "z jednoho atomu síry a dvou atomů kyslíku", pocet: 3, druhy: 2, maxJednoho: 2, kotva: "dvou atomů kyslíku" },
  { koho: "peroxidu vodíku", slozeni: "ze dvou atomů vodíku a dvou atomů kyslíku", pocet: 4, druhy: 2, maxJednoho: 2, kotva: "dvou atomů kyslíku" },
  { koho: "sulfanu", slozeni: "ze dvou atomů vodíku a jednoho atomu síry", pocet: 3, druhy: 2, maxJednoho: 2, kotva: "dvou atomů vodíku" },
  { koho: "oxidu uhelnatého", slozeni: "z jednoho atomu uhlíku a jednoho atomu kyslíku", pocet: 2, druhy: 2, maxJednoho: 1, kotva: "jednoho atomu kyslíku" },
  { koho: "oxidu sírového", slozeni: "z jednoho atomu síry a tří atomů kyslíku", pocet: 4, druhy: 2, maxJednoho: 3, kotva: "tří atomů kyslíku" },
  { koho: "oxidu dusnatého", slozeni: "z jednoho atomu dusíku a jednoho atomu kyslíku", pocet: 2, druhy: 2, maxJednoho: 1, kotva: "jednoho atomu kyslíku" },
];

const KROKY_L1 = [
  "Rozděl složení na jednotlivé části.",
  "V každé části spočítej kusy atomů, ne druhy.",
  "Počty z obou částí sečti.",
];

// ── L1 — rozpoznání: kolik atomů má molekula ──────────────────────────────
function genL1(): PracticeTask {
  const m = pick(MOLEKULY);

  // Chybné počty = konkrétní typické chyby, ne náhodná čísla. Pořadí určuje
  // přednost: co je blíž skutečné chybě, nabídne se dřív.
  const kandidati = [
    { n: m.druhy, why: "To je počet druhů atomů v molekule, ne počet kusů. Od jednoho druhu jich v molekule může být víc." },
    { n: m.maxJednoho, why: "To je počet atomů jen jednoho druhu. Otázka se ptá na všechny atomy dohromady." },
    { n: m.pocet - 1, why: "Jeden atom ti při sčítání vypadl. Projdi složení po částech ještě jednou." },
    { n: m.pocet + 1, why: "Jeden atom máš navíc. Projdi složení po částech ještě jednou." },
    { n: m.pocet + 2, why: "Tolik atomů ve složení není. Sečti obě části znovu." },
    { n: m.pocet - 2, why: "Tolik atomů je málo. Sečti obě části znovu." },
  ];
  const videna = new Set([m.pocet]);
  const chybne: { value: string; why: string }[] = [];
  for (const k of kandidati) {
    if (chybne.length === 3) break;
    if (k.n < 1 || videna.has(k.n)) continue;
    videna.add(k.n);
    chybne.push({ value: pad(k.n, "ATOM"), why: k.why });
  }

  return task(
    `Molekula ${m.koho} je složená ${m.slozeni}. Kolik atomů dohromady obsahuje?`,
    pad(m.pocet, "ATOM"),
    chybne,
    {
      hints: [
        `Přečti složení molekuly ${m.koho} po částech a v každé části spočítej kusy, ne druhy.`,
        `Ve složení molekuly ${m.koho} stojí „${m.kotva}“ — číslovka na začátku říká počet kusů, ne počet druhů. Přečti takhle i zbytek složení a všechny počty sečti dohromady.`,
      ],
      solutionSteps: KROKY_L1,
      explanation: `Molekula ${m.koho} je složená ${m.slozeni}, dohromady tedy ${pad(m.pocet, "ATOM")}. Atom je nejmenší částice látky, molekula je skupina atomů spojených dohromady.`,
    },
  );
}

/** Položka banky: hotová úloha včetně vlastních distraktorů a nápověd. */
interface Polozka {
  otazka: string;
  klic: string;
  chybne: { value: string; why: string }[];
  h0: string;
  h1: string;
  vysvetleni: string;
}

/**
 * L2 — částicový model na běžném jevu.
 *
 * Možnosti jsou v každé položce schválně srovnané do podobné délky. Delší klíč
 * mezi krátkými distraktory se dá trefit, aniž by dítě o částicích cokoli
 * vědělo (`check:length`, Wave B).
 */
const JEVY: Polozka[] = [
  {
    otazka: "Vzduch v pumpičce na kolo jde stlačit do menšího objemu. Čím to je?",
    klic: "Mezi částicemi vzduchu jsou mezery a ty se zmenší.",
    chybne: [
      { value: "Částice vzduchu se stlačením samy zmenší.", why: "Částice si velikost drží. Stlačit jde jen prostor mezi nimi." },
      { value: "Část vzduchu se z pumpičky stlačením ztratí.", why: "Vzduch nikam nemizí, částic je v pumpičce pořád stejně." },
      { value: "Vzduch se ve stlačené pumpičce změní v kapalinu.", why: "Na to je potřeba mnohem větší tlak a chlazení, v pumpičce se to neděje." },
    ],
    h0: "Co v pumpičce ubere místo — samotné částice, nebo prostor mezi nimi?",
    h1: "Domysli druhou možnost: kdyby šly zmáčknout samotné částice, dala by se stejně snadno stlačit i voda nebo železo. To se ale nestane.",
    vysvetleni: "Plyn jde stlačit proto, že jsou jeho částice daleko od sebe. Stlačením se zmenší mezery, ne částice.",
  },
  {
    otazka: "Do sklenice vody nasypeš lžíci soli. Hladina nestoupne o celý objem soli. Proč?",
    klic: "Částice soli se vejdou do mezer mezi částicemi vody.",
    chybne: [
      { value: "Část soli se při míchání v roztoku ztratí.", why: "Nic nemizí. Že je sůl pořád ve sklenici, poznáš po chuti." },
      { value: "Částice soli se ve vodě zmenší na polovinu.", why: "Částice si velikost drží, jen se rozptýlí mezi částice vody." },
      { value: "Sůl se ve vodě promění na částice vody.", why: "Sůl zůstává solí, jinak by roztok nebyl slaný." },
    ],
    h0: "Voda vypadá, že je beze zbytku plná. Platí to i v pohledu na částice?",
    h1: "Kdyby ve vodě žádné volné místo nebylo, musela by hladina stoupnout přesně o objem nasypané soli. Stačí to změřit a uvidíš, že nestoupne.",
    vysvetleni: "Mezery mezi částicemi má i kapalina, jen menší než plyn. Rozpuštěná sůl se do nich vejde, proto hladina nestoupne tak, jak bys čekal.",
  },
  {
    otazka: "Co je mezi jednotlivými částicemi látky?",
    klic: "Nic, je tam prázdný prostor.",
    chybne: [
      { value: "Vzduch z okolní místnosti.", why: "Vzduch je sám složený z částic. Mezi nimi by muselo být zase něco dalšího." },
      { value: "Ještě menší částice látky.", why: "Menší částice než atom v téhle úvaze nevystupuje, atom je nejmenší stavební kámen." },
      { value: "Tenká vrstva téže látky.", why: "Kdyby tam látka byla, žádná mezera by to nebyla." },
    ],
    h0: "Zkus na svou odpověď použít tutéž otázku ještě jednou.",
    h1: "Kdyby mezi částicemi bylo něco hmotného, muselo by to být zase z částic — a mezi těmi by pak bylo co? Řetěz otázek by neměl konec.",
    vysvetleni: "Mezi částicemi látky je prázdný prostor. Právě proto jde plyn stlačit a proto se rozpuštěná látka vejde mezi částice rozpouštědla.",
  },
  {
    otazka: "Kousek zlata dělíš na čím dál menší části, které jsou pořád zlatem. Co je ta nejmenší?",
    klic: "Jeden atom zlata.",
    chybne: [
      { value: "Jedno zrnko zlatého prachu.", why: "I v zrnku prachu je obrovské množství atomů." },
      { value: "Nejmenší viditelný kousek.", why: "Okem uvidíš pořád ještě nepředstavitelně mnoho atomů." },
      { value: "Jedna kapka tekutého zlata.", why: "Kapka se dá dělit dál, dělení tam nekončí." },
    ],
    h0: "Dělení někde skončí. Kde přesně přestane být výsledek zlatem?",
    h1: "Okem ani lupou konec dělení nepoznáš, protože i v nejmenším viditelném kousku je stavebních kamenů obrovské množství. Hranice leží úplně jinde než hranice viditelnosti.",
    vysvetleni: "Dělení látky končí u atomu. Menší kousek už by nebyl zlatem, protože zlato tvoří právě atomy zlata.",
  },
  {
    otazka: "Led, voda i vodní pára jsou tatáž látka. Co mají společné?",
    klic: "Skládají se ze stejných molekul vody.",
    chybne: [
      { value: "Mají stejně uspořádané molekuly.", why: "Uspořádání se liší — právě v něm je rozdíl mezi ledem a párou." },
      { value: "Mají stejnou hustotu i objem.", why: "Hustota se liší natolik, že led na vodě plave." },
      { value: "Mají stejný počet molekul v litru.", why: "V litru páry je molekul mnohem méně než v litru vody." },
    ],
    h0: "Co se mezi ledem, vodou a párou mění a co naopak zůstává?",
    h1: "Vyzkoušej každou možnost zvlášť na ledu a na páře. Hustota, uspořádání i počet v litru vycházejí pokaždé jinak, takže společné být nemůžou.",
    vysvetleni: "Skupenství mění uspořádání a rozestupy částic, ne samotné částice. Led, voda i pára jsou z týchž molekul vody.",
  },
  {
    otazka: "Proč atom neuvidíš ani školním mikroskopem?",
    klic: "Je mnohem menší, než co světelný mikroskop ukáže.",
    chybne: [
      { value: "Je průhledný, takže se na něj nedá zaostřit.", why: "Problém není v průhlednosti, ale ve velikosti." },
      { value: "Pohybuje se tak rychle, že se v obraze rozmaže.", why: "I kdyby stál na místě, mikroskop ho neukáže." },
      { value: "Je vidět, ale jen v úplně zatemněné místnosti.", why: "Tma nepomůže. Atom je pod hranicí toho, co světlo ukáže." },
    ],
    h0: "Rozmysli, jestli je problém v tom, jaký atom je, nebo v tom, jak je velký.",
    h1: "Kdyby šlo o průhlednost nebo o rychlost, pomohlo by vzorek obarvit nebo zchladit. Ani jedno atom viditelným neudělá.",
    vysvetleni: "Atom je řádově desetimilionkrát menší než milimetr. Světelný mikroskop takhle malou věc ukázat nedokáže.",
  },
  {
    otazka: "Čím se liší atom a molekula?",
    klic: "Molekula je skupina spojených atomů.",
    chybne: [
      { value: "Molekula je menší část atomu.", why: "Je to naopak — molekula je z atomů složená." },
      { value: "Molekula je atom v kapalném stavu.", why: "Skupenství se týká celé látky, ne jedné částice." },
      { value: "Molekula je atom, který se pohybuje.", why: "Pohybují se obojí. Rozdíl je ve složení, ne v pohybu." },
    ],
    h0: "Které z těch dvou slov označuje něco, co je složené z toho druhého?",
    h1: "Zkus obě slova dosadit do věty „… se skládá z …“ v obou pořadích. Jen jedno z nich dává smysl, a to pořadí je odpověď.",
    vysvetleni: "Atom je nejmenší stavební kámen. Molekula je skupina dvou nebo více atomů, které drží pohromadě.",
  },
  {
    otazka: "Nafoukneš balonek a pověsíš ho na váhu. Je těžší než prázdný. Proč?",
    klic: "Přibylo v něm částic vzduchu a ty mají hmotnost.",
    chybne: [
      { value: "Napnutá guma balonku sama zvýší hmotnost.", why: "Guma se jen natáhne, žádná jí nepřibude." },
      { value: "Balonek při foukání nasál teplo, které váží.", why: "Teplo není látka a hmotnost balonku nezvýší." },
      { value: "Vzduch uvnitř je jiný než vzduch v místnosti.", why: "Je to týž vzduch, jen ho je v balonku víc." },
    ],
    h0: "Co do balonku přibylo ve chvíli, kdy jsi ho nafoukl?",
    h1: "Kdyby za přírůstek mohla napnutá guma nebo teplo, vážil by nafouknutý a pak vyfouknutý balonek pořád víc. Po vyfouknutí je ale zase lehčí.",
    vysvetleni: "Vzduch je látka a jeho částice mají hmotnost. Nafouknutím jich do balonku přibude, takže přibude i hmotnost.",
  },
  {
    otazka: "Proč se dá plyn stlačit mnohem snáz než kapalina?",
    klic: "Mezery mezi částicemi jsou v plynu mnohem větší.",
    chybne: [
      { value: "Částice plynu jsou měkčí než částice kapaliny.", why: "Částice nejsou měkké ani tvrdé. Rozhodují mezery mezi nimi." },
      { value: "Částic plynu je ve stejném objemu mnohem víc.", why: "Je jich naopak méně, a proto je mezi nimi tolik místa." },
      { value: "Plyn je lehčí, a proto se stlačuje snáz.", why: "Hmotnost s tím nesouvisí. Rozhodují mezery mezi částicemi." },
    ],
    h0: "Porovnej, jak daleko od sebe jsou částice v plynu a jak v kapalině.",
    h1: "Kdyby za stlačitelnost mohla měkkost částic, byla by v obou skupenstvích stejná — vždyť v kapalině i v plynu můžou být tytéž částice téže látky.",
    vysvetleni: "Stlačit jde prostor mezi částicemi, ne částice samotné. V plynu je toho prostoru mnohem víc než v kapalině.",
  },
  {
    otazka: "Kam se poděly částice cukru, když se cukr ve vodě rozpustil?",
    klic: "Rozptýlily se mezi částice vody a nezmizely.",
    chybne: [
      { value: "Změnily se na částice vody.", why: "Cukr zůstává cukrem, jinak by roztok nebyl sladký." },
      { value: "Rozpadly se na drobné kousky, až zmizely.", why: "Nic nezmizelo. Sladká chuť je důkaz, že cukr ve sklenici je." },
      { value: "Klesly ke dnu sklenice, jen je nevidíš.", why: "Pak by horní část roztoku sladká nebyla, a ona je." },
    ],
    h0: "Ochutnej roztok nahoře i dole. Co ti chuť říká o tom, kde cukr je?",
    h1: "Kdyby se cukr ztratil nebo změnil ve vodu, sladká chuť by nebyla vůbec. Kdyby klesl ke dnu, byla by sladká jen spodní část sklenice.",
    vysvetleni: "Rozpuštěním se částice cukru rozptýlí mezi částice vody. Žádná nezmizí, jen jsou tak malé a tak rozptýlené, že je nevidíš.",
  },
  {
    otazka: "Z čeho se skládá kapka vody?",
    klic: "Z obrovského množství molekul vody.",
    chybne: [
      { value: "Z jedné velké molekuly vody.", why: "V jediné kapce je molekul nepředstavitelně mnoho." },
      { value: "Ze spousty zmenšených kapiček.", why: "Dělení kapky končí u molekuly, ne u menší kapky." },
      { value: "Z vody, která už nejde dělit.", why: "Dělit jde dál, až na jednotlivé molekuly." },
    ],
    h0: "Kapku jde dělit na menší a menší. Čím to dělení nakonec skončí?",
    h1: "Menší kapka je pořád kapka, takže tam dělení neskončí. Konec je až u částice, kterou nejde rozdělit, aniž by přestala být tou látkou.",
    vysvetleni: "Kapka vody je obrovské množství molekul vody. Dělit ji jde až po jednu molekulu, dál už ne.",
  },
  {
    otazka: "Čím se od sebe liší molekula vody a molekula kyslíku?",
    klic: "Jsou složené z jiných druhů atomů.",
    chybne: [
      { value: "Liší se jen svou velikostí.", why: "Liší se hlavně druhem atomů, ne jen velikostí." },
      { value: "Molekula vody je mokrá, kyslíku ne.", why: "Mokrost popisuje velké množství vody, ne jednu molekulu." },
      { value: "Liší se jen tím, jak rychle letí.", why: "Rychlost se mění s teplotou u obou. Rozdíl je jinde." },
    ],
    h0: "Obě jsou molekuly. V čem se vlastně dvě molekuly můžou lišit?",
    h1: "Vlastnosti jako mokrost popisují velké množství látky, ne jednu molekulu, takže rozdíl mezi dvěma molekulami popsat nemůžou. Ptej se místo toho na to, co je uvnitř každé z nich.",
    vysvetleni: "Molekuly různých látek se liší tím, z jakých atomů a v jakém počtu jsou složené. Právě proto jsou z nich různé látky.",
  },
];

/**
 * L3 — co z vlastností látky patří jedné částici.
 *
 * Intuice tady táhne k chybné odpovědi, takže znalost definice nestačí.
 * Distraktory jsou postavené tak, aby nešlo vyloučit „to, co zní divně“:
 * u každé položky je jak varianta „ano, patří“, tak varianta „ne, ale opačně“.
 */
const MIKROSVET: Polozka[] = [
  {
    otazka: "Měděný drát se zahřátím prodlouží. Co se stalo s jeho atomy?",
    klic: "Zůstaly stejně velké, jen se od sebe vzdálily.",
    chybne: [
      { value: "Každý atom se zahřátím trochu zvětšil.", why: "Atom si velikost drží. Za roztažnost můžou větší rozestupy." },
      { value: "Atomů v drátu zahřátím přibylo.", why: "Počet atomů se nemění, drát nemá odkud nové atomy vzít." },
      { value: "Atomy se změnily na atomy jiné látky.", why: "Měď zůstává mědí, zahřátí druh atomu nemění." },
    ],
    h0: "Zahřátý drát je delší. Rozmysli, co přesně ten přírůstek délky tvoří.",
    h1: "Kdyby drátu přibyly atomy, byl by po zahřátí i těžší — a to se nestane. A kdyby se změnily na jinou látku, přestal by vést proud jako měď.",
    vysvetleni: "Zahřátím se zvětší rozestupy mezi atomy, ne atomy samotné. Proto se kov roztáhne, a přitom váží pořád stejně.",
  },
  {
    otazka: "Voda je mokrá. Platí to i o jedné jediné molekule vody?",
    klic: "Ne, mokro vzniká až u velkého množství molekul.",
    chybne: [
      { value: "Ano, každá molekula vody je mokrá.", why: "Vlastnost celé látky nepatří automaticky jedné částici." },
      { value: "Ano, ale jen pokud je molekula studená.", why: "Teplota s tím nesouvisí. Mokro jedné molekule nepatří vůbec." },
      { value: "Ne, protože jedna molekula vody je pevná.", why: "Ani pevná. Skupenství má smysl až u množství částic." },
    ],
    h0: "Zkus si pod slovem „mokrý“ představit, co se přesně při dotyku děje.",
    h1: "Mokro poznáš tím, že se ti kapalina rozlije po ruce a smáčí ji. K tomu je potřeba obrovské množství částic — jedna sama se rozlít nemá jak.",
    vysvetleni: "Mokro je vlastnost velkého množství vody, ne jedné molekuly. Vlastnosti látky vznikají až ze spolupráce mnoha částic.",
  },
  {
    otazka: "Měděný drát je červenohnědý. Jakou barvu má jeden atom mědi?",
    klic: "Barva jednomu atomu nepatří, vzniká až u množství.",
    chybne: [
      { value: "Také červenohnědou, jen mnohem slabší.", why: "Barva není vlastnost jedné částice, kterou by stačilo zesílit." },
      { value: "Bílou, protože atomy jsou samy o sobě bezbarvé.", why: "Bílá je taky barva. Atomu nepatří žádná." },
      { value: "Mění se podle toho, jak je drát zrovna teplý.", why: "Teplota barvu atomu nepřidělí, atom ji nemá." },
    ],
    h0: "Barva vzniká tím, jak látka zachází se světlem. Zvládne to jedna částice?",
    h1: "Barvu vidíš, až když se světlo odrazí od obrovského množství atomů uspořádaných vedle sebe. U jednoho atomu nemá „červenohnědá“ o co se opřít.",
    vysvetleni: "Barva je vlastnost látky, ne jednoho atomu. Vzniká až ze způsobu, jakým se světlo odráží od velkého množství atomů.",
  },
  {
    otazka: "Rtuť je při pokojové teplotě kapalná. Je kapalný i jeden atom rtuti?",
    klic: "Ne, skupenství má smysl až u množství částic.",
    chybne: [
      { value: "Ano, každý atom rtuti je sám o sobě kapalný.", why: "Skupenství popisuje, jak se chová mnoho částic vůči sobě." },
      { value: "Ano, protože rtuť nikdy netuhne v pevnou látku.", why: "Rtuť tuhne při −39 °C — a i tak by to o jednom atomu nic neřeklo." },
      { value: "Ne, jeden atom rtuti je vždycky pevná látka.", why: "Ani pevná. Jednomu atomu skupenství nepatří." },
    ],
    h0: "Skupenství popisuje, jak se látka chová. Pozná se to na jedné částici?",
    h1: "Kapalina se pozná podle toho, že přejímá tvar nádoby. To je popis toho, jak se mnoho částic chová vůči sobě — jedna částice nemá vůči komu tvar přejímat.",
    vysvetleni: "Skupenství vzniká z toho, jak jsou částice uspořádané a jak daleko od sebe jsou. U jedné jediné částice proto nedává smysl.",
  },
  {
    otazka: "Kapku vody rozdělíš na dvě menší. Jaké jsou molekuly v menší kapce?",
    klic: "Stejně velké jako předtím, jen je jich méně.",
    chybne: [
      { value: "Poloviční, protože kapka je poloviční.", why: "Dělí se kapka, ne molekuly v ní." },
      { value: "Stejně velké a je jich pořád stejně.", why: "Počet se rozdělil mezi obě menší kapky." },
      { value: "Větší, protože se jich vejde méně.", why: "Velikost molekuly na velikosti kapky nezávisí." },
    ],
    h0: "Co se při dělení kapky opravdu dělí — kapka, nebo její stavební kameny?",
    h1: "Kdyby se molekuly půlily spolu s kapkou, šlo by dělit donekonečna a na žádnou hranici bys nenarazil. Hranice existuje právě proto, že se dělí jen jejich počet.",
    vysvetleni: "Dělením kapky se mění počet molekul v ní, ne jejich velikost. Molekula vody je v oceánu i v kapce stejná.",
  },
  {
    otazka: "Led roztaje ve vodu. Co se stalo s jeho molekulami?",
    klic: "Jsou to tytéž molekuly, jen jinak uspořádané.",
    chybne: [
      { value: "Změnily se na úplně jiné molekuly.", why: "Led je voda. Molekuly v něm už molekulami vody byly." },
      { value: "Rozpadly se na jednotlivé atomy.", why: "Tání molekuly nerozbíjí, jen uvolní jejich uspořádání." },
      { value: "Zmenšily se, proto voda zabere míň místa.", why: "Molekuly si velikost drží, mění se jejich rozestupy." },
    ],
    h0: "Led i voda jsou táž látka. Co se tedy při tání vlastně mění?",
    h1: "Kdyby tání rozbilo molekuly na atomy, vznikl by z ledu vodík a kyslík. Ze sklenice s rozpuštěným ledem ale vyteče obyčejná voda.",
    vysvetleni: "Při tání se mění uspořádání a rozestupy molekul, ne molekuly samotné. Led i voda jsou z týchž molekul vody.",
  },
  {
    otazka: "Zahřeješ vzduch v uzavřeném balonku a balonek se zvětší. Co platí o částicích uvnitř?",
    klic: "Je jich pořád stejně, jen zabírají víc místa.",
    chybne: [
      { value: "Zahřátím se každá částice trochu zvětšila.", why: "Částice si velikost drží. Zvětšily se rozestupy mezi nimi." },
      { value: "Částic v balonku zahřátím přibylo.", why: "Balonek je uzavřený, nemá odkud další částice vzít." },
      { value: "Částice se změnily na teplejší látku.", why: "Je to pořád týž vzduch, jen teplejší." },
    ],
    h0: "Balonek je uzavřený. Může si při zahřátí odněkud přibrat částice?",
    h1: "Kdyby částic přibylo, vážil by teplý nafouknutý balonek víc než tentýž studený. Postav ho na váhu: hmotnost se nezmění, změní se jen objem.",
    vysvetleni: "Zahřátím se zvětší prostor, který částice zabírají, ne částice samotné ani jejich počet. Proto se balonek nafoukne, a přitom váží stejně.",
  },
  {
    otazka: "Železo je tvrdé. Je tvrdý i jeden atom železa?",
    klic: "Tvrdost vzniká až tím, jak jsou atomy spojené.",
    chybne: [
      { value: "Ano, každý atom železa je sám o sobě tvrdý.", why: "Tvrdost popisuje celý kus látky, ne jednu částici." },
      { value: "Ne, atom železa je naopak měkký a poddajný.", why: "Ani měkký. Jednomu atomu tvrdost nepatří vůbec." },
      { value: "Záleží na tom, jak je zrovna kus železa studený.", why: "Teplota o vlastnosti jednoho atomu nic neříká." },
    ],
    h0: "Tvrdost zkoušíš tím, že do látky rýpneš. Co při tom klade odpor?",
    h1: "Rýpnutí se brání spojení mezi sousedy: musí být co od sebe odtrhnout. U jedné částice není co, takže „tvrdý“ ani „měkký“ u ní nedává smysl.",
    vysvetleni: "Tvrdost vzniká ze sil mezi atomy a z toho, jak jsou uspořádané. Jeden atom tvrdý ani měkký není.",
  },
  {
    otazka: "Hliníková fólie jde snadno ohnout. Platí to i o jednom atomu hliníku?",
    klic: "Ohebnost patří celé fólii, ne jednomu atomu.",
    chybne: [
      { value: "Ano, každý atom hliníku je sám o sobě ohebný.", why: "Ohýbá se uspořádání atomů, ne atom samotný." },
      { value: "Ne, atom hliníku je naopak křehký a láme se.", why: "Ani křehký. Jednomu atomu ohebnost nepatří." },
      { value: "Ano, ale jen dokud je fólie dostatečně tenká.", why: "Tloušťka fólie o vlastnosti jednoho atomu nic neříká." },
    ],
    h0: "Při ohýbání se něco vůči něčemu posouvá. Co přesně to je?",
    h1: "Při ohnutí se posunou celé vrstvy atomů vůči sobě. Jedna částice nemá vůči čemu se posunout, takže u ní slovo „ohebný“ nemá obsah.",
    vysvetleni: "Ohebnost vzniká z toho, jak se vrstvy atomů umí posunout vůči sobě. Jednomu atomu proto nepatří.",
  },
  {
    otazka: "Stejně velký kus hliníku a kus olova. Olovo je mnohem těžší. Proč?",
    klic: "Atomy olova jsou mnohem těžší než atomy hliníku.",
    chybne: [
      { value: "Olovo má uvnitř mnohem míň vzduchu.", why: "Uvnitř kovu vzduch není. Mezi částicemi je prázdný prostor." },
      { value: "Atomů olova je v kusu mnohem víc.", why: "Ve stejném objemu jich je naopak méně, jsou ale mnohem těžší." },
      { value: "Olovo je studenější, a proto i těžší.", why: "Teplota hmotnost prakticky nemění." },
    ],
    h0: "Stejný objem, jiná hmotnost. Co všechno se může mezi dvěma kovy lišit?",
    h1: "Spočítej to odzadu: hmotnost kusu je počet částic krát hmotnost jedné. Kdyby jedna částice vážila u obou kovů stejně, musel by jich těžší kov mít mnohonásobně víc.",
    vysvetleni: "Hustotu látky určuje hmotnost jejích částic a to, jak hustě jsou u sebe. U olova rozhoduje hlavně to, že jsou jeho atomy těžké.",
  },
  {
    otazka: "Litr vody a litr vodní páry. Kde je molekul víc?",
    klic: "Ve vodě, v páře jsou molekuly mnohem dál od sebe.",
    chybne: [
      { value: "V páře, protože zabírá mnohem víc místa.", why: "Víc místa zabírá právě proto, že jsou molekuly řídce rozeseté." },
      { value: "V obou stejně, protože je to táž látka.", why: "Táž látka ano, ale hustota se liší více než tisíckrát." },
      { value: "Ve vodě, protože její molekuly jsou větší.", why: "Molekuly jsou stejné. Rozhodují rozestupy, ne velikost." },
    ],
    h0: "Oba litry mají stejný objem. Čím se tedy liší to, co je uvnitř?",
    h1: "Nech vyvařit hrnec vody a sleduj, kolik prostoru pára zabere: zaplní celou kuchyni. Týž počet molekul potřebuje v plynu více než tisíckrát větší prostor.",
    vysvetleni: "Skupenství nemění velikost molekul, ale jejich rozestupy. V plynu jsou tak daleko od sebe, že je jich ve stejném objemu mnohem méně.",
  },
  {
    otazka: "Balonek s heliem je lehčí než stejně nafouknutý balonek se vzduchem. Proč?",
    klic: "Částice helia jsou mnohem lehčí než částice vzduchu.",
    chybne: [
      { value: "V balonku s heliem je částic mnohem méně.", why: "Při stejném objemu a tlaku je jich v obou zhruba stejně." },
      { value: "Helium je plyn, kdežto vzduch je směs.", why: "Rozhoduje hmotnost částic, ne to, jestli jde o směs." },
      { value: "Helium tlačí na stěny balonku směrem vzhůru.", why: "Vzhůru stoupá celý balonek, protože je lehčí než okolní vzduch." },
    ],
    h0: "Oba balonky jsou stejně velké a stejně nafouknuté. Co se tedy liší?",
    h1: "Při stejném objemu a stejném tlaku je v obou baloncích částic zhruba stejně. Rozdíl v hmotnosti tedy musí být v něčem jiném než v jejich počtu.",
    vysvetleni: "Hmotnost plynu v balonku je počet částic krát hmotnost jedné. Helium je lehké proto, že jedna jeho částice váží zlomek toho co částice vzduchu.",
  },
];

const KROKY_L2 = [
  "Přelož situaci do řeči částic.",
  "Rozhodni, jestli se mění částice, nebo mezery mezi nimi.",
  "Ověř si odpověď tím, co by z ní muselo plynout.",
];
const KROKY_L3 = [
  "Rozhodni, jestli vlastnost popisuje látku, nebo jednu částici.",
  "Vlastnosti látky vznikají až ze spolupráce mnoha částic.",
  "Částice si velikost i druh drží, mění se jejich počet a rozestupy.",
];

function zBanky(p: Polozka, kroky: string[]): PracticeTask {
  return task(p.otazka, p.klic, p.chybne, {
    hints: [p.h0, p.h1],
    solutionSteps: kroky,
    explanation: p.vysvetleni,
  });
}

function gen(level: number): PracticeTask[] {
  return ruzneUlohy(() =>
    level === 1
      ? genL1()
      : level === 2
        ? zBanky(pick(JEVY), KROKY_L2)
        : zBanky(pick(MIKROSVET), KROKY_L3),
  );
}

export const ATOMY_MOLEKULY: TopicMetadata[] = [
  {
    id: "g6-fyz-atomy-molekuly-6",
    rvpNodeId: "g6-fyzika-latky-a-telesa-casticova-stavba-latek-atomy-molekuly-uvod-do-mikrosveta",
    displayName: "Atomy a molekuly",
    title: "Atomy, molekuly – úvod do mikrosvěta",
    studentTitle: "Atomy a molekuly",
    subject: "fyzika",
    category: "Látky a tělesa",
    topic: "Částicová stavba látek",
    briefDescription: "Podíváš se na látky až na jednotlivé částice a jejich mezery.",
    keywords: [
      "atom", "molekula", "částice", "částicová stavba", "mikrosvět",
      "mezery mezi částicemi", "stlačitelnost", "rozpouštění", "velikost atomu",
    ],
    goals: [
      "Určit počet atomů v molekule ze slovního popisu jejího složení.",
      "Vysvětlit běžné jevy (stlačení plynu, rozpouštění) mezerami mezi částicemi.",
      "Rozlišit vlastnosti látky od toho, co patří jedné částici.",
    ],
    boundaries: [
      "Pohyb částic, difúze a Brownův pohyb mají vlastní téma hned za tímhle.",
      "Bez chemických značek a vzorců — složení molekul se popisuje slovy.",
      "Pojmy prvek a sloučenina patří do chemie 8. ročníku a nejsou tu zavedené.",
      "Bez stavby atomu (jádro, obal, elektrony).",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: ["g6-fyz-skupenstvi-latek-6"],
    generator: gen,
    helpTemplate: {
      hint: "Látky se skládají z částic a mezi nimi je prázdný prostor. Atom je nejmenší stavební kámen, molekula je skupina spojených atomů.",
      steps: [
        "U složení molekuly počítej kusy atomů, ne druhy.",
        "U běžného jevu se ptej: mění se částice, nebo mezery mezi nimi?",
        "U vlastnosti se ptej: popisuje látku, nebo jednu částici?",
      ],
      commonMistake: "Představovat si částici jako malinký kousek téže látky — „molekula vody je mokrá“, „atom mědi je červenohnědý“.",
      example: "Zahřátý drát se prodlouží proto, že se atomy od sebe vzdálí. Velikost si přitom drží.",
    },
  },
];
