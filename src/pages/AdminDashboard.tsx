import { useState, useMemo, useEffect } from "react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getAllTopics } from "@/lib/contentRegistry";
import { getSubjectMeta } from "@/lib/subjectRegistry";
import { supabase } from "@/integrations/supabase/client";
import { useDbCurriculum, hasCodeGenerator } from "@/hooks/useDbCurriculum";
import { useAdminCurriculum } from "@/hooks/useAdminCurriculum";
import { getCategoryInfo } from "@/lib/categoryInfo";
import { getPrvoukaCategoryVisual, getPrvoukaTopicEmoji, getPrvoukaTopicVisual, getPrvoukaCategoryImageUrl, getPrvoukaTopicImageUrl } from "@/lib/prvoukaVisuals";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Pencil, Eye, X, Check, Sparkles, Save, RefreshCw, ChevronDown, ChevronUp, Download, Trash2, RotateCw } from "lucide-react";
import { useT } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { AdminAIChat, type CurriculumProposal } from "@/components/AdminAIChat";
import { AdminAIActions } from "@/components/AdminAIActions";
import { ProposalReview } from "@/components/ProposalReview";
import { ExerciseValidator } from "@/components/ExerciseValidator";
import { Search } from "lucide-react";
import type { TopicMetadata, Grade, PracticeTask } from "@/lib/types";
import { PracticeInputRouter } from "@/components/PracticeInputRouter";

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

type BrowseLevel = "subject" | "category" | "topic" | "subtopic" | "detail";

export default function AdminDashboard() {
  const t = useT();
  const allCodeTopics = useMemo(() => getAllTopics() as TopicMetadata[], []);
  const { mergedTopics, dbOnlyTopics, loading: dbLoading } = useDbCurriculum();
  const { subjects: dbSubjects, categories: dbCategories, topics: dbTopics, loading: adminLoading } = useAdminCurriculum();
  const [showDbOnly, setShowDbOnly] = useState(false);
  const allTopics = showDbOnly ? dbOnlyTopics : mergedTopics;

  const [level, setLevel] = useState<BrowseLevel>("subject");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<TopicMetadata | null>(null);
  const [gradeFilter, setGradeFilter] = useState<Grade | null>(null);
  const [proposals, setProposals] = useState<CurriculumProposal[] | null>(null);
  const [proposalExplanation, setProposalExplanation] = useState("");
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string | null>(null);
  const [qaAgentOpen, setQaAgentOpen] = useState(false);

  const handleAIAction = (prompt: string) => {
    setAiInitialPrompt(prompt);
    setAiChatOpen(true);
  };
  const topics = gradeFilter
    ? allTopics.filter((t) => gradeFilter >= t.gradeRange[0] && gradeFilter <= t.gradeRange[1])
    : allTopics;

  // Subjects: from filtered topics only (no extra DB merge that creates duplicates)
  const subjects = useMemo(() => {
    return [...new Set(topics.map((t) => t.subject))];
  }, [topics]);

  // Categories for selected subject
  const categories = useMemo(() => {
    if (!selectedSubject) return [];
    return [...new Set(topics.filter((t) => t.subject === selectedSubject).map((t) => t.category))];
  }, [selectedSubject, topics]);

  // Topic groups for selected category
  const topicGroups = useMemo(() => {
    if (!selectedSubject || !selectedCategory) return [];
    return [...new Set(
      topics
        .filter((t) => t.subject === selectedSubject && t.category === selectedCategory)
        .map((t) => t.topic)
    )];
  }, [selectedSubject, selectedCategory, topics]);

  const subtopics =
    selectedSubject && selectedCategory && selectedTopic
      ? topics.filter((t) => t.subject === selectedSubject && t.category === selectedCategory && t.topic === selectedTopic)
      : [];

  const handleBack = () => {
    if (level === "detail") { setSelectedSkill(null); setLevel("subtopic"); }
    else if (level === "subtopic") { setSelectedTopic(null); setLevel("topic"); }
    else if (level === "topic") { setSelectedCategory(null); setLevel("category"); }
    else if (level === "category") { setSelectedSubject(null); setLevel("subject"); }
  };

  const handleSubjectClick = (subject: string) => {
    setSelectedSubject(subject);
    setLevel("category");
  };
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setLevel("topic");
  };
  const handleTopicClick = (topicName: string) => {
    setSelectedTopic(topicName);
    setLevel("subtopic");
  };
  const handleSkillClick = (skill: TopicMetadata) => {
    setSelectedSkill(skill);
    setLevel("detail");
  };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const title =
    level === "subject" ? "Vyber předmět"
    : level === "category" ? capitalize(selectedSubject!)
    : level === "topic" ? capitalize(selectedCategory!)
    : level === "subtopic" ? capitalize(selectedTopic!)
    : selectedSkill?.title || "";

  const subtitle =
    level === "subject" ? "Co chceš dnes spravovat?"
    : level === "category" ? "Okruhy"
    : level === "topic" ? "Témata"
    : level === "subtopic" ? "Podtémata"
    : "Detail podtématu";

  // Build breadcrumbs
  const breadcrumbs = [];
  if (level !== "subject") breadcrumbs.push({ label: "Předměty", path: "#" });

  const grades: Grade[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <AdminLayout breadcrumbs={[{ label: "Správa obsahu" }]}>
      {/* Grade filter + AI button */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground font-medium">Ročník:</span>
          <Button
            size="sm"
            variant={gradeFilter === null ? "default" : "outline"}
            className="h-7 px-2 text-xs"
            onClick={() => setGradeFilter(null)}
          >
            Vše
          </Button>
          {grades.map((g) => (
            <Button
              key={g}
              size="sm"
              variant={gradeFilter === g ? "default" : "outline"}
              className="h-7 w-7 p-0 text-xs"
              onClick={() => setGradeFilter(g)}
            >
              {g}
            </Button>
          ))}
          <span className="text-muted-foreground/50 mx-1">|</span>
          <Button
            size="sm"
            variant={showDbOnly ? "default" : "outline"}
            className="h-7 px-3 text-xs"
            onClick={() => setShowDbOnly(!showDbOnly)}
          >
            {showDbOnly ? "Pouze DB" : "Vše (kód + DB)"}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            disabled={!gradeFilter}
            onClick={() => setQaAgentOpen(true)}
          >
            <Search className="h-4 w-4" />
            QA Agent
          </Button>
          <AdminAIChat
            grade={gradeFilter}
          subject={selectedSubject}
          category={selectedCategory}
          topic={selectedTopic}
          skillId={selectedSkill?.id}
          skillDetail={selectedSkill ? {
            name: selectedSkill.title,
            code_skill_id: selectedSkill.id,
            brief_description: selectedSkill.briefDescription,
            goals: selectedSkill.goals,
            boundaries: selectedSkill.boundaries,
            keywords: selectedSkill.keywords,
            help_hint: selectedSkill.helpTemplate?.hint,
            help_example: selectedSkill.helpTemplate?.example,
            help_common_mistake: selectedSkill.helpTemplate?.commonMistake,
            help_steps: selectedSkill.helpTemplate?.steps,
            grade_min: selectedSkill.gradeRange[0],
            grade_max: selectedSkill.gradeRange[1],
            session_task_count: selectedSkill.sessionTaskCount,
            input_type: selectedSkill.inputType,
          } : null}
          open={aiChatOpen}
          onOpenChange={setAiChatOpen}
          initialPrompt={aiInitialPrompt}
          onInitialPromptConsumed={() => setAiInitialPrompt(null)}
          onProposalsReady={(p, e) => {
            setProposals(p);
            setProposalExplanation(e);
          }}
          availableSubjects={subjects}
          />
        </div>
      </div>

      {/* QA Agent */}
      {gradeFilter && (
        <ExerciseValidator
          open={qaAgentOpen}
          onOpenChange={setQaAgentOpen}
          grade={gradeFilter}
        />
      )}

      {/* Back button + title */}
      {level !== "subject" && (
        <Button variant="ghost" size="sm" onClick={handleBack} className="gap-1 text-muted-foreground">
          <ChevronLeft className="h-4 w-4" /> Zpět
        </Button>
      )}

      <div className="space-y-1 text-center">
        <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
        {gradeFilter && <Badge variant="secondary" className="mt-1">{gradeFilter}. ročník</Badge>}
      </div>

      {/* Contextual AI Actions */}
      <AdminAIActions
        level={level}
        gradeFilter={gradeFilter}
        selectedSubject={selectedSubject}
        selectedCategory={selectedCategory}
        selectedTopic={selectedTopic}
        selectedSkill={selectedSkill}
        subjectCount={subjects.length}
        categoryCount={categories.length}
        topicCount={topicGroups.length}
        skillCount={subtopics.length}
        onAction={handleAIAction}
      />

      {/* SUBJECTS */}
      {level === "subject" && (
        <div className="grid gap-3">
          {subjects.map((subject) => {
            const count = new Set(topics.filter((t) => t.subject === subject).map((t) => t.category)).size;
            const meta = getSubjectMeta(subject);
            return (
              <Card
                key={subject}
                className={`cursor-pointer border-2 transition-colors hover:shadow-md ${meta.gradientClass} ${meta.borderClass}`}
                onClick={() => handleSubjectClick(subject)}
              >
                <CardContent className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {meta.image ? (
                        <img src={meta.image} alt="" className="w-14 h-14 object-contain mix-blend-multiply" />
                      ) : (
                        <span className="text-3xl">{meta.emoji}</span>
                      )}
                      <div>
                        <p className="text-xl font-medium capitalize text-foreground">{subject}</p>
                        <p className="text-sm text-muted-foreground">{count} {count === 1 ? "okruh" : count < 5 ? "okruhy" : "okruhů"}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  {meta.hook && (
                    <div className="rounded-md bg-accent/50 border border-border px-3 py-2">
                      <p className="text-sm text-foreground">💡 {meta.hook}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
          {subjects.length === 0 && (
            <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
              <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-foreground">
                    {gradeFilter ? `Pro ${gradeFilter}. ročník zatím není obsah` : "Žádný obsah"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Použijte AI asistenta k vytvoření kurikula{gradeFilter ? ` pro ${gradeFilter}. ročník` : ""}.
                  </p>
                </div>
                <Button onClick={() => setAiChatOpen(true)} className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Vytvořit s AI
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* CATEGORIES */}
      {level === "category" && (
        <div className="grid gap-3">
          {categories.map((category) => {
            const topicCount = new Set(topics.filter((t) => t.subject === selectedSubject && t.category === category).map((t) => t.topic)).size;
            const dbTopicCount = dbTopics.filter((t) => t.subject_name === selectedSubject && t.category_name === category).length;
            const count = Math.max(topicCount, dbTopicCount);
            const isEmpty = count === 0;
            const visual = getPrvoukaCategoryVisual(selectedSubject!, category);
            const catInfo = getCategoryInfo(selectedSubject!, category);
            return (
              <Card
                key={category}
                className={`cursor-pointer border-2 transition-all hover:shadow-md ${isEmpty ? "border-dashed border-muted-foreground/30" : ""} ${visual ? `${visual.gradientClass} ${visual.colorClass}` : "hover:bg-accent"}`}
                onClick={() => handleCategoryClick(category)}
              >
                <CardContent className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <ImageOrEmoji imageUrl={getPrvoukaCategoryImageUrl(selectedSubject!, category)} emoji={visual?.emoji} />
                      <div>
                        <p className="text-xl font-medium text-foreground">{capitalize(category)}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-muted-foreground">{count} {count === 1 ? "téma" : count < 5 ? "témata" : "témat"}</p>
                          {isEmpty && <Badge variant="outline" className="text-xs border-dashed">Prázdné</Badge>}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  {catInfo && (
                    <div className="rounded-md bg-accent/50 border border-border px-3 py-2">
                      <p className="text-sm text-foreground">💡 {catInfo.hook}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* TOPICS */}
      {level === "topic" && (
        <div className="grid gap-3">
          {topicGroups.map((topicName) => {
            const skillsInGroup = topics.filter(
              (t) => t.subject === selectedSubject && t.category === selectedCategory && t.topic === topicName
            );
            const count = skillsInGroup.length;
            const isEmpty = count === 0;
            const description = count > 0
              ? (count > 1
                ? (skillsInGroup[0]?.topicDescription ?? skillsInGroup[0]?.briefDescription ?? "")
                : (skillsInGroup[0]?.briefDescription ?? ""))
              : (dbTopics.find((t) => t.name === topicName && t.category_name === selectedCategory)?.description ?? "");
            const topicEmoji = getPrvoukaTopicEmoji(selectedSubject!, selectedCategory!, topicName);
            const topicVisual = getPrvoukaTopicVisual(selectedSubject!, selectedCategory!);
            return (
              <Card
                key={topicName}
                className={`cursor-pointer border-2 transition-all hover:shadow-md ${isEmpty ? "border-dashed border-muted-foreground/30" : ""} ${topicVisual ? `${topicVisual.gradientClass} ${topicVisual.colorClass}/60` : "hover:bg-accent"}`}
                onClick={() => handleTopicClick(topicName)}
              >
                <CardContent className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <ImageOrEmoji imageUrl={getPrvoukaTopicImageUrl(selectedSubject!, topicName)} emoji={topicEmoji} />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-medium text-foreground">{capitalize(topicName)}</p>
                        {isEmpty && <Badge variant="outline" className="text-xs border-dashed">Prázdné</Badge>}
                      </div>
                      {description && <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">{description}</p>}
                      {count > 1 && <p className="mt-0.5 text-xs text-muted-foreground">{count} {count < 5 ? "podtémata" : "podtémat"}</p>}
                      {isEmpty && <p className="mt-0.5 text-xs text-muted-foreground">0 podtémat</p>}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* SUBTOPICS (skills) */}
      {level === "subtopic" && (
        <div className="grid gap-3">
          {subtopics.map((skill) => {
            const isDbOnly = !hasCodeGenerator(skill);
            return (
              <Card
                key={skill.id}
                className="cursor-pointer border-2 transition-all hover:shadow-md hover:bg-accent"
                onClick={() => handleSkillClick(skill)}
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-medium text-foreground">{skill.title}</p>
                        {isDbOnly && (
                          <Badge variant="outline" className="text-xs border-amber-300 text-amber-700 bg-amber-50">
                            Bez generátoru
                          </Badge>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">{skill.briefDescription}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">{skill.gradeRange[0]}–{skill.gradeRange[1]}. ročník</Badge>
                        <Badge variant="secondary" className="text-xs">{INPUT_TYPE_LABELS[skill.inputType] ?? skill.inputType}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {subtopics.length === 0 && (
            <Card className="border-2 border-dashed border-muted-foreground/30">
              <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
                <div className="rounded-full bg-muted p-4">
                  <Sparkles className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-foreground">Zatím žádná podtémata</p>
                  <p className="text-sm text-muted-foreground">
                    Použijte AI asistenta k vytvoření podtémat pro toto téma.
                  </p>
                </div>
                <Button onClick={() => setAiChatOpen(true)} className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Vytvořit s AI
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* SKILL DETAIL */}
      {level === "detail" && selectedSkill && (
        <SkillDetail skill={selectedSkill} />
      )}

      {/* AI PROPOSALS */}
      {proposals && proposals.length > 0 && (
        <ProposalReview
          proposals={proposals}
          explanation={proposalExplanation}
          onDone={() => { setProposals(null); setProposalExplanation(""); }}
          onDismiss={() => { setProposals(null); setProposalExplanation(""); }}
          onNextAction={(prompt) => {
            handleAIAction(prompt);
          }}
        />
      )}
    </AdminLayout>
  );
}

// ── Skill detail view ─────────────────────────────
function SkillDetail({ skill }: { skill: TopicMetadata }) {
  const help = skill.helpTemplate;
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exerciseCounts, setExerciseCounts] = useState<{ simple: number; advanced: number; expert: number }>({ simple: 0, advanced: 0, expert: 0 });

  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any)
        .from("custom_exercises")
        .select("source")
        .eq("skill_id", skill.id)
        .eq("is_active", true);
      if (data) {
        const counts = { simple: 0, advanced: 0, expert: 0 };
        for (const row of data) {
          if (row.source === "simple") counts.simple++;
          else if (row.source === "advanced" || row.source === "ai") counts.advanced++;
          else if (row.source === "expert") counts.expert++;
        }
        setExerciseCounts(counts);
      }
    })();
  }, [skill.id]);
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

  const setField = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = {
        help_hint: form.help_hint || null,
        help_example: form.help_example || null,
        help_common_mistake: form.help_common_mistake || null,
        help_steps: form.help_steps.split("\n").map(s => s.trim()).filter(Boolean),
        keywords: form.keywords.split(",").map(k => k.trim()).filter(Boolean),
        goals: form.goals.split("\n").map(g => g.trim()).filter(Boolean),
        boundaries: form.boundaries.split("\n").map(b => b.trim()).filter(Boolean),
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
        toast({ description: "Dovednost ještě nemá záznam v databázi. Vytvořte ji přes databázovou správu.", variant: "destructive" });
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
    // Reset form from DB or code
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
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-foreground">{skill.title}</h3>
          {!editing ? (
            <Button size="sm" variant="outline" onClick={() => setEditing(true)} className="gap-1">
              <Pencil className="h-3 w-3" /> Upravit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1">
                <Save className="h-3 w-3" /> {saving ? "Ukládám…" : "Uložit"}
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>Zrušit</Button>
            </div>
          )}
        </div>
        {editing ? (
          <Textarea value={form.brief_description} onChange={e => setField("brief_description", e.target.value)} placeholder="Popis pro žáka" className="min-h-[50px]" />
        ) : (
          <p className="text-muted-foreground">{displayDescription}</p>
        )}
        <div className="flex gap-4 flex-wrap items-start">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-muted-foreground font-medium">Ročník</span>
            <Badge variant="outline">{skill.gradeRange[0]}–{skill.gradeRange[1]}. ročník</Badge>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-muted-foreground font-medium">Typ odpovědi</span>
            <Badge variant="secondary">{INPUT_TYPE_LABELS[skill.inputType] ?? skill.inputType}</Badge>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-muted-foreground font-medium">Počet úloh na procvičování</span>
            {editing ? (
              <Input
                type="number"
                min={1}
                max={100}
                value={form.session_task_count}
                onChange={e => setField("session_task_count", e.target.value)}
                className="w-20 h-8 text-sm"
              />
            ) : (
              <Badge variant="outline">📋 {dbRecord?.session_task_count ?? skill.sessionTaskCount ?? 6}</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Vysvětlení tématu */}
      <Separator className="mt-8 mb-4" />
      <Collapsible defaultOpen={false}>
        <CollapsibleTrigger className="flex items-center gap-2 w-full group cursor-pointer">
          <h4 className="text-sm font-semibold text-foreground">📋 Vysvětlení tématu</h4>
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="rounded-lg border p-4 space-y-6 mt-2">
            {/* Goals */}
            <Section title="🎯 Cíle">
              {editing ? (
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Každý cíl na nový řádek</Label>
                  <textarea className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[60px]" value={form.goals} onChange={e => setField("goals", e.target.value)} rows={3} />
                </div>
              ) : displayGoals.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {displayGoals.map((g: string, i: number) => <li key={i}>{g}</li>)}
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
                  <textarea className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[60px]" value={form.boundaries} onChange={e => setField("boundaries", e.target.value)} rows={3} />
                </div>
              ) : displayBoundaries.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                  {displayBoundaries.map((b: string, i: number) => <li key={i}>{b}</li>)}
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
                  <Input value={form.keywords} onChange={e => setField("keywords", e.target.value)} />
                </div>
              ) : displayKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {displayKeywords.map((kw: string, i: number) => (
                    <Badge key={i} variant="outline" className="text-xs">{kw}</Badge>
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
                  <Textarea value={form.help_hint} onChange={e => setField("help_hint", e.target.value)} placeholder="Krátká rada pro žáka" className="min-h-[60px]" />
                ) : (
                  <p className="text-muted-foreground">{displayHint || <span className="italic">—</span>}</p>
                )}
              </Section>

              <Section title="🧩 Jak na to (kroky)">
                {editing ? (
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Jeden krok na řádek</Label>
                    <Textarea value={form.help_steps} onChange={e => setField("help_steps", e.target.value)} placeholder="Krok 1&#10;Krok 2&#10;Krok 3" className="min-h-[80px]" />
                  </div>
                ) : displaySteps && displaySteps.length > 0 ? (
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    {displaySteps.map((s: string, i: number) => <li key={i}>{s}</li>)}
                  </ol>
                ) : (
                  <p className="text-muted-foreground italic text-sm">—</p>
                )}
              </Section>

              <Section title="✏️ Příklad">
                {editing ? (
                  <Input value={form.help_example} onChange={e => setField("help_example", e.target.value)} placeholder="42 + 37 = 79" />
                ) : (
                  <p className="text-muted-foreground font-mono text-sm">{displayExample || <span className="italic font-sans">—</span>}</p>
                )}
              </Section>

              <Section title="⚠️ Častá chyba">
                {editing ? (
                  <Input value={form.help_common_mistake} onChange={e => setField("help_common_mistake", e.target.value)} placeholder="Pozor na…" />
                ) : (
                  <p className="text-muted-foreground">{displayMistake || <span className="italic">—</span>}</p>
                )}
              </Section>

              {displayVisualExamples && displayVisualExamples.length > 0 && (
                <Section title="👀 Jak to vypadá">
                  {displayVisualExamples.map((ex, i) => {
                    if (typeof ex === "string") {
                      return (
                        <pre key={i} className="whitespace-pre-wrap font-mono text-sm text-muted-foreground leading-relaxed">
                          {ex}
                        </pre>
                      );
                    }
                    return (
                      <div key={i} className="rounded-lg border bg-secondary/50 p-3 space-y-1">
                        <p className="font-medium text-sm text-foreground">{ex.label}</p>
                        {ex.illustration && (
                          <pre className="whitespace-pre-wrap font-mono text-xs text-muted-foreground leading-relaxed">{ex.illustration}</pre>
                        )}
                        {ex.conclusion && (
                          <p className="text-sm font-medium text-primary">{ex.conclusion}</p>
                        )}
                      </div>
                    );
                  })}
                </Section>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Přehled cvičení */}
      <div className="space-y-1 mt-6">
        <h4 className="text-sm font-semibold text-foreground">📚 Přehled cvičení</h4>
        <Tabs defaultValue="simple" className="w-full">
          <TabsList className="w-full bg-muted/60 p-1.5 rounded-lg h-auto flex-col sm:flex-row">
            <TabsTrigger value="simple" className="flex-1 gap-1.5 py-2 text-sm data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:font-bold data-[state=inactive]:hover:bg-muted">📗 Základní (Level I) <span className="inline-flex items-center justify-center rounded-full bg-background/30 px-1.5 py-0.5 text-[10px] font-semibold min-w-[20px]">{exerciseCounts.simple}</span></TabsTrigger>
            <TabsTrigger value="advanced" className="flex-1 gap-1.5 py-2 text-sm data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:font-bold data-[state=inactive]:hover:bg-muted">📘 Pokročilá (Level II) <span className="inline-flex items-center justify-center rounded-full bg-background/30 px-1.5 py-0.5 text-[10px] font-semibold min-w-[20px]">{exerciseCounts.advanced}</span></TabsTrigger>
            <TabsTrigger value="expert" className="flex-1 gap-1.5 py-2 text-sm data-[state=active]:bg-red-500 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:font-bold data-[state=inactive]:hover:bg-muted">📕 Vysoká obtížnost (Level III) <span className="inline-flex items-center justify-center rounded-full bg-background/30 px-1.5 py-0.5 text-[10px] font-semibold min-w-[20px]">{exerciseCounts.expert}</span></TabsTrigger>
          </TabsList>

          <TabsContent value="simple">
            <SimpleExerciseTab skill={skill} />
          </TabsContent>

          <TabsContent value="advanced">
            <AdvancedExerciseTab skill={skill} />
          </TabsContent>

          <TabsContent value="expert">
            <ExpertExerciseTab skill={skill} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ── Exercise preview ─────────────────────────────
interface AITask {
  question: string;
  correct_answer: string;
  hints?: string[];
  solution_steps?: string[];
  options?: string[];
  _grade_validated?: boolean;
  _grade_rewritten?: boolean;
}

interface AIValidation {
  index: number;
  appropriate: boolean;
  reason?: string;
}

// ── Saved exercises list (shared) ──
function SavedExercisesList({ skillId, source, colorClass, label }: {
  skillId: string;
  source: "simple" | "advanced" | "expert";
  colorClass: string;
  label: string;
}) {
  const [saved, setSaved] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSaved = async () => {
    setLoading(true);
    const sourceFilter = source === "advanced" ? ["advanced", "ai"] : source === "expert" ? ["expert"] : [source];
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

  useEffect(() => { fetchSaved(); }, [skillId, source]);

  const handleDeactivate = async (id: string) => {
    const { error } = await (supabase as any)
      .from("custom_exercises")
      .update({ is_active: false })
      .eq("id", id);
    if (error) {
      toast({ description: "Nepodařilo se deaktivovat.", variant: "destructive" });
    } else {
      setSaved(prev => prev.filter(e => e.id !== id));
      toast({ description: "Cvičení deaktivováno ✓" });
    }
  };

  if (loading) return <p className="text-sm text-muted-foreground py-2">Načítám uložená cvičení…</p>;
  if (saved.length === 0) return null;

  return (
    <div className="space-y-3 mt-6">
      <h5 className="text-sm font-semibold text-foreground">{label} ({saved.length})</h5>
      {saved.map((ex) => (
        <div key={ex.id} className={`rounded-lg border ${colorClass} p-4 space-y-2`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="font-medium text-foreground">{ex.question}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge className="bg-green-100 text-green-800 border-green-200 text-[10px]">✅ V databázi</Badge>
              
            </div>
          </div>
          {ex.options && ex.options.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {ex.options.map((opt: string, j: number) => (
                <Badge key={j} variant={opt === ex.correct_answer ? "default" : "outline"}
                  className={opt === ex.correct_answer ? "bg-green-100 text-green-800 border-green-200" : ""}>{opt}</Badge>
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
          <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-100 space-y-1">
            <p className="font-bold text-green-800 text-sm">Odpověď pro žáka:</p>
            <p className="font-medium text-sm text-foreground">{ex.correct_answer}</p>
            {Array.isArray(ex.solution_steps) && (ex.solution_steps as string[]).length > 0 && (
              <div className="text-sm text-green-700 space-y-0.5 mt-1">
                <p className="font-semibold">Postup:</p>
                <ol className="list-decimal list-inside">
                  {(ex.solution_steps as string[]).map((step: string, i: number) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button size="sm" variant="ghost" onClick={() => handleDeactivate(ex.id)}
              className="gap-1 text-xs h-7 text-destructive hover:text-destructive hover:bg-destructive/10">
              <X className="h-3 w-3" /> Deaktivovat
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Simple Exercise Tab ──
function SimpleExerciseTab({ skill }: { skill: TopicMetadata }) {
  const [tasks, setTasks] = useState<PracticeTask[]>([]);
  const [simpleTasks, setSimpleTasks] = useState<AITask[]>([]);
  const [simpleLoading, setSimpleLoading] = useState(false);
  const [simpleError, setSimpleError] = useState<string | null>(null);
  const [simplePrompt, setSimplePrompt] = useState("");
  const { toast } = useToast();
  const [regenCount, setRegenCount] = useState(0);
  const hasGenerator = hasCodeGenerator(skill);
  const help = skill.helpTemplate;

  const generateSample = () => {
    if (!hasGenerator) return;
    try {
      const level = skill.defaultLevel ?? 1;
      const all = skill.generator(level);
      const shuffled = [...all].sort(() => Math.random() - 0.5);
      setTasks(shuffled);
      setRegenCount((c) => c + 1);
    } catch {
      setTasks([]);
    }
  };

  const triggerSimpleQuestions = async (replace = false) => {
    setSimpleLoading(true);
    setSimpleError(null);
    if (replace) setSimpleTasks([]);
    try {
      const { data, error } = await supabase.functions.invoke("ai-tutor", {
        body: {
          skill_label: skill.title,
          practice_type: skill.inputType || "result_only",
          current_level: skill.defaultLevel ?? 1,
          phase: "practice_batch",
          batch_size: 5,
          grade_min: skill.gradeRange[0],
          admin_prompt: simplePrompt || "Vygeneruj jednoduché, přímočaré úlohy na procvičení základní dovednosti. Žádné chytáky, žádné aplikační úlohy — čistý dril. Základní příklady, které žák řeší rutinně.",
        },
      });
      if (error) throw error;
      if (data?.error) { setSimpleError(data.error); return; }
      if (data?.tasks) {
        if (replace) setSimpleTasks(data.tasks);
        else setSimpleTasks(prev => [...prev, ...data.tasks]);
      }
    } catch (e: any) {
      setSimpleError(e?.message || "Nepodařilo se vygenerovat základní cvičení.");
    } finally {
      setSimpleLoading(false);
    }
  };

  useEffect(() => {
    generateSample();
  }, [skill.id]);

  return (
    <div className="space-y-3">
      <div className="rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
        <p>📗 Základní úlohy na dril — přímočaré, bez chytáků. {hasGenerator ? "Generátor vytváří variace automaticky." : ""} Uložené úlohy se zobrazí žákům.</p>
      </div>

      <div className="rounded-lg border-2 border-dashed border-green-200 bg-green-50/30 p-4 space-y-3">
        <h5 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-green-500" /> 📗 Generovat základní cvičení (Level I) pomocí AI
        </h5>
        <Textarea
          value={simplePrompt}
          onChange={(e) => setSimplePrompt(e.target.value)}
          placeholder="Např. &quot;zaměř se na přechod přes desítku&quot; nebo nechte prázdné pro výchozí."
          className="min-h-[60px] text-sm"
        />
        <Button
          size="sm"
          onClick={() => triggerSimpleQuestions(simpleTasks.length === 0)}
          disabled={simpleLoading}
          className="gap-1 bg-green-600 hover:bg-green-700 text-white"
        >
          <Sparkles className="h-3 w-3" />
          {simpleLoading ? "Generuji…" : simpleTasks.length > 0 ? "+ Další základní" : "Generovat základní"}
        </Button>
        {simpleError && <p className="text-sm text-destructive">{simpleError}</p>}
      </div>

      {simpleLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-2 justify-center">
          <RefreshCw className="h-4 w-4 animate-spin" /> Generuji základní úlohy…
        </div>
      )}

      {hasGenerator && tasks.length > 0 && (
        <div className="space-y-3">
          <h5 className="text-sm font-semibold text-muted-foreground">📗 Ukázky z generátoru ({tasks.length})</h5>
          {tasks.map((task, i) => (
            <TaskCard key={`${regenCount}-${i}`} index={i} task={task} help={help} skill={skill} />
          ))}
        </div>
      )}

      {simpleTasks.length > 0 && (
        <SimpleTasksList
          simpleTasks={simpleTasks}
          onUpdateTasks={setSimpleTasks}
          skillId={skill.id}
          gradeMin={skill.gradeRange[0]}
        />
      )}

      <SavedExercisesList skillId={skill.id} source="simple" colorClass="border-green-200 bg-green-50/20" label="📗 Uložená základní cvičení (Level I)" />
    </div>
  );
}

// ── Advanced Exercise Tab ──
function AdvancedExerciseTab({ skill }: { skill: TopicMetadata }) {
  const [aiTasks, setAiTasks] = useState<AITask[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiError, setAiError] = useState<string | null>(null);
  const { toast } = useToast();

  const triggerAdvancedQuestions = async (replace = false) => {
    setAiLoading(true);
    setAiError(null);
    if (replace) setAiTasks([]);
    try {
      const { data, error } = await supabase.functions.invoke("ai-tutor", {
        body: {
          skill_label: skill.title,
          practice_type: skill.inputType || "result_only",
          current_level: skill.defaultLevel ?? 1,
          phase: "practice_batch",
          batch_size: 5,
          grade_min: skill.gradeRange[0],
          admin_prompt: "Vygeneruj otázky, které jsou ODLIŠNÉ od standardních učebnicových otázek. Buď kreativní — použij praktické situace z běžného života, neobvyklé příklady, aplikační a logické úlohy. Žák by měl vidět něco nového, co ho překvapí.",
        },
      });
      if (error) throw error;
      if (data?.error) { setAiError(data.error); return; }
      if (data?.tasks) {
        if (replace) setAiTasks(data.tasks);
        else setAiTasks(prev => [...prev, ...data.tasks]);
      }
    } catch (e: any) {
      setAiError(e?.message || "Nepodařilo se vygenerovat pokročilá cvičení.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleAIGenerate = async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      const { data, error } = await supabase.functions.invoke("ai-tutor", {
        body: {
          skill_label: skill.title,
          practice_type: skill.inputType || "result_only",
          current_level: skill.defaultLevel ?? 1,
          phase: "practice_batch",
          batch_size: 5,
          grade_min: skill.gradeRange[0],
          admin_prompt: aiPrompt || "Vygeneruj otázky, které jsou ODLIŠNÉ od standardních učebnicových otázek. Buď kreativní — použij praktické situace z běžného života, neobvyklé příklady, aplikační a logické úlohy.",
        },
      });
      if (error) throw error;
      if (data?.error) { setAiError(data.error); return; }
      if (data?.tasks) setAiTasks(prev => [...prev, ...data.tasks]);
    } catch (e: any) {
      setAiError(e?.message || "Nepodařilo se vygenerovat cvičení.");
      toast({ description: "Chyba při generování cvičení.", variant: "destructive" });
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
        <p>📘 Kreativní, aplikační úlohy z reálného světa — neobvyklé příklady, které žáka překvapí a rozvíjí hlubší porozumění. Uložené úlohy se zobrazí žákům.</p>
      </div>

      <AIGenerateSection
        aiPrompt={aiPrompt}
        setAiPrompt={setAiPrompt}
        aiLoading={aiLoading}
        onGenerate={handleAIGenerate}
        aiError={aiError}
        aiTasks={aiTasks}
        skillId={skill.id}
        gradeMin={skill.gradeRange[0]}
        onUpdateTasks={setAiTasks}
        onAppendMore={() => triggerAdvancedQuestions(false)}
      />

      <SavedExercisesList skillId={skill.id} source="advanced" colorClass="border-purple-200 bg-purple-50/20" label="📘 Uložená pokročilá cvičení (Level II)" />
    </div>
  );
}
// ── Expert Exercise Tab (Level III) ──
function ExpertExerciseTab({ skill }: { skill: TopicMetadata }) {
  const [aiTasks, setAiTasks] = useState<AITask[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiError, setAiError] = useState<string | null>(null);
  const { toast } = useToast();

  const triggerExpertQuestions = async (replace = false) => {
    setAiLoading(true);
    setAiError(null);
    if (replace) setAiTasks([]);
    try {
      const { data, error } = await supabase.functions.invoke("ai-tutor", {
        body: {
          skill_label: skill.title,
          practice_type: skill.inputType || "result_only",
          current_level: Math.min((skill.defaultLevel ?? 1) + 1, 3),
          phase: "practice_batch",
          batch_size: 5,
          grade_min: skill.gradeRange[0],
          admin_prompt: aiPrompt || "Vygeneruj NEJTĚŽŠÍ možné úlohy pro toto téma. Úlohy musí být vícekrokové, kombinovat více konceptů a vyžadovat hluboké porozumění. Zahrň netriviální aplikace, úlohy s více mezikroky, chytáky a situace kde žák musí analyzovat problém z neobvyklého úhlu. Obtížnost musí být výrazně vyšší než u pokročilých cvičení.",
        },
      });
      if (error) throw error;
      if (data?.error) { setAiError(data.error); return; }
      if (data?.tasks) {
        if (replace) setAiTasks(data.tasks);
        else setAiTasks(prev => [...prev, ...data.tasks]);
      }
    } catch (e: any) {
      setAiError(e?.message || "Nepodařilo se vygenerovat expertní cvičení.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleAIGenerate = async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      const { data, error } = await supabase.functions.invoke("ai-tutor", {
        body: {
          skill_label: skill.title,
          practice_type: skill.inputType || "result_only",
          current_level: Math.min((skill.defaultLevel ?? 1) + 1, 3),
          phase: "practice_batch",
          batch_size: 5,
          grade_min: skill.gradeRange[0],
          admin_prompt: aiPrompt || "Vygeneruj NEJTĚŽŠÍ možné úlohy pro toto téma. Úlohy musí být vícekrokové, kombinovat více konceptů a vyžadovat hluboké porozumění. Zahrň netriviální aplikace, úlohy s více mezikroky, chytáky a situace kde žák musí analyzovat problém z neobvyklého úhlu.",
        },
      });
      if (error) throw error;
      if (data?.error) { setAiError(data.error); return; }
      if (data?.tasks) setAiTasks(prev => [...prev, ...data.tasks]);
    } catch (e: any) {
      setAiError(e?.message || "Nepodařilo se vygenerovat cvičení.");
      toast({ description: "Chyba při generování cvičení.", variant: "destructive" });
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
        <p>📕 Nejtěžší úlohy — vícekrokové, kombinující více konceptů, vyžadující hluboké porozumění a analytické myšlení. Uložené úlohy se zobrazí žákům.</p>
      </div>

      <ExpertAIGenerateSection
        aiPrompt={aiPrompt}
        setAiPrompt={setAiPrompt}
        aiLoading={aiLoading}
        onGenerate={handleAIGenerate}
        aiError={aiError}
        aiTasks={aiTasks}
        skillId={skill.id}
        gradeMin={skill.gradeRange[0]}
        onUpdateTasks={setAiTasks}
        onAppendMore={() => triggerExpertQuestions(false)}
      />

      <SavedExercisesList skillId={skill.id} source="expert" colorClass="border-red-200 bg-red-50/20" label="📕 Uložená expertní cvičení (Level III)" />
    </div>
  );
}

// ── Expert AI Generation section ──
function ExpertAIGenerateSection({
  aiPrompt, setAiPrompt, aiLoading, onGenerate, aiError, aiTasks, skillId, gradeMin, onUpdateTasks, onAppendMore
}: {
  aiPrompt: string;
  setAiPrompt: (v: string) => void;
  aiLoading: boolean;
  onGenerate: () => void;
  aiError: string | null;
  aiTasks: AITask[];
  skillId: string;
  gradeMin?: number;
  onUpdateTasks?: (tasks: AITask[]) => void;
  onAppendMore?: () => void;
}) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [savedIndices, setSavedIndices] = useState<Set<number>>(new Set());
  const [reformulatingIndex, setReformulatingIndex] = useState<number | null>(null);

  const handleSaveTask = async (task: AITask, index: number) => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const { error } = await (supabase as any)
        .from("custom_exercises")
        .insert({
          skill_id: skillId,
          question: task.question,
          correct_answer: task.correct_answer,
          hints: task.hints || [],
          solution_steps: task.solution_steps || [],
          options: task.options || [],
          source: "expert",
          created_by: user.id,
        });
      if (error) throw error;
      setSavedIndices(prev => new Set([...prev, index]));
      toast({ description: "Cvičení uloženo ✓" });
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
      const rows = aiTasks.map((task) => ({
        skill_id: skillId,
        question: task.question,
        correct_answer: task.correct_answer,
        hints: task.hints || [],
        solution_steps: task.solution_steps || [],
        options: task.options || [],
        source: "expert",
        created_by: user.id,
      }));
      const { error } = await (supabase as any).from("custom_exercises").insert(rows);
      if (error) throw error;
      setSavedIndices(new Set(aiTasks.map((_, i) => i)));
      toast({ description: `Uloženo ${aiTasks.length} expertních cvičení ✓` });
    } catch (e: any) {
      toast({ description: e?.message || "Nepodařilo se uložit.", variant: "destructive" });
    }
    setSaving(false);
  };

  const handleDeleteTask = (index: number) => {
    const updated = aiTasks.filter((_, i) => i !== index);
    onUpdateTasks?.(updated);
    const newSaved = new Set<number>();
    savedIndices.forEach(si => {
      if (si < index) newSaved.add(si);
      else if (si > index) newSaved.add(si - 1);
    });
    setSavedIndices(newSaved);
    toast({ description: "Otázka odstraněna" });
  };

  const handleReformulate = async (task: AITask, index: number) => {
    setReformulatingIndex(index);
    try {
      const { data, error } = await supabase.functions.invoke("ai-tutor", {
        body: {
          skill_label: task.question.slice(0, 50),
          practice_type: "result_only",
          current_level: 3,
          phase: "practice_batch",
          batch_size: 1,
          grade_min: gradeMin ?? 3,
          admin_prompt: `Přeformuluj tuto otázku úplně jinak, zachovej stejné téma ale zvyš obtížnost na maximum. Původní otázka: "${task.question}" (správná odpověď: ${task.correct_answer})`,
        },
      });
      if (error) throw error;
      if (data?.tasks?.[0]) {
        const updated = [...aiTasks];
        updated[index] = data.tasks[0];
        onUpdateTasks?.(updated);
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

  return (
    <div className="space-y-3 mt-4">
      <div className="rounded-lg border-2 border-dashed border-red-200 bg-red-50/30 p-4 space-y-3">
        <h5 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-red-500" /> 📕 Generovat expertní cvičení (Level III) pomocí AI
        </h5>
        <Textarea
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          placeholder="Např. &quot;vícekrokové úlohy kombinující zlomky a procenta&quot; nebo nechte prázdné pro výchozí."
          className="min-h-[60px] text-sm"
        />
        <Button
          size="sm"
          onClick={onGenerate}
          disabled={aiLoading}
          className="gap-1 bg-red-600 hover:bg-red-700 text-white"
        >
          <Sparkles className="h-3 w-3" />
          {aiLoading ? "Generuji…" : "Generovat expertní"}
        </Button>
        {aiError && (
          <p className="text-sm text-destructive">{aiError}</p>
        )}
      </div>

      {aiLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-4 justify-center">
          <RefreshCw className="h-4 w-4 animate-spin" />
          AI přemýšlí nad nejtěžšími otázkami…
        </div>
      )}

      {aiTasks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h5 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-red-500" /> 📕 Expertní cvičení – Level III ({aiTasks.length})
            </h5>
            <div className="flex gap-2">
              {onAppendMore && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onAppendMore}
                  disabled={aiLoading}
                  className="gap-1"
                >
                  <Sparkles className={`h-3 w-3 ${aiLoading ? "animate-spin" : ""}`} />
                  + Další expertní
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={handleSaveAll}
                disabled={saving || savedIndices.size === aiTasks.length}
                className="gap-1"
              >
                <Download className="h-3 w-3" />
                {savedIndices.size === aiTasks.length ? "Vše uloženo ✓" : "Uložit vše do DB"}
              </Button>
            </div>
          </div>
          {aiTasks.map((task, i) => (
            <div key={`expert-${i}`} className="rounded-lg border border-red-200 bg-red-50/30 overflow-hidden">
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
                <Badge className="bg-red-100 text-red-700 border-red-200 text-[10px]">
                  📕 Expertní
                </Badge>
              </div>
              <TaskCard index={i} task={task} isAI />
              <div className="flex items-center justify-end gap-1 px-4 pb-3 pt-1 border-t border-red-100">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteTask(i)}
                  disabled={saving}
                  className="gap-1 text-xs h-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3 w-3" /> Smazat
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleReformulate(task, i)}
                  disabled={saving || reformulatingIndex === i}
                  className="gap-1 text-xs h-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <RotateCw className={`h-3 w-3 ${reformulatingIndex === i ? "animate-spin" : ""}`} /> Přeformulovat
                </Button>
                <Button
                  size="sm"
                  variant={savedIndices.has(i) ? "secondary" : "outline"}
                  onClick={() => handleSaveTask(task, i)}
                  disabled={saving || savedIndices.has(i)}
                  className="gap-1 text-xs h-7"
                >
                  {savedIndices.has(i) ? <><Check className="h-3 w-3" /> Uloženo</> : <><Download className="h-3 w-3" /> Uložit</>}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


function ExerciseInputPreview({ task, skill }: { task: PracticeTask; skill?: TopicMetadata }) {
  const dummyTopic: TopicMetadata = skill ?? {
    id: "", title: "", subject: "", category: "", topic: "", briefDescription: "",
    keywords: [], goals: [], boundaries: [], gradeRange: [3, 3],
    inputType: "text", generator: () => [], helpTemplate: { hint: "", steps: [], commonMistake: "", example: "" },
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

// ── Task card (shared for code-generated and AI tasks) ──
function TaskCard({ index, task, help, isAI, skill }: {
  index: number;
  task: PracticeTask | AITask;
  help?: TopicMetadata["helpTemplate"];
  isAI?: boolean;
  skill?: TopicMetadata;
}) {
  const [showPreview, setShowPreview] = useState(false);
  const question = task.question;
  const correctAnswer = "correctAnswer" in task ? task.correctAnswer : (task as AITask).correct_answer;
  const hints = "hints" in task ? task.hints : undefined;
  const solutionSteps = "solutionSteps" in task ? task.solutionSteps : ("solution_steps" in task ? (task as AITask).solution_steps : undefined);
  const options = task.options;
  const items = "items" in task ? (task as PracticeTask).items : undefined;

  // Build a PracticeTask for the preview
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

      {/* Student input preview */}
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

      {/* Student feedback section — what the student sees after answering */}
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

// ── Simple tasks list (for AI-generated simple exercises) ──
function SimpleTasksList({ simpleTasks, onUpdateTasks, skillId, gradeMin }: {
  simpleTasks: AITask[];
  onUpdateTasks: (tasks: AITask[]) => void;
  skillId: string;
  gradeMin?: number;
}) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [savedIndices, setSavedIndices] = useState<Set<number>>(new Set());

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const rows = simpleTasks.map((task) => ({
        skill_id: skillId,
        question: task.question,
        correct_answer: task.correct_answer,
        hints: task.hints || [],
        solution_steps: task.solution_steps || [],
        options: task.options || [],
        source: "simple",
        created_by: user.id,
      }));
      const { error } = await (supabase as any).from("custom_exercises").insert(rows);
      if (error) throw error;
      setSavedIndices(new Set(simpleTasks.map((_, i) => i)));
      toast({ description: `Uloženo ${simpleTasks.length} základních cvičení ✓` });
    } catch (e: any) {
      toast({ description: e?.message || "Nepodařilo se uložit.", variant: "destructive" });
    }
    setSaving(false);
  };

  const handleSaveTask = async (task: AITask, index: number) => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const { error } = await (supabase as any).from("custom_exercises").insert({
        skill_id: skillId,
        question: task.question,
        correct_answer: task.correct_answer,
        hints: task.hints || [],
        solution_steps: task.solution_steps || [],
        options: task.options || [],
        source: "simple",
        created_by: user.id,
      });
      if (error) throw error;
      setSavedIndices(prev => new Set([...prev, index]));
      toast({ description: "Cvičení uloženo ✓" });
    } catch (e: any) {
      toast({ description: e?.message || "Nepodařilo se uložit.", variant: "destructive" });
    }
    setSaving(false);
  };

  const handleDeleteTask = (index: number) => {
    const updated = simpleTasks.filter((_, i) => i !== index);
    onUpdateTasks(updated);
    const newSaved = new Set<number>();
    savedIndices.forEach(si => {
      if (si < index) newSaved.add(si);
      else if (si > index) newSaved.add(si - 1);
    });
    setSavedIndices(newSaved);
    toast({ description: "Otázka odstraněna" });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end">
        <Button
          size="sm"
          variant="outline"
          onClick={handleSaveAll}
          disabled={saving || savedIndices.size === simpleTasks.length}
          className="gap-1"
        >
          <Download className="h-3 w-3" />
          {savedIndices.size === simpleTasks.length ? "Vše uloženo ✓" : "Uložit vše do DB"}
        </Button>
      </div>
      {simpleTasks.map((task, i) => (
        <div key={`simple-${i}`} className="rounded-lg border border-green-200 bg-green-50/30 overflow-hidden">
          <div className="flex justify-end gap-1 px-4 pt-3">
            <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px]">
              📗 Základní (Level I)
            </Badge>
          </div>
          <TaskCard index={i} task={task} />
          <div className="flex items-center justify-end gap-1 px-4 pb-3 pt-1 border-t border-green-100">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDeleteTask(i)}
              disabled={saving}
              className="gap-1 text-xs h-7 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-3 w-3" /> Smazat
            </Button>
            <Button
              size="sm"
              variant={savedIndices.has(i) ? "secondary" : "outline"}
              onClick={() => handleSaveTask(task, i)}
              disabled={saving || savedIndices.has(i)}
              className="gap-1 text-xs h-7"
            >
              {savedIndices.has(i) ? <><Check className="h-3 w-3" /> Uloženo</> : <><Download className="h-3 w-3" /> Uložit</>}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── AI Generation section ──
function AIGenerateSection({
  aiPrompt, setAiPrompt, aiLoading, onGenerate, aiError, aiTasks, skillId, gradeMin, onUpdateTasks, onAppendMore
}: {
  aiPrompt: string;
  setAiPrompt: (v: string) => void;
  aiLoading: boolean;
  onGenerate: () => void;
  aiError: string | null;
  aiTasks: AITask[];
  skillId: string;
  gradeMin?: number;
  onUpdateTasks?: (tasks: AITask[]) => void;
  onAppendMore?: () => void;
}) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [savedIndices, setSavedIndices] = useState<Set<number>>(new Set());
  const [reformulatingIndex, setReformulatingIndex] = useState<number | null>(null);

  const handleSaveTask = async (task: AITask, index: number) => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await (supabase as any)
        .from("custom_exercises")
        .insert({
          skill_id: skillId,
          question: task.question,
          correct_answer: task.correct_answer,
          hints: task.hints || [],
          solution_steps: task.solution_steps || [],
          options: task.options || [],
          source: "advanced",
          created_by: user.id,
        });
      if (error) throw error;
      setSavedIndices(prev => new Set([...prev, index]));
      toast({ description: "Cvičení uloženo ✓" });
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

      const rows = aiTasks.map((task) => ({
        skill_id: skillId,
        question: task.question,
        correct_answer: task.correct_answer,
        hints: task.hints || [],
        solution_steps: task.solution_steps || [],
        options: task.options || [],
        source: "advanced",
        created_by: user.id,
      }));

      const { error } = await (supabase as any)
        .from("custom_exercises")
        .insert(rows);
      if (error) throw error;
      setSavedIndices(new Set(aiTasks.map((_, i) => i)));
      toast({ description: `Uloženo ${aiTasks.length} cvičení ✓` });
    } catch (e: any) {
      toast({ description: e?.message || "Nepodařilo se uložit.", variant: "destructive" });
    }
    setSaving(false);
  };

  const handleDeleteTask = (index: number) => {
    const updated = aiTasks.filter((_, i) => i !== index);
    onUpdateTasks?.(updated);
    // Adjust saved indices
    const newSaved = new Set<number>();
    savedIndices.forEach(si => {
      if (si < index) newSaved.add(si);
      else if (si > index) newSaved.add(si - 1);
    });
    setSavedIndices(newSaved);
    toast({ description: "Otázka odstraněna" });
  };

  const handleReformulate = async (task: AITask, index: number) => {
    setReformulatingIndex(index);
    try {
      const { data, error } = await supabase.functions.invoke("ai-tutor", {
        body: {
          skill_label: task.question.slice(0, 50),
          practice_type: "result_only",
          current_level: 1,
          phase: "practice_batch",
          batch_size: 1,
          grade_min: gradeMin ?? 3,
          admin_prompt: `Přeformuluj tuto otázku úplně jinak, zachovej stejné téma a obtížnost ale změň kontext a formulaci. Původní otázka: "${task.question}" (správná odpověď: ${task.correct_answer})`,
        },
      });
      if (error) throw error;
      if (data?.tasks?.[0]) {
        const updated = [...aiTasks];
        updated[index] = data.tasks[0];
        onUpdateTasks?.(updated);
        // Remove from saved if it was saved
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

  return (
    <div className="space-y-3 mt-4">
      <div className="rounded-lg border-2 border-dashed border-purple-200 bg-purple-50/30 p-4 space-y-3">
        <h5 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-500" /> 📘 Generovat pokročilá cvičení (Level II) pomocí AI
        </h5>
        <Textarea
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          placeholder="Např. &quot;5 příkladů na sčítání do 1000 s přechodem přes desítku&quot; nebo nechte prázdné pro výchozí."
          className="min-h-[60px] text-sm"
        />
        <Button
          size="sm"
          onClick={onGenerate}
          disabled={aiLoading}
          className="gap-1"
        >
          <Sparkles className="h-3 w-3" />
          {aiLoading ? "Generuji…" : "Generovat pokročilá"}
        </Button>
        {aiError && (
          <p className="text-sm text-destructive">{aiError}</p>
        )}
      </div>

      {aiLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-4 justify-center">
          <RefreshCw className="h-4 w-4 animate-spin" />
          AI přemýšlí nad novými otázkami…
        </div>
      )}

      {aiTasks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h5 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" /> 📘 Pokročilá cvičení – Level II ({aiTasks.length})
            </h5>
            <div className="flex gap-2">
              {onAppendMore && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onAppendMore}
                  disabled={aiLoading}
                  className="gap-1"
                >
                  <Sparkles className={`h-3 w-3 ${aiLoading ? "animate-spin" : ""}`} />
                  + Další pokročilá
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={handleSaveAll}
                disabled={saving || savedIndices.size === aiTasks.length}
                className="gap-1"
              >
                <Download className="h-3 w-3" />
                {savedIndices.size === aiTasks.length ? "Vše uloženo ✓" : "Uložit vše do DB"}
              </Button>
            </div>
          </div>
          {aiTasks.map((task, i) => (
            <div key={`ai-${i}`} className="rounded-lg border border-purple-200 bg-purple-50/30 overflow-hidden">
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
                <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-[10px]">
                  📘 Pokročilé
                </Badge>
              </div>
              <TaskCard index={i} task={task} isAI />
              <div className="flex items-center justify-end gap-1 px-4 pb-3 pt-1 border-t border-purple-100">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteTask(i)}
                  disabled={saving}
                  className="gap-1 text-xs h-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3 w-3" /> Smazat
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleReformulate(task, i)}
                  disabled={saving || reformulatingIndex === i}
                  className="gap-1 text-xs h-7 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                >
                  <RotateCw className={`h-3 w-3 ${reformulatingIndex === i ? "animate-spin" : ""}`} /> Přeformulovat
                </Button>
                <Button
                  size="sm"
                  variant={savedIndices.has(i) ? "secondary" : "outline"}
                  onClick={() => handleSaveTask(task, i)}
                  disabled={saving || savedIndices.has(i)}
                  className="gap-1 text-xs h-7"
                >
                  {savedIndices.has(i) ? <><Check className="h-3 w-3" /> Uloženo</> : <><Download className="h-3 w-3" /> Uložit</>}
                </Button>
              </div>
            </div>
          ))}

        </div>
      )}
    </div>
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

function ImageOrEmoji({ imageUrl, emoji, size = "md" }: { imageUrl: string | null; emoji?: string | null; size?: "lg" | "md" | "sm" }) {
  const [failed, setFailed] = useState(false);
  const sizes = { lg: "w-14 h-14", md: "w-12 h-12", sm: "w-10 h-10" };
  const emojiSizes = { lg: "text-3xl", md: "text-2xl", sm: "text-xl" };

  if (imageUrl && !failed) {
    return <img src={imageUrl} alt="" className={`${sizes[size]} object-contain shrink-0 mix-blend-multiply`} onError={() => setFailed(true)} />;
  }
  if (emoji) return <span className={emojiSizes[size]}>{emoji}</span>;
  return null;
}
