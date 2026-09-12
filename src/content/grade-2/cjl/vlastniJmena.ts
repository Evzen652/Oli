import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "@/content/grade-3/_shared";

// Přepsáno 2026-09-11 (inventura obsahu). Dřív 8 úloh Ano/Ne na každé úrovni
// (i na L2/L3), jedna nápověda, žádná zpětná vazba. Teď tři oddělené banky:
// L1 Ano/Ne: je slovo vlastní jméno? · L2 najdi vlastní jméno ve větě
// · L3 přenos: stejné slovo jednou jako příjmení nebo název města, jindy jako
// obecné jméno (Liška × liška, Most × most) a obrácená otázka (které slovo
// vlastní jméno NENÍ). Slova ve zkoumaném místě jsou psaná VELKÝMI písmeny,
// aby první písmeno odpověď neprozradilo. L2/L3 mají čtyři možnosti — router
// je vykreslí jako výběr, i když je téma true_false.

const ANO = "Ano";
const NE = "Ne";
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

// ── L1: Ano/Ne ────────────────────────────────────────────────────────────────
// [vlastní jméno, obecné jméno stejného druhu, „jméno jedné určité …“, „slovo pro každou …“]
const DVOJICE: [string, string, string, string][] = [
  ["Vltava", "řeka", "jedné určité řeky", "každou řeku"],
  ["Brno", "město", "jednoho určitého města", "každé město"],
  ["Sněžka", "hora", "jedné určité hory", "každou horu"],
  ["Petr", "kluk", "jednoho určitého kluka", "každého kluka"],
  ["Alík", "pes", "jednoho určitého psa", "každého psa"],
  ["Cilka", "kočka", "jedné určité kočky", "každou kočku"],
  ["Lucie", "dívka", "jedné určité dívky", "každou dívku"],
  ["Česko", "stát", "jednoho určitého státu", "každý stát"],
];

function anoNe(i: number, vlastni: boolean): PracticeTask {
  const [V, o, jedne, kazde] = DVOJICE[i];
  const [exV, exO] = DVOJICE[(i + 1) % DVOJICE.length];
  const W = (vlastni ? V : o).toUpperCase();
  const spravne = vlastni ? ANO : NE;
  return {
    question: `Je slovo ${W} vlastní jméno?`,
    correctAnswer: spravne,
    options: [ANO, NE],
    optionFeedback: vlastni
      ? { [NE]: `${V} je vlastní jméno: nehodí se na ${kazde}, je to jméno ${jedne}.` }
      : { [ANO]: `„${o}“ se hodí na ${kazde}, není to jméno ${jedne}. Je to obecné jméno.` },
    hints: [
      `Je ${W} jméno ${jedne}, nebo slovo pro ${kazde}?`,
      `Vlastní jméno patří jen jedné určité osobě, zvířeti nebo místu (třeba ${exV}). Obecné jméno se hodí na všechny stejného druhu (třeba ${exO}). Kam patří slovo ${W}?`,
    ],
    explanation: vlastni
      ? `${V} je jméno ${jedne}, ne slovo pro ${kazde}. Proto je to vlastní jméno a píše se s velkým ${V[0]}.`
      : `${cap(o)} je slovo pro ${kazde}, ne jméno ${jedne}. Je to obecné jméno a píše se s malým písmenem. Vlastní jméno je třeba ${V}.`,
    emoji: vlastni ? "🔠" : "🔡",
  };
}

// ── L2: najdi vlastní jméno ve větě ──────────────────────────────────────────
// [téma (6. pád), věta psaná správně, vlastní jméno ve tvaru z věty, „jméno jedné určité …“, chybné [slovo z věty, proč není vlastní jméno]]
const VE_VETE: [string, string, string, string, [string, string][]][] = [
  ["psovi", "Náš pes Alík spí v boudě.", "Alík", "jednoho určitého psa", [["pes", "se hodí na každého psa"], ["boudě", "se hodí na každou psí boudu"], ["spí", "říká, co pes dělá, žádné jméno to není"]]],
  ["koupání", "V létě se koupeme v řece Otavě.", "Otavě", "jedné určité řeky", [["řece", "se hodí na každou řeku"], ["létě", "je název ročního období, píše se s malým písmenem"], ["koupeme", "říká, co děláme, žádné jméno to není"]]],
  ["babičce", "Babička bydlí ve městě Olomouci.", "Olomouci", "jednoho určitého města", [["Babička", "se hodí na každou babičku — velké B má jen proto, že stojí na začátku věty"], ["městě", "se hodí na každé město"], ["bydlí", "říká, co babička dělá, žádné jméno to není"]]],
  ["kočce", "Sousedova kočka Líza má koťata.", "Líza", "jedné určité kočky", [["kočka", "se hodí na každou kočku"], ["koťata", "se hodí na všechna koťata"], ["Sousedova", "říká, čí kočka je — velké S má jen proto, že stojí na začátku věty"]]],
  ["horách", "Na horu Sněžku vede lanovka.", "Sněžku", "jedné určité hory", [["horu", "se hodí na každou horu"], ["lanovka", "se hodí na každou lanovku"], ["vede", "říká, co lanovka dělá, žádné jméno to není"]]],
  ["kamarádovi", "Můj nejlepší kamarád se jmenuje Matěj.", "Matěj", "jednoho určitého kluka", [["kamarád", "se hodí na každého kamaráda"], ["nejlepší", "říká, jaký kamarád je"], ["jmenuje", "říká, co se děje, žádné jméno to není"]]],
  ["cestování", "S tatínkem jsme jeli vlakem do Prahy.", "Prahy", "jednoho určitého města", [["tatínkem", "se hodí na každého tatínka"], ["vlakem", "se hodí na každý vlak"], ["jeli", "říká, co jsme dělali, žádné jméno to není"]]],
  ["koni", "Na statku žije kůň Blesk.", "Blesk", "jednoho určitého koně", [["kůň", "se hodí na každého koně"], ["statku", "se hodí na každý statek"], ["žije", "říká, co kůň dělá, žádné jméno to není"]]],
  ["sestře", "Moje sestra Klára chodí do školy.", "Klára", "jedné určité dívky", [["sestra", "se hodí na každou sestru"], ["školy", "se hodí na každou školu"], ["chodí", "říká, co sestra dělá, žádné jméno to není"]]],
  ["rybníku", "U rybníka Rožmberk hnízdí kachny.", "Rožmberk", "jednoho určitého rybníka", [["rybníka", "se hodí na každý rybník"], ["kachny", "se hodí na všechny kachny"], ["hnízdí", "říká, co kachny dělají, žádné jméno to není"]]],
  ["škole", "Naše škola stojí v ulici Květná.", "Květná", "jedné určité ulice", [["škola", "se hodí na každou školu"], ["ulici", "se hodí na každou ulici"], ["stojí", "říká, kde škola je, žádné jméno to není"]]],
  ["zoo", "V zoo žije slonice Lulu.", "Lulu", "jedné určité slonice", [["slonice", "se hodí na každou slonici"], ["zoo", "se hodí na každou zoologickou zahradu"], ["žije", "říká, co slonice dělá, žádné jméno to není"]]],
  ["pečení", "Babička Anna peče buchty.", "Anna", "jedné určité ženy", [["Babička", "se hodí na každou babičku — velké B má jen proto, že stojí na začátku věty"], ["buchty", "se hodí na všechny buchty"], ["peče", "říká, co babička dělá, žádné jméno to není"]]],
  ["prázdninách", "Letos pojedeme k moři do Chorvatska.", "Chorvatska", "jednoho určitého státu", [["moři", "se hodí na každé moře"], ["Letos", "říká, kdy se něco stane — velké L má jen proto, že stojí na začátku věty"], ["pojedeme", "říká, co budeme dělat, žádné jméno to není"]]],
];

function veVete([tema, veta, jm, jedne, d]: (typeof VE_VETE)[number]): PracticeTask {
  const U = (s: string) => s.toUpperCase();
  return {
    ...choice(`Které slovo je vlastní jméno? „${U(veta)}“`, U(jm), d.map(([w, proc]) => ({ value: U(w), why: `Slovo ${U(w)} ${proc}.` })) as [Distractor, Distractor, Distractor], {
      hints: [
        `Ve větě o ${tema} je právě jedno vlastní jméno. Které slovo to je?`,
        `U každého slova ve větě o ${tema} se zeptej: hodí se na všechny stejného druhu, nebo patří jen jedné určité osobě, zvířeti či místu? Věta je psaná velkými písmeny, aby první písmeno nic neprozradilo.`,
      ],
      explanation: `${jm} je jméno ${jedne}, proto je to vlastní jméno. Správně napíšeme: „${veta}“`,
    }),
    emoji: "🔎",
  };
}

// ── L3a: stejné slovo — vlastní, nebo obecné jméno? ──────────────────────────
interface Dvojznacne { W: string; a: string; spatne: string[]; znamena: string; kazde: string; e: string }
const DVOJZNACNA: Dvojznacne[] = [
  { W: "LIŠKA", a: "Pan LIŠKA opravuje auta.", spatne: ["V lese běžela LIŠKA.", "Ta LIŠKA má huňatý ocas.", "Viděli jsme LIŠKU u nory."], znamena: "zvíře", kazde: "každou lišku", e: "Ve větě „Pan Liška opravuje auta.“ je Liška příjmení jednoho určitého pána. Proto je to vlastní jméno s velkým L." },
  { W: "ZAJÍC", a: "Náš soused pan ZAJÍC má psa.", spatne: ["Na poli skáče ZAJÍC.", "Ten ZAJÍC má dlouhé uši.", "Pes honil ZAJÍCE."], znamena: "zvíře", kazde: "každého zajíce", e: "Ve větě „Náš soused pan Zajíc má psa.“ je Zajíc příjmení souseda. Proto je to vlastní jméno s velkým Z." },
  { W: "MOST", a: "Strýc bydlí ve městě MOST.", spatne: ["Přes řeku vede MOST.", "Ten MOST je kamenný.", "Auta jedou přes MOST."], znamena: "stavba přes řeku", kazde: "každý most", e: "Ve větě „Strýc bydlí ve městě Most.“ je Most název jednoho určitého města. Proto je to vlastní jméno s velkým M." },
  { W: "TÁBOR", a: "Město TÁBOR leží v jižních Čechách.", spatne: ["V létě jedu na TÁBOR.", "Na TÁBOŘE jsme spali ve stanu.", "Ten TÁBOR byl u lesa."], znamena: "letní pobyt dětí", kazde: "každý tábor", e: "Ve větě „Město Tábor leží v jižních Čechách.“ je Tábor název města. Proto je to vlastní jméno s velkým T." },
  { W: "PÍSEK", a: "Babička žije ve městě PÍSEK.", spatne: ["Na pláži je jemný PÍSEK.", "Děti si hrají v PÍSKU.", "Tatínek přivezl PÍSEK na stavbu."], znamena: "drobná zrníčka kamínků", kazde: "všechen písek", e: "Ve větě „Babička žije ve městě Písek.“ je Písek název jednoho určitého města. Proto je to vlastní jméno s velkým P." },
  { W: "KOS", a: "Pan KOS je náš trenér.", spatne: ["Na stromě zpívá KOS.", "Ten KOS je celý černý.", "Viděli jsme KOSA na zahradě."], znamena: "pták", kazde: "každého kosa", e: "Ve větě „Pan Kos je náš trenér.“ je Kos příjmení trenéra. Proto je to vlastní jméno s velkým K." },
  { W: "VRÁNA", a: "Pan VRÁNA nás učí zpívat.", spatne: ["Na poli sedí VRÁNA.", "Ta VRÁNA hlasitě krákala.", "Kočka pozorovala VRÁNU."], znamena: "pták", kazde: "každou vránu", e: "Ve větě „Pan Vrána nás učí zpívat.“ je Vrána příjmení učitele. Proto je to vlastní jméno s velkým V." },
  { W: "MRÁZ", a: "Pan MRÁZ prodává zeleninu.", spatne: ["V noci byl velký MRÁZ.", "Ten MRÁZ štípal do tváří.", "Ráno přišel první MRÁZ."], znamena: "velká zima", kazde: "každý mráz", e: "Ve větě „Pan Mráz prodává zeleninu.“ je Mráz příjmení prodavače. Proto je to vlastní jméno s velkým M." },
];

function dvojznacne(x: Dvojznacne): PracticeTask {
  const d = x.spatne.map((s) => ({ value: s, why: `Ve větě „${s}“ znamená ${x.W.toLowerCase()} ${x.znamena} — slovo se hodí na ${x.kazde}. Je to obecné jméno s malým písmenem.` })) as [Distractor, Distractor, Distractor];
  return {
    ...choice(`Ve které větě je ${x.W} vlastní jméno?`, x.a, d, {
      hints: [
        `Ve většině vět znamená ${x.W} ${x.znamena}. Kde znamená něco jiného?`,
        `U každé věty se zeptej, co tam slovo ${x.W} znamená. Když znamená ${x.znamena}, hodí se na ${x.kazde} — to je obecné jméno. Vlastní jméno patří jen jednomu určitému člověku nebo místu, třeba jako příjmení nebo název města.`,
      ],
      explanation: x.e,
    }),
    emoji: "🤔",
  };
}

// ── L3b: obrácená otázka — které slovo vlastní jméno NENÍ? ────────────────────
// [skupina (2. pád mn. č.), tři vlastní jména, obecné jméno, „jméno jedné určité …“, proč je obecné]
const OBRACENE: [string, [string, string, string], string, string, string][] = [
  ["řek", ["MORAVA", "ODRA", "JIZERA"], "POTOK", "jedné určité řeky", "potokem je každý malý tok vody"],
  ["měst", ["PLZEŇ", "OSTRAVA", "LIBEREC"], "VESNICE", "jednoho určitého města", "vesnicí je každá malá obec"],
  ["hor", ["SNĚŽKA", "ŘÍP", "RADHOŠŤ"], "KOPEC", "jedné určité hory", "kopcem je každá menší hora"],
  ["psů", ["REX", "ALÍK", "AZOR"], "PEJSEK", "jednoho určitého psa", "pejskem můžeme říct každému malému psovi"],
  ["dětí", ["JANA", "TOMÁŠ", "EMA"], "SPOLUŽÁK", "jednoho určitého dítěte", "spolužákem je každý, kdo chodí s tebou do třídy"],
  ["zemí", ["SLOVENSKO", "POLSKO", "NĚMECKO"], "STÁT", "jedné určité země", "slovo stát se hodí na každou zemi s vlastními hranicemi"],
];

function obracene([sk, vl, ob, jedne, proc]: (typeof OBRACENE)[number]): PracticeTask {
  const Cap = (s: string) => s[0] + s.slice(1).toLowerCase();
  return {
    ...choice(`Mezi jmény ${sk} se schovalo obecné jméno. Které to je?`, ob, vl.map((w) => ({ value: w, why: `${Cap(w)} je jméno ${jedne}, tedy vlastní jméno s velkým písmenem.` })) as [Distractor, Distractor, Distractor], {
      hints: [
        `Které slovo není jméno ${jedne}, ale hodí se na mnoho podobných?`,
        `Pozor, otázka je obrácená: hledáš slovo, které vlastní jméno NENÍ. U každého slova se zeptej, jestli je to jméno ${jedne}, nebo slovo, které se hodí na všechny stejného druhu.`,
      ],
      explanation: `${Cap(ob)} je obecné jméno — ${proc}. Ostatní slova jsou jména jednotlivých ${sk}, tedy vlastní jména, a píšou se s velkým písmenem.`,
    }),
    emoji: "🕵️",
  };
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return shuffle(DVOJICE.flatMap((_, i) => [anoNe(i, true), anoNe(i, false)]));
  if (level === 2) return shuffle(VE_VETE).map(veVete);
  return shuffle([...DVOJZNACNA.map(dvojznacne), ...OBRACENE.map(obracene)]);
}

export const VLASTNIJMENA: TopicMetadata[] = [
  {
    id: "g2-cjl-jazykova-vychova-tvaroslovi-vlastni-jmena-velke-pismeno",
    rvpNodeId: "g2-cjl-jazykova-vychova-tvaroslovi-vlastni-jmena-velke-pismeno",
    title: "Vlastní jména a velké písmeno",
    studentTitle: "Jména s velkým písmenem",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Tvarosloví",
    briefDescription: "Naučíš se poznat vlastní jméno a psát ho s velkým písmenem.",
    keywords: ["vlastní jméno", "velké písmeno", "Praha", "Jan", "Vltava", "obecné jméno"],
    goals: [
      "Rozlišit vlastní jméno od obecného jména.",
      "Vědět, že vlastní jméno píšeme s velkým písmenem.",
    ],
    boundaries: ["Vlastní jména osob, měst a řek.", "Bez historických názvů a institucí."],
    gradeRange: [2, 2],
    inputType: "true_false",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Vlastní jméno pojmenovává konkrétní osobu, město nebo věc a píše se s VELKÝM písmenem.",
      steps: ["Pojmenovává slovo konkrétní jedinečnou věc (Jana, Praha)?", "Ano → vlastní jméno s velkým písmenem.", "Ne → obecné jméno s malým písmenem."],
      commonMistake: "Psát vlastní jméno s malým písmenem — 'jan' místo 'Jan', 'praha' místo 'Praha'.",
      example: "Praha (vlastní jméno) vs. město (obecné jméno). Jan (vlastní) vs. chlapec (obecné).",
    },
  },
];
