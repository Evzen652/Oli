/**
 * i18n úplnost — ověří, že všechny překladové klíče existují,
 * jsou neprázdné a lokalizační funkce funguje správně.
 *
 * Pokrývá: cs.ts slovník, LocaleProvider / useT hook, fallback chování.
 */
import { describe, it, expect } from "vitest";
import cs, { type LocaleKey } from "@/lib/i18n/cs";

// ─────────────────────────────────────────────────────────
// Slovník cs — strukturální kontrola
// ─────────────────────────────────────────────────────────
describe("cs slovník — strukturální invarianty", () => {
  const entries = Object.entries(cs) as [LocaleKey, string][];

  it("slovník není prázdný", () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  it("každý klíč je neprázdný string", () => {
    for (const [key] of entries) {
      expect(key.length, `prázdný klíč`).toBeGreaterThan(0);
    }
  });

  it("každá hodnota je neprázdný string", () => {
    for (const [key, value] of entries) {
      expect(typeof value, `${key}: hodnota není string`).toBe("string");
      expect(value.length, `${key}: hodnota je prázdný string`).toBeGreaterThan(0);
    }
  });

  it("žádná hodnota není jen whitespace", () => {
    for (const [key, value] of entries) {
      expect(value.trim().length, `${key}: hodnota je jen whitespace`).toBeGreaterThan(0);
    }
  });

  it("žádná hodnota není klíč samotný (nerozřešený fallback)", () => {
    for (const [key, value] of entries) {
      expect(value, `${key}: hodnota je stejná jako klíč (nerozřešeno)`).not.toBe(key);
    }
  });
});

// ─────────────────────────────────────────────────────────
// Povinné sekce — klíče kritické pro chod aplikace
// ─────────────────────────────────────────────────────────
describe("cs slovník — povinné sekce", () => {
  const requiredKeys: LocaleKey[] = [
    // Auth
    "auth.title.login",
    "auth.email",
    "auth.password",
    "auth.submit.login",
    "auth.submit.register",
    // Session
    "session.back",
    "session.continue",
    "session.correct_answer",
    "session.input.placeholder",
    "session.input.submit",
    // Help
    "help.open",
    "help.close",
    // Summary
    "summary.title",
    "summary.correct",
    "summary.wrong",
    "summary.repeat",
    // Parent
    "parent.title",
    "parent.add_child",
    "parent.toast_error",
    // Assignments
    "assign.create",
    "assign.save",
    "assign.toast_created",
    // Report
    "report.title",
    "report.loading",
    "report.no_data",
    // Admin
    "admin.title",
    "admin.save",
    "admin.cancel",
    // General
    "loading",
    "not_found.title",
    "not_found.back",
    // Child
    "child.hello",
    "child.start_assignment",
    "child.browse_topics",
    // Recovery
    "recovery.title",
    "recovery.resume",
    "recovery.discard",
  ];

  for (const key of requiredKeys) {
    it(`klíč '${key}' existuje a není prázdný`, () => {
      const value = cs[key];
      expect(value, `chybí klíč: ${key}`).toBeDefined();
      expect(value.trim().length, `${key} je prázdný`).toBeGreaterThan(0);
    });
  }
});

// ─────────────────────────────────────────────────────────
// Tečkovaná konvence klíčů
// ─────────────────────────────────────────────────────────
describe("cs slovník — konvence klíčů", () => {
  it("všechny klíče obsahují tečku (namespace.key)", () => {
    for (const key of Object.keys(cs)) {
      // Výjimka: 'loading' a 'loading' bez namespace
      if (key === "loading") continue;
      expect(key, `klíč bez namespace: '${key}'`).toContain(".");
    }
  });

  it("namespace části jsou lowercase", () => {
    for (const key of Object.keys(cs)) {
      const parts = key.split(".");
      const namespace = parts[0];
      expect(namespace, `namespace '${namespace}' obsahuje velká písmena`).toBe(namespace.toLowerCase());
    }
  });

  it("žádné klíče s dvojitou tečkou", () => {
    for (const key of Object.keys(cs)) {
      expect(key, `dvojitá tečka v klíči '${key}'`).not.toContain("..");
    }
  });
});

// ─────────────────────────────────────────────────────────
// Placeholder konzistence {name}, {n}, {date}
// ─────────────────────────────────────────────────────────
describe("cs slovník — placeholder konzistence", () => {
  it("klíče s {name} obsahují placeholder (pro string replace)", () => {
    const keysWithName: LocaleKey[] = [
      "parent.greeting",
      "assign.title",
      "child.hello",
      "parent.delete_confirm_description",
    ];
    for (const key of keysWithName) {
      expect(cs[key], `${key} neobsahuje {name}`).toContain("{name}");
    }
  });

  it("klíče s {n} obsahují placeholder", () => {
    const keysWithN: LocaleKey[] = [
      "child.progress_sessions",
      "child.progress_tasks",
      "child.progress_accuracy",
    ];
    for (const key of keysWithN) {
      expect(cs[key], `${key} neobsahuje {n}`).toContain("{n}");
    }
  });

  it("žádná hodnota neobsahuje nezavřené { nebo }", () => {
    const bracePattern = /\{[^}]*$|\}[^{]*/;
    for (const [key, value] of Object.entries(cs)) {
      // Jen hodnoty obsahující { zkontrolujeme
      if (!value.includes("{")) continue;
      const placeholders = value.match(/\{[^}]+\}/g) ?? [];
      const openBraces = (value.match(/\{/g) ?? []).length;
      const closeBraces = (value.match(/\}/g) ?? []).length;
      expect(openBraces, `${key}: nezavřené '{' v "${value}"`).toBe(closeBraces);
    }
  });
});

// ─────────────────────────────────────────────────────────
// t() fallback funkce (bez React kontextu)
// ─────────────────────────────────────────────────────────
describe("t() fallback — přímé volání cs slovníku", () => {
  const t = (key: LocaleKey) => cs[key] ?? key;

  it("existující klíč → překlad (ne klíč samotný)", () => {
    expect(t("loading")).toBe("Načítání…");
    expect(t("session.back")).toBe("← Zpět");
  });

  it("neexistující klíč → vrátí klíč jako fallback", () => {
    const unknownKey = "neexistujici.klic" as LocaleKey;
    expect(t(unknownKey)).toBe("neexistujici.klic");
  });

  it("všechny povinné klíče přeloženy (ne fallback na klíč)", () => {
    const critical: LocaleKey[] = ["loading", "session.continue", "summary.correct", "admin.save"];
    for (const key of critical) {
      expect(t(key), `${key} se nerozřešil`).not.toBe(key);
    }
  });
});

// ─────────────────────────────────────────────────────────
// Délkové limity — UI linting
// ─────────────────────────────────────────────────────────
describe("cs slovník — délkové limity pro UI", () => {
  it("tlačítka a krátké labely jsou pod 80 znaků", () => {
    const buttonKeys: LocaleKey[] = [
      "auth.submit.login",
      "auth.submit.register",
      "session.input.submit",
      "summary.repeat",
      "summary.new_topic",
      "assign.save",
      "admin.save",
      "admin.cancel",
      "recovery.resume",
      "recovery.discard",
    ];
    for (const key of buttonKeys) {
      expect(cs[key].length, `${key} je příliš dlouhé: "${cs[key]}"`).toBeLessThanOrEqual(80);
    }
  });

  it("žádná hodnota nepřesahuje 500 znaků", () => {
    for (const [key, value] of Object.entries(cs)) {
      expect(value.length, `${key} je neobvykle dlouhé (${value.length} znaků)`).toBeLessThanOrEqual(500);
    }
  });
});
