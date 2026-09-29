import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { claimTopicIntro, TOPIC_INTRO_KEY } from "@/lib/topicIntroSeen";

beforeEach(() => localStorage.clear());
afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

describe("claimTopicIntro — výklad jen při prvním vstupu", () => {
  it("první vstup do tématu → true, každý další → false", () => {
    expect(claimTopicIntro("anon", "g3-cjl-doplnovaci-diktat")).toBe(true);
    expect(claimTopicIntro("anon", "g3-cjl-doplnovaci-diktat")).toBe(false);
    expect(claimTopicIntro("anon", "g3-cjl-doplnovaci-diktat")).toBe(false);
  });

  it("jiné téma má vlastní první vstup", () => {
    claimTopicIntro("anon", "g3-mat-zaokrouhlovani");
    expect(claimTopicIntro("anon", "g3-mat-nasobilka-6-10")).toBe(true);
  });

  it("sourozenci na jednom zařízení: každý vlastník má vlastní první vstup", () => {
    claimTopicIntro("dite-a", "g4-mat-zlomek-cast-celku-4");
    expect(claimTopicIntro("dite-b", "g4-mat-zlomek-cast-celku-4")).toBe(true);
    expect(claimTopicIntro("dite-a", "g4-mat-zlomek-cast-celku-4")).toBe(false);
  });

  it("poškozená data v úložišti se nevyhodí výjimkou, jen začnou znovu", () => {
    localStorage.setItem(TOPIC_INTRO_KEY, "{nevalidní json");
    expect(claimTopicIntro("anon", "g2-mat-jednotky")).toBe(true);
    localStorage.setItem(TOPIC_INTRO_KEY, JSON.stringify(["pole místo objektu"]));
    expect(claimTopicIntro("anon", "g2-mat-jednotky")).toBe(true);
  });

  it("úložiště odmítá zápis → false (jinak by se výklad otevíral pokaždé)", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    expect(claimTopicIntro("anon", "g5-cjl-shoda-prisudku")).toBe(false);
  });
});
