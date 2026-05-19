#!/usr/bin/env node
/**
 * Live AI curriculum end-to-end test.
 *
 * Spusť: `npm run verify:ai-curriculum`
 *
 * Co dělá:
 *   1. Naloguje se jako admin (eweigl@email.cz) přes Supabase auth REST
 *   2. Pro každou stage (subject, category, topic) postaví prompt
 *   3. Zavolá ai-curriculum edge funkci
 *   4. Ověří, že odpověď obsahuje validní ```json blok s `proposals`
 *   5. Ověří, že proposaly projdou curriculumProposalValidator
 *
 * Exit kód:
 *   0 = AI integrace funguje
 *   1 = chyba (network, auth, parse, validation)
 */

const SUPABASE_URL = "https://uusaczibimqvaazpaopy.supabase.co";
const ANON_KEY = "sb_publishable_33yUDPztgleFHYtChSvGKQ_rMlyktGV";
const ADMIN_EMAIL = "eweigl@email.cz";
const ADMIN_PASSWORD = "Admin123!";

// ─────────────────────────────────────────────────────────
// Helper: HTTP
// ─────────────────────────────────────────────────────────

async function login() {
  console.log("🔐 Login...");
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: ANON_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  if (!res.ok) throw new Error(`Login failed: ${res.status} ${await res.text()}`);
  const { access_token } = await res.json();
  return access_token;
}

async function callAi(token, payload) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/ai-curriculum`, {
    method: "POST",
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const body = await res.text();
  let parsed;
  try { parsed = JSON.parse(body); } catch { parsed = { raw: body }; }
  if (!res.ok) throw new Error(`AI ${res.status}: ${parsed?.error || body.slice(0, 200)}`);
  return parsed;
}

// ─────────────────────────────────────────────────────────
// parseProposals (mirror src/components/AdminAIChat.tsx)
// ─────────────────────────────────────────────────────────

function parseProposals(text) {
  const m = text.match(/```json\s*([\s\S]*?)```/);
  if (!m) return null;
  try {
    const parsed = JSON.parse(m[1]);
    if (parsed.proposals && Array.isArray(parsed.proposals)) {
      return { proposals: parsed.proposals, explanation: parsed.explanation || "" };
    }
  } catch { /* malformed */ }
  return null;
}

// ─────────────────────────────────────────────────────────
// Prompt builders (zjednodušené verze src/lib/curriculumPromptBuilder.ts)
// ─────────────────────────────────────────────────────────

function buildSubjectPrompt(grade) {
  return `Jsi expert na české vzdělávací kurikulum (RVP ZV).

Ročník: ${grade}. třída

Navrhni nový předmět dle RVP ZV.

━━ FORMÁT ODPOVĚDI — POVINNÝ JSON ━━━━━━━━
Vrať VÝHRADNĚ JSON v bloku \`\`\`json ... \`\`\`.

\`\`\`json
{
  "proposals": [
    {
      "type": "subject", "action": "create",
      "data": { "name": "...", "slug": "...", "grade_min": 1, "grade_max": 9 }
    }
  ],
  "explanation": "..."
}
\`\`\``;
}

function buildCategoryPrompt(subject, grade) {
  const subjectSlug = subject.toLowerCase().replace(/\s+/g, "-");
  return `Jsi expert na české vzdělávací kurikulum (RVP ZV).

Předmět: ${subject}
Ročník: ${grade}. třída

Navrhni 4-6 NOVÝCH okruhů pro tento předmět.

━━ FORMÁT ODPOVĚDI — POVINNÝ JSON ━━━━━━━━
Vrať VÝHRADNĚ JSON v bloku \`\`\`json ... \`\`\`.

\`\`\`json
{
  "proposals": [
    {
      "type": "category", "action": "create",
      "data": {
        "name": "Organismy",
        "slug": "organismy",
        "subject_slug": "${subjectSlug}",
        "description": "Stavba a funkce organismů",
        "sort_order": 1
      }
    }
  ],
  "explanation": "..."
}
\`\`\`

subject_slug MUSÍ být přesně "${subjectSlug}".`;
}

function buildTopicPrompt(subject, category, grade) {
  const categorySlug = category.toLowerCase().replace(/\s+/g, "-");
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
        "category_slug": "${categorySlug}",
        "description": "Stavba a chování savců",
        "sort_order": 1
      }
    }
  ],
  "explanation": "..."
}
\`\`\`

category_slug MUSÍ být přesně "${categorySlug}".`;
}

// ─────────────────────────────────────────────────────────
// Validator (mirror src/lib/curriculumProposalValidator.ts — minimální)
// ─────────────────────────────────────────────────────────

const VALID_INPUT_TYPES = new Set([
  "text", "number", "fraction", "select_one", "comparison",
  "drag_order", "fill_blank", "multi_select", "match_pairs", "categorize",
]);

function validateMinimal(p, expectedType, parentSlug, parentField) {
  const errs = [];
  if (p.type !== expectedType) errs.push(`type "${p.type}" ≠ expected "${expectedType}"`);
  if (p.action !== "create") errs.push(`action "${p.action}" ≠ "create"`);
  if (!p.data?.name) errs.push("data.name chybí");
  if (!p.data?.slug || !/^[a-z][a-z0-9-]*$/.test(p.data.slug)) {
    errs.push(`slug "${p.data?.slug}" je neplatný`);
  }
  if (parentField && p.data?.[parentField] !== parentSlug) {
    errs.push(`${parentField} "${p.data?.[parentField]}" ≠ expected "${parentSlug}"`);
  }
  return errs;
}

// ─────────────────────────────────────────────────────────
// Test scenarios
// ─────────────────────────────────────────────────────────

async function testStage(token, name, prompt, expectedType, parentSlug, parentField, scope) {
  console.log(`\n🧪 ${name}`);
  const t0 = Date.now();
  const res = await callAi(token, {
    messages: [{ role: "user", content: prompt }],
    grade: 8,
    subject: parentField === "subject_slug" ? parentSlug : null,
    category: parentField === "category_slug" ? parentSlug : null,
    topic: null,
    scope,
  });
  const elapsed = Date.now() - t0;
  console.log(`   AI doba: ${elapsed}ms`);

  const reply = res?.reply ?? "";
  if (!reply) {
    console.log(`   ❌ Prázdná odpověď z AI`);
    console.log(`   raw:`, JSON.stringify(res).slice(0, 200));
    return false;
  }

  const parsed = parseProposals(reply);
  if (!parsed) {
    console.log(`   ❌ parseProposals vrátil null — AI nevrátilo validní JSON blok`);
    console.log(`   reply (first 300):`, reply.slice(0, 300));
    return false;
  }
  console.log(`   ✓ JSON parsován, ${parsed.proposals.length} proposalů`);

  let allValid = true;
  parsed.proposals.forEach((p, i) => {
    const errs = validateMinimal(p, expectedType, parentSlug, parentField);
    if (errs.length > 0) {
      console.log(`   ❌ proposal[${i}]:`, errs.join("; "));
      allValid = false;
    }
  });
  if (allValid) {
    console.log(`   ✅ všech ${parsed.proposals.length} proposalů projde validátorem`);
  }
  return allValid;
}

async function checkHealth() {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/ai-curriculum?healthcheck=1`, {
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
  });
  if (!res.ok) return null;
  return await res.json();
}

async function main() {
  console.log("🤖 AI curriculum end-to-end test\n");
  console.log("─".repeat(60));

  // Health check — zobraz konfigurované providery
  const health = await checkHealth();
  if (health) {
    console.log(`\n📡 AI provider chain: ${health.providers_chain.join(" → ") || "(žádný!)"}`);
    if (!health.lovable_api_key) {
      console.log(`   💡 TIP: pro vyšší odolnost přidej LOVABLE_API_KEY do Supabase secrets`);
    }
    console.log("");
  }

  let token;
  try {
    token = await login();
  } catch (e) {
    console.error("❌ Login fail:", e.message);
    process.exit(1);
  }

  const results = [];

  // Stage 1: subject (scope=subjects → bulk subjects list)
  results.push(await testStage(
    token,
    "Stage 1: Subject (8. ročník)",
    buildSubjectPrompt(8),
    "subject",
    null,
    null,
    "subjects",
  ));

  // Stage 2: category pod biologii (scope=categories → jen pod 'biologie')
  results.push(await testStage(
    token,
    "Stage 2: Categories pod 'biologie'",
    buildCategoryPrompt("biologie", 8),
    "category",
    "biologie",
    "subject_slug",
    "categories",
  ));

  // Stage 3: topic pod kategorií (scope=topics → jen pod 'organismy')
  results.push(await testStage(
    token,
    "Stage 3: Topics pod 'organismy'",
    buildTopicPrompt("biologie", "organismy", 8),
    "topic",
    "organismy",
    "category_slug",
    "topics",
  ));

  console.log("\n" + "─".repeat(60));
  const passed = results.filter(Boolean).length;
  const total = results.length;
  if (passed === total) {
    console.log(`\n✅ ${passed}/${total} stages OK — AI integrace funguje\n`);
    process.exit(0);
  } else {
    console.log(`\n❌ ${total - passed}/${total} stages selhalo\n`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("fatal:", e.message);
  process.exit(2);
});
