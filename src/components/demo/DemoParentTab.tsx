import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, CheckCircle2, ArrowRight, Plus, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { logoNoText } from "@/components/OlyLogo";
import { DewhiteImg } from "@/components/DewhiteImg";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { normalizeSubjectLabel, normalizeCategoryName, normalizeTopicName } from "@/lib/curriculumNormalize";
import { getReadableSkillName } from "@/lib/skillReadableName";
import { ChildActivityBadge } from "@/components/ChildActivityBadge";
import { AssignmentList } from "@/components/AssignmentList";
import { ChildMisconceptions } from "@/components/ChildMisconceptions";
import { ChildSessionLog, type SessionEntry } from "@/components/ChildSessionLog";
import type { Misconception } from "@/hooks/useChildMisconceptions";

const S = "https://uusaczibimqvaazpaopy.supabase.co/storage/v1/object/public/prvouka-images";

// ── Mock data — používají reálné skill IDs z content registry ────────────────

const MOCK_STATS = { tasks: 31, days: 6, accuracy: 32, assignedTasks: 18, selfTasks: 13 };

const MOCK_ASSIGNMENTS = [
  { id: "d1", skill_id: "pr-plant-parts", assigned_date: "2025-04-27", due_date: null, status: "pending", note: null },
  { id: "d2", skill_id: "math-multiply", assigned_date: "2025-04-18", due_date: null, status: "pending", note: null },
  { id: "d3", skill_id: "cz-vyjmenovana-slova-b", assigned_date: "2025-04-10", due_date: null, status: "completed", note: null, completedDate: "2025-04-14T17:32:00", completionCorrect: 4, completionHelpUsed: 1, completionTotal: 8 },
  { id: "d4", skill_id: "math-add-sub-100", assigned_date: "2025-04-03", due_date: null, status: "completed", note: null, completedDate: "2025-04-07T16:10:00", completionCorrect: 3, completionHelpUsed: 0, completionTotal: 10 },
  { id: "d5", skill_id: "cz-slovni-druhy", assigned_date: "2025-03-28", due_date: null, status: "completed", note: null, completedDate: "2025-04-01T15:55:00", completionCorrect: 7, completionHelpUsed: 1, completionTotal: 9 },
];

const MOCK_SESSIONS: SessionEntry[] = [
  { session_id: "s1", date: "2025-05-01T11:46:00Z", skill_id: "cz-vyjmenovana-slova-b", total: 7, correct: 4, help_used: 1 },
  { session_id: "s2", date: "2025-05-01T02:31:00Z", skill_id: "math-add-sub-100", total: 6, correct: 0, help_used: 0 },
  { session_id: "s3", date: "2025-05-01T02:23:00Z", skill_id: "math-add-sub-100", total: 1, correct: 0, help_used: 0 },
];

const MOCK_MISCONCEPTIONS: Misconception[] = [
  {
    id: "m1",
    skill_id: "frac-compare-same-den",
    pattern_label: "Systematická záměna při srovnání zlomků",
    description: "Žák systematicky chybuje při srovnání zlomků se stejným jmenovatelem, což ukazuje na hlubší nepochopení problému.",
    suggestion: "Zopakovat základní pravidla srovnávání zlomků a procvičit řadu příkladů.",
    confidence: 0.9,
    evidence_count: 5,
    status: "active",
    detected_at: "2025-05-01T00:00:00Z",
  },
  {
    id: "m2",
    skill_id: "math-compare-natural-numbers-100",
    pattern_label: "Nedostatečné pochopení porovnávání přirozených čísel",
    description: "Žák pravděpodobně nemá dostatečné pochopení porovnávání přirozených čísel do 100, protože většina jeho odpovědí byla chybná.",
    suggestion: "Zopakovat základní pravidla porovnávání čísel a procvičit několik příkladů.",
    confidence: 0.85,
    evidence_count: 4,
    status: "active",
    detected_at: "2025-05-01T00:00:00Z",
  },
];

// ── DemoAssignmentSheet — reálný výběr kurikula, fiktivní save ───────────────

interface CurriculumItem { id: string; name: string; }

function DemoAssignmentSheet({ open, onOpenChange, onCreated }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: (skillId: string) => void;
}) {
  const [subjects, setSubjects] = useState<CurriculumItem[]>([]);
  const [categories, setCategories] = useState<CurriculumItem[]>([]);
  const [topics, setTopics] = useState<CurriculumItem[]>([]);
  const [skills, setSkills] = useState<CurriculumItem[]>([]);

  const [selSubject, setSelSubject] = useState("");
  const [selCategory, setSelCategory] = useState("");
  const [selTopic, setSelTopic] = useState("");
  const [selSkill, setSelSkill] = useState("");
  const [assignedDate, setAssignedDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!open) return;
    supabase.from("curriculum_subjects").select("id, name, slug").order("sort_order").then(({ data }) =>
      setSubjects((data ?? []).map(s => ({ id: s.id, name: normalizeSubjectLabel(s.name, s.slug) }))));
  }, [open]);

  function reset() {
    setSelSubject(""); setSelCategory(""); setSelTopic(""); setSelSkill("");
    setCategories([]); setTopics([]); setSkills([]);
    setAssignedDate(new Date()); setDueDate(undefined); setNote("");
    setSuccess(false);
  }

  function handleClose(v: boolean) {
    if (!v) reset();
    onOpenChange(v);
  }

  function handleSubject(v: string) {
    setSelSubject(v); setSelCategory(""); setSelTopic(""); setSelSkill("");
    setCategories([]); setTopics([]); setSkills([]);
    supabase.from("curriculum_categories").select("id, name").eq("subject_id", v).order("sort_order")
      .then(({ data }) => setCategories((data ?? []).map(c => ({ ...c, name: normalizeCategoryName(c.name) }))));
  }

  function handleCategory(v: string) {
    setSelCategory(v); setSelTopic(""); setSelSkill("");
    setTopics([]); setSkills([]);
    supabase.from("curriculum_topics").select("id, name").eq("category_id", v).order("sort_order")
      .then(({ data }) => {
        const items = (data ?? []).map(t => ({ ...t, name: normalizeTopicName(t.name) }));
        setTopics(items);
        if (items.length === 1) handleTopic(items[0].id);
      });
  }

  function handleTopic(v: string) {
    setSelTopic(v); setSelSkill(""); setSkills([]);
    supabase.from("curriculum_skills").select("id, name, code_skill_id").eq("topic_id", v).eq("is_active", true).order("sort_order")
      .then(({ data }) => {
        const items = (data ?? []) as (CurriculumItem & { code_skill_id: string })[];
        const mapped = items.map(s => ({ id: s.code_skill_id || s.id, name: getReadableSkillName(s.code_skill_id) || s.name }));
        setSkills(mapped);
        if (mapped.length === 1) setSelSkill(mapped[0].id);
      });
  }

  async function handleSubmit() {
    if (!selSkill) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    setLoading(false);
    setSuccess(true);
    onCreated(selSkill);
    setTimeout(() => handleClose(false), 1800);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="overflow-y-auto max-h-[90vh] sm:max-w-xl p-0 gap-0">
        {/* Ilustrační záhlaví */}
        <div className="flex flex-col items-center gap-3 pt-8 pb-4 px-8">
          <div className="relative">
            <div className="h-24 w-24 rounded-3xl bg-amber-50 border border-amber-100 flex items-center justify-center shadow-sm">
              <img src={logoNoText} alt="Oli" className="h-16 w-16 object-contain" />
            </div>
            <span className="absolute -bottom-1 -right-1 text-xl">📋</span>
          </div>
          <div className="text-center">
            <DialogTitle className="text-xl font-bold">Zadat úkol pro Tomáše</DialogTitle>
            <p className="text-sm text-muted-foreground mt-0.5">Vyberte téma, které chcete procvičit</p>
          </div>
        </div>
        <DialogHeader className="sr-only">
          <DialogTitle>Zadat úkol pro Tomáše</DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="py-12 px-8 flex flex-col items-center gap-4 text-center">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <p className="font-bold text-lg">Úkol byl zadán!</p>
            <p className="text-sm text-muted-foreground">Tomáš ho uvidí při příštím spuštění aplikace.</p>
          </div>
        ) : (
          <div className="px-8 py-6 space-y-5">
            {/* Předmět */}
            <div className="space-y-1.5">
              <Label>Předmět</Label>
              <Select value={selSubject} onValueChange={handleSubject}>
                <SelectTrigger><SelectValue placeholder="Vyberte předmět…" /></SelectTrigger>
                <SelectContent>{subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            {/* Okruh */}
            {categories.length > 0 && (
              <div className="space-y-1.5">
                <Label>Okruh</Label>
                <Select value={selCategory} onValueChange={handleCategory}>
                  <SelectTrigger><SelectValue placeholder="Vyberte okruh…" /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            )}

            {/* Téma */}
            {topics.length > 1 && (
              <div className="space-y-1.5">
                <Label>Téma</Label>
                <Select value={selTopic} onValueChange={handleTopic}>
                  <SelectTrigger><SelectValue placeholder="Vyberte téma…" /></SelectTrigger>
                  <SelectContent>{topics.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            )}

            {/* Dovednost */}
            {skills.length > 1 && (
              <div className="space-y-1.5">
                <Label>Dovednost</Label>
                <Select value={selSkill} onValueChange={setSelSkill}>
                  <SelectTrigger><SelectValue placeholder="Vyberte dovednost…" /></SelectTrigger>
                  <SelectContent>{skills.map(sk => <SelectItem key={sk.id} value={sk.id}>{sk.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            )}

            {/* Datum zadání */}
            <div className="space-y-1.5">
              <Label>Datum zadání</Label>
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
              <Label>Termín splnění (volitelný)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "d. MMMM yyyy", { locale: cs }) : "Bez termínu"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>

            {/* Poznámka */}
            <div className="space-y-1.5">
              <Label>Poznámka pro Tomáše</Label>
              <Textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Nepovinná poznámka…" rows={2} />
            </div>

            <Button className="w-full gap-2" onClick={handleSubmit} disabled={!selSkill || loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Zadat úkol
            </Button>
            <p className="text-xs text-center text-muted-foreground">Demo verze — úkol se zobrazí lokálně, neukládá se do databáze.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── Hlavní komponenta ─────────────────────────────────────────────────────────

export function DemoParentTab() {
  const navigate = useNavigate();
  const [assignOpen, setAssignOpen] = useState(false);
  const [mockAssignments, setMockAssignments] = useState(MOCK_ASSIGNMENTS);
  const [newSkillId, setNewSkillId] = useState<string | null>(null);

  function handleAssignmentCreated(skillId: string) {
    const today = new Date();
    setMockAssignments(prev => [
      { id: `demo-${Date.now()}`, skill_id: skillId, assigned_date: today.toISOString().slice(0, 10), due_date: null, status: "pending", note: null },
      ...prev,
    ]);
    setNewSkillId(skillId);
    setTimeout(() => setNewSkillId(null), 60000);
  }

  function handleMockDelete(id: string) {
    setMockAssignments(prev => prev.filter(a => a.id !== id));
  }

  return (
    <div className="min-h-[600px] bg-[#fdf8f2] rounded-2xl p-4 space-y-4">

      <DemoAssignmentSheet open={assignOpen} onOpenChange={setAssignOpen} onCreated={handleAssignmentCreated} />

      {/* Greeting bar */}
      <div className="bg-white rounded-3xl px-6 py-5 flex flex-wrap items-center gap-4 shadow-sm border border-black/[0.05]">
        <img src={logoNoText} alt="Oli" className="h-14 w-14 object-contain shrink-0" />
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-2xl text-foreground leading-tight">Vítejte v rodičovském přehledu</h1>
          <p className="text-base text-muted-foreground mt-0.5">Zde vidíte přehled procvičování vašeho dítěte — co zadáváte, jak mu to jde a na které chyby se vyplatí zaměřit.</p>
        </div>
      </div>

      {/* Hero karta — horizontální, full width */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-50 via-white to-sky-50 border border-violet-100 shadow-sm px-8 py-10 flex flex-col sm:flex-row items-start gap-6">
        <span className="absolute top-4 right-16 text-primary/15 text-2xl pointer-events-none select-none">✦</span>
        <span className="absolute top-10 right-6 text-primary/10 text-lg pointer-events-none select-none">+</span>
        <span className="absolute bottom-4 left-1/3 text-primary/10 text-sm pointer-events-none select-none">✦</span>
        <span className="absolute bottom-8 right-20 text-primary/10 text-base pointer-events-none select-none">✦</span>
        <span className="absolute top-1/2 right-10 text-primary/10 text-xs pointer-events-none select-none">+</span>

        {/* Jméno + stats */}
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold tracking-[0.15em] text-muted-foreground mb-1">✦ PŘEHLED DÍTĚTE</p>
          <h2 className="font-bold text-3xl leading-tight text-foreground">Tomáš</h2>
          <div className="flex items-center gap-2 mt-1 mb-5">
            <p className="text-muted-foreground text-sm">4. ročník · aktivní</p>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
              <CheckCircle2 className="h-3 w-3" /> Propojeno
            </span>
          </div>
          <ChildActivityBadge mockStats={MOCK_STATS} compact />
        </div>

        {/* Akce */}
        <div className="flex flex-col gap-3 w-full sm:w-56 shrink-0 sm:self-end">
          <button
            className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-bold flex items-center justify-between px-4 shadow-md hover:shadow-lg active:scale-[0.98] transition-all text-sm"
            onClick={() => setAssignOpen(true)}
          >
            Chci zadat úkol
            <ArrowRight className="h-4 w-4 shrink-0" />
          </button>
        </div>
      </div>

      {/* Zadané úkoly */}
      <div className="bg-white rounded-3xl shadow-sm border border-black/[0.05] flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-border/40">
          <div className="flex items-center gap-2.5">
            <span className="text-rose-500">❤️</span>
            <h2 className="font-bold text-base text-foreground">Zadané úkoly</h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">Témata, která jste Tomášovi zadali k procvičení.</p>
        </div>
        <div className="p-4 h-[460px]">
          <AssignmentList
            mockAssignments={mockAssignments}
            onMockDelete={handleMockDelete}
            highlightSkillId={newSkillId}
          />
        </div>
      </div>

      {/* Samostatné procvičování */}
      <div className="bg-white rounded-3xl shadow-sm border border-black/[0.05] flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-border/40">
          <div className="flex items-center gap-2.5">
            <span className="text-blue-500">🧩</span>
            <h2 className="font-bold text-base text-foreground">Samostatné procvičování</h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">Co Tomáš procvičoval sám, bez vašeho zadání.</p>
        </div>
        <div className="px-4 h-[460px]">
          <ChildSessionLog mockSessions={MOCK_SESSIONS} />
        </div>
      </div>

      {/* Na co se zaměřit — full width */}
      <div className="bg-white rounded-3xl shadow-sm border border-black/[0.05] flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-border/40 flex items-center gap-2.5">
          <span className="text-violet-500">🎯</span>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-base text-foreground">Na co se zaměřit</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Opakující se chyby z posledních cvičení, na které stojí za to reagovat.</p>
          </div>
          <button
            className="h-8 rounded-xl bg-muted border border-border text-foreground font-semibold flex items-center gap-1.5 px-3 hover:bg-muted/80 active:scale-[0.98] transition-all text-xs shrink-0"
            onClick={() => navigate("/demo-report")}
          >
            Podrobné hodnocení
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="p-4">
          <ChildMisconceptions mockData={MOCK_MISCONCEPTIONS} childName="Tomáš" />
        </div>
      </div>

      {/* Přidat dítě */}
      <button onClick={() => navigate("/auth")} className="w-full rounded-3xl border-2 border-dashed border-border bg-white/60 hover:bg-white hover:border-primary/40 transition-all py-10 px-4 text-center group">
        <span className="grid h-12 w-12 mx-auto place-items-center rounded-2xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
          <Plus className="h-5 w-5" />
        </span>
        <p className="mt-3 font-bold text-foreground">Přidat dítě</p>
        <p className="mt-1 text-sm text-muted-foreground">Každé dítě má vlastní profil, kód a pokrok.</p>
      </button>

      <p className="text-center text-xs text-muted-foreground pt-2">
        Demo verze — data jsou ukázková.{" "}
        <button onClick={() => navigate("/auth")} className="text-violet-600 underline underline-offset-2">Registrujte se</button> pro plný přístup.
      </p>
    </div>
  );
}
