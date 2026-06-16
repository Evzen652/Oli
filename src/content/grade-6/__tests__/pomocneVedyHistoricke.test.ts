import { describe, it, expect } from "vitest";
import { POMOCNE_VEDY_HISTORICKE } from "../dejepis/pomocneVedyHistoricke";

/**
 * Pomocné vědy historické — FAKTICKÝ vzor typu categorize (přiřazení nálezu k vědě).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta) = klíčový klasifikátor podle spec.solverCheck:
 * pro každou položku odvodí očekávanou vědu z klíčového slova v názvu (PŘEDMĚT
 * zkoumání, ne materiál) a porovná s deklarovanou kategorií.
 *
 * Pravidla mapování (s PRECEDENCÍ — předmět zařazení vítězí nad vzhledem):
 *   'mince'/'platidlo'/'bankovka'                         → Numismatika
 *   'erb'/'znak' (na štítu, praporu, bráně)               → Heraldika
 *   'rukopis'/'písmo'/'listina/kronika/pergamen …ke čtení/k rozluštění'/'opis'/'papyrus' → Paleografie
 *   'vykopáv'/'nález v zemi'/'kostra'/'základy stavby'/'střep'/'hrob' → Archeologie
 *
 * Pozn. k hranicím oborů: pečeti/pečetidla (sfragistika) ani nápisy na tvrdém
 * materiálu / klínopis (epigrafika) téma NEzavádí, proto mezi položkami nejsou;
 * heraldické položky jsou čistí nositelé znaku, paleografické jen rukopisné
 * prameny na měkkém materiálu. Detektory pečeť/pečetidlo v HER zůstávají jen pro
 * robustnost (žádná položka je teď nepoužívá).
 *
 * Klíč klamavých případů L3: mince s portrétem/znakem = MINCE → Numismatika
 * (numismatika má v precedenci přednost — je to platidlo; znak/portrét je jen
 * jeho výzdoba, ne studovaný předmět). Solver MUSÍ potvrdit, že každá položka
 * padne PŘESNĚ do jedné vědy podle předmětu zařazení a že deklarovaná kategorie
 * souhlasí.
 */
const topic = POMOCNE_VEDY_HISTORICKE[0];

const A = "Archeologie";
const P = "Paleografie";
const N = "Numismatika";
const H = "Heraldika";
const ALL = [A, H, P, N].sort();

// Detektory předmětu zkoumání (každý = jedno klíčové slovo dle spec).
const NUM = /mince|platidlo|bankovk/i;                                  // numismatika
const HER = /erb|znak|pečetidl|pečeť|pečet/i;                            // heraldika
const PAL = /rukopis|písm|papyrus|k rozluštění|ke čtení|kroniku?\b.*čt|opis/i; // paleografie
const ARCH = /vykop[aá]|nález v zemi|kostr|základ|střep|hrob|pohřeb/i; // archeologie (vč. tvarů: vykopaná/vykopávky, základy/základů)

/**
 * Vrátí vědu, které nález podle PŘEDMĚTU ZAŘAZENÍ patří.
 * Precedence řeší klamavé položky: 'mince se znakem' → numismatika (je to mince,
 * zařazovaným předmětem je platidlo, znak je jen výzdoba); 'stará listina ke
 * čtení' → paleografie (úkol je číst písmo), ne archeologie. Pořadí precedence:
 * Numismatika (mince/platidlo bije znak) > Paleografie (čtení písma bije materiál)
 * > Heraldika (znak/erb na nositeli) > Archeologie (vykopaný předmět).
 */
function expectedScience(item: string): string {
  if (NUM.test(item)) return N;
  if (PAL.test(item)) return P;
  if (HER.test(item)) return H;
  if (ARCH.test(item)) return A;
  return "?"; // žádné klíčové slovo → nezařaditelné (test selže níže)
}

/** Pro kontrolu (a): kolik různých detektorů PŘEDMĚTU se na položce trefí. */
function objectMatches(item: string): string[] {
  const out: string[] = [];
  if (NUM.test(item)) out.push(N);
  // znak/erb se počítá jako heraldika jen tehdy, NENÍ-li to mince (mince se znakem
  // je předmětem numismatiky — znak je jen vyobrazení na platidle)
  if (HER.test(item) && !NUM.test(item)) out.push(H);
  if (PAL.test(item)) out.push(P);
  if (ARCH.test(item)) out.push(A);
  return out;
}

describe("Pomocné vědy historické — metadata", () => {
  it("dějepis g6, categorize, Úvod do dějepisu / Pomocné vědy historické", () => {
    expect(topic.subject).toBe("dejepis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("categorize");
    expect(topic.contentType).toBe("factual");
    expect(topic.id).toBe("g6-dej-pomocne-vedy-historicke-6");
    expect(topic.category).toBe("Úvod do dějepisu");
    expect(topic.topic).toBe("Pomocné vědy historické");
    expect(topic.rvpNodeId).toBe(
      "g6-dejepis-uvod-do-dejepisu-pomocne-vedy-historicke-archeologie-paleografie-numismatika-heraldika",
    );
    // briefDescription max 14 slov
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("Pomocné vědy historické — level %i", (level) => {
  const tasks = topic.generator(level);

  it("categorize struktura: čtyři vědy, marker, vysvětlení, nápověda", () => {
    expect(tasks.length).toBeGreaterThanOrEqual(3);
    for (const t of tasks) {
      expect(t.correctAnswer).toBe("categorize");
      expect(t.categories, t.question).toBeDefined();
      expect(t.categories!.map((c) => c.name).sort()).toEqual(ALL);
      expect(t.explanation, t.question).toBeTruthy();
      expect((t.hints ?? []).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("SOLVER (a): každý nález padne PŘESNĚ do jedné vědy podle předmětu zkoumání", () => {
    for (const t of tasks) {
      for (const c of t.categories!) {
        for (const item of c.items) {
          const matches = objectMatches(item);
          expect(
            matches.length,
            `položka "${item}" se trefuje do věd: [${matches.join(", ")}] (musí být právě 1)`,
          ).toBe(1);
        }
      }
    }
  });

  it("SOLVER (b): deklarovaná věda souhlasí s vědou odvozenou z klíčového slova", () => {
    for (const t of tasks) {
      for (const c of t.categories!) {
        for (const item of c.items) {
          const exp = expectedScience(item);
          expect(exp, `"${item}" nemá rozpoznatelné klíčové slovo`).not.toBe("?");
          expect(
            exp,
            `"${item}" je deklarováno v "${c.name}", ale podle předmětu zkoumání patří do "${exp}"`,
          ).toBe(c.name);
        }
      }
    }
  });

  it("nápověda učí metodu, neprozrazuje konkrétní zařazení", () => {
    for (const t of tasks) {
      for (const h of t.hints ?? []) {
        // nápověda nesmí doslova mapovat položku na vědu ve tvaru „… → Numismatika"
        expect(/→\s*(Archeologie|Paleografie|Numismatika|Heraldika)/i.test(h)).toBe(false);
      }
    }
  });
});

describe("Pomocné vědy historické — gradace L1 ≠ L3", () => {
  it("SOLVER (c): L1 má právě 4 vědy, každou s právě 1 položkou, žádná prázdná", () => {
    for (const t of topic.generator(1)) {
      expect(t.categories!.length).toBe(4);
      for (const c of t.categories!) {
        expect(c.items.length, `L1 skupina "${c.name}" má mít právě 1 položku`).toBe(1);
      }
    }
  });

  it("SOLVER (d): znění zadání L1 a L3 je disjunktní", () => {
    const q1 = new Set(topic.generator(1).map((t) => t.question));
    const q3 = new Set(topic.generator(3).map((t) => t.question));
    const shared = [...q3].filter((q) => q1.has(q));
    expect(shared, `společné otázky L1∩L3: ${shared}`).toHaveLength(0);
  });

  it("SOLVER (b/L3): klamavé položky L3 jsou zařazeny dle objektu, ne dle vzhledu", () => {
    const l3 = topic.generator(3);
    // L3 musí obsahovat aspoň jednu minci s portrétem/znakem (láká na heraldiku → numismatika)
    const allItems = l3.flatMap((t) => t.categories!.flatMap((c) => c.items));
    const klamavaMince = allItems.find((i) => /mince s portrétem|mince se znakem|mince s portrétem císaře/i.test(i));
    expect(klamavaMince, "L3 nemá klamavou minci (portrét/znak)").toBeTruthy();
    expect(expectedScience(klamavaMince!)).toBe(N);
    // a aspoň jeden rukopisný pramen k rozluštění/ke čtení (papyrus/listina/pergamen),
    // který vzhledově svádí na archeologii (vykopaný kus), ale úkolem je číst písmo → paleografie
    const klamavaCetba = allItems.find((i) => /(papyrus|listin|pergamen|rukopis).*(k rozluštění|ke čtení)/i.test(i));
    expect(klamavaCetba, "L3 nemá klamavý rukopisný pramen ke čtení").toBeTruthy();
    expect(expectedScience(klamavaCetba!)).toBe(P);
    // každá položka L3 je správně zařazena dle objektu
    for (const t of l3) {
      for (const c of t.categories!) {
        for (const item of c.items) {
          expect(expectedScience(item), `L3 "${item}" → ${c.name}`).toBe(c.name);
        }
      }
    }
  });
});
