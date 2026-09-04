import imgRodic from "@/assets/role-rodic.png";
import imgZak from "@/assets/role-zak.png";

/**
 * Ilustrace pro výběr role (Auth, ChildAuth).
 *
 * Akvarel + inkoustová kontura, shodně s ilustracemi na landing page.
 * Dřív se generovaly za běhu z `image.pollinations.ai` ve stylu „Pixar 3D
 * cartoon" — vedle akvarelů to vyčnívalo a přihlašovací stránka kvůli tomu
 * volala z prohlížeče uživatele cizí doménu, ačkoli landing slibuje „žádné
 * odkazy ven z aplikace". Teď jsou to lokální assety.
 *
 * Obě vznikly z jedné kresby (dvojice na jednom listu), aby se nerozešel
 * rukopis. Model ale hlavy nesrovnal — maminčina byla o 22 % větší — takže
 * výřez je vedený podle velikosti hlavy, ne podle obsahu; v obou je hlava
 * 57 % výšky. Postup a rozměry: `docs/ILLUSTRATION_STYLE.md` §5.
 *
 * 256 px stačí: dlaždice je 64 px, tedy 4× rezerva i nad 3× retinou.
 * Pozadí je průhledné, prosvítá jím tint dlaždice (`bg-emerald-100`,
 * `bg-violet-100`).
 */
export const ROLE_IMAGES = {
  parent: imgRodic,
  child: imgZak,
};
