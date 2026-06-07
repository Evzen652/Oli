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
  { q: "Co musí obsahovat každý inzerát?", a: "stručný popis, kontakt (telefon/e-mail)", opts: ["stručný popis, kontakt (telefon/e-mail)", "záhlaví a datum", "podpis a adresa", "pozdrav a rozloučení"], e: "Inzerát má krátce říci, co nabízíš nebo hledáš, a musí mít kontakt, aby se ti čtenář mohl ozvat. Záhlaví, datum, pozdrav a podpis patří do dopisu, ne do inzerátu." },
  { q: "Jaký je účel inzerátu?", a: "nabídka nebo poptávka — hledat nebo prodávat", opts: ["nabídka nebo poptávka — hledat nebo prodávat", "psát soukromé zprávy", "opisovat literaturu", "shrnovat příběh"], e: "Inzerát píšeme, když chceme něco prodat (nabídka) nebo naopak něco sehnat (poptávka). Soukromé zprávy ani převyprávění příběhu sem nepatří, ty mají jiný účel." },
  { q: "Vzkaz musí obsahovat:", a: "kdo, komu, co, kdy", opts: ["kdo, komu, co, kdy", "jen co a kdy", "jen kdo a co", "pozdrav a podpis"], e: "Aby byl vzkaz srozumitelný, musí čtenář poznat, komu je určen, kdo ho napsal, co sděluje a kdy. Když vynecháš třeba 'kdo', adresát neví, od koho vzkaz je." },
  { q: "Jak začíná telefonní hovor?", a: "Představíme se: 'Dobrý den, tady...' nebo 'Haló, tady...'", opts: ["Představíme se: 'Dobrý den, tady...' nebo 'Haló, tady...'", "Rovnou řekneme věc hovoru", "Pozdravíme a počkáme", "Řekneme jen své jméno"], e: "Na začátku hovoru pozdravíme a hned se představíme, aby druhý hned věděl, kdo volá. Kdybys začal rovnou věcí nebo jen mlčel, byl by druhý zmatený." },
  { q: "Jaký je správný způsob ukončení telefonního hovoru?", a: "rozloučíme se: 'Na shledanou', 'Mějte se'", opts: ["rozloučíme se: 'Na shledanou', 'Mějte se'", "jednoduše zavěsíme", "řekneme 'Haló'", "zopakujeme téma hovoru"], e: "Hovor slušně ukončíme rozloučením, stejně jako když se loučíme osobně. Zavěsit beze slova je nezdvořilé a 'Haló' se říká na začátku, ne na konci." },
  { q: "Co je vzkaz?", a: "krátká zpráva místo osobního setkání", opts: ["krátká zpráva místo osobního setkání", "krátký dopis se záhlavím", "telefonní číslo", "inzerát v novinách"], e: "Vzkaz necháváme, když danému člověku nemůžeme něco říct osobně, protože není přítomen. Není to dopis se záhlavím ani inzerát, je to krátké náhradní sdělení." },
  { q: "Jak musí být vzkaz napsán?", a: "čitelně a stručně", opts: ["čitelně a stručně", "velmi dlouze a podrobně", "pouze tiskacím písmem", "rukopisem s kulatými písmeny"], e: "Vzkaz má být krátký a hlavně čitelný, aby ho adresát rychle a snadno přečetl. Dlouhé podrobné psaní nebo předepsaný typ písma nejsou potřeba." },
  { q: "Co je nabídkový inzerát?", a: "nabízím (prodávám, pronajímám) něco", opts: ["nabízím (prodávám, pronajímám) něco", "hledám (koupím) něco", "žádám o informace", "podávám zprávu"], e: "V nabídkovém inzerátu sám něco nabízíš ostatním — prodáváš nebo pronajímáš. Když naopak něco sháníš slovem 'hledám' nebo 'koupím', jde o poptávku." },
  { q: "Co je poptávkový inzerát?", a: "hledám (koupím) nebo žádám o službu", opts: ["hledám (koupím) nebo žádám o službu", "nabízím (prodávám) něco", "oznamuji ztrátu věci", "dávám zprávu o nalezené věci"], e: "Poptávkový inzerát píšeš, když něco potřebuješ získat — proto začíná slovem 'hledám' nebo 'koupím'. Slovem 'prodám' bys naopak něco nabízel, to by byla nabídka." },
  { q: "Příklad správného vzkazku:", a: "Mámo, šel jsem k Honzovi. Budu doma v 17 h. Ondra", opts: ["Mámo, šel jsem k Honzovi. Budu doma v 17 h. Ondra", "Byl jsem pryč.", "Vrátím se.", "Ondra"], e: "Dobrý vzkaz prozradí komu (mámo), co (šel jsem k Honzovi), kdy (v 17 h) a kdo ho psal (Ondra). Ostatní možnosti většinu těchto údajů vynechávají, takže by je adresát nepochopil." },
  { q: "Co je při telefonním hovoru nezdvořilé?", a: "Zavěsit bez rozloučení", opts: ["Zavěsit bez rozloučení", "Představit se na začátku", "Říci věc hovoru", "Pozdravit na konci"], e: "Zavěsit beze slova rozloučení působí hrubě, jako bys odešel uprostřed rozhovoru. Naopak představit se, říct, proč voláš, i pozdravit jsou věci slušné." },
  { q: "V inzerátu slova:", a: "jsou stručná, heslovitá — bez zbytečných slov", opts: ["jsou stručná, heslovitá — bez zbytečných slov", "jsou dlouhá a podrobná", "jsou básní nebo rýmem", "jsou vždy v angličtině"], e: "Inzerát se má přečíst rychle, proto v něm píšeme jen to nejdůležitější heslovitě, bez zbytečných slov. Dlouhé věty, rýmy ani cizí jazyk čtenáře jen zdrží." },
  { q: "Příklad správného inzerátu:", a: "Prodám kolo, 20 palců, červené, dobrý stav. Tel.: 123 456 789", opts: ["Prodám kolo, 20 palců, červené, dobrý stav. Tel.: 123 456 789", "Mám krásné kolo a rád bych ho prodal kamarádovi.", "Kolo na prodej. Jsem hodný prodejce.", "Kolo červené. Volejte."], e: "Správný inzerát uvádí konkrétní údaje (velikost, barvu, stav) i kontakt, na který se dá zavolat. Ostatní možnosti jsou buď upovídané bez údajů, nebo nemají telefonní číslo." },
  { q: "Kde se inzeráty nejčastěji zveřejňují?", a: "v novinách, na internetu, na nástěnkách", opts: ["v novinách, na internetu, na nástěnkách", "jen v knihách", "jen telefonicky", "jen osobně"], e: "Inzerát chceme ukázat co nejvíce lidem, proto ho dáváme tam, kde ho mnoho lidí uvidí — do novin, na internet nebo na nástěnku. V knize ani jen osobně by ho skoro nikdo nenašel." },
  { q: "Vzkaz zanechávám:", a: "když nemohu osobně sdělit zprávu", opts: ["když nemohu osobně sdělit zprávu", "místo dopisu kamarádovi", "vždy před spaním", "jen při nemoci"], e: "Vzkaz píšeme tehdy, když člověku nemůžeme zprávu předat osobně, protože tam zrovna není. Nenahrazuje dopis ani se nepíše v určitou denní dobu nebo jen při nemoci." },
  { q: "Při telefonním hovoru mluvíme:", a: "jasně, srozumitelně, pomalu", opts: ["jasně, srozumitelně, pomalu", "co nejrychleji", "šeptem", "jen heslovitě"], e: "Druhý člověk tě po telefonu nevidí, proto musíš mluvit jasně, srozumitelně a klidně, aby ti dobře rozuměl. Rychlé mluvení, šepot ani heslovité odpovědi by porozumění ztížily." },
];

const POOL_L2: QA[] = [
  { q: "Vzkaz: 'Táto, jdu na trénink. Přijdu ve 20 h.' — co chybí?", a: "Kdo vzkaz napsal (podpis jménem)", opts: ["Kdo vzkaz napsal (podpis jménem)", "Kdy se vrátí", "Komu je vzkaz určen", "Nic nechybí"], e: "Ve vzkazu je komu (táto), co (jdu na trénink) i kdy (ve 20 h), ale chybí podpis — táta neví, kdo z dětí mu vzkaz nechal. Proto je třeba doplnit jméno toho, kdo píše." },
  { q: "Inzerát: 'Hledám štěně. Tel. 777 111 222.' — jaký typ?", a: "poptávkový (hledám = chci koupit/získat)", opts: ["poptávkový (hledám = chci koupit/získat)", "nabídkový (prodávám)", "inzerát není správný", "oznamovací sdělení"], e: "Slovo 'hledám' znamená, že něco sháníš, a to je vždy poptávka. Kdyby tam stálo 'prodám' nebo 'nabízím', šlo by o inzerát nabídkový." },
  { q: "Telefonní hovor — správné pořadí:", a: "pozdrav → představení → věc hovoru → rozloučení", opts: ["pozdrav → představení → věc hovoru → rozloučení", "věc hovoru → pozdrav → rozloučení", "představení → rozloučení → věc hovoru", "jen věc hovoru"], e: "Hovor vedeme jako slušný rozhovor: nejdřív pozdravíme a představíme se, pak řekneme, proč voláme, a nakonec se rozloučíme. Začít rovnou věcí nebo se loučit dřív, než něco řekneš, nedává smysl." },
  { q: "Inzerát má být stručný. Který inzerát je lepší?", a: "Prodám byt 2+1, Praha 5, 60 m², cena dohodou. Tel. 123...", opts: ["Prodám byt 2+1, Praha 5, 60 m², cena dohodou. Tel. 123...", "Prodávám byt, je velmi hezký, velký, v Praze, zavolejte nám prosím na telefon...", "Byt. Praha. Velký. Tel. 123.", "Prodám."], e: "Dobrý inzerát je krátký, ale uvádí konkrétní údaje (velikost, místo, cenu) i kontakt. Upovídaná verze obsahuje zbytečná slova, příliš strohá zase důležité údaje vynechává." },
  { q: "Příjemce vzkazku je maminka. Vzkaz napsal Tomáš. Co vzkaz obsahuje?", a: "Komu (mámo), od koho (Tomáš), co, kdy", opts: ["Komu (mámo), od koho (Tomáš), co, kdy", "Jen jméno Tomáš", "Jen co a kdy", "Jen pozdrav a podpis"], e: "Úplný vzkaz musí mít všechny čtyři údaje: komu je určen, kdo ho psal, co sděluje a kdy. Kdyby chyběl některý z nich, maminka by vzkaz nepochopila celý." },
  { q: "Telefonní hovor s cizím člověkem — jak se správně představíme?", a: "Dobrý den, tady [jméno], volám kvůli...", opts: ["Dobrý den, tady [jméno], volám kvůli...", "Haló, co chcete?", "Jmenuji se, ale neřeknu vám proč volám.", "Přijdu za vámi osobně."], e: "Cizího člověka slušně pozdravíme, řekneme své jméno a hned i důvod hovoru, aby věděl, s kým a o čem mluví. 'Haló, co chcete?' je hrubé a zatajit důvod hovoru je matoucí." },
  { q: "Při psaní inzerátu je důležité uvést:", a: "konkrétní informace + kontakt", opts: ["konkrétní informace + kontakt", "jen svůj věk", "jen číslo inzerátu", "podrobný životopis"], e: "Aby inzerát fungoval, musí čtenář vědět, oč jde (konkrétní údaje), a mít možnost se ozvat (kontakt). Tvůj věk ani životopis nikoho zajímat nebudou." },
  { q: "Vzkaz 'Jdu ke kamarádovi' — co chybí?", a: "kdo píše, komu, kdy přijde zpět", opts: ["kdo píše, komu, kdy přijde zpět", "nic nechybí", "jen podpis", "jen datum"], e: "Vzkaz říká jen co, ale neprozradí, kdo ho píše, komu je určen ani kdy se pisatel vrátí. Chybí tedy hned několik důležitých údajů, ne pouze podpis." },
  { q: "Inzerát 'Ztratil se pes, zlatý retrívr, odměna.' — co MUSÍ obsahovat dál?", a: "kontakt (telefon/e-mail)", opts: ["kontakt (telefon/e-mail)", "celé jméno majitele", "adresu bydliště", "popis okolí, kde pes zmizel"], e: "Kdyby někdo psa našel, musí mít, kam zavolat — proto je kontakt nutný. Celé jméno ani přesná adresa majitele se v inzerátu kvůli bezpečí radši neuvádějí." },
  { q: "Při telefonním hovoru se představíme:", a: "vždy na začátku — aby druhý věděl, kdo volá", opts: ["vždy na začátku — aby druhý věděl, kdo volá", "jen na konci", "pouze při hovoru s cizím člověkem", "nikdy — to není nutné"], e: "Druhý člověk tě po telefonu nevidí, proto se hned na začátku představíš, ať ví, s kým mluví. Představit se až na konci nebo vůbec by bylo matoucí a nezdvořilé." },
  { q: "Inzerát o ztracené věci musí obsahovat:", a: "popis věci, kde byla ztracena, kontakt", opts: ["popis věci, kde byla ztracena, kontakt", "jen jméno majitele", "jen cenu věci", "fotku věci"], e: "Aby ti ztracenou věc někdo vrátil, musí podle popisu a místa poznat, že jde o tu pravou, a mít kontakt, kam se ozvat. Samotné jméno majitele ani cena k tomu nestačí." },
  { q: "Vzkaz zanecháme, když:", a: "nemůžeme osobně říci zprávu adresátovi", opts: ["nemůžeme osobně říci zprávu adresátovi", "chceme napsat dopis", "telefonujeme", "píšeme inzerát"], e: "Vzkaz je náhrada za osobní sdělení pro chvíli, kdy adresát není přítomen. Když ho zastihneš po telefonu nebo mu píšeš dopis, vzkaz nepotřebuješ." },
  { q: "Telefonní hovor — jak správně odmítáme neznámé hovory?", a: "zdvořile: 'Promiňte, volali jste na špatné číslo.'", opts: ["zdvořile: 'Promiňte, volali jste na špatné číslo.'", "jen zavěsíme", "řekneme 'kdo jste'", "ignorujeme hovor"], e: "I když hovor odmítáš, zůstaneš slušný a krátce vysvětlíš, že jde o omyl. Zavěsit beze slova nebo nevrle se ptát 'kdo jste' působí hrubě." },
  { q: "Inzerát 'Prodám kolo: stáří 2 roky, funkční brzdy, nosnost 80 kg, barva červená.' — jaký druh informací uvádí?", a: "konkrétní technické parametry — správně", opts: ["konkrétní technické parametry — správně", "příliš obecné informace", "nepotřebné osobní informace", "chybí kontakt, jinak správně"], e: "Inzerát uvádí přesné údaje o kole (stáří, brzdy, nosnost, barvu), podle kterých si zájemce udělá jasnou představu. To je přesně to, co dobrý inzerát má obsahovat." },
  { q: "Vzkazem nahrazujeme:", a: "osobní sdělení, když adresát není přítomen", opts: ["osobní sdělení, když adresát není přítomen", "celý dopis", "telefonní hovor", "inzerát"], e: "Vzkaz zastupuje to, co bychom řekli osobně, kdyby tam adresát byl. Nenahrazuje dopis, telefonát ani inzerát, ty slouží k jiným účelům." },
  { q: "Příklad správné struktury telefonního hovoru:", a: "Dobrý den, tady Pavel Novák. Volám kvůli objednávce. ... Na shledanou.", opts: ["Dobrý den, tady Pavel Novák. Volám kvůli objednávce. ... Na shledanou.", "Haló? Co chcete? Čau.", "Objednávka. Číslo 5. Díky.", "Dobrý den. ... zavěsím."], e: "Tento hovor má všechny části ve správném pořadí: pozdrav, představení, věc hovoru i rozloučení. Ostatní možnosti jsou nezdvořilé nebo některou důležitou část vynechávají." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : shuffle([...POOL_L1, ...POOL_L2]);
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "Inzerát: stručný, konkrétní, s kontaktem; nabídka (prodávám) nebo poptávka (hledám)",
      "Vzkaz: kdo — komu — co — kdy; čitelný a stručný",
      "Telefonní hovor: pozdrav → představení → věc hovoru → rozloučení",
    ],
    explanation: e,
  }));
}

export const INZERATVZKAZTELEFONICKYROZHOVOR: TopicMetadata[] = [
  {
    id: "g4-cjl-komunikacni-a-slohova-vychova-slohova-vychova-inzerat-vzkaz-telefonicky-rozhovor",
    rvpNodeId: "g4-cjl-komunikacni-a-slohova-vychova-slohova-vychova-inzerat-vzkaz-telefonicky-rozhovor",
    displayName: "Inzerát a vzkaz",
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
    recommendedNext: ["g4-cjl-komunikacni-a-slohova-vychova-slohova-vychova-vypravovani-s-casovou-posloupnosti-osnova"],
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
