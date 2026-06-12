/**
 * Převede řetězec na URL-safe slug bez diakritiky.
 * Sdílená implementace — dříve definována trojitě v:
 *   AdminLayout, AdminGenerateIllustrations, prvoukaVisuals.
 */
export function toSlug(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
