import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { urceni, type Kategorie, type Polozka } from "../_urceni";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// zpětné vazby k chybným možnostem a slova se určovala bez věty, i když
// o slovním druhu často rozhoduje právě věta. Teď se každé slovo určuje ve větě:
// L1 jasné případy · L2 neohebná slova a slova ve větách · L3 stejné slovo
// jako různý slovní druh („ráno“, „kolem“) a další zrádné případy.

const DRUHY: Kategorie[] = [
  { nazev: "podstatné jméno", znak: "název osoby, zvířete, věci, vlastnosti nebo děje; ptáme se kdo? co? (pes, radost)." },
  { nazev: "přídavné jméno", znak: "vyjadřuje vlastnost nebo příslušnost; ptáme se jaký? čí? (krásný, otcův)." },
  { nazev: "zájmeno", znak: "zastupuje podstatné nebo přídavné jméno (já, on, můj, ten, něco)." },
  { nazev: "číslovka", znak: "vyjadřuje počet nebo pořadí; ptáme se kolik? kolikátý? (pět, třetí, mnoho)." },
  { nazev: "sloveso", znak: "vyjadřuje činnost nebo stav; ptáme se co dělá? (běží, spí)." },
  { nazev: "příslovce", znak: "neohebné slovo, které říká jak, kde, kdy nebo kudy (rychle, doma, ráno)." },
  { nazev: "předložka", znak: "neohebné slovo před podstatným jménem nebo zájmenem, které určuje jeho pád (na, do, bez)." },
  { nazev: "spojka", znak: "neohebné slovo, které spojuje slova nebo věty (a, ale, protože, že)." },
  { nazev: "částice", znak: "neohebné slovo, obvykle na začátku věty, které vyjadřuje přání nebo postoj (ať, kéž, prý)." },
  { nazev: "citoslovce", znak: "vyjadřuje pocit nebo napodobuje zvuk (ach, haf, bum)." },
];

const P = (uroven: 1 | 2 | 3, slovo: string, veta: string, kategorie: string, klic: string, proc: string): Polozka =>
  ({ uroven, slovo, veta, kategorie, klic, proc });

const BANKA: Polozka[] = [
  P(1, "pes", "Pes štěká na zahradě.", "podstatné jméno", "je název zvířete a dá se říct jeden pes, dva psi", "Pes je název zvířete — podstatné jméno (kdo štěká? pes)."),
  P(1, "krásný", "Byl to krásný den.", "přídavné jméno", "říká, jaký byl den", "Krásný vyjadřuje vlastnost dne (jaký den?) — přídavné jméno."),
  P(1, "běží", "Honza běží do školy.", "sloveso", "říká, co Honza dělá", "Běží vyjadřuje činnost (co dělá?) — sloveso."),
  P(1, "pět", "Mám pět jablek.", "číslovka", "říká, kolik mám jablek", "Pět vyjadřuje počet (kolik?) — číslovka."),
  P(1, "my", "My půjdeme do kina.", "zájmeno", "zastupuje jména lidí, kteří půjdou", "My zastupuje jména osob — zájmeno."),
  P(1, "rychle", "Auto jelo rychle.", "příslovce", "říká, jak auto jelo, a jeho tvar se nemění", "Rychle říká, jak auto jelo, a neohýbá se — příslovce."),
  P(1, "na", "Kniha leží na stole.", "předložka", "stojí před slovem „stole“ a samo se nemění", "Na stojí před podstatným jménem a určuje jeho pád — předložka."),
  P(1, "a", "Petr a Jana si hrají.", "spojka", "spojuje dvě jména", "A spojuje dvě slova — spojka."),
  P(1, "haf", "Pes udělal haf.", "citoslovce", "napodobuje zvuk psa", "Haf napodobuje zvuk — citoslovce."),
  P(1, "ať", "Ať se ti daří!", "částice", "uvozuje větu s přáním", "Ať uvozuje přací větu — částice."),
  P(1, "zelený", "Na stromě visí zelený list.", "přídavné jméno", "říká, jaký je list", "Zelený vyjadřuje vlastnost listu — přídavné jméno."),
  P(1, "spí", "Kočka spí na gauči.", "sloveso", "říká, co kočka dělá", "Spí vyjadřuje stav (co dělá?) — sloveso."),
  P(1, "ty", "Ty jsi můj kamarád.", "zájmeno", "zastupuje jméno toho, s kým mluvím", "Ty zastupuje jméno osoby — zájmeno."),

  P(2, "včera", "Včera celý den pršelo.", "příslovce", "říká, kdy pršelo, a nedá se ohýbat", "Včera říká kdy, neohýbá se — příslovce."),
  P(2, "protože", "Nešel ven, protože pršelo.", "spojka", "spojuje dvě věty a vysvětluje důvod", "Protože spojuje dvě věty — spojka."),
  P(2, "radost", "Z dárku měl velkou radost.", "podstatné jméno", "je název pocitu; ptáš se, co měl", "Radost je název pocitu (co měl?) — podstatné jméno."),
  P(2, "třetí", "V závodě doběhl třetí.", "číslovka", "říká, kolikátý doběhl", "Třetí vyjadřuje pořadí (kolikátý?) — číslovka."),
  P(2, "jeho", "To je jeho kolo.", "zájmeno", "zastupuje jméno majitele kola", "Jeho zastupuje jméno majitele — zájmeno."),
  P(2, "prý", "Prý bude zítra pršet.", "částice", "vyjadřuje, že to tvrdí někdo jiný", "Prý vyjadřuje, že jde o cizí tvrzení — částice."),
  P(2, "ach", "Ach, to je krása!", "citoslovce", "vyjadřuje obdiv", "Ach vyjadřuje pocit — citoslovce."),
  P(2, "bez", "Odešel bez čepice.", "předložka", "stojí před slovem „čepice“ a určuje jeho pád", "Bez stojí před podstatným jménem ve 2. pádě — předložka."),
  P(2, "ale", "Chtěl jít ven, ale pršelo.", "spojka", "spojuje dvě věty s protikladem", "Ale spojuje dvě věty — spojka."),
  P(2, "doma", "Celou neděli zůstal doma.", "příslovce", "říká, kde zůstal", "Doma říká kde, neohýbá se — příslovce."),
  P(2, "otcův", "Na věšáku visí otcův klobouk.", "přídavné jméno", "říká, čí je klobouk", "Otcův říká čí — přivlastňovací přídavné jméno."),
  P(2, "přemýšlel", "Dlouho o tom přemýšlel.", "sloveso", "říká, co dělal", "Přemýšlel vyjadřuje činnost — sloveso."),
  P(2, "dvanáct", "Ve třídě je dvanáct dívek.", "číslovka", "říká, kolik je dívek", "Dvanáct vyjadřuje počet — číslovka."),

  P(3, "ráno", "Vstal brzy ráno.", "příslovce", "tady říká, kdy vstal, a nedá se ohýbat", "Ve větě „Vstal brzy ráno.“ říká ráno kdy — je to příslovce."),
  P(3, "ráno", "Ráno bylo mrazivé.", "podstatné jméno", "tady je název části dne; ptáš se, co bylo mrazivé", "Ve větě „Ráno bylo mrazivé.“ je ráno podmět (co bylo mrazivé?) — podstatné jméno."),
  P(3, "kolem", "Šel kolem domu.", "předložka", "stojí před slovem „domu“ a určuje jeho pád", "Kolem stojí před podstatným jménem ve 2. pádě — tady je to předložka."),
  P(3, "kolem", "Auto projelo kolem.", "příslovce", "stojí samo bez podstatného jména a říká kudy", "Kolem tu stojí samo a říká kudy — je to příslovce."),
  P(3, "že", "Vím, že přijdeš.", "spojka", "spojuje dvě věty", "Že spojuje větu hlavní a vedlejší — spojka."),
  P(3, "kéž", "Kéž by už byly prázdniny!", "částice", "uvozuje větu s přáním", "Kéž uvozuje přací větu — částice."),
  P(3, "mnoho", "Na krmítku bylo mnoho ptáků.", "číslovka", "říká, kolik bylo ptáků, i když ne přesně", "Mnoho vyjadřuje neurčitý počet — číslovka neurčitá."),
  P(3, "psí", "Na dvoře stojí psí bouda.", "přídavné jméno", "říká, jaká je bouda", "Psí vyjadřuje vlastnost (jaká bouda?) — přídavné jméno."),
  P(3, "bum", "Bum! Spadla kniha.", "citoslovce", "napodobuje zvuk pádu", "Bum napodobuje zvuk — citoslovce."),
  P(3, "něco", "Chci ti něco říct.", "zájmeno", "zastupuje věc, kterou ještě neznáme", "Něco zastupuje neznámou věc — zájmeno neurčité."),
  P(3, "dobře", "Test napsal dobře.", "příslovce", "říká, jak test napsal", "Dobře říká jak, neohýbá se — příslovce."),
  P(3, "zelená", "Zelená je moje oblíbená barva.", "podstatné jméno", "je tu název barvy a stojí na místě podmětu", "Zelená je tu název barvy (co je oblíbená barva?) — podstatné jméno, i když se podobá přídavnému."),
  P(3, "před", "Čekal před školou.", "předložka", "stojí před slovem „školou“ a určuje jeho pád", "Před stojí před podstatným jménem v 7. pádě — předložka."),
];

function gen(level: number): PracticeTask[] {
  return urceni(BANKA, DRUHY, level, (p) => ({
    question: `Jaký slovní druh je slovo „${p.slovo}“ ve větě „${p.veta}“?`,
    hints: [
      `Jakou otázku si můžeš položit na slovo „${p.slovo}“ ve větě „${p.veta}“?`,
      `Pomůže tohle: slovo „${p.slovo}“ ${p.klic}.`,
    ],
  }));
}

export const SLOVNIDRUHYURCOVANIVSECHDESETIOHEBNEANEOHEBNE: TopicMetadata[] = [
  {
    id: "g5-cjl-jazykova-vychova-tvaroslovi-slovni-druhy-urcovani-vsech-deseti-ohebne-a-neohebne",
    rvpNodeId: "g5-cjl-jazykova-vychova-tvaroslovi-slovni-druhy-urcovani-vsech-deseti-ohebne-a-neohebne",
    title: "Slovní druhy – určování všech deseti, ohebné a neohebné",
    studentTitle: "Deset slovních druhů",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Tvarosloví",
    briefDescription: "Určíš slovní druh každého slova ve větě.",
    keywords: ["slovní druhy", "ohebné", "neohebné", "podstatné jméno", "přídavné jméno", "sloveso", "příslovce", "zájmeno", "číslovka"],
    goals: [
      "Správně určit slovní druh slova ve větě",
      "Rozlišit ohebné a neohebné slovní druhy",
      "Uvést příklady všech 10 slovních druhů",
    ],
    boundaries: [
      "Bez pokročilé morfologické analýzy",
      "Neprobíráme přechodníky podrobně",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Deset slovních druhů: 1. podstatné jméno, 2. přídavné jméno, 3. zájmeno, 4. číslovka, 5. sloveso, 6. příslovce, 7. předložka, 8. spojka, 9. částice, 10. citoslovce.",
      steps: [
        "Přečti slovo v kontextu věty.",
        "Zeptej se: označuje věc/osobu? → podstatné jméno.",
        "Vyjadřuje vlastnost? → přídavné jméno.",
        "Je to děj? → sloveso. Upřesňuje děj? → příslovce.",
        "Zastupuje jméno? → zájmeno. Vyjadřuje počet? → číslovka.",
      ],
      commonMistake: "Žáci si pletou přídavná jména a příslovce. Přídavné jméno určuje podstatné jméno, příslovce určuje sloveso.",
      example: "'Šel rychle.' – rychle = příslovce (určuje sloveso šel). 'Byl rychlý.' – rychlý = přídavné jméno (určuje podstatné jméno).",
    },
  },
];
