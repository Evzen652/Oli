/**
 * Přírodověda 4. ročník — Savci a ptáci: znaky a zástupci.
 *
 * Přepsáno 2026-09-11. Do té doby měly úlohy L1 a L2 jen otázku a možnosti,
 * nápověda se brala z `helpTemplate` celého tématu — u otázky „Co je zimní
 * spánek?" tak dítě četlo „Velryba a netopýr jsou savci!". Při přepisu
 * vypadly i vady původního poolu: nesmyslné „staví čeleď hnízdo", otázka na
 * stálá zvířata se DVĚMA správnými možnostmi (jelen, srnec a liška u nás
 * zimují taky), „velryba potřebuje vynořovat" bez zvratného „se" a echolokace,
 * kterou si téma samo vylučuje v `boundaries`.
 *
 * Gradace:
 *  • L1 — rozpoznat znak skupiny nebo typického zástupce (jeden krok).
 *  • L2 — použít znak na popsané zvíře: zařadit ho, odvodit potravu ze zobáku
 *         nebo zubů, vysvětlit, jak přečká zimu.
 *  • L3 — výjimky a přenos: zvíře, které vzhledem nebo pohybem klame
 *         (velryba, netopýr, tučňák, ptakopysk), a úvahy o dvou krocích.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "./_shared";

const POOL_L1: PracticeTask[] = [
  choice("Čím je pokryté tělo savců?", "Srstí", [
    { value: "Peřím", why: "Peří mají ptáci. Savci jako pes, kočka nebo veverka mají chlupy." },
    { value: "Šupinami", why: "Šupiny mají ryby a plazi, třeba kapr nebo ještěrka." },
    { value: "Holou vlhkou kůží", why: "Holou vlhkou kůži mají obojživelníci, například žába." },
  ], {
    hints: ["Vzpomeň si, co cítíš pod rukou, když hladíš kočku.", "Pes, kočka i veverka mají tělo pokryté stejně. Ptáci mají něco jiného — to hledat nemáš."],
    explanation: "Savci mají tělo pokryté srstí, tedy chlupy. Srst drží teplo u těla. I člověk je savec, jen má chlupy řidší.",
  }),
  choice("Čím je pokryté tělo ptáků?", "Peřím", [
    { value: "Srstí", why: "Srst mají savci. Pták má tělo pokryté pery." },
    { value: "Šupinami", why: "Šupiny mají ryby a plazi. Ptáci je mají jen na nohou, tělo mají opeřené." },
    { value: "Tvrdým krunýřem", why: "Krunýř má želva, a ta je plaz. Ptáci krunýř nemají." },
  ], {
    hints: ["Co najdeš na zemi, když kolem prolétl holub?", "Právě z toho se kdysi plnily polštáře a peřiny. Ptáka to hřeje a pomáhá mu to létat."],
    explanation: "Peří mají jen ptáci — žádná jiná skupina živočichů ho nemá. Proto je peří nejjistější znak ptáka, i když pták nelétá.",
  }),
  choice("Čím savci krmí svá mláďata hned po narození?", "Mateřským mlékem", [
    { value: "Hmyzem, který nalovili", why: "Hmyzem krmí mláďata ptáci, třeba kos nebo vlaštovka. Mládě savce nejdřív pije mléko." },
    { value: "Semínky a zrním", why: "Zrní dostávají mláďata některých ptáků. Savci krmí mláďata mlékem." },
    { value: "Ničím, najdou si potravu sama", why: "Hned po narození se mládě savce samo nenají. Matka ho kojí." },
  ], {
    hints: ["Právě podle toho dostali savci své jméno.", "Mládě savce saje u matky. Co mu matka dává ze svého těla?"],
    explanation: "Savci kojí mláďata mateřským mlékem — mládě ho saje, odtud slovo savec. Žádná jiná skupina živočichů mláďata mlékem nekrmí.",
  }),
  choice("Jak přicházejí na svět mláďata ptáků?", "Vylíhnou se z vajec", [
    { value: "Rodí se živá jako koťata", why: "Živá mláďata rodí savci. Ptačí mládě roste ve vejci a pak se vylíhne." },
    { value: "Vyvinou se z pulců ve vodě", why: "Z pulců se vyvíjejí žáby, tedy obojživelníci." },
    { value: "Vylíhnou se z kukel", why: "Z kukly se líhne hmyz, například motýl." },
  ], {
    hints: ["Vzpomeň si na slepici a kuřátko.", "Samice ptáka sedí v hnízdě na něčem kulatém a zahřívá to. Co z toho po čase vyleze?"],
    explanation: "Ptáci snášejí vejce a zahřívají je v hnízdě. Mládě se ve vejci vyvine a pak se vylíhne. To platí pro všechny ptáky, od sýkorky po pštrosa.",
  }),
  choice("Co mají všichni ptáci, i ti, kteří nelétají?", "Křídla a peří", [
    { value: "Dlouhé nohy", why: "Dlouhé nohy má čáp nebo volavka, ale vrabec nebo kachna ne." },
    { value: "Zahnutý zobák", why: "Zahnutý zobák mají jen dravci, třeba káně. Vrabec má zobák krátký a rovný." },
    { value: "Plovací blány", why: "Plovací blány mají vodní ptáci jako kachna nebo labuť. Kos je nemá." },
  ], {
    hints: ["Pštros ani tučňák nelétají, a přesto jsou to ptáci. Co mají stejné jako vrabec?", "Hledej dvě věci, které má opravdu každý pták. Na nohy ani na zobák se nedívej — ty se u různých ptáků liší."],
    explanation: "Každý pták má peří a křídla. Pštros a tučňák křídla mají, jen s nimi nelétají — tučňák jimi pod vodou pádluje. Nohy a zobák se podle způsobu života liší.",
  }),
  choice("Který z těchto živočichů je savec?", "Veverka", [
    { value: "Kos", why: "Kos má peří a snáší vejce, je to pták." },
    { value: "Ještěrka", why: "Ještěrka má šupiny a klade vejce, je to plaz." },
    { value: "Kapr", why: "Kapr má šupiny a dýchá žábrami, je to ryba." },
  ], {
    hints: ["Hledej zvíře, které má chlupy.", "Ze čtyř zvířat má srst a kojí mláďata jen jedno. Ostatní mají peří nebo šupiny."],
    explanation: "Veverka má srst a mláďata kojí mlékem, proto je savec. Kos je pták, ještěrka plaz a kapr ryba.",
  }),
  choice("Který z těchto živočichů je pták?", "Datel", [
    { value: "Netopýr", why: "Netopýr létá, ale má srst a kojí mláďata. Je to savec." },
    { value: "Motýl", why: "Motýl létá, ale má šest nohou a tykadla. Je to hmyz." },
    { value: "Ropucha", why: "Ropucha má holou kůži a klade vajíčka do vody. Je to obojživelník." },
  ], {
    hints: ["Nerozhoduj podle toho, jestli zvíře létá. Hledej peří.", "Létat umějí tři z nich, ale peří má jen jedno — to, které tluče zobákem do stromu."],
    explanation: "Datel má peří a zobák a mláďata se mu líhnou z vajec, je to pták. Netopýr i motýl sice létají, ale netopýr je savec a motýl hmyz.",
  }),
  choice("Kterého ptáka u nás uvidíš i v zimě?", "Sýkoru koňadru", [
    { value: "Vlaštovku", why: "Vlaštovka na podzim odlétá do Afriky, protože v zimě u nás nenajde létající hmyz." },
    { value: "Čápa bílého", why: "Čáp odlétá na zimu do Afriky a vrací se na jaře." },
    { value: "Kukačku", why: "Kukačka je tažný pták, zimu tráví v Africe." },
  ], {
    hints: ["Který z těch ptáků chodí v zimě na krmítko?", "Tři z nich na podzim odlétají do Afriky. Hledej toho, který zůstává a zobe na krmítku semínka a lůj."],
    explanation: "Sýkora koňadra je stálý pták — zůstává u nás celý rok. V zimě se živí semínky a přezimujícím hmyzem a ráda chodí na krmítko. Vlaštovka, čáp i kukačka jsou tažní ptáci.",
  }),
  choice("Který pták na podzim odlétá do teplých krajin?", "Vlaštovka", [
    { value: "Vrabec", why: "Vrabec zůstává u nás celý rok, je to stálý pták." },
    { value: "Kos", why: "Kos u nás přezimuje. V zimě ho uvidíš na zahradě i v parku." },
    { value: "Straka", why: "Straka je stálý pták, najde si potravu i v zimě." },
  ], {
    hints: ["Který z těch ptáků loví za letu hmyz?", "Na zimu odlétají ptáci, kteří se živí létajícím hmyzem, protože ten v zimě u nás není. Který z nich staví hnízdo z bláta pod střechou?"],
    explanation: "Vlaštovka loví za letu hmyz. V zimě u nás hmyz nelétá, proto vlaštovka na podzim odlétá do Afriky a na jaře se vrací. Vrabec, kos i straka jsou stálí ptáci.",
  }),
  choice("Jak se jmenuje přední končetina ptáka?", "Křídlo", [
    { value: "Ploutev", why: "Ploutve mají ryby a také velryby. Pták má místo přední končetiny něco jiného." },
    { value: "Tlapka", why: "Tlapku má pes nebo kočka, tedy savec." },
    { value: "Pařát", why: "Pařát je noha dravého ptáka s ostrými drápy. Je to zadní končetina, ne přední." },
  ], {
    hints: ["Čím pták mává, když letí?", "Pták má dvě končetiny, na kterých stojí, a dvě další, které nesou dlouhá pera a slouží k letu."],
    explanation: "Přední končetinou ptáka je křídlo. Nese dlouhá pera, kterými pták mává při letu. Zadní končetiny jsou nohy — u dravců se jim říká pařáty.",
  }),
  choice("Který savec umí létat?", "Netopýr", [
    { value: "Veverka", why: "Veverka umí skákat z větve na větev, ale nelétá." },
    { value: "Vrabec", why: "Vrabec létá, ale má peří. Je to pták, ne savec." },
    { value: "Čmelák", why: "Čmelák létá, ale je to hmyz — má šest nohou." },
  ], {
    hints: ["Hledej zvíře, které létá a přitom má srst.", "Tohle zvíře loví v noci a přes den visí hlavou dolů na půdě nebo v jeskyni."],
    explanation: "Netopýr je jediný savec, který opravdu létá. Má srst a mláďata kojí. Křídla má z tenké kožní blány natažené mezi prsty.",
  }),
  choice("Který savec žije celý život ve vodě?", "Delfín", [
    { value: "Žralok", why: "Žralok žije ve vodě, ale dýchá žábrami. Je to ryba." },
    { value: "Kapr", why: "Kapr má šupiny a žábry, je to ryba." },
    { value: "Vydra", why: "Vydra loví ve vodě, ale noru má na břehu a tam rodí mláďata." },
  ], {
    hints: ["Hledej zvíře, které plave jako ryba, ale musí se chodit nadechovat k hladině.", "Dvě zvířata dýchají žábrami a jedno má noru na břehu. Zbývá to, které na souš nikdy nevyleze."],
    explanation: "Delfín žije celý život v moři, ale dýchá plícemi a mláďata kojí — je to savec. Na hladinu se vynořuje, aby se nadechl. Žralok a kapr jsou ryby.",
  }),
  choice("Který savec staví na potoce hráze z větví?", "Bobr", [
    { value: "Vydra", why: "Vydra žije u vody a loví ryby, ale hráze nestaví." },
    { value: "Krtek", why: "Krtek hrabe chodby pod zemí, u vody nežije." },
    { value: "Ježek", why: "Ježek žije v zahradách a lesích, hráze nestaví." },
  ], {
    hints: ["Hledej zvíře s velkými zuby, které umí pokácet strom.", "Tenhle hlodavec má široký plochý ocas a z pokácených větví staví hráz, za kterou se zadrží voda."],
    explanation: "Bobr zuby pokácí stromy a z větví a bahna staví hráze. Za hrází vznikne tůň, ve které má bobr bezpečný vchod do svého domku.",
  }),
];

const POOL_L2: PracticeTask[] = [
  choice("Zvíře má srst a mláďata kojí mlékem. Kam ho zařadíš?", "Mezi savce", [
    { value: "Mezi ptáky", why: "Ptáci mají peří a mláďata se jim líhnou z vajec. Srst a kojení jsou znaky jiné skupiny." },
    { value: "Mezi plazy", why: "Plazi mají šupiny a mláďata nekojí." },
    { value: "Mezi obojživelníky", why: "Obojživelníci mají holou vlhkou kůži a mláďata nekojí." },
  ], {
    hints: ["Vezmi znaky jeden po druhém: kdo má na těle chlupy?", "Kojit mláďata mlékem umí jen jedna skupina živočichů. Právě podle toho dostala jméno."],
    explanation: "Srst a kojení mláďat mlékem mají jen savci. Stačí jeden z těch znaků a víš, kam zvíře patří.",
  }),
  choice("Zvíře má peří a zobák a snáší vejce. Kam ho zařadíš?", "Mezi ptáky", [
    { value: "Mezi plazy", why: "Vejce kladou i plazi, ale peří nemají. Rozhoduje peří." },
    { value: "Mezi savce", why: "Savci mají srst a mláďata kojí, peří nemají." },
    { value: "Mezi hmyz", why: "Hmyz má šest nohou a tykadla, peří ani zobák nemá." },
  ], {
    hints: ["Vejce snášejí i jiní živočichové. Který znak z popisu má jen jedna skupina?", "Ještěrka i želva kladou vejce taky, ale jejich tělo pokrývají šupiny. Co má popsané zvíře místo nich?"],
    explanation: "Peří mají jen ptáci. Vejce kladou i plazi, ryby nebo hmyz, takže samotná vejce o zařazení nerozhodnou — peří ano.",
  }),
  choice("Savci a ptáci jsou teplokrevní. Co to znamená?", "Mají pořád stejně teplé tělo", [
    { value: "Mají teplé tělo jen v létě", why: "Teplokrevní mají teplé tělo po celý rok, i v mrazu." },
    { value: "Ohřívají se na slunci jako ještěrka", why: "Na slunci se ohřívají plazi, jejich teplota se mění s okolím. Teplokrevní si teplo vyrábějí sami." },
    { value: "Mají teplejší krev než člověk", why: "Člověk je taky teplokrevný. Slovo neznamená „teplejší než člověk“." },
  ], {
    hints: ["Jak teplé je tvoje tělo v zimě a jak v létě?", "Ještěrka je ráno ztuhlá, dokud ji nezahřeje slunce. Kos ani pes na slunce čekat nemusí. Proč asi?"],
    explanation: "Teplokrevní živočichové si teplo vyrábějí z potravy a udržují stále stejně teplé tělo, ať je venku mráz, nebo horko. Srst a peří jim to teplo drží u těla.",
  }),
  choice("Proč vlaštovka na zimu odlétá, ale vrabec u nás zůstává?", "Vlaštovka loví hmyz, který v zimě chybí", [
    { value: "Vlaštovce vadí sníh na peří", why: "Sníh ani mráz nejsou hlavní důvod. Rozhoduje, jestli pták v zimě najde potravu." },
    { value: "Vrabec je větší a víc vydrží", why: "Vrabec a vlaštovka jsou skoro stejně velcí. O odletu rozhoduje potrava, ne velikost." },
    { value: "Vlaštovka hnízdí jen v Africe", why: "Vlaštovka hnízdí u nás pod střechami. Do Afriky jen odlétá na zimu." },
  ], {
    hints: ["Mysli na to, co každý z těch ptáků jí.", "Vlaštovka chytá potravu za letu ve vzduchu. Co v lednu ve vzduchu nepoletuje? A čím se živí vrabec?"],
    explanation: "Vlaštovka se živí létajícím hmyzem, a ten v zimě u nás není — proto odlétá do Afriky. Vrabec zobe semínka a zbytky potravy, které najde i v zimě, takže může zůstat.",
  }),
  choice("Pták má krátký, silný a kuželovitý zobák. Čím se nejspíš živí?", "Semeny, která rozlouskne", [
    { value: "Masem, které trhá", why: "Maso trhají dravci zahnutým zobákem. Krátký kuželovitý zobák funguje jako louskáček." },
    { value: "Nektarem z květů", why: "Pro nektar potřebuje pták dlouhý tenký zobák, který dosáhne hluboko do květu." },
    { value: "Rybami, které loví ve vodě", why: "Rybožraví ptáci mají zobák dlouhý a ostrý, aby rybu chytili." },
  ], {
    hints: ["Tvar zobáku prozradí potravu. K čemu se hodí krátký silný nástroj?", "Takový zobák má vrabec, stehlík nebo dlask. Co asi louskají, když sedí na slunečnici?"],
    explanation: "Krátký, silný kuželovitý zobák funguje jako louskáček — pták jím rozlouskne tvrdou slupku semen. Tak se živí vrabec, pěnkava nebo dlask.",
  }),
  choice("Pták má silný zahnutý zobák a ostré drápy. Čím se živí?", "Loví jiná zvířata", [
    { value: "Zobe semínka ze země", why: "Na semínka stačí krátký rovný zobák. Zahnutý zobák a drápy potřebuje lovec." },
    { value: "Cedí potravu z vody", why: "Potravu z vody cedí kachna plochým zobákem." },
    { value: "Sbírá hmyz z kůry stromů", why: "Hmyz z kůry dobývá datel rovným silným zobákem, drápy k tomu nepotřebuje." },
  ], {
    hints: ["Co drží pták v drápech, když přistane na sloupu u pole?", "Drápy něco chytí a zahnutý zobák to roztrhá. Takhle vypadá káně nebo sokol."],
    explanation: "Zahnutý zobák a ostré drápy mají draví ptáci, třeba káně nebo sokol. Drápy kořist chytí a udrží, zobák ji roztrhá na kousky.",
  }),
  choice("Savec má ostré dlouhé špičáky a drápy. Čím se nejspíš živí?", "Masem ulovených zvířat", [
    { value: "Trávou a listím", why: "Býložravci mají široké ploché zuby na rozmělnění rostlin, dlouhé špičáky nepotřebují." },
    { value: "Jen semeny a ořechy", why: "Semena louskají hlodavci svými hlodáky, ne dlouhými špičáky." },
    { value: "Nektarem z květů", why: "Nektar savci u nás nejedí. Ostré zuby slouží k něčemu jinému." },
  ], {
    hints: ["K čemu se hodí ostrý špičatý zub — k trhání, nebo k drcení?", "Takové zuby má liška, rys nebo vlk. Co asi udělají, když mají hlad a v lese potkají zajíce?"],
    explanation: "Dlouhé ostré špičáky a drápy mají šelmy — lovci jako liška, rys nebo vlk. Špičáky kořist udrží a roztrhají. Býložravci mají zuby široké a ploché.",
  }),
  choice("Savec má široké ploché zuby, kterými rozmělňuje rostliny. Který to může být?", "Srnec", [
    { value: "Liška", why: "Liška je šelma, má ostré špičáky na maso." },
    { value: "Rys", why: "Rys je šelma a lovec, jeho zuby jsou ostré." },
    { value: "Vlk", why: "Vlk loví jiná zvířata, má dlouhé ostré špičáky." },
  ], {
    hints: ["Hledej zvíře, které se pase a okusuje větvičky.", "Tři z nich jsou lovci s ostrými zuby. Jen jedno žere trávu, listí a pupeny."],
    explanation: "Srnec je býložravec. Trávu a listí rozmělňuje širokými plochými zuby jako mlýnkem. Liška, rys a vlk jsou šelmy s ostrými špičáky.",
  }),
  choice("Jak ježek přečká zimu?", "Nažere se a přes zimu spí", [
    { value: "Odejde do teplejšího kraje", why: "Ježek nikam neodchází. Do teplých krajin odlétají jen někteří ptáci." },
    { value: "Každý den jí zásoby z nory", why: "Takhle přečká zimu veverka nebo křeček. Ježek zásoby nemá, žije z tuku." },
    { value: "Celou zimu normálně loví", why: "V zimě ježek nenajde hmyz ani slimáky, proto loví jen do podzimu." },
  ], {
    hints: ["Kde ježka v lednu najdeš? A co v tu dobu dělá?", "Na podzim se ježek hodně nají a pak si najde hromadu listí. Z čeho žije, když je venku mráz a on nic nejí?"],
    explanation: "Ježek upadá do zimního spánku. Na podzim se vykrmí, zaleze do hromady listí a spí až do jara. Tělo se mu ochladí, srdce bije pomalu a žije z tuku, který si na podzim vytvořil.",
  }),
  choice("Veverka přes zimu celou dobu nespí. Jak zimu přečká?", "Jí zásoby, které na podzim schovala", [
    { value: "Odletí do teplých krajin", why: "Veverka nelétá, jen skáče po stromech. Odlétají ptáci." },
    { value: "Prospí ji bez probuzení", why: "Takhle přečká zimu ježek. Veverka se v zimě budí a jí." },
    { value: "Loví myši pod sněhem", why: "Myši pod sněhem loví liška. Veverka se živí hlavně semeny a oříšky." },
  ], {
    hints: ["Co veverka dělá na podzim s oříšky a žaludy?", "Veverka v zimě hodně odpočívá v hnízdě, ale když má hlad, vyleze. Kam si na podzim ukládala jídlo?"],
    explanation: "Veverka si na podzim schovává oříšky, žaludy a semena do skrýší. V zimě hodně odpočívá, ale když se probudí, zásoby vyhrabe a sní. Na některou skrýš zapomene — a ze zapomenutého oříšku vyroste strom.",
  }),
  choice("Jak se kos stará o mláďata v hnízdě?", "Nosí jim potravu, dokud nevyletí", [
    { value: "Kojí je mlékem", why: "Mlékem kojí mláďata jen savci. Kos je pták." },
    { value: "Nechá je hned samotná", why: "Mláďata kosa se líhnou holá a slepá, bez rodičů by nepřežila." },
    { value: "Zahrabe vejce do písku", why: "Vejce do písku zahrabávají některé želvy, tedy plazi. Kos vejce zahřívá v hnízdě." },
  ], {
    hints: ["Mláďata kosa se líhnou holá a neumějí létat. Kdo jim přinese jídlo?", "Rodiče létají sem a tam a v zobáku nesou žížaly a housenky. Jak dlouho to asi musí dělat?"],
    explanation: "Mláďata kosa jsou po vylíhnutí holá a bezmocná. Oba rodiče jim nosí žížaly a hmyz a zahřívají je, dokud mláďatům nenarostou pera a nevyletí z hnízda.",
  }),
  choice("Který znak mají savci a ptáci společný?", "Stálou teplotu těla", [
    { value: "Tělo pokryté srstí", why: "Srst mají jen savci, ptáci mají peří." },
    { value: "Kojení mláďat", why: "Kojí jen savci. Ptačí mláďata dostávají potravu v zobáku." },
    { value: "Tělo pokryté peřím", why: "Peří mají jen ptáci, savci mají srst." },
  ], {
    hints: ["Tři znaky patří jen jedné skupině. Hledej ten čtvrtý.", "Srst a kojení jsou jen u savců, peří jen u ptáků. Co mají kos i pes stejné, když je venku mráz?"],
    explanation: "Savci i ptáci jsou teplokrevní — mají stále stejně teplé tělo, ať je venku jakkoli. Srst a kojení mají jen savci, peří jen ptáci.",
  }),
  choice("Čáp bílý hnízdí na komínech a sloupech. Čím se živí?", "Žábami, hmyzem a myšmi", [
    { value: "Semeny obilí", why: "Semena zobou ptáci s krátkým silným zobákem. Čáp má dlouhý zobák na chytání živé kořisti." },
    { value: "Ovocem ze zahrad", why: "Ovoce jedí třeba kosi nebo špačci. Čáp loví živé živočichy." },
    { value: "Nektarem z květů", why: "Nektar pijí ptáci s tenkým zobákem, u nás takoví nežijí. Čáp je lovec." },
  ], {
    hints: ["Kde čápa nejčastěji uvidíš, když zrovna nesedí na hnízdě?", "Čáp chodí pomalu po mokré louce a dlouhým zobákem rychle chňapne. Co v trávě a u vody asi chytá?"],
    explanation: "Čáp se prochází po loukách a mokřadech a dlouhým zobákem loví žáby, hmyz, myši a žížaly. Proto mu vadí, když mokré louky mizí — nemá kde lovit.",
  }),
];

const POOL_L3: PracticeTask[] = [
  choice("Velryba žije celý život v moři a plave jako ryba. Podle čeho poznáš, že mezi ryby nepatří?", "Dýchá plícemi a mládě kojí mlékem", [
    { value: "Podle ploutví a hladké kůže", why: "Ploutve mají i ryby. Podle tvaru těla se to nepozná — život ve vodě dává rybám i velrybám podobný tvar." },
    { value: "Podle toho, že žije ve slané vodě", why: "Ve slané vodě žije spousta ryb. Místo, kde zvíře žije, o skupině nerozhoduje." },
    { value: "Podle toho, že klade vejce na dno", why: "Velryba vejce neklade, rodí živé mládě. Vejce kladou ryby." },
  ], {
    hints: ["Nedívej se na to, kde zvíře žije, ale jak dýchá.", "Ryba dýchá žábrami pod vodou. Velryba se musí chodit nadechovat k hladině — čím asi dýchá? A čím krmí mládě?"],
    explanation: "Velryba dýchá plícemi, a proto se vynořuje k hladině. Mládě rodí živé a kojí ho mlékem. To jsou znaky savců. Tvar těla má podobný rybě jen proto, že obě žijí ve vodě.",
  }),
  choice("Netopýr létá a v noci loví hmyz jako vlaštovka. Proč ho přesto řadíme jinam než ji?", "Má srst a mláďata kojí", [
    { value: "Protože létá jen v noci", why: "Doba lovu o skupině nerozhoduje. V noci loví i sovy, a ty jsou ptáci." },
    { value: "Protože má křídla z peří", why: "Netopýr peří nemá. Křídla má z tenké kožní blány." },
    { value: "Protože se orientuje sluchem", why: "Sluchem se orientují i sovy. O zařazení rozhoduje stavba těla a péče o mláďata." },
  ], {
    hints: ["Rozhoduje stavba těla a péče o mláďata, ne způsob pohybu.", "Vlaštovka má peří a mláďata se jí líhnou z vajec. Co má netopýr na těle a čím krmí svá mláďata?"],
    explanation: "Netopýr má srst, rodí živá mláďata a kojí je mlékem — je to savec. Létání o zařazení nerozhoduje. Vlaštovka má peří a klade vejce, je to pták.",
  }),
  choice("Tučňák nelétá a skvěle plave. Proč je to přesto pták?", "Má peří a líhne se z vejce", [
    { value: "Protože žije v chladném kraji", why: "V chladu žijí i tuleni, a ti jsou savci. Místo pobytu o skupině nerozhoduje." },
    { value: "Protože má ploutve jako ryby", why: "Tučňák nemá ploutve, ale křídla, kterými pod vodou pádluje." },
    { value: "Protože chodí po dvou nohách", why: "Po dvou nohách chodí i člověk, a ten je savec." },
  ], {
    hints: ["Zkus zapomenout, že tučňák nelétá. Jaké má tělo a jak přichází na svět?", "Létání ani plavání o skupině nerozhoduje. Rozhoduje, co pokrývá tělo a jestli mládě vylézá z vejce."],
    explanation: "Tučňák má husté krátké peří a mládě se mu líhne z vejce. Křídla má, jen je používá k plavání. To stačí k tomu, aby byl pták.",
  }),
  choice("Ptakopysk klade vejce. Proč ho přesto řadíme mezi savce?", "Mláďata kojí a má srst", [
    { value: "Protože žije ve vodě", why: "Ve vodě žijí ryby, žáby i kachny. Místo, kde zvíře žije, o zařazení nerozhoduje." },
    { value: "Protože má zobák jako kachna", why: "Zobák by spíš vedl k ptákům. Rozhodují jiné znaky." },
    { value: "Protože ho tam zařadili omylem", why: "Není to omyl. Ptakopysk má dva hlavní znaky savců." },
  ], {
    hints: ["Který znak mají všichni savci, i ti nejpodivnější?", "Ptakopysk je výjimka, protože klade vejce. Ale co udělá s mládětem, když se vylíhne? A co má na těle?"],
    explanation: "Ptakopysk je vzácná výjimka: klade vejce, ale vylíhlé mládě kojí mlékem a tělo má pokryté srstí. Kojení a srst jsou znaky savců, proto mezi ně patří.",
  }),
  choice("Krtek žije pod zemí a skoro nevidí. Proč je to savec?", "Má hebkou srst a kojí mláďata", [
    { value: "Protože žije v podzemních chodbách", why: "Pod zemí žijí i žížaly nebo larvy hmyzu. Místo pobytu o skupině nerozhoduje." },
    { value: "Protože se živí žížalami", why: "Žížalami se živí i kos, a ten je pták. Potrava o skupině nerozhoduje." },
    { value: "Protože nemá křídla", why: "Křídla nemají ani ryby, plazi nebo žáby. Chybějící křídla ze zvířete savce nedělají." },
  ], {
    hints: ["Na krtka se podívej zblízka. Co mu pokrývá tělo?", "Život pod zemí, potrava ani chybějící křídla o skupině nerozhodují. Zbývá, jak vypadá tělo a čím matka krmí mláďata."],
    explanation: "Krtek má sametovou srst a mláďata kojí mlékem, proto je savec. To, že žije v chodbách a jí žížaly, jen ukazuje, jak je přizpůsobený svému prostředí.",
  }),
  choice("Neznámý pták má dlouhé nohy, dlouhý krk a dlouhý zobák a brodí se v mělké vodě. Čím se nejspíš živí?", "Žábami a rybkami", [
    { value: "Semeny z luk", why: "Na semena stačí krátký silný zobák. Dlouhý zobák se hodí na chytání kořisti ve vodě." },
    { value: "Nektarem z květů", why: "Nektar pijí ptáci s tenkým zobákem u květů, ne v mělké vodě." },
    { value: "Ořechy z lesa", why: "Ořechy louskají ptáci se silným krátkým zobákem, třeba ořešník." },
  ], {
    hints: ["Proč by pták potřeboval dlouhé nohy a dlouhý zobák zrovna ve vodě?", "Dlouhé nohy mu dovolí stát ve vodě a dlouhý krk se zobákem rychle bodne pod hladinu. Co se tam pohybuje?"],
    explanation: "Takhle vypadá brodivý pták, třeba volavka nebo čáp. Na dlouhých nohách stojí v mělké vodě a dlouhým krkem a zobákem rychle chytá žáby a rybky.",
  }),
  choice("Proč savci nemusí na zimu odlétat do teplých krajin?", "Srst je hřeje a potravu najdou", [
    { value: "Protože v zimě vůbec nejedí", why: "Většina savců v zimě jí. Bez jídla přečká zimu jen ten, kdo spí a žije z tuku." },
    { value: "Protože se jim v zimě zrychlí dech", why: "Rychlejší dech je nezahřeje. Teplo drží u těla hustá srst." },
    { value: "Protože všichni savci zimu prospí", why: "Zimu prospí jen někteří, třeba ježek. Srnec, liška nebo zajíc jsou vzhůru." },
  ], {
    hints: ["Čím je savec pokrytý a co mu to v mrazu dává?", "Na zimu savcům zhoustne srst. A potravu hledají pod sněhem, na větvích nebo v zásobách. Proč by tedy museli odcházet?"],
    explanation: "Savci jsou teplokrevní a na zimu jim naroste hustší srst, která drží teplo. Potravu si najdou i v zimě — okusují kůru, hrabou pod sněhem nebo jedí zásoby. Někteří, jako ježek, zimu prospí.",
  }),
  choice("Kachňata běhají hned po vylíhnutí, mláďata kosa leží holá v hnízdě. Co z toho plyne?", "Kosi musí mláďata dlouho krmit", [
    { value: "Kachny se starají déle než kosi", why: "Je to naopak. Kachňata si potravu hledají sama, kosí mláďata jsou na rodičích závislá." },
    { value: "Oba se starají stejně dlouho", why: "Mláďata, která hned běhají, potřebují méně péče než holá mláďata v hnízdě." },
    { value: "Kosí mláďata se osamostatní dřív", why: "Holá mláďata v hnízdě potřebují víc času, než se osamostatní." },
  ], {
    hints: ["Kdo si potravu neobstará sám, potřebuje, aby mu ji někdo nosil.", "Kachňata jdou hned za matkou k vodě a zobou sama. Kosí mláďata nevidí a nemají peří. Kdo jim přinese jídlo a jak dlouho?"],
    explanation: "Kachňata se líhnou opeřená, hned chodí a sama si zobou potravu. Mláďata kosa jsou holá a slepá, a tak je rodiče musí krmit a zahřívat, dokud neopustí hnízdo.",
  }),
  choice("Proč jsou ptačí kosti uvnitř duté?", "Aby byl pták lehčí a udržel se ve vzduchu", [
    { value: "Aby se do nich vešlo víc krve", why: "Duté kosti nejsou zásobárna krve. Jde o to, aby tělo bylo co nejlehčí." },
    { value: "Aby byly pevnější než plné kosti", why: "Duté kosti jsou pevné dost, ale hlavní výhoda je jinde — jsou lehké." },
    { value: "Aby si v nich pták ukládal potravu", why: "Potravu si pták do kostí neukládá." },
  ], {
    hints: ["Co musí pták při letu překonat?", "Čím těžší tělo, tím víc síly potřebují křídla, aby ho zvedla. Co udělá dutina uvnitř kosti s její váhou?"],
    explanation: "Dutá kost váží mnohem méně než plná. Lehké tělo se snáz zvedne do vzduchu a pták se při letu tolik neunaví. Proto mají létající ptáci kosti uvnitř duté.",
  }),
  choice("Sova se snese na myš tak tiše, že ji myš neslyší. Který znak jí to umožňuje?", "Měkké okraje per, které tlumí let", [
    { value: "Duté kosti, díky nimž je lehká", why: "Duté kosti mají všichni létající ptáci, a přesto je slyšet. Se zvukem nesouvisejí." },
    { value: "Ostré drápy na silných nohou", why: "Drápy myš chytí, ale ticho při letu nezařídí." },
    { value: "Velké oči, které vidí ve tmě", why: "Oči pomáhají myš najít, ne k ní tiše přiletět." },
  ], {
    hints: ["Všechny nabídnuté znaky sova opravdu má. Hledej ten, který souvisí se zvukem.", "Když letí holub, slyšíš plácání křídel. U sovy neuslyšíš nic. Který znak se týká toho, čím sova při letu mává?"],
    explanation: "Sova má pera s měkkými, roztřepenými okraji. Ta tlumí šum vzduchu při mávání, a proto sova letí skoro neslyšně. Oči a drápy jí pomáhají kořist najít a chytit.",
  }),
  choice("Zajíc v zimě nespí ani neodchází. Co mu pomáhá zimu přežít?", "Hustá srst a okusování kůry", [
    { value: "Zásoby ořechů v noře", why: "Zajíc noru nemá a zásoby si nedělá. Zásoby schovává veverka." },
    { value: "Tuk, ze kterého žije ve spánku", why: "Ze zásob tuku přes zimu žije ježek, který spí. Zajíc je vzhůru." },
    { value: "Odchod do teplejšího kraje", why: "Zajíc nikam neodchází, zůstává na svém poli celý rok." },
  ], {
    hints: ["Zajíc je v zimě vzhůru a venku. Co ho hřeje a co jí, když je pole pod sněhem?", "Zajíc nemá noru ani zásoby. Na zimu mu zhoustne srst a hlad zažene tím, co trčí ze sněhu — větvičkami a keři."],
    explanation: "Zajíc zůstává celou zimu venku. Hřeje ho hustá zimní srst a živí se tím, co najde: okusuje kůru a větvičky keřů a vyhrabává zbytky rostlin pod sněhem.",
  }),
  choice("Mládě ptáka roste ve vejci. Odkud dostává potravu, dokud se nevylíhne?", "Ze žloutku ve vejci", [
    { value: "Z mateřského mléka", why: "Mlékem krmí mláďata savci, a to až po narození." },
    { value: "Od rodičů, kteří mu ji nosí", why: "Rodiče nosí potravu až vylíhnutým mláďatům. K mláděti ve vejci se nedostanou." },
    { value: "Z vody, která projde skořápkou", why: "Skořápkou prochází vzduch, ne potrava. Vše potřebné má mládě uvnitř vejce." },
  ], {
    hints: ["Rodiče se k mláděti ve vejci nedostanou. Co musí vejce obsahovat?", "Rozbij v duchu vajíčko: bílek a žlutá kulička uprostřed. Z čeho z toho mládě roste a sílí?"],
    explanation: "Vejce je pro mládě zásobárna potravy. Mládě roste ze žloutku, který obsahuje všechno, co potřebuje, a bílek ho chrání. Rodiče vejce jen zahřívají.",
  }),
  choice("Která dvojice zvířat patří do stejné skupiny?", "Tučňák a vrabec", [
    { value: "Netopýr a vlaštovka", why: "Oba létají, ale netopýr je savec a vlaštovka pták." },
    { value: "Velryba a žralok", why: "Oba žijí v moři, ale velryba je savec a žralok ryba." },
    { value: "Ptakopysk a kachna", why: "Oba mají zobák a kladou vejce, ale ptakopysk kojí a má srst — je to savec." },
  ], {
    hints: ["Nedej se zmást tím, kde zvíře žije nebo jak se pohybuje.", "U každé dvojice se zeptej: mají obě zvířata peří? Nebo obě srst? Jen u jedné dvojice to vyjde stejně."],
    explanation: "Tučňák i vrabec mají peří a líhnou se z vajec, oba jsou ptáci. Ostatní dvojice se podobají jen tím, kde žijí nebo jak se pohybují, ale patří do různých skupin.",
  }),
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool);
}

export const SAVCIPTACIZNAKYZASTUPCI: TopicMetadata[] = [
  {
    id: "g4-prirodoveda-rozmanitost-prirody-ziva-priroda-zivocichove-savci-ptaci-znaky-zastupci",
    rvpNodeId: "g4-prirodoveda-rozmanitost-prirody-ziva-priroda-zivocichove-savci-ptaci-znaky-zastupci",
    title: "Savci, ptáci - znaky, zástupci",
    studentTitle: "Savci a ptáci",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Rozmanitost přírody",
    briefDescription: "Poznáš znaky savců a ptáků a naučíš se je rozeznávat.",
    keywords: ["savci", "ptáci", "srst", "peří", "teplokrevní", "kojení", "tažní ptáci", "zimní spánek", "zobák", "zuby"],
    goals: [
      "Vyjmenovat znaky savců a ptáků",
      "Uvést příklady savců a ptáků žijících v Česku",
      "Odvodit potravu zvířete z tvaru zobáku nebo zubů",
      "Vysvětlit, jak zvířata přečkají zimu",
      "Zařadit zvíře, které vzhledem klame (velryba, netopýr, tučňák)",
    ],
    boundaries: [
      "Neprobírá podrobnou anatomii ani genetiku — patří na 2. stupeň",
      "Neprobírá evoluční pojmy (konvergentní evoluce, adaptivní radiace)",
      "Neprobírá odbornou fyziologii (metabolismus, echolokace, hibernace)",
    ],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Rozhoduj podle těla a péče o mláďata, ne podle toho, kde zvíře žije nebo jak se pohybuje.",
      steps: [
        "Savci: srst, kojí mláďata mlékem, jsou teplokrevní.",
        "Ptáci: peří, křídla, zobák, mláďata se líhnou z vajec, jsou teplokrevní.",
        "Tvar zobáku a zubů prozradí potravu.",
        "Tažní ptáci odlétají, protože v zimě nenajdou potravu.",
      ],
      commonMistake: "Zařadit zvíře podle toho, kde žije: velryba není ryba a netopýr není pták.",
      example: "Netopýr létá, ale má srst a kojí mláďata — je to savec.",
    },
  },
];
