import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { urceni, type Kategorie, type Polozka } from "../_urceni";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu a bez
// zpětné vazby k chybným možnostem. Teď se určuje, jaký podmět věta má:
// L1 krátké věty · L2 delší věty, podmět za přísudkem · L3 zrádné případy
// (jeden podmět ke dvěma přísudkům, „Bolí mě hlava.“, „Je mi zima.“).

const TYPY: Kategorie[] = [
  { nazev: "podmět vyjádřený", znak: "podmět je ve větě napsaný — jedno slovo nebo spojení (Pes štěká.)." },
  { nazev: "podmět nevyjádřený", znak: "podmět ve větě napsaný není, poznáš ho z tvaru slovesa (Čtu. — já)." },
  { nazev: "podmět několikanásobný", znak: "ve větě jsou dva nebo více podmětů ke stejnému přísudku (Petr a Jana přišli.)." },
  { nazev: "věta bez podmětu", znak: "děj nikdo nedělá a podmět si ani nedomyslíš (Prší. Stmívá se.)." },
];

const VYJ = "podmět vyjádřený", NEV = "podmět nevyjádřený", NEK = "podmět několikanásobný", BEZ = "věta bez podmětu";
const P = (uroven: 1 | 2 | 3, veta: string, kategorie: string, klic: string, proc: string): Polozka =>
  ({ uroven, slovo: veta, veta, kategorie, klic, proc });

const BANKA: Polozka[] = [
  P(1, "Pes štěká.", VYJ, "přísudek je „štěká“ a na otázku kdo štěká? odpovídá slovo ve větě", "Kdo štěká? Pes — podmět je napsaný, je vyjádřený."),
  P(1, "Čtu knihu.", NEV, "přísudek je „čtu“ a slovo, které by říkalo kdo, ve větě chybí", "Kdo čte? Já — z tvaru slovesa, ve větě to napsané není. Podmět nevyjádřený."),
  P(1, "Petr a Jana přišli.", NEK, "přísudek je „přišli“ a na otázku kdo přišel? odpovídají dvě jména", "Kdo přišel? Petr a Jana — dva podměty, podmět několikanásobný."),
  P(1, "Prší.", BEZ, "přísudek je „prší“ a nikdo ani nic to nedělá", "Prší — nikdo ani nic neprší; věta je bez podmětu."),
  P(1, "Kočka spí.", VYJ, "přísudek je „spí“ a kdo spí, je ve větě napsané", "Kdo spí? Kočka — podmět vyjádřený."),
  P(1, "Běžíme domů.", NEV, "přísudek je „běžíme“; kdo běží, poznáš jen z tvaru slovesa", "Kdo běží? My — podmět nevyjádřený."),
  P(1, "Maminka a táta vaří.", NEK, "přísudek je „vaří“ a vaří dva lidé", "Kdo vaří? Maminka a táta — podmět několikanásobný."),
  P(1, "Sněží.", BEZ, "přísudek je „sněží“ a nikdo to nedělá", "Sněží — věta bez podmětu."),
  P(1, "Ptáci zpívají.", VYJ, "přísudek je „zpívají“ a kdo zpívá, je ve větě", "Kdo zpívá? Ptáci — podmět vyjádřený."),
  P(1, "Píšeš úkol?", NEV, "přísudek je „píšeš“; kdo píše, poznáš z koncovky", "Kdo píše? Ty — podmět nevyjádřený."),
  P(1, "Jablka a hrušky leží v míse.", NEK, "přísudek je „leží“ a leží dva druhy ovoce", "Co leží? Jablka a hrušky — podmět několikanásobný."),
  P(1, "Hřmí.", BEZ, "přísudek je „hřmí“ a nikdo to nedělá", "Hřmí — věta bez podmětu."),
  P(1, "Slunce svítí.", VYJ, "přísudek je „svítí“ a co svítí, je ve větě", "Co svítí? Slunce — podmět vyjádřený."),

  P(2, "Včera večer přijela babička.", VYJ, "přísudek je „přijela“; podmět tu stojí až za ním", "Kdo přijel? Babička — podmět vyjádřený, i když stojí na konci."),
  P(2, "Ráno jsme vstávali brzy.", NEV, "přísudek je „vstávali jsme“ a slovo my ve větě není", "Kdo vstával? My — podmět nevyjádřený."),
  P(2, "Na louce se pásly krávy, ovce a kozy.", NEK, "přísudek je „pásly se“ a pásla se tři zvířata", "Co se páslo? Krávy, ovce a kozy — podmět několikanásobný."),
  P(2, "Venku se stmívá.", BEZ, "přísudek je „stmívá se“ a nikdo to nedělá", "Stmívá se — věta bez podmětu."),
  P(2, "Do třídy vešla paní učitelka.", VYJ, "přísudek je „vešla“ a kdo vešel, je ve větě", "Kdo vešel? Paní učitelka — podmět vyjádřený."),
  P(2, "Zítra pojedeme k moři.", NEV, "přísudek je „pojedeme“; kdo pojede, je jen v koncovce", "Kdo pojede? My — podmět nevyjádřený."),
  P(2, "Pes i kočka spí na gauči.", NEK, "přísudek je „spí“ a spí dvě zvířata", "Kdo spí? Pes i kočka — podmět několikanásobný."),
  P(2, "Celou noc foukalo.", BEZ, "přísudek je „foukalo“ a nikdo ani nic nefoukalo", "Foukalo — věta bez podmětu."),
  P(2, "Po cestě běží malý pejsek.", VYJ, "přísudek je „běží“ a kdo běží, je ve větě", "Kdo běží? Pejsek — podmět vyjádřený."),
  P(2, "Uklidili jste si pokoj?", NEV, "přísudek je „uklidili jste“; kdo uklízel, je jen v koncovce", "Kdo uklízel? Vy — podmět nevyjádřený."),
  P(2, "Tomáš, Eva a Lukáš hrají fotbal.", NEK, "přísudek je „hrají“ a hrají tři děti", "Kdo hraje? Tomáš, Eva a Lukáš — podmět několikanásobný."),
  P(2, "Už se rozednívá.", BEZ, "přísudek je „rozednívá se“ a nikdo to nedělá", "Rozednívá se — věta bez podmětu."),
  P(2, "Nad lesem krouží dravý pták.", VYJ, "přísudek je „krouží“ a kdo krouží, je ve větě", "Kdo krouží? Pták — podmět vyjádřený."),

  P(3, "Maminka upekla koláč a pozvala sousedy.", VYJ, "přísudky jsou dva, ale oba dělá stejná osoba", "Kdo upekl a pozval? Maminka — jeden podmět ke dvěma přísudkům, podmět vyjádřený."),
  P(3, "Kdo to udělal?", VYJ, "přísudek je „udělal“ a na otázku kdo? odpovídá slovo přímo ve větě", "Podmětem je tázací zájmeno kdo — podmět je vyjádřený."),
  P(3, "To je pravda.", VYJ, "přísudek je „je pravda“ a co je pravda? — slovo „to“", "Podmětem je zájmeno to — podmět vyjádřený."),
  P(3, "Ty a já to zvládneme.", NEK, "přísudek je „zvládneme“ a zvládnou to dva lidé", "Kdo to zvládne? Ty a já — podmět několikanásobný ze zájmen."),
  P(3, "Bolí mě hlava.", VYJ, "přísudek je „bolí“; zeptej se, co bolí", "Co bolí? Hlava — podmět vyjádřený, stojí až za přísudkem; mě je předmět."),
  P(3, "Je mi zima.", BEZ, "přísudek je „je zima“ a nikdo ani nic to nedělá; mi je předmět", "Je mi zima — věta bez podmětu, mi je předmět."),
  P(3, "Na zahradě kvetou tulipány.", VYJ, "přísudek je „kvetou“ a co kvete, je ve větě", "Co kvete? Tulipány — podmět vyjádřený."),
  P(3, "Učí se na test.", NEV, "přísudek je „učí se“; kdo se učí, ve větě napsané není", "Kdo se učí? On nebo ona — podmět nevyjádřený."),
  P(3, "Mrzí mě to.", VYJ, "přísudek je „mrzí“; zeptej se, co mrzí", "Co mrzí? To — podmět vyjádřený zájmenem; mě je předmět."),
  P(3, "Pořád prší a fouká.", BEZ, "přísudky jsou dva, ale nikdo ani nic je nedělá", "Prší a fouká — věta bez podmětu."),
  P(3, "Kluci i holky tančili.", NEK, "přísudek je „tančili“ a tančily dvě skupiny", "Kdo tančil? Kluci i holky — podmět několikanásobný."),
  P(3, "Zase ses spletl.", NEV, "přísudek je „spletl ses“; kdo se spletl, je jen v tvaru slovesa", "Kdo se spletl? Ty — podmět nevyjádřený."),
  P(3, "Venku se ozval hrom.", VYJ, "přísudek je „ozval se“ a co se ozvalo, je ve větě", "Co se ozvalo? Hrom — podmět vyjádřený (hřmí by bylo bez podmětu)."),
];

function gen(level: number): PracticeTask[] {
  return urceni(BANKA, TYPY, level, (p) => ({
    question: `Jaký podmět má věta „${p.veta}“?`,
    hints: [
      `Najdi ve větě „${p.veta}“ nejdřív přísudek a zeptej se kdo nebo co?`,
      `Pomůže tohle: ${p.klic}.`,
    ],
  }));
}

export const PODMETVYJADRENYNEVYJADRENYNEKOLIKANASOBNY: TopicMetadata[] = [
  {
    id: "g5-cjl-jazykova-vychova-skladba-podmet-vyjadreny-nevyjadreny-nekolikanasobny",
    rvpNodeId: "g5-cjl-jazykova-vychova-skladba-podmet-vyjadreny-nevyjadreny-nekolikanasobny",
    title: "Podmět vyjádřený, nevyjádřený, několikanásobný",
    studentTitle: "Podmět věty",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Skladba",
    briefDescription: "Najdeš podmět věty, i když není napsaný.",
    keywords: ["podmět", "vyjádřený podmět", "nevyjádřený podmět", "několikanásobný podmět", "skladba"],
    goals: [
      "Najít podmět ve větě",
      "Rozlišit vyjádřený, nevyjádřený a několikanásobný podmět",
      "Určit rod nevyjádřeného podmětu z tvaru slovesa",
    ],
    boundaries: [
      "Neprobíráme složité větné vzorce",
      "Bez pokročilé syntaktické analýzy",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Najdi přísudek (sloveso) a zeptej se: KDO nebo CO to dělá? Odpověď je podmět. Pokud není napsáno, zkus si ho odvodit z koncovky slovesa.",
      steps: [
        "Najdi sloveso (přísudek) ve větě.",
        "Zeptej se: KDO nebo CO dělá to, co říká sloveso?",
        "Pokud odpověď není ve větě = nevyjádřený podmět (odvoď ho z koncovky).",
        "Pokud jsou odpovědi dvě nebo více = několikanásobný podmět.",
      ],
      commonMistake: "Žáci označí za podmět příslovečné určení nebo předmět. Podmět je vždy v 1. pádu (kdo? co?).",
      example: "'Čtu.' – podmět 'já' (nevyjádřený). 'Pavel a Lucie přišli.' – podmět 'Pavel a Lucie' (několikanásobný).",
    },
  },
];
