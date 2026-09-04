import { describe, it, expect } from "vitest";
import { getAllTopics } from "@/lib/contentRegistry";
import { TOPIC_INSIGHT, CATEGORY_INSIGHT, getTopicInsight } from "@/lib/topicInsight";

/**
 * Proč tenhle test existuje.
 *
 * `categoryInfo.ts` má 73 ručně psaných hesel s poli `whyWeUseIt` a `funFact`.
 * Když obsah přešel ze staré taxonomie na RVP názvy, přestal se každý jeden
 * z nich shodovat — `getCategoryInfo` vracel `null` pro všech 229 témat.
 * Box „Zajímavost" v dialogu „Co je dobré vědět" i celý panel „K čemu jsou
 * čísla?" v `TopicBrowser` tím zmizely, ale **nic to nenahlásilo**: kód se
 * dál kompiloval, testy dál procházely, jen se uživateli přestal zobrazovat
 * ručně napsaný obsah.
 *
 * Tenhle test je pojistka proti opakování. Když se v obsahu přejmenuje
 * kategorie nebo téma, spadne tady — ne až u dítěte na obrazovce.
 */
describe("topic-insight-coverage", () => {
  it("každé téma v aplikaci má „k čemu to je\" i zajímavost", () => {
    const topics = getAllTopics();
    const missing = topics
      .filter(t => !getTopicInsight(t.subject, t.category, t.topic))
      .map(t => `${t.subject}::${t.category}::${t.topic}`);
    expect(missing).toEqual([]);
    expect(topics.length).toBeGreaterThan(100);
  });

  it("žádný klíč v TOPIC_INSIGHT není mrtvý", () => {
    const real = new Set(
      getAllTopics().map(t => `${t.subject}::${t.category}::${t.topic}`),
    );
    const dead = Object.keys(TOPIC_INSIGHT).filter(k => !real.has(k));
    expect(dead).toEqual([]);
  });

  it("žádný klíč v CATEGORY_INSIGHT není mrtvý", () => {
    const real = new Set(getAllTopics().map(t => `${t.subject}::${t.category}`));
    const dead = Object.keys(CATEGORY_INSIGHT).filter(k => !real.has(k));
    expect(dead).toEqual([]);
  });

  it("texty jsou bez emoji a nejsou prázdné", () => {
    const all = [...Object.entries(TOPIC_INSIGHT), ...Object.entries(CATEGORY_INSIGHT)];
    for (const [key, v] of all) {
      expect(v.useful.length, `${key}.useful`).toBeGreaterThan(30);
      expect(v.funFact.length, `${key}.funFact`).toBeGreaterThan(30);
      expect(v.useful, `${key}.useful`).not.toMatch(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u);
      expect(v.funFact, `${key}.funFact`).not.toMatch(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u);
    }
  });
});
