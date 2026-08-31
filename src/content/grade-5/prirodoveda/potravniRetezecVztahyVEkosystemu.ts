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
  { question: "Kdo je producent v potravním řetězci?", correctAnswer: "Rostlina – vyrábí organické látky fotosyntézou", options: ["Rostlina – vyrábí organické látky fotosyntézou", "Živočich živící se rostlinami", "Houba rozkládající mrtvé organismy", "Člověk stojící na vrcholu potravinového řetězce"], hints: ["Producent = ten, kdo vyrábí potravu."] },
  { question: "Kdo je primární konzument?", correctAnswer: "Bylinožravec – živočich, který přímo jí rostliny – zajíc jí trávu", options: ["Bylinožravec – živočich, který přímo jí rostliny – zajíc jí trávu", "Masožravec lovící jiné živočichy", "Rostlina produkující potravu", "Houba rozkládající mrtvé organismy"], hints: ["Primární = první. Jí producenty."] },
  { question: "Co jsou rozkladači v ekosystému?", correctAnswer: "Houby a bakterie rozkládající mrtvé organismy a vracející živiny do půdy", options: ["Houby a bakterie rozkládající mrtvé organismy a vracející živiny do půdy", "Živočichové živící se zbytky potravy jiných zvířat", "Rostliny přijímající živiny z půdy", "Všežravci konzumující jak rostliny, tak živočichy"], hints: ["Rozkladači = 'úklidová četa' přírody."] },
  { question: "Doplň správné pořadí: tráva → ? → liška", correctAnswer: "Zajíc", options: ["Zajíc", "Orel", "Vlk", "Žížala"], hints: ["Liška loví malé savce."] },
  { question: "Co je potravní síť?", correctAnswer: "Propojení mnoha potravních řetězců v ekosystému", options: ["Propojení mnoha potravních řetězců v ekosystému", "Jeden lineární potravní řetězec od rostliny po dravce", "Vztah rostlin a slunečního záření v ekosystému", "Síť cest, po kterých se zvířata pohybují za potravou"], hints: ["V přírodě se téměř každý živočich v různých řetězcích překrývá."] },
  { question: "Co je terciární konzument?", correctAnswer: "Vrcholový predátor – živí se sekundárními konzumenty – orel, vlk", options: ["Vrcholový predátor – živí se sekundárními konzumenty – orel, vlk", "Bylinožravec", "Rozkladač", "Producent na vrcholu potravního řetězce"], hints: ["Terciární = třetí v pořadí."] },
  { question: "Proč klesá množství energie v každém článku potravního řetězce?", correctAnswer: "Každý organismus spotřebuje většinu energie sám pro sebe – dalšímu článku předá dalšímu jen zlomek", options: ["Každý organismus spotřebuje většinu energie sám pro sebe – dalšímu článku předá dalšímu jen zlomek", "Sluneční energie se v každém článku zesiluje", "Energie se v potravním řetězci nemění – přechází plně", "Rozkladači odebírají část energie z každého článku"], hints: ["Proto jsou velcí dravci vzácní – potřebují velké území."] },
  { question: "Co je symbioza v ekosystému?", correctAnswer: "Vzájemně prospěšný vztah dvou různých druhů – lišejník = řasa + houba", options: ["Vzájemně prospěšný vztah dvou různých druhů – lišejník = řasa + houba", "Vztah predátora a kořisti", "Rozkladu mrtvých organismů houbami", "Vztah, kdy jeden druh parazituje na jiném"], hints: ["Symbioza = oba profitují."] },
  { question: "Co je parazitismus?", correctAnswer: "Vztah, kdy jeden organismus (parazit) těží z druhého – hostitele na jeho úkor", options: ["Vztah, kdy jeden organismus (parazit) těží z druhého – hostitele na jeho úkor", "Vztah vzájemně prospěšný pro oba organismy", "Vztah, kdy predátor uloví kořist", "Rovnocenný soutěžní vztah dvou druhů"], hints: ["Klíště na jelenu je parazit."] },
  { question: "Jakou roli hrají žížaly v ekosystému půdy?", correctAnswer: "Kypří půdu, rozkládají organické látky a vylepšují její strukturu", options: ["Kypří půdu, rozkládají organické látky a vylepšují její strukturu", "Jsou vrcholovými predátory v půdním ekosystému", "Produkují kyslík pro půdní organismy", "Přeměňují kameny na živiny pro rostliny"], hints: ["Darwin prohlásil žížaly za nejdůležitější organismy na Zemi."] },
  { question: "Co se stane, když vyhyne klíčový predátor v ekosystému?", correctAnswer: "Populace jeho kořisti přeroste únosnou mez a přeroste zdroje potravy – ekosystém se destabilizuje", options: ["Populace jeho kořisti přeroste únosnou mez a přeroste zdroje potravy – ekosystém se destabilizuje", "Ekosystém zůstane beze změn – příroda se přizpůsobí", "Jiný predátor okamžitě zaujme jeho místo", "Kořist přestane konzumovat rostliny a přirozeně vymizí"], hints: ["Wolf effect v Yellowstone: vlci regulují jeleny, kteří regulují vegetaci."] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Proč je fotosyntéza základem všech potravních řetězců?", correctAnswer: "Fotosyntéza přeměňuje sluneční energii na chemickou – cukry – to je primární zdroj energie pro všechny organismy v ekosystému", options: ["Fotosyntéza přeměňuje sluneční energii na chemickou – cukry – to je primární zdroj energie pro všechny organismy v ekosystému", "Fotosyntéza produkuje kyslík, který živí ostatní organismy", "Fotosyntéza je důležitá jen pro bylinožravce", "Fotosyntéza netvoří základ potravních řetězců – tím jsou rozkladači"], hints: ["Bez rostlin (producentů) neexistují žádní konzumenti."] },
  { question: "Jak se liší predátor od parazita?", correctAnswer: "Predátor uloví a zabije kořist rychle. Parazit žije na hostiteli dlouhodobě, aniž ho ihned zabije – živí se z něho postupně.", options: ["Predátor uloví a zabije kořist rychle. Parazit žije na hostiteli dlouhodobě, aniž ho ihned zabije – živí se z něho postupně.", "Predátor a parazit jsou totéž – obě interakce jsou smrtelné pro kořist", "Parazit je větší než predátor", "Predátor je prospěšný, parazit škodí – jinak jsou stejní"], hints: ["Klíště × vlk: klíště je parazit, vlk je predátor."] },
  { question: "Co je ekologická nika?", correctAnswer: "Role druhu v ekosystému – co jí, kde žije a s kým soutěží", options: ["Geografické území, na kterém druh žije", "Role druhu v ekosystému – co jí, kde žije a s kým soutěží", "Počet jedinců daného druhu v ekosystému", "Vztah druhu s jeho největším predátorem"], hints: ["Představ si to jako povolání – co druh v přírodě dělá."] },
  { question: "Proč jsou vrcholoví predátoři klíčoví pro zdraví ekosystému?", correctAnswer: "Regulují populace kořisti, zabraňují přemnožení bylinožravců, čímž chrání vegetaci a biodiverzitu celého ekosystému", options: ["Regulují populace kořisti, zabraňují přemnožení bylinožravců, čímž chrání vegetaci a biodiverzitu celého ekosystému", "Jsou nejsilnější, proto kontrolují ostatní živočichy silou", "Důležití jsou hlavně tím, že jsou potravou pro rozkladače po své smrti", "Predátoři nejsou klíčoví – ekosystém funguje bez nich stejně dobře"], hints: ["Yellowstone: reintrodukce vlků obnovila vegetaci podél řek."] },
  { question: "Jak se liší komensalismus od mutualismu?", correctAnswer: "Mutualismus: oba druhy profitují. Komensalismus: jeden profituje, druhý není ovlivněn – ani nezíská, ani neztrácí .", options: ["Mutualismus: oba druhy profitují. Komensalismus: jeden profituje, druhý není ovlivněn – ani nezíská, ani neztrácí .", "Jsou totéž – obě slova popisují symbiozní vztah", "Komensalismus: oba profitují. Mutualismus: jeden profituje, druhý ne.", "Mutualismus je škodlivý pro oba – jedná se o soutěžní vztah."], hints: ["Remora ryba na žralokovi = komensalismus."] },
  { question: "Proč je v ekosystému více bylinožravců než masožravců?", correctAnswer: "Do dalšího článku řetězce přejde jen asi desetina energie", options: ["Masožravci jsou větší, proto jich v ekosystému může být méně", "Do dalšího článku řetězce přejde jen asi desetina energie", "Bylinožravci se množí rychleji, proto jich je vždycky více", "Masožravci jsou vzácnější a hůř se loví, proto jich je málo"], hints: ["Zamysli se, kolik energie se cestou potravním řetězcem ztratí."] },
  { question: "Co jsou invazivní druhy a proč jsou problémem?", correctAnswer: "Organismy zavlečené jinam, kde nemají nepřátele a přemnoží se", options: ["Nové druhy, které vznikly přirozenou evolucí na místě", "Organismy zavlečené jinam, kde nemají nepřátele a přemnoží se", "Vítané druhy, protože zvyšují pestrost přírody", "Druhy, které působí potíže výhradně v tropech"], hints: ["Klokáni v Evropě nebo nutrie v ČR jsou příklady invazivních druhů."] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Proč bioakumulace toxinů ohrožuje vrcholové predátory?", correctAnswer: "Jedy se ukládají v tuku a v každém článku řetězce se hromadí", options: ["Jedy se v každém článku řetězce spotřebují a dál nepřecházejí.", "Jedy se ukládají v tuku a v každém článku řetězce se hromadí", "Vrcholoví predátoři jsou vůči jedům odolnější než malí živočichové.", "Hromadění jedů ohrožuje jen mořské, nikoli suchozemské živočichy."], hints: ["Dravci na konci řetězce snědí všechno, co nasbírala jejich kořist."] },
  { question: "Jak koloběh uhlíku propojuje fotosyntetizující rostliny, živočichy a rozkladače?", correctAnswer: "Rostliny uhlík poutají, živočichové vydechují, rozkladači vracejí", options: ["Uhlík jde jen od rostlin k živočichům, rozkladači ho ničí.", "Rostliny uhlík poutají, živočichové vydechují, rozkladači vracejí", "Koloběh uhlíku probíhá jen v mořích, na souši funguje jinak.", "Uhlík vzniká jen dýcháním živočichů, rostliny ho nepohlcují."], hints: ["Sleduj, kudy uhlík putuje a jestli se cestou někde ztrácí."] },
  { question: "Proč monokulturní zemědělství snižuje biodiverzitu ekosystému?", correctAnswer: "Jedna plodina na velké ploše zničí pestrost stanovišť i potravy", options: ["Monokultura pestrost neovlivní, živočichové si potravu najdou jinde.", "Jedna plodina na velké ploše zničí pestrost stanovišť i potravy", "Monokultura pestrost zvyšuje, protože nabídne hodně jednoho druhu.", "Pestrost ohrožuje jen průmyslová zástavba, zemědělství ne."], hints: ["Irský bramborový hladomor (1845): monokultura brambor a epidemie plísně."] },
  { question: "Jak trofické kaskády ukazují vzájemnou provázanost ekosystému?", correctAnswer: "Změna populace jednoho druhu – predátora kaskádově ovlivní všechny nižší úrovně: predátor → kořist → vegetace → půda a mikroorganismy. Systém je propojen.", options: ["Změna populace jednoho druhu – predátora kaskádově ovlivní všechny nižší úrovně: predátor → kořist → vegetace → půda a mikroorganismy. Systém je propojen.", "Trofické kaskády existují jen v mořských ekosystémech.", "Vliv predátora se omezuje jen na jeho přímou kořist – vegetace není ovlivněna.", "Ekosystémy jsou odolné: ztráta jednoho druhu nevede ke kaskádovým efektům."], hints: ["Yellowstone: vlk → jelen → vrby → bobr → řeky."] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const POTRAVNIRETEZECVZTAHYVEKOSYSTEMU: TopicMetadata[] = [
  {
    id: "g5-prirodoveda-rozmanitost-prirody-ekosystemy-a-zivotni-prostredi-potravni-retezec-vztahy-v-ekosystemu",
    rvpNodeId: "g5-prirodoveda-rozmanitost-prirody-ekosystemy-a-zivotni-prostredi-potravni-retezec-vztahy-v-ekosystemu",
    title: "Potravní řetězec, vztahy v ekosystému",
    studentTitle: "Potravní řetězec",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Ekosystémy a životní prostředí",
    briefDescription: "Poznáš, jak jsou organismy v přírodě propojeny potravními řetězci.",
    keywords: ["potravní řetězec", "producent", "konzument", "rozkladač", "ekosystém", "predátor", "kořist", "symbioza"],
    goals: ["Sestavit jednoduchý potravní řetězec", "Rozlišit producenty, konzumenty a rozkladače", "Popsat základní ekologické vztahy (predace, symbioza, parazitismus)"],
    boundaries: ["Neprobírá matematické modely populační ekologie", "Neprobírá evoluci interakcí"],
    gradeRange: [5, 5],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Potravní řetězec: Producent → Primární konzument → Sekundární → Terciární konzument → Rozkladači.",
      steps: [
        "1. Producent: rostlina (fotosyntéza).",
        "2. Primární konzument: bylinožravec (zajíc).",
        "3. Sekundární konzument: malý masožravec (liška).",
        "4. Terciární konzument: vrcholový predátor (orel).",
        "5. Rozkladači: houby a bakterie vracejí živiny do půdy.",
      ],
      commonMistake: "Šipka v potravním řetězci ukazuje směr toku energie (→ = je sněden).",
      example: "Tráva → Zajíc → Liška → Orel. Mrtvé organismy → houby (rozkladači).",
    },
  },
];
