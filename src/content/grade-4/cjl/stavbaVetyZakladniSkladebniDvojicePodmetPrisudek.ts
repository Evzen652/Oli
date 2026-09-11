import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 4. ročníku). Každá úloha má vlastní nápovědy
// a u každé špatné možnosti vysvětlení, jakou roli to slovo ve větě má.
// Vypadly sporné sponové konstrukce („je“ jako celý přísudek ve větě
// „Ona je hodná žačka“, „stal se“, „jmenuje se“) a distraktory, které ve
// větě vůbec nebyly („den“, „dnes“, „hřiště“).
//
// L1 = vyjádřený podmět na začátku, jednoduchý přísudek
// L2 = nevyjádřený podmět, podmět s přívlastkem, přísudek se „se“
// L3 = podmět uprostřed nebo na konci věty, věty bez podmětu, přísudek
//      ze dvou slov (bude číst, byly unavené)

type Role = "pris" | "podm" | "pred" | "pri" | "misto" | "cas" | "jak" | "predl" | "cast";

function role(r: Role, w: string, prisudek: string): string {
  switch (r) {
    case "pris": return `„${w}“ je přísudek — říká, co se děje, ne kdo to dělá.`;
    case "podm": return `„${w}“ je podmět — říká, kdo nebo co děj koná, ne co dělá.`;
    case "pred": return `„${w}“ říká, koho nebo čeho se děj týká. Samo nic nedělá.`;
    case "pri": return `„${w}“ jen blíže popisuje podstatné jméno (jaký? čí?). Do základní dvojice nepatří.`;
    case "misto": return `„${w}“ říká, kde nebo kam se děj odehrává.`;
    case "cas": return `„${w}“ říká, kdy se děj odehrává.`;
    case "jak": return `„${w}“ říká, jak se děj odehrává.`;
    case "predl": return `„${w}“ je předložka. Samotná větným členem není.`;
    case "cast": return `„${w}“ je jen část přísudku. Přísudek tvoří celé „${prisudek}“.`;
  }
}

type Spatne = [[string, Role], [string, Role], [string, Role]];

function najdiPodmet(veta: string, podmet: string, prisudek: string, spatne: Spatne, explanation?: string): PracticeTask {
  return choice(`Urči podmět ve větě: „${veta}“`, podmet,
    spatne.map(([w, r]) => ({ value: w, why: role(r, w, prisudek) })) as never, {
      hints: [
        `Zeptej se od slovesa: kdo nebo co ${prisudek}?`,
        `Přísudek je v této větě „${prisudek}“. Podmět je slovo, které odpoví na otázku „kdo nebo co ${prisudek}?“ — a nemusí přitom stát na začátku věty.`,
      ],
      explanation: explanation ?? `Kdo nebo co ${prisudek}? — ${podmet}. Proto je „${podmet}“ podmět a „${prisudek}“ přísudek.`,
    });
}

function najdiPrisudek(veta: string, podmet: string, prisudek: string, spatne: Spatne, explanation?: string): PracticeTask {
  return choice(`Urči přísudek ve větě: „${veta}“`, prisudek,
    spatne.map(([w, r]) => ({ value: w, why: role(r, w, prisudek) })) as never, {
      hints: [
        `Najdi slovo, které říká, co se ve větě děje s podmětem „${podmet}“.`,
        `Podmět je „${podmet}“. Přísudek říká, co podmět dělá nebo jaký je. Je to sloveso, někdy doplněné slůvkem „se“ nebo pomocným slovesem.`,
      ],
      explanation: explanation ?? `Co se děje s podmětem „${podmet}“? — ${prisudek}. Přísudek vyjadřuje děj nebo stav podmětu.`,
    });
}

const L1: PracticeTask[] = [
  najdiPodmet("Petr čte zajímavou knihu.", "Petr", "čte", [["čte", "pris"], ["zajímavou", "pri"], ["knihu", "pred"]]),
  najdiPrisudek("Kočka spí na pohovce.", "Kočka", "spí", [["Kočka", "podm"], ["na", "predl"], ["pohovce", "misto"]]),
  najdiPodmet("Pes štěká na souseda.", "Pes", "štěká", [["štěká", "pris"], ["na", "predl"], ["souseda", "pred"]]),
  najdiPrisudek("Ptáci letí na jih.", "Ptáci", "letí", [["Ptáci", "podm"], ["na", "predl"], ["jih", "misto"]]),
  najdiPodmet("Jana píše dlouhý dopis.", "Jana", "píše", [["píše", "pris"], ["dlouhý", "pri"], ["dopis", "pred"]]),
  najdiPrisudek("Slunce svítí velmi jasně.", "Slunce", "svítí", [["Slunce", "podm"], ["velmi", "jak"], ["jasně", "jak"]]),
  najdiPodmet("Psi běhají po louce.", "Psi", "běhají", [["běhají", "pris"], ["po", "predl"], ["louce", "misto"]]),
  najdiPrisudek("Maminka vaří dobrý oběd.", "Maminka", "vaří", [["Maminka", "podm"], ["dobrý", "pri"], ["oběd", "pred"]]),
  najdiPodmet("Žáci odpovídají na otázky.", "Žáci", "odpovídají", [["odpovídají", "pris"], ["na", "predl"], ["otázky", "pred"]]),
  najdiPrisudek("Ryba plave v rybníce.", "Ryba", "plave", [["Ryba", "podm"], ["v", "predl"], ["rybníce", "misto"]]),
  najdiPodmet("Tomáš hraje fotbal na hřišti.", "Tomáš", "hraje", [["hraje", "pris"], ["fotbal", "pred"], ["hřišti", "misto"]]),
  choice("Na jakou otázku odpovídá podmět?", "kdo? co?", [
    { value: "co dělá?", why: "Na „co dělá?“ odpovídá přísudek — říká děj." },
    { value: "kde? kdy?", why: "Na „kde? kdy?“ odpovídají slova, která říkají místo a čas děje." },
    { value: "jaký? čí?", why: "Na „jaký? čí?“ odpovídají slova, která popisují podstatné jméno." },
  ], {
    hints: ["Podmět je ten, kdo nebo co děj koná. Jak se na takové slovo zeptáš?", "Ve větě „Pes štěká“ se ptáš na psa, ne na štěkání, místo ani vzhled. Která otázka se ptá přímo na osobu nebo věc?"],
    explanation: "Podmět označuje toho, kdo nebo co děj koná, proto se na něj ptáme „kdo? co?“ (kdo štěká? — pes).",
  }),
  choice("Které dva větné členy tvoří základní skladební dvojici?", "podmět a přísudek", [
    { value: "podmět a předmět", why: "Předmět jen rozvíjí děj (čte co? knihu). Věta bez něj obstojí." },
    { value: "přísudek a přívlastek", why: "Přívlastek jen popisuje podstatné jméno. Věta bez něj obstojí." },
    { value: "předmět a přívlastek", why: "Oba jen rozvíjejí. Bez toho, kdo něco dělá, a bez děje věta nevznikne." },
  ], {
    hints: ["Na čem stojí každá věta — na tom, kdo děj koná, a na…?", "Věta potřebuje toho, kdo něco dělá, a samotný děj. Ostatní členy (předmět, přívlastek, místo, čas) jen tuto dvojici rozvíjejí."],
    explanation: "Základ věty tvoří podmět (kdo, co) a přísudek (co dělá, jaký je). Ostatní větné členy tuto dvojici jen rozvíjejí.",
  }),
];

const L2: PracticeTask[] = [
  choice("Jaký podmět má věta „Jdeme do kina.“?", "my (nevyjádřený)", [
    { value: "já (nevyjádřený)", why: "K „já“ patří tvar „jdu“, ne „jdeme“." },
    { value: "vy (nevyjádřený)", why: "K „vy“ patří tvar „jdete“." },
    { value: "kina", why: "„Kina“ říká, kam jdeme — děj nekoná." },
  ], {
    hints: ["Kdo jde? Ve větě to napsané není — prozradí to tvar slovesa.", "Tvar „jdeme“ patří k jednomu zájmenu: já jdu, ty jdeš, … jdeme. Doplň, které to je."],
    explanation: "Podmět tu není napsaný, ale tvar „jdeme“ patří k zájmenu „my“. Takový podmět je nevyjádřený.",
  }),
  choice("Jaký podmět má věta „Čteme potichu.“?", "my (nevyjádřený)", [
    { value: "já (nevyjádřený)", why: "K „já“ patří tvar „čtu“." },
    { value: "oni (nevyjádřený)", why: "K „oni“ patří tvar „čtou“." },
    { value: "potichu", why: "„Potichu“ říká, jak čteme — děj nekoná." },
  ], {
    hints: ["Kdo čte? Podmět ve větě napsaný není.", "Časuj: já čtu, ty čteš, on čte, … čteme. Ke kterému zájmenu tvar „čteme“ patří?"],
    explanation: "Tvar „čteme“ patří k zájmenu „my“, proto je podmět nevyjádřený „my“.",
  }),
  choice("Jaký podmět má věta „Pošli mi zprávu.“?", "ty (nevyjádřený)", [
    { value: "já (nevyjádřený)", why: "„Mi“ označuje toho, komu se zpráva pošle. Posílat má někdo jiný." },
    { value: "vy (nevyjádřený)", why: "Více lidem bychom řekli „pošlete“." },
    { value: "zprávu", why: "„Zprávu“ je to, co se posílá. Samo nic nedělá." },
  ], {
    hints: ["Komu ta prosba patří — kdo má zprávu poslat?", "„Pošli“ je výzva jednomu člověku. Více lidem by se řeklo „pošlete“. Které zájmeno k výzvě „pošli“ patří?"],
    explanation: "Výzva „pošli“ míří na jednoho člověka, na „ty“. Podmět je nevyjádřený.",
  }),
  choice("Jaký podmět má věta „Nemám čas.“?", "já (nevyjádřený)", [
    { value: "čas", why: "„Čas“ je to, co nemám — děj nekoná." },
    { value: "ty (nevyjádřený)", why: "K „ty“ patří tvar „nemáš“." },
    { value: "on (nevyjádřený)", why: "K „on“ patří tvar „nemá“." },
  ], {
    hints: ["Kdo nemá čas? Ve větě to napsané není.", "Tvar „nemám“ patří k jednomu zájmenu: … nemám, ty nemáš, on nemá. Doplň první z nich."],
    explanation: "Tvar „nemám“ patří k zájmenu „já“. Podmět je nevyjádřený a „čas“ je předmět.",
  }),
  choice("Jaký podmět má věta „Přijdete zítra?“", "vy (nevyjádřený)", [
    { value: "my (nevyjádřený)", why: "K „my“ patří tvar „přijdeme“." },
    { value: "oni (nevyjádřený)", why: "K „oni“ patří tvar „přijdou“." },
    { value: "zítra", why: "„Zítra“ říká, kdy — děj nekoná." },
  ], {
    hints: ["Na koho se ta otázka obrací?", "Časuj: my přijdeme, … přijdete, oni přijdou. Ke kterému zájmenu tvar „přijdete“ patří?"],
    explanation: "Tvar „přijdete“ patří k zájmenu „vy“, proto je podmět nevyjádřený „vy“.",
  }),
  najdiPodmet("Celá třída zpívala píseň.", "třída", "zpívala", [["Celá", "pri"], ["zpívala", "pris"], ["píseň", "pred"]]),
  najdiPodmet("Moje babička plete svetr.", "babička", "plete", [["Moje", "pri"], ["plete", "pris"], ["svetr", "pred"]]),
  najdiPodmet("Sníh pokryl střechy domů.", "Sníh", "pokryl", [["pokryl", "pris"], ["střechy", "pred"], ["domů", "pri"]]),
  najdiPrisudek("Vlak přijel přesně na čas.", "Vlak", "přijel", [["Vlak", "podm"], ["přesně", "jak"], ["čas", "cas"]]),
  najdiPodmet("Starší sestra pomáhá s úkoly.", "sestra", "pomáhá", [["Starší", "pri"], ["pomáhá", "pris"], ["úkoly", "pred"]]),
  najdiPrisudek("Kniha leží na stole.", "Kniha", "leží", [["Kniha", "podm"], ["na", "predl"], ["stole", "misto"]]),
  najdiPrisudek("Vlaštovky se vrátily z jihu.", "Vlaštovky", "vrátily se", [["Vlaštovky", "podm"], ["z", "predl"], ["jihu", "misto"]]),
  choice("Ve které větě je podmět nevyjádřený?", "Běžíme na autobus.", [
    { value: "Petr běží na autobus.", why: "Podmět „Petr“ je ve větě napsaný." },
    { value: "Děti běží na autobus.", why: "Podmět „děti“ je ve větě napsaný." },
    { value: "Pes běží za autobusem.", why: "Podmět „pes“ je ve větě napsaný." },
  ], {
    hints: ["Ve které větě nenajdeš slovo, které by odpovědělo na otázku „kdo běží?“", "Když podmět ve větě chybí, prozradí ho koncovka slovesa (třeba „jdeme“ = my). V ostatních větách je podmět napsaný."],
    explanation: "Ve větě „Běžíme na autobus.“ podmět napsaný není, prozradí ho až tvar slovesa: běžíme = my.",
  }),
];

const L3: PracticeTask[] = [
  najdiPodmet("Mrzí mě tvá chyba.", "chyba", "mrzí", [["mě", "pred"], ["tvá", "pri"], ["Mrzí", "pris"]]),
  najdiPodmet("Na stromě sedí malý ptáček.", "ptáček", "sedí", [["stromě", "misto"], ["sedí", "pris"], ["malý", "pri"]]),
  choice("Jaký podmět má věta „Prší.“?", "věta podmět nemá", [
    { value: "nevyjádřený (ono)", why: "Nevyjádřený podmět jde doplnit (jdeme → my). K „prší“ nikoho doplnit nejde." },
    { value: "déšť", why: "Slovo „déšť“ ve větě není. Věta tvoří jen jedno sloveso." },
    { value: "Prší", why: "„Prší“ je přísudek — říká, co se děje." },
  ], {
    hints: ["Kdo nebo co prší? Dá se na to vůbec odpovědět?", "U vět o počasí (prší, sněží, svítá) nikdo děj nekoná a nikoho nejde doplnit. Takové věty jsou jen z jednoho slovesa."],
    explanation: "Na otázku „kdo, co prší?“ nejde odpovědět. Věta „Prší.“ podmět nemá — je to věta jednočlenná.",
  }),
  choice("Jaký podmět má věta „Bylo mu smutno.“?", "věta podmět nemá", [
    { value: "mu", why: "„Mu“ říká, komu bylo smutno. Na otázku „kdo, co?“ neodpovídá." },
    { value: "smutno", why: "„Smutno“ je součást přísudku „bylo smutno“." },
    { value: "on (nevyjádřený)", why: "Ten, komu bylo smutno, je ve větě jako „mu“ — děj ale nekoná." },
  ], {
    hints: ["Zkus se zeptat: kdo nebo co bylo smutno?", "Věta popisuje, jak se někdo cítí, ale nikdo tu nic nedělá. „Mu“ odpovídá na otázku „komu?“, ne „kdo?“."],
    explanation: "Věta „Bylo mu smutno.“ podmět nemá. „Mu“ odpovídá na otázku „komu?“, takže podmětem není.",
  }),
  najdiPrisudek("Petr bude číst celý večer.", "Petr", "bude číst", [["Petr", "podm"], ["celý", "pri"], ["večer", "cas"]]),
  najdiPrisudek("Závodníci se připravují na start.", "Závodníci", "připravují se", [["Závodníci", "podm"], ["na", "predl"], ["start", "pred"]]),
  najdiPodmet("Tichý les skrývá mnoho tajemství.", "les", "skrývá", [["Tichý", "pri"], ["skrývá", "pris"], ["tajemství", "pred"]]),
  najdiPrisudek("Děti byly po výletě unavené.", "Děti", "byly unavené", [["Děti", "podm"], ["po", "predl"], ["výletě", "cas"]],
    "Jaké byly děti? — unavené. Přísudek tu tvoří dvě slova: „byly“ spolu s „unavené“. Samotné „byly“ by neřeklo, jaké děti byly."),
  najdiPodmet("Kašel ho trápil celou noc.", "Kašel", "trápil", [["ho", "pred"], ["trápil", "pris"], ["noc", "cas"]]),
  choice("Jaký podmět má věta „Zpívejte!“?", "vy (nevyjádřený)", [
    { value: "ty (nevyjádřený)", why: "Jednomu člověku bychom řekli „zpívej“." },
    { value: "my (nevyjádřený)", why: "Sebe i ostatní bychom vyzvali „zpívejme“." },
    { value: "věta podmět nemá", why: "Podmět tu jde doplnit — ti, kdo mají zpívat." },
  ], {
    hints: ["Komu ta výzva patří — jednomu, nebo víc lidem?", "Porovnej: zpívej (jednomu), zpívejme (i sobě), zpívejte. Ke komu patří poslední tvar?"],
    explanation: "Výzva „zpívejte“ míří na víc lidí, na „vy“. Podmět je nevyjádřený.",
  }),
  najdiPodmet("Ze skříně vypadla stará krabice.", "krabice", "vypadla", [["skříně", "misto"], ["vypadla", "pris"], ["stará", "pri"]]),
  najdiPrisudek("Včera večer přiletěli čápi.", "čápi", "přiletěli", [["čápi", "podm"], ["Včera", "cas"], ["večer", "cas"]]),
  choice("Ve které větě podmět chybí úplně a nedá se ani doplnit?", "Venku sněží.", [
    { value: "Venku si hrajeme.", why: "Podmět jde doplnit: hrajeme = my." },
    { value: "Venku stojí auto.", why: "Podmět je napsaný: auto (co stojí?)." },
    { value: "Venku na mě čekej!", why: "Podmět jde doplnit: čekej = ty." },
  ], {
    hints: ["Ke které větě nedokážeš doplnit, kdo nebo co děj koná?", "U vět o počasí (prší, svítá) nikdo děj nekoná. U výzvy nebo u tvaru jako „hrajeme“ se podmět doplnit dá."],
    explanation: "U věty „Venku sněží.“ nejde doplnit, kdo sněží. Taková věta podmět nemá.",
  }),
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? L3 : level === 2 ? L2 : L1;
  return shuffle(pool);
}

export const STAVBAVETYZAKLADNISKLADEBNIDVOJICEPODMETPRISUDEK: TopicMetadata[] = [
  {
    id: "g4-cjl-jazykova-vychova-skladba-stavba-vety-zakladni-skladebni-dvojice-podmet-prisudek",
    rvpNodeId: "g4-cjl-jazykova-vychova-skladba-stavba-vety-zakladni-skladebni-dvojice-podmet-prisudek",
    displayName: "Podmět a přísudek",
    title: "Stavba věty - základní skladební dvojice (podmět, přísudek)",
    studentTitle: "Podmět a přísudek",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Jazyková výchova",
    briefDescription: "Pochopíš, co je podmět a přísudek a jak je najdeš.",
    keywords: ["podmět", "přísudek", "skladba", "věta", "základní skladební dvojice"],
    goals: [
      "Určit podmět a přísudek ve větě",
      "Rozpoznat nevyjádřený podmět",
      "Pochopit základní skladební dvojici",
    ],
    boundaries: ["Bez rozvíjejících větných členů", "Bez souvětí"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    recommendedNext: ["g4-cjl-jazykova-vychova-skladba-veta-jednoducha-a-souveti-vzorec-souveti"],
    generator: gen,
    helpTemplate: {
      hint: "Podmět = KDO/CO; Přísudek = CO DĚLÁ/JAKÝ JE; podmět může být nevyjádřený (schovaný v koncovce slovesa)",
      steps: [
        "Najdi sloveso ve větě — to je přísudek.",
        "Zeptej se KDO? CO? na sloveso.",
        "Odpověď je podmět.",
        "Pokud podmět není napsaný, odvoď ho z koncovky (jdeme = my).",
      ],
      commonMistake: "Záměna podmětu a předmětu: 'Petr čte knihu' — Petr je podmět, knihu je předmět",
      example: "Petr čte knihu. Podmět: Petr (kdo čte?). Přísudek: čte.",
    },
  },
];
