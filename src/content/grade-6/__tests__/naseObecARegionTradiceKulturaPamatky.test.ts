import { describe, it, expect } from "vitest";
import { NASE_OBEC_A_REGION_TRADICE_KULTURA_PAMATKY } from "../vko/naseObecARegionTradiceKulturaPamatky";
import { klicUlohy } from "@/lib/taskIdentity";
import type { PracticeTask } from "@/lib/types";

/**
 * Naše obec a region — tradice, kultura, památky (VKO 6. ročník, select_one).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta), dva na sobě nezávislé kroky:
 *  1) Ruční tabulka PRAVIDLA — pro každou konkrétní otázku (rozpoznanou podle
 *     unikátního začátku znění, NE podle logiky generátoru) je zapsáno, jaký
 *     musí mít klíč tvar. Sestavena přímo z banky, nezávisle na `_shared.ts`.
 *  2) Lexikální klasifikátor `klasifikujPamatku` — u úloh, které popisují typ
 *     stavby (hrad × zámek × chrám), odvodí kategorii jen z popisných znaků
 *     ve větě (opevnění/příkop/věž × okna/zahrada/bez opevnění × bohoslužby),
 *     BEZ ohledu na klíč. Ověřuje se tak i to, že popis v bance skutečně
 *     jednoznačně sedí jen na jednu kategorii (žádný popis nesedí na obě).
 */
const topic = NASE_OBEC_A_REGION_TRADICE_KULTURA_PAMATKY[0];
const low = (s: string) => s.toLowerCase();

type Pravidlo = { name: string; test: (t: PracticeTask) => boolean; kmen: RegExp };

const PRAVIDLA: Pravidlo[] = [
  // ── L1 — definice a přímé rozpoznání ─────────────────────────────────
  { name: "starosta v čele/zvolen zastupitelstvem", test: (t) => /^Kdo stojí v čele obce a je zvolen/.test(t.question), kmen: /^starosta$/ },
  { name: "úřad vyřizuje doklady", test: (t) => /^Kdo vyřizuje běžné záležitosti občanů obce/.test(t.question), kmen: /^obecní/ },
  { name: "zastupitelstvo rozhoduje a volí starostu", test: (t) => /^Kdo je volený sbor, který rozhoduje/.test(t.question), kmen: /^zastupitelstvo/ },
  { name: "def obec", test: (t) => /^Jaká je základní jednotka veřejné samosprávy/.test(t.question), kmen: /^obec$/ },
  { name: "def kraj (nadřazená obci)", test: (t) => /^Která jednotka samosprávy je nadřazená obci/.test(t.question), kmen: /^kraj$/ },
  { name: "def hrad (zdi, příkop, věže)", test: (t) => /^Jak se nazývá opevněné sídlo s vysokými zdmi/.test(t.question), kmen: /^hrad$/ },
  { name: "def zámek (okázalost, bez opevnění)", test: (t) => /^Jak se nazývá reprezentativní obytné sídlo/.test(t.question), kmen: /^zámek$/ },
  { name: "def chrám (bohoslužby)", test: (t) => /^Jak se nazývá stavba určená k bohoslužbám/.test(t.question), kmen: /^chrám$/ },
  { name: "def místní tradice", test: (t) => /^Jak se nazývá lidový zvyk vázaný na konkrétní obec/.test(t.question), kmen: /^místní tradice$/ },
  { name: "def státní svátek", test: (t) => /^Jak se nazývá den, který je stejně pro celou Českou republiku/.test(t.question), kmen: /^státní svátek$/ },
  { name: "starosta zastupuje navenek", test: (t) => /^Kdo obec zastupuje navenek/.test(t.question), kmen: /^starosta$/ },
  { name: "hejtman v čele kraje", test: (t) => /^Kdo stojí v čele kraje/.test(t.question), kmen: /^hejtman$/ },

  // ── L2 — aplikace/porovnání v situaci ────────────────────────────────
  { name: "chodník u domu = obec", test: (t) => /^Chodník před panem Novákovým domem/.test(t.question), kmen: /^obec/ },
  { name: "krajská silnice mezi městy = kraj", test: (t) => /^Mezi dvěma menšími městy vede krajská silnice/.test(t.question), kmen: /^kraj/ },
  { name: "trvalé bydliště v nové obci = úřad", test: (t) => /^Rodina se přestěhovala do nové obce/.test(t.question), kmen: /^na obecní/ },
  { name: "školka pro obec = zastupitelstvo", test: (t) => /^Obec chce postavit novou mateřskou školku/.test(t.question), kmen: /^zastupitelstvo/ },
  { name: "krajská nemocnice = krajské zastupitelstvo", test: (t) => /^Kraj plánuje postavit novou nemocnici/.test(t.question), kmen: /^krajské zastupitelstvo$/ },
  { name: "vyřízení hřiště = úřad", test: (t) => /^Zastupitelstvo obce na svém zasedání odhlasovalo/.test(t.question), kmen: /^obecní úřad$/ },
  { name: "poplatek za psa = úřad", test: (t) => /^Paní Dvořáková si pořídila psa/.test(t.question), kmen: /^na obecní/ },
  { name: "rozpočet obce = zastupitelstvo", test: (t) => /^Obec potřebuje schválit, kolik peněz/.test(t.question), kmen: /^zastupitelstvo/ },
  { name: "popis hradu (kopec, zdi, příkop)", test: (t) => /^Na kopci nad městem stojí stavba/.test(t.question), kmen: /^hrad$/ },
  { name: "popis zámku (park, okna, zahrada)", test: (t) => /^V parku u řeky stojí stavba/.test(t.question), kmen: /^zámek$/ },
  { name: "pouť v jedné vesnici = tradice", test: (t) => /^V jedné konkrétní vesnici se každý rok koná pouť/.test(t.question), kmen: /^místní tradice$/ },
  { name: "17. listopad = svátek", test: (t) => /^17\. listopadu mají volno/.test(t.question), kmen: /^státní svátek$/ },
  { name: "masopust = tradice", test: (t) => /^Masopustní průvod s maskami/.test(t.question), kmen: /^místní/ },
  { name: "lavičky v obecním parku = zastupitelstvo", test: (t) => /^V obci chybí lavičky/.test(t.question), kmen: /^zastupitelstvo/ },

  // ── L3 — transfer: smyšlené situace, dva kroky ───────────────────────
  { name: "zámek s muzejní expozicí kočárů", test: (t) => /^V bývalém šlechtickém sídle/.test(t.question), kmen: /^o zámek/ },
  { name: "hrad s expozicí zbraní", test: (t) => /^Na skále nad řekou stojí stavba/.test(t.question), kmen: /^o hrad/ },
  { name: "Lipová: chodník=obec, silnice=kraj", test: (t) => /^Ve smyšlené obci Lipová/.test(t.question), kmen: /(?=.*obecní úřad lipové)(?=.*silnici.*kraj)/i },
  { name: "Javorná: střední školy = kraj", test: (t) => /^Ve vymyšlené horské obci Javorná/.test(t.question), kmen: /^na kraj/ },
  { name: "Dolní Lomná: povolení = úřad", test: (t) => /^Ve vymyšlené obci Dolní Lomná/.test(t.question), kmen: /^v praktickém vyřízení/ },
  { name: "Krásná Lhota vs. 1. květen", test: (t) => /^Ve smyšlené obci Krásná Lhota/.test(t.question), kmen: /(?=.*slavnost)(?=.*1\. květen)/i },
  { name: "chrám s expozicí náhrobků", test: (t) => /^Kamenná stavba s vysokou věží/.test(t.question), kmen: /^o chrám/ },
  { name: "Petrovice: osvětlení ulice = obec", test: (t) => /^Ve vymyšlené obci Petrovice/.test(t.question), kmen: /^ne, osvětlení/ },
  { name: "Dubinka: výroční trh ≠ zákonné volno", test: (t) => /^Firma ve vymyšlené obci Dubinka/.test(t.question), kmen: /^ne, jde o místní zvyk/ },
  { name: "Zelený Důl: zastupitelstvo → úřad", test: (t) => /^Ve vymyšlené obci Zelený Důl/.test(t.question), kmen: /^nejdřív volený sbor obce/ },
  { name: "Horní Bříza: dům bez opevnění = zámek s expozicí", test: (t) => /^Ve vymyšlené obci Horní Bříza/.test(t.question), kmen: /^o zámek/ },
  { name: "Lesná/Podhájí mazance vs. svátek práce", test: (t) => /^Ve vymyšleném regionu sousední obce Lesná a Podhájí/.test(t.question), kmen: /^pečení mazanců/ },
];

function solve(t: PracticeTask): Pravidlo {
  const hit = PRAVIDLA.filter((p) => p.test(t));
  expect(hit.map((p) => p.name), `solver musí úlohu rozpoznat právě jedním pravidlem: ${t.question}`).toHaveLength(1);
  return hit[0];
}

/**
 * Nezávislý lexikální klasifikátor typu stavby — odvozuje kategorii jen
 * z popisných znaků ve VĚTĚ (ne z klíče). Pravidlo (shodné s CLAUDE.md
 * pro VKO): opevnění (zdi/příkop/věž/padací most) → hrad; okna/zahrada
 * bez opevnění → zámek; bohoslužby → chrám.
 */
function klasifikujPamatku(text: string): "hrad" | "zámek" | "chrám" | null {
  const t = low(text);
  // Klasifikátor se použije jen u úloh, které se ptají přímo na typ stavby
  // (jinde by slova jako „zdi“ mohla být jen náhodná shoda mimo popis památky).
  if (!/jak se nazývá|o jaký typ stavby/.test(t)) return null;
  const bohosluzby = /bohoslužb/.test(t);
  if (bohosluzby) return "chrám";
  const bezOpevneni = /bez (jakéhokoli )?opevnění/.test(t);
  const obranneZnaky = /příkop|padacím mostem|strážní věží|vysokými zdmi|opevněné sídlo/.test(t);
  if (bezOpevneni && !obranneZnaky) return "zámek";
  if (obranneZnaky && !bezOpevneni) return "hrad";
  return null;
}

/** Z klíče (correctAnswer) vytáhne, o jaký typ stavby jde. */
function typZKlice(correctAnswer: string): "hrad" | "zámek" | "chrám" | null {
  const c = low(correctAnswer);
  if (/^o chrám|^chrám$/.test(c)) return "chrám";
  if (/^o zámek|^zámek$/.test(c)) return "zámek";
  if (/^o hrad|^hrad$/.test(c)) return "hrad";
  return null;
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

describe("Naše obec a region — metadata", () => {
  it("vko g6, select_one, přesné RVP zařazení", () => {
    expect(topic.id).toBe("g6-vko-nase-obec-a-region-tradice-kultura-pamatky-6");
    expect(topic.subject).toBe("vko");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.rvpNodeId).toBe(
      "g6-vko-clovek-ve-spolecnosti-nase-obec-region-vlast-nase-obec-a-region-tradice-kultura-pamatky",
    );
    expect(topic.category).toBe("Člověk ve společnosti");
    expect(topic.topic).toBe("Naše obec, region, vlast");
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });

  it("žádné jmenování současných konkrétních osob ve funkci", () => {
    for (const level of [1, 2, 3]) {
      for (const t of topic.generator(level)) {
        const texty = [t.question, ...(t.options ?? []), t.explanation ?? "", ...Object.values(t.optionFeedback ?? {})];
        for (const s of texty) {
          expect(s, `možné jmenování osoby: ${s}`).not.toMatch(/prezident (je|se jmenuje) [A-ZÁ-Ž]|starosta (je|se jmenuje) [A-ZÁ-Ž]/);
        }
      }
    }
  });
});

describe.each([1, 2, 3])("Naše obec a region — úlohy level %i", (level) => {
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

  it("SOLVER 1 (ruční tabulka): klíč souhlasí s nezávislou cestou podle znění otázky", () => {
    for (const t of tasks) {
      const p = solve(t);
      expect(low(t.correctAnswer), `${p.name}: ${t.question}`).toMatch(p.kmen);
    }
  });

  it("SOLVER 2 (lexikální klasifikátor památek): popis stavby jednoznačně určuje typ, sedí s klíčem", () => {
    for (const t of tasks) {
      const klasifikace = klasifikujPamatku(t.question);
      const zKlice = typZKlice(t.correctAnswer);
      if (klasifikace === null) continue; // úloha nepopisuje typ stavby (samospráva / tradice-svátek)
      expect(zKlice, `klíč "${t.correctAnswer}" nemá rozpoznatelný typ stavby: ${t.question}`).not.toBeNull();
      expect(klasifikace, `popis vs. klíč nesedí: ${t.question} → klíč "${t.correctAnswer}"`).toBe(zKlice);
    }
  });

  it("žádný hodnotový soud u sporných témat (politika, náboženství, rodina, kultura)", () => {
    for (const t of tasks) {
      const texty = [t.question, ...(t.options ?? []), t.explanation ?? ""];
      for (const s of texty) {
        expect(s, `hodnotový soud: ${s}`).not.toMatch(/lepší kultura|horší kultura|správné náboženství|jediná pravá víra|lepší strana/i);
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

describe("Naše obec a region — gradace", () => {
  it("L1 a L3 se zněním otázek nepřekrývají", () => {
    const l1 = topic.generator(1), l3 = topic.generator(3);
    const q1 = new Set(l1.map((t) => norm(t.question)));
    expect(l3.filter((t) => q1.has(norm(t.question)))).toHaveLength(0);
  });

  it("L3 je transfer: smyšlené/vymyšlené situace nebo kombinace dvou znaků najednou, ne recyklovaná L1", () => {
    const l3 = topic.generator(3);
    const transfer = l3.filter((t) => /smyšlen|vymyšlen/i.test(t.question));
    expect(transfer.length, "L3 musí obsahovat úlohy s novým, vymyšleným případem").toBeGreaterThanOrEqual(6);
  });

  it("L1 je přímé rozpoznání jedné věty/definice — kratší než průměrná L3 otázka", () => {
    const avgLen = (tasks: PracticeTask[]) => tasks.reduce((s, t) => s + t.question.length, 0) / tasks.length;
    const l1 = topic.generator(1), l3 = topic.generator(3);
    expect(avgLen(l1)).toBeLessThan(avgLen(l3));
  });
});
