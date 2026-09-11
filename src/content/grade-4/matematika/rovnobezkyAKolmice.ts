import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { shuffle } from "./_mat";
import { choice } from "../_shared";

// Přepsáno 2026-09-11 (audit 4. ročníku). Úrovně měly jen 3, 9 a 5 různých
// úloh, L3 tvořily jen otázky Ano/Ne, v příkladech byly sporné položky
// („schodišťové stupně“) a možnosti „Ani rovnoběžky, ani kolmice“
// a „Různoběžky“ se překrývaly. Teď:
// L1: pojmy, zápis ∥ a ⊥, pravý úhel · L2: vztah čar v příkladech ze života
// L3: úvahy (a ⊥ b, b ⊥ c → a ∥ c), pravé úhly a rovnoběžné strany útvarů.

type Vztah = "rovnoběžné" | "kolmé" | "protínají se šikmo";
const VZTAHY: Vztah[] = ["rovnoběžné", "kolmé", "protínají se šikmo"];
const PROC: Record<Vztah, string> = {
  rovnoběžné: "Rovnoběžné čáry se nikdy neprotnou.",
  kolmé: "Kolmé čáry se protínají v pravém úhlu, jako roh sešitu.",
  "protínají se šikmo": "Různoběžné čáry se protínají šikmo, ne v pravém úhlu.",
};

function priklad(ex: string, vztah: Vztah, detail: string): PracticeTask {
  const optionFeedback: Record<string, string> = {};
  for (const v of VZTAHY) if (v !== vztah) optionFeedback[v] = `${PROC[v]} ${detail}`;
  return {
    question: `Jaký vztah mají čáry: ${ex}?`,
    correctAnswer: vztah,
    options: [...VZTAHY],
    optionFeedback,
    hints: [
      `Protnuly by se čáry u příkladu „${ex}“, kdybys je prodloužil nebo prodloužila?`,
      `Když se čáry nikdy nepotkají, je to jeden vztah. Když se potkají v pravém úhlu (jako roh sešitu), druhý. Když se potkají v jiném úhlu, třetí. Jak je to u příkladu „${ex}“?`,
    ],
    solutionSteps: [detail, `Odpověď: ${vztah}.`],
  };
}

const L1: PracticeTask[] = [
  choice("Co platí o rovnoběžkách?", "nikdy se neprotnou", [
    { value: "svírají pravý úhel", why: "Pravý úhel svírají kolmice." },
    { value: "protínají se v jednom bodě", why: "Rovnoběžky se neprotínají vůbec." },
    { value: "musí být stejně dlouhé", why: "Přímky délku nemají — rozhoduje, že se nepotkají." },
  ], {
    hints: ["Představ si koleje vlaku. Potkají se někdy?", "Rovnoběžky jsou všude stejně daleko od sebe, jako dvě koleje. I když je prodloužíš sebevíc, vzdálenost mezi nimi se nezmění."],
    explanation: "Rovnoběžky se nikdy neprotnou — jsou všude stejně daleko od sebe.",
  }),
  choice("Co platí o kolmicích?", "svírají pravý úhel", [
    { value: "nikdy se neprotnou", why: "To platí pro rovnoběžky." },
    { value: "svírají úhel 45°", why: "45° je polovina pravého úhlu. Kolmice svírají 90°." },
    { value: "jsou vždy vodorovné", why: "Kolmice mohou být v jakékoli poloze." },
  ], {
    hints: ["Jaký úhel má roh sešitu?", "Kolmice se protnou a vytvoří čtyři stejné úhly — takové, jaké má roh čtverce. Kolik stupňů takový úhel má?"],
    explanation: "Kolmice se protínají v pravém úhlu (90°).",
  }),
  choice("Jak zapíšeš, že přímka p je rovnoběžná s přímkou q?", "p ∥ q", [
    { value: "p ⊥ q", why: "Značka ⊥ znamená kolmost." },
    { value: "p = q", why: "Rovnítko by znamenalo, že jde o tutéž přímku." },
    { value: "p > q", why: "Přímky se neporovnávají jako čísla." },
  ], {
    hints: ["Jak vypadá značka rovnoběžnosti — jako dvě čárky vedle sebe, nebo jako písmeno T vzhůru nohama?", "Značka rovnoběžnosti vypadá jako dvě svislé čárky vedle sebe, které se nikdy nepotkají — přesně jako rovnoběžky. Značka kolmosti naopak připomíná obrácené T."],
    explanation: "Rovnoběžnost zapisujeme značkou ∥: p ∥ q.",
  }),
  choice("Jak zapíšeš, že přímka p je kolmá na přímku q?", "p ⊥ q", [
    { value: "p ∥ q", why: "Značka ∥ znamená rovnoběžnost." },
    { value: "p × q", why: "Křížek je znak násobení." },
    { value: "p + q", why: "Plus je znak sčítání." },
  ], {
    hints: ["Která značka vypadá jako svislá čára stojící na vodorovné?", "Značka kolmosti vypadá jako písmeno T obrácené vzhůru nohama — dvě čáry, které se setkají v pravém úhlu."],
    explanation: "Kolmost zapisujeme značkou ⊥: p ⊥ q.",
  }),
  choice("Kolik stupňů má pravý úhel?", "90°", [
    { value: "45°", why: "45° je polovina pravého úhlu." },
    { value: "60°", why: "60° má každý úhel rovnostranného trojúhelníku." },
    { value: "180°", why: "180° je přímý úhel — dva pravé úhly dohromady." },
  ], {
    hints: ["Jaký úhel má roh čtverce?", "Když rozdělíš celou otočku (360°) na čtyři stejné díly, dostaneš pravý úhel."],
    explanation: "Pravý úhel má 90°.",
  }),
  choice("Které čáry jsou rovnoběžné?", "koleje vlaku", [
    { value: "písmeno T", why: "Čáry v písmenu T jsou kolmé." },
    { value: "písmeno X", why: "Čáry v písmenu X se protínají šikmo." },
    { value: "ručičky hodin v 9 hodin", why: "Ručičky v 9 hodin svírají pravý úhel." },
  ], {
    hints: ["Které čáry vedou pořád vedle sebe a nikdy se nepotkají?", "Hledej čáry, které jsou všude stejně daleko od sebe — i kdyby pokračovaly donekonečna."],
    explanation: "Koleje vedou vedle sebe a nikdy se nepotkají — jsou rovnoběžné.",
  }),
  choice("Které čáry jsou kolmé?", "písmeno L", [
    { value: "koleje vlaku", why: "Koleje jsou rovnoběžné." },
    { value: "písmeno V", why: "Čáry v písmenu V se potkají šikmo." },
    { value: "linky v sešitě", why: "Linky jsou rovnoběžné." },
  ], {
    hints: ["Kde se dvě čáry potkají tak, jako roh sešitu?", "Kolmé čáry svírají pravý úhel. Hledej tvar se svislou a vodorovnou čarou, které se setkají."],
    explanation: "Svislá a vodorovná čára písmena L svírají pravý úhel — jsou kolmé.",
  }),
  choice("Čím nejsnáz narýsuješ kolmici?", "trojúhelníkem s ryskou", [
    { value: "kružítkem", why: "Kružítkem se rýsují kružnice." },
    { value: "gumou", why: "Gumou se gumuje." },
    { value: "pastelkou od ruky", why: "Od ruky pravý úhel přesně nevyjde." },
  ], {
    hints: ["Která pomůcka má pravý úhel?", "Hledej pomůcku, která má v rohu přesně pravý úhel a na které je vyznačená čára kolmá k hraně. Přiložíš ji k přímce a podél ní narýsuješ kolmici."],
    explanation: "Trojúhelník s ryskou má pravý úhel, proto s ním snadno narýsujeme kolmici.",
  }),
  choice("Kolik společných bodů mají dvě různé rovnoběžky?", "žádný", [
    { value: "jeden", why: "Jeden společný bod mají různoběžky, třeba kolmice." },
    { value: "dva", why: "Dvě přímky nemohou mít právě dva společné body." },
    { value: "čtyři", why: "Dvě přímky nemohou mít čtyři společné body." },
  ], {
    hints: ["Setkají se někdy dvě koleje?", "Společný bod je místo, kde se čáry potkají. Rovnoběžky se nepotkají nikde."],
    explanation: "Rovnoběžky se nikdy neprotnou, nemají tedy žádný společný bod.",
  }),
  choice("Kolik společných bodů mají dvě kolmice?", "jeden", [
    { value: "žádný", why: "Žádný společný bod mají rovnoběžky." },
    { value: "dva", why: "Dvě přímky se protnou nejvýš v jednom bodě." },
    { value: "čtyři", why: "U kolmic vzniknou čtyři pravé úhly, ale bod je jen jeden." },
  ], {
    hints: ["Kde se potkají čáry písmene T?", "Kolmice se protnou — a dvě přímky se mohou protnout jen v jednom místě."],
    explanation: "Kolmice se protnou v jednom bodě, v tom bodě vzniknou čtyři pravé úhly.",
  }),
  choice("Jak se jmenují přímky, které se protínají, ale ne v pravém úhlu?", "různoběžky", [
    { value: "rovnoběžky", why: "Rovnoběžky se neprotínají." },
    { value: "kolmice", why: "Kolmice se protínají v pravém úhlu." },
    { value: "úsečky", why: "Úsečka je část přímky, ne vztah dvou přímek." },
  ], {
    hints: ["Přímky se potkají šikmo. Jsou to kolmice?", "Všechny přímky, které se protnou, jsou různoběžné. Kolmice jsou jen zvláštní případ, kdy je úhel pravý."],
    explanation: "Přímky, které se protínají šikmo, jsou různoběžky.",
  }),
  choice("Jaké jsou sousední strany čtverce?", "kolmé", [
    { value: "rovnoběžné", why: "Rovnoběžné jsou protější strany." },
    { value: "různě dlouhé", why: "Všechny strany čtverce jsou stejně dlouhé." },
    { value: "zakřivené", why: "Strany čtverce jsou rovné." },
  ], {
    hints: ["Jaký úhel je v rohu čtverce?", "Sousední strany se setkají v rohu. Roh čtverce je stejný jako roh sešitu."],
    explanation: "Sousední strany čtverce svírají pravý úhel — jsou kolmé.",
  }),
  choice("Jaké jsou protější strany čtverce?", "rovnoběžné", [
    { value: "kolmé", why: "Kolmé jsou sousední strany." },
    { value: "různě dlouhé", why: "Všechny strany čtverce jsou stejně dlouhé." },
    { value: "zakřivené", why: "Strany čtverce jsou rovné." },
  ], {
    hints: ["Setkají se horní a dolní strana čtverce, když je prodloužíš?", "Protější strany čtverce vedou vedle sebe stejně jako linky v sešitě. I kdybys je prodloužil nebo prodloužila, zůstanou pořád stejně daleko od sebe."],
    explanation: "Protější strany čtverce se nikdy neprotnou — jsou rovnoběžné.",
  }),
];

const L2: PracticeTask[] = [
  priklad("ručičky hodin v 9 hodin", "kolmé", "V 9 hodin ukazuje velká ručička nahoru a malá doleva — svírají pravý úhel."),
  priklad("okraje pravítka", "rovnoběžné", "Okraje pravítka vedou vedle sebe a nikdy se nepotkají."),
  priklad("svislá zeď a vodorovná podlaha", "kolmé", "Zeď stojí na podlaze v pravém úhlu."),
  priklad("jízdní pruhy na dálnici", "rovnoběžné", "Pruhy vedou vedle sebe stejně daleko od sebe."),
  priklad("čáry písmene X", "protínají se šikmo", "Čáry písmene X se protínají šikmo."),
  priklad("horní a dolní čára písmene Z", "rovnoběžné", "Horní a dolní čára písmene Z vedou vedle sebe."),
  priklad("čáry písmene V", "protínají se šikmo", "Čáry písmene V se potkají šikmo, ne v pravém úhlu."),
  priklad("protější okraje dveří", "rovnoběžné", "Levý a pravý okraj dveří vedou vedle sebe."),
  priklad("rozevřené nůžky", "protínají se šikmo", "Čepele rozevřených nůžek se protínají šikmo."),
  priklad("kříž na lékárně", "kolmé", "Ramena kříže se protínají v pravém úhlu."),
  priklad("struny kytary", "rovnoběžné", "Struny vedou vedle sebe a nepotkají se."),
  priklad("stěna a strop místnosti", "kolmé", "Stěna se stropem se setká v pravém úhlu."),
  priklad("ručičky hodin v 1 hodinu", "protínají se šikmo", "V 1 hodinu svírají ručičky ostrý úhel, menší než pravý."),
];

const L3: PracticeTask[] = [
  choice("Přímka a je kolmá na přímku b a přímka b je kolmá na přímku c. Jaký vztah mají a a c?", "rovnoběžné", [
    { value: "kolmé", why: "Dvě kolmice ke stejné přímce jsou spolu rovnoběžné." },
    { value: "protínají se šikmo", why: "Dvě kolmice ke stejné přímce se nemohou protnout." },
    { value: "nedá se určit", why: "V rovině se to určit dá — jsou rovnoběžné." },
  ], {
    hints: ["Nakresli si vodorovnou přímku b a na ni dvě kolmice. Jak vypadají?", "Obě přímky a i c stojí na přímce b svisle. Dvě svislé čáry vedou vedle sebe — potkají se někdy?"],
    explanation: "Dvě přímky kolmé ke stejné přímce jsou spolu rovnoběžné (jako příčky žebříku k jeho noze).",
  }),
  choice("Přímka a je rovnoběžná s b a přímka c je kolmá na b. Jaký vztah mají a a c?", "kolmé", [
    { value: "rovnoběžné", why: "Přímka c protíná b v pravém úhlu, a stejně protne i a." },
    { value: "protínají se šikmo", why: "Úhel se nezmění — c protne a také v pravém úhlu." },
    { value: "nedá se určit", why: "Dá se — jsou kolmé." },
  ], {
    hints: ["Nakresli dvě vodorovné rovnoběžky a jednu svislou čáru přes obě. Jak se protínají?", "Svislá čára c protne vodorovnou přímku b v pravém úhlu. Přímka a vede stejným směrem jako b, takže ji c protne úplně stejně."],
    explanation: "Když je c kolmá na b a a je s b rovnoběžná, je c kolmá i na a.",
  }),
  choice("Kolik pravých úhlů má obdélník?", "4", [
    { value: "2", why: "Pravé úhly jsou ve všech čtyřech rozích." },
    { value: "1", why: "Pravý úhel je v každém rohu obdélníku." },
    { value: "0", why: "Obdélník pravé úhly má." },
  ], {
    hints: ["Kolik rohů má obdélník?", "Obdélník má sousední strany kolmé — a sousední strany se setkávají v každém jeho rohu."],
    explanation: "Obdélník má 4 rohy a v každém je pravý úhel.",
  }),
  choice("Kolik dvojic rovnoběžných stran má obdélník?", "2", [
    { value: "1", why: "Rovnoběžné jsou horní s dolní i levá s pravou — dvě dvojice." },
    { value: "4", why: "Stran je 4, ale dvojic rovnoběžných stran jen 2." },
    { value: "0", why: "Protější strany obdélníku jsou rovnoběžné." },
  ], {
    hints: ["Která strana obdélníku leží naproti horní straně?", "Rovnoběžné jsou vždy dvě protější strany. Kolik takových dvojic v obdélníku najdeš?"],
    explanation: "Horní a dolní strana jsou jedna dvojice, levá a pravá druhá — 2 dvojice.",
  }),
  choice("Kolik pravých úhlů má písmeno T?", "2", [
    { value: "1", why: "Svislá čára svírá pravý úhel s levou i s pravou částí vodorovné čáry." },
    { value: "4", why: "Čtyři pravé úhly by vznikly u kříže (+)." },
    { value: "0", why: "Čáry písmene T jsou kolmé, pravé úhly tu jsou." },
  ], {
    hints: ["Kolik úhlů vznikne pod vodorovnou čárou písmene T?", "Svislá čára končí na vodorovné. Vpravo i vlevo od ní vznikne úhel — jaký?"],
    explanation: "Pod vodorovnou čárou vzniknou vlevo i vpravo pravé úhly — celkem 2.",
  }),
  choice("Kolik pravých úhlů má znak plus (+)?", "4", [
    { value: "2", why: "Čáry se protínají a pokračují na obě strany — úhly jsou čtyři." },
    { value: "1", why: "V místě protnutí vzniknou čtyři úhly." },
    { value: "3", why: "Úhly jsou čtyři a všechny jsou pravé." },
  ], {
    hints: ["Kolik úhlů vznikne, když se dvě čáry protnou a obě pokračují dál?", "Dvě čáry znaku plus jsou kolmé. Spočítej místa kolem středu, kde se potkají dvě ramena — v každém z nich je úhel stejný jako roh sešitu."],
    explanation: "Dvě kolmice se protnou a vytvoří čtyři pravé úhly.",
  }),
  choice("Dvě přímky svírají úhel 60°. Jak se jmenují?", "různoběžky", [
    { value: "kolmice", why: "Kolmice svírají 90°, ne 60°." },
    { value: "rovnoběžky", why: "Rovnoběžky se neprotínají, žádný úhel nesvírají." },
    { value: "úsečky", why: "Úsečka je část přímky, ne vztah přímek." },
  ], {
    hints: ["Je 60° pravý úhel?", "Přímky se protínají, ale úhel není 90°. Takový vztah má svůj název."],
    explanation: "Přímky se protínají pod úhlem 60°, ne 90° — jsou různoběžné, ale ne kolmé.",
  }),
  choice("Jak nejsnáz ověříš, že dvě čáry jsou kolmé?", "přiložím pravý úhel trojúhelníku", [
    { value: "změřím délku obou čar", why: "Délka o kolmosti nic neříká." },
    { value: "podívám se, jestli jsou stejně silné", why: "Tloušťka čáry o kolmosti nic neříká." },
    { value: "spočítám, kolik je na nich bodů", why: "Počet bodů o kolmosti nic neříká." },
  ], {
    hints: ["Která pomůcka z penálu má přesný roh, jako je roh sešitu?", "Kolmost poznáš podle úhlu. Stačí přiložit pomůcku, která má jistě správný roh, a podívat se, jestli obě čáry přesně sedí na její hrany."],
    explanation: "Přiložíme pravý úhel trojúhelníku s ryskou — když sedí, čáry jsou kolmé.",
  }),
  choice("Jak narýsuješ rovnoběžku s přímkou p?", "posunu trojúhelník po pravítku a narýsuji další čáru", [
    { value: "narýsuji čáru, která p protne šikmo", why: "Taková čára je různoběžka." },
    { value: "narýsuji čáru v pravém úhlu k p", why: "Taková čára je kolmice." },
    { value: "obkreslím kružnici", why: "Kružnice není přímka." },
  ], {
    hints: ["Jak zajistíš, aby nová čára byla všude stejně daleko od p?", "Když trojúhelník posouváš po pravítku, jeho hrana zůstává pořád ve stejném směru. Tak vznikne čára vedle p."],
    explanation: "Trojúhelník přiložený k p posuneme po pravítku — nová čára má stejný směr, je rovnoběžná.",
  }),
  choice("Které písmeno má dvě rovnoběžné čáry a jednu kolmou na obě?", "H", [
    { value: "T", why: "T má jen dvě čáry, rovnoběžky v něm nejsou." },
    { value: "X", why: "Čáry X se protínají šikmo." },
    { value: "V", why: "Čáry V se potkají šikmo." },
  ], {
    hints: ["Ve kterém písmenu jsou dvě svislé čáry vedle sebe?", "Hledej písmeno se dvěma svislými čarami a jednou vodorovnou, která je spojuje."],
    explanation: "H má dvě svislé rovnoběžné čáry a vodorovnou čáru, která je na obě kolmá.",
  }),
  choice("Kolik pravých úhlů má pravoúhlý trojúhelník?", "1", [
    { value: "2", why: "Se dvěma pravými úhly by dvě strany vedly rovnoběžně a trojúhelník by se neuzavřel." },
    { value: "3", why: "Už se dvěma pravými úhly by se trojúhelník neuzavřel, se třemi tím spíš." },
    { value: "0", why: "Pravoúhlý trojúhelník má jeden pravý úhel, proto se tak jmenuje." },
  ], {
    hints: ["Proč se trojúhelník jmenuje „pravoúhlý“?", "Jméno říká, že má pravý úhel. Kdyby měl dva, nedokázal by se uzavřít."],
    explanation: "Pravoúhlý trojúhelník má právě jeden pravý úhel.",
  }),
  choice("Linky v sešitě a okraj stránky, od kterého začínáš psát, jsou…", "kolmé", [
    { value: "rovnoběžné", why: "Linky vedou vodorovně, okraj svisle — potkají se." },
    { value: "protínají se šikmo", why: "Linky se s okrajem potkávají v pravém úhlu." },
    { value: "stejně dlouhé", why: "Délka nerozhoduje o vztahu čar." },
  ], {
    hints: ["Kterým směrem vedou linky a kterým okraj stránky?", "Linky vedou vodorovně zleva doprava, okraj svisle shora dolů. Vodorovná a svislá čára se setkají v úhlu, jaký má roh sešitu."],
    explanation: "Vodorovné linky a svislý okraj stránky svírají pravý úhel — jsou kolmé.",
  }),
  choice("Dvě koleje vedou vedle sebe. Jaký úhel spolu svírají?", "žádný, neprotínají se", [
    { value: "pravý úhel, 90°", why: "Pravý úhel svírají kolmice, koleje se neprotnou." },
    { value: "ostrý úhel, asi 45°", why: "Koleje se neprotnou, žádný úhel nesvírají." },
    { value: "přímý úhel, 180°", why: "Koleje se neprotnou, žádný úhel nesvírají." },
  ], {
    hints: ["Potkají se koleje někde?", "Úhel mohou svírat jen čáry, které se protnou. Rovnoběžky se nepotkají."],
    explanation: "Koleje jsou rovnoběžné, neprotínají se, a proto žádný úhel nesvírají.",
  }),
];

function gen(level: number): PracticeTask[] {
  return shuffle(level >= 3 ? L3 : level === 2 ? L2 : L1);
}

export const ROVNOBEZKY_KOLMICE: TopicMetadata[] = [
  {
    id: "g4-mat-rovnobezky-kolmice-4",
    rvpNodeId: "g4-matematika-geometrie-v-rovine-a-v-prostoru-rovinne-utvary-rovnobezky-a-kolmice",
    displayName: "Rovnoběžky a kolmice",
    title: "Rovnoběžky a kolmice",
    studentTitle: "Rovnoběžky a kolmice",
    subject: "matematika",
    category: "Geometrie v rovině a v prostoru",
    topic: "Rovinné útvary",
    briefDescription: "Poznáš rovnoběžky a kolmice kolem sebe.",
    keywords: [
      "rovnoběžky", "kolmice", "pravý úhel", "přímky", "90°",
      "geometrie", "průsečík",
    ],
    goals: [
      "Definovat rovnoběžky a kolmice.",
      "Rozpoznat rovnoběžky a kolmice v okolí (na předmětech, budovách).",
      "Určit, zda dvě přímky jsou rovnoběžné, kolmé nebo různoběžné.",
    ],
    boundaries: [
      "Pouze přímky v rovině (2D).",
      "Nezahrnuje prostorovou geometrii.",
      "Nezahrnuje konstrukci pravého úhlu kružítkem.",
    ],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    recommendedNext: ["g4-mat-osova-soumernost-4", "g4-mat-obvod-obsah-obdelnik-ctverec-4"],
    generator: gen,
    helpTemplate: {
      hint: "Rovnoběžky jsou jako koleje — nikdy se neprotnou a jsou všude stejně daleko. Kolmice jsou jako rohy místnosti — svírají přesně 90°.",
      steps: [
        "Rovnoběžky: stejný směr, konstantní vzdálenost, průsečík neexistuje.",
        "Kolmice: protínají se pod pravým úhlem (90°).",
        "Různoběžky: protínají se, ale ne pod 90°.",
      ],
      commonMistake: "Záměna rovnoběžek a kolmic — rovnoběžky se NEPROTNOU, kolmice se PROTNOU pod 90°.",
      example: "Koleje tramvaje = rovnoběžky. Roh pokoje (stěna a podlaha) = kolmice.",
    },
  },
];
