import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 3. ročníku). L3 byla sjednocením L1 a L2 (po
// odečtení nižších úrovní zbyly dvě úlohy), nápovědy byly u všech úloh stejné
// a chybné možnosti neměly zpětnou vazbu. Teď:
// L1 synonymum (slovo s podobným významem) · L2 antonymum (opak)
// · L3 synonymum nebo opak přímo ve větě.

// [slovo, správně, past (opak u synonym / podobné slovo u antonym), další dvě chybné]
type Radek = [string, string, string, string, string];

const SYNONYMA: Radek[] = [
  ["radost", "štěstí", "smutek", "strach", "únava"], ["hezký", "pěkný", "ošklivý", "velký", "rychlý"],
  ["mluvit", "povídat", "mlčet", "spát", "běhat"], ["přítel", "kamarád", "nepřítel", "soused", "učitel"],
  ["smutný", "nešťastný", "veselý", "hladový", "malý"], ["les", "háj", "louka", "pole", "řeka"],
  ["auto", "vůz", "kolo", "vlak", "loď"], ["unavený", "vyčerpaný", "odpočatý", "veselý", "hladový"],
  ["chytrý", "bystrý", "hloupý", "líný", "pomalý"], ["brečet", "plakat", "smát se", "zpívat", "spát"],
  ["velký", "veliký", "malý", "úzký", "lehký"], ["začít", "zahájit", "skončit", "odejít", "usnout"],
  ["dům", "obydlí", "zahrada", "ulice", "plot"],
];
const ANTONYMA: Radek[] = [
  ["velký", "malý", "veliký", "dlouhý", "těžký"], ["rychlý", "pomalý", "spěšný", "hlasitý", "veselý"],
  ["horký", "studený", "teplý", "sladký", "slaný"], ["světlý", "tmavý", "jasný", "zářivý", "barevný"],
  ["nový", "starý", "moderní", "drahý", "čistý"], ["tvrdý", "měkký", "pevný", "těžký", "hladký"],
  ["začátek", "konec", "úvod", "střed", "přestávka"], ["otevřený", "zavřený", "rozevřený", "dřevěný", "velký"],
  ["nahoru", "dolů", "výš", "doprava", "dopředu"], ["silný", "slabý", "mocný", "velký", "rychlý"],
  ["plný", "prázdný", "naplněný", "těžký", "teplý"], ["přijít", "odejít", "dorazit", "přiběhnout", "zavolat"],
  ["čistý", "špinavý", "umytý", "bílý", "nový"],
];
// [věta, slovo, podobný (true) / opačný (false), správně, past, další dvě]
const VE_VETE: [string, string, boolean, string, string, string, string][] = [
  ["Byl to pěkný výlet.", "pěkný", true, "krásný", "ošklivý", "nudný", "rychlý"],
  ["Tatínek řekl pravdu.", "řekl", true, "sdělil", "zamlčel", "zapsal", "zapomněl"],
  ["Na zahradě roste vysoký strom.", "vysoký", false, "nízký", "veliký", "zelený", "starý"],
  ["Kočka tiše spala.", "tiše", false, "hlasitě", "potichu", "klidně", "rychle"],
  ["Ta polévka je horká.", "horká", false, "studená", "teplá", "slaná", "hustá"],
  ["Lucka je veselá holka.", "veselá", true, "radostná", "smutná", "ospalá", "malá"],
  ["Petr běžel rychle.", "rychle", false, "pomalu", "spěšně", "daleko", "vesele"],
  ["Babička má laskavé oči.", "laskavé", true, "hodné", "zlé", "modré", "velké"],
  ["V pokoji byla tma.", "tma", false, "světlo", "šero", "noc", "zima"],
  ["Kamarád mi pomohl s úkolem.", "Kamarád", true, "Přítel", "Nepřítel", "Soused", "Učitel"],
  ["Dveře jsou zavřené.", "zavřené", false, "otevřené", "zamčené", "dřevěné", "nové"],
  ["Pes hlasitě štěkal.", "hlasitě", true, "nahlas", "potichu", "pomalu", "krátce"],
  ["Venku je chladno.", "chladno", false, "teplo", "zima", "mlha", "ticho"],
];

function synonymum([w, a, past, d1, d2]: Radek): PracticeTask {
  return choice(`Které slovo má PODOBNÝ význam jako „${w}“?`, a, [
    { value: past, why: `„${past}“ znamená opak, ne totéž.` },
    { value: d1, why: `„${d1}“ znamená něco jiného než „${w}“.` },
    { value: d2, why: `„${d2}“ znamená něco jiného než „${w}“.` },
  ], {
    hints: [
      `Jak bys slovo „${w}“ řekl nebo řekla jinak, aby věta znamenala totéž?`,
      `Synonymum má podobný význam: zkus ho dosadit místo „${w}“ do věty. Pozor, opak (třeba „${past}“) je něco jiného.`,
    ],
    explanation: `„${a}“ a „${w}“ mají podobný význam — jsou to synonyma.`,
  });
}

function antonymum([w, a, past, d1, d2]: Radek): PracticeTask {
  return choice(`Které slovo má OPAČNÝ význam jako „${w}“?`, a, [
    { value: past, why: `„${past}“ znamená skoro totéž, ne opak.` },
    { value: d1, why: `„${d1}“ není opak slova „${w}“.` },
    { value: d2, why: `„${d2}“ není opak slova „${w}“.` },
  ], {
    hints: [
      `Co je přesný opak slova „${w}“?`,
      `Antonymum má opačný význam. Pozor na slova s podobným významem, třeba „${past}“ — ta opak nejsou.`,
    ],
    explanation: `„${a}“ je opak slova „${w}“ — jsou to antonyma.`,
  });
}

function veVete([v, w, podobny, a, past, d1, d2]: [string, string, boolean, string, string, string, string]): PracticeTask {
  return choice(`Které slovo má ve větě „${v}“ ${podobny ? "PODOBNÝ" : "OPAČNÝ"} význam jako „${w}“?`, a, [
    { value: past, why: podobny ? `„${past}“ by smysl věty obrátilo.` : `„${past}“ by smysl věty zachovalo — to není opak.` },
    { value: d1, why: `„${d1}“ se do věty hodí, ale znamená něco jiného.` },
    { value: d2, why: `„${d2}“ se do věty hodí, ale znamená něco jiného.` },
  ], {
    hints: [
      `Dosaď každou možnost místo „${w}“ do věty „${v}“. Která ${podobny ? "zachová smysl" : "smysl obrátí"}?`,
      podobny
        ? "Hledáš synonymum: věta s ním musí znamenat totéž. Slova, která se do věty jen hodí, ale mění smysl, to nejsou."
        : "Hledáš antonymum: věta s ním musí znamenat pravý opak. Slovo s podobným významem by smysl nezměnilo.",
    ],
    explanation: podobny ? `„${a}“ má ve větě podobný význam jako „${w}“ — věta znamená totéž.` : `„${a}“ je opak slova „${w}“ — věta pak znamená pravý opak.`,
  });
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return shuffle(SYNONYMA).map(synonymum);
  if (level === 2) return shuffle(ANTONYMA).map(antonymum);
  return shuffle(VE_VETE).map(veVete);
}

export const SLOVASOUZNACNAPROTIKLADNA: TopicMetadata[] = [
  {
    id: "g3-cjl-jazykova-vychova-nauka-o-slove-slova-souznacna-synonyma-a-protikladna-antonyma",
    rvpNodeId: "g3-cjl-jazykova-vychova-nauka-o-slove-slova-souznacna-synonyma-a-protikladna-antonyma",
    title: "Slova souznačná (synonyma) a protikladná (antonyma)",
    studentTitle: "Podobná a opačná slova",
    illustrationDesc: "dvě skupiny balónků — jedna s nápisy radost a štěstí (synonyma), druhá velký a malý s šipkami mezi nimi (antonyma), kreslené postavičky s výrazy obličejů",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Nauka o slově",
    briefDescription: "Poznáš slova s podobným i opačným významem a správně je použiješ.",
    keywords: ["synonyma", "antonyma", "souznačná slova", "protikladná slova", "význam slov"],
    goals: [
      "Rozpoznat synonyma (slova podobného významu).",
      "Rozpoznat antonyma (slova opačného významu).",
      "Vybrat vhodné synonymum ve větě.",
    ],
    boundaries: ["Základní slovní zásoba 3. ročníku", "Bez homonym a polysémie"],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Synonyma: radost = štěstí, hezký = pěkný. Antonyma: velký × malý, nový × starý.",
      steps: [
        "Přečti slovo a rozmysli, jaký má význam.",
        "Synonym: hledáš slovo, které říká totéž. Antonum: hledáš slovo s opačným významem.",
      ],
      commonMistake: "Záměna: hledat antonymum, ale vybrat synonymum (nebo naopak). Pozor na zadání — 'podobný' nebo 'opačný'?",
      example: "Synonymum k 'radost': štěstí, veselí, potěšení. Antonymum k 'radost': smutek, zármutek.",
    },
  },
];
