# Převod AI na Claude — mapa a plán

**Datum:** 2026-09-03 · **Stav:** návrh, čeká na rozhodnutí · **Kódu se zatím nedotklo**

> Zadání: „zmapuj zbývající místa a připrav plán převodu na Claude." Aplikace dnes
> volá na cizí AI (Gemini / Groq-Llama / GPT přes Lovable Gateway) na několika
> místech. Runtime hodnocení a report pro rodiče už **cizí AI nepoužívají** —
> běží lokálně, bez sítě. Tenhle dokument mapuje, co zbývá, a jak to převést.
>
> **Edge funkce nasazuje Evžen** (Supabase login). Nic z toho tedy nedělám bez
> tvého pokynu — je to plán, ne provedení.

---

## Shrnutí: převod je menší, než vypadá

Klíčové architektonické zjištění: **existuje jediný sdílený router
`supabase/functions/_shared/aiCall.ts`.** Volá cizí providery (Google / Groq /
Lovable), ale všem vrací **OpenAI-kompatibilní odpověď** a všichni volající
parsují stejný tvar (`choices[0].message.tool_calls[0].function.arguments`).

Důsledek: **přidání Claude jako providera do tohohle jednoho souboru** převede
většinu aplikace bez zásahu do volajících. Zbytek jsou funkce, které router
obcházejí — ty stačí přepsat, aby ho používaly.

Generování obrázků je jediná výjimka, kterou **Claude nahradit neumí** (nemá
image generation) — řeší se zvlášť.

---

## Mapa: kde všude se dnes volá AI

Legenda stavu: 🟢 živé (klient volá) · 🟡 vypnuté (za feature flagem) ·
⚪ mrtvé (nahrazeno lokálním kódem, klient nevolá) · 🖼️ obrázky (mimo Claude)

| Funkce | Stav | Co dělá | Dnešní model | Jak volá AI | Claude? |
|---|---|---|---|---|---|
| `analyze-misconceptions` | 🟢 živé | z chyb dítěte pojmenuje miskoncepci | Groq Llama 3.3 / GPT-5-mini | přes `aiCall` router | **ano** |
| `semantic-gate` | 🟢 živé | pozná, jestli je vstup dítěte smysluplné školní téma | Gemini 2.5 flash-lite | vlastní fetch (obchází router) | **ano** |
| `ai-curriculum` | 🟢 živé (admin) | AI asistent tvorby osnov v adminu | Gemini 2.0 / Groq / Lovable | vlastní fetch (obchází router) | **ano** |
| `exercise-validator` | 🟢 živé (admin) | validuje vygenerovaná cvičení | Gemini 2.5 flash | vlastní fetch (obchází router) | **ano** |
| `ai-tutor` | 🟡 vypnuté | konverzační tutor pro žáka | Groq / GPT-5-mini | přes `aiCall` router | **ano** (až se zapne) |
| `tutor-chat` | 🟡 vypnuté | druhá varianta tutora | Groq / Gemini | přes `aiCall` router | **ano** (až se zapne) |
| `session-evaluation` | ⚪ mrtvé | hodnocení sezení | Lovable Gemini | vlastní fetch | není potřeba — nahrazeno `src/lib/sessionEvaluator.ts` (lokální) |
| `weekly-report` | ⚪ mrtvé | report pro rodiče | Gemini | vlastní fetch | není potřeba — nahrazeno `src/lib/weeklyReportGenerator.ts` (lokální) |
| `generate-image` | 🖼️ obrázky | obrázky pro vizuální cvičení | OpenAI DALL-E / Gemini image | vlastní fetch | **NE** — Claude neumí generovat obrázky |
| `generate-prvouka-images` | 🖼️ obrázky | ilustrace témat | Gemini image | vlastní fetch | **NE** — dtto |
| `generate-logo` | 🖼️ obrázky | logo | Gemini image | vlastní fetch | **NE** — dtto (logo je dnes lokální asset) |

**Co z toho reálně teče k dítěti:** jen `analyze-misconceptions` a
`semantic-gate`. Zbytek živých je admin, tutor je vypnutý.

---

## Proč to jde snadno: kontrakt volajících

Každý volající chce **strukturovaný JSON přes tool-calling** a čte ho takhle:

```ts
const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
const parsed = JSON.parse(toolCall.function.arguments);
```

Claude tool use umí přesně tohle, jen v jiném tvaru. Stačí Claude odpověď
přeložit zpět do OpenAI tvaru — pak se volající **nemění vůbec**.

---

## Plán převodu

### Fáze 0 — příprava (bez nasazení)

1. **Anthropic API klíč** do Supabase secrets jako `ANTHROPIC_API_KEY`
   (Evžen; klíč se čte jen z Deno env, nikdy z klienta — stejně jako dnešní).
2. **Volba modelů** podle úlohy (návrh):
   - klasifikace / validace (`semantic-gate`, `exercise-validator`,
     `analyze-misconceptions`) → **Claude Haiku 4.5** (`claude-haiku-4-5-20251001`)
     — levné, rychlé, tool use zvládá.
   - authoring / tutor (`ai-curriculum`, `ai-tutor`, `tutor-chat`) →
     **Claude Sonnet 5** (`claude-sonnet-5`) — kvalitnější reasoning.

### Fáze 1 — Claude provider do routeru `aiCall.ts` (jádro, ~1 soubor)

Přidat do `AiModelMap` pole `anthropic?: string` a do `aiCall()` větev, která:

1. **rozdělí zprávy** — Anthropic chce `system` zvlášť, ne jako roli v poli;
2. **přeloží nástroje** — OpenAI `tools[].function.parameters` →
   Anthropic `tools[].input_schema`;
3. **přeloží `tool_choice`** — `{type:"function",function:{name}}` →
   `{type:"tool", name}`;
4. **zavolá** `POST https://api.anthropic.com/v1/messages`
   s hlavičkami `x-api-key` a `anthropic-version: 2023-06-01`;
5. **přeloží odpověď zpět** — Anthropic `content[]` blok typu `tool_use`
   → syntetický OpenAI tvar
   `{choices:[{message:{tool_calls:[{id, function:{name, arguments: JSON.stringify(input)}}]}}]}`;
   textové bloky → `message.content`;
6. **vrátí syntetický `Response`** — volající se nezmění.

Priorita providerů: **Anthropic (pokud je klíč a `model.anthropic`) → dnešní
řetěz** jako fallback. Tím se nic starého nerozbije, jen se předřadí Claude.

Náčrt (jde do `aiCall.ts`, ne finální kód):

```ts
const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

function toAnthropic(messages, tools, toolChoice, model, maxTokens, temperature) {
  const system = messages.filter(m => m.role === "system").map(m => m.content).join("\n\n");
  const turns  = messages.filter(m => m.role !== "system")
    .map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }));
  const atools = (tools ?? []).map(t => ({
    name: t.function.name,
    description: t.function.description,
    input_schema: t.function.parameters,
  }));
  const choice = toolChoice?.function?.name
    ? { type: "tool", name: toolChoice.function.name } : undefined;
  return { model, system, messages: turns, tools: atools, tool_choice: choice,
           max_tokens: maxTokens ?? 1024, temperature };
}

function fromAnthropic(json) {           // → OpenAI shape
  const toolUse = json.content?.find(b => b.type === "tool_use");
  const text    = json.content?.filter(b => b.type === "text").map(b => b.text).join("");
  return { choices: [{ message: {
    content: text ?? "",
    tool_calls: toolUse ? [{ id: toolUse.id, type: "function",
      function: { name: toolUse.name, arguments: JSON.stringify(toolUse.input) } }] : undefined,
  }}]};
}
```

### Fáze 2 — sjednotit funkce, které router obcházejí

`semantic-gate`, `ai-curriculum`, `exercise-validator` mají vlastní `fetch` na
Gemini/Lovable. Přepsat je, aby volaly `aiCall` (dostanou Claude z Fáze 1
zdarma) a doplnit jim `model.anthropic`. Jejich tool schémata už OpenAI tvar
mají, takže jde hlavně o smazání vlastního fetch bloku.

### Fáze 3 — tutor (až se bude zapínat)

`ai-tutor` a `tutor-chat` už `aiCall` používají — stačí jim přidat
`model.anthropic` a nechat vypnuté přes `FEATURES.studentChat`, dokud se tutor
neřeší jako feature.

### Fáze 4 — úklid mrtvého kódu (volitelně)

`session-evaluation` a `weekly-report` edge funkce jsou nahrazené lokálním
kódem a klient je nevolá. Buď je **smazat**, nebo nechat s poznámkou „legacy".
Doporučení: smazat — snižuje počet míst s cizím AI klíčem.

---

## Co Claude nevyřeší: generování obrázků

`generate-image`, `generate-prvouka-images`, `generate-logo` potřebují model,
který **kreslí obrázky**. Claude image generation nemá. Možnosti:

1. **Nechat na stávajícím** (OpenAI/Gemini image) — je to jiná modalita než
   „AI systém pro text", takže to nemusí spadat pod „jen Claude".
2. **Zrušit runtime generování úplně** — ilustrace předmětů už jsou lokální
   assety v projektu (přesunuto 2026-09-03), logo taky. Admin generátor
   obrázků je tím z velké části nadbytečný. Tohle je čistší, ale je to
   produktové rozhodnutí.

**Otázka pro tebe:** obrázky nechat, nebo runtime generování zrušit?

---

## Bezpečnost a náklady

- Klíč `ANTHROPIC_API_KEY` **jen v Supabase secrets**, nikdy v klientském
  bundlu (dnešní kód to tak má u všech providerů — dodržet).
- `semantic-gate` běží **v každém sezení** u nejasného vstupu → volit levný
  model (Haiku) a nechat lokální fallback, který tam už je (`FALLBACK`).
- `analyze-misconceptions` běží po sezení (fire-and-forget) → Haiku stačí.

---

## Testování a nasazení

1. Fázi 1 (`aiCall.ts`) pokrýt unit testem s mockem `fetch` — ověřit překlad
   tam i zpět a že OpenAI tvar odpovědi sedí (volající se nesmí změnit).
2. Nasadit s klíčem, ale **ponechat fallback řetěz** — když Claude selže,
   spadne to na dnešní providery, aplikace nepadne.
3. Ověřit end-to-end: nejasný vstup (semantic-gate), analýza chyb, admin
   authoring.
4. Teprve po ověření zvážit odebrání starých klíčů (`GROQ`, `LOVABLE`, `GEMINI`).

---

## Otevřená rozhodnutí

| # | Rozhodnutí | Doporučení |
|---|---|---|
| 1 | Modely: Haiku na klasifikaci, Sonnet na authoring/tutor? | ano |
| 2 | Nechat fallback na staré providery, nebo Claude-only tvrdě? | nechat fallback, aspoň zpočátku |
| 3 | Generování obrázků: nechat, nebo zrušit runtime? | zrušit runtime (ilustrace jsou už lokální) |
| 4 | Mrtvé `session-evaluation` a `weekly-report`: smazat? | smazat |
| 5 | Kdo nasadí a přidá secret? | Evžen |

Až tohle odsouhlasíš, umím Fázi 1 (Claude provider v `aiCall.ts`) napsat
i s testem — je to izolovaný soubor a nasazení edge funkcí zůstává na Evženovi.
