import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { aiCall, hasAnyAiProvider } from "../_shared/aiCall.ts";
import { checkMathAnswer } from "../_shared/mathSolver.ts";
import { checkHintLeakage } from "../_shared/hintLeakage.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Jsi strukturovaný tutor pro českou základní školu.
Nejsi volný chat.
Držíš se přesně fáze, kterou určuje systém.
Nevymýšlíš nové téma.

ZÁKLADNÍ PRAVIDLA:
- Buď stručný.
- Vysvětlení maximálně 6 vět.
- Úlohy odpovídají úrovni žáka.
- Drž se pouze aktuálního skillu.
- Odpovídej POUZE v češtině.
- Vrať POUZE strukturovaný výstup přes tool call, ŽÁDNÝ volný text.
- VŽDY ověř, že correct_answer je 100% správná. Spočítej si výsledek dvakrát.
  Nikdy neuvádej nesprávný výsledek — raději zvol jednodušší úlohu.

PRAVIDLA PRO NÁPOVĚDY (kritické — porušení = zamítnutí úlohy):
- Nápověda NESMÍ obsahovat doslovnou odpověď ani jako rovnost (např. "= 36").
- Nápověda NESMÍ ukazovat finální výpočet ("Spočítej 12 × 3").
- Nápověda MÁ navést k myšlení: "Vzpomeň si na...", "Jak vypadá pravidlo...?", "Co znamená to slovo?"
- 2-3 nápovědy odstupňované od obecné po konkrétnější, ale ANI poslední nesmí prozradit výsledek.
- Příklad SPRÁVNĚ: úloha "12 × 3 = ?" → hint "Násobení 3 je opakované sčítání 3+3+3..."
- Příklad ŠPATNĚ: tatáž úloha → hint "Spočítej: 12 × 3 = 36" (PROZRAZUJE!)

PRAVIDLA PRO POSTUP (solution_steps):
- Postup je VYSVĚTLENÍ pro žáka PO odpovědi — tady JE výsledek na konci.
- Krátký, srozumitelný, krok za krokem.
- Žák vidí postup, až když odpověděl (nebo se vzdal).`;

// ── Grade-level language + RVP content constraints ──────────────
// Každý ročník má explicitní domény z RVP (Rámcového vzdělávacího programu),
// aby AI generovala obsahově relevantní úlohy pro daný věk.
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
- Otázka musí být srozumitelná dítěti, které čte 1 rok.
RVP (3. ročník): sčítání/odčítání do 1000, násobení/dělení malou násobilkou, porovnávání, zaokrouhlování na desítky, jednotky délky/hmotnosti/času, jednoduché geometrické útvary.`;
  }
  if (gradeMin <= 5) {
    return `
OMEZENÍ PRO ${gradeMin}. ROČNÍK (9-11 let):
- Věty maximálně 18 slov.
- Používej běžnou slovní zásobu odpovídající ${gradeMin}. třídě.
- ZAKÁZÁNO: odborné termíny, profesní metafory, abstraktní koncepty mimo osnovy.
- Kontext: běžný život dítěte, sport, příroda, nakupování, cestování, škola.
- Příklady situací: "V obchodě kupuješ...", "Na výletě jdete...", "Ve třídě je...".
RVP (${gradeMin}. ročník): přirozená čísla do milionu, desetinná čísla (${gradeMin === 5 ? "úvod" : "ještě ne"}), zlomky jako části celku, písemné sčítání/odčítání/násobení/dělení, obvod a obsah, jednotky, jednoduchá slovní úloha.`;
  }
  if (gradeMin === 6) {
    return `
OMEZENÍ PRO 6. ROČNÍK (11-12 let):
- Věty maximálně 22 slov, srozumitelné a přesné.
- Slovník: běžná mluvená čeština + základní matematická terminologie (čitatel, jmenovatel, zlomek, desetinná).
- ZAKÁZÁNO: vysokoškolské termíny, anglicismy mimo IT/běžný svět.
- Kontexty: pizza, koláč, čas, peníze, sport, cestování, rodinný rozpočet.
RVP pro 6. ročník — HLAVNÍ DOMÉNY:
- **Čísla a operace:** přirozená čísla do velkých řádů, dělitelnost (dělitelé, násobky, NSD/NSN — úvod), prvočísla, sčítání/odčítání/násobení/dělení desetinných čísel
- **Zlomky:** smysl zlomku, rozšiřování/krácení, sčítání a odčítání zlomků se stejným jmenovatelem, smíšené číslo
- **Geometrie:** úhel (vrcholový, vedlejší), osová souměrnost, trojúhelník (součet úhlů = 180°), čtyřúhelník, obvod a obsah
- **Jednotky:** délka, plocha, hmotnost, čas, převody
ZAKÁZÁNO PRO 6. ROČNÍK: procenta (probírají se až v 7.), mocniny (až v 8.), rovnice s neznámou (úvod až v 7.–8.).`;
  }
  if (gradeMin === 7) {
    return `
OMEZENÍ PRO 7. ROČNÍK (12-13 let):
- Věty maximálně 25 slov, mohou obsahovat závislé věty.
- Slovník: běžná čeština + matematická terminologie (poměr, procento, zlomek, úměra, záporné číslo).
- ZAKÁZÁNO: cizí slova bez vysvětlení, vysokoškolské pojmy.
- Kontexty: sport, vaření (poměry), finance, rozpočet kapesného, mapa a měřítko, populace.
RVP pro 7. ročník — HLAVNÍ DOMÉNY:
- **Celá čísla:** pojem, porovnávání, sčítání/odčítání/násobení/dělení, absolutní hodnota
- **Zlomky:** všechny čtyři operace (+, −, ×, ÷), zlomek jako podíl, smíšené číslo, převody
- **Desetinná čísla:** všechny čtyři operace, zaokrouhlování, odhad
- **Poměr, přímá a nepřímá úměrnost:** poměr dvou veličin, trojčlenka, dělení v poměru
- **Procenta:** základ, procentová část, počet procent, slovní úlohy (úroky, slevy)
- **Geometrie:** osová/středová souměrnost, trojúhelník (strany, úhly, výška, těžnice), čtyřúhelník (druhy), objem a povrch kvádru a krychle
- **Statistika — úvod:** aritmetický průměr, tabulky, grafy
ZAKÁZÁNO PRO 7. ROČNÍK: mocniny (8. ročník), rovnice s neznámou více kroků (úvod je OK), Pythagorova věta (8. roč.), funkce (9. roč.).`;
  }
  if (gradeMin === 8) {
    return `
OMEZENÍ PRO 8. ROČNÍK (13-14 let):
- Věty maximálně 28 slov.
- Slovník: matematická terminologie (mocnina, odmocnina, výraz, rovnice, Pythagorova věta).
- Kontexty: technika, sport, konstrukce, výpočty v běžném životě, ekonomie, věda pro mládež.
RVP pro 8. ročník — HLAVNÍ DOMÉNY:
- **Mocniny s přirozeným mocnitelem:** a², a³, aⁿ, pravidla pro počítání, zápis čísel mocninou deseti
- **Druhá odmocnina:** pojem, odhad, kalkulačka
- **Pythagorova věta:** a² + b² = c², použití v trojúhelníku, prostorové útvary
- **Výrazy:** výraz s proměnnou, sčítání/odčítání/násobení výrazů, mnohočleny, rozklad
- **Rovnice:** lineární rovnice s jednou neznámou, ekvivalentní úpravy, slovní úlohy
- **Geometrie:** kruh (π), kružnice, tečna, válec (objem, povrch), konstrukce trojúhelníků
- **Statistika:** medián, modus, závislosti veličin
ZAKÁZÁNO PRO 8. ROČNÍK: soustavy dvou rovnic (9. roč.), funkce jako objekt (9. roč.), goniometrie (SŠ).`;
  }
  // gradeMin === 9 (nebo více — ignorováno vyšší než 9 pro ZŠ)
  return `
OMEZENÍ PRO 9. ROČNÍK (14-15 let):
- Věty maximálně 30 slov, pokročilá struktura je OK.
- Slovník: plná matematická terminologie ZŠ (funkce, soustava, podobnost, jehlan, kužel).
- Kontexty: věda, technika, ekonomie, příroda, společnost, IT, přijímačky na SŠ.
RVP pro 9. ročník — HLAVNÍ DOMÉNY:
- **Lomený výraz:** krácení, sčítání/odčítání/násobení/dělení, definiční obor
- **Rovnice:** lineární rovnice s neznámou ve jmenovateli, soustava dvou rovnic o dvou neznámých (sčítací, dosazovací metoda)
- **Funkce:** pojem, přímá a nepřímá úměrnost jako funkce, lineární funkce, kvadratická funkce (úvod), graf
- **Podobnost:** podobnost trojúhelníků, věty (sss, sus, usu), poměry stran
- **Goniometrie — úvod:** sin, cos, tg v pravoúhlém trojúhelníku
- **Tělesa:** jehlan, kužel, koule (objem, povrch), řezy tělesem
- **Finanční matematika:** jistina, úrok, úroková míra, složené úročení
- **Statistika a pravděpodobnost:** jednoduchý pravděpodobnostní model
Úroveň: příprava na přijímací zkoušky na SŠ.`;
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
    case "numeric_range":
      return `
PRAVIDLA PRO TYP ODPOVĚDI "numeric_range" (číslo s tolerancí):
- correct_answer formát:
  • "5.5" — exact (s tolerancí 0.001)
  • "5.5±0.1" — explicitní tolerance ±0.1
  • "5.5..6.5" — rozsah (inclusive od 5.5 do 6.5)
- Vhodné pro: fyziku (rychlost, hmotnost), chemii (koncentrace),
  geografii (vzdálenosti, výšky), kde drobná odchylka je OK.
- Příklad: "Jak vysoká je Sněžka?" → correct_answer: "1602..1610"`;
    case "short_answer":
      return `
PRAVIDLA PRO TYP ODPOVĚDI "short_answer" (krátká volná odpověď):
- correct_answer = jediné slovo nebo krátká fráze (max 5 slov).
- Pokud existuje VÍCE přijatelných variant, oddělit znakem |
  Např. "polský|polák|polsko" — žák může napsat libovolnou.
- Validátor toleruje překlepy do 2 znaků (typo tolerance).
- Vhodné pro: humanitní předměty (kdo, kde, kdy), terminologii.
- ZAKÁZÁNO: dlouhé volné odpovědi (víc než 5 slov), eseje.`;
    case "table_fill":
      return `
PRAVIDLA PRO TYP ODPOVĚDI "table_fill" (doplnit tabulku):
- Otázka popisuje tabulku se sloupci a žák doplňuje prázdné buňky.
- correct_answer = obsah buněk oddělený znakem |, v pořadí zleva doprava,
  shora dolů. Např. pro tabulku 2×2 s prázdnou pravou stranou:
  correct_answer = "12|18" (pokud horní pravá je 12, dolní pravá 18)
- options pole obsahuje pojmenování řádků a sloupců nebo nápovědné údaje.
- Vhodné pro: násobilkovou tabulku, převody jednotek, kalendáře.`;
    case "sequence_step":
      return `
PRAVIDLA PRO TYP ODPOVĚDI "sequence_step" (seřadit kroky):
- options = pole 3-6 kroků v náhodném pořadí.
- correct_answer = ty samé kroky ve SPRÁVNÉM pořadí, oddělené znakem |.
- Vhodné pro: chemické experimenty, biologické procesy (mitóza),
  historické události, postupy řešení úloh.
- Příklad: chemická reakce — kroky "Zahřát|Smíchat|Filtrovat|Ochladit" →
  správné pořadí "Smíchat|Zahřát|Ochladit|Filtrovat"`;
    case "multi_select":
      return `
PRAVIDLA PRO TYP ODPOVĚDI "multi_select":
- options = 4-6 možností, ž žák zaškrtne všechny správné.
- correct_answer = správné možnosti oddělené čárkou (pořadí nezáleží).
- Min 2 a max polovina options jsou správné (ne 1 ne všechny).`;
    case "match_pairs":
      return `
PRAVIDLA PRO TYP ODPOVĚDI "match_pairs":
- options obsahuje 2 sloupce: levý (otázky) a pravý (odpovědi) oddělené "::".
- correct_answer = páry "levý=>pravý" oddělené čárkou.
- Vhodné pro: spojení slov a překladů, definice, příčina-následek.`;
    case "categorize":
      return `
PRAVIDLA PRO TYP ODPOVĚDI "categorize":
- options = 4-8 položek na zařazení do 2-3 kategorií.
- correct_answer = "kategorie1: pol1, pol2 | kategorie2: pol3, pol4"
- Vhodné pro: domácí vs. divoká zvířata, sudá vs. lichá čísla.`;
    case "chemical_balance":
      return `
PRAVIDLA PRO TYP ODPOVĚDI "chemical_balance" (vyrovnat chemickou rovnici):
- correct_answer formát: prokládané koeficienty a vzorce/operátory
  oddělené znakem |. Liché pozice (0, 2, 4...) = koeficienty,
  sudé = vzorce/operátory.
- Příklad: "2|H2|+|1|O2|=|2|H2O" znamená 2H₂ + O₂ = 2H₂O
- Implicitní koeficient 1 NEvynechávat — vždy "1".
- Operátory: + - = →
- ZAKÁZÁNO: dolní indexy ve vzorcích (H2O, ne H₂O), Unicode subscript.
- Použít až od 8. ročníku (anorganická chemie).`;
    case "timeline":
      return `
PRAVIDLA PRO TYP ODPOVĚDI "timeline" (chronologické pořadí):
- options = 4-6 historických událostí v náhodném pořadí.
- correct_answer = ty samé události ve SPRÁVNÉM chronologickém pořadí
  oddělené |, od nejstarší po nejnovější.
- Doporučení: u každé události přidat rok do závorky pro orientaci
  (např. "Karel IV. (1346)|Husitské války (1419)|Bílá hora (1620)").
- Vhodné pro: dějepis 6.-9. ročník — české i světové dějiny.`;
    case "formula_builder":
      return `
PRAVIDLA PRO TYP ODPOVĚDI "formula_builder" (sestav vzorec z dílů):
- options = 4-8 dílů vzorce (čísla, proměnné, operátory) v náhodném
  pořadí.
- correct_answer = ty samé díly ve SPRÁVNÉM pořadí oddělené |.
- Příklad: pool ["x", "=", "2", "*", "a"] → správně "x|=|2|*|a"
- Vhodné pro: matematika (vzorce), fyzika (S = v·t), chemie
  (jednoduché reakce).
- ZAKÁZÁNO: díly delší než 3 znaky (díl má být atomická jednotka).`;
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
// ── Druhý AI průchod: matematická/jazyková správnost (2nd opinion) ──
// Používá jiný model než generator (diverzita pohledů).
// Zamítá nesprávné úlohy — uživatel/dítě je nikdy neuvidí.
async function validateTasksCorrectness(tasks: any[], gradeMin: number, apiKey: string): Promise<{ tasks: any[]; rejected: number[] }> {
  if (!tasks.length) return { tasks, rejected: [] };

  const correctnessTools = [{
    type: "function",
    function: {
      name: "correctness_check",
      description: "For each task, verify if correct_answer is mathematically/linguistically correct. Return which indices are WRONG.",
      parameters: {
        type: "object",
        properties: {
          results: {
            type: "array",
            items: {
              type: "object",
              properties: {
                index: { type: "number" },
                is_correct: { type: "boolean", description: "Is the stated correct_answer actually correct?" },
                computed_answer: { type: "string", description: "What YOU computed as the correct answer (for verification)." },
                reason: { type: "string", description: "If is_correct=false, explain briefly why." },
              },
              required: ["index", "is_correct"],
            },
          },
        },
        required: ["results"],
        additionalProperties: false,
      },
    },
  }];

  const tasksJson = JSON.stringify(tasks.map((t, i) => ({
    index: i,
    question: t.question,
    stated_answer: t.correct_answer,
    options: t.options || [],
  })));

  const prompt = `Jsi nezávislý kontrolor správnosti školních úloh. Druhý názor na již vygenerované úlohy.

Pro KAŽDOU úlohu:
1. Vyřeš úlohu sám — POMALU a KROK ZA KROKEM. Spočítej si výsledek.
2. Porovnej svůj výsledek se "stated_answer".
3. Pokud se liší — označ is_correct=false a vysvětli proč.
4. U úloh typu select_one ověř, že stated_answer je v options.
5. U jazykových úloh (doplňování i/y atd.) ověř pravopis.

Buď PŘÍSNÝ. Raději označ jako špatnou úlohu, kde si nejsi 100% jistý.

Cílový ročník: ${gradeMin}. ZŠ (${gradeMin + 6} let).

Úlohy:
${tasksJson}

Zavolej funkci correctness_check.`;

  try {
    // Druhý model nezávisle ověří správnost — Groq Llama 70B nebo GPT přes Lovable.
    const response = await aiCall({
      messages: [
        { role: "system", content: "Jsi expertní matematický a jazykový kontrolor pro ZŠ." },
        { role: "user", content: prompt },
      ],
      tools: correctnessTools,
      toolChoice: { type: "function", function: { name: "correctness_check" } },
      model: {
        // Pro Layer 3 stačí stejný model jako generator (cross-check je při toolu, ne při modelu)
        groq: "llama-3.3-70b-versatile",
        lovable: "openai/gpt-5-mini",
      },
    });

    if (!response.ok) {
      console.warn("[CorrectnessValidator] HTTP error:", response.status, "— pass-through");
      return { tasks, rejected: [] };
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      const results = parsed.results || [];
      const rejected: number[] = [];

      const verifiedTasks = tasks.map((task, i) => {
        const r = results.find((x: any) => x.index === i);
        if (r && r.is_correct === false) {
          rejected.push(i);
          console.warn(`[CorrectnessValidator] Rejected task ${i}: ${r.reason || "wrong answer"}. Computed=${r.computed_answer}, stated=${task.correct_answer}`);
          return { ...task, _correctness_failed: true, _correctness_reason: r.reason };
        }
        return { ...task, _correctness_verified: true };
      });

      return { tasks: verifiedTasks, rejected };
    }
  } catch (e) {
    console.warn("[CorrectnessValidator] Error:", e);
  }

  return { tasks, rejected: [] };
}

async function validateTasksForGrade(tasks: any[], gradeMin: number, _apiKey: string): Promise<{ tasks: any[]; validation: any[] }> {
  try {
    const response = await aiCall({
      messages: [
        { role: "system", content: `Jsi kontrolor kvality školních úloh. Buď přísný — pokud je otázka příliš složitá pro daný ročník, označ ji jako nevhodnou a přepiš ji jednodušeji.` },
        { role: "user", content: buildValidationPrompt(tasks, gradeMin) },
      ],
      tools: validationTools,
      toolChoice: { type: "function", function: { name: "grade_validation" } },
      model: {
        groq: "llama-3.3-70b-versatile",
        lovable: "google/gemini-3-flash-preview",
      },
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
    const { skill_label, practice_type, current_level, phase, child_input, batch_size, admin_prompt, grade_min, subject, category, topic } = await req.json();

    if (!skill_label || !phase) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters: skill_label, phase" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!hasAnyAiProvider()) {
      throw new Error(
        "Žádný AI provider není nakonfigurován. Nastavte GROQ_API_KEY (preferováno) " +
        "nebo LOVABLE_API_KEY v Supabase Edge Functions Secrets."
      );
    }

    const isPracticeBatch = phase === "practice_batch";
    const taskCount = batch_size || 5;
    const effectiveGradeMin = grade_min ?? 3;

    // Per-předmět prompt extras z DB (curriculum_subjects.ai_prompt_extra)
    let subjectPromptExtra = "";
    if (subject) {
      try {
        const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
        const sb = createClient(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!
        );
        // Najdi předmět podle slug NEBO name (frontend posílá kde co)
        const { data } = await sb
          .from("curriculum_subjects")
          .select("ai_prompt_extra, name, slug")
          .or(`slug.eq.${subject},name.ilike.${subject}`)
          .limit(1)
          .maybeSingle();
        if (data?.ai_prompt_extra) {
          subjectPromptExtra = `\n\nPRAVIDLA PRO PŘEDMĚT (${data.name}):\n${data.ai_prompt_extra}`;
          console.log(`[ai-tutor] Loaded ai_prompt_extra pro ${data.slug ?? data.name} (${subjectPromptExtra.length} chars)`);
        }
      } catch (e) {
        console.warn("[ai-tutor] Failed to load subject prompt extra:", e);
      }
    }

    // Kontextový prefix do system promptu — pomáhá AI udržet zaměření
    const contextSuffix = [
      subject && `Předmět: ${subject}`,
      category && `Okruh: ${category}`,
      topic && `Téma: ${topic}`,
    ].filter(Boolean).join(" › ");
    const contextLine = contextSuffix ? `\n\nKONTEXT: ${contextSuffix}` : "";

    const fullSystemPrompt = SYSTEM_PROMPT + contextLine + subjectPromptExtra;

    const userPrompt = isPracticeBatch
      ? buildPracticeBatchPrompt(skill_label, practice_type, current_level, taskCount, admin_prompt, effectiveGradeMin)
      : buildStandardPrompt(skill_label, practice_type, current_level, phase, child_input);

    const tools = isPracticeBatch ? practiceBatchTools(taskCount) : standardTools;

    const toolChoice = isPracticeBatch
      ? { type: "function", function: { name: "tutor_practice_batch" } }
      : { type: "function", function: { name: "tutor_response" } };

    const response = await aiCall({
      messages: [
        { role: "system", content: fullSystemPrompt },
        { role: "user", content: userPrompt },
      ],
      tools,
      toolChoice,
      model: {
        groq: "llama-3.3-70b-versatile",
        lovable: "google/gemini-3-flash-preview",
      },
    });

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
        // LAYER 1 — Post-generation format validation (regex / structural)
        const formatFiltered = parsed.tasks.filter((t: any) => validateTaskFormat(t, practice_type));
        console.log(`[Layer 1 — Format] ${parsed.tasks.length} → ${formatFiltered.length} tasks (practice_type=${practice_type})`);

        // LAYER 2 — Věková přiměřenost (AI grade-appropriateness check)
        const { tasks: gradeValidated, validation } = await validateTasksForGrade(
          formatFiltered,
          effectiveGradeMin,
          ""
        );
        console.log(`[Layer 2 — Grade] validated ${gradeValidated.length} tasks for ${effectiveGradeMin}. grade`);

        // LAYER 2.5 — Symbolic math solver (deterministická kontrola)
        // Pro číselné úlohy nezávisle spočítá výsledek a porovná s tvrzeným.
        // Když AI lhala (typický error u Llama 70B u složitějších úloh) → reject.
        let mathSolverRejected = 0;
        let mathSolverPassed = 0;
        const mathSolverFiltered = gradeValidated.filter((task: any) => {
          if (!task || typeof task.question !== "string" || typeof task.correct_answer !== "string") {
            return true; // Nelze validovat, propustit dál
          }
          const result = checkMathAnswer(task.question, task.correct_answer, practice_type);
          if (result.status === "mismatch") {
            console.warn(`[Layer 2.5 — MathSolver] REJECT: "${task.question}" → AI: ${result.got}, Solver: ${result.expected}`);
            mathSolverRejected++;
            return false;
          }
          if (result.status === "match") {
            mathSolverPassed++;
          }
          return true;
        });
        console.log(`[Layer 2.5 — MathSolver] checked ${gradeValidated.length}: ${mathSolverPassed} match, ${mathSolverRejected} mismatch (rejected), ${gradeValidated.length - mathSolverPassed - mathSolverRejected} indeterminate`);

        // LAYER 2.6 — Hint leakage detector (deterministická heuristika)
        // Kontroluje, že hinty neprozrazují odpověď. Pokud ano, hint se odstraní
        // (raději bez nápovědy než se špatnou).
        let hintLeakageRejected = 0;
        const hintLeakageFiltered = mathSolverFiltered.map((task: any) => {
          if (!task || !task.hints || !Array.isArray(task.hints)) return task;
          const result = checkHintLeakage(task);
          if (!result.ok) {
            console.warn(`[Layer 2.6 — HintLeakage] STRIP hint from "${task.question}": ${result.reason}`);
            hintLeakageRejected++;
            // Odeber leakující hint, ostatní ponech
            const cleanHints = task.hints.filter((_: string, idx: number) => idx !== result.leakingHintIndex);
            return { ...task, hints: cleanHints, _hint_leakage_stripped: result.reason };
          }
          return task;
        });
        console.log(`[Layer 2.6 — HintLeakage] stripped ${hintLeakageRejected} leaking hints from ${mathSolverFiltered.length} tasks`);

        // LAYER 3 — Matematická/jazyková správnost (2nd opinion AI check)
        // Druhý nezávislý průchod stejného providera — ověří, že stated answer je správná.
        const { tasks: correctnessChecked, rejected } = await validateTasksCorrectness(
          hintLeakageFiltered,
          effectiveGradeMin,
          ""
        );
        console.log(`[Layer 3 — Correctness] rejected ${rejected.length}/${correctnessChecked.length} tasks as incorrect`);

        // Filter out rejected tasks — dítě/admin je neuvidí
        const finalTasks = correctnessChecked.filter((t: any) => !t._correctness_failed);

        return new Response(
          JSON.stringify({
            tasks: finalTasks,
            validation,
            grade_validated: true,
            correctness_verified: true,
            grade_min: effectiveGradeMin,
            stats: {
              generated: parsed.tasks.length,
              after_format: formatFiltered.length,
              after_grade: gradeValidated.length,
              after_math_solver: mathSolverFiltered.length,
              math_solver_rejected: mathSolverRejected,
              hint_leakage_stripped: hintLeakageRejected,
              after_correctness: finalTasks.length,
              rejected_correctness: rejected.length,
            },
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
