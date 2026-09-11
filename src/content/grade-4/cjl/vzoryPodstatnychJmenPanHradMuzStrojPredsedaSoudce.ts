import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";
import { tvarUlohy } from "./_vzory";

// Přepsáno 2026-09-11 (audit 4. ročníku): nápovědy a zpětná vazba vznikají
// z vlastností slova (životnost, 2. pád, zakončení), takže jsou pro každou
// úlohu jiné. Vypadlo „hajný“ (adjektivní skloňování — hranice tématu ho
// vylučují) a „Děkuji soudci“ označené jako „přímý objekt“ (3. pád je
// nepřímý předmět; úloha teď chce jen pád).
//
// L1 = vzor běžného slova · L2 = tvar v daném pádě · L3 = záludná slova
// (déšť, herec, lesník), shoda, pád u tvaru stejného ve více pádech.

type Vzor = "pán" | "hrad" | "muž" | "stroj" | "předseda" | "soudce";

const VZOR: Record<Vzor, { ziv: boolean; typ: "tvrdý" | "měkký" | "a" | "ce"; gen: string }> = {
  pán: { ziv: true, typ: "tvrdý", gen: "pána" },
  hrad: { ziv: false, typ: "tvrdý", gen: "hradu" },
  muž: { ziv: true, typ: "měkký", gen: "muže" },
  stroj: { ziv: false, typ: "měkký", gen: "stroje" },
  předseda: { ziv: true, typ: "a", gen: "předsedy" },
  soudce: { ziv: true, typ: "ce", gen: "soudce" },
};

const MATOUCI: Record<Vzor, [Vzor, Vzor, Vzor]> = {
  pán: ["hrad", "muž", "předseda"],
  hrad: ["pán", "stroj", "muž"],
  muž: ["pán", "stroj", "soudce"],
  stroj: ["hrad", "muž", "pán"],
  předseda: ["pán", "muž", "soudce"],
  soudce: ["muž", "předseda", "pán"],
};

function proc(d: Vzor, w: string, vzor: Vzor, gen: string): string {
  const dv = VZOR[d];
  const wv = VZOR[vzor];
  if (d === "předseda") return `Vzor předseda je pro mužská jména, která v 1. pádě končí na -a (táta, kolega). „${w}“ tak nekončí.`;
  if (d === "soudce") return `Vzor soudce je pro mužské osoby zakončené na -ce (průvodce, zástupce). „${w}“ končí jinak.`;
  if (wv.typ === "a") return `„${w}“ končí v 1. pádě na -a. Pro mužská jména s tímto zakončením je zvláštní vzor, ne ${d}.`;
  if (wv.typ === "ce") return `„${w}“ je mužská osoba zakončená na -ce. Pro ta jména je zvláštní vzor, ne ${d}.`;
  if (dv.ziv !== wv.ziv) return dv.ziv
    ? `Vzor ${d} je pro živé bytosti. „${w}“ je věc.`
    : `Vzor ${d} je pro věci. „${w}“ je živá bytost.`;
  return `Vzor ${d} má ${dv.typ} základ (bez ${dv.gen}). U „${w}“ ale řekneš „bez ${gen}“, takže základ je ${wv.typ}.`;
}

function vzorUlohy(w: string, vzor: Vzor, gen: string): PracticeTask {
  const v = VZOR[vzor];
  let hints: [string, string];
  let explanation: string;
  if (v.typ === "a") {
    hints = [
      `Na jaké písmeno končí „${w}“ v 1. pádě a jakého je rodu?`,
      `Řekneme „ten ${w}“, takže je to mužský rod, a přitom slovo končí na -a jako slova ženská. Pro taková mužská jména je samostatný vzor.`,
    ];
    explanation = `„${w}“ je mužského rodu (ten ${w}) a v 1. pádě končí na -a. Taková jména se skloňují podle vzoru předseda: bez ${gen} jako bez předsedy.`;
  } else if (v.typ === "ce") {
    hints = [
      `Na jaká dvě písmena končí „${w}“?`,
      `„${w}“ je mužská osoba a končí na -ce. Takové osoby mají vlastní vzor, i když je jejich základ měkký.`,
    ];
    explanation = `„${w}“ je mužská osoba zakončená na -ce, proto se skloňuje podle vzoru soudce: bez ${gen} jako bez soudce.`;
  } else {
    hints = [
      `Je „${w}“ živá bytost, nebo věc?`,
      `Řekni „bez ${gen}“. Koncovka -a nebo -u prozrazuje tvrdý základ, koncovka -e měkký. Spolu s tím, jestli je „${w}“ živé, ti to určí vzor.`,
    ];
    explanation = `„${w}“ je ${v.ziv ? "živá bytost" : "věc"} a ve 2. pádě řekneme „bez ${gen}“, takže má ${v.typ} základ. ${v.ziv ? "Živé" : "Neživé"} slovo s ${v.typ === "tvrdý" ? "tvrdým" : "měkkým"} základem se skloňuje podle vzoru ${vzor}.`;
  }
  const [a, b, c] = MATOUCI[vzor];
  return choice(`Ke kterému vzoru patří slovo „${w}“?`, vzor, [
    { value: a, why: proc(a, w, vzor, gen) },
    { value: b, why: proc(b, w, vzor, gen) },
    { value: c, why: proc(c, w, vzor, gen) },
  ], { hints, explanation });
}

const L1: PracticeTask[] = ([
  ["výtah", "hrad", "výtahu"], ["student", "pán", "studenta"], ["klíč", "stroj", "klíče"],
  ["chlapec", "muž", "chlapce"], ["táta", "předseda", "táty"], ["průvodce", "soudce", "průvodce"],
  ["stůl", "hrad", "stolu"], ["lékař", "muž", "lékaře"], ["nůž", "stroj", "nože"],
  ["kolega", "předseda", "kolegy"], ["kůň", "muž", "koně"], ["sešit", "hrad", "sešitu"],
  ["holub", "pán", "holuba"],
] as [string, Vzor, string][]).map(([w, v, g]) => vzorUlohy(w, v, g));

const L2: PracticeTask[] = [
  tvarUlohy("student", "2. pádě množného čísla", "Ve třídě nebylo moc …", "studentů",
    [{ form: "studenti", pad: "1. pád množného čísla (ti studenti)" }, { form: "studenty", pad: "4. nebo 7. pád množného čísla (vidím studenty, se studenty)" }, { form: "studentech", pad: "6. pád množného čísla (o studentech)" }],
    "pán", "pánů"),
  tvarUlohy("les", "1. pádě množného čísla", "Kolem vesnice rostou husté …", "lesy",
    [{ form: "lesi", pad: "tvar, který neexistuje: koncovku -i mají v 1. pádě množného čísla jen živá jména (páni)" }, { form: "lesové", pad: "tvar, který neexistuje: koncovku -ové mají jen živá jména (pánové)" }, { form: "lesů", pad: "2. pád množného čísla (bez lesů)" }],
    "hrad", "hrady"),
  tvarUlohy("lékař", "1. pádě množného čísla", "V nemocnici pracují dva …", "lékaři",
    [{ form: "lékařů", pad: "2. pád množného čísla (bez lékařů)" }, { form: "lékaře", pad: "2. nebo 4. pád jednotného čísla, případně 4. pád množného (vidím lékaře)" }, { form: "lékařem", pad: "7. pád jednotného čísla (s lékařem)" }],
    "muž", "muži"),
  tvarUlohy("pokoj", "2. pádě množného čísla", "Hotel má deset …", "pokojů",
    [{ form: "pokoje", pad: "1. nebo 4. pád množného čísla (ty pokoje)" }, { form: "pokojích", pad: "6. pád množného čísla (o pokojích)" }, { form: "pokojům", pad: "3. pád množného čísla (k pokojům)" }],
    "stroj", "strojů"),
  tvarUlohy("kolega", "3. pádě jednotného čísla", "Pošlu ten dopis …", "kolegovi",
    [{ form: "kolegou", pad: "7. pád jednotného čísla (s kolegou)" }, { form: "kolegu", pad: "4. pád jednotného čísla (vidím kolegu)" }, { form: "kolegy", pad: "2. pád jednotného čísla (bez kolegy)" }],
    "předseda", "předsedovi"),
  tvarUlohy("průvodce", "7. pádě jednotného čísla", "Hradem jsme šli s …", "průvodcem",
    [{ form: "průvodci", pad: "3. nebo 6. pád jednotného čísla (k průvodci, o průvodci)" }, { form: "průvodcům", pad: "3. pád množného čísla (k průvodcům)" }, { form: "průvodců", pad: "2. pád množného čísla (bez průvodců)" }],
    "soudce", "soudcem"),
  tvarUlohy("holub", "4. pádě jednotného čísla", "Na střeše vidím …", "holuba",
    [{ form: "holubu", pad: "3. nebo 6. pád jednotného čísla (k holubu, o holubu)" }, { form: "holubem", pad: "7. pád jednotného čísla (s holubem)" }, { form: "holubi", pad: "1. pád množného čísla (ti holubi)" }],
    "pán", "pána"),
  tvarUlohy("sešit", "6. pádě množného čísla", "Paní učitelka psala poznámky v …", "sešitech",
    [{ form: "sešitům", pad: "3. pád množného čísla (k sešitům)" }, { form: "sešity", pad: "1., 4. nebo 7. pád množného čísla (ty sešity, se sešity)" }, { form: "sešitů", pad: "2. pád množného čísla (bez sešitů)" }],
    "hrad", "hradech"),
  tvarUlohy("nůž", "7. pádě jednotného čísla", "Chleba krájíme …", "nožem",
    [{ form: "nože", pad: "2. pád jednotného čísla (bez nože) nebo 1. a 4. pád množného" }, { form: "noži", pad: "3. nebo 6. pád jednotného čísla (k noži, o noži)" }, { form: "nožům", pad: "3. pád množného čísla (k nožům)" }],
    "stroj", "strojem"),
  tvarUlohy("kůň", "3. pádě jednotného čísla", "Podej seno …", "koni",
    [{ form: "koně", pad: "2. nebo 4. pád jednotného čísla (bez koně, vidím koně)" }, { form: "koněm", pad: "7. pád jednotného čísla (s koněm)" }, { form: "koních", pad: "6. pád množného čísla (o koních)" }],
    "muž", "muži"),
  tvarUlohy("táta", "7. pádě jednotného čísla", "Na ryby jsem jel s …", "tátou",
    [{ form: "tátovi", pad: "3. nebo 6. pád jednotného čísla (k tátovi, o tátovi)" }, { form: "tátu", pad: "4. pád jednotného čísla (vidím tátu)" }, { form: "táty", pad: "2. pád jednotného čísla (bez táty)" }],
    "předseda", "předsedou"),
  tvarUlohy("klíč", "6. pádě jednotného čísla", "Mluvili jsme o ztraceném …", "klíči",
    [{ form: "klíče", pad: "2. pád jednotného čísla (bez klíče) nebo 1. a 4. pád množného" }, { form: "klíčem", pad: "7. pád jednotného čísla (s klíčem)" }, { form: "klíčích", pad: "6. pád, ale množného čísla (o klíčích)" }],
    "stroj", "stroji"),
  tvarUlohy("student", "5. pádě jednotného čísla", "Pojď k tabuli, …!", "studente",
    [{ form: "studentu", pad: "3. nebo 6. pád jednotného čísla (ke studentu, o studentu)" }, { form: "studenta", pad: "2. nebo 4. pád jednotného čísla (bez studenta, vidím studenta)" }, { form: "studentem", pad: "7. pád jednotného čísla (se studentem)" }],
    "pán", "pane"),
];

const L3: PracticeTask[] = [
  choice("Proč patří „nůž“ ke vzoru stroj, a ne ke vzoru muž?", "Nůž je věc, ne živá bytost", [
    { value: "Nůž má tvrdý základ", why: "Nemá — řekneme „bez nože“ a koncovka -e ukazuje měkký základ. Ten mají stroj i muž." },
    { value: "Nůž končí na -ce", why: "Nůž končí na -ž. Zakončení -ce má vzor soudce." },
    { value: "Nůž je živá bytost", why: "Je to naopak — nůž je věc. Živé bytosti s měkkým základem patří k muži." },
  ], {
    hints: ["Mají vzory stroj a muž základ stejný, nebo různý?", "Oba vzory mají měkký základ (bez stroje, bez muže). Liší se jen jednou vlastností. Kterou, a jak je na tom nůž?"],
    explanation: "Stroj i muž mají měkký základ. Rozhoduje životnost: muž je pro živé bytosti, stroj pro věci. Nůž je věc, proto stroj.",
  }),
  choice("Doplň správně: „Studenti přišl_ včas.“", "přišli", [
    { value: "přišly", why: "Koncovka -y patří k mužským neživotným a ženským jménům (hrady stály, ženy přišly). Studenti jsou životní." },
    { value: "přišla", why: "„Přišla“ patří k jedné ženě nebo ke středním jménům v množném čísle (města)." },
    { value: "přišlo", why: "„Přišlo“ patří ke střednímu rodu v jednotném čísle (dítě přišlo)." },
  ], {
    hints: ["Jsou „studenti“ mužský rod životný, nebo neživotný?", "U mužských životných jmen (podle pána i muže) píšeme v minulém čase -i: kluci běželi, psi štěkali."],
    explanation: "Studenti jsou rod mužský životný (vzor pán), a proto se píše -i: studenti přišli.",
  }),
  tvarUlohy("hráč", "2. pádě množného čísla", "Na hřišti chybělo pár …", "hráčů",
    [{ form: "hráče", pad: "1. nebo 4. pád množného čísla, případně 2. pád jednotného" }, { form: "hráčích", pad: "6. pád množného čísla (o hráčích)" }, { form: "hráčům", pad: "3. pád množného čísla (k hráčům)" }],
    "muž", "mužů"),
  choice("Urči pád slova „soudci“ ve větě: „Děkuji soudci.“", "3. pád jednotného čísla", [
    { value: "1. pád množného čísla", why: "Tvar je stejný jako „ti soudci“, ale tady odpovídá na otázku komu? — děkuji komu." },
    { value: "6. pád jednotného čísla", why: "6. pád je „o kom?“ — o soudci. Po slovese „děkuji“ se ptáme „komu?“." },
    { value: "2. pád jednotného čísla", why: "2. pád by byl „bez soudce“." },
  ], {
    hints: ["Polož otázku od slovesa: děkuji … ?", "Tvar „soudci“ vypadá stejně ve více pádech. Rozhodne otázka, kterou položíš od slovesa „děkuji“ — komu, nebo o kom?"],
    explanation: "Děkuji komu? — soudci. Otázka „komu, čemu“ patří ke 3. pádu, soudce je jeden, proto jednotné číslo.",
  }),
  choice("Jaký tvar má slovo „tatínek“ v 5. pádě?", "tatínku", [
    { value: "tatínka", why: "„Tatínka“ je 2. nebo 4. pád (bez tatínka, vidím tatínka)." },
    { value: "tatínkovi", why: "„Tatínkovi“ je 3. nebo 6. pád (k tatínkovi, o tatínkovi)." },
    { value: "tatínkem", why: "„Tatínkem“ je 7. pád (s tatínkem)." },
  ], {
    hints: ["Jak na tatínka zavoláš, když ho potřebuješ?", "5. pád je oslovení. Slova zakončená na -ek, -ík nebo -k mají v oslovení -u: Pepíku! Dědečku!"],
    explanation: "5. pád je oslovení. Slova na -k mají v oslovení koncovku -u, proto „Tatínku!“.",
  }),
  vzorUlohy("zelenář", "muž", "zelenáře"),
  vzorUlohy("herec", "muž", "herce"),
  vzorUlohy("lesník", "pán", "lesníka"),
  vzorUlohy("déšť", "stroj", "deště"),
  tvarUlohy("soudce", "1. pádě množného čísla", "Ti … se sešli v síni.", "soudci",
    [{ form: "soudce", pad: "1. pád jednotného čísla, nebo 4. pád množného (vidím soudce)" }, { form: "soudců", pad: "2. pád množného čísla (bez soudců)" }, { form: "soudcem", pad: "7. pád jednotného čísla (se soudcem)" }],
    "muž", "muži"),
  tvarUlohy("učitel", "7. pádě množného čísla", "Na výlet jsme jeli s …", "učiteli",
    [{ form: "učitelích", pad: "6. pád množného čísla (o učitelích)" }, { form: "učitelům", pad: "3. pád množného čísla (k učitelům)" }, { form: "učitelů", pad: "2. pád množného čísla (bez učitelů)" }],
    "muž", "muži"),
  choice("Která dvojice slov patří ke stejnému vzoru?", "lékař – kůň", [
    { value: "lékař – student", why: "Oba jsou živí, ale bez lékaře × bez studenta: jeden má měkký, druhý tvrdý základ." },
    { value: "stůl – klíč", why: "Obě jsou věci, ale bez stolu × bez klíče: tvrdý a měkký základ." },
    { value: "táta – soudce", why: "Táta končí na -a, soudce na -ce — každý má svůj vzor." },
  ], {
    hints: ["U každé dvojice urči, jestli jsou obě slova živá, nebo obě věci.", "U slov se stejnou životností rozhodne 2. pád: bez lékaře, bez koně, bez studenta. Stejnou koncovku mají jen slova stejného vzoru."],
    explanation: "Lékař i kůň jsou živí a mají měkký základ (bez lékaře, bez koně), oba tedy patří ke vzoru muž.",
  }),
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? L3 : level === 2 ? L2 : L1;
  return shuffle(pool);
}

export const VZORYPODSTATNYCHJMENPANHRADMUZSTROJPREDSEDASOUDCE: TopicMetadata[] = [
  {
    id: "g4-cjl-jazykova-vychova-tvaroslovi-vzory-podstatnych-jmen-pan-hrad-muz-stroj-predseda-soudce",
    rvpNodeId: "g4-cjl-jazykova-vychova-tvaroslovi-vzory-podstatnych-jmen-pan-hrad-muz-stroj-predseda-soudce",
    displayName: "Vzory mužského rodu",
    title: "Vzory podstatných jmen - pán, hrad, muž, stroj, předseda, soudce",
    studentTitle: "Vzory mužského rodu",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Jazyková výchova",
    briefDescription: "Poznáš vzory mužského rodu a naučíš se podle nich správně skloňovat.",
    keywords: ["vzor", "pán", "hrad", "muž", "stroj", "předseda", "soudce", "skloňování", "mužský rod"],
    goals: [
      "Přiřadit slovo ke správnému vzoru mužského rodu",
      "Skloňovat podstatná jména mužského rodu",
    ],
    boundaries: ["Bez cizích slov s nestandardním skloňováním", "Bez adjektivního skloňování podst. jmen"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: ["g4-cjl-jazykova-vychova-tvaroslovi-vzory-podstatnych-jmen-zena-ruze-pisen-kost-mesto-more-kure"],
    generator: gen,
    helpTemplate: {
      hint: "pán=živý tvrdý, hrad=neživý tvrdý, muž=živý měkký, stroj=neživý měkký, předseda=-a, soudce=-ce",
      steps: [
        "Je to živá bytost? Ano → pán nebo muž; Ne → hrad nebo stroj",
        "Tvrdý základ? → pán / hrad; Měkký základ? → muž / stroj",
        "Zakončení na -a? → předseda; na -ce/-dce? → soudce",
      ],
      commonMistake: "Záměna vzorů pán a muž: nespoléhej na to, že jde o osobu, ale zkus 2. pád — 'bez studenta' = pán, ale 'bez lékaře' i 'bez učitele' = muž",
      example: "hrad: tvrdý neživý (hrady, hradů, hradem); muž: měkký živý (muži, mužů, mužem)",
    },
  },
];
