import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";
import { tvarUlohy } from "./_vzory";

// Přepsáno 2026-09-11 (audit 4. ročníku): nápovědy a zpětná vazba vznikají
// z vlastností slova (rod, zakončení, 2. pád), takže jsou pro každou úlohu
// jiné. Vypadla vymyšlená slova v možnostech („staveniším“) a málo známá
// slova („kolíbání“, „prsť“).
//
// L1 = vzor běžného slova · L2 = tvar v daném pádě · L3 = záludná slova
// (loď, myš, zvíře, vejce), určení pádu z tvaru, dvojice stejného vzoru.

type Vzor = "žena" | "růže" | "píseň" | "kost" | "město" | "moře" | "kuře" | "stavení";

const ZENSKY = new Set<Vzor>(["žena", "růže", "píseň", "kost"]);

// Čím se vzor pozná: buď podle zakončení v 1. pádě, nebo podle 2. pádu.
const ZNAK: Record<Vzor, { text: string; podle: "konec" | "gen" }> = {
  žena: { text: "končí v 1. pádě na -a", podle: "konec" },
  růže: { text: "končí v 1. pádě na -e nebo -ě", podle: "konec" },
  píseň: { text: "končí na souhlásku a ve 2. pádě má -e nebo -ě (bez písně)", podle: "gen" },
  kost: { text: "končí na souhlásku a ve 2. pádě má -i (bez kosti)", podle: "gen" },
  město: { text: "končí na -o", podle: "konec" },
  moře: { text: "končí na -e a ve 2. pádě se nemění (bez moře)", podle: "gen" },
  kuře: { text: "v dalších pádech přibírá -et- (bez kuřete)", podle: "gen" },
  stavení: { text: "končí na -í", podle: "konec" },
};

const MATOUCI: Record<Vzor, [Vzor, Vzor, Vzor]> = {
  žena: ["růže", "píseň", "kost"],
  růže: ["žena", "píseň", "kost"],
  píseň: ["kost", "růže", "žena"],
  kost: ["píseň", "žena", "růže"],
  město: ["moře", "kuře", "stavení"],
  moře: ["město", "kuře", "stavení"],
  kuře: ["moře", "město", "stavení"],
  stavení: ["moře", "město", "kuře"],
};

function proc(d: Vzor, w: string, gen: string): string {
  const z = ZNAK[d];
  const slovo = z.podle === "konec" ? `končí na -${w.slice(-1)}` : `ve 2. pádě zní „bez ${gen}“`;
  return `Vzor ${d} ${z.text}. „${w}“ ale ${slovo}.`;
}

function vzorUlohy(w: string, vzor: Vzor, gen: string): PracticeTask {
  const zen = ZENSKY.has(vzor);
  const ukaz = zen ? "ta" : "to";
  const konec = w.slice(-1);
  const h1: Record<Vzor, string> = {
    žena: `„${w}“ je rodu ženského a končí na -a. Mezi ženskými vzory je jen jeden, který končí na -a.`,
    růže: `„${w}“ je rodu ženského a končí na -${konec}. Hledej ženský vzor se stejným zakončením.`,
    píseň: `„${w}“ je rodu ženského a končí na souhlásku. Rozhodne 2. pád: řekni „bez ${gen}“ a poslouchej, jestli končí na -e/-ě, nebo na -i.`,
    kost: `„${w}“ je rodu ženského a končí na souhlásku. Rozhodne 2. pád: řekni „bez ${gen}“ a poslouchej, jestli končí na -e/-ě, nebo na -i.`,
    město: `„${w}“ je rodu středního a končí na -o. Mezi středními vzory je jediný s tímto zakončením.`,
    moře: `„${w}“ je rodu středního a končí na -e. Řekni „bez ${gen}“: tvar zůstane stejný, žádné -et- nepřibude.`,
    kuře: `„${w}“ je rodu středního. Řekni „bez ${gen}“ a všimni si, že v dalších pádech přibývá -et-.`,
    stavení: `„${w}“ je rodu středního a končí na -í. Tak končí i jeden ze středních vzorů.`,
  };
  const [a, b, c] = MATOUCI[vzor];
  return choice(`Ke kterému vzoru patří slovo „${w}“?`, vzor, [
    { value: a, why: proc(a, w, gen) },
    { value: b, why: proc(b, w, gen) },
    { value: c, why: proc(c, w, gen) },
  ], {
    hints: [`Řekneš „ta ${w}“, nebo „to ${w}“? A na co slovo končí?`, h1[vzor]],
    explanation: `Řekneme „${ukaz} ${w}“, takže je rod ${zen ? "ženský" : "střední"}. Slovo ${ZNAK[vzor].podle === "gen" ? `má 2. pád „bez ${gen}“` : `končí na -${konec}`} a vzor ${vzor} ${ZNAK[vzor].text}, proto se „${w}“ skloňuje podle něj.`,
  });
}

const L1: PracticeTask[] = ([
  ["teta", "žena", "tety"], ["ulice", "růže", "ulice"], ["báseň", "píseň", "básně"],
  ["radost", "kost", "radosti"], ["auto", "město", "auta"], ["pole", "moře", "pole"],
  ["kotě", "kuře", "kotěte"], ["nádraží", "stavení", "nádraží"], ["škola", "žena", "školy"],
  ["skříň", "píseň", "skříně"], ["slunce", "moře", "slunce"], ["pravítko", "město", "pravítka"],
  ["židle", "růže", "židle"],
] as [string, Vzor, string][]).map(([w, v, g]) => vzorUlohy(w, v, g));

const L2: PracticeTask[] = [
  tvarUlohy("škola", "6. pádě množného čísla", "Ve všech … začalo vyučování.", "školách",
    [{ form: "školám", pad: "3. pád množného čísla (ke školám)" }, { form: "školami", pad: "7. pád množného čísla (se školami)" }, { form: "školy", pad: "2. pád jednotného čísla nebo 1. a 4. pád množného" }],
    "žena", "ženách"),
  tvarUlohy("židle", "2. pádě množného čísla", "V jídelně je dvacet …", "židlí",
    [{ form: "židle", pad: "1. pád jednotného čísla nebo 1. a 4. pád množného (ty židle)" }, { form: "židlím", pad: "3. pád množného čísla (k židlím)" }, { form: "židlích", pad: "6. pád množného čísla (o židlích)" }],
    "růže", "růží"),
  tvarUlohy("báseň", "7. pádě jednotného čísla", "Vystoupila jsem s krátkou …", "básní",
    [{ form: "básni", pad: "3. nebo 6. pád jednotného čísla (k básni, o básni)" }, { form: "básněmi", pad: "7. pád, ale množného čísla (s básněmi)" }, { form: "básně", pad: "2. pád jednotného čísla (bez básně)" }],
    "píseň", "písní"),
  tvarUlohy("radost", "7. pádě jednotného čísla", "Dárek jsme přijali s …", "radostí",
    [{ form: "radosti", pad: "2., 3. nebo 6. pád jednotného čísla (bez radosti, k radosti)" }, { form: "radostmi", pad: "7. pád množného čísla" }, { form: "radostem", pad: "3. pád množného čísla" }],
    "kost", "kostí"),
  tvarUlohy("auto", "6. pádě množného čísla", "Mluvili jsme o závodních …", "autech",
    [{ form: "autům", pad: "3. pád množného čísla (k autům)" }, { form: "auty", pad: "7. pád množného čísla (s auty)" }, { form: "auta", pad: "2. pád jednotného čísla nebo 1. a 4. pád množného" }],
    "město", "městech"),
  tvarUlohy("pole", "2. pádě množného čísla", "Kolem vesnice je spousta …", "polí",
    [{ form: "pole", pad: "1. pád jednotného čísla nebo 1. a 4. pád množného" }, { form: "poli", pad: "3. nebo 6. pád jednotného čísla, případně 7. pád množného" }, { form: "polím", pad: "3. pád množného čísla (k polím)" }],
    "moře", "moří"),
  tvarUlohy("kotě", "2. pádě jednotného čísla", "Miska zůstala bez …", "kotěte",
    [{ form: "kotěti", pad: "3. nebo 6. pád jednotného čísla (ke kotěti, o kotěti)" }, { form: "kotětem", pad: "7. pád jednotného čísla (s kotětem)" }, { form: "koťat", pad: "2. pád, ale množného čísla (bez koťat)" }],
    "kuře", "kuřete"),
  tvarUlohy("nádraží", "7. pádě jednotného čísla", "Vlak projel kolem malým …", "nádražím",
    [{ form: "nádraží", pad: "tvar pro 1. až 6. pád jednotného čísla — v 7. pádě přibývá -m" }, { form: "nádražími", pad: "7. pád, ale množného čísla (s nádražími)" }, { form: "nádražích", pad: "6. pád množného čísla (o nádražích)" }],
    "stavení", "stavením"),
  tvarUlohy("skříň", "2. pádě jednotného čísla", "Vytáhla jsem svetr ze …", "skříně",
    [{ form: "skříni", pad: "3. nebo 6. pád jednotného čísla (ke skříni, o skříni)" }, { form: "skříní", pad: "7. pád jednotného čísla (se skříní) nebo 2. pád množného" }, { form: "skříněmi", pad: "7. pád množného čísla" }],
    "píseň", "písně"),
  tvarUlohy("slovo", "7. pádě množného čísla", "Vysvětli to vlastními …", "slovy",
    [{ form: "slovech", pad: "6. pád množného čísla (o slovech)" }, { form: "slovům", pad: "3. pád množného čísla (ke slovům)" }, { form: "slova", pad: "2. pád jednotného čísla nebo 1. a 4. pád množného" }],
    "město", "městy"),
  tvarUlohy("věc", "3. pádě množného čísla", "Nevěnuj pozornost zbytečným …", "věcem",
    [{ form: "věcí", pad: "7. pád jednotného čísla (s věcí) nebo 2. pád množného (bez věcí)" }, { form: "věcech", pad: "6. pád množného čísla (o věcech)" }, { form: "věcmi", pad: "7. pád množného čísla (s věcmi)" }],
    "kost", "kostem"),
  tvarUlohy("slunce", "7. pádě jednotného čísla", "Pláž byla zalitá …", "sluncem",
    [{ form: "slunci", pad: "3. nebo 6. pád jednotného čísla (ke slunci, o slunci)" }, { form: "slunce", pad: "1., 2. nebo 4. pád jednotného čísla" }, { form: "sluncím", pad: "3. pád množného čísla" }],
    "moře", "mořem"),
  tvarUlohy("teta", "3. pádě jednotného čísla", "Napsala jsem dopis …", "tetě",
    [{ form: "tetu", pad: "4. pád jednotného čísla (vidím tetu)" }, { form: "tetou", pad: "7. pád jednotného čísla (s tetou)" }, { form: "tety", pad: "2. pád jednotného čísla (bez tety)" }],
    "žena", "ženě"),
];

const L3: PracticeTask[] = [
  vzorUlohy("čtvrť", "kost", "čtvrti"),
  vzorUlohy("tvář", "píseň", "tváře"),
  vzorUlohy("myš", "kost", "myši"),
  vzorUlohy("loď", "kost", "lodi"),
  vzorUlohy("zvíře", "kuře", "zvířete"),
  vzorUlohy("vejce", "moře", "vejce"),
  vzorUlohy("přání", "stavení", "přání"),
  choice("Urči pád a číslo tvaru „ženách“.", "6. pád množného čísla", [
    { value: "3. pád množného čísla", why: "3. pád množného čísla je „ženám“ (komu? čemu?)." },
    { value: "7. pád množného čísla", why: "7. pád množného čísla je „ženami“ (s kým? čím?)." },
    { value: "2. pád množného čísla", why: "2. pád množného čísla je „žen“ (bez koho?)." },
  ], {
    hints: ["Zkus tvar „ženách“ dát do věty. Jakou předložku k němu potřebuješ?", "Koncovka -ách se pojí s předložkami „o“ a „v“: mluvíme o ženách. Který pád odpovídá na otázku „o kom? o čem?“?"],
    explanation: "Mluvíme o kom? — o ženách. Otázka „o kom, o čem“ patří k 6. pádu a žen je víc, proto 6. pád množného čísla.",
  }),
  choice("Urči pád a číslo tvaru „kuřat“.", "2. pád množného čísla", [
    { value: "1. pád množného čísla", why: "1. pád množného čísla je „kuřata“ (ta kuřata)." },
    { value: "3. pád množného čísla", why: "3. pád množného čísla je „kuřatům“." },
    { value: "6. pád množného čísla", why: "6. pád množného čísla je „kuřatech“ (o kuřatech)." },
  ], {
    hints: ["Zkus větu „Na dvoře pobíhá hodně …“. Hodí se tam tvar „kuřat“?", "Po slovech „hodně, mnoho, bez“ stojí pád s otázkou „koho? čeho?“. Tvar „kuřat“ nemá žádnou koncovku, podobně jako „bez měst“ nebo „bez žen“."],
    explanation: "Bez koho? — bez kuřat; mnoho kuřat. Otázka „koho, čeho“ patří k 2. pádu a kuřat je víc, proto 2. pád množného čísla.",
  }),
  choice("Urči pád a číslo tvaru „písněmi“.", "7. pád množného čísla", [
    { value: "6. pád množného čísla", why: "6. pád množného čísla je „písních“ (o písních)." },
    { value: "3. pád množného čísla", why: "3. pád množného čísla je „písním“." },
    { value: "7. pád jednotného čísla", why: "7. pád jednotného čísla je „písní“ (s jednou písní)." },
  ], {
    hints: ["Zkus větu „Oslava začala veselými …“. Na jakou otázku tvar odpovídá?", "Koncovka -mi patří k pádu s otázkou „s kým? čím?“. Zbývá rozhodnout, jestli jde o jednu píseň, nebo o víc."],
    explanation: "S čím? — s písněmi. Koncovka -ěmi patří k 7. pádu množného čísla; s jednou písní by to bylo „písní“.",
  }),
  choice("Ve kterém pádě jednotného čísla se tvar vzoru stavení liší od ostatních?", "v 7. pádě", [
    { value: "v 1. pádě", why: "1. pád je „stavení“ — stejně jako 2. až 6. pád." },
    { value: "ve 2. pádě", why: "2. pád je „bez stavení“ — tvar se nemění." },
    { value: "v 5. pádě", why: "5. pád (oslovení) je taky „stavení“." },
  ], {
    hints: ["Vyskloňuj si „stavení“: bez stavení, ke stavení, vidím stavení…", "Ve většině pádů zůstane tvar „stavení“. Jen v jednom pádě na konci něco přibude — zkus „s kým? s čím?“."],
    explanation: "Vzor stavení má v jednotném čísle ve všech pádech tvar „stavení“, jen v 7. pádě přibývá -m: se stavením.",
  }),
  choice("Která dvojice slov patří ke stejnému vzoru?", "radost – myš", [
    { value: "radost – báseň", why: "Bez radosti × bez básně: 2. pád na -i a na -ě, tedy dva různé vzory." },
    { value: "škola – ulice", why: "Škola končí na -a, ulice na -e — každá má jiný vzor." },
    { value: "pole – kotě", why: "Bez pole × bez kotěte: jen u kotěte přibývá -et-." },
  ], {
    hints: ["U každé dvojice řekni obě slova ve 2. pádě: bez… .", "Stejný vzor mají slova se stejnou koncovkou ve 2. pádě. Hledej dvojici, kde obě slova končí po „bez“ stejně."],
    explanation: "Bez radosti, bez myši — obě slova mají ve 2. pádě -i, a patří tedy ke vzoru kost.",
  }),
  tvarUlohy("hříbě", "1. pádě množného čísla", "Na louce se pásla dvě …", "hříbata",
    [{ form: "hříběte", pad: "2. pád jednotného čísla (bez hříběte)" }, { form: "hříbat", pad: "2. pád množného čísla (bez hříbat)" }, { form: "hříbětem", pad: "7. pád jednotného čísla (s hříbětem)" }],
    "kuře", "kuřata"),
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? L3 : level === 2 ? L2 : L1;
  return shuffle(pool);
}

export const VZORYPODSTATNYCHJMENZENARUZEPISENKOSTMESTOMOREKURESTAVENI: TopicMetadata[] = [
  {
    id: "g4-cjl-jazykova-vychova-tvaroslovi-vzory-podstatnych-jmen-zena-ruze-pisen-kost-mesto-more-kure",
    rvpNodeId: "g4-cjl-jazykova-vychova-tvaroslovi-vzory-podstatnych-jmen-zena-ruze-pisen-kost-mesto-more-kure",
    displayName: "Vzory žen. a stř. rodu",
    title: "Vzory podstatných jmen - žena, růže, píseň, kost, město, moře, kuře, stavení",
    studentTitle: "Ženské a střední vzory",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Jazyková výchova",
    briefDescription: "Naučíš se vzory ženského a středního rodu a správně podle nich skloňovat.",
    keywords: ["vzor", "žena", "růže", "píseň", "kost", "město", "moře", "kuře", "stavení", "skloňování"],
    goals: [
      "Přiřadit slovo ke správnému vzoru ženského nebo středního rodu",
      "Skloňovat podstatná jména podle těchto vzorů",
    ],
    boundaries: ["Bez cizích slov", "Bez zdrobnělin s nestandardním skloňováním"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: ["g4-cjl-jazykova-vychova-tvaroslovi-slovesa-mluvnicke-kategorie-casovani-v-jednoduchych-casech"],
    generator: gen,
    helpTemplate: {
      hint: "žena=-a, růže=-e/-ě, píseň=bez písně, kost=bez kosti, město=-o, moře=-e, kuře=-ete, stavení=-í",
      steps: [
        "Urči rod: ta → ženský; to → střední.",
        "Ženský: -a → žena; -e/-ě → růže; souhláska → 2. pád na -e/-ě = píseň, na -i = kost",
        "Střední: -o → město; -e beze změny → moře; přibývá -et- → kuře; -í → stavení",
      ],
      commonMistake: "Záměna vzorů píseň a kost: rozhodne 2. pád — bez písně (-ě), ale bez kosti (-i)",
      example: "žena: ženou (7. pád j.č.); kost: kostí (7. pád j.č.); kuře: kuřete (2. pád j.č.)",
    },
  },
];
