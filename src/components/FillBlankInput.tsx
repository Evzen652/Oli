import { useState } from "react";
import { Button } from "@/components/ui/button";

interface FillBlankInputProps {
  question: string;
  blanks: string[];
  onSubmit: (answer: string) => void;
  disabled: boolean;
}

export function FillBlankInput({ question, blanks, onSubmit, disabled }: FillBlankInputProps) {
  const [values, setValues] = useState<string[]>(blanks.map(() => ""));

  const parts = question.split("___");

  const handleChange = (index: number, value: string) => {
    const next = [...values];
    next[index] = value;
    setValues(next);
  };

  const handleSubmit = () => {
    // Single blank → just the value; multiple → JSON array
    if (blanks.length === 1) {
      onSubmit(values[0].trim());
    } else {
      onSubmit(JSON.stringify(values.map(v => v.trim())));
    }
  };

  const allFilled = values.every(v => v.trim().length > 0);

  return (
    <div className="space-y-4">
      <p className="text-base text-muted-foreground">Doplň chybějící část.</p>
      <div className="text-lg leading-relaxed flex flex-wrap items-center gap-1 p-4 rounded-xl border-2 bg-card">
        {parts.map((part, i) => (
          <span key={i} className="inline-flex items-center gap-1">
            <span>{part}</span>
            {i < blanks.length && (
              <input
                type="text"
                value={values[i]}
                onChange={(e) => handleChange(i, e.target.value)}
                disabled={disabled}
                aria-label={`Doplň ${i + 1}. mezeru`}
                className="inline-block w-24 border-b-2 border-primary bg-transparent text-center text-lg font-semibold outline-none focus:border-primary/80 mx-1"
                autoFocus={i === 0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && allFilled) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
            )}
          </span>
        ))}
      </div>
      <Button onClick={handleSubmit} disabled={!allFilled || disabled} className="w-full text-lg h-12 rounded-xl">
        {disabled ? "Zpracovávám…" : "Odeslat odpověď ✏️"}
      </Button>
    </div>
  );
}
