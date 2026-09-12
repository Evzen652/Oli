import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { shuffle } from "../_shared";

// Přepsáno 2026-09-12 (inventura obsahu). Původní generátor měl 8/8/10
// unikátních úloh, jednu sdílenou dvojici nápověd pro celou úroveň a u chybných
// možností žádnou zpětnou vazbu. Teď jsou tři disjunktní banky:
// L1 rozpoznání typického znaku · L2 zařazení konkrétní ukázky
// · L3 dva znaky proti sobě (mluvící zvíře bez ponaučení, forma vs. obsah).

interface Uloha {
  q: string;
  a: string;
  /** [chybná možnost, proč je špatně právě tahle možnost u téhle úlohy] */
  w: [[string, string], [string, string], [string, string]];
  /** [malá nápověda, velká nápověda] — obě unikátní pro tuhle úlohu */
  h: [string, string];
  e: string;
}

function task({ q, a, w, h, e }: Uloha): PracticeTask {
  const optionFeedback: Record<string, string> = {};
  for (const [value, why] of w) optionFeedback[value] = why;
  return {
    question: q,
    correctAnswer: a,
    options: shuffle([a, ...w.map(([value]) => value)]),
    optionFeedback,
    hints: [h[0], h[1]],
    explanation: e,
  };
}

// ── L1 — podle typického znaku poznej druh příběhu ──────────────────────────
const POOL_L1: Uloha[] = [
  {
    q: "Ve kterém druhu vyprávění vystupují víly, draci a čarodějnice?",
    a: "Pohádka",
    w: [
      ["Povídka", "Povídka vypráví jen o tom, co se opravdu může stát — víly ani draci do ní nepatří."],
      ["Bajka", "Bajka potřebuje zvířata jednající jako lidé a poučnou větu na konci, ne víly a draky."],
      ["Báseň", "Báseň se pozná podle veršů a rýmu, ne podle toho, jaké bytosti v ní vystupují."],
    ],
    h: [
      "Víly, draci ani čarodějnice ve skutečném světě nežijí. Hledej vyprávění, ve kterém se smí dít i nemožné věci.",
      "Projdi možnosti po řadě: bajka by musela mít zvířata jednající jako lidé a poučnou větu na konci, povídka vypráví jen o tom, co se doopravdy může přihodit, a báseň bys poznal už podle veršů a rýmu. Zbude jediná možnost, do které kouzelné bytosti patří.",
    ],
    e: "Víly, draci a čarodějnice jsou nadpřirozené bytosti. Vyprávění, které smí porušovat pravidla skutečného světa, je pohádka — proto tyhle postavy hledáme právě tam.",
  },
  {
    q: "Ve kterém krátkém vyprávění jednají zvířata jako lidé a na konci stojí poučná věta?",
    a: "Bajka",
    w: [
      ["Pohádka", "Pohádka mluvící zvíře mít může, ale poučnou větu na konci mít nemusí — popis by tak splnila jen napůl."],
      ["Povídka", "Povídka vypráví o obyčejném životě lidí, zvířata v ní jako lidé nejednají."],
      ["Báseň", "Báseň se pozná podle veršů a rýmu, ne podle zvířecích postav s poučením."],
    ],
    h: [
      "V popisu jsou dvě podmínky najednou: zvířata se chovají po lidsku a text končí poučnou větou.",
      "Pohádka může mít mluvící zvířata, ale poučnou větu na konci mít nemusí. Povídka vypráví o lidech a o tom, co se opravdu stane. Báseň se pozná podle veršů a rýmu. Hledej tedy útvar, u kterého jsou obě podmínky povinné zároveň.",
    ],
    e: "Jen bajka má oba znaky povinně: zvířata s lidskými vlastnostmi a poučení na konci. Kdyby poučení chybělo, o bajku by nešlo.",
  },
  {
    q: "Který útvar se zapisuje do krátkých řádků, jejichž konce se rýmují?",
    a: "Báseň",
    w: [
      ["Pohádka", "Pohádka se zapisuje do vět a odstavců, rýmované řádky v ní nenajdeš."],
      ["Povídka", "Povídka se také zapisuje do vět a odstavců — rým na koncích řádků do ní nepatří."],
      ["Bajka", "Bajka je krátké vyprávění ve větách, poznává se podle zvířat a poučení, ne podle rýmu."],
    ],
    h: [
      "Všímej si, jak text vypadá na stránce, ne o čem vypráví — řádky jsou krátké a jejich konce si zvukově odpovídají.",
      "Pohádka, povídka i bajka se zapisují do vět a odstavců, které jdou až k pravému okraji stránky. Jen jeden z útvarů se zapisuje jinak: do samostatných krátkých řádků pod sebou, jejichž konce se rýmují. Podle toho ho poznáš na první pohled, ještě než si ho přečteš.",
    ],
    e: "O tomhle útvaru rozhoduje způsob zápisu: krátké řádky, kterým říkáme verše, a rým na jejich koncích. Text s takovým zápisem je báseň.",
  },
  {
    q: "Které vyprávění popisuje jen to, co se může opravdu stát — bez kouzel a bez mluvících zvířat?",
    a: "Povídka",
    w: [
      ["Pohádka", "Pohádka naopak stojí na kouzlech a nadpřirozených bytostech."],
      ["Bajka", "Bajka potřebuje zvířata, která jednají jako lidé — a to se doopravdy stát nemůže."],
      ["Báseň", "Báseň se pozná podle veršů a rýmu, ne podle toho, jestli je děj skutečný."],
    ],
    h: [
      "Vyřaď všechno, k čemu jsou potřeba kouzla nebo mluvící zvířata. Zbude vyprávění o světě, jaký znáš z okna.",
      "Pohádka potřebuje nadpřirozené bytosti, bajka mluvící zvířata a poučení na konci, báseň verše s rýmem. Hledej tedy jediné vyprávění, kterému stačí obyčejní lidé a to, co se jim opravdu může přihodit cestou ze školy nebo o prázdninách.",
    ],
    e: "Povídka vypráví o obyčejném životě, tedy o tom, co by se skutečně mohlo stát. Jakmile se objeví kouzla nebo mluvící zvířata, o povídku už nejde.",
  },
  {
    q: "Ve kterém vyprávění může princ vysvobodit zakletou princeznu polibkem?",
    a: "Pohádka",
    w: [
      ["Bajka", "Bajka by místo prince potřebovala zvířata jednající jako lidé a poučení na konci."],
      ["Povídka", "Povídka připouští jen to, co se opravdu může stát — zakletí mezi to nepatří."],
      ["Báseň", "Báseň se pozná podle veršů a rýmu, ne podle zakletých princezen."],
    ],
    h: [
      "Zakletí a vysvobození polibkem se ve skutečném životě stát nemůže — je to kouzlo.",
      "Povídka připouští jen to, co se opravdu může stát, takže zakletí v ní místo nemá. Bajka by potřebovala zvířecí hrdiny a poučení na konci. Báseň bys poznal podle veršů a rýmu. Zbývá vyprávění, ve kterém jsou kouzla úplně běžná věc.",
    ],
    e: "Zakletí a vysvobození polibkem je kouzlo, tedy nadpřirozený děj. Takové děje patří do pohádky, protože právě ta smí porušovat pravidla skutečného světa.",
  },
  {
    q: "Na konci kterého vyprávění najdeš větu „Kdo jinému jámu kopá, sám do ní padá“?",
    a: "Bajka",
    w: [
      ["Pohádka", "Pohádka končívá vítězstvím hrdiny nebo svatbou, radu čtenáři připojovat nemusí."],
      ["Povídka", "Povídka končí prostě tím, jak příběh dopadl — radu na závěr nepřipojuje."],
      ["Báseň", "Báseň končí posledním veršem, ne radou, jak se chovat."],
    ],
    h: [
      "Věta o jámě nic nevypráví — radí, jak se chovat. Který útvar takovou radu na závěr mít musí?",
      "Pohádka končívá vítězstvím hrdiny nebo svatbou a žádnou radu čtenáři dávat nemusí. Povídka končí tím, jak příběh dopadl. Báseň končí posledním veršem. Jen jeden útvar má radu do života jako svou povinnou součást, bez které by to nebyl on.",
    ],
    e: "Věta „Kdo jinému jámu kopá, sám do ní padá“ je ponaučení — krátká rada, jak se chovat. Ponaučení na závěr je povinná součást bajky, ostatní útvary ho mít nemusí.",
  },
  {
    q: "Který útvar se dělí na strofy, tedy na skupiny řádků oddělené mezerou?",
    a: "Báseň",
    w: [
      ["Pohádka", "Pohádka se skládá z vět, a proto se člení na odstavce, ne na strofy."],
      ["Povídka", "Povídka se také skládá z vět a člení se na odstavce — strofy v ní nenajdeš."],
      ["Bajka", "Bajka je krátké vyprávění ve větách, takže se dělí na odstavce."],
    ],
    h: [
      "Strofa je skupina řádků oddělená mezerou. V textu psaném větami má podobnou úlohu odstavec.",
      "Pohádka, povídka i bajka se skládají z vět, a proto se člení na odstavce. Strofa je něco jiného: skupina veršů oddělená mezerou od další skupiny. Strofy tedy mohou vzniknout jen tam, kde se text místo z vět skládá z veršů.",
    ],
    e: "Strofa vznikne jen tam, kde se text skládá z veršů — tedy v básni. Ostatní tři útvary se skládají z vět a člení se na odstavce.",
  },
  {
    q: "Které vyprávění začíná slovy „Bylo nebylo, za sedmero horami“?",
    a: "Pohádka",
    w: [
      ["Povídka", "Povídka začíná obyčejně, protože se tváří jako skutečná událost."],
      ["Bajka", "Bajka jde rovnou k ději se zvířaty, ustálený úvod o sedmero horách nepoužívá."],
      ["Báseň", "Báseň začíná prvním veršem, ne ustálenou úvodní formulí."],
    ],
    h: [
      "Ta úvodní slova hned říkají: tenhle příběh se nestal doopravdy a odehrává se v dávném vymyšleném světě.",
      "Povídka začíná obyčejně, třeba „V pondělí ráno Aneta zaspala“, protože se tváří jako skutečná událost. Bajka jde rovnou k věci: „Liška uviděla vránu se sýrem.“ Báseň začíná prvním veršem. Jen jeden útvar má ustálený začátek, který vymyšlený svět prozradí hned první větou.",
    ],
    e: "„Bylo nebylo, za sedmero horami“ je ustálený začátek, který posluchači rovnou oznámí, že uslyší vymyšlený příběh z dávných časů. Takhle začínají pohádky.",
  },
  {
    q: "Ve kterém krátkém vyprávění se dočteš, jak Tomáš zapomněl ve škole svačinu?",
    a: "Povídka",
    w: [
      ["Pohádka", "Pohádka by potřebovala kouzlo nebo nadpřirozenou bytost, zapomenutá svačina žádné nemá."],
      ["Bajka", "Bajka by potřebovala zvířata jednající jako lidé a poučení na konci, ne školáka Tomáše."],
      ["Báseň", "Báseň by se poznala podle veršů a rýmu, ne podle toho, co se stalo ve škole."],
    ],
    h: [
      "Zapomenutá svačina není žádné kouzlo — takhle běžná příhoda se může stát komukoli z vás.",
      "Pohádka by potřebovala kouzelnou bytost nebo kouzelný předmět, bajka mluvící zvířata a poučení na konci, báseň verše s rýmem. Zapomenutá svačina nesplňuje ani jeden z těchhle znaků, je to docela obyčejná příhoda ze života.",
    ],
    e: "Zapomenutá svačina je obyčejná příhoda, která se opravdu může stát. Krátké vyprávění o takové události je povídka.",
  },
  {
    q: "V kterém útvaru si slova na koncích řádků odpovídají, například „pes – les“?",
    a: "Báseň",
    w: [
      ["Pohádka", "Pohádka se vypráví v obyčejných větách, konce řádků se v ní nerýmují."],
      ["Povídka", "Povídka se také píše v obyčejných větách, rým do ní nepatří."],
      ["Bajka", "Bajka je krátké vyprávění ve větách — rým na koncích řádků v ní nehledej."],
    ],
    h: [
      "Slova „pes“ a „les“ znějí na konci stejně. Takovému souznění se říká rým a patří jen do jednoho z útvarů.",
      "Pohádku, povídku ani bajku nikdo nerýmuje — vyprávějí se v obyčejných větách, kterým by pravidelný rým spíš překážel. Souznění konců řádků je naopak základní ozdobou útvaru zapsaného do veršů a poznáš podle něj text dřív, než zjistíš, o čem vlastně je.",
    ],
    e: "Rým, tedy stejně znějící konce slov na koncích řádků, je ozdoba veršů. Text zapsaný do rýmovaných veršů je báseň.",
  },
  {
    q: "Ve kterém vyprávění liška lichotí vráně, aby jí sýr upadl, a čtenář si z toho má vzít poučení?",
    a: "Bajka",
    w: [
      ["Pohádka", "Pohádka mluvící zvíře mít může, ale poučení na konci povinné nemá — tady poučení je."],
      ["Povídka", "Povídka připouští jen skutečné děje, a vypočítavě lichotící liška mezi ně nepatří."],
      ["Báseň", "Báseň bys poznal podle veršů a rýmu, ne podle chytré lišky."],
    ],
    h: [
      "Liška tu jedná úplně po lidsku — vypočítavě lichotí. A příběh navíc čtenáře něčemu učí.",
      "Kdyby poučení chybělo, šlo by nejspíš o pohádku se zvířecí postavou. Povídka by musela zůstat u toho, co se opravdu může stát, takže mluvící liška do ní nepatří. Báseň bys poznal podle veršů a rýmu. Hledej útvar, u kterého jsou zvířecí jednání i poučení povinné zároveň.",
    ],
    e: "Příběh má oba povinné znaky najednou: zvíře jednající jako člověk a poučení pro čtenáře. Takové vyprávění je bajka.",
  },
  {
    q: "Ve kterém vyprávění se dvě kamarádky pohádají o půjčenou knihu a nakonec se udobří?",
    a: "Povídka",
    w: [
      ["Pohádka", "Pohádka by k tomu potřebovala kouzlo nebo nadpřirozenou bytost, tady žádné není."],
      ["Bajka", "Bajka by místo kamarádek potřebovala zvířata jednající jako lidé a poučení na konci."],
      ["Báseň", "Báseň by byla zapsaná v rýmovaných verších, ne v souvislém vyprávění."],
    ],
    h: [
      "Hádka o půjčenou knihu a usmíření — přesně tohle se mezi kamarádkami děje doopravdy.",
      "Pohádka by na tenhle děj potřebovala kouzelnou bytost, bajka by kamarádky vyměnila za zvířata a připojila poučení, báseň by celý příběh zapsala do rýmovaných veršů. Nic z toho tady není, takže zbývá vyprávění o obyčejných lidech a obyčejných starostech.",
    ],
    e: "Hádka o knihu a usmíření jsou běžné události ze života dětí, bez kouzel a bez zvířecích hrdinů. Krátké vyprávění o nich je povídka.",
  },
  {
    q: "Ve kterém vyprávění dostane hrdina prsten, který splní tři přání?",
    a: "Pohádka",
    w: [
      ["Povídka", "Povídka připouští jen to, co se opravdu může stát — prsten plnící přání mezi to nepatří."],
      ["Bajka", "Bajka by potřebovala zvířecí hrdiny a poučení na konci, ne kouzelný prsten."],
      ["Báseň", "Báseň se pozná podle veršů a rýmu, ne podle kouzelných předmětů."],
    ],
    h: [
      "Prsten, který sám od sebe splní tři přání, je kouzelný předmět — a ten do skutečného světa nepatří.",
      "Povídka připouští jen předměty, které fungují jako doopravdy, takže prsten plnící přání v ní být nemůže. Bajka by potřebovala zvířecí hrdiny a poučení. Báseň se pozná podle veršů a rýmu. Zbývá útvar, ve kterém jsou kouzelné předměty úplně běžné.",
    ],
    e: "Prsten plnící přání je nadpřirozený předmět. Vyprávění, ve kterém takové předměty fungují, je pohádka.",
  },
];

// ── L2 — zařaď konkrétní ukázku ─────────────────────────────────────────────
const POOL_L2: Uloha[] = [
  {
    q: "Urči druh textu: „Za devatero řekami žil mlynář. Jednou večer u něj zaklepala víla a nabídla mu tři přání.“",
    a: "Pohádka",
    w: [
      ["Povídka", "Povídka vypráví jen to, co se opravdu může stát — víla nabízející tři přání mezi to nepatří."],
      ["Bajka", "Bajka by potřebovala zvířata jednající jako lidé a poučení na konci, v ukázce je víla a mlynář."],
      ["Báseň", "Báseň by byla zapsaná v krátkých rýmovaných verších, tahle ukázka je souvislé vyprávění."],
    ],
    h: [
      "Rozhoduj podle večerní návštěvy, která nabízí tři přání. Může se něco takového opravdu stát?",
      "Projdi ukázku dvakrát. Nejdřív hledej zvířata jednající jako lidé a poučení na konci — pak by šlo o bajku. Potom se podívej na zápis: kdyby byl v krátkých rýmovaných řádcích, byla by to báseň. Nakonec rozhodni mezi vyprávěním o skutečném světě, tedy povídkou, a vyprávěním, kde smí fungovat kouzla.",
    ],
    e: "V ukázce vystupuje víla a nabízí tři přání, což je nadpřirozená bytost a kouzelný děj. Takový text je pohádka, i když začíná docela obyčejně u mlynáře.",
  },
  {
    q: "Urči druh textu: „V pondělí ráno Aneta zaspala. Do školy běžela tak rychle, že si nechala aktovku na lavičce u zastávky.“",
    a: "Povídka",
    w: [
      ["Pohádka", "Pohádka by potřebovala kouzlo nebo nadpřirozenou bytost, v ukázce se nic takového neděje."],
      ["Bajka", "Bajka by místo Anety potřebovala zvířata jednající jako lidé a poučení na konci."],
      ["Báseň", "Báseň by byla zapsaná v krátkých rýmovaných verších, tady jdou věty souvisle za sebou."],
    ],
    h: [
      "Zaspat a nechat aktovku na lavičce — takové ráno zažil skoro každý. Kouzla v ukázce nehledej.",
      "Zeptej se postupně: vystupují tu nadpřirozené bytosti? Jednají tu zvířata jako lidé a končí text radou do života? Je text zapsaný v rýmovaných verších? Když na všechno odpovíš ne, zbývá vyprávění o obyčejném dni obyčejné holky.",
    ],
    e: "Zaspání a zapomenutá aktovka jsou běžné události, které se doopravdy stávají. Krátké vyprávění o takové příhodě je povídka.",
  },
  {
    q: "Urči druh textu: „Lev se chlubil, že uloví nejvíc zvěře. Pak sám spadl do sítě a tu mu potichu přehryzala myš. Ani malý pomocník se nemá podceňovat.“",
    a: "Bajka",
    w: [
      ["Pohádka", "Pohádka zvířecí postavy mít může, ale radu do života na konci povinně ne — tady rada je."],
      ["Povídka", "Povídka by musela zůstat u skutečných dějů, chlubící se lev mezi ně nepatří."],
      ["Báseň", "Báseň by byla zapsaná v krátkých rýmovaných verších, tahle ukázka je vyprávění ve větách."],
    ],
    h: [
      "Lev se chlubí a myš mu pomůže — obě zvířata jednají po lidsku. A všimni si poslední věty, ta už nic nevypráví.",
      "Poslední věta ukázky nepokračuje v ději, ale radí čtenáři, jak se chovat. Přidej k tomu zvířata, která se chlubí a pomáhají si jako lidé, a máš dvě podmínky splněné zároveň. Právě takové spojení má ze všech čtyř útvarů povinné jen jeden.",
    ],
    e: "Zvířata se chovají jako lidé a poslední věta je poučení pro čtenáře. Obě podmínky splněné najednou znamenají bajku.",
  },
  {
    q: "Urči druh textu: „Na zahradě kvete mák, / nad ním krouží starý pták.“",
    a: "Báseň",
    w: [
      ["Pohádka", "Pohádka by byla zapsaná ve větách a odstavcích a měla by kouzelné bytosti, tady je jen mák a pták."],
      ["Povídka", "Povídka se píše v souvislých větách bez rýmu, tahle ukázka je zapsaná do dvou krátkých řádků."],
      ["Bajka", "Bajka by potřebovala zvířata jednající jako lidé a poučení, pták tu jen krouží."],
    ],
    h: [
      "Podívej se, jak je ukázka zapsaná: dva krátké řádky a na jejich koncích „mák“ a „pták“.",
      "O zařazení tady nerozhoduje obsah, ale zápis. Text nepokračuje až k pravému okraji stránky, ale je rozdělený do dvou samostatných krátkých řádků, jejichž konce si zvukově odpovídají. Takový způsob zápisu má ze čtyř útvarů jediný.",
    ],
    e: "Ukázka je zapsaná do dvou krátkých rýmovaných řádků, tedy do veršů. Text psaný ve verších je báseň, i když vypráví jen o máku a ptákovi.",
  },
  {
    q: "Urči druh textu: „Chudý švec dostal od stařenky jehlu. Co s ní ušil, bylo do rána hotové a nikdy se to neroztrhlo.“",
    a: "Pohádka",
    w: [
      ["Povídka", "Povídka připouští jen běžné předměty, jehla šijící sama od sebe mezi ně nepatří."],
      ["Bajka", "Bajka by potřebovala zvířecí hrdiny a poučení na konci, tady šije obuvník."],
      ["Báseň", "Báseň by byla zapsaná v krátkých rýmovaných verších, tahle ukázka jsou souvislé věty."],
    ],
    h: [
      "Jehla, se kterou je práce hotová do rána a šev se nikdy neroztrhne, není obyčejná jehla.",
      "Začni od toho, co jehla umí: nic takového se v opravdovém světě stát nemůže, takže povídka odpadá. Zvířata, která by jednala jako lidé, ani rada do života v ukázce nejsou, takže odpadá i bajka. Zápis je ve větách, tedy nejde ani o verše.",
    ],
    e: "Jehla, která šije sama a jejíž šev se nikdy neroztrhne, je kouzelný předmět. Vyprávění s kouzelnými předměty je pohádka.",
  },
  {
    q: "Urči druh textu: „Táta s Kubou stavěli na zahradě budku pro ptáky. Kubovi spadlo kladivo na palec a zbytek odpoledne měl ruku v obvazu.“",
    a: "Povídka",
    w: [
      ["Pohádka", "Pohádka by potřebovala kouzlo nebo nadpřirozenou bytost, stavění budky žádné nemá."],
      ["Bajka", "Bajka by potřebovala zvířata jednající jako lidé, ptáci tu do budky teprve mají přiletět."],
      ["Báseň", "Báseň by byla zapsaná v krátkých rýmovaných verších, tady jsou souvislé věty."],
    ],
    h: [
      "Kladivo, které spadne na palec, a odpoledne s obvazem — nic z toho není kouzlo.",
      "Ptáci v ukázce sice jsou, ale nemluví a nejednají jako lidé, takže sama jejich přítomnost o bajku nestačí. Poučení na konci taky chybí. Zápis je ve větách a odstavcích, tedy ani verše. Zbývá vyprávění o obyčejném odpoledni na zahradě.",
    ],
    e: "Stavění budky i uhozený palec jsou obyčejné události, které se opravdu stávají. Krátké vyprávění o nich je povídka — přítomnost ptáků na tom nic nemění.",
  },
  {
    q: "Urči druh textu: „Mravenec nosil celé léto zásoby, cvrček jen hrál. V zimě cvrček hladověl. Kdo se v létě nepřipraví, ten v zimě strádá.“",
    a: "Bajka",
    w: [
      ["Pohádka", "Pohádka by nemusela končit radou do života, tady poslední věta radu dává."],
      ["Povídka", "Povídka by musela zůstat u skutečných dějů, hrající cvrček a zásobující se mravenec mezi ně nepatří."],
      ["Báseň", "Báseň by byla zapsaná v krátkých rýmovaných verších, tady jdou věty souvisle za sebou."],
    ],
    h: [
      "Mravenec se připravuje a cvrček hraje — jednají jako dva různí lidé. Přečti si znovu poslední větu.",
      "Poslední věta ukázky už nepatří k ději, ale říká čtenáři, jak se má chovat. Když se k takové radě přidají zvířata, která se chovají po lidsku, jsou splněné obě podmínky najednou. Ze čtyř útvarů je má obě povinné jen jeden.",
    ],
    e: "Zvířata jednají jako lidé a poslední věta je rada do života. Spojení obou znaků dělá z textu bajku.",
  },
  {
    q: "Urči druh textu: „Slunce vyšlo nad les, / rozespalý běží pes.“",
    a: "Báseň",
    w: [
      ["Pohádka", "Pohádka by se zapisovala do vět a odstavců, tady jsou dva samostatné krátké řádky."],
      ["Povídka", "Povídka se píše v souvislých větách bez rýmu, tahle ukázka rým na koncích řádků má."],
      ["Bajka", "Bajka by potřebovala zvíře jednající jako člověk a poučení, pes tu jen běží."],
    ],
    h: [
      "Ukázka má dva krátké řádky a na jejich koncích slova „les“ a „pes“, která znějí skoro stejně.",
      "Nedívej se na to, o čem text vypráví, ale jak je napsaný. Řádky nepokračují až k okraji stránky a jejich konce si zvukově odpovídají, takže jde o verše. Který ze čtyř útvarů se do veršů zapisuje?",
    ],
    e: "Dva krátké řádky s rýmem na koncích jsou verše, a text zapsaný ve verších je báseň. Nerozhoduje tu obsah, ale způsob zápisu.",
  },
  {
    q: "Urči druh textu: „Sedm bratrů zaklela macecha do podoby havranů. Sestra je vysvobodila, až když sedm let nepromluvila.“",
    a: "Pohádka",
    w: [
      ["Povídka", "Povídka by zůstala u skutečných dějů, proměna bratrů v ptáky mezi ně nepatří."],
      ["Bajka", "Bajka by potřebovala zvířata jednající jako lidé a poučení, tady jsou zaklení bratři."],
      ["Báseň", "Báseň by byla zapsaná v krátkých rýmovaných verších, tahle ukázka je vyprávění ve větách."],
    ],
    h: [
      "Bratři proměnění v ptáky a sedm let mlčení — to jsou děje, které se v opravdovém světě přihodit nemohou.",
      "Havrani v ukázce nejednají jako lidé, jsou to zakletí bratři, takže o bajku nejde. Poučení na konci chybí. Zápis je ve větách, tedy ani verše. Zbývá vyprávění, ve kterém smí fungovat zaklínadla a čáry.",
    ],
    e: "Zakletí bratrů do podoby ptáků a vysvobození mlčením jsou kouzelné děje. Vyprávění s kouzly je pohádka.",
  },
  {
    q: "Urči druh textu: „Na výletě začalo pršet. Celá třída se schovala pod přístřešek a paní učitelka rozdala svačiny dřív, než bylo v plánu.“",
    a: "Povídka",
    w: [
      ["Pohádka", "Pohádka by potřebovala kouzlo nebo nadpřirozenou bytost, déšť na výletě žádné není."],
      ["Bajka", "Bajka by potřebovala zvířata jednající jako lidé a poučení na konci, tady je třída a učitelka."],
      ["Báseň", "Báseň by byla zapsaná v krátkých rýmovaných verších, tady jsou souvislé věty."],
    ],
    h: [
      "Déšť na výletě a svačiny dřív, než bylo v plánu — takový výlet zažila skoro každá třída.",
      "Projdi znaky po řadě: žádná nadpřirozená bytost, žádné zvíře jednající jako člověk, žádná rada do života na konci a žádné rýmované verše. Zbývá jediný útvar, který si vystačí s obyčejnými lidmi a s tím, co se jim opravdu přihodí.",
    ],
    e: "Déšť, přístřešek i dřívější svačina jsou obyčejné události, které se doopravdy stávají. Krátké vyprávění o nich je povídka.",
  },
  {
    q: "Urči druh textu: „Vrána našla sýr. Liška ji tak dlouho chválila, jak krásně zpívá, až vrána otevřela zobák a sýr upustila. Lichotkám se nedá věřit.“",
    a: "Bajka",
    w: [
      ["Pohádka", "Pohádka radu čtenáři na konci připojovat nemusí, tady ale poslední věta radí."],
      ["Povídka", "Povídka připouští jen skutečné děje, a vypočítavě lichotící liška mezi ně nepatří."],
      ["Báseň", "Báseň by byla zapsaná v krátkých rýmovaných verších, tahle ukázka je vyprávění ve větách."],
    ],
    h: [
      "Liška tu chválí schválně, aby něco získala — to je lidská vypočítavost. A poslední věta už nevypráví, ale radí.",
      "Nejdřív si ověř, jak zvířata jednají: chválit někoho schválně, aby pustil jídlo, umí jen člověk. Potom se podívej na poslední větu, která z příběhu vyvozuje radu do života. Ze čtyř útvarů potřebuje obě tyhle věci najednou jen jeden.",
    ],
    e: "Liška i vrána jednají jako lidé a poslední věta je poučení. Spojení obou znaků znamená bajku.",
  },
  {
    q: "Urči druh textu: „Pod oknem roste vysoký bez, / za plotem šumí tichý les.“",
    a: "Báseň",
    w: [
      ["Pohádka", "Pohádka se zapisuje do vět a odstavců a má kouzelné bytosti, tady je jen keř a les."],
      ["Povídka", "Povídka se píše v souvislých větách, tahle ukázka je rozdělená do dvou krátkých rýmovaných řádků."],
      ["Bajka", "Bajka by potřebovala zvíře jednající jako člověk a poučení, tady nevystupuje ani jedno zvíře."],
    ],
    h: [
      "Ukázka je rozdělená na dva krátké řádky a jejich konce, „bez“ a „les“, znějí skoro stejně.",
      "Tady nerozhoduje, o čem se píše, ale jak je text zapsaný. Kdyby to byla próza, věty by pokračovaly až k pravému okraji stránky. Místo toho jsou tu dva samostatné krátké řádky se souznějícími konci, tedy verše.",
    ],
    e: "Dva krátké řádky se souznějícími konci jsou verše, a text ve verších je báseň. Obsah o keři a lese na tom nic nemění.",
  },
  {
    q: "Urči druh textu: „Dědeček učil Marii jezdit na kole. Spadla třikrát, ale počtvrté objela celé hřiště sama.“",
    a: "Povídka",
    w: [
      ["Pohádka", "Pohádka by potřebovala kouzlo nebo nadpřirozenou bytost, učení na kole žádné nemá."],
      ["Bajka", "Bajka by potřebovala zvířata jednající jako lidé a poučení na konci, tady je dědeček a Marie."],
      ["Báseň", "Báseň by byla zapsaná v krátkých rýmovaných verších, tady jdou věty souvisle za sebou."],
    ],
    h: [
      "Tři pády a počtvrté celé hřiště — přesně tak se učí na kole opravdové děti.",
      "V ukázce nenajdeš nic nadpřirozeného, žádné zvíře v lidské roli ani závěrečnou radu čtenáři, a text je zapsaný v souvislých větách, ne ve verších. Zbývá jediný útvar, který vypráví o tom, co se doopravdy může stát.",
    ],
    e: "Učení na kole i pády patří k obyčejnému životu, žádné kouzlo v ukázce není. Krátké vyprávění o skutečné události je povídka.",
  },
];

// ── L3 — dva znaky proti sobě, forma proti obsahu, inverze ──────────────────
const POOL_L3: Uloha[] = [
  {
    q: "Text se odehrává v dnešním městě a vypráví o lišce, která si u sousedů stěžuje na hluk. Žádná rada do života na konci není. Jaký útvar to nejspíš je?",
    a: "Pohádka",
    w: [
      ["Bajka", "Bajka musí končit poučením — a právě to v textu chybí, takže samotná mluvící liška nestačí."],
      ["Povídka", "Povídka připouští jen skutečné děje, ale liška, která si stěžuje sousedům, mezi ně nepatří."],
      ["Báseň", "Báseň by musela být zapsaná ve verších, tenhle text je souvislé vyprávění."],
    ],
    h: [
      "Rozhoduj ve dvou krocích: nejdřív podle chybějící rady na konci, teprve pak podle mluvící lišky.",
      "Chybějící rada na konci vyřadí bajku, i kdyby zvíře mluvilo sebevíc. Mluvící liška zase vyřadí povídku, protože ta smí vyprávět jen o tom, co se opravdu může stát. Verše v textu nejsou, takže odpadá i báseň. Zbude útvar, do kterého mluvící zvíře patří i bez poučení.",
    ],
    e: "Mluvící liška je nadpřirozený prvek, takže nejde o povídku. Bez poučení na konci to ale není ani bajka. Zbývá pohádka, které mluvící zvíře stačí a rada do života se po ní nevyžaduje.",
  },
  {
    q: "Text je zapsaný ve čtyřech krátkých rýmovaných řádcích a vypráví o princezně, kterou unesl drak. Jaký útvar to je?",
    a: "Báseň",
    w: [
      ["Pohádka", "Princezna a drak jsou sice pohádkové postavy, jenže text má jen čtyři rýmované řádky — na vyprávěnou pohádku to není."],
      ["Bajka", "Bajka by potřebovala zvířata jednající jako lidé a poučení na konci, drak unášející princeznu to není."],
      ["Povídka", "Povídka by musela vyprávět o skutečném ději v souvislých větách, tady chybí obojí."],
    ],
    h: [
      "Obsah a zápis si tu odporují. Zeptej se, co o útvaru rozhoduje dřív: postavy v textu, nebo způsob zápisu?",
      "Princezna s drakem svádějí k tomu zvolit útvar podle obsahu. Zkus to ale obráceně: stejný příběh se dá vyprávět v souvislých větách i zapsat do krátkých rýmovaných řádků. Rozhoduje proto zápis, ne to, kdo v příběhu vystupuje.",
    ],
    e: "Čtyři krátké rýmované řádky jsou verše, a takhle krátký text ve verších je báseň — i když si za postavy vzal princeznu a draka z pohádek.",
  },
  {
    q: "Který znak musí mít vyprávění navíc, aby se z příběhu se zvířaty stala bajka?",
    a: "Poučení pro čtenáře",
    w: [
      ["Kouzelný předmět", "Kouzelný předmět patří spíš do pohádky, o bajce nerozhoduje."],
      ["Rýmované verše", "Rýmované verše by z textu udělaly báseň, ne bajku."],
      ["Šťastná svatba", "Šťastná svatba bývá závěrem pohádky, ale bajku z vyprávění neudělá."],
    ],
    h: [
      "Zvířata už v příběhu jsou, chybí tedy ta druhá povinná podmínka. Co se přidává úplně nakonec?",
      "Kouzelný předmět ani rýmované verše z vyprávění bajku neudělají a šťastná svatba už vůbec ne. Přemýšlej, čím se bajka liší od pohádky se zvířecími postavami: musí čtenáři něco předat, nějakou radu do života, kterou si odnese domů.",
    ],
    e: "Zvířata jednající jako lidé má i pohádka. Bajku z vyprávění udělá až poučení na konci — krátká rada, jak se chovat.",
  },
  {
    q: "Dva texty vyprávějí totéž o mravenci a cvrčkovi. Jeden končí větou „Kdo se nepřipraví, ten strádá.“, druhý končí tím, že cvrček v zimě hladoví. Který z nich je bajka?",
    a: "Text s radou do života na konci",
    w: [
      ["Text bez rady na konci", "Tomuhle textu chybí poučení, takže zůstává jen příběhem se zvířaty."],
      ["Oba texty jsou bajky", "Oba nejsou — jeden z nich žádnou radu čtenáři nedává, a tím podmínku nesplní."],
      ["Ani jeden z textů není bajka", "Jeden z nich obě podmínky splňuje: zvířata jednají jako lidé a text končí radou."],
    ],
    h: [
      "Zvířata jsou v obou textech stejná, liší se jen poslední věta. Podle ní se tedy rozhodni.",
      "Když mají dva texty stejný děj i stejné postavy, musí rozdíl ležet jinde. Porovnej jejich konce: jeden končí uvnitř příběhu, druhý vystoupí z příběhu ven a promluví ke čtenáři. Právě tenhle krok ven dělá z vyprávění se zvířaty bajku.",
    ],
    e: "Oba texty mají zvířata jednající jako lidé, ale bajka potřebuje ještě poučení. Splní to jen text, který na konci radí čtenáři, jak se chovat.",
  },
  {
    q: "Pohádka o Popelce se přepíše do krátkých rýmovaných veršů, děj zůstane úplně stejný. Co o textu platí?",
    a: "Není už zapsaný v próze, ale ve verších — děj zůstal pohádkový",
    w: [
      ["Přestal být pohádkou, protože pohádky se nerýmují", "Pohádka se dá vyprávět i ve verších, veršovaných pohádek je celá řada — pohádkou být nepřestane."],
      ["Stala se z něj bajka", "Bajka by potřebovala zvířata jednající jako lidé a poučení na konci, Popelka nemá ani jedno."],
      ["Nezměnilo se nic, pořád je zapsaný v próze", "Próza jsou souvislé věty a odstavce, tady se ale text zlomil do krátkých rýmovaných řádků."],
    ],
    h: [
      "Rozhodni zvlášť o dvou věcech: co se přepisem změnilo na zápisu a co na ději.",
      "Představ si obě podoby vedle sebe. V jedné souvislé věty a odstavce, ve druhé krátké řádky se souznějícími konci — v tomhle je rozdíl. Příběh o Popelce, střevíčku a kouzlech je ale v obou podobách stejný, takže na obsahu se přepisem nezmění nic.",
    ],
    e: "Zápis a obsah jsou dvě různé věci. Přepisem se změnil jen zápis: z prózy se staly verše. Děj zůstal pohádkový, protože stejný příběh se dá vyprávět prózou i ve verších.",
  },
  {
    q: "Který útvar může mít mluvící zvíře, aniž by musel končit radou pro čtenáře?",
    a: "Pohádka",
    w: [
      ["Bajka", "Bajka bez rady pro čtenáře neexistuje — poučení je její povinná součást."],
      ["Povídka", "Povídka vypráví jen o tom, co se opravdu může stát, a mluvící zvíře mezi to nepatří."],
      ["Báseň", "Báseň se pozná podle zápisu ve verších, ne podle mluvících zvířat."],
    ],
    h: [
      "Hledáš útvar, kterému mluvící zvíře stačí a poučení po něm nikdo nevyžaduje.",
      "U bajky je rada pro čtenáře povinná, takže ta odpadá. Povídka mluvící zvíře vůbec nepřipustí, protože se drží skutečného světa. Báseň se pozná podle veršů, ne podle postav. Zbývá útvar, ve kterém mluvící zvířata běžně vystupují, ale nic se z nich vyvozovat nemusí.",
    ],
    e: "Mluvící zvíře je nadpřirozený prvek, a ten patří do pohádky. Na rozdíl od bajky po ní nikdo nechce, aby na konci radila čtenáři, jak se má chovat.",
  },
  {
    q: "V textu vystupují jen lidé, děj je docela obyčejný, ale text je zapsaný do čtyř krátkých řádků se souznějícími konci. Jaký útvar to je?",
    a: "Báseň",
    w: [
      ["Povídka", "Obyčejný děj by povídce seděl, jenže povídka se píše v souvislých větách, ne v rýmovaných řádcích."],
      ["Pohádka", "Pohádka by potřebovala kouzlo nebo nadpřirozenou bytost, tady vystupují jen lidé."],
      ["Bajka", "Bajka by potřebovala zvířata jednající jako lidé a poučení, ani jedno v textu není."],
    ],
    h: [
      "Obyčejný děj svádí k jinému útvaru, než napovídá zápis do čtyř krátkých řádků. Rozhodni podle zápisu.",
      "Tady je to obráceně než u pohádkového příběhu ve verších: obsah je úplně všední, ale forma zápisu básnická. Pravidlo přitom platí pořád stejně — o zařazení rozhoduje, jestli text tvoří souvislé věty, nebo krátké řádky se souznějícími konci.",
    ],
    e: "Text může vyprávět o nejobyčejnější věci na světě a přesto být básní. Rozhoduje zápis do veršů, ne to, jak neobvyklý je děj.",
  },
  {
    q: "Krátký příběh vypráví, jak pes vytáhl chlapce z rybníka. Pes celou dobu jen štěká, žádné kouzlo se nestane a rada pro čtenáře na konci chybí. Jaký útvar to je?",
    a: "Povídka",
    w: [
      ["Bajka", "Bajka by potřebovala zvíře jednající jako člověk a radu na konci, tenhle pes jen štěká."],
      ["Pohádka", "Pohádka by potřebovala kouzlo nebo nadpřirozenou bytost, záchrana z rybníka se stát doopravdy může."],
      ["Báseň", "Báseň by byla zapsaná ve verších, tenhle příběh je souvislé vyprávění."],
    ],
    h: [
      "Zvíře v příběhu je, ale nemluví ani nejedná po lidsku. Rozmysli si, co z toho plyne.",
      "Zvíře v ději samo o sobě o útvaru nerozhoduje. Zeptej se raději na dvě jiné věci: chová se pes jako člověk, nebo jako opravdový pes? A může se taková záchrana doopravdy stát? Když odpovíš „jako opravdový pes“ a „může“, zbývá jediný útvar.",
    ],
    e: "Pes se chová jako skutečný pes a záchrana z rybníka se opravdu může stát, takže nejde ani o bajku, ani o pohádku. Takový příběh je povídka — zvíře v ději na tom nic nemění.",
  },
  {
    q: "Bajka i pohádka mohou mít zvířecí postavy. Čím se od sebe s jistotou poznají?",
    a: "Jedna z nich musí končit poučením, druhá ne",
    w: [
      ["Jedna z nich je vždycky delší", "Délka nerozhoduje — obojí bývá krátké a stejně dlouhý text může být kterýkoli z nich."],
      ["Jedna z nich je psaná ve verších", "Ve verších se píše báseň, oba tyhle útvary se vyprávějí v souvislých větách."],
      ["Jedna z nich nesmí mít zvířata", "Zvířata smí mít oba útvary, právě proto se podle nich rozeznat nedají."],
    ],
    h: [
      "Zvířata mají oba útvary společná, takže rozdíl hledej jinde než u postav.",
      "Když se dva útvary shodují v jednom znaku, tenhle znak je od sebe odlišit neumí. Porovnej je proto na konci: u jednoho z nich je závěrečná rada čtenáři povinná, u druhého se nevyžaduje vůbec.",
    ],
    e: "Zvířecí postavy mají oba útvary, takže podle nich rozhodnout nejde. Rozhoduje až závěr: bajka musí končit poučením, pohádka ne.",
  },
  {
    q: "Jeden text má krátké rýmované řádky o cestě do školy, druhý souvislé věty o zakleté princezně. Který z nich je báseň?",
    a: "Text o cestě do školy",
    w: [
      ["Text o zakleté princezně", "Zakletá princezna je pohádkový obsah, jenže tenhle text je zapsaný v souvislých větách."],
      ["Oba texty jsou básně", "Oba nejsou — jeden z nich je psaný souvislými větami, a to verše nejsou."],
      ["Ani jeden z textů není báseň", "Jeden z nich je zapsaný do krátkých rýmovaných řádků, což verše jsou."],
    ],
    h: [
      "Pohádkový obsah svádí k tomu vybrat druhý text. Rozhodni ale podle zápisu, ne podle princezny.",
      "Porovnej oba texty jen podle toho, jak vypadají na stránce, a obsah zatím vůbec nesleduj. Jeden pokračuje souvislými větami až k pravému okraji, druhý je rozdělený do krátkých řádků, jejichž konce si zvukově odpovídají. Teprve tenhle rozdíl rozhoduje.",
    ],
    e: "Báseň se pozná podle zápisu do rýmovaných veršů, ne podle obsahu. Verše má text o cestě do školy, i když jeho děj je docela všední.",
  },
  {
    q: "Proč nestačí říct „vystupuje tam zvíře“, abychom text označili za bajku?",
    a: "Zvíře musí jednat jako člověk a text musí radit čtenáři",
    w: [
      ["Zvířata se v bajkách vůbec nevyskytují", "Naopak, zvířecí postavy jsou pro bajku typické — jenže samy o sobě nestačí."],
      ["Bajka musí být zapsaná ve verších", "Ve verších se zapisuje báseň, bajka se vypráví v souvislých větách."],
      ["Bajka musí mít vždycky šťastný konec", "Bajky často končí špatně pro toho, kdo chyboval, a přesto to bajky jsou."],
    ],
    h: [
      "Zvíře může v příběhu jen běhat po dvoře. Rozmysli si, co s ním musí být jinak a co musí být navíc.",
      "Rozděl si podmínku na dvě části. První se týká toho, jak se zvíře chová: běžný pes na dvoře nestačí, musí se chovat po lidsku. Druhá se týká konce textu: příběh musí ještě čtenáři něco poradit do života. Teprve obě části dohromady stačí.",
    ],
    e: "Pouhá přítomnost zvířete o útvaru nic neříká. Bajku poznáme až podle dvou podmínek naráz: zvíře jedná jako člověk a text končí radou pro čtenáře.",
  },
  {
    q: "Povídka a pohádka se obě vyprávějí v souvislých větách. Podle čeho je od sebe rozeznáš?",
    a: "Podle toho, jestli se děj může opravdu stát",
    w: [
      ["Podle délky textu", "Délka nerozhoduje — krátké i dlouhé texty najdeš u obou útvarů."],
      ["Podle počtu postav", "Počet postav nerozhoduje, oba útvary jich mohou mít málo i hodně."],
      ["Podle toho, jestli má text nadpis", "Nadpis mívá skoro každý text, takže od sebe tyhle dva útvary neodliší."],
    ],
    h: [
      "Zápis mají oba stejný, hledej tedy rozdíl v tom, co se v příběhu smí stát.",
      "Když se dva útvary shodují ve formě zápisu, musíš je rozlišit podle obsahu. Zeptej se u každého příběhu: mohl by se přesně takhle přihodit někomu ve tvém okolí? U jednoho z útvarů zní odpověď vždycky ano, u druhého se objeví kouzlo nebo nadpřirozená bytost.",
    ],
    e: "Oba útvary se zapisují stejně, takže forma nepomůže. Rozhoduje obsah: povídka vypráví jen o tom, co se opravdu může stát, pohádka smí přidat kouzla.",
  },
  {
    q: "Ve dvou ukázkách jednají zvířata jako lidé. V první se liška prochází kouzelným lesem a nic si z toho čtenář odnést nemá, ve druhé závodí zajíc s želvou a na konci stojí rada do života. Co platí?",
    a: "Druhá ukázka je bajka, první ne",
    w: [
      ["První ukázka je bajka, druhá ne", "Je to obráceně: rada do života stojí na konci druhé ukázky, ne první."],
      ["Obě ukázky jsou bajky", "Obě ne — první ukázka žádnou radu čtenáři nedává, a tím podmínku nesplní."],
      ["Ani jedna ukázka není bajka", "Jedna z nich splní obě podmínky: zvířata jednají jako lidé a text končí radou."],
    ],
    h: [
      "Zvířata jednající jako lidé mají obě ukázky. Porovnej je tedy podle toho, jak končí.",
      "První podmínku splňují obě ukázky stejně, takže podle ní rozhodnout nejde. Zbývá druhá podmínka, která se týká závěru: jedna ukázka končí uvnitř příběhu, druhá z příběhu vystoupí a promluví ke čtenáři. Teprve tenhle rozdíl rozhodne.",
    ],
    e: "Zvířata jednající jako lidé nestačí, obě ukázky je mají. Bajkou je jen ta ukázka, která navíc končí radou do života — tedy druhá.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).map(task);
}

export const POHADKAPOVIDKA: TopicMetadata[] = [
  {
    id: "g3-cjl-pohadka-povidka-basen-bajka",
    rvpNodeId: "g3-cjl-literarni-vychova-literarni-druhy-a-zanry-pohadka-povidka-basen-bajka",
    title: "Pohádka, povídka, báseň, bajka",
    studentTitle: "Druhy příběhů",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Literární druhy a žánry",
    briefDescription: "Poznáš rozdíl mezi pohádkou, povídkou, básní a bajkou.",
    keywords: ["pohádka", "povídka", "báseň", "bajka", "literární žánry", "nadpřirozené bytosti", "ponaučení"],
    goals: ["Rozlišit pohádku, povídku, báseň a bajku.", "Uvést typické znaky každého žánru.", "Přiřadit konkrétní text ke správnému žánru."],
    boundaries: ["Základní žánry pro 3. ročník."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Pohádka: nadpřirozené bytosti. Bajka: zvířata + ponaučení. Povídka: reálný život. Báseň: verše a rýmy.",
      steps: ["Přečti ukázku.", "Jsou tam bytosti jako víly, draci? → pohádka.", "Mluví zvířata a text má ponaučení? → bajka.", "Je to psáno ve verších? → báseň.", "Jinak: povídka."],
      commonMistake: "Příběh se zvířaty ≠ vždy bajka — bajka musí mít ponaučení.",
      example: "Liška a vrána (liška pochválí vránu, aby dostala sýr) = bajka. Ponaučení: Nenech se chytit na lichotky.",
    },
  },
];
