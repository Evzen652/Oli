# Předání práce — stav k 2026-09-01 (04:30)

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

Tři věci, které kolem toho v session 2026-09-01 stály čas:

1. **Čistý strom shodný s `origin/main` není důkaz aktuálnosti.** Session začala
   ve worktree z `main`, kde všechno vypadalo v pořádku, jen tam chyběla práce
   posledních dní.
2. **`CLAUDE.md` na `main` uvádí zastaralou větev.** Verze na aktivní větvi je
   správná (řádek 97), ale kdo startuje z `main`, přečte si starý pokyn.
3. **Větev nejde checkoutovat ve dvou worktree naráz.** Drží-li ji
   `hungry-villani-074811`, pracuj rovnou v něm — git to oznámí chybou
   „already used by worktree at…".

Pozor i na **dev server**: běží-li z cizího worktree na portu 8080, uživatel
vidí na své obvyklé adrese jinou verzi aplikace, než si myslí.

## 1. Co je hotové

**Wave B uzavřena** (commity `d078e38`…`6f30e96`, pushnuto).

| metrika | výsledek |
|---|---|
| `format/length` | **109 → 0** (3× po sobě naměřeno) |
| dotčená témata | **39 → 0**, každé GATE 3× `invarianty: 0` |
| testy | 4615/4615, typecheck 0 |

Metoda a všechny nalezené pasti jsou v [`WAVE_B_HANDOFF.md`](WAVE_B_HANDOFF.md);
nově přibyl patcher `scripts/wave-b/pcd.mjs` pro formát `{ correct, distractors }`.

## 2. Otevřené — podle priority

### 🔴 Blockery pilotu — čekají na Evžena, ne na kód
Bez nich se rodič nezaregistruje a dítě nepřipojí. Detail v `PENDING_CHANGES.md`.

```bash
supabase db push && supabase functions deploy pair-child child-relogin set-child-pin session-evaluation weekly-report
```

### 🔴 Přiměřenost ročníku — opakující se vzorec, ne jednotlivost
Tři témata mají obsah nad rámec RVP daného ročníku a **žádné z nich nejde spravit
úpravou možností** — chce to přepsat pool:

- `g5-prirodoveda-…etapy-lidskeho-zivota-dospivani` — nucleus accumbens,
  prefrontální kůra, cirkadiánní rytmus, Eriksonových 8 fází. Navíc termín
  **„sebeobrázek"** je kalk z *self-image*, česky *sebepojetí*.
- `g5-prirodoveda-…navykove-latky` — acetylcholinové receptory, endokanabinoidy,
  hipokampus, opioidní receptory.
- `g4-prirodoveda-…prvni-pomoc-tisnove-volani` — škrtidlo, ABCDE, triáž,
  defibrilace, EpiPen, **v přímém rozporu s vlastním `boundaries`** tématu.

Poznámky u batchů 9 a 11 popisují tentýž vzorec, takže stojí za zvážení projít
korpus cíleně na tohle, ne čekat, až to vypadne z délkové vlny.

### 🟡 Heuristické nálezy auditu (~140)
Wave B mířila jen na `format/length` a blokující invarianty. Zbývají hlavně
`hint_progression` (druhá nápověda není o 20 % delší) a `min_unique_tasks_per_tier`
(pool se opakuje). Ani jedno neblokuje GATE.

### ⏭️ Čeká na rozhodnutí uživatele
- `DiktatFilterSelect.tsx:41` — vlastní tlačítko „Zpět" místo `<BackButton />`.
  Nepřepsáno, protože by se změnil vzhled.
- Šipky v `ui/` a adminu — vědomě ponechány systémové.

## 3. Prostředí — co bolelo

- **Commit message přes `-F soubor`**, ne here-string (PowerShell).
- **Soubory jsou CRLF.** Víceřádkové náhrady v Pythonu spojuj přes zjištěný
  oddělovač, ne přes `\n` — jinak `assert` neprojde a vypadá to jako chybějící text.
- **Skrytý Browser panel vrací prázdné screenshoty.** Text čti přes `read_page`
  nebo `get_page_text`.
- **`git stash` je sdílený mezi worktrees.** Pro ověření „je ten nález
  předexistující?" použij `cp soubor /tmp && git checkout HEAD -- soubor`,
  ne stash — jinak riskuješ, že popneš práci jiné session.
- **Worktree nemá `.env`** (je v `.gitignore`). Bez něj aplikace spadne na
  `supabaseUrl is required`; zkopíruj z `C:/Users/weigle/Oli/.env`.
