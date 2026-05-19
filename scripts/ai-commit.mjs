#!/usr/bin/env node
/**
 * Commit AI proposals do DB.
 *
 * Použití:
 *   node scripts/ai-commit.mjs              # přečte .tmp-proposals.json
 *   node scripts/ai-commit.mjs --dry-run    # ukáže INSERT, ale neprovede
 *   node scripts/ai-commit.mjs path/to.json # custom soubor
 *
 * Co dělá:
 *   1. Načte proposals z JSON souboru
 *   2. Validuje (slug formát, parent ref)
 *   3. Pro categories: najde subject_id podle subject_slug, vloží
 *   4. Pro topics: najde category_id podle category_slug, vloží
 *   5. Vypíše inserted rows
 *
 * Bezpečnost:
 *   Používá service_role key (bypass RLS).
 *   Vždy validuje slug formát před INSERT.
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

async function pg(env, method, path, body) {
  const url = `${env.SUPABASE_URL}/rest/v1/${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${path} ${res.status}: ${text.slice(0, 200)}`);
  return text ? JSON.parse(text) : null;
}

function isValidSlug(s) { return /^[a-z][a-z0-9-]*$/.test(s); }

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const fileArg = args.find((a) => !a.startsWith("--"));
  const file = fileArg ? (fileArg.startsWith("/") || fileArg.match(/^[A-Z]:/) ? fileArg : join(repoRoot, fileArg)) : join(repoRoot, ".tmp-proposals.json");

  if (!existsSync(file)) {
    console.error(`Soubor neexistuje: ${file}`);
    console.error("Nejprve spusť: node scripts/ai-generate.mjs categories <subject> <grade>");
    process.exit(1);
  }

  const env = loadEnv();
  const { proposals } = JSON.parse(readFileSync(file, "utf8"));
  if (!proposals?.length) {
    console.error("Žádné proposals v souboru.");
    process.exit(1);
  }

  console.log(`📄 ${proposals.length} proposalů ze souboru ${file}`);
  if (dryRun) console.log(`🔍 DRY RUN — žádné INSERT nebudou provedeny\n`);

  // Pre-fetch parent ID mapping pro performance
  const allSubjects = await pg(env, "GET", "curriculum_subjects?select=id,slug");
  const allCategories = await pg(env, "GET", "curriculum_categories?select=id,slug,subject_id");
  const subjectIdBySlug = Object.fromEntries(allSubjects.map((s) => [s.slug, s.id]));
  const categoryIdBySlug = Object.fromEntries(allCategories.map((c) => [c.slug, c.id]));

  let success = 0, failed = 0;
  for (const p of proposals) {
    const d = p.data;

    if (p.type === "category" && p.action === "create") {
      if (!isValidSlug(d.slug)) { console.log(`❌ ${d.slug}: neplatný slug`); failed++; continue; }
      const subjectId = subjectIdBySlug[d.subject_slug];
      if (!subjectId) { console.log(`❌ ${d.name}: subject "${d.subject_slug}" neexistuje`); failed++; continue; }

      const row = {
        name: d.name, slug: d.slug, subject_id: subjectId,
        description: d.description || null, fun_fact: d.fun_fact || null,
        sort_order: d.sort_order ?? 0,
      };
      if (dryRun) {
        console.log(`[DRY] INSERT category: ${row.name} (subject_id=${subjectId})`);
      } else {
        try {
          const inserted = await pg(env, "POST", "curriculum_categories", row);
          console.log(`✓ category: ${inserted[0].name} → ${inserted[0].id}`);
          categoryIdBySlug[inserted[0].slug] = inserted[0].id;
          success++;
        } catch (e) {
          console.log(`❌ ${d.name}: ${e.message}`);
          failed++;
        }
      }
    } else if (p.type === "topic" && p.action === "create") {
      if (!isValidSlug(d.slug)) { console.log(`❌ ${d.slug}: neplatný slug`); failed++; continue; }
      const catId = categoryIdBySlug[d.category_slug];
      if (!catId) { console.log(`❌ ${d.name}: category "${d.category_slug}" neexistuje`); failed++; continue; }

      const row = {
        name: d.name, slug: d.slug, category_id: catId,
        description: d.description || null, sort_order: d.sort_order ?? 0,
      };
      if (dryRun) {
        console.log(`[DRY] INSERT topic: ${row.name} (category_id=${catId})`);
      } else {
        try {
          const inserted = await pg(env, "POST", "curriculum_topics", row);
          console.log(`✓ topic: ${inserted[0].name} → ${inserted[0].id}`);
          success++;
        } catch (e) {
          console.log(`❌ ${d.name}: ${e.message}`);
          failed++;
        }
      }
    } else {
      console.log(`⏭ ${p.type}/${p.action}: prozatím nepodporováno`);
    }
  }

  if (dryRun) {
    console.log(`\n🔍 DRY RUN dokončen.`);
  } else {
    console.log(`\n✅ Vloženo: ${success} | ❌ Selhalo: ${failed}`);
  }
}

main().catch((e) => { console.error("fatal:", e.message); process.exit(2); });
