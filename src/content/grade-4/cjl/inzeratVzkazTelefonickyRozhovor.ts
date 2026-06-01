import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface QA { q: string; a: string; opts: string[] }

const POOL_L1: QA[] = [
  { q: "Co musí obsahovat každý inzerát?", a: "stručný popis, kontakt (telefon/e-mail)", opts: ["stručný popis, kontakt (telefon/e-mail)", "záhlaví a datum", "podpis a adresa", "pozdrav a rozloučení"] },
  { q: "Jaký je účel inzerátu?", a: "nabídka nebo poptávka — hledat nebo prodávat", opts: ["nabídka nebo poptávka — hledat nebo prodávat", "psát soukromé zprávy", "opisovat literaturu", "shrnovat příběh"] },
  { q: "Vzkaz musí obsahovat:", a: "kdo, komu, co, kdy", opts: ["kdo, komu, co, kdy", "jen co a kdy", "jen kdo a co", "pozdrav a podpis"] },
  { q: "Jak začíná telefonní hovor?", a: "Představíme se: 'Dobrý den, tady...' nebo 'Haló, tady...'", opts: ["Představíme se: 'Dobrý den, tady...' nebo 'Haló, tady...'", "Rovnou řekneme věc hovoru", "Pozdravíme a počkáme", "Řekneme jen své jméno"] },
  { q: "Jaký je správný způsob ukončení telefonního hovoru?", a: "rozloučíme se: 'Na shledanou', 'Mějte se'", opts: ["rozloučíme se: 'Na shledanou', 'Mějte se'", "jednoduše zavěsíme", "řekneme 'Haló'", "zopakujeme téma hovoru"] },
  { q: "Co je vzkaz?", a: "krátká zpráva místo osobního setkání", opts: ["krátká zpráva místo osobního setkání", "krátký dopis se záhlavím", "telefonní číslo", "inzerát v novinách"] },
  { q: "Jak musí být vzkaz napsán?", a: "čitelně a stručně", opts: ["čitelně a stručně", "velmi dlouze a podrobně", "pouze tiskacím písmem", "rukopisem s kulatými písmeny"] },
  { q: "Co je nabídkový inzerát?", a: "nabízím (prodávám, pronajímám) něco", opts: ["nabízím (prodávám, pronajímám) něco", "hledám (koupím) něco", "žádám o informace", "podávám zprávu"] },
  { q: "Co je poptávkový inzerát?", a: "hledám (koupím) nebo žádám o službu", opts: ["hledám (koupím) nebo žádám o službu", "nabízím (prodávám) něco", "oznamuji ztrátu věci", "dávám zprávu o nalezené věci"] },
  { q: "Příklad správného vzkazku:", a: "Mámo, šel jsem k Honzovi. Budu doma v 17 h. Ondra", opts: ["Mámo, šel jsem k Honzovi. Budu doma v 17 h. Ondra", "Byl jsem pryč.", "Vrátím se.", "Ondra"] },
  { q: "Co je při telefonním hovoru nezdvořilé?", a: "Zavěsit bez rozloučení", opts: ["Zavěsit bez rozloučení", "Představit se na začátku", "Říci věc hovoru", "Pozdravit na konci"] },
  { q: "V inzerátu slova:", a: "jsou stručná, heslovitá — bez zbytečných slov", opts: ["jsou stručná, heslovitá — bez zbytečných slov", "jsou dlouhá a podrobná", "jsou básní nebo rýmem", "jsou vždy v angličtině"] },
  { q: "Příklad správného inzerátu:", a: "Prodám kolo, 20 palců, červené, dobrý stav. Tel.: 123 456 789", opts: ["Prodám kolo, 20 palců, červené, dobrý stav. Tel.: 123 456 789", "Mám krásné kolo a rád bych ho prodal kamarádovi.", "Kolo na prodej. Jsem hodný prodejce.", "Kolo červené. Volejte."] },
  { q: "Kde se inzeráty nejčastěji zveřejňují?", a: "v novinách, na internetu, na nástěnkách", opts: ["v novinách, na internetu, na nástěnkách", "jen v knihách", "jen telefonicky", "jen osobně"] },
  { q: "Vzkaz zanechávám:", a: "když nemohu osobně sdělit zprávu", opts: ["když nemohu osobně sdělit zprávu", "místo dopisu kamarádovi", "vždy před spaním", "jen při nemoci"] },
  { q: "Při telefonním hovoru mluvíme:", a: "jasně, srozumitelně, pomalu", opts: ["jasně, srozumitelně, pomalu", "co nejrychleji", "šeptem", "jen heslovitě"] },
];

const POOL_L2: QA[] = [
  { q: "Vzkaz: 'Táto, jdu na trénink. Přijdu ve 20 h.' — co chybí?", a: "Kdo vzkaz napsal (podpis jménem)", opts: ["Kdo vzkaz napsal (podpis jménem)", "Kdy se vrátí", "Komu je vzkaz určen", "Nic nechybí"] },
  { q: "Inzerát: 'Hledám štěně. Tel. 777 111 222.' — jaký typ?", a: "poptávkový (hledám = chci koupit/získat)", opts: ["poptávkový (hledám = chci koupit/získat)", "nabídkový (prodávám)", "inzerát není správný", "oznamovací sdělení"] },
  { q: "Telefonní hovor — správné pořadí:", a: "pozdrav → představení → věc hovoru → rozloučení", opts: ["pozdrav → představení → věc hovoru → rozloučení", "věc hovoru → pozdrav → rozloučení", "představení → rozloučení → věc hovoru", "jen věc hovoru"] },
  { q: "Inzerát má být stručný. Který inzerát je lepší?", a: "Prodám byt 2+1, Praha 5, 60 m², cena dohodou. Tel. 123...", opts: ["Prodám byt 2+1, Praha 5, 60 m², cena dohodou. Tel. 123...", "Prodávám byt, je velmi hezký, velký, v Praze, zavolejte nám prosím na telefon...", "Byt. Praha. Velký. Tel. 123.", "Prodám."] },
  { q: "Příjemce vzkazku je maminka. Vzkaz napsal Tomáš. Co vzkaz obsahuje?", a: "Komu (mámo), od koho (Tomáš), co, kdy", opts: ["Komu (mámo), od koho (Tomáš), co, kdy", "Jen jméno Tomáš", "Jen co a kdy", "Jen pozdrav a podpis"] },
  { q: "Telefonní hovor s cizím člověkem — jak se správně představíme?", a: "Dobrý den, tady [jméno], volám kvůli...", opts: ["Dobrý den, tady [jméno], volám kvůli...", "Haló, co chcete?", "Jmenuji se, ale neřeknu vám proč volám.", "Přijdu za vámi osobně."] },
  { q: "Při psaní inzerátu je důležité uvést:", a: "konkrétní informace + kontakt", opts: ["konkrétní informace + kontakt", "jen svůj věk", "jen číslo inzerátu", "podrobný životopis"] },
  { q: "Vzkaz 'Jdu ke kamarádovi' — co chybí?", a: "kdo píše, komu, kdy přijde zpět", opts: ["kdo píše, komu, kdy přijde zpět", "nic nechybí", "jen podpis", "jen datum"] },
  { q: "Inzerát 'Ztratil se pes, zlatý retrívr, odměna.' — co MUSÍ obsahovat dál?", a: "kontakt (telefon/e-mail)", opts: ["kontakt (telefon/e-mail)", "celé jméno majitele", "adresu bydliště", "popis okolí, kde pes zmizel"] },
  { q: "Při telefonním hovoru se představíme:", a: "vždy na začátku — aby druhý věděl, kdo volá", opts: ["vždy na začátku — aby druhý věděl, kdo volá", "jen na konci", "pouze při hovoru s cizím člověkem", "nikdy — to není nutné"] },
  { q: "Inzerát o ztracené věci musí obsahovat:", a: "popis věci, kde byla ztracena, kontakt", opts: ["popis věci, kde byla ztracena, kontakt", "jen jméno majitele", "jen cenu věci", "fotku věci"] },
  { q: "Vzkaz zanecháme, když:", a: "nemůžeme osobně říci zprávu adresátovi", opts: ["nemůžeme osobně říci zprávu adresátovi", "chceme napsat dopis", "telefonujeme", "píšeme inzerát"] },
  { q: "Telefonní hovor — jak správně odmítáme neznámé hovory?", a: "zdvořile: 'Promiňte, volali jste na špatné číslo.'", opts: ["zdvořile: 'Promiňte, volali jste na špatné číslo.'", "jen zavěsíme", "řekneme 'kdo jste'", "ignorujeme hovor"] },
  { q: "Inzerát 'Prodám kolo: stáří 2 roky, funkční brzdy, nosnost 80 kg, barva červená.' — jaký druh informací uvádí?", a: "konkrétní technické parametry — správně", opts: ["konkrétní technické parametry — správně", "příliš obecné informace", "nepotřebné osobní informace", "chybí kontakt, jinak správně"] },
  { q: "Vzkazem nahrazujeme:", a: "osobní sdělení, když adresát není přítomen", opts: ["osobní sdělení, když adresát není přítomen", "celý dopis", "telefonní hovor", "inzerát"] },
  { q: "Příklad správné struktury telefonního hovoru:", a: "Dobrý den, tady Pavel Novák. Volám kvůli objednávce. ... Na shledanou.", opts: ["Dobrý den, tady Pavel Novák. Volám kvůli objednávce. ... Na shledanou.", "Haló? Co chcete? Čau.", "Objednávka. Číslo 5. Díky.", "Dobrý den. ... zavěsím."] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : shuffle([...POOL_L1, ...POOL_L2]);
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "Inzerát: stručný, konkrétní, s kontaktem; nabídka (prodávám) nebo poptávka (hledám)",
      "Vzkaz: kdo — komu — co — kdy; čitelný a stručný",
      "Telefonní hovor: pozdrav → představení → věc hovoru → rozloučení",
    ],
    solutionSteps: [
      "Urči typ textu (inzerát / vzkaz / telefonní hovor).",
      "Inzerát: jsou tam konkrétní informace + kontakt?",
      "Vzkaz: je jasné kdo, komu, co, kdy?",
      "Telefonní hovor: správné pořadí pozdrav → věc → rozloučení?",
    ],
  }));
}

export const INZERATVZKAZTELEFONICKYROZHOVOR: TopicMetadata[] = [
  {
    id: "g4-cjl-komunikacni-a-slohova-vychova-slohova-vychova-inzerat-vzkaz-telefonicky-rozhovor",
    rvpNodeId: "g4-cjl-komunikacni-a-slohova-vychova-slohova-vychova-inzerat-vzkaz-telefonicky-rozhovor",
    title: "Inzerát, vzkaz, telefonický rozhovor",
    studentTitle: "Inzerát a vzkaz",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Komunikační a slohová výchova",
    briefDescription: "Naučíš se, jak správně napsat inzerát, zanechat vzkaz a vést telefonní hovor.",
    keywords: ["inzerát", "vzkaz", "telefonický rozhovor", "nabídka", "poptávka", "komunikace"],
    goals: [
      "Napsat správný inzerát (stručný, s kontaktem)",
      "Napsat úplný vzkaz (kdo, komu, co, kdy)",
      "Vést zdvořilý telefonní hovor",
    ],
    boundaries: ["Bez reklamních textů a sloganů", "Bez e-mailové komunikace"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Inzerát=stručný+kontakt; Vzkaz=kdo+komu+co+kdy; Telefonní hovor=pozdrav+jméno+věc+rozloučení",
      steps: [
        "Inzerát: napiš jen to nejdůležitější + kontakt.",
        "Vzkaz: kdo píše? komu? co? kdy?",
        "Telefonní hovor: pozdrav, představ se, řekni věc, rozluč se.",
      ],
      commonMistake: "Vzkaz bez podpisu (nevíme, kdo ho napsal) nebo inzerát bez kontaktu",
      example: "Vzkaz: 'Mámo, jdu k Honzovi. Budu doma v 17 h. Tomáš'; Inzerát: 'Prodám kolo, červené, 20 palců. Tel. 777...'",
    },
  },
];
