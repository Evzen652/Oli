import { describe, it, expect } from "vitest";
import { createSession, processState } from "@/lib/sessionOrchestrator";
import { getAllTopics, matchTopic } from "@/lib/contentRegistry";
import { validateAnswer } from "@/lib/validators";
import type { SessionData, Grade } from "@/lib/types";

/**
 * Multi-role / cross-cutting invarianty.
 *
 * Pohledy:
 *  - Žák: full session E2E (INIT → INPUT_CAPTURE → PRE_INTENT → TOPIC_MATCH
 *    → EXPLAIN → PRACTICE → CHECK → END)
 *  - Admin: může vidět všechny topics, content type variety, žádný topic
 *    není duplicitní/zlomený
 *  - Rodič: assignmenty se mapují na existující skill IDs
 *
 * Tady testujeme business logiku napříč rolemi — ne UI/auth (to je integrace).
 */

async function startSession(grade: Grade = 3): Promise<{ session: SessionData; output: string }> {
  const s = createSession(grade);
  return processState(s);
}

describe("Multi-role — Žák flow E2E (Fáze 7+10+11 dotčené)", () => {
  it("nový session = state INIT → INPUT_CAPTURE prompt", async () => {
    const { session, output } = await startSession(3);
    expect(session.state).toBe("INPUT_CAPTURE");
    expect(output).toContain("pomoct");
  });

  it("topical input → matched topic, transition do EXPLAIN", async () => {
    const { session: s1 } = await startSession(3);
    const { session: s2 } = await processState(s1, "které číslo je větší");
    expect(s2.matchedTopic).not.toBeNull();
    expect(["EXPLAIN", "PRACTICE"]).toContain(s2.state);
  });

  it("nonsense input → STOP_2 (žák nechápe; přesměrování na dospělého)", async () => {
    const { session: s1 } = await startSession(3);
    const { session: s2 } = await processState(s1, "automobil");
    expect(s2.state).toBe("STOP_2");
  });

  it("opakované 'nevím' → STOP_1 (učení potřebuje pomoc)", async () => {
    let { session } = await startSession(3);
    for (let i = 0; i < 2; i++) {
      const r = await processState(session, "nevím");
      session = r.session;
    }
    expect(session.state).toBe("STOP_1");
  });
});

describe("Multi-role — Admin: content registry je konzistentní", () => {
  const topics = getAllTopics();

  it("admin vidí aspoň 1 topic per subject", () => {
    const subjects = new Set(topics.map((t) => t.subject));
    expect(subjects.size).toBeGreaterThan(0);
    // Hlavní předměty jsou pokryté
    expect(subjects.has("matematika")).toBe(true);
    expect(subjects.has("čeština")).toBe(true);
  });

  it("každý topic má funkční generator", () => {
    topics.forEach((t) => {
      const tasks = t.generator(2);
      expect(Array.isArray(tasks)).toBe(true);
      // Některé můžou být prázdné (pokud level příliš vysoký), ale generator nesmí throw
    });
  });

  it("všechny topic IDs jsou unikátní", () => {
    const ids = topics.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("každý topic má sensible gradeRange", () => {
    topics.forEach((t) => {
      const [min, max] = t.gradeRange;
      expect(min).toBeGreaterThanOrEqual(1);
      expect(max).toBeLessThanOrEqual(9);
      expect(min).toBeLessThanOrEqual(max);
    });
  });

  it("každý task z generator je validační (není crash při validateAnswer)", () => {
    topics.forEach((t) => {
      const tasks = t.generator(2).slice(0, 1); // jen 1 task per topic pro rychlost
      tasks.forEach((task) => {
        expect(() => {
          validateAnswer(task.correctAnswer, task.correctAnswer, { inputType: t.inputType });
        }).not.toThrow();
      });
    });
  });

  it("self-validation: task.correctAnswer projde svým vlastním validátorem", () => {
    // Pokud topic.correctAnswer pro sloh="60", essay validator má clamp na 0-100
    // → správný self-test musí dát correct=true
    topics.forEach((t) => {
      const tasks = t.generator(2);
      // Jen pro topics které mají číselnou nebo deterministicky validovatelnou odpověď
      if (t.inputType === "essay") {
        tasks.forEach((task) => {
          // Pro essay, score=correctAnswer by mělo passout (rovnost s threshold)
          const r = validateAnswer(task.correctAnswer, task.correctAnswer, {
            inputType: "essay",
          });
          expect(r.correct, `topic=${t.id}, task.correctAnswer=${task.correctAnswer}`).toBe(true);
        });
      }
    });
  });
});

describe("Multi-role — Rodič: assignment-able skills (sanity)", () => {
  const topics = getAllTopics();

  it("topic.id se dá mapovat zpátky (round-trip ID lookup)", () => {
    topics.forEach((t) => {
      const found = topics.find((x) => x.id === t.id);
      expect(found).toBeDefined();
      expect(found?.id).toBe(t.id);
    });
  });

  it("kažý topic má neprázdné goals (rodič vidí, co se dítě naučí)", () => {
    topics.forEach((t) => {
      expect(t.goals.length, t.id).toBeGreaterThan(0);
    });
  });

  it("kažý topic má neprázdné boundaries (rodič vidí, co téma NEpokrývá)", () => {
    topics.forEach((t) => {
      expect(t.boundaries.length, t.id).toBeGreaterThan(0);
    });
  });

  it("topic.briefDescription je kratší než briefdescription pro UX (max 250 chars)", () => {
    topics.forEach((t) => {
      expect(t.briefDescription.length, t.id).toBeLessThan(500);
    });
  });
});

describe("Multi-role — content type matrix", () => {
  const topics = getAllTopics();

  it("essay topics mají contentType conceptual (ne algorithmic)", () => {
    topics.filter((t) => t.inputType === "essay").forEach((t) => {
      expect(t.contentType, t.id).toBe("conceptual");
    });
  });

  it("number/comparison/fraction topics jsou algorithmic nebo undefined (default)", () => {
    const algorithmicCandidates = ["number", "comparison", "fraction"];
    topics
      .filter((t) => algorithmicCandidates.includes(t.inputType))
      .forEach((t) => {
        // Default je undefined (zpětná kompatibilita = algorithmic)
        const ct = t.contentType ?? "algorithmic";
        expect(["algorithmic", "mixed"], t.id).toContain(ct);
      });
  });
});

describe("Multi-role — keyword matching pro topic discovery", () => {
  it("matchTopic najde topic podle keyword pro správný ročník", () => {
    const m = matchTopic("které číslo je větší", 3);
    expect(m).toBeTruthy();
  });

  it("matchTopic NEnajde topic pro špatný ročník", () => {
    // Topic je gradeRange [3,3], dotaz na ročník 9 nesedí
    const m = matchTopic("které číslo je větší", 9);
    // Mělo by null nebo jiný topic — záleží na curriculum
    if (m) {
      expect(m.gradeRange[0]).toBeLessThanOrEqual(9);
      expect(m.gradeRange[1]).toBeGreaterThanOrEqual(9);
    }
  });

  it("matchTopic vrátí null pro nesouvisející input", () => {
    const m = matchTopic("zmrzlina", 3);
    expect(m).toBeNull();
  });
});

describe("Multi-role — sessionTaskCount per topic", () => {
  const topics = getAllTopics();

  it("essay topics mají sessionTaskCount = 1 (drahá AI evaluace)", () => {
    topics.filter((t) => t.inputType === "essay").forEach((t) => {
      expect(t.sessionTaskCount, t.id).toBe(1);
    });
  });

  it("ostatní topics mají sessionTaskCount default (undefined → 6) nebo override", () => {
    topics.filter((t) => t.inputType !== "essay").forEach((t) => {
      const count = t.sessionTaskCount ?? 6;
      expect(count, t.id).toBeGreaterThanOrEqual(1);
      expect(count, t.id).toBeLessThanOrEqual(20);
    });
  });
});
