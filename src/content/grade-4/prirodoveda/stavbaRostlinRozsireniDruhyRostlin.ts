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
  { question: "Jaké jsou hlavní části rostliny?", correctAnswer: "Kořen, stonek, list, květ, plod", options: ["Kořen, stonek, list, květ, plod", "Kořen, větve, listy, šišky", "Hlíza, kmen, jehličí, semena", "Kořen, stonek, liána, květ"] },
  { question: "Jaká je funkce kořene?", correctAnswer: "Ukotvení v půdě, příjem vody a minerálních látek", options: ["Ukotvení v půdě, příjem vody a minerálních látek", "Výroba cukru fotosyntézou", "Opylení rostliny", "Šíření semen do okolí"] },
  { question: "V jaké části rostliny probíhá fotosyntéza?", correctAnswer: "V listech (v chloroplastech s chlorofylem)", options: ["V listech (v chloroplastech s chlorofylem)", "V kořenech", "V plodech", "V stonku"] },
  { question: "Co rostlina potřebuje k fotosyntéze?", correctAnswer: "Světlo, oxid uhličitý (CO₂), voda", options: ["Světlo, oxid uhličitý (CO₂), voda", "Světlo, kyslík, voda", "Teplo, dusík, voda", "Světlo, cukr, voda"] },
  { question: "Co vzniká při fotosyntéze?", correctAnswer: "Cukr (glukóza) a kyslík", options: ["Cukr (glukóza) a kyslík", "Oxid uhličitý a voda", "Dusík a kyslík", "Voda a kypřidla"] },
  { question: "Jak se nazývá zelené barvivo v listech?", correctAnswer: "Chlorofyl", options: ["Chlorofyl", "Melanin", "Karotén", "Hemoglobin"] },
  { question: "Jaká je funkce stonku?", correctAnswer: "Mechanická opora a vedení látek (voda a minerály nahoru, cukry dolů)", options: ["Mechanická opora a vedení látek (voda a minerály nahoru, cukry dolů)", "Zásobení rostliny vodou kořeny", "Výroba cukru jako listy", "Zásobní funkce semen"] },
  { question: "Jaká je funkce květu?", correctAnswer: "Rozmnožování — opylení vede ke vzniku plodu a semen", options: ["Rozmnožování — opylení vede ke vzniku plodu a semen", "Fotosyntéza náhradou za listy", "Přijímání minerálů z půdy", "Vedení vody ke stonku"] },
  { question: "Co vzniká z květu po opylení?", correctAnswer: "Plod (se semeny)", options: ["Plod (se semeny)", "Nový kořen", "Nový stonek", "Nový květ"] },
  { question: "Jak se šíří semena pampeliška?", correctAnswer: "Větrem — semena mají chmýří (nažky s létajícím přívěskem)", options: ["Větrem — semena mají chmýří (nažky s létajícím přívěskem)", "Vodou", "Ptáky", "Mravenci"] },
  { question: "Jak se šíří semena jahod a třešní?", correctAnswer: "Živočichy — ptáci a savci sní plod a vyloučí semena", options: ["Živočichy — ptáci a savci sní plod a vyloučí semena", "Větrem", "Vodou", "Vlastním výstřelem"] },
  { question: "Jak se šíří semena javoru?", correctAnswer: "Větrem — mají křídlo (vrtulka), které zpomaluje pád a nese vítr", options: ["Větrem — mají křídlo (vrtulka), které zpomaluje pád a nese vítr", "Vodou", "Živočichy", "Vlastním výstřelem jako boba"] },
  { question: "Jaká je zásobní funkce kořene?", correctAnswer: "Ukládá zásoby živin — příkladem je mrkev a řepa (zásobní kořen)", options: ["Ukládá zásoby živin — příkladem je mrkev a řepa (zásobní kořen)", "Zásobuje okolní rostliny vodou", "Ukládá zásoby světla pro fotosyntézu", "Zásobní funkci má jen stonek"] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Co je kořenové vlášení?", correctAnswer: "Jemné výrůstky kořene zvětšující plochu pro příjem vody a živin", options: ["Jemné výrůstky kořene zvětšující plochu pro příjem vody a živin", "Větší větve kořenového systému", "Drobné listy na kořenech", "Kořeny jiných rostlin pronikající do půdy"] },
  { question: "Co je dřevo a lýko ve stonku?", correctAnswer: "Dřevo: vede vodu + minerály nahoru. Lýko: vede cukry (asimiláty) dolů.", options: ["Dřevo: vede vodu + minerály nahoru. Lýko: vede cukry (asimiláty) dolů.", "Dřevo: vede cukry dolů. Lýko: vede vodu nahoru.", "Obě tkáně vedou vodu stejným směrem.", "Dřevo i lýko mají jen mechanickou funkci."] },
  { question: "Co jsou průduchy na listech?", correctAnswer: "Drobné otvůrky regulující výměnu plynů (CO₂, O₂) a odpařování vody", options: ["Drobné otvůrky regulující výměnu plynů (CO₂, O₂) a odpařování vody", "Otvory pro příjem vody listy", "Kanálky pro vedení živin v listu", "Chloroplasty na povrchu listu"] },
  { question: "Co je transpiraci u rostlin?", correctAnswer: "Výpar vody z listů průduchy — pohání vzestup vody z kořenů", options: ["Výpar vody z listů průduchy — pohání vzestup vody z kořenů", "Příjem vody kořeny z půdy", "Přenos cukrů z listů do kořenů", "Fotosyntéza za horkého počasí"] },
  { question: "Jaký je rozdíl mezi jednoděložnými a dvouděložnými rostlinami?", correctAnswer: "Jednoděložné: 1 děloha (trávy, obiloviny). Dvouděložné: 2 dělohy (stromy, byliny, zelenina).", options: ["Jednoděložné: 1 děloha (trávy, obiloviny). Dvouděložné: 2 dělohy (stromy, byliny, zelenina).", "Jednoděložné mají listy po jednom, dvouděložné po dvou.", "Dvouděložné jsou vždy stromy, jednoděložné byliny.", "Jednoděložné mají zelenější listy."] },
  { question: "Proč mají rostliny v pouštích drobné listy nebo trny?", correctAnswer: "Omezení transpiraci — malý povrch listu = méně výparu vody v suchém prostředí", options: ["Omezení transpiraci — malý povrch listu = méně výparu vody v suchém prostředí", "Přizpůsobení k využití více světla", "Ochrana před živočichy v pouštích", "Trny a jehlice lépe sbírají rosnou vláhu"] },
  { question: "Jak se rostliny přizpůsobily k opylení hmyzem?", correctAnswer: "Barevné a vonné květy, nektar — přitahují opylovače", options: ["Barevné a vonné květy, nektar — přitahují opylovače", "Produkce velkého množství lehkého pylu", "Rostliny přizpůsobení hmyzu nemají — opylení je pasivní", "Lepkavé listy zachytávající hmyz"] },
  { question: "Jak se šíří semena s háčky (např. lopuch)?", correctAnswer: "Živočichy — háčky se zachytí na srsti nebo oblečení (epizoochorie)", options: ["Živočichy — háčky se zachytí na srsti nebo oblečení (epizoochorie)", "Větrem", "Vodou", "Prasknutím tobolky"] },
  { question: "Co je zásobní funkce plodu?", correctAnswer: "Chrání semeno a láká živočichy (sladká dužina) k roznesení", options: ["Chrání semeno a láká živočichy (sladká dužina) k roznesení", "Uchovává zásoby vody pro semeno", "Zásobuje kořeny rostliny cukry", "Plod nemá zásobní funkci"] },
  { question: "Co je klíčení semene?", correctAnswer: "Semeno nasaje vodu a klíčí — nejprve vyrůstá kořínek, pak stonek s dělohami", options: ["Semeno nasaje vodu a klíčí — nejprve vyrůstá kořínek, pak stonek s dělohami", "Semeno se rozloží v půdě a hnojí ji", "Semeno vyrůstá jen po opylení květu", "Klíčení nastává jen v tropickém podnebí"] },
  { question: "Jak se šíří semena kokosového ořechu?", correctAnswer: "Vodou — plod je vzdušný a nepromokavý, unese ho moře", options: ["Vodou — plod je vzdušný a nepromokavý, unese ho moře", "Živočichy", "Větrem", "Explozí plodu"] },
  { question: "Proč rostliny opylovane větrem mají méně nápadné květy?", correctAnswer: "Nepotřebují přitáhnout hmyz — produkují velké množství drobného lehkého pylu", options: ["Nepotřebují přitáhnout hmyz — produkují velké množství drobného lehkého pylu", "Větrný pyl nepotřebuje barvu pro rozptýlení", "Rostliny s větrem nemají květy vůbec", "Méně výrazné barvy chrání pyl před UV"] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Jak probíhá fotosyntéza na molekulární úrovni (zjednodušeně)?", correctAnswer: "6CO₂ + 6H₂O + světlo → C₆H₁₂O₆ (glukóza) + 6O₂", options: ["6CO₂ + 6H₂O + světlo → C₆H₁₂O₆ (glukóza) + 6O₂", "6O₂ + 6H₂O + světlo → C₆H₁₂O₆ + 6CO₂", "CO₂ + H₂O + světlo → O₂ (bez vzniku cukru)", "Fotosyntéza jen přeměňuje CO₂ na O₂ bez vzniku cukru"] },
  { question: "Co je celulóza a kde ji u rostlin najdeme?", correctAnswer: "Polysacharid tvořící buněčné stěny — dává pevnost stonkům, listům a dřevu", options: ["Polysacharid tvořící buněčné stěny — dává pevnost stonkům, listům a dřevu", "Zásobní cukr v hlízách rostlin", "Pigment zodpovědný za barvu listů", "Enzym katalyzující fotosyntézu"] },
  { question: "Co je apikální meristém a jaká je jeho funkce?", correctAnswer: "Pletivo na špičce kořene a výhonu schopné dělení — zodpovídá za prodlužování rostliny", options: ["Pletivo na špičce kořene a výhonu schopné dělení — zodpovídá za prodlužování rostliny", "Pletivo zodpovídající za fotosyntézu v listech", "Zásobní tkáň pro cukry v hlízách", "Buňky tvořící vodivé trubice"] },
  { question: "Jak probíhá opylení a oplodnění u rostlin?", correctAnswer: "Pyl se přenese na bliznu, klíčí pylová láčka, splyne s vajíčkem → zárodek → semeno", options: ["Pyl se přenese na bliznu, klíčí pylová láčka, splyne s vajíčkem → zárodek → semeno", "Pyl padá do plodu a vytváří semena přímo", "Opylení a oplodnění jsou totéž — dochází k nim najednou", "Pyl splyne s plodnicí bez vajíčka"] },
  { question: "Co je endosperm semene?", correctAnswer: "Zásobní pletivo semene zásobující klíček živinami při klíčení", options: ["Zásobní pletivo semene zásobující klíček živinami při klíčení", "Vnější obal semene (osemení)", "Zárodečný kořen v semenu", "Chlorofyl v nezralém semeni"] },
  { question: "Jak se liší C3 a C4 rostliny?", correctAnswer: "C4 (kukuřice, cukrová třtina) mají efektivnější fotosyntézu v horku — méně ztrát vody", options: ["C4 (kukuřice, cukrová třtina) mají efektivnější fotosyntézu v horku — méně ztrát vody", "C3 jsou náchylnější k suchu než C4", "C4 rostliny mají 4 listy, C3 mají 3 listy", "Rozdíl je pouze v počtu chromozomů"] },
  { question: "Co je vegetativní rozmnožování a uveď příklady?", correctAnswer: "Rozmnožování bez semen — výhonky (jahoda), hlízy (brambor), odnože (česnek), řízky", options: ["Rozmnožování bez semen — výhonky (jahoda), hlízy (brambor), odnože (česnek), řízky", "Opylení bez hmyzu — výlučně větrem", "Klonování pomocí laboratorní metody", "Semena klíčící bez zálivky"] },
  { question: "Co je kamenice (sukulentní) rostlina a jak přežívá sucho?", correctAnswer: "Rostlina ukládající vodu v tlustých listích nebo stoncích (kaktus, aloe) — průduchy otevírá v noci", options: ["Rostlina ukládající vodu v tlustých listích nebo stoncích (kaktus, aloe) — průduchy otevírá v noci", "Rostlina přežívající sucho odpadem listí v létě", "Rostlina rostoucí jen na mokrých půdách", "Rostlina s hlubokými kořeny čerpající spodní vodu"] },
  { question: "Proč jsou stromy schopny žít stovky let?", correctAnswer: "Kambium (meristém) se neustále dělí a tvoří nové vrstvičky dřeva a lýka — neomezený růst", options: ["Kambium (meristém) se neustále dělí a tvoří nové vrstvičky dřeva a lýka — neomezený růst", "Stromy mají speciální enzymy zpomalující stárnutí", "Délka života je geneticky omezena stejně jako u zvířat", "Stromy se každé jaro kompletně obnoví z klíčků"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 40);
}

export const STAVBAROSTLINROZSIRENIDRUHYROSTLIN: TopicMetadata[] = [
  {
    id: "g4-prirodoveda-rozmanitost-prirody-ziva-priroda-rostliny-stavba-rostlin-rozsireni-druhy-rostlin",
    rvpNodeId: "g4-prirodoveda-rozmanitost-prirody-ziva-priroda-rostliny-stavba-rostlin-rozsireni-druhy-rostlin",
    title: "Stavba rostlin - rozšíření, druhy rostlin",
    studentTitle: "Jak funguje rostlina",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Rozmanitost přírody",
    briefDescription: "Pochopíš, jak fungují části rostliny a jak se semena dostávají do celého světa.",
    keywords: ["fotosyntéza", "chlorofyl", "kořen", "stonek", "list", "květ", "plod", "semena", "opylení", "šíření semen"],
    goals: [
      "Popsat funkci kořene, stonku, listu, květu a plodu",
      "Vysvětlit průběh fotosyntézy",
      "Uvést způsoby šíření semen (vítr, voda, živočichové)",
      "Rozlišit jednoděložné a dvouděložné rostliny",
    ],
    boundaries: ["Podrobná buněčná biologie není náplní 4. ročníku"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Fotosyntéza: světlo + CO₂ + voda → cukr + kyslík (v listech s chlorofylem).",
      steps: [
        "1. Kořen: ukotvení + příjem vody a minerálů.",
        "2. Stonek: opora + dřevo (voda nahoru) + lýko (cukry dolů).",
        "3. List: fotosyntéza + transpirace.",
        "4. Květ → plod → semeno → šíření (vítr, voda, živočich).",
      ],
      commonMistake: "Fotosyntéza probíhá v listech (ne v kořenech ani stonku).",
      example: "Pampeliška šíří semena větrem (chmýří). Třešeň živočichy (ptáci sní plod).",
    },
  },
];
