/**
 * UI audit — jádro.
 *
 * PROČ TENHLE NÁSTROJ EXISTUJE
 * ----------------------------
 * Během auditu rodičovského dashboardu (2026-09-04) vyšlo najevo, že chyby,
 * které nejvíc kazí dojem z produktu, mají společný tvar: **prvek slibuje něco,
 * co nedělá.** Tlačítko „Skrýt", které neskryje. Pole „Poznámky k učení", které
 * nikdo nečte. Pilulka „8 dní v řadě", kde dny v řadě nejsou. Hotová komponenta,
 * kterou nikdo nerenderuje.
 *
 * Typecheck ani testy je nechytí — kód je validní a všechno „funguje", jen to
 * neznamená, co tvrdí. Zato mají v AST rozpoznatelný otisk. Každé pravidlo tady
 * proto vzniklo z KONKRÉTNÍ chyby, která se v repu opravdu stala, a v poli
 * `origin` na sebe má odkaz.
 *
 * Nástroj hlásí a navrhuje řešení. Automaticky opravuje jen to, co je
 * prokazatelně bezpečné (viz `autofix` u jednotlivých pravidel) — u zbytku by
 * „oprava" byla produktové rozhodnutí, ne mechanická náhrada.
 */
import ts from "typescript";
import fs from "node:fs";
import path from "node:path";

/** Adresáře, které se auditují. */
const SCAN_DIRS = ["src"];

/**
 * Co se přeskakuje a proč:
 *  - `components/ui` = shadcn primitiva, přebíráme je zvenčí a schválně jsou
 *    širší, než co používáme,
 *  - testy a fixtury schválně obsahují vzory, které pravidla hledají,
 *  - `integrations/supabase` je generovaný.
 */
const SKIP = [
  /[\\/]components[\\/]ui[\\/]/,
  /[\\/]test[\\/]/,
  /\.test\.tsx?$/,
  /[\\/]__tests__[\\/]/,
  /[\\/]integrations[\\/]supabase[\\/]/,
  /[\\/]content[\\/]grade-/,
  /[\\/]lib[\\/]content[\\/]/,
];

function walkDir(dir, out = []) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === "dist") continue;
      walkDir(full, out);
    } else if (/\.tsx?$/.test(e.name)) {
      out.push(full);
    }
  }
  return out;
}

/** Projde AST do hloubky. */
export function walk(node, fn) {
  fn(node);
  node.forEachChild((c) => walk(c, fn));
}

/** Načte a naparsuje projekt. */
export function loadProject(root) {
  const files = [];
  for (const dir of SCAN_DIRS) {
    for (const abs of walkDir(path.join(root, dir))) {
      const rel = path.relative(root, abs).replace(/\\/g, "/");
      if (SKIP.some((re) => re.test(abs))) continue;
      const text = fs.readFileSync(abs, "utf8");
      const sf = ts.createSourceFile(rel, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
      files.push({ abs, rel, text, sf });
    }
  }

  // Rejstřík importů napříč projektem — pro pravidlo o mrtvých komponentách.
  const importedNames = new Set();
  const importedModules = new Set();
  for (const f of files) {
    walk(f.sf, (n) => {
      if (ts.isImportDeclaration(n) && ts.isStringLiteral(n.moduleSpecifier)) {
        importedModules.add(normalizeModule(n.moduleSpecifier.text, f.rel));
        const c = n.importClause;
        if (!c) return;
        if (c.name) importedNames.add(c.name.text);
        if (c.namedBindings && ts.isNamedImports(c.namedBindings)) {
          for (const el of c.namedBindings.elements) importedNames.add(el.name.text);
        }
      }
      // Líné importy v routách: `lazy(() => import("@/pages/X"))`
      if (ts.isCallExpression(n) && n.expression.kind === ts.SyntaxKind.ImportKeyword) {
        const arg = n.arguments[0];
        if (arg && ts.isStringLiteral(arg)) importedModules.add(normalizeModule(arg.text, f.rel));
      }
    });
  }

  return { root, files, importedNames, importedModules };
}

/** `@/components/X` i `./X` srovná na `src/...` bez přípony. */
function normalizeModule(spec, fromRel) {
  if (spec.startsWith("@/")) return `src/${spec.slice(2)}`.replace(/\.(tsx?|jsx?)$/, "");
  if (spec.startsWith(".")) {
    const joined = path.posix.join(path.posix.dirname(fromRel), spec);
    return joined.replace(/\.(tsx?|jsx?)$/, "");
  }
  return spec;
}

export function moduleIdOf(rel) {
  return rel.replace(/\.(tsx?)$/, "");
}

/** Pozice `file:line` pro hlášení. */
export function loc(file, node) {
  const { line } = file.sf.getLineAndCharacterOfPosition(node.getStart(file.sf));
  return { file: file.rel, line: line + 1 };
}

/** Spustí sadu pravidel nad projektem. */
export function runAudit(root, rules) {
  const project = loadProject(root);
  const findings = [];
  for (const rule of rules) {
    for (const file of project.files) {
      rule.check(file, project, (node, message, extra = {}) => {
        const at = node ? loc(file, node) : { file: file.rel, line: 1 };
        findings.push({
          rule: rule.id,
          title: rule.title,
          why: rule.why,
          suggestion: rule.suggestion,
          origin: rule.origin,
          autofixable: Boolean(rule.autofix),
          message,
          ...at,
          ...extra,
        });
      });
    }
  }
  findings.sort((a, b) =>
    a.rule.localeCompare(b.rule) || a.file.localeCompare(b.file) || a.line - b.line);
  return findings;
}

/** Stabilní klíč nálezu pro baseline — bez čísla řádku, ať drobný posun kódu nešumí. */
export function fingerprint(f) {
  return `${f.rule}|${f.file}|${f.message}`;
}
