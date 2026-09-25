import grade2 from "@/assets/grade-2.png";
import grade3 from "@/assets/grade-3.png";
import grade4 from "@/assets/grade-4.png";
import grade5 from "@/assets/grade-5.png";
import grade6 from "@/assets/grade-6.png";
import gradeSoon from "@/assets/grade-soon.png";

/**
 * Motiv stěžejního učiva na dlaždicích výběru ročníku.
 *
 * | ročník | motiv | proč |
 * |---|---|---|
 * | 2 | svazek balónků | počítání do 100 — dá se počítat, veselé |
 * | 3 | barevný papoušek | vyjmenovaná slova — řeč, zvuky |
 * | 4 | vějíř ovocných plátků | zlomky — díly celku |
 * | 5 | raketa | velká čísla — daleké vzdálenosti |
 * | 6 | kompas a lupa na mapě | nové předměty (zeměpis/dějepis/fyzika/přírodopis), nový stupeň |
 * | 1, 7, 8, 9 | sova s lupou nad knihou (`grade-soon`, SDÍLENÁ) | ročník zatím bez obsahu — „bádáme, jsme na tom" |
 *
 * 2026-09: přebarveno z původních (počítadlo/kniha s Y/koláč) — ty byly
 * tematicky správně, ale barevně nudné (zemité tóny). Nové motivy jsou
 * záměrně JINÉ objekty, ne jen sytější paleta téhož — víc se to povedlo.
 *
 * **Číslo z dlaždice nemizí.** Kresba nedokáže říct „šestý ročník" — dítě ví,
 * do které třídy chodí, a hledá číslo. Motiv přidává kontext, ne identitu,
 * proto je číslo vedle něj jako odznak, ne pod ním.
 *
 * **Ročníky bez obsahu (1, 7, 8, 9) mají JEDNU sdílenou ilustraci**, ne
 * per-ročník motiv — je to vědomě obecné „pracujeme na tom", ne slib
 * konkrétní látky, která ještě neexistuje. Rozdíl „hotové / chystá se" už
 * proto nenese přítomnost kresby (jako do 2026-09), ale odbarvení
 * (`saturate-[0.55]`) a popisek „Připravujeme" na dlaždici — viz
 * `Onboarding.tsx`.
 *
 * **Proč ne stávající ilustrace předmětů** (`cat-*.png`, `topic-*.png`):
 * vyzkoušeno a zavrženo. Mají bílé pozadí (na barevné dlaždici z nich je bílý
 * čtverec) a jsou to bledé pastely, které se na syté dlaždici ztratí — na
 * 130 px navíc čtou jako změť. Nové motivy mají tmavou konturu a syté barvy,
 * takže drží samy o sobě a nepotřebují světlé kolečko pod sebou.
 *
 * Pozadí vyříznuto flood-fillem od okrajů (mirror `dewhiteBackground` v
 * `supabase/functions/generate-prvouka-images`), uzavřené bílé kapsy (mezery
 * mezi provázky balónků) doplněny druhým, čistě jasovým průchodem — ověřeno
 * složením na sytou barvu, ne pohledem na bílou, kde by se bílý flek
 * neprojevil. **Pozor:** ten druhý jasový průchod NEPOUŽÍVEJ na kresby se
 * zrnem papíru přes celou plochu (`grade-soon`) — čistě jasový práh bez
 * vazby na propojenost s okrajem zasáhne i zrno uvnitř kresby (ověřeno,
 * zkažený první pokus). Tam stačí jen flood-fill od okrajů.
 *
 * **Velikost: 420 px delší hrana**, ne to, co vrátil model. Dlaždice je 132 px,
 * takže 420 dává 3,2× rezervu pro retinu — víc je jen přenos navíc
 * (`ILLUSTRATION_STYLE.md` §8). Napoprvé se sem nahrálo, co dal Gemini:
 * šest kreseb 5,8 MB na jedné obrazovce, z toho `grade-4` 1,3 MB proti
 * 145 kB, které tam stály předtím. Po ořezu na obsah a zmenšení
 * (`scripts/crop-illustration.mjs --max 420`) je to 1,6 MB a na obrazovce
 * není rozdíl poznat.
 */
const BY_GRADE: Record<number, string> = {
  1: gradeSoon,
  2: grade2,
  3: grade3,
  4: grade4,
  5: grade5,
  6: grade6,
  7: gradeSoon,
  8: gradeSoon,
  9: gradeSoon,
};

/** Portrét pro daný ročník, nebo `null` když pro něj kresba není. */
export function gradeIllustration(grade: number): string | null {
  return BY_GRADE[grade] ?? null;
}
