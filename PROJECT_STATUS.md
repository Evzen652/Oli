# OLI — Project Status

> Tento soubor udržuje Claude Code a slouží jako kontext pro Claude Chat (product manager).
> Raw URL: https://raw.githubusercontent.com/Evzen652/Oli/main/PROJECT_STATUS.md

---

## Stack
React 19 + Vite 5 + TypeScript + Tailwind CSS 3 + shadcn/ui + Supabase

## Aktuální stav (2026-05-21)

### AI architektura (rozhodnuto 2026-05-20)
Zjednodušení — AI negeneruje cvičení za běhu. Zůstává:
- **Session Evaluation** (async po sezení): Gemini 2.5 Flash Lite
- **Report pro rodiče** (async): Gemini 2.5 Flash Lite
- **Authoring asistent v adminu**: Claude API (ne runtime)

Odchází (při refaktoru): AI Tutor, Curriculum Wizard, Semantic Gate, Exercise Validator.

Content fallback: `DB cache → Algorithmic generator → Empty state`

### Typy cvičení
- [x] Multiple choice
- [ ] Text input (volná odpověď)
- [ ] Fill in the blank (doplň do věty)
- [ ] Matching pairs (spoj pojmy)
- [ ] Ordering (seřaď)
- [ ] True/False
- [ ] Multi-select (více správných odpovědí)

---

## Roadmap (pořadí)
1. **Nové typy cvičení** — největší dopad pro žáky
2. **Admin editor cvičení** — základ pro vlastní obsah
3. **i18n příprava** — technický základ pro jiné státy
4. **Audit systém** — nápovědy + vysvětlení řešení
5. **RVP import** — naplnění obsahem (720 řádků, 1:1 mapping připraven)

---

## Poslední commity
- `f6ac77e` docs: update CLAUDE.md — nová AI architektura a roadmap
- `739fffd` generate-prvouka-images: dynamic cat-*/topic-* keys
- `189dd97` illustrations: discover DB categories+topics dynamically
- `5ec9a60` sb: add 'init <PAT>' for one-command setup on new PC
- `1925740` curriculum: consolidate filter logic + AI integration overhaul
