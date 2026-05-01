import { describe, it, expect } from "vitest";
import {
  getPrvoukaCategoryVisual,
  getPrvoukaTopicEmoji,
  getPrvoukaTopicImageUrl,
  getPrvoukaCategoryImageUrl,
  getPrvoukaTopicVisual,
  getTopicIllustrationUrl,
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

describe("getPrvoukaCategoryVisual — known categories", () => {
  it.each([
    "Člověk a jeho tělo",
    "Příroda kolem nás",
    "Lidé a společnost",
    "Orientace v prostoru a čase",
  ])("'%s' → visual obj", (category) => {
    const v = getPrvoukaCategoryVisual("prvouka", category);
    expect(v).toBeTruthy();
    expect(v?.emoji).toBeTruthy();
    expect(v?.colorClass).toBeTruthy();
    expect(v?.gradientClass).toBeTruthy();
  });

  it("neznámá category → null", () => {
    expect(getPrvoukaCategoryVisual("prvouka", "Neexistuje")).toBeNull();
  });

  it("neznámý subject → null", () => {
    expect(getPrvoukaCategoryVisual("xxx", "anything")).toBeNull();
  });
});

describe("getPrvoukaTopicEmoji — fallback chain", () => {
  it("topic match → vrací topic emoji", () => {
    const e = getPrvoukaTopicEmoji("prvouka", "Člověk a jeho tělo", "Lidské tělo");
    expect(e).toBe("🦴");
  });

  it("topic miss → fallback na category emoji", () => {
    const e = getPrvoukaTopicEmoji("prvouka", "Člověk a jeho tělo", "Neznámé téma");
    // Fallback na category "Člověk a jeho tělo" emoji
    expect(e).toBe("🧒");
  });

  it("oba miss → null", () => {
    const e = getPrvoukaTopicEmoji("prvouka", "Neexistuje", "Také ne");
    expect(e).toBeNull();
  });

  it("ne-prvouka subject → null", () => {
    const e = getPrvoukaTopicEmoji("matematika", "X", "Y");
    expect(e).toBeNull();
  });
});

describe("getPrvoukaTopicImageUrl", () => {
  it("known topic → URL string", () => {
    const url = getPrvoukaTopicImageUrl("prvouka", "Lidské tělo");
    expect(url).toBeTruthy();
    expect(typeof url).toBe("string");
  });

  it("neznámý topic → null", () => {
    expect(getPrvoukaTopicImageUrl("prvouka", "Neexistuje")).toBeNull();
  });

  it("ne-prvouka subject → null", () => {
    expect(getPrvoukaTopicImageUrl("matematika", "X")).toBeNull();
  });
});

describe("getPrvoukaCategoryImageUrl", () => {
  it("known category s imageKey → URL", () => {
    const url = getPrvoukaCategoryImageUrl("prvouka", "Člověk a jeho tělo");
    expect(url).toBeTruthy();
  });

  it("neznámá category → null", () => {
    expect(getPrvoukaCategoryImageUrl("prvouka", "Neexistuje")).toBeNull();
  });

  it("matematika kategorie → URL pokud má bundled asset", () => {
    const url = getPrvoukaCategoryImageUrl("matematika", "Čísla a operace");
    // Mat má bundled assets podle imports v top of file
    expect(url).toBeTruthy();
  });
});

describe("getPrvoukaTopicVisual — alias getPrvoukaCategoryVisual", () => {
  it("vrací stejný objekt jako getPrvoukaCategoryVisual", () => {
    const a = getPrvoukaTopicVisual("prvouka", "Člověk a jeho tělo");
    const b = getPrvoukaCategoryVisual("prvouka", "Člověk a jeho tělo");
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

  it("oba miss → null", () => {
    const url = getTopicIllustrationUrl({
      subject: "neexistuje",
      category: "X",
      topic: "Y",
    });
    expect(url).toBeNull();
  });
});

describe("Prvouka visuals — robustness", () => {
  it("prázdný subject / category → null (žádný crash)", () => {
    expect(getPrvoukaCategoryVisual("", "")).toBeNull();
    expect(getPrvoukaTopicEmoji("", "", "")).toBeNull();
    expect(getPrvoukaTopicImageUrl("", "")).toBeNull();
  });

  it("XSS payload v lookup → no crash, no leak", () => {
    expect(() => getPrvoukaCategoryVisual("<script>", "alert(1)")).not.toThrow();
    expect(getPrvoukaTopicEmoji("<x>", "<y>", "<z>")).toBeNull();
  });
});
