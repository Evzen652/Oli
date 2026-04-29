import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, RefreshCw, Download, Eye, Check, Trash2, RotateCw, X } from "lucide-react";
import { PracticeInputRouter } from "@/components/PracticeInputRouter";
import { hasCodeGenerator } from "@/hooks/useDbCurriculum";
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { friendlyEdgeFunctionError } from "@/lib/edgeFunctionError";

// ══════════════════════════════════════════════════════
// Types
// ══════════════════════════════════════════════════════
export interface AITask {
  question: string;
  correct_answer: string;
  hints?: string[];
  solution_steps?: string[];
  options?: string[];
  _grade_validated?: boolean;
  _grade_rewritten?: boolean;
}

export type ExerciseVariant = "simple" | "advanced" | "expert";

// ══════════════════════════════════════════════════════
// Variant configuration
// ══════════════════════════════════════════════════════
interface VariantConfig {
  source: ExerciseVariant;
  emoji: string;
  levelLabel: string;            // "Základní (Level I)"
  shortLabel: string;            // "základní" / "pokročilá" / "expertní"
  levelCalc: (skill: TopicMetadata) => number;
  defaultPrompt: string;
  reformulatePrompt: (task: AITask) => string;
  description: string;
  placeholder: string;
  loadingText: string;
  showGenerator: boolean;        // show code-generator samples (only simple)
  color: {
    dashed: string;              // dashed container (generate box)
    saved: string;               // saved-exercises container
    task: string;                // AI task card
    taskBorder: string;          // task card inner border
    icon: string;                // sparkles / icon color
    generateBtn: string;         // primary generate button extra classes
    reformulateText: string;     // reformulate ghost button
    badge: string;               // level pill on task card
  };
}

const VARIANTS: Record<ExerciseVariant, VariantConfig> = {
  simple: {
    source: "simple",
    emoji: "📗",
    levelLabel: "Základní (Level I)",
    shortLabel: "základní",
    levelCalc: (s) => s.defaultLevel ?? 1,
    defaultPrompt:
      "Vygeneruj jednoduché, přímočaré úlohy na procvičení základní dovednosti. Žádné chytáky, žádné aplikační úlohy — čistý dril. Základní příklady, které žák řeší rutinně.",
    reformulatePrompt: (t) =>
      `Přeformuluj tuto otázku úplně jinak, zachovej stejné téma a základní obtížnost, ale změň formulaci. Původní otázka: "${t.question}" (správná odpověď: ${t.correct_answer})`,
    description:
      "📗 Základní úlohy na dril — přímočaré, bez chytáků. Uložené úlohy se zobrazí žákům.",
    placeholder:
      'Např. "zaměř se na přechod přes desítku" nebo nechte prázdné pro výchozí.',
    loadingText: "Generuji základní úlohy…",
    showGenerator: true,
    color: {
      dashed: "border-green-200 bg-green-50/30",
      saved: "border-green-200 bg-green-50/20",
      task: "border-green-200 bg-green-50/30",
      taskBorder: "border-green-100",
      icon: "text-green-500",
      generateBtn: "bg-green-600 hover:bg-green-700 text-white",
      reformulateText: "text-green-600 hover:text-green-700 hover:bg-green-50",
      badge: "bg-green-100 text-green-700 border-green-200",
    },
  },
  advanced: {
    source: "advanced",
    emoji: "📘",
    levelLabel: "Pokročilá (Level II)",
    shortLabel: "pokročilá",
    levelCalc: (s) => s.defaultLevel ?? 1,
    defaultPrompt:
      "Vygeneruj otázky, které jsou ODLIŠNÉ od standardních učebnicových otázek. Buď kreativní — použij praktické situace z běžného života, neobvyklé příklady, aplikační a logické úlohy. Žák by měl vidět něco nového, co ho překvapí.",
    reformulatePrompt: (t) =>
      `Přeformuluj tuto otázku úplně jinak, zachovej stejné téma a obtížnost ale změň kontext a formulaci. Původní otázka: "${t.question}" (správná odpověď: ${t.correct_answer})`,
    description:
      "📘 Kreativní, aplikační úlohy z reálného světa — neobvyklé příklady, které žáka překvapí a rozvíjí hlubší porozumění. Uložené úlohy se zobrazí žákům.",
    placeholder:
      'Např. "5 příkladů na sčítání do 1000 s přechodem přes desítku" nebo nechte prázdné pro výchozí.',
    loadingText: "AI přemýšlí nad novými otázkami…",
    showGenerator: false,
    color: {
      dashed: "border-purple-200 bg-purple-50/30",
      saved: "border-purple-200 bg-purple-50/20",
      task: "border-purple-200 bg-purple-50/30",
      taskBorder: "border-purple-100",
      icon: "text-purple-500",
      generateBtn: "",
      reformulateText: "text-purple-600 hover:text-purple-700 hover:bg-purple-50",
      badge: "bg-purple-100 text-purple-700 border-purple-200",
    },
  },
  expert: {
    source: "expert",
    emoji: "📕",
    levelLabel: "Vysoká obtížnost (Level III)",
    shortLabel: "expertní",
    levelCalc: (s) => Math.min((s.defaultLevel ?? 1) + 1, 3),
    defaultPrompt:
      "Vygeneruj NEJTĚŽŠÍ možné úlohy pro toto téma. Úlohy musí být vícekrokové, kombinovat více konceptů a vyžadovat hluboké porozumění. Zahrň netriviální aplikace, úlohy s více mezikroky, chytáky a situace kde žák musí analyzovat problém z neobvyklého úhlu. Obtížnost musí být výrazně vyšší než u pokročilých cvičení.",
    reformulatePrompt: (t) =>
      `Přeformuluj tuto otázku úplně jinak, zachovej stejné téma ale zvyš obtížnost na maximum. Původní otázka: "${t.question}" (správná odpověď: ${t.correct_answer})`,
    description:
      "📕 Nejtěžší úlohy — vícekrokové, kombinující více konceptů, vyžadující hluboké porozumění a analytické myšlení. Uložené úlohy se zobrazí žákům.",
    placeholder:
      'Např. "vícekrokové úlohy kombinující zlomky a procenta" nebo nechte prázdné pro výchozí.',
    loadingText: "AI přemýšlí nad nejtěžšími otázkami…",
    showGenerator: false,
    color: {
      dashed: "border-red-200 bg-red-50/30",
      saved: "border-red-200 bg-red-50/20",
      task: "border-red-200 bg-red-50/30",
      taskBorder: "border-red-100",
      icon: "text-red-500",
      generateBtn: "bg-red-600 hover:bg-red-700 text-white",
      reformulateText: "text-red-600 hover:text-red-700 hover:bg-red-50",
      badge: "bg-red-100 text-red-700 border-red-200",
    },
  },
};

// ══════════════════════════════════════════════════════
// Exercise input preview (used by TaskCard)
// ══════════════════════════════════════════════════════
function ExerciseInputPreview({ task, skill }: { task: PracticeTask; skill?: TopicMetadata }) {
  const dummyTopic: TopicMetadata =
    skill ?? {
      id: "", title: "", subject: "", category: "", topic: "", briefDescription: "",
      keywords: [], goals: [], boundaries: [], gradeRange: [3, 3],
      inputType: "text", generator: () => [],
      helpTemplate: { hint: "", steps: [], commonMistake: "", example: "" },
    };
  return (
    <div className="pointer-events-none opacity-80 scale-[0.85] origin-top-left max-w-[340px]">
      <PracticeInputRouter
        topic={dummyTopic}
        currentTask={task}
        userInput=""
        loading={false}
        onUserInputChange={() => {}}
        onAnswerSubmit={() => {}}
        onTextSubmit={() => {}}
      />
    </div>
  );
}

// ══════════════════════════════════════════════════════
// TaskCard — preview of a single task (code-gen or AI)
// ══════════════════════════════════════════════════════
function TaskCard({
  index, task, help, isAI, skill,
}: {
  index: number;
  task: PracticeTask | AITask;
  help?: TopicMetadata["helpTemplate"];
  isAI?: boolean;
  skill?: TopicMetadata;
}) {
  const [showPreview, setShowPreview] = useState(false);
  const question = task.question;
  const correctAnswer =
    "correctAnswer" in task ? task.correctAnswer : (task as AITask).correct_answer;
  const hints = "hints" in task ? task.hints : undefined;
  const solutionSteps =
    "solutionSteps" in task
      ? task.solutionSteps
      : "solution_steps" in task
      ? (task as AITask).solution_steps
      : undefined;
  const options = task.options;
  const items = "items" in task ? (task as PracticeTask).items : undefined;

  const practiceTask: PracticeTask = {
    question,
    correctAnswer,
    options,
    items,
    hints: hints as string[] | undefined,
    solutionSteps: solutionSteps as string[] | undefined,
    blanks: "blanks" in task ? (task as PracticeTask).blanks : undefined,
    pairs: "pairs" in task ? (task as PracticeTask).pairs : undefined,
    categories: "categories" in task ? (task as PracticeTask).categories : undefined,
  };

  return (
    <div className={`rounded-lg border p-4 space-y-2 ${isAI ? "border-purple-200 bg-purple-50/30" : ""}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="font-medium text-foreground">
            <span className="text-muted-foreground text-xs mr-2">#{index + 1}</span>
            {question}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowPreview(!showPreview)}
            className="gap-1 text-xs h-7 text-muted-foreground hover:text-foreground"
          >
            <Eye className="h-3 w-3" />
            {showPreview ? "Skrýt náhled" : "Náhled žáka"}
          </Button>
          <Badge className="bg-green-100 text-green-800 border-green-200">
            ✓ {correctAnswer}
          </Badge>
        </div>
      </div>

      {showPreview && (
        <div className="mt-2 rounded-xl border-2 border-blue-200 bg-blue-50/30 p-4 space-y-2">
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">👁️ Náhled — jak to vidí žák</p>
          <div className="rounded-lg bg-background p-3 border">
            <p className="text-lg font-medium text-foreground mb-3">{question}</p>
            <ExerciseInputPreview task={practiceTask} skill={skill} />
          </div>
        </div>
      )}

      {options && options.length > 0 && !showPreview && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Možnosti</p>
          <div className="flex flex-wrap gap-1.5">
            {options.map((opt, j) => (
              <Badge
                key={j}
                variant={opt === correctAnswer ? "default" : "outline"}
                className={opt === correctAnswer ? "bg-green-100 text-green-800 border-green-200" : ""}
              >
                {opt}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {items && items.length > 0 && !showPreview && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Správné pořadí</p>
          <div className="flex flex-wrap gap-1.5">
            {items.map((item, j) => (
              <Badge key={j} variant="outline" className="text-xs">{j + 1}. {item}</Badge>
            ))}
          </div>
        </div>
      )}

      {hints && hints.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nápovědy</p>
          <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-0.5">
            {hints.map((h, j) => <li key={j}>{h}</li>)}
          </ol>
        </div>
      )}

      <div className="mt-3 rounded-xl border-2 border-green-200 bg-green-50/50 p-4 space-y-2">
        <p className="text-xs font-semibold text-green-700 uppercase tracking-wider">👁️ Odpověď pro žáka</p>
        <p className="text-sm text-foreground">
          Správná odpověď: <span className="font-bold">{correctAnswer}</span>
        </p>
        {solutionSteps && solutionSteps.length > 0 ? (
          <>
            <p className="text-xs font-semibold text-foreground">Postup řešení:</p>
            <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-0.5">
              {solutionSteps.map((s, j) => <li key={j}>{s}</li>)}
            </ol>
          </>
        ) : help ? (
          <>
            {help.hint && (
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Postup:</span> {help.hint}
              </p>
            )}
            {help.steps && help.steps.length > 0 && (
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-0.5">
                {help.steps.map((s, j) => <li key={j}>{s}</li>)}
              </ol>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// Saved exercises list (from DB)
// ══════════════════════════════════════════════════════
type ExerciseStatus = "pending" | "approved" | "rejected";

function SavedExercisesList({
  skillId, source, colorClass, label, onCountsChanged, refreshTrigger,
}: {
  skillId: string;
  source: ExerciseVariant;
  colorClass: string;
  label: string;
  onCountsChanged?: () => void;
  /** Externí trigger pro refetch po save/delete/status změně v ExerciseTab */
  refreshTrigger?: number;
}) {
  const [saved, setSaved] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ExerciseStatus>("pending");
  const { toast } = useToast();

  const fetchSaved = async () => {
    setLoading(true);
    const sourceFilter =
      source === "advanced" ? ["advanced", "ai"] : source === "expert" ? ["expert"] : [source];
    const { data, error } = await (supabase as any)
      .from("custom_exercises")
      .select("*")
      .eq("skill_id", skillId)
      .in("source", sourceFilter)
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (!error && data) setSaved(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSaved();
  }, [skillId, source, refreshTrigger]);

  // Smart default: vyber tab, který má nějaké položky (preferuje pending)
  useEffect(() => {
    if (saved.length === 0) return;
    const counts = {
      pending: saved.filter((e) => e.status === "pending").length,
      approved: saved.filter((e) => e.status === "approved").length,
      rejected: saved.filter((e) => e.status === "rejected").length,
    };
    if (counts.pending > 0) setStatusFilter("pending");
    else if (counts.approved > 0) setStatusFilter("approved");
    else setStatusFilter("rejected");
  }, [saved]);

  const updateStatus = async (id: string, newStatus: ExerciseStatus) => {
    const { error } = await (supabase as any)
      .from("custom_exercises")
      .update({ status: newStatus })
      .eq("id", id);
    if (error) {
      toast({ description: `Nepodařilo se: ${error.message}`, variant: "destructive" });
      return;
    }
    setSaved((prev) => prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e)));
    const labels: Record<ExerciseStatus, string> = {
      approved: "Schváleno ✓ (žáci uvidí)",
      rejected: "Odmítnuto",
      pending: "Vráceno k revizi",
    };
    toast({ description: labels[newStatus] });
    onCountsChanged?.();
  };

  const handleDeletePermanently = async (id: string) => {
    const { error } = await (supabase as any)
      .from("custom_exercises")
      .update({ is_active: false })
      .eq("id", id);
    if (error) {
      toast({ description: "Nepodařilo se smazat.", variant: "destructive" });
    } else {
      setSaved((prev) => prev.filter((e) => e.id !== id));
      toast({ description: "Smazáno ✓" });
      onCountsChanged?.();
    }
  };

  if (loading) return <p className="text-sm text-muted-foreground py-2">Načítám uložená cvičení…</p>;
  if (saved.length === 0) return null;

  const counts = {
    pending: saved.filter((e) => e.status === "pending").length,
    approved: saved.filter((e) => e.status === "approved").length,
    rejected: saved.filter((e) => e.status === "rejected").length,
  };
  const filtered = saved.filter((e) => e.status === statusFilter);

  // Vizuální tone podle aktuálního statusu
  const statusToneMap: Record<ExerciseStatus, string> = {
    pending: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",
    approved: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800",
    rejected: "bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800",
  };
  const statusBadgeMap: Record<ExerciseStatus, { text: string; cls: string }> = {
    pending:  { text: "⏳ Čeká na schválení", cls: "bg-amber-100 text-amber-800 border-amber-200" },
    approved: { text: "✅ Schváleno",         cls: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    rejected: { text: "❌ Odmítnuto",         cls: "bg-rose-100 text-rose-800 border-rose-200" },
  };

  return (
    <div className="space-y-3 mt-6">
      <h5 className="text-sm font-semibold text-foreground">
        {label} ({saved.length})
      </h5>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-1.5 border-b pb-2">
        {(["pending", "approved", "rejected"] as ExerciseStatus[]).map((s) => {
          const isActive = statusFilter === s;
          const meta = statusBadgeMap[s];
          return (
            <Button
              key={s}
              size="sm"
              variant={isActive ? "default" : "ghost"}
              onClick={() => setStatusFilter(s)}
              className="h-7 px-2.5 text-xs gap-1.5"
              disabled={counts[s] === 0}
            >
              <span>{meta.text.split(" ")[0]}</span>
              <span>{s === "pending" ? "Čeká" : s === "approved" ? "Schváleno" : "Odmítnuto"}</span>
              <Badge variant="outline" className="text-[10px] h-4 px-1 ml-0.5 font-mono">
                {counts[s]}
              </Badge>
            </Button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground italic py-3 text-center">
          {statusFilter === "pending" && "Žádné návrhy nečekají na schválení."}
          {statusFilter === "approved" && "Zatím nic neschváleno."}
          {statusFilter === "rejected" && "Žádné odmítnuté."}
        </p>
      ) : (
        filtered.map((ex) => {
          const status: ExerciseStatus = (ex.status as ExerciseStatus) ?? "pending";
          const tone = statusToneMap[status];
          const badge = statusBadgeMap[status];
          return (
            <div key={ex.id} className={`rounded-lg border ${tone} p-4 space-y-2`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{ex.question}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge className={`${badge.cls} text-[10px] whitespace-nowrap`}>
                    {badge.text}
                  </Badge>
                </div>
              </div>
              {ex.options && ex.options.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {ex.options.map((opt: string, j: number) => (
                    <Badge
                      key={j}
                      variant={opt === ex.correct_answer ? "default" : "outline"}
                      className={opt === ex.correct_answer ? "bg-emerald-100 text-emerald-800 border-emerald-200" : ""}
                    >
                      {opt}
                    </Badge>
                  ))}
                </div>
              )}
              {Array.isArray(ex.hints) && (ex.hints as string[]).length > 0 && (
                <div className="text-sm space-y-1 text-muted-foreground italic">
                  {(ex.hints as string[]).map((h: string, i: number) => (
                    <p key={i}>💡 Nápověda {i + 1}: {h}</p>
                  ))}
                </div>
              )}
              <div className="mt-2 p-3 bg-background/60 rounded-lg border border-border/50 space-y-1">
                <p className="font-bold text-emerald-800 dark:text-emerald-400 text-sm">Odpověď pro žáka:</p>
                <p className="font-medium text-sm text-foreground">{ex.correct_answer}</p>
                {Array.isArray(ex.solution_steps) && (ex.solution_steps as string[]).length > 0 && (
                  <div className="text-sm text-foreground/80 space-y-0.5 mt-1">
                    <p className="font-semibold">Postup:</p>
                    <ol className="list-decimal list-inside">
                      {(ex.solution_steps as string[]).map((step: string, i: number) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>

              {/* Akce podle aktuálního statusu */}
              <div className="flex flex-wrap items-center justify-end gap-1.5 pt-1">
                {status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => updateStatus(ex.id, "approved")}
                      className="gap-1 text-xs h-7 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Check className="h-3 w-3" /> Schválit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(ex.id, "rejected")}
                      className="gap-1 text-xs h-7"
                    >
                      <X className="h-3 w-3" /> Odmítnout
                    </Button>
                  </>
                )}
                {status === "approved" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => updateStatus(ex.id, "pending")}
                    className="gap-1 text-xs h-7 text-amber-700 hover:text-amber-800 hover:bg-amber-100"
                  >
                    <RotateCw className="h-3 w-3" /> Vrátit k revizi
                  </Button>
                )}
                {status === "rejected" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => updateStatus(ex.id, "pending")}
                    className="gap-1 text-xs h-7 text-amber-700 hover:text-amber-800 hover:bg-amber-100"
                  >
                    <RotateCw className="h-3 w-3" /> Vrátit k revizi
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeletePermanently(ex.id)}
                  className="gap-1 text-xs h-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                  title="Trvale smazat (neoznačit jen jako odmítnuté)"
                >
                  <Trash2 className="h-3 w-3" /> Smazat
                </Button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════
// AI task row with Save/Delete/Reformulate actions
// ══════════════════════════════════════════════════════
function AITaskRow({
  index, task, config, saving, savedIndices, reformulatingIndex,
  onSave, onDelete, onReformulate, allowReformulate,
}: {
  index: number;
  task: AITask;
  config: VariantConfig;
  saving: boolean;
  savedIndices: Set<number>;
  reformulatingIndex: number | null;
  onSave: (task: AITask, i: number) => void;
  onDelete: (i: number) => void;
  onReformulate: (task: AITask, i: number) => void;
  allowReformulate: boolean;
}) {
  return (
    <div className={`rounded-lg border ${config.color.task} overflow-hidden`}>
      <div className="flex justify-end gap-1 px-4 pt-3">
        {task._grade_rewritten && (
          <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px]">
            🔄 Přeformulováno
          </Badge>
        )}
        {(task._grade_validated || task._grade_rewritten) && (
          <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px]">
            ✅ Ověřeno pro ročník
          </Badge>
        )}
        <Badge className={`${config.color.badge} text-[10px]`}>
          {config.emoji} {config.shortLabel.charAt(0).toUpperCase() + config.shortLabel.slice(1)}
        </Badge>
      </div>
      <TaskCard index={index} task={task} isAI={config.source !== "simple"} />
      <div className={`flex items-center justify-end gap-1 px-4 pb-3 pt-1 border-t ${config.color.taskBorder}`}>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDelete(index)}
          disabled={saving}
          className="gap-1 text-xs h-7 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-3 w-3" /> Smazat
        </Button>
        {allowReformulate && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onReformulate(task, index)}
            disabled={saving || reformulatingIndex === index}
            className={`gap-1 text-xs h-7 ${config.color.reformulateText}`}
          >
            <RotateCw className={`h-3 w-3 ${reformulatingIndex === index ? "animate-spin" : ""}`} /> Přeformulovat
          </Button>
        )}
        <Button
          size="sm"
          variant={savedIndices.has(index) ? "secondary" : "outline"}
          onClick={() => onSave(task, index)}
          disabled={saving || savedIndices.has(index)}
          className="gap-1 text-xs h-7"
        >
          {savedIndices.has(index) ? (
            <><Check className="h-3 w-3" /> Uloženo</>
          ) : (
            <><Download className="h-3 w-3" /> Uložit</>
          )}
        </Button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// Main unified ExerciseTab
// ══════════════════════════════════════════════════════
export function ExerciseTab({
  skill, variant, onCountsChanged,
}: {
  skill: TopicMetadata;
  variant: ExerciseVariant;
  /** Volá se po uložení/smazání cvičení — rodič refetchne tab counts */
  onCountsChanged?: () => void;
}) {
  const config = VARIANTS[variant];
  const { toast } = useToast();
  const hasGenerator = variant === "simple" && hasCodeGenerator(skill);
  const help = skill.helpTemplate;

  const [prompt, setPrompt] = useState("");
  const [aiTasks, setAiTasks] = useState<AITask[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedIndices, setSavedIndices] = useState<Set<number>>(new Set());
  const [reformulatingIndex, setReformulatingIndex] = useState<number | null>(null);
  // Trigger pro re-fetch SavedExercisesList po save/delete/status change
  const [savedListRefresh, setSavedListRefresh] = useState(0);
  const refreshSavedList = () => setSavedListRefresh((n) => n + 1);

  // Code-generator samples (simple only)
  const [genTasks, setGenTasks] = useState<PracticeTask[]>([]);
  const [regenCount, setRegenCount] = useState(0);

  useEffect(() => {
    if (!hasGenerator) return;
    try {
      const level = skill.defaultLevel ?? 1;
      const all = skill.generator(level);
      const shuffled = [...all].sort(() => Math.random() - 0.5);
      setGenTasks(shuffled);
      setRegenCount((c) => c + 1);
    } catch {
      setGenTasks([]);
    }
  }, [skill.id, hasGenerator]);

  // Reset per-skill state
  useEffect(() => {
    setAiTasks([]);
    setSavedIndices(new Set());
    setPrompt("");
    setError(null);
  }, [skill.id]);

  const generate = async (replace: boolean) => {
    setLoading(true);
    setError(null);
    if (replace) setAiTasks([]);
    try {
      const { data, error: err } = await supabase.functions.invoke("ai-tutor", {
        body: {
          skill_label: skill.title,
          practice_type: skill.inputType || "result_only",
          current_level: config.levelCalc(skill),
          phase: "practice_batch",
          batch_size: 5,
          grade_min: skill.gradeRange[0],
          admin_prompt: prompt || config.defaultPrompt,
          subject: skill.subject,
          category: skill.category,
          topic: skill.topic,
        },
      });
      if (err) {
        setError(await friendlyEdgeFunctionError(err, "ai-tutor"));
        return;
      }
      if (data?.error) {
        setError(data.error);
        return;
      }
      if (data?.tasks) {
        setAiTasks((prev) => (replace ? data.tasks : [...prev, ...data.tasks]));
      }
    } catch (e: any) {
      setError(e?.message || `Nepodařilo se vygenerovat ${config.shortLabel} cvičení.`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTask = async (task: AITask, index: number) => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      // status: 'pending' — admin musí explicitně schválit, než to žáci uvidí
      const { error: err } = await (supabase as any).from("custom_exercises").insert({
        skill_id: skill.id,
        question: task.question,
        correct_answer: task.correct_answer,
        hints: task.hints || [],
        solution_steps: task.solution_steps || [],
        options: task.options || [],
        source: config.source,
        status: "pending",
      });
      if (err) throw err;
      setSavedIndices((prev) => new Set([...prev, index]));
      toast({ description: "Uloženo do návrhů — schvalte v sekci níže ✓" });
      onCountsChanged?.();
      refreshSavedList();
    } catch (e: any) {
      toast({ description: e?.message || "Nepodařilo se uložit.", variant: "destructive" });
    }
    setSaving(false);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      // Pozn: created_by není v aktuálním DB schématu — vynecháno
      const rows = aiTasks.map((task) => ({
        skill_id: skill.id,
        question: task.question,
        correct_answer: task.correct_answer,
        hints: task.hints || [],
        solution_steps: task.solution_steps || [],
        options: task.options || [],
        source: config.source,
        status: "pending" as const,
      }));
      const { error: err } = await (supabase as any).from("custom_exercises").insert(rows);
      if (err) throw err;
      setSavedIndices(new Set(aiTasks.map((_, i) => i)));
      toast({ description: `Uloženo ${aiTasks.length} ${config.shortLabel} návrhů — schvalte níže ✓` });
      onCountsChanged?.();
      refreshSavedList();
    } catch (e: any) {
      toast({ description: e?.message || "Nepodařilo se uložit.", variant: "destructive" });
    }
    setSaving(false);
  };

  const handleDelete = (index: number) => {
    const updated = aiTasks.filter((_, i) => i !== index);
    setAiTasks(updated);
    const newSaved = new Set<number>();
    savedIndices.forEach((si) => {
      if (si < index) newSaved.add(si);
      else if (si > index) newSaved.add(si - 1);
    });
    setSavedIndices(newSaved);
    toast({ description: "Otázka odstraněna" });
  };

  const handleReformulate = async (task: AITask, index: number) => {
    setReformulatingIndex(index);
    try {
      const { data, error: err } = await supabase.functions.invoke("ai-tutor", {
        body: {
          skill_label: task.question.slice(0, 50),
          practice_type: "result_only",
          current_level: config.levelCalc(skill),
          phase: "practice_batch",
          batch_size: 1,
          grade_min: skill.gradeRange[0] ?? 3,
          admin_prompt: config.reformulatePrompt(task),
          subject: skill.subject,
          category: skill.category,
          topic: skill.topic,
        },
      });
      if (err) {
        toast({
          description: await friendlyEdgeFunctionError(err, "ai-tutor"),
          variant: "destructive",
        });
        return;
      }
      if (data?.tasks?.[0]) {
        const updated = [...aiTasks];
        updated[index] = data.tasks[0];
        setAiTasks(updated);
        const newSaved = new Set(savedIndices);
        newSaved.delete(index);
        setSavedIndices(newSaved);
        toast({ description: "Otázka přeformulována ✓" });
      }
    } catch (e: any) {
      toast({ description: e?.message || "Nepodařilo se přeformulovat.", variant: "destructive" });
    } finally {
      setReformulatingIndex(null);
    }
  };

  const allowReformulate = variant !== "simple";
  const allSaved = aiTasks.length > 0 && savedIndices.size === aiTasks.length;

  return (
    <div className="space-y-3">
      {/* Header / description */}
      <div className="rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
        <p>
          {config.description}
          {hasGenerator ? " Šablona vytváří variace automaticky." : ""}
        </p>
      </div>

      {/* AI generator box */}
      <div className={`rounded-lg border-2 border-dashed ${config.color.dashed} p-4 space-y-3`}>
        <h5 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Sparkles className={`h-4 w-4 ${config.color.icon}`} />
          {config.emoji} Generovat {config.shortLabel} cvičení ({config.levelLabel}) pomocí AI
        </h5>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={config.placeholder}
          className="min-h-[60px] text-sm"
        />
        <Button
          size="sm"
          onClick={() => generate(aiTasks.length === 0)}
          disabled={loading}
          className={`gap-1 ${config.color.generateBtn}`}
        >
          <Sparkles className="h-3 w-3" />
          {loading
            ? "Generuji…"
            : aiTasks.length > 0
            ? `+ Další ${config.shortLabel}`
            : `Generovat ${config.shortLabel}`}
        </Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-2 justify-center">
          <RefreshCw className="h-4 w-4 animate-spin" /> {config.loadingText}
        </div>
      )}

      {/* Code-generator sample preview (simple only) */}
      {hasGenerator && genTasks.length > 0 && (
        <div className="space-y-3">
          <h5 className="text-sm font-semibold text-muted-foreground">
            {config.emoji} Ukázky ze šablony ({genTasks.length})
          </h5>
          {genTasks.map((task, i) => (
            <TaskCard key={`${regenCount}-${i}`} index={i} task={task} help={help} skill={skill} />
          ))}
        </div>
      )}

      {/* AI-generated tasks list */}
      {aiTasks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h5 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Sparkles className={`h-4 w-4 ${config.color.icon}`} />
              {config.emoji} {config.levelLabel.split(" (")[0]} cvičení – {config.levelLabel.match(/\(([^)]+)\)/)?.[1] ?? ""}
              ({aiTasks.length})
            </h5>
            <Button
              size="sm"
              variant="outline"
              onClick={handleSaveAll}
              disabled={saving || allSaved}
              className="gap-1"
            >
              <Download className="h-3 w-3" />
              {allSaved ? "Vše uloženo ✓" : "Uložit vše do DB"}
            </Button>
          </div>
          {aiTasks.map((task, i) => (
            <AITaskRow
              key={`${config.source}-${i}`}
              index={i}
              task={task}
              config={config}
              saving={saving}
              savedIndices={savedIndices}
              reformulatingIndex={reformulatingIndex}
              onSave={handleSaveTask}
              onDelete={handleDelete}
              onReformulate={handleReformulate}
              allowReformulate={allowReformulate}
            />
          ))}
        </div>
      )}

      {/* Saved exercises from DB */}
      <SavedExercisesList
        skillId={skill.id}
        source={config.source}
        colorClass={config.color.saved}
        label={`${config.emoji} Uložená ${config.shortLabel} cvičení (${config.levelLabel.match(/\(([^)]+)\)/)?.[1] ?? ""})`}
        onCountsChanged={onCountsChanged}
        refreshTrigger={savedListRefresh}
      />
    </div>
  );
}
