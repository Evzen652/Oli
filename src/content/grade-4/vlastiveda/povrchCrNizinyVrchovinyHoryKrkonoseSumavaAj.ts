/**
 * Vlastivěda 4. ročník — Povrch ČR: nížiny, vrchoviny, hory.
 *
 * Přepsáno 2026-09-11. Původní úlohy měly jednu nápovědu a „postup“, který
 * zopakoval odpověď, a obsahovaly chyby: „Praděd je druhá nejvyšší hora ČR“
 * (druhá je Luční hora v Krkonoších, Praděd je nejvyšší na Moravě),
 * Krušné hory zařazené do Sudetského oblouku a „hercynské stáří hor“,
 * které 4. ročník nezná.
 *
 * Gradace:
 *  • L1 — nejvyšší hory a pohoří, co je nížina, kde leží které hory.
 *  • L2 — hranice s pohořími, proč se v nížinách hospodaří, nadmořská výška.
 *  • L3 — řazení hor podle výšky, nejnižší a druhé nejvyšší místo, proč jsou
 *         hory oblé, proč je v horách chladněji a víc prší.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

const POOL_L1: PracticeTask[] = [
  choice("Jak se jmenuje nejvyšší hora Česka?", "Sněžka", [
    { value: "Praděd", why: "Praděd je nejvyšší hora Moravy a Jeseníků, ale nižší než Sněžka." },
    { value: "Lysá hora", why: "Lysá hora je nejvyšší v Beskydech, ale nižší než Sněžka." },
    { value: "Plechý", why: "Plechý je nejvyšší hora Šumavy, ale nižší než Sněžka." },
  ], {
    hints: ["Nejvyšší hora Česka leží v Krkonoších.", "Její jméno připomíná sníh, který na ní leží dlouho do jara. Stojí na hranici s Polskem."],
    explanation: "Nejvyšší horou Česka je Sněžka v Krkonoších (1 603 m). Leží na hranici s Polskem.",
  }),
  choice("Ve kterém pohoří leží Sněžka?", "V Krkonoších", [
    { value: "Na Šumavě", why: "Na Šumavě je nejvyšší Plechý. Sněžka je na severu." },
    { value: "V Jeseníkách", why: "V Jeseníkách je nejvyšší Praděd." },
    { value: "V Beskydech", why: "V Beskydech je nejvyšší Lysá hora." },
  ], {
    hints: ["Sněžka leží na severu Čech, u hranice s Polskem.", "Je to nejvyšší české pohoří s národním parkem, ve kterém pramení Labe."],
    explanation: "Sněžka leží v Krkonoších, nejvyšším českém pohoří na hranici s Polskem. V Krkonoších pramení i Labe.",
  }),
  choice("Co je nížina?", "Rovná a nízko položená krajina", [
    { value: "Horská krajina s ostrými štíty", why: "Ostré štíty mají velehory. Nížina je naopak rovná." },
    { value: "Hluboké údolí mezi horami", why: "Údolí je sevřené mezi svahy, nížina je široká rovina." },
    { value: "Krajina se sopkami", why: "Sopky s nížinou nesouvisí." },
  ], {
    hints: ["Slovo nížina napovídá, že je něco nízko.", "Je to široká rovina bez velkých kopců, kde jsou pole a řeky tečou pomalu. Jak ji popíšeš?"],
    explanation: "Nížina je rovná krajina v malé nadmořské výšce. V Česku jsou to hlavně Polabí a jižní Morava, kde se daří zemědělství.",
  }),
  choice("Jak se jmenuje velká nížina ve středních Čechách kolem Labe?", "Polabská nížina", [
    { value: "Dolnomoravský úval", why: "Dolnomoravský úval leží na jižní Moravě kolem řeky Moravy." },
    { value: "Ostravská pánev", why: "Ostravská pánev je na severu Moravy u Ostravy." },
    { value: "Chebská pánev", why: "Chebská pánev je na západě Čech u Chebu." },
  ], {
    hints: ["Jméno nížiny je odvozené od řeky, která jí protéká.", "Řeka pramení v Krkonoších a teče přes Hradec Králové a Kolín. Krajině kolem ní se říká „po Labi“."],
    explanation: "Polabská nížina se jmenuje podle řeky Labe, která jí protéká. Je rovná a úrodná, pěstuje se tam obilí, řepa a zelenina.",
  }),
  choice("Kde leží Šumava?", "Na jihozápadě u Německa a Rakouska", [
    { value: "Na severovýchodě u Polska", why: "Na severovýchodě jsou Krkonoše a Jeseníky." },
    { value: "Uprostřed Čech u Prahy", why: "Uprostřed Čech jsou nížiny a pahorkatiny, Šumava je na hranici." },
    { value: "Na východě u Slovenska", why: "Na hranici se Slovenskem jsou Beskydy a Bílé Karpaty." },
  ], {
    hints: ["Na Šumavě pramení Vltava.", "Šumava leží v jižních Čechách na hranici se dvěma sousedy — s Německem a s dalším, jehož hlavní město je Vídeň."],
    explanation: "Šumava leží na jihozápadě Česka na hranici s Německem a Rakouskem. Je to naše nejrozlehlejší pohoří a pramení tam Vltava.",
  }),
  choice("Jak se jmenuje nejvyšší hora Jeseníků?", "Praděd", [
    { value: "Sněžka", why: "Sněžka je v Krkonoších." },
    { value: "Lysá hora", why: "Lysá hora je v Beskydech." },
    { value: "Klínovec", why: "Klínovec je v Krušných horách." },
  ], {
    hints: ["Na jejím vrcholu stojí vysoký vysílač.", "Je to nejvyšší hora Moravy a jmenuje se podle bájného vládce hor, dědy všech dědů."],
    explanation: "Nejvyšší horou Jeseníků a celé Moravy je Praděd (1 491 m). Na jeho vrcholu stojí vysílač.",
  }),
  choice("Kterou krajinou vede hranice mezi Čechami a Moravou?", "Českomoravskou vrchovinou", [
    { value: "Polabskou nížinou", why: "Polabská nížina je ve středních Čechách." },
    { value: "Krkonošemi", why: "Krkonoše leží na severu na hranici s Polskem." },
    { value: "Šumavou", why: "Šumava je na hranici s Německem a Rakouskem." },
  ], {
    hints: ["Jméno té krajiny obsahuje obě země, které odděluje.", "Je to kopcovitá krajina uprostřed Česka kolem Jihlavy, dnes Kraj Vysočina."],
    explanation: "Hranice mezi Čechami a Moravou vede Českomoravskou vrchovinou uprostřed Česka. Je to mírně zvlněná, spíš chladná krajina — Vysočina.",
  }),
  choice("Kde leží Krušné hory?", "Na severozápadě Čech u Německa", [
    { value: "Na severu Moravy u Polska", why: "Na severu Moravy jsou Jeseníky." },
    { value: "Na jihu Moravy u Rakouska", why: "Na jihu Moravy jsou nížiny a Pálava." },
    { value: "Na východě u Slovenska", why: "U Slovenska jsou Beskydy a Bílé Karpaty." },
  ], {
    hints: ["Na druhé straně Krušných hor leží Drážďany.", "Krušné hory tvoří dlouhý hřbet na hranici s Německem, nad Karlovými Vary a Ústím nad Labem."],
    explanation: "Krušné hory leží na severozápadě Čech a tvoří hranici s Německem. Nejvyšší horou je Klínovec (1 244 m).",
  }),
  choice("Jak se jmenuje nejvyšší hora Šumavy?", "Plechý", [
    { value: "Praděd", why: "Praděd je v Jeseníkách." },
    { value: "Klínovec", why: "Klínovec je v Krušných horách." },
    { value: "Sněžka", why: "Sněžka je v Krkonoších." },
  ], {
    hints: ["Leží na hranici s Rakouskem, nedaleko Plešného jezera.", "Jméno hory je podobné slovu „plech“. Měří 1 378 metrů a za jasného dne je z ní vidět až k Alpám."],
    explanation: "Nejvyšší horou české části Šumavy je Plechý (1 378 m). Pod ní leží Plešné jezero.",
  }),
  choice("Ve kterém pohoří leží Lysá hora?", "V Beskydech", [
    { value: "V Jeseníkách", why: "V Jeseníkách je Praděd." },
    { value: "V Krkonoších", why: "V Krkonoších je Sněžka." },
    { value: "V Orlických horách", why: "Orlické hory jsou ve východních Čechách, Lysá hora v nich není." },
  ], {
    hints: ["Lysá hora leží na východě Moravy u Slovenska.", "Pohoří se táhne od Frenštátu k hranici se Slovenskem a stojí na něm i socha Radegasta."],
    explanation: "Lysá hora (1 323 m) je nejvyšší horou Moravskoslezských Beskyd na východě Moravy. Je to jedna z nejdeštivějších hor Česka.",
  }),
  choice("Co je pohoří?", "Skupina hor a kopců se společným jménem", [
    { value: "Jedna samotná vysoká hora", why: "Pohoří tvoří mnoho hor, ne jedna." },
    { value: "Rovina bez jediného kopce", why: "Rovina je nížina, pohoří je jejím opakem." },
    { value: "Horský potok v údolí", why: "Potok v pohoří teče, ale pohoří to není." },
  ], {
    hints: ["Krkonoše, Šumava i Jeseníky jsou pohoří.", "Pohoří má jméno a patří k němu mnoho vrcholů — v Krkonoších třeba Sněžka i Luční hora."],
    explanation: "Pohoří je skupina hor a kopců, které patří k sobě a mají společné jméno. Třeba Krkonoše tvoří Sněžka, Luční hora a mnoho dalších vrcholů.",
  }),
  choice("Jak vysoká je přibližně Sněžka?", "Asi 1 600 metrů", [
    { value: "Asi 500 metrů", why: "Tak vysoko leží kopce kolem Prahy. Sněžka je mnohem vyšší." },
    { value: "Asi 1 000 metrů", why: "Tisíc metrů mají vyšší kopce, Sněžka je o dost vyšší." },
    { value: "Asi 3 000 metrů", why: "Tak vysoké jsou Alpy. V Česku taková hora není." },
  ], {
    hints: ["Je to nejvyšší hora Česka, ale v Alpách by byla malá.", "Je o dost vyšší než tisíc metrů, ale Alpy s horami přes čtyři tisíce metrů jsou mnohem vyšší. Který odhad sedí?"],
    explanation: "Sněžka měří 1 603 metrů nad mořem. Je to nejvyšší bod Česka, ale v Alpách jsou hory vysoké přes 4 000 metrů.",
  }),
  choice("Jaká krajina v Česku převládá?", "Pahorkatiny a vrchoviny", [
    { value: "Rozlehlé nížiny", why: "Nížin je v Česku jen malá část, hlavně Polabí a jižní Morava." },
    { value: "Vysoké velehory", why: "Velehory jako Alpy v Česku nejsou." },
    { value: "Písečné pouště", why: "Pouště v Česku nejsou." },
  ], {
    hints: ["Když jedeš vlakem přes Česko, vidíš spíš rovinu, nebo kopečky?", "Rovin je v Česku málo a vysoké hory jsou jen na okrajích. Většina země jsou kopce a vrchy. Jak se taková krajina jmenuje?"],
    explanation: "Většinu Česka tvoří pahorkatiny a vrchoviny — zvlněná krajina s kopci. Nížin je málo a hory jsou hlavně na hranicích.",
  }),
];

const POOL_L2: PracticeTask[] = [
  choice("Jak se liší vrchovina od hor?", "Vrchovina je nižší a má oblejší kopce", [
    { value: "Vrchovina je vyšší než hory", why: "Je to naopak, hory jsou vyšší." },
    { value: "Vrchovina je úplná rovina", why: "Rovina je nížina. Vrchovina je zvlněná." },
    { value: "Rozdíl je jen v názvu", why: "Liší se výškou a tvarem kopců." },
  ], {
    hints: ["Srovnej Vysočinu a Krkonoše.", "Na Vysočině jsou mírné oblé kopce, v Krkonoších vysoké vrcholy se strmými svahy. Která krajina je vrchovina?"],
    explanation: "Vrchovina je zvlněná krajina s nižšími a oblejšími kopci, třeba Vysočina. Hory jsou vyšší a mají strmé svahy, třeba Krkonoše.",
  }),
  choice("Proč se v nížinách daří zemědělství?", "Mají úrodnou půdu a teplé podnebí", [
    { value: "Je tam víc sněhu", why: "V nížinách je sněhu méně. Pomáhá teplo a úrodná půda." },
    { value: "Leží blízko moře", why: "Česko u moře neleží." },
    { value: "Jsou tam velká města", why: "Města zemědělství nepomáhají, spíš zabírají půdu." },
  ], {
    hints: ["Co potřebují pole, aby dala velkou úrodu?", "Rostliny potřebují teplo, dost dlouhé léto a půdu s dostatkem živin. Kde toho je víc — dole na rovině, nebo nahoře v horách?"],
    explanation: "Nížiny jsou teplé, léto je v nich dlouhé a půda úrodná. Proto jsou Polabí a jižní Morava obilnice Česka.",
  }),
  choice("Klínovec je nejvyšší horou kterého pohoří?", "Krušných hor", [
    { value: "Krkonoš", why: "Nejvyšší horou Krkonoš je Sněžka." },
    { value: "Jeseníků", why: "Nejvyšší horou Jeseníků je Praděd." },
    { value: "Šumavy", why: "Nejvyšší horou Šumavy je Plechý." },
  ], {
    hints: ["Klínovec leží nad Karlovými Vary u hranice s Německem.", "Je to nejvyšší vrchol dlouhého hřbetu na severozápadě Čech, kde se kdysi těžilo stříbro a cín."],
    explanation: "Klínovec (1 244 m) je nejvyšší horou Krušných hor na severozápadě Čech.",
  }),
  choice("Proč se Čechám říká kotlina?", "Uprostřed jsou nižší a dokola je lemují hory", [
    { value: "Leží v nadmořské výšce nula", why: "Nula metrů je u moře. Čechy leží výš." },
    { value: "Jsou úplně ploché", why: "Čechy nejsou úplně ploché, uprostřed jsou nížiny i pahorkatiny." },
    { value: "Je v nich hodně rybníků", why: "Rybníky s tím nesouvisejí. Jde o tvar krajiny." },
  ], {
    hints: ["Jak vypadá kotlík nebo miska?", "Po okrajích Čech jsou Šumava, Krušné hory, Krkonoše a Orlické hory, uprostřed nížiny. Jaký tvar to připomíná?"],
    explanation: "Čechy jsou jako mísa: na okrajích leží pohoří (Šumava, Krušné hory, Krkonoše, Orlické hory) a uprostřed nižší krajina. Proto se jim říká Česká kotlina.",
  }),
  choice("Která pohoří leží na hranici s Německem?", "Šumava a Krušné hory", [
    { value: "Krkonoše a Jeseníky", why: "Krkonoše a Jeseníky leží na hranici s Polskem." },
    { value: "Beskydy a Bílé Karpaty", why: "Beskydy a Bílé Karpaty leží na hranici se Slovenskem." },
    { value: "Brdy a Křivoklátsko", why: "Brdy a Křivoklátsko leží uvnitř Čech, na hranici nejsou." },
  ], {
    hints: ["Německo sousedí s Českem na západě a severozápadě.", "Jedno pohoří je na jihozápadě, kde pramení Vltava, druhé na severozápadě nad Karlovými Vary."],
    explanation: "Na hranici s Německem leží Šumava (jihozápad), Český les a Krušné hory (severozápad).",
  }),
  choice("Která pohoří leží na hranici se Slovenskem?", "Beskydy a Bílé Karpaty", [
    { value: "Šumava a Krušné hory", why: "Ty leží na hranici s Německem." },
    { value: "Krkonoše a Jizerské hory", why: "Ty leží na hranici s Polskem." },
    { value: "Brdy a Železné hory", why: "Ty leží uvnitř Čech." },
  ], {
    hints: ["Slovensko sousedí s Českem na východě.", "Na východní Moravě je hornatý kraj Valašsko s Lysou horou a jižněji kopce, kde se vinou louky s orchidejemi."],
    explanation: "Na hranici se Slovenskem leží Moravskoslezské Beskydy s Lysou horou a Bílé Karpaty.",
  }),
  choice("Proč v horách žije méně lidí než v nížinách?", "Je tam chladno, strmé svahy a méně úrodná půda", [
    { value: "V horách je zakázáno bydlet", why: "V horách bydlet smí, jen je to těžší." },
    { value: "V horách není voda", why: "Vody je v horách dost, prší tam víc než v nížinách." },
    { value: "Hory jsou příliš teplé", why: "Hory jsou naopak chladnější." },
  ], {
    hints: ["Jak se staví dům a hospodaří na prudkém svahu?", "V horách je dlouhá zima, hodně sněhu a na kamenité půdě se špatně pěstuje. Kde se lidem žije snáz?"],
    explanation: "V horách je chladno, dlouhá zima, strmé svahy a chudá půda. Proto se tam hůř hospodaří a staví a žije tam méně lidí než v nížinách.",
  }),
  choice("Proč se v horách stavějí lyžařská střediska?", "Je tam dlouho sníh a jsou tam svahy", [
    { value: "Hory jsou blízko velkých měst", why: "Hory bývají od měst daleko. Důvodem je sníh." },
    { value: "Na horách je nejtepleji", why: "Na horách je naopak chladněji, a proto tam leží sníh." },
    { value: "V nížinách jsou lyžování zakázané", why: "Není to zakázané, jen v nížinách chybí svahy a sníh." },
  ], {
    hints: ["Co potřebuješ k lyžování?", "Na lyžování je potřeba sníh, který dlouho vydrží, a kopec, ze kterého se sjíždí. Kde je obojí?"],
    explanation: "V horách je chladněji, sníh vydrží dlouho do jara a jsou tam svahy. Proto jsou lyžařská střediska v Krkonoších, na Šumavě nebo v Jeseníkách.",
  }),
  choice("Co znamená údaj 1 603 m n. m. u Sněžky?", "Výšku nad hladinou moře", [
    { value: "Vzdálenost od Prahy", why: "Vzdálenost od Prahy se udává jinak. Zkratka n. m. znamená nad mořem." },
    { value: "Délku turistické cesty", why: "Délka cesty to není. Jde o výšku." },
    { value: "Výšku nad okolní krajinou", why: "Nad okolím je Sněžka mnohem nižší. Výška se měří od hladiny moře." },
  ], {
    hints: ["Rozlušti zkratku „n. m.“.", "Výšky hor se měří od stejného místa, aby se daly porovnat. Od čeho? Od hladiny, která je na celé Zemi stejná."],
    explanation: "Údaj 1 603 m n. m. znamená 1 603 metrů nad mořem — výšku nad hladinou moře. Tak se měří všechny hory, aby se daly porovnat.",
  }),
  choice("Proč je na horách chladněji než v nížině?", "S výškou teplota klesá", [
    { value: "Hory jsou dál od Slunce", why: "Pár kilometrů výšky vzdálenost od Slunce nezmění. Chladněji je kvůli řidšímu vzduchu." },
    { value: "Na horách fouká jen studený vítr", why: "Vítr ochlazuje, ale hlavní příčina je, že s výškou teplota klesá." },
    { value: "Na horách nesvítí slunce", why: "Na horách svítí slunce stejně, často ještě víc." },
  ], {
    hints: ["Vzpomeň si na výlet na hory. Bylo nahoře tepleji, nebo chladněji než dole?", "Čím výš vystoupáš, tím je vzduch řidší a chladnější. O kolik je chladněji na Sněžce než v Praze, když je mezi nimi 1 400 metrů výšky?"],
    explanation: "S výškou teplota klesá, zhruba o 6 stupňů na každý kilometr. Na Sněžce je proto o hodně chladněji než v Praze a sníh tam leží déle.",
  }),
  choice("Které oblasti Česka jsou nejrovnější a nejníže?", "Polabí a jižní Morava", [
    { value: "Šumava a Krkonoše", why: "To jsou naše nejvyšší pohoří." },
    { value: "Vysočina a Brdy", why: "To jsou vrchoviny, ne nížiny." },
    { value: "Beskydy a Jeseníky", why: "To jsou hory na Moravě." },
  ], {
    hints: ["Hledej oblasti kolem velkých řek.", "Jedna leží kolem Labe ve středních Čechách, druhá kolem řeky Moravy a Dyje na jihu."],
    explanation: "Nejrovnější a nejníže položené oblasti jsou Polabí kolem Labe a jižní Morava kolem Moravy a Dyje. Jsou teplé a úrodné.",
  }),
  choice("Ve kterém pohoří pramení Vltava?", "Na Šumavě", [
    { value: "V Krkonoších", why: "V Krkonoších pramení Labe." },
    { value: "V Jeseníkách", why: "V Jeseníkách pramení třeba řeka Morava na Králickém Sněžníku." },
    { value: "V Beskydech", why: "V Beskydech pramení Bečva nebo Ostravice." },
  ], {
    hints: ["Vltava teče z jihu na sever přes Český Krumlov a Prahu.", "Pramen Vltavy je na jihozápadě Česka na svazích Černé hory, v našem největším národním parku."],
    explanation: "Vltava pramení na Šumavě na svazích Černé hory. Teče na sever přes Český Krumlov, České Budějovice a Prahu až do Labe.",
  }),
  choice("Ve kterém pohoří leží hora Praděd?", "V Jeseníkách", [
    { value: "V Krkonoších", why: "V Krkonoších je Sněžka." },
    { value: "V Beskydech", why: "V Beskydech je Lysá hora." },
    { value: "V Krušných horách", why: "V Krušných horách je Klínovec." },
  ], {
    hints: ["Praděd je nejvyšší hora Moravy.", "Pohoří leží na severu Moravy u hranice s Polskem a jeho jméno připomíná jasan."],
    explanation: "Praděd leží v Hrubém Jeseníku na severu Moravy. Je nejvyšší horou Moravy a Jeseníků.",
  }),
];

const POOL_L3: PracticeTask[] = [
  choice("Seřaď hory od nejvyšší po nejnižší.", "Sněžka, Praděd, Plechý, Lysá hora", [
    { value: "Praděd, Sněžka, Lysá hora, Plechý", why: "Nejvyšší je Sněžka (1 603 m), ne Praděd (1 491 m)." },
    { value: "Sněžka, Plechý, Praděd, Lysá hora", why: "Praděd (1 491 m) je vyšší než Plechý (1 378 m)." },
    { value: "Sněžka, Praděd, Lysá hora, Plechý", why: "Plechý (1 378 m) je vyšší než Lysá hora (1 323 m)." },
  ], {
    hints: ["Začni tou nejvyšší — je v Krkonoších.", "Druhá je nejvyšší hora Moravy. Pak hora Šumavy (asi 1 380 m) a nakonec hora Beskyd (asi 1 320 m)."],
    explanation: "Sněžka 1 603 m, Praděd 1 491 m, Plechý 1 378 m a Lysá hora 1 323 m. Všechny tyto hory leží v pohořích na hranicích Česka.",
  }),
  choice("Která hora je v Česku druhá nejvyšší?", "Luční hora v Krkonoších", [
    { value: "Praděd v Jeseníkách", why: "Praděd je nejvyšší na Moravě (1 491 m), ale Luční hora (1 555 m) je vyšší." },
    { value: "Plechý na Šumavě", why: "Plechý měří 1 378 m, to je méně než Luční hora i Praděd." },
    { value: "Lysá hora v Beskydech", why: "Lysá hora měří 1 323 m." },
  ], {
    hints: ["Druhá nejvyšší hora leží ve stejném pohoří jako nejvyšší.", "Leží v Krkonoších kousek od Sněžky a je na ní rozlehlá louka. Její jméno podle té louky zní…"],
    explanation: "Druhá nejvyšší hora Česka je Luční hora (1 555 m) v Krkonoších, blízko Sněžky. Praděd je až třetí, ale je nejvyšší na Moravě.",
  }),
  choice("Kde je nejníže položené místo Česka?", "Na Labi u Hřenska", [
    { value: "Na Šumavě", why: "Šumava je naopak hornatá." },
    { value: "V Praze", why: "Praha leží asi 200 m nad mořem, ale jsou místa ještě níž." },
    { value: "Na soutoku Moravy a Dyje", why: "Soutok je nízko, asi 150 m, ale u Hřenska je to ještě níž." },
  ], {
    hints: ["Voda teče z kopce dolů. Kde opouští Česko řeka, která sbírá vodu z celých Čech?", "Labe opouští Česko u malé obce v Českém Švýcarsku, kousek za Děčínem. Je to asi 115 metrů nad mořem."],
    explanation: "Nejníže položené místo Česka je hladina Labe u Hřenska (asi 115 m n. m.), kde Labe opouští Česko. Voda z celých Čech teče sem.",
  }),
  choice("Proč jsou Krkonoše nebo Šumava oblé, a ne ostré jako Alpy?", "Déšť, vítr a mráz je obrušují už velmi dlouho", [
    { value: "Někdo je uhladil stroji", why: "Hory neuhladili lidé, ale příroda." },
    { value: "Jsou mladší než Alpy", why: "Je to naopak — naše hory jsou mnohem starší." },
    { value: "Vždycky byly takhle oblé", why: "Kdysi byly vyšší a ostřejší. Obrousilo je počasí." },
  ], {
    hints: ["Co se stane s ostrým kamenem, když ho dlouho omílá voda v potoce?", "Naše hory jsou velmi staré. Miliony let na ně pršelo, mrzlo a foukalo. Co to udělalo s jejich vrcholky?"],
    explanation: "Naše hory jsou velmi staré. Déšť, mráz a vítr je miliony let obrušovaly, a proto jsou nižší a oblé. Alpy jsou mladé, a tak mají ostré štíty.",
  }),
  choice("Proč leží většina velkých měst v nížinách a u řek?", "Je tam rovina, voda a úrodná půda", [
    { value: "Na horách je stavění zakázané", why: "Stavět se na horách smí, jen je to těžší." },
    { value: "Řeky dělají města teplejší", why: "Nejde o teplo. Řeka dává vodu a cestu." },
    { value: "Města vznikla náhodně", why: "Lidé si místa pro města vybírali podle výhod krajiny." },
  ], {
    hints: ["Co potřebovali lidé, když zakládali osadu?", "Potřebovali pitnou vodu, pole kolem a snadnou cestu — řeka posloužila i jako cesta. Kde bylo všechno pohromadě?"],
    explanation: "Lidé zakládali osady tam, kde byla voda, úrodná půda a rovina na stavbu i cesty. Proto leží Praha na Vltavě a Brno na Svratce a Svitavě.",
  }),
  choice("Proč v Krkonoších leží sníh až do května, a v Praze ne?", "Hory jsou vysoko a je tam chladněji", [
    { value: "V Krkonoších víc svítí slunce", why: "Slunce by sníh rozpustilo rychleji. Na horách je chladno." },
    { value: "Sníh na horách je z ledu", why: "Sníh je všude z ledových krystalků. Rozdíl je v teplotě." },
    { value: "V Praze nikdy nesněží", why: "V Praze sněží, jen sníh rychle roztaje." },
  ], {
    hints: ["Jak se mění teplota, když stoupáš do kopce?", "Sněžka je o 1 400 metrů výš než Praha a je tam o několik stupňů chladněji. Co to udělá se sněhem na jaře?"],
    explanation: "Krkonoše leží mnohem výš než Praha a s výškou teplota klesá. Proto je tam chladno a sníh vydrží až do jara, kdy v Praze už kvetou stromy.",
  }),
  choice("Proč se horské oblasti často chrání jako národní parky?", "Zachovala se tam vzácná příroda málo ovlivněná lidmi", [
    { value: "V horách se nesmí stavět silnice", why: "Silnice v horách jsou. Chráněná je vzácná příroda." },
    { value: "Hory nikoho nezajímají", why: "Naopak, hory lákají turisty. Chrání se kvůli přírodě." },
    { value: "Hory jsou nejteplejší místa", why: "Hory jsou chladné. Důvodem je vzácná příroda." },
  ], {
    hints: ["Kde lidé nejméně změnili krajinu?", "V horách se hůř hospodařilo, a tak tam zůstaly původní lesy, rašeliniště a vzácné rostliny a zvířata. Co s takovým místem udělat?"],
    explanation: "V horách lidé kvůli chladu a svahům hospodařili méně, a tak se tam zachovala vzácná příroda. Proto jsou Krkonoše a Šumava národními parky.",
  }),
  choice("Jedeš z Prahy do Krkonoš. Kterým směrem jedeš?", "Na severovýchod", [
    { value: "Na jihozápad", why: "Na jihozápad od Prahy leží Šumava." },
    { value: "Na jih", why: "Na jih jsou jižní Čechy s rybníky." },
    { value: "Na západ", why: "Na západ leží Plzeň." },
  ], {
    hints: ["Krkonoše leží na hranici s Polskem.", "Polsko je na severu a Krkonoše leží víc na východ od Prahy, směrem k Hradci Králové. Spoj ty dva směry."],
    explanation: "Krkonoše leží na severovýchodě Čech, směrem od Prahy přes Mladou Boleslav nebo Hradec Králové.",
  }),
  choice("Proč na Českomoravské vrchovině vede hranice Čech a Moravy?", "Rozdělují se tam řeky do Čech a na Moravu", [
    { value: "Je tam nejvyšší hora Česka", why: "Nejvyšší hora je Sněžka v Krkonoších." },
    { value: "Je tam velké jezero", why: "Velké jezero tam není." },
    { value: "Hranici určili náhodně", why: "Hranice sleduje krajinu — kudy tečou řeky." },
  ], {
    hints: ["Kam teče voda z jedné strany vrchoviny a kam z druhé?", "Z české strany teče voda k Vltavě a Labi, z moravské k Dyji a Moravě. Co je tedy na vrchovině?"],
    explanation: "Na Českomoravské vrchovině se dělí voda: z jedné strany teče do Čech k Labi, z druhé na Moravu k Dunaji. Po tomhle rozvodí vedla i hranice zemí.",
  }),
  choice("Na mapě jsou nížiny zelené a hory hnědé. Co barva ukazuje?", "Nadmořskou výšku krajiny", [
    { value: "Kde rostou lesy", why: "Lesy mají na mapě jinou značku. Barvy ukazují výšku." },
    { value: "Kde je nejtepleji", why: "Barvy neukazují teplotu, ale výšku." },
    { value: "Kde žije nejvíc lidí", why: "Počet obyvatel barva na výškové mapě neukazuje." },
  ], {
    hints: ["Podívej se na legendu mapy vedle barev.", "Zelená je nízko, žlutá výš, hnědá nejvýš. Co se tedy od zelené k hnědé zvyšuje?"],
    explanation: "Barvy na mapě ukazují nadmořskou výšku: zelená jsou nížiny, žlutá pahorkatiny a vrchoviny, hnědá hory. Podle barvy poznáš, kde je krajina vysoko.",
  }),
  choice("Proč se na jižní Moravě pěstuje vinná réva, a na Šumavě ne?", "Jižní Morava je nízko a teplá, Šumava vysoko a chladná", [
    { value: "Na Šumavě je réva zákonem zakázaná", why: "Zakázaná není, jen by tam nedozrála." },
    { value: "Na jižní Moravě prší mnohem víc", why: "Na jižní Moravě prší méně. Rozhoduje teplo." },
    { value: "Na Šumavě nejsou žádná pole", why: "I kdyby byla, réva by tam kvůli chladu nedozrála." },
  ], {
    hints: ["Co potřebuje vinná réva, aby hrozny dozrály?", "Réva potřebuje dlouhé teplé léto. Kde je tepleji — v nížině na jihu Moravy, nebo vysoko na Šumavě?"],
    explanation: "Vinná réva potřebuje teplo a dlouhé léto. Jižní Morava leží nízko a je teplá, Šumava je vysoko a chladná, takže by tam hrozny nedozrály.",
  }),
  choice("Proč v horách prší víc než v nížinách?", "Vzduch stoupá přes hory, ochladí se a vyprší", [
    { value: "Mraky se přitahují k horám magnetem", why: "Hory mraky nepřitahují. Vzduch se na nich zvedá a ochlazuje." },
    { value: "V horách je víc řek", why: "Řeky jsou důsledek deště, ne příčina." },
    { value: "V nížinách neprší nikdy", why: "V nížinách prší, jen méně." },
  ], {
    hints: ["Co se stane s vlhkým vzduchem, když musí vystoupat přes horu?", "Stoupající vzduch se ochladí a pára v něm se srazí na kapky. Kde tedy vyprší nejvíc vody?"],
    explanation: "Vítr žene vlhký vzduch přes hory. Vzduch stoupá, ochladí se a pára se srazí do mraků a srážek. Proto na horách prší víc než v nížinách.",
  }),
  choice("Která pohoří lemují Čechy po okrajích?", "Šumava, Krušné hory, Krkonoše a Orlické hory", [
    { value: "Beskydy, Jeseníky, Bílé Karpaty a Pálava", why: "Tyto hory leží na Moravě, ne kolem Čech." },
    { value: "Alpy, Tatry, Karpaty a Krkonoše", why: "Alpy a Tatry leží v jiných státech." },
    { value: "Brdy, Křivoklátsko, Polabí a Šumava", why: "Brdy a Křivoklátsko jsou uvnitř Čech a Polabí je nížina." },
  ], {
    hints: ["Hledej hory na hranicích Čech, ne Moravy.", "Na jihozápadě pramení Vltava, na severozápadě je Klínovec, na severu Sněžka a na východě hory u Hradce Králové."],
    explanation: "Čechy lemují Šumava a Český les na jihozápadě, Krušné hory na severozápadě, Krkonoše na severu a Orlické hory na východě. Proto se jim říká Česká kotlina.",
  }),
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool);
}

export const POVRCHCRNIZINYVRCHOVINYHORYKRKONOSESUMAVAAJ: TopicMetadata[] = [
  {
    id: "g4-vlastiveda-misto-kde-zijeme-ceska-republika-povrch-cr-niziny-vrchoviny-hory-krkonose-sumava-aj",
    rvpNodeId: "g4-vlastiveda-misto-kde-zijeme-ceska-republika-povrch-cr-niziny-vrchoviny-hory-krkonose-sumava-aj",
    title: "Povrch ČR - nížiny, vrchoviny, hory (Krkonoše, Šumava aj.)",
    studentTitle: "Hory a nížiny ČR",
    subject: "vlastivěda",
    category: "Místo, kde žijeme",
    topic: "Místo, kde žijeme",
    briefDescription: "Poznáš hlavní pohoří, nížiny a vrchoviny České republiky.",
    keywords: ["Sněžka", "Krkonoše", "Šumava", "Jeseníky", "Beskydy", "nížina", "vrchovina", "pohoří"],
    goals: [
      "Vyjmenovat hlavní pohoří ČR a jejich nejvyšší hory",
      "Rozlišit nížinu, vrchovinu a hory",
      "Určit polohu pohoří na mapě ČR",
      "Vysvětlit, jak výška krajiny ovlivňuje podnebí a život lidí",
    ],
    boundaries: ["Geologický vznik hor a jejich stáří v milionech let patří na 2. stupeň"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Nejvyšší hory: Sněžka (Krkonoše), Praděd (Jeseníky), Plechý (Šumava), Lysá hora (Beskydy).",
      steps: [
        "Nížiny jsou rovné a nízko — Polabí a jižní Morava.",
        "Vrchoviny mají mírné kopce — Českomoravská vrchovina.",
        "Hory jsou hlavně na hranicích Česka.",
        "S výškou klesá teplota a přibývá srážek.",
      ],
      commonMistake: "Praděd není druhá nejvyšší hora Česka — druhá je Luční hora v Krkonoších.",
      example: "Sněžka měří 1 603 m n. m. — to je výška nad hladinou moře.",
    },
  },
];
