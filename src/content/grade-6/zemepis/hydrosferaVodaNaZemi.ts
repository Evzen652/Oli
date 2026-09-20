/**
 * Zeměpis 6. ročník — Hydrosféra: oceány, řeky, jezera, podzemní voda (select_one).
 *
 * K tématu nejsou mapy ani obrázky: rozložení vody, části toku i podzemní
 * vrstvy se popisují slovy. Každá úloha má čtyři možnosti, právě jednu
 * správnou a optionFeedback u každého distraktoru; téma nemíchá typy a nemá
 * solutionSteps (není výpočetní).
 *
 * Chybový model (každý distraktor = jedna typická miskoncepce šesťáka):
 *  • největší zásoba sladké vody prý v řekách a jezerech (ledovec nedochází);
 *  • „slaná je jen mořská voda" — slanost se nespojí s tím, že z jezera nic
 *    neodtéká a voda odchází jen výparem;
 *  • podzemní voda jako souvislá řeka nebo jezero v jeskynní dutině;
 *  • strana přítoku určovaná při pohledu PROTI proudu nebo podle mapy,
 *    záměna pramene a ústí;
 *  • povodňová vlna počítaná jen z množství deště, bez ohledu na povrch
 *    povodí (les × dlažba, vsak × rychlý odtok);
 *  • povodí × rozvodí × koryto × soutok navzájem zaměněné.
 *
 *  • L1 — zapamatování: banka faktů o rozložení vody, oceánech, částech toku,
 *         podzemní vodě a koloběhu. Jeden krok, jeden pojem. Vedle definic
 *         obsahuje i zástupce (největší oceán, nejdelší řeka Česka, nejhlubší
 *         jezero) a rozpoznání děje z popsané situace (vsakování), aby sezení
 *         nevyšlo jako série definic. Rotace bere položky banky po sobě, takže
 *         o skladbě sezení rozhoduje POŘADÍ v bance: definice pojmu u toku
 *         (pramen, ústí, přítok, povodí, rozvodí) jsou proto rozsazené po
 *         čtyřech pozicích — do okna šesti úloh se jich vejdou nejvýš dvě.
 *         Ze stejného důvodu jsou daleko od sebe i dvojice, které si navzájem
 *         prozrazují odpověď (97 % × 71 %, největší oceán × oceán mezi Evropou
 *         a Amerikou, oba koloběhové fakty).
 *  • L2 — použití: jev → příčina (proč déšť z moře není slaný, proč horní tok
 *         hloubí a dolní ukládá, odkud se bere voda ve studni, jak se pozná
 *         pravý přítok, co patří do povodí a kudy vede rozvodí).
 *  • L3 — analýza a přenos: rozpoznání útvaru jen ze znaků, důsledek zásahu
 *         v povodí, myšlenkový pokus se dvěma sklenicemi a otázky „co NEplatí".
 *         Znění je situační, tedy disjunktní vůči L1.
 *
 * Sporná čísla se jako klíč nepoužívají (počet oceánů 4 × 5 kvůli Jižnímu
 * oceánu, délka Nilu nebo Amazonky na kilometr, hloubka Bajkalu na metr) —
 * ptáme se na řád a na pořadí.
 *
 * Rotace banky začíná na náhodném místě (lokální počítadlo v gen()), modul
 * nemá stav mezi voláními.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildChoiceTask as choice, losUlohy, ruzneUlohy, shuffle } from "./_shared";

/** Jedna položka banky: otázka, klíč, distraktory [možnost, proč je to chyba], dvě nápovědy, vysvětlení. */
interface Polozka {
  q: string;
  key: string;
  ds: [string, string][];
  h: [string, string];
  ex: string;
}

const uloha = (p: Polozka): PracticeTask | null =>
  choice(p.q, p.key, shuffle(p.ds.map(([value, why]) => ({ value, why }))), {
    hints: [...p.h],
    explanation: p.ex,
  });

// ── L1 — zapamatování ────────────────────────────────────────────────────
const BANKA_L1: Polozka[] = [
  {
    q: "Jak velká část veškeré vody na Zemi je slaná voda oceánů a moří?",
    key: "asi 97 %",
    ds: [
      ["asi 3 %", "To je naopak podíl sladké vody. Slané vody je na Zemi mnohem víc než sladké."],
      ["asi 71 %", "Tohle číslo říká, jak velkou část zemského povrchu voda pokrývá. Ptáme se ale na podíl ze všech zásob vody."],
      ["asi 50 %", "Poloviny to zdaleka nejsou. Slaná voda má mezi zásobami vody drtivou převahu."],
    ],
    h: [
      "Slaná voda je v oceánech a mořích, sladká v ledovcích, řekách a pod zemí. Které zásoby jsou mnohem větší?",
      "Oceány pokrývají většinu zemského povrchu a jsou hluboké celé kilometry, kdežto sladká voda se vejde do ledovců, řek a pórů v horninách. Podíl slané vody se proto blíží stovce procent, rozhodně to není polovina ani malý zlomek.",
    ],
    ex: "Naprostá většina vody na Zemi je slaná a leží v oceánech a mořích. Sladké vody je jen nepatrný zbytek — a i ten je z větší části zmrzlý.",
  },
  {
    q: "Jak se nazývá místo, kde vodní tok začíná?",
    key: "pramen",
    ds: [
      ["ústí", "Ústí je naopak konec toku — místo, kde se vlévá do jiné vody."],
      ["povodí", "Povodí je celé území, ze kterého voda stéká do jednoho toku, ne jedno konkrétní místo."],
      ["rozvodí", "Rozvodí je hranice mezi dvěma povodími. S počátkem toku nesouvisí."],
    ],
    h: [
      "Hledáme slovo pro to místo, odkud voda vyvěrá ze země a odkud teče dál do krajiny.",
      "Na začátku toku vystoupí podzemní voda na povrch a vytvoří malou stružku, ze které postupně vzniká potok a pak řeka. Hledané slovo je jednoslovné a v češtině se používá i v přeneseném významu, když mluvíme o zdroji informací.",
    ],
    ex: "Začátek vodního toku je místo, kde podzemní voda vystoupí na povrch. Odtud teče voda dál a cestou se k ní připojují další toky.",
  },
  {
    q: "Který oceán je ze všech největší?",
    key: "Tichý oceán",
    ds: [
      ["Atlantský oceán", "Atlantský oceán je druhý největší. Odděluje Evropu a Afriku od Ameriky."],
      ["Indický oceán", "Indický oceán je v pořadí až třetí. Leží mezi Afrikou, Asií a Austrálií."],
      ["Severní ledový oceán", "Severní ledový oceán je ze všech nejmenší a nejmělčí. Leží kolem severního pólu."],
    ],
    h: [
      "Ten největší leží mezi Asií a Amerikou a sám zabírá skoro třetinu zemského povrchu.",
      "Největší oceán omývá východní pobřeží Asie a západní pobřeží Ameriky. Je tak rozlehlý, že by se do něj vešly všechny světadíly dohromady, a je také nejhlubší ze všech — leží v něm nejhlubší známé místo planety.",
    ],
    ex: "Největší oceán světa leží mezi Asií, Austrálií a Amerikou a zabírá zhruba třetinu celého zemského povrchu. Je zároveň nejhlubší.",
  },
  {
    q: "Které dva děje především pohánějí koloběh vody na Zemi?",
    key: "výpar a srážky",
    ds: [
      ["příliv a odliv", "Příliv a odliv působí přitažlivost Měsíce a Slunce. Hladinu zvedají a spouštějí, ale vodu z moře nahoru nedostanou."],
      ["mrznutí a tání", "Mrznutí a tání koloběh jen doprovázejí. Ve většině světa se voda pohybuje jinak."],
      ["vítr a mořské proudy", "Vítr a mořské proudy vodu jen přenášejí z místa na místo. Vzhůru do ovzduší ji nedostanou."],
    ],
    h: [
      "Jak se voda dostane z hladiny moře nahoru do mraku a jak se odtamtud vrátí zpátky dolů?",
      "Sluneční teplo mění vodu na hladině v neviditelnou páru, která stoupá vzhůru. Ve výšce pára zkapalní v mrak a voda spadne zpátky na zem, odteče do moře a celý děj začíná znovu. Tyhle dva kroky drží koloběh v chodu.",
    ],
    ex: "Koloběh vody drží v chodu Slunce: jeho teplem se voda z hladin a z půdy dostává do ovzduší a odtud padá zpátky na zem. Obojí se opakuje pořád dokola.",
  },
  {
    q: "Kde je uložena největší část sladké vody na Zemi?",
    key: "v ledovcích a ledových štítech",
    ds: [
      ["v řekách a jezerech", "Řeky a jezera jsou jen malý zlomek sladké vody. Většina je zmrzlá, a proto ji nevidíme."],
      ["v oceánech a mořích", "V oceánech a mořích je vody nejvíc ze všeho, jenže je slaná. Ptáme se na sladkou vodu."],
      ["v oblacích a ve vodní páře", "V ovzduší je vody jen nepatrný zlomek. Kdyby najednou spadla, vytvořila by jen tenkou vrstvu."],
    ],
    h: [
      "Sladká voda nemusí být tekutá. Ve kterém skupenství je jí na Zemi nejvíc?",
      "Největší zásoby sladké vody jsou zmrzlé a leží v polárních oblastech a ve vysokých horách. Toky a nádrže, které vidíš kolem sebe, tvoří jen nepatrnou část — voda v pevném skupenství je mnohonásobně převyšuje.",
    ],
    ex: "Sladké vody je na Zemi málo a většina z ní je zmrzlá v pevninském ledu. Řeky a jezera, ze kterých lidé nejčastěji berou vodu, jsou z celkové zásoby jen zlomek.",
  },
  {
    q: "Jak se nazývá místo, kde se řeka vlévá do moře nebo do jiné řeky?",
    key: "ústí",
    ds: [
      ["pramen", "Pramen je naopak začátek toku, kde voda vyvěrá ze země."],
      ["přítok", "Přítok je sám vodní tok, který se vlévá do většího. Ptáme se ale na to místo, kde tok končí."],
      ["koryto", "Koryto je prohlubeň, kterou voda teče po celé délce toku, ne jeho konec."],
    ],
    h: [
      "Je to opak začátku toku — místo, kde řeka svou cestu končí.",
      "Voda z řeky se tam smíchá s vodou moře nebo většího toku a řeka už dál samostatně nepokračuje. Někdy má takové místo tvar široké nálevky, jindy se rozpadne na množství ramen a písečných ostrůvků a vzniká delta.",
    ],
    ex: "Konec vodního toku je místo, kde se jeho voda vlévá do moře, do jezera nebo do většího toku. Odtud už voda pokračuje pod jiným jménem.",
  },
  {
    q: "Co je jezero?",
    key: "přirozená vodní nádrž ve sníženině na souši",
    ds: [
      ["mělká nádrž, kterou lidé vybudovali k chovu ryb", "To je rybník. Ptáme se na nádrž, která vznikla bez zásahu člověka."],
      ["nádrž, která vznikla přehrazením řeky hrází", "To je přehradní nádrž. Ta je dílem lidí, ne přírody."],
      ["část oceánu, která zasahuje mezi pevniny", "To je moře nebo záliv. Ptáme se na vodní plochu uvnitř souše."],
    ],
    h: [
      "Rozhoduje dvojí: jestli tu vodu někdo vytvořil, a jestli stojí, nebo teče.",
      "Tahle vodní plocha vznikla sama, bez hráze a bez lidské práce — voda se nahromadila tam, kde je terén níž než okolí. Od moře se liší tím, že leží uprostřed pevniny, a od rybníka tím, že ji nikdo nevykopal ani nepřehradil.",
    ],
    ex: "Jezero je stojatá voda v přirozené prohlubni souše. Od rybníka a přehrady se liší tím, že nevzniklo lidskou prací, od moře tím, že neleží na okraji oceánu.",
  },
  {
    q: "Co je ledovec?",
    key: "velké množství ledu, které se vlastní vahou pomalu sune",
    ds: [
      ["zamrzlá hladina jezera nebo rybníka v zimě", "Led na jezeře je jen tenká vrstva, která na jaře roztaje. Hledaný útvar vydrží staletí."],
      ["kra, která plave po hladině studeného moře", "Kra je jen kus ledu, který se z většího tělesa odlomil a plave pryč."],
      ["sníh, který v horách napadne během jedné zimy", "Sníh z jedné zimy přes léto roztaje. Musí se vrstvit mnoho let, aby vzniklo něco trvalého."],
    ],
    h: [
      "Rozhoduje, jak dlouho ten led vydrží a jestli se dokáže sám pohybovat.",
      "Ve vysokých horách a v polárních krajích napadne za rok víc sněhu, než ho stačí roztát. Spodní vrstvy se tlakem změní v led, ten je po staletích tak mohutný, že se po svahu plazí dolů a cestou brousí skálu pod sebou.",
    ],
    ex: "Ledovec vzniká z letitého sněhu, který se stlačil v led. Není nehybný: vlastní tíhou se pomalu posouvá a modeluje krajinu pod sebou.",
  },
  {
    q: "Jak velkou část zemského povrchu pokrývá voda?",
    key: "asi 71 %",
    ds: [
      ["asi 97 %", "To je podíl slané vody ze všech zásob vody, ne podíl povrchu."],
      ["asi 30 %", "Zhruba tolik povrchu zabírá souš. Vody je na Zemi víc."],
      ["asi 50 %", "Nebude to půl na půl. Vody je znatelně víc než souše."],
    ],
    h: [
      "Přemýšlej, jestli je na zeměkouli víc modré barvy, nebo hnědé a zelené.",
      "Na glóbusu je vody zřetelně víc než souše: kdybys plul náhodným směrem, většinu cesty bys měl pod sebou vodu. Souš ale přesto zabírá pořád znatelnou část povrchu, rozhodně ne jen pár procent.",
    ],
    ex: "Voda pokrývá zhruba sedm desetin zemského povrchu, souš necelé tři desetiny. Proto se Zemi říká modrá planeta.",
  },
  {
    q: "Co je povodí řeky?",
    key: "území, ze kterého všechna voda stéká do té jedné řeky",
    ds: [
      ["pás luk a polí podél toku, který se při povodni zaplaví", "To je záplavové území. Povodí sahá mnohem dál — až k hřebenům kopců, odkud voda k toku steče."],
      ["prohlubeň, kterou řeka teče od začátku až po konec", "To je koryto řeky. Povodí je mnohem větší území kolem toku."],
      ["úsek řeky mezi posledním soutokem a mořem", "Povodí není část řeky, ale území, ze kterého se řeka napájí."],
    ],
    h: [
      "Zkus si představit, kam ze svahů steče déšť, který spadne.",
      "Postav se v duchu na hřeben a sleduj, kam steče déšť z každého svahu pod tebou: stružky se slévají do potoků a ty do větších toků. Ptáme se na to, co všechno si takhle jedna řeka posbírá.",
    ],
    ex: "Povodí je celá plocha krajiny, ze které voda po spádu doteče do jedné řeky — včetně území všech jejích přítoků. Proto sahá až k hřebenům okolních kopců.",
  },
  {
    q: "Co je podzemní voda?",
    key: "voda, která vyplňuje póry a pukliny propustných hornin",
    ds: [
      ["souvislá podzemní jezera a řeky v dutinách pod povrchem", "Volné podzemní toky jsou vzácná výjimka ve vápencovém krasu. Jinde je voda rozptýlená v hornině jako v houbě."],
      ["voda, která stojí v prohlubni na povrchu souše", "To je jezero nebo rybník. Ptáme se na vodu ukrytou v hornině pod povrchem."],
      ["voda, která stéká po povrchu do potoků a řek", "To je povrchový odtok. Hledaná voda se naopak do země vsákne."],
    ],
    h: [
      "Představ si nasáklou houbu nebo mokrý písek — a potom zvaž, která z možností tomuhle obrazu odpovídá.",
      "Když déšť dopadne na písek nebo na rozpukanou skálu, prosákne dolů a zastaví se až tam, kde dál nemůže. Zkus si představit, jak taková vrstva vypadá zevnitř, když se z ní dá po celý rok čerpat voda.",
    ],
    ex: "Podzemní voda není podzemní řeka. Je rozptýlená v drobných mezerách a trhlinách horniny, podobně jako voda v nasáklé houbě, a zastaví se nad vrstvou, kterou už neprojde.",
  },
  {
    q: "Který oceán odděluje Evropu od Severní Ameriky?",
    key: "Atlantský oceán",
    ds: [
      ["Tichý oceán", "Tichý oceán leží na opačné straně zeměkoule — mezi Asií a Amerikou."],
      ["Indický oceán", "Indický oceán omývá jižní Asii, východní Afriku a Austrálii. Evropy se vůbec nedotýká."],
      ["Severní ledový oceán", "Severní ledový oceán leží kolem severního pólu a odděluje jen nejsevernější okraje pevnin, ne celou Evropu od celé Ameriky."],
    ],
    h: [
      "Tenhle oceán museli přeplout mořeplavci, kteří se z Evropy vydali objevovat Ameriku.",
      "Mezi západním pobřežím Evropy a východním pobřežím Severní Ameriky leží druhý největší oceán světa. Plachetnicím trvala plavba přes něj několik týdnů a dodnes po něm plují mezi Evropou a Amerikou tisíce nákladních lodí.",
    ],
    ex: "Mezi Evropou a Severní Amerikou leží druhý největší oceán světa. Právě přes něj vedly objevitelské plavby do Ameriky.",
  },
  {
    q: "Co znamená, že voda na Zemi koluje?",
    key: "pořád se vrací zpátky a její celkové množství se nemění",
    ds: [
      ["postupně jí ubývá, protože se vypaří ven do vesmíru", "Do vesmíru voda ze Země prakticky neuniká. Zůstává tu a jen mění místo a skupenství."],
      ["stále jí přibývá, protože ji déšť neustále vyrábí", "Déšť žádnou vodu nevyrábí. Je to jen voda, která se předtím vypařila z hladin a z půdy."],
      ["mění se jen v oceánech, na souši zůstává na místě", "Na souši voda prší, vsakuje se, odtéká i vypařuje. Koloběh se týká i jí."],
    ],
    h: [
      "Sleduj jednu kapku: z moře nahoru, pak jako déšť dolů, pak řekou zpátky. Kolikrát to může zopakovat?",
      "Voda neustále mění místo i skupenství, ale ze Země nikam neodchází a nová nevzniká. Stejná kapka může být dnes v oceánu, za měsíc v mraku, za rok v ledovci a pak zase v řece — a tak dokola.",
    ],
    ex: "Koloběh znamená, že voda putuje pořád dokola mezi oceánem, ovzduším, souší a zpět. Zásoba je uzavřená: mění se rozmístění, ne celkové množství.",
  },
  {
    q: "Jak se nazývá menší vodní tok, který se vlévá do většího?",
    key: "přítok",
    ds: [
      ["pramen", "Pramen je místo, kde tok začíná, ne celý tok."],
      ["rozvodí", "Rozvodí je hranice mezi dvěma povodími, ne vodní tok."],
      ["soutok", "Soutok je místo, kde se dva toky spojí. Ptáme se ale na ten menší tok, ne na místo setkání."],
    ],
    h: [
      "Takový tok přidá svou vodu do většího a dál už teče společně s ním.",
      "Každá velká řeka je vlastně součtem mnoha menších toků, které se k ní cestou připojily z obou stran. Hledáme jednoslovný název pro takový menší tok — u řek se navíc rozlišuje, jestli se připojil zprava, nebo zleva.",
    ],
    ex: "Menší tok, který odevzdá svou vodu většímu, se počítá do jeho povodí. Podle strany, ze které se připojí (po směru toku), se rozlišuje pravý a levý.",
  },
  {
    q: "Kde na Zemi je největší zásoba ledu?",
    key: "v Antarktidě",
    ds: [
      ["v Severním ledovém oceánu", "Kolem severního pólu je oceán a na něm plovoucí mořský led — ten je jen pár metrů silný. Největší zásoba leží na pevnině."],
      ["v Grónsku", "Grónský ledovec je druhý největší na světě, proti tomu největšímu je ale mnohonásobně menší."],
      ["v Alpách", "Horské ledovce v Alpách jsou proti polárním nepatrné a navíc rychle ustupují."],
    ],
    h: [
      "Hledej pevninu, která je skoro celá pokrytá ledem a leží kolem jednoho z pólů.",
      "Led je tam místy přes tři kilometry silný a leží na skutečném světadílu, ne na zamrzlém moři. Ten světadíl je ze všech nejchladnější, žije na něm jen posádka vědeckých stanic a nepatří žádnému státu.",
    ],
    ex: "Největší zásoba ledu, a tím i sladké vody, leží na pevnině kolem jižního pólu. Kolem severního pólu je oceán a na něm jen pár metrů silný plovoucí led; pevninský ledovec leží na severu jen v Grónsku a i ten je mnohonásobně menší.",
  },
  {
    q: "Která řeka je v Česku nejdelší?",
    key: "Vltava",
    ds: [
      ["Labe", "Labe je u nás nejvodnatější a odvádí vodu z většiny země, na našem území je ale kratší."],
      ["Morava", "Morava je hlavní řekou východní části země. Délkou ale na dva největší toky nestačí."],
      ["Odra", "Odra protéká jen severovýchodním cípem země, na dlouhý tok tu nemá prostor."],
    ],
    h: [
      "Protéká Prahou a je na ní kaskáda velkých přehrad.",
      "Pramení na Šumavě, teče přes jižní Čechy a Prahu a u Mělníka se vlévá do Labe. V místě soutoku je přitom delší i vodnatější než tok, do kterého ústí — proto se jí říká česká národní řeka.",
    ],
    ex: "Nejdelší řeka Česka pramení na Šumavě a končí u Mělníka. Je delší než Labe, do kterého se vlévá — o tom, čí jméno si tok po soutoku ponechá, totiž délka nerozhoduje.",
  },
  {
    q: "Které jezero je na Zemi nejhlubší?",
    key: "Bajkal",
    ds: [
      ["Kaspické moře", "Kaspické moře má ze všech jezer zdaleka největší plochu. Nejhlubší ale není."],
      ["Viktoriino jezero", "Viktoriino jezero je v Africe rozlehlé, zato mělké — leží v ploché pánvi."],
      ["Hořejší jezero", "Hořejší jezero je plochou největší sladkovodní jezero světa, hloubkou ale zaostává."],
    ],
    h: [
      "Leží na Sibiři a v zimě po něm jezdí auta po ledu.",
      "Vzniklo v obrovské trhlině, kterou se zemská kůra roztrhla, a proto sahá do hloubky přes kilometr. Je v něm asi pětina veškeré sladké povrchové vody světa a žije v něm tuleň, který se jinde na světě nevyskytuje.",
    ],
    ex: "Nejhlubší jezero světa leží na Sibiři v hluboké příkopové propadlině. Právě díky hloubce je v něm víc sladké vody než v kterémkoli jiném jezeře, přestože plochou největší není.",
  },
  {
    q: "Co je rozvodí?",
    key: "hranice mezi dvěma povodími",
    ds: [
      ["stav, kdy se řeka po velkém dešti vylije z břehů", "To je rozvodnění řeky. Slovo je podobné, pojem úplně jiný — hledáme něco, co v krajině zůstane, i když voda opadne."],
      ["místo, kde se dvě řeky slévají v jednu větší", "To je soutok. Na rozvodí se voda naopak rozděluje."],
      ["úsek toku, kde se řeka dělí na několik ramen", "Rozdělení koryta na ramena je něco jiného. Hledáme hranici v terénu, ne v korytě."],
    ],
    h: [
      "Rozmysli si nejdřív, jestli hledáš plochu, čáru, nebo jedno konkrétní místo — a jestli se tam voda sbíhá, nebo rozbíhá.",
      "Déšť, který spadne kousek na jednu stranu, odteče docela jinam než ten, co spadne o pár kroků dál: každá kapka míří do jiného toku a často i do jiného moře. Hledáme pojem, který tenhle rozchod vod popisuje.",
    ],
    ex: "Rozvodí je čára, od které voda odtéká na každou stranu do jiného povodí. V terénu se drží nejvyšších míst, tedy hřebenů a hřbetů.",
  },
  {
    q: "Po dešti voda z louky pomalu mizí do půdy. Jak se tomu říká?",
    key: "vsakování",
    ds: [
      ["výpar", "Výpar mění vodu v páru, která odejde nahoru do vzduchu. Tady ale voda míří dolů."],
      ["povrchový odtok", "Povrchový odtok je voda, která po povrchu steče do potoka. Ta se do země nedostane."],
      ["srážky", "Srážky jsou voda, která na zem teprve dopadá. Ptáme se na to, co se s ní děje potom."],
    ],
    h: [
      "Voda míří dolů do mezer mezi částečkami půdy. Hledáme název pro tuhle cestu.",
      "Je to jedna ze tří cest, kterými se déšť z louky vydá: nahoru do vzduchu, po povrchu do potoka, nebo dolů do hloubky. Právě tou třetí cestou se doplňuje zásoba ukrytá v hornině, ze které pak čerpají studny.",
    ],
    ex: "Voda, která projde povrchem do půdy a dál do propustné horniny, doplňuje podzemní vodu. Čím pomaleji déšť odtéká po povrchu, tím víc ho touhle cestou v krajině zůstane.",
  },
];

// ── L2 — použití (jev → příčina, pojem → popsaná situace) ────────────────
const BANKA_L2: Polozka[] = [
  {
    q: "Voda se vypaří z moře a spadne jako déšť. Proč není ten déšť slaný?",
    key: "Při výparu se do vzduchu dostane jen voda, sůl zůstane v moři.",
    ds: [
      ["Sůl se cestou vzhůru ve vzduchu rozpustí a zmizí.", "Sůl se ve vzduchu nerozpouští ani nemizí. Výparem se z hladiny zvedne nahoru pouze voda a sůl zůstává dole."],
      ["Déšť slaný je, jen je ho tak málo, že to není cítit.", "Dešťová voda je opravdu sladká. Proto se dá zachytávat a po úpravě pít."],
      ["Sůl z vody vyberou mraky dřív, než se z nich spustí déšť.", "Mrak sůl neodděluje. Ta zůstala dole už ve chvíli, kdy se voda měnila v páru."],
    ],
    h: [
      "Co přesně se z hladiny moře zvedne nahoru — celá mořská voda, nebo jen její část?",
      "Slunce z hladiny odpaří vodu v podobě páry. Rozpuštěná sůl se v páru změnit nedokáže, potřebovala by k tomu nesrovnatelně větší teplo, a tak zůstane dole. Přesně to se děje i doma v hrnci, když necháš vyvařit slanou vodu.",
    ],
    ex: "Při vypařování se z roztoku uvolní jen voda, rozpuštěné látky zůstanou na místě. Proto je dešťová voda sladká — a moře zároveň zůstává slané.",
  },
  {
    q: "Proč bývá slané jezero v suchém kraji, ze kterého nevytéká žádná řeka?",
    key: "Voda z něj odchází jen výparem a rozpuštěné soli v něm zůstávají.",
    ds: [
      ["Přitéká do něj voda podzemní cestou přímo z moře.", "Moře bývá stovky kilometrů daleko a podzemní cesta k němu nevede. Soli přinesly řeky."],
      ["Sůl do něj přinese déšť, protože v suchém kraji prší slaně.", "Déšť je všude sladký, i nad pouští. Soli přinášejí přitékající toky."],
      ["Slaná je každá voda, která dlouho stojí na jednom místě.", "Voda sama sůl nevytvoří. Rozhoduje, jestli z jezera něco odtéká, nebo ne."],
    ],
    h: [
      "Řeky přinášejí do každého jezera trochu rozpuštěných látek. Kudy by mohly zase odejít?",
      "Do jezera přitéká voda a s ní i nepatrné množství rozpuštěných látek. Když jediná cesta ven vede přes hladinu do vzduchu, odejde tudy pouze čistá voda. Za tisíce let se tak z nepatrného množství stane opravdu hodně.",
    ],
    ex: "Bezodtoké jezero funguje jako odpařovací miska: přítok přináší rozpuštěné látky, výpar odvádí jen čistou vodu. Látky se proto hromadí a voda postupně zesílí na chuti soli.",
  },
  {
    q: "Proč se řeka na horním toku zařezává hluboko do skály?",
    key: "Teče tam prudce z kopce a má sílu odnášet úlomky pryč.",
    ds: [
      ["Teče tam pomalu, a tak má dost času se prokopat dolů.", "Pomalá voda naopak nánosy ukládá. Do skály se zakusuje voda rychlá."],
      ["Je tam nejvíc vody, protože už se do ní vlily všechny přítoky.", "Nejvíc vody má řeka až na dolním toku. U začátku je jí málo, zato padá po prudkém svahu."],
      ["Skála bývá nahoře měkčí než hornina dole v nížině.", "Horniny v horách bývají naopak tvrdé. Rozhoduje rychlost vody, ne měkkost skály."],
    ],
    h: [
      "Porovnej sklon svahu v horách a v nížině. Jak rychle tam voda v obou případech teče?",
      "V horách je koryto strmé, voda se řítí dolů a strhává s sebou písek i kameny. Ty pak jako brusný papír obrušují dno a koryto se prohlubuje do úzkého údolí. V nížině voda zpomalí a tohle už nedokáže.",
    ],
    ex: "Sílu řeky určuje hlavně rychlost. Na strmém horním toku voda unáší i kameny a těmi si prohlubuje koryto, takže vzniká úzké údolí se skalnatými stěnami.",
  },
  {
    q: "Proč řeka na dolním toku ukládá v korytě písek a bahno?",
    key: "Teče tam pomalu po rovině a unášený materiál jí klesne ke dnu.",
    ds: [
      ["Teče tam rychleji než v horách, a tak jí materiál vypadne.", "Na dolním toku je voda naopak nejpomalejší. Rychlá voda materiál unáší dál."],
      ["Je tam málo vody, protože se jí většina cestou vypařila.", "Vody je na dolním toku nejvíc, přibyla ze všech přítoků. Rozhoduje rychlost, ne množství."],
      ["Písek a bahno tam vznikají samy ze stojaté vody.", "Písek ani bahno ve vodě nevznikají. Řeka je přinesla z horních částí toku."],
    ],
    h: [
      "Co musí voda dělat, aby unesla zrnko písku? A co se stane, když to dělat přestane?",
      "V nížině je koryto skoro rovné a voda se v něm sotva plazí. Na to, aby udržela zrnka ve vznosu, už nemá dost energie, a tak se nejdřív usadí nejtěžší kamínky a nakonec i jemné bahno. Z nánosů pak vznikají ostrovy.",
    ],
    ex: "Co řeka unese, závisí na její rychlosti. Jakmile se sklon zmenší a proud zpomalí, nejtěžší částice se usadí jako první a v nížině zůstane nakonec i jemné bahno.",
  },
  {
    q: "Podle čeho se u řeky pozná pravý přítok?",
    key: "Přitéká po naší pravé ruce, když se díváme po proudu.",
    ds: [
      ["Přitéká po naší pravé ruce, když se díváme proti proudu.", "Při pohledu proti proudu vyjdou strany obráceně. Strana se vždy určuje po směru toku, k jeho konci."],
      ["Leží na mapě vpravo, ať už řeka teče kamkoli.", "Vpravo je na mapě východ, ne pravý břeh. O straně rozhoduje směr toku, ne natočení mapy."],
      ["Je z obou přítoků v daném místě ten delší.", "Délka o straně nerozhoduje. Rozhoduje jen to, odkud se tok připojuje po směru proudu."],
    ],
    h: [
      "Postav se v duchu doprostřed řeky. Kterým směrem se musíš otočit, aby ti strany vyšly správně?",
      "Břehy i přítoky se pojmenovávají z pohledu vody, ne z pohledu člověka nad mapou: díváš se stejně, jako teče voda, tedy k místu, kde řeka končí. Teprve pak rozlišíš, co máš po které ruce, a podle toho tok pojmenuješ.",
    ],
    ex: "Strana břehu i přítoku se určuje vždy po směru toku, tedy z pohledu plavce unášeného vodou. Co má takový plavec po pravé ruce, je pravý břeh a pravý přítok.",
  },
  {
    q: "Řeka teče od severu k jihu a potok do ní přitéká ze západní strany. O jaký přítok jde?",
    key: "O pravý, protože po proudu k jihu leží západ po pravé ruce.",
    ds: [
      ["O levý, protože při pohledu k severu leží západ po levé ruce.", "Díval ses proti proudu. Strana se určuje po směru toku, tedy směrem k jihu."],
      ["O levý, protože na mapě bývá západ nakreslený vlevo.", "Strana přítoku se neurčuje podle mapy, ale podle směru, kterým voda teče."],
      ["Nedá se to určit, dokud nevíme, jak je potok dlouhý.", "Délka potoka o straně nerozhoduje. Stačí vědět, kam řeka teče a odkud se potok připojuje."],
    ],
    h: [
      "Otoč se v duchu tak, jak teče voda. Co ti pak zůstane na které straně těla?",
      "Když se díváš po proudu, máš za zády sever a před sebou jih. Východ ti v té chvíli zůstane po levé ruce a západ na opačné straně těla. Podle toho pojmenuj stranu, ze které se potok připojuje.",
    ],
    ex: "Při pohledu po proudu k jihu je sever za zády, východ vlevo a západ vpravo. Potok přitékající ze západu se proto připojuje zprava.",
  },
  {
    q: "Odkud se doplňuje voda ve studni na zahradě?",
    key: "Ze srážek, které se vsáknou do země a doplní podzemní vodu.",
    ds: [
      ["Z nejbližší řeky, která ke studni teče podzemním korytem.", "Podzemní koryta jsou vzácnou výjimkou v krasu. Běžná studna čerpá z okolní nasáklé horniny."],
      ["Z moře, odkud voda putuje pod pevninou až do vnitrozemí.", "Z moře by přitekla slaná voda. Ve studni je sladká, protože pochází z deště a z tání sněhu."],
      ["Vzniká sama ve skále, když se horniny stlačí a zahřejí.", "Voda v hornině nevzniká. Prosákla tam shora z povrchu."],
    ],
    h: [
      "Studna je jen hluboká díra, která sahá až k vodě ukryté v hornině. Odkud se tam ta voda dostala?",
      "Když prší nebo taje sníh, část vody neuvízne jen v několika centimetrech půdy, ale prosákne hlouběji do písku a štěrku. Tam se zastaví nad vrstvou, kterou už neprojde, a nashromáždí se. Právě do téhle zásoby studna sahá.",
    ],
    ex: "Voda ve studni pochází z deště a z tání sněhu. Vsákne se, prosákne propustnou horninou dolů a zastaví se nad nepropustnou vrstvou — a odtud ji studna bere.",
  },
  {
    q: "Proč pramen vyvěrá právě v určitém místě na svahu?",
    key: "Podzemní voda tam narazí na nepropustnou vrstvu a po ní vyteče ven.",
    ds: [
      ["Vede tam díra až k podzemnímu jezeru, ze kterého voda stříká.", "Podzemní jezera jsou vzácná. Voda vytéká z nasáklé vrstvy horniny, ne z dutiny."],
      ["Je tam půda nejvlhčí od deště, který zrovna spadl.", "Vyvěrat může i po týdnech sucha. Napájí ho zásoba ukrytá v hornině, ne poslední déšť."],
      ["Vytlačí ji ze skály teplo ze zemského nitra.", "Teplo z nitra běžný vývěr nepohání. Voda stéká dolů vlastní vahou a vyjde tam, kde nemůže dál."],
    ],
    h: [
      "Voda pod zemí putuje dolů, dokud může. Co ji zastaví a donutí zamířit do strany?",
      "Vrstvy hornin se střídají: některé vodu propouštějí, jiné ne. Když voda sestupující pískem narazí na jíl, dál dolů se nedostane a putuje po jeho povrchu stranou. A kde tahle hranice vystoupí na svah, tam se voda objeví.",
    ],
    ex: "Voda prosakuje dolů, dokud nenarazí na vrstvu, kterou neprojde. Po ní pak putuje do strany, a kde tato hranice vychází na svah, vyvěrá voda na povrch.",
  },
  {
    q: "Které území patří do povodí Labe?",
    key: "Všechna místa, odkud voda stéká do Labe nebo do jeho přítoků.",
    ds: [
      ["Jen úzký pruh země podél obou břehů Labe.", "Povodí není pás u řeky. Sahá až tam, odkud voda po spádu doteče."],
      ["Jen místa, odkud voda teče přímo do Labe, přítoky se nepočítají.", "Voda z přítoku skončí v Labi také. Povodí proto zahrnuje i území všech přítoků."],
      ["Všechny kraje, kterými Labe na své cestě protéká.", "Hranice krajů vedou jinudy než hranice povodí. Rozhoduje spád terénu, ne správní členění."],
    ],
    h: [
      "Sleduj kapku deště kdekoli v krajině. Když nakonec skončí v Labi, patří to místo do jeho povodí?",
      "Povodí se neměří podle vzdálenosti od řeky, ale podle toho, kam voda odteče. Patří do něj i vzdálené hory, pokud z nich potok teče do říčky, ta do větší řeky a ta nakonec do Labe. Rozhoduje spád, ne vzdálenost.",
    ],
    ex: "Do povodí patří celé území, ze kterého voda po spádu doteče až do dané řeky — i přes několik menších toků. Proto je povodí velké řeky obrovská plocha.",
  },
  {
    q: "Kudy v krajině vede rozvodí mezi dvěma povodími?",
    key: "Po hřebenech a vyvýšeninách, odkud voda stéká na obě strany.",
    ds: [
      ["Dnem údolí, kde se obě povodí setkávají.", "V údolí naopak voda z obou svahů stéká k sobě, do jednoho toku."],
      ["Po státní hranici, protože každý stát má vlastní povodí.", "Hranice států vedou podle dohod lidí. Voda se řídí spádem terénu."],
      ["Prostředkem řeky, která obě povodí odděluje.", "Řeka leží uvnitř svého povodí. Neodděluje ho, naopak do sebe vodu sbírá."],
    ],
    h: [
      "Najdi v terénu místo, ze kterého voda nemůže stékat jen jedním směrem.",
      "Když stojíš na nejvyšším bodě hřbetu, déšť z jedné tvé strany odteče do jedné řeky a z druhé strany do jiné. Taková čára se proto drží vyvýšených míst a nikdy nevede dnem údolí, kde se voda naopak sbíhá.",
    ],
    ex: "Rozvodí sleduje nejvyšší místa terénu, protože právě odtud se voda rozbíhá na obě strany. Dno údolí je naopak místo, kde se voda slévá dohromady.",
  },
  {
    q: "Proč se v jezeře, ze kterého vytéká řeka, sůl nehromadí?",
    key: "Odtékající voda rozpuštěné soli průběžně odnáší pryč z jezera.",
    ds: [
      ["Sůl se v tekoucí vodě rozloží na neškodné látky.", "Sůl se ve vodě nerozkládá. Jen se spolu s vodou přesouvá dál."],
      ["Do takového jezera prší mnohem víc než do jezera bez odtoku.", "Množství srážek o tom nerozhoduje. Rozhoduje, jestli má voda kudy odejít."],
      ["Sůl klesne ke dnu a usadí se tam natrvalo jako kámen.", "Rozpuštěná sůl ke dnu neklesá. Odejde až s vodou, která z jezera odtéká."],
    ],
    h: [
      "Porovnej dvě jezera: z jednoho voda odtéká, z druhého jen mizí do vzduchu. V čem je pro rozpuštěné látky rozdíl?",
      "Výpar odnese jen čistou vodu a všechno rozpuštěné nechá na místě. Odtok naopak odvádí vodu i se vším, co je v ní rozpuštěno, takže se v jezeře nic nenahromadí a jeho voda zůstává sladká i po tisících letech.",
    ],
    ex: "O slanosti jezera rozhoduje to, kudy z něj voda odchází. Odtok odvádí vodu i rozpuštěné látky, takže se nic nehromadí; výpar odvádí jen vodu, a pak se látky hromadí.",
  },
  {
    q: "Co se stane s deštěm, který spadne na louku?",
    key: "Část se vsákne, část odteče po povrchu a část se vypaří.",
    ds: [
      ["Všechen se vsákne hluboko do půdy, po povrchu neodteče nic.", "Při vydatném dešti půda nestíhá nasávat a zbytek steče po povrchu."],
      ["Po povrchu steče všechen do potoka, do půdy se nevsákne nic.", "Louka není dlažba. Trávník a půda velkou část vody nasají."],
      ["Do vzduchu se ihned vypaří všechen, nic jiného se už neděje.", "Vypaří se jen část, a to postupně. Zbytek zůstane v půdě nebo odteče."],
    ],
    h: [
      "Zkus si představit, kolika různými cestami se kapka z louky může vydat dál.",
      "Déšť se na povrchu rozdělí. Jedna cesta vede dolů do půdy k podzemní vodě, druhá po spádu do potoka a třetí zpátky vzhůru do vzduchu. Poměr mezi nimi závisí na tom, jak je půda nasáklá a jak prudce prší.",
    ],
    ex: "Déšť se nikdy nevydá jen jednou cestou. Rozdělí se mezi vsak, povrchový odtok a výpar — a právě poměr mezi nimi rozhoduje o tom, jestli krajina vodu zadrží.",
  },
  {
    q: "Proč má řeka u ústí mnohem víc vody než u pramene?",
    key: "Cestou se do ní vlily přítoky a přibyla i voda z podzemí.",
    ds: [
      ["V nížině je koryto širší, takže se do něj vejde víc vody.", "Širší koryto vodu nevyrobí. Té přibylo cestou z jiných toků."],
      ["Na dolním toku prší mnohem víc než v horách.", "V horách prší obvykle víc než v nížině. Vody přesto po proudu přibývá, protože se sbírá z celého povodí."],
      ["Voda se u ústí vrací proti proudu zpátky z moře.", "Z moře se voda do řeky nevrací. V řece teče jedním směrem, k jejímu konci."],
    ],
    h: [
      "Co všechno se k řece cestou od hor do nížiny připojí?",
      "Řeka po cestě sbírá vodu z celého svého povodí: z obou stran přibírá potoky a říčky a navíc do jejího koryta prosakuje voda z okolních hornin. Proto je na konci toku mohutná, i když začínala jako nenápadná stružka.",
    ],
    ex: "Řeka roste tím, že sbírá vodu z celého povodí. Přibývá jí hlavně z menších toků, které se k ní připojují, a z horninového podloží.",
  },
  {
    q: "Proč oceán nepřeteče, i když do něj řeky nepřetržitě přitékají?",
    key: "Z jeho hladiny se stejné množství vody zase vypaří do vzduchu.",
    ds: [
      ["Voda z oceánu prosakuje dírami ve dně až do zemského jádra.", "Dno oceánu není děravé a k jádru voda neproniká. Voda odchází nahoru, ne dolů."],
      ["Řeky do oceánu přitékají jen občas, většinu roku vysychají.", "Velké řeky tečou celý rok. Přesto hladina oceánu zůstává zhruba stejná."],
      ["Oceán se opravdu pořád zvětšuje, jen je to příliš pomalé.", "Řeky za to nemohou: kolik vody přinesou, tolik se jí z hladiny zase vypaří. Hladina sice velmi pomalu stoupá, ale kvůli tání ledovců a oteplování moří, ne kvůli přítoku řek."],
    ],
    h: [
      "Řeky do oceánu vodu přidávají. Musí tedy existovat cesta, kterou se jí stejně tolik ztrácí. Kudy?",
      "Oceán je obrovská plocha vystavená slunci a větru. Každý den z ní odejde nahoru ohromné množství v podobě páry — právě tolik, kolik jí přinesou všechny řeky světa dohromady. Proto zůstává hladina stejná.",
    ],
    ex: "Koloběh je v rovnováze: kolik vody řeky do oceánu přinesou, tolik se jí z hladiny vypaří. Kdyby jedna strana převážila, hladina by stoupala, nebo klesala.",
  },
];

// ── L3 — analýza a přenos ────────────────────────────────────────────────
const BANKA_L3: Polozka[] = [
  {
    q: "V pouštní pánvi leží jezero. Přitéká do něj řeka, ale žádná z něj nevytéká. Jaká je jeho voda?",
    key: "Slaná, protože voda odchází jen výparem a soli se hromadí.",
    ds: [
      ["Sladká, protože do něj přitéká sladká voda z řeky.", "Řeka přináší i nepatrné množství rozpuštěných solí. Ty nemají kudy odejít a za tisíce let se nahromadí."],
      ["Sladká, protože slaná může být jen voda v moři a v oceánu.", "Slaná jezera existují. Rozhoduje, jestli z jezera něco odtéká, ne jestli je to moře."],
      ["Slaná, protože se do pánve dostává voda až z moře.", "Moře je odtud daleko a pod pevninou k němu cesta nevede. Soli přinesla řeka a odvést je nemá kdo."],
    ],
    h: [
      "Zjisti, kudy se z pánve voda ztrácí. Co si s sebou vezme a co tam nechá?",
      "Jediná cesta ven vede přes hladinu do vzduchu. Odejde tudy pouze čistá voda, všechno rozpuštěné zůstane a s každým dalším rokem toho přibývá. Stejně dopadne i polévka, kterou necháš příliš dlouho vařit.",
    ],
    ex: "Jezero bez odtoku ztrácí vodu jen výparem. Rozpuštěné látky, které do něj přitékající tok přinese, nemají kudy odejít, a proto se v jezeře postupně hromadí.",
  },
  {
    q: "Nad obcí vykáceli les a velkou plochu vydláždili. Jak se to projeví po velkém dešti?",
    key: "Voda odteče rychleji a povodňová vlna bude vyšší a přijde dřív.",
    ds: [
      ["Množství vody v potoce se nezmění, protože deště spadne stejně.", "Stejný déšť se z dlažby nevsákne. Odteče rychleji, takže vlna je vyšší i dřívější."],
      ["Voda odteče pomaleji, protože ji dlažba zadrží na místě.", "Dlažba vodu nevsaje ani nezadrží. Po hladkém povrchu steče rychleji než po lesní půdě."],
      ["Potok po dešti vyschne, protože se všechna voda vsákne do dlažby.", "Dlažba je nepropustná, skrz ni se vsákne jen málo. Voda proto zamíří do potoka."],
    ],
    h: [
      "Porovnej, co udělá déšť s lesní půdou a co s dlažbou. Kolik vody se v obou případech vsákne?",
      "Lesní půda a kořeny fungují jako houba: vodu pohltí a pak ji pomalu uvolňují. Dlažba nepohltí nic, takže celý déšť sklouzne do potoka během chvíle. Nemění se objem srážek, mění se rychlost a načasování odtoku.",
    ],
    ex: "O povodni nerozhoduje jen množství deště, ale i povrch povodí. Les a půda vodu zadrží a pouštějí ji pomalu, dlažba ji odvede naráz — a v korytě se pak sejde všechna najednou.",
  },
  {
    q: "V kraji vysušili mokřady a potoky narovnali do přímých koryt. Co udělá hladina podzemní vody?",
    key: "Klesne, protože voda z krajiny rychle odteče a nestihne se vsáknout.",
    ds: [
      ["Stoupne, protože z vysušeného mokřadu voda prosákne hlouběji.", "Vysušený mokřad už žádnou vodu nezadrží. Prosakovat nemá co."],
      ["Nezmění se, protože podzemní voda s povrchem nijak nesouvisí.", "Zásoba pod zemí se doplňuje právě ze srážek z povrchu. Souvislost je přímá."],
      ["Stoupne, protože narovnaný potok pojme mnohem víc vody.", "Narovnaný potok vodu rychleji odvede pryč. V krajině jí proto zůstane míň."],
    ],
    h: [
      "Zamysli se, co dělá mokřad a klikatý potok s vodou — zdržují ji, nebo pouštějí dál?",
      "Voda pod zemí se doplňuje jen tam, kde voda na povrchu zůstane dost dlouho na to, aby stihla prosáknout. Mokřad i klikaté koryto ji zdržují, kdežto rovný kanál ji odvede pryč během několika hodin.",
    ],
    ex: "Mokřady a meandry fungují jako zásobárna: drží vodu na místě, dokud se nevsákne. Když je zrušíme, voda z krajiny zmizí rychle a zásoba pod zemí se nestačí doplňovat.",
  },
  {
    q: "Z řeky, která je jediným přítokem velkého jezera, začali brát vodu na závlahy polí. Co bude s jezerem?",
    key: "Bude se zmenšovat a hladina klesne, protože přítok zeslábl.",
    ds: [
      ["Nic se nezmění, jezero si vodu doplní z dešťů nad hladinou.", "Déšť nad hladinou úbytek nevyrovná. Velké jezero drží hladinu hlavně díky tomu, co do něj přiteče — a toho teď přitéká míň."],
      ["Hladina stoupne, protože se voda z polí vrátí zpátky do jezera.", "Většinu vody na poli spotřebují rostliny nebo se vypaří. Zpátky se vrátí jen zlomek."],
      ["Vyschne během jediné sezóny, protože přítok se úplně zastavil.", "Odběr část vody v řece ponechá. Jezero proto mizí postupně, ne během jedné sezóny."],
    ],
    h: [
      "Jezero je jako vana: něco do ní přitéká, něco se z ní ztrácí. Co se stane, když přítok ubereš?",
      "Do jezera míří jediný tok a z hladiny se přitom neustále vypařuje voda. Dokud jsou obě množství v rovnováze, hladina drží na stejné výšce. Jakmile se přísun zmenší, výpar začne převažovat a rovnováha se poruší.",
    ],
    ex: "Hladina jezera je výsledkem rovnováhy mezi přítokem a výparem. Odběr vody z jediného zdroje tuto rovnováhu poruší, takže jezero rok po roce ustupuje.",
  },
  {
    q: "Vrt ukáže, že je pod povrchem nejdřív vrstva písku a pod ní vrstva jílu. Kde se drží voda?",
    key: "V písku nad jílem, protože jíl ji dál dolů nepustí.",
    ds: [
      ["V jílu pod pískem, protože jíl vodu nasákne a udrží ji.", "Jíl vodu sice nasákne, ale dál ji nepustí a zpátky ji nevydá. Čerpat se dá jen z písku nad ním, kde voda volně protéká mezerami mezi zrnky."],
      ["Pod jílem, kam voda oběma vrstvami propadne až dolů.", "Skrz jíl voda neprojde. Zastaví se na jeho povrchu."],
      ["Nikde, protože v takových vrstvách se voda vůbec neudrží.", "Hrubá hornina vodu velmi dobře drží v mezerách mezi zrnky. Proto se z ní čerpá."],
    ],
    h: [
      "Rozděl si obě vrstvy podle toho, jestli jimi voda projde, nebo ne. Kde se její cesta zastaví?",
      "Voda prosakuje shora dolů, dokud může. Mezi zrnky hrubé horniny jsou velké mezery, kudy proteče snadno, kdežto jílové částice jsou tak jemné, že mezi nimi voda neprojde. Tam, kde se cesta uzavře, se voda nahromadí.",
    ],
    ex: "Voda se zastaví na rozhraní propustné a nepropustné vrstvy. Nad nepropustným podložím se proto tvoří zásoba, ze které se dá čerpat; hlouběji už voda nepronikne.",
  },
  {
    q: "Tok se každý rok na jaře prudce zvedne a v létě zeslábne. Čím to nejspíš je?",
    key: "Na jaře v jeho povodí taje sníh a voda z něj steče do koryta.",
    ds: [
      ["Na jaře je Země blíž Slunci, a tak je v řekách víc vody.", "Vzdálenost Země od Slunce s množstvím vody v řece nesouvisí — a Zemi je Slunci nejblíž dokonce v lednu, ne na jaře. Vodu přidá tající sníh."],
      ["Na jaře se pod zemí otevřou dutiny, ze kterých vyteče voda.", "Podzemní dutiny se neotvírají podle ročních dob. Pravidelnost napovídá něco jiného."],
      ["Na jaře se voda v korytě roztáhne teplem a zabere víc místa.", "Teplem se voda roztáhne jen nepatrně. Prudké zvednutí hladiny to nevysvětlí."],
    ],
    h: [
      "Pravidelnost je vodítko: co se v povodí děje každý rok ve stejnou dobu?",
      "Přes zimu se v horách hromadí srážky v pevném skupenství. Na jaře se celá ta zásoba během několika týdnů uvolní najednou a projde korytem, kdežto v létě už žádná nezbývá, a tak tok zeslábne.",
    ],
    ex: "Pravidelný jarní vzestup a letní pokles prozrazuje zásobu, která se přes zimu hromadí a na jaře se naráz uvolní. Takový režim mají toky pramenící v horách.",
  },
  {
    q: "Které tvrzení o jezeře, ze kterého vytéká řeka, NEplatí?",
    key: "Soli se v něm postupně hromadí, až se voda stane slanou.",
    ds: [
      ["Do jezera voda přitéká a zhruba stejné množství z něj odtéká.", "To o takovém jezeře platí — proto se hladina drží zhruba na stejné výšce."],
      ["Rozpuštěné látky odnáší odtékající voda dál po proudu.", "To platí. Právě proto se v jezeře nic nenahromadí."],
      ["Voda v něm zůstává sladká, i když do něj látky stále přitékají.", "To platí. Rozpuštěné látky odcházejí s odtokem, takže jich nepřibývá."],
    ],
    h: [
      "Tři tvrzení popisují jezero s odtokem správně, jedno ne. Ptej se, co všechno z jezera odchází.",
      "Když z jezera voda odtéká, bere s sebou i všechno, co je v ní rozpuštěno. Hledej tvrzení, které tuhle cestu ven přehlíží a mluví o jezeře tak, jako by z něj vůbec nic neodcházelo.",
    ],
    ex: "Jezero s odtokem je průtočné: co do něj přiteče, to z něj zase odteče — včetně rozpuštěných látek. Hromadit se může jen tam, kde odtok chybí.",
  },
  {
    q: "Které tvrzení o podzemní vodě NEplatí?",
    key: "Teče pod zemí ve velkých podzemních řekách a jezerech.",
    ds: [
      ["Doplňuje se hlavně ze srážek, které se vsáknou do půdy.", "To platí. Bez deště a tání sněhu by se zásoba nedoplnila."],
      ["Zastaví se nad nepropustnou vrstvou, například nad jílem.", "To platí. Právě proto se nad jílem tvoří zásoba, ze které se čerpá."],
      ["Vyplňuje drobné mezery a pukliny mezi zrnky horniny.", "To platí. Voda je v hornině rozptýlená podobně jako v nasáklé houbě."],
    ],
    h: [
      "Tři tvrzení jsou správná. Rozmysli si, odkud se voda pod zemí bere a co ji zastaví.",
      "Rozptýlená vrstva nasáklé horniny se chová úplně jinak než volná dutina pod povrchem. A právě volná dutina je v přírodě vzácná výjimka — potkáš ji hlavně ve vápencových jeskyních, ne pod běžnou loukou.",
    ],
    ex: "Představa souvislých toků a nádrží pod povrchem pochází z jeskyní a z pohádek. Skoro všude jinde voda vyplňuje jen drobné mezery mezi zrnky a trhliny v hornině.",
  },
  {
    q: "Turista najde v horách místo, kde ze skály vytéká čistá voda a dál pokračuje jako potůček. Co to je?",
    key: "pramen, tedy místo, kde podzemní voda vystupuje na povrch",
    ds: [
      ["ústí, tedy místo, kde vodní tok končí a vlévá se jinam", "Voda tu teprve začíná téct. Konec toku je odtud ještě hodně daleko."],
      ["soutok, tedy místo, kde se spojí dva vodní toky v jeden", "Přitéká jen jeden tok, a to zevnitř skály. Dva toky se tu nesbíhají."],
      ["rozvodí, tedy hranice mezi dvěma sousedními povodími", "Rozvodí je čára po hřebenech, ne konkrétní místo, kde vytéká voda."],
    ],
    h: [
      "Ptej se, jestli voda na tom místě teče dál, nebo tam končí, a odkud se tam vzala.",
      "Voda se dostala pod povrch jako déšť, prosákla horninou a narazila na vrstvu, která ji nepustila dál. Po ní pak putovala stranou, až vyšla ven na svahu — a odtud teprve začíná její cesta po povrchu krajiny.",
    ],
    ex: "Znaky jsou jednoznačné: voda vychází z horniny a od toho místa teče dál. To je popis začátku toku, ne jeho konce ani hranice povodí.",
  },
  {
    q: "Z jednoho pohoří stéká voda na jednu stranu k Severnímu moři a na druhou k Černému moři. Co tvoří?",
    key: "rozvodí mezi dvěma povodími",
    ds: [
      ["povodí obou moří dohromady", "Povodí je plocha, ze které voda stéká do jednoho toku. Tady jsou plochy dvě."],
      ["soutok dvou velkých řek", "Soutok je místo, kde se toky spojují. Tady se voda naopak rozděluje."],
      ["společné ústí dvou řek", "Ústí je místo, kde jeden tok končí a vlévá se do jiné vody — tam se voda spojuje. Tady se naopak rozděluje a míří do dvou různých moří."],
    ],
    h: [
      "Voda se na hřebeni rozděluje a od té chvíle míří do dvou různých moří. Jak se taková čára jmenuje?",
      "Každé moře si sbírá vodu ze svého území. Tam, kde se tato území potkávají, vede čára, od níž voda odtéká na obě strany do jiné soustavy toků. Bývá to právě hřeben pohoří, protože z něj voda stéká na obě strany.",
    ],
    ex: "Pohoří, ze kterého voda odtéká do dvou různých moří, leží na hranici dvou sběrných území. Taková hranice se drží hřebenů, protože odtud se voda rozbíhá na obě strany.",
  },
  {
    q: "Obec vybírá pozemek pro novou studnu. Který je nejvhodnější?",
    key: "Ten, kde je pod povrchem vrstva štěrku nad nepropustným jílem.",
    ds: [
      ["Ten, kde je až hluboko dolů celistvá žula bez jediné pukliny.", "Celistvá hornina bez puklin vodu nepojme. Není odkud ji nabrat."],
      ["Ten, který je celý vydlážděný, aby do studny nenateklo bahno.", "Dlažba brání vsakování, takže se zásoba pod ní nedoplňuje."],
      ["Ten, který leží nejvýš na kopci, aby voda tekla sama dolů.", "Na vrcholu kopce bývá hladina vody v hornině nejhlouběji. Odshora do studny nic netlačí."],
    ],
    h: [
      "Studna potřebuje dvě věci: horninu, která vodu pojme, a pod ní něco, co ji nepustí dál.",
      "Dobrá zásoba vzniká tam, kde je nahoře hrubá hornina s velkými mezerami a pod ní jemná vrstva, přes kterou voda neprojde. Voda se v té hrubé vrstvě nashromáždí a dá se z ní po celý rok čerpat.",
    ],
    ex: "Studna potřebuje propustnou vrstvu, ve které se voda drží, a pod ní nepropustné podloží, které ji zadrží. Bez jednoho i druhého zůstane suchá.",
  },
  {
    q: "Dvě sklenice: v jedné mořská voda, ve druhé dešťová. Obě necháme vypařit. Co v nich zůstane?",
    key: "V jedné bílý slaný povlak, ve druhé skoro nic.",
    ds: [
      ["V obou bílý slaný povlak, protože v každé vodě je sůl.", "Dešťová voda je sladká. Sůl zůstala v moři už při vypařování."],
      ["V obou skoro nic, protože sůl se vypaří spolu s vodou.", "Sůl se nevypařuje. Do vzduchu se zvedne pouze voda."],
      ["V jedné zůstane voda, protože slaná voda se nevypařuje.", "Vypařuje se i slaná voda. Vypaří se z ní ale právě jen ta voda."],
    ],
    h: [
      "Rozmysli si zvlášť, co je v každé sklenici rozpuštěno a jestli se to dokáže vypařit.",
      "Vypařováním se z nádoby zvedne pouze voda. Cokoli v ní bylo rozpuštěno, zůstane na dně jako suchý zbytek. Porovnej tedy, co bylo rozpuštěno v mořské vodě a co ve vodě, která spadla z mraku.",
    ],
    ex: "Pokus ukazuje celý princip koloběhu: vypařuje se jen voda, rozpuštěné látky zůstávají. Proto je srážková voda sladká a proto se v bezodtokých jezerech hromadí sůl.",
  },
  {
    q: "Řeka vytvořila široké zákruty a navršila z písku ostrovy uprostřed koryta. Kde na toku se to děje?",
    key: "Na dolním toku, kde voda teče pomalu a materiál ukládá.",
    ds: [
      ["Na horním toku, kde voda teče nejrychleji a nejprudčeji.", "Rychlá voda materiál unáší dál. Ukládá ho až voda pomalá."],
      ["U pramene, kde voda teprve vyvěrá ze skály na povrch.", "Na začátku toku je vody málo a koryto je úzké. Zákruty ani ostrovy tam nevzniknou."],
      ["Na rozvodí, kde se od sebe oddělují dvě sousední povodí.", "Rozvodí je hřeben, kudy žádná řeka neteče. Ostrovy tam vzniknout nemohou."],
    ],
    h: [
      "Zákruty i písečné nánosy vznikají tam, kde proud něco pokládá. Kdy to dokáže?",
      "Řeka unáší písek jen do chvíle, dokud teče dost rychle. Jakmile se sklon zmenší a proud zpomalí, zrnka klesnou ke dnu — nejdřív při vnitřní straně zákrutu a nakonec se nánosy objeví i uprostřed koryta.",
    ],
    ex: "Zákruty a písečné nánosy jsou známkou pomalé vody na malém spádu. Rychlá voda by materiál odnesla dál, teprve zpomalený proud ho odloží.",
  },
  {
    q: "Nad vesnicí, která bere vodu ze studní, začal sedlák silně hnojit pole. Co vesnici hrozí?",
    key: "Hnojivo se vsákne se srážkami a znečistí podzemní vodu.",
    ds: [
      ["Nic, protože půda všechny látky spolehlivě zachytí.", "Půda zachytí jen část. Zbytek propustí dolů spolu s vodou."],
      ["Nic, protože voda pod zemí s povrchem vůbec nesouvisí.", "Zásoba pod zemí se doplňuje právě vsakem z povrchu. Souvislost je přímá."],
      ["Studny vyschnou, protože hnojivo vodu v půdě spotřebuje.", "Hnojivo vodu nespotřebuje. Nebezpečí je v tom, co se s vodou dostane dolů."],
    ],
    h: [
      "Sleduj cestu deště z pole dolů. Co si s sebou po cestě vezme?",
      "Déšť na poli rozpustí část hnojiva a odnese ji s sebou do hloubky. Cesta vede stejnou propustnou vrstvou, ze které se ve vesnici čerpá, a proto se tam může dostat i to, co v pitné vodě být nemá.",
    ],
    ex: "Vsak nefunguje jen pro čistou vodu: co se na povrchu rozpustí, putuje dolů s ní. Proto se kolem zdrojů pitné vody vyhlašují ochranná pásma s omezením hnojení.",
  },
];

/** Rotace s náhodným začátkem: v jedné sadě se položka neopakuje, mezi sezeními se sada liší. */
function rotace<T>(seznam: T[]): () => T {
  let i = Math.floor(Math.random() * seznam.length);
  return () => seznam[i++ % seznam.length];
}

function gen(level: number): PracticeTask[] {
  const banka = level === 1 ? BANKA_L1 : level === 2 ? BANKA_L2 : BANKA_L3;
  const dalsi = rotace(banka);
  return ruzneUlohy(() => losUlohy(() => uloha(dalsi())));
}

// ── Topic ────────────────────────────────────────────────────────────────
export const HYDROSFERA_VODA_NA_ZEMI: TopicMetadata[] = [
  {
    id: "g6-zem-hydrosfera-voda-na-zemi-6",
    rvpNodeId:
      "g6-zemepis-prirodni-obraz-zeme-krajinne-sfery-hydrosfera-oceany-reky-jezera-podzemni-voda",
    displayName: "Voda na Zemi a její koloběh",
    title: "Hydrosféra - oceány, řeky, jezera, podzemní voda",
    studentTitle: "Voda na Zemi",
    subject: "zemepis",
    category: "Přírodní obraz Země",
    topic: "Krajinné sféry",
    briefDescription: "Poznáš oceány, řeky, jezera i vodu ukrytou pod zemí.",
    keywords: [
      "hydrosféra", "oceán", "moře", "řeka", "jezero", "ledovec", "podzemní voda",
      "pramen", "ústí", "přítok", "povodí", "rozvodí", "koloběh vody", "výpar",
      "srážky", "studna", "propustná vrstva", "nepropustná vrstva", "povodeň",
    ],
    goals: [
      "Vyjmenovat, kde je na Zemi jaká voda a která zásoba je největší.",
      "Rozlišit pramen, ústí, přítok, povodí a rozvodí a použít je na konkrétní situaci.",
      "Odvodit z popisu místa, jaká tam bude voda a co s ní udělá zásah v povodí.",
    ],
    boundaries: [
      "Bez map a obrázků — všechno se popisuje slovy.",
      "Čísla jen zaokrouhlená a nesporná (podíly vody, ne délky řek na kilometr).",
      "Počet oceánů se nepoužívá jako klíč (zdroje se liší kvůli Jižnímu oceánu).",
      "Podzemní voda se bere zjednodušeně: propustná vrstva nad nepropustnou.",
      "Bez chemického složení mořské vody a bez pojmu artéská studna.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Většina vody na Zemi je slaná v oceánech, většina sladké je zmrzlá v ledovcích. Tok má pramen, horní, střední a dolní část a ústí. Povodí je plocha, rozvodí čára na jejím okraji.",
      steps: [
        "U rozložení vody se ptej, jestli jde o všechnu vodu, o sladkou vodu, nebo o povrch Země.",
        "U částí toku si představ cestu vody od začátku ke konci a strany urči po proudu.",
        "U podzemní vody se ptej, kterou vrstvou voda projde a která ji zastaví.",
      ],
      commonMistake: "Myslet si, že nejvíc sladké vody je v řekách a jezerech, nebo si podzemní vodu představovat jako podzemní řeku.",
      example: "Jezero bez odtoku v suchém kraji je slané: voda odchází jen výparem a soli zůstávají.",
    },
  },
];
