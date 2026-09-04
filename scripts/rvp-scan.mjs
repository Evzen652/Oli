#!/usr/bin/env node
/**
 * Sken korpusu na obsah NAD RÁMEC RVP daného ročníku.
 * Nehledá délku ani strukturu — hledá odborné termíny mimo obor ročníku.
 *
 * Použití:
 *   node scripts/rvp-scan.mjs . [práh]      # výchozí práh skóre = 6
 *
 * ⚠️ ZNÁMÉ SLEPÉ MÍSTO (ověřeno 2026-09-01): slovník TERMS pokrývá anatomii,
 * farmakologii, medicínu a část psychologie, ale NEZNÁ evoluční terminologii
 * (konvergentní evoluce, adaptivní radiace, ekologická nika) ani odbornou
 * fyziologii (metabolismus, echolokace). Kvůli tomu u tří témat ohlásil
 * jedinou úlohu tam, kde byla mimo ročník celá úroveň L3.
 * Skenu věř, že něco našel — ne že našel všechno.
 *
 * ⚠️ Váhy jsou globální, nezohledňují téma: „hormon" je u dospívání a
 * rozmnožovací soustavy NÁPLNÍ ročníku, ne přešlapem. Nálezy čti s hlavou.
 *
 * Užitečný vedlejší výstup: u každého tématu vypíše i jeho `boundaries`,
 * takže je vidět, když si soubor protiřečí s vlastní deklarovanou hranicí.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.argv[2];
const CONTENT = join(ROOT, "src/content");

// Slovník. Klíč = termín (lowercase), hodnota = [kategorie, váha].
// Váha 3 = jednoznačně mimo 1. stupeň, 1 = jen signál k ověření.
const TERMS = {
  // anatomie / fyziologie
  "nucleus accumbens": ["anatomie", 3], "prefrontální": ["anatomie", 3],
  "hipokamp": ["anatomie", 3], "amygdal": ["anatomie", 3],
  "mozková kůra": ["anatomie", 3], "šedá kůra": ["anatomie", 3],
  "synapse": ["anatomie", 3], "synaptick": ["anatomie", 3],
  "neuron": ["anatomie", 2], "myelin": ["anatomie", 3],
  "axon": ["anatomie", 3], "dendrit": ["anatomie", 3],
  "alveol": ["anatomie", 3], "nefron": ["anatomie", 3],
  "epitel": ["anatomie", 3], "peristalti": ["anatomie", 3],
  "enzym": ["anatomie", 2], "hormon": ["anatomie", 2],
  "endokrin": ["anatomie", 3], "hypofýz": ["anatomie", 3],
  "cirkadián": ["anatomie", 3], "mozeček": ["anatomie", 2],

  // neurochemie / farmakologie
  "acetylcholin": ["farmakologie", 3], "endokanabinoid": ["farmakologie", 3],
  "kanabinoid": ["farmakologie", 3], "dopamin": ["farmakologie", 3],
  "serotonin": ["farmakologie", 3], "opioid": ["farmakologie", 3],
  "receptor": ["farmakologie", 3], "neurotransmiter": ["farmakologie", 3],
  "antihistaminik": ["farmakologie", 3], "abstinenční syndrom": ["farmakologie", 2],

  // medicínské postupy a zkratky
  "abcde": ["medicína", 3], "triáž": ["medicína", 3],
  "defibril": ["medicína", 3], "epipen": ["medicína", 3],
  "auto-injektor": ["medicína", 3], "tourniquet": ["medicína", 3],
  "škrtidlo": ["medicína", 3], "anafylakt": ["medicína", 3],
  "komorová fibrilace": ["medicína", 3], "kardiopulmonální": ["medicína", 3],
  "izotermick": ["medicína", 3], "primární průzkum": ["medicína", 3],
  "hypotermie": ["medicína", 2], "tepenné krvácení": ["medicína", 2],
  "žilní krvácení": ["medicína", 2], "krevní tlak": ["medicína", 2],
  "infarkt": ["medicína", 2], "heimlich": ["medicína", 2],
  "resuscitace": ["medicína", 2], "sterilní": ["medicína", 1],

  // odborná psychologie / vývojová teorie
  "erikson": ["psychologie", 3], "piaget": ["psychologie", 3],
  "kognitivn": ["psychologie", 3], "sebepojet": ["psychologie", 2],
  "adolescen": ["psychologie", 2], "identita": ["psychologie", 2],

  // jazykové kalky (nejsou nad RVP, ale jsou špatně česky)
  "sebeobrázek": ["jazyk-kalk", 3],

  // chemie / fyzika nad rámec 1. stupně
  "iont": ["chemie", 3], "oxidace": ["chemie", 3],
  "molekul": ["chemie", 2], "atom": ["chemie", 2],
  "kinetick": ["fyzika", 3], "potenciáln": ["fyzika", 3],
  "gravitačn": ["fyzika", 2],
};

// morfologické vzory — typicky odborné koncovky
const PATTERNS = [
  [/\b\w{5,}(ózní|óza)\b/gi, "koncovka -óza/-ózní", 2],
  [/\b\w{4,}(itida|émie)\b/gi, "koncovka -itida/-émie", 3],
  [/\b[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]{3,6}\b/g, "velká zkratka", 1],
];

// zkratky, které jsou na 1. stupni v pořádku
const ABBR_OK = new Set([
  "EU", "ČR", "USA", "KDE", "CO", "KOLIK", "STAV", "TVOJE", "ANO", "NE",
  "DNA", "SMS", "PC", "TV", "AND", "OR", "NOT", "L1", "L2", "L3", "PROČ",
  "JAK", "KDY", "KDO", "NEBO", "ALE", "NIKDY", "VŽDY", "POZOR", "NESMÍ",
]);

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e.endsWith(".ts") && e !== "index.ts" && e !== "navigation.ts") out.push(p);
  }
  return out;
}

// uživatelsky viditelné texty: question / correctAnswer / options / hint
function extractText(src) {
  const chunks = [];
  const re = /(question|correctAnswer|hint|explanation)\s*:\s*"([^"]*)"/g;
  let m;
  while ((m = re.exec(src))) chunks.push(m[2]);
  const optRe = /options\s*:\s*\[([^\]]*)\]/g;
  while ((m = optRe.exec(src))) {
    const sRe = /"([^"]*)"/g;
    let s;
    while ((s = sRe.exec(m[1]))) chunks.push(s[1]);
  }
  return chunks;
}

function field(src, name) {
  const m = src.match(new RegExp(name + '\\s*:\\s*"([^"]*)"'));
  return m ? m[1] : "";
}

function boundaries(src) {
  const m = src.match(/boundaries\s*:\s*\[([^\]]*)\]/s);
  if (!m) return [];
  return [...m[1].matchAll(/"([^"]*)"/g)].map((x) => x[1]).filter(Boolean);
}

const files = walk(CONTENT);
const results = [];

for (const f of files) {
  const rel = relative(ROOT, f).replace(/\\/g, "/");
  const gm = rel.match(/grade-(\d)/);
  if (!gm) continue;
  const grade = Number(gm[1]);
  const src = readFileSync(f, "utf8");
  const texts = extractText(src);
  if (!texts.length) continue;

  const hits = new Map();
  const blob = texts.join("\n");
  const lower = blob.toLowerCase();

  for (const [term, [cat, w]] of Object.entries(TERMS)) {
    if (lower.includes(term)) {
      hits.set(term, { cat, w, n: lower.split(term).length - 1 });
    }
  }
  for (const [re, label, w] of PATTERNS) {
    const found = blob.match(re) || [];
    const filtered = label === "velká zkratka"
      ? found.filter((x) => !ABBR_OK.has(x))
      : found;
    if (filtered.length) {
      const uniq = [...new Set(filtered)].slice(0, 8);
      hits.set(label + ": " + uniq.join(","), { cat: label, w, n: filtered.length });
    }
  }
  if (!hits.size) continue;

  let score = 0;
  for (const { w, n } of hits.values()) score += w * Math.min(n, 4);
  // 1. stupeň = g2-g5; g6 je 2. stupeň, tam je laťka výš
  if (grade >= 6) score = Math.round(score / 3);

  results.push({
    rel, grade, score,
    title: field(src, "title"),
    boundaries: boundaries(src),
    hits: [...hits.entries()].sort((a, b) => b[1].w * b[1].n - a[1].w * a[1].n),
  });
}

results.sort((a, b) => b.score - a.score);

const THRESHOLD = Number(process.argv[3] || 6);
console.log("SOUBORU CELKEM: " + files.length + " | S NALEZY: " + results.length);
console.log("=".repeat(90));
for (const r of results) {
  if (r.score < THRESHOLD) continue;
  console.log("\n[" + r.score + "] g" + r.grade + "  " + r.title);
  console.log("     " + r.rel);
  if (r.boundaries.length) console.log("     boundaries: " + r.boundaries.join(" | "));
  for (const [term, d] of r.hits.slice(0, 10)) {
    console.log("       - " + term + "  (" + d.cat + ", vaha " + d.w + ", " + d.n + "x)");
  }
}
console.log("\n" + "=".repeat(90));
console.log("POD PRAHEM (score < " + THRESHOLD + "): " + results.filter((r) => r.score < THRESHOLD).length);
