/**
 * Zeměpis 6. ročník — Tvar Země, pohyby Země, střídání dne a noci (select_one).
 *
 * Faktické téma s několika šablonami se souřadnicemi. Každá úloha má čtyři
 * možnosti, právě jednu správnou a optionFeedback u každého distraktoru.
 *
 * Chybový model (každý distraktor = jedna typická chyba):
 *  • záměna dvou pohybů: den a noc připsané oběhu, roční doby otáčení,
 *    prohozené doby trvání (otočka za rok, oběh za den);
 *  • geocentrická představa: Slunce obíhá kolem stojící Země;
 *  • obrácený směr otáčení: Země se prý točí na západ, a proto je ráno dřív
 *    na západě;
 *  • chybný tvar Země (placka, dokonalá koule, zploštění na rovníku) a špatně
 *    vyložené důkazy; u souřadnic posun o čtvrt otočky místo o půl nebo
 *    posun špatným směrem.
 *
 *  • L1 — zapamatování: banka faktů (tvar, doby trvání, směr, osa, názvy pohybů, rovník).
 *  • L2 — použití: jev → příčina; dvě města na stejné rovnoběžce; opačná strana
 *    Země (180°); počet otoček za dané období.
 *  • L3 — analýza a přenos: myšlenkové pokusy, důkazy tvaru Země, jev, který
 *    otáčení NEzpůsobuje, a denní doba na místě o 90° délky dál na rovníku.
 *
 * Hodiny se v úlohách neuvádějí (časová pásma patří do jiného podtématu),
 * rozlišují se jen denní doby. Úlohy s 90° leží na rovníku, kde Slunce
 * vychází celý rok zhruba v 6 hodin místního času, takže klíč platí vždy.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pad } from "@/lib/czechGrammar";
import {
  buildChoiceTask as choice,
  losUlohy,
  ruzneUlohy,
  pick,
  rnd,
  cis,
  sirka,
  delka,
  type Distractor,
} from "./_shared";

interface Polozka {
  q: string;
  correct: string;
  distractors: Distractor[];
  hints: [string, string];
  explanation: string;
}

const OTACENI = "Otáčení kolem osy trvá asi jeden den a způsobuje střídání dne a noci.";
const OBEH = "Oběh kolem Slunce trvá asi jeden rok a spolu se sklonem osy způsobuje roční doby.";
const ZDANLIVE = "Slunce se po obloze pohybuje jen zdánlivě. Ve skutečnosti se otáčí Země a my s ní.";
const SMER = "Země se otáčí od západu k východu, proto se Slunce po obloze zdánlivě posouvá opačně, od východu k západu.";

// ── L1 — ZAPAMATOVÁNÍ: fakt podle názvu pojmu ──────────────────────────────
export const POOL_L1: Polozka[] = [
  {
    q: "Jaký tvar má Země?",
    correct: "Koule mírně zploštělá u pólů",
    distractors: [
      { value: "Koule mírně zploštělá na rovníku", why: "Je to naopak: u rovníku je Země mírně vyboulená a zploštělá je u pólů." },
      { value: "Dokonalá koule bez odchylek", why: "Země není úplně pravidelná koule. U pólů je mírně zploštělá, u rovníku mírně vyboulená." },
      { value: "Plochý kruh obklopený mořem", why: "Země není placka. Dokazuje to třeba oblý stín Země na Měsíci nebo snímky z vesmíru." },
    ],
    hints: [
      "Vzpomeň si, jak Zemi zobrazuje globus, a pak na to, co je na skutečné Zemi jinak.",
      "Rychlé otáčení Zemi trochu „roztáhlo“ v místě, kde se točí nejrychleji. Kde je tedy vyboulená a kde zploštělá?",
    ],
    explanation: "Země má tvar koule mírně zploštělé u pólů a vyboulené u rovníku. Přesnému tvaru se říká geoid. Rozdíl je malý, proto nám globus jako koule stačí.",
  },
  {
    q: "Jak dlouho trvá jedno otočení Země kolem vlastní osy?",
    correct: `Asi ${pad(24, "HODINA")}`,
    distractors: [
      { value: `Asi ${pad(365, "DEN")}`, why: `Tak dlouho trvá oběh kolem Slunce, ne otočení kolem osy. ${OTACENI}` },
      { value: `Asi ${pad(12, "HODINA")}`, why: "To je zhruba jen den bez noci. Jedno otočení zahrnuje den i noc dohromady." },
      { value: `Asi ${pad(30, "DEN")}`, why: "Zhruba tak dlouho obíhá Měsíc kolem Země. Země se kolem své osy otočí mnohem rychleji." },
    ],
    hints: [
      "Rozmysli si, který pohyb Země trvá jeden den a který jeden rok.",
      "Jedno otočení kolem osy znamená, že se na tvém místě vystřídá jeden den a jedna noc. Kolik hodin to dohromady je?",
    ],
    explanation: "Země se kolem své osy otočí jednou asi za 24 hodin. Proto má den i s nocí 24 hodin.",
  },
  {
    q: "Jak dlouho trvá jeden oběh Země kolem Slunce?",
    correct: `Asi ${pad(365, "DEN")} a ${pad(6, "HODINA")}`,
    distractors: [
      { value: `Asi ${pad(24, "HODINA")}`, why: `Tak dlouho trvá otočení kolem osy. ${OBEH}` },
      { value: `Asi ${pad(30, "DEN")}`, why: "Tak dlouho zhruba obíhá Měsíc kolem Země. Země oběhne Slunce až za rok." },
      { value: `Asi ${pad(360, "DEN")}`, why: "360 je počet stupňů celého kruhu, ne počet dní. Oběh trvá o něco déle, proto každý čtvrtý rok přidáváme přestupný den." },
    ],
    hints: [
      "Oběh kolem Slunce je delší z obou pohybů Země. Kterou jednotku času měří?",
      "Jeden oběh kolem Slunce je jeden rok. Vzpomeň si, proč máme každý čtvrtý rok přestupný: kalendářní rok je o kousek kratší než oběh.",
    ],
    explanation: "Země oběhne Slunce asi za 365 dní a 6 hodin, tedy za jeden rok. Přebývající čtvrtdny se každé čtyři roky sečtou do přestupného dne.",
  },
  {
    q: "Kterým směrem se Země otáčí kolem své osy?",
    correct: "Od západu k východu",
    distractors: [
      { value: "Od východu k západu", why: `Tímto směrem se po obloze zdánlivě posouvá Slunce. ${SMER}` },
      { value: "Od severu k jihu", why: "Osa prochází severním a jižním pólem a Země se točí kolem ní, tedy ve směru západ–východ, ne mezi póly." },
      { value: "Od jihu k severu", why: "Póly leží na ose otáčení, takže se k nim Země neotáčí. Točí se kolem osy ve směru západ–východ." },
    ],
    hints: [
      "Slunce se po obloze zdánlivě posouvá opačným směrem, než se otáčí Země. Kudy Slunce putuje přes den?",
      "Slunce vychází na východě a zapadá na západě. Země se přitom točí proti tomuto zdánlivému pohybu, tedy k té straně obzoru, kde se Slunce ráno objeví.",
    ],
    explanation: "Země se otáčí od západu k východu. Proto se nám zdá, že Slunce a hvězdy putují po obloze od východu k západu.",
  },
  {
    q: "Kterými místy prochází zemská osa?",
    correct: "Severním a jižním pólem",
    distractors: [
      { value: "Dvěma body na rovníku", why: "Rovník leží uprostřed mezi póly a je od osy nejdál. Osa prochází oběma póly." },
      { value: "Středem Země a Sluncem", why: "Zemská osa nesměřuje ke Slunci. Je to myšlená přímka, kolem které se Země otáčí, a prochází póly." },
      { value: "Severním pólem a rovníkem", why: "Osa prochází středem Země, takže ze severního pólu vede až k jižnímu, ne k rovníku." },
    ],
    hints: [
      "Zemská osa je myšlená přímka, kolem které se Země otáčí. Která místa se při otáčení vůbec nepohybují?",
      "Na globusu je osa tyčka, na které koule sedí. Kde tyčka vstupuje do koule a kde z ní vychází? Obě ta místa leží od rovníku co nejdál a při otáčení zůstávají stát.",
    ],
    explanation: "Zemská osa je myšlená přímka, která prochází středem Země, severním a jižním pólem. Kolem ní se Země otáčí.",
  },
  {
    q: "Jak se nazývá pohyb Země kolem vlastní osy?",
    correct: "Otáčení (rotace)",
    distractors: [
      { value: "Oběh (revoluce)", why: `Oběhem se nazývá pohyb Země kolem Slunce. ${OTACENI}` },
      { value: "Zdánlivý pohyb", why: "Zdánlivý je pohyb Slunce po obloze, který jen vidíme. Pohyb Země kolem osy je skutečný." },
      { value: "Přibližování ke Slunci", why: "Země se ke Slunci střídavě jen málo přibližuje a vzdaluje, ale to s pohybem kolem osy nesouvisí." },
    ],
    hints: [
      "Země koná dva pohyby: jeden kolem sebe samé a druhý kolem Slunce. Každý má svůj název.",
      "Když se točíš na místě jako káča, říká se tomu jinak, než když obcházíš kolem stolu. Který název patří točení na místě?",
    ],
    explanation: "Pohyb Země kolem vlastní osy se nazývá otáčení neboli rotace. Pohyb kolem Slunce je oběh neboli revoluce.",
  },
  {
    q: "Jak se nazývá pohyb Země kolem Slunce?",
    correct: "Oběh (revoluce)",
    distractors: [
      { value: "Otáčení (rotace)", why: `Otáčení je pohyb Země kolem vlastní osy. ${OBEH}` },
      { value: "Zdánlivý pohyb", why: "Zdánlivě se po obloze pohybuje Slunce. Pohyb Země kolem Slunce je skutečný a má vlastní název." },
      { value: "Přibližování ke Slunci", why: "Země se ke Slunci během roku jen nepatrně přibližuje a vzdaluje, protože její dráha je skoro kruhová. Je to ale popis vzdálenosti, ne název pohybu." },
    ],
    hints: [
      "Rozliš pohyb kolem sebe samé a pohyb kolem jiného tělesa. Který z nich tady hledáš?",
      "Když obcházíš kolem stolu dokola, děláš jiný pohyb, než když se točíš na místě. Jak se jmenuje ten kolem stolu?",
    ],
    explanation: "Pohyb Země kolem Slunce se nazývá oběh neboli revoluce a trvá asi jeden rok.",
  },
  {
    q: "Které tvrzení o pohybech Země, Slunce a Měsíce je pravdivé?",
    correct: "Země obíhá kolem Slunce a Měsíc kolem Země",
    distractors: [
      { value: "Slunce obíhá kolem Země a Měsíc kolem Slunce", why: `Tak to jen vypadá z pozorování oblohy. ${ZDANLIVE}` },
      { value: "Země obíhá kolem Měsíce a Měsíc kolem Slunce", why: "Měsíc je menší než Země a je její družicí, proto obíhá on kolem Země, ne Země kolem něj." },
      { value: "Slunce i Měsíc obíhají kolem stojící Země", why: `Země nestojí, otáčí se a obíhá kolem Slunce. ${ZDANLIVE}` },
    ],
    hints: [
      "Menší těleso obíhá kolem většího. Seřaď si v duchu Slunce, Zemi a Měsíc podle velikosti.",
      "Slunce je hvězda uprostřed Sluneční soustavy, Měsíc je družice Země. Kolem čeho tedy obíhá Země a kolem čeho Měsíc?",
    ],
    explanation: "Uprostřed Sluneční soustavy je Slunce a Země kolem něj obíhá. Měsíc je přirozená družice Země a obíhá kolem ní.",
  },
  {
    q: "Co je rovník?",
    correct: "Kružnice uprostřed mezi oběma póly",
    distractors: [
      { value: "Čára spojující severní a jižní pól", why: "Čára od pólu k pólu je poledník. Rovník vede napříč, uprostřed mezi póly." },
      { value: "Kružnice vedoucí přes Evropu", why: "Evropa leží celá severně od rovníku. Rovník prochází třeba Afrikou a Jižní Amerikou." },
      { value: "Osa, kolem které se Země otáčí", why: "Osa prochází póly a středem Země. Rovník je kružnice na povrchu, od osy nejdál." },
    ],
    hints: [
      "Rovník dělí Zemi na severní a jižní polokouli. Kudy tedy musí vést?",
      "Rovník je stejně daleko od severního i od jižního pólu a obepíná Zemi dokola. Která možnost tohle splňuje?",
    ],
    explanation: "Rovník je kružnice, která vede kolem Země uprostřed mezi severním a jižním pólem. Dělí Zemi na severní a jižní polokouli a je to nejdelší rovnoběžka.",
  },
  {
    q: "Jak dlouhý je přibližně obvod Země na rovníku?",
    correct: `Asi ${cis(40000)} km`,
    distractors: [
      { value: `Asi ${cis(4000)} km`, why: "O jednu nulu méně. Tolik měří zhruba cesta přes Evropu, obvod celé Země je desetkrát delší." },
      { value: `Asi ${cis(400000)} km`, why: "O jednu nulu více. Tak daleko je zhruba Měsíc, obvod Země je desetkrát menší." },
      { value: `Asi ${cis(12000)} km`, why: "Zhruba tolik měří průměr Země, tedy cesta napříč středem. Obvod kolem dokola je víc než trojnásobný." },
    ],
    hints: [
      "Pozor na řád čísla: obvod je cesta kolem celé Země, mnohem delší než cesta přes jeden světadíl.",
      "Průměr Země je asi 12 700 km a obvod kruhu je zhruba třikrát delší než průměr. Ke kterému z nabízených čísel se tak dostaneš? Řád výsledku poznáš i bez přesného počítání.",
    ],
    explanation: "Obvod Země na rovníku je asi 40 000 km. Je to zhruba trojnásobek průměru Země (asi 12 700 km).",
  },
  {
    q: "Kolikrát se Země otočí kolem své osy během jednoho oběhu kolem Slunce?",
    correct: "Asi 365krát",
    distractors: [
      { value: "Asi jednou", why: "Jeden oběh trvá rok, ale jedna otočka jen den. Za rok se tedy Země otočí mnohokrát." },
      { value: "Asi 12krát", why: "Dvanáct je počet měsíců v roce. Otočka ale trvá den, ne měsíc." },
      { value: "Asi 24krát", why: "24 je počet hodin jednoho dne. Otočka trvá celý den, ne hodinu." },
    ],
    hints: [
      "Jeden oběh trvá rok a jedna otočka den. Kolik dní má rok?",
      "Za každý den v roce proběhne jedno otočení. Stačí si vzpomenout, kolik dní trvá jeden rok.",
    ],
    explanation: "Oběh kolem Slunce trvá asi 365 dní a každý den se Země jednou otočí kolem osy. Za rok se tedy otočí asi 365krát.",
  },
  {
    q: "Které těleso obíhá kolem Země?",
    correct: "Měsíc",
    distractors: [
      { value: "Slunce", why: `Slunce kolem Země neobíhá, je to naopak. ${ZDANLIVE}` },
      { value: "Mars", why: "Mars je planeta a obíhá kolem Slunce, stejně jako Země." },
      { value: "Polárka", why: "Polárka je vzdálená hvězda. Jen se zdá, že stojí na obloze na místě, protože leží skoro v prodloužení zemské osy." },
    ],
    hints: [
      "Hledáš přirozenou družici Země. Kolem čeho obíhají planety a kolem čeho družice?",
      "Toto těleso vidíme na noční obloze, mění se jeho tvar od úplňku k novu a Zemi oběhne zhruba za čtyři týdny.",
    ],
    explanation: "Kolem Země obíhá její přirozená družice Měsíc, jeden oběh trvá asi měsíc. Slunce ani planety kolem Země neobíhají.",
  },
  {
    q: "Jak se nazývá skutečný tvar Země, který se nedá přesně popsat žádným jednoduchým tělesem?",
    correct: "Geoid",
    distractors: [
      { value: "Globus", why: "Globus je zmenšený model Země ve tvaru koule, ne název jejího skutečného tvaru." },
      { value: "Kruh", why: "Kruh je plochý útvar. Země je těleso, ne placka." },
      { value: "Polokoule", why: "Polokoule je jen polovina Země, třeba severní nebo jižní. Tvar celé Země to nepopisuje." },
    ],
    hints: [
      "Hledáš odborný název. Není to model ani část Země, ale tvar celé Země.",
      "Název je složený z řeckého slova pro Zemi (geo-) a znamená zhruba „tvar podobný Zemi“.",
    ],
    explanation: "Skutečnému tvaru Země se říká geoid. Zjednodušeně je to koule mírně zploštělá u pólů. Globus je jen její zmenšený model.",
  },
  {
    q: "Jak se Země otáčí, když se na ni díváme shora nad severním pólem?",
    correct: "Proti směru hodinových ručiček",
    distractors: [
      { value: "Po směru hodinových ručiček", why: "Tak by se točila při pohledu zespodu, od jižního pólu. Shora nad severním pólem je to naopak, protože se Země točí na východ." },
      { value: "Každý den jiným směrem", why: "Země se otáčí stále stejným směrem, od západu k východu. Proto Slunce vychází vždy na východě." },
      { value: "Vůbec, otáčí se jen Slunce", why: `Země se otáčí. ${ZDANLIVE}` },
    ],
    hints: [
      "Země se točí od západu k východu. Představ si to na globusu, na který se díváš shora.",
      "Podívej se na globus shora a otáčej jím tak, aby se Evropa posouvala směrem k Asii, tedy na východ. Porovnej tento pohyb s ručičkami hodin.",
    ],
    explanation: "Země se otáčí od západu k východu. Při pohledu shora nad severním pólem to vypadá jako otáčení proti směru hodinových ručiček.",
  },
  {
    q: "Jak velká část Země je v každém okamžiku osvětlená Sluncem?",
    correct: "Asi polovina",
    distractors: [
      { value: "Celá Země", why: "Slunce svítí na Zemi jen z jedné strany. Odvrácená strana je ve stínu a je tam noc." },
      { value: "Asi čtvrtina", why: "Koule osvětlená z jedné strany má světlou celou přivrácenou polovinu, ne jen čtvrtinu." },
      { value: "Jen okolí rovníku", why: "Světlo dopadá na celou přivrácenou stranu, tedy i daleko od rovníku. Kde je den a kde noc, se mění otáčením." },
    ],
    hints: [
      "Posviť baterkou na míč ze strany. Jak velkou část míče světlo zasáhne?",
      "Kulaté těleso osvětlené z jedné strany má jednu stranu světlou a druhou tmavou. Na světlé straně je den, na tmavé noc.",
    ],
    explanation: "Slunce osvětluje vždy tu polovinu Země, která je k němu přivrácená. Tam je den, na odvrácené polovině je noc.",
  },
  {
    q: "Na které straně oblohy Slunce ráno vychází?",
    correct: "Na východě",
    distractors: [
      { value: "Na západě", why: "Na západě Slunce večer zapadá. Ráno vychází na opačné straně." },
      { value: "Na severu", why: "Na severu Slunce u nás nikdy nestojí. Vychází na východě a v poledne je na jihu." },
      { value: "Na jihu", why: "Na jihu je Slunce u nás v poledne, nejvýš na obloze. Ráno se objeví na východě." },
    ],
    hints: [
      "Vzpomeň si, kde Slunce večer zapadá. Ráno se objeví na opačné straně.",
      "Světové strany se řídí Sluncem: v poledne je u nás na jihu a večer zapadá na západě. Kde tedy začíná svou denní dráhu?",
    ],
    explanation: "Slunce ráno vychází na východě, v poledne je u nás na jihu a večer zapadá na západě. Je to zdánlivý pohyb, který způsobuje otáčení Země.",
  },
];

// ── L2 (a) — POUŽITÍ: jev → příčina ────────────────────────────────────────
export const POOL_L2: Polozka[] = [
  {
    q: "Den a noc se na Zemi střídají, protože…",
    correct: "Země se otáčí kolem své osy",
    distractors: [
      { value: "Země obíhá kolem Slunce", why: `Oběh kolem Slunce trvá celý rok a způsobuje roční doby, ne den a noc. ${OTACENI}` },
      { value: "Slunce obíhá kolem Země", why: ZDANLIVE },
      { value: "Měsíc v noci zakryje Slunce", why: "Měsíc Slunce zakryje jen vzácně, při zatmění Slunce. Noc je tam, kde je Země ke Slunci odvrácená." },
    ],
    hints: [
      "Rozmysli si, který pohyb Země trvá jeden den a který jeden rok.",
      "Den a noc se vystřídají jednou za 24 hodin. Hledej pohyb, který trvá stejně dlouho a natáčí k Slunci pokaždé jinou stranu Země.",
    ],
    explanation: "Země se otáčí kolem své osy, a tak se ke Slunci natáčí postupně různá místa. Na přivrácené straně je den, na odvrácené noc. Jedna otočka trvá asi 24 hodin.",
  },
  {
    q: "Slunce ráno vychází na východní straně oblohy, protože…",
    correct: "Země se otáčí od západu k východu",
    distractors: [
      { value: "Země se otáčí od východu k západu", why: "Kdyby se Země točila na západ, vycházelo by Slunce na západě. Slunce se na obloze posouvá opačně, než se točí Země." },
      { value: "Slunce se v noci přesune na východ", why: ZDANLIVE },
      { value: "Země obíhá kolem Slunce na východ", why: `Oběh trvá rok, a proto nemůže za to, co se opakuje každé ráno. ${OTACENI}` },
    ],
    hints: [
      "Představ si globus: otáčej jím na východ. Které místo se dostane do světla dřív?",
      "Otáčíš se se Zemí. Slunce se objeví na té straně obzoru, ke které se tvoje místo otáčením právě natáčí.",
    ],
    explanation: "Země se otáčí od západu k východu. Místo, kde stojíme, se tak ráno natáčí ke Slunci směrem na východ, a proto se Slunce objeví na východní straně oblohy.",
  },
  {
    q: "Slunce se během dne zdánlivě posouvá po obloze od východu k západu, protože…",
    correct: "Země se otáčí opačným směrem, na východ",
    distractors: [
      { value: "Slunce opravdu obíhá kolem Země na západ", why: ZDANLIVE },
      { value: "Země obíhá kolem Slunce na západ", why: `Oběh trvá celý rok, pohyb Slunce po obloze se ale opakuje každý den. ${OTACENI}` },
      { value: "Země se otáčí stejným směrem, na západ", why: "Při jízdě vlakem ubíhají stromy opačným směrem, než jedeš. Stejně tak se Slunce posouvá opačně, než se otáčí Země." },
    ],
    hints: [
      "Vzpomeň si na jízdu vlakem: kterým směrem ubíhá krajina za oknem, když vlak jede dopředu?",
      "Pohyb, který vidíme na obloze, je jen odraz našeho vlastního pohybu. Má stejný, nebo opačný směr než otáčení Země?",
    ],
    explanation: "Slunce se po obloze pohybuje jen zdánlivě. Země se otáčí na východ, a proto se nám zdá, že Slunce putuje opačně, od východu k západu.",
  },
  {
    q: "Hvězdy se během noci zdánlivě posouvají po obloze, protože…",
    correct: "Země se otáčí kolem své osy",
    distractors: [
      { value: "Hvězdy obíhají kolem Země", why: "Hvězdy jsou velmi daleko a kolem Země neobíhají. Posouvají se jen zdánlivě, protože se otáčí Země." },
      { value: "Země obíhá kolem Slunce", why: `Oběh je příliš pomalý, za jednu noc Země urazí jen malý kousek své roční dráhy. ${OTACENI}` },
      { value: "Hvězdy se během noci vzdalují", why: "Vzdalování by hvězdy jen zmenšovalo, neposouvalo by je po obloze. Posun způsobuje otáčení Země." },
    ],
    hints: [
      "Za jednu noc se hvězdy posunou přes velkou část oblohy. Který pohyb Země je tak rychlý?",
      "Hvězdy se posouvají stejně jako Slunce ve dne, od východu k západu. Co způsobuje zdánlivý pohyb Slunce? Hvězdy putují po obloze ze stejného důvodu.",
    ],
    explanation: "Otáčení Země způsobuje zdánlivý pohyb všech těles na obloze: Slunce ve dne a hvězd v noci. Hvězdy samy kolem Země neobíhají.",
  },
  {
    q: "Roční doby se na Zemi střídají, protože…",
    correct: "Země obíhá kolem Slunce se skloněnou osou",
    distractors: [
      { value: "Země se otáčí kolem své osy", why: `Otáčení se opakuje každý den, roční doby se ale střídají za rok. ${OBEH}` },
      { value: "Země je v létě blíž ke Slunci", why: "Vzdálenost od Slunce se během roku mění jen málo a roční doby nezpůsobuje. Rozhoduje sklon zemské osy při oběhu." },
      { value: "Slunce obíhá kolem Země jednou za rok", why: `Kolem Slunce obíhá Země, ne naopak. ${ZDANLIVE}` },
    ],
    hints: [
      "Roční doby se vystřídají jednou za rok. Který pohyb Země trvá rok?",
      "Při oběhu míří osa Země stále stejným směrem, a tak je ke Slunci během roku víc natočená jednou severní, jindy jižní polokoule.",
    ],
    explanation: "Roční doby způsobuje oběh Země kolem Slunce spolu se sklonem zemské osy. Polokoule natočená ke Slunci dostává víc světla a tepla a má léto.",
  },
  {
    q: "Na Zemi je v každém okamžiku na jedné polovině den a na druhé noc, protože…",
    correct: "Země je koule osvětlená Sluncem z jedné strany",
    distractors: [
      { value: "Země je placka, kterou Slunce obchází dokola", why: "Země není placka a Slunce kolem ní neobíhá. Je to koule, na kterou Slunce svítí z jedné strany." },
      { value: "Slunce svítí jen na severní polokouli", why: "Slunce svítí na celou přivrácenou polovinu Země, na sever i na jih od rovníku." },
      { value: "Měsíc zakrývá polovinu Země před Sluncem", why: "Měsíc je mnohem menší než Země a polovinu Země zakrýt nemůže. Noc je na straně Země odvrácené od Slunce." },
    ],
    hints: [
      "Posviť baterkou na míč. Jak se rozdělí světlo a stín?",
      "Slunce je jedno a svítí z jednoho směru. Co to znamená pro kulaté těleso, které stojí v jeho světle?",
    ],
    explanation: "Země je koule a Slunce ji osvětluje z jedné strany. Přivrácená polovina má den, odvrácená noc. Otáčením se místa mezi oběma polovinami střídají.",
  },
  {
    q: `Rok trvá asi ${pad(365, "DEN")}, protože…`,
    correct: "tak dlouho trvá jeden oběh Země kolem Slunce",
    distractors: [
      { value: "tak dlouho trvá jedno otočení Země kolem osy", why: `Otočení kolem osy trvá jen jeden den. ${OBEH}` },
      { value: "tak dlouho trvá jeden oběh Měsíce kolem Země", why: "Měsíc oběhne Zemi asi za měsíc. Rok je doba oběhu Země kolem Slunce." },
      { value: "tak dlouho trvá jeden oběh Slunce kolem Země", why: `Slunce kolem Země neobíhá. ${ZDANLIVE}` },
    ],
    hints: [
      "Každá jednotka času má svůj pohyb: den, měsíc a rok. Který pohyb patří k roku?",
      "Den měří otočení Země, měsíc zhruba oběh Měsíce. Na rok zbývá nejdelší pohyb Země — ten, při kterém urazí celou svou dráhu kolem hvězdy uprostřed Sluneční soustavy.",
    ],
    explanation: "Rok je doba, za kterou Země jednou oběhne Slunce, asi 365 dní a 6 hodin. Den je doba jednoho otočení kolem osy.",
  },
  {
    q: `Den i s nocí trvá asi ${pad(24, "HODINA")}, protože…`,
    correct: "tak dlouho trvá jedno otočení Země kolem osy",
    distractors: [
      { value: "tak dlouho trvá jeden oběh Země kolem Slunce", why: `Oběh kolem Slunce trvá celý rok. ${OTACENI}` },
      { value: "tak dlouho trvá jeden oběh Slunce kolem Země", why: `Slunce kolem Země neobíhá. ${ZDANLIVE}` },
      { value: "tak dlouho trvá jeden oběh Měsíce kolem Země", why: "Měsíc oběhne Zemi asi za měsíc, ne za den." },
    ],
    hints: [
      "Rozmysli si, který pohyb Země se opakuje každý den.",
      "Za jeden den a jednu noc se tvoje místo jednou natočí ke Slunci a jednou od něj. Který pohyb to dělá?",
    ],
    explanation: "Den i s nocí je doba jednoho otočení Země kolem osy, asi 24 hodin. Za tu dobu se každé místo jednou natočí ke Slunci a jednou od něj.",
  },
];

// ── L3 (a, b, d) — ANALÝZA A PŘENOS: pokusy, důkazy, co otáčení nezpůsobuje ─
export const POOL_L3: Polozka[] = [
  {
    q: "Kdyby se Země otáčela opačným směrem, na které straně oblohy by Slunce ráno vycházelo?",
    correct: "Na západní straně oblohy",
    distractors: [
      { value: "Na východní straně oblohy", why: "Strana východu Slunce záleží na směru otáčení. Při opačném otáčení by se obrátil i zdánlivý pohyb Slunce." },
      { value: "Na severní straně oblohy", why: "Otáčení by pořád vedlo kolem stejné osy, jen opačně. Slunce by se tedy obrátilo mezi východem a západem, ne přesunulo na sever." },
      { value: "Na jižní straně oblohy", why: "Opačný směr otáčení prohodí jen východ a západ. Sever a jih určuje osa, a ta by zůstala stejná." },
    ],
    hints: [
      "Slunce se po obloze zdánlivě posouvá opačně, než se otáčí Země. Co se stane se zdánlivým pohybem, když se otáčení obrátí?",
      "Dnes se Země točí na východ a Slunce vychází na východě. Obrať směr otáčení a zeptej se, ke které straně obzoru by se tvoje místo ráno natáčelo. Právě tam by se Slunce objevilo nad obzorem jako první.",
    ],
    explanation: "Slunce vychází na té straně, ke které se místo otáčením natáčí. Kdyby se Země točila od východu k západu, natáčela by se ke Slunci na západ a Slunce by vycházelo na západě.",
  },
  {
    q: "Kdyby se Země vůbec neotáčela, ale dál obíhala kolem Slunce, jak dlouho by na jednom místě trval den a noc dohromady?",
    correct: "Asi jeden rok",
    distractors: [
      { value: "Asi jeden den", why: "Den a noc trvají den jen díky otáčení. Bez něj by se místo natočilo ke Slunci a od něj jen díky oběhu, tedy jednou za rok." },
      { value: "Asi jeden měsíc", why: "Měsíc je doba oběhu Měsíce kolem Země. Bez otáčení by střídání dne a noci řídil oběh Země kolem Slunce." },
      { value: "Asi půl roku", why: "Za půl roku by na místě byl jen den, nebo jen noc. Den a noc dohromady by trvaly celý oběh." },
    ],
    hints: [
      "Který pohyb by pak jako jediný měnil to, jakou stranou je Země natočená ke Slunci?",
      "Představ si, že obcházíš kolem lampy a stále se díváš na stejnou zeď. Za jak dlouho se lampa objeví na každé straně tvé hlavy?",
    ],
    explanation: "Bez otáčení by se strana Země přivrácená ke Slunci měnila jen při oběhu. Za jeden oběh, tedy za rok, by se na jednom místě vystřídal jeden dlouhý den a jedna dlouhá noc (každá zhruba půl roku).",
  },
  {
    q: "Kdyby se Země otáčela kolem osy pomaleji než dnes, jak by se změnil den a noc?",
    correct: "Den a noc by trvaly déle",
    distractors: [
      { value: "Den a noc by trvaly kratší dobu", why: "Pomalejší otáčení znamená, že jedna otočka trvá déle, a tedy i den a noc trvají déle." },
      { value: "Den a noc by trvaly stejně", why: "Délka dne a noci závisí právě na rychlosti otáčení. Pomalejší otáčení je prodlouží." },
      { value: "Den a noc by trvaly rok", why: "Rok by trvaly, jen kdyby se Země neotáčela vůbec. Při pomalejším otáčení se jen prodlouží." },
    ],
    hints: [
      "Délka dne a noci je doba jedné otočky. Co se stane s dobou jedné otočky, když se Země točí pomaleji?",
      "Když kolotoč zpomalí, trvá mu jedno kolo déle, nebo kratší dobu? Se Zemí je to stejné: jedno kolo je jedna otočka, tedy jeden den a jedna noc dohromady.",
    ],
    explanation: "Den a noc dohromady trvají jednu otočku Země. Pomalejší otáčení by jednu otočku prodloužilo, takže by den i noc trvaly déle. Rok by se nezměnil, ten závisí na oběhu.",
  },
  {
    q: "Kdyby Země obíhala kolem Slunce rychleji, ale otáčela se stejně jako dnes, co by se změnilo?",
    correct: "Zkrátil by se jen rok, den ne",
    distractors: [
      { value: "Zkrátil by se jen den, rok ne", why: `Rychlost oběhu ovlivní rok, ne den. ${OTACENI}` },
      { value: "Zkrátil by se den i rok", why: "Otáčení zůstává stejné, proto se den nezmění. Kratší by byl jen rok." },
      { value: "Zkrátil by se jen měsíc", why: "Měsíc souvisí s oběhem Měsíce kolem Země, a ten se v pokusu nemění. Rychlejší oběh Země zkrátí rok." },
    ],
    hints: [
      "Každý pohyb Země měří jinou dobu. Který z nich se v tomto pokusu mění?",
      "Otáčení zůstává, jak je, mění se jen oběh. Kterou jednotku času oběh určuje a která jednotka tedy zůstane beze změny?",
    ],
    explanation: "Rok je doba jednoho oběhu kolem Slunce. Rychlejší oběh by rok zkrátil. Den závisí na otáčení, které se nemění, takže by zůstal stejný.",
  },
  {
    q: "Loď odplouvá od pozorovatele na břehu na širé moře. Jak mizí za obzorem?",
    correct: "Nejdřív zmizí trup, stěžeň je vidět nejdéle",
    distractors: [
      { value: "Nejdřív zmizí stěžeň, trup je vidět nejdéle", why: "Je to naopak. Hladina se za lodí zakřivuje dolů, takže se nejdřív schová nejnižší část lodi." },
      { value: "Jen se zmenšuje, až zmizí celá najednou", why: "Tak by loď mizela na ploché Zemi. Na zakřivené Zemi se loď schovává za obzor postupně odspodu." },
      { value: "Nejdřív zmizí příď, záď je vidět nejdéle", why: "Loď se schovává za zakřivení Země odspodu nahoru, ne zepředu dozadu." },
    ],
    hints: [
      "Hladina moře není rovná, ale zakřivená jako povrch koule. Která část lodi se za ní schová jako první?",
      "Představ si, že se loď vzdaluje přes vrchol velkého kopce. Co z ní ještě vidíš, když už sjíždí z druhé strany? Nejníž položená část se za vyvýšeninou ztratí dřív než ta nejvyšší.",
    ],
    explanation: "Povrch Země je zakřivený, takže vzdalující se loď se za obzor schovává odspodu: nejdřív trup, nakonec stěžeň. Je to jeden z důkazů kulatosti Země.",
  },
  {
    q: "Při zatmění Měsíce padá na Měsíc stín Země. Jaký okraj má tento stín?",
    correct: "Vždy oblý",
    distractors: [
      { value: "Vždy rovný", why: "Rovný okraj by měl stín tělesa s rovnými hranami. Stín Země je oblý, protože Země je koule." },
      { value: "Někdy oblý, jindy rovný", why: "Takový stín by vrhala placka, podle toho, jak je natočená. Země vrhá oblý stín vždy, protože je to koule." },
      { value: "Vždy hranatý", why: "Hranatý stín by měla krychle nebo kvádr. Stín Země je oblý." },
    ],
    hints: [
      "Stín kopíruje tvar tělesa. Jaký stín vrhá míč, ať ho natočíš jakkoli?",
      "Placka vrhá stejný stín jako míč jen tehdy, když stojí čelem ke světlu. Které těleso vrhá stejný stín z každé strany?",
    ],
    explanation: "Stín Země na Měsíci má při každém zatmění oblý okraj. Tak se chová jen koule, proto je to důkaz, že Země je kulatá.",
  },
  {
    q: "Výprava plula stále na západ a nakonec se vrátila do výchozího přístavu od východu. Co tím dokázala?",
    correct: "Že Země je koule, kterou lze obeplout",
    distractors: [
      { value: "Že Země je placka obklopená mořem", why: "Po placce by výprava došla k okraji a zpět od východu by se nevrátila. To umožňuje jen kulatá Země." },
      { value: "Že se Země otáčí od východu k západu", why: "Obeplutí nic neříká o směru otáčení, a navíc se Země točí od západu k východu. Dokazuje, že Země je uzavřené kulaté těleso." },
      { value: "Že Slunce obíhá kolem stojící Země", why: `Obeplutí dokazuje tvar Země, ne pohyb Slunce. ${ZDANLIVE}` },
    ],
    hints: [
      "Zkus stále jít jedním směrem po míči a po stole. Kde se vrátíš na start z druhé strany?",
      "Návrat z opačné strany znamená, že cesta vede dokola. Co to říká o tvaru povrchu, po kterém výprava plula?",
    ],
    explanation: "Když se loď vrátí z opačné strany, přestože plula stále jedním směrem, obeplula uzavřený povrch. To je důkaz, že Země je kulatá.",
  },
  {
    q: "Které pozorování je důkazem, že Země je kulatá?",
    correct: "Snímky Země pořízené z vesmíru",
    distractors: [
      { value: "Východ Slunce na východní straně", why: "Místo východu Slunce ukazuje směr otáčení Země, ne její tvar." },
      { value: "Rovná hladina vody v rybníku", why: "Rybník je malý, zakřivení Země na něm nepoznáš. Rovná hladina kulatost nevyvrací ani nedokazuje." },
      { value: "Střídání čtyř ročních období", why: "Roční doby způsobuje oběh Země se skloněnou osou. O tvaru Země nic neříkají." },
    ],
    hints: [
      "Rozliš, co jev dokazuje: tvar Země, nebo její pohyb?",
      "Hledáš pozorování, na kterém je tvar Země přímo vidět, ne jev způsobený otáčením nebo oběhem.",
    ],
    explanation: "Snímky z vesmíru ukazují Zemi jako kouli. Dalšími důkazy jsou oblý stín Země na Měsíci, loď mizející za obzorem od trupu a obeplutí Země.",
  },
  {
    q: "Který z těchto jevů NENÍ způsoben otáčením Země kolem osy?",
    correct: "Střídání ročních období",
    distractors: [
      { value: "Střídání dne a noci", why: `Den a noc otáčení způsobuje. ${OTACENI}` },
      { value: "Zdánlivý pohyb hvězd v noci", why: "Hvězdy se po obloze posouvají právě proto, že se Země otáčí. Tento jev tedy otáčením způsobený je." },
      { value: "Zdánlivý pohyb Slunce ve dne", why: `Tento jev otáčení způsobuje. ${SMER}` },
    ],
    hints: [
      "U každého jevu se zeptej, jestli se opakuje každý den, nebo jednou za rok.",
      "Otáčení trvá den, oběh rok. Hledáš jev, který se opakuje v delším z obou cyklů, tedy ten, na který jedna otočka Země zdaleka nestačí.",
    ],
    explanation: "Den a noc a zdánlivý pohyb Slunce i hvězd způsobuje otáčení Země. Roční doby způsobuje oběh kolem Slunce se skloněnou osou.",
  },
  {
    q: "Který z těchto jevů způsobuje otáčení Země, a ne její oběh kolem Slunce?",
    correct: "Zdánlivý pohyb hvězd v noci",
    distractors: [
      { value: "Střídání ročních období", why: `Roční doby nezpůsobuje otáčení. ${OBEH}` },
      { value: "Délka jednoho roku", why: "Rok je doba jednoho oběhu kolem Slunce, s otáčením nesouvisí." },
      { value: "Delší dny v létě než v zimě", why: "Délka dne se během roku mění kvůli oběhu Země se skloněnou osou, ne kvůli otáčení." },
    ],
    hints: [
      "Rozděl jevy na denní a roční. Který z nich se odehraje během jedné noci?",
      "Otáčení se projevuje na obloze každý den a každou noc. Který jev pozoruješ už za pár hodin?",
    ],
    explanation: "Hvězdy se po obloze zdánlivě posouvají během jedné noci, protože se Země otáčí. Roční doby, délka roku i rozdílná délka dne v létě a v zimě souvisejí s oběhem.",
  },
  {
    q: "Která doba trvání NEZÁVISÍ na otáčení Země kolem osy?",
    correct: "Délka jednoho roku",
    distractors: [
      { value: "Délka jednoho dne a noci", why: `Den a noc jsou právě jedna otočka. ${OTACENI}` },
      { value: "Doba od poledne do poledne", why: "Od jednoho poledne k dalšímu se Země jednou otočí, takže tahle doba na otáčení závisí." },
      { value: "Doba od půlnoci do půlnoci", why: "Mezi dvěma půlnocemi uplyne jedna otočka Země, takže tahle doba na otáčení závisí." },
    ],
    hints: [
      "U každé doby se zeptej, jestli ji měří otočka Země, nebo oběh kolem Slunce.",
      "Tři z možností trvají stejně dlouho, jen začínají v jinou denní dobu. Která doba je z jiného cyklu?",
    ],
    explanation: "Den a noc, doba od poledne do poledne i od půlnoci do půlnoci trvají jednu otočku Země. Rok je doba oběhu kolem Slunce a na otáčení nezávisí.",
  },
  {
    q: "Globus osvětluješ lampou z jedné strany a pomalu jím otáčíš od západu k východu. Na kterém místě globusu právě začíná den?",
    correct: "Na okraji, který se natáčí ke světlu",
    distractors: [
      { value: "Na okraji, který se od světla odvrací", why: "Místo, které se od světla odvrací, právě přechází do tmy. Tam je večer, ne ráno." },
      { value: "Uprostřed osvětlené strany", why: "Uprostřed osvětlené strany je lampa nejvýš nad obzorem, tam je poledne. Den tam začal už dřív." },
      { value: "Uprostřed tmavé strany", why: "Uprostřed tmavé strany je nejhlubší noc, tedy půlnoc. Do světla se odtud dostaneš až za čtvrt otočky." },
    ],
    hints: [
      "Ráno je chvíle, kdy se místo dostává ze tmy do světla. Který okraj osvětlené strany to splňuje?",
      "Sleduj jedno místo na globusu při otáčení: nejdřív je ve tmě, pak přejde hranici světla. Na které straně osvětlené poloviny tu hranici přejde?",
    ],
    explanation: "Den začíná na místech, která se otáčením právě dostávají ze tmy do světla. Protože se globus točí na východ, je to okraj, který se k lampě natáčí.",
  },
  {
    q: "Globus osvětluješ lampou z jedné strany a pomalu jím otáčíš od západu k východu. Na kterém místě globusu se právě stmívá?",
    correct: "Na okraji, který se od světla odvrací",
    distractors: [
      { value: "Na okraji, který se natáčí ke světlu", why: "Místo, které se natáčí ke světlu, právě vychází ze tmy. Tam je ráno, ne večer." },
      { value: "Uprostřed osvětlené strany", why: "Uprostřed osvětlené strany je poledne. Stmívat se tam začne až za čtvrt otočky." },
      { value: "Uprostřed tmavé strany", why: "Uprostřed tmavé strany je už hluboká noc. Stmívá se na hranici světla a tmy." },
    ],
    hints: [
      "Stmívání je chvíle, kdy místo přechází ze světla do tmy. Kde na globusu taková hranice leží?",
      "Sleduj jedno místo na osvětlené straně: otáčením se posouvá, až opustí světlo. Na kterém okraji světlé poloviny se to stane?",
    ],
    explanation: "Stmívá se na místech, která se otáčením právě dostávají ze světla do tmy. Globus se točí na východ, proto je to okraj osvětlené strany, který se od lampy odvrací.",
  },
  {
    q: "Kdyby se Země otáčela kolem osy dvakrát rychleji, jak dlouho by na rovníku trvala jedna noc?",
    correct: `Asi ${pad(6, "HODINA")}`,
    distractors: [
      { value: `Asi ${pad(12, "HODINA")}`, why: "Tak dlouho by trvala celá otočka, tedy den a noc dohromady. Na samotnou noc připadá polovina otočky." },
      { value: `Asi ${pad(24, "HODINA")}`, why: "Tak dlouho trvá den i s nocí dnes. Dvakrát rychlejší otáčení by celou otočku zkrátilo na polovinu." },
      { value: `Asi ${pad(48, "HODINA")}`, why: "Tohle by platilo, kdyby se Země otáčela dvakrát pomaleji. Rychlejší otáčení den i noc zkracuje." },
    ],
    hints: [
      "Jedna otočka Země je den a noc dohromady. Co se s dobou jedné otočky stane, když se Země bude otáčet dvakrát rychleji?",
      "Na rovníku zabere noc zhruba polovinu otočky a den druhou polovinu. Spočítej nejdřív, jak dlouho by trvala celá otočka, a pak z ní vezmi polovinu.",
    ],
    explanation: "Dnes trvá jedna otočka asi 24 hodin a na rovníku z toho připadá zhruba 12 hodin na den a 12 hodin na noc. Při dvakrát rychlejším otáčení by otočka trvala 12 hodin, takže by noc trvala asi 6 hodin.",
  },
  {
    q: "Kdyby se Země otáčela od východu k západu, ve kterém ze dvou míst na stejné rovnoběžce by Slunce vyšlo dřív?",
    correct: "V tom, které leží dál na západ",
    distractors: [
      { value: "V tom, které leží dál na východ", why: "Tak je to dnes, protože se Země otáčí na východ. Při obráceném otáčení by se ke Slunci natáčela dřív opačná místa." },
      { value: "V obou zároveň, protože leží na stejné rovnoběžce", why: "Stejná rovnoběžka o době východu Slunce nerozhoduje. Rozhoduje zeměpisná délka spolu se směrem otáčení." },
      { value: "V tom, které leží blíž k nultému poledníku", why: "Nultý poledník je jen dohodnutý začátek počítání délek. Na tom, kdy se místo natočí ke Slunci, se nepodílí." },
    ],
    hints: [
      "Dnes se Země otáčí na východ a do slunečního světla se dostanou dřív místa ležící východněji. Co se s tím stane, když se směr otáčení obrátí?",
      "Místo uvidí východ Slunce ve chvíli, kdy se otáčením natočí ke Slunci. Při otáčení od východu k západu přecházejí místa přes hranici tmy a světla v opačném pořadí než dnes, takže je na řadě dřív ta strana, která dnes přichází až druhá.",
    ],
    explanation: "Slunce vyjde dřív tam, kde se místo dřív natočí ke Slunci. Kdyby se Země otáčela od východu k západu, natáčela by ke Slunci nejdřív místa ležící dál na západ, a tam by tedy Slunce vyšlo dřív.",
  },
];

const vytvor = (p: Polozka): PracticeTask | null =>
  choice(p.q, p.correct, p.distractors, { hints: p.hints, explanation: p.explanation });

// ── L2 (b) — dvě města na stejné rovnoběžce ────────────────────────────────
const DVOJICE: [string, string][] = [["A", "B"], ["K", "L"], ["M", "N"], ["P", "R"]];

function genMesta(): PracticeTask | null {
  const [p1, p2] = pick(DVOJICE);
  const l1 = rnd(-18, 18) * 5;
  const l2 = rnd(-18, 18) * 5;
  const rozdil = Math.abs(l1 - l2);
  // Rozdíl 180° = protilehlé poledníky: ani jedno město by neleželo „dál na
  // východ“ (od každého se k druhému dojde 180° na obě strany) → klíč by neplatil.
  if (l1 === 0 || l2 === 0 || rozdil < 15 || rozdil >= 180) return null;
  const lat = rnd(4, 12) * 5;
  const [vych, zap] = l1 > l2 ? [p1, p2] : [p2, p1];
  return choice(
    `Město ${p1} leží na ${delka(l1)}, město ${p2} na ${delka(l2)} — obě leží na stejné rovnoběžce ${sirka(lat)}, takže se liší jen zeměpisnou délkou. Ve kterém z nich vyjde Slunce dřív?`,
    `Ve městě ${vych}, protože leží dál na východě`,
    [
      { value: `Ve městě ${zap}, protože leží dál na západě`, why: "Je to naopak. Země se otáčí od západu k východu, takže města na východě se do slunečního světla natočí dřív." },
      { value: `Ve městě ${zap}, protože Slunce jde na západ`, why: `Slunce se po obloze posouvá jen zdánlivě a opačně, než se otáčí Země. ${SMER} Proto vidí východ Slunce dřív východnější město.` },
      { value: "V obou zároveň, protože leží na stejné rovnoběžce", why: "Stejná rovnoběžka nestačí. O tom, kde vyjde Slunce dřív, rozhoduje zeměpisná délka: východnější město se natočí ke Slunci dřív." },
    ],
    {
      hints: [
        `Převeď obě délky (${delka(l1)} a ${delka(l2)}) na jednu přímku: východní délka leží napravo od nultého poledníku, západní nalevo. Které město je víc napravo?`,
        `Představ si globus, kterým otáčíš na východ, a na rovnoběžce ${sirka(lat)} obě města. Které z nich se otáčením dostane do slunečního světla jako první? Stejná rovnoběžka přitom nerozhoduje, ta určuje jen vzdálenost od rovníku.`,
      ],
      explanation: `Město ${vych} leží o ${rozdil}° délky dál na východ než město ${zap}. Země se otáčí od západu k východu, takže se východnější město natočí ke Slunci dřív a Slunce tam vyjde dřív.`,
    },
  );
}

// ── L2 (c) — opačná strana Země (180°) ─────────────────────────────────────
const MISTA = ["A", "B", "C", "D"];
const SMERY = ["východ", "západ"];

function genPulOtocky(): PracticeTask | null {
  const misto = pick(MISTA);
  const smer = pick(SMERY);
  const poledne = Math.random() < 0.5;
  const tady = poledne ? "poledne" : "půlnoc";
  const tam = poledne ? "půlnoc" : "poledne";
  const ctvrt = "To by platilo o 90° dál, tedy o čtvrt otočky. 180° je polovina otočky, proto je tam opačná denní doba než tady.";
  return choice(
    `Na místě ${misto} je právě ${tady}. Jaká denní doba je v tu chvíli na místě, které leží na stejné rovnoběžce o 180° délky dál na ${smer}?`,
    `Je tam ${tam}`,
    [
      { value: "Je tam večer", why: ctvrt },
      { value: "Je tam ráno", why: ctvrt },
      {
        value: `Je tam také ${tady}`,
        why: poledne
          ? "Denní doba není na celé Zemi stejná. Místo o 180° dál leží na opačné straně Země, která je právě odvrácená od Slunce."
          : "Denní doba není na celé Zemi stejná. Místo o 180° dál leží na opačné straně Země, která je právě přivrácená ke Slunci.",
      },
    ],
    {
      hints: [
        "Celá otočka Země má 360°. Jakou část otočky tvoří 180° a o kolik se za tu část posune denní doba?",
        `Představ si globus osvětlený z jedné strany a na něm dvě místa na opačných koncích téže rovnoběžky. Když je na jednom z nich ${tady}, je to druhé právě ve světle, nebo ve tmě? Na tom, jestli půjdeš na východ, nebo na západ, u 180° nezáleží — obě cesty vedou na stejné místo.`,
      ],
      explanation: `Celá otočka Země má 360°, takže 180° je polovina otočky. Místo o 180° dál leží na opačné straně Země, ať se k němu vydáš na východ, nebo na západ. Když je na místě ${misto} ${tady}, je tam ${tam}.`,
    },
  );
}

// ── L2 (d) — počet otoček za dané období ───────────────────────────────────
function genOtocky(): PracticeTask | null {
  if (Math.random() < 0.5) {
    const n = rnd(2, 6);
    const dni = 7 * n;
    return choice(
      `Kolikrát se Země otočí kolem své osy za ${pad(n, "TÝDEN")}?`,
      `${cis(dni)}krát`,
      [
        { value: `${cis(n)}krát`, why: "Jedna otočka netrvá týden, ale jeden den. Týden má sedm dní, a tedy sedm otoček." },
        { value: `${cis(2 * dni)}krát`, why: "Den a noc dohromady jsou jedna otočka, ne dvě. Počítej jednu otočku za každý den." },
        { value: `${cis(24 * dni)}krát`, why: `Jedna otočka netrvá hodinu, ale celý den (${pad(24, "HODINA")}). Počítej dny, ne hodiny.` },
      ],
      {
        hints: [
          `Kolik dní uplyne za ${pad(n, "TÝDEN")}? Pak si vzpomeň, jak dlouho trvá jedna otočka Země.`,
          "Den a noc dohromady jsou jedna otočka. Počítej otočky po dnech, ne po hodinách ani po polovinách dne, a nakonec si ověř, jestli ti počet otoček vyšel stejný jako počet dní.",
        ],
        explanation: `Jedna otočka Země kolem osy trvá jeden den. Za ${pad(n, "TÝDEN")} uplyne ${pad(dni, "DEN")}, takže se Země otočí ${cis(dni)}krát.`,
        solutionSteps: [
          "Jedna otočka kolem osy trvá 1 den.",
          `Počet dní: ${n} · 7 = ${cis(dni)}`,
          `Počet otoček: ${pad(dni, "DEN")}, za každý den jedna otočka, tedy ${cis(dni)}krát`,
        ],
      },
    );
  }
  const k = rnd(3, 8);
  const hod = 24 * k;
  return choice(
    `Kolikrát se Země otočí kolem své osy za ${pad(hod, "HODINA")}?`,
    `${cis(k)}krát`,
    [
      { value: `${cis(hod)}krát`, why: "Tohle je počet hodin, ne otoček. Jedna otočka netrvá hodinu, ale celý den." },
      { value: `${cis(2 * k)}krát`, why: "Den a noc dohromady jsou jedna otočka, ne dvě. Každý den přidá jen jednu otočku." },
      { value: `${cis(24)}krát`, why: `Číslo ${cis(24)} je počet hodin jedné otočky, ne počet otoček. Ten dostaneš, až hodiny vydělíš dvaceti čtyřmi.` },
    ],
    {
      hints: [
        `Nejdřív převeď hodiny na dny: jedna otočka Země trvá ${pad(24, "HODINA")}. Kolik celých dní se do zadané doby vejde?`,
        "Den a noc dohromady jsou jedna otočka, ne dvě. Za každý celý den přibude právě jedna otočka, takže počet otoček vyjde stejný jako počet dní.",
      ],
      explanation: `Jedna otočka Země kolem osy trvá jeden den, tedy ${pad(24, "HODINA")}. Za ${pad(hod, "HODINA")} uplyne ${pad(k, "DEN")}, takže se Země otočí ${cis(k)}krát.`,
      solutionSteps: [
        `Jedna otočka kolem osy trvá 1 den, tedy ${pad(24, "HODINA")}.`,
        `Počet dní: ${cis(hod)} : 24 = ${cis(k)}`,
        `Počet otoček: za každý den jedna, tedy ${cis(k)}krát`,
      ],
    },
  );
}

// ── L3 (c) — denní doba na místě o 90° délky dál na rovníku ─────────────────
const FAZE_MOZNOST = ["Kolem půlnoci", "Kolem východu Slunce", "Kolem poledne", "Kolem západu Slunce"];
const FAZE_OTAZKA = ["je právě půlnoc", "právě vychází Slunce", "je právě poledne", "právě zapadá Slunce"];
const FAZE_NOM = ["půlnoc", "východ Slunce", "poledne", "západ Slunce"];
const DVOJICE_90: [string, string][] = [["A", "B"], ["K", "L"], ["P", "R"], ["X", "Y"]];

function genCtvrtOtocky(): PracticeTask | null {
  const [m1, m2] = pick(DVOJICE_90);
  const start = rnd(0, 3);
  const naVychod = Math.random() < 0.5;
  const krok = naVychod ? 1 : 3;
  const cil = (start + krok) % 4;
  const opacne = (start + 2) % 4;
  const spatnySmer = (start + 4 - krok) % 4;
  const smer = naVychod ? "východ" : "západ";
  const why: Record<number, string> = {
    [start]: `Místo o 90° dál nemá stejnou denní dobu: 90° je čtvrt otočky Země, tedy rozdíl asi ${pad(6, "HODINA")}.`,
    [opacne]: "Tohle by platilo o 180° dál, tedy o půl otočky. 90° je jen čtvrtina otočky, takže se denní doba posune jen o jeden krok.",
    [spatnySmer]: naVychod
      ? "Tohle je posun o čtvrt otočky špatným směrem. Země se otáčí na východ, takže místa na východě mají denní dobu napřed, ne pozadu."
      : "Tohle je posun o čtvrt otočky špatným směrem. Místa na západě se do světla natáčejí později, takže mají denní dobu pozadu, ne napřed.",
  };
  return choice(
    `Na rovníku na místě ${m1} ${FAZE_OTAZKA[start]}. Místo ${m2} leží také na rovníku, o 90° délky dál na ${smer}. Jaká denní doba je tam zhruba v tu chvíli?`,
    FAZE_MOZNOST[cil],
    [start, opacne, spatnySmer].map((f) => ({ value: FAZE_MOZNOST[f], why: why[f] })),
    {
      hints: [
        "Jakou část celé otočky (360°) tvoří 90°? O tolik se posune denní doba v pořadí půlnoc, východ Slunce, poledne, západ Slunce.",
        `Země se otáčí od západu k východu, proto mají místa ležící dál na východ denní dobu napřed a místa dál na západ pozadu. Posuň se tedy v tom pořadí o jeden krok tím směrem, který odpovídá poloze na ${smer}.`,
      ],
      explanation: `90° je čtvrtina z 360°, tedy čtvrt otočky Země (asi ${pad(6, "HODINA")}). Země se otáčí na východ, proto mají místa na východě denní dobu napřed a místa na západě pozadu. Na místě ${m2} je proto zhruba ${FAZE_NOM[cil]}.`,
    },
  );
}

// ── L3 (e) — protilehlý poledník (souřadnice se opravdu počítají) ───────────
const MISTA_180 = ["E", "F", "G", "H"];

function genDelkaProtilehla(): PracticeTask | null {
  const m = pick(MISTA_180);
  const x = rnd(-17, 17) * 10;
  // 0° i 90° vyřazeno: u nuly není protilehlý poledník jednoznačně zapsaný
  // jako v. d./z. d. a u 90° by dva distraktory splynuly s klíčem.
  if (x === 0 || Math.abs(x) === 90) return null;
  const anti = x > 0 ? x - 180 : x + 180;
  const stejnaPolokoule = x > 0 ? 180 - x : -(180 + x);
  return choice(
    `Místo ${m} leží na ${delka(x)} — na kterém poledníku leží místo, které je od něj o 180° délky dál, tedy na opačné straně Země?`,
    delka(anti),
    [
      { value: delka(-x), why: `Polokouli jsi vyměnil správně, ale stupně zůstaly stejné. Oba protilehlé poledníky dávají dohromady 180°, takže od 180° ještě odečti stupně místa ${m}.` },
      { value: delka(stejnaPolokoule), why: "Stupně jsi spočítal správně, ale polokoule musí být opačná. Protilehlý poledník leží na druhé straně nultého poledníku." },
      { value: "180°", why: `180° je rozdíl obou poledníků, ne poloha hledaného místa. Od 180° odečti stupně místa ${m} a změň polokouli.` },
    ],
    {
      hints: [
        `Nultý poledník a poledník 180° dělí Zemi na dvě poloviny. Kolik stupňů musí dohromady dát poledník místa ${m} a poledník na opačné straně Země?`,
        `Od 180° odečti stupně, na kterých leží místo ${m}. Tím dostaneš stupně hledaného poledníku. Pak ještě vyměň polokouli: východní délku za západní a západní za východní, protože protilehlý poledník leží na druhé straně nultého poledníku.`,
      ],
      explanation: `Protilehlý poledník doplňuje poledník místa ${m} do 180° a leží na opačné polokouli. Od 180° odečteme ${Math.abs(x)}°, zbývá ${180 - Math.abs(x)}°, a ${x > 0 ? "východní délku vyměníme za západní" : "západní délku vyměníme za východní"}. Hledané místo tedy leží na ${delka(anti)}, přesně naproti místu ${m}.`,
      solutionSteps: [
        `Oba protilehlé poledníky dají dohromady 180°.`,
        `Stupně: 180° − ${Math.abs(x)}° = ${180 - Math.abs(x)}°`,
        `Polokoule se mění na opačnou: ${x > 0 ? "východní na západní" : "západní na východní"}`,
      ],
    },
  );
}

/** Rotace šablon se nastavuje při každém volání — mezi voláními žádný stav. */
function gen(level: number): PracticeTask[] {
  if (level <= 1) {
    let i = 0;
    const genL1 = () => vytvor(POOL_L1[i++ % POOL_L1.length]);
    return ruzneUlohy(() => losUlohy(genL1), POOL_L1.length, POOL_L1.length);
  }
  let t = 0;
  let b = 0;
  const tvurci: (() => PracticeTask | null)[] =
    level === 2
      ? [() => vytvor(POOL_L2[b++ % POOL_L2.length]), genMesta, genPulOtocky, genOtocky]
      : [
          () => vytvor(POOL_L3[b++ % POOL_L3.length]),
          genCtvrtOtocky,
          () => vytvor(POOL_L3[b++ % POOL_L3.length]),
          genDelkaProtilehla,
        ];
  const genLx = () => tvurci[t++ % tvurci.length]();
  // 32 instancí, aby se do vzorku dostala i poslední položka banky:
  // rotace 4 tvůrců → banka L2 (8) i L3 (15) se stihne projít celá.
  return ruzneUlohy(() => losUlohy(genLx), 32, 600);
}

export const TVAR_A_POHYBY_ZEME: TopicMetadata[] = [
  {
    id: "g6-zem-tvar-a-pohyby-zeme-6",
    rvpNodeId: "g6-zemepis-prirodni-obraz-zeme-vesmir-a-zeme-tvar-zeme-pohyby-zeme-stridani-dne-a-noci",
    displayName: "Tvar a pohyby Země",
    title: "Tvar Země, pohyby Země, střídání dne a noci",
    studentTitle: "Jak se Země točí a proč se střídá den a noc",
    subject: "zemepis",
    category: "Přírodní obraz Země",
    topic: "Vesmír a Země",
    briefDescription: "Tvar Země, otáčení a oběh kolem Slunce, střídání dne a noci.",
    keywords: [
      "tvar Země", "geoid", "zemská osa", "póly", "rovník", "otáčení Země", "rotace",
      "oběh Země", "revoluce", "den a noc", "východ Slunce", "západ Slunce",
      "zdánlivý pohyb Slunce", "důkazy kulatosti Země", "zeměpisná délka",
    ],
    goals: [
      "Rozlišit otáčení Země kolem osy a oběh kolem Slunce a přiřadit k nim dobu trvání, směr a důsledky.",
      "Vysvětlit střídání dne a noci a zdánlivý pohyb Slunce a určit, kde je dřív ráno.",
      "Popsat tvar Země a poznat důkazy její kulatosti.",
    ],
    boundaries: [
      "Hodiny ani časová pásma se neuvádějí, rozlišují se jen denní doby (patří do podtématu Roční doby, časová pásma).",
      "Úlohy se souřadnicemi používají jen rozdíly 90° a 180° nebo porovnání dvou míst na stejné rovnoběžce.",
      "Bez map a obrázků, vše jde vyřešit ze slov.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Země se otáčí kolem osy od západu k východu jednou za den, a tím střídá den a noc. Kolem Slunce oběhne jednou za rok. Na východě je ráno dřív.",
      steps: [
        "Zjisti, jestli se jev opakuje každý den (otáčení), nebo jednou za rok (oběh).",
        "Pamatuj, že Slunce se po obloze posouvá jen zdánlivě a opačně, než se otáčí Země.",
        "U souřadnic urči, které místo leží dál na východ: tam je denní doba napřed.",
      ],
      commonMistake: "Připsat den a noc oběhu kolem Slunce nebo si myslet, že se Země točí na západ, protože tam Slunce zapadá.",
      example: "Den a noc se střídají, protože se Země otáčí kolem osy. Jedna otočka trvá asi 24 hodin.",
    },
  },
];
