import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL: { q: string; a: string; opts: string[]; e: string; hints?: string[] }[] = [
  { q: "Co musí obsahovat omluvenka?", a: "Koho omlouváme, proč, datum a podpis rodiče", opts: ["Koho omlouváme, proč, datum a podpis rodiče", "Jen datum, kdy žák chyběl", "Jen jméno chybějícího žáka", "Básničku a přání pro učitele"], e: "Omluvenka musí říct, KDO chyběl, PROČ chyběl, KDY chyběl a rodič ji musí podepsat — jinak ji učitel nemůže přijmout. Jen datum nebo jen jméno nestačí, protože učitel potřebuje všechny informace najednou.", hints: [
    "Kolik různých údajů musí učitel z omluvenky vyčíst?",
    "Jedna možnost dává úplně jiný text (básničku), dvě další dávají jen zlomek potřebných informací — hledej tu, co pokrývá všechno najednou.",
  ] },
  { q: "Komu píšeme omluvenku ze školy?", a: "Třídnímu učiteli / třídní učitelce", opts: ["Třídnímu učiteli / třídní učitelce", "Řediteli školy vždy", "Kamarádovi", "Nikomu"], e: "Omluvenku píšeme třídnímu učiteli nebo třídní učitelce, protože právě on nebo ona vede evidenci docházky naší třídy. Řediteli píšeme jen ve zvláštních případech, třeba při delší nepřítomnosti." },
  { q: "Co je zpráva (SMS/vzkaz)?", a: "Krátké sdělení důležité informace", opts: ["Krátké sdělení důležité informace", "Dlouhé vyprávění příběhu", "Báseň s rýmy a verši", "Návod, jak něco udělat"], e: "Zpráva nebo vzkaz je krátký text, ve kterém sdělíme jen to nejdůležitější — třeba 'Přijdu domů v 5 hodin'. Dlouhý příběh, báseň ani návod nejsou zprávy, protože mají úplně jiný účel." },
  { q: "Co musí obsahovat pozvánka?", a: "Co, kdy, kde a kdo zve", opts: ["Co, kdy, kde a kdo zve", "Jen datum", "Jen adresu", "Jen jméno hostů"], e: "Dobrá pozvánka musí odpovědět na čtyři otázky: CO se koná (oslava, divadlo…), KDY to bude, KDE to bude a KDO zve. Bez těchto informací by pozvaný nevěděl, kam a kdy přijít.", hints: [
    "Co všechno musí pozvaný vědět, aby vůbec dorazil?",
    "Tři možnosti dávají jen jeden kousek informace zvlášť — hledej tu, co spojuje víc potřebných údajů dohromady.",
  ] },
  { q: "Co je oznámení?", a: "Sdělení pro více lidí najednou", opts: ["Sdělení pro více lidí najednou", "Soukromý dopis jednomu člověku", "Pohlednice z dovolené", "Básnička k svátku"], e: "Oznámení je určeno pro hodně lidí najednou — třeba když škola oznamuje výlet nebo akci celé třídě. Soukromý dopis nebo pohlednice patří jen jednomu konkrétnímu člověku." },
  { q: "Omluvenka začíná:", a: "Zdvořilým oslovením", opts: ["Zdvořilým oslovením", "Pozdravem 'Ahoj'", "Datem a místem", "Podpisem rodiče"], e: "Omluvenka je formální dopis, proto začínáme zdvořilým oslovením 'Vážená paní učitelko,' nebo 'Vážený pane učiteli,'. 'Ahoj' by bylo příliš neformální a podpis patří až na konec." },
  { q: "Kde najdeme datum v omluvence?", a: "Na začátku nebo na konci", opts: ["Na začátku nebo na konci", "Uprostřed textu", "V oslovení", "V podpisu"], e: "Datum píšeme buď hned na začátek (před oslovení) nebo na konec před podpis. Uprostřed textu by datum působilo zmateně a čtenář by ho těžko hledal." },
  { q: "Co napíšeme na konci omluvenky?", a: "S pozdravem a podpis rodiče", opts: ["S pozdravem a podpis rodiče", "Jen slovo Promiňte", "Pozdrav 'S láskou'", "Znovu datum a místo"], e: "Formální dopisy jako omluvenka končí zdvořilým pozdravem 'S pozdravem' a podpisem. Podpis rodiče je důležitý, protože dokazuje, že o nepřítomnosti věděl dospělý. 'S láskou' je neformální a do omluvenky se nehodí." },
  { q: "Pozvánka na narozeninovou oslavu musí obsahovat:", a: "Datum, čas, místo a jméno oslavence", opts: ["Datum, čas, místo a jméno oslavence", "Jen datum oslavy", "Jen seznam přání a dárků", "Jen adresu, kde se slaví"], e: "Aby pozvaný mohl přijít, musí vědět KDY oslava je (datum a čas), KDE se koná (místo) a KDO slaví narozeniny (jméno oslavence). Seznam dárků na pozvánce nepatří — o dárcích si každý rozhodne sám." },
  { q: "Jaký je rozdíl mezi zprávou a oznámením?", a: "Zpráva je pro jednoho, oznámení pro všechny", opts: ["Zpráva je pro jednoho, oznámení pro všechny", "Zpráva je pro všechny, oznámení pro jednoho", "Zpráva je vždy delší než oznámení", "Mezi zprávou a oznámením není rozdíl"], e: "Zprávu posíláme jednomu konkrétnímu člověku — třeba mamince SMS. Oznámení je pro všechny, třeba cedule na nástěnce ve škole. Délka nehraje roli — zpráva může být i krátká, oznámení i delší." },
  { q: "Proč píšeme omluvenku?", a: "Aby škola věděla, proč žák chyběl", opts: ["Aby škola věděla, proč žák chyběl", "Pro zábavu", "Aby měl žák volno", "Povinně každý týden"], e: "Omluvenka slouží k tomu, aby škola věděla, že absence byla oprávněná (nemoc, rodinné důvody) a ne záškoláctví. Píšeme ji jen když žák skutečně chyběl, ne povinně každý týden." },
  { q: "Vzkaz kamarádovi obsahuje:", a: "Kdo píše, co sděluje, případně kdy a kde", opts: ["Kdo píše, co sděluje, případně kdy a kde", "Jen básničku pro kamaráda", "Vždycky omluvu za něco", "Dlouhé vyprávění příběhu"], e: "Vzkaz kamarádovi by měl říct, KDO píše (aby kamarád věděl, od koho to je), CO chce sdělit a případně KDY a KDE se něco stane. Básnička nebo dlouhý příběh nejsou vzkazem — mají jiný účel.", hints: [
    "Co potřebuje kamarád vědět, aby vzkazu rozuměl?",
    "Vzkaz nemusí být omluva ani báseň — je to krátké sdělení, které má čtenáři něco praktického oznámit.",
  ] },
];

function gen(level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 16).map(({ q, a, opts, e, hints }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: hints ?? [
      "Zeptej se, komu je text určený a co všechno musí čtenář vědět, aby mu porozuměl.",
      "Formální texty pro školu mají pevné pořadí částí — něco patří na začátek, něco až úplně na konec. Zkus si celý text v hlavě poskládat od prvního řádku po poslední.",
    ],
    explanation: e,
  }));
}

export const OMLUVENKAZPRAVA: TopicMetadata[] = [
  {
    id: "g3-cjl-omluvenka-zprava",
    rvpNodeId: "g3-cjl-komunikacni-a-slohova-vychova-slohova-vychova-omluvenka-zprava-oznameni-pozvanka",
    title: "Omluvenka, zpráva, oznámení, pozvánka",
    studentTitle: "Omluvenka a pozvánka",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Slohová výchova",
    briefDescription: "Naučíš se napsat omluvenku, vzkaz, pozvánku nebo oznámení.",
    keywords: ["omluvenka", "zpráva", "vzkaz", "pozvánka", "oznámení", "oslovení", "podpis"],
    goals: ["Napsat omluvenku se všemi náležitostmi.", "Rozlišit zprávu, oznámení a pozvánku.", "Správně oslovit adresáta."],
    boundaries: ["Základní slohové útvary pro 3. ročník."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Omluvenka: Vážená paní učitelko, omlouvám Petra Nováka... datum, podpis rodiče.",
      steps: ["Oslovení (Vážená…).", "Obsah (kdo, proč chyběl).", "Datum.", "Podpis."],
      commonMistake: "Omluvenka bez podpisu rodiče je neplatná.",
      example: "V Praze 1. 3. 2026 / Vážená paní učitelko, / omlouvám svého syna Petra z důvodu nemoci dne 28. 2. / S pozdravem Jana Nováková.",
    },
  },
];
