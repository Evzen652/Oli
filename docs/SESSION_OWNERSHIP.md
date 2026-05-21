# Session Ownership — kdo smí kam sahat

> Lidská reference. Hlídá nás disciplína + git worktrees na samostatných branchích.
> Žádná automatika to nevynucuje (zatím).

---

## Aktivní sessions

| Session | Branch | Worktree | Vlastní |
|---|---|---|---|
| **Architekt** | `main` | `Oli/` (root) / `.claude/worktrees/mystifying-mestorf-117aec` | vše mimo `src/content/grade-*/` |
| **Grade 4** | `content/grade-4` | `.claude/worktrees/grade-4` | jen `src/content/grade-4/**` |

## Pravidla

### Architekt smí
- Sdílené typy: `src/content/types.ts`, `src/lib/types.ts`
- DB schema: `supabase/migrations/`
- Engine: `src/lib/adaptiveEngine.ts`, `src/lib/aiClient.ts`, …
- UI komponenty: `src/components/**`, `src/pages/**`
- Hooks: `src/hooks/**`
- Config: `package.json`, `vite.config.ts`, `tailwind.config.ts`, `eslint.config.js`
- Existující `src/lib/content/**` (legacy, bude se migrovat)
- Mergování PR od grade-N sessions do `main`

### Architekt NESMÍ
- Editovat `src/content/grade-N/**` bez explicitní žádosti od grade-N session
- Mergovat bez ověření, že CI prochází

### Grade-N smí
- Vše uvnitř `src/content/grade-N/**`
- Číst (jen číst) sdílené typy a curriculum API
- Commit na vlastní branch
- Push na origin své branche

### Grade-N NESMÍ
- Editovat cokoli mimo `src/content/grade-N/**`
- Měnit sdílené typy nebo DB schema
- Mergovat do `main`
- Editovat jinou `grade-M` složku

## Eskalace

Když grade-N session potřebuje něco, co nemůže udělat:

1. Zapsat do `docs/PENDING_CHANGES.md`
2. Pokračovat v jiné práci v grade-N
3. Architekt to vyřídí v dalším svém session-tickování a oznámí

## Workflow při sync mezi PC

Na začátku každé session (na obou stranách):
```bash
git pull
```

Na konci každé session:
```bash
git push origin <branch>
```

Grade-N branche se mergují do `main` POUZE z architekt session, ručně.
