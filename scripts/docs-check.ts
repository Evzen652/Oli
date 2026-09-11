// Kontrola úplnosti dokumentace úloh (CONTENT_AUTHORING §0) pro zadaná témata.
// Spuštění: IDS=id1,id2 npx vite-node scripts/docs-check.ts   (z kořene repa)
// Na rozdíl od brány (vzorek 18 úloh) prochází VŠECHNY unikátní úlohy.
import { getAllTopics } from "@/lib/contentRegistry";
import { checkHintLeakage } from "../supabase/functions/_shared/hintLeakage";

const ids = (process.env.IDS ?? "").split(",").filter(Boolean);
const SEL = new Set(["select_one", "true_false", "multi_select"]);
const norm = (s: string) => s.toLowerCase().replace(/[.,;:!?„“"()]/g, " ").replace(/\s+/g, " ").trim();
const containsPhrase = (hay: string, needle: string) => (` ${norm(hay)} `).includes(` ${norm(needle)} `);
let bad = 0;
for (const id of ids) {
  const t = getAllTopics().find((x) => x.id === id);
  if (!t) { console.log("NENALEZENO", id); bad++; continue; }
  const probs: string[] = [];
  const perLevel: number[] = [];
  const h0Seen = new Map<string, number>();
  for (const lv of [1, 2, 3]) {
    const seen = new Map<string, any>();
    // Klíč musí zahrnout i dvojice/položky: u match_pairs mají všechny úlohy
    // stejné zadání i klíč "match" a bez toho by se počítaly jako jedna.
    for (let r = 0; r < 5; r++) for (const x of t.generator!(lv) ?? [])
      seen.set([x.question, x.correctAnswer, JSON.stringify(x.pairs ?? x.items ?? x.categories ?? "")].join("|"), x);
    perLevel.push(seen.size);
    for (const x of seen.values()) {
      const q = x.question.slice(0, 50);
      if (!x.hints?.[0] || !x.hints?.[1]) probs.push(`L${lv} bez 2 napoved: ${q}`);
      else {
        if (x.hints[1].length < x.hints[0].length * 1.2) probs.push(`L${lv} velka napoveda neni o 20 % delsi: ${q}`);
        h0Seen.set(x.hints[0], (h0Seen.get(x.hints[0]) ?? 0) + 1);
        const leak = checkHintLeakage({ question: x.question, correct_answer: String(x.correctAnswer), hints: x.hints, options: x.options });
        if (!leak.ok) probs.push(`L${lv} hint leak (${leak.leakingFragment ?? leak.reason}): ${q}`);
      }
      if (!x.explanation && !x.solutionSteps?.length) probs.push(`L${lv} bez vysvetleni: ${q}`);
      const isSel = (SEL.has(t.inputType) || x.optionFeedback) && x.options?.length;
      if (isSel) {
        const key = String(x.correctAnswer);
        const wrong = x.options.filter((o: string) => o !== key);
        const miss = wrong.filter((o: string) => !x.optionFeedback?.[o]);
        if (miss.length) probs.push(`L${lv} bez feedbacku (${miss.length}): ${q}`);
        if (!x.options.includes(key)) probs.push(`L${lv} klic mimo moznosti: ${q}`);
        if (new Set(x.options.map((o: string) => o.toLowerCase())).size !== x.options.length) probs.push(`L${lv} duplicitni moznosti (i po velikosti pismen): ${q}`);
        const maxD = Math.max(...wrong.map((o: string) => o.length));
        if (key.length > 15 && key.length >= 2 * maxD) probs.push(`L${lv} klic napadne delsi (${key.length} vs ${maxD}): ${q}`);
        if (/\bprý\b/i.test(wrong.join(" "))) probs.push(`L${lv} "prý" v distraktoru: ${q}`);
        // Pravidlo z taskValidator: distraktor nesmí být celou frází v klíči (a naopak).
        if (key.length > 3 && !/\d/.test(key)) for (const w of wrong) {
          if (w.length > 3 && w.toLowerCase() !== key.toLowerCase() && (containsPhrase(key, w) || containsPhrase(w, key))) probs.push(`L${lv} distraktor „${w}“ je frazi v klici: ${q}`);
        }
      }
      if (x.question.toLowerCase().includes(String(x.correctAnswer).toLowerCase()) && String(x.correctAnswer).length > 2) probs.push(`L${lv} klic ve zneni otazky: ${q}`);
    }
  }
  for (const [h, n] of h0Seen) if (n > 1) probs.push(`mala napoveda se opakuje ${n}x: ${h.slice(0, 50)}`);
  if (perLevel.some((n) => n < 12)) probs.push(`malo unikatnich uloh na uroven: ${perLevel.join("/")}`);
  console.log(`${probs.length ? "✗" : "✓"} ${id.slice(0, 80)}  L1/L2/L3 = ${perLevel.join("/")}`);
  for (const p of probs) console.log("    " + p);
  if (probs.length) bad++;
}
console.log(bad ? `\n${bad} temat s nalezy` : "\nvse v poradku");
process.exit(bad ? 1 : 0);
