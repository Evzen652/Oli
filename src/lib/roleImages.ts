/**
 * Ilustrace pro výběr role (Auth, ChildAuth).
 *
 * ⚠️ DVA OTEVŘENÉ PROBLÉMY — čeká se na kresby z Gemini,
 *    zadání v `docs/ILLUSTRATION_STYLE.md` §5:
 *
 * 1. Styl „Pixar 3D cartoon" nesedí k akvarelovým ilustracím na landing page.
 * 2. Obrázky se tahají za běhu z cizí domény přímo na přihlašovací stránce.
 *    Výsledek se může kdykoli změnit a landing přitom slibuje „žádné odkazy
 *    ven z aplikace".
 *
 * Až budou kresby hotové: uložit do `src/assets/`, vyříznout pozadí přes
 * `scripts/fix-landing-alpha.ps1` a tenhle soubor nahradit importy.
 *
 * Přepsat sem jen jiný prompt NESTAČÍ — vyzkoušeno, flux na 256 px zadání
 * neudrží (ignoroval pohlaví, barvu vlasů i oblečení).
 */
const p = (prompt: string, seed: number) =>
  `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=256&height=256&model=flux&nologo=true&seed=${seed}`;

export const ROLE_IMAGES = {
  parent: p(
    "friendly adult parent smiling warmly, Pixar 3D cartoon style, soft emerald green background, centered character portrait, no text, no words, clean simple illustration",
    42
  ),
  child: p(
    "cute cheerful schoolchild with purple backpack, Pixar 3D cartoon style, soft violet purple background, centered character portrait, no text, no words, clean simple illustration",
    7
  ),
};
