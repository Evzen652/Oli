import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Check, AlertTriangle, Loader2, Play, ChevronDown, ChevronUp, CheckCircle2, ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import type { Grade } from "@/lib/types";

interface ValidationResult {
  exercise_id: string;
  status: "OK" | "POTŘEBA_ÚPRAV";
  problems: string[];
  fixes?: {
    question?: string;
    correct_answer?: string;
    hints?: string[];
    solution_steps?: string[];
  };
  note: string;
  originalQuestion?: string;
  originalAnswer?: string;
}

interface SkillValidation {
  skillId: string;
  skillName: string;
  codeSkillId: string;
  results: ValidationResult[];
  status: "pending" | "running" | "done" | "error";
  error?: string;
}

interface ExerciseValidatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  grade: Grade;
  /** When true, renders body only (without Sheet wrapper) — for embedding in AdminAIPanel */
  hideSheet?: boolean;
}

interface CurriculumItem {
  id: string;
  name: string;
}

export function ExerciseValidator({ open, onOpenChange, grade, hideSheet }: ExerciseValidatorProps) {
  const { toast } = useToast();
  const [skills, setSkills] = useState<SkillValidation[]>([]);
  const [running, setRunning] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [expandedExercises, setExpandedExercises] = useState<Set<string>>(new Set());
  const [appliedFixes, setAppliedFixes] = useState<Set<string>>(new Set());
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  // Cascade filter state
  const [subjects, setSubjects] = useState<CurriculumItem[]>([]);
  const [categories, setCategories] = useState<CurriculumItem[]>([]);
  const [topics, setTopics] = useState<CurriculumItem[]>([]);
  const [skillsList, setSkillsList] = useState<(CurriculumItem & { topic_id: string; category_id?: string; subject_id?: string })[]>([]);

  const [selectedSubject, setSelectedSubject] = useState<string>("__all__");
  const [selectedCategory, setSelectedCategory] = useState<string>("__all__");
  const [selectedTopic, setSelectedTopic] = useState<string>("__all__");
  const [selectedSkill, setSelectedSkill] = useState<string>("__all__");

  // Load curriculum hierarchy when open
  useEffect(() => {
    if (!open) return;
    (async () => {
      const [subRes, catRes, topRes, skillRes] = await Promise.all([
        (supabase as any).from("curriculum_subjects").select("id, name").order("sort_order"),
        (supabase as any).from("curriculum_categories").select("id, name, subject_id").order("sort_order"),
        (supabase as any).from("curriculum_topics").select("id, name, category_id").order("sort_order"),
        (supabase as any)
          .from("curriculum_skills")
          .select("id, name, code_skill_id, topic_id")
          .lte("grade_min", grade)
          .gte("grade_max", grade)
          .eq("is_active", true)
          .order("sort_order"),
      ]);
      setSubjects(subRes.data || []);

      // Enrich categories / topics / skills with parent ids for cascading
      const catsRaw = catRes.data || [];
      const topsRaw = topRes.data || [];
      const skillsRaw = skillRes.data || [];

      // Map topic_id → category_id, category_id → subject_id
      const topToCat: Record<string, string> = {};
      topsRaw.forEach((t: any) => { topToCat[t.id] = t.category_id; });
      const catToSub: Record<string, string> = {};
      catsRaw.forEach((c: any) => { catToSub[c.id] = c.subject_id; });

      // Only keep categories that have at least one topic with skills in this grade
      const topicIdsWithSkills = new Set(skillsRaw.map((s: any) => s.topic_id));
      const catIdsWithSkills = new Set<string>();
      topsRaw.forEach((t: any) => { if (topicIdsWithSkills.has(t.id)) catIdsWithSkills.add(t.category_id); });
      const subIdsWithSkills = new Set<string>();
      catsRaw.forEach((c: any) => { if (catIdsWithSkills.has(c.id)) subIdsWithSkills.add(c.subject_id); });

      setSubjects((subRes.data || []).filter((s: any) => subIdsWithSkills.has(s.id)));
      setCategories(catsRaw.filter((c: any) => catIdsWithSkills.has(c.id)));
      setTopics(topsRaw.filter((t: any) => topicIdsWithSkills.has(t.id)));
      setSkillsList(skillsRaw.map((s: any) => ({
        ...s,
        topic_id: s.topic_id,
        category_id: topToCat[s.topic_id],
        subject_id: catToSub[topToCat[s.topic_id]],
      })));
    })();
  }, [open, grade]);

  // Reset child filters when parent changes
  useEffect(() => { setSelectedCategory("__all__"); setSelectedTopic("__all__"); setSelectedSkill("__all__"); }, [selectedSubject]);
  useEffect(() => { setSelectedTopic("__all__"); setSelectedSkill("__all__"); }, [selectedCategory]);
  useEffect(() => { setSelectedSkill("__all__"); }, [selectedTopic]);

  // Filtered options for cascade
  const filteredCategories = useMemo(() => {
    if (selectedSubject === "__all__") return categories;
    return categories.filter((c: any) => c.subject_id === selectedSubject);
  }, [categories, selectedSubject]);

  const filteredTopics = useMemo(() => {
    if (selectedCategory === "__all__") {
      if (selectedSubject === "__all__") return topics;
      const catIds = new Set(filteredCategories.map(c => c.id));
      return topics.filter((t: any) => catIds.has(t.category_id));
    }
    return topics.filter((t: any) => t.category_id === selectedCategory);
  }, [topics, selectedCategory, selectedSubject, filteredCategories]);

  const filteredSkills = useMemo(() => {
    if (selectedTopic !== "__all__") return skillsList.filter(s => s.topic_id === selectedTopic);
    if (selectedCategory !== "__all__") {
      const topIds = new Set(filteredTopics.map(t => t.id));
      return skillsList.filter(s => topIds.has(s.topic_id));
    }
    if (selectedSubject !== "__all__") {
      const catIds = new Set(filteredCategories.map(c => c.id));
      return skillsList.filter(s => s.category_id && catIds.has(s.category_id));
    }
    return skillsList;
  }, [skillsList, selectedTopic, selectedCategory, selectedSubject, filteredTopics, filteredCategories]);

  const totalExercises = skills.reduce((sum, s) => sum + s.results.length, 0);
  const okCount = skills.reduce((sum, s) => sum + s.results.filter(r => r.status === "OK").length, 0);
  const fixCount = skills.reduce((sum, s) => sum + s.results.filter(r => r.status === "POTŘEBA_ÚPRAV").length, 0);
  const unappliedCount = fixCount - appliedFixes.size;
  const doneSkills = skills.filter(s => s.status === "done").length;
  const progress = skills.length > 0 ? (doneSkills / skills.length) * 100 : 0;
  const finishedSkills = skills.filter(s => s.status === "done" || s.status === "error").length;
  const validationDone = skills.length > 0 && !running && finishedSkills === skills.length;

  // Auto-expand all exercises with problems when validation completes
  const prevRunning = useRef(running);
  useEffect(() => {
    if (prevRunning.current && !running && skills.length > 0) {
      const problemIds = new Set<string>();
      skills.forEach(s => s.results.forEach(r => {
        if (r.status === "POTŘEBA_ÚPRAV") problemIds.add(r.exercise_id);
      }));
      setExpandedExercises(problemIds);
    }
    prevRunning.current = running;
  }, [running, skills]);

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    if (!nextOpen && (running || unappliedCount > 0)) {
      setShowCloseConfirm(true);
      return;
    }
    onOpenChange(nextOpen);
  }, [running, unappliedCount, onOpenChange]);

  const startValidation = useCallback(async () => {
    setRunning(true);
    setAppliedFixes(new Set());
    setExpandedExercises(new Set());

    // Determine which skills to validate based on filters
    let targetSkills: typeof filteredSkills;
    if (selectedSkill !== "__all__") {
      targetSkills = filteredSkills.filter(s => s.id === selectedSkill);
    } else {
      targetSkills = filteredSkills;
    }

    if (targetSkills.length === 0) {
      toast({ title: "Žádné podtéma", description: "Pro zvolený filtr neexistují žádná podtémata", variant: "destructive" });
      setRunning(false);
      return;
    }

    const initialSkills: SkillValidation[] = targetSkills.map((s: any) => ({
      skillId: s.id,
      skillName: s.name,
      codeSkillId: s.code_skill_id,
      results: [],
      status: "pending" as const,
    }));
    setSkills(initialSkills);

    for (let i = 0; i < initialSkills.length; i++) {
      setCurrentIdx(i);
      const skill = initialSkills[i];
      setSkills(prev => prev.map((s, idx) => idx === i ? { ...s, status: "running" } : s));

      try {
        const { data: exercises } = await (supabase as any)
          .from("custom_exercises")
          .select("id, question, correct_answer, hints, solution_steps, options")
          .eq("skill_id", skill.codeSkillId)
          .eq("is_active", true);

        if (!exercises || exercises.length === 0) {
          setSkills(prev => prev.map((s, idx) => idx === i ? { ...s, status: "done", results: [] } : s));
          continue;
        }

        // Build a map of exercise_id → original data
        const exerciseMap: Record<string, { question: string; correct_answer: string }> = {};
        exercises.forEach((ex: any) => {
          exerciseMap[ex.id] = { question: ex.question, correct_answer: ex.correct_answer };
        });

        const { data, error } = await supabase.functions.invoke("exercise-validator", {
          body: { grade, skillId: skill.codeSkillId, skillName: skill.skillName, exercises },
        });

        if (error) throw new Error(error.message);
        const rawResults: ValidationResult[] = data?.results || [];

        // Enrich results with original question/answer
        const results = rawResults.map(r => ({
          ...r,
          originalQuestion: exerciseMap[r.exercise_id]?.question,
          originalAnswer: exerciseMap[r.exercise_id]?.correct_answer,
        }));

        setSkills(prev => prev.map((s, idx) => idx === i ? { ...s, status: "done", results } : s));
      } catch (err: any) {
        console.error(`Validation failed for ${skill.skillName}:`, err);
        setSkills(prev => prev.map((s, idx) => idx === i ? { ...s, status: "error", error: err.message } : s));
      }

      if (i < initialSkills.length - 1) {
        await new Promise(r => setTimeout(r, 1500));
      }
    }

    setCurrentIdx(-1);
    setRunning(false);
    toast({ title: "Validace dokončena", description: `Zkontrolováno ${initialSkills.length} dovedností` });
  }, [grade, toast, filteredSkills, selectedSkill]);

  const applyFix = useCallback(async (result: ValidationResult) => {
    if (!result.fixes) return;
    const updates: Record<string, any> = {};
    if (result.fixes.question) updates.question = result.fixes.question;
    if (result.fixes.correct_answer) updates.correct_answer = result.fixes.correct_answer;
    if (result.fixes.hints) updates.hints = result.fixes.hints;
    if (result.fixes.solution_steps) updates.solution_steps = result.fixes.solution_steps;
    if (Object.keys(updates).length === 0) return;

    const { error } = await (supabase as any)
      .from("custom_exercises")
      .update(updates)
      .eq("id", result.exercise_id);

    if (error) {
      toast({ title: "Chyba", description: "Nepodařilo se uložit opravu", variant: "destructive" });
      return;
    }
    setAppliedFixes(prev => new Set(prev).add(result.exercise_id));
    toast({ title: "Opraveno ✅", description: "Cvičení bylo aktualizováno" });
  }, [toast]);

  const applyAllFixes = useCallback(async () => {
    const toFix = skills
      .flatMap(s => s.results)
      .filter(r => r.status === "POTŘEBA_ÚPRAV" && r.fixes && !appliedFixes.has(r.exercise_id));
    for (const result of toFix) {
      await applyFix(result);
    }
  }, [skills, appliedFixes, applyFix]);

  const toggleExpand = (id: string) => {
    setExpandedExercises(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleExpandAll = () => {
    const problemIds = skills.flatMap(s => s.results).filter(r => r.status === "POTŘEBA_ÚPRAV").map(r => r.exercise_id);
    if (problemIds.length === 0) return;
    const allExpanded = problemIds.every(id => expandedExercises.has(id));
    setExpandedExercises(allExpanded ? new Set() : new Set(problemIds));
  };

  const allProblemsExpanded = (() => {
    const problemIds = skills.flatMap(s => s.results).filter(r => r.status === "POTŘEBA_ÚPRAV").map(r => r.exercise_id);
    return problemIds.length > 0 && problemIds.every(id => expandedExercises.has(id));
  })();

  // Inner body — shared between standalone (Sheet) and embedded (AdminAIPanel) usage
  const body = (
    <>
      <div className="px-6 py-3 space-y-3">
            {/* Cascade filters */}
            {!running && (
              <div className="grid grid-cols-2 gap-2">
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Předmět" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">Všechny předměty</SelectItem>
                    {subjects.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={filteredCategories.length === 0}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Kategorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">Všechny kategorie</SelectItem>
                    {filteredCategories.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedTopic} onValueChange={setSelectedTopic} disabled={filteredTopics.length === 0}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Téma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">Všechna témata</SelectItem>
                    {filteredTopics.map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedSkill} onValueChange={setSelectedSkill} disabled={filteredSkills.length === 0}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Podtéma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">Všechna podtémata ({filteredSkills.length})</SelectItem>
                    {filteredSkills.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Summary bar */}
            {skills.length > 0 && (
              <div className="flex items-center gap-3 text-sm flex-wrap">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  ✅ {okCount} OK
                </Badge>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  ⚠️ {fixCount} k opravě
                </Badge>
                {appliedFixes.size > 0 && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    ✏️ {appliedFixes.size} aplikováno
                  </Badge>
                )}
                <Badge variant="secondary">
                  ⏳ {skills.filter(s => s.status === "pending").length} čeká
                </Badge>
                {running && (
                  <span className="text-xs text-muted-foreground ml-auto">
                    {doneSkills}/{skills.length} dovedností
                  </span>
                )}
              </div>
            )}

            {/* Progress */}
            {running && <Progress value={progress} className="h-2" />}
            {running && currentIdx >= 0 && currentIdx < skills.length && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Kontroluji: {skills[currentIdx].skillName} ({currentIdx + 1}/{skills.length})
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-2 flex-wrap">
              <Button onClick={startValidation} disabled={running} className="gap-2">
                {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                {running ? "Probíhá validace…" : skills.length > 0 ? "Spustit znovu" : "Spustit validaci"}
              </Button>
              {fixCount > 0 && !running && (
                <Button variant="outline" onClick={toggleExpandAll} size="sm" className="gap-1">
                  {allProblemsExpanded ? <ChevronsDownUp className="h-4 w-4" /> : <ChevronsUpDown className="h-4 w-4" />}
                  {allProblemsExpanded ? "Sbalit vše" : "Rozbalit vše"}
                </Button>
              )}
            </div>

            {/* Prominent "Apply All" banner */}
            {validationDone && unappliedCount > 0 && (
              <Card className="border-2 border-green-400 bg-green-50">
                <CardContent className="p-3 flex items-center justify-between gap-3">
                  <div className="text-sm">
                    <span className="font-semibold text-green-800">
                      {unappliedCount} cvičení čeká na opravu
                    </span>
                    <p className="text-xs text-green-700 mt-0.5">
                      Klikněte pro hromadné aplikování všech navržených oprav
                    </p>
                  </div>
                  <Button onClick={applyAllFixes} className="bg-green-600 hover:bg-green-700 text-white gap-2 shrink-0">
                    <CheckCircle2 className="h-4 w-4" />
                    Aplikovat vše ({unappliedCount})
                  </Button>
                </CardContent>
              </Card>
            )}

            {validationDone && unappliedCount === 0 && fixCount > 0 && (
              <Card className="border-2 border-green-400 bg-green-50">
                <CardContent className="p-3 text-center text-sm font-semibold text-green-800">
                  ✅ Všechny opravy byly aplikovány
                </CardContent>
              </Card>
            )}
          </div>

          <Separator />

          {/* Results */}
          <ScrollArea className="flex-1 px-6 py-3">
            <div className="space-y-4 pb-6">
              {skills.map((skill) => (
                <div key={skill.skillId}>
                  <div className="flex items-center gap-2 mb-2">
                    {skill.status === "running" && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                    {skill.status === "done" && <Check className="h-4 w-4 text-green-600" />}
                    {skill.status === "error" && <AlertTriangle className="h-4 w-4 text-destructive" />}
                    {skill.status === "pending" && <span className="h-4 w-4 rounded-full border-2 border-muted-foreground/30 inline-block" />}
                    <span className="text-sm font-medium">{skill.skillName}</span>
                    {skill.status === "done" && skill.results.length > 0 && (
                      <span className="text-xs text-muted-foreground ml-auto">
                        {skill.results.filter(r => r.status === "OK").length}/{skill.results.length} OK
                      </span>
                    )}
                    {skill.status === "done" && skill.results.length === 0 && (
                      <span className="text-xs text-muted-foreground ml-auto">Žádná cvičení</span>
                    )}
                    {skill.status === "error" && (
                      <span className="text-xs text-destructive ml-auto">{skill.error}</span>
                    )}
                  </div>

                  {skill.results.filter(r => r.status === "POTŘEBA_ÚPRAV").map((result) => {
                    const isExpanded = expandedExercises.has(result.exercise_id);
                    const isApplied = appliedFixes.has(result.exercise_id);
                    return (
                      <Card key={result.exercise_id} className={`ml-6 mb-2 border ${isApplied ? "border-green-300 bg-green-50/50" : "border-amber-300 bg-amber-50/50"}`}>
                        <CardContent className="p-3 space-y-2">
                          <div
                            className="flex items-start justify-between cursor-pointer"
                            onClick={() => toggleExpand(result.exercise_id)}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                {isApplied ? (
                                  <Badge className="bg-green-600 text-white text-[10px] px-1.5">Opraveno</Badge>
                                ) : (
                                  <Badge variant="destructive" className="text-[10px] px-1.5">Úprava</Badge>
                                )}
                              </div>
                              {/* Original question displayed prominently */}
                              {result.originalQuestion && (
                                <p className="text-sm font-semibold text-foreground mt-1 leading-snug">
                                  {result.originalQuestion}
                                </p>
                              )}
                              {result.originalAnswer && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  Odpověď: <span className="font-medium text-foreground">{result.originalAnswer}</span>
                                </p>
                              )}
                              <span className="text-[10px] text-muted-foreground/60 block mt-0.5">
                                {result.exercise_id.slice(0, 8)}…
                              </span>
                              <ul className="mt-1 space-y-0.5">
                                {result.problems.map((p, pi) => (
                                  <li key={pi} className="text-xs text-foreground">• {p}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="flex items-center gap-1 shrink-0 ml-2">
                              {/* Always-visible apply button */}
                              {result.fixes && !isApplied && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs gap-1 border-green-400 text-green-700 hover:bg-green-50"
                                  onClick={(e) => { e.stopPropagation(); applyFix(result); }}
                                >
                                  <Check className="h-3 w-3" /> Opravit
                                </Button>
                              )}
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="space-y-2 pt-2 border-t border-border">
                              {result.note && (
                                <p className="text-xs italic text-muted-foreground">📝 {result.note}</p>
                              )}
                              {result.fixes && (
                                <div className="space-y-1.5 text-xs">
                                  {result.fixes.question && (
                                    <div>
                                      <span className="font-medium text-foreground">Otázka → </span>
                                      <span className="text-foreground">{result.fixes.question}</span>
                                    </div>
                                  )}
                                  {result.fixes.correct_answer && (
                                    <div>
                                      <span className="font-medium text-foreground">Odpověď → </span>
                                      <span className="text-foreground">{result.fixes.correct_answer}</span>
                                    </div>
                                  )}
                                  {result.fixes.hints && result.fixes.hints.length >= 2 && (
                                    <div>
                                      <span className="font-medium text-foreground">Malá nápověda → </span>
                                      <span className="text-foreground">{result.fixes.hints[0]}</span>
                                      <br />
                                      <span className="font-medium text-foreground">Velká nápověda → </span>
                                      <span className="text-foreground">{result.fixes.hints[1]}</span>
                                    </div>
                                  )}
                                  {result.fixes.solution_steps && (
                                    <div>
                                      <span className="font-medium text-foreground">Vysvětlení → </span>
                                      <ol className="list-decimal list-inside text-foreground">
                                        {result.fixes.solution_steps.map((s, si) => (
                                          <li key={si}>{s}</li>
                                        ))}
                                      </ol>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ))}

              {skills.length === 0 && !running && (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-lg mb-2">🔍</p>
                  <p className="text-sm">Vyberte filtry a klikněte na "Spustit validaci"</p>
                  <p className="text-xs mt-1">Agent zkontroluje logiku, nápovědy i vysvětlení u každého cvičení</p>
                </div>
              )}
            </div>
          </ScrollArea>
    </>
  );

  // Embedded mode (inside AdminAIPanel): just the body, no Sheet/AlertDialog wrappers
  if (hideSheet) {
    return <div className="flex flex-col h-full">{body}</div>;
  }

  return (
    <>
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-2xl p-0 flex flex-col">
          <SheetHeader className="p-6 pb-0">
            <SheetTitle className="flex items-center gap-2">
              🔍 Kontrola cvičení — {grade}. ročník
            </SheetTitle>
          </SheetHeader>
          {body}
        </SheetContent>
      </Sheet>

      {/* Close confirmation dialog */}
      <AlertDialog open={showCloseConfirm} onOpenChange={setShowCloseConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Zavřít kontrolu cvičení?</AlertDialogTitle>
            <AlertDialogDescription>
              {running
                ? "Validace stále běží. Pokud panel zavřete, výsledky se ztratí."
                : `Máte ${unappliedCount} neaplikovaných oprav. Pokud panel zavřete, výsledky se ztratí.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zůstat</AlertDialogCancel>
            <AlertDialogAction onClick={() => onOpenChange(false)}>
              Zavřít přesto
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
