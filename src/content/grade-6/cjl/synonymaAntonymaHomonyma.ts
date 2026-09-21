/**
 * Čeština 6. ročník — Synonyma, antonyma, homonyma (select_one).
 *
 * Navazuje na 5. ročník (grade-5/cjl/slovaJednoznacnaMnohoznacnaVicevyznamova.ts),
 * kde se procvičovala mnohoznačnost. Tady se mnohoznačnost jen připomíná jako
 * KONTRAST k homonymu (významy mnohoznačného slova spolu souvisejí přeneseně,
 * u homonyma nesouvisejí vůbec) — neprocvičuje se znovu samostatně.
 *
 *  • L1a — jednoznačné slovo ve větě: vyber jeho synonymum, nebo antonymum
 *    (podle otázky). Banka 16 slov, střídá se s L1b v poměru 1:1.
 *  • L1b — dvojice slov (např. „silný – slabý“): urči vztah mezi nimi
 *    (synonyma / antonyma / homonyma / slova příbuzná). Banka 16 unikátních
 *    dvojic, 4 na každý vztah.
 *  • L2 — mnohoznačné slovo ve DVOU větách s různým významem (hrubý papír ×
 *    hrubá chyba, ostrý nůž × ostrá paprika…). Klíč platí PRÁVĚ pro danou
 *    větu, distraktor je protějšek z druhého významu (ohnutý do rodu věty)
 *    a dvě ručně zadané blízké chyby. Slova i věty jsou disjunktní s L1.
 *  • L3a — homonymum v konkrétní větě (los, stát, pila, ženu, tři, jeřáb):
 *    urči význam; distraktory jsou druhý význam a podobně znějící slova
 *    nebo jiné tvary téhož slova.
 *  • L3b — ze čtyř dvojic (homonyma / mnohoznačné slovo / synonyma /
 *    antonyma) vyber tu, kde jde skutečně o homonyma.
 *  • L3c — homonymum, nebo mnohoznačné slovo, a PROČ (druh + důvod, 2 kroky).
 *
 * Chybový model (každý distraktor = jedna typická chyba šesťáka):
 *  • záměna synonyma a antonyma (u otázky na opačný význam nabídnout slovo
 *    podobného významu, a naopak);
 *  • u mnohoznačného slova vzít protějšek z JINÉHO významu, než o kterém věta
 *    mluví;
 *  • považovat homonymum za synonymum jen proto, že vypadá stejně;
 *  • považovat mnohoznačné (přenesený význam) slovo za homonymum, ačkoli jeho
 *    významy spolu souvisejí.
 *
 * Sporné případy (kolej, koruna, oko) se v tématu nepoužívají ani jako klíč,
 * ani jako distraktor — jen učebnicově jednoznačné příklady.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildChoiceTask, losUlohy, ruzneUlohy, type Distractor } from "./_shared";

type Builder = () => PracticeTask | null;

// ── L1a — jednoznačné slovo ve větě: synonymum / antonymum ──────────────────
interface SlovoL1 {
  marked: string;
  sentence: string;
  synonym: string;
  antonym: string;
}

const SLOVA_L1: SlovoL1[] = [
  { marked: "unavený", sentence: "Martin byl po závodě hodně unavený.", synonym: "vyčerpaný", antonym: "odpočatý" },
  { marked: "rychlý", sentence: "Zajíc je velmi rychlý.", synonym: "hbitý", antonym: "pomalý" },
  { marked: "veselý", sentence: "Filip byl na oslavě veselý.", synonym: "radostný", antonym: "smutný" },
  { marked: "statečný", sentence: "Hasič byl při zásahu statečný.", synonym: "odvážný", antonym: "zbabělý" },
  { marked: "čistý", sentence: "Pokoj byl po úklidu čistý.", synonym: "uklizený", antonym: "špinavý" },
  { marked: "hlasitý", sentence: "Koncert byl velmi hlasitý.", synonym: "hlučný", antonym: "tichý" },
  { marked: "bohatý", sentence: "Soused je prý velmi bohatý.", synonym: "zámožný", antonym: "chudý" },
  { marked: "krásný", sentence: "Výhled z rozhledny byl krásný.", synonym: "nádherný", antonym: "ošklivý" },
  { marked: "silný", sentence: "Býk je velmi silný.", synonym: "statný", antonym: "slabý" },
  { marked: "moudrý", sentence: "Dědeček byl moudrý stařec.", synonym: "rozumný", antonym: "hloupý" },
  { marked: "štědrý", sentence: "Strýček je ke všem štědrý.", synonym: "velkorysý", antonym: "lakomý" },
  { marked: "přátelský", sentence: "Nový soused byl přátelský.", synonym: "vlídný", antonym: "nepřátelský" },
  { marked: "pilný", sentence: "Žák byl při práci pilný.", synonym: "snaživý", antonym: "líný" },
  { marked: "levný", sentence: "Ten svetr byl překvapivě levný.", synonym: "laciný", antonym: "drahý" },
  { marked: "zvědavý", sentence: "Malý Tomáš byl velmi zvědavý.", synonym: "zvídavý", antonym: "lhostejný" },
  { marked: "poslušný", sentence: "Pes byl při výcviku poslušný.", synonym: "ukázněný", antonym: "neposlušný" },
];

function ukolSlovoL1(idx: number, typ: "syn" | "ant"): PracticeTask | null {
  const item = SLOVA_L1[idx % SLOVA_L1.length];
  const correct = typ === "syn" ? item.synonym : item.antonym;
  const swap = typ === "syn" ? item.antonym : item.synonym;
  const swapWhy =
    typ === "syn"
      ? `„${swap}“ znamená OPAK slova „${item.marked}“, to je antonymum. Hledáš slovo PODOBNÉHO významu.`
      : `„${swap}“ znamená skoro totéž jako „${item.marked}“, to je synonymum. Hledáš slovo OPAČNÉHO významu.`;
  const f1 = SLOVA_L1[(idx + 1) % SLOVA_L1.length][typ === "syn" ? "synonym" : "antonym"];
  const f2 = SLOVA_L1[(idx + 2) % SLOVA_L1.length][typ === "syn" ? "synonym" : "antonym"];
  const fillerWhy = (f: string) =>
    `„${f}“ popisuje úplně jinou vlastnost než „${item.marked}“. Dosaď si ho do věty „${item.sentence}“ místo „${item.marked}“ — smysl věty se úplně změní.`;
  const distractors: Distractor[] = [
    { value: swap, why: swapWhy },
    { value: f1, why: fillerWhy(f1) },
    { value: f2, why: fillerWhy(f2) },
  ];
  return buildChoiceTask(
    `Jaké slovo je ${typ === "syn" ? "synonymem (slovem podobného významu)" : "antonymem (slovem opačného významu)"} slova „${item.marked}“ ve větě „${item.sentence}“?`,
    correct,
    distractors,
    {
      hints: [
        `Co znamená slovo „${item.marked}“ ve větě „${item.sentence}“?`,
        typ === "syn"
          ? `Synonymum znamená TOTÉŽ nebo skoro totéž jako zadané slovo. Zkus „${item.marked}“ ve větě nahradit každou možností a vyber tu, po které věta znamená pořád stejnou věc.`
          : `Antonymum znamená PRAVÝ OPAK zadaného slova. Zkus „${item.marked}“ ve větě nahradit každou možností a vyber tu, po které věta znamená úplný opak.`,
      ],
      explanation: `„${correct}“ je ${typ === "syn" ? "synonymum" : "antonymum"} slova „${item.marked}“ — ${typ === "syn" ? "má podobný význam" : "má opačný význam"}. „${swap}“ je naopak ${typ === "syn" ? "antonymum" : "synonymum"}, tedy opačný vztah.`,
    },
  );
}

// ── L1b — dvojice slov: jaký je mezi nimi vztah? ─────────────────────────────
// Každá dvojice je v bance JEDNOU (prohozené pořadí by byla táž úloha) a všechny
// čtyři vztahy jsou zastoupené rovnoměrně (4 × 4), aby klíč nebyl pořád tentýž.
type Relace = "syn" | "ant" | "hom" | "pri";
interface DvojiceL1 {
  a: string;
  b: string;
  relace: Relace;
}

const DVOJICE_L1: DvojiceL1[] = [
  { a: "veselý", b: "radostný", relace: "syn" },
  { a: "silný", b: "slabý", relace: "ant" },
  { a: "bál (ples)", b: "bál (tvar slovesa bát se)", relace: "hom" },
  { a: "les", b: "lesní", relace: "pri" },
  { a: "rychlý", b: "hbitý", relace: "syn" },
  { a: "bohatý", b: "chudý", relace: "ant" },
  { a: "rys (zvíře)", b: "rys (obličeje)", relace: "hom" },
  { a: "voda", b: "vodní", relace: "pri" },
  { a: "krásný", b: "nádherný", relace: "syn" },
  { a: "štědrý", b: "lakomý", relace: "ant" },
  { a: "jedu (tvar slovesa jet)", b: "jedu (3. pád slova jed)", relace: "hom" },
  { a: "kniha", b: "knihovna", relace: "pri" },
  { a: "statečný", b: "odvážný", relace: "syn" },
  { a: "hlasitý", b: "tichý", relace: "ant" },
  { a: "peru (tvar slovesa prát)", b: "peru (3. pád slova pero)", relace: "hom" },
  { a: "škola", b: "školní", relace: "pri" },
];

const RELACE_LABEL: Record<Relace, string> = {
  syn: "synonyma – slova podobného významu",
  ant: "antonyma – slova opačného významu",
  hom: "homonyma – stejná podoba, nesouvisející význam",
  pri: "slova příbuzná – společný kořen, příbuzný význam",
};
const RELACE_DUVOD: Record<Relace, string> = {
  syn: "mají podobný význam",
  ant: "mají opačný význam",
  hom: "se píšou i vyslovují stejně, ale jejich významy spolu vůbec nesouvisejí",
  pri: "mají společný kořen a jejich významy spolu souvisejí",
};
const VZTAH_FEEDBACK: Record<string, (a: string, b: string) => string> = {
  "syn-ant": (a, b) => `„${a}“ a „${b}“ neznamenají opak, ale skoro totéž. To jsou synonyma, ne antonyma.`,
  "syn-hom": (a, b) => `„${a}“ a „${b}“ se ani nepíšou stejně, jen mají podobný význam. Homonyma musí vypadat úplně stejně a znamenat něco nesouvisejícího.`,
  "syn-pri": (a, b) => `„${a}“ a „${b}“ nemají společný kořen, jen podobný význam. To jsou synonyma.`,
  "ant-syn": (a, b) => `„${a}“ a „${b}“ neznamenají skoro totéž, ale pravý opak. To jsou antonyma, ne synonyma.`,
  "ant-hom": (a, b) => `„${a}“ a „${b}“ se nepíšou stejně a mají opačný význam. Homonyma vypadají stejně a jejich významy spolu nesouvisí.`,
  "ant-pri": (a, b) => `„${a}“ a „${b}“ nemají společný kořen, jen opačný význam. To jsou antonyma.`,
  "hom-syn": (a, b) => `„${a}“ a „${b}“ vypadají stejně, ale jejich významy spolu vůbec nesouvisí — to není podobnost, jen náhodná shoda podoby. To jsou homonyma, ne synonyma.`,
  "hom-ant": (a, b) => `Významy slov „${a}“ a „${b}“ nejsou opačné, jen spolu vůbec nesouvisí. Shoduje se jen jejich podoba — to jsou homonyma.`,
  "hom-pri": (a, b) => `„${a}“ a „${b}“ nemají společný kořen ani příbuzný význam, jen náhodou stejně vypadají. To jsou homonyma.`,
  "pri-syn": (a, b) => `„${a}“ a „${b}“ neznamenají totéž, jen mají společný kořen a související význam. To jsou slova příbuzná, ne synonyma.`,
  "pri-ant": (a, b) => `„${a}“ a „${b}“ nemají opačný význam, jen společný kořen. To jsou slova příbuzná.`,
  "pri-hom": (a, b) => `„${a}“ a „${b}“ se nepíšou úplně stejně a jejich významy spolu souvisí přes společný kořen. Homonyma naopak vypadají stejně a významy spolu nesouvisejí.`,
};

function ukolDvojiceL1(idx: number): PracticeTask | null {
  const item = DVOJICE_L1[idx % DVOJICE_L1.length];
  const { a, b, relace } = item;
  const ostatni = (Object.keys(RELACE_LABEL) as Relace[]).filter((r) => r !== relace);
  const distractors: Distractor[] = ostatni.map((r) => ({
    value: RELACE_LABEL[r],
    why: VZTAH_FEEDBACK[`${relace}-${r}`](a, b),
  }));
  return buildChoiceTask(
    `Jaký je vztah mezi slovy „${a}“ a „${b}“?`,
    RELACE_LABEL[relace],
    distractors,
    {
      hints: [
        `Podívej se, jestli se „${a}“ a „${b}“ píšou stejně, nebo jen podobně, a pak porovnej jejich významy.`,
        `Napřed rozhodni o PODOBĚ zápisu (stejná, nebo jiná). Pak o VÝZNAMU: podobný, opačný, spolu vůbec nesouvisí (jen náhodná shoda podoby), nebo mají společný kořen a souvisejí spolu.`,
      ],
      explanation: `„${a}“ a „${b}“ ${RELACE_DUVOD[relace]}. Jde tedy o ${RELACE_LABEL[relace]}.`,
    },
  );
}

// ── L2 — mnohoznačné slovo ve DVOU větách, klíč platí jen pro tuhle větu ─────
// Všechny možnosti jsou ve stejném rodě i pádě jako zvýrazněné slovo (jinak by
// se daly vyloučit podle koncovky). Výplňové distraktory jsou zadané RUČNĚ pro
// každý kontext jako blízké chyby (jiná vlastnost téže věci, opak jiného slova,
// záměna synonyma a antonyma) — ne náhodná slova z jiných položek banky.
// `swapSyn`/`swapAnt` = protějšek z druhého významu, ohnutý do rodu této věty;
// u každé dvojice je ověřené, že do této věty NEPASUJE.
// `trait` nesmí obsahovat kořen klíče (jde do nápovědy).
interface Vypln {
  value: string;
  why: string;
}
interface L2Kontext {
  sentence: string;
  marked: string;
  synonym: string;
  antonym: string;
  trait: string;
  swapSyn: string;
  swapAnt: string;
  synFill: [Vypln, Vypln];
  antFill: [Vypln, Vypln];
}
interface L2Slovo {
  a: L2Kontext;
  b: L2Kontext;
}

const SLOVA_L2: L2Slovo[] = [
  {
    a: {
      sentence: "Balicí papír byl na dotek hrubý.",
      marked: "hrubý",
      synonym: "drsný",
      antonym: "hladký",
      trait: "popisuje, jaký je povrch na omak",
      swapSyn: "závažný",
      swapAnt: "drobný",
      synFill: [
        { value: "tvrdý", why: "Tvrdý papír se špatně ohýbá, ale na omak může být úplně hladký. Věta mluví o povrchu, ne o tom, jak je papír pevný." },
        { value: "lesklý", why: "„Lesklý“ popisuje, jak papír vypadá, ne jaký je na dotek. Lesklý papír bývá naopak hladký." },
      ],
      antFill: [
        { value: "tenký", why: "„Tenký“ je opak slova tlustý, ne slova hrubý na dotek. Tenký papír může být na omak klidně drsný." },
        { value: "křehký", why: "„Křehký“ znamená, že se papír snadno roztrhne. O tom, jaký je povrch na omak, neříká nic." },
      ],
    },
    b: {
      sentence: "Petr udělal v diktátu hrubou chybu.",
      marked: "hrubou",
      synonym: "závažnou",
      antonym: "drobnou",
      trait: "popisuje, jak moc chyba vadí",
      swapSyn: "drsnou",
      swapAnt: "hladkou",
      synFill: [
        { value: "častou", why: "Častá chyba je taková, která se opakuje. Věta ale neříká, jak často chyba vzniká, jen jak moc vadí." },
        { value: "úmyslnou", why: "Úmyslnou chybu udělá někdo schválně. Věta neříká, jestli to Petr udělal schválně, ale jak moc chyba vadí." },
      ],
      antFill: [
        { value: "vážnou", why: "Vážná chyba je skoro totéž co hrubá chyba, to je synonymum. Hledáš slovo OPAČNÉHO významu." },
        { value: "náhodnou", why: "Náhodná chyba vznikne omylem. I taková chyba ale může hodně vadit, takže to není opak hrubé chyby." },
      ],
    },
  },
  {
    a: {
      sentence: "Kuchyňský nůž byl velmi ostrý.",
      marked: "ostrý",
      synonym: "nabroušený",
      antonym: "tupý",
      trait: "popisuje, jak dobře nůž krájí",
      swapSyn: "pálivý",
      swapAnt: "mírný",
      synFill: [
        { value: "špičatý", why: "Špičatý nůž má ostrou špičku, ale jak dobře krájí, záleží na ostří. Špičatý nůž může krájet špatně." },
        { value: "lesklý", why: "„Lesklý“ popisuje, jak nůž vypadá. Lesklý nůž může krájet úplně špatně, takže to není slovo stejného významu." },
      ],
      antFill: [
        { value: "kulatý", why: "„Kulatý“ je opak slova špičatý, ne ostrý. Věta mluví o tom, jak nůž krájí, ne jaký má tvar." },
        { value: "rezavý", why: "Rezavý nůž je pokrytý rzí. To je jiná vlastnost než to, jak dobře krájí." },
      ],
    },
    b: {
      sentence: "Paprika v omáčce byla hodně ostrá.",
      marked: "ostrá",
      synonym: "pálivá",
      antonym: "mírná",
      trait: "popisuje chuť jídla",
      swapSyn: "nabroušená",
      swapAnt: "tupá",
      synFill: [
        { value: "slaná", why: "„Slaná“ je jiná chuť. Ostrá paprika pálí na jazyku, ale slaná být nemusí." },
        { value: "kyselá", why: "„Kyselá“ je jiná chuť, třeba jako citron. Ostrá paprika pálí, kyselá není." },
      ],
      antFill: [
        { value: "studená", why: "„Studená“ je opak slova horká, tedy teploty. I studená paprika může pálit." },
        { value: "hořká", why: "„Hořká“ je jiná chuť, ne opak ostré. Opakem je chuť, která skoro nepálí." },
      ],
    },
  },
  {
    a: {
      sentence: "Chléb na talíři byl už starý.",
      marked: "starý",
      synonym: "oschlý",
      antonym: "čerstvý",
      trait: "popisuje, jak dlouho pečivo leží",
      swapSyn: "stařičký",
      swapAnt: "mladý",
      synFill: [
        { value: "křupavý", why: "Křupavý bývá naopak čerstvě upečený chléb. Starý chléb spíš vysychá." },
        { value: "celozrnný", why: "„Celozrnný“ říká, z jaké mouky je chléb upečený, ne jak dlouho leží." },
      ],
      antFill: [
        { value: "suchý", why: "Suchý chléb je skoro totéž jako starý, to je synonymum. Hledáš slovo OPAČNÉHO významu." },
        { value: "okoralý", why: "Okoralý chléb má ztvrdlou kůrku, protože dlouho leží. To je podobný význam, ne opak." },
      ],
    },
    b: {
      sentence: "Na lavičce seděl starý pán.",
      marked: "starý",
      synonym: "stařičký",
      antonym: "mladý",
      trait: "popisuje věk člověka",
      swapSyn: "oschlý",
      swapAnt: "čerstvý",
      synFill: [
        { value: "moudrý", why: "„Moudrý“ popisuje rozum, ne věk. Moudrý může být i mladý člověk." },
        { value: "mladistvý", why: "„Mladistvý“ znamená, že někdo vypadá nebo se chová mladě — to je spíš opak. Hledáš slovo PODOBNÉHO významu." },
      ],
      antFill: [
        { value: "šedivý", why: "Šedivý pán má šedé vlasy, což ke stáří spíš patří. To je podobný význam, ne opak." },
        { value: "vrásčitý", why: "Vrásčitý obličej k vysokému věku spíš patří. To je podobný význam, ne opak." },
      ],
    },
  },
  {
    a: {
      sentence: "V údolí tekl bystrý potok.",
      marked: "bystrý",
      synonym: "prudký",
      antonym: "klidný",
      trait: "popisuje, jak rychle teče voda",
      swapSyn: "chytrý",
      swapAnt: "hloupý",
      synFill: [
        { value: "hluboký", why: "„Hluboký“ popisuje, kolik je v potoce vody do hloubky, ne jak rychle teče." },
        { value: "studený", why: "„Studený“ popisuje teplotu vody. Bystrý potok bývá studený, ale to neznamená totéž." },
      ],
      antFill: [
        { value: "mělký", why: "„Mělký“ je opak slova hluboký, ne bystrý. Mělký potok může téct velmi rychle." },
        { value: "široký", why: "„Široký“ popisuje rozměr potoka, ne rychlost vody. Opak slova bystrý to není." },
      ],
    },
    b: {
      sentence: "Honza je bystrý žák.",
      marked: "bystrý",
      synonym: "chytrý",
      antonym: "hloupý",
      trait: "popisuje, jak rychle někdo chápe",
      swapSyn: "prudký",
      swapAnt: "klidný",
      synFill: [
        { value: "pilný", why: "Pilný žák se hodně snaží. Bystrý žák rychle chápe — to je jiná vlastnost a obě se nemusí sejít." },
        { value: "hbitý", why: "„Hbitý“ znamená rychlý v pohybu, ne v přemýšlení. Hbitý může být i žák, který pomalu chápe." },
      ],
      antFill: [
        { value: "líný", why: "„Líný“ je opak slova pilný, tedy snahy. Bystrý žák může být i líný, takže to není opak." },
        { value: "zlobivý", why: "„Zlobivý“ popisuje chování, ne to, jak rychle žák chápe." },
      ],
    },
  },
  {
    a: {
      sentence: "Maso v guláši bylo tvrdé.",
      marked: "tvrdé",
      synonym: "tuhé",
      antonym: "měkké",
      trait: "popisuje, jak snadno se jídlo kouše",
      swapSyn: "hluboké",
      swapAnt: "lehké",
      synFill: [
        { value: "suché", why: "Suché maso nemá šťávu, ale ještě nemusí jít špatně kousat. Věta mluví o tom, jak se maso kouše." },
        { value: "slané", why: "„Slané“ popisuje chuť, ne to, jak snadno se maso kouše." },
      ],
      antFill: [
        { value: "syrové", why: "Syrové maso není uvařené a kouše se ještě hůř. Opakem tvrdého masa to není." },
        { value: "libové", why: "Libové maso nemá tuk. To je jiná vlastnost než to, jak snadno se kouše." },
      ],
    },
    b: {
      sentence: "Dědeček měl vždycky tvrdý spánek.",
      marked: "tvrdý",
      synonym: "hluboký",
      antonym: "lehký",
      trait: "popisuje, jak snadno se spáč probudí",
      swapSyn: "tuhý",
      swapAnt: "měkký",
      synFill: [
        { value: "dlouhý", why: "„Dlouhý“ popisuje, jak dlouho spánek trvá, ne jak snadno se dědeček probudí." },
        { value: "klidný", why: "Klidný spánek je bez převalování. Tvrdý spánek ale znamená, že dědečka nic nevzbudí — to je jiná vlastnost." },
      ],
      antFill: [
        { value: "krátký", why: "„Krátký“ je opak slova dlouhý, ne tvrdý. I krátký spánek může být tak tvrdý, že spáče nic neprobudí." },
        { value: "sladký", why: "Sladký spánek je příjemný, ale to neříká nic o tom, jak snadno se spáč probudí." },
      ],
    },
  },
];

function ukolL2(wordIdx: number, ktera: "a" | "b", typ: "syn" | "ant"): PracticeTask | null {
  const slovo = SLOVA_L2[wordIdx % SLOVA_L2.length];
  const ctx = slovo[ktera];
  const other = slovo[ktera === "a" ? "b" : "a"];
  const correct = typ === "syn" ? ctx.synonym : ctx.antonym;
  const swap = typ === "syn" ? ctx.swapSyn : ctx.swapAnt;
  const [f1, f2] = typ === "syn" ? ctx.synFill : ctx.antFill;
  const distractors: Distractor[] = [
    {
      value: swap,
      why: `Tohle slovo sedí k jinému významu, kdy „${other.marked}“ ${other.trait} (věta „${other.sentence}“). Tady ale „${ctx.marked}“ ${ctx.trait} — hledej slovo, které sedí k TOMUHLE významu.`,
    },
    f1,
    f2,
  ];
  return buildChoiceTask(
    `Jaké slovo je ${typ === "syn" ? "synonymem" : "antonymem"} slova „${ctx.marked}“ ve větě „${ctx.sentence}“?`,
    correct,
    distractors,
    {
      hints: [
        `Slovo „${ctx.marked}“ má ve dvou různých větách dva různé významy. Přečti si větu „${ctx.sentence}“ a řekni vlastními slovy, o čem mluví.`,
        `Ve větě „${ctx.sentence}“ „${ctx.marked}“ ${ctx.trait}. Ve druhé větě se stejným slovem je ale správný protějšek jiný. Dosaď každou možnost do věty místo „${ctx.marked}“ a vyber tu, po které věta ${typ === "syn" ? "znamená pořád totéž" : "znamená přesný opak"}.`,
      ],
      explanation: `V této větě „${ctx.marked}“ ${ctx.trait}, proto je ${typ === "syn" ? "synonymem" : "antonymem"} slovo „${correct}“. Slovo „${swap}“ by se hodilo k druhému významu, kdy „${other.marked}“ ${other.trait} (věta „${other.sentence}“).`,
    },
  );
}

// ── L3a — homonymum v konkrétní větě: který význam věta používá? ────────────
// Distraktory: druhý (nesouvisející) význam homonyma + dvě blízké chyby,
// které se ke slovu dají vztáhnout — podobně znějící slovo (losos, pilník,
// třást), jiný tvar téhož slova (pád, osoba) nebo další význam téhož slova.
// Nikdy ne význam jiného homonyma z banky. `desc` neopakuje hledaný tvar.
interface Vyznam {
  sentence: string;
  desc: string;
  near: [Vypln, Vypln];
}
interface Homonymum {
  label: string;
  a: Vyznam;
  b: Vyznam;
}

const HOMONYMA: Homonymum[] = [
  {
    label: "los",
    a: {
      sentence: "Na severu Evropy žije statný los.",
      desc: "velké divoké zvíře s parohy",
      near: [
        { value: "ryba, která plave proti proudu", why: "To je losos — zní podobně, ale je to jiné slovo. „Statný los“ je velké zvíře s parohy." },
        { value: "osud, který člověka čeká", why: "I to slovo los znamená („těžký los“), ale osud nemůže „žít na severu Evropy“. Tady jde o zvíře." },
      ],
    },
    b: {
      sentence: "Můj los ve školní tombole vyhrál.",
      desc: "lístek, kterým se hraje o výhru",
      near: [
        { value: "věc, kterou v tombole vyhraješ", why: "Výhra je to, co dostaneš, když los vyhraje. Samotný los je lístek, kterým se o výhru hraje." },
        { value: "osud, který člověka čeká", why: "Tak se o losu mluví jen v knižním spojení („těžký los“). V tombole ale vyhrává lístek, ne osud." },
      ],
    },
  },
  {
    label: "stát",
    a: {
      sentence: "Německo je sousední stát.",
      desc: "země s vlastní vládou a hranicemi",
      near: [
        { value: "hlavní město jedné země", why: "Hlavní město je jen jedno město ve státě, třeba Berlín. Německo je celá země." },
        { value: "kraj uvnitř jedné země", why: "Kraj je jen část země, třeba Jihomoravský kraj. Německo je celá samostatná země." },
      ],
    },
    b: {
      sentence: "Musím dlouho stát ve frontě.",
      desc: "být vestoje a čekat",
      near: [
        { value: "mít určitou cenu", why: "I tak se sloveso stát používá („Kolik to stojí?“). Ve frontě se ale nečeká na cenu — člověk je tam vestoje." },
        { value: "sedět a čekat na řadu", why: "Čekání na řadu sedí, ale „sedět“ je opak toho, co sloveso stát říká. Ve frontě se stojí." },
      ],
    },
  },
  {
    label: "pila",
    a: {
      sentence: "V dílně visí stará pila.",
      desc: "nástroj na řezání dřeva",
      near: [
        { value: "nástroj na obrušování kovu", why: "To je pilník — zní podobně a patří taky do dílny, ale je to jiné slovo. Pila dřevo řeže." },
        { value: "drobné kousky dřeva po řezání", why: "To jsou piliny — vznikají při řezání. Nejsou to ale nástroj, který by „visel v dílně“." },
      ],
    },
    b: {
      sentence: "Babička pila čaj.",
      desc: "minulý čas slovesa pít",
      near: [
        { value: "minulý čas slovesa pilovat", why: "Minulý čas slovesa pilovat zní „pilovala“. Babička čaj pila, tedy pít." },
        { value: "tvar přídavného jména pilný", why: "„Pilná“ znamená pracovitá. Zní podobně, ale „babička pilná čaj“ nedává smysl — babička čaj pila." },
      ],
    },
  },
  {
    label: "ženu",
    a: {
      sentence: "Potkal jsem milou ženu.",
      desc: "4. pád podstatného jména žena",
      near: [
        { value: "2. pád podstatného jména žena", why: "2. pád zní „bez ženy“. Potkal jsem (koho? co?) — ptáme se 4. pádem." },
        { value: "7. pád podstatného jména žena", why: "7. pád zní „se ženou“. Potkal jsem (koho? co?) — to je 4. pád." },
      ],
    },
    b: {
      sentence: "Každé ráno ženu kozy na pastvu.",
      desc: "tvar slovesa hnát (co dělám já)",
      near: [
        { value: "tvar slovesa hnát (co dělají oni)", why: "Oni kozy „ženou“. Tady ale mluví jeden člověk o sobě: já kozy každé ráno ženu." },
        { value: "tvar slovesa ženit se", why: "Sloveso ženit se má tvar „žením se“. Kozy se na pastvu ženou — to je sloveso hnát." },
      ],
    },
  },
  {
    label: "tři",
    a: {
      sentence: "Přišly tři kamarádky.",
      desc: "základní číslovka (počet 3)",
      near: [
        { value: "řadová číslovka (třetí v pořadí)", why: "Řadová číslovka by zněla „třetí“. Věta říká, kolik kamarádek přišlo, ne v jakém pořadí." },
        { value: "násobná číslovka (třikrát)", why: "Násobná číslovka by zněla „třikrát“. Věta říká, kolik kamarádek přišlo — to je počet." },
      ],
    },
    b: {
      sentence: "Pořádně si tři ruce mýdlem.",
      desc: "rozkaz od slovesa třít",
      near: [
        { value: "rozkaz od slovesa třást", why: "Rozkaz od slovesa třást zní „třes!“. Ruce mýdlem si třeme — to je sloveso třít." },
        { value: "tvar slovesa třít (co dělají oni)", why: "Oni si ruce „třou“. Věta ale přikazuje, co máš udělat ty — to je rozkaz." },
      ],
    },
  },
  {
    label: "jeřáb",
    a: {
      sentence: "Nad loukou přeletělo hejno jeřábů popelavých.",
      desc: "velký stěhovavý pták",
      near: [
        { value: "stroj na zvedání břemen", why: "I tak se říká stroji na stavbě, ale stroje nelétají v hejnech. Tady jde o ptáka." },
        { value: "plod stromu (jeřabina)", why: "Jeřabiny jsou plody. Plody ale nelétají v hejnech — tady jde o ptáka." },
      ],
    },
    b: {
      sentence: "Na kraji lesa rostl jeřáb obtěžkaný červenými plody.",
      desc: "listnatý strom",
      near: [
        { value: "stroj na zvedání břemen", why: "Stroj na stavbě neroste. Slovo „rostl“ ukazuje na rostlinu." },
        { value: "jehličnatý strom", why: "Jeřáb má listy, ne jehlice. Je to listnatý strom — jeho plody jsou jeřabiny." },
      ],
    },
  },
];

function ukolHomonymumVyznam(idx: number, ktera: "a" | "b"): PracticeTask | null {
  const h = HOMONYMA[idx % HOMONYMA.length];
  const meaning = h[ktera];
  const other = h[ktera === "a" ? "b" : "a"];
  const distractors: Distractor[] = [
    {
      value: other.desc,
      why: `To je druhý, nesouvisející význam slova „${h.label}“. Tady ale věta „${meaning.sentence}“ mluví o jiném významu: ${meaning.desc}.`,
    },
    ...meaning.near,
  ];
  return buildChoiceTask(
    `Co znamená slovo „${h.label}“ ve větě „${meaning.sentence}“?`,
    meaning.desc,
    distractors,
    {
      hints: [
        `Přečti si celou větu „${meaning.sentence}“, ne jen samotné slovo „${h.label}“.`,
        `Slovo „${h.label}“ má dva úplně nesouvisející významy a mezi možnostmi jsou i slova, která jen podobně znějí, nebo jiné tvary. Slova kolem něj ve větě prozradí, o který význam i tvar jde.`,
      ],
      explanation: `Ve větě „${meaning.sentence}“ znamená „${h.label}“: ${meaning.desc}. Stejně vypadající slovo „${h.label}“ má i úplně jiný, nesouvisející význam (${other.desc}) — to jsou homonyma.`,
    },
  );
}

// ── L3b — ze čtyř dvojic vyber tu, kde jde skutečně o homonyma ──────────────
// Krátké (2–4 slovní) glosy jen pro klasifikační L3b/L3c — plné popisy z L3a
// by byly systematicky mnohem delší než distraktory (syn./anto. dvojice) a klíč
// by se tím prozrazoval délkou (audit „giveawayLength").
const KRATKY_POPIS: Record<string, [string, string]> = {
  los: ["divoké zvíře", "loterijní lístek"],
  stát: ["samostatná země", "být vestoje"],
  pila: ["nástroj na dřevo", "tvar slovesa pít"],
  ženu: ["4. pád slova žena", "tvar slovesa hnát"],
  tři: ["číslovka 3", "rozkaz od třít"],
  jeřáb: ["pták", "strom"],
};

interface Mnohoznacne {
  label: string;
  a: string;
  b: string;
  why: string;
}
const MNOHOZNACNE: Mnohoznacne[] = [
  { label: "hlava", a: "hlava člověka", b: "hlava rodiny", why: "„Hlava rodiny“ je přenesený význam — stojí v čele rodiny podobně jako hlava na těle. Významy spolu souvisí, jde tedy o slovo mnohoznačné, ne o homonymum." },
  { label: "list", a: "list stromu", b: "list papíru", why: "„List papíru“ vznikl přenesením z „listu stromu“ — oba jsou tenké a ploché. Významy spolu souvisí, je to mnohoznačné slovo, ne homonymum." },
  { label: "křídlo", a: "křídlo ptáka", b: "křídlo budovy", why: "„Křídlo budovy“ vzniklo přenesením z „křídla ptáka“ — obě jsou postranní částí celku. Významy spolu souvisí, je to mnohoznačné slovo, ne homonymum." },
  { label: "noha", a: "noha člověka", b: "noha stolu", why: "„Noha stolu“ podpírá stůl, jako noha nese tělo — význam vznikl přenesením. Významy spolu souvisí, je to mnohoznačné slovo, ne homonymum." },
  { label: "ucho", a: "ucho člověka", b: "ucho hrnku", why: "„Ucho hrnku“ trčí ze strany, jako ucho z hlavy — význam vznikl přenesením podle tvaru a polohy. Je to mnohoznačné slovo, ne homonymum." },
  { label: "srdce", a: "srdce člověka", b: "srdce města", why: "„Srdce města“ je jeho střed, tak jako srdce je uprostřed těla a je nejdůležitější. Význam vznikl přenesením, je to mnohoznačné slovo, ne homonymum." },
];
const SYNONYMA_L3B = ["hodný – laskavý", "pomalý – loudavý"];
const ANTONYMA_L3B = ["silný – slabý", "levný – drahý"];
const OTAZKA_L3B = [
  "Ve které dvojici jde o HOMONYMA – stejná podoba slova, ale nesouvisející významy?",
  "Která dvojice slov jsou HOMONYMA (stejně se píšou i vyslovují, ale významy spolu vůbec nesouvisejí)?",
  "Vyber dvojici, kde jde o homonyma – slova stejné podoby s nesouvisejícím významem.",
];

function ukolHomonymumVztah(idx: number): PracticeTask | null {
  const label = HOMONYMA[idx % HOMONYMA.length].label;
  const [k1, k2] = KRATKY_POPIS[label];
  const correct = `${label}: ${k1} × ${k2}`;
  const m = MNOHOZNACNE[idx % MNOHOZNACNE.length];
  const mnoho = `${m.label}: ${m.a} × ${m.b}`;
  const syn = SYNONYMA_L3B[idx % SYNONYMA_L3B.length];
  const ant = ANTONYMA_L3B[idx % ANTONYMA_L3B.length];
  const distractors: Distractor[] = [
    { value: mnoho, why: m.why },
    { value: syn, why: `„${syn}“ jsou slova PODOBNÉHO významu, to jsou synonyma. U homonym musí být významy úplně nesouvisející, i když se slovo píše stejně.` },
    { value: ant, why: `„${ant}“ jsou slova OPAČNÉHO významu, to jsou antonyma. U homonym spolu významy vůbec nesouvisejí (nejde o žádnou podobnost ani opak), jen náhodou mají stejnou podobu.` },
  ];
  return buildChoiceTask(
    OTAZKA_L3B[idx % OTAZKA_L3B.length],
    correct,
    distractors,
    {
      hints: [
        "U každé dvojice si řekni, jestli se obě slova píšou stejně, a jestli jejich významy spolu vůbec souvisejí.",
        "Když významy spolu souvisí, i kdyby jen přeneseně, jde o mnohoznačné slovo, ne o homonymum. Homonyma jsou dvě slova, která vypadají stejně jen náhodou a jejich významy spolu nesouvisí vůbec.",
      ],
      explanation: `Ve dvojici „${correct}“ jde o dvě slova stejné podoby s nesouvisejícími významy — to jsou homonyma. Ostatní možnosti jsou mnohoznačné slovo, synonyma nebo antonyma.`,
    },
  );
}

// ── L3c — homonymum, nebo mnohoznačné slovo? A proč? ─────────────────────────
// Dvoukrokový transfer: určit druh slova I správný důvod. Obě „špatný důvod“
// možnosti jsou typické omyly — víc významů i stejný zápis mají homonyma
// i mnohoznačná slova, takže o ničem nerozhodují.
const L3C_HOM_OK = "homonyma – významy spolu nesouvisejí, stejná podoba je náhoda";
const L3C_MNO_OK = "mnohoznačné slovo – jeden význam vznikl přenesením z druhého";
const L3C_HOM_BAD = "homonyma – slovo má víc než jeden význam";
const L3C_MNO_BAD = "mnohoznačné slovo – oba významy se píšou stejně";

function ukolHomonymumNeboMnohoznacne(idx: number, druh: "hom" | "mno"): PracticeTask | null {
  let label: string, a: string, b: string, whyMno: string;
  if (druh === "hom") {
    label = HOMONYMA[idx % HOMONYMA.length].label;
    [a, b] = KRATKY_POPIS[label];
    whyMno = "";
  } else {
    const m = MNOHOZNACNE[idx % MNOHOZNACNE.length];
    ({ label, a, b } = m);
    whyMno = m.why;
  }
  const correct = druh === "hom" ? L3C_HOM_OK : L3C_MNO_OK;
  const distractors: Distractor[] =
    druh === "hom"
      ? [
          { value: L3C_MNO_OK, why: `Mezi významy „${a}“ a „${b}“ žádné přenesení není — jeden z druhého nevznikl, jen náhodou vypadají stejně. Mnohoznačné slovo to není.` },
          { value: L3C_HOM_BAD, why: `Homonyma to jsou, ale důvod nesedí: víc významů má i každé mnohoznačné slovo. Rozhoduje, že významy spolu vůbec nesouvisejí.` },
          { value: L3C_MNO_BAD, why: `Stejný zápis mají homonyma i mnohoznačná slova, takže o ničem nerozhoduje. A významy „${a}“ a „${b}“ spolu nesouvisejí — mnohoznačné slovo to není.` },
        ]
      : [
          { value: L3C_HOM_OK, why: whyMno },
          { value: L3C_HOM_BAD, why: `Víc významů má i mnohoznačné slovo, o homonymu to nerozhoduje. Tady spolu významy „${a}“ a „${b}“ souvisejí přenesením, takže homonyma to nejsou.` },
          { value: L3C_MNO_BAD, why: `Mnohoznačné slovo to je, ale důvod nesedí: stejně se píšou i homonyma. Rozhoduje, že jeden význam vznikl přenesením z druhého.` },
        ];
  return buildChoiceTask(
    `Jak spolu souvisejí dva významy slova „${label}“ (${a} × ${b})? Vyber druh slova i správný důvod.`,
    correct,
    distractors,
    {
      hints: [
        `Zkus si představit, jestli význam „${b}“ mohl vzniknout z významu „${a}“ přenesením — podle podobného tvaru, polohy nebo úlohy.`,
        "Homonyma i mnohoznačné slovo se píšou stejně a mají víc významů — tím se od sebe neliší. Liší se jen tím, jestli spolu významy souvisejí. Hledej možnost, kde sedí druh slova i důvod.",
      ],
      explanation:
        druh === "hom"
          ? `Významy „${a}“ a „${b}“ spolu nijak nesouvisejí, jeden z druhého nevznikl — „${label}“ jsou ve skutečnosti dvě různá slova (homonyma), která mají stejnou podobu jen náhodou.`
          : `Význam „${b}“ vznikl přenesením z významu „${a}“, takže spolu souvisejí — „${label}“ je mnohoznačné slovo, ne homonymum.`,
    },
  );
}

// ── Generátor ────────────────────────────────────────────────────────────────
function poolL1(): Builder[] {
  // Template A (jednoznačné slovo): 32 variant, pořadí zvolené tak, aby se
  // v prvních 24 úlohách žádné slovo neopakovalo (syn slova k, ant slova k+8).
  // Template B (vztah dvojice): 16 unikátních dvojic, střídají se 1:1 s A.
  const n = SLOVA_L1.length;
  const a: Builder[] = [];
  for (let k = 0; k < n; k++) {
    a.push(() => ukolSlovoL1(k, "syn"));
    a.push(() => ukolSlovoL1((k + n / 2) % n, "ant"));
  }
  const combined: Builder[] = [];
  for (let i = 0; i < a.length; i++) {
    combined.push(a[i]);
    combined.push(() => ukolDvojiceL1(i % DVOJICE_L1.length));
  }
  return combined;
}

function poolL2(): Builder[] {
  const out: Builder[] = [];
  SLOVA_L2.forEach((_, i) => {
    (["a", "b"] as const).forEach((k) => {
      (["syn", "ant"] as const).forEach((t) => out.push(() => ukolL2(i, k, t)));
    });
  });
  return out;
}

function poolL3(): Builder[] {
  // Prostřídat tři formáty: L3a (12), L3c (12), L3b (6).
  const out: Builder[] = [];
  for (let i = 0; i < HOMONYMA.length * 2; i++) {
    const h = Math.floor(i / 2);
    out.push(() => ukolHomonymumVyznam(h, i % 2 === 0 ? "a" : "b"));
    out.push(() => ukolHomonymumNeboMnohoznacne(h, i % 2 === 0 ? "hom" : "mno"));
    if (i % 2 === 0) out.push(() => ukolHomonymumVztah(h));
  }
  return out;
}

/** Rotace po bance se nastaví při každém volání — žádný stav mezi voláními. */
function gen(level: number): PracticeTask[] {
  const pool = level <= 1 ? poolL1() : level === 2 ? poolL2() : poolL3();
  let i = 0;
  const dalsi = () => pool[i++ % pool.length]();
  return ruzneUlohy(() => losUlohy(dalsi), 24, pool.length * 3);
}

// ── Topic ────────────────────────────────────────────────────────────────────
export const SYNONYMA_ANTONYMA_HOMONYMA: TopicMetadata[] = [
  {
    id: "g6-cjl-synonyma-antonyma-homonyma-6",
    rvpNodeId: "g6-cjl-jazykova-vychova-nauka-o-slovni-zasobe-synonyma-antonyma-homonyma",
    displayName: "Synonyma, antonyma, homonyma",
    title: "Synonyma, antonyma, homonyma",
    studentTitle: "Slova podobná, opačná a stejně znějící",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Nauka o slovní zásobě",
    briefDescription: "Najdi slovo podobného či opačného významu a rozliš homonyma podle věty.",
    keywords: ["synonyma", "antonyma", "homonyma", "slovní zásoba", "opačný význam", "podobný význam", "slova příbuzná"],
    goals: [
      "Rozlišit synonymum, antonymum a homonymum.",
      "Vybrat synonymum nebo antonymum, které přesně sedí do konkrétní věty.",
      "Rozpoznat homonymum podle kontextu věty a odlišit ho od mnohoznačného slova.",
    ],
    boundaries: [
      "Navazuje na mnohoznačná slova z 5. ročníku (grade-5/cjl); mnohoznačnost se tu jen připomíná jako kontrast k homonymu, neprocvičuje se znovu samostatně.",
      "Jen učebnicově jednoznačné příklady; sporné případy (kolej, koruna, oko) se v tématu nepoužívají.",
      "Bez slovotvorby (odvozování, skládání, přejímání) — to je jiné podtéma nauky o slovní zásobě.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Synonymum = podobný význam, antonymum = opačný význam, homonymum = stejná podoba, ale nesouvisející významy. U mnohoznačného slova naopak významy spolu souvisejí (jen přeneseně).",
      steps: [
        "Přečti si celou větu, ne jen zvýrazněné slovo.",
        "Zkus slovo ve větě nahradit nabízenou možností a poslechni si, jestli věta pořád dává smysl.",
        "Rozhodni, jestli hledáš slovo podobného, nebo opačného významu — a u homonyma, jestli spolu jeho dva významy vůbec souvisejí.",
      ],
      commonMistake: "Záměna synonyma za antonymum (a naopak), a považování homonyma za synonymum jen proto, že slovo vypadá stejně.",
      example: "„Stát podporuje sport.“ — stát znamená zemi. „Musím stát ve frontě.“ — stát znamená čekat vestoje. Stejná podoba, různý a nesouvisející význam = homonymum.",
    },
  },
];
