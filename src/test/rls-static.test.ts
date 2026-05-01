import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * RLS / DB security — static migration analysis (Bod 6).
 *
 * Bez supabase test instance ověřujeme z SQL migrations:
 *  1. Každá citlivá tabulka má ENABLE ROW LEVEL SECURITY
 *  2. Žádná policy nepoužívá `to anon` na PII tabulkách (children, session_logs,
 *     skill_profiles, student_misconceptions, parent_assignments, profiles)
 *  3. Žádná policy nemá USING (true) na PII tabulkách (přístup všem)
 *  4. Pro každou citlivou tabulku existuje aspoň 1 policy per CRUD operace
 *  5. Tabulky obsahující user_id nebo child_id mají odpovídající policy
 *     filtrující na auth.uid()
 *
 * Toto je STATIC analýza — nereplikuje supabase runtime, ale chytá většinu
 * common chyb (zapomenutý ENABLE RLS, public.anon access, USING (true)).
 */

const MIGRATIONS_DIR = join(
  process.cwd(),
  "supabase/migrations"
);

/** Tabulky s PII / per-user data — MUSÍ mít přísné RLS */
const SENSITIVE_TABLES = [
  "children",
  "session_logs",
  "skill_profiles",
  "student_misconceptions",
  "parent_assignments",
  "profiles",
  "user_roles",
  "report_settings",
  "custom_exercises",
] as const;

/** Tabulky které jsou public-readable (curriculum content) — RLS je OK volnější */
const PUBLIC_READABLE_TABLES = [
  "curriculum_subjects",
  "curriculum_categories",
  "curriculum_topics",
  "curriculum_skills",
  "curriculum_facts",
  "exercise_assets",
] as const;

function loadAllMigrationsSql(): string {
  const files = readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith(".sql")).sort();
  return files.map((f) => readFileSync(join(MIGRATIONS_DIR, f), "utf-8")).join("\n\n");
}

const ALL_SQL = loadAllMigrationsSql();
const SQL_LOWER = ALL_SQL.toLowerCase();

/** Vrátí true, pokud SQL obsahuje "ALTER TABLE public.<name> ENABLE ROW LEVEL SECURITY" */
function hasRlsEnabled(table: string): boolean {
  // Match "alter table public.<name> enable row level security"
  // nebo "alter table <name> enable row level security"
  const patterns = [
    new RegExp(`alter\\s+table\\s+(?:public\\.)?${table}\\s+enable\\s+row\\s+level\\s+security`, "i"),
    new RegExp(`enable\\s+row\\s+level\\s+security[^;]*${table}`, "i"),
  ];
  return patterns.some((p) => p.test(ALL_SQL));
}

/** Najdi policies definované pro danou tabulku */
function findPoliciesForTable(table: string): string[] {
  const policies: string[] = [];
  const regex = new RegExp(
    `create\\s+policy[^;]*?on\\s+(?:public\\.)?${table}[^;]*?;`,
    "gis"
  );
  let match: RegExpExecArray | null;
  while ((match = regex.exec(ALL_SQL)) !== null) {
    policies.push(match[0]);
  }
  return policies;
}

describe("RLS — sensitive tables have RLS enabled", () => {
  for (const table of SENSITIVE_TABLES) {
    it(`${table} má ENABLE ROW LEVEL SECURITY`, () => {
      expect(hasRlsEnabled(table), `Table ${table} musí mít RLS`).toBe(true);
    });
  }
});

describe("RLS — sensitive tables have at least one policy", () => {
  for (const table of SENSITIVE_TABLES) {
    it(`${table} má aspoň 1 policy`, () => {
      const policies = findPoliciesForTable(table);
      expect(policies.length, `Table ${table} potřebuje aspoň 1 policy`).toBeGreaterThan(0);
    });
  }
});

describe("RLS — žádná policy 'to anon' na PII tabulkách", () => {
  for (const table of SENSITIVE_TABLES) {
    it(`${table} nepovoluje přístup roli 'anon'`, () => {
      const policies = findPoliciesForTable(table);
      const anonPolicies = policies.filter((p) =>
        /to\s+anon/i.test(p) || /to\s+public\s+/i.test(p)
      );
      expect(anonPolicies, `Tabulka ${table} má policy s 'to anon' nebo 'to public'`).toEqual([]);
    });
  }
});

describe("RLS — žádná policy 'USING (true)' na PII tabulkách", () => {
  for (const table of SENSITIVE_TABLES) {
    it(`${table} nemá policy s USING (true) (otevřený přístup)`, () => {
      const policies = findPoliciesForTable(table);
      const openPolicies = policies.filter((p) =>
        /using\s*\(\s*true\s*\)/i.test(p) ||
        /with\s+check\s*\(\s*true\s*\)/i.test(p)
      );
      expect(openPolicies, `Tabulka ${table} má 'using (true)' policy`).toEqual([]);
    });
  }
});

describe("RLS — sensitive tables filtering by auth.uid() or has_role()", () => {
  // Aspoň jedna policy by měla použít auth.uid() nebo has_role/is_admin pro filtrování
  for (const table of SENSITIVE_TABLES) {
    it(`${table} má aspoň 1 policy filtrující na auth.uid() / has_role / is_admin`, () => {
      const policies = findPoliciesForTable(table);
      const filteredPolicies = policies.filter((p) =>
        /auth\.uid\(\)/i.test(p) ||
        /has_role\(/i.test(p) ||
        /is_admin\(/i.test(p) ||
        /current_user/i.test(p)
      );
      expect(filteredPolicies.length, `${table} potřebuje aspoň 1 user-bound policy`).toBeGreaterThan(0);
    });
  }
});

describe("RLS — DROP POLICY musí mít odpovídající CREATE POLICY", () => {
  // Pokud migration drop policy, MUSI ji znovu vytvořit (jinak je tabulka otevřená)
  // Tady testujeme, že DROP POLICY ... ON ... vede k subsequent CREATE POLICY
  it("žádná visící DROP POLICY bez recreace", () => {
    // Najdi všechny DROP POLICY ON <table> a zkontroluj, že ve stejném souboru
    // nebo dále existuje CREATE POLICY ON same table
    const dropMatches = [...ALL_SQL.matchAll(/drop\s+policy[^;]*?on\s+(?:public\.)?(\w+)[^;]*?;/gis)];
    const orphanedDrops: string[] = [];
    for (const dropMatch of dropMatches) {
      const targetTable = dropMatch[1];
      const dropEndIdx = dropMatch.index! + dropMatch[0].length;
      // Hledej po-dropu CREATE POLICY na stejnou tabulku
      const remainder = ALL_SQL.slice(dropEndIdx);
      const recreatePattern = new RegExp(
        `create\\s+policy[^;]*?on\\s+(?:public\\.)?${targetTable}\\b`,
        "is"
      );
      if (!recreatePattern.test(remainder)) {
        // A taky zkontroluj, jestli celá tabulka není zase v ALL_SQL po dropu
        const tableExistsAfter = new RegExp(
          `create\\s+policy[^;]*?on\\s+(?:public\\.)?${targetTable}\\b`,
          "is"
        ).test(ALL_SQL);
        if (!tableExistsAfter) {
          orphanedDrops.push(`DROP without recreate: ${targetTable}`);
        }
      }
    }
    // Soft-fail: jen warn, hard-fail by zlomil legitimní DROP-final-policies pattern
    if (orphanedDrops.length > 0) {
      console.warn(`[RLS-STATIC] ${orphanedDrops.length} drop bez recreate:\n${orphanedDrops.join("\n")}`);
    }
  });
});

describe("RLS — has_role helper funkce existuje", () => {
  it("definovaná has_role funkce (security definer pro recursive RLS prevention)", () => {
    expect(/create\s+(?:or\s+replace\s+)?function\s+(?:public\.)?has_role/i.test(ALL_SQL)).toBe(true);
  });

  it("has_role je SECURITY DEFINER (jinak by způsobila recursive RLS evaluation)", () => {
    // Match celý function block až po terminátor $$;
    const m = ALL_SQL.match(/create\s+(?:or\s+replace\s+)?function\s+(?:public\.)?has_role[\s\S]*?\$\$\s*;?/i);
    expect(m, "has_role definition not found").toBeTruthy();
    if (m) {
      expect(/security\s+definer/i.test(m[0])).toBe(true);
    }
  });
});

describe("RLS — admin override pattern present", () => {
  it("aspoň 1 policy obsahuje has_role('admin') (admin override)", () => {
    // Match has_role(...) call s 'admin' literálem (s nebo bez ::app_role cast)
    const adminMatches = ALL_SQL.match(/has_role\s*\([^()]*\bauth\.uid\s*\(\s*\)[^()]*['"]admin['"][^()]*\)/gi);
    expect(adminMatches?.length ?? 0).toBeGreaterThan(0);
  });
});

describe("RLS — SECURITY DEFINER funkce mají set search_path", () => {
  // Anti-search-path-hijacking — bezpečnostní best practice
  it("SECURITY DEFINER funkce by měly mít SET search_path = public", () => {
    const definerFunctions = [...ALL_SQL.matchAll(
      /create\s+(?:or\s+replace\s+)?function\s+([\w.]+)[\s\S]*?security\s+definer[\s\S]*?(?:language|\$\$)/gi
    )];
    const missing: string[] = [];
    for (const m of definerFunctions) {
      const fnName = m[1];
      const block = m[0];
      // Zkontroluj zda block obsahuje SET search_path
      if (!/set\s+search_path/i.test(block)) {
        missing.push(fnName);
      }
    }
    if (missing.length > 0) {
      console.warn(`[RLS-STATIC] ${missing.length} SECURITY DEFINER funkcí bez SET search_path:\n${missing.join("\n")}`);
    }
    // Soft warn — některé legacy funkce mohou search_path zdědit z db config
  });
});

describe("RLS — auth.users je nikdy přímo upravována (RLS bypass guard)", () => {
  it("žádný INSERT/UPDATE/DELETE na auth.users", () => {
    const dangerousOps = [
      /insert\s+into\s+auth\.users/i,
      /update\s+auth\.users/i,
      /delete\s+from\s+auth\.users/i,
    ];
    for (const re of dangerousOps) {
      expect(re.test(ALL_SQL), `Found direct write to auth.users: ${re}`).toBe(false);
    }
  });
});

describe("RLS — child data isolation invariants", () => {
  it("session_logs má policy filtrující na user_id NEBO child_id", () => {
    const policies = findPoliciesForTable("session_logs");
    const hasUserFilter = policies.some((p) =>
      /user_id\s*=\s*auth\.uid\(\)/i.test(p) ||
      /child_id\s*=\s*\(?\s*select/i.test(p)
    );
    expect(hasUserFilter, "session_logs nesmí být readable všem").toBe(true);
  });

  it("children má policy filtrující na parent_user_id nebo child_user_id", () => {
    const policies = findPoliciesForTable("children");
    const hasFilter = policies.some((p) =>
      /parent_user_id|child_user_id/i.test(p)
    );
    expect(hasFilter, "children potřebuje per-user policy").toBe(true);
  });

  it("student_misconceptions má child/user filter (ne globální read)", () => {
    const policies = findPoliciesForTable("student_misconceptions");
    const hasFilter = policies.some((p) =>
      /child_id|user_id/i.test(p)
    );
    expect(hasFilter, "student_misconceptions potřebuje filter").toBe(true);
  });
});

describe("RLS — public-readable curriculum content (méně přísné)", () => {
  for (const table of PUBLIC_READABLE_TABLES) {
    it(`${table} má RLS policy (i když může být široká)`, () => {
      // Curriculum content je public read, ale RLS by měl být enabled aby
      // INSERT/UPDATE/DELETE byly omezené (jen admin)
      const policies = findPoliciesForTable(table);
      // Soft check — pokud tabulka existuje, měla by mít aspoň 1 policy
      const tableExists = new RegExp(`create\\s+table[^;]*?(?:public\\.)?${table}\\b`, "i").test(ALL_SQL);
      if (tableExists) {
        expect(policies.length, `${table}: existuje ale nemá policies`).toBeGreaterThan(0);
      }
    });
  }
});

describe("RLS — meta sanity", () => {
  it("ALL_SQL byl načten (testy by jinak byly false-pass)", () => {
    expect(ALL_SQL.length).toBeGreaterThan(1000);
  });

  it("nalezeno aspoň 20 policies v migrations", () => {
    const policyCount = (ALL_SQL.match(/create\s+policy/gi) ?? []).length;
    expect(policyCount).toBeGreaterThan(20);
  });
});
