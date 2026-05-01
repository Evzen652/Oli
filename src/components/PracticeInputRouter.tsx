import type { PracticeTask, TopicMetadata } from "@/lib/types";
import { FractionInput } from "@/components/FractionInput";
import { NumberInput } from "@/components/NumberInput";
import { SelectOneInput } from "@/components/SelectOneInput";
import { DragOrderInput } from "@/components/DragOrderInput";
import { FillBlankInput } from "@/components/FillBlankInput";
import { MatchPairsInput } from "@/components/MatchPairsInput";
import { MultiSelectInput } from "@/components/MultiSelectInput";
import { CategorizeInput } from "@/components/CategorizeInput";
import { ImageSelectInput } from "@/components/ImageSelectInput";
import { DiagramLabelInput } from "@/components/DiagramLabelInput";
import { ChemicalBalanceInput } from "@/components/ChemicalBalanceInput";
import { TimelineInput } from "@/components/TimelineInput";
import { FormulaBuilderInput } from "@/components/FormulaBuilderInput";
import { EssayInput } from "@/components/EssayInput";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface PracticeInputRouterProps {
  topic: TopicMetadata;
  currentTask: PracticeTask | undefined;
  userInput: string;
  loading: boolean;
  onUserInputChange: (value: string) => void;
  onAnswerSubmit: (answer: string) => void;
  onTextSubmit: () => void;
}

export function PracticeInputRouter({
  topic,
  currentTask,
  userInput,
  loading,
  onUserInputChange,
  onAnswerSubmit,
  onTextSubmit,
}: PracticeInputRouterProps) {
  // Per-task override: if task carries data for a specific input type, use it
  // Doménové typy s největší specifickou strukturou mají nejvyšší prioritu
  if (currentTask?.essay && topic.inputType === "essay") {
    return (
      <EssayInput
        prompt={currentTask.question}
        minWords={currentTask.essay.minWords ?? 30}
        gradeMin={currentTask.essay.gradeMin}
        onSubmit={onAnswerSubmit}
        disabled={loading}
      />
    );
  }
  if (currentTask?.chemEquation) {
    return <ChemicalBalanceInput tokens={currentTask.chemEquation.tokens} onSubmit={onAnswerSubmit} disabled={loading} />;
  }
  if (currentTask?.timelineEvents && currentTask.timelineEvents.length > 0) {
    return <TimelineInput events={currentTask.timelineEvents} onSubmit={onAnswerSubmit} disabled={loading} />;
  }
  if (currentTask?.formulaPool && currentTask.formulaPool.length > 0) {
    return <FormulaBuilderInput pool={currentTask.formulaPool} onSubmit={onAnswerSubmit} disabled={loading} />;
  }
  // Image-based typy
  if (currentTask?.diagram) {
    return (
      <DiagramLabelInput
        imageUrl={currentTask.diagram.imageUrl}
        imageAlt={currentTask.diagram.imageAlt}
        points={currentTask.diagram.points}
        labelPool={currentTask.diagram.labelPool}
        onSubmit={onAnswerSubmit}
        disabled={loading}
      />
    );
  }
  if (currentTask?.imageOptions && currentTask.imageOptions.length > 0) {
    return <ImageSelectInput imageOptions={currentTask.imageOptions} onSubmit={onAnswerSubmit} disabled={loading} />;
  }
  if (currentTask?.categories && currentTask.categories.length > 0) {
    return <CategorizeInput categories={currentTask.categories} onSubmit={onAnswerSubmit} disabled={loading} />;
  }
  if (currentTask?.pairs && currentTask.pairs.length > 0) {
    return <MatchPairsInput pairs={currentTask.pairs} onSubmit={onAnswerSubmit} disabled={loading} />;
  }
  if (currentTask?.blanks && currentTask.blanks.length > 0) {
    return <FillBlankInput question={currentTask.question} blanks={currentTask.blanks} onSubmit={onAnswerSubmit} disabled={loading} />;
  }
  if (currentTask?.items && currentTask.items.length > 0 && topic.inputType !== "drag_order") {
    return <DragOrderInput items={currentTask.items} onSubmit={onAnswerSubmit} disabled={loading} />;
  }
  if (currentTask?.options && currentTask.options.length > 0 && !["select_one", "multi_select"].includes(topic.inputType)) {
    return <SelectOneInput options={currentTask.options} onSubmit={onAnswerSubmit} disabled={loading} />;
  }

  const inputType = topic.inputType;

  switch (inputType) {
    case "comparison":
      return (
        <div className="space-y-4">
          <p className="text-base text-muted-foreground">Vyber správný znak.</p>
          <div className="grid grid-cols-3 gap-4">
            {(["<", "=", ">"] as const).map((symbol, index) => {
              const colorStyles = [
                "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 text-blue-700 hover:from-blue-100 hover:to-blue-200 hover:border-blue-400 hover:shadow-lg",
                "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300 text-purple-700 hover:from-purple-100 hover:to-purple-200 hover:border-purple-400 hover:shadow-lg",
                "bg-gradient-to-br from-green-50 to-green-100 border-green-300 text-green-700 hover:from-green-100 hover:to-green-200 hover:border-green-400 hover:shadow-lg",
              ];
              return (
                <Button
                  key={symbol}
                  variant="outline"
                  size="lg"
                  disabled={loading}
                  onClick={() => onAnswerSubmit(symbol)}
                  className={`text-3xl font-bold py-8 border-2 rounded-xl hover:scale-105 transition-all duration-200 ${colorStyles[index]}`}
                >
                  {symbol}
                </Button>
              );
            })}
          </div>
        </div>
      );

    case "fraction":
      return <FractionInput onSubmit={onAnswerSubmit} disabled={loading} />;

    case "number":
      return <NumberInput onSubmit={onAnswerSubmit} disabled={loading} />;

    case "select_one":
      return currentTask?.options ? (
        <SelectOneInput
          options={currentTask.options}
          onSubmit={onAnswerSubmit}
          disabled={loading}
        />
      ) : null;

    case "drag_order":
      return currentTask?.items ? (
        <DragOrderInput
          items={currentTask.items}
          onSubmit={onAnswerSubmit}
          disabled={loading}
        />
      ) : null;

    case "fill_blank":
      return currentTask?.blanks ? (
        <FillBlankInput
          question={currentTask.question}
          blanks={currentTask.blanks}
          onSubmit={onAnswerSubmit}
          disabled={loading}
        />
      ) : null;

    case "match_pairs":
      return currentTask?.pairs ? (
        <MatchPairsInput
          pairs={currentTask.pairs}
          onSubmit={onAnswerSubmit}
          disabled={loading}
        />
      ) : null;

    case "multi_select":
      return currentTask?.options ? (
        <MultiSelectInput
          options={currentTask.options}
          onSubmit={onAnswerSubmit}
          disabled={loading}
        />
      ) : null;

    case "categorize":
      return currentTask?.categories ? (
        <CategorizeInput
          categories={currentTask.categories}
          onSubmit={onAnswerSubmit}
          disabled={loading}
        />
      ) : null;

    case "text":
    default:
      return (
        <div className="space-y-4">
          <p className="text-base text-muted-foreground">Stačí napsat výsledek.</p>
          <Textarea
            placeholder="Napiš odpověď…"
            value={userInput}
            onChange={(e) => onUserInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onTextSubmit();
              }
            }}
            className="min-h-[100px] resize-none text-lg border-2"
          />
          <Button onClick={onTextSubmit} disabled={!userInput.trim() || loading} className="w-full text-lg h-12 rounded-xl">
            {loading ? "Zpracovávám…" : "Odeslat odpověď ✏️"}
          </Button>
        </div>
      );
  }
}
