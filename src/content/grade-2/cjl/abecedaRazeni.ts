import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "@/content/grade-3/_shared";

// Přepsáno 2026-09-11 (inventura obsahu): původní banky měly po 8 úlohách,
// jednu nápovědu a žádnou zpětnou vazbu u chybných možností. Teď tři oddělené
// banky; nápovědy, vysvětlení i zpětná vazba se skládají z písmen konkrétní
// úlohy (kde se slova liší, co je před čím).
//   L1 rozpoznání: které písmeno je v abecedě hned za / hned před
//   L2 aplikace:   které slovo bude při řazení první / poslední (podle 1. písmene,
//                  pasti C/Č, S/Š, Z/Ž, R/Ř)
//   L3 transfer:   slova se stejným 1. písmenem (rozhoduje 2. písmeno), dvojpísmeno CH
//                  za H, a „které bude druhé / třetí“ (seřadit celé + spočítat)
//
// Úlohy se vyhýbají jemnostem, které 2. ročník neřeší: dlouhé samohlásky
// (á = a) ani Ď, Ť, Ň nikde nerozhodují a písmena Q, W, X se nezkoušejí.

/** Česká abeceda pro řazení; CH je jedno písmeno, háčkovaná souhláska stojí za svou dvojicí. */
const ABC = ["a", "b", "c", "č", "d", "e", "f", "g", "h", "ch", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "ř", "s", "š", "t", "u", "v", "w", "x", "y", "z", "ž"];
const ZAKLAD: Record<string, string> = { á: "a", é: "e", ě: "e", í: "i", ó: "o", ú: "u", ů: "u", ý: "y", ď: "d", ť: "t", ň: "n" };
const HACEK: Record<string, string> = { č: "c", ř: "r", š: "s", ž: "z" };

const up = (l: string) => l.toUpperCase();
const idx = (l: string) => ABC.indexOf(l.toLowerCase());

/** Rozloží slovo na písmena abecedy (CH jako jedno, dlouhé samohlásky jako krátké). */
function pismena(slovo: string): string[] {
  const s = slovo.toLowerCase();
  const out: string[] = [];
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "c" && s[i + 1] === "h") { out.push("ch"); i++; continue; }
    out.push(ZAKLAD[s[i]] ?? s[i]);
  }
  return out;
}

function porovnej(a: string, b: string): number {
  const pa = pismena(a), pb = pismena(b);
  for (let i = 0; i < Math.min(pa.length, pb.length); i++) {
    const d = idx(pa[i]) - idx(pb[i]);
    if (d !== 0) return d;
  }
  return pa.length - pb.length;
}

/** Kde se dvě slova poprvé liší: index písmene a obě písmena. */
function rozdil(a: string, b: string): { k: number; la: string; lb: string } {
  const pa = pismena(a), pb = pismena(b);
  let k = 0;
  while (k < pa.length && k < pb.length && pa[k] === pb[k]) k++;
  return { k, la: up(pa[k] ?? ""), lb: up(pb[k] ?? "") };
}

const PORADI = ["první", "druhé", "třetí", "čtvrté"];
const PORADI_7 = ["prvním", "druhým", "třetím", "čtvrtým"];
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

/** Upozornění na háčkovaná písmena a CH, která se mezi počátečními písmeny objevila. */
function pozor(prvni: string[]): string {
  const low = prvni.map((l) => l.toLowerCase());
  const casti: string[] = [];
  for (const l of low) {
    if (HACEK[l]) casti.push(`${up(l)} je samostatné písmeno a stojí hned za ${up(HACEK[l])}.`);
    if (l === "ch") casti.push("CH je jedno písmeno a v abecedě stojí až za H, ne u C.");
  }
  return [...new Set(casti)].join(" ");
}

// ── L1: písmeno hned za / hned před ──────────────────────────────────────
type Smer = "za" | "před";
// [směr, písmeno, správně, tři chybné]
const POOL_L1: [Smer, string, string, string, string, string][] = [
  ["za", "B", "C", "A", "D", "Č"],
  ["za", "C", "Č", "D", "B", "CH"],
  ["před", "D", "Č", "C", "E", "B"],
  ["za", "G", "H", "F", "CH", "I"],
  ["za", "H", "CH", "I", "G", "C"],
  ["před", "I", "CH", "H", "J", "C"],
  ["za", "J", "K", "I", "L", "H"],
  ["před", "L", "K", "M", "J", "CH"],
  ["za", "L", "M", "K", "N", "O"],
  ["před", "N", "M", "O", "L", "K"],
  ["za", "R", "Ř", "S", "P", "Š"],
  ["před", "S", "Ř", "R", "Š", "T"],
  ["za", "S", "Š", "T", "R", "Ž"],
  ["před", "T", "Š", "S", "U", "Ř"],
  ["za", "Z", "Ž", "Y", "Š", "X"],
  ["za", "Č", "D", "C", "E", "F"],
];

const usek = (od: number, doVcetne: number) => ABC.slice(Math.max(0, od), doVcetne + 1).map(up);

function pismeno([smer, x, a, ...chybne]: [Smer, string, string, string, string, string]): PracticeTask {
  const ix = idx(x);
  const why = (d: string): string => {
    const id = idx(d);
    // „je ještě Č“ × „jsou ještě C a Č“ — shoda s počtem písmen
    const mezi = (od: number, k: number) => {
      const p = ABC.slice(od + 1, k).map(up);
      return p.length === 1 ? `je ještě ${p[0]}` : `jsou ještě ${p.slice(0, -1).join(", ")} a ${p[p.length - 1]}`;
    };
    let t: string;
    if (smer === "za") {
      t = id < ix ? `${d} stojí v abecedě před ${x}, ne za ním.` : `${d} není hned za ${x} — mezi nimi ${mezi(ix, id)}.`;
    } else {
      t = id > ix ? `${d} stojí v abecedě za ${x}, ne před ním.` : `${d} není hned před ${x} — mezi nimi ${mezi(id, ix)}.`;
    }
    if (d === "CH") t += " CH se sice píše s C, ale v abecedě stojí až za H.";
    return t;
  };
  const vetaZa = `Kousek abecedy: ${usek(ix - 3, ix).join(", ")}, ? … Pokračuj o jedno písmeno dál.`;
  const vetaPred = `Kousek abecedy: ${usek(ix - 3, ix - 2).join(", ")}, ?, ${x}, ${up(ABC[ix + 1])} … Které písmeno patří do mezery?`;
  const d = chybne.map((v) => ({ value: v, why: why(v) })) as [Distractor, Distractor, Distractor];
  // Q, W, X děti v říkance abecedy skoro nepoužívají — odříkávat se začne o kus dřív.
  let start = Math.max(0, ix - (smer === "za" ? 2 : 3));
  while (["q", "w", "x"].includes(ABC[start]) && start > 0) start--;
  return {
    ...choice(`Které písmeno je v abecedě hned ${smer} písmenem ${x}?`, a, d, {
      hints: [
        smer === "za"
          ? `Řekni si abecedu od písmene ${up(ABC[start])} a zastav se u ${x}. Které písmeno řekneš hned potom?`
          : `Řekni si abecedu od písmene ${up(ABC[start])} až k ${x}. Které písmeno zazní těsně před ${x}?`,
        `${smer === "za" ? vetaZa : vetaPred} Pamatuj, že česká abeceda má i písmena s háčkem a dvojpísmeno CH.`,
      ],
      explanation: `V abecedě jdou po sobě písmena ${usek(ix - 2, ix + 2).join(", ")}. Hned ${smer} ${x} je proto ${a}.`,
    }),
    emoji: "🔤",
  };
}

// ── L2: první / poslední podle prvního písmene ────────────────────────────
// [otázka, "první" | "poslední", čtyři slova, správně]
const POOL_L2: [string, "první" | "poslední", [string, string, string, string], string][] = [
  ["Děti řadí jména spolužáků podle abecedy. Kdo bude první?", "první", ["Ema", "Dan", "Cyril", "Čeněk"], "Cyril"],
  ["Zvířata ze statku řadíme podle abecedy. Které bude první?", "první", ["kráva", "husa", "ovce", "prase"], "husa"],
  ["Ovoce z košíku seřadíš podle abecedy. Které bude poslední?", "poslední", ["jablko", "hruška", "švestka", "meruňka"], "švestka"],
  ["Hračky zapíšeš do seznamu podle abecedy. Která bude první?", "první", ["míč", "panenka", "kostky", "robot"], "kostky"],
  ["Barvy seřadíš podle abecedy. Která bude poslední?", "poslední", ["modrá", "zelená", "žlutá", "červená"], "žlutá"],
  ["Stromy z lesa seřadíš podle abecedy. Který bude první?", "první", ["smrk", "buk", "dub", "jedle"], "buk"],
  ["Zeleninu ze zahrádky seřadíš podle abecedy. Která bude poslední?", "poslední", ["cibule", "česnek", "mrkev", "hrách"], "mrkev"],
  ["Ptáky seřadíš podle abecedy. Který bude první?", "první", ["sova", "čáp", "vrabec", "kos"], "čáp"],
  ["Školní potřeby seřadíš podle abecedy. Která bude poslední?", "poslední", ["pravítko", "sešit", "tužka", "guma"], "tužka"],
  ["Oblečení seřadíš podle abecedy. Co bude první?", "první", ["tričko", "svetr", "bunda", "čepice"], "bunda"],
  ["Nádobí seřadíš podle abecedy. Co bude poslední?", "poslední", ["talíř", "hrnek", "lžíce", "šálek"], "talíř"],
  ["Květiny seřadíš podle abecedy. Která bude první?", "první", ["růže", "fialka", "sedmikráska", "pampeliška"], "fialka"],
  ["Dny v týdnu seřadíš podle abecedy. Který bude poslední?", "poslední", ["pondělí", "středa", "čtvrtek", "neděle"], "středa"],
  ["Města seřadíš podle abecedy. Které bude první?", "první", ["Praha", "Brno", "Ostrava", "Liberec"], "Brno"],
  ["Sporty seřadíš podle abecedy. Který bude poslední?", "poslední", ["fotbal", "hokej", "šachy", "tenis"], "tenis"],
  ["Zvířata v zoo seřadíš podle abecedy. Které bude první?", "první", ["slon", "žirafa", "lev", "zebra"], "lev"],
];

const prvniPismeno = (w: string) => up(pismena(w)[0]);

function prvniPosledni([q, pos, slova, a]: (typeof POOL_L2)[number]): PracticeTask {
  const prvni = pos === "první";
  const La = prvniPismeno(a);
  const pis = slova.map(prvniPismeno);
  const serazena = [...pis].sort((x, y) => idx(x) - idx(y));
  const d = slova.filter((w) => w !== a).map((w) => {
    const Lw = prvniPismeno(w);
    let why = prvni
      ? `„${w}“ začíná na ${Lw} a ${Lw} je v abecedě až za ${La}.`
      : `„${w}“ začíná na ${Lw} a ${Lw} je v abecedě ještě před ${La}.`;
    const h = HACEK[La.toLowerCase()] ?? HACEK[Lw.toLowerCase()];
    if (h && (h === La.toLowerCase() || h === Lw.toLowerCase())) why += " Písmeno s háčkem stojí až za písmenem bez háčku.";
    return { value: w, why };
  }) as [Distractor, Distractor, Distractor];
  const pozorText = pozor(pis);
  return {
    ...choice(q, a, d, {
      hints: [
        `Podívej se jen na první písmena: ${pis.join(", ")}. Které z nich je v abecedě ${prvni ? "nejdřív" : "nejpozději"}?`,
        `${prvni ? "Řekni si abecedu od začátku (A, B, C, Č, D…)" : "Řekni si abecedu od konce (Ž, Z, Y, X, W, V…)"} a zastav se u prvního z písmen ${pis.join(", ")}, na které narazíš. ${pozorText || "Na délce slova ani na dalších písmenech teď nezáleží."}`,
      ],
      explanation: `První písmena v pořadí abecedy: ${serazena.join(", ")}. ${prvni ? "Nejdřív" : "Nejpozději"} je ${La}, proto bude ${pos} „${a}“.`,
    }),
    emoji: "📋",
  };
}

// ── L3: rozhoduje další písmeno, CH, pořadí uprostřed ──────────────────────
// [otázka, pozice 0–3 (3 = poslední), čtyři slova, správně]
const POOL_L3: [string, number, [string, string, string, string], string][] = [
  ["Ve slovníku hledáš slova na M. Které bude první?", 0, ["míč", "máma", "most", "med"], "máma"],
  ["Slova na K seřadíš podle abecedy. Které bude poslední?", 3, ["kolo", "kuře", "kráva", "klíč"], "kuře"],
  ["Jména seřadíš podle abecedy. Které bude druhé?", 1, ["Pavel", "Petr", "Prokop", "Ivan"], "Pavel"],
  ["Potraviny seřadíš podle abecedy. Která bude poslední?", 3, ["cukr", "chleba", "hrách", "čaj"], "chleba"],
  ["Zvířata seřadíš podle abecedy. Které bude třetí?", 2, ["čáp", "husa", "chroust", "ježek"], "chroust"],
  ["Slova na S seřadíš podle abecedy. Které bude první?", 0, ["sova", "strom", "sýr", "slon"], "slon"],
  ["Ve slovníku hledáš slova na B. Které bude poslední?", 3, ["bota", "brambora", "babička", "buben"], "buben"],
  ["Slova na D seřadíš podle abecedy. Které bude první?", 0, ["dům", "deska", "drak", "dárek"], "dárek"],
  ["Jména na J seřadíš podle abecedy. Které bude poslední?", 3, ["Jana", "Jirka", "Josef", "Julie"], "Julie"],
  ["Slova s háčkem i bez něj seřadíš podle abecedy. Které bude druhé?", 1, ["řeka", "ruka", "sůl", "šála"], "řeka"],
  ["Zvířátka z pohádek seřadíš podle abecedy. Které bude třetí?", 2, ["kráva", "koza", "liška", "pes"], "liška"],
  ["Ovoce seřadíš podle abecedy. Které bude druhé?", 1, ["citron", "banán", "borůvka", "meruňka"], "borůvka"],
  ["Věci ve třídě seřadíš podle abecedy. Která bude poslední?", 3, ["tabule", "tužka", "sešit", "křída"], "tužka"],
  ["Slova na Z a Ž seřadíš podle abecedy. Které bude první?", 0, ["žába", "zub", "zajíc", "želva"], "zajíc"],
  ["Slova na H a CH seřadíš podle abecedy. Které bude poslední?", 3, ["hora", "chata", "hrad", "husa"], "chata"],
];

const nazevPozice = (p: number) => (p === 3 ? "poslední" : PORADI[p]);

function razeni([q, p, slova, a]: (typeof POOL_L3)[number]): PracticeTask {
  const serazena = [...slova].sort(porovnej);
  const pis = slova.map(prvniPismeno);
  const druha = slova.map((w) => up(pismena(w)[1] ?? ""));
  const stejnePrvni = new Set(pis).size === 1;
  const pozice = nazevPozice(p);

  const d = slova.filter((w) => w !== a).map((w) => {
    const { k, la, lb } = rozdil(a, w);
    const pw = serazena.indexOf(w);
    const kde = pw === 3 ? "čtvrté, tedy poslední" : PORADI[pw];
    return {
      value: w,
      why: `„${w}“ bude po seřazení ${kde}. Od slova „${a}“ se liší ${PORADI_7[k]} písmenem: ${lb} je v abecedě ${idx(lb) < idx(la) ? "před" : "za"} ${la}.`,
    };
  }) as [Distractor, Distractor, Distractor];

  const pozorText = pozor(pis);
  const nekteraStejne = !stejnePrvni && new Set(pis).size < pis.length;
  const h0 = stejnePrvni
    ? `Všechna slova začínají na ${pis[0]}. Podle kterého písmene je seřadíš? Hledáš ${pozice} slovo.`
    : nekteraStejne
      ? `Začni prvními písmeny slov: ${pis.join(", ")}. Která slova začínají stejně?`
      : `První písmena jsou ${pis.join(", ")} — každé je jiné. Stačí je seřadit, pak najdi ${pozice} slovo.`;
  const h1 = stejnePrvni
    ? `Protože první písmeno je u všech stejné, porovnej druhá písmena: ${druha.join(", ")}. Seřaď je podle abecedy a pak najdi ${pozice} slovo.`
    : nekteraStejne
      ? `Nejdřív seřaď slova podle prvních písmen (${pis.join(", ")}). Slova se stejným prvním písmenem pak porovnej podle druhého písmene. ${pozorText} Nakonec spočítej, které slovo je ${pozice}.`
      : `Seřaď první písmena ${pis.join(", ")} podle abecedy. ${pozorText} Pak spočítej, které slovo je ${pozice}.`;

  // Rozhodlo u některé sousední dvojice až druhé písmeno?
  const druheRozhodlo = serazena.slice(1).some((w, i) => rozdil(serazena[i], w).k > 0);
  const pozn = [
    stejnePrvni ? "Protože všechna slova začínají stejně, rozhodlo až druhé písmeno." : "",
    pis.some((l) => l === "CH") ? "CH je jedno písmeno a stojí až za H." : "",
    !stejnePrvni && druheRozhodlo ? "U slov se stejným prvním písmenem rozhodlo druhé písmeno." : "",
  ].filter(Boolean).join(" ");

  return {
    ...choice(q, a, d, {
      hints: [h0, h1.replace(/\s+/g, " ").trim()],
      explanation: `Po seřazení: ${serazena.join(", ")}. ${cap(pozice)} je proto „${a}“.${pozn ? " " + pozn : ""}`,
    }),
    emoji: "📚",
  };
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return shuffle(POOL_L1).map(pismeno);
  if (level === 2) return shuffle(POOL_L2).map(prvniPosledni);
  return shuffle(POOL_L3).map(razeni);
}

export const ABECEDAAZENI: TopicMetadata[] = [
  {
    id: "g2-cjl-jazykova-vychova-tvaroslovi-abeceda-a-razeni",
    rvpNodeId: "g2-cjl-jazykova-vychova-tvaroslovi-abeceda-a-razeni",
    title: "Abeceda a řazení",
    studentTitle: "Abeceda od A do Z",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Tvarosloví",
    briefDescription: "Naučíš se pořadí písmen v abecedě a jak řadit slova.",
    keywords: ["abeceda", "řazení", "slovník", "pořadí písmen", "abecedně"],
    goals: [
      "Znát pořadí písmen v abecedě.",
      "Seřadit slova abecedně podle prvního písmene.",
      "Vědět, jak funguje slovník a abecední řazení.",
    ],
    boundaries: ["Řazení podle prvního (případně druhého) písmene.", "Bez složitého řazení."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Abeceda: A, B, C, Č, D, E, F, G, H, CH, I, J, K, L, M, N, O, P, Q, R, Ř, S, Š, T, U, V, W, X, Y, Z, Ž.",
      steps: ["Podívej se na první písmeno slova.", "Najdi ho v abecedě.", "Dřívější písmeno = slovo patří dříve."],
      commonMistake: "Řazení podle délky slova místo abecedy — vždy porovnáváme písmena, ne délku.",
      example: "auto, bok, dům — A je před B, B je před D → pořadí: auto, bok, dům.",
    },
  },
];
