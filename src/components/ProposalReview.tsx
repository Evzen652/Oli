import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Check, X, Loader2, ChevronDown, ChevronUp, Sparkles, Trash2 } from "lucide-react";
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

export function ProposalReview({ proposals, explanation, onDone, onDismiss, onNextAction }: ProposalReviewProps) {
  const [items, setItems] = useState(proposals.map((p) => ({ ...p, expanded: true, saving: false, saved: false })));
  const [allDone, setAllDone] = useState(false);
  const [savingAll, setSavingAll] = useState(false);

  const updateItem = (index: number, data: Record<string, unknown>) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, data: { ...item.data, ...data } } : item
      )
    );
  };

  const toggleExpand = (index: number) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, expanded: !item.expanded } : item
      )
    );
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const saveItem = async (index: number) => {
    const item = items[index];
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, saving: true } : it)));

    try {
      await saveProposalToDb(item);
      setItems((prev) => prev.map((it, i) => (i === index ? { ...it, saving: false, saved: true } : it)));
      const actionLabel = item.action === "delete" ? "smazán/a" : "provedeno";
      toast.success(`${getTypeLabel(item.type)} "${item.data.name}" – ${actionLabel}`);
    } catch (e) {
      setItems((prev) => prev.map((it, i) => (i === index ? { ...it, saving: false } : it)));
      const msg = e instanceof Error ? e.message : (e as any)?.message || "Neznámá chyba";
      toast.error(`Chyba při ukládání: ${msg}`);
    }
  };

  const saveAll = async () => {
    setSavingAll(true);
    for (let i = 0; i < items.length; i++) {
      if (!items[i].saved) {
        await saveItem(i);
      }
    }
    setSavingAll(false);
    toast.success("Všechny návrhy provedeny!");
    setAllDone(true);
  };

  const allSaved = items.every((it) => it.saved);
  const unsavedCount = items.filter((it) => !it.saved).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 flex-1">
              <h3 className="font-semibold text-foreground">📋 AI návrh kurikula</h3>
              {explanation && <p className="text-sm text-muted-foreground">{explanation}</p>}
              <Badge variant="secondary">{items.length} položek</Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onDismiss}>
                <X className="h-4 w-4 mr-1" /> Zahodit
              </Button>
              <Button size="sm" onClick={saveAll} disabled={savingAll || allSaved}>
                {savingAll ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
                {savingAll ? "Provádím…" : `Provést vše (${unsavedCount})`}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      {items.map((item, i) => {
        const isDelete = item.action === "delete";
        return (
          <Card key={i} className={`transition-all ${item.saved ? "opacity-60 border-green-300" : ""} ${isDelete && !item.saved ? "border-destructive/50 bg-destructive/5" : ""}`}>
            <CardHeader className="p-4 pb-2 cursor-pointer" onClick={() => toggleExpand(i)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={isDelete ? "destructive" : "outline"} className="text-xs">
                    {isDelete ? "🗑️ Smazat" : getTypeLabel(item.type)}
                  </Badge>
                  {!isDelete && <Badge variant="outline" className="text-xs">{getTypeLabel(item.type)}</Badge>}
                  <CardTitle className={`text-base ${isDelete ? "line-through text-muted-foreground" : ""}`}>{String(item.data.name || "Bez názvu")}</CardTitle>
                  {item.saved && <Badge variant="secondary" className="text-xs">✓ {isDelete ? "Smazáno" : "Uloženo"}</Badge>}
                </div>
                <div className="flex items-center gap-1">
                  {!item.saved && (
                    <>
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); removeItem(i); }}>
                        <X className="h-4 w-4" />
                      </Button>
                      <Button variant={isDelete ? "destructive" : "ghost"} size="sm" onClick={(e) => { e.stopPropagation(); saveItem(i); }} disabled={item.saving}>
                        {item.saving ? <Loader2 className="h-4 w-4 animate-spin" /> : isDelete ? <Trash2 className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                      </Button>
                    </>
                  )}
                  {item.expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </div>
            </CardHeader>
            {item.expanded && !isDelete && (
              <CardContent className="p-4 pt-0 space-y-3">
                <ProposalFields type={item.type} data={item.data} onChange={(d) => updateItem(i, d)} disabled={item.saved} />
              </CardContent>
            )}
          </Card>
        );
      })}
      {/* Next steps after all saved */}
      {allDone && onNextAction && (
        <NextStepsCard items={items} onNextAction={onNextAction} onDone={onDone} />
      )}
      {allDone && !onNextAction && (
        <Card className="border-green-300 bg-green-50">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-green-800 font-medium">✓ Všechny návrhy provedeny</p>
            <Button size="sm" variant="outline" onClick={onDone} className="mt-2">Zavřít</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ProposalFields({
  type,
  data,
  onChange,
  disabled,
}: {
  type: string;
  data: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
  disabled: boolean;
}) {
  const field = (key: string, label: string, multiline = false) => (
    <div key={key} className="space-y-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {multiline ? (
        <Textarea
          value={String(data[key] || "")}
          onChange={(e) => onChange({ [key]: e.target.value })}
          disabled={disabled}
          rows={2}
          className="text-sm"
        />
      ) : (
        <Input
          value={String(data[key] || "")}
          onChange={(e) => onChange({ [key]: e.target.value })}
          disabled={disabled}
          className="text-sm"
        />
      )}
    </div>
  );

  const arrayField = (key: string, label: string) => {
    const arr = Array.isArray(data[key]) ? (data[key] as string[]) : [];
    return (
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        <Textarea
          value={arr.join("\n")}
          onChange={(e) => onChange({ [key]: e.target.value.split("\n").filter(Boolean) })}
          disabled={disabled}
          rows={Math.max(2, arr.length)}
          className="text-sm font-mono"
          placeholder="Každý řádek = jedna položka"
        />
      </div>
    );
  };

  switch (type) {
    case "subject":
      return <>{field("name", "Název")}{field("slug", "Slug")}</>;
    case "category":
      return (
        <>
          {field("name", "Název")}
          {field("slug", "Slug")}
          {field("description", "Popis", true)}
          {field("fun_fact", "Zajímavost")}
        </>
      );
    case "topic":
      return (
        <>
          {field("name", "Název")}
          {field("slug", "Slug")}
          {field("description", "Popis", true)}
        </>
      );
    case "skill":
      return (
        <>
          {field("name", "Název")}
          {field("code_skill_id", "Kód generátoru")}
          {field("brief_description", "Stručný popis", true)}
          <div className="grid grid-cols-2 gap-2">
            {field("grade_min", "Ročník od")}
            {field("grade_max", "Ročník do")}
          </div>
          {field("input_type", "Typ vstupu")}
          {arrayField("goals", "🎯 Cíle")}
          {arrayField("boundaries", "🚧 Hranice")}
          {arrayField("keywords", "🔑 Klíčová slova")}
          {field("help_hint", "💡 Tip", true)}
          {arrayField("help_steps", "🧩 Kroky řešení")}
          {field("help_example", "✏️ Příklad")}
          {field("help_common_mistake", "⚠️ Častá chyba", true)}
          {arrayField("help_visual_examples", "🖼️ Jak to vypadá? (vizuální příklady)")}
          {field("fun_fact", "🌟 Zajímavost", true)}
        </>
      );
    default:
      return <p className="text-sm text-muted-foreground">Neznámý typ: {type}</p>;
  }
}

function getTypeLabel(type: string) {
  switch (type) {
    case "subject": return "Předmět";
    case "category": return "Okruh";
    case "topic": return "Téma";
    case "skill": return "Podtéma";
    default: return type;
  }
}

/** Next steps after saving all proposals */
function NextStepsCard({
  items,
  onNextAction,
  onDone,
}: {
  items: Array<CurriculumProposal & { saved: boolean }>;
  onNextAction: (prompt: string) => void;
  onDone: () => void;
}) {
  const savedTopics = items.filter((it) => it.type === "topic" && it.saved);
  const savedSkills = items.filter((it) => it.type === "skill" && it.saved);

  return (
    <Card className="border-2 border-primary/30 bg-primary/5">
      <CardContent className="p-5 space-y-4">
        <h4 className="font-semibold text-foreground">🚀 Další kroky</h4>
        <p className="text-sm text-muted-foreground">
          Návrhy byly provedeny. Co chcete udělat dál?
        </p>
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



async function saveProposalToDb(item: CurriculumProposal & { expanded: boolean; saving: boolean; saved: boolean }) {
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
        const { error } = await supabase.from("curriculum_categories").update(payload).eq("slug", payload.slug).eq("subject_id", subjectRow.id);
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
        const { error } = await supabase.from("curriculum_topics").update(payload).eq("slug", payload.slug).eq("category_id", catRow.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("curriculum_topics").insert(payload);
        if (error) throw error;
      }
      break;
    }
    case "skill": {
      if (isUpdate) {
        // For updates, build payload only from provided fields
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
          const { data: topicRow } = await supabase.from("curriculum_topics").select("id").eq("slug", String(data.topic_slug)).maybeSingle();
          if (topicRow) updatePayload.topic_id = topicRow.id;
        }

        // Find skill by code_skill_id or by name
        if (data.code_skill_id) {
          const { error } = await supabase.from("curriculum_skills").update(updatePayload).eq("code_skill_id", String(data.code_skill_id));
          if (error) throw error;
        } else {
          const { error } = await supabase.from("curriculum_skills").update(updatePayload).eq("name", String(data.name));
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
      const { data: subjectRow } = await supabase.from("curriculum_subjects").select("id").eq("slug", String(data.subject_slug)).maybeSingle();
      if (!subjectRow) throw new Error(`Předmět "${data.subject_slug}" nenalezen`);
      const { error } = await supabase.from("curriculum_categories").delete().eq("slug", String(data.slug)).eq("subject_id", subjectRow.id);
      if (error) throw error;
      break;
    }
    case "topic": {
      const { data: catRow } = await supabase.from("curriculum_topics").select("id, category_id").eq("slug", String(data.slug)).maybeSingle();
      if (!catRow) throw new Error(`Téma "${data.slug}" nenalezeno`);
      const { error } = await supabase.from("curriculum_topics").delete().eq("id", catRow.id);
      if (error) throw error;
      break;
    }
    case "skill": {
      if (data.code_skill_id) {
        const { error } = await supabase.from("curriculum_skills").delete().eq("code_skill_id", String(data.code_skill_id));
        if (error) throw error;
      } else {
        const { error } = await supabase.from("curriculum_skills").delete().eq("name", String(data.name));
        if (error) throw error;
      }
      break;
    }
    default:
      throw new Error(`Neznámý typ pro smazání: ${type}`);
  }
}
