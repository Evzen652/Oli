import { useState } from "react";
import { useChildMisconceptions, type Misconception } from "@/hooks/useChildMisconceptions";
import { Lightbulb, Sparkles, Loader2 } from "lucide-react";
import { getReadableSkillName, getSkillSubject } from "@/lib/skillReadableName";
import { getSubjectMeta } from "@/lib/subjectRegistry";
import { IllustrationImg } from "@/components/IllustrationImg";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Props {
  childId?: string;
  /** Jméno dítěte — nahradí "žák/Žák" v AI-generovaných textech */
  childName?: string;
  /** Demo/mock mode — přeskočí Supabase fetch */
  mockData?: Misconception[];
}

/**
 * Zobrazí AI-detekované vzorce chyb dítěte (misconceptions).
 * Pokud žádné aktivní → nezobrazí nic (skrytá sekce).
 */
export function ChildMisconceptions({ childId = "", childName, mockData }: Props) {
  const sub = (text: string) =>
    childName ? text.replace(/[Žž]ák/g, childName) : text;
  const hookResult = useChildMisconceptions(mockData ? null : childId);
  const data = mockData ?? hookResult.data;
  const loading = mockData ? false : hookResult.loading;
  const { toast } = useToast();
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const { data: result, error } = await supabase.functions.invoke("analyze-misconceptions", {
        body: { child_id: childId, days: 30 },
      });
      if (error) throw error;
      const detected = result?.detected ?? 0;
      const resolved = result?.resolved ?? 0;
      const analyzed = result?.skills_analyzed ?? 0;
      toast({
        description:
          analyzed === 0
            ? "Zatím nemáme dost dat na analýzu."
            : `Analýza dokončena: ${analyzed} ${analyzed === 1 ? "téma" : analyzed < 5 ? "témata" : "témat"}, detekováno ${detected}, vyřešeno ${resolved}.`,
      });
      // Force reload — useEffect by se mělo resync
      window.location.reload();
    } catch (e: any) {
      toast({
        description: e?.message ?? "Analýza selhala.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return null;

  // Pokud žádné misconceptions, ukáž jen tichý analyzovat button
  if (data.length === 0) {
    return (
      <button
        onClick={handleAnalyze}
        disabled={analyzing}
        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-card/40 hover:bg-card hover:border-primary/40 px-4 py-2.5 text-xs font-medium text-muted-foreground transition-colors disabled:opacity-60"
        title="AI analyzuje chyby z posledních 30 dní a hledá vzorce"
      >
        {analyzing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
        {analyzing ? "Analyzuji…" : "Spustit AI analýzu chyb"}
      </button>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((m) => {
        const subject = getSkillSubject(m.skill_id);
        const subjectMeta = subject ? getSubjectMeta(subject) : null;
        const skillName = getReadableSkillName(m.skill_id);
        return (
          <div key={m.id} className="rounded-2xl border border-amber-200/70 overflow-hidden">
            {/* Hlavička: předmět + téma */}
            <div className="flex items-center gap-2.5 px-4 py-3 bg-amber-50/60 border-b border-amber-200/50">
              <IllustrationImg
                src={subjectMeta?.image ?? ""}
                className="h-7 w-7 object-contain shrink-0"
                fallback={<span className="text-lg">{subjectMeta?.emoji ?? "📋"}</span>}
              />
              <div className="min-w-0">
                {subjectMeta?.label && (
                  <p className="text-[10px] font-bold text-amber-700/70 uppercase tracking-[0.12em] leading-none mb-0.5">{subjectMeta.label}</p>
                )}
                <p className="text-sm font-bold text-foreground leading-tight truncate">{skillName}</p>
              </div>
            </div>
            {/* Tělo */}
            <div className="px-4 py-3 space-y-3 bg-card">
              {m.description && (
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Kde chybuje</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{sub(m.description)}</p>
                </div>
              )}
              {m.suggestion && (
                <div className="space-y-1 pt-2 border-t border-border/50">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-amber-700/80">Návrh</p>
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground/85 leading-relaxed">{sub(m.suggestion)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
