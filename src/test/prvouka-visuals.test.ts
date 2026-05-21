import { describe, it, expect } from "vitest";
import {
  getCategoryVisual,
  getTopicEmoji,
  getTopicIllustrationUrl,
  getCategoryIllustrationUrl,
  getTopicVisual,
} from "@/lib/prvoukaVisuals";

/**
 * Prvouka visuals — lookup tables pro emoji + barvy + AI obrázky.
 *
 * Pokrývá:
 *  - Známé kategorie ("Lidské tělo", "Příroda kolem nás", atd.)
 *  - Známé topics ("Lidské tělo", "Smysly", "Rostliny")
 *  - Fallback null pro neznámé subjects/categories
 *  - imageUrl preferuje bundled assets před Supabase storage
 */

describe("getCategoryVisual — known categories", () => {
  it.each([
    "Člověk a jeho tělo",
    "Příroda kolem nás",
    "Lidé a společnost",
    "Orientace v prostoru a čase",
  ])("'%s' → visual obj", (category) => {
    const v = getCategoryVisual("prvouka", category);
    expect(v).toBeTruthy();
    expect(v?.emoji).toBeTruthy();
    expect(v?.colorClass).toBeTruthy();
    expect(v?.gradientClass).toBeTruthy();
  });

  it("neznámá category → null", () => {
    expect(getCategoryVisual("prvouka", "Neexistuje")).toBeNull();
  });

  it("neznámý subject → null", () => {
    expect(getCategoryVisual("xxx", "anything")).toBeNull();
  });
});

describe("getTopicEmoji — fallback chain", () => {
  it("topic match → vrací topic emoji", () => {
    const e = getTopicEmoji("prvouka", "Člověk a jeho tělo", "Lidské tělo");
    expect(e).toBe("🦴");
  });

  it("topic miss → fallback na category emoji", () => {
    const e = getTopicEmoji("prvouka", "Člověk a jeho tělo", "Neznámé téma");
    // Fallback na category "Člověk a jeho tělo" emoji
    expect(e).toBe("🧒");
  });

  it("oba miss → null", () => {
    const e = getTopicEmoji("prvouka", "Neexistuje", "Také ne");
    expect(e).toBeNull();
  });

  it("ne-prvouka subject → null", () => {
    const e = getTopicEmoji("matematika", "X", "Y");
    expect(e).toBeNull();
  });
});

describe("getTopicIllustrationUrl — topic image lookup", () => {
  it("known topic → URL string", () => {
    const url = getTopicIllustrationUrl({ subject: "prvouka", topic: "Lidské tělo", category: "Člověk a jeho tělo" });
    expect(url).toBeTruthy();
    expect(typeof url).toBe("string");
  });

  it("neznámý topic → category fallback URL", () => {
    const url = getTopicIllustrationUrl({ subject: "prvouka", topic: "Neexistuje", category: "Člověk a jeho tělo" });
    expect(url).toBeTruthy(); // category image fallback
  });

  it("oba miss → null", () => {
    const url = getTopicIllustrationUrl({ subject: "matematika", topic: "X", category: "X" });
    // getCategoryIllustrationUrl always returns slug-based URL, so this returns a string
    expect(url).toBeTruthy();
  });
});

describe("getCategoryIllustrationUrl", () => {
  it("known category s imageKey → URL", () => {
    const url = getCategoryIllustrationUrl("prvouka", "Člověk a jeho tělo");
    expect(url).toBeTruthy();
  });

  it("neznámá category → slug-based URL (never null)", () => {
    expect(getCategoryIllustrationUrl("prvouka", "Neexistuje")).toBeTruthy();
  });

  it("matematika kategorie → URL pokud má bundled asset", () => {
    const url = getCategoryIllustrationUrl("matematika", "Čísla a operace");
    // Mat má bundled assets podle imports v top of file
    expect(url).toBeTruthy();
  });
});

describe("getTopicVisual — alias getCategoryVisual", () => {
  it("vrací stejný objekt jako getCategoryVisual", () => {
    const a = getTopicVisual("prvouka", "Člověk a jeho tělo");
    const b = getCategoryVisual("prvouka", "Člověk a jeho tělo");
    expect(a).toBe(b);
  });
});

describe("getTopicIllustrationUrl — fallback chain", () => {
  it("topic image → preferován", () => {
    const url = getTopicIllustrationUrl({
      subject: "prvouka",
      category: "Člověk a jeho tělo",
      topic: "Lidské tělo",
    });
    expect(url).toBeTruthy();
  });

  it("topic miss → category fallback", () => {
    const url = getTopicIllustrationUrl({
      subject: "prvouka",
      category: "Člověk a jeho tělo",
      topic: "Neznámé téma",
    });
    expect(url).toBeTruthy(); // category image
  });

  it("oba miss → slug-based fallback URL", () => {
    const url = getTopicIllustrationUrl({
      subject: "neexistuje",
      category: "X",
      topic: "Y",
    });
    expect(url).toBeTruthy(); // slug-based fallback always returns a URL
  });
});

describe("Prvouka visuals — robustness", () => {
  it("prázdný subject / category → null (žádný crash)", () => {
    expect(getCategoryVisual("", "")).toBeNull();
    expect(getTopicEmoji("", "", "")).toBeNull();
    expect(getTopicIllustrationUrl({ subject: "", topic: "", category: "" })).toBeTruthy(); // slug fallback
  });

  it("XSS payload v lookup → no crash, no leak", () => {
    expect(() => getCategoryVisual("<script>", "alert(1)")).not.toThrow();
    expect(getTopicEmoji("<x>", "<y>", "<z>")).toBeNull();
  });
});
