import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "@/content/grade-3/_shared";

// ─────────────────────────────────────────────────────────
// Disjunktní pooly obtížnosti (L1 < L2 < L3), select_one.
//   L1 = rozpoznání: základní pojmy (časová přímka, generace, minulost/
//        přítomnost/budoucnost, rodokmen, kronika, kronikář, archiv)
//   L2 = aplikace: pojem na konkrétní scénář (změna telefonu/školy/dopravy,
//        zařazení tety/bratrance do generace, zařazení situace do
//        minulosti/přítomnosti/budoucnosti)
//   L3 = transfer: početní úlohy s roky (dva kroky přes celou desítku),
//        porovnání čtyř časových vzdáleností, úvahy o významu pramenů
//        napříč generacemi
// Boundary: jen 3 generace v rodině (prarodiče, rodiče, děti).
// Každá úloha: dvě vlastní nápovědy, zpětná vazba u každé chybné možnosti
// a vysvětlení PROČ (CONTENT_AUTHORING §0).
// ─────────────────────────────────────────────────────────

type Chyba = [string, string];

function t(
  question: string,
  correct: string,
  chyby: [Chyba, Chyba, Chyba],
  h0: string,
  h1: string,
  explanation: string,
): PracticeTask {
  const d = chyby.map(([value, why]) => ({ value, why })) as [Distractor, Distractor, Distractor];
  return choice(question, correct, d, { hints: [h0, h1], explanation });
}

const MINULOST = "Čas, který už proběhl — co se stalo dříve";
const PRITOMNOST = "Čas, který právě prožíváme — co se děje teď";
const BUDOUCNOST = "Čas, který teprve přijde — co se stane";

const POOL_L1: PracticeTask[] = [
  t(
    "Co je to časová přímka?",
    "Čára, která zobrazuje události v pořadí, jak šly za sebou v čase",
    [
      ["Mapa, na které jsou vyznačena důležitá místa", "Mapa ukazuje, KDE co leží. Časová přímka ukazuje, KDY se co stalo."],
      ["Tabulka se jmény členů rodiny", "Členy rodiny a jejich vztahy ukazuje rodokmen, ne časová přímka."],
      ["Obrázek, který ukazuje, jak vypadala škola dříve", "Obrázek zachytí jediný okamžik. Časová přímka řadí za sebe mnoho událostí."],
    ],
    "Časová přímka vypadá jako čára s body — každý bod je jedna událost.",
    "Na přímce nejde o to, kde se událost stala, ale kdy. Hledej možnost, ve které jsou události seřazené od nejstarší po nejnovější.",
    "Časová přímka je čára, na které vyznačíme události v tom pořadí, jak se staly. Díky ní hned vidíme, co bylo dříve a co později. Mapa naproti tomu ukazuje místa, rodokmen příbuzné.",
  ),
  t(
    "Která generace jsou prarodiče (babička a děda)?",
    "První generace",
    [
      ["Druhá generace", "Druhá generace jsou rodiče — děti prarodičů. Prarodiče jsou o generaci starší."],
      ["Třetí generace", "Třetí generace jsou děti, tedy nejmladší. Prarodiče jsou naopak nejstarší."],
      ["Čtvrtá generace", "V rodině počítáme tři generace — čtvrtá tu vůbec není."],
    ],
    "Generace počítáme od nejstarších k nejmladším.",
    "Seřaď babičku, maminku a sebe podle věku od nejstaršího. Na kolikátém místě stojí babička s dědou?",
    "Prarodiče jsou v rodině nejstarší, proto je počítáme jako první generaci. Po nich přicházejí rodiče (druhá) a děti (třetí).",
  ),
  t(
    "Která generace jsou rodiče (máma a táta)?",
    "Druhá generace",
    [
      ["První generace", "První generace jsou prarodiče — rodiče tvých rodičů. Rodiče jsou o generaci mladší."],
      ["Třetí generace", "Třetí generace jsou děti. Rodiče jsou o generaci starší než ty."],
      ["Čtvrtá generace", "Čtvrtá generace v naší rodině není, počítáme jen tři."],
    ],
    "Rodiče jsou mladší než prarodiče, ale starší než ty.",
    "Když prarodiče počítáme jako první generaci, přijdou po nich rodiče a teprve pak děti. Kolikátí jsou tedy v pořadí rodiče?",
    "Rodiče stojí mezi prarodiči a dětmi. Prarodiče jsou první generace, děti třetí, a rodiče proto druhá.",
  ),
  t(
    "Do které generace patříš ty (dítě)?",
    "Třetí generace",
    [
      ["První generace", "První generace jsou prarodiče, nejstarší v rodině. Ty jsi nejmladší."],
      ["Druhá generace", "Druhá generace jsou tvoji rodiče. Ty jsi jejich dítě, tedy o generaci dál."],
      ["Čtvrtá generace", "Čtvrtou generací by byly až tvoje děti — a počítáme jen tři."],
    ],
    "Ty jsi v rodině nejmladší.",
    "Vyjmenuj generace od nejstarší: prarodiče, rodiče a nakonec děti. Kolikátá je v tomto pořadí ta poslední?",
    "V rodině jsou tři generace: prarodiče (první), rodiče (druhá) a děti (třetí). Ty jsi dítě, proto patříš do třetí generace.",
  ),
  t(
    "Co znamená slovo „minulost“?",
    MINULOST,
    [
      [PRITOMNOST, "To je přítomnost — co se děje právě teď."],
      [BUDOUCNOST, "To je budoucnost — ta ještě nenastala."],
      ["Slovo pro počítání generací", "Generace počítáme čísly: první, druhá, třetí. Minulost je část času."],
    ],
    "Minulost je za námi.",
    "Vzpomeň si na včerejšek nebo na dětství prarodičů. Kam tyto události patří — k tomu, co je, co bude, nebo co bylo?",
    "Minulost je všechno, co už proběhlo: včerejšek, tvoje narození i dětství prarodičů. Na časové přímce ji najdeš vlevo.",
  ),
  t(
    "Co znamená slovo „přítomnost“?",
    PRITOMNOST,
    [
      [MINULOST, "To je minulost — co už se stalo."],
      [BUDOUCNOST, "To je budoucnost — co teprve přijde."],
      ["Část časové přímky pro nejstarší události", "Nejstarší události jsou na přímce vlevo a patří do minulosti."],
    ],
    "Přítomnost je právě tahle chvíle.",
    "Co děláš v tuto chvíli — třeba čteš tuhle otázku? Hledej možnost, která mluví o tomhle okamžiku, ne o včerejšku ani o zítřku.",
    "Přítomnost je okamžik, který právě prožíváme. Co se stalo před chvílí, už je minulost, a co teprve přijde, je budoucnost.",
  ),
  t(
    "Co znamená slovo „budoucnost“?",
    BUDOUCNOST,
    [
      [PRITOMNOST, "To je přítomnost — děje se to právě teď."],
      [MINULOST, "To je minulost — ta už proběhla."],
      ["Nejstarší část rodokmenu", "Nejstarší část rodokmenu jsou prarodiče — to patří k minulosti rodiny."],
    ],
    "Budoucnost je před námi.",
    "Myslíš na zítřek nebo na příští prázdniny? Ty ještě nenastaly. Hledej možnost, která mluví o tom, co na nás teprve čeká.",
    "Budoucnost je čas, který ještě nenastal: zítřek, příští prázdniny nebo to, jak bude svět vypadat za padesát let. Na časové přímce ji najdeš vpravo.",
  ),
  t(
    "Co je to rodokmen?",
    "Strom zobrazující členy rodiny a jejich příbuzenské vztahy",
    [
      ["Čára zobrazující historické události v čase", "To je časová přímka. Rodokmen ukazuje příbuzné, ne události."],
      ["Kniha, do které se zapisují události ve škole", "To je kronika. Rodokmen nezapisuje události, ale ukazuje, kdo je s kým příbuzný."],
      ["Mapa starého města", "Mapa ukazuje místa. V rodokmenu jsou lidé z jedné rodiny."],
    ],
    "Rodokmen se často kreslí jako rozvětvený obrázek.",
    "Slovo „rod“ znamená rodina. Na větvích jsou jména babiček, dědů, rodičů a dětí. Co tedy rodokmen ukazuje?",
    "Rodokmen je schéma ve tvaru stromu, na kterém vidíme členy rodiny a jak jsou navzájem příbuzní — prarodiče, rodiče, děti. Kronika zapisuje události, časová přímka je řadí v čase.",
  ),
  t(
    "Co je to kronika?",
    "Kniha, kam se zapisují události tak, jak se staly",
    [
      ["Strom příbuzenských vztahů v rodině", "To je rodokmen. Kronika o příbuzných nepíše, zapisuje události."],
      ["Mapa zobrazující historická místa", "Mapa ukazuje místa, ne co se na nich v průběhu času dělo."],
      ["Časová přímka nakreslená na tabuli", "Časová přímka události jen vyznačí body. Kronika je podrobně popisuje slovy."],
    ],
    "Kroniku vedla třeba každá vesnice nebo škola.",
    "Kronika je jako deník — jenže nepíše o jednom člověku, ale o celé obci nebo škole. Co se do ní tedy dělá?",
    "Kronika je kniha, do které kronikář zapisuje důležité události v pořadí, jak šly za sebou. Díky ní víme, co se v obci nebo škole dělo, a proto je cenným pramenem.",
  ),
  t(
    "Kdo je kronikář?",
    "Člověk, který zapisuje důležité události do kroniky",
    [
      ["Člověk, který uchovává staré dokumenty v archivu", "To je archivář. Kronikář do kroniky píše nové zápisy."],
      ["Nejstarší člen rodiny", "Nejstarší člen rodiny může být pamětník, ale kronikář je ten, kdo kroniku vede."],
      ["Člověk, který kreslí rodokmen", "Rodokmen může nakreslit kdokoli z rodiny. Kronikář zapisuje události obce nebo školy."],
    ],
    "Slovo kronikář je příbuzné s názvem jedné knihy.",
    "Podobně jako zahradník pečuje o zahradu, pečuje kronikář o kroniku. Co s ní asi pravidelně dělá?",
    "Kronikář vede kroniku — pravidelně do ní zapisuje důležité události, aby se na ně nezapomnělo. Archivář pečuje o staré dokumenty v archivu.",
  ),
  t(
    "Co je to archiv?",
    "Místo, kde se uchovávají staré dokumenty, fotografie a záznamy",
    [
      ["Místo, kde se vystavují moderní obrazy", "Moderní obrazy vystavuje galerie. Archiv uchovává staré záznamy."],
      ["Budova, kde bydlí prarodiče", "Prarodiče bydlí doma. Archiv je instituce pro staré papíry."],
      ["Jiný název pro rodokmen", "Rodokmen je schéma příbuzných. Archiv je místo, kde se ukládají dokumenty — třeba i staré rodokmeny."],
    ],
    "V archivu najdeš staré listiny, matriky nebo fotky.",
    "Archiv je jako velká knihovna, ale místo knih k půjčení v něm leží cenné papíry z minulosti. K čemu takové místo slouží?",
    "Archiv je místo, kde se uchovávají staré dokumenty, listiny, fotografie a záznamy. Chodí tam badatelé, když chtějí zjistit, co se v minulosti opravdu stalo.",
  ),
  t(
    "Kolik generací obvykle rozlišujeme v jedné rodině (prarodiče, rodiče, děti)?",
    "Tři generace",
    [
      ["Dvě generace", "Dvě by byly jen rodiče a děti — zapomněl jsi na prarodiče."],
      ["Čtyři generace", "Čtyři by byly, kdybychom počítali i prarodiče prarodičů. V otázce jsou jen tři skupiny."],
      ["Pět generací", "Tolik skupin v otázce vůbec není — spočítej prarodiče, rodiče a děti."],
    ],
    "Vyjmenuj skupiny, které jsou v závorce.",
    "Spočítej skupiny, ne jednotlivé lidi: babička a děda jsou jedna skupina, máma a táta další… Kolik skupin ti vyjde?",
    "V rodině obvykle rozlišujeme tři generace: prarodiče, rodiče a děti. Počítáme skupiny podobného věku, ne jednotlivé lidi.",
  ),
  t(
    "Kterým směrem na časové přímce jdeme od minulosti k budoucnosti?",
    "Zleva doprava",
    [
      ["Zprava doleva", "Obráceně — vlevo je nejstarší minulost, takže k budoucnosti postupuješ na druhou stranu."],
      ["Shora dolů", "Časová přímka se kreslí vodorovně, ne svisle."],
      ["Zdola nahoru", "Časová přímka neleží svisle, takže se po ní nahoru nepostupuje."],
    ],
    "Nejstarší události kreslíme na časovou přímku vlevo.",
    "Časovou přímku čteš podobně jako řádek v knize. Odkud kam se čte řádek textu?",
    "Na časové přímce je vlevo minulost, uprostřed přítomnost a vpravo budoucnost. Od minulosti k budoucnosti tedy jdeme stejně jako při čtení řádku.",
  ),
  t(
    "Co znamená slovo „generace“?",
    "Skupina lidí podobného věku v rodině, například prarodiče, rodiče nebo děti",
    [
      ["Kniha, do které se zapisují události", "To je kronika. Generace je skupina lidí."],
      ["Místo, kde se uchovávají staré fotografie", "To je archiv. Generace není místo, ale skupina lidí."],
      ["Jiné slovo pro rodokmen", "Rodokmen ukazuje všechny generace najednou, ale sám generací není."],
    ],
    "Generace dělí lidi v rodině do skupin podle věku.",
    "Babička s dědou tvoří jednu skupinu, máma s tátou druhou a ty se sourozenci třetí. Co mají lidé v jedné takové skupině společného?",
    "Generace je skupina lidí přibližně stejného věku. V rodině tak rozlišujeme prarodiče, rodiče a děti. Rodokmen všechny generace ukazuje najednou.",
  ),
];

const POOL_L2: PracticeTask[] = [
  t(
    "Jak se změnily telefony od doby prarodičů do dneška?",
    "Dřív byly velké a připojené kabelem ke zdi, dnes jsou malé a přenosné",
    [
      ["Dřív byly malé a přenosné, dnes jsou velké a těžké", "Je to obráceně — malé přenosné telefony jsou vymoženost dneška."],
      ["Telefony se vůbec nezměnily", "Změnily se hodně: dřív pevná linka doma, dnes mobil v kapse."],
      ["Dřív neexistovaly, vymysleli je teprve nedávno", "Telefon existoval už v době prarodičů, jen vypadal jinak."],
    ],
    "Vzpomeň si na telefon, který visí na zdi na starých fotkách.",
    "Dnešní mobil se vejde do kapsy a nosíš ho všude. Jak asi vypadal telefon, když ho nešlo odnést z bytu?",
    "V době prarodičů byl telefon velký a připojený kabelem — říkalo se mu pevná linka. Dnes nosíme malé mobilní telefony všude s sebou.",
  ),
  t(
    "Jak se změnila škola od doby prarodičů do dneška?",
    "Dřív se psalo perem a inkoustem, dnes se používají i počítače a tablety",
    [
      ["Dřív byly školy modernější a měly víc počítačů než dnes", "Moderní technika přibyla až v posledních letech, dřív jí bylo méně."],
      ["Ve škole se od té doby vůbec nic nezměnilo", "Změnily se pomůcky: dřív kalamář a pero, dnes i tablety."],
      ["Dřív se do školy vůbec nechodilo, děti byly doma", "Prarodiče do školy chodili — jen se tam učili s jinými pomůckami."],
    ],
    "Pomysli, jaké pomůcky mají dnes děti ve škole.",
    "Babička měla na lavici kalamář s inkoustem a psala perem. Co přibylo ve škole od té doby?",
    "Za prarodičů se psalo perem namáčeným v inkoustu a počítače ve škole nebyly. Dnes mají děti i počítače a tablety, ale číst a psát se učí pořád.",
  ),
  t(
    "Jak se změnila doprava za posledních sto let?",
    "Dřív koňské povozy a parní vlaky, dnes auta, rychlovlaky a letadla",
    [
      ["Dříve se létalo letadlem mnohem víc než dnes", "Letadla jsou naopak vymoženost novější doby, dnes se létá mnohem víc."],
      ["Doprava se za sto let vůbec nijak nezměnila", "Za sto let se doprava hodně změnila — koně vystřídala auta."],
      ["Dřív jezdilo po silnicích víc aut než dnes", "Aut je dnes naopak mnohem víc než před sto lety."],
    ],
    "Jak se lidé přepravovali, když ještě nebyly benzínové motory?",
    "Na začátku byli koně a parní stroje, později přibyly motory. Hledej možnost, kde je u slova „dřív“ opravdu starší doprava a u „dnes“ ta novější.",
    "Před sto lety se jezdilo na koních, v povozech a parními vlaky. Auta, rychlovlaky a letadla se rozšířila až později, proto se doprava výrazně změnila.",
  ),
  t(
    "Do které generace patří teta (sestra maminky nebo tatínka)?",
    "Do druhé generace, protože je to sourozenec rodičů",
    [
      ["Do první generace, protože je stejně stará jako babička", "Teta není babiččina vrstevnice — je to babiččina dcera, sestra tvé mámy nebo táty."],
      ["Do třetí generace, protože je mladší než rodiče", "I mladší sourozenec rodičů patří do jejich generace. Třetí generace jsou děti."],
      ["Generace tety se nepočítá", "Teta do rodiny patří a má svou generaci jako každý."],
    ],
    "Teta je sestra maminky nebo tatínka.",
    "Sourozenci patří vždy do stejné generace. Do které generace patří maminka a tatínek — a tedy i jejich sestra?",
    "Teta je sestra jednoho z rodičů. Sourozenci patří do stejné generace, proto je teta ve druhé generaci spolu s rodiči.",
  ),
  t(
    "Do které generace patří bratranec (syn strýce nebo tety)?",
    "Do třetí generace, protože je to dítě stejně jako ty",
    [
      ["Do druhé generace, protože je synem sourozence rodičů", "Druhá generace je teta nebo strýc. Jejich syn je o generaci mladší."],
      ["Do první generace, protože je nejstarší v rodině", "První generace jsou prarodiče. Bratranec je dítě jako ty."],
      ["Bratranec nepatří do žádné generace", "Každý člen rodiny patří do nějaké generace, i bratranec."],
    ],
    "Bratranec je syn tvé tety nebo strýce.",
    "Teta a strýc jsou ve stejné generaci jako tvoji rodiče. Jejich děti jsou tedy ve stejné generaci jako děti tvých rodičů — tedy jako kdo?",
    "Bratranec je dítě tety nebo strýce, kteří patří do druhé generace. Jejich děti jsou o generaci mladší, tedy ve třetí generaci — stejně jako ty.",
  ),
  t(
    "Jaké je správné pořadí generací od nejstarší po nejmladší?",
    "Prarodiče, rodiče, děti",
    [
      ["Děti, rodiče, prarodiče", "To je pořadí od nejmladší generace, otázka chce od nejstarší."],
      ["Rodiče, prarodiče, děti", "Prarodiče jsou starší než rodiče, proto musí být první."],
      ["Děti, prarodiče, rodiče", "Tady jsou nejmladší děti na začátku a prarodiče uprostřed — pořadí nesedí."],
    ],
    "Kdo se v rodině narodil nejdřív?",
    "Babička musela být na světě dřív než maminka a maminka dřív než ty. Seřaď stejně i celé generace.",
    "Nejdřív se narodili prarodiče, pak jejich děti — rodiče — a nakonec vnoučata. Pořadí od nejstarší generace je tedy prarodiče, rodiče, děti.",
  ),
  t(
    "Babička ti ukazuje fotografii ze svých deseti let. Do jaké části času patří to, co je na fotce?",
    "Do minulosti",
    [
      ["Do přítomnosti", "Přítomnost je to, co se děje teď. Fotka zachytila chvíli, která je dávno pryč."],
      ["Do budoucnosti", "Budoucnost teprve přijde. Babiččino dětství už proběhlo."],
      ["Do žádné z těchto částí", "Každá událost patří do nějaké části času — i babiččino dětství."],
    ],
    "Babičce už dávno není deset let.",
    "Rozhoduj podle toho, kdy se to na fotce odehrálo, ne kdy se na fotku díváš. Stalo se to už, děje se to teď, nebo to teprve bude?",
    "Na fotce je babiččino dětství, které proběhlo před mnoha lety. Proto patří do minulosti, i když se na fotku díváš dnes.",
  ),
  t(
    "Příští léto pojedeš s rodiči na dovolenou k moři. Do jaké části času tahle dovolená patří?",
    "Do budoucnosti",
    [
      ["Do minulosti", "Příští léto ještě nebylo, takže dovolená do minulosti nepatří."],
      ["Do přítomnosti", "Na dovolené teď nejsi — pojedeš na ni až za několik měsíců."],
      ["Do žádné z těchto částí", "I dovolená, která ještě nebyla, patří do jedné části času."],
    ],
    "Příští léto ještě nenastalo.",
    "Zeptej se: už se to stalo, děje se to teď, nebo se to teprve stane? Dovolená je až za několik měsíců.",
    "Dovolená se uskuteční až příští léto, tedy ještě nenastala. Co nás teprve čeká, patří do budoucnosti.",
  ),
  t(
    "Právě teď píšeš úkol do sešitu. Do jaké části času tahle činnost patří?",
    "Do přítomnosti",
    [
      ["Do minulosti", "Úkol píšeš právě teď, ještě ho nemáš hotový a za sebou."],
      ["Do budoucnosti", "Nečekáš na to — děláš to v tuto chvíli."],
      ["Do žádné z těchto částí", "Činnost, kterou právě děláš, do jedné části času patří."],
    ],
    "Slova „právě teď“ napovídají, o jaký čas jde.",
    "Porovnej to se včerejškem a zítřkem: úkol nepíšeš ani včera, ani zítra, ale v tuto chvíli. Jak se jmenuje čas, který prožíváš?",
    "Co děláš právě v tuto chvíli, patří do přítomnosti. Až úkol dopíšeš, stane se minulostí.",
  ),
  t(
    "Jak se změnilo oblékání od doby prarodičů do dneška?",
    "Dřív si lidé oblečení často šili sami, dnes se hlavně kupuje hotové",
    [
      ["Oblékání se vůbec nezměnilo", "Změnilo — dřív se šilo doma, dnes se kupuje v obchodě."],
      ["Dřív lidé nosili víc značkového oblečení", "Značkové oblečení z obchodů je spíš dnešní věc."],
      ["Dřív si lidé oblečení kupovali, dnes si ho šijí sami", "Je to obráceně — šití doma bylo běžné dřív."],
    ],
    "Podívej se na staré fotky prarodičů — jak byli oblečení?",
    "Babička možná vzpomíná na šicí stroj doma. Kde bereš oblečení ty? Hledej možnost, která to správně porovná.",
    "V době prarodičů si lidé oblečení často šili doma nebo ho nechávali ušít u krejčího. Dnes se oblečení hlavně kupuje hotové v obchodech.",
  ),
  t(
    "Jak se změnila komunikace mezi lidmi od doby prarodičů do dneška?",
    "Dřív se psaly dopisy a čekalo se dny, dnes zprávy dorazí hned",
    [
      ["Dřív lidé komunikovali rychleji než dnes", "Dopis šel několik dní, zpráva z mobilu dorazí za vteřinu — dnes je to rychlejší."],
      ["Komunikace se vůbec nezměnila", "Změnila se hodně: dopisy nahradily zprávy a hovory z mobilu."],
      ["Dopisů se dnes píše víc než dřív", "Dopisů se dnes píše méně, lidé posílají hlavně zprávy."],
    ],
    "Jak dlouho trvalo, než dopis dorazil k adresátovi?",
    "Dnes odešleš zprávu a kamarád ji přečte za pár vteřin. Porovnej to s dopisem, který nesl pošťák několik dní.",
    "Prarodiče se domlouvali hlavně dopisy, na které se čekalo i několik dní. Dnes díky mobilům a internetu posíláme zprávy okamžitě.",
  ),
  t(
    "Kdo by měl do obecní kroniky zapsat, že se ve vesnici postavila nová škola?",
    "Kronikář",
    [
      ["Archivář", "Archivář staré dokumenty uchovává, nové zápisy do kroniky nepíše."],
      ["Kterýkoli žák ze školy", "Kroniku nepíše kdokoli — obec na to má jednoho pověřeného člověka."],
      ["Nikdo, do kroniky se zapisují jen narození", "Do kroniky se zapisují všechny důležité události obce, třeba i stavba školy. Narození se zapisují do matriky."],
    ],
    "Do kroniky zapisuje ten, kdo ji vede.",
    "Není to náhodný člověk ani ten, kdo pečuje o staré papíry v archivu. Jak se jmenuje člověk, jehož název je odvozený od slova kronika?",
    "Stavba nové školy je důležitá událost obce, a proto ji zapíše kronikář — člověk, který obecní kroniku vede.",
  ),
  t(
    "Kam se obrátíš, když chceš najít staré fotografie vesnice z doby, kdy tam žili tvoji prarodiče?",
    "Do archivu",
    [
      ["Do galerie", "Galerie vystavuje umělecké obrazy. Staré fotografie vesnice uchovává jiné místo."],
      ["Na poštu", "Pošta doručuje dopisy a balíky, staré fotografie neuchovává."],
      ["Do rodokmenu", "Rodokmen je schéma příbuzných, ne místo, kam se chodí."],
    ],
    "Staré fotografie a dokumenty se uchovávají na jednom konkrétním místě.",
    "Hledej místo, které je jako velká knihovna pro staré záznamy — listiny, zápisy i fotky. Není to schéma příbuzných ani galerie obrazů.",
    "Staré fotografie a dokumenty obce se uchovávají v archivu. Tam je nejlepší místo, kde je hledat.",
  ),
  t(
    "Jak se změnily hračky od doby prarodičů do dneška?",
    "Dřív byly hračky hlavně dřevěné, dnes jsou často elektronické",
    [
      ["Hračky se vůbec nezměnily", "Změnily — dřív dřevo a látka, dnes plasty a baterie."],
      ["Dřív byly elektronické, dnes jsou dřevěné", "Obráceně — elektronika v hračkách je dnešní věc."],
      ["Dřív děti žádné hračky neměly", "Hračky měly děti vždycky, jen byly jednodušší."],
    ],
    "Z čeho byly vyrobené hračky, se kterými si hrála babička?",
    "Babička měla dřevěného koníka nebo hadrovou panenku. Dnešní hračky často svítí a hrají. Která možnost to správně porovná?",
    "V době prarodičů byly hračky často ze dřeva nebo z látky, mnohdy vyrobené doma. Dnes jsou hračky často plastové, elektronické a na baterky.",
  ),
];

const POOL_L3: PracticeTask[] = [
  t(
    "Dědeček se narodil v roce 1955. Kolik mu bylo, když se v roce 2005 narodil vnuk?",
    "50 let",
    [
      ["45 let", "Od 1955 do 2000 je 45 let, ale musíš přičíst ještě 5 let do roku 2005."],
      ["55 let", "55 let by mu bylo až v roce 2010."],
      ["60 let", "60 let by mu bylo až v roce 2015."],
    ],
    "Věk zjistíš odečtením roku narození od pozdějšího roku.",
    "Počítej po krocích: kolik let uplyne od 1955 do 2000? A kolik ještě od 2000 do 2005? Obě čísla sečti.",
    "Od roku 1955 do roku 2000 uplyne 45 let a od 2000 do 2005 dalších 5 let. Dohromady 45 + 5 = 50, dědečkovi tedy bylo 50 let.",
  ),
  t(
    "Babička se narodila v roce 1960. Kolik jí bylo v roce 2000, kdy se narodila její první vnučka?",
    "40 let",
    [
      ["30 let", "30 let jí bylo v roce 1990. Do roku 2000 uplynulo ještě dalších 10 let."],
      ["35 let", "Roky 1960 a 2000 jsou obě celé desítky, rozdíl proto vyjde na celé desítky let."],
      ["50 let", "50 let jí bylo až v roce 2010."],
    ],
    "Odečti rok narození babičky od roku, kdy se narodila vnučka.",
    "Počítej po desítkách: 1960, 1970, 1980… až do 2000. Kolik desítek let jsi napočítal?",
    "Od roku 1960 do roku 2000 jsou to čtyři desítky let: 1970, 1980, 1990, 2000. Babičce tedy bylo 40 let.",
  ),
  t(
    "Táta se narodil v roce 1980. V jakém roce mu bylo 25 let?",
    "V roce 2005",
    [
      ["V roce 2000", "V roce 2000 mu bylo teprve 20 let."],
      ["V roce 2010", "V roce 2010 mu bylo už 30 let."],
      ["V roce 1995", "To jsi 25 let odečetl místo přičetl — v roce 1995 mu bylo 15 let."],
    ],
    "K roku narození přičti věk, na který se otázka ptá.",
    "Přičítej po částech: nejdřív k roku 1980 přičti 20 let, pak přidej zbývajících 5 let. Pozor, věk se k roku narození přičítá, ne odečítá.",
    "Kdo se narodil v roce 1980, má 25 let o 25 let později: 1980 + 20 = 2000 a 2000 + 5 = 2005.",
  ),
  t(
    "Maminka se narodila v roce 1985. Kolik jí bude v roce 2030?",
    "45 let",
    [
      ["40 let", "40 let jí bude v roce 2025. Do roku 2030 přibude ještě 5 let."],
      ["55 let", "55 let by jí bylo až v roce 2040."],
      ["35 let", "35 let jí bylo v roce 2020, do roku 2030 přibude 10 let."],
    ],
    "Ptáme se na budoucnost, ale počítá se stejně: odečti rok narození.",
    "Rozděl si to: od 1985 do 2000 je 15 let a od 2000 do 2030 dalších 30 let. Obě části sečti.",
    "Od roku 1985 do 2000 uplyne 15 let a od 2000 do 2030 dalších 30 let. Dohromady 15 + 30 = 45, v roce 2030 bude mamince 45 let.",
  ),
  t(
    "Babička se narodila v roce 1950. Kolik jí bylo v roce 1980, kdy se narodila maminka?",
    "30 let",
    [
      ["25 let", "25 let jí bylo v roce 1975. Do roku 1980 uplynulo ještě 5 let."],
      ["35 let", "35 let jí bylo až v roce 1985, maminka se narodila dřív."],
      ["40 let", "40 let jí bylo až v roce 1990."],
    ],
    "Odečti rok narození babičky od roku narození maminky.",
    "Počítej po desítkách: od 1950 přes 1960 a 1970 až k 1980. Kolik desítek let jsi přeskočil?",
    "Od roku 1950 do roku 1980 jsou tři desítky let (1960, 1970, 1980). Babičce tedy bylo 30 let, když se narodila maminka.",
  ),
  t(
    "Děda se narodil v roce 1948. V jakém roce mu bylo 60 let?",
    "V roce 2008",
    [
      ["V roce 2000", "V roce 2000 mu bylo 52 let."],
      ["V roce 2010", "V roce 2010 mu bylo už 62 let — o dva roky víc."],
      ["V roce 1998", "V roce 1998 mu bylo 50 let. Chybí ještě 10 let."],
    ],
    "K roku narození dědy přičti jeho věk.",
    "Přičítej ve dvou krocích: nejdřív k roku 1948 přičti 50 let, pak ještě dalších 10 let. Hlídej přechod přes rok 2000.",
    "K roku narození přičteme věk: 1948 + 50 = 1998 a 1998 + 10 = 2008. Dědovi bylo 60 let v roce 2008.",
  ),
  t(
    "Teta (sestra maminky) se narodila v roce 1978. Kolik jí bylo v roce 2010?",
    "32 let",
    [
      ["30 let", "30 let jí bylo v roce 2008. Do roku 2010 přibyly ještě 2 roky."],
      ["38 let", "Asi jsi odečítal jednotky obráceně (8 − 0). Od 1978 do 2010 musíš počítat přes celou desítku."],
      ["42 let", "42 let jí bude až v roce 2020."],
    ],
    "Odečti rok narození tety od roku 2010.",
    "Počítej přes celou desítku: od 1978 do 1980 jsou 2 roky a od 1980 do 2010 jsou tři desítky let. Obě části sečti.",
    "Od roku 1978 do 1980 uplynou 2 roky a od 1980 do 2010 dalších 30 let. Dohromady 2 + 30 = 32, tetě bylo 32 let.",
  ),
  t(
    "Rodiče se vzali v roce 2000. Ty ses narodil v roce 2017. Kolik let po svatbě rodičů ses narodil?",
    "17 let",
    [
      ["15 let", "15 let po svatbě by byl rok 2015, ty ses narodil o dva roky později."],
      ["20 let", "20 let po svatbě by byl rok 2020."],
      ["7 let", "Pozor na desítky: od 2000 do 2017 uplyne víc než jedna desítka let."],
    ],
    "Odečti rok svatby od roku svého narození.",
    "Od roku 2000 do 2010 je jedna desítka let. Kolik let ještě zbývá od 2010 do 2017? Obě části sečti.",
    "Od roku 2000 do 2010 uplyne 10 let a od 2010 do 2017 dalších 7 let. Dohromady 10 + 7 = 17 let po svatbě.",
  ),
  t(
    "Která z těchto událostí je nejdál v minulosti?",
    "Svatba prarodičů před 45 lety",
    [
      ["Narození maminky před 30 lety", "30 let je méně než 45 — maminka se narodila až po svatbě prarodičů."],
      ["Tvoje narození před 9 lety", "9 let je malé číslo, tvoje narození je blízko přítomnosti."],
      ["Nástup do školy před 3 lety", "3 roky jsou nejkratší doba — to je nejnovější událost."],
    ],
    "Čím víc let od události uplynulo, tím dál v minulosti je.",
    "Porovnej počty let u všech čtyř událostí a hledej to největší číslo. Pozor, otázka nechce tu nejnovější.",
    "Ze čtyř čísel 45, 30, 9 a 3 je největší 45. Svatba prarodičů je proto nejdál v minulosti — na časové přímce by ležela nejvíc vlevo.",
  ),
  t(
    "Která z těchto událostí se stala nejblíže přítomnosti (je nejnovější)?",
    "Narození bratra před 2 lety",
    [
      ["Narození sestry před 6 lety", "6 let je víc než 2 — sestra se narodila dřív než bratr."],
      ["Svatba rodičů před 12 lety", "12 let je dlouhá doba, tahle událost je dál v minulosti."],
      ["Narození maminky před 33 lety", "33 let je z nabídky nejvíc — to je nejstarší událost, ne nejnovější."],
    ],
    "Nejnovější je událost, od které uplynulo nejméně let.",
    "Seřaď počty let u všech možností od nejmenšího. Pozor, tady hledáš opak než u otázky na nejstarší událost.",
    "Ze čtyř čísel 2, 6, 12 a 33 je nejmenší 2. Narození bratra je proto nejnovější — na časové přímce by leželo nejblíž přítomnosti.",
  ),
  t(
    "Která z těchto fotografií je nejstarší?",
    "Fotka z narození dědy před 70 lety",
    [
      ["Fotka ze svatby rodičů před 15 lety", "15 let je mnohem méně než 70, svatba rodičů byla dávno po dědově narození."],
      ["Fotka z tvých narozenin před 5 lety", "5 let je krátká doba, tahle fotka patří k nejnovějším."],
      ["Fotka z prvního školního dne před 3 lety", "3 roky jsou nejkratší doba — to je nejnovější fotka."],
    ],
    "Nejstarší fotka zachycuje událost, která je nejdál v minulosti.",
    "Porovnej, před kolika lety byla každá fotka pořízená. Která generace se narodila nejdřív — prarodiče, rodiče, nebo děti?",
    "Ze čtyř čísel 70, 15, 5 a 3 je největší 70. Fotka z dědova narození je proto nejstarší, což sedí i s generacemi: prarodiče se narodili nejdřív.",
  ),
  t(
    "Proč jsou pro poznání historie důležité kroniky a staré fotografie?",
    "Protože ukazují, jak lidé dříve žili, a můžeme to porovnat s dneškem",
    [
      ["Protože se dají výhodně prodat", "Cena nerozhoduje — jde o to, co nám o minulosti řeknou."],
      ["Protože to škole nařizuje zákon", "Nejde o příkaz. Záznamy jsou cenné tím, co o minulosti prozrazují."],
      ["Protože ukazují jen, jaké bylo počasí", "Kroniky a fotky zachycují mnohem víc než počasí — domy, oblečení, práci, slavnosti."],
    ],
    "Kronika a fotografie jsou doklady o životě našich předků.",
    "Kdybys chtěl zjistit, co se od dětství prarodičů změnilo, potřebuješ vědět, jak to bylo tehdy. Kde to zjistíš a k čemu ti to pomůže?",
    "Kroniky a staré fotografie zachycují, jak žily dřívější generace. Díky nim můžeme minulost porovnat se současností a vidět, co se změnilo.",
  ),
  t(
    "Jak z rodinné kroniky nebo starých fotografií poznáme, že se něco mezi generacemi změnilo?",
    "Porovnáme zápisy a fotky z různých let a hledáme rozdíly",
    [
      ["Uhodneme to bez kroniky i fotek", "Hádání nic nedokáže. Změnu prokáže až srovnání záznamů."],
      ["Kronikář nám to vymyslí", "Kronikář nic nevymýšlí, zapisuje skutečnost. A porovnat to musíme sami."],
      ["Stačí se podívat na nejnovější fotku", "Z jedné fotky změnu nepoznáš — potřebuješ i starší, abys měl s čím srovnávat."],
    ],
    "Ke srovnání potřebuješ alespoň dva různé okamžiky.",
    "Změnu poznáš, jen když položíš vedle sebe starý a nový záznam téhož místa. Co pak na obou záznamech sleduješ?",
    "Změnu mezi generacemi poznáme srovnáním: vedle sebe dáme zápisy nebo fotky z různých let a všímáme si, co bylo dřív jinak než dnes.",
  ),
  t(
    "Proč je užitečné povídat si s prarodiči o tom, jak žili, když byli malí?",
    "Dozvíme se o minulosti od někoho, kdo ji sám zažil",
    [
      ["Protože v knihách o minulosti nic není", "V knihách o minulosti je hodně, ale prarodiče vyprávějí o vlastním životě a o tvé rodině."],
      ["Protože si nic jiného nepamatují", "O to nejde — cenné je, že minulost sami prožili."],
      ["Protože je to povinný úkol do kroniky", "Nejde o povinnost. Rozhovor je cenný sám o sobě — dozvíš se, jak rodina žila."],
    ],
    "Prarodiče jsou svědci doby, kterou ty jsi nezažil.",
    "Vyprávění pamětníka je druh pramene, který žádná kniha nenahradí. Čím je výjimečné, že ti o minulosti vypráví právě prarodič?",
    "Prarodiče svou dobu sami prožili, jsou tedy přímí svědci. Od nich se dozvíš i to, co v žádné knize není — jak žila právě tvoje rodina.",
  ),
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool);
}

export const CASOVAPRIMKAGENERACE: TopicMetadata[] = [
  {
    id: "g3-prvouka-lide-a-cas-minulost-a-soucasnost-casova-primka-generace-v-rodine",
    rvpNodeId: "g3-prvouka-lide-a-cas-minulost-a-soucasnost-casova-primka-generace-v-rodine",
    title: "Časová přímka, generace v rodině",
    studentTitle: "Čas a rodina",
    subject: "prvouka",
    category: "Lidé a čas",
    topic: "Minulost a současnost",
    briefDescription: "Pracuješ s časovou přímkou a poznáš generace v rodině.",
    keywords: [
      "časová přímka",
      "generace",
      "prarodiče",
      "rodiče",
      "minulost",
      "přítomnost",
      "budoucnost",
      "rodokmen",
      "kronika",
      "archiv",
    ],
    goals: [
      "Vysvětlit, co je časová přímka a k čemu slouží.",
      "Pojmenovat tři generace v rodině (prarodiče, rodiče, děti).",
      "Rozlišit pojmy minulost, přítomnost a budoucnost.",
      "Uvést příklady toho, jak se věci změnily v čase.",
      "Vysvětlit, co je kronika a archiv.",
    ],
    boundaries: [
      "Pouze základní pojmy — bez podrobné práce s historickými prameny.",
      "Generace v rámci rodiny (3 generace), bez dalšího rozšíření.",
    ],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Generace: prarodiče (1.), rodiče (2.), děti (3.). Časová přímka jde od minulosti (vlevo) přes přítomnost k budoucnosti (vpravo).",
      steps: [
        "Časová přímka zobrazuje události v pořadí od nejstarší po nejnovější.",
        "Minulost = co bylo, přítomnost = co je teď, budoucnost = co bude.",
        "Rodina má 3 generace: prarodiče → rodiče → děti.",
        "Rodokmen je strom příbuzenských vztahů.",
        "Kronika = kniha záznamů událostí, archiv = místo pro uchovávání dokumentů.",
      ],
      commonMistake: "Prarodiče patří do 1. generace (nejstarší), ne do 3. generace.",
      example: "Dědeček se narodil v roce 1955, v roce 2005 se mu narodil vnuk — bylo mu tehdy 50 let (2005 − 1955 = 50).",
    },
  },
];
