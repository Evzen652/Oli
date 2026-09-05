import { useState } from "react";
import { useChildMisconceptions } from "@/hooks/useChildMisconceptions";
import { Lightbulb, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getReadableSkillName, getSkillSubject } from "@/lib/skillReadableName";
import { getSubjectMeta } from "@/lib/subjectRegistry";
import { IllustrationImg } from "@/components/IllustrationImg";

interface Props {
  childId?: string;
  /** Jméno dítěte — nahradí "žák/Žák" v AI-generovaných textech */
  childName?: string;
}

/**
 * Zobrazí AI-detekované vzorce chyb dítěte (misconceptions).
 *
 * ŽÁDNÉ TLAČÍTKO NA SPUŠTĚNÍ ANALÝZY. Dřív tu bylo „Přepočítat analýzu chyb" —
 * inženýrské ovládání v rodičovském rozhraní. Rodič nevěděl, co „analýza chyb"
 * je, kdy ji má zmáčknout ani jestli je současný seznam čerstvý. Ptal se na to
 * doslova otázkou „co to je?", což je na tlačítko dostatečný verdikt.
 *
 * Odebráním se nic neztratilo: analýzu už spouští `performanceTracker`
 * automaticky po chybné odpovědi (fire-and-forget, max 1× za 6 h na dítě).
 * Tlačítko bylo ruční duplikát toho, co běží samo. Kdyby bylo někdy potřeba
 * přepočítat poškozený nález, patří to do adminu, ne sem.
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
  const [restOpen, setRestOpen] = useState(false);

  if (loading) return null;

  // Prázdný stav, ne prázdná díra ani tlačítko. Sekce se nesmí schovat úplně —
  // vede na ni kotva „Na co se zaměřit ↓" z lišty nad kartami.
  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6">
        Zatím se neopakuje žádná konkrétní chyba. Až jich bude víc, najdete tady,
        na co se zaměřit.
      </p>
    );
  }

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
    </div>
  );
}
