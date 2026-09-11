import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { parovani, type Dvojice } from "../_shared";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// vysvětlení a na úrovni se opakovalo jen pár pevných sad. Teď banka dvojic:
// L1 mozek a smyslové orgány, L2 mícha, nervy, reflex a části oka a ucha,
// L3 jemnější stavba smyslů.

const DVOJICE: Dvojice[] = [
  { uroven: 1, levy: "mozek", pravy: "řídí činnost celého těla",
    proc: "Mozek je uložený v lebce a přijímá zprávy ze všech smyslů." },
  { uroven: 1, levy: "oko", pravy: "smyslový orgán zraku",
    proc: "Oko zachytí světlo a mozek z něj složí obraz." },
  { uroven: 1, levy: "ucho", pravy: "smyslový orgán sluchu",
    proc: "Ucho zachytí zvuk a vnitřní ucho ho promění ve vzruchy pro mozek." },
  { uroven: 1, levy: "nos", pravy: "smyslový orgán čichu",
    proc: "Čichové buňky jsou vysoko v nosní dutině." },
  { uroven: 1, levy: "jazyk", pravy: "smyslový orgán chuti",
    proc: "Jazyk rozezná sladké, slané, kyselé, hořké i umami." },
  { uroven: 1, levy: "kůže", pravy: "smyslový orgán hmatu",
    proc: "Kůže cítí dotek, tlak, teplo, chlad i bolest." },

  { uroven: 2, levy: "mícha", pravy: "je uložená v páteři a spojuje mozek s nervy",
    proc: "Míchou běží zprávy mezi mozkem a zbytkem těla." },
  { uroven: 2, levy: "nervy", pravy: "vlákna, která vedou vzruchy po těle",
    proc: "Nervy vedou zprávy od smyslů k mozku a pokyny od mozku ke svalům." },
  { uroven: 2, levy: "reflex", pravy: "rychlá odpověď těla bez přemýšlení",
    proc: "Když sáhneš na horký hrnec, ucukneš dřív, než si to uvědomíš." },
  { uroven: 2, levy: "zornice", pravy: "otvor v oku, který se na světle zužuje",
    proc: "Zornice se ve tmě rozšíří, aby do oka propustila víc světla." },
  { uroven: 2, levy: "sítnice", pravy: "vrstva uvnitř oka, na kterou dopadá obraz",
    proc: "Buňky sítnice promění světlo ve vzruchy, které jdou do mozku." },
  { uroven: 2, levy: "mozeček", pravy: "řídí souhru a přesnost pohybů",
    proc: "Díky mozečku trefíš míč nebo jezdíš na kole bez zaváhání." },
  { uroven: 2, levy: "bubínek", pravy: "blána v uchu, kterou rozechvěje zvuk",
    proc: "Chvění bubínku přenesou drobné kůstky dál do vnitřního ucha." },

  { uroven: 3, levy: "velký mozek", pravy: "část mozku, kterou myslíme a pamatujeme si",
    proc: "Povrch velkého mozku, mozková kůra, je zvrásněný, aby se do lebky vešel." },
  { uroven: 3, levy: "čočka", pravy: "průhledná část oka, která zaostřuje",
    proc: "Čočka mění tvar podle toho, jestli se díváme na blízko, nebo na dálku." },
  { uroven: 3, levy: "hlemýžď", pravy: "stočená část vnitřního ucha, kde vznikají sluchové vzruchy",
    proc: "Je stočený jako ulita hlemýždě, proto nese jeho jméno." },
  { uroven: 3, levy: "rovnovážné ústrojí", pravy: "část vnitřního ucha, která hlídá polohu těla",
    proc: "Když se dlouho točíš, tekutina v něm ještě chvíli krouží — proto se ti točí hlava." },
  { uroven: 3, levy: "chuťové pohárky", pravy: "drobné buňky na jazyku, které rozlišují chutě",
    proc: "Pohárků máme na jazyku tisíce." },
  { uroven: 3, levy: "slepá skvrna", pravy: "místo na sítnici, kde oko nic nevidí",
    proc: "Z tohoto místa odchází zrakový nerv; mozek díru v obrazu doplní." },
];

function gen(level: number): PracticeTask[] {
  return parovani(DVOJICE, level, "Spoj část nervové soustavy nebo smyslu s tím, co dělá.");
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
        "Velký mozek: myšlení, paměť, řeč.",
        "Mozeček: rovnováha, koordinace.",
        "Mozkový kmen: dýchání, tep (automatické).",
        "Smysly: oko (světlo), ucho (zvuk), nos (vůně), jazyk (chuť), kůže (dotek).",
        "Reflex: rychlá reakce bez vědomé kontroly.",
      ],
      commonMistake: "Reflex probíhá v míše (míšní oblouk) – mozek je informován až dodatečně.",
      example: "Dotkneš se horké plotny → reflex okamžitě stáhne ruku → teprve pak cítíš bolest.",
    },
  },
];
