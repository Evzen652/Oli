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
    <div className="flex min-h-screen flex-col items-center bg-background px-4 py-8 sm:py-10">
      <div className="w-full max-w-md space-y-7">
        {/* Hero — owl + pozdrav */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <OlyLogo size="md" />
          </div>
          <h1 className="font-display text-3xl sm:text-[34px] font-extrabold text-foreground tracking-tight leading-tight">
            Ahoj, {childName || "žáku"}! <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-sm text-muted-foreground">Jdeme se dnes něco naučit?</p>
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
          <div className="space-y-5">
            {stats.tasks === 0 ? (
              <Card className="border-2 border-dashed border-primary/30 rounded-3xl bg-primary/5">
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
              <div className="space-y-5">
                {/* 3-stat grid s gradient cards a velkými emoji ikonami */}
                <div className="grid grid-cols-3 gap-3">
                  <StatCard
                    icon="⚡"
                    value={stats.daysActive}
                    label={stats.daysActive === 1 ? "den" : stats.daysActive < 5 ? "dny" : "dnů"}
                    sublabel="cvičil/a jsi"
                    gradient="from-cyan-200 via-cyan-100 to-sky-200"
                  />
                  <StatCard
                    icon="🎯"
                    value={stats.tasks}
                    label={stats.tasks === 1 ? "úloha" : stats.tasks < 5 ? "úlohy" : "úloh"}
                    sublabel="vyřešeno"
                    gradient="from-emerald-200 via-emerald-100 to-teal-200"
                  />
                  <StatCard
                    icon="⭐"
                    value={`${stats.accuracy} %`}
                    label=""
                    sublabel="úspěšnost"
                    gradient="from-amber-200 via-yellow-100 to-orange-200"
                  />
                </div>

                {/* Co jsi procvičoval — green pill cards podle mockupu */}
                {stats.skills.length > 0 && (
                  <div className="space-y-2.5">
                    <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                      <span>📚</span>
                      <span>Co jsi procvičoval</span>
                    </h3>
                    <div className="space-y-2">
                      {stats.skills.map((s) => {
                        const sAcc = s.attempts > 0 ? Math.round((s.correct / s.attempts) * 100) : 0;
                        let tone = "bg-emerald-100/70 border-emerald-200";
                        let badgeText = "skvěle";
                        let badgeIcon = "👍";
                        let badgeBg = "bg-emerald-500 text-white";
                        if (s.attempts < 2) {
                          tone = "bg-slate-100/70 border-slate-200";
                          badgeText = "začínáš";
                          badgeIcon = "🌱";
                          badgeBg = "bg-slate-500 text-white";
                        } else if (sAcc < 50) {
                          tone = "bg-amber-100/70 border-amber-200";
                          badgeText = "trénovat";
                          badgeIcon = "💪";
                          badgeBg = "bg-amber-500 text-white";
                        } else if (sAcc < 80) {
                          tone = "bg-sky-100/70 border-sky-200";
                          badgeText = "dobře";
                          badgeIcon = "👌";
                          badgeBg = "bg-sky-500 text-white";
                        }
                        const wTasks = (n: number) => n === 1 ? "úlohu" : n < 5 ? "úlohy" : "úloh";
                        return (
                          <div
                            key={s.skillId}
                            className={`rounded-2xl border ${tone} p-3.5 flex items-center gap-3 shadow-soft-1`}
                          >
                            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-xl shadow-soft-1 shrink-0" aria-hidden>
                              {getSkillIcon(s.skillId)}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-foreground text-sm leading-tight truncate">
                                {getReadableSkillName(s.skillId)}
                              </p>
                              <p className="text-[12px] text-muted-foreground mt-0.5">
                                Vyzkoušel/a jsi {s.attempts} {wTasks(s.attempts)}
                              </p>
                            </div>
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${badgeBg} shadow-soft-1 shrink-0`}>
                              <span>{badgeIcon}</span>
                              <span>{badgeText}</span>
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Úkoly od rodiče — pastel pill cards podle mockupu */}
        {assignments.length > 0 && (
          <div className="space-y-2.5">
            <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <span>📖</span>
              <span>{t("child.assignments_title")}</span>
            </h2>
            <div className="space-y-2">
              {assignments.map((a, i) => {
                // Alternuj pastel pozadí pro vizuální rozdělení
                const tones = [
                  "bg-violet-100/70 border-violet-200",
                  "bg-emerald-100/70 border-emerald-200",
                  "bg-rose-100/70 border-rose-200",
                  "bg-sky-100/70 border-sky-200",
                ];
                const tone = tones[i % tones.length];
                return (
                  <div key={a.id} className={`rounded-2xl border ${tone} p-3.5 flex items-center gap-3 shadow-soft-1`}>
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-xl shadow-soft-1 shrink-0" aria-hidden>
                      {SUBJECT_EMOJI[a.subject] || "📋"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm leading-tight truncate">
                        {a.skillName}
                      </p>
                      <p className="text-[12px] text-muted-foreground mt-0.5 truncate">
                        {a.note ? `„${a.note}"` : a.due_date ? `termín: ${formatDueDate(a.due_date)}` : "od rodiče"}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="shrink-0 gap-1 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-soft-2 px-4"
                      onClick={() => handleStartAssignment(a)}
                      disabled={!a.topic}
                    >
                      {t("child.start_assignment")}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Self-practice — velký gradient CTA */}
        <button
          onClick={onBrowseTopics}
          className="w-full rounded-2xl py-4 px-6 font-display font-bold text-lg text-white shadow-soft-3 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 hover:from-violet-600 hover:via-purple-600 hover:to-pink-600 transition-all hover:shadow-soft-3 active:scale-[0.99] flex items-center justify-center gap-2"
        >
          <span aria-hidden>✨</span>
          {assignments.length > 0 ? "Procvičovat samostatně" : t("child.browse_topics")}
          <ArrowRight className="h-5 w-5" />
        </button>

        {/* Owl tip card */}
        <div className="rounded-2xl border border-border bg-card/60 p-4 flex items-start gap-3 shadow-soft-1">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-100 text-xl shrink-0" aria-hidden>
            🦉
          </span>
          <div className="space-y-0.5">
            <p className="font-semibold text-sm text-foreground">
              💡 Chyba není problém — tak se učíš
            </p>
            <p className="text-[12px] text-muted-foreground leading-snug">
              Když je úloha těžká, klikni nejdřív na nápovědu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Stat card s gradient pozadím a velkou emoji ikonou */
function StatCard({
  icon, value, label, sublabel, gradient,
}: { icon: string; value: number | string; label: string; sublabel: string; gradient: string }) {
  return (
    <div className={`rounded-3xl bg-gradient-to-br ${gradient} p-3 sm:p-4 text-center shadow-soft-2 border border-white/40`}>
      <div className="text-3xl sm:text-4xl mb-1 leading-none" aria-hidden>{icon}</div>
      <p className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tabular-nums leading-tight">
        {value}
        {label && <span className="text-base ml-0.5 font-bold opacity-80">{label}</span>}
      </p>
      <p className="text-[11px] text-foreground/70 font-medium mt-0.5">
        {sublabel}
      </p>
    </div>
  );
}
