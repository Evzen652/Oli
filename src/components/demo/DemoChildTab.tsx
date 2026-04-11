import { SessionView } from "@/components/SessionView";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Play } from "lucide-react";

export function DemoChildTab() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <Card className="border-2">
        <CardContent className="p-8 text-center space-y-4">
          <div className="text-5xl">📚</div>
          <h2 className="text-2xl font-bold text-foreground">Pohled žáka</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Vyber si ročník, předmět a téma — a vyzkoušej si, jak Oly adaptivně procvičuje
            s okamžitou zpětnou vazbou a nápovědou.
          </p>
          <Button size="lg" className="gap-2" onClick={() => setStarted(true)}>
            <Play className="h-4 w-4" /> Začít procvičovat
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <SessionView />;
}
