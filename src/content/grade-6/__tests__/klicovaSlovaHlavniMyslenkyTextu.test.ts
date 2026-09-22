import { describe, it, expect } from "vitest";
import { KLICOVA_SLOVA_HLAVNI_MYSLENKY_TEXTU } from "../cjl/klicovaSlovaHlavniMyslenkyTextu";
import type { PracticeTask } from "@/lib/types";

/**
 * Klíčová slova, téma a hlavní myšlenka textu — čeština 6. ročník (select_one).
 *
 * Nezávislý solver: tabulky "první věta ukázky → očekávaný klíč" jsou
 * napsané ručně ZNOVU, odděleně od generátoru (ne importované z něj). Pro
 * každou vygenerovanou úlohu test najde ukázku podle první věty (jednoznačný
 * substring v `question`) a podle koncovky otázky ověří, že `correctAnswer`
 * sedí s nezávisle zapsanou hodnotou. U otázky "která věta nepatří" se navíc
 * z očíslovaného textu v `question` nezávisle rozparsuje, která věta na
 * pozici z `correctAnswer` skutečně stojí, a ověří se, že je to ta
 * odbočující (ne jedna z kmenových vět).
 */
const topic = KLICOVA_SLOVA_HLAVNI_MYSLENKY_TEXTU[0];

// ── Nezávislé tabulky (L1) ────────────────────────────────────────────────
interface SolverL1 {
  s1: string;
  klicova: string[];
  tema: string;
}
const SOLVER_L1: SolverL1[] = [
  { s1: "Tomáš chodí každé úterý do kroužku robotiky.", klicova: ["robot", "kroužek", "staví"], tema: "jak Tomáš staví a programuje roboty v kroužku" },
  { s1: "Šestá třída jela na jarní výlet na hrad.", klicova: ["výlet", "hrad", "třída"], tema: "jak třída jela na výlet na hrad" },
  { s1: "Anna si z útulku přivezla domů psa jménem Bady.", klicova: ["pes", "útulek", "procházky"], tema: "jak se Anna stará o psa z útulku" },
  { s1: "Rodina Novákových doma třídí odpad do tří barevných popelnic.", klicova: ["odpad", "třídí", "popelnice"], tema: "jak rodina třídí doma odpad" },
  { s1: "Kristýna si každý večer bere mobil do postele a prohlíží sociální sítě.", klicova: ["mobil", "usíná", "postel"], tema: "jak mobil v posteli ovlivňuje Kristýnin spánek" },
  { s1: "Bobři si na potoce staví hráz z klacků, bahna a kamenů.", klicova: ["bobr", "hráz", "staví"], tema: "jak si bobři stavějí hráz na potoce" },
  { s1: "První jízdní kola neměla pedály — jezdec se od země odrážel nohama.", klicova: ["kolo", "pedály", "řetěz"], tema: "jak se jízdní kolo postupně vylepšovalo" },
  { s1: "Žáci osmé třídy vydávají školní časopis jednou za měsíc.", klicova: ["časopis", "píšou", "škola"], tema: "jak žáci vydávají školní časopis" },
];

// ── Nezávislé tabulky (L2) ────────────────────────────────────────────────
interface SolverL2 {
  s1: string;
  hlavniMyslenka: string;
  nadpisSpravny: string;
}
const SOLVER_L2: SolverL2[] = [
  { s1: "Filip začal chodit na kroužek keramiky, protože ho bavilo tvarování hlíny.", hlavniMyslenka: "Trpělivé zkoušení nakonec pomůže víc než to, jak je někdo od začátku šikovný.", nadpisSpravny: "Jak vytrvalost pomohla zvládnout keramiku" },
  { s1: "Třída se vydala na výlet do jeskyně, kterou většina žáků předem neznala.", hlavniMyslenka: "V náročné chvíli se osvědčí, když si lidé navzájem pomůžou.", nadpisSpravny: "Jak si žáci ve složité situaci pomohli" },
  { s1: "Ema si přivedla domů plachého psa Rexe, který se bál i vlastního stínu.", hlavniMyslenka: "I hodně plachému zvířeti pomůže získat důvěru trpělivá a pravidelná péče.", nadpisSpravny: "Jak trpělivost naučila psa důvěře" },
  { s1: "Škola vyhlásila soutěž, která třída vytřídí za měsíc nejvíc papíru a plastu.", hlavniMyslenka: "Malý zvyk se dá snadno přenést i mimo školu, a tak roste jeho dopad.", nadpisSpravny: "Jak se malý zvyk přenesl i domů" },
  { s1: "Vojta si stěžoval, že v poslední době špatně usíná a ráno je unavený.", hlavniMyslenka: "Když mobil před spaním odložíme, můžeme usínat snáz.", nadpisSpravny: "Jak odložení mobilu pomohlo usínání" },
  { s1: "Na malém potoce se objevila rodina bobrů a začala stavět hráz.", hlavniMyslenka: "Bobří hráz dokáže vytvořit nový domov pro spoustu jiných zvířat.", nadpisSpravny: "Jak bobří hráz vytvořila nový domov pro zvířata" },
  { s1: "První jízdní kola z počátku 19. století neměla pedály ani řetěz.", hlavniMyslenka: "Jízdní kolo se postupně zlepšovalo díky nápadům víc lidí, ne jednoho vynálezce.", nadpisSpravny: "Jak kolo vylepšila řada nápadů, ne jeden vynálezce" },
  { s1: "Šestá A se rozhodla založit vlastní školní časopis.", hlavniMyslenka: "Když si žáci rozdělí práci na projektu, udrží ho živý déle.", nadpisSpravny: "Jak rozdělení práce udrželo časopis živý" },
];

// ── Nezávislé tabulky (L3) ────────────────────────────────────────────────
interface SolverL3 {
  s1: string;
  s2: string;
  s3: string;
  sOdb: string;
  klicA: string;
  klicB: string;
}
const SOLVER_L3: SolverL3[] = [
  { s1: "Mnoho lidí si myslí, že prohlížení mobilu těsně před spaním pomáhá se uklidnit a rychleji usnout.", s2: "Ve skutečnosti světlo z displeje i napínavý obsah mohou usínání naopak oddálit.", s3: "Lidé, kteří mobil hodinu před spaním odloží, podle průzkumů často usínají snáz.", sOdb: "Mobily dnes lidé používají i k placení v obchodě nebo k navigaci na cestách.", klicA: "Mobil těsně před spaním usínání spíš ztěžuje, než aby pomáhal.", klicB: "Odložení mobilu před spaním může pomoct rychlejšímu usínání." },
  { s1: "Mnoho lidí si myslí, že v keramice uspěje jen ten, kdo má od přírody šikovné ruce.", s2: "Ve skutečnosti lektoři pozorují, že žáci, kteří vytrvale zkoušejí znovu, dosáhnou lepších výsledků než ti s přirozeným talentem, kteří to po prvním nepovedeném kusu vzdají.", s3: "Filip měl první misky křivé a popraskané, ale po měsících zkoušení uměl vytočit rovnou mísu na první pokus.", sOdb: "Keramický kroužek se koná ve stejné budově, kde má škola i tělocvičnu a jídelnu.", klicA: "Vytrvalé zkoušení rozhoduje v řemesle víc než vrozený talent.", klicB: "Kdo u řemesla vydrží zkoušet i po neúspěchu, časem se zlepší." },
  { s1: "Mnoho žáků si před výletem myslelo, že v jeskyni hlavně záleží na tom, kdo bude nejrychlejší.", s2: "Ve skutečnosti se v úzké a tmavé chodbě ukázalo, že bez vzájemné pomoci se dál nikdo nedostane.", s3: "Když jeden žák uvízl v úzkém průlezu, ostatní mu posvítili baterkou a společně ho vytáhli ven.", sOdb: "Jeskyně, kterou třída navštívila, je veřejnosti otevřená jen o víkendech.", klicA: "Ve složité situaci se vyplatí spolupracovat, ne jen hledět na sebe.", klicB: "Spolupráce pomohla žákovi dostat se z úzkého průlezu ven." },
  { s1: "Mnoho lidí čeká, že pes z útulku si na nový domov zvykne během pár dnů.", s2: "Ve skutečnosti plachému psovi trvá získání důvěry k novým lidem často několik týdnů i měsíců.", s3: "Rex první týdny na Emu vůbec nereagoval, ale protože mu Ema denně nosila piškoty a mluvila na něj tichým hlasem, po dvou měsících si k ní lehl a nechal se pohladit.", sOdb: "Útulek, odkud Rex pochází, se stará také o kočky a králíky.", klicA: "Získat důvěru vystrašeného psa trvá týdny až měsíce, ne pár dní.", klicB: "Pravidelná trpělivá péče pomohla vystrašenému psovi získat důvěru." },
  { s1: "Mnoho lidí si myslí, že třídění odpadu jednou rodinou nemá na životní prostředí žádný vliv.", s2: "Ve skutečnosti papír, který jedna domácnost za rok vytřídí, ušetří dřevo zhruba ze dvou stromů.", s3: "Šestá B rozšířila třídění ze třídy i domů a za měsíc odevzdala nejvíc odpadu ze všech tříd.", sOdb: "Škola, kam žáci chodí, byla postavena před více než padesáti lety.", klicA: "I třídění v jediné rodině má na přírodu skutečný dopad.", klicB: "Třídění papíru v jedné domácnosti ročně ušetří dřevo ze stromů." },
  { s1: "Mnoho lidí považuje bobry žijící u potoka jen za škůdce, kteří zabírají cizí pozemek.", s2: "Ve skutečnosti hráz, kterou bobři postaví, zadrží vodu v krajině a vytvoří mokřinu pro spoustu jiných druhů.", s3: "Do mokřiny kolem bobří hráze se brzy nastěhovaly žáby, vážky i vodní ptáci, kteří tam předtím nebyli.", sOdb: "Bobr je největší evropský hlodavec a může vážit i přes dvacet kilogramů.", klicA: "Bobři svou hrází přírodě spíš prospívají, než aby jí škodili.", klicB: "Díky bobří hrázi získaly místo k životu i další druhy živočichů." },
  { s1: "Mnoho lidí si myslí, že jízdní kolo v podobě, jakou známe dnes, vymyslel jeden šikovný vynálezce.", s2: "Ve skutečnosti se dnešní kolo vyvíjelo postupně — nejdřív bez pedálů, pak s pedály u předního kola a nakonec s řetězem a přehazovačkou.", s3: "Každou z těchto úprav navrhl jiný výrobce v jiné zemi a v jiné době.", sOdb: "Dnešní silniční kola váží často méně než deset kilogramů.", klicA: "Dnešní kolo je výsledkem nápadů mnoha lidí, ne jednoho vynálezce.", klicB: "Dnešní kolo vzniklo postupným spojením nápadů více výrobců." },
  { s1: "Mnoho lidí si myslí, že hmyzí hotel na školní zahradě je jen hezká dekorace, které si hmyz stejně nevšimne.", s2: "Ve skutečnosti se do dutých stébel rákosu a děr v hmyzím hotelu brzy nastěhovaly včely samotářky a slunéčka.", s3: "Slunéčka v hotelu přes zimu přespávala a na jaře se rozletěla po zahradě lovit mšice.", sOdb: "Škola má na zahradě také záhon s jahodami, které žáci sklízejí v červnu.", klicA: "Hmyzí hotel není jen dekorace, hmyz ho opravdu využívá.", klicB: "Slunéčka z hmyzího hotelu na jaře pomáhají zahradě tím, že loví mšice." },
];

function findRow<T extends { s1: string }>(rows: T[], question: string): T | undefined {
  return rows.find((r) => question.includes(r.s1));
}

/** Rozparsuje "(1) věta… (2) věta…" na mapu číslo → věta (bez okolního uvozovkového textu). */
function parseNumbered(passage: string): Record<number, string> {
  const out: Record<number, string> = {};
  const re = /\((\d)\)\s*(.*?)(?=\s\(\d\)|$)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(passage))) {
    out[Number(m[1])] = m[2].trim();
  }
  return out;
}

function extractPassage(question: string): string {
  const m = question.match(/^Text: „(.*)“ /);
  return m ? m[1] : "";
}

describe("Klíčová slova a hlavní myšlenka textu — metadata", () => {
  it("čeština g6, select_one, Komunikační a slohová výchova / Čtení a naslouchání", () => {
    expect(topic.subject).toBe("čeština");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.id).toBe("g6-cjl-klicova-slova-hlavni-myslenky-textu-6");
    expect(topic.rvpNodeId).toBe("g6-cjl-komunikacni-a-slohova-vychova-cteni-a-naslouchani-klicova-slova-hlavni-myslenky-textu");
    expect(topic.category).toBe("Komunikační a slohová výchova");
    expect(topic.topic).toBe("Čtení a naslouchání");
  });
});

describe("Determinismus", () => {
  it("gen(level) dá při dvou voláních stejnou sadu úloh (otázka+klíč; pořadí možností smí losování zamíchat jinak)", () => {
    const otisk = (tasks: PracticeTask[]) => tasks.map((t) => `${t.question}|${t.correctAnswer}`).sort();
    for (const level of [1, 2, 3]) {
      expect(otisk(topic.generator(level))).toEqual(otisk(topic.generator(level)));
    }
  });
});

describe.each([1, 2, 3])("Klíčová slova / hlavní myšlenka — úlohy level %i", (level) => {
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

  it("správná odpověď se nevyskytuje ve znění otázky", () => {
    for (const t of tasks) {
      expect(t.question.includes(t.correctAnswer), `correctAnswer v otázce: ${t.question}`).toBe(false);
    }
  });

  it("každá úloha má vysvětlení", () => {
    for (const t of tasks) {
      expect(t.explanation, t.question).toBeTruthy();
    }
  });

  it("klíč není systematicky přísně nejdelší možnost (samotná délka neprozradí odpověď)", () => {
    // Přísně nejdelší = delší než VŠECHNY distraktory (ne jen shodný s maximem —
    // shoda na stejné délce, např. "věta 1".."věta 4" v L3(c), nic neprozradí).
    const nejdelsiJeKlic = tasks.filter((t) => {
      const otherMax = Math.max(...t.options!.filter((o) => o !== t.correctAnswer).map((o) => o.length));
      return t.correctAnswer.length > otherMax;
    }).length;
    expect(nejdelsiJeKlic / tasks.length, "klíč přísně nejdelší příliš často").toBeLessThan(0.8);
  });

  it("≥8 různých ukázek v bance této úrovně", () => {
    const rows: { s1: string }[] = level === 1 ? SOLVER_L1 : level === 2 ? SOLVER_L2 : SOLVER_L3;
    const matched = new Set(tasks.map((t) => findRow(rows, t.question)?.s1).filter(Boolean));
    expect(matched.size).toBeGreaterThanOrEqual(8);
  });

  it("NEZÁVISLÝ SOLVER: klíč souhlasí s ručně zapsanou tabulkou", () => {
    for (const t of tasks) {
      if (level === 1) {
        const row = findRow(SOLVER_L1, t.question);
        expect(row, `L1 solver nenašel ukázku: ${t.question}`).toBeDefined();
        if (t.question.endsWith("O čem text je?")) {
          expect(t.correctAnswer).toBe(row!.tema);
        } else if (t.question.endsWith("Ve které trojici jsou jen klíčová slova textu?")) {
          expect(t.correctAnswer).toBe(row!.klicova.join(", "));
        } else {
          throw new Error(`L1: nerozpoznaná otázka: ${t.question}`);
        }
      } else if (level === 2) {
        const row = findRow(SOLVER_L2, t.question);
        expect(row, `L2 solver nenašel ukázku: ${t.question}`).toBeDefined();
        if (t.question.includes("vystihuje hlavní myšlenku?")) {
          expect(t.correctAnswer).toBe(row!.hlavniMyslenka);
          // klíč není doslovná první věta ukázky
          expect(t.correctAnswer).not.toBe(row!.s1);
        } else if (t.question.includes("Který nadpis nejlépe vystihuje hlavní myšlenku textu?")) {
          expect(t.correctAnswer).toBe(row!.nadpisSpravny);
        } else {
          throw new Error(`L2: nerozpoznaná otázka: ${t.question}`);
        }
      } else {
        const row = findRow(SOLVER_L3, t.question);
        expect(row, `L3 solver nenašel ukázku: ${t.question}`).toBeDefined();
        if (t.question.includes("Co chce autor čtenáři sdělit?")) {
          expect(t.correctAnswer).toBe(row!.klicA);
          // klíč není doslova žádná věta ukázky
          expect([row!.s1, row!.s2, row!.s3, row!.sOdb]).not.toContain(t.correctAnswer);
        } else if (t.question.includes("Který závěr z textu vyplývá?")) {
          expect(t.correctAnswer).toBe(row!.klicB);
          expect([row!.s1, row!.s2, row!.s3, row!.sOdb]).not.toContain(t.correctAnswer);
        } else if (t.question.includes("Která věta do textu nepatří")) {
          const passage = extractPassage(t.question);
          const numbered = parseNumbered(passage);
          const m = t.correctAnswer.match(/^věta (\d)$/);
          expect(m, `correctAnswer není "věta N": ${t.correctAnswer}`).toBeTruthy();
          const n = Number(m![1]);
          // Věta na správné pozici MUSÍ být ta odbočující…
          expect(numbered[n], `pozice ${n} v "${passage}"`).toBe(row!.sOdb);
          // …a žádná z ostatních tří pozic odbočující větou není.
          for (const [k, v] of Object.entries(numbered)) {
            if (Number(k) !== n) expect(v).not.toBe(row!.sOdb);
          }
          // Všechny 4 očíslované věty jsou přesně {s1,s2,s3,sOdb}, nic jiného.
          const expectedSet = [row!.s1, row!.s2, row!.s3, row!.sOdb].sort();
          const actualSet = Object.values(numbered).sort();
          expect(actualSet).toEqual(expectedSet);
        } else {
          throw new Error(`L3: nerozpoznaná otázka: ${t.question}`);
        }
      }
    }
  });
});

describe("Gradace a rozsah", () => {
  it("L1 a L3 otázky jsou textově disjunktní", () => {
    const l1 = new Set(topic.generator(1).map((t) => t.question));
    const l3 = topic.generator(3).map((t) => t.question);
    for (const q of l3) expect(l1.has(q), `L3 otázka se opakuje v L1: ${q}`).toBe(false);
  });

  it("L1 formulace jsou přesně ty dvě zmrazené", () => {
    for (const t of topic.generator(1)) {
      const ok = t.question.endsWith("O čem text je?") || t.question.endsWith("Ve které trojici jsou jen klíčová slova textu?");
      expect(ok, t.question).toBe(true);
    }
  });

  it("L2 formulace jsou přesně ty dvě zmrazené", () => {
    for (const t of topic.generator(2)) {
      const ok = t.question.includes("vystihuje hlavní myšlenku?") || t.question.includes("Který nadpis nejlépe vystihuje hlavní myšlenku textu?");
      expect(ok, t.question).toBe(true);
    }
  });

  it("L3 formulace jsou přesně ty tři zmrazené", () => {
    for (const t of topic.generator(3)) {
      const ok =
        t.question.includes("Co chce autor čtenáři sdělit?") ||
        t.question.includes("Který závěr z textu vyplývá?") ||
        t.question.includes("Která věta do textu nepatří");
      expect(ok, t.question).toBe(true);
    }
  });

  it("L2: hlavní myšlenka nikdy neodpovídá doslovné první větě žádné ukázky", () => {
    const first = new Set(SOLVER_L2.map((r) => r.s1));
    for (const t of topic.generator(2)) {
      if (t.question.includes("vystihuje hlavní myšlenku?")) {
        expect(first.has(t.correctAnswer)).toBe(false);
      }
    }
  });
});
