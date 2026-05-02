import { useState, useMemo } from "react";
import type { TopicMetadata, Grade } from "@/lib/types";
import { getTopicsForGrade, getAllTopics } from "@/lib/contentRegistry";
import { getCategoryInfo } from "@/lib/categoryInfo";
import { getPrvoukaCategoryVisual, getPrvoukaTopicEmoji, getPrvoukaTopicVisual, getPrvoukaCategoryImageUrl, getPrvoukaTopicImageUrl } from "@/lib/prvoukaVisuals";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft } from "lucide-react";
import { getSubjectMeta } from "@/lib/subjectRegistry";
import { useImageVersions } from "@/lib/imageVersions";
import categoryInfoImg from "@/assets/category-info.png";
import { useT } from "@/lib/i18n";
import { useDbCurriculum, hasCodeGenerator } from "@/hooks/useDbCurriculum";
import { OlyLogo } from "@/components/OlyLogo";

interface TopicBrowserProps {
  grade: Grade;
  onSelectTopic: (topic: TopicMetadata) => void;
  onBack: () => void;
  isAdmin?: boolean;
}

type BrowseLevel = "subject" | "category" | "topic" | "subtopic";

export function TopicBrowser({ grade, onSelectTopic, onBack, isAdmin }: TopicBrowserProps) {
  const t = useT();
  const [level, setLevel] = useState<BrowseLevel>("subject");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // Use only code registry topics for student view (no DB-only duplicates)
  const { dbOnlyTopics } = useDbCurriculum(grade);
  const codeTopics = useMemo(() => {
    const all = getAllTopics();
    return all.filter((t) => grade >= t.gradeRange[0] && grade <= t.gradeRange[1]);
  }, [grade]);
  // Only add DB-only topics that have actual exercises (not just metadata stubs)
  const topics = useMemo(() => {
    const realDbOnly = dbOnlyTopics.filter((t) => (t as any)._dbOnly && t.generator(1).length === 0 === false);
    // For now, just use code topics — DB-only topics without generators can't be practiced
    return [...codeTopics];
  }, [codeTopics, dbOnlyTopics]);

  const subjects = [...new Set(topics.map((t) => t.subject))];

  const categories = selectedSubject
    ? [...new Set(topics.filter((t) => t.subject === selectedSubject).map((t) => t.category))]
    : [];

  // Topics (groups) within selected category
  const topicGroups =
    selectedSubject && selectedCategory
      ? [...new Set(
          topics
            .filter((t) => t.subject === selectedSubject && t.category === selectedCategory)
            .map((t) => t.topic)
        )]
      : [];

  // Subtopics (skills) within selected topic group
  const subtopics =
    selectedSubject && selectedCategory && selectedTopic
      ? topics.filter(
          (t) =>
            t.subject === selectedSubject &&
            t.category === selectedCategory &&
            t.topic === selectedTopic
        )
      : [];

  const handleBack = () => {
    if (level === "subtopic") {
      // If topic level has only 1 group, skip it
      const groups = selectedSubject && selectedCategory
        ? [...new Set(topics.filter(t => t.subject === selectedSubject && t.category === selectedCategory).map(t => t.topic))]
        : [];
      if (groups.length <= 1) {
        // Also check if category level has only 1 category
        const cats = selectedSubject
          ? [...new Set(topics.filter(t => t.subject === selectedSubject).map(t => t.category))]
          : [];
        if (cats.length <= 1) {
          setSelectedTopic(null);
          setSelectedCategory(null);
          setSelectedSubject(null);
          setLevel("subject");
        } else {
          setSelectedTopic(null);
          setSelectedCategory(null);
          setLevel("category");
        }
      } else {
        setSelectedTopic(null);
        setLevel("topic");
      }
    } else if (level === "topic") {
      // If category level has only 1 category, skip it
      const cats = selectedSubject
        ? [...new Set(topics.filter(t => t.subject === selectedSubject).map(t => t.category))]
        : [];
      if (cats.length <= 1) {
        setSelectedCategory(null);
        setSelectedSubject(null);
        setLevel("subject");
      } else {
        setSelectedCategory(null);
        setLevel("category");
      }
    } else if (level === "category") {
      setSelectedSubject(null);
      setLevel("subject");
    } else {
      onBack();
    }
  };

  const handleSubjectClick = (subject: string) => {
    setSelectedSubject(subject);
    const cats = [...new Set(topics.filter((t) => t.subject === subject).map((t) => t.category))];
    if (cats.length === 1) {
      setSelectedCategory(cats[0]);
      // Check if this category has only one topic group
      const groups = [...new Set(
        topics.filter((t) => t.subject === subject && t.category === cats[0]).map((t) => t.topic)
      )];
      if (groups.length === 1) {
        const skillsInGroup = topics.filter(
          (t) => t.subject === subject && t.category === cats[0] && t.topic === groups[0]
        );
        if (skillsInGroup.length === 1) {
          onSelectTopic(skillsInGroup[0]);
        } else {
          setSelectedTopic(groups[0]);
          setLevel("subtopic");
        }
      } else {
        setLevel("topic");
      }
    } else {
      setLevel("category");
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    const groups = [...new Set(
      topics.filter((t) => t.subject === selectedSubject && t.category === category).map((t) => t.topic)
    )];
    if (groups.length === 1) {
      const skillsInGroup = topics.filter(
        (t) => t.subject === selectedSubject && t.category === category && t.topic === groups[0]
      );
      if (skillsInGroup.length === 1) {
        onSelectTopic(skillsInGroup[0]);
      } else {
        setSelectedTopic(groups[0]);
        setLevel("subtopic");
      }
    } else {
      setLevel("topic");
    }
  };

  const handleTopicClick = (topicName: string) => {
    const skillsInGroup = topics.filter(
      (t) =>
        t.subject === selectedSubject &&
        t.category === selectedCategory &&
        t.topic === topicName
    );
    if (skillsInGroup.length === 1) {
      // Single-item topic group — auto-skip to practice
      onSelectTopic(skillsInGroup[0]);
    } else {
      setSelectedTopic(topicName);
      setLevel("subtopic");
    }
  };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const title =
    level === "subject"
      ? t("topic.select_subject")
      : level === "category"
        ? selectedSubject ? capitalize(selectedSubject) : ""
        : level === "topic"
          ? selectedCategory ? capitalize(selectedCategory) : ""
          : selectedTopic ? capitalize(selectedTopic) : "";

  const subtitle =
    level === "subject"
      ? t("topic.what_today")
      : level === "category"
        ? t("topic.select_topic")
        : level === "topic"
          ? t("topic.select_practice")
          : t("topic.select_subtopic");

  // Subject-level visual config — barva karty per subject (Lovable mockup styl)
  const SUBJECT_CARD_STYLES: Record<string, { bg: string; border: string; chipBg: string; chipText: string }> = {
    matematika: {
      bg: "bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-50",
      border: "border-indigo-200/70",
      chipBg: "bg-white/80 text-indigo-700",
      chipText: "text-indigo-700",
    },
    "čeština": {
      bg: "bg-gradient-to-br from-rose-100 via-pink-50 to-red-50",
      border: "border-rose-200/70",
      chipBg: "bg-white/80 text-rose-700",
      chipText: "text-rose-700",
    },
    prvouka: {
      bg: "bg-gradient-to-br from-emerald-100 via-green-50 to-teal-50",
      border: "border-emerald-200/70",
      chipBg: "bg-white/80 text-emerald-700",
      chipText: "text-emerald-700",
    },
    "přírodověda": {
      bg: "bg-gradient-to-br from-teal-100 via-emerald-50 to-cyan-50",
      border: "border-teal-200/70",
      chipBg: "bg-white/80 text-teal-700",
      chipText: "text-teal-700",
    },
    "vlastivěda": {
      bg: "bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-50",
      border: "border-amber-200/70",
      chipBg: "bg-white/80 text-amber-700",
      chipText: "text-amber-700",
    },
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background to-muted/20 p-4 sm:p-6" style={isAdmin ? { paddingTop: "2.5rem" } : undefined}>
      {level === "subject" ? (
        // ── ŽÁKOVSKÝ POHLED VÝBĚRU PŘEDMĚTU (Lovable redesign) ──
        <div className="mx-auto w-full max-w-5xl space-y-6">
          {/* Welcome header card */}
          <div className="relative rounded-3xl border-2 border-border/40 bg-card p-5 shadow-soft-1">
            <div className="flex items-center gap-4">
              <div className="shrink-0">
                <OlyLogo size="sm" onClick={onBack} />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                  Ahoj!
                </h1>
                <p className="text-sm text-muted-foreground">
                  Co dnes procvičíš?
                </p>
              </div>
            </div>
          </div>

          {/* Title + back */}
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-foreground">
                {title}
              </h2>
              <p className="text-sm text-muted-foreground">
                Klepni na předmět a pusť se do toho.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="gap-1 text-sm text-muted-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
              {t("topic.back")}
            </Button>
          </div>

          {/* Asymmetric grid: 1. subject = velká karta vlevo, ostatní = stack vpravo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subjects.map((subject, idx) => {
              const subjectTopics = topics.filter((t) => t.subject === subject);
              const cats = [...new Set(subjectTopics.map((t) => t.category))];
              const count = cats.length;
              const meta = getSubjectMeta(subject);
              const cardStyle = SUBJECT_CARD_STYLES[subject] ?? {
                bg: meta.gradientClass,
                border: meta.borderClass,
                chipBg: "bg-white/80 text-foreground",
                chipText: "text-foreground",
              };
              const isPrimary = idx === 0;
              // Top 3 categories jako chip pills
              const chipCategories = cats.slice(0, 3).map((c) => {
                // Zkrácení dlouhých kategorií
                const short = c.length > 14 ? c.split(" ")[0] : c;
                return short;
              });

              return (
                <button
                  key={subject}
                  type="button"
                  onClick={() => handleSubjectClick(subject)}
                  className={`group relative text-left rounded-3xl border-2 ${cardStyle.bg} ${cardStyle.border} p-5 sm:p-6 shadow-soft-1 transition-all hover:shadow-lg hover:-translate-y-0.5 ${
                    isPrimary ? "md:col-span-2 md:row-span-2 min-h-[360px] flex flex-col" : "min-h-[170px]"
                  }`}
                >
                  {isPrimary ? (
                    <>
                      {/* Velká primary karta — ilustrace nahoře centered */}
                      <div className="flex-1 flex items-center justify-center py-4">
                        <PrvoukaImage
                          imageUrl={meta.image || null}
                          fallbackEmoji={meta.emoji}
                          size="hero"
                        />
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-3xl sm:text-4xl font-black capitalize text-foreground tracking-tight">
                          {subject}
                        </h3>
                        <p className="text-sm text-foreground/70">
                          {count} {count === 1 ? t("count.category_1") : count < 5 ? t("count.category_2_4") : t("count.category_5_plus")}
                        </p>
                        {/* Šipka v primary buttonu */}
                        <div className="flex items-center gap-2 pt-1">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/90 text-background px-4 py-2 text-sm font-bold shadow-soft-2 transition-transform group-hover:translate-x-0.5">
                            Pokračovat
                            <span aria-hidden>›</span>
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Menší kompaktní karty — ilustrace vpravo, text vlevo */}
                      <div className="flex items-center gap-3 h-full">
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <h3 className="text-xl sm:text-2xl font-black capitalize text-foreground tracking-tight">
                            {subject}
                          </h3>
                          <p className="text-xs text-foreground/70">
                            {count} {count === 1 ? t("count.category_1") : count < 5 ? t("count.category_2_4") : t("count.category_5_plus")}
                          </p>
                          {chipCategories.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {chipCategories.map((c, i) => (
                                <span
                                  key={i}
                                  className={`rounded-full ${cardStyle.chipBg} px-2 py-0.5 text-[10px] font-semibold`}
                                >
                                  {c}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="shrink-0">
                          <PrvoukaImage
                            imageUrl={meta.image || null}
                            fallbackEmoji={meta.emoji}
                            size="md"
                          />
                        </div>
                        <span
                          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/90 ${cardStyle.chipText} shadow-soft-1 transition-transform group-hover:translate-x-0.5`}
                          aria-hidden
                        >
                          ›
                        </span>
                      </div>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        // ── ŽÁKOVSKÝ POHLED — category / topic / subtopic (Lovable styl) ──
        (() => {
          const subjectStyle = (selectedSubject && SUBJECT_CARD_STYLES[selectedSubject]) || {
            bg: "bg-gradient-to-br from-muted via-muted/50 to-background",
            border: "border-border/60",
            chipBg: "bg-white/80 text-foreground",
            chipText: "text-foreground",
          };
          const subjectMeta = selectedSubject ? getSubjectMeta(selectedSubject) : null;
          const infoForLevel =
            level === "topic" && selectedSubject && selectedCategory
              ? getCategoryInfo(selectedSubject, selectedCategory)
              : level === "subtopic" && selectedSubject && selectedCategory && selectedTopic
                ? getCategoryInfo(selectedSubject, selectedCategory, selectedTopic)
                : null;

          return (
            <div className="mx-auto w-full max-w-5xl space-y-6">
              {/* Welcome header card — barva podle aktuálního předmětu */}
              <div className={`relative rounded-3xl border-2 ${subjectStyle.border} ${subjectStyle.bg} p-5 shadow-soft-1`}>
                <div className="flex items-center gap-4">
                  <div className="shrink-0">
                    <OlyLogo size="sm" onClick={onBack} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground capitalize">
                      {selectedSubject ?? title}
                    </h1>
                    <p className="text-sm text-foreground/70">
                      {subtitle}
                    </p>
                  </div>
                  {subjectMeta && (
                    <div className="shrink-0 hidden sm:block">
                      <PrvoukaImage
                        imageUrl={subjectMeta.image || null}
                        fallbackEmoji={subjectMeta.emoji}
                        size="md"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Title + back */}
              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-3xl font-black tracking-tight text-foreground capitalize truncate">
                    {title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {level === "category"
                      ? "Vyber si okruh, který chceš procvičovat."
                      : level === "topic"
                        ? "Klepni na téma a pusť se do něj."
                        : "Klepni na konkrétní podtéma."}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="gap-1 text-sm text-muted-foreground shrink-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {t("topic.back")}
                </Button>
              </div>

              {/* Info dialog — pokud existuje pro tuto úroveň */}
              {infoForLevel && <CategoryInfoDialog info={infoForLevel} />}

              {/* CATEGORY level — asymmetric grid (1 primary + ostatní) */}
              {level === "category" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {categories.map((category, idx) => {
                    const count = new Set(
                      topics.filter((t) => t.subject === selectedSubject && t.category === category).map((t) => t.topic)
                    ).size;
                    const visual = getPrvoukaCategoryVisual(selectedSubject!, category);
                    const isPrimary = idx === 0 && categories.length > 1;
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => handleCategoryClick(category)}
                        className={`group relative text-left rounded-3xl border-2 ${subjectStyle.bg} ${subjectStyle.border} p-5 sm:p-6 shadow-soft-1 transition-all hover:shadow-lg hover:-translate-y-0.5 ${
                          isPrimary ? "md:col-span-2 md:row-span-2 min-h-[320px] flex flex-col" : "min-h-[160px]"
                        }`}
                      >
                        {isPrimary ? (
                          <>
                            <div className="flex-1 flex items-center justify-center py-4">
                              <PrvoukaImage imageUrl={getPrvoukaCategoryImageUrl(selectedSubject!, category)} fallbackEmoji={visual?.emoji} size="hero" />
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-2xl sm:text-3xl font-black capitalize text-foreground tracking-tight">
                                {capitalize(category)}
                              </h3>
                              <p className="text-sm text-foreground/70">
                                {count} {count === 1 ? t("count.topic_1") : count < 5 ? t("count.topic_2_4") : t("count.topic_5_plus")}
                              </p>
                              <div className="flex items-center gap-2 pt-1">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/90 text-background px-4 py-2 text-sm font-bold shadow-soft-2 transition-transform group-hover:translate-x-0.5">
                                  Pokračovat
                                  <span aria-hidden>›</span>
                                </span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center gap-3 h-full">
                            <div className="flex-1 min-w-0 space-y-1">
                              <h3 className="text-lg sm:text-xl font-black capitalize text-foreground tracking-tight">
                                {capitalize(category)}
                              </h3>
                              <p className="text-xs text-foreground/70">
                                {count} {count === 1 ? t("count.topic_1") : count < 5 ? t("count.topic_2_4") : t("count.topic_5_plus")}
                              </p>
                            </div>
                            <div className="shrink-0">
                              <PrvoukaImage imageUrl={getPrvoukaCategoryImageUrl(selectedSubject!, category)} fallbackEmoji={visual?.emoji} size="md" />
                            </div>
                            <span
                              className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/90 ${subjectStyle.chipText} shadow-soft-1 transition-transform group-hover:translate-x-0.5`}
                              aria-hidden
                            >
                              ›
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* TOPIC level — asymmetric grid s description na primary */}
              {level === "topic" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {topicGroups.map((topicName, idx) => {
                    const skillsInGroup = topics.filter(
                      (t) => t.subject === selectedSubject && t.category === selectedCategory && t.topic === topicName
                    );
                    const count = skillsInGroup.length;
                    const description = count > 1
                      ? (skillsInGroup[0]?.topicDescription ?? skillsInGroup[0]?.briefDescription ?? "")
                      : (skillsInGroup[0]?.briefDescription ?? "");
                    const topicEmoji = getPrvoukaTopicEmoji(selectedSubject!, selectedCategory!, topicName);
                    const isPrimary = idx === 0 && topicGroups.length > 1;
                    return (
                      <button
                        key={topicName}
                        type="button"
                        onClick={() => handleTopicClick(topicName)}
                        className={`group relative text-left rounded-3xl border-2 ${subjectStyle.bg} ${subjectStyle.border} p-5 sm:p-6 shadow-soft-1 transition-all hover:shadow-lg hover:-translate-y-0.5 ${
                          isPrimary ? "md:col-span-2 md:row-span-2 min-h-[320px] flex flex-col" : "min-h-[160px]"
                        }`}
                      >
                        {isPrimary ? (
                          <>
                            <div className="flex-1 flex items-center justify-center py-4">
                              <PrvoukaImage imageUrl={getPrvoukaTopicImageUrl(selectedSubject!, topicName)} fallbackEmoji={topicEmoji} size="hero" />
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-2xl sm:text-3xl font-black capitalize text-foreground tracking-tight">
                                {capitalize(topicName)}
                              </h3>
                              {description && (
                                <p className="text-sm text-foreground/70 line-clamp-2">{description}</p>
                              )}
                              {count > 1 && (
                                <p className="text-xs text-foreground/60">
                                  {count} {count < 5 ? t("count.subtopic_2_4") : t("count.subtopic_5_plus")}
                                </p>
                              )}
                              <div className="flex items-center gap-2 pt-1">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/90 text-background px-4 py-2 text-sm font-bold shadow-soft-2 transition-transform group-hover:translate-x-0.5">
                                  Pokračovat
                                  <span aria-hidden>›</span>
                                </span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center gap-3 h-full">
                            <div className="flex-1 min-w-0 space-y-1">
                              <h3 className="text-lg sm:text-xl font-black capitalize text-foreground tracking-tight line-clamp-2">
                                {capitalize(topicName)}
                              </h3>
                              {description && (
                                <p className="text-xs text-foreground/70 line-clamp-2">{description}</p>
                              )}
                              {count > 1 && (
                                <p className="text-[10px] text-foreground/60">
                                  {count} {count < 5 ? t("count.subtopic_2_4") : t("count.subtopic_5_plus")}
                                </p>
                              )}
                            </div>
                            <div className="shrink-0">
                              <PrvoukaImage imageUrl={getPrvoukaTopicImageUrl(selectedSubject!, topicName)} fallbackEmoji={topicEmoji} size="md" />
                            </div>
                            <span
                              className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/90 ${subjectStyle.chipText} shadow-soft-1 transition-transform group-hover:translate-x-0.5`}
                              aria-hidden
                            >
                              ›
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* SUBTOPIC level — uniformní 2-col grid (často hodně položek) */}
              {level === "subtopic" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {subtopics.map((topic) => {
                    const subEmoji = getPrvoukaTopicEmoji(selectedSubject!, selectedCategory!, selectedTopic!);
                    const isDbOnly = !hasCodeGenerator(topic);
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => onSelectTopic(topic)}
                        className={`group relative text-left rounded-3xl border-2 ${subjectStyle.bg} ${subjectStyle.border} p-5 shadow-soft-1 transition-all hover:shadow-lg hover:-translate-y-0.5 min-h-[140px] ${isDbOnly ? "opacity-80" : ""}`}
                      >
                        <div className="flex items-start gap-3 h-full">
                          <div className="shrink-0">
                            <PrvoukaImage imageUrl={getPrvoukaTopicImageUrl(selectedSubject!, topic.title)} fallbackEmoji={getPrvoukaTopicEmoji(selectedSubject!, selectedCategory!, topic.title) || subEmoji} size="lg" />
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <h3 className="text-lg font-black text-foreground tracking-tight line-clamp-2">
                              {topic.title}
                            </h3>
                            <p className="text-sm text-foreground/70 line-clamp-2">{topic.goals[0]}</p>
                          </div>
                          <span
                            className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/90 ${subjectStyle.chipText} shadow-soft-1 transition-transform group-hover:translate-x-0.5`}
                            aria-hidden
                          >
                            ›
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()
      )}
    </div>
  );
}

// ── Prvouka image with emoji fallback ────────────────────────

const IMG_SIZES = { hero: "w-48 h-48 sm:w-56 sm:h-56", lg: "w-20 h-20", md: "w-16 h-16", sm: "w-12 h-12" };
const EMOJI_SIZES = { hero: "text-9xl", lg: "text-4xl", md: "text-3xl", sm: "text-2xl" };
function PrvoukaImage({ imageUrl, fallbackEmoji, size = "md" }: { imageUrl: string | null; fallbackEmoji?: string | null; size?: "hero" | "lg" | "md" | "sm" }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const versioned = useImageVersions();

  const storageKey = imageUrl?.match(/prvouka-images\/(.+?)\.png/)?.[1] ?? null;
  const src = storageKey && imageUrl ? versioned(imageUrl, storageKey) : imageUrl;
  const hasFailed = src === failedUrl;

  if (src && !hasFailed) {
    return (
      <img
        src={src}
        alt=""
        className={`${IMG_SIZES[size]} object-contain shrink-0 mix-blend-multiply`}
        onError={() => setFailedUrl(src)}
      />
    );
  }

  if (fallbackEmoji) {
    return <span className={EMOJI_SIZES[size]}>{fallbackEmoji}</span>;
  }

  return null;
}

// ── Extracted dialog components ─────────────────────────────

function CategoryInfoDialog({ info }: { info: ReturnType<typeof getCategoryInfo> & {} }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full gap-3 border-2 text-base py-7 bg-gradient-to-r from-white to-accent hover:shadow-md transition-all">
          <img src={categoryInfoImg} alt="" className="w-10 h-10 object-contain shrink-0 mix-blend-multiply" />
          <span className="font-medium">{info.buttonLabel}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-none p-0">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-5 text-base max-w-2xl mx-auto">
            <SheetHeader>
              <SheetTitle className="text-2xl">{info.title}</SheetTitle>
            </SheetHeader>
            <p className="text-lg font-medium text-primary">{info.hook}</p>
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">Co to je?</h3>
              <p className="text-muted-foreground">{info.whatIsIt}</p>
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">Proč se to učíme?</h3>
              <p className="text-muted-foreground">{info.whyWeUseIt}</p>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Jak to vypadá?</h3>
              {info.visualExamples.map((ex, i) => (
                <div key={i} className="rounded-lg border-2 bg-secondary/50 p-4 space-y-2">
                  <p className="font-medium text-sm text-foreground">{ex.label}</p>
                  <pre className="whitespace-pre-wrap font-mono text-sm text-muted-foreground leading-relaxed">
                    {ex.illustration}
                  </pre>
                </div>
              ))}
            </div>
            <div className="rounded-lg bg-accent p-4">
              <p className="text-base text-accent-foreground">{info.funFact}</p>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
