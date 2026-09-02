import grade2 from "@/assets/grade-2.png";
import grade3 from "@/assets/grade-3.png";
import grade4 from "@/assets/grade-4.png";

/**
 * Motiv stěžejního učiva na dlaždicích výběru ročníku.
 *
 * | ročník | první okruh v `src/content/grade-N/navigation.ts` | motiv |
 * |---|---|---|
 * | 2 | „Počítání do 100" | počítadlo |
 * | 3 | „Vyjmenovaná slova" | kniha s písmenem Y |
 * | 4 | „Velká čísla" / „Zlomky" | koláč na čtvrtiny |
 *
 * **Číslo z dlaždice nemizí.** Kresba nedokáže říct „šestý ročník" — dítě ví,
 * do které třídy chodí, a hledá číslo. Motiv přidává kontext, ne identitu,
 * proto je číslo vedle něj jako odznak, ne pod ním.
 *
 * **Záměrně jen ročníky, které mají obsah** (2–4). Zbylých šest je „brzy" a
 * zůstává u holého čísla — rozdíl „hotové / chystá se" je tím vidět na první
 * pohled a nestojí jen na šedivém nápisu BRZY.
 *
 * **Proč ne stávající ilustrace předmětů** (`cat-*.png`, `topic-*.png`):
 * vyzkoušeno a zavrženo. Mají bílé pozadí (na barevné dlaždici z nich je bílý
 * čtverec) a jsou to bledé pastely, které se na syté dlaždici ztratí — na
 * 130 px navíc čtou jako změť. Nové motivy mají tmavou konturu a syté barvy,
 * takže drží samy o sobě a nepotřebují světlé kolečko pod sebou.
 *
 * Kresby vznikly na JEDNOM listu (`ILLUSTRATION_STYLE.md` §5 — samostatná
 * generování rozejdou sytost i konturu), pozadí vyříznuto
 * `scripts/make-logo.ps1 -Thr 242`. Uzavřené díry (mezery mezi kuličkami
 * počítadla) zůstaly správně průhledné — ověřeno složením na sytou barvu,
 * ne pohledem na bílou, kde by se bílý flek neprojevil (§2.5).
 */
const BY_GRADE: Record<number, string> = {
  2: grade2,
  3: grade3,
  4: grade4,
};

/** Portrét pro daný ročník, nebo `null` když pro něj kresba není. */
export function gradeIllustration(grade: number): string | null {
  return BY_GRADE[grade] ?? null;
}
