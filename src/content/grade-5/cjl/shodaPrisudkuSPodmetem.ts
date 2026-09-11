import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pick, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 5. ročníku). Pevné věty obsahovaly chyby
// („plávaly“, „Slepice a kohouti ___ kokrhali.“ s přísudkem dvakrát, cyrilské
// „о“ v „páslо“), nápověda radila „strom“ jako mužský životný a úlohy neměly
// vysvětlení ani zpětnou vazbu k chybné koncovce. Teď se věty skládají
// z banky podmětů s určeným rodem a sloves, která k nim významem sedí;
// koncovka i zpětná vazba se odvozují z pravidla shody.
// L1 podmět rodu mužského životného nebo ženského · L2 zrádné rody (mužský
// neživotný, střední, „děti“, „rodiče“) · L3 několikanásobný podmět, i s přísudkem před podmětem.

type Rod = "mž" | "mn" | "ž" | "s";
interface Podmet { slovo: string; rod: Rod; zradny?: string }
interface Scena { podmety: Podmet[]; slovesa: [string, string][] }

const KONCOVKA: Record<Rod, string> = { mž: "i", mn: "y", ž: "y", s: "a" };
const ROD_TEXT: Record<Rod, string> = {
  mž: "rodu mužského životného",
  mn: "rodu mužského neživotného",
  ž: "rodu ženského",
  s: "rodu středního",
};

// Příklady v nápovědě („ti páni, ty ženy, ty hrady, ta města“) v bance záměrně nejsou.
const SCENY: Scena[] = [
  {
    podmety: [
      { slovo: "chlapci", rod: "mž" }, { slovo: "žáci", rod: "mž" }, { slovo: "bratři", rod: "mž" },
      { slovo: "sousedé", rod: "mž" }, { slovo: "turisté", rod: "mž" },
      { slovo: "rodiče", rod: "mž", zradny: "Slovo „rodiče“ je rodu mužského životného (ti rodiče), i když mezi rodiči je i maminka." },
      { slovo: "dívky", rod: "ž" }, { slovo: "sestry", rod: "ž" }, { slovo: "babičky", rod: "ž" },
      { slovo: "učitelky", rod: "ž" }, { slovo: "kamarádky", rod: "ž" },
      { slovo: "děti", rod: "ž", zradny: "Slovo „děti“ se v množném čísle chová jako rod ženský (ty děti), proto má přísudek -y." },
    ],
    slovesa: [["přišl", " na oslavu"], ["zpíval", " koledy"], ["čekal", " na autobus"], ["odjel", " na výlet"], ["tančil", " na plese"], ["jedl", " oběd"]],
  },
  {
    podmety: [
      { slovo: "psi", rod: "mž" }, { slovo: "koně", rod: "mž" }, { slovo: "králíci", rod: "mž" }, { slovo: "kohouti", rod: "mž" },
      { slovo: "kočky", rod: "ž" }, { slovo: "slepice", rod: "ž" }, { slovo: "kozy", rod: "ž" }, { slovo: "krávy", rod: "ž" },
      { slovo: "kuřata", rod: "s" }, { slovo: "telata", rod: "s" }, { slovo: "štěňata", rod: "s" }, { slovo: "koťata", rod: "s" },
    ],
    slovesa: [["běhal", " po dvoře"], ["pil", " vodu"], ["odpočíval", " ve stínu"], ["pobíhal", " po louce"], ["spal", " ve chlévě"]],
  },
  {
    podmety: [
      { slovo: "kameny", rod: "mn" }, { slovo: "listy", rod: "mn" }, { slovo: "klacky", rod: "mn" }, { slovo: "ořechy", rod: "mn" },
      { slovo: "větve", rod: "ž" }, { slovo: "šišky", rod: "ž" }, { slovo: "hrušky", rod: "ž" },
      { slovo: "jablka", rod: "s" }, { slovo: "polena", rod: "s" }, { slovo: "kolečka", rod: "s" },
    ],
    slovesa: [["ležel", " u cesty"], ["zůstal", " na zahradě"], ["padal", " na zem"]],
  },
];

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
const PREDLOZKA = /^ (do|na|po|v|ve|z|ze|k|ke|u|nad|pod|přes|kolem|za) /;

function ulohaProJeden(p: Podmet, [kmen, zbytek]: [string, string]): PracticeTask {
  const e = KONCOVKA[p.rod];
  const tvar = kmen + e;
  const options = ["i", "y", "a", "o"].map((k) => kmen + k);
  const kontext = p.zradny ?? `„${cap(p.slovo)}“ je ${ROD_TEXT[p.rod]}.`;
  const proc: Record<string, string> = {
    i: `Koncovku -i má přísudek jen u podmětu rodu mužského životného (ti páni). ${kontext}`,
    y: `Koncovka -y patří k podmětu rodu ženského nebo mužského neživotného (ty ženy, ty hrady). ${kontext}`,
    a: `Koncovka -a patří k podmětu rodu středního v množném čísle (ta města). ${kontext}`,
    o: `Tvar na -lo patří k jednomu podmětu středního rodu (to město stálo); podmět je tu v množném čísle.`,
  };
  const optionFeedback: Record<string, string> = {};
  for (const k of ["i", "y", "a", "o"]) if (k !== e) optionFeedback[kmen + k] = proc[k];
  return {
    question: `Doplň správný tvar slovesa: „${cap(p.slovo)} ___${zbytek}.“`,
    correctAnswer: tvar,
    options: shuffle(options),
    blanks: [tvar],
    optionFeedback,
    hints: [
      `Najdi podmět ve větě „${cap(p.slovo)} …${zbytek}“. Jakého rodu je slovo „${p.slovo}“?`,
      `Řekni si před podmět ukazovací zájmeno ti, ty, nebo ta a vyber, které se k „${p.slovo}“ hodí. Ti páni → -i, ty ženy i ty hrady → -y, ta města → -a.`,
    ],
    explanation: `${p.zradny ? p.zradny + " " : `Podmět „${p.slovo}“ je ${ROD_TEXT[p.rod]}, proto má přísudek koncovku -${e}. `}Správně: ${cap(p.slovo)} ${tvar}${zbytek}.`,
  };
}

function ulohaProDva(a: Podmet, b: Podmet, [kmen, zbytek]: [string, string]): PracticeTask {
  const e = a.rod === "mž" || b.rod === "mž" ? "i" : a.rod === "s" && b.rod === "s" ? "a" : "y";
  const tvar = kmen + e;
  const duvod = e === "i"
    ? `„${a.rod === "mž" ? a.slovo : b.slovo}“ je rodu mužského životného a jedno takové jméno stačí na -i.`
    : `Žádný z podmětů není rodu mužského životného; „${a.slovo}“ je ${ROD_TEXT[a.rod]} a „${b.slovo}“ ${ROD_TEXT[b.rod]}, proto -y.`;
  const obrat = PREDLOZKA.test(zbytek) && Math.random() < 0.5;
  const veta = obrat
    ? `${cap(zbytek.trim())} ___ ${a.slovo} a ${b.slovo}.`
    : `${cap(a.slovo)} a ${b.slovo} ___${zbytek}.`;
  const spravne = obrat ? `${cap(zbytek.trim())} ${tvar} ${a.slovo} a ${b.slovo}.` : `${cap(a.slovo)} a ${b.slovo} ${tvar}${zbytek}.`;
  const options = ["i", "y", "a", "o"].map((k) => kmen + k);
  const optionFeedback: Record<string, string> = {};
  const proc: Record<string, string> = {
    i: `Koncovka -i by platila, jen kdyby byl aspoň jeden podmět rodu mužského životného. ${duvod}`,
    y: `Koncovka -y platí, když žádný podmět není rodu mužského životného a nejsou všechny rodu středního. ${duvod}`,
    a: `Koncovka -a platí, jen když jsou všechny podměty rodu středního. ${duvod}`,
    o: "Tvar na -lo patří k jednomu podmětu středního rodu; tady jsou podměty dva.",
  };
  for (const k of ["i", "y", "a", "o"]) if (k !== e) optionFeedback[kmen + k] = proc[k];
  return {
    question: `Doplň správný tvar slovesa: „${veta}“`,
    correctAnswer: tvar,
    options: shuffle(options),
    blanks: [tvar],
    optionFeedback,
    hints: [
      `Ve větě „${veta}“ jsou dva podměty: „${a.slovo}“ a „${b.slovo}“. Je mezi nimi jméno rodu mužského životného?`,
      `Stačí jedno jméno rodu mužského životného a přísudek má -i. Když žádné takové není, píšeme -y; koncovku -a jen tehdy, když jsou obě jména rodu středního. Urči rod „${a.slovo}“ i „${b.slovo}“.`,
    ],
    explanation: `${duvod} Správně: ${spravne}`,
  };
}

function gen(level: number): PracticeTask[] {
  const out = new Map<string, PracticeTask>();
  for (let i = 0; i < 400 && out.size < 40; i++) {
    const sc = pick(SCENY);
    let t: PracticeTask | null = null;
    if (level === 1) {
      const kandidati = sc.podmety.filter((p) => (p.rod === "mž" || p.rod === "ž") && !p.zradny);
      if (kandidati.length) t = ulohaProJeden(pick(kandidati), pick(sc.slovesa));
    } else if (level === 2) {
      const kandidati = sc.podmety.filter((p) => p.rod === "mn" || p.rod === "s" || p.zradny);
      if (kandidati.length) t = ulohaProJeden(pick(kandidati), pick(sc.slovesa));
    } else {
      const [a, b] = shuffle(sc.podmety).slice(0, 2);
      if (a.rod !== b.rod) t = ulohaProDva(a, b, pick(sc.slovesa));
    }
    if (t && !out.has(t.question)) out.set(t.question, t);
  }
  return [...out.values()];
}

export const SHODAPRISUDKUSPODMETEM: TopicMetadata[] = [
  {
    id: "g5-cjl-jazykova-vychova-skladba-shoda-prisudku-s-podmetem",
    rvpNodeId: "g5-cjl-jazykova-vychova-skladba-shoda-prisudku-s-podmetem",
    title: "Shoda přísudku s podmětem",
    studentTitle: "Shoda přísudku s podmětem",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Skladba",
    briefDescription: "Procvičíš správné koncovky sloves – hráli, nebo hrály.",
    keywords: ["shoda přísudku", "podmět", "rod", "hráli hrály", "koncovky sloves"],
    goals: [
      "Doplnit správnou koncovku přísudku podle rodu a čísla podmětu",
      "Rozlišit mužský životný od ostatních rodů",
      "Správně určit shodu při několikanásobném podmětu",
    ],
    boundaries: [
      "Neprobíráme složité větné vzorce",
      "Bez historické gramatiky",
    ],
    gradeRange: [5, 5],
    inputType: "fill_blank",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Najdi podmět a zjisti jeho rod. Mužský životný → -i. Ženský a mužský neživotný → -y. Střední rod → -a.",
      steps: [
        "Najdi podmět ve větě.",
        "Zjisti rod podmětu: je mužský životný (chlapec, pes), nebo neživotný (strom)?",
        "Mužský životný → přísudek s -i (hráli, přišli).",
        "Ženský a mužský neživotný → -y (hrály, padaly); střední rod → -a (kuřata běhala).",
        "Při několikanásobném podmětu: stačí jeden mužský životný → -i.",
      ],
      commonMistake: "Žáci zaměňují mužský životný s mužským neživotným (stromy, kameny → hrály, ne hráli).",
      example: "Chlapci hráli (mužský životný → -i). Dívky hrály (ženský → -y). Stromy padaly (mužský neživotný → -y).",
    },
  },
];
