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
      encouragement: "Přečti si krátký text a všímej si pravopisných pravidel",
    };
  }

  switch (subject) {
    case "matematika":
      return {
        activity: "počítání",
        thing: "příklady",
        encouragement: "Projdi si postup řešení a zkus pár podobných příkladů",
      };
    case "cestina":
    case "čeština":
      return {
        activity: "doplňování",
        thing: "pravopis",
        encouragement: "Připomeň si pravidla a projdi pár podobných cvičení",
      };
    case "prvouka":
      return {
        activity: "odpovídání",
        thing: "otázky",
        encouragement: "Přečti si o tématu něco víc a pak to zkus znovu",
      };
    default:
      return {
        activity: "procvičování",
        thing: "úlohy",
        encouragement: "Zkus to příště znovu, určitě se zlepšíš",
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
        `Skvělé! Zvládl/a jsi ${correctCount} z ${totalTasks} správně, a úplně sám/sama.`,
        `Paráda! ${topicTitle} ti jde výborně, jen tak dál!`,
        `Výborně, skoro všechno bylo správně — můžeš na sebe být hrdý/á!`,
      ]);
    }
    return pick([
      `Pěkně ti to šlo! Máš ${correctCount} z ${totalTasks} správně. Příště to zkus víc sám/sama.`,
      `Hezky! ${topicTitle} už ti jde. Příště nápovědu skoro nebudeš potřebovat.`,
    ]);
  }

  // Grade 4+: 2-3 věty
  if (helpUsedCount === 0) {
    return pick([
      `Výborně zvládnuto! V tématu ${topicTitle} máš ${correctCount} z ${totalTasks} správně, a to bez jediné nápovědy. Ukazuješ velkou samostatnost — jen tak dál.`,
      `Skvělý výkon v ${terms.activity}! ${correctCount} z ${totalTasks} správně a bez pomoci, to je na jedničku.`,
      `${topicTitle} ti evidentně jde. ${correctCount} správných z ${totalTasks} bez nápovědy je vynikající výsledek.`,
    ]);
  }
  return pick([
    `Dobře ti to šlo! V tématu ${topicTitle} máš ${correctCount} z ${totalTasks} správně.${helpNote(helpUsedCount)} Příště zkus víc spoléhat na sebe a uvidíš, že to půjde.`,
    `Solidní výkon v ${terms.activity}. ${correctCount} z ${totalTasks} je výborný základ.${helpNote(helpUsedCount)} Příště se zkus obejít bez nápovědy.`,
  ]);
}

function buildGoodEval(input: EvalInput, terms: SubjectTerms, isYoung: boolean): string {
  const { correctCount, totalTasks, helpUsedCount, topicTitle } = input;

  if (isYoung) {
    if (helpUsedCount > 0) {
      return pick([
        `Není to špatné! Máš ${correctCount} z ${totalTasks} správně. Ještě jednou to zkus a půjde to líp.`,
        `Dobře! ${topicTitle} ještě chvilku procvič a bude to lepší.`,
      ]);
    }
    return pick([
      `Dobře! Máš ${correctCount} z ${totalTasks} správně. Ještě si to procvič a brzy ti to půjde samo.`,
      `Ujde to! Ještě to chce trochu tréninku, ale jdeš správným směrem. Jen vydrž!`,
    ]);
  }

  return pick([
    `V tématu ${topicTitle} máš ${correctCount} z ${totalTasks} správně — solidní základ, na kterém se dá stavět.${helpNote(helpUsedCount)} ${terms.encouragement}.`,
    `${correctCount} z ${totalTasks} v ${terms.activity} — není to špatné, jen kousek tě dělí od jistoty.${helpUsedCount > 0 ? " Příště se zkus víc spolehnout na sebe." : ""} ${terms.encouragement}.`,
  ]);
}

function buildWeakEval(input: EvalInput, terms: SubjectTerms, isYoung: boolean): string {
  const { correctCount, totalTasks, helpUsedCount, topicTitle } = input;

  if (isYoung) {
    return pick([
      `Nevadí! ${topicTitle} ještě chce procvičit. Zkus to znovu, určitě ti to půjde líp.`,
      `Tohle ještě není ono, a to vůbec nevadí — učíš se. Zkus to příště ještě jednou.`,
    ]);
  }

  return pick([
    `V tématu ${topicTitle} to zatím není úplně jisté — máš ${correctCount} z ${totalTasks} správně.${helpNote(helpUsedCount)} Nic se neděje, koukni se na téma znovu a v klidu si procvič základy.`,
    `${topicTitle} ti zatím dělá potíže — máš ${correctCount} z ${totalTasks}. Vůbec nevadí, každý potřebuje trochu víc času. ${terms.encouragement}.`,
  ]);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
