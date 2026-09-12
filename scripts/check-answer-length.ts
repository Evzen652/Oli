// Hledá úlohy, kde je správná odpověď nápadně delší než distraktory —
// žák pak může tipovat podle délky, aniž by tématu rozuměl.
//
//   npm run check:length
//   IDS=g3-prvouka-…-statni-symboly npm run check:length
//
// Proč zvlášť, když `audit:content` podobné pravidlo má: to hlásí až poměr
// 2,0× a délku nad 15 znaků, takže případy kolem 1,9× propadnou. Kritik
// dávky g3prv-c jich napočítal ~45 napříč tématy a označil to za vzorec
// celého repa, ne chybu jedné dávky. Tenhle skript je na to, aby se dal
// ten vzorec změřit a rozhodnout se, ne aby cokoli blokoval.
//
// Nález NENÍ důkaz chyby: u některých témat je správná odpověď delší
// z podstaty (celá věta proti jednomu slovu). Skript proto **nekončí
// chybou**, jen vypíše přehled a nejhorší případy.
import { getAllTopics } from "@/lib/contentRegistry";

const zadane = (process.env.IDS ?? "").split(",").filter(Boolean);
const POMER = Number(process.env.POMER ?? 1.6);
const REPEATS = Number(process.env.REPEATS ?? 4);

const temata = getAllTopics().filter(
  (t) => t.generator && (zadane.length === 0 || zadane.includes(t.id)),
);

interface Nalez {
  topic: string;
  level: number;
  question: string;
  correct: string;
  nejkratsi: string;
  pomer: number;
}

const nalezy: Nalez[] = [];
let uloh = 0;

for (const t of temata) {
  for (const level of [1, 2, 3]) {
    const videno = new Set<string>();
    for (let r = 0; r < REPEATS; r++) {
      let tasks: ReturnType<NonNullable<typeof t.generator>>;
      try {
        tasks = t.generator!(level) ?? [];
      } catch {
        break;
      }
      for (const task of tasks) {
        if (!task.options || task.options.length < 3) continue;
        const correct = String(task.correctAnswer);
        if (!task.options.includes(correct)) continue;
        if (videno.has(task.question)) continue;
        videno.add(task.question);
        uloh++;
        const distraktory = task.options.filter((o) => o !== correct);
        const nejkratsi = distraktory.reduce((a, b) => (a.length <= b.length ? a : b));
        // Krátké odpovědi (jedno slovo, číslo) neřeš — poměr je tam náhodný.
        if (correct.length < 12) continue;
        const pomer = correct.length / Math.max(1, nejkratsi.length);
        if (pomer >= POMER) {
          nalezy.push({ topic: t.id, level, question: task.question.slice(0, 60), correct, nejkratsi, pomer });
        }
      }
    }
  }
}

const podleTematu = new Map<string, number>();
for (const n of nalezy) podleTematu.set(n.topic, (podleTematu.get(n.topic) ?? 0) + 1);

console.log(`Zkontrolováno ${uloh} úloh v ${temata.length} tématech (práh ${POMER}×).`);
console.log(`Úloh, kde je klíč ≥ ${POMER}× delší než nejkratší distraktor: ${nalezy.length}\n`);

for (const [topic, n] of [...podleTematu.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15)) {
  console.log(`  ${String(n).padStart(3)}×  ${topic}`);
}

console.log("\nNejhorší případy:");
for (const n of nalezy.sort((a, b) => b.pomer - a.pomer).slice(0, 10)) {
  console.log(`\n[${n.topic}] L${n.level} · ${n.pomer.toFixed(1)}×`);
  console.log(`   Q:          ${n.question}`);
  console.log(`   klíč:       ${n.correct}`);
  console.log(`   nejkratší:  ${n.nejkratsi}`);
}

console.log("\nNález není důkaz chyby — u některých témat je delší odpověď z podstaty.");
