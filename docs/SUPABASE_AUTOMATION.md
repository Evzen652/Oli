# Supabase Automation — One-Time Setup

> **Cíl**: po tomto setupu Claude obstará VŠECHNY Supabase operace
> (SQL, secrets, deploy, logs, status). Ty se k dashboardu nemusíš vracet.

## Co Claude pak umí autonomně

| Operace | Před setupem | Po setupu |
|---|---|---|
| SQL query proti DB (bypass RLS) | Ty v SQL editoru | `npm run sb sql "..."` |
| Přidat/změnit Edge Function secret | Ty v dashboardu | `npm run sb secret-set KEY=value` |
| Číst Edge Function logy | Ty v dashboardu | `npm run sb logs ai-curriculum` |
| Deploy edge funkce | Funguje s Supabase CLI login | `npm run sb deploy ai-curriculum` |
| DB migrace | Funguje s CLI | `npm run sb migrate` |
| Health-check celého projektu | Ručně | `npm run sb:status` |

---

## Setup (≈ 5 minut, jednou)

### Krok 1 — Personal Access Token

1. Otevři https://supabase.com/dashboard/account/tokens
2. Klikni **"Generate new token"**
3. Name: `claude-automation`
4. Klikni Generate
5. **Zkopíruj token** (zobrazí se jen jednou, formát `sbp_…`)

### Krok 2 — Service Role Key

1. Otevři https://supabase.com/dashboard/project/uusaczibimqvaazpaopy/settings/api
2. Sekce **"Project API keys"**
3. Najdi řádek **`service_role`** (ne `anon`!)
4. Klikni **"Reveal"** a zkopíruj

> ⚠️ Service role key **obchází RLS** — chovej se k němu jako k root heslu.
> Nikdy ho necommituj ani neuvádej ve sdílených souborech.

### Krok 3 — Vyplň `.env.admin`

```bash
cp .env.admin.example .env.admin
# pak otevři .env.admin a vyplň PAT + service role key
```

Soubor je v `.gitignore`, nikdy se necommituje.

### Krok 4 (volitelný) — Plný SQL přístup

Bez tohoto kroku Claude umí jen SELECT přes REST. Pro UPDATE/INSERT/DDL
udělej tohle jednou:

```bash
npm run sb init-rpc
# Vypíše SQL — zkopíruj a spusť v https://supabase.com/dashboard/project/.../sql/new
```

Po vytvoření RPC `exec_sql` Claude umí libovolný SQL příkaz.

---

## Ověření

```bash
npm run sb:status
```

Pokud vidíš výpis tabulek + provider chain, je hotovo.

---

## Časté úkony, které Claude teď zvládne sám

```bash
# Zjisti co je v DB
npm run sb sql "SELECT name, slug, grade_min, grade_max FROM curriculum_subjects"

# Přidej Lovable klíč (bez návštěvy dashboardu)
npm run sb secret-set LOVABLE_API_KEY=sk-xxx

# Najdi proč selhalo poslední AI volání
npm run sb logs ai-curriculum

# Aplikuj novou migraci
npm run sb migrate

# Celkový health-check
npm run sb:status

# Deploy edge funkci po refaktoru
npm run sb deploy ai-curriculum
```

---

## Bezpečnost

| Riziko | Mitigace |
|---|---|
| Únik service_role_key | `.env.admin` v `.gitignore`, soubor never commitnut |
| Únik PAT | Lze kdykoli revoknout v https://supabase.com/dashboard/account/tokens |
| Náhodné mazání dat | `sb sql` SELECT funguje vždy; DDL/DML jen po `init-rpc` |
| Claude omylem mění production | Veškeré operace logují stdout — review před commitem |

## Revokace přístupu

Pokud chceš Claude přístupy okamžitě odebrat:
1. https://supabase.com/dashboard/account/tokens → revoke `claude-automation` token
2. https://supabase.com/dashboard/project/.../settings/api → reset service_role key

Po revokaci žádný `sb` příkaz nezafunguje.
