import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useChildren, type Child } from "@/hooks/useChildren";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { LogOut, Plus, RefreshCw, Clock, Pencil, Check, X, Trash2, CheckCircle2, HelpCircle, XCircle, Eye, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { useT } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import type { Grade } from "@/lib/types";
import { ChildActivityBadge } from "@/components/ChildActivityBadge";
import { ChildMisconceptions } from "@/components/ChildMisconceptions";
import { AssignmentCreator } from "@/components/AssignmentCreator";
import { AssignmentList } from "@/components/AssignmentList";
import { ChildSessionLog, type SessionEntry } from "@/components/ChildSessionLog";
import { DewhiteImg } from "@/components/DewhiteImg";
import { logoNoText } from "@/components/OlyLogo";
import { LandingNav } from "@/pages/LandingNav";

const GRADES: Grade[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];


function pluralDays(n: number) {
  if (n === 1) return "1 den";
  if (n >= 2 && n <= 4) return `${n} dny`;
  return `${n} dní`;
}


function localDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function makeDemoStaticAssignments() {
  const ago = (n: number) => { const d = new Date(); d.setDate(d.getDate() - n); return localDateStr(d); };
  return [
    // Statická pending — vše v rozsahu tohoto týdne (1–5 dní zpět), střídání předmětů
    { id: "da1", skill_id: "math-multiply",          assigned_date: ago(1),  due_date: null as null, status: "pending", note: null as null },
    { id: "da2", skill_id: "cz-vyjmenovana-slova-b", assigned_date: ago(3),  due_date: null as null, status: "pending", note: null as null },
    { id: "da3", skill_id: "pr-plant-parts",         assigned_date: ago(5),  due_date: null as null, status: "pending", note: null as null },
    // Statická splněná — pro filtr Splněné (3 ks, střídání předmětů)
    { id: "da4", skill_id: "math-add-sub-100", assigned_date: ago(12), due_date: null as null, status: "completed", note: null as null, completedDate: ago(10) + "T15:00:00", completionCorrect: 6, completionHelpUsed: 1, completionTotal: 8 },
    { id: "da5", skill_id: "cz-slovni-druhy",  assigned_date: ago(18), due_date: null as null, status: "completed", note: null as null, completedDate: ago(16) + "T14:30:00", completionCorrect: 7, completionHelpUsed: 0, completionTotal: 9 },
    { id: "da6", skill_id: "pr-animals",       assigned_date: ago(22), due_date: null as null, status: "completed", note: null as null, completedDate: ago(20) + "T16:00:00", completionCorrect: 5, completionHelpUsed: 2, completionTotal: 8 },
  ];
}

/** Generuje nebo načte hash IP adresy z localStorage pro demo izolaci */
async function getOrCreateDemoHash(): Promise<string> {
  const stored = localStorage.getItem("oli_demo_hash");
  if (stored) return stored;
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const { ip } = await res.json() as { ip: string };
    // Jednoduchý hash — převede IP na krátký alfanumerický řetězec
    let h = 0;
    for (let i = 0; i < ip.length; i++) { h = (Math.imul(31, h) + ip.charCodeAt(i)) | 0; }
    const hash = Math.abs(h).toString(36).padStart(6, "0").slice(0, 8);
    localStorage.setItem("oli_demo_hash", hash);
    return hash;
  } catch {
    // Fallback — náhodný hash pokud selže fetch
    const fallback = Math.random().toString(36).slice(2, 10);
    localStorage.setItem("oli_demo_hash", fallback);
    return fallback;
  }
}

function makeDemoSessions(): SessionEntry[] {
  const dt = (daysAgo: number, hour: number, min: number) => {
    const d = new Date(); d.setDate(d.getDate() - daysAgo); d.setHours(hour, min, 0, 0); return d.toISOString();
  };
  return [
    // Výborný (≥ 90 %)
    { session_id: "ds1",  date: dt(2,  14, 30), skill_id: "math-multiply",          total: 10, correct: 9,  help_used: 0 },
    { session_id: "ds2",  date: dt(4,  16,  0), skill_id: "cz-vyjmenovana-slova-b", total: 10, correct: 10, help_used: 0 },
    { session_id: "ds3",  date: dt(6,  15, 15), skill_id: "pr-plant-parts",         total: 10, correct: 9,  help_used: 0 },
    // Chvalitebný (75–89 %)
    { session_id: "ds4",  date: dt(8,  14, 45), skill_id: "math-add-sub-100",       total: 10, correct: 8,  help_used: 1 },
    { session_id: "ds5",  date: dt(10, 16, 30), skill_id: "cz-slovni-druhy",        total: 9,  correct: 7,  help_used: 1 },
    { session_id: "ds6",  date: dt(12, 15,  0), skill_id: "pr-animals",             total: 8,  correct: 6,  help_used: 1 },
    // Dobrý (55–74 %)
    { session_id: "ds7",  date: dt(14, 14,  0), skill_id: "math-multiply",          total: 10, correct: 6,  help_used: 1 },
    { session_id: "ds8",  date: dt(16, 16, 15), skill_id: "cz-tvrde-mekke",         total: 9,  correct: 5,  help_used: 2 },
    { session_id: "ds9",  date: dt(18, 15, 45), skill_id: "pr-plant-parts",         total: 9,  correct: 5,  help_used: 1 },
    // Dostatečný (40–54 %)
    { session_id: "ds10", date: dt(20, 14, 15), skill_id: "math-add-sub-100",       total: 10, correct: 4,  help_used: 2 },
    { session_id: "ds11", date: dt(21, 16,  0), skill_id: "cz-vyjmenovana-slova-l", total: 9,  correct: 4,  help_used: 1 },
    { session_id: "ds12", date: dt(22, 15, 30), skill_id: "pr-animals",             total: 10, correct: 4,  help_used: 1 },
    // Nedostatečný (< 40 %)
    { session_id: "ds13", date: dt(23, 14, 30), skill_id: "math-multiply",          total: 10, correct: 3,  help_used: 1 },
    { session_id: "ds14", date: dt(24, 16, 45), skill_id: "cz-slovni-druhy",        total: 8,  correct: 2,  help_used: 2 },
    { session_id: "ds15", date: dt(25, 15,  0), skill_id: "pr-plant-parts",         total: 9,  correct: 1,  help_used: 3 },
  ];
}

const DEMO_SESSIONS = makeDemoSessions();

export default function ParentDashboard() {
  const { children, loading, addChild, regenerateCode, updateChild, deleteChild } = useChildren();
  const { profile } = useProfile();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newGrade, setNewGrade] = useState<Grade>(3);
  const [newNotes, setNewNotes] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editGrade, setEditGrade] = useState<Grade>(3);
  const [editNotes, setEditNotes] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [assignmentRefresh, setAssignmentRefresh] = useState(0);
  const [newAssignment, setNewAssignment] = useState<{ childId: string; skillId: string } | null>(null);
  const [demoStaticAssignments] = useState(() => makeDemoStaticAssignments());
  const [demoPendingAssignments, setDemoPendingAssignments] = useState<Array<{
    id: string; skill_id: string; assigned_date: string; due_date: null; status: "pending"; note: null;
  }>>([]);
  const [demoIpHash, setDemoIpHash] = useState<string | null>(null);
  // Deep-link prefill — z URL hash #assign-<skillCode> (např. z reportu)
  const [prefillSkillCode, setPrefillSkillCode] = useState<string | null>(null);
  const [prefillForChildId, setPrefillForChildId] = useState<string | null>(null);
  const navigate = useNavigate();
  const t = useT();
  const { toast } = useToast();
  const { role } = useUserRole();

  // Detekce demo účtu
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUserEmail(user?.email ?? null));
  }, []);

  // Demo: načti/vytvoř IP hash a natáhni reálné pending úkoly pro tuto IP
  useEffect(() => {
    if (userEmail !== "demo@oli.app") return;
    getOrCreateDemoHash().then(hash => {
      setDemoIpHash(hash);
      const prefix = `__demo:${hash}`;
      // Načti reálné pending úkoly z DB (filtrované podle IP prefixu v note)
      supabase
        .from("parent_assignments")
        .select("id, skill_id, assigned_date, due_date, status, note")
        .eq("status", "pending")
        .like("note", `${prefix}%`)
        .order("assigned_date", { ascending: false })
        .then(({ data }) => {
          if (data && data.length > 0) {
            setDemoPendingAssignments(
              data.map(r => ({
                id: r.id,
                skill_id: r.skill_id as string,
                assigned_date: r.assigned_date as string,
                due_date: r.due_date as null,
                status: "pending" as const,
                note: null as null,
              }))
            );
          }
        });
    });
  }, [userEmail]);

  // Read URL hash on mount + při změně URL — #assign-<skillCode> nebo #assign-<childId>:<skillCode>
  useEffect(() => {
    const parseHash = () => {
      const hash = window.location.hash;
      const match = hash.match(/^#assign-(.+)$/);
      if (!match) return;
      const value = decodeURIComponent(match[1]);
      // Format může být "skillCode" nebo "childId:skillCode"
      if (value.includes(":")) {
        const [cid, skill] = value.split(":");
        setPrefillForChildId(cid);
        setPrefillSkillCode(skill);
      } else {
        setPrefillSkillCode(value);
      }
    };
    parseHash();
    window.addEventListener("hashchange", parseHash);
    return () => window.removeEventListener("hashchange", parseHash);
  }, []);

  const consumePrefill = () => {
    setPrefillSkillCode(null);
    setPrefillForChildId(null);
    // Vyčistit hash z URL bez reloadu
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  };

  const startEdit = (child: Child) => {
    setEditingId(child.id);
    setEditName(child.child_name);
    setEditGrade(child.grade as Grade);
    setEditNotes(child.learning_notes ?? "");
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editName.trim()) return;
    setEditLoading(true);
    try {
      await updateChild(editingId, { child_name: editName.trim(), grade: editGrade, learning_notes: editNotes.trim() || null });
      setEditingId(null);
      toast({ description: t("parent.toast_child_updated") });
    } catch {
      toast({ description: t("parent.toast_error"), variant: "destructive" });
    }
    setEditLoading(false);
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setAddLoading(true);
    try {
      await addChild(newName.trim(), newGrade, newNotes.trim());
      setNewName("");
      setNewNotes("");
      setShowAdd(false);
      toast({ description: t("parent.toast_child_added") });
    } catch {
      toast({ description: t("parent.toast_error"), variant: "destructive" });
    }
    setAddLoading(false);
  };

  const isExpired = (c: Child) => !c.is_paired && new Date(c.pairing_code_expires_at) < new Date();

  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  const avatarColors = [
    "bg-gradient-to-br from-violet-500 to-violet-700",
    "bg-gradient-to-br from-emerald-500 to-emerald-700",
    "bg-gradient-to-br from-rose-500 to-rose-700",
    "bg-gradient-to-br from-amber-500 to-amber-700",
    "bg-gradient-to-br from-sky-500 to-sky-700",
  ];

  const isDemo = userEmail === "demo@oli.app"; // demo detection v2
  const DEMO_STATS = { tasks: 31, days: 6, accuracy: 72, assignedTasks: 18, selfTasks: 13 };
  // Sloučení reálných pending úkolů + statických splněných pro demo
  // Reálné pending z DB (tato IP) + statická pending + statická splněná
  const demoAssignments = [...demoPendingAssignments, ...demoStaticAssignments];

  return (
    <div className="min-h-screen bg-[#fdf8f2]" style={role === "admin" ? { paddingTop: "2.5rem" } : isDemo ? { paddingTop: "7rem" } : undefined}>
      {role === "admin" && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur text-primary-foreground px-5 py-2.5 flex items-center justify-between text-sm shadow-soft-2">
          <span className="font-medium inline-flex items-center gap-2"><Eye className="h-3.5 w-3.5" />Náhled rodičovského pohledu</span>
          <Button variant="secondary" size="sm" className="h-7 text-xs rounded-full bg-white/15 hover:bg-white/25 text-primary-foreground border border-white/20" onClick={() => navigate("/admin")}>← Zpět do Adminu</Button>
        </div>
      )}
      {isDemo && role !== "admin" && (
        <div className="fixed top-0 left-0 right-0 z-50 shadow-soft-2">
          <div className="bg-[#F97316] text-white px-5 py-2 text-sm text-center font-medium">
            Demo — prohlídka bez registrace
          </div>
          <LandingNav />
        </div>
      )}

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-8 sm:py-10 space-y-5">

        {/* ── Demo switcher ── */}
        {isDemo && role !== "admin" && (
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-3xl border-2 border-blue-300 bg-blue-50/80 p-6 flex items-center gap-4">
              <DewhiteImg
                src="https://uusaczibimqvaazpaopy.supabase.co/storage/v1/object/public/prvouka-images/topic-rodina-a-spolecnost.png"
                alt=""
                className="h-16 w-16 object-contain drop-shadow-md shrink-0"
                threshold={240}
              />
              <div>
                <p className="font-bold text-lg text-blue-900">Jsem rodič</p>
                <p className="text-xs text-blue-600 mt-0.5">Aktuální pohled</p>
              </div>
            </div>
            <button
              className="rounded-3xl border-2 border-orange-200 bg-orange-50/60 hover:border-orange-400 hover:bg-orange-50 hover:shadow-lg p-6 flex items-center gap-4 text-left transition-all active:scale-[0.98]"
              onClick={async () => {
                await supabase.auth.signInWithPassword({ email: "demo-child@oli.app", password: "Demo123demo" });
                window.location.href = "/";
              }}
            >
              <DewhiteImg
                src="https://uusaczibimqvaazpaopy.supabase.co/storage/v1/object/public/prvouka-images/ui-child-desk.png"
                alt=""
                className="h-16 w-16 object-contain drop-shadow-md shrink-0"
                threshold={240}
              />
              <div className="flex-1">
                <p className="font-bold text-lg text-orange-900">Jsem žák</p>
                <p className="text-xs text-orange-600 mt-0.5">Přepnout na žákovský pohled →</p>
              </div>
            </button>
          </div>
        )}

        {/* ── Greeting bar ── */}
        <div className="bg-white rounded-3xl px-6 py-5 flex flex-wrap items-center gap-4 shadow-sm border border-black/[0.05]">
          <img src={logoNoText} alt="Oli" className="h-14 w-14 object-contain shrink-0" />
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-2xl text-foreground leading-tight">
              {t("parent.greeting")}
            </h1>
            <p className="text-base text-muted-foreground mt-0.5">Zde vidíte přehled procvičování vašeho dítěte — co zadáváte, jak mu to jde a na které chyby se vyplatí zaměřit.</p>
          </div>
          {!isDemo && (
            <>
              <Button variant="outline" size="sm" className="gap-1.5 rounded-full hidden sm:inline-flex" onClick={() => supabase.auth.signOut()}>
                <LogOut className="h-3.5 w-3.5" />{t("parent.sign_out")}
              </Button>
              <Button variant="ghost" size="icon" className="sm:hidden rounded-full" onClick={() => supabase.auth.signOut()}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {loading && <p className="text-muted-foreground text-center py-8">{t("loading")}</p>}

        {/* ── Karta pro každé dítě — 3 sloupce ── */}
        {children.map((child, idx) => (
          <div key={child.id} className="flex flex-col gap-5">


            {/* Jednosloupcový layout */}
            {child.is_paired ? (
              <>
              {/* Hero karta — horizontální, full width */}
              <div className="rounded-3xl overflow-hidden shadow-sm border border-violet-200">
                {/* Gradient hlavička — jméno + hvězdičky */}
                <div className="relative overflow-hidden bg-gradient-to-br from-violet-500 via-purple-500 to-pink-400 px-8 pt-8 pb-6 text-white">
                  <span className="absolute top-4 right-20 text-white text-3xl pointer-events-none select-none" style={{ animation: 'oli-star-1 18s ease-in-out infinite' }}>✦</span>
                  <span className="absolute top-6 right-7  text-white text-xl pointer-events-none select-none" style={{ animation: 'oli-star-2 22s ease-in-out infinite', animationDelay: '-7s' }}>+</span>
                  <span className="absolute bottom-3 right-12 text-white text-lg pointer-events-none select-none" style={{ animation: 'oli-star-3 15s ease-in-out infinite', animationDelay: '-3s' }}>✦</span>
                  <span className="absolute top-3 left-1/3  text-white text-sm pointer-events-none select-none" style={{ animation: 'oli-star-1 25s ease-in-out infinite', animationDelay: '-14s' }}>✦</span>

                  {/* Edit/delete — pravý horní roh */}
                  {!isDemo && (
                    <div className="absolute top-3 right-3 flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-white/60 hover:text-white hover:bg-white/20" onClick={() => startEdit(child)}><Pencil className="h-3 w-3" /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-white/60 hover:text-white hover:bg-white/20"><Trash2 className="h-3 w-3" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t("parent.delete_confirm_title")}</AlertDialogTitle>
                            <AlertDialogDescription>{t("parent.delete_confirm_description").replace("{name}", child.child_name)}</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t("parent.delete_confirm_no")}</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={async () => {
                              try { await deleteChild(child.id); toast({ description: t("parent.toast_child_deleted") }); }
                              catch { toast({ description: t("parent.toast_error"), variant: "destructive" }); }
                            }}>{t("parent.delete_confirm_yes")}</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}

                  <p className="text-[11px] font-bold tracking-[0.15em] text-white/60 mb-1">✦ PŘEHLED DÍTĚTE</p>
                  {editingId === child.id ? (
                    <>
                      <input
                        autoFocus
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleSaveEdit(); if (e.key === "Escape") setEditingId(null); }}
                        className="font-bold text-3xl leading-tight text-white bg-white/20 border border-white/40 rounded-xl px-3 py-1 w-full max-w-xs outline-none placeholder:text-white/40 mb-2"
                      />
                      <div className="flex items-center gap-2 mb-5">
                        <Select value={String(editGrade)} onValueChange={(v) => setEditGrade(Number(v) as Grade)}>
                          <SelectTrigger className="h-8 w-28 bg-white/20 border-white/30 text-white [&>svg]:text-white hover:bg-white/30 focus:ring-white/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>{GRADES.map((g) => <SelectItem key={g} value={String(g)}>{g}. třída</SelectItem>)}</SelectContent>
                        </Select>
                        <button
                          onClick={handleSaveEdit}
                          disabled={editLoading || !editName.trim()}
                          className="flex items-center gap-1 rounded-full bg-white/20 hover:bg-white/30 border border-white/40 px-3 py-1 text-xs font-semibold text-white transition-colors disabled:opacity-50"
                        >
                          <Check className="h-3 w-3" /> Uložit
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex items-center gap-1 rounded-full hover:bg-white/20 border border-white/30 px-3 py-1 text-xs font-semibold text-white/70 hover:text-white transition-colors"
                        >
                          <X className="h-3 w-3" /> Zrušit
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="font-bold text-3xl leading-tight text-white">{child.child_name}</h2>
                      <div className="flex items-center gap-2 mt-1 mb-5">
                        <p className="text-white/70 text-sm">{child.grade}. ročník · aktivní</p>
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/20 border border-white/30 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                          <CheckCircle2 className="h-3 w-3" />{t("parent.paired")}
                        </span>
                      </div>
                    </>
                  )}

                  {/* Stats + tlačítko — bílá barva přes child selector */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                    <div className="[&_*]:!text-white [&_*]:!border-white/30 flex-1 min-w-0">
                      <ChildActivityBadge childId={child.id} mockStats={isDemo ? DEMO_STATS : undefined} compact />
                    </div>
                    {editingId !== child.id && (
                      <div className="shrink-0 w-full sm:w-auto">
                        <AssignmentCreator
                          childId={child.id}
                          childName={child.child_name}
                          onCreated={(skillId) => {
                            if (isDemo && demoIpHash) {
                              const todayStr = localDateStr(new Date());
                              setDemoPendingAssignments(prev => [
                                { id: `db-${Date.now()}`, skill_id: skillId, assigned_date: todayStr, due_date: null as null, status: "pending" as const, note: null as null },
                                ...prev,
                              ]);
                            }
                            setAssignmentRefresh(r => r + 1);
                            setNewAssignment({ childId: child.id, skillId });
                            setTimeout(() => setNewAssignment(null), 60000);
                          }}
                          prefillSkillCode={prefillSkillCode && (!prefillForChildId || prefillForChildId === child.id) ? prefillSkillCode : null}
                          onPrefillConsumed={consumePrefill}
                          demoNotePrefix={isDemo && demoIpHash ? `__demo:${demoIpHash}` : undefined}
                          buttonClassName="bg-white text-violet-700 hover:bg-white/90"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Zadané úkoly — full width */}
              <div className="bg-white rounded-3xl shadow-sm border border-black/[0.05] flex flex-col overflow-hidden">
                <div className="px-5 py-4 border-b border-border/40">
                  <div className="flex items-center gap-2.5">
                    <span className="text-rose-500">❤️</span>
                    <h2 className="font-bold text-base text-foreground">Zadané úkoly</h2>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Témata, která jste {child.child_name} zadali k procvičení.</p>
                </div>
                <div className="p-4 h-[460px]">
                  <AssignmentList
                    childId={child.id}
                    childName={child.child_name}
                    refreshKey={assignmentRefresh}
                    highlightSkillId={newAssignment?.childId === child.id ? newAssignment.skillId : null}
                    mockAssignments={isDemo ? demoAssignments : undefined}
                    onMockDelete={isDemo ? (id) => {
                      // Odstraň z lokálního stavu
                      setDemoPendingAssignments(prev => prev.filter(a => a.id !== id));
                      // Pokud je ID UUID (reálný DB záznam), smaž i z DB
                      const isRealDbId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
                      if (isRealDbId) {
                        supabase.from("parent_assignments").delete().eq("id", id);
                      }
                    } : undefined}
                  />
                </div>
              </div>

              {/* Samostatné procvičování — full width */}
              <div className="bg-white rounded-3xl shadow-sm border border-black/[0.05] flex flex-col overflow-hidden">
                <div className="px-5 py-4 border-b border-border/40">
                  <div className="flex items-center gap-2.5">
                    <span className="text-blue-500">🧩</span>
                    <h2 className="font-bold text-base text-foreground">Samostatné procvičování</h2>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Co {child.child_name} procvičoval/a sám/a, bez vašeho zadání.</p>
                </div>
                <div className="px-4 h-[460px]">
                  <ChildSessionLog
                    childId={child.id}
                    childName={child.child_name}
                    grade={child.grade}
                    mockSessions={isDemo ? DEMO_SESSIONS : undefined}
                  />
                </div>
              </div>

              {/* Na co se zaměřit — full width */}
              <div className="bg-white rounded-3xl shadow-sm border border-black/[0.05] flex flex-col overflow-hidden">
                <div className="px-5 py-4 border-b border-border/40 flex items-center gap-2.5">
                  <span className="text-violet-500">🎯</span>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-base text-foreground">Na co se zaměřit</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Opakující se chyby z posledních cvičení, na které stojí za to reagovat.</p>
                  </div>
                  <button
                    className="h-8 rounded-xl bg-muted border border-border text-foreground font-semibold flex items-center gap-1.5 px-3 hover:bg-muted/80 active:scale-[0.98] transition-all text-xs shrink-0"
                    onClick={() => navigate(`/report?child=${child.id}`)}
                  >
                    Podrobné hodnocení
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="p-4">
                  <ChildMisconceptions childId={child.id} childName={child.child_name} />
                </div>
              </div>
              </>
            ) : (
              /* Nepropojené dítě — jednoduchá karta */
              <div className="bg-white rounded-3xl shadow-sm border border-black/[0.05] p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold text-white shrink-0 ${avatarColors[idx % avatarColors.length]}`}>
                    {getInitial(editingId === child.id ? editName : child.child_name)}
                  </div>
                  {editingId === child.id ? (
                    <div className="flex items-center gap-2 flex-wrap flex-1">
                      <Input
                        autoFocus
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleSaveEdit(); if (e.key === "Escape") setEditingId(null); }}
                        className="h-8 w-36 font-bold text-base"
                      />
                      <Select value={String(editGrade)} onValueChange={(v) => setEditGrade(Number(v) as Grade)}>
                        <SelectTrigger className="h-8 w-24"><SelectValue /></SelectTrigger>
                        <SelectContent>{GRADES.map((g) => <SelectItem key={g} value={String(g)}>{g}. třída</SelectItem>)}</SelectContent>
                      </Select>
                      <Button size="sm" onClick={handleSaveEdit} disabled={editLoading || !editName.trim()} className="h-8 gap-1"><Check className="h-3 w-3" /> Uložit</Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} className="h-8"><X className="h-3 w-3" /></Button>
                    </div>
                  ) : (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-lg text-foreground">{child.child_name}</span>
                    <span className="text-sm text-muted-foreground">· {child.grade}. {t("parent.grade_label")}</span>
                    {isExpired(child)
                      ? <Badge className="bg-rose-50 text-rose-700 border-rose-200 gap-1 rounded-full text-xs"><Clock className="h-3 w-3" />{t("parent.code_expired")}</Badge>
                      : <Badge className="bg-amber-50 text-amber-700 border-amber-200 gap-1 rounded-full text-xs"><Clock className="h-3 w-3" />{t("parent.not_paired")}</Badge>}
                    {!isDemo && <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground" onClick={() => startEdit(child)}><Pencil className="h-3 w-3" /></Button>}
                    {!isDemo && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-rose-500 hover:bg-rose-50"><Trash2 className="h-3 w-3" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t("parent.delete_confirm_title")}</AlertDialogTitle>
                            <AlertDialogDescription>{t("parent.delete_confirm_description").replace("{name}", child.child_name)}</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t("parent.delete_confirm_no")}</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={async () => {
                              try { await deleteChild(child.id); toast({ description: t("parent.toast_child_deleted") }); }
                              catch { toast({ description: t("parent.toast_error"), variant: "destructive" }); }
                            }}>{t("parent.delete_confirm_yes")}</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                  )}
                </div>
                <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-5 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-700">{t("parent.pairing_code_label")}</p>
                  <div className="mt-3 flex items-center justify-center gap-3">
                    {child.pairing_code.split("").map((ch, i) => (
                      <span key={i} className="font-bold text-3xl text-primary tabular-nums">{ch}</span>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-amber-700/80">Zadej kód v aplikaci na zařízení dítěte. Kód platí 24 hodin.</p>
                  {isExpired(child) && (
                    <Button variant="outline" size="sm" className="mt-3 gap-1 rounded-full border-amber-300 hover:bg-amber-100 text-amber-800" onClick={() => regenerateCode(child.id)}>
                      <RefreshCw className="h-3 w-3" />{t("parent.regenerate_code")}
                    </Button>
                  )}
                </div>
                <div className="flex items-start gap-3 rounded-2xl bg-muted/40 p-4 border border-border">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary shrink-0"><HelpCircle className="h-4 w-4" /></span>
                  <div>
                    <p className="text-sm font-semibold">Jak propojit?</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Otevři Oly na tabletu nebo telefonu {child.child_name} a zadej kód výše.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* ── Přidat dítě ── */}
        {isDemo ? (
          showAdd ? (
            <div className="bg-blue-50 rounded-3xl border-2 border-blue-200 p-6 text-center space-y-3">
              <p className="text-2xl">👶</p>
              <p className="font-bold text-blue-900 text-lg">Po registraci přidáte vlastní dítě</p>
              <p className="text-sm text-blue-700 max-w-md mx-auto">
                Vyplníte jméno a ročník, Oli vygeneruje párovací kód — dítě ho zadá při prvním přihlášení a profily se propojí. Od té chvíle vidíte vše, co procvičuje.
              </p>
              <button onClick={() => setShowAdd(false)} className="text-xs text-blue-500 underline underline-offset-2 mt-1">Zavřít</button>
            </div>
          ) : (
            <button onClick={() => setShowAdd(true)} className="w-full rounded-3xl border-2 border-dashed border-border bg-white/60 hover:bg-white hover:border-primary/40 transition-all py-10 px-4 text-center group">
              <span className="grid h-12 w-12 mx-auto place-items-center rounded-2xl bg-primary/10 text-primary group-hover:scale-105 transition-transform"><Plus className="h-5 w-5" /></span>
              <p className="mt-3 font-bold text-foreground">{t("parent.add_child")}</p>
              <p className="mt-1 text-sm text-muted-foreground">Každé dítě má vlastní profil, kód a pokrok.</p>
            </button>
          )
        ) : showAdd ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-border shadow-sm p-6 space-y-4">
            <div className="space-y-2"><Label>{t("onboarding.step2.child_name")}</Label><Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Péťa" className="rounded-xl" /></div>
            <div className="space-y-2">
              <Label>{t("onboarding.step2.grade")}</Label>
              <Select value={String(newGrade)} onValueChange={(v) => setNewGrade(Number(v) as Grade)}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>{GRADES.map((g) => <SelectItem key={g} value={String(g)}>{g}. {t("parent.grade_label")}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Poznámky k učení</Label><Textarea value={newNotes} onChange={(e) => setNewNotes(e.target.value)} placeholder="Např. ADHD, dyslexie…" className="min-h-[60px] text-xs rounded-xl" /></div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} disabled={!newName.trim() || addLoading} className="flex-1 rounded-xl">{addLoading ? t("auth.loading") : t("parent.add_child")}</Button>
              <Button variant="outline" onClick={() => setShowAdd(false)} className="rounded-xl">{t("topic.back")}</Button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowAdd(true)} className="w-full rounded-3xl border-2 border-dashed border-border bg-white/60 hover:bg-white hover:border-primary/40 transition-all py-10 px-4 text-center group">
            <span className="grid h-12 w-12 mx-auto place-items-center rounded-2xl bg-primary/10 text-primary group-hover:scale-105 transition-transform"><Plus className="h-5 w-5" /></span>
            <p className="mt-3 font-bold text-foreground">{t("parent.add_child")}</p>
            <p className="mt-1 text-sm text-muted-foreground">Každé dítě má vlastní profil, kód a pokrok.</p>
          </button>
        )}

      </main>
    </div>
  );
}
