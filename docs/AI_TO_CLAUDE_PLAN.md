# AI v aplikaci — kde je, a co s ní

**Datum:** 2026-09-03 · **Stav:** návrh, čeká na rozhodnutí · **Kódu se zatím nedotklo**

> Zadání znělo „připrav plán převodu na Claude". Při mapování ale vyšlo najevo,
> že převod na Claude **není ta správná otázka** — a tenhle dokument to říká
> rovnou. Aplikace dnes volá cizí AI (Gemini / Groq-Llama / GPT přes Lovable
> Gateway) na několika místech, ale žádné z nich není to, co dělá appku
> adaptivní.
>
> **Edge funkce nasazuje Evžen** (Supabase login). Nic z toho tedy nedělám bez
> tvého pokynu — je to plán, ne provedení.

---

## Závěr napřed: adaptivita je jádro, runtime AI je periferie

Podstatou aplikace je **adaptivní učení**. Klíčové zjištění auditu: adaptivní
učení už je hotové a postavené správně — a **neběží na runtime AI, ani nikdy
nemělo.**

- Co reálně adaptuje (obtížnost L1/L2/L3, kdy nabídnout nápovědu, řízení podle
  miskoncepcí) je **čistý lokální kód** — `src/lib/adaptiveEngine.ts` má
  v hlavičce doslova *„Pure algorithmic difficulty scaling. No AI. No network
  calls."* Realtime smyčka jen synchronně čte předpočítané číslo
  `misconceptionConfidence` (0–1).
- Je to tak schválně — invarianty v `CLAUDE.md`: *„CHECK < 60ms — no network/AI
  calls in realtime loop"* a *„AI is stateless — no control over session flow."*

**Adaptivitu pohání dvě věci, obě Claude, obě offline:**
1. **Engine** — logika řízení obtížnosti (kód, který napsal Claude).
2. **Kvalita obsahu** — to je ten pravý motor. Distraktor cílený na konkrétní
   miskoncepci je to, co dává sledování miskoncepcí smysl; odstupňované
   L1<L2<L3; nápověda, co navádí a neprozradí. Claudova silná stránka, děje se
   offline.

**Runtime AI (Gemini/Claude) appku adaptivní nedělá.** Sedí na okraji: pojmenuje
chybu, klasifikuje vstup, pomáhá v adminu. Proto „převést všechno na Claude"
není páka — je to vedlejší úklid.

### Co z toho plyne pro rozhodování

| | Doporučení |
|---|---|
| **Engine + lokální eval/report** | nechat být — je to správně, žádné AI |
| **`analyze-misconceptions`** | jediné runtime AI, které adaptivitě reálně slouží (pojmenuje *proč* je dítě vedle → krmí řízení i vhled pro rodiče). Není v 60ms smyčce. **Tohle jediné na Claude přepnout.** |
| **`semantic-gate`, `exercise-validator`, `ai-curriculum`** | periferie → zdeterminovat lokálně nebo smazat (viz níže), ne „převádět na Claude" |
| **Nejvyšší páka pro adaptivní učení** | **obsah**, ne vendor — víc témat, distraktory na miskoncepce, naplněné L3, variabilita. Claude offline, jak už to děláme. |
| **Tutor** (vypnutý) | jediná skutečná hranice adaptivity, kde by živý model pomohl (dítě řekne „nechápu" → vysvětlení na míru). Samostatná feature, ne konverze. Pořádně, s Claude, až se rozhodneš. |

**Jednou větou:** adaptivní učení máš vyřešené v jádru; „všechno na Claude" je
vedlejší úklid, ne to, co appku dělá chytrou — tou je obsah a engine, a oba už
Claude dělá offline.

Zbytek dokumentu je technická mapa a *jak* by převod vypadal, kdyby se dělal —
ale s vědomím závěru výše: dělá se z toho **málo** (jen `analyze-misconceptions`
na Claude), zbytek se **maže nebo determinizuje**.

---

## Technická mapa: převod, kdyby se dělal celý

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

## Doporučená cesta (podle závěru nahoře) — štíhlá, ne plošná

Ne „všechno na Claude". Podle závěru je adaptivita v jádru hotová, takže:

1. **`analyze-misconceptions` → Claude** (Haiku). Jediné runtime AI, které
   adaptivitě slouží. Přes Fázi 1 (Claude provider v `aiCall.ts`) + doplnit
   `model.anthropic`. Fallback na staré providery ponechat.
2. **`semantic-gate` → lokálně**, stejným vzorem jako eval/report: porovnat
   vstup s korpusem témat (je v kódu) + jednoduchá heuristika. Lokální fallback
   tam už je. Runtime AI volání odpadá úplně.
3. **`exercise-validator` → smazat.** Obsah je dnes Claude-kód a `runOfflineAudit`
   ho už kontroluje; validátor je z časů runtime generování. Redundantní.
4. **`ai-curriculum` → smazat / nechat ležet.** Authoring se dělá s Claude
   v session, ne tlačítkem v adminu.
5. **`session-evaluation`, `weekly-report` → smazat.** Mrtvé, nahrazené lokálem.
6. **Obrázky → produktové rozhodnutí** (nechat / zrušit runtime; ilustrace jsou
   už lokální). Mimo „na Claude" — Claude obrázky neumí.
7. **Tutor → parkovat** jako budoucí feature; tam Claude živě dává smysl.

Výsledek: z aplikace zmizí cizí AI skoro úplně — ne přidáním dalšího vendora,
ale zúžením runtime AI na jeden smysluplný bod (na Claude) a determinizací/
smazáním zbytku. Přesně vzorem, který jsi už použil u hodnocení a reportu.

---

## Otevřená rozhodnutí

| # | Rozhodnutí | Doporučení |
|---|---|---|
| 1 | `analyze-misconceptions`: na Claude (Haiku)? | ano — jediné runtime AI, co slouží adaptivitě |
| 2 | `semantic-gate`: determinizovat lokálně místo AI? | ano — vzorem eval/report |
| 3 | `exercise-validator`: smazat (redundantní s runOfflineAudit)? | ano |
| 4 | `ai-curriculum`: smazat / nechat ležet? | authoring je v session; smazat, až se potvrdí, že se nepoužívá |
| 5 | Mrtvé `session-evaluation` a `weekly-report`: smazat? | ano |
| 6 | Generování obrázků: nechat, nebo zrušit runtime? | zrušit runtime (ilustrace jsou už lokální) |
| 7 | Tutor: parkovat jako budoucí feature? | ano |
| 8 | Kdo nasadí a přidá secret? | Evžen |

Až tohle odsouhlasíš, nejmenší smysluplný krok je: **Fáze 1** (Claude provider
v `aiCall.ts`, s testem) + přepnout `analyze-misconceptions`. Je to izolovaný
soubor; nasazení edge funkcí zůstává na Evženovi.
