import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { shuffle, urcovaci, type Kategorie } from "../_shared";

// Přepsáno 2026-09-11 (audit 3. ročníku). Úrovně byly překrývající se výřezy
// jednoho seznamu a všechny úlohy měly stejnou nápovědu, která u podstatných
// jmen prozrazovala odpověď. Teď tři oddělené banky:
// L1 podstatné jméno, přídavné jméno, sloveso · L2 zájmeno, číslovka,
// příslovce, předložka, spojka · L3 částice, citoslovce a slova, která mění
// druh podle věty („večer" jako kdy × jako část dne).

const DRUHY: Kategorie[] = [
  { nazev: "podstatné jméno", znak: "pojmenovává osoby, zvířata, věci a místa (kdo? co?)." },
  { nazev: "přídavné jméno", znak: "říká, jaká je osoba nebo věc (jaký? který?)." },
  { nazev: "zájmeno", znak: "zastupuje podstatné jméno (já, ty, on, můj…)." },
  { nazev: "číslovka", znak: "vyjadřuje počet nebo pořadí (kolik? kolikátý?)." },
  { nazev: "sloveso", znak: "vyjadřuje, co kdo dělá nebo co se děje." },
  { nazev: "příslovce", znak: "říká, jak, kde nebo kdy se něco děje." },
  { nazev: "předložka", znak: "stojí před podstatným jménem nebo zájmenem (v, na, s, do…)." },
  { nazev: "spojka", znak: "spojuje slova nebo věty (a, ale, protože…)." },
  { nazev: "částice", znak: "uvozuje větu a vyjadřuje přání nebo postoj (ať, kéž)." },
  { nazev: "citoslovce", znak: "vyjadřuje pocit nebo napodobuje zvuk (ach, bum, haf)." },
];
const PJ = "podstatné jméno", PR = "přídavné jméno", ZA = "zájmeno", CI = "číslovka", SL = "sloveso",
  PS = "příslovce", PD = "předložka", SP = "spojka", CA = "částice", CT = "citoslovce";

interface Slovo { slovo: string; veta: string; druh: string; klic: string; proc: string; prednost?: string[] }
const S = (slovo: string, veta: string, druh: string, klic: string, proc: string, prednost?: string[]): Slovo => ({ slovo, veta, druh, klic, proc, prednost });

const L1: Slovo[] = [
  S("pes", "Pes štěká na pošťáka.", PJ, "slovo pojmenovává zvíře, ptáme se kdo? co?", "„Pes“ pojmenovává zvíře — podstatné jméno."),
  S("červené", "Na stole leží červené jablko.", PR, "slovo říká, jaké je jablko", "„Červené“ říká, jaké jablko je — přídavné jméno."),
  S("skáče", "Veverka skáče po větvích.", SL, "slovo říká, co veverka dělá", "„Skáče“ je děj — sloveso."),
  S("babička", "Babička peče buchty.", PJ, "slovo pojmenovává osobu", "„Babička“ pojmenovává osobu — podstatné jméno."),
  S("malý", "Malý kluk se směje.", PR, "slovo říká, jaký je kluk", "„Malý“ říká, jaký je kluk — přídavné jméno."),
  S("čte", "Tomáš čte pohádku.", SL, "slovo říká, co Tomáš dělá", "„Čte“ je děj — sloveso."),
  S("slunce", "Ráno vyšlo slunce.", PJ, "slovo pojmenovává věc na obloze", "„Slunce“ pojmenovává věc — podstatné jméno."),
  S("teplý", "Pijeme teplý čaj.", PR, "slovo říká, jaký je čaj", "„Teplý“ říká, jaký je čaj — přídavné jméno."),
  S("spí", "Kočka spí na gauči.", SL, "slovo říká, co kočka dělá", "„Spí“ je děj — sloveso."),
  S("kolo", "Nové kolo stojí v garáži.", PJ, "slovo pojmenovává věc", "„Kolo“ pojmenovává věc — podstatné jméno."),
  S("veselá", "Veselá písnička zněla třídou.", PR, "slovo říká, jaká je písnička", "„Veselá“ říká, jaká je písnička — přídavné jméno."),
  S("plave", "Ryba plave v rybníku.", SL, "slovo říká, co ryba dělá", "„Plave“ je děj — sloveso."),
  S("škola", "Škola začíná v osm.", PJ, "slovo pojmenovává místo, kam chodíš", "„Škola“ pojmenovává místo — podstatné jméno."),
].map((s) => ({ ...s, prednost: [PJ, PR, SL, PS] }));

const L2: Slovo[] = [
  S("on", "On jde domů.", ZA, "slovo stojí místo jména kluka", "„On“ zastupuje jméno — zájmeno.", [PJ, PS]),
  S("pět", "Mám pět jablek.", CI, "slovo udává, kolik jablek mám", "„Pět“ vyjadřuje počet — číslovka.", [PR, PS]),
  S("rychle", "Pes běží rychle.", PS, "slovo říká, jak pes běží", "„Rychle“ říká, jak se něco děje — příslovce.", [PR, SL]),
  S("v", "Sedím v parku.", PD, "slovo stojí před slovem park a patří k němu", "„V“ stojí před podstatným jménem — předložka.", [SP, PS]),
  S("a", "Jana a Petr přišli.", SP, "slovo spojuje dvě jména", "„A“ spojuje slova — spojka.", [PD, CA]),
  S("my", "My jedeme k moři.", ZA, "slovo stojí místo jmen několika lidí", "„My“ zastupuje jména — zájmeno.", [PJ, CI]),
  S("třetí", "Jsem třetí v řadě.", CI, "slovo udává pořadí", "„Třetí“ vyjadřuje pořadí — číslovka.", [PR, PS]),
  S("venku", "Děti si hrají venku.", PS, "slovo říká, kde si děti hrají", "„Venku“ říká kde — příslovce.", [PJ, PD]),
  S("na", "Kniha leží na stole.", PD, "slovo stojí před slovem stůl a patří k němu", "„Na“ stojí před podstatným jménem — předložka.", [SP, PS]),
  S("ale", "Chtěl jsem jít ven, ale pršelo.", SP, "slovo spojuje dvě věty", "„Ale“ spojuje věty — spojka.", [PD, PS]),
  S("dva", "Na stromě sedí dva ptáci.", CI, "slovo udává, kolik je ptáků", "„Dva“ vyjadřuje počet — číslovka.", [PR, ZA]),
  S("zítra", "Zítra pojedeme na výlet.", PS, "slovo říká, kdy pojedeme", "„Zítra“ říká kdy — příslovce.", [PJ, CI]),
  S("ona", "Ona má ráda koně.", ZA, "slovo stojí místo jména dívky", "„Ona“ zastupuje jméno — zájmeno.", [PJ, CA]),
];

const L3: Slovo[] = [
  S("ach", "Ach, to je krásné!", CT, "slovo vyjadřuje obdiv, žádnou věc nepojmenovává", "„Ach“ vyjadřuje pocit — citoslovce.", [CA, SP]),
  S("ať", "Ať už jsi doma!", CA, "slovo uvozuje větu a vyjadřuje přání", "„Ať“ vyjadřuje přání mluvčího — částice.", [SP, CT]),
  S("bum", "Bum! Spadla kniha.", CT, "slovo napodobuje zvuk pádu", "„Bum“ napodobuje zvuk — citoslovce.", [CA, PS]),
  S("kéž", "Kéž by už byly prázdniny!", CA, "slovo uvozuje větu a vyjadřuje přání", "„Kéž“ vyjadřuje přání — částice.", [CT, SP]),
  S("haf", "Pes udělal haf a utekl.", CT, "slovo napodobuje zvuk psa", "„Haf“ napodobuje zvuk — citoslovce.", [PJ, CA]),
  S("večer", "Večer bylo chladno.", PS, "slovo tu odpovídá na otázku kdy?", "„Večer“ tu říká, kdy bylo chladno — příslovce.", [PJ, PR]),
  S("večer", "Ten večer byl krásný.", PJ, "slovo tu pojmenovává část dne a stojí před ním „ten“", "„Ten večer“ — tady slovo pojmenovává část dne, je to podstatné jméno.", [PS, PR]),
  S("jeho", "Jeho pes je hnědý.", ZA, "slovo říká, čí je pes, a stojí místo jména", "„Jeho“ zastupuje jméno majitele — zájmeno.", [PR, CI]),
  S("jednu", "Máme dva psy a jednu kočku.", CI, "slovo udává, kolik je koček", "„Jednu“ vyjadřuje počet — číslovka.", [ZA, PR]),
  S("s", "Šel jsem ven s kamarádem.", PD, "slovo stojí před slovem kamarád a patří k němu", "„S“ stojí před podstatným jménem — předložka.", [SP, CA]),
  S("protože", "Zůstal doma, protože byl nemocný.", SP, "slovo spojuje dvě věty a říká proč", "„Protože“ spojuje věty — spojka.", [PS, CA]),
  S("vesele", "Děti se vesele smály.", PS, "slovo říká, jak se děti smály", "„Vesele“ říká jak — příslovce (přídavné jméno by bylo veselý).", [PR, SL]),
  S("hop", "Hop a skočil do vody!", CT, "slovo napodobuje skok, nic nepojmenovává", "„Hop“ napodobuje pohyb — citoslovce.", [SL, CA]),
];

function uloha(s: Slovo): PracticeTask {
  return urcovaci(`Jaký slovní druh je slovo „${s.slovo}“ ve větě „${s.veta}“?`, s.druh, DRUHY, {
    hints: [
      `Na jakou otázku odpovídá slovo „${s.slovo}“ ve větě „${s.veta}“?`,
      `Pomůže tohle: ${s.klic}. Ke každému slovnímu druhu patří jiná otázka — kdo? co?, jaký?, co dělá?, kolik?, jak? kde? kdy?`,
    ],
    explanation: s.proc,
  }, s.prednost);
}

function gen(level: number): PracticeTask[] {
  return shuffle(level === 1 ? L1 : level === 2 ? L2 : L3).map(uloha);
}

export const SLOVNIDRUHY: TopicMetadata[] = [
  {
    id: "g3-cjl-slovni-druhy",
    rvpNodeId: "g3-cjl-jazykova-vychova-tvaroslovi-slovni-druhy-prehled-deseti-slovnich-druhu",
    title: "Slovní druhy - přehled deseti slovních druhů",
    studentTitle: "Druhy slov",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Tvarosloví",
    briefDescription: "Poznáš a určíš všech deset druhů slov ve větě.",
    keywords: ["slovní druhy", "podstatné jméno", "přídavné jméno", "sloveso", "příslovce", "zájmeno", "číslovka"],
    goals: ["Vyjmenovat deset slovních druhů.", "Určit slovní druh podtrženého slova ve větě.", "Uvést příklady každého slovního druhu."],
    boundaries: ["Základní přehled, bez podrobnějšího dělení."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "10 druhů: podst. jm., příd. jm., sloveso, příslovce, zájmeno, číslovka, předložka, spojka, částice, citoslovce.",
      steps: ["Najdi slovo ve větě.", "Zeptej se: Kdo/co? (podst.), Jaký? (příd.), Co dělá? (slov.), Jak/kde/kdy? (přísl.).", "Nahrazuje jméno? → zájmeno. Počet? → číslovka. Před jménem? → předložka."],
      commonMistake: "'rychle' je příslovce (jak?), ne přídavné jméno (jaký?).",
      example: "Velký pes rychle běží. → velký (příd. jm.) | pes (podst. jm.) | rychle (přísl.) | běží (sloveso).",
    },
  },
];
