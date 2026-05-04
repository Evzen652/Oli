/**
 * České skloňování a zdrobněliny křestních jmen pro oslovení dětí.
 * Každé jméno má: vocative (5. pád) + diminutives (zdrobněliny ve vokativu).
 */

interface NameForms {
  vocative: string;
  diminutives: string[];
}

const NAME_TABLE: Record<string, NameForms> = {
  // ── Chlapecká jména ─────────────────────────────────────────
  Adam:      { vocative: "Adame",    diminutives: ["Adámku", "Adámečku"] },
  Aleš:      { vocative: "Aleši",    diminutives: ["Alešku"] },
  Daniel:    { vocative: "Danieli",  diminutives: ["Danku", "Daníčku"] },
  David:     { vocative: "Davide",   diminutives: ["Davídku", "Davíčku"] },
  Dominik:   { vocative: "Dominiku", diminutives: ["Domináčku", "Dominiku"] },
  Filip:     { vocative: "Filipe",   diminutives: ["Filípku", "Filipku"] },
  František: { vocative: "Františku", diminutives: ["Frantíku", "Frantíčku"] },
  Jakub:     { vocative: "Jakube",   diminutives: ["Kubíku", "Kube", "Kubečku"] },
  Jan:       { vocative: "Jane",     diminutives: ["Honzíku", "Jeníku", "Honzičku"] },
  Jindřich:  { vocative: "Jindřichu", diminutives: ["Jindro", "Jindříčku"] },
  Josef:     { vocative: "Josefe",   diminutives: ["Pepíku", "Pepičku"] },
  Jiří:      { vocative: "Jiří",     diminutives: ["Jirko", "Jirečku", "Jiříčku"] },
  Karel:     { vocative: "Karle",    diminutives: ["Karlíku", "Karlíčku"] },
  Lukáš:     { vocative: "Lukáši",   diminutives: ["Lukáštíku", "Lukáštíčku"] },
  Marek:     { vocative: "Marku",    diminutives: ["Marečku", "Maruško"] },
  Martin:    { vocative: "Martine",  diminutives: ["Martínku", "Martíčku"] },
  Matěj:     { vocative: "Matěji",   diminutives: ["Matýsku", "Matějku"] },
  Matyáš:    { vocative: "Matyáši",  diminutives: ["Matyášku"] },
  Michal:    { vocative: "Michale",  diminutives: ["Míšo", "Michalek", "Míšečku"] },
  Milan:     { vocative: "Milane",   diminutives: ["Milanku", "Miláčku"] },
  Miroslav:  { vocative: "Miroslave", diminutives: ["Mirku", "Mirečku"] },
  Ondřej:    { vocative: "Ondřeji",  diminutives: ["Ondro", "Ondříku", "Ondříčku"] },
  Pavel:     { vocative: "Pavle",    diminutives: ["Pavlíku", "Pavlíčku"] },
  Petr:      { vocative: "Petře",    diminutives: ["Petříku", "Péťo", "Petříčku"] },
  Radek:     { vocative: "Radku",    diminutives: ["Radečku", "Radíčku"] },
  Richard:   { vocative: "Richarde", diminutives: ["Ríšo", "Richardku"] },
  Robert:    { vocative: "Roberte",  diminutives: ["Robíku", "Robertku"] },
  Roman:     { vocative: "Romane",   diminutives: ["Románku", "Romíčku"] },
  Samuel:    { vocative: "Samueli",  diminutives: ["Samku", "Samíčku"] },
  Stanislav: { vocative: "Stanislave", diminutives: ["Stando", "Stáňo", "Stanisku"] },
  Štěpán:    { vocative: "Štěpáne",  diminutives: ["Štěpánku", "Štěpáníčku"] },
  Thomáš:    { vocative: "Thomáši",  diminutives: ["Tomíku", "Tome", "Tomáštíku"] },
  Tomáš:     { vocative: "Tomáši",   diminutives: ["Tomíku", "Tome", "Tomáštíku"] },
  Václav:    { vocative: "Václave",  diminutives: ["Vašíku", "Vašku", "Vašečku"] },
  Vladimír:  { vocative: "Vladimíre", diminutives: ["Vladimírku", "Vlado"] },
  Vojtěch:   { vocative: "Vojtěchu", diminutives: ["Vojtíku", "Vojto", "Vojtíčku"] },
  Zdeněk:    { vocative: "Zdeňku",   diminutives: ["Zdeňku", "Zdendíku"] },

  // ── Dívčí jména ─────────────────────────────────────────────
  Adéla:     { vocative: "Adélo",    diminutives: ["Adélko", "Adélečko"] },
  Alžběta:   { vocative: "Alžběto",  diminutives: ["Alžbětko", "Betko", "Betičko"] },
  Andrea:    { vocative: "Andreo",   diminutives: ["Andrejko", "Andrejičko"] },
  Anna:      { vocative: "Anno",     diminutives: ["Aničko", "Aničko"] },
  Barbora:   { vocative: "Barbaro",  diminutives: ["Baruško", "Báro", "Baruštičko"] },
  Denisa:    { vocative: "Deniso",   diminutives: ["Denisko", "Denisičko"] },
  Dominika:  { vocative: "Dominiko", diminutives: ["Dominičko", "Domčo"] },
  Eliška:    { vocative: "Eliško",   diminutives: ["Elišičko", "Elko"] },
  Eva:       { vocative: "Evo",      diminutives: ["Evičko", "Evko"] },
  Jana:      { vocative: "Jano",     diminutives: ["Janičko", "Jánko"] },
  Jitka:     { vocative: "Jitko",    diminutives: ["Jitičko", "Jiticko"] },
  Karolína:  { vocative: "Karolíno", diminutives: ["Karolínko", "Karlíčko"] },
  Kateřina:  { vocative: "Kateřino", diminutives: ["Katko", "Katičko", "Kačenko"] },
  Klára:     { vocative: "Kláro",    diminutives: ["Klárko", "Klárečko"] },
  Kristýna:  { vocative: "Kristýno", diminutives: ["Krysťo", "Kristynko"] },
  Lenka:     { vocative: "Lenko",    diminutives: ["Lenuško", "Leničko"] },
  Lucie:     { vocative: "Lucie",    diminutives: ["Lucko", "Lucičko", "Lucínko"] },
  Markéta:   { vocative: "Markéto",  diminutives: ["Markétko", "Baruško"] },
  Marie:     { vocative: "Marie",    diminutives: ["Mařenko", "Márjo", "Marijko"] },
  Martina:   { vocative: "Martino",  diminutives: ["Martínko", "Martinečko"] },
  Michaela:  { vocative: "Michaelo", diminutives: ["Míšo", "Michaelko"] },
  Monika:    { vocative: "Moniko",   diminutives: ["Moničko", "Mončo"] },
  Nikola:    { vocative: "Nikolo",   diminutives: ["Nikolko", "Nikoličko"] },
  Petra:     { vocative: "Petro",    diminutives: ["Petruško", "Petřičko", "Petínko"] },
  Renata:    { vocative: "Renato",   diminutives: ["Renatko", "Renátko"] },
  Simona:    { vocative: "Simono",   diminutives: ["Simonko", "Simonečko"] },
  Tereza:    { vocative: "Terezo",   diminutives: ["Terezko", "Terezičko", "Tereztičko"] },
  Veronika:  { vocative: "Veroniko", diminutives: ["Verunko", "Veroničko"] },
  Zuzana:    { vocative: "Zuzano",   diminutives: ["Zuzanko", "Zuzičko", "Zuzko"] },
};

/** Pravidlový vokativ pro neznámá jména (záloha). */
function ruleBasedVocative(name: string): string {
  if (!name) return name;
  const n = name;
  const last = n.slice(-1).toLowerCase();
  const last2 = n.slice(-2).toLowerCase();

  if (last === "š" || last === "č" || last === "ž" || last === "ř") return n + "i";
  if (last === "j") return n + "i";
  if (last === "l") return n + "e";
  if (last === "n" && last2 !== "an") return n + "e";
  if (last2 === "an") return n + "e";
  if (last === "r") return n.slice(0, -1) + "ře";
  if (last === "k") return n + "u";
  if (last === "a") return n.slice(0, -1) + "o";
  if (last === "e" || last === "i") return n;
  return n + "e";
}

/** Vrátí vokativ jména (5. pád pro oslovení). */
export function toVocative(name: string): string {
  return NAME_TABLE[name]?.vocative ?? ruleBasedVocative(name);
}

/** Vrátí zdrobnělinu jména (nebo vokativ pokud není zdrobnělina). */
export function toDiminutive(name: string): string {
  const forms = NAME_TABLE[name];
  if (!forms || forms.diminutives.length === 0) return toVocative(name);
  return forms.diminutives[Math.floor(Math.random() * forms.diminutives.length)];
}

/**
 * Vrátí oslovení — střídá vokativ a zdrobněliny.
 * seed = deterministická hodnota (např. den v měsíci) pro konzistenci v rámci dne.
 */
export function toGreeting(name: string, seed?: number): string {
  const forms = NAME_TABLE[name];
  const options = forms
    ? [forms.vocative, ...forms.diminutives]
    : [ruleBasedVocative(name)];
  const idx = seed !== undefined
    ? seed % options.length
    : Math.floor(Math.random() * options.length);
  return options[idx];
}
