/**
 * České skloňování a zdrobněliny křestních jmen pro oslovení dětí.
 * Každé jméno má: vocative (5. pád) + diminutives (zdrobněliny ve vokativu).
 * Zdroj: Zdrobneliny_Evzen.xlsx
 */

interface NameForms {
  vocative: string;
  diminutives: string[];
}

const NAME_TABLE: Record<string, NameForms> = {
  // ── Chlapecká jména ─────────────────────────────────────────
  Adam:      { vocative: "Adame",      diminutives: ["Adámku"] },
  Aleš:      { vocative: "Aleši",      diminutives: [] },
  Alex:      { vocative: "Alexi",      diminutives: [] },
  Antonín:   { vocative: "Antoníne",   diminutives: ["Toníku", "Tondo"] },
  Benjamin:  { vocative: "Benjamine",  diminutives: ["Beni"] },
  Daniel:    { vocative: "Danieli",    diminutives: ["Danku", "Daníku"] },
  David:     { vocative: "Davide",     diminutives: ["Davídku"] },
  Denis:     { vocative: "Denisi",     diminutives: ["Denisku", "Deníseku"] },
  Dominik:   { vocative: "Dominiku",   diminutives: ["Dominiku"] },
  Eduard:    { vocative: "Eduarde",    diminutives: ["Edíku"] },
  Eliáš:     { vocative: "Eliáši",     diminutives: ["Eliášku"] },
  Erik:      { vocative: "Eriku",      diminutives: ["Eriku"] },
  Felix:     { vocative: "Felixi",     diminutives: ["Felixku"] },
  Filip:     { vocative: "Filipe",     diminutives: ["Filípku"] },
  František: { vocative: "Františku",  diminutives: ["Frantíku"] },
  Gabriel:   { vocative: "Gabrieli",   diminutives: [] },
  Hugo:      { vocative: "Hugo",       diminutives: [] },
  Ivan:      { vocative: "Ivane",      diminutives: ["Ivánku"] },
  Jakub:     { vocative: "Jakube",     diminutives: ["Kubíku", "Kubo"] },
  Jan:       { vocative: "Jane",       diminutives: ["Honzíku", "Jeníku"] },
  Jindřich:  { vocative: "Jindřichu",  diminutives: ["Jindro"] },
  Jiří:      { vocative: "Jiří",       diminutives: ["Jirko"] },
  Josef:     { vocative: "Josefe",     diminutives: ["Pepíku"] },
  Kamil:     { vocative: "Kamile",     diminutives: ["Kamo"] },
  Karel:     { vocative: "Karle",      diminutives: ["Karlíku", "Karlíčku"] },
  Kryštof:   { vocative: "Kryštofe",   diminutives: ["Kryštofku"] },
  Libor:     { vocative: "Libore",     diminutives: ["Liborku"] },
  Lukáš:     { vocative: "Lukáši",     diminutives: [] }, // POZOR — bez zdrobněliny
  Marek:     { vocative: "Marku",      diminutives: ["Marečku"] },
  Martin:    { vocative: "Martine",    diminutives: ["Martínku"] },
  Matěj:     { vocative: "Matěji",     diminutives: ["Matýsku"] },
  Matyáš:    { vocative: "Matyáši",    diminutives: ["Matyášku"] },
  Max:       { vocative: "Maxi",       diminutives: ["Maxíku"] },
  Michal:    { vocative: "Michale",    diminutives: ["Míšo"] },
  Michael:   { vocative: "Michaeli",   diminutives: ["Míšo"] },
  Milan:     { vocative: "Milane",     diminutives: ["Milanku"] },
  Miloš:     { vocative: "Miloši",     diminutives: ["Milošku"] },
  Miroslav:  { vocative: "Miroslave",  diminutives: ["Mirku", "Mirečku"] },
  Oldřich:   { vocative: "Oldřichu",   diminutives: ["Oldo"] },
  Oliver:    { vocative: "Olivere",    diminutives: ["Oliverku"] },
  Ondřej:    { vocative: "Ondřeji",    diminutives: ["Ondro"] },
  Patrik:    { vocative: "Patriku",    diminutives: ["Patriku", "Paťo"] },
  Pavel:     { vocative: "Pavle",      diminutives: ["Pavlíku"] },
  Petr:      { vocative: "Petře",      diminutives: ["Petříku", "Péťo"] },
  Radek:     { vocative: "Radku",      diminutives: [] },
  Radim:     { vocative: "Radime",     diminutives: ["Radimku"] },
  Richard:   { vocative: "Richarde",   diminutives: ["Ríšo"] },
  Robert:    { vocative: "Roberte",    diminutives: ["Robe"] },
  Robin:     { vocative: "Robine",     diminutives: [] },
  Roman:     { vocative: "Romane",     diminutives: ["Romíku"] },
  Samuel:    { vocative: "Samueli",    diminutives: ["Same", "Samíku"] },
  Sebastián: { vocative: "Sebastiáne", diminutives: ["Sebi"] },
  Stanislav: { vocative: "Stanislave", diminutives: ["Stando"] },
  Šimon:     { vocative: "Šimone",     diminutives: ["Šimonku"] },
  Štěpán:    { vocative: "Štěpáne",    diminutives: ["Štěpánku"] },
  Tadeáš:    { vocative: "Tadeáši",    diminutives: ["Tadeášku", "Tádíku"] },
  Thomáš:    { vocative: "Thomáši",    diminutives: ["Tomíku", "Tome"] },
  Tomáš:     { vocative: "Tomáši",     diminutives: ["Tomíku", "Tome"] },
  Václav:    { vocative: "Václave",    diminutives: ["Vašíku", "Vašku"] },
  Viktor:    { vocative: "Viktore",    diminutives: ["Viki"] },
  Vilém:     { vocative: "Viléme",     diminutives: ["Vildo"] },
  Vít:       { vocative: "Víte",       diminutives: ["Vítku", "Víťo"] },
  Vladimír:  { vocative: "Vladimíre",  diminutives: ["Vlado"] },
  Vojtěch:   { vocative: "Vojtěchu",   diminutives: ["Vojto"] },
  Zbyněk:    { vocative: "Zbyňku",     diminutives: ["Zbyňku"] },
  Zdeněk:    { vocative: "Zdeňku",     diminutives: ["Zdeňku"] },

  // ── Dívčí jména ─────────────────────────────────────────────
  Adéla:     { vocative: "Adélo",      diminutives: ["Adélko"] },
  Agáta:     { vocative: "Agáto",      diminutives: ["Agátko"] },
  Alexandra: { vocative: "Alexandro",  diminutives: ["Sašo"] },
  Alice:     { vocative: "Alice",      diminutives: ["Ali"] },
  Alžběta:   { vocative: "Alžběto",    diminutives: ["Alžbětko", "Bětko"] },
  Amálie:    { vocative: "Amálie",     diminutives: ["Amálko"] },
  Andrea:    { vocative: "Andreo",     diminutives: ["Andrejko"] },
  Aneta:     { vocative: "Aneto",      diminutives: ["Anetko"] },
  Anežka:    { vocative: "Anežko",     diminutives: ["Aničko"] },
  Anna:      { vocative: "Anno",       diminutives: ["Aničko"] },
  Barbora:   { vocative: "Barbaro",    diminutives: ["Baruško", "Báro"] },
  Denisa:    { vocative: "Deniso",     diminutives: ["Denisko"] },
  Diana:     { vocative: "Diano",      diminutives: ["Dianko"] },
  Dominika:  { vocative: "Dominiko",   diminutives: ["Domčo"] },
  Eliška:    { vocative: "Eliško",     diminutives: ["Eliášku"] },
  Emma:      { vocative: "Emmo",       diminutives: ["Emmičko", "Emko"] },
  Eva:       { vocative: "Evo",        diminutives: ["Evičko", "Evko"] },
  Gabriela:  { vocative: "Gabrielo",   diminutives: ["Gábi", "Gábinko"] },
  Hana:      { vocative: "Hano",       diminutives: ["Hanko", "Haničko"] },
  Helena:    { vocative: "Heleno",     diminutives: ["Helenko"] },
  Ivana:     { vocative: "Ivano",      diminutives: ["Ivanko"] },
  Jana:      { vocative: "Jano",       diminutives: ["Janičko", "Janko"] },
  Jitka:     { vocative: "Jitko",      diminutives: ["Jiťo"] },
  Julie:     { vocative: "Julie",      diminutives: ["Juli"] },
  Kamila:    { vocative: "Kamilo",     diminutives: ["Kamčo"] },
  Karolína:  { vocative: "Karolíno",   diminutives: ["Karolínko"] },
  Kateřina:  { vocative: "Kateřino",   diminutives: ["Katko", "Kačenko"] },
  Klára:     { vocative: "Kláro",      diminutives: ["Klárko"] },
  Kristýna:  { vocative: "Kristýno",   diminutives: ["Kristynko"] },
  Laura:     { vocative: "Lauro",      diminutives: ["Laurinko"] },
  Lenka:     { vocative: "Lenko",      diminutives: ["Leni", "Leničko"] },
  Linda:     { vocative: "Lindo",      diminutives: ["Linduško"] },
  Lucie:     { vocative: "Lucie",      diminutives: ["Lucko", "Luci"] },
  Magdaléna: { vocative: "Magdaléno",  diminutives: ["Majdo", "Majko"] },
  Markéta:   { vocative: "Markéto",    diminutives: ["Markétko", "Marki"] },
  Marie:     { vocative: "Marie",      diminutives: ["Mařenko"] },
  Marta:     { vocative: "Marto",      diminutives: ["Martičko", "Marti"] },
  Martina:   { vocative: "Martino",    diminutives: ["Martičko"] },
  Michaela:  { vocative: "Michaelo",   diminutives: ["Míšo"] },
  Monika:    { vocative: "Moniko",     diminutives: ["Mončo"] },
  Natálie:   { vocative: "Natálie",    diminutives: ["Natálko"] },
  Nela:      { vocative: "Nelo",       diminutives: ["Neli", "Nelinko"] },
  Nikola:    { vocative: "Nikolo",     diminutives: ["Nikolko"] },
  Petra:     { vocative: "Petro",      diminutives: ["Petruško", "Peti"] },
  Radka:     { vocative: "Radko",      diminutives: ["Ráďo"] },
  Renata:    { vocative: "Renato",     diminutives: ["Renatko", "Rendo"] },
  Rozálie:   { vocative: "Rozálie",    diminutives: ["Rozičko"] },
  Sára:      { vocative: "Sáro",       diminutives: ["Sári"] },
  Simona:    { vocative: "Simono",     diminutives: ["Simonko", "Simčo"] },
  Sofie:     { vocative: "Sofie",      diminutives: ["Sofinko"] },
  Soňa:      { vocative: "Soňo",       diminutives: ["Soni"] },
  Šárka:     { vocative: "Šárko",      diminutives: ["Šári"] },
  Tereza:    { vocative: "Terezo",     diminutives: ["Terezko", "Terko"] },
  Vendula:   { vocative: "Vendulo",    diminutives: ["Vendo"] },
  Veronika:  { vocative: "Veroniko",   diminutives: ["Verunko"] },
  Viola:     { vocative: "Violo",      diminutives: ["Violko"] },
  Zuzana:    { vocative: "Zuzano",     diminutives: ["Zuzanko", "Zuzi", "Zuzko"] },
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
