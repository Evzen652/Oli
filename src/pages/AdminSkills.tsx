import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCurriculumTable } from "@/hooks/useCurriculumTable";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useT } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp, Save } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";

interface Skill {
  id: string;
  topic_id: string;
  code_skill_id: string;
  name: string;
  brief_description: string | null;
  grade_min: number;
  grade_max: number;
  input_type: string;
  default_level: number;
  help_hint: string | null;
  help_steps: string[];
  help_example: string | null;
  help_common_mistake: string | null;
  keywords: string[];
  goals: string[];
  is_active: boolean;
  sort_order: number;
}

interface AncestorInfo {
  topicName: string;
  categoryName: string;
  categoryId: string;
  subjectName: string;
  subjectId: string;
}

function useSkillAncestors(topicId: string | undefined) {
  const [info, setInfo] = useState<AncestorInfo | null>(null);
  useEffect(() => {
    if (!topicId) return;
    (supabase as any)
      .from("curriculum_topics")
      .select("name, category_id, curriculum_categories(name, subject_id, curriculum_subjects(name))")
      .eq("id", topicId)
      .single()
      .then(({ data }: any) => {
        if (data) {
          const cat = data.curriculum_categories;
          setInfo({
            topicName: data.name,
            categoryName: cat?.name || "…",
            categoryId: data.category_id,
            subjectName: cat?.curriculum_subjects?.name || "…",
            subjectId: cat?.subject_id || "",
          });
        }
      });
  }, [topicId]);
  return info;
}

function SkillCard({ skill: s, onEdit, onRemove, onUpdate }: {
  skill: Skill;
  onEdit: (s: Skill) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, data: any) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editFields, setEditFields] = useState({
    help_hint: s.help_hint || "",
    help_example: s.help_example || "",
    help_common_mistake: s.help_common_mistake || "",
    keywords: (s.keywords || []).join(", "),
    goals: (s.goals || []).join(", "),
    fun_fact: (s as any).fun_fact || "",
  });
  const { toast } = useToast();

  const handleInlineSave = async () => {
    try {
      await onUpdate(s.id, {
        help_hint: editFields.help_hint || null,
        help_example: editFields.help_example || null,
        help_common_mistake: editFields.help_common_mistake || null,
        keywords: editFields.keywords.split(",").map(k => k.trim()).filter(Boolean),
        goals: editFields.goals.split(",").map(g => g.trim()).filter(Boolean),
        fun_fact: editFields.fun_fact || null,
      });
      setEditing(false);
    } catch {
      toast({ description: "Něco se pokazilo.", variant: "destructive" });
    }
  };

  const setField = (key: string, value: string) => setEditFields(prev => ({ ...prev, [key]: value }));

  return (
    <Card className="border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 cursor-pointer" onClick={() => setExpanded(!expanded)}>
            <div className="flex items-center gap-2">
              <p className="font-medium text-foreground">{s.name}</p>
              {!s.is_active && <Badge variant="secondary">neaktivní</Badge>}
              {expanded ? <ChevronUp className="h-3 w-3 text-muted-foreground" /> : <ChevronDown className="h-3 w-3 text-muted-foreground" />}
            </div>
            {s.brief_description && <p className="text-xs text-muted-foreground mt-0.5">{s.brief_description}</p>}
            <p className="text-xs text-muted-foreground mt-0.5">{s.grade_min}–{s.grade_max}. ročník</p>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onEdit(s)}><Pencil className="h-3 w-3" /></Button>
            <AlertDialog>
              <AlertDialogTrigger asChild><Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive"><Trash2 className="h-3 w-3" /></Button></AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                   <AlertDialogTitle>Opravdu smazat „{s.name}"?</AlertDialogTitle>
                  <AlertDialogDescription>Podtéma bude nenávratně odstraněno.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Ne</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={() => onRemove(s.id)}>Ano, smazat</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 border-t pt-3 space-y-3 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Nápověda</p>
                {editing ? (
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Tip</Label>
                      <Textarea value={editFields.help_hint} onChange={e => setField("help_hint", e.target.value)} className="min-h-[50px] text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Příklad</Label>
                      <Input value={editFields.help_example} onChange={e => setField("help_example", e.target.value)} className="text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Častá chyba</Label>
                      <Input value={editFields.help_common_mistake} onChange={e => setField("help_common_mistake", e.target.value)} className="text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Zajímavost</Label>
                      <Textarea value={editFields.fun_fact} onChange={e => setField("fun_fact", e.target.value)} className="min-h-[50px] text-sm" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p><span className="text-muted-foreground">Tip:</span> {s.help_hint || <span className="italic text-muted-foreground">—</span>}</p>
                    <p><span className="text-muted-foreground">Příklad:</span> {s.help_example || <span className="italic text-muted-foreground">—</span>}</p>
                    <p><span className="text-muted-foreground">Častá chyba:</span> {s.help_common_mistake || <span className="italic text-muted-foreground">—</span>}</p>
                    <p><span className="text-muted-foreground">Zajímavost:</span> {(s as any).fun_fact || <span className="italic text-muted-foreground">—</span>}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Metadata</p>
                {editing ? (
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Klíčová slova (čárkou)</Label>
                      <Input value={editFields.keywords} onChange={e => setField("keywords", e.target.value)} className="text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Cíle (čárkou)</Label>
                      <Input value={editFields.goals} onChange={e => setField("goals", e.target.value)} className="text-sm" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p><span className="text-muted-foreground">Klíčová slova:</span> {(s.keywords || []).length > 0 ? (s.keywords as string[]).join(", ") : <span className="italic text-muted-foreground">—</span>}</p>
                    <p><span className="text-muted-foreground">Cíle:</span> {(s.goals || []).length > 0 ? (s.goals as string[]).join(", ") : <span className="italic text-muted-foreground">—</span>}</p>
                    <p><span className="text-muted-foreground">ID generátoru:</span> <code className="text-xs bg-muted px-1 rounded">{s.code_skill_id}</code></p>
                    <p><span className="text-muted-foreground">Typ vstupu:</span> {s.input_type}</p>
                    <p><span className="text-muted-foreground">Výchozí úroveň:</span> {s.default_level}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t">
              {editing ? (
                <>
                  <Button size="sm" onClick={handleInlineSave} className="gap-1"><Save className="h-3 w-3" /> Uložit</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditing(false)}>Zrušit</Button>
                </>
              ) : (
                <Button size="sm" variant="outline" onClick={() => {
                  setEditFields({
                    help_hint: s.help_hint || "",
                    help_example: s.help_example || "",
                    help_common_mistake: s.help_common_mistake || "",
                    keywords: (s.keywords || []).join(", "),
                    goals: (s.goals || []).join(", "),
                    fun_fact: (s as any).fun_fact || "",
                  });
                  setEditing(true);
                }} className="gap-1"><Pencil className="h-3 w-3" /> Upravit detaily</Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminSkills() {
  const { topicId } = useParams<{ topicId: string }>();
  const ancestors = useSkillAncestors(topicId);
  const { items, loading, add, update, remove } = useCurriculumTable<Skill>(
    "curriculum_skills", "topic_id", topicId
  );
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [form, setForm] = useState({
    name: "", brief_description: "", grade_min: 3, grade_max: 5,
    help_hint: "", help_example: "", help_common_mistake: "",
    is_active: true,
    // advanced (hidden by default)
    code_skill_id: "", input_type: "text", default_level: 1, keywords: "", goals: "",
  });
  const t = useT();
  const { toast } = useToast();

  const resetForm = () => {
    setShowForm(false); setEditId(null); setShowAdvanced(false);
    setForm({ name: "", brief_description: "", grade_min: 3, grade_max: 5, help_hint: "", help_example: "", help_common_mistake: "", is_active: true, code_skill_id: "", input_type: "text", default_level: 1, keywords: "", goals: "" });
  };

  const startEdit = (s: Skill) => {
    setEditId(s.id);
    setForm({
      name: s.name, brief_description: s.brief_description || "",
      grade_min: s.grade_min, grade_max: s.grade_max,
      help_hint: s.help_hint || "", help_example: s.help_example || "",
      help_common_mistake: s.help_common_mistake || "", is_active: s.is_active,
      code_skill_id: s.code_skill_id, input_type: s.input_type,
      default_level: s.default_level,
      keywords: (s.keywords || []).join(", "), goals: (s.goals || []).join(", "),
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    try {
      const codeId = form.code_skill_id.trim() || form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const data = {
        topic_id: topicId,
        code_skill_id: codeId,
        name: form.name.trim(),
        brief_description: form.brief_description || null,
        grade_min: form.grade_min, grade_max: form.grade_max,
        input_type: form.input_type, default_level: form.default_level,
        help_hint: form.help_hint || null, help_steps: [],
        help_example: form.help_example || null,
        help_common_mistake: form.help_common_mistake || null,
        help_visual_examples: [],
        keywords: form.keywords.split(",").map((k) => k.trim()).filter(Boolean),
        goals: form.goals.split(",").map((g) => g.trim()).filter(Boolean),
        boundaries: [], is_active: form.is_active,
        sort_order: editId ? undefined : items.length,
      };
      if (editId) await update(editId, data);
      else await add(data as any);
      resetForm();
    } catch { toast({ description: "Něco se pokazilo.", variant: "destructive" }); }
  };

  const setField = (key: string, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <AdminLayout breadcrumbs={[
      { label: ancestors?.subjectName || "…", path: "/admin" },
      { label: ancestors?.categoryName || "…", path: ancestors ? `/admin/subject/${ancestors.subjectId}` : undefined },
      { label: ancestors?.topicName || "…", path: ancestors ? `/admin/category/${ancestors.categoryId}` : undefined },
      { label: "Podtémata" },
    ]}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Podtémata v tématu „{ancestors?.topicName || "…"}"</h2>
        {!showForm && <Button size="sm" onClick={() => setShowForm(true)} className="gap-1"><Plus className="h-4 w-4" /> Přidat podtéma</Button>}
      </div>

      {loading && <p className="text-muted-foreground text-center">{t("loading")}</p>}

      {showForm && (
        <Card className="border-2 border-dashed border-primary/30">
          <CardContent className="p-4 space-y-4">
            {/* Basic info */}
            <div className="space-y-1">
              <Label>Název podtématu</Label>
              <Input value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="např. Sčítání do 100" autoFocus />
            </div>
            <div className="space-y-1">
              <Label>Popis pro žáka <span className="text-muted-foreground text-xs">(co se procvičuje)</span></Label>
              <Textarea value={form.brief_description} onChange={(e) => setField("brief_description", e.target.value)} placeholder="Procvičíš si sčítání dvou čísel do 100." className="min-h-[50px]" />
            </div>

            {/* Grade range */}
            <div className="space-y-1">
              <Label>Pro jaké ročníky</Label>
              <div className="flex gap-2 items-center">
                <Input type="number" min={1} max={9} value={form.grade_min} onChange={(e) => setField("grade_min", Number(e.target.value))} className="w-20" />
                <span className="text-muted-foreground">až</span>
                <Input type="number" min={1} max={9} value={form.grade_max} onChange={(e) => setField("grade_max", Number(e.target.value))} className="w-20" />
                <span className="text-muted-foreground text-sm">. ročník</span>
              </div>
            </div>

            {/* Help section */}
            <div className="border-t pt-3 space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Nápověda pro žáka</p>
              <div className="space-y-1">
                <Label>Tip (krátká rada)</Label>
                <Textarea value={form.help_hint} onChange={(e) => setField("help_hint", e.target.value)} placeholder="Představ si čísla na pravítku…" className="min-h-[50px]" />
              </div>
              <div className="space-y-1">
                <Label>Příklad řešení</Label>
                <Input value={form.help_example} onChange={(e) => setField("help_example", e.target.value)} placeholder="42 + 37 = 79" />
              </div>
              <div className="space-y-1">
                <Label>Častá chyba</Label>
                <Input value={form.help_common_mistake} onChange={(e) => setField("help_common_mistake", e.target.value)} placeholder="Pozor na přenos desítek…" />
              </div>
            </div>

            {/* Active toggle */}
            <div className="flex items-center gap-2">
              <Switch checked={form.is_active} onCheckedChange={(v) => setField("is_active", v)} />
              <Label>Aktivní (zobrazuje se žákům)</Label>
            </div>

            {/* Advanced toggle */}
            <button
              type="button"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              Pokročilé nastavení
            </button>

            {showAdvanced && (
              <div className="space-y-3 border-t pt-3">
                <div className="space-y-1">
                  <Label>ID generátoru <span className="text-muted-foreground text-xs">(propojení s kódem)</span></Label>
                  <Input value={form.code_skill_id} onChange={(e) => setField("code_skill_id", e.target.value)} placeholder="auto z názvu" className="font-mono text-sm" />
                </div>
                <div className="space-y-1">
                  <Label>Klíčová slova <span className="text-muted-foreground text-xs">(čárkou)</span></Label>
                  <Input value={form.keywords} onChange={(e) => setField("keywords", e.target.value)} placeholder="sčítání, odčítání, do sta" />
                </div>
                <div className="space-y-1">
                  <Label>Cíle <span className="text-muted-foreground text-xs">(čárkou)</span></Label>
                  <Input value={form.goals} onChange={(e) => setField("goals", e.target.value)} placeholder="Naučíš se sčítat do 100" />
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={!form.name.trim()}>{editId ? "Uložit" : "Přidat"}</Button>
              <Button variant="outline" onClick={resetForm}>Zrušit</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {items.length === 0 && !loading && <p className="text-muted-foreground text-center py-8">Zatím žádná podtémata.</p>}

      {items.map((s) => (
        <SkillCard key={s.id} skill={s} onEdit={startEdit} onRemove={remove} onUpdate={update} />
      ))}
    </AdminLayout>
  );
}
