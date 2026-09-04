#!/usr/bin/env node
/**
 * UI audit — CLI.
 *
 * Hledá vady třídy „prvek slibuje něco, co nedělá". Typecheck ani testy je
 * nechytí: kód je validní a všechno „funguje", jen to neznamená, co tvrdí.
 * Rozbor jednotlivých pravidel a chyb, ze kterých vznikla, je v
 * `scripts/uiAudit/rules.mjs` a v `docs/UI_AUDIT.md`.
 *
 * Použití:
 *   npm run audit:ui                 # report + baseline guard (CI)
 *   npm run audit:ui -- --all        # vypíše i to, co je v baseline
 *   npm run audit:ui -- --json       # strojově čitelný výstup
 *   npm run audit:ui -- --fix        # opraví jen prokazatelně bezpečná pravidla
 *   npm run audit:ui -- --update-baseline
 *   npm run audit:ui -- --root <dir> # audit jiného stromu (např. starého commitu)
 *
 * BASELINE: repo má historický dluh. Guard proto selže jen na NOVÉM nálezu —
 * stejný přístup jako `scripts/typecheck.mjs`. Když nálezů ubude, připomene
 * snížení baseline.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runAudit, fingerprint } from "./uiAudit/engine.mjs";
import { RULES } from "./uiAudit/rules.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const BASELINE_PATH = path.join(HERE, "ui-audit-baseline.json");

const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const valueOf = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : null; };

const root = valueOf("--root") ? path.resolve(valueOf("--root")) : REPO;
const findings = runAudit(root, RULES);

// ── --fix ────────────────────────────────────────────────────────────────────
if (has("--fix")) {
  const fixable = findings.filter((f) => f.fix?.kind === "remove-import-specifier");
  if (fixable.length === 0) {
    console.log("Nic bezpečně opravitelného. (Automaticky se opravuje jen `unused-import` — " +
      "u ostatních pravidel je „oprava\" produktové rozhodnutí, ne mechanická náhrada.)");
    process.exit(0);
  }
  const byFile = new Map();
  for (const f of fixable) {
    if (!byFile.has(f.file)) byFile.set(f.file, []);
    byFile.get(f.file).push(f);
  }
  let changed = 0;
  for (const [rel, list] of byFile) {
    const abs = path.join(root, rel);
    let text = fs.readFileSync(abs, "utf8");
    for (const f of list) {
      const next = removeImportSpecifier(text, f.fix.name);
      if (next !== text) { text = next; changed++; }
    }
    fs.writeFileSync(abs, text);
    console.log(`✏️  ${rel}: odstraněno ${list.length}× nepoužitý import`);
  }
  console.log(`\n✅ Opraveno ${changed} nepoužitých importů. Ostatní nálezy vyžadují rozhodnutí — spusť bez --fix.`);
  process.exit(0);
}

/**
 * Odstraní jeden pojmenovaný specifier z importu. Když zbude prázdný `{}`
 * a nic dalšího, zmizí celý řádek.
 */
function removeImportSpecifier(text, name) {
  const importRe = /import\s+(type\s+)?\{([^}]*)\}\s*from\s*(['"][^'"]+['"]);?[ \t]*\r?\n?/g;
  // `type X` uvnitř závorek je pořád specifier `X` — bez tohohle by inline
  // type-importy autofix minul (a tiše je nechal viset).
  const matches = (part) => {
    const bare = part.replace(/^type\s+/, "").trim();
    return bare === name || bare.endsWith(` as ${name}`) || bare.startsWith(`${name} as `);
  };
  return text.replace(importRe, (whole, typeKw, inner, spec) => {
    const parts = inner.split(",").map((s) => s.trim()).filter(Boolean);
    if (!parts.some(matches)) return whole;
    const kept = parts.filter((p) => !matches(p));
    if (kept.length === 0) return "";
    return `import ${typeKw ?? ""}{ ${kept.join(", ")} } from ${spec};\n`;
  });
}

// ── baseline ─────────────────────────────────────────────────────────────────
const baseline = fs.existsSync(BASELINE_PATH)
  ? new Set(JSON.parse(fs.readFileSync(BASELINE_PATH, "utf8")).accepted)
  : new Set();

if (has("--update-baseline")) {
  const accepted = [...new Set(findings.map(fingerprint))].sort();
  fs.writeFileSync(BASELINE_PATH, `${JSON.stringify({
    note: "Přijaté (zatím neopravené) nálezy UI auditu. Guard selže jen na NOVÉM. Seznam jen zkracuj.",
    updated: new Date().toISOString().slice(0, 10),
    accepted,
  }, null, 2)}\n`);
  console.log(`✅ Baseline aktualizována: ${accepted.length} přijatých nálezů.`);
  process.exit(0);
}

const fresh = findings.filter((f) => !baseline.has(fingerprint(f)));
const shown = has("--all") ? findings : fresh;

if (has("--json")) {
  console.log(JSON.stringify({ total: findings.length, fresh: fresh.length, findings: shown }, null, 2));
  process.exit(fresh.length > 0 ? 1 : 0);
}

// ── report ───────────────────────────────────────────────────────────────────
const byRule = new Map();
for (const f of shown) {
  if (!byRule.has(f.rule)) byRule.set(f.rule, []);
  byRule.get(f.rule).push(f);
}

if (shown.length === 0) {
  console.log(`✅ UI audit: žádný nový nález. (V baseline je ${baseline.size} přijatých.)`);
  if (findings.length < baseline.size) {
    console.log(`   Nálezů ubylo (${findings.length} < ${baseline.size}) — spusť \`npm run audit:ui -- --update-baseline\`.`);
  }
  process.exit(0);
}

console.log(`\n🔎 UI audit — ${shown.length} ${has("--all") ? "nálezů celkem" : "NOVÝCH nálezů"}\n`);
for (const [ruleId, list] of byRule) {
  const r = list[0];
  console.log(`── ${ruleId} — ${r.title} (${list.length}×)`);
  console.log(`   PROČ:    ${wrap(r.why)}`);
  console.log(`   NÁVRH:   ${wrap(r.suggestion)}`);
  console.log(`   PŮVOD:   ${wrap(r.origin)}`);
  console.log(`   OPRAVA:  ${r.autofixable ? "automatická (--fix)" : "vyžaduje rozhodnutí"}`);
  for (const f of list) console.log(`   • ${f.file}:${f.line} — ${f.message}`);
  console.log("");
}

if (!has("--all") && fresh.length > 0) {
  console.error(`❌ ${fresh.length} nových nálezů oproti baseline.`);
  console.error("   Oprav je, nebo (je-li to vědomé rozhodnutí) `npm run audit:ui -- --update-baseline`.");
  process.exit(1);
}
process.exit(0);

function wrap(s, width = 92, indent = "            ") {
  const words = String(s).split(/\s+/);
  const lines = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > width) { lines.push(line.trim()); line = w; }
    else line += ` ${w}`;
  }
  if (line.trim()) lines.push(line.trim());
  return lines.join(`\n${indent}`);
}
