import pozdrav from "@/assets/oli-pozdrav.png";
import tip from "@/assets/oli-tip.png";

/**
 * Pózy maskota Oli.
 *
 * Sova byla do 2026-09-02 ve všech devíti místech aplikace **stejná** — týž
 * obrázek v logu, v uvítání, u tipu dne i v rodičovském přehledu. Pózy ji
 * odlišují podle kontextu; kresba i barvy jsou shodné, mění se jen postoj.
 *
 * `oli-owl.png` (sova na knihách) zůstává vyhrazená **logu** — je to jediná
 * póza s knihami a tím se od ostatních pozná. Nepoužívej ji jako ilustraci.
 *
 * Kresby vznikly v Gemini z jedné předlohy; zadání a pasti jsou
 * v `docs/LOGO_PROMPT.md`. Pozadí se vyřezává `scripts/make-logo.ps1`.
 *
 * Pozor na poměr stran: obrázky mají **přirozený poměr**, ne čtverec
 * (pozdrav 0,85, tip 0,65). Vykresluj je do čtvercového boxu s
 * `object-contain` — měřítko pak drží velikost hlavy, ne obrys. Ověřeno:
 * v boxu 72 px mají brýle 32 a 31 px, tedy shodně velkou hlavu jako logo.
 */

/** Mává na pozdrav. Uvítání — `Onboarding`, uvítací lišta dítěte. */
export const oliPozdrav = pozdrav;

/** Mrká, křídlo na hrudi. Blok „Tip dne" v dětském rozcestníku. */
export const oliTip = tip;
