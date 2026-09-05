import { useState } from "react";
import { useChildMisconceptions } from "@/hooks/useChildMisconceptions";
import { Lightbulb, Sparkles, Loader2, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getReadableSkillName, getSkillSubject } from "@/lib/skillReadableName";
import { getSubjectMeta } from "@/lib/subjectRegistry";
import { IllustrationImg } from "@/components/IllustrationImg";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { pad } from "@/lib/czechGrammar";

interface Props {
  childId?: string;
  /** Jméno dítěte — nahradí "žák/Žák" v AI-generovaných textech */
  childName?: string;
}

/**
 * Zobrazí AI-detekované vzorce chyb dítěte (misconceptions).
 * Pokud žádné aktivní → nezobrazí nic (skrytá sekce).
 */
export function ChildMisconceptions({ childId = "", childName }: Props) {
  // Hranice slova jsou nutnost, ne kosmetika: bez nich `replace` trefí i vnitřek
  // slova a „žáka" se změní na „Tondaa", „žákyně" na „Tondayně". Skloňované tvary
  // proto necháváme být — obecné „žáka" je lepší než ne-slovo. České skloňování
  // jmen nejde spolehlivě odvodit (viz dřívější „Úkol pro Tonda").
  const sub = (text: string) =>
    childName ? text.replace(/\b[Žž]ák\b/g, childName) : text;
  const hookResult = useChildMisconceptions(childId);
  const data = hookResult.data;
  const loading = hookResult.loading;
  const { toast } = useToast();
  const [analyzing, setAnalyzing] = useState(false);
  const [restOpen, setRestOpen] = useState(false);

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
            : `Analýza dokončena: ${pad(analyzed, "TÉMA")}, detekováno ${detected}, vyřešeno ${resolved}.`,
      });
      hookResult.refetch();
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

  /**
   * Tlačítko pro (pře)spuštění analýzy.
   *
   * Do 2026-09-04 se renderovalo POUZE ve větvi „žádné nálezy". Jakmile první
   * nález vznikl, zmizelo navždy a rodič neměl jak si analýzu nechat spočítat
   * znovu — i kdyby byly nálezy měsíce staré nebo poškozené (v ostré DB je
   * uložený text s ruským „части" místo „části" z doby, kdy prompt nevynucoval
   * češtinu). Proto je dostupné v obou stavech.
   */
  const analyzeButton = (
    <button
      onClick={handleAnalyze}
      disabled={analyzing}
      className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-card/40 hover:bg-card hover:border-primary/40 px-4 py-2.5 text-xs font-medium text-muted-foreground transition-colors disabled:opacity-60"
      title="AI znovu projde chyby z posledních 30 dní a hledá v nich vzorce"
    >
      {analyzing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
      {analyzing ? "Analyzuji…" : data.length === 0 ? "Spustit AI analýzu chyb" : "Přepočítat analýzu chyb"}
    </button>
  );

  if (data.length === 0) return analyzeButton;

  // Nálezy chodí seřazené podle `confidence` sestupně (viz hook), takže první
  // dva jsou ty nejjistější. Zbytek je pod přepínačem s VYPSANÝM počtem —
  // rodič reálně zareaguje na jednu dvě věci a čtyři karty se stejnou vahou
  // znamenají, že nevyčnívá žádná. Tichý ořez by to být nesměl, `audit:ui`
  // na „mlčky zahozený zbytek" pravidlo má.
  const PRIMARY = 2;
  const primary = data.slice(0, PRIMARY);
  const rest = data.slice(PRIMARY);

  const card = (m: (typeof data)[number]) => {
        const subject = getSkillSubject(m.skill_id);
        const subjectMeta = subject ? getSubjectMeta(subject) : null;
        const skillName = getReadableSkillName(m.skill_id);
        return (
          // Zjednodušeno (bod b): dřív dva odstavce s labely „Kde chybuje" /
          // „Návrh". Rodič potřebuje hlavně akci — návrh je proto zvýrazněný,
          // popis chyby je jen tichý druhý řádek.
          <div key={m.id} className="rounded-2xl border border-border bg-card p-4 shadow-e1 space-y-2.5">
            <div className="flex items-center gap-2.5">
              <IllustrationImg
                src={subjectMeta?.image ?? ""}
                className="h-7 w-7 object-contain shrink-0"
                fallback={<span className="text-lg">{subjectMeta?.emoji ?? "📋"}</span>}
              />
              <div className="min-w-0">
                {subjectMeta?.label && (
                  <p className="text-caption font-bold text-muted-foreground uppercase tracking-[0.12em] leading-none mb-0.5">{subjectMeta.label}</p>
                )}
                <p className="text-sm font-bold text-foreground leading-tight truncate">{skillName}</p>
              </div>
            </div>
            {m.suggestion && (
              <div className="flex items-start gap-2 rounded-xl border border-warning/30 bg-warning-muted px-3 py-2">
                <Lightbulb className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                <p className="text-sm text-foreground leading-snug">{sub(m.suggestion)}</p>
              </div>
            )}
            {/* `m.description` se NEzobrazuje. Generovaný popis má u všech
                nálezů týž tvar „Žák chybuje v <nadpis karty>, což naznačuje, že
                tomu nerozumí" — tedy nadpis podruhé plus konstatování, které
                říká už samotná existence sekce „Na co se zaměřit". Čtyři
                nálezy × jeden takový odstavec byly nejdelší blok stránky.
                Rodič potřebuje akci, a tu nese `suggestion` nad tím.
                Kdyby analýza začala vracet konkrétní popis (typ chyby, ne
                převyprávěný nadpis), má smysl ho vrátit — pak už bude nést
                informaci, která jinde na kartě není. */}
          </div>
        );
  };

  return (
    <div className="space-y-3">
      {primary.map(card)}

      {rest.length > 0 && (
        <Collapsible open={restOpen} onOpenChange={setRestOpen} className="space-y-3">
          <CollapsibleTrigger className="group flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-border bg-card/40 px-4 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-card hover:border-primary/40">
            <span className="group-data-[state=open]:hidden">Zobrazit další ({rest.length})</span>
            <span className="hidden group-data-[state=open]:inline">Skrýt další</span>
            <ChevronDown className="h-3.5 w-3.5 transition-transform group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3">
            {rest.map(card)}
          </CollapsibleContent>
        </Collapsible>
      )}

      {analyzeButton}
    </div>
  );
}
