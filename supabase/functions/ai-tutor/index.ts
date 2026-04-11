import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Jsi strukturovaný matematický tutor pro základní školu.
Nejsi volný chat.
Držíš se přesně fáze, kterou určuje systém.
Nevymýšlíš nové téma.

PRAVIDLA:
- Buď stručný.
- Vysvětlení maximálně 6 vět.
- Úlohy odpovídají úrovni žáka.
- Nepoužívej procenta.
- Drž se pouze aktuálního skillu.
- Odpovídej POUZE v češtině.
- Vrať POUZE strukturovaný výstup přes tool call, ŽÁDNÝ volný text.
- VŽDY ověř, že correct_answer je matematicky/jazykově 100% správná. Spočítej si výsledek dvakrát.
- Nikdy neuvádej nesprávný výsledek — raději zvol jednodušší úlohu.`;

// ── Grade-level language constraints ──────────────
function getGradeConstraints(gradeMin: number): string {
  if (gradeMin <= 3) {
    return `
OMEZENÍ PRO ${gradeMin}. ROČNÍK (7-9 let):
- Věty maximálně 12 slov, jednoduché a přímé.
- Používej POUZE slova, která zná žák ${gradeMin}. třídy.
- ZAKÁZÁNO: metafory, přirovnání k dospělým profesím, abstraktní pojmy, cizí slova.
- ZAKÁZÁNO: "inženýr", "architekt", "navrhuješ", "analyzuj", "funguje jako", složená souvětí.
- Kontext: hračky, zvířátka, ovoce, rodina, škola, hřiště, pohádky.
- Příklady situací: "Máš 5 jablíček...", "Na hřišti je 8 dětí...", "Kočka má 4 koťátka...".
- Otázka musí být srozumitelná dítěti, které čte 1 rok.`;
  }
  if (gradeMin <= 5) {
    return `
OMEZENÍ PRO ${gradeMin}. ROČNÍK (9-11 let):
- Věty maximálně 18 slov.
- Používej běžnou slovní zásobu odpovídající ${gradeMin}. třídě.
- ZAKÁZÁNO: odborné termíny, profesní metafory, abstraktní koncepty mimo osnovy.
- Kontext: běžný život dítěte, sport, příroda, nakupování, cestování, škola.
- Příklady situací: "V obchodě kupuješ...", "Na výletě jdete...", "Ve třídě je...".`;
  }
  return `
OMEZENÍ PRO ${gradeMin}. ROČNÍK (11-15 let):
- Věty maximálně 25 slov.
- Můžeš používat složitější kontexty, ale stále srozumitelné pro daný věk.
- Kontexty: technologie, příroda, ekonomie v jednoduchém podání, sport, cestování.
- ZAKÁZÁNO: vysokoškolské pojmy, profesní žargon mimo běžné znalosti.`;
}

// ── Validation prompt for post-generation check ──
function buildValidationPrompt(tasks: any[], gradeMin: number): string {
  const tasksJson = JSON.stringify(tasks.map((t, i) => ({ index: i, question: t.question, correct_answer: t.correct_answer })));
  return `Jsi kontrolor kvality úloh pro ${gradeMin}. ročník ZŠ (žák ve věku ${gradeMin + 6} let).

Pro KAŽDOU úlohu vyhodnoť:
1. Je jazyk přiměřený věku? (žádné složité věty, cizí slova, abstraktní metafory)
2. Je kontext srozumitelný pro dítě v ${gradeMin}. třídě?
3. Je správná odpověď matematicky/jazykově korektní?

Úlohy k validaci:
${tasksJson}

Pro každou úlohu vrať verdikt. Pokud je úloha NEVHODNÁ, navrhni jednodušší přeformulování.
Zavolej funkci grade_validation s výsledkem.`;
}

const validationTools = [
  {
    type: "function",
    function: {
      name: "grade_validation",
      description: "Return validation results for each task.",
      parameters: {
        type: "object",
        properties: {
          results: {
            type: "array",
            items: {
              type: "object",
              properties: {
                index: { type: "number", description: "Task index (0-based)." },
                appropriate: { type: "boolean", description: "Is the task appropriate for the grade level?" },
                reason: { type: "string", description: "Brief reason if not appropriate." },
                rewritten_question: { type: "string", description: "Rewritten question if not appropriate. Empty string if appropriate." },
                rewritten_answer: { type: "string", description: "Corrected answer for rewritten question. Empty string if appropriate." },
              },
              required: ["index", "appropriate"],
            },
          },
        },
        required: ["results"],
        additionalProperties: false,
      },
    },
  },
];

function getInputTypeConstraints(practice_type: string): string {
  switch (practice_type) {
    case "select_one":
      return `
PRAVIDLA PRO TYP ODPOVĚDI "select_one":
- Pokud options obsahují ["y/ý","i/í"] nebo ["i/í","y/ý"] (pravopisné cvičení):
  → Každá otázka = JEDNO SLOVO s PŘESNĚ JEDNÍM podtržítkem (_).
  → Příklad: "p_vo" (NE "p_vovar p_l" — to jsou DVĚ podtržítka!).
  → correct_answer MUSÍ být PŘESNĚ jedna z options (např. "y/ý" nebo "i/í").
  → ZAKÁZÁNO: věty s více podtržítky, více slov s podtržítky.
- Pokud options jsou číselné nebo jiné:
  → correct_answer MUSÍ být PŘESNĚ jedna z options (přesná textová shoda).
  → Otázka se ptá na výběr jedné správné odpovědi.`;
    case "comparison":
      return `
PRAVIDLA PRO TYP ODPOVĚDI "comparison":
- Otázka MUSÍ prezentovat PŘESNĚ DVĚ hodnoty k porovnání.
- correct_answer MUSÍ být PŘESNĚ jeden z těchto tří znaků: "<", "=" nebo ">".
- ZAKÁZÁNO: otázky typu "které číslo je největší/nejmenší", odpovědi jako "56 > 48".
- Formát otázky: "Porovnej: 56 ○ 48" nebo "56 _ 48".`;
    case "fraction":
      return `
PRAVIDLA PRO TYP ODPOVĚDI "fraction":
- correct_answer MUSÍ být ve formátu "čitatel/jmenovatel" (např. "3/4") nebo celé číslo.
- ZAKÁZÁNO: slovní odpovědi, desetinná čísla.`;
    case "fill_blank":
      return `
PRAVIDLA PRO TYP ODPOVĚDI "fill_blank":
- Otázka obsahuje jedno nebo více podtržítek (_).
- correct_answer = odpovědi oddělené čárkou, jedna pro každé podtržítko v pořadí.`;
    case "drag_order":
      return `
PRAVIDLA PRO TYP ODPOVĚDI "drag_order":
- Musí obsahovat pole items se správným pořadím prvků.
- correct_answer = prvky ve správném pořadí oddělené čárkou.`;
    default:
      return `
PRAVIDLA PRO TYP ODPOVĚDI "${practice_type}":
- correct_answer musí být jednoznačná a stručná.`;
  }
}

function buildPracticeBatchPrompt(skill_label: string, practice_type: string, current_level: number, taskCount: number, admin_prompt?: string, gradeMin?: number) {
  const gradeConstraints = getGradeConstraints(gradeMin ?? 3);
  const inputTypeConstraints = getInputTypeConstraints(practice_type);
  return `PARAMETRY:
Skill: ${skill_label}
Practice type: ${practice_type || "result_only"}
Level: ${current_level || 1}
Cílový ročník: ${gradeMin ?? 3}. ročník
${admin_prompt ? `\nDoplňující instrukce od administrátora: ${admin_prompt}\n` : ""}
${gradeConstraints}
${inputTypeConstraints}

Vygeneruj přesně ${taskCount} úloh pro procvičování.
DŮLEŽITÉ: Otázky musí být KREATIVNÍ a ODLIŠNÉ od standardních učebnicových příkladů. Používej praktické situace z běžného života, neobvyklé kontexty, aplikační úlohy a překvapivé příklady. Žák by měl vidět něco nového.
KRITICKÉ: Každá otázka MUSÍ být srozumitelná pro žáka ${gradeMin ?? 3}. ročníku. Představ si, že ji čte dítě ve věku ${(gradeMin ?? 3) + 6} let.
KRITICKÉ: Dodržuj PRAVIDLA PRO TYP ODPOVĚDI výše — pokud je nesplníš, úloha bude automaticky vyřazena.
Každá úloha musí mít:
- question: text úlohy (krátký, jasný, přiměřený věku)
- correct_answer: správná odpověď (stručná, jednoznačná) — DVAKRÁT OVĚŘ SPRÁVNOST
- hints: 2-3 progresivní nápovědy, které neodhalí odpověď ale navedou žáka správným směrem
- solution_steps: postup řešení jako kroky vedoucí k odpovědi (2-4 kroky)
- options: pokud je to vhodné (výběr z možností), vygeneruj 3-4 možnosti včetně správné odpovědi; jinak prázdné pole

Úlohy musí odpovídat levelu a skillu.
Nepoužívej procenta.
Drž se pouze aktuálního skillu.
KRITICKÉ: Ověř matematickou/jazykovou správnost KAŽDÉ odpovědi. Spočítej si to.
Zavolej funkci tutor_practice_batch s výsledkem.`;
}

function buildStandardPrompt(skill_label: string, practice_type: string, current_level: number, phase: string, child_input?: string) {
  return `PARAMETRY:
Skill: ${skill_label}
Practice type: ${practice_type || "result_only"}
Level: ${current_level || 1}
Phase: ${phase}
${child_input ? `Vstup žáka: ${child_input}` : ""}

CHOVÁNÍ PODLE PHASE:

Pokud Phase = diagnostic:
Vygeneruj přesně 2 úlohy odpovídající levelu.
Nepřidávej vysvětlení ani řešení.

Pokud Phase = explain:
Vysvětli princip:
- Jedna věta principu
- Jeden jednoduchý příklad
- Jedna typická chyba
- Jedna krátká motivační věta

Pokud Phase = practice:
Vygeneruj PŘESNĚ 1 úlohu odpovídající levelu.
NE seznam, NE číslování, NE více příkladů.
Pouze jedna jasná úloha.
Neuváděj řešení.
${practice_type === "step_based" ? "Vyžaduj mezikrok." : ""}

Pokud Phase = summary:
Vytvoř shrnutí ve formátu:
Dnes procvičeno: ${skill_label}
Silné: ✔ ...
Ještě procvičit: • ...
Doporučení: ...

Zavolej funkci tutor_response s výsledkem.`;
}

const practiceBatchTools = (taskCount: number) => [
  {
    type: "function",
    function: {
      name: "tutor_practice_batch",
      description: "Return a batch of practice tasks with correct answers, hints, solution steps, and optionally options.",
      parameters: {
        type: "object",
        properties: {
          tasks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                question: { type: "string", description: "The practice question text." },
                correct_answer: { type: "string", description: "The correct answer (short, unambiguous). MUST be mathematically/linguistically 100% correct." },
                hints: {
                  type: "array",
                  items: { type: "string" },
                  description: "2-3 progressive hints that guide the student without revealing the answer.",
                },
                solution_steps: {
                  type: "array",
                  items: { type: "string" },
                  description: "Step-by-step solution process (2-4 steps).",
                },
                options: {
                  type: "array",
                  items: { type: "string" },
                  description: "3-4 multiple choice options including the correct answer. Empty array if not applicable.",
                },
              },
              required: ["question", "correct_answer", "hints", "solution_steps"],
            },
            description: `Array of exactly ${taskCount} practice tasks.`,
          },
        },
        required: ["tasks"],
        additionalProperties: false,
      },
    },
  },
];

const standardTools = [
  {
    type: "function",
    function: {
      name: "tutor_response",
      description: "Return the structured tutor response for the given phase.",
      parameters: {
        type: "object",
        properties: {
          content: { type: "string", description: "Main text content." },
          practice_question: { type: "string", description: "The practice question to display." },
          is_correct: { type: "boolean", description: "Whether the student's answer is correct." },
        },
        required: ["content"],
        additionalProperties: false,
      },
    },
  },
];

/** Run post-generation grade validation on tasks */
async function validateTasksForGrade(tasks: any[], gradeMin: number, apiKey: string): Promise<{ tasks: any[]; validation: any[] }> {
  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: `Jsi kontrolor kvality školních úloh. Buď přísný — pokud je otázka příliš složitá pro daný ročník, označ ji jako nevhodnou a přepiš ji jednodušeji.` },
          { role: "user", content: buildValidationPrompt(tasks, gradeMin) },
        ],
        tools: validationTools,
        tool_choice: { type: "function", function: { name: "grade_validation" } },
      }),
    });

    if (!response.ok) {
      console.warn("[Validator] HTTP error:", response.status);
      return { tasks, validation: tasks.map((_, i) => ({ index: i, appropriate: true, reason: "validation_skipped" })) };
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      const results = parsed.results || [];

      // Apply fixes: replace inappropriate tasks with rewritten versions
      const fixedTasks = tasks.map((task, i) => {
        const validation = results.find((r: any) => r.index === i);
        if (validation && !validation.appropriate && validation.rewritten_question) {
          return {
            ...task,
            question: validation.rewritten_question,
            correct_answer: validation.rewritten_answer || task.correct_answer,
            _grade_rewritten: true,
          };
        }
        return { ...task, _grade_validated: true };
      });

      return { tasks: fixedTasks, validation: results };
    }
  } catch (e) {
    console.warn("[Validator] Error:", e);
  }

  // Fallback: return tasks as-is
  return { tasks, validation: tasks.map((_, i) => ({ index: i, appropriate: true, reason: "validation_skipped" })) };
}
/** Validate task format matches the expected inputType */
function validateTaskFormat(task: any, practiceType: string): boolean {
  if (!task.question || !task.correct_answer) return false;

  if (practiceType === "comparison") {
    if (!["<", "=", ">"].includes(task.correct_answer.trim())) {
      console.warn(`[Format] Rejected comparison task: answer="${task.correct_answer}"`);
      return false;
    }
  }

  if (practiceType === "select_one" && Array.isArray(task.options) && task.options.length > 0) {
    // Check correct_answer is in options
    if (!task.options.includes(task.correct_answer)) {
      console.warn(`[Format] Rejected select_one task: answer="${task.correct_answer}" not in options`);
      return false;
    }
    // i/y spelling type: must have exactly one underscore
    const isIY = task.options.some((o: string) => ["i/í", "y/ý"].includes(o));
    if (isIY) {
      const underscores = (task.question.match(/_/g) || []).length;
      if (underscores !== 1) {
        console.warn(`[Format] Rejected i/y task with ${underscores} underscores: "${task.question}"`);
        return false;
      }
    }
  }

  if (practiceType === "fraction") {
    const ans = task.correct_answer.trim();
    if (!/^\d+\/\d+$/.test(ans) && !/^\d+$/.test(ans)) {
      console.warn(`[Format] Rejected fraction task: answer="${ans}"`);
      return false;
    }
  }

  return true;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { skill_label, practice_type, current_level, phase, child_input, batch_size, admin_prompt, grade_min } = await req.json();

    if (!skill_label || !phase) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters: skill_label, phase" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const isPracticeBatch = phase === "practice_batch";
    const taskCount = batch_size || 5;
    const effectiveGradeMin = grade_min ?? 3;

    const userPrompt = isPracticeBatch
      ? buildPracticeBatchPrompt(skill_label, practice_type, current_level, taskCount, admin_prompt, effectiveGradeMin)
      : buildStandardPrompt(skill_label, practice_type, current_level, phase, child_input);

    const tools = isPracticeBatch ? practiceBatchTools(taskCount) : standardTools;

    const toolChoice = isPracticeBatch
      ? { type: "function", function: { name: "tutor_practice_batch" } }
      : { type: "function", function: { name: "tutor_response" } };

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
          tools,
          tool_choice: toolChoice,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI gateway error", fallback: true }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      const fnName = toolCall.function.name;

      if (fnName === "tutor_practice_batch" && parsed.tasks) {
        // Post-generation format validation — filter unanswerable tasks
        const formatFiltered = parsed.tasks.filter((t: any) => validateTaskFormat(t, practice_type));
        console.log(`[Format filter] ${parsed.tasks.length} → ${formatFiltered.length} tasks (practice_type=${practice_type})`);

        // Run post-generation grade validation
        const { tasks: validatedTasks, validation } = await validateTasksForGrade(
          formatFiltered,
          effectiveGradeMin,
          LOVABLE_API_KEY
        );

        return new Response(
          JSON.stringify({
            tasks: validatedTasks,
            validation,
            grade_validated: true,
            grade_min: effectiveGradeMin,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          content: parsed.content || "",
          practiceQuestion: parsed.practice_question || undefined,
          isCorrect: parsed.is_correct ?? undefined,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "No structured response from AI", fallback: true }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("ai-tutor error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error", fallback: true }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
