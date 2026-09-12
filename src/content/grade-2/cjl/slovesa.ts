import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "@/content/grade-3/_shared";

// Přepsáno 2026-09-11 (inventura obsahu). Dřív 8 úloh na úroveň, jedna nápověda,
// žádná zpětná vazba. Teď tři oddělené banky:
// L1 poznat sloveso mezi samostatnými slovy (podstatná a přídavná jména kolem
// jednoho tématu) · L2 najít sloveso v jednoduché větě · L3 přenos: v rodině
// příbuzných slov odlišit sloveso od názvu činnosti (zpívat × zpěv) a najít
// sloveso ve větě, kde past tvoří název činnosti nebo kde sloveso vyjadřuje stav.

// PJ podstatné jméno · CIN podstatné jméno = název činnosti · PR přídavné jméno · OK slovo o okolnosti (jak, kdy, kde)
type Druh = "PJ" | "CIN" | "PR" | "OK";
const PROC_NE: Record<Druh, string> = {
  PJ: "je podstatné jméno — odpovídá na otázku kdo nebo co, neříká, co se děje",
  CIN: "je podstatné jméno — je to jen název činnosti (odpovídá na otázku co?), neříká, že to někdo dělá",
  PR: "je přídavné jméno — říká, jaký kdo nebo co je",
  OK: "říká, jak, kdy nebo kde se něco děje, ale samo děj neoznačuje",
};
type Slovo = [string, Druh];
const tri = (d: Slovo[]) => d.map(([w, k]) => ({ value: w, why: `„${w}“ ${PROC_NE[k]}.` })) as [Distractor, Distractor, Distractor];

// ── L1: samostatná slova kolem jednoho tématu ─────────────────────────────────
// [téma (6. pád), sloveso, co sloveso říká, tři jiná slova]
const L1: [string, string, string, Slovo[]][] = [
  ["psovi", "štěká", "co pes dělá", [["bouda", "PJ"], ["chlupatý", "PR"], ["obojek", "PJ"]]],
  ["škole", "píše", "co dělá žák", [["tabule", "PJ"], ["pilný", "PR"], ["sešit", "PJ"]]],
  ["zahradě", "kvete", "co dělá květina", [["tulipán", "PJ"], ["zelený", "PR"], ["konev", "PJ"]]],
  ["kuchyni", "vaří", "co dělá kuchař", [["hrnec", "PJ"], ["horký", "PR"], ["polévka", "PJ"]]],
  ["zimě", "mrzne", "co se děje, když je velká zima", [["sníh", "PJ"], ["studený", "PR"], ["sáňky", "PJ"]]],
  ["kočce", "přede", "co dělá spokojená kočka", [["myš", "PJ"], ["hebká", "PR"], ["mléko", "PJ"]]],
  ["lese", "roste", "co dělá strom nebo houba", [["houba", "PJ"], ["vysoký", "PR"], ["mech", "PJ"]]],
  ["hřišti", "běhá", "co dělá dítě", [["míč", "PJ"], ["rychlý", "PR"], ["branka", "PJ"]]],
  ["moři", "plave", "co dělá ryba", [["vlna", "PJ"], ["slaný", "PR"], ["písek", "PJ"]]],
  ["ptácích", "zpívá", "co dělá ptáček", [["hnízdo", "PJ"], ["malý", "PR"], ["peří", "PJ"]]],
  ["hudbě", "hraje", "co dělá muzikant", [["kytara", "PJ"], ["veselý", "PR"], ["písnička", "PJ"]]],
  ["počasí", "prší", "co se venku děje, když padá voda z mraků", [["mrak", "PJ"], ["mokrý", "PR"], ["deštník", "PJ"]]],
  ["obchodě", "nakupuje", "co dělá zákazník", [["košík", "PJ"], ["drahý", "PR"], ["pokladna", "PJ"]]],
  ["noci", "spí", "co dělají děti v noci", [["postel", "PJ"], ["tmavý", "PR"], ["polštář", "PJ"]]],
];

function l1([o, v, co, d]: (typeof L1)[number]): PracticeTask {
  return choice(`Slova o ${o}: které z nich je sloveso?`, v, tri(d), {
    hints: [
      `Které ze slov o ${o} říká, co někdo nebo něco dělá?`,
      `Ke každému slovu o ${o} si polož otázku. Kdo nebo co? — to je podstatné jméno. Jaký? — to je přídavné jméno. Co dělá? — to je sloveso. Vyber slovo, které odpovídá na „co dělá“.`,
    ],
    explanation: `„${v}“ říká, ${co}. Označuje děj, proto je to sloveso. Ostatní slova pojmenovávají věci nebo vlastnosti.`,
  });
}

// ── L2: sloveso v jednoduché větě ────────────────────────────────────────────
// [věta, sloveso, kdo/co to dělá (pro vysvětlení), tři jiná slova z věty]
const L2: [string, string, string, Slovo[]][] = [
  ["Máma vaří v kuchyni polévku.", "vaří", "máma", [["Máma", "PJ"], ["kuchyni", "PJ"], ["polévku", "PJ"]]],
  ["Malý pes skáče přes plot.", "skáče", "pes", [["Malý", "PR"], ["pes", "PJ"], ["plot", "PJ"]]],
  ["Žák čte zajímavou knihu.", "čte", "žák", [["Žák", "PJ"], ["zajímavou", "PR"], ["knihu", "PJ"]]],
  ["Studený vítr fouká od hor.", "fouká", "vítr", [["Studený", "PR"], ["vítr", "PJ"], ["hor", "PJ"]]],
  ["Ptáci letí do teplých krajů.", "letí", "ptáci", [["Ptáci", "PJ"], ["teplých", "PR"], ["krajů", "PJ"]]],
  ["Černá kočka sedí na střeše.", "sedí", "kočka", [["Černá", "PR"], ["kočka", "PJ"], ["střeše", "PJ"]]],
  ["Tomáš píše dlouhý dopis.", "píše", "Tomáš", [["Tomáš", "PJ"], ["dlouhý", "PR"], ["dopis", "PJ"]]],
  ["Na louce kvetou žluté pampelišky.", "kvetou", "pampelišky", [["louce", "PJ"], ["žluté", "PR"], ["pampelišky", "PJ"]]],
  ["Děti staví velký hrad z písku.", "staví", "děti", [["Děti", "PJ"], ["velký", "PR"], ["hrad", "PJ"]]],
  ["Babička peče sladkou buchtu.", "peče", "babička", [["Babička", "PJ"], ["sladkou", "PR"], ["buchtu", "PJ"]]],
  ["Hasiči rychle hasí požár.", "hasí", "hasiči", [["Hasiči", "PJ"], ["rychle", "OK"], ["požár", "PJ"]]],
  ["Každé ráno hlasitě zvoní starý budík.", "zvoní", "budík", [["hlasitě", "OK"], ["starý", "PR"], ["budík", "PJ"]]],
  ["Rybář chytá v řece ryby.", "chytá", "rybář", [["Rybář", "PJ"], ["řece", "PJ"], ["ryby", "PJ"]]],
  ["Malá Ema maluje barevného motýla.", "maluje", "Ema", [["Malá", "PR"], ["Ema", "PJ"], ["motýla", "PJ"]]],
];

const MNOZNE = new Set(["ptáci", "pampelišky", "děti", "hasiči"]);

function l2([veta, v, kdo, d]: (typeof L2)[number]): PracticeTask {
  const dela = MNOZNE.has(kdo) ? "dělají" : "dělá";
  return choice(`Najdi sloveso ve větě: „${veta}“`, v, tri(d), {
    // Nápověda větu necituje — obsahuje sloveso, a tím by prozradila klíč.
    hints: [
      `Ve větě něco ${dela} ${kdo}. Které slovo říká, co ${kdo} ${dela}?`,
      `Polož si otázku „co ${dela} ${kdo}?“. Slovo, které na ni odpovídá, je sloveso. Slova, která odpovídají na otázku kdo, co nebo jaký (třeba ${d[0][0]} nebo ${d[1][0]}), slovesa nejsou.`,
    ],
    explanation: `Ve větě „${veta}“ odpovídá slovo „${v}“ na otázku „co ${dela} ${kdo}?“. Označuje děj, proto je to sloveso.`,
  });
}

// ── L3a: rodina příbuzných slov — sloveso × název činnosti ───────────────────
// [název činnosti, sloveso, spojení s „budu“, osoba, vlastnost]
const RODINY: [string, string, string, string, string][] = [
  ["zpěv", "zpívat", "budu zpívat", "zpěvák", "zpěvný"],
  ["běh", "běhat", "budu běhat", "běžec", "běžecký"],
  ["skok", "skákat", "budu skákat", "skokan", "skokanský"],
  ["malba", "malovat", "budu malovat", "malíř", "malovaný"],
  ["hra", "hrát", "budu hrát", "hráč", "hravý"],
  ["plavání", "plavat", "budu plavat", "plavec", "plavecký"],
  ["let", "létat", "budu létat", "letec", "letecký"],
  ["práce", "pracovat", "budu pracovat", "pracovník", "pracovitý"],
  ["smích", "smát se", "budu se smát", "smíšek", "směšný"],
  ["jízda", "jezdit", "budu jezdit", "jezdec", "jízdní"],
];

function rodina([n, v, budu, osoba, vl]: (typeof RODINY)[number]): PracticeTask {
  return choice(`Slova jsou příbuzná se slovem „${n}“. Které z nich je sloveso?`, v, [
    { value: n, why: `„${n}“ ${PROC_NE.CIN}.` },
    { value: osoba, why: `„${osoba}“ je podstatné jméno — pojmenovává osobu (kdo?), ne děj.` },
    { value: vl, why: `„${vl}“ ${PROC_NE.PR}.` },
  ], {
    hints: [
      `Které slovo z rodiny „${n}“ můžeš spojit se slovem „budu“ nebo „budeš“?`,
      `Pozor: „${n}“ je taky činnost, ale jen její název — odpovídá na otázku co? Sloveso říká, co někdo dělá, a dá se s ním říct „já budu…“ nebo „ty budeš…“. Osoba (kdo?) ani vlastnost (jaký?) sloveso není.`,
    ],
    explanation: `„${v}“ je sloveso — říká, co někdo dělá, a můžeš říct „${budu}“. „${n}“ je jen název té činnosti, „${osoba}“ pojmenovává osobu a „${vl}“ vlastnost.`,
  });
}

// ── L3b: sloveso ve větě s pastí (název činnosti) nebo se slovesem stavu ─────
interface Rucni { veta: string; v: string; d: Slovo[]; h: [string, string]; e: string }
const PASTI: Rucni[] = [
  {
    veta: "Zpěv ptáků nás ráno budí.", v: "budí", d: [["Zpěv", "CIN"], ["ptáků", "PJ"], ["ráno", "OK"]],
    h: ["Jedno slovo ve větě zní jako činnost, ale je to název. Co zpěv ptáků dělá?", "„Zpěv“ odpovídá na otázku co? — je to podstatné jméno. Hledej slovo, které odpovídá na otázku „co dělá zpěv ptáků?“. Takové slovo je sloveso."],
    e: "Slovo „budí“ odpovídá na otázku „co dělá zpěv ptáků?“, proto je sloveso. „Zpěv“ je jen název činnosti — podstatné jméno.",
  },
  {
    veta: "Běh na lyžích mě moc baví.", v: "baví", d: [["Běh", "CIN"], ["lyžích", "PJ"], ["moc", "OK"]],
    h: ["„Běh“ zní jako činnost. Je to ale sloveso, nebo název? Co běh na lyžích dělá?", "Zkus říct „já budu běh“ — nejde to, „běh“ je podstatné jméno. Hledej slovo, které odpovídá na otázku „co dělá běh na lyžích?“."],
    e: "„Baví“ odpovídá na otázku „co dělá běh na lyžích?“, proto je sloveso. „Běh“ je název činnosti, tedy podstatné jméno.",
  },
  {
    veta: "Po obědě je čas na odpočinek.", v: "je", d: [["obědě", "PJ"], ["čas", "PJ"], ["odpočinek", "CIN"]],
    h: ["V této větě nikdo nic nedělá. Které slovo vyjadřuje stav?","Sloveso neoznačuje jen činnost, ale i stav — třeba „být“, „ležet“, „spát“. Zkus každé slovo spojit s „já“: které z nich se dá říct jako „já jsem“? „Odpočinek“ je jen název činnosti."],
    e: "Slovo „je“ patří ke slovesu „být“ a označuje stav. I stav je děj, proto je „je“ sloveso. „Odpočinek“ je podstatné jméno.",
  },
  {
    veta: "Dědeček leží v posteli nemocný.", v: "leží", d: [["Dědeček", "PJ"], ["posteli", "PJ"], ["nemocný", "PR"]],
    h: ["Dědeček nic nedělá, ale nějak se má. Které slovo říká, v jakém je stavu?", "Sloveso může označovat i stav, kdy se nic nehýbe (sedí, stojí, spí). Slovo „nemocný“ říká, jaký dědeček je — to je vlastnost. Hledej slovo, které odpovídá na otázku „co dělá dědeček?“."],
    e: "„Leží“ odpovídá na otázku „co dělá dědeček?“ a označuje stav, proto je to sloveso. „Nemocný“ je vlastnost — přídavné jméno.",
  },
];

const past = (x: Rucni): PracticeTask => choice(`Najdi sloveso ve větě: „${x.veta}“`, x.v, tri(x.d), { hints: x.h, explanation: x.e });

function gen(level: number): PracticeTask[] {
  if (level === 1) return shuffle(L1).map(l1);
  if (level === 2) return shuffle(L2).map(l2);
  return shuffle([...RODINY.map(rodina), ...PASTI.map(past)]);
}

export const SLOVESA: TopicMetadata[] = [
  {
    id: "g2-cjl-jazykova-vychova-tvaroslovi-slovesa-rozliseni-slovesneho-druhu",
    rvpNodeId: "g2-cjl-jazykova-vychova-tvaroslovi-slovesa-rozliseni-slovesneho-druhu",
    title: "Slovesa (rozlišení slovesného druhu)",
    studentTitle: "Co dělá?",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Tvarosloví",
    briefDescription: "Naučíš se poznat sloveso ve větě.",
    keywords: ["sloveso", "děj", "stav", "věta", "běžet", "sedět", "číst"],
    goals: [
      "Vědět, že sloveso označuje děj nebo stav.",
      "Poznat sloveso ve větě.",
      "Odlišit sloveso od podstatného a přídavného jména.",
    ],
    boundaries: ["Pouze rozlišení slovesa.", "Bez časování a tvarů."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Sloveso říká, co osoba nebo věc DĚLÁ nebo JAK SE NACHÁZÍ.",
      steps: ["Přečti větu nebo tři slova.", "Které slovo říká, co se dělá nebo děje?", "To je sloveso."],
      commonMistake: "Záměna slovesa s podstatným jménem — 'zpěv' je věc, 'zpívat' je sloveso.",
      example: "Pes (věc) / rychlý (vlastnost) / běhá (sloveso — co pes dělá?).",
    },
  },
];
