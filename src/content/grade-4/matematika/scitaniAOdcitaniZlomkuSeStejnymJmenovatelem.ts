import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { phrase, pad } from "@/lib/czechGrammar";
import { ciselnaUloha, rnd } from "./_mat";

// Přepsáno 2026-09-11 (audit 4. ročníku). Velká nápověda prozrazovala
// výsledek („Sečteme čitatele: 2 + 3 = 5.“), L3 krátila zlomky (krácení
// patří až na 2. stupeň) a distraktory neměly vysvětlení. Teď:
// L1 sčítání (výsledek menší než celek)
// L2 odčítání a sčítání ve slovní úloze
// L3 dvoukrokové úlohy: kolik zbylo po dvou odebráních, kolik chybí do celku.
// Výsledek se nekrátí — 2/8 zůstává 2/8.

const z = (c: number, j: number) => `${c}/${j}`;

function scitani(): PracticeTask {
  const j = rnd(3, 12);
  const a = rnd(1, j - 2);
  const b = rnd(1, j - 1 - a);
  const c = a + b;
  return ciselnaUloha(`${z(a, j)} + ${z(b, j)} = ?`, z(c, j), [
    { value: z(c, 2 * j), why: `Sečetly se i jmenovatele. Díly jsou pořád stejně velké (${z(1, j)}), jmenovatel ${j} se nemění.` },
    { value: z(c + 1, j), why: `Čitatele se sečetly špatně: ${a} + ${b} je méně.` },
    { value: z(a * b, j), why: "Čitatele se vynásobily. Při sčítání zlomků se čitatele sčítají." },
    { value: z(j, c), why: "Čitatel a jmenovatel jsou prohozené. Nahoře je počet dílů, dole počet dílů celku." },
    { value: z(Math.max(1, c - 1), j), why: `Čitatele se sečetly špatně: ${a} + ${b} je víc.` },
  ], [
    `Zlomky ${z(a, j)} a ${z(b, j)} mají stejný jmenovatel. Co to říká o velikosti jejich dílů?`,
    `Představ si celek rozdělený na ${phrase(j, "STEJNÝ", "DÍL")}. Vezmeš ${pad(a, "DÍL")} a pak ještě ${pad(b, "DÍL")}. Kolik dílů máš dohromady? Jmenovatel ${j} zůstává.`,
  ], [
    `Jmenovatele jsou stejné (${j}), díly jsou stejně velké.`,
    `Sečteme čitatele: ${a} + ${b} = ${c}.`,
    `${z(a, j)} + ${z(b, j)} = ${z(c, j)}`,
  ]);
}

function odcitani(): PracticeTask {
  let j = 0, a = 0, b = 0, c = 0;
  // Výsledek nesmí stát v zadání: 4/8 − 2/8 (b = c), 11/12 − 10/12 („1/12“ je v „11/12“).
  do { j = rnd(3, 12); a = rnd(2, j); b = rnd(1, a - 1); c = a - b; } while (b === c || String(a).endsWith(String(c)));
  return ciselnaUloha(`${z(a, j)} − ${z(b, j)} = ?`, z(c, j), [
    { value: z(a + b, j), why: "Čitatele se sečetly. Tady se odčítá." },
    { value: z(b, j), why: `To je zlomek, který se odčítal. Výsledek je to, co zbude: ${a} − ${b}.` },
    { value: z(c + 1, j), why: `Čitatele se odečetly špatně: ${a} − ${b} je méně.` },
    { value: z(j - c, j), why: "Tohle je část, která do celku chybí. Výsledek odčítání je jiná část." },
    { value: z(Math.max(1, c - 1), j), why: `Čitatele se odečetly špatně: ${a} − ${b} je víc.` },
  ], [
    `Zlomky ${z(a, j)} a ${z(b, j)} mají stejně velké díly (jmenovatel ${j}). S kterými čísly budeš počítat?`,
    `Představ si koláč rozdělený na ${phrase(j, "STEJNÝ", "DÍL")}, z něhož máš ${pad(a, "DÍL")}. Když ${pad(b, "DÍL")} sníš, kolik dílů ti zůstane? Jmenovatel ${j} se nemění.`,
  ], [
    `Jmenovatele jsou stejné (${j}), odečítáme jen čitatele.`,
    `${a} − ${b} = ${c}`,
    `${z(a, j)} − ${z(b, j)} = ${z(c, j)}`,
  ]);
}

function slovniSoucet(): PracticeTask {
  const j = rnd(4, 12);
  const a = rnd(1, j - 2);
  const b = rnd(1, j - 1 - a);
  const c = a + b;
  return ciselnaUloha(`Adam snědl ${z(a, j)} pizzy a Bára ${z(b, j)}. Jakou část pizzy snědli dohromady?`, z(c, j), [
    { value: z(c, 2 * j), why: `Sečetly se i jmenovatele. Pizza je pořád rozdělená na ${phrase(j, "STEJNÝ", "DÍL")}.` },
    { value: z(j - c, j), why: "Tohle je část, která zbyla. Otázka se ptá, kolik snědli." },
    { value: z(c + 1, j), why: `Dílů je o jeden víc, než snědli: ${a} + ${b} je méně.` },
    { value: z(Math.max(1, c - 1), j), why: `Dílů je o jeden méně, než snědli: ${a} + ${b} je víc.` },
  ], [
    `Adam snědl ${pad(a, "DÍL")} z ${j}, Bára ${pad(b, "DÍL")} z ${j}. Kolik dílů je to dohromady?`,
    `Oba zlomky mají jmenovatel ${j}, díly jsou stejně velké. Sečti jen čitatele a jmenovatel ${j} nech — výsledek zapiš jako zlomek.`,
  ], [
    `Adam ${z(a, j)}, Bára ${z(b, j)} — díly jsou stejné.`,
    `${z(a, j)} + ${z(b, j)} = ${z(c, j)}`,
  ]);
}

function zbytek(): PracticeTask {
  let j = 0, a = 0, b = 0, c = 0;
  // Zbytek nesmí stát v zadání (Tom 2/5, zbylo 2/5).
  do { j = rnd(5, 12); a = rnd(1, j - 3); b = rnd(1, j - 2 - a); c = j - a - b; }
  while (c === a || c === b || String(a).endsWith(String(c)) || String(b).endsWith(String(c)));
  return ciselnaUloha(`Čokoláda má ${pad(j, "DÍL")}. Tom snědl ${z(a, j)} čokolády, Lucie ${z(b, j)}. Jaká část čokolády zbyla?`, z(c, j), [
    { value: z(a + b, j), why: "To je část, kterou snědli. Otázka se ptá, co zbylo." },
    { value: z(j - a, j), why: "Odečetla se jen Tomova část. Lucie snědla také." },
    { value: z(j - b, j), why: "Odečetla se jen Luciina část. Tom snědl také." },
    { value: z(c + 1, j), why: `Zkouška: ${a} + ${b} + ${c + 1} je víc než ${j}.` },
  ], [
    `Tom snědl ${pad(a, "DÍL")}, Lucie ${pad(b, "DÍL")}. Kolik dílů to je dohromady a kolik jich zbude z ${j}?`,
    `Celá čokoláda má ${pad(j, "DÍL")}. Nejdřív sečti díly, které snědli oba dohromady, a pak je odečti od celku. Jmenovatel zůstává ${j}.`,
  ], [
    `Snědli: ${z(a, j)} + ${z(b, j)} = ${z(a + b, j)}`,
    `Zbylo: ${z(j, j)} − ${z(a + b, j)} = ${z(c, j)}`,
  ]);
}

function doCelku(): PracticeTask {
  let j = 0, a = 0, c = 0;
  do { j = rnd(3, 12); a = rnd(1, j - 1); c = j - a; } while (a === c || String(a).endsWith(String(c)));
  return ciselnaUloha(`${z(a, j)} + ? = 1. Jaký zlomek chybí do celku?`, z(c, j), [
    { value: z(a, j), why: `To je zlomek ze zadání. ${z(a, j)} + ${z(a, j)} = ${z(2 * a, j)}, to není celek.` },
    { value: z(j, c), why: "Čitatel a jmenovatel jsou prohozené." },
    { value: z(c + 1, j), why: `S tímhle by to bylo víc než celek: ${a} + ${c + 1} je víc než ${j}.` },
    ...(c > 1 ? [{ value: z(c - 1, j), why: `S tímhle by celek nebyl celý: ${a} + ${c - 1} je méně než ${j}.` }] : []),
    { value: z(c, 2 * j), why: `Jmenovatel se nemění — díly jsou pořád ${z(1, j)}.` },
  ], [
    `Celek má ${pad(j, "DÍL")}. Kolik dílů chybí k ${z(a, j)}?`,
    `Celek zapíšeš jako zlomek, který má nahoře i dole ${j} — to jsou všechny díly. Od čitatele ${j} odečti čitatel ${a} a jmenovatel ponech.`,
  ], [
    `1 = ${z(j, j)}`,
    `${z(j, j)} − ${z(a, j)} = ${z(c, j)}`,
  ]);
}

function gen(level: number): PracticeTask[] {
  return Array.from({ length: 40 }, (_, i) => {
    if (level === 1) return scitani();
    if (level === 2) return i % 2 ? odcitani() : slovniSoucet();
    return i % 2 ? zbytek() : doCelku();
  });
}

export const SCITANI_ODCITANI_ZLOMKU: TopicMetadata[] = [
  {
    id: "g4-mat-zlomky-scitani-odcitani-stejny-jmenovatel-4",
    rvpNodeId: "g4-matematika-cislo-a-pocetni-operace-zlomky-scitani-a-odcitani-zlomku-se-stejnym-jmenovatelem",
    displayName: "Sčítání zlomků",
    title: "Sčítání a odčítání zlomků se stejným jmenovatelem",
    studentTitle: "Zlomky: + a −",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Zlomky",
    briefDescription: "Sečteš a odečteš zlomky se stejným jmenovatelem.",
    keywords: [
      "zlomky", "sčítání zlomků", "odčítání zlomků",
      "stejný jmenovatel", "čitatel", "jmenovatel", "zjednodušení",
    ],
    goals: [
      "Sečíst dvě lomeniny se stejným jmenovatelem.",
      "Odečíst dvě lomeniny se stejným jmenovatelem.",
      "Zjednodušit výsledný zlomek (je-li to možné).",
    ],
    boundaries: [
      "Pouze zlomky se stejným jmenovatelem.",
      "Nezahrnuje zlomky s různým jmenovatelem.",
      "Nezahrnuje násobení ani dělení zlomků.",
    ],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: ["g4-mat-zlomek-cast-celku-4"],
    generator: gen,
    helpTemplate: {
      hint: "Při sčítání/odčítání zlomků se stejným jmenovatelem: jmenovatel nechej stejný, sečti/odečti jen čitatele.",
      steps: [
        "Zkontroluj, že oba zlomky mají stejný jmenovatel.",
        "Sečti nebo odečti čitatele.",
        "Jmenovatel zůstane beze změny.",
        "Pokud lze výsledný zlomek zjednodušit (čitatel i jmenovatel dělitelné stejným číslem), zjednodušíme.",
      ],
      commonMistake: "Sčítání jmenovatelů: žáci píší 1/4 + 1/4 = 2/8 místo 2/4.",
      example: "3/8 + 2/8 = (3+2)/8 = 5/8. Nebo: 5/6 − 2/6 = 3/6 = 1/2.",
    },
  },
];
