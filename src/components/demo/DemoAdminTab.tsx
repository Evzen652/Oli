import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ChevronLeft, Sparkles, MessageSquare } from "lucide-react";

interface MockCategory {
  name: string;
  emoji: string;
  topicCount: number;
  topics: { name: string; skillCount: number }[];
}

interface MockSubject {
  name: string;
  emoji: string;
  color: string;
  border: string;
  categories: MockCategory[];
}

const MOCK_SUBJECTS: MockSubject[] = [
  {
    name: "Matematika",
    emoji: "🔢",
    color: "from-blue-50 to-blue-100/50",
    border: "border-blue-200",
    categories: [
      {
        name: "Sčítání a odčítání",
        emoji: "➕",
        topicCount: 4,
        topics: [
          { name: "Sčítání do 100", skillCount: 3 },
          { name: "Odčítání do 100", skillCount: 3 },
          { name: "Sčítání do 1000", skillCount: 2 },
          { name: "Odčítání do 1000", skillCount: 2 },
        ],
      },
      {
        name: "Násobení a dělení",
        emoji: "✖️",
        topicCount: 3,
        topics: [
          { name: "Malá násobilka", skillCount: 4 },
          { name: "Dělení se zbytkem", skillCount: 2 },
          { name: "Velká násobilka", skillCount: 2 },
        ],
      },
      {
        name: "Zlomky",
        emoji: "🍕",
        topicCount: 5,
        topics: [
          { name: "Porovnávání zlomků", skillCount: 2 },
          { name: "Sčítání zlomků", skillCount: 3 },
          { name: "Krácení zlomků", skillCount: 2 },
          { name: "Rozšiřování zlomků", skillCount: 2 },
          { name: "Smíšená čísla", skillCount: 2 },
        ],
      },
    ],
  },
  {
    name: "Čeština",
    emoji: "📖",
    color: "from-purple-50 to-purple-100/50",
    border: "border-purple-200",
    categories: [
      {
        name: "Pravopis",
        emoji: "✍️",
        topicCount: 3,
        topics: [
          { name: "Vyjmenovaná slova", skillCount: 7 },
          { name: "Párové souhlásky", skillCount: 2 },
          { name: "Velká písmena", skillCount: 2 },
        ],
      },
      {
        name: "Mluvnice",
        emoji: "🗣️",
        topicCount: 2,
        topics: [
          { name: "Slovní druhy", skillCount: 3 },
          { name: "Vzory podstatných jmen", skillCount: 4 },
        ],
      },
    ],
  },
  {
    name: "Prvouka",
    emoji: "🌍",
    color: "from-green-50 to-green-100/50",
    border: "border-green-200",
    categories: [
      {
        name: "Lidské tělo",
        emoji: "🦴",
        topicCount: 3,
        topics: [
          { name: "Části těla", skillCount: 2 },
          { name: "Smysly", skillCount: 2 },
          { name: "Zdraví a hygiena", skillCount: 2 },
        ],
      },
      {
        name: "Příroda",
        emoji: "🌿",
        topicCount: 3,
        topics: [
          { name: "Rostliny", skillCount: 3 },
          { name: "Zvířata", skillCount: 3 },
          { name: "Roční období", skillCount: 2 },
        ],
      },
    ],
  },
];

const MOCK_AI_MESSAGES = [
  { role: "user" as const, text: "Přidej téma 'Geometrické tvary' do matematiky pro 4. ročník" },
  { role: "ai" as const, text: "Navrhuji přidat téma 'Geometrické tvary' do kategorie 'Geometrie' s těmito podtématy:\n\n• **Rovinné tvary** — trojúhelník, čtverec, obdélník, kruh\n• **Obvod a obsah** — výpočet obvodu a obsahu základních tvarů\n• **Osová souměrnost** — rozpoznání a kreslení osy souměrnosti\n\nMám pokračovat s vytvořením?" },
];

type Level = "subject" | "category" | "topic";

export function DemoAdminTab() {
  const [level, setLevel] = useState<Level>("subject");
  const [selectedSubject, setSelectedSubject] = useState<MockSubject | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MockCategory | null>(null);
  const [showAiChat, setShowAiChat] = useState(false);

  const handleBack = () => {
    if (level === "topic") { setSelectedCategory(null); setLevel("category"); }
    else if (level === "category") { setSelectedSubject(null); setLevel("subject"); }
  };

  const title = level === "subject" ? "Správa obsahu" : level === "category" ? selectedSubject!.name : selectedCategory!.name;
  const subtitle = level === "subject" ? "Hierarchie: předmět → kategorie → téma → dovednost" : level === "category" ? "Okruhy" : "Témata";

  return (
    <div className="space-y-4">
      {/* Admin header */}
      <Card className="border-2 bg-gradient-to-br from-primary/5 via-background to-accent/10">
        <CardContent className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">🛠 Admin panel</h2>
              <p className="text-sm text-muted-foreground">
                Správa kurikula s AI asistentem — přidávejte předměty, kategorie, témata a dovednosti.
              </p>
            </div>
            <Button
              variant={showAiChat ? "default" : "outline"}
              className="gap-2"
              onClick={() => setShowAiChat(!showAiChat)}
            >
              <Sparkles className="h-4 w-4" />
              AI Asistent
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Chat panel */}
      {showAiChat && (
        <Card className="border-2 border-primary/20">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <MessageSquare className="h-4 w-4" />
              AI Chat — správa kurikula
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {MOCK_AI_MESSAGES.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`rounded-lg px-4 py-2.5 max-w-[85%] text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}>
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
                placeholder="Napiš AI co chceš změnit v kurikulu…"
                disabled
              />
              <Button size="sm" disabled>Odeslat</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex items-center gap-2">
        {level !== "subject" && (
          <Button variant="ghost" size="sm" onClick={handleBack} className="gap-1 text-muted-foreground">
            <ChevronLeft className="h-4 w-4" /> Zpět
          </Button>
        )}
        <div className="flex-1 text-center">
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {level !== "subject" && <div className="w-16" />}
      </div>

      {/* Subjects */}
      {level === "subject" && (
        <div className="grid gap-3">
          {MOCK_SUBJECTS.map((subject) => (
            <Card
              key={subject.name}
              className={`cursor-pointer border-2 ${subject.border} transition-all hover:shadow-md bg-gradient-to-r ${subject.color}`}
              onClick={() => { setSelectedSubject(subject); setLevel("category"); }}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{subject.emoji}</span>
                    <div>
                      <p className="text-xl font-medium text-foreground">{subject.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {subject.categories.length} {subject.categories.length < 5 ? "okruhy" : "okruhů"}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Categories */}
      {level === "category" && selectedSubject && (
        <div className="grid gap-3">
          {selectedSubject.categories.map((cat) => (
            <Card
              key={cat.name}
              className="cursor-pointer border-2 transition-all hover:shadow-md hover:bg-accent"
              onClick={() => { setSelectedCategory(cat); setLevel("topic"); }}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{cat.emoji}</span>
                    <div>
                      <p className="text-lg font-medium text-foreground">{cat.name}</p>
                      <p className="text-sm text-muted-foreground">{cat.topicCount} témat</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Topics */}
      {level === "topic" && selectedCategory && (
        <div className="grid gap-3">
          {selectedCategory.topics.map((topic) => (
            <Card key={topic.name} className="border-2 hover:bg-accent transition-all">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-medium text-foreground">{topic.name}</p>
                    <p className="text-sm text-muted-foreground">{topic.skillCount} dovedností</p>
                  </div>
                  <Badge variant="secondary">{topic.skillCount} skills</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <p className="text-xs text-center text-muted-foreground">
        V demo režimu nelze upravovat kurikulum. <a href="/auth" className="text-primary underline">Zaregistrujte se</a> pro plný přístup.
      </p>
    </div>
  );
}
