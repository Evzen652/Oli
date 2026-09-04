import { useState, useMemo } from "react";
import { IllustrationImg } from "@/components/IllustrationImg";
import { PaintedArrow } from "@/components/icons/PaintedArrow";
import type { TopicMetadata, Grade } from "@/lib/types";
import { getAllTopics } from "@/lib/contentRegistry";
import { getTopicInsight } from "@/lib/topicInsight";
import { getCategoryVisual, getTopicEmoji, getCategoryIllustrationUrl, getTopicIllustrationUrl } from "@/lib/prvoukaVisuals";
import { BackButton } from "@/components/BackButton";
import { getSubjectMeta, getSubjectPalette } from "@/lib/subjectRegistry";
import { useImageVersions } from "@/lib/imageVersions";
import { useT } from "@/lib/i18n";
import { useDbCurriculum, hasCodeGenerator } from "@/hooks/useDbCurriculum";
import { getDisplayCategory, getDisplayCategoryDescription, getDisplayTopic, getDisplayTopicDescription } from "@/lib/displayNames";
import { getSubjectOkruhy as getNavOkruhy, type Okruh } from "@/content/navigation";
import { pad } from "@/lib/czechGrammar";
import { Lock } from "lucide-react";

interface TopicBrowserProps {
  grade: Grade;
  onSelectTopic: (topic: TopicMetadata) => void;
  onBack: () => void;
  isAdmin?: boolean;
  initialSubject?: string;
  /** Anonymní režim — v každém předmětu je odemčený jen první okruh, zbytek zamčený. */
  anonLocked?: boolean;
  /** Klik na zamčený (šedý) okruh — typicky pobídka k registraci. */
  onLockedClick?: () => void;
}

type BrowseLevel = "subject" | "category" | "topic" | "subtopic";

export function TopicBrowser({ grade, onSelectTopic, onBack, isAdmin, initialSubject, anonLocked, onLockedClick }: TopicBrowserProps) {
  const t = useT();
  // Předmět s okruhovou navigací → start na "category" (výběr okruhu).
  // Předmět bez okruhů (např. informatika) → rovnou na "subtopic" (všechna témata předmětu).
  const initHasOkruhy = !!(initialSubject && getNavOkruhy(grade, initialSubject));
  const [level, setLevel] = useState<BrowseLevel>(
    !initialSubject ? "subject" : initHasOkruhy ? "category" : "subtopic"
  );
  const [selectedSubject, setSelectedSubject] = useState<string | null>(initialSubject ?? null);
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

  const getSubjectOkruhy = (subject: string): Okruh[] | null => getNavOkruhy(grade, subject);

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

  // Subtopics (skills) within selected topic group — or custom okruh témata
  const subtopics = useMemo(() => {
    if (!selectedSubject) return [];
    const okruhy = getSubjectOkruhy(selectedSubject);
    if (okruhy && selectedCategory) {
      const okruh = okruhy.find(o => o.id === selectedCategory);
      return okruh ? topics.filter(t => okruh.topicIds.includes(t.id)) : [];
    }
    if (selectedCategory) {
      if (!selectedTopic) return [];
      return topics.filter(
        t => t.subject === selectedSubject && t.category === selectedCategory && t.topic === selectedTopic
      );
    }
    // "All topics" mode — initialSubject bez výběru kategorie, zobrazit vše pro daný předmět
    return topics.filter(t => t.subject === selectedSubject);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubject, selectedCategory, selectedTopic, topics, grade]);

  const handleBack = () => {
    if (level === "subtopic") {
      // Custom nav: vždy zpět na okruhy (category)
      if (selectedSubject && getSubjectOkruhy(selectedSubject)) {
        setSelectedCategory(null);
        setLevel("category");
        return;
      }
      // "All topics" mode — žádná kategorie, zpět na výběr předmětu
      if (!selectedCategory) {
        setSelectedSubject(null);
        setLevel("subject");
        return;
      }
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
    const okruhy = getSubjectOkruhy(subject);
    if (okruhy) {
      if (okruhy.length === 1) {
        setSelectedCategory(okruhy[0].id);
        setLevel("subtopic");
      } else {
        setLevel("category");
      }
      return;
    }
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
    if (selectedSubject && getSubjectOkruhy(selectedSubject)) {
      setLevel("subtopic");
      return;
    }
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

  const capitalize = (s: unknown): string => {
    if (typeof s !== "string" || s.length === 0) return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  // Dětské vs. RVP názvy — admin vidí formální RVP, žák vidí dětský název
  const displayCat = (cat: string) => isAdmin ? capitalize(cat) : getDisplayCategory(cat, grade);
  const displayTop = (top: string) => isAdmin ? capitalize(top) : getDisplayTopic(top, grade);
  const displayCatDesc = (cat: string) => isAdmin ? null : getDisplayCategoryDescription(cat, grade);
  const displayTopDesc = (top: string) => isAdmin ? null : getDisplayTopicDescription(top, grade);

  const activeOkruh = level === "subtopic" && selectedSubject && selectedCategory
    ? getSubjectOkruhy(selectedSubject)?.find(o => o.id === selectedCategory) ?? null
    : null;

  const title =
    level === "subject"
      ? t("topic.select_subject")
      : level === "category"
        ? selectedSubject ? capitalize(selectedSubject) : ""
        : level === "topic"
          ? selectedCategory ? displayCat(selectedCategory) : ""
          : activeOkruh
            ? activeOkruh.name
            : selectedTopic ? displayTop(selectedTopic)
            : selectedSubject ? capitalize(selectedSubject) : "";  // "all topics" mode

  const subtitle =
    level === "subject"
      ? ""
      : level === "category"
        ? ""
        : level === "topic"
          ? t("topic.select_practice")
          : activeOkruh
            ? ""
            : !selectedCategory
              ? ""  // "all topics" mode
              : t("topic.select_subtopic");

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background to-muted/20 p-4 sm:p-6" style={isAdmin ? { paddingTop: "2.5rem" } : undefined}>
      {level === "subject" ? (
        // ── ŽÁKOVSKÝ POHLED VÝBĚRU PŘEDMĚTU (Lovable redesign) ──
        <div className="mx-auto w-full max-w-5xl space-y-6">
          {/* Title + back */}
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-foreground">
                {title}
              </h2>
              {subtitle && (
                <p className="text-sm text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>
            <BackButton onClick={handleBack} />
          </div>

          {/* Jednotný čtvercový grid — všechny předměty stejně velké */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => {
              const subjectTopics = topics.filter((t) => t.subject === subject);
              const cats = [...new Set(subjectTopics.map((t) => t.category))];
              const count = getSubjectOkruhy(subject)?.length ?? cats.length;
              const meta = getSubjectMeta(subject);

              return (
                // Karta je bílá; předmět nese jen tintová dlaždice pod ilustrací
                // a barevná linka. Dřív byla celá karta trojbarevný gradient
                // (`from-indigo-100 via-purple-50 to-blue-50`), který přebíjel
                // samotnou ilustraci — a v každé ze šesti map jinak.
                <button
                  key={subject}
                  type="button"
                  onClick={() => handleSubjectClick(subject)}
                  className={`group aspect-square relative text-left rounded-3xl border-2 border-t-4 bg-card ${meta.borderClass} shadow-e1 transition-all duration-150 hover:shadow-e2 hover:-translate-y-px active:translate-y-0 p-4 flex flex-col`}
                >
                  <span className={`absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-full ${meta.tintClass} ${meta.color} transition-transform group-hover:translate-x-0.5`} aria-hidden>›</span>
                  <div className="flex-1 flex items-center justify-center">
                    <div className={`grid place-items-center rounded-2xl ${meta.tintClass} p-3`}>
                      <PrvoukaImage imageUrl={meta.image || null} fallbackEmoji={meta.emoji} size="lg" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-foreground tracking-tight leading-tight">
                      {capitalize(subject)}
                    </h3>
                    <p className="text-xs text-foreground/70">
                      {count} {count === 1 ? t("count.category_1") : count < 5 ? t("count.category_2_4") : t("count.category_5_plus")}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        // ── ŽÁKOVSKÝ POHLED — category / topic / subtopic (Lovable styl) ──
        (() => {
          const subjectPalette = getSubjectPalette(selectedSubject);
          // Jedna třída pro všechny tři dlaždicové mřížky (okruh / téma /
          // podtéma) — dřív byl ten samý řetězec zkopírovaný 3× a lišil se
          // jen v tom, kterou verzi gradientu zrovna zachytil.
          const browseCardClass =
            `group aspect-square relative text-left rounded-3xl border-2 border-t-4 bg-card ${subjectPalette.borderClass} shadow-e1 transition-all duration-150 hover:shadow-e2 hover:-translate-y-px active:translate-y-0 p-4 flex flex-col`;
          const subjectMeta = selectedSubject ? getSubjectMeta(selectedSubject) : null;
          // K čemu je okruh/téma dobré. Dřív to viselo na `getCategoryInfo`,
          // který od přechodu na RVP taxonomii vracel `null` pro všechno —
          // panel „K čemu jsou čísla?" byl roky mrtvý kód (viz `topicInsight.ts`).
          const infoForLevel =
            level === "topic" && selectedSubject && selectedCategory
              ? getTopicInsight(selectedSubject, selectedCategory)
              : level === "subtopic" && selectedSubject && selectedCategory && selectedTopic
                ? getTopicInsight(selectedSubject, selectedCategory, selectedTopic)
                : null;

          return (
            <div className="mx-auto w-full max-w-5xl space-y-6">
              {/* Hlavička předmětu — jen kresba a název, bez karty.
                  Karta kolem toho byla prázdný obal: nenesla žádnou akci ani
                  volbu, jen zopakovala barvu předmětu, kterou o pár pixelů níž
                  nese každá dlaždice. Dvojitý rám (`border-2 border-t-4`) navíc
                  soutěžil s dlaždicemi o pozornost. */}
              <div className="flex items-center gap-4">
                {subjectMeta && (
                  <PrvoukaImage
                    imageUrl={subjectMeta.image || null}
                    fallbackEmoji={subjectMeta.emoji}
                    size="md"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                    {capitalize(selectedSubject ?? title)}
                  </h1>
                  {subtitle && (
                    <p className="text-sm text-foreground/70">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Title + back */}
              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                  {/* Na úrovni "category" je title = předmět, který už nese
                      welcome banner výše — nezobrazovat ho podruhé. */}
                  {level !== "category" && (
                    <h2 className="text-3xl font-black tracking-tight text-foreground truncate">
                      {title}
                    </h2>
                  )}
                  <p className={(level === "category" || activeOkruh) ? "text-lg font-bold text-foreground" : "text-sm text-muted-foreground"}>
                    {level === "category"
                      ? "Vyber si okruh, který chceš procvičovat."
                      : level === "topic"
                        ? "Vyber téma a pusť se do něj."
                        : activeOkruh
                          ? "Vyber téma a pusť se do toho."
                          : "Vyber konkrétní podtéma."}
                  </p>
                </div>
                <BackButton onClick={handleBack} />
              </div>

              {/* K čemu to je. Dřív schované pod tlačítkem, které otevíralo
                  postranní panel — dítě, které neví proč, ho ale neotevře.
                  Proto to stojí rovnou na stránce, nad výběrem. */}
              {infoForLevel && (
                <p className="text-lg font-semibold leading-snug text-primary">
                  {infoForLevel.useful}
                </p>
              )}

              {/* CATEGORY level — okruhy (grade-3) i RVP kategorie (ostatní) ve stejném gridu */}
              {level === "category" && (() => {
                const subjectOkruhy = selectedSubject ? getSubjectOkruhy(selectedSubject) : null;
                // Anon režim: odemčený je jen první okruh, zbytek zamčený.
                const cards = subjectOkruhy
                  ? subjectOkruhy.map((okruh, i) => {
                      const okruhTopics = topics.filter(t => okruh.topicIds.includes(t.id));
                      const rvpCategory = okruhTopics[0]?.category ?? "";
                      return {
                        id: okruh.id,
                        name: okruh.name,
                        desc: okruh.description,
                        emoji: okruh.emoji,
                        imageUrl: getCategoryIllustrationUrl(selectedSubject!, rvpCategory),
                        countLabel: pad(okruhTopics.length, "TÉMA"),
                        locked: !!anonLocked && i > 0,
                        onClick: () => handleCategoryClick(okruh.id),
                      };
                    })
                  : categories.map((category, i) => {
                      const catTopics = topics.filter(t => t.subject === selectedSubject && t.category === category);
                      const count = new Set(catTopics.map(t => t.topic)).size;
                      const visual = getCategoryVisual(selectedSubject!, category);
                      const desc = displayCatDesc(category) ?? catTopics[0]?.briefDescription ?? null;
                      return {
                        id: category,
                        name: displayCat(category),
                        desc,
                        emoji: visual?.emoji,
                        imageUrl: getCategoryIllustrationUrl(selectedSubject!, category),
                        countLabel: `${count} ${count === 1 ? t("count.topic_1") : count < 5 ? t("count.topic_2_4") : t("count.topic_5_plus")}`,
                        locked: !!anonLocked && i > 0,
                        onClick: () => handleCategoryClick(category),
                      };
                    });
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cards.map(card => card.locked ? (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => onLockedClick?.()}
                        title="Zaregistruj se zdarma a odemkni všechny okruhy"
                        className="group aspect-square relative text-left rounded-3xl border-2 border-border bg-muted/60 shadow-e1 transition-all duration-150 hover:border-primary/40 hover:shadow-e2 hover:-translate-y-px p-4 flex flex-col"
                      >
                        {/* Zámek v rohu — ilustrace ztlumená (zašedlá), ať je jasné že je zamčeno */}
                        <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-card border border-border flex items-center justify-center shadow-e1 z-10">
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 flex items-center justify-center grayscale opacity-55">
                          <PrvoukaImage imageUrl={card.imageUrl} fallbackEmoji={card.emoji} size="lg" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-lg font-black text-muted-foreground tracking-tight leading-tight line-clamp-2">{card.name}</h3>
                          {/* Dřív tu bylo „🔓 Přihlásit se →" — otevřený zámek přímo pod
                              zavřeným <Lock> ikonou, tedy dva protichůdné signály. A dítě
                              bez účtu se nemá čím přihlásit; klik otevírá nabídku „Jsem žák /
                              Jsem rodič", takže správné sloveso je „odemknout". */}
                          <p className="text-sm font-bold text-primary leading-snug inline-flex items-center gap-1.5">
                            Odemknout <PaintedArrow className="h-3.5 w-3.5" />
                          </p>
                        </div>
                      </button>
                    ) : (
                      <button
                        key={card.id}
                        type="button"
                        onClick={card.onClick}
                        className={browseCardClass}
                      >
                        <div className={`flex-1 flex items-center justify-center my-1 rounded-2xl ${subjectPalette.tintClass}`}>
                          <PrvoukaImage imageUrl={card.imageUrl} fallbackEmoji={card.emoji} size="lg" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-lg font-black text-foreground tracking-tight leading-tight line-clamp-2">{card.name}</h3>
                          {card.desc && (
                            <p className="text-base text-foreground/65 leading-snug line-clamp-2">{card.desc}</p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                );
              })()}

              {/* TOPIC level — asymmetric grid s description na primary */}
              {level === "topic" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topicGroups.map((topicName) => {
                    const skillsInGroup = topics.filter(
                      (t) => t.subject === selectedSubject && t.category === selectedCategory && t.topic === topicName
                    );
                    const count = skillsInGroup.length;
                    const descFromNames = displayTopDesc(topicName);
                    const description = descFromNames ?? (count > 1
                      ? (skillsInGroup[0]?.topicDescription ?? skillsInGroup[0]?.briefDescription ?? "")
                      : (skillsInGroup[0]?.briefDescription ?? ""));
                    const topicEmoji = getTopicEmoji(selectedSubject!, selectedCategory!, topicName);
                    return (
                      <button
                        key={topicName}
                        type="button"
                        onClick={() => handleTopicClick(topicName)}
                        className={browseCardClass}
                      >
                        <div className={`flex-1 flex items-center justify-center my-1 rounded-2xl ${subjectPalette.tintClass}`}>
                          <PrvoukaImage imageUrl={getTopicIllustrationUrl({ subject: selectedSubject!, topic: topicName, category: selectedCategory! })} fallbackEmoji={topicEmoji} size="lg" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-base font-black text-foreground tracking-tight leading-tight line-clamp-2">
                            {displayTop(topicName)}
                          </h3>
                          {description && (
                            <p className="text-base text-foreground/65 leading-snug line-clamp-2">{description}</p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* SUBTOPIC level — čtvercový grid */}
              {level === "subtopic" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subtopics.map((topic) => {
                    // Custom nav: selectedCategory je id okruhu — pro illustration/emoji
                    // použij skutečnou RVP kategorii tématu.
                    const rvpCategory = activeOkruh ? topic.category : (selectedCategory ?? topic.category);
                    const subEmoji = getTopicEmoji(selectedSubject!, rvpCategory, selectedTopic ?? topic.topic);
                    const isDbOnly = !hasCodeGenerator(topic);
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => onSelectTopic(topic)}
                        className={`${browseCardClass} ${isDbOnly ? "opacity-80" : ""}`}
                      >
                        <div className={`flex-1 flex items-center justify-center my-1 rounded-2xl ${subjectPalette.tintClass}`}>
                          <PrvoukaImage imageUrl={getTopicIllustrationUrl({ subject: selectedSubject!, topic: topic.title, category: rvpCategory })} fallbackEmoji={getTopicEmoji(selectedSubject!, rvpCategory, topic.title) || subEmoji} size="lg" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-base font-black text-foreground tracking-tight leading-tight line-clamp-2">
                            {topic.studentTitle ?? topic.displayName ?? topic.title}
                          </h3>
                          {topic.briefDescription && (
                            <p className="text-base text-foreground/65 leading-snug line-clamp-2">{topic.briefDescription}</p>
                          )}
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

const IMG_SIZES = { hero: "w-48 h-48 sm:w-56 sm:h-56", lg: "w-44 h-44", md: "w-16 h-16", sm: "w-12 h-12" };
const EMOJI_SIZES = { hero: "text-9xl", lg: "text-6xl", md: "text-3xl", sm: "text-2xl" };
function PrvoukaImage({ imageUrl, fallbackEmoji, size = "md" }: { imageUrl: string | null; fallbackEmoji?: string | null; size?: "hero" | "lg" | "md" | "sm" }) {
  const versioned = useImageVersions();

  const storageKey = imageUrl?.match(/prvouka-images\/(.+?)\.png/)?.[1] ?? null;
  const src = storageKey && imageUrl ? versioned(imageUrl, storageKey) : imageUrl;

  return (
    <IllustrationImg
      src={src}
      className={`${IMG_SIZES[size]} object-contain shrink-0`}
      fallback={fallbackEmoji ? <span className={EMOJI_SIZES[size]}>{fallbackEmoji}</span> : undefined}
    />
  );
}

// ── Extracted dialog components ─────────────────────────────

