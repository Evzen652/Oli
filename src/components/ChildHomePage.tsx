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
            <h2 className="text-lg font-semibold text-foreground text-center">
              {t("child.progress_title")}
            </h2>
            {stats.tasks === 0 ? (
              <Card className="border-2 rounded-xl bg-muted/30">
                <CardContent className="p-4 text-center">
                  <p className="text-muted-foreground text-sm">{t("child.progress_empty")}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                <Card className="rounded-xl border-0 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-950 dark:to-blue-900 shadow-sm">
                  <CardContent className="p-3 flex items-center gap-3">
                    <span className="text-2xl">⚡</span>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      {t("child.progress_sessions").replace("{n}", String(stats.sessions))}
                    </p>
                  </CardContent>
                </Card>
                <Card className="rounded-xl border-0 bg-gradient-to-r from-emerald-100 to-emerald-50 dark:from-emerald-950 dark:to-emerald-900 shadow-sm">
                  <CardContent className="p-3 flex items-center gap-3">
                    <span className="text-2xl">🎯</span>
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                      {t("child.progress_tasks").replace("{n}", String(stats.tasks))}
                    </p>
                  </CardContent>
                </Card>
                <Card className="rounded-xl border-0 bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-950 dark:to-amber-900 shadow-sm">
                  <CardContent className="p-3 flex items-center gap-3">
                    <span className="text-2xl">⭐</span>
                    <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                      {t("child.progress_accuracy").replace("{n}", String(stats.accuracy))}
                    </p>
                  </CardContent>
                </Card>
                {stats.accuracy >= 80 && (
                  <Card className="rounded-xl border-0 bg-gradient-to-r from-green-100 to-teal-50 dark:from-green-950 dark:to-teal-900 shadow-sm">
                    <CardContent className="p-3 flex items-center gap-3">
                      <span className="text-2xl">🎉</span>
                      <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                        {t("child.progress_great")}
                      </p>
                    </CardContent>
                  </Card>
                )}
                {stats.accuracy >= 50 && stats.accuracy < 80 && (
                  <Card className="rounded-xl border-0 bg-gradient-to-r from-sky-100 to-cyan-50 dark:from-sky-950 dark:to-cyan-900 shadow-sm">
                    <CardContent className="p-3 flex items-center gap-3">
                      <span className="text-2xl">👍</span>
                      <p className="text-sm font-semibold text-sky-700 dark:text-sky-300">
                        {t("child.progress_good")}
                      </p>
                    </CardContent>
                  </Card>
                )}
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
