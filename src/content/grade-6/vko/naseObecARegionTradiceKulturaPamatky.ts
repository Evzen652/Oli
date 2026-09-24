/**
 * Výchova k občanství 6. ročník — Naše obec a region: tradice, kultura,
 * památky (select_one).
 *
 * Cíl: rozpoznat a zařadit pojem z obecní/regionální samosprávy a místních
 * tradic/památek do správné kategorie — NE zapamatovat si konkrétní jména
 * nebo data, ale rozlišit pojmy, které si šesťák běžně plete. Tři okruhy:
 *  • role v obecní samosprávě (obec, obecní/městský úřad, starosta,
 *    zastupitelstvo obce) a vztah obec × kraj (dosah věci);
 *  • typ památky podle popisu (hrad = opevněné sídlo k obraně, zámek =
 *    reprezentativní obytné sídlo bez opevnění, chrám = sakrální stavba);
 *  • místní/regionální tradice (kulturní zvyk vázaný na konkrétní místo)
 *    × státní svátek (den daný zákonem pro celou ČR).
 *
 * Chybový model (viz `why` u každého distraktoru):
 *  • obec ↔ kraj: žák plete úroveň samosprávy podle dosahu věci (místní
 *    chodník vs. silnice mezi víc městy), ne podle velikosti sídla.
 *  • zastupitelstvo ↔ úřad: zastupitelstvo je volený sbor, který ROZHODUJE
 *    a volí starostu; úřad tvoří úředníci, kteří rozhodnutí VYŘIZUJÍ.
 *  • hrad ↔ zámek: rozhoduje ÚČEL stavby (obrana × pohodlné bydlení a
 *    reprezentace), ne pohádkový obraz „stará budova s věžemi“. Popis vždy
 *    obsahuje jednoznačné znaky (zdi/příkop/věž × okna/zahrada/bez opevnění).
 *  • místní tradice ↔ státní svátek: tradice se váže ke konkrétnímu místu
 *    a jinde se nemusí slavit vůbec; státní svátek platí zákonem stejně pro
 *    celou ČR.
 *
 *  • L1 — přímé rozpoznání z jedné jasné věty/definice (kdo/co je
 *    starosta, úřad, zastupitelstvo, obec/kraj; typ památky podle definice).
 *  • L2 — aplikace/porovnání dvou blízkých pojmů v KONKRÉTNÍ SITUACI, bez
 *    pojmenování pojmu v zadání (hrad/zámek jen podle popisu stavby).
 *  • L3 — transfer: ze SMYŠLENÉ situace nebo z popisu bez pojmenování
 *    odvodit typ i zařazení najednou (dva kroky), nebo rozhodnout o novém,
 *    vymyšleném případu podle stejného pravidla. Znění L3 je vždy jinak
 *    formulované než L1 — žádná recyklace věty.
 *
 * Fakta jen ta, na kterých se shodují běžné učebnice VKO 6. ročníku (Fraus,
 * SPN, Nová škola). Role úřadu/samosprávy jsou funkce, ne jmenované osoby.
 * Svátky a symboly ČR jsou stálá fakta (datum, důvod), ne aktuální dění.
 * Generátor nemá stav mezi voláními — rotace poolem se nastaví v gen().
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildChoiceTask as choice, losUlohy, ruzneUlohy, type Distractor } from "./_shared";

interface Polozka {
  q: string;
  key: string;
  d: [Distractor, Distractor, Distractor];
  hints: [string, string];
  explanation: string;
}

// ── L1 — přímé rozpoznání ────────────────────────────────────────────────
const POOL_L1: Polozka[] = [
  {
    q: "Kdo stojí v čele obce a je zvolen zastupitelstvem obce?",
    key: "starosta",
    d: [
      { value: "hejtman", why: "Hejtman stojí v čele kraje, ne jednotlivé obce — to je vyšší úroveň veřejné správy." },
      { value: "vedoucí pracovník úřadu", why: "Úředníci na úřadě záležitosti vyřizují, ale obec navenek vede a zastupuje jiná zvolená osoba." },
      { value: "prezident republiky", why: "Prezident je hlavou celého státu, ne jedné konkrétní obce — to je úplně jiná úroveň veřejné správy." },
    ],
    hints: [
      "Přemýšlej, kdo obec zastupuje navenek a byl do své funkce zvolený místními zastupiteli, ne obyvateli celého kraje nebo státu.",
      "Hledaná osoba stojí v čele jedné konkrétní obce nebo města — zvolili ji tamní zastupitelé, ne kraj ani stát, a od úředníků na úřadě se liší tím, že obec zastupuje a vede, ne jen vyřizuje jednotlivé žádosti.",
    ],
    explanation: "Starosta stojí v čele obce a zastupuje ji navenek. Do funkce ho volí zastupitelstvo obce, ne přímo všichni obyvatelé.",
  },
  {
    q: "Kdo vyřizuje běžné záležitosti občanů obce, třeba vydání dokladů nebo ověření podpisu?",
    key: "obecní (městský) úřad",
    d: [
      { value: "zastupitelstvo obce", why: "Zastupitelstvo hlavně rozhoduje o důležitých otázkách a volí starostu, běžné vyřizování jednotlivých žádostí má na starosti jiný orgán." },
      { value: "krajský úřad", why: "Ten řeší záležitosti širšího dosahu pro víc obcí najednou, ne běžné doklady jednotlivých obyvatel jedné obce." },
      { value: "starosta osobně", why: "Obec navenek vede a zastupuje starosta, ale jednotlivé žádosti občanů vyřizují úředníci, ne on sám osobně." },
    ],
    hints: [
      "Přemýšlej, kam se člověk vydá, když potřebuje osobně vyřídit konkrétní doklad nebo povolení, ne rozhodovat o velké otázce celé obce.",
      "Hledaný orgán tvoří úředníci, kteří den co den vyřizují jednotlivé žádosti obyvatel — na rozdíl od volených zástupců, kteří jen rozhodují o důležitých otázkách, nebo od kraje, který řeší věci širšího dosahu.",
    ],
    explanation: "Obecní (městský) úřad tvoří úředníci, kteří vyřizují běžnou agendu občanů — doklady, povolení a podobné žádosti.",
  },
  {
    q: "Kdo je volený sbor, který rozhoduje o důležitých otázkách obce a volí starostu?",
    key: "zastupitelstvo obce",
    d: [
      { value: "obecní úřad", why: "Úřad tvoří úředníci, kteří rozhodnutí spíš vyřizují, o důležitých otázkách a volbě starosty rozhoduje jiný, volený orgán." },
      { value: "krajské zastupitelstvo", why: "To rozhoduje o věcech celého kraje, ne o starostovi jedné konkrétní obce." },
      { value: "hejtman", why: "Hejtman stojí v čele kraje a nevolí starostu jednotlivé obce." },
    ],
    hints: [
      "Přemýšlej, kdo v obci hlasuje o důležitých otázkách a koho ze svých řad si tihle lidé volí.",
      "Hledaný orgán tvoří lidé zvolení obyvateli obce ve volbách — společně rozhodují o důležitých věcech a zároveň si ze svého středu volí toho, kdo obec povede.",
    ],
    explanation: "Zastupitelstvo obce je volený sbor, který rozhoduje o důležitých otázkách obce a ze svého středu volí starostu.",
  },
  {
    q: "Jaká je základní jednotka veřejné samosprávy, kde lidé přímo žijí — třeba vesnice nebo město?",
    key: "obec",
    d: [
      { value: "kraj", why: "Kraj je vyšší jednotka, která sdružuje víc takových základních jednotek dohromady." },
      { value: "stát", why: "Stát je celá republika, mnohem větší celek než jedna vesnice nebo jedno město." },
      { value: "region", why: "Tohle slovo označuje jen širší oblast, ne přesně vymezenou jednotku veřejné správy." },
    ],
    hints: [
      "Přemýšlej, jak se nazývá nejmenší, nejzákladnější jednotka veřejné správy, ve které přímo bydlíš.",
      "Hledané slovo označuje místo, kde lidé přímo žijí — může to být malá vesnice i velké město — a je to nejmenší, základní stupeň veřejné správy, ze kterého se skládají větší jednotky.",
    ],
    explanation: "Obec je základní jednotka veřejné samosprávy — vesnice, městys nebo město, kde lidé přímo žijí.",
  },
  {
    q: "Která jednotka samosprávy je nadřazená obci a zahrnuje víc obcí najednou?",
    key: "kraj",
    d: [
      { value: "obec", why: "Obec je naopak základní, nejmenší jednotka — to je to, co je do větší jednotky sdruženo." },
      { value: "městys", why: "Městys je jen typ obce mezi vesnicí a městem, ne jednotka nadřazená víc obcím." },
      { value: "městská část", why: "Městská část je součást jednoho velkého města, ne jednotka nad víc samostatnými obcemi." },
    ],
    hints: [
      "Přemýšlej, jak se nazývá vyšší jednotka veřejné správy, do které patří víc obcí najednou.",
      "Hledaná jednotka spojuje víc menších sídelních jednotek dohromady a řeší věci, které přesahují jednu vesnici nebo jedno město.",
    ],
    explanation: "Kraj je vyšší územně samosprávný celek, nadřazený obcím, a řeší věci, které přesahují jednu obec.",
  },
  {
    q: "Jak se nazývá opevněné sídlo s vysokými zdmi, příkopem a věžemi, které sloužilo především k obraně?",
    key: "hrad",
    d: [
      { value: "zámek", why: "Tahle stavba sloužila hlavně k pohodlnému bydlení a reprezentaci, obvykle bez zdí k obraně a bez příkopu." },
      { value: "chrám", why: "Tahle stavba slouží k bohoslužbám, ne k obraně opevněným sídlem." },
      { value: "radnice", why: "Tahle budova slouží jako sídlo obecní správy, s obranou nemá nic společného." },
    ],
    hints: [
      "Přemýšlej, k čemu takové sídlo se zdmi, příkopem a věžemi hlavně sloužilo — k obraně, nebo k pohodlnému bydlení?",
      "Hledaná stavba vznikla především kvůli obraně — proto má vysoké zdi, příkop a věže. Liší se tak od sídel stavěných hlavně pro pohodlí a okázalost, nebo od staveb určených k bohoslužbám.",
    ],
    explanation: "Hrad je opevněné šlechtické sídlo postavené především k obraně — má vysoké zdi, příkop a věže.",
  },
  {
    q: "Jak se nazývá reprezentativní obytné sídlo, stavěné pro pohodlné bydlení a okázalost, obvykle bez opevnění?",
    key: "zámek",
    d: [
      { value: "hrad", why: "Tahle stavba měla naopak obrannou funkci — vysoké zdi a příkop. Sídlo pro pohodlí a okázalost se nazývá jinak." },
      { value: "chrám", why: "Tahle stavba slouží k bohoslužbám, ne k bydlení šlechty." },
      { value: "radnice", why: "Tahle budova je sídlo obecní správy, ne obytné sídlo šlechtické rodiny." },
    ],
    hints: [
      "Přemýšlej, k čemu tahle stavba bez opevnění hlavně sloužila — k obraně, nebo k pohodlnému bydlení a okázalosti?",
      "Hledaná stavba vznikla kvůli pohodlnému bydlení a reprezentaci, proto má velká okna a okrasné zahrady místo zdí a příkopu — tím se liší od opevněných sídel stavěných k obraně.",
    ],
    explanation: "Zámek je reprezentativní obytné sídlo, stavěné pro pohodlné bydlení a okázalost, obvykle bez opevnění.",
  },
  {
    q: "Jak se nazývá stavba určená k bohoslužbám, například kostel nebo katedrála?",
    key: "chrám",
    d: [
      { value: "hrad", why: "Tahle stavba je opevněné sídlo k obraně, ne místo pro bohoslužby." },
      { value: "zámek", why: "Tahle stavba je obytné sídlo šlechty, ne stavba pro bohoslužby." },
      { value: "radnice", why: "Tahle budova je sídlo obecní správy, ne stavba pro bohoslužby." },
    ],
    hints: [
      "Přemýšlej, jaký druh stavby slouží konkrétně k modlitbám a bohoslužbám, ne k bydlení nebo obraně.",
      "Hledané slovo označuje sakrální stavbu — místo, kam lidé chodí na bohoslužby — na rozdíl od sídel postavených k obraně nebo k pohodlnému bydlení.",
    ],
    explanation: "Chrám je sakrální stavba určená k bohoslužbám, například kostel nebo katedrála.",
  },
  {
    q: "Jak se nazývá lidový zvyk vázaný na konkrétní obec nebo region, který se v jiných obcích vůbec nemusí slavit?",
    key: "místní tradice",
    d: [
      { value: "státní svátek", why: "Ten platí stejně pro celou republiku podle zákona, tenhle zvyk zná jen některá místa." },
      { value: "kalendářní měsíc", why: "To je jen časové označení, ne kulturní zvyk vázaný na konkrétní místo." },
      { value: "úřední vyhláška", why: "Vyhláška je právní předpis obce, ne kulturní zvyk nebo slavnost." },
    ],
    hints: [
      "Přemýšlej, jestli takový zvyk platí stejně po celé zemi, nebo jen v některých obcích a regionech.",
      "Hledané slovní spojení popisuje zvyk, který si lidé v konkrétním místě předávají po generace a jinde v zemi ho vůbec nemusí znát — na rozdíl od něčeho, co platí stejně pro celou republiku.",
    ],
    explanation: "Místní tradice je kulturní zvyk vázaný na konkrétní obec nebo region — jinde v republice ho vůbec nemusí znát.",
  },
  {
    q: "Jak se nazývá den, který je stejně pro celou Českou republiku stanovený zákonem, například 28. říjen?",
    key: "státní svátek",
    d: [
      { value: "místní tradice", why: "Ta se váže jen k jedné obci nebo regionu, tenhle den platí stejně pro celou zemi." },
      { value: "obecní slavnost", why: "Tu si pořádá jedna konkrétní obec podle vlastního zvyku, tenhle den je daný zákonem pro celý stát." },
      { value: "pracovní den", why: "Tenhle den je naopak volnem stanoveným zákonem, ne běžný pracovní den." },
    ],
    hints: [
      "Přemýšlej, jestli takový den platí jen v jedné obci, nebo stejně pro úplně celou zemi.",
      "Hledané slovní spojení označuje den daný zákonem stejně pro celou republiku — na rozdíl od zvyku, který si udržuje jen jedna obec nebo region.",
    ],
    explanation: "Státní svátek je den stanovený zákonem stejně pro celou Českou republiku.",
  },
  {
    q: "Kdo obec zastupuje navenek a podepisuje za ni důležité dokumenty?",
    key: "starosta",
    d: [
      { value: "krajský úřad", why: "Ten řeší záležitosti kraje, obec navenek zastupuje jiná, k tomu zvolená osoba." },
      { value: "obecní úřad jako celek", why: "Úřad zajišťuje běžnou agendu, ale navenek obec zastupuje a dokumenty podepisuje konkrétní zvolená osoba." },
      { value: "náhodně vybraný občan obce", why: "Obec nezastupuje náhodně vybraný obyvatel, ale osoba zvolená do této funkce zastupitelstvem." },
    ],
    hints: [
      "Přemýšlej, kdo v obci nese odpovědnost za její vedení a smí za ni podepisovat důležité věci.",
      "Hledaná osoba stojí v čele obce, zastupuje ji na jednáních i při podpisu dokumentů — na rozdíl od úřadu, který jen vyřizuje běžnou agendu jednotlivých obyvatel.",
    ],
    explanation: "Obec navenek zastupuje a důležité dokumenty za ni podepisuje starosta.",
  },
  {
    q: "Kdo stojí v čele kraje, zvolený krajským zastupitelstvem?",
    key: "hejtman",
    d: [
      { value: "starosta", why: "Starosta stojí v čele jedné obce, ne celého kraje — to je nižší úroveň veřejné správy." },
      { value: "prezident republiky", why: "Prezident je hlavou celého státu, ne jednoho kraje." },
      { value: "obecní úřad", why: "To je orgán jedné obce, který vyřizuje agendu, ne osoba v čele celého kraje." },
    ],
    hints: [
      "Přemýšlej, kdo stojí v čele vyšší jednotky veřejné správy, která sdružuje víc obcí najednou.",
      "Hledaná osoba vede celý kraj — vyšší jednotku, do které patří víc obcí — a do funkce ji volí krajští zastupitelé, podobně jako obec vede jiná zvolená osoba na nižší úrovni.",
    ],
    explanation: "Hejtman stojí v čele kraje. Do funkce ho volí krajské zastupitelstvo, podobně jako obec vede starosta zvolený zastupitelstvem obce.",
  },
];

// ── L2 — aplikace/porovnání v konkrétní situaci ─────────────────────────
const POOL_L2: Polozka[] = [
  {
    q: "Chodník před panem Novákovým domem je rozbitý a potřebuje opravit. Kdo se o takovou opravu obvykle stará?",
    key: "obec (obecní úřad)",
    d: [
      { value: "kraj (krajský úřad)", why: "Kraj se stará o věci širšího dosahu, jako jsou silnice mezi obcemi — oprava jednoho chodníku patří na nižší úroveň." },
      { value: "stát přímo z Prahy", why: "Stát řeší celostátní záležitosti, oprava jednoho chodníku je věc místního dosahu." },
      { value: "krajská správa a údržba silnic", why: "Ta má na starosti krajské silnice mezi obcemi, ne chodníky u jednotlivých domů uvnitř jedné obce." },
    ],
    hints: [
      "Přemýšlej, jak daleko sahá dopad téhle opravy — týká se jen jednoho domu v jedné ulici, nebo víc míst najednou?",
      "Věc, která se týká jen jednoho místa v jedné ulici, obvykle řeší nejnižší úroveň veřejné správy — ta, do které patří přímo dům pana Nováka — na rozdíl od věcí, které přesahují víc sídel najednou.",
    ],
    explanation: "Oprava chodníku u jednoho domu je věc místního dosahu, o kterou se stará obec (obecní úřad).",
  },
  {
    q: "Mezi dvěma menšími městy vede krajská silnice, kterou využívají lidé z celého okolí — ne dálnice ani velká silnice do Prahy. Kdo se obvykle stará o její opravu?",
    key: "kraj (krajský úřad)",
    d: [
      { value: "jedna z obou obcí sama", why: "Silnice spojující víc měst přesahuje dosah jedné obce, o takové věci se stará vyšší úroveň veřejné správy." },
      { value: "stát přímo z Prahy", why: "Stát spravuje jen dálnice a nejvýznamnější silnice mezi kraji, běžnou krajskou silnici má na starosti kraj." },
      { value: "obecní úřad menší z obou obcí", why: "Silnice širšího dosahu mezi víc městy nepatří pod jednu konkrétní obec, ale pod vyšší úroveň veřejné správy." },
    ],
    hints: [
      "Přemýšlej, jak daleko sahá dopad téhle silnice — slouží jen jednomu městu, nebo spojuje víc měst a je důležitá pro širší okolí? A všimni si, že v zadání jde o krajskou silnici, ne o dálnici.",
      "Věc, která přesahuje dosah jedné obce a slouží širšímu okolí, obvykle řeší vyšší úroveň veřejné správy, do které patří víc obcí najednou. Nejvýznamnější silnice a dálnice spravuje přímo stát, běžnou krajskou silnici mezi menšími městy má na starosti kraj.",
    ],
    explanation: "Krajská silnice spojující víc měst přesahuje dosah jedné obce, proto se o ni stará kraj (krajský úřad). Jen dálnice a nejvýznamnější silnice by spravoval stát.",
  },
  {
    q: "Rodina se přestěhovala do nové obce a potřebuje si tam nechat zapsat trvalé bydliště. Na koho se má obrátit?",
    key: "na obecní (městský) úřad",
    d: [
      { value: "na krajský úřad", why: "Běžné přihlášení trvalého bydliště vyřizuje nižší úroveň veřejné správy, vyšší úroveň řeší jen věci širšího dosahu." },
      { value: "na volený sbor zastupitelů obce", why: "Ten rozhoduje o velkých otázkách obce, běžné přihlášení bydliště má na starosti jiný orgán." },
      { value: "přímo na osobu, která obec vede", why: "Běžnou agendu jako přihlášení bydliště vyřizují úředníci, ne osoba, která obec jen navenek zastupuje." },
    ],
    hints: [
      "Přemýšlej, kam se rodina obrátí, když potřebuje osobně vyřídit konkrétní věc, ne rozhodovat o velké otázce celé obce.",
      "Běžné záležitosti jednotlivých obyvatel, jako je přihlášení trvalého bydliště, vyřizují úředníci na místní úrovni — na rozdíl od voleného sboru, který jen rozhoduje o důležitých otázkách, nebo vyšší úrovně, která řeší věci širšího dosahu.",
    ],
    explanation: "Přihlášení trvalého bydliště v nové obci je běžná agenda, kterou vyřizuje obecní (městský) úřad.",
  },
  {
    q: "Obec chce postavit novou mateřskou školku jen pro děti z vlastní obce. Kdo o tom rozhoduje?",
    key: "zastupitelstvo obce",
    d: [
      { value: "obecní úřad", why: "Úřad rozhodnutí spíš provádí a vyřizuje, o stavbě nové školky rozhoduje volený sbor zastupitelů." },
      { value: "krajské zastupitelstvo", why: "Školka jen pro děti jedné obce je záležitost místního dosahu, ne věcí kraje." },
      { value: "náhodně vybraná skupina obyvatel", why: "O takové investici rozhoduje volený sbor zastupitelů, ne náhodně vybraní lidé." },
    ],
    hints: [
      "Přemýšlej, kdo v obci hlasuje o velkých investicích, jako je stavba nové budovy, ne kdo praktické vyřízení jen provádí.",
      "O velkých rozhodnutích, která se týkají jen jedné obce, hlasuje volený sbor lidí zvolených ve volbách — na rozdíl od úředníků, kteří rozhodnutí až provádí, nebo kraje, který řeší věci širšího dosahu.",
    ],
    explanation: "O stavbě nové školky jen pro vlastní obec rozhoduje zastupitelstvo obce.",
  },
  {
    q: "Kraj plánuje postavit novou nemocnici, která bude sloužit lidem z několika obcí najednou. Kdo o tom rozhoduje?",
    key: "krajské zastupitelstvo",
    d: [
      { value: "zastupitelstvo jedné z obcí", why: "Nemocnice pro víc obcí přesahuje dosah jedné obce, o její stavbě rozhoduje vyšší úroveň veřejné správy." },
      { value: "obecní úřad", why: "Úřad věci jen vyřizuje, o velké investici pro víc obcí rozhoduje volený sbor na vyšší úrovni." },
      { value: "osoba, která vede jednu z obcí", why: "Ta zastupuje jen svou obec, o krajské investici rozhoduje volený sbor na úrovni kraje." },
    ],
    hints: [
      "Přemýšlej, jak daleko sahá dopad téhle nemocnice — slouží jen jedné obci, nebo víc obcím najednou?",
      "O velkých investicích, které slouží víc obcím najednou, rozhoduje volený sbor na vyšší úrovni veřejné správy — na rozdíl od věcí, které se týkají jen jedné konkrétní obce.",
    ],
    explanation: "Nemocnici pro víc obcí najednou schvaluje krajské zastupitelstvo.",
  },
  {
    q: "Zastupitelstvo obce na svém zasedání odhlasovalo, že se v obci postaví nové dětské hřiště. Kdo teď zajistí, aby hřiště opravdu vzniklo — vyřídí formality a podepíše smlouvu s dodavatelem?",
    key: "obecní úřad",
    d: [
      { value: "zastupitelstvo obce znovu", why: "Ten sbor o věci už jednou rozhodl, praktické vyřízení a organizaci má na starosti jiný orgán." },
      { value: "krajský úřad", why: "Jde o hřiště v jedné obci, tuhle věc vyřizuje místní orgán, ne úřad vyšší úrovně." },
      { value: "starosta osobně, bez pomoci úředníků", why: "Starosta obec navenek zastupuje a podepisuje dokumenty, ale konkrétní formality a smlouvy dlouhodobě vyřizují úředníci obecního úřadu, ne on sám osobně." },
    ],
    hints: [
      "Přemýšlej, kdo v obci konkrétní rozhodnutí prakticky provádí — vyřizuje formality a smlouvy — poté, co o něm už bylo hlasováno.",
      "Po hlasování o velké otázce nastupuje jiná složka veřejné správy, která rozhodnutí prakticky vyřídí — zajistí formality, podepíše smlouvu a dohlédne na stavbu — na rozdíl od sboru, který jen hlasoval.",
    ],
    explanation: "Praktické vyřízení odhlasované stavby — formality a smlouvy — zajišťuje obecní úřad.",
  },
  {
    q: "Paní Dvořáková si pořídila psa a potřebuje ho nahlásit a zaplatit místní poplatek. Na koho se obrátí?",
    key: "na obecní (městský) úřad",
    d: [
      { value: "na zastupitelstvo obce", why: "Ten sbor rozhoduje o velkých otázkách obce, běžné nahlášení psa a zaplacení poplatku má na starosti jiný orgán." },
      { value: "na krajské zastupitelstvo", why: "Nahlášení psa je běžná agenda na místní úrovni, ne věc kraje." },
      { value: "přímo na osobu, která obec vede", why: "Běžnou agendu obyvatel vyřizují úředníci, ne osoba, která obec jen navenek zastupuje." },
    ],
    hints: [
      "Přemýšlej, kam se člověk obrátí, když potřebuje osobně vyřídit konkrétní věc, ne rozhodovat o důležité otázce celé obce.",
      "Běžnou agendu jednotlivých obyvatel, jako je nahlášení psa a zaplacení místního poplatku, vyřizují úředníci na místní úrovni — na rozdíl od voleného sboru, který jen rozhoduje o důležitých otázkách.",
    ],
    explanation: "Nahlášení psa a zaplacení místního poplatku vyřídí paní Dvořáková na obecním (městském) úřadě.",
  },
  {
    q: "Obec potřebuje schválit, kolik peněz příští rok utratí na opravu obecní budovy. Kdo o tomto rozpočtu rozhoduje?",
    key: "zastupitelstvo obce",
    d: [
      { value: "obecní úřad", why: "Úřad schválený rozpočet spíš provádí, o jeho schválení rozhoduje volený sbor zastupitelů." },
      { value: "krajský úřad", why: "Jde o rozpočet jedné obce, ten schvaluje sbor téže obce, ne vyšší úroveň veřejné správy." },
      { value: "jednotliví úředníci podle vlastního uvážení", why: "O rozpočtu obce se hlasuje ve voleném sboru, ne podle uvážení jednotlivých úředníků." },
    ],
    hints: [
      "Přemýšlej, kdo v obci hlasuje o penězích a velkých rozhodnutích, ne kdo schválené rozhodnutí jen provádí.",
      "O tom, kolik peněz obec příští rok utratí, hlasuje volený sbor lidí zvolených ve volbách — na rozdíl od úředníků, kteří schválený plán jen naplňují.",
    ],
    explanation: "O rozpočtu obce na opravu obecní budovy rozhoduje zastupitelstvo obce.",
  },
  {
    q: "Na kopci nad městem stojí stavba s vysokými zdmi, hlubokým příkopem a strážní věží — kdysi sloužila hlavně k obraně. O jaký typ stavby jde?",
    key: "hrad",
    d: [
      { value: "zámek", why: "Tahle stavba se stavěla pro pohodlné bydlení a reprezentaci, obvykle bez zdí k obraně a bez příkopu — popsaná stavba má naopak jasné obranné prvky." },
      { value: "chrám", why: "Tahle stavba slouží k bohoslužbám, ne k obraně — popsaná stavba má zdi a příkop typické pro obranné sídlo." },
      { value: "radnice", why: "Tahle budova je sídlo obecní správy, popsaná stavba se zdmi a příkopem sloužila k obraně." },
    ],
    hints: [
      "Přemýšlej, k čemu tahle konkrétní stavba se zdmi, příkopem a věží hlavně sloužila.",
      "Popsaná stavba má znaky obranného sídla — vysoké zdi, příkop, strážní věž. Takové znaky má stavba postavená hlavně kvůli obraně, ne ta stavěná pro pohodlí nebo pro bohoslužby.",
    ],
    explanation: "Vysoké zdi, příkop a strážní věž jsou obranné prvky — jde o hrad.",
  },
  {
    q: "V parku u řeky stojí stavba s velkými prosklenými okny a okrasnou zahradou, bez jakéhokoli opevnění — sloužila šlechtě k pohodlnému bydlení. O jaký typ stavby jde?",
    key: "zámek",
    d: [
      { value: "hrad", why: "Tahle stavba měla naopak obranné prvky — vysoké zdi a příkop. Popsaná stavba má velká okna a zahradu, bez opevnění." },
      { value: "chrám", why: "Tahle stavba slouží k bohoslužbám, ne k pohodlnému bydlení šlechty." },
      { value: "radnice", why: "Tahle budova je sídlo obecní správy, ne obytné sídlo šlechtické rodiny." },
    ],
    hints: [
      "Přemýšlej, k čemu tahle konkrétní stavba bez opevnění hlavně sloužila — k obraně, nebo k pohodlnému bydlení?",
      "Popsaná stavba nemá žádné obranné prvky, má naopak velká okna a okrasnou zahradu. Takové znaky má stavba postavená pro pohodlí a okázalost, ne ta stavěná k obraně nebo k bohoslužbám.",
    ],
    explanation: "Velká okna, okrasná zahrada a chybějící opevnění jsou znaky reprezentativního obytného sídla — jde o zámek.",
  },
  {
    q: "V jedné konkrétní vesnici se každý rok koná pouť s tradičním průvodem v krojích, kterou jinde v republice neznají. Jak se takový zvyk nazývá?",
    key: "místní tradice",
    d: [
      { value: "státní svátek", why: "Ten platí stejně pro celou republiku, tenhle zvyk zná jen jedna vesnice." },
      { value: "úřední nařízení", why: "Pouť není nařízená úřadem, je to dobrovolný kulturní zvyk té vesnice." },
      { value: "školní prázdniny", why: "Prázdniny jsou volno pro školáky v celé zemi, ne kulturní zvyk jedné vesnice." },
    ],
    hints: [
      "Přemýšlej, jestli takový zvyk zná celá republika, nebo jen obyvatelé jedné konkrétní vesnice a okolí.",
      "Zvyk, který se dodržuje jen v jednom místě a jinde v zemi ho vůbec neznají, patří k tomu, co si obyvatelé jednoho místa předávají po generace — na rozdíl od něčeho, co platí stejně pro celou zemi.",
    ],
    explanation: "Pouť s průvodem, kterou zná jen jedna vesnice, je místní tradice.",
  },
  {
    q: "17. listopadu mají volno školy i úřady po celé České republice, protože to stanoví zákon. Jak se takový den nazývá?",
    key: "státní svátek",
    d: [
      { value: "místní tradice", why: "Ta se slaví jen v některých obcích, tenhle den je volno v celé republice podle zákona." },
      { value: "obecní slavnost", why: "Tu si pořádá jedna konkrétní obec, tenhle den platí pro celou zemi." },
      { value: "prázdninový víkend", why: "Jde o den daný zákonem pro celou republiku, ne o běžný víkend." },
    ],
    hints: [
      "Přemýšlej, jestli takové volno platí jen v jedné obci, nebo stejně pro úplně celou zemi.",
      "Den, kdy mají volno školy i úřady po celé zemi na základě zákona, se liší od zvyku, který si udržuje jen jedna obec nebo region — tenhle den platí úplně všude stejně.",
    ],
    explanation: "17. listopad je den daný zákonem pro celou ČR — státní svátek.",
  },
  {
    q: "Masopustní průvod s maskami se v některých obcích koná už po staletí, jinde vůbec ne, protože jde o kulturní zvyk, ne zákonem daný den volna. Jak se takový zvyk obecně nazývá?",
    key: "místní (lidová) tradice",
    d: [
      { value: "státní svátek", why: "Ten je stanovený zákonem stejně pro celou zemi. Popsaný zvyk se dodržuje jen v některých obcích." },
      { value: "náboženská povinnost", why: "Účast v takovém průvodu není povinnost, jde o dobrovolně udržovaný kulturní zvyk." },
      { value: "vyhláška obecního úřadu", why: "Takový zvyk není úřední předpis, ale to, co si lidé sami předávají po generace." },
    ],
    hints: [
      "Přemýšlej, jestli takový zvyk platí stejně po celé zemi na základě zákona, nebo jen v některých obcích podle staré místní zvyklosti.",
      "Zvyk, který se dodržuje jen v některých obcích a jinde ho neznají, patří k tomu, co si lidé v konkrétním místě dobrovolně předávají po generace — na rozdíl od dne daného zákonem pro celou republiku.",
    ],
    explanation: "Masopustní průvod dodržovaný jen v některých obcích je místní (lidová) tradice.",
  },
  {
    q: "V obci chybí lavičky v parku, který patří jen téhle jedné obci. Kdo o jejich pořízení rozhoduje?",
    key: "zastupitelstvo obce",
    d: [
      { value: "krajské zastupitelstvo", why: "Park patří jen jedné obci, jde o věc místního dosahu, ne o věc kraje." },
      { value: "obecní úřad bez rozhodnutí voleného sboru", why: "O pořízení a útratě rozhoduje volený sbor, úřad rozhodnutí až provádí." },
      { value: "náhodně vybraní návštěvníci parku", why: "O takové věci nerozhodují náhodní návštěvníci, ale volený sbor zastupitelů té obce." },
    ],
    hints: [
      "Přemýšlej, kdo v obci hlasuje o menších investicích, jako jsou lavičky v místním parku, ne kdo rozhodnutí jen provádí.",
      "O tom, co se koupí za peníze jedné konkrétní obce, hlasuje volený sbor lidí zvolených ve volbách — na rozdíl od úředníků, kteří rozhodnutí jen provádí, nebo kraje, který řeší věci širšího dosahu.",
    ],
    explanation: "O pořízení laviček v obecním parku rozhoduje zastupitelstvo obce.",
  },
];

// ── L3 — transfer: nová situace, dva kroky najednou ─────────────────────
const POOL_L3: Polozka[] = [
  {
    q: "V bývalém šlechtickém sídle s velkými okny, okrasnou zahradou a bez jakéhokoli opevnění je dnes umístěná obřadní síň pro svatby a sbírka historických kočárů, kterou si lidé mohou prohlédnout. O jaký typ stavby s jakým dnešním využitím jde?",
    key: "o zámek, který dnes slouží i jako muzejní expozice",
    d: [
      { value: "o hrad, který dnes slouží i jako muzejní expozice", why: "Popsaná stavba nemá opevnění, má velká okna a zahradu — to jsou znaky sídla stavěného pro pohodlí a reprezentaci, ne opevněného obranného sídla." },
      { value: "o zámek, který dnes slouží jen k bydlení šlechtické rodiny", why: "Sbírka kočárů přístupná návštěvníkům je muzejní expozice, ne běžné obydlí." },
      { value: "o hrad, který dnes slouží jen k bydlení šlechtické rodiny", why: "Popis odpovídá sídlu stavěnému pro pohodlí a reprezentaci (bez opevnění, s okrasnou zahradou), navíc jde o zpřístupněnou sbírku, ne o obydlí." },
    ],
    hints: [
      "Nejdřív rozhodni, jestli sídlo bez opevnění s okny a zahradou bylo stavěno k obraně, nebo k pohodlnému bydlení — a pak zvlášť posuď, k čemu slouží dnes: k bydlení, nebo je otevřené veřejnosti.",
      "V popisu jsou dva samostatné znaky: typ stavby (poznáš ho podle toho, jestli má opevnění, nebo okna a zahradu) a dnešní využití (poznáš ho podle toho, jestli tam někdo bydlí, nebo si to mohou prohlédnout návštěvníci) — obojí musíš určit zvlášť a pak spojit dohromady.",
    ],
    explanation: "Chybějící opevnění, velká okna a zahrada ukazují na zámek. Přístupná sbírka kočárů a obřadní síň pro veřejnost navíc ukazují, že dnes slouží jako muzejní expozice, ne k bydlení.",
  },
  {
    q: "Na skále nad řekou stojí stavba s dochovanými zdmi, padacím mostem a strážní věží. Dnes je v jejích sklepeních umístěná expozice historických zbraní a zbroje, přístupná návštěvníkům. O jaký typ stavby s jakým dnešním využitím jde?",
    key: "o hrad, který dnes slouží i jako muzejní expozice",
    d: [
      { value: "o zámek, který dnes slouží i jako muzejní expozice", why: "Zdi, padací most a strážní věž jsou obranné prvky typické pro opevněné sídlo, ne pro sídlo stavěné bez opevnění pro pohodlí." },
      { value: "o hrad, ve kterém dodnes bydlí šlechtická rodina", why: "Zbraně a zbroj vystavené návštěvníkům jsou muzejní expozice, ne známka toho, že tam někdo běžně bydlí." },
      { value: "o chrám s expozicí historických zbraní", why: "Popsaná stavba má zdi, příkop a padací most — to jsou znaky opevněného sídla, ne stavby určené k bohoslužbám." },
    ],
    hints: [
      "Nejdřív rozhodni, jestli stavba s padacím mostem, zdmi a věží byla stavěná k obraně, nebo k pohodlnému bydlení — a pak zvlášť posuď, k čemu slouží dnes: jako obydlí, nebo je zpřístupněná návštěvníkům.",
      "V popisu jsou dva samostatné znaky: typ stavby (poznáš ho podle obranných prvků jako zdi, příkop a věž) a dnešní využití (poznáš ho podle toho, že sklepení je zpřístupněno jako výstava) — obojí urči zvlášť a pak spoj dohromady.",
    ],
    explanation: "Zdi, padací most a strážní věž ukazují na hrad. Zpřístupněná sbírka zbraní a zbroje navíc ukazuje, že dnes slouží jako muzejní expozice.",
  },
  {
    q: "Ve smyšlené obci Lipová se před domem paní Kratochvílové propadl kus chodníku. O pár kilometrů dál, mimo tuhle obec, se propadla i důležitá silnice spojující tři sousední města. Kam se má paní Kratochvílová obrátit ohledně chodníku a kdo bude řešit propadlou silnici mezi třemi městy?",
    key: "s chodníkem na obecní úřad Lipové, silnici mezi třemi městy bude řešit kraj",
    d: [
      { value: "obě věci vyřídí stejný krajský úřad", why: "Chodník před jedním domem je věc místního dosahu, silnice spojující tři města přesahuje jednu obec — nejde o stejnou úroveň veřejné správy." },
      { value: "obě věci vyřídí obecní úřad Lipové", why: "Chodník ano, ale silnice mezi třemi městy přesahuje dosah jedné obce, tu řeší vyšší úroveň veřejné správy." },
      { value: "s chodníkem na kraj, silnici vyřeší obecní úřad Lipové", why: "Je to obráceně — místní chodník patří pod nejnižší úroveň veřejné správy, silnice mezi víc městy pod vyšší úroveň." },
    ],
    hints: [
      "U obou oprav se ptej stejně: kolika míst nebo obcí se ta věc vlastně týká?",
      "Věc, která se týká jen jednoho místa v jedné obci, řeší nejnižší úroveň veřejné správy. Věc, která přesahuje víc obcí najednou, řeší vyšší úroveň — na oba případy z příběhu proto může vyjít jiná odpověď, i když jde zdánlivě o podobnou opravu.",
    ],
    explanation: "Chodník u jednoho domu je věc jedné obce, řeší ho obecní úřad Lipové. Silnice spojující tři města přesahuje jednu obec, tu řeší kraj.",
  },
  {
    q: "Ve vymyšlené horské obci Javorná žije jen pár desítek lidí a nemá vlastní střední školu. Když se rodina rozhoduje, kam přihlásit patnáctileté dítě na střední školu, na koho by se měla ohledně sítě středních škol v okolí obrátit?",
    key: "na kraj, protože síť středních škol v okolí řeší vyšší úroveň veřejné správy",
    d: [
      { value: "na obecní úřad Javorné, protože ten vyřizuje běžnou agendu jednotlivých obyvatel obce", why: "Malá obec bez vlastní střední školy neřídí síť středních škol v okolí, to je záležitost širšího dosahu." },
      { value: "na volený sbor zastupitelů Javorné", why: "Ten rozhoduje o věcech vlastní obce, síť středních škol v regionu přesahuje jednu malou obec." },
      { value: "na žádný orgán, řeší si to rodina úplně sama", why: "Síť středních škol a jejich fungování zajišťuje veřejná správa na vyšší úrovni, ne jen rodina sama." },
    ],
    hints: [
      "Přemýšlej, jak daleko sahá dosah otázky, na kterou se rodina ptá — týká se jen Javorné, nebo škol v celém okolí?",
      "Otázka, která přesahuje jednu malou obec a týká se sítě škol v celém regionu, patří na vyšší úroveň veřejné správy — tu, do které patří víc obcí najednou.",
    ],
    explanation: "Síť středních škol přesahuje jednu malou obec, proto ji řeší kraj.",
  },
  {
    q: "Ve vymyšlené obci Dolní Lomná volený sbor obce odhlasoval výstavbu nové knihovny. O půl roku později přišla stížnost, že se stavba zpozdila kvůli nevyřízeným úředním povolením. Kde spíš nastal problém — v samotném rozhodnutí, nebo v jeho praktickém vyřízení?",
    key: "v praktickém vyřízení, tedy na straně obecního úřadu",
    d: [
      { value: "v samotném rozhodnutí, tedy na straně voleného sboru obce", why: "Volený sbor o stavbě už rozhodl, zpoždění se stalo až při vyřizování povolení — to má na starosti jiný orgán." },
      { value: "problém je na straně kraje", why: "Jde o knihovnu v jedné konkrétní obci, tu vyřizuje místní úřad, ne vyšší úroveň veřejné správy." },
      { value: "nikdo za to nemůže, úřední povolení vyřizuje vždy jen stát centrálně", why: "Běžná úřední povolení pro obecní stavby vyřizuje místní úřad, ne centrální stát." },
    ],
    hints: [
      "Rozliš dva různé kroky v příběhu: kdy padlo rozhodnutí o stavbě a kdy mělo dojít k praktickému vyřízení povolení — kde přesně nastalo zpoždění?",
      "Volený sbor o věci rozhoduje jen jednou, na začátku. Praktické vyřízení, jako je úřední povolení, pak dlouhodobě zajišťuje jiná složka veřejné správy — a právě tam podle příběhu vznikl problém.",
    ],
    explanation: "Zastupitelstvo o stavbě rozhodlo, zpoždění vzniklo až při vyřizování povolení — to má na starosti obecní úřad.",
  },
  {
    q: "Ve smyšlené obci Krásná Lhota se každý rok v září koná slavnost sklizně, kterou znají jen obyvatelé okolních vesnic. O mnoho měsíců později, 1. května, mají po celé republice volno školy i úřady. Čím se tyhle dvě události od sebe zásadně liší?",
    key: "slavnost sklizně je zvyk, 1. květen je zákonný svátek",
    d: [
      { value: "obojí je zvyk jen pro okolí Krásné Lhoty", why: "1. květen je stanovený zákonem pro celou republiku, to není zvyk jedné obce nebo regionu." },
      { value: "obojí platí zákonem pro celou republiku", why: "Slavnost sklizně znají jen obyvatelé okolí, to je typický znak místního zvyku, ne celostátně stanoveného dne." },
      { value: "obojí se řídí stejným zákonem pro celou zemi", why: "Jen 1. květen je daný zákonem pro celou zemi. Slavnost sklizně je dobrovolný místní zvyk, který zákon neupravuje." },
    ],
    hints: [
      "U obou událostí se ptej stejně: kdo je zná a kdo podle nich má volno — jen okolí jedné obce, nebo celá republika?",
      "Něco, co znají jen obyvatelé jednoho místa, je jiné než den, který je daný zákonem a platí stejně úplně všude — i když se obě události slaví jednou za rok.",
    ],
    explanation: "Slavnost sklizně zná jen okolí Krásné Lhoty — je to místní zvyk. 1. květen platí zákonem stejně pro celou republiku — je to státní svátek.",
  },
  {
    q: "Kamenná stavba s vysokou věží a barevnými okny sloužila odedávna k bohoslužbám. Dnes jsou navíc v její kryptě k vidění staré náhrobky významných měšťanů, přístupné návštěvníkům. O jaký typ stavby s jakým dnešním využitím jde?",
    key: "o chrám, který dnes navíc slouží jako přístupná historická expozice",
    d: [
      { value: "o hrad s expozicí náhrobků", why: "Popsaná stavba má věž a barevná okna a sloužila k bohoslužbám — to jsou znaky sakrální stavby, ne opevněného obranného sídla." },
      { value: "o zámek s expozicí náhrobků", why: "Sídlo pro pohodlné bydlení šlechty neslouží k bohoslužbám. Popsaná stavba je určená právě k nim." },
      { value: "o chrám, který dnes slouží jen jako obytný dům", why: "Přístupná expozice náhrobků pro návštěvníky není totéž jako obydlí — stavba dál slouží svému původnímu účelu a navíc je zpřístupněná veřejnosti." },
    ],
    hints: [
      "Nejdřív rozhodni, k čemu stavba s věží a barevnými okny odedávna sloužila, a pak zvlášť posuď, co se v ní navíc dá dnes vidět.",
      "V popisu jsou dva znaky: původní účel stavby (bohoslužby) a to, co se v ní dá dnes navíc vidět (přístupná historická sbírka) — obě informace patří k sobě, stavba slouží svému původnímu účelu i nadále a k tomu má i zpřístupněnou expozici.",
    ],
    explanation: "Věž a barevná okna ukazují na chrám. Přístupné náhrobky navíc ukazují, že dnes navíc slouží jako historická expozice.",
  },
  {
    q: "Ve vymyšlené obci Petrovice se rozbilo veřejné osvětlení jen v jedné ulici. Někteří obyvatelé tvrdí, že by to měl vyřešit kraj, protože jde přece o veřejnou věc. Mají pravdu?",
    key: "ne, osvětlení jedné ulice je věc místního dosahu, kterou řeší obec",
    d: [
      { value: "ano, protože všechny veřejné věci vždy řeší kraj", why: "Vyšší úroveň veřejné správy řeší jen věci širšího, nadobecního dosahu. Osvětlení jedné ulice je čistě místní záležitost." },
      { value: "ano, protože oprava stojí hodně peněz", why: "Cena opravy neurčuje, kdo o věci rozhoduje — rozhoduje dosah věci, a jedna ulice je věc místního rozsahu." },
      { value: "je to jedno, obě úrovně veřejné správy mají úplně stejné pravomoci", why: "Nemají stejné pravomoci — nižší úroveň řeší místní věci, vyšší úroveň věci širšího dosahu, jako jsou silnice mezi víc obcemi." },
    ],
    hints: [
      "Přemýšlej, jak daleko sahá dopad rozbitého osvětlení — týká se to jen jedné ulice v jedné obci, nebo víc obcí najednou?",
      "Věc, která se týká jen jednoho místa v jedné obci, patří na nejnižší úroveň veřejné správy, ne na vyšší úroveň, která řeší jen věci přesahující víc obcí — obyvatelé se tedy mýlí.",
    ],
    explanation: "Osvětlení jedné ulice je věc místního dosahu — obyvatelé nemají pravdu, řeší to obec, ne kraj.",
  },
  {
    q: "Firma ve vymyšlené obci Dubinka se ptá, jestli má v pátek zavřít kvůli „svátku“, o kterém mluví starousedlíci — jde ale jen o výroční trh, který se koná už sto let jen v Dubince. Musí firma podle zákona zavřít?",
    key: "ne, jde o místní zvyk, ne o den daný zákonem pro celou zemi",
    d: [
      { value: "ano, protože stoletá tradice má stejnou právní váhu jako zákon", why: "Délka trvání zvyku neznamená, že jde o den daný zákonem. Zákonné volno platí jen tam, kde to zákon výslovně stanoví pro celou zemi." },
      { value: "ano, protože každou obecní slavnost provází povinné zavírací volno", why: "Místní slavnosti nezakládají zákonnou povinnost zavřít, to platí jen u dnů stanovených zákonem pro celou republiku." },
      { value: "je to nejasné, závisí to na počasí v den trhu", why: "Povinnost zavřít se řídí tím, jestli jde o den daný zákonem pro celou zemi, ne počasím." },
    ],
    hints: [
      "Přemýšlej, jestli výroční trh, byť stoletý, zná a dodržuje celá republika, nebo jen jedna obec.",
      "Ani dlouhá historie zvyku z něj nedělá den daný zákonem — zákonná povinnost platí jen u dnů, které zákon výslovně stanoví pro celou zemi, ne u zvyků, které si udržuje jen jedno místo.",
    ],
    explanation: "Stoletý výroční trh je místní zvyk jedné obce, ne den daný zákonem — firma zavřít nemusí.",
  },
  {
    q: "Ve vymyšlené obci Zelený Důl chtějí obyvatelé nové dětské hřiště jen pro svou obec. Kdo o tom nejdřív rozhodne a kdo pak zajistí potřebná povolení?",
    key: "nejdřív volený sbor obce, povolení pak vyřídí obecní úřad",
    d: [
      { value: "nejdřív obecní úřad, povolení pak vyřídí volený sbor obce", why: "Je to obráceně — o věci nejdřív rozhoduje volený sbor zastupitelů, praktické vyřízení má na starosti úřad." },
      { value: "nejdřív krajské zastupitelstvo, povolení pak vyřídí obecní úřad", why: "Hřiště jen pro jednu obec je záležitost té obce, ne vyšší úrovně veřejné správy." },
      { value: "obě věci vyřídí jen osoba, která obec vede, úplně sama", why: "Rozhoduje volený sbor a vyřizuje úřad, ne jeden člověk sám." },
    ],
    hints: [
      "Rozliš dva různé kroky: kdo v obci nejdřív hlasuje o tom, jestli hřiště postavit, a kdo pak celou věc prakticky zařídí.",
      "Vždy nejdřív rozhoduje volený sbor lidí zvolených ve volbách, a teprve po jeho rozhodnutí věc prakticky vyřizují úředníci — v tomhle pořadí to funguje i u hřiště jen pro jednu obec.",
    ],
    explanation: "Nejdřív o hřišti rozhodne volený sbor obce (zastupitelstvo), povolení pak vyřídí obecní úřad.",
  },
  {
    q: "Ve vymyšlené obci Horní Bříza stojí starý dům s věžičkami a velkou zahradou, bez jakéhokoli opevnění — dům nemá žádné zdi k obraně. Dnes jsou uvnitř k vidění staré obrazy a nábytek šlechtické rodiny, přístupné návštěvníkům o víkendech. O jaký typ stavby s jakým dnešním využitím jde?",
    key: "o zámek, který dnes slouží jako přístupná muzejní expozice",
    d: [
      { value: "o hrad, který dnes slouží jako přístupná muzejní expozice", why: "Popsaná stavba nemá žádné opevnění — věžičky jsou tu jen ozdobou, chybí zdi k obraně i příkop, které by ukazovaly na opevněné obranné sídlo." },
      { value: "o zámek, ve kterém dodnes bydlí šlechtická rodina", why: "Obrazy a nábytek přístupné návštěvníkům o víkendech jsou muzejní expozice, ne známka toho, že tam někdo běžně bydlí." },
      { value: "o chrám s expozicí obrazů a nábytku", why: "Popsaná stavba je obytné sídlo s zahradou, ne stavba určená k bohoslužbám." },
    ],
    hints: [
      "Nejdřív rozhodni, jestli dům s věžičkami a zahradou, ale bez zdí a příkopu, byl stavěný k obraně, nebo k pohodlnému bydlení — a pak zvlášť posuď, k čemu slouží dnes: k bydlení, nebo je otevřený návštěvníkům.",
      "V popisu jsou dva samostatné znaky: typ stavby (poznáš ho podle toho, že chybí opevnění a jsou tam věžičky a zahrada jen pro ozdobu a pohodlí) a dnešní využití (poznáš ho podle toho, že obrazy a nábytek jsou přístupné návštěvníkům, ne že tam někdo bydlí) — obojí musíš určit zvlášť a pak spojit dohromady.",
    ],
    explanation: "Chybějící opevnění a věžičky jen jako ozdoba ukazují na zámek. Obrazy a nábytek přístupné návštěvníkům o víkendech navíc ukazují, že dnes slouží jako muzejní expozice, ne k bydlení.",
  },
  {
    q: "Ve vymyšleném regionu sousední obce Lesná a Podhájí každý rok o Velikonocích společně pečou tradiční mazance podle receptu po babičkách — jinde v republice to takhle nikdo nedělá. Později téhož jara mají všichni v republice volno kvůli svátku práce. V čem se tyhle dvě události zásadně liší?",
    key: "pečení mazanců je zvyk, svátek práce je zákonný svátek",
    d: [
      { value: "žádný rozdíl mezi nimi není, jde o totéž", why: "Pečení mazanců zná jen okolí dvou obcí, svátek práce platí zákonem pro celou republiku — to je zásadní rozdíl." },
      { value: "obojí je jen místní zvyk dvou obcí", why: "Svátek práce je daný zákonem pro celou zemi, ne jen pro Lesnou a Podhájí." },
      { value: "obojí je den daný zákonem se stejným volnem pro celou zemi", why: "Jen svátek práce je daný zákonem s volnem pro celou zemi, pečení mazanců je dobrovolný zvyk jen dvou obcí." },
    ],
    hints: [
      "U obou událostí se ptej stejně: kdo je zná a dodržuje — jen dvě konkrétní obce, nebo celá republika podle zákona?",
      "Zvyk, který dodržují jen dvě sousední obce a jinde v zemi ho vůbec neznají, se od dne, který platí zákonem se stejným volnem pro celou republiku, zásadně liší — i když obě události připadají na jaro.",
    ],
    explanation: "Pečení mazanců je zvyk jen dvou sousedních obcí, svátek práce je daný zákonem pro celou republiku.",
  },
];

// ── Generátor ────────────────────────────────────────────────────────────
function uloha(p: Polozka): PracticeTask | null {
  return choice(p.q, p.key, p.d, { hints: p.hints, explanation: p.explanation });
}

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  // Rotace poolem se nastaví tady, ne na úrovni modulu — gen() nemá stav
  // mezi voláními, dvě volání se stejným seedem dají stejné úlohy.
  let i = 0;
  return ruzneUlohy(() => losUlohy(() => uloha(pool[i++ % pool.length])));
}

// ── Topic ────────────────────────────────────────────────────────────────
export const NASE_OBEC_A_REGION_TRADICE_KULTURA_PAMATKY: TopicMetadata[] = [
  {
    id: "g6-vko-nase-obec-a-region-tradice-kultura-pamatky-6",
    rvpNodeId: "g6-vko-clovek-ve-spolecnosti-nase-obec-region-vlast-nase-obec-a-region-tradice-kultura-pamatky",
    displayName: "Obec, kraj a místní památky",
    title: "Naše obec a region — tradice, kultura, památky",
    studentTitle: "Obec, kraj a místní památky",
    subject: "vko",
    category: "Člověk ve společnosti",
    topic: "Naše obec, region, vlast",
    briefDescription: "Rozlišíš role v obecní samosprávě, typy památek a místní tradice od státních svátků.",
    keywords: [
      "obec", "kraj", "starosta", "zastupitelstvo obce", "obecní úřad",
      "hrad", "zámek", "chrám", "památka", "místní tradice", "státní svátek", "samospráva",
    ],
    goals: [
      "Rozlišit role v obecní samosprávě: obec, obecní/městský úřad, starosta, zastupitelstvo obce.",
      "Zařadit konkrétní záležitost pod obec, nebo pod kraj, podle jejího dosahu.",
      "Rozpoznat typ památky (hrad, zámek, chrám) podle popisu stavby, ne podle pohádkové představy.",
      "Rozlišit místní/regionální tradici od státního svátku daného zákonem.",
    ],
    boundaries: [
      "Role a funkce veřejné správy, ne jmenované současné osoby ve funkci.",
      "Typ památky se určuje podle účelu a znaků stavby (opevnění × pohodlí × bohoslužby), ne podle konkrétního jména nebo ceny vstupného.",
      "Tradice a svátky se popisují jako kulturní zvyk nebo zákonem daný den, ne jako náboženská pravda.",
      "Nezahrnuje státní symboly (vlajka, znak, hymna) ani konkrétní letopočty vzniku obcí — to je jiné téma.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Obec řeší místní věci, kraj věci širšího dosahu. Zastupitelstvo rozhoduje a volí starostu, úřad rozhodnutí vyřizuje. Hrad byl stavěný k obraně (zdi, příkop, věže), zámek k pohodlnému bydlení (okna, zahrada, bez opevnění), chrám k bohoslužbám. Místní tradice zná jen část republiky, státní svátek platí zákonem pro celou zemi.",
      steps: [
        "U samosprávy se ptej, jak daleko sahá dosah věci — jen jedna obec, nebo víc obcí (kraj)?",
        "U zastupitelstva a úřadu se ptej, jestli jde o rozhodnutí (zastupitelstvo), nebo o jeho praktické vyřízení (úřad).",
        "U památky se ptej na účel stavby podle popsaných znaků — obrana, pohodlné bydlení, nebo bohoslužby?",
        "U svátku a tradice se ptej, jestli to zná a dodržuje celá republika podle zákona, nebo jen jedno místo podle zvyku.",
      ],
      commonMistake: "Myslet si, že velké město je totéž co kraj, že úřad rozhoduje místo zastupitelstva, že stará budova s věžemi je vždy hrad, nebo že místní slavnost je totéž co státní svátek.",
      example: "Chodník u domu řeší obec, silnici mezi třemi městy kraj. Stavba se zdmi a příkopem je hrad, stavba s okny a zahradou bez opevnění je zámek. Obecní pouť je místní tradice, 28. říjen je státní svátek.",
    },
  },
];
