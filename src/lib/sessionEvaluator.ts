/**
 * Session evaluator — generuje hodnotící text lokální šablonou
 * (deterministicky, bez sítě/AI). Dřív volal Groq; odstraněno kvůli
 * bezpečnosti (klíč v klientském bundlu) — viz nález C1.
 *
 * Pravidla:
 * - Plná česká diakritika (povinné dle CLAUDE.md).
 * - Grade 1-3: max 1-2 krátké věty, jednoduchá slova.
 * - Grade 4-5: 2-3 věty, plnější hodnocení.
 * - Předmětově specifická terminologie (matematika: počítání, čeština:
 *   pravopis, diktát: speciální).
 * - Nápovědu zmiňuje jemně, nikdy jako výtku.
 * - Povzbudivý tón, tykání, žádné emotikony.
 * - **Co dál je vždy v 1. osobě množného čísla** („projdeme si to spolu",
 *   ne „procvič si to"). Dítě má cítit, že na to nezůstalo samo — výkon
 *   patří jemu, další krok děláme společně.
 * - Vždy konkrétní: počet správně, využití nápovědy, tip co dál.
 */

export interface EvalInput {
  topicTitle: string;
  totalTasks: number;
  correctCount: number;
  wrongCount: number;
  helpUsedCount: number;
  grade: number;
  subject: string;
  category?: string;
  briefDescription?: string;
  goals?: string[];
  inputType?: string;
}

export async function generateAiEvaluation(input: EvalInput): Promise<string> {
  return generateLocalEvaluation(input);
}

export function generateLocalEvaluation(input: EvalInput): string {
  const { totalTasks, correctCount, grade, subject, topicTitle } = input;
  const pct = totalTasks > 0 ? Math.round((correctCount / totalTasks) * 100) : 0;
  const isYoung = grade <= 3;
  const isDiktat = topicTitle.toLowerCase().includes("dikt");

  // Předmětově specifické termíny
  const subjectTerms = getSubjectTerms(subject, isDiktat);

  if (pct >= 80) {
    return buildGreatEval(input, subjectTerms, isYoung);
  } else if (pct >= 50) {
    return buildGoodEval(input, subjectTerms, isYoung);
  } else {
    return buildWeakEval(input, subjectTerms, isYoung);
  }
}

interface SubjectTerms {
  activity: string;   // co dítě dělalo
  thing: string;      // co procvičovalo
  encouragement: string;
}

function getSubjectTerms(subject: string, isDiktat: boolean): SubjectTerms {
  if (isDiktat) {
    return {
      activity: "doplňování",
      thing: "pravopis",
      encouragement: "Přečteme si krátký text a budeme si spolu všímat pravopisných pravidel",
    };
  }

  switch (subject) {
    case "matematika":
      return {
        activity: "počítání",
        thing: "příklady",
        encouragement: "Projdeme si spolu postup řešení a zkusíme pár podobných příkladů",
      };
    case "cestina":
    case "čeština":
      return {
        activity: "doplňování",
        thing: "pravopis",
        encouragement: "Připomeneme si pravidla a projdeme spolu pár podobných cvičení",
      };
    case "prvouka":
      return {
        activity: "odpovídání",
        thing: "otázky",
        encouragement: "Přečteme si o tématu něco víc a pak to zkusíme znovu",
      };
    default:
      return {
        activity: "procvičování",
        thing: "úlohy",
        encouragement: "Zkusíme to spolu znovu, určitě se zlepšíš",
      };
  }
}

/** Nápovědu zmíníme jen u starších a jen pokud byla použita. */
function helpNote(helpUsedCount: number): string {
  if (helpUsedCount <= 0) return "";
  return ` Nápovědu jsi využil/a ${helpUsedCount}krát.`;
}

function buildGreatEval(input: EvalInput, terms: SubjectTerms, isYoung: boolean): string {
  const { correctCount, totalTasks, helpUsedCount, topicTitle } = input;

  if (isYoung) {
    if (helpUsedCount === 0) {
      return pick([
        `Skvělé! Zvládl/a jsi ${correctCount} z ${totalTasks} správně, a úplně sám/sama. Příště si dáme něco těžšího.`,
        `Paráda! ${topicTitle} ti jde výborně. Jdeme dál!`,
        `Výborně, skoro všechno bylo správně — můžeš na sebe být hrdý/á. Tohle už umíme.`,
      ]);
    }
    return pick([
      `Pěkně ti to šlo! Máš ${correctCount} z ${totalTasks} správně. Příště to zkusíme s menší nápovědou.`,
      `Hezky! ${topicTitle} už ti jde. Nápovědu budeme brzy potřebovat míň.`,
    ]);
  }

  // Grade 4+: 2-3 věty
  if (helpUsedCount === 0) {
    return pick([
      `Výborně zvládnuto! V tématu ${topicTitle} máš ${correctCount} z ${totalTasks} správně, a to bez jediné nápovědy. Ukazuješ velkou samostatnost — příště si můžeme dát něco těžšího.`,
      `Skvělý výkon v ${terms.activity}! ${correctCount} z ${totalTasks} správně a bez pomoci, to je na jedničku. Jdeme dál.`,
      `${topicTitle} ti evidentně jde. ${correctCount} správných z ${totalTasks} bez nápovědy je vynikající výsledek — posuneme se o kus dál.`,
    ]);
  }
  return pick([
    `Dobře ti to šlo! V tématu ${topicTitle} máš ${correctCount} z ${totalTasks} správně.${helpNote(helpUsedCount)} Příště zkusíme míň nápovědy a uvidíš, že to půjde.`,
    `Solidní výkon v ${terms.activity}. ${correctCount} z ${totalTasks} je výborný základ.${helpNote(helpUsedCount)} Příště se bez nápovědy obejdeme.`,
  ]);
}

function buildGoodEval(input: EvalInput, terms: SubjectTerms, isYoung: boolean): string {
  const { correctCount, totalTasks, helpUsedCount, topicTitle } = input;

  if (isYoung) {
    if (helpUsedCount > 0) {
      return pick([
        `Není to špatné! Máš ${correctCount} z ${totalTasks} správně. Ještě si to spolu projdeme a půjde to líp.`,
        `Dobře! ${topicTitle} ještě chvilku procvičíme a bude to lepší.`,
      ]);
    }
    return pick([
      `Dobře! Máš ${correctCount} z ${totalTasks} správně. Ještě si to procvičíme a brzy ti to půjde samo.`,
      `Ujde to! Ještě to chce trochu tréninku, ale jdeš správným směrem. Vydržíme to spolu.`,
    ]);
  }

  return pick([
    `V tématu ${topicTitle} máš ${correctCount} z ${totalTasks} správně — solidní základ, na kterém se dá stavět.${helpNote(helpUsedCount)} ${terms.encouragement}.`,
    `${correctCount} z ${totalTasks} v ${terms.activity} — není to špatné, jen kousek tě dělí od jistoty.${helpUsedCount > 0 ? " Příště se bez nápovědy obejdeme." : ""} ${terms.encouragement}.`,
  ]);
}

function buildWeakEval(input: EvalInput, terms: SubjectTerms, isYoung: boolean): string {
  const { correctCount, totalTasks, helpUsedCount, topicTitle } = input;

  if (isYoung) {
    return pick([
      `Nevadí! ${topicTitle} ještě chce procvičit. Projdeme si to spolu od začátku a půjde to.`,
      `Tohle ještě není ono, a to vůbec nevadí — učíš se. Zkusíme to spolu ještě jednou.`,
    ]);
  }

  return pick([
    `V tématu ${topicTitle} to zatím není úplně jisté — máš ${correctCount} z ${totalTasks} správně.${helpNote(helpUsedCount)} Nic se neděje, koukneme se na téma znovu a v klidu si to projdeme od základů.`,
    `${topicTitle} ti zatím dělá potíže — máš ${correctCount} z ${totalTasks}. Vůbec nevadí, každý potřebuje trochu víc času. ${terms.encouragement}.`,
  ]);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
