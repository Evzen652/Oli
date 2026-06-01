import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL: PracticeTask[] = [
  {
    question: "Spoj smysl nebo orgán s tím, co vnímá.",
    correctAnswer: "match",
    pairs: [
      { left: "Oko", right: "Světlo a obraz" },
      { left: "Ucho", right: "Zvuk a rovnováhu" },
      { left: "Nos", right: "Vůně a pachy" },
      { left: "Jazyk", right: "Chutě (sladké, slané, kyselé, hořké)" },
    ],
  },
  {
    question: "Spoj smysl nebo orgán s tím, co vnímá.",
    correctAnswer: "match",
    pairs: [
      { left: "Kůže", right: "Dotek, tlak, bolest, teplotu" },
      { left: "Sítnice", right: "Světlo – přeměňuje ho na nervový signál" },
      { left: "Hlemýžď (kochlea)", right: "Zvukové vibrace v uchu" },
      { left: "Čichové buňky", right: "Chemické molekuly vůní v nose" },
    ],
  },
  {
    question: "Spoj část nervové soustavy s její funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Velký mozek", right: "Myšlení, paměť, vědomé pohyby, řeč" },
      { left: "Mozeček", right: "Koordinace pohybů a rovnováha" },
      { left: "Mozkový kmen", right: "Dýchání, srdeční tep, trávení (automatické)" },
      { left: "Mícha", right: "Vede signály mezi mozkem a tělem, reflexy" },
    ],
  },
  {
    question: "Spoj smysl nebo orgán s tím, co vnímá.",
    correctAnswer: "match",
    pairs: [
      { left: "Chuťové pohárky", right: "Rozpuštěné chemické látky na jazyku" },
      { left: "Ušní bubínek", right: "Zvukové vlny ze vzduchu" },
      { left: "Zornička", right: "Reguluje množství světla vstupujícího do oka" },
      { left: "Polokruhovité kanálky", right: "Rotaci a polohu hlavy (rovnováha)" },
    ],
  },
  {
    question: "Spoj smysl nebo orgán s tím, co vnímá.",
    correctAnswer: "match",
    pairs: [
      { left: "Oko", right: "Barvy, tvary, pohyb" },
      { left: "Ucho", right: "Zvuky, výšky tónů" },
      { left: "Nos", right: "Tisíce různých vůní" },
      { left: "Kůže", right: "Teplo, chlad, bolest, tlak" },
    ],
  },
  {
    question: "Spoj část nervové soustavy s její funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Neuron", right: "Nervová buňka přenášející elektrické signály" },
      { left: "Synapse", right: "Místo přenosu signálu mezi neurony" },
      { left: "Myelinová pochva", right: "Izolace nervu – zrychluje přenos signálu" },
      { left: "Periferní nervy", right: "Propojují mozek a míchu s orgány a smysly" },
    ],
  },
  {
    question: "Spoj smysl nebo orgán s tím, co vnímá.",
    correctAnswer: "match",
    pairs: [
      { left: "Čípky (sítnice)", right: "Barvy a ostré vidění za denního světla" },
      { left: "Tyčinky (sítnice)", right: "Vidění za šera – pohyb a tvary" },
      { left: "Sluchové kůstky", right: "Zesilují vibrace bubínku do hlemýždě" },
      { left: "Vestibulární systém", right: "Rovnováhu a polohu těla v prostoru" },
    ],
  },
  {
    question: "Spoj část nervové soustavy s její funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Velký mozek", right: "Uvědomělé myšlení a rozhodování" },
      { left: "Mozeček", right: "Jemné ladění pohybů – psaní, sport" },
      { left: "Mícha", right: "Míšní reflex – rychlá reakce bez mozku" },
      { left: "Autonomní NS", right: "Řídí mimovolné funkce – tep, trávení" },
    ],
  },
  {
    question: "Spoj smysl nebo orgán s tím, co vnímá.",
    correctAnswer: "match",
    pairs: [
      { left: "Oko", right: "Elektromagnetické záření (viditelné světlo)" },
      { left: "Ucho", right: "Mechanické vlnění vzduchu (zvuk)" },
      { left: "Nos", right: "Chemické látky ve vzduchu (vůně)" },
      { left: "Jazyk", right: "Chemické látky v jídle (chuť)" },
    ],
  },
  {
    question: "Spoj smysl nebo orgán s tím, co vnímá.",
    correctAnswer: "match",
    pairs: [
      { left: "Sítnice", right: "Dopadající světlo – vznik obrazu" },
      { left: "Zrakový nerv", right: "Přenáší obraz z oka do mozku" },
      { left: "Sluchový nerv", right: "Přenáší zvukový signál z ucha do mozku" },
      { left: "Čichový nerv", right: "Přenáší signál z nosu do mozku" },
    ],
  },
  {
    question: "Spoj smysl nebo orgán s tím, co vnímá.",
    correctAnswer: "match",
    pairs: [
      { left: "Oko", right: "Světlo, barvy, pohyb" },
      { left: "Nos", right: "Vonné a páchnoucí látky" },
      { left: "Kůže", right: "Mechanický kontakt a teplota" },
      { left: "Chuťové pohárky", right: "Sladká, slaná, kyselá, hořká, umami chuť" },
    ],
  },
  {
    question: "Spoj část mozku s její funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Frontální lalok", right: "Plánování, rozhodování, osobnost" },
      { left: "Okcipitální lalok", right: "Zpracování zrakových informací" },
      { left: "Temporální lalok", right: "Zpracování zvuku, paměť" },
      { left: "Parietální lalok", right: "Zpracování dotyku a prostorové orientace" },
    ],
  },
  {
    question: "Spoj smysl nebo orgán s tím, co vnímá.",
    correctAnswer: "match",
    pairs: [
      { left: "Ucho vnější", right: "Zachytává zvukové vlny z okolí" },
      { left: "Střední ucho", right: "Zesiluje a přenáší vibrace (kůstky)" },
      { left: "Vnitřní ucho", right: "Mění vibrace na nervový signál + rovnováha" },
      { left: "Sluchový nerv", right: "Vede signál do mozku (spánkový lalok)" },
    ],
  },
  {
    question: "Spoj část nervové soustavy s její funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Centrální NS", right: "Mozek a mícha – centrum řízení" },
      { left: "Periferní NS", right: "Nervy mimo mozek a míchu" },
      { left: "Somatická NS", right: "Vědomá kontrola kosterních svalů" },
      { left: "Autonomní NS", right: "Mimovolné funkce – tep, trávení, dýchání" },
    ],
  },
  {
    question: "Spoj smysl nebo orgán s tím, co vnímá.",
    correctAnswer: "match",
    pairs: [
      { left: "Oko", right: "Světlo – přeměňuje na nervový vzruch" },
      { left: "Ucho", right: "Zvuk – přeměňuje na nervový vzruch" },
      { left: "Nos", right: "Vůně – přeměňuje na nervový vzruch" },
      { left: "Kůže", right: "Dotek – přeměňuje na nervový vzruch" },
    ],
  },
  {
    question: "Spoj část nervové soustavy s její funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Velký mozek", right: "Vědomí, inteligence, řeč, paměť" },
      { left: "Mozeček", right: "Rovnováha a koordinace pohybů" },
      { left: "Mozkový kmen", right: "Automatické životní funkce" },
      { left: "Mícha", right: "Rychlé reflexy a vedení vzruchů" },
    ],
  },
  {
    question: "Spoj smysl nebo orgán s tím, co vnímá.",
    correctAnswer: "match",
    pairs: [
      { left: "Termorecepory kůže", right: "Teplotu okolí a dotýkaných předmětů" },
      { left: "Nocisensory", right: "Bolest (poškození tkáně)" },
      { left: "Mechanosensory", right: "Tlak a dotek" },
      { left: "Propriocepce", right: "Polohu a pohyb vlastního těla" },
    ],
  },
  {
    question: "Spoj smysl nebo orgán s tím, co vnímá.",
    correctAnswer: "match",
    pairs: [
      { left: "Oko", right: "Barevné spektrum viditelného světla" },
      { left: "Nos", right: "Tisíce různých chemických látek" },
      { left: "Jazyk", right: "Základní chuťové kvality jídla" },
      { left: "Vnitřní ucho", right: "Zvuk i rovnováhu (polohu hlavy)" },
    ],
  },
  {
    question: "Spoj smysl nebo orgán s tím, co vnímá.",
    correctAnswer: "match",
    pairs: [
      { left: "Sítnice oka", right: "Světlo – vznik elektrického signálu" },
      { left: "Ušní bubínek", right: "Zvuk – vibrace vzduchu" },
      { left: "Čichová sliznice", right: "Vonné molekuly ve vzduchu" },
      { left: "Chuťový pohárek", right: "Chemické látky v potravinách" },
    ],
  },
  {
    question: "Spoj část nervové soustavy s její funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Hipokampus", right: "Tvorba nových vzpomínek" },
      { left: "Amygdala", right: "Zpracování emocí, zejména strachu" },
      { left: "Thalamus", right: "Přepojovací stanice smyslových informací" },
      { left: "Hypotalamus", right: "Řídí tělesnou teplotu, hlad, žízeň" },
    ],
  },
  {
    question: "Spoj smysl nebo orgán s tím, co vnímá.",
    correctAnswer: "match",
    pairs: [
      { left: "Oko", right: "Elektromagnetické záření viditelné části spektra" },
      { left: "Ucho", right: "Mechanické vlnění (zvuk)" },
      { left: "Kůže", right: "Mechanické, termické a bolestivé podněty" },
      { left: "Nos + jazyk", right: "Chemické látky (vůně a chuť)" },
    ],
  },
  {
    question: "Spoj smysl nebo orgán s tím, co vnímá.",
    correctAnswer: "match",
    pairs: [
      { left: "Oko", right: "Světlo" },
      { left: "Ucho", right: "Zvuk" },
      { left: "Nos", right: "Vůně" },
      { left: "Jazyk", right: "Chuť" },
    ],
  },
  {
    question: "Spoj smysl nebo orgán s tím, co vnímá.",
    correctAnswer: "match",
    pairs: [
      { left: "Kůže (hmat)", right: "Dotek, tlak, teplota, bolest" },
      { left: "Zrakový nerv", right: "Vizuální informace z oka do mozku" },
      { left: "Vestibulární aparát", right: "Rovnováhu a prostorovou orientaci" },
      { left: "Čichový bulbus", right: "Zpracovává vůně přicházející z nosu" },
    ],
  },
  {
    question: "Spoj smysl nebo orgán s tím, co vnímá.",
    correctAnswer: "match",
    pairs: [
      { left: "Oko", right: "Světlo a barvy" },
      { left: "Ucho (sluch)", right: "Zvuky a tóny" },
      { left: "Ucho (rovnováha)", right: "Polohu a pohyb hlavy" },
      { left: "Nos", right: "Vůně a pachy" },
    ],
  },
  {
    question: "Spoj smysl nebo orgán s tím, co vnímá.",
    correctAnswer: "match",
    pairs: [
      { left: "Oko", right: "Intenzitu a vlnovou délku světla" },
      { left: "Ucho", right: "Frekvenci a intenzitu zvuku" },
      { left: "Nos", right: "Chemické molekuly vůní" },
      { left: "Kůže", right: "Mechanické podněty a teplotu" },
    ],
  },
  {
    question: "Spoj smysl nebo orgán s tím, co vnímá.",
    correctAnswer: "match",
    pairs: [
      { left: "Oko", right: "Světlo – vidění" },
      { left: "Ucho", right: "Zvuk – sluch a rovnováha" },
      { left: "Nos", right: "Vůně – čich" },
      { left: "Jazyk", right: "Chuť – sladké, slané, kyselé, hořké" },
    ],
  },
  {
    question: "Spoj smysl nebo orgán s tím, co vnímá.",
    correctAnswer: "match",
    pairs: [
      { left: "Sítnice", right: "Přijímá světlo a tvoří nervový signál" },
      { left: "Hlemýžď", right: "Přeměňuje zvukové vibrace na signál" },
      { left: "Čichová sliznice", right: "Detekuje vonné molekuly" },
      { left: "Kožní receptor", right: "Detekuje dotek, tlak nebo teplotu" },
    ],
  },
  {
    question: "Spoj smysl nebo orgán s tím, co vnímá.",
    correctAnswer: "match",
    pairs: [
      { left: "Oko", right: "Světelné podněty z okolí" },
      { left: "Ucho", right: "Zvukové vibrace z okolí" },
      { left: "Nos", right: "Chemické podněty – vůně" },
      { left: "Kůže", right: "Fyzické podněty – dotek a teplota" },
    ],
  },
  {
    question: "Spoj smysl nebo orgán s tím, co vnímá.",
    correctAnswer: "match",
    pairs: [
      { left: "Velký mozek", right: "Řídí vědomé myšlení a pohyby" },
      { left: "Mozeček", right: "Koordinuje pohyby a udržuje rovnováhu" },
      { left: "Mozkový kmen", right: "Řídí automatické funkce (dýchání, tep)" },
      { left: "Mícha", right: "Vede vzruchy a zprostředkuje reflexy" },
    ],
  },
  {
    question: "Spoj smysl nebo orgán s tím, co vnímá.",
    correctAnswer: "match",
    pairs: [
      { left: "Oko", right: "Světlo a vizuální informace" },
      { left: "Ucho (sluch)", right: "Zvuk – tóny, hluk, řeč" },
      { left: "Ucho (rovnováha)", right: "Pohyb a poloha těla v prostoru" },
      { left: "Jazyk a nos", right: "Chuť a vůně (chemoreceptory)" },
    ],
  },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 30);
}

export const NERVOVASOUSTAVASMYSLY: TopicMetadata[] = [
  {
    id: "g5-prirodoveda-clovek-a-jeho-zdravi-lidske-telo-soustavy-nervova-soustava-smysly",
    rvpNodeId: "g5-prirodoveda-clovek-a-jeho-zdravi-lidske-telo-soustavy-nervova-soustava-smysly",
    title: "Nervová soustava, smysly",
    studentTitle: "Mozek a smysly",
    subject: "přírodověda",
    category: "Člověk a jeho zdraví",
    topic: "Lidské tělo - soustavy",
    briefDescription: "Pochopíš, jak mozek a smysly spolupracují při vnímání světa.",
    keywords: ["mozek", "nervová soustava", "smysly", "reflex", "zrak", "sluch", "čich", "chuť", "hmat"],
    goals: ["Popsat části nervové soustavy a jejich funkce", "Vysvětlit princip vnímání základními smysly", "Rozlišit vědomý pohyb od reflexu"],
    boundaries: ["Neprobírá neurochemii do hloubky", "Neprobírá duševní poruchy"],
    gradeRange: [5, 5],
    inputType: "match_pairs",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Mozek: velký (myšlení), mozeček (koordinace), mozkový kmen (dýchání, tep). 5 smyslů: zrak, sluch, čich, chuť, hmat.",
      steps: [
        "1. Velký mozek: myšlení, paměť, řeč.",
        "2. Mozeček: rovnováha, koordinace.",
        "3. Mozkový kmen: dýchání, tep (automatické).",
        "4. Smysly: oko (světlo), ucho (zvuk), nos (vůně), jazyk (chuť), kůže (dotek).",
        "5. Reflex: rychlá reakce bez vědomé kontroly.",
      ],
      commonMistake: "Reflex probíhá v míše (míšní oblouk) – mozek je informován až dodatečně.",
      example: "Dotkneš se horké plotny → reflex okamžitě stáhne ruku → teprve pak cítíš bolest.",
    },
  },
];
