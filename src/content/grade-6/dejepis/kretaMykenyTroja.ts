/**
 * Dějepis 6. ročník — Krétská a mykénská civilizace, trojská válka (select_one).
 *
 * Faktické téma → banky úloh, ne šablona. Tři disjunktní banky (POOL_L1/L2/L3),
 * každá položka s vlastním zněním, vlastní dvojicí nápověd, vysvětlením PROČ
 * a optionFeedback. Výběr je deterministický (celá banka, `ruzneUlohy`).
 *
 * Chybový model (každý distraktor = jedna typická chyba):
 *  1. záměna Kréta × Mykény — paláce bez hradeb × hrady s hradbami,
 *     lineární písmo A × B, Mínós × Agamemnón;
 *  2. mýtus brán jako doložený fakt — nalezený Mínotaurus, zbytky koně,
 *     „maska dokazuje, že Agamemnón žil“;
 *  3. záměna děl a autorů — Ilias × Odysseia, Homér jako očitý svědek,
 *     lest s koněm připsaná Achilleovi;
 *  4. anachronismus a jiný starověk — Athény a Sparta, Římané, Alexandr
 *     Veliký, Egypt a Mezopotámie, Trója umístěná do Řecka.
 *
 *  • L1 — zapamatování: přímá otázka na jeden pojem.
 *  • L2 — použití: popis stopy BEZ jména civilizace či lokality → přiřazení.
 *  • L3 — analýza: co nález dokazuje a co ne, mýtus proti prameni, datace.
 *
 * Sporné věci nejsou klíčem: role výbuchu Théry, historická existence Homéra,
 * skutečná podoba války. Datace jen s „asi/kolem“.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildChoiceTask as choice, type Distractor } from "./_shared";
import { ruzneUlohy } from "../fyzika/_shared";

/** Co možnost tvrdí: doložený závěr z nálezu, pověst podaná jako fakt, nebo jiná chyba. */
export type ClaimKind = "evidence" | "myth" | "other";

export interface Moznost extends Distractor {
  claimKind?: ClaimKind;
}

export interface Polozka {
  q: string;
  correct: string;
  distractors: Moznost[];
  hints: [string, string];
  explanation: string;
  /** Jen L3: otázka „co nález dokazuje / co z něj plyne“. */
  nalez?: boolean;
  /** Jen L3: druh tvrzení správné možnosti. */
  correctClaimKind?: ClaimKind;
}

/** Jen pro záměny, které opravdu stojí na palácích × hradech. */
const DRUHA = "Tohle patří druhé civilizaci: Kréta = paláce bez hradeb, Mykény = hrady s hradbami.";
/** Jen pro záměny písma. */
const PISMO = "Kréta = lineární písmo A (nerozluštěné), Mykény = lineární písmo B (řečtina).";

// ── L1 — ZAPAMATOVÁNÍ: přímá otázka na jeden pojem ──────────────────────────
export const POOL_L1: Polozka[] = [
  {
    q: "Na kterém ostrově stál palác v Knóssu?",
    correct: "Kréta",
    distractors: [
      { value: "Peloponés", why: `${DRUHA} Peloponés je poloostrov na pevnině, stojí na něm Mykény, a ne Knóssos.` },
      { value: "Sicílie", why: "Sicílie je velký ostrov u Itálie. Řekové ji osidlovali až mnohem později a Knóssos tam není." },
      { value: "Kypr", why: "Kypr leží na východě Středozemního moře u Malé Asie. Palác v Knóssu stál na jiném ostrově." },
    ],
    hints: [
      "Hledáš ostrov, ne poloostrov. Leží v jižní části Egejského moře.",
      "Je to největší ostrov dnešního Řecka, dlouhý a úzký, a podle něj se jmenuje celá civilizace paláců. Poloostrov s hrady na pevnině vyřaď.",
    ],
    explanation: "Knóssos ležel na Krétě, největším řeckém ostrově. Podle ní se tamní civilizace paláců nazývá krétská (minojská). Peloponés je poloostrov s Mykénami.",
  },
  {
    q: "Jak se jmenuje hlavní vstup do hradu v Mykénách?",
    correct: "Lví brána",
    distractors: [
      { value: "Ištařina brána", why: "Ištařina brána stála v Babylonu v Mezopotámii a je o mnoho staletí mladší. S Mykénami nesouvisí." },
      { value: "Knósská brána", why: "Taková brána neexistuje. Palác v Knóssu neměl mohutné hradby ani slavnou vstupní bránu." },
      { value: "Skajská brána", why: "Skajská brána je brána Tróje z Homérovy Iliady, tedy z básně. Mykénský hrad měl vlastní vstup." },
    ],
    hints: [
      "Vybav si obrázek z učebnice: vstup z obrovských kvádrů a nad ním trojúhelníkový kámen s reliéfem.",
      "Vstup se jmenuje podle toho, co je vytesané v kameni nad ním.",
    ],
    explanation: "Vstup do Mykén tvoří Lví brána z obrovských kvádrů, nad ní jsou vytesaní dva lvi. Ukazuje moc mykénských vládců, kteří stavěli opevněné hrady.",
  },
  {
    q: "Který bájný král podle pověsti vládl Krétě a dal postavit labyrint?",
    correct: "Mínós",
    distractors: [
      { value: "Agamemnón", why: "Agamemnón byl podle Homéra král Mykén, ne Kréty." },
      { value: "Priamos", why: "Priamos byl podle báje král Tróje v Malé Asii, ne vládce Kréty." },
      { value: "Daidalos", why: "Daidalos byl podle pověsti vynálezce, který labyrint postavil. Králem ale nebyl, stavěl na královský rozkaz." },
    ],
    hints: [
      "Hledáš krále, ne stavitele. Podle jeho jména se jmenuje celá krétská civilizace.",
      "V pověsti o labyrintu vystupuje vládce, který stavbu poručil, a vynálezce, který ji postavil. Hledáš toho, kdo poroučel.",
    ],
    explanation: "Podle pověsti vládl Krétě král Mínós a labyrint mu postavil vynálezce Daidalos. Po Mínóovi se krétská civilizace nazývá minojská.",
  },
  {
    q: "Který básník podle tradice složil Iliadu a Odysseu?",
    correct: "Homér",
    distractors: [
      { value: "Odysseus", why: "Odysseus je hrdina, o kterém Odysseia vypráví. Básně nesložil, je jejich postavou." },
      { value: "Sofoklés", why: "Sofoklés psal divadelní hry v Athénách až v klasické době, dlouho po vzniku obou eposů." },
      { value: "Vergilius", why: "Vergilius byl římský básník, žil o mnoho staletí později a psal latinsky." },
    ],
    hints: [
      "Hledáš autora, ne hrdinu příběhu. Podle tradice to byl slepý pěvec.",
      "Oba eposy patří k nejstarším řeckým básním. Jejich autor tedy žil dřív než athénské divadlo i římští básníci.",
    ],
    explanation: "Iliadu a Odysseu připisuje tradice básníkovi Homérovi. Odysseus je postava z jeho básně, Sofoklés a Vergilius žili mnohem později.",
  },
  {
    q: "Na kterém poloostrově leží Mykény?",
    correct: "Peloponés",
    distractors: [
      { value: "Kréta", why: `${DRUHA} Kréta je ostrov s palácem v Knóssu, ne poloostrov s Mykénami.` },
      { value: "Malá Asie", why: "V Malé Asii (dnešním Turecku) ležela Trója, ne Mykény." },
      { value: "Attika", why: "Na Attice leží Athény, které se proslavily až v pozdější klasické době." },
    ],
    hints: [
      "Hledáš poloostrov na jihu řecké pevniny, ne ostrov.",
      "Mykény jsou civilizace hradů na pevnině. Najdi na mapě jih Řecka: velký poloostrov spojený s pevninou jen úzkou šíjí.",
    ],
    explanation: "Mykény leží na Peloponésu, poloostrově na jihu Řecka. Kréta je ostrov, Trója ležela v Malé Asii a Attika je kraj kolem Athén.",
  },
  {
    q: "Kde ležela Trója?",
    correct: "V Malé Asii, v dnešním Turecku",
    distractors: [
      { value: "Na Peloponésu, v dnešním Řecku", why: "Na Peloponésu leží Mykény. Řekové podle báje museli k Tróji plout přes moře." },
      { value: "Na Krétě, v dnešním Řecku", why: "Na Krétě stál palác v Knóssu. Trója ležela na pevnině za Egejským mořem." },
      { value: "V deltě Nilu, v dnešním Egyptě", why: "Delta Nilu patří Egyptu, jiné zemi a jiné civilizaci. Trója s ním nesouvisí." },
    ],
    hints: [
      "Podle báje museli Řekové k Tróji přeplout Egejské moře na východ.",
      "Najdi na mapě úžinu Dardanely mezi Evropou a Asií. Na kterém jejím břehu město stálo?",
    ],
    explanation: "Trója ležela v Malé Asii, v dnešním Turecku, u úžiny Dardanely. Proto museli Řekové podle báje přeplout moře.",
  },
  {
    q: "Který nadšenec pro Homéra vykopal zbytky Tróje i hroby v Mykénách?",
    correct: "Heinrich Schliemann",
    distractors: [
      { value: "Howard Carter", why: "Howard Carter objevil v Egyptě hrobku Tutanchamona. Tróju ani Mykény nekopal." },
      { value: "Arthur Evans", why: "Arthur Evans byl britský archeolog a vykopal palác v Knóssu na Krétě, ne Tróju a Mykény." },
      { value: "Michael Ventris", why: "Michael Ventris nekopal. Rozluštil lineární písmo B z hliněných tabulek." },
    ],
    hints: [
      "Hledáš bohatého obchodníka, který si v 19. století splnil dětský sen a začal kopat.",
      "Kopal podle Homérových básní, nejdřív v Malé Asii a potom na Peloponésu.",
    ],
    explanation: "Heinrich Schliemann podle Homéra hledal a vykopal Tróju v Malé Asii a potom hroby v Mykénách. Palác v Knóssu odkryl až Arthur Evans.",
  },
  {
    q: "Který řecký hrdina podle báje vymyslel lest s dřevěným koněm?",
    correct: "Odysseus",
    distractors: [
      { value: "Achilleus", why: "Achilleus byl nejsilnější bojovník, ne vynálezce lsti. Proslavil se v boji, ne chytrostí." },
      { value: "Agamemnón", why: "Agamemnón vedl řecké vojsko jako král, ale lest s koněm podle báje vymyslel jiný hrdina." },
      { value: "Paris", why: "Paris byl trojský princ, tedy na straně obránců. Lest vymysleli Řekové proti Tróji." },
    ],
    hints: [
      "Hledáš hrdinu, který se proslavil chytrostí, ne silou.",
      "Vzpomeň si, kterému řeckému hrdinovi Homér přezdívá „důmyslný“.",
    ],
    explanation: "Lest s dřevěným koněm vymyslel podle báje Odysseus, proslulý chytrostí. Achilleus byl nejsilnější bojovník a Paris trojský princ.",
  },
  {
    q: "Která Homérova báseň vypráví o dlouhé cestě hrdiny z války domů?",
    correct: "Odysseia",
    distractors: [
      { value: "Ilias", why: "Ilias vypráví o bojích u Tróje, ne o cestě domů. Ilias = válka, Odysseia = návrat." },
      { value: "Epos o Gilgamešovi", why: "Epos o Gilgamešovi je z Mezopotámie a Homér ho nesložil." },
      { value: "Kniha mrtvých", why: "Kniha mrtvých je soubor egyptských textů pro posmrtný život, ne řecká báseň." },
    ],
    hints: [
      "Homérovi tradice připisuje dvě básně. Jedna je o boji, druhá o cestě.",
      "Jedna Homérova báseň je o boji u města, druhá o plavbě po moři. Která je o plavbě?",
    ],
    explanation: "Odysseia vypráví o desetiletém návratu hrdiny Odyssea z Tróje domů. Ilias vypráví o bojích u Tróje.",
  },
  {
    q: "Jak se nazývá krétské písmo, které dodnes nikdo nerozluštil?",
    correct: "Lineární písmo A",
    distractors: [
      { value: "Lineární písmo B", why: `${PISMO} Písmo B používali Mykéňané a rozluštit se podařilo.` },
      { value: "Klínové písmo", why: "Klínové písmo patří Mezopotámii a vědci ho přečíst umějí." },
      { value: "Egyptské hieroglyfy", why: "Hieroglyfy jsou egyptské písmo a rozluštil je Champollion. Na Krétu nepatří." },
    ],
    hints: [
      "Hledáš písmo, jehož jazyk neznáme. Písmo Mezopotámie ani Egypta to není, obě se číst dají.",
      "Z doby paláců známe dvě podobná písma označená písmeny abecedy. Krétské je to starší.",
    ],
    explanation: "Krétané psali lineárním písmem A. Neznáme jejich jazyk, proto nápisům nerozumíme. Mykénské lineární písmo B rozluštil Michael Ventris.",
  },
  {
    q: "Který mykénský král podle Homéra vedl řecké vojsko proti Tróji?",
    correct: "Agamemnón",
    distractors: [
      { value: "Mínós", why: "Mínós je bájný král Kréty a s trojskou válkou nesouvisí." },
      { value: "Priamos", why: "Priamos byl podle báje král Tróje, tedy vůdce obránců, ne Řeků." },
      { value: "Leónidás", why: "Leónidás byl spartský král z pozdějších řecko-perských válek, žil o mnoho staletí později." },
    ],
    hints: [
      "Hledáš vůdce útočníků, který vládl v hradě na Peloponésu.",
      "Byl bratrem spartského krále Meneláa, kterému Trojané unesli manželku.",
    ],
    explanation: "Podle Homéra vedl Řeky proti Tróji mykénský král Agamemnón. Priamos vládl Tróji, Mínós Krétě a Leónidás žil mnohem později.",
  },
  {
    q: "Čí únos podle báje rozpoutal trojskou válku?",
    correct: "Heleny",
    distractors: [
      { value: "Penelopy", why: "Penelopa je věrná manželka Odyssea z Odysseie. Čekala na něj doma, nikdo ji neunesl." },
      { value: "Ariadny", why: "Ariadna je krétská princezna z pověsti o Mínotaurovi, s trojskou válkou nesouvisí." },
      { value: "Kleopatry", why: "Kleopatra byla egyptská královna, žila o více než tisíc let později." },
    ],
    hints: [
      "Hledáš krásnou manželku spartského krále Meneláa.",
      "Vzpomeň si, proč Řekové k Tróji vůbec vypluli: chtěli domů přivézt ženu, kterou jim Trojané odvezli.",
    ],
    explanation: "Podle báje unesl trojský princ Paris krásnou Helenu, manželku spartského krále. Řekové se ji vydali získat zpět a začala válka.",
  },
  {
    q: "Jak se jmenoval trojský princ, který podle báje unesl krásnou královnu ze Sparty?",
    correct: "Paris",
    distractors: [
      { value: "Hektór", why: "Hektór byl také trojský princ, ale proslavil se jako obránce města. Královnu neunesl." },
      { value: "Achilleus", why: "Achilleus byl řecký bojovník, stál na straně útočníků, ne Tróje." },
      { value: "Théseus", why: "Théseus je hrdina athénské pověsti, který na Krétě zabil Mínotaura. Trojan to nebyl." },
    ],
    hints: [
      "Hledáš Trojana, ne Řeka. Byl to syn krále Priama.",
      "Priamos měl dva slavné syny. Jeden statečně bránil hradby a padl v souboji. Hledáš toho druhého, který odvezl manželku Meneláa a tím válku způsobil.",
    ],
    explanation: "Královnu Helenu unesl trojský princ Paris. Jeho bratr Hektór bránil Tróju, Achilleus byl Řek a Théseus hrdina pověsti o Mínotaurovi.",
  },
  {
    q: "Jak se jmenovala obluda napůl býk a napůl člověk, která podle pověsti žila v labyrintu?",
    correct: "Mínotaurus",
    distractors: [
      { value: "Kyklop", why: "Kyklop je jednooký obr. Podle pozdějších Řeků stavěli kyklopové mykénské hradby." },
      { value: "Kentaur", why: "Kentaur je napůl kůň a napůl člověk, ne býk." },
      { value: "Sfinga", why: "Sfinga má tělo lva a lidskou hlavu (známá je egyptská socha v Gíze i řecká obluda z Théb), ne býčí hlavu." },
    ],
    hints: [
      "Hledáš obludu s tělem člověka a hlavou býka.",
      "Obludu v krétském labyrintu zabil athénský hrdina Théseus. Z labyrintu ven mu pomohlo Ariadnino klubko.",
    ],
    explanation: "V labyrintu na Krétě žil podle pověsti Mínotaurus, napůl býk a napůl člověk. Zabil ho hrdina Théseus. Je to pověst, ne doložená událost.",
  },
  {
    q: "Kdo ve 20. století rozluštil lineární písmo B?",
    correct: "Michael Ventris",
    distractors: [
      { value: "Heinrich Schliemann", why: "Schliemann vykopal Tróju a Mykény, písmo ale nerozluštil. Zemřel dávno před jeho rozluštěním." },
      { value: "Arthur Evans", why: "Arthur Evans tabulky v Knóssu našel a pokoušel se je číst, ale neuspěl." },
      { value: "Jean-François Champollion", why: "Champollion rozluštil egyptské hieroglyfy, ne písmo z Kréty a Mykén." },
    ],
    hints: [
      "Hledáš luštitele písma, ne archeologa, který kopal.",
      "Luštitel byl Angličan a v 50. letech ukázal, že tabulky jsou psané ranou řečtinou.",
    ],
    explanation: "Lineární písmo B rozluštil Michael Ventris a zjistil, že zapisuje ranou řečtinu. Schliemann a Evans kopali, Champollion rozluštil hieroglyfy.",
  },
];

// ── L2 — POUŽITÍ: stopa bez jména civilizace či lokality → přiřazení ───────
export const POOL_L2: Polozka[] = [
  {
    q: "Rozlehlý palác s mnoha místnostmi a bez mohutných hradeb, na zdech malby delfínů. Ke které civilizaci patří?",
    correct: "Krétské civilizaci",
    distractors: [
      { value: "Mykénské civilizaci", why: `${DRUHA} Mykénská sídla byla hrady s tlustými hradbami a malby moře tam nepřevládaly.` },
      { value: "Starověkému Egyptu", why: "Egypt proslul pyramidami a chrámy u Nilu. Palác s delfíny na zdech tam nestál." },
      { value: "Klasickým Athénám", why: "Klasické Athény vzkvétaly až o mnoho staletí později a stavěly chrámy, ne takové paláce." },
    ],
    hints: [
      "Všimni si dvou stop: palác nemá hradby a výzdoba je z moře.",
      "Civilizace, která se nebála útoku, žila na ostrově a spoléhala na moře. Hrady s hradbami stavěli její sousedé na pevnině. Egypt a Athény patří jiné zemi a jiné době.",
    ],
    explanation: "Velké paláce bez hradeb s malbami moře a delfínů stavěli Krétané. Mykéňané naopak stavěli opevněné hrady.",
  },
  {
    q: "Hradby z tak obrovských balvanů, že je podle pozdějších Řeků museli skládat obři. Kde takové hradby stojí?",
    correct: "V Mykénách",
    distractors: [
      { value: "V Knóssu", why: `${DRUHA} Palác v Knóssu mohutné hradby neměl.` },
      { value: "Ve Spartě", why: "Sparta se proslavila až v pozdější klasické době a slavné hradby z balvanů neměla." },
      { value: "V Gíze u pyramid", why: "V Gíze stojí egyptské pyramidy, tedy hrobky, ne hradby hradu." },
    ],
    hints: [
      "Hradby stavěla civilizace, která se musela bránit na pevnině.",
      "Pozdější Řekové nevěřili, že by lidé takové kameny zvedli, a připsali stavbu jednookým obrům. Hledej hrad na Peloponésu, ne palác na ostrově bez hradeb.",
    ],
    explanation: "Tzv. kyklopské hradby z obrovských balvanů obklopují Mykény. Mykéňané stavěli opevněné hrady, protože se museli bránit útokům.",
  },
  {
    q: "Hliněné tabulky se záznamy o zásobách, jejichž písmo se podařilo přečíst a ukázalo se jako raná řečtina. Kdo takto psal?",
    correct: "Mykéňané",
    distractors: [
      { value: "Minojští Krétané", why: `${PISMO} Krétské písmo zatím nikdo nerozluštil a řečtina to nebyla.` },
      { value: "Sumerové", why: "Sumerové také psali na hlínu, ale klínovým písmem a sumersky, ne řecky." },
      { value: "Trojané", why: "Z Tróje takový archiv tabulek s řečtinou neznáme. Město leželo v Malé Asii." },
    ],
    hints: [
      "Rozhodující stopa je jazyk: písmo zapisuje ranou řečtinu a dá se přečíst.",
      "Řecky mluvili lidé na řecké pevnině. Krétské písmo z doby paláců nikdo nerozluštil a hlínu s klínovým písmem používala Mezopotámie. Hledej civilizaci hradů na Peloponésu.",
    ],
    explanation: "Lineárním písmem B psali Mykéňané. Ventris ho rozluštil a ukázal, že zapisuje ranou řečtinu. Krétské lineární A přečíst neumíme.",
  },
  {
    q: "Na malbě mladík přeskakuje přes rohy útočícího býka. Kde tuto nástěnnou malbu našli?",
    correct: "V paláci v Knóssu",
    distractors: [
      { value: "Na hradě v Mykénách", why: "Hry s býkem jsou typický výjev krétských paláců. Slavná malba přeskakování býka pochází z paláce na ostrově, ne z hradu na pevnině." },
      { value: "V hradbách Tróje", why: "Trója je místo báje o válce. Malby her s býkem pocházejí z jiného místa." },
      { value: "V egyptské pyramidě", why: "Pyramidy byly egyptské hrobky. Výjev přeskakování býka k nim nepatří." },
    ],
    hints: [
      "Býk hrál v náboženství i v pověstech jedné civilizace hlavní roli.",
      "Vzpomeň si, kde podle pověsti žila obluda s býčí hlavou. Tam na zdech paláce našli archeologové i malby mladých lidí, kteří s býky předváděli odvážné skoky.",
    ],
    explanation: "Malby her s býkem pocházejí z paláce v Knóssu na Krétě. Býk byl pro Krétany posvátné zvíře, s tím souvisí i pověst o Mínotaurovi.",
  },
  {
    q: "Zlatá pohřební maska vousatého muže ležela v šachtovém hrobě hned za Lví bránou. Ke které kultuře patří?",
    correct: "Mykénské kultuře",
    distractors: [
      { value: "Krétské kultuře", why: `${DRUHA} Zlaté masky v šachtových hrobech patří vládcům hradů na pevnině.` },
      { value: "Egyptské kultuře", why: "Zlatou masku má i egyptský Tutanchamon, ten ale ležel v hrobce v Údolí králů, ne v šachtě na Peloponésu." },
      { value: "Trojské kultuře", why: "V Tróji takové šachtové hroby se zlatými maskami nenašli." },
    ],
    hints: [
      "Stopou jsou šachtové hroby a spousta zlata. Takové poklady měli bojovní vládci hradů.",
      "Brána se dvěma lvy vede do hradu z obrovských kvádrů na pevnině. Hroby tam vykopal Schliemann a masku pojmenoval po králi z Homérovy Iliady. Egyptskou masku faraona si nespleť, ta pochází z úplně jiné hrobky.",
    ],
    explanation: "Zlaté masky ze šachtových hrobů patří mykénské kultuře. Dokládají bohatství vládců Mykén.",
  },
  {
    q: "Básník v eposu líčí, jak Řekové už desátý rok obléhají město za mořem a hrdinové bojují před jeho branami. O čem epos vypráví?",
    correct: "O trojské válce",
    distractors: [
      { value: "O stavbě krétského labyrintu", why: "Pověst o labyrintu vypráví o stavbě a obludě, ne o obléhání města." },
      { value: "O výpravě Peršanů proti Athénám", why: "Perské války proběhly o mnoho staletí později a o nich Homérovy básně nejsou." },
      { value: "O pádu hradu v Mykénách", why: "Mykény v báji nikdo neobléhal. Odtud naopak vyplul král, který Řeky vedl." },
    ],
    hints: [
      "Stopy: obléhání trvá už desátý rok a město leží za mořem.",
      "Řekové se podle báje plavili přes Egejské moře do Malé Asie, aby získali zpět unesenou královnu. Vyřaď pověst o stavbě i války z pozdější doby.",
    ],
    explanation: "Obléhání města za mořem je trojská válka. Homérova Ilias líčí jen několik týdnů z desátého roku obléhání. Perské války jsou mnohem pozdější.",
  },
  {
    q: "Hrdinu zasáhl šíp do paty, jediného místa, kde byl zranitelný. Z kterého příběhu tahle postava pochází?",
    correct: "Z báje o trojské válce",
    distractors: [
      { value: "Z báje o krétském labyrintu", why: "V pověsti o labyrintu vystupuje Théseus a Mínotaurus, ne hrdina zraněný do paty." },
      { value: "Z egyptské Knihy mrtvých", why: "Kniha mrtvých je egyptský text pro posmrtný život, řecké hrdiny v ní nenajdeš." },
      { value: "Z eposu o Gilgamešovi", why: "Gilgameš je hrdina z Mezopotámie. Příběh o zranitelné patě je řecký." },
    ],
    hints: [
      "Hledáš řeckou báji, ve které bojují hrdinové.",
      "Nejsilnější řecký bojovník byl podle báje nezranitelný kromě paty a padl před branami obléhaného města šípem trojského prince. Z toho odvoď, o kterou válku jde.",
    ],
    explanation: "Achilleus, zasažený šípem do paty, je hrdina báje o trojské válce. Odtud pochází i rčení „Achillova pata“ pro slabé místo.",
  },
  {
    q: "Obří dřevěná socha zvířete, v ní ukrytí vojáci a v noci otevřené brány města. Ke kterému příběhu to patří?",
    correct: "K báji o dobytí Tróje",
    distractors: [
      { value: "K báji o Mínotaurovi", why: "V pověsti o Mínotaurovi jde o obludu v labyrintu, ne o lest s ukrytými vojáky." },
      { value: "K bitvě u Marathónu", why: "Bitva u Marathónu je skutečná bitva s Peršany o mnoho staletí později, bez jakékoli lsti se zvířetem." },
      { value: "K výpravě Alexandra Velikého", why: "Alexandr Veliký žil téměř o tisíc let později. Báje o lsti se zvířetem je mnohem starší." },
    ],
    hints: [
      "Stopou je lest: vojáci se dostanou do města ukrytí uvnitř dárku.",
      "Řekové po deseti letech obléhání předstírali odplutí a nechali před branami dar. Obránci ho vtáhli dovnitř. Skutečné bitvy s Peršany a Alexandrovy výpravy jsou z mnohem pozdější doby.",
    ],
    explanation: "Lest s dřevěným koněm patří k báji o dobytí Tróje. Archeologie ji nedokládá, zná ji z Homérovy tradice.",
  },
  {
    q: "Obchodníci z velkého ostrova plují s olejem a vínem až do Egypta a doma je čeká palác zdobený malbami. Kdo to je?",
    correct: "Krétané z doby paláců",
    distractors: [
      { value: "Mykéňané z doby hradů", why: `${DRUHA} Mykéňané žili na pevnině v opevněných hradech, ne na ostrově.` },
      { value: "Egypťané z doby faraonů", why: "Egypťané do Egypta neplují, žijí v něm. Obchodníci připlouvají z ostrova." },
      { value: "Athéňané z doby Periklovy", why: "Periklés žil až v klasické době, o mnoho staletí později." },
    ],
    hints: [
      "Stopy: domov na ostrově, obchod po moři a palác s malbami.",
      "Civilizace, která spoléhala na loďstvo, vozila zboží po celém východním Středomoří. Na pevnině žili bojovní stavitelé hradů, Athény přišly na řadu mnohem později.",
    ],
    explanation: "Námořní obchod z velkého ostrova a paláce s malbami jsou znakem Kréty. Krétané obchodovali s Egyptem i dalšími zeměmi.",
  },
  {
    q: "Královský palác měl tolik chodeb, schodišť a místností, že si ho pozdější Řekové spojili s bájným bludištěm. O kterou stavbu jde?",
    correct: "O palác v Knóssu",
    distractors: [
      { value: "O hrad v Mykénách", why: `${DRUHA} Mykénský hrad byl hlavně pevnost s hradbami, ne rozlehlé bludiště místností.` },
      { value: "O hradby Tróje", why: "Hradby jsou opevnění kolem města, ne palác plný chodeb. S bájným bludištěm Trója nesouvisí." },
      { value: "O pyramidu v Gíze", why: "Pyramida je egyptská hrobka s několika chodbami, ne palác s množstvím místností." },
    ],
    hints: [
      "Stopou je obrovské množství místností, ve kterých se dalo zabloudit.",
      "Vzpomeň si, kde podle pověsti stálo bludiště s obludou. Archeologové tam odkryli palác s více než tisícem místností a hledáš právě tohle místo.",
    ],
    explanation: "Spletitý palác v Knóssu na Krétě mohl dát vznik pověsti o labyrintu. Mykény a Trója byly opevněná sídla, pyramida egyptská hrobka.",
  },
  {
    q: "Nápis na tabulce z paláce zůstává nerozluštěný, protože jazyk jeho pisatelů neznáme. Čí to je písmo?",
    correct: "Minojských Krétanů",
    distractors: [
      { value: "Mykénských Řeků", why: `${PISMO} Mykénské písmo je rozluštěné, zapisuje ranou řečtinu.` },
      { value: "Starých Egypťanů", why: "Egyptské hieroglyfy se číst dají, rozluštil je Champollion." },
      { value: "Obránců Tróje", why: "Z Tróje takové nerozluštěné archivy tabulek neznáme." },
    ],
    hints: [
      "Stopou je, že nápisu dosud nikdo neporozuměl.",
      "Mykénské tabulky rozluštil Ventris a egyptské hieroglyfy Champollion. Nerozluštěné zůstalo starší písmo z paláců na ostrově, jejichž obyvatelé řecky ještě nemluvili.",
    ],
    explanation: "Nerozluštěné lineární písmo A patří Krétanům z doby paláců. Znaky umíme přibližně vyslovit, ale jejich jazyk neznáme, proto nápisům nerozumíme.",
  },
  {
    q: "Opevněné sídlo na kopci, v jehož hlavní síni hořel kulatý krb a z hradeb bylo vidět na úrodnou rovinu. Kdo v něm vládl?",
    correct: "Mykénský král",
    distractors: [
      { value: "Krétský král", why: `${DRUHA} Krétští vládci sídlili v palácích bez hradeb.` },
      { value: "Egyptský faraon", why: "Faraon sídlil v Egyptě u Nilu, ne v hradu na kopci." },
      { value: "Babylonský král", why: "Babylon ležel v Mezopotámii na rovině u řeky, ne v hradu nad řeckou rovinou." },
    ],
    hints: [
      "Stopou je opevnění: sídlo s hradbami na kopci, odkud se dala hlídat krajina.",
      "Stavitelé hradů žili na řecké pevnině a museli se bránit. Vládci na ostrově stavěli paláce bez hradeb a Egypt s Babylonem patří jiným zemím.",
    ],
    explanation: "Opevněný hrad na kopci s hlavní síní a krbem je typické sídlo mykénského krále.",
  },
  {
    q: "Bojovníci v přilbách z kančích klů a s velkými štíty se vracejí z nájezdu a ukládají kořist do hradu. Kdo to je?",
    correct: "Mykénští válečníci",
    distractors: [
      { value: "Krétští námořníci", why: `${DRUHA} Krétané proslavili hlavně obchod a paláce bez hradeb.` },
      { value: "Egyptští vojáci", why: "Přilby z kančích klů jsou známé z řeckých hrobů, ne z Egypta." },
      { value: "Římští legionáři", why: "Římské legie vznikly o mnoho staletí později a nosily kovové přilby." },
    ],
    hints: [
      "Stopy: bojovníci, nájezdy a kořist uložená v hradu.",
      "Válečnická civilizace žila v opevněných hradech na pevnině a její hrdinové podle Homéra táhli i přes moře. Námořní obchodníci z ostrova a pozdější Římané to nejsou.",
    ],
    explanation: "Přilby z kančích klů, velké štíty a nájezdy jsou znakem bojovných Mykéňanů.",
  },
  {
    q: "Slepý pěvec prý chodil od dvora ke dvoru a zpíval dlouhé verše o hněvu hrdiny při obléhání města. Které dílo zpíval?",
    correct: "Ilias",
    distractors: [
      { value: "Epos o Gilgamešovi", why: "Epos o Gilgamešovi pochází z Mezopotámie a o obléhání řeckými hrdiny není." },
      { value: "Kniha mrtvých", why: "Kniha mrtvých jsou egyptské texty pro posmrtný život, ne verše o válce." },
      { value: "Pověst o Mínotaurovi", why: "Pověst o Mínotaurovi je krétská báje o labyrintu, ne o obléhání města." },
    ],
    hints: [
      "Stopy: slepý pěvec, hněv hrdiny a obléhané město.",
      "Báseň začíná hněvem nejsilnějšího řeckého bojovníka a odehrává se u hradeb města v Malé Asii. Hledáš ji mezi řeckými díly, ne mezi texty z Egypta a Mezopotámie.",
    ],
    explanation: "Ilias, kterou tradice připisuje slepému Homérovi, vypráví o hněvu Achillea při obléhání Tróje.",
  },
  {
    q: "Džbány, misky a poháry zdobené chobotnicemi a mořskými řasami, nalezené v troskách paláce na ostrově. Ke které kultuře patří?",
    correct: "Minojské kultuře",
    distractors: [
      { value: "Mykénské kultuře", why: "Tohle patří druhé civilizaci. Mykéňané chobotnice malovat převzali, ale nádoby ležely v troskách paláce na ostrově, a to je Kréta." },
      { value: "Egyptské kultuře", why: "Egypt neleží na ostrově a jeho nádoby zdobily jiné motivy." },
      { value: "Babylonské kultuře", why: "Babylon ležel v Mezopotámii, daleko od moře, a paláce na ostrově neměl." },
    ],
    hints: [
      "Stopy: motivy z moře a palác na ostrově.",
      "Chobotnice se malovaly na více místech, rozhoduje proto místo nálezu. Palác na ostrově patří civilizaci pojmenované po bájném králi ostrova.",
    ],
    explanation: "Nádoby s chobotnicemi z trosek paláce na ostrově patří minojské (krétské) kultuře, která žila z moře. Motiv později převzali i Mykéňané, rozhodlo proto místo nálezu.",
  },
];

// ── L3 — ANALÝZA: co nález dokazuje, mýtus proti prameni, datace ───────────
export const POOL_L3: Polozka[] = [
  {
    q: "Krétské paláce neměly mohutné hradby. Co z toho historici usuzují?",
    correct: "Že Krétu chránilo moře a silné loďstvo",
    correctClaimKind: "evidence",
    distractors: [
      { value: "Že Krétané neznali žádné zbraně ani války", claimKind: "other", why: "Chybějící hradby neznamenají, že Krétané neznali zbraně. Znamená to jen, že se nebáli útoku po souši." },
      { value: "Že palác střežil Mínotaurus v labyrintu", claimKind: "myth", why: "Mínotaurus je postava pověsti. Archeologové žádnou obludu nenašli, takže hradby nahradit nemohl." },
      { value: "Že hradby zbořili až Athéňané a Sparťané", claimKind: "other", why: "Athény a Sparta vzkvétaly o mnoho staletí později. Krétské paláce hradby vůbec neměly." },
    ],
    hints: [
      "Zeptej se, co chrání ostrov, když ho nechrání zdi.",
      "Na ostrov se nepřítel musel dostat po moři. Kdo měl nejsilnější lodě, nepotřeboval kolem paláce hradby. Vyřaď pověst a pozdější dobu.",
    ],
    explanation: "Protože Kréta je ostrov, útočník by musel připlout. Silné loďstvo tak chránilo paláce lépe než zdi, a proto hradby nepotřebovaly.",
  },
  {
    q: "Schliemann nazval zlatou masku z mykénského hrobu „Agamemnónovou“. Co tento nález skutečně dokazuje?",
    correct: "Že mykénští vládci byli bohatí a mocní",
    correctClaimKind: "evidence",
    nalez: true,
    distractors: [
      { value: "Že král Agamemnón opravdu žil a vedl válku", claimKind: "myth", why: "Na masce není jméno. Agamemnón je postava Homérovy básně a maska je navíc starší než doba trojské války." },
      { value: "Že masku vyrobili krétští zlatníci pro Mínóa", claimKind: "myth", why: "Maska ležela v hrobě na Peloponésu, ne na Krétě, a Mínós je bájná postava." },
      { value: "Že všichni Mykéňané žili v bohatství", claimKind: "other", why: "Maska ležela v hrobě vládce. O tom, jak žili obyčejní lidé, jeden královský hrob nic neříká." },
    ],
    hints: [
      "Odděl, co na nálezu opravdu je, od jména, které mu dal objevitel.",
      "Na masce žádný nápis se jménem není. Z hrobu plného zlata poznáš jen to, že v něm ležel někdo velmi bohatý. Jméno z Homérovy básně je objevitelův nápad, ne důkaz.",
    ],
    explanation: "Zlatá maska dokládá bohatství a moc mykénských vládců. Jméno „Agamemnónova“ jí dal Schliemann podle Homéra, maska je ale starší a jméno nenese.",
  },
  {
    q: "Archeologové našli v Tróji vrstvu se stopami požáru a zničení. Co to znamená pro příběh o dřevěném koni?",
    correct: "Město mohlo být dobyto, kůň ale doložen není",
    correctClaimKind: "evidence",
    nalez: true,
    distractors: [
      { value: "Kůň je tím doložen, shořel spolu s městem", claimKind: "myth", why: "Stopy požáru ukazují zničení města, ne dřevěného koně. Kůň je součást báje." },
      { value: "Požár dokazuje, že město dobyli právě Řekové", claimKind: "other", why: "Požár ukazuje zničení, ne kdo ho způsobil. Mohl to být jiný nepřítel, zemětřesení i nehoda." },
      { value: "Město tedy nikdo nedobyl, jen samo vyhořelo", claimKind: "other", why: "Požár dobytí nevylučuje. Města se při dobývání často vypalovala, jen z ohořelých zdí nepoznáš, co přesně se stalo." },
    ],
    hints: [
      "Rozliš, co nález ukazuje, od podrobností, které přidal příběh.",
      "Požár a zničení mohou mít různé příčiny, třeba útok nepřátel. O tom, jakou lstí se útočníci dostali dovnitř, ale ohořelé zdi nic neřeknou.",
    ],
    explanation: "Stopy požáru dokazují, že město bylo zničeno, třeba i dobyto. Dřevěného koně archeologie nenašla, zůstává součástí báje.",
  },
  {
    q: "Proč si historici myslí, že báje o Mínotaurovi může mít kořen ve skutečnosti?",
    correct: "Krétské malby ukazují býky a palác byl spletitý",
    correctClaimKind: "evidence",
    distractors: [
      { value: "Archeologové našli v paláci kostru býčího muže", claimKind: "myth", why: "Žádná taková kostra neexistuje. Mínotaurus je bájná obluda, ne nález." },
      { value: "Mykénské hradby měly tvar bludiště", claimKind: "other", why: "Bludiště se v pověsti spojuje s krétským palácem. Mykénské hradby tvořily pevnost, ne spleť chodeb." },
      { value: "Egyptští bohové měli zvířecí hlavy jako on", claimKind: "other", why: "Egyptské zvířecí hlavy bohů nevysvětlují krétskou pověst. Je to jiná země a jiné náboženství." },
    ],
    hints: [
      "Hledej skutečné nálezy na Krétě, které připomínají dvě části pověsti: obludu a bludiště.",
      "Pověst vypráví o býčí obludě v bludišti. Zeptej se, jaké zvíře Krétané často malovali a jak vypadal palác s množstvím chodeb. Vymyšlené nálezy vyřaď.",
    ],
    explanation: "Krétané uctívali býka a malovali ho a palác v Knóssu měl spletité chodby. Z toho mohla vzniknout pověst o býčí obludě v labyrintu.",
  },
  {
    q: "Tabulky s lineárním písmem B se našly i v paláci v Knóssu. Co z toho plyne?",
    correct: "Že Krétu později ovládli Mykéňané",
    correctClaimKind: "evidence",
    distractors: [
      { value: "Že tohle písmo vymysleli Krétané jako první", claimKind: "other", why: `${PISMO} Tabulky s písmem B v Knóssu jsou mladší než krétské písmo A.` },
      { value: "Že Knóssos patřil pod vládu Tróje", claimKind: "myth", why: "Nic takového nálezy nedokládají. Trója ležela v Malé Asii a písmo B je řecké." },
      { value: "Že obě kultury psaly ve stejné době stejně", claimKind: "other", why: "Krétané dřív psali lineárním písmem A. Písmo B se v Knóssu objevilo až později, spolu s mykénskou správou." },
    ],
    hints: [
      "Uvědom si, čím jazykem je písmo B a kdo tímto jazykem mluvil.",
      "Písmo B je raná řečtina, jazyk lidí z pevniny. Když se objeví v krétském paláci, musel se tam změnit jazyk správy. Zeptej se, kdo tam začal vládnout.",
    ],
    explanation: "Písmo B zapisuje řečtinu Mykéňanů. Jeho tabulky v Knóssu ukazují, že palác později spravovali Mykéňané, kteří Krétu ovládli.",
  },
  {
    q: "Rozkvět krétských paláců se klade asi do let 2000–1450 př. n. l., trojská válka kolem roku 1200 př. n. l. Co z toho vyplývá?",
    correct: "Paláce vzkvétaly dřív než trojská válka",
    correctClaimKind: "evidence",
    distractors: [
      { value: "Trojská válka byla dřív, protože 1200 je menší číslo", claimKind: "other", why: "Před naším letopočtem je menší číslo blíž k dnešku, tedy později. Válka kolem roku 1200 př. n. l. je proto mladší než paláce." },
      { value: "Obojí se odehrálo ve stejném století", claimKind: "other", why: "Mezi koncem rozkvětu paláců a válkou leží asi dvě a půl století, nejde tedy o stejné století." },
      { value: "Paláce postavili až Řekové, kteří vyhráli trojskou válku", claimKind: "myth", why: "Paláce jsou podle datace starší. Nemohli je postavit hrdinové báje, která se odehrává později." },
    ],
    hints: [
      "Před naším letopočtem se roky počítají pozpátku. Pozor, které číslo znamená dřívější dobu.",
      "Čím větší číslo před naším letopočtem, tím dál od dneška. Porovnej konec rozkvětu paláců s rokem války a zjisti, co bylo starší a co mladší.",
    ],
    explanation: "Před naším letopočtem je větší číslo dřív. Paláce vzkvétaly asi do roku 1450 př. n. l., válka se klade kolem roku 1200 př. n. l., takže paláce byly o několik set let dřív.",
  },
  {
    q: "Homér podle tradice žil asi o několik set let později, než se měla odehrát trojská válka. Co to znamená pro jeho vyprávění?",
    correct: "Válku nezažil, znal ji z vyprávění předků",
    correctClaimKind: "evidence",
    distractors: [
      { value: "Je to přesný záznam vojáka, který u Tróje bojoval", claimKind: "myth", why: "Kdo žil o staletí později, nemohl v boji stát. Homér není očitý svědek." },
      { value: "Popisuje hlavně válku Athén se Spartou", claimKind: "other", why: "Válka Athén se Spartou proběhla až v klasické době, dlouho po Homérovi." },
      { value: "Vypráví hlavně o pádu krétských paláců", claimKind: "other", why: "Ilias vypráví o obléhání Tróje, ne o krétských palácích." },
    ],
    hints: [
      "Porovnej, kdy básník žil, s tím, kdy se válka měla odehrát.",
      "Když mezi událostí a vyprávěním uplyne několik století, vypravěč nemohl nic vidět na vlastní oči. Zeptej se, odkud se příběh dozvěděl a jak se mohl během staletí měnit.",
    ],
    explanation: "Homér žil staletí po válce, proto ji nezažil. Skládal ji z příběhů, které si lidé předávali ústně, a ty se cestou měnily a zkrášlovaly.",
  },
  {
    q: "Nad vstupem do Mykén jsou vytesaní dva lvi a brána je z obrovských kvádrů. Co z toho usuzujeme o mykénských vládcích?",
    correct: "Chtěli ukázat svou sílu a hrad dobře bránit",
    correctClaimKind: "evidence",
    nalez: true,
    distractors: [
      { value: "Hrad jim postavili obři kyklopové z pověsti", claimKind: "myth", why: "Pozdější Řekové stavbu připsali bájným kyklopům, protože nechápali, jak lidé tak velké kameny zvedli. Ve skutečnosti hradby postavili lidé." },
      { value: "Uctívali lvy jako Egypťané posvátnou sfingu", claimKind: "other", why: "Lvi nad bránou jsou znak síly. Nedokazují, že Mykéňané uctívali lvy jako bohy." },
      { value: "Chovali v hradě živé lvy na obranu brány", claimKind: "other", why: "Reliéf nad bránou je výzdoba a znak, ne záznam o chovu zvířat. Živé lvy v hradu nic nedokládá." },
    ],
    hints: [
      "Zeptej se, co měla brána z obrovských kamenů a se šelmami ukázat příchozím.",
      "Mohutná vstupní brána chrání hrad před útokem a lvi jsou znak síly. Obři z pověsti a egyptská sfinga nálezu nic nevysvětlují.",
    ],
    explanation: "Brána z obřích kvádrů chránila hrad a lvi nad ní ukazovali moc vládců. Mykéňané se museli bránit a dávali svou sílu najevo.",
  },
  {
    q: "V Tróji leží několik měst na sobě, každé postavené na troskách staršího. Co z toho plyne pro archeology?",
    correct: "Musí zjistit, která vrstva odpovídá době války",
    correctClaimKind: "evidence",
    distractors: [
      { value: "Nejvyšší vrstva je nejstarší, takže je z války", claimKind: "other", why: "Nové město se stavělo na troskách starého. Nahoře je tedy nejmladší vrstva, ne nejstarší." },
      { value: "Každá vrstva je jedna válka z Homérovy básně", claimKind: "myth", why: "Homér vypráví o jedné válce. Vrstvy vznikaly požáry, zemětřesením i obyčejnou přestavbou." },
      { value: "Trója byla postavena až za Alexandra Velikého", claimKind: "other", why: "Nejstarší vrstvy Tróje jsou o mnoho set let starší než Alexandr Veliký." },
    ],
    hints: [
      "Mysli na to, jak vznikají vrstvy: co je dole a co nahoře.",
      "Starší město je dole a mladší na něm. Když hledáš jednu událost z báje, musíš u každé vrstvy určit, z jaké doby pochází, a vybrat tu pravou.",
    ],
    explanation: "Vrstvy leží na sobě od nejstarší dole po nejmladší nahoře. Archeologové proto musí určit, která z nich pochází asi z doby kolem roku 1200 př. n. l.",
  },
  {
    q: "Mykénské tabulky s lineárním písmem B obsahují hlavně seznamy obilí, oleje a zbraní. Co tyto tabulky dokazují?",
    correct: "Že palác pečlivě evidoval zásoby a zbraně",
    correctClaimKind: "evidence",
    nalez: true,
    distractors: [
      { value: "Že Řekové skutečně bojovali deset let u Tróje", claimKind: "myth", why: "Seznamy zásob o trojské válce nic neříkají. Desetileté obléhání zná jen báje." },
      { value: "Že je sepsal Homér jako první verzi Iliady", claimKind: "myth", why: "Tabulky jsou úřední seznamy, ne báseň. Homér žil až mnohem později." },
      { value: "Že Mykénám vládla athénská demokracie", claimKind: "other", why: "Demokracie vznikla v Athénách až o mnoho staletí později. Mykénám vládli králové." },
    ],
    hints: [
      "Zeptej se, co v tabulkách opravdu stojí, a nic nepřidávej.",
      "Seznam obilí, oleje a zbraní je úřední záznam. Dozvíš se z něj, jak palác hospodařil, ale ne příběhy o hrdinech ani o válce, kterou líčí básně.",
    ],
    explanation: "Tabulky jsou účetní záznamy paláce. Dokazují, že správa sledovala zásoby a zbraně. O trojské válce ani o Homérovi nic neříkají.",
  },
  {
    q: "Na Krétě se našly paláce, ale Mínós je znám jen z řeckých pověstí. Co z toho usuzujeme?",
    correct: "Že tu vládli králové, ale Mínós doložen není",
    correctClaimKind: "evidence",
    distractors: [
      { value: "Že paláce postavil sám král Mínós, to je jisté", claimKind: "myth", why: "Jméno Mínós nálezy nedokládají, zná ho jen pověst. Jisté je, že paláce někdo řídil." },
      { value: "Že palácům vládl mykénský král Agamemnón", claimKind: "myth", why: "Agamemnón je postava Homérovy báje o Mykénách a na Krétě podle ní nevládl." },
      { value: "Že paláce patřily egyptským faraonům", claimKind: "other", why: "Krétané s Egyptem obchodovali, ale faraoni na Krétě nevládli." },
    ],
    hints: [
      "Odděl, co leží v zemi, od jména, které přináší jen vyprávění.",
      "Velké paláce někdo stavěl a řídil, to nálezy ukazují. Jméno vládce ale v nálezech zapsané není, ví se o něm jen z pověstí vyprávěných o staletí později.",
    ],
    explanation: "Paláce dokazují, že Krétě vládli mocní panovníci. Jméno Mínós ale známe jen z pověstí, nálezy ho nepotvrzují.",
  },
  {
    q: "Ve vykopávkách Tróje se našly zbraně a hroty šípů. Dokazuje to, že Achilleus a Hektór opravdu žili?",
    correct: "Ne, zbraně dokládají boje, ne konkrétní hrdiny",
    correctClaimKind: "evidence",
    nalez: true,
    distractors: [
      { value: "Ano, zbraně jsou přímým důkazem obou hrdinů", claimKind: "myth", why: "Na zbraních nejsou jména. Hrdinové jsou postavy báje, nález je nepotvrzuje." },
      { value: "Ano, protože o nich psal očitý svědek Homér", claimKind: "myth", why: "Homér žil staletí po válce, očitým svědkem nebyl." },
      { value: "Ne, zbraně nedokazují ani to, že se tam bojovalo", claimKind: "other", why: "Hroty šípů v troskách města jsou stopou boje. Neříkají ale, kdo přesně bojoval." },
    ],
    hints: [
      "Zeptej se, jestli je na zbrani něco, co by prozradilo jméno majitele.",
      "Zbraně ukazují, že se u města bojovalo. Aby dokázaly existenci konkrétního člověka, musely by nést jeho jméno nebo ho zmínit jiný pramen z té doby.",
    ],
    explanation: "Zbraně dokládají, že se u Tróje bojovalo. Jméno konkrétního bojovníka ale nenesou, takže Achillea a Hektóra nedokazují.",
  },
  {
    q: "Na mykénských dýkách a vázách jsou výjevy lovu a boje, na krétských malbách hlavně moře, příroda a slavnosti. Co z toho usuzujeme?",
    correct: "Mykénské umění víc oslavovalo boj a lov než krétské",
    correctClaimKind: "evidence",
    distractors: [
      { value: "Krétské umění víc oslavovalo boj než mykénské", claimKind: "other", why: "Výjevy boje a lovu převažují na mykénských dýkách a vázách. Krétské malby ukazují spíš moře a slavnosti." },
      { value: "Obě kultury si cenily úplně stejných věcí", claimKind: "other", why: "Výjevy se liší. Rozdílná výzdoba ukazuje, že si každá kultura cenila něčeho jiného." },
      { value: "Krétané zbraně neznali a nikdy nebojovali", claimKind: "other", why: "Z výzdoby poznáš, co kultura ráda zobrazovala, ne že neznala zbraně. Na Krétě se zbraně i výjevy boje našly." },
    ],
    hints: [
      "Porovnej, co která kultura malovala nejčastěji.",
      "Lidé zobrazují to, co je pro ně důležité. Kdo zdobí zbraně lovem a bojem, cení si války, kdo maluje moře a slavnosti, žije spíš obchodem a oslavami.",
    ],
    explanation: "Mykéňané zdobili zbraně a vázy lovem a bojem, Krétané spíš mořem a slavnostmi. Ukazuje to, čeho si která kultura cenila. Odpovídá tomu i to, že Mykéňané stavěli hrady s hradbami.",
  },
  {
    q: "Schliemann podle popisu krajiny v Homérových básních Tróju opravdu našel. Znamená to, že je Ilias přesný záznam války?",
    correct: "Ne, sedí místo, ale děj tím doložen není",
    correctClaimKind: "evidence",
    nalez: true,
    distractors: [
      { value: "Ano, našel tam i zbytky dřevěného koně", claimKind: "myth", why: "Zbytky dřevěného koně nikdo nenašel. Kůň je součást báje." },
      { value: "Ano, když sedí místo, sedí i celý děj", claimKind: "other", why: "Básník mohl znát skutečné místo a přitom děj přikrášlit nebo vymyslet. Jedno z druhého neplyne." },
      { value: "Ne, přesný je jen popis bitev, ne krajiny", claimKind: "other", why: "Je to obráceně. Popis krajiny Schliemannovi pomohl město najít, bitvy a hrdinové doložení nejsou." },
    ],
    hints: [
      "Odděl, co vykopávky potvrdily, od toho, co báseň vypráví o lidech a bojích.",
      "Najít město podle popisu krajiny je jedna věc. Aby byl doložen i děj, museli by archeologové najít stopy konkrétních událostí z básně.",
    ],
    explanation: "Popis krajiny v Homérových básních Schliemanna dovedl k Tróji, básník tedy znal skutečné místo. Hrdinové, jejich činy ani lest s koněm tím ale doložené nejsou.",
  },
  {
    q: "Ilias vypráví, že bohové zasahovali do bojů u Tróje. Co z toho plyne pro historika?",
    correct: "Báseň je umělecké dílo, ne přesná kronika války",
    correctClaimKind: "evidence",
    distractors: [
      { value: "Bohové se bitev u Tróje opravdu účastnili", claimKind: "myth", why: "Zásahy bohů jsou součást víry a básně, ne doložená událost." },
      { value: "Nepřesné jsou jen zásahy bohů, jinak báseň sedí", claimKind: "other", why: "Kdo líčí zásahy bohů, nepíše přesnou kroniku. Přikrášlovat mohl i ostatní podrobnosti." },
      { value: "Báseň je celá vymyšlená a Trója neexistovala", claimKind: "other", why: "Tróju archeologové skutečně vykopali. Báseň přehání, ale město existovalo." },
    ],
    hints: [
      "Rozliš, co v básni může odpovídat skutečnosti a co je výmysl vypravěče.",
      "Zásahy bohů nelze doložit, takže báseň nemůže být přesný záznam. Nevyhazuj ji ale celou: město, kde se odehrává, archeologové opravdu našli.",
    ],
    explanation: "Zásahy bohů ukazují, že Ilias je umělecké dílo a ne přesný záznam. Historik ji používá opatrně, protože Trója sama skutečně existovala.",
  },
];

// ── Generátor ───────────────────────────────────────────────────────────────
const vytvor = (p: Polozka): PracticeTask =>
  choice(
    p.q,
    p.correct,
    p.distractors.map(({ value, why }) => ({ value, why })),
    { hints: p.hints, explanation: p.explanation },
  );

/** Deterministicky projde celou banku úrovně — každá položka dá jednu úlohu. */
function zBanky(pool: Polozka[]): PracticeTask[] {
  let i = 0;
  return ruzneUlohy(() => vytvor(pool[i++ % pool.length]), pool.length, pool.length);
}

function gen(level: number): PracticeTask[] {
  if (level <= 1) return zBanky(POOL_L1);
  if (level === 2) return zBanky(POOL_L2);
  return zBanky(POOL_L3);
}

// ── Topic ───────────────────────────────────────────────────────────────────
export const KRETA_MYKENY_TROJA: TopicMetadata[] = [
  {
    id: "g6-dej-kreta-mykeny-troja-6",
    rvpNodeId: "g6-dejepis-starovek-antika-recko-kretska-a-mykenska-civilizace-trojska-valka",
    displayName: "Kréta, Mykény a Trója",
    title: "Krétská a mykénská civilizace, trojská válka",
    studentTitle: "Kréta, Mykény a Trója",
    subject: "dejepis",
    category: "Starověk",
    topic: "Antika - Řecko",
    briefDescription: "Rozlišíš Krétu a Mykény a oddělíš báji o Tróji od nálezů.",
    keywords: [
      "Kréta", "Knóssos", "Mínós", "Mínotaurus", "labyrint", "lineární písmo A",
      "Mykény", "Lví brána", "kyklopské hradby", "Agamemnón", "lineární písmo B",
      "Trója", "trojská válka", "Homér", "Ilias", "Odysseia", "Schliemann",
    ],
    goals: [
      "Rozlišit krétskou (minojskou) a mykénskou civilizaci podle staveb, písma a výzdoby.",
      "Poznat hlavní postavy a díla báje o trojské válce.",
      "Oddělit, co dokládají archeologické nálezy, od toho, co vypráví pověst a Homér.",
    ],
    boundaries: [
      "Jen fakta shodná v učebnicích 6. ročníku; datace jen s „asi/kolem“.",
      "Role výbuchu Théry, existence Homéra a skutečná podoba války nejsou klíčem.",
      "Klasické Řecko, Egypt a Mezopotámie jen jako zdroj záměn.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Kréta = ostrov, paláce bez hradeb, býk, lineární písmo A. Mykény = Peloponés, hrady s hradbami, zlaté masky, lineární písmo B. Trója = Malá Asie, Homér, báje.",
      steps: [
        "Najdi v zadání stopu: hradby, ostrov, moře, písmo, postava z báje.",
        "Zeptej se, jestli možnost nepatří druhé civilizaci nebo pozdější době.",
        "U nálezu odděl, co v zemi opravdu leží, od toho, co vypráví pověst.",
      ],
      commonMistake: "Splést si Krétu s Mykénami a brát Mínotaura, dřevěného koně nebo Agamemnóna jako doložená fakta.",
      example: "Zlatá maska z Mykén dokazuje bohatství vládců, ne to, že žil Agamemnón.",
    },
  },
];
