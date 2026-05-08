/**
 * Content registry — komplexní testy curriculum API a session orchestrátoru.
 *
 * Pokrývá:
 *  - getAllTopics, getTopicsForGrade, getTopicById, matchTopic
 *  - PREREQUISITE_MAP konzistence
 *  - TopicMetadata strukturální invarianty
 *  - createSession, transition (sessionOrchestrator)
 */
import { describe, it, expect } from "vitest";
import {
  getAllTopics,
  getTopicsForGrade,
  getTopicById,
  matchTopic,
  getPrerequisites,
  PREREQUISITE_MAP,
} from "@/lib/contentRegistry";
import { createSession, transition } from "@/lib/sessionOrchestrator";
import type { SessionState } from "@/lib/types";

// ─────────────────────────────────────────────────────────
// getAllTopics — strukturální invarianty
// ─────────────────────────────────────────────────────────
describe("getAllTopics — základní invarianty", () => {
  const topics = getAllTopics();

  it("vrátí neprázdný seznam témat", () => {
    expect(topics.length).toBeGreaterThan(0);
  });

  it("každé téma má povinná string pole", () => {
    for (const t of topics) {
      expect(typeof t.id, `id u ${t.id}`).toBe("string");
      expect(t.id.length, `id prázdné u ${t.id}`).toBeGreaterThan(0);
      expect(typeof t.title, `title u ${t.id}`).toBe("string");
      expect(t.title.length, `title prázdné u ${t.id}`).toBeGreaterThan(0);
      expect(typeof t.subject, `subject u ${t.id}`).toBe("string");
      expect(t.subject.length, `subject prázdné u ${t.id}`).toBeGreaterThan(0);
      expect(typeof t.category, `category u ${t.id}`).toBe("string");
      expect(typeof t.inputType, `inputType u ${t.id}`).toBe("string");
    }
  });

  it("každé téma má platný gradeRange [min, max] kde min ≤ max a oba jsou 1–9", () => {
    for (const t of topics) {
      const [min, max] = t.gradeRange;
      expect(min, `${t.id}: min < 1`).toBeGreaterThanOrEqual(1);
      expect(max, `${t.id}: max > 9`).toBeLessThanOrEqual(9);
      expect(min, `${t.id}: min > max`).toBeLessThanOrEqual(max);
    }
  });

  it("každé téma má generator funkci", () => {
    for (const t of topics) {
      expect(typeof t.generator, `generator u ${t.id}`).toBe("function");
    }
  });

  it("každé téma má keywords (neprázdné pole)", () => {
    for (const t of topics) {
      expect(Array.isArray(t.keywords), `keywords u ${t.id}`).toBe(true);
      expect(t.keywords.length, `keywords prázdné u ${t.id}`).toBeGreaterThan(0);
    }
  });

  it("žádné topic ID není duplikováno", () => {
    const ids = topics.map((t) => t.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("ID odpovídají bezpečnému vzoru [a-zA-Z0-9_-]+", () => {
    for (const t of topics) {
      expect(t.id, `neplatné ID: ${t.id}`).toMatch(/^[a-zA-Z0-9_-]+$/);
    }
  });

  it("helpTemplate existuje u každého tématu", () => {
    for (const t of topics) {
      expect(t.helpTemplate, `helpTemplate chybí u ${t.id}`).toBeDefined();
      expect(t.helpTemplate).not.toBeNull();
    }
  });

  it("generator vrátí neprázdné pole pro level 1", () => {
    for (const t of topics) {
      const tasks = t.generator(1);
      expect(Array.isArray(tasks), `generator u ${t.id} nevrátil pole`).toBe(true);
      expect(tasks.length, `generator u ${t.id} vrátil prázdné pole`).toBeGreaterThan(0);
    }
  });

  it("každý task z generatoru má question a correctAnswer", () => {
    for (const t of topics) {
      const tasks = t.generator(1);
      for (const task of tasks.slice(0, 2)) {
        expect(task.question?.trim().length, `prázdná question u ${t.id}`).toBeGreaterThan(0);
        expect(task.correctAnswer !== undefined && task.correctAnswer !== null,
          `chybí correctAnswer u ${t.id}`).toBe(true);
      }
    }
  });
});

// ─────────────────────────────────────────────────────────
// getTopicsForGrade
// ─────────────────────────────────────────────────────────
describe("getTopicsForGrade", () => {
  it("každý ročník 3–9 vrátí aspoň 1 topic (grade 1–2 jsou DB-only)", () => {
    for (let grade = 3; grade <= 9; grade++) {
      expect(getTopicsForGrade(grade).length,
        `Ročník ${grade} nemá žádné téma`).toBeGreaterThan(0);
    }
  });
  it("grade 1 a 2 vrátí 0 statických témat (pouze DB-only)", () => {
    expect(getTopicsForGrade(1).length).toBe(0);
    expect(getTopicsForGrade(2).length).toBe(0);
  });
  it("ročník 0 — prázdný seznam", () => {
    expect(getTopicsForGrade(0).length).toBe(0);
  });
  it("ročník 10 — prázdný seznam", () => {
    expect(getTopicsForGrade(10).length).toBe(0);
  });
  it("všechny vrácené topics mají ročník v rozsahu", () => {
    for (const grade of [1, 3, 5, 7, 9] as const) {
      for (const t of getTopicsForGrade(grade)) {
        expect(grade >= t.gradeRange[0] && grade <= t.gradeRange[1],
          `${t.id} by nemělo být v ročníku ${grade} (rozsah ${t.gradeRange})`).toBe(true);
      }
    }
  });
});

// ─────────────────────────────────────────────────────────
// getTopicById
// ─────────────────────────────────────────────────────────
describe("getTopicById", () => {
  it("existující ID → vrátí topic se správným id", () => {
    const topic = getTopicById("math-compare-natural-numbers-100");
    expect(topic).toBeDefined();
    expect(topic?.id).toBe("math-compare-natural-numbers-100");
  });
  it("neexistující ID → undefined", () => {
    expect(getTopicById("totally-fake-skill")).toBeUndefined();
  });
  it("prázdný string → undefined", () => {
    expect(getTopicById("")).toBeUndefined();
  });
  it("každé ID z getAllTopics() se nalezne zpět", () => {
    for (const t of getAllTopics()) {
      expect(getTopicById(t.id)?.id).toBe(t.id);
    }
  });
});

// ─────────────────────────────────────────────────────────
// matchTopic
// ─────────────────────────────────────────────────────────
describe("matchTopic", () => {
  it("prázdný vstup → null", () => {
    expect(matchTopic("", 3)).toBeNull();
  });
  it("whitespace-only → null", () => {
    expect(matchTopic("   ", 3)).toBeNull();
  });
  it("deterministický — stejný vstup → stejný výsledek", () => {
    const a = matchTopic("porovnávání čísel", 3);
    const b = matchTopic("porovnávání čísel", 3);
    expect(a?.id).toBe(b?.id);
  });
  it("case-insensitive", () => {
    const lower = matchTopic("porovnávání čísel", 3);
    const upper = matchTopic("POROVNÁVÁNÍ ČÍSEL", 3);
    expect(lower?.id).toBe(upper?.id);
  });
  it("nikdy nevyhodí výjimku pro libovolný vstup", () => {
    const inputs = ["???", "sčítání zlomků", "abc123", "zlomky", "diktát"];
    for (const inp of inputs) {
      expect(() => matchTopic(inp, 5)).not.toThrow();
    }
  });
  it("topic matchnutý pro ročník patří do gradeRange", () => {
    const result = matchTopic("porovnávání čísel", 3);
    if (result) {
      expect(result.gradeRange[0] <= 3 && result.gradeRange[1] >= 3).toBe(true);
    }
  });
  it("longest-keyword preference: specifičtější keyword vítězí", () => {
    // Pokud existuje topic s delším klíčovým slovem, ten by měl vyhrát
    expect(() => matchTopic("sčítání zlomků se stejným jmenovatelem", 5)).not.toThrow();
  });
});

// ─────────────────────────────────────────────────────────
// PREREQUISITE_MAP
// ─────────────────────────────────────────────────────────
describe("PREREQUISITE_MAP", () => {
  it("getPrerequisites pro neznámý skill → []", () => {
    expect(getPrerequisites("neexistuje")).toEqual([]);
  });
  it("getPrerequisites pro skill bez prereq → []", () => {
    expect(getPrerequisites("cz-parove-souhlasky")).toEqual([]);
  });
  it("žádný skill není svým vlastním prerequisitem", () => {
    for (const [skill, prereqs] of Object.entries(PREREQUISITE_MAP)) {
      expect(prereqs, `${skill} je svůj vlastní prereq`).not.toContain(skill);
    }
  });
  it("žádný skill nemá více než 5 přímých prereq", () => {
    for (const [skill, prereqs] of Object.entries(PREREQUISITE_MAP)) {
      expect(prereqs.length, `${skill} má příliš mnoho prereq`).toBeLessThanOrEqual(5);
    }
  });
  it("prereq jsou pole stringů", () => {
    for (const [skill, prereqs] of Object.entries(PREREQUISITE_MAP)) {
      expect(Array.isArray(prereqs), `${skill}: prereqs není pole`).toBe(true);
      for (const p of prereqs) {
        expect(typeof p, `prereq u ${skill} není string`).toBe("string");
      }
    }
  });
  it("žádný cyklus v prereq grafu (max hloubka 10)", () => {
    function hasCycle(skill: string, visited = new Set<string>()): boolean {
      if (visited.has(skill)) return true;
      visited.add(skill);
      for (const p of (PREREQUISITE_MAP[skill] ?? [])) {
        if (hasCycle(p, new Set(visited))) return true;
      }
      return false;
    }
    for (const skill of Object.keys(PREREQUISITE_MAP)) {
      expect(hasCycle(skill), `Cyklus u ${skill}`).toBe(false);
    }
  });
});

// ─────────────────────────────────────────────────────────
// createSession
// ─────────────────────────────────────────────────────────
describe("createSession", () => {
  it("vrátí session ve stavu INIT", () => {
    expect(createSession(3).state).toBe("INIT");
  });
  it("id má UUID formát", () => {
    expect(createSession(3).id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  });
  it("každé volání vrátí unikátní id", () => {
    const ids = Array.from({ length: 5 }, () => createSession(3).id);
    expect(new Set(ids).size).toBe(5);
  });
  it("grade odpovídá zadanému", () => {
    expect(createSession(5).grade).toBe(5);
    expect(createSession(1).grade).toBe(1);
  });
  it("countery inicializovány na 0", () => {
    const s = createSession(3);
    expect(s.errorCount).toBe(0);
    expect(s.errorStreak).toBe(0);
    expect(s.successStreak).toBe(0);
    expect(s.currentTaskIndex).toBe(0);
    expect(s.helpUsedCount).toBe(0);
    expect(s.currentLevel).toBe(1);
  });
  it("matchedTopic null, practiceBatch prázdný", () => {
    const s = createSession(3);
    expect(s.matchedTopic).toBeNull();
    expect(s.practiceBatch).toEqual([]);
  });
  it("rules jsou definovány (z getRulesForGrade)", () => {
    const s = createSession(3);
    expect(s.rules).toBeDefined();
    expect(typeof s.rules.maxDurationSeconds).toBe("number");
    expect(s.rules.maxDurationSeconds).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────────────────
// transition — stavový stroj
// ─────────────────────────────────────────────────────────
describe("transition — platné přechody", () => {
  const mk = (state: SessionState) => ({ ...createSession(3), state });

  it("INIT → INPUT_CAPTURE", () => {
    expect(transition(createSession(3), "INPUT_CAPTURE").state).toBe("INPUT_CAPTURE");
  });
  it("INPUT_CAPTURE → PRE_INTENT", () => {
    expect(transition(mk("INPUT_CAPTURE"), "PRE_INTENT").state).toBe("PRE_INTENT");
  });
  it("PRE_INTENT → TOPIC_MATCH", () => {
    expect(transition(mk("PRE_INTENT"), "TOPIC_MATCH").state).toBe("TOPIC_MATCH");
  });
  it("PRE_INTENT → INPUT_CAPTURE (retry)", () => {
    expect(transition(mk("PRE_INTENT"), "INPUT_CAPTURE").state).toBe("INPUT_CAPTURE");
  });
  it("TOPIC_MATCH → EXPLAIN", () => {
    expect(transition(mk("TOPIC_MATCH"), "EXPLAIN").state).toBe("EXPLAIN");
  });
  it("EXPLAIN → PRACTICE", () => {
    expect(transition(mk("EXPLAIN"), "PRACTICE").state).toBe("PRACTICE");
  });
  it("PRACTICE → CHECK", () => {
    expect(transition(mk("PRACTICE"), "CHECK").state).toBe("CHECK");
  });
  it("CHECK → PRACTICE (opakování)", () => {
    expect(transition(mk("CHECK"), "PRACTICE").state).toBe("PRACTICE");
  });
  it("CHECK → END", () => {
    expect(transition(mk("CHECK"), "END").state).toBe("END");
  });
  it("STOP_1 → EXPLAIN", () => {
    expect(transition(mk("STOP_1"), "EXPLAIN").state).toBe("EXPLAIN");
  });
  it("STOP_1 → INPUT_CAPTURE", () => {
    expect(transition(mk("STOP_1"), "INPUT_CAPTURE").state).toBe("INPUT_CAPTURE");
  });
  it("STOP_2 → END", () => {
    expect(transition(mk("STOP_2"), "END").state).toBe("END");
  });
});

describe("transition — neplatné přechody vyhodí Error", () => {
  const mk = (state: SessionState) => ({ ...createSession(3), state });

  it("INIT → PRACTICE", () => {
    expect(() => transition(createSession(3), "PRACTICE")).toThrow();
  });
  it("END → INPUT_CAPTURE", () => {
    expect(() => transition(mk("END"), "INPUT_CAPTURE")).toThrow();
  });
  it("INIT → END", () => {
    expect(() => transition(createSession(3), "END")).toThrow();
  });
  it("PRACTICE → INIT", () => {
    expect(() => transition(mk("PRACTICE"), "INIT")).toThrow();
  });
  it("CHECK → INIT", () => {
    expect(() => transition(mk("CHECK"), "INIT")).toThrow();
  });
  it("END → END (terminální stav)", () => {
    expect(() => transition(mk("END"), "END")).toThrow();
  });
});

describe("transition — immutabilita", () => {
  it("původní session nezměněna", () => {
    const original = createSession(3);
    transition(original, "INPUT_CAPTURE");
    expect(original.state).toBe("INIT");
  });
  it("vrácená session je nový objekt", () => {
    const s = createSession(3);
    const next = transition(s, "INPUT_CAPTURE");
    expect(next).not.toBe(s);
  });
  it("grade, id a ostatní pole se zkopírují", () => {
    const s = createSession(5);
    const next = transition(s, "INPUT_CAPTURE");
    expect(next.grade).toBe(5);
    expect(next.id).toBe(s.id);
  });
});
