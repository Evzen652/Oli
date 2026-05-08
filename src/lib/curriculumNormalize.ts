/**
 * Normalizace DB názvů kurikula — převod ASCII slugů na čitelné české názvy.
 *
 * DB ukládá jména bez diakritiky (např. "Cisla a operace", "Cestina").
 * Tyto mappingy zajišťují správné zobrazení v UI.
 */

export const SLUG_TO_SUBJECT_LABEL: Record<string, string> = {
  matematika: "Matematika",
  cestina: "Čeština",
  prvouka: "Prvouka",
  prirodoveda: "Přírodověda",
  vlastiveda: "Vlastivěda",
};

export const CATEGORY_NAME_MAP: Record<string, string> = {
  "Cisla a operace": "Čísla a operace",
  "Zakladni pocty": "Čísla a operace",
  "Porovnavani": "Čísla a operace",
  "Vyjmenovana slova": "Vyjmenovaná slova",
  "Diktat": "Diktát",
  "Priroda": "Příroda kolem nás",
  "Priroda kolem nas": "Příroda kolem nás",
  "Clovek a jeho telo": "Člověk a jeho tělo",
  "Lide a spolecnost": "Lidé a společnost",
  "Orientace v prostoru a case": "Orientace v prostoru a čase",
};

export const TOPIC_NAME_MAP: Record<string, string> = {
  "Deleni": "Dělení",
  "Doplnovaci diktat": "Doplňovací diktát",
  "Nasobeni": "Násobení",
  "Parove souhlasky": "Párové souhlásky",
  "Porovnavani cisel": "Porovnávání čísel",
  "Porovnavani zlomku": "Porovnávání zlomků",
  "Rocni obdobi": "Roční období",
  "Scitani a odcitani": "Sčítání a odčítání",
  "Scitani zlomku": "Sčítání zlomků",
  "Tvrde a mekke souhlasky": "Tvrdé a měkké souhlásky",
  "Vyjmenovana slova": "Vyjmenovaná slova",
  "Zvirata": "Zvířata",
};

export function normalizeSubjectLabel(name: string, slug?: string): string {
  if (slug) return SLUG_TO_SUBJECT_LABEL[slug] ?? name;
  return SLUG_TO_SUBJECT_LABEL[name.toLowerCase()] ?? name;
}

export function normalizeCategoryName(name: string): string {
  return CATEGORY_NAME_MAP[name] ?? name;
}

export function normalizeTopicName(name: string): string {
  return TOPIC_NAME_MAP[name] ?? name;
}
