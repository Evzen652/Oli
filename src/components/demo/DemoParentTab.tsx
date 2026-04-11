import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Clock, BarChart3, Plus, History, BookOpen } from "lucide-react";

const MOCK_CHILDREN = [
  {
    id: "1",
    name: "Péťa",
    grade: 3,
    isPaired: true,
    pairingCode: "A3K9M2",
    activity: {
      sessionsThisWeek: 5,
      avgScore: 82,
      streak: 3,
      lastActive: "dnes, 15:30",
    },
    assignments: [
      { skill: "Sčítání a odčítání do 1000", status: "done", date: "12. 3." },
      { skill: "Vyjmenovaná slova po B", status: "active", date: "15. 3." },
    ],
  },
  {
    id: "2",
    name: "Anička",
    grade: 5,
    isPaired: false,
    pairingCode: "X7P4L1",
    activity: null,
    assignments: [],
  },
];

const avatarColors = [
  "bg-gradient-to-br from-primary/80 to-primary",
  "bg-gradient-to-br from-purple-500 to-purple-600",
];

export function DemoParentTab() {
  return (
    <div className="space-y-5">
      <Card className="border-2 bg-gradient-to-br from-primary/5 via-background to-accent/10">
        <CardContent className="p-6 text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">👋 Ahoj, Jano!</h2>
          <p className="text-sm text-muted-foreground">
            Tady vidíš přehled svých dětí, jejich aktivitu a můžeš jim zadávat úkoly.
          </p>
        </CardContent>
      </Card>

      {MOCK_CHILDREN.map((child, idx) => (
        <Card key={child.id} className="overflow-hidden border-2 shadow-sm">
          <CardContent className="p-0">
            {/* Header */}
            <div className="flex items-center gap-4 p-5 pb-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold text-white shadow-sm ${avatarColors[idx]}`}>
                {child.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-bold text-foreground">{child.name}</p>
                <p className="text-sm text-muted-foreground">{child.grade}. ročník</p>
              </div>
              {child.isPaired ? (
                <Badge className="bg-green-100 text-green-700 border-green-200 gap-1">
                  <UserCheck className="h-3 w-3" /> Spárováno
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1">
                  <Clock className="h-3 w-3" /> Čeká na spárování
                </Badge>
              )}
            </div>

            {/* Activity for paired child */}
            {child.isPaired && child.activity && (
              <div className="px-5 pb-4 space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-2xl font-bold text-foreground">{child.activity.sessionsThisWeek}</p>
                    <p className="text-xs text-muted-foreground">cvičení/týden</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-2xl font-bold text-foreground">{child.activity.avgScore}%</p>
                    <p className="text-xs text-muted-foreground">průměr</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-2xl font-bold text-foreground">🔥 {child.activity.streak}</p>
                    <p className="text-xs text-muted-foreground">dny v řadě</p>
                  </div>
                </div>

                {/* Assignments */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" /> Zadané úkoly
                  </p>
                  {child.assignments.map((a, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{a.skill}</p>
                        <p className="text-xs text-muted-foreground">Zadáno: {a.date}</p>
                      </div>
                      <Badge variant={a.status === "done" ? "default" : "secondary"}>
                        {a.status === "done" ? "✅ Hotovo" : "⏳ Aktivní"}
                      </Badge>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button variant="outline" size="sm" className="gap-1.5" disabled>
                    <Plus className="h-3.5 w-3.5" /> Zadat úkol
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5" disabled>
                    <BarChart3 className="h-3.5 w-3.5" /> Report
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5" disabled>
                    <History className="h-3.5 w-3.5" /> Historie
                  </Button>
                </div>
              </div>
            )}

            {/* Pairing code for unpaired child */}
            {!child.isPaired && (
              <div className="mx-5 mb-5 rounded-lg border-2 border-dashed bg-muted/30 p-4 space-y-2 text-center">
                <p className="text-sm text-muted-foreground">Párovací kód pro žáka:</p>
                <p className="text-3xl font-mono font-bold tracking-[0.3em] text-primary">
                  {child.pairingCode}
                </p>
                <p className="text-xs text-muted-foreground">Žák zadá tento kód při přihlášení</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Add child button (disabled in demo) */}
      <Button variant="outline" className="w-full gap-2 border-dashed border-2 h-14 text-base" disabled>
        <Plus className="h-5 w-5" /> Přidat další dítě
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        V demo režimu nelze přidávat děti ani zadávat úkoly. <a href="/auth" className="text-primary underline">Zaregistrujte se</a> pro plný přístup.
      </p>
    </div>
  );
}
