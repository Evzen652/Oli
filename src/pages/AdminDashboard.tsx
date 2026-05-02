import { useState, useMemo } from "react";
import { useImageVersions } from "@/lib/imageVersions";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronRight, Eye, Sparkles, PanelLeftClose, PanelLeft, Search, ShieldCheck, Image as ImageIcon } from "lucide-react";
import { type CurriculumProposal } from "@/components/AdminAIChat";
import { ProposalReview } from "@/components/ProposalReview";
import { OnboardingHero } from "@/components/admin/OnboardingHero";
import { SkillDetail } from "@/components/admin/SkillDetail";
import { AdminCurriculumSidebar } from "@/components/admin/AdminCurriculumSidebar";
import { AdminAIPanel } from "@/components/admin/AdminAIPanel";
import { AdminContentAudit } from "@/components/admin/AdminContentAudit";
import { AdminGenerateIllustrations } from "@/components/admin/AdminGenerateIllustrations";
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
  const [aiPanelTab, setAiPanelTab] = useState<"create" | "check">("create");
  // Když uživatel klikne explicitně na "AI asistent" / "AI kontrola" tlačítko,
  // chceme schovat tab switcher (jen ten jeden mód). FAB neuzamyká.
  const [aiPanelLocked, setAiPanelLocked] = useState<"create" | "check" | undefined>(undefined);
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

  // Grade change: keep valid parts of the selection, reset invalid ones.
  const handleGradeChange = (newGrade: Grade | null) => {
    setGradeFilter(newGrade);

    // Compute which topics will be visible after the grade change
    const newTopics = newGrade
      ? allTopics.filter((t) => newGrade >= t.gradeRange[0] && newGrade <= t.gradeRange[1])
      : allTopics;

    // If currently selected skill isn't in the new filter → drop it
    if (selectedSkill && !newTopics.some((t) => t.id === selectedSkill.id)) {
      setSelectedSkill(null);
    }
    // If selected topic has no skills in the new grade → drop it (and parent chain down to it)
    if (selectedTopic && !newTopics.some(
      (t) => t.subject === selectedSubject && t.category === selectedCategory && t.topic === selectedTopic,
    )) {
      setSelectedTopic(null);
      setSelectedSkill(null);
    }
    // Category
    if (selectedCategory && !newTopics.some(
      (t) => t.subject === selectedSubject && t.category === selectedCategory,
    )) {
      setSelectedCategory(null);
      setSelectedTopic(null);
      setSelectedSkill(null);
    }
    // Subject
    if (selectedSubject && !newTopics.some((t) => t.subject === selectedSubject)) {
      setSelectedSubject(null);
      setSelectedCategory(null);
      setSelectedTopic(null);
      setSelectedSkill(null);
    }
  };

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
      <div className="flex gap-6 lg:gap-8" style={{ minHeight: "calc(100vh - 200px)" }}>
        {/* ═══════ Sidebar (curriculum tree) ═══════ */}
        {sidebarOpen && (
          <aside className="w-72 xl:w-80 shrink-0 hidden lg:block">
            <div className="sticky top-4 h-[calc(100vh-220px)]">
              <AdminCurriculumSidebar
                topics={topics}
                gradeFilter={gradeFilter}
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
        <div className="flex-1 min-w-0 space-y-4">
          {/* Top bar — Notion vibe: Ročník + AI akce vpravo */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Sidebar toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hidden lg:flex rounded-lg text-muted-foreground hover:text-foreground"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title={sidebarOpen ? "Skrýt sidebar" : "Zobrazit sidebar"}
            >
              {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
            </Button>

            {/* Ročník selector pill — výrazný, Notion-vibe pill grupa */}
            <div className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-2 py-1 shadow-soft-1">
              <span className="text-xs font-medium text-muted-foreground pl-2">Ročník</span>
              <div className="flex items-center gap-0.5">
                {grades.map((g) => (
                  <Button
                    key={g}
                    size="sm"
                    variant="ghost"
                    className={`h-7 w-7 p-0 text-xs rounded-full transition-colors ${
                      gradeFilter === g
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "text-foreground/70 hover:bg-accent hover:text-foreground"
                    }`}
                    onClick={() => handleGradeChange(gradeFilter === g ? null : g)}
                    title={gradeFilter === g ? "Klikněte znovu pro zrušení filtru" : `Filtrovat na ${g}. ročník`}
                  >
                    {g}
                  </Button>
                ))}
              </div>
              {gradeFilter !== null && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-[11px] gap-1 text-muted-foreground rounded-full hover:text-foreground"
                  onClick={() => handleGradeChange(null)}
                  title="Zrušit filtr"
                >
                  ✕
                </Button>
              )}
            </div>

            {gradeFilter === null && (
              <span className="text-xs text-muted-foreground italic hidden md:inline">
                všechny ročníky
              </span>
            )}

            {/* AI akce — vpravo, prominent indigo + secondary */}
            <div className="flex items-center gap-2 ml-auto">
              <Tooltip delayDuration={150}>
                <TooltipTrigger asChild>
                  <span className="inline-flex">
                    <AdminContentAudit
                      trigger={
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-9 px-3.5 gap-1.5 text-[13px] font-semibold rounded-xl border-border bg-card text-foreground hover:bg-accent shadow-soft-1"
                        >
                          <ShieldCheck className="h-4 w-4 text-foreground/70" />
                          Audit obsahu
                        </Button>
                      }
                    />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <div className="space-y-1.5">
                    <p className="font-semibold">Technická kontrola obsahu</p>
                    <p className="text-xs text-muted-foreground">
                      Projde všechna cvičení a zkontroluje formát, validátory, hranice tématu a prozrazení v nápovědách.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Bez AI, bez sítě, zdarma. Hotové za sekundu.
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>

              <Tooltip delayDuration={150}>
                <TooltipTrigger asChild>
                  <span className="inline-flex">
                    <AdminGenerateIllustrations
                      trigger={
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-9 px-3.5 gap-1.5 text-[13px] font-semibold rounded-xl border-border bg-card text-foreground hover:bg-accent shadow-soft-1"
                        >
                          <ImageIcon className="h-4 w-4 text-foreground/70" />
                          Ilustrace
                        </Button>
                      }
                    />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p className="text-xs">Správa AI ilustrací — generuj, filtruj, upravuj.</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip delayDuration={150}>
                <TooltipTrigger asChild>
                  <span className="inline-flex">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 px-3.5 gap-1.5 text-[13px] font-semibold rounded-xl border-border bg-card text-foreground hover:bg-accent shadow-soft-1 disabled:opacity-50"
                      onClick={() => {
                        setAiPanelTab("check");
                        setAiPanelLocked("check");
                        setAiChatOpen(true);
                      }}
                      disabled={!gradeFilter}
                    >
                      <Search className="h-4 w-4 text-foreground/70" />
                      AI kontrola
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <div className="space-y-1.5">
                    <p className="font-semibold">Pedagogická kontrola od AI</p>
                    <p className="text-xs text-muted-foreground">
                      AI-učitel projde cvičení a posoudí přiměřenost ročníku, srozumitelnost zadání a kvalitu nápověd.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Stojí AI tokeny, trvá minuty. {!gradeFilter && (
                        <span className="text-amber-600 font-medium block mt-1">
                          ⚠ Nejdřív vyber ročník v levém pillu.
                        </span>
                      )}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>

              <Tooltip delayDuration={150}>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    className="h-9 px-3.5 gap-1.5 text-[13px] font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft-2"
                    onClick={() => {
                      setAiPanelTab("create");
                      setAiPanelLocked("create");
                      setAiChatOpen(true);
                    }}
                  >
                    <Sparkles className="h-4 w-4" />
                    AI pomocník
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <div className="space-y-1.5">
                    <p className="font-semibold">AI pro tvorbu obsahu</p>
                    <p className="text-xs text-muted-foreground">
                      Otevře chat s AI, kde můžeš zadat „přidej 10 cvičení o zlomcích pro 5. třídu" a AI připraví návrhy ke schválení.
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
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
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>

          {/* AdminAIActions panel byl matoucí — odstraněno.
              AI funkce jsou přístupné přes 2 tlačítka v top baru
              (AI asistent / AI kontrola) a FAB vpravo dole. */}

          {/* SUBJECTS */}
          {level === "subject" && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {subjects.map((subject) => {
                const subjectTopics = topics.filter((t) => t.subject === subject);
                const categoryCount = new Set(subjectTopics.map((t) => t.category)).size;
                const topicCount = new Set(subjectTopics.map((t) => `${t.category}::${t.topic}`)).size;
                const subtopicCount = subjectTopics.length;
                const meta = getSubjectMeta(subject);
                return (
                  <Card
                    key={subject}
                    className={`group relative cursor-pointer overflow-hidden border-2 rounded-3xl transition-all hover:shadow-lg hover:-translate-y-0.5 ${meta.gradientClass} ${meta.borderClass}`}
                    onClick={() => handleSubjectClick(subject)}
                  >
                    {/* Polkadot decorations — 4 rohy */}
                    <span className="pointer-events-none absolute top-3 left-3 h-2 w-2 rounded-full bg-primary/30" aria-hidden />
                    <span className="pointer-events-none absolute top-3 right-3 h-2 w-2 rounded-full bg-primary/30" aria-hidden />
                    <span className="pointer-events-none absolute bottom-3 left-3 h-2 w-2 rounded-full bg-primary/30" aria-hidden />
                    <span className="pointer-events-none absolute bottom-3 right-3 h-2 w-2 rounded-full bg-primary/30" aria-hidden />

                    <CardContent className="flex h-full flex-col gap-4 p-5">
                      {/* Ilustrace v rounded panel — image vyplňuje panel */}
                      <div className="flex h-32 items-center justify-center rounded-2xl bg-white/60 backdrop-blur-sm overflow-hidden">
                        <ImageOrEmoji imageUrl={meta.image || null} emoji={meta.emoji} size="xl" />
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl font-bold capitalize text-foreground">
                        {subject}
                      </h3>

                      {/* Statistics chips */}
                      <div className="flex flex-wrap gap-1.5">
                        <Badge
                          variant="outline"
                          className="rounded-full bg-white/70 px-2.5 py-0.5 text-[11px] font-medium text-foreground border-border/60"
                        >
                          {categoryCount} {categoryCount === 1 ? "okruh" : categoryCount < 5 ? "okruhy" : "okruhů"}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="rounded-full bg-white/70 px-2.5 py-0.5 text-[11px] font-medium text-foreground border-border/60"
                        >
                          {topicCount} {topicCount === 1 ? "téma" : topicCount < 5 ? "témata" : "témat"}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="rounded-full bg-white/70 px-2.5 py-0.5 text-[11px] font-medium text-foreground border-border/60"
                        >
                          {subtopicCount} {subtopicCount === 1 ? "podtéma" : subtopicCount < 5 ? "podtémata" : "podtémat"}
                        </Badge>
                      </div>

                      {/* Hook v boxu */}
                      {meta.hook && (
                        <div className="flex-1 rounded-xl bg-white/60 border border-border/40 px-3 py-2.5 backdrop-blur-sm">
                          <p className="text-xs leading-relaxed text-foreground/80">
                            💡 {meta.hook}
                          </p>
                        </div>
                      )}

                      {/* Šipka v pravém dolním rohu */}
                      <div className="flex justify-end">
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground shadow-soft-2 transition-transform group-hover:translate-x-0.5">
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {subjects.length === 0 && (
                <div className="lg:col-span-3 sm:col-span-2">
                  <OnboardingHero
                    gradeFilter={gradeFilter}
                    onStartWithPrompt={(prompt) => handleAIAction(prompt)}
                    onOpenWizard={() => setAiChatOpen(true)}
                  />
                </div>
              )}
            </div>
          )}

          {/* CATEGORIES */}
          {level === "category" && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => {
                const topicCount = new Set(
                  topics.filter((t) => t.subject === selectedSubject && t.category === category).map((t) => t.topic),
                ).size;
                const dbTopicCount = dbTopics.filter(
                  (t) => t.subject_name === selectedSubject && t.category_name === category,
                ).length;
                const count = Math.max(topicCount, dbTopicCount);
                const subtopicCount = topics.filter(
                  (t) => t.subject === selectedSubject && t.category === category,
                ).length;
                const isEmpty = count === 0;
                const visual = getPrvoukaCategoryVisual(selectedSubject!, category);
                const catInfo = getCategoryInfo(selectedSubject!, category);
                return (
                  <Card
                    key={category}
                    className={`group relative cursor-pointer overflow-hidden border-2 rounded-3xl transition-all hover:shadow-lg hover:-translate-y-0.5 ${
                      isEmpty ? "border-dashed border-muted-foreground/30" : ""
                    } ${visual ? `${visual.gradientClass} ${visual.colorClass}` : "bg-card hover:bg-accent"}`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {/* Polkadot decorations — 4 rohy */}
                    <span className="pointer-events-none absolute top-3 left-3 h-2 w-2 rounded-full bg-primary/30" aria-hidden />
                    <span className="pointer-events-none absolute top-3 right-3 h-2 w-2 rounded-full bg-primary/30" aria-hidden />
                    <span className="pointer-events-none absolute bottom-3 left-3 h-2 w-2 rounded-full bg-primary/30" aria-hidden />
                    <span className="pointer-events-none absolute bottom-3 right-3 h-2 w-2 rounded-full bg-primary/30" aria-hidden />

                    <CardContent className="flex h-full flex-col gap-4 p-5">
                      {/* Ilustrace v rounded panel — image vyplňuje panel */}
                      <div className="flex h-32 items-center justify-center rounded-2xl bg-white/60 backdrop-blur-sm overflow-hidden">
                        <ImageOrEmoji
                          imageUrl={getPrvoukaCategoryImageUrl(selectedSubject!, category)}
                          emoji={visual?.emoji}
                          size="xl"
                        />
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl font-bold text-foreground">
                        {capitalize(category)}
                      </h3>

                      {/* Statistics chips */}
                      <div className="flex flex-wrap gap-1.5">
                        <Badge
                          variant="outline"
                          className="rounded-full bg-white/70 px-2.5 py-0.5 text-[11px] font-medium text-foreground border-border/60"
                        >
                          {count} {count === 1 ? "téma" : count < 5 ? "témata" : "témat"}
                        </Badge>
                        {subtopicCount > 0 && (
                          <Badge
                            variant="outline"
                            className="rounded-full bg-white/70 px-2.5 py-0.5 text-[11px] font-medium text-foreground border-border/60"
                          >
                            {subtopicCount} {subtopicCount === 1 ? "podtéma" : subtopicCount < 5 ? "podtémata" : "podtémat"}
                          </Badge>
                        )}
                        {isEmpty && (
                          <Badge variant="outline" className="rounded-full border-dashed text-[11px]">
                            Prázdné
                          </Badge>
                        )}
                      </div>

                      {/* Hook v boxu */}
                      {catInfo && (
                        <div className="flex-1 rounded-xl bg-white/60 border border-border/40 px-3 py-2.5 backdrop-blur-sm">
                          <p className="text-xs leading-relaxed text-foreground/80">
                            💡 {catInfo.hook}
                          </p>
                        </div>
                      )}

                      {/* Šipka v pravém dolním rohu */}
                      <div className="flex justify-end">
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground shadow-soft-2 transition-transform group-hover:translate-x-0.5">
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* TOPICS */}
          {level === "topic" && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                    className={`group relative cursor-pointer overflow-hidden border-2 rounded-3xl transition-all hover:shadow-lg hover:-translate-y-0.5 ${
                      isEmpty ? "border-dashed border-muted-foreground/30" : ""
                    } ${topicVisual ? `${topicVisual.gradientClass} ${topicVisual.colorClass}/60` : "bg-card hover:bg-accent"}`}
                    onClick={() => handleTopicClick(topicName)}
                  >
                    {/* Polkadot decorations — 4 rohy */}
                    <span className="pointer-events-none absolute top-3 left-3 h-2 w-2 rounded-full bg-primary/30" aria-hidden />
                    <span className="pointer-events-none absolute top-3 right-3 h-2 w-2 rounded-full bg-primary/30" aria-hidden />
                    <span className="pointer-events-none absolute bottom-3 left-3 h-2 w-2 rounded-full bg-primary/30" aria-hidden />
                    <span className="pointer-events-none absolute bottom-3 right-3 h-2 w-2 rounded-full bg-primary/30" aria-hidden />

                    <CardContent className="flex h-full flex-col gap-4 p-5">
                      {/* Ilustrace v rounded panel */}
                      <div className="flex h-32 items-center justify-center rounded-2xl bg-white/60 backdrop-blur-sm">
                        <ImageOrEmoji
                          imageUrl={getPrvoukaTopicImageUrl(selectedSubject!, topicName)}
                          emoji={topicEmoji}
                          size="lg"
                        />
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl font-bold text-foreground">
                        {capitalize(topicName)}
                      </h3>

                      {/* Statistics chips */}
                      <div className="flex flex-wrap gap-1.5">
                        <Badge
                          variant="outline"
                          className="rounded-full bg-white/70 px-2.5 py-0.5 text-[11px] font-medium text-foreground border-border/60"
                        >
                          {count} {count === 1 ? "podtéma" : count < 5 ? "podtémata" : "podtémat"}
                        </Badge>
                        {isEmpty && (
                          <Badge variant="outline" className="rounded-full border-dashed text-[11px]">
                            Prázdné
                          </Badge>
                        )}
                      </div>

                      {/* Description (hook-style box) */}
                      {description && (
                        <div className="flex-1 rounded-xl bg-white/60 border border-border/40 px-3 py-2.5 backdrop-blur-sm">
                          <p className="text-xs leading-relaxed text-foreground/80 line-clamp-3">
                            💡 {description}
                          </p>
                        </div>
                      )}

                      {/* Šipka v pravém dolním rohu */}
                      <div className="flex justify-end">
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground shadow-soft-2 transition-transform group-hover:translate-x-0.5">
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* SUBTOPICS (skills) */}
          {level === "subtopic" && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {subtopics.map((skill) => {
                const isDbOnly = !hasCodeGenerator(skill);
                const skillEmoji = getPrvoukaTopicEmoji(skill.subject, skill.category, skill.topic);
                const skillVisual = getPrvoukaTopicVisual(skill.subject, skill.category);
                return (
                  <Card
                    key={skill.id}
                    className={`group relative cursor-pointer overflow-hidden border-2 rounded-3xl transition-all hover:shadow-lg hover:-translate-y-0.5 ${
                      skillVisual ? `${skillVisual.gradientClass} ${skillVisual.colorClass}/60` : "bg-card hover:bg-accent"
                    }`}
                    onClick={() => handleSkillClick(skill)}
                  >
                    {/* Polkadot decorations — 4 rohy */}
                    <span className="pointer-events-none absolute top-3 left-3 h-2 w-2 rounded-full bg-primary/30" aria-hidden />
                    <span className="pointer-events-none absolute top-3 right-3 h-2 w-2 rounded-full bg-primary/30" aria-hidden />
                    <span className="pointer-events-none absolute bottom-3 left-3 h-2 w-2 rounded-full bg-primary/30" aria-hidden />
                    <span className="pointer-events-none absolute bottom-3 right-3 h-2 w-2 rounded-full bg-primary/30" aria-hidden />

                    <CardContent className="flex h-full flex-col gap-4 p-5">
                      {/* Ilustrace v rounded panel */}
                      <div className="flex h-32 items-center justify-center rounded-2xl bg-white/60 backdrop-blur-sm">
                        <ImageOrEmoji
                          imageUrl={getPrvoukaTopicImageUrl(skill.subject, skill.topic)}
                          emoji={skillEmoji}
                          size="lg"
                        />
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-foreground line-clamp-2">
                        {skill.title}
                      </h3>

                      {/* Statistics chips */}
                      <div className="flex flex-wrap gap-1.5">
                        <Badge
                          variant="outline"
                          className="rounded-full bg-white/70 px-2.5 py-0.5 text-[11px] font-medium text-foreground border-border/60"
                        >
                          {skill.gradeRange[0]}–{skill.gradeRange[1]}. ročník
                        </Badge>
                        <Badge
                          variant="outline"
                          className="rounded-full bg-white/70 px-2.5 py-0.5 text-[11px] font-medium text-foreground border-border/60"
                        >
                          {INPUT_TYPE_LABELS[skill.inputType] ?? skill.inputType}
                        </Badge>
                        {isDbOnly && (
                          <Badge
                            variant="outline"
                            className="rounded-full border-amber-300 text-amber-700 bg-amber-50/90 px-2.5 py-0.5 text-[11px]"
                          >
                            Bez šablony
                          </Badge>
                        )}
                      </div>

                      {/* Description box */}
                      {skill.briefDescription && (
                        <div className="flex-1 rounded-xl bg-white/60 border border-border/40 px-3 py-2.5 backdrop-blur-sm">
                          <p className="text-xs leading-relaxed text-foreground/80 line-clamp-3">
                            💡 {skill.briefDescription}
                          </p>
                        </div>
                      )}

                      {/* Šipka v pravém dolním rohu */}
                      <div className="flex items-center justify-between">
                        <Eye className="h-4 w-4 text-muted-foreground/60" />
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground shadow-soft-2 transition-transform group-hover:translate-x-0.5">
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {subtopics.length === 0 && (
                <Card className="lg:col-span-3 sm:col-span-2 border-2 border-dashed border-muted-foreground/30 rounded-3xl">
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
                    <Button onClick={() => setAiChatOpen(true)} className="gap-2 rounded-xl">
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

      {/* ═══════ Floating AI button (FAB) — vždy přístupné, oba taby k dispozici ═══════ */}
      <button
        onClick={() => {
          setAiPanelLocked(undefined);
          setAiChatOpen(true);
        }}
        className="fixed bottom-6 right-6 z-40 h-14 w-14 sm:h-16 sm:w-16 rounded-full shadow-lg shadow-primary/30 bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        title="Otevřít AI asistenta (Tvořit + Zkontrolovat)"
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
        defaultTab={aiPanelTab}
        lockedTab={aiPanelLocked}
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
  /** xl = pro admin grid karty (h-28), lg/md/sm = list/sidebar */
  size?: "xl" | "lg" | "md" | "sm";
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const versioned = useImageVersions();
  const sizes = {
    xl: "w-28 h-28",
    lg: "w-14 h-14",
    md: "w-12 h-12",
    sm: "w-10 h-10",
  };
  const emojiSizes = {
    xl: "text-6xl",
    lg: "text-3xl",
    md: "text-2xl",
    sm: "text-xl",
  };

  const storageKey = imageUrl?.match(/prvouka-images\/(.+?)\.png/)?.[1] ?? null;
  const src = storageKey && imageUrl ? versioned(imageUrl, storageKey) : imageUrl;
  const hasFailed = src === failedUrl;

  if (src && !hasFailed) {
    return (
      <img
        src={src}
        alt=""
        className={`${sizes[size]} object-contain shrink-0 mix-blend-multiply brightness-[1.15] contrast-[1.1]`}
        onError={() => setFailedUrl(src)}
      />
    );
  }
  if (emoji) return <span className={emojiSizes[size]} aria-hidden>{emoji}</span>;
  return null;
}
