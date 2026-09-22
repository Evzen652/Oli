/**
 * Čeština 6. ročník — Literární výchova: Verš, rým, přirovnání, metafora
 * (úvod) (select_one).
 *
 * Navazuje na grade-5/cjl/elementarniLiterarniPojmyPriRozboruTextu.ts (verš,
 * sloka, rým, přirovnání jako rozcvička) a přidává druhy rýmu (sdružený,
 * střídavý, obkročný) a metaforu jako nový pojem odlišený od přirovnání.
 *
 *  • L1 — ZAPAMATOVÁNÍ: definice pojmů (verš, sloka, rým, přirovnání,
 *    metafora, tři druhy rýmu popsané slovy) a jednoduché jednovětné ukázky
 *    s jasným „jako“ nebo bez něj. Banka 15 položek.
 *  • L2 — POUŽITÍ na nové ukázce: (a) rýmové schéma ručně ověřeného
 *    čtyřverší (16 kusů; typy se v bance STŘÍDAJÍ po jednom — sdružený,
 *    střídavý, obkročný, bez rýmu — aby první sezení nepokrylo jen jeden
 *    druh rýmu), (b) přirovnání
 *    × metafora v jedné větě (12 obrazů, každý má obě podoby, ukazuje se
 *    vždy jen jedna). Šablony (a)/(b) se střídají rovnoměrně.
 *  • L3 — ANALÝZA A PŘENOS: (1) význam metafory (co tím autor myslí),
 *    (2) převod metafory na přirovnání se stejným obrazem, (3) past „jako“
 *    bez přirovnání (role/povolání × skutečné porovnání), (4) dvojverší
 *    (schéma AA / bez rýmu) a čtyřverší (AABB/ABAB/ABBA), kde žák ověří
 *    SOUČASNĚ rým i přítomnost/umístění obrazného prostředku. Všechny čtyři šablony mají banku 12 a střídají se rovnoměrně.
 *
 * Chybový model (viz optionFeedback u každé úlohy):
 *  • rýmové schéma se čte jen podle prvních dvou veršů (sousední rým ↔
 *    ob-jeden ↔ obkročný se zaměňují);
 *  • metafora se plete s přirovnáním (přehlédnuté/domyšlené slovo jako/jak)
 *    i se zosobněním (přenesený význam bez lidské činnosti věci);
 *  • metafora se čte doslova, nebo se přenese špatná vlastnost obrazu;
 *  • slovo jako/jak označující ROLI nebo POVOLÁNÍ („pracuje jako kuchař“)
 *    se mylně považuje za přirovnání.
 *
 * Nápovědy u úloh, kde je klíčem NÁZEV POJMU (L1 definice, L2a rýmové
 * schéma), nikdy nejmenují ŽÁDNÝ z kandidátních názvů (ani ten, který zrovna
 * není klíčem) — jen popisují strukturu/pravidlo. U úloh, kde je klíčem CELÁ
 * VĚTA (L2b, L3), naopak nápověda může názvy pojmů zmínit obecně (nejde tím
 * prozradit CELOU odpověď).
 *
 * Determinismus: `gen()` nemá stav mezi voláními — pořadí šablon (`prokladej`)
 * i rotace poolu (`i` v `gen`) se počítají při každém volání znovu.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildChoiceTask as choice, losUlohy, ruzneUlohy, type Distractor } from "./_shared";

// ════════════════════════════════════════════════════════════════════════
// Sdílené: poslední slovo verše (pro rýmové schéma) a stavba tvrzení
// ════════════════════════════════════════════════════════════════════════

/** Poslední slovo verše bez koncové interpunkce, malými písmeny. */
function posledniSlovo(radek: string): string {
  const cista = radek.replace(/[,.!?„“–:;]+$/g, "").trim();
  const slova = cista.split(/\s+/);
  return slova[slova.length - 1].toLowerCase();
}

type Scheme = "sdružený (AABB)" | "střídavý (ABAB)" | "obkročný (ABBA)";
const SCHEMES: Scheme[] = ["sdružený (AABB)", "střídavý (ABAB)", "obkročný (ABBA)"];

/**
 * Dvouveršová báseň nemá schéma AABB — to popisuje ČTYŘI verše. U dvojverší
 * může být nanejvýš AA, proto má vlastní popisek; nikde se nesmí zaměnit za
 * čtyřveršový sdružený rým.
 */
const SDRUZENY_AA = "sdružený (AA)";

const RYM_PARY_FEEDBACK: Record<string, string> = {
  "sdružený (AABB)>střídavý (ABAB)":
    "Sdružený rým spojuje sousední verše (1. se 2., 3. se 4.). Tys porovnal verše, které jsou od sebe dál (1. se 3., 2. se 4.).",
  "sdružený (AABB)>obkročný (ABBA)":
    "Sdružený rým spojuje sousední verše (1. se 2., 3. se 4.). Tys porovnal krajní verše s prostředními (1. se 4., 2. se 3.).",
  "střídavý (ABAB)>sdružený (AABB)":
    "Střídavý rým spojuje verše po jednom (1. se 3., 2. se 4.). Tys porovnal jen sousední dvojice (1. se 2., 3. se 4.).",
  "střídavý (ABAB)>obkročný (ABBA)":
    "Střídavý rým spojuje verše po jednom (1. se 3., 2. se 4.). Tys porovnal krajní verše s prostředními (1. se 4., 2. se 3.).",
  "obkročný (ABBA)>sdružený (AABB)":
    "Obkročný rým obepíná krajními verši ty prostřední (1. se 4., 2. se 3.). Tys porovnal jen sousední dvojice (1. se 2., 3. se 4.).",
  "obkročný (ABBA)>střídavý (ABAB)":
    "Obkročný rým obepíná krajními verši ty prostřední (1. se 4., 2. se 3.). Tys porovnal verše po jednom (1. se 3., 2. se 4.).",
};

function bezRymuFeedback(scheme: Scheme): string {
  if (scheme === "sdružený (AABB)") return "Verše se ve skutečnosti rýmují – 1. se 2. a 3. se 4. verš. Zkontroluj jejich konce znovu.";
  if (scheme === "střídavý (ABAB)") return "Verše se ve skutečnosti rýmují – 1. se 3. a 2. se 4. verš. Zkontroluj jejich konce znovu.";
  return "Verše se ve skutečnosti rýmují – 1. se 4. a 2. se 3. verš. Zkontroluj jejich konce znovu.";
}

function vysvetleniRym(scheme: string, w: string[]): string {
  // Dvojverší: existují jen dva konce veršů, sahat na w[2]/w[3] by vyrobilo
  // „undefined – undefined“ a tvrzení o 3. a 4. verši, které v básni nejsou.
  if (w.length === 2)
    return `${w[0]} – ${w[1]} tvoří rýmovou dvojici (1. a 2. verš) – sousední verše, proto sdružený rým (AA).`;
  if (scheme === "sdružený (AABB)")
    return `${w[0]} – ${w[1]} tvoří pár (1. a 2. verš), ${w[2]} – ${w[3]} další pár (3. a 4. verš) – sousední dvojice, proto sdružený rým (AABB).`;
  if (scheme === "střídavý (ABAB)")
    return `${w[0]} – ${w[2]} tvoří pár (1. a 3. verš), ${w[1]} – ${w[3]} další pár (2. a 4. verš) – verše se rýmují po jednom, proto střídavý rým (ABAB).`;
  return `${w[0]} – ${w[3]} tvoří pár (1. a 4. verš), ${w[1]} – ${w[2]} další pár (2. a 3. verš) – krajní verše obepínají ty prostřední, proto obkročný rým (ABBA).`;
}

const RADA = ["1.", "2.", "3.", "4."];
const PREP_VERS = ["v", "ve", "ve", "ve"];

// ════════════════════════════════════════════════════════════════════════
// L1 — definice pojmů a jednoduché ukázky
// ════════════════════════════════════════════════════════════════════════

interface L1Item {
  q: string;
  correct: string;
  d: Distractor[];
  h0: string;
  h1: string;
  ex: string;
}

const L1_BANK: L1Item[] = [
  {
    q: "Jak se nazývá jeden řádek básně?",
    correct: "verš",
    d: [
      { value: "sloka", why: "Sloka je celá skupina veršů, ne jediný řádek." },
      { value: "rým", why: "Rým je zvuková shoda konců řádků, ne řádek samotný." },
      { value: "odstavec", why: "Odstavec patří k próze. Řádek básně má svůj vlastní název." },
    ],
    h0: "Básně se dělí na menší celky. Hledáš pojmenování pro ten úplně nejmenší – jeden jediný řádek.",
    h1: "Několik takových nejmenších celků dohromady tvoří větší celek (má jiný název), který je od dalšího takového celku oddělený prázdným řádkem. Ty ale hledáš název pro tu nejmenší jednotku, ne pro tu větší.",
    ex: "Jeden řádek básně se nazývá verš. Skupina veršů oddělená mezerou je sloka.",
  },
  {
    q: "Jak se nazývá skupina veršů oddělená od další prázdným řádkem?",
    correct: "sloka",
    d: [
      { value: "verš", why: "Verš je jen jeden řádek, ne celá skupina." },
      { value: "rým", why: "Rým se týká zvuku na konci veršů, ne jejich seskupení do celků." },
      { value: "odstavec", why: "Odstavec patří k próze, ne k básni psané ve verších." },
    ],
    h0: "Hledáš pojmenování pro větší celek básně – skupinu řádků, ne jeden řádek.",
    h1: "Jeden jediný řádek básně má svůj vlastní kratší název. Ty ale hledáš název pro celou skupinu takových řádků, které jsou od další skupiny odděleny mezerou.",
    ex: "Skupina veršů oddělená od další prázdným řádkem se nazývá sloka.",
  },
  {
    q: "Jak se nazývá zvuková shoda konců veršů, třeba les – ples?",
    correct: "rým",
    d: [
      { value: "verš", why: "Verš je celý řádek básně, ne jen shoda hlásek na jeho konci." },
      { value: "sloka", why: "Sloka je skupina veršů, netýká se zvuku na jejich konci." },
      { value: "přirovnání", why: "Přirovnání porovnává dvě věci slovem jako nebo jak, netýká se zvuku veršů." },
    ],
    h0: "Hledáš pojmenování pro to, když konce dvou řádků básně znějí stejně.",
    h1: "Nejde o název pro celý řádek ani pro skupinu řádků – jde jen o to, že se poslední slabiky na konci dvou veršů zvukově shodují.",
    ex: "Zvuková shoda konců veršů (les – ples) se nazývá rým.",
  },
  {
    q: "Jak se nazývá básnický prostředek, který porovnává dvě věci pomocí slova jako nebo jak?",
    correct: "přirovnání",
    d: [
      { value: "metafora", why: "Metafora porovnání vyjadřuje BEZ slova jako nebo jak – tady ale porovnávací slovo ve větě je." },
      { value: "zosobnění", why: "Zosobnění dává neživé věci lidskou činnost (zpívá, pláče), netýká se porovnání slovem jako." },
      { value: "rým", why: "Rým je zvuková shoda na konci veršů, ne porovnání dvou věcí." },
    ],
    h0: "Hledáš pojmenování pro prostředek, který dvě věci porovná a přitom použije slovo jako nebo jak.",
    h1: "Existuje i podobný prostředek, který pojmenování jedné věci přenese na druhou bez tohoto slova – ten ale hledáš jindy. Teď hledej ten, který porovnávací slovo přímo obsahuje.",
    ex: "Prostředek, který porovná dvě věci slovem jako nebo jak, se nazývá přirovnání.",
  },
  {
    q: "Jak se nazývá pojmenování přenesené na jinou věc podle podobnosti, bez slova jako nebo jak?",
    correct: "metafora",
    d: [
      { value: "přirovnání", why: "Přirovnání by muselo obsahovat slovo jako nebo jak – tady porovnávací slovo chybí." },
      { value: "zosobnění", why: "Zosobnění dává věci lidskou činnost (zpívá, pláče) – tady jde jen o přenesené pojmenování." },
      { value: "rým", why: "Rým je zvuková shoda na konci veršů, s přeneseným pojmenováním nesouvisí." },
    ],
    h0: "Hledáš pojmenování pro prostředek, který jednu věc rovnou nazve jinou, bez porovnávacího slova.",
    h1: "Existuje i podobný prostředek, který dvě věci porovná slovem jako nebo jak – ten ale hledáš jindy. Teď hledej ten, kde se porovnávací slovo vynechá a jedna věc se rovnou přejmenuje na druhou.",
    ex: "Pojmenování přenesené na jinou věc podle podobnosti, bez slova jako nebo jak, se nazývá metafora.",
  },
  {
    q: "Jak se nazývá rým, když se rýmují dva sousední verše – 1. se 2. a 3. se 4.?",
    correct: "sdružený (AABB)",
    d: [
      { value: "střídavý (ABAB)", why: "U střídavého rýmu se rýmuje 1. verš se 3. a 2. se 4. – tady se ale rýmují sousední verše." },
      { value: "obkročný (ABBA)", why: "U obkročného rýmu se rýmuje 1. verš se 4. a 2. se 3. – tady se ale rýmují sousední verše." },
      { value: "bez rýmu", why: "Zadání popisuje vzorec, ve kterém se verše rýmují – právě proto ten vzorec má svůj vlastní název. Odpověď bez rýmu sem tedy nepatří." },
    ],
    h0: "Hledáš název pro rým, kde spolu zní vedle sebe stojící verše.",
    h1: "Existují i jiná schémata, kde se verše rýmují po jednom nebo kde krajní verše obepínají ty prostřední – ta ale hledáš jindy. Teď hledej to, kde se rýmuje první se druhým a třetí se čtvrtým.",
    ex: "Když se rýmují sousední verše (1. se 2., 3. se 4.), jde o sdružený rým se schématem AABB.",
  },
  {
    q: "Jak se nazývá rým, když se rýmuje 1. verš se 3. a 2. verš se 4.?",
    correct: "střídavý (ABAB)",
    d: [
      { value: "sdružený (AABB)", why: "Sdružený rým spojuje sousední verše (1.–2., 3.–4.) – tady se ale verše rýmují po jednom, ne sousedně." },
      { value: "obkročný (ABBA)", why: "Obkročný rým má schéma 1.–4. a 2.–3. – tady se ale verše pravidelně střídají." },
      { value: "bez rýmu", why: "Zadání popisuje vzorec, ve kterém se verše rýmují – právě proto ten vzorec má svůj vlastní název. Odpověď bez rýmu sem tedy nepatří." },
    ],
    h0: "Hledáš název pro rým, kde se verše rýmují po jednom – přeskočí vždy jeden verš.",
    h1: "Existují i jiná schémata, kde se rýmují sousední verše nebo kde krajní verše obepínají ty prostřední – ta ale hledáš jindy. Teď hledej to, kde první verš zní stejně jako třetí a druhý jako čtvrtý.",
    ex: "Když se verše rýmují po jednom (1. se 3., 2. se 4.), jde o střídavý rým se schématem ABAB.",
  },
  {
    q: "Jak se nazývá rým, když se rýmuje 1. verš se 4. a 2. verš se 3.?",
    correct: "obkročný (ABBA)",
    d: [
      { value: "sdružený (AABB)", why: "Sdružený rým spojuje jen sousední verše – tady ale krajní verš obepíná ty prostřední." },
      { value: "střídavý (ABAB)", why: "Střídavý rým má schéma 1.–3. a 2.–4. – tady ale krajní verše obepínají ty prostřední." },
      { value: "bez rýmu", why: "Zadání popisuje vzorec, ve kterém se verše rýmují – právě proto ten vzorec má svůj vlastní název. Odpověď bez rýmu sem tedy nepatří." },
    ],
    h0: "Hledáš název pro rým, kde krajní verše obepínají ty dva prostřední.",
    h1: "Existují i jiná schémata, kde se rýmují sousední verše nebo kde se verše střídají po jednom – ta ale hledáš jindy. Teď hledej to, kde první verš zní stejně jako čtvrtý a druhý jako třetí.",
    ex: "Když krajní verše obepínají ty prostřední (1. se 4., 2. se 3.), jde o obkročný rým se schématem ABBA.",
  },
  {
    q: "Oči má modré jako nebe. Jaký básnický prostředek tu je?",
    correct: "přirovnání",
    d: [
      { value: "metafora", why: "Metafora by pojmenování přenesla bez slova jako – tady ale porovnávací slovo jako ve větě je." },
      { value: "zosobnění", why: "Zosobnění by dávalo očím lidskou činnost – tady se jen porovnává barva slovem jako." },
      { value: "rým", why: "Věta nemá dva verše ke srovnání zvuku, jde o jednu větu s porovnáním." },
    ],
    h0: "Podívej se, jestli věta obsahuje slovo jako nebo jak.",
    h1: "Pokud porovnávací slovo jako nebo jak ve větě najdeš, jde o prostředek, který dvě věci jen porovnává. Kdyby tam nebylo a jedna věc by se rovnou nazvala druhou, šlo by o jiný prostředek.",
    ex: "Věta obsahuje slovo jako, které porovnává oči s nebem – jde tedy o přirovnání.",
  },
  {
    q: "Jeho úsměv je celé slunce. Jaký básnický prostředek tu je?",
    correct: "metafora",
    d: [
      { value: "přirovnání", why: "Přirovnání by potřebovalo slovo jako nebo jak – tady porovnávací slovo chybí, úsměv se rovnou nazývá sluncem." },
      { value: "zosobnění", why: "Zosobnění dává neživé věci lidskou činnost (zpívá, pláče) – tady se jen jedna věc nazývá druhou." },
      { value: "rým", why: "Rým je zvuková shoda na konci veršů, s pojmenováním nesouvisí." },
    ],
    h0: "Podívej se, jestli věta obsahuje slovo jako nebo jak.",
    h1: "Pokud porovnávací slovo jako nebo jak ve větě chybí a jedna věc se rovnou nazývá druhou, jde o jiný prostředek, než když se dvě věci jen porovnávají.",
    ex: "Věta neobsahuje slovo jako ani jak – úsměv se rovnou nazývá sluncem, jde tedy o metaforu.",
  },
  {
    q: "Báseň má několik čtyřveršových částí oddělených mezerou. Jak se každá z nich nazývá?",
    correct: "sloka",
    d: [
      { value: "verš", why: "Verš je jen jeden řádek, ne celá čtyřveršová část." },
      { value: "rým", why: "Rým se týká zvuku na konci veršů, ne seskupení řádků do částí." },
      { value: "odstavec", why: "Odstavec patří k próze, ne k básni psané ve verších." },
    ],
    h0: "Hledáš pojmenování pro celou skupinu veršů, ne pro jeden řádek.",
    h1: "Jeden řádek básně má svůj vlastní kratší název. Ty ale hledáš název pro celou skupinu takových řádků oddělenou od další mezerou.",
    ex: "Skupina veršů oddělená od další mezerou se nazývá sloka.",
  },
  {
    q: "Chodník byl kluzký jako led. Jaký básnický prostředek tu je?",
    correct: "přirovnání",
    d: [
      { value: "metafora", why: "Metafora by pojmenování přenesla bez slova jako – tady ale porovnávací slovo jako ve větě je." },
      { value: "zosobnění", why: "Zosobnění by dávalo chodníku lidskou činnost – tady se jen porovnává kluzkost slovem jako." },
      { value: "rým", why: "Věta nemá dva verše ke srovnání zvuku, jde o jednu větu s porovnáním." },
    ],
    h0: "Podívej se, jestli věta obsahuje slovo jako nebo jak.",
    h1: "Pokud porovnávací slovo jako nebo jak ve větě najdeš, jde o prostředek, který dvě věci jen porovnává, ne o ten, který jednu věc rovnou přejmenuje na druhou.",
    ex: "Věta obsahuje slovo jako, které porovnává kluzkost chodníku s ledem – jde tedy o přirovnání.",
  },
  {
    q: "Babiččiny ruce jsou dvě hebké peřinky. Jaký básnický prostředek tu je?",
    correct: "metafora",
    d: [
      { value: "přirovnání", why: "Přirovnání by potřebovalo slovo jako nebo jak – tady porovnávací slovo chybí, ruce se rovnou nazývají peřinkami." },
      { value: "zosobnění", why: "Zosobnění dává neživé věci lidskou činnost – tady se jen jedna věc nazývá druhou." },
      { value: "rým", why: "Rým je zvuková shoda na konci veršů, s pojmenováním nesouvisí." },
    ],
    h0: "Podívej se, jestli věta obsahuje slovo jako nebo jak.",
    h1: "Pokud porovnávací slovo jako nebo jak ve větě chybí a jedna věc se rovnou nazývá druhou, jde o jiný prostředek, než když se dvě věci jen porovnávají.",
    ex: "Věta neobsahuje slovo jako ani jak – ruce se rovnou nazývají peřinkami, jde tedy o metaforu.",
  },
  {
    q: "Jeho hlas duní jako hrom. Jaký básnický prostředek tu je?",
    correct: "přirovnání",
    d: [
      { value: "metafora", why: "Metafora by pojmenování přenesla bez slova jako – tady ale porovnávací slovo jako ve větě je." },
      { value: "zosobnění", why: "Zosobnění by dávalo hlasu lidskou činnost – tady se jen porovnává zvuk slovem jako." },
      { value: "rým", why: "Věta nemá dva verše ke srovnání zvuku, jde o jednu větu s porovnáním." },
    ],
    h0: "Podívej se, jestli věta obsahuje slovo jako nebo jak.",
    h1: "Pokud porovnávací slovo jako nebo jak ve větě najdeš, jde o prostředek, který dvě věci jen porovnává, ne o ten, který jednu věc rovnou přejmenuje na druhou.",
    ex: "Věta obsahuje slovo jako, které porovnává hlas s hromem – jde tedy o přirovnání.",
  },
  {
    q: "Jeho vztek byl vulkán před výbuchem. Jaký básnický prostředek tu je?",
    correct: "metafora",
    d: [
      { value: "přirovnání", why: "Přirovnání by potřebovalo slovo jako nebo jak – tady porovnávací slovo chybí, vztek se rovnou nazývá vulkánem." },
      { value: "zosobnění", why: "Zosobnění dává neživé věci lidskou činnost – tady se jen jedna věc nazývá druhou." },
      { value: "rým", why: "Rým je zvuková shoda na konci veršů, s pojmenováním nesouvisí." },
    ],
    h0: "Podívej se, jestli věta obsahuje slovo jako nebo jak.",
    h1: "Pokud porovnávací slovo jako nebo jak ve větě chybí a jedna věc se rovnou nazývá druhou, jde o jiný prostředek, než když se dvě věci jen porovnávají.",
    ex: "Věta neobsahuje slovo jako ani jak – vztek se rovnou nazývá vulkánem, jde tedy o metaforu.",
  },
];

function ukolL1(it: L1Item): PracticeTask | null {
  return choice(it.q, it.correct, it.d, { hints: [it.h0, it.h1], explanation: it.ex });
}

// ════════════════════════════════════════════════════════════════════════
// L2 (a) — rýmové schéma čtyřverší (12: po 4 na typ)
// ════════════════════════════════════════════════════════════════════════

interface Ctyrversi {
  v: [string, string, string, string];
  scheme: Scheme | "bez rýmu";
}

const L2A_BANK: Ctyrversi[] = [
  // Typy se střídají po jednom (sdružený → střídavý → obkročný → bez rýmu),
  // aby první sezení (prvních 6 úloh poolu) pokrylo víc než jedno schéma.
  {
    scheme: "sdružený (AABB)",
    v: [
      "Za starou chalupou roste hluboký les,",
      "v sobotu se ve vsi koná školní ples.",
      "Muzika tam bude hrát až do pozdní noci,",
      "starší kluci slíbili s výzdobou pomoci.",
    ],
  },
  {
    scheme: "střídavý (ABAB)",
    v: [
      "Ráno padl na trávu první mráz,",
      "začal se krátký prosincový den,",
      "babička dětem řekla: mám ráda vás,",
      "večer je čekal klidný spánek a sen.",
    ],
  },
  {
    scheme: "obkročný (ABBA)",
    v: [
      "Za lesem se leskne rybniční voda,",
      "byl slunečný a teplý letní den,",
      "chlapci se zdál sladký odpolední sen,",
      "probudit ho teď by byla škoda.",
    ],
  },
  {
    scheme: "bez rýmu",
    v: [
      "Ráno vstalo slunce nad zahradou,",
      "kohout zakokrhal hned za vraty.",
      "Babička otevřela okno do dvora,",
      "a pustila dovnitř čerstvý vzduch.",
    ],
  },
  {
    scheme: "sdružený (AABB)",
    v: [
      "Podél cesty rostou vysoké stromy,",
      "za nimi stojí barevné domy.",
      "Zahrady voní, přišel svěží máj,",
      "celá ves vypadá jako pravý ráj.",
    ],
  },
  {
    scheme: "střídavý (ABAB)",
    v: [
      "Kolem chaty se prostírá tichý les,",
      "na jaře tu rozkvétá bílé kvítí,",
      "v neděli se v sále koná malý ples,",
      "ve všech oknech přitom vesele svítí.",
    ],
  },
  {
    scheme: "obkročný (ABBA)",
    v: [
      "Na podzim udeřil první ranní mráz,",
      "zbělela jím celá travnatá louka,",
      "na cestě se práší jako bílá mouka,",
      "maminka volá z okna: pojďte už, čekám na vás.",
    ],
  },
  {
    scheme: "bez rýmu",
    v: [
      "Kluci si hráli s míčem na hřišti,",
      "holky skákaly panáka u zdi.",
      "Najednou začalo pršet jako z konve,",
      "všichni utíkali rychle domů.",
    ],
  },
  {
    scheme: "sdružený (AABB)",
    v: [
      "Na zápraží spí ospalá kočka,",
      "sluníčko jí hřeje malá očka.",
      "Za humny se zelená čerstvá louka,",
      "v pytli u mlýna voní bílá mouka.",
    ],
  },
  {
    scheme: "střídavý (ABAB)",
    v: [
      "Kolem vesnice šumí staré stromy,",
      "za kopcem se leskne modré moře,",
      "u cesty stojí nízké bílé domy,",
      "slunce hřeje na kamenném dvoře.",
    ],
  },
  {
    scheme: "obkročný (ABBA)",
    v: [
      "Do kraje zase přišel vonný máj,",
      "sluncem zalité jsou vzdálené hory,",
      "na vsi se probouzí i staré dvory,",
      "celé okolí vypadá jako ráj.",
    ],
  },
  {
    scheme: "bez rýmu",
    v: [
      "Dědeček opravoval staré kolo,",
      "babička zatím pekla bábovku.",
      "Vnoučata běhala po dvorku",
      "a smála se od ucha k uchu.",
    ],
  },
  {
    scheme: "sdružený (AABB)",
    v: [
      "Pod kopcem teče studená voda,",
      "nenabrat si z ní by byla škoda.",
      "V dálce se tyčí zasněžené hory,",
      "pod nimi leží vesnické dvory.",
    ],
  },
  {
    scheme: "střídavý (ABAB)",
    v: [
      "Na dvorku leží líná stará kočka,",
      "za chvíli se snese tmavá noc,",
      "dřímá a sotva otvírá očka,",
      "kdyby se lekla, přiběhne jí pomoc.",
    ],
  },
  {
    scheme: "obkročný (ABBA)",
    v: [
      "Na zahradě rozkvetlo jarní kvítí,",
      "za obzorem se modrá klidné moře,",
      "slunce hřeje na kamenném dvoře,",
      "a všude kolem vesele svítí.",
    ],
  },
  {
    scheme: "bez rýmu",
    v: [
      "Na návsi stál starý strom,",
      "pod ním si hrálo hodně dětí.",
      "Sluníčko svítilo celý den,",
      "a nikdo nikam nepospíchal.",
    ],
  },
];

const HINT0_RYM = "Označ konce všech čtyř veršů písmeny podle toho, jak zní – stejný zvuk dostane stejné písmeno.";
const HINT1_RYM =
  "Pak zkontroluj, jestli stejná písmena vyšla hned vedle sebe, jestli se pravidelně střídají po jednom, nebo jestli krajní dvojice obepíná tu prostřední – každý z těchto vzorů má svůj název mezi možnostmi.";

const BEZ_RYMU_PARY: Record<Scheme, string> = {
  "sdružený (AABB)": "1. se 2. a 3. se 4. verš",
  "střídavý (ABAB)": "1. se 3. a 2. se 4. verš",
  "obkročný (ABBA)": "1. se 4. a 2. se 3. verš",
};

function ukolRym(cv: Ctyrversi): PracticeTask | null {
  const w = cv.v.map(posledniSlovo);
  const question = `Přečti si čtyřverší: „${cv.v[0]} / ${cv.v[1]} / ${cv.v[2]} / ${cv.v[3]}“ Jaké má rýmové schéma?`;
  const distractors: Distractor[] =
    cv.scheme === "bez rýmu"
      ? SCHEMES.map((s) => ({
          value: s,
          why: `Verše se ve skutečnosti nerýmují – ${BEZ_RYMU_PARY[s]} spolu nezní stejně. Zkontroluj konce veršů znovu.`,
        }))
      : [
          ...SCHEMES.filter((s) => s !== cv.scheme).map((s) => ({ value: s, why: RYM_PARY_FEEDBACK[`${cv.scheme}>${s}`] })),
          { value: "bez rýmu", why: bezRymuFeedback(cv.scheme) },
        ];
  const explanation =
    cv.scheme === "bez rýmu"
      ? `Žádná dvojice konců veršů (${w.join(", ")}) spolu nezní stejně – proto tu rým není.`
      : vysvetleniRym(cv.scheme, w);
  return choice(question, cv.scheme, distractors, {
    hints: [HINT0_RYM, HINT1_RYM],
    explanation,
  });
}

// ════════════════════════════════════════════════════════════════════════
// L2 (b) — přirovnání × metafora v jedné větě (12 obrazů, obě podoby)
// ════════════════════════════════════════════════════════════════════════

interface Obraz {
  metafora: string;
  prirovnani: string;
}

const L2B_BANK: Obraz[] = [
  { metafora: "Maminčin úsměv je sluníčko.", prirovnani: "Maminčin úsměv hřeje jako sluníčko." },
  { metafora: "Dědečkovy vlasy jsou samý sníh.", prirovnani: "Dědečkovy vlasy jsou bílé jako sníh." },
  { metafora: "Tomáš je na běžecké dráze blesk.", prirovnani: "Tomáš běhá rychle jako blesk." },
  { metafora: "Petrův pokoj je skládka.", prirovnani: "V Petrově pokoji je nepořádek jako na skládce." },
  { metafora: "Anežčin hlas je stříbrný zvonek.", prirovnani: "Anežčin hlas zní jasně jako zvonek." },
  { metafora: "Podzimní les je pestrý obraz.", prirovnani: "Podzimní les je barevný jako obraz." },
  { metafora: "Ondřejova paměť je počítač.", prirovnani: "Ondřej si pamatuje čísla rychle jako počítač." },
  { metafora: "Noční obloha je tmavé plátno.", prirovnani: "Noční obloha je tmavá jako plátno." },
  { metafora: "Babiččiny koláče jsou med.", prirovnani: "Babiččiny koláče jsou sladké jako med." },
  { metafora: "Martinovy ruce jsou led.", prirovnani: "Martinovy ruce jsou studené jako led." },
  { metafora: "Školní chodba o přestávce je mraveniště.", prirovnani: "O přestávce je na chodbě rušno jako v mraveništi." },
  { metafora: "Dědova stará bouda je hrad.", prirovnani: "Dědova stará bouda vypadá jako hrad." },
];

const HINT0_OBRAZ = "Hledej ve větě slovo jako nebo jak.";
const HINT1_OBRAZ =
  "Když porovnávací slovo jako nebo jak ve větě najdeš, jde o prostředek se dvěma porovnávanými věcmi. Když tam není a jedna věc se rovnou nazývá druhou, jde o prostředek bez porovnávacího slova. Zkontroluj přitom, že věc nekoná lidskou činnost a že věta nic schválně nepřehání.";

function feedbackObraz(spravny: "metafora" | "přirovnání", zvoleny: string, nadsazkaLabel = "nadsázka"): string {
  if (zvoleny === "metafora") return "Metafora by pojmenování přenesla BEZ slova jako nebo jak – tahle věta ale porovnávací slovo jako obsahuje.";
  if (zvoleny === "přirovnání") return "Přirovnání by muselo mít slovo jako nebo jak – tahle věta ho ale neobsahuje, jedna věc se v ní rovnou nazývá druhou.";
  if (zvoleny === "zosobnění")
    return `Zosobnění je tam, kde neživá věc koná lidskou činnost (déšť pláče, vítr si zpívá). V téhle větě žádná neživá věc lidskou činnost nekoná, jen se v ní ${spravny === "metafora" ? "jedna věc rovnou nazývá druhou" : "dvě věci porovnávají"}.`;
  // Nápis na tlačítku a jméno prostředku ve zpětné vazbě musí být totéž slovo.
  const N = nadsazkaLabel.charAt(0).toUpperCase() + nadsazkaLabel.slice(1);
  return `${N} schválně přehání (čekal jsem sto let). Tahle věta nic nepřehání, jen ${spravny === "metafora" ? "pojmenovává" : "porovnává"} jedním obrazem.`;
}

function ukolObraz(o: Obraz): PracticeTask | null {
  const ukazMetaforu = Math.random() < 0.5;
  const sentence = ukazMetaforu ? o.metafora : o.prirovnani;
  const correct: "metafora" | "přirovnání" = ukazMetaforu ? "metafora" : "přirovnání";
  const jiny = ukazMetaforu ? "přirovnání" : "metafora";
  // „přirovnání“ je samo o sobě nejdelší ze čtyř možných slov (metafora,
  // zosobnění, nadsázka, přirovnání) — když je klíčem, byl by systematicky
  // nejdelší (check:length). Použije se proto skutečné, běžně užívané
  // spojení „básnická nadsázka“ (ne vymyšlená „přehnaná nadsázka“, která
  // navíc tautologicky opakuje význam slova nadsázka).
  const nadsazkaLabel = correct === "přirovnání" ? "básnická nadsázka" : "nadsázka";
  const distractors: Distractor[] = [
    { value: jiny, why: feedbackObraz(correct, jiny) },
    { value: "zosobnění", why: feedbackObraz(correct, "zosobnění") },
    { value: nadsazkaLabel, why: feedbackObraz(correct, "nadsázka", nadsazkaLabel) },
  ];
  const question = `„${sentence}“ Jaký básnický prostředek je v téhle větě?`;
  const explanation =
    correct === "metafora"
      ? "Věta neobsahuje slovo jako ani jak – jedna věc se v ní rovnou nazývá druhou, jde tedy o metaforu."
      : "Věta obsahuje slovo jako, které dvě věci jen porovnává, jde tedy o přirovnání.";
  return choice(question, correct, distractors, { hints: [HINT0_OBRAZ, HINT1_OBRAZ], explanation });
}

// ════════════════════════════════════════════════════════════════════════
// L3 (1) — význam metafory (12 položek)
// ════════════════════════════════════════════════════════════════════════

interface Vyznam {
  sentence: string;
  obraz: string;
  correct: string;
  literal: string;
  wrongProp: string;
  opposite: string;
}

const L3_VYZNAM: Vyznam[] = [
  {
    sentence: "Tomáš je na hřišti šíp.",
    obraz: "šíp",
    correct: "Tomáš běhá po hřišti velmi rychle.",
    literal: "Tomáš střílí na hřišti z luku.",
    wrongProp: "Tomáš je na hřišti hubený a vysoký.",
    opposite: "Tomáš běhá po hřišti velmi pomalu.",
  },
  {
    sentence: "Hladina jezera byla dnes ráno zrcadlem.",
    obraz: "zrcadlo",
    correct: "Hladina jezera byla dnes ráno úplně klidná a hladká.",
    literal: "Hladina jezera se dnes ráno proměnila ve sklo.",
    wrongProp: "Hladina jezera byla dnes ráno studená a hluboká.",
    opposite: "Hladina jezera byla dnes ráno rozbouřená a divoká.",
  },
  {
    sentence: "Filip byl na turistické túře pravý hlemýžď.",
    obraz: "hlemýžď",
    correct: "Filip šel na túře velmi pomalu.",
    literal: "Filip nesl na túře na zádech ulitu.",
    wrongProp: "Filip byl na túře velmi tichý a plachý.",
    opposite: "Filip šel na túře velmi rychle.",
  },
  {
    sentence: "Eliška byla v kuchyni pravý mraveneček.",
    obraz: "mraveneček",
    correct: "Eliška v kuchyni pořád pilně pracovala.",
    literal: "Eliška v kuchyni hledala drobečky jídla.",
    wrongProp: "Eliška byla v kuchyni velmi rychlá a hlučná.",
    opposite: "Eliška v kuchyni celou dobu jen lenošila.",
  },
  {
    sentence: "Viktor byl při hraní šachu pravá liška.",
    obraz: "liška",
    correct: "Viktor hrál šachy velmi chytře a mazaně.",
    literal: "Viktorovi při šachu narostl rezavý ocas.",
    wrongProp: "Viktor byl při hraní šachu velmi rychlý a nervózní.",
    opposite: "Viktor hrál šachy velmi neobratně a naivně.",
  },
  {
    sentence: "Táta byl v těžkých chvílích pro celou rodinu skála.",
    obraz: "skála",
    correct: "Táta byl v těžkých chvílích velmi spolehlivý a klidný.",
    literal: "Táta se v těžkých chvílích proměnil v kus kamene.",
    wrongProp: "Táta byl v těžkých chvílích velmi smutný a tichý.",
    opposite: "Táta byl v těžkých chvílích popudlivý a nervózní.",
  },
  {
    sentence: "Když Marek prohrál finále, byl na chvíli sopka.",
    obraz: "sopka",
    correct: "Marek se po prohře velmi rozzlobil.",
    literal: "Z Marka po prohře vyšlehl skutečný oheň.",
    wrongProp: "Marek byl po prohře velmi smutný a zamlklý.",
    opposite: "Marek zůstal po prohře úplně klidný.",
  },
  {
    sentence: "Před vystoupením byla Klára rozbouřené moře.",
    obraz: "rozbouřené moře",
    correct: "Klára byla před vystoupením velmi nervózní a rozrušená.",
    literal: "Z Kláry se před vystoupením valily skutečné vlny.",
    wrongProp: "Klára byla před vystoupením velmi ospalá a unavená.",
    opposite: "Klára byla před vystoupením naprosto klidná.",
  },
  {
    sentence: "Sestra mu byla během nemoci pravý anděl.",
    obraz: "anděl",
    correct: "Sestra se o něj během nemoci moc starala a pomáhala mu.",
    literal: "Sestře během jeho nemoci narostla křídla.",
    wrongProp: "Sestra byla během jeho nemoci hodně přísná.",
    opposite: "Sestra se o něj během nemoci vůbec nezajímala.",
  },
  {
    sentence: "Filip byl v tom zápase lev.",
    obraz: "lev",
    correct: "Filip bojoval v zápase velmi odvážně.",
    literal: "Filipovi v zápase narostla lví hříva.",
    wrongProp: "Filip byl v zápase velmi unavený a pomalý.",
    opposite: "Filip bojoval v zápase velmi bojácně.",
  },
  {
    sentence: "O přestávkách byla Tereza myš.",
    obraz: "myš",
    correct: "Tereza byla o přestávkách velmi tichá a nenápadná.",
    literal: "Tereza si o přestávkách hrála s myší v kleci.",
    wrongProp: "Tereza byla o přestávkách velmi rychlá a obratná.",
    opposite: "Tereza byla o přestávkách velmi hlučná a nápadná.",
  },
  {
    sentence: "Na soutěži byla Anna hvězda.",
    obraz: "hvězda",
    correct: "Anna na soutěži vynikala nade všemi ostatními.",
    literal: "Anna se na soutěži proměnila ve svítící hvězdu.",
    wrongProp: "Anna byla na soutěži velmi nervózní a tichá.",
    opposite: "Anna na soutěži zklamala a byla nejhorší ze všech.",
  },
];

function ukolVyznam(v: Vyznam): PracticeTask | null {
  const distractors: Distractor[] = [
    { value: v.literal, why: `Metafora se nečte doslova. Věta „${v.sentence}“ neříká, že se to opravdu stalo – jde o přenesený význam.` },
    { value: v.wrongProp, why: `To je jiná vlastnost, než o kterou tu jde. Zkus si představit, čím je typický obraz „${v.obraz}“.` },
    { value: v.opposite, why: "To je přesný opak správného významu – zkontroluj směr vlastnosti (rychle/pomalu, klidně/nervózně…)." },
  ];
  const question = `„${v.sentence}“ Co tím chtěl autor říct?`;
  return choice(question, v.correct, distractors, {
    hints: [
      `Nečti větu doslova. Zamysli se, čím je obraz „${v.obraz}“ typický.`,
      `Vylučuj doslovné čtení (obraz jako skutečná věc) i přesný opak vlastnosti. Ze dvou zbylých vyber tu, která popisuje vlastnost, jíž je obraz „${v.obraz}“ nejvíc typický.`,
    ],
    explanation: `Autor obraz „${v.obraz}“ použil jako metaforu, proto věta znamená: ${v.correct}`,
  });
}

// ════════════════════════════════════════════════════════════════════════
// L3 (2) — převod metafory na přirovnání se stejným obrazem (12 položek)
// ════════════════════════════════════════════════════════════════════════

interface Prevod {
  metafora: string;
  simile: string;
  jinaMetafora: string;
  zosobneni: string;
  bezObrazu: string;
}

const L3_PREVOD: Prevod[] = [
  {
    metafora: "Babiččina zahrada je zelený koberec.",
    simile: "Tráva v babiččině zahradě je hustá jako koberec.",
    jinaMetafora: "Babiččina zahrada je pravý ráj.",
    zosobneni: "Babiččina zahrada si v létě hraje se sluncem.",
    bezObrazu: "Babiččina zahrada má rozlohu asi sto metrů čtverečních.",
  },
  {
    metafora: "Chlapcovy oči jsou dvě hvězdy.",
    simile: "Chlapcovy oči svítí jako hvězdy.",
    jinaMetafora: "Chlapcovy oči jsou hluboké studny.",
    zosobneni: "Chlapcovy oči si hrají se světlem svíčky.",
    bezObrazu: "Chlapec má hnědé oči.",
  },
  {
    metafora: "Řeka je stříbrná stuha mezi kopci.",
    simile: "Řeka se mezi kopci leskne jako stříbrná stuha.",
    jinaMetafora: "Řeka je dlouhá modrá cesta.",
    zosobneni: "Řeka si razí cestu mezi kopci.",
    bezObrazu: "Řeka je asi deset metrů široká.",
  },
  {
    metafora: "Dědovy brýle jsou dvě okenní tabulky.",
    simile: "Dědovy brýle jsou tlusté jako okenní tabulky.",
    jinaMetafora: "Dědovy oči jsou dvě sovy.",
    zosobneni: "Dědovy brýle mu sedí na nose a hlídají svět.",
    bezObrazu: "Děda nosí brýle už dvacet let.",
  },
  {
    metafora: "Sněhová pokrývka je bílá peřina na polích.",
    simile: "Pole jsou po sněhu bílá jako peřina.",
    jinaMetafora: "Sněhová pokrývka je studený koberec.",
    zosobneni: "Sníh si lehl na pole a usnul.",
    bezObrazu: "Napadlo asi deset centimetrů sněhu.",
  },
  {
    metafora: "Vojtova zlost je letní bouře.",
    simile: "Vojtova zlost burácí jako letní bouře.",
    jinaMetafora: "Vojtova zlost je oheň bez plamene.",
    zosobneni: "Vojtova zlost si hledá cestu ven.",
    bezObrazu: "Vojta se po prohře trochu rozzlobil.",
  },
  {
    metafora: "Terezčin smích je zvonkohra.",
    simile: "Terezčin smích zní jako zvonkohra.",
    jinaMetafora: "Terezčin smích je sluneční paprsek.",
    zosobneni: "Terezčin smích se rozeběhl celou třídou.",
    bezObrazu: "Tereza se na hodině dvakrát zasmála.",
  },
  {
    metafora: "Starý most je hřbet spícího draka.",
    simile: "Starý most se klene nad řekou jako hřbet draka.",
    jinaMetafora: "Starý most je zkamenělá duha.",
    zosobneni: "Starý most odpočívá nad řekou už sto let.",
    bezObrazu: "Starý most má tři oblouky.",
  },
  {
    metafora: "Bratrova netrpělivost je vroucí konvice.",
    simile: "Bratrova netrpělivost bublá jako vroucí konvice.",
    jinaMetafora: "Bratrova netrpělivost je jiskra na troud.",
    zosobneni: "Bratrova netrpělivost pobíhá po pokoji.",
    bezObrazu: "Bratr už čekal na oběd dvacet minut.",
  },
  {
    metafora: "Hory na obzoru jsou modré vlny.",
    simile: "Hory na obzoru se táhnou jako modré vlny.",
    jinaMetafora: "Hory na obzoru jsou spící obři.",
    zosobneni: "Hory na obzoru shlížejí mlčky na vesnici.",
    bezObrazu: "Hory na obzoru jsou vzdálené asi třicet kilometrů.",
  },
  {
    metafora: "Kubova únava je těžký kámen na ramenou.",
    simile: "Kubova únava tíží jako těžký kámen.",
    jinaMetafora: "Kubova únava je hustá mlha.",
    zosobneni: "Kubova únava se mu vplížila do nohou.",
    bezObrazu: "Kuba dnes vstal už v pět hodin ráno.",
  },
  {
    metafora: "Jezero za soumraku je tmavé zrcadlo.",
    simile: "Jezero se za soumraku leskne jako tmavé zrcadlo.",
    jinaMetafora: "Jezero za soumraku je černý inkoust.",
    zosobneni: "Jezero za soumraku ukládá slunce ke spánku.",
    bezObrazu: "Jezero je za soumraku úplně tiché a prázdné.",
  },
];

function ukolPrevod(p: Prevod): PracticeTask | null {
  const distractors: Distractor[] = [
    { value: p.jinaMetafora, why: "Tohle je taky metafora (bez slova jako), jen s jiným obrazem – nejde o převod na přirovnání." },
    { value: p.zosobneni, why: "Tahle věta dává popisované věci lidskou činnost (zosobnění), neporovnává ji slovem jako s obrazem z metafory." },
    { value: p.bezObrazu, why: "Tahle věta je jen věcné konstatování bez básnického obrazu – chybí v ní metafora i přirovnání." },
  ];
  const question = `Kterou větou vyjádříš totéž jako metaforu „${p.metafora}“, ale přirovnáním?`;
  return choice(question, p.simile, distractors, {
    hints: [
      "Hledej mezi možnostmi tu, která obsahuje slovo jako nebo jak a mluví o stejném obrazu jako metafora v zadání.",
      "Vyřaď větu, která je jen jinou metaforou (bez jako), větu, kde něco koná lidskou činnost, i větu bez žádného básnického obrazu. Zbyde přirovnání se stejným obrazem.",
    ],
    explanation: `Věta „${p.simile}“ vyjadřuje stejnou myšlenku jako metafora „${p.metafora}“, ale se slovem jako – proto je to přirovnání se stejným obrazem.`,
  });
}

// ════════════════════════════════════════════════════════════════════════
// L3 (3) — past „jako“ bez přirovnání (12 položek)
// ════════════════════════════════════════════════════════════════════════

interface JakoTrap {
  correct: string;
  role1: string;
  role2: string;
  manner: string;
}

const L3_JAKO: JakoTrap[] = [
  {
    correct: "Sníh na poli byl bílý jako cukr.",
    role1: "Bratr pracuje jako kuchař ve školní jídelně.",
    role2: "Jako kapitán týmu vedl Petr před zápasem rozcvičku.",
    manner: "Nikdo nevěděl, jak se ten trik dělá.",
  },
  {
    correct: "Voda v řece byla studená jako led.",
    role1: "Teta pracuje jako lékařka v místní nemocnici.",
    role2: "Jako nejstarší ze sourozenců rozhodovala Klára o programu výletu.",
    manner: "Nikdo nevěděl, jak dlouho bude oprava trvat.",
  },
  {
    correct: "Hlas zpěvačky zněl jasně jako zvon.",
    role1: "Strýc pracuje jako řidič autobusu.",
    role2: "Jako vedoucí oddílu rozděloval Tomáš úkoly.",
    manner: "Ptal se, jak se dostane na nádraží.",
  },
  {
    correct: "Chlapcovy vlasy byly rozcuchané jako křoví.",
    role1: "Sestra pracuje jako prodavačka v pekárně.",
    role2: "Jako moderátor uváděl Jakub celý večer.",
    manner: "Vysvětlil dětem, jak se skládá papírová loď.",
  },
  {
    correct: "Nový míč byl tvrdý jako kámen.",
    role1: "Táta pracuje jako učitel na základní škole.",
    role2: "Jako brankář chytal Filip poslední penaltu.",
    manner: "Nikdo si nevšiml, jak rychle uběhl čas.",
  },
  {
    correct: "Babiččiny rty byly popraskané jako suchá zem.",
    role1: "Bratranec pracuje jako zahradník v botanické zahradě.",
    role2: "Jako nejmladší člen týmu seděl Marek celý zápas na lavičce.",
    manner: "Rozmyslel si, jak odpoví na otázku.",
  },
  {
    correct: "Sourozenci si byli podobní jako dvě kapky vody.",
    role1: "Soused pracuje jako hasič u městské jednotky.",
    role2: "Jako předsedkyně třídy svolala Eliška schůzku.",
    manner: "Ukázal spolužákům, jak se řeší rovnice.",
  },
  {
    correct: "Chata na kopci byla stará jako sama hora.",
    role1: "Kamarádka pracuje o víkendech jako instruktorka plavání.",
    role2: "Jako kapitán lodi rozhodoval strýc o trase.",
    manner: "Popsal, jak se stavěl starý mlýn.",
  },
  {
    correct: "Nové koťátko bylo hebké jako hedvábí.",
    role1: "Bratr dělá o prázdninách brigádu jako číšník v restauraci.",
    role2: "Jako nejstarší z výpravy nesl táta mapu.",
    manner: "Zeptal se, jak dlouho trvá cesta vlakem.",
  },
  {
    correct: "Prsty klavíristky létaly po klávesách rychle jako vítr.",
    role1: "Dědeček dřív pracoval jako kovář v malé vesnici.",
    role2: "Jako dirigent sboru mávala paní učitelka rukama do rytmu.",
    manner: "Nikdo neřekl, jak se ta skladba jmenuje.",
  },
  {
    correct: "Listí padalo pomalu jako peříčka.",
    role1: "Sestřenice pracuje o prázdninách jako animátorka v táboře.",
    role2: "Jako organizátor závodu kontroloval strýc start.",
    manner: "Vysvětlila, jak se skládá origami žabka.",
  },
  {
    correct: "Chuť polévky byla ostrá jako paprika.",
    role1: "Soused pracuje jako pekař v malé pekárně.",
    role2: "Jako hlavní kuchař rozhodoval strýc o receptu.",
    manner: "Zajímalo ji, jak se peče chleba.",
  },
];

function ukolJako(j: JakoTrap): PracticeTask | null {
  const distractors: Distractor[] = [
    { value: j.role1, why: "Tady jako/jak označuje roli nebo povolání (kdo co dělá), ne porovnání dvou různých věcí – nejde o přirovnání." },
    { value: j.role2, why: "I tady jako označuje roli nebo funkci, ne porovnání dvou různých věcí – nejde o přirovnání." },
    { value: j.manner, why: "Tady jak neporovnává dvě věci, jen uvozuje informaci o tom, JAK se něco dělá nebo jak to dopadlo – přirovnání to není." },
  ];
  const question = "Ve které větě JE přirovnání (porovnání dvou různých věcí slovem jako nebo jak)?";
  return choice(question, j.correct, distractors, {
    hints: [
      "Najdi ve všech čtyřech větách slovo jako nebo jak a zkontroluj, co přesně v té větě dělá.",
      "Přirovnání vzniká, jen když jako/jak porovnává dvě různé věci (X je jako Y). Když označuje roli nebo povolání (pracuje jako…), nebo jen uvozuje informaci o tom, JAK se něco dělá (neví, jak…), o přirovnání nejde.",
    ],
    explanation: `Věta „${j.correct}“ porovnává dvě různé věci slovem jako nebo jak – to je přirovnání. Ostatní věty slovo jako/jak používají jinak: označují roli nebo povolání, anebo jen uvozují informaci o tom, JAK se něco dělá.`,
  });
}

// ════════════════════════════════════════════════════════════════════════
// L3 (4) — rým i obraz zároveň (6 dvojverší + 6 čtyřverší = 12 položek)
// ════════════════════════════════════════════════════════════════════════

type SchemeLabel = Scheme | "bez rýmu" | "sdružený (AA)";

interface RymObraz {
  verse: string[];
  /** U dvojverší jen „sdružený (AA)“ / „bez rýmu“ — AABB popisuje čtyři verše. */
  scheme: SchemeLabel;
  distractorScheme: SchemeLabel;
  figureLine: number;
  distractorLine: number;
  figureType: "metafora" | "přirovnání";
}

const L3_RYMOBRAZ: RymObraz[] = [
  // ── dvojverší (schéma nanejvýš AA, nikdy AABB) ──
  {
    verse: ["Bratrovy oči jsou dvě modré hvězdy,", "hned podle nich poznáš, jakou má náladu."],
    scheme: "bez rýmu",
    distractorScheme: SDRUZENY_AA,
    figureLine: 1,
    distractorLine: 2,
    figureType: "metafora",
  },
  {
    verse: ["Ta stará deka je měkká jako kočka,", "a pod ní spí kocour, mhouří ospalá očka."],
    scheme: SDRUZENY_AA,
    distractorScheme: "bez rýmu",
    figureLine: 1,
    distractorLine: 2,
    figureType: "přirovnání",
  },
  {
    verse: ["Dědova dílna voní pilinami a lakem,", "dědovy ruce jsou dva staré kořeny."],
    scheme: "bez rýmu",
    distractorScheme: SDRUZENY_AA,
    figureLine: 2,
    distractorLine: 1,
    figureType: "metafora",
  },
  {
    verse: ["Filip se na výlet těšil celý den,", "spal tvrdě jako medvěd a zdál se mu sen."],
    scheme: SDRUZENY_AA,
    distractorScheme: "bez rýmu",
    figureLine: 2,
    distractorLine: 1,
    figureType: "přirovnání",
  },
  {
    verse: ["Chuť polévky byla pálivá jako oheň,", "maminka přidala ještě lžíci majoránky."],
    scheme: "bez rýmu",
    distractorScheme: SDRUZENY_AA,
    figureLine: 1,
    distractorLine: 2,
    figureType: "přirovnání",
  },
  {
    verse: ["Kobercem zlatavým je podzimní louka,", "ze mlýna se sype jemná bílá mouka."],
    scheme: SDRUZENY_AA,
    distractorScheme: "bez rýmu",
    figureLine: 1,
    distractorLine: 2,
    figureType: "metafora",
  },
  // ── čtyřverší ──
  {
    verse: [
      "Za chalupou roste starý les,",
      "u cesty se pořádá letní ples,",
      "babiččiny oči jsou dvě modré tůně,",
      "ze zahrady stoupá sladká vůně.",
    ],
    scheme: "sdružený (AABB)",
    distractorScheme: "střídavý (ABAB)",
    figureLine: 3,
    distractorLine: 4,
    figureType: "metafora",
  },
  {
    verse: [
      "Bílý jako cukr byl ten ranní mráz,",
      "začínal dlouhý zimní školní den,",
      "paní učitelka řekla: mám dnes radost z vás,",
      "večer si každý přál jen klidný sen.",
    ],
    scheme: "střídavý (ABAB)",
    distractorScheme: "obkročný (ABBA)",
    figureLine: 1,
    distractorLine: 3,
    figureType: "přirovnání",
  },
  {
    verse: [
      "Za lesem se leskne rybniční voda,",
      "byl teplý a tichý letní den,",
      "chlapci se zdál sladký odpolední sen,",
      "jeho odpočinek je poklad, budit ho teď je škoda.",
    ],
    scheme: "obkročný (ABBA)",
    distractorScheme: "sdružený (AABB)",
    figureLine: 4,
    distractorLine: 1,
    figureType: "metafora",
  },
  {
    verse: [
      "Na zahradě rozkvetlo jarní kvítí,",
      "sluníčko nad ním vesele svítí,",
      "za kopcem se modrá klidné moře,",
      "je tiché jako spící kočka na dvoře.",
    ],
    scheme: "sdružený (AABB)",
    distractorScheme: "obkročný (ABBA)",
    figureLine: 4,
    distractorLine: 1,
    figureType: "přirovnání",
  },
  {
    verse: [
      "Kolem chaty šumí starý les,",
      "v dálce se tyčí zasněžené hory,",
      "dětský smích je v chatě celý ples,",
      "pod nimi leží tiché vesnické dvory.",
    ],
    scheme: "střídavý (ABAB)",
    distractorScheme: "sdružený (AABB)",
    figureLine: 3,
    distractorLine: 1,
    figureType: "metafora",
  },
  {
    verse: [
      "Do kraje znovu přišel vonný máj,",
      "voní sladce jako med to jarní kvítí,",
      "nad krajinou slunce vesele svítí,",
      "sedláci vědí, že přišel jarní ráj.",
    ],
    scheme: "obkročný (ABBA)",
    distractorScheme: "střídavý (ABAB)",
    figureLine: 2,
    distractorLine: 3,
    figureType: "přirovnání",
  },
];


function tvrzeni(scheme: string, lineNum: number, figureType: string): string {
  const rymCast = scheme === "bez rýmu" ? "Rým tu není" : `Rým je ${scheme}`;
  return `${rymCast} a ${PREP_VERS[lineNum - 1]} ${RADA[lineNum - 1]} verši je ${figureType}.`;
}

function vysvetleniRymObraz(r: RymObraz): string {
  const rymPopis = r.scheme === "bez rýmu" ? "Verše se navzájem nerýmují." : vysvetleniRym(r.scheme, r.verse.map(posledniSlovo));
  const figPopis =
    r.figureType === "metafora"
      ? `${PREP_VERS[r.figureLine - 1]} ${RADA[r.figureLine - 1]} verši je metafora (je/jsou bez slova jako nebo jak).`
      : `${PREP_VERS[r.figureLine - 1]} ${RADA[r.figureLine - 1]} verši je přirovnání (obsahuje slovo jako nebo jak).`;
  return `${rymPopis} A ${figPopis}`;
}

function ukolRymObraz(r: RymObraz): PracticeTask | null {
  const jinyTyp = r.figureType === "metafora" ? "přirovnání" : "metafora";
  const correct = tvrzeni(r.scheme, r.figureLine, r.figureType);
  const distractors: Distractor[] = [
    { value: tvrzeni(r.distractorScheme, r.figureLine, r.figureType), why: "Rým jsi určil špatně – zkontroluj znovu, které verše se na konci opravdu rýmují." },
    {
      value: tvrzeni(r.scheme, r.figureLine, jinyTyp),
      why: `Básnický prostředek jsi zaměnil – ${jinyTyp === "metafora" ? "metafora nemá slovo jako/jak" : "přirovnání musí mít slovo jako nebo jak"}, zkontroluj tu větu znovu.`,
    },
    { value: tvrzeni(r.scheme, r.distractorLine, r.figureType), why: "Prostředek jsi našel ve špatném verši – zkontroluj, ve kterém verši se opravdu nachází." },
  ];
  const question = `Přečti si báseň: „${r.verse.join(" / ")}“ Které tvrzení o ní platí?`;
  return choice(question, correct, distractors, {
    hints: [
      "Nejdřív ověř rým podle konců veršů, pak zvlášť najdi větu se slovem jako/jak nebo větu, kde se něco rovnou nazývá jinak (je/jsou bez jako/jak).",
      "Obě věci ověř odděleně: rýmové schéma podle konců veršů a básnický prostředek podle toho, jestli daný verš obsahuje slovo jako/jak. Teprve pak spoj obě zjištění do jednoho tvrzení.",
    ],
    explanation: vysvetleniRymObraz(r),
  });
}

// ════════════════════════════════════════════════════════════════════════
// Generátor
// ════════════════════════════════════════════════════════════════════════

/** Prokládá víc polí do jednoho tak, aby se šablony v generovaném poolu střídaly rovnoměrně. */
function prokladej<T>(...seznamy: T[][]): T[] {
  const out: T[] = [];
  const max = Math.max(...seznamy.map((s) => s.length));
  for (let i = 0; i < max; i++) for (const s of seznamy) if (i < s.length) out.push(s[i]);
  return out;
}

function gen(level: number): PracticeTask[] {
  const poolL1 = L1_BANK.map((it) => () => ukolL1(it));
  const poolL2 = prokladej(
    L2A_BANK.map((cv) => () => ukolRym(cv)),
    L2B_BANK.map((o) => () => ukolObraz(o)),
  );
  const poolL3 = prokladej(
    L3_VYZNAM.map((v) => () => ukolVyznam(v)),
    L3_PREVOD.map((p) => () => ukolPrevod(p)),
    L3_JAKO.map((j) => () => ukolJako(j)),
    L3_RYMOBRAZ.map((r) => () => ukolRymObraz(r)),
  );
  const pool = level <= 1 ? poolL1 : level === 2 ? poolL2 : poolL3;
  let i = 0;
  const dalsi = () => pool[i++ % pool.length]();
  return ruzneUlohy(() => losUlohy(dalsi), pool.length, pool.length * 3);
}

// ════════════════════════════════════════════════════════════════════════
// Topic
// ════════════════════════════════════════════════════════════════════════

export const VERS_RYM_PRIROVNANI_METAFORA_UVOD: TopicMetadata[] = [
  {
    id: "g6-cjl-vers-rym-prirovnani-metafora-uvod-6",
    rvpNodeId: "g6-cjl-literarni-vychova-zaklady-literarni-teorie-vers-rym-prirovnani-metafora-uvod",
    displayName: "Verš, rým, přirovnání, metafora (úvod)",
    title: "Verš, rým, přirovnání, metafora (úvod)",
    studentTitle: "Verš, rým, přirovnání a metafora",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Základy literární teorie",
    briefDescription: "Poznáš druh rýmu a odlišíš přirovnání od metafory v básni.",
    keywords: [
      "verš", "sloka", "rým", "sdružený rým", "střídavý rým", "obkročný rým",
      "přirovnání", "metafora", "básnický prostředek", "zosobnění",
    ],
    goals: [
      "Rozlišit verš, sloku a rým a poznat druh rýmu (sdružený, střídavý, obkročný).",
      "Rozlišit přirovnání od metafory podle přítomnosti slova jako nebo jak.",
      "Vysvětlit, co metafora v konkrétní větě znamená, a převést ji na přirovnání se stejným obrazem.",
    ],
    boundaries: [
      "Zosobnění a nadsázka (grade 5) se tu objevují jen jako rozlišovací distraktory, ne jako procvičovaná látka.",
      "Bez pokročilých pojmů (metonymie, aliterace, básnický přívlastek) a bez sporných hraničních případů (např. „než“ jako přirovnávací spojka).",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Verš = jeden řádek básně, sloka = skupina veršů. Rým: sdružený spojuje sousední verše (AABB), střídavý se střídá po jednom (ABAB), obkročný obepíná krajními verši ty prostřední (ABBA). Přirovnání má slovo jako nebo jak, metafora ho nemá.",
      steps: [
        "U rýmu označ konce veršů písmeny podle zvuku a porovnej, které dvojice se shodují.",
        "U věty hledej slovo jako nebo jak – když ho najdeš, jde o přirovnání.",
        "Když porovnávací slovo chybí a jedna věc se rovnou nazývá druhou, jde o metaforu.",
        "U metafory se ptej, čím je použitý obraz typický – to je její skutečný význam.",
      ],
      commonMistake: "Žáci porovnávají u rýmu jen sousední verše, i když se ve skutečnosti rýmují po jednom nebo obkročně. U přirovnání a metafory přehlížejí slovo jako/jak, nebo čtou metaforu doslova.",
      example: "Verše les – ples – kočka – očka (schéma AABB) mají sdružený rým. „Chlapec byl na hřišti blesk“ je metafora (bez jako) a znamená, že chlapec běhá rychle; „Chlapec běhal rychle jako blesk“ je přirovnání se stejným obrazem.",
    },
  },
];
