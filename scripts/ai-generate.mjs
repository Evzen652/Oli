#!/usr/bin/env node
/**
 * One-off AI curriculum generator.
 *
 * Použití:
 *   node scripts/ai-generate.mjs categories <subject> <grade>
 *   node scripts/ai-generate.mjs topics <subject> <category> <grade>
 *
 * Co dělá:
 *   1. Přihlásí se jako admin
 *   2. Postaví správný prompt
 *   3. Zavolá ai-curriculum edge funkci (scope-aware → málo tokenů)
 *   4. Vypíše navržené proposaly + validační report
 *   5. Vrátí JSON který lze předat insert skriptu
 */

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnv() {
  const file = join(repoRoot, ".env.admin");
  if (!existsSync(file)) { console.error("Chybí .env.admin"); process.exit(1); }
  const env = {};
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (m && !m[2].startsWith("#")) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return env;
}

// Použijeme publishable klíč pro login (anon-level access), pak admin JWT pro edge funkci
const ANON_KEY_FOR_LOGIN = "sb_publishable_33yUDPztgleFHYtChSvGKQ_rMlyktGV";

async function login(env) {
  const res = await fetch(`${env.SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: ANON_KEY_FOR_LOGIN, "Content-Type": "application/json" },
    body: JSON.stringify({ email: env.ADMIN_EMAIL, password: env.ADMIN_PASSWORD }),
  });
  if (!res.ok) throw new Error(`Login ${res.status}: ${await res.text()}`);
  return (await res.json()).access_token;
}

async function callAi(env, token, body) {
  const res = await fetch(`${env.SUPABASE_URL}/functions/v1/ai-curriculum`, {
    method: "POST",
    headers: {
      apikey: ANON_KEY_FOR_LOGIN,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let parsed; try { parsed = JSON.parse(text); } catch { parsed = { raw: text }; }
  if (!res.ok) throw new Error(`AI ${res.status}: ${parsed?.error || text.slice(0, 300)}`);
  return parsed;
}

function parseProposals(text) {
  const m = text.match(/```json\s*([\s\S]*?)```/);
  if (!m) return null;
  try {
    const parsed = JSON.parse(m[1]);
    if (parsed.proposals && Array.isArray(parsed.proposals)) {
      return { proposals: parsed.proposals, explanation: parsed.explanation || "" };
    }
  } catch { }
  return null;
}

function buildCategoryPrompt(subject, grade) {
  const slug = subject.toLowerCase().replace(/\s+/g, "-");
  return `Jsi expert na české vzdělávací kurikulum (RVP ZV).

Předmět: ${subject}
Ročník: ${grade}. třída

Navrhni 4-6 NOVÝCH okruhů pro tento předmět.

━━ FORMÁT ODPOVĚDI — POVINNÝ JSON ━━━━━━━━
Vrať VÝHRADNĚ jeden JSON code block (markdown fence s jazykem json).
Struktura níže:

\`\`\`json
{
  "proposals": [
    {
      "type": "category", "action": "create",
      "data": {
        "name": "Organismy",
        "slug": "organismy",
        "subject_slug": "${slug}",
        "description": "Stavba a funkce organismů",
        "sort_order": 1
      }
    }
  ],
  "explanation": "Krátké vysvětlení."
}
\`\`\`

Pravidla:
  • slug = lowercase ASCII, pomlčky místo mezer
  • subject_slug MUSÍ být přesně "${slug}"
  • žádné duplikáty s existujícími okruhy`;
}

function buildTopicPrompt(subject, category, grade) {
  const slug = category.toLowerCase().replace(/\s+/g, "-");
  return `Jsi expert na české vzdělávací kurikulum (RVP ZV).

Předmět: ${subject}
Okruh:   ${category}
Ročník:  ${grade}. třída

Navrhni 3-5 NOVÝCH témat pro tento okruh.

━━ FORMÁT ODPOVĚDI — POVINNÝ JSON ━━━━━━━━
\`\`\`json
{
  "proposals": [
    {
      "type": "topic", "action": "create",
      "data": {
        "name": "Savci", "slug": "savci",
        "category_slug": "${slug}",
        "description": "Stavba a chování savců",
        "sort_order": 1
      }
    }
  ],
  "explanation": "Krátké vysvětlení."
}
\`\`\`

category_slug MUSÍ být přesně "${slug}".`;
}

async function main() {
  const [type, ...args] = process.argv.slice(2);
  if (!type) {
    console.error("Použití:");
    console.error("  node scripts/ai-generate.mjs categories <subject> <grade>");
    console.error("  node scripts/ai-generate.mjs topics <subject> <category> <grade>");
    process.exit(1);
  }

  const env = loadEnv();
  console.log(`🔐 Login as ${env.ADMIN_EMAIL}...`);
  const token = await login(env);

  let prompt, scope, parentLabel;
  if (type === "categories") {
    const [subject, gradeStr] = args;
    if (!subject || !gradeStr) { console.error("categories <subject> <grade>"); process.exit(1); }
    prompt = buildCategoryPrompt(subject, parseInt(gradeStr));
    scope = "categories";
    parentLabel = `${subject} / ${gradeStr}. ročník`;
    var body = { messages: [{ role: "user", content: prompt }], grade: parseInt(gradeStr), subject, category: null, topic: null, scope };
  } else if (type === "topics") {
    const [subject, category, gradeStr] = args;
    if (!subject || !category || !gradeStr) { console.error("topics <subject> <category> <grade>"); process.exit(1); }
    prompt = buildTopicPrompt(subject, category, parseInt(gradeStr));
    scope = "topics";
    parentLabel = `${subject} / ${category} / ${gradeStr}. ročník`;
    var body = { messages: [{ role: "user", content: prompt }], grade: parseInt(gradeStr), subject, category, topic: null, scope };
  } else {
    console.error(`Neznámý typ: ${type}`);
    process.exit(1);
  }

  console.log(`\n🤖 Generuji ${type} pro: ${parentLabel}`);
  const t0 = Date.now();
  const ai = await callAi(env, token, body);
  console.log(`   AI doba: ${Date.now() - t0}ms`);

  const reply = ai.reply ?? "";
  const parsed = parseProposals(reply);
  if (!parsed) {
    console.error(`\n❌ AI nevrátila JSON. Reply:\n${reply.slice(0, 500)}`);
    process.exit(2);
  }

  console.log(`\n✅ AI vrátila ${parsed.proposals.length} návrhů:\n`);
  parsed.proposals.forEach((p, i) => {
    const d = p.data;
    console.log(`  ${i + 1}. ${d.name} (slug: ${d.slug})`);
    if (d.description) console.log(`     → ${d.description}`);
  });
  if (parsed.explanation) console.log(`\n💡 ${parsed.explanation}\n`);

  // Vrátí strukturovaný JSON do souboru pro případné použití další skriptem
  const outFile = join(repoRoot, ".tmp-proposals.json");
  await import("node:fs").then(({ writeFileSync }) =>
    writeFileSync(outFile, JSON.stringify(parsed, null, 2)),
  );
  console.log(`📄 JSON proposals zapsáno do ${outFile}`);
  console.log(`\nPro vložení do DB: node scripts/ai-commit.mjs`);
}

main().catch((e) => {
  console.error("fatal:", e.message);
  process.exit(2);
});
