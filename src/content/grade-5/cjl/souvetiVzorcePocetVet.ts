import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { urceni, type Kategorie, type Polozka } from "../_urceni";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// zpětné vazby a mísily počítání vět s obecnými otázkami. Teď se ve větě
// počítají věty podle přísudků: L1 věta jednoduchá, nebo souvětí ze dvou vět
// · L2 souvětí ze dvou a tří vět · L3 zrádné případy — složený přísudek
// („chtěl jsem jít“) i několikanásobný podmět tvoří jen jednu větu.

const POCTY: Kategorie[] = [
  { nazev: "věta jednoduchá", znak: "má jen jeden přísudek (i když může být složený: chtěl jsem jít)." },
  { nazev: "souvětí ze dvou vět", znak: "má dva přísudky — každý přísudek je jedna věta." },
  { nazev: "souvětí ze tří vět", znak: "má tři přísudky." },
  { nazev: "souvětí ze čtyř vět", znak: "má čtyři přísudky." },
];

const V1 = "věta jednoduchá", V2 = "souvětí ze dvou vět", V3 = "souvětí ze tří vět", V4 = "souvětí ze čtyř vět";
const P = (uroven: 1 | 2 | 3, veta: string, kategorie: string, klic: string, proc: string): Polozka =>
  ({ uroven, slovo: veta, veta, kategorie, klic, proc });

const BANKA: Polozka[] = [
  P(1, "Pes štěká na zahradě.", V1, "jediné sloveso v určitém tvaru je „štěká“", "Přísudek je jen jeden (štěká) — věta jednoduchá."),
  P(1, "Pes štěká a kočka mňouká.", V2, "jeden přísudek je „štěká“; hledej, jestli je tam další", "Přísudky: štěká, mňouká — dvě věty, souvětí."),
  P(1, "Venku celý den prší.", V1, "jediný přísudek je „prší“", "Jeden přísudek — věta jednoduchá."),
  P(1, "Šel domů, protože byl unavený.", V2, "jeden přísudek je „šel“; spojka „protože“ uvádí další větu", "Přísudky: šel, byl unavený — souvětí ze dvou vět."),
  P(1, "Maminka vaří oběd.", V1, "jediný přísudek je „vaří“", "Jeden přísudek — věta jednoduchá."),
  P(1, "Zazvonil zvonek a děti vyběhly ven.", V2, "jeden přísudek je „zazvonil“; hledej další", "Přísudky: zazvonil, vyběhly — souvětí ze dvou vět."),
  P(1, "Na stromě sedí sýkorka.", V1, "jediný přísudek je „sedí“", "Jeden přísudek — věta jednoduchá."),
  P(1, "Vím, že přijdeš.", V2, "jeden přísudek je „vím“; spojka „že“ uvádí další větu", "Přísudky: vím, přijdeš — souvětí ze dvou vět."),
  P(1, "Honza čte zajímavou knihu.", V1, "jediný přísudek je „čte“", "Jeden přísudek — věta jednoduchá."),
  P(1, "Chtěl jít ven, ale pršelo.", V2, "jeden přísudek je „chtěl jít“; za čárkou je další", "Přísudky: chtěl jít, pršelo — souvětí ze dvou vět."),
  P(1, "Sluníčko svítí.", V1, "jediný přísudek je „svítí“", "Jeden přísudek — věta jednoduchá."),
  P(1, "Když přijdu domů, udělám si čaj.", V2, "jeden přísudek je „přijdu“; spojka „když“ uvádí větu", "Přísudky: přijdu, udělám — souvětí ze dvou vět."),
  P(1, "Kočka spí na okně.", V1, "jediný přísudek je „spí“", "Jeden přísudek — věta jednoduchá."),

  P(2, "Přišel domů, najedl se a šel spát.", V3, "první přísudek je „přišel“; hledej další slovesa v určitém tvaru", "Přísudky: přišel, najedl se, šel spát — souvětí ze tří vět."),
  P(2, "Nevím, kdo to udělal.", V2, "první přísudek je „nevím“; slovo „kdo“ uvádí další větu", "Přísudky: nevím, udělal — souvětí ze dvou vět."),
  P(2, "Když jsme dorazili, všichni už seděli u stolu a jedli.", V3, "první přísudek je „jsme dorazili“; spočítej i ty za čárkou", "Přísudky: jsme dorazili, seděli, jedli — souvětí ze tří vět."),
  P(2, "Babička pekla koláče a dědeček štípal dříví.", V2, "první přísudek je „pekla“; za spojkou a je další", "Přísudky: pekla, štípal — souvětí ze dvou vět."),
  P(2, "Učitelka řekla, že zítra půjdeme do divadla.", V2, "první přísudek je „řekla“; spojka „že“ uvádí další větu", "Přísudky: řekla, půjdeme — souvětí ze dvou vět."),
  P(2, "Ráno jsem vstal, umyl se a nasnídal se.", V3, "první přísudek je „jsem vstal“; hledej další", "Přísudky: vstal, umyl se, nasnídal se — souvětí ze tří vět."),
  P(2, "Pokud bude hezky, pojedeme na výlet.", V2, "první přísudek je „bude hezky“; za čárkou je další", "Přísudky: bude, pojedeme — souvětí ze dvou vět."),
  P(2, "Pes zaštěkal, kočka utekla a ptáci vzlétli.", V3, "první přísudek je „zaštěkal“; hledej další", "Přísudky: zaštěkal, utekla, vzlétli — souvětí ze tří vět."),
  P(2, "Ptal se, jestli nepotřebujeme pomoct.", V2, "první přísudek je „ptal se“; slovo „jestli“ uvádí další větu", "Přísudky: ptal se, nepotřebujeme pomoct — souvětí ze dvou vět."),
  P(2, "Otevřel okno, protože bylo horko a v pokoji se nedalo dýchat.", V3, "první přísudek je „otevřel“; počítej i ty za spojkami", "Přísudky: otevřel, bylo, nedalo se dýchat — souvětí ze tří vět."),
  P(2, "Dívali jsme se na film, který natočil můj strýc.", V2, "první přísudek je „dívali jsme se“; slovo „který“ uvádí další větu", "Přísudky: dívali jsme se, natočil — souvětí ze dvou vět."),
  P(2, "Zavolal kamarádovi, domluvili se a vyrazili na kola.", V3, "první přísudek je „zavolal“; hledej další", "Přísudky: zavolal, domluvili se, vyrazili — souvětí ze tří vět."),
  P(2, "Jana zpívá ve sboru a Pavel hraje na kytaru.", V2, "první přísudek je „zpívá“; za spojkou je další", "Přísudky: zpívá, hraje — souvětí ze dvou vět."),

  P(3, "Chtěl jsem jít na výlet.", V1, "„chtěl jsem jít“ je jeden složený přísudek", "Chtěl jsem jít je jediný přísudek (složený) — věta jednoduchá."),
  P(3, "Petr a Pavel přišli pozdě.", V1, "přísudek je jen „přišli“; dva jsou podměty", "Petr a Pavel jsou dva podměty, ale přísudek je jeden — věta jednoduchá."),
  P(3, "Přišel, viděl, zvítězil.", V3, "první přísudek je „přišel“; každé sloveso za čárkou počítej zvlášť", "Přísudky: přišel, viděl, zvítězil — souvětí ze tří vět."),
  P(3, "Musíme se učit, protože zítra píšeme test.", V2, "„musíme se učit“ je jeden složený přísudek; hledej další", "Přísudky: musíme se učit, píšeme — souvětí ze dvou vět."),
  P(3, "Když přijdeš, řeknu ti, co se stalo, a ukážu ti fotky.", V4, "první přísudek je „přijdeš“; spočítej všechny, i ty v kratších větách", "Přísudky: přijdeš, řeknu, stalo se, ukážu — souvětí ze čtyř vět."),
  P(3, "Umím plavat a jezdit na kole.", V1, "přísudek je „umím plavat a jezdit“ — jeden, jen s dvěma neurčitky", "Umím plavat a jezdit — jeden přísudek s několikanásobným neurčitkem; věta jednoduchá."),
  P(3, "Nevěděl, co má dělat, a tak zavolal mamince.", V3, "první přísudek je „nevěděl“; hledej další", "Přísudky: nevěděl, má dělat, zavolal — souvětí ze tří vět."),
  P(3, "Po obědě jsme si chtěli jít zahrát fotbal.", V1, "„chtěli jsme si jít zahrát“ tvoří jeden přísudek", "Jediný přísudek — věta jednoduchá."),
  P(3, "Když se setmělo, rozsvítili jsme lampu, sedli si a četli jsme si.", V4, "první přísudek je „setmělo se“; počítej pozorně až do konce", "Přísudky: setmělo se, rozsvítili jsme, sedli si, četli jsme si — souvětí ze čtyř vět."),
  P(3, "Tatínek i maminka dnes pracují dlouho.", V1, "přísudek je jen „pracují“", "Dva podměty, jeden přísudek — věta jednoduchá."),
  P(3, "Řekl mi, že přijde, ale nepřišel.", V3, "první přísudek je „řekl“; hledej další", "Přísudky: řekl, přijde, nepřišel — souvětí ze tří vět."),
  P(3, "Myslím, že když se budeme snažit, vyhrajeme a postoupíme.", V4, "první přísudek je „myslím“; počítej i v kratších větách uprostřed", "Přísudky: myslím, budeme se snažit, vyhrajeme, postoupíme — souvětí ze čtyř vět."),
  P(3, "Bez přestání pršelo a foukalo.", V2, "první přísudek je „pršelo“; za spojkou a je další", "Přísudky: pršelo, foukalo — souvětí ze dvou vět (dvě věty bez podmětu)."),
];

function gen(level: number): PracticeTask[] {
  return urceni(BANKA, POCTY, level, (p) => ({
    question: `Kolik vět má „${p.veta}“?`,
    hints: [
      `Najdi v „${p.veta}“ přísudky — slovesa v určitém tvaru. Kolik jich je?`,
      `Pomůže tohle: ${p.klic}.`,
    ],
  }));
}

export const SOUVETIVZORCEPOCETVET: TopicMetadata[] = [
  {
    id: "g5-cjl-jazykova-vychova-skladba-souveti-vzorce-pocet-vet",
    rvpNodeId: "g5-cjl-jazykova-vychova-skladba-souveti-vzorce-pocet-vet",
    title: "Souvětí – vzorce, počet vět",
    studentTitle: "Souvětí",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Skladba",
    briefDescription: "Poznáš souvětí a spočítáš věty v souvětí.",
    keywords: ["souvětí", "souřadící", "podřadící", "spojky", "věty"],
    goals: [
      "Poznat souvětí a spočítat věty v něm",
      "Rozlišit souřadící a podřadící souvětí",
      "Určit typ spojky v souvětí",
    ],
    boundaries: [
      "Neprobíráme podrobný rozbor všech typů vedlejších vět",
      "Bez složité grafické analýzy",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Souvětí = dvě nebo více vět. Souřadící spojky (a, ale, nebo) – věty jsou si rovnocenné. Podřadící spojky (že, protože, když) – jedna věta závisí na druhé.",
      steps: [
        "Najdi přísudky (slovesa v určitém tvaru) – kolik přísudků, tolik vět; neurčitek (jít, plavat) samostatnou větu netvoří.",
        "Najdi spojku – souřadící nebo podřadící?",
        "Souřadící → obě věty rovnocenné. Podřadící → jedna závisí na druhé.",
      ],
      commonMistake: "Žáci počítají čárky místo sloves. Čárka nerovná se věta – záleží na slovesech.",
      example: "Šel domů, protože byl unavený. = 2 věty (šel + byl). Spojka protože = podřadící.",
    },
  },
];
