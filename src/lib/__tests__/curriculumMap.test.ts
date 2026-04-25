import { describe, it, expect } from "vitest";
import {
  PARENT_TOPICS,
  EDUCATION_TRACKS,
  getParentTopicsForGrade,
  getParentTopicById,
  getSkillIdsForParentTopic,
  getParentTopicForSkill,
  getCoveredRvpRefs,
  getTracksByLevel,
} from "../curriculumMap";

describe("curriculumMap", () => {
  it("has at least one parent topic per major subject", () => {
    const subjects = new Set(PARENT_TOPICS.map((p) => p.subject));
    expect(subjects.has("matematika")).toBe(true);
    expect(subjects.has("čeština")).toBe(true);
    expect(subjects.has("prvouka")).toBe(true);
  });

  it("getParentTopicsForGrade filters by gradeRange", () => {
    const grade3 = getParentTopicsForGrade(3);
    for (const pt of grade3) {
      expect(pt.gradeRange[0]).toBeLessThanOrEqual(3);
      expect(pt.gradeRange[1]).toBeGreaterThanOrEqual(3);
    }
  });

  it("getParentTopicsForGrade can filter by subject", () => {
    const math3 = getParentTopicsForGrade(3, "matematika");
    expect(math3.length).toBeGreaterThan(0);
    for (const pt of math3) expect(pt.subject).toBe("matematika");
  });

  it("getParentTopicById returns correct topic", () => {
    const pt = getParentTopicById("math-nasobilka");
    expect(pt).toBeDefined();
    expect(pt?.label).toBe("Násobilka");
  });

  it("getSkillIdsForParentTopic returns skills", () => {
    const skills = getSkillIdsForParentTopic("math-nasobilka");
    expect(skills.length).toBeGreaterThan(0);
  });

  it("getParentTopicForSkill finds parent topic", () => {
    const pt = getParentTopicForSkill("cz-tvrde-mekke");
    expect(pt?.id).toBe("cz-tvrde-mekke");
  });

  it("RVP references are tracked", () => {
    const refs = getCoveredRvpRefs();
    expect(refs.length).toBeGreaterThan(0);
    expect(refs).toContain("M-3-1-04"); // násobilka
  });

  it("getTracksByLevel returns elementary track", () => {
    const elementary = getTracksByLevel("elementary");
    expect(elementary.some((t) => t.id === "zs")).toBe(true);
  });

  it("EDUCATION_TRACKS includes future high-school and vocational", () => {
    const ids = EDUCATION_TRACKS.map((t) => t.id);
    expect(ids).toContain("zs");
    expect(ids).toContain("gymnazium");
    expect(ids).toContain("sou");
  });
});
