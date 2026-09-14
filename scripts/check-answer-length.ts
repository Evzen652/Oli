// Hledá témata, kde se dá uhodnout podle DÉLKY — správná odpověď je
// systematicky ta výrazně nejdelší, takže žák trefí, aniž by tématu rozuměl.
//
//   npm run check:length
//   IDS=g3-cjl-uhledne-psani npm run check:length
//   PRAH=0.25 REPEATS=10 npm run check:length
//
// Skript vznikl ve dvou krocích a oba omyly stojí za zapsání:
//
// 1. První verze počítala poměr klíč / NEJKRATŠÍ distraktor a napříč repem
//    hlásila 1535 úloh. Jenže poměr k nejkratší možnosti neříká nic o tom,
//    jestli se dá tipovat — žák vidí všechny čtyři a vybírá mezi nimi. Klíč
//    o 60 % delší než nejkratší možnost je v pořádku, když je jiný distraktor
//    stejně dlouhý.
// 2. Druhá verze měřila, jak často je klíč nejdelší. To zase počítalo i rozdíl
//    jednoho znaku („Krajské město“ proti „Hlavní město“), který dítě nevidí.
//
// Teď se počítá jen **výrazně** nejdelší možnost (≥ NASOBEK× delší než druhá
// v pořadí) a hlavně se klíč porovnává s distraktory: když je klíč výrazně
// nejdelší ve 40 % úloh, ale distraktor taky ve 35 %, žádné vodítko to není.
// Vzorec je až tehdy, když jedna strana výrazně převažuje.
//
// Naměřeno napříč rejstříkem: klíč je výrazně nejdelší v 5,6 % úloh,
// distraktor ve 14,1 % — plošně tedy délka vede spíš OD správné odpovědi.
// Jenže několik desítek témat ten poměr obrací naruby.
//
// PEVNÁ ŠKÁLA SE NEPOČÍTÁ — stejně jako u `check:options`. Když má téma jednu
// a tutéž nabídku („Kyslík / Dusík / Oxid uhličitý / Vodní pára“) a klíč mezi
// nimi rotuje, pak je „Oxid uhličitý“ sice dvakrát delší než „Kyslík“, ale
// vodítko to není: v jedné úloze je klíč a ve třech distraktor.
//
// Nález NENÍ důkaz chyby: u faktických témat bývá definice delší z podstaty.
// Skript proto **nekončí chybou**, jen ukáže, kde dopsat distraktory.
import { getAllTopics } from "@/lib/contentRegistry";

const zadane = (process.env.IDS ?? "").split(",").filter(Boolean);
/** Od kolika procent úloh s výrazně nejdelším klíčem téma nahlásit. */
const PRAH = Number(process.env.PRAH ?? 0.35);
/** Kolikrát převažuje klíč nad distraktorem, aby šlo o vzorec, ne o shodu. */
const PREVAHA = Number(process.env.PREVAHA ?? 2.5);
/** Kolikrát delší musí být možnost, aby to dítě vůbec poznalo. */
const NASOBEK = Number(process.env.NASOBEK ?? 1.25);
const REPEATS = Number(process.env.REPEATS ?? 6);
/** Pod tolik úloh je podíl šum, ne vzorec. */
const MIN_ULOH = 8;

const temata = getAllTopics().filter(
  (t) => t.generator && (zadane.length === 0 || zadane.includes(t.id)),
);

interface Ukazka { level: number; question: string; klic: string; druha: string }
interface Kandidat { nabidka: string; klicNejdelsi: boolean; ukazka?: Ukazka }
interface Tema { id: string; n: number; klic: number; distr: number; ukazky: Ukazka[] }

const rows: Tema[] = [];
let celkemUloh = 0;
let celkemKlic = 0;
let celkemDistr = 0;

for (const t of temata) {
  const videno = new Set<string>();
  const kandidati: Kandidat[] = [];
  /** otisk nabídky → klíče, které se u ní v tématu vyskytly (pevná škála) */
  const skaly = new Map<string, Set<string>>();
  let n = 0;
  for (const level of [1, 2, 3]) {
    for (let r = 0; r < REPEATS; r++) {
      let tasks: ReturnType<NonNullable<typeof t.generator>>;
      try {
        tasks = t.generator!(level) ?? [];
      } catch {
        break;
      }
      for (const task of tasks) {
        const o = task.options ?? [];
        if (o.length < 3) continue;
        const klic = String(task.correctAnswer);
        if (!o.includes(klic)) continue;
        const id = `${level}|${task.question}`;
        if (videno.has(id)) continue;
        videno.add(id);
        n++;
        const nabidka = [...o].sort().join("");
        const klice = skaly.get(nabidka) ?? new Set<string>();
        klice.add(klic);
        skaly.set(nabidka, klice);
        const podleDelky = [...o].sort((a, b) => b.length - a.length);
        if (podleDelky[0].length < NASOBEK * podleDelky[1].length) continue;
        const klicNejdelsi = podleDelky[0] === klic;
        kandidati.push({
          nabidka,
          klicNejdelsi,
          ukazka: klicNejdelsi
            ? { level, question: task.question.slice(0, 70), klic, druha: podleDelky[1] }
            : undefined,
        });
      }
    }
  }
  if (n < MIN_ULOH) continue;
  const zive = kandidati.filter((k) => (skaly.get(k.nabidka)?.size ?? 1) === 1);
  const klicNejdelsi = zive.filter((k) => k.klicNejdelsi).length;
  const distrNejdelsi = zive.length - klicNejdelsi;
  celkemUloh += n;
  celkemKlic += klicNejdelsi;
  celkemDistr += distrNejdelsi;
  rows.push({
    id: t.id,
    n,
    klic: klicNejdelsi,
    distr: distrNejdelsi,
    ukazky: zive.map((k) => k.ukazka).filter((u): u is Ukazka => !!u),
  });
}
const podil = (r: Tema) => r.klic / r.n;
rows.sort((a, b) => podil(b) - podil(a));
const nad = rows.filter((r) => podil(r) >= PRAH && r.klic >= PREVAHA * Math.max(1, r.distr));

console.log(`Zkontrolováno ${celkemUloh} úloh ve ${rows.length} tématech (REPEATS=${REPEATS}, práh délky ${NASOBEK}×).`);
console.log(
  `Výrazně nejdelší možnost je klíč v ${(100 * celkemKlic / celkemUloh).toFixed(1)} % úloh, `
  + `distraktor v ${(100 * celkemDistr / celkemUloh).toFixed(1)} %.`,
);
console.log(`\nTémat, kde klíč převažuje ≥ ${PREVAHA}× a je nejdelší v ≥ ${(100 * PRAH).toFixed(0)} % úloh: ${nad.length}\n`);

for (const r of nad) {
  console.log(
    `  klíč ${(100 * podil(r)).toFixed(0).padStart(3)} % / distraktor ${(100 * r.distr / r.n).toFixed(0).padStart(3)} %`
    + `  (${String(r.n).padStart(3)} úloh)  ${r.id}`,
  );
}

if (nad.length && nad.length <= 3) {
  console.log("\nÚlohy, kde je klíč výrazně nejdelší:");
  for (const r of nad) {
    for (const u of r.ukazky.slice(0, 20)) {
      console.log(`\n[${r.id}] L${u.level}`);
      console.log(`   Q:      ${u.question}`);
      console.log(`   klíč:   ${u.klic}`);
      console.log(`   druhá:  ${u.druha}`);
    }
  }
} else if (nad.length) {
  console.log("\nDetail k jednomu tématu: IDS=<id> npm run check:length");
}

console.log("\nNález není důkaz chyby — u faktických témat bývá definice delší z podstaty.");
