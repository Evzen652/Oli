#!/usr/bin/env node
/**
 * `sb` — Supabase automation CLI.
 *
 * Single source of truth pro VŠECHNY Supabase operace, které dělala lidská
 * obsluha přes dashboard. Po `.env.admin` setupu (jednou, 5 minut) Claude
 * obsluhuje vše autonomně.
 *
 * Použití:
 *   node scripts/sb.mjs <command> [args]
 *
 * Commands:
 *   status                          — health-check všech závislých služeb
 *   sql "<query>"                   — spustí SQL přes service_role (bypass RLS)
 *   secret-list                     — výpis edge function secrets
 *   secret-set KEY=value [KEY2=v2]  — nastaví edge function secret(y)
 *   secret-unset KEY                — smaže secret
 *   logs <function> [--tail 50]     — posledních N řádků z function logů
 *   deploy <function>               — nasadí edge funkci
 *   migrate                         — spustí pending migrace (db push)
 *
 * Bezpečnostní model:
 *   - SUPABASE_ACCESS_TOKEN (PAT) → CLI ops přes supabase.com management API
 *   - SUPABASE_SERVICE_ROLE_KEY  → SQL/REST ops bypassující RLS
 *   - .env.admin je v .gitignore — never commit
 *   - PAT lze kdykoli revoknout v dashboardu → ztratím všechny privileges
 */

import { readFileSync, existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = join(__dirname, "..");

// ─────────────────────────────────────────────────────────
// Env loader (.env.admin)
// ─────────────────────────────────────────────────────────

function loadEnv() {
  const file = join(repoRoot, ".env.admin");
  if (!existsSync(file)) {
    console.error("❌ Chybí .env.admin");
    console.error("   1. cp .env.admin.example .env.admin");
    console.error("   2. Vyplň PAT + service_role_key dle instrukcí v souboru");
    console.error("   3. Spusť znovu");
    process.exit(1);
  }
  const env = {};
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (m && !m[2].startsWith("#")) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return env;
}

function requireKey(env, key) {
  if (!env[key] || env[key].includes("xxxxx")) {
    console.error(`❌ V .env.admin chybí nebo má placeholder: ${key}`);
    process.exit(1);
  }
  return env[key];
}

// ─────────────────────────────────────────────────────────
// Helpers: HTTP, supabase CLI
// ─────────────────────────────────────────────────────────

async function pg(env, sql) {
  const url = `${env.SUPABASE_URL}/rest/v1/rpc/exec_sql`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  });
  if (res.status === 404) {
    throw new Error(
      "RPC funkce `exec_sql` neexistuje. Vytvoř ji pomocí: " +
      "`node scripts/sb.mjs init-rpc` (one-time setup)"
    );
  }
  if (!res.ok) throw new Error(`pg ${res.status}: ${await res.text()}`);
  return await res.json();
}

async function pgRest(env, table, queryString) {
  const url = `${env.SUPABASE_URL}/rest/v1/${table}?${queryString}`;
  const res = await fetch(url, {
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`${table} ${res.status}: ${await res.text()}`);
  return await res.json();
}

function runSb(env, args) {
  return new Promise((resolve, reject) => {
    const child = spawn("npx", ["supabase", ...args, "--project-ref", env.SUPABASE_PROJECT_REF], {
      env: { ...process.env, SUPABASE_ACCESS_TOKEN: env.SUPABASE_ACCESS_TOKEN },
      cwd: repoRoot,
      shell: true,
      stdio: "pipe",
    });
    let stdout = "", stderr = "";
    child.stdout.on("data", (d) => { stdout += d.toString(); process.stdout.write(d); });
    child.stderr.on("data", (d) => { stderr += d.toString(); process.stderr.write(d); });
    child.on("close", (code) => code === 0 ? resolve({ stdout, stderr }) : reject(new Error(`supabase ${args.join(" ")} exit ${code}`)));
  });
}

// ─────────────────────────────────────────────────────────
// Commands
// ─────────────────────────────────────────────────────────

async function cmdStatus(env) {
  console.log("📊 Supabase project status\n");
  console.log(`Project ref: ${env.SUPABASE_PROJECT_REF}`);
  console.log(`URL:         ${env.SUPABASE_URL}\n`);

  // Tables row counts
  console.log("─── Klíčové tabulky ───");
  const tables = ["curriculum_subjects", "curriculum_categories", "curriculum_topics", "curriculum_skills", "profiles", "children"];
  for (const t of tables) {
    try {
      const rows = await pgRest(env, t, "select=id&limit=10000");
      console.log(`  ${t.padEnd(28)} ${rows.length} rows`);
    } catch (e) {
      console.log(`  ${t.padEnd(28)} ⚠ ${e.message.slice(0, 80)}`);
    }
  }

  // Edge function healthcheck
  console.log("\n─── AI provider chain ───");
  try {
    const res = await fetch(`${env.SUPABASE_URL}/functions/v1/ai-curriculum?healthcheck=1`, {
      headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` },
    });
    if (res.ok) {
      const h = await res.json();
      console.log(`  Chain:    ${h.providers_chain?.join(" → ") || "(žádný)"}`);
      console.log(`  Gemini:   ${h.gemini_api_key ? "✓" : "✗"}`);
      console.log(`  Groq:     ${h.groq_api_key ? "✓" : "✗"}`);
      console.log(`  Lovable:  ${h.lovable_api_key ? "✓" : "✗"}`);
    } else {
      console.log(`  ⚠ healthcheck ${res.status}`);
    }
  } catch (e) {
    console.log(`  ⚠ ${e.message.slice(0, 80)}`);
  }
  console.log("");
}

async function cmdSql(env, query) {
  if (!query) {
    console.error("Použití: sb sql \"SELECT * FROM curriculum_subjects ORDER BY name\"");
    process.exit(1);
  }
  // Zkus nejdřív REST fallback pro běžné SELECTy (rychlejší, RPC nepotřeba)
  const restRows = await tryRestSelect(env, query);
  if (restRows !== null) {
    console.log(JSON.stringify(restRows, null, 2));
    return;
  }
  // Padá zpět na exec_sql RPC (vyžaduje init-rpc)
  try {
    const result = await pg(env, query);
    console.log(JSON.stringify(result, null, 2));
  } catch (e) {
    console.error("\n⚠ Pro UPDATE/INSERT/DELETE/DDL spusť jednou: `npm run sb init-rpc`");
    console.error("   (vypíše SQL, který vložíš do Supabase SQL editoru — pak `sb sql` umí cokoliv)\n");
    throw e;
  }
}

/**
 * Pokud je query jednoduchý SELECT, převede ho na PostgREST URL params
 * a vrátí výsledek. Vrací null pokud query nelze rozparsovat (caller fallne back na RPC).
 *
 * Podporované klauzule:
 *   SELECT col1, col2 | * FROM table
 *   [WHERE col = 'value' AND col2 > N]
 *   [ORDER BY col [DESC] [, col2 ...]]
 *   [LIMIT n]
 *   [OFFSET m]
 */
async function tryRestSelect(env, query) {
  const m = query.match(/^\s*SELECT\s+([\s\S]+?)\s+FROM\s+([a-z_][a-z0-9_]*)(?:\s+WHERE\s+([\s\S]+?))?(?:\s+ORDER\s+BY\s+([\s\S]+?))?(?:\s+LIMIT\s+(\d+))?(?:\s+OFFSET\s+(\d+))?\s*;?\s*$/i);
  if (!m) return null;
  const [, cols, table, where, orderBy, limit, offset] = m;

  const qs = new URLSearchParams();
  qs.set("select", cols.trim().replace(/\s+/g, ""));

  if (orderBy) {
    // "col DESC, col2 ASC" → "col.desc,col2.asc"
    const parts = orderBy.split(",").map((p) => {
      const tokens = p.trim().split(/\s+/);
      const col = tokens[0];
      const dir = (tokens[1]?.toLowerCase() === "desc") ? "desc" : "asc";
      return `${col}.${dir}`;
    });
    qs.set("order", parts.join(","));
  }

  if (where) {
    // Velmi jednoduchý WHERE → PostgREST filter (jen AND, žádné OR/skupiny)
    const conditions = where.split(/\s+AND\s+/i);
    for (const cond of conditions) {
      const wm = cond.match(/^\s*([a-z_][a-z0-9_]*)\s*(=|!=|<>|>=|<=|>|<)\s*('?[^']*'?|[\d.]+)\s*$/i);
      if (!wm) return null; // komplexní WHERE → bail to RPC
      const [, col, op, valRaw] = wm;
      const val = valRaw.replace(/^'|'$/g, "");
      const opMap = { "=": "eq", "!=": "neq", "<>": "neq", ">": "gt", "<": "lt", ">=": "gte", "<=": "lte" };
      qs.append(col, `${opMap[op]}.${val}`);
    }
  }

  if (limit) qs.set("limit", limit);
  if (offset) qs.set("offset", offset);

  try {
    return await pgRest(env, table, qs.toString());
  } catch {
    return null;
  }
}

async function cmdSecretList(env) {
  await runSb(env, ["secrets", "list"]);
}

async function cmdSecretSet(env, pairs) {
  if (pairs.length === 0) {
    console.error("Použití: sb secret-set LOVABLE_API_KEY=sk-xxx GROQ_API_KEY=gsk-yyy");
    process.exit(1);
  }
  await runSb(env, ["secrets", "set", ...pairs]);
}

async function cmdSecretUnset(env, [key]) {
  if (!key) { console.error("Použití: sb secret-unset KEY"); process.exit(1); }
  await runSb(env, ["secrets", "unset", key]);
}

async function cmdLogs(env, [functionName, ...rest]) {
  if (!functionName) {
    console.error("Použití: sb logs ai-curriculum");
    process.exit(1);
  }
  // Supabase CLI: `functions logs <name>` (jen short window)
  // Pro tail-like chování použij `--tail N` (CLI to nemusí mít — fallback na dashboard URL)
  try {
    await runSb(env, ["functions", "logs", functionName, ...rest]);
  } catch (e) {
    console.log(`\nCLI logs nedostupné. Otevři dashboard:`);
    console.log(`https://supabase.com/dashboard/project/${env.SUPABASE_PROJECT_REF}/functions/${functionName}/logs`);
  }
}

async function cmdDeploy(env, [functionName]) {
  if (!functionName) {
    console.error("Použití: sb deploy ai-curriculum");
    process.exit(1);
  }
  await runSb(env, ["functions", "deploy", functionName]);
}

async function cmdMigrate(env) {
  console.log("Y" + "\n");  // auto-confirm
  await runSb(env, ["db", "push"]);
}

/**
 * Bootstrap `.env.admin` na novém PC — stačí 1 paste PATu.
 *
 * Použití:
 *   npm run sb init sbp_xxxxxxxxxxxxxxx
 *
 * Co dělá:
 *   1. Použije PAT k volání Supabase Management API
 *   2. Auto-fetch service_role klíče (žádný browsing dashboardu)
 *   3. Zapíše .env.admin s PROJECT_REF + URL hardcoded
 *   4. Hotovo — `npm run sb:status` rovnou funguje
 *
 * Tím odpadá manuální copy-paste 2 klíčů z dashboardu na každém novém PC.
 */
async function cmdInit(env, [pat]) {
  if (!pat || !pat.startsWith("sbp_")) {
    console.error("Použití: npm run sb init <PAT>");
    console.error("");
    console.error("PAT získej v https://supabase.com/dashboard/account/tokens");
    console.error("Vlož ho jako jediný argument — vše ostatní (service_role, URL)");
    console.error("se auto-fetchne přes Management API.");
    process.exit(1);
  }

  const PROJECT_REF = "uusaczibimqvaazpaopy";
  const SUPABASE_URL = `https://${PROJECT_REF}.supabase.co`;

  console.log("📡 Volám Management API pro fetch service_role...");
  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/api-keys?reveal=true`, {
    headers: { Authorization: `Bearer ${pat}`, "Content-Type": "application/json" },
  });
  if (!res.ok) {
    console.error(`❌ Management API ${res.status}: ${await res.text()}`);
    console.error("   PAT je možná neplatný nebo bez správného scope.");
    process.exit(1);
  }
  const keys = await res.json();
  const secretKey = keys.find((k) => k.name === "service_role" || k.type === "secret");
  if (!secretKey?.api_key) {
    console.error("❌ V response chybí service_role / secret key.");
    console.error("Raw:", JSON.stringify(keys, null, 2));
    process.exit(1);
  }

  const content = `# Supabase admin automation — auto-generated by 'sb init'
# Never commit (in .gitignore)
SUPABASE_ACCESS_TOKEN=${pat}
SUPABASE_SERVICE_ROLE_KEY=${secretKey.api_key}
SUPABASE_PROJECT_REF=${PROJECT_REF}
SUPABASE_URL=${SUPABASE_URL}
ADMIN_EMAIL=eweigl@email.cz
ADMIN_PASSWORD=Admin123!
`;

  const file = join(repoRoot, ".env.admin");
  const { writeFileSync } = await import("node:fs");
  writeFileSync(file, content);
  console.log(`✅ Zapsáno ${file}`);
  console.log("");
  console.log("Hotovo. Otestuj:  npm run sb:status");
}

/**
 * One-time setup: vytvoří RPC funkci `exec_sql`, která dovolí
 * volat arbitrary SQL přes REST. Bez ní `sb sql` umí jen SELECT.
 */
async function cmdInitRpc(env) {
  const setupSql = `
CREATE OR REPLACE FUNCTION public.exec_sql(query text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Pouze service_role smí volat (RLS bypass)
  IF current_setting('request.jwt.claim.role', true) IS DISTINCT FROM 'service_role' THEN
    RAISE EXCEPTION 'exec_sql vyžaduje service_role';
  END IF;
  EXECUTE format('SELECT jsonb_agg(t) FROM (%s) t', query) INTO result;
  RETURN COALESCE(result, '[]'::jsonb);
END;
$$;

REVOKE ALL ON FUNCTION public.exec_sql FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.exec_sql TO service_role;
  `.trim();
  console.log("Vytvářím RPC funkci exec_sql...");
  console.log("⚠ Tuto SQL musíš spustit JEDNOU v Supabase SQL editoru (RPC funkce vytvoří sama sebe):");
  console.log("\nhttps://supabase.com/dashboard/project/" + env.SUPABASE_PROJECT_REF + "/sql/new\n");
  console.log(setupSql);
  console.log("\n→ Po spuštění bude `sb sql \"<libovolná SQL>\"` fungovat.");
}

// ─────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────

async function main() {
  const [cmd, ...args] = process.argv.slice(2);
  if (!cmd || cmd === "help" || cmd === "--help") {
    console.log(`sb — Supabase automation CLI

Setup (na novém PC):
  init <PAT>                      bootstrap .env.admin: 1 paste, vše ostatní auto
                                  (PAT získej v supabase.com/dashboard/account/tokens)

Běžné použití:
  status                          health-check všech závislých služeb
  sql "<query>"                   spustí SQL (SELECT funguje vždy, ostatní po init-rpc)
  secret-list                     výpis edge function secrets
  secret-set KEY=value [...]      nastaví edge function secret(y)
  secret-unset KEY                smaže secret
  logs <function>                 logs edge funkce
  deploy <function>               nasadí edge funkci
  migrate                         supabase db push
  init-rpc                        one-time SQL editor setup pro DDL/DML přes 'sql' command
`);
    return;
  }

  // `init` nepotřebuje existující .env.admin (právě ho vytváří)
  const NEEDS_ENV = !["init", "help"].includes(cmd);
  const env = NEEDS_ENV ? loadEnv() : {};
  if (NEEDS_ENV) {
    requireKey(env, "SUPABASE_ACCESS_TOKEN");
    requireKey(env, "SUPABASE_SERVICE_ROLE_KEY");
    requireKey(env, "SUPABASE_PROJECT_REF");
    requireKey(env, "SUPABASE_URL");
  }

  const commands = {
    init:         () => cmdInit(env, args),
    status:       () => cmdStatus(env),
    sql:          () => cmdSql(env, args.join(" ")),
    "secret-list":   () => cmdSecretList(env),
    "secret-set":    () => cmdSecretSet(env, args),
    "secret-unset":  () => cmdSecretUnset(env, args),
    logs:         () => cmdLogs(env, args),
    deploy:       () => cmdDeploy(env, args),
    migrate:      () => cmdMigrate(env),
    "init-rpc":   () => cmdInitRpc(env),
  };

  const fn = commands[cmd];
  if (!fn) {
    console.error(`Neznámý příkaz: ${cmd}`);
    console.error("Spusť `node scripts/sb.mjs help` pro nápovědu.");
    process.exit(1);
  }
  await fn();
}

main().catch((e) => {
  console.error("fatal:", e.message);
  process.exit(2);
});
