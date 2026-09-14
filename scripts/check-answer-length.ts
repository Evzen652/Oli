// Hledá témata, kde se dá uhodnout podle DÉLKY — klíč je systematicky
// nejdelší možnost, takže žák trefí správně, aniž by tématu rozuměl.
//
//   npm run check:length
//   IDS=g3-cjl-uhledne-psani npm run check:length
//   PRAH=0.5 REPEATS=10 npm run check:length
//
// Proč se to měří takhle, a ne poměrem klíč/nejkratší distraktor:
// první verze skriptu počítala právě ten poměr a napříč repem jich našla
// **1535**. Jenže poměr k NEJKRATŠÍ možnosti neříká nic o tom, jestli se dá
// podle délky tipovat — žák vidí všechny čtyři a vybírá mezi nimi. Klíč o 60 %
// delší než nejkratší možnost je zcela v pořádku, pokud je jiný distraktor
// stejně dlouhý nebo delší.
//
// Změřeno tedy přímo to, co dítě může udělat: **jak často uspěje strategie
// „vyber nejdelší možnost“.** U čtyř možností je náhoda ≈ 25 %. Napříč celým
// rejstříkem vyšlo 26,8 % — plošný problém to tedy NENÍ. Jenže rozptyl je
// velký: 34 témat je nad 60 % a nejhorší na 88 %. Právě ta se mají opravit,
// ne těch 1535 jednotlivých úloh.
//
// Nález NENÍ důkaz chyby: u faktických témat bývá správná odpověď delší
// z podstaty (celá věta proti jednomu slovu). Skript proto **nekončí chybou**,
// jen ukáže, kde se vyplatí distraktory dopsat.
import { getAllTopics } from "@/lib/contentRegistry";

const zadane = (process.env.IDS ?? "").split(",").filter(Boolean);
/** Od jaké úspěšnosti strategie „vyber nejdelší“ téma nahlásit. */
const PRAH = Number(process.env.PRAH ?? 0.6);
const REPEATS = Number(process.env.REPEATS ?? 6);
/** Pod tolik úloh je úspěšnost šum, ne vzorec. */
const MIN_ULOH = 8;

const temata = getAllTopics().filter(
  (t) => t.generator && (zadane.length === 0 || zadane.includes(t.id)),
);

interface Uloha {
  level: number;
  question: string;
  klic: string;
  nejdelsiJinak: string;
}
interface Tema {
  id: string;
  n: number;
  uspech: number;
  ukazky: Uloha[];
}

const rows: Tema[] = [];
let celkemUloh = 0;
let celkemTrefa = 0;

for (const t of temata) {
  const videno = new Set<string>();
  const ukazky: Uloha[] = [];
  let n = 0;
  let trefa = 0;
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
        const max = Math.max(...o.map((x) => x.length));
        const nejdelsi = o.filter((x) => x.length === max);
        if (!nejdelsi.includes(klic)) continue;
        // Při shodné délce by strategie mezi nimi tipovala — započti jen podíl.
        trefa += 1 / nejdelsi.length;
        if (nejdelsi.length === 1) {
          const jinak = o.filter((x) => x !== klic).reduce((a, b) => (a.length >= b.length ? a : b));
          ukazky.push({ level, question: task.question.slice(0, 70), klic, nejdelsiJinak: jinak });
        }
      }
    }
  }
  if (n < MIN_ULOH) continue;
  celkemUloh += n;
  celkemTrefa += trefa;
  rows.push({ id: t.id, n, uspech: trefa / n, ukazky });
}

rows.sort((a, b) => b.uspech - a.uspech);
const nad = rows.filter((r) => r.uspech >= PRAH);

console.log(`Zkontrolováno ${celkemUloh} úloh ve ${rows.length} tématech (REPEATS=${REPEATS}).`);
console.log(
  `Úspěšnost strategie „vyber nejdelší možnost“ napříč rejstříkem: `
  + `${(100 * celkemTrefa / celkemUloh).toFixed(1)} % (náhoda ≈ 25 %).`,
);
console.log(`\nTémat nad prahem ${(100 * PRAH).toFixed(0)} %: ${nad.length}\n`);

for (const r of nad) {
  console.log(`  ${(100 * r.uspech).toFixed(0).padStart(3)} %  (${String(r.n).padStart(3)} úloh)  ${r.id}`);
}

if (nad.length && nad.length <= 3) {
  console.log("\nÚlohy, kde je klíč jediná nejdelší možnost:");
  for (const r of nad) {
    for (const u of r.ukazky.slice(0, 12)) {
      console.log(`\n[${r.id}] L${u.level}`);
      console.log(`   Q:              ${u.question}`);
      console.log(`   klíč:           ${u.klic}`);
      console.log(`   nejdelší jinak: ${u.nejdelsiJinak}`);
    }
  }
} else if (nad.length) {
  console.log("\nDetail k jednomu tématu: IDS=<id> npm run check:length");
}

console.log("\nNález není důkaz chyby — u faktických témat bývá správná odpověď delší z podstaty.");
