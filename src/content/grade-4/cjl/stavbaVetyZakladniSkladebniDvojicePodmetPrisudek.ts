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

const POOL_L1: QA[] = [
  { q: "Urči podmět ve větě: 'Petr čte knihu.'", a: "Petr", opts: ["Petr", "čte", "knihu", "žádný"] },
  { q: "Co je přísudek ve větě: 'Kočka spí na pohovce'?", a: "spí", opts: ["spí", "kočka", "pohovce", "na"] },
  { q: "Urči podmět ve větě: 'Pes štěká na souseda.'", a: "Pes", opts: ["Pes", "štěká", "souseda", "na"] },
  { q: "Co je přísudek ve větě: 'Ptáci letí na jih'?", a: "letí", opts: ["letí", "ptáci", "jih", "na"] },
  { q: "Urči podmět ve větě: 'Jana píše dopis.'", a: "Jana", opts: ["Jana", "píše", "dopis", "žádný"] },
  { q: "Co je přísudek ve větě: 'Slunce svítí jasně'?", a: "svítí", opts: ["svítí", "slunce", "jasně", "den"] },
  { q: "Urči podmět ve větě: 'Psi běhají po louce.'", a: "Psi", opts: ["Psi", "běhají", "louce", "po"] },
  { q: "Co je přísudek ve větě: 'Maminka vaří oběd'?", a: "vaří", opts: ["vaří", "maminka", "oběd", "dnes"] },
  { q: "Urči podmět ve větě: 'Žáci odpovídají na otázky.'", a: "Žáci", opts: ["Žáci", "odpovídají", "otázky", "na"] },
  { q: "Co je přísudek ve větě: 'Ryba plave ve vodě'?", a: "plave", opts: ["plave", "ryba", "vodě", "ve"] },
  { q: "Na co se ptáme na podmět?", a: "Kdo? Co?", opts: ["Kdo? Co?", "Co dělá?", "Kde? Kdy?", "Jaký? Jaká?"] },
  { q: "Na co se ptáme na přísudek?", a: "Co dělá? Co je?", opts: ["Co dělá? Co je?", "Kdo? Co?", "Kde? Kdy?", "Čí? Jaký?"] },
  { q: "Urči podmět ve větě: 'Tomáš hraje fotbal.'", a: "Tomáš", opts: ["Tomáš", "hraje", "fotbal", "hřiště"] },
  { q: "Co je přísudek ve větě: 'Vlaštovky se vrátily z jihu'?", a: "vrátily se", opts: ["vrátily se", "vlaštovky", "jihu", "z"] },
  { q: "Co je podmět?", a: "kdo nebo co vykonává děj", opts: ["kdo nebo co vykonává děj", "co se děje", "kde se děj odehrává", "kdy se děj odehrává"] },
  { q: "Co je přísudek?", a: "co podmět dělá nebo jaký je", opts: ["co podmět dělá nebo jaký je", "kdo koná děj", "kde se děj odehrává", "jakou má podmět vlastnost"] },
];

const POOL_L2: QA[] = [
  { q: "Věta 'Jdeme do kina.' má nevyjádřený podmět. Jaký?", a: "my (jdeme = my)", opts: ["my (jdeme = my)", "já", "vy", "oni"] },
  { q: "Urči podmět ve větě: 'Přišel jsem pozdě.'", a: "já (nevyjádřený)", opts: ["já (nevyjádřený)", "přišel", "pozdě", "jsem"] },
  { q: "Co je přísudek ve větě: 'Ona je hodná žačka'?", a: "je", opts: ["je", "ona", "hodná", "žačka"] },
  { q: "Věta 'Čteme potichu.' — jaký je podmět?", a: "my (nevyjádřený)", opts: ["my (nevyjádřený)", "čteme", "potichu", "já"] },
  { q: "Urči podmět ve větě: 'Celá třída zpívala píseň.'", a: "třída", opts: ["třída", "zpívala", "píseň", "celá"] },
  { q: "Co je přísudek ve větě: 'Děti byly unavené po výletě'?", a: "byly unavené", opts: ["byly unavené", "děti", "výletě", "po"] },
  { q: "Věta 'Pošli mi zprávu.' — jaký je podmět?", a: "ty (nevyjádřený — rozkaz)", opts: ["ty (nevyjádřený — rozkaz)", "já", "pošli", "zprávu"] },
  { q: "Urči podmět ve větě: 'Moje babička plete svetr.'", a: "babička", opts: ["babička", "plete", "svetr", "moje"] },
  { q: "Věta 'Prší.' — jaký je podmět?", a: "podmět chybí (neosobní sloveso)", opts: ["podmět chybí (neosobní sloveso)", "déšť", "nebe", "nevyjádřený"] },
  { q: "Co je přísudek ve větě: 'Honza se stal kapitánem'?", a: "stal se", opts: ["stal se", "Honza", "kapitánem", "se"] },
  { q: "Urči podmět ve větě: 'Sníh pokryl střechy domů.'", a: "Sníh", opts: ["Sníh", "pokryl", "střechy", "domů"] },
  { q: "Co je přísudek ve větě: 'Vlak přijel přesně na čas'?", a: "přijel", opts: ["přijel", "vlak", "čas", "přesně"] },
  { q: "Základní skladební dvojice tvoří:", a: "podmět + přísudek", opts: ["podmět + přísudek", "podmět + předmět", "přísudek + příslovce", "přívlastek + podstatné jméno"] },
  { q: "Urči podmět ve větě: 'Starší sestra pomáhá s úkoly.'", a: "sestra", opts: ["sestra", "pomáhá", "úkoly", "starší"] },
  { q: "Co je přísudek ve větě: 'Kniha leží na stole'?", a: "leží", opts: ["leží", "kniha", "stole", "na"] },
  { q: "Urči podmět ve větě: 'Komu pomáháme?' (z věty: Pomáháme sousedce.)", a: "my (nevyjádřený)", opts: ["my (nevyjádřený)", "sousedce", "pomáháme", "já"] },
];

const POOL_L3: QA[] = [
  { q: "Věta 'Mrzí mě tvá chyba.' — jaký je podmět?", a: "chyba (to, co mrzí)", opts: ["chyba (to, co mrzí)", "mě", "mrzí", "tvá"] },
  { q: "Co je přísudek ve větě: 'Bratr se jmenuje Pavel'?", a: "jmenuje se", opts: ["jmenuje se", "bratr", "Pavel", "se"] },
  { q: "Urči podmět ve větě: 'Závodníci se připravují na start.'", a: "Závodníci", opts: ["Závodníci", "připravují", "start", "se"] },
  { q: "Věta 'Bylo mu smutno.' — jaký je podmět?", a: "podmět chybí (neosobní)", opts: ["podmět chybí (neosobní)", "mu", "bylo", "smutno"] },
  { q: "Co je přísudek ve větě: 'Petr bude číst celý večer'?", a: "bude číst", opts: ["bude číst", "Petr", "večer", "celý"] },
  { q: "Urči podmět ve větě: 'Tichý les skrývá mnoho tajemství.'", a: "les", opts: ["les", "skrývá", "tajemství", "tichý"] },
  { q: "Co je přísudek ve větě: 'Výsledky byly lepší než minulý rok'?", a: "byly lepší", opts: ["byly lepší", "výsledky", "rok", "minulý"] },
  { q: "Věta 'Nemám čas.' — jaký je podmět?", a: "já (nevyjádřený)", opts: ["já (nevyjádřený)", "čas", "nemám", "žádný"] },
  { q: "Urči podmět ve větě: 'Naše škola slaví výročí.'", a: "škola", opts: ["škola", "slaví", "výročí", "naše"] },
  { q: "Co je přísudek ve větě: 'Závodnice dosáhla světového rekordu'?", a: "dosáhla", opts: ["dosáhla", "závodnice", "rekordu", "světového"] },
  { q: "Věta 'Svítá.' — jaký je podmět?", a: "podmět chybí (neosobní)", opts: ["podmět chybí (neosobní)", "slunce", "den", "nevyjádřený"] },
  { q: "Co je přísudek ve větě: 'Ona se stala ředitelkou školy'?", a: "stala se", opts: ["stala se", "ona", "ředitelkou", "školy"] },
  { q: "Urči podmět ve větě: 'Chladný vítr fouká od severu.'", a: "vítr", opts: ["vítr", "fouká", "severu", "chladný"] },
  { q: "Věta 'Musíme odejít.' — jaký je podmět?", a: "my (nevyjádřený)", opts: ["my (nevyjádřený)", "odejít", "musíme", "já"] },
  { q: "Co je přísudek ve větě: 'Kašel ho trápil celou noc'?", a: "trápil", opts: ["trápil", "kašel", "noc", "ho"] },
  { q: "Věta 'Zpívejte!' — jaký je podmět?", a: "vy (nevyjádřený — rozkaz)", opts: ["vy (nevyjádřený — rozkaz)", "my", "oni", "žádný"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "Podmět = kdo nebo co vykonává děj → ptáme se KDO? CO?",
      "Přísudek = co podmět dělá nebo jaký je → ptáme se CO DĚLÁ?",
      "Podmět může být nevyjádřený (schovaný v koncovce slovesa)",
    ],
    solutionSteps: [
      "Najdi sloveso (přísudek) — to je dej věty.",
      "Zeptej se KDO? CO? na sloveso — to je podmět.",
      "Pokud podmět nenajdeš, zkus ho odvodit z koncovky slovesa.",
    ],
  }));
}

export const STAVBAVETYZAKLADNISKLADEBNIDVOJICEPODMETPRISUDEK: TopicMetadata[] = [
  {
    id: "g4-cjl-jazykova-vychova-skladba-stavba-vety-zakladni-skladebni-dvojice-podmet-prisudek",
    rvpNodeId: "g4-cjl-jazykova-vychova-skladba-stavba-vety-zakladni-skladebni-dvojice-podmet-prisudek",
    title: "Stavba věty - základní skladební dvojice (podmět, přísudek)",
    studentTitle: "Podmět a přísudek",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Jazyková výchova",
    briefDescription: "Pochopíš, co je podmět a přísudek a jak je najít v každé větě.",
    keywords: ["podmět", "přísudek", "skladba", "věta", "základní skladební dvojice"],
    goals: [
      "Určit podmět a přísudek ve větě",
      "Rozpoznat nevyjádřený podmět",
      "Pochopit základní skladební dvojici",
    ],
    boundaries: ["Bez rozvíjejících větných členů", "Bez souvětí"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Podmět = KDO/CO; Přísudek = CO DĚLÁ/JE; podmět může být nevyjádřený (schovaný v koncovce slovesa)",
      steps: [
        "Najdi sloveso ve větě — to je přísudek.",
        "Zeptej se KDO? CO? na sloveso.",
        "Odpověď je podmět.",
        "Pokud podmět není vyslovený, odvoď ho z koncovky (jdeme = my).",
      ],
      commonMistake: "Záměna podmětu a předmětu: 'Petr čte knihu' — Petr je podmět, knihu je předmět",
      example: "Petr čte knihu. Podmět: Petr (kdo čte?). Přísudek: čte.",
    },
  },
];
