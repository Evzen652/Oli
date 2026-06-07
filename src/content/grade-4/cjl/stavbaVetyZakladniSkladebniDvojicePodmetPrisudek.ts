import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface QA { q: string; a: string; opts: string[]; e: string }

const POOL_L1: QA[] = [
  { q: "Urči podmět ve větě: 'Petr čte knihu.'", a: "Petr", opts: ["Petr", "čte", "knihu", "žádný"], e: "Podmět je ten, kdo koná děj. Zeptáme se KDO čte? — Petr. Slovo 'čte' je přísudek (děj) a 'knihu' je to, co Petr čte, tedy předmět, ne podmět." },
  { q: "Co je přísudek ve větě: 'Kočka spí na pohovce'?", a: "spí", opts: ["spí", "kočka", "pohovce", "na"], e: "Přísudek vyjadřuje, co podmět dělá nebo jaký je. Zeptáme se CO DĚLÁ kočka? — spí. Slovo 'kočka' je podmět a 'na pohovce' jen říká, kde se to děje." },
  { q: "Urči podmět ve větě: 'Pes štěká na souseda.'", a: "Pes", opts: ["Pes", "štěká", "souseda", "na"], e: "Zeptáme se KDO štěká? — pes, proto je pes podmět. 'Štěká' je přísudek (děj) a 'na souseda' jen doplňuje, na koho pes štěká." },
  { q: "Co je přísudek ve větě: 'Ptáci letí na jih'?", a: "letí", opts: ["letí", "ptáci", "jih", "na"], e: "Přísudek je sloveso, které vyjadřuje děj. CO DĚLAJÍ ptáci? — letí. 'Ptáci' jsou podmět (kdo koná) a 'na jih' říká, kam letí." },
  { q: "Urči podmět ve větě: 'Jana píše dopis.'", a: "Jana", opts: ["Jana", "píše", "dopis", "žádný"], e: "Zeptáme se KDO píše? — Jana, to je podmět. 'Píše' je přísudek a 'dopis' je to, co Jana píše, tedy předmět." },
  { q: "Co je přísudek ve větě: 'Slunce svítí jasně'?", a: "svítí", opts: ["svítí", "slunce", "jasně", "den"], e: "Přísudek vyjadřuje děj — CO DĚLÁ slunce? — svítí. 'Slunce' je podmět a slovo 'jasně' jen popisuje, jak svítí." },
  { q: "Urči podmět ve větě: 'Psi běhají po louce.'", a: "Psi", opts: ["Psi", "běhají", "louce", "po"], e: "KDO běhá? — psi, proto jsou psi podmět. 'Běhají' je přísudek (děj) a 'po louce' říká, kde běhají." },
  { q: "Co je přísudek ve větě: 'Maminka vaří oběd'?", a: "vaří", opts: ["vaří", "maminka", "oběd", "dnes"], e: "CO DĚLÁ maminka? — vaří, to je přísudek. 'Maminka' je podmět a 'oběd' je to, co vaří, tedy předmět." },
  { q: "Urči podmět ve větě: 'Žáci odpovídají na otázky.'", a: "Žáci", opts: ["Žáci", "odpovídají", "otázky", "na"], e: "KDO odpovídá? — žáci, proto jsou žáci podmět. 'Odpovídají' je přísudek a 'na otázky' doplňuje, na co odpovídají." },
  { q: "Co je přísudek ve větě: 'Ryba plave ve vodě'?", a: "plave", opts: ["plave", "ryba", "vodě", "ve"], e: "Přísudek je sloveso vyjadřující děj — CO DĚLÁ ryba? — plave. 'Ryba' je podmět a 've vodě' říká, kde plave." },
  { q: "Na co se ptáme na podmět?", a: "Kdo? Co?", opts: ["Kdo? Co?", "Co dělá?", "Kde? Kdy?", "Jaký? Jaká?"], e: "Na podmět se ptáme otázkou KDO? nebo CO?, protože hledáme původce děje. Otázka 'Co dělá?' patří k přísudku a 'Kde? Kdy?' k příslovečnému určení." },
  { q: "Na co se ptáme na přísudek?", a: "Co dělá? Co je?", opts: ["Co dělá? Co je?", "Kdo? Co?", "Kde? Kdy?", "Čí? Jaký?"], e: "Na přísudek se ptáme CO DĚLÁ? nebo CO JE?, protože hledáme děj nebo stav podmětu. Otázka 'Kdo? Co?' patří k podmětu a 'Čí? Jaký?' k přívlastku." },
  { q: "Urči podmět ve větě: 'Tomáš hraje fotbal.'", a: "Tomáš", opts: ["Tomáš", "hraje", "fotbal", "hřiště"], e: "KDO hraje? — Tomáš, to je podmět. 'Hraje' je přísudek a 'fotbal' je to, co Tomáš hraje, tedy předmět." },
  { q: "Co je přísudek ve větě: 'Vlaštovky se vrátily z jihu'?", a: "vrátily se", opts: ["vrátily se", "vlaštovky", "jihu", "z"], e: "Přísudek tu tvoří sloveso se zvratným 'se' — CO UDĚLALY vlaštovky? — vrátily se. 'Vlaštovky' jsou podmět a 'z jihu' říká, odkud se vrátily." },
  { q: "Co je podmět?", a: "kdo nebo co vykonává děj", opts: ["kdo nebo co vykonává děj", "co se děje", "kde se děj odehrává", "kdy se děj odehrává"], e: "Podmět je větný člen, který označuje původce děje — kdo nebo co něco dělá. Možnost 'co se děje' popisuje přísudek a zbylé možnosti se týkají místa a času." },
  { q: "Co je přísudek?", a: "co podmět dělá nebo jaký je", opts: ["co podmět dělá nebo jaký je", "kdo koná děj", "kde se děj odehrává", "jakou má podmět vlastnost"], e: "Přísudek vyjadřuje, co podmět dělá nebo jaký je — je to děj nebo stav věty. Možnost 'kdo koná děj' je podmět a zbylé možnosti se týkají místa a vlastnosti." },
];

const POOL_L2: QA[] = [
  { q: "Věta 'Jdeme do kina.' má nevyjádřený podmět. Jaký?", a: "my (jdeme = my)", opts: ["my (jdeme = my)", "já", "vy", "oni"], e: "Podmět tu není vyslovený, ale poznáme ho z koncovky slovesa. 'Jdeme' znamená, že děj koná víc lidí včetně mluvčího — tedy MY. Pro 'já' by bylo jdu, pro 'vy' jdete." },
  { q: "Urči podmět ve větě: 'Přišel jsem pozdě.'", a: "já (nevyjádřený)", opts: ["já (nevyjádřený)", "přišel", "pozdě", "jsem"], e: "Podmět není vyslovený, ale 'přišel jsem' prozrazuje, že mluvčí mluví sám o sobě — tedy JÁ. 'Přišel jsem' je přísudek a 'pozdě' říká, jak přišel." },
  { q: "Co je přísudek ve větě: 'Ona je hodná žačka'?", a: "je", opts: ["je", "ona", "hodná", "žačka"], e: "Přísudek tvoří sloveso 'je' spolu se jménem 'hodná žačka' — vyjadřuje, jaký podmět je. Zde se ptáme na samotné sloveso: CO JE? — je. 'Ona' je podmět." },
  { q: "Věta 'Čteme potichu.' — jaký je podmět?", a: "my (nevyjádřený)", opts: ["my (nevyjádřený)", "čteme", "potichu", "já"], e: "Podmět není vyslovený, ale koncovka slovesa 'čteme' ukazuje na MY. Pro 'já' by bylo čtu. 'Čteme' je přísudek a 'potichu' říká, jak čteme." },
  { q: "Urči podmět ve větě: 'Celá třída zpívala píseň.'", a: "třída", opts: ["třída", "zpívala", "píseň", "celá"], e: "KDO zpíval? — třída, proto je třída podmět. 'Celá' je jen přívlastek, který blíže určuje třídu, 'zpívala' je přísudek a 'píseň' předmět." },
  { q: "Co je přísudek ve větě: 'Děti byly unavené po výletě'?", a: "byly unavené", opts: ["byly unavené", "děti", "výletě", "po"], e: "Přísudek vyjadřuje, jaký podmět je, a tvoří ho sloveso 'byly' se jménem 'unavené'. 'Děti' jsou podmět a 'po výletě' říká, kdy byly unavené." },
  { q: "Věta 'Pošli mi zprávu.' — jaký je podmět?", a: "ty (nevyjádřený — rozkaz)", opts: ["ty (nevyjádřený — rozkaz)", "já", "pošli", "zprávu"], e: "Rozkaz 'pošli' míří na jednu osobu, které něco přikazujeme — tedy TY, i když není vyslovené. 'Pošli' je přísudek a 'zprávu' to, co má poslat." },
  { q: "Urči podmět ve větě: 'Moje babička plete svetr.'", a: "babička", opts: ["babička", "plete", "svetr", "moje"], e: "KDO plete? — babička, proto je babička podmět. 'Moje' je jen přívlastek, 'plete' je přísudek a 'svetr' je to, co plete." },
  { q: "Věta 'Prší.' — jaký je podmět?", a: "podmět chybí (neosobní sloveso)", opts: ["podmět chybí (neosobní sloveso)", "déšť", "nebe", "nevyjádřený"], e: "Sloveso 'prší' je neosobní — neexistuje nikdo, kdo by děj konal, proto věta podmět vůbec nemá. Není to nevyjádřený podmět, ten by se dal doplnit (např. my), tady to nejde." },
  { q: "Co je přísudek ve větě: 'Honza se stal kapitánem'?", a: "stal se", opts: ["stal se", "Honza", "kapitánem", "se"], e: "Přísudek tu tvoří sloveso se zvratným 'se' — CO UDĚLAL Honza? — stal se. 'Honza' je podmět a 'kapitánem' doplňuje, čím se stal." },
  { q: "Urči podmět ve větě: 'Sníh pokryl střechy domů.'", a: "Sníh", opts: ["Sníh", "pokryl", "střechy", "domů"], e: "Podmět nemusí být jen člověk — KDO nebo CO pokryl střechy? — sníh. 'Pokryl' je přísudek a 'střechy' je to, co sníh pokryl." },
  { q: "Co je přísudek ve větě: 'Vlak přijel přesně na čas'?", a: "přijel", opts: ["přijel", "vlak", "čas", "přesně"], e: "CO UDĚLAL vlak? — přijel, to je přísudek. 'Vlak' je podmět a slova 'přesně na čas' jen říkají, kdy přijel." },
  { q: "Základní skladební dvojice tvoří:", a: "podmět + přísudek", opts: ["podmět + přísudek", "podmět + předmět", "přísudek + příslovce", "přívlastek + podstatné jméno"], e: "Základní skladební dvojice je dvojice podmět a přísudek, na které stojí každá věta. Předmět ani příslovce do základní dvojice nepatří, jsou to jen rozvíjející členy." },
  { q: "Urči podmět ve větě: 'Starší sestra pomáhá s úkoly.'", a: "sestra", opts: ["sestra", "pomáhá", "úkoly", "starší"], e: "KDO pomáhá? — sestra, proto je sestra podmět. 'Starší' je jen přívlastek, 'pomáhá' je přísudek a 's úkoly' doplňuje, s čím pomáhá." },
  { q: "Co je přísudek ve větě: 'Kniha leží na stole'?", a: "leží", opts: ["leží", "kniha", "stole", "na"], e: "CO DĚLÁ kniha? — leží, to je přísudek. 'Kniha' je podmět a 'na stole' říká, kde leží." },
  { q: "Urči podmět ve větě: 'Komu pomáháme?' (z věty: Pomáháme sousedce.)", a: "my (nevyjádřený)", opts: ["my (nevyjádřený)", "sousedce", "pomáháme", "já"], e: "Podmět není vyslovený, ale koncovka slovesa 'pomáháme' ukazuje na MY. 'Sousedce' je ten, komu pomáháme, tedy předmět, ne podmět." },
];

const POOL_L3: QA[] = [
  { q: "Věta 'Mrzí mě tvá chyba.' — jaký je podmět?", a: "chyba (to, co mrzí)", opts: ["chyba (to, co mrzí)", "mě", "mrzí", "tvá"], e: "Podmět nemusí stát na začátku věty. CO mě mrzí? — chyba, proto je chyba podmět. Slovo 'mě' je předmět (koho to mrzí) a 'mrzí' je přísudek." },
  { q: "Co je přísudek ve větě: 'Bratr se jmenuje Pavel'?", a: "jmenuje se", opts: ["jmenuje se", "bratr", "Pavel", "se"], e: "Přísudek tu tvoří sloveso se zvratným 'se' — CO DĚLÁ bratr? — jmenuje se. 'Bratr' je podmět a 'Pavel' doplňuje, jak se jmenuje." },
  { q: "Urči podmět ve větě: 'Závodníci se připravují na start.'", a: "Závodníci", opts: ["Závodníci", "připravují", "start", "se"], e: "KDO se připravuje? — závodníci, proto jsou podmět. 'Připravují se' je přísudek a 'na start' říká, na co se připravují." },
  { q: "Věta 'Bylo mu smutno.' — jaký je podmět?", a: "podmět chybí (neosobní)", opts: ["podmět chybí (neosobní)", "mu", "bylo", "smutno"], e: "Tato věta vyjadřuje stav a nemá nikoho, kdo by děj konal — je neosobní, proto podmět chybí. 'Mu' jen říká, komu bylo smutno, není to podmět." },
  { q: "Co je přísudek ve větě: 'Petr bude číst celý večer'?", a: "bude číst", opts: ["bude číst", "Petr", "večer", "celý"], e: "Přísudek může být tvořen dvěma slovesy — 'bude číst' je budoucí čas. 'Petr' je podmět a 'celý večer' říká, jak dlouho bude číst." },
  { q: "Urči podmět ve větě: 'Tichý les skrývá mnoho tajemství.'", a: "les", opts: ["les", "skrývá", "tajemství", "tichý"], e: "CO skrývá tajemství? — les, proto je les podmět. 'Tichý' je jen přívlastek, 'skrývá' je přísudek a 'tajemství' předmět." },
  { q: "Co je přísudek ve větě: 'Výsledky byly lepší než minulý rok'?", a: "byly lepší", opts: ["byly lepší", "výsledky", "rok", "minulý"], e: "Přísudek vyjadřuje, jaký podmět je, a tvoří ho sloveso 'byly' se jménem 'lepší'. 'Výsledky' jsou podmět a 'než minulý rok' je srovnání." },
  { q: "Věta 'Nemám čas.' — jaký je podmět?", a: "já (nevyjádřený)", opts: ["já (nevyjádřený)", "čas", "nemám", "žádný"], e: "Podmět není vyslovený, ale koncovka slovesa 'nemám' ukazuje na JÁ. 'Čas' je to, co nemám, tedy předmět, ne podmět." },
  { q: "Urči podmět ve větě: 'Naše škola slaví výročí.'", a: "škola", opts: ["škola", "slaví", "výročí", "naše"], e: "CO slaví výročí? — škola, proto je škola podmět. 'Naše' je přívlastek, 'slaví' je přísudek a 'výročí' předmět." },
  { q: "Co je přísudek ve větě: 'Závodnice dosáhla světového rekordu'?", a: "dosáhla", opts: ["dosáhla", "závodnice", "rekordu", "světového"], e: "CO UDĚLALA závodnice? — dosáhla, to je přísudek. 'Závodnice' je podmět a 'světového rekordu' doplňuje, čeho dosáhla." },
  { q: "Věta 'Svítá.' — jaký je podmět?", a: "podmět chybí (neosobní)", opts: ["podmět chybí (neosobní)", "slunce", "den", "nevyjádřený"], e: "Sloveso 'svítá' je neosobní — nikdo děj nekoná, proto věta podmět vůbec nemá. Nedá se doplnit ani slovo slunce, věta funguje sama o sobě." },
  { q: "Co je přísudek ve větě: 'Ona se stala ředitelkou školy'?", a: "stala se", opts: ["stala se", "ona", "ředitelkou", "školy"], e: "Přísudek tvoří sloveso se zvratným 'se' — CO UDĚLALA? — stala se. 'Ona' je podmět a 'ředitelkou školy' doplňuje, čím se stala." },
  { q: "Urči podmět ve větě: 'Chladný vítr fouká od severu.'", a: "vítr", opts: ["vítr", "fouká", "severu", "chladný"], e: "CO fouká? — vítr, proto je vítr podmět. 'Chladný' je přívlastek, 'fouká' je přísudek a 'od severu' říká, odkud fouká." },
  { q: "Věta 'Musíme odejít.' — jaký je podmět?", a: "my (nevyjádřený)", opts: ["my (nevyjádřený)", "odejít", "musíme", "já"], e: "Podmět není vyslovený, ale koncovka slovesa 'musíme' ukazuje na MY. Pro 'já' by bylo musím. 'Musíme odejít' je přísudek." },
  { q: "Co je přísudek ve větě: 'Kašel ho trápil celou noc'?", a: "trápil", opts: ["trápil", "kašel", "noc", "ho"], e: "CO DĚLAL kašel? — trápil, to je přísudek. 'Kašel' je podmět (co trápilo), 'ho' je předmět a 'celou noc' říká, jak dlouho." },
  { q: "Věta 'Zpívejte!' — jaký je podmět?", a: "vy (nevyjádřený — rozkaz)", opts: ["vy (nevyjádřený — rozkaz)", "my", "oni", "žádný"], e: "Rozkaz 'zpívejte' míří na víc osob, kterým něco přikazujeme — tedy VY, i když není vysloveno. Pro jednu osobu by rozkaz zněl zpívej." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "Podmět = kdo nebo co vykonává děj → ptáme se KDO? CO?",
      "Přísudek = co podmět dělá nebo jaký je → ptáme se CO DĚLÁ?",
      "Podmět může být nevyjádřený (schovaný v koncovce slovesa)",
    ],
    explanation: e,
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
