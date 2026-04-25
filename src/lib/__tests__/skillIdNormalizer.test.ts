import { describe, it, expect } from "vitest";
import { canonicalSkillId, isSameSkill, aliasesOf } from "../skillIdNormalizer";

describe("skillIdNormalizer", () => {
  it("maps underscore form to canonical", () => {
    expect(canonicalSkillId("frac_compare_same_den")).toBe("frac-compare-same-den");
  });

  it("returns original for already canonical", () => {
    expect(canonicalSkillId("math-add-sub-100")).toBe("math-add-sub-100");
  });

  it("returns original for unknown IDs", () => {
    expect(canonicalSkillId("totally-new-skill")).toBe("totally-new-skill");
  });

  it("isSameSkill recognizes aliases", () => {
    expect(isSameSkill("frac_compare_same_den", "frac-compare-same-den")).toBe(true);
    expect(isSameSkill("frac-compare-same-den", "frac-compare-diff-den")).toBe(false);
  });

  it("aliasesOf includes canonical and aliases", () => {
    const aliases = aliasesOf("frac-compare-same-den");
    expect(aliases).toContain("frac-compare-same-den");
    expect(aliases).toContain("frac_compare_same_den");
  });
});
