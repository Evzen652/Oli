# Sdílené utility pro Supabase Edge Functions

## aiCall.ts — AI provider router

Sdílený wrapper pro volání AI bran. Podporuje dva providery:

| Provider | Klíč v Supabase secrets | Endpoint                                          | Default model            |
| -------- | ----------------------- | ------------------------------------------------- | ------------------------ |
| Groq     | `GROQ_API_KEY`          | `https://api.groq.com/openai/v1/chat/completions` | `llama-3.3-70b-versatile`|
| Lovable  | `LOVABLE_API_KEY`       | `https://ai.gateway.lovable.dev/v1/chat/completions` | `google/gemini-3-flash-preview` |

### Routing pravidla

1. Pokud je nastaven `GROQ_API_KEY` → Groq (preferred — rychlejší, často levnější)
2. Else `LOVABLE_API_KEY` → Lovable Gateway
3. Else throw — žádný provider

### Bezpečnost

**Klíče se čtou pouze ze serverového Deno env (Supabase secrets) — NIKDY z klienta.**
Tím je API klíč chráněn — admin vidí jen edge function URL.

### Jak nastavit

Přes Supabase CLI:

```bash
npx supabase secrets set GROQ_API_KEY=gsk_...
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
    groq: "llama-3.3-70b-versatile",
    lovable: "openai/gpt-5-mini",
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
  model: { groq: "llama-3.3-70b-versatile", lovable: "openai/gpt-5-mini" }
});
```
