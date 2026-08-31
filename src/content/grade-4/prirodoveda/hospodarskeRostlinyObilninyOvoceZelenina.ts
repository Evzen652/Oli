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
  { question: "Co jsou luštěniny?", correctAnswer: "Rostliny s plody v luscích", options: ["Druhy ovoce tropických krajů", "Rostliny s plody v luscích", "Plody stromů bohaté na vitamíny", "Druh obilnin rostoucích v Asii"] },
  { question: "Kde se pěstuje rýže?", correctAnswer: "V teplých – tropických a subtropických krajích", options: ["V teplých – tropických a subtropických krajích", "V mírném podnebném pásu jako pšenice", "V arktických oblastech", "Na vrcholcích hor"] },
  { question: "Jaká zelenina je kořenová?", correctAnswer: "Mrkev, petržel, ředkev", options: ["Mrkev, petržel, ředkev", "Salát, špenát", "Rajče, okurka", "Zelí, brokolice"] },
  { question: "Jaká zelenina patří mezi plodovou?", correctAnswer: "Rajče, okurka, paprika, cuketa", options: ["Rajče, okurka, paprika, cuketa", "Mrkev, petržel, ředkev", "Salát, špenát, čekanka", "Zelí, brokolice, květák"] },
  { question: "Co jsou košťálové zeleniny?", correctAnswer: "Zelí, brokolice, květák", options: ["Zelí, brokolice, květák", "Mrkev, petržel, ředkev", "Salát, špenát", "Rajče, okurka, paprika"] },
  { question: "Jaké tropické ovoce je žluté a roste ve trsech?", correctAnswer: "Banán", options: ["Banán", "Mango", "Ananas", "Citrón"] },
  { question: "Která obilnina se používá na vločky (kaše, müsli)?", correctAnswer: "Oves", options: ["Oves", "Ječmen", "Pšenice", "Kukuřice"] },
  { question: "Z čeho se vyrábí pivo?", correctAnswer: "Z ječmene – slad a chmele", options: ["Z ječmene – slad a chmele", "Z pšenice a žita", "Z kukuřice a chmele", "Z ovsa a chmele"] },
  { question: "Jaké je typické letní červené ovoce rostoucí na záhonech?", correctAnswer: "Jahoda", options: ["Jahoda", "Malina", "Borůvka", "Třešeň"] },
  { question: "Jak se nazývají citrusové plody?", correctAnswer: "Pomeranč, citron, grep, mandarinka", options: ["Pomeranč, citron, grep, mandarinka", "Mango, papája, ananas", "Třešně, švestky, meruňky", "Jablko, hruška, kdoule"] },
  { question: "Co je sója?", correctAnswer: "Luštěnina na tofu a sójové mléko", options: ["Druh obilniny podobný pšenici", "Luštěnina na tofu a sójové mléko", "Tropické ovoce dovážené z Asie", "Olejnina podobná slunečnici"] },
  { question: "K čemu se využívá kukuřice?", correctAnswer: "Krmivo pro zvířata, popcorn, škrob, biopalivo, siláž", options: ["Krmivo pro zvířata, popcorn, škrob, biopalivo, siláž", "Výroba mouky a chleba jako pšenice", "Jen k výrobě piva jako ječmen", "Jen jako krmivo — nejde zpracovat jinak"] },
  { question: "Co jsou citrusy?", correctAnswer: "Plody teplých krajů s vitamínem C", options: ["Druhy lesního ovoce v ČR", "Plody teplých krajů s vitamínem C", "Ovoce s tvrdou peckou uvnitř", "Všechno kyselé ovoce bez rozdílu"] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Jak se nazývají pěstované rostliny, které lidé využívají pro obživu?", correctAnswer: "Hospodářské – kulturní rostliny", options: ["Hospodářské – kulturní rostliny", "Plevelné rostliny", "Okrasné rostliny", "Léčivé byliny"] },
  { question: "Jaký je rozdíl mezi ovocem a zeleninou?", correctAnswer: "Ovoce vzniká z květu a má semena", options: ["Zelenina roste jen pod zemí", "Ovoce vzniká z květu a má semena", "Ovoce je sladké, zelenina nikdy", "Žádný rozdíl, jen kuchyňský"] },
  { question: "Čím jsou luštěniny výjimečné ve výživě?", correctAnswer: "Mají hodně rostlinných bílkovin", options: ["Mají víc vitamínu C než ovoce", "Mají hodně rostlinných bílkovin", "Jsou jediným zdrojem vlákniny", "Jsou hlavně zdrojem tuků"] },
  { question: "Co je střídání plodin a proč je důležité?", correctAnswer: "Každý rok pěstovat na poli jinou plodinu — zabraňuje vyčerpání půdy a šíření chorob", options: ["Každý rok pěstovat na poli jinou plodinu — zabraňuje vyčerpání půdy a šíření chorob", "Pěstovat více plodin najednou na stejném poli", "Tráva se střídá s obilninami každý rok automaticky", "Střídání plodin je zastaralý způsob bez výhod"] },
  { question: "Jak se pěstuje rýže — v čem se liší od pšenice?", correctAnswer: "Rýže roste na zaplavených polích – rýžovištích , pšenice na suchých polích", options: ["Rýže roste na zaplavených polích – rýžovištích , pšenice na suchých polích", "Rýže i pšenice mají stejné nároky na půdu", "Rýže roste v horách, pšenice v nížinách", "Rýže je jehličnan, pšenice je jednoletá bylina"] },
  { question: "Co je zelenina listová?", correctAnswer: "Salát a špenát, jí se listy", options: ["Mrkev a petržel, jí se kořen", "Salát a špenát, jí se listy", "Rajče a paprika, jí se plod", "Zelí a květák, jí se košťál"] },
  { question: "K čemu se využívá ječmen kromě piva?", correctAnswer: "Krmivo, kroupy i ječná káva", options: ["Jen k výrobě piva a whisky", "Krmivo, kroupy i ječná káva", "Jen na mouku jako pšenice", "Nemá jiné využití než pivo"] },
  { question: "Co patří k práci na poli před setím?", correctAnswer: "Orba, hnojení a příprava půdy", options: ["Sklizeň ovoce ze stromů", "Orba, hnojení a příprava půdy", "Rozbor chemického složení plodin", "Nákup zemědělských strojů"] },
  { question: "Proč je tropické ovoce dražší v ČR?", correctAnswer: "Musí se dovézt z tropů — transport na dlouhé vzdálenosti zvyšuje cenu", options: ["Musí se dovézt z tropů — transport na dlouhé vzdálenosti zvyšuje cenu", "Tropické ovoce je obtížněji pěstovatelné než české", "Ceny určuje počasí v ČR", "Tropické ovoce je vzácné a těžko dostupné i v tropech"] },
  { question: "Co jsou obiloviny?", correctAnswer: "Trávy s obilkou bohatou na škrob", options: ["Druh ořechů z lesních stromů", "Trávy s obilkou bohatou na škrob", "Plody mírného pásma s vitamíny", "Luštěniny bohaté na bílkoviny"] },
  { question: "Proč jsou celozrnné výrobky zdravější než bílé?", correctAnswer: "Obsahují více vlákniny, vitamínů a minerálů z otrub a klíčků obilky", options: ["Obsahují více vlákniny, vitamínů a minerálů z otrub a klíčků obilky", "Jsou kaloricky vydatnější", "Mají vyšší obsah cukru pro rychlou energii", "Jsou jen módním trendem bez prokazatelných výhod"] },
  { question: "Co jsou okopaniny?", correctAnswer: "Rostliny s jedlou částí pod zemí", options: ["Obilniny s tenkými kořeny", "Rostliny s jedlou částí pod zemí", "Zelenina rostoucí na tyčkách", "Exotické ovoce z tropů"] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Proč je genetická rozmanitost zemědělských plodin důležitá?", correctAnswer: "Větší genofond = odolnost vůči nemocem, škůdcům a klimatickým změnám — monokultura je zranitelná", options: ["Větší genofond = odolnost vůči nemocem, škůdcům a klimatickým změnám — monokultura je zranitelná", "Genetická rozmanitost jen prodražuje výrobu", "Zemědělství potřebuje jen jednu nejlepší odrůdu", "Genetická rozmanitost závisí jen na ekologickém zemědělství"] },
  { question: "Proč se hospodářské rostliny šlechtí?", correctAnswer: "Aby daly víc úrody a lépe odolávaly", options: ["Aby byly hezčí na pohled", "Aby daly víc úrody a lépe odolávaly", "Aby rostly bez vody a světla", "Aby se nemusely vůbec sklízet"] },
  { question: "Jak probíhá ekologické zemědělství (BIO)?", correctAnswer: "Bez syntetických pesticidů a hnojiv, přirozená ochrana, střídání plodin, zachování půdní bioty", options: ["Bez syntetických pesticidů a hnojiv, přirozená ochrana, střídání plodin, zachování půdní bioty", "Bez jakéhokoli hnojení — čistě přírodní", "Jen přísný zákaz pesticidů — hnojiva jsou povolena", "BIO je jen marketingový pojem bez rozdílu v praxi"] },
  { question: "Co je potravinová bezpečnost a proč je globálním problémem?", correctAnswer: "Zajištění dostatečné, zdravé a dostupné potravy pro všechny — ohrožena klimatem, chudobou a plýtváním", options: ["Zajištění dostatečné, zdravé a dostupné potravy pro všechny — ohrožena klimatem, chudobou a plýtváním", "Bezpečnost potravin před chemickým znečištěním jen v bohatých zemích", "Potravinová bezpečnost závisí jen na výnosnosti plodin", "Problém vyřeší GMO bez jiných opatření"] },
  { question: "Proč se v ČR a Evropě omezuje pěstování GMO plodin?", correctAnswer: "Obavy z ekologického dopadu – křížení s planou faunou a nedostatečně prokázaná bezpečnost", options: ["Obavy z ekologického dopadu – křížení s planou faunou a nedostatečně prokázaná bezpečnost", "GMO jsou v ČR zcela zakázány bez výjimky", "EU GMO povoluje bez omezení — jen výrobci odmítají", "Omezení GMO je čistě politické bez vědeckého základu"] },
  { question: "Proč je dobré kupovat potraviny od místních pěstitelů?", correctAnswer: "Nemusí cestovat daleko, jsou čerstvější", options: ["Jsou vždycky levnější než dovezené", "Nemusí cestovat daleko, jsou čerstvější", "Vydrží déle než dovezené", "Mají víc vitamínů než jakékoli jiné"] },
  { question: "Jak klimatická změna ovlivňuje zemědělství v ČR?", correctAnswer: "Sucha, horká léta, extrémní srážky — nutnost zavlažování, změny plodin, ohrožení výnosů", options: ["Sucha, horká léta, extrémní srážky — nutnost zavlažování, změny plodin, ohrožení výnosů", "Klimatická změna nemá vliv na zemědělství v mírném pásu", "Teplejší klima zlepšuje všechny zemědělské výnosy", "Sucha postihují jen jihovýchodní Moravu"] },
  { question: "Co je vertikální zemědělství a jaké má výhody?", correctAnswer: "Pěstování v poschodích s LED osvětlením uvnitř budov — šetří půdu a vodu, celoroční produkce", options: ["Pěstování v poschodích s LED osvětlením uvnitř budov — šetří půdu a vodu, celoroční produkce", "Klasické zemědělství na svazích kopců", "Pěstování rostlin v zeměpisné šířce bez závislosti na ročních dobách", "Druh skleníkového hospodářství bez kontroly teploty"] },
  { question: "Proč zemědělci nechávají mezi poli stromořadí?", correctAnswer: "Chrání půdu před větrem a suchem", options: ["Aby bylo pole hezčí na pohled", "Chrání půdu před větrem a suchem", "Aby se stroje lépe otáčely", "Stromy dodávají poli vodu z listů"] },
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
        "3. Zelenina košťálová: zelí, brokolice, květák.",
        "4. Luštěniny: hrách, fazole, čočka, sója — bílkoviny.",
      ],
      commonMistake: "Rajče je botanicky ovoce (plod s semeny), ale v kuchyni ho řadíme mezi zeleninu.",
      example: "Pšenice → mouka → chléb, těstoviny. Ječmen → pivo, kroupy, krmivo.",
    },
  },
];
