import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * PED-3 kalibrace L1<L2<L3.
 * Před: L1 = POOL[0..10], L2 = L3 = celý POOL → getTierTasks L3 vyprazdňoval.
 * Teď disjunktní pooly podle typu úlohy.
 */

type Item = { q: string; a: string; opts: string[]; e: string; hints?: string[] };

const POOL_L1: Item[] = [
  // Doplňování jednoduchých spojek do věty
  { q: "Vyber správnou spojku: 'Šel jsem ven, ___ pršelo.'", a: "ale", opts: ["ale", "a", "nebo", "proto"], e: "Spojka 'ale' vyjadřuje protiklad — šel ven, přestože pršelo. Spojka 'a' by znamenala, že obě věci jdou přirozeně dohromady." },
  { q: "Vyber správnou spojku: 'Chceš čaj ___ kávu?'", a: "nebo", opts: ["nebo", "ale", "protože", "když"], e: "Spojka 'nebo' dává na výběr — buď čaj, nebo kávu." },
  { q: "Vyber správnou spojku: 'Hráli jsme si ___ učili se.'", a: "a", opts: ["a", "ale", "nebo", "aby"], e: "Spojka 'a' přidává další informaci — dělali dvě věci za sebou." },
  { q: "Vyber správnou spojku: 'Nezaspal jsem, ___ jsem vstával časně.'", a: "protože", opts: ["protože", "ale", "nebo", "a"], e: "Spojka 'protože' vysvětluje příčinu — proč jsem nezaspal? Protože jsem vstával časně." },
  { q: "Vyber správnou spojku: '___ přijde tatínek, půjdeme na výlet.'", a: "Když", opts: ["Když", "Ale", "Nebo", "Proto"], e: "Spojka 'když' vyjadřuje podmínku nebo čas." },
  { q: "Vyber správnou spojku: 'Chci ___ ses naučil číst.'", a: "aby", opts: ["aby", "protože", "nebo", "ale"], e: "Spojka 'aby' vyjadřuje přání nebo cíl." },
  { q: "Vyber správnou spojku: 'Nedošel jsem, ___ jsem se ztratil.'", a: "protože", opts: ["protože", "a", "nebo", "aby"], e: "Spojka 'protože' vysvětluje důvod — proč jsem nedošel? Protože jsem se ztratil." },
  { q: "Věta: 'Přišel domů ___ hned šel spát.' — doplň spojku:", a: "a", opts: ["a", "ale", "nebo", "aby"], e: "Spojka 'a' přidává druhý děj, který přirozeně navazuje." },
  { q: "Věta: 'Chtěla hrát, ___ musela učit.' — doplň:", a: "ale", opts: ["ale", "a", "nebo", "protože"], e: "Spojka 'ale' vyjadřuje protiklad." },
  { q: "Vyber správnou spojku: 'Zavolej mi, ___ přijedeš.'", a: "až", opts: ["až", "ale", "nebo", "protože"], e: "Spojka 'až' vyjadřuje čas — nastane událost (zavolání) v okamžiku (přijedeš)." },
];

const POOL_L2: Item[] = [
  // Identifikace typu spojky a jejího významu
  { q: "Co je 'ale' ve větě?", a: "Spojka (spojuje věty s protikladem)", opts: ["Příslovce vyjadřující způsob", "Spojka (spojuje věty s protikladem)", "Podstatné jméno pojmenovávající věc", "Přídavné jméno popisující vlastnost"], e: "Slovo 'ale' je spojka — spojuje věty a vyjadřuje protiklad." },
  {
    q: "Které slovo je spojka?",
    a: "nebo",
    opts: ["nebo", "velký", "běžet", "rychle"],
    e: "Slovo 'nebo' je spojka, protože slouží ke spojování dvou vět či slov a vyjadřuje výběr.",
    hints: [
      "Spojky spojují věty či jejich části — hledej slovo, které nic nepopisuje ani nedělá.",
      "Toto slovo vyjadřuje výběr mezi dvěma možnostmi — buď jedno, či druhé.",
    ],
  },
  { q: "Spojka 'protože' vyjadřuje:", a: "Příčinu (proč se něco stalo)", opts: ["Výběr mezi dvěma možnostmi", "Příčinu (proč se něco stalo)", "Podmínku, za které něco platí", "Protiklad vůči první větě"], e: "Spojka 'protože' vysvětluje příčinu — PROČ se něco stalo." },
  { q: "Spojka 'nebo' vyjadřuje:", a: "Výběr mezi dvěma možnostmi", opts: ["Podmínku, za jaké se něco stane", "Výběr mezi dvěma možnostmi", "Příčinu toho, co se stalo", "Protiklad vůči první větě"], e: "Spojka 'nebo' vždy nabízí výběr — buď jedno, nebo druhé." },
  { q: "Spojka 'když' vyjadřuje:", a: "Čas nebo podmínku", opts: ["Čas nebo podmínku", "Protiklad", "Příčinu", "Výběr"], e: "Spojka 'když' říká, za jakých okolností nebo kdy se něco stane." },
  { q: "Spojka 'aby' vyjadřuje:", a: "Účel nebo přání", opts: ["Účel nebo přání", "Protiklad", "Výběr", "Čas"], e: "Spojka 'aby' říká, k čemu něco slouží nebo co si někdo přeje." },
  { q: "Spojka 'a' vyjadřuje:", a: "Přidávání (další informace)", opts: ["Účel, tedy proč to děláme", "Přidávání (další informace)", "Protiklad k první větě", "Příčinu toho, co se stalo"], e: "Spojka 'a' přidává druhou věc k první — obě informace platí zároveň." },
  { q: "Které slovo NENÍ spojka?", a: "hodně", opts: ["hodně", "a", "protože", "ale"], e: "'Hodně' je příslovce (vyjadřuje míru). 'A', 'protože' a 'ale' jsou spojky." },
  { q: "Jakou spojkou spojíme věty: 'Bylo horko. Šli jsme se koupat.'", a: "a (Bylo horko, a šli jsme se koupat.)", opts: ["ale (Bylo horko, ale šli jsme se koupat.)", "a (Bylo horko, a šli jsme se koupat.)", "aby (Bylo horko, aby šli jsme se koupat.)", "nebo (Bylo horko, nebo šli jsme se koupat.)"], e: "Spojka 'a' přidává druhý děj, který přirozeně navazuje na horko." },
];

const POOL_L3: Item[] = [
  // Aplikace — správná spojka podle vztahu ve složitějším kontextu
  { q: "Věta: 'Máma vařila oběd, ___ jsme uklízeli pokoj.' — jaký vztah popisují spojky?", a: "a (současně, přidávání)", opts: ["a (současně, přidávání)", "protože (příčina)", "ale (protiklad)", "nebo (výběr)"], e: "Obě činnosti probíhaly současně — nejsou v protikladu ani v příčině. Spojka 'a' přidává druhý souběžný děj." },
  { q: "Doplň spojku: 'Petr nemohl přijít, ___ byl nemocný.'", a: "protože", opts: ["protože", "a", "ale", "když"], e: "Otázka „proč nemohl přijít“ — protože byl nemocný. Použij 'protože' pro příčinu." },
  { q: "Doplň spojku: 'Kup si buď mléko, ___ jogurt.'", a: "nebo", opts: ["nebo", "a", "ale", "aby"], e: "Slovo 'buď' naznačuje výběr — spojka 'nebo' patří k 'buď–nebo'." },
  { q: "Doplň spojku: 'Sněžilo, ___ jsme šli sáňkovat.'", a: "a proto", opts: ["a proto", "ale", "nebo", "aby"], e: "Sněžení bylo důvod k sáňkování — spojka 'a proto' vyjadřuje důsledek." },
  { q: "Doplň spojku: 'Půjdu ven, ___ dodělám úkol.'", a: "až", opts: ["až", "protože", "nebo", "ale"], e: "'Až' vyjadřuje čas — půjdu poté, co dodělám úkol." },
  { q: "Doplň spojku: 'Anna se učila celou noc, ___ zkoušku nezvládla.'", a: "ale", opts: ["ale", "protože", "a", "když"], e: "Očekávané by bylo, že úsilí přinese úspěch. Protože se stalo něco opačného, použijeme 'ale' — protiklad." },
  { q: "Kterou spojkou lze nahradit 'a proto': 'Foukalo, a proto jsme se vrátili.'", a: "protože (Vrátili jsme se, protože foukalo.)", opts: ["aby (Vrátili jsme se, aby foukalo.)", "protože (Vrátili jsme se, protože foukalo.)", "nebo (Vrátili jsme se, nebo foukalo.)", "ale (Vrátili jsme se, ale foukalo.)"], e: "Věta 'a proto' popisuje důsledek, který lze přepsat příčinou pomocí 'protože' — vrátili jsme se z toho důvodu, že foukalo." },
  { q: "Doplň dvě spojky: 'Bude déšť, ___ svítí sluníčko. Vezmi si pláštěnku, ___ nenastydl.'", a: "ale / abys", opts: ["ale / abys", "a / protože", "nebo / když", "protože / aby"], e: "První spojka spojuje dvě protikladné informace ('ale' — protiklad). Druhá spojka 'abys' vyjadřuje účel: proč si vezmeš pláštěnku? Abys nenastydl." },
  { q: "Doplň spojku: 'Nezapomeň na klíč, ___ nebudeš mít, jak zamknout.'", a: "jinak", opts: ["jinak", "protože", "aby", "nebo"], e: "Spojka 'jinak' vyjadřuje důsledek zápornice — pokud nesplníš to první, nastane nemilý důsledek." },
  { q: "Vyber vhodnou dvojici spojek: 'Přišla domů, ___ si udělala svačinu a ___ si četla knihu.'", a: "nejdřív / potom", opts: ["nejdřív / potom", "protože / ale", "když / nebo", "aby / až"], e: "Jde o časovou posloupnost dvou činností. Spojení 'nejdřív…, potom…' ukazuje pořadí." },
];

function pick(pool: Item[]): PracticeTask[] {
  return shuffle(pool).slice(0, 16).map(({ q, a, opts, e, hints }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: hints ?? [
      "Spojky spojují dvě věty do jednoho smysluplného celku.",
      "Zjisti vztah mezi větami: přidává informaci, staví ji do protikladu, dává na výběr, vysvětluje příčinu, určuje čas, případně vyjadřuje účel či přání.",
    ],
    explanation: e,
  }));
}

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return pick(pool);
}

export const SPOJOVANIVETSPOJKAMI: TopicMetadata[] = [
  {
    id: "g3-cjl-spojovani-vet-spojkami",
    rvpNodeId: "g3-cjl-jazykova-vychova-skladba-spojovani-vet-spojkami-a-spojovacimi-vyrazy",
    title: "Spojování vět spojkami a spojovacími výrazy",
    studentTitle: "Spojky ve větách",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Skladba",
    briefDescription: "Naučíš se spojovat věty pomocí správných spojek.",
    keywords: ["spojka", "a", "ale", "nebo", "protože", "když", "aby", "souvětí"],
    goals: ["Rozpoznat spojku ve větě.", "Vybrat správnou spojku pro spojení vět.", "Pochopit, co různé spojky vyjadřují."],
    boundaries: ["Základní spojky: a, ale, nebo, protože, když, aby."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Spojky: a (přidávám), ale (protiklad), nebo (výběr), protože (příčina), když (čas/podmínka).",
      steps: ["Přečti obě věty.", "Co je mezi nimi za vztah? (protiklad, příčina, výběr…)", "Vyber odpovídající spojku."],
      commonMistake: "'Šel ven, ale pršelo.' (protiklad) vs 'Šel ven, protože bylo hezky.' (příčina).",
      example: "Bylo teplo, a proto jsme šli plavat. → 'a proto' = příčina/důsledek.",
    },
  },
];
