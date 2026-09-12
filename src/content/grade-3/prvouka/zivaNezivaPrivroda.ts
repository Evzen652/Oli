import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Chybná možnost = konkrétní typická chyba + vysvětlení, proč právě ta nesedí. */
interface Chybna {
  o: string;
  why: string;
}

/**
 * Výběrová úloha s kompletní dokumentací (CONTENT_AUTHORING §0):
 * dvě vlastní nápovědy, vysvětlení PROČ a zpětná vazba u KAŽDÉ chybné možnosti.
 */
function q(
  question: string,
  correctAnswer: string,
  chybne: [Chybna, Chybna, Chybna],
  hints: [string, string],
  explanation: string,
): PracticeTask {
  const optionFeedback: Record<string, string> = {};
  for (const c of chybne) optionFeedback[c.o] = c.why;
  return {
    question,
    correctAnswer,
    options: shuffle([correctAnswer, ...chybne.map((c) => c.o)]),
    optionFeedback,
    hints,
    explanation,
  };
}

// ─────────────────────────────────────────────────────────
// Disjunktní pooly obtížnosti (L1 < L2 < L3), select_one.
//   L1 = rozpoznání: izolované, jasné příklady živé/neživé přírody a
//        základní znaky života (dýchání, výživa, růst, rozmnožování).
//   L2 = aplikace: hraniční, ale vysvětlitelné případy s odůvodněním —
//        semeno, houba bez chlorofylu, fotosyntéza, potravní řetězec,
//        rozlišení nositele (ryba) vs samotné neživé látky (voda/vzduch).
//   L3 = transfer: kombinace znaků, „pastičkové" příklady, 2kroková úvaha —
//        pohyb/růst samy o sobě nerozhodují, skupinové zařazení více věcí
//        najednou, závislost živého na neživém.
//
// Opraveno 2026-09-12 (inventura obsahu): doplněna zpětná vazba u všech
// chybných možností, nápovědy odstupňované (velká je podrobnější a delší)
// a opraveny shody („neživé věci nerostou") i vokalizace („k fotosyntéze").
// ─────────────────────────────────────────────────────────

const POOL_L1: PracticeTask[] = [
  q(
    "Co patří do živé přírody?",
    "Strom",
    [
      { o: "Kámen", why: "Kámen je kus horniny — sám neroste ani se nerozmnožuje." },
      { o: "Vzduch", why: "Vzduch je směs plynů, tedy neživá látka, i když ho organismy potřebují." },
      { o: "Voda", why: "Voda je neživá látka. Život umožňuje, ale sama nedýchá ani neroste." },
    ],
    [
      "Projdi možnosti a u každé se zeptej, jestli sama roste a rozmnožuje se.",
      "Tři z možností v přírodě běžně najdeš, ale ani jedna z nich se nezvětšuje z vlastních sil. Jen jediná přijímá vodu a živiny, každý rok přirůstá a vytváří semena, ze kterých vyrostou další jedinci.",
    ],
    "Strom patří do živé přírody, protože dýchá, roste, přijímá živiny a rozmnožuje se semeny. Kámen, vzduch a voda žádný z těchto životních projevů nemají.",
  ),
  q(
    "Co patří do neživé přírody?",
    "Kámen",
    [
      { o: "Housenka", why: "Housenka je larva motýla — přijímá potravu, roste a proměňuje se." },
      { o: "Houba", why: "Houba roste a rozmnožuje se výtrusy, je to živý organismus." },
      { o: "Tráva", why: "Tráva roste, přijímá vodu a tvoří semena — patří mezi rostliny." },
    ],
    [
      "Hledej věc, která se nezvětšuje sama od sebe a nikdy z ní nevznikne potomek.",
      "Dvě možnosti jsou rostlina a houba, jedna je živočich v prvním období života. Zbývá jediná věc, která vznikla z horniny, nemá žádné mládě a po celá léta zůstává stejná.",
    ],
    "Kámen patří do neživé přírody — sám neroste, nedýchá ani se nerozmnožuje. Housenka, houba i tráva jsou naopak živé organismy.",
  ),
  q(
    "Který ze znaků NEPLATÍ pro živé organismy?",
    "Jsou tvrdé jako horniny",
    [
      { o: "Dýchají", why: "Dýchání je jeden ze základních znaků života." },
      { o: "Rostou", why: "Růst z vlastních sil je pro živé organismy typický." },
      { o: "Rozmnožují se", why: "Rozmnožování patří mezi hlavní znaky živých organismů." },
    ],
    [
      "Tři možnosti popisují, co živý tvor dělá, jedna popisuje, jaký je na dotek.",
      "Znaky života jsou činnosti — něco, co organismus sám provádí. Vlastnost jako barva, lesk nebo pevnost naproti tomu popisuje jen materiál a o životě neříká nic. Najdi proto možnost, která žádnou činnost nevyjadřuje.",
    ],
    "Živé organismy dýchají, rostou, přijímají živiny a rozmnožují se. Pevnost materiálu mezi znaky života nepatří — měkká žížala i želva s tvrdým krunýřem jsou stejně živé.",
  ),
  q(
    "Který z těchto příkladů patří do živé přírody?",
    "Pes",
    [
      { o: "Písek", why: "Písek tvoří rozdrcená zrnka horniny, sám neroste." },
      { o: "Mrak", why: "Mrak je shluk vodních kapiček — mění tvar, ale nežije." },
      { o: "Sníh", why: "Sníh je zmrzlá voda, tedy neživá látka." },
    ],
    [
      "Jedna z možností má mláďata, potřebuje jíst a sama se pohybuje.",
      "Zbylé tři možnosti souvisejí s vodou nebo s horninou a žádná z nich nepřijímá potravu. Hledej tvora, který dýchá, roste, potřebuje krmení a přivádí na svět potomky.",
    ],
    "Pes patří do živé přírody — dýchá, přijímá potravu, roste a rozmnožuje se. Písek, mrak i sníh jsou neživá příroda.",
  ),
  q(
    "Která z těchto věcí neroste ani se nerozmnožuje?",
    "Písek",
    [
      { o: "Motýl", why: "Motýl se vylíhl z kukly, přijímá potravu a klade vajíčka." },
      { o: "Bříza", why: "Bříza je strom — roste a rozmnožuje se semeny." },
      { o: "Žížala", why: "Žížala je živočich, pohybuje se, přijímá potravu a rozmnožuje se." },
    ],
    [
      "Hledej možnost, která je jen rozdrobenou horninou.",
      "Zbylé tři možnosti jsou organismy — jeden strom, jeden hmyz a jeden drobný živočich z půdy. Hledaná věc naproti tomu vznikla drolením skal, nepřijímá potravu a žádné potomstvo nemá.",
    ],
    "Písek patří do neživé přírody — jsou to drobná zrnka rozdrcené horniny. Motýl, bříza i žížala jsou živé organismy.",
  ),
  q(
    "Které zvíře patří do živé přírody?",
    "Kočka",
    [
      { o: "Hora", why: "Hora je velký útvar z hornin, zvíře to rozhodně není." },
      { o: "Řeka", why: "Řeka je tekoucí voda, sama nedýchá ani se nerozmnožuje." },
      { o: "Oblak", why: "Oblak tvoří vodní kapičky, žádné životní projevy nemá." },
    ],
    [
      "V otázce se ptáme na zvíře — vyřaď vše, co je jen krajina nebo počasí.",
      "Ze čtyř možností jsou tři útvary neživé přírody: jeden z hornin, jeden z tekoucí vody a jeden z kapiček na obloze. Hledej domácího živočicha, který mívá koťata a loví myši.",
    ],
    "Kočka je živočich — dýchá, roste, přijímá potravu a rozmnožuje se. Hora, řeka i oblak patří do neživé přírody.",
  ),
  q(
    "Co v této čtveřici nepatří mezi živé organismy?",
    "Sníh",
    [
      { o: "Ryba", why: "Ryba dýchá žábrami, přijímá potravu a klade jikry." },
      { o: "Strom", why: "Strom roste, přijímá vodu a rozmnožuje se semeny." },
      { o: "Brouk", why: "Brouk se pohybuje, přijímá potravu a rozmnožuje se." },
    ],
    [
      "Hledej možnost, která vzniká z vody při mrazu.",
      "Tři možnosti jsou organismy: jeden vodní živočich, jedna rostlina a jeden hmyz. Čtvrtá možnost vzniká, když voda ve vzduchu zmrzne, a na jaře zase roztaje — žádný životní projev u ní nenajdeš.",
    ],
    "Sníh patří do neživé přírody — je to zmrzlá voda. Ryba, strom i brouk jsou živé organismy.",
  ),
  q(
    "Jaké jsou znaky živých organismů? Vyber správnou skupinu.",
    "Dýchání, výživa, růst, rozmnožování",
    [
      { o: "Tvrdost, barva, tvar, váha", why: "To jsou vlastnosti věcí, ne činnosti, které by organismus sám dělal." },
      { o: "Pohyb, chlad, tvrdost, lesk", why: "Pohybuje se i vítr a chlad ani lesk se života netýkají." },
      { o: "Světlo, teplo, vzduch, voda", why: "To jsou podmínky z neživé přírody. Život umožňují, ale znaky života to nejsou." },
    ],
    [
      "Hledej skupinu, ve které jsou samá slova odvozená od činností těla.",
      "Každý živý tvor přijímá vzduch, přijímá potravu, zvětšuje se a zanechává potomstvo. Skupiny, které mluví o barvě, tvrdosti nebo o počasí, popisují jen okolí a hmotu, nikoli to, co organismus dělá.",
    ],
    "Znaky živých organismů jsou dýchání, výživa, růst a rozmnožování. Tvrdost, barva nebo lesk jsou vlastnosti látek, ne projevy života.",
  ),
  q(
    "Co z této čtveřice patří do živé přírody?",
    "Rostlina",
    [
      { o: "Kov", why: "Kov se získává z rud a zpracovává ho člověk, sám se nezvětší." },
      { o: "Plast", why: "Plast vyrábí člověk z ropy, nikdy nebyl živý." },
      { o: "Sklo", why: "Sklo se taví z písku — je to neživý materiál." },
    ],
    [
      "Tři možnosti jsou materiály z továrny nebo z dílny.",
      "Ani kov, ani plast, ani sklo samy nikdy nepřirostou — musí je někdo vyrobit. Hledaná možnost naopak kořeny nasává vodu, listy přijímá plyn ze vzduchu a tvoří semena.",
    ],
    "Rostlina patří do živé přírody — roste, přijímá vodu a živiny a rozmnožuje se. Kov, plast a sklo jsou neživé materiály vyrobené člověkem.",
  ),
  q(
    "Co z uvedených věcí není živý organismus?",
    "Oblak",
    [
      { o: "Včela", why: "Včela sbírá pyl, živí se a rozmnožuje — je to hmyz." },
      { o: "Dub", why: "Dub je strom, roste a rozmnožuje se žaludy." },
      { o: "Ježek", why: "Ježek je živočich: dýchá, přijímá potravu a má mláďata." },
    ],
    [
      "Hledej útvar, který uvidíš vysoko nad sebou a mění tvar podle větru.",
      "Tři možnosti jsou organismy — jeden hmyz, jeden strom a jeden savec s bodlinami. Čtvrtá je jen shluk drobných kapiček vody nebo ledových krystalků, který sám nic nepřijímá a žádné mládě nemá.",
    ],
    "Oblak patří do neživé přírody — tvoří ho vodní kapičky nebo ledové krystalky. Včela, dub i ježek jsou živé organismy.",
  ),
  q(
    "Která z těchto věcí je živý organismus?",
    "Brouk",
    [
      { o: "Cihla", why: "Cihla je vypálená hlína, kterou vyrobil člověk." },
      { o: "Sklenice", why: "Sklenici vyrobili ze skla — sama neroste ani nedýchá." },
      { o: "Mince", why: "Minci vyrazili z kovu, živým organismem být nemůže." },
    ],
    [
      "Tři možnosti vyrobil člověk, jedna se narodila v přírodě.",
      "Cihlu, sklenici i minci někdo vyrobil a samy se nikdy nezvětší. Hledej drobného živočicha se šesti nohama a tvrdými krovkami, který přijímá potravu a klade vajíčka.",
    ],
    "Brouk je živý organismus — dýchá, roste a rozmnožuje se. Cihla, sklenice a mince jsou neživé vyrobené předměty.",
  ),
  q(
    "Co nepatří do živé přírody?",
    "Skála",
    [
      { o: "Liška", why: "Liška je šelma — loví, dýchá a má mláďata." },
      { o: "Muchomůrka", why: "Muchomůrka je houba, roste a rozmnožuje se výtrusy." },
      { o: "Kopřiva", why: "Kopřiva je bylina, roste a tvoří semena." },
    ],
    [
      "Hledej velký pevný útvar, který stojí v krajině po tisíce let skoro beze změny.",
      "Zbylé tři možnosti jsou organismy: jedna šelma, jedna houba a jedna bylina. Hledaná věc je naproti tomu obrovský kus horniny, který se nezvětšuje z vlastních sil a nemá žádné potomstvo.",
    ],
    "Skála patří do neživé přírody — je to velký kus horniny. Liška, muchomůrka i kopřiva jsou živé organismy.",
  ),
  q(
    "Která z těchto věcí patří do neživé přírody?",
    "Hlína",
    [
      { o: "Mravenec", why: "Mravenec přijímá potravu, staví mraveniště a rozmnožuje se." },
      { o: "Smrk", why: "Smrk je strom, roste a rozmnožuje se semeny v šiškách." },
      { o: "Plíseň", why: "Plíseň je drobná houba — přirůstá a šíří se výtrusy." },
    ],
    [
      "Hledej materiál, ze kterého je zahradní záhon.",
      "Tři možnosti dýchají, přijímají potravu a zanechávají potomstvo — jeden hmyz, jeden jehličnan a jedna houba. Čtvrtá možnost je jen směs drobných částeček horniny a rozložených zbytků, ve které rostliny koření.",
    ],
    "Hlína (půda) patří do neživé přírody — je to směs rozdrobené horniny a rozložených zbytků. Mravenec, smrk i plíseň jsou živé organismy.",
  ),
];

const POOL_L2: PracticeTask[] = [
  q(
    "Proč je semeno považováno za živé, i když neroste?",
    "Uvnitř semene je zárodek — bude růst, až dostane vodu a teplo",
    [
      { o: "Semeno je jen kousek horniny", why: "Semeno vzniklo na rostlině, ne z kamene. Z horniny nikdy nic nevyklíčí." },
      { o: "Semeno je neživé, protože se nehýbe", why: "Pohyb není znakem života — strom se také nehýbe, a přitom žije." },
      { o: "Semeno je neživé, dokud nevyklíčí", why: "Klíčení je jen probuzení. To, co se probouzí, muselo být živé už předtím." },
    ],
    [
      "Semeno vypadá jako neživé zrnko, ale něco se v něm ukrývá.",
      "Zkus si vzpomenout, co se stane s fazolí položenou na vlhkou vatu. Po pár dnech z ní vyraší kořínek a lístek — a to by nešlo, kdyby v ní nic živého nebylo. Tomuto klidovému stavu se říká dormance.",
    ],
    "Semeno je živé, i když se nepohybuje a zrovna nepřirůstá. Uvnitř je zárodek budoucí rostliny v klidovém stavu (dormanci), který čeká na vodu, teplo a světlo.",
  ),
  q(
    "Houba v lese — je to živý organismus?",
    "Ano, houba je živý organismus",
    [
      { o: "Ne, houba je neživá, protože nemá listy", why: "Listy mají rostliny. Houba patří do jiné skupiny, a přesto žije." },
      { o: "Ne, houba je neživá, protože nefotosyntetizuje", why: "Fotosyntéza je jen jeden způsob výživy. Bez ní se dá žít jinak." },
      { o: "Záleží na tom, jak velká houba je", why: "Velikost o životě nic neříká — živá je i plíseň, kterou sotva zahlédneš." },
    ],
    [
      "Zeptej se, jestli houba přirůstá a jestli z ní vznikají další houby.",
      "Houba vyrůstá z podhoubí, které se v zemi rozpíná, a šíří se drobnými výtrusy. Nemá sice zelené barvivo, ale živiny získává rozkladem zbytků v půdě, takže všechny ostatní znaky života splňuje.",
    ],
    "Houba je živý organismus, i když nemá chlorofyl a nevyrábí si potravu fotosyntézou. Živiny získává rozkladem odumřelých látek, roste a rozmnožuje se výtrusy.",
  ),
  q(
    "Co je fotosyntéza?",
    "Způsob, jak si rostliny vyrábějí potravu ze světla a vody",
    [
      { o: "Způsob, jak se rozmnožují živočichové", why: "Rozmnožování je úplně jiný děj a s výrobou potravy nesouvisí." },
      { o: "Způsob, jak horniny mění svůj tvar", why: "Horniny nejsou živé a žádnou potravu nepotřebují." },
      { o: "Způsob, jak vzduch vzniká v půdě", why: "Vzduch se v půdě netvoří, jen vyplňuje mezery mezi částečkami." },
    ],
    [
      "Rozeber si to slovo: „foto“ znamená světlo.",
      "Ta předpona napovídá, že hlavní roli v ději hraje sluneční záření. Zamysli se, kdo ze všech organismů nutně potřebuje svit, aby vůbec měl co jíst, a co si z něj dokáže vyrobit.",
    ],
    "Fotosyntéza je děj, při kterém zelené rostliny využijí sluneční světlo, vodu a oxid uhličitý k výrobě cukru. Jako vedlejší produkt při ní vzniká kyslík.",
  ),
  q(
    "Co tvoří základ potravního řetězce?",
    "Rostliny (producenti)",
    [
      { o: "Dravci — lvi a vlci", why: "Dravci stojí na konci řetězce, ne na jeho začátku." },
      { o: "Kameny a horniny", why: "Horniny nejsou živé a nikdo se jimi neživí." },
      { o: "Houby a bakterie", why: "Houby a bakterie rozkládají zbytky na konci řetězce, potravu nevyrábějí." },
    ],
    [
      "Na začátku řetězce stojí ten, kdo si jídlo obstará úplně sám.",
      "Postupuj od konce: vlk uloví srnu a srna spásá něco zeleného. Když dojdeš až úplně na začátek, narazíš na organismy, které nikoho nejedí, protože si jídlo ze slunečního světla vyrobí samy.",
    ],
    "Základ potravního řetězce tvoří rostliny, protože si fotosyntézou vyrábějí potravu samy. Býložravci i masožravci na nich přímo nebo nepřímo závisí.",
  ),
  q(
    "Vzduch patří do živé nebo neživé přírody?",
    "Do neživé přírody",
    [
      { o: "Do živé přírody", why: "Vzduch nedýchá ani nepřirůstá, jen ho živé organismy potřebují." },
      { o: "Do obou — vzduch je součástí živých i neživých věcí", why: "Vzduch se sice dostane všude, ale sám žádné životní projevy nemá." },
      { o: "Vzduch není součástí přírody", why: "K přírodě vzduch samozřejmě patří, jen ne mezi organismy." },
    ],
    [
      "Zeptej se, jestli se samotný vzduch zvětšuje a jestli má potomstvo.",
      "Vzduch je směs plynů, hlavně dusíku a kyslíku. Plyny se nerozmnožují ani nepřijímají potravu, takže žádné životní projevy nemají. To, že je živí tvorové ke svému životu nutně potřebují, je živými nedělá.",
    ],
    "Vzduch patří do neživé přírody. Je to směs plynů — dusíku, kyslíku a oxidu uhličitého. Sám neroste ani se nerozmnožuje, ale živé organismy ho potřebují k dýchání.",
  ),
  q(
    "Voda patří do živé nebo neživé přírody?",
    "Do neživé přírody",
    [
      { o: "Do živé přírody", why: "Voda sama nedýchá ani se nerozmnožuje." },
      { o: "Do živé přírody, protože v ní žijí ryby", why: "Ryby jsou živé, tekutina kolem nich ale zůstává neživou látkou." },
      { o: "Záleží na tom, zda je čistá nebo znečištěná", why: "Čistota z látky organismus neudělá — živá není tak ani tak." },
    ],
    [
      "Odděl prostředí od tvorů, kteří v něm žijí.",
      "V rybníce plavou ryby a roste vodní tráva, ale to jsou samostatné organismy. Samotná tekutina kolem nich žádné mládě nemá a sama se nezvětšuje, i když bez ní by život na Zemi nebyl možný.",
    ],
    "Voda patří do neživé přírody — je to látka, která sama neroste ani se nerozmnožuje. To, že v ní žijí organismy, z ní živou věc nedělá.",
  ),
  q(
    "Potřebují živé organismy neživou přírodu?",
    "Ano, potřebují vodu, vzduch, světlo a půdu",
    [
      { o: "Ne, živé organismy nepotřebují nic z neživé přírody", why: "Bez vody a vzduchu by nepřežil žádný organismus ani jediný den." },
      { o: "Jen živočichové potřebují vzduch, rostliny nepotřebují nic", why: "Rostlina potřebuje vodu, světlo i vzduch úplně stejně jako zvíře." },
      { o: "Jen rostliny potřebují světlo, živočichové ne", why: "Bez světla by živočichové neviděli a nerostla by jim ani potrava." },
    ],
    [
      "Zkus si představit rostlinu bez zálivky nebo zvíře bez vzduchu.",
      "Projdi si postupně obě skupiny organismů. Rostlina nasává kořeny tekutinu i živiny ze země a listy přijímá plyn. Živočich dýchá, pije a hřeje se na slunci. Vyber možnost, která platí pro obě skupiny.",
    ],
    "Všechny živé organismy závisí na neživé přírodě. Rostliny potřebují vodu, vzduch, světlo a živiny z půdy, živočichové dýchají a pijí. Bez neživé přírody by život nemohl existovat.",
  ),
  q(
    "Proč rostliny potřebují světlo?",
    "K fotosyntéze — výrobě potravy",
    [
      { o: "Aby se mohly pohybovat", why: "Rostlina se z místa nepohybuje, světlo k tomu nepotřebuje." },
      { o: "Aby mohly dýchat", why: "Dýchat rostlina dokáže i ve tmě, k dýchání světlo nutné není." },
      { o: "Aby se rozmnožovaly", why: "K rozmnožování slouží květy a semena, ne přímo světlo." },
    ],
    [
      "Rostlina si na rozdíl od zvířat jídlo nehledá, ale sama ho tvoří.",
      "Bez dostatku svitu listy zežloutnou a rostlina zchřadne, protože nemá z čeho vytvořit cukr. Hledej proto možnost, která mluví o tom, že si rostlina jídlo obstará sama, ne o pohybu nebo dýchání.",
    ],
    "Rostliny potřebují světlo k fotosyntéze — z vody a oxidu uhličitého při ní vyrábějí cukr jako potravu. Bez dostatku světla fotosyntéza neprobíhá a rostlina hyne.",
  ),
  q(
    "Je plíseň na chlebu živý organismus?",
    "Ano, plíseň je živý organismus (druh houby)",
    [
      { o: "Ne, protože nemá listy ani kořeny", why: "Listy a kořeny mají rostliny. Plíseň patří jinam, a přesto žije." },
      { o: "Ne, plíseň je jen skvrna na chlebu", why: "Ta skvrna je hustá spleť vláken, která přirůstá a šíří se dál." },
      { o: "Záleží na barvě plísně", why: "Barva o životě nic nevypovídá — živé jsou zelené i bílé plísně." },
    ],
    [
      "Podívej se, co se stane s tou skvrnou za pár dní na tomtéž krajíci.",
      "Skvrna se den ode dne zvětšuje a vytváří chmýří, ze kterého se uvolňují drobné výtrusy. Ty se pak usadí i na sousední potravině. Zvětšování i šíření potomstva přitom patří mezi typické znaky života.",
    ],
    "Plíseň je živý organismus — druh houby. Roste, přijímá živiny z chleba a rozmnožuje se výtrusy, i když nemá listy ani kořeny.",
  ),
  q(
    "Co vše potřebuje rostlina k fotosyntéze?",
    "Světlo, vodu a oxid uhličitý",
    [
      { o: "Jen sluneční světlo", why: "Samotné světlo nestačí, rostlina musí mít i z čeho cukr vyrobit." },
      { o: "Jen vodu z půdy", why: "Bez světla fotosyntéza neproběhne, i kdyby měla rostlina vody dost." },
      { o: "Teplo a tmu", why: "Ve tmě fotosyntéza neprobíhá vůbec." },
    ],
    [
      "Jednu látku rostlina nasává kořeny, druhou přijímá listy a k tomu potřebuje energii.",
      "Spočítej, kolik různých věcí se musí sejít dohromady: zdroj energie z oblohy, tekutina ze země a plyn, který vydechují živočichové. Možnosti začínající slovem „jen“ proto nemohou být úplné.",
    ],
    "K fotosyntéze rostlina potřebuje světlo, vodu z půdy a oxid uhličitý ze vzduchu. Z nich vyrobí cukr a jako vedlejší produkt uvolní kyslík.",
  ),
  q(
    "Proč se houby neřadí mezi rostliny, i když obojí patří do živé přírody?",
    "Nemají chlorofyl a nevyrábějí si potravu fotosyntézou",
    [
      { o: "Houby se nikdy nerozmnožují", why: "Houby se rozmnožují výtrusy, jen jinak než rostliny semeny." },
      { o: "Houby nejsou vůbec živé organismy", why: "Houby rostou i tvoří potomstvo, takže živé bezpochyby jsou." },
      { o: "Houby nepotřebují žádné živiny", why: "Živiny potřebují — získávají je rozkladem odumřelých zbytků." },
    ],
    [
      "Rozhoduje to, jak si organismus obstarává jídlo.",
      "Rostlina má v listech zelené barvivo a díky němu si jídlo vytvoří ze světla. Houba takové barvivo nemá, a proto musí živiny získávat z odumřelých zbytků v půdě nebo ve dřevě. Právě tenhle rozdíl je od rostlin odděluje.",
    ],
    "Houby nemají chlorofyl, a proto si nemohou vyrábět potravu fotosyntézou jako rostliny. Živiny získávají rozkladem odumřelých organismů. Přesto jsou živé — rostou a rozmnožují se výtrusy.",
  ),
  q(
    "Co znamená, že rostliny jsou v potravním řetězci „producenti“?",
    "Že si samy vyrábějí potravu fotosyntézou a ostatní na nich závisí",
    [
      { o: "Že vyrábějí potravu pro sebe i pro kameny", why: "Kameny nejsou živé a žádnou potravu nepotřebují." },
      { o: "Že jsou to jediné živé organismy na Zemi", why: "Živých organismů je mnoho — živočichové, houby i bakterie." },
      { o: "Že se nikdy nerozmnožují", why: "Rostliny se rozmnožují semeny, výtrusy nebo oddenky." },
    ],
    [
      "Producent je ten, kdo něco vyrábí — tady jde o jídlo.",
      "V řetězci stojí rostliny úplně na začátku. Býložravci je spásají a masožravci potom loví býložravce, takže všichni ostatní jsou na nich nakonec závislí. Hledej možnost, která obě tyto věci spojuje dohromady.",
    ],
    "Rostliny nazýváme producenty, protože si díky fotosyntéze vyrábějí potravu samy ze světla, vody a oxidu uhličitého. Býložravci i masožravci na nich přímo nebo nepřímo závisí.",
  ),
  q(
    "Proč se rostlina počítá mezi živé organismy, i když se nikam nepřesouvá?",
    "Protože dýchá, přijímá živiny, roste a tvoří semena",
    [
      { o: "Protože je zelená", why: "Barva o životě nerozhoduje, zelený je i nátěr na plotě." },
      { o: "Nepočítá se — živé je jen to, co se hýbe", why: "Pohyb mezi znaky života nepatří, jinak by byl živý i vítr." },
      { o: "Protože ji zasadil člověk", why: "Rostliny vyrůstají i bez zásahu člověka, třeba v lese nebo na louce." },
    ],
    [
      "Sestav si seznam znaků života a zkontroluj je u rostliny jeden po druhém.",
      "Rostlina si listy vyměňuje plyny se vzduchem, kořeny nasává ze země živiny, každý rok přirůstá a nakonec na ní dozrají semena, ze kterých vyklíčí nový jedinec. Přesun z místa na místo mezi znaky života vůbec nepatří.",
    ],
    "Rostlina splňuje všechny znaky života: dýchá, přijímá živiny, roste a rozmnožuje se. Schopnost přemísťovat se mezi znaky života nepatří, a proto o zařazení rostliny nerozhoduje.",
  ),
];

const POOL_L3: PracticeTask[] = [
  q(
    "Jaký je hlavní rozdíl mezi živou a neživou přírodou?",
    "Živé organismy dýchají, rostou a rozmnožují se; neživé věci ne",
    [
      { o: "Živé věci jsou vždy zelené; neživé věci mají jinou barvu", why: "Zelené jsou jen některé rostliny — zvířata ani houby zelené nejsou." },
      { o: "Živé věci jsou větší než neživé věci", why: "Velikost nerozhoduje: hora je obrovská a neživá, bakterie drobná a živá." },
      { o: "Živé věci se pohybují, neživé věci stojí na místě", why: "Strom stojí na místě a žije, vítr se pohybuje a živý není." },
    ],
    [
      "Hledej znaky, které platí pro každý organismus bez jediné výjimky.",
      "Barva, velikost ani pohyb přírodu spolehlivě nerozdělí — ke každému z nich se najde protipříklad. Spolehlivé jsou jen projevy, které dělá každý organismus: přijímá vzduch, zvětšuje se z vlastních sil a zanechává potomstvo.",
    ],
    "Hlavní rozdíl je v životních projevech: živé organismy dýchají, přijímají živiny, rostou a rozmnožují se. Neživé věci tyto projevy nemají. Barva, velikost ani pohyb o životě nerozhodují.",
  ),
  q(
    "Který příklad DOKAZUJE, že pohyb není rozhodujícím znakem živého organismu?",
    "Strom stojí na místě, ale je živý; vítr se pohybuje, ale je neživý",
    [
      { o: "Pes běhá po zahradě, protože je živý", why: "Ukazuje jen jednu stranu — živého tvora, který se hýbe." },
      { o: "Kámen se nehýbe, protože je neživý", why: "Také jen jedna strana — neživá věc, která se nehýbe." },
      { o: "Ryba plave, protože žije ve vodě", why: "Popisuje jen, jak se ryba pohybuje, a nic tím nedokazuje." },
    ],
    [
      "Důkaz musí ukázat obě strany zároveň, ne jen jednu z nich.",
      "Potřebuješ jediný příklad, ve kterém je současně nehybný živý tvor i pohybující se neživá věc. Když příklad ukáže jen jednu z těch dvojic, nic nevyvrací — může jít o náhodu.",
    ],
    "Aby se dokázalo, že pohyb o životě nerozhoduje, musí příklad ukázat obě strany: nehybný organismus, který je živý, a pohyblivou věc, která živá není. Ostatní možnosti ukazují jen jednu stranu.",
  ),
  q(
    "Proč je semeno klasifikováno jako živé, přestože právě neroste, nedýchá viditelně a nerozmnožuje se?",
    "Obsahuje živý zárodek, který se probudí, až dostane vodu a teplo",
    [
      { o: "Protože je tvrdé jako kámen a kámen vydrží dlouho", why: "Tvrdost ani trvanlivost mezi znaky života nepatří." },
      { o: "Semeno vlastně živé není, jen to tak vypadá", why: "Kdyby živé nebylo, nikdy by z něj nevyrostla rostlina." },
      { o: "Protože má stejnou barvu jako listy stromu", why: "Barva o životě nic nevypovídá — hnědá semena jsou také živá." },
    ],
    [
      "Rozhoduje, co se v semeni skrývá, ne co zrovna dělá.",
      "Semeno je v klidovém stavu, kterému se říká dormance — životní projevy jsou jen pozastavené, ne zrušené. Jakmile se dostane do vlhké a teplé půdy, začne během několika dní klíčit. Suchý kamínek by to nikdy nedokázal.",
    ],
    "Semeno je živé, i když právě neplní viditelně všechny životní projevy. Uvnitř je zárodek rostliny v klidovém (dormantním) stavu, který se rozběhne, jakmile dostane vodu, teplo a světlo.",
  ),
  q(
    "Co se stane s rostlinou, když ji přestaneme zalévat?",
    "Usychá a hyne, protože voda je nezbytná pro její život",
    [
      { o: "Nic se nestane — rostliny nepotřebují vodu", why: "Bez vody rostlina nepřežije, je pro ni nezbytná." },
      { o: "Začne přijímat vodu ze vzduchu a přežije bez problémů", why: "Vzdušnou vlhkost umí využít jen několik zvláštních druhů, běžné rostliny ne." },
      { o: "Přestane růst, ale jinak ji to neovlivní", why: "Nedostatek vody rostlinu poškodí, nejde jen o zastavení růstu." },
    ],
    [
      "Vzpomeň si, co se stane s kytkou, na kterou se přes prázdniny zapomene.",
      "Voda v rostlině rozvádí živiny a drží listy napnuté, navíc je surovinou pro výrobu cukru. Když ji rostlina přestane dostávat, listy zvadnou, zežloutnou a nakonec celá uhyne. Nejde tedy jen o to, že přestane přirůstat.",
    ],
    "Rostlina bez vody usychá a hyne. Voda patří do neživé přírody a je pro život rostliny nezbytná: rozvádí živiny, drží pletiva napnutá a je potřeba k fotosyntéze.",
  ),
  q(
    "Která z těchto skupin patří CELÁ do neživé přírody?",
    "Půda, voda, vzduch",
    [
      { o: "Tráva, voda, housenka", why: "Tráva i housenka jsou živé, celá skupina proto neplatí." },
      { o: "Strom, kámen, houba", why: "Strom i houba jsou živé organismy." },
      { o: "Pes, slunce, mech", why: "Pes a mech jsou živé organismy, skupina tedy neplatí." },
    ],
    [
      "Zkontroluj v každé skupině všechny tři položky, ne jen tu první.",
      "Skupina platí jen tehdy, když ani jedna položka nemá životní projevy. Stačí, aby se ve trojici objevil jediný organismus, a možnost padá. Projdi je proto jednu po druhé a hned u první živé položky skupinu vyřaď.",
    ],
    "Půda, voda a vzduch jsou látky a prostředí neživé přírody — samy nedýchají, nerostou ani se nerozmnožují. Ostatní skupiny obsahují vždy aspoň jeden organismus.",
  ),
  q(
    "Která z těchto skupin patří CELÁ do živé přírody?",
    "Dub, žížala, muchomůrka",
    [
      { o: "Dub, kámen, žížala", why: "Kámen je neživý, celá skupina proto neplatí." },
      { o: "Žížala, voda, muchomůrka", why: "Voda je neživá látka." },
      { o: "Dub, vzduch, muchomůrka", why: "Vzduch je směs plynů, tedy neživá příroda." },
    ],
    [
      "Stačí jediná neživá položka a celá skupina je špatně.",
      "Projdi si trojice zleva doprava a u každé položky si polož otázku, jestli dýchá, přirůstá a tvoří potomstvo. Jakmile narazíš na horninu, tekutinu nebo plyn, skupinu hned škrtni a pokračuj k další.",
    ],
    "Dub (strom), žížala (živočich) i muchomůrka (houba) jsou živé organismy. Ostatní skupiny obsahují vždy jednu neživou věc — kámen, vodu nebo vzduch.",
  ),
  q(
    "Houby nefotosyntetizují jako rostliny. Odkud tedy získávají živiny a proč to neznamená, že jsou neživé?",
    "Rozkládají odumřelé zbytky a získávají z nich živiny — proto stále rostou i tvoří výtrusy",
    [
      { o: "Houby energii nepotřebují, protože jsou napůl neživé", why: "Energii potřebuje každý organismus, napůl živý tvor neexistuje." },
      { o: "Houby čerpají energii přímo ze slunce úplně stejně jako rostliny", why: "Bez zeleného barviva houba sluneční světlo využít neumí." },
      { o: "Houby jsou vlastně kameny, které pomalu rostou", why: "Kámen nepřijímá živiny ani nemá potomstvo." },
    ],
    [
      "Výživa fotosyntézou není jediný způsob, jak se dá žít.",
      "V lese houby vyrůstají na pařezech, na spadaném listí nebo na mrtvém dřevě — a to není náhoda. Právě odtud si berou živiny. Ostatní znaky života jim přitom zůstávají: zvětšují se a zanechávají potomstvo.",
    ],
    "Houby nemají chlorofyl, a proto nefotosyntetizují. Živiny získávají rozkladem odumřelých organických látek. Jiný způsob výživy ale neznamená, že nežijí — houby dýchají, rostou a rozmnožují se výtrusy.",
  ),
  q(
    "V rybníce je voda, ve které žije okoun a roste vodní tráva. Co z toho patří do neživé přírody?",
    "Pouze voda v rybníce",
    [
      { o: "Voda i okoun, protože okoun ve vodě žije", why: "Okoun je živočich — dýchá, roste a rozmnožuje se." },
      { o: "Okoun i vodní tráva, protože oba potřebují vodu", why: "Oba jsou naopak živé organismy, do neživé přírody nepatří." },
      { o: "Nic — všechno v rybníce je živé", why: "Samotná tekutina živá není, i když v ní život probíhá." },
    ],
    [
      "Probírej jmenované věci po jedné a u každé se ptej, jestli dýchá a roste.",
      "V zadání jsou tři věci: tekutina, jeden živočich a jedna rostlina. Dvě z nich mají všechny znaky života, i když jedna z nich stojí na místě. Zbývá jediná, která je pouze prostředím, kde život probíhá.",
    ],
    "Do neživé přírody patří jen samotná voda — sama neroste, nedýchá ani se nerozmnožuje. Okoun i vodní tráva jsou živé organismy, které v ní žijí, ale tím se voda živou nestává.",
  ),
  q(
    "Rostliny (producenti) tvoří základ potravního řetězce. Co by se stalo, kdyby na Zemi náhle nebyly žádné rostliny?",
    "Živočichové by neměli co jíst, protože na rostlinách závisí celý řetězec",
    [
      { o: "Nic by se nestalo, dravci by dál lovili kořist", why: "Dravci loví býložravce, a ti by bez rostlin neměli co jíst." },
      { o: "Živočichové by začali fotosyntetizovat místo rostlin", why: "Živočichové zelené barvivo nemají, fotosyntézy proto nejsou schopni." },
      { o: "Jen býložravci by měli problém, masožravci ne", why: "Masožravci by přišli o kořist, protože by vymřeli býložravci." },
    ],
    [
      "Sleduj řetězec od začátku až na konec, ne jen jediný jeho článek.",
      "Býložravec spásá rostlinu a masožravec loví býložravce. Když zmizí první článek, chybí potrava druhému a hned poté i třetímu. Proto nestačí uvažovat o jedné skupině zvířat, ale o celé řadě najednou.",
    ],
    "Kdyby zmizely rostliny, neměli by co jíst býložravci. A protože masožravci loví býložravce, chyběla by potrava i jim. Celý potravní řetězec proto stojí na rostlinách jako producentech.",
  ),
  q(
    "Při fotosyntéze rostliny spotřebovávají oxid uhličitý a vodu. Co z toho, co přitom vzniká, dýchají živočichové?",
    "Kyslík, který rostliny vyrábějí při fotosyntéze",
    [
      { o: "Oxid uhličitý, který rostliny vyrábějí při fotosyntéze", why: "Oxid uhličitý rostliny při fotosyntéze naopak spotřebovávají." },
      { o: "Cukr, který se mění na vzduch", why: "Cukr je potrava rostliny a na vzduch se nemění." },
      { o: "Vodu, kterou rostliny vypouštějí do vzduchu", why: "Vodní páru rostliny opravdu odpařují, dýchat ji ale nemůžeme." },
    ],
    [
      "Rozliš, co rostlina při fotosyntéze spotřebuje a co naopak vydá ven.",
      "Zadání říká, co rostlina bere. Co tedy zůstává na druhé straně? Vedle cukru vzniká ještě plyn, bez kterého by se člověk neobešel ani pár minut — a právě ten rostlina vypouští do okolí.",
    ],
    "Při fotosyntéze vzniká jako vedlejší produkt kyslík a právě ten živočichové i lidé dýchají. Ukazuje to, jak jsou rostliny a živočichové navzájem propojení.",
  ),
  q(
    "Rampouch na okapu se pomalu prodlužuje, jak na něj namrzá další voda. Je rampouch živý organismus?",
    "Ne, protože nedýchá, nepřijímá živiny ani se nerozmnožuje — jen na něj namrzá další voda",
    [
      { o: "Ano, protože roste stejně jako rostlina", why: "Rostlina přirůstá zevnitř z vlastních sil, tady jen přibývá ledová vrstva." },
      { o: "Ano, protože má protáhlý tvar jako živý organismus", why: "Tvar o životě nic neříká — protáhlý je i klacek." },
      { o: "Záleží na tom, jak dlouhý rampouch je", why: "Délka nerozhoduje, životní projevy chybějí i tomu nejdelšímu." },
    ],
    [
      "Zvětšování samo o sobě ještě neznamená, že jde o organismus.",
      "Projdi si postupně všechny znaky života: přijímá rampouch vzduch? Bere si odněkud potravu? Vzniká z něj potomek? Teprve když je odpověď třikrát ne, můžeš s jistotou říct, že jeho přibývání je pouhé namrzání.",
    ],
    "Rampouch se zvětšuje jen tím, že na něj namrzá další voda. Nedýchá, nepřijímá živiny ani se nerozmnožuje. Pouhé zvětšování tedy — stejně jako pohyb — není spolehlivým znakem života.",
  ),
  q(
    "Krápník v jeskyni pomalu roste, jak se na něj usazuje vápenec z kapající vody. Je krápník živý organismus?",
    "Ne, protože nedýchá, nepřijímá živiny ani se nerozmnožuje — jen se na něj usazuje vápenec",
    [
      { o: "Ano, protože roste jako rostlina v zemi", why: "Rostlina přirůstá z vlastních sil, krápníku jen přibývá vrstva zvenčí." },
      { o: "Ano, protože má pravidelný tvar jako živé organismy", why: "Pravidelný tvar mají i krystaly soli, a ty živé nejsou." },
      { o: "Záleží na tom, jak starý krápník je", why: "Stáří o životě nerozhoduje — starý je i kámen v potoce." },
    ],
    [
      "Rozliš přibývání zvenčí od skutečného růstu z vlastních sil.",
      "Voda kape ze stropu jeskyně a při každé kapce zanechá tenounkou vrstvičku. Útvar tak přibývá zvenčí, ne zevnitř. Zkontroluj všechny tři znaky života najednou a uvidíš, že nesedí ani jediný z nich.",
    ],
    "Krápník přibývá tím, že se na něj z kapající vody usazuje vápenec. Nedýchá, nepřijímá živiny ani netvoří potomstvo — je to neživá hornina. Pouhé zvětšování organismus z ničeho neudělá.",
  ),
  q(
    "Proč by bez neživé přírody nemohl existovat ani jediný potravní řetězec?",
    "Rostliny na začátku řetězce potřebují vodu, světlo a půdu, jinak nevyrostou",
    [
      { o: "Protože potravní řetězec tvoří jen neživé věci", why: "Řetězec tvoří organismy, neživá příroda jim jen dává podmínky k životu." },
      { o: "Protože zvířata jedí kameny a vodu", why: "Kameny zvířata nejedí, potravu získávají z jiných organismů." },
      { o: "Neplatí to — řetězec by fungoval i bez vody a světla", why: "Bez vody a světla by nevyrostly rostliny a řetězec by neměl začátek." },
    ],
    [
      "Najdi nejdřív první článek řetězce a zeptej se, co potřebuje ke svému růstu.",
      "Řetězec začíná organismy, které si jídlo vyrábějí samy. K tomu ale potřebují zdroj energie z oblohy, tekutinu ze země a živiny z prsti. Když jim tyhle podmínky vezmeš, nevznikne potrava ani pro první patro řetězce.",
    ],
    "Na začátku každého potravního řetězce stojí rostliny. Ty potřebují vodu, sluneční světlo a živiny z půdy, tedy věci z neživé přírody. Bez nich by nevyrostly a býložravci ani masožravci by neměli co jíst.",
  ),
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool);
}

export const ZIVANEZIVAPRIRODA: TopicMetadata[] = [
  {
    id: "g3-prvouka-rozmanitost-prirody-ziva-a-neziva-priroda-rozdily-mezi-zivou-a-nezivou-prirodou",
    title: "Živá a neživá příroda",
    studentTitle: "Živé a neživé",
    subject: "prvouka",
    category: "Rozmanitost přírody",
    topic: "Živá a neživá příroda",
    briefDescription: "Rozeznáš živou a neživou přírodu a jejich znaky.",
    illustrationDesc:
      "dítě sedí na louce, vedle leží kameny a rostliny, v ruce drží lupu a zkoumá brouka na listu",
    keywords: [
      "živá příroda",
      "neživá příroda",
      "organismy",
      "rostliny",
      "živočichové",
      "houby",
      "kámen",
      "voda",
      "vzduch",
      "půda",
      "světlo",
      "dýchání",
      "růst",
      "rozmnožování",
      "fotosyntéza",
      "semeno",
      "potravní řetězec",
    ],
    goals: [
      "Rozlišit živou a neživou přírodu a uvést příklady obou.",
      "Vyjmenovat znaky živých organismů (dýchání, výživa, růst, rozmnožování).",
      "Vysvětlit, proč je semeno živé, i když neroste.",
      "Popsat, jak živé organismy závisí na neživé přírodě.",
      "Uvést příklad potravního řetězce.",
    ],
    boundaries: [
      "Základní pojmy pro 3. třídu — bez buněčné biologie, biochemie nebo ekosystémových modelů.",
      "Fotosyntéza jen jako jednoduchá představa (světlo + voda → potrava), bez rovnic.",
    ],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Živá příroda: rostliny, živočichové, houby. Neživá příroda: kameny, voda, vzduch, půda, světlo. Živé organismy dýchají, rostou a rozmnožují se.",
      steps: [
        "Zeptej se: roste to, dýchá to, rozmnožuje se to?",
        "Pokud ano — je to živý organismus.",
        "Pokud ne — patří to do neživé přírody.",
        "Nezapomeň: semeno je živé, i když právě neroste.",
      ],
      commonMistake:
        "Záměna: pohyb ani samotný růst velikosti nejsou rozhodující — stromy jsou živé, přestože se nepohybují, a rampouch nebo krápník přibývají, přestože jsou neživé. Houba je živá, i když nemá chlorofyl.",
      example:
        "Kámen — neroste, nedýchá, nerozmnožuje se → neživá příroda. Dub — roste, dýchá, rozmnožuje se žaludy → živá příroda.",
    },
  },
];
