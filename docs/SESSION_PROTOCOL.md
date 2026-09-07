# Předávací protokol — co udělat na začátku každé session

> `SESSION_HANDOFF.md` říká **kde jsme skončili**. Tenhle soubor říká **co
> s tím udělat jako první**, a hlavně **co si ověřit, než tomu uvěříš**.
>
> Vzniklo 2026-09-07 z jedné session, ve které se třikrát ukázalo, že
> dokumentace neodpovídá skutečnosti — a pokaždé se podle ní už plánovalo.
> Proto tenhle protokol nestojí na čtení, ale na měření.

---

## Krok 1 — Kde vlastně jsem

```bash
git fetch origin && git status -sb && git worktree list
```

- Pracovní větev je **`main`**.
- **Čistý strom shodný s `origin/main` není důkaz aktuálnosti**, dokud jsi
  neudělal `fetch`. Jedna session takhle začala v worktree, kde všechno
  vypadalo v pořádku, jen tam chyběla práce posledních dnů.
- Repo má **sedm worktree** a většina sedí na starých commitech. Než v nějakém
  začneš, přepni ho na `main` a `git pull`.
- ⚠️ Worktree `competent-johnson-de23e8` sleduje **zastaralý remote**, takže
  tam `git status` hlásí „ahead" vůči špatné větvi. Pushuje se z něj přes
  `git push origin <vetev>:main`.

---

## Krok 2 — Ověř skutečnost, ne dokumentaci

**Tenhle krok nepřeskakuj.** V září 2026 byly zároveň nepravdivé tři soubory:
`PENDING_CHANGES` (vedl dvě nasazené funkce jako nenasazené), `CLAUDE.md`
(tvrdil, že PIN migrace čeká) a `DESIGN_SYSTEM.md` (uváděl barvu, která
neplatila půl roku, a chlubil se kontrastem, který dnešní barva nesplňuje).

### Které edge funkce opravdu běží

```powershell
$key = "sb_publishable_33yUDPztgleFHYtChSvGKQ_rMlyktGV"
$base = "https://uusaczibimqvaazpaopy.supabase.co/functions/v1/"
Add-Type -AssemblyName System.Net.Http
$h = New-Object System.Net.Http.HttpClient
foreach ($f in @("pair-child","delete-account","session-evaluation","weekly-report","child-relogin","set-child-pin")) {
  $req = New-Object System.Net.Http.HttpRequestMessage([System.Net.Http.HttpMethod]::Options, ($base + $f))
  $req.Headers.Add("apikey", $key); $req.Headers.Add("Authorization", "Bearer $key")
  $code = [int]$h.SendAsync($req).GetAwaiter().GetResult().StatusCode
  Write-Output ("{0,-22} {1} {2}" -f $f, $code, $(if ($code -eq 404) { "NENASAZENA" } else { "nasazena" }))
}
```

`404` = neexistuje. Cokoli jiného (typicky `200`) = nasazená.

### Jestli existuje sloupec v databázi

Naváže na proměnné z předchozího bloku. `Invoke-WebRequest` tu **nepoužívej** —
v neinteraktivním PowerShellu padá na promptu, místo aby vrátil stavový kód.

```powershell
$req = New-Object System.Net.Http.HttpRequestMessage([System.Net.Http.HttpMethod]::Get,
  "https://uusaczibimqvaazpaopy.supabase.co/rest/v1/children?select=pin_hash&limit=1")
$req.Headers.Add("apikey", $key); $req.Headers.Add("Authorization", "Bearer $key")
$resp = $h.SendAsync($req).GetAwaiter().GetResult()
Write-Output ("{0}  {1}" -f [int]$resp.StatusCode,
  $(if ([int]$resp.StatusCode -eq 200) { "sloupec existuje" } else { "NEEXISTUJE" }))
```

`200` = sloupec existuje (prázdné pole je jen RLS, ne chybějící sloupec).
`400` = neexistuje.

### Barvy a tokeny

Zdroj pravdy je `src/index.css` a `tailwind.config.ts`, **ne** `DESIGN_SYSTEM.md`.
Když potřebuješ vědět, jak něco doopravdy vypadá, změř to v prohlížeči
(`getComputedStyle`), nehádej z názvu třídy — rampy jsou v configu přemapované,
takže `violet` je oranžová a `slate` je teplá stone.

---

## Krok 3 — Přečti stav, v tomhle pořadí

1. [`docs/SESSION_HANDOFF.md`](SESSION_HANDOFF.md) — kde jsme skončili, co čeká
   na uživatele, pasti prostředí
2. `PROJECT_STATUS.md` §6 — poslední sessions
3. [`docs/PENDING_CHANGES.md`](PENDING_CHANGES.md) — otevřené položky

---

## Krok 4 — Řekni uživateli, kde jsme

Dvě až tři věty + bullet list „Doporučené další kroky" podle priority.
**Ne výpis všeho, co jsi přečetl.**

Když se to, co jsi naměřil v kroku 2, rozchází s dokumentací, **řekni to
rovnou** a dokument oprav — i kdyby to nebylo zadání. Zastaralá mapa stojí
příští session víc než ta oprava teď.

---

## Během práce

### Než něco odevzdáš

```bash
npm run typecheck && npm run audit:ui && npm test && npm run build
```

`audit:ui` hlídá chyby typu „prvek slibuje něco, co nedělá" (baseline 9
přijatých; selže jen na novém nálezu).

### Po každém tasku — i jednořádkovém

1. `PROJECT_STATUS.md` §6 — co je hotové
2. `docs/PENDING_CHANGES.md` — přesunout vyřízené

### Ověřuj v prohlížeči, ne odhadem

Změny v UI ověř na běžícím dev serveru. Rodičovské a dětské plochy vyžadují
přihlášení, takže je neuvidíš — v takovém případě slož **náhled ze skutečných
tříd** na skutečném podkladu a změř `getComputedStyle`. V minulé session to
tak proběhlo třikrát a pokaždé to našlo něco, co by odhad minul.

Pasti prohlížeče a PowerShellu jsou v [`SESSION_HANDOFF.md`](SESSION_HANDOFF.md) §5.

---

## Co Claude dělat nesmí

Ať se na to nepřijde až uprostřed úkolu:

| nesmí | proč |
|---|---|
| `supabase db push`, `functions deploy` | produkce; navíc `db push` chce heslo k databázi, které nikde uložené není |
| zakládat účty, zadávat hesla | platí i když je heslo v `.env.admin` |
| vymýšlet údaje provozovatele | identita správce údajů je právně závazná (`src/content/legal.ts`) |
| měnit ilustrace na landing page | bez výslovného pokynu uživatele |
| editovat `src/integrations/supabase/{client,types}.ts` | auto-generované |
| editovat `data/rvp_data.json` | readonly |
| `git stash` / `git stash pop` bez tagu | zásobník je sdílený mezi worktree |

Když na některou z nich narazíš, **napiš to uživateli hned** a nabídni, co
umíš udělat místo toho — ne až po půl hodině práce.

---

## Aktuální fáze (2026-09-07)

Nedělá se obsah, ale **příprava spuštění**. Kód je hotový; čeká se na deploy
a na čtyři rozhodnutí uživatele. Postup pro něj je v runbooku odkázaném
z [`SESSION_HANDOFF.md`](SESSION_HANDOFF.md) §2.

Nejbližší práce, kterou může vzít Claude, je v `SESSION_HANDOFF.md` §4 —
začíná podkladem karet v rozcestníku (72 % plochy nese tint určený pro čip).
