import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { MessageCircleQuestion, Send, Loader2, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import type { TopicMetadata, PracticeTask } from "@/lib/types";

interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  topic: TopicMetadata;
  currentTask?: PracticeTask | null;
  /** "practice" v PRACTICE fázi — server pak filtruje leak. Jinak "explain". */
  phase: "practice" | "explain";
  /** Max počet dotazů per task — soft nudge. */
  maxQuestions?: number;
}

/**
 * TutorChat — konverzační follow-up tutor (Fáze 7).
 *
 * Stateless single-shot: každý dotaz volá `tutor-chat` edge fn s krátkou
 * historií posledních 6 turnů. Žádný DB zápis, žádný session state — když
 * žák zavře dialog, historie se zapomene (efficiency principle).
 *
 * Hard guardrails na backendu:
 *  - phase=practice → AI nesmí prozradit correct_answer
 *  - max 4 věty, jen čeština, drž se tématu
 *
 * UX: collapsible panel pod taskem. Po 3 otázkách nudge "Zkus odpovědět".
 */
export function TutorChat({ topic, currentTask, phase, maxQuestions = 5 }: Props) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset chat když se změní task — dotazy jsou vázané na konkrétní úlohu
  useEffect(() => {
    setHistory([]);
    setInput("");
  }, [currentTask?.question, topic.id]);

  // Auto-scroll na konec
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, loading]);

  const userTurnsCount = history.filter((t) => t.role === "user").length;
  const reachedLimit = userTurnsCount >= maxQuestions;

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    // Optimistický append
    const newHistory: ChatTurn[] = [...history, { role: "user", content: text }];
    setHistory(newHistory);
    setInput("");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("tutor-chat", {
        body: {
          skill_label: topic.title,
          subject: topic.subject,
          category: topic.category,
          topic: topic.topic,
          grade_min: topic.gradeRange?.[0],
          phase,
          current_task: currentTask
            ? { question: currentTask.question, correct_answer: currentTask.correctAnswer }
            : undefined,
          history: newHistory.slice(0, -1), // bez aktuální user message — tu posíláme zvlášť
          user_message: text,
        },
      });

      if (error) throw error;
      const reply = data?.reply ?? "";
      if (!reply) throw new Error("Empty reply");

      setHistory((prev) => [...prev, { role: "assistant", content: reply }]);
      if (data?.blocked) {
        // Soft notice — zpráva už je mírnější, jen toast pro debug
        console.info("[TutorChat] Server blocked answer leak");
      }
    } catch (e: any) {
      // Vrať zpět — odeber přidanou user message
      setHistory((prev) => prev.slice(0, -1));
      setInput(text);
      toast({
        description: e?.message ?? "Tutor teď nemůže odpovědět. Zkus statickou nápovědu.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className={`w-full text-base border-2 gap-2 rounded-xl transition-all duration-200 ${
            open
              ? "bg-sky-50 border-sky-300 text-sky-700 hover:bg-sky-100"
              : "bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100 hover:border-sky-300 hover:shadow-md hover:scale-[1.02]"
          }`}
        >
          {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          <MessageCircleQuestion className="w-5 h-5" />
          {open ? "Zavřít chat s Oli" : "Nerozumím — zeptat se Oli"}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-4 rounded-xl border-2 border-sky-200 bg-sky-50/40 p-4 animate-fade-in">
        {/* Chat scroll area */}
        <div
          ref={scrollRef}
          className="space-y-3 max-h-72 overflow-y-auto pr-1"
        >
          {history.length === 0 && !loading && (
            <p className="text-sm text-muted-foreground italic">
              {phase === "practice"
                ? "Zeptej se na cokoli k téhle úloze. Oli ti odpověď neprozradí — pomůže navést."
                : "Zeptej se na cokoli k tomuto tématu."}
            </p>
          )}

          {history.map((turn, i) => (
            <div
              key={i}
              className={turn.role === "user" ? "flex justify-end" : "flex justify-start gap-2"}
            >
              {turn.role === "assistant" && (
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sky-100 text-sky-700">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
              )}
              <div
                className={`rounded-2xl px-3.5 py-2 text-sm leading-relaxed max-w-[85%] ${
                  turn.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-sky-200 text-foreground"
                }`}
              >
                {turn.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-sky-600" />
              Oli přemýšlí…
            </div>
          )}
        </div>

        {/* Limit nudge */}
        {reachedLimit && (
          <p className="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            Už jsi se zeptal/a {userTurnsCount}×. Zkus odpovědět — chyba není problém, je to součást učení.
          </p>
        )}

        {/* Input */}
        <div className="mt-3 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={reachedLimit ? "Limit dotazů na úlohu vyčerpán" : "Napiš dotaz…"}
            disabled={loading || reachedLimit}
            className="flex-1 rounded-xl text-sm bg-card"
            maxLength={500}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || loading || reachedLimit}
            className="rounded-xl gap-1.5"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
