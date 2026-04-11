import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, Loader2, Sparkles, ArrowLeft } from "lucide-react";
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

export function AdminAIChat({ grade, subject, category, topic, skillId, skillDetail, open, onOpenChange, initialPrompt, onInitialPromptConsumed, onProposalsReady, availableSubjects }: AdminAIChatProps) {
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
      const accessToken = session?.access_token;
      if (!accessToken) throw new Error("Nejste přihlášen/a");

      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-curriculum`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            messages: newMessages,
            grade,
            subject,
            category,
            topic,
            skillId,
            skillDetail: skillDetail || null,
          }),
        }
      );

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Chyba serveru" }));
        throw new Error(err.error || `HTTP ${resp.status}`);
      }

      const data = await resp.json();
      const assistantContent = data.reply || "Žádná odpověď.";

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
                  <div className="text-center text-muted-foreground text-sm py-8 space-y-2">
                    <Bot className="h-8 w-8 mx-auto opacity-50" />
                    <p>Řekněte mi, co chcete vytvořit.</p>
                    <p className="text-xs">
                      Např: "Navrhni matematiku pro 4. ročník" nebo "Přidej zlomky do 5. ročníku"
                    </p>
                  </div>
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
