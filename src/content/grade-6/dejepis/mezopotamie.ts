/**
 * Dějepis 6. ročník — Mezopotámie: Sumer, Babylonie, Asýrie, klínové písmo (select_one).
 *
 * Faktický vzor (periodizaceLetopocet / coJeDejepis): pevné banky úloh, každá
 * s vlastní malou i velkou nápovědou, vysvětlením PROČ a optionFeedback.
 * Úloha se vybírá deterministicky (celá banka zamíchaná), takže na každé úrovni
 * je vždy ≥ 14 různých úloh.
 *
 * Chybový model — každý distraktor je jeden typický omyl:
 *  1. záměna Mezopotámie s Egyptem (papyrus, hieroglyfy, Nil, pyramida, faraon);
 *  2. záměna mezopotámských států mezi sebou (Chammurapi × Aššurbanipal,
 *     Ninive × Babylon, Sumerové × Babyloňané jako vynálezci písma);
 *  3. záměna funkce podle tvaru (zikkurat = hrobka, zákoník = epos, písmo kvůli básním);
 *  4. anachronismus (inkoust a papír, „klínové“ = obrázky klínů, tresty pro všechny stejné).
 *
 *  • L1 — zapamatování: pojem → fakt (jedna informace).
 *  • L2 — použití: popis situace nebo souboru znaků → civilizace / pojem / předmět.
 *  • L3 — analýza: úryvek pramene, příčina, chybný výrok, odvození z nálezu.
 *
 * Rozšiřující fakta (rozluštění písma, Akkad a Sargon, přesné roky) na klíč nejdou.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pickN, buildChoiceTask as choice } from "./_shared";

interface Uloha {
  q: string;
  key: string;
  d: [string, string][];
  hints: [string, string];
  explanation: string;
}

const build = (u: Uloha): PracticeTask =>
  choice(u.q, u.key, u.d.map(([value, why]) => ({ value, why })), {
    hints: u.hints,
    explanation: u.explanation,
  });

// ── L1 — zapamatování ──────────────────────────────────────────────────────
const L1: Uloha[] = [
  {
    q: "Mezi kterými dvěma řekami ležela Mezopotámie?",
    key: "Eufrat a Tigris",
    d: [
      ["Nil a Tigris", "Nil je řeka Egypta. Mezopotámie znamená „země mezi řekami“ a obě její řeky tečou dnešním Irákem."],
      ["Nil a Eufrat", "Nil patří Egyptu, ne Mezopotámii. Eufrat sedí, ale druhá řeka Mezopotámie je jiná."],
      ["Indus a Ganga", "Indus a Ganga jsou řeky Indie a Pákistánu. U Indu vznikla jiná starověká civilizace."],
    ],
    hints: [
      "Samotný název Mezopotámie znamená „země mezi řekami“. Hledej dvojici řek, které tečou dnešním Irákem.",
      "Egyptská civilizace vyrostla u Nilu a indická u Indu. Mezopotámie leží v Předním východě a její dvě řeky se na jihu stékají, než dotečou do Perského zálivu.",
    ],
    explanation: "Mezopotámie (řecky „země mezi řekami“) ležela mezi Eufratem a Tigridem. Nil je řeka Egypta, Indus a Ganga jsou řeky Indie.",
  },
  {
    q: "Na co psali Sumerové své záznamy?",
    key: "Na hliněné tabulky",
    d: [
      ["Na papyrusové svitky", "To patří Egyptu. V Mezopotámii papyrus v takovém množství nerostl, psalo se do hlíny."],
      ["Na papírové listy", "Papír vznikl až o tisíce let později v Číně. Sumerové ho neznali."],
      ["Na voskové destičky", "Voskové destičky se rozšířily až mnohem později, znali je Asyřané, Řekové i Římané. Sumerové psali do hlíny, které měli u řek dost."],
    ],
    hints: [
      "Mysli na to, jaký materiál ležel u Eufratu a Tigridu všude kolem v obrovském množství.",
      "Kámen, dřevo ani papyrus tam skoro nebyly. Na psaní použili Sumerové totéž, z čeho stavěli domy, a popsaný kus pak nechali vyschnout na slunci.",
    ],
    explanation: "Sumerové psali do vlhkých hliněných tabulek, protože hlíny bylo u řek dost. Papyrus je egyptská psací látka, papír a vosk přišly až mnohem později.",
  },
  {
    q: "Čím psali písaři v Mezopotámii?",
    key: "Rákosovým rydlem",
    d: [
      ["Štětcem s inkoustem", "Inkoustem a štětcem se psalo na papyrus v Egyptě. Do hlíny se znaky vtlačovaly."],
      ["Husím brkem", "Husí brk je psací náčiní středověku. V Mezopotámii se do hlíny tlačilo seříznutým stéblem."],
      ["Kamenným dlátem", "Dlátem se tesalo do kamene, třeba zákony na sloup. Do měkké hlíny se znaky nevysekávaly, ale vtlačovaly."],
    ],
    hints: [
      "Písař nepsal na papír, ale do měkkého materiálu. Potřeboval tedy nástroj, kterým se dá tlačit.",
      "U řek rostla vysoká tráva s pevnými stébly. Její seříznutý konec se vtiskl do vlhké hlíny a zanechal otisk. Inkoust ani barva k tomu nebyly potřeba.",
    ],
    explanation: "Písaři psali rákosovým rydlem — seříznutým stéblem rákosu, které vtlačovali do vlhké hlíny. Štětec s inkoustem patří Egyptu, brk středověku a dláto kameníkům, kteří tesali do kamene.",
  },
  {
    q: "Jak se jmenuje stupňovitá chrámová stavba v Mezopotámii?",
    key: "Zikkurat",
    d: [
      ["Pyramida", "Pyramida je egyptská hrobka faraona. Mezopotámská stupňovitá stavba byla chrám, ne hrobka."],
      ["Obelisk", "Obelisk je vysoký kamenný sloup z Egypta, ne stavba s terasami."],
      ["Sfinga", "Sfinga je egyptská kamenná socha lva s lidskou hlavou, ne chrám s terasami."],
    ],
    hints: [
      "Stavba měla několik teras nad sebou a nahoře svatyni boha. Nebyla to hrobka.",
      "Hrobku ve tvaru jehlanu stavěli Egypťané, kamenný sloup a sochu lva s lidskou hlavou také oni. Hledáš název mezopotámské stavby z cihel, která měla stupně jako obří schodiště.",
    ],
    explanation: "Zikkurat byl stupňovitý chrám z cihel, na jehož vrcholu stála svatyně boha. Pyramida byla naopak egyptská hrobka, obelisk egyptský sloup a sfinga egyptská socha.",
  },
  {
    q: "Který babylonský král dal sepsat slavný zákoník?",
    key: "Chammurapi",
    d: [
      ["Aššurbanipal", "Aššurbanipal byl asyrský král, proslavil se knihovnou, ne zákoníkem."],
      ["Nabukadnezar II.", "Nabukadnezar II. byl sice babylonský král, ale žil o víc než tisíc let později a proslavil se stavbami Babylonu."],
      ["Ramesse II.", "Ramesse II. byl egyptský faraon, ne babylonský král."],
    ],
    hints: [
      "Zákoník je starší než slavné stavby Babylonu. Jeho autor vládl asi v 18. století př. n. l.",
      "Vyřaď nejdřív panovníka, který nevládl v Babylonii vůbec, a pak asyrského krále s knihovnou. Ze dvou babylonských králů hledej toho staršího, který Mezopotámii sjednotil.",
    ],
    explanation: "Zákoník dal vytesat babylonský král Chammurapi (asi 18. st. př. n. l.). Aššurbanipal byl asyrský král s knihovnou, Nabukadnezar II. stavěl Babylon mnohem později a Ramesse II. byl faraon.",
  },
  {
    q: "Které město bylo hlavním městem Asýrie v době jejího největšího rozmachu?",
    key: "Ninive",
    d: [
      ["Babylon", "Babylon bylo hlavní město Babylonie, sousední a soupeřící říše."],
      ["Ur", "Ur byl sumerský městský stát na jihu Mezopotámie, ne asyrská metropole."],
      ["Théby", "Théby byly město v Egyptě u Nilu."],
    ],
    hints: [
      "Asýrie ležela na severu Mezopotámie, na řece Tigris.",
      "Jedno z nabízených měst je egyptské, jedno je starý sumerský stát na jihu a jedno je centrum Babylonie. Asyrská metropole ležela na severu a byla v ní uložená i slavná královská knihovna.",
    ],
    explanation: "Hlavním městem Asýrie v době největší moci (7. st. př. n. l.) bylo Ninive na Tigridu. Dříve sídlili asyrští králové v jiných městech. Babylon byl centrem Babylonie, Ur sumerským městským státem a Théby ležely v Egyptě.",
  },
  {
    q: "Který asyrský král založil velkou knihovnu hliněných tabulek?",
    key: "Aššurbanipal",
    d: [
      ["Chammurapi", "Chammurapi byl babylonský král, proslavil se zákoníkem, ne knihovnou."],
      ["Gilgameš", "Gilgameš byl král Uruku a hrdina eposu, ne asyrský král."],
      ["Nabukadnezar II.", "Nabukadnezar II. byl babylonský král, známý stavbami Babylonu."],
    ],
    hints: [
      "Knihovna stála v asyrském hlavním městě Ninive. Který z panovníků byl Asyřan?",
      "Jeden z nabízených je hrdina nejstaršího eposu, dva jsou babylonští králové — ten se zákoníkem a ten, který přestavěl Babylon. Zbývá poslední velký asyrský vládce, který dal sbírat tabulky z celé říše.",
    ],
    explanation: "Knihovnu v Ninive založil asyrský král Aššurbanipal. Chammurapi a Nabukadnezar II. byli babylonští králové, Gilgameš hrdina eposu z Uruku.",
  },
  {
    q: "Jak se jmenuje nejstarší dochovaný epos z Mezopotámie?",
    key: "Epos o Gilgamešovi",
    d: [
      ["Chammurapiho zákoník", "Zákoník je sbírka zákonů a trestů, ne příběh o hrdinovi."],
      ["Homérova Iliada", "Iliada je řecký epos, mnohem mladší a z jiné části světa."],
      ["Kniha mrtvých", "Kniha mrtvých je egyptský soubor textů pro posmrtný život, ne mezopotámský epos."],
    ],
    hints: [
      "Epos je dlouhý veršovaný příběh o hrdinovi. Hledej text, který vypráví, ne text, který přikazuje.",
      "Vyřaď sbírku zákonů, řecký text a egyptské texty pro posmrtný život. Mezopotámský epos vypráví o králi Uruku, který hledal nesmrtelnost.",
    ],
    explanation: "Nejstarším dochovaným eposem je Epos o Gilgamešovi o králi Uruku, který hledá nesmrtelnost. Chammurapiho zákoník je sbírka zákonů, Iliada řecký epos a Kniha mrtvých egyptské texty.",
  },
  {
    q: "Jak se v Mezopotámii nazýval člověk, který uměl psát a vedl záznamy?",
    key: "Písař",
    d: [
      ["Faraon", "Faraon byl vládce Egypta, ne mezopotámský zapisovatel."],
      ["Kupec", "Kupec obchodoval. Záznamy o jeho obchodech za něj psal někdo, kdo se psaní dlouhé roky učil."],
      ["Voják", "Voják bojoval ve vojsku. Psát uměla jen malá skupina vyškolených lidí."],
    ],
    hints: [
      "Psaní klínovým písmem se učilo dlouhé roky ve škole při chrámu. Jak se říkalo tomu, kdo je ovládal?",
      "Jedna z možností je egyptský vládce, dvě jsou obyčejná povolání, která psaní nepotřebovala. Hledej úřední povolání, jehož náplní bylo zapisovat zásoby, daně a smlouvy.",
    ],
    explanation: "Zapisovat a počítat uměl písař. Psaní se učil léta ve škole a vedl záznamy o zásobách, daních i smlouvách. Faraon vládl Egyptu, kupec a voják psát většinou neuměli.",
  },
  {
    q: "Ve kterém městě stály podle tradice slavné visuté zahrady?",
    key: "V Babylonu",
    d: [
      ["V Uru", "Ur byl starý sumerský městský stát. Visuté zahrady se připisují až mnohem pozdějšímu městu."],
      ["V Uruku", "Uruk je město krále Gilgameše, visuté zahrady se s ním nespojují."],
      ["V Thébách", "Théby leží v Egyptě, visuté zahrady patří Mezopotámii."],
    ],
    hints: [
      "Visuté zahrady patří mezi sedm divů starověkého světa a spojují se s králem Nabukadnezarem II.",
      "Egyptské město vyřaď a dva staré sumerské městské státy také. Hledej sídlo krále, který přestavěl město s Ištařinou bránou.",
    ],
    explanation: "Visuté zahrady, jeden ze sedmi divů světa, se připisují Babylonu za krále Nabukadnezara II. Ur a Uruk byly sumerské městské státy, Théby egyptské město.",
  },
  {
    q: "Ve které dnešní zemi leží většina území staré Mezopotámie?",
    key: "V Iráku",
    d: [
      ["V Egyptě", "Egypt byla jiná starověká civilizace u Nilu, v Africe."],
      ["V Íránu", "Írán je soused, leží víc na východ v horách. Rovina mezi řekami je hlavně na území sousední země."],
      ["V Řecku", "Řecko leží v Evropě, daleko od Eufratu a Tigridu."],
    ],
    hints: [
      "Najdi si na mapě řeky Eufrat a Tigris. Kterou dnešní zemí tečou nejdéle?",
      "Egypt je v Africe, Řecko v Evropě. Z dvou asijských sousedů hledej ten, jehož hlavní město Bagdád leží přímo na Tigridu — horská země na východ od něj to není.",
    ],
    explanation: "Většina Mezopotámie leží v dnešním Iráku (Bagdád stojí na Tigridu). Írán je východní soused, Egypt a Řecko leží úplně jinde.",
  },
  {
    q: "Který národ zavedl počítání v šedesátkové soustavě?",
    key: "Sumerové",
    d: [
      ["Egypťané", "Egypťané počítali po desítkách. Šedesátkovou soustavu zavedli první obyvatelé jižní Mezopotámie."],
      ["Řekové", "Řekové šedesátky převzali až od Mezopotámie, nezavedli je."],
      ["Féničané", "Féničané se proslavili hláskovým písmem (abecedou), ne šedesátkovou soustavou."],
    ],
    hints: [
      "Šedesátková soustava vznikla v Mezopotámii. Který z národů v nabídce tam žil?",
      "Egypťané žili u Nilu, Řekové v Evropě a Féničané na pobřeží Středozemního moře. Hledej nejstarší obyvatele jižní Mezopotámie, kteří založili městské státy Ur a Uruk.",
    ],
    explanation: "Počítání po šedesáti zavedli Sumerové. Díky nim má hodina šedesát minut. Egypťané počítali po desítkách, Řekové soustavu převzali a Féničané jsou známí písmem.",
  },
  {
    q: "Jakým písmem psali Sumerové?",
    key: "Klínovým písmem",
    d: [
      ["Hieroglyfickým písmem", "Hieroglyfy jsou písmo Egypta, psalo se na papyrus a tesalo do kamene."],
      ["Latinským písmem", "Latinku používali až Římané, tisíce let po Sumerech."],
      ["Řeckým písmem", "Řecké písmo vzniklo až v 1. tisíciletí př. n. l. v Řecku."],
    ],
    hints: [
      "Znaky se tlačily seříznutým stéblem do hlíny. Jaký tvar má takový otisk?",
      "Hieroglyfy jsou egyptské, latinka římská a řecké písmo je z Evropy. Otisk rydla v hlíně je na jednom konci široký a na druhém úzký, jako když zatlučeš klínek do dřeva.",
    ],
    explanation: "Sumerové psali klínovým písmem. Rydlo v hlíně zanechávalo otisky ve tvaru klínků. Hieroglyfy jsou egyptské, latinka římská a řecké písmo řecké.",
  },
  {
    q: "Kdo vytvořil v Mezopotámii první městské státy, například Ur a Uruk?",
    key: "Sumerové",
    d: [
      ["Asyřané", "Asyřané přišli až později a vytvořili válečnou říši na severu."],
      ["Babyloňané", "Babylonie vznikla později. Ur a Uruk už v té době byly staré."],
      ["Egypťané", "Egypťané žili u Nilu, ne v Mezopotámii."],
    ],
    hints: [
      "Ur a Uruk leží na jihu Mezopotámie a patří k nejstarším městům světa. Kdo tam žil jako první?",
      "Asyřané a Babyloňané vytvořili své říše až později a Egypťané žili v Africe. Hledej národ, který tu byl první a vymyslel i klínové písmo.",
    ],
    explanation: "První městské státy Ur a Uruk založili Sumerové na jihu Mezopotámie. Babylonie a Asýrie vznikly později a Egypt ležel u Nilu.",
  },
  {
    q: "Jak se jmenoval král Uruku, hrdina nejstaršího mezopotámského eposu?",
    key: "Gilgameš",
    d: [
      ["Chammurapi", "Chammurapi byl babylonský král a autor zákoníku, ne hrdina eposu."],
      ["Aššurbanipal", "Aššurbanipal byl asyrský král. V jeho knihovně se sice epos dochoval, ale hrdinou nebyl on."],
      ["Tutanchamon", "Tutanchamon byl egyptský faraon, ne král Uruku."],
    ],
    hints: [
      "Hrdina eposu hledal nesmrtelnost a vládl sumerskému městu. Nebyl to Babyloňan ani Asyřan.",
      "Vyřaď babylonského krále se zákoníkem, asyrského krále s knihovnou a egyptského faraona. Zbude hrdina, který putoval světem se svým přítelem Enkiduem.",
    ],
    explanation: "Hrdinou eposu je Gilgameš, král sumerského Uruku. Chammurapi byl babylonský a Aššurbanipal asyrský král, Tutanchamon egyptský faraon.",
  },
];

// ── L2 — použití (popis situace → civilizace / pojem / předmět) ─────────────
const L2: Uloha[] = [
  {
    q: "K čemu Sumerové písmo zpočátku hlavně potřebovali?",
    key: "K evidenci zásob, daní a obchodu",
    d: [
      ["K zapisování příběhů a básní", "Příběhy se zapisovaly až později. Nejstarší tabulky jsou seznamy zboží a čísel."],
      ["K psaní dopisů mezi přáteli", "Soukromé dopisy přišly až později. Nejstarší záznamy jsou úřední a hospodářské."],
      ["K opisování svatých knih", "Nejstarší tabulky nejsou náboženské knihy, ale počty ovcí a obilí v chrámových skladech."],
    ],
    hints: [
      "Chrámy a vládci spravovali obrovské sklady obilí a stáda. Co bylo potřeba si o nich pamatovat?",
      "Nejstarší nalezené tabulky obsahují hlavně čísla a znaky pro ovce, obilí a pivo. Když si nikdo nezapamatuje, kdo kolik odevzdal, co je nutné zavést?",
    ],
    explanation: "Písmo vzniklo kvůli správě chrámových a královských zásob: kolik obilí kdo odevzdal, kolik ovcí je ve stádě, co se prodalo. Příběhy, dopisy a náboženské texty se zapisovaly až později.",
  },
  {
    q: "Říše s hlavním městem Ninive měla železné zbraně, válečné vozy a beranidla (trámy na rozbíjení bran). O kterou jde?",
    key: "Asýrie",
    d: [
      ["Babylonie", "Babylonie měla hlavní město Babylon a proslula zákoníkem a stavbami."],
      ["Sumer", "Sumer tvořily menší městské státy jako Ur a Uruk, ne velká válečná říše s Ninive."],
      ["Egypt", "Egypt ležel u Nilu a jeho hlavní města byla Memfis a Théby."],
    ],
    hints: [
      "Pomůže ti hlavní město. Na které řece a ve které části Mezopotámie leželo Ninive?",
      "Egypt vyřaď hned, ležel v Africe. Sumer byl soubor malých městských států a Babylonie měla centrum v jiném městě. Hledej severní říši, která dobývala sousedy silou.",
    ],
    explanation: "Ninive bylo hlavním městem Asýrie, válečné říše se železnými zbraněmi, vozy a beranidly. Babylonie měla za centrum Babylon, Sumer byl soubor městských států a Egypt ležel u Nilu.",
  },
  {
    q: "Archeolog prozkoumal stupňovitou stavbu: na vrcholu stála svatyně boha a uvnitř nenašel žádný hrob. Co to bylo a proč?",
    key: "Zikkurat, protože sloužil jako chrám",
    d: [
      ["Pyramida, protože měla stupně", "Stupně měly i některé egyptské pyramidy, ale pyramida byla hrobka. Tady hrob chybí a nahoře je svatyně."],
      ["Pyramida, protože hrob mohli vykrást", "Vykradená hrobka by měla aspoň pohřební komoru. Svatyně boha na vrcholu ukazuje, že stavba sloužila bohům, ne mrtvým."],
      ["Zikkurat, protože v něm pohřbívali krále", "Název sedí, ale důvod ne. Zikkurat nebyl hrobka a hrob se v něm nenašel."],
    ],
    hints: [
      "Rozhoduj podle nálezu: svatyně nahoře a žádný hrob. Která stavba sloužila bohům a která mrtvým vládcům?",
      "Vyber správný název i správný důvod. Egyptská pyramida byla hrobka faraona, i když některé měly stupně. Mezopotámská stupňovitá stavba měla nahoře svatyni.",
    ],
    explanation: "Svatyně na vrcholu a chybějící hrob ukazují na zikkurat, mezopotámský chrám. Stupně samy nerozhodují, měly je i některé pyramidy. Pyramida ale byla hrobka a zikkurat v žádném případě hrobkou nebyl.",
  },
  {
    q: "Hodina má šedesát minut a minuta šedesát sekund. Kterému národu za toto počítání vděčíme?",
    key: "Sumerům",
    d: [
      ["Egypťanům", "Egypťané počítali po desítkách. Počítání po šedesáti pochází z Mezopotámie."],
      ["Římanům", "Římané šedesátky nezavedli, používali své římské číslice po desítkách."],
      ["Féničanům", "Féničané dali světu hláskové písmo (abecedu), ne dělení hodiny po šedesáti."],
    ],
    hints: [
      "Hodina se dělí na šedesát dílů. Ve které civilizaci se počítalo právě po šedesáti?",
      "Egypťané a Římané počítali po desítkách, Féničané jsou známí abecedou. Počítání po šedesáti vymysleli nejstarší obyvatelé jižní Mezopotámie.",
    ],
    explanation: "Šedesátková soustava pochází od Sumerů. Proto má hodina 60 minut a kruh 360 stupňů (šestkrát šedesát). Egypťané a Římané počítali po desítkách.",
  },
  {
    q: "Černý kamenný sloup nese vytesané zákony a nahoře obraz krále před bohem. Co to je?",
    key: "Chammurapiho zákoník",
    d: [
      ["Epos o Gilgamešovi", "Epos je příběh o hrdinovi zapsaný na hliněných tabulkách, ne sbírka zákonů na sloupu."],
      ["Aššurbanipalova knihovna", "Knihovna byla sbírka tisíců hliněných tabulek v Ninive, ne jeden kamenný sloup."],
      ["Kniha mrtvých", "Kniha mrtvých jsou egyptské texty pro posmrtný život, psané na papyrus."],
    ],
    hints: [
      "Na sloupu jsou vytesané zákony. Jde tedy o příběh, o sbírku tabulek, nebo o soubor pravidel a trestů?",
      "Příběh o hrdinovi i knihovna byly na hliněných tabulkách a egyptské texty na papyru. Soubor zákonů vytesaný na sloup dal zhotovit babylonský král asi v 18. století př. n. l.",
    ],
    explanation: "Kamenný sloup se zákony a obrazem krále před bohem je Chammurapiho zákoník z Babylonie. Epos o Gilgamešovi je příběh, knihovna sbírka tabulek a Kniha mrtvých egyptské texty.",
  },
  {
    q: "Bránu obloženou modrými lesklými cihlami zdobí obrazy býků a draků. Ve kterém městě stála?",
    key: "V Babylonu",
    d: [
      ["V Ninive", "Ninive bylo asyrské hlavní město. Brána z modrých glazovaných cihel s býky a draky patří jinému městu."],
      ["V Uru", "Ur byl starý sumerský městský stát, brána z doby Nabukadnezara II. je mnohem mladší."],
      ["V Thébách", "Théby jsou egyptské město, modré cihly se zvířaty patří Mezopotámii."],
    ],
    hints: [
      "Bránu zasvěcenou bohyni Ištar dal postavit Nabukadnezar II. Kde vládl?",
      "Egyptské město vyřaď a starý sumerský Ur také. Z mladších mezopotámských měst hledej to, které Nabukadnezar II. přestavěl a kde měl i visuté zahrady, ne asyrskou metropoli.",
    ],
    explanation: "Ištařina brána z modrých glazovaných cihel stála v Babylonu za krále Nabukadnezara II. Ninive bylo asyrské, Ur sumerský a Théby egyptské.",
  },
  {
    q: "Asyrský král dal v Ninive shromáždit tisíce popsaných hliněných tabulek. Co tím vzniklo?",
    key: "Aššurbanipalova knihovna",
    d: [
      ["Chammurapiho zákoník", "Zákoník je jeden kamenný sloup s vytesanými zákony z Babylonie, ne tisíce tabulek."],
      ["Epos o Gilgamešovi", "Epos je jeden příběh. V Ninive se sice dochoval, ale sbírka tisíců tabulek je něco jiného."],
      ["Babylonská věž", "Babylonská věž je stavba z příběhu, spojovaná se zikkuratem v Babylonu, ne sbírka tabulek."],
    ],
    hints: [
      "Tisíce tabulek na jednom místě uložené pro čtení. Jak se dnes takové sbírce říká?",
      "Jeden sloup se zákony ani jeden příběh to být nemohou a věž je stavba. Hledej sbírku písemností pojmenovanou po asyrském králi, který ji dal založit.",
    ],
    explanation: "Sbírka tisíců tabulek v Ninive je Aššurbanipalova knihovna. Zákoník je jeden sloup, epos jeden příběh a Babylonská věž stavba.",
  },
  {
    q: "Král vládl asi v 18. století př. n. l. a sjednotil Mezopotámii kolem Babylonu. Kdo to byl?",
    key: "Chammurapi",
    d: [
      ["Aššurbanipal", "Aššurbanipal byl asyrský král v Ninive a žil mnohem později."],
      ["Gilgameš", "Gilgameš byl sumerský král Uruku, ne sjednotitel Babylonie."],
      ["Ramesse II.", "Ramesse II. vládl v Egyptě, ne v Mezopotámii."],
    ],
    hints: [
      "Centrem jeho říše byl Babylon. Kteří panovníci v nabídce nebyli babylonští?",
      "Egyptský faraon, asyrský král s knihovnou a sumerský hrdina eposu to být nemohou. Zbývá babylonský král, který je známý i tím, že dal vytesat zákony.",
    ],
    explanation: "Babylonii sjednotil Chammurapi, známý svým zákoníkem. Aššurbanipal byl asyrský král, Gilgameš sumerský král Uruku a Ramesse II. egyptský faraon.",
  },
  {
    q: "Král Uruku hledal nesmrtelnost a se svým přítelem zabil nebeského býka. Jak se jmenoval?",
    key: "Gilgameš",
    d: [
      ["Chammurapi", "Chammurapi byl babylonský král a zákonodárce, ne hrdina příběhu o nesmrtelnosti."],
      ["Aššurbanipal", "Aššurbanipal byl asyrský král v Ninive, ne král Uruku."],
      ["Nabukadnezar II.", "Nabukadnezar II. byl babylonský král a stavitel, ne hrdina eposu."],
    ],
    hints: [
      "Uruk byl sumerské město. Který z panovníků nebyl babylonský ani asyrský?",
      "Babylonský zákonodárce, babylonský stavitel a asyrský král s knihovnou žili v jiných městech. Hledej hrdinu nejstaršího dochovaného eposu.",
    ],
    explanation: "Král Uruku, který hledal nesmrtelnost, je Gilgameš, hrdina nejstaršího eposu. Chammurapi a Nabukadnezar II. byli babylonští, Aššurbanipal asyrský král.",
  },
  {
    q: "Rolníci kopou kanály ze dvou řek, které se na jihu stékají a tečou do Perského zálivu. Kde žijí?",
    key: "V Mezopotámii",
    d: [
      ["V údolí Nilu", "Egypťané také zavlažovali, ale z jediné řeky. Nil navíc teče do Středozemního moře, ne do Perského zálivu."],
      ["V údolí Indu", "Indus teče do Arabského moře, ne do Perského zálivu, a jeho civilizace ležela u jedné velké řeky."],
      ["V Palestině", "Palestina je úzký pás země u Středozemního moře. Velké řeky tekoucí do Perského zálivu jí netečou."],
    ],
    hints: [
      "Které dvě řeky se stékají a ústí do Perského zálivu? A jak se jmenuje krajina, jejíž název znamená „mezi řekami“?",
      "Nil i Indus jsou jednotlivé řeky a tečou do jiných moří, pobřeží Palestiny leží u Středozemního moře. Krajina mezi Eufratem a Tigridem dostala jméno od Řeků.",
    ],
    explanation: "Eufrat a Tigris se na jihu stékají a tečou do Perského zálivu. Krajina mezi nimi je Mezopotámie („země mezi řekami“), kde rolníci zavlažovali pole kanály. Egypt ležel u Nilu, indická civilizace u Indu a Palestina u Středozemního moře.",
  },
  {
    q: "Lidé tu psali na papyrus, stavěli pyramidy a vládl jim faraon. O kterou civilizaci jde?",
    key: "Egypt",
    d: [
      ["Sumer", "Sumerové psali do hlíny a stavěli zikkuraty. Papyrus, pyramidy a faraon patří jinam."],
      ["Babylonie", "Babylonii vládl král, ne faraon, a psalo se tam do hlíny."],
      ["Asýrie", "Asyřané psali klínovým písmem do hlíny a jejich vládcem byl král v Ninive."],
    ],
    hints: [
      "Pozor, tady se neptá na Mezopotámii. Kde se psalo na papyrus a kdo nazýval vládce faraonem?",
      "Všechny tři mezopotámské státy psaly do hlíny a stavěly zikkuraty. Papyrus rostl hojně jen u jedné velké africké řeky.",
    ],
    explanation: "Papyrus, pyramidy a faraon patří Egyptu u Nilu. Sumer, Babylonie i Asýrie psaly klínovým písmem do hlíny a stavěly zikkuraty.",
  },
  {
    q: "Podle zákoníku tohoto státu platilo „oko za oko, zub za zub“. Ve kterém státě to bylo?",
    key: "V Babylonii",
    d: [
      ["V Asýrii", "Asýrie proslula vojskem a knihovnou. Zákoník s touto zásadou pochází ze sousední říše."],
      ["V Sumeru", "Sumer je známý písmem a městskými státy, slavný zákoník s odvetou je mladší."],
      ["V Egyptě", "Egypt měl faraona a jiné zvyky, zákoník s touto zásadou je mezopotámský."],
    ],
    hints: [
      "Zásada „oko za oko“ je v nejznámějším zákoníku starověku. Jak se jmenoval jeho autor a kde vládl?",
      "Egypt vyřaď. Sumer je starší a proslavil se písmem, Asýrie vojskem a knihovnou. Zákoník dal vytesat král Chammurapi — hledej jeho říši.",
    ],
    explanation: "Zásadu „oko za oko, zub za zub“ obsahuje Chammurapiho zákoník z Babylonie. Asýrie proslula vojskem, Sumer písmem a Egypt ležel u Nilu.",
  },
  {
    q: "Kdo jako první psal znaky podobné obrázkům, které se časem změnily v klínky?",
    key: "Sumerové",
    d: [
      ["Babyloňané", "Babyloňané klínové písmo převzali, ale vymysleli ho jejich předchůdci."],
      ["Asyřané", "Asyřané psali klínovým písmem až mnohem později, převzali ho."],
      ["Egypťané", "Egypťané vymysleli vlastní obrázkové hieroglyfy, klínové písmo nevynalezli."],
    ],
    hints: [
      "Ptáme se na vynálezce písma, ne na ty, kdo ho jen převzali. Kdo žil v Mezopotámii nejdřív?",
      "Babyloňané i Asyřané přišli později a písmo přejali. Egypťané měli své hieroglyfy. Hledej nejstarší národ jižní Mezopotámie s městy Ur a Uruk.",
    ],
    explanation: "Písmo vymysleli Sumerové kolem roku 3000 př. n. l. Nejdřív kreslili obrázky, které se změnily v klínky. Babyloňané a Asyřané ho převzali, Egypťané měli hieroglyfy.",
  },
  {
    q: "Reliéfy z paláce v Ninive ukazují krále při lovu lvů a vojáky útočící na hradby. Která říše je vytvořila?",
    key: "Asýrie",
    d: [
      ["Babylonie", "Babylonie měla centrum v Babylonu, Ninive jí nepatřilo."],
      ["Sumer", "Sumerské městské státy ležely na jihu. Palác v Ninive je pozdější a severní."],
      ["Egypt", "Egypt ležel u Nilu, Ninive je v Mezopotámii."],
    ],
    hints: [
      "Rozhoduje místo nálezu. Které říši patřilo město Ninive?",
      "Egypt a jižní sumerské státy vyřaď. Babylon bylo jiné centrum. Hledej severní válečnou říši, jejíž vládci se rádi zobrazovali při boji a lovu.",
    ],
    explanation: "Palác v Ninive a reliéfy s bojem a lovem vytvořila Asýrie, válečná říše na severu Mezopotámie. Babylonie měla centrum v Babylonu, Sumer ležel na jihu a Egypt u Nilu.",
  },
  {
    q: "Král Nabukadnezar II. dal toto město přestavět a obehnat mohutnými hradbami. O které město jde?",
    key: "Babylon",
    d: [
      ["Ninive", "Ninive bylo hlavní město Asýrie, ne sídlo babylonského krále."],
      ["Ur", "Ur byl starý sumerský městský stát, Nabukadnezar II. vládl jinde."],
      ["Théby", "Théby leží v Egyptě, Nabukadnezar II. byl mezopotámský král."],
    ],
    hints: [
      "Nabukadnezar II. vládl říši na jihu Mezopotámie. Jak se jmenovalo její hlavní město?",
      "Asyrská metropole, starý sumerský stát a egyptské město to nejsou. Hledej město s Ištařinou bránou a visutými zahradami.",
    ],
    explanation: "Nabukadnezar II. přestavěl Babylon, hlavní město Babylonie (s Ištařinou bránou a visutými zahradami). Ninive bylo asyrské, Ur sumerský a Théby egyptské.",
  },
  {
    q: "Písař seřízne stéblo rostoucí u řeky a tlačí jím do vlhké tabulky. Jak se ten nástroj jmenuje?",
    key: "Rákosové rydlo",
    d: [
      ["Husí brk", "Husí brk je pero z ptačího péra. Používal se ve středověku s inkoustem."],
      ["Štětec", "Štětcem se nanášel inkoust na papyrus v Egyptě, do hlíny se jím nepíše."],
      ["Kovové dláto", "Dlátem se tesalo do kamene, třeba Chammurapiho zákoník. Do měkké hlíny se znaky vtlačovaly stéblem."],
    ],
    hints: [
      "Nástroj je z rostliny a netřeba k němu inkoust. Jen se jím tlačí do měkkého materiálu.",
      "Ptačí pero patří středověku, štětec egyptským písařům a kovový nástroj kameníkům. Hledej nástroj ze stébla vysoké pobřežní trávy, kterým se vtlačují znaky.",
    ],
    explanation: "Nástroj ze seříznutého stébla rákosu je rákosové rydlo. Písař jím tlačil znaky do vlhké hlíny. Brk je středověký, štětec egyptský a dlátem se tesalo do kamene.",
  },
];

// ── L3 — analýza (pramen, příčina, chybný výrok, odvození z nálezu) ─────────
const L3: Uloha[] = [
  {
    q: "Úryvek zákoníku: „Vyrazí-li svobodný muž oko svobodnému, vyrazí mu oko. Vyrazí-li oko otrokovi, zaplatí stříbrem.“ Co z toho plyne?",
    key: "Trest závisel na tom, kdo byl poškozený",
    d: [
      ["Trest byl pro každého člověka stejný", "To je dnešní představa rovnosti před zákonem. V úryvku jsou dva různé tresty za tentýž čin."],
      ["Trest určovali sami poškození lidé", "Úryvek trest předem stanoví zákon, neurčuje ho poškozený."],
      ["Trest byl vždy jen pokuta ve stříbře", "Pokuta platí jen u otroka. Svobodnému muži hrozila stejná újma, jakou způsobil."],
    ],
    hints: [
      "Porovnej obě věty úryvku. Čin je v nich stejný — v čem se liší?",
      "V obou větách někdo vyrazí oko. Jednou je poškozený svobodný člověk, podruhé otrok, a tresty jsou různé. Co to říká o tom, jak si babylonská společnost cenila různých lidí?",
    ],
    explanation: "Za stejný čin přišel různý trest: když byl poškozený svobodný muž, platila odveta, u otroka jen pokuta. Babylonská společnost tedy nebyla rovná — trest závisel na postavení člověka.",
  },
  {
    q: "Úryvek zákoníku: „Postaví-li stavitel dům a dům spadne a zabije majitele, bude stavitel usmrcen.“ Co z toho vyplývá?",
    key: "Řemeslník odpovídal za kvalitu své práce",
    d: [
      ["Řemeslník nemohl být nikdy potrestán", "Úryvek naopak stanoví pro stavitele nejtvrdší trest."],
      ["Řemeslník musel dům jen zdarma opravit", "Úryvek nemluví o opravě. Za smrt majitele hrozila staviteli smrt."],
      ["Řemeslník platil pokutu jen chrámu", "O chrámu ani pokutě v úryvku nic není, trest dopadá přímo na stavitele."],
    ],
    hints: [
      "Kdo nese vinu, když se dům zřítí? A jak přísně je potrestán?",
      "Zákon trestá stavitele za to, co se stalo s jeho stavbou, a trest odpovídá škodě — smrt za smrt. Co tím zákon po stavitelích chtěl?",
    ],
    explanation: "Zákoník trestal stavitele za špatně postavený dům stejnou škodou, jakou způsobil. Řemeslníci tedy nesli odpovědnost za kvalitu práce a zákon je nutil stavět pečlivě.",
  },
  {
    q: "V úryvku textu získá král Uruku po dlouhé cestě rostlinu věčného mládí, ale když se koupe, ukradne mu ji had. O jaký druh textu jde?",
    key: "O epos",
    d: [
      ["O zákon", "Úryvek nic nepřikazuje ani netrestá, vypráví děj."],
      ["O hospodářský záznam", "Úryvek nevyjmenovává zboží ani množství, vypráví, co se komu stalo."],
      ["O dopis králi", "Úryvek není nikomu adresovaný. Král v něm vystupuje jako postava vyprávění."],
    ],
    hints: [
      "Všimni si, co text dělá: přikazuje, počítá, oznamuje, nebo vypráví?",
      "Je v něm postava, dlouhá cesta, cíl (věčné mládí) a nečekaný zvrat (had). Takhle nevypadá zákon, seznam zásob ani úřední zpráva. Který druh textu má postavy a děj?",
    ],
    explanation: "Text s postavou krále, jeho cestou za nesmrtelností a zvratem (had mu ukradne rostlinu mládí) je epos, konkrétně Epos o Gilgamešovi. Zákon by stanovil tresty, záznam by počítal zásoby a dopis by byl někomu adresovaný.",
  },
  {
    q: "Proč vznikly první státy v Mezopotámii právě u řek?",
    key: "Protože zavlažování vyžadovalo společnou organizaci",
    d: [
      ["Protože řeky chránily města před útoky", "Řeky nebyly hradbou, rovina kolem nich byla otevřená útokům a města si stavěla vlastní hradby. Důvodem byla voda pro pole."],
      ["Protože u řek rostlo obilí samo bez práce", "V suché krajině obilí samo nevyrostlo. Vodu na pole museli lidé přivést kanály, a to byla těžká práce."],
      ["Protože po řekách připluli vládci z Egypta", "Mezopotámské státy nezaložili Egypťané. Městské státy vyrostly z místních osad u řek."],
    ],
    hints: [
      "Mezopotámie je horká a suchá. Co museli rolníci udělat, aby jim na polích něco vyrostlo?",
      "Vodu z řek bylo nutné rozvádět kanály a hrázemi. Jeden rolník to sám nezvládne. Co z toho plyne pro vznik vlády, úředníků a zákonů?",
    ],
    explanation: "Pole v suché Mezopotámii potřebovala vodu z řek. Kanály a hráze mohly vzniknout jen společnou prací mnoha lidí, kterou někdo řídil. Řízení takové práce pomohlo vzniku městských států s vládci a úředníky.",
  },
  {
    q: "Proč Sumerové stavěli domy i chrámy hlavně z cihel ze sušené hlíny?",
    key: "Protože v krajině chyběl kámen i dřevo",
    d: [
      ["Protože pálené cihly byly pevnější než kámen", "Kámen je pevnější a většina staveb byla ze sušených, nepálených cihel. Rozhodovalo, že kámen v rovině chyběl."],
      ["Protože kámen zakazovalo náboženství", "Žádný takový zákaz neznáme. Kámen v rovině mezi řekami prostě nebyl."],
      ["Protože hliněné domy lépe odolávaly povodním", "Naopak, voda nepálené cihly rozmáčela a domy se musely opravovat. Rozhodovalo, že kámen a dřevo chyběly."],
    ],
    hints: [
      "Z čeho se staví, když si nemůžeš materiál snadno přivézt z daleka?",
      "Mezopotámie je plochá rovina z naplavenin řek, bez hor a velkých lesů. Co tam bylo v nadbytku a čeho se naopak nedostávalo?",
    ],
    explanation: "Rovina mezi řekami neměla lomy ani velké lesy, zato hlíny bylo všude dost. Sumerové proto stavěli z cihel. Stavby nebyly věčné a musely se opravovat.",
  },
  {
    q: "Proč se Aššurbanipalova knihovna dochovala až do dnešní doby?",
    key: "Protože se tabulky při požáru vypálily a ztvrdly",
    d: [
      ["Protože tabulky ukryli kněží do sklepů", "Knihovna nebyla ukrytá. Když nepřátelé dobyli Ninive, palác vyhořel."],
      ["Protože tabulky byly z tvrdého kamene", "Tabulky byly z hlíny, ne z kamene. Mnohé ještě zpevnil oheň."],
      ["Protože tabulky opisovali stále noví písaři", "Po zániku Asýrie už je nikdo neopisoval, ležely přes dva a půl tisíce let v troskách."],
    ],
    hints: [
      "Co se stane s hlínou, když ji dáš do žhavé pece? A co se stalo s Ninive, když ho dobyli nepřátelé?",
      "Hořící palác fungoval jako obří pec a hliněné tabulky v něm ještě víc ztvrdly. Spoj dohromady zničení města a vlastnosti hlíny.",
    ],
    explanation: "Když nepřátelé v roce 612 př. n. l. dobyli Ninive, palác s knihovnou vyhořel. Oheň mnoho hliněných tabulek vypálil jako cihly, takže ztvrdly a spolu s dalšími tabulkami přečkaly v suchých troskách tisíce let. Katastrofa je paradoxně pomohla zachránit.",
  },
  {
    q: "Na výzdobě dřevěné skříňky z Uru jsou vozy s plnými koly z desek. Táhnou je oslům podobná zvířata a přejíždějí padlé nepřátele. Co z toho vyplývá?",
    key: "Sumerové už znali kolo a používali ho ve válce",
    d: [
      ["Sumerové jezdili do boje hlavně na koních", "Vozy táhnou zvířata podobná oslům. Jízda na koních se rozšířila až mnohem později."],
      ["Kolo do Mezopotámie přinesli až Egypťané", "Egypťané poznali vůz s koly až mnohem později. Výzdoba z Uru je starší."],
      ["Vozy sloužily jen k převozu obilí na trh", "Vozy přejíždějí padlé nepřátele, výzdoba tedy ukazuje bitvu, ne cestu na trh."],
    ],
    hints: [
      "Popiš, co na výzdobě vidíš: jaká kola, jaká zvířata a v jaké situaci.",
      "Ur je sumerské město a plná kola z desek jsou nejstarší typ kola. Padlí nepřátelé pod vozy prozrazují, kde se vozy používaly. Co z toho plyne o tom, kdo kolo znal a k čemu ho využíval?",
    ],
    explanation: "Výzdoba ze sumerského Uru ukazuje vozy s plnými koly v bitvě. Sumerové tedy kolo znali a využívali ho i ve válce. Vozy netáhli koně, ale zvířata podobná oslům, a Egypťané vůz s koly poznali až mnohem později.",
  },
  {
    q: "Kamenná deska z města Lagaš oslavuje, jak jeho král porazil sousední sumerské město Umma. Co to prozrazuje o sumerských městech?",
    key: "Byla samostatnými státy, které spolu soupeřily",
    d: [
      ["Tvořila jednu říši s hlavním městem Babylonem", "Babylon sjednotil Mezopotámii až o stovky let později. V Lagaši i v Ummě tehdy vládli vlastní králové."],
      ["Válčila jen s cizími nájezdníky, ne mezi sebou", "Také v Ummě žili Sumerové. Deska ukazuje válku Sumerů proti Sumerům."],
      ["Poslouchala jednoho krále zvoleného všemi Sumery", "Deska oslavuje krále jednoho města proti druhému. Společného krále tehdy Sumerové neměli."],
    ],
    hints: [
      "Kdo s kým na desce bojuje? Patří obě města ke stejnému národu?",
      "V Lagaši i v Ummě žili Sumerové a každé město mělo svého krále. Co z toho plyne o tom, jestli tehdy existovala jedna společná říše?",
    ],
    explanation: "V Lagaši i v Ummě vládli vlastní králové, kteří spolu válčili o půdu a vodu. Sumer tedy netvořil jednu říši, ale soubor samostatných městských států. Mezopotámii sjednotili až pozdější vládci.",
  },
  {
    q: "Proč bylo psaní na hliněné tabulky pro obyvatele Mezopotámie výhodné?",
    key: "Protože hlíny bylo dost a papyrus tu hojně nerostl",
    d: [
      ["Protože hlína byla lehčí a skladnější než papyrus", "Hliněná tabulka je těžká. Výhoda byla v tom, že materiál byl všude po ruce."],
      ["Protože hlínu levně dováželi kupci až z Egypta", "Hlínu nebylo nutné dovážet, ležela na březích Eufratu a Tigridu."],
      ["Protože do hlíny se dalo psát i bez nástroje", "Do hlíny se psalo rákosovým rydlem, nástroj byl nutný."],
    ],
    hints: [
      "Porovnej, co leželo u Eufratu a Tigridu, a co rostlo u Nilu v Egyptě.",
      "Každá civilizace psala na to, čeho měla nejvíc. U Nilu rostl papyrus (vodní rostlina šáchor), ze kterého se vyráběla psací látka. V Mezopotámii takový nebyl — co tu bylo zdarma a v každém množství?",
    ],
    explanation: "Hlína byla na březích řek všude a zdarma, kdežto papyrus v Mezopotámii ve velkém nerostl. Tabulky byly těžké, ale snadno se vyráběly, a když se vypálily, vydržely tisíce let.",
  },
  {
    q: "Tři výroky o Mezopotámii jsou pravdivé a jeden obsahuje chybu. Který je chybný?",
    key: "Babyloňané psali hlavně na papyrusové svitky",
    d: [
      ["Sumerové psali rákosovým rydlem do hlíny", "Tento výrok je pravdivý: Sumerové vtlačovali znaky rydlem do vlhké hlíny."],
      ["Asyrské Ninive leželo na řece Tigris", "Tento výrok je pravdivý: Ninive stálo na břehu Tigridu na severu Mezopotámie."],
      ["Chammurapi vládl jako král v Babylonu", "Tento výrok je pravdivý: Chammurapi byl babylonský král."],
    ],
    hints: [
      "Ověř každý výrok zvlášť: sedí národ, místo i materiál?",
      "U každého výroku se zeptej, jestli se nepletou Mezopotámie a Egypt. Psací látka z rostliny rostoucí u Nilu patří jen jedné z těch civilizací.",
    ],
    explanation: "Chyba je v tvrzení o papyru. Babyloňané psali klínovým písmem do hliněných tabulek, papyrus je egyptská psací látka. Ostatní výroky jsou pravdivé.",
  },
  {
    q: "Ve kterém výroku o mezopotámských státech je chyba?",
    key: "Zákoník dal vytesat asyrský král Aššurbanipal",
    d: [
      ["Knihovnu v Ninive založil král Aššurbanipal", "Tento výrok je pravdivý: knihovnu založil asyrský král Aššurbanipal."],
      ["Zikkuraty byly chrámy, ne hrobky králů", "Tento výrok je pravdivý: zikkurat byl chrám se svatyní nahoře."],
      ["Epos o Gilgamešovi vypráví o králi Uruku", "Tento výrok je pravdivý: Gilgameš byl král Uruku."],
    ],
    hints: [
      "U každého výroku zkontroluj, jestli k sobě patří osobnost, stát a dílo.",
      "Dva výroky zmiňují téhož asyrského krále. Ověř, který z nich mu přisuzuje správné dílo a který dílo jiného panovníka ze sousední říše.",
    ],
    explanation: "Chybný je výrok o zákoníku. Zákoník dal vytesat babylonský král Chammurapi, Aššurbanipal se proslavil knihovnou. Ostatní výroky jsou pravdivé.",
  },
  {
    q: "Jeden výrok o Mezopotámii NENÍ pravdivý. Najdi ho.",
    key: "Zikkurat sloužil jako hrobka pro krále",
    d: [
      ["Mezopotámie ležela mezi Eufratem a Tigridem", "Tento výrok je pravdivý: název znamená „země mezi řekami“."],
      ["Sumerové počítali v šedesátkové soustavě", "Tento výrok je pravdivý: odtud máme šedesát minut v hodině."],
      ["Visuté zahrady stály podle tradice v Babylonu", "Tento výrok je pravdivý: připisují se Nabukadnezarovi II."],
    ],
    hints: [
      "Ověř každý výrok zvlášť: sedí místo, národ i účel?",
      "U každé stavby, vynálezu a místa se zeptej, jestli se nezaměnila Mezopotámie s Egyptem.",
    ],
    explanation: "Chybný je výrok o zikkuratu. Zikkurat byl chrám se svatyní boha, hrobkou krále byla egyptská pyramida. Ostatní výroky jsou pravdivé.",
  },
  {
    q: "Který výrok o klínovém písmu je chybný?",
    key: "Vymysleli ho Babyloňané za Chammurapiho",
    d: [
      ["Znaky se vtlačovaly do vlhké hlíny", "Tento výrok je pravdivý: písař tlačil znaky seříznutým stéblem do hliněné tabulky."],
      ["Mělo stovky znaků pro slova a slabiky", "Tento výrok je pravdivý: znaky označovaly celá slova a slabiky, proto se ho písaři učili léta."],
      ["Jeho znaky vznikly zjednodušením obrázků", "Tento výrok je pravdivý: z nejstarších obrázkových znaků se postupně staly skupiny vtisků."],
    ],
    hints: [
      "U každého výroku ověř nástroj, materiál, podobu znaků a to, kdo písmo používal.",
      "Vzpomeň si, kdo žil v Mezopotámii nejdřív, kdo přišel později a jak písaři pracovali. Každý výrok porovnej s tím, co víš.",
    ],
    explanation: "Chybný je výrok o vynálezcích. Klínové písmo vymysleli Sumerové kolem roku 3000 př. n. l., Babyloňané ho za Chammurapiho už jen používali, o víc než tisíc let později. Ostatní výroky jsou pravdivé.",
  },
  {
    q: "Archeologové našli tabulku s klínovým písmem: seznam ovcí, pytlů obilí a jméno chrámu. K čemu asi sloužila?",
    key: "K evidenci chrámových zásob",
    d: [
      ["K vyprávění příběhu o bozích", "Příběh by měl děj a postavy. Seznam ovcí a obilí je účetní záznam."],
      ["K vyhlášení nového zákona", "Zákon by stanovil pravidla a tresty, ne počty zvířat a obilí."],
      ["K výuce kreslení zvířat", "Znaky pro ovce jsou písmo v seznamu, ne kreslířské cvičení."],
    ],
    hints: [
      "Co tabulka obsahuje? Děj, pravidla, nebo položky a jejich množství?",
      "Seznam věcí a jméno instituce najdeš i dnes na skladovém lístku. Kdo v Mezopotámii spravoval velké zásoby a potřeboval vědět, kolik čeho má?",
    ],
    explanation: "Seznam ovcí, obilí a jméno chrámu ukazuje hospodářský záznam: chrám si zapisoval, co má ve skladech. Právě kvůli takovým záznamům písmo vzniklo.",
  },
  {
    q: "Na reliéfu z paláce jsou beranidla (trámy na rozbíjení bran) u cizích hradeb a dlouhé řady zajatců. Co to prozrazuje o státu, který reliéf vytvořil?",
    key: "Šlo o válečnou říši, která dobývala města",
    d: [
      ["Šlo o mírový stát rolníků bez vojska", "Beranidla a zajatci ukazují válku, ne mírový život."],
      ["Šlo o záznam obchodní dohody sousedů", "Obchodní dohoda by se zapsala na tabulku, ne vyobrazila s beranidly a zajatci."],
      ["Šlo o stát, který se jen bránil nájezdníkům", "Reliéf ukazuje útok na cizí hradby a odvádění zajatců, tedy dobývání, ne obranu vlastního města."],
    ],
    hints: [
      "Co znázorňují beranidla a zajatci? Mír, obchod, nebo boj?",
      "Vládce si dal na palác vytesat to, čím se chtěl chlubit. Když ukazuje dobývání hradeb a odvádění lidí, co tím říká o své říši? Vzpomeň si i na Asyřany.",
    ],
    explanation: "Beranidla a zajatci dokládají, že vládce se chlubil dobýváním měst. Takové reliéfy jsou typické pro Asýrii, válečnou říši, která si sousedy podmaňovala silou.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? L1 : level === 2 ? L2 : L3;
  return pickN(pool, pool.length).map(build);
}

// ── Topic ────────────────────────────────────────────────────────────────
export const MEZOPOTAMIE: TopicMetadata[] = [
  {
    id: "g6-dej-mezopotamie-6",
    rvpNodeId:
      "g6-dejepis-starovek-nejstarsi-staty-mezopotamie-a-egypt-mezopotamie-sumer-babylonie-asyrie-klinove-pismo",
    displayName: "Mezopotámie a klínové písmo",
    title: "Mezopotámie – Sumer, Babylonie, Asýrie, klínové písmo",
    studentTitle: "Mezopotámie a klínové písmo",
    subject: "dejepis",
    category: "Starověk",
    topic: "Nejstarší státy - Mezopotámie a Egypt",
    briefDescription: "Poznáš Sumery, Babylonii a Asýrii a zjistíš, jak vzniklo klínové písmo.",
    keywords: [
      "Mezopotámie", "Sumer", "Sumerové", "Babylonie", "Asýrie", "klínové písmo",
      "hliněné tabulky", "zikkurat", "Chammurapi", "Aššurbanipal", "Ninive", "Babylon",
      "Epos o Gilgamešovi", "Eufrat", "Tigris", "písař",
    ],
    goals: [
      "Přiřadit znak, vynález, osobnost nebo pramen ke správné mezopotámské civilizaci.",
      "Odlišit Mezopotámii od současného Egypta (hlína × papyrus, zikkurat × pyramida).",
      "Vysvětlit, jak a proč vzniklo a přetrvalo klínové písmo.",
      "Vyvodit z úryvku pramene nebo z nálezu, jak fungovala mezopotámská společnost.",
    ],
    boundaries: [
      "Jen nesporná učebnicová fakta; letopočty pouze orientačně („asi“, „kolem“).",
      "Nezahrnuje rozluštění klínového písma ani Akkadskou říši.",
      "Egypt se objevuje jen jako srovnání, samostatně ho probírá jiné téma.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Mezopotámie = země mezi Eufratem a Tigridem. Sumerové: klínové písmo, hliněné tabulky, zikkuraty, šedesátky. Babylonie: Chammurapiho zákoník, Babylon. Asýrie: válečná říše, Ninive, Aššurbanipalova knihovna. Papyrus, hieroglyfy a pyramidy patří Egyptu.",
      steps: [
        "Najdi v zadání klíčové slovo (město, král, materiál, stavba).",
        "Rozhodni, jestli patří Mezopotámii, nebo Egyptu.",
        "Pak ho přiřaď k Sumeru, Babylonii, nebo Asýrii.",
        "U pramene se ptej, co text dělá (vypráví, přikazuje, počítá) a co z toho plyne.",
      ],
      commonMistake: "Přiřadit Mezopotámii papyrus a pyramidy z Egypta, nebo zaměnit Chammurapiho (zákoník, Babylonie) s Aššurbanipalem (knihovna, Asýrie).",
      example: "Tabulka s klínovým písmem a seznamem ovcí = hospodářský záznam ze Sumeru, ne příběh.",
    },
  },
];
