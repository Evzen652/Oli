import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ANO = "Ano, to je pravda";
const NE = "Ne, to není pravda";

interface PoolItem {
  question: string;
  correct: string;
  emoji: string;
  hint: string;
  solution: string;
}

// L1 — Základní pravidla a pojmy (věta začíná/končí, co je nadpis/odstavec/stránka)
const POOL_L1: PoolItem[] = [
  { question: "Věta začíná velkým písmenem. Je to pravda?", correct: ANO, emoji: "📝", hint: "Přečti libovolnou větu z knížky — jak začíná?", solution: "Věta začíná velkým písmenem — to je základní pravopisné pravidlo. Díky tomu poznáme, kde věta začíná." },
  { question: "Věta končí tečkou, otazníkem nebo vykřičníkem. Je to pravda?", correct: ANO, emoji: "📝", hint: "Přečti větu z knížky a podívej se na konec — co tam je?", solution: "Věta vždy končí tečkou (.), otazníkem (?) nebo vykřičníkem (!) — tato znaménka říkají, kde věta končí." },
  { question: "Nadpis říká, o čem text pojednává. Je to pravda?", correct: ANO, emoji: "📰", hint: "Nadpis je tučné nebo větší písmo nad textem — co nám říká?", solution: "Nadpis říká, o čem text pojednává — je to první věc, kterou u textu vidíme, a pomáhá nám vědět, co budeme číst." },
  { question: "Stránka je jedna strana listu knihy. Je to pravda?", correct: ANO, emoji: "📖", hint: "List papíru má dvě strany — každá strana se jmenuje...", solution: "Stránka je jedna strana listu — každý list papíru má dvě stránky: přední a zadní." },
  { question: "Věta začíná malým písmenem. Je to pravda?", correct: NE, emoji: "📝", hint: "Vzpomeň si na pravidlo o začátku věty — malé nebo velké?", solution: "Věta nezačíná malým písmenem — věta VŽDY začíná velkým písmenem. Malé písmeno na začátku věty je pravopisná chyba." },
  { question: "Věta nemusí mít na konci žádné znaménko. Je to pravda?", correct: NE, emoji: "📝", hint: "Vzpomeň si na pravidlo o konci věty — co tam musí být?", solution: "Věta VŽDY musí mít na konci znaménko — tečku, otazník nebo vykřičník. Bez znaménka nevíme, kde věta končí." },
  { question: "Nadpis je název nebo téma textu. Je to pravda?", correct: ANO, emoji: "📰", hint: "Jak se jmenuje část, která stojí nad textem a říká nám, o čem text je?", solution: "Nadpis je název textu — stojí nad ním a říká čtenáři, jaké téma text pojednává." },
  { question: "Odstavec je větší část textu oddělená od ostatních. Je to pravda?", correct: ANO, emoji: "📄", hint: "V knize jsou někdy prázdné řádky nebo odsazení — tím jsou od sebe odděleny části textu. Jak se jim říká?", solution: "Odstavec je větší část textu oddělená od ostatních — prázdným řádkem nebo odsazením nového řádku." },
];

// L2 — Aplikace / méně samozřejmá pravidla (číslo stránky, místo nadpisu, obrázek doplňuje)
const POOL_L2: PoolItem[] = [
  { question: "Číslo stránky (paginace) nám pomáhá orientovat se v knize. Je to pravda?", correct: ANO, emoji: "🔢", hint: "Malé číslo dole nebo nahoře na stránce — k čemu slouží?", solution: "Číslo stránky nám pomáhá orientovat se v knize — řekneme 'přečti si stranu 15' a všichni otevřou správnou stránku." },
  { question: "Obrázek v textu může doplnit nebo vysvětlit, co text říká. Je to pravda?", correct: ANO, emoji: "🖼️", hint: "Proč jsou v knížkách pro děti obrázky — jen pro ozdobu nebo i pro pochopení?", solution: "Obrázek v textu doplňuje nebo vysvětluje text — pomáhá nám lépe pochopit, co je popsáno slovy." },
  { question: "Nadpis je vždy na konci textu. Je to pravda?", correct: NE, emoji: "📰", hint: "Nadpis říká, o čem text bude — kde ho tedy logicky čteme?", solution: "Nadpis není na konci — je VŽDY na začátku textu, před samotným textem. Na konci bývá závěr nebo shrnutí." },
  { question: "Číslo stránky vždy najdeme na obálce. Je to pravda?", correct: NE, emoji: "🔢", hint: "Obálka je přebálek knihy — kde bývají čísla stránek?", solution: "Číslo stránky není na obálce — čísla stránek jsou uvnitř knihy na každé stránce (obvykle nahoře nebo dole)." },
  { question: "Všechny knížky mají stejný počet stránek. Je to pravda?", correct: NE, emoji: "📚", hint: "Vzpomeň si na tenkou knížku pohádek a tlustou encyklopedii — mají stejně stránek?", solution: "Knížky nemají stejný počet stránek — každá knížka je jinak dlouhá. Krátká pohádka má málo stran, encyklopedie hodně." },
  { question: "Text čteme zleva doprava. Je to pravda?", correct: ANO, emoji: "👁️", hint: "Jak pohybujeme okem při čtení — odkud kam jde pohled?", solution: "Text čteme zleva doprava — tak jsou slova napsána v češtině i ve většině evropských jazyků." },
  { question: "Nadpis bývá napsán větším nebo tučnějším písmem než ostatní text. Je to pravda?", correct: ANO, emoji: "📰", hint: "Podívej se do knížky nebo učebnice — jak vypadá nadpis ve srovnání s ostatním textem?", solution: "Nadpis bývá tučně nebo větším písmem, aby byl na první pohled vidět a odlišoval se od ostatního textu." },
  { question: "Obsah knihy nám pomáhá najít konkrétní kapitolu. Je to pravda?", correct: ANO, emoji: "📋", hint: "Obsah bývá na začátku nebo na konci knihy — k čemu slouží?", solution: "Obsah knihy vypisuje názvy kapitol a čísla jejich stránek — díky tomu rychle najdeme, kde konkrétní kapitola začíná." },
];

// L3 — Jemnější rozlišení a časté omyly (odstavec není jen 1 věta, obrázek nenahradí text úplně, věta ≠ 3 slova, jednoslovná věta)
const POOL_L3: PoolItem[] = [
  { question: "Odstavec je vždy jen jedna věta. Je to pravda?", correct: NE, emoji: "📄", hint: "Odstavec může být krátký nebo dlouhý — musí mít přesně jednu větu?", solution: "Odstavec není jen jedna věta — odstavec může mít více vět. Je to logický celek textu, ne nutně jedna věta." },
  { question: "Obrázek v knize vždy nahradí text úplně. Je to pravda?", correct: NE, emoji: "🖼️", hint: "Obrázek a text jsou v knize obojí — mají stejnou funkci nebo doplňují se?", solution: "Obrázek v knize text úplně nenahradí — obrázek ho doplňuje a pomáhá pochopit, ale text říká detaily, které obrázek nepovídá." },
  { question: "V jedné větě musí být vždy právě tři slova. Je to pravda?", correct: NE, emoji: "📝", hint: "Zkus si vzpomenout na větu s jedním slovem ('Sněží.') nebo na dlouhou větu — musí mít přesně tři slova?", solution: "Věta nemusí mít právě tři slova — věta může mít jedno slovo ('Sněží.') nebo velmi mnoho slov. Počet slov není pevně daný." },
  { question: "Jedno slovo může tvořit celou větu. Je to pravda?", correct: ANO, emoji: "📝", hint: "Může jedno slovo tvořit celou větu? Třeba 'Vstávej!' nebo 'Sněží.'", solution: "Jedno slovo může být celá věta — 'Sněží.' nebo 'Vstávej!' jsou jednoslovné věty. Věta = úplná myšlenka." },
  { question: "Text čteme zprava doleva. Je to pravda?", correct: NE, emoji: "👁️", hint: "V češtině čteme text v určitém směru — zleva doprava nebo zprava doleva?", solution: "Text nečteme zprava doleva — v češtině (a ve většině jazyků) čteme zleva doprava. Zprava doleva se čte například arabsky." },
  { question: "Odstavec může mít pět i více vět. Je to pravda?", correct: ANO, emoji: "📄", hint: "Vzpomeň si na dlouhý odstavec v knize — kolik vět může mít?", solution: "Odstavec může mít libovolný počet vět — klidně pět, deset i více. Důležité je, že všechny věty odstavce pojednávají o jednom tématu." },
  { question: "Slovo 'Pojď!' je celá věta. Je to pravda?", correct: ANO, emoji: "📝", hint: "Má slovo 'Pojď!' velké písmeno na začátku a vykřičník na konci? Je to úplná myšlenka?", solution: "'Pojď!' je celá věta — začíná velkým písmenem, končí vykřičníkem a vyjadřuje úplnou myšlenku (výzvu). Věta nemusí mít více slov." },
  { question: "Obrázek a text v knize si navzájem pomáhají — spolu lépe vysvětlují téma. Je to pravda?", correct: ANO, emoji: "🖼️", hint: "Proč mají dětské knížky i obrázky i text — stačil by jen jeden z nich?", solution: "Obrázek a text se v knize doplňují — obrázek ukazuje, jak věci vypadají, text popisuje detaily a děj. Dohromady vysvětlují téma lépe než každý zvlášť." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).map(item => ({
    question: item.question,
    correctAnswer: item.correct,
    options: [ANO, NE],
    emoji: item.emoji,
    hints: [item.hint],
    explanation: item.solution,
  }));
}

export const ORIENTACEVTEXTU: TopicMetadata[] = [
  {
    id: "g2-cjl-komunikacni-a-slohova-vychova-prace-s-textem-orientace-v-textu-veta-odstavec-nadpis",
    rvpNodeId: "g2-cjl-komunikacni-a-slohova-vychova-prace-s-textem-orientace-v-textu-veta-odstavec-nadpis",
    title: "Orientace v textu (věta, odstavec, nadpis)",
    studentTitle: "Orientace v textu",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Práce s textem",
    briefDescription: "Naučíš se orientovat v textu — věta, odstavec, nadpis.",
    keywords: ["věta", "odstavec", "nadpis", "stránka", "text", "velké písmeno", "tečka"],
    goals: [
      "Vědět, jak začíná a končí věta.",
      "Pochopit, co je odstavec a nadpis.",
      "Orientovat se v knize (stránka, obsah).",
    ],
    boundaries: ["Pouze základní prvky textu.", "Bez složité typografie."],
    gradeRange: [2, 2],
    inputType: "true_false",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Věta: začíná velkým písmenem, končí . ? ! Odstavec: více vět na jedno téma. Nadpis: říká, o čem text je.",
      steps: ["Přečti tvrzení.", "Je to pravidlo, které platí vždy v češtině?", "Ano → 'Ano, to je pravda'. Ne → 'Ne, to není pravda'."],
      commonMistake: "Věta vždy začíná velkým písmenem — to je povinné pravidlo, ne volba.",
      example: "Věta 'Sněží.' — začíná S (velké), končí tečkou. Správně napsaná věta.",
    },
  },
];
