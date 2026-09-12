// Lint shody přísudku a číslovky nad VŠEMI úlohami všech témat.
//
// Offline audit (`npm run audit:content`) lintuje jen vzorek, a protože
// generátory losují, jeden běh rarity minul — v prvním běhu hlásil jeden
// nález, ve třech dalších nula. Tenhle skript vygeneruje každou úroveň
// opakovaně (REPEATS), takže projde i kombinace čísel, které se ve vzorku
// objeví jednou za deset běhů.
//
// Spuštění z kořene repa:
//   npx vite-node scripts/lint-agreement.ts
//   IDS=g2-mat-jednotky,g2-mat-tabulky npx vite-node scripts/lint-agreement.ts
//   REPEATS=20 npx vite-node scripts/lint-agreement.ts
//
// Exit 1 = aspoň jeden nález (použitelné v CI i jako brána před merge).
import { getAllTopics } from "@/lib/contentRegistry";
import { checkCzechAgreement, agreementFields } from "@/lib/czechAgreementLint";

const ids = new Set((process.env.IDS ?? "").split(",").filter(Boolean));
const REPEATS = Number(process.env.REPEATS ?? 8);

const temata = getAllTopics().filter((t) => t.generator && (ids.size === 0 || ids.has(t.id)));
if (ids.size > 0) {
  for (const id of ids) if (!temata.some((t) => t.id === id)) console.log(`NENALEZENO ${id}`);
}

/** Nálezy sdružené podle textu, aby se tentýž vzor nevypsal stokrát. */
const nalezy = new Map<string, { topic: string; pole: string; detail: string; pocet: number; ukazka: string }>();
let uloh = 0;

for (const t of temata) {
  for (const level of [1, 2, 3]) {
    const videno = new Set<string>();
    for (let r = 0; r < REPEATS; r++) {
      let tasks: ReturnType<NonNullable<typeof t.generator>>;
      try {
        tasks = t.generator!(level) ?? [];
      } catch (e) {
        console.log(`CHYBA GENERÁTORU ${t.id} L${level}: ${(e as Error).message}`);
        break;
      }
      for (const task of tasks) {
        const klic = `${task.question}|${task.correctAnswer}`;
        if (videno.has(klic)) continue;
        videno.add(klic);
        uloh++;
        for (const field of agreementFields(task)) {
          for (const f of checkCzechAgreement(field.text)) {
            const key = `${t.id}|${field.label}|${f.detail}`;
            const zapis = nalezy.get(key);
            if (zapis) zapis.pocet++;
            else nalezy.set(key, { topic: t.id, pole: field.label, detail: f.detail, pocet: 1, ukazka: task.question.slice(0, 70) });
          }
        }
      }
    }
  }
}

console.log(`Zkontrolováno ${uloh} unikátních úloh v ${temata.length} tématech (REPEATS=${REPEATS}).`);
if (nalezy.size === 0) {
  console.log("Shoda přísudku a číslovky: bez nálezu.");
  process.exit(0);
}

const poradi = [...nalezy.values()].sort((a, b) => b.pocet - a.pocet);
console.log(`\nNálezů: ${poradi.length} vzorů, ${poradi.reduce((n, x) => n + x.pocet, 0)} výskytů\n`);
for (const n of poradi) {
  console.log(`[${n.topic}] ${n.pole} · ${n.pocet}×`);
  console.log(`   ${n.detail}`);
  console.log(`   úloha: ${n.ukazka}`);
}
process.exit(1);
