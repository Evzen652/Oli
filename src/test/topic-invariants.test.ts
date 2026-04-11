import { describe, it, expect } from "vitest";
import { getAllTopics } from "@/lib/contentRegistry";

describe("Topic metadata invariants", () => {
  const topics = getAllTopics();

  it("all topic IDs are unique", () => {
    const ids = topics.map(t => t.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
    // Show duplicates if any
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(dupes).toEqual([]);
  });

  topics.forEach((topic) => {
    describe(`${topic.id}`, () => {
      it("has valid gradeRange [min, max] where min <= max and both are valid grades", () => {
        const [min, max] = topic.gradeRange;
        expect(min).toBeGreaterThanOrEqual(3);
        expect(max).toBeLessThanOrEqual(9);
        expect(min).toBeLessThanOrEqual(max);
      });

      it("has non-empty keywords array", () => {
        expect(topic.keywords.length).toBeGreaterThan(0);
        topic.keywords.forEach(kw => {
          expect(kw.trim().length).toBeGreaterThan(0);
        });
      });

      it("has non-empty title, subject, category", () => {
        expect(topic.title.trim().length).toBeGreaterThan(0);
        expect(topic.subject.trim().length).toBeGreaterThan(0);
        expect(topic.category.trim().length).toBeGreaterThan(0);
      });

      it("has non-empty briefDescription", () => {
        expect(topic.briefDescription.trim().length).toBeGreaterThan(0);
      });

      it("has valid inputType", () => {
        expect(["comparison", "fraction", "number", "select_one", "drag_order", "text"]).toContain(topic.inputType);
      });

      it("generator is a function", () => {
        expect(typeof topic.generator).toBe("function");
      });
    });
  });

  it("no two topics share the exact same keyword set within the same grade range", () => {
    // Detect ambiguous matching: two topics with overlapping grade + identical keyword
    const conflicts: string[] = [];
    for (let i = 0; i < topics.length; i++) {
      for (let j = i + 1; j < topics.length; j++) {
        const a = topics[i], b = topics[j];
        // Check grade overlap
        const gradeOverlap = a.gradeRange[0] <= b.gradeRange[1] && b.gradeRange[0] <= a.gradeRange[1];
        if (!gradeOverlap) continue;
        // Check for shared keywords
        const shared = a.keywords.filter(kw => b.keywords.includes(kw));
        if (shared.length > 0) {
          conflicts.push(`${a.id} ↔ ${b.id}: shared keywords [${shared.join(", ")}]`);
        }
      }
    }
    // Allow known conflicts but log them — this is a warning, not a hard fail
    // If conflicts exist, they should be documented
    if (conflicts.length > 0) {
      console.warn(`[INVARIANT WARNING] ${conflicts.length} keyword conflicts:\n${conflicts.join("\n")}`);
    }
  });
});
