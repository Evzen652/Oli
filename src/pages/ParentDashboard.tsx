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
import { ChildSessionLog } from "@/components/ChildSessionLog";
import { DewhiteImg } from "@/components/DewhiteImg";
import { logoNoText } from "@/components/OlyLogo";
import { LandingNav } from "@/pages/LandingNav";

const GRADES: Grade[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];


function pluralDays(n: number) {
  if (n === 1) return "1 den";
  if (n >= 2 && n <= 4) return `${n} dny`;
  return `${n} dní`;
}


export default function ParentDashboard() {
  const { children, loading, addChild, regenerateCode, updateChild, deleteChild } = useChildren();
  const { profile } = useProfile();
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
  // Deep-link prefill — z URL hash #assign-<skillCode> (např. z reportu)
  const [prefillSkillCode, setPrefillSkillCode] = useState<string | null>(null);
  const [prefillForChildId, setPrefillForChildId] = useState<string | null>(null);
  const navigate = useNavigate();
  const t = useT();
  const { toast } = useToast();
  const { role } = useUserRole();

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

  const isDemo = profile?.user_id === "f0b2bf8b-39f1-4d12-a47b-46691d8472a9";

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

            {/* Edit formulář — zobrazí se jen při editaci */}
            {editingId === child.id && (
              <div className="bg-white rounded-2xl border border-border p-4 flex gap-2 items-center flex-wrap shadow-sm">
                <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-8 w-40" />
                <Select value={String(editGrade)} onValueChange={(v) => setEditGrade(Number(v) as Grade)}>
                  <SelectTrigger className="h-8 w-28"><SelectValue /></SelectTrigger>
                  <SelectContent>{GRADES.map((g) => <SelectItem key={g} value={String(g)}>{g}. třída</SelectItem>)}</SelectContent>
                </Select>
                <Button size="sm" onClick={handleSaveEdit} disabled={editLoading || !editName.trim()} className="gap-1 h-8"><Check className="h-3 w-3" /></Button>
                <Button size="sm" variant="outline" onClick={() => setEditingId(null)} className="h-8"><X className="h-3 w-3" /></Button>
              </div>
            )}

            {/* Jednosloupcový layout */}
            {child.is_paired ? (
              <>
              {/* Hero karta — horizontální, full width */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-50 via-white to-sky-50 border border-violet-100 shadow-sm px-8 py-10 flex flex-col sm:flex-row items-start gap-6">
                <span className="absolute top-4 right-16 text-primary/15 text-2xl pointer-events-none select-none">✦</span>
                <span className="absolute top-10 right-6 text-primary/10 text-lg pointer-events-none select-none">+</span>
                <span className="absolute bottom-4 left-1/3 text-primary/10 text-sm pointer-events-none select-none">✦</span>
                <span className="absolute bottom-8 right-20 text-primary/10 text-base pointer-events-none select-none">✦</span>
                <span className="absolute top-1/2 right-10 text-primary/10 text-xs pointer-events-none select-none">+</span>

                {/* Edit/delete tlačítka — pravý horní roh */}
                <div className="absolute top-3 right-3 flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted" onClick={() => startEdit(child)}><Pencil className="h-3 w-3" /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-muted-foreground hover:text-rose-600 hover:bg-rose-50"><Trash2 className="h-3 w-3" /></Button>
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

                {/* Jméno + stats */}
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold tracking-[0.15em] text-muted-foreground mb-1">✦ PŘEHLED DÍTĚTE</p>
                  <h2 className="font-bold text-3xl leading-tight text-foreground">{child.child_name}</h2>
                  <div className="flex items-center gap-2 mt-1 mb-5">
                    <p className="text-muted-foreground text-sm">{child.grade}. ročník · aktivní</p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                      <CheckCircle2 className="h-3 w-3" />{t("parent.paired")}
                    </span>
                  </div>
                  <ChildActivityBadge childId={child.id} compact />
                </div>

                {/* Akce */}
                {editingId !== child.id && (
                  <div className="flex flex-col gap-3 w-full sm:w-56 shrink-0 sm:self-end">
                    <AssignmentCreator
                      childId={child.id}
                      childName={child.child_name}
                      onCreated={(skillId) => {
                        setAssignmentRefresh(r => r + 1);
                        setNewAssignment({ childId: child.id, skillId });
                        setTimeout(() => setNewAssignment(null), 60000);
                      }}
                      prefillSkillCode={prefillSkillCode && (!prefillForChildId || prefillForChildId === child.id) ? prefillSkillCode : null}
                      onPrefillConsumed={consumePrefill}
                    />
                  </div>
                )}
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
                  <AssignmentList childId={child.id} refreshKey={assignmentRefresh} highlightSkillId={newAssignment?.childId === child.id ? newAssignment.skillId : null} />
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
                  <ChildSessionLog childId={child.id} grade={child.grade} />
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
                    {getInitial(child.child_name)}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-lg text-foreground">{child.child_name}</span>
                    <span className="text-sm text-muted-foreground">· {child.grade}. {t("parent.grade_label")}</span>
                    {isExpired(child)
                      ? <Badge className="bg-rose-50 text-rose-700 border-rose-200 gap-1 rounded-full text-xs"><Clock className="h-3 w-3" />{t("parent.code_expired")}</Badge>
                      : <Badge className="bg-amber-50 text-amber-700 border-amber-200 gap-1 rounded-full text-xs"><Clock className="h-3 w-3" />{t("parent.not_paired")}</Badge>}
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground" onClick={() => startEdit(child)}><Pencil className="h-3 w-3" /></Button>
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
                  </div>
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
