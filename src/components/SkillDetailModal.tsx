import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, HelpCircle, XCircle } from "lucide-react";
import { getReadableSkillName, getSkillSubject } from "@/lib/skillReadableName";
import { getSubjectMeta } from "@/lib/subjectRegistry";
import { IllustrationImg } from "@/components/IllustrationImg";

interface SessionSummary {
  sessionId: string;
  date: string;
  correct: number;
  helpUsed: number;
  wrong: number;
  total: number;
  pct: number;
}

interface LogItem {
  id: string;
  correct: boolean;
  helpUsed: boolean;
  errorType: string | null;
  question?: string;
  correctAnswer?: string;
}

function pctToGrade(pct: number): 1 | 2 | 3 | 4 | 5 {
  if (pct >= 90) return 1;
  if (pct >= 75) return 2;
  if (pct >= 55) return 3;
  if (pct >= 40) return 4;
  return 5;
}

const GRADE_META: Record<number, { color: string; bg: string; border: string; label: string }> = {
  1: { color: "text-emerald-700", bg: "bg-emerald-50",  border: "border-emerald-300", label: "Výborný"      },
  2: { color: "text-green-700",   bg: "bg-green-50",    border: "border-green-300",   label: "Chvalitebný"  },
  3: { color: "text-amber-700",   bg: "bg-amber-50",    border: "border-amber-300",   label: "Dobrý"        },
  4: { color: "text-orange-700",  bg: "bg-orange-50",   border: "border-orange-300",  label: "Dostatečný"   },
  5: { color: "text-rose-700",    bg: "bg-rose-50",     border: "border-rose-300",    label: "Nedostatečný" },
};

function getRecommendations(sessions: SessionSummary[], overallPct: number, grade: number): string[] {
  const tips: string[] = [];
  const n = sessions.length;
  // sessions[0] = nejnovější, sessions[n-1] = nejstarší

  const totalAnswers = sessions.reduce((s, x) => s + x.total, 0);
  const totalHelp    = sessions.reduce((s, x) => s + x.helpUsed, 0);
  const totalWrong   = sessions.reduce((s, x) => s + x.wrong, 0);
  const totalCorrect = sessions.reduce((s, x) => s + x.correct, 0);
  const helpRatio    = totalAnswers > 0 ? totalHelp  / totalAnswers : 0;
  const wrongRatio   = totalAnswers > 0 ? totalWrong / totalAnswers : 0;
  const correctRatio = totalAnswers > 0 ? totalCorrect / totalAnswers : 0;

  const pcts    = sessions.map(s => s.pct);
  const mean    = n > 0 ? pcts.reduce((a, b) => a + b, 0) / n : 0;
  const stdDev  = n > 1 ? Math.sqrt(pcts.reduce((a, b) => a + (b - mean) ** 2, 0) / n) : 0;
  const bestPct = Math.max(...pcts);
  const worstPct = Math.min(...pcts);

  const lastPct  = n >= 1 ? sessions[0].pct : null;
  const prevPct  = n >= 2 ? sessions[1].pct : null;
  const thirdPct = n >= 3 ? sessions[2].pct : null;

  const perfectCount = sessions.filter(s => s.pct === 100).length;
  const failCount    = sessions.filter(s => s.pct < 40).length;

  // === CELKOVÝ VÝSLEDEK ===
  if (overallPct === 100) {
    tips.push("Perfektní výsledek — ani jedna chyba! Tato látka je zvládnuta na výbornou.");
  } else if (overallPct >= 95) {
    tips.push("Výsledek téměř bez chyby. Látka je pevně zvládnuta a dítě ji umí spolehlivě použít.");
  } else if (grade === 1) {
    tips.push("Výborný výsledek. Látka je dobře zvládnuta, dítě ji chápe a umí ji bez větších potíží použít.");
  } else if (grade === 2 && overallPct >= 85) {
    tips.push("Velmi dobrý výsledek. Drobné chyby se tu a tam vyskytnou, ale látku dítě celkově ovládá dobře.");
  } else if (grade === 2) {
    tips.push("Dobrý výsledek s menšími mezerami. Krátké opakování klíčových pojmů by výsledek ještě posunulo.");
  } else if (grade === 3 && overallPct >= 65) {
    tips.push("Průměrný výsledek — látka je hrubě zvládnuta, ale chyby se opakují. Pravidelné krátké procvičení pomůže.");
  } else if (grade === 3 && overallPct >= 55) {
    tips.push("Výsledek na spodní hranici průměru. Látka není zcela jistá — doporučujeme se k ní pravidelně vracet.");
  } else if (grade === 4 && overallPct >= 45) {
    tips.push("Výsledek je pod průměrem. Je dobré rozdělit látku na menší části a procvičovat postupně.");
  } else if (grade === 4) {
    tips.push("S touto látkou má dítě znatelné potíže. Doporučujeme kratší a časté procvičování zaměřené na konkrétní slabá místa.");
  } else if (grade === 5 && overallPct <= 20) {
    tips.push("Velmi nízký výsledek — látka zatím není pochopena. Doporučujeme projít ji znovu od začátku, ideálně s pomocí rodiče nebo učitele.");
  } else if (grade === 5) {
    tips.push("Látka zatím není zvládnuta. Je vhodné probrat ji znovu od základů a postupovat po malých krocích bez spěchu.");
  }

  // === TREND ===
  if (n >= 4) {
    const newest = sessions.slice(0, Math.ceil(n / 2));
    const oldest = sessions.slice(Math.floor(n / 2));
    const avgNew = newest.reduce((s, x) => s + x.pct, 0) / newest.length;
    const avgOld = oldest.reduce((s, x) => s + x.pct, 0) / oldest.length;
    const diff = avgNew - avgOld;
    if (diff >= 30) tips.push("Výsledky se výrazně zlepšily — dítě udělalo velký pokrok. Procvičování se zřetelně vyplácí.");
    else if (diff >= 15) tips.push("Výsledky se postupem času zlepšují. Látka se pomalu usazuje — to je skvělý znak.");
    else if (diff <= -30) tips.push("Výsledky výrazně klesly. Látka pravděpodobně přestala být čerstvá — doporučujeme krátkou rekapitulaci a nový pokus.");
    else if (diff <= -15) tips.push("Výsledky mírně klesají. Může pomoci kratší, ale pravidelnější procvičování.");
    else if (Math.abs(diff) <= 5 && grade <= 2) tips.push("Výsledky jsou dlouhodobě stabilně dobré — látka je pevně zažitá.");
    else if (Math.abs(diff) <= 5 && grade >= 4) tips.push("Výsledky dlouhodobě stagnují na nízké úrovni. Doporučujeme změnit přístup — například látku procvičovat jiným způsobem nebo kratšími úseky.");
  } else if (n === 3 && lastPct !== null && thirdPct !== null) {
    const diff = lastPct - thirdPct;
    if (diff >= 20) tips.push("Za tři cvičení je vidět zlepšení — dítě se učí a látka mu jde stále lépe.");
    else if (diff <= -20) tips.push("Výsledky ve třech cvičeních mírně klesají. Stojí za to zjistit, co dítěti dělá největší potíže.");
  }

  // === KONZISTENCE ===
  if (n >= 3) {
    if (stdDev >= 30) {
      tips.push("Výsledky jsou velmi nevyrovnané — někdy výborně, jindy špatně. Může jít o vliv nálady, únavy nebo prostředí. Zkuste procvičovat pravidelně ve stejnou dobu a v klidu.");
    } else if (stdDev >= 18) {
      tips.push("Výsledky poměrně kolísají. Zkuste zjistit, za jakých podmínek se dítěti daří nejlépe, a tyto podmínky opakovat.");
    } else if (stdDev <= 6 && grade <= 2) {
      tips.push("Výsledky jsou stabilně dobré bez větších výkyvů — dítě je v této látce sebejisté a spolehlivé.");
    } else if (stdDev <= 6 && grade >= 4) {
      tips.push("Výsledky jsou konzistentně slabé — jde pravděpodobně o systematický problém, ne náhodu. Doporučujeme látku probrat s učitelem.");
    } else if (stdDev <= 10 && grade === 3) {
      tips.push("Výsledky jsou stabilní, ale stále v průměru. Cílené procvičení konkrétních chybných úloh by mohlo posunout výsledek výše.");
    }
  }

  // === NÁPOVĚDA ===
  if (helpRatio === 0 && grade >= 4 && totalAnswers >= 6) {
    tips.push("Dítě nápovědu vůbec nevyužívá, přitom výsledky jsou slabé. Může to znamenat, že spíše hádá než přemýšlí — zkuste se zeptat, jak o úlohách uvažuje.");
  } else if (helpRatio >= 0.6) {
    tips.push("Nápověda se využívala ve více než polovině odpovědí. Látka pravděpodobně ještě není internalizovaná — procvičujte pomaleji a klaste důraz na porozumění, ne rychlost.");
  } else if (helpRatio >= 0.4) {
    tips.push("Nápověda se využívala poměrně často. Je dobré trénovat vybavování bez ní — dítě si zkusí odpovědět samo a až pak se podívá.");
  } else if (helpRatio >= 0.2) {
    tips.push("Nápověda se příležitostně hodila. Je to v pořádku — důležité je, aby ji dítě postupně potřebovalo méně.");
  } else if (helpRatio > 0 && helpRatio < 0.08 && grade <= 2) {
    tips.push("Nápovědu využívalo jen výjimečně. To svědčí o dobré samostatnosti a jistotě v látce.");
  } else if (helpRatio === 0 && grade <= 2 && totalAnswers >= 6) {
    tips.push("Ani jednou nepotřebovalo nápovědu — výborná samostatnost!");
  }

  // === CHYBOVOST ===
  if (wrongRatio >= 0.6) {
    tips.push("Více než polovina odpovědí byla chybná. Doporučujeme látku nejdříve společně projít a teprve pak znovu procvičovat.");
  } else if (wrongRatio >= 0.4) {
    tips.push("Velká část odpovědí byla chybná. Pomůže se u každé chybné odpovědi společně zamyslet, proč byla špatně.");
  } else if (wrongRatio >= 0.25 && grade <= 2) {
    tips.push("I přes dobrý výsledek se vyskytuje čtvrtina chybných odpovědí. Stojí za to zjistit, u kterých typů úloh k tomu dochází.");
  } else if (wrongRatio <= 0.03 && grade <= 2 && totalAnswers >= 8) {
    tips.push("Téměř žádné chyby na velkém počtu úloh — výborná přesnost a jistota v látce.");
  } else if (wrongRatio <= 0.08 && grade <= 2) {
    tips.push("Minimální chybovost — dítě odpovídalo přesně a s jistotou.");
  }

  // === CELKOVÝ ROZSAH (počet úloh) ===
  if (totalAnswers >= 50 && grade <= 2) {
    tips.push(`Za všechna cvičení celkem zodpovědělo ${totalAnswers} úloh s výborným výsledkem — to je pořádný kus práce!`);
  } else if (totalAnswers >= 50 && grade >= 4) {
    tips.push(`Za všechna cvičení proběhlo celkem ${totalAnswers} úloh. I přes velký objem procvičování výsledky zatím nestačí — zkuste jiný způsob výkladu.`);
  } else if (totalAnswers <= 8 && n === 1) {
    tips.push("Cvičení bylo krátké — hodnocení je zatím orientační. Delší nebo opakované procvičení přinese přesnější obrázek.");
  }

  // === POČET CVIČENÍ ===
  if (n === 1) {
    tips.push("Zatím proběhlo jen jedno cvičení. Pro spolehlivé hodnocení doporučujeme látku zopakovat alespoň dvakrát nebo třikrát v různé dny.");
  } else if (n === 2 && grade <= 2) {
    tips.push("Dvě cvičení, oba dobré výsledky — slibný start. Třetí opakování potvrdí, že je látka skutečně zažitá.");
  } else if (n === 2 && grade >= 4) {
    tips.push("Dvě cvičení s nižším výsledkem. Je ještě brzy na závěry — doporučujeme alespoň jedno nebo dvě další procvičení.");
  } else if (n >= 7 && grade <= 2) {
    tips.push("Sedm a více cvičení s dobrými výsledky — tato látka je pevně zvládnuta. Není třeba ji nyní intenzivně procvičovat, stačí občasné zopakování.");
  } else if (n >= 5 && grade >= 4) {
    tips.push("I přes pět a více cvičení výsledky stagnují. Pouhé opakování pravděpodobně nestačí — doporučujeme jiný přístup nebo pomoc učitele.");
  } else if (n >= 4 && grade <= 2) {
    tips.push("Opakované procvičování přineslo ovoce — vytrvalost se zřetelně vyplatila.");
  } else if (n === 3 && grade >= 4) {
    tips.push("Tři cvičení za sebou s nižším výsledkem. Je vhodné zpomalit a zkontrolovat, zda dítě základům skutečně rozumí.");
  }

  // === SKOK V POSLEDNÍM VÝSLEDKU ===
  if (lastPct !== null && prevPct !== null) {
    if (lastPct >= 90 && prevPct < 60) {
      tips.push("Poslední cvičení dopadlo výrazně lépe než předchozí — skvělý skok! Stojí za to zeptat se dítěte, co mu tentokrát pomohlo.");
    } else if (lastPct >= 80 && prevPct < 55) {
      tips.push("Poslední cvičení bylo znatelně lepší. Dítě se posunulo — motivujte ho, aby v tom pokračovalo.");
    } else if (lastPct < 40 && prevPct >= 75) {
      tips.push("Poslední výsledek byl výrazně horší než předchozí. Může jít o špatný den nebo únavu — není třeba panikovat, ale příště situaci sledujte.");
    } else if (lastPct < 55 && prevPct >= 80) {
      tips.push("Poslední výsledek byl horší než obvykle. Může to být výjimka — zkuste zopakovat za pár dní a výsledky porovnat.");
    } else if (lastPct >= 85 && prevPct >= 85) {
      tips.push("Poslední dvě cvičení dopadla výborně — dítě je v látce stabilně dobré.");
    } else if (lastPct < 45 && prevPct < 45) {
      tips.push("Poslední dvě cvičení dopadla slabě. Doporučujeme látku projít společně před dalším procvičováním.");
    }
  }

  // === NEJLEPŠÍ vs. NEJHORŠÍ ===
  if (n >= 3 && bestPct - worstPct >= 40) {
    tips.push(`Rozdíl mezi nejlepším (${bestPct} %) a nejhorším (${worstPct} %) cvičením je velký. Výsledky závisí na podmínkách nebo náladě — zkuste zjistit, co situaci ovlivňuje.`);
  }

  // === PERFEKTNÍ VÝSLEDKY ===
  if (perfectCount >= 3) {
    tips.push(`${perfectCount} ze ${n} cvičení dopadla na 100 % — výjimečná výkonnost, na kterou může být dítě velmi hrdé!`);
  } else if (perfectCount === 2) {
    tips.push("Dvě cvičení dopadla na 100 % — dítě na to opakovaně ukázalo. Skvělý výsledek!");
  } else if (perfectCount === 1 && n >= 3) {
    tips.push("Jedno cvičení dopadlo na 100 % — dítě na to má. Motivujte ho, aby takového výsledku dosáhlo znovu.");
  }

  // === PODÍL SPRÁVNÝCH BEZ NÁPOVĚDY ===
  if (correctRatio >= 0.9 && helpRatio <= 0.05 && totalAnswers >= 10) {
    tips.push("Naprostá většina odpovědí byla správná hned napoprvé bez nápovědy — to je opravdu solidní výkon.");
  } else if (correctRatio <= 0.2 && n >= 2) {
    tips.push("Správných odpovědí bez nápovědy bylo velmi málo. Doporučujeme začít jednodušší formou procvičení nebo si látku nejdříve projít.");
  }

  // === SÉRIE POSLEDNÍCH CVIČENÍ ===
  if (n >= 3 && sessions.slice(0, 3).every(s => s.pct >= 80)) {
    tips.push("Poslední tři cvičení dopadla výborně — dítě je v plné formě a látku ovládá jistě.");
  } else if (n >= 3 && sessions.slice(0, 3).every(s => s.pct < 50)) {
    tips.push("Poslední tři cvičení za sebou dopadla slabě. To stojí za pozornost — doporučujeme zjistit příčinu a případně zpomalit.");
  }

  return tips.slice(0, 1);
}

function formatCzDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return `${d.getDate()}.${d.getMonth() + 1}.`;
}

function sessionCountLabel(n: number): string {
  return `${n} cvičení`;
}

interface Props {
  childId: string;
  skillId: string;
  onClose: () => void;
}

export function SkillDetailModal({ childId, skillId, onClose }: Props) {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [logItems, setLogItems] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);

  const subject = getSkillSubject(skillId) ?? null;
  const subjectMeta = subject ? getSubjectMeta(subject) : null;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data } = await (supabase as any)
        .from("session_logs")
        .select("id, session_id, correct, help_used, error_type, example_id, created_at, question_text, correct_answer")
        .eq("child_id", childId)
        .eq("skill_id", skillId)
        .order("created_at", { ascending: false })
        .limit(500);

      if (cancelled || !data) { setLoading(false); return; }

      // Agregace po sezeních
      const map = new Map<string, { correct: number; helpUsed: number; total: number; date: string }>();
      for (const log of data) {
        const sid = log.session_id as string;
        const prev = map.get(sid) ?? { correct: 0, helpUsed: 0, total: 0, date: log.created_at as string };
        prev.total += 1;
        if (log.correct && !log.help_used) prev.correct += 1;
        if (log.correct && log.help_used) prev.helpUsed += 1;
        map.set(sid, prev);
      }

      const result: SessionSummary[] = Array.from(map.entries()).map(([sessionId, s]) => ({
        sessionId,
        date: s.date,
        correct: s.correct,
        helpUsed: s.helpUsed,
        wrong: s.total - s.correct - s.helpUsed,
        total: s.total,
        pct: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
      }));

      if (!cancelled) setSessions(result);

      // Individuální logy posledního sezení s texty otázek přímo z DB
      const lastSessionId = result[0]?.sessionId;
      if (lastSessionId) {
        const lastLogs = data.filter((l: any) => l.session_id === lastSessionId);
        const items: LogItem[] = [...lastLogs].reverse().map((l: any) => ({
          id: l.id as string,
          correct: l.correct as boolean,
          helpUsed: l.help_used as boolean,
          errorType: l.error_type as string | null,
          question: l.question_text ?? undefined,
          correctAnswer: l.correct_answer ?? undefined,
        }));
        if (!cancelled) setLogItems(items);
      }

      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [childId, skillId]);

  // Souhrnný panel = pouze poslední sezení
  const last = sessions[0] ?? null;
  const lastGrade = last ? pctToGrade(last.pct) : null;
  const gMeta = lastGrade !== null ? GRADE_META[lastGrade] : null;
  const recommendations = last && lastGrade !== null
    ? getRecommendations(sessions, last.pct, lastGrade)
    : [];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          {/* Předmět + název dovednosti */}
          <div className="flex items-center gap-3 mb-1">
            {subjectMeta && (
              <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0">
                <IllustrationImg
                  src={subjectMeta.image ?? ""}
                  className="h-9 w-9 object-contain"
                  fallback={<span className="text-2xl">{subjectMeta.emoji ?? "📚"}</span>}
                />
              </div>
            )}
            <div>
              {subjectMeta?.label && (
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide leading-tight mb-0.5">
                  {subjectMeta.label}
                </p>
              )}
              <DialogTitle className="text-base leading-snug">{getReadableSkillName(skillId)}</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        {loading ? (
          <p className="text-center text-sm text-muted-foreground py-8">Načítám výsledky…</p>
        ) : sessions.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">Žádné záznamy k zobrazení.</p>
        ) : (
          <div className="space-y-4">
            {/* Souhrnný panel — poslední sezení */}
            {last && lastGrade !== null && gMeta && (
              <div className={`rounded-2xl border-2 p-4 ${gMeta.bg} ${gMeta.border}`}>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-2">
                  Poslední cvičení · {formatCzDate(last.date)}
                </p>
                <div className="flex items-center gap-4">
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-3xl font-bold border-2 shrink-0 bg-white ${gMeta.color} ${gMeta.border}`}>
                    {lastGrade}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-lg leading-tight ${gMeta.color}`}>{gMeta.label}</p>
                    <span className={`text-2xl font-bold ${gMeta.color}`}>{last.pct} %</span>
                  </div>
                </div>
                <div className="flex gap-4 mt-3 pt-3 border-t border-black/10">
                  <span className="text-green-700 font-semibold text-sm flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> {last.correct} správně
                  </span>
                  {last.helpUsed > 0 && (
                    <span className="text-amber-600 font-semibold text-sm flex items-center gap-1">
                      <HelpCircle className="h-4 w-4" /> {last.helpUsed} s nápovědou
                    </span>
                  )}
                  {last.wrong > 0 && (
                    <span className="text-red-600 font-semibold text-sm flex items-center gap-1">
                      <XCircle className="h-4 w-4" /> {last.wrong} chybně
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Historie cvičení */}
            {sessions.length > 1 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Historie · {sessionCountLabel(sessions.length)}
                </p>
                <div className="space-y-1.5">
                  {sessions.slice(1).map(s => {
                    const g = pctToGrade(s.pct);
                    const gm = GRADE_META[g];
                    return (
                      <div key={s.sessionId} className={`rounded-xl border px-3 py-2 flex items-center gap-3 ${gm.bg} ${gm.border}`}>
                        <span className={`inline-flex items-center justify-center h-7 w-7 rounded-full text-[11px] font-bold border bg-white shrink-0 ${gm.color} ${gm.border}`}>
                          {g}
                        </span>
                        <span className={`font-semibold text-sm ${gm.color}`}>{s.pct} %</span>
                        <div className="flex items-center gap-2 ml-auto text-xs">
                          <span className="text-green-600 flex items-center gap-0.5"><CheckCircle2 className="h-3 w-3" />{s.correct}</span>
                          {s.helpUsed > 0 && <span className="text-amber-500 flex items-center gap-0.5"><HelpCircle className="h-3 w-3" />{s.helpUsed}</span>}
                          {s.wrong > 0 && <span className="text-red-500 flex items-center gap-0.5"><XCircle className="h-3 w-3" />{s.wrong}</span>}
                          <span className="text-muted-foreground">{formatCzDate(s.date)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Co cvičil */}
            {logItems.length > 0 && (() => {
              const wrong   = logItems.filter(l => !l.correct);
              const helped  = logItems.filter(l => l.correct && l.helpUsed);
              const correct = logItems.filter(l => l.correct && !l.helpUsed);

              const renderGroup = (
                items: LogItem[],
                icon: React.ReactNode,
                label: string,
                rowCls: string,
                dotCls: string,
              ) => items.length === 0 ? null : (
                <div className="space-y-1">
                  <p className={`text-[11px] font-bold uppercase tracking-wide flex items-center gap-1 ${dotCls}`}>
                    {icon} {label} ({items.length})
                  </p>
                  {items.map(l => (
                    <div key={l.id} className={`rounded-xl px-3 py-2 text-xs ${rowCls}`}>
                      {l.question
                        ? <><span className="font-medium">{l.question}</span>
                            {!l.correct && l.correctAnswer && (
                              <span className="block text-muted-foreground mt-0.5">
                                Správná odpověď: <span className="font-semibold">{l.correctAnswer}</span>
                              </span>
                            )}
                          </>
                        : <span className="text-muted-foreground italic">
                            {!l.correct ? "Chybná odpověď" : l.helpUsed ? "Správně s nápovědou" : "Správně"}
                          </span>
                      }
                    </div>
                  ))}
                </div>
              );

              return (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Co cvičil</p>
                  {renderGroup(wrong,   <XCircle className="h-3 w-3" />,      "Chybně",         "bg-red-50 border border-red-100 text-red-800",      "text-red-500")}
                  {renderGroup(helped,  <HelpCircle className="h-3 w-3" />,   "S nápovědou",    "bg-amber-50 border border-amber-100 text-amber-800", "text-amber-500")}
                  {renderGroup(correct, <CheckCircle2 className="h-3 w-3" />, "Správně",        "bg-green-50 border border-green-100 text-green-800", "text-green-600")}
                </div>
              );
            })()}

            {/* Doporučení */}
            {recommendations.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Doporučení</p>
                {recommendations.map((tip, i) => (
                  <p key={i} className="text-sm text-slate-700 leading-snug bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                    {tip}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
