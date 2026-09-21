import { describe, it, expect } from "vitest";
import { SYNONYMA_ANTONYMA_HOMONYMA } from "../cjl/synonymaAntonymaHomonyma";
import type { PracticeTask } from "@/lib/types";

/**
 * Synonyma, antonyma, homonyma — čeština 6. ročník (select_one).
 * Kontroluje: strukturu, chybový model (feedback pro každý distraktor), žádný
 * hint_leak, gradaci L1 (jednoznačné slovo / vztah dvojice) → L2 (mnohoznačné
 * slovo ve dvou větách) → L3 (homonyma), a VĚCNOU SPRÁVNOST přes nezávislý
 * solver, který pracuje jen z textu otázky — má vlastní tabulky, ne import
 * z generátoru.
 */
const topic = SYNONYMA_ANTONYMA_HOMONYMA[0];

// ── Nezávislé tabulky (napsané odděleně od generátoru) ──────────────────────
const SYNANT_L1: Record<string, { syn: string; ant: string }> = {
  unavený: { syn: "vyčerpaný", ant: "odpočatý" },
  rychlý: { syn: "hbitý", ant: "pomalý" },
  veselý: { syn: "radostný", ant: "smutný" },
  statečný: { syn: "odvážný", ant: "zbabělý" },
  čistý: { syn: "uklizený", ant: "špinavý" },
  hlasitý: { syn: "hlučný", ant: "tichý" },
  bohatý: { syn: "zámožný", ant: "chudý" },
  krásný: { syn: "nádherný", ant: "ošklivý" },
  silný: { syn: "statný", ant: "slabý" },
  moudrý: { syn: "rozumný", ant: "hloupý" },
  štědrý: { syn: "velkorysý", ant: "lakomý" },
  přátelský: { syn: "vlídný", ant: "nepřátelský" },
  pilný: { syn: "snaživý", ant: "líný" },
  levný: { syn: "laciný", ant: "drahý" },
  zvědavý: { syn: "zvídavý", ant: "lhostejný" },
  poslušný: { syn: "ukázněný", ant: "neposlušný" },
};

type Relace = "syn" | "ant" | "hom" | "pri";
const RELACE_L1: Record<string, Relace> = {
  "veselý|radostný": "syn",
  "rychlý|hbitý": "syn",
  "krásný|nádherný": "syn",
  "statečný|odvážný": "syn",
  "silný|slabý": "ant",
  "bohatý|chudý": "ant",
  "štědrý|lakomý": "ant",
  "hlasitý|tichý": "ant",
  "bál (ples)|bál (tvar slovesa bát se)": "hom",
  "rys (zvíře)|rys (obličeje)": "hom",
  "jedu (tvar slovesa jet)|jedu (3. pád slova jed)": "hom",
  "peru (tvar slovesa prát)|peru (3. pád slova pero)": "hom",
  "les|lesní": "pri",
  "voda|vodní": "pri",
  "kniha|knihovna": "pri",
  "škola|školní": "pri",
};
const RELACE_PREFIX: Record<Relace, string> = { syn: "synonyma", ant: "antonyma", hom: "homonyma", pri: "slova příbuzná" };

const L2_VETY: Record<string, { synonym: string; antonym: string }> = {
  "Balicí papír byl na dotek hrubý.": { synonym: "drsný", antonym: "hladký" },
  "Petr udělal v diktátu hrubou chybu.": { synonym: "závažnou", antonym: "drobnou" },
  "Kuchyňský nůž byl velmi ostrý.": { synonym: "nabroušený", antonym: "tupý" },
  "Paprika v omáčce byla hodně ostrá.": { synonym: "pálivá", antonym: "mírná" },
  "Chléb na talíři byl už starý.": { synonym: "oschlý", antonym: "čerstvý" },
  "Na lavičce seděl starý pán.": { synonym: "stařičký", antonym: "mladý" },
  "V údolí tekl bystrý potok.": { synonym: "prudký", antonym: "klidný" },
  "Honza je bystrý žák.": { synonym: "chytrý", antonym: "hloupý" },
  "Maso v guláši bylo tvrdé.": { synonym: "tuhé", antonym: "měkké" },
  "Dědeček měl vždycky tvrdý spánek.": { synonym: "hluboký", antonym: "lehký" },
};

const L3A_VYZNAMY: Record<string, string> = {
  "Na severu Evropy žije statný los.": "velké divoké zvíře s parohy",
  "Můj los ve školní tombole vyhrál.": "lístek, kterým se hraje o výhru",
  "Německo je sousední stát.": "země s vlastní vládou a hranicemi",
  "Musím dlouho stát ve frontě.": "být vestoje a čekat",
  "V dílně visí stará pila.": "nástroj na řezání dřeva",
  "Babička pila čaj.": "minulý čas slovesa pít",
  "Potkal jsem milou ženu.": "4. pád podstatného jména žena",
  "Každé ráno ženu kozy na pastvu.": "tvar slovesa hnát (co dělám já)",
  "Přišly tři kamarádky.": "základní číslovka (počet 3)",
  "Pořádně si tři ruce mýdlem.": "rozkaz od slovesa třít",
  "Nad loukou přeletělo hejno jeřábů popelavých.": "velký stěhovavý pták",
  "Na kraji lesa rostl jeřáb obtěžkaný červenými plody.": "listnatý strom",
};

const HOMONYM_SLOVA = ["los", "stát", "pila", "ženu", "tři", "jeřáb"];

/** Nezávislý solver — vrací null, když otázku nerozpozná (jiný typ úlohy). */
function solve(t: PracticeTask): { kind: string; expected: string } | null {
  const q = t.question;
  let m: RegExpMatchArray | null;

  // L1a — synonymum/antonymum jednoznačného slova ve větě
  if ((m = q.match(/Jaké slovo je (synonymem|antonymem)[^"„]*slova „(.+?)“ ve větě „(.+?)“\?/))) {
    const typ = m[1];
    const marked = m[2];
    if (marked in SYNANT_L1) {
      const row = SYNANT_L1[marked];
      return { kind: "L1a", expected: typ === "synonymem" ? row.syn : row.ant };
    }
    // L2 — mnohoznačné slovo, klíč podle KONKRÉTNÍ věty
    const veta = q.match(/ve větě „(.+?)“\?/)?.[1];
    if (veta && veta in L2_VETY) {
      const row = L2_VETY[veta];
      return { kind: "L2", expected: typ === "synonymem" ? row.synonym : row.antonym };
    }
    return null;
  }

  // L1b — vztah mezi dvojicí slov
  if ((m = q.match(/^Jaký je vztah mezi slovy „(.+?)“ a „(.+?)“\?$/))) {
    const key = `${m[1]}|${m[2]}`;
    const keyObracene = `${m[2]}|${m[1]}`;
    const relace = RELACE_L1[key] ?? RELACE_L1[keyObracene];
    if (relace) return { kind: "L1b", expected: RELACE_PREFIX[relace] };
    return null;
  }

  // L3a — význam homonyma v konkrétní větě
  if ((m = q.match(/^Co znamená slovo „(.+?)“ ve větě „(.+?)“\?$/))) {
    const veta = m[2];
    if (veta in L3A_VYZNAMY) return { kind: "L3a", expected: L3A_VYZNAMY[veta] };
    return null;
  }

  // L3c — homonymum, nebo mnohoznačné slovo (a proč)
  if ((m = q.match(/^Jak spolu souvisejí dva významy slova „(.+?)“/))) {
    return HOMONYM_SLOVA.includes(m[1])
      ? { kind: "L3c", expected: "homonyma – významy spolu nesouvisejí" }
      : { kind: "L3c", expected: "mnohoznačné slovo – jeden význam vznikl přenesením" };
  }

  // L3b — která dvojice jsou homonyma
  if (/HOMONYMA|homonyma/.test(q) && /dvojici|dvojic/.test(q)) {
    return { kind: "L3b", expected: "__HOMONYM_LABEL__" };
  }

  return null;
}

describe("Synonyma, antonyma, homonyma — metadata", () => {
  it("čeština g6, select_one, Jazyková výchova", () => {
    expect(topic.subject).toBe("čeština");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.id).toBe("g6-cjl-synonyma-antonyma-homonyma-6");
    expect(topic.category).toBe("Jazyková výchova");
    expect(topic.topic).toBe("Nauka o slovní zásobě");
  });
});

describe.each([1, 2, 3])("Synonyma/antonyma/homonyma — úlohy level %i", (level) => {
  const tasks = topic.generator(level);

  it("≥12 unikátních úloh", () => {
    const keys = new Set(tasks.map((t) => `${t.question}|${t.correctAnswer}`));
    expect(keys.size).toBeGreaterThanOrEqual(12);
  });

  it("4 různé možnosti, správná je mezi nimi", () => {
    for (const t of tasks) {
      expect(t.options!.length, t.question).toBe(4);
      expect(new Set(t.options).size, `duplicitní options: ${t.question}`).toBe(4);
      expect(t.options, `correctAnswer mimo options: ${t.question}`).toContain(t.correctAnswer);
    }
  });

  it("chybový model: každý distraktor má feedback, správná ne", () => {
    for (const t of tasks) {
      for (const key of Object.keys(t.optionFeedback!)) {
        expect(t.options, `feedback klíč mimo options: ${key}`).toContain(key);
        expect(key).not.toBe(t.correctAnswer);
      }
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback![d], `chybí feedback: "${d}" v ${t.question}`).toBeTruthy();
      }
    }
  });

  it("nápověda neprozrazuje výsledek (2 unikátní nápovědy)", () => {
    for (const t of tasks) {
      expect(t.hints?.length, t.question).toBeGreaterThanOrEqual(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      for (const h of t.hints ?? []) {
        expect(h, `hint leak: ${t.question}`).not.toContain(t.correctAnswer);
      }
    }
  });

  it("každá úloha má vysvětlení", () => {
    for (const t of tasks) {
      expect(t.explanation, t.question).toBeTruthy();
    }
  });

  it("klíč není systematicky nejdelší možnost", () => {
    const nejdelsiJeKlic = tasks.filter((t) => {
      const maxLen = Math.max(...t.options!.map((o) => o.length));
      return t.correctAnswer.length === maxLen;
    }).length;
    expect(nejdelsiJeKlic / tasks.length, "klíč = nejdelší možnost příliš často").toBeLessThan(0.8);
  });

  it("NEZÁVISLÝ SOLVER: klíč souhlasí s vlastním výpočtem", () => {
    for (const t of tasks) {
      const s = solve(t);
      expect(s, `solver nerozpoznal úlohu: ${t.question}`).not.toBeNull();
      if (s!.kind === "L3b") {
        // Klíč musí být ta z options, jejíž "slovo" před dvojtečkou je opravdové
        // homonymum (los/stát/pila/ženu/tři/jeřáb), ne mnohoznačné slovo, syn. ani anton.
        const label = t.correctAnswer.split(":")[0];
        expect(HOMONYM_SLOVA, `L3b klíč "${t.correctAnswer}" není homonymum: ${t.question}`).toContain(label);
        // a žádná JINÁ možnost nesmí být také reálné homonymum (jednoznačnost klíče)
        for (const o of t.options!.filter((x) => x !== t.correctAnswer)) {
          const l = o.split(":")[0];
          expect(HOMONYM_SLOVA, `distraktor "${o}" je taky homonymum: ${t.question}`).not.toContain(l);
        }
      } else if (s!.kind === "L1b" || s!.kind === "L3c") {
        expect(t.correctAnswer.startsWith(s!.expected), `${s!.kind}: ${t.question} → klíč "${t.correctAnswer}", čekáno "${s!.expected}…"`).toBe(true);
      } else {
        expect(t.correctAnswer, `${s!.kind}: ${t.question}`).toBe(s!.expected);
      }
    }
  });
});

describe("Synonyma/antonyma/homonyma — gradace L1 ≠ L2 ≠ L3", () => {
  it("věty/otázky L1 a L3 jsou textově disjunktní", () => {
    const l1 = new Set(topic.generator(1).map((t) => t.question));
    const l3 = topic.generator(3).map((t) => t.question);
    for (const q of l3) expect(l1.has(q), `L3 otázka se opakuje v L1: ${q}`).toBe(false);
  });

  it("L2 věty jsou disjunktní s bankou L1 (žádné slovo z L1a se v L2 nepoužívá jako zvýrazněné)", () => {
    const l1Slova = new Set(Object.keys(SYNANT_L1));
    const l2 = topic.generator(2);
    for (const t of l2) {
      const m = t.question.match(/slova „(.+?)“ ve větě/);
      if (m) expect(l1Slova.has(m[1]), `L2 používá slovo z L1 banky: ${m[1]}`).toBe(false);
    }
  });

  it("L1 obsahuje oba formáty (jednoznačné slovo i vztah dvojice) v poměru blízkém 1:1", () => {
    const l1 = topic.generator(1).map((t) => t.question);
    const format1 = l1.filter((q) => /^Jaké slovo je/.test(q)).length;
    const format2 = l1.filter((q) => /^Jaký je vztah/.test(q)).length;
    expect(format1, "chybí formát A (jednoznačné slovo)").toBeGreaterThan(0);
    expect(format2, "chybí formát B (vztah dvojice)").toBeGreaterThan(0);
    expect(Math.abs(format1 - format2)).toBeLessThanOrEqual(2);
  });

  it("L3 obsahuje homonyma v kontextu i klasifikaci dvojic", () => {
    const l3 = topic.generator(3).map((t) => t.question);
    expect(l3.some((q) => /^Co znamená slovo/.test(q))).toBe(true);
    expect(l3.some((q) => /homonym/i.test(q))).toBe(true);
  });
});

describe("Synonyma/antonyma/homonyma — opravy z review", () => {
  it("L1b: žádná dvojice se neopakuje s prohozeným pořadím a klíč nejsou pořád synonyma", () => {
    const l1b = topic.generator(1).filter((t) => /^Jaký je vztah/.test(t.question));
    const pary = l1b.map((t) => {
      const m = t.question.match(/„(.+?)“ a „(.+?)“/)!;
      return [m[1], m[2]].sort().join("|");
    });
    expect(new Set(pary).size).toBe(pary.length);
    const klice = new Set(l1b.map((t) => t.correctAnswer.split(" – ")[0]));
    expect(klice.size, "L1b musí mít ve vzorku víc druhů vztahu").toBeGreaterThanOrEqual(3);
  });

  it("L2: všechny možnosti mají stejnou koncovku (rod/pád) jako zvýrazněné slovo", () => {
    for (const t of topic.generator(2)) {
      const marked = t.question.match(/slova „(.+?)“ ve větě/)![1];
      for (const o of t.options!) {
        expect(o.slice(-1), `neshoda koncovky „${o}“ × „${marked}“: ${t.question}`).toBe(marked.slice(-1));
      }
    }
  });

  it("L2: nápověda neobsahuje kořen synonyma ani antonyma dané věty", () => {
    for (const t of topic.generator(2)) {
      const veta = t.question.match(/ve větě „(.+?)“\?/)![1];
      const row = L2_VETY[veta];
      for (const slovo of [row.synonym, row.antonym]) {
        const koren = slovo.slice(0, 4).toLowerCase();
        for (const h of t.hints!) expect(h.toLowerCase(), `hint obsahuje kořen „${koren}“: ${t.question}`).not.toContain(koren);
      }
    }
  });

  it("L3a: distraktory nejsou významy jiných homonym z banky a popis neopakuje hledaný tvar", () => {
    const vyznamyPodleSlova: Record<string, string[]> = {};
    const l3a = topic.generator(3).filter((t) => /^Co znamená slovo/.test(t.question));
    for (const t of l3a) {
      const slovo = t.question.match(/slovo „(.+?)“/)![1];
      expect(t.correctAnswer.toLowerCase(), `popis opakuje tvar „${slovo}“`).not.toMatch(new RegExp(`(^|[^a-zá-ž])${slovo}([^a-zá-ž]|$)`));
      (vyznamyPodleSlova[slovo] ??= []).push(t.correctAnswer);
    }
    for (const t of l3a) {
      const slovo = t.question.match(/slovo „(.+?)“/)![1];
      for (const o of t.options!) {
        for (const [jine, vyznamy] of Object.entries(vyznamyPodleSlova)) {
          if (jine !== slovo) expect(vyznamy, `„${o}“ je význam jiného homonyma (${jine}): ${t.question}`).not.toContain(o);
        }
      }
    }
  });

  it("L3 obsahuje i úlohu homonymum × mnohoznačné slovo s oběma klíči", () => {
    const l3c = topic.generator(3).filter((t) => /^Jak spolu souvisejí/.test(t.question));
    const klice = new Set(l3c.map((t) => t.correctAnswer.split(" – ")[0]));
    expect(klice).toEqual(new Set(["homonyma", "mnohoznačné slovo"]));
  });
});
