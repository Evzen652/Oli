import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL: PracticeTask[] = [
  {
    question: "Hoří dům od sousedů. Jaké číslo zavoláš jako první?",
    correctAnswer: "150 — hasiči",
    options: ["150 — hasiči", "155 — záchranná služba", "158 — policie", "112 — tísňová linka"],
    hints: [
      "Jde o požár — potřebujeme ty, kdo hasí oheň.",
      "Hasiči mají číslo 150.",
    ],
    explanation: "Při požáru voláme hasiče na čísle 150. Hasiči přijedou s vodou a speciálním vybavením. Na čísle 112 tě přepojí také, ale přímo na hasiče se dovoláš číslem 150.",
  },
  {
    question: "Jdeš k dveřím a cítíš, že jsou teplé nebo z nich vychází kouř. Co uděláš?",
    correctAnswer: "Neotevřu dveře — za nimi může být oheň nebo kouř",
    options: [
      "Neotevřu dveře — za nimi může být oheň nebo kouř",
      "Otevřu dveře dokořán, ať se vyvětrá",
      "Zavolám kamaráda, ať to zkusí on",
      "Otevřu jen trošku, abych se podíval",
    ],
    hints: [
      "Teplo na dveřích = oheň nebo silný kouř na druhé straně.",
      "Otevřením dveří by se oheň rozšířil a kouř by tě mohl omráčit.",
    ],
    explanation: "Teplé dveře nebo kouř kolem rámu znamenají, že za dveřmi hoří nebo je hustý kouř. Nikdy je neotvírej — přísun vzduchu by oheň rozfoukal. Hledej jiný únikový východ.",
  },
  {
    question: "V budově je hodně kouře a musíš se dostat ven. Jak se pohybuješ?",
    correctAnswer: "Plazím se nízko u podlahy, kde je čistší vzduch",
    options: [
      "Plazím se nízko u podlahy, kde je čistší vzduch",
      "Běžím co nejrychleji vzpřímeně",
      "Stoupnu si na stůl — kouř stoupá nahoru",
      "Lehnu si a počkám na hasiče",
    ],
    hints: [
      "Kouř je lehčí než vzduch — kde se hromadí?",
      "U podlahy je vždy více kyslíku než u stropu.",
    ],
    explanation: "Kouř stoupá nahoru. U podlahy zůstává více čistého vzduchu. Při úniku z zakouřené místnosti se plaz, zakryj si nos a ústa třeba tričkem, a co nejrychleji se pohybuj k východu.",
  },
  {
    question: "Při požáru se setkáváme se slovem 'místo srazu'. Co to znamená?",
    correctAnswer: "Předem dohodnuté místo, kde se všichni sejdou po opuštění budovy",
    options: [
      "Předem dohodnuté místo, kde se všichni sejdou po opuštění budovy",
      "Místo, kde čekají hasiči",
      "Místo, kde je schovaná voda na hašení",
      "Místo, odkud se volá 150",
    ],
    hints: [
      "Je důležité, aby hasiči věděli, kdo z budovy vyšel a kdo chybí.",
      "Místo srazu se dohodne předem — například roh ulice nebo park.",
    ],
    explanation: "Místo srazu je pevně dohodnuté místo (např. roh ulice nebo strom v parku), kde se sejdou všichni lidé po opuštění budovy při požáru. Hasiči tak poznají, zda někdo zůstal uvnitř.",
  },
  {
    question: "Začíná povodeň. Bydlíš v přízemí. Co uděláš?",
    correctAnswer: "Přejdu do vyšších pater nebo na bezpečnější místo",
    options: [
      "Přejdu do vyšších pater nebo na bezpečnější místo",
      "Zůstanu v přízemí a sleduji, jak voda stoupá",
      "Otevřu okna, ať voda rychleji proteče",
      "Půjdu ven a podívám se na řeku",
    ],
    hints: [
      "Voda teče dolů a stoupá od nejnižšího místa.",
      "Vyšší podlaží jsou mimo dosah zaplavení.",
    ],
    explanation: "Při povodni voda rychle stoupá. Přesun do vyšších pater nebo na vyvýšené místo tě ochrání. Nikdy nezůstávej v přízemí nebo suterénu — voda může stoupnout velmi rychle.",
  },
  {
    question: "Ulice je zaplavená. Proč je nebezpečné do ní vstupovat?",
    correctAnswer: "Proud vody může strhnout i člověka, a pod vodou mohou být nebezpečné předměty",
    options: [
      "Proud vody může strhnout i člověka, a pod vodou mohou být nebezpečné předměty",
      "Voda je studená a mohl bys dostat rýmu",
      "Boty by se znečistily",
      "Je to zakázáno zákonem",
    ],
    hints: [
      "Zaplavená ulice vypadá klidně, ale proud je silný.",
      "Pod vodou nevidíš — mohou tam být otevřené kanály, díry nebo popadané kabely.",
    ],
    explanation: "Zaplavená ulice je velmi nebezpečná. I 30 cm rychlé vody může srazit dítě. Pod hladinou jsou neviditelné otevřené šachty, popadané větve nebo elektrické kabely. Nikdy do zaplavené ulice nevstupuj.",
  },
  {
    question: "Při povodni nesmíme pít vodu z kohoutku ani ze studní v postižené oblasti. Proč?",
    correctAnswer: "Povodeň znečistí vodovodní potrubí i studny — voda může být jedovatá",
    options: [
      "Povodeň znečistí vodovodní potrubí i studny — voda může být jedovatá",
      "Voda je příliš studená",
      "Voda bude mít špatnou chuť",
      "Je to jen zbytečné varování",
    ],
    hints: [
      "Povodňová voda se smísí s kanalizací, chemikáliemi a bahnem.",
      "Znečištěná voda může způsobit vážné onemocnění.",
    ],
    explanation: "Povodňová voda přináší bakterie, chemikálie a nečistoty z kanalizace. Ty se dostanou do vodovodního potrubí i studní. Taková voda může způsobit vážnou nemoc. Pij jen balenou vodu nebo vodu, o které dospělí vědí, že je bezpečná.",
  },
  {
    question: "Co musíš říct záchranářům jako první, když voláš tísňové číslo?",
    correctAnswer: "Kde jsem — adresu nebo popis místa",
    options: [
      "Kde jsem — adresu nebo popis místa",
      "Jak se jmenuji",
      "Kolik mi je let",
      "Jaké mám telefonní číslo",
    ],
    hints: [
      "Záchranáři musí vědět, kam jet — bez adresy nemohou pomoci.",
      "Řekni ulici, číslo domu nebo popis místa (park, hřiště, u obchodu).",
    ],
    explanation: "Nejdůležitější informace pro záchranáře je, KDE jsi. Bez adresy nebo popisu místa nemohou přijet. Pak jim řekni co se stalo a kolik je zraněných. Mluv zřetelně a počkej, až záchranář zavěsí.",
  },
  {
    question: "Záchranář tě při volání 155 požádá o informace. Co mu máš říct?",
    correctAnswer: "Kde jsme, co se stalo a kolik je zraněných",
    options: [
      "Kde jsme, co se stalo a kolik je zraněných",
      "Jen jméno a příjmení zraněného",
      "Jen číslo pojišťovny",
      "Jen kolik je hodin",
    ],
    hints: [
      "Záchranáři potřebují tři věci: místo, událost, počet zraněných.",
      "Pamatuj: KDE, CO, KOLIK.",
    ],
    explanation: "Záchranářům řekni: 1) KDE jsi (adresa nebo popis), 2) CO se stalo (nehoda, úraz, mdloby), 3) KOLIK je zraněných. Zůstaň v klidu, mluv pomalu a čekej na jejich pokyny.",
  },
  {
    question: "Uslyšíš sirénu, která vydává nepřetržitý (rovný) tón 2 minuty. Co to znamená?",
    correctAnswer: "Zkouška sirén — každou první středu v měsíci ve 12 hodin",
    options: [
      "Zkouška sirén — každou první středu v měsíci ve 12 hodin",
      "Varování před povodní",
      "Varování před požárem",
      "Výzva k evakuaci",
    ],
    hints: [
      "Pravidelná zkouška se koná každý měsíc — slouží jen k ověření, že sirény fungují.",
      "Rovný (nepřerušovaný) tón = zkouška.",
    ],
    explanation: "Nepřetržitý tón sirény trvající 140 sekund je pravidelná zkouška. Koná se každou první středu v měsíci v 12:00. Nic to neznamená — jen se ověřuje, že sirény fungují. Přerušovaný tón naopak znamená skutečné varování.",
  },
  {
    question: "Siréna vydává přerušovaný tón — chvíli zní, pak je ticho, pak zase zní. Co to znamená?",
    correctAnswer: "Skutečné varování před nebezpečím — jdi dovnitř a zapni rádio nebo televizi",
    options: [
      "Skutečné varování před nebezpečím — jdi dovnitř a zapni rádio nebo televizi",
      "Zkouška sirén jako každý měsíc",
      "Signál pro školní přestávku",
      "Oznámení o počasí",
    ],
    hints: [
      "Přerušovaný tón (tón — ticho — tón) znamená skutečné nebezpečí.",
      "Po varování jdi ihned do budovy a počkej na pokyny v rádiu nebo televizi.",
    ],
    explanation: "Přerušovaný tón sirény (střídá se zvuk a ticho) je skutečné varování. Okamžitě jdi do nejbližší budovy, zavři okna a dveře a zapni rádio nebo televizi, kde se dozvíš, co se děje a co máš dělat.",
  },
  {
    question: "Co je to stabilizovaná poloha a kdy ji použijeme?",
    correctAnswer: "Poloha na boku pro bezvědomého člověka, který dýchá — zabrání zadušení",
    options: [
      "Poloha na boku pro bezvědomého člověka, který dýchá — zabrání zadušení",
      "Poloha vsedě pro člověka s bolestí hlavy",
      "Poloha na zádech pro odpočinek",
      "Stoj na jedné noze pro zraněnou kotník",
    ],
    hints: [
      "Bezvědomý člověk může mít problémy s dýcháním, pokud leží na zádech.",
      "Stabilizovaná poloha = na boku, hlava mírně zakloněná.",
    ],
    explanation: "Stabilizovaná (zotavovací) poloha se používá u bezvědomého člověka, který stále dýchá. Uložíme ho na bok, hlavu mírně zakloníme. Tím zabrání zvratky nebo jazyk, aby zablokoval dýchací cesty.",
  },
  {
    question: "Číslo 155 patří záchranné službě. Kdy ji zavoláme?",
    correctAnswer: "Když je někdo zraněný, nemocný nebo v ohrožení života",
    options: [
      "Když je někdo zraněný, nemocný nebo v ohrožení života",
      "Když hoří les",
      "Když se ztratíme v lese",
      "Když se rozbije výloha obchodu",
    ],
    hints: [
      "Záchranná služba = lékaři a záchranáři v sanitce.",
      "Poranění, mdloby, vážná nemoc = záchranná služba.",
    ],
    explanation: "Záchranná služba (155) přijíždí k lidem, kteří jsou zraněni, náhle onemocněli nebo jsou v ohrožení života. Hasiče (150) voláme při požáru nebo nehodě, policii (158) při trestné činnosti.",
  },
  {
    question: "Jaké je jediné tísňové číslo, které funguje ve všech zemích Evropské unie?",
    correctAnswer: "112",
    options: ["112", "150", "155", "158"],
    hints: [
      "Toto číslo funguje v celé Evropě — použiješ ho třeba na dovolené v zahraničí.",
      "Je to číslo, které lze volat i bez SIM karty nebo kreditu.",
    ],
    explanation: "Číslo 112 je jednotná evropská tísňová linka. Funguje ve všech zemích EU, v Česku i v zahraničí, i bez kreditu a SIM karty. Operátor tě přepojí tam, kde potřebuješ pomoc — k hasičům, záchranářům nebo policii.",
  },
  {
    question: "Při požáru v budově musíš vyběhnout ven. Na co nesmíš zapomenout?",
    correctAnswer: "Jít na předem dohodnuté místo srazu a nepouštět se zpět dovnitř",
    options: [
      "Jít na předem dohodnuté místo srazu a nepouštět se zpět dovnitř",
      "Vzít si všechny hračky a oblečení",
      "Zůstat uvnitř a čekat, až hasiči přijdou za mnou",
      "Schovat se pod postelí",
    ],
    hints: [
      "Věci se dají nahradit, život ne — nic si nebereš.",
      "Místo srazu pomáhá hasičům vědět, kdo je v bezpečí.",
    ],
    explanation: "Při úniku z hořící budovy neber nic s sebou — jen odejdi rychle ven. Na místě srazu se sejde celá rodina nebo třída, hasiči tak snadno zjistí, zda někdo uvízl uvnitř. Nikdy se nevracej pro věci.",
  },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 12);
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
        "Siréna — rovný tón: zkouška (1. středa v měsíci v 12h). Přerušovaný tón: skutečné varování.",
      ],
      commonMistake: "Záměna 150 (hasiči) a 155 (záchranná služba). Hasiči hasí oheň, záchranná služba jezdí k zraněným a nemocným.",
      example: "Hoří v kuchyni → volej 150 (hasiči). Soused omdlel → volej 155 (záchranná služba). Jsi v zahraničí a stane se nehoda → volej 112.",
    },
  },
];
