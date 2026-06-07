import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface QA { q: string; a: string; opts: string[]; e: string }

const POOL_L1: QA[] = [
  { q: "Co popisujeme v popisu předmětu?", a: "tvar, barva, materiál, velikost, účel", opts: ["tvar, barva, materiál, velikost, účel", "pocity a dojmy", "příběh o předmětu", "historii předmětu"], e: "Popis předmětu zachycuje jeho vlastnosti — jak vypadá (tvar, barva), z čeho je (materiál), jak velký je a k čemu slouží. Pocity, příběh ani historie sem nepatří, ty bychom psali do vypravování nebo úvahy." },
  { q: "Jaký postup platí při popisu předmětu?", a: "od celku k detailu", opts: ["od celku k detailu", "od detailu k celku", "libovolně", "vždy abecedně"], e: "Nejdřív řekneme, co věc celkově je a jak vypadá, pak teprve doplníme podrobnosti. Kdybychom začali u jednoho detailu nebo popisovali náhodně, čtenář by si věc nedokázal poskládat." },
  { q: "Co popisujeme v popisu osoby?", a: "vzhled (vlasy, oči, postava) a povaha (vlastnosti)", opts: ["vzhled (vlasy, oči, postava) a povaha (vlastnosti)", "jen oblečení", "jen věk a jméno", "jen co dělá"], e: "Dobrý popis osoby spojuje to, jak člověk vypadá (vzhled), s tím, jaký je (povaha). Jen oblečení nebo jen věk a jméno by k představě člověka nestačily." },
  { q: "Popis pracovního postupu musí být:", a: "chronologický (seřazený po krocích)", opts: ["chronologický (seřazený po krocích)", "nechronologický", "volný bez pořadí", "poetický"], e: "Pracovní postup popisuje, jak něco udělat krok za krokem, proto musí jít v pořadí od prvního kroku k poslednímu. Kdyby kroky byly přeházené, postup by nešel provést." },
  { q: "Typická slovesa v popisu pracovního postupu:", a: "přidáme, smíchejte, vložíme, ohřejeme", opts: ["přidáme, smíchejte, vložíme, ohřejeme", "byl, šel, řekl, spatřil", "byl jednou jeden, daleko od nás", "možná, snad, asi, pravděpodobně"], e: "Pracovní postup říká, co máme dělat, proto používá slovesa činnosti v přítomném čase nebo rozkazu (přidáme, smíchejte). Slovesa v minulém čase (byl, šel) patří do vypravování." },
  { q: "Popis osoby — fyzické vlastnosti:", a: "vysoký, rusovlasý, modrooký, štíhlý", opts: ["vysoký, rusovlasý, modrooký, štíhlý", "odvážný, lstivý, upřímný", "hodný, zlý, veselý", "rychlý, pomalý, lhostejný"], e: "Fyzické (vnější) vlastnosti popisují, jak člověk vypadá — výšku, barvu vlasů a očí, postavu. Slova jako odvážný nebo hodný popisují povahu, ne vzhled." },
  { q: "Popis osoby — psychické vlastnosti:", a: "odvážný, lstivý, upřímný, laskavý", opts: ["odvážný, lstivý, upřímný, laskavý", "vysoký, rusovlasý, modrooký", "štíhlý, tmavovlasý, zelený", "rychlý, pomalý, hlasitý"], e: "Psychické (povahové) vlastnosti popisují, jaký člověk je uvnitř — jak se chová a jedná. Slova jako vysoký nebo rusovlasý popisují vzhled, ne povahu." },
  { q: "Recept na koláč je příkladem:", a: "popisu pracovního postupu", opts: ["popisu pracovního postupu", "popisu osoby", "popisu předmětu", "vypravování"], e: "Recept říká krok za krokem, jak něco připravit, proto je to popis pracovního postupu. Nepopisuje, jak koláč vypadá (to by byl popis předmětu), ani nevypráví příběh." },
  { q: "Při popisu věci začínáme:", a: "celkovým pohledem (co to je, jak to vypadá)", opts: ["celkovým pohledem (co to je, jak to vypadá)", "detailem (barva jedné součástky)", "historií výroby", "jak věc získáme v obchodě"], e: "Postupujeme od celku k detailu, proto nejdřív řekneme, co věc je a jak celkově vypadá. Drobný detail nebo historie výroby na úvod čtenáře jen zmate." },
  { q: "Při popisu osoby začínáme:", a: "celkovým dojmem nebo výrazným rysem", opts: ["celkovým dojmem nebo výrazným rysem", "jménem a rodným číslem", "detailem nosu", "historií rodiny"], e: "I u osoby jdeme od celku k detailu — začneme celkovým dojmem nebo tím, co je na člověku nejvýraznější. Rodné číslo nebo detail nosu na úvod nepatří." },
  { q: "Jaký text je příkladem popisu pracovního postupu?", a: "Nejprve smícháme mouku s vejci. Přidáme cukr. Vložíme do trouby.", opts: ["Nejprve smícháme mouku s vejci. Přidáme cukr. Vložíme do trouby.", "Bylo to krásné ráno a Petr šel do lesa.", "V muzeu visí obraz od Picassa.", "Slůně je velké šedivé zvíře."], e: "Tento text vede čtenáře krok za krokem (nejprve, přidáme, vložíme) — to je pracovní postup. Ostatní věty vypráví příběh nebo popisují, jak něco vypadá." },
  { q: "Co je charakteristické pro popis předmětu?", a: "objektivní, věcný, bez příběhu", opts: ["objektivní, věcný, bez příběhu", "emotivní, s příběhem", "chronologický sled kroků", "rýmování"], e: "Popis předmětu má být věcný a objektivní — uvádí fakta o věci, ne pocity ani příběh. Chronologický sled kroků je znak pracovního postupu, ne popisu předmětu." },
  { q: "Popis osoby může být:", a: "přímý (autor říká vlastnosti) nebo nepřímý (z jednání)", opts: ["přímý (autor říká vlastnosti) nebo nepřímý (z jednání)", "jen přímý", "jen nepřímý", "jen prostřednictvím jiné osoby"], e: "Charakteristiku osoby můžeme podat dvěma způsoby: přímo (autor řekne 'je odvážný') nebo nepřímo (ukáže odvážné jednání). Oba způsoby jsou správné, proto možnosti 'jen přímý' a 'jen nepřímý' nejsou úplné." },
  { q: "Popis pracovního postupu používá:", a: "časová slova: nejprve, pak, potom, nakonec", opts: ["časová slova: nejprve, pak, potom, nakonec", "pohádkové formule: byl jednou...", "zvolací věty: To je skvělé!", "tázací věty: Proč to děláme?"], e: "Aby šly kroky poznat v pořadí, používá pracovní postup časová slova jako nejprve, pak, nakonec. Pohádkové formule patří do vypravování a zvolací věty vyjadřují cit, ne pořadí." },
  { q: "Příklad přímé charakteristiky:", a: "Petr je velmi odvážný a vždy pomůže ostatním.", opts: ["Petr je velmi odvážný a vždy pomůže ostatním.", "Petr skočil do řeky, aby zachránil tonoucího.", "Petr řekl: 'Zachráním tě!'", "Petr byl odměněn za statečnost."], e: "Přímá charakteristika vlastnost přímo pojmenuje — věta říká rovnou 'je odvážný'. Ostatní možnosti vlastnost jen naznačují přes jednání nebo řeč, to je charakteristika nepřímá." },
  { q: "Příklad nepřímé charakteristiky:", a: "Skočil do řeky, aby zachránil tonoucího — je odvážný.", opts: ["Skočil do řeky, aby zachránil tonoucího — je odvážný.", "Petr je odvážný.", "Řekli o Petrovi, že je odvážný.", "Petr dostal vyznamenání."], e: "Nepřímá charakteristika vlastnost neřekne přímo, ale ukáže ji na chování — z odvážného činu poznáme, že je Petr odvážný. Věta 'Petr je odvážný' vlastnost pojmenuje přímo." },
];

const POOL_L2: QA[] = [
  { q: "Jaký je správný popis tužky?", a: "Tužka je dřevěná, válcovitá, 19 cm dlouhá, s grafitovým hrotem.", opts: ["Tužka je dřevěná, válcovitá, 19 cm dlouhá, s grafitovým hrotem.", "Tužka je krásná a já ji mám rád.", "Byl jednou jeden pastelník.", "Tužky jsou v obchodě."], e: "Správný popis uvádí konkrétní vlastnosti — materiál, tvar, rozměr, části. Věta 'je krásná a mám ji rád' vyjadřuje jen pocit, ne popis, a 'byl jednou jeden' začíná pohádku." },
  { q: "Jaký je správný popis osoby (fyzický)?", a: "Jan je vysoký, tmavovlasý, s modrýma očima a sportovní postavou.", opts: ["Jan je vysoký, tmavovlasý, s modrýma očima a sportovní postavou.", "Jan je hodný a má rád fotbal.", "Jan žil v malém městě.", "Jan říkal: 'Jsem vysoký.'"], e: "Fyzický popis uvádí znaky vzhledu — výšku, vlasy, oči, postavu. 'Je hodný a má rád fotbal' popisuje povahu a zájmy, ne vzhled, a 'žil v malém městě' je údaj z vypravování." },
  { q: "Co chybí v popisu pracovního postupu: '1. Vezmi mouku. 2. Přidej vejce. 3. ... 4. Upečeme koláč.'?", a: "Chybí krok č. 3 — přidání dalších ingrediencí nebo smíchání", opts: ["Chybí krok č. 3 — přidání dalších ingrediencí nebo smíchání", "Nic nechybí", "Chybí datum", "Chybí jméno autora"], e: "Mezi 'přidej vejce' a 'upečeme koláč' chybí krok, ve kterém se těsto dodělá a smíchá — bez něj by postup nešel dokončit. Datum ani jméno autora do pracovního postupu nepatří." },
  { q: "Popište polohu detailu v popisu předmětu:", a: "nahoře, dole, vlevo, vpravo, uprostřed, na vrcholu", opts: ["nahoře, dole, vlevo, vpravo, uprostřed, na vrcholu", "pak, potom, nakonec", "prvně, za druhé, za třetí", "hodný, zlý, rychlý"], e: "Polohu částí předmětu vyjadřují slova o místě — nahoře, dole, vlevo, uprostřed. Slova pak, potom označují čas (pracovní postup) a hodný, zlý popisují povahu." },
  { q: "Jak začíná popis pracovního postupu?", a: "Co potřebujeme (suroviny/nářadí) + časové kroky", opts: ["Co potřebujeme (suroviny/nářadí) + časové kroky", "Byl jednou jeden...", "Bylo to v sobotu ráno...", "V muzeu visí..."], e: "Pracovní postup nejdřív uvede, co budeme potřebovat (suroviny, nářadí), a pak vede krok za krokem. 'Byl jednou jeden' i 'bylo to v sobotu ráno' uvozují vypravování." },
  { q: "Příklad správného popisu pracovního postupu krok za krokem:", a: "Nejprve zapni počítač. Potom otevři program. Nakonec ulož soubor.", opts: ["Nejprve zapni počítač. Potom otevři program. Nakonec ulož soubor.", "Počítač je velký. Má klávesnici. Funguje dobře.", "Jednou jsem pracoval na počítači.", "Počítač se dá zapnout stisknutím tlačítka."], e: "Tento text vede uživatele po krocích v pořadí (nejprve, potom, nakonec) — to je pracovní postup. 'Počítač je velký, má klávesnici' jen popisuje, jak věc vypadá." },
  { q: "Co je charakteristické pro dobrý popis předmětu?", a: "přesnost, úplnost, objektivita, vhodné přídavné jméno", opts: ["přesnost, úplnost, objektivita, vhodné přídavné jméno", "emoce a subjektivní hodnocení", "příběh o předmětu", "historické fakty"], e: "Dobrý popis předmětu je přesný, úplný a věcný a vybírá výstižná přídavná jména. Emoce a subjektivní hodnocení do věcného popisu nepatří a příběh je vypravování." },
  { q: "Popis osoby — v jakém pořadí popisujeme?", a: "celkový vzhled → postava → vlasy, oči → oblečení → povaha", opts: ["celkový vzhled → postava → vlasy, oči → oblečení → povaha", "věk → povolání → bydliště → zájmy", "jen to nejdůležitější náhodně", "oblečení → vlasy → věk → jméno"], e: "I u osoby jdeme od celku k detailu a nakonec k povaze: celkový dojem, postava, obličej, oblečení a pak vlastnosti. Výčet věk → povolání → bydliště je spíš osobní údaje než popis vzhledu." },
  { q: "Popis pracovního postupu: 'Přidáme' — jaký je to slovesný tvar?", a: "1. osoba množného čísla, přítomný čas", opts: ["1. osoba množného čísla, přítomný čas", "2. osoba j.č., rozkazovací způsob", "3. osoba j.č., přítomný čas", "neurčitek"], e: "Sloveso 'přidáme' znamená 'my přidáme' — je to 1. osoba množného čísla v přítomném čase. Rozkaz by zněl 'přidej', 3. osoba 'přidá' a neurčitek 'přidat'." },
  { q: "Jaký popis je přesnější?", a: "Koláč byl kulatý, zlatohnědý, asi 25 cm v průměru.", opts: ["Koláč byl kulatý, zlatohnědý, asi 25 cm v průměru.", "Koláč byl pěkný a dobrý.", "Koláč byl z kuchyně.", "Koláč jsem snědl."], e: "Přesnější popis uvádí konkrétní vlastnosti — tvar, barvu, rozměr. 'Pěkný a dobrý' je jen obecné hodnocení a 'snědl jsem ho' je děj, ne popis." },
  { q: "Jak charakterizujeme vlastnosti v nepřímé charakteristice?", a: "Ukazujeme chování, jednání a řeč postavy", opts: ["Ukazujeme chování, jednání a řeč postavy", "Přímo říkáme: 'Je hodný.'", "Ptáme se: 'Je hodný?'", "Opisujeme co říkají jiné postavy o ní"], e: "V nepřímé charakteristice vlastnost neřekneme přímo, ale necháme ji vyplynout z toho, jak postava jedná a mluví. Věta 'je hodný' je naopak charakteristika přímá." },
  { q: "V jakém slohovém útvaru popíšeme, jak upéct chleba?", a: "popis pracovního postupu (recept)", opts: ["popis pracovního postupu (recept)", "vypravování", "popis předmětu", "popis osoby"], e: "Jak něco udělat krok za krokem popisuje pracovní postup, jehož typickým příkladem je recept. Popis předmětu by řekl, jak chléb vypadá, ne jak ho upéct." },
  { q: "Příklad nepřesného popisu předmětu — jaká chyba je v textu: 'Stůl je velký a dobrý.'?", a: "chybí konkrétní rozměry a materiál, 'dobrý' není popisný", opts: ["chybí konkrétní rozměry a materiál, 'dobrý' není popisný", "text je správný", "chybí jen barva", "chybí jen hmotnost"], e: "Slova 'velký' a 'dobrý' jsou příliš obecná a 'dobrý' navíc nic nepopisuje — chybí konkrétní rozměr a materiál (např. 'dřevěný stůl 120 cm dlouhý'). Nejde tedy jen o barvu nebo hmotnost." },
  { q: "Při popisu osoby říkáme:", a: "nejprve vzhled, pak povahu a chování", opts: ["nejprve vzhled, pak povahu a chování", "nejprve povahu, pak vzhled", "libovolně", "jen vzhled"], e: "U popisu osoby jdeme od toho, co je vidět, k tomu, co je uvnitř — nejprve vzhled, potom povaha a chování. Tím čtenáře přirozeně vedeme od celkového dojmu k hlubšímu poznání." },
  { q: "Popis pracovního postupu — slova označující pořadí kroků:", a: "nejprve, pak, potom, dále, nakonec, závěrem", opts: ["nejprve, pak, potom, dále, nakonec, závěrem", "jednou, před lety, dávno", "kdo, co, kde, kdy", "napravo, nalevo, nahoře, dole"], e: "Pořadí kroků označují časová slova nejprve, pak, dále, nakonec. Slova jednou, před lety uvozují vypravování a napravo, nahoře vyjadřují místo, ne pořadí." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : shuffle([...POOL_L1, ...POOL_L2]);
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "Popis předmětu: tvar, barva, materiál, velikost, účel — od celku k detailu",
      "Popis osoby: fyzické vlastnosti (vzhled) + psychické (povaha, chování)",
      "Popis pracovního postupu: chronologické kroky, slovesa jako 'přidáme, smíchejte'",
    ],
    explanation: e,
  }));
}

export const POPISPREDMETUOSOBYAPRACOVNIHOPOSTUPU: TopicMetadata[] = [
  {
    id: "g4-cjl-komunikacni-a-slohova-vychova-slohova-vychova-popis-predmetu-osoby-a-pracovniho-postupu",
    rvpNodeId: "g4-cjl-komunikacni-a-slohova-vychova-slohova-vychova-popis-predmetu-osoby-a-pracovniho-postupu",
    title: "Popis předmětu, osoby a pracovního postupu",
    studentTitle: "Jak popsat věci a lidi",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Komunikační a slohová výchova",
    briefDescription: "Naučíš se správně popisovat věci, osoby i pracovní postup.",
    keywords: ["popis", "předmět", "osoba", "pracovní postup", "charakteristika", "vzhled", "povaha"],
    goals: [
      "Napsat přesný popis předmětu od celku k detailu",
      "Popsat osobu (fyzické i psychické vlastnosti)",
      "Sestavit chronologický popis pracovního postupu",
    ],
    boundaries: ["Bez literárního portrétu", "Bez odborného technického popisu"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Popis předmětu=od celku k detailu; osoby=vzhled+povaha; pracovní postup=kroky v pořadí",
      steps: [
        "Předmět: nejprve co to je a jak vypadá, pak detaily.",
        "Osoba: celkový dojem → vlasy, oči, postava → povaha.",
        "Pracovní postup: nejprve materiály, pak kroky 1, 2, 3...",
      ],
      commonMistake: "Záměna popis a vypravování — popis nemá děj, jen vlastnosti; pracovní postup musí být chronologický",
      example: "Popis tužky: Tužka je dřevěná, válcovitá, 19 cm, s grafitovým hrotem pro psaní.",
    },
  },
];
