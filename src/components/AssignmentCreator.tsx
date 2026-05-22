import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Plus, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import { logoNoText } from "@/components/OlyLogo";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { getAllTopics } from "@/lib/contentRegistry";
import type { Grade, TopicMetadata } from "@/lib/types";
import { getSubjectMeta } from "@/lib/subjectRegistry";

interface Props {
  childId: string;
  childName: string;
  grade?: Grade | null;
  onCreated?: (skillId: string) => void;
  prefillSkillCode?: string | null;
  onPrefillConsumed?: () => void;
  demoNotePrefix?: string;
  buttonClassName?: string;
}

function cap(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

export function AssignmentCreator({ childId, childName, grade, onCreated, prefillSkillCode, onPrefillConsumed, demoNotePrefix, buttonClassName }: Props) {
  const t = useT();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Selection state
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedSkillId, setSelectedSkillId] = useState(""); // TopicMetadata.id
  const [assignedDate, setAssignedDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [note, setNote] = useState("");

  // All topics from code registry — filtered by grade if provided
  const allTopics = useMemo<TopicMetadata[]>(() => {
    const all = getAllTopics();
    if (!grade) return all;
    return all.filter(t => grade >= t.gradeRange[0] && grade <= t.gradeRange[1]);
  }, [grade]);

  // Derived hierarchy
  const subjects = useMemo(() => [...new Set(allTopics.map(t => t.subject))], [allTopics]);

  const categories = useMemo(() =>
    selectedSubject
      ? [...new Set(allTopics.filter(t => t.subject === selectedSubject).map(t => t.category))]
      : [],
    [allTopics, selectedSubject]);

  const topicGroups = useMemo(() =>
    selectedSubject && selectedCategory
      ? [...new Set(allTopics.filter(t => t.subject === selectedSubject && t.category === selectedCategory).map(t => t.topic))]
      : [],
    [allTopics, selectedSubject, selectedCategory]);

  const skills = useMemo<TopicMetadata[]>(() =>
    selectedSubject && selectedCategory && selectedTopic
      ? allTopics.filter(t => t.subject === selectedSubject && t.category === selectedCategory && t.topic === selectedTopic)
      : [],
    [allTopics, selectedSubject, selectedCategory, selectedTopic]);

  // When category changes, reset downstream
  useEffect(() => { setSelectedCategory(""); setSelectedTopic(""); setSelectedSkillId(""); }, [selectedSubject]);
  useEffect(() => { setSelectedTopic(""); setSelectedSkillId(""); }, [selectedCategory]);
  useEffect(() => {
    if (skills.length === 1) setSelectedSkillId(skills[0].id);
    else setSelectedSkillId("");
  }, [selectedTopic, skills]);

  // Auto-select if only one option
  useEffect(() => {
    if (categories.length === 1) setSelectedCategory(categories[0]);
  }, [categories]);
  useEffect(() => {
    if (topicGroups.length === 1) setSelectedTopic(topicGroups[0]);
  }, [topicGroups]);

  // Prefill from code_skill_id
  useEffect(() => {
    if (!prefillSkillCode || !open) return;
    const topic = allTopics.find(t => t.id === prefillSkillCode);
    if (topic) {
      setSelectedSubject(topic.subject);
      setSelectedCategory(topic.category);
      setSelectedTopic(topic.topic);
      setSelectedSkillId(topic.id);
    } else {
      toast({ description: `Téma "${prefillSkillCode}" nelze předvyplnit — vyberte ho prosím ručně.` });
    }
    onPrefillConsumed?.();
  }, [prefillSkillCode, open]);

  const selectedSkillMeta = skills.find(s => s.id === selectedSkillId);

  const handleSave = async () => {
    if (!selectedSkillId) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    const noteValue = demoNotePrefix
      ? `${demoNotePrefix}${note.trim() ? ' ' + note.trim() : ''}`
      : (note.trim() || null);

    const { error } = await supabase.from("parent_assignments").insert({
      child_id: childId,
      parent_user_id: user.id,
      skill_id: selectedSkillId,
      assigned_date: format(assignedDate, "yyyy-MM-dd"),
      due_date: dueDate ? format(dueDate, "yyyy-MM-dd") : null,
      note: noteValue,
    });

    setSaving(false);
    if (error) {
      toast({ description: t("parent.toast_error"), variant: "destructive" });
    } else {
      setSuccess(true);
      onCreated?.(selectedSkillId);
      setTimeout(() => handleOpenChange(false), 1800);
    }
  };

  const resetForm = () => {
    setSelectedSubject(""); setSelectedCategory(""); setSelectedTopic(""); setSelectedSkillId("");
    setAssignedDate(new Date()); setDueDate(undefined); setNote("");
    setSuccess(false);
  };

  const handleOpenChange = (v: boolean) => {
    if (!v) resetForm();
    setOpen(v);
  };

  const subjectMeta = (subj: string) => getSubjectMeta(subj);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button className={cn("w-full h-12 rounded-2xl bg-primary text-primary-foreground font-bold flex items-center justify-between px-4 shadow-md hover:shadow-lg active:scale-[0.98] transition-all text-sm", buttonClassName)}>
          {t("assign.create")}
          <ArrowRight className="h-4 w-4 shrink-0" />
        </button>
      </DialogTrigger>
      <DialogContent className="overflow-y-auto max-h-[90vh] sm:max-w-xl p-0 gap-0">
        {/* Záhlaví */}
        <div className="flex flex-col items-center gap-3 pt-8 pb-4 px-8">
          <div className="relative">
            <div className="h-24 w-24 rounded-3xl bg-amber-50 border border-amber-100 flex items-center justify-center shadow-sm">
              <img src={logoNoText} alt="Oli" className="h-16 w-16 object-contain" />
            </div>
            <span className="absolute -bottom-1 -right-1 text-xl">📋</span>
          </div>
          <div className="text-center">
            <DialogTitle className="text-xl font-bold">{t("assign.title").replace("{name}", childName)}</DialogTitle>
            <p className="text-sm text-muted-foreground mt-0.5">Vyberte téma, které chcete procvičit</p>
          </div>
        </div>
        <DialogHeader className="sr-only">
          <DialogTitle>{t("assign.title").replace("{name}", childName)}</DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="py-12 px-8 flex flex-col items-center gap-4 text-center">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <p className="font-bold text-lg">Úkol byl zadán!</p>
            <p className="text-sm text-muted-foreground">{childName} ho uvidí při příštím spuštění aplikace.</p>
          </div>
        ) : (
          <div className="px-8 py-6 space-y-5">
            {/* Předmět */}
            <div className="space-y-1.5">
              <Label>{t("assign.subject")}</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder={t("assign.pick")} />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(subj => {
                    const meta = subjectMeta(subj);
                    return (
                      <SelectItem key={subj} value={subj}>
                        <span className="flex items-center gap-2">
                          <span>{meta.emoji}</span>
                          <span>{cap(subj)}</span>
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Okruh */}
            {selectedSubject && categories.length > 0 && (
              <div className="space-y-1.5">
                <Label>{t("assign.category")}</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger><SelectValue placeholder={t("assign.pick")} /></SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cap(cat)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Téma */}
            {selectedCategory && topicGroups.length > 1 && (
              <div className="space-y-1.5">
                <Label>{t("assign.topic")}</Label>
                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                  <SelectTrigger><SelectValue placeholder={t("assign.pick")} /></SelectTrigger>
                  <SelectContent>
                    {topicGroups.map(tg => (
                      <SelectItem key={tg} value={tg}>{cap(tg)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Dovednost */}
            {selectedTopic && skills.length > 1 && (
              <div className="space-y-1.5">
                <Label>{t("assign.skill")}</Label>
                <Select value={selectedSkillId} onValueChange={setSelectedSkillId}>
                  <SelectTrigger><SelectValue placeholder={t("assign.pick")} /></SelectTrigger>
                  <SelectContent>
                    {skills.map(sk => (
                      <SelectItem key={sk.id} value={sk.id}>
                        {sk.displayName ?? sk.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Shrnutí vybraného tématu */}
            {selectedSkillMeta && (
              <div className="rounded-xl bg-violet-50 border border-violet-100 px-4 py-3 text-sm text-violet-800">
                <p className="font-semibold">{selectedSkillMeta.displayName ?? selectedSkillMeta.title}</p>
                {selectedSkillMeta.briefDescription && (
                  <p className="text-violet-600 text-xs mt-0.5">{selectedSkillMeta.briefDescription}</p>
                )}
              </div>
            )}

            {/* Datum zadání */}
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

            {/* Termín splnění */}
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

            {/* Poznámka */}
            <div className="space-y-1.5">
              <Label>{t("assign.note")}</Label>
              <Textarea value={note} onChange={e => setNote(e.target.value)} placeholder={t("assign.note_placeholder")} rows={2} />
            </div>

            <Button className="w-full gap-2" onClick={handleSave} disabled={!selectedSkillId || saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {t("assign.save")}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
