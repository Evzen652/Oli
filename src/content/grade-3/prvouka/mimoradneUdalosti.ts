import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─────────────────────────────────────────────────────────
// Disjunktní pooly obtížnosti (L1 < L2 < L3), select_one.
//   L1 = rozpoznání: izolovaná fakta (čísla, definice pojmů, signály)
//   L2 = aplikace:   konkrétní scénář → jedna správná reakce
//   L3 = transfer:   zdůvodnění, dvoukrokové uvažování, miskoncepce a pasti
// Fakt-check dle metodiky HZS ČR: 150 hasiči, 155 zdrav. záchranná služba,
//   158 policie, 112 jednotné evropské číslo. Zkouška sirén = rovný
//   (nepřerušovaný) tón, každou 1. středu v měsíci ve 12 h. Varovný signál
//   „Všeobecná výstraha" = kolísavý tón 140 s.
// ─────────────────────────────────────────────────────────

const POOL_L1: PracticeTask[] = [
  {
    question: "Které tísňové číslo patří hasičům?",
    correctAnswer: "150",
    options: ["150", "155", "158", "112"],
    hints: [
      "Hasiči hasí oheň. Jejich číslo je první z české tísňové trojice.",
      "Nejde o záchrannou službu (sanitku) ani o policii.",
    ],
    explanation: "Hasiči mají číslo 150. Zapamatuj si celou trojici: 150 hasiči (oheň), 155 záchranná služba (nemoc a úraz), 158 policie (zločin). Navíc 112 je jednotná evropská tísňová linka.",
  },
  {
    question: "Které tísňové číslo patří záchranné službě (sanitce)?",
    correctAnswer: "155",
    options: ["150", "155", "158", "112"],
    hints: [
      "Záchranná služba přijíždí k lidem, kterým je špatně nebo se zranili.",
      "Není to číslo hasičů ani policie.",
    ],
    explanation: "Záchranná služba má číslo 155. Jezdí k lidem, kteří jsou zranění, náhle onemocněli nebo jsou v ohrožení života. Pamatuj: 150 hasiči, 155 záchranka, 158 policie, 112 vše v Evropě.",
  },
  {
    question: "Které tísňové číslo patří policii?",
    correctAnswer: "158",
    options: ["150", "155", "158", "112"],
    hints: [
      "Policie řeší krádeže, nehody a jiné trestné činy.",
      "Není to číslo hasičů ani sanitky.",
    ],
    explanation: "Policie má číslo 158. Voláme ji, když se stane krádež, napadení nebo dopravní nehoda. Pamatuj: 150 hasiči, 155 záchranka, 158 policie, 112 evropská tísňová linka.",
  },
  {
    question: "Které jediné tísňové číslo funguje ve všech zemích Evropské unie?",
    correctAnswer: "112",
    options: ["150", "155", "158", "112"],
    hints: [
      "Použiješ ho i na dovolené v cizině, i když nemáš kredit.",
      "Ostatní tři čísla platí hlavně v Česku.",
    ],
    explanation: "Číslo 112 je jednotná evropská tísňová linka. Funguje ve všech zemích EU i bez kreditu a bez SIM karty. Operátor tě přepojí k hasičům, záchranářům nebo policii.",
  },
  {
    question: "Koho přivoláš, když vytočíš 150?",
    correctAnswer: "hasiče",
    options: ["hasiče", "záchrannou službu", "policii", "opraváře plynu"],
    hints: [
      "Toto číslo voláš, když někde hoří.",
      "Přijedou lidé s hadicemi a vodou.",
    ],
    explanation: "Číslo 150 patří hasičům. Přijedou s vodou a speciálním vybavením k požárům, ale i k nehodám a k vyprošťování lidí.",
  },
  {
    question: "Co znamená pojem „místo srazu“ při požáru?",
    correctAnswer: "předem dohodnuté místo venku, kde se všichni sejdou po opuštění budovy",
    options: ["místo, kde je uschovaná voda na hašení", "předem dohodnuté místo venku, kde se všichni sejdou po opuštění budovy", "místo, odkud se vždy volá na tísňovou linku", "místnost, do které se při požáru všichni schovají"],
    hints: [
      "Slouží k tomu, aby se zjistilo, kdo už je venku a kdo možná zůstal uvnitř.",
      "Domlouvá se dopředu, ještě než se něco stane.",
    ],
    explanation: "Místo srazu je předem dohodnuté místo venku (třeba roh ulice nebo strom v parku), kde se po opuštění hořící budovy sejdou všichni lidé. Hasiči tak hned poznají, jestli někdo uvízl uvnitř.",
  },
  {
    question: "Co je stabilizovaná (zotavovací) poloha?",
    correctAnswer: "poloha na boku, do které uložíme člověka v bezvědomí, který sám dýchá",
    options: ["poloha vsedě pro člověka, kterého bolí hlava", "poloha na zádech s nohama nahoře pro odpočinek", "poloha na boku, do které uložíme člověka v bezvědomí, který sám dýchá", "poloha vestoje s oporou o zeď"],
    hints: [
      "Zamysli se nad situací, kdy někdo nereaguje na oslovení, ale hrudník se mu stále zvedá.",
      "Na které straně těla nemůže jazyk ani zvratky ucpat cestu vzduchu?",
    ],
    explanation: "Stabilizovaná poloha je poloha na boku s mírně zakloněnou hlavou. Uložíme do ní člověka v bezvědomí, který sám dýchá — na boku mu jazyk ani zvratky neucpou dýchací cesty.",
  },
  {
    question: "Kdy se koná pravidelná zkouška sirén?",
    correctAnswer: "každou první středu v měsíci ve 12 hodin",
    options: ["každé ráno v 7 hodin", "první pondělí v měsíci o půlnoci", "jen na Nový rok", "každou první středu v měsíci ve 12 hodin"],
    hints: [
      "Koná se jednou za měsíc, vždy v poledne.",
      "Připadá na jeden konkrétní den v týdnu na začátku měsíce.",
    ],
    explanation: "Zkouška sirén se koná každou první středu v měsíci ve 12:00. Jde jen o ověření, že sirény fungují — nic se neděje.",
  },
  {
    question: "Jaký zvuk vydává siréna při pravidelné zkoušce?",
    correctAnswer: "rovný, nepřerušovaný tón",
    options: [
      "rovný, nepřerušovaný tón",
      "kolísavý tón, který sílí a slábne",
      "krátká rychlá pípnutí",
      "zvonění jako budík",
    ],
    hints: [
      "Zkušební tón se nemění — zní pořád stejně.",
      "Skutečné varování naopak kolísá.",
    ],
    explanation: "Zkouška sirén má rovný, nepřerušovaný tón, který se nemění. Naopak kolísavý tón (sílí a slábne) je skutečné varování před nebezpečím.",
  },
  {
    question: "V jaké situaci voláš záchrannou službu na čísle 155?",
    correctAnswer: "když je někdo zraněný nebo náhle onemocněl",
    options: ["když v lese vypukl požár", "když je někdo zraněný nebo náhle onemocněl", "když někdo ukradl kolo", "když ti doma nejde internet"],
    hints: [
      "Toto číslo vytáčíš kvůli zdraví člověka.",
      "Nejde o oheň ani o krádež.",
    ],
    explanation: "Záchrannou službu (155) voláš, když je někdo zraněný, náhle onemocněl nebo je v ohrožení života. K požáru voláš hasiče (150), ke krádeži policii (158).",
  },
  {
    question: "V jaké situaci voláš hasiče na čísle 150?",
    correctAnswer: "když někde hoří nebo hrozí požár",
    options: ["když tě bolí v krku", "když ztratíš klíče od domu", "když někde hoří nebo hrozí požár", "když se pohádáš s kamarádem"],
    hints: [
      "Toto číslo souvisí s ohněm a kouřem.",
      "Nemoc ani ztracená věc sem nepatří.",
    ],
    explanation: "Hasiče (150) voláš, když někde hoří nebo požár teprve hrozí — třeba když cítíš kouř. K nemoci nebo úrazu voláš záchranku (155).",
  },
  {
    question: "Které tři informace potřebuje dispečink slyšet při každém tísňovém volání?",
    correctAnswer: "kde jsem, co se stalo a kolik je zraněných",
    options: ["jak se jmenuji, kolik mi je let a do jaké chodím školy", "kolik je hodin a jaké je počasí", "jaké mám telefonní číslo a číslo pojišťovny", "kde jsem, co se stalo a kolik je zraněných"],
    hints: [
      "Nejdůležitější je, aby záchranáři věděli, kam mají jet.",
      "Zapamatuj si tři slova: KDE, CO, KOLIK.",
    ],
    explanation: "Dispečinku vždy řekni tři věci: KDE jsi (adresa nebo popis místa), CO se stalo a KOLIK je zraněných. Bez místa nemůžou záchranáři přijet.",
  },
  {
    question: "Jaký zvuk vydává siréna, když skutečně varuje před nebezpečím?",
    correctAnswer: "kolísavý tón, který střídavě sílí a slábne",
    options: [
      "kolísavý tón, který střídavě sílí a slábne",
      "rovný tón, který zní pořád stejně",
      "krátké tiché cinknutí",
      "melodie jako z písničky",
    ],
    hints: [
      "Varovný tón se mění — houká nahoru a dolů.",
      "Rovný neměnný tón je naopak jen zkouška.",
    ],
    explanation: "Skutečné varování (Všeobecná výstraha) je kolísavý tón, který sílí a slábne, a trvá asi 140 sekund. Rovný nepřerušovaný tón je jen měsíční zkouška.",
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Hoří byt u sousedů v paneláku a valí se z něj kouř. Které číslo vytočíš?",
    correctAnswer: "150",
    options: ["155", "150", "158", "156"],
    hints: [
      "Rozhoduje to, co se děje — tady jde o oheň.",
      "Potřebuješ ty, kdo umí hasit.",
    ],
    explanation: "Při požáru voláš hasiče na čísle 150. Můžeš vytočit i 112, kde tě přepojí. Nejdřív ale odejdi do bezpečí a teprve pak volej.",
  },
  {
    question: "Saháš na dveře a jsou horké, kolem rámu se plazí kouř. Co uděláš?",
    correctAnswer: "dveře neotevřu a hledám jiný únikový východ",
    options: ["otevřu je dokořán, ať se místnost vyvětrá", "otevřu je jen kousek a podívám se dovnitř", "dveře neotevřu a hledám jiný únikový východ", "opřu se do nich a proběhnu skrz"],
    hints: [
      "Horko na dveřích prozrazuje, co je za nimi.",
      "Přísun vzduchu by ohni jen pomohl.",
    ],
    explanation: "Horké dveře nebo kouř kolem rámu znamenají oheň na druhé straně. Neotvírej je — vzduch by plameny rozdmýchal a kouř by tě omámil. Hledej jiný východ.",
  },
  {
    question: "V zakouřené chodbě se snažíš dostat ven. Jak se pohybuješ?",
    correctAnswer: "plazím se nízko u podlahy a ústa si zakryju tričkem",
    options: ["běžím vzpřímeně co nejrychleji", "vylezu si na skříň, co nejvýš to jde", "lehnu si a počkám, až kouř zmizí", "plazím se nízko u podlahy a ústa si zakryju tričkem"],
    hints: [
      "Kde v zakouřené místnosti zůstává vzduch, který se dá dýchat?",
      "Nahoře u stropu je kouře nejvíc.",
    ],
    explanation: "Kouř stoupá ke stropu, u podlahy zůstává vzduch s kyslíkem. Proto se plaz, zakryj si nos a ústa a co nejrychleji miř k východu.",
  },
  {
    question: "Řeka se vylévá z břehů a ty bydlíš v přízemí. Co uděláš nejdřív?",
    correctAnswer: "přesunu se do vyššího patra nebo na jiné bezpečné vyvýšené místo",
    options: [
      "přesunu se do vyššího patra nebo na jiné bezpečné vyvýšené místo",
      "zůstanu v přízemí a sleduji, jak voda stoupá",
      "seběhnu do sklepa pro důležité věci",
      "půjdu ven k řece se podívat, jak je vysoko",
    ],
    hints: [
      "Voda stoupá odspodu — kde jí unikneš?",
      "Sklep a přízemí zaplaví jako první.",
    ],
    explanation: "Při povodni voda rychle stoupá. Přesuň se do vyššího patra nebo na vyvýšené místo. Nikdy nezůstávej v přízemí ani ve sklepě — ty zaplaví nejdřív.",
  },
  {
    question: "Voláš na tísňovou linku. Kterou informaci musíš říct úplně jako první?",
    correctAnswer: "kde jsem — adresu nebo popis místa",
    options: ["jak se jmenuji", "kde jsem — adresu nebo popis místa", "kolik mi je let", "jaké mám doma zvíře"],
    hints: [
      "Bez této informace za tebou pomoc nemůže vyrazit.",
      "Napověz orientační body — ulici, číslo domu, blízké hřiště nebo obchod.",
    ],
    explanation: "Nejdůležitější je říct, KDE jsi. Bez adresy nebo popisu místa nemůžou záchranáři přijet. Teprve pak řekni, co se stalo a kolik je zraněných.",
  },
  {
    question: "Kamarád na hřišti náhle omdlel a nereaguje. Které číslo vytočíš?",
    correctAnswer: "155",
    options: ["150", "158", "155", "156"],
    hints: [
      "Jde o zdraví člověka, ne o oheň ani o zločin.",
      "Přijet má sanitka se záchranáři.",
    ],
    explanation: "Když je někdo zraněný nebo v bezvědomí, voláš záchrannou službu 155 (nebo 112). Řekni, kde jste, co se stalo a že kamarád nereaguje.",
  },
  {
    question: "Vidíš, jak cizí člověk páčí dveře zaparkovaného auta a bere z něj věci. Které číslo vytočíš?",
    correctAnswer: "158",
    options: ["150", "155", "112", "158"],
    hints: [
      "Děje se něco protiprávního — krádež.",
      "Nejde o oheň ani o zraněného člověka.",
    ],
    explanation: "Krádež nebo jiný zločin hlásíš policii na čísle 158. Sám nezasahuj — jen si zapamatuj, jak zloděj vypadal, a řekni to policii.",
  },
  {
    question: "Siréna houká tónem, který sílí a slábne, sílí a slábne. Co to znamená a co uděláš?",
    correctAnswer: "je to varování — jdu dovnitř a zapnu rádio nebo televizi",
    options: [
      "je to varování — jdu dovnitř a zapnu rádio nebo televizi",
      "je to jen zkouška — nemusím dělat nic",
      "je to signál k přestávce ve škole",
      "je to hlášení o počasí — jdu ven se podívat",
    ],
    hints: [
      "Kolísavý tón (nahoru–dolů) není obyčejná zkouška.",
      "Po varování se hledají další pokyny ve vysílání.",
    ],
    explanation: "Kolísavý tón je skutečné varování. Okamžitě jdi do nejbližší budovy, zavři okna a dveře a zapni rádio nebo televizi, kde se dozvíš, co se děje a co dělat.",
  },
  {
    question: "Utíkáš z hořícího domu ven. Na co nesmíš zapomenout?",
    correctAnswer: "jít na dohodnuté místo srazu a nevracet se dovnitř",
    options: ["vzít si s sebou všechny hračky", "jít na dohodnuté místo srazu a nevracet se dovnitř", "vrátit se pro nabíječku k telefonu", "schovat se pod postel a počkat tam"],
    hints: [
      "Věci se dají nahradit — na čem záleží nejvíc?",
      "Hasiči potřebují vědět, kdo je už venku.",
    ],
    explanation: "Z hořícího domu odejdi rychle a nic neber. Sejdi se s ostatními na dohodnutém místě srazu, aby hasiči věděli, že jsi venku. Nikdy se nevracej dovnitř.",
  },
  {
    question: "Jsi s rodiči na dovolené v Itálii a stane se vážná nehoda. Které číslo zavoláš?",
    correctAnswer: "112",
    options: ["150", "155", "112", "158"],
    hints: [
      "Česká čísla v cizině nemusí fungovat.",
      "Existuje jedno číslo pro celou Evropu.",
    ],
    explanation: "V zahraničí voláš evropskou tísňovou linku 112. Funguje po celé EU a operátor rozumí i česky nebo anglicky. Přepojí tě tam, kde je pomoc potřeba.",
  },
  {
    question: "Ulicí se po povodni valí voda. Kamarád navrhuje, ať ji přebrodíte. Co uděláš?",
    correctAnswer: "do vody nevstoupím a najdu vyšší suchou cestu",
    options: ["vejdu do vody, vypadá jen po kotníky", "půjdu první, ať to kamarád vidí", "přeskákám po viditelných kamenech", "do vody nevstoupím a najdu vyšší suchou cestu"],
    hints: [
      "Zaplavená ulice vypadá klidně, ale proud je silný.",
      "Pod hladinou nevidíš, co tam je.",
    ],
    explanation: "Do zaplavené ulice nikdy nevstupuj. I mělká rychlá voda může dítě strhnout a pod hladinou bývají otevřené kanály a předměty. Hledej vyšší suchou cestu.",
  },
  {
    question: "Doma v noci ucítíš kouř. Co uděláš jako první?",
    correctAnswer: "vzbudím ostatní a rychle jdeme společně ven",
    options: [
      "vzbudím ostatní a rychle jdeme společně ven",
      "dokoukám pohádku a pak se podívám",
      "schovám se pod deku a počkám do rána",
      "otevřu okno a jdu zase spát",
    ],
    hints: [
      "Kouř v noci je vážné nebezpečí — čas hraje roli.",
      "Nikoho nenech spát, hlavně se dostaňte ven.",
    ],
    explanation: "Kouř v noci znamená možný požár. Hned vzbuď ostatní, společně odejděte ven a teprve venku volejte 150. Kouř omámí spícího člověka velmi rychle.",
  },
  {
    question: "Po povodni máš žízeň a z kohoutku teče voda. Co uděláš?",
    correctAnswer: "napiju se jen balené vody nebo počkám, až dospělí řeknou, že je bezpečná",
    options: ["napiju se z kohoutku, voda přece teče", "napiju se jen balené vody nebo počkám, až dospělí řeknou, že je bezpečná", "naberu si vodu z kaluže na dvoře", "napiju se ze studny za domem"],
    hints: [
      "Povodňová voda se dostane i do potrubí a studní.",
      "Bezpečná je jen voda, o které to jistě víš.",
    ],
    explanation: "Po povodni může být voda z kohoutku i ze studny znečištěná. Pij jen balenou vodu nebo takovou, o které dospělí vědí, že je nezávadná.",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Zaplavená ulice vypadá klidně a voda sahá jen po kotníky. Proč je i tak nebezpečné do ní vejít?",
    correctAnswer: "proud může strhnout i dítě a pod vodou nevidíš otevřené kanály a předměty",
    options: ["voda je studená a mohl bys dostat rýmu", "namočil by sis boty a byly by špinavé", "proud může strhnout i dítě a pod vodou nevidíš otevřené kanály a předměty", "voda by ti mohla zničit hodinky"],
    hints: [
      "Přemýšlej o dvou skrytých nebezpečích najednou: síla proudu a to, co nevidíš.",
      "Klidná hladina ještě neznamená, že je pod ní bezpečno.",
    ],
    explanation: "I mělká, ale rychlá voda dokáže dítě porazit a odnést. Navíc pod kalnou hladinou nevidíš otevřené kanály, díry nebo popadané kabely. Proto do zaplavené ulice nikdy nevstupuj.",
  },
  {
    question: "Proč se po povodni nesmí pít voda z kohoutku ani ze studny v zatopené oblasti?",
    correctAnswer: "povodeň smíchá vodu s kanalizací a chemikáliemi, takže může být jedovatá",
    options: ["voda je po povodni jen příliš studená", "voda by měla nezvyklou chuť, jinak nevadí", "je to zbytečné varování, voda je v pořádku", "povodeň smíchá vodu s kanalizací a chemikáliemi, takže může být jedovatá"],
    hints: [
      "Kam všude se povodňová voda dostane, než doteče k tobě?",
      "Smíchá se s věcmi, které do pitné vody nepatří.",
    ],
    explanation: "Povodeň zaplaví kanalizaci, sklepy i skládky a špinavá voda pronikne do potrubí i do studní. Bakterie a chemikálie v ní můžou způsobit vážnou nemoc, proto ji nepij.",
  },
  {
    question: "Najdeš člověka v bezvědomí a vidíš, že klidně a pravidelně dýchá. Co je správné udělat?",
    correctAnswer: "uložit ho do stabilizované polohy na bok a přivolat pomoc",
    options: [
      "uložit ho do stabilizované polohy na bok a přivolat pomoc",
      "nechat ho ležet na zádech a odejít pryč",
      "posadit ho a dát mu napít vody",
      "zkusit ho probudit tím, že s ním zatřeseš",
    ],
    hints: [
      "Když člověk sám dýchá, jde hlavně o to, aby se nezadusil.",
      "Na které straně těla mu jazyk ani zvratky neucpou dýchání?",
    ],
    explanation: "Když je člověk v bezvědomí, ale sám dýchá, ulož ho na bok do stabilizované polohy a přivolej pomoc (155). Na boku mu jazyk ani zvratky neucpou dýchací cesty.",
  },
  {
    question: "Člověk je v bezvědomí a NEdýchá. Je správné dát ho do stabilizované polohy na bok?",
    correctAnswer: "ne — hned volám 155 a řídím se pokyny záchranáře",
    options: ["ano, poloha na boku pomůže vždy", "ne — hned volám 155 a řídím se pokyny záchranáře", "ano, ale nejdřív mu dám napít", "ne, počkám, jestli se sám neprobere"],
    hints: [
      "Stabilizovaná poloha pomáhá jen tomu, kdo sám dýchá.",
      "Když člověk nedýchá, je každá vteřina důležitá — kdo poradí přesně?",
    ],
    explanation: "Stabilizovaná poloha se používá jen u člověka, který sám dýchá. Když nedýchá, je to ohrožení života — okamžitě volej 155 nebo 112 a přesně dělej to, co ti záchranář řekne.",
  },
  {
    question: "Při požáru někdo navrhne otevřít všechna okna, ať kouř odejde. Proč je to špatný nápad?",
    correctAnswer: "čerstvý vzduch oheň rozdmýchá a plameny zesílí",
    options: ["oknem by mohla přiletět moucha", "průvan by rozházel papíry po pokoji", "čerstvý vzduch oheň rozdmýchá a plameny zesílí", "otevřít okno je při požáru vždy správné"],
    hints: [
      "Co potřebuje oheň, aby hořel víc? Zamysli se nad vzduchem.",
      "Přivést k ohni vzduch není totéž jako ho zahnat.",
    ],
    explanation: "Oheň ke svému hoření potřebuje vzduch. Otevřením oken bys mu ho dodal a plameny by zesílily. Při požáru okna i dveře do hořící místnosti spíš zavírej.",
  },
  {
    question: "V kuchyni začne hořet hrnec a zároveň babička upadla a nemůže vstát. Které volání přivolá pomoc nejrychleji?",
    correctAnswer: "112 — jedním voláním přivolám pomoc k požáru i ke zraněné babičce",
    options: ["zavolám jen 150 a o babičce se nezmíním", "zavolám jen 155 a hořící hrnec nechám být", "nevolám nikam, zvládnu obojí sám", "112 — jedním voláním přivolám pomoc k požáru i ke zraněné babičce"],
    hints: [
      "Děje se víc věcí najednou — potřebuješ hasiče i záchranku.",
      "Které jediné číslo umí přivolat všechny složky zároveň?",
    ],
    explanation: "Když se děje víc věcí najednou (oheň i zraněný člověk), zavolej 112. Operátor pošle hasiče i záchrannou službu podle toho, co mu popíšeš. Nejdřív ale odejdi do bezpečí.",
  },
  {
    question: "Venku zazní kolísavý tón sirény. Jaké je správné pořadí toho, co uděláš?",
    correctAnswer: "jdu do budovy → zavřu okna a dveře → zapnu rádio nebo televizi",
    options: [
      "jdu do budovy → zavřu okna a dveře → zapnu rádio nebo televizi",
      "zůstanu venku a natáčím, co se děje",
      "otevřu okna dokořán a vykláním se ven",
      "utíkám co nejdál od domu do polí",
    ],
    hints: [
      "Nejdřív se dostaň do bezpečí, teprve pak hledej informace.",
      "Okna se při varování zavírají, ne otevírají.",
    ],
    explanation: "Při varovném (kolísavém) tónu jdi nejdřív do nejbližší budovy, zavři okna a dveře a pak zapni rádio nebo televizi. Tam se dozvíš, co se stalo a co dělat dál.",
  },
  {
    question: "Právě jsi utekl z hořícího bytu, ale uvědomíš si, že tam zůstal tvůj telefon. Vrátíš se pro něj?",
    correctAnswer: "ne — věci se dají nahradit a kouř omámí během chvilky; řeknu to hasičům",
    options: ["ano, telefon je drahý, rychle si pro něj doběhnu", "ne — věci se dají nahradit a kouř omámí během chvilky; řeknu to hasičům", "ano, ale nejdřív se nadechnu a zadržím dech", "pošlu pro něj mladšího sourozence"],
    hints: [
      "Co je cennější — věc, nebo tvoje bezpečí?",
      "Kouř dokáže omámit rychleji, než stihneš doběhnout zpět.",
    ],
    explanation: "Do hořící budovy se nikdy nevracej, ani pro cenné věci. Kouř omámí člověka během několika nádechů. Věci se nahradí — hasičům jen řekni, co a kde zůstalo.",
  },
  {
    question: "Voláš 155, už jsi řekl, co se stalo, ale operátor se pořád ptá. Kdy hovor ukončíš?",
    correctAnswer: "až když to řekne operátor — nikdy nezavěšuji první",
    options: ["hned, jak řeknu, co se stalo", "když mě otázky začnou unavovat", "až když to řekne operátor — nikdy nezavěšuji první", "jakmile uslyším v dálce sanitku"],
    hints: [
      "Operátor se ptá dál, protože potřebuje víc informací.",
      "Rozhoduje ten, kdo řídí pomoc na druhé straně.",
    ],
    explanation: "Při tísňovém volání nezavěšuj první. Operátor se ptá, aby přesně věděl, koho a s čím poslat, a může ti radit, co dělat. Hovor ukonči, teprve až to řekne on.",
  },
  {
    question: "Jaký je rozdíl mezi rovným a kolísavým tónem sirény?",
    correctAnswer: "rovný tón je jen zkouška, kolísavý tón je skutečné varování",
    options: ["rovný tón je varování, kolísavý tón je zkouška", "oba tóny znamenají to samé", "rovný tón hlásí počasí, kolísavý začátek školy", "rovný tón je jen zkouška, kolísavý tón je skutečné varování"],
    hints: [
      "Spoj si dohromady dvě věci: který tón znamená klid a který nebezpečí.",
      "Neměnný zvuk = běžná měsíční zkouška.",
    ],
    explanation: "Rovný nepřerušovaný tón je pravidelná zkouška — nic se neděje. Kolísavý tón, který sílí a slábne, je skutečné varování: jdi dovnitř a zapni rádio nebo televizi.",
  },
  {
    question: "Blíží se povodeň a máš ještě čas, než voda dorazí. Co je nejrozumnější udělat?",
    correctAnswer: "s dospělými připravit potřebné věci a přejít na vyvýšené místo, dokud je čas",
    options: [
      "s dospělými připravit potřebné věci a přejít na vyvýšené místo, dokud je čas",
      "počkat, až voda opravdu přijde, a teprve pak něco řešit",
      "jít se dívat k řece, jak rychle stoupá",
      "nedělat nic, ono to určitě přejde samo",
    ],
    hints: [
      "Čas navíc se vyplatí využít, ne promarnit.",
      "Bezpečněji je odejít dřív než na poslední chvíli.",
    ],
    explanation: "Když je čas, využij ho: s dospělými připrav nejnutnější věci a doklady a včas se přesuň na vyvýšené bezpečné místo. Čekat na poslední chvíli je nebezpečné, protože voda stoupá rychle.",
  },
  {
    question: "Proč se při požáru plazíš u země místo toho, abys běžel vzpřímeně?",
    correctAnswer: "horký a jedovatý kouř stoupá ke stropu, u podlahy zůstává vzduch s kyslíkem",
    options: ["u podlahy se běží rychleji než vestoje", "horký a jedovatý kouř stoupá ke stropu, u podlahy zůstává vzduch s kyslíkem", "aby tě přes kouř nebylo vidět", "protože vestoje bys uklouzl"],
    hints: [
      "Kam se v místnosti hromadí kouř — nahoru, nebo dolů?",
      "Kde se dá líp dýchat — dole při zemi, nebo nahoře?",
    ],
    explanation: "Horký kouř plný jedovatých látek stoupá ke stropu. U podlahy proto zůstává chladnější vzduch s kyslíkem. Když se plazíš, dýcháš čistší vzduch a lépe vidíš cestu ven.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool);
}

export const MIMORADNEUDALOSTI: TopicMetadata[] = [
  {
    id: "g3-prvouka-clovek-a-jeho-zdravi-bezpecnost-a-prvni-pomoc-mimoradne-udalosti-pozar-povoden-chovani-pri-ohrozeni",
    rvpNodeId: "g3-prvouka-clovek-a-jeho-zdravi-bezpecnost-a-prvni-pomoc-mimoradne-udalosti-pozar-povoden-chovani-pri-ohrozeni",
    title: "Mimořádné události — požár, povodeň",
    studentTitle: "Bezpečnost a záchrana",
    subject: "prvouka",
    category: "Člověk a jeho zdraví",
    topic: "Bezpečnost a první pomoc",
    briefDescription: "Víš, jak se zachovat při požáru, povodni nebo jiném ohrožení.",
    keywords: [
      "požár",
      "povodeň",
      "hasiči",
      "150",
      "155",
      "158",
      "112",
      "siréna",
      "evakuace",
      "místo srazu",
      "stabilizovaná poloha",
      "tísňová čísla",
      "záchranná služba",
      "nebezpečí",
      "mimořádná událost",
    ],
    goals: [
      "Znát tísňová čísla 150, 155, 158 a 112 a vědět, kdy každé z nich použít.",
      "Vědět, co dělat při požáru — nekoukat, plazit se, místo srazu.",
      "Vědět, co dělat při povodni — přesun do výšky, nešlapat do vody.",
      "Vědět, co říct záchranářům při tísňovém volání.",
      "Rozumět signálům sirény a znát stabilizovanou polohu.",
    ],
    boundaries: [
      "Bez děsivých nebo traumatizujících popisů katastrof.",
      "Základní pravidla chování při mimořádných událostech, přiměřená věku 8–9 let.",
    ],
    gradeRange: [3, 3],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 8,
    generator: gen,
    helpTemplate: {
      hint: "150 = hasiči, 155 = záchranná služba, 158 = policie, 112 = evropská tísňová linka. Při požáru: plaz se, neotvírej teplé dveře, jdi na místo srazu. Při povodni: jdi do výšky, nestoupej do vody.",
      steps: [
        "Tísňová čísla: 150 hasiči, 155 záchranka, 158 policie, 112 vše v Evropě.",
        "Požár: neotvírej teplé dveře, plaz se nízko, odejdi na místo srazu.",
        "Povodeň: přejdi do vyšších pater, nestoupej do zaplavené ulice, nepij zatopenou vodu.",
        "Volání záchranářů: řekni KDE jsi, CO se stalo, KOLIK je zraněných.",
        "Siréna — rovný tón: zkouška (1. středa v měsíci v 12h). Kolísavý tón: skutečné varování.",
      ],
      commonMistake: "Záměna 150 (hasiči) a 155 (záchranná služba). Hasiči hasí oheň, záchranná služba jezdí k zraněným a nemocným.",
      example: "Hoří v kuchyni → volej 150 (hasiči). Soused omdlel → volej 155 (záchranná služba). Jsi v zahraničí a stane se nehoda → volej 112.",
    },
  },
];
