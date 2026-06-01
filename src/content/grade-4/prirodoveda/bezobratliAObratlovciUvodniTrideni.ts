import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL_L1: PracticeTask[] = [
  { question: "Jaký je hlavní rozdíl mezi bezobratlými a obratlovci?", correctAnswer: "Obratlovci mají páteř (kostru z obratlů), bezobratlí nemají", options: ["Obratlovci mají páteř (kostru z obratlů), bezobratlí nemají", "Obratlovci jsou větší než bezobratlí", "Bezobratlí žijí jen ve vodě", "Obratlovci mají křídla, bezobratlí ne"] },
  { question: "Kolik noh má hmyz?", correctAnswer: "6 noh", options: ["6 noh", "4 nohy", "8 noh", "10 noh"] },
  { question: "Kolik noh má pavouk?", correctAnswer: "8 noh", options: ["8 noh", "6 noh", "4 nohy", "10 noh"] },
  { question: "Z kolika částí se skládá tělo hmyzu?", correctAnswer: "Ze 3 částí: hlava, hruď, zadeček", options: ["Ze 3 částí: hlava, hruď, zadeček", "Ze 2 částí: hlava a tělo", "Ze 4 částí: hlava, hruď, břicho, ocas", "Z 1 části — tělo hmyzu není členěno"] },
  { question: "Která skupina živočichů má šupiny, žábry a ploutve?", correctAnswer: "Ryby", options: ["Ryby", "Obojživelníci", "Plazi", "Ptáci"] },
  { question: "Co jsou obojživelníci?", correctAnswer: "Živočichové, jejichž larvy žijí ve vodě a dospělci na souši i ve vodě", options: ["Živočichové, jejichž larvy žijí ve vodě a dospělci na souši i ve vodě", "Živočichové žijící výhradně ve vodě", "Živočichové s křídly i ploutvemi", "Živočichové žijící jen na souši"] },
  { question: "Které skupině obratlovců patří had?", correctAnswer: "Plazi", options: ["Plazi", "Obojživelníci", "Savci", "Ryby"] },
  { question: "Které skupině obratlovců patří žába?", correctAnswer: "Obojživelníci", options: ["Obojživelníci", "Plazi", "Ryby", "Savci"] },
  { question: "Co charakterizuje ptáky?", correctAnswer: "Peří, teplokrevní, snášejí vejce, přední končetiny = křídla", options: ["Peří, teplokrevní, snášejí vejce, přední končetiny = křídla", "Šupiny, chladnokrevní, snášejí vejce", "Srst, teplokrevní, kojí mláďata", "Žábry, studená krev, ploutve"] },
  { question: "Co charakterizuje savce?", correctAnswer: "Srst nebo chlupy, teplokrevní, kojení mláďat mlékem", options: ["Srst nebo chlupy, teplokrevní, kojení mláďat mlékem", "Peří, teplokrevní, vejce", "Šupiny, chladnokrevní, vejce", "Žábry, studená krev, ploutve"] },
  { question: "Které skupině živočichů patří klíště?", correctAnswer: "Pavoukovci (8 noh)", options: ["Pavoukovci (8 noh)", "Hmyz (6 noh)", "Červi", "Měkkýši"] },
  { question: "Které skupině živočichů patří hlemýžď?", correctAnswer: "Měkkýši", options: ["Měkkýši", "Hmyz", "Červi", "Pavoukovci"] },
  { question: "Mají ryby teplou nebo studenou krev?", correctAnswer: "Studenou (teplota těla závisí na prostředí)", options: ["Studenou (teplota těla závisí na prostředí)", "Teplou (teplota těla stálá)", "Ani studenou ani teplou — nemají krev", "V létě teplou, v zimě studenou"] },
  { question: "Jak dýchají dospělé žáby?", correctAnswer: "Plícemi a kůží", options: ["Plícemi a kůží", "Žábrami jako ryby", "Jen kůží", "Průduchy jako hmyz"] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Vyjmenuj 5 skupin bezobratlých živočichů.", correctAnswer: "Hmyz, pavoukovci, měkkýši, červi, korýši (nebo raci, krabi...)", options: ["Hmyz, pavoukovci, měkkýši, červi, korýši (nebo raci, krabi...)", "Hmyz, obojživelníci, ryby, plazi, ptáci", "Motýli, pavouci, šneci, žížaly, raci", "Hmyz, ptáci, savci, plazi, červi"] },
  { question: "Vyjmenuj 5 skupin obratlovců.", correctAnswer: "Ryby, obojživelníci, plazi, ptáci, savci", options: ["Ryby, obojživelníci, plazi, ptáci, savci", "Hmyz, pavoukovci, červi, ptáci, savci", "Ryby, žáby, hadi, ptáci, pes", "Korýši, měkkýši, červi, ptáci, savci"] },
  { question: "Co je chitinová kostra hmyzu?", correctAnswer: "Vnější tvrdý obal (exoskelet) z chitinu, který chrání tělo hmyzu", options: ["Vnější tvrdý obal (exoskelet) z chitinu, který chrání tělo hmyzu", "Vnitřní kostra jako u savců", "Kůže plnící funkci kostry", "Vápenatý obal jako u šneků"] },
  { question: "Jak se nazývá přeměna housenky v motýla?", correctAnswer: "Metamorfóza (přeměna: vajíčko → larva/housenka → kukla → imago/motýl)", options: ["Metamorfóza (přeměna: vajíčko → larva/housenka → kukla → imago/motýl)", "Hibernace", "Evoluce", "Transpirace"] },
  { question: "Jak se liší plazi od obojživelníků?", correctAnswer: "Plazi: šupiny, vejce kladou na souši. Obojživelníci: vlhká kůže, larvy ve vodě.", options: ["Plazi: šupiny, vejce kladou na souši. Obojživelníci: vlhká kůže, larvy ve vodě.", "Plazi žijí ve vodě, obojživelníci na souši.", "Obě skupiny mají šupiny a kladou vejce.", "Žádný rozdíl — jsou to synonyma."] },
  { question: "Proč plazi potřebují sluneční teplo?", correctAnswer: "Jsou chladnokrevní — tělesná teplota závisí na okolním prostředí, ohřívají se ze slunce", options: ["Jsou chladnokrevní — tělesná teplota závisí na okolním prostředí, ohřívají se ze slunce", "Plazi potřebují teplo pro fotosyntézu", "Teplo jim pomáhá s dýcháním", "Plazi jsou teplokrevní a potřebují teplo ke stálé teplotě"] },
  { question: "Co jsou korýši a uveď příklady?", correctAnswer: "Bezobratlí s tvrdým pancéřem a většinou 5 páry noh — rak, krab, humr, krevetka", options: ["Bezobratlí s tvrdým pancéřem a většinou 5 páry noh — rak, krab, humr, krevetka", "Bezobratlí s ulitou — šnek, hlemýžď", "Hmyz s krunýřem — brouk, chrobák", "Obratlovci s šupinami — ryby"] },
  { question: "Jak dýchají larvy žab?", correctAnswer: "Žábrami (jako ryby) — dospělec pak přechází na plíce + kůži", options: ["Žábrami (jako ryby) — dospělec pak přechází na plíce + kůži", "Plícemi od počátku", "Průduchy jako hmyz", "Kůží od vajíčka až do dospělosti"] },
  { question: "Jak se liší struktura těla pavoukovců od hmyzu?", correctAnswer: "Pavoukovci: 8 noh, 2 části těla (hlavohruď + zadeček). Hmyz: 6 noh, 3 části těla.", options: ["Pavoukovci: 8 noh, 2 části těla (hlavohruď + zadeček). Hmyz: 6 noh, 3 části těla.", "Pavoukovci: 6 noh, 3 části. Hmyz: 8 noh, 2 části.", "Obě skupiny mají 6 noh a 3 části těla.", "Pavoukovci a hmyz jsou synonyma."] },
  { question: "Co jsou molusky (měkkýši)?", correctAnswer: "Bezobratlí s měkkým tělem, většinou s ulitou nebo pláštěm — šnek, hlemýžď, sépie, mušle", options: ["Bezobratlí s měkkým tělem, většinou s ulitou nebo pláštěm — šnek, hlemýžď, sépie, mušle", "Bezobratlí s chitinovou kostrou — hmyz a pavoukovci", "Bezobratlí s tvrdým pancéřem — rak, krab", "Červi s válcovitým tělem"] },
  { question: "Proč jsou obratlovci evolučně 'úspěšnější' než bezobratlí?", correctAnswer: "Páteř umožnila větší tělesnou velikost, složitější nervový systém a obsazení nových prostředí", options: ["Páteř umožnila větší tělesnou velikost, složitější nervový systém a obsazení nových prostředí", "Obratlovci nejsou evolučně úspěšnější — bezobratlých je víc druhů", "Obratlovci mají výhodu jen ve vodním prostředí", "Páteř je zbytečná — evoluční výhoda je jen chitinový obal"] },
  { question: "Jaké jsou příklady parazitických bezobratlých?", correctAnswer: "Klíště, pijavice, tasemnice, škrkavka — žijí na úkor jiného organismu", options: ["Klíště, pijavice, tasemnice, škrkavka — žijí na úkor jiného organismu", "Žížala, mravenec, pavouci", "Motýl, včela, čmelák", "Rak, krab, humr"] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Co je endoskeleton a exoskeleton a jaké jsou výhody/nevýhody každého?", correctAnswer: "Endoskeleton (vnitřní): umožňuje velký růst. Exoskeleton (vnější, hmyz): pevná ochrana, ale limituje velikost (svlékání).", options: ["Endoskeleton (vnitřní): umožňuje velký růst. Exoskeleton (vnější, hmyz): pevná ochrana, ale limituje velikost (svlékání).", "Endoskeleton je u bezobratlých, exoskeleton u obratlovců.", "Exoskeleton umožňuje neomezený růst bez svlékání.", "Oba typy kostry mají stejné výhody a nevýhody."] },
  { question: "Proč je pavouček v naší mytologii a kultuře tak odlišně vnímán než hmyz?", correctAnswer: "Tato otázka není vědecká — jde o kulturní vnímání; vědecky jsou oba bezobratlí s exoskeletem", options: ["Tato otázka není vědecká — jde o kulturní vnímání; vědecky jsou oba bezobratlí s exoskeletem", "Pavouk je nebezpečnější než hmyz vědecky prokázáno", "Hmyz je evolučně vyspělejší než pavouci", "Pavouci jsou oblíbenější kvůli sítím"] },
  { question: "Jak se vyvíjely obratlovci z vodního na suchozemský způsob života?", correctAnswer: "Ryby → lalokovité ryby → obojživelníci (přechod) → plazi (vajíčka na souši) → ptáci+savci", options: ["Ryby → lalokovité ryby → obojživelníci (přechod) → plazi (vajíčka na souši) → ptáci+savci", "Ptáci → savci → plazi → obojživelníci → ryby", "Obojživelníci přímo přešli na savce bez mezistádia", "Suchozemský život vznikl nezávisle na rybách"] },
  { question: "Co je kambrium v kontextu evoluce bezobratlých?", correctAnswer: "Geologické období (~541–485 milionů let) — 'exploze' druhů, vznik většiny typů bezobratlých", options: ["Geologické období (~541–485 milionů let) — 'exploze' druhů, vznik většiny typů bezobratlých", "Geologické období vzniku savců", "Výbuch vulkánu, který zničil bezobratlé", "Kambrická exploze = zánik dinosaurů"] },
  { question: "Co je metamorfóza kompletní (holometabolia) vs. neúplná (hemimetabolia)?", correctAnswer: "Kompletní: vajíčko → larva → kukla → imago (motýl, brouk). Neúplná: vajíčko → nymfa (podobná dospělci) → imago (kobylka).", options: ["Kompletní: vajíčko → larva → kukla → imago (motýl, brouk). Neúplná: vajíčko → nymfa (podobná dospělci) → imago (kobylka).", "Kompletní: jen 2 stádia. Neúplná: 4 stádia.", "Obě metamorfózy zahrnují stádium kukly.", "Hemimetabolia je dokonalejší forma než holometabolia."] },
  { question: "Co je mimikry u bezobratlých?", correctAnswer: "Napodobení barvy nebo tvaru jedovatého nebo nebezpečného druhu jako ochrana (batesovská mimikry)", options: ["Napodobení barvy nebo tvaru jedovatého nebo nebezpečného druhu jako ochrana (batesovská mimikry)", "Schopnost pavouků měnit barvu jako chameleon", "Druh obranného jeda produkovaného hmyzem", "Napodobení hlasu predátora k zastrašení"] },
  { question: "Proč jsou ptáci klasifikováni jako letití plazi (Archosauria)?", correctAnswer: "Ptáci se vyvinuli z teropodních dinosaurů — sdílejí mnoho znaků s plazy (šupiny na nohách, vejce)", options: ["Ptáci se vyvinuli z teropodních dinosaurů — sdílejí mnoho znaků s plazy (šupiny na nohách, vejce)", "Ptáci jsou savci s křídly", "Ptáci a plazi nemají nic společného — jsou nezávislé skupiny", "Ptáci se vyvinuli z ryb přes obojživelníky"] },
  { question: "Co je endotermie u savců a ptáků a proč je výhodná?", correctAnswer: "Schopnost udržet stálou tělesnou teplotu vlastním metabolismem — umožňuje aktivitu nezávislou na počasí", options: ["Schopnost udržet stálou tělesnou teplotu vlastním metabolismem — umožňuje aktivitu nezávislou na počasí", "Schopnost přijímat teplo z okolního prostředí", "Regulace teploty pomocí pití vody", "Endotermie je jen u savců, ptáci jsou chladnokrevní"] },
  { question: "Co je viviparismus u savců a čím se liší od oviparity?", correctAnswer: "Viviparismus: mládě se vyvíjí v těle matky. Oviparismus: vajíčka kladena mimo tělo matky.", options: ["Viviparismus: mládě se vyvíjí v těle matky. Oviparismus: vajíčka kladena mimo tělo matky.", "Viviparismus: vejce se vyvíjí v hnízdu. Oviparismus: vejce v těle matky.", "Oba způsoby jsou totožné u savců.", "Viviparismus mají jen mořští savci."] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 45);
}

export const BEZOBRATLIAOBRATLOVCIUVODNITRIDENI: TopicMetadata[] = [
  {
    id: "g4-prirodoveda-rozmanitost-prirody-ziva-priroda-zivocichove-bezobratli-a-obratlovci-uvodni-trideni",
    rvpNodeId: "g4-prirodoveda-rozmanitost-prirody-ziva-priroda-zivocichove-bezobratli-a-obratlovci-uvodni-trideni",
    title: "Bezobratlí a obratlovci (úvodní třídění)",
    studentTitle: "Třídění živočichů",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Rozmanitost přírody",
    briefDescription: "Naučíš se třídit živočichy a rozlišíš bezobratlé od obratlovců.",
    keywords: ["bezobratlí", "obratlovci", "hmyz", "pavoukovci", "měkkýši", "červi", "ryby", "obojživelníci", "plazi", "ptáci", "savci"],
    goals: [
      "Vysvětlit rozdíl mezi bezobratlými a obratlovci",
      "Zařadit typické živočichy do správné skupiny",
      "Popsat znaky každé skupiny obratlovců",
      "Popsat znaky hmyzu, pavoukovců a měkkýšů",
    ],
    boundaries: ["Podrobná taxonomie a latinské názvy nejsou náplní 4. ročníku"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Klíč: páteř? → obratlovci. Počet noh: 6=hmyz, 8=pavoukovci.",
      steps: [
        "1. Bezobratlí: bez páteře (hmyz, pavouci, šneci, žížaly).",
        "2. Hmyz: 6 noh, 3 části těla. Pavouk: 8 noh, 2 části.",
        "3. Obratlovci: ryby, obojživelníci, plazi, ptáci, savci.",
        "4. Savci = srst + kojení. Ptáci = peří + vejce. Plazi = šupiny + chladnokrevní.",
      ],
      commonMistake: "Pavouk není hmyz — má 8 noh, ne 6.",
      example: "Motýl: hmyz (6 noh). Klíště: pavoukovci (8 noh). Kapr: ryba (obratlovci). Žába: obojživelník.",
    },
  },
];
