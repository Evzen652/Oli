import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAllTopics } from "@/lib/contentRegistry";
import { getTierTasks } from "@/lib/levelCoverage";
import { WorkedExample } from "@/components/WorkedExample";
import type { PracticeTask, TopicMetadata } from "@/lib/types";

/**
 * Vývojářský náhled tématu — `/dev/tema/:id`, jen v `npm run dev`.
 *
 * Proč: ověření obsahu proklikáváním (ročník → předmět → okruh → téma →
 * výklad → úloha) stálo víc času než práce sama a úlohy L2/L3 se v běžném
 * sezení skoro nedají vyvolat. Tady je všechno na jedné stránce: výklad,
 * ukázky úloh na všech úrovních s obrázky, možnostmi, zdůvodněním,
 * nápovědami a vysvětlením.
 *
 * Do produkce se nedostane: `App.tsx` ji načítá líně za `import.meta.env.DEV`,
 * který Vite v buildu nahradí `false`, a celý import vypadne.
 */
export default function DevTopicPreview() {
  const { id } = useParams();
  const topics = getAllTopics();
  const topic = id ? topics.find((t) => t.id === id) : undefined;

  return (
    <div className="min-h-screen bg-background px-4 py-6 text-foreground">
      <div className="mx-auto max-w-3xl space-y-6">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Dev náhled · <Link className="underline" to="/dev/tema">všechna témata</Link>
        </p>
        {topic ? <TopicView topic={topic} /> : <TopicList topics={topics} missing={id} />}
      </div>
    </div>
  );
}

function TopicList({ topics, missing }: { topics: readonly TopicMetadata[]; missing?: string }) {
  const [q, setQ] = useState("");
  const [grade, setGrade] = useState("");
  const shown = topics.filter((t) =>
    (!grade || String(t.gradeRange[0]) === grade) &&
    (!q || `${t.id} ${t.title} ${t.studentTitle ?? ""}`.toLowerCase().includes(q.toLowerCase())),
  );
  return (
    <div className="space-y-4">
      {missing && <p className="rounded-lg bg-destructive/10 p-3 text-destructive">Téma „{missing}" neexistuje.</p>}
      <div className="flex gap-2">
        <input
          autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Hledat podle ID nebo názvu…"
          className="flex-1 rounded-lg border border-border bg-card px-3 py-2"
        />
        <select value={grade} onChange={(e) => setGrade(e.target.value)} className="rounded-lg border border-border bg-card px-2">
          <option value="">Ročník</option>
          {[2, 3, 4, 5, 6].map((g) => <option key={g} value={g}>{g}.</option>)}
        </select>
      </div>
      <p className="text-sm text-muted-foreground">{shown.length} z {topics.length}</p>
      <ul className="divide-y divide-border rounded-xl border border-border bg-card">
        {shown.map((t) => (
          <li key={t.id}>
            <Link to={`/dev/tema/${t.id}`} className="block px-4 py-2 hover:bg-muted">
              <span className="font-semibold">{t.gradeRange[0]}. · {t.title}</span>
              <span className="block truncate text-xs text-muted-foreground">{t.id}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TopicView({ topic }: { topic: TopicMetadata }) {
  const [seed, setSeed] = useState(0);
  const [perLevel, setPerLevel] = useState(4);
  // `seed` jen vynutí nové volání generátorů („Přegenerovat").
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tiers = useMemo(() => getTierTasks(topic), [topic, seed]);
  const h = topic.helpTemplate;

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-extrabold">{topic.title}</h1>
        <p className="text-sm text-muted-foreground">
          {topic.gradeRange[0]}. ročník · {topic.subject} · {topic.category} · {topic.topic} · inputType <code>{topic.inputType}</code>
        </p>
        <p className="text-xs text-muted-foreground break-all">{topic.id}{topic.rvpNodeId && ` · RVP ${topic.rvpNodeId}`}</p>
        <p className="pt-2">{topic.briefDescription}</p>
      </header>

      <section className="space-y-3 rounded-2xl border border-border bg-card p-5">
        <h2 className="text-lg font-bold">Výklad („Co je dobré vědět")</h2>
        <p>{h.hint}</p>
        {h.steps.length > 0 && <ol className="list-decimal list-inside space-y-1">{h.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>}
        <p><b>Příklad (záloha):</b> {h.example}</p>
        <p><b>Častá chyba:</b> {h.commonMistake}</p>
        {h.visualExamples?.length ? <p className="text-sm text-muted-foreground">visualExamples: {h.visualExamples.length}</p> : null}
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={() => setSeed((s) => s + 1)} className="rounded-full border border-border bg-card px-4 py-2 font-semibold hover:bg-muted">
          Přegenerovat
        </button>
        <label className="text-sm">
          Úloh na úroveň{" "}
          <select value={perLevel} onChange={(e) => setPerLevel(Number(e.target.value))} className="rounded border border-border bg-card px-1">
            {[2, 4, 8, 16].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
      </div>

      {([["L1", tiers.l1], ["L2", tiers.l2], ["L3", tiers.l3]] as const).map(([name, list]) => (
        <section key={name} className="space-y-4">
          <h2 className="text-xl font-extrabold">
            {name} <span className="text-sm font-normal text-muted-foreground">· odlišných úloh z jednoho volání: {list.length}</span>
          </h2>
          {list.length === 0 && <p className="text-destructive">Úroveň nemá žádné odlišné úlohy.</p>}
          {list.slice(0, perLevel).map((t, i) => <TaskCard key={i} task={t} topic={topic} />)}
        </section>
      ))}
    </div>
  );
}

function TaskCard({ task, topic }: { task: PracticeTask; topic: TopicMetadata }) {
  const chybi = [
    !task.hints?.[0] && "malá nápověda",
    !task.hints?.[1] && "velká nápověda",
    !task.explanation && !task.solutionSteps?.length && "vysvětlení",
  ].filter(Boolean);
  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-5">
      <WorkedExample task={task} topic={topic} intro={false} />
      <div className="space-y-1 border-t border-border pt-3 text-sm">
        {task.hints?.[0] && <p><b>Nápověda 1:</b> {task.hints[0]}</p>}
        {task.hints?.[1] && <p><b>Nápověda 2:</b> {task.hints[1]}</p>}
        {/* U zápisu čísla nejsou možnosti, takže `WorkedExample` diagnostiku
            chyb neukáže — a ta je tu jediný zpětnovazební kanál. Vypíšeme ji,
            ať se dá při čtení obsahu zkontrolovat. */}
        {!task.options?.length && task.optionFeedback && Object.keys(task.optionFeedback).length > 0 && (
          <div className="pt-1">
            <p className="font-semibold">Diagnostika napsané chyby:</p>
            <ul className="list-disc list-inside text-muted-foreground">
              {Object.entries(task.optionFeedback).map(([hodnota, proc]) => (
                <li key={hodnota}><b>{hodnota}</b> — {proc}</li>
              ))}
            </ul>
          </div>
        )}
        {chybi.length > 0 && <p className="font-semibold text-destructive">Chybí: {chybi.join(", ")}</p>}
      </div>
    </div>
  );
}
