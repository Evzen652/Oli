import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL_L1: PracticeTask[] = [
  { question: "Co je základ potravinové pyramidy (jíme ho nejvíce)?", correctAnswer: "Obiloviny, brambory, rýže — základ energie", options: ["Obiloviny, brambory, rýže — základ energie", "Maso a ryby", "Sladkosti a tuky", "Mléčné výrobky"] },
  { question: "Co je na vrcholu potravinové pyramidy (jíme ho nejméně)?", correctAnswer: "Sladkosti a tuky", options: ["Sladkosti a tuky", "Zelenina a ovoce", "Obiloviny", "Mléčné výrobky"] },
  { question: "Kolik hodin denně by měl spát školák?", correctAnswer: "9–11 hodin", options: ["9–11 hodin", "5–6 hodin", "12–14 hodin", "7 hodin maximálně"] },
  { question: "Kolik minut pohybu denně doporučují lékaři dětem?", correctAnswer: "Minimálně 60 minut", options: ["Minimálně 60 minut", "Minimálně 10 minut", "Minimálně 5 hodin", "Pohyb pro děti není nutný"] },
  { question: "Kolik litrů vody by mělo dítě vypít denně?", correctAnswer: "1,5–2 litry", options: ["1,5–2 litry", "0,5 litrů", "5 litrů", "Záleží jen na počasí"] },
  { question: "Jaký nápoj je nejlepší pro zdraví?", correctAnswer: "Čistá voda a čaj – bez cukru", options: ["Čistá voda a čaj – bez cukru", "Sladká limonáda", "Energetický nápoj", "Ovocná šťáva s cukrem"] },
  { question: "Kdy si musíme umýt ruce?", correctAnswer: "Před jídlem, po WC, po příchodu zvenku", options: ["Před jídlem, po WC, po příchodu zvenku", "Jen ráno a večer", "Jen po sportu", "Jen po kontaktu s nemocnými"] },
  { question: "Jak často si čistíme zuby?", correctAnswer: "2× denně — ráno a večer – po jídle", options: ["2× denně — ráno a večer – po jídle", "1× týdně", "Jen ráno", "3× ráno po každém jídle"] },
  { question: "Proč je nutné nosit přilbu na kole?", correctAnswer: "Chrání hlavu při pádu — prevence poranění mozku", options: ["Chrání hlavu při pádu — prevence poranění mozku", "Je to jen módní doplněk", "Zákon přilbu nevyžaduje — je dobrovolná", "Přilba chladí hlavu v létě"] },
  { question: "Co způsobuje nedostatek spánku?", correctAnswer: "Špatná paměť, únava, oslabená imunita a horší soustředění", options: ["Špatná paměť, únava, oslabená imunita a horší soustředění", "Žádný problém — spánek není důležitý", "Jen pocit únavy bez vlivu na zdraví", "Jen bolest hlavy"] },
  { question: "Co je vláknina a kde ji najdeme?", correctAnswer: "Nestravitelná část rostlin — zelenina, ovoce, celozrnné pečivo, luštěniny", options: ["Nestravitelná část rostlin — zelenina, ovoce, celozrnné pečivo, luštěniny", "Druh tuku v mase", "Minerál v mléčných výrobcích", "Složka masa bohatá na bílkoviny"] },
  { question: "Co je vitamín C a kde ho najdeme?", correctAnswer: "Vitamín podporující imunitu — v citrusech, paprice, šípku, brokolici", options: ["Vitamín podporující imunitu — v citrusech, paprice, šípku, brokolici", "Vitamín v mléčných výrobcích pro kosti", "Vitamín v mase pro svaly", "Vitamín jen v ovoci, ne zelenině"] },
  { question: "Co je vápník a k čemu slouží?", correctAnswer: "Minerál v mléčných výrobcích — pevnost kostí a zubů", options: ["Minerál v mléčných výrobcích — pevnost kostí a zubů", "Vitamín pro oči v mrkvi", "Bílkovina pro svaly v mase", "Tuková kyselina pro mozek v rybách"] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Proč je zelenina a ovoce důležitá v jídelníčku?", correctAnswer: "Obsahují vitamíny, minerály a vlákninu — posilují imunitu a trávení", options: ["Obsahují vitamíny, minerály a vlákninu — posilují imunitu a trávení", "Jsou hlavním zdrojem bílkovin", "Jsou hlavním zdrojem energie – sacharidy", "Jsou důležité jen jako zdroj vody"] },
  { question: "Jaký je rozdíl mezi aerobním a anaerobním pohybem?", correctAnswer: "Aerobní (chůze, plavání): trvá déle, spaluje tuky. Anaerobní – sprint, vzpírání : krátké intenzivní výboje.", options: ["Aerobní (chůze, plavání): trvá déle, spaluje tuky. Anaerobní – sprint, vzpírání : krátké intenzivní výboje.", "Aerobní probíhá jen ve vodě, anaerobní na souši.", "Anaerobní je zdravější pro děti než aerobní.", "Oba typy pohybu jsou totožné — záleží jen na délce."] },
  { question: "Co je Body Mass Index (BMI) a k čemu slouží?", correctAnswer: "Ukazatel poměru váhy a výšky — pomáhá hodnotit, zda je hmotnost přiměřená věku a výšce", options: ["Ukazatel poměru váhy a výšky — pomáhá hodnotit, zda je hmotnost přiměřená věku a výšce", "Měřítko fyzické zdatnosti pro sport", "Výpočet ideálního denního příjmu kalorií", "Ukazatel množství svalové hmoty"] },
  { question: "Proč jsou rychlé cukry (sladkosti) méně vhodné než komplexní sacharidy?", correctAnswer: "Rychlé cukry prudce zvyšují cukr v krvi a pak způsobují pokles energie a hlad", options: ["Rychlé cukry prudce zvyšují cukr v krvi a pak způsobují pokles energie a hlad", "Rychlé cukry jsou vždy škodlivé bez výjimky", "Komplexní sacharidy jsou hůře stravitelné", "Oba typy cukrů mají totožný vliv na energii"] },
  { question: "Jaká jsou zdraví prospěšná tuky vs. škodlivé tuky?", correctAnswer: "Zdravé: olivový olej, ořechy, ryby – omega-3 . Škodlivé: trans-tuky v průmyslových výrobcích.", options: ["Zdravé: olivový olej, ořechy, ryby – omega-3 . Škodlivé: trans-tuky v průmyslových výrobcích.", "Všechny tuky jsou škodlivé — je třeba je eliminovat.", "Nasycené tuky jsou zdravé, nenasycené škodlivé.", "Tuky jsou pro děti zbytečné — ovoce stačí."] },
  { question: "Proč je důležitá pravidelnost jídla (5 jídel denně)?", correctAnswer: "Udržuje stabilní hladinu cukru v krvi — brání přejídání a záchvatům hladu", options: ["Udržuje stabilní hladinu cukru v krvi — brání přejídání a záchvatům hladu", "5 jídel je zbytečné — stačí 1 velké jídlo denně", "Počet jídel neovlivňuje zdraví ani hmotnost", "Pravidelnost jídla pomáhá jen při hubnutí"] },
  { question: "Co je Diabetes mellitus (cukrovka) a jak ji preventovat?", correctAnswer: "Porucha regulace cukru v krvi — prevence: zdravá strava, pohyb, omezení sladkostí", options: ["Porucha regulace cukru v krvi — prevence: zdravá strava, pohyb, omezení sladkostí", "Nemoc způsobená nedostatkem cukru v těle", "Nemoc přenášená od nemocných lidí", "Cukrovka nelze preventovat — je vrozená"] },
  { question: "Co je hygiena spánku?", correctAnswer: "Soubor návyků pro kvalitní spánek — stejný čas, tma, klid, bez elektroniky před spaním", options: ["Soubor návyků pro kvalitní spánek — stejný čas, tma, klid, bez elektroniky před spaním", "Mytí zubů a rukou před spaním", "Pravidelné větrání ložnice v noci", "Denní spánek namísto nočního"] },
  { question: "Jak pohyb přispívá ke zdraví?", correctAnswer: "Posiluje srdce, svaly a kosti, zlepšuje náladu – endorfiny , reguluje hmotnost, posiluje imunitu", options: ["Posiluje srdce, svaly a kosti, zlepšuje náladu – endorfiny , reguluje hmotnost, posiluje imunitu", "Pohyb je důležitý jen pro výkonnostní sport", "Pohyb snižuje imunitu při přetěžování", "Pohyb je důležitý jen pro hubnutí"] },
  { question: "Co je očkování a jak chrání?", correctAnswer: "Podání oslabeného nebo mrtvého patogenu — stimuluje imunitu k tvorbě protilátek", options: ["Podání oslabeného nebo mrtvého patogenu — stimuluje imunitu k tvorbě protilátek", "Lék zastavující nemoc po nakažení", "Vitamínová injekce posilující imunitu", "Antibiotikum chránící před bakteriemi"] },
  { question: "Co je prevence úrazů na kole?", correctAnswer: "Přilba, reflexní prvky, světla, dodržování pravidel silničního provozu, bezpečná jízda", options: ["Přilba, reflexní prvky, světla, dodržování pravidel silničního provozu, bezpečná jízda", "Jen přilba — ostatní vybavení je zbytečné", "Jízda na chodníku bez přilby je bezpečná", "Kolo je vždy bezpečné — úrazy se nestávají"] },
  { question: "Co jsou bílkoviny a kde je najdeme?", correctAnswer: "Stavební látky těla — maso, ryby, vejce, mléčné výrobky, luštěniny", options: ["Stavební látky těla — maso, ryby, vejce, mléčné výrobky, luštěniny", "Zdroj energie — obiloviny, brambory, rýže", "Ochranné látky — zelenina, ovoce", "Stavební látky jen v mase a vejcích"] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Co je metabolismus a jak ho ovlivňuje pohyb?", correctAnswer: "Souhrn chemických reakcí v těle přeměňující potravu na energii — pohyb zvyšuje bazální metabolismus", options: ["Souhrn chemických reakcí v těle přeměňující potravu na energii — pohyb zvyšuje bazální metabolismus", "Trávení potravy v žaludku", "Tvorba krve v kostech", "Pohyb snižuje metabolismus, klid ho zvyšuje"] },
  { question: "Jak spánek ovlivňuje paměť a učení?", correctAnswer: "Během spánku mozek konsoliduje vzpomínky — přesouvá krátkodobé do dlouhodobé paměti", options: ["Během spánku mozek konsoliduje vzpomínky — přesouvá krátkodobé do dlouhodobé paměti", "Spánek nemá vliv na paměť — učení probíhá jen přes den", "Mozek při spánku nevyvíjí žádnou aktivitu", "Spánek je důležitý jen pro svaly, ne pro mozek"] },
  { question: "Jaký je vliv stresu na zdraví a jak ho zmírnit?", correctAnswer: "Chronický stres poškozuje imunitu, srdce a psychiku — pohyb, meditace, spánek a sociální kontakty pomáhají", options: ["Chronický stres poškozuje imunitu, srdce a psychiku — pohyb, meditace, spánek a sociální kontakty pomáhají", "Stres nemá prokazatelný vliv na fyzické zdraví", "Stres je vždy motivující — bez stresu nelze podávat výkony", "Vliv stresu závisí jen na genetice, ne na životním stylu"] },
  { question: "Co je mikrobiom střev a proč je důležitý?", correctAnswer: "Biliony mikroorganismů v trávicím traktu — ovlivňují imunitu, trávení a náladu; podporuje ho vláknina a fermentované potraviny", options: ["Biliony mikroorganismů v trávicím traktu — ovlivňují imunitu, trávení a náladu; podporuje ho vláknina a fermentované potraviny", "Parazité v střevech způsobující nemoci", "Enzymy v žaludku trávící bílkoviny", "Mikrobiom je irelevantní pro zdraví"] },
  { question: "Co jsou omega-3 mastné kyseliny a kde je najdeme?", correctAnswer: "Nenasycené mastné kyseliny důležité pro mozek a srdce — v tučných rybách, lněném semínku, vlašských ořeších", options: ["Nenasycené mastné kyseliny důležité pro mozek a srdce — v tučných rybách, lněném semínku, vlašských ořeších", "Nasycené tuky v mase posilující svaly", "Vitamíny v citrusech posilující imunitu", "Aminokyseliny v luštěninách pro bílkoviny"] },
  { question: "Co je potravinová intolerance vs. alergie?", correctAnswer: "Intolerance: obtíže trávení (laktóza). Alergie: imunitní reakce na alergeny – arašídy — může být anafylaxe.", options: ["Intolerance: obtíže trávení (laktóza). Alergie: imunitní reakce na alergeny – arašídy — může být anafylaxe.", "Intolerance a alergie jsou totéž — liší se jen intenzitou.", "Alergie se projeví jen na kůži, intolerance jen v trávicím traktu.", "Obě stavy jsou léčitelné stejnými léky."] },
  { question: "Jak sedavý způsob života (obrazovky) ovlivňuje zdraví dítěte?", correctAnswer: "Obezita, špatné držení těla, poruchy spánku, problémy se zrakem, snížená sociální interakce", options: ["Obezita, špatné držení těla, poruchy spánku, problémy se zrakem, snížená sociální interakce", "Sedavý způsob nemá zdravotní dopad na děti", "Pouze zrakové problémy — ostatní zdravotní dopady nejsou prokázány", "Sedavý způsob pomáhá regeneraci svalů"] },
  { question: "Co je imunitní systém a jak ho posílit?", correctAnswer: "Ochranný systém těla před infekcemi — posiluje ho spánek, pohyb, vitamíny, očkování a snížení stresu", options: ["Ochranný systém těla před infekcemi — posiluje ho spánek, pohyb, vitamíny, očkování a snížení stresu", "Srdce a krevní oběh zajišťující přísun kyslíku", "Trávicí soustava zabraňující otravě jídlem", "Imunita závisí jen na genetice — nelze ji ovlivnit"] },
  { question: "Proč je důležité omezit zpracované potraviny a fast food?", correctAnswer: "Obsahují nadbytečné množství soli, cukru, trans-tuků a kalorií — zvyšují riziko obezity a kardiovaskulárních chorob", options: ["Obsahují nadbytečné množství soli, cukru, trans-tuků a kalorií — zvyšují riziko obezity a kardiovaskulárních chorob", "Zpracované potraviny jsou zdravé — mají vitamíny přidané výrobcem", "Fast food je škodlivý jen při každodenní konzumaci", "Vědecky není prokázán vliv fast foodu na zdraví dětí"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 40);
}

export const STRAVAPOHYBSPANEKPREVENCEURAZUANEMOCI: TopicMetadata[] = [
  {
    id: "g4-prirodoveda-clovek-a-jeho-zdravi-zdravy-zivotni-styl-strava-pohyb-spanek-prevence-urazu-a-nemoci",
    rvpNodeId: "g4-prirodoveda-clovek-a-jeho-zdravi-zdravy-zivotni-styl-strava-pohyb-spanek-prevence-urazu-a-nemoci",
    title: "Strava, pohyb, spánek, prevence úrazů a nemocí",
    studentTitle: "Zdravý životní styl",
    subject: "přírodověda",
    category: "Člověk a jeho zdraví",
    topic: "Člověk a jeho zdraví",
    briefDescription: "Naučíš se, co tvoří zdravý životní styl a jak pečovat o své tělo každý den.",
    keywords: ["strava", "pohyb", "spánek", "hygiena", "vitamíny", "potravinová pyramida", "prevence", "přilba", "očkování"],
    goals: [
      "Popsat potravinovou pyramidu a vysvětlit, co jíme nejvíce/nejméně",
      "Uvést doporučení pro spánek a pohyb pro školáky",
      "Vysvětlit základní hygienická pravidla",
      "Popsat prevenci úrazů a nemocí",
    ],
    boundaries: ["Podrobná výživa a biochemie nejsou náplní 4. ročníku"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Pyramida: základ = obiloviny a zelenina; vrchol = sladkosti (nejméně). Spánek: 9–11 h. Pohyb: 60 min denně.",
      steps: [
        "1. Pyramida: obiloviny → zelenina+ovoce → mléko+maso → sladkosti.",
        "2. Voda: 1,5–2 l denně, čistá voda a čaj.",
        "3. Spánek: 9–11 h pro školáky.",
        "4. Pohyb: min. 60 minut denně.",
        "5. Hygiena: ruce před jídlem, zuby 2×.",
      ],
      commonMistake: "Sladkosti jsou na vrcholu pyramidy — to znamená, že je jíme NEJMÉNĚ, ne nejvíce.",
      example: "Zdravý den: snídaně s cereáliemi, ovoce k svačině, pohyb 1 hodinu, 9 hodin spánku.",
    },
  },
];
