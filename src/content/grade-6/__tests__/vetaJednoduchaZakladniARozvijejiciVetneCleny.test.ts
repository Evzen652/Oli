import { describe, it, expect } from "vitest";
import { VETA_JEDNODUCHA_ZAKLADNI_A_ROZVIJEJICI_VETNE_CLENY } from "../cjl/vetaJednoduchaZakladniARozvijejiciVetneCleny";
import type { PracticeTask } from "@/lib/types";
import { klicUlohy } from "@/lib/taskIdentity";

/**
 * Věta jednoduchá — základní a rozvíjející větné členy (6. ročník, select_one).
 *
 * Nezávislý solver: ručně psaná SOLVER_TABLE {věta → správný větný člen},
 * napsaná odděleně od banky v generátoru podle vlastního gramatického
 * rozboru každé věty (ne převzetím correctAnswer z generátoru). Z textu
 * otázky se vyparsuje věta a VELKÝMI písmeny vyznačené sousloví, ověří se,
 * že sousloví je ve větě doslova a je vyznačené právě jedno, a klíč
 * generátoru se porovná s tabulkou.
 */
const topic = VETA_JEDNODUCHA_ZAKLADNI_A_ROZVIJEJICI_VETNE_CLENY[0];

// ── Uzavřený seznam přípustných názvů větných členů ─────────────────────────
const CLENY = new Set([
  "podmět",
  "přísudek",
  "přísudek slovesný",
  "přísudek jmenný se sponou",
  "předmět",
  "příslovečné určení místa",
  "příslovečné určení času",
  "příslovečné určení způsobu",
  "příslovečné určení příčiny",
  "přívlastek",
  "přívlastek shodný",
  "přívlastek neshodný",
  "doplněk",
]);

// ── Nezávislá tabulka: věta (přesně jak ji generátor sestaví) → člen ────────
// Napsáno samostatným gramatickým rozborem každé věty, ne opsáním z generátoru.
const SOLVER_TABLE: Record<string, string> = {
  // L1
  "Tomáš kopl MÍČ.": "předmět",
  "Eliška ČTE knihu.": "přísudek",
  "KUBA staví hrad.": "podmět",
  "Adéla KRESLÍ obrázek.": "přísudek",
  "Ondra píše DOPIS.": "předmět",
  "BÁRA opravuje kolo.": "podmět",
  "Petr SBÍRÁ jahody.": "přísudek",
  "Jana nese TAŠKU.": "předmět",
  "MAREK zalévá květiny.": "podmět",
  "Karolína STAVÍ stan.": "přísudek",
  "Filip krmí PSA.": "předmět",
  "SIMONA maluje plot.": "podmět",
  "Ondra ZAMETÁ dvůr.": "přísudek",
  "Bára loví RYBY.": "předmět",
  "TOMÁŠ vaří polévku.": "podmět",
  "Adéla HLÍDÁ bratra.": "přísudek",
  // L2 — předmět v jiných pádech
  "Pomohl KAMARÁDOVI.": "předmět",
  "Bojí se PAVOUKŮ.": "předmět",
  "Mluvil S UČITELEM.": "předmět",
  "Přemýšlel O VÝLETU.": "předmět",
  // L2 — příslovečné určení
  "Potkal ho NA STARÉM MOSTĚ.": "příslovečné určení místa",
  "Schovali se POD STOLEM.": "příslovečné určení místa",
  "Čekali PŘED ŠKOLOU.": "příslovečné určení místa",
  "Přišel RÁNO.": "příslovečné určení času",
  "Vrátili se POZDĚ VEČER.": "příslovečné určení času",
  "Sraz je ZÍTRA RÁNO.": "příslovečné určení času",
  "Mluvila TICHÝM HLASEM.": "příslovečné určení způsobu",
  "Běžel RYCHLE.": "příslovečné určení způsobu",
  "Odpověděl BEZ VÁHÁNÍ.": "příslovečné určení způsobu",
  "Zůstali doma KVŮLI DEŠTI.": "příslovečné určení příčiny",
  "Škola byla zavřená KVŮLI CHŘIPCE.": "příslovečné určení příčiny",
  "Nešel ven KVŮLI NACHLAZENÍ.": "příslovečné určení příčiny",
  // L2 — přívlastek shodný × neshodný
  "Přinesla MODRÝ batoh.": "přívlastek shodný",
  "Koupil STARÝ dům.": "přívlastek shodný",
  "Batoh S NÁŠIVKOU visel na věšáku.": "přívlastek neshodný",
  "Přečetla knihu MÉ SESTRY.": "přívlastek neshodný",
  // L3 (a) — předmět × podmět, pořadí slov nerozhoduje (vyznačen jen podmět/předmět)
  "MÍČ kopl Tomáš.": "předmět",
  "Míč kopl TOMÁŠ.": "podmět",
  "DORT upekla babička.": "předmět",
  "Dort upekla BABIČKA.": "podmět",
  "ZPRÁVU napsal Kuba.": "předmět",
  "Zprávu napsal KUBA.": "podmět",
  "PSA venčil Ondra.": "předmět",
  "Psa venčil ONDRA.": "podmět",
  "KOLO opravil táta.": "předmět",
  "Kolo opravil TÁTA.": "podmět",
  "OBRÁZEK nakreslila Adéla.": "předmět",
  "Obrázek nakreslila ADÉLA.": "podmět",
  // L3 (b) — přísudek jmenný se sponou
  "Petr JE LÉKAŘ.": "přísudek jmenný se sponou",
  "Babička BYLA NEMOCNÁ.": "přísudek jmenný se sponou",
  "Adéla JE UČITELKA.": "přísudek jmenný se sponou",
  "Tomáš SE STAL KAPITÁNEM.": "přísudek jmenný se sponou",
  "Výlet BUDE ZÁBAVNÝ.": "přísudek jmenný se sponou",
  "Voda BYLA STUDENÁ.": "přísudek jmenný se sponou",
  "Jana SE STALA VÍTĚZKOU.": "přísudek jmenný se sponou",
  // L3 (c) — doplněk × přívlastek shodný
  "Vrátil se z výletu UNAVENÝ.": "doplněk",
  "Zvolili ho PŘEDSEDOU třídy.": "doplněk",
  "Viděla ho UTÍKAT.": "doplněk",
  "UNAVENÝ turista se vrátil domů.": "přívlastek shodný",
  // L3 (d) — předmět × příslovečné určení místa (stejná předložka)
  "Mluvil O ŠKOLE.": "předmět",
  "Přemýšlel O ZÁPASE.": "předmět",
  "Spoléhal NA KAMARÁDA.": "předmět",
  "Zeptal se NA CESTU.": "předmět",
  "Sedl si NA LAVIČKU.": "příslovečné určení místa",
  "Vylezl NA STROM.": "příslovečné určení místa",
  "Hráli si NA HŘIŠTI.": "příslovečné určení místa",
};

/** Slovo je "celé velké" (vyznačené), pokud jeho písmena = jejich velká podoba a liší se od malé. */
function jeVelke(tok: string): boolean {
  const pismena = tok.replace(/[^\p{L}]/gu, "");
  return pismena.length > 0 && pismena === pismena.toUpperCase() && pismena !== pismena.toLowerCase();
}

/** Vyparsuje jediné souvislé vyznačené sousloví z věty (bez koncové interpunkce). Null = 0 nebo víc úseků. */
function vyparsujOznacene(veta: string): string | null {
  const tokens = veta.split(/\s+/);
  const flags = tokens.map(jeVelke);
  const indices = flags.map((f, i) => (f ? i : -1)).filter((i) => i >= 0);
  if (indices.length === 0) return null;
  const start = indices[0];
  const end = indices[indices.length - 1];
  for (let i = start; i <= end; i++) if (!flags[i]) return null; // nesouvislý úsek = víc vyznačených částí
  return tokens
    .slice(start, end + 1)
    .join(" ")
    .replace(/[.,!?]+$/, "");
}

interface Rozbor {
  veta: string;
  oznacene: string;
}

function rozeberOtazku(question: string): Rozbor | null {
  const m = question.match(/^„(.+)“ Jakým větným členem je vyznačen(é slovo|ý výraz)\?$/);
  if (!m) return null;
  const veta = m[1];
  const oznacene = vyparsujOznacene(veta);
  if (!oznacene) return null;
  // víceslovné vyznačení = „výraz“, jednoslovné = „slovo“
  if ((m[2] === "ý výraz") !== oznacene.includes(" ")) return null;
  // sousloví je ve větě doslova (case-insensitive)
  if (!veta.toLowerCase().includes(oznacene.toLowerCase())) return null;
  return { veta, oznacene };
}

describe("Věta jednoduchá — větné členy — metadata", () => {
  it("čeština g6, select_one, Jazyková výchova / Skladba", () => {
    expect(topic.subject).toBe("čeština");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.id).toBe("g6-cjl-veta-jednoducha-vetne-cleny-6");
    expect(topic.rvpNodeId).toBe(
      "g6-cjl-jazykova-vychova-skladba-veta-jednoducha-zakladni-a-rozvijejici-vetne-cleny",
    );
    expect(topic.category).toBe("Jazyková výchova");
    expect(topic.topic).toBe("Skladba");
  });
});

describe.each([1, 2, 3])("Věta jednoduchá — větné členy — úlohy level %i", (level) => {
  const tasks = topic.generator(level);

  it("≥12 unikátních úloh", () => {
    expect(tasks.length).toBeGreaterThanOrEqual(12);
    expect(new Set(tasks.map(klicUlohy)).size).toBe(tasks.length);
  });

  it("select_one struktura: přesně 4 možnosti, klíč mezi nimi, žádné duplicity", () => {
    for (const t of tasks) {
      expect(t.options!.length, t.question).toBe(4);
      expect(new Set(t.options).size, `duplicitní options: ${t.question}`).toBe(4);
      expect(t.options, `correctAnswer mimo options: ${t.question}`).toContain(t.correctAnswer);
    }
  });

  it("možnosti jsou vždy z uzavřeného seznamu názvů větných členů", () => {
    for (const t of tasks) {
      for (const opt of t.options!) {
        expect(CLENY.has(opt), `neznámý větný člen „${opt}“: ${t.question}`).toBe(true);
      }
    }
  });

  it("chybový model: každý distraktor má feedback, správná odpověď ne", () => {
    for (const t of tasks) {
      for (const opt of t.options!) {
        if (opt === t.correctAnswer) {
          expect(t.optionFeedback?.[opt], `klíč nemá mít feedback: ${t.question}`).toBeUndefined();
        } else {
          expect(t.optionFeedback?.[opt], `chybí feedback pro „${opt}“: ${t.question}`).toBeTruthy();
        }
      }
    }
  });

  it("klíč se nevyskytuje ve znění otázky mimo vyznačené sousloví ve větě", () => {
    for (const t of tasks) {
      const r = rozeberOtazku(t.question);
      expect(r, `otázka nejde rozparsovat: ${t.question}`).not.toBeNull();
      // otázka jako celek (bez samotné vyznačené věty) klíč obsahovat nesmí
      const zbytek = t.question.replace(r!.veta, "");
      expect(zbytek.includes(t.correctAnswer), `giveaway mimo větu: ${t.question}`).toBe(false);
    }
  });

  it("dvě různé nápovědy, žádná neprozrazuje klíč (BRÁNA 0)", () => {
    for (const t of tasks) {
      expect(t.hints?.length, t.question).toBe(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      for (const h of t.hints ?? []) {
        if (t.correctAnswer.length < 3) continue;
        expect(h.includes(t.correctAnswer), `hint leak: ${t.question} → „${t.correctAnswer}“`).toBe(false);
      }
    }
  });

  it("každá úloha má vysvětlení", () => {
    for (const t of tasks) {
      expect(t.explanation, t.question).toBeTruthy();
    }
  });

  it("klíč není systematicky nejdelší možnost", () => {
    const jeNejdelsi = tasks.filter((t) => {
      const maxLen = Math.max(...t.options!.map((o) => o.length));
      return t.correctAnswer.length === maxLen;
    }).length;
    expect(jeNejdelsi / tasks.length, "klíč vychází nejdelší příliš často").toBeLessThan(0.7);
  });

  it("NEZÁVISLÝ SOLVER: vyznačené sousloví je ve větě právě jedno a klíč sedí s tabulkou", () => {
    for (const t of tasks) {
      const r = rozeberOtazku(t.question);
      expect(r, `nejde vyparsovat větu/sousloví: ${t.question}`).not.toBeNull();
      const expected = SOLVER_TABLE[r!.veta];
      expect(expected, `věta chybí v SOLVER_TABLE: „${r!.veta}“`).toBeTruthy();
      expect(t.correctAnswer, `věta „${r!.veta}“: klíč generátoru „${t.correctAnswer}“ ≠ solver „${expected}“`).toBe(
        expected,
      );
    }
  });
});

describe("Věta jednoduchá — větné členy — determinismus", () => {
  it("gen(level) nemá stav mezi voláními (dva běhy dají validní, nezávisle ověřitelné sady)", () => {
    for (const level of [1, 2, 3]) {
      const a = topic.generator(level);
      const b = topic.generator(level);
      expect(a.length).toBeGreaterThanOrEqual(12);
      expect(b.length).toBeGreaterThanOrEqual(12);
      for (const t of [...a, ...b]) {
        const r = rozeberOtazku(t.question);
        expect(r).not.toBeNull();
        expect(SOLVER_TABLE[r!.veta]).toBe(t.correctAnswer);
      }
    }
  });
});

describe("Věta jednoduchá — větné členy — gradace L1 ≠ L3", () => {
  it("texty otázek L1 a L3 jsou disjunktní", () => {
    const l1 = new Set(topic.generator(1).map((t: PracticeTask) => t.question));
    const l3 = topic.generator(3).map((t: PracticeTask) => t.question);
    for (const q of l3) {
      expect(l1.has(q), `L1 a L3 sdílí znění: ${q}`).toBe(false);
    }
  });

  it("L3 pokrývá aspoň 3 typy přenosu (předmět na začátku, jmenný přísudek, doplněk, minimální dvojice předmět × PU)", () => {
    const l3 = topic.generator(3).map((t: PracticeTask) => t.question);
    const typA = l3.some((q) => /MÍČ|DORT|ZPRÁVU|PSA|KOLO|OBRÁZEK|TOMÁŠ|BABIČKA|KUBA|ONDRA|TÁTA|ADÉLA/.test(q));
    const typSpona = l3.some((q) => /JE LÉKAŘ|BYLA NEMOCNÁ|JE UČITELKA|SE STAL|BUDE ZÁBAVNÝ|BYLA STUDENÁ/.test(q));
    const typDoplnek = l3.some((q) => /UNAVENÝ|PŘEDSEDOU|UTÍKAT/.test(q));
    const typD = l3.some((q) => /O ŠKOLE|O ZÁPASE|NA KAMARÁDA|NA CESTU|NA LAVIČKU|NA STROM|NA HŘIŠTI/.test(q));
    const pocet = [typA, typSpona, typDoplnek, typD].filter(Boolean).length;
    expect(pocet, `nalezené typy přenosu: A=${typA} spona=${typSpona} doplněk=${typDoplnek} D=${typD}`).toBeGreaterThanOrEqual(3);
  });
});
