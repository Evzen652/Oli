import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, pick, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu, binární
// otázky „Je slovo X spisovné? ano/ne“ i na L3 a zpětnou vazbu bez vysvětlení.
// Teď: L1 vybrat spisovné slovo mezi nespisovnými · L2 najít nespisovné slovo
// ve větě · L3 zrádné spisovné tvary (rukama, očima, s koňmi, vosa).

interface Par { nespisovne: string; spisovne: string; jev: string }
const PARY: Par[] = [
  { nespisovne: "vokno", spisovne: "okno", jev: "na začátku slova se v nespisovné řeči přidává v-" },
  { nespisovne: "votevřít", spisovne: "otevřít", jev: "na začátku slova se v nespisovné řeči přidává v-" },
  { nespisovne: "mlíko", spisovne: "mléko", jev: "nespisovně se místo -é- říká -í-" },
  { nespisovne: "polívka", spisovne: "polévka", jev: "nespisovně se místo -é- říká -í-" },
  { nespisovne: "lítat", spisovne: "létat", jev: "nespisovně se místo -é- říká -í-" },
  { nespisovne: "dobrej", spisovne: "dobrý", jev: "nespisovně se místo -ý říká -ej" },
  { nespisovne: "malej", spisovne: "malý", jev: "nespisovně se místo -ý říká -ej" },
  { nespisovne: "bejt", spisovne: "být", jev: "nespisovně se místo -ý- říká -ej-" },
  { nespisovne: "mejdlo", spisovne: "mýdlo", jev: "nespisovně se místo -ý- říká -ej-" },
  { nespisovne: "cejtit", spisovne: "cítit", jev: "nespisovně se místo -í- říká -ej-" },
  { nespisovne: "zejtra", spisovne: "zítra", jev: "nespisovně se místo -í- říká -ej-" },
  { nespisovne: "bysme", spisovne: "bychom", jev: "spisovný tvar podmiňovacího způsobu je bychom" },
  { nespisovne: "du", spisovne: "jdu", jev: "nespisovně se vypouští j- na začátku" },
  { nespisovne: "dyž", spisovne: "když", jev: "nespisovně se zjednodušuje skupina hlásek" },
  { nespisovne: "eště", spisovne: "ještě", jev: "nespisovně se vypouští j-" },
  { nespisovne: "kerej", spisovne: "který", jev: "nespisovně se zjednodušuje a mění koncovka" },
  { nespisovne: "von", spisovne: "on", jev: "na začátku slova se v nespisovné řeči přidává v-" },
];
const spis = (slovo: string) => PARY.find((p) => p.nespisovne === slovo)?.spisovne ?? slovo;

function vyberSpisovne(i: number): PracticeTask {
  const a = PARY[i];
  const jine = [1, 5, 9].map((k) => PARY[(i + k) % PARY.length]);
  const d = jine.map((p) => ({ value: p.nespisovne, why: `„${p.nespisovne}“ je nespisovné, spisovně „${p.spisovne}“ — ${p.jev}.` }));
  return choice("Které slovo je spisovné?", a.spisovne, d as never, {
    hints: [
      `Zkus slova „${jine[0].nespisovne}“ a „${jine[1].nespisovne}“ říct tak, jak se píšou v učebnici. Změní se?`,
      `Nespisovné tvary poznáš třeba podle -ej místo -ý, podle v- na začátku nebo podle -í- místo -é-. Slovo „${jine[0].nespisovne}“ se spisovně řekne „${jine[0].spisovne}“.`,
    ],
    explanation: `„${a.spisovne}“ je spisovné slovo; ostatní jsou nespisovné tvary (${jine.map((p) => `${p.nespisovne} → ${p.spisovne}`).join(", ")}).`,
  });
}

interface Veta { veta: string; slovo: string; spisovne: string; jev: string }
const VETY: Veta[] = [
  { veta: "Včera sme byli v kině.", slovo: "sme", spisovne: "jsme", jev: "nespisovně se vypouští j-" },
  { veta: "Maminka koupila mlíko a chleba.", slovo: "mlíko", spisovne: "mléko", jev: "nespisovně -í- místo -é-" },
  { veta: "Otevři prosím vokno.", slovo: "vokno", spisovne: "okno", jev: "nespisovně se přidává v- na začátek" },
  { veta: "To byl dobrej nápad.", slovo: "dobrej", spisovne: "dobrý", jev: "nespisovně -ej místo -ý" },
  { veta: "Zejtra pojedeme k babičce.", slovo: "zejtra", spisovne: "zítra", jev: "nespisovně -ej- místo -í-" },
  { veta: "Šli bysme rádi ven.", slovo: "bysme", spisovne: "bychom", jev: "spisovně bychom" },
  { veta: "Dyž prší, zůstaneme doma.", slovo: "dyž", spisovne: "když", jev: "nespisovně se zjednodušují hlásky" },
  { veta: "Na zahradě roste velkej strom.", slovo: "velkej", spisovne: "velký", jev: "nespisovně -ej místo -ý" },
  { veta: "Umyj si ruce mejdlem.", slovo: "mejdlem", spisovne: "mýdlem", jev: "nespisovně -ej- místo -ý-" },
  { veta: "Ptáci lítají nad lesem.", slovo: "lítají", spisovne: "létají", jev: "nespisovně -í- místo -é-" },
  { veta: "Eště chvíli počkej.", slovo: "eště", spisovne: "ještě", jev: "nespisovně se vypouští j-" },
  { veta: "Von přišel pozdě.", slovo: "von", spisovne: "on", jev: "nespisovně se přidává v- na začátek" },
  { veta: "Dáš si polívku?", slovo: "polívku", spisovne: "polévku", jev: "nespisovně -í- místo -é-" },
  { veta: "Kerej sešit je tvůj?", slovo: "kerej", spisovne: "který", jev: "nespisovně se mění hlásky i koncovka" },
];

function najdiVeVete(v: Veta): PracticeTask {
  const slova = v.veta.replace(/[.,?!]/g, "").split(" ");
  const tvar = slova.find((s) => s.toLowerCase() === v.slovo) ?? v.slovo;
  const ostatni = shuffle(slova.filter((s) => s.toLowerCase() !== v.slovo && s.length > 2)).slice(0, 3);
  return choice(`Které slovo ve větě „${v.veta}“ je nespisovné?`, tvar,
    ostatni.map((s) => ({ value: s, why: `„${s}“ je spisovné slovo.` })) as never, {
      hints: [
        `Slovo „${ostatni[0]}“ je spisovné. Které jiné slovo by hlasatel ve zprávách vyslovil jinak?`,
        "Hledej typické nespisovné znaky: -ej místo -ý nebo -í, v- na začátku slova, -í- místo -é-, vynechané j-.",
      ],
      explanation: `„${v.slovo}“ je nespisovné (${v.jev}); spisovně „${v.spisovne}“.`,
    });
}

const L3: PracticeTask[] = [
  choice("Který tvar 7. pádu je spisovný?", "rukama", [
    { value: "kamarádama", why: "Spisovně s kamarády." },
    { value: "lidma", why: "Spisovně s lidmi." },
    { value: "dobrejma", why: "Spisovně s dobrými." },
  ], {
    hints: ["Která podstatná jména mají v 7. pádě množného čísla zvláštní tvar?", "Části těla, které máme v páru — ruce, nohy, oči, uši —, mají v 7. pádě spisovný tvar zakončený na -ma; ostatní slova ne."],
    explanation: "Rukama je spisovný tvar 7. pádu (ruce jsou párové); s kamarády, s lidmi, s dobrými.",
  }),
  choice("Které slovo bys napsal nebo napsala do slohové práce?", "očima", [
    { value: "klukama", why: "Spisovně s kluky." },
    { value: "holkama", why: "Spisovně s holkami." },
    { value: "stromama", why: "Spisovně se stromy." },
  ], {
    hints: ["Který tvar patří k části těla, kterou máme dvakrát?", "Oči, uši, ruce a nohy mají v 7. pádě spisovně -ma; ostatní slova ne."],
    explanation: "Očima je spisovné; s kluky, s holkami, se stromy.",
  }),
  choice("Které spojení je spisovné?", "s koňmi", [
    { value: "s koněma", why: "Spisovně s koňmi." },
    { value: "s psama", why: "Spisovně se psy." },
    { value: "s pánama", why: "Spisovně s pány." },
  ], {
    hints: ["Jak zní spisovně 7. pád od slova koně?", "Slovo kůň má v 7. pádě množného čísla spisovně tvar zakončený na -mi."],
    explanation: "Spisovně s koňmi; s koněma je nespisovné.",
  }),
  choice("Které slovo začíná na v- i ve spisovné češtině?", "vosa", [
    { value: "vokno", why: "Spisovně okno." },
    { value: "votevřít", why: "Spisovně otevřít." },
    { value: "von", why: "Spisovně on." },
  ], {
    hints: ["Které z těch slov má bez v- úplně jiný význam?", "Osa je čára, kolem které se něco otáčí; bodavý hmyz se spisovně jmenuje s v- na začátku."],
    explanation: "Vosa je spisovné slovo; ostatní mají nespisovné v- navíc (okno, otevřít, on).",
  }),
  choice("Který z těchto tvarů je spisovný?", "nohama", [
    { value: "rybama", why: "Spisovně s rybami." },
    { value: "autama", why: "Spisovně s auty." },
    { value: "dětma", why: "Spisovně s dětmi." },
  ], {
    hints: ["Které z těch slov označuje část těla v páru?", "Párové části těla mají v 7. pádě spisovně -ma, ostatní slova mají -y nebo -mi."],
    explanation: "Nohama je spisovné; s rybami, s auty, s dětmi.",
  }),
  choice("Která věta je celá spisovná?", "Byli jsme u babičky.", [
    { value: "Byli sme u babičky.", why: "Spisovně jsme." },
    { value: "Dyž pršelo, byli sme doma.", why: "Spisovně když a jsme." },
    { value: "Bylo tam moc dobrý jídlo.", why: "Spisovně dobré jídlo." },
  ], {
    hints: ["Přečti každou větu pozorně slovo po slovu.", "Hledej věty, kde je nespisovný tvar: vynechané j-, zjednodušené hlásky nebo špatná koncovka přídavného jména."],
    explanation: "Byli jsme u babičky. — ostatní věty obsahují nespisovné tvary.",
  }),
  choice("Najdi spisovný tvar.", "ušima", [
    { value: "pejskama", why: "Spisovně s pejsky." },
    { value: "kočkama", why: "Spisovně s kočkami." },
    { value: "sestrama", why: "Spisovně se sestrami." },
  ], {
    hints: ["Která z těch slov patří k části těla?", "Uši jsou párová část těla, a proto mají spisovně -ma v 7. pádě."],
    explanation: "Ušima je spisovné; s pejsky, s kočkami, se sestrami.",
  }),
  choice("Které slovo je nespisovné?", "ňákej", [
    { value: "nějaký", why: "Nějaký je spisovné." },
    { value: "který", why: "Který je spisovné." },
    { value: "jaký", why: "Jaký je spisovné." },
  ], {
    hints: ["Které slovo má na konci -ej?", "Spisovně se píše -ý a hláska ě; zjednodušený tvar patří do běžné mluvy."],
    explanation: "Ňákej je nespisovné, spisovně nějaký.",
  }),
  choice("Vyber spisovné spojení.", "s dobrými lidmi", [
    { value: "s dobrejma lidma", why: "Spisovně s dobrými lidmi." },
    { value: "s dobrýma lidma", why: "Spisovně -ými a -mi." },
    { value: "s dobrejmi lidmi", why: "Spisovně dobrými, ne dobrejmi." },
  ], {
    hints: ["Jak zní spisovně 7. pád množného čísla u přídavného jména a podstatného jména?", "Přídavné jméno má v 7. pádě množného čísla koncovku -ými, podstatné jméno lidé koncovku -mi."],
    explanation: "Spisovně: s dobrými lidmi.",
  }),
  choice("U kterého slova je v- na začátku spisovné?", "vydra", [
    { value: "vokurka", why: "Spisovně okurka." },
    { value: "vodpoledne", why: "Spisovně odpoledne." },
    { value: "vořech", why: "Spisovně ořech." },
  ], {
    hints: ["U kterého slova v- na začátek opravdu patří?", "Zvíře u řeky se spisovně jmenuje s v-; ostatní slova ho mají navíc jen v nespisovné řeči."],
    explanation: "Vydra je spisovné; okurka, odpoledne, ořech jsou spisovně bez v-.",
  }),
  choice("Která věta neobsahuje žádné nespisovné slovo?", "Dej mi mléko z ledničky.", [
    { value: "Dej mi mlíko z ledničky.", why: "Spisovně mléko." },
    { value: "Dej mi mléko z lendničky.", why: "Spisovně lednička." },
    { value: "Dej mně mlíko z ledničky.", why: "Mně je správně, ale mlíko je nespisovné." },
  ], {
    hints: ["Porovnej věty slovo po slově.", "Hledej -í- místo -é- a zkomolená slova; jedna věta je celá bez chyby."],
    explanation: "Dej mi mléko z ledničky. — ostatní obsahují nespisovné tvary.",
  }),
  choice("Které spojení bys použil nebo použila v dopise řediteli?", "s dětmi", [
    { value: "s dětma", why: "Spisovně s dětmi." },
    { value: "s děckama", why: "Děcka i -ma jsou nespisovné." },
    { value: "s dítěma", why: "Spisovně s dětmi." },
  ], {
    hints: ["Jak zní 7. pád množného čísla od slova děti?", "Děti se skloňují jako kosti: s kostmi — s …"],
    explanation: "Spisovně s dětmi.",
  }),
  choice("Který tvar je spisovný ve větě „My ___ šli do kina.“?", "bychom", [
    { value: "bysme", why: "Bysme je nespisovné." },
    { value: "bychme", why: "Takový tvar neexistuje." },
    { value: "bysem", why: "Takový tvar neexistuje." },
  ], {
    hints: ["Jak zní spisovně: My ___ šli do kina.", "Spisovný tvar pro 1. osobu množného čísla v podmiňovacím způsobu končí na -chom."],
    explanation: "Spisovně bychom; bysme patří do běžné mluvy.",
  }),
];

function gen(level: number): PracticeTask[] {
  if (level === 1) return shuffle(PARY.map((_, i) => vyberSpisovne(i)));
  if (level === 2) return shuffle(VETY.map(najdiVeVete));
  return shuffle(L3);
}

export const SLOVASPISOVNAANESPISOVNA: TopicMetadata[] = [
  {
    id: "g5-cjl-jazykova-vychova-nauka-o-slove-slova-spisovna-a-nespisovna",
    rvpNodeId: "g5-cjl-jazykova-vychova-nauka-o-slove-slova-spisovna-a-nespisovna",
    title: "Slova spisovná a nespisovná",
    studentTitle: "Spisovná čeština",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Nauka o slově",
    briefDescription: "Poznáš, kdy mluvíme spisovně a kdy hovorově.",
    keywords: ["spisovná čeština", "nespisovná", "hovorová", "nářečí", "slang"],
    goals: [
      "Rozlišit spisovné a nespisovné výrazy",
      "Převést nespisovné slovo do jeho spisovné podoby",
      "Uvést, kdy se hodí která vrstva jazyka",
    ],
    boundaries: [
      "Neprobíráme hlubokou dialektologii",
      "Bez složité fonetické terminologie",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Zeptej se sám nebo sama sebe: 'Řekl/a bych to řediteli školy nebo napsal/a v novinách?' Pokud ano – je to asi spisovné.",
      steps: [
        "Přemýšlej, v jaké situaci se slovo používá.",
        "Zkus si vzpomenout, zda je slovo v učebnici nebo jen v hovoru.",
        "Porovnej s neutrálním výrazem, který znáš ze školy.",
      ],
      commonMistake: "Žáci si pletou hovorové výrazy (brácha, kluk) s plně nespisovnými. Hovorové jsou přijatelné v mluvě, ale ne ve formálním textu.",
      example: "Slovo 'ksicht' → nespisovné; 'obličej' → spisovné. Slovo 'brácha' → hovorové; 'bratr' → neutrálně spisovné.",
    },
  },
];
