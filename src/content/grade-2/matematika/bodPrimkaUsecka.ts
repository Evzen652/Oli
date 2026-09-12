import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "@/content/grade-3/_shared";

/**
 * Přepsáno 2026-09-11 (inventura obsahu). Dřív: 28 výroků Ano/Ne na všech
 * úrovních (L2/L3 = 50 % náhoda), jedna nápověda, žádná zpětná vazba a sporný
 * výrok „Bod leží na přímce. Je to pravda?“ (bez obrázku nejde rozhodnout).
 *
 * Teď oddělené banky, každé zadání je jednoznačné i bez obrázku:
 *  L1 — rozpoznání: vlastnosti bodu, přímky, polopřímky a úsečky
 *       (jednoznačné výroky Ano/Ne + výběr ze čtyř možností).
 *  L2 — aplikace: modely z okolí, krajní body, zápis útvaru (vždy 4 možnosti).
 *  L3 — transfer: co vznikne prodloužením / zkrácením, počítání úseček
 *       a přímek, vztah úsečky a přímky (vždy 4 možnosti).
 *
 * Ano/Ne je jen na L1 (CONTENT_AUTHORING §6.2); výběrové úlohy se na tématu
 * s inputType „true_false“ vykreslují jako výběr z možností (PracticeInputRouter).
 */

type Utvar = "bod" | "přímka" | "polopřímka" | "úsečka";
const UTVARY: Utvar[] = ["bod", "přímka", "polopřímka", "úsečka"];

/** Výchozí zpětná vazba: čím se chybně zvolený útvar pozná. */
const ZNAK: Record<Utvar, string> = {
  bod: "Bod je jen místo — nemá žádnou délku, není to čára.",
  přímka: "Přímka nemá žádný konec — pokračuje bez konce na obě strany.",
  polopřímka: "Polopřímka má jen jeden konec (počáteční bod), na druhou stranu pokračuje bez konce.",
  úsečka: "Úsečka má dva krajní body — začíná i končí.",
};

interface Docs {
  hints: [string, string];
  explanation: string;
}

/** Určení útvaru: chybné možnosti jsou ostatní tři útvary. */
function utvar(question: string, spravne: Utvar, docs: Docs, proc: Partial<Record<Utvar, string>> = {}): PracticeTask {
  const jine = UTVARY.filter((u) => u !== spravne).map((u) => ({ value: u, why: proc[u] ?? ZNAK[u] }));
  return choice(question, spravne, jine as [Distractor, Distractor, Distractor], docs);
}

/** Výběr ze čtyř možností s vlastním chybovým modelem. */
function vyber(question: string, spravne: string, chybne: [string, string][], docs: Docs): PracticeTask {
  return choice(question, spravne, chybne.map(([value, why]) => ({ value, why })) as [Distractor, Distractor, Distractor], docs);
}

const ANO = "Ano";
const NE = "Ne";

/** Jednoznačný výrok Ano/Ne — jen na L1. */
function vyrok(question: string, plati: boolean, proc: string, docs: Docs): PracticeTask {
  const spravne = plati ? ANO : NE;
  return {
    question,
    correctAnswer: spravne,
    options: [ANO, NE],
    optionFeedback: { [plati ? NE : ANO]: proc },
    hints: docs.hints,
    explanation: docs.explanation,
  };
}

const POCTY = ["žádný", "jeden", "dva", "nekonečně mnoho"];
function pocetBodu(question: string, spravne: string, proc: Record<string, string>, docs: Docs): PracticeTask {
  return vyber(question, spravne, POCTY.filter((p) => p !== spravne).map((p) => [p, proc[p]] as [string, string]), docs);
}

// ── L1 — rozpoznání ─────────────────────────────────────────────────────────

const L1 = (): PracticeTask[] => [
  vyrok("Úsečka má dva krajní body. Platí to?", true,
    "Úsečka opravdu začíná i končí — její krajní body jsou dva, třeba A a B.", {
      hints: [
        "Představ si čáru, kterou nakreslíš pravítkem od jedné tečky ke druhé. Kde začíná a kde končí?",
        "Úsečka je rovná čára, která někde začíná a někde končí. Spočítej místa, kde čára končí — na začátku a na konci. Tolik má krajních bodů.",
      ],
      explanation: "Úsečka má začátek i konec, to jsou její dva krajní body (třeba A a B u úsečky AB).",
    }),
  vyrok("Přímka má dva krajní body. Platí to?", false,
    "Dva krajní body má úsečka. Přímka pokračuje bez konce na obě strany.", {
      hints: [
        "Jak daleko pokračuje přímka? Končí někde?",
        "Přímka pokračuje bez konce na obě strany, na papír nakreslíš jen její kousek. Krajní body mají jen čáry, které někde končí.",
      ],
      explanation: "Přímka nemá žádný konec, a proto nemá ani krajní body. Dva krajní body má úsečka.",
    }),
  vyrok("Polopřímka má jeden počáteční bod. Platí to?", true,
    "Polopřímka opravdu má jeden počáteční bod — odtud vychází a pokračuje jedním směrem.", {
      hints: [
        "Polopřímka někde začíná. Pokračuje pak na obě strany, nebo jen jedním směrem?",
        "Polopřímka začíná v bodě a odtud pokračuje jen jedním směrem bez konce. Na druhé straně žádný konec nemá. Kolik má tedy počátečních bodů?",
      ],
      explanation: "Polopřímka začíná v jediném bodě (počátku) a pokračuje jedním směrem bez konce.",
    }),
  vyrok("Bod má délku, dá se změřit pravítkem. Platí to?", false,
    "Bod nemá délku, je to jen místo. Změřit můžeš úsečku, ne bod.", {
      hints: [
        "Bod je jen místo, kde se něco nachází. Dá se takové místo změřit?",
        "Změřit pravítkem jde jen něco, co má začátek a konec, třeba úsečka. Bod je jen místo, značíme ho tečkou nebo křížkem. Má nějakou délku?",
      ],
      explanation: "Bod je jen místo — nemá délku ani šířku, a proto se změřit nedá.",
    }),
  vyrok("Přímka je vždy rovná, nikdy není zakřivená. Platí to?", true,
    "Přímka se kreslí podle pravítka a je vždy rovná. Zakřivená čára přímkou není.", {
      hints: [
        "Čím přímku kreslíš — od ruky, nebo podle pravítka?",
        "Přímku, polopřímku i úsečku kreslíme podle pravítka. Zakřivená čára, třeba oblouk, je jiná čára. Jaká tedy přímka je?",
      ],
      explanation: "Přímka je vždy rovná, proto se kreslí podle pravítka. Zakřivená čára přímkou není.",
    }),
  vyrok("Body označujeme velkými tiskacími písmeny. Platí to?", true,
    "Body se opravdu značí velkými písmeny (A, B, C). Malá písmena patří přímkám.", {
      hints: [
        "Vzpomeň si, jak se jmenují body u úsečky AB. Jaká jsou to písmena?",
        "U úsečky AB se krajní body jmenují A a B. Podívej se, jestli jsou to velká, nebo malá písmena. Malými písmeny (p, q) se označují přímky.",
      ],
      explanation: "Body označujeme velkými tiskacími písmeny, třeba A, B, C. Malými písmeny značíme přímky.",
    }),
  vyrok("Přímku můžeme celou změřit pravítkem. Platí to?", false,
    "Přímka pokračuje bez konce, celou ji změřit nejde. Změřit se dá úsečka.", {
      hints: [
        "Kde přímka končí? Dá se změřit něco, co nekončí?",
        "Změřit můžeš jen čáru, která má začátek i konec. Přímka pokračuje bez konce na obě strany, na papíře vidíš jen její kousek. Jde tedy změřit celá?",
      ],
      explanation: "Přímka nemá konec, a proto nemá ani délku. Změřit můžeš jen úsečku.",
    }),
  vyrok("Úsečka pokračuje bez konce na obě strany. Platí to?", false,
    "Bez konce pokračuje přímka. Úsečka začíná i končí ve svých krajních bodech.", {
      hints: [
        "Má úsečka AB konec? Kde leží bod B?",
        "Úsečka AB začíná v bodě A a končí v bodě B, dál už nepokračuje. Bez konce na obě strany pokračuje jiný útvar — přímka.",
      ],
      explanation: "Úsečka má dva krajní body, kde začíná a končí. Bez konce na obě strany pokračuje přímka.",
    }),
  utvar("Který útvar má dva krajní body?", "úsečka", {
    hints: [
      "Hledáš čáru, která začíná i končí. Kolik konců má každý útvar?",
      "Projdi možnosti: jedna čára nekončí nikde, druhá má jen jeden konec a bod není čára vůbec. Který útvar nakreslíš od jedné tečky ke druhé?",
    ],
    explanation: "Úsečka začíná i končí, její dva krajní body jsou třeba A a B.",
  }),
  utvar("Který útvar pokračuje bez konce na obě strany?", "přímka", {
    hints: [
      "Hledáš čáru, která nikde nekončí — ani vlevo, ani vpravo.",
      "Úsečka má dva konce. Předpona „polo-“ znamená „napůl“: taková čára má jeden konec. Která čára nemá vůbec žádný konec?",
    ],
    explanation: "Přímka nemá žádný konec, pokračuje bez konce na obě strany.",
  }),
  utvar("Který útvar začíná v bodě a pokračuje jedním směrem bez konce?", "polopřímka", {
    hints: [
      "Čára má začátek, ale na druhé straně nekončí. Kolik má tedy konců?",
      "Jeden konec má „poloviční“ přímka: začne v bodě a jde jedním směrem pořád dál. Úsečka má konce dva, přímka nemá žádný.",
    ],
    explanation: "Polopřímka začíná v jednom bodě a pokračuje jedním směrem bez konce.",
  }),
  utvar("Který útvar je jen místo a nemá žádnou délku?", "bod", {
    hints: [
      "Hledáš něco, co vůbec není čára. Co značíme tečkou nebo křížkem?",
      "Každá čára (úsečka, přímka i polopřímka) má nějakou délku, nebo dokonce pokračuje bez konce. Jen jeden útvar je pouhé místo a označujeme ho velkým písmenem, třeba A.",
    ],
    explanation: "Bod je jen místo. Nemá délku ani šířku, značíme ho tečkou nebo křížkem a velkým písmenem.",
  }),
  utvar("Délku kterého útvaru změříš pravítkem?", "úsečka", {
    hints: [
      "Změřit jde jen čára, která začíná i končí. Která to je?",
      "Přímka a polopřímka pokračují bez konce, takže je celé nezměříš. Bod nemá délku vůbec. Zbývá čára se dvěma krajními body.",
    ],
    explanation: "Úsečka má dva krajní body, a proto má délku, kterou změříš pravítkem.",
  }, {
    přímka: "Přímka pokračuje bez konce na obě strany, celou ji změřit nejde.",
    polopřímka: "Polopřímka na jedné straně nekončí, celou ji změřit nejde.",
    bod: "Bod je jen místo, žádnou délku nemá.",
  }),
  pocetBodu("Kolik krajních bodů má úsečka?", "dva", {
    žádný: "Žádný krajní bod nemá přímka. Úsečka začíná i končí.",
    jeden: "Jeden počáteční bod má polopřímka. Úsečka končí na obou stranách.",
    "nekonečně mnoho": "Bodů leží na úsečce nekonečně mnoho, krajní jsou ale jen ty na koncích.",
  }, {
    hints: [
      "Kde úsečka AB začíná a kde končí?",
      "Krajní body jsou tam, kde čára končí. Úsečka AB začíná v bodě A a končí v bodě B. Spočítej je.",
    ],
    explanation: "Úsečka začíná i končí, má tedy dva krajní body (A a B).",
  }),
  pocetBodu("Kolik krajních bodů má přímka?", "žádný", {
    jeden: "Jeden počáteční bod má polopřímka. Přímka nekončí ani na jedné straně.",
    dva: "Dva krajní body má úsečka. Přímka pokračuje bez konce.",
    "nekonečně mnoho": "Bodů leží na přímce nekonečně mnoho, ale žádný z nich není krajní — přímka nekončí.",
  }, {
    hints: [
      "Končí přímka někde vlevo nebo vpravo?",
      "Krajní bod je místo, kde čára končí. Přímka pokračuje bez konce na obě strany — najdeš na ní takové místo?",
    ],
    explanation: "Přímka nikde nekončí, a proto nemá žádný krajní bod.",
  }),
  pocetBodu("Kolik počátečních bodů má polopřímka?", "jeden", {
    žádný: "Bez konce je polopřímka jen na jedné straně. Na druhé má počáteční bod.",
    dva: "Dva krajní body má úsečka. Polopřímka na jedné straně nekončí.",
    "nekonečně mnoho": "Bodů leží na polopřímce nekonečně mnoho, ale počáteční je jen ten, kde začíná.",
  }, {
    hints: [
      "Kde polopřímka začíná? A končí někde na druhé straně?",
      "Polopřímka někde začíná a na druhou stranu pokračuje bez konce. Počáteční bod je místo, kde začíná. Začíná na obou koncích, nebo jen na jednom?",
    ],
    explanation: "Polopřímka začíná v jediném bodě (počátku) a na druhé straně nekončí.",
  }),
];

// ── L2 — aplikace: modely, krajní body, zápis ───────────────────────────────

const L2 = (): PracticeTask[] => [
  utvar("Napnutá šňůra mezi dvěma kolíky připomíná který útvar?", "úsečka", {
    hints: [
      "Šňůra je napnutá rovně a na obou stranách je přivázaná ke kolíku. Kde končí?",
      "Každý kolík je jeden konec šňůry. Rovná čára, která začíná u jednoho kolíku a končí u druhého, má dva krajní body. Který útvar to je?",
    ],
    explanation: "Šňůra je rovná a končí u obou kolíků — má dva konce jako úsečka.",
  }, {
    přímka: "Přímka by pokračovala bez konce, šňůra ale u kolíků končí.",
    polopřímka: "Polopřímka má jen jeden konec, šňůra je přivázaná na obou stranách.",
    bod: "Bod nemá délku, šňůra je dlouhá.",
  }),
  utvar("Paprsek z baterky svítí od žárovky pořád dál. Jaký je to útvar?", "polopřímka", {
    hints: [
      "Paprsek z baterky začíná u žárovky. Končí někde?",
      "Paprsek má začátek u žárovky a pak letí jedním směrem pořád dál. Hledej útvar s jedním koncem, který na druhou stranu nekončí.",
    ],
    explanation: "Paprsek začíná u žárovky a pokračuje jedním směrem — to je model polopřímky.",
  }, {
    úsečka: "Úsečka končí na obou stranách, paprsek od baterky letí pořád dál.",
    přímka: "Přímka nemá žádný konec, paprsek ale začíná u žárovky.",
    bod: "Bod je jen místo, paprsek je dlouhá čára.",
  }),
  utvar("Tečka od tužky na papíře představuje který útvar?", "bod", {
    hints: [
      "Má tečka nějakou délku, jako čára?",
      "Čáry jsou dlouhé: úsečka, přímka i polopřímka. Tečka neukazuje délku, ale jen místo na papíře. Který útvar je jen místo?",
    ],
    explanation: "Tečka ukazuje jen místo na papíře, proto představuje bod.",
  }, {
    úsečka: "Úsečka je čára se dvěma konci, tečka žádnou délku nemá.",
    přímka: "Přímka je nekonečná čára, tečka je jen místo.",
    polopřímka: "Polopřímka je čára s jedním koncem, tečka je jen místo.",
  }),
  utvar("Hrana stolu od rohu k rohu připomíná který útvar?", "úsečka", {
    hints: [
      "Hrana stolu začíná v jednom rohu. Kde končí?",
      "Hrana je rovná a končí v rohu stolu na obou stranách. Rovná čára se dvěma konci je útvar, který změříš pravítkem nebo metrem.",
    ],
    explanation: "Hrana stolu je rovná a má dva konce v rozích, proto připomíná úsečku.",
  }, {
    přímka: "Přímka by pokračovala bez konce, hrana stolu ale v rozích končí.",
    polopřímka: "Polopřímka má jen jeden konec, hrana stolu končí v obou rozích.",
    bod: "Bod nemá délku, hrana stolu je dlouhá.",
  }),
  utvar("Laserový paprsek z ukazovátka letí jedním směrem. Který je to útvar?", "polopřímka", {
    hints: [
      "Laser začíná u ukazovátka. Vrací se, nebo letí pořád dál?",
      "Paprsek laseru má začátek u ukazovátka a na druhé straně nekončí. Útvar s jedním koncem, který pokračuje jedním směrem, je tvoje odpověď.",
    ],
    explanation: "Laser začíná u ukazovátka a pokračuje jedním směrem bez konce — je to model polopřímky.",
  }, {
    úsečka: "Úsečka končí na obou stranách, laser na druhé straně nekončí.",
    přímka: "Přímka nemá žádný konec, laser ale začíná u ukazovátka.",
    bod: "Bod je jen místo, paprsek je dlouhý.",
  }),
  utvar("Silnice je rovná a nekončí na žádné straně. Jaký je to útvar?", "přímka", {
    hints: [
      "Silnice tady nikde nezačíná ani nekončí. Kolik má konců?",
      "Útvar bez začátku i konce kreslíme jen kouskem a značíme malým písmenem, třeba p. Úsečka má dva konce a „polo-“ znamená jen jeden. Který útvar nemá žádný?",
    ],
    explanation: "Rovná silnice bez konce na obě strany je model přímky — přímka nemá žádný konec.",
  }, {
    úsečka: "Úsečka má dva konce, tahle silnice nekončí nikde.",
    polopřímka: "Polopřímka na jedné straně začíná, tahle silnice nezačíná nikde.",
    bod: "Bod je jen místo, silnice je dlouhá.",
  }),
  utvar("Hvězda na nočním nebi vypadá jako který útvar?", "bod", {
    hints: [
      "Je hvězda na nebi vidět jako čára, nebo jako malá tečka?",
      "Z velké dálky vidíš hvězdu jen jako drobné světýlko — jako místo, ne jako čáru. Který útvar značíme tečkou nebo křížkem?",
    ],
    explanation: "Hvězda je z dálky jen malá tečka na nebi — vypadá jako bod.",
  }, {
    úsečka: "Úsečka je čára se dvěma konci, hvězda na nebi čáru netvoří.",
    přímka: "Přímka je nekonečná čára, hvězda je jen svítící místo.",
    polopřímka: "Polopřímka je čára s jedním koncem, hvězda je jen svítící místo.",
  }),
  utvar("Okraj pravítka od začátku do konce připomíná který útvar?", "úsečka", {
    hints: [
      "Pravítko má začátek i konec. Kolik konců má jeho okraj?",
      "Okraj pravítka je rovný a na obou stranách končí. Hledej útvar, který je rovný a má dva krajní body.",
    ],
    explanation: "Okraj pravítka je rovný a má dva konce, proto připomíná úsečku.",
  }, {
    přímka: "Přímka nekončí, okraj pravítka ale na obou stranách končí.",
    polopřímka: "Polopřímka má jeden konec, okraj pravítka má konce dva.",
    bod: "Bod nemá délku, okraj pravítka je dlouhý.",
  }),
  vyber("Na úsečce AB leží bod C. Které body jsou krajní?", "A a B", [
    ["A a C", "Bod C leží mezi A a B, je uvnitř úsečky. Krajní body jsou jen na koncích."],
    ["C a B", "Bod C leží uvnitř úsečky, není na jejím konci."],
    ["jen C", "C je uvnitř úsečky. Krajní body poznáš podle jména úsečky AB."],
  ], {
    hints: [
      "Krajní body jsou na koncích úsečky. Jak se úsečka jmenuje?",
      "Úsečka se jmenuje podle svých krajních bodů. Bod C na ní jen leží — je někde mezi konci. Která písmena jsou v názvu úsečky AB?",
    ],
    explanation: "Úsečka AB začíná v A a končí v B, to jsou krajní body. C leží uvnitř úsečky.",
  }),
  vyber("Úsečka má krajní body K a L. Jak ji zapíšeš?", "úsečka KL", [
    ["přímka KL", "Přímka KL by pokračovala za body K a L bez konce. Tady čára v K a L končí."],
    ["polopřímka KL", "Polopřímka by v bodě L nekončila. Čára ale končí v obou bodech."],
    ["úsečka K", "Úsečku zapisujeme oběma krajními body, ne jen jedním."],
  ], {
    hints: [
      "Čára má dva krajní body, K a L. Kolik písmen potřebuješ do zápisu?",
      "Zápis má dvě části: název útvaru a písmena bodů. Čára, která končí v K i v L, se zapíše názvem útvaru a oběma písmeny za sebou.",
    ],
    explanation: "Čára s krajními body K a L je úsečka, zapisujeme ji úsečka KL (nebo LK).",
  }),
  vyber("Přímka prochází body M a N. Jak ji zapíšeš?", "přímka MN", [
    ["úsečka MN", "Úsečka MN je jen část mezi body M a N. Přímka pokračuje dál na obě strany."],
    ["polopřímka MN", "Polopřímka začíná v bodě M. Přímka ale nezačíná nikde."],
    ["přímka M", "Přímku zapisujeme dvěma body, kterými prochází."],
  ], {
    hints: [
      "Kterými dvěma body přímka prochází? Obě písmena potřebuješ.",
      "Přímku můžeš zapsat dvěma body, kterými prochází: napíšeš název útvaru a za něj obě písmena. Útvar se tím nemění — pořád pokračuje bez konce.",
    ],
    explanation: "Přímka procházející body M a N se zapisuje přímka MN. Body jen určují, kudy vede.",
  }),
  vyber("Polopřímka začíná v bodě P a prochází bodem R. Jak ji zapíšeš?", "polopřímka PR", [
    ["polopřímka RP", "Polopřímka RP by začínala v bodě R. U polopřímky se píše nejdřív počáteční bod."],
    ["úsečka PR", "Úsečka PR by v bodě R končila. Polopřímka jde za R dál."],
    ["přímka PR", "Přímka by pokračovala i za bod P. Polopřímka v P začíná."],
  ], {
    hints: [
      "U polopřímky záleží na pořadí písmen. Kde začíná — v P, nebo v R?",
      "Nejdřív napiš název útvaru, pak počáteční bod a nakonec bod, kterým prochází. Počáteční bod je ten, kde čára začíná.",
    ],
    explanation: "Polopřímka se zapisuje od počátku: začíná v P a prochází R, proto polopřímka PR.",
  }),
  vyber("Kterou z čar nakreslíš na papír celou?", "úsečka", [
    ["přímka", "Přímka pokračuje bez konce, na papír nakreslíš jen její kousek."],
    ["polopřímka", "Polopřímka na jedné straně nekončí, celá se na papír nevejde."],
    ["každou z nich", "Přímka a polopřímka pokračují bez konce, celé je nakreslit nejde."],
  ], {
    hints: [
      "Na papír se celá vejde jen čára, která někde končí. Která to je?",
      "Projdi čáry jednu po druhé: pokračuje bez konce na obě strany? Na jednu stranu? Nebo začíná i končí? Jen čára se dvěma konci se celá vejde na papír.",
    ],
    explanation: "Úsečka má dva krajní body, proto se celá vejde na papír. Přímka a polopřímka pokračují bez konce.",
  }),
  vyber("Na přímce leží body A a B. Co je část mezi nimi?", "úsečka AB", [
    ["polopřímka AB", "Polopřímka AB by za bodem B pokračovala dál. Ptáme se jen na část mezi body."],
    ["přímka AB", "Přímka AB je celá čára, ne jen část mezi body."],
    ["dva body", "Body A a B jsou jen konce té části, ne celá část."],
  ], {
    hints: [
      "Část přímky mezi A a B začíná v A a končí v B. Kolik má konců?",
      "Když z přímky vystřihneš jen kousek mezi dvěma body, dostaneš čáru se dvěma krajními body. Zapíšeš ji názvem útvaru a písmeny A a B.",
    ],
    explanation: "Část přímky mezi body A a B má dva krajní body, je to úsečka AB.",
  }),
];

// ── L3 — transfer: prodloužení a zkrácení, počítání, vztahy útvarů ──────────

const L3 = (): PracticeTask[] => [
  utvar("Úsečku AB prodloužíš za bod B bez konce. Co vznikne?", "polopřímka", {
    hints: [
      "Na straně A čára pořád končí. Co se stane na straně B?",
      "Po prodloužení má čára začátek v bodě A a za bodem B pokračuje bez konce. Hledej útvar, který má jen jeden konec.",
    ],
    explanation: "Konec zůstal jen u A, za B čára pokračuje bez konce — vznikla polopřímka AB.",
  }, {
    úsečka: "Úsečka by musela v B končit. Prodloužením bez konce už úsečka není.",
    přímka: "Přímka by pokračovala na obě strany. U bodu A ale čára pořád končí.",
    bod: "Prodloužením čára neztratí délku, bod nevznikne.",
  }),
  utvar("Úsečku AB prodloužíš na obě strany bez konce. Co vznikne?", "přímka", {
    hints: [
      "Po prodloužení čára nekončí ani u A, ani u B. Kolik jí zbylo konců?",
      "Za A i za B pokračuje čára pořád dál. Hledej útvar, který nemá vůbec žádný konec a často se značí malým písmenem.",
    ],
    explanation: "Když úsečku prodloužíš za oba krajní body bez konce, nezbude jí žádný konec — vznikne přímka AB.",
  }, {
    polopřímka: "Polopřímka má jeden konec. Tady jsi prodloužil obě strany.",
    úsečka: "Úsečka má konce, ty ale prodloužením zmizely.",
    bod: "Prodloužením čára neztratí délku, bod nevznikne.",
  }),
  utvar("Polopřímku prodloužíš i za její počáteční bod. Co vznikne?", "přímka", {
    hints: [
      "Předtím měla čára jediný konec, počáteční bod. Co se s ním stane po prodloužení?",
      "Na jedné straně čára nekončila už předtím a teď nekončí ani na druhé. Útvar bez jediného konce je tvoje odpověď.",
    ],
    explanation: "Polopřímka měla konec jen v počátečním bodě. Po prodloužení nekončí nikde — vznikla přímka.",
  }, {
    polopřímka: "Polopřímkou to bylo před prodloužením. Teď už čára nekončí ani v počátečním bodě.",
    úsečka: "Úsečka má dva konce. Tahle čára nemá žádný.",
    bod: "Prodloužením čára délku neztratí.",
  }),
  utvar("Úsečku AB zkracuješ tak dlouho, až A splyne s B. Co zbude?", "bod", {
    hints: [
      "Úsečka je čím dál kratší. Co zbude, když už nemá žádnou délku?",
      "Když krajní písmena splynou v jedno místo, čára zmizí a zbude jen to místo. Který útvar je jen místo bez délky?",
    ],
    explanation: "Když se A a B spojí, úsečka nemá žádnou délku — zbude jen jedno místo, bod.",
  }, {
    úsečka: "Úsečka musí mít délku. Když A splyne s B, žádná délka nezbude.",
    přímka: "Zkracováním nemůže vzniknout čára bez konce.",
    polopřímka: "Zkracováním nemůže vzniknout čára, která na jedné straně nekončí.",
  }),
  vyber("Bod O rozdělí přímku na dvě části. Jaké útvary to jsou?", "dvě polopřímky", [
    ["dvě úsečky", "Úsečka má dva konce. Každá část ale na jedné straně pokračuje bez konce."],
    ["dvě přímky", "Přímka nemá žádný konec. Každá část ale v bodě O začíná."],
    ["dva body", "Části přímky jsou pořád čáry, ne jen místa."],
  ], {
    hints: [
      "Každá část začíná v bodě O. Končí i na druhé straně?",
      "Podívej se na jednu část: v bodě O začíná a pak pokračuje jedním směrem bez konce. Druhá část taky, jen na opačnou stranu. Jak se jmenuje čára s jedním koncem?",
    ],
    explanation: "Obě části začínají v bodě O a pokračují bez konce, každá na jinou stranu — jsou to dvě opačné polopřímky.",
  }),
  vyber("Na úsečce AB leží bod C. Kolik úseček tvoří body A, B, C?", "3", [
    ["2", "Našel jsi AC a CB, ale zapomněl jsi na celou úsečku AB."],
    ["1", "AB je jen jedna z nich. Bod C ji dělí na další dvě úsečky."],
    ["6", "Každou úsečku jsi počítal dvakrát. AC a CA je tatáž úsečka."],
  ], {
    hints: [
      "Vypiš si všechny dvojice bodů: A s C, C s B… a nějaká ještě?",
      "Úsečku tvoří každá dvojice bodů. Napiš dvojice: začni u A (A s C, A s B), pak pokračuj bodem C. Pozor, AC a CA je tatáž úsečka.",
    ],
    explanation: "Úsečky jsou AC, CB a celá AB — dohromady tři. Každá dvojice bodů dá jednu úsečku.",
  }),
  vyber("Body A, B, C neleží na jedné přímce. Kolika úsečkami spojíš každé dva?", "3", [
    ["2", "Spojil jsi A s B a B s C, ale zapomněl jsi spojit C s A."],
    ["1", "Jedna úsečka spojí jen dva body. Třetí bod zůstal nespojený."],
    ["6", "Každou úsečku jsi počítal dvakrát, AB a BA je tatáž úsečka."],
  ], {
    hints: [
      "Nakresli si tři body, které neleží v řadě, a spojuj je po dvou.",
      "Spoj A s B, pak B s C. Zbyla ještě nějaká dvojice bodů, která spojená není? Každou úsečku počítej jen jednou, AB a BA je totéž.",
    ],
    explanation: "Úsečky jsou AB, BC a CA — tři. Dohromady tvoří trojúhelník.",
  }),
  vyber("Body A, B, C, D jsou rohy čtverce. Kolika úsečkami spojíš každé dva?", "6", [
    ["4", "To jsou jen strany čtverce. Spojit musíš i protější rohy — úhlopříčky AC a BD."],
    ["3", "Z bodu A vedou tři úsečky, ale spojit mezi sebou musíš i ostatní body."],
    ["12", "Každou úsečku jsi počítal dvakrát, AB a BA je tatáž úsečka."],
  ], {
    hints: [
      "Spoj nejdřív rohy, které jsou vedle sebe. A co rohy naproti sobě?",
      "Nakresli si čtverec ABCD. Nejdřív spočítej strany (AB, BC, CD, DA), pak přidej úsečky mezi protějšími rohy. Každou úsečku počítej jen jednou.",
    ],
    explanation: "Čtverec má čtyři strany (AB, BC, CD, DA) a dvě úhlopříčky (AC, BD), dohromady šest úseček.",
  }),
  vyber("Kolik přímek vede dvěma různými body?", "právě jedna", [
    ["žádná", "Dvěma body přímku vést jde — stačí je spojit podle pravítka a čáru prodloužit."],
    ["dvě", "Zkus to nakreslit: druhá přímka přes oba body by splynula s první."],
    ["nekonečně mnoho", "Nekonečně mnoho přímek vede jedním bodem. Dvěma body už jen jediná."],
  ], {
    hints: [
      "Nakresli si dva body a zkus jimi vést přímku podle pravítka. Jde to i jinak?",
      "Přilož pravítko k oběma bodům najednou. Dá se pravítko natočit jinak, aby pořád procházelo oběma body? Kolik různých poloh najdeš?",
    ],
    explanation: "Dvěma různými body vede právě jedna přímka — pravítko se dá přiložit k oběma bodům jen jedním způsobem.",
  }),
  vyber("Kolik různých přímek prochází jedním bodem?", "nekonečně mnoho", [
    ["žádná", "Bodem přímku vést jde, a ne jen jednu."],
    ["právě jedna", "Jediná přímka je určená až dvěma body. Jedním bodem jich projde, kolik chceš."],
    ["dvě", "Pravítko můžeš kolem bodu otáčet do mnoha směrů, ne jen do dvou."],
  ], {
    hints: [
      "Přilož pravítko k jednomu bodu. Kolika směry ho můžeš natočit?",
      "Pravítko se kolem jednoho bodu dá otáčet jako ručička hodin. Každá poloha dá jinou přímku. Dojdou ti někdy polohy?",
    ],
    explanation: "Jedním bodem vede nekonečně mnoho přímek — pravítko se kolem bodu dá natočit do nekonečně mnoha směrů.",
  }),
  vyber("Bod C leží na úsečce AB. Leží i na přímce AB?", "ano, vždy", [
    ["ne, nikdy", "Přímka AB obsahuje celou úsečku AB, takže i všechny její body."],
    ["jen když je uprostřed", "Nezáleží, kde na úsečce C leží — celá úsečka je částí přímky."],
    ["jen když je u bodu A", "Nezáleží na tom, jak blízko je C u bodu A. Každý bod úsečky leží i na přímce."],
  ], {
    hints: [
      "Úsečka AB je kousek přímky AB. Co to znamená pro body na ní?",
      "Prodluž úsečku AB na obě strany — vznikne přímka AB. Zmizel při tom nějaký bod úsečky, nebo na přímce zůstaly všechny?",
    ],
    explanation: "Úsečka AB je část přímky AB, proto každý bod úsečky leží i na přímce.",
  }),
  vyber("Bod O leží na přímce. Kolik polopřímek s počátkem O na ní je?", "dvě", [
    ["jedna", "Z bodu O vede polopřímka na jednu stranu, ale i na opačnou."],
    ["žádná", "Každý bod přímky může být počátkem polopřímky."],
    ["nekonečně mnoho", "Na jedné přímce vedou z bodu O jen dva směry. Nekonečně mnoho polopřímek by bylo, kdyby nemusely ležet na té přímce."],
  ], {
    hints: [
      "Postav se v duchu do bodu O. Kterými směry můžeš po přímce odejít?",
      "Polopřímka začíná v bodě O a pokračuje jedním směrem bez konce. Na přímce máš z bodu O k dispozici jen směry po té přímce — spočítej je.",
    ],
    explanation: "Z bodu O vedou po přímce dva směry, proto na ní leží dvě polopřímky s počátkem O — jsou navzájem opačné.",
  }),
  vyber("Je úsečka BA stejná jako úsečka AB?", "ano, je to tatáž úsečka", [
    ["ne, BA je delší", "Na pořadí písmen u úsečky nezáleží, obě mají stejné krajní body i délku."],
    ["ne, BA je kratší", "Úsečka BA má stejné krajní body jako AB, takže i stejnou délku."],
    ["ne, BA vede opačným směrem", "Směr má polopřímka. Úsečka žádný směr nemá — AB i BA spojují tytéž dva body."],
  ], {
    hints: [
      "Jaké krajní body má úsečka AB a jaké úsečka BA?",
      "Úsečka je určená svými dvěma krajními body. Porovnej je u AB a u BA. U polopřímky na pořadí písmen záleží — zkontroluj, jestli i u úsečky.",
    ],
    explanation: "AB i BA spojují tytéž dva body, je to jedna a tatáž úsečka se stejnou délkou. Na pořadí písmen záleží jen u polopřímky.",
  }),
];

function gen(level: number): PracticeTask[] {
  return shuffle(level === 1 ? L1() : level === 2 ? L2() : L3());
}

export const BODPRIMKAUSECKA: TopicMetadata[] = [
  {
    id: "g2-mat-bod-primka-usecka",
    rvpNodeId:
      "g2-matematika-geometrie-v-rovine-a-v-prostoru-body-primky-usecky-bod-primka-poloprimka-usecka",
    title: "Bod, přímka, polopřímka, úsečka",
    studentTitle: "Body a čáry",
    subject: "matematika",
    category: "Geometrie v rovině a v prostoru",
    topic: "Body, přímky, úsečky",
    briefDescription: "Poznáš rozdíl mezi přímkou, úsečkou a bodem.",
    keywords: ["bod", "přímka", "úsečka", "polopřímka", "geometrie"],
    goals: [
      "Rozlišit bod, přímku, polopřímku a úsečku.",
      "Vědět, že přímka nemá konec a úsečka má 2 konce.",
      "Pochopit, že polopřímka má 1 konec.",
    ],
    boundaries: ["Pouze definice a vlastnosti.", "Bez rýsování."],
    gradeRange: [2, 2],
    inputType: "true_false",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Přímka = nekonečná. Úsečka = 2 konce. Polopřímka = 1 konec.",
      steps: [
        "Přímka jde do nekonečna oběma směry.",
        "Úsečka má pevný začátek i konec (2 body).",
        "Polopřímka začíná v bodě a jde jedním směrem do nekonečna.",
      ],
      commonMistake: "Záměna přímky a úsečky — přímka NEMÁ konce, úsečka MÁ 2 konce.",
      example: "Silnice na mapě = úsečka (má začátek a konec). Světelný paprsek = polopřímka.",
    },
  },
];
