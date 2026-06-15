/**
 * Dějepis 6. ročník — Doba kamenná a periodizace pravěku (chronologie).
 *
 * FAKTICKÝ vzor typu drag_order (žák seřazuje na časové ose). Druhý ověřovaný
 * typ pilotu po select_one (periodizace/letopočet). Demonstruje, že chybový model
 * 2. stupně platí i pro řazení — kvalita leží v JEDNOZNAČNÉ chronologii a ve
 * vysvětlení PROČ to pořadí (materiál nástrojů: kámen → bronz → železo; obživa:
 * lov → zemědělství; národy u nás: Keltové → Germáni → Slované).
 *
 * Reálná gradace přes POČET položek a jemnost rozlišení:
 *  • L1 — 3 zřetelné epochy (kámen/bronz/železo, lov/zemědělství).
 *  • L2 — 4 epochy (přidává návaznost a kulturu, např. únětickou).
 *  • L3 — 5 položek včetně mezolitu a národů na našem území.
 * Znění otázek L1 a L3 je záměrně disjunktní (check difficulty_progression
 * porovnává texty otázek): L1 mluví o „třech", L3 o „pěti / celé časové ose".
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pickN, buildOrderTask as order } from "./_shared";

// ── Poolu úloh po úrovních ──────────────────────────────────────────────────
// Položky jsou vždy ve SPRÁVNÉM pořadí (od nejstaršího po nejnovější).

const L1: PracticeTask[] = [
  order(
    "Seřaď tři úseky doby kamenné od nejstaršího po nejnovější.",
    ["Paleolit – starší doba kamenná", "Mezolit – střední doba kamenná", "Neolit – mladší doba kamenná"],
    {
      hints: ["Názvy říkají pořadí: starší → střední → mladší doba kamenná.", "Paleolit (starší) je vždy první a trval nejdéle."],
      explanation: "Doba kamenná se dělí na tři úseky podle stáří: paleolit (starší) trval statisíce let, mezolit (střední) je krátký přechod po době ledové a neolit (mladší) přinesl zemědělství.",
    },
  ),
  order(
    "Seřaď tři pravěké epochy podle materiálu nástrojů, od nejstarší.",
    ["Doba kamenná", "Doba bronzová", "Doba železná"],
    {
      hints: ["Epochy se jmenují podle materiálu nástrojů.", "Kámen lidé používali dávno před kovy."],
      explanation: "Epochy pravěku se jmenují podle materiálu nástrojů: nejdřív kámen, pak bronz (slitina mědi a cínu) a nakonec železo — každý další materiál byl tvrdší a lidé ho museli umět zpracovat.",
    },
  ),
  order(
    "Co bylo dřív? Seřaď tři způsoby života od nejstaršího.",
    ["Lovci a sběrači (paleolit)", "První zemědělci (neolit)", "Kovolitci a obchodníci (doba bronzová)"],
    {
      hints: ["Přemýšlej, jak se měnila obživa: nejdřív lov.", "Zemědělství přišlo dávno před zpracováním kovů."],
      explanation: "Nejstarší lidé se živili lovem a sběrem (paleolit). V neolitu přišla zemědělská revoluce — lidé se usadili. Teprve potom, v době bronzové, se rozvinulo zpracování kovů a obchod.",
    },
  ),
  order(
    "Seřaď tři pravěké epochy od nejstarší po nejnovější.",
    ["Starší doba kamenná", "Mladší doba kamenná", "Doba bronzová"],
    {
      hints: ["Starší doba kamenná byla před mladší.", "Bronz je kov — přišel až po době kamenné."],
      explanation: "Starší doba kamenná (paleolit) je nejstarší, mladší doba kamenná (neolit) přinesla zemědělství a doba bronzová pak první kovové nástroje.",
    },
  ),
];

const L2: PracticeTask[] = [
  order(
    "Seřaď čtyři pravěké epochy od nejstarší po nejnovější.",
    ["Paleolit – lovci mamutů", "Neolit – první zemědělci", "Doba bronzová – únětická kultura", "Doba železná – Keltové"],
    {
      hints: ["Lov mamutů patří do nejstaršího paleolitu.", "Keltové ovládli železo — to bylo až nakonec."],
      explanation: "Lovci mamutů žili v paleolitu (době ledové). Neolit přinesl zemědělství. V době bronzové vznikla u nás únětická kultura. Keltové v době železné stavěli oppida; podle jejich kmene Bójů se země později začala nazývat Bohemia.",
    },
  ),
  order(
    "Seřaď čtyři období podle vývoje nástrojů, od nejstaršího.",
    ["Štípaný kámen (paleolit)", "Broušený kámen (neolit)", "Bronz – měď a cín", "Železo – Keltové"],
    {
      hints: ["Kámen se zpracovával dřív než kovy.", "Železo je tvrdší než bronz — přišlo později."],
      explanation: "Nástroje ukazují pokrok: v paleolitu lidé kámen jen štípali, v neolitu ho už brousili, pak přišel bronz (slitina mědi a cínu) a nakonec železo, které ovládli Keltové.",
    },
  ),
  order(
    "Seřaď čtyři úseky doby kamenné a kovů od nejstaršího.",
    ["Paleolit", "Mezolit", "Neolit", "Doba bronzová"],
    {
      hints: ["Doba kamenná má tři části: starší, střední, mladší.", "Bronz přišel až po celé době kamenné."],
      explanation: "Doba kamenná postupuje paleolit → mezolit → neolit (starší, střední, mladší), teprve po ní následuje doba bronzová s prvními kovovými nástroji.",
    },
  ),
  order(
    "Seřaď čtyři mezníky pravěku od nejstaršího po nejnovější.",
    ["Lovci a sběrači", "Zemědělská revoluce (neolit)", "Bronzové nástroje", "Železné nástroje a oppida"],
    {
      hints: ["Lov a sběr byly úplně první způsob obživy.", "Oppida (opevněná města) stavěli Keltové až v době železné."],
      explanation: "Lovci a sběrači (paleolit) žili nomádsky. Zemědělská revoluce v neolitu umožnila usazení. Pak přišly bronzové nástroje a nakonec železo — Keltové stavěli oppida, první města u nás.",
    },
  ),
];

const L3: PracticeTask[] = [
  order(
    "Seřaď všech pět úseků pravěku na našem území od nejstaršího po nejnovější.",
    [
      "Paleolit – lovci mamutů",
      "Mezolit – konec doby ledové",
      "Neolit – první zemědělci",
      "Doba bronzová – únětická kultura",
      "Doba železná – Keltové (Bohemia)",
    ],
    {
      hints: ["Doba kamenná má tři části (paleolit, mezolit, neolit) — ty jsou nejstarší.", "Keltové a železo jsou až úplně na konci pravěku."],
      explanation: "Celá osa pravěku: paleolit (lovci mamutů) → mezolit (po době ledové) → neolit (zemědělci) → doba bronzová (únětická kultura) → doba železná (Keltové; podle jejich kmene Bójů se země nazývá Bohemia).",
    },
  ),
  order(
    "Seřaď pět pravěkých mezníků chronologicky, od nejstaršího.",
    [
      "Věstonická venuše (paleolit, 29 000 let)",
      "Zemědělská revoluce (neolit)",
      "Únětická kultura (doba bronzová)",
      "Keltové – kmen Bójů",
      "Germáni – Markomani",
    ],
    {
      hints: ["Věstonická venuše je stará 29 000 let — to je paleolit, úplný začátek.", "Germáni přišli až po Keltech, kolem přelomu letopočtu."],
      explanation: "Věstonická venuše (29 000 let) je z paleolitu. Zemědělská revoluce přišla v neolitu. Únětická kultura patří do doby bronzové. Podle keltského kmene Bójů dostala země pozdější jméno Bohemia; Germáni (Markomani) je z Čech vytlačili kolem přelomu letopočtu.",
    },
  ),
  order(
    "Seřaď celou časovou osu národů a epoch u nás, od nejstarší po nejnovější.",
    [
      "Lovci mamutů (paleolit)",
      "První zemědělci (neolit)",
      "Keltové (doba železná)",
      "Germáni (Markomani)",
      "Slované (6. století n. l.)",
    ],
    {
      hints: ["Začni nejstarší dobou kamennou — lovci mamutů.", "Slované přišli jako poslední, až v 6. století našeho letopočtu."],
      explanation: "Lovci mamutů žili v paleolitu, zemědělci v neolitu. Pak přišli Keltové (doba železná), které vystřídali Germáni (Markomani) kolem přelomu letopočtu, a nakonec dorazili Slované v 6. století n. l. — už skoro ve středověku.",
    },
  ),
  order(
    "Seřaď celou periodizaci pravěku podle materiálu, od nejstarší epochy.",
    ["Paleolit", "Mezolit", "Neolit", "Doba bronzová", "Doba železná"],
    {
      hints: ["Tři úseky doby kamenné jdou: starší → střední → mladší.", "Po kameni přišel bronz a teprve nakonec železo."],
      explanation: "Pravěk postupuje paleolit → mezolit → neolit (celá doba kamenná), pak doba bronzová a nakonec doba železná — pořadí kopíruje, jak lidé zvládali stále tvrdší materiály.",
    },
  ),
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? L1 : level === 2 ? L2 : L3;
  // vrátí celý pool v náhodném pořadí (orchestrátor vybere sessionTaskCount)
  return pickN(pool, pool.length);
}

// ── Topic ────────────────────────────────────────────────────────────────
export const DOBA_KAMENNA_PERIODIZACE: TopicMetadata[] = [
  {
    id: "g6-dej-doba-kamenna-periodizace-6",
    rvpNodeId: "g6-dejepis-pravek-vyvoj-cloveka-doba-kamenna-paleolit-mezolit-neolit",
    displayName: "Časová osa pravěku",
    title: "Doba kamenná – paleolit, mezolit, neolit; periodizace pravěku",
    studentTitle: "Pravěk – časová osa",
    subject: "dejepis",
    category: "Pravěk",
    topic: "Vývoj člověka",
    briefDescription: "Seřadíš pravěké epochy na časové ose podle stáří a vývoje nástrojů.",
    keywords: [
      "pravěk", "doba kamenná", "paleolit", "mezolit", "neolit", "doba bronzová",
      "doba železná", "chronologie", "časová osa", "periodizace", "Keltové",
    ],
    goals: [
      "Seřadit úseky doby kamenné (paleolit, mezolit, neolit) podle stáří.",
      "Chronologicky uspořádat epochy pravěku podle materiálu nástrojů.",
      "Zařadit národy na našem území (Keltové, Germáni, Slované) na časovou osu.",
    ],
    boundaries: [
      "Jen relativní chronologie (co bylo dřív/později), ne konkrétní letopočty zpaměti.",
      "Pravěk a přechod k starověku na našem území.",
      "Nezahrnuje podrobné dějiny jednotlivých kultur.",
    ],
    gradeRange: [6, 6],
    inputType: "drag_order",
    defaultLevel: 1,
    sessionTaskCount: 4,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Pravěk jde podle materiálu nástrojů: doba kamenná (paleolit → mezolit → neolit) → doba bronzová → doba železná. Na našem území pak Keltové → Germáni → Slované.",
      steps: [
        "Najdi nejstarší epochu — vždy je to paleolit (starší doba kamenná).",
        "Doba kamenná postupuje: paleolit → mezolit → neolit.",
        "Po kameni přišel bronz, pak železo; nakonec národy: Keltové → Germáni → Slované.",
      ],
      commonMistake: "Zaměnit pořadí mezolitu a neolitu, nebo dát kovy (bronz/železo) před dobu kamennou.",
      example: "Paleolit (lov) → neolit (zemědělství) → doba bronzová → doba železná (Keltové).",
    },
  },
];
