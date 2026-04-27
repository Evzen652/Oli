import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, ClipboardList, Plus, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";

interface Props {
  childId: string;
  childName: string;
  onCreated?: () => void;
  /**
   * Pokud je předán code_skill_id (např. "math-compare-natural-numbers-100"),
   * sheet se automaticky otevře a předvyplní celý řetězec
   * subject → category → topic → skill.
   * Změna této hodnoty (klíčem nebo přepsáním) znovu spustí prefill.
   */
  prefillSkillCode?: string | null;
  /** Volitelný callback po dokončení/zrušení prefillu — rodič může vyresetovat hash */
  onPrefillConsumed?: () => void;
}

interface Subject { id: string; name: string; slug: string; }
interface Category { id: string; name: string; subject_id: string; }
interface Topic { id: string; name: string; category_id: string; }
interface Skill { id: string; name: string; code_skill_id: string; topic_id: string; is_active: boolean; }

export function AssignmentCreator({ childId, childName, onCreated, prefillSkillCode, onPrefillConsumed }: Props) {
  const t = useT();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Curriculum data
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);

  // Selection state
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [assignedDate, setAssignedDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [note, setNote] = useState("");

  // Guard, který blokuje kaskádové resety během prefillu
  const prefillingRef = useRef(false);
  // Aktuálně zpracovávaný prefill kód (deduplikace)
  const consumedPrefillRef = useRef<string | null>(null);

  useEffect(() => {
    if (!open) return;
    supabase.from("curriculum_subjects").select("id, name, slug").order("sort_order").then(({ data }) => setSubjects(data ?? []));
  }, [open]);

  useEffect(() => {
    if (!selectedSubject) { setCategories([]); return; }
    supabase.from("curriculum_categories").select("id, name, subject_id").eq("subject_id", selectedSubject).order("sort_order").then(({ data }) => setCategories(data ?? []));
    if (prefillingRef.current) return;
    setSelectedCategory(""); setSelectedTopic(""); setSelectedSkill("");
  }, [selectedSubject]);

  useEffect(() => {
    if (!selectedCategory) { setTopics([]); return; }
    supabase.from("curriculum_topics").select("id, name, category_id").eq("category_id", selectedCategory).order("sort_order").then(({ data }) => {
      const items = data ?? [];
      setTopics(items);
      if (prefillingRef.current) return;
      // Auto-select if only one topic
      if (items.length === 1) {
        setSelectedTopic(items[0].id);
      } else {
        setSelectedTopic(""); setSelectedSkill("");
      }
    });
  }, [selectedCategory]);

  useEffect(() => {
    if (!selectedTopic) { setSkills([]); return; }
    supabase.from("curriculum_skills").select("id, name, code_skill_id, topic_id, is_active").eq("topic_id", selectedTopic).eq("is_active", true).order("sort_order").then(({ data }) => {
      const items = data ?? [];
      setSkills(items);
      if (prefillingRef.current) return;
      // Auto-select if only one skill
      if (items.length === 1) {
        setSelectedSkill(items[0].id);
      } else {
        setSelectedSkill("");
      }
    });
  }, [selectedTopic]);

  // Prefill chain: code_skill_id → skill → topic → category → subject
  useEffect(() => {
    if (!prefillSkillCode) return;
    if (consumedPrefillRef.current === prefillSkillCode) return;
    consumedPrefillRef.current = prefillSkillCode;

    let cancelled = false;
    (async () => {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(prefillSkillCode);

      // 1a) Pokus podle code_skill_id (preferované)
      let skillRow: { id: string; name: string; code_skill_id: string; topic_id: string; is_active: boolean } | null = null;
      const byCode = await supabase
        .from("curriculum_skills")
        .select("id, name, code_skill_id, topic_id, is_active")
        .eq("code_skill_id", prefillSkillCode)
        .eq("is_active", true)
        .maybeSingle();
      if (!cancelled) skillRow = byCode.data ?? null;

      // 1b) Pokud je vstup UUID a nenašlo se podle kódu, zkus podle id
      if (!cancelled && !skillRow && isUuid) {
        const byId = await supabase
          .from("curriculum_skills")
          .select("id, name, code_skill_id, topic_id, is_active")
          .eq("id", prefillSkillCode)
          .eq("is_active", true)
          .maybeSingle();
        skillRow = byId.data ?? null;
      }

      // 1c) Fallback — zkus normalizovaný/canonical skill ID (např. zlomky aliasy)
      if (!cancelled && !skillRow) {
        try {
          const { canonicalSkillId } = await import("@/lib/skillIdNormalizer");
          const canonical = canonicalSkillId(prefillSkillCode);
          if (canonical && canonical !== prefillSkillCode) {
            const byCanon = await supabase
              .from("curriculum_skills")
              .select("id, name, code_skill_id, topic_id, is_active")
              .eq("code_skill_id", canonical)
              .eq("is_active", true)
              .maybeSingle();
            skillRow = byCanon.data ?? null;
          }
        } catch {
          // ignore — canonical resolution selhal
        }
      }

      if (cancelled) return;
      if (!skillRow) {
        // Skill se v curriculum_skills nenašel — otevři sheet aspoň prázdný
        // (uživatel vybere ručně, lepší než nic)
        console.warn("[AssignmentCreator] prefill skill not found:", prefillSkillCode);
        toast({
          description: `Téma "${prefillSkillCode}" nelze automaticky předvyplnit — vyberte ho prosím ručně.`,
          variant: "default",
        });
        setOpen(true);
        onPrefillConsumed?.();
        return;
      }

      // 2) Topic
      const { data: topicRow } = await supabase
        .from("curriculum_topics")
        .select("id, name, category_id")
        .eq("id", skillRow.topic_id)
        .maybeSingle();
      if (cancelled || !topicRow) { setOpen(true); onPrefillConsumed?.(); return; }

      // 3) Category
      const { data: catRow } = await supabase
        .from("curriculum_categories")
        .select("id, name, subject_id")
        .eq("id", topicRow.category_id)
        .maybeSingle();
      if (cancelled || !catRow) { setOpen(true); onPrefillConsumed?.(); return; }

      // Aplikuj řetězec — guard zabrání kaskádovým resetům
      prefillingRef.current = true;
      setOpen(true);
      setSelectedSubject(catRow.subject_id);
      setSelectedCategory(catRow.id);
      setSelectedTopic(topicRow.id);
      setSelectedSkill(skillRow.id);

      // Po vykreslení uvolni guard
      setTimeout(() => {
        prefillingRef.current = false;
        onPrefillConsumed?.();
      }, 100);
    })();

    return () => { cancelled = true; };
  }, [prefillSkillCode, onPrefillConsumed]);

  const handleSave = async () => {
    if (!selectedSkill) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    const skill = skills.find(s => s.id === selectedSkill);
    const { error } = await supabase.from("parent_assignments").insert({
      child_id: childId,
      parent_user_id: user.id,
      skill_id: skill?.code_skill_id ?? selectedSkill,
      assigned_date: format(assignedDate, "yyyy-MM-dd"),
      due_date: dueDate ? format(dueDate, "yyyy-MM-dd") : null,
      note: note.trim() || null,
    });

    setSaving(false);
    if (error) {
      toast({ description: t("parent.toast_error"), variant: "destructive" });
    } else {
      toast({ description: t("assign.toast_created") });
      setOpen(false);
      resetForm();
      onCreated?.();
    }
  };

  const resetForm = () => {
    setSelectedSubject(""); setSelectedCategory(""); setSelectedTopic(""); setSelectedSkill("");
    setAssignedDate(new Date()); setDueDate(undefined); setNote("");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="default" size="default" className="gap-2 h-10 font-medium shadow-sm">
          <ClipboardList className="h-4 w-4" />
          {t("assign.create")}
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t("assign.title").replace("{name}", childName)}</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-5">
          {/* Subject */}
          <div className="space-y-1.5">
            <Label>{t("assign.subject")}</Label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger><SelectValue placeholder={t("assign.pick")} /></SelectTrigger>
              <SelectContent>{subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          {/* Category */}
          {categories.length > 0 && (
            <div className="space-y-1.5">
              <Label>{t("assign.category")}</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger><SelectValue placeholder={t("assign.pick")} /></SelectTrigger>
                <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          )}

          {/* Topic — only show if more than one */}
          {topics.length > 1 && (
            <div className="space-y-1.5">
              <Label>{t("assign.topic")}</Label>
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger><SelectValue placeholder={t("assign.pick")} /></SelectTrigger>
                <SelectContent>{topics.map(tp => <SelectItem key={tp.id} value={tp.id}>{tp.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          )}

          {/* Skill — only show if more than one */}
          {skills.length > 1 && (
            <div className="space-y-1.5">
              <Label>{t("assign.skill")}</Label>
              <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                <SelectTrigger><SelectValue placeholder={t("assign.pick")} /></SelectTrigger>
                <SelectContent>{skills.map(sk => <SelectItem key={sk.id} value={sk.id}>{sk.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          )}

          {/* Date */}
          <div className="space-y-1.5">
            <Label>{t("assign.date")}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !assignedDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(assignedDate, "d. MMMM yyyy", { locale: cs })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={assignedDate} onSelect={(d) => d && setAssignedDate(d)} initialFocus className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>
          </div>

          {/* Due date (optional) */}
          <div className="space-y-1.5">
            <Label>{t("assign.due_date")}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "d. MMMM yyyy", { locale: cs }) : t("assign.due_optional")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>
          </div>

          {/* Note */}
          <div className="space-y-1.5">
            <Label>{t("assign.note")}</Label>
            <Textarea value={note} onChange={e => setNote(e.target.value)} placeholder={t("assign.note_placeholder")} rows={2} />
          </div>

          <Button className="w-full gap-2" onClick={handleSave} disabled={!selectedSkill || saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {t("assign.save")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
