import { useState, useEffect } from "react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Pencil, Save, ChevronDown, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { ExerciseTab } from "@/components/admin/ExerciseTab";
import { AssetPicker } from "@/components/admin/AssetPicker";
import { hasCodeGenerator } from "@/hooks/useDbCurriculum";
import { Image as ImageIcon } from "lucide-react";
import type { TopicMetadata } from "@/lib/types";

const INPUT_TYPE_LABELS: Record<string, string> = {
  select_one: "Výběr odpovědi",
  comparison: "Porovnání",
  fraction: "Zlomek",
  drag_order: "Řazení",
  fill_blank: "Doplňování",
  match_pairs: "Přiřazování",
  multi_select: "Více odpovědí",
  categorize: "Třídění",
  text: "Textová odpověď",
  number: "Číslo",
};

export function SkillDetail({ skill }: { skill: TopicMetadata }) {
  const help = skill.helpTemplate;
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  // Per-level rozpis stavů (approved = žáci vidí, pending = čeká na admina)
  const [exerciseCounts, setExerciseCounts] = useState<{
    simple: { approved: number; pending: number };
    advanced: { approved: number; pending: number };
    expert: { approved: number; pending: number };
  }>({
    simple: { approved: 0, pending: 0 },
    advanced: { approved: 0, pending: 0 },
    expert: { approved: 0, pending: 0 },
  });
  // Trigger pro refetch counts po save/delete v ExerciseTab
  const [countsRefresh, setCountsRefresh] = useState(0);
  // Aktivní level (replace Tabs)
  const [activeLevel, setActiveLevel] = useState<"simple" | "advanced" | "expert">("simple");

  // Počet algoritmických vzorků (jen Level I — code generator)
  const templateSamplesCount = (() => {
    if (!hasCodeGenerator(skill)) return 0;
    try {
      const level = skill.defaultLevel ?? 1;
      return skill.generator(level).length;
    } catch {
      return 0;
    }
  })();

  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any)
        .from("custom_exercises")
        .select("source, status")
        .eq("skill_id", skill.id)
        .eq("is_active", true);
      if (data) {
        const counts = {
          simple:   { approved: 0, pending: 0 },
          advanced: { approved: 0, pending: 0 },
          expert:   { approved: 0, pending: 0 },
        };
        for (const row of data) {
          const status = (row.status as "pending" | "approved" | "rejected") ?? "pending";
          if (status === "rejected") continue;
          const bucket: "approved" | "pending" = status;
          if (row.source === "simple") counts.simple[bucket]++;
          else if (row.source === "advanced" || row.source === "ai") counts.advanced[bucket]++;
          else if (row.source === "expert") counts.expert[bucket]++;
        }
        setExerciseCounts(counts);
      }
    })();
  }, [skill.id, countsRefresh]);

  const [dbRecord, setDbRecord] = useState<any>(null);
  const [form, setForm] = useState({
    help_hint: help?.hint || "",
    help_example: help?.example || "",
    help_common_mistake: help?.commonMistake || "",
    help_steps: help?.steps?.join("\n") || "",
    keywords: skill.keywords.join(", "),
    goals: skill.goals.join("\n"),
    boundaries: skill.boundaries.join("\n"),
    brief_description: skill.briefDescription || "",
    session_task_count: String(skill.sessionTaskCount ?? 6),
  });

  // Try to load the DB record for this skill
  useEffect(() => {
    (supabase as any)
      .from("curriculum_skills")
      .select("*")
      .eq("code_skill_id", skill.id)
      .maybeSingle()
      .then(({ data }: any) => {
        if (data) {
          setDbRecord(data);
          setForm({
            help_hint: data.help_hint || help?.hint || "",
            help_example: data.help_example || help?.example || "",
            help_common_mistake: data.help_common_mistake || help?.commonMistake || "",
            help_steps: (data.help_steps?.length > 0 ? data.help_steps : help?.steps || []).join("\n"),
            keywords: (data.keywords?.length > 0 ? data.keywords : skill.keywords).join(", "),
            goals: (data.goals?.length > 0 ? data.goals : skill.goals).join("\n"),
            boundaries: (data.boundaries?.length > 0 ? data.boundaries : skill.boundaries).join("\n"),
            brief_description: data.brief_description || skill.briefDescription || "",
            session_task_count: String(data.session_task_count ?? skill.sessionTaskCount ?? 6),
          });
        }
      });
  }, [skill.id]);

  const setField = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = {
        help_hint: form.help_hint || null,
        help_example: form.help_example || null,
        help_common_mistake: form.help_common_mistake || null,
        help_steps: form.help_steps.split("\n").map((s) => s.trim()).filter(Boolean),
        keywords: form.keywords.split(",").map((k) => k.trim()).filter(Boolean),
        goals: form.goals.split("\n").map((g) => g.trim()).filter(Boolean),
        boundaries: form.boundaries.split("\n").map((b) => b.trim()).filter(Boolean),
        brief_description: form.brief_description || null,
        session_task_count: parseInt(form.session_task_count) || 6,
      };

      if (dbRecord) {
        const { error } = await (supabase as any)
          .from("curriculum_skills")
          .update(updates)
          .eq("id", dbRecord.id);
        if (error) throw error;
      } else {
        toast({
          description: "Dovednost ještě nemá záznam v databázi. Vytvořte ji přes databázovou správu.",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }

      toast({ description: "Uloženo ✓" });
      setEditing(false);
      setDbRecord({ ...dbRecord, ...updates });
    } catch {
      toast({ description: "Něco se pokazilo.", variant: "destructive" });
    }
    setSaving(false);
  };

  const handleCancel = () => {
    const src = dbRecord || {};
    setForm({
      help_hint: src.help_hint || help?.hint || "",
      help_example: src.help_example || help?.example || "",
      help_common_mistake: src.help_common_mistake || help?.commonMistake || "",
      help_steps: ((src.help_steps?.length > 0 ? src.help_steps : help?.steps) || []).join("\n"),
      keywords: ((src.keywords?.length > 0 ? src.keywords : skill.keywords) || []).join(", "),
      goals: ((src.goals?.length > 0 ? src.goals : skill.goals) || []).join("\n"),
      boundaries: ((src.boundaries?.length > 0 ? src.boundaries : skill.boundaries) || []).join("\n"),
      brief_description: src.brief_description || skill.briefDescription || "",
      session_task_count: String(src.session_task_count ?? skill.sessionTaskCount ?? 6),
    });
    setEditing(false);
  };

  // Display values: prefer DB, fall back to code
  const displayHint = dbRecord?.help_hint || help?.hint;
  const displayExample = dbRecord?.help_example || help?.example;
  const displayMistake = dbRecord?.help_common_mistake || help?.commonMistake;
  const displaySteps = dbRecord?.help_steps?.length > 0 ? dbRecord.help_steps : help?.steps;
  const displayKeywords = dbRecord?.keywords?.length > 0 ? dbRecord.keywords : skill.keywords;
  const displayGoals = dbRecord?.goals?.length > 0 ? dbRecord.goals : skill.goals;
  const displayBoundaries = dbRecord?.boundaries?.length > 0 ? dbRecord.boundaries : skill.boundaries;
  const displayDescription = dbRecord?.brief_description || skill.briefDescription;
  const displayVisualExamples = help?.visualExamples;

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      {/* Header — lila gradient card */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-violet-200/60 bg-gradient-to-br from-violet-50 via-indigo-50 to-purple-50 dark:from-violet-950/40 dark:via-indigo-950/30 dark:to-purple-950/40 p-6 shadow-soft-1">
        <div className="flex items-start justify-between gap-3 mb-3">
          <Badge
            variant="outline"
            className="rounded-full bg-violet-100/80 border-violet-300 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 px-3 py-0.5 text-[11px] font-bold uppercase tracking-[0.1em] gap-1"
          >
            <Plus className="h-3 w-3" />
            Podtéma · {skill.category}
          </Badge>
          {!editing ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditing(true)}
              className="gap-1 rounded-full bg-white/80 backdrop-blur"
            >
              <Pencil className="h-3 w-3" /> Upravit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1 rounded-full">
                <Save className="h-3 w-3" /> {saving ? "Ukládám…" : "Uložit"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                className="rounded-full bg-white/80 backdrop-blur"
              >
                Zrušit
              </Button>
            </div>
          )}
        </div>

        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-2">
          {skill.title}
        </h2>

        {editing ? (
          <Textarea
            value={form.brief_description}
            onChange={(e) => setField("brief_description", e.target.value)}
            placeholder="Popis pro žáka"
            className="min-h-[50px] bg-white/70 backdrop-blur border-violet-200"
          />
        ) : (
          displayDescription && (
            <p className="text-base text-foreground/75 leading-relaxed max-w-2xl">
              {displayDescription}
            </p>
          )
        )}
      </div>

      {/* Metadata grid — 3 karty */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl border-2 border-border/60 bg-card px-4 py-3.5 shadow-soft-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
            Ročník
          </p>
          <p className="mt-1 text-xl font-bold text-foreground tabular-nums">
            {skill.gradeRange[0]}.–{skill.gradeRange[1]}.
          </p>
        </div>

        <div className="rounded-2xl border-2 border-border/60 bg-card px-4 py-3.5 shadow-soft-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
            Typ odpovědi
          </p>
          <p className="mt-1 text-xl font-bold text-foreground">
            {INPUT_TYPE_LABELS[skill.inputType] ?? skill.inputType}
          </p>
        </div>

        <div className="rounded-2xl border-2 border-border/60 bg-card px-4 py-3.5 shadow-soft-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
            Úloh v procvičování
          </p>
          {editing ? (
            <Input
              type="number"
              min={1}
              max={100}
              value={form.session_task_count}
              onChange={(e) => setField("session_task_count", e.target.value)}
              className="mt-1 w-24 h-9 text-xl font-bold"
            />
          ) : (
            <p className="mt-1 text-xl font-bold text-foreground tabular-nums">
              {dbRecord?.session_task_count ?? skill.sessionTaskCount ?? 6}
            </p>
          )}
        </div>
      </div>

      {/* Knihovna obrázků — kompaktní řádek */}
      <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/30 px-4 py-2.5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ImageIcon className="h-4 w-4" />
          <span>Knihovna obrázků pro toto podtéma</span>
        </div>
        <AssetPicker
          skillId={skill.id}
          trigger={
            <Button variant="outline" size="sm" className="h-8 gap-1.5 rounded-full text-xs">
              <ImageIcon className="h-3.5 w-3.5" />
              Spravovat
            </Button>
          }
        />
      </div>

      {/* Vysvětlení tématu */}
      <Separator className="mt-8 mb-4" />
      <Collapsible defaultOpen={false}>
        <CollapsibleTrigger className="flex items-center justify-between gap-2 w-full group rounded-lg border-2 border-border/60 bg-muted/40 hover:bg-muted hover:border-border px-3 py-2.5 transition-colors">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">📋 Vysvětlení tématu</h4>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="group-data-[state=open]:hidden">Zobrazit</span>
            <span className="hidden group-data-[state=open]:inline">Skrýt</span>
            <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
          </span>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="rounded-lg border p-4 space-y-6 mt-2">
            {/* Goals */}
            <Section title="🎯 Cíle">
              {editing ? (
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Každý cíl na nový řádek</Label>
                  <textarea
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[60px]"
                    value={form.goals}
                    onChange={(e) => setField("goals", e.target.value)}
                    rows={3}
                  />
                </div>
              ) : displayGoals.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {displayGoals.map((g: string, i: number) => (
                    <li key={i}>{g}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground italic text-sm">—</p>
              )}
            </Section>

            {/* Boundaries */}
            <Section title="🚧 Hranice (co se NEPROCVIČUJE)">
              {editing ? (
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Každá hranice na nový řádek</Label>
                  <textarea
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[60px]"
                    value={form.boundaries}
                    onChange={(e) => setField("boundaries", e.target.value)}
                    rows={3}
                  />
                </div>
              ) : displayBoundaries.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                  {displayBoundaries.map((b: string, i: number) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground italic text-sm">—</p>
              )}
            </Section>

            {/* Keywords */}
            <Section title="🔑 Klíčová slova">
              {editing ? (
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Oddělte čárkou</Label>
                  <Input value={form.keywords} onChange={(e) => setField("keywords", e.target.value)} />
                </div>
              ) : displayKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {displayKeywords.map((kw: string, i: number) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {kw}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic text-sm">—</p>
              )}
            </Section>

            {/* Help template */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">📖 Nápověda pro žáka</h4>

              <Section title="💡 Tip">
                {editing ? (
                  <Textarea
                    value={form.help_hint}
                    onChange={(e) => setField("help_hint", e.target.value)}
                    placeholder="Krátká rada pro žáka"
                    className="min-h-[60px]"
                  />
                ) : (
                  <p className="text-muted-foreground">{displayHint || <span className="italic">—</span>}</p>
                )}
              </Section>

              <Section title="🧩 Jak na to (kroky)">
                {editing ? (
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Jeden krok na řádek</Label>
                    <Textarea
                      value={form.help_steps}
                      onChange={(e) => setField("help_steps", e.target.value)}
                      placeholder="Krok 1&#10;Krok 2&#10;Krok 3"
                      className="min-h-[80px]"
                    />
                  </div>
                ) : displaySteps && displaySteps.length > 0 ? (
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    {displaySteps.map((s: string, i: number) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-muted-foreground italic text-sm">—</p>
                )}
              </Section>

              <Section title="✏️ Příklad">
                {editing ? (
                  <Input
                    value={form.help_example}
                    onChange={(e) => setField("help_example", e.target.value)}
                    placeholder="42 + 37 = 79"
                  />
                ) : (
                  <p className="text-muted-foreground font-mono text-sm">
                    {displayExample || <span className="italic font-sans">—</span>}
                  </p>
                )}
              </Section>

              <Section title="⚠️ Častá chyba">
                {editing ? (
                  <Input
                    value={form.help_common_mistake}
                    onChange={(e) => setField("help_common_mistake", e.target.value)}
                    placeholder="Pozor na…"
                  />
                ) : (
                  <p className="text-muted-foreground">{displayMistake || <span className="italic">—</span>}</p>
                )}
              </Section>

              {displayVisualExamples && displayVisualExamples.length > 0 && (
                <Section title="👀 Jak to vypadá">
                  {displayVisualExamples.map((ex, i) => {
                    if (typeof ex === "string") {
                      return (
                        <pre
                          key={i}
                          className="whitespace-pre-wrap font-mono text-sm text-muted-foreground leading-relaxed"
                        >
                          {ex}
                        </pre>
                      );
                    }
                    return (
                      <div key={i} className="rounded-lg border bg-secondary/50 p-3 space-y-1">
                        <p className="font-medium text-sm text-foreground">{ex.label}</p>
                        {ex.illustration && (
                          <pre className="whitespace-pre-wrap font-mono text-xs text-muted-foreground leading-relaxed">
                            {ex.illustration}
                          </pre>
                        )}
                        {ex.conclusion && <p className="text-sm font-medium text-primary">{ex.conclusion}</p>}
                      </div>
                    );
                  })}
                </Section>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Přehled cvičení — 3 karty místo tabs */}
      <div className="space-y-3 mt-6">
        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <span aria-hidden>📚</span>
          Přehled cvičení
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <LevelCard
            label="Level I"
            title="Základní"
            description="Jednoduché jednokrokové úlohy. Procvičení mechaniky."
            count={templateSamplesCount + exerciseCounts.simple.approved}
            pending={exerciseCounts.simple.pending}
            colorClass="bg-emerald-100 text-emerald-800 border-emerald-200"
            active={activeLevel === "simple"}
            onClick={() => setActiveLevel("simple")}
          />
          <LevelCard
            label="Level II"
            title="Pokročilá"
            description="Vícekrokové úlohy se zlomky a slovní zadání."
            count={exerciseCounts.advanced.approved}
            pending={exerciseCounts.advanced.pending}
            colorClass="bg-sky-100 text-sky-800 border-sky-200"
            active={activeLevel === "advanced"}
            onClick={() => setActiveLevel("advanced")}
          />
          <LevelCard
            label="Level III"
            title="Vysoká obtížnost"
            description="Nejtěžší úlohy — vícekrokové, kombinující více konceptů."
            count={exerciseCounts.expert.approved}
            pending={exerciseCounts.expert.pending}
            colorClass="bg-violet-100 text-violet-800 border-violet-200"
            active={activeLevel === "expert"}
            onClick={() => setActiveLevel("expert")}
          />
        </div>

        {/* Obsah pro aktivní level */}
        <div className="pt-2">
          <ExerciseTab
            skill={skill}
            variant={activeLevel}
            onCountsChanged={() => setCountsRefresh((n) => n + 1)}
          />
        </div>
      </div>
    </div>
  );
}

// ── Helpers ─────────────────────────────
function LevelCard({
  label,
  title,
  description,
  count,
  pending,
  colorClass,
  active,
  onClick,
}: {
  label: string;
  title: string;
  description: string;
  count: number;
  pending: number;
  colorClass: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative text-left rounded-2xl border-2 bg-card px-4 py-4 shadow-soft-1 transition-all hover:shadow-md hover:-translate-y-0.5 ${
        active
          ? "border-violet-400 ring-2 ring-violet-200"
          : "border-border/60 hover:border-violet-200"
      }`}
    >
      <Badge
        variant="outline"
        className={`rounded-md ${colorClass} px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide`}
      >
        {label}
      </Badge>
      <p className="mt-2 text-base font-bold text-foreground">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{description}</p>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-2xl font-black text-foreground tabular-nums">{count}</span>
        <span className="text-xs text-muted-foreground">úloh</span>
        {pending > 0 && (
          <Badge
            variant="outline"
            className="ml-auto rounded-full bg-amber-100 border-amber-300 text-amber-800 text-[10px] font-bold tabular-nums"
            title={`${pending} čeká na schválení`}
          >
            +{pending}
          </Badge>
        )}
      </div>
    </button>
  );
}

// ── Helpers ─────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border p-4 space-y-2">
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      {children}
    </div>
  );
}
