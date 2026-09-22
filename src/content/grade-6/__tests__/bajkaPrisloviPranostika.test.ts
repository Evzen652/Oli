import { describe, it, expect } from "vitest";
import { BAJKA_PRISLOVI_PRANOSTIKA } from "../cjl/bajkaPrisloviPranostika";
import type { PracticeTask } from "@/lib/types";

/**
 * Bajka, přísloví a pranostika — čeština 6. ročník (select_one).
 *
 * NEZÁVISLÝ SOLVER: (1) L1 klasifikátor klíčových slov nad ukázkou (jméno
 * svátku/měsíce + slovo o počasí/úrodě = pranostika; jednověté obecné rčení
 * bez data = přísloví; vícevětý text se zvířecími postavami = bajka) —
 * sestaven nezávisle na generátoru. (2) Pro L2/L3 ručně přepsané tabulky
 * ukázka/situace → očekávaný klíč, nezávislé na bankách generátoru.
 * (3) Pro L3(a) kontrola, že klíčové přísloví nesdílí se situací žádné
 * "obsahové" slovo (délka ≥ 4 znaky, mimo běžné spojky/zájmena).
 */
const topic = BAJKA_PRISLOVI_PRANOSTIKA[0];

// ── (1) L1 klasifikátor ──────────────────────────────────────────────────
const SVATKY_MESICE = [
  "martin", "medard", "kateřin", "hromnic", "březen", "duben", "máj",
];
const POCASI_URODA = ["kouř", "kápě", "kape", "peřin", "kamna", "vlezem", "budem", "stodol", "ráj", "hodinu"];
/** Pohádkový znak: kouzlo / zakletí — bajka ani průpovídka ho nemají. */
const KOUZLO = ["kouzeln", "zaklet", "začarovan", "kouzlo", "splněných přání"];

function klasifikujL1(text: string): "bajka" | "prislovi" | "pranostika" | "pohadka" {
  const low = text.toLowerCase();
  if (KOUZLO.some((m) => low.includes(m))) return "pohadka";
  const maSvatek = SVATKY_MESICE.some((m) => low.includes(m));
  const maPocasi = POCASI_URODA.some((m) => low.includes(m));
  if (maSvatek && maPocasi) return "pranostika";
  const veteCount = (text.match(/[.!?]/g) ?? []).length;
  if (veteCount >= 2) return "bajka";
  return "prislovi";
}

const LABEL_TO_UTVAR: Record<string, "bajka" | "prislovi" | "pranostika" | "pohadka"> = {
  bajka: "bajka",
  přísloví: "prislovi",
  pranostika: "pranostika",
  pohádka: "pohadka",
};

// ── (2) Nezávisle přepsané tabulky pro L2/L3 ────────────────────────────────
const PRISLOVI_VYZNAM: { text: string; vyznam: string }[] = [
  { text: "Kdo jinému jámu kopá, sám do ní padá.", vyznam: "Kdo chce druhému člověku úmyslně ublížit, nakonec často uškodí sám sobě." },
  { text: "Bez práce nejsou koláče.", vyznam: "Kdo chce něčeho dosáhnout, musí se nejdřív snažit a pracovat." },
  { text: "Lepší vrabec v hrsti než holub na střeše.", vyznam: "Je lepší mít jistou menší věc, než riskovat kvůli nejisté větší věci." },
  { text: "Tichá voda břehy mele.", vyznam: "Kdo navenek působí klidně a tiše, může být uvnitř silný nebo mít velký vliv, i když to není na první pohled vidět." },
  { text: "Jablko nepadá daleko od stromu.", vyznam: "Děti se povahou často podobají svým rodičům." },
  { text: "Dvakrát měř, jednou řež.", vyznam: "Než se do něčeho pustíš, dobře si to rozmysli a ověř — udělanou chybu už pak nevrátíš." },
  { text: "Ranní ptáče dál doskáče.", vyznam: "Kdo začíná včas a nezaspává, má v životě výhodu a bývá úspěšnější." },
  { text: "Bez peněz do hospody nelez.", vyznam: "Do něčeho se nepouštěj, pokud na to nemáš potřebné prostředky." },
  { text: "Co můžeš udělat dnes, neodkládej na zítřek.", vyznam: "Povinnosti dělej včas, neodkládej je na později." },
  { text: "Kdo šetří, má za tři.", vyznam: "Kdo si dnes umí něco ušetřit, bude z toho mít v budoucnu prospěch." },
  { text: "Kdo chce psa bít, hůl si vždycky najde.", vyznam: "Kdo chce někomu ublížit nebo ho obvinit, najde si na to důvod, i kdyby žádný opravdový nebyl." },
  { text: "Neštěstí nechodí nikdy samo.", vyznam: "Když se stane jedna nepříjemná věc, často po ní následují další." },
  { text: "Co oči nevidí, to srdce nebolí.", vyznam: "Co o něčem nevíme, to nás netrápí." },
  { text: "Kdo dřív přijde, ten dřív mele.", vyznam: "Kdo je někde první, má oproti ostatním výhodu." },
];

/** Nezávisle přepsané: ke kterému období se pranostika váže (klíčové slovo). */
const PRANOSTIKA_OBDOBI: { text: string; klic: string }[] = [
  { text: "Na svatého Martina kouřívá se z komína.", klic: "Martin" },
  { text: "Medardova kápě čtyřicet dní kape.", klic: "Medard" },
  { text: "Na svatou Kateřinu schováme se pod peřinu.", klic: "Kateřin" },
  { text: "Březen, za kamna vlezem.", klic: "březn" },
  { text: "Duben, ještě tam budem.", klic: "dubn" },
  { text: "Na Hromnice o hodinu více.", klic: "Hromnic" },
  { text: "Studený máj, v stodole ráj.", klic: "květn" },
];

const L3A_TABULKA: { text: string; prisloviIdx: number }[] = [
  { text: "Tomáš se na velký test z matematiky vůbec neučil", prisloviIdx: 1 },
  { text: "Eliška vstává každý den o půl hodiny dřív", prisloviIdx: 6 },
  { text: "Matka Anety je vášnivá malířka", prisloviIdx: 4 },
  { text: "Filip měl jistou nabídku na drobnou brigádu", prisloviIdx: 2 },
  { text: "Martin schválně pustil o spolužačce ošklivou pomluvu", prisloviIdx: 0 },
  { text: "Karolína si každý měsíc odkládala část kapesného", prisloviIdx: 9 },
  { text: "David nechával psaní referátu pořád na později", prisloviIdx: 8 },
  { text: "Ondra ve třídě skoro nikdy nemluví", prisloviIdx: 3 },
  { text: "Učitelka chtěla Kubovi za každou cenu najít chybu", prisloviIdx: 10 },
  { text: "Na oblíbený tábor se hlásilo víc dětí", prisloviIdx: 13 },
  { text: "Klára měla odevzdat projekt učitelce", prisloviIdx: 5 },
  { text: "Rodiče Lucce schválně neřekli o zrušeném výletu", prisloviIdx: 12 },
];

const MORAL_TEXT: Record<string, string> = {
  lichotnik: "Lichotníkům se nemá věřit, protože obvykle sledují vlastní prospěch.",
  priprava: "Kdo se včas nepřipraví a nechá všechno na poslední chvíli, sám sobě nakonec ublíží.",
  vytrvalost: "Vytrvalost a poctivá snaha nakonec porazí i pýchu.",
  sila: "Kdo je silnější a chce ublížit, najde si na to důvod, i kdyby žádný nebyl.",
  chamtivost: "Kdo je chamtivý a chce mít víc, může přijít i o to, co už jistě má.",
  cizi: "Kdo se chlubí cizími úspěchy nebo věcmi, bude nakonec odhalen a vysmán.",
  vymluva: "Kdo něčeho nedosáhne, často začne tvrdit, že o to vlastně ani nestál.",
};

const L2A_MORAL_KEYWORD: { keyword: string; moral: string }[] = [
  { keyword: "sýr", moral: "lichotnik" },
  { keyword: "hrozny", moral: "vymluva" },
  { keyword: "veverka", moral: "priprava" },
  { keyword: "myš", moral: "priprava" },
  { keyword: "ježek", moral: "vytrvalost" },
  { keyword: "srnka", moral: "vytrvalost" },
  { keyword: "medvěd", moral: "sila" },
  { keyword: "lávku", moral: "chamtivost" },
  { keyword: "kavka", moral: "cizi" },
  { keyword: "straka", moral: "cizi" },
];

const L3B_MORAL: { keyword: string; moral: string }[] = [
  { keyword: "Bára", moral: "chamtivost" },
  { keyword: "Honza", moral: "priprava" },
  { keyword: "Adamovi", moral: "lichotnik" },
  { keyword: "Nikola", moral: "vytrvalost" },
  { keyword: "mladšímu spolužákovi", moral: "sila" },
  { keyword: "Filip skoro nic", moral: "cizi" },
  { keyword: "Radek", moral: "chamtivost" },
  { keyword: "Tereza", moral: "priprava" },
];

const ZVIRE_LABEL: Record<string, string> = {
  liska: "liška (lstivost)",
  mravenec: "mravenec (pracovitost)",
  vlk: "vlk (síla a bezohlednost)",
  osel: "osel (tvrdohlavost)",
};

const L3D_ZVIRE: { keyword: string; zvire: string }[] = [
  { keyword: "Zuzana", zvire: "liska" },
  { keyword: "Tomáš pilně", zvire: "mravenec" },
  { keyword: "Radim", zvire: "vlk" },
  { keyword: "Filip se nechce", zvire: "osel" },
  { keyword: "Klára", zvire: "liska" },
  { keyword: "Matěj", zvire: "osel" },
  { keyword: "Eliška si každý večer", zvire: "mravenec" },
  { keyword: "Starší spolužák", zvire: "vlk" },
];

/** (3) Slova délky ≥4 znaky bez háčků/čárek, mimo běžné funkční tvary. */
const STOPWORDS = new Set([
  "kdyz", "nebo", "jako", "jeho", "jeji", "ktery", "ktera", "ktere", "jsou",
  "byla", "bylo", "byly", "nebyl", "nebyla", "bude", "budou", "moc", "moje",
]);
function normalizuj(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[„“.,!?()]/g, " ");
}
function obsahovaSlova(s: string): Set<string> {
  return new Set(
    normalizuj(s)
      .split(/\s+/)
      .filter((w) => w.length >= 4 && !STOPWORDS.has(w)),
  );
}

interface SolveResult {
  kind: string;
}

function solve(t: PracticeTask): SolveResult | null {
  const q = t.question;
  let m: RegExpMatchArray | null;

  // L1 — rozpoznání útvaru
  if ((m = q.match(/^(?:O jaký literární útvar jde\?|Ke kterému útvaru ukázka patří\?|Urči útvar ukázky:) „(.+)“$/))) {
    const text = m[1];
    const expected = klasifikujL1(text);
    expect(LABEL_TO_UTVAR[t.correctAnswer], `L1 klíč pro „${text}“: ${t.correctAnswer}`).toBe(expected);
    return { kind: "L1" };
  }

  // L2(a) — bajka → ponaučení
  if ((m = q.match(/^Přečti si bajku: „(.+)“ Jaké ponaučení z ní plyne\?$/))) {
    const text = m[1].toLowerCase();
    const found = L2A_MORAL_KEYWORD.find((k) => text.includes(k.keyword));
    expect(found, `L2a: neznámá ukázka: ${text}`).toBeTruthy();
    expect(t.correctAnswer, `L2a klíč`).toBe(MORAL_TEXT[found!.moral]);
    return { kind: "L2a" };
  }

  // L2(b) — přísloví → význam
  if ((m = q.match(/^Co znamená přísloví „(.+)“\?$/))) {
    const text = m[1];
    const found = PRISLOVI_VYZNAM.find((p) => p.text === text);
    expect(found, `L2b: neznámé přísloví: ${text}`).toBeTruthy();
    expect(t.correctAnswer).toBe(found!.vyznam);
    return { kind: "L2b" };
  }

  // L2(c) — pranostika → co předpovídá
  if ((m = q.match(/^Co pranostika „(.+)“ předpovídá nebo k čemu se váže\?$/))) {
    const text = m[1];
    const found = PRANOSTIKA_OBDOBI.find((p) => p.text === text);
    expect(found, `L2c: neznámá pranostika: ${text}`).toBeTruthy();
    expect(t.correctAnswer.includes(found!.klic), `L2c klíč se váže k jinému období: ${t.correctAnswer}`).toBe(true);
    // klíč nesmí sedět na víc obdobích zároveň
    const jina = PRANOSTIKA_OBDOBI.filter((p) => p.klic !== found!.klic && t.correctAnswer.includes(p.klic));
    expect(jina.map((p) => p.klic), `L2c klíč mluví i o jiném období: ${t.correctAnswer}`).toEqual([]);
    return { kind: "L2c" };
  }

  // L3(a) — situace → přísloví
  if (q.includes("Které přísloví se k této situaci nejlépe hodí?")) {
    const row = L3A_TABULKA.find((r) => q.includes(r.text));
    expect(row, `L3a: neznámá situace: ${q}`).toBeTruthy();
    const expected = PRISLOVI_VYZNAM[row!.prisloviIdx];
    expect(t.correctAnswer, `L3a klíč`).toBe(expected.text);
    // (3) situace a klíčové přísloví nesmí sdílet obsahové slovo
    const situaceSlova = obsahovaSlova(q.replace("Které přísloví se k této situaci nejlépe hodí?", ""));
    const prisloviSlova = obsahovaSlova(expected.text);
    const prunik = [...prisloviSlova].filter((w) => situaceSlova.has(w));
    expect(prunik, `L3a: situace a přísloví sdílí slovo: ${prunik.join(", ")} (${q})`).toEqual([]);
    return { kind: "L3a" };
  }

  // L3(b) — situace → ponaučení z bajky
  if (q.includes("Které ponaučení z bajky se na tuto situaci nejlépe hodí?")) {
    const row = L3B_MORAL.find((r) => q.includes(r.keyword));
    expect(row, `L3b: neznámá situace: ${q}`).toBeTruthy();
    expect(t.correctAnswer).toBe(MORAL_TEXT[row!.moral]);
    return { kind: "L3b" };
  }

  // L3(d) — zvířecí postava → vlastnost
  if (q.includes("Kterou bajkovou zvířecí postavu by tento člověk nejlépe představoval?")) {
    const row = L3D_ZVIRE.find((r) => q.includes(r.keyword));
    expect(row, `L3d: neznámá situace: ${q}`).toBeTruthy();
    expect(t.correctAnswer).toBe(ZVIRE_LABEL[row!.zvire]);
    return { kind: "L3d" };
  }

  // L3(c) — pravdivé tvrzení o pranostice (fallback: musí být mezi otázkami generátoru L3)
  const L3_QUESTIONS = new Set(topic.generator(3).map((x) => x.question));
  if (L3_QUESTIONS.has(q)) {
    return { kind: "L3c-or-other" };
  }

  return null;
}

describe("Bajka, přísloví a pranostika — metadata", () => {
  it("čeština g6, select_one, Literární výchova / Lidová slovesnost", () => {
    expect(topic.subject).toBe("čeština");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.id).toBe("g6-cjl-bajka-prislovi-pranostika-6");
    expect(topic.category).toBe("Literární výchova");
    expect(topic.topic).toBe("Lidová slovesnost");
    expect(topic.rvpNodeId).toBe(
      "g6-cjl-literarni-vychova-lidova-slovesnost-bajka-prislovi-pranostika",
    );
  });
});

describe.each([1, 2, 3])("Bajka, přísloví, pranostika — úlohy level %i", (level) => {
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

  it("nápověda: 2 unikátní, neprozrazují correctAnswer", () => {
    for (const t of tasks) {
      expect(t.hints?.length, t.question).toBeGreaterThanOrEqual(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      for (const h of t.hints ?? []) {
        expect(h, `hint leak (correctAnswer): ${t.question}`).not.toContain(t.correctAnswer);
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

  it("správná odpověď se nevyskytuje doslovně ve znění otázky", () => {
    for (const t of tasks) {
      expect(t.question.includes(t.correctAnswer), `klíč „${t.correctAnswer}“ je ve znění otázky: ${t.question}`).toBe(false);
    }
  });

  it("NEZÁVISLÝ SOLVER: klíč souhlasí s klasifikátorem / tabulkou", () => {
    for (const t of tasks) {
      const s = solve(t);
      expect(s, `solver nerozpoznal úlohu: ${t.question}`).not.toBeNull();
    }
  });
});

describe("Bajka, přísloví, pranostika — gradace a rozsah podle úrovně", () => {
  it("L1 a L3 otázky jsou textově disjunktní", () => {
    const l1 = new Set(topic.generator(1).map((t) => t.question));
    const l3 = topic.generator(3).map((t) => t.question);
    for (const q of l3) expect(l1.has(q), `L3 otázka se opakuje v L1: ${q}`).toBe(false);
  });

  it("L1: možnosti jsou vždy stejné čtyři útvary", () => {
    for (const t of topic.generator(1)) {
      expect(new Set(t.options)).toEqual(new Set(["bajka", "přísloví", "pranostika", "pohádka"]));
    }
  });

  it("L1: znění zadání se střídá (ne jedna věta pořád dokola)", () => {
    const tvary = new Set(topic.generator(1).map((t) => t.question.replace(/ „.+“$/, "")));
    expect(tvary.size, "L1 má jen jedno znění otázky").toBeGreaterThanOrEqual(3);
  });

  it("L1: pohádka je někdy správná odpověď, ne jen věčný distraktor", () => {
    const klice = new Set(topic.generator(1).map((t) => t.correctAnswer));
    expect(klice, "pohádka je v možnostech, ale nikdy není klíčem").toContain("pohádka");
  });

  it("gramatika: žádná rozbitá pádová vazba po předložce „k“ ani „ve přísloví“", () => {
    const ZAKAZANE = [/\bk svat[éý]/i, /\bk měsíce\b/i, /\bke svátku Hromnice\b/, /\bve přísloví\b/i];
    for (const level of [1, 2, 3]) {
      for (const t of topic.generator(level)) {
        const texty = [t.question, t.explanation ?? "", ...(t.hints ?? []), ...Object.values(t.optionFeedback ?? {}), ...(t.options ?? [])];
        for (const s of texty) {
          for (const re of ZAKAZANE) {
            expect(re.test(s), `agramatická vazba (${re}) v: ${s}`).toBe(false);
          }
        }
      }
    }
  });

  it("L2: obsahuje všechny tři šablony (bajka, přísloví, pranostika)", () => {
    const l2 = topic.generator(2);
    expect(l2.some((t) => t.question.startsWith("Přečti si bajku:"))).toBe(true);
    expect(l2.some((t) => t.question.startsWith("Co znamená přísloví"))).toBe(true);
    expect(l2.some((t) => t.question.startsWith("Co pranostika"))).toBe(true);
  });

  it("L3: obsahuje všechny čtyři šablony (přísloví, ponaučení, pranostika, zvíře)", () => {
    const l3 = topic.generator(3);
    expect(l3.some((t) => t.question.includes("Které přísloví se k této situaci nejlépe hodí?"))).toBe(true);
    expect(l3.some((t) => t.question.includes("Které ponaučení z bajky se na tuto situaci nejlépe hodí?"))).toBe(true);
    expect(l3.some((t) => t.question.includes("pranostik"))).toBe(true);
    expect(l3.some((t) => t.question.includes("bajkovou zvířecí postavu"))).toBe(true);
  });

  it("gen() je deterministický co do tvaru (žádná výjimka, vždy ≥12 úloh) při opakovaném volání", () => {
    for (const level of [1, 2, 3]) {
      const a = topic.generator(level);
      const b = topic.generator(level);
      expect(a.length).toBeGreaterThanOrEqual(12);
      expect(b.length).toBeGreaterThanOrEqual(12);
    }
  });
});
