import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Bot, Search } from "lucide-react";
import { AdminAIChat, type CurriculumProposal, type SkillDetail } from "@/components/AdminAIChat";
import { ExerciseValidator } from "@/components/ExerciseValidator";
import type { Grade } from "@/lib/types";

interface AdminAIPanelProps {
  // Context props (forwarded to AdminAIChat)
  grade: Grade | null;
  subject: string | null;
  category?: string | null;
  topic?: string | null;
  skillId?: string | null;
  skillDetail?: SkillDetail | null;
  // Sheet control
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Tab control
  defaultTab?: "create" | "check";
  // Forwarded callbacks
  initialPrompt?: string | null;
  onInitialPromptConsumed?: () => void;
  onProposalsReady: (proposals: CurriculumProposal[], explanation: string) => void;
  availableSubjects?: string[];
}

/**
 * Unified AI panel — single entry point for both:
 *   • "Tvořit"      — chat / wizard for creating curriculum (was: AI Asistent)
 *   • "Zkontrolovat"— bulk exercise validator             (was: QA Agent / Kontrola cvičení)
 *
 * Both child components support `hideSheet={true}` so they render their body only.
 */
export function AdminAIPanel({
  grade,
  subject,
  category,
  topic,
  skillId,
  skillDetail,
  open,
  onOpenChange,
  defaultTab = "create",
  initialPrompt,
  onInitialPromptConsumed,
  onProposalsReady,
  availableSubjects,
}: AdminAIPanelProps) {
  const [tab, setTab] = useState<"create" | "check">(defaultTab);

  // Auto-switch to "create" tab when an initialPrompt arrives (smart suggestion clicks)
  if (initialPrompt && tab !== "create") {
    setTab("create");
  }

  const checkDisabled = !grade;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl flex flex-col p-0 gap-0">
        <SheetHeader className="p-4 pb-0 border-b">
          <SheetTitle className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-primary" />
            AI asistent
          </SheetTitle>
          <Tabs value={tab} onValueChange={(v) => setTab(v as "create" | "check")} className="w-full">
            <TabsList className="w-full grid grid-cols-2 h-9">
              <TabsTrigger value="create" className="gap-1.5 text-sm">
                <Bot className="h-4 w-4" />
                Tvořit
              </TabsTrigger>
              <TabsTrigger
                value="check"
                disabled={checkDisabled}
                className="gap-1.5 text-sm"
                title={checkDisabled ? "Vyberte ročník v hlavičce" : undefined}
              >
                <Search className="h-4 w-4" />
                Zkontrolovat
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </SheetHeader>

        {/* Both bodies are kept mounted so state persists when switching tabs */}
        <div className="flex-1 min-h-0 relative">
          {/* Tvořit */}
          <div className={`absolute inset-0 flex flex-col ${tab === "create" ? "" : "hidden"}`}>
            <AdminAIChat
              grade={grade}
              subject={subject}
              category={category}
              topic={topic}
              skillId={skillId}
              skillDetail={skillDetail}
              open={open && tab === "create"}
              onOpenChange={onOpenChange}
              initialPrompt={initialPrompt}
              onInitialPromptConsumed={onInitialPromptConsumed}
              onProposalsReady={onProposalsReady}
              availableSubjects={availableSubjects}
              hideSheet
            />
          </div>

          {/* Zkontrolovat */}
          <div className={`absolute inset-0 flex flex-col ${tab === "check" ? "" : "hidden"}`}>
            {grade && (
              <ExerciseValidator
                open={open && tab === "check"}
                onOpenChange={onOpenChange}
                grade={grade}
                hideSheet
              />
            )}
            {!grade && (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center text-muted-foreground gap-2">
                <Search className="h-8 w-8 opacity-40" />
                <p className="text-sm">Pro kontrolu cvičení vyberte ročník v hlavičce.</p>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
