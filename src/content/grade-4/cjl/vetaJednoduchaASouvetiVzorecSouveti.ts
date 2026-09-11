import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 4. ročníku).
//  • Vypadlo určování druhů vedlejších vět (podmětná, přípustková,
//    podmínková…) — to je učivo 8.–9. ročníku, ne 4.
//  • Vypadly věty typu „Petr hraje a zpívá“ (jeden podmět, dvě slovesa),
//    u kterých se učebnice neshodnou, jestli jde o souvětí.
//  • Vypadly vymyšlené termíny v možnostech („věta přísudková“,
//    „věta s přívlastkem“).
// L1 = počet vět u krátkých vět · L2 = delší věty, slovesa ze dvou slov
// (šli jsme, budeme psát) · L3 = vzorec souvětí, spojovací výrazy, čárky.

const MOZNOSTI = ["věta jednoduchá", "souvětí ze dvou vět", "souvětí ze tří vět", "souvětí ze čtyř vět"];

function seznam(slovesa: string[]): string {
  return slovesa.map((s) => `„${s}“`).join(", ");
}

function pocetVet(veta: string, prvni: string, slovesa: string[]): PracticeTask {
  const n = slovesa.length;
  const klic = MOZNOSTI[n - 1];
  const spatne = MOZNOSTI.filter((m) => m !== klic).map((m) => {
    const k = MOZNOSTI.indexOf(m) + 1;
    let why: string;
    if (n === 1) why = `Ve větě je jen jedno sloveso: ${seznam(slovesa)}. Jedno sloveso znamená jednu větu.`;
    else if (k === 1) why = `Najdeš víc sloves: ${seznam(slovesa)}. Věta jednoduchá má jen jedno.`;
    else if (k < n) why = `Sloves je víc: ${seznam(slovesa)}. Každé tvoří jednu větu.`;
    else why = `Tolik sloves ve větě není, jsou jen tato: ${seznam(slovesa)}.`;
    return { value: m, why };
  }) as [{ value: string; why: string }, { value: string; why: string }, { value: string; why: string }];
  return choice(`Z kolika vět se skládá „${veta}“?`, klic, spatne, {
    hints: [
      `Kolik sloves (dějů) najdeš ve větě „${veta}“?`,
      `Začni u slova „${prvni}“ a zeptej se, co se děje. Pak hledej další děj za čárkou nebo za spojkou. Každé sloveso — i to ze dvou slov jako „šli jsme“ — znamená jednu větu.`,
    ],
    explanation: n === 1
      ? `Ve větě je jen jedno sloveso (přísudek): ${seznam(slovesa)}. Jeden přísudek znamená větu jednoduchou.`
      : `Slovesa (přísudky): ${seznam(slovesa)}. Každé tvoří jednu větu, proto je to ${klic}.`,
  });
}

const L1: PracticeTask[] = [
  pocetVet("Kočka spí na gauči.", "Kočka", ["spí"]),
  pocetVet("Pršelo a děti zůstaly doma.", "Pršelo", ["pršelo", "zůstaly"]),
  pocetVet("Tatínek vaří oběd.", "Tatínek", ["vaří"]),
  pocetVet("Slunce svítí, ale fouká studený vítr.", "Slunce", ["svítí", "fouká"]),
  pocetVet("Babička peče koláč a dědeček čte noviny.", "Babička", ["peče", "čte"]),
  pocetVet("Ptáci na jaře stavějí hnízda.", "Ptáci", ["stavějí"]),
  pocetVet("Šli jsme do lesa a našli jsme houby.", "Šli", ["šli jsme", "našli jsme"]),
  pocetVet("Bratr hraje na kytaru.", "Bratr", ["hraje"]),
  pocetVet("Když zazvonilo, žáci odešli ze třídy.", "zazvonilo", ["zazvonilo", "odešli"]),
  pocetVet("Pes štěká, kočka prská a ptáci odlétají.", "Pes", ["štěká", "prská", "odlétají"]),
  pocetVet("Včera večer jsme byli v kině.", "Včera", ["byli jsme"]),
  pocetVet("Maminka řekla, že přijde pozdě.", "Maminka", ["řekla", "přijde"]),
  pocetVet("V zimě na horách napadlo hodně sněhu.", "zimě", ["napadlo"]),
];

const L2: PracticeTask[] = [
  pocetVet("Přišel jsem domů, dal jsem si svačinu a šel jsem ven.", "Přišel", ["přišel jsem", "dal jsem si", "šel jsem"]),
  pocetVet("Zítra budeme psát diktát.", "Zítra", ["budeme psát"]),
  pocetVet("Venku prší, proto si vezmi deštník.", "Venku", ["prší", "vezmi"]),
  pocetVet("Sestra se učí a bratr si hraje s autíčky.", "Sestra", ["učí se", "hraje si"]),
  pocetVet("Děti si hrály na zahradě celé odpoledne.", "Děti", ["hrály si"]),
  pocetVet("Vím, kde bydlíš.", "Vím", ["vím", "bydlíš"]),
  pocetVet("Vlak přijel pozdě, protože napadl sníh.", "Vlak", ["přijel", "napadl"]),
  pocetVet("Když se setmělo, rozsvítili jsme lampu a začali jsme číst.", "setmělo", ["setmělo se", "rozsvítili jsme", "začali jsme"]),
  pocetVet("Po dlouhé cestě jsme konečně dorazili k moři.", "cestě", ["dorazili jsme"]),
  pocetVet("Anna maluje, Petr modeluje a Tomáš stříhá papír.", "Anna", ["maluje", "modeluje", "stříhá"]),
  pocetVet("Kniha, kterou mi půjčila Eva, je napínavá.", "Kniha", ["půjčila", "je"]),
  pocetVet("Na podzim budou stromy shazovat listí.", "podzim", ["budou shazovat"]),
  pocetVet("Když jsme přišli domů, maminka nám řekla, že volala babička.", "přišli", ["přišli jsme", "řekla", "volala"]),
];

const L3: PracticeTask[] = [
  choice("Jaký vzorec má souvětí „Pršelo a vítr fučel.“?", "V1 a V2", [
    { value: "V1, V2", why: "Mezi větami je spojka „a“, ne jen čárka." },
    { value: "V1, že V2", why: "Spojka „že“ v souvětí není." },
    { value: "V1 a V2 a V3", why: "Slovesa jsou jen dvě (pršelo, fučel), takže věty jsou dvě." },
  ], {
    hints: ["Kolik sloves má souvětí a co stojí mezi větami?", "Ve vzorci se každá věta zapíše jako V s číslem a mezi ně se napíše přesně to, co je spojuje — spojka, nebo čárka."],
    explanation: "Věty jsou dvě (pršelo / vítr fučel) a spojuje je spojka „a“, proto vzorec V1 a V2.",
  }),
  choice("Jaký vzorec má souvětí „Vím, že přijdeš.“?", "V1, že V2", [
    { value: "V1 a V2", why: "Spojka „a“ v souvětí není." },
    { value: "V1, V2", why: "Za čárkou stojí spojka „že“ — ve vzorci musí být vidět." },
    { value: "V1, když V2", why: "Spojka „když“ v souvětí není." },
  ], {
    hints: ["Jaké slovo spojuje větu „vím“ s druhou větou?", "Ve vzorci zapiš obě věty jako V1 a V2 a mezi ně opiš čárku i spojovací slovo přesně tak, jak stojí ve větě."],
    explanation: "První věta je „vím“, druhou připojuje čárka a spojka „že“, proto vzorec V1, že V2.",
  }),
  choice("Jaký vzorec má souvětí „Když zazvonilo, děti vyběhly ven.“?", "Když V1, V2", [
    { value: "V1, když V2", why: "Spojka „když“ stojí na začátku celého souvětí, ne mezi větami." },
    { value: "V1 a V2", why: "Spojka „a“ v souvětí není." },
    { value: "V1, V2", why: "Ve vzorci chybí spojka „když“ ze začátku souvětí." },
  ], {
    hints: ["Kde v souvětí stojí spojka „když“ — na začátku, nebo mezi větami?", "Spojovací slovo zapiš ve vzorci tam, kde ve větě opravdu stojí. Tady stojí před první větou a mezi větami je jen čárka."],
    explanation: "Souvětí začíná spojkou „když“ (když zazvonilo = V1), za čárkou následuje V2. Vzorec: Když V1, V2.",
  }),
  choice("Jaký vzorec má souvětí „Pes štěkal, kočka utekla a ptáci vzlétli.“?", "V1, V2 a V3", [
    { value: "V1 a V2 a V3", why: "Mezi první a druhou větou je čárka, ne spojka „a“." },
    { value: "V1, V2, V3", why: "Mezi druhou a třetí větou je spojka „a“." },
    { value: "V1, V2 a V3 a V4", why: "Slovesa jsou jen tři (štěkal, utekla, vzlétli)." },
  ], {
    hints: ["Kolik sloves má souvětí? Co stojí mezi první a druhou větou a co mezi druhou a třetí?", "Každé sloveso je jedna věta. Mezi věty ve vzorci opiš přesně to, co je ve větě odděluje — jednou je to čárka, jednou spojka."],
    explanation: "Tři slovesa = tři věty. Mezi V1 a V2 je čárka, mezi V2 a V3 spojka „a“: V1, V2 a V3.",
  }),
  choice("Jaký vzorec má souvětí „Šla bych ven, ale prší.“?", "V1, ale V2", [
    { value: "V1 a V2", why: "Věty nespojuje „a“, ale spojka „ale“." },
    { value: "V1, že V2", why: "Spojka „že“ v souvětí není." },
    { value: "V1, V2", why: "Ve vzorci chybí spojka „ale“." },
  ], {
    hints: ["Jaké slovo stojí za čárkou?", "Souvětí má dvě slovesa (šla bych, prší). Mezi věty ve vzorci patří čárka i spojovací slovo, které za ní stojí."],
    explanation: "Dvě věty spojuje čárka a spojka „ale“, proto vzorec V1, ale V2.",
  }),
  choice("Doplň spojovací výraz: „Nešla jsem ven, ___ pršelo.“", "protože", [
    { value: "ale", why: "„Ale“ staví věci proti sobě. Déšť tu je ale důvod, proč nešla ven." },
    { value: "a", why: "„A“ věty jen spojí, důvod nevyjádří. Navíc se před „a“ čárka nepíše." },
    { value: "aby", why: "„Aby“ říká účel (proč to dělám). Nejde o to, aby pršelo." },
  ], {
    hints: ["Jak spolu obě věty souvisí — je druhá věta důvodem té první?", "Hledáš spojku, která vysvětluje proč. Zkus každou možnost dosadit a přečíst větu nahlas."],
    explanation: "Druhá věta říká důvod, proč nešla ven. Důvod uvádí spojka „protože“.",
  }),
  choice("Doplň spojovací výraz: „Maminka vaří oběd ___ tatínek myje nádobí.“", "a", [
    { value: "protože", why: "Tatínek nemyje nádobí kvůli tomu, že maminka vaří. Důvod tu není." },
    { value: "že", why: "„Že“ připojuje, co si kdo myslí nebo říká. Tady jsou vedle sebe dvě činnosti." },
    { value: "aby", why: "„Aby“ vyjadřuje účel, který tu není." },
  ], {
    hints: ["Mezi větami není čárka. Která spojka se píše bez čárky?", "Obě věty jen říkají, co kdo dělá, a stojí rovnocenně vedle sebe. Hledej spojku, která je jednoduše sčítá."],
    explanation: "Obě činnosti se dějí vedle sebe. Sčítá je spojka „a“, před kterou se čárka nepíše.",
  }),
  choice("Doplň spojovací výraz: „Pospíchali jsme, ___ nám neujel vlak.“", "aby", [
    { value: "protože", why: "„Protože nám neujel vlak“ by byl důvod — spěchali jsme ale proto, aby neujel." },
    { value: "ale", why: "„Ale“ staví věci proti sobě, tady nic proti sobě nestojí." },
    { value: "a", why: "„A“ nevyjádří, proč jsme spěchali." },
  ], {
    hints: ["Za jakým účelem jsme pospíchali?", "Druhá věta říká, čeho chceme spěchem dosáhnout. Taková věta začíná spojkou, která vyjadřuje účel."],
    explanation: "Druhá věta říká účel spěchu, a ten vyjadřuje spojka „aby“.",
  }),
  choice("Doplň spojovací výraz: „Zeptej se paní učitelky, ___ začíná výlet.“", "kdy", [
    { value: "že", why: "„Zeptej se, že…“ nedává smysl — po „zeptej se“ následuje otázka." },
    { value: "protože", why: "Věta by říkala důvod, proč se ptát, ale ne na co se ptáš." },
    { value: "ale", why: "„Ale“ staví věci proti sobě, tady nic proti sobě nestojí." },
  ], {
    hints: ["Na co se máš paní učitelky zeptat?", "Po slovech „zeptej se“ následuje to, na co se ptáš. Hledej slovo, kterým by šla začít otázka o čase."],
    explanation: "Ptáme se na čas začátku výletu, proto „kdy“: Zeptej se paní učitelky, kdy začíná výlet.",
  }),
  choice("Kam patří čárka v souvětí „Nevím kde je můj sešit.“?", "před slovo „kde“", [
    { value: "za slovo „kde“", why: "„Kde je můj sešit“ je jedna věta — uprostřed ní čárka nebývá." },
    { value: "za slovo „je“", why: "Slova „je můj sešit“ patří k sobě, čárka mezi ně nepatří." },
    { value: "nikam, čárka tu není", why: "Jsou tu dvě věty (nevím / kde je můj sešit) a ty odděluje čárka." },
  ], {
    hints: ["Kolik vět je v souvětí a kde končí první z nich?", "Čárka odděluje věty v souvětí. Najdi hranici mezi větou se slovesem „nevím“ a větou se slovesem „je“ — čárka patří před spojovací slovo."],
    explanation: "Souvětí má dvě věty: „Nevím“ a „kde je můj sešit“. Čárka patří mezi ně, před slovo „kde“.",
  }),
  choice("Kam patří čárka v souvětí „Pes štěkal kočka mňoukala a myš utekla.“?", "jen za slovo „štěkal“", [
    { value: "za „štěkal“ i za „mňoukala“", why: "Před „a“, které jen sčítá věty, se čárka nepíše." },
    { value: "jen za slovo „mňoukala“", why: "Před „a“ čárka nepatří a mezi první a druhou větou naopak chybí." },
    { value: "nikam, čárka tu není", why: "Mezi první a druhou větou není spojka, proto je tam čárka." },
  ], {
    hints: ["Kde končí první věta a kde druhá?", "Věty bez spojky oddělí čárka. Před spojkou „a“, která jen sčítá, se čárka nepíše."],
    explanation: "Mezi první a druhou větou chybí spojka, proto čárka. Před „a“ ve slučovacím poměru se čárka nepíše.",
  }),
  choice("Jaký vzorec má souvětí „Když prší, zůstaneme doma a hrajeme hry.“?", "Když V1, V2 a V3", [
    { value: "V1, V2 a V3", why: "Ve vzorci chybí spojka „když“ na začátku." },
    { value: "Když V1, V2", why: "Slovesa jsou tři (prší, zůstaneme, hrajeme), věty tedy tři." },
    { value: "V1 a V2 a V3", why: "Souvětí začíná spojkou „když“ a za první větou je čárka." },
  ], {
    hints: ["Kolik sloves má souvětí? A jaké slovo stojí úplně na začátku?", "Každé sloveso je jedna věta. Do vzorce opiš spojku ze začátku souvětí, čárku i spojku mezi druhou a třetí větou."],
    explanation: "Tři slovesa = tři věty. Souvětí začíná „když“ (V1), za čárkou je V2 a za spojkou „a“ V3: Když V1, V2 a V3.",
  }),
  choice("Které souvětí patří ke vzorci „V1, protože V2“?", "Zůstal doma, protože byl nemocný.", [
    { value: "Protože byl nemocný, zůstal doma.", why: "Tady spojka „protože“ stojí na začátku: Protože V1, V2." },
    { value: "Byl nemocný, a proto zůstal doma.", why: "Tady věty spojuje „a proto“: V1, a proto V2." },
    { value: "Byl nemocný a zůstal doma.", why: "Tady věty spojuje jen „a“: V1 a V2." },
  ], {
    hints: ["Kde podle vzorce stojí spojka — na začátku, nebo mezi větami?", "Vzorec říká: nejdřív celá první věta, pak čárka, pak spojka „protože“ a druhá věta. Hledej souvětí právě v tomto pořadí."],
    explanation: "V souvětí „Zůstal doma, protože byl nemocný.“ je první věta, za ní čárka a spojka „protože“ s druhou větou — přesně V1, protože V2.",
  }),
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? L3 : level === 2 ? L2 : L1;
  return shuffle(pool);
}

export const VETAJEDNODUCHAASOUVETIVZORECSOUVETI: TopicMetadata[] = [
  {
    id: "g4-cjl-jazykova-vychova-skladba-veta-jednoducha-a-souveti-vzorec-souveti",
    rvpNodeId: "g4-cjl-jazykova-vychova-skladba-veta-jednoducha-a-souveti-vzorec-souveti",
    displayName: "Věta a souvětí",
    title: "Věta jednoduchá a souvětí, vzorec souvětí",
    studentTitle: "Věta a souvětí",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Jazyková výchova",
    briefDescription: "Poznáš rozdíl mezi větou jednoduchou a souvětím a pochopíš jejich vzorec.",
    keywords: ["věta jednoduchá", "souvětí", "přísudek", "spojka", "vzorec souvětí"],
    goals: [
      "Rozlišit větu jednoduchou a souvětí",
      "Určit počet vět v souvětí",
      "Zapsat vzorec souvětí a vybrat vhodný spojovací výraz",
    ],
    boundaries: ["Bez druhů vedlejších vět (učivo 2. stupně)", "Bez souvětí s více než 3 větami"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    recommendedNext: ["g4-cjl-jazykova-vychova-skladba-stavba-vety-zakladni-skladebni-dvojice-podmet-prisudek"],
    generator: gen,
    helpTemplate: {
      hint: "Věta jednoduchá = 1 přísudek; souvětí = 2+ přísudků spojených spojkami nebo čárkou",
      steps: [
        "Spočítej slovesa (přísudky) ve větě.",
        "1 sloveso → věta jednoduchá",
        "2+ slovesa → souvětí",
        "Vzorec: každou větu zapiš jako V1, V2… a mezi ně opiš čárku nebo spojku.",
      ],
      commonMistake: "Počítání slov jako „šli jsme“ nebo „budeme psát“ za dvě slovesa — je to jeden přísudek",
      example: "„Pršelo a vítr fučel.“ = souvětí ze dvou vět, vzorec V1 a V2; „Unavený Petr spí.“ = věta jednoduchá",
    },
  },
];
