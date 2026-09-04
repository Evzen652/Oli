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
  { question: "Co je základ potravinové pyramidy?", correctAnswer: "Obiloviny, brambory a rýže", options: ["Obiloviny, brambory a rýže", "Maso a ryby každý den", "Sladkosti, tuky a oleje", "Mléčné výrobky a sýry"] },
  { question: "Co je na vrcholu potravinové pyramidy (jíme ho nejméně)?", correctAnswer: "Sladkosti a tuky", options: ["Zelenina a ovoce", "Sladkosti a tuky", "Obiloviny", "Mléčné výrobky"] },
  { question: "Kolik hodin denně by měl spát školák?", correctAnswer: "9–11 hodin", options: ["5–6 hodin", "12–14 hodin", "9–11 hodin", "7 hodin maximálně"] },
  { question: "Kolik minut pohybu denně doporučují lékaři dětem?", correctAnswer: "Minimálně 60 minut", options: ["Minimálně 10 minut", "Minimálně 5 hodin", "Pohyb pro děti není nutný", "Minimálně 60 minut"] },
  { question: "Kolik litrů vody by mělo dítě vypít denně?", correctAnswer: "1,5–2 litry", options: ["1,5–2 litry", "0,5 litrů", "5 litrů", "Záleží jen na počasí"] },
  { question: "Jaký nápoj je nejlepší pro zdraví?", correctAnswer: "Čistá voda a čaj – bez cukru", options: ["Sladká limonáda", "Čistá voda a čaj – bez cukru", "Energetický nápoj", "Ovocná šťáva s cukrem"] },
  { question: "Kdy si musíme umýt ruce?", correctAnswer: "Před jídlem, po WC, po příchodu zvenku", options: ["Jen ráno a večer", "Jen po sportu", "Před jídlem, po WC, po příchodu zvenku", "Jen po kontaktu s nemocnými"] },
  { question: "Jak často si čistíme zuby?", correctAnswer: "2× denně — ráno a večer – po jídle", options: ["1× týdně", "Jen ráno", "3× ráno po každém jídle", "2× denně — ráno a večer – po jídle"] },
  { question: "Proč je nutné nosit přilbu na kole?", correctAnswer: "Chrání hlavu při pádu — prevence poranění mozku", options: ["Chrání hlavu při pádu — prevence poranění mozku", "Je to jen módní doplněk", "Zákon přilbu nevyžaduje — je dobrovolná", "Přilba chladí hlavu v létě"] },
  { question: "Co způsobuje nedostatek spánku?", correctAnswer: "Špatná paměť, únava, oslabená imunita a horší soustředění", options: ["Žádný problém — spánek není důležitý", "Špatná paměť, únava, oslabená imunita a horší soustředění", "Jen pocit únavy bez vlivu na zdraví", "Jen bolest hlavy"] },
  { question: "Co je vláknina a kde ji najdeme?", correctAnswer: "Nestravitelná část rostlin", options: ["Druh tuku obsažený v mase", "Minerál v mléčných výrobcích", "Nestravitelná část rostlin", "Složka masa bohatá na bílkoviny"] },
  { question: "Co je vitamín C a kde ho najdeme?", correctAnswer: "Vitamín podporující imunitu — v citrusech, paprice, šípku, brokolici", options: ["Vitamín v mléčných výrobcích pro kosti", "Vitamín v mase pro svaly", "Vitamín jen v ovoci, ne zelenině", "Vitamín podporující imunitu — v citrusech, paprice, šípku, brokolici"] },
  { question: "Co je vápník a k čemu slouží?", correctAnswer: "Minerál v mléčných výrobcích — pevnost kostí a zubů", options: ["Minerál v mléčných výrobcích — pevnost kostí a zubů", "Vitamín pro oči v mrkvi", "Bílkovina pro svaly v mase", "Tuková kyselina pro mozek v rybách"] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Proč je zelenina a ovoce důležitá v jídelníčku?", correctAnswer: "Obsahují vitamíny, minerály a vlákninu — posilují imunitu a trávení", options: ["Jsou hlavním zdrojem bílkovin", "Obsahují vitamíny, minerály a vlákninu — posilují imunitu a trávení", "Jsou hlavním zdrojem energie – sacharidy", "Jsou důležité jen jako zdroj vody"] },
  { question: "Jaký je rozdíl mezi během na dlouhou trať a sprintem?", correctAnswer: "Dlouhý běh je pomalý, sprint krátký a rychlý", options: ["Sprint je pomalý, dlouhý běh rychlý", "Sprint je pro děti zdravější", "Dlouhý běh je pomalý, sprint krátký a rychlý", "Oba jsou úplně stejné"] },
  { question: "Podle čeho se pozná, jestli má člověk přiměřenou hmotnost?", correctAnswer: "Podle poměru váhy a výšky", options: ["Podle toho, jak rychle běhá", "Podle množství snědených kalorií", "Podle množství svalů na těle", "Podle poměru váhy a výšky"] },
  { question: "Proč jsou rychlé cukry (sladkosti) méně vhodné než komplexní sacharidy?", correctAnswer: "Rychlé cukry prudce zvyšují cukr v krvi a pak způsobují pokles energie a hlad", options: ["Rychlé cukry prudce zvyšují cukr v krvi a pak způsobují pokles energie a hlad", "Rychlé cukry jsou vždy škodlivé bez výjimky", "Komplexní sacharidy jsou hůře stravitelné", "Oba typy cukrů mají totožný vliv na energii"] },
  { question: "Jaká jsou zdraví prospěšná tuky vs. škodlivé tuky?", correctAnswer: "Zdravé: olivový olej, ořechy, ryby – omega-3 . Škodlivé: trans-tuky v průmyslových výrobcích.", options: ["Všechny tuky jsou škodlivé — je třeba je eliminovat.", "Zdravé: olivový olej, ořechy, ryby – omega-3 . Škodlivé: trans-tuky v průmyslových výrobcích.", "Nasycené tuky jsou zdravé, nenasycené škodlivé.", "Tuky jsou pro děti zbytečné — ovoce stačí."] },
  { question: "Proč je důležitá pravidelnost jídla (5 jídel denně)?", correctAnswer: "Udržuje stabilní hladinu cukru v krvi — brání přejídání a záchvatům hladu", options: ["5 jídel je zbytečné — stačí 1 velké jídlo denně", "Počet jídel neovlivňuje zdraví ani hmotnost", "Udržuje stabilní hladinu cukru v krvi — brání přejídání a záchvatům hladu", "Pravidelnost jídla pomáhá jen při hubnutí"] },
  { question: "Co pomáhá předcházet cukrovce?", correctAnswer: "Zdravá strava, pohyb, méně sladkostí", options: ["Jíst víc cukru, tělu chybí", "Vyhýbat se nemocným lidem", "Nedá se jí předcházet, je vrozená", "Zdravá strava, pohyb, méně sladkostí"] },
  { question: "Co pomáhá ke kvalitnímu spánku?", correctAnswer: "Stejný čas, tma a klid", options: ["Stejný čas, tma a klid", "Mytí zubů a rukou před spaním", "Větrání ložnice uprostřed noci", "Spánek přes den místo v noci"] },
  { question: "Jak pohyb přispívá ke zdraví?", correctAnswer: "Posiluje srdce, svaly i kosti", options: ["Je důležitý jen pro sportovce", "Posiluje srdce, svaly i kosti", "Při přetěžování snižuje imunitu", "Je důležitý jen pro hubnutí"] },
  { question: "Jak funguje očkování?", correctAnswer: "Připraví tělo na boj s nemocí", options: ["Lék, který zastaví už začatou nemoc", "Vitamínová injekce pro imunitu", "Připraví tělo na boj s nemocí", "Antibiotikum proti bakteriím"] },
  { question: "Jak předejít úrazu na kole?", correctAnswer: "Přilba, světla a pravidla", options: ["Stačí přilba, nic víc", "Jízda po chodníku bez přilby", "Na kole se úrazy nestávají", "Přilba, světla a pravidla"] },
  { question: "Co jsou bílkoviny a kde je najdeme?", correctAnswer: "Stavební látky těla — maso, ryby, vejce, mléčné výrobky, luštěniny", options: ["Stavební látky těla — maso, ryby, vejce, mléčné výrobky, luštěniny", "Zdroj energie — obiloviny, brambory, rýže", "Ochranné látky — zelenina, ovoce", "Stavební látky jen v mase a vejcích"] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Jak pohyb ovlivňuje spalování energie?", correctAnswer: "Tělo při pohybu spálí víc energie", options: ["Tělo při pohybu spálí míň energie", "Tělo při pohybu spálí víc energie", "Pohyb na spalování nemá vliv", "Energii spálí jen trávení jídla"] },
  { question: "Jak spánek ovlivňuje paměť a učení?", correctAnswer: "Během spánku mozek konsoliduje vzpomínky — přesouvá krátkodobé do dlouhodobé paměti", options: ["Spánek nemá vliv na paměť — učení probíhá jen přes den", "Mozek při spánku nevyvíjí žádnou aktivitu", "Během spánku mozek konsoliduje vzpomínky — přesouvá krátkodobé do dlouhodobé paměti", "Spánek je důležitý jen pro svaly, ne pro mozek"] },
  { question: "Jaký je vliv stresu na zdraví a jak ho zmírnit?", correctAnswer: "Chronický stres poškozuje imunitu, srdce a psychiku — pohyb, meditace, spánek a sociální kontakty pomáhají", options: ["Stres nemá prokazatelný vliv na fyzické zdraví", "Stres je vždy motivující — bez stresu nelze podávat výkony", "Vliv stresu závisí jen na genetice, ne na životním stylu", "Chronický stres poškozuje imunitu, srdce a psychiku — pohyb, meditace, spánek a sociální kontakty pomáhají"] },
  { question: "Proč jsou v jídelníčku důležité ovoce a zelenina?", correctAnswer: "Mají vlákninu, která pomáhá trávení", options: ["Mají vlákninu, která pomáhá trávení", "Obsahují nejvíc bílkovin", "Dodávají tělu nejvíc energie", "Nahradí spánek i pohyb"] },
  { question: "Proč se doporučuje jíst ryby?", correctAnswer: "Mají tuky prospěšné mozku a srdci", options: ["Mají nejvíc cukru ze všech jídel", "Mají tuky prospěšné mozku a srdci", "Nahradí ovoce i zeleninu", "Jsou jediným zdrojem vitamínů"] },
  { question: "Co je potravinová intolerance vs. alergie?", correctAnswer: "Intolerance: obtíže trávení (laktóza). Alergie: imunitní reakce na alergeny – arašídy — může být anafylaxe.", options: ["Intolerance a alergie jsou totéž — liší se jen intenzitou.", "Alergie se projeví jen na kůži, intolerance jen v trávicím traktu.", "Intolerance: obtíže trávení (laktóza). Alergie: imunitní reakce na alergeny – arašídy — může být anafylaxe.", "Obě stavy jsou léčitelné stejnými léky."] },
  { question: "Jak sedavý způsob života (obrazovky) ovlivňuje zdraví dítěte?", correctAnswer: "Obezita, špatné držení těla, poruchy spánku, problémy se zrakem, snížená sociální interakce", options: ["Sedavý způsob nemá zdravotní dopad na děti", "Pouze zrakové problémy — ostatní zdravotní dopady nejsou prokázány", "Sedavý způsob pomáhá regeneraci svalů", "Obezita, špatné držení těla, poruchy spánku, problémy se zrakem, snížená sociální interakce"] },
  { question: "Co dělá v těle imunitní systém?", correctAnswer: "Chrání tělo před nemocemi", options: ["Chrání tělo před nemocemi", "Rozvádí kyslík po celém těle", "Tráví jídlo v žaludku", "Nedá se nijak ovlivnit"] },
  { question: "Proč je důležité omezit zpracované potraviny a fast food?", correctAnswer: "Obsahují nadbytečné množství soli, cukru, trans-tuků a kalorií — zvyšují riziko obezity a kardiovaskulárních chorob", options: ["Zpracované potraviny jsou zdravé — mají vitamíny přidané výrobcem", "Obsahují nadbytečné množství soli, cukru, trans-tuků a kalorií — zvyšují riziko obezity a kardiovaskulárních chorob", "Fast food je škodlivý jen při každodenní konzumaci", "Vědecky není prokázán vliv fast foodu na zdraví dětí"] },
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
    briefDescription: "Naučíš se, co je zdravý životní styl a jak pečovat o tělo.",
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
