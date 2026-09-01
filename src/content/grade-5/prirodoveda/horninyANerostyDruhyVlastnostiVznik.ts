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
  { question: "Jak se jmenuje nejtvrdší nerost na světě?", correctAnswer: "Diamant", options: ["Diamant", "Rubín", "Křemen", "Mastek"], hints: ["Má tvrdost 10 na Mohsově stupnici."] },
  { question: "Co jsou horniny?", correctAnswer: "Pevné látky tvořící zemskou kůru, složené z nerostů", options: ["Kapaliny v zemském nitru", "Pevné látky tvořící zemskou kůru, složené z nerostů", "Jen úlomky skal v řekách", "Horniny jsou totéž co nerosty"], hints: ["Hornina = kombinace nerostů."] },
  { question: "Jak vznikají vyvřelé horniny?", correctAnswer: "Ochlazením magmatu – roztavené horniny", options: ["Vrstvením usazenin v moři", "Přeměnou pod vysokým tlakem a teplotou", "Ochlazením magmatu – roztavené horniny", "Větráním starých hornin"], hints: ["Příkladem je žula nebo čedič."] },
  { question: "Jak vznikají usazené (sedimentární) horniny?", correctAnswer: "Vrstvením a stmelením usazenin – písku, bahna, schránek", options: ["Ochlazením sopečného magmatu", "Přeměnou jiných hornin tlakem a teplotou", "Rozpuštěním starých hornin vodou", "Vrstvením a stmelením usazenin – písku, bahna, schránek"], hints: ["Příkladem jsou pískovce, vápenec nebo uhlí."] },
  { question: "Která hornina vzniká ze žuly přeměnou?", correctAnswer: "Rula", options: ["Rula", "Čedič", "Vápenec", "Pískovec"], hints: ["Přeměněné horniny vznikají tlakem a teplotou."] },
  { question: "Co je to Mohsova stupnice?", correctAnswer: "Stupnice tvrdosti nerostů – 1 = nejměkčí mastek, 10 = nejtvrdší diamant", options: ["Stupnice, která řadí horniny podle jejich velikosti", "Stupnice tvrdosti nerostů – 1 = nejměkčí mastek, 10 = nejtvrdší diamant", "Stupnice, která určuje stáří jednotlivých nerostů", "Stupnice hodnotící lesk a barvu drahých kamenů"], hints: ["Nůž má tvrdost přibližně 5,5."] },
  { question: "Který nerost je nejměkčí na Mohsově stupnici?", correctAnswer: "Mastek – tvrdost 1", options: ["Diamant – tvrdost 10", "Křemen – tvrdost 7", "Mastek – tvrdost 1", "Apatit – tvrdost 5"], hints: ["Tento nerost je tak měkký, že ho poškrábeš nehtem."] },
  { question: "Jak se jmenuje nejrozšířenější hornina ve stavebnictví?", correctAnswer: "Žula – granit", options: ["Vápenec", "Pískovec", "Uhlí", "Žula – granit"], hints: ["Tahle nejrozšířenější stavební hornina je vyvřelá a tvrdá, ne usazená jako vápenec, pískovec nebo uhlí."] },
  { question: "Co je uhlí?", correctAnswer: "Usazená hornina vzniklá z odumřelých rostlin před miliony let", options: ["Usazená hornina vzniklá z odumřelých rostlin před miliony let", "Vyvřelá hornina ze sopky", "Přeměněná hornina vzniklá z vápence", "Nerost z řek a jezer"], hints: ["Uhlí se používá jako palivo."] },
  { question: "Co jsou drahokamy?", correctAnswer: "Vzácné nerosty s vysokou tvrdostí a leskem – diamant, rubín, safír, smaragd", options: ["Všechny barevné kameny, které najdeme kdekoli v přírodě", "Vzácné nerosty s vysokou tvrdostí a leskem – diamant, rubín, safír, smaragd", "Horniny, které vyvěrají přímo ze sopečných trubic", "Pouze uměle vyrobené krystaly ve šperkařství"], hints: ["Drahokamy se používají ve špercích."] },
  { question: "Co je ropa?", correctAnswer: "Kapalné fosilní palivo vzniklé z odumřelých mořských organismů", options: ["Voda obohacená minerály", "Sopečná hornina v kapalném stavu", "Kapalné fosilní palivo vzniklé z odumřelých mořských organismů", "Přeměněná podzemní voda"], hints: ["Z ropy se vyrábí benzín a plasty."] },
  { question: "Která hornina se používá k výrobě vápna a cementu?", correctAnswer: "Vápenec", options: ["Žula", "Pískovec", "Rula", "Vápenec"], hints: ["K výrobě vápna a cementu potřebujeme usazenou horninu bohatou na vápník, ne tvrdou vyvřelou horninu jako žula, ani pískovec či rula."] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Jaký je rozdíl mezi horninou a nerostem?", correctAnswer: "Nerost má všude stejné složení, hornina je směs více nerostů", options: ["Nerost má všude stejné složení, hornina je směs více nerostů", "Nerost je vždy větší kus hmoty než hornina, ze které pochází", "Horniny jsou vždy starší než nerosty, ze kterých jsou složené", "Nerosty jsou vždy kapalné, zatímco horniny jsou vždy pevné"], hints: ["Žula je složená z křemene, živce a slídy. Je tedy žula hornina, nebo nerost?"] },
  { question: "Jak se liší tři typy hornin podle toho, jak vznikly?", correctAnswer: "Vyvřelé tuhnutím magmatu, usazené vrstvením úlomků, přeměněné působením tepla a tlaku", options: ["Vyvřelé jsou nejstarší, usazené mladší a přeměněné nejmladší", "Vyvřelé tuhnutím magmatu, usazené vrstvením úlomků, přeměněné působením tepla a tlaku", "Všechny vznikají tuhnutím magmatu, liší se jen jeho rychlostí", "Přeměněné vznikají sopkami, ostatní dvě skupiny v mořích"], hints: ["Každý typ = jiný geologický proces. Zkus si k nim přiřadit oheň, vodu a tlak."] },
  { question: "Proč jsou vrstvy usazených hornin vodorovné?", correctAnswer: "Usazeniny klesají na dno moří a jezer vrstvu po vrstvě — každá je jinak stará", options: ["Proudy vzduchu ukládají úlomky do pravidelných vodorovných pásů", "Vrstvy vznikají sopečnými výbuchy v pravidelných intervalech", "Usazeniny klesají na dno moří a jezer vrstvu po vrstvě — každá je jinak stará", "Je to jen náhoda, žádné geologické vysvětlení pro to není"], hints: ["Co udělá písek, který nasypeš do sklenice s vodou? A co když ho nasypeš znovu?"] },
  { question: "Diamant i tuha jsou z uhlíku. Proč je jeden nejtvrdší a druhý tak měkký, že píše?", correctAnswer: "Liší se vnitřním uspořádáním, ne látkou, ze které jsou", options: ["Tuha obsahuje mnohem méně uhlíku než diamant, proto je měkčí", "Diamant vzniká hlouběji v Zemi, a proto je tvrdší", "Tuha je ve skutečnosti úplně jiný nerost než diamant", "Liší se vnitřním uspořádáním, ne látkou, ze které jsou"], hints: ["Ze stejných kostek můžeš postavit vratkou věž i pevnou krychli. Na čem to záleží?"] },
  { question: "Jak vzniklo uhlí a proč se mu říká fosilní palivo?", correctAnswer: "Z odumřelých rostlin, které se miliony let ukládaly a měnily pod tlakem a teplem — je to uložená energie Slunce", options: ["Z odumřelých rostlin, které se miliony let ukládaly a měnily pod tlakem a teplem — je to uložená energie Slunce", "Z krystalů, které se vysrážely ze sopečné horniny při jejím tuhnutí", "Ze zkamenělých kostí a schránek pravěkých zvířat, ne z rostlin", "V bažinách se uhlí tvoří i dnes, celý proces trvá jen deset let"], hints: ["Slovo fosilní znamená zkamenělý. Co v pravěkých bažinách zkamenělo?"] },
  { question: "Které nerosty poznáš v žule a podle čeho?", correctAnswer: "Šedý křemen, bílý nebo růžový živec a lesklé šupinky slídy", options: ["Všechny tři nerosty v žule jsou totéž, liší se jen odstínem", "Šedý křemen, bílý nebo růžový živec a lesklé šupinky slídy", "Křemen je v žule jediný důležitý, zbytek jsou bezvýznamné příměsi", "Slída dává žule její typickou sytě červenou barvu"], hints: ["Podívej se na žulový obrubník zblízka — uvidíš zrnka různých barev a lesku."] },
  { question: "Proč je vápenec pro stavebnictví tak důležitý?", correctAnswer: "Pálením vápence vzniká vápno — základ malty i cementu", options: ["Vápenec je nejpevnější hornina, staví se z něj nosné zdi", "Vápenec se ve vodě rozpouští a sám o sobě funguje jako lepidlo", "Pálením vápence vzniká vápno — základ malty i cementu", "Vápenec se přidává do betonu jako barvivo pro světlý odstín"], hints: ["Zedník míchá vápno, písek a vodu. Odkud se vápno bere?"] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Proč se říká, že horniny na Zemi neustále kolují?", correctAnswer: "Vyvřelé se rozpadají na usazené, ty se tlakem mění na přeměněné a ty se taví zpět na magma", options: ["Koloběh hornin popisuje pouze sopečnou činnost a nic dalšího", "Horniny jsou trvalé a nemění se, koloběh je jen nepodložená teorie", "Koloběh hornin je rychlý proces, celý proběhne za méně než sto let", "Vyvřelé se rozpadají na usazené, ty se tlakem mění na přeměněné a ty se taví zpět na magma"], hints: ["Sleduj jeden kámen: co s ním udělá déšť, co hloubka a co žár. A kde skončí?"] },
  { question: "Uhlí, ropa i zemní plyn jsou fosilní paliva. Čím se od sebe liší?", correctAnswer: "Uhlí vzniklo z rostlin na souši, ropa a plyn z drobných organismů v mořích", options: ["Uhlí vzniklo z rostlin na souši, ropa a plyn z drobných organismů v mořích", "Ropa vzniká přímo z uhlí, když se hluboko v Zemi silně zahřeje", "Zemní plyn je na rozdíl od uhlí a ropy obnovitelný a rychle vzniká znovu", "Všechna tři paliva jsou naprosto totožná, liší se jen svou barvou"], hints: ["Rozhoduje, z čeho a kde palivo vzniklo — na souši, nebo pod hladinou?"] },
  { question: "Horolezec najde na vrcholu hory schránku mořského živočicha zalitou v kameni. Jak se tam dostala?", correctAnswer: "Kámen vznikl na mořském dně a později byl vyzdvižen do výšky", options: ["Schránku tam zanesl pták a ona v kameni postupně ztvrdla", "Kámen vznikl na mořském dně a později byl vyzdvižen do výšky", "Na vrcholu hory kdysi bývalo jezero, které nakonec vyschlo", "Schránka se v kameni vytvořila sama z vápna obsaženého v dešti"], hints: ["Vápenec se ukládá na dně. Co s celými vrstvami dokáže za miliony let udělat vrásnění?"] },
  { question: "Proč se zlato dá najít ve štěrku na dně řeky, i když v řece nevzniká?", correctAnswer: "Řeka ho vymlela z hornin výš v povodí a těžká zrnka uložila na dno", options: ["Zlato se z vody samo vysráží, jakmile se řeka dostatečně ochladí", "Zlato do řeky splavuje déšť, který ho přináší z vysokých mraků", "Řeka ho vymlela z hornin výš v povodí a těžká zrnka uložila na dno", "Ve vodě zlato vzniká z obyčejného písku působením silného proudu"], hints: ["Zlato je velmi těžké. Kde ho proud upustí dřív než lehký písek?"] },
  { question: "Čím se přeměněné horniny liší od těch, ze kterých vznikly?", correctAnswer: "Tlak a teplota bez roztavení přebudují jejich stavbu — z vápence vznikne mramor, ze žuly rula", options: ["Jsou jen jinak zbarvené žárem, jejich složení zůstává úplně stejné", "Vznikají úplným roztavením a novým ztuhnutím, stejně jako vyvřelé", "Vznikají jen na povrchu pomalým zvětráváním, nikdy ne v hloubce", "Tlak a teplota bez roztavení přebudují jejich stavbu — z vápence vznikne mramor, ze žuly rula"], hints: ["Metamorfóza znamená proměna. Mramor je pořád vápenec — co se tedy změnilo?"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const HORNINYANEROSTYDRUHYVLASTNOSTIVZNIK: TopicMetadata[] = [
  {
    id: "g5-prirodoveda-rozmanitost-prirody-neziva-priroda-rozsireni-horniny-a-nerosty-druhy-vlastnosti-vznik",
    rvpNodeId: "g5-prirodoveda-rozmanitost-prirody-neziva-priroda-rozsireni-horniny-a-nerosty-druhy-vlastnosti-vznik",
    title: "Horniny a nerosty - druhy, vlastnosti, vznik",
    studentTitle: "Horniny a kameny",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Neživá příroda - rozšíření",
    briefDescription: "Poznáš různé druhy hornin a nerostů a jak vznikají.",
    keywords: ["horniny", "nerosty", "minerály", "žula", "vápenec", "diamant", "uhlí", "Mohsova stupnice"],
    goals: ["Rozlišit tři typy hornin (vyvřelé, usazené, přeměněné)", "Popsat Mohsovu stupnici tvrdosti", "Uvést příklady užitných nerostů"],
    boundaries: ["Neprobírá chemické složení nerostů do hloubky", "Neprobírá krystalografii"],
    gradeRange: [5, 5],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Horniny: vyvřelé (žula, čedič), usazené (vápenec, písek, uhlí), přeměněné (rula, mramor).",
      steps: [
        "1. Vyvřelé: magma → ochlazení → žula, čedič",
        "2. Usazené: vrstvení, stmelení → vápenec, uhlí",
        "3. Přeměněné: tlak + teplo → rula, mramor",
        "4. Mohsova stupnice: 1 (mastek) → 10 (diamant)",
      ],
      commonMistake: "Hornina NENÍ totéž jako nerost. Hornina = více nerostů dohromady.",
      example: "Žula = hornina z křemene + živce + slídy. Diamant = nerost (čistý uhlík).",
    },
  },
];
