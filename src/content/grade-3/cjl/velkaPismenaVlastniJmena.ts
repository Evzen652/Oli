import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "../_shared";

// Přepsáno 2026-09-11 (inventura obsahu). Chyběla zpětná vazba, nápověda byla
// šablona pro 26 úloh a na úroveň připadalo jen 9–10 úloh. Možnosti lišící se
// jen velikostí písmen („Praha / praha“) kontrola dokumentace nerozliší, proto
// úlohy stojí jinak:
// L1 poznat vlastní jméno mezi obecnými slovy stejného druhu (slova psaná
//    velkými tiskacími písmeny, aby velikost písmene nic neprozradila)
// · L2 spočítat, kolik slov ve větě psané bez velkých písmen má začínat
//    velkým písmenem (začátek věty + vlastní jména, pozor na dny a obecná slova)
// · L3 stejné slovo je jednou obecné, jindy vlastní jméno (Písek × písek,
//    pan Liška × liška) — rozhoduje význam ve větě.

const cap = (w: string) => w[0].toUpperCase() + w.slice(1).toLowerCase();
const low = (w: string) => w.toLowerCase();

// ── L1: které slovo je vlastní jméno ─────────────────────────────────────
interface Druh {
  /** „vlastní jméno řeky“ — co se hledá (do otázky) */
  co: string;
  /** „kteroukoli řeku“ — obecné slovo se hodí na kterýkoli kus druhu */
  kterykoli: string;
  jmeno: string;
  /** [obecné slovo velkými písmeny, co znamená] */
  d: [[string, string], [string, string], [string, string]];
}

const L1: Druh[] = [
  { co: "vlastní jméno řeky", kterykoli: "kteroukoli řeku", jmeno: "VLTAVA", d: [["POTOK", "každý malý tok vody"], ["PŘEHRADA", "každé velké jezero za hrází"], ["BŘEH", "okraj kterékoli vody"]] },
  { co: "vlastní jméno hory", kterykoli: "kteroukoli horu", jmeno: "SNĚŽKA", d: [["KOPEC", "každou menší horu"], ["SKÁLA", "každý velký kámen ve skalách"], ["VRCHOL", "nejvyšší místo kterékoli hory"]] },
  { co: "vlastní jméno města", kterykoli: "kterékoli město", jmeno: "OLOMOUC", d: [["VESNICE", "každou malou obec"], ["NÁMĚSTÍ", "velké prostranství v kterémkoli městě"], ["ULICE", "každou cestu mezi domy"]] },
  { co: "vlastní jméno kluka", kterykoli: "kteréhokoli kluka", jmeno: "MATĚJ", d: [["KAMARÁD", "kohokoli, s kým se kamarádíš"], ["BRATR", "každého syna stejných rodičů"], ["SPOLUŽÁK", "každého, kdo s tebou chodí do třídy"]] },
  { co: "vlastní jméno dívky", kterykoli: "kteroukoli dívku", jmeno: "ELIŠKA", d: [["SESTŘENICE", "dceru kteréhokoli strýce nebo tety"], ["KAMARÁDKA", "každou dívku, se kterou se kamarádíš"], ["HOLČIČKA", "každou malou dívku"]] },
  { co: "vlastní jméno psa", kterykoli: "kteréhokoli psa", jmeno: "AZOR", d: [["JEZEVČÍK", "každého psa s krátkýma nohama toho plemene"], ["ŠTĚNĚ", "každé mládě psa"], ["OVČÁK", "každého psa toho plemene"]] },
  { co: "vlastní jméno kocoura", kterykoli: "kteréhokoli kocoura", jmeno: "MIKEŠ", d: [["KOCOUREK", "každého malého kocoura"], ["KOTĚ", "každé mládě kočky"], ["MAZLÍČEK", "každé zvíře, které doma hladíme"]] },
  { co: "vlastní jméno státu", kterykoli: "kterýkoli stát", jmeno: "SLOVENSKO", d: [["ZEMĚ", "kteroukoli zemi na světě"], ["HRANICE", "čáru mezi kterýmikoli státy"], ["KRAJINA", "přírodu kolem nás kdekoli"]] },
  { co: "vlastní jméno pohoří", kterykoli: "kterékoli pohoří", jmeno: "KRKONOŠE", d: [["HORY", "kterékoli hory na světě"], ["ÚDOLÍ", "každé místo mezi kopci"], ["LESY", "kterékoli lesy"]] },
  { co: "vlastní jméno vesnice", kterykoli: "kteroukoli vesnici", jmeno: "LHOTA", d: [["VES", "každou vesnici"], ["OSADA", "každou malou skupinu domů"], ["NÁVES", "prostranství uprostřed kterékoli vesnice"]] },
  { co: "vlastní jméno koně", kterykoli: "kteréhokoli koně", jmeno: "ŠEMÍK", d: [["HŘEBEC", "každého samce koně"], ["KLISNA", "každou samici koně"], ["HŘÍBĚ", "každé mládě koně"]] },
  { co: "vlastní jméno rybníka", kterykoli: "kterýkoli rybník", jmeno: "ROŽMBERK", d: [["RYBNÍČEK", "každý malý rybník"], ["JEZÍRKO", "každou malou vodní plochu"], ["HRÁZ", "val, který drží vodu v kterémkoli rybníku"]] },
  { co: "vlastní jméno ulice", kterykoli: "kteroukoli ulici", jmeno: "HUSOVA", d: [["SILNICE", "každou cestu pro auta"], ["CHODNÍK", "každou cestu pro chodce"], ["KŘIŽOVATKA", "každé místo, kde se cesty kříží"]] },
  { co: "příjmení paní učitelky", kterykoli: "kteroukoli paní učitelku", jmeno: "NOVÁKOVÁ", d: [["UČITELKA", "každou ženu, která učí"], ["PANÍ", "oslovení kterékoli ženy"], ["ŘEDITELKA", "každou ženu, která vede školu"]] },
];

function vlastniJmeno(t: Druh): PracticeTask {
  const [d1] = t.d;
  return choice(`Slova jsou psaná velkými tiskacími písmeny. Které z nich je ${t.co}?`, t.jmeno,
    t.d.map(([value, znamena]) => ({
      value,
      why: `„${low(value)}“ není jméno, ale obecné slovo — znamená ${znamena}. Proto se píše s malým písmenem.`,
    })) as [Distractor, Distractor, Distractor], {
      hints: [
        `Obecné slovo můžeš použít pro ${t.kterykoli}. Které slovo z nabídky to nedokáže?`,
        `Slovo „${low(d1[0])}“ je obecné — znamená ${d1[1]}. Zeptej se tak u každého slova: pojmenovává celý druh, nebo jen jednoho určitého? Jen jméno jednoho určitého se píše s velkým písmenem.`,
      ],
      explanation: `„${cap(t.jmeno)}“ neoznačuje ${t.kterykoli}. Je to ${t.co}, a proto ho píšeme s velkým písmenem. Ostatní slova (${t.d.map(([w]) => low(w)).join(", ")}) jsou obecná pojmenování a píšou se s malým.`,
    });
}

// ── L2: kolik slov má začínat velkým písmenem ────────────────────────────
interface Veta {
  /** věta bez velkých písmen */
  v: string;
  /** slova, která mají začínat velkým písmenem, a proč */
  velka: [string, string][];
  /** obecná slova, u kterých děti chybují, a proč jsou malá */
  pasti: [string, string][];
}

const ZAC = "první slovo věty";
const L2: Veta[] = [
  { v: "v sobotu jela jana s babičkou do prahy.", velka: [["v", ZAC], ["jana", "jméno dívky"], ["prahy", "jméno města"]], pasti: [["sobotu", "dny v týdnu píšeme s malým písmenem"], ["babičkou", "babička je obecné slovo"]] },
  { v: "náš pes azor rád běhá u řeky.", velka: [["náš", ZAC], ["azor", "jméno psa"]], pasti: [["pes", "pes je obecné slovo pro kteréhokoli psa"], ["řeky", "řeka bez jména je obecné slovo"]] },
  { v: "tomáš a lucka jeli s tátou do brna.", velka: [["tomáš", "jméno kluka a zároveň první slovo věty"], ["lucka", "jméno dívky"], ["brna", "jméno města"]], pasti: [["tátou", "táta je obecné slovo"]] },
  { v: "na sněžku jsme šli s dědou pěšky.", velka: [["na", ZAC], ["sněžku", "jméno hory"]], pasti: [["dědou", "děda je obecné slovo"]] },
  { v: "řeka morava teče přes olomouc.", velka: [["řeka", "první slovo věty — jinak by bylo malé"], ["morava", "jméno řeky"], ["olomouc", "jméno města"]], pasti: [] },
  { v: "moje sestra eliška má kocoura mikeše.", velka: [["moje", ZAC], ["eliška", "jméno dívky"], ["mikeše", "jméno kocoura"]], pasti: [["sestra", "sestra je obecné slovo"], ["kocoura", "kocour je obecné slovo"]] },
  { v: "o prázdninách pojedeme k moři do itálie.", velka: [["o", ZAC], ["itálie", "jméno státu"]], pasti: [["prázdninách", "prázdniny jsou obecné slovo"], ["moři", "moře bez jména je obecné slovo"]] },
  { v: "strýc karel bydlí na šumavě.", velka: [["strýc", "první slovo věty — jinak by bylo malé"], ["karel", "jméno muže"], ["šumavě", "jméno pohoří"]], pasti: [] },
  { v: "po labi pluje velká loď.", velka: [["po", ZAC], ["labi", "jméno řeky"]], pasti: [["loď", "loď je obecné slovo"]] },
  { v: "náš kůň šemík rád žere seno.", velka: [["náš", ZAC], ["šemík", "jméno koně"]], pasti: [["kůň", "kůň je obecné slovo"], ["seno", "seno je obecné slovo"]] },
  { v: "z krkonoš teče řeka labe.", velka: [["z", ZAC], ["krkonoš", "jméno pohoří"], ["labe", "jméno řeky"]], pasti: [["řeka", "slovo řeka před jménem je obecné a píše se s malým"]] },
  { v: "ve středu přijede teta věra z kolína.", velka: [["ve", ZAC], ["věra", "jméno ženy"], ["kolína", "jméno města"]], pasti: [["středu", "dny v týdnu píšeme s malým písmenem"], ["teta", "teta je obecné slovo"]] },
  { v: "pan novák a paní nováková jedou do plzně.", velka: [["pan", "první slovo věty — jinak by bylo malé"], ["novák", "příjmení"], ["nováková", "příjmení"], ["plzně", "jméno města"]], pasti: [["paní", "paní je obecné oslovení, píše se s malým"]] },
  { v: "anna, eva a jana bydlí v praze.", velka: [["anna", "jméno dívky a zároveň první slovo věty"], ["eva", "jméno dívky"], ["jana", "jméno dívky"], ["praze", "jméno města"]], pasti: [] },
  { v: "v lednu jel tomáš s mámou do jeseníků.", velka: [["v", ZAC], ["tomáš", "jméno kluka"], ["jeseníků", "jméno pohoří"]], pasti: [["lednu", "měsíce píšeme s malým písmenem"], ["mámou", "máma je obecné slovo"]] },
];

const q = (w: string) => `„${w}“`;

function kolik(t: Veta): PracticeTask {
  const n = t.velka.length;
  const kandidati = [n - 1, n + 1, n - 2, n + 2, n + 3].filter((x) => x >= 1);
  const jine = kandidati.slice(0, 3);
  const vypis = t.velka.map(([w, proc]) => `${q(cap(w))} (${proc})`).join(", ");
  const past = t.pasti[0];
  const zacatek = t.velka[0];
  const why = (x: number): string => {
    if (x === n - 1) return `Jedno slovo ti chybí. Nezapomněl(a) jsi na ${q(zacatek[0])}? Má velké písmeno, protože je to ${zacatek[1]}.`;
    if (x < n) return `Chybí ti víc slov. Velké písmeno patří těmto: ${t.velka.map(([w]) => q(w)).join(", ")}.`;
    if (x === n + 1) return past
      ? `O jedno slovo víc. Slovo ${q(past[0])} velké písmeno nemá: ${past[1]}.`
      : `O jedno slovo víc. Kromě začátku věty mají velké písmeno jen jména; ostatní slova jsou obecná.`;
    return t.pasti.length >= 2
      ? `Počítáš i obecná slova, třeba ${q(t.pasti[0][0])} a ${q(t.pasti[1][0])} — ta se píšou s malým písmenem.`
      : `Tolik slov velké písmeno nemá. Kromě začátku věty ho dostanou jen jména osob, zvířat, měst, řek a hor.`;
  };
  return choice(`Kolik slov má ve větě začínat velkým písmenem? „${t.v}“`, String(n),
    jine.map((x) => ({ value: String(x), why: why(x) })) as [Distractor, Distractor, Distractor], {
      hints: [
        `Projdi větu „${t.v}“ slovo po slovu. Začni úplně prvním slovem.`,
        past
          ? `Velké písmeno má první slovo věty a každé vlastní jméno — jméno osoby, zvířete, města, řeky nebo hory. Pozor na slovo ${q(past[0])}: je to jméno jednoho určitého, nebo obecné slovo?`
          : `Velké písmeno má první slovo věty ${q(zacatek[0])} a každé vlastní jméno — jméno osoby, zvířete, města, řeky nebo hory. Každé slovo počítej jen jednou, i kdyby mělo velké písmeno ze dvou důvodů.`,
      ],
      explanation: `Velké písmeno mají: ${vypis}.${t.pasti.length ? ` Slova ${t.pasti.map(([w]) => q(w)).join(" a ")} jsou obecná, píšou se s malým.` : " Ostatní slova jsou obecná, píšou se s malým."}`,
    });
}

// ── L3: stejné slovo — jednou jméno, jindy obecné slovo ──────────────────
interface Dvojznacne {
  /** slovo velkými písmeny do otázky */
  w: string;
  /** co je to za jméno ve správné větě */
  jmeno: string;
  /** co znamená obecné slovo */
  obecne: string;
  /** správná věta — dotčené slovo velkými písmeny */
  a: string;
  /** [věta s obecným slovem velkými písmeny, proč je tu obecné] */
  d: [[string, string], [string, string], [string, string]];
}

const L3: Dvojznacne[] = [
  { w: "PÍSEK", jmeno: "název města", obecne: "drobná zrníčka na pláži a na pískovišti", a: "Teta bydlí v PÍSKU nedaleko řeky Otavy.",
    d: [["Děti stavěly na pláži hrad z PÍSKU.", "hrad se staví z písku na pláži"], ["V botě mám plno PÍSKU.", "v botě jsou zrníčka písku"], ["Na pískovišti je čerstvý PÍSEK.", "na pískovišti je obyčejný písek"]] },
  { w: "MOST", jmeno: "název města", obecne: "stavba, po které se přechází přes řeku", a: "Strýc jezdí každý den do práce do MOSTU.",
    d: [["Přes řeku vede dlouhý MOST.", "přes řeku vede stavba"], ["Z MOSTU jsme házeli do vody kamínky.", "kamínky se házejí ze stavby nad vodou"], ["Pod MOSTEM teče potok.", "pod stavbou teče potok"]] },
  { w: "TÁBOR", jmeno: "název města", obecne: "místo, kam jezdí děti v létě na prázdniny", a: "Město TÁBOR leží v jižních Čechách.",
    d: [["V létě pojedu na dětský TÁBOR.", "dětský tábor je místo na prázdniny"], ["Na TÁBOŘE jsme spali ve stanech.", "ve stanech se spí na letním táboře"], ["Vedoucí TÁBORA nás naučil uzly.", "vedoucí patří k letnímu táboru"]] },
  { w: "LIŠKA", jmeno: "příjmení člověka", obecne: "zvíře s huňatým ocasem", a: "Pan LIŠKA je náš nový soused.",
    d: [["Z lesa vyběhla LIŠKA.", "z lesa vyběhlo zvíře"], ["V noci se ke kurníku připlížila LIŠKA.", "ke kurníku se plíží zvíře"], ["Na obrázku je LIŠKA s liščaty.", "liška s mláďaty je zvíře"]] },
  { w: "KOVÁŘ", jmeno: "příjmení člověka", obecne: "řemeslník, který kove železo", a: "Náš třídní učitel se jmenuje pan KOVÁŘ.",
    d: [["Na hradě ukoval KOVÁŘ meč.", "meč ukoval řemeslník"], ["Můj děda byl vesnický KOVÁŘ.", "děda dělal řemeslo"], ["V kovárně pracoval KOVÁŘ celý den.", "v kovárně pracuje řemeslník"]] },
  { w: "BERUŠKA", jmeno: "jméno zvířete", obecne: "malý brouk s tečkami", a: "Naše kráva se jmenuje BERUŠKA.",
    d: [["Na listu sedí červená BERUŠKA.", "na listu sedí brouk"], ["Z trávy vzlétla malá BERUŠKA.", "z trávy vzlétl brouk"], ["Na dlani mi přistála BERUŠKA s tečkami.", "na dlani přistál brouk"]] },
  { w: "JIŘINA", jmeno: "jméno ženy", obecne: "zahradní květina", a: "Moje babička se jmenuje JIŘINA.",
    d: [["Na záhonu kvete žlutá JIŘINA.", "na záhonu kvete květina"], ["Maminka zasadila do zahrady JIŘINU.", "do zahrady se sází květina"], ["Na podzim kvete u plotu JIŘINA.", "u plotu kvete květina"]] },
  { w: "HVĚZDA", jmeno: "jméno zvířete", obecne: "svítící bod na obloze nebo tvar s cípy", a: "Naše klisna se jmenuje HVĚZDA.",
    d: [["Na nebi zazářila první HVĚZDA.", "na nebi svítí hvězda"], ["Na špičce stromku svítí HVĚZDA.", "na stromku je ozdoba ve tvaru hvězdy"], ["Na výkresu je nakreslená HVĚZDA.", "na výkresu je tvar hvězdy"]] },
  { w: "VRÁNA", jmeno: "příjmení člověka", obecne: "černý pták", a: "Do třídy přišel nový žák Pavel VRÁNA.",
    d: [["Na poli sedí černá VRÁNA.", "na poli sedí pták"], ["Na plotě krákala VRÁNA.", "kráká pták"], ["Do zrní klovala hladová VRÁNA.", "do zrní kluje pták"]] },
  { w: "ZAJÍC", jmeno: "příjmení člověka", obecne: "zvíře s dlouhýma ušima", a: "Paní učitelka vyvolala Petra ZAJÍCE.",
    d: [["Na louce skáče ZAJÍC.", "na louce skáče zvíře"], ["Pes honil po poli ZAJÍCE.", "pes honí zvíře"], ["Myslivec viděl v lese ZAJÍCE.", "v lese žije zvíře"]] },
  { w: "LEV", jmeno: "jméno člověka", obecne: "velká šelma s hřívou", a: "Můj bratranec se jmenuje LEV.",
    d: [["V zoo spí ve výběhu LEV.", "ve výběhu spí zvíře"], ["Králem zvířat je LEV.", "králem zvířat je šelma"], ["Na obrázku řve velký LEV.", "na obrázku řve zvíře"]] },
  { w: "KOS", jmeno: "příjmení člověka", obecne: "černý zpěvný pták", a: "Pan KOS u nás učí tělocvik.",
    d: [["Na stromě zpívá černý KOS.", "na stromě zpívá pták"], ["Na trávníku hledal červy KOS.", "červy hledá pták"], ["V živém plotě si postavil hnízdo KOS.", "hnízdo si staví pták"]] },
  { w: "HORA", jmeno: "příjmení člověka", obecne: "vysoký kopec", a: "Pan HORA nám opravil auto.",
    d: [["Na HORU jsme šli dvě hodiny.", "šli jsme na vysoký kopec"], ["Za vesnicí se tyčí vysoká HORA.", "za vesnicí je vysoký kopec"], ["Z vrcholu HORY je krásný výhled.", "vrchol má vysoký kopec"]] },
];

function jmenoNeboSlovo(t: Dvojznacne): PracticeTask {
  const upravena = t.a.replace(/\p{Lu}{2,}/u, (m) => cap(m));
  return choice(`Ve které větě je slovo ${t.w} vlastním jménem?`, t.a,
    t.d.map(([value, proc]) => ({
      value,
      why: `Tady je „${low(t.w)}“ obecné slovo — ${proc}. Píše se s malým písmenem.`,
    })) as [Distractor, Distractor, Distractor], {
      hints: [
        `Slovo ${t.w} může být obyčejné slovo, ale i vlastní jméno. U každé věty se zeptej: jde o jedno určité, nebo o cokoli svého druhu?`,
        `Obecné slovo „${low(t.w)}“ znamená ${t.obecne}. Jako vlastní jméno ale může označovat i ${t.jmeno}. Hledej větu, ve které slova kolem ukazují, že jde právě o ${t.jmeno}.`,
      ],
      explanation: `Ve větě „${upravena}“ je to ${t.jmeno}, a proto vlastní jméno s velkým písmenem. V ostatních větách znamená „${low(t.w)}“ ${t.obecne} — to je obecné slovo s malým písmenem.`,
    });
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return shuffle(L1).map(vlastniJmeno);
  if (level === 2) return shuffle(L2).map(kolik);
  return shuffle(L3).map(jmenoNeboSlovo);
}

export const VELKAPISMENA: TopicMetadata[] = [
  {
    id: "g3-cjl-velka-pismena",
    rvpNodeId: "g3-cjl-jazykova-vychova-pravopis-velka-pismena-ve-vlastnich-jmenech-osoby-mesta-reky-hory",
    title: "Velká písmena ve vlastních jménech (osoby, města, řeky, hory)",
    studentTitle: "Velká písmena",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Pravopis",
    briefDescription: "Naučíš se psát velká písmena u jmen lidí, měst, řek a hor.",
    keywords: ["velké písmeno", "vlastní jméno", "osoby", "města", "řeky", "hory", "Praha", "Vltava"],
    goals: ["Rozlišit vlastní a obecné jméno.", "Psát správně velké písmeno u jmen osob, měst, řek a hor.", "Opravit chybně napsaná vlastní jména."],
    boundaries: ["Jména osob, měst, řek, hor, států.", "Bez názvů institucí a svátků."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Vlastní jméno = jméno KONKRÉTNÍ osoby nebo místa → velké písmeno. Obecné = každý/každá → malé.",
      steps: ["Ptám se: je to jméno konkrétní osoby nebo místa?", "Ano (Karel, Praha, Vltava, Krkonoše) → Velké.", "Ne (pes, hora, řeka obecně) → Malé."],
      commonMistake: "'pes' × 'Azor' — pes je obecné (malé), Azor je jméno konkrétního psa (velké).",
      example: "Vltava (konkrétní řeka) → velké V. / řeka (obecně) → malé ř.",
    },
  },
];
