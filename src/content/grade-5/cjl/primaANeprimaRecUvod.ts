import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";
import { urceni, type Kategorie, type Polozka } from "../_urceni";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// zpětné vazby a v zadání se míchaly uvozovky otázky s uvozovkami ukázky.
// Teď: L1 poznat přímou a nepřímou řeč · L2 doplnit znaménko do zápisu přímé
// řeči (dvojtečka, čárka, otazník, vykřičník) · L3 převést přímou řeč na
// nepřímou (čárka před že, změna osoby). Na L2 se vybírá název znaménka, ne
// celá věta — věty lišící se jen interpunkcí audit nerozliší.

// ── L1: poznávání ────────────────────────────────────────────────────────────
const DRUHY: Kategorie[] = [
  { nazev: "přímá řeč", znak: "slova postavy zapsaná doslova v uvozovkách (Petr řekl: „Přijdu.“)." },
  { nazev: "nepřímá řeč", znak: "slova postavy převyprávěná bez uvozovek, obvykle za že, ať, jestli (Petr řekl, že přijde.)." },
  { nazev: "věta bez řeči postavy", znak: "vypravěč jen popisuje děj, nikdo nemluví." },
];
const PR = "přímá řeč", NP = "nepřímá řeč", BZ = "věta bez řeči postavy";
const V = (veta: string, kategorie: string, klic: string, proc: string): Polozka => ({ uroven: 1, slovo: veta, veta, kategorie, klic, proc });
const L1_BANKA: Polozka[] = [
  V("Petr řekl: „Přijdu zítra.“", PR, "slova postavy stojí v uvozovkách přesně tak, jak je řekla", "Slova Petra jsou doslova v uvozovkách — přímá řeč."),
  V("Petr řekl, že přijde zítra.", NP, "Petrova slova jsou převyprávěná a začínají slovem že", "Petrova slova jsou převyprávěná bez uvozovek — nepřímá řeč."),
  V("Petr přišel domů pozdě.", BZ, "nikdo tu nemluví, vypravěč jen popisuje", "Nikdo nemluví — věta bez řeči postavy."),
  V("„Kde bydlíš?“ zeptala se Eva.", PR, "otázka Evy je v uvozovkách", "Evina otázka je doslova v uvozovkách — přímá řeč."),
  V("Eva se zeptala, kde bydlím.", NP, "Evina otázka je převyprávěná bez uvozovek", "Otázka je převyprávěná — nepřímá řeč."),
  V("Eva bydlí v Brně.", BZ, "je to jen oznámení, nikdo nemluví", "Nikdo nemluví — věta bez řeči postavy."),
  V("„Pozor!“ vykřikl hasič.", PR, "výkřik hasiče je v uvozovkách", "Výkřik je doslova v uvozovkách — přímá řeč."),
  V("Hasič vykřikl, ať si dáme pozor.", NP, "hasičova slova jsou převyprávěná a začínají slovem ať", "Převyprávěný výkřik — nepřímá řeč."),
  V("Babička se usmála: „To je hezké.“", PR, "za dvojtečkou jsou v uvozovkách slova babičky", "Slova babičky jsou v uvozovkách — přímá řeč."),
  V("Babička řekla, že je to hezké.", NP, "babiččina slova jsou převyprávěná za že", "Převyprávěná slova — nepřímá řeč."),
  V("Hasič hasil požár celou noc.", BZ, "vypravěč jen popisuje práci hasiče", "Nikdo nemluví — věta bez řeči postavy."),
  V("Učitelka se ptala, jestli máme úkol.", NP, "otázka učitelky je převyprávěná za jestli", "Převyprávěná otázka — nepřímá řeč."),
  V("Tomáš zavolal: „Počkej na mě!“", PR, "Tomášovo zvolání je v uvozovkách", "Tomášova slova jsou doslova v uvozovkách — přímá řeč."),
];

// ── L2: znaménka v zápisu přímé řeči ─────────────────────────────────────────
interface Vypoved { pred: string; za: string; text: string; konec: "." | "?" | "!" }
const VYPOVEDI: Vypoved[] = [
  { pred: "Máma řekla", za: "řekla máma", text: "Pojď ven", konec: "." },
  { pred: "Táta se zeptal", za: "zeptal se táta", text: "Máš hotový úkol", konec: "?" },
  { pred: "Jana zavolala", za: "zavolala Jana", text: "Počkej na mě", konec: "!" },
  { pred: "Petr řekl", za: "řekl Petr", text: "Zítra přijdu", konec: "." },
  { pred: "Babička se zeptala", za: "zeptala se babička", text: "Chceš ještě koláč", konec: "?" },
  { pred: "Trenér vykřikl", za: "vykřikl trenér", text: "Běž rychleji", konec: "!" },
  { pred: "Eva řekla", za: "řekla Eva", text: "Mám nové kolo", konec: "." },
  { pred: "Učitelka se zeptala", za: "zeptala se učitelka", text: "Kdo chybí", konec: "?" },
];
const VZOR_PRED = "Děda řekl: „Dobrou noc.“";
const VZOR_ZA: Record<"." | "?" | "!", string> = {
  ".": "„Dobrou noc,“ řekl děda.",
  "?": "„Kolik je hodin?“ zeptal se děda.",
  "!": "„Pozor!“ vykřikl děda.",
};
const ZNAMENKO: Record<"." | "?" | "!", string> = { ".": "čárka", "?": "otazník", "!": "vykřičník" };

function predUloha(v: Vypoved): PracticeTask {
  return choice(`Které znaménko patří na vynechané místo? ${v.pred}___ „${v.text}${v.konec}“`, "dvojtečka", [
    { value: "čárka", why: "Čárka se píše, když uvozovací věta stojí až za přímou řečí." },
    { value: "tečka", why: "Tečka by větu ukončila, ale přímá řeč teprve přijde." },
    { value: "žádné", why: "Před přímou řečí musí stát znaménko, které ji uvede." },
  ], {
    hints: [
      `Stojí slova „${v.pred}“ před přímou řečí, nebo za ní?`,
      `Podívej se na stejně stavěnou větu: ${VZOR_PRED} Které znaménko stojí ve vzoru hned za slovem „řekl“?`,
    ],
    explanation: `Správně: ${v.pred}: „${v.text}${v.konec}“ — uvozovací věta před přímou řečí končí dvojtečkou.`,
  });
}

function zaUloha(v: Vypoved): PracticeTask {
  const klic = ZNAMENKO[v.konec];
  const chyby: Record<string, { value: string; why: string }[]> = {
    "čárka": [
      { value: "tečka", why: "Věta pokračuje uvozovací větou, proto se oznámení neukončuje tečkou." },
      { value: "dvojtečka", why: "Dvojtečka se píše před přímou řečí, ne na jejím konci." },
      { value: "žádné", why: "Oznámení před uvozovací větou končí uvnitř uvozovek znaménkem." },
    ],
    "otazník": [
      { value: "čárka", why: "Otázka končí otazníkem i tehdy, když za ní následuje uvozovací věta." },
      { value: "tečka", why: "Je to otázka, ne oznámení." },
      { value: "vykřičník", why: "Je to otázka, ne zvolání." },
    ],
    "vykřičník": [
      { value: "čárka", why: "Zvolání končí vykřičníkem i tehdy, když za ním následuje uvozovací věta." },
      { value: "tečka", why: "Je to zvolání, ne oznámení." },
      { value: "otazník", why: "Není to otázka, ale zvolání." },
    ],
  };
  const spravne = `„${v.text}${v.konec === "." ? "," : v.konec}“ ${v.za}.`;
  return choice(`Které znaménko patří na vynechané místo? „${v.text}___“ ${v.za}.`, klic, chyby[klic] as never, {
    hints: [
      `Je věta „${v.text}“ oznámení, otázka, nebo zvolání?`,
      `Podívej se na stejně stavěnou větu: ${VZOR_ZA[v.konec]} Které znaménko je ve vzoru uvnitř uvozovek na konci?`,
    ],
    explanation: `Správně: ${spravne}`,
  });
}

// ── L3: převod na nepřímou řeč ──────────────────────────────────────────────
type Prevod = [string, string, string, string];
// [přímá řeč, správná nepřímá, nepřímá se špatnou osobou, proč osoba]
const PREVODY: Prevod[] = [
  ["Jana řekla: „Mám hlad.“", "Jana řekla, že má hlad.", "Jana řekla, že mám hlad.", "Hlad má Jana, ne ty — sloveso je ve 3. osobě."],
  ["Petr řekl: „Jdu domů.“", "Petr řekl, že jde domů.", "Petr řekl, že jdu domů.", "Domů jde Petr — sloveso ve 3. osobě."],
  ["Babička řekla: „Upeču koláč.“", "Babička řekla, že upeče koláč.", "Babička řekla, že upeču koláč.", "Péct bude babička — upeče."],
  ["Tomáš řekl: „Jsem unavený.“", "Tomáš řekl, že je unavený.", "Tomáš řekl, že jsem unavený.", "Unavený je Tomáš — je."],
  ["Učitelka řekla: „Zítra píšeme test.“", "Učitelka řekla, že zítra píšou test.", "Učitelka řekla, že zítra píšeme test.", "O žácích se v nepřímé řeči mluví ve 3. osobě — píšou."],
  ["Děti volaly: „Máme radost!“", "Děti volaly, že mají radost.", "Děti volaly, že máme radost.", "Radost mají děti — mají."],
  ["Martin řekl: „Mám nové kolo.“", "Martin řekl, že má nové kolo.", "Martin řekl, že mám nové kolo.", "Kolo má Martin — má."],
  ["Kamarádka napsala: „Přijedu v sobotu.“", "Kamarádka napsala, že přijede v sobotu.", "Kamarádka napsala, že přijedu v sobotu.", "Přijede kamarádka — přijede."],
  ["Táta mi řekl: „Opravím ti kolo.“", "Táta mi řekl, že mi opraví kolo.", "Táta mi řekl, že ti opravím kolo.", "Opravovat bude táta a kolo je moje — že mi opraví."],
  ["Sestra řekla: „Uklidím si pokoj.“", "Sestra řekla, že si uklidí pokoj.", "Sestra řekla, že si uklidím pokoj.", "Uklízet bude sestra — uklidí."],
  ["Honza řekl: „Neumím plavat.“", "Honza řekl, že neumí plavat.", "Honza řekl, že neumím plavat.", "Plavat neumí Honza — neumí."],
  ["Maminka mi řekla: „Jsem na tebe pyšná.“", "Maminka mi řekla, že je na mě pyšná.", "Maminka mi řekla, že jsem na tebe pyšná.", "Pyšná je maminka a pyšná je na mě — že je na mě pyšná."],
  ["Soused řekl: „Bydlím tady deset let.“", "Soused řekl, že tady bydlí deset let.", "Soused řekl, že tady bydlím deset let.", "Bydlí soused — bydlí."],
];

function prevodUloha([prima, spravne, osoba, proc]: Prevod): PracticeTask {
  const at = spravne.replace(", že", ", ať");
  const jestli = spravne.replace(", že", ", jestli");
  return choice(`Převeď do nepřímé řeči: ${prima}`, spravne, [
    { value: osoba, why: `Osoba zůstala jako v přímé řeči. ${proc}` },
    { value: at, why: "Spojkou ať se převypráví výzva nebo přání; postava tu jen něco oznamuje, proto že." },
    { value: jestli, why: "Spojkou jestli se převypráví otázka; postava se tu na nic neptá, proto že." },
  ], {
    hints: [
      `Kdo v přímé řeči ${prima} mluví a o kom teď budeš vyprávět ty?`,
      "V nepřímé řeči nejsou uvozovky, oznámení uvádí spojka že, výzvu ať, otázku jestli, a slovesa se mění podle toho, o kom vyprávíš: postava řekne „mám“, ty o ní řekneš „má“.",
    ],
    explanation: `${spravne} ${proc}`,
  });
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return urceni(L1_BANKA, DRUHY, 1, (p) => ({
    question: `Co obsahuje tato věta? ${p.veta}`,
    hints: [`Podívej se na větu ${p.veta} Jsou v ní uvozovky a mluví v ní někdo?`, `Pomůže tohle: ${p.klic}.`],
  }));
  if (level === 2) return shuffle([...VYPOVEDI.map(predUloha), ...VYPOVEDI.map(zaUloha)]);
  return shuffle(PREVODY.map(prevodUloha));
}

export const PRIMAANEPRIMARECUVOD: TopicMetadata[] = [
  {
    id: "g5-cjl-jazykova-vychova-skladba-prima-a-neprima-rec-uvod",
    rvpNodeId: "g5-cjl-jazykova-vychova-skladba-prima-a-neprima-rec-uvod",
    title: "Přímá a nepřímá řeč (úvod)",
    studentTitle: "Přímá a nepřímá řeč",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Skladba",
    briefDescription: "Naučíš se přepsat přímou řeč na nepřímou a zpět.",
    keywords: ["přímá řeč", "nepřímá řeč", "uvozovky", "uvozovací věta"],
    goals: [
      "Rozlišit přímou a nepřímou řeč",
      "Převést přímou řeč do nepřímé a naopak",
      "Správně napsat interpunkci při přímé řeči",
    ],
    boundaries: [
      "Neprobírá se polopřímá řeč ani složitá literární analýza",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Přímá řeč = doslova citovaná slova v uvozovkách. Nepřímá řeč = přeformulovaná bez uvozovek, s 'že / aby / jestli'.",
      steps: [
        "Najdi, co bylo řečeno.",
        "Zjisti, kdo to řekl (uvozovací věta).",
        "Přepis: přímá → nepřímá: přidej 'že', odstraň uvozovky, změň osobu.",
        "Přepis: nepřímá → přímá: odstraň 'že', přidej uvozovky, vrať osobu.",
      ],
      commonMistake: "Žáci zapomenou změnit osobu (já → on/ona) nebo zapomenou přidat/odebrat uvozovky.",
      example: "Přímá: Jana řekla: „Jsem unavená.“ Nepřímá: Jana řekla, že je unavená.",
    },
  },
];
