import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, Loader2, Sparkles, ArrowLeft, Search, PlusCircle, Eye, Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CurriculumWizard } from "@/components/CurriculumWizard";
import type { Grade } from "@/lib/types";

export interface CurriculumProposal {
  type: "subject" | "category" | "topic" | "skill";
  action: "create" | "update" | "delete";
  data: Record<string, unknown>;
}

export interface ParsedAIResponse {
  proposals: CurriculumProposal[];
  explanation: string;
}

export interface SkillDetail {
  name: string;
  code_skill_id: string;
  brief_description?: string | null;
  goals?: string[];
  boundaries?: string[];
  keywords?: string[];
  help_hint?: string | null;
  help_example?: string | null;
  help_common_mistake?: string | null;
  help_steps?: string[];
  grade_min?: number;
  grade_max?: number;
  session_task_count?: number;
  input_type?: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface AdminAIChatProps {
  grade: Grade | null;
  subject: string | null;
  category?: string | null;
  topic?: string | null;
  skillId?: string | null;
  skillDetail?: SkillDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPrompt?: string | null;
  onInitialPromptConsumed?: () => void;
  onProposalsReady: (proposals: CurriculumProposal[], explanation: string) => void;
  /** Available subjects for the wizard dropdown */
  availableSubjects?: string[];
  /** When true, renders body only (without Sheet wrapper) — for embedding in AdminAIPanel */
  hideSheet?: boolean;
}

function parseProposals(text: string): ParsedAIResponse | null {
  const jsonMatch = text.match(/```json\s*([\s\S]*?)```/);
  if (!jsonMatch) return null;
  try {
    const parsed = JSON.parse(jsonMatch[1]);
    if (parsed.proposals && Array.isArray(parsed.proposals)) {
      return { proposals: parsed.proposals, explanation: parsed.explanation || "" };
    }
  } catch {
    // not valid JSON yet
  }
  return null;
}

export function AdminAIChat({ grade, subject, category, topic, skillId, skillDetail, open, onOpenChange, initialPrompt, onInitialPromptConsumed, onProposalsReady, availableSubjects, hideSheet }: AdminAIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [view, setView] = useState<"wizard" | "chat">("wizard");
  const scrollRef = useRef<HTMLDivElement>(null);
  const pendingPromptRef = useRef<string | null>(null);

  // Reset to wizard when sheet closes
  useEffect(() => {
    if (!open) {
      // Reset view to wizard when closed (if no messages)
      if (messages.length === 0) setView("wizard");
    }
  }, [open, messages.length]);

  // Handle initial prompt
  useEffect(() => {
    if (initialPrompt && open && !isStreaming) {
      pendingPromptRef.current = initialPrompt;
      onInitialPromptConsumed?.();
    }
  }, [initialPrompt, open]);

  useEffect(() => {
    if (pendingPromptRef.current && open && !isStreaming) {
      const prompt = pendingPromptRef.current;
      pendingPromptRef.current = null;
      setInput("");
      setView("chat");
      sendMessageWithText(prompt);
    }
  }, [open, isStreaming]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessageWithText = async (text: string) => {
    if (!text.trim() || isStreaming) return;

    const userMsg: ChatMessage = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsStreaming(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Nejste přihlášen/a — přihlaste se prosím znovu.");

      // Použít supabase.functions.invoke — automaticky řeší auth, CORS,
      // a vrací srozumitelnější chybové hlášky (rozliší 404/500/network).
      const { data, error: invokeError } = await supabase.functions.invoke<{
        reply?: string;
        error?: string;
      }>("ai-curriculum", {
        body: {
          messages: newMessages,
          grade,
          subject,
          category,
          topic,
          skillId,
          skillDetail: skillDetail || null,
        },
      });

      if (invokeError) {
        // FunctionsHttpError / FunctionsRelayError / FunctionsFetchError
        const status = (invokeError as { context?: { status?: number } }).context?.status;
        if (status === 404) {
          throw new Error(
            "Edge funkce 'ai-curriculum' není nasazena. Spusťte: " +
            "npx supabase functions deploy ai-curriculum",
          );
        }
        if (status === 401 || status === 403) {
          throw new Error("Nemáte přístup — pouze admin může používat AI asistenta.");
        }
        if (status === 500) {
          // Pokus o přečtení error message z odpovědi
          const ctx = (invokeError as { context?: { json?: () => Promise<{ error?: string }> } }).context;
          const body = await ctx?.json?.().catch(() => null);
          if (body?.error?.includes("LOVABLE_API_KEY")) {
            throw new Error(
              "AI brána není nakonfigurována. V Supabase projektu chybí " +
              "LOVABLE_API_KEY (Settings → Edge Functions → Secrets).",
            );
          }
          throw new Error(body?.error || "Chyba serveru (500). Zkontrolujte logy edge funkce.");
        }
        throw new Error(
          invokeError.message || "Nepodařilo se spojit s AI službou. Zkuste to prosím znovu.",
        );
      }

      if (data?.error) throw new Error(data.error);
      const assistantContent = data?.reply || "Žádná odpověď.";

      setMessages((prev) => [...prev, { role: "assistant", content: assistantContent }]);

      const parsed = parseProposals(assistantContent);
      if (parsed && parsed.proposals.length > 0) {
        onProposalsReady(parsed.proposals, parsed.explanation);
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "Neznámá chyba";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `❌ Chyba: ${errorMsg}` },
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleWizardGenerate = (prompt: string) => {
    setView("chat");
    sendMessageWithText(prompt);
  };

  const contextLabel = [
    grade ? `${grade}. ročník` : null,
    subject || null,
    category || null,
    topic || null,
  ]
    .filter(Boolean)
    .join(" · ");

  // Internal body — view switcher (wizard / chat) without Sheet wrapper
  const body = (
    <>
      {view === "wizard" ? (
        <ScrollArea className="flex-1">
          <CurriculumWizard
            currentGrade={grade}
            currentSubject={subject}
            currentCategory={category || null}
            currentTopic={topic || null}
            availableSubjects={availableSubjects}
            onGenerate={handleWizardGenerate}
            onSwitchToChat={() => setView("chat")}
          />
        </ScrollArea>
      ) : (
        <>
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.length === 0 && (
                <ChatEmptyState
                  grade={grade}
                  subject={subject}
                  category={category || null}
                  topic={topic || null}
                  onPick={(prompt) => sendMessageWithText(prompt)}
                />
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground whitespace-pre-wrap"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <AssistantMessage content={msg.content} />
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
              {isStreaming && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-3 py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t p-4 space-y-2">
            <Textarea
              placeholder="Napište instrukci pro AI..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessageWithText(input);
                }
              }}
              rows={2}
              className="resize-none"
            />
            <Button
              onClick={() => sendMessageWithText(input)}
              disabled={!input.trim() || isStreaming}
              className="w-full gap-2"
            >
              <Send className="h-4 w-4" />
              Odeslat
            </Button>
          </div>
        </>
      )}
    </>
  );

  // If used standalone, wrap in Sheet + trigger.
  // If hideSheet=true (used inside AdminAIPanel), render only the body.
  if (hideSheet) {
    return (
      <div className="flex flex-col h-full">
        {contextLabel && (
          <div className="px-4 pt-3 pb-2 border-b">
            <Badge variant="secondary" className="w-fit">{contextLabel}</Badge>
          </div>
        )}
        {body}
      </div>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button className="gap-2" variant="default">
          <Sparkles className="h-4 w-4" />
          AI Asistent
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col p-0">
        <SheetHeader className="p-4 pb-2 border-b">
          <SheetTitle className="flex items-center gap-2">
            {view === "chat" && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setView("wizard")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <Bot className="h-5 w-5" />
            {view === "wizard" ? "Průvodce kurikulem" : "Kurikulum AI"}
          </SheetTitle>
          {contextLabel && (
            <Badge variant="secondary" className="w-fit">{contextLabel}</Badge>
          )}
        </SheetHeader>
        {body}
      </SheetContent>
    </Sheet>
  );
}

/** Renders assistant message with markdown, stripping JSON blocks */
function AssistantMessage({ content }: { content: string }) {
  const cleaned = content.replace(/```json[\s\S]*?```/g, "📋 *[Návrh vygenerován — viz formulář]*");
  return (
    <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground prose-headings:mt-3 prose-headings:mb-1 prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5">
      <ReactMarkdown>{cleaned}</ReactMarkdown>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// ChatEmptyState — context-aware suggestion chips
// ══════════════════════════════════════════════════════
interface Suggestion {
  label: string;
  prompt: string;
  icon: React.ReactNode;
}

function buildSuggestions(
  grade: Grade | null,
  subject: string | null,
  category: string | null,
  topic: string | null,
): Suggestion[] {
  const gradeCtx = grade ? ` pro ${grade}. ročník` : "";

  // Most specific context first
  if (topic && category && subject) {
    return [
      {
        label: "Přidej podtémata",
        icon: <PlusCircle className="h-3 w-3" />,
        prompt: `Pro téma "${topic}" (${category}, ${subject})${gradeCtx}: Navrhni nová podtémata s cíli, hranicemi, klíčovými slovy a kompletní nápovědou.`,
      },
      {
        label: "Zkontroluj nápovědy",
        icon: <Eye className="h-3 w-3" />,
        prompt: `Zkontroluj nápovědy všech podtémat v tématu "${topic}" (${category}, ${subject}): neprozrazují odpověď? Jsou kroky logické?`,
      },
      {
        label: "Vygeneruj cvičení",
        icon: <Sparkles className="h-3 w-3" />,
        prompt: `Vygeneruj 5-8 cvičení pro každé podtéma v tématu "${topic}" (${category}, ${subject})${gradeCtx}.`,
      },
    ];
  }

  if (category && subject) {
    return [
      {
        label: "Doplň chybějící témata",
        icon: <PlusCircle className="h-3 w-3" />,
        prompt: `Pro okruh "${category}" (${subject})${gradeCtx}: Navrhni chybějící témata podle RVP.`,
      },
      {
        label: "Zkontroluj pořadí",
        icon: <Eye className="h-3 w-3" />,
        prompt: `Zkontroluj didaktické pořadí témat v okruhu "${category}" (${subject}). Je pořadí logické od jednodušších ke složitějším?`,
      },
      {
        label: "Vylepši popisy",
        icon: <Lightbulb className="h-3 w-3" />,
        prompt: `Vylepši motivační popisy témat v okruhu "${category}" (${subject})${gradeCtx}. Musí být stručné a věkově přiměřené.`,
      },
    ];
  }

  if (subject) {
    return [
      {
        label: "Co chybí?",
        icon: <Search className="h-3 w-3" />,
        prompt: `Analyzuj existující obsah předmětu "${subject}"${gradeCtx} a najdi: chybějící okruhy, dovednosti bez nápověd, nekonzistence.`,
      },
      {
        label: "Doplň okruhy",
        icon: <PlusCircle className="h-3 w-3" />,
        prompt: `Pro předmět "${subject}"${gradeCtx}: Navrhni chybějící okruhy a témata podle RVP.`,
      },
      {
        label: "Pokrytí ročníků",
        icon: <Eye className="h-3 w-3" />,
        prompt: `Analyzuj předmět "${subject}" a zkontroluj, zda má každý ročník dostatečné pokrytí témat. Označ mezery a navrhni doplnění.`,
      },
    ];
  }

  // No context — general suggestions
  return [
    {
      label: "Navrhni matematiku",
      icon: <Sparkles className="h-3 w-3" />,
      prompt: `Navrhni kompletní strukturu předmětu "matematika"${gradeCtx}. Zahrň okruhy, témata a dovednosti.`,
    },
    {
      label: "Navrhni češtinu",
      icon: <Sparkles className="h-3 w-3" />,
      prompt: `Navrhni kompletní strukturu předmětu "čeština"${gradeCtx}. Zahrň pravopis, mluvnici a diktáty.`,
    },
    {
      label: "Co kurikulu chybí?",
      icon: <Search className="h-3 w-3" />,
      prompt: `Analyzuj existující kurikulum${gradeCtx} a identifikuj chybějící okruhy, témata a nápovědy podle RVP.`,
    },
  ];
}

function ChatEmptyState({
  grade, subject, category, topic, onPick,
}: {
  grade: Grade | null;
  subject: string | null;
  category: string | null;
  topic: string | null;
  onPick: (prompt: string) => void;
}) {
  const suggestions = buildSuggestions(grade, subject, category, topic);

  return (
    <div className="space-y-4 py-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
          <Bot className="h-6 w-6 text-primary" />
        </div>
        <p className="text-sm font-medium text-foreground">Co chcete udělat?</p>
        <p className="text-xs text-muted-foreground">Vyberte návrh níže nebo napište vlastní</p>
      </div>
      <div className="space-y-2">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onPick(s.prompt)}
            className="w-full text-left rounded-lg border bg-background hover:bg-accent hover:border-primary/50 transition-colors p-3 group"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-primary group-hover:scale-110 transition-transform">
                {s.icon}
              </span>
              <span className="text-sm font-medium text-foreground">{s.label}</span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">{s.prompt}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
