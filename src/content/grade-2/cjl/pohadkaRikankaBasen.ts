import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "@/content/grade-3/_shared";

// Přepsáno 2026-09-11 (inventura obsahu). Dřív 8 úloh na úroveň, jedna nápověda
// a žádná zpětná vazba u chybných možností. Teď tři oddělené banky:
// L1 poznej žánr podle jeho znaku · L2 urči žánr ukázky
// · L3 transfer: vyber ukázku daného žánru, vyřeš hádanku, doplň rým.

type Zanr = "Pohádka" | "Říkanka" | "Báseň" | "Hádanka";
const ZANRY: Zanr[] = ["Pohádka", "Říkanka", "Báseň", "Hádanka"];

interface ZanrUloha {
  q: string;
  a: Zanr;
  /** Proč je každý z ostatních tří žánrů u téhle úlohy špatně. */
  why: Partial<Record<Zanr, string>>;
  h: [string, string];
  e: string;
  emoji: string;
}

function zanrTask(u: ZanrUloha): PracticeTask {
  const wrong = ZANRY.filter((z) => z !== u.a).map((z) => {
    const why = u.why[z];
    if (!why) throw new Error(`Chybí zpětná vazba „${z}“ u „${u.q}“`);
    return { value: z, why };
  }) as [Distractor, Distractor, Distractor];
  return { ...choice(u.q, u.a, wrong, { hints: u.h, explanation: u.e }), emoji: u.emoji };
}

interface Uloha {
  q: string;
  a: string;
  d: [string, string][];
  h: [string, string];
  e: string;
  emoji: string;
}

function task(u: Uloha): PracticeTask {
  if (u.d.length !== 3) throw new Error(`Úloha „${u.q}“ nemá tři chybné možnosti`);
  const wrong = u.d.map(([value, why]) => ({ value, why })) as [Distractor, Distractor, Distractor];
  return { ...choice(u.q, u.a, wrong, { hints: u.h, explanation: u.e }), emoji: u.emoji };
}

// ── L1: poznej žánr podle typického znaku ─────────────────────────────────
const POOL_L1: ZanrUloha[] = [
  {
    q: "Který žánr často začíná slovy „Byl jednou jeden…“?", a: "Pohádka", emoji: "📖",
    why: {
      Říkanka: "Říkanka je krátký rýmovaný text ke hře, nevypráví, co se kdysi stalo.",
      Báseň: "Báseň je ve verších a zachycuje náladu, nezačíná vyprávěním o dávných časech.",
      Hádanka: "Hádanka popisuje věc a ptá se, co to je. Příběh nevypráví.",
    },
    h: [
      "Vzpomeň si, jak začíná vyprávění, které ti čtou před spaním.",
      "Slova „Byl jednou jeden…“ nás posílají do dávných časů. Hned potom přijde vyprávění o králi, princezně nebo kouzlu. Který žánr takhle vypráví příběh?",
    ],
    e: "„Byl jednou jeden…“ je typický začátek pohádky. Pohádka vypráví příběh z dávných časů, často s kouzlem.",
  },
  {
    q: "Který text končí otázkou „Co je to?“", a: "Hádanka", emoji: "🔍",
    why: {
      Pohádka: "Pohádka vypráví příběh a končí třeba šťastnou svatbou, ne otázkou na čtenáře.",
      Říkanka: "Říkanka se říká při hře, nic nepopisuje a na nic se neptá.",
      Báseň: "Báseň vyjadřuje náladu nebo obraz. Čtenář v ní nic nehádá.",
    },
    h: [
      "Kdo odpovídá na otázku „Co je to?“ — ten, kdo text napsal, nebo ty?",
      "Otázka na konci vyzývá čtenáře, aby sám přišel na odpověď. Text předtím něco popsal, ale nepojmenoval to. Ve kterém žánru se takhle přemýšlí a tipuje?",
    ],
    e: "Hádanka popíše věc, ale neřekne její jméno. Na konci se zeptá „Co je to?“ a čtenář hádá.",
  },
  {
    q: "Který krátký text s rýmem doprovází dětskou hru?", a: "Říkanka", emoji: "🎵",
    why: {
      Pohádka: "Pohádka je dlouhé vyprávění a při hře se neříká.",
      Báseň: "Báseň se také rýmuje, ale čte se kvůli náladě a kráse slov, ne kvůli hře.",
      Hádanka: "Hádanka je otázka k uhodnutí, nedoprovází tleskání ani skákání.",
    },
    h: [
      "Vzpomeň si, co si děti říkají, když spolu tleskají nebo se točí v kruhu.",
      "Při hře potřebujeme text krátký, rytmický a snadný k zapamatování, aby se dal říkat dokola. Rýmuje se a hraje si se slovy. Který žánr to je?",
    ],
    e: "Říkanka je krátký rýmovaný text, který se říká při hře. Díky rytmu se dobře pamatuje.",
  },
  {
    q: "Který žánr má verše a vyjadřuje pocity nebo krásu přírody?", a: "Báseň", emoji: "📜",
    why: {
      Pohádka: "Pohádka se obvykle nepíše ve verších a vypráví hlavně děj s postavami.",
      Říkanka: "Říkanka má taky verše, ale slouží ke hře, ne k vyjádření pocitů.",
      Hádanka: "Hádanka něco popisuje, aby to čtenář uhodl, pocity nevyjadřuje.",
    },
    h: [
      "Který žánr bys četl, když chceš prožít náladu třeba podzimního lesa?",
      "Verš je jeden řádek, který se často rýmuje s dalším. Když takové řádky vyprávějí o smutku, radosti nebo o kráse jara, nejde o hru ani o hádání. Jak se takový text jmenuje?",
    ],
    e: "Báseň je napsaná ve verších a vyjadřuje pocity, nálady nebo krásu přírody.",
  },
  {
    q: "Ve kterém žánru se objeví drak, víla nebo čarodějnice?", a: "Pohádka", emoji: "🐉",
    why: {
      Říkanka: "Říkanka je krátký text ke hře, postavy s kouzelnou mocí v ní nevystupují.",
      Báseň: "Báseň zachycuje náladu, obvykle nevypráví o kouzelných bytostech.",
      Hádanka: "Hádanka popisuje věc k uhodnutí, nevystupují v ní postavy.",
    },
    h: [
      "Drak ani víla ve skutečnosti nežijí. Kde se s nimi potkáš?",
      "Kouzelné bytosti patří do vymyšleného světa, kde se dějí zázraky a dobro bojuje se zlem. Takový svět najdeš v dlouhém vyprávění s hrdinou. Který žánr to je?",
    ],
    e: "Drak, víla a čarodějnice jsou kouzelné bytosti a ty patří do pohádky.",
  },
  {
    q: "Který žánr popisuje věc, ale neřekne její jméno?", a: "Hádanka", emoji: "❓",
    why: {
      Pohádka: "Pohádka vypráví příběh a postavy v ní mají jména, nic neschovává.",
      Říkanka: "Říkanka si hraje se slovy a rytmem, nic tajného nepopisuje.",
      Báseň: "Báseň může popisovat přírodu, ale nechce, abys něco hádal.",
    },
    h: [
      "Proč by někdo schválně neřekl, o čem mluví?",
      "Když text popíše, jak věc vypadá nebo co dělá, ale její jméno vynechá, chce, abys na to přišel sám. Který žánr je postavený na tom, že tipuješ?",
    ],
    e: "Hádanka schválně neřekne jméno věci, jen ji popíše. Čtenář pak hádá, co to je.",
  },
  {
    q: "Kterým rýmovaným textem se rozpočítáváme při schovávané?", a: "Říkanka", emoji: "🙈",
    why: {
      Pohádka: "Pohádka je moc dlouhá, rozpočítávání potřebuje krátký rytmický text.",
      Báseň: "Báseň se čte kvůli náladě. Rozpočítadlo je hra se slovy, ne báseň.",
      Hádanka: "Hádanka se ptá „Co je to?“. Při rozpočítávání se nic nehádá.",
    },
    h: [
      "Při rozpočítávání se na každou slabiku ukáže na jiné dítě. Jaký text se k tomu hodí?",
      "Rozpočítadlo musí mít pravidelný rytmus, aby se dalo ukazovat prstem dokola, a rým, aby se dobře pamatovalo. Nevypráví příběh ani nic nepopisuje. Kam patří?",
    ],
    e: "Rozpočítadlo je druh říkanky. Je krátké, rytmické a rýmuje se, proto se dobře ukazuje po slabikách.",
  },
  {
    q: "Ve kterém žánru nakonec dobro zvítězí nad zlem?", a: "Pohádka", emoji: "⚔️",
    why: {
      Říkanka: "Říkanka nemá děj s hodnými a zlými postavami, je to krátká hra se slovy.",
      Báseň: "Báseň vyjadřuje náladu, obvykle v ní nebojují hodné a zlé postavy.",
      Hádanka: "Hádanka jen popisuje věc k uhodnutí, nikdo v ní nevítězí.",
    },
    h: [
      "Kde bojuje hodný hrdina se zlým drakem nebo s ježibabou?",
      "Aby mohlo dobro zvítězit, musí mít text děj: hrdinu, zlou postavu a boj mezi nimi. Na konci bývá zlo potrestáno. Který žánr má takový příběh?",
    ],
    e: "V pohádce bojují dobré a zlé postavy a nakonec vyhraje dobro. Proto pohádky končí šťastně.",
  },
  {
    q: "Který text se skládá z veršů a slok a maluje slovy náladu?", a: "Báseň", emoji: "🖋️",
    why: {
      Pohádka: "Pohádka se většinou vypráví v odstavcích, ne ve verších a slokách.",
      Říkanka: "Říkanka je obvykle jen pár veršů ke hře, nemaluje slovy náladu.",
      Hádanka: "Hádanka má jednu dvě věty s otázkou, sloky nemá.",
    },
    h: [
      "Sloka je skupina několika veršů. Kde jsi viděl text rozdělený do slok?",
      "Text s více slokami, který se čte pomalu, aby sis představil obraz nebo náladu, není hra ani hádání. Takové texty najdeš ve sbírce, kterou čte paní učitelka při slavnostních chvílích. Jak se jmenují?",
    ],
    e: "Báseň je složená z veršů, které tvoří sloky. Slovy maluje obraz nebo náladu.",
  },
  {
    q: "Ve kterém textu musíš sám přijít na to, o čem mluví?", a: "Hádanka", emoji: "🤔",
    why: {
      Pohádka: "Pohádka ti rovnou řekne, o kom je, nic se v ní nehádá.",
      Říkanka: "U říkanky nemusíš na nic přicházet, stačí ji říkat při hře.",
      Báseň: "Báseň může mluvit obrazně, ale jejím smyslem není hádání.",
    },
    h: [
      "Který žánr je vlastně hra na přemýšlení?",
      "Text ti dá několik stop, třeba jakou má věc barvu nebo co umí, a ty z nich skládáš odpověď. Je to jako malá tajenka ze slov. Který žánr to je?",
    ],
    e: "Hádanka dává stopy a čtenář z nich sám přijde, o čem mluví.",
  },
  {
    q: "Ve kterém žánru mluví zvířata a dějí se kouzla?", a: "Pohádka", emoji: "🦊",
    why: {
      Říkanka: "V říkance se zvíře může objevit, ale nevypráví se o něm příběh s kouzly.",
      Báseň: "Báseň zachycuje náladu a obraz, kouzelný děj obvykle nemá.",
      Hádanka: "Hádanka zvíře popíše, abys ho uhodl, ale nemluví v ní a nekouzlí.",
    },
    h: [
      "Umí liška ve skutečnosti mluvit? Kde se to může stát?",
      "Mluvící zvířata a kouzla jsou znakem vymyšleného, kouzelného světa. Do toho světa nás vezme dlouhé vyprávění s hrdinou a šťastným koncem. Který žánr to je?",
    ],
    e: "Mluvící zvířata a kouzla patří do pohádky, protože pohádka vypráví o kouzelném světě.",
  },
  {
    q: "Který žánr nás nechá prožít smutek podzimu nebo radost z jara?", a: "Báseň", emoji: "🍂",
    why: {
      Pohádka: "Pohádka vypráví hlavně děj s postavami, ne náladu ročního období.",
      Říkanka: "Říkanka je veselá hra se slovy, pocity v ní nejsou hlavní.",
      Hádanka: "Hádanka se ptá, co to je. Pocity nepopisuje.",
    },
    h: [
      "Který text čteš pomalu, abys cítil, jak je venku smutno nebo veselo?",
      "Když autor chce, abys prožil smutek, radost nebo klid, píše krátké rýmované verše plné obrazů. Nevypráví příběh ani si nehraje. Jak se takový text jmenuje?",
    ],
    e: "Báseň vyjadřuje pocity a nálady, například smutek podzimu nebo radost z jara.",
  },
  {
    q: "Který žánr končí slovy „…a žili šťastně až do smrti“?", a: "Pohádka", emoji: "👑",
    why: {
      Říkanka: "Říkanka je pár veršů ke hře, nevypráví o tom, jak kdo žil.",
      Báseň: "Báseň nemá takový pevný konec, zachycuje hlavně náladu.",
      Hádanka: "Hádanka končí otázkou „Co je to?“, ne šťastným koncem.",
    },
    h: [
      "Kdo obvykle žije šťastně až do smrti? Třeba princ a princezna…",
      "Takový konec uzavírá dlouhé vyprávění, ve kterém hrdina přemohl zlo a všechno dobře dopadlo. Který žánr takhle končí?",
    ],
    e: "„…a žili šťastně až do smrti“ je typický konec pohádky. Pohádka končí dobře.",
  },
  {
    q: "Který text se říká při tleskání nebo skákání přes švihadlo?", a: "Říkanka", emoji: "👏",
    why: {
      Pohádka: "Pohádka se poslouchá v klidu, při skákání by se vyprávět nedala.",
      Báseň: "Báseň se přednáší kvůli náladě, ne jako doprovod ke skákání.",
      Hádanka: "Hádanka se ptá a čeká na odpověď, k tleskání se nehodí.",
    },
    h: [
      "Při skákání přes švihadlo potřebuješ text, který jde do rytmu. Jaký to je?",
      "Každý skok nebo tlesknutí padne na jednu slabiku. Proto musí být text krátký, pravidelný a rýmovaný. Nic nepopisuje a nevypráví. Který žánr to je?",
    ],
    e: "Říkanka má pravidelný rytmus, a proto se hodí k tleskání a skákání.",
  },
];

// ── L2: urči žánr konkrétní ukázky ────────────────────────────────────────
const POOL_L2: ZanrUloha[] = [
  {
    q: "Jaký žánr je ukázka? „Za devatero horami žil jeden král. Měl tři syny.“", a: "Pohádka", emoji: "🏰",
    why: {
      Říkanka: "Ukázka se nerýmuje a nedá se říkat při hře.",
      Báseň: "Ukázka není ve verších a nemaluje náladu, začíná vyprávět děj.",
      Hádanka: "V ukázce se nic nepopisuje k uhodnutí a na konci není otázka.",
    },
    h: [
      "Kde leží místo „za devatero horami“? Ve skutečném světě?",
      "Slova „za devatero horami“ znamenají daleko v kouzelném světě. Pak se objeví král a jeho synové, tedy postavy příběhu. Rýmuje se text? Ptá se na něco? Podle toho rozhodni.",
    ],
    e: "„Za devatero horami“ je typický pohádkový začátek. Ukázka začíná vyprávět příběh o králi, je to pohádka.",
  },
  {
    q: "Jaký žánr je ukázka? „Liška řekla zajíci: Pojď, ukážu ti kouzelný pramen.“", a: "Pohádka", emoji: "🦊",
    why: {
      Říkanka: "Ukázka se nerýmuje a nemá rytmus pro hru.",
      Báseň: "Ukázka nemá verše a nevyjadřuje pocit, jen vypráví, co liška řekla.",
      Hádanka: "Nic tu není schované k uhodnutí, zvířata jsou rovnou pojmenovaná.",
    },
    h: [
      "Co je na tom, že liška mluví se zajícem, zvláštního?",
      "Zvířata mluví jen ve vymyšleném světě a navíc je tu kouzelný pramen. Text nemá rým ani otázku k uhodnutí, vypráví děj. Který žánr má mluvící zvířata a kouzla?",
    ],
    e: "Mluvící liška a kouzelný pramen patří do kouzelného světa pohádky.",
  },
  {
    q: "Jaký žánr je ukázka? „Když princezna políbila žábu, stal se z ní princ.“", a: "Pohádka", emoji: "🐸",
    why: {
      Říkanka: "Ukázka se nerýmuje a neříká se při hře.",
      Báseň: "Ukázka není ve verších, popisuje kouzelnou proměnu v příběhu.",
      Hádanka: "Ukázka se na nic neptá a nic neschovává.",
    },
    h: [
      "Může se žába doopravdy proměnit v prince? Kde se to stane?",
      "Proměna žáby v prince je kouzlo a vystupuje tu princezna. Text vypráví, co se stalo, nerýmuje se a na nic se neptá. Který žánr vypráví o kouzlech?",
    ],
    e: "Kouzelná proměna a postavy princezny a prince jsou znaky pohádky.",
  },
  {
    q: "Jaký žánr je ukázka? „Dědeček zasadil řepu a vyrostla obrovská.“", a: "Pohádka", emoji: "🌱",
    why: {
      Říkanka: "Ukázka se nerýmuje a není to hra se slovy.",
      Báseň: "Ukázka není ve verších, začíná vyprávět děj.",
      Hádanka: "Řepa je v ukázce rovnou pojmenovaná, nic se nehádá.",
    },
    h: [
      "Začíná tu vyprávění o dědečkovi. Co se asi stane dál?",
      "Obrovská řepa je něco neobvyklého, skoro kouzelného, a text vypráví, co dědeček udělal. Nemá rým pro hru ani otázku k hádání. Který žánr takhle začíná příběh?",
    ],
    e: "Ukázka vypráví příběh o dědečkovi a obrovské řepě, je to pohádka.",
  },
  {
    q: "Jaký žánr je ukázka? „Ententýky, dva špalíky, čert vyletěl z elektriky.“", a: "Říkanka", emoji: "🎲",
    why: {
      Pohádka: "V ukázce není příběh, jen hravá rýmovaná slova.",
      Báseň: "Nejde o náladu. Slova „ententýky“ nic neznamenají, jsou tu kvůli rytmu.",
      Hádanka: "Ukázka nic nepopisuje a na nic se neptá.",
    },
    h: [
      "Znamená slovo „ententýky“ něco? Proč tam asi je?",
      "Nesmyslná slova, rychlý rytmus a rým „špalíky – elektriky“ se hodí k ukazování na děti při hře. Nevypráví se příběh ani nemaluje nálada. Který žánr to je?",
    ],
    e: "„Ententýky“ je rozpočítadlo, tedy říkanka. Hraje si s rytmem a rýmem.",
  },
  {
    q: "Jaký žánr je ukázka? „Kolo, kolo mlýnské, za čtyři rýnské.“", a: "Říkanka", emoji: "🎡",
    why: {
      Pohádka: "Ukázka nevypráví příběh s postavami.",
      Báseň: "Ukázka nemaluje náladu, říká se, když se děti točí v kruhu.",
      Hádanka: "Na konci není otázka a nic se nehádá.",
    },
    h: [
      "Co děti dělají, když říkají „Kolo, kolo mlýnské“?",
      "Při těchto slovech se děti drží za ruce a točí se dokola. Text je krátký, rytmický a rýmuje se, aby šel do kroku. Který žánr doprovází hru?",
    ],
    e: "„Kolo, kolo mlýnské“ je lidová říkanka, kterou děti říkají při hře v kruhu.",
  },
  {
    q: "Jaký žánr je ukázka? „Vařila myšička kašičku na zeleném rendlíčku.“", a: "Říkanka", emoji: "🐭",
    why: {
      Pohádka: "Myška tu nevypráví příběh, text se říká při hře s prstíky.",
      Báseň: "Nejde o náladu, text se říká malým dětem při hraní na dlani.",
      Hádanka: "Myška je rovnou pojmenovaná, nic se nehádá.",
    },
    h: [
      "Kdy se tahle slova říkají malým dětem? Co se přitom dělá s dlaní?",
      "Při těchto slovech se kreslí prstem po dětské dlani a pak se prstíky „rozdávají“. Text je krátký, rytmický a slouží ke hře. Který žánr to je?",
    ],
    e: "„Vařila myšička kašičku“ je říkanka ke hře s prstíky malých dětí.",
  },
  {
    q: "Jaký žánr je ukázka? „Paci, paci, pacičky, táta koupil botičky.“", a: "Říkanka", emoji: "👶",
    why: {
      Pohádka: "Ukázka nevypráví příběh, jen rytmicky opakuje slova.",
      Báseň: "Nejde o náladu, text se říká při tleskání s malým dítětem.",
      Hádanka: "Nic se nepopisuje k uhodnutí a chybí otázka.",
    },
    h: [
      "Co se dělá s ručičkami, když se říká „paci, paci“?",
      "„Paci, paci“ doprovází tleskání s malým dítětem. Slova se opakují a rýmují (pacičky – botičky), aby šla do rytmu. Který žánr doprovází takovou hru?",
    ],
    e: "„Paci, paci, pacičky“ je říkanka, kterou se tleská s malými dětmi.",
  },
  {
    q: "Jaký žánr je ukázka? „Nad loukou se mlha vznáší, / slunce ranní rosu plaší.“", a: "Báseň", emoji: "🌄",
    why: {
      Pohádka: "V ukázce nevystupují postavy a neděje se kouzlo, je to obraz rána.",
      Říkanka: "Ukázka se rýmuje, ale neříká se při hře, maluje ranní přírodu.",
      Hádanka: "Mlha i slunce jsou pojmenované, nic se nehádá.",
    },
    h: [
      "Co si představíš, když čteš o mlze nad loukou?",
      "Dva verše se rýmují (vznáší – plaší) a malují klidný obraz ranní přírody. Nehraje se při nich žádná hra a nevypráví se děj. Který žánr slovy maluje obraz?",
    ],
    e: "Ukázka je ve verších a maluje obraz ranní louky. Je to báseň.",
  },
  {
    q: "Jaký žánr je ukázka? „Venku prší celý den, / smutně koukám z okna ven.“", a: "Báseň", emoji: "🌧️",
    why: {
      Pohádka: "Nevypráví se tu příběh s kouzlem, jen pocit deštivého dne.",
      Říkanka: "Rýmuje se to, ale je to smutné a neříká se to při hře.",
      Hádanka: "Ukázka se na nic neptá a nic neschovává.",
    },
    h: [
      "Jak se asi cítí ten, kdo kouká z okna na déšť?",
      "Verše se rýmují (den – ven) a vyjadřují smutek z deštivého dne. Není to veselá hra se slovy ani příběh. Který žánr vyjadřuje pocity ve verších?",
    ],
    e: "Verše vyjadřují smutný pocit z deštivého dne, to je znak básně.",
  },
  {
    q: "Jaký žánr je ukázka? „Nad rybníkem měsíc bdí, / v rákosí už kachny spí.“", a: "Báseň", emoji: "🌙",
    why: {
      Pohádka: "Neděje se tu nic kouzelného a nevystupuje hrdina, je to obraz noci.",
      Říkanka: "Ukázka se rýmuje, ale je klidná a tichá, ne ke hře.",
      Hádanka: "Měsíc i kachny jsou pojmenované, není co hádat.",
    },
    h: [
      "Jaká nálada je v ukázce: veselá hra, nebo tichý večer?",
      "Dva rýmované verše (bdí – spí) malují tichou noc u rybníka. Nikdo si při nich nehraje a nic se neděje jako v příběhu. Jak se jmenuje takový text?",
    ],
    e: "Ukázka je ve verších a maluje klidnou noc u rybníka. Je to báseň.",
  },
  {
    q: "Jaký žánr je ukázka? „Slunce zapadá za les, / den se loučí, tichne ves.“", a: "Báseň", emoji: "🌇",
    why: {
      Pohádka: "V ukázce není děj ani kouzelná postava, jen obraz večera.",
      Říkanka: "Verše se rýmují, ale nejsou ke hře, vyjadřují klid večera.",
      Hádanka: "Slunce i les jsou pojmenované, nic se nehádá.",
    },
    h: [
      "Co znamená, že se „den loučí“? Může se den doopravdy loučit?",
      "„Den se loučí“ je obrazné vyjádření: autor tak maluje konec dne. Verše se rýmují (les – ves) a vyjadřují náladu tichého večera. Který žánr to je?",
    ],
    e: "Obraz „den se loučí“ a rýmované verše o večeru jsou znaky básně.",
  },
  {
    q: "Jaký žánr je ukázka? „Má čtyři nohy, ale nechodí. Sedáš na ni u stolu.“", a: "Hádanka", emoji: "🪑",
    why: {
      Pohádka: "Ukázka nevypráví příběh, jen popisuje věc bez jména.",
      Říkanka: "Ukázka se nerýmuje a neříká se při hře.",
      Báseň: "Ukázka nemaluje náladu, dává stopy k uhodnutí věci.",
    },
    h: [
      "Víš, o jaké věci ukázka mluví? Řekla ti její jméno?",
      "Text popisuje věc (čtyři nohy, sedí se na ní), ale jméno schválně vynechá, abys na něj přišel sám. Který žánr takhle schovává odpověď?",
    ],
    e: "Ukázka popisuje věc bez jména (židli) a čeká, že ji uhodneš. Je to hádanka.",
  },
  {
    q: "Jaký žánr je ukázka? „Bez oken, bez dveří, plná komora lidí.“", a: "Hádanka", emoji: "🌺",
    why: {
      Pohádka: "Nevypráví se tu příběh, jen se záhadně popisuje jedna věc.",
      Říkanka: "Neříká se to při hře a slova neznamenají „jen tak“, schovávají odpověď.",
      Báseň: "Nejde o náladu, text je záhada, kterou máš rozluštit.",
    },
    h: [
      "Může existovat komora bez oken a dveří? O čem to asi je?",
      "Text popisuje něco podivně („komora bez dveří plná lidí“), protože schovává skutečnou věc, kterou máš uhodnout. Odpověď je makovice plná semínek. Který žánr takhle schovává odpověď?",
    ],
    e: "Záhadný popis, za kterým je schovaná věc (makovice), je znak hádanky.",
  },
  {
    q: "Jaký žánr je ukázka? „Postavíš ho v zimě, na jaře se rozpláče a zmizí.“", a: "Hádanka", emoji: "⛄",
    why: {
      Pohádka: "Nikdo tu nevypráví příběh s hrdinou, jen se popisuje něco bez jména.",
      Říkanka: "Ukázka se nerýmuje a nedoprovází hru.",
      Báseň: "Ukázka nemaluje náladu, dává stopy, abys něco uhodl.",
    },
    h: [
      "O kom ukázka mluví? Řekla ti jeho jméno?",
      "Stopy: postaví se v zimě, na jaře „pláče“, tedy taje. Jméno chybí, protože ho máš uhodnout sám. Který žánr je postavený na hádání?",
    ],
    e: "Ukázka popisuje sněhuláka, ale nepojmenuje ho. Čtenář hádá, proto je to hádanka.",
  },
  {
    q: "Jaký žánr je ukázka? „Zelená je, skáče, ale zajíc to není. Kdo je to?“", a: "Hádanka", emoji: "🐸",
    why: {
      Pohádka: "Ukázka nevypráví příběh, ptá se, kdo to je.",
      Říkanka: "Text se nerýmuje a není ke hře.",
      Báseň: "Nemaluje náladu, dává stopy a končí otázkou.",
    },
    h: [
      "Čím ukázka končí? Na co se tě ptá?",
      "Text dává stopy (zelená, skáče) a pak se zeptá „Kdo je to?“. Chce, abys odpověď uhodl sám. Který žánr končí takovou otázkou?",
    ],
    e: "Ukázka dává stopy a ptá se „Kdo je to?“. To je typická hádanka.",
  },
];

// ── L3: transfer — vyber ukázku žánru, vyřeš hádanku, doplň rým ────────────
const POOL_L3: Uloha[] = [
  // Inverze: je dán žánr, žák hledá ukázku mezi čtyřmi.
  {
    q: "Který z těchto textů je začátek pohádky?", a: "Kdysi dávno žil v zámku zakletý princ.", emoji: "🏰",
    d: [
      ["Ene, bene, res, kvinter, finter, žes.", "To je rozpočítadlo, tedy říkanka. Nesmyslná slova jsou tu kvůli rytmu, ne kvůli příběhu."],
      ["Stará lípa tiše šeptá, / na co se jí vítr ptá.", "To jsou rýmované verše o přírodě, tedy báseň. Nevypráví se v nich příběh."],
      ["Kdo má klobouk, ale nemá hlavu?", "To je hádanka, ptá se tě na věc (houbu). Pohádkový příběh nezačíná."],
    ],
    h: [
      "Hledej text, ve kterém vystupuje postava a začíná se jí něco dít.",
      "Pohádka začíná vyprávěním z dávných časů a často je v ní kouzlo. Projdi texty: který se rýmuje kvůli hře, který maluje přírodu, který se ptá? Zbyde ten, kde je kouzelná postava.",
    ],
    e: "„Kdysi dávno“ a zakletý princ jsou znaky pohádky: vyprávění z dávných časů s kouzlem.",
  },
  {
    q: "Který z těchto textů je říkanka?", a: "Houpy, houpy, kočka snědla kroupy.", emoji: "🐱",
    d: [
      ["Zvířátka se domluvila, že postaví chaloupku.", "To je začátek příběhu se zvířátky, tedy pohádky. Nerýmuje se a neříká se při hře."],
      ["Na rybníce leknín spí, / vážka nad ním tiše sní.", "Tyto verše se rýmují, ale malují tichý obraz rybníka. Je to báseň, ne hra."],
      ["Kdo nosí svůj domeček všude s sebou?", "To je hádanka (šnek), ptá se tě na odpověď. Ke hře se neříká."],
    ],
    h: [
      "Který text by sis řekl, když houpeš malého brášku na koleni?",
      "Říkanka je krátká, veselá, rytmická a rýmuje se, aby šla do pohybu. Vyřaď text, který vypráví děj, text, který maluje tichou náladu, a text, který se ptá.",
    ],
    e: "„Houpy, houpy“ se říká při houpání dítěte. Je krátká, rytmická a rýmuje se: je to říkanka.",
  },
  {
    q: "Který z těchto textů je báseň?", a: "Ráno slunce vstává z hor, / zlatí louky, zlatí bor.", emoji: "🌅",
    d: [
      ["Hloupý Honza se vydal do světa hledat štěstí.", "To je začátek pohádky o Honzovi. Nemá verše a vypráví děj."],
      ["Jede, jede poštovský panáček.", "To je říkanka, kterou se houpe dítě na koleni. Slouží ke hře."],
      ["Co roste hlavou dolů?", "To je hádanka (rampouch). Ptá se, nemaluje náladu."],
    ],
    h: [
      "Hledej text, který ti před očima maluje obraz krajiny.",
      "Báseň má verše, které se rýmují, a vyjadřuje obraz nebo náladu. Říkanka se také rýmuje, ale slouží ke hře. Který text jen tiše popisuje krásu přírody?",
    ],
    e: "Verše „vstává z hor – zlatí bor“ se rýmují a malují ranní krajinu. To je báseň.",
  },
  {
    q: "Který z těchto textů je hádanka?", a: "Kdo má bodliny a v zimě spí pod listím?", emoji: "🦔",
    d: [
      ["Drak se třemi hlavami hlídal princeznu.", "To je úryvek z pohádky. Vystupují v něm postavy, nic se nehádá."],
      ["Sněží, sněží celou noc, / bílá zima má svou moc.", "Tyto verše malují zimní obraz, jsou to verše básně. Nic se v nich neptá."],
      ["Skáču, skáču, raz a dva, / kdo mě chytí, vyhrává.", "To je říkanka ke hře na honěnou. Nic nepopisuje k uhodnutí."],
    ],
    h: [
      "Který text po tobě chce odpověď?",
      "Hádanka popíše zvíře nebo věc, ale nepojmenuje je, a pak se zeptá. Vyřaď pohádku (postavy a děj), báseň (obraz přírody) i říkanku (hra). Zbyde text se stopami a otázkou.",
    ],
    e: "Text dává stopy (bodliny, zimní spánek) a ptá se, kdo to je. Je to hádanka o ježkovi.",
  },
  // Vyřeš hádanku.
  {
    q: "Vyřeš hádanku: „Má zuby, ale nekouše. Pomáhá ti učesat vlasy.“", a: "hřeben", emoji: "💇",
    d: [
      ["kartáček na zuby", "Kartáček čistí zuby, ale sám žádné zuby nemá a vlasy nečeše."],
      ["vidlička", "Vidlička má hroty podobné zubům, ale jí se s ní, vlasy se s ní nečešou."],
      ["pila", "Pila má zuby, ale řeže dřevo. Vlasy by s ní nikdo nečesal."],
    ],
    h: [
      "Jaké „zuby“ může mít věc, která nekouše?",
      "Zuby tu znamenají řadu tenkých hrotů vedle sebe. Druhá stopa říká, že věc pomáhá s vlasy. Která z možností splní obě stopy najednou?",
    ],
    e: "Hřeben má řadu „zubů“, které nekoušou, a češou se jím vlasy. Splní obě stopy hádanky.",
  },
  {
    q: "Vyřeš hádanku: „Nemá nohy, a přece jde. Na zdi tiká celý den.“", a: "hodiny", emoji: "🕰️",
    d: [
      ["kalendář", "Kalendář visí na zdi, ale netiká a nejde."],
      ["obraz", "Obraz visí na zdi, ale netiká a nic v něm nejde."],
      ["vypínač", "Vypínač je na zdi, ale netiká."],
    ],
    h: [
      "Co může „jít“, i když nemá nohy? Říká se to třeba o čase.",
      "Říkáme „ty jdou přesně“ nebo „předbíhají se“. Druhá stopa: věc visí na zdi a tiká. Která z možností tiká?",
    ],
    e: "O hodinách říkáme, že „jdou“, a visí na zdi a tikají. Proto jsou odpovědí.",
  },
  {
    q: "Vyřeš hádanku: „Ve dne spí, v noci loví. Má velké oči a houká.“", a: "sova", emoji: "🦉",
    d: [
      ["netopýr", "Netopýr loví v noci, ale nehouká a velké oči nemá."],
      ["kukačka", "Kukačka je aktivní ve dne a volá „kuku“, nehouká."],
      ["ježek", "Ježek chodí v noci, ale nehouká a velké oči nemá."],
    ],
    h: [
      "Který pták je vzhůru v noci a vydává zvuk „hú, hú“?",
      "Stop je víc a musí sedět všechny: noční lov, velké oči a houkání. Netopýr i ježek jsou v noci venku, ale houkají? Vyber zvíře, na které platí všechno.",
    ],
    e: "Sova ve dne spí, v noci loví, má velké oči a houká. Splní všechny stopy.",
  },
  {
    q: "Vyřeš hádanku: „Postavíš ho ze sněhu, nos má z mrkve.“", a: "sněhulák", emoji: "☃️",
    d: [
      ["iglú", "Iglú se staví ze sněhu, ale je to domeček, nos z mrkve nemá."],
      ["rampouch", "Rampouch je z ledu a visí ze střechy, nestaví se a nos nemá."],
      ["sáňky", "Na sáňkách jezdíš po sněhu, ale nestavíš je ze sněhu."],
    ],
    h: [
      "Co stavíš na zahradě, když napadne hodně sněhu?",
      "První stopa (postavíš ze sněhu) platí i pro iglú, takže rozhodne druhá stopa: nos z mrkve. Co ze sněhu má nos, oči z uhlíků a někdy i hrnec na hlavě?",
    ],
    e: "Ze sněhu se staví sněhulák a nos mu děláme z mrkve. Iglú nos nemá.",
  },
  {
    q: "Vyřeš hádanku: „Čím víc z ní odebereš, tím je větší.“", a: "jáma", emoji: "🕳️",
    d: [
      ["hromada", "U hromady je to naopak: čím víc z ní odebereš, tím je menší."],
      ["kaluž", "Když z kaluže nabereš vodu, zmenší se, nezvětší."],
      ["krabice", "Krabice zůstane stejně velká, ať z ní vyndáš cokoli."],
    ],
    h: [
      "Obvykle se věc zmenší, když z ní bereš. Co se naopak zvětší?",
      "Představ si, že kopeš lopatou do země. Každá lopata hlíny, kterou vyhodíš ven, udělá díru v zemi hlubší a širší. Jak se ta díra jmenuje?",
    ],
    e: "Když z jámy vyhazuješ hlínu, jáma se zvětšuje. U hromady je to přesně naopak.",
  },
  // Doplň rým: slovo musí dávat smysl i rýmovat se.
  {
    q: "Doplň rým: „Na zahradě kvete mák, / na plotě si zpívá …“", a: "pták", emoji: "🐦",
    d: [
      ["kos", "Kos na plotě zpívat může, ale na „mák“ se nerýmuje."],
      ["vrabec", "Vrabec se hodí smyslem, ale na „mák“ se nerýmuje."],
      ["sýkorka", "Sýkorka se na „mák“ nerýmuje, i když smyslem sedí."],
    ],
    h: [
      "Jak končí slovo „mák“? Stejně musí znít konec druhého verše.",
      "Všechny možnosti jsou ptáci, takže smyslem sedí každá. Rozhodne rým: vyslov „mák“ a pak každou možnost. Která končí na „-ák“?",
    ],
    e: "„Mák – pták“ se rýmuje, oba konce zní „-ák“. Ostatní ptáci smyslem sedí, ale nerýmují se.",
  },
  {
    q: "Doplň rým: „Malý zajíc v trávě skáče, / mrkev chroupe, nikdy …“", a: "nepláče", emoji: "🐰",
    d: [
      ["nespí", "„Nespí“ se na „skáče“ nerýmuje."],
      ["nezpívá", "„Nezpívá“ se na „skáče“ nerýmuje a zajíc stejně nezpívá."],
      ["nekřičí", "„Nekřičí“ končí jinak než „skáče“, rým nevznikne."],
    ],
    h: [
      "Poslechni si konec slova „skáče“. Která možnost zní na konci stejně?",
      "Rým vznikne, když se shoduje konec slov: „ská-če“. Najdi slovo, které končí na „-áče“ a zároveň dává smysl o veselém zajíci.",
    ],
    e: "„Skáče – nepláče“ se rýmuje (-áče) a smysl sedí: veselý zajíc nepláče.",
  },
  {
    q: "Doplň rým: „Za humny je zelený les, / na louce štěká černý …“", a: "pes", emoji: "🐕",
    d: [
      ["pejsek", "„Pejsek“ smyslem sedí, ale na „les“ se nerýmuje."],
      ["psík", "„Psík“ znamená totéž, ale s „les“ se nerýmuje."],
      ["vlk", "Vlk se na „les“ nerýmuje a navíc neštěká, ale vyje."],
    ],
    h: [
      "Kdo štěká? Pozor, správné slovo se musí i rýmovat na „les“.",
      "„Pejsek“ i „psík“ štěkají, ale zní jinak než „les“. Hledej krátké slovo, které končí na „-es“ a označuje zvíře, které štěká.",
    ],
    e: "„Les – pes“ se rýmuje (-es). Pejsek a psík znamenají totéž, ale rým nevytvoří.",
  },
  {
    q: "Doplň rým: „Venku je už černá noc, / Honzík spí a zívá …“", a: "moc", emoji: "😴",
    d: [
      ["hodně", "„Hodně“ znamená totéž, ale na „noc“ se nerýmuje."],
      ["trochu", "„Trochu“ se na „noc“ nerýmuje."],
      ["často", "„Často“ se na „noc“ nerýmuje."],
    ],
    h: [
      "Jak končí slovo „noc“? Hledej slovo, které zní na konci stejně.",
      "„Hodně“ by smyslem sedělo, ale rým nevytvoří. Potřebuješ krátké slovo s koncem „-oc“, které znamená něco jako „hodně“.",
    ],
    e: "„Noc – moc“ se rýmuje (-oc). „Hodně“ znamená totéž, ale rým nevytvoří.",
  },
  {
    q: "Doplň rým: „Na zahradě roste hruška, / na ní sedí malá …“", a: "muška", emoji: "🍐",
    d: [
      ["moucha", "„Moucha“ je skoro totéž, ale na „hruška“ se nerýmuje."],
      ["včelka", "Včelka na hrušce sedět může, ale na „hruška“ se nerýmuje."],
      ["sýkorka", "„Sýkorka“ končí jinak než „hruška“, rým nevznikne."],
    ],
    h: [
      "Který hmyz nebo pták sedí na hrušce a zní na konci jako „hruška“?",
      "Konec slova „hru-ška“ musí zaznít i na konci druhého verše. „Moucha“ má podobný význam, ale končí jinak. Hledej zdrobnělinu s koncem „-uška“.",
    ],
    e: "„Hruška – muška“ se rýmuje (-uška). Moucha znamená totéž, ale rým nevytvoří.",
  },
  {
    q: "Doplň rým: „Na nebi je bílý mrak, / nad polem nám letí …“", a: "drak", emoji: "🪁",
    d: [
      ["balónek", "Balónek letět může, ale na „mrak“ se nerýmuje."],
      ["ptáček", "„Ptáček“ se na „mrak“ nerýmuje."],
      ["letadlo", "Letadlo letí, ale na „mrak“ se nerýmuje."],
    ],
    h: [
      "Co pouštějí děti na podzim nad polem na provázku?",
      "Všechny možnosti mohou letět, rozhodne tedy rým. Vyslov „mrak“ a hledej slovo, které končí na „-ak“. Je to papírová hračka na provázku.",
    ],
    e: "„Mrak – drak“ se rýmuje (-ak) a papírový drak nad polem opravdu létá.",
  },
];

function gen(level: number): PracticeTask[] {
  if (level === 1) return shuffle(POOL_L1).map(zanrTask);
  if (level === 2) return shuffle(POOL_L2).map(zanrTask);
  return shuffle(POOL_L3).map(task);
}

export const POHADKARIKANKABASEN: TopicMetadata[] = [
  {
    id: "g2-cjl-literarni-vychova-literarni-zanry-pohadka-rikanky-basen-hadanka",
    rvpNodeId: "g2-cjl-literarni-vychova-literarni-zanry-pohadka-rikanky-basen-hadanka",
    title: "Pohádka, říkanka, báseň, hádanka",
    studentTitle: "Pohádky a básně",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Literární žánry",
    briefDescription: "Poznáš pohádku, říkanku, báseň a hádanku.",
    keywords: ["pohádka", "říkanka", "báseň", "hádanka", "literární žánr", "rým"],
    goals: [
      "Rozlišit pohádku, říkanku, báseň a hádanku.",
      "Vědět, co je typické pro každý žánr.",
    ],
    boundaries: ["Pouze základní literární žánry pro 2. třídu.", "Bez složité literární teorie."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Pohádka = příběh s kouzlem. Říkanka = krátký rýmovaný text pro hru. Báseň = rým a pocit. Hádanka = co je to?",
      steps: ["Přečti popis nebo ukázku.", "Má příběh a kouzlo? → pohádka.", "Kratičký rýmek pro hru? → říkanka.", "Rýmovaný text s pocitem? → báseň.", "Popisuje a ptá se 'co je to'? → hádanka."],
      commonMistake: "Záměna říkanky a básně — říkanka je pro hry a opakuje se, báseň je umělecký text s hlubším obsahem.",
      example: "Byl jednou jeden... → pohádka. Kolo, kolo mlýnské → říkanka. Mám čtyři nohy, co jsem? → hádanka.",
    },
  },
];
