/**
 * Čeština 6. ročník — Podstatná jména: skloňování, mluvnické kategorie
 * (rod, číslo, pád, vzor). select_one v celém tématu.
 *
 * Vzor se určuje podle RODU, zakončení v 1. pádě a tam, kde to nestačí
 * (kost/píseň, moře/kuře), podle 2. pádu. Samotné zakončení bez rodu klame —
 * to je hlavní chyba, kterou téma cílí (hrdina, houslista jsou mužského rodu,
 * i když končí na -a, proto vzor předseda, ne žena; průvodce, správce jsou
 * mužského rodu, i když končí na -ce). Každé podstatné jméno stojí ve VĚTĚ, aby pád i význam určoval kontext.
 *
 *  • L1 — rozcvička ze 4./5. ročníku: rozpoznání JEDNÉ kategorie (pád, rod,
 *    nebo číslo) u běžného, jednoznačného slova. Šablony se rovnoměrně střídají.
 *  • L2 — (a) vzor u slov, kde klame zakončení (hrdina, houslista → předseda;
 *    průvodce, zachránce → soudce; paměť, řeč → kost; báseň, dlaň → píseň;
 *    štěně → kuře; pole → moře); (b) úplné určení (rod, číslo, pád, vzor)
 *    v jedné možnosti — tři distraktory se liší vždy v jediné kategorii.
 *  • L3 — přenos: (a) inverze — z ohnutého tvaru urči 1. pád a vzor;
 *    (b) tvarová homonymie — stejný tvar je ve větách jiný pád/číslo, rozhodne
 *    kontext (sloveso, číslovka, zájmeno „všechny“); (c) číslo u pomnožných
 *    jmen (dveře, kalhoty, nůžky, brýle, housle) — gramatické číslo je vždy
 *    množné bez ohledu na skutečný počet kusů.
 *
 * Nezávislé ověření: viz test tématu (src/content/grade-6/__tests__), kde je
 * samostatná tabulka lemmat a vazeb předložka/sloveso → pád, oddělená od téhle
 * generátorové logiky.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildChoiceTask as choice, pick, ruzneUlohy, losUlohy, type Distractor } from "./_shared";

function must(t: PracticeTask | null): PracticeTask {
  if (!t) throw new Error("buildChoiceTask vrátil null pro staticky zadanou úlohu — zkontroluj distraktory.");
  return t;
}

// ── Společné mapy pádů ───────────────────────────────────────────────────
const NAZEV_PAD: Record<number, string> = {
  1: "1. pád", 2: "2. pád", 3: "3. pád", 4: "4. pád", 6: "6. pád", 7: "7. pád",
};
const OTAZKA_PAD: Record<number, string> = {
  1: "kdo, co", 2: "koho, čeho", 3: "komu, čemu", 4: "koho, co", 6: "o kom, o čem", 7: "kým, čím",
};

// ============================================================
// L1 — rozpoznání JEDNÉ kategorie (pád / rod / číslo)
// ============================================================

// (a) Pád — otázka od slovesa nebo předložky rozhoduje.
function padUloha(
  veta: string,
  otazka: string,
  spravny: number,
  distr: number[],
  whyOverride: Record<number, string> = {},
): PracticeTask {
  return must(choice(
    `Urči pád podstatného jména ve větě: „${veta}“`,
    NAZEV_PAD[spravny],
    distr.map((d) => ({
      value: NAZEV_PAD[d],
      why: whyOverride[d] ?? `${NAZEV_PAD[d]} odpovídá na otázku „${OTAZKA_PAD[d]}?“. Tahle věta se ale ptá: „${otazka}?“`,
    })),
    {
      hints: [
        `Najdi ve větě sloveso (případně předložku) a zeptej se od něj: „${otazka}?“`,
        `Ke každému pádu patří otázka: 1. kdo/co, 2. koho/čeho, 3. komu/čemu, 4. koho/co, 6. o kom/o čem, 7. kým/čím. Předložka napoví, ale sama nerozhoduje (třeba „na“ může být „na co?“ i „na čem?“) — rozhoduje otázka. Porovnej to s otázkou „${otazka}?“.`,
      ],
      explanation: `Na otázku „${otazka}?“ odpovídá ${NAZEV_PAD[spravny]} (${OTAZKA_PAD[spravny]}?).`,
    },
  ));
}

const L1_PAD: PracticeTask[] = [
  padUloha("Ema dala dárek BABIČCE.", "Komu Ema dala dárek", 3, [1, 4, 2]),
  padUloha("Táta opravil starý PLOT.", "Co táta opravil", 4, [1, 2, 7], {
    1: "Otázka „co?“ patří k 1. i ke 4. pádu, rozhoduje role slova. Plot tu nic nedělá, opravuje ho táta — plot je předmět slovesa, proto 4. pád. 1. pád by to byl, kdyby plot sám něco dělal (byl podmětem).",
  }),
  padUloha("Bez DEŠTĚ by úroda uschla.", "Bez čeho by úroda uschla", 2, [3, 4, 6]),
  padUloha("Mluvili jsme o novém FILMU.", "O čem jsme mluvili", 6, [2, 4, 7]),
  padUloha("Jeli jsme na výlet VLAKEM.", "Čím jsme jeli na výlet", 7, [2, 3, 4]),
  padUloha("Na stole ležela otevřená KNIHA.", "Co leželo na stole", 1, [4, 2, 7], {
    4: "Otázka „co?“ patří k 1. i ke 4. pádu, rozhoduje role slova. Kniha tu sama leží — je podmětem věty (co leželo?), proto 1. pád. 4. pád by to byl, kdyby s knihou někdo něco dělal (četl knihu).",
  }),
  padUloha("Poděkovali jsme TRENÉROVI.", "Komu jsme poděkovali", 3, [1, 4, 7]),
  padUloha("Petr pozval na oslavu KAMARÁDA.", "Koho Petr pozval na oslavu", 4, [1, 3, 7]),
];

// (b) Rod (u mužského i životnost).
function rodUloha(veta: string, spravny: string, distrWhy: Record<string, string>, explanation: string): PracticeTask {
  const vsechny = ["mužský rod životný", "mužský rod neživotný", "ženský rod", "střední rod"];
  const distraktory: Distractor[] = vsechny
    .filter((r) => r !== spravny)
    .map((r) => ({ value: r, why: distrWhy[r] }));
  return must(choice(
    `Urči rod podstatného jména ve větě: „${veta}“`,
    spravny,
    distraktory,
    {
      hints: [
        "Zkus před slovo doplnit „ten“, „ta“, nebo „to“ – prozradí to rod. U mužského rodu ještě rozhodni, jestli jde o člověka či zvíře, nebo o věc, rostlinu či jev.",
        `Ukazovací zájmeno napoví: „ten“ = mužský (u lidí a zvířat rod životný, u věcí, rostlin a jevů neživotný), „ta“ = ženský, „to“ = střední. Vyzkoušej to na větě: „${veta}“`,
      ],
      explanation,
    },
  ));
}

const L1_ROD: PracticeTask[] = [
  rodUloha("Na zahradě štěká PES.", "mužský rod životný", {
    "mužský rod neživotný": "Pes je živý tvor (dá se zeptat „kdo?“), proto mužský rod životný, ne neživotný.",
    "ženský rod": "Řekli bychom „ten pes“, ne „ta pes“ — to je mužský rod, ne ženský.",
    "střední rod": "Řekli bychom „ten pes“, ne „to pes“ — to je mužský rod, ne střední.",
  }, "Řekneme „ten pes“ (mužský rod) a pes je živý tvor, proto mužský rod životný."),
  rodUloha("Do třídy vešel přísný UČITEL.", "mužský rod životný", {
    "mužský rod neživotný": "Učitel je člověk, tedy živá bytost, proto mužský rod životný, ne neživotný.",
    "ženský rod": "Řekli bychom „ten učitel“, ne „ta učitel“ — to je mužský rod.",
    "střední rod": "Řekli bychom „ten učitel“, ne „to učitel“ — to je mužský rod.",
  }, "Řekneme „ten učitel“ (mužský rod) a učitel je člověk, proto mužský rod životný."),
  rodUloha("Před domem roste starý STROM.", "mužský rod neživotný", {
    "mužský rod životný": "Strom je rostlina, ne živočich — v mluvnici se životnost týká jen živočichů, proto neživotný.",
    "ženský rod": "Řekli bychom „ten strom“, ne „ta strom“ — to je mužský rod.",
    "střední rod": "Řekli bychom „ten strom“, ne „to strom“ — to je mužský rod.",
  }, "Řekneme „ten strom“ (mužský rod). Strom je rostlina, ne živočich, proto mužský rod neživotný."),
  rodUloha("Na výstavě visel krásný OBRAZ.", "mužský rod neživotný", {
    "mužský rod životný": "Obraz je věc, ne živý tvor, proto mužský rod neživotný, ne životný.",
    "ženský rod": "Řekli bychom „ten obraz“, ne „ta obraz“ — to je mužský rod.",
    "střední rod": "Řekli bychom „ten obraz“, ne „to obraz“ — to je mužský rod.",
  }, "Řekneme „ten obraz“ (mužský rod). Obraz je věc, proto mužský rod neživotný."),
  rodUloha("Na gauči spala černá KOČKA.", "ženský rod", {
    "mužský rod životný": "Řekli bychom „ta kočka“, ne „ten kočka“ — to je ženský rod, ne mužský.",
    "mužský rod neživotný": "Řekli bychom „ta kočka“, ne „ten kočka“ — to je ženský rod.",
    "střední rod": "Řekli bychom „ta kočka“, ne „to kočka“ — to je ženský rod.",
  }, "Řekneme „ta kočka“, proto ženský rod."),
  rodUloha("Na poličce stála tlustá KNIHA.", "ženský rod", {
    "mužský rod životný": "Řekli bychom „ta kniha“, ne „ten kniha“ — to je ženský rod.",
    "mužský rod neživotný": "Řekli bychom „ta kniha“, ne „ten kniha“ — to je ženský rod.",
    "střední rod": "Řekli bychom „ta kniha“, ne „to kniha“ — to je ženský rod.",
  }, "Řekneme „ta kniha“, proto ženský rod."),
  rodUloha("Naše MĚSTO má nové náměstí.", "střední rod", {
    "mužský rod životný": "Řekli bychom „to město“, ne „ten město“ — to je střední rod.",
    "mužský rod neživotný": "Řekli bychom „to město“, ne „ten město“ — to je střední rod.",
    "ženský rod": "Řekli bychom „to město“, ne „ta město“ — to je střední rod.",
  }, "Řekneme „to město“, proto střední rod."),
  rodUloha("Táta koupil nové AUTO.", "střední rod", {
    "mužský rod životný": "Řekli bychom „to auto“, ne „ten auto“ — to je střední rod.",
    "mužský rod neživotný": "Řekli bychom „to auto“, ne „ten auto“ — to je střední rod.",
    "ženský rod": "Řekli bychom „to auto“, ne „ta auto“ — to je střední rod.",
  }, "Řekneme „to auto“, proto střední rod."),
];

// (c) Číslo — porovnání čtyř vět se stejným slovem, jen jedna je v množném čísle.
function cisloUloha(lemma: string, mnozne: string, jednotne: [string, string, string]): PracticeTask {
  return must(choice(
    `Urči, ve které z vět je podstatné jméno „${lemma}“ v množném čísle.`,
    mnozne,
    jednotne.map((v) => ({ value: v, why: "Tahle věta mluví jen o jednom — je to jednotné číslo, ne množné." })),
    {
      hints: [
        "Přečti si všechny čtyři věty a u každé si řekni, jestli mluví o jednom, nebo o víc než jednom.",
        `Množné číslo znamená víc než jeden. Všímej si čísel a slov jako „dva“, „tři“, „všichni“ — často prozradí počet. U slova „${lemma}“ hledej tu jednu větu, kde jich je víc.`,
      ],
      explanation: `Množné číslo znamená víc než jeden. Věta „${mnozne}“ je jediná v množném čísle (slovo „${lemma}“ je tu v tvaru pro víc než jeden), ostatní věty mluví jen o jednom.`,
    },
  ));
}

const L1_CISLO: PracticeTask[] = [
  cisloUloha("kniha", "V knihovně přibyly nové KNIHY.", [
    "Na stole ležela tlustá KNIHA.", "Půjčil jsem si zajímavou KNIHU.", "Přečetl jsem si stránku z KNIHY.",
  ]),
  cisloUloha("žák", "Všichni ŽÁCI dorazili včas.", [
    "Do třídy přišel nový ŽÁK.", "Paní učitelka pochválila ŽÁKA.", "Úkol patřil jednomu ŽÁKOVI.",
  ]),
  cisloUloha("auto", "Na parkovišti stála tři AUTA.", [
    "Táta koupil nové AUTO.", "Nastoupili jsme do AUTA.", "Mluvili jsme o novém AUTĚ.",
  ]),
  cisloUloha("okno", "V patře byla otevřená OKNA.", [
    "V kuchyni bylo rozbité OKNO.", "Podíval jsem se z OKNA.", "Přistoupili jsme k OKNU.",
  ]),
  cisloUloha("míč", "Do brány létaly MÍČE.", [
    "Na hřišti ležel kulatý MÍČ.", "Kopli jsme do MÍČE.", "Hráli jsme si s MÍČEM.",
  ]),
  cisloUloha("pes", "Na zahradě štěkali dva PSI.", [
    "Na zahradě štěkal jeden PES.", "Nakrmili jsme hladového PSA.", "Bál se cizího PSA.",
  ]),
  cisloUloha("strom", "V sadu rostly staré STROMY.", [
    "Na kraji lesa rostl vysoký STROM.", "Vylezl jsem na vysoký STROM.", "Posadili jsme se pod STROM.",
  ]),
  cisloUloha("kolo", "Ve stojanu stála dvě KOLA.", [
    "Před domem stálo staré KOLO.", "Jel jsem na novém KOLE.", "Kluk spravoval řetěz u KOLA.",
  ]),
];

const L1_POOL: PracticeTask[] = [...L1_PAD, ...L1_ROD, ...L1_CISLO];

// ============================================================
// L2 — (a) vzor u slov, kde klame zakončení; (b) úplné určení
// ============================================================

type Skupina = "predseda" | "soudce" | "kost" | "pisen" | "kure" | "more";
const VZOR_NAZEV: Record<Skupina, string> = {
  predseda: "předseda", soudce: "soudce", kost: "kost", pisen: "píseň", kure: "kuře", more: "moře",
};

function l2aUloha(slovo: string, veta: string, skupina: Skupina, gen: string): PracticeTask {
  const spravny = VZOR_NAZEV[skupina];
  const konec = `-${slovo.slice(-1)}`; // skutečné zakončení v 1. pádě (štěně → -ě, pole → -e)
  let distraktory: Distractor[];
  let vysvetleniProc: string;
  let hint2: string;
  switch (skupina) {
    case "predseda":
      distraktory = [
        { value: "žena", why: `Zakončení -a klame. Slovo „${slovo}“ je ale rodu mužského (ten ${slovo}), a proto vzor předseda, ne žena.` },
        { value: "pán", why: `Vzor pán je pro mužská jména zakončená v 1. pádě na souhlásku. Slovo „${slovo}“ končí na -a, proto vzor předseda.` },
        { value: "muž", why: `Vzor muž je pro mužská jména zakončená v 1. pádě na měkkou souhlásku. Slovo „${slovo}“ končí na -a, proto vzor předseda.` },
      ];
      vysvetleniProc = `Slovo „${slovo}“ je rodu mužského životného (ten ${slovo}) a v 1. pádě končí na -a. Taková mužská jména se skloňují podle vzoru předseda, i když zakončení -a připomíná ženský rod.`;
      hint2 = `Zkus „ten“, nebo „ta“ ${slovo}: je to muž? Mužská jména zakončená na -a mají svůj vlastní vzor, jiný než ženská jména na -a.`;
      break;
    case "soudce":
      distraktory = [
        { value: "muž", why: `Vzor muž je pro mužská jména zakončená v 1. pádě na měkkou souhlásku (muž, bez muže). Slovo „${slovo}“ končí na -e (-ce), proto vzor soudce.` },
        { value: "pán", why: `Vzor pán je pro mužská jména zakončená na tvrdou souhlásku (bez pána). Slovo „${slovo}“ končí na -ce a má vlastní vzor soudce.` },
        { value: "žena", why: `Slovo „${slovo}“ je mužského rodu (ten ${slovo}), ne ženského, proto vzor soudce, ne žena.` },
      ];
      vysvetleniProc = `Slovo „${slovo}“ je rodu mužského životného a v 1. pádě končí na -ce. Mužská jména s tímto zakončením mají vlastní vzor soudce.`;
      hint2 = `Urči rod (ten/ta) a podívej se, na co „${slovo}“ končí: mužská jména zakončená na -e (-ce) mají svůj vlastní vzor, jiný než jména na souhlásku.`;
      break;
    case "kost":
      distraktory = [
        { value: "píseň", why: `Rozhodne 2. pád: „bez ${gen}“ končí na -i, proto kost. Vzor píseň by měl koncovku -e/-ě (jako „bez písně“).` },
        { value: "žena", why: `Vzor žena je pro slova zakončená na -a. Slovo „${slovo}“ končí na souhlásku.` },
        { value: "růže", why: `Vzor růže je pro slova zakončená na -e nebo -ě už v 1. pádě. Slovo „${slovo}“ v 1. pádě končí na souhlásku.` },
      ];
      vysvetleniProc = `Slovo „${slovo}“ je rodu ženského, končí na souhlásku a ve 2. pádě má tvar „bez ${gen}“ s koncovkou -i. Proto patří ke vzoru kost.`;
      hint2 = `U ženských jmen na souhlásku zakončení nestačí. Dej „${slovo}“ do 2. pádu („bez …“) a porovnej koncovku: -i, nebo -e/-ě?`;
      break;
    case "pisen":
      distraktory = [
        { value: "kost", why: `Rozhodne 2. pád: „bez ${gen}“ končí na -e/-ě, proto píseň. Vzor kost by měl koncovku -i (jako „bez kosti“).` },
        { value: "žena", why: `Vzor žena je pro slova zakončená na -a. Slovo „${slovo}“ končí na souhlásku.` },
        { value: "růže", why: `Vzor růže je pro slova zakončená na -e nebo -ě už v 1. pádě. Slovo „${slovo}“ v 1. pádě končí na souhlásku.` },
      ];
      vysvetleniProc = `Slovo „${slovo}“ je rodu ženského, končí na souhlásku a ve 2. pádě má tvar „bez ${gen}“ s koncovkou -e/-ě. Proto patří ke vzoru píseň.`;
      hint2 = `U ženských jmen na souhlásku zakončení nestačí. Dej „${slovo}“ do 2. pádu („bez …“) a porovnej koncovku: -i, nebo -e/-ě?`;
      break;
    case "kure":
      distraktory = [
        { value: "moře", why: `Vzor moře se ve 2. pádě nemění (bez moře). Slovo „${slovo}“ ale ve 2. pádě přibírá -et- (bez ${gen}), proto kuře.` },
        { value: "město", why: `Vzor město je pro slova zakončená na -o. Slovo „${slovo}“ končí na ${konec}.` },
        { value: "stavení", why: `Vzor stavení je pro slova zakončená na -í. Slovo „${slovo}“ končí na ${konec}.` },
      ];
      vysvetleniProc = `Slovo „${slovo}“ je rodu středního a ve 2. pádě přibírá -et- (bez ${gen}). Proto patří ke vzoru kuře.`;
      hint2 = `U středních jmen na -e/-ě zakončení nestačí. Dej „${slovo}“ do 2. pádu („bez …“): přibude uvnitř slova -et-, nebo zůstane tvar stejný?`;
      break;
    case "more":
      distraktory = [
        { value: "kuře", why: `Vzor kuře ve 2. pádě přibírá -et- (bez kuřete). Slovo „${slovo}“ se ve 2. pádě nemění (bez ${gen}), proto moře.` },
        { value: "město", why: `Vzor město je pro slova zakončená na -o. Slovo „${slovo}“ končí na ${konec}.` },
        { value: "stavení", why: `Vzor stavení je pro slova zakončená na -í. Slovo „${slovo}“ končí na ${konec}.` },
      ];
      vysvetleniProc = `Slovo „${slovo}“ je rodu středního, končí na ${konec} a ve 2. pádě se nemění (bez ${gen}). Proto patří ke vzoru moře.`;
      hint2 = `U středních jmen na -e/-ě zakončení nestačí. Dej „${slovo}“ do 2. pádu („bez …“): přibude uvnitř slova -et-, nebo zůstane tvar stejný?`;
      break;
  }
  return must(choice(
    `Podle kterého vzoru se skloňuje podstatné jméno ve větě: „${veta}“?`,
    spravny,
    distraktory,
    {
      hints: [
        `Nejdřív urči rod slova „${slovo}“ (ten/ta/to) a na co končí v 1. pádě.`,
        hint2,
      ],
      explanation: vysvetleniProc,
    },
  ));
}

const L2A: PracticeTask[] = [
  l2aUloha("hrdina", "Ten HRDINA zachránil dítě z hořícího domu.", "predseda", "hrdiny"),
  l2aUloha("houslista", "Talentovaný HOUSLISTA vystoupil na koncertě.", "predseda", "houslisty"),
  l2aUloha("sluha", "SLUHA otevřel bránu zámku.", "predseda", "sluhy"),
  l2aUloha("turista", "Unavený TURISTA usnul na lavičce.", "predseda", "turisty"),
  l2aUloha("průvodce", "Náš PRŮVODCE znal každou uličku starého města.", "soudce", "průvodce"),
  l2aUloha("zachránce", "ZACHRÁNCE vytáhl chlapce z rybníka.", "soudce", "zachránce"),
  l2aUloha("paměť", "Babička má pořád výbornou PAMĚŤ.", "kost", "paměti"),
  l2aUloha("řeč", "Jeho ŘEČ trvala dvacet minut.", "kost", "řeči"),
  l2aUloha("báseň", "Naučili jsme se novou BÁSEŇ.", "pisen", "básně"),
  l2aUloha("dlaň", "Po pádu ho bolela DLAŇ.", "pisen", "dlaně"),
  l2aUloha("štěně", "Naše ŠTĚNĚ pořád něco žvýkalo.", "kure", "štěněte"),
  l2aUloha("pole", "Za vesnicí bylo velké POLE.", "more", "pole"),
];

// (b) Úplné určení — jedna možnost obsahuje rod, číslo, pád i vzor.
type Rod2 = "mužský životný" | "mužský neživotný" | "ženský" | "střední";
interface Tuple { rod: Rod2; cislo: "jednotné" | "množné"; pad: number; vzor: string }
const fmtTuple = (t: Tuple) => `rod ${t.rod}, číslo ${t.cislo}, ${NAZEV_PAD[t.pad]}, vzor ${t.vzor}`;

function l2bUloha(
  veta: string,
  spravny: Tuple,
  cisloJinak: { cislo: Tuple["cislo"]; why: string },
  padJinak: { pad: number; why: string },
  vzorJinak: { vzor: string; why: string },
  parts: { hints: [string, string]; explanation: string },
): PracticeTask {
  const d1: Tuple = { ...spravny, cislo: cisloJinak.cislo };
  const d2: Tuple = { ...spravny, pad: padJinak.pad };
  const d3: Tuple = { ...spravny, vzor: vzorJinak.vzor };
  return must(choice(
    `Urči u podstatného jména ve větě „${veta}“ rod, číslo, pád a vzor.`,
    fmtTuple(spravny),
    [
      { value: fmtTuple(d1), why: cisloJinak.why },
      { value: fmtTuple(d2), why: padJinak.why },
      { value: fmtTuple(d3), why: vzorJinak.why },
    ],
    parts,
  ));
}

const PAD_HINT = "Pád poznáš podle otázky od slovesa, ne podle samotné předložky: 2. koho/čeho, 3. komu/čemu, 4. koho/co, 6. o kom/o čem, 7. kým/čím.";

const L2B: PracticeTask[] = [
  l2bUloha(
    "Na koncertě jsme mluvili s HOUSLISTY.",
    { rod: "mužský životný", cislo: "množné", pad: 7, vzor: "předseda" },
    { cislo: "jednotné", why: "Číslo je špatně: „HOUSLISTY“ je tu tvar množného čísla (s houslisty). V jednotném čísle by věta zněla „s houslistou“." },
    { pad: 3, why: "Pád je špatně: 3. pád by byl „houslistům“, ale věta se ptá „s kým jsme mluvili?“ – to je 7. pád." },
    { vzor: "pán", why: "Vzor je špatně: „houslista“ v 1. pádě končí na -a, a taková mužská jména mají vzor předseda, ne pán (ten je pro slova zakončená na souhlásku)." },
    {
      hints: [
        "Podívej se, jaké slovo stojí těsně před «HOUSLISTY», a od slovesa „mluvili“ polož otázku, na kterou slovo odpovídá.",
        `${PAD_HINT} Rod a životnost poznáš podle toho, že houslista je osoba; vzor podle rodu a zakončení v 1. pádě (ten houslista).`,
      ],
      explanation: "Houslista je osoba (rod mužský životný). Předložka „s“ ve významu „spolu s kým“ se pojí se 7. pádem (s kým?) a jde o víc houslistů, tedy číslo množné. V 1. pádě „houslista“ končí na -a a je rodu mužského, proto vzor předseda.",
    },
  ),
  l2bUloha(
    "Setkali jsme se se SPRÁVCI hradu.",
    { rod: "mužský životný", cislo: "množné", pad: 7, vzor: "soudce" },
    { cislo: "jednotné", why: "Číslo je špatně: „SPRÁVCI“ je tu tvar množného čísla (se správci). V jednotném čísle by to bylo „se správcem“." },
    { pad: 3, why: "Pád je špatně: 3. pád množného čísla by byl „správcům“, ale věta se ptá „s kým jsme se setkali?“ – to je 7. pád." },
    { vzor: "muž", why: "Vzor je špatně: „správce“ končí na -ce, a taková mužská jména mají vlastní vzor soudce, ne muž." },
    {
      hints: [
        "Podívej se, jaké slovo stojí těsně před «SPRÁVCI», a od slovesa „setkali se“ polož otázku, na kterou slovo odpovídá.",
        `${PAD_HINT} Vzor poznáš podle rodu a zakončení v 1. pádě: na co končí „správce“?`,
      ],
      explanation: "Správce je osoba (rod mužský životný). Předložka „se“ ve významu „spolu s kým“ se pojí se 7. pádem (s kým?) a jde o víc správců, tedy číslo množné. V 1. pádě „správce“ končí na -ce, proto vzor soudce.",
    },
  ),
  l2bUloha(
    "Přijal pozvání s velkou RADOSTÍ.",
    { rod: "ženský", cislo: "jednotné", pad: 7, vzor: "kost" },
    { cislo: "množné", why: "Číslo je špatně: přídavné jméno „velkou“ je v jednotném čísle. Množné číslo by znělo „s velkými radostmi“." },
    { pad: 2, why: "Pád je špatně: 2. pád jednotného čísla by byl „bez radosti“. Tady se ptáme „přijal pozvání s čím?“ – to je 7. pád." },
    { vzor: "píseň", why: "Vzor je špatně: 2. pád zní „bez radosti“ s koncovkou -i, a to je vzor kost. Vzor píseň by měl koncovku -e/-ě (jako „bez písně“)." },
    {
      hints: [
        "Podívej se, jaké slovo stojí těsně před «RADOSTÍ», a od slovesa „přijal“ polož otázku, na kterou slovo odpovídá.",
        `${PAD_HINT} Vzor ženských jmen na souhlásku poznáš podle 2. pádu „bez …“: koncovka -i, nebo -e/-ě?`,
      ],
      explanation: "Radost je rodu ženského (ta radost). „Přijal pozvání s čím?“ ukazuje 7. pád a přídavné jméno „velkou“ jednotné číslo. Ve 2. pádě „bez radosti“ má koncovku -i, proto vzor kost.",
    },
  ),
  l2bUloha(
    "Naslouchali jsme tiše jeho BÁSNI.",
    { rod: "ženský", cislo: "jednotné", pad: 3, vzor: "píseň" },
    { cislo: "množné", why: "Číslo je špatně: 3. pád množného čísla by byl „básním“, ale věta mluví jen o jedné básni." },
    { pad: 6, why: "Pád je špatně: tvar „básni“ má stejnou podobu i v 6. pádě (o básni), ale sloveso „naslouchat“ se pojí se 3. pádem (komu, čemu), ne se 6." },
    { vzor: "kost", why: "Vzor je špatně: 2. pád zní „bez básně“ s koncovkou -ě, a to je vzor píseň. Vzor kost by měl koncovku -i (jako „bez kosti“)." },
    {
      hints: [
        "Které sloveso stojí ve větě a s jakým pádem se obvykle pojí?",
        "Tvar „básni“ je stejný ve dvou pádech, rozhodne sloveso. Zkus „naslouchat“ s jiným slovem (naslouchat kamarád…?) a polož otázku. Vzor poznáš podle 2. pádu „bez …“: koncovka -i, nebo -ě?",
      ],
      explanation: "Báseň je rodu ženského. Sloveso „naslouchat“ vyžaduje 3. pád (naslouchat komu, čemu?), jde o jednu báseň, tedy číslo jednotné. Ve 2. pádě „bez básně“ má koncovku -ě, proto vzor píseň.",
    },
  ),
  l2bUloha(
    "Staral se o hladové KUŘE.",
    { rod: "střední", cislo: "jednotné", pad: 4, vzor: "kuře" },
    { cislo: "množné", why: "Číslo je špatně: 4. pád množného čísla by byl „o hladová kuřata“, ale věta mluví jen o jednom kuřeti." },
    { pad: 6, why: "Pád je špatně: „o kuřeti“ by byl 6. pád (mluvit o kom, o čem). „Starat se o“ se ale ptá „o koho, o co?“, a to je 4. pád." },
    { vzor: "moře", why: "Vzor je špatně: 2. pád zní „bez kuřete“ s příponou -et-, a to je vzor kuře. Vzor moře by se ve 2. pádě nezměnil (bez moře)." },
    {
      hints: [
        "Spojení „starat se o“ má pevný pád — zkus ho použít s jiným slovem, třeba „stará se o psa“.",
        "Předložka „o“ může stát u dvou pádů: 4. pád poznáš otázkou „o koho, o co?“, 6. pád otázkou „o kom, o čem?“. Vyzkoušej obě se slovesem „starat se“. Vzor rozhodni podle 2. pádu „bez …“.",
      ],
      explanation: "Kuře je rodu středního. Spojení „starat se o“ se ptá „o koho, o co?“, a proto vyžaduje 4. pád; jde o jedno kuře, tedy číslo jednotné. Ve 2. pádě „bez kuřete“ přibírá -et-, proto vzor kuře.",
    },
  ),
  l2bUloha(
    "Dal si ke snídani jedno VEJCE naměkko.",
    { rod: "střední", cislo: "jednotné", pad: 4, vzor: "moře" },
    { cislo: "množné", why: "Číslo je špatně: číslovka „jedno“ jasně říká, že jde o jeden kus, tedy o jednotné číslo." },
    { pad: 3, why: "Pád je špatně: 3. pád by byl „k vejci“, ale věta se ptá „dal si co?“ – to je 4. pád." },
    { vzor: "kuře", why: "Vzor je špatně: 2. pád zní „bez vejce“ beze změny, a to je vzor moře. Vzor kuře by ve 2. pádě přibral -et- (bez kuřete)." },
    {
      hints: [
        "Kolik vajec je ve větě zmíněno? Podívej se na číslovku před slovem.",
        `Číslo ti prozradí číslovka. ${PAD_HINT} Vzor středních jmen na -e rozhodne 2. pád „bez …“: přibude -et-, nebo ne?`,
      ],
      explanation: "Vejce je rodu středního. „Dal si co?“ vyžaduje 4. pád, číslovka „jedno“ určuje jednotné číslo. Ve 2. pádě „bez vejce“ se tvar nemění, proto vzor moře.",
    },
  ),
  l2bUloha(
    "Přes řeku postavili nový MOST.",
    { rod: "mužský neživotný", cislo: "jednotné", pad: 4, vzor: "hrad" },
    { cislo: "množné", why: "Číslo je špatně: 4. pád množného čísla by byl „mosty“, ale věta mluví jen o jednom mostu." },
    { pad: 6, why: "Pád je špatně: 6. pád by byl „o mostu“, ale věta se ptá „postavili co?“ – to je 4. pád." },
    { vzor: "stroj", why: "Vzor je špatně: 2. pád zní „bez mostu“ s tvrdou souhláskou na konci základu, a to je vzor hrad. Vzor stroj má měkký základ (bez stroje)." },
    {
      hints: [
        "Most je věc. Zkus se zeptat od slovesa „postavili“.",
        `${PAD_HINT} Vzor poznáš podle 2. pádu „bez …“: je souhláska na konci základu tvrdá, nebo měkká?`,
      ],
      explanation: "Most je věc, tedy rod mužský neživotný. „Postavili co?“ vyžaduje 4. pád, jde o jeden most, tedy číslo jednotné. Ve 2. pádě „bez mostu“ je základ tvrdý, proto vzor hrad.",
    },
  ),
  l2bUloha(
    "Poslal pozdrav TETĚ.",
    { rod: "ženský", cislo: "jednotné", pad: 3, vzor: "žena" },
    { cislo: "množné", why: "Číslo je špatně: 3. pád množného čísla by byl „tetám“, ale věta mluví jen o jedné tetě." },
    { pad: 2, why: "Pád je špatně: 2. pád by byl „bez tety“, ale věta se ptá „poslal komu?“ – to je 3. pád." },
    { vzor: "růže", why: "Vzor je špatně: „teta“ v 1. pádě končí na -a, a to je vzor žena. Vzor růže je pro slova zakončená na -e nebo -ě (jako „ulice“)." },
    {
      hints: [
        "Od slovesa „poslal“ se zeptej, komu nebo čemu pozdrav poslal.",
        `${PAD_HINT} Vzor ženských jmen poznáš podle zakončení v 1. pádě: končí slovo na -a, nebo na -e/-ě?`,
      ],
      explanation: "Teta je rodu ženského. „Poslal komu?“ vyžaduje 3. pád, jde o jednu tetu, tedy číslo jednotné. V 1. pádě „teta“ končí na -a, proto vzor žena.",
    },
  ),
];

const L2_POOL: PracticeTask[] = [...L2A, ...L2B];

// ============================================================
// L3 — přenos: (a) inverze, (b) tvarová homonymie, (c) pomnožná jména
// ============================================================

// (a) Z ohnutého tvaru urči 1. pád (lemma) a vzor.
function l3aUloha(veta: string, forma: string, spravnyLemma: string, spravnyVzor: string, distrs: Distractor[]): PracticeTask {
  const spravny = `${spravnyLemma}, vzor ${spravnyVzor}`;
  return must(choice(
    `Z jakého slova (1. pádu) vznikl tvar „${forma}“ ve větě „${veta}“ a podle jakého vzoru se skloňuje?`,
    spravny,
    distrs,
    {
      hints: [
        `Zkus tvar „${forma}“ postupně vrátit do 1. pádu jednotného čísla – jak by to slovo znělo samo o sobě?`,
        "Nejdřív najdi základní tvar slova (1. pád, jednotné číslo), pak teprve u něj rozhoduj o vzoru podle rodu a zakončení (nebo podle 2. pádu, pokud zakončení nestačí).",
      ],
      explanation: `Tvar „${forma}“ patří ke slovu „${spravnyLemma}“ (1. pád jednotného čísla), a to se skloňuje podle vzoru ${spravnyVzor}.`,
    },
  ));
}

const L3A: PracticeTask[] = [
  l3aUloha("Mluvili jsme o HRDINÁCH.", "HRDINÁCH", "hrdina", "předseda", [
    { value: "hrdin, vzor pán", why: "1. pád je „hrdina“, ne „hrdin“ – zakončení -a se v jiných pádech mění, ale v 1. pádě zůstává." },
    { value: "hrdina, vzor pán", why: "„Hrdina“ v 1. pádě končí na -a, a taková mužská jména mají vzor předseda, ne pán." },
    { value: "hrdinka, vzor žena", why: "„Hrdinka“ by byla žena. Tvar „hrdinách“ patří k mužskému slovu „hrdina“ (ten hrdina)." },
  ]),
  l3aUloha("Šli jsme za PRŮVODCI.", "PRŮVODCI", "průvodce", "soudce", [
    { value: "průvodec, vzor muž", why: "1. pád je „průvodce“, ne „průvodec“ – takové slovo v češtině neexistuje." },
    { value: "průvodce, vzor muž", why: "„Průvodce“ končí na -ce, a taková mužská jména mají vlastní vzor soudce, ne muž." },
    { value: "průvodkyně, vzor žena", why: "„Průvodkyně“ by byla žena. Tvar „průvodci“ patří k mužskému slovu „průvodce“." },
  ]),
  l3aUloha("Mluvili jsme o mnoha RADOSTECH.", "RADOSTECH", "radost", "kost", [
    { value: "radost, vzor píseň", why: "2. pád je „bez radosti“ s koncovkou -i, a to je vzor kost, ne píseň (ta by měla -ě)." },
    { value: "radosti, vzor kost", why: "1. pád jednotného čísla je „radost“. „Radosti“ je jiný pád (bez radosti, k radosti, o radosti) nebo tvar množného čísla." },
    { value: "radost, vzor stroj", why: "Vzor stroj je pro mužský rod. „Radost“ je rodu ženského (ta radost)." },
  ]),
  l3aUloha("Přemýšleli jsme o osudu všech KOŤAT.", "KOŤAT", "kotě", "kuře", [
    { value: "koťata, vzor kuře", why: "1. pád jednotného čísla je „kotě“, ne „koťata“ – to je tvar množného čísla." },
    { value: "kotě, vzor moře", why: "Vzor moře má 2. pád stejný jako 1. pád (bez moře), ale my říkáme „bez kotěte“ – přibude -et-, proto vzor kuře." },
    { value: "koťat, vzor hrad", why: "„Koťat“ není 1. pád – je to 2. pád množného čísla (bez koťat). Základní tvar je „kotě“ (to kotě), rodu středního, proto vzor kuře. Vzor hrad je pro mužský rod." },
  ]),
  l3aUloha("Sbírka obsahovala pár nových BÁSNÍ.", "BÁSNÍ", "báseň", "píseň", [
    { value: "báseň, vzor kost", why: "2. pád je „bez básně“ s koncovkou -ě, a to je vzor píseň, ne kost (ta by měla -i)." },
    { value: "básn, vzor píseň", why: "Tvar „básn“ neexistuje. V 1. pádě se mezi s a n vkládá e: báseň (stejně jako píseň, bez písně)." },
    { value: "básně, vzor píseň", why: "1. pád jednotného čísla je „báseň“, ne „básně“ – „básně“ je 2. pád jednotného, nebo 1./4. pád množného čísla." },
  ]),
  l3aUloha("Kuchařka měla dost VAJEC na palačinky.", "VAJEC", "vejce", "moře", [
    { value: "vejce, vzor kuře", why: "2. pád jednotného čísla je „bez vejce“ beze změny, a to je vzor moře, ne kuře (ten by měl „bez vejcete“)." },
    { value: "vajec, vzor moře", why: "1. pád jednotného čísla je „vejce“, ne „vajec“ – to je až 2. pád množného čísla." },
    { value: "vejco, vzor město", why: "Takové slovo jako „vejco“ ve spisovné češtině neexistuje. Správný 1. pád je „vejce“, a proto vzor moře, ne město." },
  ]),
];

// (b) Tvarová homonymie — stejný tvar, jiný pád/číslo podle kontextu.
function l3bUloha(veta: string, forma: string, spravny: string, distrs: Distractor[], explanation: string): PracticeTask {
  return must(choice(
    `Ve větě „${veta}“ je tvar „${forma}“. Urči jeho pád a číslo.`,
    spravny,
    distrs,
    {
      hints: [
        `Tvar „${forma}“ může v různých větách znamenat jiný pád i jiné číslo. Podívej se, co se slovem dělá sloveso, a jsou-li ve větě slova jako „dva“, „tři“, „všechny“, „mnoho“.`,
        "Nejdřív rozhodni číslo (jednotné, nebo víc kusů podle ostatních slov ve větě), pak se od slovesa zeptej „kdo, co / koho, co / komu, čemu…?“ a najdi pád, který na tu otázku odpovídá.",
      ],
      explanation,
    },
  ));
}

const L3B: PracticeTask[] = [
  l3bUloha("Pes ohlodal všechny KOSTI.", "KOSTI", "4. pád množného čísla", [
    { value: "2. pád jednotného čísla", why: "Tvar „kosti“ je stejný i ve 2. pádě jednotného čísla, ale slovo „všechny“ ukazuje na množné číslo, ne jednotné." },
    { value: "6. pád jednotného čísla", why: "6. pád („o kosti“) se vždy pojí s předložkou (o, v, na, po, při) – tady žádná není. „Kosti“ jsou přímým předmětem slovesa „ohlodal“." },
    { value: "1. pád množného čísla", why: "1. pád by byl podmětem (kdo, co ohlodalo?). Tady ale kosti sám ohlodal pes – jsou předmětem, proto 4. pád, ne 1." },
  ], "Slovo „všechny“ ukazuje množné číslo a „ohlodal co?“ ukazuje 4. pád – „kosti“ jsou tu předmětem slovesa, ne podmětem."),
  l3bUloha("Viděli jsme nové STROJE ve fabrice.", "STROJE", "4. pád množného čísla", [
    { value: "1. pád množného čísla", why: "1. pád by byl podmětem (co vidělo?). Tady ale někdo viděl stroje – jsou předmětem slovesa „viděli“, proto 4. pád." },
    { value: "2. pád jednotného čísla", why: "2. pád jednotného čísla („bez stroje“) mluví jen o jednom stroji. Tady jde o víc strojů a o přímý předmět slovesa „viděli“." },
    { value: "6. pád jednotného čísla", why: "6. pád jednotného čísla je „o stroji“. 6. pád se vždy pojí s předložkou (o, v, na, po, při) – tady žádná není." },
  ], "„Viděli co?“ ukazuje 4. pád a slovo je v množném čísle (víc strojů), i když má stejný tvar jako 2. pád jednotného čísla „bez stroje“."),
  l3bUloha("Navštívili jsme tři MĚSTA.", "MĚSTA", "4. pád množného čísla", [
    { value: "2. pád jednotného čísla", why: "2. pád jednotného čísla („bez města“) mluví o jednom městě. Slovo „tři“ ale ukazuje na množné číslo." },
    { value: "1. pád množného čísla", why: "1. pád by byl podmětem. Tady ale někdo navštívil města – jsou předmětem slovesa „navštívili“, proto 4. pád." },
    { value: "3. pád množného čísla", why: "3. pád množného čísla by měl tvar „městům“, ne „města“." },
  ], "Číslovka „tři“ ukazuje množné číslo a „navštívili co?“ ukazuje 4. pád, i když má tvar stejný jako 2. pád jednotného čísla „bez města“."),
  l3bUloha("V kurníku poskakovala malá KUŘATA.", "KUŘATA", "1. pád množného čísla", [
    { value: "4. pád množného čísla", why: "4. pád by bylo, kdyby „kuřata“ byla předmětem nějakého slovesa (třeba „vidím kuřata“). Tady ale kuřata sama poskakovala – jsou podmětem, proto 1. pád." },
    { value: "2. pád jednotného čísla", why: "2. pád jednotného čísla je „kuřete“, ne „kuřata“ – jiný tvar." },
    { value: "3. pád množného čísla", why: "3. pád množného čísla by měl tvar „kuřatům“, ne „kuřata“." },
  ], "Kuřata sama poskakovala – jsou podmětem věty (kdo, co poskakovalo?), proto 1. pád. Tvar je stejný jako u 4. pádu množného čísla, tady ale jde o podmět."),
  l3bUloha("Kočka honila dvě MYŠI.", "MYŠI", "4. pád množného čísla", [
    { value: "2. pád jednotného čísla", why: "Tvar „myši“ je stejný i ve 2. pádě jednotného čísla, ale slovo „dvě“ ukazuje na množné číslo." },
    { value: "1. pád množného čísla", why: "1. pád by byl podmětem (kdo honil?). Tady je podmětem „kočka“, a myši jsou předmětem, proto 4. pád." },
    { value: "3. pád jednotného čísla", why: "3. pád jednotného čísla („k myši“) je tvar pro jednu myš. Tady jde o dvě myši v roli předmětu, proto 4. pád množného čísla." },
  ], "Číslovka „dvě“ ukazuje množné číslo a „honila koho?“ ukazuje 4. pád – myši jsou předmětem, podmětem je kočka."),
];

// (c) Číslo u pomnožných podstatných jmen — vždy jen množné, bez ohledu na počet kusů.
const POMNOZNA_PRIKLADY = ["dveře", "kalhoty", "nůžky", "brýle", "housle", "vrata"];
function l3cUloha(slovo: string, veta: string, priklad: string): PracticeTask {
  return must(choice(
    `Ve větě „${veta}“ je podstatné jméno „${slovo}“. Jaké má číslo?`,
    "množné číslo (je to pomnožné jméno)",
    [
      { value: "jednotné číslo (jde jen o jeden kus)", why: `U pomnožných jmen se číslo neřídí počtem kusů. Slovo „${slovo}“ nemá jednotné číslo vůbec – existuje jen v množném čísle, i když jde o jeden kus.` },
      { value: "záleží na tom, kolik kusů to označuje", why: `U pomnožných jmen se číslo neřídí počtem kusů – slovo „${slovo}“ má jen množné číslo, ať jde o jedny, nebo o troje.` },
      { value: "dvojné číslo (má dvě části)", why: "Dvojné číslo se dnes používá jen výjimečně, u slov jako oči nebo uši. Toto slovo má obyčejné množné číslo." },
    ],
    {
      hints: [
        `Zkus u slova „${slovo}“ najít tvar pro jeden kus (jednotné číslo). Existuje vůbec?`,
        `Pomnožná jména (${POMNOZNA_PRIKLADY.filter((w) => w !== slovo.toLowerCase()).join(", ")}…) nemají jednotné číslo, i když označují třeba jen jeden předmět. Proto se u nich vždycky říká „jedny“, ne „jeden“.`,
      ],
      explanation: `„${slovo}“ patří mezi pomnožná jména – ta mají jen množné číslo, i když jde o jeden kus. Proto se říká „${priklad}“, ne „jeden ${slovo.toLowerCase()}“.`,
    },
  ));
}

const L3C: PracticeTask[] = [
  l3cUloha("KALHOTY", "Kuba si koupil jedny nové KALHOTY.", "jedny kalhoty"),
  l3cUloha("NŮŽKY", "Na stole ležely ostré NŮŽKY.", "jedny nůžky"),
  l3cUloha("BRÝLE", "Dědeček si nasadil BRÝLE.", "jedny brýle"),
  l3cUloha("DVEŘE", "Zabouchly se DVEŘE od pokoje.", "jedny dveře"),
  l3cUloha("HOUSLE", "V pouzdru byly staré HOUSLE.", "jedny housle"),
];

const L3_POOL: PracticeTask[] = [...L3A, ...L3B, ...L3C];

// ============================================================
// Generátor
// ============================================================

function genL1(): PracticeTask {
  return pick(L1_POOL);
}
function genL2(): PracticeTask {
  return pick(L2_POOL);
}
function genL3(): PracticeTask {
  return pick(L3_POOL);
}

function gen(level: number): PracticeTask[] {
  const tvor = level === 1 ? genL1 : level === 2 ? genL2 : genL3;
  return ruzneUlohy(() => losUlohy(tvor));
}

// ── Topic ────────────────────────────────────────────────────────────────
export const PODSTATNA_JMENA_SKLONOVANI_MLUVNICKE_KATEGORIE: TopicMetadata[] = [
  {
    id: "g6-cjl-podstatna-jmena-sklonovani-mluvnicke-kategorie-6",
    rvpNodeId:
      "g6-cjl-jazykova-vychova-tvaroslovi-podstatna-jmena-sklonovani-mluvnicke-kategorie",
    displayName: "Pád, rod a vzor jmen",
    title: "Podstatná jména - skloňování, mluvnické kategorie",
    studentTitle: "Podstatná jména: pád, rod, vzor",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Tvarosloví",
    briefDescription: "Urči u podstatného jména ve větě rod, číslo, pád a vzor.",
    keywords: [
      "podstatné jméno", "pád", "rod", "číslo", "vzor", "skloňování", "mluvnické kategorie",
      "životnost", "předseda", "soudce", "kost", "píseň", "kuře", "moře", "pomnožné jméno",
    ],
    goals: [
      "Určit pád, rod (u mužského rodu i životnost) a číslo podstatného jména ve větě.",
      "Určit vzor podle rodu, zakončení v 1. pádě a tam, kde to nestačí, podle 2. pádu (samotné zakončení bez rodu klame).",
      "Vrátit se od ohnutého tvaru ve větě k 1. pádu a určit vzor.",
    ],
    boundaries: [
      "Dvojné číslo jen jako zmínka u výjimek (oči, uši), nikdy jako klíč.",
      "Bez kolísavých slov (loď, zeď, obuv) jako klíčového slova.",
      "Vždy podstatné jméno ve větě, nikdy izolované slovo bez kontextu.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Vzor se určuje podle rodu, zakončení v 1. pádě a tam, kde to nestačí (kost/píseň, moře/kuře), podle 2. pádu. Samotné zakončení bez rodu klame: hrdina, houslista jsou mužského rodu, proto vzor předseda, ne žena.",
      steps: [
        "Nejdřív urči rod (ten/ta/to) a u mužského rodu životnost.",
        "Pak se podívej na zakončení v 1. pádě; když nestačí, dej slovo do 2. pádu (bez koho, čeho) a porovnej koncovku se vzory.",
        "Pád poznáš podle otázky od slovesa, předložka jen napoví: o/v/na bývají často u 6. pádu (o kom, o čem), ale mohou mít i 4. pád (starat se o koho, co; dívat se na co).",
      ],
      commonMistake: "Určení vzoru jen podle zakončení bez ohledu na rod: hrdina, turista, houslista jsou mužského rodu, ne ženského, i když končí na -a.",
      example: "Houslista: rod mužský životný, vzor předseda (bez houslisty). Kotě: rod střední, vzor kuře (bez kotěte).",
    },
  },
];
