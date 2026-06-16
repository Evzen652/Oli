/**
 * Dějepis 6. ročník — Pomocné vědy historické (archeologie, paleografie,
 * numismatika, heraldika).
 *
 * FAKTICKÝ vzor typu categorize (žák třídí předměty/nálezy k vědě, která je
 * zkoumá). Navazuje na „Historické prameny" — od TYPU pramene k VĚDĚ, jež daný
 * pramen studuje. Procvičuje „práci se zdrojem": přiřadit konkrétní nález ke
 * správné pomocné vědě.
 *
 * Rozlišovací pravidlo (klíč kvality) — třídí se podle TOHO, CO VĚDA ZKOUMÁ
 * (předmět zkoumání), NE podle materiálu nebo vzhledu nálezu:
 *  • ARCHEOLOGIE = hmotné nálezy vykopané ze země (kostra, základy stavby, střep).
 *  • PALEOGRAFIE = ČTENÍ starého písma a rukopisů na měkkém materiálu
 *    (kronika, listina, pergamen, papyrus — souvislý ručně psaný text).
 *  • NUMISMATIKA = mince a platidla (i bankovky).
 *  • HERALDIKA = erby a znaky rodů, měst a cechů (na štítu, praporu, bráně,
 *    v erbovní listině) — sám znak jako takový.
 *
 * Chybový model (jádro kvality categorize): v L3 jsou nálezy, které NAVENEK
 * připomínají sousední vědu — mince s portrétem panovníka láká na heraldiku
 * (vidím obličej/znak), ale je to MINCE → numismatika; stará listina k rozluštění
 * vypadá jako vykopaný kus pergamenu (archeologie), ale úkolem je ČÍST PÍSMO →
 * paleografie. Vysvětlení vždy pojmenuje, podle čeho se rozhoduje (předmět
 * zařazení), aniž by tvrdilo, že znak na minci heraldiku „nezajímá" — rozhoduje,
 * CO je nositel (mince = platidlo), ne že by erb byl mimo zájem heraldiky.
 *
 * Hranice oborů (proč zde nejsou pečeti): pečeť a pečetidlo zkoumá samostatná
 * pomocná věda SFRAGISTIKA, kterou téma záměrně nezavádí (viz boundaries).
 * Čtení NÁPISŮ na tvrdém materiálu (kámen, hlína, klínopis) je zase blíž
 * EPIGRAFICE; proto paleografické položky zde používají jen rukopisné prameny
 * na měkkém materiálu, ať zjednodušení na 4 vědy nesvádí k faktické chybě.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pickN, buildCategorizeTask as cat } from "./_shared";

const A = "Archeologie";
const P = "Paleografie";
const N = "Numismatika";
const H = "Heraldika";

const RULE =
  "Vědu poznáš podle toho, CO zkoumá, ne podle materiálu nálezu: archeologie = hmotné nálezy vykopané ze země, paleografie = čtení starého písma a rukopisů, numismatika = mince a platidla, heraldika = erby a znaky rodů a měst.";

// Mikro-slovníček (do první úlohy L1) — aby dítě řešilo znalostí, ne kopírováním
// klíčového slova ze zadání.
const GLOSSARY =
  "Slovníček: archeologie (vykopávky ze země), paleografie (čtení starého písma), numismatika (mince a peníze), heraldika (erby a znaky).";

// ── Pooly úloh po úrovních ──────────────────────────────────────────────────
// L1 — 4 jednoznačné prototypy, právě jeden na každou vědu (učebnicový vzor).
const L1: PracticeTask[] = [
  cat(
    "Přiřaď čtyři nálezy k pomocné vědě, která je zkoumá.",
    [
      { name: A, items: ["Nádoba vykopaná ze země"] },
      { name: P, items: ["Starý rukopis ke čtení"] },
      { name: N, items: ["Antická mince"] },
      { name: H, items: ["Rytířský erb na štítu"] },
    ],
    {
      hints: [
        GLOSSARY,
        "U každého nálezu se zeptej: týká se vykopaného předmětu, písma, mince, nebo znaku rodu? Podle toho urči vědu — vykopávka archeologie, písmo paleografie, mince numismatika, znak heraldika.",
      ],
      explanation:
        RULE +
        " Vykopaná nádoba → archeologie, starý rukopis (čtení písma) → paleografie, antická mince → numismatika, rytířský erb → heraldika.",
    },
  ),
  cat(
    "Roztřiď čtyři předměty ke správné pomocné vědě.",
    [
      { name: A, items: ["Střep nalezený při vykopávkách"] },
      { name: P, items: ["Středověká kronika ke čtení"] },
      { name: N, items: ["Stříbrné platidlo"] },
      { name: H, items: ["Erb šlechtického rodu na praporu"] },
    ],
    {
      hints: [
        "Rozhoduj podle toho, co věda studuje, ne z čeho je předmět vyroben.",
        "Kronika je souvislý ručně psaný text, který se čte — kterou vědu zajímá staré písmo (a ne to, na čem je napsané)?",
      ],
      explanation:
        RULE +
        " Střep z vykopávek → archeologie, kronika (čtení písma) → paleografie, stříbrné platidlo → numismatika, erb rodu na praporu → heraldika.",
    },
  ),
  cat(
    "Zařaď čtyři nálezy k vědě, která se jimi zabývá.",
    [
      { name: A, items: ["Kostra z pravěkého hrobu"] },
      { name: P, items: ["Listina psaná starým písmem ke čtení"] },
      { name: N, items: ["Zlatá mince"] },
      { name: H, items: ["Znak královského města na bráně"] },
    ],
    {
      hints: [
        "Polož si otázku: zkoumá se vykopaný předmět, písmo, mince, nebo znak?",
        "Znak města (na bráně, na štítě) řeší věda o erbech a znacích — heraldika.",
      ],
      explanation:
        RULE +
        " Kostra z hrobu → archeologie, listina (čtení starého písma) → paleografie, zlatá mince → numismatika, znak města → heraldika.",
    },
  ),
];

// L2 — 8 nálezů (2 na vědu), méně okaté, ale stále čisté případy.
const L2: PracticeTask[] = [
  cat(
    "Roztřiď osm nálezů ke čtyřem pomocným vědám (po dvou).",
    [
      { name: A, items: ["Základy staré stavby", "Kostra z pohřebiště"] },
      { name: P, items: ["Listina psaná gotickým písmem", "Opis středověké kroniky"] },
      { name: N, items: ["Stříbrná mince", "Papírová bankovka"] },
      { name: H, items: ["Erb rodu na rytířském štítu", "Znak rodu na praporu"] },
    ],
    {
      hints: [
        "U každého nálezu urči, co je předmětem zkoumání — vykopávka, písmo, platidlo, nebo znak.",
        "Listina i opis kroniky jsou ručně psané texty ke čtení — to je práce pro vědu o písmu.",
      ],
      explanation:
        RULE +
        " Základy stavby a kostra → archeologie, listina psaná gotickým písmem a opis kroniky → paleografie, mince a bankovka → numismatika, erb na štítu a znak rodu na praporu → heraldika.",
    },
  ),
  cat(
    "Zařaď osm předmětů k vědě, která je studuje (vždy dva na vědu).",
    [
      { name: A, items: ["Nález v zemi: bronzová spona", "Zbytky základů hradby"] },
      { name: P, items: ["Rukopis mnicha ke čtení", "Pergamen se starým písmem k rozluštění"] },
      { name: N, items: ["Antické platidlo", "Stará mince z pokladu"] },
      { name: H, items: ["Erb na rytířském štítu", "Znak rodu na rodové vlajce"] },
    ],
    {
      hints: [
        "Rozhoduj podle úkolu vědy, ne podle materiálu předmětu.",
        "Pergamen s ručně psaným písmem k rozluštění patří vědě o čtení starého písma.",
      ],
      explanation:
        RULE +
        " Spona z nálezu a základy hradby → archeologie, rukopis a pergamen s písmem k rozluštění → paleografie, platidlo a mince → numismatika, erb na štítu a znak rodu na vlajce → heraldika.",
    },
  ),
  cat(
    "Roztřiď osm nálezů do čtyř skupin podle pomocné vědy.",
    [
      { name: A, items: ["Hrob s pohřební výbavou", "Vykopávky základů chrámu"] },
      { name: P, items: ["Kronika ke čtení", "Listina se starým písmem k rozluštění"] },
      { name: N, items: ["Měděná mince", "Dobové platidlo"] },
      { name: H, items: ["Znak cechu na vývěsním štítu", "Erb města na radniční bráně"] },
    ],
    {
      hints: [
        "Zeptej se u každého: zkoumá se vykopaný předmět, písmo, mince, nebo znak rodu/města?",
        "Cech (sdružení řemeslníků) i město mají svůj znak — kterou vědu to zajímá?",
      ],
      explanation:
        RULE +
        " Hrob s výbavou a vykopávky chrámu → archeologie, kronika a listina s písmem ke čtení → paleografie, mince a platidlo → numismatika, znak cechu a erb města → heraldika.",
    },
  ),
];

// L3 — KLAMAVÉ nálezy: každý navenek připomíná sousední vědu; třídí se podle
// PŘEDMĚTU ZAŘAZENÍ (objektu), ne podle vzhledu/materiálu.
// Pravidlo pro past „mince + obrázek/znak" je v nápovědě řečeno černé na bílém.
const MINCE_RULE =
  "Pravidlo na pasti: mince je vždy numismatika — i když je na ní obličej nebo znak. Heraldika řeší znak SAMOSTATNĚ (na štítu, praporu, bráně), ne jako výzdobu mince.";

const L3: PracticeTask[] = [
  cat(
    "Roztřiď osm nálezů ke správné vědě — pozor, některé klamou vzhledem.",
    [
      { name: A, items: ["Hliněný střep z vykopávek", "Kostra z hrobu"] },
      { name: P, items: ["Stará listina k rozluštění písma", "Kronika ke čtení"] },
      { name: N, items: ["Mince s portrétem panovníka", "Dobové platidlo"] },
      { name: H, items: ["Erb na rytířském štítu", "Znak rodu na praporu"] },
    ],
    {
      hints: [
        MINCE_RULE,
        "Nerozhoduj podle materiálu (hlína, kov) ani podle obrázku na předmětu, ale podle toho, CO je vlastní předmět: mince s portrétem je pořád mince; listinu, kterou je třeba přečíst, řeší věda o písmu.",
      ],
      explanation:
        RULE +
        " Mince s portrétem panovníka láká na heraldiku (vidíš obličej), ale předmětem je MINCE (platidlo) → numismatika; portrét je jen její výzdoba. Stará listina k rozluštění vypadá jako vykopaný kus pergamenu, ale úkolem je PŘEČÍST PÍSMO → paleografie. Erb na štítu a znak rodu na praporu nesou znak SAMOSTATNĚ → heraldika. Střep a kostra jsou vykopávky → archeologie.",
    },
  ),
  cat(
    "Zařaď osm nálezů; každý připomíná jinou vědu, než kam patří.",
    [
      { name: A, items: ["Základy stavby odkryté při vykopávkách", "Nález v zemi: bronzový meč"] },
      { name: P, items: ["Pergamen se starým písmem k rozluštění", "Rukopis ke čtení"] },
      { name: N, items: ["Mince se znakem města", "Stříbrné platidlo z pokladu"] },
      { name: H, items: ["Erb rodu na štítu", "Znak cechu na vývěsním štítu"] },
    ],
    {
      hints: [
        MINCE_RULE,
        "Pramen třiď podle položené otázky: vykopaný předmět vs. čtené písmo, mince vs. znak na štítu/bráně.",
      ],
      explanation:
        RULE +
        " Mince se znakem města láká na heraldiku, ale předmětem je MINCE (platidlo) → numismatika; znak na ní je jen výzdoba. Erb rodu a znak cechu jsou nositelé znaku SAMOSTATNĚ → heraldika. Pergamen a rukopis se ČTOU → paleografie. Základy stavby a meč z nálezu → archeologie.",
    },
  ),
  cat(
    "Roztřiď všech osm nálezů podle vědy (rozhoduj podle předmětu zařazení, ne vzhledu).",
    [
      { name: A, items: ["Střep z archeologického nálezu", "Kostra ze starého hrobu"] },
      { name: P, items: ["Egyptský papyrus k rozluštění písma", "Listina se starým písmem ke čtení"] },
      { name: N, items: ["Zlatá mince s portrétem císaře", "Antické platidlo"] },
      { name: H, items: ["Erb šlechtického rodu na štítu", "Znak města na bráně"] },
    ],
    {
      hints: [
        MINCE_RULE,
        "Odliš nositele (materiál, obrázek) od toho, co je vlastní předmět: portrét na minci je vzhled, předmětem zařazení je mince (platidlo).",
      ],
      explanation:
        RULE +
        " Zlatá mince s portrétem císaře láká na heraldiku (kov, obličej), ale předmětem je MINCE (platidlo) → numismatika; portrét je jen výzdoba. Papyrus a listina se starým písmem se ČTOU → paleografie (ne archeologie). Erb na štítu a znak města na bráně nesou znak SAMOSTATNĚ → heraldika. Střep a kostra jsou vykopávky → archeologie.",
    },
  ),
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? L1 : level === 2 ? L2 : L3;
  return pickN(pool, pool.length);
}

// ── Topic ────────────────────────────────────────────────────────────────
export const POMOCNE_VEDY_HISTORICKE: TopicMetadata[] = [
  {
    id: "g6-dej-pomocne-vedy-historicke-6",
    rvpNodeId:
      "g6-dejepis-uvod-do-dejepisu-pomocne-vedy-historicke-archeologie-paleografie-numismatika-heraldika",
    displayName: "Pomocné vědy historické",
    title: "Pomocné vědy historické – archeologie, paleografie, numismatika, heraldika",
    studentTitle: "Pomocné vědy historické",
    subject: "dejepis",
    category: "Úvod do dějepisu",
    topic: "Pomocné vědy historické",
    briefDescription:
      "Přiřadíš nález ke správné vědě: archeologii, paleografii, numismatice, heraldice.",
    keywords: [
      "pomocné vědy historické", "archeologie", "paleografie", "numismatika", "heraldika",
      "mince", "erb", "rukopis", "vykopávky", "znak",
    ],
    goals: [
      "Přiřadit nález k pomocné vědě podle toho, co věda zkoumá.",
      "Rozlišit archeologii, paleografii, numismatiku a heraldiku.",
      "Nenechat se zmást vzhledem či materiálem (mince s portrétem je stále numismatika).",
    ],
    boundaries: [
      "Čtyři základní pomocné vědy (archeologie, paleografie, numismatika, heraldika).",
      "Rozhoduje předmět zařazení, ne materiál ani obrázek na nálezu.",
      "Nezahrnuje další pomocné vědy (chronologie, genealogie, sfragistika, epigrafika apod.) — pečeti a nápisy na kameni proto mezi položky nepatří.",
    ],
    gradeRange: [6, 6],
    inputType: "categorize",
    defaultLevel: 1,
    sessionTaskCount: 3,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Vědu poznáš podle toho, CO zkoumá: archeologie = vykopávky ze země, paleografie = čtení starého písma, numismatika = mince a platidla, heraldika = erby a znaky.",
      steps: [
        "Je nález vykopaný předmět ze země (kostra, střep, základy)? → archeologie.",
        "Je úkolem přečíst staré písmo nebo rukopis (listina, kronika, pergamen)? → paleografie.",
        "Je to mince nebo platidlo? → numismatika. Je to erb či znak rodu/města (na štítu, praporu, bráně)? → heraldika.",
      ],
      commonMistake:
        "Třídit podle vzhledu nebo materiálu — mince s portrétem panovníka je numismatika (ne heraldika), starou listinu ke čtení řeší paleografie (ne archeologie).",
      example:
        "Vykopaná nádoba = archeologie. Rukopis = paleografie. Mince = numismatika. Erb = heraldika.",
    },
  },
];
