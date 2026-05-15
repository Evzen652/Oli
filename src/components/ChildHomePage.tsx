import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getTopicById } from "@/lib/contentRegistry";
import type { TopicMetadata, Grade } from "@/lib/types";
import { useT } from "@/lib/i18n";
import { useChildStats, type StatsPeriod } from "@/hooks/useChildStats";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calendar, ChevronDown, Link2 } from "lucide-react";
import { toast } from "sonner";
import { getReadableSkillName, getSkillIcon } from "@/lib/skillReadableName";
import { getSubjectMeta } from "@/lib/subjectRegistry";
import { logoNoText } from "@/components/OlyLogo";
import { IllustrationImg } from "@/components/IllustrationImg";
import { DewhiteImg } from "@/components/DewhiteImg";
import { toGreeting } from "@/lib/czechNames";

interface Assignment {
  id: string;
  skill_id: string;
  note: string | null;
  due_date: string | null;
  assigned_date: string;
  skillName: string;
  subject: string;
  status?: string;
  topic?: TopicMetadata;
}

const DEMO_PARENT_ID = "f0b2bf8b-39f1-4d12-a47b-46691d8472a9";

const today = new Date();
const dStr = (daysAgo: number) => {
  const d = new Date(today); d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
};

const DEMO_CHILD_ASSIGNMENTS: Assignment[] = [
  { id: "dc1", skill_id: "math-multiply",          note: null, due_date: dStr(-1), assigned_date: dStr(1),  skillName: "Násobilka",              subject: "matematika", status: "pending" },
  { id: "dc2", skill_id: "math-add-sub-100",        note: null, due_date: null,     assigned_date: dStr(3),  skillName: "Sčítání a odčítání do 100", subject: "matematika", status: "pending" },
  { id: "dc3", skill_id: "cz-vyjmenovana-slova-b",  note: null, due_date: null,     assigned_date: dStr(6),  skillName: "Vyjmenovaná slova po B",  subject: "čeština",    status: "pending" },
  { id: "dc4", skill_id: "pr-plant-parts",          note: null, due_date: null,     assigned_date: dStr(14), skillName: "Části rostlin",           subject: "prvouka",    status: "completed" },
  { id: "dc5", skill_id: "cz-slovni-druhy",         note: null, due_date: null,     assigned_date: dStr(18), skillName: "Slovní druhy",            subject: "čeština",    status: "completed" },
];

// ── Pairing code ──────────────────────────────────────────────────────────────

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
    if (char && index < 5) inputRefs.current[index + 1]?.focus();
    if (char && index === 5 && next.every(d => d)) submitCode(next.join(""));
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const next = [...digits]; next[index - 1] = ""; setDigits(next);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
    const next = [...digits];
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    setDigits(next);
    if (text.length === 6) { inputRefs.current[5]?.focus(); submitCode(text); }
    else if (text.length > 0) inputRefs.current[Math.min(text.length, 5)]?.focus();
  };

  const submitCode = async (code: string) => {
    setStatus("loading");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setStatus("error"); setErrorMsg("Nejsi přihlášen/a"); return; }
      const { data, error } = await supabase
        .from("children").update({ child_user_id: user.id })
        .eq("pairing_code", code).gte("pairing_code_expires_at", new Date().toISOString())
        .is("child_user_id", null).select("child_name, grade").maybeSingle();
      if (error || !data) {
        setStatus("error"); setErrorMsg("Neplatný nebo expirovaný kód. Zkus to znovu.");
        setDigits(["", "", "", "", "", ""]); inputRefs.current[0]?.focus();
      } else {
        setStatus("success"); toast.success(`Propojeno! Ahoj, ${data.child_name}!`);
        onPaired(data.child_name, data.grade);
      }
    } catch { setStatus("error"); setErrorMsg("Něco se pokazilo. Zkus to znovu."); }
  };

  return (
    <Card className="border-2 border-dashed border-primary/30 rounded-2xl bg-primary/5">
      <CardContent className="p-6 space-y-4 text-center">
        <div className="flex items-center justify-center gap-2 text-primary">
          <Link2 className="h-5 w-5" />
          <h3 className="font-semibold text-base">Propoj se s rodičem</h3>
        </div>
        <p className="text-sm text-muted-foreground">Zadej 6místný kód, který ti dal rodič</p>
        <div className="flex justify-center gap-2" onPaste={handlePaste}>
          {digits.map((digit, i) => (
            <input key={i} ref={el => { inputRefs.current[i] = el; }} type="text" inputMode="text"
              maxLength={1} value={digit} onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)} disabled={status === "loading" || status === "success"}
              className={`w-12 h-14 text-center text-2xl font-mono font-bold rounded-xl border-2 outline-none transition-all
                ${status === "error" ? "border-destructive bg-destructive/5" : ""}
                ${status === "success" ? "border-green-500 bg-green-50 text-green-700" : ""}
                ${status === "idle" || status === "loading" ? "border-input hover:border-primary focus:border-primary bg-background" : ""}`}
            />
          ))}
        </div>
        {status === "loading" && <p className="text-sm text-muted-foreground animate-pulse">Ověřuji kód...</p>}
        {status === "error" && <p className="text-sm text-destructive">{errorMsg}</p>}
        {status === "success" && <p className="text-sm text-green-600 font-medium">Propojeno!</p>}
      </CardContent>
    </Card>
  );
}

// ── Ilustrace a konstanty ─────────────────────────────────────────────────────

const MOTIVATIONAL_IMG = "https://uusaczibimqvaazpaopy.supabase.co/storage/v1/object/public/prvouka-images/ui-child-desk.png";

// ── Tipy dne ─────────────────────────────────────────────────────────────────

const TIPS = [
  "Chyba není problém — tak se učíš.",
  "Krátké procvičování každý den je lepší než hodina jednou za týden.",
  "Když ti něco nejde, zkus to říct nahlas. Pomáhá to!",
  "Mozek si pamatuje nejlépe to, co opakuješ s odstupem.",
  "Nevíš? Zkus hádat — trefená odpověď se lépe zapamatuje.",
  "Přestávky jsou součást učení, ne únik od něj.",
  "Každý byl jednou začátečník — i tvůj učitel.",
  "Těžké úlohy tě posunou víc než jednoduché.",
  "Soustředění na 10 minut je víc než hodina s telefonem vedle.",
  "Ptát se je chytré, ne trapné.",
  "Chyby dělají všichni — důležité je zkusit to znovu.",
  "Malý pokrok každý den — za měsíc to bude velká změna.",
  "Čtení zadání dvakrát ušetří hodně chyb.",
  "Pokud ti jde matematika, pomůže to i ve fyzice, chemii a informatice.",
  "Učení je jako sport — čím víc tréninku, tím lepší výkon.",
  "Když si látku vysvětlíš sám sobě, víš, že ji opravdu umíš.",
  "Neboj se pomalého postupu — pomalý je pořád lepší než žádný.",
  "Tvůj mozek roste s každou novou věcí, kterou se naučíš.",
  "Dnes těžké, zítra lehčí — tak funguje procvičování.",
  "Soustřeď se na jednu věc najednou. Multitasking při učení nefunguje.",
  "Úspěch není talent — je to výsledek pravidelné práce.",
  "I krátké opakování těsně před spánkem pomáhá zapamatování.",
  "Nejlepší čas začít byl včera. Druhý nejlepší je teď.",
  "Udělat chybu a poučit se z ní je součást každého úspěchu.",
  "Tvůj výkon dnes nemusí být dokonalý — musí být o trochu lepší než včera.",
  "Číst zadání pomalu je rychlejší než číst ho znovu po špatné odpovědi.",
  "Každá splněná úloha je krok správným směrem.",
  "Radost z pochopení je lepší pocit než jakákoliv hra.",
  "Klid a soustředění — dvě věci, které ti Oli vždycky dá.",
  "Dnes se naučíš něco, co ti za rok přijde samozřejmé.",
  "Zkus si po procvičování říct, co ses dnes naučil/a nového.",
];

// ── Motivační věta ────────────────────────────────────────────────────────────

export function motivationalEmoji(days: number, tasks: number, accuracy: number): string {
  const seed = new Date().getDate();
  const highStreak = days >= 5;
  const goodAccuracy = accuracy >= 75;
  const lowAccuracy = accuracy < 50 && tasks >= 5;
  if (highStreak && goodAccuracy) return ["🏆", "🚀", "💪", "⚡"][seed % 4];
  if (lowAccuracy) return ["💡", "🔥", "🎯"][seed % 3];
  return ["🌟", "✨", "👏", "🎉", "💫"][seed % 5];
}

export function motivationalMessage(days: number, tasks: number, accuracy: number, name: string): string {
  const greeting = name ? toGreeting(name) : "kamaráde";
  const seed = new Date().getDate(); // mění se každý den

  const highStreak = days >= 5;
  const goodAccuracy = accuracy >= 75;
  const manyTasks = tasks >= 20;
  const lowAccuracy = accuracy < 50 && tasks >= 5;

  const variants: string[][] = [
    // Vysoký streak + dobrá úspěšnost
    highStreak && goodAccuracy ? [
      `${greeting}, ${pluralDays(days)} v řadě a ${accuracy} % správně — to je fakt skvělý výsledek! Pokračuj, jde ti to výborně.`,
      `Wow, ${pluralDays(days)} bez přerušení! Tvoje ${accuracy}% úspěšnost ukazuje, že látku opravdu zvládáš. Jen tak dál!`,
      `${pluralDays(days)} v řadě, ${tasks} splněných úloh a ${accuracy} % — tohle jsou čísla, na která můžeš být hrdý/á.`,
    ] : [],

    // Vysoký streak, slabší úspěšnost
    highStreak && !goodAccuracy ? [
      `${greeting}, ${pluralDays(days)} v řadě — to je vytrvalost! Přesnost zatím ${accuracy} %, ale to se cvičením zlepší. Nehárej!`,
      `Procvičuješ ${pluralDays(days)} za sebou — to je skvělý návyk. Některé úlohy jdou těžce, ale právě tak se to učí.`,
    ] : [],

    // Hodně úloh
    manyTasks ? [
      `${tasks} úloh tento týden — to je pořádná dávka! Mozek ti poděkuje, až přijde písemka.`,
      `${greeting}, ${tasks} splněných úloh mluví za vše. Jsi pilný/á a výsledky budou přicházet.`,
    ] : [],

    // Slabá úspěšnost — povzbudit
    lowAccuracy ? [
      `${accuracy} % správně — chyby jsou součást učení, ${greeting}. Zkus se dnes zaměřit na jedno téma a uvidíš, jak rychle to půjde lépe.`,
      `Zatím ${accuracy} % úspěšnost — nevzdávej to! Každá špatná odpověď tě přiblíží k té správné.`,
    ] : [],

    // Obecné varianty (vždy dostupné jako záloha)
    [
      `${greeting}, máš za sebou ${tasks} úloh a ${pluralDays(days)} procvičování v řadě. Jsi na dobré cestě — pokračuj!`,
      `${pluralDays(days)} trénování a ${tasks} úloh — to se počítá. Co si dnes vybereš?`,
      `Tvoje ${accuracy}% úspěšnost a ${tasks} splněných úloh ukazují, že makáš. Jen tak dál, ${greeting}!`,
      `${tasks} úloh tento týden a ${accuracy} % správně — dobrý základ. Pojď přidat další!`,
      `Každý den trošku navíc. ${pluralDays(days)} v řadě dokazuje, že to myslíš vážně.`,
    ],
  ];

  const pool = variants.flat();
  return pool[seed % pool.length];
}

// ── Main component ────────────────────────────────────────────────────────────

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
  const [statsPeriod, setStatsPeriod] = useState<StatsPeriod>("7d");
  const [skillSubject, setSkillSubject] = useState<string | null>(null);
  const [assignmentSubject, setAssignmentSubject] = useState<string | null>(null);
  const [assignmentDateFilter, setAssignmentDateFilter] = useState<"all" | "today" | "week" | "older" | "completed">("all");
  const [isDemoUser, setIsDemoUser] = useState(false);
  const DEMO_STATS = { tasks: 41, daysActive: 8, accuracy: 66, sessions: 12, helpUsed: 8, wrong: 14 };
  const stats = useChildStats(childId, statsPeriod, isDemoUser ? DEMO_STATS : undefined);

  const [assignmentRefreshKey, setAssignmentRefreshKey] = useState(0);

  useEffect(() => {
    const onFocus = () => setAssignmentRefreshKey(k => k + 1);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let child: { id: string; name: string } | null = null;
      const { data: childByUser } = await supabase.from("children").select("id, child_name")
        .eq("child_user_id", user.id).maybeSingle();

      if (childByUser) { child = childByUser; setIsPaired(true); }
      else {
        const { data: childByParent } = await supabase.from("children").select("id, child_name")
          .eq("parent_user_id", user.id).limit(1).maybeSingle();
        if (childByParent) child = childByParent;
      }

      if (!child) { setLoading(false); return; }
      setChildName(child.child_name);
      setChildId(child.id);

      // Demo účet — inject mock data, neptat se DB
      if (user.email === "eweigl@email.cz") {
        setIsDemoUser(true);
        setAssignments(DEMO_CHILD_ASSIGNMENTS);
        setLoading(false);
        return;
      }

      const { data: rawAll } = await supabase.from("parent_assignments")
        .select("id, skill_id, note, due_date, assigned_date, status").eq("child_id", child.id)
        .order("due_date", { ascending: true, nullsFirst: false })
        .order("assigned_date", { ascending: true });

      const rawPending = rawAll ?? [];

      const skillIds = [...new Set(rawPending.map(a => a.skill_id))];
      const topicMap: Record<string, TopicMetadata> = {};
      const needDbLookup: string[] = [];
      for (const sid of skillIds) {
        const topic = getTopicById(sid);
        if (topic) topicMap[sid] = topic; else needDbLookup.push(sid);
      }

      let dbNameMap: Record<string, { name: string; subject: string; category: string }> = {};
      if (needDbLookup.length > 0) {
        const { data: skills } = await supabase.from("curriculum_skills")
          .select("code_skill_id, name, curriculum_topics(name, curriculum_categories(name, curriculum_subjects(slug, name)))")
          .in("code_skill_id", needDbLookup);
        if (skills) for (const sk of skills) {
          const cat = (sk.curriculum_topics as any)?.curriculum_categories;
          const subj = cat?.curriculum_subjects;
          dbNameMap[sk.code_skill_id] = {
            name: sk.name,
            subject: subj?.slug ?? "",
            category: cat?.name ?? "",
          };
        }
      }

      const resolveAssignment = (a: typeof allRaw[0]): Assignment => {
        const topic = topicMap[a.skill_id];
        const db = dbNameMap[a.skill_id];
        return {
          id: a.id, skill_id: a.skill_id, note: a.note, due_date: a.due_date,
          assigned_date: a.assigned_date,
          skillName: topic?.title ?? db?.name ?? a.skill_id,
          subject: topic?.subject ?? db?.subject ?? "",
          topic: topic ?? (db ? { category: db.category, subject: db.subject, _dbOnly: true, generator: () => [] } as any : undefined),
        };
      };

      setAssignments(rawPending.map(resolveAssignment));
      setLoading(false);
    })();
  }, [assignmentRefreshKey]);

  const handleStartAssignment = (assignment: Assignment) => {
    const topic = assignment.topic ?? getTopicById(assignment.skill_id);
    if (topic) onSelectTopic(topic);
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr + "T00:00:00").toLocaleDateString("cs-CZ", { day: "numeric", month: "numeric" });

  const formatDueDate = formatDate;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">{t("loading")}</p>
      </div>
    );
  }

  const showStats = !stats.loading && stats.tasks > 0;

  const assignmentSubjects = [...new Set(assignments.map(a => a.subject).filter(Boolean) as string[])];

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const weekAgo = new Date(today); weekAgo.setDate(weekAgo.getDate() - 6);

  const visibleAssignments = assignments.filter(a => {
    if (assignmentSubject && a.subject !== assignmentSubject) return false;
    if (assignmentDateFilter === "completed") return a.status === "completed";
    if (a.status !== "pending") return false;
    const d = new Date(a.assigned_date + "T00:00:00");
    if (assignmentDateFilter === "today") return d >= today;
    if (assignmentDateFilter === "week") return d >= weekAgo && d < today;
    if (assignmentDateFilter === "older") return d < weekAgo;
    return true;
  });

  const skillSubjects: string[] = grade <= 3
    ? ["matematika", "čeština", "prvouka"]
    : grade <= 5
    ? ["matematika", "čeština", "přírodověda", "vlastivěda"]
    : ["matematika", "čeština"];
  const visibleSkills = skillSubject
    ? stats.skills.filter(s => getTopicById(s.skillId)?.subject === skillSubject)
    : stats.skills;

  return (
    <div className="min-h-screen bg-[#fdf8f2] px-4 py-6 sm:px-8 sm:py-10">
      <div className="w-full max-w-5xl mx-auto space-y-5">

        {/* ── Greeting bar ── */}
        <div className="bg-white rounded-3xl px-6 py-5 flex flex-wrap items-center gap-4 shadow-sm border border-black/[0.05]">
          <div className="h-14 w-14 flex items-center justify-center shrink-0">
            <img src={logoNoText} alt="Oli" className="h-14 w-14 object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-2xl text-foreground leading-tight">
              Ahoj, {childName ? toGreeting(childName) : "kamaráde"}!
            </h1>
            <p className="text-base text-muted-foreground mt-0.5">
              {showStats
                ? motivationalMessage(stats.daysActive, stats.tasks, stats.accuracy, childName)
                : "Pojď si procvičit. Vyber, co tě baví."}
            </p>
          </div>
          {showStats && (
            <div className="flex gap-3 flex-wrap">
              <StatPill emoji="🔥" main={pluralDays(stats.daysActive)} sub="v řadě" cls="bg-orange-100 text-orange-800" tooltip={`Procvičuješ ${pluralDays(stats.daysActive)} za sebou bez přerušení. Jen tak dál!`} />
              <StatPill emoji="✅" main={String(stats.tasks)} sub={pluralTasks(stats.tasks)} cls="bg-emerald-100 text-emerald-800" tooltip={`Tento týden jsi splnil${stats.tasks === 1 ? "a" : ""} ${stats.tasks} ${pluralTasks(stats.tasks)}.`} />
              <StatPill emoji="⭐" main={`${stats.accuracy} %`} sub="úspěšnost" cls="bg-violet-100 text-violet-800" tooltip={`Z každých 100 odpovědí máš ${stats.accuracy} správně.`} />
            </div>
          )}
        </div>

        {/* ── Pairing code ── */}
        {!isPaired && (
          <PairingCodeInput onPaired={(name, g) => { setChildName(name); setIsPaired(true); }} />
        )}


        {/* ── Hero: Procvičovat samostatně ── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500 via-purple-500 to-pink-400 px-8 py-8 flex flex-col sm:flex-row items-center gap-6 text-white">
          <span className="absolute top-4 right-16 text-white/25 text-2xl pointer-events-none select-none">✦</span>
          <span className="absolute top-10 right-6 text-white/20 text-lg pointer-events-none select-none">+</span>
          <span className="absolute bottom-4 left-1/3 text-white/15 text-sm pointer-events-none select-none">✦</span>
          <span className="absolute bottom-8 right-20 text-white/15 text-base pointer-events-none select-none">✦</span>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold tracking-[0.15em] text-white/60 flex items-center gap-1.5 mb-3">
              <span>✦</span> HLAVNÍ AKCE
            </p>
            <h2 className="font-display text-3xl font-extrabold leading-tight mb-2">Procvičovat samostatně</h2>
            <p className="text-white/80 text-sm leading-relaxed mb-4">
              Vyber si předmět a téma — Oli ti připraví cvičení na míru.
            </p>
            <div className="flex flex-wrap gap-2">
              {["matematika", "čeština", "prvouka"].map((subj) => {
                const meta = getSubjectMeta(subj);
                return (
                  <button key={subj} onClick={onBrowseTopics}
                    className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white/90 transition-colors shadow-sm">
                    <IllustrationImg src={meta.image} className="h-6 w-6 object-contain" fallback={<span className="text-sm">{meta.emoji}</span>} />
                    {meta.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="shrink-0 w-full sm:w-52">
            <button onClick={onBrowseTopics}
              className="w-full h-12 rounded-2xl bg-white font-bold text-violet-700 hover:bg-white/95 active:scale-[0.98] transition-all flex items-center justify-between px-4 text-sm shadow-md">
              Začít procvičovat <ArrowRight className="h-4 w-4 shrink-0" />
            </button>
          </div>
        </div>

        {/* ── Úkoly od rodiče ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-black/[0.05] overflow-hidden">
          <div className="px-5 py-4 border-b border-border/40 flex items-center gap-2.5">
            <span className="text-rose-500">❤️</span>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-foreground text-base">Úkoly od rodiče</h2>
              <p className="text-xs text-muted-foreground leading-tight">Tady jsou cvičení, která ti zadali doma. Snaž se je splnit do termínu!</p>
            </div>
            {assignments.length > 0 && (
              <span className="rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-1 leading-none shrink-0">
                {assignments.length}&nbsp;nové
              </span>
            )}
          </div>
          {/* Filtr podle data zadání */}
          <div className="px-5 pt-3 pb-1">
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-0.5 gap-0.5">
              {(["all", "today", "week", "older", "completed"] as const).map(f => {
                const labels = { all: "Vše", today: "Dnes", week: "Tento týden", older: "Starší", completed: "Splněné" };
                return (
                  <button key={f} onClick={() => setAssignmentDateFilter(f)}
                    className={`h-7 px-3 rounded-lg text-xs font-medium transition-all ${assignmentDateFilter === f ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                    {labels[f]}
                  </button>
                );
              })}
            </div>
          </div>

          {assignmentSubjects.length > 1 && (
            <div className="px-5 pt-2 pb-1 flex flex-wrap gap-1.5">
              <button onClick={() => setAssignmentSubject(null)}
                className={`h-7 px-3 rounded-xl text-xs font-medium border transition-all ${assignmentSubject === null ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"}`}
              >Vše</button>
              {assignmentSubjects.map(subj => {
                const meta = getSubjectMeta(subj);
                return (
                  <button key={subj} onClick={() => setAssignmentSubject(assignmentSubject === subj ? null : subj)}
                    className={`h-7 pl-1.5 pr-3 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${assignmentSubject === subj ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"}`}
                  >
                    <span className="h-5 w-5 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                      <IllustrationImg src={meta?.image ?? ""} className="h-4 w-4 object-contain" fallback={<span className="text-[11px]">{meta?.emoji ?? "📚"}</span>} />
                    </span>
                    {meta?.label ?? subj}
                  </button>
                );
              })}
            </div>
          )}
          <div className="p-4 space-y-3">
            {assignments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Žádné úkoly 🎉</p>
            ) : visibleAssignments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                {assignmentDateFilter !== "all" ? "Pro tento časový rozsah žádné úkoly." : "Žádné úkoly pro tento předmět."}
              </p>
            ) : visibleAssignments.map((a) => {
              const isOverdue = a.due_date && new Date(a.due_date + "T00:00:00") < new Date();
              const assignedFormatted = formatDate(a.assigned_date.slice(0, 10));
              const subjMeta = a.subject ? getSubjectMeta(a.subject) : null;
              const breadcrumb = [
                subjMeta?.label,
                a.topic?.category,
                (a.topic as any)?.topic && (a.topic as any).topic !== a.skillName ? (a.topic as any).topic : null,
              ].filter(Boolean).join(" · ");
              return (
                <div key={a.id} className="rounded-2xl border border-border/40 bg-slate-50/60 p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <SkillHeader subjMeta={subjMeta} breadcrumb={breadcrumb} skillName={a.skillName} />
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3 shrink-0" /> Zadáno {assignedFormatted}
                      </span>
                      {a.due_date && (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${isOverdue ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>
                          do {formatDueDate(a.due_date)}
                        </span>
                      )}
                      {a.note && <span className="text-xs text-muted-foreground italic truncate">„{a.note}"</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartAssignment(a)}
                    disabled={!a.topic}
                    className="shrink-0 h-10 rounded-xl bg-primary hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 text-primary-foreground font-bold px-4 flex items-center gap-1.5 text-sm transition-all"
                  >
                    Začít <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Co jsi procvičoval ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-black/[0.05] overflow-hidden">
          <div className="px-5 py-4 border-b border-border/40 flex items-center gap-2.5">
            <span className="text-purple-500">📊</span>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-foreground text-base">Co jsi procvičoval</h2>
              <p className="text-xs text-muted-foreground leading-tight">Podívej se, jak ti to šlo v poslední době.</p>
            </div>
          </div>
          <div className="px-5 pt-3 pb-1">
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-0.5 gap-0.5">
              {PERIOD_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setStatsPeriod(opt.value)}
                  className={`h-7 px-3 rounded-lg text-xs font-medium transition-all ${statsPeriod === opt.value ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >{opt.label}</button>
              ))}
            </div>
          </div>
          {skillSubjects.length > 0 && (
            <div className="px-5 pt-2 pb-1 flex flex-wrap gap-1.5">
              <button
                onClick={() => setSkillSubject(null)}
                className={`h-7 px-3 rounded-xl text-xs font-medium border transition-all ${skillSubject === null ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"}`}
              >Vše</button>
              {skillSubjects.map(subj => {
                const meta = getSubjectMeta(subj);
                return (
                  <button key={subj}
                    onClick={() => setSkillSubject(skillSubject === subj ? null : subj)}
                    className={`h-7 pl-1.5 pr-3 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${skillSubject === subj ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"}`}
                  >
                    <span className="h-5 w-5 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                      <IllustrationImg src={meta?.image ?? ""} className="h-4 w-4 object-contain" fallback={<span className="text-[11px]">{meta?.emoji ?? "📚"}</span>} />
                    </span>
                    {meta?.label ?? subj}
                  </button>
                );
              })}
            </div>
          )}
          <div className="p-4 space-y-2">
            {stats.loading ? null : stats.skills.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Ještě nic — pojď začít! 🚀</p>
            ) : visibleSkills.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Žádné výsledky pro tento předmět.</p>
            ) : visibleSkills.map((s) => {
              const correct = s.correct ?? 0;
              const wrong = s.attempts - correct;
              const sAcc = s.attempts > 0 ? Math.round((correct / s.attempts) * 100) : 0;
              let barColor = "bg-emerald-500";
              let badgeText = "skvěle";
              let badgeCls = "bg-emerald-100 text-emerald-700";
              if (s.attempts < 2) { barColor = "bg-slate-300"; badgeText = "začínáš"; badgeCls = "bg-slate-100 text-slate-600"; }
              else if (sAcc < 50) { barColor = "bg-amber-500"; badgeText = "trénovat"; badgeCls = "bg-amber-100 text-amber-700"; }
              else if (sAcc < 80) { barColor = "bg-sky-500"; badgeText = "dobře"; badgeCls = "bg-sky-100 text-sky-700"; }
              const topic = getTopicById(s.skillId);
              const subjMeta = topic ? getSubjectMeta(topic.subject) : null;
              const breadcrumb = [
                subjMeta?.label,
                topic?.category,
                topic?.topic && topic.topic !== getReadableSkillName(s.skillId) ? topic.topic : null,
              ].filter(Boolean).join(" · ");
              return (
                <div key={s.skillId} className="rounded-2xl border border-border/40 bg-slate-50/60 p-4 space-y-2">
                  <div className="flex items-start gap-3">
                    <SkillHeader subjMeta={subjMeta} breadcrumb={breadcrumb} skillName={getReadableSkillName(s.skillId)} />
                    <span className={`text-[10px] font-bold rounded-full px-2.5 py-1 shrink-0 ml-auto ${badgeCls}`}>{badgeText}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${sAcc}%` }} />
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-emerald-600 font-semibold">✓ {correct} správně</span>
                    {wrong > 0 && <span className="text-rose-500 font-semibold">✗ {wrong} špatně</span>}
                    <span className="text-muted-foreground ml-auto">{sAcc} %</span>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-xs font-medium ${sAcc >= 80 ? "text-emerald-600" : sAcc >= 50 ? "text-sky-600" : s.attempts < 2 ? "text-slate-500" : "text-amber-600"}`}>
                      {skillEvaluation(sAcc, s.attempts, s.skillId.charCodeAt(0) + s.skillId.length)}
                    </p>
                    {s.lastPracticed && (
                      <span className="text-[10px] text-muted-foreground shrink-0 whitespace-nowrap">
                        Naposledy: {formatLastPracticed(s.lastPracticed)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Tip dne ── */}
        <div className="bg-white rounded-3xl px-6 py-5 flex items-center gap-4 shadow-sm border border-black/[0.05]">
          <div className="h-12 w-12 flex items-center justify-center shrink-0">
            <img src={logoNoText} alt="Oli" className="h-12 w-12 object-contain" />
          </div>
          <div>
            <p className="text-xs font-bold text-orange-500 mb-1">Tip dne</p>
            <p className="font-semibold text-base text-foreground">{TIPS[new Date().getDate() % TIPS.length]}</p>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatLastPracticed(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "dnes";
  if (d.toDateString() === yesterday.toDateString()) return "včera";
  return `${d.getDate()}. ${d.getMonth() + 1}.`;
}

const EVAL_HIGH = [
  (acc: number) => `Fantastických ${acc} %! Tuhle látku máš v malíku.`,
  (acc: number) => `Výborně, ${acc} % správně! Zkus se pustit do dalšího tématu.`,
  (_: number) => `Skvělý výsledek! Udržuj toto tempo a půjde ti to ještě lépe.`,
  (acc: number) => `${acc} % — to je pecka! Gratuluju.`,
];
const EVAL_MID = [
  (acc: number) => `${acc} % — dobrý základ! Zopakuj si chyby a bude ještě lépe.`,
  (_: number) => `Jde ti to! Zaměř se na místa, kde děláš chyby, a výsledek poroste.`,
  (acc: number) => `Solidní výkon (${acc} %). Trochu více procvičování a přeskočíš na skvělé.`,
  (_: number) => `Dobrá práce — každý trénink tě posouvá o kousek dál.`,
];
const EVAL_LOW = [
  (_: number) => `Nevzdávej to — opakování je základ. Každý chybuje, důležité je pokračovat.`,
  (acc: number) => `${acc} % zatím, ale to se změní. Zkus to znovu, chyby jsou nejlepší učitel.`,
  (_: number) => `Tohle téma chce více procvičení — ty to ale zvládneš!`,
  (_: number) => `Neboj se chybovat, tak se to naučíš. Jen nevzdávej to!`,
];
const EVAL_START = [
  "Teprve začínáš — odvahu, tohle se naučit dá!",
  "První kroky jsou nejtěžší. Zkus to ještě jednou!",
  "Nový začátek! Pokračuj a uvidíš, jak rychle to půjde.",
  "Vítej u nového tématu — zkus první kolo a uvidíme, jak na tom jsi.",
];

function skillEvaluation(acc: number, attempts: number, seed: number): string {
  if (attempts < 2) return EVAL_START[seed % EVAL_START.length];
  const pool = acc >= 80 ? EVAL_HIGH : acc >= 50 ? EVAL_MID : EVAL_LOW;
  return pool[seed % pool.length](acc);
}

const PERIOD_OPTIONS: { value: StatsPeriod; label: string }[] = [
  { value: "today", label: "Dnes" },
  { value: "7d",    label: "Posledních 7 dní" },
  { value: "30d",   label: "Poslední měsíc" },
  { value: "all",   label: "Od začátku" },
];

function PeriodSelect({ value, onChange }: { value: StatsPeriod; onChange: (v: StatsPeriod) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const label = PERIOD_OPTIONS.find(o => o.value === value)?.label ?? "";

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium hover:text-foreground transition-colors"
      >
        {label}
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1.5 z-50 min-w-[150px] rounded-xl border border-border/50 bg-white shadow-lg py-1 overflow-hidden">
          {PERIOD_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-3.5 py-2 text-xs transition-colors ${
                opt.value === value
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-foreground hover:bg-slate-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SkillHeader({ subjMeta, breadcrumb, skillName }: {
  subjMeta: ReturnType<typeof getSubjectMeta> | null;
  breadcrumb: string;
  skillName: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="shrink-0 h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center">
        {subjMeta
          ? <IllustrationImg src={subjMeta.image} className="h-7 w-7 object-contain" fallback={<span className="text-base">{subjMeta.emoji}</span>} />
          : <span className="text-base">📋</span>}
      </div>
      <div className="flex-1 min-w-0">
        {breadcrumb && (
          <p className="text-[10px] text-muted-foreground leading-tight mb-0.5 truncate">{breadcrumb}</p>
        )}
        <p className="font-bold text-sm text-foreground leading-snug">{skillName}</p>
      </div>
    </div>
  );
}

function pluralDays(n: number) {
  if (n === 1) return "1 den";
  if (n >= 2 && n <= 4) return `${n} dny`;
  return `${n} dní`;
}

function pluralTasks(n: number) {
  if (n === 1) return "úlohu";
  if (n >= 2 && n <= 4) return "úlohy";
  return "úloh";
}

function StatPill({ emoji, main, sub, cls, tooltip }: { emoji: string; main: string; sub: string; cls: string; tooltip?: string }) {
  return (
    <div title={tooltip} className={`rounded-2xl px-4 py-2.5 flex items-center gap-2.5 cursor-help ${cls}`}>
      <span className="text-lg leading-none">{emoji}</span>
      <div>
        <p className="font-extrabold text-base leading-tight tabular-nums">{main}</p>
        <p className="text-xs opacity-70 leading-tight">{sub}</p>
      </div>
    </div>
  );
}
