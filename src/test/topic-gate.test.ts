/**
 * BRÁNA 0 — deterministická kontrola JEDNOHO tématu (pro author-batch pipeline).
 *
 * Dva režimy (řízeno env), bez nich se blok přeskočí (neruší `npm test`):
 *  • GATE_TOPIC_ID=<id>                       → téma z registru (getTopicById) — ruční použití
 *  • GATE_TOPIC_FILE=<cesta> [GATE_TOPIC_EXPORT=<NÁZEV>] → import přímo ze souboru
 *    (téma ještě NEMUSÍ být v index.ts → autoři ve workflow nekolidují na registru)
 *
 * Spouští se přes `node scripts/audit-topic.mjs …`.
 *
 * Co dělá (vše deterministické, BEZ LLM):
 *  1. runOfflineAudit([topic]) + runPedagogicalAudit([topic]) — HEURISTIKA (jen report)
 *  2. strukturální invarianty generátoru L1–L3 — TVRDÝ FAIL (vždy reálné)
 *  3. dump vzorku instancí jako JSON (pro LLM kritiky)
 *
 * Výsledek = jeden řádek GATE_RESULT_JSON…GATE_RESULT_END, který parsuje audit-topic.mjs.
 */
import { describe, it, expect } from "vitest";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { getTopicById } from "@/lib/contentRegistry";
import { runOfflineAudit, runPedagogicalAudit } from "@/lib/contentAudit";
import type { PracticeTask, TopicMetadata } from "@/lib/types";

const TOPIC_ID = process.env.GATE_TOPIC_ID;
const TOPIC_FILE = process.env.GATE_TOPIC_FILE;
const TOPIC_EXPORT = process.env.GATE_TOPIC_EXPORT;
const ENABLED = !!(TOPIC_ID || TOPIC_FILE);

async function resolveTopic(): Promise<TopicMetadata | undefined> {
  if (TOPIC_ID) return getTopicById(TOPIC_ID);
  if (TOPIC_FILE) {
    const mod = await import(/* @vite-ignore */ pathToFileURL(resolve(TOPIC_FILE)).href);
    const exp = TOPIC_EXPORT ? mod[TOPIC_EXPORT] : Object.values(mod).find((v) => Array.isArray(v) && v[0]?.generator);
    return Array.isArray(exp) ? exp[0] : (exp as TopicMetadata | undefined);
  }
  return undefined;
}

/** Strukturální invarianty jedné úlohy dle inputType (zrcadlí generator-validation). */
function invariantErrors(topic: TopicMetadata, t: PracticeTask, where: string): string[] {
  const e: string[] = [];
  if (!t.question?.trim()) e.push(`${where}: prázdná question`);
  if (!String(t.correctAnswer ?? "").trim()) e.push(`${where}: prázdná correctAnswer`);
  if (topic.inputType === "select_one") {
    if (!t.options || t.options.length < 2) e.push(`${where}: <2 options`);
    else {
      if (!t.options.includes(t.correctAnswer)) e.push(`${where}: correctAnswer mimo options`);
      if (new Set(t.options).size !== t.options.length) e.push(`${where}: duplicitní options`);
      for (const k of Object.keys(t.optionFeedback ?? {})) {
        if (!t.options.includes(k)) e.push(`${where}: optionFeedback klíč mimo options: ${k}`);
      }
    }
  }
  if (topic.inputType === "drag_order" && (!t.items || t.items.length < 2)) {
    e.push(`${where}: drag_order bez items (<2)`);
  }
  if (topic.inputType === "categorize") {
    if (!t.categories || t.categories.length < 2) e.push(`${where}: categorize <2 skupiny`);
    else for (const c of t.categories) {
      if (!c.name?.trim() || !Array.isArray(c.items) || c.items.length === 0) {
        e.push(`${where}: prázdná skupina "${c.name}"`);
      }
    }
  }
  if (topic.inputType === "comparison" && !["<", "=", ">"].includes(t.correctAnswer)) {
    e.push(`${where}: comparison correctAnswer není <,=,>`);
  }
  for (const h of t.hints ?? []) {
    if (t.correctAnswer.length >= 3 && h.includes(t.correctAnswer)) e.push(`${where}: hint prozrazuje odpověď`);
  }
  return e;
}

function sampleLevel(topic: TopicMetadata, level: number, n: number): PracticeTask[] {
  const seen = new Set<string>();
  const out: PracticeTask[] = [];
  for (const t of topic.generator(level)) {
    if (seen.has(t.question)) continue;
    seen.add(t.question);
    out.push(t);
    if (out.length >= n) break;
  }
  return out;
}

describe.skipIf(!ENABLED)("BRÁNA 0 — gate jednoho tématu", () => {
  it("gate", async () => {
    const topic = await resolveTopic();
    if (!topic) {
      console.log(`GATE_RESULT_JSON${JSON.stringify({ topicId: TOPIC_ID ?? TOPIC_FILE, pass: false, error: "topic nenalezen" })}GATE_RESULT_END`);
      expect(topic, `topic nenalezen (${TOPIC_ID ?? TOPIC_FILE})`).toBeDefined();
      return;
    }

    const content = runOfflineAudit([topic]);
    const ped = runPedagogicalAudit([topic]);

    const invErrors: string[] = [];
    const samples: Record<string, PracticeTask[]> = {};
    for (const level of [1, 2, 3]) {
      topic.generator(level).forEach((t, i) => invErrors.push(...invariantErrors(topic, t, `L${level}·task[${i}] "${(t.question ?? "").slice(0, 40)}"`)));
      samples[`L${level}`] = sampleLevel(topic, level, 6);
    }

    // Tvrdě blokuje JEN strukturální invarianty (provably real, nikdy false positive).
    // Audit nálezy = HEURISTIKA s falešnými poplachy (např. hint_leak na jednotku
    // „století") → jen report + posíláme kritikům, kteří je adjudikují.
    const pass = invErrors.length === 0;
    const result = {
      topicId: topic.id,
      inputType: topic.inputType,
      pass,
      clean: pass && content.issues.length === 0 && ped.issues.length === 0,
      contentIssues: content.issues.map((i) => ({ category: i.category, detail: i.detail, q: i.taskQuestion })),
      pedagogicalIssues: ped.issues.map((i) => ({ category: i.category, detail: i.detail })),
      invariantErrors: invErrors,
      samples,
    };
    console.log(`GATE_RESULT_JSON${JSON.stringify(result)}GATE_RESULT_END`);

    expect(invErrors, `strukturální invarianty:\n${invErrors.join("\n")}`).toHaveLength(0);
  }, 60_000);
});
