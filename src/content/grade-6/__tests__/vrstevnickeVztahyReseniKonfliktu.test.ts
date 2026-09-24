import { describe, it, expect } from "vitest";
import { VRSTEVNICKE_VZTAHY_RESENI_KONFLIKTU } from "../vko/vrstevnickeVztahyReseniKonfliktu";
import type { PracticeTask } from "@/lib/types";

/**
 * Vrstevnické vztahy, kamarádství, řešení konfliktů — VKO 6. ročník (select_one).
 *
 * Kontroluje: select_one strukturu, chybový model (každý distraktor má
 * feedback), žádný hint_leak, gradaci L1 (definice/pojem) → L2 (aplikace na
 * situaci) → L3 (transfer: podobné, ale odlišné jevy) a SPRÁVNÉ ZAŘAZENÍ přes
 * NEZÁVISLÝ SOLVER (druhá cesta) — funkce `classify()` níže je napsaná ručně,
 * nezávisle na generátoru, a z textu otázky/situace/výroku odvodí kategorii
 * jen podle znaků, které ji podle učebnicové definice zakládají (přítomnost
 * popisu pocitu vs. hodnocení druhého; ústupek obou stran vs. jen jedné
 * strany; jednorázová vs. opakovaná a nerovná situace). Test pak ověří, že
 * correctAnswer z generátoru s touto nezávisle odvozenou kategorií souhlasí.
 */
const topic = VRSTEVNICKE_VZTAHY_RESENI_KONFLIKTU[0];

type Kat =
  | "def-kamaradstvi" | "def-ja-vyrok" | "vhodna-reakce"
  | "kompromis-situace" | "ja-vyrok-situace" | "pujcena-vec"
  | "ja-vyrok" | "skryta-vytka" | "skutecny-kompromis" | "jednostranny-ustupek"
  | "privolat-dospeleho" | "resit-sami"
  | null;

/** Vytáhne text v uvozovkách „…" ze zadání (přímá řeč, kterou úloha rozebírá). */
function quoted(q: string): string {
  const m = q.match(/„([^“]+)“/);
  return m ? m[1] : "";
}

/** Nezávislý klasifikátor — určuje kategorii ČISTĚ z textu otázky/situace, bez pohledu na klíč. */
function classify(q: string): Kat {
  // L1 — definice/pojem
  if (/kamarádství|kamarádi/.test(q) && /vystihuje|tvrzení|odlišuje|vlastnost/.test(q)) return "def-kamaradstvi";
  if (/já-výrok/.test(q)) return "def-ja-vyrok";
  if (/Která reakce je vhodná\?/.test(q)) return "vhodna-reakce";

  // L2 — aplikace na situaci
  if (/zapomněl|zapomněla/.test(q) && /vrátit/.test(q)) return "pujcena-vec";
  if (/myslí, že|myslí si, že/.test(q)) return "ja-vyrok-situace";
  if (/Co je nejvhodnější krok\?/.test(q)) return "kompromis-situace";

  // L3 — transfer
  if (/Co tahle věta doopravdy je\?/.test(q)) {
    const s = quoted(q);
    if (/jsi\s+(vážně\s+)?sobec|je to jen tvoje chyba|vůbec nesnažíš/.test(s)) return "skryta-vytka";
    if (/mrzí|mrzelo|zamrzelo|naštvaný|smutný|líto/.test(s)) return "ja-vyrok";
    return null;
  }
  if (/Je namístě (přivolat|volat) dospělého\?/.test(q)) {
    if (/opakovaně a dlouhodobě|i když už to zkoušeli|nemohou nijak|nezmohou/.test(q)) return "privolat-dospeleho";
    if (/poprvé|hned si to vysvětlily|rychle domluví|jednou za čas/.test(q)) return "resit-sami";
    return null;
  }
  if (/Co to je\?/.test(q)) {
    if (/bez námitek souhlasil|bez řeči souhlasila/.test(q)) return "jednostranny-ustupek";
    if (/půl.*a půl|každou půlku/.test(q)) return "skutecny-kompromis";
    return null;
  }
  return null;
}

/** Znak, který kategorii podle učebnicové definice zakládá, ověřený v CORRECTANSWER (nezávislý na doslovném znění generátoru). */
const FEATURE: Record<string, RegExp> = {
  "def-kamaradstvi": /důvěr|pomáh|pomoc/i,
  "def-ja-vyrok": /pocit|cítím/i,
  "vhodna-reakce": /vyslechnout|poslechnout si|společně najít/i,
  "kompromis-situace": /domluv|dohodnout|vystřída|střída/i,
  "ja-vyrok-situace": /mrzelo/i,
  "pujcena-vec": /potřebuj|chybí|vrátí|vrátil|požád|poprosit/i,
  "ja-vyrok": /^Skutečný já-výrok/i,
  "skryta-vytka": /^Skrytá výtka/i,
  "skutecny-kompromis": /^Skutečný kompromis/i,
  "jednostranny-ustupek": /^Jednostranný ústupek/i,
  "privolat-dospeleho": /^Ano,/i,
  "resit-sami": /^Ne,/i,
};

describe("Vrstevnické vztahy — metadata", () => {
  it("vko g6, select_one, Člověk ve společnosti / Lidská setkávání a kultura", () => {
    expect(topic.subject).toBe("vko");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.id).toBe("g6-vko-vrstevnicke-vztahy-reseni-konfliktu-6");
    expect(topic.category).toBe("Člověk ve společnosti");
    expect(topic.topic).toBe("Lidská setkávání a kultura");
  });
});

describe.each([1, 2, 3])("Vrstevnické vztahy — úlohy level %i", (level) => {
  const tasks = topic.generator(level);

  it("≥12 unikátních úloh", () => {
    const uniq = new Set(tasks.map((t) => t.question));
    expect(uniq.size).toBeGreaterThanOrEqual(12);
  });

  it("select_one struktura: ≥3 options, klíč mezi nimi, žádné duplicity", () => {
    for (const t of tasks) {
      expect(t.options!.length, t.question).toBeGreaterThanOrEqual(3);
      expect(new Set(t.options).size, `duplicitní options: ${t.question}`).toBe(t.options!.length);
      expect(t.options, `correctAnswer mimo options: ${t.question}`).toContain(t.correctAnswer);
      // klíč se nesmí doslova vyskytovat ve znění otázky
      expect(t.question.includes(t.correctAnswer), `klíč prozrazen v otázce: ${t.question}`).toBe(false);
    }
  });

  it("chybový model: každý distraktor má feedback, správná odpověď ne", () => {
    for (const t of tasks) {
      for (const key of Object.keys(t.optionFeedback ?? {})) {
        expect(t.options, `feedback klíč mimo options: ${key}`).toContain(key);
        expect(key).not.toBe(t.correctAnswer);
      }
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback?.[d], `chybí feedback: "${d}" v ${t.question}`).toBeTruthy();
      }
    }
  });

  it("nápověda neprozrazuje výsledek a každá úloha má vysvětlení", () => {
    for (const t of tasks) {
      for (const h of t.hints ?? []) {
        expect(h, `hint leak: ${t.question}`).not.toContain(t.correctAnswer);
      }
      expect((t.hints ?? []).length, t.question).toBeGreaterThanOrEqual(1);
      expect(t.explanation, t.question).toBeTruthy();
    }
  });

  it("NEZÁVISLÝ SOLVER: correctAnswer odpovídá kategorii odvozené z textu situace/výroku", () => {
    for (const t of tasks) {
      const kat = classify(t.question);
      expect(kat, `solver nerozpoznal kategorii: ${t.question}`).not.toBeNull();
      const feature = FEATURE[kat as string];
      expect(feature, `chybí FEATURE pro kategorii ${kat}`).toBeDefined();
      expect(t.correctAnswer, `${kat}: "${t.correctAnswer}" nemá znak zakládající kategorii — ${t.question}`).toMatch(feature);
    }
  });
});

describe("Vrstevnické vztahy — gradace L1 < L2 < L3", () => {
  it("znění otázek L1 a L3 jsou disjunktní", () => {
    const q1 = new Set(topic.generator(1).map((t) => t.question));
    const q3 = new Set(topic.generator(3).map((t) => t.question));
    const shared = [...q3].filter((q) => q1.has(q));
    expect(shared, `společné otázky L1∩L3: ${shared}`).toHaveLength(0);
  });

  it("L1 = definice/pojem (žádná konkrétní jména vrstevníků v konfliktní situaci)", () => {
    const l1 = topic.generator(1).map((t) => t.question);
    expect(l1.every((q) => classify(q) === "def-kamaradstvi" || classify(q) === "def-ja-vyrok" || classify(q) === "vhodna-reakce")).toBe(true);
  });

  it("L2 = aplikace na jmenovanou konkrétní situaci", () => {
    const l2 = topic.generator(2).map((t) => t.question);
    expect(l2.every((q) => /[A-ZÁ-Ž][a-zá-ž]+ (a|si|zapomněl|zapomněla)/.test(q) || /myslí/.test(q))).toBe(true);
    expect(l2.every((q) => classify(q) === "kompromis-situace" || classify(q) === "ja-vyrok-situace" || classify(q) === "pujcena-vec")).toBe(true);
  });

  it("L3 = transfer (rozlišení podobných, ale odlišných jevů), nikdy L1 formát", () => {
    const l3 = topic.generator(3).map((t) => t.question);
    expect(l3.every((q) => classify(q) === "ja-vyrok" || classify(q) === "skryta-vytka" || classify(q) === "skutecny-kompromis" || classify(q) === "jednostranny-ustupek" || classify(q) === "privolat-dospeleho" || classify(q) === "resit-sami")).toBe(true);
    expect(l3.every((q) => !/Která reakce je vhodná\?/.test(q))).toBe(true);
  });
});
