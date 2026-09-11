import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 4. ročníku). Z původního poolu vypadla
// vymyšlená „pověst“ o drakovi u hory Říp (taková pověst neexistuje),
// otázky na román (hranice tématu román vylučují) a málo známí autoři
// a bajky (Krylov, „Moucha a vůz“). Klíče byly často dvakrát delší než
// distraktory, takže se daly uhodnout bez čtení.
//
// L1 = znaky žánrů a známé příklady · L2 = urči žánr z ukázky
// L3 = hraniční případy (mluvící zvíře v pohádce, skutečná osoba s kouzlem),
//      ponaučení bajky, co do vlastního příběhu patří.

type Zanr = "pohádka" | "pověst" | "bajka" | "povídka";
const ZANRY: Zanr[] = ["pohádka", "pověst", "bajka", "povídka"];

function zanr(q: string, klic: Zanr, proc: Record<string, string>, hints: [string, string], explanation: string): PracticeTask {
  const spatne = ZANRY.filter((z) => z !== klic).map((z) => ({ value: z, why: proc[z] })) as [
    { value: string; why: string }, { value: string; why: string }, { value: string; why: string },
  ];
  return choice(q, klic, spatne, { hints, explanation });
}

const L1: PracticeTask[] = [
  zanr("Ve kterém druhu příběhu jednají zvířata jako lidé a na konci je ponaučení?", "bajka", {
    pohádka: "V pohádce mohou být kouzla i mluvící zvířata, ale ponaučení na konci být nemusí.",
    pověst: "Pověst se váže ke skutečnému místu nebo osobě.",
    povídka: "Povídka vypráví o obyčejných lidech, zvířata v ní nemluví.",
  }, ["Který druh příběhu končí větou, co si z něj máme vzít?", "Liška, vrána, mravenec… jednají jako lidé a příběh končí mravní myšlenkou. Tak vypadají příběhy starého řeckého vypravěče Ezopa."],
  "Bajka je krátký příběh, ve kterém zvířata jednají jako lidé, a končí ponaučením."),
  zanr("Ve kterém druhu příběhu vystupují víly, draci a kouzla?", "pohádka", {
    pověst: "Pověst sice někdy má kouzelné prvky, ale váže se ke skutečnému místu či osobě.",
    bajka: "V bajce jednají zvířata a jde o ponaučení, ne o víly a draky.",
    povídka: "Povídka je o obyčejném životě, kouzla v ní nejsou.",
  }, ["Který příběh je celý vymyšlený a plný kouzel?", "Draci, víly, čarodějnice a kouzelné předměty patří do světa, který si někdo celý vymyslel. Takové příběhy začínají třeba „Byl jednou jeden…“."],
  "Víly, draci a kouzla patří do pohádky — příběhu, který je celý vymyšlený."),
  zanr("Který druh příběhu vychází ze skutečného místa, osoby nebo události?", "pověst", {
    pohádka: "Pohádka je celá vymyšlená, žádné skutečné místo nepotřebuje.",
    bajka: "Bajka je o zvířatech a ponaučení, ne o skutečném místě.",
    povídka: "Povídka je o obyčejném životě, ale nevychází ze známé dávné události nebo místa.",
  }, ["Který příběh by ti mohl vyprávět průvodce na hradě?", "Tyhle příběhy se vyprávějí o skutečném hradu, hoře nebo panovníkovi, jen si k nim lidé přidali neskutečné věci."],
  "Pověst vychází ze skutečného místa, osoby nebo události, i když k nim lidé přidali něco neskutečného."),
  zanr("Který druh příběhu vypráví o obyčejných lidech a o tom, co se mohlo opravdu stát?", "povídka", {
    pohádka: "Pohádka má kouzla a nadpřirozené bytosti.",
    pověst: "Pověst se váže ke známému místu nebo dávné události a mívá neskutečné prvky.",
    bajka: "Bajka má zvířata jednající jako lidé a ponaučení.",
  }, ["Který příběh by se mohl stát tobě nebo tvým spolužákům?", "Bez kouzel, bez mluvících zvířat, bez dávné historie — jen obyčejní lidé a běžné události. Takový krátký příběh má svůj název."],
  "Povídka je kratší příběh o obyčejných lidech a o tom, co se mohlo opravdu stát."),
  choice("Kterými slovy často začíná pohádka?", "Byl jednou jeden král…", [
    { value: "V roce 1348 založil král…", why: "Přesný letopočet ukazuje na skutečnou událost — spíš pověst nebo dějepis." },
    { value: "Liška jednou potkala vránu…", why: "Liška a vrána jsou postavy bajky." },
    { value: "Včera jsem šla ze školy…", why: "Tak začíná vyprávění ze skutečného života." },
  ], {
    hints: ["Který začátek nám hned řekne, že příběh je vymyšlený?", "Pohádky nepotřebují přesné datum ani skutečné místo. Začínají neurčitě — kdysi dávno, nevíme kde."],
    explanation: "„Byl jednou jeden…“ je typický začátek pohádky — neříká přesně kdy ani kde, protože příběh je vymyšlený.",
  }),
  choice("Kdo sepsal Staré pověsti české?", "Alois Jirásek", [
    { value: "Ezop", why: "Ezop byl starořecký vypravěč bajek." },
    { value: "Karel Jaromír Erben", why: "Erben sbíral hlavně pohádky a psal balady (Kytice)." },
    { value: "Božena Němcová", why: "Němcová je známá hlavně pohádkami a Babičkou." },
  ], {
    hints: ["Autor Starých pověstí českých je český spisovatel. Který z nich psal o praotci Čechovi a Libuši?", "Ezop je starý Řek a psal bajky, Erben a Němcová sbírali hlavně pohádky. Zbývá ten, kdo převyprávěl příběhy o praotci Čechovi, Libuši a Blanických rytířích."],
    explanation: "Staré pověsti české (o praotci Čechovi, Libuši, Blanických rytířích…) sepsal Alois Jirásek.",
  }),
  zanr("Ezop je známý vypravěč…", "bajka", {
    pohádka: "Pohádky sbírali třeba Němcová a Erben.",
    pověst: "České pověsti sepsal Alois Jirásek.",
    povídka: "Ezop nepsal o obyčejných lidech, ale o zvířatech s ponaučením.",
  }, ["Ezop vyprávěl o lišce a hroznech nebo o mravenci a cvrčkovi. Co je to za příběhy?", "Jeho příběhy jsou krátké, jednají v nich zvířata, která se chovají jako lidé, a každý příběh končí větou, co si z něj máme vzít."],
  "Ezop je starořecký vypravěč bajek — krátkých příběhů o zvířatech s ponaučením."),
  choice("Jak končí většina pohádek?", "dobro zvítězí nad zlem", [
    { value: "ponaučením pro čtenáře", why: "Ponaučením končí bajka." },
    { value: "vždycky smutně", why: "Pohádky naopak většinou končí dobře." },
    { value: "přesným datem události", why: "Pohádka žádné přesné datum nemá." },
  ], {
    hints: ["Co se v pohádce nakonec stane s drakem, čarodějnicí a hrdinou?", "V pohádce hodní hrdinové překonají zlé postavy. Říká se tomu šťastný konec."],
    explanation: "V pohádce nakonec dobro zvítězí nad zlem — hrdina porazí draka, zlá postava je potrestána.",
  }),
  choice("Co je ponaučení v bajce?", "myšlenka, co si z příběhu vzít", [
    { value: "první věta bajky", why: "Ponaučení je na konci, ne na začátku." },
    { value: "název bajky", why: "Název jen říká, o čem bajka je." },
    { value: "jméno autora", why: "Jméno autora ponaučení není." },
  ], {
    hints: ["Proč Ezop své bajky vůbec vyprávěl?", "Bajka chce čtenáře něčemu naučit. Na konci to řekne jednou větou — třeba „Pýcha předchází pád“."],
    explanation: "Ponaučení je myšlenka na konci bajky, co si máme z příběhu vzít pro vlastní život.",
  }),
  zanr("Příběh o praotci Čechovi, který přivedl svůj lid k hoře Říp, je…", "pověst", {
    pohádka: "Hora Říp je skutečné místo, proto nejde o vymyšlenou pohádku.",
    bajka: "Nejsou tu zvířata s ponaučením.",
    povídka: "Nejde o obyčejný příběh ze života, ale o vyprávění o počátcích národa.",
  }, ["Je hora Říp skutečná?", "Příběh se váže ke skutečnému místu a vypráví o počátcích našeho národa. Sepsal ho Alois Jirásek."],
  "Příběh o praotci Čechovi se váže ke skutečné hoře Říp a k počátkům národa — je to pověst."),
  zanr("Popelka je…", "pohádka", {
    pověst: "Popelka se neváže ke skutečnému místu ani osobě.",
    bajka: "V Popelce nejde o zvířata s ponaučením.",
    povídka: "V Popelce jsou kouzla (oříšky, šaty), povídka kouzla nemá.",
  }, ["Co dostala Popelka v oříšcích?", "Kouzelné šaty, princ a šťastný konec — to všechno je znak jednoho druhu příběhu."],
  "Popelka má kouzla a šťastný konec — je to pohádka."),
  zanr("Liška a čáp (od Ezopa) je…", "bajka", {
    pohádka: "Nejsou tu kouzla ani nadpřirozené bytosti a příběh končí ponaučením.",
    pověst: "Příběh se neváže ke skutečnému místu.",
    povídka: "Zvířata tu jednají jako lidé, v povídce ne.",
  }, ["Kdo tu jedná — lidé, nebo zvířata? A kdo příběh vyprávěl?", "Liška a čáp se chovají jako lidé, příběh vymyslel Ezop a končí ponaučením."],
  "Liška a čáp je Ezopova bajka — zvířata jednají jako lidé a příběh končí ponaučením."),
  choice("Která čísla se v pohádkách často opakují?", "tři, sedm, devět", [
    { value: "dva, čtyři, šest", why: "Tato čísla v pohádkách nijak zvláštní nejsou." },
    { value: "jedna, deset, sto", why: "Sto let spí Šípková Růženka, ale typická trojice čísel je jiná." },
    { value: "pět, osm, dvanáct", why: "Tato čísla v pohádkách opakovaně nenajdeš." },
  ], {
    hints: ["Vzpomeň si: kolik sester, kolik trpaslíků, za kolika horami?", "Tři sudičky, sedm trpaslíků, za devatero horami — pohádková čísla se opakují stále dokola."],
    explanation: "V pohádkách se opakují čísla tři, sedm a devět (tři sudičky, sedm trpaslíků, za devatero horami).",
  }),
];

const L2: PracticeTask[] = [
  zanr("Urči druh příběhu: „Za devatero horami a devatero řekami žila princezna, kterou hlídal drak.“", "pohádka", {
    pověst: "Místo „za devatero horami“ není skutečné — pověst by jmenovala hrad nebo horu.",
    bajka: "Není tu zvíře, které by nás mělo něčemu naučit.",
    povídka: "Drak a kouzelný svět do povídky nepatří.",
  }, ["Existuje místo „za devatero horami“?", "Vymyšlené místo, princezna a drak — takhle začínají příběhy, ve kterých nakonec dobro zvítězí."],
  "Vymyšlené místo „za devatero horami“ a drak jsou znaky pohádky."),
  zanr("Urči druh příběhu: „Když se liška nemohla dostat k hroznům, řekla: Stejně jsou kyselé.“", "bajka", {
    pohádka: "Liška tu nic nečaruje, příběh směřuje k ponaučení.",
    pověst: "Příběh se neváže ke skutečnému místu.",
    povídka: "V povídce zvířata nemluví.",
  }, ["Kdo tu mluví jako člověk a co nás to má naučit?", "Liška se vymlouvá, protože hrozny nemůže dostat. Příběh ukazuje lidskou vlastnost na zvířeti — typicky pro Ezopa."],
  "Liška jedná jako člověk a příběh ukazuje lidskou vlastnost — je to bajka."),
  zanr("Urči druh příběhu: „V hoře Blaník spí rytíři, kteří přijdou zemi na pomoc, až jí bude nejhůř.“", "pověst", {
    pohádka: "Blaník je skutečná hora, pohádka skutečné místo nepotřebuje.",
    bajka: "Nejsou tu zvířata s ponaučením.",
    povídka: "Spící rytíři v hoře nejsou obyčejná událost ze života.",
  }, ["Je hora Blaník skutečná?", "Příběh o skutečné hoře s neskutečnými rytíři uvnitř — takové vyprávění se předává po generace."],
  "Skutečná hora Blaník a neskuteční rytíři — to je pověst."),
  zanr("Urči druh příběhu: „Ondra celé odpoledne trénoval na kole, až konečně bez pomoci objel hřiště.“", "povídka", {
    pohádka: "Nejsou tu kouzla ani nadpřirozené bytosti.",
    pověst: "Příběh se neváže ke známému místu nebo dávné události.",
    bajka: "Nevystupují tu zvířata a není tu ponaučení.",
  }, ["Mohlo by se to stát i tobě?", "Obyčejný kluk, obyčejné kolo, žádná kouzla ani zvířata — takový krátký příběh ze života má svůj název."],
  "Obyčejná událost ze života bez kouzel — to je povídka."),
  choice("V Červené Karkulce mluví vlk. Je to tedy bajka?", "ne, je to pohádka", [
    { value: "ano, protože zvíře mluví", why: "Mluvící zvíře samo nestačí — bajka potřebuje hlavně ponaučení." },
    { value: "ano, protože je krátká", why: "Délka o druhu příběhu nerozhoduje." },
    { value: "ne, je to pověst", why: "Karkulka se neváže ke skutečnému místu." },
  ], {
    hints: ["Končí Karkulka ponaučením, nebo tím, že myslivec zachrání babičku?", "Mluvící zvíře najdeš v bajce i v pohádce. Rozhoduje, jestli jde o kouzelný příběh se šťastným koncem, nebo o ponaučení."],
    explanation: "Mluvící vlk nestačí. Karkulka je pohádka — má šťastný konec a nejde v ní o ponaučení jako v bajce.",
  }),
  zanr("Urči druh příběhu: „Pražský orloj postavil mistr Hanuš. Konšelé ho pak oslepili, aby jinde nepostavil lepší.“", "pověst", {
    pohádka: "Orloj v Praze je skutečný, pohádka skutečné místo nepotřebuje.",
    bajka: "Nejsou tu zvířata s ponaučením.",
    povídka: "Nejde o obyčejnou událost dneška, ale o dávné vyprávění o skutečné stavbě.",
  }, ["Stojí pražský orloj opravdu?", "Příběh o skutečné stavbě, ke které si lidé přidali neuvěřitelné podrobnosti, je druh vyprávění o minulosti."],
  "Vyprávění o skutečném pražském orloji s přidanými neuvěřitelnými podrobnostmi je pověst."),
  zanr("Urči druh příběhu: „Mravenec celé léto pracoval, cvrček jen zpíval. V zimě cvrček neměl co jíst.“", "bajka", {
    pohádka: "Nejsou tu kouzla, příběh má poučit.",
    pověst: "Příběh se neváže ke skutečnému místu.",
    povídka: "V povídce zvířata nejednají jako lidé.",
  }, ["Co nás má příběh o mravenci a cvrčkovi naučit?", "Zvířata tu jednají jako lidé — jeden pracuje, druhý ne — a konec ukazuje, co z toho plyne."],
  "Zvířata jednají jako lidé a příběh vede k ponaučení o práci — je to bajka."),
  zanr("Urči druh příběhu: „Honza šel do světa a potkal dědečka, který mu dal kouzelnou píšťalku.“", "pohádka", {
    pověst: "Příběh se neváže ke skutečnému místu ani osobě.",
    bajka: "Nejsou tu zvířata s ponaučením.",
    povídka: "Kouzelná píšťalka do povídky nepatří.",
  }, ["Může být píšťalka kouzelná doopravdy?", "Honza, cesta do světa a kouzelný dárek — typické prvky vymyšlených příběhů se šťastným koncem."],
  "Kouzelná píšťalka a Honza jdoucí do světa jsou znaky pohádky."),
  zanr("Urči druh příběhu: „Kníže Oldřich se vracel z lovu a u studánky uviděl krásnou Boženu.“", "pověst", {
    pohádka: "Kníže Oldřich byl skutečný panovník, pohádka by měla vymyšlené postavy.",
    bajka: "Nejsou tu zvířata s ponaučením.",
    povídka: "Nejde o obyčejný příběh dneška, ale o vyprávění o skutečném knížeti.",
  }, ["Byl kníže Oldřich skutečný panovník?", "Vyprávění o skutečném panovníkovi z dávné doby se předává po generace — sepsal ho i Alois Jirásek."],
  "Vyprávění o skutečném knížeti Oldřichovi je pověst."),
  zanr("Urči druh příběhu: „Eliška se bála prvního dne v nové škole, ale spolužačka Marie jí ukázala celou budovu.“", "povídka", {
    pohádka: "Nejsou tu kouzla ani nadpřirozené bytosti.",
    pověst: "Nejde o známé místo ani dávnou událost.",
    bajka: "Nevystupují tu zvířata s ponaučením.",
  }, ["Mohlo se to stát doopravdy?", "Nová škola, strach a kamarádka — obyčejná událost ze života bez kouzel a bez zvířat."],
  "Obyčejná událost ze školy bez kouzel je povídka."),
  choice("Čím se liší pověst od pohádky?", "pověst se váže ke skutečnému místu", [
    { value: "pověst je vždycky veselá", why: "Pověsti bývají i smutné (mistr Hanuš)." },
    { value: "pověst má vždy zvířata", why: "Zvířata jednající jako lidé jsou typická pro bajku." },
    { value: "pověst nemá žádné postavy", why: "Pověsti mají postavy — Libuši, rytíře, knížata." },
  ], {
    hints: ["Kde se odehrává Blaník a kde „za devatero horami“?", "Obojí může mít neskutečné prvky. Jen jedno z nich ale vypráví o hoře, hradu nebo panovníkovi, které opravdu existovaly."],
    explanation: "Pověst se váže ke skutečnému místu, osobě nebo události. Pohádka je celá vymyšlená.",
  }),
  choice("Čím se liší bajka od povídky?", "bajka má zvířata a ponaučení", [
    { value: "bajka je vždy delší", why: "Bajka je naopak obvykle velmi krátká." },
    { value: "povídka má kouzla", why: "Povídka kouzla nemá, je o obyčejném životě." },
    { value: "bajka se odehrává ve škole", why: "Bajka se odehrává ve světě zvířat." },
  ], {
    hints: ["Kdo jedná v bajce a kdo v povídce?", "V jednom druhu příběhu vystupují obyčejní lidé, ve druhém zvířata, která se chovají jako lidé a na konci nás něco naučí."],
    explanation: "Bajka má zvířata jednající jako lidé a ponaučení, povídka vypráví o obyčejných lidech.",
  }),
  choice("Proč Ezop vyprávěl o zvířatech, a ne o lidech?", "na zvířatech ukázal lidské vlastnosti", [
    { value: "lidé ho nezajímali", why: "Naopak — chtěl poučit lidi." },
    { value: "zvířata uměla číst", why: "Zvířata číst neumějí, bajky jsou pro lidi." },
    { value: "psal jen pro zvířata", why: "Bajky jsou určené lidem." },
  ], {
    hints: ["Jaká je liška v bajkách — a jaký bývá takový člověk?", "Liška je lstivá, mravenec pracovitý, cvrček lehkomyslný. Na zvířatech se dá lidská vlastnost ukázat tak, aby se nikdo neurazil."],
    explanation: "Zvířata v bajce představují lidské vlastnosti (lstivost, pracovitost). Na nich Ezop ukazoval, jak se lidé chovají.",
  }),
];

const L3: PracticeTask[] = [
  zanr("Příběh má mluvícího kocoura, kouzla a šťastný konec, ale žádné ponaučení. Co to je?", "pohádka", {
    pověst: "Příběh se neváže ke skutečnému místu ani osobě.",
    bajka: "Mluvící zvíře nestačí — bajka musí končit ponaučením.",
    povídka: "Kouzla a mluvící kocour do povídky nepatří.",
  }, ["Co rozhoduje: to, že zvíře mluví, nebo ponaučení na konci?", "Mluvící zvířata jsou v pohádkách i v bajkách. Kouzla a šťastný konec bez ponaučení ale ukazují jen na jeden druh příběhu (třeba Kocour v botách)."],
  "Kouzla a šťastný konec bez ponaučení jsou znaky pohádky (Kocour v botách), i když v ní mluví zvíře."),
  zanr("Vyprávění o skutečném hradu Karlštejn, kde prý v noci straší bílá paní. Co to je?", "pověst", {
    pohádka: "Karlštejn je skutečný hrad, pohádka by měla vymyšlený zámek.",
    bajka: "Nejsou tu zvířata s ponaučením.",
    povídka: "Strašidlo do povídky ze skutečného života nepatří.",
  }, ["Je Karlštejn skutečný hrad? A je skutečná bílá paní?", "Skutečné místo a k němu neskutečné vyprávění, které se předává mezi lidmi — to je jeden druh příběhu."],
  "Skutečný hrad s vyprávěním o strašidle je pověst."),
  choice("Které ponaučení patří k bajce o lišce a hroznech?", "Kdo něco nemůže mít, rád to pomlouvá.", [
    { value: "Hrozny jsou zdravé ovoce.", why: "To je fakt o hroznech, ne ponaučení o chování." },
    { value: "Lišky jsou chytřejší než ptáci.", why: "Tohle bajka o hroznech neříká." },
    { value: "Na podzim zrají hrozny.", why: "To je fakt o přírodě, ne ponaučení." },
  ], {
    hints: ["Proč liška řekla, že jsou hrozny kyselé?", "Liška na hrozny nedosáhla, a tak řekla, že stejně nejsou dobré. Ponaučení mluví o tom, jak se chovají lidé v podobné situaci."],
    explanation: "Liška hrozny nedostala, a tak je pomluvila. Ponaučení: Kdo něco nemůže mít, rád to pomlouvá.",
  }),
  choice("Které ponaučení patří k bajce o mravenci a cvrčkovi?", "Kdo si v létě nepřipraví zásoby, v zimě hladoví.", [
    { value: "Zpívat se nemá, je to ztráta času.", why: "Bajka neříká, že zpívat je špatně, ale že je třeba myslet dopředu." },
    { value: "Mravenci jsou silnější než cvrčci.", why: "To je fakt o zvířatech, ne ponaučení." },
    { value: "V zimě je venku zima a sníh.", why: "To je jen fakt o počasí." },
  ], {
    hints: ["Proč cvrček v zimě neměl co jíst?", "Mravenec pracoval, cvrček celé léto jen zpíval. Ponaučení říká, co se stane, když nemyslíme dopředu."],
    explanation: "Cvrček v létě nepracoval a v zimě neměl nic. Ponaučení: Kdo si v létě nepřipraví zásoby, v zimě hladoví.",
  }),
  choice("Proč pověst o Blanických rytířích vypráví o skutečné hoře?", "pověst se váže ke skutečnému místu", [
    { value: "protože je to pohádka", why: "Pohádka skutečné místo nepotřebuje." },
    { value: "protože hora je vymyšlená", why: "Blaník je skutečná hora." },
    { value: "protože je to bajka", why: "Bajka je o zvířatech s ponaučením." },
  ], {
    hints: ["Kde leží Blaník?", "Pověsti vznikaly tak, že si lidé vyprávěli o místech, která znali — a přidávali k nim neskutečné věci."],
    explanation: "Pověst vždy vychází ze skutečného místa, osoby nebo události — u Blanických rytířů je to skutečná hora Blaník.",
  }),
  choice("Proč příběh o tom, jak si Petra zlomila ruku na bruslích, není pohádka?", "nejsou v něm kouzla a mohl se opravdu stát", [
    { value: "protože je krátký", why: "Pohádky bývají také krátké." },
    { value: "protože v něm vystupuje dívka", why: "Dívky vystupují i v pohádkách (Popelka)." },
    { value: "protože se odehrává v zimě", why: "Roční období o druhu příběhu nerozhoduje." },
  ], {
    hints: ["Je v příběhu něco kouzelného?", "Pohádku poznáš podle kouzel a vymyšleného světa. Zlomená ruka na bruslích je obyčejná událost ze života."],
    explanation: "Příběh nemá kouzla a mohl se opravdu stát — je to povídka, ne pohádka.",
  }),
  zanr("Zvířata v příběhu mluví a příběh končí větou „Pýcha předchází pád.“ Co to je?", "bajka", {
    pohádka: "Pohádka nekončí ponaučením, ale šťastným koncem.",
    pověst: "Příběh se neváže ke skutečnému místu.",
    povídka: "V povídce zvířata nemluví.",
  }, ["Co je věta „Pýcha předchází pád“?", "Mluvící zvířata a na konci věta, co si máme z příběhu vzít — obě podmínky dohromady ukazují na jeden druh příběhu."],
  "Mluvící zvířata a ponaučení na konci — je to bajka."),
  choice("Která postava patří do pověsti?", "kněžna Libuše", [
    { value: "Popelka", why: "Popelka je postava z pohádky." },
    { value: "liška z Ezopovy bajky", why: "Liška je postava z bajky." },
    { value: "spolužák z vedlejší třídy", why: "Takový hrdina patří spíš do povídky." },
  ], {
    hints: ["Která z postav je spojená se skutečným místem a počátky našeho národa?", "Postavy pověstí najdeš ve Starých pověstech českých — jsou to knížata, kněžny a rytíři z dávných dob."],
    explanation: "Kněžna Libuše je postava ze Starých pověstí českých, patří tedy do pověsti.",
  }),
  choice("Která postava patří do pohádky?", "zlá čarodějnice", [
    { value: "praotec Čech", why: "Praotec Čech je postava z pověsti." },
    { value: "mravenec z Ezopa", why: "Mravenec je postava z bajky." },
    { value: "Eliška z nové školy", why: "Obyčejná dívka ze školy je hrdinka povídky." },
  ], {
    hints: ["Která postava umí čarovat?", "Nadpřirozené bytosti — víly, draci, skřítci — patří do celého vymyšleného světa."],
    explanation: "Čarodějnice je nadpřirozená bytost, patří do pohádky.",
  }),
  zanr("V příběhu vystupuje skutečný král Karel IV., ale radí mu kouzelný kůň. Co to je?", "pověst", {
    pohádka: "Karel IV. byl skutečný panovník, pohádka má vymyšlené krále.",
    bajka: "Kůň tu jen radí, příběh není o ponaučení z chování zvířat.",
    povídka: "Kouzelný kůň do povídky nepatří.",
  }, ["Byl Karel IV. skutečný? A mohl mu radit kouzelný kůň?", "Skutečná osoba a k ní něco neskutečného — to je typické pro jeden druh vyprávění o minulosti."],
  "Skutečná osoba (Karel IV.) s přidaným neskutečným prvkem — to je pověst."),
  choice("Proč si lidé vyprávěli pověsti o místech ve svém kraji?", "vysvětlovali si tak minulost svého kraje", [
    { value: "aby byly delší než pohádky", why: "Délka nebyla důvodem." },
    { value: "protože to byly učebnice dějepisu", why: "Pověsti nejsou přesná historie — je v nich hodně výmyslů." },
    { value: "aby děti zlobily", why: "Pověsti neměly děti navádět ke zlobení." },
  ], {
    hints: ["Proč se vypráví, že v hoře Blaník spí rytíři?", "Lidé chtěli vědět, proč jejich hrad nebo hora vypadá právě tak a co se tam kdysi dělo. Odpověď si vyprávěli v pověstech."],
    explanation: "Pověsti vysvětlovaly lidem minulost jejich kraje — proč se místo tak jmenuje, co se tam stalo.",
  }),
  choice("Chceš napsat bajku. Co v ní nesmí chybět?", "zvířata jednající jako lidé a ponaučení", [
    { value: "princezna a drak", why: "Princezna a drak patří do pohádky." },
    { value: "skutečný hrad a král", why: "Skutečné místo a osoba patří do pověsti." },
    { value: "datum a místo napsání", why: "To patří do dopisu." },
  ], {
    hints: ["Jak vypadají Ezopovy příběhy?", "Bajka má dvě povinné věci: zvíře, které se chová jako člověk, a na konci myšlenku, co si z příběhu vzít."],
    explanation: "Bajka potřebuje zvířata, která jednají jako lidé, a ponaučení na konci.",
  }),
  choice("Chceš napsat pověst o svém kraji. Z čeho vyjdeš?", "ze skutečného místa, třeba ze staré zříceniny", [
    { value: "z mluvících zvířat a ponaučení", why: "To je recept na bajku." },
    { value: "z království za devatero horami", why: "Vymyšlené království patří do pohádky." },
    { value: "z toho, co bylo dnes k obědu", why: "Obyčejná událost dneška je spíš námět povídky." },
  ], {
    hints: ["Na čem musí pověst stát?", "Pověst vždy stojí na něčem, co opravdu existuje nebo existovalo — hora, hrad, studánka, panovník. Neskutečné věci se k tomu přidávají až potom."],
    explanation: "Pověst vychází ze skutečného místa (zřícenina, hora, studánka), ke kterému přidáme neobvyklý příběh.",
  }),
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? L3 : level === 2 ? L2 : L1;
  return shuffle(pool);
}

export const POHADKAPOVESTBAJKAPOVIDKA: TopicMetadata[] = [
  {
    id: "g4-cjl-literarni-vychova-literarni-pojmy-a-zanry-pohadka-povest-bajka-povidka",
    rvpNodeId: "g4-cjl-literarni-vychova-literarni-pojmy-a-zanry-pohadka-povest-bajka-povidka",
    displayName: "Literární žánry",
    title: "Pohádka, pověst, bajka, povídka",
    studentTitle: "Druhy příběhů",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Literární výchova",
    briefDescription: "Poznáš rozdíl mezi pohádkou, pověstí, bajkou a povídkou.",
    keywords: ["pohádka", "pověst", "bajka", "povídka", "literární žánr", "Ezop", "Jirásek"],
    goals: [
      "Rozlišit literární žánry: pohádku, pověst, bajku, povídku",
      "Přiřadit text ke správnému žánru",
    ],
    boundaries: ["Bez románu a novely", "Bez dramatických žánrů"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: ["g4-cjl-literarni-vychova-prace-s-textem-hlavni-postavy-a-jejich-charakteristika"],
    generator: gen,
    helpTemplate: {
      hint: "Pohádka=kouzla a šťastný konec; Pověst=skutečné místo nebo osoba; Bajka=zvířata+ponaučení; Povídka=obyčejní lidé",
      steps: [
        "Kouzla a vymyšlený svět? → pohádka",
        "Skutečné místo, osoba nebo událost? → pověst",
        "Zvířata jako lidé + ponaučení na konci? → bajka",
        "Obyčejní lidé, nic kouzelného? → povídka",
      ],
      commonMistake: "Mluvící zvíře ještě neznamená bajku — bajka musí mít ponaučení (Červená Karkulka je pohádka)",
      example: "Liška a hrozny (Ezop) = bajka; Libuše (Jirásek) = pověst; Popelka = pohádka",
    },
  },
];
