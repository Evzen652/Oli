import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "../_shared";

// Přepsáno 2026-09-11 (audit 3. ročníku). Úrovně byly překrývající se výřezy
// jednoho seznamu, nápověda byla u všech úloh stejná a možnosti obsahovaly
// nesmyslné tvary („Neurčitý", „ta pes"). Teď:
// L1 rod a číslo podstatného jména v jednotném čísle · L2 rod a číslo
// v množném čísle (slovo je potřeba převést na jedno) · L3 pád ve větě podle
// pádové otázky.

type Rod = "mužský" | "ženský" | "střední";
const UKAZ: Record<Rod, string> = { "mužský": "ten", "ženský": "ta", "střední": "to" };
const RODY: Rod[] = ["mužský", "ženský", "střední"];

// [tvar v úloze, tvar v jednotném čísle, rod]
const L1: [string, string, Rod][] = [
  ["pes", "pes", "mužský"], ["kočka", "kočka", "ženský"], ["okno", "okno", "střední"], ["strom", "strom", "mužský"],
  ["lampa", "lampa", "ženský"], ["auto", "auto", "střední"], ["hrad", "hrad", "mužský"], ["židle", "židle", "ženský"],
  ["město", "město", "střední"], ["stůl", "stůl", "mužský"], ["kniha", "kniha", "ženský"], ["jablko", "jablko", "střední"],
  ["kuře", "kuře", "střední"], ["řeka", "řeka", "ženský"],
];
const L2: [string, string, Rod][] = [
  ["stromy", "strom", "mužský"], ["kočky", "kočka", "ženský"], ["okna", "okno", "střední"], ["hrady", "hrad", "mužský"],
  ["lampy", "lampa", "ženský"], ["auta", "auto", "střední"], ["stoly", "stůl", "mužský"], ["knihy", "kniha", "ženský"],
  ["města", "město", "střední"], ["domy", "dům", "mužský"], ["řeky", "řeka", "ženský"], ["jablka", "jablko", "střední"],
  ["psi", "pes", "mužský"],
];

function rodCislo([tvar, sg, rod]: [string, string, Rod], mnozne: boolean): PracticeTask {
  const cislo = mnozne ? "množné" : "jednotné";
  const jine = mnozne ? "jednotné" : "množné";
  const T = (r: Rod, c: string) => `${r} rod, ${c} číslo`;
  const [r2, r3] = RODY.filter((r) => r !== rod);
  const distraktory: [Distractor, Distractor, Distractor] = [
    { value: T(rod, jine), why: `Rod sedí, ale „${tvar}“ je ${mnozne ? "víc věcí — číslo je množné" : "jedna věc — číslo je jednotné"}.` },
    { value: T(r2, cislo), why: `Neříkáme „${UKAZ[r2]} ${sg}“, ale „${UKAZ[rod]} ${sg}“.` },
    { value: T(r3, cislo), why: `Neříkáme „${UKAZ[r3]} ${sg}“, ale „${UKAZ[rod]} ${sg}“.` },
  ];
  return choice(`Urči rod a číslo podstatného jména „${tvar}“.`, T(rod, cislo), distraktory, {
    hints: [
      mnozne
        ? `Jak zní „${tvar}“, když je jen jedna věc? A hodí se k tomu ten, ta, nebo to?`
        : `Hodí se k „${tvar}“ ten, ta, nebo to? A jde o jednu věc, nebo o víc?`,
      "Rod poznáš podle toho, jestli se hodí ten, ta, nebo to. Pak se podívej, jestli jde o jednu věc, nebo o víc věcí; u víc věcí si slovo nejdřív převeď na jednu věc.",
    ],
    explanation: `Říkáme „${UKAZ[rod]} ${sg}“ — rod je ${rod}. ${mnozne ? `„${tvar}“ je víc věcí, proto množné číslo.` : "Jde o jednu věc, proto jednotné číslo."}`,
  });
}

const PADY = ["", "první pád", "druhý pád", "třetí pád", "čtvrtý pád", "pátý pád", "šestý pád", "sedmý pád"];
const OTAZKY = ["", "kdo? co?", "koho? čeho?", "komu? čemu?", "koho? co?", "oslovujeme", "o kom? o čem?", "s kým? s čím?"];
// Nejčastější záměny: 2 × 4 (koho?), 3 × 6 (stejná koncovka), 1 × 5 (jméno samo).
const ZAMENY: Record<number, [number, number, number]> = {
  1: [5, 4, 2], 2: [4, 1, 3], 3: [6, 4, 7], 4: [2, 1, 6], 5: [1, 4, 6], 6: [3, 7, 4], 7: [6, 3, 1],
};
// [věta, slovo, pád, otázka tak, jak ji dítě položí]
const L3: [string, string, number, string][] = [
  ["Pes běží po zahradě.", "Pes", 1, "Kdo běží po zahradě?"],
  ["Vidím velký strom.", "strom", 4, "Vidím koho? co?"],
  ["Dal jsem dárek mamince.", "mamince", 3, "Dal jsem dárek komu?"],
  ["Bez čepice je zima.", "čepice", 2, "Bez koho? bez čeho?"],
  ["Mluvili jsme o prázdninách.", "prázdninách", 6, "Mluvili jsme o čem?"],
  ["Šel jsem do kina s tátou.", "tátou", 7, "Šel jsem s kým?"],
  ["Petře, pojď sem!", "Petře", 5, "Koho oslovujeme?"],
  ["Na stole leží kniha.", "kniha", 1, "Co leží na stole?"],
  ["Nemám žádného psa.", "psa", 2, "Nemám koho? čeho?"],
  ["Pomáhám babičce.", "babičce", 3, "Pomáhám komu?"],
  ["Přemýšlím o kamarádovi.", "kamarádovi", 6, "Přemýšlím o kom?"],
  ["Kreslím tužkou.", "tužkou", 7, "Kreslím čím? S čím?"],
  ["Maminko, podívej!", "Maminko", 5, "Koho voláme?"],
  ["Mám rád jablka.", "jablka", 4, "Mám rád koho? co?"],
];

function pad([veta, slovo, p, otazka]: [string, string, number, string]): PracticeTask {
  const d = ZAMENY[p].map((q) => ({ value: PADY[q], why: `${PADY[q][0].toUpperCase()}${PADY[q].slice(1)} odpovídá na otázku ${OTAZKY[q]}; tady ale platí ${OTAZKY[p]}.` })) as [Distractor, Distractor, Distractor];
  return choice(`V jakém pádě je slovo „${slovo}“ ve větě „${veta}“?`, PADY[p], d, {
    hints: [
      `Jak se zeptáš na slovo „${slovo}“ ve větě „${veta}“?`,
      "Pádové otázky: 1. kdo? co?, 2. koho? čeho?, 3. komu? čemu?, 4. koho? co?, 5. oslovujeme, 6. o kom? o čem?, 7. s kým? s čím? Najdi tu, na kterou slovo ve větě odpovídá.",
    ],
    explanation: `${otazka} — „${slovo}“. Otázka ${OTAZKY[p]} patří k pádu: ${PADY[p]}.`,
  });
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return shuffle(L1).map((x) => rodCislo(x, false));
  if (level === 2) return shuffle(L2).map((x) => rodCislo(x, true));
  return shuffle(L3).map(pad);
}

export const PODSTATNAROD: TopicMetadata[] = [
  {
    id: "g3-cjl-podstatna-jmena-rod-cislo-pad",
    rvpNodeId: "g3-cjl-jazykova-vychova-tvaroslovi-podstatna-jmena-rod-cislo-pad-uvod",
    title: "Podstatná jména - rod, číslo, pád (úvod)",
    studentTitle: "Rod, číslo, pád",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Tvarosloví",
    briefDescription: "Určíš rod, číslo a pád podstatného jména.",
    keywords: ["podstatné jméno", "rod", "číslo", "pád", "mužský ženský střední", "jednotné množné"],
    goals: ["Určit rod podstatného jména (ten/ta/to).", "Rozlišit číslo jednotné a množné.", "Určit pád podstatného jména ve větě pomocí pádové otázky."],
    boundaries: ["Rod, číslo a pád podle otázek. Bez skloňování podle vzorů."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Rod: přidej ten/ta/to. Číslo: jedno nebo víc? Pád: zeptej se na otázku (kdo? co? koho? čeho? komu? čemu?).",
      steps: ["Rod: ten pes (M), ta kočka (Ž), to auto (S).", "Číslo: pes (jedn.) / psi (mn.).", "Pád: Kdo? = 1. / Koho-čeho? = 2. / Komu-čemu? = 3. / Koho-co? = 4."],
      commonMistake: "Záměna 2. a 4. pádu: obě otázky začínají „koho?“. Rozhodne druhá část — 2. pád koho? čeho?, 4. pád koho? co?",
      example: "kniha: ta → ženský rod, jedna → jednotné číslo, Vidím koho/co? knihu → 4. pád.",
    },
  },
];
