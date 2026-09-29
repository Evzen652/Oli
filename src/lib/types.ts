// ===== SESSION STATE MACHINE =====
export type SessionState =
  | "INIT"
  | "INPUT_CAPTURE"
  | "PRE_INTENT"
  | "TOPIC_MATCH"
  | "EXPLAIN"
  | "PRACTICE"
  | "CHECK"
  | "STOP_1"
  | "STOP_2"
  | "END";

export type Grade = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type Modality = "voice" | "text" | "mixed";

export type InputType =
  | "comparison"
  | "fraction"
  | "number"
  | "numeric_range"   // Číslo s tolerancí — fyzika, chemie, geografie
  | "select_one"
  | "drag_order"
  | "text"
  | "short_answer"    // Krátká volná odpověď s fuzzy match — humanitní předměty
  | "fill_blank"
  | "true_false"
  | "match_pairs"
  | "multi_select"
  | "categorize"
  | "table_fill"      // Doplnit prázdné buňky tabulky
  | "sequence_step"   // Seřadit kroky postupu (chemie, biologie, dějepis)
  | "image_select"      // Vyber 1 ze 4 obrázků (zeměpis, biologie)
  | "diagram_label"     // Popis bodů na obrázku (anatomie, mapa)
  | "chemical_balance"  // Vyrovnat chemickou rovnici (chemie 8.-9.)
  | "timeline"          // Seřadit historické události (dějepis)
  | "formula_builder";  // Sestavit vzorec z dílů (matematika, fyzika, chemie)

// ===== HELP DATA =====
export interface FractionBarData {
  fraction: string;       // e.g. "3/5"
  numerator: number;
  denominator: number;
}

/**
 * Obrázek k úloze (`PracticeTask.visual`). Union, aby další druhy (pravítko,
 * číselná osa, …) přibyly bez nové infrastruktury.
 */
export type TaskVisual =
  | {
      kind: "fraction_bar";
      /** Na kolik stejných dílů je celek rozdělený (jmenovatel). */
      parts: number;
      /**
       * Zabarvené díly zleva po skupinách, každá skupina jinou barvou.
       * `[3]` = 3 vybarvené díly; `[2, 3]` = sčítání 2 + 3.
       */
      groups: number[];
    }
  | {
      kind: "ruler";
      /** Úsečka nad pravítkem: začátek a konec v cm. */
      from: number;
      to: number;
      /** Délka pravítka v cm (kolik čísel je na něm vidět). */
      length: number;
    }
  | {
      kind: "number_line";
      /** Dílky od `from` do `to` po `step`. */
      from: number;
      to: number;
      step: number;
      /** Čísla, která jsou pod dílky vypsaná. Ostatní dílky jsou bez čísla. */
      labeled: number[];
      /** Dílek s otazníkem — hledané číslo. Nikdy není v `labeled`. */
      unknown?: number;
      /** Dílek zvýrazněný tečkou — číslo ze zadání, od kterého se vychází. */
      highlight?: number;
      /** Zvýrazněný úsek osy [od, do] — „které číslo leží mezi …". */
      range?: [number, number];
    }
  | {
      kind: "grid";
      /** Počet políček vodorovně a svisle. Počátek [0; 0] je levý dolní roh. */
      cols: number;
      rows: number;
      /** Vybarvené obdélníky v políčkách: [x, y, šířka, výška]. */
      fills?: [number, number, number, number][];
      /** Body na průsečících čar sítě. Jen body ZE ZADÁNÍ, nikdy odpověď. */
      points?: { x: number; y: number; label?: string }[];
      /** Osy souměrnosti na čarách sítě (svislá x = at, vodorovná y = at). */
      axes?: { dir: "vertical" | "horizontal"; at: number }[];
      /** Střed souměrnosti S. */
      center?: { x: number; y: number };
      /** Očíslovat čáry sítě (0 … cols vodorovně, 0 … rows svisle) — pro souřadnice [x; y]. */
      numbered?: boolean;
    }
  | {
      kind: "clock";
      /** Hodina 1–12 a minuta 0–59; malá ručička se posune i o minuty. */
      hour: number;
      minute: number;
    }
  | {
      kind: "thermometer";
      /**
       * Teploty ze ZADÁNÍ v °C. Jedna = sloupec rtuti; dvě = dvě značky
       * (rozdíl teplot přes nulu). Nikdy výsledek.
       */
      readings: number[];
    }
  | {
      kind: "shape";
      /**
       * Útvar kreslený v poměru skutečných délek.
       *   rectangle `sides` [délka, šířka] · square [strana]
       *   triangle [základna, levá, pravá] · cuboid [délka, hloubka, výška]
       */
      shape: "rectangle" | "square" | "triangle" | "cuboid";
      sides: number[];
      /** Popisky stran ve stejném pořadí jako `sides` („15 cm"). Jen ze ZADÁNÍ. */
      labels: string[];
    }
  | {
      kind: "protractor";
      /**
       * Skutečné směry obou ramen ve stupních, měřeno od pravé strany proti
       * směru hodinových ručiček (0 = vpravo, 180 = vlevo). Vnitřní stupnice
       * ukazuje přímo tento úhel, vnější 180 − úhel.
       */
      arms: [number, number];
      /** Písmena: vrchol, konec prvního ramene, konec druhého ramene. */
      names: [string, string, string];
    }
  | {
      kind: "bar_chart";
      title: string;
      /** Sloupce ze zadání. Hodnoty se nad sloupce nepíšou — čtou se na ose. */
      bars: { label: string; value: number }[];
    }
  | {
      kind: "table";
      title?: string;
      /** Řádky tabulky; první řádek je záhlaví, když `header` je true. */
      rows: string[][];
      header?: boolean;
    };

export interface HelpVisualExample {
  label: string;
  illustration?: string;          // fallback ASCII
  fractionBars?: FractionBarData[]; // colored visual bars
  conclusion?: string;            // e.g. "3/5 > 2/5"
}

export interface HelpData {
  hint: string;
  steps: string[];
  commonMistake: string;
  example: string;
  visualExamples?: HelpVisualExample[];
}

// ===== CONTENT REGISTRY =====
/**
 * Content generation strategy for a skill.
 * Musí odpovídat supabase/migrations/20260417120000_content_infrastructure.sql
 * a src/lib/content/taxonomy.ts.
 */
export type ContentType = "algorithmic" | "factual" | "conceptual" | "mixed";

export interface TopicMetadata {
  id: string;
  title: string;
  /**
   * Krátký česky srozumitelný název pro dětské + rodičovské UI
   * ("Násobilka", "Sčítání a odčítání do 100").
   * Musí být česky, bez anglických zkratek a technického žargonu.
   * Pokud chybí, fallback na `title`.
   */
  displayName?: string;
  /**
   * Dětské jméno podtématu pro UI (1-3 slova).
   * Pokud chybí, použije se `title` (RVP). Per-grade tone-of-voice
   * viz `src/content/grade-N/README.md`.
   */
  studentTitle?: string;
  /**
   * Konkrétní vizuální popis scény pro generování ilustrace (1–2 věty, bez abstraktních pojmů).
   * Popisuj CO JE na obrázku — ne co se dítě naučí. Konkrétní objekty, postavy, prostředí.
   * Příklad: "dítě píše příběh tužkou do sešitu, kolem knih a kelímku s pastelkami".
   * Pokud chybí, generátor sestaví popis automaticky z keywords + kategorie (horší kvalita).
   * Pište při autorování obsahu — ideálně 1 věta, max 2, bez negací.
   */
  illustrationDesc?: string;
  subject: string; // e.g. "matematika", "čeština"
  category: string; // grouping within subject, e.g. "Zlomky"
  topic: string; // grouping within category, e.g. "Porovnávání zlomků"
  briefDescription: string; // 1-2 sentence description of the subtopic/skill
  topicDescription?: string; // general description for the topic group (used when multiple subtopics exist)
  keywords: string[]; // for matching child input
  goals: string[]; // learning objectives
  boundaries: string[]; // what NOT to cover
  gradeRange: [Grade, Grade]; // min-max grade applicability
  practiceType?: "result_only" | "step_based"; // default: result_only
  defaultLevel?: number; // default difficulty level (1-3)
  sessionTaskCount?: number; // how many tasks per session (default 6)
  inputType: InputType; // determines UI component
  generator: (level: number) => PracticeTask[]; // pure function, no network
  helpTemplate: HelpData; // static help data

  // ─── Governance metadata (default: algorithmic + no prerequisites) ───
  /** Jak se obsah generuje a validuje. Default: algorithmic (zpětná kompatibilita). */
  contentType?: ContentType;
  /** Seznam code_skill_id, které musí žák umět PŘED touto dovedností (vertikální kontinuita). */
  prerequisites?: string[];
  /**
   * ID topiců, které logicky navazují po zvládnutí tohoto tématu.
   * Více variant — záleží na pedagogické volbě (hloubka vs. šíře).
   * Používá se v rodičovském reportu pro CTA "co dál".
   */
  recommendedNext?: string[];
  /** RVP kód (např. "M-5-1-03") pro reporting pokrytí kurikula. */
  rvpReference?: string;
  /**
   * Stabilní ID uzlu z RVP datasetu (`data/rvp_data.json`).
   * Formát: `g{grade}-{subject}-{area}-{topic}-{subtopic}`.
   * Slouží jako most mezi internímim `id` a kanonickým curriculum stromem.
   * Vyplňují grade-N session moduly.
   */
  rvpNodeId?: string;
  /**
   * Pedagogické štítky pro audit pipeline.
   * Přidávají se ručně nebo AI validátorem.
   * Příklady: "NEEDS_REVIEW", "MISSING_HINTS", "AI_CHECKED", "DISTRACTOR_WEAK"
   */
  auditFlag?: string[];
}

// ===== PRACTICE BATCH =====
export interface PracticeTask {
  question: string;
  correctAnswer: string;
  /**
   * Volitelné emoji zobrazené velké nad otázkou.
   * Vizuální opora hlavně pro nejmladší ročníky (1.–2. třída), které
   * čtou pomalu — obrázek pomůže pochopit kontext otázky.
   * Příklad: "🐄" u otázky o krávě, "🌷" u jarní rostliny.
   * Renderuje SessionView (question card).
   */
  emoji?: string;
  /**
   * Obrázek k úloze, který nahrazuje popis („obdélník rozdělený na 4 díly")
   * skutečným obrázkem. Generátor sem vkládá čísla, která už stejně má;
   * kreslí ho `TaskVisual`. Otisk zámku obsahu ho nezahrnuje.
   */
  visual?: TaskVisual;
  options?: string[]; // for select_one / true_false
  items?: string[]; // for drag_order (correct order)
  solutionSteps?: string[]; // specific step-by-step solution for this task (matematika)
  explanation?: string;     // proč je odpověď správná — pro humanitní předměty místo solutionSteps
  /**
   * Cílený diagnostický feedback per zvolená možnost.
   * Klíč = přesný text možnosti (shodný s `options`/`correctAnswer`),
   * hodnota = krátké vysvětlení TÉ konkrétní chyby ("Vybral jsi obvod, ne obsah").
   * Při chybě dostane přednost před obecným `explanation` (fallback).
   * Smysl jen u výběrových typů: select_one / true_false / multi_select.
   * Vazba na obsah: generátor s chybovým modelem distraktorů ho plní rovnou
   * (ví, že distraktor X = "spočítal obvod" → feedback je skoro zdarma).
   */
  optionFeedback?: Record<string, string>;
  hints?: string[];          // progressive hints (guide without revealing answer)
  blanks?: string[];         // for fill_blank (correct answers for each blank)
  pairs?: { left: string; right: string }[]; // for match_pairs
  categories?: { name: string; items: string[] }[]; // for categorize
  correctAnswers?: string[]; // for multi_select
  /** for image_select — pole 4 obrázků s URL a alt textem */
  imageOptions?: { url: string; alt: string; id: string }[];
  /** for diagram_label — pozadí + body k popisu */
  diagram?: {
    imageUrl: string;
    imageAlt: string;
    /** Body s relativní pozicí (0-1) v rámci obrázku */
    points: { x: number; y: number; id: string }[];
    /** Pool labelů které žák přiřazuje (random shuffled) */
    labelPool: string[];
  };
  /**
   * for chemical_balance — žák doplňuje koeficienty rovnice.
   * tokens: prokládaný array — sudé indexy = vzorce/operátory ("H2O", "+", "="),
   * liché indexy nebo isCoefficient flag = pole pro doplnění koeficientu.
   */
  chemEquation?: {
    /** Tokens v pořadí. Označené jako koeficient = žák doplňuje. */
    tokens: { value: string; isCoefficient: boolean }[];
  };
  /** for timeline — pool událostí v náhodném pořadí (žák seřadí) */
  timelineEvents?: { id: string; label: string }[];
  /** for formula_builder — pool dílů, žák sestaví ve správném pořadí */
  formulaPool?: { id: string; token: string }[];
}

// ===== RULE ENGINE =====
export interface SessionRules {
  maxDurationSeconds: number;
  modality: Modality;
  maxErrorRepetitions: number;
}

// ===== SESSION =====
export interface SessionData {
  id: string;
  state: SessionState;
  grade: Grade;
  startTime: number;
  elapsedSeconds: number;
  matchedTopic: TopicMetadata | null;
  childInput: string;
  errorCount: number;
  confusionCount: number;
  stopReason: string | null;
  rules: SessionRules;
  practiceBatch: PracticeTask[];
  currentTaskIndex: number;
  errorStreak: number;
  successStreak: number;
  usedQuestions: string[]; // deduplication: already used question strings
  helpUsedCount: number; // count of tasks where help was opened before answering
  helpUsedOnCurrent: boolean; // whether help was opened for the current task
  currentLevel: number; // adaptive difficulty level (1-3)
  adaptiveHelpOffered: boolean; // adaptive engine suggested offering help
  /**
   * Pre-fetched active misconception confidence (0-1) pro matchedTopic.skill.
   * Naplňuje se při TOPIC_MATCH transition (jednou per topic, ne per task),
   * aby orchestrator mohl synchronně předat do adaptive engine bez DB volání
   * v realtime loop.
   */
  misconceptionConfidence?: number;
  /**
   * Výkon žáka v tomto sezení (0–1). Vypočítá se na konci sezení přes calcSessionScore().
   * Slouží jako vstup pro computeNextLevel() a uložení do student_skill_level.
   */
  sessionScore?: number;
  /** Stav úrovně tématu načtený na začátku sezení (DB / localStorage). */
  levelState?: { level: number; consecutiveGood: number; consecutiveBad: number; lastScore: number };
  /** Komu stav patří: ID přihlášeného uživatele, `null` = anonymní dítě. */
  levelOwner?: string | null;
  /** Nejvyšší úroveň, kterou téma má (`maxAvailableLevel`), spočtená na začátku. */
  maxLevel?: number;
  /**
   * Výsledek postupu spočítaný na konci sezení. Čte ho shrnutí, aby slibovalo
   * „těžší úlohy" jen tehdy, když se úroveň opravdu zvedla.
   */
  levelResult?: { direction: "up" | "down" | "same"; newLevel: number; consecutiveGood: number; maxLevel: number };
}

// ===== AI EXECUTION (mock) =====
export interface AIRequest {
  type: "explain" | "practice" | "check";
  topic: TopicMetadata;
  grade: Grade;
  childInput: string;
  previousErrors: number;
}

export interface AIResponse {
  content: string;
  practiceQuestion?: string;
  isCorrect?: boolean;
}

// ===== LOGGING =====
export interface AuditLogEntry {
  timestamp: number;
  sessionId: string;
  topicId: string | null;
  sessionState: SessionState;
  stopReason: string | null;
  durationSeconds: number;
  modality: Modality;
  boundaryViolation: boolean;
}

// ===== HELPERS =====
/** Full display title: "Porovnávání zlomků s různým jmenovatelem" instead of just "S různým jmenovatelem" */
export function getFullTopicTitle(topic: TopicMetadata): string {
  const title = topic.title ?? "";
  const topicName = topic.topic ?? "";
  if (!title || topicName === title) return title || topicName;
  // Lowercase first char of subtitle when appending
  const sub = title.charAt(0).toLowerCase() + title.slice(1);
  return `${topicName} – ${sub}`;
}
