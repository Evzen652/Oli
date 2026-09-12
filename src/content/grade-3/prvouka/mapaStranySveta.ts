import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "@/content/grade-3/_shared";

// ─────────────────────────────────────────────────────────
// Disjunktní pooly obtížnosti (L1 < L2 < L3), select_one.
//   L1 = rozpoznání: poloha N/J/V/Z na mapě, co je kompas/buzola,
//        co je legenda, co je měřítko — izolovaná fakta a definice.
//   L2 = aplikace: mezilehlé světové strany (SV/SZ/JV/JZ) a jejich poloha
//        v rohu mapy, plán vs. mapa (rozlišení podle situace), barvy
//        na fyzické mapě → jaký terén, základní určení severu podle
//        slunce v poledne.
//   L3 = transfer (2 kroky prostorové představivosti): otočení těla
//        o 180°/90° a určení strany po pravici/levici nebo směru,
//        skládání dvou mezilehlých směrů po otočce o 180°, kombinace
//        barva+poloha na mapě, rozdíl mezi tím, co řekne legenda
//        a co měřítko.
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
    "Kde je na mapě světová strana sever?",
    "Nahoře",
    [
      ["Dole", "Dolní okraj mapy patří opačné straně — té, která leží naproti severu."],
      ["Vpravo", "Pravý okraj mapy patří straně, kde ráno vychází slunce."],
      ["Vlevo", "Levý okraj mapy patří straně, kde slunce večer zapadá."],
    ],
    "Na mapách se sever vždycky kreslí směrem vzhůru.",
    "Proto se mapa při čtení nikdy neotáčí vzhůru nohama. Když šipka na mapě míří k hornímu okraji, míří k severu. U kterého okraje mapy tedy sever hledat?",
    "Na většině map platí dohodnuté pravidlo: sever je nahoře, jih je dole, východ je vpravo a západ je vlevo. Díky téhle dohodě se na každé mapě orientujeme stejně.",
  ),
  t(
    "Kde je na mapě světová strana jih?",
    "Dole",
    [
      ["Nahoře", "Horní okraj patří severu. Jih leží přesně naproti němu."],
      ["Vlevo", "Levý okraj mapy patří západu, ne protilehlé straně severu."],
      ["Vpravo", "Pravý okraj mapy patří východu, ne protilehlé straně severu."],
    ],
    "Jih je přesný opak severu.",
    "Sever se kreslí k hornímu okraji mapy. Když je jeho opak přesně naproti, musí ležet u toho druhého vodorovného okraje — ne u boků mapy.",
    "Na standardní mapě je jih dole. Leží přesně naproti severu, který je nahoře, protože obě strany tvoří dvojici protikladů.",
  ),
  t(
    "Kde je na mapě světová strana východ?",
    "Vpravo",
    [
      ["Vlevo", "Levý okraj patří straně, kde slunce zapadá, ne kde vychází."],
      ["Nahoře", "Horní okraj mapy je vyhrazený severu."],
      ["Dole", "Dolní okraj mapy je vyhrazený jihu."],
    ],
    "Slunce ráno vychází právě na téhle straně.",
    "Postav se čelem k severu — tedy k hornímu okraji mapy. Ranní slunce budeš mít po pravé ruce. Ke kterému okraji mapy tahle ruka ukazuje?",
    "Na mapě je východ vpravo. Slunce tam ráno vychází, proto se říká „východ slunce“. Na mapě ho proto najdeme na pravé straně.",
  ),
  t(
    "Kde je na mapě světová strana západ?",
    "Vlevo",
    [
      ["Vpravo", "Pravý okraj patří straně, kde slunce vychází, ne kde zapadá."],
      ["Dole", "Dolní okraj mapy patří jihu, ne straně večerního slunce."],
      ["Nahoře", "Horní okraj mapy patří severu, ne straně večerního slunce."],
    ],
    "Slunce večer zapadá právě na téhle straně.",
    "Východ je na mapě u pravého okraje a tahle strana leží přesně naproti němu. U kterého okraje ji tedy najdeš — u bočního, nebo u vodorovného?",
    "Na mapě je západ vlevo. Slunce každý večer zapadá na západě, a protože východ je vpravo, jeho protiklad musí být na levé straně.",
  ),
  t(
    "Na co ukazuje magnetická ručička kompasu?",
    "Na magnetický sever",
    [
      ["Na jih", "Barevný hrot ručičky míří opačným směrem — k protilehlé straně."],
      ["Na nejbližší město", "Kompas o městech nic neví. Reaguje jen na magnetismus Země."],
      ["Na východ, odkud vychází slunce", "Ručička na slunce nereaguje. Ukazuje pořád stejným směrem i v noci."],
    ],
    "Ať kompasem otočíš jakkoli, ručička se vrátí pořád do stejného směru.",
    "Ručička je malý magnet a přitahuje ji magnetické pole Země. To má dva póly a ručička míří k tomu, který leží nahoře na glóbusu. Který směr to je?",
    "Magnetická ručička kompasu vždy ukazuje na magnetický sever, protože ji natáčí zemské magnetické pole. Právě proto se kompas hodí k orientaci v přírodě.",
  ),
  t(
    "Jaký přístroj používáme k určení světových stran v terénu?",
    "Kompas",
    [
      ["Teploměr", "Teploměr měří teplotu vzduchu, o směru neřekne nic."],
      ["Dalekohled", "Dalekohled přiblíží vzdálené předměty, ale neukáže, kde je sever."],
      ["Barometr", "Barometr měří tlak vzduchu a pomáhá odhadnout počasí, ne směr."],
    ],
    "Ten přístroj má otočnou magnetickou ručičku.",
    "Turisté ho nosí v batohu spolu s mapou a používají ho, když v lese ztratí přehled o směru. Vyřaď přístroje, které měří počasí nebo přibližují obraz.",
    "K určení světových stran v terénu používáme kompas. Jeho magnetická ručička míří na sever, a od severu pak odvodíme i ostatní směry.",
  ),
  t(
    "Co je kompas?",
    "Přístroj s magnetickou ručičkou, která vždy ukazuje na sever",
    [
      ["Přístroj na měření vzdálenosti mezi městy", "Vzdálenost se na mapě zjistí z měřítka, ne z tohoto přístroje."],
      ["Přístroj na měření teploty vzduchu", "Teplotu měří teploměr. Tenhle přístroj měří směr, ne teplo."],
      ["Přístroj na kreslení map", "Mapy kreslí kartografové. Tenhle přístroj se používá při jejich čtení v terénu."],
    ],
    "Rozhodni podle toho, co ten přístroj měří — směr, délku, nebo teplo.",
    "Uvnitř má otočnou ručičku, kterou natáčí magnetické pole Země, takže pořád míří k jednomu bodu. Vyřaď možnosti, které mluví o měření vzdálenosti nebo teploty.",
    "Kompas je přístroj s magnetickou ručičkou, která vždy ukazuje na sever. Podle severu pak snadno určíme i ostatní světové strany.",
  ),
  t(
    "Jak se jinak říká kompasu?",
    "Buzola",
    [
      ["Barometr", "Barometr měří tlak vzduchu, žádnou magnetickou ručičku k určení směru nemá."],
      ["Teploměr", "Teploměr měří teplotu, s hledáním severu nesouvisí."],
      ["Dalekohled", "Dalekohled jen přibližuje, směr neurčí."],
    ],
    "Turisté tohle slovo používají místo slova kompas.",
    "Hledej mezi nabídkou jediný název, který neoznačuje měřicí přístroj na počasí ani optickou pomůcku. Ostatní tři měří něco úplně jiného než směr.",
    "Buzola je jiný název pro kompas — přístroj s magnetickou ručičkou, která ukazuje na sever. Oba výrazy znamenají totéž.",
  ),
  t(
    "Co znamená legenda na mapě?",
    "Vysvětlivky — co znamenají jednotlivé značky a barvy na mapě",
    [
      ["Název státu vyznačeného na mapě", "Název státu bývá napsaný přímo v mapě, ne v tabulce se symboly."],
      ["Vzdálenost mezi dvěma městy", "Vzdálenost se počítá z měřítka, ne z vysvětlivek."],
      ["Rok, kdy byla mapa vydána", "Rok vydání je jen údaj o stáří mapy, ke čtení značek nepomůže."],
    ],
    "Bývá v rohu mapy a je v ní seznam symbolů s popiskem.",
    "Kdybys ji zakryl, nevěděl bys, jestli modrá čára znamená řeku, nebo hranici. K čemu tedy taková tabulka na mapě slouží?",
    "Legenda (vysvětlivky) je část mapy, která vysvětluje, co znamenají použité značky, symboly a barvy. Bez ní bychom mapu nedokázali přečíst.",
  ),
  t(
    "K čemu legenda na mapě slouží?",
    "Abychom poznali, co znamenají značky a barvy použité na mapě",
    [
      ["Abychom zjistili, kolik obyvatel má daný stát", "Počty obyvatel se hledají v tabulkách nebo encyklopedii, ne ve vysvětlivkách mapy."],
      ["Abychom si spočítali skutečnou vzdálenost dvou míst", "K přepočtu vzdálenosti slouží měřítko, ne vysvětlivky."],
      ["Abychom poznali, kdo mapu nakreslil", "Jméno autora bývá v tiráži. Vysvětlivky se týkají obsahu mapy."],
    ],
    "Funguje jako slovníček k symbolům na mapě.",
    "Kdykoli narazíš na neznámou značku — tečku, křížek nebo šrafování — hledáš, co znamená. Kde se to dozvíš, a je to informace o významu, nebo o vzdálenosti?",
    "Legenda slouží k tomu, abychom poznali, co znamenají jednotlivé značky a barvy na mapě. Bez ní by symboly zůstaly nesrozumitelné.",
  ),
  t(
    "Co je měřítko mapy?",
    "Poměr, o kolik je mapa zmenšená oproti skutečnosti",
    [
      ["Název oblasti zobrazené na mapě", "Název území bývá v záhlaví mapy, o zmenšení nic neříká."],
      ["Tabulka s výškami hor", "Výšky hor bývají napsané u vrcholů. Tohle se týká celé mapy najednou."],
      ["Popis hranice státu", "Hranice je na mapě nakreslená čárou. Tenhle údaj se týká zmenšení."],
    ],
    "Mapa nemůže být stejně velká jako skutečná krajina.",
    "Celý kraj se musel vejít na kus papíru, takže ho někdo mnohokrát zmenšil. Zápis jako 1:100 000 přesně říká kolikrát. O čem tedy tenhle údaj vypovídá?",
    "Měřítko mapy říká, kolikrát je mapa zmenšená oproti skutečnosti. Například 1:100 000 znamená, že 1 cm na mapě odpovídá 1 km ve skutečnosti.",
  ),
  t(
    "Co ti prozradí měřítko mapy?",
    "O kolik je mapa zmenšená oproti skutečnosti",
    [
      ["Co znamenají barvy a značky na mapě", "Významy barev a značek vysvětluje legenda, ne tenhle údaj."],
      ["Kdo mapu nakreslil a kdy", "Autor a rok jsou jen doprovodné údaje, s velikostí zobrazení nesouvisejí."],
      ["Kolik měst je na mapě zakresleno", "Města by sis musel spočítat sám. Tenhle údaj se týká zmenšení."],
    ],
    "Tenhle údaj se týká velikosti, ne významu symbolů.",
    "Zápis 1:100 000 znamená, že jeden centimetr na papíře odpovídá sto tisícům centimetrů v krajině. Je to tedy informace o rozměrech, nebo o významu značek?",
    "Měřítko mapy prozradí, o kolik je mapa zmenšená oproti skutečnosti, a umožní přepočítat vzdálenosti. Co znamenají značky a barvy, řekne naopak legenda.",
  ),
  t(
    "Kolik hlavních světových stran rozeznáváme?",
    "Čtyři",
    [
      ["Tři", "Tři je málo — každá strana má svůj protiklad, takže musí vyjít sudý počet."],
      ["Pět", "Pět nevyjde: hlavní strany tvoří dvojice protikladů, a těch je sudý počet."],
      ["Osm", "Osm vyjde, až když k hlavním stranám přidáš i ty mezilehlé (SV, JV, JZ, SZ)."],
    ],
    "Zkus si je vyjmenovat a přitom počítat na prstech.",
    "Jsou to dvě dvojice protikladů: jedna míří nahoru a dolů na mapě, druhá doprava a doleva. Kolik jich dohromady napočítáš, než začneš opakovat?",
    "Rozeznáváme čtyři hlavní světové strany: sever, jih, východ a západ. Tvoří dvě dvojice protikladů. Kromě nich existují ještě čtyři mezilehlé strany (SV, JV, JZ, SZ).",
  ),
];

const POOL_L2: PracticeTask[] = [
  t(
    "Co je severovýchod (SV)?",
    "Mezilehlá světová strana mezi severem a východem",
    [
      ["Mezilehlá světová strana mezi severem a západem", "To je severozápad — druhé písmeno zkratky by bylo Z, ne V."],
      ["Jiný název pro sever", "Kdyby to byl jen jiný název, zkratka by měla jediné písmeno."],
      ["Světová strana pod jihem", "Pod jihem už žádná další strana není. Jih je krajní bod mapy dole."],
    ],
    "Zkratka SV je složená z prvních písmen dvou hlavních stran.",
    "Rozšifruj obě písmena zvlášť a najdi strany, které začínají na S a na V. Ta hledaná leží přesně mezi nimi, tedy v rohu mapy mezi horním a pravým okrajem.",
    "Severovýchod (SV) je mezilehlá světová strana ležící přesně mezi severem a východem. Její název i zkratka vznikly spojením obou hlavních stran.",
  ),
  t(
    "Co je jihozápad (JZ)?",
    "Mezilehlá světová strana mezi jihem a západem",
    [
      ["Mezilehlá světová strana mezi jihem a východem", "To je jihovýchod — druhé písmeno zkratky by bylo V, ne Z."],
      ["Jiný název pro západ", "Zkratka má dvě písmena, takže spojuje dvě strany, ne jednu."],
      ["Světová strana naproti severu", "Naproti severu je jih samotný, bez druhé složky."],
    ],
    "Zkratka JZ složí dohromady dvě hlavní strany.",
    "Vezmi obě písmena zvlášť: první patří straně u dolního okraje mapy, druhé straně u levého okraje. Hledaný směr leží přesně mezi nimi, v rohu mapy.",
    "Jihozápad (JZ) je mezilehlá světová strana mezi jihem a západem. Vznikla spojením obou hlavních stran, které jsou v její zkratce.",
  ),
  t(
    "Co je jihovýchod (JV)?",
    "Mezilehlá světová strana mezi jihem a východem",
    [
      ["Mezilehlá světová strana mezi jihem a západem", "To je jihozápad — druhé písmeno zkratky by bylo Z, ne V."],
      ["Mezilehlá světová strana mezi severem a východem", "To je severovýchod — první písmeno zkratky by bylo S, ne J."],
      ["Jiný název pro jih", "Zkratka má dvě písmena, takže jde o spojení dvou stran."],
    ],
    "Obě písmena zkratky JV patří dvěma různým hlavním stranám.",
    "První písmeno ukazuje ke spodnímu okraji mapy, druhé k pravému. Hledaný směr leží přesně mezi nimi — v rohu, kde se tyhle dva okraje potkávají.",
    "Jihovýchod (JV) je mezilehlá světová strana ležící přesně mezi jihem a východem. Obě hlavní strany jsou zapsané v její zkratce.",
  ),
  t(
    "Co je severozápad (SZ)?",
    "Mezilehlá světová strana mezi severem a západem",
    [
      ["Mezilehlá světová strana mezi severem a východem", "To je severovýchod — druhé písmeno zkratky by bylo V, ne Z."],
      ["Mezilehlá světová strana mezi jihem a západem", "To je jihozápad — první písmeno zkratky by bylo J, ne S."],
      ["Jiný název pro západ", "Zkratka má dvě písmena, takže spojuje dvě hlavní strany."],
    ],
    "Zkratka SZ se skládá z počátečních písmen dvou hlavních stran.",
    "První písmeno patří straně u horního okraje mapy, druhé straně u levého okraje. Hledaný směr míří do rohu mezi ně, ne do rohu na opačné straně.",
    "Severozápad (SZ) je mezilehlá světová strana ležící přesně mezi severem a západem. Jeho zkratka obsahuje počáteční písmena obou hlavních stran.",
  ),
  t(
    "Ve kterém rohu mapy najdeš severovýchod (SV)?",
    "Vpravo nahoře",
    [
      ["Vlevo nahoře", "Horní část sedí, boční ne — nalevo leží západ, ne východ."],
      ["Vpravo dole", "Boční část sedí, výška ne — dole leží jih, ne sever."],
      ["Vlevo dole", "Ani jedna část nesedí: nalevo je západ a dole jih."],
    ],
    "Najdi na mapě obě hlavní strany ze zkratky a podívej se, kde se potkají.",
    "První písmeno tě posune k jednomu vodorovnému okraji mapy, druhé k jednomu bočnímu. Roh, ve kterém se oba okraje setkají, je hledané místo.",
    "Severovýchod najdeš v pravém horním rohu mapy — tam, kde se potkává sever (nahoře) s východem (vpravo). Mezilehlá strana vždy leží v rohu mezi svými dvěma složkami.",
  ),
  t(
    "Ve kterém rohu mapy najdeš jihozápad (JZ)?",
    "Vlevo dole",
    [
      ["Vpravo dole", "Spodní část sedí, boční ne — napravo leží východ, ne západ."],
      ["Vlevo nahoře", "Boční část sedí, výška ne — nahoře leží sever, ne jih."],
      ["Vpravo nahoře", "Ani jedna část nesedí: napravo je východ a nahoře sever."],
    ],
    "Urči zvlášť, kde na mapě leží jih, a zvlášť, kde západ.",
    "Jedna složka tě posune k dolnímu okraji mapy, druhá k levému. Hledaný roh je přesně tam, kde se tyhle dva okraje setkávají — úhlopříčně naproti severovýchodu.",
    "Jihozápad najdeš v levém dolním rohu mapy — tam, kde se potkává jih (dole) se západem (vlevo).",
  ),
  t(
    "Ve kterém rohu mapy najdeš jihovýchod (JV)?",
    "Vpravo dole",
    [
      ["Vlevo dole", "Spodní část sedí, boční ne — nalevo je západ, ne východ."],
      ["Vpravo nahoře", "Boční část sedí, výška ne — nahoře je sever, ne jih."],
      ["Vlevo nahoře", "Ani jedna část nesedí: nalevo je západ a nahoře sever."],
    ],
    "Obě složky zkratky urči na mapě zvlášť a pak je spoj.",
    "Jedna složka tě posune k dolnímu okraji mapy, druhá k pravému. V rohu, kde se tyhle dva okraje potkají, leží hledaný směr — úhlopříčně naproti severozápadu.",
    "Jihovýchod najdeš v pravém dolním rohu mapy — tam, kde se potkává jih (dole) s východem (vpravo).",
  ),
  t(
    "Ve kterém rohu mapy najdeš severozápad (SZ)?",
    "Vlevo nahoře",
    [
      ["Vpravo nahoře", "Horní část sedí, boční ne — napravo je východ, ne západ."],
      ["Vlevo dole", "Boční část sedí, výška ne — dole je jih, ne sever."],
      ["Vpravo dole", "Ani jedna část nesedí: napravo je východ a dole jih."],
    ],
    "Rozlož zkratku na dvě strany a každou najdi na mapě zvlášť.",
    "Jedna složka tě posune k hornímu okraji mapy, druhá k levému. Roh, kde se oba okraje setkají, je hledané místo — úhlopříčně naproti jihovýchodu.",
    "Severozápad najdeš v levém horním rohu mapy — tam, kde se potkává sever (nahoře) se západem (vlevo).",
  ),
  t(
    "Co je plán (například plán třídy nebo města)?",
    "Zobrazení malé plochy, například jedné budovy nebo města",
    [
      ["Zobrazení celého státu nebo kontinentu", "Tak velké území se zobrazuje na mapě, kde už jednotlivé místnosti nejsou vidět."],
      ["Fotografie krajiny z letadla", "Fotografie není kreslené zobrazení se značkami a měřítkem."],
      ["Seznam ulic bez žádného obrázku", "Pouhý seznam by neukázal, kudy vede která ulice."],
    ],
    "Rozhoduje velikost zobrazeného území.",
    "Když vejdeš do školy, můžeš si nakreslit rozmístění tříd i chodeb. To se na zobrazení celého státu nevejde. Které území je tedy tak malé, aby šlo kreslit podrobně?",
    "Plán zobrazuje malou plochu podrobně — například pokoj, školu nebo město. Právě díky malé ploše může být tak detailní.",
  ),
  t(
    "Co je mapa (například mapa kraje nebo státu)?",
    "Zobrazení velké plochy, například kraje nebo státu",
    [
      ["Zobrazení jedné třídy ve škole", "Tak malý prostor se kreslí do plánu, kde je místo i na jednotlivé lavice."],
      ["Fotografie mraků z družice", "Snímek mraků ukazuje počasí, ne značky a hranice území."],
      ["Seznam měst bez žádného obrázku", "Seznam by neukázal, kde města leží vůči sobě."],
    ],
    "Rozhoduje, jak velké území se má vejít na papír.",
    "Když chceš vidět celý kraj najednou, musíš území hodně zmenšit, a jednotlivé ulice se tam proto nevejdou. Které zobrazení takhle velkou plochu zvládne?",
    "Mapa zobrazuje velkou plochu — kraj, stát nebo celý kontinent. Protože je území velké, nemůže být tak podrobná jako plán malého místa.",
  ),
  t(
    "Kamarád ti chce popsat cestu ke škole ve vaší ulici. Použije k tomu spíš plán, nebo mapu státu?",
    "Plán — protože jde o malou plochu s podrobnými ulicemi",
    [
      ["Mapu státu — protože je přesnější", "Mapa státu je zmenšená tak moc, že jednotlivé ulice na ní vůbec nejsou."],
      ["Oboje je stejně vhodné", "Stejně vhodné to není — jen jedno z nich ulice vůbec zobrazuje."],
      ["Ani jedno, cestu nelze zakreslit", "Cestu zakreslit jde, jen se k tomu musí vybrat dost podrobné zobrazení."],
    ],
    "Cesta ke škole se odehrává na velmi malém území.",
    "Nejdřív si rozmysli, jak velké území potřebuješ zachytit — jednu ulici, nebo celou republiku. Pak vyber zobrazení, které tak drobný výsek ukáže do detailu.",
    "Pro popis cesty v rámci jedné ulice je vhodnější plán — zobrazuje malou plochu podrobně. Mapa státu by jednotlivé ulice vůbec neukázala.",
  ),
  t(
    "Co znamená modrá barva na fyzické mapě?",
    "Vodu — řeky, jezera, moře",
    [
      ["Lesy a parky", "Lesy se na mapách kreslí zeleně, ne touhle barvou."],
      ["Hory a kopce", "Hory mívají na fyzické mapě hnědý odstín."],
      ["Silnice a dálnice", "Silnice se značí čarami, obvykle červenou nebo žlutou."],
    ],
    "Barvy na mapě většinou napodobují skutečný vzhled krajiny.",
    "Představ si pohled na rybník nebo moře shora. Jakou barvu bys viděl, a co z nabízených možností tomu odpovídá?",
    "Modrá barva na mapě označuje vodu — řeky, jezera, rybníky, moře a oceány. Je zvolená proto, že připomíná skutečný vzhled vodní hladiny.",
  ),
  t(
    "Co znamená zelená barva na fyzické mapě?",
    "Nížiny a roviny",
    [
      ["Hory a vrchoviny", "Vyšší terén je na fyzické mapě hnědý, ne zelený."],
      ["Pouště a suché oblasti", "Suché oblasti bývají žluté nebo béžové."],
      ["Lesy kolem měst", "Na fyzické mapě barvy ukazují nadmořskou výšku, ne porost."],
    ],
    "Na fyzické mapě barva neprozradí porost, ale nadmořskou výšku.",
    "Stupnice jde od nejnižších míst k nejvyšším a mění se přitom odstín. Nejnižší patro dostalo barvu luk a polí. Které možnosti popisují právě takový nízký terén?",
    "Na fyzické mapě zelená barva označuje nížiny — oblasti nízko nad mořem. Čím je terén vyšší, tím barva přechází do žluté a hnědé; nejvyšší hory jsou nejtmavší.",
  ),
  t(
    "Na fyzické mapě vidíš vysoké pohoří. Jakou barvou bude nejspíš vybarveno?",
    "Hnědou",
    [
      ["Modrou", "Modrá patří vodním plochám, ne vyvýšenému terénu."],
      ["Zelenou", "Zelená patří nejnižšímu patru krajiny, tedy nížinám."],
      ["Bílou jako sníh", "Bílá se používá až pro ledovce ve světových velehorách, u nás ne."],
    ],
    "Barevná stupnice fyzické mapy jde od nížin k vrcholům.",
    "Nejnižší místa jsou zelená a směrem vzhůru se odstín postupně mění přes žlutou k tmavším tónům. Jaká barva je na téhle stupnici pro nejvyšší terén u nás?",
    "Vysoké pohoří bude na fyzické mapě vybarveno hnědě. Zelená patří nížinám a modrá vodě, takže na hory zbývá tmavší odstín barevné stupnice.",
  ),
  t(
    "Chceš na plán svého města zakreslit potok. Jakou barvou ho nakreslíš?",
    "Modrou",
    [
      ["Zelenou", "Zeleně se značí zeleň a nízký terén, ne vodní toky."],
      ["Hnědou", "Hnědá patří vyvýšenému terénu, ne tekoucí vodě."],
      ["Žlutou", "Žlutá se používá pro suché oblasti nebo silnice, ne pro potok."],
    ],
    "Použij stejnou barvu, jakou mají vodní toky na každé mapě.",
    "Potok je tekoucí voda, takže se řídí stejným pravidlem jako řeky a jezera. Vzpomeň si, jakým odstínem se vodstvo kreslí, aby bylo hned poznat.",
    "Potok, stejně jako každá jiná voda, se na plánech i mapách kreslí modře. Je to zavedená dohoda, kterou dodržuje každý plán i mapa.",
  ),
  t(
    "Jak můžeš určit sever za slunečného dne v poledne bez kompasu?",
    "V poledne stojí slunce na jihu, takže sever je přesně naproti",
    [
      ["Slunce vždy ukazuje na sever", "Slunce se během dne přesouvá po obloze a na sever u nás nikdy nestojí."],
      ["Sever je tam, kde svítí nejsilněji", "Nejsilněji svítí slunce v poledne od jihu — to je opačná strana."],
      ["Za dne nelze sever určit bez kompasu", "Určit se dá — stačí vědět, kde slunce v poledne stojí."],
    ],
    "V poledne je slunce nejvýš na obloze a stojí pořád na stejné straně.",
    "Postav se k polednímu slunci čelem. Stojíš tak čelem k jedné světové straně — a hledaná strana je její protiklad, tedy přesně za tvými zády.",
    "V poledne je slunce nejvýše na obloze a nachází se na jihu. Otočíme-li se k němu čelem, stojíme čelem k jihu, a proto máme za zády sever.",
  ),
];

const POOL_L3: PracticeTask[] = [
  t(
    "Je poledne, slunce máš přímo před sebou — stojíš tedy čelem k jihu. Co máš po pravici?",
    "Západ",
    [
      ["Východ", "Ten bys měl po pravici, kdybys stál čelem k severu. Po otočce o 180° je vlevo."],
      ["Sever", "Sever máš za zády, ne po straně — stojíš přímo proti němu."],
      ["Jih", "Jih máš před sebou, dívají se tam tvoje oči, ne pravá ruka."],
    ],
    "Nejdřív si představ, jak bys stál čelem k severu, a pak se v duchu otoč.",
    "Čelem k severu máš po pravé ruce stranu ranního slunce. Otočka o 180° ale pravou a levou stranu prohodí, takže se ti obě strany vymění.",
    "Čelem k severu máš východ napravo a západ nalevo. Otočíš-li se o 180° (čelem k jihu), strany se prohodí — za zády máš sever, po pravici západ a po levici východ.",
  ),
  t(
    "Je poledne, slunce máš přímo před sebou — stojíš tedy čelem k jihu. Co máš po levici?",
    "Východ",
    [
      ["Západ", "Ten bys měl po levici, kdybys stál čelem k severu. Po otočce o 180° je vpravo."],
      ["Sever", "Sever máš za zády — stojíš přímo proti němu, ne bokem k němu."],
      ["Jih", "Jih máš před sebou, ne po levé ruce."],
    ],
    "Postav se nejdřív v duchu čelem k severu a pak se otoč o půl kruhu.",
    "Čelem k severu máš po levé ruce stranu večerního slunce. Otočka o 180° obrátí obě boční strany, takže po levici skončí ta opačná.",
    "Čelem k severu máš západ nalevo a východ napravo. Otočíš-li se o 180° (čelem k jihu), strany se prohodí — za zády máš sever, po levici východ a po pravici západ.",
  ),
  t(
    "Jdeš na severovýchod (SV) a otočíš se o 180°. Kterým směrem teď jdeš?",
    "Jihozápad",
    [
      ["Severozápad", "Obrátil jsi jen druhou složku směru, první zůstala stejná."],
      ["Jihovýchod", "Obrátil jsi jen první složku směru, druhá zůstala stejná."],
      ["Severovýchod", "To je původní směr. Po otočce o 180° musí být směr opačný."],
    ],
    "Otočka o 180° musí obrátit OBĚ složky směru, ne jen jednu.",
    "Rozlož zkratku na dvě písmena a každé zvlášť vyměň za jeho protiklad. Výsledek pak najdeš v rohu mapy úhlopříčně naproti, přes střed mapy.",
    "Otočka o 180° obrátí obě části mezilehlého směru najednou: sever ↔ jih a východ ↔ západ. Opakem severovýchodu (SV) je proto jihozápad (JZ).",
  ),
  t(
    "Jdeš na jihozápad (JZ) a otočíš se o 180°. Kterým směrem teď jdeš?",
    "Severovýchod",
    [
      ["Severozápad", "Obrátil jsi jen první složku směru, druhá zůstala nezměněná."],
      ["Jihovýchod", "Obrátil jsi jen druhou složku směru, první zůstala nezměněná."],
      ["Jihozápad", "To je směr, kterým jsi šel předtím. Po otočce musí být opačný."],
    ],
    "Vyměň za protiklad obě písmena zkratky, ne jen jedno.",
    "První písmeno vyměň za stranu na opačném vodorovném okraji mapy, druhé za stranu na opačném bočním okraji. Cíl leží úhlopříčně přes střed mapy.",
    "Otočka o 180° obrátí obě části mezilehlého směru najednou: jih ↔ sever a západ ↔ východ. Opakem jihozápadu (JZ) je proto severovýchod (SV).",
  ),
  t(
    "Jdeš na severozápad (SZ) a otočíš se o 180°. Kterým směrem teď jdeš?",
    "Jihovýchod",
    [
      ["Severovýchod", "Obrátil jsi jen druhou složku směru, první zůstala stejná."],
      ["Jihozápad", "Obrátil jsi jen první složku směru, druhá zůstala stejná."],
      ["Severozápad", "To je původní směr. Otočka o 180° ho musí změnit na opačný."],
    ],
    "Obě písmena zkratky musí po otočce změnit svůj protějšek.",
    "Nahraď každé písmeno stranou na opačném okraji mapy — jedno vodorovně, druhé bokem. Výsledný roh leží přes střed mapy úhlopříčně naproti původnímu.",
    "Otočka o 180° obrátí obě části mezilehlého směru najednou: sever ↔ jih a západ ↔ východ. Opakem severozápadu (SZ) je proto jihovýchod (JV).",
  ),
  t(
    "Jdeš na jihovýchod (JV) a otočíš se o 180°. Kterým směrem teď jdeš?",
    "Severozápad",
    [
      ["Jihozápad", "Obrátil jsi jen druhou složku směru, první zůstala nezměněná."],
      ["Severovýchod", "Obrátil jsi jen první složku směru, druhá zůstala nezměněná."],
      ["Jihovýchod", "To je směr před otočkou. Po otočce o 180° musí být opačný."],
    ],
    "Protiklad se musí najít pro obě složky zkratky zároveň.",
    "Vezmi první písmeno a nahraď ho stranou u opačného vodorovného okraje mapy, pak stejně nalož s druhým písmenem. Výsledek leží v protilehlém rohu.",
    "Otočka o 180° obrátí obě části mezilehlého směru najednou: jih ↔ sever a východ ↔ západ. Opakem jihovýchodu (JV) je proto severozápad (SZ).",
  ),
  t(
    "Na fyzické mapě vidíš vysokou horu (hnědá barva) v horní části mapy. Stojíš uprostřed mapy — kterým směrem od tebe hora leží?",
    "Na sever",
    [
      ["Na jih", "Jih je u dolního okraje mapy, hora je ale nakreslená v opačné části."],
      ["Na východ", "Východ je u pravého okraje. Poloha hory je určená výškou na mapě, ne bokem."],
      ["Na západ", "Západ je u levého okraje. Hora leží u vodorovného okraje, ne u bočního."],
    ],
    "Hnědá barva ti řekne, o jaký terén jde — směr musíš zjistit z polohy na papíře.",
    "Nejdřív si potvrď podle barvy, že jde opravdu o horu. Pak se podívej, u kterého okraje mapy je nakreslená, a vzpomeň si, která strana tam vždy patří.",
    "Hnědá barva prozradí, že jde o horu. Směr prozradí poloha: u horního okraje mapy je vždy sever, takže hora leží na sever od středu mapy.",
  ),
  t(
    "Na fyzické mapě vidíš širokou nížinu (zelená barva) v dolní části mapy. Stojíš uprostřed mapy — kterým směrem od tebe nížina leží?",
    "Na jih",
    [
      ["Na sever", "Sever je u horního okraje mapy, nížina je ale nakreslená dole."],
      ["Na východ", "Východ je u pravého okraje. Nížina leží u vodorovného okraje, ne u bočního."],
      ["Na západ", "Západ je u levého okraje. Poloha nížiny je určená výškou na mapě, ne bokem."],
    ],
    "Zelená barva prozradí druh terénu, poloha na papíře prozradí směr.",
    "Nejdřív si podle barvy ověř, že jde o nízko položenou krajinu. Pak urči, u kterého okraje mapy leží, a přiřaď k němu světovou stranu, která tam vždy patří.",
    "Zelená barva prozradí, že jde o nížinu. Směr prozradí poloha: u dolního okraje mapy je vždy jih, takže nížina leží na jih od středu mapy.",
  ),
  t(
    "Mapa má měřítko 1:100 000. Co ti tohle měřítko NEŘEKNE, a musíš to hledat jinde?",
    "Co znamenají značky a barvy na mapě",
    [
      ["Jak daleko jsou od sebe dvě místa", "Právě tohle měřítko umožní spočítat, takže to není to chybějící."],
      ["Kolik má mapa stránek", "Počet stránek není údaj, který by se z mapy četl ani hledal v legendě."],
      ["Jméno autora mapy", "Autor bývá uvedený v tiráži, ale s významem symbolů to nesouvisí."],
    ],
    "Rozděl si úlohu na dvě otázky: co měřítko umí a co naopak neumí.",
    "Zápis 1:100 000 umožní přepočítat centimetry na kilometry, o významu symbolů ale mlčí. Ten najdeš v jiné části mapy — ve vysvětlivkách.",
    "Měřítko 1:100 000 řekne jen to, o kolik je mapa zmenšená, a umožní přepočítat vzdálenosti. Co znamenají jednotlivé značky a barvy, se dozvíš z legendy, ne z měřítka.",
  ),
  t(
    "Z měřítka mapy zjistíš vzdálenost mezi dvěma vesnicemi. Co ti měřítko NEŘEKNE a musíš to zjistit z legendy?",
    "Co znamenají barvy a značky na mapě",
    [
      ["Kolik centimetrů má mapa na šířku", "Šířku papíru si změříš pravítkem, s legendou to nesouvisí."],
      ["Jak moc je mapa zmenšená", "Právě tohle měřítko říká — takže to není chybějící informace."],
      ["Zda je mapa fyzická, nebo politická", "Druh mapy poznáš z jejího názvu a celkového vzhledu, ne z vysvětlivek."],
    ],
    "Přemýšlej, k čemu slouží legenda — a to bude ta chybějící informace.",
    "Měřítko je nástroj na přepočet délek, nic víc. Vysvětlivky naopak vyjmenovávají symboly a jejich význam. Která z možností patří právě do těch vysvětlivek?",
    "Měřítko pomáhá spočítat skutečnou vzdálenost, ale nevysvětluje, co znamenají barvy a značky na mapě — to je úkolem legendy.",
  ),
  t(
    "Stojíš čelem k severu. Otočíš se o 90° doprava (ve směru hodinových ručiček). Kterým směrem se teď díváš?",
    "Na východ",
    [
      ["Na západ", "To je otočka o 90° na opačnou stranu, tedy doleva."],
      ["Na jih", "K jihu by ses dostal až po otočce o 180°, tedy o dvě čtvrtiny."],
      ["Na sever", "To je výchozí směr před otočením, takže se změnit musel."],
    ],
    "Čtvrt otáčky posune směr právě o jednu světovou stranu.",
    "Pořadí po směru hodinových ručiček je: sever → východ → jih → západ. Posuň se v téhle řadě o jeden krok dopředu od výchozí strany.",
    "Otočka o 90° doprava (po směru hodinových ručiček) posune tvůj směr o jednu světovou stranu dál v pořadí sever → východ → jih → západ. Ze severu se tak dostaneš na východ.",
  ),
  t(
    "Stojíš čelem k severu. Otočíš se o 90° doleva (proti směru hodinových ručiček). Kterým směrem se teď díváš?",
    "Na západ",
    [
      ["Na východ", "To je otočka o 90° na opačnou stranu, tedy doprava."],
      ["Na jih", "K jihu vede až otočka o 180°, tedy dvě čtvrtiny otáčky."],
      ["Na sever", "To je směr před otočením — čtvrt otáčky ho musela změnit."],
    ],
    "Otočka doleva posune směr o jednu stranu, ale opačně než doprava.",
    "Pořadí proti směru hodinových ručiček je: sever → západ → jih → východ. Udělej v téhle řadě jeden krok od výchozí strany.",
    "Otočka o 90° doleva (proti směru hodinových ručiček) posune tvůj směr o jednu světovou stranu dál v pořadí sever → západ → jih → východ. Ze severu se tak dostaneš na západ.",
  ),
  t(
    "Stojíš čelem k východu. Otočíš se o 90° doprava (ve směru hodinových ručiček). Kterým směrem se teď díváš?",
    "Na jih",
    [
      ["Na sever", "Tam by ses dostal otočkou o 90° na opačnou stranu, tedy doleva."],
      ["Na východ", "To je výchozí směr — čtvrt otáčky ho musela posunout dál."],
      ["Na západ", "K západu vede až otočka o 180°, tedy dvě čtvrtiny otáčky."],
    ],
    "Výchozí strana už není sever, takže začni počítat od ní.",
    "Pořadí po směru hodinových ručiček je: sever → východ → jih → západ. Najdi v téhle řadě výchozí stranu a posuň se o jeden krok dopředu.",
    "Otočka o 90° doprava posune tvůj směr o jednu světovou stranu v pořadí sever → východ → jih → západ. Z východu se tak dostaneš na jih.",
  ),
  t(
    "Stojíš čelem k východu. Otočíš se o 90° doleva (proti směru hodinových ručiček). Kterým směrem se teď díváš?",
    "Na sever",
    [
      ["Na jih", "Tam vede čtvrt otáčky na opačnou stranu, tedy doprava."],
      ["Na východ", "To je výchozí směr, ten se otočkou změnit musel."],
      ["Na západ", "K západu bys potřeboval otočku o 180°, ne o čtvrtinu."],
    ],
    "Otočka doleva vrací směr o jeden krok zpět proti pořadí doprava.",
    "Pořadí proti směru hodinových ručiček je: východ → sever → západ → jih. Udělej v téhle řadě jeden krok od výchozí strany.",
    "Otočka o 90° doleva posune tvůj směr o jednu světovou stranu v pořadí východ → sever → západ → jih. Z východu se tak dostaneš na sever.",
  ),
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool);
}

export const MAPASTRANYSVET: TopicMetadata[] = [
  {
    id: "g3-prvouka-misto-kde-zijeme-nase-vlast-mapa-svetove-strany-plan-a-mapa-kompas",
    rvpNodeId:
      "g3-prvouka-misto-kde-zijeme-nase-vlast-mapa-svetove-strany-plan-a-mapa-kompas",
    title: "Mapa, světové strany, kompas",
    studentTitle: "Mapa a orientace",
    subject: "prvouka",
    category: "Místo, kde žijeme",
    topic: "Naše vlast",
    briefDescription: "Umíš se orientovat na mapě a znáš světové strany.",
    keywords: [
      "mapa",
      "plán",
      "světové strany",
      "sever",
      "jih",
      "východ",
      "západ",
      "kompas",
      "legenda",
      "měřítko",
      "orientace",
      "severovýchod",
      "jihozápad",
      "barvy na mapě",
    ],
    goals: [
      "Pojmenovat čtyři hlavní světové strany a určit jejich polohu na mapě.",
      "Vysvětlit, k čemu slouží kompas.",
      "Popsat mezilehlé světové strany (SV, SZ, JV, JZ).",
      "Vysvětlit, co je legenda a měřítko mapy.",
      "Rozlišit plán od mapy.",
      "Přiřadit základní barvy na fyzické mapě ke tvaru terénu.",
      "Popsat, jak určit sever podle polohy slunce v poledne.",
    ],
    boundaries: [
      "Základní pojmy a dovednosti pro 3. třídu, bez zeměpisných souřadnic, projekcí nebo UTM.",
      "Prostorové úlohy s otočením těla (L3) pracují jen s úhly 90° a 180°, bez jemnějšího dělení.",
    ],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Sever je nahoře, Jih dole, Východ vpravo, Západ vlevo. Kompas ukazuje na sever. Legenda = vysvětlivky, měřítko = zmenšení. Plán = malá plocha, mapa = velká plocha.",
      steps: [
        "Podívej se na mapu — sever je nahoře.",
        "Kompasová ručička vždy míří na sever.",
        "Legenda ti poví, co znamenají barvy a značky.",
        "Měřítko říká, kolik skutečných kilometrů odpovídá centimetru na mapě.",
      ],
      commonMistake:
        "Záměna plánu a mapy — plán je pro malou plochu (město), mapa pro velkou plochu (kraj, stát).",
      example:
        "Stojíš na náměstí a chceš najít školu na jihu. Otočíš kompas, ručička ukáže sever (nahoru) — škola je dole na mapě, takže se vydáš na jih.",
    },
  },
];
