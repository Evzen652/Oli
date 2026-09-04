import { describe, it, expect, beforeAll, afterAll } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
// @ts-expect-error — nástroj je plain ESM v `scripts/`, stejně jako `typecheck.mjs`.
import { runAudit } from "../../scripts/uiAudit/engine.mjs";
// @ts-expect-error — viz výše.
import { RULES } from "../../scripts/uiAudit/rules.mjs";

/**
 * UI audit — pravidla zamčená proti reálným tvarům chyb.
 *
 * Každý test odpovídá chybě, která se v repu opravdu stala (2026-09-04). Fixtury
 * jsou zkrácené, ale tvar mají shodný s originálem — kdyby pravidlo někdo
 * rozvolnil, spadne to tady, ne až na produkci.
 *
 * Stejně důležitá je druhá polovina: **co se hlásit NEMÁ.** Detektor, který
 * křičí na běžný kód, se do měsíce vypne.
 */

let dir: string;

/** Postaví dočasný „projekt" a spustí nad ním audit. */
function audit(files: Record<string, string>) {
  const root = fs.mkdtempSync(path.join(dir, "p-"));
  for (const [rel, text] of Object.entries(files)) {
    const abs = path.join(root, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, text);
  }
  return runAudit(root, RULES) as { rule: string; file: string; message: string }[];
}

const rulesHit = (findings: { rule: string }[]) => [...new Set(findings.map((f) => f.rule))].sort();

beforeAll(() => { dir = fs.mkdtempSync(path.join(os.tmpdir(), "ui-audit-")); });
afterAll(() => { fs.rmSync(dir, { recursive: true, force: true }); });

describe("stuck-toggle — přepínač, který nejde přepnout", () => {
  it("odhalí `open={open || derived}` s `onOpenChange`", () => {
    // Přesný tvar bugu z ChildActivityChart: tlačítko „Skrýt" nešlo použít.
    const f = audit({
      "src/components/Chart.tsx": `
        export function Chart() {
          const [open, setOpen] = useState(false);
          const shouldDefaultOpen = true;
          return <Collapsible open={open || shouldDefaultOpen} onOpenChange={setOpen}>x</Collapsible>;
        }`,
    });
    expect(rulesHit(f)).toContain("stuck-toggle");
  });

  it("tříhodnotová oprava (`open ?? default`) se už nehlásí", () => {
    const f = audit({
      "src/components/Chart.tsx": `
        export function Chart() {
          const [open, setOpen] = useState<boolean | null>(null);
          const isOpen = open ?? true;
          return <Collapsible open={isOpen} onOpenChange={setOpen}>x</Collapsible>;
        }`,
    });
    expect(rulesHit(f)).not.toContain("stuck-toggle");
  });

  it("`value={x || \"all\"}` u Selectu NENÍ nález (sentinel, ne uvíznutí)", () => {
    const f = audit({
      "src/components/Picker.tsx": `
        export function Picker() {
          const [subject, setSubject] = useState("");
          return <Select value={subject || "all"} onValueChange={setSubject} />;
        }`,
    });
    expect(rulesHit(f)).not.toContain("stuck-toggle");
  });
});

describe("dead-component — komponenta, kterou nikdo nerenderuje", () => {
  it("odhalí exportovanou komponentu bez jediného importu", () => {
    const f = audit({ "src/components/Orphan.tsx": `export function Orphan() { return <div />; }` });
    expect(f.filter((x) => x.rule === "dead-component")).toHaveLength(1);
  });

  it("komponenta importovaná jinde se nehlásí", () => {
    const f = audit({
      "src/components/Used.tsx": `export function Used() { return <div />; }`,
      "src/pages/Page.tsx": `import { Used } from "@/components/Used";
        export default function Page() { return <Used />; }`,
    });
    // `Page` sama nikam napojená není, takže se hlásí — a je to správně, stránka
    // bez routy je taky mrtvý kód. Ověřujeme tedy konkrétně `Used`.
    const dead = f.filter((x) => x.rule === "dead-component").map((x) => x.file);
    expect(dead).not.toContain("src/components/Used.tsx");
    expect(dead).toContain("src/pages/Page.tsx");
  });
});

describe("utc-day-key — klíč dne v UTC", () => {
  it("odhalí `toISOString().slice(0, 10)`", () => {
    const f = audit({
      "src/lib/stats.ts": `export const dayKey = (iso: string) => new Date(iso).toISOString().slice(0, 10);`,
    });
    expect(rulesHit(f)).toContain("utc-day-key");
  });

  it("místní varianta (`toLocaleDateString(\"en-CA\")`) se nehlásí", () => {
    const f = audit({
      "src/lib/stats.ts": `export const dayKey = (iso: string) => new Date(iso).toLocaleDateString("en-CA");`,
    });
    expect(rulesHit(f)).not.toContain("utc-day-key");
  });
});

describe("write-only-state — stav, který se nikde nečte", () => {
  it("odhalí `editNotes`, který se jen nastavuje", () => {
    // Tvar z ParentDashboard: „Poznámky k učení" šlo zapsat, ne přečíst.
    const f = audit({
      "src/pages/Dash.tsx": `
        export default function Dash() {
          const [editNotes, setEditNotes] = useState("");
          const start = (c: any) => setEditNotes(c.learning_notes ?? "");
          return <button onClick={() => start({})}>x</button>;
        }`,
    });
    expect(f.filter((x) => x.rule === "write-only-state")).toHaveLength(1);
  });

  it("stav, který se vykresluje, se nehlásí", () => {
    const f = audit({
      "src/pages/Dash.tsx": `
        export default function Dash() {
          const [notes, setNotes] = useState("");
          return <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />;
        }`,
    });
    expect(rulesHit(f)).not.toContain("write-only-state");
  });
});

describe("branch-only-action — akce jen v jedné větvi", () => {
  it("odhalí handler navěšený jen v dřívějším returnu", () => {
    // Tvar z ChildMisconceptions: „Spustit AI analýzu" mizelo, jakmile nálezy byly.
    const f = audit({
      "src/components/M.tsx": `
        export function M({ data }: any) {
          const handleAnalyze = async () => {};
          if (data.length === 0) {
            return <button onClick={handleAnalyze}>Spustit</button>;
          }
          return <div>{data.map((d: any) => <p key={d.id}>{d.t}</p>)}</div>;
        }`,
    });
    expect(rulesHit(f)).toContain("branch-only-action");
  });

  it("handler v obou větvích se nehlásí", () => {
    const f = audit({
      "src/components/M.tsx": `
        export function M({ data }: any) {
          const handleAnalyze = async () => {};
          const btn = <button onClick={handleAnalyze}>Spustit</button>;
          if (data.length === 0) return btn;
          return <div>{btn}</div>;
        }`,
    });
    expect(rulesHit(f)).not.toContain("branch-only-action");
  });

  it("běžný formulář s jedním `handleSubmit` NENÍ nález", () => {
    const f = audit({
      "src/pages/Form.tsx": `
        export default function Form() {
          const handleSubmit = async () => {};
          return <form onSubmit={handleSubmit}><input /></form>;
        }`,
    });
    expect(rulesHit(f)).not.toContain("branch-only-action");
  });
});

describe("streak-language — text tvrdí sérii, kterou kód nepočítá", () => {
  it("odhalí „v řadě\" nad `daysActive`", () => {
    const f = audit({
      "src/components/Home.tsx": `
        export function Home({ stats }: any) {
          const d = stats.daysActive;
          return <span>{\`\${d} dní v řadě\`}</span>;
        }`,
    });
    expect(rulesHit(f)).toContain("streak-language");
  });

  it("„máš za sebou N úloh\" NENÍ nález (idiom pro hotovo)", () => {
    const f = audit({
      "src/components/Home.tsx": `
        export function Home({ stats }: any) {
          const d = stats.daysActive;
          return <span>{\`máš za sebou \${d} úloh\`}</span>;
        }`,
    });
    expect(rulesHit(f)).not.toContain("streak-language");
  });

  it("skutečná série (`error_streak`) se nehlásí", () => {
    const f = audit({ "src/lib/cs.ts": `export const s = { streak: "× chyba v řadě" };` });
    expect(rulesHit(f)).not.toContain("streak-language");
  });
});

describe("adhoc-subject-map — vlastní mapa předmětů", () => {
  it("odhalí odvození předmětu z prefixu legacy ID", () => {
    const f = audit({
      "src/components/Chart.tsx": `
        export function Chart({ id }: any) {
          const e = id.startsWith("math") ? "🔢" : "📚";
          return <span>{e}</span>;
        }`,
    });
    expect(rulesHit(f)).toContain("adhoc-subject-map");
  });
});

describe("empty-state-null — prázdný stav vrací null", () => {
  it("odhalí `if (x.length === 0) return null`", () => {
    const f = audit({
      "src/components/List.tsx": `
        export function List({ items }: any) {
          if (items.length === 0) return null;
          return <ul>{items.map((i: any) => <li key={i} />)}</ul>;
        }`,
    });
    expect(rulesHit(f)).toContain("empty-state-null");
  });

  it("prázdný stav s vysvětlením se nehlásí", () => {
    const f = audit({
      "src/components/List.tsx": `
        export function List({ items }: any) {
          if (items.length === 0) return <p>Zatím tu nic není.</p>;
          return <ul>{items.map((i: any) => <li key={i} />)}</ul>;
        }`,
    });
    expect(rulesHit(f)).not.toContain("empty-state-null");
  });
});

describe("unused-import", () => {
  it("odhalí importovaný, ale nezavolaný `useT`", () => {
    const f = audit({
      "src/components/A.tsx": `import { useT } from "@/lib/i18n";
        export function A() { return <div />; }`,
    });
    expect(f.filter((x) => x.rule === "unused-import")).toHaveLength(1);
  });

  it("použitý import se nehlásí", () => {
    const f = audit({
      "src/components/A.tsx": `import { useT } from "@/lib/i18n";
        export function A() { const t = useT(); return <div>{t("x")}</div>; }`,
    });
    expect(rulesHit(f)).not.toContain("unused-import");
  });
});

describe("každé pravidlo nese návrh řešení a původ", () => {
  it("žádné pravidlo není bez odůvodnění", () => {
    for (const r of RULES as { id: string; why: string; suggestion: string; origin: string }[]) {
      expect(r.why, `${r.id}: chybí PROČ`).toBeTruthy();
      expect(r.suggestion, `${r.id}: chybí NÁVRH`).toBeTruthy();
      expect(r.origin, `${r.id}: chybí PŮVOD (z jaké reálné chyby vzniklo)`).toBeTruthy();
    }
  });
});
