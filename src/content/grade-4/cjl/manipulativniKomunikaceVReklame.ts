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
  { q: "Jaký reklamní trik používá slogan 'Jednou ochutnáš, navždy zůstaneš'?", a: "opakování a návykovost", opts: ["opakování a návykovost", "slavná osobnost", "falešná naléhavost", "emocionální apel"] },
  { q: "Reklama říká: 'Slavný sportovec pije tento nápoj.' — jaký trik?", a: "slavná osobnost (celebrita doporučuje)", opts: ["slavná osobnost (celebrita doporučuje)", "opakování", "falešná naléhavost", "zdánlivé výhody"] },
  { q: "Reklama říká: 'Jen dnes! Poslední kusy!' — jaký trik?", a: "falešná naléhavost", opts: ["falešná naléhavost", "emocionální apel", "slavná osobnost", "opakování"] },
  { q: "Reklama říká: 'Milujte svou rodinu — kupte náš produkt.' — jaký trik?", a: "emocionální apel (emoce)", opts: ["emocionální apel (emoce)", "slavná osobnost", "falešná naléhavost", "opakování"] },
  { q: "Reklama říká: 'O 20% lepší!' — co by nás mělo zaujmout?", a: "Čím lepší? Oproti čemu? — zdánlivá výhoda bez základu", opts: ["Čím lepší? Oproti čemu? — zdánlivá výhoda bez základu", "Je to pravda — věříme číslu", "Slavná osobnost to říká", "Je to falešná naléhavost"] },
  { q: "Co je cílem reklamy?", a: "přesvědčit nás ke koupi nebo změně názoru", opts: ["přesvědčit nás ke koupi nebo změně názoru", "informovat nás o světě", "poučit nás o zdraví", "pobavit nás"] },
  { q: "Manipulativní komunikace je:", a: "sdělení, které záměrně ovlivňuje bez logických argumentů", opts: ["sdělení, které záměrně ovlivňuje bez logických argumentů", "sdělení s pravdivými fakty", "popis věcí a lidí", "neutrální zpráva"] },
  { q: "Co je slogan?", a: "krátká, zapamatovatelná reklamní věta", opts: ["krátká, zapamatovatelná reklamní věta", "dlouhý text o výrobku", "podmínky záruky", "technický popis výrobku"] },
  { q: "Proč reklamy opakují slogan?", a: "aby se zarylo do paměti — efekt opakování", opts: ["aby se zarylo do paměti — efekt opakování", "protože nemají jiný obsah", "aby text byl delší", "protože to je zákonná povinnost"] },
  { q: "Reklama říká: 'Vědci dokázali, že...' bez citace — jaký trik?", a: "falešná autorita (zdánlivý vědecký základ)", opts: ["falešná autorita (zdánlivý vědecký základ)", "emocionální apel", "slavná osobnost", "opakování"] },
  { q: "Jak rozpoznáme manipulativní reklamní trik?", a: "Ptáme se: Je to pravda? Jaký je základ tvrzení?", opts: ["Ptáme se: Je to pravda? Jaký je základ tvrzení?", "Věříme všemu v reklamě", "Porovnáme s jinými reklamami", "Zeptáme se slavné osobnosti"] },
  { q: "Proč reklamy používají krásné lidi a obrazy?", a: "aby vyvolaly kladné emoce a touhu po produktu", opts: ["aby vyvolaly kladné emoce a touhu po produktu", "protože zákon to nařizuje", "protože je to levnější", "aby informovaly o vlastnostech"] },
  { q: "Co znamená 'falešná naléhavost' v reklamě?", a: "Říká 'kupte teď', i když zboží není opravdu vzácné", opts: ["Říká 'kupte teď', i když zboží není opravdu vzácné", "Nabízí levnější zboží", "Říká pravdu o nedostatku zboží", "Informuje o slevě"] },
  { q: "Jak nás reklamy manipulují přes emoce?", a: "Propojují produkt s rodinou, přátelstvím, štěstím", opts: ["Propojují produkt s rodinou, přátelstvím, štěstím", "Říkají objektivní fakta", "Ukazují technické schéma výrobku", "Srovnávají s konkurencí poctivě"] },
  { q: "Reklama říká: 'Všichni to kupují!' — jaký trik?", a: "bandwagon — tlak skupiny ('ostatní to dělají')", opts: ["bandwagon — tlak skupiny ('ostatní to dělají')", "emocionální apel", "slavná osobnost", "falešná naléhavost"] },
  { q: "Jak kriticky přistupovat k reklamě?", a: "Ptát se: Proč to říkají? Co tím chtějí? Je to pravda?", opts: ["Ptát se: Proč to říkají? Co tím chtějí? Je to pravda?", "Věřit vždy slavné osobnosti", "Kupovat vše, co je v slevě", "Sdílet reklamu s přáteli"] },
];

const POOL_L2: QA[] = [
  { q: "Analýza reklamy: 'Nový krém — zlepší pleť o 50%!' — co je problematické?", a: "50% — oproti čemu? základ tvrzení není uveden", opts: ["50% — oproti čemu? základ tvrzení není uveden", "nic — čísla jsou vždy pravdivá", "použití slova 'nový'", "fakt, že je to krém"] },
  { q: "Reklama na zmrzlinu ukazuje šťastnou rodinu u moře. Jaký trik?", a: "emocionální apel — propojení produktu se štěstím", opts: ["emocionální apel — propojení produktu se štěstím", "falešná naléhavost", "slavná osobnost", "zdánlivá výhoda"] },
  { q: "Reklama: 'Doporučeno 9 z 10 dentistů.' — co chybí?", a: "Kolik dentistů bylo dotázáno? Kdo je vybral?", opts: ["Kolik dentistů bylo dotázáno? Kdo je vybral?", "Nic nechybí — čísla jsou důkaz", "Chybí obrázek dentisty", "Chybí cena produktu"] },
  { q: "Slogan 'Rozdělíme se o radost' (čokoláda) — jaký trik?", a: "emocionální apel — propojení s pozitivním sdílením", opts: ["emocionální apel — propojení s pozitivním sdílením", "falešná naléhavost", "slavná osobnost", "opakování"] },
  { q: "Co je 'záměrné vynechání informací' v reklamě?", a: "Reklama neříká nevýhody nebo podmínky akce", opts: ["Reklama neříká nevýhody nebo podmínky akce", "Reklama říká vše o produktu", "Reklama je příliš dlouhá", "Reklama je nudná"] },
  { q: "Reklama: 'Zdarma* (*při nákupu nad 500 Kč)' — jaký trik?", a: "záměrné vynechání podmínek (hvězdička = skrytá podmínka)", opts: ["záměrné vynechání podmínek (hvězdička = skrytá podmínka)", "falešná naléhavost", "emocionální apel", "slavná osobnost"] },
  { q: "Proč děti bývají cílovou skupinou reklam na hračky?", a: "Jsou snáze ovlivnitelné a prosí rodiče o koupi", opts: ["Jsou snáze ovlivnitelné a prosí rodiče o koupi", "Mají nejvíce peněz", "Jsou nejlépe informovaní o produktech", "Jsou zákonnou cílovou skupinou"] },
  { q: "Reklama říká: 'Nejlepší produkt na trhu!' — proč to nestačí?", a: "Superlativ bez srovnání není dokazatelný", opts: ["Superlativ bez srovnání není dokazatelný", "Protože je to lež", "Protože nás to nebaví", "Protože to říká slavná osobnost"] },
  { q: "Co je 'cílová skupina' v reklamě?", a: "Skupiny lidí, na které je reklama zaměřena", opts: ["Skupiny lidí, na které je reklama zaměřena", "Výrobci produktu", "Prodejci v obchodě", "Designéři reklamy"] },
  { q: "Reklama: 'Naše auto spotřebuje méně!' — co chybí?", a: "Méně než co? Základ srovnání", opts: ["Méně než co? Základ srovnání", "Nic nechybí", "Chybí cena auta", "Chybí barva auta"] },
  { q: "Proč je důležité umět rozpoznat reklamní triky?", a: "Abychom se rozhodovali sami a nepodléhali manipulaci", opts: ["Abychom se rozhodovali sami a nepodléhali manipulaci", "Abychom kupovali více", "Abychom věřili všem reklamám", "Abychom tvořili reklamy"] },
  { q: "Reklama: 'Teď nebo nikdy!' — jaký trik?", a: "falešná naléhavost (tlak na okamžité rozhodnutí)", opts: ["falešná naléhavost (tlak na okamžité rozhodnutí)", "emocionální apel", "slavná osobnost", "opakování"] },
  { q: "Co dělá slogan silným?", a: "Krátký, rytmický, snadno zapamatovatelný, emocionální", opts: ["Krátký, rytmický, snadno zapamatovatelný, emocionální", "Dlouhý a podrobný", "Plný čísel a faktů", "Technický a odborný"] },
  { q: "Jak se lišíreklamní komunikace od objektivní informace?", a: "Reklama má zájem přesvědčit; objektivní info je nestranná", opts: ["Reklama má zájem přesvědčit; objektivní info je nestranná", "Jsou stejné", "Reklama je vždy pravdivá; info může být nepravdivá", "Reklama je kratší"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : shuffle([...POOL_L1, ...POOL_L2]);
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "Reklamní triky: emoce, slavná osobnost, opakování, falešná naléhavost, zdánlivá výhoda",
      "Ptej se: Je to pravda? Proč to říkají? Co z toho mají?",
      "Superlativy a čísla bez základu jsou podezřelé",
    ],
    solutionSteps: [
      "Identifikuj tvrzení v reklamě.",
      "Jakou techniku používá? (emoce / autorita / naléhavost / opakování?)",
      "Ptej se: Co chybí? Na čem je tvrzení postaveno?",
    ],
  }));
}

export const MANIPULATIVNIKOMUNIKACEVREKLAME: TopicMetadata[] = [
  {
    id: "g4-cjl-komunikacni-a-slohova-vychova-cteni-manipulativni-komunikace-v-reklame",
    rvpNodeId: "g4-cjl-komunikacni-a-slohova-vychova-cteni-manipulativni-komunikace-v-reklame",
    title: "Manipulativní komunikace v reklamě",
    studentTitle: "Triky v reklamě",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Komunikační a slohová výchova",
    briefDescription: "Poznáš, jak reklamy manipulují, a naučíš se jim nepodléhat.",
    keywords: ["reklama", "manipulace", "slogan", "emoce", "slavná osobnost", "falešná naléhavost", "kritické myšlení"],
    goals: [
      "Rozpoznat reklamní triky (emoce, celebrita, naléhavost, opakování)",
      "Kriticky hodnotit reklamní sdělení",
    ],
    boundaries: ["Bez analýzy politické propagandy", "Bez pokročilé semiotiky"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Triky: emoce (rodina/štěstí), celebrita (slavný doporučuje), naléhavost (jen dnes!), opakování (slogan), zdánlivá výhoda (o 20% lepší — než co?)",
      steps: [
        "Přečti reklamní sdělení.",
        "Ptej se: Je to pravda? Co tím chtějí říct?",
        "Najdi techniku: emoce / slavná osoba / naléhavost / opakování.",
        "Zhodnoť, zda je tvrzení dokazatelné.",
      ],
      commonMistake: "Věřit číslům bez kontextu: '50% lepší' — lepší než co? Základna není uvedena.",
      example: "Reklama: 'Milujte svou rodinu → kupte nás!' = emocionální apel (propojení produktu se štěstím rodiny)",
    },
  },
];
