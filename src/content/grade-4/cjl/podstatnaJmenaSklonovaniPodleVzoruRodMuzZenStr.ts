import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 4. ročníku). Úrovně L2 a L3 původně
// opakovaly úlohy ze dvou samostatných témat o vzorech (stejná slova,
// stejné otázky) a obsahovaly vymyšlené tvary („stavenís“). Toto téma
// teď drží to, co má v názvu a co vzory předchází: rod (s životností)
// a určení pádu a čísla. Vzory samotné procvičují navazující témata.
//
// L1 = rod běžného slova · L2 = rod záludných slov (tramvaj, den, kolega,
// zvíře) · L3 = pád a číslo tvaru ve větě, i u tvarů stejných ve více pádech.

type Rod = "mužský životný" | "mužský neživotný" | "ženský" | "střední";
const RODY: Rod[] = ["mužský životný", "mužský neživotný", "ženský", "střední"];
const UKAZ: Record<Rod, string> = { "mužský životný": "ten", "mužský neživotný": "ten", ženský: "ta", střední: "to" };

function rodUlohy(w: string, rod: Rod): PracticeTask {
  const spatne = RODY.filter((r) => r !== rod).map((r) => {
    let why: string;
    if (UKAZ[r] !== UKAZ[rod]) why = `Řekneme „${UKAZ[rod]} ${w}“, ne „${UKAZ[r]} ${w}“.`;
    else if (rod === "mužský životný") why = `„${w}“ je živá bytost, proto je rod mužský životný.`;
    else why = `„${w}“ není živá bytost, proto je rod mužský neživotný.`;
    return { value: r, why };
  }) as [{ value: string; why: string }, { value: string; why: string }, { value: string; why: string }];
  const muz = UKAZ[rod] === "ten";
  return choice(`Urči rod slova „${w}“.`, rod, spatne, {
    hints: [
      `Řekni před slovo „${w}“ ten, ta, nebo to. Co se hodí?`,
      `Zkus všechny tři: ten ${w}, ta ${w}, to ${w}. Jen jedno zní správně. Když se hodí „ten“, rozhodni ještě, jestli je ${w} živá bytost, nebo věc.`,
    ],
    explanation: `Řekneme „${UKAZ[rod]} ${w}“, proto je rod ${muz ? "mužský" : rod}${muz ? ` a ${w} ${rod === "mužský životný" ? "je živá bytost, tedy životný" : "je věc, tedy neživotný"}` : ""}.`,
  });
}

const L1: PracticeTask[] = ([
  ["vlak", "mužský neživotný"], ["kniha", "ženský"], ["město", "střední"], ["pes", "mužský životný"],
  ["okno", "střední"], ["řeka", "ženský"], ["kuře", "střední"], ["stůl", "mužský neživotný"],
  ["učitel", "mužský životný"], ["moře", "střední"], ["kost", "ženský"], ["hrnek", "mužský neživotný"],
  ["babička", "ženský"],
] as [string, Rod][]).map(([w, r]) => rodUlohy(w, r));

const L2: PracticeTask[] = ([
  ["tramvaj", "ženský"], ["den", "mužský neživotný"], ["noc", "ženský"], ["kámen", "mužský neživotný"],
  ["kolega", "mužský životný"], ["soudce", "mužský životný"], ["zvíře", "střední"], ["dítě", "střední"],
  ["myš", "ženský"], ["čaj", "mužský neživotný"], ["host", "mužský životný"], ["sůl", "ženský"],
  ["mládě", "střední"],
] as [string, Rod][]).map(([w, r]) => rodUlohy(w, r));

const OTAZKA: Record<number, string> = {
  1: "kdo? co?", 2: "koho? čeho?", 3: "komu? čemu?", 4: "koho? co?",
  5: "oslovujeme, voláme", 6: "o kom? o čem?", 7: "s kým? s čím?",
};
type Cislo = "jednotného" | "množného";
const nazev = (p: number, c: Cislo) => `${p}. pád ${c} čísla`;

function padUlohy(veta: string, slovo: string, pad: number, cislo: Cislo, spatne: [number, Cislo][]): PracticeTask {
  const pred = veta.slice(0, veta.indexOf(slovo)).trim() || "…";
  return choice(`Urči pád a číslo slova „${slovo}“ ve větě „${veta}“`, nazev(pad, cislo),
    spatne.map(([p, c]) => ({
      value: nazev(p, c),
      why: p !== pad
        ? `Na tvar „${slovo}“ se tu neptáme „${OTAZKA[p]}“, ale „${OTAZKA[pad]}“.`
        : `Pád sedí, ale „${slovo}“ je v ${cislo === "množného" ? "množném" : "jednotném"} čísle.`,
    })) as never, {
      hints: [
        `Od kterého slova se na „${slovo}“ zeptáš? Zkus pádové otázky.`,
        `Polož celou otázku: „${pred} …?“ Najdi ji v řadě kdo-co, koho-čeho, komu-čemu, koho-co, oslovení, o kom-o čem, s kým-s čím. Pak rozhodni, jestli jde o jednu věc, nebo o víc.`,
      ],
      explanation: `Ptáme se „${OTAZKA[pad]}“ a tvar „${slovo}“ je v ${cislo === "množného" ? "množném" : "jednotném"} čísle, proto ${nazev(pad, cislo)}.`,
    });
}

const L3: PracticeTask[] = [
  padUlohy("Napsala jsem dopis kamarádům.", "kamarádům", 3, "množného", [[3, "jednotného"], [6, "množného"], [2, "množného"]]),
  padUlohy("Bez klíče se domů nedostanu.", "klíče", 2, "jednotného", [[1, "množného"], [4, "množného"], [2, "množného"]]),
  padUlohy("Rádi si hrajeme se psy.", "psy", 7, "množného", [[4, "množného"], [7, "jednotného"], [6, "množného"]]),
  padUlohy("Mluvili jsme o prázdninách.", "prázdninách", 6, "množného", [[3, "množného"], [7, "množného"], [6, "jednotného"]]),
  padUlohy("Tatínek přinesl mamince květiny.", "mamince", 3, "jednotného", [[6, "jednotného"], [2, "jednotného"], [3, "množného"]]),
  padUlohy("Děti stavěly hrad z písku.", "písku", 2, "jednotného", [[3, "jednotného"], [6, "jednotného"], [4, "jednotného"]]),
  padUlohy("Petře, pojď sem!", "Petře", 5, "jednotného", [[1, "jednotného"], [6, "jednotného"], [3, "jednotného"]]),
  padUlohy("Ve třídě máme nové lavice.", "lavice", 4, "množného", [[1, "množného"], [2, "jednotného"], [4, "jednotného"]]),
  padUlohy("Kočka spala pod stolem.", "stolem", 7, "jednotného", [[6, "jednotného"], [3, "jednotného"], [7, "množného"]]),
  padUlohy("Babička vyprávěla o vlcích.", "vlcích", 6, "množného", [[3, "množného"], [7, "množného"], [2, "množného"]]),
  padUlohy("Na stromě sedí ptáci.", "ptáci", 1, "množného", [[4, "množného"], [5, "množného"], [1, "jednotného"]]),
  padUlohy("Zeptali jsme se paní učitelky.", "učitelky", 2, "jednotného", [[1, "množného"], [4, "množného"], [3, "jednotného"]]),
  padUlohy("Sešli jsme se s kamarády.", "kamarády", 7, "množného", [[4, "množného"], [1, "množného"], [7, "jednotného"]]),
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? L3 : level === 2 ? L2 : L1;
  return shuffle(pool);
}

export const PODSTATNAJMENASKLONOVANIPODLEVZORURODMUZZENSTR: TopicMetadata[] = [
  {
    id: "g4-cjl-jazykova-vychova-tvaroslovi-podstatna-jmena-sklonovani-podle-vzoru-rod-muz-zen-str",
    rvpNodeId: "g4-cjl-jazykova-vychova-tvaroslovi-podstatna-jmena-sklonovani-podle-vzoru-rod-muz-zen-str",
    displayName: "Skloňování jmen",
    title: "Podstatná jména - skloňování podle vzorů (rod muž., žen., stř.)",
    studentTitle: "Rody a pády",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Jazyková výchova",
    briefDescription: "Naučíš se určit rod podstatných jmen, pád a číslo ve větě.",
    keywords: ["rod", "životnost", "pád", "číslo", "podstatné jméno", "mužský", "ženský", "střední"],
    goals: [
      "Určit rod podstatného jména včetně životnosti",
      "Určit pád a číslo podstatného jména ve větě",
    ],
    boundaries: ["Bez přejatých slov s nestandardním skloňováním", "Vzory procvičují navazující témata"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: ["g4-cjl-jazykova-vychova-tvaroslovi-vzory-podstatnych-jmen-pan-hrad-muz-stroj-predseda-soudce"],
    generator: gen,
    helpTemplate: {
      hint: "Rod: ten=mužský, ta=ženský, to=střední; u mužského rozhodni životnost. Pád: polož pádovou otázku.",
      steps: [
        "Dosaď ten/ta/to před slovo.",
        "U mužského rodu: živá bytost → životný, věc → neživotný.",
        "Pád: polož od slovesa otázku (komu? s kým? …) a najdi ji v řadě pádů.",
        "Číslo: jedna věc → jednotné, víc → množné.",
      ],
      commonMistake: "Určovat pád podle koncovky — stejný tvar bývá ve více pádech (písku = 2., 3. i 6. pád), rozhodne otázka",
      example: "ten vlak (mužský neživotný); „Bez klíče“ — bez čeho? → 2. pád jednotného čísla",
    },
  },
];
