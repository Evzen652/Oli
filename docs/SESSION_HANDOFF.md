# Předání práce — stav k 2026-09-01 (15:40)

> Tenhle soubor je první, co si má nová session přečíst. Detail je
> v `PROJECT_STATUS.md` §6 a `docs/PENDING_CHANGES.md`.

## 0. Než začneš cokoli dělat

**Práce neběží na `main`.** Aktivní větev je `chore/remove-essay-and-ai-authoring`
(PR #20), která žije ve worktree:

```
C:/Users/weigle/Oli/.claude/worktrees/hungry-villani-074811
```

`main` je za ní o víc než 130 commitů a **nemá** akvarelové ilustrace landingu,
avatary rolí ani `docs/ILLUSTRATION_STYLE.md`.

Ověř to, než uvěříš čistému stromu:

```bash
git branch -a --format="%(refname:short) %(committerdate:short)" && git worktree list
```

Tři věci, které kolem toho stály čas:

1. **Čistý strom shodný s `origin/main` není důkaz aktuálnosti.** Session začala
   ve worktree z `main`, kde všechno vypadalo v pořádku, jen tam chyběla práce
   posledních dní.
2. **`CLAUDE.md` na `main` uvádí zastaralou větev.** Verze na aktivní větvi je
   správná, ale kdo startuje z `main`, přečte si starý pokyn.
3. **Větev nejde checkoutovat ve dvou worktree naráz.** Drží-li ji
   `hungry-villani-074811`, pracuj rovnou v něm.

Pozor i na **dev server**: běží-li z cizího worktree na portu 8080, uživatel
vidí na své obvyklé adrese jinou verzi aplikace, než si myslí.

## 1. Co je hotové

**Wave B uzavřena** — `format/length` 109 → 0, 39 témat, každé GATE 3× `invarianty: 0`.
Metoda a pasti v [`WAVE_B_HANDOFF.md`](WAVE_B_HANDOFF.md).

**Přiměřenost ročníku uzavřena — 7 ze 7 témat** (commity `75949b1`, `1879b3f`, `750382a`).

| téma | zásah |
|---|---|
| `g4-…prvni-pomoc-tisnove-volani` | pool přepsán, 35 → 39 úloh |
| `g5-…etapy-lidskeho-zivota-dospivani` | L2 + L3 přepsány |
| `g4-…savci-ptaci` | L3 přepsán celý, 9 → 12 |
| `g5-…rozmnozovaci-soustava` | L2 + L3 přepsány |
| `g5-…horniny-a-nerosty` | L2 + L3 přepsány |
| `g4-…voda-skupenstvi-kolobeh` | 1 úloha + hranice |
| `g5-…kostra-a-svaly` | terminologie, 11 míst |

Testy **4615/4615**, typecheck 0, GATE u všech `invarianty: 0` (u tří zcela bez nálezů).

### Tři věci, které z toho stojí za zapamatování

**Sken podhodnotil rozsah, a je jasné proč.** Slovník v `scripts/rvp-scan.mjs` uměl
anatomii, farmakologii a medicínu, ale neznal **evoluční a psychologickou terminologii**.
Proto u tří témat ohlásil jednu úlohu tam, kde byla mimo ročník **celá úroveň L3**.
Skenu věř, že něco našel — **ne že našel všechno**. Slepé místo je popsané přímo
v hlavičce skriptu.

**Nálezy z handoffu ověřuj proti kódu.** Předchozí předání uvádělo dvě položky, které
neplatily: `navykove-latky` už acetylcholin ani endokanabinoidy neobsahovaly (odstranila
je Wave B, dávka 20, `d078e38`) a `nucleus accumbens` u dospívání **nikdy neexistoval**
(`git log -S` nenašel commit, který by ho zavedl).

**`boundaries` si u 5 ze 7 témat protiřečily s vlastním obsahem.** Soubor deklaroval
„Molekulární struktura vody není náplní 4. ročníku" a o kus výš se ptal na polární vazby
a ionty. Je to strojově detekovatelné — `rvp-scan.mjs` proto u každého tématu vypisuje
i jeho `boundaries`. **Stojí za zvážení udělat z toho invariant auditu.**

## 2. Otevřené — podle priority

### 🔴 Blockery pilotu — čekají na Evžena, ne na kód
Bez nich se rodič nezaregistruje a dítě nepřipojí. Detail v `PENDING_CHANGES.md`.

```bash
supabase db push && supabase functions deploy pair-child child-relogin set-child-pin session-evaluation weekly-report
```

### 🔴 Pozice správné odpovědi je předvídatelná — čeká na rozhodnutí
Změřeno na celém korpusu: **64 % klíčů je na 1. pozici**, 29 % na 2., 5 % na 3., 2 % na 4.
Ve **49 souborech** je klíč první u víc než 80 % úloh. Strategie „ber vždy první" má tedy
napříč aplikací úspěšnost ~64 % **bez jakékoli znalosti látky** (náhoda u 4 možností je 25 %).

```bash
node scripts/answer-position-report.mjs --files
```

Sedm přepsaných témat je srovnaných. Zbytek ne. Systémové řešení by bylo míchat `options`
v `gen()`, ale **nesmí být plošné** — `drag_order` a `comparison` na pořadí stojí.
Pro jednotlivé soubory je `scripts/rebalance-answer-positions.mjs` (viz §4).

### 🟡 Zděděný dluh, který jsem záměrně nechal být
Držel jsem se zadání a **počty úloh v poolech nezvětšoval** — jen vyměnil obsah.
Proto zůstává vidět:

- **Pooly pod prahem `K_MIN = 12`:** `horniny` L2/L3 má 7/5, `dospivani` 5/4,
  `rozmnozovaci` 6/4. Při `sessionTaskCount: 6` a pěti unikátních úlohách se dítěti
  opakuje skoro celý pool.
- **`g5-…kostra-a-svaly` má `gen(_level)`**, který vrací **pro všechny tři úrovně tentýž
  POOL** — odtud `tier_population: L3 prázdná` a „100 % otázek L3 je shodných s L1".
  Vyžaduje přestavbu tématu, ne opravu.
- **Výplňové „prý" v distraktorech** — 12 souborů, 90 výskytů (nejvíc `magnetyElektrina` 9×).
  „Oba systémy jsou **prý** naprosto stejné" se pozná bez znalosti látky. **Plošně to nejde** —
  část výskytů je legitimní obsah u podmiňovacího způsobu.
- **`g5-…navykove-latky`** — zbývá „hepatitida" a „LSD".

### 🟡 Heuristické nálezy auditu (~140)
Hlavně `hint_progression` (druhá nápověda není o 20 % delší) a `min_unique_tasks_per_tier`.
Ani jedno neblokuje GATE.

### ⏭️ Čeká na rozhodnutí uživatele
- `DiktatFilterSelect.tsx:41` — vlastní tlačítko „Zpět" místo `<BackButton />`.
  Nepřepsáno, protože by se změnil vzhled.
- Šipky v `ui/` a adminu — vědomě ponechány systémové.

## 3. Nástroje (nově v repu)

| skript | k čemu |
|---|---|
| `scripts/rvp-scan.mjs` | sken korpusu na obsah nad rámec RVP ročníku |
| `scripts/answer-position-report.mjs` | měření zkosení pozice odpovědi |
| `scripts/rebalance-answer-positions.mjs` | srovnání pozic v jednom souboru |

```bash
node scripts/rvp-scan.mjs . 6
node scripts/answer-position-report.mjs --files
node scripts/rebalance-answer-positions.mjs <soubor.ts> --dry
```

`rebalance` pouštěj **až jako poslední krok** úprav souboru — po něm přestanou sedět
doslovné náhrady kotvené na starý tvar `options: [...]`. Je idempotentní.

## 4. Prostředí — co bolelo

- **Commit message přes `-F soubor`**, ne here-string (PowerShell).
- **Heredoc v Bash toolu ničí zpětná lomítka.** `cat > f <<'EOF'` promění `[^"\\]`
  na `[^"\]` → `SyntaxError: Invalid regular expression`. **Pomocné skripty piš
  Write toolem**, ne heredocem. Heredoc je OK jen pro text bez lomítek.
- **`\b` je ASCII.** `/\bprý\b/` **nikdy nesedne** — slovo končí na „ý", což není
  ASCII slovní znak. Regex vypadá správně a tiše vrací nulu. Použij
  `(" " + s + " ").includes(" prý ")`.
- **Soubory jsou CRLF** — `.ts` i `.md`. Víceřádkové náhrady musí konce řádků ctít,
  jinak se vzorec nenajde a vypadá to jako chybějící text.
- **Skrytý Browser panel vrací prázdné screenshoty.** Text čti přes `read_page`.
- **`git stash` je sdílený mezi worktrees.** Pro ověření „je ten nález předexistující?"
  použij `git show HEAD:<soubor> > _orig.ts` a pak smaž — ne stash, jinak riskuješ,
  že popneš práci jiné session.
- **Worktree nemá `.env`** (je v `.gitignore`). Bez něj aplikace spadne na
  `supabaseUrl is required`; zkopíruj z `C:/Users/weigle/Oli/.env`.
