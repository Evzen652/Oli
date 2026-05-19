import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Check, X, Loader2, ChevronDown, ChevronUp, Sparkles, Trash2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { CurriculumProposal } from "./AdminAIChat";

interface ProposalReviewProps {
  proposals: CurriculumProposal[];
  explanation: string;
  onDone: () => void;
  onDismiss: () => void;
  onNextAction?: (prompt: string) => void;
}

type ProposalItem = CurriculumProposal & {
  expanded: boolean;
  saving: boolean;
  saved: boolean;
};

// ══════════════════════════════════════════════════════
// ProposalTree — box/card layout, vše předpočítáno synchronně
// ══════════════════════════════════════════════════════
function ProposalTree({ items }: { items: ProposalItem[] }) {
  const subjects   = items.filter((i) => i.type === "subject");
  const categories = items.filter((i) => i.type === "category");
  const topics     = items.filter((i) => i.type === "topic");
  const skills     = items.filter((i) => i.type === "skill");

  const norm = (s: unknown) => String(s || "").toLowerCase().replace(/[\s_-]/g, "");
  const ms = (a: unknown, b: unknown) => norm(a) === norm(b) && norm(a) !== "";

  // ── Předpočítej celou strukturu synchronně (ne uvnitř komponent) ──
  type TopicRow  = { top: ProposalItem; skillCount: number };
  type CatRow    = { cat: ProposalItem; topicRows: TopicRow[] };
  type SubjRow   = { subj: ProposalItem; catRows: CatRow[] };

  const usedCatIdx   = new Set<number>();
  const usedTopicIdx = new Set<number>();

  const subjRows: SubjRow[] = subjects.map((subj) => {
    const catRows: CatRow[] = categories
      .map((cat, ci) => ({ cat, ci }))
      .filter(({ cat }) => ms(cat.data.subject_slug, subj.data.slug))
      .map(({ cat, ci }) => {
        usedCatIdx.add(ci);
        const topicRows: TopicRow[] = topics
          .map((top, ti) => ({ top, ti }))
          .filter(({ top }) => ms(top.data.category_slug, cat.data.slug))
          .map(({ top, ti }) => {
            usedTopicIdx.add(ti);
            const skillCount = skills.filter(
              (sk) => ms(sk.data.topic_slug, top.data.slug) || ms(sk.data.category_slug, top.data.slug)
            ).length;
            return { top, skillCount };
          });
        return { cat, topicRows };
      });
    return { subj, catRows };
  });

  const orphanCatRows: CatRow[] = categories
    .map((cat, ci) => ({ cat, ci }))
    .filter(({ ci }) => !usedCatIdx.has(ci))
    .map(({ cat, ci }) => {
      usedCatIdx.add(ci);
      const topicRows: TopicRow[] = topics
        .map((top, ti) => ({ top, ti }))
        .filter(({ top }) => ms(top.data.category_slug, cat.data.slug))
        .map(({ top, ti }) => {
          usedTopicIdx.add(ti);
          const skillCount = skills.filter(
            (sk) => ms(sk.data.topic_slug, top.data.slug)
          ).length;
          return { top, skillCount };
        });
      return { cat, topicRows };
    });

  // Jemné pastelové podbarvení pro každý boxík — cyklicky
  const boxPalette = [
    { bg: "bg-violet-50/70",  border: "border-violet-100",  chip: "bg-violet-100/60 border-violet-200/60 text-violet-800" },
    { bg: "bg-amber-50/70",   border: "border-amber-100",   chip: "bg-amber-100/60 border-amber-200/60 text-amber-800" },
    { bg: "bg-sky-50/70",     border: "border-sky-100",     chip: "bg-sky-100/60 border-sky-200/60 text-sky-800" },
    { bg: "bg-emerald-50/70", border: "border-emerald-100", chip: "bg-emerald-100/60 border-emerald-200/60 text-emerald-800" },
    { bg: "bg-rose-50/70",    border: "border-rose-100",    chip: "bg-rose-100/60 border-rose-200/60 text-rose-800" },
    { bg: "bg-orange-50/70",  border: "border-orange-100",  chip: "bg-orange-100/60 border-orange-200/60 text-orange-800" },
  ];

  // ── Render jednoho boxíku okruhu ──
  const CatBox = ({ cat, topicRows, idx }: CatRow & { idx: number }) => {
    const p = boxPalette[idx % boxPalette.length];
    return (
    <div className={`rounded-lg border px-3 py-2.5 min-w-[130px] flex-1 transition-all ${
      cat.saved ? "border-green-200 bg-green-50/60" : `${p.border} ${p.bg}`
    }`}>
      <p className={`text-[12px] font-semibold leading-tight mb-2 ${
        cat.saved ? "text-green-700 line-through" : "text-foreground"
      }`}>
        {cat.saved && "✓ "}{String(cat.data.name)}
      </p>
      {topicRows.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {topicRows.map(({ top, skillCount }, ti) => (
            <span key={ti} className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-medium border ${
              top.saved
                ? "bg-green-100 border-green-200 text-green-700 line-through"
                : p.chip
            }`}>
              {String(top.data.name)}
              {skillCount > 0 && <span className="opacity-40 font-normal">·{skillCount}</span>}
            </span>
          ))}
        </div>
      )}
      {topicRows.length > 0 && (
        <p className="mt-1.5 text-[10px] text-muted-foreground/40">
          {topicRows.length} témat
          {topicRows.reduce((a, r) => a + r.skillCount, 0) > 0 &&
            ` · ${topicRows.reduce((a, r) => a + r.skillCount, 0)} podtémat`}
        </p>
      )}
    </div>
    );
  };

  return (
    <div className="space-y-3 select-none">
      {subjRows.map(({ subj, catRows }, si) => (
        <div key={si}>
          <div className="flex items-center gap-2 mb-2">
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${subj.saved ? "bg-green-500" : "bg-primary"}`} />
            <span className={`text-[13px] font-bold ${subj.saved ? "text-green-700 line-through" : "text-foreground"}`}>
              {subj.saved && "✓ "}{String(subj.data.name)}
            </span>
            {catRows.length > 0 && (
              <span className="text-[10px] text-muted-foreground/50">{catRows.length} okruhů</span>
            )}
          </div>
          {catRows.length > 0 && (
            <div className="flex flex-wrap gap-2 pl-5">
              {catRows.map((cr, ci) => <CatBox key={ci} {...cr} idx={ci} />)}
            </div>
          )}
        </div>
      ))}
      {orphanCatRows.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {orphanCatRows.map((cr, ci) => <CatBox key={`oc-${ci}`} {...cr} idx={ci} />)}
        </div>
      )}
    </div>
  );
}

// Main component
// ══════════════════════════════════════════════════════
export function ProposalReview({ proposals, explanation, onDone, onDismiss, onNextAction }: ProposalReviewProps) {
  const [items, setItems] = useState<ProposalItem[]>(
    proposals.map((p) => ({ ...p, expanded: true, saving: false, saved: false }))
  );
  const [allDone, setAllDone] = useState(false);
  const [savingAll, setSavingAll] = useState(false);
  const [savingType, setSavingType] = useState<string | null>(null);

  const updateItem = (index: number, data: Record<string, unknown>) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, data: { ...item.data, ...data } } : item))
    );
  };

  const toggleExpand = (index: number) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, expanded: !item.expanded } : item)));
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const saveOne = async (index: number) => {
    // Snapshot item at call time — avoid stale closure
    let item: ProposalItem | undefined;
    setItems((prev) => {
      item = prev[index];
      return prev.map((it, i) => (i === index ? { ...it, saving: true } : it));
    });
    // Wait for state to flush
    await new Promise<void>(r => setTimeout(r, 0));
    if (!item) return;

    try {
      await saveProposalToDb(item);
      setItems((prev) => prev.map((it, i) => (i === index ? { ...it, saving: false, saved: true } : it)));
      const actionLabel = item.action === "delete" ? "smazán/a" : "použito";
      toast.success(`${getTypeLabel(item.type)} "${item.data.name}" – ${actionLabel}`);
    } catch (e) {
      setItems((prev) => prev.map((it, i) => (i === index ? { ...it, saving: false } : it)));
      const msg = e instanceof Error ? e.message : (e as any)?.message || "Neznámá chyba";
      toast.error(`Chyba při ukládání: ${msg}`);
      throw e; // re-throw so approveStep can stop
    }
  };

  const saveAll = async () => {
    setSavingAll(true);
    // Sort by type priority — subject → category → topic → skill (respect hierarchy)
    const order = ["subject", "category", "topic", "skill"];
    const indices = items
      .map((it, i) => ({ it, i }))
      .filter(({ it }) => !it.saved)
      .sort((a, b) => order.indexOf(a.it.type) - order.indexOf(b.it.type))
      .map(({ i }) => i);

    for (const i of indices) {
      await saveOne(i);
    }
    setSavingAll(false);
    toast.success("Všechny návrhy provedeny!");
    setAllDone(true);
  };

  const saveByType = async (type: string) => {
    setSavingType(type);
    const indices = items.map((it, i) => ({ it, i })).filter(({ it }) => !it.saved && it.type === type).map(({ i }) => i);
    for (const i of indices) {
      await saveOne(i);
    }
    setSavingType(null);
    if (items.every((it) => it.saved || it.type !== type)) {
      toast.success(`Všechny ${getTypeLabel(type).toLowerCase()} položky provedeny ✓`);
    }
  };

  const allSaved = items.length > 0 && items.every((it) => it.saved);
  const savedCount = items.filter((it) => it.saved).length;
  const progressPct = items.length > 0 ? Math.round((savedCount / items.length) * 100) : 0;

  // Group for batch actions & summary
  const byType = useMemo(() => {
    const groups: Record<string, { total: number; saved: number; pending: number }> = {};
    for (const it of items) {
      if (!groups[it.type]) groups[it.type] = { total: 0, saved: 0, pending: 0 };
      groups[it.type].total++;
      if (it.saved) groups[it.type].saved++;
      else groups[it.type].pending++;
    }
    return groups;
  }, [items]);

  const typeOrder = ["subject", "category", "topic", "skill"] as const;
  const typeLabels: Record<string, string> = { subject: "Předmět", category: "Okruhy", topic: "Témata", skill: "Podtémata" };
  const typeDesc: Record<string, string> = {
    subject: "Zkontroluj název předmětu a potvrď.",
    category: "Zkontroluj okruhy (kapitoly) předmětu.",
    topic: "Zkontroluj témata uvnitř každého okruhu.",
    skill: "Zkontroluj podtémata — konkrétní dovednosti.",
  };

  // Kroky = jen typy, které skutečně existují v návrhu — fixní při mountu, nemění se
  const steps = useMemo(
    () => typeOrder.filter(t => proposals.some(p => p.type === t)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // záměrně bez deps — steps se nesmí měnit za běhu
  );
  const [stepIdx, setStepIdx] = useState(0);
  const safeStepIdx = Math.min(stepIdx, steps.length - 1);
  const currentStep = steps[safeStepIdx] ?? null;

  const stepItems = useMemo(
    () => items.map((it, i) => ({ it, i })).filter(({ it }) => it.type === currentStep),
    [items, currentStep]
  );
  const stepAllSaved = stepItems.length > 0 && stepItems.every(({ it }) => it.saved);
  const isLastStep = safeStepIdx === steps.length - 1;

  const approveStep = async () => {
    setSavingAll(true);
    try {
      const unsaved = stepItems.filter(({ it }) => !it.saved);
      for (const { i } of unsaved) {
        await saveOne(i);
      }
      if (isLastStep) {
        setAllDone(true);
      } else {
        setStepIdx(s => Math.min(s + 1, steps.length - 1));
      }
    } catch {
      // saveOne already showed toast — jen zastavíme
    } finally {
      setSavingAll(false);
    }
  };

  const goBack = () => {
    setStepIdx(s => Math.max(s - 1, 0));
  };

  const unsaveItem = (index: number) => {
    setItems(prev => prev.map((it, i) => i === index ? { ...it, saved: false } : it));
  };

  // Přidat novou položku aktuálního kroku
  const addStepItem = () => {
    if (!currentStep) return;
    // Auto-assign parent slug podle aktuálního kroku
    const subjects  = items.filter(x => x.type === "subject");
    const categories = items.filter(x => x.type === "category");
    const topics    = items.filter(x => x.type === "topic");
    const parentData: Record<string, string> = {};
    if (currentStep === "category" && subjects[0])   parentData.subject_slug  = String(subjects[0].data.slug);
    if (currentStep === "topic"    && categories[0]) parentData.category_slug = String(categories[0].data.slug);
    if (currentStep === "skill"    && topics[0])     parentData.topic_slug    = String(topics[0].data.slug);

    const newItem: ProposalItem = {
      type: currentStep,
      action: "create",
      data: { name: "", slug: `new-${Date.now()}`, ...parentData },
      expanded: true,
      saving: false,
      saved: false,
    };
    setItems(prev => [...prev, newItem]);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-primary/30 bg-primary/5 overflow-hidden shadow-sm">

        {/* ── Hlavička s přehledem ── */}
        <div className="p-5 space-y-4 border-b border-border">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-0.5 flex-1">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" /> AI návrh kurikula
              </h3>
              {explanation && <p className="text-sm text-muted-foreground">{explanation}</p>}
            </div>
            <Button variant="ghost" size="sm" onClick={onDismiss} className="text-muted-foreground shrink-0">
              <X className="h-4 w-4 mr-1" /> Odmítnout
            </Button>
          </div>

          {/* Stromový přehled celého návrhu */}
          <ProposalTree items={items} />

          {/* Krokový indikátor — klikatelný pro dokončené kroky */}
          <div className="flex items-center gap-1 pt-2 mt-1 border-t border-border flex-wrap">
            {steps.map((t, i) => {
              const done = i < safeStepIdx || (i === safeStepIdx && stepAllSaved);
              const active = i === safeStepIdx;
              const clickable = i < safeStepIdx; // lze přejít zpět
              return (
                <div key={t} className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={!clickable && !active}
                    onClick={() => clickable ? setStepIdx(i) : undefined}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                      done ? "bg-green-100 text-green-700" :
                      active ? "bg-primary text-white" :
                      "bg-muted text-muted-foreground"
                    } ${clickable ? "cursor-pointer hover:opacity-80 ring-1 ring-green-300" : "cursor-default"}`}
                    title={clickable ? `Přejít zpět na: ${typeLabels[t]}` : undefined}
                  >
                    {done ? "✓" : i + 1} {typeLabels[t]}
                  </button>
                  {i < steps.length - 1 && <span className="text-muted-foreground/40 text-xs">→</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Aktuální krok ── */}
        {currentStep && !allDone && (
          <>
            {/* Hlavička kroku */}
            <div className="px-5 py-3 border-b-2 border-border bg-muted/40">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide font-medium">
                Krok {safeStepIdx + 1} z {steps.length}
              </p>
              <p className="text-[14px] font-semibold text-foreground mt-0.5">
                {typeDesc[currentStep]}
              </p>
            </div>

            {/* Potvrzovací karty — bez formuláře, jen název + rodič + akce */}
            <div className="divide-y-2 divide-border/60">
              {stepItems.map(({ it, i }) => {
                // Najdi rodiče podle slug vazby
                const parentName = (() => {
                  if (it.type === "category") {
                    const p = items.find(x => x.type === "subject" && x.data.slug === it.data.subject_slug);
                    return p ? String(p.data.name) : null;
                  }
                  if (it.type === "topic") {
                    const p = items.find(x => x.type === "category" && x.data.slug === it.data.category_slug);
                    return p ? String(p.data.name) : null;
                  }
                  if (it.type === "skill") {
                    const p = items.find(x => x.type === "topic" && x.data.slug === it.data.topic_slug);
                    return p ? String(p.data.name) : null;
                  }
                  return null;
                })();
                return (
                  <ConfirmCard
                    key={i}
                    item={it}
                    parentName={parentName}
                    allItems={items}
                    onConfirm={() => saveOne(i)}
                    onEdit={() => toggleExpand(i)}
                    onChange={(d) => updateItem(i, d)}
                    onRemove={() => removeItem(i)}
                    onUnsave={() => unsaveItem(i)}
                  />
                );
              })}
            </div>

            {/* Přidat novou položku */}
            <div className="px-5 py-2 border-t border-dashed border-border/60">
              <button
                type="button"
                onClick={addStepItem}
                className="flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-primary transition-colors py-1"
              >
                <span className="text-base leading-none">＋</span>
                Přidat {typeLabels[currentStep].toLowerCase().replace(/y$/, "").replace(/a$/, "")}
              </button>
            </div>

            {/* Akce kroku */}
            <div className="px-5 py-4 border-t border-border flex items-center justify-between gap-3 bg-muted/20">
              {safeStepIdx > 0 && (
                <Button
                  variant="ghost" size="sm" className="text-xs gap-1.5 text-muted-foreground"
                  onClick={goBack}
                  disabled={savingAll}
                  title="Vrátit se na předchozí krok a upravit"
                >
                  ← Zpět
                </Button>
              )}
              <Button
                size="sm" className="gap-1.5"
                onClick={approveStep}
                disabled={savingAll}
              >
                {savingAll ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                {isLastStep ? "Uložit a dokončit" : `Potvrdit ${typeLabels[currentStep]} a pokračovat →`}
              </Button>
            </div>
          </>
        )}

        {/* ── Hotovo ── */}
        {allDone && (
          <div className="p-6 text-center space-y-3">
            <p className="text-green-700 font-semibold">✓ Celý návrh byl uložen</p>
            {onNextAction && onDone && <NextStepsCard items={items} onNextAction={onNextAction} onDone={onDone} />}
            {!onNextAction && (
              <Button size="sm" variant="outline" onClick={onDone}>Zavřít</Button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// ConfirmCard — jednoduchá potvrzovací karta bez formuláře
// ══════════════════════════════════════════════════════
function ConfirmCard({ item, parentName, allItems, onConfirm, onEdit, onChange, onRemove, onUnsave }: {
  item: ProposalItem;
  parentName: string | null;
  allItems: ProposalItem[];
  onConfirm: () => void;
  onEdit: () => void;
  onChange: (d: Record<string, unknown>) => void;
  onRemove: () => void;
  onUnsave?: () => void;
}) {
  const isNew = !item.data.name; // prázdné jméno = nová položka
  const [editing, setEditing] = useState(isNew); // nové položky rovnou v edit módu
  const [nameVal, setNameVal] = useState(String(item.data.name || ""));

  // Ilustrace — jen pro předmět
  const illustrationUrl = useMemo(() => {
    if (item.type !== "subject") return null;
    const slug = String(item.data.slug || item.data.name || "").toLowerCase().replace(/\s+/g, "-");
    return supabase.storage.from("prvouka-images").getPublicUrl(`subject-${slug}.png`).data.publicUrl;
  }, [item.type, item.data.slug, item.data.name]);
  const [imgExists, setImgExists] = useState<boolean | null>(null);
  const [imgCheckKey, setImgCheckKey] = useState(0);
  const [imgChecking, setImgChecking] = useState(false);

  useEffect(() => {
    if (!illustrationUrl) return;
    setImgChecking(true);
    fetch(`${illustrationUrl}?v=${Date.now()}`, { method: "HEAD" })
      .then(r => setImgExists(r.ok))
      .catch(() => setImgExists(false))
      .finally(() => setImgChecking(false));
  }, [illustrationUrl, imgCheckKey]);

  const handleSaveName = () => {
    if (!nameVal.trim()) return;
    // Auto-generuj slug z názvu
    const slug = nameVal.trim().toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "") // diakritika
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    onChange({ name: nameVal.trim(), slug });
    setEditing(false);
  };

  // Parent options pro nové položky
  const parentOptions = useMemo(() => {
    if (item.type === "category") return allItems.filter(x => x.type === "subject").map(x => ({ slug: String(x.data.slug), name: String(x.data.name) }));
    if (item.type === "topic")    return allItems.filter(x => x.type === "category").map(x => ({ slug: String(x.data.slug), name: String(x.data.name) }));
    if (item.type === "skill")    return allItems.filter(x => x.type === "topic").map(x => ({ slug: String(x.data.slug), name: String(x.data.name) }));
    return [];
  }, [allItems, item.type]);

  const parentSlugKey = item.type === "category" ? "subject_slug" : item.type === "topic" ? "category_slug" : "topic_slug";
  const currentParentSlug = String(item.data[parentSlugKey] || "");

  return (
    <div className={`px-5 py-3.5 flex items-center gap-3 transition-all ${item.saved ? "bg-green-50/50" : ""}`}>

      {/* Ilustrace (jen u předmětu) */}
      {item.type === "subject" && (
        <div className="shrink-0 flex flex-col items-center gap-1">
          {imgExists === true && illustrationUrl ? (
            <img
              src={`${illustrationUrl}?v=${imgCheckKey}`}
              alt=""
              className="h-10 w-10 object-contain rounded-lg bg-white border border-border/40"
            />
          ) : (
            <button
              type="button"
              onClick={() => setImgCheckKey(k => k + 1)}
              className="h-10 w-10 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-muted-foreground/40 text-lg hover:border-primary/40 hover:text-primary/60 transition-all"
              title="Klikni pro obnovení — zkontroluje, zda byla ilustrace vygenerována"
            >
              {imgChecking ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary/60" />
              ) : (
                "🖼"
              )}
            </button>
          )}
          {imgExists === true && (
            <button
              type="button"
              onClick={() => setImgCheckKey(k => k + 1)}
              className="text-[9px] text-muted-foreground/50 hover:text-muted-foreground leading-none"
              title="Znovu načíst ilustraci"
            >
              ↺
            </button>
          )}
        </div>
      )}

      {/* Ikona pro ostatní typy */}
      {item.type !== "subject" && (
        <span className="text-lg shrink-0">{getTypeIcon(item.type)}</span>
      )}

      {/* Název + breadcrumb rodiče */}
      <div className="flex-1 min-w-0">
        {parentName && (
          <p className="text-[11px] text-muted-foreground/70 mb-0.5">
            v: <span className="font-medium text-muted-foreground">{parentName}</span>
          </p>
        )}
        {editing ? (
          <div className="space-y-1.5 w-full">
            <input
              autoFocus
              placeholder="Název…"
              className="w-full text-sm font-medium border border-primary rounded px-2 py-1 outline-none focus:ring-1 focus:ring-primary"
              value={nameVal}
              onChange={e => setNameVal(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleSaveName(); if (e.key === "Escape") { if (isNew) onRemove(); else setEditing(false); } }}
            />
            {parentOptions.length > 1 && (
              <select
                className="w-full text-xs border border-border rounded px-2 py-1 bg-background text-muted-foreground"
                value={currentParentSlug}
                onChange={e => onChange({ [parentSlugKey]: e.target.value })}
              >
                {parentOptions.map(opt => (
                  <option key={opt.slug} value={opt.slug}>{opt.name}</option>
                ))}
              </select>
            )}
          </div>
        ) : (
          <div>
            <span className={`text-sm font-medium ${item.saved ? "text-green-700 line-through" : "text-foreground"}`}>
              {item.saved && "✓ "}{String(item.data.name || "?")}
            </span>
            {item.type === "subject" && imgExists === false && !item.saved && (
              <p className="text-[11px] text-amber-600 mt-0.5">
                ⚠ Chybí ilustrace — vygeneruj ji v panelu Ilustrace, pak klikni na rámeček vlevo pro obnovení.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Akce */}
      {item.saved ? (
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-green-600 font-medium">✓ Potvrzeno</span>
          {onUnsave && (
            <Button
              size="sm" variant="ghost"
              className="h-6 text-[11px] px-2 text-muted-foreground hover:text-foreground"
              onClick={onUnsave}
              title="Vrátit do editace"
            >
              ✏ Upravit
            </Button>
          )}
        </div>
      ) : editing ? (
        <div className="flex gap-1.5 shrink-0">
          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { if (isNew) onRemove(); else setEditing(false); }}>Zrušit</Button>
          <Button size="sm" className="h-7 text-xs" disabled={!nameVal.trim()} onClick={handleSaveName}>Uložit</Button>
        </div>
      ) : (
        <div className="flex gap-1.5 shrink-0">
          <Button
            size="sm" variant="ghost"
            className="h-7 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setEditing(true)}
            title="Upravit název"
          >
            ✏ Upravit
          </Button>
          <Button
            size="sm" variant="ghost"
            className="h-7 text-xs text-muted-foreground hover:text-destructive"
            onClick={onRemove}
            title="Odebrat z návrhu"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════
// Single proposal card
// ══════════════════════════════════════════════════════
function ProposalCard({
  item, onToggle, onRemove, onSave, onChange,
}: {
  item: ProposalItem;
  onToggle: () => void;
  onRemove: () => void;
  onSave: () => void;
  onChange: (d: Record<string, unknown>) => void;
}) {
  const isDelete = item.action === "delete";
  const isUpdate = item.action === "update";

  return (
    <div
      className={`transition-all ${item.saved ? "opacity-60 bg-green-50/40" : ""} ${
        isDelete && !item.saved ? "bg-destructive/5" : ""
      }`}
    >
      <div className="p-4 pb-3 cursor-pointer" onClick={onToggle}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="text-xl shrink-0">{getTypeIcon(item.type)}</div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-base font-semibold ${isDelete ? "line-through text-muted-foreground" : "text-foreground"}`}>
                  {String(item.data.name || "Bez názvu")}
                </span>
                {/* Informační štítky — nejsou tlačítka, jen popis akce a typu */}
                <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${
                  isDelete ? "bg-red-100 text-red-700" : isUpdate ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"
                }`}>
                  {isDelete ? "smazat" : isUpdate ? "upravit" : "vytvořit"}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {getTypeLabel(item.type)}
                </span>
                {item.saved && (
                  <span className="text-[11px] font-medium text-green-700">
                    ✓ {isDelete ? "Smazáno" : "Uloženo"}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {!item.saved && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  variant={isDelete ? "destructive" : "default"}
                  size="sm"
                  className="h-8 gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSave();
                  }}
                  disabled={item.saving}
                >
                  {item.saving ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : isDelete ? (
                    <Trash2 className="h-3 w-3" />
                  ) : (
                    <Check className="h-3 w-3" />
                  )}
                  <span className="hidden sm:inline">{isDelete ? "Smazat" : "Uložit"}</span>
                </Button>
              </>
            )}
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              {item.expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {item.expanded && !isDelete && (
        <div className="px-4 pb-4 space-y-3">
          <ProposalFields
            type={item.type}
            data={item.data}
            onChange={onChange}
            disabled={item.saved}
          />
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════
// Field dispatcher per type
// ══════════════════════════════════════════════════════
function ProposalFields({
  type, data, onChange, disabled,
}: {
  type: string;
  data: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
  disabled: boolean;
}) {
  switch (type) {
    case "subject":
      return <SubjectFields data={data} onChange={onChange} disabled={disabled} />;
    case "category":
      return <CategoryFields data={data} onChange={onChange} disabled={disabled} />;
    case "topic":
      return <TopicFields data={data} onChange={onChange} disabled={disabled} />;
    case "skill":
      return <SkillFields data={data} onChange={onChange} disabled={disabled} />;
    default:
      return <p className="text-sm text-muted-foreground">Neznámý typ: {type}</p>;
  }
}

// ── Small field primitives ────────────────────────────
function TextField({ label, value, onChange, disabled, placeholder, multiline = false }: {
  label: string;
  value: unknown;
  onChange: (v: string) => void;
  disabled: boolean;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {multiline ? (
        <Textarea
          value={String(value || "")}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          rows={2}
          className="text-sm"
          placeholder={placeholder}
        />
      ) : (
        <Input
          value={String(value || "")}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="text-sm"
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

function ArrayField({ label, value, onChange, disabled, placeholder }: {
  label: string;
  value: unknown;
  onChange: (v: string[]) => void;
  disabled: boolean;
  placeholder?: string;
}) {
  const arr = Array.isArray(value) ? (value as string[]) : [];
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        {arr.length > 0 && <span className="text-[10px] text-muted-foreground">{arr.length} pol.</span>}
      </div>
      <Textarea
        value={arr.join("\n")}
        onChange={(e) => onChange(e.target.value.split("\n").filter(Boolean))}
        disabled={disabled}
        rows={Math.max(2, Math.min(arr.length + 1, 6))}
        className="text-sm"
        placeholder={placeholder || "Každý řádek = jedna položka"}
      />
    </div>
  );
}

// ── Slug řádek — skrytý v <details>, admin ho normálně nevidí ──
function SlugRow({ label, value, onChange, disabled }: { label: string; value: unknown; onChange: (v: string) => void; disabled: boolean }) {
  return (
    <details className="group">
      <summary className="text-[11px] text-muted-foreground/60 cursor-pointer select-none hover:text-muted-foreground list-none flex items-center gap-1">
        <span className="group-open:hidden">▸</span>
        <span className="hidden group-open:inline">▾</span>
        {label} <span className="italic">(technické ID — není třeba měnit)</span>
      </summary>
      <div className="mt-1.5">
        <Input
          value={String(value || "")}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="text-xs text-muted-foreground h-7"
        />
      </div>
    </details>
  );
}

// ── Simple types ──────────────────────────────────────
function SubjectFields({ data, onChange, disabled }: any) {
  return (
    <div className="space-y-3">
      <TextField label="Název" value={data.name} onChange={(v) => onChange({ name: v })} disabled={disabled} />
      <SlugRow label="ID předmětu" value={data.slug} onChange={(v) => onChange({ slug: v })} disabled={disabled} />
    </div>
  );
}

function CategoryFields({ data, onChange, disabled }: any) {
  return (
    <div className="space-y-3">
      <TextField label="Název" value={data.name} onChange={(v) => onChange({ name: v })} disabled={disabled} />
      <TextField label="Popis" value={data.description} onChange={(v) => onChange({ description: v })} disabled={disabled} multiline />
      <TextField label="🌟 Zajímavost" value={data.fun_fact} onChange={(v) => onChange({ fun_fact: v })} disabled={disabled} />
      <div className="space-y-1.5 pt-1 border-t border-border/40">
        <SlugRow label="ID okruhu" value={data.slug} onChange={(v) => onChange({ slug: v })} disabled={disabled} />
        <SlugRow label="ID předmětu" value={data.subject_slug} onChange={(v) => onChange({ subject_slug: v })} disabled={disabled} />
      </div>
    </div>
  );
}

function TopicFields({ data, onChange, disabled }: any) {
  return (
    <div className="space-y-3">
      <TextField label="Název" value={data.name} onChange={(v) => onChange({ name: v })} disabled={disabled} />
      <TextField label="Popis" value={data.description} onChange={(v) => onChange({ description: v })} disabled={disabled} multiline />
      <div className="space-y-1.5 pt-1 border-t border-border/40">
        <SlugRow label="ID tématu" value={data.slug} onChange={(v) => onChange({ slug: v })} disabled={disabled} />
        <SlugRow label="ID okruhu" value={data.category_slug} onChange={(v) => onChange({ category_slug: v })} disabled={disabled} />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// Skill fields — grouped into collapsible sections + preview
// ══════════════════════════════════════════════════════
function SkillFields({ data, onChange, disabled }: any) {
  const [showPreview, setShowPreview] = useState(false);

  // Summary counters for section headers
  const goalsN = Array.isArray(data.goals) ? data.goals.length : 0;
  const boundariesN = Array.isArray(data.boundaries) ? data.boundaries.length : 0;
  const keywordsN = Array.isArray(data.keywords) ? data.keywords.length : 0;
  const stepsN = Array.isArray(data.help_steps) ? data.help_steps.length : 0;
  const visualsN = Array.isArray(data.help_visual_examples) ? data.help_visual_examples.length : 0;

  return (
    <div className="space-y-2">
      {/* Preview toggle */}
      <div className="flex justify-end">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowPreview(!showPreview)}
          className="gap-1.5 h-7 text-xs"
        >
          {showPreview ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          {showPreview ? "Skrýt náhled" : "Náhled pro žáka"}
        </Button>
      </div>

      {showPreview && <SkillPreview data={data} />}

      {/* 📝 Základ */}
      <SectionBlock title="📝 Základ" summary={String(data.name || "—")} defaultOpen>
        <div className="space-y-3">
          <TextField label="Název" value={data.name} onChange={(v) => onChange({ name: v })} disabled={disabled} />
          <div className="grid sm:grid-cols-2 gap-3">
            <TextField label="Kód (code_skill_id)" value={data.code_skill_id} onChange={(v) => onChange({ code_skill_id: v })} disabled={disabled} placeholder="math-scitani-do-100" />
            <TextField label="Téma (topic_slug)" value={data.topic_slug} onChange={(v) => onChange({ topic_slug: v })} disabled={disabled} />
          </div>
          <TextField label="Stručný popis (pro žáka)" value={data.brief_description} onChange={(v) => onChange({ brief_description: v })} disabled={disabled} multiline placeholder="Naučíš se…" />
          <div className="grid grid-cols-3 gap-3">
            <TextField label="Ročník od" value={data.grade_min} onChange={(v) => onChange({ grade_min: v })} disabled={disabled} />
            <TextField label="Ročník do" value={data.grade_max} onChange={(v) => onChange({ grade_max: v })} disabled={disabled} />
            <TextField label="Typ vstupu" value={data.input_type} onChange={(v) => onChange({ input_type: v })} disabled={disabled} placeholder="text / number / …" />
          </div>
        </div>
      </SectionBlock>

      {/* 🎯 Učební cíle */}
      <SectionBlock
        title="🎯 Učební cíle"
        summary={`cíle: ${goalsN} · hranice: ${boundariesN} · klíč. slova: ${keywordsN}`}
      >
        <div className="space-y-3">
          <ArrayField label="🎯 Cíle" value={data.goals} onChange={(v) => onChange({ goals: v })} disabled={disabled} placeholder="Co se žák naučí (každý cíl na řádek)" />
          <ArrayField label="🚧 Hranice (co se NEPROCVIČUJE)" value={data.boundaries} onChange={(v) => onChange({ boundaries: v })} disabled={disabled} />
          <ArrayField label="🔑 Klíčová slova" value={data.keywords} onChange={(v) => onChange({ keywords: v })} disabled={disabled} placeholder="Pro matching dotazů žáka" />
        </div>
      </SectionBlock>

      {/* 💡 Nápověda pro žáka */}
      <SectionBlock
        title="💡 Nápověda pro žáka"
        summary={`tip: ${data.help_hint ? "✓" : "—"} · kroky: ${stepsN} · vizuály: ${visualsN}`}
      >
        <div className="space-y-3">
          <TextField label="💡 Tip" value={data.help_hint} onChange={(v) => onChange({ help_hint: v })} disabled={disabled} multiline placeholder="Krátká rada (ne přímá odpověď!)" />
          <ArrayField label="🧩 Kroky řešení" value={data.help_steps} onChange={(v) => onChange({ help_steps: v })} disabled={disabled} placeholder="Krok 1&#10;Krok 2&#10;Krok 3" />
          <TextField label="✏️ Příklad" value={data.help_example} onChange={(v) => onChange({ help_example: v })} disabled={disabled} placeholder="42 + 37 = 79" />
          <TextField label="⚠️ Častá chyba" value={data.help_common_mistake} onChange={(v) => onChange({ help_common_mistake: v })} disabled={disabled} multiline />
          <ArrayField label="🖼️ Vizuální příklady (ASCII)" value={data.help_visual_examples} onChange={(v) => onChange({ help_visual_examples: v })} disabled={disabled} />
        </div>
      </SectionBlock>

      {/* 🌟 Meta */}
      <SectionBlock title="🌟 Meta" summary={data.fun_fact ? "zajímavost: ✓" : "—"}>
        <TextField label="🌟 Zajímavost" value={data.fun_fact} onChange={(v) => onChange({ fun_fact: v })} disabled={disabled} multiline />
      </SectionBlock>
    </div>
  );
}

// ── Collapsible section ──
function SectionBlock({
  title, summary, children, defaultOpen = false,
}: {
  title: string;
  summary?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full rounded-md border bg-muted/30 px-3 py-2 hover:bg-muted/60 transition-colors">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <span>{title}</span>
          {summary && <span className="text-xs text-muted-foreground font-normal">— {summary}</span>}
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-2 rounded-md border bg-background p-3">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// ══════════════════════════════════════════════════════
// Skill preview — "how the student will see this"
// ══════════════════════════════════════════════════════
function SkillPreview({ data }: { data: Record<string, unknown> }) {
  const name = String(data.name || "Bez názvu");
  const desc = String(data.brief_description || "");
  const inputType = String(data.input_type || "text");
  const hint = String(data.help_hint || "");
  const goals = Array.isArray(data.goals) ? (data.goals as string[]) : [];

  return (
    <div className="rounded-xl border-2 border-blue-200 bg-blue-50/40 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Eye className="h-4 w-4 text-blue-600" />
        <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Náhled — jak to uvidí žák</p>
      </div>
      <div className="rounded-lg bg-background border p-4 space-y-2">
        <h4 className="text-base font-semibold text-foreground">{name}</h4>
        {desc && <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>}
        {goals.length > 0 && (
          <div className="pt-1">
            <p className="text-xs text-muted-foreground mb-1">Naučíš se:</p>
            <ul className="list-disc list-inside text-sm text-foreground space-y-0.5">
              {goals.slice(0, 3).map((g, i) => (
                <li key={i}>{g}</li>
              ))}
              {goals.length > 3 && <li className="text-muted-foreground">… a {goals.length - 3} dalších</li>}
            </ul>
          </div>
        )}
        <div className="flex items-center gap-2 pt-2">
          <Badge variant="outline" className="text-[10px]">Typ odpovědi: {inputType}</Badge>
          {data.grade_min && data.grade_max && (
            <Badge variant="outline" className="text-[10px]">
              {String(data.grade_min)}–{String(data.grade_max)}. ročník
            </Badge>
          )}
        </div>
        {hint && (
          <div className="mt-2 rounded-md bg-amber-50 border border-amber-200 p-2.5">
            <p className="text-xs text-amber-900">
              <span className="font-semibold">💡 Tip:</span> {hint}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// Helpers
// ══════════════════════════════════════════════════════
function getTypeLabel(type: string) {
  switch (type) {
    case "subject": return "Předmět";
    case "category": return "Okruh";
    case "topic": return "Téma";
    case "skill": return "Podtéma";
    default: return type;
  }
}

function getTypeIcon(type: string): string {
  switch (type) {
    case "subject": return "📚";
    case "category": return "📂";
    case "topic": return "📄";
    case "skill": return "🎯";
    default: return "•";
  }
}

// ══════════════════════════════════════════════════════
// Next steps card (after all saved)
// ══════════════════════════════════════════════════════
function NextStepsCard({
  items, onNextAction, onDone,
}: {
  items: ProposalItem[];
  onNextAction: (prompt: string) => void;
  onDone: () => void;
}) {
  const savedTopics = items.filter((it) => it.type === "topic" && it.saved);
  const savedSkills = items.filter((it) => it.type === "skill" && it.saved);

  return (
    <Card className="border-2 border-primary/30 bg-primary/5">
      <CardContent className="p-5 space-y-4">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" /> Další kroky
        </h4>
        <p className="text-sm text-muted-foreground">Návrhy byly provedeny. Co chcete udělat dál?</p>
        <div className="flex flex-wrap gap-2">
          {savedTopics.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1"
              onClick={() => {
                const topicNames = savedTopics.map((t) => String(t.data.name)).join(", ");
                onNextAction(
                  `Navrhni podtémata (skills) pro nově vytvořená témata: ${topicNames}. Pro každé téma navrhni 2-4 konkrétní podtémata s vhodnými input_type.`
                );
                onDone();
              }}
            >
              <Sparkles className="h-3 w-3" /> Navrhnout podtémata
            </Button>
          )}
          {savedSkills.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1"
              onClick={() => {
                const skillNames = savedSkills.map((s) => String(s.data.name)).join(", ");
                onNextAction(
                  `Vygeneruj cvičení pro nově vytvořená podtémata: ${skillNames}. Pro každé podtéma vygeneruj 5-8 cvičení.`
                );
                onDone();
              }}
            >
              <Sparkles className="h-3 w-3" /> Vygenerovat cvičení
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={onDone}>
            Zavřít
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ══════════════════════════════════════════════════════
// DB save / delete logic — unchanged API
// ══════════════════════════════════════════════════════
async function saveProposalToDb(item: ProposalItem) {
  const { type, data, action } = item;
  const isUpdate = action === "update";
  const isDelete = action === "delete";

  if (isDelete) {
    return deleteProposalFromDb(type, data);
  }

  switch (type) {
    case "subject": {
      const payload = {
        name: String(data.name),
        slug: String(data.slug),
        sort_order: Number(data.sort_order || 0),
      };
      // Upsert — funguje pro create i update, bezpečné při opakovaném pokusu
      const { error } = await supabase
        .from("curriculum_subjects")
        .upsert(payload, { onConflict: "slug" });
      if (error) throw error;
      break;
    }
    case "category": {
      const { data: subjectRow } = await supabase
        .from("curriculum_subjects")
        .select("id")
        .eq("slug", String(data.subject_slug))
        .maybeSingle();
      if (!subjectRow) throw new Error(`Předmět "${data.subject_slug}" nenalezen v DB. Nejdřív ulož předmět.`);

      const catPayload = {
        name: String(data.name),
        slug: String(data.slug),
        subject_id: subjectRow.id,
        description: data.description ? String(data.description) : null,
        fun_fact: data.fun_fact ? String(data.fun_fact) : null,
        sort_order: Number(data.sort_order || 0),
      };
      // Ručně check-then-insert-or-update (slug nemá UNIQUE constraint v DB)
      const { data: existingCat } = await supabase
        .from("curriculum_categories")
        .select("id")
        .eq("slug", String(data.slug))
        .maybeSingle();
      if (existingCat) {
        const { error } = await supabase.from("curriculum_categories").update(catPayload).eq("id", existingCat.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("curriculum_categories").insert(catPayload);
        if (error) throw error;
      }
      break;
    }
    case "topic": {
      const { data: catRow } = await supabase
        .from("curriculum_categories")
        .select("id")
        .eq("slug", String(data.category_slug))
        .maybeSingle();
      if (!catRow) throw new Error(`Okruh "${data.category_slug}" nenalezen v DB. Nejdřív ulož okruhy.`);

      const topicPayload = {
        name: String(data.name),
        slug: String(data.slug),
        category_id: catRow.id,
        description: data.description ? String(data.description) : null,
        sort_order: Number(data.sort_order || 0),
      };
      // Ručně check-then-insert-or-update (slug nemá UNIQUE constraint v DB)
      const { data: existingTopic } = await supabase
        .from("curriculum_topics")
        .select("id")
        .eq("slug", String(data.slug))
        .maybeSingle();
      const { error } = existingTopic
        ? await supabase.from("curriculum_topics").update(topicPayload).eq("id", existingTopic.id)
        : await supabase.from("curriculum_topics").insert(topicPayload);
      if (error) throw error;
      break;
    }
    case "skill": {
      if (isUpdate) {
        const updatePayload: Record<string, unknown> = {};
        if (data.name) updatePayload.name = String(data.name);
        if (data.code_skill_id) updatePayload.code_skill_id = String(data.code_skill_id);
        if (data.brief_description) updatePayload.brief_description = String(data.brief_description);
        if (data.grade_min) updatePayload.grade_min = Number(data.grade_min);
        if (data.grade_max) updatePayload.grade_max = Number(data.grade_max);
        if (data.input_type) updatePayload.input_type = String(data.input_type);
        if (data.help_hint) updatePayload.help_hint = String(data.help_hint);
        if (data.help_example) updatePayload.help_example = String(data.help_example);
        if (data.help_common_mistake) updatePayload.help_common_mistake = String(data.help_common_mistake);
        if (Array.isArray(data.goals)) updatePayload.goals = data.goals;
        if (Array.isArray(data.boundaries)) updatePayload.boundaries = data.boundaries;
        if (Array.isArray(data.keywords)) updatePayload.keywords = data.keywords;
        if (Array.isArray(data.help_steps)) updatePayload.help_steps = data.help_steps;
        if (Array.isArray(data.help_visual_examples)) updatePayload.help_visual_examples = data.help_visual_examples;
        if (data.fun_fact) updatePayload.fun_fact = String(data.fun_fact);
        if (data.topic_slug) {
          const { data: topicRow } = await supabase
            .from("curriculum_topics")
            .select("id")
            .eq("slug", String(data.topic_slug))
            .maybeSingle();
          if (topicRow) updatePayload.topic_id = topicRow.id;
        }

        if (data.code_skill_id) {
          const { error } = await supabase
            .from("curriculum_skills")
            .update(updatePayload)
            .eq("code_skill_id", String(data.code_skill_id));
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("curriculum_skills")
            .update(updatePayload)
            .eq("name", String(data.name));
          if (error) throw error;
        }
      } else {
        const { data: topicRow } = await supabase
          .from("curriculum_topics")
          .select("id")
          .eq("slug", String(data.topic_slug))
          .maybeSingle();
        if (!topicRow) throw new Error(`Téma "${data.topic_slug}" nenalezeno`);

        const payload = {
          name: String(data.name),
          code_skill_id: String(data.code_skill_id),
          brief_description: data.brief_description ? String(data.brief_description) : null,
          topic_id: topicRow.id,
          grade_min: Number(data.grade_min || 3),
          grade_max: Number(data.grade_max || 9),
          input_type: String(data.input_type || "text"),
          goals: Array.isArray(data.goals) ? data.goals : [],
          boundaries: Array.isArray(data.boundaries) ? data.boundaries : [],
          keywords: Array.isArray(data.keywords) ? data.keywords : [],
          help_hint: data.help_hint ? String(data.help_hint) : null,
          help_example: data.help_example ? String(data.help_example) : null,
          help_common_mistake: data.help_common_mistake ? String(data.help_common_mistake) : null,
          help_steps: Array.isArray(data.help_steps) ? data.help_steps : [],
          help_visual_examples: Array.isArray(data.help_visual_examples) ? data.help_visual_examples : [],
          fun_fact: data.fun_fact ? String(data.fun_fact) : null,
          sort_order: Number(data.sort_order || 0),
        };
        const { error } = await supabase.from("curriculum_skills").insert(payload);
        if (error) throw error;
      }
      break;
    }
    default:
      throw new Error(`Neznámý typ: ${type}`);
  }
}

async function deleteProposalFromDb(type: string, data: Record<string, unknown>) {
  switch (type) {
    case "subject": {
      const { error } = await supabase.from("curriculum_subjects").delete().eq("slug", String(data.slug));
      if (error) throw error;
      break;
    }
    case "category": {
      const { data: subjectRow } = await supabase
        .from("curriculum_subjects")
        .select("id")
        .eq("slug", String(data.subject_slug))
        .maybeSingle();
      if (!subjectRow) throw new Error(`Předmět "${data.subject_slug}" nenalezen`);
      const { error } = await supabase
        .from("curriculum_categories")
        .delete()
        .eq("slug", String(data.slug))
        .eq("subject_id", subjectRow.id);
      if (error) throw error;
      break;
    }
    case "topic": {
      const { data: catRow } = await supabase
        .from("curriculum_topics")
        .select("id, category_id")
        .eq("slug", String(data.slug))
        .maybeSingle();
      if (!catRow) throw new Error(`Téma "${data.slug}" nenalezeno`);
      const { error } = await supabase.from("curriculum_topics").delete().eq("id", catRow.id);
      if (error) throw error;
      break;
    }
    case "skill": {
      if (data.code_skill_id) {
        const { error } = await supabase
          .from("curriculum_skills")
          .delete()
          .eq("code_skill_id", String(data.code_skill_id));
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("curriculum_skills")
          .delete()
          .eq("name", String(data.name));
        if (error) throw error;
      }
      break;
    }
    default:
      throw new Error(`Neznámý typ pro smazání: ${type}`);
  }
}
