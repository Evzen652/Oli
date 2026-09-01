# ⚠️ Tenhle soubor je zastaralý — nečti ho

Aktuální předání práce je v **[`SESSION_HANDOFF.md`](SESSION_HANDOFF.md)**
(velkými písmeny, s podtržítkem).

---

## Proč tu tenhle soubor pořád je

Původní obsah byl z **2026-06-03** a popisoval větev `main`. Od té doby se práce
přesunula na `chore/remove-essay-and-ai-authoring` a `main` je pozadu o víc než
130 commitů.

Soubor se nesmazal, protože se na tenhle název **nová session sama od sebe trefí**
dřív než na ten správný — stalo se to 2026-09-01. Session přečetla tříměsíční
dokument, ohlásila, že `SESSION_HANDOFF.md` „neexistuje", a chystala se jednat
podle zastaralého stavu.

Dvě jména, která se liší jen podtržítkem a pomlčkou, jsou past. Tenhle rozcestník
ji zavírá.

## Pozor: na `main` je pořád stará verze

Tahle náhrada existuje jen na aktivní větvi. Kdo startuje z `main`, přečte si
původní zastaralý text. **Než uvěříš čemukoli v handoffu, ověř větev:**

```bash
git branch --show-current && git worktree list
```

Práce patří do worktree `C:/Users/weigle/Oli/.claude/worktrees/hungry-villani-074811`
na větvi `chore/remove-essay-and-ai-authoring`. Větev nejde checkoutovat ve dvou
worktree naráz — pracuj rovnou v tom uvedeném.
