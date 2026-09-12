import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "../_shared";

// Přepsáno 2026-09-11 (inventura obsahu). Dřív 9/9/10 úloh, nápověda sdílená
// 27 úlohami a chybné možnosti bez zpětné vazby. Teď tři disjunktní banky:
//
//   L1 rozpoznání — čas: ze čtyř tvarů jednoho slovesa (minulý, přítomný,
//                   budoucí, neurčitý tvar) vyber ten v zadaném čase.
//   L2 aplikace   — osoba a číslo samotného tvaru (přítomný i minulý čas
//                   se „jsem/jsi/jsme/jste“). Chybné možnosti = sousední
//                   osoby a opačné číslo, zpětná vazba ukáže jejich tvar.
//   L3 transfer   — dva kroky: (a) podle slova ve větě (včera, teď, zítra)
//                   a podle toho, kdo děj dělá, doplnit správný tvar;
//                   (b) určit čas, osobu i číslo najednou, i u pastí typu
//                   „napíšu“ (vypadá jako přítomný, je budoucí) a „jsme byli“.

// ─── L1: čas ────────────────────────────────────────────────────────────────

type Cas = "minulý" | "přítomný" | "budoucí";
// [neurčitý tvar, minulý, přítomný, budoucí, minulý množné]
// U budoucího času je místo neurčitého tvaru chybnou možností minulý tvar
// množného čísla: „bude psát“ neurčitý tvar „psát“ obsahuje, takže by jako
// distraktor byl částí klíče.
type Tvary = [string, string, string, string, string];

const L1: Tvary[] = [
  ["hrát", "hrál", "hraje", "bude hrát", "hráli"],
  ["psát", "psal", "píše", "bude psát", "psali"],
  ["číst", "četl", "čte", "bude číst", "četli"],
  ["zpívat", "zpíval", "zpívá", "bude zpívat", "zpívali"],
  ["běhat", "běhal", "běhá", "bude běhat", "běhali"],
  ["kreslit", "kreslil", "kreslí", "bude kreslit", "kreslili"],
  ["vařit", "vařil", "vaří", "bude vařit", "vařili"],
  ["skákat", "skákal", "skáče", "bude skákat", "skákali"],
  ["plavat", "plaval", "plave", "bude plavat", "plavali"],
  ["malovat", "maloval", "maluje", "bude malovat", "malovali"],
  ["spát", "spal", "spí", "bude spát", "spali"],
  ["nést", "nesl", "nese", "bude nést", "nesli"],
  ["jíst", "jedl", "jí", "bude jíst", "jedli"],
  ["pít", "pil", "pije", "bude pít", "pili"],
  ["stavět", "stavěl", "staví", "bude stavět", "stavěli"],
  ["tancovat", "tancoval", "tancuje", "bude tancovat", "tancovali"],
];

const CASY: Cas[] = ["minulý", "přítomný", "budoucí"];
const LOKAL: Record<Cas, string> = { minulý: "minulém", přítomný: "přítomném", budoucí: "budoucím" };
const SIGNAL: Record<Cas, string> = { minulý: "včera", přítomný: "právě teď", budoucí: "zítra" };

function ulohaL1([inf, min, prit, bud, minMn]: Tvary, i: number): PracticeTask {
  const cas = CASY[i % 3];
  const tvar: Record<Cas, string> = { minulý: min, přítomný: prit, budoucí: bud };
  const proc: Record<Cas, string> = {
    minulý: `„${min}“ říká, co už proběhlo (včera ${min}) — to je minulý čas.`,
    přítomný: `„${prit}“ se děje právě teď (teď ${prit}) — to je přítomný čas.`,
    budoucí: `„${bud}“ se teprve stane (zítra ${bud}) — to je budoucí čas.`,
  };
  const neurcity = `„${inf}“ je neurčitý tvar: neříká, kdo děj dělá ani kdy, takže nemá žádný čas.`;
  const jine = CASY.filter((c) => c !== cas);
  return choice(`Který tvar slovesa „${inf}“ je v ${LOKAL[cas]} čase?`, tvar[cas], [
    { value: tvar[jine[0]], why: proc[jine[0]] },
    { value: tvar[jine[1]], why: proc[jine[1]] },
    cas === "budoucí"
      ? { value: minMn, why: `„${minMn}“ je také minulý čas (včera ${minMn}), jen o více lidech. Ke slovu „zítra“ se nehodí.` }
      : { value: inf, why: neurcity },
  ], {
    hints: [
      `Zkus před každý tvar slovesa „${inf}“ říct slovo včera, teď, nebo zítra.`,
      `Hledáš tvar, ke kterému se hodí „${SIGNAL[cas]}“. Řekni si „${SIGNAL[cas]} …“ s každou možností a poslouchej, která věta dává smysl.${cas === "budoucí" ? " Tvar pro budoucnost se někdy skládá ze dvou slov." : ` Tvar „${inf}“ sám o sobě čas nemá.`}`,
    ],
    explanation: `${proc[cas]} ${cas === "budoucí" ? `„${min}“, „${minMn}“ a „${prit}“ se ke slovu „zítra“ nehodí.` : `Ostatní tvary se k „${SIGNAL[cas]}“ nehodí a „${inf}“ je neurčitý tvar bez času.`}`,
  });
}

// ─── L2: osoba a číslo ──────────────────────────────────────────────────────

interface L2Item {
  /** Tvar, který se určuje — index do paradigmatu (0–2 jednotné, 3–5 množné). */
  i: number;
  /** Tvary pro já, ty, on, my, vy, oni. */
  par: [string, string, string, string, string, string];
  zajmena?: [string, string, string, string, string, string];
  /**
   * Přirozené spojení zájmena s tvarem. V minulém čase se pomocné sloveso
   * posouvá na druhé místo („my jsme malovali“, NIKDY „my malovali jsme“),
   * proto se u minulého času vypisuje ručně a nedá se poskládat šablonou.
   */
  spoj?: [string, string, string, string, string, string];
  /** Upozornění do velké nápovědy (koncovka, pomocné slůvko). */
  tip: string;
}

const ZAJMENA: [string, string, string, string, string, string] = ["já", "ty", "on", "my", "vy", "oni"];

const L2: L2Item[] = [
  { i: 3, par: ["čtu", "čteš", "čte", "čteme", "čtete", "čtou"], tip: "Všimni si koncovky „-me“ a porovnej ji s „čtu“ a „čtete“." },
  { i: 1, par: ["píšu", "píšeš", "píše", "píšeme", "píšete", "píšou"], tip: "Koncovka „-eš“ patří k jednomu zájmenu — ke kterému?" },
  { i: 5, par: ["nesu", "neseš", "nese", "neseme", "nesete", "nesou"], tip: "Pozor na záměnu „nesu“ a „nesou“ — liší se jediným písmenem." },
  { i: 0, par: ["vezu", "vezeš", "veze", "vezeme", "vezete", "vezou"], tip: "Pozor na záměnu „vezu“ a „vezou“ — rozhoduje koncovka." },
  { i: 4, par: ["zpívám", "zpíváš", "zpívá", "zpíváme", "zpíváte", "zpívají"], tip: "Koncovka „-te“ se pojí se zájmenem, kterým oslovujeme víc lidí." },
  { i: 2, par: ["jdu", "jdeš", "jde", "jdeme", "jdete", "jdou"], tip: "Tvar nemá žádnou koncovku typu „-u“, „-eš“ nebo „-me“. Kdo tedy jde?" },
  { i: 3, par: ["maloval jsem", "maloval jsi", "maloval", "malovali jsme", "malovali jste", "malovali"], spoj: ["já jsem maloval", "ty jsi maloval", "on maloval", "my jsme malovali", "vy jste malovali", "oni malovali"], tip: "V minulém čase prozradí osobu slůvko „jsem, jsi, jsme, jste“ vedle slovesa." },
  { i: 1, par: ["psala jsem", "psala jsi", "psala", "psaly jsme", "psaly jste", "psaly"], zajmena: ["já", "ty", "ona", "my", "vy", "ony"], spoj: ["já jsem psala", "ty jsi psala", "ona psala", "my jsme psaly", "vy jste psaly", "ony psaly"], tip: "Podívej se na slůvko „jsi“ vedle slovesa — s kterým zájmenem se pojí?" },
  { i: 5, par: ["běhal jsem", "běhal jsi", "běhal", "běhali jsme", "běhali jste", "běhali"], spoj: ["já jsem běhal", "ty jsi běhal", "on běhal", "my jsme běhali", "vy jste běhali", "oni běhali"], tip: "Žádné „jsem, jsi, jsme, jste“ u slovesa není. Co to znamená pro osobu?" },
  { i: 0, par: ["volám", "voláš", "volá", "voláme", "voláte", "volají"], tip: "Všimni si koncovky „-ám“ a porovnej ji s „voláš“ a „volají“." },
  { i: 4, par: ["plavu", "plaveš", "plave", "plaveme", "plavete", "plavou"], tip: "Porovnej koncovku „-ete“ s „plaveme“ a „plavou“." },
  { i: 3, par: ["kreslím", "kreslíš", "kreslí", "kreslíme", "kreslíte", "kreslí"], tip: "Koncovka „-íme“ — řekni si k tvaru zájmena a poslouchej, co sedí." },
  { i: 2, par: ["peču", "pečeš", "peče", "pečeme", "pečete", "pečou"], tip: "Pozor, „peče“ a „pečeš“ se liší jen koncovkou. Kdo peče?" },
  { i: 4, par: ["dělal jsem", "dělal jsi", "dělal", "dělali jsme", "dělali jste", "dělali"], spoj: ["já jsem dělal", "ty jsi dělal", "on dělal", "my jsme dělali", "vy jste dělali", "oni dělali"], tip: "Rozhoduje slůvko „jste“ — liší se od „jsme“ jediným písmenem." },
  { i: 0, par: ["nesl jsem", "nesl jsi", "nesl", "nesli jsme", "nesli jste", "nesli"], spoj: ["já jsem nesl", "ty jsi nesl", "on nesl", "my jsme nesli", "vy jste nesli", "oni nesli"], tip: "Slůvko „jsem“ napoví osobu; tvar „nesl“ napoví, kolik lidí nese." },
  { i: 5, par: ["beru", "bereš", "bere", "bereme", "berete", "berou"], tip: "Pozor na záměnu „beru“ a „berou“ — liší se jen koncovkou." },
  { i: 1, par: ["vařím", "vaříš", "vaří", "vaříme", "vaříte", "vaří"], tip: "Koncovka „-íš“ se pojí s jedním zájmenem — se kterým?" },
];

const osCis = (i: number) => `${(i % 3) + 1}. osoba, číslo ${i < 3 ? "jednotné" : "množné"}`;

function ulohaL2({ i, par, zajmena = ZAJMENA, spoj, tip }: L2Item): PracticeTask {
  const tvar = par[i];
  const fraze = spoj ?? (par.map((t, k) => `${zajmena[k]} ${t}`) as [string, string, string, string, string, string]);
  const stejneCislo = [0, 1, 2].map((k) => (i < 3 ? k : k + 3)).filter((k) => k !== i);
  const opacneCislo = i < 3 ? i + 3 : i - 3;
  const distr = [opacneCislo, ...stejneCislo].map((k): Distractor => ({
    value: osCis(k),
    why: `${osCis(k)} má tvar „${par[k]}“ (${fraze[k]}), ne „${tvar}“.`,
  })) as [Distractor, Distractor, Distractor];
  return choice(`Urči osobu a číslo slovesa „${tvar}“.`, osCis(i), distr, {
    hints: [
      `Které zájmeno se hodí ke tvaru „${tvar}“: ${zajmena.join(", ")}?`,
      `${tip} Zkus ke tvaru „${tvar}“ postupně přiřadit jednotlivá zájmena a vyber spojení, které zní správně. Zájmeno prozradí osobu (já/my první, ty/vy druhá, on/oni třetí) i to, jestli jde o jednoho, nebo o víc lidí.`,
    ],
    explanation: `Říkáme „${fraze[i]}“. Zájmeno „${zajmena[i]}“ patří k ${(i % 3) + 1}. osobě a ${i < 3 ? "mluví o jednom, proto je číslo jednotné" : "mluví o více lidech, proto je číslo množné"}.`,
  });
}

// ─── L3: čas + osoba + číslo najednou ───────────────────────────────────────

interface L3Doplň {
  typ: "doplň";
  veta: string;
  zadani: string;
  klic: string;
  spatne: [[string, string], [string, string], [string, string]];
  /** Na co se dívat (signál času a podmět) — do velké nápovědy. */
  tip: string;
  proc: string;
}

interface L3Urci {
  typ: "urči";
  veta: string;
  sloveso: string;
  klic: string;
  spatne: [[string, string], [string, string], [string, string]];
  tip: string;
  proc: string;
}

const kat = (cas: Cas, os: number, mn: boolean) => `${cas} čas, ${os}. osoba, číslo ${mn ? "množné" : "jednotné"}`;

const L3: (L3Doplň | L3Urci)[] = [
  {
    typ: "doplň", veta: "___ včera úkol z češtiny.", zadani: "my – psát", klic: "psali jsme",
    spatne: [
      ["píšeme", "„Píšeme“ je přítomný čas, ale slovo „včera“ ukazuje na minulost."],
      ["budeme psát", "„Budeme psát“ je budoucí čas — se slovem „včera“ nedává smysl."],
      ["psal jsem", "Minulý čas sedí, ale „psal jsem“ patří k „já“. Úkol psali „my“."],
    ],
    tip: "Najdi slovo, které říká, kdy se to stalo. Děj dělá „my“.",
    proc: "Slovo „včera“ ukazuje minulý čas a děj dělá „my“ (1. osoba, číslo množné).",
  },
  {
    typ: "doplň", veta: "Právě teď ___ zajímavou knihu.", zadani: "ty – číst", klic: "čteš",
    spatne: [
      ["četl jsi", "„Četl jsi“ je minulý čas, ale „právě teď“ ukazuje na přítomnost."],
      ["budeš číst", "„Budeš číst“ je budoucí čas — „právě teď“ se děje hned."],
      ["čte", "Čas sedí, ale „čte“ patří k „on“ nebo „ona“. Tady čteš „ty“."],
    ],
    tip: "Slova „právě teď“ napoví čas. Kdo čte? Oslovujeme jednoho člověka.",
    proc: "„Právě teď“ znamená přítomný čas a čte „ty“ (2. osoba, číslo jednotné).",
  },
  {
    typ: "doplň", veta: "Příští týden ___ na hory.", zadani: "oni – jet", klic: "pojedou",
    spatne: [
      ["jeli", "„Jeli“ je minulý čas, ale „příští týden“ teprve přijde."],
      ["jedeme", "„Jedeme“ patří k „my“, ne k „oni“."],
      ["pojede", "Budoucí čas sedí, ale „pojede“ je číslo jednotné (on). Pojedou „oni“, víc lidí."],
    ],
    tip: "„Příští týden“ napoví čas. Jedou „oni“ — kolik lidí to je?",
    proc: "„Příští týden“ ukazuje budoucí čas a jedou „oni“ (3. osoba, číslo množné).",
  },
  {
    typ: "doplň", veta: "___ loni velkého sněhuláka?", zadani: "vy – postavit", klic: "postavili jste",
    spatne: [
      ["postavíte", "„Postavíte“ je budoucí čas, ale „loni“ už bylo."],
      ["postavili jsme", "Minulý čas sedí, ale „jsme“ patří k „my“. Ptáme se „vás“ — „vy“."],
      ["postavil jsi", "Minulý čas sedí, ale „postavil jsi“ patří k „ty“ (jeden člověk), ne k „vy“."],
    ],
    tip: "Slovo „loni“ napoví čas. Pozor na slůvko za slovesem: u „my“ a u „vy“ se liší jediným písmenem.",
    proc: "„Loni“ ukazuje minulý čas a stavěli „vy“ (2. osoba, číslo množné).",
  },
  {
    typ: "doplň", veta: "Zítra ___ babičce dopis.", zadani: "já – napsat", klic: "napíšu",
    spatne: [
      ["napsal jsem", "„Napsal jsem“ je minulý čas, ale „zítra“ teprve přijde."],
      ["napíše", "Budoucí čas sedí, ale „napíše“ patří k „on“. Píšu „já“."],
      ["napíšeš", "Budoucí čas sedí, ale „napíšeš“ patří k „ty“. Píšu „já“."],
    ],
    tip: "„Zítra“ napoví čas. Kdo píše? Mluví o sobě.",
    proc: "„Zítra“ ukazuje budoucí čas a píše „já“ (1. osoba, číslo jednotné).",
  },
  {
    typ: "doplň", veta: "Kluci teď ___ fotbal na hřišti.", zadani: "hrát", klic: "hrají",
    spatne: [
      ["hráli", "„Hráli“ je minulý čas, ale slovo „teď“ ukazuje na přítomnost."],
      ["budou hrát", "„Budou hrát“ je budoucí čas — nehodí se ke slovu „teď“."],
      ["hraje", "Čas sedí, ale „hraje“ je číslo jednotné. Kluků je víc."],
    ],
    tip: "Slovo „teď“ napoví čas. Kdo hraje — jeden kluk, nebo víc?",
    proc: "„Teď“ ukazuje přítomný čas a hrají „kluci“ = oni (3. osoba, číslo množné).",
  },
  {
    // Podmět je jen Eva. Dřív tu stálo „Eva s tátou“, jenže tam je číslo sporné
    // (spisovně „Eva s tátou šla“, běžně i „šli“) a distraktor „šly“ by navíc
    // u mužského „táty“ nešel použít — na určování čísla je to past, ne úloha.
    typ: "doplň", veta: "Minulou sobotu ___ Eva na ryby.", zadani: "jít", klic: "šla",
    spatne: [
      ["jde", "„Jde“ je přítomný čas, ale „minulou sobotu“ už bylo."],
      ["půjde", "„Půjde“ je budoucí čas — minulá sobota už proběhla."],
      ["šly", "Minulý čas sedí, ale „šly“ je číslo množné. Podmětem je jen Eva."],
    ],
    tip: "„Minulou sobotu“ napoví čas. Podmětem je Eva — kolik je to osob?",
    proc: "„Minulou sobotu“ ukazuje minulý čas a jde Eva = ona (3. osoba, číslo jednotné).",
  },
  {
    typ: "doplň", veta: "Až vyrosteme, ___ v Praze.", zadani: "my – bydlet", klic: "budeme bydlet",
    spatne: [
      ["bydlíme", "„Bydlíme“ je přítomný čas, ale „až vyrosteme“ teprve přijde."],
      ["bydleli jsme", "„Bydleli jsme“ je minulý čas — „až vyrosteme“ mluví o budoucnosti."],
      ["budou bydlet", "Budoucí čas sedí, ale „budou“ patří k „oni“. Bydlet budeme „my“."],
    ],
    tip: "Slova „až vyrosteme“ mluví o tom, co teprve přijde. Kdo bude bydlet?",
    proc: "„Až vyrosteme“ ukazuje budoucí čas a bydlet budeme „my“ (1. osoba, číslo množné).",
  },
  {
    typ: "doplň", veta: "Vy už teď ___ moc hezky.", zadani: "zpívat", klic: "zpíváte",
    spatne: [
      ["zpíváme", "„Zpíváme“ patří k „my“, ve větě je ale „vy“."],
      ["zpívali jste", "„Zpívali jste“ je minulý čas, ale „teď“ ukazuje na přítomnost."],
      ["zpíváš", "„Zpíváš“ patří k „ty“ — ve větě stojí „vy“."],
    ],
    tip: "Ve větě je zájmeno „vy“ a slovo „teď“. Obojí musí tvar splnit.",
    proc: "„Teď“ ukazuje přítomný čas a zpívá „vy“ (2. osoba, číslo množné).",
  },
  {
    typ: "doplň", veta: "Za chvíli ___ vlak.", zadani: "přijet", klic: "přijede",
    spatne: [
      ["přijel", "„Přijel“ je minulý čas — vlak ale přijede „za chvíli“."],
      ["přijedou", "Budoucí čas sedí, ale „přijedou“ je číslo množné. Vlak je jeden."],
      ["přijedu", "„Přijedu“ patří k „já“. Přijíždí vlak — on."],
    ],
    tip: "„Za chvíli“ napoví čas. Podmětem je vlak — jeden, nebo víc?",
    proc: "„Za chvíli“ ukazuje budoucí čas a přijede vlak = on (3. osoba, číslo jednotné).",
  },
  {
    typ: "urči", veta: "Zítra pojedeme k babičce.", sloveso: "pojedeme", klic: kat("budoucí", 1, true),
    spatne: [
      [kat("přítomný", 1, true), "Přítomný tvar by byl „jedeme“. „Pojedeme“ a slovo „zítra“ mluví o tom, co teprve bude."],
      [kat("budoucí", 3, true), "Čas sedí, ale 3. osoba by byla „pojedou“ (oni). „Pojedeme“ říkáme s „my“."],
      [kat("budoucí", 1, false), "Osoba sedí, ale číslo jednotné by bylo „pojedu“ (já). „Pojedeme“ je nás víc."],
    ],
    tip: "Slovo „zítra“ napoví čas. Které zájmeno se hodí k „pojedeme“?",
    proc: "„Pojedeme“ se stane až zítra (budoucí čas) a říkáme „my pojedeme“ (1. osoba, číslo množné).",
  },
  {
    typ: "urči", veta: "Napíšu ti dopis.", sloveso: "napíšu", klic: kat("budoucí", 1, false),
    spatne: [
      [kat("přítomný", 1, false), "Přítomný čas by byl „píšu“ (píšu právě teď). „Napíšu“ znamená, že dopis bude hotový až později."],
      [kat("minulý", 1, false), "Minulý čas by byl „napsal jsem“. „Napíšu“ se ještě nestalo."],
      [kat("budoucí", 3, true), "„Napíšou“ (oni) a „napíšu“ (já) se liší jen koncovkou. Tady je „-u“, tedy „já“."],
    ],
    tip: "Porovnej „píšu“ a „napíšu“: kdy bude dopis hotový? Kdo ho píše?",
    proc: "„Napíšu“ znamená, že dopis teprve bude napsaný (budoucí čas), a říkáme „já napíšu“ (1. osoba, číslo jednotné).",
  },
  {
    typ: "urči", veta: "Brzy přijdou hosté.", sloveso: "přijdou", klic: kat("budoucí", 3, true),
    spatne: [
      [kat("přítomný", 3, true), "Přítomný čas by byl „přicházejí“. „Přijdou“ a slovo „brzy“ mluví o budoucnosti."],
      [kat("budoucí", 3, false), "Čas sedí, ale číslo jednotné by bylo „přijde“ (on). Hostů je víc."],
      [kat("budoucí", 1, false), "„Přijdu“ (já) a „přijdou“ (oni) se liší koncovkou. Tady přijdou hosté — oni."],
    ],
    tip: "Slovo „brzy“ napoví čas. Kdo přijde — a kolik jich je?",
    proc: "Hosté teprve přijdou (budoucí čas) a jsou to „oni“ (3. osoba, číslo množné).",
  },
  {
    typ: "urči", veta: "Maminka upeče dort.", sloveso: "upeče", klic: kat("budoucí", 3, false),
    spatne: [
      [kat("přítomný", 3, false), "Přítomný čas by byl „peče“ (peče právě teď). „Upeče“ znamená, že dort bude hotový až potom."],
      [kat("budoucí", 3, true), "Čas sedí, ale číslo množné by bylo „upečou“ (oni). Peče jen maminka."],
      [kat("minulý", 3, false), "Minulý čas by byl „upekla“. Dort ještě hotový není."],
    ],
    tip: "Porovnej „peče“ a „upeče“: kdy bude dort hotový? Kolik lidí peče?",
    proc: "„Upeče“ znamená, že dort teprve bude upečený (budoucí čas), a peče maminka = ona (3. osoba, číslo jednotné).",
  },
  {
    typ: "urči", veta: "Kluci si hrají na schovávanou.", sloveso: "hrají", klic: kat("přítomný", 3, true),
    spatne: [
      [kat("přítomný", 3, false), "Číslo jednotné by bylo „hraje“ (on). Kluků je víc."],
      [kat("budoucí", 3, true), "Budoucí čas by byl „budou hrát“. „Hrají“ se děje teď."],
      [kat("přítomný", 1, true), "1. osoba by byla „hrajeme“ (my). O klucích říkáme „oni“."],
    ],
    tip: "Děje se hra teď, nebo už proběhla? Místo „kluci“ dosaď zájmeno.",
    proc: "Kluci si hrají právě teď (přítomný čas) a kluci = oni (3. osoba, číslo množné).",
  },
  {
    typ: "urči", veta: "Psali jste ten diktát dlouho?", sloveso: "psali jste", klic: kat("minulý", 2, true),
    spatne: [
      [kat("minulý", 1, true), "1. osoba by byla „psali jsme“ (my). Tady je „jste“ — to patří k „vy“."],
      [kat("minulý", 3, true), "3. osoba by byla jen „psali“ (oni), bez slůvka „jste“."],
      [kat("přítomný", 2, true), "Přítomný čas by byl „píšete“. „Psali jste“ už proběhlo."],
    ],
    tip: "Pomůže slůvko „jste“ za slovesem. Stalo se to už, nebo teprve bude?",
    proc: "Diktát už byl napsaný (minulý čas) a „jste“ patří k „vy“ (2. osoba, číslo množné).",
  },
  {
    typ: "urči", veta: "Proč se směješ?", sloveso: "směješ", klic: kat("přítomný", 2, false),
    spatne: [
      [kat("přítomný", 2, true), "Číslo množné by bylo „smějete“ (vy). „Směješ“ říkáme jednomu člověku."],
      [kat("přítomný", 3, false), "3. osoba by byla „směje“ (on). Tady se ptáme přímo tebe."],
      [kat("budoucí", 2, false), "Budoucí čas by byl „budeš se smát“. Smích se děje teď."],
    ],
    tip: "Komu otázku klademe? Děje se smích teď?",
    proc: "Smích se děje teď (přítomný čas) a ptáme se jednoho člověka — „ty se směješ“ (2. osoba, číslo jednotné).",
  },
  {
    typ: "urči", veta: "Včera jsme byli v divadle.", sloveso: "jsme byli", klic: kat("minulý", 1, true),
    spatne: [
      [kat("přítomný", 1, true), "Samotné „jsme“ je sice přítomný tvar, ale tady tvoří s „byli“ minulý čas. Pomůže i slovo „včera“."],
      [kat("minulý", 3, true), "3. osoba by byla jen „byli“ (oni), bez „jsme“."],
      [kat("minulý", 2, true), "2. osoba by byla „byli jste“ (vy). Tady je „jsme“ — patří k „my“."],
    ],
    tip: "„Jsme“ a „byli“ tvoří dohromady jeden tvar. Co napoví slovo „včera“?",
    proc: "„Jsme byli“ je jeden tvar minulého času (slovo „včera“) a „jsme“ patří k „my“ (1. osoba, číslo množné).",
  },
];

function ulohaL3(it: L3Doplň | L3Urci): PracticeTask {
  const distr = it.spatne.map(([value, why]) => ({ value, why })) as [Distractor, Distractor, Distractor];
  if (it.typ === "doplň") {
    const doplneno = it.veta.replace("___", it.klic);
    const hotovo = doplneno[0].toUpperCase() + doplneno.slice(1);
    return choice(`Doplň správný tvar slovesa (${it.zadani}): „${it.veta}“`, it.klic, distr, {
      hints: [
        `Podle kterého slova ve větě „${it.veta}“ poznáš, kdy se děj odehrává?`,
        `${it.tip} Správný tvar musí sedět ve dvou věcech zároveň: v čase i v osobě a čísle. Vyřaď nejdřív tvary se špatným časem.`,
      ],
      explanation: `Správně: „${hotovo}“ ${it.proc}`,
    });
  }
  return choice(`Urči u slovesa „${it.sloveso}“ ve větě „${it.veta}“ čas, osobu a číslo.`, it.klic, distr, {
    hints: [
      `Kdy se odehrává děj „${it.sloveso}“ ve větě „${it.veta}“ a kdo ho dělá?`,
      `${it.tip} Čas: už se to stalo, děje se to, nebo to teprve přijde? Osobu a číslo poznáš, když před sloveso dosadíš zájmeno (já, ty, on, my, vy, oni).`,
    ],
    explanation: it.proc,
  });
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return shuffle(L1.map(ulohaL1));
  if (level === 2) return shuffle(L2).map(ulohaL2);
  return shuffle(L3).map(ulohaL3);
}

export const SLOVESAOSOBACISELCAS: TopicMetadata[] = [
  {
    id: "g3-cjl-slovesa-osoba-cislo-cas",
    rvpNodeId: "g3-cjl-jazykova-vychova-tvaroslovi-slovesa-osoba-cislo-cas",
    title: "Slovesa - osoba, číslo, čas",
    studentTitle: "Slovesa: kdo a kdy",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Tvarosloví",
    briefDescription: "Určíš u slovesa osobu, číslo a čas.",
    keywords: ["sloveso", "osoba", "číslo", "čas", "minulý přítomný budoucí", "já ty on"],
    goals: ["Určit čas slovesa (minulý, přítomný, budoucí).", "Určit osobu slovesa (1., 2., 3.).", "Určit číslo slovesa (jednotné, množné)."],
    boundaries: ["Jednoduchý čas, základní slovesa."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Čas: hrál = minulý, hraje = přítomný, bude hrát = budoucí. Osoba: já/ty/on-ona. Číslo: sg/pl.",
      steps: ["Najdi sloveso ve větě.", "Zeptej se: Kdy? (čas), Kdo dělá? (osoba), Jeden nebo více? (číslo)."],
      commonMistake: "Záměna minulého a přítomného: 'hrál' (hotové, minulé) vs 'hraje' (právě teď).",
      example: "Dívky zpívaly. → zpívaly: minulý čas, 3. osoba, množné číslo.",
    },
  },
];
