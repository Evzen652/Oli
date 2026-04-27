import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getTopicById } from "@/lib/contentRegistry";
import type { TopicMetadata, Grade } from "@/lib/types";
import { useT } from "@/lib/i18n";
import { useChildStats } from "@/hooks/useChildStats";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, ArrowRight, Calendar, Link2 } from "lucide-react";
import { OlyLogo } from "@/components/OlyLogo";
import { toast } from "sonner";
import { getReadableSkillName, getSkillIcon } from "@/lib/skillReadableName";

interface Assignment {
  id: string;
  skill_id: string;
  note: string | null;
  due_date: string | null;
  assigned_date: string;
  skillName: string;
  subject: string;
  topic?: TopicMetadata;
}

const SUBJECT_EMOJI: Record<string, string> = {
  matematika: "🔢",
  čeština: "📝",
  prvouka: "🌿",
};

// ========== Pairing Code Input (6 individual boxes) ==========
function PairingCodeInput({ onPaired }: { onPaired: (childName: string, grade: number) => void }) {
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    const char = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    setErrorMsg("");
    setStatus("idle");

    // Auto-focus next
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 filled
    if (char && index === 5 && next.every(d => d)) {
      submitCode(next.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const next = [...digits];
      next[index - 1] = "";
      setDigits(next);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
    const next = [...digits];
    for (let i = 0; i < text.length; i++) {
      next[i] = text[i];
    }
    setDigits(next);
    if (text.length === 6) {
      inputRefs.current[5]?.focus();
      submitCode(text);
    } else if (text.length > 0) {
      inputRefs.current[Math.min(text.length, 5)]?.focus();
    }
  };

  const submitCode = async (code: string) => {
    setStatus("loading");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setStatus("error"); setErrorMsg("Nejsi přihlášen/a"); return; }

      const { data, error } = await supabase
        .from("children")
        .update({ child_user_id: user.id })
        .eq("pairing_code", code)
        .gte("pairing_code_expires_at", new Date().toISOString())
        .is("child_user_id", null)
        .select("name, grade")
        .maybeSingle();

      if (error || !data) {
        setStatus("error");
        setErrorMsg("Neplatný nebo expirovaný kód. Zkus to znovu.");
        setDigits(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        setStatus("success");
        toast.success(`Propojeno! Ahoj, ${data.child_name}!`);
        onPaired(data.child_name, data.grade);
      }
    } catch {
      setStatus("error");
      setErrorMsg("Něco se pokazilo. Zkus to znovu.");
    }
  };

  return (
    <Card className="border-2 border-dashed border-primary/30 rounded-2xl bg-primary/5">
      <CardContent className="p-6 space-y-4 text-center">
        <div className="flex items-center justify-center gap-2 text-primary">
          <Link2 className="h-5 w-5" />
          <h3 className="font-semibold text-base">Propoj se s rodičem</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Zadej 6místný kód, který ti dal rodič
        </p>

        <div className="flex justify-center gap-2" onPaste={handlePaste}>
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={el => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="text"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              disabled={status === "loading" || status === "success"}
              className={`
                w-12 h-14 text-center text-2xl font-mono font-bold rounded-xl border-2
                outline-none transition-all duration-150
                ${status === "error" ? "border-destructive bg-destructive/5 animate-shake" : ""}
                ${status === "success" ? "border-green-500 bg-green-50 text-green-700" : ""}
                ${status === "idle" || status === "loading" ? "border-input hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 bg-background" : ""}
              `}
            />
          ))}
        </div>

        {status === "loading" && (
          <p className="text-sm text-muted-foreground animate-pulse">Ověřuji kód...</p>
        )}
        {status === "error" && (
          <p className="text-sm text-destructive">{errorMsg}</p>
        )}
        {status === "success" && (
          <p className="text-sm text-green-600 font-medium">Propojeno!</p>
        )}
      </CardContent>
    </Card>
  );
}

interface ChildHomePageProps {
  grade: Grade;
  onSelectTopic: (topic: TopicMetadata) => void;
  onBrowseTopics: () => void;
}

export function ChildHomePage({ grade, onSelectTopic, onBrowseTopics }: ChildHomePageProps) {
  const t = useT();
  const [childName, setChildName] = useState<string>("");
  const [childId, setChildId] = useState<string | null>(null);
  const [isPaired, setIsPaired] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const stats = useChildStats(childId);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Try to find child record by child_user_id first
      let child: { id: string; name: string } | null = null;
      const { data: childByUser } = await supabase
        .from("children")
        .select("id, child_name")
        .eq("child_user_id", user.id)
        .maybeSingle();

      if (childByUser) {
        child = childByUser;
        setIsPaired(true);
      } else {
        // Admin/parent preview: find first child owned by this user
        const { data: childByParent } = await supabase
          .from("children")
          .select("id, child_name")
          .eq("parent_user_id", user.id)
          .limit(1)
          .maybeSingle();
        if (childByParent) {
          child = childByParent;
        }
      }

      if (!child) {
        setLoading(false);
        return;
      }

      setChildName(child.child_name);
      setChildId(child.id);

      // Get pending assignments
      const { data: rawAssignments } = await supabase
        .from("parent_assignments")
        .select("id, skill_id, note, due_date, assigned_date")
        .eq("child_id", child.id)
        .eq("status", "pending")
        .order("due_date", { ascending: true, nullsFirst: false })
        .order("assigned_date", { ascending: true });

      if (!rawAssignments || rawAssignments.length === 0) {
        setAssignments([]);
        setLoading(false);
        return;
      }

      // Resolve skill names: code registry first, then DB fallback
      const skillIds = rawAssignments.map(a => a.skill_id);
      const needDbLookup: string[] = [];
      const topicMap: Record<string, TopicMetadata> = {};

      for (const sid of skillIds) {
        const topic = getTopicById(sid);
        if (topic) {
          topicMap[sid] = topic;
        } else {
          needDbLookup.push(sid);
        }
      }

      let dbNameMap: Record<string, { name: string; subject?: string }> = {};
      if (needDbLookup.length > 0) {
        const { data: skills } = await supabase
          .from("curriculum_skills")
          .select("code_skill_id, name, topic_id")
          .in("code_skill_id", needDbLookup);

        if (skills) {
          for (const sk of skills) {
            dbNameMap[sk.code_skill_id] = { name: sk.name };
          }
        }
      }

      const mapped: Assignment[] = rawAssignments.map(a => {
        const topic = topicMap[a.skill_id];
        const dbInfo = dbNameMap[a.skill_id];
        return {
          id: a.id,
          skill_id: a.skill_id,
          note: a.note,
          due_date: a.due_date,
          assigned_date: a.assigned_date,
          skillName: topic?.title ?? dbInfo?.name ?? a.skill_id,
          subject: topic?.subject ?? "",
          topic,
        };
      });

      setAssignments(mapped);
      setLoading(false);
    })();
  }, []);

  const handleStartAssignment = (assignment: Assignment) => {
    if (assignment.topic) {
      onSelectTopic(assignment.topic);
    } else {
      // DB-only topic — try to construct minimal TopicMetadata
      const fallback = getTopicById(assignment.skill_id);
      if (fallback) {
        onSelectTopic(fallback);
      }
    }
  };

  const formatDueDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("cs-CZ", { day: "numeric", month: "numeric" });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-background px-4 py-8">
      <div className="w-full max-w-lg space-y-8">
        {/* Logo + greeting */}
        <div className="text-center space-y-3">
          <OlyLogo size="md" />
          <h1 className="text-2xl font-bold text-foreground">
            {t("child.hello").replace("{name}", childName || "žáku")}
          </h1>
        </div>

        {/* Pairing code input — shown when child is not yet paired */}
        {!isPaired && (
          <PairingCodeInput
            onPaired={(name, g) => {
              setChildName(name);
              setIsPaired(true);
            }}
          />
        )}

        {/* Weekly progress */}
        {!stats.loading && (
          <div className="space-y-3">
            <div className="text-center space-y-0.5">
              <h2 className="text-lg font-semibold text-foreground">
                {t("child.progress_title")}
              </h2>
              <p className="text-xs text-muted-foreground">posledních 7 dní</p>
            </div>
            {stats.tasks === 0 ? (
              <Card className="border-2 border-dashed border-primary/30 rounded-xl bg-primary/5">
                <CardContent className="p-5 text-center space-y-3">
                  <p className="text-3xl">🚀</p>
                  <p className="text-base font-semibold text-foreground">
                    Tento týden tu zatím není žádné cvičení.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Pojď začít! Vyber si úkol od rodiče níž, nebo si zvol téma sám.
                    Stačí jen 5 minut denně — to je nejlepší recept.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {/* Friendly summary — vše v jedné kartě, plné věty */}
                {(() => {
                  const aloneCount = stats.tasks - stats.helpUsed - stats.wrong;
                  const wordTasks = (n: number) => n === 1 ? "úlohu" : n < 5 ? "úlohy" : "úloh";
                  return (
                    <Card className="rounded-2xl border-2 border-primary/20 bg-card shadow-sm">
                      <CardContent className="p-4 space-y-2">
                        <p className="text-sm flex items-start gap-2.5">
                          <span className="text-lg flex-shrink-0">📅</span>
                          <span className="text-foreground">
                            Cvičil/a jsi
                            {" "}<span className="font-bold text-blue-700 dark:text-blue-300">{stats.daysActive}</span>
                            {" "}{stats.daysActive === 1 ? "den" : stats.daysActive < 5 ? "dny" : "dnů"}
                            {" "}<span className="text-muted-foreground">(z posledních 7)</span>
                          </span>
                        </p>
                        <p className="text-sm flex items-start gap-2.5">
                          <span className="text-lg flex-shrink-0">📝</span>
                          <span className="text-foreground">
                            Dohromady jsi vyřešil/a
                            {" "}<span className="font-bold text-emerald-700 dark:text-emerald-300">{stats.tasks}</span>
                            {" "}{stats.tasks === 1 ? "úlohu" : stats.tasks < 5 ? "úlohy" : "úloh"}
                            {" "}<span className="text-muted-foreground">{stats.sessions === 1 ? "v 1 cvičení" : `v ${stats.sessions} cvičeních`}</span>
                          </span>
                        </p>
                        {aloneCount > 0 && (
                          <p className="text-sm flex items-start gap-2.5">
                            <span className="text-lg flex-shrink-0">✅</span>
                            <span className="text-foreground">
                              Sám/sama jsi zvládl/a
                              {" "}<span className="font-bold text-emerald-700 dark:text-emerald-400">{aloneCount}</span>
                              {" "}{wordTasks(aloneCount)}
                            </span>
                          </p>
                        )}
                        {stats.helpUsed > 0 && (
                          <p className="text-sm flex items-start gap-2.5">
                            <span className="text-lg flex-shrink-0">💡</span>
                            <span className="text-foreground">
                              S nápovědou jsi zvládl/a
                              {" "}<span className="font-bold text-sky-700 dark:text-sky-400">{stats.helpUsed}</span>
                              {" "}{wordTasks(stats.helpUsed)}
                            </span>
                          </p>
                        )}
                        {stats.wrong > 0 && (
                          <p className="text-sm flex items-start gap-2.5">
                            <span className="text-lg flex-shrink-0">❌</span>
                            <span className="text-foreground">
                              Chybu jsi udělal/a
                              {" "}<span className="font-bold text-rose-700 dark:text-rose-400">{stats.wrong}×</span>
                            </span>
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })()}

                {/* Co jsi procvičoval — per-skill rozpis (před globálním souhrnem,
                    aby žák věděl k čemu se čísla vztahují) */}
                {stats.skills.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                      <span>📚</span>
                      <span>Co jsi procvičoval</span>
                    </h3>
                    <div className="space-y-1.5">
                      {stats.skills.map((s) => {
                        const sAcc = s.attempts > 0 ? Math.round((s.correct / s.attempts) * 100) : 0;
                        let tone = "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800";
                        let badge = "🌟";
                        let badgeText = "skvěle";
                        let badgeColor = "text-emerald-700 dark:text-emerald-400";
                        if (s.attempts < 2) {
                          tone = "bg-slate-50 dark:bg-slate-950/30 border-slate-200 dark:border-slate-800";
                          badge = "🌱";
                          badgeText = "začínáš";
                          badgeColor = "text-slate-700 dark:text-slate-400";
                        } else if (sAcc < 50) {
                          tone = "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800";
                          badge = "💪";
                          badgeText = "trénovat";
                          badgeColor = "text-amber-700 dark:text-amber-400";
                        } else if (sAcc < 80) {
                          tone = "bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800";
                          badge = "👍";
                          badgeText = "dobře";
                          badgeColor = "text-sky-700 dark:text-sky-400";
                        }
                        const wTasks = (n: number) => n === 1 ? "úlohu" : n < 5 ? "úlohy" : "úloh";
                        return (
                          <div key={s.skillId} className={`rounded-xl border p-3 ${tone} space-y-1.5`}>
                            {/* Header: emoji + name + badge */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-base" aria-hidden>{getSkillIcon(s.skillId)}</span>
                              <p className="font-medium text-sm text-foreground flex-1 min-w-0 truncate">
                                {getReadableSkillName(s.skillId)}
                              </p>
                              <span className={`text-xs font-bold tabular-nums ${badgeColor} whitespace-nowrap`}>
                                {badge} {badgeText}
                              </span>
                            </div>
                            {/* Subtitle: kolik úloh celkem */}
                            <p className="text-xs text-muted-foreground ml-6">
                              Vyzkoušel/a jsi <span className="font-bold text-foreground">{s.attempts}</span> {wTasks(s.attempts)}:
                            </p>
                            {/* Breakdown: stejný styl jako v summary kartě nahoře */}
                            <div className="ml-6 space-y-1">
                              {s.correct > 0 && (
                                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                                  ✅ Sám/sama jsi zvládl/a <span className="font-bold">{s.correct}</span> {wTasks(s.correct)}
                                </p>
                              )}
                              {s.helpUsed > 0 && (
                                <p className="text-xs text-sky-700 dark:text-sky-400">
                                  💡 S nápovědou jsi zvládl/a <span className="font-bold">{s.helpUsed}</span> {wTasks(s.helpUsed)}
                                </p>
                              )}
                              {s.wrong > 0 && (
                                <p className="text-xs text-rose-700 dark:text-rose-400">
                                  ❌ Chybu jsi udělal/a <span className="font-bold">{s.wrong}×</span>
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}


                {/* Návodný blok — co se ti daří + tip */}
                {(() => {
                  const helpRatio = stats.tasks > 0 ? stats.helpUsed / stats.tasks : 0;
                  const wrongRatio = stats.tasks > 0 ? stats.wrong / stats.tasks : 0;

                  // Pravidelnost
                  let regularityCard: { emoji: string; title: string; text: string; tone: string } | null = null;
                  if (stats.daysActive >= 4) {
                    regularityCard = {
                      emoji: "🔥",
                      title: "Cvičíš pravidelně — to je super!",
                      text: "Pravidelnost je ten nejdůležitější krok. I jen 5 minut denně dělá zázraky.",
                      tone: "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-300",
                    };
                  } else if (stats.daysActive >= 2) {
                    regularityCard = {
                      emoji: "💪",
                      title: "Dobře, že to nenecháváš",
                      text: "Zkus cvičit každý den po malých kouscích — i 5 minut stačí, ale ať je to každý den.",
                      tone: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300",
                    };
                  } else {
                    regularityCard = {
                      emoji: "📅",
                      title: "Zkus si dát procvičování každý den",
                      text: "I 5 minut denně přinese mnohem víc než dlouhé cvičení jen jednou za týden.",
                      tone: "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300",
                    };
                  }

                  // Tip podle profilu chyb
                  let tipCard: { emoji: string; title: string; text: string; tone: string } | null = null;
                  if (stats.accuracy >= 80) {
                    tipCard = {
                      emoji: "🎉",
                      title: "Jde ti to skvěle!",
                      text: "Zkus si dnes nějaké těžší téma — když to máš v malíku, můžeš se posunout dál.",
                      tone: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300",
                    };
                  } else if (helpRatio >= 0.3) {
                    tipCard = {
                      emoji: "💡",
                      title: "Nápověda ti pomáhá — to je super!",
                      text: "Když si nevíš rady, klidně ji použij. Ale postupně si zkus pár úloh i bez ní — uvidíš, že to půjde.",
                      tone: "bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300",
                    };
                  } else if (wrongRatio >= 0.3) {
                    tipCard = {
                      emoji: "🌱",
                      title: "Chyba není problém — tak se učíš",
                      text: "Když je úloha těžká, klikni nejdřív na nápovědu a zkus to znovu. Není potřeba to mít napoprvé.",
                      tone: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300",
                    };
                  } else {
                    tipCard = {
                      emoji: "👍",
                      title: "Jde ti to dobře, pokračuj!",
                      text: "Daří se ti většinu úloh řešit samostatně — to je přesně to, co chceme.",
                      tone: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300",
                    };
                  }

                  return (
                    <>
                      {regularityCard && (
                        <div className={`rounded-xl border p-3 flex items-start gap-3 ${regularityCard.tone}`}>
                          <span className="text-2xl flex-shrink-0">{regularityCard.emoji}</span>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm">{regularityCard.title}</p>
                            <p className="text-xs leading-relaxed mt-0.5 opacity-90">{regularityCard.text}</p>
                          </div>
                        </div>
                      )}
                      {tipCard && (
                        <div className={`rounded-xl border p-3 flex items-start gap-3 ${tipCard.tone}`}>
                          <span className="text-2xl flex-shrink-0">{tipCard.emoji}</span>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm">{tipCard.title}</p>
                            <p className="text-xs leading-relaxed mt-0.5 opacity-90">{tipCard.text}</p>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}

              </div>
            )}
          </div>
        )}

        {/* Assignments section */}
        {assignments.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              {t("child.assignments_title")}
            </h2>
            <div className="space-y-3">
              {assignments.map((a) => (
                <Card key={a.id} className="border-2 rounded-xl hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="font-medium text-foreground text-base">
                          {SUBJECT_EMOJI[a.subject] || "📋"} {a.skillName}
                        </p>
                        {a.note && (
                          <p className="text-sm text-muted-foreground italic truncate">
                            „{a.note}"
                          </p>
                        )}
                        {a.due_date && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {t("child.due_date").replace("{date}", formatDueDate(a.due_date))}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        className="shrink-0 gap-1"
                        onClick={() => handleStartAssignment(a)}
                        disabled={!a.topic}
                      >
                        {t("child.start_assignment")}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        {assignments.length > 0 && (
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm text-muted-foreground">{t("child.or_divider")}</span>
            <div className="flex-1 h-px bg-border" />
          </div>
        )}

        {/* Self-practice button */}
        <div className="text-center">
          {assignments.length === 0 && (
            <p className="text-muted-foreground mb-4">{t("child.no_assignments")}</p>
          )}
          <Button
            size="lg"
            variant={assignments.length > 0 ? "outline" : "default"}
            className="gap-2 text-base px-8"
            onClick={onBrowseTopics}
          >
            {t("child.browse_topics")}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
