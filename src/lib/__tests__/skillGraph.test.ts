import { describe, it, expect, beforeEach } from "vitest";
import {
  buildSkillGraph,
  canStart,
  getMissingPrerequisites,
  getUnlockedBy,
  topologicalOrder,
  getNextRecommendation,
  resetSkillGraphCache,
} from "../skillGraph";
import type { TopicMetadata } from "../types";

const mkTopic = (id: string, prerequisites: string[] = [], grade: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 = 3): TopicMetadata => ({
  id,
  title: id,
  subject: "matematika",
  category: "test",
  topic: "test",
  briefDescription: "",
  keywords: [],
  goals: [],
  boundaries: [],
  gradeRange: [grade, grade],
  inputType: "number",
  generator: () => [],
  helpTemplate: { hint: "", steps: [], example: "", commonMistake: "" },
  prerequisites,
});

describe("skillGraph", () => {
  beforeEach(() => resetSkillGraphCache());

  it("builds graph with prerequisites", () => {
    const topics = [
      mkTopic("a"),
      mkTopic("b", ["a"]),
      mkTopic("c", ["b"]),
    ];
    const g = buildSkillGraph(topics);
    expect(g.get("b")?.prerequisites).toEqual(["a"]);
    expect(g.get("a")?.unlocks).toEqual(["b"]);
    expect(g.get("b")?.unlocks).toEqual(["c"]);
  });

  it("canStart returns true for skill without prerequisites", () => {
    const topics = [mkTopic("base")];
    const g = buildSkillGraph(topics);
    expect(canStart("base", {}, g)).toBe(true);
  });

  it("canStart returns false when prerequisite mastery is low", () => {
    const topics = [mkTopic("a"), mkTopic("b", ["a"])];
    const g = buildSkillGraph(topics);
    expect(canStart("b", { a: 0.5 }, g)).toBe(false);
    expect(canStart("b", { a: 0.8 }, g)).toBe(true);
  });

  it("getMissingPrerequisites lists missing", () => {
    const topics = [mkTopic("a"), mkTopic("b"), mkTopic("c", ["a", "b"])];
    const g = buildSkillGraph(topics);
    expect(getMissingPrerequisites("c", { a: 0.9 }, g)).toEqual(["b"]);
  });

  it("getUnlockedBy returns dependent skills", () => {
    const topics = [mkTopic("a"), mkTopic("b", ["a"]), mkTopic("c", ["a"])];
    const g = buildSkillGraph(topics);
    expect(getUnlockedBy("a", g).sort()).toEqual(["b", "c"]);
  });

  it("topologicalOrder respects dependencies", () => {
    const topics = [
      mkTopic("c", ["b"]),
      mkTopic("b", ["a"]),
      mkTopic("a"),
    ];
    const g = buildSkillGraph(topics);
    const order = topologicalOrder(g);
    expect(order.indexOf("a")).toBeLessThan(order.indexOf("b"));
    expect(order.indexOf("b")).toBeLessThan(order.indexOf("c"));
  });

  it("getNextRecommendation picks unblocked unmastered skill", () => {
    const topics = [
      mkTopic("a"),
      mkTopic("b", ["a"]),
      mkTopic("c", ["b"]),
    ];
    // a zvládnuto, b je další
    const rec = getNextRecommendation({ a: 0.9 }, topics);
    expect(rec?.id).toBe("b");
  });

  it("getNextRecommendation returns null when nothing to learn", () => {
    const topics = [mkTopic("a"), mkTopic("b", ["a"])];
    const rec = getNextRecommendation({ a: 0.9, b: 0.9 }, topics);
    expect(rec).toBeNull();
  });
});
