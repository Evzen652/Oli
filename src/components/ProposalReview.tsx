import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Check, X, Loader2, ChevronDown, ChevronUp, Sparkles, Trash2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { CurriculumProposal } from "./AdminAIChat";

interface ProposalReviewProps {
  proposals: CurriculumProposal[];
  explanation: string;
  onDone: () => void;
  onDismiss: () => void;
  onNextAction?: (prompt: string) => void;
}

type ProposalItem = CurriculumProposal & {
  expanded: boolean;
  saving: boolean;
  saved: boolean;
};

// ══════════════════════════════════════════════════════
// Main component
// ══════════════════════════════════════════════════════
export function ProposalReview({ proposals, explanation, onDone, onDismiss, onNextAction }: ProposalReviewProps) {
  const [items, setItems] = useState<ProposalItem[]>(
    proposals.map((p) => ({ ...p, expanded: true, saving: false, saved: false }))
  );
  const [allDone, setAllDone] = useState(false);
  const [savingAll, setSavingAll] = useState(false);
  const [savingType, setSavingType] = useState<string | null>(null);

  const updateItem = (index: number, data: Record<string, unknown>) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, data: { ...item.data, ...data } } : item))
    );
  };

  const toggleExpand = (index: number) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, expanded: !item.expanded } : item)));
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const saveOne = async (index: number) => {
    const item = items[index];
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, saving: true } : it)));

    try {
      await saveProposalToDb(item);
      setItems((prev) => prev.map((it, i) => (i === index ? { ...it, saving: false, saved: true } : it)));
      const actionLabel = item.action === "delete" ? "smazán/a" : "použito";
      toast.success(`${getTypeLabel(item.type)} "${item.data.name}" – ${actionLabel}`);
    } catch (e) {
      setItems((prev) => prev.map((it, i) => (i === index ? { ...it, saving: false } : it)));
      const msg = e instanceof Error ? e.message : (e as any)?.message || "Neznámá chyba";
      toast.error(`Chyba při ukládání: ${msg}`);
    }
  };

  const saveAll = async () => {
    setSavingAll(true);
    // Sort by type priority — subject → category → topic → skill (respect hierarchy)
    const order = ["subject", "category", "topic", "skill"];
    const indices = items
      .map((it, i) => ({ it, i }))
      .filter(({ it }) => !it.saved)
      .sort((a, b) => order.indexOf(a.it.type) - order.indexOf(b.it.type))
      .map(({ i }) => i);

    for (const i of indices) {
      await saveOne(i);
    }
    setSavingAll(false);
    toast.success("Všechny návrhy provedeny!");
    setAllDone(true);
  };

  const saveByType = async (type: string) => {
    setSavingType(type);
    const indices = items.map((it, i) => ({ it, i })).filter(({ it }) => !it.saved && it.type === type).map(({ i }) => i);
    for (const i of indices) {
      await saveOne(i);
    }
    setSavingType(null);
    if (items.every((it) => it.saved || it.type !== type)) {
      toast.success(`Všechny ${getTypeLabel(type).toLowerCase()} položky provedeny ✓`);
    }
  };

  const allSaved = items.length > 0 && items.every((it) => it.saved);
  const savedCount = items.filter((it) => it.saved).length;
  const progressPct = items.length > 0 ? Math.round((savedCount / items.length) * 100) : 0;

  // Group for batch actions & summary
  const byType = useMemo(() => {
    const groups: Record<string, { total: number; saved: number; pending: number }> = {};
    for (const it of items) {
      if (!groups[it.type]) groups[it.type] = { total: 0, saved: 0, pending: 0 };
      groups[it.type].total++;
      if (it.saved) groups[it.type].saved++;
      else groups[it.type].pending++;
    }
    return groups;
  }, [items]);

  const typeOrder = ["subject", "category", "topic", "skill"];

  return (
    <div className="space-y-4">
      {/* ═══════ Header with summary, progress, batch actions ═══════ */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 flex-1">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" /> AI návrh kurikula
              </h3>
              {explanation && <p className="text-sm text-muted-foreground">{explanation}</p>}
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={onDismiss} disabled={savingAll}>
                <X className="h-4 w-4 mr-1" /> Odmítnout vše
              </Button>
              <Button size="sm" onClick={saveAll} disabled={savingAll || allSaved} className="gap-1">
                {savingAll ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                {savingAll ? "Používám…" : allSaved ? "Hotovo" : `Použít vše`}
              </Button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{savedCount} z {items.length} hotovo</span>
              <span>{progressPct} %</span>
            </div>
            <Progress value={progressPct} className="h-2" />
          </div>

          {/* Per-type summary with quick action */}
          <div className="flex flex-wrap gap-2">
            {typeOrder
              .filter((t) => byType[t])
              .map((t) => {
                const g = byType[t];
                const allTypeSaved = g.pending === 0;
                return (
                  <Button
                    key={t}
                    size="sm"
                    variant={allTypeSaved ? "secondary" : "outline"}
                    disabled={allTypeSaved || savingType === t || savingAll}
                    onClick={() => saveByType(t)}
                    className="gap-1.5 h-7 text-xs"
                  >
                    {savingType === t ? <Loader2 className="h-3 w-3 animate-spin" /> : getTypeIcon(t)}
                    {getTypeLabel(t)} {allTypeSaved ? "✓" : `(${g.pending}/${g.total})`}
                  </Button>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* ═══════ Items ═══════ */}
      {items.map((item, i) => (
        <ProposalCard
          key={i}
          item={item}
          onToggle={() => toggleExpand(i)}
          onRemove={() => removeItem(i)}
          onSave={() => saveOne(i)}
          onChange={(d) => updateItem(i, d)}
        />
      ))}

      {/* ═══════ Next steps after all saved ═══════ */}
      {allDone && onNextAction && (
        <NextStepsCard items={items} onNextAction={onNextAction} onDone={onDone} />
      )}
      {allDone && !onNextAction && (
        <Card className="border-green-300 bg-green-50">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-green-800 font-medium">✓ Všechny návrhy provedeny</p>
            <Button size="sm" variant="outline" onClick={onDone} className="mt-2">
              Zavřít
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════
// Single proposal card
// ══════════════════════════════════════════════════════
function ProposalCard({
  item, onToggle, onRemove, onSave, onChange,
}: {
  item: ProposalItem;
  onToggle: () => void;
  onRemove: () => void;
  onSave: () => void;
  onChange: (d: Record<string, unknown>) => void;
}) {
  const isDelete = item.action === "delete";
  const isUpdate = item.action === "update";

  return (
    <Card
      className={`transition-all ${item.saved ? "opacity-60 border-green-300 bg-green-50/30" : ""} ${
        isDelete && !item.saved ? "border-destructive/50 bg-destructive/5" : ""
      }`}
    >
      <CardHeader className="p-4 pb-3 cursor-pointer" onClick={onToggle}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="text-xl shrink-0">{getTypeIcon(item.type)}</div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className={`text-base ${isDelete ? "line-through text-muted-foreground" : ""}`}>
                  {String(item.data.name || "Bez názvu")}
                </CardTitle>
                <Badge variant={isDelete ? "destructive" : isUpdate ? "secondary" : "outline"} className="text-[10px]">
                  {isDelete ? "🗑️ smazat" : isUpdate ? "✏️ upravit" : "➕ vytvořit"}
                </Badge>
                <Badge variant="outline" className="text-[10px]">{getTypeLabel(item.type)}</Badge>
                {item.saved && (
                  <Badge variant="secondary" className="text-[10px] bg-green-100 text-green-800 border-green-200">
                    ✓ {isDelete ? "Smazáno" : "Uloženo"}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {!item.saved && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  variant={isDelete ? "destructive" : "default"}
                  size="sm"
                  className="h-8 gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSave();
                  }}
                  disabled={item.saving}
                >
                  {item.saving ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : isDelete ? (
                    <Trash2 className="h-3 w-3" />
                  ) : (
                    <Check className="h-3 w-3" />
                  )}
                  <span className="hidden sm:inline">{isDelete ? "Smazat" : "Uložit"}</span>
                </Button>
              </>
            )}
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              {item.expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {item.expanded && !isDelete && (
        <CardContent className="p-4 pt-0 space-y-3">
          <ProposalFields
            type={item.type}
            data={item.data}
            onChange={onChange}
            disabled={item.saved}
          />
        </CardContent>
      )}
    </Card>
  );
}

// ══════════════════════════════════════════════════════
// Field dispatcher per type
// ══════════════════════════════════════════════════════
function ProposalFields({
  type, data, onChange, disabled,
}: {
  type: string;
  data: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
  disabled: boolean;
}) {
  switch (type) {
    case "subject":
      return <SubjectFields data={data} onChange={onChange} disabled={disabled} />;
    case "category":
      return <CategoryFields data={data} onChange={onChange} disabled={disabled} />;
    case "topic":
      return <TopicFields data={data} onChange={onChange} disabled={disabled} />;
    case "skill":
      return <SkillFields data={data} onChange={onChange} disabled={disabled} />;
    default:
      return <p className="text-sm text-muted-foreground">Neznámý typ: {type}</p>;
  }
}

// ── Small field primitives ────────────────────────────
function TextField({ label, value, onChange, disabled, placeholder, multiline = false }: {
  label: string;
  value: unknown;
  onChange: (v: string) => void;
  disabled: boolean;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {multiline ? (
        <Textarea
          value={String(value || "")}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          rows={2}
          className="text-sm"
          placeholder={placeholder}
        />
      ) : (
        <Input
          value={String(value || "")}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="text-sm"
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

function ArrayField({ label, value, onChange, disabled, placeholder }: {
  label: string;
  value: unknown;
  onChange: (v: string[]) => void;
  disabled: boolean;
  placeholder?: string;
}) {
  const arr = Array.isArray(value) ? (value as string[]) : [];
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        {arr.length > 0 && <span className="text-[10px] text-muted-foreground">{arr.length} pol.</span>}
      </div>
      <Textarea
        value={arr.join("\n")}
        onChange={(e) => onChange(e.target.value.split("\n").filter(Boolean))}
        disabled={disabled}
        rows={Math.max(2, Math.min(arr.length + 1, 6))}
        className="text-sm"
        placeholder={placeholder || "Každý řádek = jedna položka"}
      />
    </div>
  );
}

// ── Simple types ──────────────────────────────────────
function SubjectFields({ data, onChange, disabled }: any) {
  return (
    <div className="space-y-3">
      <TextField label="Název" value={data.name} onChange={(v) => onChange({ name: v })} disabled={disabled} />
      <TextField label="Slug (URL identifikátor)" value={data.slug} onChange={(v) => onChange({ slug: v })} disabled={disabled} placeholder="napr-matematika" />
    </div>
  );
}

function CategoryFields({ data, onChange, disabled }: any) {
  return (
    <div className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <TextField label="Název" value={data.name} onChange={(v) => onChange({ name: v })} disabled={disabled} />
        <TextField label="Slug" value={data.slug} onChange={(v) => onChange({ slug: v })} disabled={disabled} />
      </div>
      <TextField label="Předmět (slug)" value={data.subject_slug} onChange={(v) => onChange({ subject_slug: v })} disabled={disabled} />
      <TextField label="Popis" value={data.description} onChange={(v) => onChange({ description: v })} disabled={disabled} multiline />
      <TextField label="🌟 Zajímavost" value={data.fun_fact} onChange={(v) => onChange({ fun_fact: v })} disabled={disabled} />
    </div>
  );
}

function TopicFields({ data, onChange, disabled }: any) {
  return (
    <div className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <TextField label="Název" value={data.name} onChange={(v) => onChange({ name: v })} disabled={disabled} />
        <TextField label="Slug" value={data.slug} onChange={(v) => onChange({ slug: v })} disabled={disabled} />
      </div>
      <TextField label="Okruh (slug)" value={data.category_slug} onChange={(v) => onChange({ category_slug: v })} disabled={disabled} />
      <TextField label="Popis" value={data.description} onChange={(v) => onChange({ description: v })} disabled={disabled} multiline />
    </div>
  );
}

// ══════════════════════════════════════════════════════
// Skill fields — grouped into collapsible sections + preview
// ══════════════════════════════════════════════════════
function SkillFields({ data, onChange, disabled }: any) {
  const [showPreview, setShowPreview] = useState(false);

  // Summary counters for section headers
  const goalsN = Array.isArray(data.goals) ? data.goals.length : 0;
  const boundariesN = Array.isArray(data.boundaries) ? data.boundaries.length : 0;
  const keywordsN = Array.isArray(data.keywords) ? data.keywords.length : 0;
  const stepsN = Array.isArray(data.help_steps) ? data.help_steps.length : 0;
  const visualsN = Array.isArray(data.help_visual_examples) ? data.help_visual_examples.length : 0;

  return (
    <div className="space-y-2">
      {/* Preview toggle */}
      <div className="flex justify-end">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowPreview(!showPreview)}
          className="gap-1.5 h-7 text-xs"
        >
          {showPreview ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          {showPreview ? "Skrýt náhled" : "Náhled pro žáka"}
        </Button>
      </div>

      {showPreview && <SkillPreview data={data} />}

      {/* 📝 Základ */}
      <SectionBlock title="📝 Základ" summary={String(data.name || "—")} defaultOpen>
        <div className="space-y-3">
          <TextField label="Název" value={data.name} onChange={(v) => onChange({ name: v })} disabled={disabled} />
          <div className="grid sm:grid-cols-2 gap-3">
            <TextField label="Kód (code_skill_id)" value={data.code_skill_id} onChange={(v) => onChange({ code_skill_id: v })} disabled={disabled} placeholder="math-scitani-do-100" />
            <TextField label="Téma (topic_slug)" value={data.topic_slug} onChange={(v) => onChange({ topic_slug: v })} disabled={disabled} />
          </div>
          <TextField label="Stručný popis (pro žáka)" value={data.brief_description} onChange={(v) => onChange({ brief_description: v })} disabled={disabled} multiline placeholder="Naučíš se…" />
          <div className="grid grid-cols-3 gap-3">
            <TextField label="Ročník od" value={data.grade_min} onChange={(v) => onChange({ grade_min: v })} disabled={disabled} />
            <TextField label="Ročník do" value={data.grade_max} onChange={(v) => onChange({ grade_max: v })} disabled={disabled} />
            <TextField label="Typ vstupu" value={data.input_type} onChange={(v) => onChange({ input_type: v })} disabled={disabled} placeholder="text / number / …" />
          </div>
        </div>
      </SectionBlock>

      {/* 🎯 Učební cíle */}
      <SectionBlock
        title="🎯 Učební cíle"
        summary={`cíle: ${goalsN} · hranice: ${boundariesN} · klíč. slova: ${keywordsN}`}
      >
        <div className="space-y-3">
          <ArrayField label="🎯 Cíle" value={data.goals} onChange={(v) => onChange({ goals: v })} disabled={disabled} placeholder="Co se žák naučí (každý cíl na řádek)" />
          <ArrayField label="🚧 Hranice (co se NEPROCVIČUJE)" value={data.boundaries} onChange={(v) => onChange({ boundaries: v })} disabled={disabled} />
          <ArrayField label="🔑 Klíčová slova" value={data.keywords} onChange={(v) => onChange({ keywords: v })} disabled={disabled} placeholder="Pro matching dotazů žáka" />
        </div>
      </SectionBlock>

      {/* 💡 Nápověda pro žáka */}
      <SectionBlock
        title="💡 Nápověda pro žáka"
        summary={`tip: ${data.help_hint ? "✓" : "—"} · kroky: ${stepsN} · vizuály: ${visualsN}`}
      >
        <div className="space-y-3">
          <TextField label="💡 Tip" value={data.help_hint} onChange={(v) => onChange({ help_hint: v })} disabled={disabled} multiline placeholder="Krátká rada (ne přímá odpověď!)" />
          <ArrayField label="🧩 Kroky řešení" value={data.help_steps} onChange={(v) => onChange({ help_steps: v })} disabled={disabled} placeholder="Krok 1&#10;Krok 2&#10;Krok 3" />
          <TextField label="✏️ Příklad" value={data.help_example} onChange={(v) => onChange({ help_example: v })} disabled={disabled} placeholder="42 + 37 = 79" />
          <TextField label="⚠️ Častá chyba" value={data.help_common_mistake} onChange={(v) => onChange({ help_common_mistake: v })} disabled={disabled} multiline />
          <ArrayField label="🖼️ Vizuální příklady (ASCII)" value={data.help_visual_examples} onChange={(v) => onChange({ help_visual_examples: v })} disabled={disabled} />
        </div>
      </SectionBlock>

      {/* 🌟 Meta */}
      <SectionBlock title="🌟 Meta" summary={data.fun_fact ? "zajímavost: ✓" : "—"}>
        <TextField label="🌟 Zajímavost" value={data.fun_fact} onChange={(v) => onChange({ fun_fact: v })} disabled={disabled} multiline />
      </SectionBlock>
    </div>
  );
}

// ── Collapsible section ──
function SectionBlock({
  title, summary, children, defaultOpen = false,
}: {
  title: string;
  summary?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full rounded-md border bg-muted/30 px-3 py-2 hover:bg-muted/60 transition-colors">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <span>{title}</span>
          {summary && <span className="text-xs text-muted-foreground font-normal">— {summary}</span>}
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-2 rounded-md border bg-background p-3">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// ══════════════════════════════════════════════════════
// Skill preview — "how the student will see this"
// ══════════════════════════════════════════════════════
function SkillPreview({ data }: { data: Record<string, unknown> }) {
  const name = String(data.name || "Bez názvu");
  const desc = String(data.brief_description || "");
  const inputType = String(data.input_type || "text");
  const hint = String(data.help_hint || "");
  const goals = Array.isArray(data.goals) ? (data.goals as string[]) : [];

  return (
    <div className="rounded-xl border-2 border-blue-200 bg-blue-50/40 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Eye className="h-4 w-4 text-blue-600" />
        <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Náhled — jak to uvidí žák</p>
      </div>
      <div className="rounded-lg bg-background border p-4 space-y-2">
        <h4 className="text-base font-semibold text-foreground">{name}</h4>
        {desc && <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>}
        {goals.length > 0 && (
          <div className="pt-1">
            <p className="text-xs text-muted-foreground mb-1">Naučíš se:</p>
            <ul className="list-disc list-inside text-sm text-foreground space-y-0.5">
              {goals.slice(0, 3).map((g, i) => (
                <li key={i}>{g}</li>
              ))}
              {goals.length > 3 && <li className="text-muted-foreground">… a {goals.length - 3} dalších</li>}
            </ul>
          </div>
        )}
        <div className="flex items-center gap-2 pt-2">
          <Badge variant="outline" className="text-[10px]">Typ odpovědi: {inputType}</Badge>
          {data.grade_min && data.grade_max && (
            <Badge variant="outline" className="text-[10px]">
              {String(data.grade_min)}–{String(data.grade_max)}. ročník
            </Badge>
          )}
        </div>
        {hint && (
          <div className="mt-2 rounded-md bg-amber-50 border border-amber-200 p-2.5">
            <p className="text-xs text-amber-900">
              <span className="font-semibold">💡 Tip:</span> {hint}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// Helpers
// ══════════════════════════════════════════════════════
function getTypeLabel(type: string) {
  switch (type) {
    case "subject": return "Předmět";
    case "category": return "Okruh";
    case "topic": return "Téma";
    case "skill": return "Podtéma";
    default: return type;
  }
}

function getTypeIcon(type: string): string {
  switch (type) {
    case "subject": return "📚";
    case "category": return "📂";
    case "topic": return "📄";
    case "skill": return "🎯";
    default: return "•";
  }
}

// ══════════════════════════════════════════════════════
// Next steps card (after all saved)
// ══════════════════════════════════════════════════════
function NextStepsCard({
  items, onNextAction, onDone,
}: {
  items: ProposalItem[];
  onNextAction: (prompt: string) => void;
  onDone: () => void;
}) {
  const savedTopics = items.filter((it) => it.type === "topic" && it.saved);
  const savedSkills = items.filter((it) => it.type === "skill" && it.saved);

  return (
    <Card className="border-2 border-primary/30 bg-primary/5">
      <CardContent className="p-5 space-y-4">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" /> Další kroky
        </h4>
        <p className="text-sm text-muted-foreground">Návrhy byly provedeny. Co chcete udělat dál?</p>
        <div className="flex flex-wrap gap-2">
          {savedTopics.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1"
              onClick={() => {
                const topicNames = savedTopics.map((t) => String(t.data.name)).join(", ");
                onNextAction(
                  `Navrhni podtémata (skills) pro nově vytvořená témata: ${topicNames}. Pro každé téma navrhni 2-4 konkrétní podtémata s vhodnými input_type.`
                );
                onDone();
              }}
            >
              <Sparkles className="h-3 w-3" /> Navrhnout podtémata
            </Button>
          )}
          {savedSkills.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1"
              onClick={() => {
                const skillNames = savedSkills.map((s) => String(s.data.name)).join(", ");
                onNextAction(
                  `Vygeneruj cvičení pro nově vytvořená podtémata: ${skillNames}. Pro každé podtéma vygeneruj 5-8 cvičení.`
                );
                onDone();
              }}
            >
              <Sparkles className="h-3 w-3" /> Vygenerovat cvičení
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={onDone}>
            Zavřít
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ══════════════════════════════════════════════════════
// DB save / delete logic — unchanged API
// ══════════════════════════════════════════════════════
async function saveProposalToDb(item: ProposalItem) {
  const { type, data, action } = item;
  const isUpdate = action === "update";
  const isDelete = action === "delete";

  if (isDelete) {
    return deleteProposalFromDb(type, data);
  }

  switch (type) {
    case "subject": {
      const payload = {
        name: String(data.name),
        slug: String(data.slug),
        sort_order: Number(data.sort_order || 0),
      };
      if (isUpdate) {
        const { error } = await supabase.from("curriculum_subjects").update(payload).eq("slug", payload.slug);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("curriculum_subjects").insert(payload);
        if (error) throw error;
      }
      break;
    }
    case "category": {
      const { data: subjectRow } = await supabase
        .from("curriculum_subjects")
        .select("id")
        .eq("slug", String(data.subject_slug))
        .maybeSingle();
      if (!subjectRow) throw new Error(`Předmět "${data.subject_slug}" nenalezen`);

      const payload = {
        name: String(data.name),
        slug: String(data.slug),
        subject_id: subjectRow.id,
        description: data.description ? String(data.description) : null,
        fun_fact: data.fun_fact ? String(data.fun_fact) : null,
        sort_order: Number(data.sort_order || 0),
      };
      if (isUpdate) {
        const { error } = await supabase
          .from("curriculum_categories")
          .update(payload)
          .eq("slug", payload.slug)
          .eq("subject_id", subjectRow.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("curriculum_categories").insert(payload);
        if (error) throw error;
      }
      break;
    }
    case "topic": {
      const { data: catRow } = await supabase
        .from("curriculum_categories")
        .select("id")
        .eq("slug", String(data.category_slug))
        .maybeSingle();
      if (!catRow) throw new Error(`Okruh "${data.category_slug}" nenalezen`);

      const payload = {
        name: String(data.name),
        slug: String(data.slug),
        category_id: catRow.id,
        description: data.description ? String(data.description) : null,
        sort_order: Number(data.sort_order || 0),
      };
      if (isUpdate) {
        const { error } = await supabase
          .from("curriculum_topics")
          .update(payload)
          .eq("slug", payload.slug)
          .eq("category_id", catRow.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("curriculum_topics").insert(payload);
        if (error) throw error;
      }
      break;
    }
    case "skill": {
      if (isUpdate) {
        const updatePayload: Record<string, unknown> = {};
        if (data.name) updatePayload.name = String(data.name);
        if (data.code_skill_id) updatePayload.code_skill_id = String(data.code_skill_id);
        if (data.brief_description) updatePayload.brief_description = String(data.brief_description);
        if (data.grade_min) updatePayload.grade_min = Number(data.grade_min);
        if (data.grade_max) updatePayload.grade_max = Number(data.grade_max);
        if (data.input_type) updatePayload.input_type = String(data.input_type);
        if (data.help_hint) updatePayload.help_hint = String(data.help_hint);
        if (data.help_example) updatePayload.help_example = String(data.help_example);
        if (data.help_common_mistake) updatePayload.help_common_mistake = String(data.help_common_mistake);
        if (Array.isArray(data.goals)) updatePayload.goals = data.goals;
        if (Array.isArray(data.boundaries)) updatePayload.boundaries = data.boundaries;
        if (Array.isArray(data.keywords)) updatePayload.keywords = data.keywords;
        if (Array.isArray(data.help_steps)) updatePayload.help_steps = data.help_steps;
        if (Array.isArray(data.help_visual_examples)) updatePayload.help_visual_examples = data.help_visual_examples;
        if (data.fun_fact) updatePayload.fun_fact = String(data.fun_fact);
        if (data.topic_slug) {
          const { data: topicRow } = await supabase
            .from("curriculum_topics")
            .select("id")
            .eq("slug", String(data.topic_slug))
            .maybeSingle();
          if (topicRow) updatePayload.topic_id = topicRow.id;
        }

        if (data.code_skill_id) {
          const { error } = await supabase
            .from("curriculum_skills")
            .update(updatePayload)
            .eq("code_skill_id", String(data.code_skill_id));
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("curriculum_skills")
            .update(updatePayload)
            .eq("name", String(data.name));
          if (error) throw error;
        }
      } else {
        const { data: topicRow } = await supabase
          .from("curriculum_topics")
          .select("id")
          .eq("slug", String(data.topic_slug))
          .maybeSingle();
        if (!topicRow) throw new Error(`Téma "${data.topic_slug}" nenalezeno`);

        const payload = {
          name: String(data.name),
          code_skill_id: String(data.code_skill_id),
          brief_description: data.brief_description ? String(data.brief_description) : null,
          topic_id: topicRow.id,
          grade_min: Number(data.grade_min || 3),
          grade_max: Number(data.grade_max || 9),
          input_type: String(data.input_type || "text"),
          goals: Array.isArray(data.goals) ? data.goals : [],
          boundaries: Array.isArray(data.boundaries) ? data.boundaries : [],
          keywords: Array.isArray(data.keywords) ? data.keywords : [],
          help_hint: data.help_hint ? String(data.help_hint) : null,
          help_example: data.help_example ? String(data.help_example) : null,
          help_common_mistake: data.help_common_mistake ? String(data.help_common_mistake) : null,
          help_steps: Array.isArray(data.help_steps) ? data.help_steps : [],
          help_visual_examples: Array.isArray(data.help_visual_examples) ? data.help_visual_examples : [],
          fun_fact: data.fun_fact ? String(data.fun_fact) : null,
          sort_order: Number(data.sort_order || 0),
        };
        const { error } = await supabase.from("curriculum_skills").insert(payload);
        if (error) throw error;
      }
      break;
    }
    default:
      throw new Error(`Neznámý typ: ${type}`);
  }
}

async function deleteProposalFromDb(type: string, data: Record<string, unknown>) {
  switch (type) {
    case "subject": {
      const { error } = await supabase.from("curriculum_subjects").delete().eq("slug", String(data.slug));
      if (error) throw error;
      break;
    }
    case "category": {
      const { data: subjectRow } = await supabase
        .from("curriculum_subjects")
        .select("id")
        .eq("slug", String(data.subject_slug))
        .maybeSingle();
      if (!subjectRow) throw new Error(`Předmět "${data.subject_slug}" nenalezen`);
      const { error } = await supabase
        .from("curriculum_categories")
        .delete()
        .eq("slug", String(data.slug))
        .eq("subject_id", subjectRow.id);
      if (error) throw error;
      break;
    }
    case "topic": {
      const { data: catRow } = await supabase
        .from("curriculum_topics")
        .select("id, category_id")
        .eq("slug", String(data.slug))
        .maybeSingle();
      if (!catRow) throw new Error(`Téma "${data.slug}" nenalezeno`);
      const { error } = await supabase.from("curriculum_topics").delete().eq("id", catRow.id);
      if (error) throw error;
      break;
    }
    case "skill": {
      if (data.code_skill_id) {
        const { error } = await supabase
          .from("curriculum_skills")
          .delete()
          .eq("code_skill_id", String(data.code_skill_id));
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("curriculum_skills")
          .delete()
          .eq("name", String(data.name));
        if (error) throw error;
      }
      break;
    }
    default:
      throw new Error(`Neznámý typ pro smazání: ${type}`);
  }
}
