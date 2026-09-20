/**
 * Zeměpis 6. ročník — Atmosféra: počasí, podnebí, podnebné pásy (select_one).
 *
 * Téma stojí na jednom rozlišení (okamžitý stav ovzduší × dlouhodobý průměr)
 * a na třech výpočtech, které se dají udělat ze slov, bez mapy a bez obrázku:
 *  • podnebný pás ze zeměpisné šířky (jen nesporné hodnoty — hraniční pásma
 *    23,5–40° a 60–66,5° se nelosují, protože se v nich učebnice liší),
 *  • roční teplotní amplituda jako rozdíl nejteplejšího a nejchladnějšího
 *    měsíce (se zápornou zimní hodnotou),
 *  • teplota podle nadmořské výšky podle pravidla, které je vždy napsané
 *    PŘÍMO V ZADÁNÍ („klesá průměrně o 0,6 °C na každých 100 m“) — nápověda
 *    na něj proto jen odkazuje a sama ho neopakuje.
 *
 * Gradace:
 *  • L1 — jeden pojem nebo jednotka: počasí × podnebí, složení vzduchu,
 *    troposféra, přístroje a jednotky, obratník a polární kruh. Žádný výpočet.
 *  • L2 — pravidlo na konkrétní čísla: šířka → pás a polokoule, amplituda
 *    ze dvou i ze čtyř měsíčních průměrů, teplota na vrcholu a v údolí,
 *    odečet nejdeštivějšího měsíce z klimatické tabulky (dva sloupce, dvě
 *    jednotky — past je porovnat teploty místo srážek).
 *  • L3 — přenos a inverze: z popisu ročního chodu poznat typ podnebí a pás,
 *    z amplitud dvou míst na téže rovnoběžce usoudit na vnitrozemí × přímoří,
 *    z teplot dopočítat nadmořskou výšku vrcholu, z amplitudy chybějící měsíc.
 *
 * Chybový model: záměna počasí a podnebí; pás podle zeměpisné délky místo
 * šířky; tropy posunuté až do mírných šířek; u výšky přičtení místo odečtení
 * a posunutý řád (0,6 °C místo 7,2 °C); amplituda jako součet nebo průměr
 * obou hodnot a odečtení bez ohledu na záporné znaménko.
 *
 * Fakta jsou omezená na shodu učebnic 6. ročníku (Fraus, Nová škola, SPN):
 * v suchém vzduchu dusík asi 78 % a kyslík asi 21 %, počasí v troposféře,
 * srážky v mm, tlak v hPa, obratníky 23,5°, polární kruhy 66,5°. Vodní pára
 * se drží mimo procentní rozpis, protože její podíl kolísá zhruba 0–4 % a
 * běžně je jí víc než argonu — učebnice ji proto uvádějí zvlášť jako
 * proměnlivou složku. Počet a hranice mezipásem (subtropický, subpolární)
 * se v klíči neobjevují, ale nápověda i helpTemplate je zmiňují, aby
 * třípásmový model nevypadal jako jediný správný.
 *
 * Rotace šablon se nastavuje uvnitř gen(), modul nedrží žádný stav.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pad } from "@/lib/czechGrammar";
import {
  pick,
  pickN,
  rnd,
  cis,
  sirka,
  delka,
  losUlohy,
  ruzneUlohy,
  buildChoiceTask as choice,
  type Distractor,
} from "./_shared";

type Tvurce = () => PracticeTask | null;

/** Úloha nesmí mít klíč ve znění otázky — jinak ji vylosujeme znovu. */
function hlidej(t: PracticeTask | null): PracticeTask | null {
  if (!t) return null;
  if (t.question.includes(t.correctAnswer)) return null;
  return t;
}

/** Zaokrouhlení na jedno desetinné místo (12 · 0,6 = 7,199999… → 7,2). */
const r1 = (x: number): number => Math.round(x * 10) / 10;

/** Teplota česky: `−4 °C`, `13,8 °C`. */
const st = (x: number): string => `${cis(r1(x))} °C`;

/** Nadmořská výška: `1 400 m`. */
const vy = (x: number): string => `${cis(x)} m`;

/** Pravidlo poklesu teploty s výškou — v každé výškové úloze přímo v zadání. */
const PRAVIDLO = "Teplota vzduchu klesá průměrně o 0,6 °C na každých 100 m nadmořské výšky.";

interface Fakt {
  q: string;
  key: string;
  d: [string, string][];
  hints: [string, string];
  explanation: string;
}

const fakt = (f: Fakt): PracticeTask | null =>
  hlidej(
    choice(
      f.q,
      f.key,
      f.d.map(([value, why]): Distractor => ({ value, why })),
      { hints: f.hints, explanation: f.explanation },
    ),
  );

// ── L1: banka pojmů, jednotek a hranic ────────────────────────────────────

// `velicina` je 4. pád („ptá se na teplotu vzduchu“), `nom` 1. pád. Zvratné
// pasivum „čím se měří …“ vyžaduje podmět v nominativu, jinak vznikne
// „Čím se měří teplotu vzduchu?“. U tří položek jsou oba tvary shodné, takže
// se chyba projeví jen u teploty — proto musí být tvary vedené zvlášť.
const PRISTROJE = [
  { velicina: "teplotu vzduchu", nom: "teplota vzduchu", nastroj: "teploměrem", why: "Teploměr měří teplotu vzduchu a výsledek se udává ve stupních Celsia." },
  { velicina: "množství spadlých srážek", nom: "množství spadlých srážek", nastroj: "srážkoměrem", why: "Srážkoměr měří, kolik spadlo srážek, a výsledek se udává v milimetrech." },
  { velicina: "tlak vzduchu", nom: "tlak vzduchu", nastroj: "tlakoměrem", why: "Tlakoměr měří tlak vzduchu a výsledek se udává v hektopascalech." },
  { velicina: "rychlost větru", nom: "rychlost větru", nastroj: "anemometrem", why: "Anemometr měří rychlost větru a výsledek se udává v metrech za sekundu." },
];

const JEDNOTKY = [
  { velicina: "množství spadlých srážek", jednotka: "v milimetrech (mm)", why: "V milimetrech se udává množství srážek: jeden milimetr znamená, že by voda na rovné ploše stála milimetr vysoko." },
  { velicina: "tlak vzduchu", jednotka: "v hektopascalech (hPa)", why: "V hektopascalech se udává tlak vzduchu; na tlakoměru bývá hodnota kolem tisícovky." },
  { velicina: "teplotu vzduchu", jednotka: "ve stupních Celsia (°C)", why: "Ve stupních Celsia se udává teplota vzduchu, ne jiná veličina." },
  { velicina: "rychlost větru", jednotka: "v metrech za sekundu (m/s)", why: "V metrech za sekundu se udává rychlost větru." },
];

/** Přístroje: tři české názvy odvozené od veličiny, anemometr jen jako distraktor. */
const BANKA_PRISTROJE: Fakt[] = PRISTROJE.slice(0, 3).map((p): Fakt => ({
  q: `Čím se měří ${p.nom}?`,
  key: p.nastroj,
  d: PRISTROJE.filter((x) => x !== p).map((x): [string, string] => [
    x.nastroj,
    `${x.why} Otázka se ale ptá na ${p.velicina}.`,
  ]),
  hints: [
    `Meteorologické přístroje se jmenují podle toho, co měří. Otázka se ptá na ${p.velicina} — zkus z toho název přístroje odvodit.`,
    `Meteorologové mají na každou veličinu vlastní přístroj: jiný na teplotu vzduchu, jiný na množství srážek, jiný na tlak vzduchu a jiný na rychlost větru. Tři z nich mají český název složený z názvu veličiny a slova „‑měr“, čtvrtý (anemometr) má název cizí. Rozhodni podle toho, který z nich patří k veličině ze zadání, tedy k tomu, čím se měří ${p.nom}.`,
  ],
  explanation: `${p.why} Každá meteorologická veličina má vlastní přístroj, takže podle názvu veličiny poznáš i název přístroje.`,
}));

/** Jednotky: klíč i distraktory mají stejný tvar „v … (zkratka)“. */
const BANKA_JEDNOTKY: Fakt[] = JEDNOTKY.slice(0, 2).map((j): Fakt => ({
  q: `V jakých jednotkách se udává ${j.velicina}?`,
  key: j.jednotka,
  d: JEDNOTKY.filter((x) => x !== j).map((x): [string, string] => [
    x.jednotka,
    `${x.why} Otázka se ale ptá na ${j.velicina}.`,
  ]),
  hints: [
    `Každá meteorologická veličina má svou jednotku. Rozmysli si, čím se ${j.velicina} vůbec měří, a odtud odvodíš i jednotku.`,
    `Projdi si nabídnuté jednotky jednu po druhé a ke každé přiřaď veličinu, ke které patří: jedna z nich patří k teplotě vzduchu, jiná k rychlosti větru, jiná k tlaku vzduchu a jiná k množství srážek. Zbude ti právě jedna, která odpovídá veličině ze zadání, tedy tomu, jak se udává ${j.velicina}.`,
  ],
  explanation: `${j.why} Ostatní nabídnuté jednotky patří k jiným meteorologickým veličinám.`,
}));

const BANKA_L1: Fakt[] = [
  {
    q: "Který plyn je v atmosféře nejhojnější?",
    key: "dusík",
    d: [
      ["kyslík", "Kyslík je ve vzduchu až druhý nejhojnější a tvoří asi pětinu vzduchu. Nejhojnější plyn tvoří skoro čtyři pětiny."],
      ["oxid uhličitý", "Oxidu uhličitého je ve vzduchu jen několik setin procenta, i když je důležitý pro rostliny a pro skleníkový efekt."],
      ["vodní pára", "Množství vodní páry ve vzduchu kolísá podle počasí a nikdy se nepřiblíží pětině, natož čtyřem pětinám. Nejhojnější plyn je ve vzduchu stále přibližně stejně."],
    ],
    hints: [
      "Vzduch se často popisuje jako čtyři pětiny jednoho plynu a jedna pětina druhého. Ptáme se na ten, kterého jsou ty čtyři pětiny.",
      "Plyn, kterého je ve vzduchu nejvíc, je bez barvy a bez zápachu. Dýcháme ho sice pořád, ale tělo si z něj nic nebere — není to tedy ten plyn, který při dýchání spotřebováváme, ani ten, který vydechujeme. Zbylé dvě možnosti jsou ve vzduchu jen v malém a navíc proměnlivém množství, takže je můžeš rovnou vyřadit.",
    ],
    explanation: "Suchý vzduch tvoří asi 78 % dusíku a asi 21 % kyslíku; na ostatní plyny, hlavně na argon a na oxid uhličitý, připadá necelé jedno procento. Vodní pára se uvádí zvlášť, protože její množství kolísá podle počasí (zhruba 0 až 4 %).",
  },
  {
    q: "Který plyn je v atmosféře druhý nejhojnější?",
    key: "kyslík",
    d: [
      ["dusík", "Dusíku je ve vzduchu ze všech plynů nejvíc, skoro čtyři pětiny. Otázka se ale ptá na plyn, který je v pořadí až druhý."],
      ["oxid uhličitý", "Oxidu uhličitého je ve vzduchu jen několik setin procenta, zdaleka ne druhé největší množství."],
      ["vodní pára", "Množství vodní páry ve vzduchu kolísá podle počasí a nikdy se nepřiblíží pětině vzduchu. Druhý nejhojnější plyn tvoří asi pětinu vzduchu stále."],
    ],
    hints: [
      "Seřaď si plyny podle toho, kolik jich ve vzduchu je: jeden tvoří skoro čtyři pětiny, druhý zhruba pětinu a na zbytek připadá jen malá část. Ptáme se na ten druhý v pořadí.",
      "Plyn, který je ve vzduchu druhý nejhojnější, tvoří asi pětinu vzduchu a živočichové ho spotřebovávají při dýchání, zatímco zelené rostliny ho uvolňují. Vodní pára ani oxid uhličitý to nejsou — ty jsou ve vzduchu jen v malém a navíc proměnlivém množství, takže je můžeš rovnou vyřadit, a zbude ti rozhodnout jen mezi dvěma nejhojnějšími plyny.",
    ],
    explanation: "Suchý vzduch tvoří asi 78 % dusíku a asi 21 % kyslíku, takže kyslík je druhý nejhojnější. Oxidu uhličitého je jen několik setin procenta a vodní pára je proměnlivá — ani jeden se pětině vzduchu nepřiblíží.",
  },
  {
    q: "Ve které vrstvě atmosféry se odehrává počasí?",
    key: "v troposféře",
    d: [
      ["ve stratosféře", "Stratosféra leží nad vrstvou, kde vzniká počasí. Je v ní ozonová vrstva, ale mraky ani déšť už se v ní netvoří."],
      ["v mezosféře", "Mezosféra leží ještě výš než stratosféra. Vzduch je tam velmi řídký a počasí se v ní netvoří."],
      ["v termosféře", "Termosféra patří k nejvyšším vrstvám atmosféry. Vzduchu je tam tak málo, že tam žádné mraky vzniknout nemohou."],
    ],
    hints: [
      "Počasí znamená mraky, déšť, sníh a vítr. Ty vznikají tam, kde je vzduchu i vodní páry nejvíc — hned u zemského povrchu.",
      "Vrstvy atmosféry se počítají od zemského povrchu nahoru a v té úplně nejnižší je soustředěna většina vzduchu i skoro všechna vodní pára. Právě proto v ní vznikají mraky, srážky i vítr. Ze čtyř nabídnutých vrstev tedy vyber tu, která leží ze všech nejníž, přímo nad krajinou.",
    ],
    explanation: "Počasí se odehrává v troposféře, nejnižší vrstvě atmosféry. Je v ní soustředěna většina vzduchu i vodní páry, a proto v ní vznikají mraky, srážky i vítr. Výš ležící stratosféra je už klidná.",
  },
  {
    q: "Která rovnoběžka tvoří hranici tropického podnebného pásu?",
    key: "obratník na 23,5°",
    d: [
      ["polární kruh na 66,5°", "Polární kruh je hranicí polárního pásu, ne tropického. Leží mnohem blíž k pólu."],
      ["rovník na 0°", "Rovník leží uprostřed tropického pásu, je to tedy jeho střed, ne hranice."],
      ["zeměpisný pól na 90°", "Na pólu je zeměpisná šířka největší možná. Tropický pás končí mnohem blíž k rovníku."],
    ],
    hints: [
      "Tropický pás leží kolem rovníku a končí tam, kam až může Slunce v poledne svítit kolmo shora.",
      "Hledaná rovnoběžka existuje na severní i na jižní polokouli ve stejné vzdálenosti od rovníku. Slunce nad ní stojí v poledne kolmo jen jednou za rok, o slunovratu, a dál od rovníku už kolmo nesvítí nikdy. Zbylé možnosti si projdi a vyluč je: rovník leží uprostřed pásu, je to tedy jeho střed, ne hranice; pól je jediný bod, ne rovnoběžka; a rovnoběžka, za kterou začíná polární den, ohraničuje úplně jiný pás, ten nejvzdálenější od rovníku.",
    ],
    explanation: "Hranicí tropického pásu je obratník na 23,5° s. š. (obratník Raka) a na 23,5° j. š. (obratník Kozoroha). Dál od rovníku už Slunce v poledne kolmo nesvítí. Jméno má podle souhvězdí, ve kterých kdysi Slunce o slunovratu stálo, a slovo obratník připomíná, že se odtud dráha Slunce zase „obrací“ zpátky k rovníku.",
  },
  {
    q: "Která rovnoběžka tvoří hranici polárního podnebného pásu?",
    key: "polární kruh na 66,5°",
    d: [
      ["obratník na 23,5°", "Obratník je hranicí tropického pásu, ne polárního. Leží mnohem blíž k rovníku."],
      ["rovník na 0°", "Rovník je od pólů nejdál, jak to jde. Polární pás s ním nesousedí."],
      ["zeměpisný pól na 90°", "Pól je bod uvnitř polárního pásu, ne jeho hranice."],
    ],
    hints: [
      "Polární pás leží kolem pólu a jeho hranicí je rovnoběžka, za kterou se už objevuje polární den a polární noc.",
      "Hledaná rovnoběžka existuje na severní i na jižní polokouli a leží blízko pólů. Její vzdálenost od pólu je stejná jako sklon zemské osy, takže ji spočítáš tak, že od zeměpisné šířky pólu tento sklon odečteš. Za ní Slunce aspoň jeden den v létě vůbec nezapadne a aspoň jeden den v zimě vůbec nevyjde; čím blíž k pólu, tím déle to trvá.",
    ],
    explanation: "Hranicí polárního pásu je polární kruh na 66,5° s. š. a j. š. Spočítáš ho jako 90° − 23,5°. Za ním nastává polární den a polární noc.",
  },
  {
    q: "Jak dlouhé období se sleduje, aby se dalo určit podnebí místa?",
    key: "nejméně třicet let",
    d: [
      ["právě jeden rok", "Jediný rok může být neobvykle teplý nebo suchý. Podnebí se počítá z mnohem delšího období, aby se výkyvy vyrovnaly."],
      ["jediný den měření", "Jeden den popisuje počasí, tedy okamžitý stav ovzduší. Podnebí je dlouhodobý průměr za mnoho let."],
      ["necelý jeden týden", "Týden měření popisuje také jen počasí. Podnebí se určuje z průměrů za desítky let."],
    ],
    hints: [
      "Podnebí je dlouhodobý průměr. Rozmysli si, jestli by k jeho určení stačil jeden jediný rok, který může být náhodou neobvykle teplý.",
      "Aby se náhodné výkyvy jednotlivých let navzájem vyrovnaly, počítá se podnebí z průměrů za velmi dlouhou řadu let, mnohem delší než jeden rok. Meteorologové k tomu používají ustálené období dlouhé několik desítek let, a teprve z něj se dělají průměry měsíčních teplot a srážek.",
    ],
    explanation: "Podnebí se určuje z dlouhodobých průměrů, obvykle nejméně za třicet let. Kratší období popisuje jen počasí nebo jeden náhodný rok, který může být výjimečný.",
  },
  ...BANKA_PRISTROJE,
  ...BANKA_JEDNOTKY,
];

// ── L1: počasí × podnebí ───────────────────────────────────────────────────

const POCASI_UDAJE = [
  "V Brně bylo dnes odpoledne 24 °C a krátce pršelo.",
  "V Plzni dnes ráno foukal silný vítr a byla hustá mlha.",
  "V Ostravě napadlo včera v noci 5 cm nového sněhu.",
  "V Praze je právě jasno a teploměr ukazuje 18 °C.",
];

const PODNEBI_UDAJE = [
  "V Praze je dlouhodobý lednový průměr teploty −1 °C.",
  "V Káhiře spadne za rok průměrně 25 mm srážek.",
  "V Brně je průměrná roční teplota za třicet let 9 °C.",
  "V Ostravě prší dlouhodobě nejvíc v červenci.",
];

/** Rozliší okamžitý stav ovzduší od dlouholetého průměru (obě strany otázky). */
function pocasiPodnebiL1(): PracticeTask | null {
  const jePodnebi = Math.random() < 0.5;
  const key = pick(jePodnebi ? PODNEBI_UDAJE : POCASI_UDAJE);
  const zbytek = pickN(jePodnebi ? POCASI_UDAJE : PODNEBI_UDAJE, 3);
  const d: Distractor[] = zbytek.map((value): Distractor => ({
    value,
    why: jePodnebi
      ? "Tenhle údaj popisuje jeden konkrétní den na jednom místě, tedy počasí. Podnebí je dlouhodobý průměr za mnoho let."
      : "Tenhle údaj je dlouhodobý průměr za mnoho let, tedy podnebí. Počasí je okamžitý stav ovzduší na jednom místě a v jednu chvíli.",
  }));
  return hlidej(
    choice(
      `Který z údajů popisuje ${jePodnebi ? "podnebí, a ne počasí" : "počasí, a ne podnebí"}?`,
      key,
      d,
      {
        hints: [
          "Projdi možnosti a u každé rozhodni, jestli mluví o jednom konkrétním okamžiku, nebo o průměru za dlouhou řadu let.",
          "Počasí je okamžitý stav ovzduší na jednom místě — poznáš ho podle slov jako dnes, včera nebo právě teď. Podnebí je naopak dlouhodobý průměr počasí za mnoho let a poznáš ho podle slov jako průměrný, dlouhodobý nebo za rok. Zařaď takhle všechny čtyři možnosti do jedné z těch dvou skupin a vyber tu, která zbude sama.",
        ],
        explanation: `Počasí je okamžitý stav ovzduší na jednom místě a v jednu chvíli, podnebí je dlouhodobý průměr počasí za mnoho let. Údaj „${key}“ mluví o ${jePodnebi ? "průměru za dlouhou řadu let, jde tedy o podnebí" : "jednom konkrétním dni, jde tedy o počasí"}. Ostatní tři možnosti patří do druhé skupiny.`,
      },
    ),
  );
}

function faktL1(): PracticeTask | null {
  return fakt(pick(BANKA_L1));
}

// ── L2: podnebný pás ze zeměpisné šířky ────────────────────────────────────

const PASY = {
  trop: { adj: "tropickém", nom: "tropický" },
  mirny: { adj: "mírném", nom: "mírný" },
  polar: { adj: "polárním", nom: "polární" },
} as const;
type Pas = keyof typeof PASY;

const HRANICE: Record<Pas, string> = {
  trop: "Tropický pás sahá jen k obratníku na 23,5° na obě strany od rovníku.",
  mirny: "Mírný pás leží mezi obratníkem na 23,5° a polárním kruhem na 66,5°; jeho typické podnebí je nejvýraznější zhruba mezi 40° a 60°.",
  polar: "Polární pás začíná až za polárním kruhem na 66,5°.",
};

/** Jen nesporné hodnoty — hraniční pásma 23,5–40° a 60–66,5° se nelosují. */
function losSirka(p: Pas): number {
  return p === "trop" ? rnd(2, 22) : p === "mirny" ? rnd(42, 58) : rnd(68, 84);
}

function pasL2(): PracticeTask | null {
  const pasy: Pas[] = ["trop", "mirny", "polar"];
  const band = pick(pasy);
  const sever = Math.random() < 0.5;
  const lat = losSirka(band);
  // Délka se losuje z JINÉHO pásma než šířka, aby bylo poznat, že se žák spletl
  // souřadnicí — pás odpovídající hodnotě délky je pak jedním z distraktorů.
  const lonBand = pick(pasy.filter((p) => p !== band));
  const lon = losSirka(lonBand) * (Math.random() < 0.5 ? 1 : -1);
  const pol = sever ? "severní" : "jižní";
  const key = `v ${PASY[band].adj} pásu na ${pol} polokouli`;
  const d: Distractor[] = [
    {
      value: `v ${PASY[band].adj} pásu na ${sever ? "jižní" : "severní"} polokouli`,
      why: `Podnebný pás je určený správně, polokoule ne. V zadání je zeměpisná šířka ${sirka(sever ? lat : -lat)}, a zkratka s. š. znamená severní zeměpisnou šířku, j. š. jižní.`,
    },
    ...pasy
      .filter((p) => p !== band)
      .map((p): Distractor => ({
        value: `v ${PASY[p].adj} pásu na ${pol} polokouli`,
        why:
          p === lonBand
            ? `Tahle možnost vyjde, když se pás určí podle zeměpisné délky, tedy podle údaje ${delka(lon)}, místo podle šířky. Podnebné pásy jdou podél rovnoběžek, takže rozhoduje zeměpisná šířka. ${HRANICE[p]} Šířka ${cis(lat)}° do něj nepatří.`
            : `${HRANICE[p]} Zeměpisná šířka ${cis(lat)}° do něj nepatří, leží v ${PASY[band].adj} pásu.`,
      })),
  ];
  return hlidej(
    choice(
      `Ve kterém podnebném pásu a na které polokouli leží místo se souřadnicemi ${sirka(sever ? lat : -lat)} a ${delka(lon)}?`,
      key,
      d,
      {
        hints: [
          "Ze dvou souřadnic v zadání rozhoduje o podnebném pásu jen jedna — ta, která říká, jak daleko je místo od rovníku.",
          "Podnebné pásy jdou podél rovnoběžek, a proto je určuje zeměpisná šířka (s. š. nebo j. š.), ne zeměpisná délka (v. d. nebo z. d.). Základní pásy jsou tři: tropický od rovníku k obratníku na 23,5°, mírný zhruba mezi 40° a 60° a polární za polárním kruhem na 66,5°. Mezi nimi učebnice ještě rozlišují přechodný pás subtropický a subpolární, ale v zadání je vždy šířka, která do jednoho ze tří základních pásů patří nesporně. Zkratka u zeměpisné šířky ti navíc rovnou prozradí i polokouli.",
        ],
        solutionSteps: [
          `O pásu rozhoduje zeměpisná šířka, tedy ${sirka(sever ? lat : -lat)}; zeměpisná délka ${delka(lon)} na pás vliv nemá.`,
          `${HRANICE[band]} Šířka ${cis(lat)}° do tohoto rozmezí patří.`,
          `Zkratka ${sever ? "s. š." : "j. š."} znamená ${pol} polokouli.`,
        ],
        explanation: `Podnebný pás se určuje podle zeměpisné šířky, protože pásy jdou podél rovnoběžek. ${HRANICE[band]} Šířka ${cis(lat)}° do něj patří, a zkratka ${sever ? "s. š." : "j. š."} říká, že místo leží na ${pol} polokouli.`,
      },
    ),
  );
}

// ── L2: roční teplotní amplituda ───────────────────────────────────────────

const DEF_AMPLITUDA = "Jaká je roční teplotní amplituda, tedy rozdíl mezi nejteplejším a nejchladnějším měsícem?";

/** Dva měsíční průměry, zimní záporný. */
function amplituda2L2(): PracticeTask | null {
  const max = rnd(14, 26);
  const min = rnd(-22, -2);
  if ((max + min) % 2 !== 0) return null;
  const amp = max - min;
  return hlidej(
    choice(
      `Ve sledovaném místě je průměrná teplota v lednu ${st(min)} a v červenci ${st(max)}. ${DEF_AMPLITUDA}`,
      st(amp),
      [
        {
          value: st(max + min),
          why: `Tahle hodnota vyjde, když se u lednové teploty přehlédne znaménko. Na teploměru je od ${st(min)} k ${st(max)} nejdřív ${cis(-min)} dílků k nule a teprve potom dalších ${cis(max)} nad nulu, takže rozdíl je větší, než kdyby se čísla jen odečetla.`,
        },
        {
          value: st((max + min) / 2),
          why: "To je průměr obou teplot. Amplituda ale není průměr, je to rozdíl mezi nejvyšší a nejnižší hodnotou.",
        },
        {
          value: st(max),
          why: "To je jen průměrná teplota nejteplejšího měsíce. Amplituda je rozdíl mezi ní a teplotou nejchladnějšího měsíce.",
        },
      ],
      {
        hints: [
          "Najdi v zadání teplotu nejteplejšího a nejchladnějšího měsíce a představ si, kolik dílků je mezi nimi na teploměru — nejdřív k nule a potom nad ni.",
          "Amplituda se počítá jako teplota nejteplejšího měsíce minus teplota nejchladnějšího. Když je ta druhá záporná, odečítáš záporné číslo, a to je totéž jako přičítat — rozdíl proto vyjde větší než samotná červencová teplota. Na konci si zkontroluj, že ti vyšlo kladné číslo: amplituda záporná být nemůže.",
        ],
        solutionSteps: [
          `Nejteplejší měsíc je červenec (${st(max)}), nejchladnější leden (${st(min)}).`,
          `Amplituda = ${cis(max)} − (${cis(min)}) = ${cis(max)} + ${cis(-min)}.`,
          `Výsledek: ${st(amp)}.`,
        ],
        explanation: `Roční teplotní amplituda je rozdíl mezi průměrem nejteplejšího a nejchladnějšího měsíce. Odečítá se tu záporné číslo, což je totéž jako přičítání: ${cis(max)} − (${cis(min)}) = ${cis(max)} + ${cis(-min)} = ${st(amp)}.`,
      },
    ),
  );
}

/** Čtyři měsíční průměry — žák musí nejdřív najít maximum a minimum. */
function amplituda4L2(): PracticeTask | null {
  const leden = rnd(-18, -2);
  const cervenec = rnd(14, 26);
  const amp = cervenec - leden;
  // Duben a říjen se neodvozují losem, ale ze středu mezi krajními měsíci —
  // jinak by roční chod (mrazivá zima × vlažné jaro) nepatřil žádnému
  // skutečnému místu a pracoval by proti sousednímu učivu o přímoří ×
  // vnitrozemí. Jejich pořadí je proto vázané na amplitudu: teplejší podzim
  // než jaro je znak zpoždění za mořem, tedy malé amplitudy. U velké
  // amplitudy jde o vnitrozemí, kde se pevnina zpožďuje jen málo a duben
  // bývá naopak o kousek teplejší než říjen (Moskva 6,8 × 5,6 °C, Irkutsk
  // 3,2 × 2,3 °C, Ulánbátar 1,2 × 0,3 °C).
  const vnitrozemsky = amp > 28;
  const stred = Math.round((leden + cervenec) / 2);
  // Ve vnitrozemí je rozdíl jara a podzimu malý; menší než 2 °C být nemůže,
  // jinak by distraktor „rozdíl dvou prostředních měsíců“ vyšel nula.
  const rozdil = rnd(2, 3);
  const duben = vnitrozemsky ? stred + rozdil - 1 : stred - rnd(1, 3);
  const rijen = vnitrozemsky ? stred - 1 : stred + rnd(1, 3);
  // Shodný duben a říjen by udělaly z distraktoru „rozdíl dvou prostředních
  // měsíců“ nesmyslnou nulovou amplitudu.
  if (Math.abs(rijen - duben) < 2) return null;
  return hlidej(
    choice(
      `Průměrné měsíční teploty jednoho místa jsou: leden ${st(leden)}, duben ${st(duben)}, červenec ${st(cervenec)}, říjen ${st(rijen)}. ${DEF_AMPLITUDA}`,
      st(amp),
      [
        {
          value: st(cervenec + leden),
          why: `Tahle hodnota vyjde, když se u lednové teploty přehlédne znaménko. Leden má ${st(leden)}, takže se od července k lednu jde nejdřív ${cis(cervenec)} dílků k nule a pak ještě ${cis(-leden)} pod nulu.`,
        },
        {
          value: st(Math.abs(rijen - duben)),
          why: "Tahle hodnota je rozdíl dubna a října, tedy dvou prostředních měsíců. Amplituda se počítá z nejteplejšího a nejchladnějšího měsíce, ne z libovolné dvojice.",
        },
        {
          value: st(cervenec - duben),
          why: "Tahle hodnota je rozdíl července a dubna. Nejchladnější z uvedených měsíců je ale leden, takže se odečítá jeho teplota.",
        },
      ],
      {
        hints: [
          "Ze čtyř uvedených měsíců si nejdřív vyber ten nejteplejší a ten nejchladnější; s ostatními dvěma už počítat nebudeš.",
          "Amplituda je rozdíl mezi teplotou nejteplejšího a nejchladnějšího měsíce, takže prostřední hodnoty do výpočtu vůbec nevstupují. Pozor na záporné číslo: nejchladnější měsíc je pod nulou, a odečítat záporné číslo znamená přičítat. Nakonec zkontroluj, že ti vyšlo kladné číslo — amplituda záporná být nemůže.",
        ],
        solutionSteps: [
          `Nejteplejší měsíc je červenec (${st(cervenec)}), nejchladnější leden (${st(leden)}).`,
          `Amplituda = ${cis(cervenec)} − (${cis(leden)}) = ${cis(cervenec)} + ${cis(-leden)}.`,
          `Výsledek: ${st(amp)}.`,
        ],
        explanation: `Do výpočtu amplitudy vstupuje jen nejteplejší a nejchladnější měsíc, tedy červenec (${st(cervenec)}) a leden (${st(leden)}); duben a říjen se nepoužijí. Odečtení záporného čísla je totéž jako přičítání: ${cis(cervenec)} + ${cis(-leden)} = ${st(amp)}.`,
      },
    ),
  );
}

// ── L2: teplota podle nadmořské výšky ──────────────────────────────────────

function vyskaL2(): PracticeTask | null {
  const dolni = rnd(1, 8) * 100;
  const stovek = rnd(3, 16);
  const horni = dolni + stovek * 100;
  const pokles = r1(stovek * 0.6);
  const nahoru = Math.random() < 0.5;
  const tVychozi = nahoru ? rnd(10, 26) : rnd(-6, 10);
  const klic = r1(nahoru ? tVychozi - pokles : tVychozi + pokles);
  const smer = nahoru ? -1 : 1;
  // Chyba „počítal z celé nadmořské výšky výchozího místa místo z rozdílu“.
  const celaVyska = r1(tVychozi + smer * r1(((nahoru ? horni : dolni) / 100) * 0.6));
  return hlidej(
    choice(
      nahoru
        ? `Na úpatí hory v nadmořské výšce ${vy(dolni)} je průměrná teplota ${st(tVychozi)}. ${PRAVIDLO} Jaká je průměrná teplota na vrcholu ve výšce ${vy(horni)}?`
        : `Na vrcholu hory v nadmořské výšce ${vy(horni)} je průměrná teplota ${st(tVychozi)}. ${PRAVIDLO} Jaká je průměrná teplota v údolí ve výšce ${vy(dolni)}?`,
      st(klic),
      [
        {
          value: st(r1(tVychozi - smer * pokles)),
          why: nahoru
            ? "Tahle hodnota vyjde, když se pokles přičte místo odečte. Čím výš, tím je chladněji, takže na vrcholu musí být méně stupňů než na úpatí."
            : "Tahle hodnota vyjde, když se pokles odečte místo přičte. Směrem dolů teplota naopak stoupá, takže v údolí musí být více stupňů než na vrcholu.",
        },
        {
          value: st(r1(tVychozi + smer * 0.6)),
          why: `Tahle hodnota vyjde, když se pravidlo použije jen jednou, jako by šlo o jediných 100 m. Rozdíl výšek je ale ${vy(stovek * 100)}, tedy ${pad(stovek, "STOVKA")} metrů, a pravidlo se použije tolikrát.`,
        },
        {
          value: st(celaVyska),
          why: `Tahle hodnota vyjde, když se počítá z celé nadmořské výšky ${vy(nahoru ? horni : dolni)}. Teplota se ale mění jen o rozdíl obou výšek, tedy o ${vy(stovek * 100)}.`,
        },
      ],
      {
        hints: [
          "Nejdřív zjisti, o kolik metrů se obě místa liší, a převeď ten rozdíl na stovky metrů.",
          "Pravidlo, o kolik teplota klesne na každých 100 m, máš napsané přímo v zadání. Rozdíl nadmořských výšek vyděl stovkou a tím zjistíš, kolikrát se pravidlo použije; tolikrát se teplota změní. Nakonec rozhodni směr: kdo jde z nižšího místa výš, tomu teplota klesá, kdo jde z vyššího místa dolů, tomu stoupá.",
        ],
        solutionSteps: [
          `Rozdíl nadmořských výšek: ${vy(horni)} − ${vy(dolni)} = ${vy(stovek * 100)}.`,
          `${cis(stovek * 100)} : 100 = ${cis(stovek)}, tedy ${pad(stovek, "STOVKA")} metrů.`,
          `Změna teploty: ${cis(stovek)} · 0,6 °C = ${st(pokles)}.`,
          nahoru
            ? `Na vrcholu: ${cis(tVychozi)} − ${cis(pokles)} = ${st(klic)}.`
            : `V údolí: ${cis(tVychozi)} + ${cis(pokles)} = ${st(klic)}.`,
        ],
        explanation: nahoru
          ? `Vrchol je o ${vy(stovek * 100)} výš, tedy o ${pad(stovek, "STOVKA")} metrů. Teplota proto klesne ${cis(stovek)} · 0,6 °C = ${st(pokles)}, a z ${st(tVychozi)} zbude ${st(klic)}. Nahoře bývá zpravidla chladněji.`
          : `Údolí je o ${vy(stovek * 100)} níž, tedy o ${pad(stovek, "STOVKA")} metrů. Teplota proto stoupne ${cis(stovek)} · 0,6 °C = ${st(pokles)}, a z ${st(tVychozi)} se stane ${st(klic)}. Dole bývá zpravidla tepleji.`,
      },
    ),
  );
}

// ── L2: odečet z klimatické tabulky ────────────────────────────────────────

const MESICE_TAB = ["leden", "duben", "červenec", "říjen"];
const V_MESICI = ["v lednu", "v dubnu", "v červenci", "v říjnu"];
const vel = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Tři roční chody, u kterých srážkové maximum padne pokaždé jinam, aby klíč
 * nebyl vždy tentýž měsíc a aby „nejteplejší = nejdeštivější“ neplatilo jako
 * pravidlo. Rozsahy odpovídají skutečným stanicím (Brno, Řím, Plymouth).
 * Maximum srážek je v každém profilu ostré — nejnižší hodnota nejdeštivějšího
 * měsíce leží nad nejvyšší hodnotou všech ostatních.
 */
const KLIMA_TABULKY: { t: [number, number][]; s: [number, number][] }[] = [
  // Vnitrozemí mírného pásu: nejvíc srážek v létě, zima suchá a mrazivá.
  { t: [[-3, 0], [7, 10], [17, 20], [8, 11]], s: [[20, 32], [35, 48], [70, 95], [38, 52]] },
  // Středomoří: léto horké a suché, maximum srážek až na podzim.
  { t: [[6, 9], [13, 16], [24, 27], [17, 20]], s: [[62, 78], [50, 60], [8, 20], [92, 118]] },
  // Západní pobřeží mírného pásu: prší po celý rok, nejvíc v zimě.
  { t: [[4, 6], [8, 10], [15, 17], [10, 12]], s: [[100, 125], [55, 70], [50, 65], [85, 98]] },
];

/** Úhrn srážek: `95 mm`. */
const sr = (x: number): string => `${cis(x)} mm`;

function tabulkaSrazkyL2(): PracticeTask | null {
  const k = pick(KLIMA_TABULKY);
  const t = k.t.map(([a, b]) => rnd(a, b));
  const s = k.s.map(([a, b]) => rnd(a, b));
  const iMax = s.indexOf(Math.max(...s));
  const iTepl = t.indexOf(Math.max(...t));
  const minS = Math.min(...s);
  const jedinyMin = s.filter((x) => x === minS).length === 1;
  const radek = (i: number): string => `${MESICE_TAB[i]} ${st(t[i])} a ${sr(s[i])}`;
  const d: Distractor[] = [0, 1, 2, 3]
    .filter((i) => i !== iMax)
    .map((i): Distractor => ({
      value: V_MESICI[i],
      why:
        i === iTepl
          ? `${vel(V_MESICI[i])} je ze všech uvedených měsíců nejtepleji, ale srážek tu spadne jen ${sr(s[i])}. Otázka se ptá na největší úhrn srážek, ne na nejvyšší teplotu.`
          : jedinyMin && s[i] === minS
            ? `${vel(V_MESICI[i])} spadne ze všech uvedených měsíců srážek nejméně, jen ${sr(s[i])}. Otázka se ptá na měsíc s největším úhrnem, ne s nejmenším.`
            : `${vel(V_MESICI[i])} spadne ${sr(s[i])} srážek, ale některý jiný měsíc v tabulce má úhrn ještě vyšší. Porovnej mezi sebou všechna čtyři čísla v milimetrech.`,
    }));
  return hlidej(
    choice(
      `Klimatická tabulka jednoho místa udává u každého měsíce průměrnou teplotu a průměrný úhrn srážek: ${radek(0)}, ${radek(1)}, ${radek(2)}, ${radek(3)}. Ve kterém z uvedených měsíců spadne nejvíc srážek?`,
      V_MESICI[iMax],
      d,
      {
        hints: [
          "U každého měsíce jsou v tabulce dvě čísla. Nejdřív si rozmysli, které z nich udává srážky, a teprve ta mezi sebou porovnávej.",
          "Teplota se udává ve stupních Celsia (°C), množství srážek v milimetrech (mm), takže obě čísla poznáš podle jednotky. Otázka se ptá jen na srážky — projdi tedy všechna čtyři čísla v milimetrech a najdi mezi nimi to největší. Pozor na past: nejteplejší měsíc nemusí být zároveň nejdeštivější, v některých krajích je léto naopak nejsušší částí roku.",
        ],
        solutionSteps: [
          "U každého měsíce jsou dvě čísla: teplota ve stupních Celsia a úhrn srážek v milimetrech. Porovnávají se jen srážky.",
          `Úhrny srážek: ${MESICE_TAB.map((m, i) => `${m} ${sr(s[i])}`).join(", ")}.`,
          `Největší z těchto čtyř úhrnů má ${MESICE_TAB[iMax]} (${sr(s[iMax])}).`,
        ],
        explanation:
          `Otázka se ptá na srážky, tedy na čísla v milimetrech, ne na teplotu ve stupních Celsia. Nejvyšší úhrn má z uvedených měsíců ${MESICE_TAB[iMax]} — ${sr(s[iMax])}. ` +
          (iTepl === iMax
            ? "Tady vyšel nejdeštivější měsíc zároveň jako nejteplejší, ale pravidlo to není: jinde na Zemi bývá nejteplejší měsíc naopak nejsušší."
            : `Nejtepleji je přitom ${V_MESICI[iTepl]} (${st(t[iTepl])}), a přesto tehdy nejvíc neprší — teplota a srážky spolu nemusí růst současně.`),
      },
    ),
  );
}

// ── L3: typ podnebí z popisu ročního chodu ─────────────────────────────────

interface Popis {
  popis: string;
  key: string;
  d: [string, string][];
  hints: [string, string];
  explanation: string;
}

const TROP_VLHKE = "tropický pás, stále vlhké podnebí";
const TROP_POUST = "tropický pás, pouštní podnebí";
const MIRNY_MORE = "mírný pás, přímořské podnebí";
const MIRNY_VNITRO = "mírný pás, vnitrozemské podnebí";
const POLAR_MRAZ = "polární pás, podnebí věčného mrazu";

const BANKA_POPIS: Popis[] = [
  {
    popis: "Průměrná teplota se po celý rok drží kolem 26 °C a rozdíly mezi měsíci jsou jen malé. Srážky spadnou v každém měsíci a za rok jich je přes 2 000 mm.",
    key: TROP_VLHKE,
    d: [
      [TROP_POUST, "Pás je určený správně, typ podnebí ne. V pouštích spadne za rok zpravidla méně než 250 mm srážek a v těch nejsušších jen několik desítek milimetrů, tady jich je přes dva tisíce."],
      [MIRNY_MORE, "U moře v mírném pásu prší sice po celý rok, ale teplota se mezi zimou a létem výrazně mění. Stálých 26 °C po celý rok do mírného pásu nepatří."],
      [POLAR_MRAZ, "V podnebí věčného mrazu se ani v nejteplejším měsíci teplota nedostane nad nulu a srážek je málo. Popis mluví o vysoké teplotě a o velkém množství srážek."],
    ],
    hints: [
      "Podívej se nejdřív na to, jak moc se teplota během roku mění, a potom na to, kolik spadne srážek a jak jsou rozložené.",
      "Teplota, která se po celý rok drží na stejné vysoké hodnotě, může být jen blízko rovníku — dál od něj se roční doby projeví a rozdíly mezi měsíci rostou. Množství srážek pak rozhodne o typu podnebí uvnitř pásu: hodně srážek v každém měsíci znamená něco úplně jiného než několik desítek milimetrů za celý rok.",
    ],
    explanation: "Vysoká teplota bez výraznějších změn během roku ukazuje na tropický pás, protože jen blízko rovníku dopadají paprsky strmě po celý rok. Srážky v každém měsíci a přes 2 000 mm za rok patří ke stále vlhkému podnebí tropického deštného lesa.",
  },
  {
    popis: "Ve dne bývá přes 35 °C, v noci teplota prudce klesá. Za celý rok spadne méně než 50 mm srážek a několik měsíců za sebou neprší vůbec.",
    key: TROP_POUST,
    d: [
      [TROP_VLHKE, "Pás je určený správně, typ podnebí ne. Stále vlhké podnebí znamená srážky v každém měsíci a přes 2 000 mm za rok, tady jich je méně než 50."],
      [MIRNY_MORE, "U moře v mírném pásu prší po celý rok a teploty jsou mnohem nižší. Denní teplota přes 35 °C do přímořského podnebí mírného pásu nepatří."],
      [POLAR_MRAZ, "Srážek je v polárním pásu také málo, ale teplota se tam drží kolem nuly a níž, ne přes 35 °C."],
    ],
    hints: [
      "Všimni si, že se tu liší dvě věci najednou: teplota přes den a v noci, a množství srážek za celý rok.",
      "Vysoká denní teplota ukazuje na pás, kam paprsky dopadají strmě. Velký rozdíl mezi dnem a nocí a téměř žádné srážky pak ukazují na to, že nad místem skoro nikdy nejsou mraky — ty by totiž v noci teplo u země udržely. Podle množství srážek rozhodni, o jaký typ podnebí uvnitř pásu jde.",
    ],
    explanation: "Vysoké denní teploty patří do tropického pásu. Méně než 50 mm srážek za rok a měsíce bez deště jsou typické pro poušť; protože nad pouští nejsou mraky, teplo se v noci rychle vyzáří a teplota prudce klesne.",
  },
  {
    popis: "Průměrná lednová teplota je 5 °C, průměrná červencová 17 °C. Srážky spadnou v každém měsíci a za rok jich je kolem 900 mm.",
    key: MIRNY_MORE,
    d: [
      [MIRNY_VNITRO, "Pás je určený správně, poloha ne. Ve vnitrozemí je rozdíl mezi zimou a létem mnohem větší a zimy bývají mrazivé. Tady je rozdíl jen 12 °C a leden zůstává nad nulou."],
      [TROP_VLHKE, "V tropickém pásu se teplota během roku skoro nemění a drží se vysoko. Tady je mezi lednem a červencem rozdíl 12 °C."],
      [POLAR_MRAZ, "O polárním podnebí se mluví tam, kde průměr nejteplejšího měsíce nevystoupí nad 10 °C, a v podnebí věčného mrazu zůstává i tehdy pod nulou. Tady má červenec 17 °C."],
    ],
    hints: [
      "Spočítej si rozdíl mezi červencem a lednem a teprve pak rozhodni; samotná čísla teplot o poloze místa tolik neřeknou.",
      "Rozdíl mezi nejteplejším a nejchladnějším měsícem se nazývá roční teplotní amplituda a prozradí, jak blízko je moře. Moře se pomalu ohřívá i pomalu ochlazuje, takže zimu zmírňuje a léto ochlazuje — amplituda je proto malá. Ve vnitrozemí se pevnina rychle prohřeje i vychladne a amplituda je velká.",
    ],
    explanation: "Leden nad nulou a červenec kolem 17 °C znamenají amplitudu jen 12 °C, tedy mírnou zimu i mírné léto. Takhle vyrovnané teploty způsobuje blízké moře. Srážky po celý rok a kolem 900 mm k přímořskému podnebí mírného pásu patří.",
  },
  {
    popis: "Průměrná lednová teplota je −16 °C, průměrná červencová 19 °C. Za rok spadne asi 400 mm srážek, nejvíce v létě.",
    key: MIRNY_VNITRO,
    d: [
      [MIRNY_MORE, "Pás je určený správně, poloha ne. U moře je rozdíl mezi zimou a létem malý, protože moře zimu zmírňuje. Tady je rozdíl 35 °C."],
      [POLAR_MRAZ, "Zima je sice mrazivá, ale v polárním pásu zůstává chladno i v létě. Tady má nejteplejší měsíc 19 °C, což je normální letní teplota mírného pásu."],
      [TROP_VLHKE, "V tropickém pásu se teplota během roku skoro nemění a nikdy neklesá hluboko pod nulu. Tady je v lednu −16 °C."],
    ],
    hints: [
      "Porovnej lednovou a červencovou teplotu mezi sebou. Rozhodující je, jak velký je mezi nimi rozdíl, ne samotná zimní hodnota.",
      "Rozdíl mezi nejteplejším a nejchladnějším měsícem se nazývá roční teplotní amplituda. Velká amplituda znamená, že se místo v létě rychle prohřeje a v zimě rychle vychladne — tak se chová pevnina daleko od moře. Malá amplituda naopak znamená blízkost moře. Podle výše letní teploty pak rozhodni, jestli jde o mírný, nebo o polární pás.",
    ],
    explanation: "Amplituda 35 °C je veliká: mrazivá zima a teplé léto ukazují na pevninu daleko od moře. Červenec s 19 °C přitom vylučuje polární pás, kde zůstává chladno i v létě. Jde tedy o vnitrozemské podnebí mírného pásu.",
  },
  {
    popis: "Místo leží v nížině, jen kousek nad hladinou moře. Průměrná teplota nejteplejšího měsíce je −2 °C, v zimě klesá pod −30 °C. Za rok spadne asi 150 mm srážek, většinou ve formě sněhu.",
    key: POLAR_MRAZ,
    d: [
      [MIRNY_VNITRO, "Ve vnitrozemí mírného pásu jsou zimy opravdu mrazivé, ale léto je teplé — průměr nejteplejšího měsíce bývá vysoko nad nulou. Tady zůstává i nejteplejší měsíc pod nulou."],
      [TROP_POUST, "Srážek je v pouštích také málo, ale teploty jsou tam vysoké po celý rok a srážky nepadají ve formě sněhu."],
      [MIRNY_MORE, "V přímořském podnebí mírného pásu je zima mírná a léto teplé. Průměrná teplota pod nulou i v nejteplejším měsíci sem nepatří."],
    ],
    hints: [
      "Nejvíc prozradí teplota nejteplejšího měsíce, ne ta zimní. Zamysli se, co znamená, když ani ona není nad nulou.",
      "Mrazivá zima sama o sobě ještě nestačí — ta bývá i daleko od moře uvnitř mírného pásu. Rozhoduje léto: když ani v nejteplejším měsíci průměrná teplota nevystoupí nad nulu, nemůže tam sníh a led během roku roztát. Množství srážek pak dopoví zbytek, protože studený vzduch pojme jen málo vodní páry.",
    ],
    explanation: "Nejteplejší měsíc pod nulou znamená, že sníh a led nestačí za léto roztát — to je v nížině možné jen v polárním pásu, a mimo něj už jen vysoko v horách nad sněžnou čarou, kde teplota klesá s nadmořskou výškou. Popsané místo v nížině je tedy v polárním pásu. Málo srážek k tomu patří, protože studený vzduch unese jen málo vodní páry, a padají převážně jako sníh.",
  },
];

function popisL3(): PracticeTask | null {
  const p = pick(BANKA_POPIS);
  return hlidej(
    choice(
      `Podnebí jednoho místa je popsané takto: ${p.popis} Do jakého podnebného pásu místo patří a o jaký typ podnebí jde?`,
      p.key,
      p.d.map(([value, why]): Distractor => ({ value, why })),
      { hints: p.hints, explanation: p.explanation },
    ),
  );
}

// ── L3: dvě místa na stejné rovnoběžce ─────────────────────────────────────

function vnitrozemiL3(): PracticeTask | null {
  // Jen severní polokoule: teploty jsou napsané po severním vzoru (leden
  // studený, červenec teplý). Na jižní polokouli jsou roční doby prohozené,
  // takže by zadání odporovalo učivu o Zemi ve vesmíru ze stejného ročníku —
  // a v šířkách 46–54° j. š. navíc žádné kontinentální vnitrozemí neleží.
  //
  // Rozsahy jsou svázané se zeměpisnou šířkou, aby nevznikla dvojice, která
  // na Zemi nikde neexistuje: leden −24 °C na 46° s. š. nemá ani nejdrsnější
  // vnitrozemí (nejchladnější místa těchto šířek mají kolem −15 °C) a naopak
  // přímořský leden nad 5 °C se na těchto šířkách nevyskytuje (Stornoway
  // +4,5 °C, Stavanger +1,5 °C).
  const lat = rnd(46, 54);
  const bCervenec = rnd(15, 19);
  const aCervenec = bCervenec + rnd(0, 2);
  const aLeden = lat >= 48 ? rnd(-24, -14) : rnd(-18, -10);
  const bLeden = rnd(0, 5);
  const ampA = aCervenec - aLeden;
  const ampB = bCervenec - bLeden;
  if (ampA - ampB < 12) return null;
  return hlidej(
    choice(
      `Na stejné rovnoběžce ${sirka(lat)} leží města A a B. Ve městě A je průměrná lednová teplota ${st(aLeden)} a červencová ${st(aCervenec)}, ve městě B lednová ${st(bLeden)} a červencová ${st(bCervenec)}. Co z těchto údajů vyplývá?`,
      "Město A leží ve vnitrozemí, město B blízko moře.",
      [
        {
          value: "Město B leží ve vnitrozemí, město A blízko moře.",
          why: "Je to obráceně. Velký rozdíl mezi zimou a létem má vnitrozemí, protože pevnina se rychle prohřeje i vychladne. Moře naopak teploty vyrovnává, takže u něj je rozdíl malý — a větší rozdíl má tady město A.",
        },
        {
          value: "Město A leží blíž k rovníku než město B.",
          why: "Obě města leží na stejné rovnoběžce, takže jsou od rovníku stejně daleko. Rozdíl mezi nimi musí mít jinou příčinu než zeměpisnou šířku.",
        },
        {
          value: "Město A leží mnohem výš v horách než město B.",
          why: "Větší nadmořská výška by v městě A snížila teplotu v zimě i v létě. Tady je ale v létě v obou městech skoro stejně teplo a liší se hlavně zima, což ukazuje na vzdálenost od moře.",
        },
      ],
      {
        hints: [
          "Spočítej u každého města rozdíl mezi červencovou a lednovou teplotou a ta dvě čísla mezi sebou porovnej.",
          "Rozdíl mezi nejteplejším a nejchladnějším měsícem se nazývá roční teplotní amplituda. Moře se pomalu ohřívá i pomalu ochlazuje, a proto u pobřeží nebývá zima tak krutá ani léto tak horké — amplituda je malá. Ve vnitrozemí se pevnina rychle prohřeje i rychle vychladne, a tak je amplituda velká. Polohu obou měst tedy poznáš podle toho, které z nich má větší rozdíl teplot.",
        ],
        solutionSteps: [
          `Amplituda města A: ${cis(aCervenec)} − (${cis(aLeden)}) = ${st(ampA)}.`,
          `Amplituda města B: ${cis(bCervenec)} − ${cis(bLeden)} = ${st(ampB)}.`,
          `Větší amplituda patří vnitrozemí, menší přímoří.`,
        ],
        explanation: `Obě města jsou od rovníku stejně daleko, takže rozdíl nemůže být způsobený zeměpisnou šířkou. Město A má amplitudu ${st(ampA)}, město B jen ${st(ampB)}. Velká amplituda znamená pevninu daleko od moře, malá amplituda blízkost moře, které teploty vyrovnává.`,
      },
    ),
  );
}

// ── L3: inverze výškového výpočtu ──────────────────────────────────────────

function inverzeVyskaL3(): PracticeTask | null {
  const dolni = rnd(1, 8) * 100;
  const stovek = rnd(4, 16);
  if (stovek * 100 <= dolni) return null;
  const horni = dolni + stovek * 100;
  const pokles = r1(stovek * 0.6);
  const tDolni = rnd(8, 24);
  const tHorni = r1(tDolni - pokles);
  return hlidej(
    choice(
      `V údolí v nadmořské výšce ${vy(dolni)} je průměrná teplota ${st(tDolni)}, na vrcholu hory je průměrná teplota ${st(tHorni)}. ${PRAVIDLO} V jaké nadmořské výšce leží vrchol?`,
      vy(horni),
      [
        {
          value: vy(stovek * 100),
          why: `To je rozdíl nadmořských výšek, ne výška vrcholu. K rozdílu je potřeba ještě přičíst nadmořskou výšku údolí, tedy ${vy(dolni)}.`,
        },
        {
          value: vy(dolni + Math.round(pokles * 100)),
          why: `Tahle hodnota vyjde, když se rozdíl teplot ${st(pokles)} rovnou vynásobí stem a k výsledku se přičte nadmořská výška údolí ${vy(dolni)}. Nejdřív se ale musí zjistit, kolikrát teplota klesla o 0,6 °C — tedy rozdíl teplot touto hodnotou vydělit, a teprve výsledek násobit stem.`,
        },
        {
          value: vy(stovek * 100 - dolni),
          why: `Tahle hodnota vyjde, když se nadmořská výška údolí od rozdílu odečte. Vrchol je ale nad údolím, takže se rozdíl k výšce údolí přičítá.`,
        },
      ],
      {
        hints: [
          "Začni tím, o kolik stupňů se obě teploty liší; teprve z toho se dá odvodit, jak velký je mezi místy výškový rozdíl.",
          "Pravidlo, o kolik teplota klesne na každých 100 m, máš napsané přímo v zadání. Rozdílem teplot a tímto pravidlem zjistíš, kolik stovek metrů je mezi údolím a vrcholem; počet stovek pak vynásob stem, abys dostal výškový rozdíl v metrech. Pozor na poslední krok: otázka se ptá na nadmořskou výšku vrcholu, ne na rozdíl, takže se k němu musí přičíst nadmořská výška údolí.",
        ],
        solutionSteps: [
          `Rozdíl teplot: ${cis(tDolni)} − ${cis(tHorni)} = ${st(pokles)}.`,
          `${cis(pokles)} : 0,6 = ${cis(stovek)}, tedy ${pad(stovek, "STOVKA")} metrů, což je ${vy(stovek * 100)}.`,
          `Nadmořská výška vrcholu: ${vy(dolni)} + ${vy(stovek * 100)} = ${vy(horni)}.`,
        ],
        explanation: `Mezi údolím a vrcholem je rozdíl teplot ${st(pokles)}. Podle pravidla ze zadání připadá na každých 100 m pokles o 0,6 °C, takže ${cis(pokles)} : 0,6 = ${cis(stovek)}, tedy ${pad(stovek, "STOVKA")} metrů neboli ${vy(stovek * 100)}. Vrchol leží o tolik výš než údolí: ${vy(dolni)} + ${vy(stovek * 100)} = ${vy(horni)}.`,
      },
    ),
  );
}

// ── L3: dopočet chybějícího měsíčního průměru ──────────────────────────────

function chybejiciMesicL3(): PracticeTask | null {
  const amp = rnd(8, 24) * 2;
  const max = rnd(12, 26);
  if (amp === max) return null;
  const min = max - amp;
  // Třetí distraktor se volí podle znaménka klíče: když klíč vyjde záporně,
  // musí být záporná i některá z chybných možností, jinak by ji šlo poznat
  // podle znaménka bez jediného výpočtu.
  const treti: Distractor =
    min < 0
      ? {
          value: st(-amp),
          why: `Tahle hodnota vyjde, když se amplituda odečte od nuly, jako by nejteplejší měsíc měl 0 °C. Odečítá se ale od jeho skutečné teploty ${st(max)}.`,
        }
      : {
          value: st(max - amp / 2),
          why: "Tahle hodnota vyjde, když se amplituda rozdělí napůl, jako by se počítala od průměru. Amplituda je ale celý rozdíl mezi nejteplejším a nejchladnějším měsícem.",
        };
  return hlidej(
    choice(
      `Roční teplotní amplituda jednoho místa je ${st(amp)}. Průměrná teplota nejteplejšího měsíce je ${st(max)}. Jaká je průměrná teplota nejchladnějšího měsíce?`,
      st(min),
      [
        {
          value: st(max + amp),
          why: "Tahle hodnota vyjde, když se amplituda přičte. Nejchladnější měsíc ale musí být chladnější než nejteplejší, takže se amplituda odečítá.",
        },
        {
          value: st(amp - max),
          why: `Tahle hodnota vyjde, když se čísla odečtou obráceně. Odečítá se amplituda od teploty nejteplejšího měsíce, tedy ${cis(max)} − ${cis(amp)}, ne naopak.`,
        },
        treti,
      ],
      {
        hints: [
          "Amplituda říká, o kolik stupňů je nejteplejší měsíc teplejší než nejchladnější. Rozmysli si, kterým směrem se od teploty nejteplejšího měsíce vydáš.",
          "Nejchladnější měsíc je o celou amplitudu chladnější než nejteplejší, takže se amplituda od jeho teploty odečítá; je to obrácený postup, než když amplitudu počítáš ze dvou měsíčních průměrů. Podle toho, jestli je amplituda menší, nebo větší než teplota nejteplejšího měsíce, zůstaneš při odčítání nad nulou, nebo přes ni přejdeš pod ni — porovnej obě čísla ze zadání a rozhodni to sám nebo sama.",
        ],
        solutionSteps: [
          `Amplituda je rozdíl nejteplejšího a nejchladnějšího měsíce: ${cis(max)} − x = ${cis(amp)}.`,
          `Hledaná teplota: x = ${cis(max)} − ${cis(amp)} = ${st(min)}.`,
        ],
        explanation: `Amplituda je rozdíl mezi nejteplejším a nejchladnějším měsícem, takže se hledaná teplota dostane odečtením amplitudy od teploty nejteplejšího měsíce: ${cis(max)} − ${cis(amp)} = ${st(min)}. Nejchladnější měsíc musí vyjít chladnější než nejteplejší, a proto se amplituda nikdy nepřičítá.`,
      },
    ),
  );
}

// ── Generátor ──────────────────────────────────────────────────────────────

function gen(level: number): PracticeTask[] {
  const sablony: Tvurce[] =
    level === 1
      ? [faktL1, pocasiPodnebiL1, faktL1]
      : level === 2
        ? [pasL2, amplituda2L2, tabulkaSrazkyL2, vyskaL2, amplituda4L2]
        : [popisL3, vnitrozemiL3, inverzeVyskaL3, chybejiciMesicL3];
  let i = 0;
  const genLx = () => losUlohy(sablony[i++ % sablony.length]);
  return ruzneUlohy(() => losUlohy(genLx));
}

// ── Topic ──────────────────────────────────────────────────────────────────
export const ATMOSFERA_POCASI_PODNEBI: TopicMetadata[] = [
  {
    id: "g6-zem-atmosfera-pocasi-podnebi-6",
    rvpNodeId:
      "g6-zemepis-prirodni-obraz-zeme-krajinne-sfery-atmosfera-pocasi-podnebi-podnebne-pasy",
    displayName: "Počasí a podnebí",
    title: "Atmosféra - počasí, podnebí, podnebné pásy",
    studentTitle: "Počasí dneska a podnebí za třicet let",
    subject: "zemepis",
    category: "Přírodní obraz Země",
    topic: "Krajinné sféry",
    briefDescription: "Rozlišíš počasí a podnebí, určíš podnebný pás a spočítáš teplotu podle výšky.",
    keywords: [
      "atmosféra", "počasí", "podnebí", "podnebné pásy", "troposféra",
      "teplotní amplituda", "srážky", "tlak vzduchu", "obratník", "polární kruh",
      "nadmořská výška", "zeměpisná šířka",
    ],
    goals: [
      "Odlišit počasí (okamžitý stav ovzduší) od podnebí (dlouhodobý průměr).",
      "Ze zeměpisné šířky určit podnebný pás a polokouli.",
      "Spočítat roční teplotní amplitudu a teplotu podle nadmořské výšky.",
    ],
    boundaries: [
      "Losují se jen nesporné zeměpisné šířky; hraniční pásma 23,5–40° a 60–66,5° ne.",
      "Kde se v zadání potkává jméno měsíce s polokoulí, losuje se jen severní polokoule — na jižní jsou roční doby prohozené.",
      "Pravidlo o poklesu teploty s výškou je vždy uvedené přímo v zadání úlohy.",
      "Rozdíl nadmořských výšek je vždy násobek 100 m, výsledky nejvýš s jedním desetinným místem.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Počasí je okamžitý stav ovzduší, podnebí dlouhodobý průměr za mnoho let. Základní podnebné pásy jsou tři a určuje je zeměpisná šířka: tropický od rovníku k obratníku na 23,5°, mírný zhruba mezi 40° a 60° a polární za polárním kruhem na 66,5°. Mezi nimi učebnice ještě rozlišují přechodný pás subtropický a subpolární.",
      steps: [
        "Amplitudu spočítej jako teplotu nejteplejšího měsíce minus teplotu nejchladnějšího.",
        "U nadmořské výšky nejdřív zjisti rozdíl výšek a převeď ho na stovky metrů.",
        "Počet stovek vynásob hodnotou z pravidla v zadání; nahoru teplota klesá, dolů stoupá.",
      ],
      commonMistake: "U záporné zimní teploty odečíst číslo bez znaménka (18 − (−4) jako 14) nebo teplotu s výškou přičítat místo odečítat.",
      example: "Leden −4 °C a červenec 18 °C dávají amplitudu 18 − (−4) = 22 °C. Z 200 m na 1 400 m je rozdíl 1 200 m, tedy 12 · 0,6 = 7,2 °C poklesu.",
    },
  },
];
