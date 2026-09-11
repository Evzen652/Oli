import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// vysvětlení a zpětné vazby. Teď: L1 planety, Slunce, Měsíc, první lidé ve
// vesmíru · L2 kamenné a plynné planety, komety, meteory, souhvězdí
// · L3 proč to tak je (atmosféra, zatmění, přitažlivost, vzdálenost).

const L1: PracticeTask[] = [
  choice("Která planeta je nejblíž Slunci?", "Merkur", [
    { value: "Venuše", why: "Venuše je druhá od Slunce." },
    { value: "Mars", why: "Mars je čtvrtý, až za Zemí." },
    { value: "Neptun", why: "Neptun je naopak nejdál." },
  ], {
    hints: ["Je to nejmenší planeta Sluneční soustavy.", "Tato planeta oběhne Slunce za pouhých 88 dní, protože je mu nejblíž."],
    explanation: "Nejblíž Slunci obíhá Merkur.",
  }),
  choice("Která planeta je největší?", "Jupiter", [
    { value: "Saturn", why: "Saturn je druhý největší." },
    { value: "Země", why: "Země je největší jen z kamenných planet." },
    { value: "Neptun", why: "Neptun je obr, ale menší." },
  ], {
    hints: ["Je to plynný obr s Velkou rudou skvrnou.", "Tato planeta je pátá od Slunce a vešlo by se do ní přes tisíc Zemí."],
    explanation: "Největší planetou je Jupiter.",
  }),
  choice("Co je Slunce?", "hvězda", [
    { value: "planeta", why: "Planety obíhají kolem hvězdy; Slunce je ta hvězda." },
    { value: "měsíc", why: "Měsíce obíhají kolem planet." },
    { value: "kometa", why: "Kometa je malé těleso z ledu a prachu." },
  ], {
    hints: ["Svítí Slunce vlastním světlem?", "Tělesa, která sama svítí a hřejí, jsou hvězdy — a Slunce je nám nejbližší z nich."],
    explanation: "Slunce je hvězda — obrovská žhavá koule plynů, která sama svítí.",
  }),
  choice("Co je Měsíc?", "přirozená družice Země", [
    { value: "malá hvězda na noční obloze", why: "Měsíc sám nesvítí." },
    { value: "planeta obíhající Slunce", why: "Měsíc neobíhá Slunce samostatně, ale kolem Země." },
    { value: "kometa s ohonem", why: "Kometa je z ledu a prachu a má ohon." },
  ], {
    hints: ["Kolem čeho Měsíc obíhá?", "Těleso, které přirozeně obíhá kolem planety, se jmenuje družice neboli měsíc."],
    explanation: "Měsíc je přirozená družice Země — obíhá kolem ní.",
  }),
  choice("Kolik planet má Sluneční soustava?", "osm", [
    { value: "devět", why: "Devět jich bylo, dokud se Pluto nepřeřadilo mezi trpasličí planety (2006)." },
    { value: "sedm", why: "Planet je o jednu víc." },
    { value: "deset", why: "Tolik planet Sluneční soustava nemá." },
  ], {
    hints: ["Vyjmenuj je: Merkur, Venuše, Země, Mars…", "Za Marsem jsou ještě Jupiter, Saturn, Uran a Neptun. Spočítej je všechny."],
    explanation: "Sluneční soustava má osm planet; Pluto je od roku 2006 trpasličí planeta.",
  }),
  choice("Která planeta má nejnápadnější prstence?", "Saturn", [
    { value: "Mars", why: "Mars prstence nemá." },
    { value: "Merkur", why: "Merkur prstence nemá." },
    { value: "Venuše", why: "Venuše prstence nemá." },
  ], {
    hints: ["Je to plynný obr, druhý největší.", "Tato planeta je šestá od Slunce; její prstence z ledu a kamení jsou vidět i malým dalekohledem."],
    explanation: "Saturn má nejnápadnější prstence z ledu a úlomků hornin.",
  }),
  choice("Jak se jmenuje naše galaxie?", "Mléčná dráha", [
    { value: "Andromeda", why: "Andromeda je sousední galaxie." },
    { value: "Velký vůz", why: "Velký vůz je skupina hvězd na obloze." },
    { value: "Orion", why: "Orion je souhvězdí." },
  ], {
    hints: ["Za jasné noci bez světel uvidíš na obloze bělavý pás. Jak se mu říká?", "Ten pás tvoří miliardy vzdálených hvězd; podle staré pověsti je to rozlité mléko."],
    explanation: "Naše galaxie se jmenuje Mléčná dráha; Slunce je jednou z jejích hvězd.",
  }),
  choice("Která planeta se nazývá rudá?", "Mars", [
    { value: "Jupiter", why: "Jupiter je pruhovaný obr." },
    { value: "Venuše", why: "Venuše je zahalená bělavými mraky." },
    { value: "Neptun", why: "Neptun je modrý." },
  ], {
    hints: ["Tato planeta je čtvrtá od Slunce.", "Její povrch pokrývá načervenalý prach, a proto na obloze svítí do červena."],
    explanation: "Mars je rudá planeta — pokrývá ho rezavý prach.",
  }),
  choice("Za jak dlouho oběhne Země kolem Slunce?", "za rok", [
    { value: "za den", why: "Za den se Země jednou otočí kolem své osy." },
    { value: "za měsíc", why: "Za měsíc oběhne Měsíc kolem Země." },
    { value: "za týden", why: "Týden s pohybem Země nesouvisí." },
  ], {
    hints: ["Kolik ročních období Země zažije během jednoho oběhu kolem Slunce?", "Během jednoho oběhu kolem Slunce projde Země jarem, létem, podzimem i zimou — a pak se slaví Nový rok."],
    explanation: "Země oběhne Slunce za rok, tedy asi za 365 dní.",
  }),
  choice("Proč Měsíc v noci svítí?", "odráží světlo Slunce", [
    { value: "sám hoří jako Slunce", why: "Měsíc nehoří, je to studené kamenné těleso." },
    { value: "vyzařuje vlastní světlo", why: "Vlastní světlo mají hvězdy." },
    { value: "svítí na něm lampy", why: "Na Měsíci žádné lampy nejsou." },
  ], {
    hints: ["Je Měsíc hvězda?", "Měsíc je jako zrcadlo ve tmě: sám nesvítí, jen vrací paprsky, které na něj dopadají."],
    explanation: "Měsíc sám nesvítí; odráží světlo Slunce.",
  }),
  choice("Která planeta je třetí od Slunce?", "Země", [
    { value: "Mars", why: "Mars je čtvrtý." },
    { value: "Venuše", why: "Venuše je druhá." },
    { value: "Jupiter", why: "Jupiter je pátý." },
  ], {
    hints: ["Za Merkurem a Venuší přichází…", "Je to jediná planeta, o které víme, že je na ní život."],
    explanation: "Třetí planetou od Slunce je Země.",
  }),
  choice("Kdo byl první člověk na Měsíci?", "Neil Armstrong", [
    { value: "Jurij Gagarin", why: "Gagarin byl první člověk ve vesmíru (1961), na Měsíci nebyl." },
    { value: "Kryštof Kolumbus", why: "Kolumbus se plavil do Ameriky." },
    { value: "Vladimír Remek", why: "Remek byl první Čech ve vesmíru." },
  ], {
    hints: ["Stalo se to v roce 1969 při letu Apolla 11.", "Americký astronaut řekl, že je to malý krok pro člověka, ale velký skok pro lidstvo."],
    explanation: "Neil Armstrong vstoupil na Měsíc v roce 1969.",
  }),
  choice("Kdo byl první člověk ve vesmíru?", "Jurij Gagarin", [
    { value: "Neil Armstrong", why: "Armstrong byl první na Měsíci (1969)." },
    { value: "Vladimír Remek", why: "Remek letěl až v roce 1978 jako první Čech." },
    { value: "Galileo Galilei", why: "Galilei zkoumal oblohu dalekohledem, do vesmíru neletěl." },
  ], {
    hints: ["Stalo se to v roce 1961.", "Sovětský kosmonaut obletěl Zemi v lodi Vostok 1."],
    explanation: "Jurij Gagarin obletěl Zemi v roce 1961 jako první člověk ve vesmíru.",
  }),
];

const L2: PracticeTask[] = [
  choice("Které planety jsou kamenné?", "Merkur, Venuše, Země a Mars", [
    { value: "Jupiter, Saturn, Uran a Neptun", why: "To jsou obří planety z plynu a ledu." },
    { value: "Země, Jupiter, Saturn a Mars", why: "Jupiter a Saturn jsou plynní obři." },
    { value: "Merkur, Jupiter, Uran a Venuše", why: "Jupiter a Uran jsou obři." },
  ], {
    hints: ["Kamenné planety jsou ty nejbližší Slunci.", "Jsou to první čtyři planety od Slunce, mezi nimi i naše Země."],
    explanation: "Kamenné planety jsou Merkur, Venuše, Země a Mars — čtyři nejbližší Slunci.",
  }),
  choice("Které planety jsou obři z plynu a ledu?", "Jupiter, Saturn, Uran a Neptun", [
    { value: "Merkur, Venuše, Země a Mars", why: "To jsou kamenné planety." },
    { value: "Mars, Jupiter, Saturn a Země", why: "Mars a Země jsou kamenné." },
    { value: "Venuše, Saturn, Uran a Merkur", why: "Venuše a Merkur jsou kamenné." },
  ], {
    hints: ["Obří planety jsou daleko od Slunce.", "Jsou to čtyři vnější planety — od páté až po osmou."],
    explanation: "Jupiter, Saturn, Uran a Neptun jsou obří planety z plynu a ledu.",
  }),
  choice("Kolikrát je Slunce přibližně širší (průměrem) než Země?", "asi stokrát", [
    { value: "asi dvakrát", why: "Slunce je mnohem větší." },
    { value: "asi desetkrát", why: "Desetkrát širší než Země je zhruba Jupiter." },
    { value: "asi milionkrát", why: "Asi milionkrát víc Zemí by se do Slunce vešlo objemem, průměr je větší asi stokrát." },
  ], {
    hints: ["Slunce je obrovské. Porovnej průměr, ne objem.", "Kdyby Země byla velká jako hrášek, bylo by Slunce velké jako stolička — přes sto hrášků vedle sebe."],
    explanation: "Průměr Slunce je asi 109krát větší než průměr Země.",
  }),
  choice("Za jak dlouho oběhne Měsíc kolem Země?", "asi za měsíc", [
    { value: "za jeden den", why: "Za den se otočí Země kolem své osy." },
    { value: "za rok", why: "Za rok oběhne Země kolem Slunce." },
    { value: "za týden", why: "Za týden se změní jen fáze Měsíce." },
  ], {
    hints: ["Jak dlouho trvá, než je znovu úplněk?", "Od jednoho úplňku k dalšímu uplyne asi 29 dní."],
    explanation: "Měsíc oběhne Zemi asi za měsíc — podle něj se ten časový úsek jmenuje.",
  }),
  choice("Co je kometa?", "těleso z ledu a prachu s ohonem", [
    { value: "padající hvězda", why: "Padající hvězda je meteor — úlomek, který shoří v atmosféře." },
    { value: "malá planeta s prstenci", why: "Kometa není planeta." },
    { value: "měsíc planety Jupiter", why: "Kometa obíhá Slunce, ne planetu." },
  ], {
    hints: ["Když se toto těleso přiblíží ke Slunci, vytvoří se mu dlouhý ohon.", "Je to „špinavá sněhová koule“: teplem Slunce se z ní uvolňuje plyn a prach."],
    explanation: "Kometa je těleso z ledu a prachu; u Slunce se jí vytvoří ohon.",
  }),
  choice("Co je meteor, lidově padající hvězda?", "úlomek, který shoří v atmosféře", [
    { value: "hvězda, která spadne na Zemi", why: "Hvězdy nepadají — jsou mnohem větší než Země." },
    { value: "kometa s dlouhým ohonem", why: "Kometa je vidět mnoho nocí, meteor jen chvilku." },
    { value: "planeta, která se ztratila", why: "Planety se neztrácejí." },
  ], {
    hints: ["Proč padající hvězda na obloze jen krátce zazáří?", "Drobné kamínky z vesmíru vletí velkou rychlostí do vzduchu, rozžhaví se a shoří."],
    explanation: "Meteor je světelná stopa úlomku, který shoří v atmosféře.",
  }),
  choice("Jak se jmenuje skupina sedmi jasných hvězd ve tvaru vozu?", "Velký vůz", [
    { value: "Orion", why: "Orion má tvar lovce s pásem tří hvězd." },
    { value: "Kasiopeja", why: "Kasiopeja má tvar písmene W." },
    { value: "Mléčná dráha", why: "Mléčná dráha je celá galaxie." },
  ], {
    hints: ["Je součástí souhvězdí Velké medvědice.", "Podle dvou zadních hvězd tohoto obrazce najdeš Polárku."],
    explanation: "Sedm jasných hvězd ve tvaru vozu je Velký vůz, část Velké medvědice.",
  }),
  choice("Proč Pluto od roku 2006 nepatří mezi planety?", "je malé a obíhá mezi mnoha podobnými tělesy", [
    { value: "Pluto se rozpadlo", why: "Pluto dál obíhá Slunce." },
    { value: "Pluto odletělo ze Sluneční soustavy", why: "Pluto zůstává ve Sluneční soustavě." },
    { value: "Pluto je hvězda", why: "Pluto sám nesvítí." },
  ], {
    hints: ["Astronomové objevili v jeho blízkosti mnoho podobně velkých těles.", "Planeta musí svou dráhu „uklidit“; Pluto je malé a obíhá v pásu mnoha ledových těles."],
    explanation: "Pluto je malé a jeho dráhu sdílí mnoho podobných těles — je to trpasličí planeta.",
  }),
  choice("Jakou teplotu má přibližně povrch Slunce?", "asi 5 500 °C", [
    { value: "asi 100 °C", why: "Tolik má vařící voda; Slunce je mnohem teplejší." },
    { value: "asi 1 000 °C", why: "Tolik má láva; Slunce je teplejší." },
    { value: "asi 1 000 000 °C", why: "Takovou teplotu má řídká sluneční koróna, ne povrch." },
  ], {
    hints: ["Povrch Slunce je mnohem teplejší než láva.", "Je to několik tisíc stupňů — asi pětkrát víc než teplota tekoucí lávy."],
    explanation: "Povrch Slunce má asi 5 500 °C.",
  }),
  choice("Jak dlouho letí světlo ze Slunce na Zemi?", "asi 8 minut", [
    { value: "asi 1 sekundu", why: "Asi sekundu letí světlo z Měsíce." },
    { value: "asi 8 hodin", why: "Světlo je rychlejší." },
    { value: "asi rok", why: "Rok by letělo k mnohem vzdálenějším hvězdám." },
  ], {
    hints: ["Světlo je nejrychlejší, ale Slunce je velmi daleko.", "Když se podíváš na Slunce, vidíš ho takové, jaké bylo před několika minutami."],
    explanation: "Světlo ze Slunce letí k Zemi asi 8 minut.",
  }),
  choice("Který Čech letěl jako první do vesmíru?", "Vladimír Remek", [
    { value: "Neil Armstrong", why: "Armstrong byl Američan, první na Měsíci." },
    { value: "Jurij Gagarin", why: "Gagarin byl sovětský kosmonaut, první ve vesmíru." },
    { value: "Buzz Aldrin", why: "Aldrin byl americký astronaut z Apolla 11." },
  ], {
    hints: ["Letěl v roce 1978 jako třetí národ ve vesmíru.", "Byl to vojenský pilot, který strávil týden na sovětské stanici Saljut 6."],
    explanation: "Vladimír Remek letěl do vesmíru v roce 1978 jako první Čech.",
  }),
  choice("Jak se jmenuje sousední velká galaxie viditelná i pouhým okem?", "galaxie v Andromedě", [
    { value: "souhvězdí Velký vůz", why: "Velký vůz je skupina hvězd naší galaxie." },
    { value: "hvězda Polárka", why: "Polárka je jedna hvězda." },
    { value: "planeta Saturn", why: "Saturn je planeta Sluneční soustavy." },
  ], {
    hints: ["Za tmavé noci ji uvidíš jako slabou mlhavou skvrnku.", "Nese jméno podle souhvězdí, ve kterém leží — podle bájné princezny."],
    explanation: "Galaxie v Andromedě je nejbližší velká galaxie, vzdálená přes dva miliony světelných let.",
  }),
  choice("Proč je na Venuši větší horko než na Merkuru, i když je dál od Slunce?", "hustá atmosféra drží teplo", [
    { value: "Venuše je blíž Slunci", why: "Venuše je dál než Merkur." },
    { value: "na Venuši jsou sopky pořád aktivní", why: "Hlavní příčinou je skleníkový efekt atmosféry." },
    { value: "Venuše je z kovu", why: "Venuše je kamenná planeta." },
  ], {
    hints: ["Čím je Venuše zahalená?", "Hustá oblačnost a oxid uhličitý zadrží teplo jako obrovský skleník."],
    explanation: "Hustá atmosféra Venuše zadržuje teplo — silný skleníkový efekt.",
  }),
];

const L3: PracticeTask[] = [
  choice("Proč z Měsíce vidíme stále stejnou stranu?", "otočí se kolem osy stejně rychle, jako oběhne Zemi", [
    { value: "Měsíc se kolem své osy vůbec neotáčí", why: "Otáčí se — jednou za oběh." },
    { value: "druhá strana je stále ve tmě", why: "Odvrácená strana je také osvětlená, jen z ní nevidíme." },
    { value: "Země mu zakrývá druhou stranu", why: "Země ho nezakrývá." },
  ], {
    hints: ["Zkus obejít židli tak, abys na ni stále hleděl nebo hleděla. Co udělá tvoje tělo?", "Při jednom obejití se sám nebo sama jednou otočíš — stejně to dělá Měsíc kolem Země."],
    explanation: "Měsíc se kolem osy otočí přesně za dobu, za kterou oběhne Zemi, a proto k nám míří stále stejnou stranou.",
  }),
  choice("Proč na Měsíci není počasí a obloha je černá i ve dne?", "nemá atmosféru", [
    { value: "je moc malý na mraky", why: "Rozhoduje vzduch, ne velikost." },
    { value: "je daleko od Slunce", why: "Měsíc je od Slunce stejně daleko jako Země." },
    { value: "je celý z kamene", why: "I Země je kamenná, ale má vzduch." },
  ], {
    hints: ["Co dělá oblohu na Zemi modrou a vytváří mraky?", "Počasí a modrou oblohu vytváří vzduch; Měsíc je na udržení vzduchu příliš slabý."],
    explanation: "Měsíc nemá atmosféru — bez vzduchu nejsou mraky, vítr ani modrá obloha.",
  }),
  choice("Kosmonaut na Měsíci vyskočí mnohem výš než na Zemi. Proč?", "Měsíc ho přitahuje slaběji", [
    { value: "na Měsíci je víc vzduchu", why: "Na Měsíci vzduch není." },
    { value: "Měsíc se točí rychleji", why: "Otáčení výšku skoku nezvýší." },
    { value: "skafandr je lehký jako peří", why: "Skafandr je těžký." },
  ], {
    hints: ["Na čem závisí, jak silně nás těleso přitahuje?", "Menší těleso má slabší přitažlivost; na Měsíci váží všechno asi šestkrát méně než na Zemi."],
    explanation: "Měsíc je menší a přitahuje asi šestkrát slaběji než Země.",
  }),
  choice("Co se stane při zatmění Slunce?", "Měsíc zakryje Slunce", [
    { value: "Země zakryje Slunce", why: "Země nemůže zakrýt Slunce sama sobě." },
    { value: "Slunce na chvíli zhasne", why: "Slunce svítí dál; jen ho něco zakryje." },
    { value: "mraky zakryjí Slunce", why: "Zatažená obloha není zatmění." },
  ], {
    hints: ["Co se musí dostat mezi Slunce a Zemi?", "Při zatmění Slunce stojí mezi Sluncem a Zemí jiné těleso a vrhá na nás stín."],
    explanation: "Při zatmění Slunce se Měsíc dostane mezi Slunce a Zemi a zakryje ho.",
  }),
  choice("Co se stane při zatmění Měsíce?", "Země vrhne stín na Měsíc", [
    { value: "Slunce zakryje Měsíc", why: "Slunce je za Zemí, Měsíc nezakrývá." },
    { value: "Měsíc úplně zhasne", why: "Měsíc zčervená, ale nezmizí." },
    { value: "Měsíc se schová za Slunce", why: "Měsíc obíhá Zemi, za Slunce se neschová." },
  ], {
    hints: ["Kdo je při zatmění Měsíce uprostřed mezi Sluncem a Měsícem?", "Při úplňku se někdy Země postaví přesně mezi Slunce a Měsíc."],
    explanation: "Při zatmění Měsíce stojí Země mezi Sluncem a Měsícem a vrhá na něj stín.",
  }),
  choice("Proč jsou planety daleko od Slunce studené?", "dopadá na ně méně slunečního tepla", [
    { value: "jsou z ledu od začátku", why: "Studené jsou kvůli vzdálenosti od Slunce." },
    { value: "otáčejí se pomalu", why: "Rozhoduje hlavně vzdálenost od Slunce." },
    { value: "Slunce na ně nesvítí", why: "Svítí, jen slabě." },
  ], {
    hints: ["Kdy je ti u ohně tepleji — blízko, nebo daleko?", "Čím dál od zdroje tepla, tím méně tepla dopadne na stejnou plochu."],
    explanation: "Vzdálené planety dostávají od Slunce mnohem méně tepla.",
  }),
  choice("Proč Neptun neuvidíš bez dalekohledu?", "je velmi daleko a slabě osvětlený", [
    { value: "je průhledný", why: "Neptun je obří neprůhledná planeta." },
    { value: "svítí jen ve dne", why: "Planety vidíme hlavně v noci." },
    { value: "je menší než Měsíc", why: "Neptun je mnohem větší než Země." },
  ], {
    hints: ["Která planeta je nejvzdálenější?", "Světlo Slunce k němu letí přes čtyři hodiny; odražené světlo je proto velmi slabé."],
    explanation: "Neptun je tak daleko a tak slabě osvětlený, že ho uvidíš jen dalekohledem.",
  }),
  choice("Co by se stalo, kdyby zemská osa nebyla nakloněná?", "nestřídala by se roční období", [
    { value: "nestřídal by se den a noc", why: "Den a noc způsobuje otáčení Země, ne sklon osy." },
    { value: "Země by přestala obíhat Slunce", why: "Oběh na sklonu nezávisí." },
    { value: "Měsíc by přestal svítit", why: "Měsíc by odrážel světlo dál." },
  ], {
    hints: ["Co způsobuje sklon osy?", "Kvůli sklonu je severní polokoule část roku přikloněná ke Slunci a část odkloněná."],
    explanation: "Roční období vznikají kvůli sklonu zemské osy; bez něj by se nestřídala.",
  }),
  choice("Která planeta by na obří vodní hladině plavala, protože je lehčí než voda?", "Saturn", [
    { value: "Jupiter", why: "Jupiter je hustší než voda." },
    { value: "Země", why: "Země je z hornin a kovů — mnohem těžší než voda." },
    { value: "Mars", why: "Mars je kamenný a těžký." },
  ], {
    hints: ["Je to plynný obr s prstenci.", "Tato planeta má ze všech nejmenší hustotu — je řidší než voda."],
    explanation: "Saturn má menší hustotu než voda — v obří vaně by plaval.",
  }),
  choice("Proč je povrch Marsu načervenalý?", "je pokrytý rezavým prachem", [
    { value: "je rozžhavený", why: "Mars je studený." },
    { value: "odráží červené Slunce", why: "Slunce je bílé, červený je povrch." },
    { value: "je z červeného skla", why: "Mars je z hornin a prachu." },
  ], {
    hints: ["Z čeho vzniká rez?", "Horniny Marsu obsahují hodně železa, které zreziví a zbarví prach do červena."],
    explanation: "Prach na Marsu obsahuje zrezivělé železo, a proto je planeta rudá.",
  }),
  choice("Hvězdy se v noci zdají pomalu pohybovat po obloze. Proč?", "Země se otáčí", [
    { value: "hvězdy obíhají kolem Země", why: "Hvězdy kolem Země neobíhají." },
    { value: "vítr je posouvá", why: "Vítr na hvězdy nepůsobí." },
    { value: "Slunce je táhne za sebou", why: "Slunce hvězdy netáhne." },
  ], {
    hints: ["Proč se zdá, že Slunce jde přes den po obloze?", "Stejný důvod, proč vychází a zapadá Slunce, platí i pro hvězdy v noci."],
    explanation: "Zdánlivý pohyb hvězd způsobuje otáčení Země kolem osy.",
  }),
  choice("Proč se Slunce zdá mnohem větší než ostatní hvězdy?", "je nám mnohem blíž", [
    { value: "je největší hvězdou ve vesmíru", why: "Existují hvězdy mnohem větší než Slunce." },
    { value: "ostatní hvězdy jsou menší než Země", why: "Hvězdy jsou mnohem větší než Země." },
    { value: "svítí jen ve dne", why: "O velikosti to nic neříká." },
  ], {
    hints: ["Jak velký se ti zdá dům, když jsi u něj, a jak velký z dálky?", "Ostatní hvězdy jsou tak daleko, že jejich světlo k nám letí roky."],
    explanation: "Slunce je průměrná hvězda, jen je nám mnohem blíž než ostatní.",
  }),
  choice("Proč je v noci tma, když Slunce pořád svítí?", "naše místo na Zemi se otočilo od Slunce", [
    { value: "Slunce v noci zhasne", why: "Slunce svítí nepřetržitě." },
    { value: "Měsíc zakryje Slunce každou noc", why: "To by bylo zatmění, a to je vzácné." },
    { value: "Slunce v noci obíhá kolem Země", why: "Země obíhá kolem Slunce, ne naopak." },
  ], {
    hints: ["Co dělá Země během jednoho dne?", "Země se za den jednou otočí kolem osy; polovina je vždy ke Slunci přivrácená a polovina odvrácená."],
    explanation: "Když se naše místo na Zemi otočí od Slunce, nastane noc.",
  }),
];

function gen(level: number): PracticeTask[] {
  return shuffle(level >= 3 ? L3 : level === 2 ? L2 : L1);
}

export const VESMIRSLUNECNISOUSTAVAPLANETYSLUNCEMESIC: TopicMetadata[] = [
  {
    id: "g5-prirodoveda-rozmanitost-prirody-neziva-priroda-rozsireni-vesmir-slunecni-soustava-planety-slunce-mesic",
    rvpNodeId: "g5-prirodoveda-rozmanitost-prirody-neziva-priroda-rozsireni-vesmir-slunecni-soustava-planety-slunce-mesic",
    title: "Vesmír - Sluneční soustava, planety, Slunce, Měsíc",
    studentTitle: "Vesmír",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Neživá příroda - rozšíření",
    briefDescription: "Poznáš planety Sluneční soustavy a dozvíš se, co je Slunce a Měsíc.",
    keywords: ["vesmír", "planety", "Slunce", "Měsíc", "Sluneční soustava", "hvězdy", "komety"],
    goals: ["Vyjmenovat planety Sluneční soustavy v pořadí od Slunce", "Popsat základní vlastnosti Slunce a Měsíce", "Rozlišit kamenité a plynné planety"],
    boundaries: ["Neprobírá spektroskopii hvězd", "Neprobírá kosmonautiku do hloubky"],
    gradeRange: [5, 5],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Planety od Slunce: Merkur, Venuše, Země, Mars, Jupiter, Saturn, Uran, Neptun. Pomůže věta s počátečními písmeny.",
      steps: ["Zapamatuj si pořadí planet.", "Rozliš kamenité (1–4) a plynné (5–8).", "Slunce = hvězda, Měsíc = přirozená družice Země."],
      commonMistake: "Pluto není planeta – je to trpasličí planeta od roku 2006.",
      example: "Merkur – nejmenší a nejbližší k Slunci. Saturn – má výrazné prstence.",
    },
  },
];
