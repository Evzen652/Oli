#!/usr/bin/env node
/**
 * Live consistency check proti Supabase DB.
 *
 * Spusť: `npm run verify:curriculum`
 *
 * Co kontroluje:
 *   1. Každý subject v DB má matching entry v subjectSlugMap (jméno pasuje)
 *   2. Každý subject má grade_min ≤ grade_max (nebo oba null)
 *   3. Každý skill má valid grade range
 *   4. Žádný skill nemá osiřelý topic_id
 *   5. Žádný topic nemá osiřelý category_id
 *   6. Žádná category nemá osiřelý subject_id
 *   7. Žádný code_skill_id duplicit
 *
 * Exit kód:
 *   0 = vše OK
 *   1 = nalezeny problémy (audit failed)
 */

const SUPABASE_URL = "https://uusaczibimqvaazpaopy.supabase.co";
const ANON_KEY = "sb_publishable_33yUDPztgleFHYtChSvGKQ_rMlyktGV";

const SUBJECT_SLUG_TO_NAME = {
  matematika: "matematika",
  cestina: "čeština",
  prvouka: "prvouka",
  prirodoveda: "přírodověda",
  vlastiveda: "vlastivěda",
  biologie: "biologie",
  chemie: "chemie",
  fyzika: "fyzika",
  dejepis: "dějepis",
  zemeris: "zeměpis",
  zemeopis: "zeměpis",
  zemepis: "zeměpis",
  anglictina: "anglický jazyk",
  nemcina: "německý jazyk",
  informatika: "informatika",
  obcanska: "občanská výchova",
  hudebni: "hudební výchova",
  vytvarnahm: "výtvarná výchova",
  telesna: "tělesná výchova",
};

let issueCount = 0;
const issues = [];

function fail(msg) {
  issueCount++;
  issues.push({ severity: "ERROR", msg });
}
function warn(msg) {
  issues.push({ severity: "WARN", msg });
}

async function fetchTable(table, select) {
  const url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}`;
  const res = await fetch(url, {
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`${table}: ${res.status} ${await res.text()}`);
  return res.json();
}

async function main() {
  console.log("📚 Verifikace curriculum konzistence proti Supabase\n");

  const [subjects, categories, topics, skills] = await Promise.all([
    fetchTable("curriculum_subjects", "id,name,slug,grade_min,grade_max"),
    fetchTable("curriculum_categories", "id,name,slug,subject_id"),
    fetchTable("curriculum_topics", "id,name,slug,category_id"),
    fetchTable("curriculum_skills", "id,code_skill_id,name,topic_id,grade_min,grade_max,is_active"),
  ]);

  console.log(`   subjects=${subjects.length}  categories=${categories.length}  topics=${topics.length}  skills=${skills.length}\n`);

  // 1. Subject slug→name konzistence
  for (const s of subjects) {
    const expected = SUBJECT_SLUG_TO_NAME[s.slug];
    if (!expected) {
      warn(`subject slug "${s.slug}" není v subjectSlugMap — name="${s.name}" se nemusí normalizovat`);
    } else if (s.name.toLowerCase() !== expected) {
      warn(`subject "${s.slug}": DB name="${s.name}" ≠ map "${expected}" (frontend opraví, ale stojí to za sjednocení)`);
    }
  }

  // 2. Subject grade range integrita
  for (const s of subjects) {
    if (s.grade_min == null && s.grade_max == null) continue;
    if (s.grade_min == null || s.grade_max == null) {
      fail(`subject "${s.slug}" má jen jeden z grade_min/grade_max — to je nekonzistentní (oba nebo žádný)`);
    } else if (s.grade_min > s.grade_max) {
      fail(`subject "${s.slug}" grade_min=${s.grade_min} > grade_max=${s.grade_max}`);
    } else if (s.grade_min < 1 || s.grade_max > 9) {
      fail(`subject "${s.slug}" grade range [${s.grade_min},${s.grade_max}] mimo 1-9`);
    }
  }

  // 3. Skill grade range integrita
  for (const k of skills) {
    if (k.grade_min == null || k.grade_max == null) {
      fail(`skill "${k.code_skill_id}" nemá grade_min/grade_max`);
    } else if (k.grade_min > k.grade_max) {
      fail(`skill "${k.code_skill_id}" grade_min > grade_max`);
    } else if (k.grade_min < 1 || k.grade_max > 9) {
      fail(`skill "${k.code_skill_id}" grade range [${k.grade_min},${k.grade_max}] mimo 1-9`);
    }
  }

  // 4-6. Orphaned foreign keys
  const subjectIds = new Set(subjects.map((s) => s.id));
  const categoryIds = new Set(categories.map((c) => c.id));
  const topicIds = new Set(topics.map((t) => t.id));

  for (const c of categories) {
    if (!subjectIds.has(c.subject_id)) {
      fail(`category "${c.slug}" odkazuje na neexistující subject_id=${c.subject_id}`);
    }
  }
  for (const t of topics) {
    if (!categoryIds.has(t.category_id)) {
      fail(`topic "${t.slug}" odkazuje na neexistující category_id=${t.category_id}`);
    }
  }
  for (const k of skills) {
    if (!topicIds.has(k.topic_id)) {
      fail(`skill "${k.code_skill_id}" odkazuje na neexistující topic_id=${k.topic_id}`);
    }
  }

  // 7. Duplicate code_skill_id
  const seenCodeSkills = new Map();
  for (const k of skills) {
    if (!k.code_skill_id) continue;
    if (seenCodeSkills.has(k.code_skill_id)) {
      fail(`duplikátní code_skill_id "${k.code_skill_id}" (ids: ${seenCodeSkills.get(k.code_skill_id)}, ${k.id})`);
    } else {
      seenCodeSkills.set(k.code_skill_id, k.id);
    }
  }

  // Reporting
  console.log("─".repeat(60));
  const errs = issues.filter((i) => i.severity === "ERROR");
  const warns = issues.filter((i) => i.severity === "WARN");

  if (warns.length > 0) {
    console.log(`\n⚠️  Warnings (${warns.length}):`);
    for (const w of warns) console.log(`   • ${w.msg}`);
  }
  if (errs.length > 0) {
    console.log(`\n❌ Errors (${errs.length}):`);
    for (const e of errs) console.log(`   • ${e.msg}`);
    console.log("\n→ DB má nekonzistence. Oprav je migrací před commitem.\n");
    process.exit(1);
  }
  console.log(`\n✅ Curriculum konzistentní. ${warns.length === 0 ? "Nula warnings." : `${warns.length} warning(s) k uvážení.`}\n`);
}

main().catch((e) => {
  console.error("verify-curriculum: fatal:", e.message);
  process.exit(2);
});
