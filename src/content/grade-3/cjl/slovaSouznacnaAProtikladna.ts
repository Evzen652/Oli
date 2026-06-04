import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface QA { q: string; a: string; opts: string[] }

const POOL: QA[] = [
  { q: "Které slovo má PODOBNÝ význam jako 'radost'?", a: "štěstí", opts: ["štěstí", "smutek", "strach", "únava"] },
  { q: "Které slovo má OPAČNÝ význam jako 'velký'?", a: "malý", opts: ["malý", "obrovský", "veliký", "velký"] },
  { q: "Které slovo má PODOBNÝ význam jako 'hezký'?", a: "pěkný", opts: ["pěkný", "ošklivý", "škaredý", "strašný"] },
  { q: "Které slovo má OPAČNÝ význam jako 'rychlý'?", a: "pomalý", opts: ["pomalý", "rychlejší", "spěšný", "bleskový"] },
  { q: "Které slovo má PODOBNÝ význam jako 'dům'?", a: "obydlí", opts: ["obydlí", "škola", "auto", "les"] },
  { q: "Které slovo má OPAČNÝ význam jako 'horký'?", a: "studený", opts: ["studený", "teplý", "vlažný", "hřejivý"] },
  { q: "Které slovo má PODOBNÝ význam jako 'jíst'?", a: "pojídat", opts: ["pojídat", "spát", "běžet", "pít"] },
  { q: "Které slovo má OPAČNÝ význam jako 'světlý'?", a: "tmavý", opts: ["tmavý", "jasný", "zářivý", "bílý"] },
  { q: "Které slovo má PODOBNÝ význam jako 'smutný'?", a: "nešťastný", opts: ["nešťastný", "veselý", "šťastný", "spokojený"] },
  { q: "Které slovo má OPAČNÝ význam jako 'nový'?", a: "starý", opts: ["starý", "moderní", "čerstvý", "nedávný"] },
  { q: "Které slovo má PODOBNÝ význam jako 'mluvit'?", a: "povídat", opts: ["povídat", "poslouchat", "číst", "psát"] },
  { q: "Které slovo má OPAČNÝ význam jako 'tvrdý'?", a: "měkký", opts: ["měkký", "pevný", "tuhý", "kamenný"] },
  { q: "Které slovo má PODOBNÝ význam jako 'les'?", a: "háj", opts: ["háj", "louka", "pole", "zahrada"] },
  { q: "Které slovo má OPAČNÝ význam jako 'začátek'?", a: "konec", opts: ["konec", "střed", "přestávka", "úvod"] },
  { q: "Které slovo má PODOBNÝ význam jako 'přítel'?", a: "kamarád", opts: ["kamarád", "nepřítel", "soused", "žák"] },
  { q: "Které slovo má OPAČNÝ význam jako 'otevřený'?", a: "zavřený", opts: ["zavřený", "pootevřený", "otevíravý", "rozevřený"] },
  { q: "Které slovo má PODOBNÝ význam jako 'cesta'?", a: "silnice", opts: ["silnice", "zahrada", "pole", "les"] },
  { q: "Které slovo má OPAČNÝ význam jako 'nahoru'?", a: "dolů", opts: ["dolů", "doprava", "vlevo", "dopředu"] },
  { q: "Jaké synonymum lze použít místo slova 'říci' ve větě 'Jan říci pravdu'?", a: "sdělit", opts: ["sdělit", "skrýt", "zapsat", "zamlčet"] },
  { q: "Které slovo má OPAČNÝ význam jako 'silný'?", a: "slabý", opts: ["slabý", "mocný", "svalnatý", "výkonný"] },
  { q: "Které slovo má PODOBNÝ význam jako 'unavený'?", a: "vyčerpaný", opts: ["vyčerpaný", "odpočatý", "svěží", "čilý"] },
  { q: "Které slovo má OPAČNÝ význam jako 'plný'?", a: "prázdný", opts: ["prázdný", "přeplněný", "naplněný", "obsazený"] },
  { q: "Které slovo má PODOBNÝ význam jako 'chytrý'?", a: "šikovný", opts: ["šikovný", "hloupý", "pomalý", "líný"] },
  { q: "Které slovo má OPAČNÝ význam jako 'ráno'?", a: "večer", opts: ["večer", "poledne", "odpoledne", "přestávka"] },
  { q: "Které slovo má PODOBNÝ význam jako 'peníze'?", a: "hotovost", opts: ["hotovost", "dluh", "cena", "zboží"] },
  { q: "Které slovo má OPAČNÝ význam jako 'letět'?", a: "přistát", opts: ["přistát", "vzlétnout", "stoupat", "plachtit"] },
  { q: "Které slovo má PODOBNÝ význam jako 'modrý'?", a: "azurový", opts: ["azurový", "červený", "zelený", "žlutý"] },
  { q: "Které slovo má OPAČNÝ význam jako 'přijít'?", a: "odejít", opts: ["odejít", "přijet", "dorazit", "přiběhnout"] },
  { q: "Vyberte synonymum pro slovo 'dítě' ve větě 'Dítě si hraje na zahradě.'", a: "dítko", opts: ["dítko", "dospělý", "starec", "rodič"] },
  { q: "Které slovo má OPAČNÝ význam jako 'pravý'?", a: "levý", opts: ["levý", "přímý", "správný", "pravdivý"] },
  { q: "Které slovo má PODOBNÝ význam jako 'auto'?", a: "vůz", opts: ["vůz", "vlak", "letadlo", "loď"] },
  { q: "Které slovo má OPAČNÝ význam jako 'čistý'?", a: "špinavý", opts: ["špinavý", "bílý", "umytý", "svěží"] },
  { q: "Která dvojice jsou synonyma (slova s podobným významem)?", a: "dům — obydlí", opts: ["dům — obydlí", "dům — les", "dům — auto", "dům — škola"] },
  { q: "Která dvojice jsou antonyma (slova s opačným významem)?", a: "den — noc", opts: ["den — noc", "den — ráno", "den — světlo", "den — čas"] },
  { q: "Které synonymum se hodí ve větě: 'Byl to ___ výlet.' (místo slova pěkný)?", a: "krásný", opts: ["krásný", "ošklivý", "nudný", "špatný"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL.slice(0, 15) : level === 2 ? POOL.slice(15, 30) : POOL;
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "Synonyma = slova s podobným významem (radost = štěstí).",
      "Antonyma = slova s opačným významem (velký × malý).",
    ],
    solutionSteps: [
      "Přemýšlíš, zda hledáš slovo podobného nebo opačného významu.",
      "Zkus větu: 'Místo toho slova mohu říci ___.' Dává to smysl?",
    ],
  }));
}

export const SLOVASOUZNACNAPROTIKLADNA: TopicMetadata[] = [
  {
    id: "g3-cjl-jazykova-vychova-nauka-o-slove-slova-souznacna-synonyma-a-protikladna-antonyma",
    rvpNodeId: "g3-cjl-jazykova-vychova-nauka-o-slove-slova-souznacna-synonyma-a-protikladna-antonyma",
    title: "Slova souznačná (synonyma) a protikladná (antonyma)",
    studentTitle: "Podobná a opačná slova",
    illustrationDesc: "dvě skupiny balónků — jedna s nápisy radost a štěstí (synonyma), druhá velký a malý s šipkami mezi nimi (antonyma), kreslené postavičky s výrazy obličejů",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Nauka o slově",
    briefDescription: "Poznáš slova s podobným i opačným významem a správně je použiješ.",
    keywords: ["synonyma", "antonyma", "souznačná slova", "protikladná slova", "význam slov"],
    goals: [
      "Rozpoznat synonyma (slova podobného významu).",
      "Rozpoznat antonyma (slova opačného významu).",
      "Vybrat vhodné synonymum ve větě.",
    ],
    boundaries: ["Základní slovní zásoba 3. ročníku", "Bez homonym a polysémie"],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Synonyma: radost = štěstí, hezký = pěkný. Antonyma: velký × malý, nový × starý.",
      steps: [
        "Přečti slovo a rozmysli, jaký má význam.",
        "Synonym: hledáš slovo, které říká totéž. Antonum: hledáš slovo s opačným významem.",
      ],
      commonMistake: "Záměna: hledat antonymum, ale vybrat synonymum (nebo naopak). Pozor na zadání — 'podobný' nebo 'opačný'?",
      example: "Synonymum k 'radost': štěstí, veselí, potěšení. Antonymum k 'radost': smutek, zármutek.",
    },
  },
];
