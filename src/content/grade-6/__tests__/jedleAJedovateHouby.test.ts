import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { JEDLE_A_JEDOVATE_HOUBY } from "../prirodopis/jedleAJedovateHouby";
import type { PracticeTask } from "@/lib/types";
import { pocetUnikatnich } from "@/lib/taskIdentity";

/**
 * Jedlé a jedovaté houby — FAKTICKÝ vzor select_one, bezpečnostní téma.
 *
 * NEZÁVISLÝ SOLVER (druhá cesta), banku generátoru nepoužívá:
 *  (1) L1 — vlastní klasifikátor stavu hub (jedlá / nejedlá / jedovatá / smrtelně).
 *      Podle klíčových slov otázky musí podmínce vyhovět PRÁVĚ jedna možnost.
 *  (2) L2 — klasifikátor pravidel: mýtické a nebezpečné vzory × bezpečné vzory.
 *      Klíč nesmí obsahovat žádný mýtus a musí obsahovat bezpečný vzor, každý
 *      distraktor porušuje aspoň jeden mýtus. Solver vybere jedinou čistou možnost.
 *  (3) L3 — klasifikátor znaků: z popisu vytáhne znaky a pravidly určí houbu;
 *      u dvojic, rozhodnutí a nebezpečí rozhoduje tabulka kotva → znak odpovědi.
 *  (4) Pojistka zdraví: žádný klíč ani vysvětlení neradí ochutnat nebo čekat.
 */
const topic = JEDLE_A_JEDOVATE_HOUBY[0];

// (1) stav hub — zapsáno nezávisle na generátoru
type Stav = "jedla" | "nejedla" | "jedovata" | "smrtelna";
const STAV: Record<string, Stav> = {
  "hřib smrkový": "jedla",
  "křemenáč osikový": "jedla",
  "kozák": "jedla",
  "liška obecná": "jedla",
  "bedla vysoká": "jedla",
  "žampion": "jedla",
  "václavka obecná": "jedla",
  "holubinka": "jedla",
  "muchomůrka zelená": "smrtelna",
  "muchomůrka červená": "jedovata",
  "muchomůrka tygrovaná": "jedovata",
  "hřib satan": "jedovata",
  "hřib žlučník": "nejedla",
};
const stav = (o: string): Stav => {
  expect(STAV[o], `neznámá houba „${o}“`).toBeDefined();
  return STAV[o];
};

function vyresL1(t: PracticeTask): string {
  const q = t.question;
  let ok: (s: Stav) => boolean;
  if (/hořk/i.test(q)) ok = (s) => s === "nejedla";
  else if (/smrteln/i.test(q)) ok = (s) => s === "smrtelna";
  else if (/nedáš/i.test(q) && /jedovat/i.test(q)) ok = (s) => s === "jedovata" || s === "smrtelna";
  else if (/je jedlá\?/i.test(q)) ok = (s) => s === "jedla";
  else throw new Error(`L1 solver nezná šablonu: ${q}`);
  const hit = t.options!.filter((o) => ok(stav(o)));
  expect(hit, `L1: podmínce nevyhovuje právě 1 možnost: ${q}`).toHaveLength(1);
  return hit[0];
}

// (2) pravidla sběru
const MYTY: RegExp[] = [
  /slimák/i, /stříbr/i, /zčern/i, /cibul/i, /vařením/i, /sušením/i, /octa/i,
  /ochutn/i, /podle chuti/i, /kousni/i, /počk/i, /igelit/i, /uzavřen/i, /v teple/i,
  /vždy(cky)? (jedl|bezpeč)/i, /jsou jedlé/i, /vykroj/i, /červi přece/i, /(?<!ne)rozhrab/i, /vytrhn/i, /rozkop/i,
  /omýt/i, /všude zdrav/i, /trocha|trochu/i, /nehlídá/i, /jen jedlé/i, /mléko/i, /horečk/i,
  /hned vyhod/i, /vyzvrac/i, /znamená konec/i, /zvířata jedovaté/i, /bude chutnat/i, /je bezpečná/i,
  /podle barvy/i, /z atlasu/i, /^věřím/i, /^souhlasím/i, /^pravda/i,
  // opatrné rozhodnutí se špatným důvodem
  /vždy(cky)? (jedovat|hořk)/i, /červi žerou/i, /jen jedovat/i, /hezké houby/i,
];
const BEZPECNE = /nechám|nesbírám|nejez|nejím|lékař|155|zbytk|košík|šetrně|nedá|nic neznamená|nesouhlasím/i;

function vyresL2(t: PracticeTask): string {
  const cista = t.options!.filter((o) => !MYTY.some((r) => r.test(o)));
  expect(cista, `L2: nejde o právě 1 možnost bez mýtu: ${t.question}`).toHaveLength(1);
  expect(BEZPECNE.test(cista[0]), `L2: klíč bez bezpečného vzoru: ${cista[0]}`).toBe(true);
  return cista[0];
}

// (3) znaky hub
const ZNAK: Record<string, RegExp> = {
  bileLupeny: /bíl[éý]\w* lupeny|lupeny bíl/i,
  ruzoveLupeny: /lupeny růžov/i,
  prsten: /prsten/i,
  posuvny: /posuvn/i,
  pochva: /pochv|kalíš/i,
  bezPochvy: /bez pochvy|pochva .*chybí/i,
  zelenyKlobouk: /zelen/i,
  cervenyKlobouk: /červen\S* klobouk|klobouk je jasně červen/i,
  hliza: /hlíz/i,
  krehky: /jako křída/i,
  bradavky: /bradav/i,
  rourky: /rourk/i,
  modrani: /modr/i,
  cervenyTren: /červený se síťkou|třeň je červen/i,
  zapach: /páchn/i,
  lisyty: /lišt/i,
  zluta: /žlut|oranž/i,
  supiny: /šupin/i,
  hadovita: /hadovit/i,
  ruzoveRourky: /růžovějí/i,
  tmavaSitka: /tmavá síťka/i,
  horky: /hořk/i,
  pareze: /pařez/i,
  medovy: /medov/i,
  briza: /bříz/i,
  tmaveSupinky: /tmavými šupinkami/i,
};
type Z = keyof typeof ZNAK;
// Znaky, které houbu určují (všechny musí sedět) — tabulka z učebnice.
const URCENI: [string, Z[]][] = [
  ["muchomůrka zelená", ["bileLupeny", "prsten", "pochva", "zelenyKlobouk"]],
  ["muchomůrka červená", ["cervenyKlobouk", "bileLupeny", "prsten", "hliza"]],
  ["holubinka", ["bileLupeny", "krehky"]],
  ["hřib satan", ["rourky", "modrani", "cervenyTren"]],
  ["liška obecná", ["lisyty", "zluta"]],
  ["bedla vysoká", ["posuvny", "hadovita", "bezPochvy"]],
  ["žampion", ["ruzoveLupeny", "prsten", "bezPochvy"]],
  ["hřib žlučník", ["rourky", "ruzoveRourky", "tmavaSitka"]],
  ["václavka obecná", ["pareze", "medovy", "prsten"]],
  ["kozák", ["rourky", "briza", "tmaveSupinky"]],
];
// Znaky, které houba má (pro kontrolu, že distraktor popisu částečně odpovídá).
const MA: Record<string, Z[]> = {
  "muchomůrka zelená": ["bileLupeny", "prsten", "pochva", "zelenyKlobouk"],
  "muchomůrka červená": ["bileLupeny", "prsten", "bradavky", "zluta"],
  "muchomůrka tygrovaná": ["bileLupeny", "prsten", "pochva", "bradavky"],
  "holubinka": ["bileLupeny", "zelenyKlobouk", "cervenyKlobouk"],
  "žampion": ["prsten", "ruzoveLupeny", "bezPochvy"],
  "bedla vysoká": ["prsten", "posuvny", "supiny", "hadovita", "bezPochvy"],
  "hřib satan": ["rourky", "modrani", "cervenyTren", "zapach"],
  "hřib smrkový": ["rourky"],
  "hřib žlučník": ["rourky", "ruzoveRourky", "tmavaSitka", "horky"],
  "kozák": ["rourky", "briza", "tmaveSupinky"],
  "křemenáč osikový": ["rourky", "zluta", "tmaveSupinky"],
  "liška obecná": ["lisyty", "zluta"],
  "václavka obecná": ["pareze", "medovy", "prsten", "supiny", "zluta"],
};

// (3b) ostatní L3 úlohy: kotva otázky → znak jediné správné možnosti
const L3_FAKTA: { kotva: RegExp; moznost: RegExp }[] = [
  { kotva: /žampion, nebo muchomůrku zelenou/i, moznost: /lupenů a pochva/i },
  { kotva: /smrkový a hřib žlučník/i, moznost: /růžovějících rourek/i },
  { kotva: /bedla vysoká se dá splést/i, moznost: /posuvný prsten/i },
  { kotva: /bez spodku třeně\?/i, moznost: /pochva/i },
  // (c) opatrné distraktory mají špatný důvod — rozhoduje znak v odpovědi
  { kotva: /kamarád tvrdí, že je to žampion\. Jak/i, moznost: /lupeny a pochva/i },
  { kotva: /rourkami jsou všechny jedlé/i, moznost: /satan/i },
  { kotva: /vajíčko mladé muchomůrky/i, moznost: /obrys/i },
  { kotva: /utrhl těsně nad zemí/i, moznost: /nevyloučí/i },
  { kotva: /otravu muchomůrkou zelenou/i, moznost: /po hodinách/i },
  { kotva: /nápadnými znaky/i, moznost: /varují/i },
  { kotva: /podle chuti nebo zápachu\?/i, moznost: /^ne,/i },
];

function vyresL3(t: PracticeTask): string {
  const q = t.question;
  const opts = t.options!;
  if (opts.every((o) => o in STAV)) {
    const znaky = (Object.keys(ZNAK) as Z[]).filter((z) => ZNAK[z].test(q));
    const kandidati = URCENI.filter(([, zz]) => zz.every((z) => znaky.includes(z))).map(([h]) => h);
    const hit = opts.filter((o) => kandidati.includes(o));
    expect(hit, `L3 znaky [${znaky.join(",")}] neurčí právě 1 houbu: ${q}`).toHaveLength(1);
    // nelze vylučovat nesmyslem: aspoň 2 distraktory sdílejí s popisem znak
    const sdili = opts.filter((o) => o !== hit[0] && (MA[o] ?? []).some((z) => znaky.includes(z)));
    expect(sdili.length, `L3: distraktory nesdílejí znaky: ${q}`).toBeGreaterThanOrEqual(2);
    return hit[0];
  }
  const f = L3_FAKTA.filter((x) => x.kotva.test(q));
  expect(f, `L3 fakta: žádná/nejednoznačná kotva: ${q}`).toHaveLength(1);
  const hit = opts.filter((o) => f[0].moznost.test(o));
  expect(hit, `L3 fakta: nepřipouští právě 1 možnost: ${q}`).toHaveLength(1);
  return hit[0];
}

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const LEVELS = [1, 2, 3] as const;
const tasksBy = Object.fromEntries(LEVELS.map((l) => [l, topic.generator!(l)])) as Record<number, PracticeTask[]>;
const all = LEVELS.flatMap((l) => tasksBy[l]);
const SOLVER: Record<number, (t: PracticeTask) => string> = { 1: vyresL1, 2: vyresL2, 3: vyresL3 };

function najdiUzel(n: unknown, id: string): { labels?: { area: string; topic: string } } | undefined {
  if (Array.isArray(n)) {
    for (const x of n) { const r = najdiUzel(x, id); if (r) return r; }
  } else if (n && typeof n === "object") {
    const o = n as Record<string, unknown>;
    if (o.id === id && o.labels) return o as { labels: { area: string; topic: string } };
    for (const v of Object.values(o)) { const r = najdiUzel(v, id); if (r) return r; }
  }
  return undefined;
}

describe("Houby — metadata", () => {
  it("přírodopis g6, select_one, factual, category/topic znak po znaku dle RVP", () => {
    expect(topic.id).toBe("g6-pri-jedle-a-jedovate-houby-6");
    expect(topic.subject).toBe("prirodopis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.contentType).toBe("factual");
    expect(topic.studentTitle).toBe("Jedlé a jedovaté houby");
    const rvp = JSON.parse(readFileSync(join(process.cwd(), "data/rvp_data.json"), "utf8"));
    const uzel = najdiUzel(rvp, topic.rvpNodeId!);
    expect(uzel?.labels?.area).toBe(topic.category);
    expect(uzel?.labels?.topic).toBe(topic.topic);
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });

  it("bez inline číslovek s číslicí a bez latinských názvů", () => {
    const src = readFileSync(join(process.cwd(), "src/content/grade-6/prirodopis/jedleAJedovateHouby.ts"), "utf8");
    const kod = src.split("\n").filter((l) => !/^\s*(\*|\/\/|\/\*)/.test(l)).join("\n");
    expect(/\d+\s+(hub|hodin|houb)/i.test(kod)).toBe(false);
    expect(/Amanita|Boletus|Cantharellus|Agaricus/.test(kod)).toBe(false);
  });
});

describe.each(LEVELS)("Houby — úroveň %i", (level) => {
  const tasks = tasksBy[level];

  it("≥12 unikátních úloh i otázek, deterministicky, jen select_one s options", () => {
    expect(pocetUnikatnich(tasks)).toBeGreaterThanOrEqual(12);
    expect(new Set(tasks.map((t) => t.question)).size).toBeGreaterThanOrEqual(12);
    expect(topic.generator!(level).map((t) => t.question).sort()).toEqual(tasks.map((t) => t.question).sort());
    for (const t of tasks) expect(Array.isArray(t.options), t.question).toBe(true);
  });

  it("4 unikátní možnosti, klíč právě jednou, feedback pro každý distraktor", () => {
    for (const t of tasks) {
      expect(t.options, t.question).toHaveLength(4);
      expect(new Set(t.options).size, t.question).toBe(4);
      expect(t.options!.filter((o) => o === t.correctAnswer)).toHaveLength(1);
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback?.[d], `chybí feedback „${d}“: ${t.question}`).toBeTruthy();
      }
      expect(t.explanation, t.question).toBeTruthy();
    }
  });

  it("nezávislý solver dojde ke stejnému klíči", () => {
    for (const t of tasks) expect(t.correctAnswer, t.question).toBe(SOLVER[level](t));
  });

  it("klíč není v otázce ani v nápovědách; hints[0] ≠ hints[1]", () => {
    for (const t of tasks) {
      const k = norm(t.correctAnswer);
      expect(norm(t.question).includes(k), `giveaway: ${t.question}`).toBe(false);
      expect(t.hints, t.question).toHaveLength(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      for (const h of t.hints!) expect(norm(h).includes(k), `nápověda prozrazuje: ${h}`).toBe(false);
    }
  });

  it("klíč nevyčnívá prvním slovem", () => {
    const prvni = (s: string) => s.split(/[\s,—–:;]/)[0].toLowerCase().replace(/[.!?„“"']/g, "");
    for (const t of tasks) {
      const jine = t.options!.filter((o) => o !== t.correctAnswer).map(prvni);
      if (new Set(jine).size === 1 && jine[0].length >= 3) {
        expect(prvni(t.correctAnswer), `klíč vyčnívá: ${t.question}`).toBe(jine[0]);
      }
    }
  });
});

describe("Houby — napříč tématem", () => {
  it("L2: každý distraktor porušuje aspoň jedno pravidlo, klíč žádné", () => {
    for (const t of tasksBy[2]) {
      for (const o of t.options!) {
        const mytus = MYTY.some((r) => r.test(o));
        expect(mytus, `${o === t.correctAnswer ? "klíč s mýtem" : "distraktor bez mýtu"}: ${o}`).toBe(o !== t.correctAnswer);
      }
    }
  });

  it("zdravotní pojistka: klíč ani vysvětlení neradí ochutnat ani čekat", () => {
    const rada = /(?<!ne)ochutn|(?<!ne)počk|vyčk|(?<!ne)kousn|(?<!ne)zkus/i;
    for (const t of all) {
      expect(rada.test(t.correctAnswer), `klíč: ${t.correctAnswer}`).toBe(false);
      expect(rada.test(t.explanation ?? ""), `vysvětlení: ${t.explanation}`).toBe(false);
    }
  });

  it("klíč není systematicky nejdelší", () => {
    let nejdelsi = 0;
    let vyrazne = 0;
    let sumKlic = 0;
    let sumDistr = 0;
    for (const t of all) {
      const s = [...t.options!].sort((a, b) => b.length - a.length);
      if (s[0] === t.correctAnswer && s[0].length > s[1].length) nejdelsi++;
      if (s[0] === t.correctAnswer && s[0].length >= s[1].length * 1.25) vyrazne++;
      const d = t.options!.filter((o) => o !== t.correctAnswer);
      sumKlic += t.correctAnswer.length;
      sumDistr += d.reduce((a, o) => a + o.length, 0) / d.length;
    }
    expect(nejdelsi / all.length, `klíč nejdelší v ${nejdelsi}/${all.length}`).toBeLessThanOrEqual(0.4);
    expect(vyrazne / all.length, `klíč výrazně nejdelší v ${vyrazne}/${all.length}`).toBeLessThanOrEqual(0.1);
    expect(sumKlic / sumDistr).toBeLessThanOrEqual(1.15);
  });

  it("L1 ∩ L3 = ∅ a L3 nepoužívá šablonu „Která z těchto hub je…“", () => {
    const q1 = new Set(tasksBy[1].map((t) => t.question));
    expect(tasksBy[3].map((t) => t.question).filter((q) => q1.has(q))).toHaveLength(0);
    for (const t of tasksBy[3]) expect(/Která z těchto hub je/i.test(t.question), t.question).toBe(false);
  });

  it("L1: nejvíc smrtelných otrav — distraktorem je vždy muchomůrka červená", () => {
    for (const t of tasksBy[1].filter((x) => /smrteln/i.test(x.question))) {
      expect(t.options, t.question).toContain("muchomůrka červená");
    }
  });

  it("nápovědy unikátní napříč úlohami", () => {
    expect(new Set(all.map((t) => t.hints![0])).size).toBe(all.length);
    expect(new Set(all.map((t) => t.hints![1])).size).toBe(all.length);
  });

  it("žádné rodové lomítkové tvary", () => {
    for (const t of all) {
      const texty = [t.question, t.explanation ?? "", ...(t.hints ?? []), ...t.options!, ...Object.values(t.optionFeedback ?? {})];
      for (const s of texty) expect(/\p{L}\/\p{L}/u.test(s), `lomítko: ${s}`).toBe(false);
    }
  });
});
