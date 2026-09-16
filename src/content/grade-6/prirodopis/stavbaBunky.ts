/**
 * Přírodopis 6. ročník — Stavba rostlinné a živočišné buňky (select_one).
 *
 * Faktické téma: tři disjunktní banky. L1 je pevná banka, L2 se skládá
 * z tabulky buněk (rostlinná × živočišná), L3 je pevná banka situací.
 *
 * Chybový model (každý distraktor = jedna typická chyba):
 *  • stěna = membrána („obal buňky“), takže i živočišná buňka má stěnu;
 *  • „rostlinná buňka je vždy zelená“ (kořen, slupka cibule chloroplasty nemají);
 *  • záměna funkcí jádra, mitochondrií a chloroplastů („zelená tělíska dávají energii“);
 *  • vakuola jako prázdné místo nebo vzduchová bublina.
 *
 *  • L1 — zapamatování: součást ↔ funkce (dvě šablony střídavě).
 *  • L2 — použití: srovnání konkrétní rostlinné a živočišné buňky, proč kořen není zelený.
 *  • L3 — přenos: preparát podle popisu, chybějící součást → důsledek, znak → funkce pro organismus.
 *
 * Mimo téma (nad rámec 6. ročníku nebo sporné): ribozomy, ER, Golgiho aparát,
 * centrioly, červená krvinka (savčí nemá jádro), houby (nejsou rostliny).
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildChoiceTask as choice, losUlohy, ruzneUlohy, type Distractor } from "./_shared";

interface Polozka {
  q: string;
  correct: string;
  distractors: Distractor[];
  hints: [string, string];
  explanation: string;
}

const vytvor = (p: Polozka): PracticeTask | null =>
  choice(p.q, p.correct, p.distractors, { hints: p.hints, explanation: p.explanation });

// Názvy součástí — stejné napříč úrovněmi.
const JADRO = "Jádro";
const CYTO = "Cytoplazma";
const MEMBRANA = "Cytoplazmatická membrána";
const STENA = "Buněčná stěna";
const CHLORO = "Chloroplasty";
const VAKUOLA = "Vakuola";
const MITO = "Mitochondrie";

// ── L1 — ZAPAMATOVÁNÍ: součást ↔ funkce ─────────────────────────────────────
// Šablona A: „Která součást buňky …?“ → název součásti.
const L1_SOUCAST: Polozka[] = [
  {
    q: "Která součást buňky řídí její činnost a nese dědičné informace?",
    correct: JADRO,
    distractors: [
      { value: MITO, why: "Mitochondrie z živin uvolňují energii. Činnost buňky neřídí, řídicím centrem s dědičnými informacemi je jádro." },
      { value: CYTO, why: "V cytoplazmě probíhá většina buněčných dějů, ale neřídí je. Řídicí centrum buňky je jádro." },
      { value: VAKUOLA, why: "Vakuola uchovává buněčnou šťávu. Dědičné informace v ní uložené nejsou." },
    ],
    hints: [
      "Hledej součást, která funguje jako řídicí centrum celé buňky.",
      "Dědičné informace se předávají z rodičů na potomky a buňka podle nich pracuje. Jsou uložené v jediné, obvykle kulovité součásti, která je po obarvení pod mikroskopem dobře vidět.",
    ],
    explanation: "Jádro obsahuje dědičné informace a podle nich řídí, co buňka dělá, i její dělení. Mitochondrie dodávají energii, cytoplazma vyplňuje buňku a vakuola uchovává šťávu.",
  },
  {
    q: "Která součást buňky obaluje každou buňku a propouští látky dovnitř a ven?",
    correct: MEMBRANA,
    distractors: [
      { value: STENA, why: "Stěnu mají jen rostlinné buňky. Obal, přes který procházejí látky do obou typů buněk, je membrána." },
      { value: CYTO, why: "Cytoplazma buňku vyplňuje zevnitř, neobaluje ji. Látky do buňky pouští tenká blána na povrchu." },
      { value: JADRO, why: "Jádro má vlastní obal, ale leží uvnitř buňky. Celou buňku neobaluje." },
    ],
    hints: [
      "Otázka říká „každou buňku“ — hledáš tedy obal, který má rostlinná i živočišná buňka.",
      "Rostlinné buňky mají dva obaly: vnější pevný, který mají jen rostliny, a pod ním tenkou blánu. Ta tenká blána je i u živočichů a rozhoduje, které látky projdou.",
    ],
    explanation: "Cytoplazmatická membrána je tenká blána na povrchu každé buňky a propouští látky dovnitř a ven. Buněčná stěna je pevný obal navíc, který mají jen rostlinné buňky.",
  },
  {
    q: "Která součást buňky obsahuje zelené barvivo chlorofyl a vyrábí živiny pomocí světla?",
    correct: CHLORO,
    distractors: [
      { value: "Chlorofyl", why: "Chlorofyl je barvivo, ne součást buňky. Je uložený uvnitř zelených tělísek, na která se otázka ptá." },
      { value: MITO, why: "Mitochondrie z živin energii uvolňují, nevyrábějí je ze světla. A zelené nejsou." },
      { value: VAKUOLA, why: "Vakuola je naplněná buněčnou šťávou. Zelené barvivo v ní uložené není." },
    ],
    hints: [
      "Pozor: barvivo samo o sobě není součást buňky. Hledáš tělísko, ve kterém je barvivo uložené.",
      "Zelená tělíska jsou v buňkách listu a využívají světlo k výrobě živin (fotosyntéze). Jedna z možností je jen jméno barviva, které v těch tělískách je.",
    ],
    explanation: "Chloroplasty jsou zelená tělíska. Obsahují barvivo chlorofyl a pomocí světla v nich rostlina vyrábí živiny (fotosyntéza). Chlorofyl je barvivo uvnitř chloroplastu, ne samostatná součást.",
  },
  {
    q: "Která součást buňky je velký měchýřek s buněčnou šťávou a drží rostlinnou buňku napjatou?",
    correct: VAKUOLA,
    distractors: [
      { value: CYTO, why: "Cytoplazma je rosolovitá hmota, ve které leží ostatní součásti. Buněčná šťáva je v samostatném měchýřku." },
      { value: STENA, why: "Stěna buňku zpevňuje zvenku, ale šťávu neobsahuje. Napětí zevnitř dělá měchýřek plný šťávy." },
      { value: JADRO, why: "Jádro řídí činnost buňky. Buněčnou šťávu neobsahuje." },
    ],
    hints: [
      "Hledej součást, která je v rostlinné buňce plná tekutiny a zabírá často většinu jejího prostoru.",
      "Když je tenhle měchýřek plný vody, tlačí zevnitř na stěnu a buňka je pevná. Když vodu ztratí, rostlina vadne.",
    ],
    explanation: "Vakuola je velký měchýřek s buněčnou šťávou. Tlačí zevnitř na stěnu, a proto je rostlinná buňka napjatá a pevná. Cytoplazma buňku vyplňuje, stěna ji zpevňuje zvenku.",
  },
  {
    q: "Která součást buňky získává z živin energii při buněčném dýchání?",
    correct: MITO,
    distractors: [
      { value: CHLORO, why: "Chloroplasty pomocí světla živiny vyrábějí. Energii z živin uvolňují mitochondrie." },
      { value: JADRO, why: "Jádro řídí činnost buňky, ale energii nevyrábí." },
      { value: CYTO, why: "V cytoplazmě leží součásti buňky. Dýchání probíhá v drobných tělískách, ne v celé hmotě buňky." },
    ],
    hints: [
      "Pozor na záměnu: jedna součást živiny vyrábí, jiná z nich energii uvolňuje. Ptáme se na tu druhou.",
      "Dýchání probíhá v rostlinných i živočišných buňkách, takže hledáš součást, kterou mají oba typy. Zelená tělíska mají jen rostliny, a proto to nebudou ona.",
    ],
    explanation: "Mitochondrie jsou drobná tělíska, ve kterých probíhá buněčné dýchání: z živin se uvolní energie pro buňku. Mají je rostlinné i živočišné buňky. Chloroplasty živiny vyrábějí, ne rozkládají.",
  },
  {
    q: "Která součást buňky je pevný obal z celulózy, který mají jen rostlinné buňky?",
    correct: STENA,
    distractors: [
      { value: MEMBRANA, why: "Membrána je tenká blána a mají ji i živočišné buňky. Pevný obal z celulózy leží až nad ní." },
      { value: CHLORO, why: "Chloroplasty mají jen rostlinné buňky, ale jsou to zelená tělíska uvnitř buňky, ne obal." },
      { value: VAKUOLA, why: "Vakuola je měchýřek se šťávou uvnitř buňky, ne obal." },
    ],
    hints: [
      "Hledáš obal, a to ten pevný. Který obal živočišným buňkám chybí?",
      "Každá buňka má na povrchu tenkou blánu. Rostlinná buňka má navíc nad ní silnou vrstvu z celulózy, díky které drží tvar jako cihlička ve zdi.",
    ],
    explanation: "Buněčná stěna je pevný obal z celulózy. Mají ji jen rostlinné buňky a dává jim stálý tvar. Tenkou cytoplazmatickou membránu mají pod ní rostlinné i živočišné buňky.",
  },
  {
    q: "Která součást buňky je rosolovitá hmota, ve které jsou uložené ostatní součásti?",
    correct: CYTO,
    distractors: [
      { value: VAKUOLA, why: "Vakuola je tekutá, ale je to samostatný měchýřek. Ostatní součásti v ní uložené nejsou." },
      { value: JADRO, why: "Jádro je jedna z uložených součástí. Samo nic dalšího neobsahuje." },
      { value: MEMBRANA, why: "Membrána je tenká blána na povrchu, ne hmota uvnitř buňky." },
    ],
    hints: [
      "Hledáš hmotu, která vyplňuje vnitřek buňky mezi obalem a ostatními součástmi.",
      "Tahle hmota je hustá jako rosol a v ní drží jádro, mitochondrie i další tělíska. Probíhá v ní většina dějů, které buňku udržují naživu.",
    ],
    explanation: "Cytoplazma je rosolovitá hmota, která vyplňuje buňku. Jsou v ní uložené jádro, mitochondrie a u rostlin i chloroplasty a vakuola. Mají ji obě buňky.",
  },
  {
    q: "Která součást buňky řídí její dělení a předává vlastnosti na potomky?",
    correct: JADRO,
    distractors: [
      { value: MITO, why: "Mitochondrie dodávají energii, dělení neřídí. Vlastnosti potomků se předávají z řídicího centra buňky." },
      { value: CHLORO, why: "Chloroplasty vyrábějí živiny, vlastnosti na potomky nepředávají. Navíc je mají jen zelené části rostlin." },
      { value: STENA, why: "Stěna buňku zpevňuje. Dělení buňky neřídí a živočišné buňky ji vůbec nemají." },
    ],
    hints: [
      "Dělit se musí rostlinné i živočišné buňky. Hledej součást, kterou mají obě a která buňku řídí.",
      "Potomek dědí vlastnosti rodičů díky dědičným informacím. Při dělení se tyto informace zkopírují do obou nových buněk ze součásti, ve které jsou uložené.",
    ],
    explanation: "Jádro nese dědičné informace. Při dělení je předá oběma novým buňkám, a tak potomci dědí vlastnosti. Mitochondrie dodávají energii, chloroplasty vyrábějí živiny.",
  },
];

// Šablona B: „K čemu slouží …?“ → funkce.
const F_STENA = "Zpevňuje buňku a dává jí stálý tvar";
const F_JADRO = "Řídí činnost buňky a nese dědičné informace";
const F_CHLORO = "Vyrábějí pomocí světla živiny pro rostlinu";
const F_VAKUOLA = "Uchovává buněčnou šťávu a drží buňku napjatou";
const F_MITO = "Uvolňují z živin energii pro činnost buňky";
const F_MEMBRANA = "Odděluje buňku od okolí a propouští do ní látky";
const F_CYTO = "Vyplňuje buňku a probíhá v ní většina dějů";

const L1_FUNKCE: Polozka[] = [
  {
    q: "K čemu slouží buněčná stěna?",
    correct: F_STENA,
    distractors: [
      { value: "Propouští látky dovnitř buňky a ven z ní", why: "To dělá cytoplazmatická membrána. Stěna je pevný obal navíc a buňku hlavně zpevňuje." },
      { value: "Řídí činnost buňky a její dělení", why: "Činnost buňky řídí jádro. Stěna je obal, nic neřídí." },
      { value: "Vyrábí pomocí světla živiny pro buňku", why: "Živiny ze světla vyrábějí zelené chloroplasty, ne obal buňky." },
    ],
    hints: [
      "Stěna je pevný obal z celulózy. Co takový obal dává buňce?",
      "Představ si buňky jako cihly ve zdi. Díky pevnému obalu z celulózy drží rostlinné pletivo pohromadě a nesesype se. Tenká blána pod stěnou má jiný úkol.",
    ],
    explanation: "Buněčná stěna je pevný obal z celulózy, který rostlinnou buňku zpevňuje a dává jí stálý tvar. Látky propouští tenká membrána pod ní, činnost řídí jádro.",
  },
  {
    q: "K čemu slouží jádro buňky?",
    correct: F_JADRO,
    distractors: [
      { value: "Uvolňuje z živin energii pro buňku", why: "Energii z živin uvolňují mitochondrie. Jádro buňku řídí." },
      { value: "Uchovává v buňce zásobu vody a šťávy", why: "Vodu a buněčnou šťávu uchovává vakuola." },
      { value: "Zpevňuje buňku zevnitř jako kostra", why: "Jádro buňku nezpevňuje. Rostlinnou buňku zpevňuje stěna a napjatá vakuola." },
    ],
    hints: [
      "Jádro bývá přirovnáváno k mozku buňky. Co mozek dělá?",
      "V jádru jsou uložené dědičné informace, podle kterých buňka pracuje a které předá novým buňkám. Energii, vodu ani pevnost buňce nedodává.",
    ],
    explanation: "Jádro obsahuje dědičné informace a podle nich řídí činnost buňky i její dělení. Energii dodávají mitochondrie, vodu uchovává vakuola, pevnost dává stěna.",
  },
  {
    q: "K čemu slouží chloroplasty?",
    correct: F_CHLORO,
    distractors: [
      { value: "Uvolňují z živin energii při dýchání", why: "Dýchání probíhá v mitochondriích, a to v rostlinných i živočišných buňkách. Chloroplasty živiny vyrábějí." },
      { value: "Nesou dědičné informace rostliny", why: "Dědičné informace jsou uložené hlavně v jádru. Chloroplasty vyrábějí živiny." },
      { value: "Zpevňují buňku a dávají jí tvar", why: "Rostlinnou buňku zpevňuje stěna. Chloroplasty jsou drobná tělíska uvnitř." },
    ],
    hints: [
      "Chloroplasty jsou zelená tělíska. Kde v rostlině jsou a co tam rostlina dělá se světlem?",
      "Rostlina si potravu nesežene, vyrábí si ji sama z vody a oxidu uhličitého. Potřebuje k tomu světlo, a proto jsou zelená tělíska hlavně v listech.",
    ],
    explanation: "V chloroplastech probíhá fotosyntéza: rostlina v nich pomocí světla vyrábí živiny. Energii z živin pak uvolňují mitochondrie, dědičné informace nese jádro.",
  },
  {
    q: "K čemu slouží vakuola v rostlinné buňce?",
    correct: F_VAKUOLA,
    distractors: [
      { value: "Je to bublina vzduchu, díky které buňka plave", why: "Vakuola není vzduchová bublina. Je plná buněčné šťávy, tedy vody s rozpuštěnými látkami." },
      { value: "Vyrábí pomocí světla živiny pro buňku", why: "Živiny ze světla vyrábějí chloroplasty. Vakuola je měchýřek se šťávou." },
      { value: "Řídí činnost buňky a její dělení", why: "Činnost buňky řídí jádro, ne vakuola." },
    ],
    hints: [
      "Vakuola vypadá pod mikroskopem jako prázdné místo. Je opravdu prázdná, nebo je v ní tekutina?",
      "Když rostlina dlouho nedostane vodu, zvadne. Souvisí to právě s tímhle měchýřkem: ztrácí obsah a přestává tlačit na stěnu buňky.",
    ],
    explanation: "Vakuola je měchýřek s buněčnou šťávou. Když je plný, tlačí na stěnu a buňka je napjatá. Když rostlina vodu ztratí, vakuoly se zmenší a rostlina vadne. Vzduch v ní není.",
  },
  {
    q: "K čemu slouží mitochondrie?",
    correct: F_MITO,
    distractors: [
      { value: "Vyrábějí pomocí světla živiny z vody", why: "To dělají chloroplasty. Mitochondrie živiny rozkládají a uvolňují z nich energii." },
      { value: "Nesou dědičné informace buňky", why: "Dědičné informace jsou uložené hlavně v jádru. Mitochondrie uvolňují energii." },
      { value: "Propouštějí látky dovnitř buňky a ven", why: "Látky propouští cytoplazmatická membrána na povrchu buňky." },
    ],
    hints: [
      "Mitochondrie mají rostlinné i živočišné buňky. Co potřebuje každá buňka, aby mohla pracovat?",
      "Buňka potřebuje energii na všechno, co dělá. Tu získá z živin při buněčném dýchání. Výroba živin ze světla je jiný děj, který mají jen zelené rostliny.",
    ],
    explanation: "V mitochondriích probíhá buněčné dýchání: z živin se uvolňuje energie pro činnost buňky. Mají je rostlinné i živočišné buňky. Živiny ze světla vyrábějí chloroplasty.",
  },
  {
    q: "K čemu slouží cytoplazmatická membrána?",
    correct: F_MEMBRANA,
    distractors: [
      { value: "Zpevňuje buňku a dává jí pevný tvar", why: "To je úkol buněčné stěny, kterou mají jen rostliny. Membrána je tenká a pružná." },
      { value: "Uvolňuje z živin energii pro buňku", why: "Energii z živin uvolňují mitochondrie." },
      { value: "Uchovává zásobu vody a buněčné šťávy", why: "Buněčnou šťávu uchovává vakuola." },
    ],
    hints: [
      "Membrána je tenká blána na povrchu každé buňky. Co musí dělat hranice mezi buňkou a okolím?",
      "Buňka potřebuje přijímat vodu a živiny a zbavovat se odpadu. Tenká blána na povrchu rozhoduje, co projde. Pevnost jí nedává, na to mají rostliny zvláštní obal.",
    ],
    explanation: "Cytoplazmatická membrána odděluje buňku od okolí a propouští do ní potřebné látky a ven odpad. Zpevnění dává rostlinám buněčná stěna, šťávu uchovává vakuola.",
  },
  {
    q: "K čemu slouží cytoplazma?",
    correct: F_CYTO,
    distractors: [
      { value: "Obaluje buňku a chrání ji před okolím", why: "Buňku obaluje membrána (u rostlin i stěna). Cytoplazma je uvnitř." },
      { value: "Nese dědičné informace o celé buňce", why: "Dědičné informace nese jádro, které je v cytoplazmě uložené." },
      { value: "Vyrábí pomocí světla živiny pro buňku", why: "Živiny ze světla vyrábějí chloroplasty." },
    ],
    hints: [
      "Cytoplazma je rosolovitá hmota. Kde v buňce je — na povrchu, nebo uvnitř?",
      "Mezi obalem a jádrem je rosolovitá hmota, ve které plavou tělíska buňky. Zvaž, jestli taková hmota buňku obaluje, řídí, nebo tvoří prostředí, ve kterém buňka pracuje.",
    ],
    explanation: "Cytoplazma vyplňuje vnitřek buňky. Jsou v ní uložené ostatní součásti a probíhá v ní většina buněčných dějů. Obal tvoří membrána, dědičné informace nese jádro.",
  },
  {
    q: "K čemu slouží zelené barvivo chlorofyl?",
    correct: "Zachycuje světlo potřebné k výrobě živin",
    distractors: [
      { value: "Uvolňuje z živin energii při dýchání", why: "Dýchání probíhá v mitochondriích a chlorofyl k němu není potřeba. Mají ho jen zelené části rostlin." },
      { value: "Láká svou barvou hmyz k opylení", why: "Hmyz lákají barevné květy. Zelený chlorofyl slouží k fotosyntéze." },
      { value: "Chrání list před spálením sluncem", why: "Chlorofyl světlo naopak využívá. Bez světla by rostlina nemohla vyrábět živiny." },
    ],
    hints: [
      "Chlorofyl je uložený v chloroplastech. Co v nich rostlina dělá?",
      "Rostlina vyrábí živiny z vody a oxidu uhličitého a potřebuje k tomu energii ze slunce. Zelené barvivo je součást, která tu energii přijímá.",
    ],
    explanation: "Chlorofyl je zelené barvivo v chloroplastech. Zachycuje světlo, a tak rostlina může vyrábět živiny (fotosyntéza). Květy lákají hmyz jinými barvivy.",
  },
];

// ── L2 — POUŽITÍ: srovnání rostlinné a živočišné buňky ──────────────────────
interface Bunka { gen: string; zelena: boolean; proc: string }

const ROSTLINNE: Bunka[] = [
  { gen: "listu", zelena: true, proc: "" },
  { gen: "vnitřní slupky cibule", zelena: false, proc: "vnitřek cibule není na světle" },
  { gen: "dužiny zralého rajčete", zelena: false, proc: "zralá dužina má místo nich červená barviva" },
  { gen: "kořene mrkve", zelena: false, proc: "kořen roste pod zemí bez světla" },
];
const ZIVOCISNE: string[] = ["lidské kůže", "sliznice z tváře", "svalu"];
const SPOLECNE = [JADRO, CYTO, MITO];
const V_VAKUOLA = "Velká vakuola";

function genL2a(p: Bunka, a: string, i: number): Polozka {
  const key = p.zelena ? [CHLORO, STENA, V_VAKUOLA][i % 3] : i % 2 === 0 ? STENA : V_VAKUOLA;
  const dva = [SPOLECNE[i % 3], SPOLECNE[(i + 1) % 3]];
  const spolecna = (n: string) => ({
    value: n,
    why: `${n === JADRO ? "Jádro" : n === CYTO ? "Cytoplazmu" : "Mitochondrie"} má buňka ${p.gen} i buňka ${a}. Hledáš součást, která živočišné buňce chybí.`,
  });
  const membrana = {
    value: MEMBRANA,
    why: key === STENA
      ? `Membránu má buňka ${p.gen} i buňka ${a}. Obal, který živočišné buňce chybí, je pevný a leží až nad membránou.`
      : `Membránu má každá buňka, tedy i buňka ${a}. Hledáš součást, kterou mají jen rostliny.`,
  };
  const napoveda: Record<string, [string, string]> = {
    [CHLORO]: [
      `Buňka ${p.gen} je zelená, buňka ${a} ne. Čím je to způsobené?`,
      `Porovnej, co každá z nabízených součástí dělá. Buňka ${a} si potravu nevyrábí, dostává ji z těla. Buňka ${p.gen} ji vyrábí sama pomocí světla.`,
    ],
    [STENA]: [
      `Buňka ${p.gen} drží pevný tvar, buňka ${a} je měkká a pružná. Který obal to způsobuje?`,
      `Tenkou blánu na povrchu mají obě buňky. Rostlinná buňka ${p.gen} má ale ještě jeden obal, pevný a z celulózy, který buňka ${a} ani jiné živočišné buňky nemají.`,
    ],
    [V_VAKUOLA]: [
      `Pod mikroskopem zabírá v buňce ${p.gen} velkou část prostoru měchýřek s tekutinou. Má ho i buňka ${a}?`,
      `Rostlina vadne, když jí chybí voda — buňka ${p.gen} ji má uloženou ve velkém měchýřku s buněčnou šťávou. U buňky ${a} je takový měchýřek malý, nebo žádný.`,
    ],
  };
  const vysvetleni: Record<string, string> = {
    [CHLORO]: `Chloroplasty jsou v zelených částech rostlin, třeba v listu, kde vyrábějí živiny pomocí světla. Živočišné buňky, tedy ani buňka ${a}, je nemají. Jádro, cytoplazmu, membránu a mitochondrie mají obě.`,
    [STENA]: `Buněčnou stěnu z celulózy mají jen rostlinné buňky, tedy i buňka ${p.gen}. Buňka ${a} má jen tenkou membránu. Jádro, cytoplazmu a mitochondrie mají obě.`,
    [V_VAKUOLA]: `Velkou vakuolu s buněčnou šťávou mají rostlinné buňky, tedy i buňka ${p.gen}. Živočišná buňka ${a} ji nemá. Jádro, cytoplazmu, membránu a mitochondrie mají obě.`,
  };
  return {
    q: [
      `Kterou součást má buňka ${p.gen}, ale buňka ${a} ji nemá?`,
      `Kterou součást NEMÁ buňka ${a}, přestože ji buňka ${p.gen} má?`,
      `Rostlinná buňka ${p.gen} má součást, která živočišné buňce ${a} chybí. Kterou?`,
    ][i % 3],
    correct: key,
    distractors: [membrana, ...dva.map(spolecna)],
    hints: napoveda[key],
    explanation: vysvetleni[key],
  };
}

const SPOLECNE_B = [JADRO, MEMBRANA, CYTO, MITO];
const ROLE: Record<string, string> = {
  [JADRO]: "Jádro řídí činnost buňky a mají ho rostlinné i živočišné buňky",
  [MEMBRANA]: "Cytoplazmatická membrána propouští látky dovnitř a ven a má ji každá buňka",
  [CYTO]: "Cytoplazma vyplňuje vnitřek buňky a má ji každá buňka",
  [MITO]: "Mitochondrie uvolňují z živin energii a mají je rostlinné i živočišné buňky",
};

function genL2b(p: Bunka, a: string, i: number): Polozka {
  const key = SPOLECNE_B[i % 4];
  return {
    q: [
      `Kterou součást najdeš v buňce ${p.gen} i v buňce ${a}?`,
      `Kterou součást má živočišná buňka ${a} stejně jako rostlinná buňka ${p.gen}?`,
      `Buňka ${a} a buňka ${p.gen} se v mnohém liší. Kterou součást ale mají obě?`,
    ][(i + 1) % 3],
    correct: key,
    distractors: [
      {
        value: STENA,
        why: `Stěnu mají jen rostlinné buňky. Buňka ${a} má na povrchu jen tenkou membránu, přes kterou procházejí látky.`,
      },
      {
        value: CHLORO,
        why: p.zelena
          ? `Chloroplasty buňka ${p.gen} má, ale živočišné buňky je nemají nikdy.`
          : `Chloroplasty nemá ani buňka ${p.gen}, protože ${p.proc}. Živočišné buňky je nemají nikdy.`,
      },
      {
        value: V_VAKUOLA,
        why: `Velkou vakuolu s buněčnou šťávou mají jen rostlinné buňky. Buňka ${a} ji nemá.`,
      },
    ],
    hints: [
      `Buňka ${p.gen} je rostlinná, buňka ${a} živočišná. Vyřaď součásti, které mají jen rostliny.`,
      `Rostlinná buňka ${p.gen} může mít oproti živočišné tři součásti navíc: pevný obal, zelená tělíska a velký měchýřek se šťávou. Buňka ${a} má jen to, co mají všechny buňky: řídicí centrum, tenkou blánu, rosolovitou hmotu a tělíska pro dýchání.`,
    ],
    explanation: `${ROLE[key]}, tedy buňka ${p.gen} i buňka ${a}. Buněčnou stěnu, chloroplasty a velkou vakuolu mají jen rostliny.`,
  };
}

const L2_PROC: Polozka[] = [
  {
    q: "Proč buňky kořene mrkve nejsou zelené, přestože jsou rostlinné?",
    correct: "Nemají chloroplasty, protože pod zemí chybí světlo",
    distractors: [
      { value: "Chloroplasty mají, jen je překrývá oranžové barvivo", why: "Oranžovou barvu dávají mrkvi jiná barviva. Zelená tělíska v kořeni nejsou, protože by pod zemí neměla co dělat." },
      { value: "Nemají jádro, a proto nevytvoří zelené barvivo", why: "Jádro mají buňky kořene i listu. Zelené barvivo je uložené v chloroplastech." },
      { value: "Nemají buněčnou stěnu, která drží zelenou barvu", why: "Stěnu mají všechny rostlinné buňky, i v kořeni. Barvu nedává stěna, ale zelená tělíska." },
    ],
    hints: [
      "Rostlinná buňka nemusí mít všechny rostlinné součásti. Kde roste kořen a co tam chybí?",
      "Zelená tělíska potřebují ke své práci světlo. Zamysli se, jestli by se rostlině vyplatilo mít je v části, kam světlo nikdy nedopadne.",
    ],
    explanation: "Chloroplasty vyrábějí živiny pomocí světla. Kořen mrkve roste pod zemí, kam světlo nedopadá, a proto chloroplasty nemá. Stěnu, jádro i vakuolu jeho buňky mají, jsou to rostlinné buňky.",
  },
  {
    q: "Proč buňky z vnitřní slupky cibule nejsou pod mikroskopem zelené, přestože jsou rostlinné?",
    correct: "Nemají chloroplasty, protože uvnitř cibule chybí světlo",
    distractors: [
      { value: "Chloroplasty mají, ale pod mikroskopem nejsou vidět", why: "Chloroplasty jsou pod školním mikroskopem dobře vidět, třeba v lístku mechu. Ve vnitřní slupce cibule prostě nejsou." },
      { value: "Nemají chloroplasty, protože jsou to buňky živočišné", why: "Cibule je rostlina a její buňky mají stěnu i velkou vakuolu. Rostlinná buňka nemusí být zelená." },
      { value: "Nemají jádro, a proto nevytvoří zelené barvivo", why: "Buňky vnitřní slupky cibule jádro mají, po obarvení je dobře vidět. Zelené barvivo je v chloroplastech." },
    ],
    hints: [
      "Cibule je rostlina, přesto nejsou její buňky zelené. Kde se vnitřní slupky cibule nacházejí?",
      "Slupky jsou schované uvnitř cibule a ta bývá částečně v zemi. Zamysli se, co potřebují zelená tělíska ke své práci a jestli to tam mají.",
    ],
    explanation: "Chloroplasty potřebují světlo. Dužnaté slupky jsou uvnitř cibule, kam světlo nepronikne, a proto chloroplasty nemají. Stěnu, jádro a velkou vakuolu jejich buňky mají, cibule je rostlina.",
  },
  {
    q: "Proč buňky hlízy brambory nejsou zelené, přestože jsou rostlinné?",
    correct: "Nemají chloroplasty, protože hlíza roste pod zemí",
    distractors: [
      { value: "Chloroplasty mají, jen je zakrývá hnědá slupka", why: "Rozkrojená hlíza je uvnitř bílá. Chloroplasty v ní nejsou, protože pod zemí není světlo." },
      { value: "Nemají stěnu, protože hlíza je měkká a křehká", why: "Stěnu mají všechny rostlinné buňky, i v hlíze. A zelenou barvu stěna nedává." },
      { value: "Nemají mitochondrie, které by je zbarvily", why: "Mitochondrie buňky nebarví, uvolňují energii. Hlíza je má jako každá buňka." },
    ],
    hints: [
      "Kde brambory rostou a dopadá tam světlo?",
      "Zelená tělíska vyrábějí živiny jen tam, kde svítí slunce. Hlíza je zásobárna, kterou rostlina ukládá do země.",
    ],
    explanation: "Hlíza brambory roste pod zemí, kam světlo nedopadá, a proto její buňky chloroplasty nemají. Jsou to přesto rostlinné buňky se stěnou, jádrem a vakuolou.",
  },
  {
    q: "Proč jsou buňky listu zelené, ale buňky kořene téže rostliny ne?",
    correct: "Chloroplasty jsou v listu, kam dopadá světlo, v kořeni ne",
    distractors: [
      { value: "Kořen má chloroplasty, ale chlorofyl se v nich rozloží", why: "Chlorofyl se rozkládá třeba na podzim v listech. Kořen chloroplasty vůbec nemá, protože pod zemí není světlo." },
      { value: "Chloroplasty jsou i v kořeni, jen jsou zakryté hlínou", why: "Pod mikroskopem by se ukázaly i v umytém kořeni. V kořeni ale nejsou, protože tam není světlo." },
      { value: "Kořen nemá jádra, a tak nemůže být zelený", why: "Buňky kořene jádro mají. Zelenou barvu dávají chloroplasty." },
    ],
    hints: [
      "Porovnej, kde je list a kde kořen. Co má list k dispozici a kořen ne?",
      "Obě části mají rostlinné buňky se stěnou a jádrem. Liší se v zelených tělískách, která dávají smysl jen tam, kde mohou využít sluneční paprsky.",
    ],
    explanation: "Chloroplasty jsou v buňkách, na které dopadá světlo, hlavně v listech. Kořen je pod zemí, proto je nemá. Obě části mají rostlinné buňky se stěnou, jádrem a vakuolou.",
  },
  {
    q: "Proč buňky kořene petržele nejsou zelené, i když rostlina má zelené listy?",
    correct: "Chloroplasty v kořeni nejsou, protože je tam tma",
    distractors: [
      { value: "Chloroplasty v kořeni jsou, jen jsou bílé", why: "Chloroplasty jsou vždy zelené, protože obsahují chlorofyl. V kořeni nejsou vůbec." },
      { value: "Kořen nemá velkou vakuolu, a proto není zelený", why: "Buňky kořene velkou vakuolu mají a vakuola zelenou barvu nedává. Barví chloroplasty, a ty v kořeni ve tmě nejsou." },
      { value: "Kořen nemá stěnu, která by chloroplasty udržela", why: "Buňky kořene stěnu mají. Chloroplasty chybí kvůli tmě, ne kvůli stěně." },
    ],
    hints: [
      "Listy a kořen jsou části jedné rostliny. Co je jinak v prostředí, kde rostou?",
      "Rostlina staví zelená tělíska jen tam, kde je může použít. Ke své práci potřebují sluneční paprsky, a ty do půdy nepronikají.",
    ],
    explanation: "Kořen petržele roste v půdě, kde je tma. Chloroplasty by tam nemohly vyrábět živiny, a proto v kořeni nejsou. Kořen je živý a jeho buňky mají stěnu, jádro i vakuolu.",
  },
];

// ── L3 — PŘENOS: neznámý případ ─────────────────────────────────────────────
const P_CIBULE = "Z vnitřní slupky cibule";
const P_MECH = "Z lístku mechu";
const P_SLIZNICE = "Z ústní sliznice";
const P_SVAL = "Z kuřecího svalu";
const P_MRKEV = "Z kořene mrkve";

const L3_PREPARAT: Polozka[] = [
  {
    q: "Pod mikroskopem vidíš buňky s pevnou stěnou, velkou vakuolou a bez zelených tělísek. Z čeho mohl být preparát?",
    correct: P_CIBULE,
    distractors: [
      { value: P_MECH, why: "Lístek mechu je zelený, jeho buňky by byly plné chloroplastů." },
      { value: P_SLIZNICE, why: "Chybějící zelená tělíska neznamenají živočicha. Buňky sliznice nemají stěnu ani velkou vakuolu." },
      { value: P_SVAL, why: "Svalové buňky jsou živočišné, takže nemají stěnu ani velkou vakuolu." },
    ],
    hints: [
      "Stěna a velká vakuola prozrazují typ buňky. Co znamená, že chybějí zelená tělíska?",
      "Stěnu a velkou vakuolu mají jen rostliny, takže jde o rostlinu. Ne každá rostlinná buňka je ale zelená: chybí tam, kam nesvítí slunce. Hledej rostlinnou část, která není zelená.",
    ],
    explanation: "Stěna a velká vakuola znamenají rostlinnou buňku. Zelená tělíska chybí, takže je z části rostliny, kam nedopadá světlo — třeba z vnitřní slupky cibule. Mech je zelený, sliznice a sval jsou živočišné.",
  },
  {
    q: "Buňky v preparátu jsou obalené pevnou stěnou a jsou plné zelených tělísek. Z čeho mohl být preparát?",
    correct: P_MECH,
    distractors: [
      { value: P_CIBULE, why: "Vnitřní slupka cibule je rostlinná, ale zelená tělíska nemá, protože je schovaná před světlem." },
      { value: P_SLIZNICE, why: "Buňky sliznice jsou živočišné, nemají stěnu ani zelená tělíska." },
      { value: P_MRKEV, why: "Kořen mrkve je rostlinný, ale roste pod zemí, takže zelená tělíska nemá." },
    ],
    hints: [
      "Pevná stěna ukazuje na rostlinu. Která rostlinná část je zelená?",
      "Zelená tělíska jsou chloroplasty a potřebují světlo. Vyřaď živočišné buňky a pak i rostlinné části, které rostou ve tmě nebo jsou schované.",
    ],
    explanation: "Stěna znamená rostlinnou buňku a zelená tělíska (chloroplasty) jsou jen v částech rostliny na světle. Lístek mechu je zelený. Cibule a kořen mrkve chloroplasty nemají, sliznice je živočišná.",
  },
  {
    q: "Buňky v preparátu jsou nepravidelné, nemají stěnu ani zelená tělíska, ale jádro je dobře vidět. Odkud mohly být?",
    correct: P_SLIZNICE,
    distractors: [
      { value: P_CIBULE, why: "Vnitřní slupka cibule sice není zelená, ale její buňky mají pevnou stěnu a pravidelný tvar." },
      { value: P_MECH, why: "Mech je rostlina se stěnou a spoustou chloroplastů." },
      { value: P_MRKEV, why: "Kořen mrkve není zelený, ale jako rostlina má buňky se stěnou." },
    ],
    hints: [
      "Rozhodující je chybějící stěna. Které buňky ji nemají nikdy?",
      "Jádro mají rostlinné i živočišné buňky, takže o typu nerozhoduje. Nezelená je i cibule a mrkev, ty ale stěnu mají. Hledej buňku, která je živočišná.",
    ],
    explanation: "Bez stěny a s nepravidelným tvarem jde o živočišnou buňku — ze sliznice. Cibule a mrkev nejsou zelené, ale stěnu mají. Jádro mají oba typy buněk.",
  },
  {
    q: "V atlase jsou popsané dvě buňky: první má stěnu a velkou vakuolu, druhá nemá ani jedno. Která dvojice odpovídá?",
    correct: "První z listu, druhá ze svalu",
    distractors: [
      { value: "První ze svalu, druhá z listu", why: "Je to obráceně. Stěnu a velkou vakuolu mají rostlinné buňky, sval je živočišný." },
      { value: "Obě z listu, druhá je jen mladší", why: "I mladá buňka listu má stěnu. Buňka bez stěny je živočišná." },
      { value: "Obě ze svalu, první je jen starší", why: "Svalová buňka stěnu ani velkou vakuolu nemá, ani ve stáří." },
    ],
    hints: [
      "Pevná stěna není věc stáří buňky, mají ji i mladé rostlinné buňky. Jaký typ buňky prozrazuje?",
      "Každý znak přiřaď k typu buňky: pevný obal a velký měchýřek se šťávou mají jen rostliny. Buňka bez nich je živočišná. Pak zkontroluj, která dvojice má oba typy ve správném pořadí.",
    ],
    explanation: "Stěnu a velkou vakuolu mají rostlinné buňky, například z listu. Buňka bez stěny je živočišná, například ze svalu. Stěnu má každá rostlinná buňka, i mladá.",
  },
  {
    q: "Pod mikroskopem vidíš oranžové buňky s pevnou stěnou a bez zelených tělísek. Z čeho mohl být preparát?",
    correct: P_MRKEV,
    distractors: [
      { value: P_MECH, why: "Buňky lístku mechu jsou plné zelených chloroplastů." },
      { value: P_SVAL, why: "Nezelená buňka nemusí být živočišná. Svalová buňka ale stěnu nemá." },
      { value: P_SLIZNICE, why: "Buňky sliznice jsou živočišné a stěnu nemají." },
    ],
    hints: [
      "Stěna ukazuje na rostlinu. Která rostlinná část není zelená a je oranžová?",
      "Zelená tělíska chybějí v částech rostliny, které rostou ve tmě. Oranžová barva pochází z jiného barviva. Vyřaď buňky bez stěny a pak zelené části.",
    ],
    explanation: "Stěna znamená rostlinnou buňku. Kořen mrkve roste pod zemí, a proto nemá chloroplasty. Oranžovou barvu mu dává jiné barvivo. Sval a sliznice stěnu nemají, mech je zelený.",
  },
  {
    q: "Buňky v preparátu jsou protáhlé, nemají stěnu ani velkou vakuolu a jsou plné mitochondrií. Odkud mohly být?",
    correct: P_SVAL,
    distractors: [
      { value: P_MECH, why: "Mech je rostlina — jeho buňky by měly stěnu a chloroplasty." },
      { value: P_CIBULE, why: "Buňky cibule mají pevnou stěnu a velkou vakuolu." },
      { value: P_MRKEV, why: "Mitochondrie mají obě buňky, o typu nerozhodují. Buňky kořene mrkve by měly stěnu." },
    ],
    hints: [
      "Mitochondrie mají všechny buňky. Který znak rozhoduje, a co prozrazuje, že jich je hodně?",
      "Bez stěny a velké vakuoly je buňka živočišná. Hodně tělísek pro dýchání potřebuje buňka, která spotřebuje hodně energie, třeba při pohybu.",
    ],
    explanation: "Bez stěny a velké vakuoly jde o živočišnou buňku. Mnoho mitochondrií potřebují buňky, které spotřebují hodně energie — svalové. Mech, cibule a mrkev jsou rostliny se stěnou.",
  },
];

const L3_CHYBI: Polozka[] = [
  {
    q: "Buňce listu by chyběly chloroplasty. Co by nemohla dělat?",
    correct: "Vyrábět živiny pomocí světla",
    distractors: [
      { value: "Dýchat a získávat z živin energii", why: "Dýchání probíhá v mitochondriích, ty by buňce zůstaly. Chloroplasty vyrábějí živiny." },
      { value: "Přijímat vodu a látky z okolí", why: "Látky propouští membrána, ta by buňce zůstala." },
      { value: "Řídit svou činnost a dělit se", why: "Činnost buňky řídí jádro, ne chloroplasty." },
    ],
    hints: [
      "Ptej se, co dělají chybějící zelená tělíska. Ostatní součásti buňce zůstaly.",
      "U každé možnosti zjisti, která součást ji zajišťuje. Dýchání, příjem látek i řízení obstarávají jiné součásti, které buňka má dál.",
    ],
    explanation: "Chloroplasty vyrábějí pomocí světla živiny (fotosyntéza). Bez nich by to buňka nedokázala. Dýchat by mohla dál díky mitochondriím, látky by přijímala membránou a řídilo by ji jádro.",
  },
  {
    q: "Rostlina několik dní nedostala vodu a vakuoly v jejích buňkách se zmenšily. Co na rostlině uvidíš?",
    correct: "Listy zvadnou a svěsí se",
    distractors: [
      { value: "Nic, vakuoly jsou stejně prázdné", why: "Vakuola není prázdná, je plná buněčné šťávy. Když ji ztratí, buňka povolí." },
      { value: "Listy ztvrdnou, protože stěny zůstanou pevné", why: "Stěna sama rostlinu neudrží. Pevnost dává až plná vakuola, která na stěnu tlačí zevnitř." },
      { value: "Listy přestanou dýchat bez vzduchu", why: "Vakuola není zásobárna vzduchu. Dýchání probíhá v mitochondriích." },
    ],
    hints: [
      "Co je ve vakuole a co dělá plná vakuola se stěnou buňky?",
      "Plná vakuola tlačí zevnitř na stěnu a buňka je napjatá jako nafouknutý míč. Zamysli se, co se stane s míčem a s celou rostlinou, když z něj uteče obsah.",
    ],
    explanation: "Plné vakuoly tlačí na stěny buněk, a proto jsou listy pevné. Když vakuoly ztratí vodu, buňky povolí a rostlina vadne. Vakuola je plná šťávy, ne vzduchu, a dýchání probíhá v mitochondriích.",
  },
  {
    q: "Kdyby buňce kůže chybělo jádro, co by nedokázala?",
    correct: "Rozdělit se na nové buňky",
    distractors: [
      { value: "Uvolnit z živin energii", why: "Energii uvolňují mitochondrie. Jádro buňku řídí a při dělení předává dědičné informace." },
      { value: "Přijímat vodu a látky z okolí", why: "Látky do buňky propouští membrána, a ta by buňce zůstala." },
      { value: "Oddělit se od okolí tenkou blánou", why: "Tenká blána na povrchu je cytoplazmatická membrána. Ta by buňce zůstala i bez jádra." },
    ],
    hints: [
      "Co je v jádru uložené a k čemu to buňka potřebuje?",
      "U každé možnosti zjisti, která součást ji zajišťuje. Mitochondrie i membrána by buňce zůstaly, chybí jen jádro. Co dělá jen ono?",
    ],
    explanation: "Jádro nese dědičné informace a řídí dělení. Bez něj by se buňka nerozdělila na nové. Energii uvolňují mitochondrie, látky přijímá a buňku od okolí odděluje membrána — ty by buňce zůstaly.",
  },
  {
    q: "Kdyby svalové buňce chyběly mitochondrie, co by nemohla dělat?",
    correct: "Získávat z živin energii k pohybu",
    distractors: [
      { value: "Vyrábět si živiny pomocí světla", why: "To svalová buňka neumí nikdy, nemá chloroplasty. Mitochondrie energii z živin uvolňují, nevyrábějí živiny." },
      { value: "Předávat dědičné informace dál", why: "Dědičné informace nese jádro, ne mitochondrie." },
      { value: "Propouštět do sebe vodu a látky", why: "Látky propouští membrána, ta by buňce zůstala." },
    ],
    hints: [
      "Co v mitochondriích probíhá a proč to sval potřebuje?",
      "Sval při každém pohybu spotřebuje energii. Zjisti, kterou součást buňky zajišťuje uvolnění energie z živin, a vyřaď činnosti, které patří jiným součástem.",
    ],
    explanation: "V mitochondriích probíhá buněčné dýchání, při kterém se z živin uvolní energie. Bez nich by sval neměl energii k pohybu. Dědičnost nese jádro a látky propouští membrána.",
  },
  {
    q: "Kdyby rostlinným buňkám chyběla buněčná stěna, co by se stalo se stonkem?",
    correct: "Stonek by neudržel tvar a poklesl",
    distractors: [
      { value: "Stonek by nepřijímal vodu a látky", why: "Látky propouští membrána, ne stěna. Membrána by buňkám zůstala." },
      { value: "Stonek by ztratil zelenou barvu", why: "Zelenou barvu dávají chloroplasty, ne stěna." },
      { value: "Stonek by přestal dýchat", why: "Dýchání probíhá v mitochondriích, a ty by buňkám zůstaly. Stěna buňku zpevňuje." },
    ],
    hints: [
      "Co dělá stěna pro jednu buňku? Co to znamená pro celý stonek?",
      "Stonek nemá kosti. Drží ho pohromadě pevné obaly milionů buněk. Ostatní možnosti patří součástem, které by buňkám zůstaly.",
    ],
    explanation: "Buněčná stěna zpevňuje buňku a dává jí tvar. Bez ní by stonek neměl oporu a poklesl by. Látky propouští membrána, barvu dávají chloroplasty, dýchání obstarávají mitochondrie.",
  },
  {
    q: "Kdyby buňce cibule chyběla cytoplazmatická membrána a zůstala jen stěna, co by se stalo?",
    correct: "Buňka by nehlídala, co do ní projde",
    distractors: [
      { value: "Nic, stěna by látky hlídala stejně", why: "Stěna je pevná, ale propustná — látky nevybírá. To dělá membrána." },
      { value: "Buňka by ztratila tvar a zhroutila se", why: "Tvar dává stěna, a ta by zůstala. Chyběla by součást, která pouští látky." },
      { value: "Buňka by nemohla vyrábět živiny", why: "Slupka cibule živiny ze světla nevyrábí ani normálně, nemá chloroplasty." },
    ],
    hints: [
      "Stěna a membrána jsou oba obaly, ale mají jinou práci. Kterou z nich dělá jen membrána?",
      "Stěna je jako pevný plot s velkými otvory a buňku zpevňuje. Tenká blána pod ní je jako vrátný, který rozhoduje, co smí dovnitř a ven.",
    ],
    explanation: "Cytoplazmatická membrána propouští jen některé látky. Stěna buňku zpevňuje, ale látky nevybírá. Bez membrány by buňka nemohla řídit, co do ní vstupuje a co odchází.",
  },
];

const L3_ORGANISMUS: Polozka[] = [
  {
    q: "Proč rostlina nepotřebuje kostru, i když může dorůst výšky stromu?",
    correct: "Protože ji zpevňují pevné buněčné stěny",
    distractors: [
      { value: "Protože ji nadnášejí vakuoly plné vzduchu", why: "Vakuoly nejsou plné vzduchu, ale buněčné šťávy. Pevnost dávají stěny." },
      { value: "Protože chloroplasty tvoří tvrdou hmotu", why: "Chloroplasty vyrábějí živiny, pevnost nedávají." },
      { value: "Protože jí mitochondrie dodávají sílu", why: "Mitochondrie uvolňují energii, ale rostlinu nezpevňují." },
    ],
    hints: [
      "Která součást rostlinné buňky ji zpevňuje a živočišné buňce chybí?",
      "Živočišné buňky mají jen tenkou blánu, takže velcí živočichové potřebují jinou oporu, třeba kostru. Rostlinná buňka má navíc pevný obal a miliony takových obalů drží celou rostlinu.",
    ],
    explanation: "Rostlinné buňky mají pevné buněčné stěny z celulózy. Dohromady zpevňují celé tělo rostliny, u stromů jsou stěny ve dřevě zvlášť silné. Živočišné buňky stěnu nemají, a proto se větší živočichové opírají o kostru.",
  },
  {
    q: "Proč je nejvíc chloroplastů v buňkách na horní straně listu?",
    correct: "Protože tam na list dopadá nejvíc světla",
    distractors: [
      { value: "Protože tam list potřebuje nejvíc zpevnit", why: "List zpevňují stěny a žilky. Chloroplasty vyrábějí živiny." },
      { value: "Protože tam list nejvíc dýchá a spotřebuje energii", why: "Dýchání probíhá v mitochondriích. Chloroplasty potřebují světlo." },
      { value: "Protože tam list uchovává nejvíc vody", why: "Vodu uchovávají vakuoly. Chloroplasty jsou tam, kde je světlo." },
    ],
    hints: [
      "Co chloroplasty potřebují ke své práci? Odkud to na list přichází?",
      "Chloroplasty vyrábějí živiny jen tehdy, když na ně dopadá sluneční záření. Zamysli se, kterou stranou je list obrácený ke slunci.",
    ],
    explanation: "Chloroplasty potřebují ke fotosyntéze světlo. Horní strana listu je obrácená ke slunci, a proto jsou tam buňky s nejvíce chloroplasty. Zpevnění, dýchání a zásoba vody obstarávají jiné součásti.",
  },
  {
    q: "Proč mají svalové buňky mnohem víc mitochondrií než buňky kůže?",
    correct: "Protože sval při pohybu spotřebuje hodně energie",
    distractors: [
      { value: "Protože sval potřebuje vyrábět živiny ze světla", why: "Živiny ze světla vyrábějí chloroplasty a živočišné buňky je nemají." },
      { value: "Protože sval musí být zpevněný jako stěnou", why: "Mitochondrie buňku nezpevňují. Tělo zpevňuje kostra." },
      { value: "Protože sval v nich skladuje vodu a šťávu", why: "Mitochondrie nejsou zásobárna vody, v nich se uvolňuje energie." },
    ],
    hints: [
      "Co mitochondrie dělají? Která z obou buněk toho potřebuje víc?",
      "Kůže tělo hlavně chrání, sval se neustále stahuje. Pro každý stah je potřeba energie, kterou buňka uvolní z živin.",
    ],
    explanation: "V mitochondriích se z živin uvolňuje energie. Svalové buňky ji spotřebují hodně při pohybu, a proto mají mitochondrií mnohem víc než buňky kůže.",
  },
  {
    q: "Proč se zvadlá rostlina po zalití za pár hodin zase napřímí?",
    correct: "Protože se vakuoly znovu naplní vodou",
    distractors: [
      { value: "Protože voda ztuhne v buněčných stěnách", why: "Voda ve stěnách netuhne. Pevnost vrací vakuoly, které se naplní a tlačí na stěny." },
      { value: "Protože se vzduch ve vakuolách nafoukne", why: "Ve vakuolách není vzduch, ale buněčná šťáva." },
      { value: "Protože se v buňkách vytvoří nová jádra", why: "Jádra buňky mají pořád. Napřímení způsobí voda ve vakuolách." },
    ],
    hints: [
      "Proč rostlina zvadla? Která součást buňky ztratila obsah?",
      "Rostlina vadne, když buňky ztratí vodu a přestanou být napjaté. Po zalití voda doputuje do buněk a uloží se do součásti, která tlačí zevnitř na stěnu.",
    ],
    explanation: "Po zalití se vakuoly znovu naplní vodou a tlačí zevnitř na buněčné stěny. Buňky jsou napjaté a rostlina se napřímí. Stěny zůstávají stejné a jádra buňky mají pořád.",
  },
  {
    q: "Proč lidské tělo drží tvar, i když jeho buňky nemají buněčnou stěnu?",
    correct: "Protože ho zpevňuje kostra a svaly",
    distractors: [
      { value: "Protože lidské buňky mají stěnu, jen tenkou", why: "Lidské buňky stěnu nemají. Mají jen tenkou membránu, která buňku nezpevní." },
      { value: "Protože membrána je tvrdá jako stěna", why: "Membrána je tenká a pružná, tvar těla neudrží." },
      { value: "Protože lidské buňky mají velké vakuoly", why: "Velké vakuoly mají rostlinné buňky. Lidské buňky je nemají." },
    ],
    hints: [
      "Živočišné buňky jsou měkké a pružné. Co tělo drží zvenku, nebo zevnitř jako lešení?",
      "Rostlina se opírá o pevné obaly buněk. Živočich takový obal nemá, a tak potřebuje oporu z celých orgánů, které jsou tvrdé nebo silné.",
    ],
    explanation: "Lidské buňky mají jen tenkou membránu, stěnu ani velké vakuoly nemají. Tvar těla proto drží kostra a svaly. U rostlin tuto roli plní buněčné stěny.",
  },
];

// ── Generátor ───────────────────────────────────────────────────────────────
/** Střídá šablony: první z každé, druhá z každé… dokud nedojdou. */
function prolozit<T>(skupiny: T[][]): T[] {
  const out: T[] = [];
  const max = Math.max(...skupiny.map((s) => s.length));
  for (let i = 0; i < max; i++) for (const s of skupiny) if (i < s.length) out.push(s[i]);
  return out;
}

function bankaL2(): Polozka[] {
  const a: Polozka[] = [];
  const b: Polozka[] = [];
  let i = 0;
  for (const p of ROSTLINNE) {
    for (const z of ZIVOCISNE) {
      a.push(genL2a(p, z, i));
      b.push(genL2b(p, z, i));
      i++;
    }
  }
  return prolozit([a, b, L2_PROC]);
}

/** Deterministicky projde banku — rotace začíná znovu při každém volání gen(). */
function zBanky(pool: Polozka[]): PracticeTask[] {
  let i = 0;
  return ruzneUlohy(() => losUlohy(() => vytvor(pool[i++ % pool.length])), pool.length, pool.length * 2);
}

function gen(level: number): PracticeTask[] {
  if (level <= 1) return zBanky(prolozit([L1_SOUCAST, L1_FUNKCE]));
  if (level === 2) return zBanky(bankaL2());
  return zBanky(prolozit([L3_PREPARAT, L3_CHYBI, L3_ORGANISMUS]));
}

// ── Topic ───────────────────────────────────────────────────────────────────
export const STAVBA_BUNKY: TopicMetadata[] = [
  {
    id: "g6-pri-stavba-bunky-6",
    rvpNodeId: "g6-prirodopis-obecna-biologie-bunka-jako-zaklad-zivota-stavba-rostlinne-a-zivocisne-bunky",
    displayName: "Stavba buňky",
    title: "Stavba rostlinné a živočišné buňky",
    studentTitle: "Co je uvnitř buňky",
    subject: "prirodopis",
    category: "Obecná biologie",
    topic: "Buňka jako základ života",
    briefDescription: "Poznáš součásti rostlinné a živočišné buňky a k čemu slouží.",
    keywords: [
      "buňka", "rostlinná buňka", "živočišná buňka", "jádro", "cytoplazma",
      "cytoplazmatická membrána", "buněčná stěna", "chloroplasty", "chlorofyl",
      "vakuola", "mitochondrie", "fotosyntéza", "buněčné dýchání", "preparát",
    ],
    goals: [
      "Přiřadit buněčnou součást k její funkci.",
      "Rozlišit součásti, které má jen rostlinná buňka, od součástí společných oběma buňkám.",
      "Z popisu buňky určit, odkud pochází, a odvodit, co by se stalo, kdyby jí součást chyběla.",
    ],
    boundaries: [
      "Jen součásti z učebnic 6. ročníku: jádro, cytoplazma, membrána, stěna, chloroplasty, vakuola, mitochondrie.",
      "Bez ribozomů, endoplazmatického retikula a Golgiho aparátu.",
      "Houby se neprobírají, červená krvinka se jako příklad nepoužívá.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Obě buňky mají jádro, cytoplazmu, membránu a mitochondrie. Rostlinná má navíc buněčnou stěnu, velkou vakuolu a v zelených částech chloroplasty.",
      steps: [
        "Urči, jakou práci součást v buňce dělá (řídí, obaluje, zpevňuje, vyrábí živiny, uvolňuje energii, uchovává šťávu).",
        "Rozhodni, jestli ji mají obě buňky, nebo jen rostlinná.",
        "U rostlinné buňky zvaž, jestli je na světle — jen tam má chloroplasty.",
      ],
      commonMistake: "Myslet si, že živočišná buňka má stěnu (je to membrána), nebo že každá rostlinná buňka je zelená.",
      example: "Buňka vnitřní slupky cibule má stěnu a velkou vakuolu, ale chloroplasty ne — je rostlinná, jen není na světle.",
    },
  },
];
