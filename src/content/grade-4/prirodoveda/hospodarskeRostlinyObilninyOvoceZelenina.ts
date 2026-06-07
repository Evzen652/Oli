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
  { question: "Z které obilniny se vyrábí mouka a chléb?", correctAnswer: "Pšenice", options: ["Pšenice", "Ječmen", "Oves", "Žito"] },
  { question: "Z čeho se vyrábí tmavý chléb (žitný)?", correctAnswer: "Žito", options: ["Žito", "Pšenice", "Ječmen", "Kukuřice"] },
  { question: "Co jsou luštěniny?", correctAnswer: "Rostliny s plody v luscích bohaté na bílkoviny – hrách, fazole, čočka", options: ["Rostliny s plody v luscích bohaté na bílkoviny – hrách, fazole, čočka", "Druhy ovoce tropických krajů", "Plody stromů bohaté na vitamíny", "Druh obilnin rostoucích v Asii"] },
  { question: "Kde se pěstuje rýže?", correctAnswer: "V teplých – tropických a subtropických krajích", options: ["V teplých – tropických a subtropických krajích", "V mírném podnebném pásu jako pšenice", "V arktických oblastech", "Na vrcholcích hor"] },
  { question: "Jaká zelenina je kořenová?", correctAnswer: "Mrkev, petržel, ředkev", options: ["Mrkev, petržel, ředkev", "Salát, špenát", "Rajče, okurka", "Zelí, brokolice"] },
  { question: "Jaká zelenina patří mezi plodovou?", correctAnswer: "Rajče, okurka, paprika, cuketa", options: ["Rajče, okurka, paprika, cuketa", "Mrkev, petržel, ředkev", "Salát, špenát, čekanec", "Zelí, brokolice, karfiol"] },
  { question: "Co jsou košťálové zeleniny?", correctAnswer: "Zelí, brokolice, karfiol", options: ["Zelí, brokolice, karfiol", "Mrkev, petržel, ředkev", "Salát, špenát", "Rajče, okurka, paprika"] },
  { question: "Jaké tropické ovoce je žluté a roste ve trsech?", correctAnswer: "Banán", options: ["Banán", "Mango", "Ananas", "Citrón"] },
  { question: "Která obilnina se používá na vločky (kaše, müsli)?", correctAnswer: "Oves", options: ["Oves", "Ječmen", "Pšenice", "Kukuřice"] },
  { question: "Z čeho se vyrábí pivo?", correctAnswer: "Z ječmene – slad a chmele", options: ["Z ječmene – slad a chmele", "Z pšenice a žita", "Z kukuřice a chmele", "Z ovsa a chmele"] },
  { question: "Jaké je typické letní červené ovoce rostoucí na záhonech?", correctAnswer: "Jahoda", options: ["Jahoda", "Malina", "Borůvka", "Třešeň"] },
  { question: "Jak se nazývají citrusové plody?", correctAnswer: "Pomeranč, citron, grep, mandarinka", options: ["Pomeranč, citron, grep, mandarinka", "Mango, papája, ananas", "Třešně, švestky, meruňky", "Jablko, hruška, kdoule"] },
  { question: "Co je sója?", correctAnswer: "Luštěnina bohatá na bílkoviny — základ sójového mléka, tofu, lecitinu", options: ["Luštěnina bohatá na bílkoviny — základ sójového mléka, tofu, lecitinu", "Druh obilniny podobný pšenici", "Tropické ovoce z Asie", "Olejnina podobná slunečnici"] },
  { question: "K čemu se využívá kukuřice?", correctAnswer: "Krmivo pro zvířata, popcorn, škrob, biopalivo, siláž", options: ["Krmivo pro zvířata, popcorn, škrob, biopalivo, siláž", "Výroba mouky a chleba jako pšenice", "Jen k výrobě piva jako ječmen", "Jen jako krmivo — nejde zpracovat jinak"] },
  { question: "Co jsou citrusy?", correctAnswer: "Tropické/subtropické plody s vysokým obsahem vitamínu C – pomeranč, citron, mandarinka", options: ["Tropické/subtropické plody s vysokým obsahem vitamínu C – pomeranč, citron, mandarinka", "Druhy lesního ovoce v ČR", "Ovoce s peckou", "Všechno kyselé ovoce bez rozdílu"] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Jak se nazývají pěstované rostliny, které lidé využívají pro obživu?", correctAnswer: "Hospodářské – kulturní rostliny", options: ["Hospodářské – kulturní rostliny", "Plevelné rostliny", "Okrasné rostliny", "Léčivé byliny"] },
  { question: "Jaký je rozdíl mezi ovocem a zeleninou z botanického hlediska?", correctAnswer: "Ovoce vzniká z květu (obsahuje semena). Zelenina: různé části rostliny – kořen, list, plod, stonek .", options: ["Ovoce vzniká z květu (obsahuje semena). Zelenina: různé části rostliny – kořen, list, plod, stonek .", "Zelenina roste jen pod zemí, ovoce nad zemí.", "Ovoce je sladké, zelenina není nikdy sladká.", "Botanický rozdíl neexistuje — jen kuchyňský."] },
  { question: "Proč jsou luštěniny zvláštní co se týče výživy?", correctAnswer: "Obsahují vysoké množství rostlinných bílkovin — alternativa masa v jídelníčku", options: ["Obsahují vysoké množství rostlinných bílkovin — alternativa masa v jídelníčku", "Mají více vitamínu C než ovoce", "Jsou jediným zdrojem vlákniny", "Luštěniny jsou převážně zdrojem tuků"] },
  { question: "Co je střídání plodin a proč je důležité?", correctAnswer: "Každý rok pěstovat na poli jinou plodinu — zabraňuje vyčerpání půdy a šíření chorob", options: ["Každý rok pěstovat na poli jinou plodinu — zabraňuje vyčerpání půdy a šíření chorob", "Pěstovat více plodin najednou na stejném poli", "Tráva se střídá s obilninami každý rok automaticky", "Střídání plodin je zastaralý způsob bez výhod"] },
  { question: "Jak se pěstuje rýže — v čem se liší od pšenice?", correctAnswer: "Rýže roste na zaplavených polích – rýžovištích , pšenice na suchých polích", options: ["Rýže roste na zaplavených polích – rýžovištích , pšenice na suchých polích", "Rýže i pšenice mají stejné nároky na půdu", "Rýže roste v horách, pšenice v nížinách", "Rýže je jehličnan, pšenice je jednoletá bylina"] },
  { question: "Co je zelenina listová?", correctAnswer: "Salát, špenát, čekanec — jí se listy nebo nadzemní část", options: ["Salát, špenát, čekanec — jí se listy nebo nadzemní část", "Mrkev, petržel — kořeny", "Rajče, paprika — plody", "Zelí, karfiol — košťálové"] },
  { question: "K čemu se využívá ječmen kromě piva?", correctAnswer: "Krmivo pro zvířata, kroupy, perličky, cereálie, kávová náhražka – ječmenná káva", options: ["Krmivo pro zvířata, kroupy, perličky, cereálie, kávová náhražka – ječmenná káva", "Jen k výrobě piva a whisky", "Jen k výrobě mouky jako pšenice", "Ječmen nemá jiné využití než pivo"] },
  { question: "Co je agrotechnika?", correctAnswer: "Souhrn zemědělských postupů pro pěstování plodin – orba, hnojení, ochrana před škůdci", options: ["Souhrn zemědělských postupů pro pěstování plodin – orba, hnojení, ochrana před škůdci", "Technika na sklizeň ovoce ze stromů", "Vědecká analýza chemického složení plodin", "Druh zemědělského stroje"] },
  { question: "Proč je tropické ovoce dražší v ČR?", correctAnswer: "Musí se dovézt z tropů — transport na dlouhé vzdálenosti zvyšuje cenu", options: ["Musí se dovézt z tropů — transport na dlouhé vzdálenosti zvyšuje cenu", "Tropické ovoce je obtížněji pěstovatelné než české", "Ceny určuje počasí v ČR", "Tropické ovoce je vzácné a těžko dostupné i v tropech"] },
  { question: "Co jsou obiloviny a čím se vyznačují?", correctAnswer: "Jednoletá trávy s plodem — obilkou – zrnem bohatou na škrob — základ stravy lidstva", options: ["Jednoletá trávy s plodem — obilkou – zrnem bohatou na škrob — základ stravy lidstva", "Druh ořechů z lesních stromů", "Plody mírného pásma bohaté na vitamíny", "Luštěniny s vysokým obsahem bílkovin"] },
  { question: "Proč jsou celozrnné výrobky zdravější než bílé?", correctAnswer: "Obsahují více vlákniny, vitamínů a minerálů z otrub a klíčků obilky", options: ["Obsahují více vlákniny, vitamínů a minerálů z otrub a klíčků obilky", "Jsou kaloricky vydatnější", "Mají vyšší obsah cukru pro rychlou energii", "Jsou jen módním trendem bez prokazatelných výhod"] },
  { question: "Co jsou okopaniny a uveď příklady?", correctAnswer: "Hospodářské rostliny s jedlou podzemní částí — brambor, řepa cukrová, maniok", options: ["Hospodářské rostliny s jedlou podzemní částí — brambor, řepa cukrová, maniok", "Obilniny s tenkými kořeny", "Zelenina rostoucí na tyčkách", "Exotické ovoce dovážené z tropů"] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Proč je genetická rozmanitost zemědělských plodin důležitá?", correctAnswer: "Větší genofond = odolnost vůči nemocem, škůdcům a klimatickým změnám — monokultura je zranitelná", options: ["Větší genofond = odolnost vůči nemocem, škůdcům a klimatickým změnám — monokultura je zranitelná", "Genetická rozmanitost jen prodražuje výrobu", "Zemědělství potřebuje jen jednu nejlepší odrůdu", "Genetická rozmanitost závisí jen na ekologickém zemědělství"] },
  { question: "Co je GMO a proč je kontroverzní?", correctAnswer: "Geneticky modifikovaný organismus — pro: vyšší výnos/odolnost; proti: ekologická rizika a etické otázky", options: ["Geneticky modifikovaný organismus — pro: vyšší výnos/odolnost; proti: ekologická rizika a etické otázky", "Organismus pěstovaný ekologicky bez chemie", "Hybrid vzniklý přirozeným opylením", "GMO jsou zcela bezpečné a schválené bez sporů"] },
  { question: "Jak probíhá ekologické zemědělství (BIO)?", correctAnswer: "Bez syntetických pesticidů a hnojiv, přirozená ochrana, střídání plodin, zachování půdní bioty", options: ["Bez syntetických pesticidů a hnojiv, přirozená ochrana, střídání plodin, zachování půdní bioty", "Bez jakéhokoli hnojení — čistě přírodní", "Jen přísný zákaz pesticidů — hnojiva jsou povolena", "BIO je jen marketingový pojem bez rozdílu v praxi"] },
  { question: "Co je potravinová bezpečnost a proč je globálním problémem?", correctAnswer: "Zajištění dostatečné, zdravé a dostupné potravy pro všechny — ohrožena klimatem, chudobou a plýtváním", options: ["Zajištění dostatečné, zdravé a dostupné potravy pro všechny — ohrožena klimatem, chudobou a plýtváním", "Bezpečnost potravin před chemickým znečištěním jen v bohatých zemích", "Potravinová bezpečnost závisí jen na výnosnosti plodin", "Problém vyřeší GMO bez jiných opatření"] },
  { question: "Proč se v ČR a Evropě omezuje pěstování GMO plodin?", correctAnswer: "Obavy z ekologického dopadu – křížení s planou faunou a nedostatečně prokázaná bezpečnost", options: ["Obavy z ekologického dopadu – křížení s planou faunou a nedostatečně prokázaná bezpečnost", "GMO jsou v ČR zcela zakázány bez výjimky", "EU GMO povoluje bez omezení — jen výrobci odmítají", "Omezení GMO je čistě politické bez vědeckého základu"] },
  { question: "Co je fairtrade a jak ovlivňuje farmáře v rozvojových zemích?", correctAnswer: "Systém certifikace zajišťující spravedlivou cenu pro farmáře — zlepšuje životní podmínky v rozvojových zemích", options: ["Systém certifikace zajišťující spravedlivou cenu pro farmáře — zlepšuje životní podmínky v rozvojových zemích", "Druh ekologického zemědělství bez pesticidů", "Systém omezující dovoz tropického ovoce do EU", "Fairtrade certifikace zajišťuje pouze kvalitu produktů"] },
  { question: "Jak klimatická změna ovlivňuje zemědělství v ČR?", correctAnswer: "Sucha, horká léta, extrémní srážky — nutnost zavlažování, změny plodin, ohrožení výnosů", options: ["Sucha, horká léta, extrémní srážky — nutnost zavlažování, změny plodin, ohrožení výnosů", "Klimatická změna nemá vliv na zemědělství v mírném pásu", "Teplejší klima zlepšuje všechny zemědělské výnosy", "Sucha postihují jen jihovýchodní Moravu"] },
  { question: "Co je vertikální zemědělství a jaké má výhody?", correctAnswer: "Pěstování v poschodích s LED osvětlením uvnitř budov — šetří půdu a vodu, celoroční produkce", options: ["Pěstování v poschodích s LED osvětlením uvnitř budov — šetří půdu a vodu, celoroční produkce", "Klasické zemědělství na svazích kopců", "Pěstování rostlin v zeměpisné šířce bez závislosti na ročních dobách", "Druh skleníkového hospodářství bez kontroly teploty"] },
  { question: "Co je agrolesnictví (agrolesnická soustava)?", correctAnswer: "Kombinace pěstování stromů a zemědělských plodin nebo zvířat na jedné ploše — šetří půdu a zvyšuje biodiverzitu", options: ["Kombinace pěstování stromů a zemědělských plodin nebo zvířat na jedné ploše — šetří půdu a zvyšuje biodiverzitu", "Pěstování plodin v lesním porostu bez úprav", "Druh monokulturního lesnictví", "Zemědělství v chráněných oblastech lesa"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 40);
}

export const HOSPODARSKEROSTLINYOBILNINYOVOCEZELENINA: TopicMetadata[] = [
  {
    id: "g4-prirodoveda-rozmanitost-prirody-ziva-priroda-rostliny-hospodarske-rostliny-obilniny-ovoce-zelenina",
    rvpNodeId: "g4-prirodoveda-rozmanitost-prirody-ziva-priroda-rostliny-hospodarske-rostliny-obilniny-ovoce-zelenina",
    title: "Hospodářské rostliny - obilniny, ovoce, zelenina",
    studentTitle: "Rostliny z polí",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Rozmanitost přírody",
    briefDescription: "Poznáš obilniny, ovoce a zeleninu a jak se pěstují.",
    keywords: ["pšenice", "ječmen", "žito", "oves", "kukuřice", "rýže", "luštěniny", "zelenina", "ovoce"],
    goals: [
      "Jmenovat hlavní obilniny a jejich využití",
      "Rozlišit kořenovou, listovou, plodovou a košťálovou zeleninu",
      "Uvést příklady ovoce mírného a tropického pásma",
      "Vysvětlit, co jsou luštěniny",
    ],
    boundaries: ["Podrobná agrotechnika a výrobní procesy nejsou náplní 4. ročníku"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Obilniny: pšenice (mouka), ječmen (pivo), žito (tmavý chléb), oves (vločky), kukuřice (krmivo).",
      steps: [
        "1. Zelenina kořenová: mrkev, petržel, řepa.",
        "2. Zelenina plodová: rajče, okurka, paprika.",
        "3. Zelenina košťálová: zelí, brokolice, karfiol.",
        "4. Luštěniny: hrách, fazole, čočka, sója — bílkoviny.",
      ],
      commonMistake: "Rajče je botanicky ovoce (plod s semeny), ale v kuchyni ho řadíme mezi zeleninu.",
      example: "Pšenice → mouka → chléb, těstoviny. Ječmen → pivo, kroupy, krmivo.",
    },
  },
];
