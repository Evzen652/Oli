import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "@/content/grade-3/_shared";

// ─────────────────────────────────────────────────────────
// Disjunktní pooly obtížnosti (L1 < L2 < L3), select_one.
//   L1 = rozpoznání: pojmy kraj, region, krajské město, krajský úřad,
//        počet krajů, postavení Prahy — izolovaná fakta a definice.
//   L2 = aplikace:   přiřazení krajské město ↔ kraj v obou směrech
//        (8× kraj → město, 6× město → kraj; pokrývá 12 krajů, které mají
//        běžný pár kraj–stejnojmenné město).
//   L3 = transfer:   dva kroky (město → kraj → další údaj), inverze
//        (úřad → kraj), výjimky (Vysočina, Středočeský kraj, Praha)
//        a přenos definice kraj × region na konkrétní oblast.
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
    "Kolik krajů má Česká republika?",
    "14 krajů",
    [
      ["12 krajů", "Dvanáct je o dva málo. Snadno se zapomene, že krajem je i hlavní město."],
      ["16 krajů", "Šestnáct krajů má například sousední Německo. U nás je jich méně."],
      ["10 krajů", "Deset je o čtyři míň, než kolik krajů republika doopravdy má."],
    ],
    "Počet krajů je někde mezi deseti a šestnácti.",
    "Nezapomeň, že hlavní město Praha se počítá jako samostatný kraj. Zkus si kraje projít na mapě od západu na východ a spočítat je i s ním.",
    "Česká republika se dělí na 14 krajů. Každý kraj má své krajské město, kde sídlí krajský úřad. Praha je zároveň hlavním městem státu i samostatným krajem, proto se do počtu započítává.",
  ),
  t(
    "Co je kraj?",
    "Územní celek, který spravuje část státu",
    [
      ["Název pro velkou vesnici", "Velké vesnici se říká městys nebo město. Kraj je o mnoho řádů větší celek."],
      ["Jiné označení pro stát", "Stát je celá republika. Ten se teprve na tyto celky dělí."],
      ["Část ulice ve městě", "Část ulice je maličká. Tady jde o území s vlastním úřadem a mnoha městy."],
    ],
    "Rozmysli si, kam by takový celek patřil v řadě obec – ? – stát.",
    "Je větší než jedna obec, ale menší než celý stát, a má vlastní úřad se zastupiteli. Vyřaď možnosti, které popisují něco moc malého nebo naopak celý stát.",
    "Kraj je územní celek, který spravuje část státu. Česká republika je rozdělena na 14 krajů. Každý má krajský úřad a zastupitelstvo, které rozhoduje o věcech v daném území.",
  ),
  t(
    "Co je region?",
    "Oblast se společnými znaky — přírodou, historií nebo kulturou",
    [
      ["Přesně vymezená část státu s úřadem", "To je popis kraje. Tenhle pojem naopak přesné hranice ani úřad mít nemusí."],
      ["Jiný název pro hlavní město", "Hlavní město je jediné konkrétní město. Tady jde o celou oblast."],
      ["Část kraje bez vlastní správy", "Nemusí ležet uvnitř jednoho kraje — může se roztáhnout i přes několik krajů."],
    ],
    "Zamysli se, co mají společného lidé z jedné oblasti, i když je nikdo úředně nevymezil.",
    "Haná nebo Chodsko nenajdeš na mapě ohraničené čárou a nemají žádný úřad — spojují je kroje, nářečí a zvyky. Která možnost popisuje právě takovou oblast?",
    "Region je oblast, která má společné znaky — například stejnou přírodu, historii nebo kulturu. Nemusí mít přesně dané hranice jako kraj. Příkladem je Haná nebo Chodsko.",
  ),
  t(
    "Kolik krajských měst má Česká republika?",
    "14",
    [
      ["13", "O jedno míň — nezapomeň, že i Praha je krajem a zároveň krajským městem."],
      ["12", "Dvanáct je málo. Každý jednotlivý kraj má vlastní krajské město, žádný o ně nepřišel."],
      ["15", "O jedno navíc. Žádný kraj nemá dvě krajská města."],
    ],
    "Každý kraj má právě jedno krajské město — ani víc, ani míň.",
    "Když má každý kraj právě jedno takové město, musí jich být přesně tolik jako krajů. Vzpomeň si tedy nejdřív na počet krajů a to číslo rovnou použij.",
    "Česká republika má 14 krajů a každý kraj má své krajské město — dohromady tedy 14 krajských měst. I kraj Vysočina má své krajské město, i když se nejmenuje stejně jako kraj.",
  ),
  t(
    "Které město je zároveň hlavním městem státu i samostatným krajem?",
    "Praha",
    [
      ["Brno", "Brno je druhé největší město a krajské město na jihu Moravy, ale hlavním městem státu není."],
      ["Ostrava", "Ostrava je třetí největší město a krajské město na severovýchodě Moravy, ne sídlo státu."],
      ["Plzeň", "Plzeň je krajské město v západních Čechách. Vláda ani parlament tam nesídlí."],
    ],
    "Hledej největší město republiky.",
    "Sídlí v něm prezident, vláda i parlament a zároveň nepatří pod žádný jiný kraj — je krajem samo o sobě. Které město to splňuje?",
    "Praha je zároveň hlavním městem České republiky a samostatným krajem. Je největším městem státu a sídlí zde prezident, vláda, parlament i soudy.",
  ),
  t(
    "Kdo rozhoduje o věcech v kraji?",
    "Krajský úřad a zastupitelstvo",
    [
      ["Pouze obecní úřad", "Obecní úřad se stará jen o jednu obec, ne o celé území s mnoha městy."],
      ["Parlament ČR", "Parlament schvaluje zákony pro celý stát, ne rozpočet jednoho kraje."],
      ["Vláda ČR", "Vláda řídí stát jako celek. O školách či silnicích v kraji rozhodují jiní."],
    ],
    "Hledej úřad, který patří přímo k té části státu, o niž jde.",
    "Rozhodovat by neměl ani úřad jediné obce, ani orgán celého státu, ale něco přesně mezi tím. Jak se takový úřad a jeho volený sbor jmenují?",
    "O věcech v kraji rozhoduje krajský úřad a krajské zastupitelstvo. Sídlí v krajském městě a starají se o školství, zdravotnictví nebo silnice na svém území.",
  ),
  t(
    "Kde sídlí krajský úřad?",
    "V krajském městě",
    [
      ["Vždy v Praze, bez ohledu na kraj", "V Praze by lidé z Moravy měli na úřad daleko. Každý kraj má svůj vlastní."],
      ["V obci, kde bydlí nejvíc lidí v celé ČR", "Nejlidnatější obcí republiky je Praha — a tam se do jediného úřadu všechny kraje nevejdou."],
      ["V hlavním městě sousedního státu", "Český úřad nemůže sídlit v cizí zemi. Musí být uvnitř republiky."],
    ],
    "Každý kraj má jedno centrum, odkud se řídí.",
    "Úřad má být lidem z kraje blízko, ne v jiné části republiky ani za hranicemi. Kde ho tedy hledat — v centru vlastního kraje, nebo někde daleko?",
    "Krajský úřad sídlí v krajském městě — to je centrum kraje, kde se rozhoduje o jeho záležitostech a kam za ním obyvatelé kraje jezdí.",
  ),
  t(
    "Co má kraj navíc oproti regionu?",
    "Přesné hranice a vlastní úřad",
    [
      ["Vlastní úřední jazyk", "V celé republice se úřaduje česky. Jazyk se podle krajů nemění."],
      ["Vlastní platnou měnu", "V celém státě platí jedna měna — koruna. Kraj si svoji nevydává."],
      ["Vlastní stálou armádu", "Armádu má stát jako celek, ne jednotlivé jeho části."],
    ],
    "Region nemá ani jedno z toho, co hledáš.",
    "Přemýšlej o tom, co dělá z území úředně uznanou jednotku: musí být jasné, kde začíná a končí, a někdo za ni musí rozhodovat. Měna ani armáda to nejsou.",
    "Kraj má na rozdíl od regionu přesně vymezené hranice a vlastní krajský úřad. Region je jen oblast se společnými znaky, bez úřadu a bez přesných hranic.",
  ),
  t(
    "Co je větší — kraj, nebo obec?",
    "Kraj je větší než obec",
    [
      ["Obec je větší než kraj", "Je to naopak: obec je jen jedna vesnice nebo město uvnitř většího celku."],
      ["Kraj a obec jsou stejně velké", "Stejně velké být nemohou — v jednom kraji je obcí několik stovek."],
      ["Obec a stát jsou stejně velké", "Stát je celá republika se všemi obcemi dohromady, obec je jen jedna z nich."],
    ],
    "Zamysli se, co se z čeho skládá.",
    "Jeden z těch celků obsahuje mnoho set toho druhého. Řada podle velikosti vede od nejmenšího přes prostřední až po celý stát — kam v ní patří obec?",
    "Kraj je větší územní celek než obec — jeden kraj se skládá z mnoha obcí a měst. Nad krajem už je jen celý stát.",
  ),
  t(
    "Podle čeho se pozná region, když nemá úřad ani přesné hranice?",
    "Podle společných znaků — nářečí, krojů, přírody nebo historie",
    [
      ["Podle čísla, které mu přidělil stát", "Stát čísluje kraje a obce, ne oblasti vymezené zvyky lidí."],
      ["Podle hranic namalovaných na mapě", "Právě přesné hranice na mapě mu chybí — má je kraj."],
      ["Podle toho, kolik má obyvatel", "Počet obyvatel se dá spočítat všude, o zvláštnosti oblasti nic neříká."],
    ],
    "Vzpomeň si, čím se od sebe liší Haná a Chodsko.",
    "Lidé v takové oblasti mluví podobně, nosívali podobné kroje a žijí v podobné krajině. Nic z toho nezapsal žádný úřad — poznáš to až podle lidí a přírody.",
    "Region se pozná podle společných znaků — nářečí, krojů, zvyků, přírody nebo historie. Nikdo mu je nepřidělil úředně, vznikly tím, jak tam lidé dlouho žili.",
  ),
  t(
    "Z čeho se skládá kraj?",
    "Z mnoha obcí a měst",
    [
      ["Z několika států", "Stát je nadřazený celek — kraj je naopak jeho částí."],
      ["Z jediné velké obce", "Jedna obec by na celý kraj nestačila. Je jich v něm několik stovek."],
      ["Z ulic jednoho města", "Ulice tvoří město, ne celý kraj. Kraj je mnohem větší."],
    ],
    "Přemýšlej, co všechno leží uvnitř jednoho kraje.",
    "Když se podíváš na mapu kraje, uvidíš na ní spoustu teček s názvy — vesnice i větší sídla. Z čeho je tedy kraj poskládaný?",
    "Kraj se skládá z mnoha obcí a měst. Proto je větší než kterákoli jednotlivá obec, ale zároveň je jen částí státu.",
  ),
  t(
    "K čemu je obyvatelům kraje krajské město?",
    "Je centrem kraje — sídlí v něm úřad, který kraj spravuje",
    [
      ["Je to jediné město, kde smějí bydlet", "Lidé v kraji bydlí ve stovkách obcí, ne jen v jednom městě."],
      ["Je to město, kde se neplatí žádné daně", "Daně platí lidé všude stejně, na krajské město výjimka není."],
      ["Je to nejstarší město v celém kraji", "Nejstarší sídlo kraje bývá často jiné. Rozhoduje úřad, ne stáří."],
    ],
    "Zamysli se, proč do tohoto města lidé z kraje jezdí něco vyřizovat.",
    "Sídlí v něm zastupitelstvo i úřad, které rozhodují o školách, nemocnicích a silnicích v celém kraji. Čím je tedy takové město pro ostatní obce?",
    "Krajské město je centrem kraje: sídlí v něm krajský úřad a zastupitelstvo, které spravují celé území. Proto tam obyvatelé kraje jezdí vyřizovat úřední záležitosti.",
  ),
  t(
    "Kolik krajských měst má jeden kraj?",
    "Právě jedno",
    [
      ["Dvě", "Dvě centra by si při rozhodování překážela. Kraj má jen jedno."],
      ["Tolik, kolik má velkých měst", "Velkých měst bývá v kraji několik, ale tuhle roli má jen jedno z nich."],
      ["Žádné, kraje se řídí z Prahy", "Z Prahy se řídí stát. Každý kraj se spravuje sám, ze svého centra."],
    ],
    "Kdyby jich bylo víc, nebylo by jasné, kam na úřad jet.",
    "Krajský úřad je v kraji jen jeden a musí někde sídlit. Kolik měst tedy může tuhle roli v jednom kraji zastávat?",
    "Každý kraj má právě jedno krajské město, ve kterém sídlí jeho úřad. Proto je krajských měst v republice stejně jako krajů.",
  ),
];

const POOL_L2: PracticeTask[] = [
  t(
    "Jaké je krajské město Jihomoravského kraje?",
    "Brno",
    [
      ["Zlín", "Zlín je krajské město sousedního kraje na východní Moravě, ne toho jižního."],
      ["Jihlava", "Jihlava leží víc na západ, uprostřed republiky, a spravuje jiný kraj."],
      ["Olomouc", "Olomouc je centrem střední Moravy, ne té jižní."],
    ],
    "Hledej druhé největší město republiky.",
    "Leží na jihu Moravy a je přirozeným centrem celé té oblasti — sídlí v něm i významné soudy. Ze čtyř moravských měst v nabídce je největší.",
    "Brno je krajské město Jihomoravského kraje. Je to druhé největší město České republiky a leží na jihu Moravy.",
  ),
  t(
    "Jaké je krajské město Moravskoslezského kraje?",
    "Ostrava",
    [
      ["Opava", "Opava v tomto kraji leží, ale krajský úřad v ní nesídlí."],
      ["Brno", "Brno spravuje jižní Moravu. Tenhle kraj je na severovýchodě."],
      ["Olomouc", "Olomouc je centrem střední Moravy, ne severovýchodního kraje u polských hranic."],
    ],
    "Hledej třetí největší město republiky.",
    "Leží na severovýchodě Moravy blízko hranic s Polskem a proslavila ho těžba uhlí a hutě. Pozor, v tom kraji leží i menší města, která ale krajský úřad nemají.",
    "Ostrava je krajské město Moravskoslezského kraje. Je to třetí největší město v České republice a leží na severovýchodě Moravy u hranic s Polskem.",
  ),
  t(
    "Jaké je krajské město Jihočeského kraje?",
    "České Budějovice",
    [
      ["Písek", "Písek v tomto kraji leží, ale je mnohem menší a krajský úřad v něm není."],
      ["Tábor", "Tábor je známé husitské město v tomto kraji, přesto není jeho centrem."],
      ["Strakonice", "Strakonice jsou menší město téhož kraje, krajskou správu nemají."],
    ],
    "Všechna nabízená města leží na jihu Čech — hledej z nich to největší.",
    "Krajské město bývá největší v kraji a sídlí v něm úřad. Tohle leží nedaleko rakouských hranic a jeho název sám obsahuje slovo označující zemi, ve které leží.",
    "České Budějovice jsou krajské město Jihočeského kraje. Leží na jihu Čech a jsou největším městem tohoto kraje.",
  ),
  t(
    "Jaké je krajské město Královéhradeckého kraje?",
    "Hradec Králové",
    [
      ["Náchod", "Náchod leží v tomtéž kraji u polských hranic, ale krajským městem není."],
      ["Trutnov", "Trutnov je město pod Krkonošemi v tomtéž kraji, krajský úřad tam nesídlí."],
      ["Jičín", "Jičín je menší město stejného kraje, proslulé Rumcajsem, ne krajskou správou."],
    ],
    "Název tohoto města se skrývá přímo v názvu kraje, jen přeházený.",
    "Kraj se jmenuje podle dvou slov, která v názvu města stojí obráceně. Najdi v nabídce město, ze kterého se dá takový přídavný název složit.",
    "Hradec Králové je krajské město Královéhradeckého kraje. Leží ve východních Čechách, kde se setkávají řeky Labe a Orlice.",
  ),
  t(
    "Jaké je krajské město kraje Vysočina?",
    "Jihlava",
    [
      ["Havlíčkův Brod", "Havlíčkův Brod v tomto kraji leží, ale krajský úřad v něm nesídlí."],
      ["Třebíč", "Třebíč je město téhož kraje se slavnou židovskou čtvrtí, centrem kraje ale není."],
      ["Žďár nad Sázavou", "Žďár nad Sázavou patří do stejného kraje, krajskou správu však nemá."],
    ],
    "Tenhle kraj jako jediný nenese jméno svého krajského města.",
    "Jméno kraje vzniklo z názvu krajiny — kopcovité vrchoviny uprostřed republiky. Město tedy podle kraje neuhodneš; hledej to, které leží přibližně ve středu státu.",
    "Jihlava je krajské město kraje Vysočina. Leží přibližně ve středu České republiky. Vysočina je jediný kraj, který nemá v názvu jméno svého krajského města.",
  ),
  t(
    "Jaké je krajské město Karlovarského kraje?",
    "Karlovy Vary",
    [
      ["Cheb", "Cheb leží v tomtéž kraji u německých hranic, krajský úřad v něm ale nesídlí."],
      ["Sokolov", "Sokolov je menší město stejného kraje, centrem kraje není."],
      ["Mariánské Lázně", "Mariánské Lázně jsou také lázeňské město, ale menší a bez krajské správy."],
    ],
    "Všechna nabízená města leží v západních Čechách — hledej nejslavnější lázně.",
    "To město dalo kraji jméno a proslavily ho horké minerální prameny i filmový festival. Pozor, lázeňská města jsou v nabídce dvě.",
    "Karlovy Vary jsou krajské město Karlovarského kraje. Je to slavné lázeňské město v západních Čechách, známé minerálními prameny.",
  ),
  t(
    "Jaké je krajské město Ústeckého kraje?",
    "Ústí nad Labem",
    [
      ["Most", "Most leží v tomtéž kraji a je známý přesunutým kostelem, krajský úřad tam ale není."],
      ["Chomutov", "Chomutov patří do stejného kraje pod Krušnými horami, centrem kraje není."],
      ["Teplice", "Teplice jsou lázeňské město téhož kraje, krajskou správu nemají."],
    ],
    "Hledej město, které má v názvu jméno velké řeky.",
    "Ten kraj leží na severu Čech u hranic s Německem a protéká jím naše největší řeka. Krajské město stojí přímo na ní a nese její jméno v názvu.",
    "Ústí nad Labem je krajské město Ústeckého kraje. Leží na severu Čech u řeky Labe a hranic s Německem.",
  ),
  t(
    "Jaké je krajské město Pardubického kraje?",
    "Pardubice",
    [
      ["Chrudim", "Chrudim leží hned vedle krajského města v témže kraji, ale úřad v ní nesídlí."],
      ["Svitavy", "Svitavy jsou menší město stejného kraje, centrem kraje nejsou."],
      ["Ústí nad Orlicí", "Ústí nad Orlicí patří do téhož kraje, krajskou správu však nemá."],
    ],
    "Hledej město proslulé nejtěžším koňským dostihem u nás.",
    "Ten dostih se jmenuje podle města, ve kterém se běhá, a přidává se k němu slovo Velká. Město leží ve východních Čechách u Labe.",
    "Pardubice jsou krajské město Pardubického kraje. Leží ve východních Čechách a jsou proslulé Velkou pardubickou — slavným dostihem.",
  ),
  t(
    "Ve kterém kraji leží město Plzeň?",
    "Plzeňský kraj",
    [
      ["Karlovarský kraj", "Karlovarský kraj leží severněji, u lázní. Tohle město do něj nepatří."],
      ["Jihočeský kraj", "Jihočeský kraj leží na jihu Čech u Rakouska, tohle město je na západě."],
      ["Ústecký kraj", "Ústecký kraj leží na severu Čech u Labe, ne na západě u německé hranice."],
    ],
    "To město leží v západních Čechách a je čtvrté největší u nás.",
    "Kraje se většinou jmenují podle svého krajského města. Podívej se, který z nabízených názvů je odvozený právě od jména tohoto města.",
    "Plzeň leží v Plzeňském kraji a je jeho krajským městem. Kraj dostal jméno podle svého centra, které je čtvrtým největším městem republiky.",
  ),
  t(
    "Ve kterém kraji leží město Liberec?",
    "Liberecký kraj",
    [
      ["Ústecký kraj", "Ústecký kraj je sice také na severu Čech, ale leží od tohoto města na západ."],
      ["Královéhradecký kraj", "Královéhradecký kraj leží východněji, u soutoku Labe a Orlice."],
      ["Středočeský kraj", "Středočeský kraj obklopuje Prahu uprostřed Čech, ne severní podhůří."],
    ],
    "To město leží v severních Čechách pod horou Ještěd.",
    "Kraje obvykle přebírají jméno svého krajského města. Který z nabízených názvů vznikl právě ze jména tohoto města pod Ještědem?",
    "Liberec leží v Libereckém kraji a je jeho krajským městem. Kraj nese jméno podle něj, proto se oba názvy podobají.",
  ),
  t(
    "Ve kterém kraji leží město Olomouc?",
    "Olomoucký kraj",
    [
      ["Jihomoravský kraj", "Jihomoravský kraj leží jižněji, jeho centrem je největší moravské město."],
      ["Zlínský kraj", "Zlínský kraj je na východní Moravě, tohle město leží na střední Moravě."],
      ["Moravskoslezský kraj", "Moravskoslezský kraj je severovýchodně u polských hranic, ne ve středu Moravy."],
    ],
    "To město leží na střední Moravě a patří k nejstarším u nás.",
    "Většina krajů si vzala jméno po svém krajském městě. Najdi mezi nabídnutými moravskými kraji ten, jehož název je odvozený od jména tohoto města.",
    "Olomouc leží v Olomouckém kraji a je jeho krajským městem. Je to jedno z nejstarších a historicky nejvýznamnějších měst na Moravě.",
  ),
  t(
    "Ve kterém kraji leží město Zlín?",
    "Zlínský kraj",
    [
      ["Jihomoravský kraj", "Jihomoravský kraj leží na jih a západ odtud, jeho centrem je Brno."],
      ["Olomoucký kraj", "Olomoucký kraj je na střední Moravě, tohle město je východněji."],
      ["Moravskoslezský kraj", "Moravskoslezský kraj leží severněji u Polska, ne na východní Moravě."],
    ],
    "To město na východní Moravě proslavila obuvnická firma Baťa.",
    "Kraje se obvykle jmenují po svém krajském městě. Který z nabízených moravských názvů je odvozený od jména tohoto baťovského města?",
    "Zlín leží ve Zlínském kraji a je jeho krajským městem. Leží na východní Moravě a proslavila ho firma Baťa.",
  ),
  t(
    "Ve kterém kraji leží město Brno?",
    "Jihomoravský kraj",
    [
      ["Moravskoslezský kraj", "Moravskoslezský kraj je na severovýchodě Moravy u Polska, ne na jihu."],
      ["Zlínský kraj", "Zlínský kraj leží na východní Moravě, tohle město je západněji."],
      ["Olomoucký kraj", "Olomoucký kraj je na střední Moravě, tohle město leží jižněji."],
    ],
    "To město je druhé největší u nás a leží na jihu Moravy.",
    "Název kraje často prozradí jeho polohu. Hledej ten, který má v názvu zároveň světovou stranu jih a historickou zemi Moravu.",
    "Brno leží v Jihomoravském kraji a je jeho krajským městem. Název kraje spojuje světovou stranu a historickou zemi, ve které leží.",
  ),
  t(
    "Ve kterém kraji leží město Ostrava?",
    "Moravskoslezský kraj",
    [
      ["Olomoucký kraj", "Olomoucký kraj leží jihozápadně odtud na střední Moravě."],
      ["Zlínský kraj", "Zlínský kraj je na východní Moravě, jižněji než tohle město."],
      ["Jihomoravský kraj", "Jihomoravský kraj leží na jihu Moravy, ne na severovýchodě u Polska."],
    ],
    "To město je třetí největší u nás a leží u hranic s Polskem.",
    "Okolí toho města nese v názvu dvě historické země — Moravu a Slezsko, které se tam stýkají. Který z nabízených názvů obě spojuje?",
    "Ostrava leží v Moravskoslezském kraji a je jeho krajským městem. Název kraje spojuje dvě historické země, Moravu a Slezsko, na jejichž pomezí město leží.",
  ),
];

const POOL_L3: PracticeTask[] = [
  t(
    "Který kraj je jedinou výjimkou — jeho krajské město se nejmenuje stejně jako kraj?",
    "Kraj Vysočina",
    [
      ["Plzeňský kraj", "Ten se jmenuje přesně podle svého krajského města, takže výjimkou není."],
      ["Zlínský kraj", "I ten nese jméno svého krajského města na východní Moravě."],
      ["Olomoucký kraj", "Také jeho název vznikl ze jména krajského města na střední Moravě."],
    ],
    "Většina krajů si vzala jméno po svém hlavním městě — hledej ten, který ne.",
    "Jeden jediný kraj dostal jméno podle typu krajiny, ve které leží, a ne podle města. Projdi nabízené názvy a najdi ten, který žádné české město nepřipomíná.",
    "Kraj Vysočina je jediný, jehož krajské město (Jihlava) se nejmenuje stejně jako kraj. Jeho název vznikl z názvu kopcovité krajiny, ostatní kraje se jmenují po svém městě.",
  ),
  t(
    "Krajský úřad sídlí v Jihlavě. Který kraj tedy spravuje?",
    "Kraj Vysočina",
    [
      ["Jihomoravský kraj", "Ten se spravuje z Brna. Podobný začátek názvu tě nesmí zmást."],
      ["Pardubický kraj", "Ten se řídí z Pardubic ve východních Čechách, ne ze středu republiky."],
      ["Jihočeský kraj", "Ten se spravuje z Českých Budějovic na jihu Čech."],
    ],
    "Postupuj obráceně než obvykle: od města ke kraji.",
    "U většiny krajů bys jméno města v názvu kraje našel — tady ne. Vzpomeň si, který kraj se jako jediný jmenuje podle krajiny, a ověř, které město ho spravuje.",
    "Jihlava je krajské město kraje Vysočina, takže krajský úřad v ní spravuje právě tento kraj. Je to jediný kraj, jehož jméno neprozradí, kde jeho úřad sídlí.",
  ),
  t(
    "Jihočeský kraj i Jihomoravský kraj mají v názvu slovo „Jiho-“. Které krajské město patří k tomu jihočeskému?",
    "České Budějovice",
    [
      ["Brno", "Brno je centrem toho druhého kraje s podobným názvem — leží na jihu Moravy."],
      ["Karlovy Vary", "Karlovy Vary leží na západě Čech, s jižními kraji nemají nic společného."],
      ["Ústí nad Labem", "Ústí nad Labem je na severu Čech u Labe, ne na jihu."],
    ],
    "Rozhodni nejdřív, jestli hledáš město v Čechách, nebo na Moravě.",
    "Druhá část názvu kraje říká, ve které historické zemi leží. Teprve pak vyber z nabídky město, které se v té zemi nachází a spravuje jižní část.",
    "České Budějovice jsou krajské město Jihočeského kraje, který leží na jihu Čech. Nezaměňuj ho s Jihomoravským krajem, jehož krajským městem je Brno.",
  ),
  t(
    "Jihočeský kraj i Jihomoravský kraj mají v názvu slovo „Jiho-“. Které krajské město patří k tomu jihomoravskému?",
    "Brno",
    [
      ["České Budějovice", "České Budějovice spravují ten druhý jižní kraj — ten v Čechách."],
      ["Zlín", "Zlín je také na Moravě, ale spravuje kraj na jejím východě, ne na jihu."],
      ["Olomouc", "Olomouc leží na střední Moravě a spravuje jiný kraj."],
    ],
    "Nejprve urči zemi: Čechy, nebo Morava?",
    "Když víš, ve které historické zemi kraj leží, zbývá z nabízených měst vybrat to, které v ní leží nejjižněji a je zároveň největší.",
    "Brno je krajské město Jihomoravského kraje, který leží na jihu Moravy. Nezaměňuj ho s Jihočeským krajem, jehož krajským městem jsou České Budějovice.",
  ),
  t(
    "Praha je hlavní město ČR a zároveň samostatný kraj. Kolik krajů má Česká republika CELKEM, počítáme-li Prahu mezi ně?",
    "14 krajů",
    [
      ["13 krajů", "Tolik by jich bylo, kdybys Prahu nezapočítal. Ona ale krajem je."],
      ["15 krajů", "To je o jeden navíc — Prahu bys započítal dvakrát, jako město i jako kraj."],
      ["12 krajů", "Dvanáct je příliš málo, chybí ti Praha i další dva kraje."],
    ],
    "Praha se do celkového počtu započítává jako jeden z krajů.",
    "Postupuj ve dvou krocích: vzpomeň si na počet krajů bez hlavního města a pak k němu přidej Prahu, protože i ona kraj tvoří.",
    "Česká republika má 14 krajů a Praha je jedním z nich — je zároveň hlavním městem státu i samostatným krajem. Proto se do celkového počtu započítává.",
  ),
  t(
    "Kdyby Praha nebyla samostatným krajem, ale běžným městem, kolik krajů by Česká republika měla?",
    "13 krajů",
    [
      ["14 krajů", "Tolik jich je i s Prahou. Když ji odečteš, musí jich být o jeden méně."],
      ["15 krajů", "Odebráním jednoho kraje jejich počet neporoste, ale klesne."],
      ["12 krajů", "Ubral jsi dva kraje místo jednoho. Odečítá se pouze Praha."],
    ],
    "Česká republika má celkem 14 krajů i s hlavním městem.",
    "Úloha je obrácená než obvykle: neptá se na celkový počet, ale na počet po odebrání jednoho kraje. Od celkového počtu tedy jeden kraj odečti.",
    "Z celkového počtu 14 krajů by po odečtení Prahy zbylo 13 krajů. Praha je totiž započítaná jako jeden samostatný kraj, ne jako obyčejné město.",
  ),
  t(
    "Krajský úřad Středočeského kraje sídlí v Praze. Patří proto Praha do Středočeského kraje?",
    "Ne, Praha je samostatný kraj",
    [
      ["Ano, protože v ní sídlí jeho úřad", "Sídlo úřadu nerozhoduje o tom, kam město patří. Praha spadá sama pod sebe."],
      ["Ano, protože leží uprostřed toho kraje", "Leží uprostřed, ale je z něj vyjmutá — tvoří vlastní kraj."],
      ["Ne, protože Praha leží v Jihočeském kraji", "Praha na jihu Čech neleží. Nepatří však ani do žádného jiného kraje."],
    ],
    "Rozliš dvě různé věci: kde úřad sídlí a co pod něj spadá.",
    "Nejdřív si ujasni, jaké postavení má hlavní město mezi kraji. Pak teprve rozhodni, jestli může zároveň patřit i pod jiný kraj.",
    "Praha do Středočeského kraje nepatří, i když v ní jeho úřad sídlí. Praha tvoří vlastní kraj, takže leží uvnitř území Středočeského kraje, ale není jeho součástí.",
  ),
  t(
    "Rodina bydlí v obci na východní Moravě, v kraji proslulém obuvnickou firmou Baťa. Do kterého města pojede na krajský úřad?",
    "Do Zlína",
    [
      ["Do Brna", "Brno spravuje jih Moravy. Baťovský kraj má vlastní centrum jinde."],
      ["Do Olomouce", "Olomouc je centrem střední Moravy, ne té východní."],
      ["Do Ostravy", "Ostrava spravuje severovýchod Moravy u polských hranic."],
    ],
    "Řeš to ve dvou krocích: nejdřív urči kraj, pak jeho krajské město.",
    "Firma Baťa vyráběla boty a proslavila jedno konkrétní město na východní Moravě. To město dalo kraji jméno, a proto v něm sídlí i krajský úřad.",
    "Baťovským krajem na východní Moravě je Zlínský kraj a jeho krajským městem je Zlín. Na krajský úřad se jezdí vždy do krajského města, tedy právě tam.",
  ),
  t(
    "Dítě bydlí ve městě u soutoku řek Labe a Orlice ve východních Čechách. Ve kterém kraji tedy chodí do školy?",
    "V Královéhradeckém kraji",
    [
      ["V Pardubickém kraji", "Pardubice leží také u Labe a nedaleko, ale Orlice se do Labe vlévá o kousek výš."],
      ["V Ústeckém kraji", "Ústí nad Labem leží u Labe, ale až na severu Čech, ne na východě."],
      ["V Libereckém kraji", "Liberecký kraj leží na severu pod Ještědem, žádný soutok Labe a Orlice v něm není."],
    ],
    "Nejdřív urči město, teprve pak kraj.",
    "Soutok Labe a Orlice je ve východních Čechách jen jeden a leží u města, jehož jméno se skládá ze dvou slov. Podle něj se jmenuje i celý kraj.",
    "U soutoku Labe a Orlice leží Hradec Králové, krajské město Královéhradeckého kraje. Dítě tedy chodí do školy v tomto kraji.",
  ),
  t(
    "Rodina se stěhuje z Ostravy do Brna. Ze kterého kraje do kterého se stěhuje?",
    "Z Moravskoslezského kraje do Jihomoravského kraje",
    [
      ["Z Jihomoravského kraje do Moravskoslezského kraje", "Máš to obráceně — stěhují se právě opačným směrem, ze severovýchodu na jih."],
      ["Z Olomouckého kraje do Zlínského kraje", "Ani jedno z těch měst není krajským městem těchto dvou krajů."],
      ["Ze Zlínského kraje do Jihomoravského kraje", "Druhá část sedí, první ne — výchozí město nespravuje kraj na východní Moravě."],
    ],
    "Ke každému městu urči jeho kraj a pak je dej do správného pořadí.",
    "Obě města jsou krajská, takže jméno kraje z nich odvodíš. Pozor na pořadí: první uvedený kraj musí být ten, odkud rodina odjíždí.",
    "Ostrava je krajským městem Moravskoslezského kraje a Brno Jihomoravského kraje. Rodina se tedy stěhuje ze severovýchodu Moravy na její jih.",
  ),
  t(
    "Haná je oblast na střední Moravě se svými kroji, nářečím a zvyky, ale nemá vlastní úřad ani přesně dané hranice. Jak takovou oblast správně nazveme?",
    "Region",
    [
      ["Kraj", "Kraj by musel mít přesné hranice a vlastní úřad. Tady chybí obojí."],
      ["Obec", "Obec je jedna vesnice nebo město s vlastním úřadem, ne rozlehlá oblast."],
      ["Stát", "Stát má hranice, vládu i zákony. Tady jde jen o oblast uvnitř jednoho státu."],
    ],
    "Porovnej popis oblasti s tím, co musí mít kraj.",
    "V zadání se výslovně píše, co oblasti chybí: úřad a přesné hranice. Právě podle těchto dvou věcí se poznají celky vytvořené úředně od těch, které vznikly životem lidí.",
    "Haná je region — oblast se společnými znaky (kroje, nářečí, zvyky), ale bez vlastního úřadu a bez přesných hranic. Právě tím se region liší od kraje.",
  ),
  t(
    "Turisté chtějí do slavných lázní s horkými minerálními prameny v západních Čechách. Do kterého kraje pojedou?",
    "Karlovarský kraj",
    [
      ["Plzeňský kraj", "Plzeňský kraj je také v západních Čechách, ale nejslavnější lázně leží v tom severnějším."],
      ["Ústecký kraj", "Ústecký kraj je na severu Čech u Labe, ne v západním lázeňském koutu."],
      ["Jihočeský kraj", "Jihočeský kraj leží na jihu u Rakouska, ne na západě."],
    ],
    "Nejdřív urči lázeňské město a teprve pak území, které se podle něj jmenuje.",
    "Ty lázně jsou nejslavnější u nás, koná se v nich filmový festival a jejich jméno se skládá ze dvou slov. Okolní území nese jméno odvozené právě z nich.",
    "Nejslavnější lázně s horkými prameny v západních Čechách jsou Karlovy Vary, krajské město Karlovarského kraje. Turisté tedy pojedou do tohoto kraje.",
  ),
  t(
    "Krajské město Jihomoravského kraje je druhé největší v ČR, krajské město Moravskoslezského kraje třetí. Které z nich je větší?",
    "Brno",
    [
      ["Ostrava", "Ostrava je podle zadání až třetí v pořadí, takže je menší než město na druhém místě."],
      ["Olomouc", "Olomouc v zadání vůbec nefiguruje — nespravuje ani jeden ze jmenovaných krajů."],
      ["Zlín", "Zlín spravuje kraj na východní Moravě, o kterém v zadání není řeč."],
    ],
    "Nejdřív ke každému kraji přiřaď jeho město, pak porovnej pořadí.",
    "Menší pořadové číslo znamená větší město: druhé je větší než třetí. Zjisti tedy, které město spravuje jižní Moravu, a to bude odpověď.",
    "Jihomoravský kraj spravuje Brno (druhé největší město ČR), Moravskoslezský kraj Ostrava (třetí největší). Druhé místo znamená větší město, proto je větší Brno.",
  ),
  t(
    "Kamarád tvrdí, že Vysočina není kraj, ale jen region, protože se nejmenuje podle žádného města. Má pravdu?",
    "Nemá — má vlastní úřad i přesné hranice, takže je to kraj",
    [
      ["Má pravdu, bez města v názvu to kraj být nemůže", "O tom, co je kraj, nerozhoduje název, ale úřad a hranice."],
      ["Má pravdu, protože je to jen kopcovitá krajina", "Podle krajiny dostala jméno, ale spravuje ji krajský úřad v Jihlavě."],
      ["Nemá, protože každá oblast v republice je kraj", "To neplatí — Haná ani Chodsko kraje nejsou, přestože je to oblast."],
    ],
    "Rozhodni podle definice, ne podle názvu.",
    "Vzpomeň si, které dvě věci musí území mít, aby bylo krajem, a ověř, jestli je Vysočina má. Jméno mezi ně nepatří.",
    "Vysočina je kraj: má přesně vymezené hranice a vlastní krajský úřad v Jihlavě. To, že jméno nedostala podle města, ale podle krajiny, na tom nic nemění.",
  ),
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool);
}

export const KRAJEREGIONYCR: TopicMetadata[] = [
  {
    id: "g3-prvouka-misto-kde-zijeme-nase-vlast-kraje-a-regiony-cr-uvod-nas-region",
    title: "Kraje a regiony ČR (úvod)",
    studentTitle: "Kraje České republiky",
    subject: "prvouka",
    category: "Místo, kde žijeme",
    topic: "Naše vlast",
    briefDescription: "Poznáš kraje ČR a jejich krajská města.",
    keywords: [
      "kraj",
      "region",
      "krajské město",
      "Praha",
      "Brno",
      "Ostrava",
      "Plzeň",
      "České Budějovice",
      "Liberec",
      "Olomouc",
      "Zlín",
      "Pardubice",
      "Hradec Králové",
      "Jihlava",
      "Karlovy Vary",
      "Ústí nad Labem",
    ],
    goals: [
      "Vědět, že Česká republika má 14 krajů.",
      "Znát rozdíl mezi krajem a regionem.",
      "Umět přiřadit krajská města ke správným krajům.",
    ],
    boundaries: [
      "Podrobná geografie a poloha krajů na mapě nejsou součástí základního obsahu pro 3. ročník.",
      "Detaily o krajské správě a politice se neprobírají.",
    ],
    gradeRange: [3, 3],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "ČR má 14 krajů. Kraj = územní celek se správou. Region = oblast se společnými znaky. Praha je hlavní město i kraj.",
      steps: [
        "Vzpomeň si, kolik krajů má Česká republika.",
        "Kraj a region nejsou totéž — kraj má přesné hranice a úřad, region je oblast se společnými znaky.",
        "Každý kraj má krajské město — většinou má stejný název jako kraj.",
        "Praha je výjimka — je to hlavní město státu i samostatný kraj.",
      ],
      commonMistake:
        "Středočeský kraj nemá vlastní krajské město — jeho správa sídlí v Praze, ale Praha do Středočeského kraje nepatří.",
      example:
        "Jihomoravský kraj — krajské město Brno. Vysočina — krajské město Jihlava (jediný kraj bez jména města v názvu).",
    },
  },
];
