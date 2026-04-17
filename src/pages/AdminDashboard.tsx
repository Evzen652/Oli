import { useState, useMemo } from "react";
import { getAllTopics } from "@/lib/contentRegistry";
import { getSubjectMeta } from "@/lib/subjectRegistry";
import { useDbCurriculum, hasCodeGenerator } from "@/hooks/useDbCurriculum";
import { useAdminCurriculum } from "@/hooks/useAdminCurriculum";
import { getCategoryInfo } from "@/lib/categoryInfo";
import {
  getPrvoukaCategoryVisual,
  getPrvoukaTopicEmoji,
  getPrvoukaTopicVisual,
  getPrvoukaCategoryImageUrl,
  getPrvoukaTopicImageUrl,
} from "@/lib/prvoukaVisuals";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Eye, Sparkles, PanelLeftClose, PanelLeft } from "lucide-react";
import { type CurriculumProposal } from "@/components/AdminAIChat";
import { AdminAIActions } from "@/components/AdminAIActions";
import { ProposalReview } from "@/components/ProposalReview";
import { OnboardingHero } from "@/components/admin/OnboardingHero";
import { SkillDetail } from "@/components/admin/SkillDetail";
import { AdminCurriculumSidebar } from "@/components/admin/AdminCurriculumSidebar";
import { AdminAIPanel } from "@/components/admin/AdminAIPanel";
import type { TopicMetadata, Grade } from "@/lib/types";

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
  const { mergedTopics } = useDbCurriculum();
  const { topics: dbTopics } = useAdminCurriculum();
  const allTopics = mergedTopics;

  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<TopicMetadata | null>(null);
  const [gradeFilter, setGradeFilter] = useState<Grade | null>(null);
  const [proposals, setProposals] = useState<CurriculumProposal[] | null>(null);
  const [proposalExplanation, setProposalExplanation] = useState("");
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Derived browse level
  const level: BrowseLevel = selectedSkill
    ? "detail"
    : selectedTopic
    ? "subtopic"
    : selectedCategory
    ? "topic"
    : selectedSubject
    ? "category"
    : "subject";

  const handleAIAction = (prompt: string) => {
    setAiInitialPrompt(prompt);
    setAiChatOpen(true);
  };

  const topics = gradeFilter
    ? allTopics.filter((t) => gradeFilter >= t.gradeRange[0] && gradeFilter <= t.gradeRange[1])
    : allTopics;

  const subjects = useMemo(() => [...new Set(topics.map((t) => t.subject))], [topics]);

  const categories = useMemo(() => {
    if (!selectedSubject) return [];
    return [...new Set(topics.filter((t) => t.subject === selectedSubject).map((t) => t.category))];
  }, [selectedSubject, topics]);

  const topicGroups = useMemo(() => {
    if (!selectedSubject || !selectedCategory) return [];
    return [
      ...new Set(
        topics
          .filter((t) => t.subject === selectedSubject && t.category === selectedCategory)
          .map((t) => t.topic),
      ),
    ];
  }, [selectedSubject, selectedCategory, topics]);

  const subtopics =
    selectedSubject && selectedCategory && selectedTopic
      ? topics.filter(
          (t) => t.subject === selectedSubject && t.category === selectedCategory && t.topic === selectedTopic,
        )
      : [];

  const handleSubjectClick = (subject: string) => {
    setSelectedSubject(subject);
  };
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };
  const handleTopicClick = (topicName: string) => {
    setSelectedTopic(topicName);
  };
  const handleSkillClick = (skill: TopicMetadata) => {
    setSelectedSkill(skill);
  };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const title =
    level === "subject"
      ? "Vyber předmět"
      : level === "category"
      ? capitalize(selectedSubject!)
      : level === "topic"
      ? capitalize(selectedCategory!)
      : level === "subtopic"
      ? capitalize(selectedTopic!)
      : selectedSkill?.title || "";

  const subtitle =
    level === "subject"
      ? "Co chceš dnes spravovat?"
      : level === "category"
      ? "Okruhy"
      : level === "topic"
      ? "Témata"
      : level === "subtopic"
      ? "Podtémata"
      : "Detail podtématu";

  const grades: Grade[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <AdminLayout breadcrumbs={[{ label: "Správa obsahu" }]}>
      <div className="flex gap-4 -mx-4 sm:-mx-6" style={{ minHeight: "calc(100vh - 200px)" }}>
        {/* ═══════ Sidebar (curriculum tree) ═══════ */}
        {sidebarOpen && (
          <aside className="w-64 shrink-0 hidden lg:block">
            <div className="sticky top-4 h-[calc(100vh-220px)]">
              <AdminCurriculumSidebar
                topics={topics}
                selectedSubject={selectedSubject}
                selectedCategory={selectedCategory}
                selectedTopic={selectedTopic}
                selectedSkill={selectedSkill}
                onSelectSubject={setSelectedSubject}
                onSelectCategory={setSelectedCategory}
                onSelectTopic={setSelectedTopic}
                onSelectSkill={setSelectedSkill}
              />
            </div>
          </aside>
        )}

        {/* ═══════ Main content ═══════ */}
        <div className="flex-1 min-w-0 space-y-4 px-4 sm:px-6">
          {/* Grade filter (kompaktní, bez AI button — přesunuto na FAB) */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Sidebar toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hidden lg:flex"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title={sidebarOpen ? "Skrýt sidebar" : "Zobrazit sidebar"}
            >
              {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
            </Button>
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
          </div>

          {/* Sticky breadcrumb — kde v kurikulu jsem */}
          <ContextBreadcrumb
            subject={selectedSubject}
            category={selectedCategory}
            topic={selectedTopic}
            skill={selectedSkill}
            grade={gradeFilter}
            onSelectRoot={() => {
              setSelectedSubject(null);
              setSelectedCategory(null);
              setSelectedTopic(null);
              setSelectedSkill(null);
            }}
            onSelectSubject={() => {
              setSelectedCategory(null);
              setSelectedTopic(null);
              setSelectedSkill(null);
            }}
            onSelectCategory={() => {
              setSelectedTopic(null);
              setSelectedSkill(null);
            }}
            onSelectTopic={() => {
              setSelectedSkill(null);
            }}
          />

          {/* Title + subtitle (bez backbutton — navigace přes breadcrumb a sidebar) */}
          <div className="space-y-1 text-center">
            <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
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
                            <p className="text-sm text-muted-foreground">
                              {count} {count === 1 ? "okruh" : count < 5 ? "okruhy" : "okruhů"}
                            </p>
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
                <OnboardingHero
                  gradeFilter={gradeFilter}
                  onStartWithPrompt={(prompt) => handleAIAction(prompt)}
                  onOpenWizard={() => setAiChatOpen(true)}
                />
              )}
            </div>
          )}

          {/* CATEGORIES */}
          {level === "category" && (
            <div className="grid gap-3">
              {categories.map((category) => {
                const topicCount = new Set(
                  topics.filter((t) => t.subject === selectedSubject && t.category === category).map((t) => t.topic),
                ).size;
                const dbTopicCount = dbTopics.filter(
                  (t) => t.subject_name === selectedSubject && t.category_name === category,
                ).length;
                const count = Math.max(topicCount, dbTopicCount);
                const isEmpty = count === 0;
                const visual = getPrvoukaCategoryVisual(selectedSubject!, category);
                const catInfo = getCategoryInfo(selectedSubject!, category);
                return (
                  <Card
                    key={category}
                    className={`cursor-pointer border-2 transition-all hover:shadow-md ${
                      isEmpty ? "border-dashed border-muted-foreground/30" : ""
                    } ${visual ? `${visual.gradientClass} ${visual.colorClass}` : "hover:bg-accent"}`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    <CardContent className="p-5 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <ImageOrEmoji
                            imageUrl={getPrvoukaCategoryImageUrl(selectedSubject!, category)}
                            emoji={visual?.emoji}
                          />
                          <div>
                            <p className="text-xl font-medium text-foreground">{capitalize(category)}</p>
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-muted-foreground">
                                {count} {count === 1 ? "téma" : count < 5 ? "témata" : "témat"}
                              </p>
                              {isEmpty && (
                                <Badge variant="outline" className="text-xs border-dashed">
                                  Prázdné
                                </Badge>
                              )}
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
                  (t) => t.subject === selectedSubject && t.category === selectedCategory && t.topic === topicName,
                );
                const count = skillsInGroup.length;
                const isEmpty = count === 0;
                const description =
                  count > 0
                    ? count > 1
                      ? skillsInGroup[0]?.topicDescription ?? skillsInGroup[0]?.briefDescription ?? ""
                      : skillsInGroup[0]?.briefDescription ?? ""
                    : dbTopics.find((t) => t.name === topicName && t.category_name === selectedCategory)?.description ?? "";
                const topicEmoji = getPrvoukaTopicEmoji(selectedSubject!, selectedCategory!, topicName);
                const topicVisual = getPrvoukaTopicVisual(selectedSubject!, selectedCategory!);
                return (
                  <Card
                    key={topicName}
                    className={`cursor-pointer border-2 transition-all hover:shadow-md ${
                      isEmpty ? "border-dashed border-muted-foreground/30" : ""
                    } ${topicVisual ? `${topicVisual.gradientClass} ${topicVisual.colorClass}/60` : "hover:bg-accent"}`}
                    onClick={() => handleTopicClick(topicName)}
                  >
                    <CardContent className="flex items-center justify-between p-5">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <ImageOrEmoji
                          imageUrl={getPrvoukaTopicImageUrl(selectedSubject!, topicName)}
                          emoji={topicEmoji}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-lg font-medium text-foreground">{capitalize(topicName)}</p>
                            {isEmpty && (
                              <Badge variant="outline" className="text-xs border-dashed">
                                Prázdné
                              </Badge>
                            )}
                          </div>
                          {description && (
                            <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">{description}</p>
                          )}
                          {count > 1 && (
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {count} {count < 5 ? "podtémata" : "podtémat"}
                            </p>
                          )}
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
                              <Badge
                                variant="outline"
                                className="text-xs border-amber-300 text-amber-700 bg-amber-50"
                              >
                                Bez šablony
                              </Badge>
                            )}
                          </div>
                          <p className="mt-0.5 text-sm text-muted-foreground">{skill.briefDescription}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {skill.gradeRange[0]}–{skill.gradeRange[1]}. ročník
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {INPUT_TYPE_LABELS[skill.inputType] ?? skill.inputType}
                            </Badge>
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
          {level === "detail" && selectedSkill && <SkillDetail skill={selectedSkill} />}

          {/* AI PROPOSALS */}
          {proposals && proposals.length > 0 && (
            <ProposalReview
              proposals={proposals}
              explanation={proposalExplanation}
              onDone={() => {
                setProposals(null);
                setProposalExplanation("");
              }}
              onDismiss={() => {
                setProposals(null);
                setProposalExplanation("");
              }}
              onNextAction={(prompt) => {
                handleAIAction(prompt);
              }}
            />
          )}
        </div>
      </div>

      {/* ═══════ Floating AI button (FAB) — vždy přístupné ═══════ */}
      <button
        onClick={() => setAiChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 h-14 w-14 sm:h-16 sm:w-16 rounded-full shadow-lg shadow-primary/30 bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        title="Otevřít AI asistenta"
        aria-label="AI asistent"
      >
        <Sparkles className="h-6 w-6 sm:h-7 sm:w-7" />
      </button>

      {/* ═══════ AdminAIPanel (controlled — trigger je FAB výš) ═══════ */}
      <AdminAIPanel
        grade={gradeFilter}
        subject={selectedSubject}
        category={selectedCategory}
        topic={selectedTopic}
        skillId={selectedSkill?.id}
        skillDetail={
          selectedSkill
            ? {
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
              }
            : null
        }
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
    </AdminLayout>
  );
}

// ── ContextBreadcrumb ─────────────────────────────
function ContextBreadcrumb({
  subject, category, topic, skill, grade,
  onSelectRoot, onSelectSubject, onSelectCategory, onSelectTopic,
}: {
  subject: string | null;
  category: string | null;
  topic: string | null;
  skill: TopicMetadata | null;
  grade: Grade | null;
  onSelectRoot: () => void;
  onSelectSubject: () => void;
  onSelectCategory: () => void;
  onSelectTopic: () => void;
}) {
  // Don't render if at root with no grade
  if (!subject && !grade) return null;

  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-2 bg-background/85 backdrop-blur-md border-b border-border/60">
      <div className="flex items-center gap-1.5 text-sm flex-wrap">
        <button
          onClick={onSelectRoot}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          📚 Kurikulum
        </button>
        {subject && (
          <>
            <span className="text-muted-foreground/40">›</span>
            <button
              onClick={onSelectSubject}
              className={`hover:text-foreground transition-colors ${
                category || topic || skill ? "text-muted-foreground" : "text-foreground font-medium"
              }`}
            >
              {cap(subject)}
            </button>
          </>
        )}
        {category && (
          <>
            <span className="text-muted-foreground/40">›</span>
            <button
              onClick={onSelectCategory}
              className={`hover:text-foreground transition-colors ${
                topic || skill ? "text-muted-foreground" : "text-foreground font-medium"
              }`}
            >
              {cap(category)}
            </button>
          </>
        )}
        {topic && (
          <>
            <span className="text-muted-foreground/40">›</span>
            <button
              onClick={onSelectTopic}
              className={`hover:text-foreground transition-colors ${
                skill ? "text-muted-foreground" : "text-foreground font-medium"
              }`}
            >
              {cap(topic)}
            </button>
          </>
        )}
        {skill && (
          <>
            <span className="text-muted-foreground/40">›</span>
            <span className="text-foreground font-medium truncate">{skill.title}</span>
          </>
        )}
        {grade && (
          <Badge variant="secondary" className="ml-auto text-[10px] h-5 shrink-0">
            {grade}. ročník
          </Badge>
        )}
      </div>
    </div>
  );
}

// ── Helpers ─────────────────────────────
function ImageOrEmoji({
  imageUrl,
  emoji,
  size = "md",
}: {
  imageUrl: string | null;
  emoji?: string | null;
  size?: "lg" | "md" | "sm";
}) {
  const [failed, setFailed] = useState(false);
  const sizes = { lg: "w-14 h-14", md: "w-12 h-12", sm: "w-10 h-10" };
  const emojiSizes = { lg: "text-3xl", md: "text-2xl", sm: "text-xl" };

  if (imageUrl && !failed) {
    return (
      <img
        src={imageUrl}
        alt=""
        className={`${sizes[size]} object-contain shrink-0 mix-blend-multiply`}
        onError={() => setFailed(true)}
      />
    );
  }
  if (emoji) return <span className={emojiSizes[size]}>{emoji}</span>;
  return null;
}
