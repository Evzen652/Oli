import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { urceni, type Kategorie, type Polozka } from "../_urceni";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// zpětné vazby a číslovky se určovaly bez věty. Teď se každá číslovka určuje
// ve větě: L1 běžné tvary · L2 skloňované a méně časté tvary (dvojí, oboje,
// trojnásobný) · L3 neurčité a tázací číslovky (mnoho, několikrát, kolikátý).

const DRUHY: Kategorie[] = [
  { nazev: "číslovka základní", znak: "vyjadřuje počet; ptáme se kolik? (pět, dvacet, mnoho)." },
  { nazev: "číslovka řadová", znak: "vyjadřuje pořadí; ptáme se kolikátý? (první, třetí)." },
  { nazev: "číslovka druhová", znak: "vyjadřuje počet druhů nebo souborů; ptáme se kolikery? kolikerý? (dvoje boty, dvojí chléb)." },
  { nazev: "číslovka násobná", znak: "vyjadřuje, kolikrát se něco děje nebo kolikrát je něco větší (třikrát, dvojnásobný)." },
];

const P = (uroven: 1 | 2 | 3, slovo: string, veta: string, kategorie: string, klic: string, proc: string): Polozka =>
  ({ uroven, slovo, veta, kategorie, klic, proc });

const ZAKL = "číslovka základní", RAD = "číslovka řadová", DRUH = "číslovka druhová", NAS = "číslovka násobná";

const BANKA: Polozka[] = [
  P(1, "pět", "Na stole leží pět tužek.", ZAKL, "vyjadřuje, kolik je kusů tužek", "Pět tužek — počet kusů; ptáme se kolik? Je to číslovka základní."),
  P(1, "sto", "Naše škola má sto žáků.", ZAKL, "vyjadřuje, kolik je žáků", "Sto žáků — počet; číslovka základní."),
  P(1, "první", "Ve frontě stál první.", RAD, "vyjadřuje místo v pořadí", "První — pořadí; ptáme se kolikátý? Číslovka řadová."),
  P(1, "třetím", "Bydlím ve třetím patře.", RAD, "vyjadřuje, které patro v pořadí to je", "Ve třetím patře — pořadí; číslovka řadová."),
  P(1, "dvakrát", "Zvonek zazvonil dvakrát.", NAS, "vyjadřuje, jak často se něco stalo", "Dvakrát — ptáme se kolikrát? Číslovka násobná."),
  P(1, "třikrát", "Básničku si přečetl třikrát.", NAS, "vyjadřuje, jak často to udělal", "Třikrát — kolikrát? Číslovka násobná."),
  P(1, "dvoje", "Koupil si dvoje boty.", DRUH, "počítá celé páry bot, ne jednotlivé kusy", "Dvoje boty — dva páry; ptáme se kolikery? Číslovka druhová."),
  P(1, "troje", "Máme doma troje klíče.", DRUH, "počítá celé svazky klíčů", "Troje klíče — tři soubory; číslovka druhová."),
  P(1, "deset", "Je mi deset let.", ZAKL, "vyjadřuje, kolik je let", "Deset let — počet; číslovka základní."),
  P(1, "desátý", "Dnes je desátý den prázdnin.", RAD, "vyjadřuje, který den v pořadí to je", "Desátý den — pořadí; číslovka řadová."),
  P(1, "pětkrát", "Na trampolíně pětkrát vyskočil.", NAS, "vyjadřuje, jak často vyskočil", "Pětkrát — kolikrát? Číslovka násobná."),
  P(1, "čtvery", "Vzala si čtvery rukavice.", DRUH, "počítá celé páry rukavic", "Čtvery rukavice — čtyři páry; číslovka druhová."),
  P(1, "dvacet", "Ve třídě je dvacet dětí.", ZAKL, "vyjadřuje, kolik je dětí", "Dvacet dětí — počet; číslovka základní."),

  P(2, "dvojnásobnou", "Dostal dvojnásobnou porci.", NAS, "vyjadřuje, kolikrát je porce větší", "Dvojnásobná porce — dvakrát větší; číslovka násobná."),
  P(2, "patery", "Ve skříni visí patery šaty.", DRUH, "počítá celé kusy oblečení, které se jinak neříkají v jednotném čísle", "Patery šaty — ptáme se kolikery? Číslovka druhová."),
  P(2, "jednou", "Byl jsem tam jen jednou.", NAS, "vyjadřuje, jak často tam byl", "Jednou — kolikrát? Číslovka násobná."),
  P(2, "čtvrtý", "Čtvrtý den konečně přestalo pršet.", RAD, "vyjadřuje, který den v pořadí", "Čtvrtý den — pořadí; číslovka řadová."),
  P(2, "tisíc", "Městečko má tisíc obyvatel.", ZAKL, "vyjadřuje, kolik je obyvatel", "Tisíc obyvatel — počet; číslovka základní."),
  P(2, "dvojí", "Babička upekla dvojí koláče.", DRUH, "vyjadřuje počet druhů koláčů", "Dvojí koláče — dva druhy; číslovka druhová."),
  P(2, "stý", "Škola slavila stý den školního roku.", RAD, "vyjadřuje, který den v pořadí", "Stý den — pořadí; číslovka řadová."),
  P(2, "desetkrát", "Úlohu si desetkrát zkontroloval.", NAS, "vyjadřuje, jak často to udělal", "Desetkrát — kolikrát? Číslovka násobná."),
  P(2, "osm", "V bedně je osm jablek.", ZAKL, "vyjadřuje, kolik je jablek", "Osm jablek — počet; číslovka základní."),
  P(2, "sedmý", "V závodě skončil sedmý.", RAD, "vyjadřuje umístění v pořadí", "Sedmý — kolikátý? Číslovka řadová."),
  P(2, "trojnásobný", "Byl to trojnásobný vítěz závodu.", NAS, "vyjadřuje, kolikrát vyhrál", "Trojnásobný vítěz — třikrát; číslovka násobná."),
  P(2, "oboje", "Vzal si na kopec oboje sáňky.", DRUH, "počítá dva celé kusy, které se říkají v množném čísle", "Oboje sáňky — ptáme se kolikery? Číslovka druhová."),
  P(2, "dvanáctý", "Dvanáctý žák přišel pozdě.", RAD, "vyjadřuje místo v pořadí", "Dvanáctý — pořadí; číslovka řadová."),

  P(3, "mnoho", "Na obloze viděl mnoho hvězd.", ZAKL, "vyjadřuje počet, i když ne přesný", "Mnoho hvězd — neurčitý počet; číslovka základní neurčitá."),
  P(3, "několikrát", "Na dveře několikrát zaklepal.", NAS, "vyjadřuje, jak často, i když ne přesně", "Několikrát — neurčitě kolikrát; číslovka násobná neurčitá."),
  P(3, "několikátý", "Už několikátý den prší.", RAD, "vyjadřuje místo v pořadí, i když ne přesně", "Několikátý den — neurčité pořadí; číslovka řadová neurčitá."),
  P(3, "málo", "Na koncert přišlo málo lidí.", ZAKL, "vyjadřuje neurčitý počet lidí", "Málo lidí — neurčitý počet; číslovka základní neurčitá."),
  P(3, "kolikrát", "Kolikrát jsi byl v Praze?", NAS, "ptá se, jak často to bylo", "Kolikrát — tázací číslovka násobná."),
  P(3, "kolik", "Kolik stojí ten sešit?", ZAKL, "ptá se na počet korun", "Kolik — tázací číslovka základní."),
  P(3, "kolikátý", "Kolikátý jsi skončil v závodě?", RAD, "ptá se na umístění", "Kolikátý — tázací číslovka řadová."),
  P(3, "dvoje", "V chodbě jsou dvoje dveře.", DRUH, "počítá celé dveře; slovo dveře má jen množné číslo", "Dvoje dveře — slovo dveře nemá jednotné číslo, proto číslovka druhová."),
  P(3, "několik", "Na oslavu přišlo několik hostů.", ZAKL, "vyjadřuje neurčitý počet hostů", "Několik hostů — neurčitý počet; číslovka základní neurčitá."),
  P(3, "trojí", "Na stole byl trojí salát.", DRUH, "vyjadřuje počet druhů salátu", "Trojí salát — tři druhy; číslovka druhová."),
  P(3, "tolikrát", "Tolikrát jsem ti to říkal!", NAS, "vyjadřuje, jak často se to stalo", "Tolikrát — ukazovací číslovka násobná."),
  P(3, "nesčetněkrát", "Tu písničku slyšel nesčetněkrát.", NAS, "vyjadřuje, že se to stalo tolikrát, že to nejde spočítat", "Nesčetněkrát — neurčitá číslovka násobná."),
];

function gen(level: number): PracticeTask[] {
  return urceni(BANKA, DRUHY, level, (p) => ({
    question: `Jaký druh číslovky je „${p.slovo}“ ve větě „${p.veta}“?`,
    hints: [
      `Na jakou otázku odpovídá „${p.slovo}“ ve větě „${p.veta}“: kolik, kolikátý, kolikery, nebo kolikrát?`,
      `Pomůže tohle: „${p.slovo}“ tu ${p.klic}.`,
    ],
  }));
}

export const CISLOVKYDRUHYZAKLADNIRADOVEDRUHOVENASOBNE: TopicMetadata[] = [
  {
    id: "g5-cjl-jazykova-vychova-tvaroslovi-cislovky-druhy-zakladni-radove-druhove-nasobne",
    rvpNodeId: "g5-cjl-jazykova-vychova-tvaroslovi-cislovky-druhy-zakladni-radove-druhove-nasobne",
    title: "Číslovky – druhy: základní, řadové, druhové, násobné",
    studentTitle: "Druhy číslovek",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Tvarosloví",
    briefDescription: "Poznáš čtyři druhy číslovek – základní, řadové, druhové a násobné.",
    keywords: ["číslovky", "základní", "řadové", "druhové", "násobné", "kolik", "kolikátý"],
    goals: [
      "Rozlišit čtyři druhy číslovek",
      "Použít správný druh číslovky v kontextu",
      "Odpovědět na otázky kolik?, kolikátý?, kolikery?, kolikrát?",
    ],
    boundaries: [
      "Neprobíráme skloňování číslovek podrobně",
      "Bez složitého dělení neurčitých číslovek",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Čtyři druhy číslovek: Základní (kolik?) = pět. Řadové (kolikátý?) = pátý. Druhové (kolikery?) = patery. Násobné (kolikrát?) = pětkrát.",
      steps: [
        "Přečti číslovku a zeptej se otázkou.",
        "Kolik? → základní (pět, sto, tisíc).",
        "Kolikátý? → řadová (pátý, stý).",
        "Kolikery? → druhová (patery, dvoje).",
        "Kolikrát? → násobná (pětkrát, jednou, trojnásobně).",
      ],
      commonMistake: "Žáci si pletou základní a druhové číslovky. 'Tři' = základní (počet). 'Troje' = druhová (druh/sada).",
      example: "Tři jablka (základní). Třetí místo (řadová). Troje dveře (druhová). Třikrát denně (násobná).",
    },
  },
];
