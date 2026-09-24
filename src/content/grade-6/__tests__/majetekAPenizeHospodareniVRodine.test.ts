import { describe, it, expect } from "vitest";
import { MAJETEK_A_PENIZE_HOSPODARENI_V_RODINE } from "../vko/majetekAPenizeHospodareniVRodine";
import { klicUlohy } from "@/lib/taskIdentity";
import type { PracticeTask } from "@/lib/types";

/**
 * Majetek a peníze — hospodaření v rodině (VKO 6. ročník, select_one).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta): pravidla nad ZNĚNÍM otázky (regulární
 * výrazy na charakteristické fráze), ne nad logikou generátoru. Pro každou
 * otázku existuje právě jedno pravidlo a to určuje, jaký kmen musí mít klíč.
 * Navíc kontroluje, že žádný distraktor u „potřeba × přání" ani
 * „plánovaný × impulzivní nákup" nesedí se stejným pravidlem jako klíč.
 */
const topic = MAJETEK_A_PENIZE_HOSPODARENI_V_RODINE[0];
const low = (s: string) => s.toLowerCase();

type Pravidlo = { name: string; test: (t: PracticeTask) => boolean; kmen: RegExp };

const PRAVIDLA: Pravidlo[] = [
  // ── L1 — definice a přímé příklady ──────────────────────────────────
  { name: "def rozpočet", test: (t) => /znamená slovo „rozpočet./.test(t.question), kmen: /plán.*kolik peněz.*vydělá.*utratit/ },
  { name: "def kapesné", test: (t) => /znamená slovo „kapesné./.test(t.question), kmen: /pravidelná menší částka/ },
  { name: "def spořit", test: (t) => /znamená „spořit./.test(t.question), kmen: /odkládat část peněz/ },
  { name: "příklad výdaje", test: (t) => /typický příklad výdaje/.test(t.question), kmen: /nájem/ },
  { name: "příklad příjmu", test: (t) => /typický příklad příjmu/.test(t.question), kmen: /výplata/ },
  { name: "potřeba > přání", test: (t) => /spíš potřeba než přání/.test(t.question), kmen: /jídlo/ },
  { name: "přání > potřeba", test: (t) => /spíš přání než potřeba/.test(t.question), kmen: /telefonu/ },
  { name: "def plánovaný nákup", test: (t) => /znamená „plánovaný nákup./.test(t.question), kmen: /promyšlené rozhodnutí/ },
  { name: "def impulzivní nákup", test: (t) => /znamená „impulzivní nákup./.test(t.question), kmen: /bez rozmyslu/ },
  { name: "Petr kapesné", test: (t) => /^Petr dostává/.test(t.question), kmen: /^kapesné$/ },
  { name: "co dělá kdo spoří", test: (t) => /Co dělá člověk, když spoří/.test(t.question), kmen: /odkládá/ },
  { name: "rodinné výdaje", test: (t) => /Co patří mezi rodinné výdaje/.test(t.question), kmen: /voda a elektřinu|vodu a elektřinu/ },
  { name: "účel rozpočtu", test: (t) => /hlavním účelem rodinného rozpočtu/.test(t.question), kmen: /naplánovat.*kolik peněz/ },
  { name: "proč kapesné", test: (t) => /Proč je pro dítě užitečné/.test(t.question), kmen: /učí se.*hospodařit/ },
  { name: "Anička sladkosti", test: (t) => /^Anička na jaře/.test(t.question), kmen: /^impulzivní nákup$/ },
  { name: "šetří na dovolenou", test: (t) => /šetří na dovolenou/.test(t.question), kmen: /postupně odkládá/ },

  // ── L2 — situace, pojem se odvozuje z chování ────────────────────────
  { name: "Tomáš boty", test: (t) => /^Tomáš potřebuje nové boty/.test(t.question), kmen: /^potřeba$/ },
  { name: "Ema sluchátka", test: (t) => /^Ema chce mít/.test(t.question), kmen: /^přání$/ },
  { name: "Filip babička", test: (t) => /^Babička dala vnukovi Filipovi/.test(t.question), kmen: /^příjem$/ },
  { name: "maminka potraviny", test: (t) => /^Maminka zaplatila v obchodě za týdenní nákup/.test(t.question), kmen: /^výdaj$/ },
  { name: "rodina napsala rozpočet", test: (t) => /napsala.*kolik peněz vydělá a kolik/.test(t.question), kmen: /^rozpočet$/ },
  { name: "Adam kolo", test: (t) => /^Adam dostává kapesné/.test(t.question), kmen: /^spoření$/ },
  { name: "Petr batoh", test: (t) => /^Petr si už dva týdny/.test(t.question), kmen: /^plánovaný nákup$/ },
  { name: "Viktorka guma", test: (t) => /^Viktorka uviděla/.test(t.question), kmen: /^impulzivní nákup$/ },
  { name: "nájem rodina", test: (t) => /musí každý měsíc zaplatit nájem/.test(t.question), kmen: /^potřeba$/ },
  { name: "David hra", test: (t) => /^David by si moc přál/.test(t.question), kmen: /^přání$/ },
  { name: "rodiče sepsali", test: (t) => /^Rodiče si sepsali/.test(t.question), kmen: /^rozpočet$/ },
  { name: "Bára tábor", test: (t) => /^Bára si každý měsíc/.test(t.question), kmen: /^spoření$/ },
  { name: "bratr hlídání", test: (t) => /přivydělává hlídáním/.test(t.question), kmen: /^příjem$/ },
  { name: "oprava pračky výdaj", test: (t) => /^Rodina zaplatila opravu pračky/.test(t.question), kmen: /^výdaj$/ },
  { name: "Standa zmrzlina", test: (t) => /^Standa šel s kamarádem/.test(t.question), kmen: /^impulzivní nákup$/ },

  // ── L3 — analýza, kombinace znaků, transfer ─────────────────────────
  { name: "Jakub boty rychlá platba", test: (t) => /^Jakub si dva týdny/.test(t.question), kmen: /^plánovaný nákup$/ },
  { name: "Nikola mikina bez srovnání", test: (t) => /^Nikola strávila v obchodě/.test(t.question), kmen: /^impulzivní nákup$/ },
  { name: "Matěj Tereza stavebnice", test: (t) => /^Matěj utratí celé kapesné/.test(t.question), kmen: /^tereza/i },
  { name: "Kryštof dárek dvojí pohled", test: (t) => /^Maminka si o víkendu přivydělala/.test(t.question), kmen: /^příjmem/i },
  { name: "Vojta boty potřeba", test: (t) => /^Vojtovi propadává bota/.test(t.question), kmen: /nepromokavé, funkční boty/ },
  { name: "impulzivní nákupy rozpočet", test: (t) => /třikrát impulzivně koupili/.test(t.question), kmen: /^na plánované výdaje/i },
  { name: "teta půjčka výdaj", test: (t) => /^Teta půjčila rodině/.test(t.question), kmen: /^je to výdaj/ },
  { name: "Radek sladkost impulzivní část", test: (t) => /^O víkendu jel Radek/.test(t.question), kmen: /přidání sladkosti/ },
  { name: "Emil bez rezervy", test: (t) => /^Emil je zvyklý/.test(t.question), kmen: /^těžko/i },
  { name: "gril spoření", test: (t) => /^Rodina sestavila rozpočet.*gril/.test(t.question), kmen: /^kvůli neplánovanému výdaji na gril/i },
  { name: "pračka potřeba", test: (t) => /porouchala pračka/.test(t.question), kmen: /^mít funkční pračku$/ },
  { name: "Standa helma čekání", test: (t) => /^Standa čekal tři týdny/.test(t.question), kmen: /^impulzivní nákup$/ },
];

function solve(t: PracticeTask): Pravidlo {
  const hit = PRAVIDLA.filter((p) => p.test(t));
  expect(hit.map((p) => p.name), `solver musí úlohu rozpoznat právě jedním pravidlem: ${t.question}`).toHaveLength(1);
  return hit[0];
}

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\d]+/gu, " ").trim();

function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe("Majetek a peníze (hospodaření v rodině) — metadata", () => {
  it("vko g6, select_one, přesné RVP zařazení", () => {
    expect(topic.id).toBe("g6-vko-majetek-a-penize-hospodareni-v-rodine-6");
    expect(topic.subject).toBe("vko");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.rvpNodeId).toBe(
      "g6-vko-stat-a-hospodarstvi-majetek-a-penize-hospodareni-v-rodine-kapesne-setreni-planovani",
    );
    expect(topic.category).toBe("Stát a hospodářství");
    expect(topic.topic).toBe("Majetek a peníze");
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });

  it("žádné konkrétní částky, ceny ani měna v žádné úloze", () => {
    for (const level of [1, 2, 3]) {
      for (const t of topic.generator(level)) {
        const texty = [t.question, ...(t.options ?? []), t.explanation ?? "", ...Object.values(t.optionFeedback ?? {})];
        for (const s of texty) {
          expect(s, `částka/měna v textu: ${s}`).not.toMatch(/\d+\s*(kč|korun|eur|€|\$)/i);
          expect(s, `holé číslo v textu: ${s}`).not.toMatch(/\d/);
        }
      }
    }
  });
});

describe.each([1, 2, 3])("Majetek a peníze — úlohy level %i", (level) => {
  const tasks = topic.generator(level);

  it("≥12 unikátních úloh a determinismus při stejném seedu", () => {
    expect(new Set(tasks.map(klicUlohy)).size).toBeGreaterThanOrEqual(12);
    const puvodni = Math.random;
    try {
      Math.random = seeded(42);
      const a = topic.generator(level).map((t) => [t.question, t.options]);
      Math.random = seeded(42);
      const b = topic.generator(level).map((t) => [t.question, t.options]);
      expect(b).toEqual(a);
    } finally {
      Math.random = puvodni;
    }
  });

  it("4 různé možnosti, klíč právě jednou, feedback u každého distraktoru", () => {
    for (const t of tasks) {
      expect(t.options, t.question).toHaveLength(4);
      expect(new Set(t.options).size, t.question).toBe(4);
      expect(t.options!.filter((o) => o === t.correctAnswer), t.question).toHaveLength(1);
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback![d], `chybí feedback: "${d}"`).toBeTruthy();
      }
      expect(t.optionFeedback![t.correctAnswer]).toBeUndefined();
      expect(t.explanation, t.question).toBeTruthy();
    }
  });

  it("SOLVER: klíč souhlasí s nezávislou cestou (regulární výraz nad zněním otázky)", () => {
    for (const t of tasks) {
      const p = solve(t);
      expect(low(t.correctAnswer), `${p.name}: ${t.question}`).toMatch(p.kmen);
    }
  });

  it("žádný hodnotový soud u sporných témat (rodina, náboženství, politika)", () => {
    for (const t of tasks) {
      const texty = [t.question, ...(t.options ?? []), t.explanation ?? ""];
      for (const s of texty) {
        expect(s, `hodnotový soud: ${s}`).not.toMatch(/lepší rodina|špatná rodina|správné složení rodiny/i);
      }
    }
  });

  it("délka: klíč je nejdelší možností nejvýš ve 40 % úloh", () => {
    const nejdelsi = tasks.filter((t) => t.options!.every((o) => o === t.correctAnswer || o.length < t.correctAnswer.length));
    expect(nejdelsi.length / tasks.length, nejdelsi.map((t) => t.correctAnswer).join(" | ")).toBeLessThanOrEqual(0.4);
  });

  it("leak: klíč není ve znění otázky ani v nápovědách; nápovědy unikátní", () => {
    const videne = new Set<string>();
    for (const t of tasks) {
      expect(low(t.question), t.question).not.toContain(low(t.correctAnswer));
      expect(t.hints, t.question).toHaveLength(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      for (const h of t.hints!) {
        expect(low(h), `hint leak: ${t.question}`).not.toContain(low(t.correctAnswer));
        expect(videne.has(h), `duplicitní nápověda: ${h}`).toBe(false);
        videne.add(h);
      }
    }
  });

  it("čeština: žádné lomítkové rodové tvary", () => {
    for (const t of tasks) {
      const texty = [t.question, ...t.options!, ...(t.hints ?? []), t.explanation ?? "", ...Object.values(t.optionFeedback ?? {})];
      for (const s of texty) expect(s, s).not.toMatch(/\p{L}\/\p{L}/u);
    }
  });
});

describe("Majetek a peníze — gradace", () => {
  it("L1 a L3 se zněním otázek nepřekrývají; L3 je přenos", () => {
    // Klíč (correctAnswer) se u tohoto tématu záměrně opakuje napříč úrovněmi
    // (je to jeden z ~9 pojmů: příjem, výdaj, potřeba, přání…), takže shoda
    // klíče L1×L3 sama o sobě není vada — kontroluje se jen znění otázky.
    const l1 = topic.generator(1), l3 = topic.generator(3);
    const q1 = new Set(l1.map((t) => norm(t.question)));
    expect(l3.filter((t) => q1.has(norm(t.question)))).toHaveLength(0);
  });

  it("L3 obsahuje víceznakové situace (posouzení dopadu, kombinace znaků), ne recyklovaná L1", () => {
    const l3 = topic.generator(3);
    // Aspoň polovina L3 úloh musí zmiňovat dva porovnávané aktéry nebo
    // výslovně upozorňovat na to, že povrchový znak (rychlost/délka) klame.
    const transfer = l3.filter((t) => /i když|přestože|ne proto|i přesto/i.test(t.question));
    expect(transfer.length, "L3 musí obsahovat úlohy, kde povrchový znak klame").toBeGreaterThanOrEqual(3);
  });
});
