# Sdílené utility pro Supabase Edge Functions

## aiCall.ts — AI provider router

Sdílený wrapper pro volání AI bran. Podporuje dva providery:

| Provider  | Klíč v Supabase secrets            | Endpoint                                             | Default model                   |
| --------- | ----------------------------------- | ----------------------------------------------------- | -------------------------------- |
| Google AI | `GEMINI_API_KEY` / `GOOGLE_AI_KEY`  | `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions` | podle volajícího (`model.google`) |
| Lovable   | `LOVABLE_API_KEY`                   | `https://ai.gateway.lovable.dev/v1/chat/completions`  | `google/gemini-3-flash-preview`  |

> Groq byl z projektu odstraněn (2026-08-26, produktové rozhodnutí — slabý na tyhle úkoly).
> Pokud narazíš na starý `GROQ_API_KEY` secret v Supabase, je bezpečné ho smazat.

### Routing pravidla

1. Pokud je nastaven `GEMINI_API_KEY`/`GOOGLE_AI_KEY` A volající zadá `model.google` → Google AI (fallback na Lovable při chybě)
2. Else `LOVABLE_API_KEY` → Lovable Gateway
3. Else throw — žádný provider

### Bezpečnost

**Klíče se čtou pouze ze serverového Deno env (Supabase secrets) — NIKDY z klienta.**
Tím je API klíč chráněn — admin vidí jen edge function URL.

### Jak nastavit

Přes Supabase CLI:

```bash
npx supabase secrets set GEMINI_API_KEY=...
# nebo
npx supabase secrets set LOVABLE_API_KEY=lov_...
```

Nebo přes web UI:
**Supabase Dashboard → Project Settings → Edge Functions → Secrets**

### Použití v edge funkci

```ts
import { aiCall, hasAnyAiProvider } from "../_shared/aiCall.ts";

if (!hasAnyAiProvider()) {
  throw new Error("Žádný AI provider není nakonfigurován.");
}

const response = await aiCall({
  messages: [
    { role: "system", content: "..." },
    { role: "user", content: "..." },
  ],
  tools: myTools,
  toolChoice: { type: "function", function: { name: "..." } },
  model: {
    lovable: "openai/gpt-5-mini",
    // google: "gemini-2.0-flash", // volitelně, pokud chceš Google AI jako primární
  },
});

// response.json() vrací OpenAI-compatible shape (oba providery)
const data = await response.json();
const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
```

### Migrace existujícího kódu

Místo:
```ts
const apiKey = Deno.env.get("LOVABLE_API_KEY");
const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
  method: "POST",
  headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
  body: JSON.stringify({ model: "...", messages, tools, tool_choice }),
});
```

Použij:
```ts
const r = await aiCall({
  messages, tools, toolChoice,
  model: { lovable: "openai/gpt-5-mini" }
});
```
