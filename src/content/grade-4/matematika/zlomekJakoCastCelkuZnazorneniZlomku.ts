import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { phrase, pad } from "@/lib/czechGrammar";
import { ciselnaUloha, rnd } from "./_mat";

// Přepsáno 2026-09-11 (audit 4. ročníku). Nápovědy byly u všech úloh stejné,
// distraktory bez vysvětlení a slovní úloha měla chyby („vysypal … Jaký
// zlomek snědl?“, „1 díl pizzy rozdělený“). Porovnání mělo klíč přímo
// v zadání. Teď:
// L1 zlomek z vybarvených dílů
// L2 porovnání zlomků se stejným jmenovatelem (○ >, <, =), zbylá část celku
// L3 část z čísla (1/4 z 20, 3/4 z 20), porovnání zlomků s čitatelem 1.
// Nápovědy k porovnání nesmí spojit číslo se slovy „větší/menší/stejný“
// (kontrola hint_leak v contentAudit), proto jsou bez číslic nebo bez těch slov.

const z = (c: number, j: number) => `${c}/${j}`;

function vybarveno(): PracticeTask {
  const j = rnd(2, 10), c = rnd(1, j - 1);
  return ciselnaUloha(`Obdélník je rozdělený na ${phrase(j, "STEJNÝ", "DÍL")}. Ema vybarvila ${pad(c, "DÍL")}. Jakou část obdélníku vybarvila?`, z(c, j), [
    { value: z(j, c), why: "Čitatel a jmenovatel jsou prohozené. Dole je počet všech dílů, nahoře počet vybarvených." },
    { value: z(j - c, j), why: "To je nevybarvená část. Otázka se ptá na vybarvenou." },
    ...(j - c !== c ? [{ value: z(c, j - c), why: "Dole má být počet všech dílů, ne jen nevybarvených." }] : []),
    { value: z(c, j + 1), why: `Celek má ${pad(j, "DÍL")}, ne víc.` },
    { value: z(c + 1, j), why: `Ema vybarvila ${pad(c, "DÍL")}, ne víc.` },
  ], [
    `Všech dílů je ${j}, vybarvených ${c}. Které z těch dvou čísel patří pod zlomkovou čáru?`,
    `Jmenovatel (dole) říká, na kolik stejných dílů je celek rozdělený. Čitatel (nahoře) říká, kolik těch dílů bereme — tady kolik jich Ema vybarvila.`,
  ], [
    `Celek: ${pad(j, "DÍL")}, to je jmenovatel ${j}.`,
    `Vybarveno: ${pad(c, "DÍL")}, to je čitatel ${c}.`,
    `Vybarvená část: ${z(c, j)}`,
  ]);
}

function porovnani(): PracticeTask {
  const j = rnd(3, 12);
  const a = rnd(1, j - 1);
  let b = rnd(1, j - 1);
  while (b === a) b = rnd(1, j - 1);
  const [vetsi, mensi] = a > b ? [a, b] : [b, a];
  const key = a > b ? ">" : "<";
  const proc = `${z(vetsi, j)} je víc: ${pad(vetsi, "DÍL")} je víc než ${pad(mensi, "DÍL")} a díly jsou stejně velké.`;
  return ciselnaUloha(`Porovnej zlomky: ${z(a, j)} ○ ${z(b, j)}`, key, [
    { value: key === ">" ? "<" : ">", why: proc },
    { value: "=", why: `Zlomky se rovnají, jen když mají i stejný čitatel. Tady je čitatel jiný. ${proc}` },
  ], [
    `Oba zlomky, ${z(a, j)} i ${z(b, j)}, mají dole totéž číslo. Co to znamená pro velikost jejich dílů?`,
    "Když jsou díly všude stejně velké, rozhoduje jen to, kolik jich je. Porovnej proto čísla nahoře — víc dílů znamená větší část celku.",
  ], [
    `Jmenovatel je u obou zlomků ${j}, díly jsou stejně velké.`,
    `Porovnáme čitatele: ${a} ${key} ${b}.`,
    `Proto ${z(a, j)} ${key} ${z(b, j)}.`,
  ]);
}

const JIDLA = [
  { nom: "pizza", acc: "pizzu", gen: "pizzy", rozdeleny: "rozdělenou" },
  { nom: "čokoláda", acc: "čokoládu", gen: "čokolády", rozdeleny: "rozdělenou" },
  { nom: "koláč", acc: "koláč", gen: "koláče", rozdeleny: "rozdělený" },
  { nom: "dort", acc: "dort", gen: "dortu", rozdeleny: "rozdělený" },
];

function zbylo(): PracticeTask {
  const jidlo = JIDLA[rnd(0, JIDLA.length - 1)];
  const j = rnd(3, 12);
  let c = rnd(1, j - 1);
  while (2 * c === j || String(c).endsWith(String(j - c))) c = rnd(1, j - 1);
  const zb = j - c;
  return ciselnaUloha(`Máme ${jidlo.acc} ${jidlo.rozdeleny} na ${phrase(j, "STEJNÝ", "DÍL")}. Snědli jsme ${z(c, j)} ${jidlo.gen}. Jaká část ${jidlo.gen} zbyla?`, z(zb, j), [
    { value: z(c, j), why: "To je snědená část. Otázka se ptá, co zbylo." },
    { value: z(j, zb), why: "Čitatel a jmenovatel jsou prohozené." },
    { value: z(zb + 1, j), why: `Zkouška: ${c} + ${zb + 1} je víc než ${j}.` },
    ...(zb > 1 ? [{ value: z(zb - 1, j), why: `Zkouška: ${c} + ${zb - 1} je méně než ${j}.` }] : []),
  ], [
    `Celek (${jidlo.nom}) má ${pad(j, "DÍL")}, snědená část je ${z(c, j)}. Kolik dílů zůstalo?`,
    `Od všech dílů celku odečti snědenou část. Odečítají se jen čitatele, jmenovatel ${j} zůstává. Výsledek zapiš jako zlomek.`,
  ], [
    `Celek: ${z(j, j)}`,
    `${z(j, j)} − ${z(c, j)} = ${z(zb, j)}`,
  ]);
}

const VECI = ["JABLKO", "KULIČKA", "KORUNA", "KNÍŽKA"];
/** Tvar „many“ z pad() je zároveň 2. pád množného čísla: „z 20 jablek“. */
const druhyPadOk = (n: number) => n >= 5 && !(n % 10 >= 1 && n % 10 <= 4 && (n % 100 < 11 || n % 100 > 14));

function castZCisla(): PracticeTask {
  let j = 0, k = 0, podil = 0, N = 0, vysledek = 0;
  do {
    j = [2, 3, 4, 5, 10][rnd(0, 4)];
    k = j > 2 && Math.random() < 0.5 ? rnd(2, j - 1) : 1;
    podil = rnd(2, 10);
    N = j * podil;
    vysledek = k * podil;
  } while (!druhyPadOk(N) || vysledek === j || vysledek === k);
  const vec = VECI[rnd(0, VECI.length - 1)];
  return ciselnaUloha(`Kolik je ${z(k, j)} z ${pad(N, vec)}?`, vysledek, [
    ...(k > 1 ? [{ value: podil, why: `Tohle je jen ${z(1, j)} z ${N}. Potřebuješ ${pad(k, "DÍL")}, tedy ${k} · ${podil}.` }] : []),
    { value: N - j, why: "Od čísla se odečetl jmenovatel. Zlomek z čísla znamená rozdělit číslo na stejné díly." },
    { value: N - vysledek, why: `Tohle je zbytek, který zůstane po odebrání ${z(k, j)}.` },
    ...(N % k === 0 && k > 1 ? [{ value: N / k, why: "Dělilo se čitatelem. Na díly se dělí jmenovatelem." }] : []),
    { value: vysledek + podil, why: `Tohle je o jeden díl víc než ${z(k, j)}.` },
  ], [
    `Hledáš ${z(k, j)} z ${pad(N, vec)}. Nejdřív je rozděl na ${phrase(j, "STEJNÝ", "DÍL")}.`,
    `Jeden díl je ${N} ÷ ${j}, protože jmenovatel ${j} říká, na kolik stejných dílů se celek dělí. ${k === 1 ? "Víc počítat nemusíš — hledáš právě jeden díl." : `Hledáš ale ${pad(k, "DÍL")}, takže výsledek dělení vynásob čitatelem.`}`,
  ], [
    `${z(1, j)} z ${N} = ${N} ÷ ${j} = ${podil}`,
    ...(k > 1 ? [`${z(k, j)} z ${N} = ${k} · ${podil} = ${vysledek}`] : []),
  ]);
}

function jednotkove(): PracticeTask {
  const a = rnd(2, 10);
  let b = rnd(2, 10);
  while (b === a) b = rnd(2, 10);
  const key = a < b ? ">" : "<";
  const [maleDily, velkeDily] = a < b ? [b, a] : [a, b];
  const proc = `U ${z(1, maleDily)} se celek krájí na víc dílů, takže každý díl je menší. ${z(1, velkeDily)} je víc.`;
  return ciselnaUloha(`Porovnej zlomky: ${z(1, a)} ○ ${z(1, b)}`, key, [
    { value: key === ">" ? "<" : ">", why: proc },
    { value: "=", why: `Čitatele jsou stejné, ale díly ne. ${proc}` },
  ], [
    `Jak velký je jeden díl u ${z(1, a)} a jak velký u ${z(1, b)}? Představ si dva koláče téže velikosti.`,
    "Čím víc dílů z koláče nakrájíš, tím menší je každý díl. Jmenovatel říká, na kolik dílů se krájí — vyhrává zlomek s menším počtem dílů.",
  ], [
    `${z(1, a)} = jeden díl z ${a}, ${z(1, b)} = jeden díl z ${b}.`,
    `Víc dílů znamená menší díly, proto ${z(1, a)} ${key} ${z(1, b)}.`,
  ]);
}

function gen(level: number): PracticeTask[] {
  return Array.from({ length: 40 }, (_, i) => {
    if (level === 1) return vybarveno();
    if (level === 2) return i % 2 ? porovnani() : zbylo();
    return i % 3 === 2 ? jednotkove() : castZCisla();
  });
}

export const ZLOMEK_CAST_CELKU: TopicMetadata[] = [
  {
    id: "g4-mat-zlomek-cast-celku-4",
    rvpNodeId: "g4-matematika-cislo-a-pocetni-operace-zlomky-zlomek-jako-cast-celku-znazorneni-zlomku",
    displayName: "Zlomek jako díl celku",
    title: "Zlomek jako část celku",
    studentTitle: "Co je zlomek",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Zlomky",
    briefDescription: "Pochopíš, co je zlomek — část celku.",
    keywords: [
      "zlomek", "čitatel", "jmenovatel", "část celku",
      "znázornění zlomku", "porovnání zlomků",
    ],
    goals: [
      "Zapsat zlomek z grafického nebo slovního rozdělení celku.",
      "Vysvětlit, co znamená čitatel a jmenovatel.",
      "Porovnat zlomky se stejným jmenovatelem.",
    ],
    boundaries: [
      "Pouze zlomky menší než 1 (vlastní zlomky).",
      "Nezahrnuje sčítání ani odčítání zlomků (to je samostatný topic).",
      "Nezahrnuje různé jmenovatele při porovnávání.",
    ],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    recommendedNext: ["g4-mat-zlomky-scitani-odcitani-stejny-jmenovatel-4"],
    generator: gen,
    helpTemplate: {
      hint: "Zlomek a/b říká: vzal jsem a dílů z b stejných dílů celku. Čitatel (a) = kolik jsem vzal, jmenovatel (b) = na kolik dílů je celek rozdělen.",
      steps: [
        "Zjisti, na kolik stejných dílů je celek rozdělen → jmenovatel.",
        "Zjisti, kolik dílů tě zajímá → čitatel.",
        "Zapiš zlomek: čitatel / jmenovatel.",
      ],
      commonMistake: "Záměna čitatele a jmenovatele — děti píší dělení celkový/zbarvený místo zbarvený/celkový.",
      example: "Pizza je rozdělena na 8 dílů, Anička snědla 3 díly → snědla 3/8 pizzy.",
    },
  },
];
