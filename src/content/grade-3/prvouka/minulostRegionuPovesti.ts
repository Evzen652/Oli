import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "@/content/grade-3/_shared";

// ─────────────────────────────────────────────────────────
// Disjunktní pooly obtížnosti (L1 < L2 < L3), select_one.
// Bez letopočtů (viz boundaries) — obtížnost roste přes hloubku faktu
// a počet kroků, ne přes datování.
//   L1 = rozpoznání: izolovaná fakta o pověstech a pramenech (kdo, co, kde)
//   L2 = aplikace: doplňkové detaily téže postavy/pověsti, rozlišení
//        archiv vs. muzeum, chování postav v konkrétní situaci,
//        zařazení jednoho pramene do druhu
//   L3 = transfer (2 kroky): třídění pramenů, zřetězení faktů přes dvě
//        postavy, přenos pravidla o pramenech do nové situace,
//        porovnání spolehlivosti pověsti a kroniky
// Každá úloha: dvě vlastní nápovědy, zpětná vazba u každé chybné možnosti
// a vysvětlení PROČ (CONTENT_AUTHORING §0).
// ─────────────────────────────────────────────────────────

type Chyba = [string, string];

function t(
  question: string,
  correct: string,
  chyby: [Chyba, Chyba, Chyba],
  h0: string,
  h1: string,
  explanation: string,
): PracticeTask {
  const d = chyby.map(([value, why]) => ({ value, why })) as [Distractor, Distractor, Distractor];
  return choice(question, correct, d, { hints: [h0, h1], explanation });
}

const POOL_L1: PracticeTask[] = [
  t(
    "Co je pověst?",
    "Příběh z minulosti, ve kterém se mísí skutečnost s fantazií",
    [
      ["Pravdivá zpráva o historické události", "Zpráva popisuje jen to, co se opravdu stalo. Pověst přidává i zázraky a nadpřirozené bytosti, proto přesnou zprávou není."],
      ["Úplně vymyšlený příběh, který se nikde neodehrál", "To je spíš pohádka. Pověst se naopak váže ke skutečnému místu nebo postavě, třeba k hoře Blaník."],
      ["Novinový článek o dávné době", "Novinový článek píše novinář o současných událostech. Pověsti vznikly dávno a dlouho se jen vyprávěly."],
    ],
    "Pověst stojí někde mezi pohádkou a přesnou historickou zprávou.",
    "Vzpomeň si na pověst o Blanických rytířích: hora Blaník opravdu existuje, ale spící rytíři jsou vymyšlení. Která možnost popisuje takovou směs?",
    "Pověst má skutečné jádro (místo, postavu nebo událost), ale je doplněná fantazií — zázraky, duchy, spícími rytíři. Proto to není přesná zpráva. A protože se váže ke skutečnému místu, není to ani pohádka.",
  ),
  t(
    "Kdo byla Libuše podle pověsti?",
    "Česká kněžna a věštkyně",
    [
      ["Dcera Krakonoše z Krkonoš", "Krakonoš je duch hor z jiné pověsti. Libuše byla dcerou knížete Kroka."],
      ["Kronikářka, která zapisovala dějiny", "Libuše dějiny nezapisovala — o ní samotné psali až pozdější kronikáři, například Kosmas."],
      ["Selka, která s manželem orala pole", "Pole oral Přemysl, kterého si Libuše vzala. Ona sama vládla jako kněžna."],
    ],
    "Libuše podle pověsti vládla Čechám a měla zvláštní dar.",
    "Její dar souvisel s budoucností — dokázala předpovědět, co se stane, například vznik slavného města nad Vltavou. Jak se říká takové vládkyni s tímto darem?",
    "Libuše byla podle pověsti česká kněžna, tedy vládkyně, a zároveň věštkyně — uměla předpovídat budoucnost. Předpověděla vznik Prahy a za manžela si vybrala oráče Přemysla.",
  ),
  t(
    "Kdo byl Přemysl Oráč podle pověsti?",
    "Prostý oráč, kterého si Libuše vybrala za muže",
    [
      ["Rytíř, který porazil draka", "Boj s drakem do pověsti o Přemyslovi nepatří. Přemysl byl prostý venkovan, žádný rytíř."],
      ["Kníže, který vládl před Libuší", "Před Libuší vládl její otec Krok. Přemysl se stal knížetem až po svatbě s Libuší."],
      ["Kupec, který přijel z ciziny", "Přemysl nebyl cizinec — poslové ho našli doma ve Stadicích u pluhu."],
    ],
    "Přízvisko Oráč napovídá, jakou práci dělal.",
    "Poslové ho našli na poli u pluhu se dvěma voly. Hledej možnost, která odpovídá prostému venkovanovi, a ne vznešenému pánovi nebo cizinci.",
    "Přemysl byl podle pověsti prostý oráč ze Stadic. Libuše si ho vybrala za muže a poslové pro něj dojeli až k pluhu. Společně se stali zakladateli rodu Přemyslovců.",
  ),
  t(
    "Jak se jmenuje rod, který podle pověsti založili Libuše a Přemysl?",
    "Přemyslovci",
    [
      ["Lucemburkové", "Lucemburkové přišli do Čech mnohem později, až když Přemyslovci vymřeli. S Libuší nemají nic společného."],
      ["Habsburkové", "Habsburkové vládli Čechám až o staletí později a přišli z ciziny."],
      ["Slavníkovci", "Slavníkovci byli jiný mocný rod, který s Přemyslovci soupeřil. Jeho zakladatelem nebyl Přemysl."],
    ],
    "Podívej se, jak se jmenoval Libušin manžel.",
    "Rody se často jmenují po svém zakladateli. Zkus ze jména Libušina manžela utvořit jméno celého rodu a porovnej ho s možnostmi.",
    "Rod dostal jméno po svém zakladateli Přemyslovi — proto Přemyslovci. Tento rod pak vládl Čechám po několik staletí. Lucemburkové a Habsburkové přišli až po něm.",
  ),
  t(
    "Kde podle pověsti spí Blaničtí rytíři?",
    "V hoře Blaník ve středních Čechách",
    [
      ["Pod Vyšehradem v Praze", "Vyšehrad je spojený s kněžnou Libuší, ne s rytíři. Rytíři spí v hoře, která jim dala jméno."],
      ["V jeskyních Moravského krasu", "Moravský kras je známý jeskyněmi, ale pověst o rytířích se k němu neváže."],
      ["Pod hradem Karlštejn", "Karlštejn je hrad Karla IV., kde se uchovávaly korunovační klenoty. Rytíři tam nespí."],
    ],
    "Podívej se pozorně na jméno rytířů — prozrazuje, kde spí.",
    "Slovo „Blaničtí“ vzniklo ze jména místa, podobně jako „pražský“ vzniklo z Prahy. Najdi možnost, ve které je právě to místo.",
    "Blaničtí rytíři mají jméno podle hory, ve které podle pověsti spí. Čekají v jejím nitru, až budou potřeba. Vyšehrad patří k Libuši, Karlštejn ke Karlu IV.",
  ),
  t(
    "Kdo je Krakonoš?",
    "Duch hor, vládce Krkonoš",
    [
      ["Český král ze středověku", "Krakonoš není skutečný panovník z dějin — je to bytost z pověstí, která žije v horách."],
      ["Blanický rytíř, který se probudil", "Blaničtí rytíři spí v hoře Blaník a pořád čekají. Krakonoš s nimi nemá nic společného."],
      ["Syn Přemysla Oráče", "Přemyslovi potomci byli skuteční knížata. Krakonoš je nadpřirozená bytost z hor."],
    ],
    "Krakonoš není člověk — je to nadpřirozená bytost z pověstí.",
    "Jeho jméno se podobá názvu našeho nejvyššího pohoří. Tam podle pověstí poroučí počasí i přírodě. Která možnost to vystihuje?",
    "Krakonoš je v pověstech mocný duch, který vládne Krkonoším. Je laskavý k poctivým pocestným, ale pyšné a lakomé potrestá. Není to žádný skutečný král ani rytíř.",
  ),
  t(
    "Kterou postavu z pověstí potkáš v Krkonoších?",
    "Krakonoše",
    [
      ["Kněžnu Libuši", "Libuše sídlila na hradě nad Vltavou, ne v horách na severu Čech."],
      ["Blanické rytíře", "Rytíři spí v hoře Blaník ve středních Čechách, ne v Krkonoších."],
      ["Přemysla Oráče", "Přemysl oral pole ve Stadicích, v Krkonoších nežil."],
    ],
    "Krkonoše jsou hory a v pověstech tam vládne jejich duch.",
    "Jméno té postavy zní skoro stejně jako název těch hor. Porovnej první hlásky jmen v možnostech se slovem z otázky.",
    "V Krkonoších podle pověstí vládne Krakonoš, duch hor. Jeho jméno je s názvem pohoří příbuzné. Ostatní postavy patří k jiným místům: Libuše k Vyšehradu, rytíři k Blaníku, Přemysl ke Stadicím.",
  ),
  t(
    "Co je kronika?",
    "Kniha, kam se zapisují události podle času",
    [
      ["Sborník pohádek a pověstí z okolí", "Sborník pohádek obsahuje vymyšlené příběhy. Kronika zapisuje skutečné události."],
      ["Mapa starého města se všemi ulicemi", "Mapa ukazuje, kde co leží, ne co se kdy stalo."],
      ["Seznam knih v obecní knihovně", "Seznam knih nic nevypráví o tom, co se v obci dělo. Kronika to zaznamenává."],
    ],
    "Kronika je psaný záznam — co se v obci nebo zemi stalo a kdy.",
    "Představ si deník, jenže ne jednoho člověka, ale celé vesnice nebo kláštera. Zápisy v něm jdou jeden po druhém, od nejstaršího. Která možnost to popisuje?",
    "Kronika je kniha, do které kronikář zapisuje události v pořadí, jak se staly. Díky ní dnes víme, co se v obci nebo zemi dělo. Proto je cenným historickým pramenem.",
  ),
  t(
    "Jak se nazývá člověk, který zapisoval historii do kroniky?",
    "Kronikář",
    [
      ["Archivář", "Archivář pečuje o staré listiny v archivu, ale sám do kroniky nezapisuje."],
      ["Muzejník", "Muzejník se stará o předměty v muzeu. Události do knihy nezapisuje."],
      ["Průvodce", "Průvodce provází návštěvníky po hradě nebo městě, kroniku nepíše."],
    ],
    "Podívej se na poslední slovo otázky — název povolání z něj vznikl.",
    "Podobně jako „zahradník“ pečuje o zahradu, má i tenhle člověk jméno odvozené od toho, co vede. Který název zní podobně jako slovo z otázky?",
    "Kronikář dostal jméno podle kroniky, kterou vede — pravidelně do ní zapisuje důležité události. Archivář pečuje o archiv, muzejník o muzeum, průvodce provází návštěvníky.",
  ),
  t(
    "Co je archiv?",
    "Místo, kde se uchovávají staré listiny a dokumenty",
    [
      ["Místo, kde se prodávají noviny", "Noviny se prodávají v trafice. Archiv nic neprodává, jen pečlivě uchovává staré papíry."],
      ["Místo, kde se vystavují staré předměty", "Staré předměty vystavuje muzeum. Archiv sbírá hlavně psané dokumenty."],
      ["Sklad potravin na středověkém hradě", "Sklad potravin je spíž nebo sklep. Archiv slouží k uchování písemností."],
    ],
    "Do archivu chodí badatelé hledat, co bylo kdysi zapsáno.",
    "Rozliš dvě podobná místa: jedno sbírá věci, které si můžeš prohlédnout, druhé hlavně papíry — smlouvy, zápisy, úřední listy. Které z nich je archiv?",
    "Archiv uchovává staré listiny, smlouvy a zápisy. Badatelé v něm hledají, co se v minulosti opravdu stalo, protože psaný dokument je spolehlivý doklad. Předměty vystavuje muzeum.",
  ),
  t(
    "Co je muzeum?",
    "Místo, kde se uchovávají a vystavují staré předměty",
    [
      ["Místo, kde se píší nové kroniky", "Kroniku píše kronikář, třeba pro obecní úřad. Muzeum hotové věci uchovává a vystavuje."],
      ["Místo, kde se ukládají hlavně úřední listiny", "Úřední listiny patří hlavně do archivu. Muzeum sbírá spíš předměty."],
      ["Budova, kde bydlí kronikář", "Kronikář bydlí ve svém domě jako každý jiný. Muzeum je veřejná budova se sbírkami."],
    ],
    "Do muzea se chodí dívat — ale na co?",
    "Vzpomeň si na výstavu, kde za sklem ležely staré hračky, nástroje nebo kroje. Co takové místo dělá s věcmi z minulosti?",
    "Muzeum sbírá a vystavuje staré předměty, fotografie a modely. Díky nim vidíme, jak lidé dříve žili. Úřední listiny se ukládají v archivu.",
  ),
  t(
    "Kdo je pro nás živým pramenem o místní minulosti?",
    "Starší lidé, kteří si pamatují, jak to tady bývalo",
    [
      ["Malé děti ze školky", "Malé děti žijí na světě krátce, starší dobu samy nezažily."],
      ["Turisté, kteří přijeli na výlet", "Turisté místo znají jen z krátké návštěvy, nemohou vyprávět, jak to tu bývalo dřív."],
      ["Nově přistěhovaní sousedé", "Kdo se přistěhoval nedávno, dávnější minulost obce sám nezažil."],
    ],
    "Živý pramen je člověk, který byl u toho.",
    "Kdo z nabízených lidí mohl sám zažít, jak obec vypadala před padesáti lety? Musí tu žít dlouho a musí být dost starý.",
    "Starší lidé, kteří v obci žijí dlouho, jsou pamětníci — mohou vyprávět, co sami zažili a jak se místo změnilo. Děti, turisté ani noví sousedé tu dávnou dobu nezažili.",
  ),
  t(
    "Proč navštěvujeme hrady a zámky?",
    "Protože jsou to stavby z minulosti, které nám ukazují, jak se dříve žilo",
    [
      ["Protože tam prodávají nejlevnější jídlo", "Jídlo koupíš levněji jinde. Hrady navštěvujeme kvůli jejich historii."],
      ["Protože jsou to nové sportovní haly", "Hrady nejsou nové — stojí stovky let. Sportovní haly se stavějí dnes."],
      ["Protože tam dnes bydlí král", "Na českých hradech dnes žádný král nebydlí. Jsou z nich památky otevřené návštěvníkům."],
    ],
    "Hrady stojí už stovky let.",
    "Když procházíš hradními sály, vidíš nábytek, zbraně a pokoje šlechty. Co se z toho můžeš dozvědět o době dávno minulé?",
    "Hrady a zámky postavili lidé před stovkami let. Když je navštívíme, vidíme, jak šlechta bydlela, jak se bránila a čím se bavila. Jsou to památky, které nám minulost ukazují na vlastní oči.",
  ),
];

const POOL_L2: PracticeTask[] = [
  t(
    "Kdy podle pověsti vyjedou Blaničtí rytíři z hory?",
    "Když bude české zemi v největší nouzi",
    [
      ["Každý rok na Vánoce", "Rytíři nevyjíždějí pravidelně — čekají na jedinou výjimečnou chvíli."],
      ["Jakmile se probudí Krakonoš", "Krakonoš je z jiné pověsti a žije v Krkonoších. Rytíře neprobouzí."],
      ["Na příkaz českého krále", "Pověst neříká, že by rytíře někdo povolal rozkazem. Vyjedou sami, až bude zle."],
    ],
    "Rytíři v hoře čekají na úplně výjimečný okamžik.",
    "Jsou to obránci — přemýšlej, kdy by zemi pomoc vojska potřebovala nejvíc. Není to svátek ani rozkaz.",
    "Blaničtí rytíři jsou vojsko, které zemi ochrání. Proto se podle pověsti probudí jen tehdy, až bude Čechám nejhůř, a přijedou na pomoc.",
  ),
  t(
    "Jak se liší pověst od pohádky?",
    "Pověst se váže ke skutečnému místu nebo osobě, pohádka ne",
    [
      ["Pohádka je vždycky delší než pověst", "Délka nerozhoduje — krátké i dlouhé bývají pohádky i pověsti."],
      ["Pověst končí vždycky šťastně", "Pověsti vždy šťastně nekončí, pohádky většinou ano. Tohle je spíš naopak."],
      ["Pohádka nemá žádné hlavní postavy", "Pohádky hlavní postavy mají, například Honzu nebo princeznu."],
    ],
    "Zkus si vzpomenout, kde se odehrávají pohádky a kde pověsti.",
    "Pohádka začíná „Za sedmero horami…“ — to místo na mapě nenajdeš. Horu Blaník nebo Vyšehrad na mapě najdeš. Co z toho plyne?",
    "Pověst je spojená s konkrétním místem (Blaník, Vyšehrad) nebo postavou (Libuše, Přemysl). Pohádka se odehrává ve vymyšleném světě bez vazby na skutečná místa.",
  ),
  t(
    "Čí dcerou byla podle pověsti kněžna Libuše?",
    "Knížete Kroka",
    [
      ["Krále Přemysla", "Přemysl byl Libušin manžel, ne otec. A králem nebyl — byl to oráč."],
      ["Ducha hor Krakonoše", "Krakonoš je postava z jiné pověsti, z Krkonoš. Libušiným otcem nebyl."],
      ["Kronikáře Kosmy", "Kosmas žil mnohem později a o Libuši jen psal ve své kronice."],
    ],
    "Libušin otec vládl Čechám ještě před ní.",
    "Po otcově smrti se vlády ujala Libuše, otec byl tedy také vládce. Vyřaď manžela, ducha hor i spisovatele, který o Libuši jen psal.",
    "Libuše byla podle pověsti dcerou knížete Kroka. Po jeho smrti vládla jako kněžna. Přemysl byl její manžel a Kosmas o ní až mnohem později napsal do kroniky.",
  ),
  t(
    "Odkud pocházel Přemysl Oráč, než pro něj přijeli Libušini poslové?",
    "Ze vsi Stadice",
    [
      ["Z hory Blaník", "Na Blaníku spí rytíři, Přemysl tam nežil."],
      ["Z Krkonoš", "Krkonoše patří Krakonošovi. Přemysl byl oráč z vesnice."],
      ["Z Vyšehradu", "Na Vyšehradě sídlila Libuše — odtud poslové teprve vyjeli pro Přemysla."],
    ],
    "Přemysl oral pole v malé vesnici.",
    "Poslové vyjeli z Libušina hradu a hledali oráče u pluhu. Hledej možnost, která je vesnice — ne hora, pohoří ani hrad.",
    "Přemysl oral pole ve vsi Stadice. Tam ho Libušini poslové našli a přivezli na Vyšehrad. Blaník, Krkonoše i Vyšehrad patří k jiným postavám.",
  ),
  t(
    "Co Libuše podle pověsti předpověděla, když stála na skále nad Vltavou?",
    "Vznik slavného města, jehož sláva se dotkne hvězd",
    [
      ["Příchod Blanických rytířů", "Rytíři patří k jiné pověsti. Libuše viděla budoucí město."],
      ["Konec vlády Přemyslovců", "Libuše rod Přemyslovců teprve zakládala, jeho konec neviděla."],
      ["Narození Krakonoše v horách", "Krakonoš je duch Krkonoš z jiné pověsti, Libušina věštba se ho netýká."],
    ],
    "Libuše stála na skále nad řekou a dívala se do budoucnosti.",
    "Na místě, kam ukazovala, dnes stojí naše hlavní město s hradem. Co tedy předpověděla, že na tom místě vznikne?",
    "Podle pověsti Libuše z vyšehradské skály předpověděla vznik slavného města — Prahy. Věštba se splnila: Praha je dnes hlavní město s Pražským hradem.",
  ),
  t(
    "Jak se Krakonoš podle pověstí zachová k pyšnému a lakomému člověku?",
    "Potrestá ho",
    [
      ["Obdaruje ho pokladem", "Dary dává Krakonoš spíš chudým a poctivým, pyšným ne."],
      ["Nevšímá si ho", "Krakonoš si lidí v horách všímá a zlé chování nenechá bez odezvy."],
      ["Stane se jeho přítelem", "Pýcha a lakota se Krakonošovi nelíbí, s takovým člověkem se nekamarádí."],
    ],
    "Krakonoš dbá v horách na spravedlnost.",
    "Pýcha i lakota jsou špatné vlastnosti. Jak se k takovému člověku zachová spravedlivý pán hor, který dobré odměňuje?",
    "Krakonoš je v pověstech spravedlivý: dobré odměňuje a zlé trestá. Pyšný a lakomý člověk si proto od něj odnese trest, ne odměnu.",
  ),
  t(
    "Jak se Krakonoš podle pověstí zachová k chudému a poctivému poutníkovi?",
    "Pomůže mu",
    [
      ["Potrestá ho", "Trest čeká pyšné a lakomé, ne poctivé chudáky."],
      ["Zažene ho z hor", "Krakonoš nevyhání dobré lidi, naopak je chrání."],
      ["Promění ho v kámen", "Proměna v kámen by byla trest — a poctivý poutník nic zlého neudělal."],
    ],
    "Poutník je chudý, ale poctivý — tyhle vlastnosti si Krakonoš cení.",
    "Krakonoš dobré odměňuje a zlé trestá. Do které skupiny patří poctivý chudák, a co mu tedy duch hor udělá?",
    "Poctivost je dobrá vlastnost, a proto Krakonoš chudému poctivému poutníkovi v horách pomůže — třeba mu ukáže cestu nebo ho obdaruje. Trest čeká jen zlé lidi.",
  ),
  t(
    "Kde spíš najdeš staré listiny a úřední dokumenty o svém městě?",
    "V archivu",
    [
      ["V muzeu", "Muzeum vystavuje hlavně předměty a fotografie. Úřední listiny se ukládají jinde."],
      ["V galerii", "Galerie vystavuje obrazy a sochy, ne úřední papíry."],
      ["Ve školní knihovně", "Ve školní knihovně jsou knihy k půjčování, ne původní staré listiny."],
    ],
    "Listiny a úřední dokumenty jsou psané papíry, ne předměty.",
    "Jedno místo sbírá věci k prohlížení, druhé hlavně staré papíry — smlouvy, zápisy a listiny. Které z nabízených míst je to druhé?",
    "Staré listiny, smlouvy a úřední zápisy se ukládají v archivu. Muzeum vystavuje předměty, galerie obrazy a knihovna půjčuje knihy.",
  ),
  t(
    "Kde spíš uvidíš starý kroj, kolovrat a fotografie svého města?",
    "V muzeu",
    [
      ["V archivu", "Archiv uchovává hlavně písemné dokumenty, kroj ani kolovrat tam nevystavují."],
      ["Na obecním úřadě", "Úřad vyřizuje dnešní záležitosti obyvatel, sbírky starých věcí nemá."],
      ["V knihkupectví", "Knihkupectví prodává nové knihy, staré předměty nevystavuje."],
    ],
    "Kroj a kolovrat jsou věci, které si můžeš prohlédnout.",
    "Hledej místo, kde jsou staré předměty ve vitrínách a kam se chodí na výstavy. Není to místo pro papíry ani obchod.",
    "Kroje, nástroje jako kolovrat a staré fotografie uchovává a vystavuje muzeum. Archiv sbírá hlavně psané dokumenty.",
  ),
  t(
    "Kdo byli ve středověku nejčastěji kronikáři?",
    "Mniši v klášterech",
    [
      ["Vojáci na hradech", "Vojáci hlídali a bojovali, psát většinou neuměli."],
      ["Kupci na tržišti", "Kupci obchodovali. Na psaní kronik neměli čas ani vzdělání."],
      ["Rolníci na poli", "Rolníci tvrdě pracovali na poli a číst ani psát většinou neuměli."],
    ],
    "Ve středověku umělo číst a psát jen málo lidí.",
    "Hledej lidi, kteří žili v klidu za zdmi, měli knihy a psaní bylo součástí jejich práce. Kde takoví lidé bydleli?",
    "Ve středověku uměl číst a psát málokdo. Mniši to uměli, v klášterech měli knihy i klid na práci — proto kroniky psali nejčastěji právě oni.",
  ),
  t(
    "Jak se pověsti šířily dřív, než je někdo zapsal do knih?",
    "Vyprávěly se ústně z generace na generaci",
    [
      ["Posílaly se poštou", "Pošta vznikla mnohem později a dopis by musel někdo umět napsat i přečíst."],
      ["Vysílaly se v rozhlase", "Rozhlas vznikl až ve 20. století, pověsti jsou mnohem starší."],
      ["Tiskly se v novinách", "Noviny existují teprve několik set let. Pověsti se předávaly dávno předtím."],
    ],
    "Než lidé uměli psát a tisknout, museli si příběhy předávat jinak.",
    "Představ si babičku, která u kamen vypráví vnoučatům, a ta pak jednou vyprávějí svým dětem. Jak se tedy příběh šířil?",
    "Pověsti se dlouho předávaly jen mluveným slovem — rodiče je vyprávěli dětem a ty zase svým dětem. Proto se v různých krajích liší detaily téže pověsti.",
  ),
  t(
    "Jaký druh pramene je stará fotografie nebo předmět z muzea?",
    "Hmotný pramen",
    [
      ["Písemný pramen", "Písemný pramen je text, třeba kronika nebo listina. Fotografie ani předmět text nejsou."],
      ["Ústní pramen", "Ústní pramen je vyprávění pamětníka. Předmět nikdo nevypráví, můžeš si ho prohlédnout."],
      ["Není to historický pramen", "Každá věc z minulosti nám o ní něco řekne, takže je historickým pramenem."],
    ],
    "Fotografii i předmět můžeš vzít do ruky a prohlédnout si je.",
    "Rozliš tři druhy pramenů: text, vyprávění a věc, kterou lze uchopit. Kam z nich patří stará fotografie nebo předmět z vitríny?",
    "Stará fotografie nebo předmět je hmotný pramen — věc z minulosti, kterou si můžeš prohlédnout. Kronika je pramen písemný, vyprávění pamětníka pramen ústní.",
  ),
  t(
    "Babička ti vypráví, jak za jejího dětství chodily děti do školy pěšky přes kopec. Jaký je to pramen?",
    "Ústní pramen",
    [
      ["Písemný pramen", "Babička nic nečte z knihy ani nepíše — mluví o tom, co zažila."],
      ["Hmotný pramen", "Hmotný pramen je věc, třeba stará aktovka. Vyprávění do ruky vzít nejde."],
      ["Není to historický pramen", "Vzpomínky pamětníka jsou cenným pramenem — babička to sama zažila."],
    ],
    "Babička o minulosti mluví, nečte z knihy.",
    "Prameny se dělí podle toho, jak se k nám informace dostane: textem, věcí, nebo mluveným slovem. Který způsob použila babička?",
    "Babiččino vyprávění je ústní pramen — informace přichází mluveným slovem od člověka, který dobu sám zažil. Nejde o text ani o předmět.",
  ),
];

const POOL_L3: PracticeTask[] = [
  t(
    "Kroniku, vyprávění praprababičky a starý hrnec z vykopávek máme roztřídit podle druhu pramene. Kam patří kronika?",
    "Písemný pramen",
    [
      ["Hmotný pramen", "Kroniku lze sice vzít do ruky, ale cenné je v ní to, co je napsané — proto patří mezi texty."],
      ["Ústní pramen", "Ústní pramen je mluvené vyprávění. Kronika je zapsaná."],
      ["Žádný z pramenů", "Kronika je jeden z nejdůležitějších pramenů — zaznamenává události obce."],
    ],
    "Kronika je text zapsaný na papíře.",
    "Postupuj ve dvou krocích: nejdřív urči, jestli je kronika věc, text, nebo vyprávění. Pak k tomu přiřaď název skupiny pramenů.",
    "Kronika je psaný text, proto patří mezi písemné prameny. Starý hrnec je hmotný pramen a vyprávění praprababičky je pramen ústní.",
  ),
  t(
    "Kroniku, vyprávění praprababičky a starý hrnec z vykopávek máme roztřídit podle druhu pramene. Kam patří starý hrnec?",
    "Hmotný pramen",
    [
      ["Písemný pramen", "Na hrnci nic napsaného není. Písemný pramen je text, třeba kronika."],
      ["Ústní pramen", "Hrnec nic nevypráví. Ústní pramen je vzpomínka, kterou někdo řekne."],
      ["Žádný z pramenů", "I obyčejný hrnec prozradí, jak lidé dříve vařili a jedli. Je to pramen."],
    ],
    "Hrnec je skutečný předmět z vykopávek.",
    "Nejdřív urči, jestli hrnec čteš, posloucháš, nebo držíš v ruce. Podle toho vyber skupinu pramenů, kam patří.",
    "Starý hrnec je věc, kterou lze vzít do ruky, proto patří mezi hmotné prameny. Kronika je pramen písemný a vyprávění pramen ústní.",
  ),
  t(
    "Kroniku, vyprávění praprababičky a starý hrnec z vykopávek máme roztřídit podle druhu pramene. Kam patří vyprávění praprababičky?",
    "Ústní pramen",
    [
      ["Písemný pramen", "Praprababička nic nepíše — vypráví. Písemný pramen je zapsaný text."],
      ["Hmotný pramen", "Vyprávění není věc, kterou bys vzal do ruky. Hmotný je třeba ten hrnec."],
      ["Žádný z pramenů", "Vzpomínky pamětníků jsou pramen — dozvíme se z nich, jak se dříve žilo."],
    ],
    "Vyprávění je mluvené slovo.",
    "Nejdřív urči, jestli vyprávění čteš, posloucháš, nebo držíš v ruce. Pak přiřaď, do které skupiny pramenů to patří.",
    "Vyprávění praprababičky je mluvené svědectví, proto patří mezi ústní prameny. Kronika je pramen písemný a hrnec pramen hmotný.",
  ),
  t(
    "Ve vsi Stadice stojí pomník Přemysla Oráče. Proč místní lidé vyprávějí pověst o Přemyslovi raději než jinde?",
    "Protože se pověst váže právě k jejich vsi",
    [
      ["Protože ve Stadicích spí Blaničtí rytíři", "Rytíři spí v hoře Blaník, ne ve Stadicích."],
      ["Protože Stadice jsou hlavní město", "Stadice jsou malá vesnice, hlavním městem je Praha."],
      ["Protože ve Stadicích vládne Krakonoš", "Krakonoš vládne Krkonoším, Stadice leží jinde."],
    ],
    "Pověsti se často drží konkrétního místa.",
    "Vzpomeň si, kde podle pověsti Přemysl oral, když pro něj přijeli poslové. Proč by na to byli lidé z toho místa hrdí?",
    "Pověst o Přemyslovi se odehrává ve Stadicích — tam ho poslové našli u pluhu. Pověsti patří k minulosti regionu, a proto si je lidé z daného místa vyprávějí a připomínají pomníkem.",
  ),
  t(
    "V čem je hlavní rozdíl mezi Krakonošem a Blanickými rytíři, i když všichni žijí v horách?",
    "Krakonoš s lidmi jedná pořád, rytíři jen spí a čekají na velkou nouzi",
    [
      ["Krakonoš spí v hoře, rytíři vládnou Krkonoším", "Je to prohozené: v hoře spí rytíři a Krkonoším vládne Krakonoš."],
      ["Všichni dělají totéž, jen v jiných horách", "Nedělají totéž — jeden jedná s lidmi, druzí čekají ve spánku."],
      ["Krakonoš je člověk, rytíři jsou duchové hor", "Je to naopak: duch hor je Krakonoš, rytíři jsou spící bojovníci."],
    ],
    "Porovnej, co Krakonoš a rytíři v pověstech právě teď dělají.",
    "Jeden z nich chodí po horách, trestá pyšné a pomáhá chudým. Druzí se nehnou, dokud nepřijde výjimečná chvíle. Kdo je kdo?",
    "Krakonoš je stále činný duch hor — potkává lidi, pomáhá poctivým a trestá pyšné. Blaničtí rytíři naopak spí v hoře a probudí se, až bude zemi nejhůř.",
  ),
  t(
    "Chceš zjistit, jak vypadala tvá ulice před padesáti lety, ale nemáš žádné fotografie ani dokumenty. Koho se nejspíš zeptáš?",
    "Nejstaršího souseda, který si to pamatuje",
    [
      ["Kronikáře ze středověku", "Středověký kronikář žil před stovkami let, tvou ulici před padesáti lety neviděl."],
      ["Krakonoše", "Krakonoš je postava z pověsti, skutečné informace ti nedá."],
      ["Nikoho — bez fotografie se to zjistit nedá", "Když chybí fotky i dokumenty, zbývá ještě vyprávění pamětníků."],
    ],
    "Když chybí fotky i dokumenty, zbývá ještě jeden druh pramene.",
    "Zamysli se, kdo mohl tvou ulici před padesáti lety sám vidět a dodnes žije poblíž. Takový člověk je živý pramen.",
    "Chybí-li písemné i hmotné prameny, zbývá pramen ústní — vzpomínky pamětníků. Nejstarší soused mohl ulici před padesáti lety sám vidět a může o ní vyprávět.",
  ),
  t(
    "Píšeš do sešitu, co se dnes stalo ve třídě, aby si to za sto let mohli přečíst budoucí žáci. Jaký pramen tím vytváříš?",
    "Písemný pramen",
    [
      ["Hmotný pramen", "Sešit je sice věc, ale důležité je, co do něj napíšeš — proto jde o text."],
      ["Ústní pramen", "Nevyprávíš nahlas, píšeš. Ústní pramen je mluvené slovo."],
      ["Žádný, sešit není pramen", "I dnešní zápis se jednou stane pramenem — budoucí žáci se z něj dozvědí o dnešku."],
    ],
    "Tvůj zápis si za sto let někdo přečte.",
    "Porovnej se starým kronikářem: i on psal o tom, co se stalo. Do jaké skupiny pramenů patří jeho kronika — a tedy i tvůj zápis?",
    "Psaný zápis o dnešní události je písemný pramen. Děláš totéž co kronikář, jen místo obce zapisuješ život třídy. Budoucí žáci se z něj o dnešku dozvědí.",
  ),
  t(
    "Která dvojice postav z pověstí je spojená se založením rodu, který pak vládl Čechám po staletí?",
    "Libuše a Přemysl Oráč",
    [
      ["Krakonoš a Blaničtí rytíři", "Krakonoš a rytíři patří každý do jiné pověsti a žádný rod nezaložili."],
      ["Libuše a Krakonoš", "Libuše se vdala za oráče, ne za ducha hor."],
      ["Přemysl Oráč a Blaničtí rytíři", "Rytíři spí v Blaníku a s Přemyslem žádný rod nezaložili."],
    ],
    "Rod zakládá manželský pár.",
    "Vzpomeň si, kdo si koho vzal: kněžna z hradu si nechala přivézt muže od pluhu. Jejich potomci pak vládli staletí.",
    "Libuše a Přemysl Oráč byli podle pověsti manželé a založili rod Přemyslovců. Krakonoš ani Blaničtí rytíři s tímto příběhem nesouvisejí.",
  ),
  t(
    "Muzeum vystavuje starý kočár, v archivu je listina o jeho majiteli a praprababička si pamatuje, jak se v něm jezdilo na trh. Kolik různých druhů pramenů tu je?",
    "Tři — hmotný, písemný i ústní",
    [
      ["Dva — jen hmotný a písemný", "Zapomněl jsi na vzpomínky praprababičky — to je třetí druh pramene."],
      ["Jeden — všechno je to vyprávění", "Kočár ani listina nejsou vyprávění. Každý zdroj patří jinam."],
      ["Žádný — kočár není pramen", "Kočár, listina i vzpomínky jsou prameny, každý jiného druhu."],
    ],
    "Rozeber popis na jednotlivé zdroje: kočár, listina, vzpomínka.",
    "U každého zdroje zvlášť urči druh pramene: je to věc, text, nebo vyprávění? Pak spočítej, kolik různých druhů ti vyšlo.",
    "Kočár v muzeu je hmotný pramen, listina v archivu písemný pramen a vzpomínky praprababičky pramen ústní. Každý je jiného druhu, proto jsou tu všechny tři.",
  ),
  t(
    "Proč se příběh o Libušině věštbě řadí mezi pověsti, a ne mezi doložené historické zprávy?",
    "Protože obsahuje věštbu budoucnosti, kterou nelze doložit",
    [
      ["Protože se odehrává v horách", "Libušin příběh se neodehrává v horách — a místo děje o tom stejně nerozhoduje."],
      ["Protože v něm nevystupuje žádná skutečná osoba", "Rod Přemyslovců opravdu existoval, skutečné jádro tu je. Rozhoduje něco jiného."],
      ["Protože je příliš krátký", "Délka příběhu nerozhoduje o tom, jestli je to pověst."],
    ],
    "Zeptej se sám sebe: co v příběhu o Libuši se ve skutečném životě stát nemůže?",
    "Historická zpráva obsahuje jen to, co se dá prokázat, třeba listinou. Najdi v Libušině příběhu nadpřirozenou schopnost, kterou žádná listina nepotvrdí.",
    "Příběh o Libuši má skutečné jádro — rod Přemyslovců existoval. Obsahuje ale i nadpřirozenou věc: předpovídání budoucnosti. To se prokázat nedá, a proto jde o pověst.",
  ),
  t(
    "Co bys hledal v archivu, kdybys chtěl zjistit přesné jméno prvního majitele domu a rok, kdy dům postavili?",
    "Starou stavební listinu nebo smlouvu",
    [
      ["Vyprávění souseda, který dům nikdy neviděl", "Kdo dům neviděl, nemůže o něm nic spolehlivého říct — a přesné jméno a rok už vůbec ne."],
      ["Fotografii jiného domu", "Fotka jiného domu o tvém domě nic neřekne."],
      ["Pověst o založení domu", "Pověst je smíchaná s fantazií, přesná jména a data z ní nezjistíš."],
    ],
    "Přesné jméno a rok se nejspolehlivěji zjistí z úředního zápisu.",
    "Když se kdysi stavěl dům, úřad vše sepsal: kdo staví, kde a kdy. Jaký papír by takový zápis mohl být?",
    "Přesné údaje o stavbě domu zapsal úřad do listiny nebo smlouvy, které se uchovávají v archivu. Je to písemný pramen s ověřenými údaji — na rozdíl od pověsti nebo vyprávění.",
  ),
  t(
    "Co mají společného muzeum, archiv i vyprávění pamětníků, i když se od sebe liší?",
    "Všechny nám pomáhají poznat, jak lidé žili v minulosti",
    [
      ["Všechny obsahují jen pověsti a pohádky", "Archiv ani muzeum pohádky nesbírají, uchovávají skutečné doklady."],
      ["Všechny vznikly teprve nedávno", "Vzpomínky, listiny i předměty pocházejí z minulosti, o to tu jde."],
      ["Všechny se nacházejí jen v Praze", "Muzea i archivy jsou v mnoha městech a pamětníky najdeš v každé obci."],
    ],
    "Muzeum, archiv i pamětník jsou různé druhy pramenů.",
    "Každý z nich ukazuje kus minulosti jinou cestou — věcí, papírem nebo vyprávěním. K čemu tedy všechny tři slouží?",
    "Muzeum (hmotné prameny), archiv (písemné prameny) i pamětníci (ústní prameny) slouží stejnému cíli: pomáhají nám poznat, jak lidé dříve žili a jak se jejich okolí měnilo.",
  ),
  t(
    "Ve vesnici se vypráví, že lípu na návsi zasadil sám Přemysl Oráč. V obecní kronice je ale zapsáno, že ji zasadili místní hasiči na oslavu výročí sboru. Kterému zdroji budeš o skutečné události věřit víc?",
    "Kronice, protože zapisuje skutečné události",
    [
      ["Vyprávění, protože je zajímavější", "Zajímavost neznamená pravdivost — pověst se mísí s fantazií."],
      ["Oběma úplně stejně", "Pověst a kronika nemají stejnou váhu: jen jedna zapisuje ověřené události."],
      ["Ani jednomu, pravdu nelze zjistit", "Právě k tomu kronika slouží — zapisuje, co se v obci opravdu stalo."],
    ],
    "Porovnej, jak vzniká pověst a jak vzniká zápis v kronice.",
    "Pověst se dlouho předávala ústně a každý vypravěč mohl něco přidat. Kronikář zapisoval to, co se v obci opravdu stalo. Který zdroj je tedy spolehlivější?",
    "Kronika je písemný pramen: kronikář do ní zapisuje události tak, jak se staly. Pověst se mění vyprávěním a mísí se s fantazií. O skutečné události proto víc vypoví kronika.",
  ),
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool);
}

export const MINULOSTREGIONUPOVESTI: TopicMetadata[] = [
  {
    id: "g3-prvouka-lide-a-cas-minulost-a-soucasnost-minulost-naseho-regionu-povesti",
    title: "Minulost našeho regionu, pověsti",
    studentTitle: "Historie a pověsti",
    subject: "prvouka",
    category: "Lidé a čas",
    topic: "Minulost a současnost",
    briefDescription: "Poznáš historii svého regionu a nejznámější české pověsti.",
    keywords: ["pověsti", "region", "minulost", "Libuše", "Přemysl", "Krakonoš", "Blaník"],
    goals: [
      "Porozumět pojmu pověst a odlišit ho od pohádky a historického faktu.",
      "Vědět, kde a jak se dozvídáme o minulosti svého regionu (muzeum, archiv, kronika, starší lidé).",
      "Znát nejznámější české pověsti — o Libuši a Přemyslu Oráči, Blanických rytířích a Krakonošovi.",
      "Rozlišit hmotný, písemný a ústní historický pramen a přiřadit k nim konkrétní příklady.",
    ],
    boundaries: [
      "Detailní historické datování a letopočty nejsou součástí obsahu pro 3. ročník.",
    ],
    gradeRange: [3, 3],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Pověst = příběh z minulosti smíchaný s historií a fantazií. Libuše = kněžna, Přemysl = oráč. Blaničtí rytíři spí v hoře. Krakonoš vládne Krkonoším. Prameny: hmotný (předmět), písemný (text), ústní (vyprávění).",
      steps: [
        "Vzpomeň si, co víš o dané pověsti nebo historickém prameni.",
        "Pověst má vždy základ v historii, ale je doplněna fantazií.",
        "Historické prameny: muzeum a předměty (hmotný), archiv a kronika (písemný), starší lidé (ústní).",
        "Libuše a Přemysl = zakladatelé Přemyslovců. Blaničtí rytíři = spí v Blaníku. Krakonoš = vládce Krkonoš.",
      ],
      commonMistake:
        "Pověst není pohádka — pohádka je zcela vymyšlená, pověst se váže ke skutečnému místu nebo postavě.",
      example:
        "Pověst o Blanických rytířích: rytíři spí v hoře Blaník a probudí se, až bude Čechám nejhůře.",
    },
  },
];
