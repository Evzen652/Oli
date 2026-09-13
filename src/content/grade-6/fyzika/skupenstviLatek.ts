/**
 * Fyzika 6. ročník — Skupenství látek (pevné, kapalné, plynné).
 *
 * Druhé téma okruhu „Látky a tělesa", navazuje na `latkaATeleso.ts`: tam se
 * ukázalo, že některé vlastnosti patří látce a jiné tělesu. Skupenství je
 * přesně ta vlastnost, u které i ten první závěr neplatí natvrdo — nezávisí
 * jen na látce, ale na teplotě.
 *
 * **Miskoncepce, na kterou téma cílí:** žák bere skupenství jako trvalou
 * nálepku látky („železo je pevné, voda je kapalná, kyslík je plyn"). Proto
 * L3 staví na teplotě tání a varu: při 2 000 °C je železo kapalné a při
 * −200 °C je kyslík kapalina taky. Rtuť tutéž představu boří hned v L1 —
 * je to kov, a přesto kapalina.
 *
 * Gradace:
 *  • **L1 rozpoznání** — v jakém skupenství je látka při pokojové teplotě,
 *    a to jak podle názvu skupenství, tak podle popsaného chování.
 *  • **L2 aplikace** — pojmenuj změnu skupenství z běžného děje kolem nás.
 *  • **L3 přenos** — z teploty tání a varu urči skupenství při dané teplotě.
 *    Dva kroky (dvě porovnání) a obě krajní teploty jsou mimo běžnou zkušenost,
 *    takže paměť nepomůže.
 *
 * ## Rozhodnutí, která stojí za vysvětlení
 *
 * **Jen čtyři změny skupenství.** Sublimace ani desublimace tu nejsou, ačkoli
 * se do tématu nabízejí (mizející sníh v mrazu, ledové květy na okně). Na
 * 6. ročník je to nadstavba — a shodou okolností tím vychází přesně čtyři
 * možnosti, takže L2 má stálou nabídku a dítě musí určit směr změny, ne
 * vyřazovat.
 *
 * **Jména látek stojí všude v prvním pádě a přísudky se vyhýbají rodu.**
 * Banka míchá rody (železo, rtuť, cín) i číslo, takže „je pevná" nebo „už se
 * vypařila" by u poloviny úloh neseděly. Všude proto stojí „je v pevném
 * skupenství" — jmenný přísudek se skupenstvím, který je na rodu látky
 * nezávislý. Táž past jako u `latkaATeleso.ts`, jen z druhé strany.
 *
 * **Teploty v `LATKY` jsou skutečné hodnoty za normálního tlaku**, ne vymyšlená
 * kulatá čísla. Dítě si je může ověřit v tabulkách, a hlavně: kdyby se čísla
 * vymyslela, rozpadly by se distraktory typu „sůl taje při 801 °C" u zadání
 * s 800 °C, kde je těsný rozdíl to podstatné.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { klicUlohy } from "@/lib/taskIdentity";
import { pick, shuffle, buildChoiceTask as task } from "./_shared";

const velke = (s: string) => `${s[0].toUpperCase()}${s.slice(1)}`;

// ── Skupenství: jak se jmenuje a jak se pozná ──────────────────────────────
//
// `jmeno` je jmenný přísudek („… je plyn"), `vSkupenstvi` předložková vazba
// („… je v plynném skupenství") a `chovani` slovesná fráze, která se dá přilepit
// za „látka, která …". Všechny tři tvary jsou nezávislé na rodu látky.
type Stav = "pevne" | "kapalne" | "plynne";

const STAVY: Record<Stav, { jmeno: string; vSkupenstvi: string; chovani: string }> = {
  pevne: {
    jmeno: "pevná látka",
    vSkupenstvi: "v pevném skupenství",
    chovani: "nemění svůj tvar ani objem",
  },
  kapalne: {
    jmeno: "kapalina",
    vSkupenstvi: "v kapalném skupenství",
    chovani: "přejímá tvar nádoby, ale objem si zachovává",
  },
  plynne: {
    jmeno: "plyn",
    vSkupenstvi: "v plynném skupenství",
    chovani: "vyplní celou nádobu, do které se dostane",
  },
};

const KLICE_STAVU: Stav[] = ["pevne", "kapalne", "plynne"];

/**
 * Látky, které dítě zná z domova, a jejich skupenství při pokojové teplotě.
 *
 * Rtuť je v bance schválně: je to kov, a přesto kapalina — bez ní se dá celé
 * L1 vyřešit pravidlem „kov = pevné".
 */
const LATKY: { nazev: string; stav: Stav }[] = [
  { nazev: "železo", stav: "pevne" },
  { nazev: "měď", stav: "pevne" },
  { nazev: "hliník", stav: "pevne" },
  { nazev: "zlato", stav: "pevne" },
  { nazev: "sklo", stav: "pevne" },
  { nazev: "dřevo", stav: "pevne" },
  { nazev: "kuchyňská sůl", stav: "pevne" },
  { nazev: "cukr", stav: "pevne" },
  { nazev: "vosk", stav: "pevne" },
  { nazev: "voda", stav: "kapalne" },
  { nazev: "olej", stav: "kapalne" },
  { nazev: "mléko", stav: "kapalne" },
  { nazev: "líh", stav: "kapalne" },
  { nazev: "ocet", stav: "kapalne" },
  { nazev: "rtuť", stav: "kapalne" },
  { nazev: "kyslík", stav: "plynne" },
  { nazev: "dusík", stav: "plynne" },
  { nazev: "vodík", stav: "plynne" },
  { nazev: "oxid uhličitý", stav: "plynne" },
  { nazev: "helium", stav: "plynne" },
  { nazev: "zemní plyn", stav: "plynne" },
];

// ── L1 — rozpoznání: v jakém skupenství je látka při pokojové teplotě ──────
function genL1(): PracticeTask {
  const cil = pick(KLICE_STAVU);
  const spravna = pick(LATKY.filter((l) => l.stav === cil));

  // Mezi distraktory musí být zastoupena obě zbývající skupenství. Jinak by
  // úloha rozlišovala jen dvě možnosti ze tří a šla by vyřešit vyřazením.
  const distraktory: typeof LATKY = [];
  for (const s of shuffle(KLICE_STAVU.filter((s) => s !== cil))) {
    distraktory.push(pick(LATKY.filter((l) => l.stav === s)));
  }
  const zbytek = shuffle(
    LATKY.filter((l) => l.stav !== cil && !distraktory.includes(l)),
  );
  distraktory.push(zbytek[0]);

  // Kotva nápovědy je vždy distraktor, nikdy klíč — rozebrat ji tedy nic
  // neprozradí a nápověda přesto vyjde u každé úlohy jinak.
  const kotva = distraktory[0];
  const podleChovani = Math.random() < 0.5;
  const otazka = podleChovani
    ? `Která z těchto látek při pokojové teplotě ${STAVY[cil].chovani}?`
    : `Která z těchto látek je při pokojové teplotě ${STAVY[cil].vSkupenstvi}?`;

  return task(
    otazka,
    spravna.nazev,
    distraktory.map((d) => ({
      value: d.nazev,
      why: `${velke(d.nazev)} je při pokojové teplotě ${STAVY[d.stav].jmeno} — ${STAVY[d.stav].chovani}. Hledáš látku, která ${STAVY[cil].chovani}.`,
    })),
    {
      hints: [
        `Vezmi jednu možnost: ${kotva.nazev}. Jak se tahle látka chová v otevřeném hrnci?`,
        `${velke(kotva.nazev)} je při pokojové teplotě ${STAVY[kotva.stav].jmeno}, takže ${STAVY[kotva.stav].chovani}. Projdi takhle všechny čtyři možnosti a hledej tu jedinou, která ${STAVY[cil].chovani}. Nerozhoduj podle toho, co je to za látku, ale podle toho, jak se při pokojové teplotě chová.`,
      ],
      solutionSteps: [
        "Pevná látka si drží tvar i objem.",
        "Kapalina přejímá tvar nádoby, objem má stálý.",
        "Plyn vyplní celý prostor, který má k dispozici.",
      ],
      explanation: `Skupenství není trvalá nálepka látky, ale závisí na teplotě. Při pokojové teplotě je ${spravna.nazev} ${STAVY[cil].jmeno}: ${STAVY[cil].chovani}.`,
    },
  );
}

// ── Změny skupenství ───────────────────────────────────────────────────────
//
// Sublimace a desublimace do 6. ročníku nepatří (nadstavba), takže zůstávají
// čtyři změny a nabídka je u každé úlohy stejná. Dítě tím pádem nemůže
// odpověď vyřadit — musí určit, odkud kam děj míří.
type KlicZmeny = "tani" | "tuhnuti" | "vyparovani" | "kapalneni";

const ZMENY: Record<KlicZmeny, { nazev: string; z: string; na: string; popisSe: string }> = {
  tani: {
    nazev: "tání",
    z: "pevného",
    na: "kapalné",
    popisSe: "pevná látka mění teplem v kapalinu",
  },
  tuhnuti: {
    nazev: "tuhnutí",
    z: "kapalného",
    na: "pevné",
    popisSe: "kapalina ochlazením mění v pevnou látku",
  },
  vyparovani: {
    nazev: "vypařování",
    z: "kapalného",
    na: "plynné",
    popisSe: "z kapaliny stává plyn",
  },
  kapalneni: {
    nazev: "kapalnění",
    z: "plynného",
    na: "kapalné",
    popisSe: "plyn ochlazením mění v kapalinu",
  },
};

/**
 * Děje z běžného dne. `co` je podmět v prvním pádě (jde za dvojtečku),
 * `teplo` se lepí za „se při tom …", `proc` nese konkrétní mechanismus
 * do vysvětlení — bez něj by bylo u všech osmnácti dějů stejné.
 */
const DEJE: { text: string; zmena: KlicZmeny; co: string; teplo: string; proc: string }[] = [
  { text: "Kostka ledu ve sklenici s limonádou se po chvíli ztratí a limonády přibude.", zmena: "tani", co: "led v kostce", teplo: "zahřívá", proc: "Led v teplé limonádě se ohřeje nad 0 °C a změní se ve vodu." },
  { text: "Kousek másla na rozpálené pánvi se rozteče do tenké vrstvy.", zmena: "tani", co: "máslo na pánvi", teplo: "zahřívá", proc: "Pánev předá máslu teplo a máslo přejde v tekutinu." },
  { text: "Čokoláda zapomenutá v kapse se rozteče.", zmena: "tani", co: "čokoláda v kapse", teplo: "zahřívá", proc: "Tělesná teplota stačí na to, aby čokoláda roztála." },
  { text: "Sníh na chodníku se po oblevě změní v kaluže.", zmena: "tani", co: "sníh na chodníku", teplo: "zahřívá", proc: "Teplota vystoupila nad 0 °C a sníh přešel ve vodu." },
  { text: "Kus ledu v teplé dlani začne kapat.", zmena: "tani", co: "led v dlani", teplo: "zahřívá", proc: "Dlaň předá ledu teplo a led přejde ve vodu." },
  { text: "Voda nalitá do formičky dá v mrazáku kostky ledu.", zmena: "tuhnuti", co: "voda ve formičce", teplo: "ochlazuje", proc: "Mrazák odebere vodě teplo, voda klesne pod 0 °C a změní se v led." },
  { text: "Vosk stečený po hořící svíčce za chvíli ztvrdne.", zmena: "tuhnuti", co: "vosk na svíčce", teplo: "ochlazuje", proc: "Roztavený vosk stranou od plamene vychladne a ztvrdne." },
  { text: "Kaluž na cestě přes noc zamrzne.", zmena: "tuhnuti", co: "voda v kaluži", teplo: "ochlazuje", proc: "Noční mráz stáhne teplotu vody pod 0 °C." },
  { text: "Roztavený kov se v huti nalije do formy a v ní ztvrdne.", zmena: "tuhnuti", co: "roztavený kov", teplo: "ochlazuje", proc: "Kov ve formě odevzdá teplo a vrátí se do pevného skupenství." },
  { text: "Kaluž po dešti do večera zmizí, i když voda nikam neodtekla.", zmena: "vyparovani", co: "voda v kaluži", teplo: "zahřívá", proc: "Voda se po troškách mění ve vodní páru a odchází do vzduchu." },
  { text: "Prádlo pověšené na balkoně za slunečného dne uschne.", zmena: "vyparovani", co: "voda v prádle", teplo: "zahřívá", proc: "Voda z látky přejde do vzduchu jako vodní pára." },
  { text: "Z hrnce s vroucí vodou stoupá ke stropu pára.", zmena: "vyparovani", co: "voda v hrnci", teplo: "zahřívá", proc: "Voda dosáhla 100 °C a mění se v páru v celém svém objemu." },
  { text: "Mokré vlasy po ručníku samy uschnou.", zmena: "vyparovani", co: "voda ve vlasech", teplo: "zahřívá", proc: "Zbytek vody se z vlasů vypaří do vzduchu v pokoji." },
  { text: "Na studeném okně se zevnitř udělají kapky vody.", zmena: "kapalneni", co: "vodní pára ve vzduchu", teplo: "ochlazuje", proc: "Pára ve vzduchu se u studeného skla ochladí a usadí se jako kapky." },
  { text: "Ráno leží na trávě rosa, i když v noci nepršelo.", zmena: "kapalneni", co: "vodní pára ve vzduchu", teplo: "ochlazuje", proc: "Vzduch se přes noc ochladil a pára se srazila na chladné trávě." },
  { text: "Sklenice s ledovou limonádou se zvenku orosí.", zmena: "kapalneni", co: "vodní pára ve vzduchu", teplo: "ochlazuje", proc: "Sklo studí, takže se na něm pára z okolního vzduchu mění zpátky ve vodu." },
  { text: "Poklička zvednutá z hrnce je zespodu celá mokrá.", zmena: "kapalneni", co: "vodní pára nad hrncem", teplo: "ochlazuje", proc: "Pára narazí na chladnější pokličku a změní se zpátky ve vodu." },
  { text: "Brýle se po příchodu z mrazu do teplé místnosti zamlží.", zmena: "kapalneni", co: "vodní pára v místnosti", teplo: "ochlazuje", proc: "Pára z teplého vzduchu se usadí na studených sklech brýlí." },
];

// ── L2 — aplikace: pojmenuj změnu skupenství ──────────────────────────────
function genL2(): PracticeTask {
  const dej = pick(DEJE);
  const spravna = ZMENY[dej.zmena];
  const chybne = (Object.keys(ZMENY) as KlicZmeny[]).filter((k) => k !== dej.zmena);

  return task(
    `${dej.text} Jak se tahle změna skupenství jmenuje?`,
    spravna.nazev,
    chybne.map((k) => ({
      value: ZMENY[k].nazev,
      why: `Při ${ZMENY[k].nazev} se ${ZMENY[k].popisSe}. Tady se děje něco jiného.`,
    })),
    {
      hints: [
        // Nápověda schválně nepojmenuje ani jedno skupenství na začátku a konci
        // děje: nabídka jsou čtyři různé směry, takže určit směr už je odpověď.
        `Najdi v zadání látku, která se mění: ${dej.co}. Urči, v jakém skupenství je na začátku děje.`,
        `${velke(dej.co)} se při tom ${dej.teplo}. Teplo posouvá látku k volnějšímu skupenství (pevné → kapalné → plynné), chlad ji posouvá zpátky. Rozmysli si tedy nejdřív směr, ve kterém se látka posunula, a teprve podle něj vyber jméno změny.`,
      ],
      solutionSteps: [
        "Urči skupenství na začátku děje.",
        "Urči skupenství na konci děje.",
        "Podle směru vyber název změny.",
      ],
      explanation: `${velke(spravna.nazev)} je změna z ${spravna.z} skupenství na ${spravna.na}. ${dej.proc}`,
    },
  );
}

/**
 * Teploty tání a varu za normálního tlaku, zaokrouhlené na celé stupně.
 *
 * Hodnoty jsou skutečné, ne vymyšlené — u zadání s 800 °C stojí celý smysl
 * úlohy na tom, že kuchyňská sůl taje až při 801 °C.
 */
const LATKY_TEPLOTY: { nazev: string; tani: number; var: number }[] = [
  { nazev: "kyslík", tani: -219, var: -183 },
  { nazev: "dusík", tani: -210, var: -196 },
  { nazev: "líh", tani: -114, var: 78 },
  { nazev: "amoniak", tani: -78, var: -33 },
  { nazev: "rtuť", tani: -39, var: 357 },
  { nazev: "brom", tani: -7, var: 59 },
  { nazev: "voda", tani: 0, var: 100 },
  { nazev: "síra", tani: 115, var: 445 },
  { nazev: "cín", tani: 232, var: 2602 },
  { nazev: "olovo", tani: 328, var: 1749 },
  { nazev: "zinek", tani: 420, var: 907 },
  { nazev: "hořčík", tani: 650, var: 1090 },
  { nazev: "hliník", tani: 660, var: 2519 },
  { nazev: "kuchyňská sůl", tani: 801, var: 1465 },
  { nazev: "stříbro", tani: 962, var: 2162 },
  { nazev: "zlato", tani: 1064, var: 2856 },
  { nazev: "měď", tani: 1085, var: 2562 },
  { nazev: "železo", tani: 1538, var: 2861 },
];

/** Minus je typografické (U+2212), stejně jako v tématu Teplota. */
const stupne = (t: number) => `${t < 0 ? `−${-t}` : t} °C`;
const jeKapalna = (l: { tani: number; var: number }, t: number) => l.tani < t && t < l.var;

/**
 * Teploty do zadání. Žádná se nerovná žádné teplotě tání ani varu v bance —
 * jinak by u dané látky nešlo rozhodnout, v jakém skupenství zrovna je.
 *
 * Seznam se **prosívá podle banky, ne podle mého odhadu**: první verze
 * obsahovala −150 °C, při kterých není v bance ani jedna kapalina (líh ještě
 * netaje, dusík už vře) — a generátor na tom spadl. Podmínky dole drží zadání
 * řešitelné a zároveň vynucují, aby mezi distraktory byla vždy jak látka ještě
 * pevná, tak látka už plynná: se samými pevnými by stačilo hledat nejnižší
 * teplotu tání a druhé porovnání by bylo k ničemu.
 */
const TEPLOTY = [
  -200, -150, -100, -50, -20, 20, 50, 80, 150, 250, 300, 400, 500,
  700, 800, 900, 1000, 1100, 1200, 1500, 2000, 2200, 2700,
].filter(
  (t) =>
    LATKY_TEPLOTY.some((l) => jeKapalna(l, t)) &&
    LATKY_TEPLOTY.some((l) => t < l.tani) &&
    LATKY_TEPLOTY.some((l) => t > l.var),
);

// ── L3 — přenos: skupenství podle teploty tání a varu ─────────────────────
function genL3(): PracticeTask {
  const t = pick(TEPLOTY);
  const spravna = pick(LATKY_TEPLOTY.filter((l) => jeKapalna(l, t)));

  // Distraktory musí být obojí: látka, která ještě neroztála, i látka, která
  // se už vypařila. Se samými „ještě pevnými" by stačilo hledat nejnižší
  // teplotu tání a druhé porovnání by bylo zbytečné.
  const pevne = shuffle(LATKY_TEPLOTY.filter((l) => t < l.tani));
  const plynne = shuffle(LATKY_TEPLOTY.filter((l) => t > l.var));
  const distraktory = [...pevne.slice(0, 1), ...plynne.slice(0, 1)];
  for (const kandidat of shuffle([...pevne, ...plynne])) {
    if (distraktory.length === 3) break;
    if (!distraktory.includes(kandidat)) distraktory.push(kandidat);
  }

  const popis = (l: { nazev: string; tani: number; var: number }) =>
    `${l.nazev} (taje při ${stupne(l.tani)}, vře při ${stupne(l.var)})`;

  const kotva = distraktory[0];
  const verdikt =
    t < kotva.tani
      ? "při teplotě ze zadání je ještě v pevném skupenství"
      : "při teplotě ze zadání je už v plynném skupenství";

  return task(
    `Teplota je ${stupne(t)}. Která z těchto látek je při ní kapalná?`,
    popis(spravna),
    distraktory.map((d) => ({
      value: popis(d),
      why:
        t < d.tani
          ? `${velke(d.nazev)} taje až při ${stupne(d.tani)}, takže při ${stupne(t)} je ještě v pevném skupenství.`
          : `${velke(d.nazev)} vře už při ${stupne(d.var)}, takže při ${stupne(t)} je v plynném skupenství.`,
    })),
    {
      hints: [
        `Začni u jedné možnosti: ${kotva.nazev}. Rozhodni, jestli teplota ze zadání leží pod bodem tání, mezi oběma body, nebo nad bodem varu.`,
        `${velke(kotva.nazev)} má bod tání ${stupne(kotva.tani)} a bod varu ${stupne(kotva.var)}, takže ${verdikt}. Platí jednoduché pravidlo: pod bodem tání je látka pevná, mezi oběma body kapalná a nad bodem varu plynná. Projdi takhle i zbylé možnosti a hledej tu jedinou, u které teplota ze zadání padne doprostřed.`,
      ],
      solutionSteps: [
        "V závorce najdi bod tání a bod varu.",
        "Porovnej teplotu ze zadání s oběma čísly.",
        "Kapalná je látka jen mezi nimi.",
      ],
      explanation: `Látka je kapalná mezi svou teplotou tání a teplotou varu. ${velke(spravna.nazev)} taje při ${stupne(spravna.tani)} a vře při ${stupne(spravna.var)}. Teplota ${stupne(t)} leží mezi tím, takže skupenství nezáleží jen na látce, ale hlavně na teplotě.`,
    },
  );
}

function gen(level: number): PracticeTask[] {
  const out = new Map<string, PracticeTask>();
  for (let i = 0; i < 400 && out.size < 24; i++) {
    const t = level === 1 ? genL1() : level === 2 ? genL2() : genL3();
    out.set(klicUlohy(t), t);
  }
  return [...out.values()];
}

export const SKUPENSTVI_LATEK: TopicMetadata[] = [
  {
    id: "g6-fyz-skupenstvi-latek-6",
    rvpNodeId: "g6-fyzika-latky-a-telesa-vlastnosti-latek-skupenstvi-latek-pevne-kapalne-plynne",
    displayName: "Skupenství látek",
    title: "Skupenství látek – pevné, kapalné, plynné",
    studentTitle: "Pevné, kapalné, plynné",
    subject: "fyzika",
    category: "Látky a tělesa",
    topic: "Vlastnosti látek",
    briefDescription: "Rozliš tři skupenství a pojmenuj, co se děje při změně.",
    keywords: [
      "skupenství", "pevné", "kapalné", "plynné", "tání",
      "tuhnutí", "vypařování", "kapalnění", "teplota tání", "teplota varu",
    ],
    goals: [
      "Rozlišit pevné, kapalné a plynné skupenství podle tvaru a objemu.",
      "Pojmenovat tání, tuhnutí, vypařování a kapalnění v běžných dějích.",
      "Určit skupenství látky z její teploty tání a varu při dané teplotě.",
    ],
    boundaries: [
      "Sublimace a desublimace jsou nadstavba — do 6. ročníku nepatří.",
      "Bez částicového vysvětlení (atomy a molekuly mají vlastní téma).",
      "Bez výpočtů skupenského tepla a bez vlivu tlaku — všechny teploty platí za normálního tlaku.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: ["g6-fyz-mereni-teploty-6"],
    generator: gen,
    helpTemplate: {
      hint: "Pevná látka si drží tvar i objem, kapalina přejímá tvar nádoby a plyn vyplní celý prostor. Co je čím, rozhoduje teplota.",
      steps: [
        "Zeptej se: drží si látka tvar, jen objem, nebo ani jedno?",
        "U změny urči skupenství na začátku a na konci děje.",
        "Máš-li teplotu tání a varu, kapalná je látka jen mezi nimi.",
      ],
      commonMistake: "Brát skupenství jako trvalou vlastnost látky („kov je vždycky pevný“) místo stavu, který závisí na teplotě.",
      example: "Rtuť je kov, a přesto je při pokojové teplotě kapalná — taje totiž už při −39 °C.",
    },
  },
];
