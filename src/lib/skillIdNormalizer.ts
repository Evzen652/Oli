/**
 * Skill ID normalizer.
 *
 * Historický dluh: některé ID používají pomlčky (math-add-sub-100),
 * jiné podtržítka (frac_compare_same_den). Normalizér je jednotně mapuje
 * na kanonický tvar (kebab-case) a poskytuje aliasy pro zpětnou kompatibilitu.
 *
 * **Nepřejmenováváme** existující soubory ani DB záznamy — tím by se rozbily
 * uložené úkoly a skill_profiles. Místo toho udržujeme alias mapu a
 * v matchovací logice ji konzultujeme.
 */

/** Aliasy starých ID → kanonické ID */
const ALIAS_MAP: Record<string, string> = {
  // Frakce: podtržítka → pomlčky
  frac_compare_same_den: "frac-compare-same-den",
  frac_compare_diff_den: "frac-compare-diff-den",
  frac_compare_whole: "frac-compare-whole",
  frac_to_mixed: "frac-to-mixed",
  frac_from_mixed: "frac-from-mixed",
  frac_mixed_add: "frac-mixed-add",
  frac_mixed_sub: "frac-mixed-sub",
  frac_mul_whole_basic: "frac-mul-whole-basic",
  frac_mul_whole_reduce: "frac-mul-whole-reduce",
  frac_of_number_simple: "frac-of-number-simple",
  frac_of_number_word: "frac-of-number-word",
  frac_find_whole: "frac-find-whole",

  // Prvouka: prv- vs pr-
  "prv-plants": "pr-plant-parts",
  "prv-seasons": "pr-seasons",
  "prv-animals": "pr-body-parts", // historická chyba

  // Matematika: oba tvary se sčítáním do 20/50/100
  "math-add-sub-20": "math-add-sub-20",
  "math-add-sub-50": "math-add-sub-50",
  "math-add-sub-100": "math-add-sub-100",
};

/** Vrátí kanonický skill ID. Pokud alias není, vrátí původní. */
export function canonicalSkillId(id: string): string {
  return ALIAS_MAP[id] ?? id;
}

/** Vrátí všechny aliasy pro daný kanonický ID (vč. něj samotného) */
export function aliasesOf(canonicalId: string): string[] {
  const result = [canonicalId];
  for (const [alias, canon] of Object.entries(ALIAS_MAP)) {
    if (canon === canonicalId && alias !== canonicalId) result.push(alias);
  }
  return result;
}

/** Pro hledání: zda dva ID odkazují na stejný skill (ber v úvahu aliasy) */
export function isSameSkill(idA: string, idB: string): boolean {
  return canonicalSkillId(idA) === canonicalSkillId(idB);
}
