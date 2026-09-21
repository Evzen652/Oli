/**
 * Čeština 6. ročník — Opakování slovních druhů: ohebné, neohebné (select_one).
 *
 * Navazuje na `grade-5/cjl/slovniDruhyUrcovaniVsechDesetiOhebneANeohebne.ts`
 * (určování všech deseti slovních druhů), ale cílí přímo na dělení ohebné ×
 * neohebné a na věty, kde o slovním druhu rozhoduje kontext (předložka ×
 * příslovce, příslovce × přídavné jméno, stupňování × ohýbání). Věty jsou
 * vlastní, žádná se nepřebírá z 5. ročníku.
 *
 *  • L1 — rozpoznání: (a) které slovo z věty se nedá ohýbat; (b) je dané
 *    slovo ohebné/neohebné a který je to konkrétní druh (jen jasné případy).
 *  • L2 — aplikace s důkazem ohýbáním: (a) najdi jediné příslovce ve větě,
 *    která obsahuje i přídavné jméno stejného kořene; (b) najdi jediné
 *    ohebné slovo (číslovku/zájmeno) mezi neohebnými; (c) jakým ohnutím
 *    dokážeš ohebnost slova.
 *  • L3 — analýza a přenos: (a) inverze předložka × příslovce (kolem, vedle,
 *    blízko, okolo) — rozhoduje, jestli po slově následuje jméno v pádu;
 *    (b) stupňování není ohýbání (stupňované příslovce × stupňované přídavné
 *    jméno, důkaz ohebnosti pádem, ne stupněm); (c) celovětná analýza (věta,
 *    kde jsou všechna slova ohebná / věta jen s jedním předložkovým);
 *    (d) příslovce × podstatné jméno u téhož tvaru (večer, ráno, odpoledne)
 *    podle funkce ve větě.
 *
 * Chybový model (viz distraktory): záměna příslovce a přídavného jména
 * stejného kořene; stupňování považované za ohýbání; číslovky a zájmena
 * mylně pokládané za neohebná; neohebnost chápaná jako „slovo nikdy nemění
 * tvar“; předložka × příslovce rozlišovaná podle
 * samotného slova místo podle věty.
 *
 * Sporné body (pětka/dvojka/stovka, jen/i/také, "to" jako částice, mnoho/málo,
 * zpodstatnělá přídavná jména) se v tématu jako klíč nevyskytují.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pick, shuffle, buildChoiceTask as choice, losUlohy, ruzneUlohy } from "./_shared";

/** Jedna položka banky: otázka, klíč, distraktory [možnost, proč je to chyba], dvě nápovědy, vysvětlení. */
interface Polozka {
  q: string;
  key: string;
  ds: [string, string][];
  h: [string, string];
  ex: string;
}

const uloha = (p: Polozka): PracticeTask | null =>
  choice(p.q, p.key, shuffle(p.ds.map(([value, why]) => ({ value, why }))), { hints: [...p.h], explanation: p.ex });

// ── L1 (a) — které slovo z věty se nedá ohýbat ──────────────────────────────
const BANKA_L1A: Polozka[] = [
  {
    q: "Které slovo z věty „Pes rychle utekl na zahradu.“ se nedá ohýbat (nemění tvar)?",
    key: "rychle",
    ds: [
      ["pes", "Slovo „pes“ je podstatné jméno a ohýbá se (skloňuje): pes – psa – psovi."],
      ["utekl", "Slovo „utekl“ je sloveso a časuje se: uteču – utečeš – utekl."],
      ["zahradu", "Slovo „zahradu“ je podstatné jméno a ohýbá se (skloňuje): zahrada – zahrady – zahradě."],
    ],
    h: [
      "Zkus každé ze čtyř slov postupně ohnout (skloňovat nebo časovat) a sleduj, které se nezmění.",
      "Tři z nabízených slov jsou podstatná jména nebo slovesa, ta se dají ohnout. Jedno slovo odpovídá na otázku jak/kde/kdy a jeho tvar zůstává stejný, ať ho ohýbáš jakkoli.",
    ],
    ex: "Slovo „rychle“ odpovídá na otázku jak? a jeho tvar se nemění – je to příslovce. Ostatní slova (pes, utekl, zahradu) jsou podstatné jméno nebo sloveso a dají se ohnout.",
  },
  {
    q: "Které slovo z věty „Babička dnes upekla velký koláč.“ se nedá ohýbat (nemění tvar)?",
    key: "dnes",
    ds: [
      ["babička", "Slovo „babička“ je podstatné jméno a ohýbá se: babička – babičky – babičce."],
      ["upekla", "Slovo „upekla“ je sloveso a časuje se: upeču – upečeš – upekla."],
      ["koláč", "Slovo „koláč“ je podstatné jméno a ohýbá se: koláč – koláče – koláči."],
    ],
    h: [
      "Zkus každé ze čtyř slov postupně ohnout (skloňovat nebo časovat) a sleduj, které se nezmění.",
      "Tři z nabízených slov jsou podstatná jména nebo slovesa, ta se dají ohnout. Jedno slovo odpovídá na otázku kdy? a jeho tvar zůstává stejný, ať ho ohýbáš jakkoli.",
    ],
    ex: "Slovo „dnes“ odpovídá na otázku kdy? a jeho tvar se nemění – je to příslovce. Ostatní slova (babička, upekla, koláč) jsou podstatné jméno nebo sloveso a dají se ohnout.",
  },
  {
    q: "Které slovo z věty „Kluci hráli fotbal venku.“ se nedá ohýbat (nemění tvar)?",
    key: "venku",
    ds: [
      ["kluci", "Slovo „kluci“ je podstatné jméno a ohýbá se: kluk – kluci – klucích."],
      ["hráli", "Slovo „hráli“ je sloveso a časuje se: hraji – hráli – budu hrát."],
      ["fotbal", "Slovo „fotbal“ je podstatné jméno a ohýbá se: fotbal – fotbalu – fotbale."],
    ],
    h: [
      "Zkus každé ze čtyř slov postupně ohnout (skloňovat nebo časovat) a sleduj, které se nezmění.",
      "Tři z nabízených slov jsou podstatná jména nebo slovesa, ta se dají ohnout. Jedno slovo odpovídá na otázku kde? a jeho tvar zůstává stejný, ať ho ohýbáš jakkoli.",
    ],
    ex: "Slovo „venku“ odpovídá na otázku kde? a jeho tvar se nemění – je to příslovce. Ostatní slova (kluci, hráli, fotbal) jsou podstatné jméno nebo sloveso a dají se ohnout.",
  },
  {
    q: "Které slovo z věty „Maminka uvařila oběd bez soli.“ se nedá ohýbat (nemění tvar)?",
    key: "bez",
    ds: [
      ["maminka", "Slovo „maminka“ je podstatné jméno a ohýbá se: maminka – maminky – mamince."],
      ["uvařila", "Slovo „uvařila“ je sloveso a časuje se: uvařím – uvaříš – uvařila."],
      ["soli", "Slovo „soli“ je tvar podstatného jména sůl a ohýbá se: sůl – soli – solí."],
    ],
    h: [
      "Zkus každé ze čtyř slov postupně ohnout (skloňovat nebo časovat) a sleduj, které se nezmění.",
      "Tři z nabízených slov jsou podstatná jména nebo slovesa, ta se dají ohnout. Jedno slovo stojí před podstatným jménem „soli“ a určuje jeho pád – samo se přitom nemění.",
    ],
    ex: "Slovo „bez“ stojí před podstatným jménem a určuje jeho pád, samo se ale nemění – je to předložka. Ostatní slova (maminka, uvařila, soli) jsou podstatné jméno nebo sloveso a dají se ohnout.",
  },
  {
    q: "Které slovo z věty „Anna zpívala a tančila na jevišti.“ se nedá ohýbat (nemění tvar)?",
    key: "a",
    ds: [
      ["Anna", "Slovo „Anna“ je podstatné jméno (vlastní jméno) a ohýbá se: Anna – Anny – Anně."],
      ["zpívala", "Slovo „zpívala“ je sloveso a časuje se: zpívám – zpívala – budu zpívat."],
      ["tančila", "Slovo „tančila“ je sloveso a časuje se: tančím – tančila – budu tančit."],
    ],
    h: [
      "Zkus každé ze čtyř slov postupně ohnout (skloňovat nebo časovat) a sleduj, které se nezmění.",
      "Tři z nabízených slov jsou podstatné jméno nebo slovesa, ta se dají ohnout. Jedno slovo jen spojuje dvě další slova a jeho tvar zůstává stejný.",
    ],
    ex: "Slovo „a“ spojuje dvě slova ve větě a jeho tvar se nemění – je to spojka. Ostatní slova (Anna, zpívala, tančila) jsou podstatné jméno nebo slovesa a dají se ohnout.",
  },
  {
    q: "Které slovo z věty „Chlapec doběhl domů, protože pršelo.“ se nedá ohýbat (nemění tvar)?",
    key: "protože",
    ds: [
      ["chlapec", "Slovo „chlapec“ je podstatné jméno a ohýbá se: chlapec – chlapce – chlapci."],
      ["doběhl", "Slovo „doběhl“ je sloveso a časuje se: doběhnu – doběhl – doběhne."],
      ["pršelo", "Slovo „pršelo“ je sloveso a časuje se: prší – pršelo – bude pršet."],
    ],
    h: [
      "Zkus každé ze čtyř slov postupně ohnout (skloňovat nebo časovat) a sleduj, které se nezmění.",
      "Tři z nabízených slov jsou podstatné jméno nebo slovesa, ta se dají ohnout. Jedno slovo spojuje dvě věty a vysvětluje důvod, jeho tvar zůstává stejný.",
    ],
    ex: "Slovo „protože“ spojuje dvě věty a jeho tvar se nemění – je to spojka. Ostatní slova (chlapec, doběhl, pršelo) jsou podstatné jméno nebo slovesa a dají se ohnout.",
  },
  {
    q: "Které slovo z věty „Haf, zaštěkal pes na pošťáka.“ se nedá ohýbat (nemění tvar)?",
    key: "haf",
    ds: [
      ["zaštěkal", "Slovo „zaštěkal“ je sloveso a časuje se: zaštěká – zaštěkají – zaštěkal."],
      ["pes", "Slovo „pes“ je podstatné jméno a ohýbá se: pes – psa – psovi."],
      ["pošťáka", "Slovo „pošťáka“ je tvar podstatného jména pošťák a ohýbá se: pošťák – pošťáka – pošťákovi."],
    ],
    h: [
      "Zkus každé ze čtyř slov postupně ohnout (skloňovat nebo časovat) a sleduj, které se nezmění.",
      "Tři z nabízených slov jsou podstatné jméno nebo slovesa, ta se dají ohnout. Jedno slovo jen napodobuje zvuk a jeho tvar zůstává stejný.",
    ],
    ex: "Slovo „haf“ napodobuje zvuk a jeho tvar se nemění – je to citoslovce. Ostatní slova (zaštěkal, pes, pošťáka) jsou sloveso nebo podstatné jméno a dají se ohnout.",
  },
  {
    q: "Které slovo z věty „Kéž bychom vyhráli ten zápas!“ se nedá ohýbat (nemění tvar)?",
    key: "kéž",
    ds: [
      ["vyhráli", "Slovo „vyhráli“ je sloveso a časuje se: vyhraji – vyhraješ – vyhráli."],
      ["ten", "Slovo „ten“ je zájmeno a ohýbá se: ten – toho – tomu."],
      ["zápas", "Slovo „zápas“ je podstatné jméno a ohýbá se: zápas – zápasu – zápase."],
    ],
    h: [
      "Zkus každé ze čtyř slov postupně ohnout (skloňovat nebo časovat) a sleduj, které se nezmění.",
      "Tři z nabízených slov jsou sloveso, zájmeno nebo podstatné jméno, ta se dají ohnout. Jedno slovo jen uvozuje přání a jeho tvar zůstává stejný.",
    ],
    ex: "Slovo „kéž“ uvozuje přací větu a jeho tvar se nemění – je to částice. Ostatní slova (vyhráli, ten, zápas) jsou sloveso, zájmeno nebo podstatné jméno a dají se ohnout.",
  },
];

// ── L1 (b) — ohebné/neohebné a konkrétní druh (jen jasné případy) ─────────
const L1B: { word: string; veta: string; correct: string; ds: [string, string][] }[] = [
  {
    word: "pes",
    veta: "Pes běhá po dvoře.",
    correct: "ohebné – podstatné jméno",
    ds: [
      ["ohebné – přídavné jméno", "Přídavné jméno vyjadřuje vlastnost a odpovídá na otázku jaký? Slovo „pes“ pojmenovává zvíře (kdo? co?) – je to podstatné jméno."],
      ["neohebné – příslovce", "Příslovce se neohýbá. Slovo „pes“ se ale ohýbá (skloňuje): pes – psa – psovi – je to ohebné podstatné jméno."],
      ["neohebné – předložka", "Předložka stojí před jménem a sama se neohýbá. Slovo „pes“ se samo skloňuje – je to ohebné podstatné jméno."],
    ],
  },
  {
    word: "na",
    veta: "Talíř stojí na stole.",
    correct: "neohebné – předložka",
    ds: [
      ["ohebné – podstatné jméno", "Slovo „na“ se neohýbá a nedá se skloňovat jako podstatné jméno. Stojí před jménem „stole“ a určuje jeho pád – je to předložka."],
      ["neohebné – příslovce", "Příslovce stojí ve větě samostatně. Slovo „na“ tady stojí přímo před podstatným jménem „stole“ a řídí jeho pád – je to předložka."],
      ["neohebné – spojka", "Spojka spojuje slova nebo věty. Slovo „na“ tu nic nespojuje, stojí před jménem a určuje jeho pád – je to předložka."],
    ],
  },
  {
    word: "protože",
    veta: "Zůstal doma, protože byl nemocný.",
    correct: "neohebné – spojka",
    ds: [
      ["neohebné – částice", "Částice obvykle vyjadřuje postoj nebo přání. Slovo „protože“ spojuje dvě věty a vysvětluje důvod – je to spojka."],
      ["neohebné – příslovce", "Příslovce odpovídá na otázku jak/kde/kdy. Slovo „protože“ spojuje dvě věty – je to spojka."],
      ["ohebné – zájmeno", "Zájmeno zastupuje jméno a dá se ohnout. Slovo „protože“ se neohýbá a jen spojuje věty – je to neohebná spojka."],
    ],
  },
  {
    word: "haf",
    veta: "Haf! Pes u branky vítá pošťáka.",
    correct: "neohebné – citoslovce",
    ds: [
      ["neohebné – částice", "Částice vyjadřuje postoj nebo přání mluvčího. Slovo „haf“ napodobuje zvuk – je to citoslovce."],
      ["ohebné – podstatné jméno", "Slovo „haf“ se neohýbá, nedá se skloňovat. Napodobuje zvuk – je to neohebné citoslovce."],
      ["neohebné – příslovce", "Příslovce odpovídá na otázku jak/kde/kdy. Slovo „haf“ napodobuje zvuk psa – je to citoslovce."],
    ],
  },
  {
    word: "pět",
    veta: "Ve váze je pět růží.",
    correct: "ohebné – číslovka",
    ds: [
      ["neohebné – příslovce", "Číslovka „pět“ se dá ohnout (pět – pěti), příslovce se neohýbá – tohle slovo je ohebná číslovka."],
      ["ohebné – podstatné jméno", "Slovo „pět“ vyjadřuje počet (kolik?), ne název věci – je to číslovka, ne podstatné jméno."],
      ["ohebné – zájmeno", "Zájmeno zastupuje jméno. Slovo „pět“ vyjadřuje počet – je to číslovka."],
    ],
  },
  {
    word: "kniha",
    veta: "Kniha spadla ze stolu.",
    correct: "ohebné – podstatné jméno",
    ds: [
      ["neohebné – příslovce", "Příslovce se neohýbá. Slovo „kniha“ se skloňuje: kniha – knihy – knize – je to ohebné podstatné jméno."],
      ["ohebné – přídavné jméno", "Přídavné jméno odpovídá na otázku jaký? Slovo „kniha“ pojmenovává věc (co?) – je to podstatné jméno."],
      ["neohebné – předložka", "Předložka stojí před jménem a neohýbá se. Slovo „kniha“ se samo skloňuje – je to podstatné jméno."],
    ],
  },
  {
    word: "hezký",
    veta: "K narozeninám dostala hezký dárek.",
    correct: "ohebné – přídavné jméno",
    ds: [
      ["neohebné – příslovce", "Příslovce hezky se neohýbá. Slovo „hezký“ se ale skloňuje: hezký – hezkého – hezkému – je to přídavné jméno."],
      ["ohebné – podstatné jméno", "Slovo „hezký“ vyjadřuje vlastnost (jaký?), ne název věci – je to přídavné jméno."],
      ["ohebné – zájmeno", "Zájmeno zastupuje jméno. Slovo „hezký“ vyjadřuje vlastnost – je to přídavné jméno."],
    ],
  },
  {
    word: "rychle",
    veta: "Vlak jel rychle kolem nádraží.",
    correct: "neohebné – příslovce",
    ds: [
      ["ohebné – přídavné jméno", "Přídavné jméno rychlý se skloňuje. Slovo „rychle“ odpovídá na otázku jak? a tvar nemění – je to příslovce."],
      ["ohebné – podstatné jméno", "Slovo „rychle“ neoznačuje věc ani osobu a neohýbá se – je to příslovce, ne podstatné jméno."],
      ["neohebné – předložka", "Předložka stojí před podstatným jménem a řídí jeho pád. Slovo „rychle“ říká jak – je to příslovce."],
    ],
  },
  {
    word: "ať",
    veta: "Ať to vyjde!",
    correct: "neohebné – částice",
    ds: [
      ["neohebné – spojka", "Spojka spojuje slova nebo věty. Slovo „ať“ tu uvozuje přání – je to částice."],
      ["neohebné – citoslovce", "Citoslovce napodobuje zvuk nebo vyjadřuje pocit. Slovo „ať“ uvozuje přací větu – je to částice."],
      ["ohebné – sloveso", "Sloveso vyjadřuje děj a časuje se. Slovo „ať“ se neohýbá a jen uvozuje přání – je to částice."],
    ],
  },
  {
    word: "bum",
    veta: "Bum! Za oknem něco spadlo.",
    correct: "neohebné – citoslovce",
    ds: [
      ["neohebné – částice", "Částice vyjadřuje postoj nebo přání. Slovo „bum“ napodobuje zvuk – je to citoslovce."],
      ["ohebné – podstatné jméno", "Slovo „bum“ se neohýbá, nejde skloňovat. Napodobuje zvuk – je to citoslovce."],
      ["neohebné – příslovce", "Příslovce odpovídá na otázku jak/kde/kdy. Slovo „bum“ napodobuje zvuk pádu – je to citoslovce."],
    ],
  },
  {
    word: "spí",
    veta: "Pes spí před boudou.",
    correct: "ohebné – sloveso",
    ds: [
      ["neohebné – příslovce", "Příslovce se neohýbá. Slovo „spí“ se časuje: spím – spal – budu spát – je to sloveso."],
      ["ohebné – podstatné jméno", "Slovo „spí“ vyjadřuje děj (co dělá?), ne název věci – je to sloveso."],
      ["ohebné – přídavné jméno", "Přídavné jméno vyjadřuje vlastnost. Slovo „spí“ vyjadřuje děj – je to sloveso."],
    ],
  },
  {
    word: "otcův",
    veta: "Na židli leží otcův svetr.",
    correct: "ohebné – přídavné jméno",
    ds: [
      ["ohebné – podstatné jméno", "Slovo „otcův“ vyjadřuje, čí je svetr (čí?), ne název věci samotné – je to přídavné jméno přivlastňovací."],
      ["neohebné – příslovce", "Příslovce se neohýbá. Slovo „otcův“ se skloňuje: otcův – otcova – otcovu – je to přídavné jméno."],
      ["ohebné – zájmeno", "Zájmeno zastupuje jméno (např. jeho). Slovo „otcův“ přímo vyjadřuje vlastnictví jako přídavné jméno."],
    ],
  },
  {
    word: "dvanáct",
    veta: "Ve sklenici je dvanáct kuliček.",
    correct: "ohebné – číslovka",
    ds: [
      ["neohebné – příslovce", "Číslovka „dvanáct“ se dá ohnout (dvanáct – dvanácti), příslovce se neohýbá – je to ohebná číslovka."],
      ["ohebné – podstatné jméno", "Slovo „dvanáct“ vyjadřuje počet (kolik?), ne název věci – je to číslovka."],
      ["ohebné – sloveso", "Sloveso vyjadřuje děj a časuje se. Slovo „dvanáct“ vyjadřuje počet – je to číslovka."],
    ],
  },
  {
    word: "my",
    veta: "My jedeme na výlet.",
    correct: "ohebné – zájmeno",
    ds: [
      ["ohebné – podstatné jméno", "Slovo „my“ zastupuje jména osob, samo osobu nepojmenovává – je to zájmeno."],
      ["neohebné – částice", "Částice se neohýbá. Slovo „my“ se ohýbá: my – nás – nám – je to ohebné zájmeno."],
      ["ohebné – číslovka", "Číslovka vyjadřuje počet nebo pořadí. Slovo „my“ zastupuje osoby – je to zájmeno."],
    ],
  },
];

/** Vysvětlení L1 (b): důkaz (ne)ohebnosti tvary + rozlišovací otázka slovního druhu. */
const EX_L1B: Record<string, string> = {
  pes: "Slovo „pes“ se skloňuje (pes – psa – psovi), je tedy ohebné. Pojmenovává zvíře a odpovídá na otázku kdo? co?, proto je to podstatné jméno.",
  na: "Slovo „na“ svůj tvar nemění, je tedy neohebné. Stojí před jménem „stole“ a určuje jeho pád (na čem?), proto je to předložka.",
  protože: "Slovo „protože“ se neskloňuje ani nečasuje, je tedy neohebné. Spojuje dvě věty a uvádí důvod, proto je to spojka.",
  haf: "Slovo „haf“ se neskloňuje ani nečasuje, je tedy neohebné. Napodobuje zvuk psa, proto je to citoslovce.",
  pět: "Slovo „pět“ se skloňuje (pět – pěti), je tedy ohebné. Odpovídá na otázku kolik?, proto je to číslovka.",
  kniha: "Slovo „kniha“ se skloňuje (kniha – knihy – knize), je tedy ohebné. Pojmenovává věc a odpovídá na otázku co?, proto je to podstatné jméno.",
  hezký: "Slovo „hezký“ se skloňuje (hezký – hezkého – hezkému), je tedy ohebné. Odpovídá na otázku jaký? a vyjadřuje vlastnost, proto je to přídavné jméno.",
  rychle: "Slovo „rychle“ se neskloňuje ani nečasuje (jen se stupňuje: rychleji), je tedy neohebné. Odpovídá na otázku jak?, proto je to příslovce.",
  ať: "Slovo „ať“ svůj tvar nemění, je tedy neohebné. Uvozuje přací větu, proto je to částice.",
  bum: "Slovo „bum“ se neskloňuje ani nečasuje, je tedy neohebné. Napodobuje zvuk pádu, proto je to citoslovce.",
  spí: "Slovo „spí“ se časuje (spím – spíš – spí), je tedy ohebné. Vyjadřuje děj a odpovídá na otázku co dělá?, proto je to sloveso.",
  otcův: "Slovo „otcův“ se skloňuje (otcův – otcova – otcovu), je tedy ohebné. Odpovídá na otázku čí?, proto je to přídavné jméno (přivlastňovací).",
  dvanáct: "Slovo „dvanáct“ se skloňuje (dvanáct – dvanácti), je tedy ohebné. Odpovídá na otázku kolik?, proto je to číslovka.",
  my: "Slovo „my“ se skloňuje (my – nás – nám), je tedy ohebné. Zastupuje jména osob, proto je to zájmeno (osobní).",
};

const BANKA_L1B: Polozka[] = L1B.map((p) => ({
  q: `Slovo „${p.word}“ ve větě „${p.veta}“ patří mezi ohebné, nebo neohebné slovní druhy — a který to je?`,
  key: p.correct,
  ds: p.ds,
  h: [
    `Slovo „${p.word}“ vyzkoušej ohnout – změň pád, číslo nebo osobu. Změní se jeho tvar?`,
    "Pokud se slovo dá skloňovat nebo časovat, patří mezi ohebné slovní druhy (podstatné jméno, přídavné jméno, zájmeno, číslovka, sloveso). Pokud tvar zůstává stále stejný, patří mezi neohebné (příslovce, předložka, spojka, částice, citoslovce).",
  ],
  ex: EX_L1B[p.word],
}));

const BANKA_L1: Polozka[] = [...BANKA_L1A, ...BANKA_L1B];

// ── L2 (a) — právě jedno příslovce ve větě se stejnokořenným přídavným jménem
/** Podstatné jméno z věty + ukázka jeho skloňování (pro feedback distraktoru). */
type Jmeno = { w: string; tvary: string };
const L2A: { veta: string; adv: string; adj: string; podst1: Jmeno; podst2: Jmeno }[] = [
  { veta: "Rychlý vlak jel rychle kolem lesa.", adv: "rychle", adj: "rychlý", podst1: { w: "vlak", tvary: "vlak – vlaku – vlakem" }, podst2: { w: "lesa", tvary: "les – lesa – lese" } },
  { veta: "Hezká dívka zpívala hezky svou oblíbenou písničku.", adv: "hezky", adj: "hezká", podst1: { w: "dívka", tvary: "dívka – dívky – dívce" }, podst2: { w: "písničku", tvary: "písnička – písničky – písničku" } },
  { veta: "Silný muž silně zatlačil do dveří.", adv: "silně", adj: "silný", podst1: { w: "muž", tvary: "muž – muže – mužovi" }, podst2: { w: "dveří", tvary: "dveře – dveří – dveřím" } },
  { veta: "Tichý chlapec mluvil potichu se svým kamarádem.", adv: "potichu", adj: "tichý", podst1: { w: "chlapec", tvary: "chlapec – chlapce – chlapci" }, podst2: { w: "kamarádem", tvary: "kamarád – kamaráda – kamarádem" } },
  { veta: "Snadný příklad spočítala sestra snadno z hlavy.", adv: "snadno", adj: "snadný", podst1: { w: "příklad", tvary: "příklad – příkladu – příkladem" }, podst2: { w: "sestra", tvary: "sestra – sestry – sestře" } },
  { veta: "Veselá kapela hrála vesele na oslavě.", adv: "vesele", adj: "veselá", podst1: { w: "kapela", tvary: "kapela – kapely – kapele" }, podst2: { w: "oslavě", tvary: "oslava – oslavy – oslavě" } },
  { veta: "Krásná zahrada vypadala po dešti krásně.", adv: "krásně", adj: "krásná", podst1: { w: "zahrada", tvary: "zahrada – zahrady – zahradě" }, podst2: { w: "dešti", tvary: "déšť – deště – dešti" } },
  { veta: "Pomalý šnek lezl pomalu po listu.", adv: "pomalu", adj: "pomalý", podst1: { w: "šnek", tvary: "šnek – šneka – šnekovi" }, podst2: { w: "listu", tvary: "list – listu – listem" } },
];

const BANKA_L2A: Polozka[] = L2A.map((p) => ({
  q: `Ve větě „${p.veta}“ je právě jedno příslovce. Které slovo to je?`,
  key: p.adv,
  ds: [
    [p.adj, `Slovo „${p.adj}“ odpovídá na otázku jaký? a skloňuje se podle rodu, čísla a pádu – je to přídavné jméno, ne příslovce.`],
    ...[p.podst1, p.podst2].map((j) => [
      j.w,
      `Slovo „${j.w}“ je podstatné jméno (kdo? co?) a skloňuje se: ${j.tvary} – není to příslovce.`,
    ] as [string, string]),
  ],
  h: [
    "Najdi ve větě slovo, které odpovídá na otázku jak?, a slovo, které odpovídá na otázku jaký? Nejde o stejné slovo.",
    "Přídavné jméno (jaký?) se skloňuje a mění tvar podle rodu, čísla a pádu. Příslovce (jak?) se neskloňuje ani nečasuje – hledej právě takové slovo.",
  ],
  ex: `Slovo „${p.adv}“ odpovídá na otázku jak? a neskloňuje se – je to příslovce. Slovo „${p.adj}“ je přídavné jméno stejného kořene, ale skloňuje se.`,
}));

// ── L2 (b) — které slovo z věty se DÁ ohýbat (číslovka/zájmeno mezi neohebnými)
/** Distraktory = neohebná slova; ke každému jeho konkrétní slovní druh. */
const L2B: { veta: string; correct: string; distraktory: [string, string][] }[] = [
  { veta: "Přišlo nás pět, ale hned jsme odešli domů.", correct: "pět", distraktory: [["ale", "spojka"], ["hned", "příslovce"], ["domů", "příslovce"]] },
  { veta: "Venku bylo ticho, jenom my jsme ještě nespali.", correct: "my", distraktory: [["venku", "příslovce"], ["jenom", "částice"], ["ještě", "příslovce"]] },
  { veta: "Sotva dorazili, hned uviděli sto holubů na návsi.", correct: "sto", distraktory: [["sotva", "spojka"], ["hned", "příslovce"], ["na", "předložka"]] },
  { veta: "Copak už zase přišel jenom on?", correct: "on", distraktory: [["copak", "částice"], ["už", "příslovce"], ["jenom", "částice"]] },
  { veta: "Kdesi vzadu čekalo trpělivě sedm dětí.", correct: "sedm", distraktory: [["kdesi", "příslovce"], ["vzadu", "příslovce"], ["trpělivě", "příslovce"]] },
  { veta: "Kolem bylo ticho, jenom ono tiše spalo v kolébce.", correct: "ono", distraktory: [["kolem", "příslovce"], ["jenom", "částice"], ["tiše", "příslovce"]] },
];

const OHNUTI: Record<string, string> = {
  pět: "pěti", my: "nás", sto: "sta", on: "jeho", sedm: "sedmi", ono: "jeho",
};

const BANKA_L2B: Polozka[] = L2B.map((p) => ({
  q: `Které slovo z věty „${p.veta}“ se DÁ ohýbat?`,
  key: p.correct,
  ds: p.distraktory.map(([slovo, druh]) => [
    slovo,
    `Slovo „${slovo}“ je ${druh} – neohebný slovní druh. Neskloňuje se ani nečasuje.`,
  ] as [string, string]),
  h: [
    "Z nabízených čtyř slov jsou tři neohebná a jedno ohebné. Zkus každé z nich ohnout – změnit pád nebo osobu.",
    "Neohebná slova (příslovce, předložky, spojky, částice, citoslovce) se neskloňují ani nečasují. Ohebné slovo je tu číslovka nebo zájmeno, i když to na první pohled nevypadá.",
  ],
  ex: `Slovo „${p.correct}“ se dá ohnout: ${p.correct} → ${OHNUTI[p.correct]}. Ostatní nabízená slova jsou neohebná: ${p.distraktory.map(([s, d]) => `${s} (${d})`).join(", ")}.`,
}));

// ── L2 (c) — kterým ohnutím dokážeš, že slovo je ohebné
const L2C: { word: string; correct: string; distraktory: string[] }[] = [
  { word: "dům", correct: "domu", distraktory: ["domácí", "doma", "domov"] },
  { word: "žák", correct: "žáka", distraktory: ["žákovský", "žákyně", "žáček"] },
  { word: "kniha", correct: "knihy", distraktory: ["knihovna", "knižní", "knížka"] },
  { word: "hrad", correct: "hradu", distraktory: ["hradní", "hrádek", "hradba"] },
  { word: "rychlý", correct: "rychlého", distraktory: ["rychleji", "rychlost", "rychlík"] },
  { word: "kočka", correct: "kočky", distraktory: ["kočičí", "kočička", "kočkovití"] },
  { word: "silný", correct: "silného", distraktory: ["silněji", "síla", "silák"] },
];

const DUVOD_JINY: Record<string, string> = {
  domácí: "odvozené přídavné jméno",
  doma: "jiné slovo (příslovce) stejného kořene",
  domov: "jiné slovo stejného kořene",
  žákovský: "odvozené přídavné jméno",
  žákyně: "jiné slovo (ženský rod)",
  žáček: "jiné slovo (zdrobnělina)",
  knihovna: "jiné odvozené slovo",
  knižní: "odvozené přídavné jméno",
  knížka: "jiné slovo (zdrobnělina)",
  hradní: "odvozené přídavné jméno",
  hrádek: "jiné slovo (zdrobnělina)",
  hradba: "jiné slovo stejného kořene",
  rychleji: "stupňovaný tvar příslovce rychle",
  rychlost: "odvozené podstatné jméno",
  rychlík: "jiné odvozené slovo",
  kočičí: "odvozené přídavné jméno",
  kočička: "jiné slovo (zdrobnělina)",
  kočkovití: "jiné odvozené slovo",
  silněji: "stupňovaný tvar příslovce silně",
  síla: "jiné slovo stejného kořene (podstatné jméno)",
  silák: "jiné odvozené podstatné jméno",
};

const BANKA_L2C: Polozka[] = L2C.map((p) => {
  const maStupen = p.distraktory.some((t) => DUVOD_JINY[t].startsWith("stupňovaný"));
  return {
    q: `Kterým ohnutím dokážeš, že slovo „${p.word}“ je ohebné?`,
    key: p.correct,
    ds: p.distraktory.map((tvar) => [
      tvar,
      `„${tvar}“ je ${DUVOD_JINY[tvar]}, ne tvar slova „${p.word}“ v jiném pádu.`,
    ] as [string, string]),
    h: [
      `Ohebnost dokážeš tak, že slovo „${p.word}“ dáš do jiného pádu, čísla nebo osoby.`,
      maStupen
        ? `Hledej tvar STEJNÉHO slova „${p.word}“ v jiném pádu, ne jiné slovo se stejným základem a ne stupňovaný tvar příslovce.`
        : `Hledej tvar STEJNÉHO slova „${p.word}“ v jiném pádu, ne jiné slovo se stejným základem (odvozené slovo nebo zdrobnělinu).`,
    ] as [string, string],
    ex: maStupen
      ? `Slovo „${p.word}“ je ohebné, protože se skloňuje – jeden z jeho tvarů je „${p.correct}“. Ostatní možnosti jsou jiná slova stejného kořene nebo stupňovaný tvar příslovce, ne pád slova „${p.word}“.`
      : `Slovo „${p.word}“ je ohebné, protože se skloňuje – jeden z jeho tvarů je „${p.correct}“. Ostatní možnosti jsou jiná slova stejného kořene, ne pád slova „${p.word}“.`,
  };
});

const BANKA_L2: Polozka[] = [...BANKA_L2A, ...BANKA_L2B, ...BANKA_L2C];

// ── L3 (a) — inverze: předložka × příslovce podle věty ─────────────────────
const BANKA_L3A: Polozka[] = [
  {
    q: "Ve které větě je slovo „kolem“ předložkou?",
    key: "Postavil plot kolem zahrady.",
    ds: [
      ["Auto jenom projelo kolem.", "Tady stojí „kolem“ samo, nic za ním nenásleduje – je to příslovce, ne předložka."],
      ["Podívej se kolem, nikde nikdo není.", "Tady „kolem“ nestojí před žádným podstatným jménem ani zájmenem – je to příslovce."],
      ["Ohlédl se kolem a nikoho neviděl.", "Tady „kolem“ nestojí před jménem, jen popisuje pohled do okolí – je to příslovce."],
    ],
    h: [
      "Podívej se, jestli po slově „kolem“ ve větě následuje podstatné jméno nebo zájmeno.",
      "Když po slově „kolem“ následuje jméno v pádu (koho? čeho?), je to předložka. Když stojí samo, je to příslovce.",
    ],
    ex: "V předložkové větě stojí „kolem“ před jménem a určuje jeho pád (kolem zahrady = 2. pád). V ostatních větách stojí „kolem“ samo – je to příslovce.",
  },
  {
    q: "Ve které větě je slovo „kolem“ příslovcem?",
    key: "Auto jenom projelo kolem.",
    ds: [
      ["Postavil plot kolem zahrady.", "Tady „kolem“ stojí před podstatným jménem „zahrady“ a určuje jeho pád – je to předložka."],
      ["Chodil kolem rybníka.", "Tady „kolem“ stojí před podstatným jménem „rybníka“ a určuje jeho pád – je to předložka."],
      ["Otočil se kolem stromu.", "Tady „kolem“ stojí před podstatným jménem „stromu“ a určuje jeho pád – je to předložka."],
    ],
    h: [
      "Podívej se, jestli po slově „kolem“ ve větě následuje podstatné jméno nebo zájmeno.",
      "Když po slově „kolem“ následuje jméno v pádu (koho? čeho?), je to předložka. Když stojí samo, je to příslovce.",
    ],
    ex: "Ve větě „Auto jenom projelo kolem.“ stojí „kolem“ samo, žádné jméno za ním nenásleduje – je to příslovce. V ostatních větách stojí před jménem – je to předložka.",
  },
  {
    q: "Ve které větě je slovo „vedle“ předložkou?",
    key: "Sedla si vedle kamarádky.",
    ds: [
      ["Bydlí hned vedle.", "Tady „vedle“ stojí samo, žádné jméno za ním nenásleduje – je to příslovce."],
      ["Postavil se vedle a mlčel.", "Tady „vedle“ nestojí před žádným jménem – je to příslovce."],
      ["Naše zahrada je hned vedle.", "Tady „vedle“ stojí na konci věty samo – je to příslovce."],
    ],
    h: [
      "Podívej se, jestli po slově „vedle“ ve větě následuje podstatné jméno nebo zájmeno.",
      "Když po slově „vedle“ následuje jméno v pádu (koho? čeho?), je to předložka. Když stojí samo, je to příslovce.",
    ],
    ex: "V předložkové větě stojí „vedle“ před jménem a určuje jeho pád (vedle kamarádky = 2. pád). V ostatních větách stojí „vedle“ samo – je to příslovce.",
  },
  {
    q: "Ve které větě je slovo „vedle“ příslovcem?",
    key: "Bydlí hned vedle.",
    ds: [
      ["Sedla si vedle kamarádky.", "Tady „vedle“ stojí před jménem „kamarádky“ a určuje jeho pád – je to předložka."],
      ["Postavil dům vedle lesa.", "Tady „vedle“ stojí před jménem „lesa“ a určuje jeho pád – je to předložka."],
      ["Zaparkoval vedle garáže.", "Tady „vedle“ stojí před jménem „garáže“ a určuje jeho pád – je to předložka."],
    ],
    h: [
      "Podívej se, jestli po slově „vedle“ ve větě následuje podstatné jméno nebo zájmeno.",
      "Když po slově „vedle“ následuje jméno v pádu (koho? čeho?), je to předložka. Když stojí samo, je to příslovce.",
    ],
    ex: "Ve větě „Bydlí hned vedle.“ stojí „vedle“ samo, žádné jméno za ním nenásleduje – je to příslovce. V ostatních větách stojí před jménem – je to předložka.",
  },
  {
    q: "Ve které větě je slovo „blízko“ předložkou?",
    key: "Bydlí blízko školy.",
    ds: [
      ["Bydlí docela blízko.", "Tady „blízko“ stojí samo na konci věty – je to příslovce."],
      ["Je to blízko, dojdeme pěšky.", "Tady „blízko“ nestojí před žádným jménem – je to příslovce."],
      ["Škola je blízko.", "Tady „blízko“ stojí samo na konci věty – je to příslovce."],
    ],
    h: [
      "Podívej se, jestli po slově „blízko“ ve větě následuje podstatné jméno nebo zájmeno.",
      "Když po slově „blízko“ následuje jméno v pádu (koho? čeho?), je to předložka. Když stojí samo, je to příslovce.",
    ],
    ex: "V předložkové větě stojí „blízko“ před jménem a určuje jeho pád (blízko školy = 2. pád). V ostatních větách stojí „blízko“ samo – je to příslovce.",
  },
  {
    q: "Ve které větě je slovo „blízko“ příslovcem?",
    key: "Škola je blízko.",
    ds: [
      ["Bydlí blízko lesa.", "Tady „blízko“ stojí před jménem „lesa“ a určuje jeho pád – je to předložka."],
      ["Obchod je blízko nádraží.", "Tady „blízko“ stojí před jménem „nádraží“ a určuje jeho pád – je to předložka."],
      ["Zastavili blízko mostu.", "Tady „blízko“ stojí před jménem „mostu“ a určuje jeho pád – je to předložka."],
    ],
    h: [
      "Podívej se, jestli po slově „blízko“ ve větě následuje podstatné jméno nebo zájmeno.",
      "Když po slově „blízko“ následuje jméno v pádu (koho? čeho?), je to předložka. Když stojí samo, je to příslovce.",
    ],
    ex: "Ve větě „Škola je blízko.“ stojí „blízko“ samo, žádné jméno za ním nenásleduje – je to příslovce. V ostatních větách stojí před jménem – je to předložka.",
  },
  {
    q: "Ve které větě je slovo „okolo“ předložkou?",
    key: "Chodil okolo rybníka.",
    ds: [
      ["Okolo bylo plno lidí.", "Tady „okolo“ nestojí před žádným jménem, popisuje celé okolí – je to příslovce."],
      ["Jenom prošel okolo.", "Tady „okolo“ stojí samo na konci věty – je to příslovce."],
      ["Podívej se okolo, je tu krásně.", "Tady „okolo“ nestojí před žádným jménem – je to příslovce."],
    ],
    h: [
      "Podívej se, jestli po slově „okolo“ ve větě následuje podstatné jméno nebo zájmeno.",
      "Když po slově „okolo“ následuje jméno v pádu (koho? čeho?), je to předložka. Když stojí samo, je to příslovce.",
    ],
    ex: "V předložkové větě stojí „okolo“ před jménem a určuje jeho pád (okolo rybníka = 2. pád). V ostatních větách stojí „okolo“ samo nebo bez jména – je to příslovce.",
  },
  {
    q: "Ve které větě je slovo „okolo“ příslovcem?",
    key: "Okolo bylo plno lidí.",
    ds: [
      ["Chodil okolo rybníka.", "Tady „okolo“ stojí před jménem „rybníka“ a určuje jeho pád – je to předložka."],
      ["Postavili plot okolo zahrady.", "Tady „okolo“ stojí před jménem „zahrady“ a určuje jeho pád – je to předložka."],
      ["Rozhlédl se okolo domu.", "Tady „okolo“ stojí před jménem „domu“ a určuje jeho pád – je to předložka."],
    ],
    h: [
      "Podívej se, jestli po slově „okolo“ ve větě následuje podstatné jméno nebo zájmeno.",
      "Když po slově „okolo“ následuje jméno v pádu (koho? čeho?), je to předložka. Když stojí samo, je to příslovce.",
    ],
    ex: "Ve větě „Okolo bylo plno lidí.“ nestojí „okolo“ před žádným jménem – je to příslovce. V ostatních větách stojí před jménem – je to předložka.",
  },
];

// ── L3 (b) — stupňování není ohýbání ───────────────────────────────────────
// Pět různých podob otázky, každá s vlastním klíčem. Možnosti v rámci úlohy
// sdílejí jednu větnou šablonu a mají podobnou délku, aby klíč nešel poznat
// podle vzhledu.
const BANKA_L3B: Polozka[] = [
  {
    q: "Tomáš běžel rychleji než Petr. Proč je slovo „rychleji“ neohebné, i když se stupňuje?",
    key: "Neskloňuje se ani nečasuje, jen se stupňuje.",
    ds: [
      ["Nemá žádný jiný tvar než „rychleji“.", "Má: rychle – rychleji – nejrychleji. Neohebnost neznamená, že slovo nikdy nemění tvar, ale že se neskloňuje ani nečasuje."],
      ["Je to přídavné jméno ve 2. stupni.", "Přídavné jméno by bylo „rychlejší“ (jaký?) a skloňovalo by se. „Rychleji“ odpovídá na otázku jak? – je to příslovce."],
      ["Už se nedá dál stupňovat.", "Dá: rychleji → nejrychleji. A o ohebnosti stejně nerozhoduje stupňování, ale skloňování a časování."],
    ],
    h: [
      "Zkus slovo „rychleji“ dát do jiného pádu nebo osoby. Jde to?",
      "Ohýbání znamená skloňování (pády) nebo časování (osoby). Stupňování (rychle – rychleji) mezi ně nepatří.",
    ],
    ex: "„Rychleji“ je příslovce ve 2. stupni (rychle – rychleji – nejrychleji). Tvar se mění jen stupňováním, pády ani osoby nemá – neskloňuje se ani nečasuje, proto je neohebné.",
  },
  {
    q: "Zpívala dnes hezčeji než včera. Které tvrzení o slově „hezčeji“ je pravdivé?",
    key: "Je to příslovce ve 2. stupni, neohebné.",
    ds: [
      ["Je to ohebné slovo, protože se stupňuje.", "Stupňování není ohýbání. Ohýbat znamená skloňovat nebo časovat, a „hezčeji“ se neskloňuje ani nečasuje."],
      ["Je to přídavné jméno ve 2. stupni.", "Přídavné jméno ve 2. stupni je „hezčí“ (jaká?). „Hezčeji“ určuje sloveso zpívala (jak?) – je to příslovce."],
      ["Je to příslovce v základním tvaru.", "Základní tvar je „hezky“; „hezčeji“ je 2. stupeň (hezky – hezčeji – nejhezčeji)."],
    ],
    h: [
      "Zeptej se ve větě na slovo „hezčeji“: odpovídá na otázku jak?, nebo jaká?",
      "Najdi základní tvar slova a porovnej ho s tvarem ve větě. Pak rozhodni, jestli stupňování je, nebo není ohýbání.",
    ],
    ex: "„Hezčeji“ určuje sloveso zpívala (jak?), je to příslovce ve 2. stupni (hezky – hezčeji). Neskloňuje se ani nečasuje, proto je neohebné – stupňování ohýbáním není.",
  },
  {
    q: "Které slovo z věty „Starší sestra plavala rychleji než já.“ je neohebné? Vybírej z nabízených.",
    key: "rychleji",
    ds: [
      ["starší", "„Starší“ je přídavné jméno ve 2. stupni a skloňuje se: starší – staršího – staršímu. I stupňované slovo může být ohebné."],
      ["sestra", "„Sestra“ je podstatné jméno a skloňuje se: sestra – sestry – sestře."],
      ["plavala", "„Plavala“ je sloveso a časuje se: plavu – plaveš – plavala."],
    ],
    h: [
      "Dvě z nabízených slov jsou stupňované tvary. Stupeň sám o ohebnosti nerozhoduje – zkus každé slovo skloňovat nebo časovat.",
      "Stupňované přídavné jméno se dál skloňuje (jaký? jakého?), stupňované příslovce ne.",
    ],
    ex: "„Rychleji“ je příslovce ve 2. stupni (rychle – rychleji). Stupňuje se, ale neskloňuje ani nečasuje – je neohebné. „Starší“ se také stupňuje, ale skloňuje se (staršího, staršímu) – je ohebné.",
  },
  {
    q: "Které slovo z věty „Nejmladší hráč skákal nejvýš.“ je neohebné? Vybírej z nabízených.",
    key: "nejvýš",
    ds: [
      ["nejmladší", "„Nejmladší“ je přídavné jméno ve 3. stupni a skloňuje se: nejmladší – nejmladšího – nejmladšímu. I stupňované slovo může být ohebné."],
      ["hráč", "„Hráč“ je podstatné jméno a skloňuje se: hráč – hráče – hráči."],
      ["skákal", "„Skákal“ je sloveso a časuje se: skáču – skáčeš – skákal."],
    ],
    h: [
      "Dvě z nabízených slov jsou stupňované tvary. Stupeň sám o ohebnosti nerozhoduje – zkus každé slovo skloňovat nebo časovat.",
      "Stupňované přídavné jméno se dál skloňuje (jaký? jakého?), stupňované příslovce ne.",
    ],
    ex: "„Nejvýš“ je příslovce ve 3. stupni (vysoko – výš – nejvýš). Neskloňuje se ani nečasuje – je neohebné. „Nejmladší“ se také stupňuje, ale skloňuje se (nejmladšího) – je ohebné.",
  },
  {
    q: "Který tvar slova „hezčí“ dokazuje, že je to slovo ohebné?",
    key: "hezčího",
    ds: [
      ["hezčeji", "„Hezčeji“ je jiné slovo – příslovce (hezky – hezčeji). Tvar slova „hezčí“ to není."],
      ["nejhezčí", "„Nejhezčí“ je 3. stupeň. Stupňování ohebnost nedokazuje, důkazem je změna pádu."],
      ["hezky", "„Hezky“ je příslovce stejného kořene, ne tvar slova „hezčí“."],
    ],
    h: [
      "Ohebnost dokazuje skloňování nebo časování, ne stupňování.",
      "Hledej tvar téhož slova v jiném pádu (jakého? jakému?), ne jiný stupeň ani příbuzné příslovce.",
    ],
    ex: "Ohebnost dokazuje skloňování: hezčí – hezčího – hezčímu (změna pádu). Jiný stupeň (nejhezčí) ani příbuzná příslovce (hezky, hezčeji) ohebnost nedokazují.",
  },
  {
    q: "Který tvar slova „lepší“ dokazuje, že je to slovo ohebné?",
    key: "lepšímu",
    ds: [
      ["lépe", "„Lépe“ je jiné slovo – příslovce (dobře – lépe). Tvar slova „lepší“ to není."],
      ["nejlepší", "„Nejlepší“ je 3. stupeň. Stupňování ohebnost nedokazuje, důkazem je změna pádu."],
      ["dobře", "„Dobře“ je příslovce, ne tvar slova „lepší“."],
    ],
    h: [
      "Ohebnost dokazuje skloňování nebo časování, ne stupňování.",
      "Hledej tvar téhož slova v jiném pádu (jakého? jakému?), ne jiný stupeň ani příbuzné příslovce.",
    ],
    ex: "Ohebnost dokazuje skloňování: lepší – lepšího – lepšímu (změna pádu). Jiný stupeň (nejlepší) ani příslovce (dobře, lépe) ohebnost nedokazují.",
  },
  {
    q: "Dnes to zvládl lépe než minule. Které tvrzení o slově „lépe“ je pravdivé?",
    key: "Je to 2. stupeň příslovce dobře.",
    ds: [
      ["Je to 2. stupeň přídavného jména dobrý.", "2. stupeň přídavného jména dobrý je „lepší“ (jaký?). „Lépe“ určuje sloveso zvládl (jak?) – je to příslovce."],
      ["Je to ohebné slovo, protože mění tvar.", "Mění tvar jen stupňováním (dobře – lépe – nejlépe). Neskloňuje se ani nečasuje, proto je neohebné."],
      ["Je to základní tvar příslovce.", "Základní tvar je „dobře“; „lépe“ je 2. stupeň (dobře – lépe – nejlépe)."],
    ],
    h: [
      "Zeptej se ve větě na slovo „lépe“: odpovídá na otázku jak?, nebo jaký?",
      "Zkus najít základní tvar: jak zvládl? – ______, lépe, nejlépe. Pozor, u tohoto slova se základ při stupňování mění.",
    ],
    ex: "„Lépe“ určuje sloveso zvládl (jak?), je to příslovce ve 2. stupni: dobře – lépe – nejlépe. Mění se jen stupňováním, neskloňuje se ani nečasuje – je neohebné.",
  },
  {
    q: "Mluvil dnes hlasitěji než obvykle. Jak vznikl tvar „hlasitěji“ a co z toho plyne?",
    key: "Stupňováním – slovo tedy zůstává neohebné.",
    ds: [
      ["Skloňováním – slovo je tedy ohebné.", "Skloňováním se mění pád a číslo jména. „Hlasitěji“ žádný pád nemá – vzniklo stupňováním (hlasitě – hlasitěji)."],
      ["Časováním – slovo je tedy ohebné.", "Časováním se mění osoba a čas slovesa. „Hlasitěji“ není sloveso – vzniklo stupňováním (hlasitě – hlasitěji)."],
      ["Stupňováním – slovo je tedy ohebné.", "Tvar opravdu vznikl stupňováním, ale stupňování není ohýbání. Slovo se neskloňuje ani nečasuje, proto je neohebné."],
    ],
    h: [
      "Najdi základní tvar slova (jak mluvil?) a porovnej ho s tvarem ve větě. Čím se liší?",
      "Pád mají jména, osobu mají slovesa. Když tvar nevznikl změnou pádu ani osoby, nejde o ohýbání.",
    ],
    ex: "„Hlasitěji“ vzniklo stupňováním příslovce hlasitě (hlasitě – hlasitěji – nejhlasitěji). Stupňování není ohýbání: slovo se neskloňuje ani nečasuje, proto zůstává neohebné.",
  },
  {
    q: "Ze všech dětí běžel nejrychleji. Které tvrzení o slově „nejrychleji“ je pravdivé?",
    key: "Je to 3. stupeň příslovce rychle.",
    ds: [
      ["Je to 3. stupeň přídavného jména rychlý.", "3. stupeň přídavného jména je „nejrychlejší“ (jaký?). „Nejrychleji“ určuje sloveso běžel (jak?) – je to příslovce."],
      ["Je to 2. stupeň příslovce rychle.", "2. stupeň je „rychleji“. Předpona nej- označuje 3. stupeň."],
      ["Je to ohebné slovo ve 3. stupni.", "Stupňování není ohýbání. „Nejrychleji“ se neskloňuje ani nečasuje, proto je neohebné."],
    ],
    h: [
      "Zeptej se ve větě na slovo „nejrychleji“: odpovídá na otázku jak?, nebo jaký?",
      "Seřaď stupně: rychle – ? – ?. Podle začátku slova poznáš, o který stupeň jde.",
    ],
    ex: "„Nejrychleji“ určuje sloveso běžel (jak?), je to 3. stupeň příslovce: rychle – rychleji – nejrychleji. Neskloňuje se ani nečasuje, proto je neohebné.",
  },
];

// ── L3 (c) — celovětná analýza ──────────────────────────────────────────────
// „Všechna slova ohebná“: čtyři různé věty podobné délky; klíč není jádrem
// distraktorů. Klíč obsahuje ohebnou past (zájmeno ho/mu, číslovka pět/dva),
// distraktory neohebnou past (domů vypadá jako tvar slova dům).
const H_VSECHNA: [string, string] = [
  "Projdi postupně všechna slova v každé nabízené větě a u každého zkus, jestli se dá skloňovat nebo časovat.",
  "Pozor na krátká slova: zájmena a číslovky se ohýbají (já – mě, šest – šesti), i když to tak nevypadá. Naopak některá příslovce vypadají jako tvar jména, a přesto se nemění.",
];
const BANKA_L3C: Polozka[] = [
  {
    q: "Ve které větě jsou VŠECHNA slova ohebná?",
    key: "Pět kluků ho hledalo.",
    ds: [
      ["Pět kluků šlo domů.", "Slovo „domů“ vypadá jako tvar slova dům, ale odpovídá na otázku kam? a nemění se – je to příslovce, tedy neohebné."],
      ["Kluci ho hledali dlouho.", "Slovo „dlouho“ odpovídá na otázku jak dlouho? a nemění se – je to příslovce, tedy neohebné."],
      ["Kluci hledali psa v lese.", "Slovo „v“ stojí před jménem a určuje jeho pád – je to předložka, tedy neohebné."],
    ],
    h: H_VSECHNA,
    ex: "Ve větě „Pět kluků ho hledalo.“ se ohýbá každé slovo: pět (číslovka: pěti), kluků (podstatné jméno: kluk), ho (zájmeno: on – jeho – ho), hledalo (sloveso: hledám). Ostatní věty obsahují neohebné slovo.",
  },
  {
    q: "Ve které větě jsou VŠECHNA slova ohebná?",
    key: "Babička mu upekla dva koláče.",
    ds: [
      ["Babička včera upekla dva koláče.", "Slovo „včera“ odpovídá na otázku kdy? a nemění se – je to příslovce, tedy neohebné."],
      ["Babička upekla koláče na oslavu.", "Slovo „na“ stojí před jménem a určuje jeho pád – je to předložka, tedy neohebné."],
      ["Babička upekla koláč a buchty.", "Slovo „a“ spojuje dvě slova – je to spojka, tedy neohebné."],
    ],
    h: H_VSECHNA,
    ex: "Ve větě „Babička mu upekla dva koláče.“ se ohýbá každé slovo: babička (podstatné jméno), mu (zájmeno: on – jemu – mu), upekla (sloveso), dva (číslovka: dvou), koláče (podstatné jméno). Ostatní věty obsahují neohebné slovo.",
  },
  {
    q: "Ve které větě jsou VŠECHNA slova ohebná?",
    key: "Sousedův pes honil tři malé kočky.",
    ds: [
      ["Sousedův pes často honil kočky.", "Slovo „často“ odpovídá na otázku jak často? a nemění se – je to příslovce, tedy neohebné."],
      ["Sousedův pes honil kočky po dvoře.", "Slovo „po“ stojí před jménem a určuje jeho pád – je to předložka, tedy neohebné."],
      ["Sousedův pes honil kočku nebo myš.", "Slovo „nebo“ spojuje dvě slova – je to spojka, tedy neohebné."],
    ],
    h: H_VSECHNA,
    ex: "Ve větě „Sousedův pes honil tři malé kočky.“ se ohýbá každé slovo: sousedův a malé (přídavná jména), pes a kočky (podstatná jména), honil (sloveso), tři (číslovka: tří). Ostatní věty obsahují neohebné slovo.",
  },
  {
    q: "Ve které větě jsou VŠECHNA slova ohebná?",
    key: "Dva noví spolužáci mu pomohli.",
    ds: [
      ["Noví spolužáci mu hned pomohli.", "Slovo „hned“ odpovídá na otázku kdy? a nemění se – je to příslovce, tedy neohebné."],
      ["Dva spolužáci mu pomohli s úkolem.", "Slovo „s“ stojí před jménem a určuje jeho pád – je to předložka, tedy neohebné."],
      ["Spolužáci pomohli jenom jemu.", "Slovo „jenom“ zdůrazňuje následující slovo a nemění se – je to částice, tedy neohebné."],
    ],
    h: H_VSECHNA,
    ex: "Ve větě „Dva noví spolužáci mu pomohli.“ se ohýbá každé slovo: dva (číslovka: dvou), noví (přídavné jméno), spolužáci (podstatné jméno), mu (zájmeno: on – jemu – mu), pomohli (sloveso). Ostatní věty obsahují neohebné slovo.",
  },
  {
    q: "Ve které větě jsou všechna slova ohebná kromě jednoho předložkového?",
    key: "Sešit leží na lavici.",
    ds: [
      ["Sešit rychle spadl.", "Tady je jediné neohebné slovo „rychle“, ale je to příslovce, ne předložka."],
      ["Sešit spadl, protože foukal vítr.", "Tady je jediné neohebné slovo „protože“, ale je to spojka, ne předložka."],
      ["Bum, sešit spadl!", "Tady je jediné neohebné slovo „bum“, ale je to citoslovce, ne předložka."],
    ],
    h: [
      "Projdi postupně všechna slova v každé nabízené větě a u každého rozhodni, jestli se dá ohnout.",
      "Nejdřív najdi to jediné neohebné slovo v každé větě, pak rozhodni, jestli stojí před jménem a určuje jeho pád (pak je to předložka), nebo ne.",
    ],
    ex: "Ve větě „Sešit leží na lavici.“ je jediné neohebné slovo „na“ – stojí před jménem „lavici“ a určuje jeho pád, je to předložka. V ostatních větách je jediné neohebné slovo jiného druhu.",
  },
  {
    q: "Ve které větě jsou všechna slova ohebná kromě jednoho předložkového?",
    key: "Pes spí pod stromem.",
    ds: [
      ["Pes spí venku.", "Tady je jediné neohebné slovo „venku“, ale je to příslovce, ne předložka."],
      ["Pes spí, protože je unavený.", "Tady je jediné neohebné slovo „protože“, ale je to spojka, ne předložka."],
      ["Haf, pes spí!", "Tady je jediné neohebné slovo „haf“, ale je to citoslovce, ne předložka."],
    ],
    h: [
      "Projdi postupně všechna slova v každé nabízené větě a u každého rozhodni, jestli se dá ohnout.",
      "Nejdřív najdi to jediné neohebné slovo v každé větě, pak rozhodni, jestli stojí před jménem a určuje jeho pád (pak je to předložka), nebo ne.",
    ],
    ex: "Ve větě „Pes spí pod stromem.“ je jediné neohebné slovo „pod“ – stojí před jménem „stromem“ a určuje jeho pád, je to předložka. V ostatních větách je jediné neohebné slovo jiného druhu.",
  },
];

// ── L3 (d) — příslovce × podstatné jméno: TENTÝŽ tvar, rozhoduje věta ──────
// Ve všech čtyřech větách stojí stejný tvar (večer/ráno/odpoledne), takže klíč
// nejde najít hledáním řetězce. Podstatné jméno poznáš podle přívlastku
// (páteční večer, to ráno), předložky (na večer) nebo shody se slovesem
// (večer byl); příslovce odpovídá na otázku kdy? a určuje sloveso.
const H_CAS = (w: string): [string, string] => [
  `Zeptej se u slova „${w}“: odpovídá na otázku kdy?, nebo je to věc, o které se ve větě něco říká?`,
  "Když ke slovu jde přidat přídavné jméno (jaký?) nebo už ho má, stojí po předložce či se s ním shoduje sloveso, je to podstatné jméno. Když jen říká, kdy se děj stal, je to příslovce.",
];
const BANKA_L3D: Polozka[] = [
  {
    q: "Ve které větě je slovo „večer“ příslovcem?",
    key: "Večer půjdeme do kina.",
    ds: [
      ["Večer byl teplý a klidný.", "Tady je „večer“ podmět (co bylo teplé?) a shoduje se s ním sloveso byl. Skloňuje se (večer – večera) – je to podstatné jméno."],
      ["Ten večer jsme dlouho zpívali.", "Tady má „večer“ u sebe zájmeno ten a skloňuje se (ten večer – toho večera) – je to podstatné jméno."],
      ["Těšíme se na páteční večer.", "Tady stojí „večer“ po předložce na a má přívlastek páteční (jaký večer?) – je to podstatné jméno ve 4. pádě."],
    ],
    h: H_CAS("večer"),
    ex: "Ve větě „Večer půjdeme do kina.“ slovo „večer“ jen říká, kdy půjdeme (kdy? – večer), a určuje sloveso – je to příslovce. V ostatních větách je to podstatné jméno: má přívlastek, stojí po předložce nebo se s ním shoduje sloveso.",
  },
  {
    q: "Ve které větě je slovo „večer“ podstatným jménem?",
    key: "Večer byl tichý a hvězdný.",
    ds: [
      ["Večer si čteme knížky.", "Tady „večer“ říká, kdy si čteme (kdy? – večer), a určuje sloveso – je to příslovce."],
      ["Včera večer přišla teta.", "Tady „večer“ spolu se slovem včera říká, kdy teta přišla – je to příslovce."],
      ["Večer se vrátíme domů.", "Tady „večer“ říká, kdy se vrátíme (kdy? – večer) – je to příslovce."],
    ],
    h: H_CAS("večer"),
    ex: "Ve větě „Večer byl tichý a hvězdný.“ je „večer“ podmět – o večeru se říká, jaký byl, a shoduje se s ním sloveso byl. Skloňuje se (večer – večera), je to podstatné jméno. V ostatních větách říká jen kdy – je to příslovce.",
  },
  {
    q: "Ve které větě je slovo „ráno“ podstatným jménem?",
    key: "Ráno bylo mlhavé a chladné.",
    ds: [
      ["Ráno vstávám v šest hodin.", "Tady „ráno“ říká, kdy vstávám (kdy? – ráno), a určuje sloveso – je to příslovce."],
      ["Zítra ráno odjíždíme.", "Tady „ráno“ spolu se slovem zítra říká, kdy odjíždíme – je to příslovce."],
      ["Ráno jsem snídal rohlík.", "Tady „ráno“ říká, kdy jsem snídal (kdy? – ráno) – je to příslovce."],
    ],
    h: H_CAS("ráno"),
    ex: "Ve větě „Ráno bylo mlhavé a chladné.“ je „ráno“ podmět – říká se o něm, jaké bylo, a shoduje se s ním sloveso bylo. Skloňuje se (ráno – rána), je to podstatné jméno. V ostatních větách říká jen kdy – je to příslovce.",
  },
  {
    q: "Ve které větě je slovo „odpoledne“ příslovcem?",
    key: "Odpoledne půjdeme plavat.",
    ds: [
      ["Celé odpoledne pršelo.", "Tady má „odpoledne“ přívlastek celé (jaké odpoledne?) a skloňuje se (odpoledne – odpoledni) – je to podstatné jméno."],
      ["Odpoledne bylo horké.", "Tady je „odpoledne“ podmět (co bylo horké?) a shoduje se s ním sloveso bylo – je to podstatné jméno."],
      ["Těšíme se na sobotní odpoledne.", "Tady stojí „odpoledne“ po předložce na a má přívlastek sobotní – je to podstatné jméno ve 4. pádě."],
    ],
    h: H_CAS("odpoledne"),
    ex: "Ve větě „Odpoledne půjdeme plavat.“ slovo „odpoledne“ jen říká, kdy půjdeme (kdy? – odpoledne) – je to příslovce. V ostatních větách je to podstatné jméno: má přívlastek, stojí po předložce nebo se s ním shoduje sloveso.",
  },
];

const BANKA_L3: Polozka[] = [...BANKA_L3A, ...BANKA_L3B, ...BANKA_L3C, ...BANKA_L3D];

// ── Generátor ────────────────────────────────────────────────────────────
function genL1(): PracticeTask | null {
  return uloha(pick(BANKA_L1));
}
function genL2(): PracticeTask | null {
  return uloha(pick(BANKA_L2));
}
function genL3(): PracticeTask | null {
  return uloha(pick(BANKA_L3));
}

function gen(level: number): PracticeTask[] {
  const genLx = level === 1 ? genL1 : level === 2 ? genL2 : genL3;
  return ruzneUlohy(() => losUlohy(genLx));
}

// ── Topic ────────────────────────────────────────────────────────────────
export const OPAKOVANI_SLOVNICH_DRUHU_OHEBNE_NEOHEBNE: TopicMetadata[] = [
  {
    id: "g6-cjl-opakovani-slovnich-druhu-ohebne-neohebne-6",
    rvpNodeId: "g6-cjl-jazykova-vychova-tvaroslovi-opakovani-slovnich-druhu-ohebne-neohebne",
    title: "Opakování slovních druhů - ohebné, neohebné",
    displayName: "Ohebná a neohebná slova",
    studentTitle: "Ohebná a neohebná slova",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Tvarosloví",
    briefDescription: "Poznáš, které slovo se ohýbá, i když záleží na větě.",
    keywords: [
      "ohebné", "neohebné", "slovní druhy", "příslovce", "předložka", "spojka",
      "částice", "citoslovce", "podstatné jméno", "přídavné jméno", "zájmeno",
      "číslovka", "sloveso", "stupňování",
    ],
    goals: [
      "Rozlišit ohebné a neohebné slovní druhy tak, že slovo zkusí ohnout.",
      "Rozhodnout o slovním druhu podle věty (předložka × příslovce, příslovce × přídavné jméno).",
      "Odlišit stupňování od ohýbání u příslovcí.",
    ],
    boundaries: [
      "Sporné případy (pětka/dvojka/stovka, jen/i/také, „to“ jako částice, mnoho/málo, zpodstatnělá přídavná jména) se v úlohách jako klíč neobjevují.",
      "Jen věty se slovy v jednoznačném kontextu.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Ohebná slova (podstatné jméno, přídavné jméno, zájmeno, číslovka, sloveso) se dají skloňovat nebo časovat. Neohebná slova (příslovce, předložka, spojka, částice, citoslovce) se neskloňují ani nečasují. Některá příslovce se sice stupňují, ale stupňování není ohýbání.",
      steps: [
        "Zkus slovo ohnout – změň pád, číslo nebo osobu.",
        "Pokud se tvar změní, je slovo ohebné. Pokud ne, je neohebné.",
        "U předložky × příslovce se dívej, jestli po slově následuje jméno v pádu.",
        "Pamatuj: stupňování (rychleji, nejrychleji) není ohýbání.",
      ],
      commonMistake: "Považovat stupňovaný tvar příslovce za ohebný, nebo rozhodovat o předložce a příslovci jen podle slova samotného, ne podle věty.",
      example: "„Auto jelo rychle.“ – rychle je příslovce (neohebné, i když se stupňuje: rychleji). „Šel kolem domu.“ – kolem je předložka (stojí před jménem „domu“). „Auto projelo kolem.“ – kolem je příslovce (stojí samo).",
    },
  },
];
