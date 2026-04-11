/**
 * Session evaluator — uses Groq AI (Llama 3.3 70B) when available,
 * falls back to smart local evaluation.
 *
 * Rules from ai-architecture-notes.md:
 * - Grade 1-3: max 1-2 very short sentences, simple words
 * - Grade 4-5: 2-3 sentences, fuller evaluation
 * - Subject-specific terminology (matematika: pocitani, cestina: pravopis, diktat: special)
 * - Mentions help usage gently
 * - Encouraging tone, tykani, no emoticons
 */

import { callAi, isAiAvailable } from "./aiClient";

export interface EvalInput {
  topicTitle: string;
  totalTasks: number;
  correctCount: number;
  wrongCount: number;
  helpUsedCount: number;
  grade: number;
  subject: string;
}

/**
 * Main entry point — tries AI first, falls back to local.
 */
export async function generateAiEvaluation(input: EvalInput): Promise<string> {
  if (!isAiAvailable()) {
    return generateLocalEvaluation(input);
  }

  try {
    const result = await callAiEvaluation(input);
    if (result && result.length > 10) return result;
    return generateLocalEvaluation(input);
  } catch {
    return generateLocalEvaluation(input);
  }
}

// Subject-specific terminology and topic context for the AI prompt
function getSubjectContext(subject: string, topicTitle: string): { activity: string; whatWentWell: string; whatToPractice: string } {
  const isDiktat = topicTitle.toLowerCase().includes("dikt");
  if (isDiktat) {
    return {
      activity: "doplňování v diktátu",
      whatWentWell: "doplnil/a správně",
      whatToPractice: "zopakovat si pravidla pravopisu, která ti dělají potíže",
    };
  }
  if (subject === "matematika") {
    return {
      activity: "počítání",
      whatWentWell: "vypočítal/a správně",
      whatToPractice: "projít si postup řešení u příkladů, kde ti to nevyšlo",
    };
  }
  if (subject === "čeština" || subject === "cestina") {
    if (topicTitle.toLowerCase().includes("vyjmenovan")) {
      return {
        activity: "doplňování y/i po obojetných souhláskách",
        whatWentWell: "doplnil/a správně",
        whatToPractice: "zopakovat si řadu vyjmenovaných slov, kde si nejsi jistý/á",
      };
    }
    if (topicTitle.toLowerCase().includes("tvrd") || topicTitle.toLowerCase().includes("měk")) {
      return {
        activity: "doplňování y/i po tvrdých a měkkých souhláskách",
        whatWentWell: "doplnil/a správně",
        whatToPractice: "zopakovat si pravidlo, kdy se píše tvrdé y po tvrdých souhláskách",
      };
    }
    if (topicTitle.toLowerCase().includes("párov") || topicTitle.toLowerCase().includes("parov")) {
      return {
        activity: "rozlišování párových souhlásek",
        whatWentWell: "určil/a správně",
        whatToPractice: "zkusit si ověřovací slova u souhlásek, kde váháš",
      };
    }
    return {
      activity: "pravopis",
      whatWentWell: "zvládl/a správně",
      whatToPractice: "procvičit si pravidla, kde děláš chyby",
    };
  }
  return {
    activity: "odpovídání na otázky",
    whatWentWell: "odpověděl/a správně",
    whatToPractice: "přečíst si o tomto tématu víc a zkusit to znovu",
  };
}

async function callAiEvaluation(input: EvalInput): Promise<string> {
  const { topicTitle, totalTasks, correctCount, wrongCount, helpUsedCount, grade, subject } = input;
  const pct = totalTasks > 0 ? Math.round((correctCount / totalTasks) * 100) : 0;
  const ctx = getSubjectContext(subject, topicTitle);

  const gradeStyle = grade <= 3
    ? "Piš 2 krátké věty. Jednoduchá slova. Dítěti tykej."
    : "Piš 2-3 věty. Dítěti tykej.";

  const helpNote = helpUsedCount === 0
    ? "Žák nepotřeboval nápovědu — oceň konkrétně jeho samostatnost."
    : `Žák použil nápovědu ${helpUsedCount}×. Jemně povzbuď k větší samostatnosti.`;

  const prompt = `Napiš slovní hodnocení pro žáka ${grade}. ročníku ZŠ.

KONTEXT:
- Téma: "${topicTitle}"
- Aktivita: ${ctx.activity}
- Výsledek: ${correctCount} z ${totalTasks} ${ctx.whatWentWell} (${pct} %)
- Počet chyb: ${wrongCount}
- ${helpNote}

POVINNÁ STRUKTURA hodnocení:
1. PRVNÍ VĚTA: Začni názvem tématu a řekni, jak to žákovi šlo (konkrétní čísla neříkej, ale řekni "většinu", "skoro vše", "některé" apod.)
2. DRUHÁ VĚTA: ${wrongCount > 0 ? `Pojmenuj co ještě procvičit: "${ctx.whatToPractice}".` : "Pochval, že zvládl vše bez chyby."}
${wrongCount > 0 && helpUsedCount === 0 ? `3. TŘETÍ VĚTA (krátká): Oceň, že pracoval/a samostatně bez nápovědy.` : ""}

PRAVIDLA:
- ${gradeStyle}
- NIKDY neříkej "úlohy", "test", "cvičení" — mluv o konkrétní činnosti (${ctx.activity}).
- NIKDY nepoužívej emotikony, hvězdičky, pomlčky na začátku.
- Piš plynulý text, ne body.
- Piš česky s diakritikou.

PŘÍKLAD pro inspiraci (NEOPISUJ doslova):
"${topicTitle} ti jde dobře — většinu jsi ${ctx.whatWentWell} a bez nápovědy. U pár slov sis ještě nebyl/a jistý/á, tak si zkus ${ctx.whatToPractice}."

Odpověz POUZE hodnocením:`;

  return callAi(
    [{ role: "user", content: prompt }],
    { maxTokens: 200, temperature: 0.6, timeoutMs: 5000 }
  );
}

export function generateLocalEvaluation(input: EvalInput): string {
  const { topicTitle, totalTasks, correctCount, wrongCount, helpUsedCount, grade, subject } = input;
  const pct = totalTasks > 0 ? Math.round((correctCount / totalTasks) * 100) : 0;
  const isYoung = grade <= 3;
  const isDiktat = topicTitle.toLowerCase().includes("dikt");

  // Subject-specific terms
  const subjectTerms = getSubjectTerms(subject, isDiktat);

  // Build evaluation
  if (pct >= 80) {
    return buildGreatEval(input, subjectTerms, isYoung);
  } else if (pct >= 50) {
    return buildGoodEval(input, subjectTerms, isYoung);
  } else {
    return buildWeakEval(input, subjectTerms, isYoung);
  }
}

interface SubjectTerms {
  activity: string;   // co delal/a
  thing: string;      // co procvicoval/a
  encouragement: string;
}

function getSubjectTerms(subject: string, isDiktat: boolean): SubjectTerms {
  if (isDiktat) {
    return {
      activity: "doplnovani",
      thing: "pravopis",
      encouragement: "Zkus si precist nejaky kratky text a premyslet o pravopisnych pravidlech",
    };
  }

  switch (subject) {
    case "matematika":
      return {
        activity: "pocitani",
        thing: "priklady",
        encouragement: "Zkus si projit postup reseni a procvicit podobne priklady",
      };
    case "cestina":
    case "\u010De\u0161tina":
      return {
        activity: "doplnovani",
        thing: "pravopis",
        encouragement: "Zkus si precist pravidla a projit si podobna cviceni",
      };
    case "prvouka":
      return {
        activity: "odpovidani",
        thing: "otazky",
        encouragement: "Zkus si precist neco o tomto tematu a pak to zkusit znovu",
      };
    default:
      return {
        activity: "procvicovani",
        thing: "ulohy",
        encouragement: "Zkus to priste znovu, urcite se zlepsis",
      };
  }
}

function buildGreatEval(input: EvalInput, terms: SubjectTerms, isYoung: boolean): string {
  const { correctCount, totalTasks, helpUsedCount, topicTitle } = input;

  if (isYoung) {
    // Grade 1-3: max 2 short sentences
    if (helpUsedCount === 0) {
      return pick([
        `Skvele! Zvladl/a jsi ${correctCount} z ${totalTasks} spravne, a to uplne sam/sama.`,
        `Parada! ${topicTitle} ti jde moc dobre. Jen tak dal!`,
        `Vyborne! Skoro vse jsi mel/a spravne. Jsi skvely/a!`,
      ]);
    }
    return pick([
      `Dobre to slo! Zvladl/a jsi ${correctCount} z ${totalTasks} spravne. Zkus priste mene pouzivat napovedu.`,
      `Hezky! ${topicTitle} uz ti jde. Priste zkus vic sam/sama.`,
    ]);
  }

  // Grade 4+: 2-3 sentences
  if (helpUsedCount === 0) {
    return pick([
      `Vyborne zvladnuto! V tematu ${topicTitle} jsi mel/a ${correctCount} z ${totalTasks} spravne, a to bez jedine napovedy. Ukazujes velkou samostatnost.`,
      `Skvely vykon v ${terms.activity}! ${correctCount} z ${totalTasks} spravne a bez pomoci — to je na jednicku.`,
      `${topicTitle} ti evidentne jde. ${correctCount} spravnych odpovedi z ${totalTasks} bez napovedy je super vysledek.`,
    ]);
  }
  return pick([
    `Dobre to slo! V ${topicTitle} jsi mel/a ${correctCount} z ${totalTasks} spravne. Napovedu jsi pouzil/a ${helpUsedCount}x — priste zkus vic premyslet sam/sama.`,
    `Solidni vykon v ${terms.activity}. ${correctCount} z ${totalTasks} je dobry zaklad. Zkus se priste obejit bez napovedy.`,
  ]);
}

function buildGoodEval(input: EvalInput, terms: SubjectTerms, isYoung: boolean): string {
  const { correctCount, totalTasks, helpUsedCount, topicTitle } = input;

  if (isYoung) {
    if (helpUsedCount > 0) {
      return pick([
        `Neni to spatne! Mel/a jsi ${correctCount} z ${totalTasks} spravne. Zkus to priste jeste jednou.`,
        `Dobre! ${topicTitle} jeste procvic a bude to lepsi.`,
      ]);
    }
    return pick([
      `Dobre! Mel/a jsi ${correctCount} z ${totalTasks}. Zkus si to jeste procvicit.`,
      `Ujde to! Jeste to chce trochu treninku, ale jde to spravnym smerem.`,
    ]);
  }

  return pick([
    `V tematu ${topicTitle} jsi mel/a ${correctCount} z ${totalTasks} spravne — solidni zaklad.${helpUsedCount > 0 ? ` Napovedu jsi pouzil/a ${helpUsedCount}x.` : ""} ${terms.encouragement}.`,
    `${correctCount} z ${totalTasks} v ${terms.activity} — neni to spatne, ale je prostor ke zlepseni.${helpUsedCount > 0 ? " Zkus se priste vic spolehnout na sebe." : ""} ${terms.encouragement}.`,
  ]);
}

function buildWeakEval(input: EvalInput, terms: SubjectTerms, isYoung: boolean): string {
  const { correctCount, totalTasks, helpUsedCount, topicTitle } = input;

  if (isYoung) {
    return pick([
      `Nevadi! ${topicTitle} chce jeste procvicit. Zkus to znovu, pomuze ti to.`,
      `Tohle jeste neni ono, ale to je v poradku. Zkus to priste jeste jednou.`,
    ]);
  }

  return pick([
    `V tematu ${topicTitle} to jeste neni uplne jiste — ${correctCount} z ${totalTasks} spravne.${helpUsedCount > 0 ? ` Napovedu jsi pouzil/a ${helpUsedCount}x.` : ""} Doporucuji se na tema podivat znovu a procvicit zaklady.`,
    `${topicTitle} ti zatim dela potize — mel/a jsi ${correctCount} z ${totalTasks}. Nic se nedeje, kazdy potrebuje trochu vice casu. ${terms.encouragement}.`,
  ]);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
