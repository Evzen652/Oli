import { useState } from "react";
import { useChildMisconceptions } from "@/hooks/useChildMisconceptions";
import { AlertTriangle, Lightbulb, Sparkles, Loader2 } from "lucide-react";
import { getReadableSkillName } from "@/lib/skillReadableName";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Props {
  childId: string;
}

/**
 * Zobrazí AI-detekované vzorce chyb dítěte (misconceptions).
 * Pokud žádné aktivní → nezobrazí nic (skrytá sekce).
 */
export function ChildMisconceptions({ childId }: Props) {
  const { data, loading } = useChildMisconceptions(childId);
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
    <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 space-y-3 shadow-soft-1">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-amber-100 text-amber-700">
          <AlertTriangle className="h-3.5 w-3.5" />
        </span>
        <p className="font-display font-semibold text-foreground text-sm">
          Co se opakovaně nedaří
        </p>
        <span className="text-[11px] text-muted-foreground">
          AI rozpoznala {data.length} {data.length === 1 ? "vzor" : data.length < 5 ? "vzory" : "vzorů"}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAnalyze}
          disabled={analyzing}
          className="ml-auto h-7 px-2 text-[11px] gap-1 text-amber-700 hover:text-amber-900 hover:bg-amber-100 rounded-full"
          title="Spustit novou AI analýzu"
        >
          {analyzing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
          {analyzing ? "Analyzuji…" : "Aktualizovat"}
        </Button>
      </div>

      <div className="space-y-2.5">
        {data.map((m) => (
          <div key={m.id} className="rounded-xl bg-card border border-amber-200/70 p-3 space-y-1.5">
            <div className="flex items-start gap-2 flex-wrap">
              <p className="font-semibold text-foreground text-sm flex-1 min-w-0">
                {m.pattern_label}
              </p>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0">
                {getReadableSkillName(m.skill_id)}
              </span>
            </div>
            {m.description && (
              <p className="text-[12px] text-muted-foreground leading-snug">{m.description}</p>
            )}
            {m.suggestion && (
              <div className="flex items-start gap-1.5 pt-1.5 border-t border-amber-200/50">
                <Lightbulb className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[12px] text-foreground/85 leading-snug font-medium">{m.suggestion}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
