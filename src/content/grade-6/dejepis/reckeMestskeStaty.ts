/**
 * Dějepis 6. ročník — Řecké městské státy: Athény (demokracie) a Sparta (categorize).
 *
 * Jádrem tématu je SROVNÁNÍ dvou polis, proto žák třídí karty do přihrádek.
 *  • L1 (zapamatování): 2 přihrádky, krátké pojmy a znaky (lidové shromáždění, heilóti…).
 *  • L2 (použití):      2 přihrádky, popisy situací BEZ klíčového pojmu — žák situaci
 *                       převede na znak (výchova, ostrakismos) a ten přiřadí.
 *  • L3 (analýza):      3 přihrádky (jen Athény / jen Sparta / oba státy), výroky dobových
 *                       lidí. Boří miskoncepce „demokracie = vláda všech" a
 *                       „Sparta = válka, Athény = kultura".
 *
 * Úlohy vznikají DETERMINISTICKOU rotací banky (bez Math.random): každá úloha
 * je daná počátečními indexy v jednotlivých bankách, duplicitní sady se přeskočí.
 * Nápovědy stojí na „vodítku" karty — otázce, kterou si žák u karty položí.
 * Vodítko nejmenuje kartu ani stát, jen rozlišovací znak (kdo rozhodoval,
 * komu patřila půda…), takže učí metodu a neprozrazuje zařazení.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildCategorizeTask as cat } from "./_shared";

const ATH = "Athény";
const SPA = "Sparta";
const JEN_ATH = "Jen Athény";
const JEN_SPA = "Jen Sparta";
const OBA = "Oba státy";

/** [text karty, proč patří do přihrádky, vodítko pro nápovědu (otázka bez státu)] */
type Karta = [string, string, string];

// ── L1: pojmy a znaky ───────────────────────────────────────────────────────
const L1_ATH: Karta[] = [
  ["Lidové shromáždění, kde každý občan mohl navrhnout zákon", "zákon tu mohl navrhnout a o něm mluvit kterýkoli občan, to je jádro athénské demokracie; spartské shromáždění jen přijímalo nebo odmítalo návrhy rady starších", "Kde mohl návrh zákona podat kterýkoli občan, a ne jen rada starců?"],
  ["Střepinové hlasování (ostrakismos)", "občané psali na střepy jméno politika, kterého chtěli poslat z města, a chránili tak demokracii před tyranem", "K čemu může sloužit hlasování, při kterém lidé píšou jméno na kousek hliněné nádoby?"],
  ["Akropolis s Parthenónem", "chrámy na skále nad Athénami, chlouba města", "Který z obou států se proslavil mramorovými chrámy a stavbami?"],
  ["Politik Periklés", "nejslavnější athénský politik, za něj demokracie i stavby Akropole vzkvétaly", "Působil ten politik ve státě, kde lid přesvědčoval řečí, nebo tam, kde vládli králové?"],
  ["Silné válečné loďstvo", "Athény ležely u moře a měly nejsilnější řeckou flotilu; válečnictví nepatřilo jen Spartě", "Který stát ležel blízko moře a žil z námořní síly?"],
  ["Divadlo s tragédiemi a komediemi", "divadelní hry vznikaly a hrály se hlavně v Athénách", "Kde měli lidé čas a chuť na umění a kde se vše podřizovalo výcviku?"],
  ["Filozof Sókratés", "athénský myslitel, který se s občany přel na náměstí", "Kde se lidé veřejně přeli o spravedlnosti a o tom, jak žít?"],
  ["Kleisthenovy reformy", "Kleisthenés kolem roku 508 př. n. l. položil základy athénské demokracie", "Změny, kterými moc přešla na lid, patří ke vzniku demokracie. Kde demokracie vznikla?"],
  ["Zákonodárce Solón", "Solón zrušil v Athénách otroctví za dluhy a upravil zákony", "Kde reformátor zrušil otroctví za dluhy a připravil cestu vládě lidu?"],
  ["Přístav Pireus a námořní obchod", "athénský přístav, kudy proudilo obilí i zboží", "Který stát bohatl z obchodu a který obchod přenechával jiným?"],
  ["Úředníci vybíraní losem", "athénští občané losovali mnoho úředníků, aby měl každý šanci", "Kde měl každý občan šanci stát se úředníkem, i když nebyl bohatý ani urozený?"],
  ["Kraj Attika", "Athény byly hlavním městem kraje Attika", "Které z obou měst leželo mimo Peloponés, blízko moře na východě Řecka?"],
];
const L1_SPA: Karta[] = [
  ["Dva králové zároveň", "Sparta měla současně dva krále, Athény krále neměly", "Kolik vládců stálo v čele státu? Měl vůbec každý stát krále?"],
  ["Rada starších (gerúsie)", "spartská rada starých mužů připravovala zákony", "Kde měli hlavní slovo zkušení starci, a ne celý lid?"],
  ["Eforové, kteří dohlíželi i na krále", "spartští úředníci volení každý rok, kontrolovali krále i výchovu", "Který stát potřeboval úředníky, kteří hlídají krále?"],
  ["Heilóti obdělávající půdu", "nesvobodní lidé patřící spartskému státu; nejsou to athénští otroci", "Komu patřili nesvobodní lidé na polích: soukromému pánovi, nebo celému státu?"],
  ["Vojenská výchova chlapců od sedmi let", "spartské chlapce odebírali rodičům a cvičili z nich vojáky", "Kde se malý chlapec vychovával doma a kde ho převzal stát?"],
  ["Poloostrov Peloponés", "Sparta ležela na Peloponésu, Athény mimo něj v kraji Attika", "Kraj Attika leží mimo Peloponés, na východě pevniny. Které z obou měst leželo na velkém poloostrově na jihu?"],
  ["Lakonické, stručné odpovědi", "Sparťané z kraje Lakónie mluvili krátce, podle nich se stručné řeči říká lakonická", "Kde si lidé cenili dlouhé řeči a kde mluvili co nejméně?"],
  ["Král Leónidás u Thermopyl", "spartský král, který roku 480 př. n. l. padl se svými vojáky v průsmyku Thermopyly; Athény krále neměly", "Ze kterého státu mohl pocházet král, když jeden ze dvou států krále vůbec neměl?"],
  ["Těžké železné peníze", "Sparťané místo zlatých a stříbrných mincí používali železo, aby nebohatli", "Který stát odmítal bohatství a přepych a který z obchodu bohatl?"],
  ["Společné stravování vojáků", "spartští muži jedli se svými spolubojovníky, ne doma", "Kde muž trávil život hlavně ve vojsku, a ne doma s rodinou?"],
  ["Perioikové, řemeslníci bez politických práv", "svobodní obyvatelé okolí Sparty, kteří obchodovali, ale nerozhodovali", "Kdo v tom státě dělal řemesla a obchod, když občané jen cvičili?"],
  ["Dívky závodily v běhu a zápase", "ve Spartě cvičily i dívky, aby byly silnými matkami vojáků", "Kde se i dívky připravovaly tělesně a kde zůstávaly hlavně doma?"],
];

// ── L2: situace bez klíčového pojmu ──────────────────────────────────────────
const L2_ATH: Karta[] = [
  ["Občan napsal na střep jméno politika, kterého chtěl poslat pryč z města.", "to je ostrakismos, athénská pojistka proti tyranovi", "Jak se jmenuje hlasování, při kterém se politik posílá pryč a kde se konalo?"],
  ["Každý občan mohl na shromáždění vystoupit a navrhnout nový zákon.", "právo každého občana mluvit a navrhovat patří k athénské demokracii", "Kde měl obyčejný občan právo mluvit a navrhovat a kde jen souhlasil s návrhy starců?"],
  ["Veslaři z chudých rodin vyrazili na válečných lodích proti nepříteli.", "chudí občané veslovali na athénských lodích, proto měli i silný hlas ve shromáždění", "Který stát měl velkou flotilu, na které veslovali chudí občané?"],
  ["Diváci celý den sledovali v hledišti tragédie a komedie.", "divadelní slavnosti patřily k Athénám", "Kde se pořádaly slavnosti s divadelními hrami?"],
  ["Muž se na tržišti přel s filozofem o tom, co je spravedlnost.", "veřejné debaty filozofů jsou typické pro Athény", "Kde se na náměstí svobodně debatovalo o otázkách života?"],
  ["Úředníka na příští rok nevybrali volbou, ale losem.", "losování úředníků bylo athénským způsobem, jak dát šanci každému občanu", "Proč by stát vybíral úředníky náhodně a který stát to dělal?"],
  ["Na skalním pahorku nad městem vyrostl mramorový chrám se sloupy.", "je to Akropolis s Parthenónem v Athénách", "Která slavná stavba stojí na skále nad městem a ve kterém městě?"],
  ["Do přístavu připluly lodě s obilím a odvezly olivový olej a keramiku.", "Athény žily z námořního obchodu přes svůj přístav", "Který stát se spoléhal na obchod po moři?"],
  ["Soudci nebyli stálí úředníci, ale stovky vylosovaných občanů.", "velké soudy z vylosovaných občanů byly součástí athénské demokracie", "Kde se na soudu podílelo velké množství obyčejných občanů?"],
  ["Chlapec chodil k učiteli, kde se učil číst, psát a hrát na lyru.", "athénští chlapci se učili u učitelů psaní a hudbě, domů se vraceli", "Kde se výchova zaměřovala na vzdělání, a ne jen na vojenský výcvik?"],
  ["Politik přesvědčoval lid dlouhou a krásnou řečí, aby schválil stavbu chrámů.", "za Perikla Athéňané stavěli chrámy a řečníci přesvědčovali shromáždění", "Kde bylo umění dlouhé řeči potřeba, protože rozhodoval lid?"],
  ["Za službu soudce u lidového soudu dostávali chudí občané malou odměnu, aby si ji mohli dovolit.", "Periklés zavedl plat porotcům, aby mohli soudit i chudí athénští občané", "Proč by stát platil občanům za to, že soudí, a kde u soudu sedělo mnoho obyčejných lidí?"],
];
const L2_SPA: Karta[] = [
  ["Chlapce odvedli od rodičů do skupin, kde se učili snášet hlad a zimu.", "to je spartská vojenská výchova od sedmi let", "Který stát si bral chlapce od rodičů a vychovával z nich vojáky?"],
  ["Půdu obdělávali nesvobodní lidé patřící celému státu, kteří se často bouřili.", "to jsou heilóti, státní nevolníci Sparty; athénský otrok patřil soukromému pánovi", "Komu nesvobodní lidé patřili a jak se ve kterém státě jmenovali?"],
  ["V čele státu stáli zároveň dva vládci, každý z jiného rodu.", "Sparta měla dva krále zároveň; Athény krále neměly už dávno před vznikem demokracie, vládli jim úředníci (archonti)", "Který stát měl v čele dva vládce najednou?"],
  ["O návrzích nejdřív jednali staří muži, kteří byli ve svém úřadu doživotně.", "to je spartská rada starších, gerúsie", "Kde měla hlavní slovo rada starců, která úřad nikdy neopouštěla?"],
  ["Úředníci volení na rok kontrolovali, zda i králové dodržují zákony.", "to jsou spartští eforové; v Athénách krále neměli, takže je nebylo koho hlídat", "Ve kterém státě vůbec byl král, na kterého se dalo dohlížet?"],
  ["Na dlouhou otázku cizího posla odpověděli jediným slovem.", "stručná, lakonická řeč byla typická pro Sparťany", "Kde se mluvilo co nejstručněji?"],
  ["Novorozeně prohlédli starší muži, zda je dost silné.", "podle řeckých autorů ve Spartě o dítěti rozhodovali starší muži, stát chtěl silné vojáky", "Kde rozhodoval o dítěti stát, a ne rodina?"],
  ["Dospělý muž jedl každý den se svými spolubojovníky u společného stolu.", "spartští muži jedli ve společných vojenských skupinách", "Kde muž patřil hlavně vojsku, a ne vlastní domácnosti?"],
  ["Obchod a řemesla přenechali svobodným obyvatelům okolních vesnic bez politických práv.", "to jsou perioikové kolem Sparty; občané se věnovali jen vojsku", "Proč by občané obchod přenechali jiným a v kterém státě to tak bylo?"],
  ["Dívky běhaly a zápasily, aby z nich byly silné matky vojáků.", "tělesný výcvik dívek byl typický pro Spartu; athénské dívky zůstávaly doma", "Kde se i dívky tělesně cvičily kvůli budoucím vojákům?"],
  ["Chlapec ukradl jídlo, nechal se chytit a dostal výprask za neobratnost, ne za krádež.", "spartští chlapci měli být mazaní a otužilí, trestala se neobratnost", "Kde výchova chlapce záměrně nechávala hladovět a učila ho obratnosti?"],
  ["Občané nesměli používat zlaté a stříbrné mince, platili železnými pruty.", "Sparťané používali železné peníze, aby nebohatli a nezměkli; Athény razily stříbrné mince", "Který stát se bránil bohatství a přepychu?"],
];

// ── L3: výroky dobových lidí ─────────────────────────────────────────────────
const L3_ATH: Karta[] = [
  ["Každý občan smí na shromáždění navrhnout zákon a mluvit k lidu.", "v Athénách mohl návrh podat a promluvit kterýkoli občan; ve Spartě shromáždění o návrzích jen hlasovalo, připravovala je rada starších a eforové", "Kdo mohl na shromáždění podávat návrhy: kterýkoli občan, nebo jen rada a úředníci?"],
  ["Nebezpečného politika můžeme na deset let vyhnat hlasováním.", "to je athénský ostrakismos; ve Spartě nad králi a úředníky dohlíželi eforové, střepinové hlasování tam nebylo", "Jaký způsob ochrany před tyranem vymysleli lidé, kteří si vládli sami?"],
  ["Naše síla je na moři, chráníme přístav a obchodní lodě.", "Athény měly nejsilnější loďstvo; Sparta spoléhala hlavně na pozemní vojsko těžkooděnců", "Síla na moři, nebo na souši? Který stát ležel přímo u moře s velkým přístavem?"],
  ["Každý rok losujeme nové úředníky.", "losování úředníků patří k athénské demokracii; ve Spartě efory volili a starce do rady vybírali doživotně", "Kde se úřady rozdělovaly náhodou, aby měl šanci každý občan?"],
  ["Na slavnostech bohů soutěží básníci se svými tragédiemi.", "divadelní soutěže tragédií se konaly v Athénách; slavnosti bohů měla i Sparta, ale divadelní hry tam nevzkvétaly", "Slavnosti bohů měli všichni Řekové, ale kde se k nim přidaly divadelní hry?"],
  ["Kdo chce vést město, musí lid přesvědčit dlouhou řečí.", "v Athénách rozhodovalo shromáždění, proto byli důležití řečníci; Sparťané si cenili stručné, lakonické řeči", "Kde bylo potřeba přesvědčovat lid a kde se mluvilo stručně?"],
  ["Chudý veslař má na shromáždění stejný hlas jako boháč.", "v athénské demokracii měl každý občan jeden hlas, i chudý veslař z loďstva; Sparta takové loďstvo chudých veslařů neměla a občan, který nezaplatil příspěvek na společné stravování, přišel o občanská práva", "Kde měl chudý občan stejné slovo jako bohatý?"],
  ["Syna posílám k učiteli psaní a hudby, domů se vrací každý večer.", "athénský chlapec se vzdělával u učitelů a žil doma; spartského chlapce od sedmi let převzal stát k vojenskému výcviku", "Kde chlapec zůstával u rodiny a kde ho převzal stát?"],
];
const L3_SPA: Karta[] = [
  ["Zeď kolem města nepotřebujeme, zdí jsou naši vojáci.", "Sparta dlouho neměla hradby, spoléhala na vycvičené vojáky; Athény se chránily hradbami a Dlouhými zdmi až k přístavu", "Který stát věřil víc svým vojákům než kamenným hradbám?"],
  ["Máme dva krále najednou, každého z jiného rodu.", "dva králové současně byli jen ve Spartě; Athény krále neměly už dávno před vznikem demokracie, vládli jim úředníci (archonti)", "Měl některý stát krále? A kolik?"],
  ["Když syn dovrší sedm let, odevzdám ho státu k výcviku.", "spartská výchova začínala v sedmi letech; athénský chlapec zůstával doma a chodil k učitelům", "Kde se o výchovu chlapce postaral stát místo rodiny?"],
  ["Nevolníků, kteří patří státu, je víc než nás, proto jsme stále ve zbrani.", "heilóti patřili spartskému státu a Sparťané se báli jejich vzpour; athénští otroci patřili soukromým pánům", "Komu nevolníci patřili a který stát se jejich vzpour bál?"],
  ["Zbytečná slova neříkáme, stačí krátké ano nebo ne.", "lakonická stručnost byla spartská; v Athénách rozhodovalo shromáždění, a proto si cenili dlouhé řeči", "Kde si lidé cenili stručnosti víc než řečnictví?"],
  ["Zlato a stříbro nepotřebujeme, platíme těžkým železem.", "Sparťané používali železné peníze, aby nebohatli; Athény razily stříbrné mince a z obchodu bohatly", "Který stát odmítal bohatství, aby občané nezměkli?"],
  ["Matka podává synovi štít: vrať se s ním, nebo na něm.", "známé rčení spartských matek, návrat bez štítu byl hanbou; ve Spartě se celá rodina podřizovala vojsku, v Athénách patřila k životu vedle války i politika a umění", "Kde matky vychovávaly syny k tomu, aby z boje neutíkali?"],
  ["Moje dcera závodí v běhu stejně jako chlapci.", "tělesný výcvik dívek byl typický pro Spartu; athénské dívky zůstávaly doma a učily se hospodařit", "Kde se tělesně cvičily i dívky?"],
  ["Starci v radě jsou vybráni na celý život.", "členové spartské rady starších zůstávali v úřadu doživotně; v Athénách se úředníci střídali každý rok", "Kde vedla stát rada starců s doživotním úřadem?"],
];
const L3_OBA: Karta[] = [
  ["Ženy ani nesvobodní lidé o zákonech nehlasují.", "ani athénská demokracie nedávala hlas ženám a otrokům, hlasovali jen svobodní dospělí muži-občané; ve Spartě nehlasovaly ženy ani heilóti", "Byla demokracie opravdu vládou všech obyvatel? Kdo směl hlasovat?"],
  ["Mluvíme řecky a uctíváme Dia.", "řečtina a olympští bohové byli společní všem Řekům", "Jakým jazykem se mluvilo v jednotlivých řeckých městech a koho tam uctívali?"],
  ["Závodníci z našeho města jezdí na olympijské hry.", "olympijských her se účastnila všechna řecká města, nejen jedno", "Zjisti, odkud přijížděli závodníci na olympijské hry. Bylo to jedno město, nebo víc?"],
  ["V našem státě pracují nesvobodní lidé bez politických práv.", "nesvobodní lidé bez politických práv žili v obou státech: v Athénách soukromí otroci, ve Spartě heilóti patřící státu", "Kdo pracoval pro občany v demokracii a kdo ve vojenském státě? Byli to svobodní lidé?"],
  ["Proti perskému vojsku jsme bojovali se spojenci z jiných řeckých měst.", "proti Peršanům bojovaly Athény i Sparta, byli společným nepřítelem", "Která řecká města se postavila perskému vojsku?"],
  ["Naše město je samostatný stát s vlastními zákony.", "každá řecká polis, Athény i Sparta, byla samostatným městským státem", "Jak bylo v Řecku uspořádáno město s vlastní vládou a zákony? Kolik takových měst bylo?"],
  ["Cizinec, který u nás žije, nesmí hlasovat.", "cizinci (v Athénách metoikové) neměli hlas v žádném z obou států", "Kdo směl hlasovat v demokracii a kdo ve vojenském státě? Patřili mezi ně cizinci?"],
  ["Dobrý občan musí umět bránit město se zbraní v ruce.", "i Athéňané sloužili jako těžkooděnci nebo veslaři, obrana nebyla jen spartskou věcí", "Jak se do války zapojovali občané demokracie? A jak občané vojenského státu?"],
  ["Před důležitým rozhodnutím se ptáme věštírny v Delfách.", "delfskou věštírnu navštěvovali lidé ze všech řeckých měst", "Odkud přicházeli lidé pro radu do věštírny v Delfách?"],
];

const ZADANI: Record<number, string> = {
  1: "Roztřiď pojmy podle toho, ke kterému městskému státu patří.",
  2: "Přečti, co se stalo, a urči, ve kterém státě se to mohlo stát.",
  3: "Posuď, pro který stát výrok platí. Pozor, některé platí pro oba.",
};

const PRAVIDLO: Record<number, string> = {
  1: "Rozhoduj podle znaku: vláda lidu, moře, obchod a umění ukazují na jedno město, králové, rada starců a vojenský výcvik na druhé.",
  2: "Nejdřív z popisu urči znak (výchova, vláda, nesvobodní lidé, obchod) a teprve pak rozhodni, kterému státu ten znak patří.",
  3: "Postupuj ve dvou krocích: výrok → znak → stát. Ptej se také, jestli znak nebyl společný všem Řekům; demokracie nedávala hlas všem obyvatelům.",
};

/** Kolik karet z každé banky jde do jedné úlohy. */
const SKLADBA: Record<number, { name: string; banka: Karta[]; kolik: number }[]> = {
  1: [{ name: ATH, banka: L1_ATH, kolik: 3 }, { name: SPA, banka: L1_SPA, kolik: 3 }],
  2: [{ name: ATH, banka: L2_ATH, kolik: 3 }, { name: SPA, banka: L2_SPA, kolik: 3 }],
  3: [
    { name: JEN_ATH, banka: L3_ATH, kolik: 2 },
    { name: JEN_SPA, banka: L3_SPA, kolik: 2 },
    { name: OBA, banka: L3_OBA, kolik: 2 },
  ],
};

/** Deterministický výběr `kolik` různých karet z banky: start + krok. */
function vyber(banka: Karta[], start: number, krok: number, kolik: number): Karta[] {
  const n = banka.length;
  const out: Karta[] = [];
  const pouzite = new Set<number>();
  let idx = ((start % n) + n) % n;
  while (out.length < kolik) {
    while (pouzite.has(idx)) idx = (idx + 1) % n;
    pouzite.add(idx);
    out.push(banka[idx]);
    idx = (idx + krok) % n;
  }
  return out;
}

function uloha(level: number, i: number): PracticeTask {
  const skladba = SKLADBA[level];
  const vybrane = skladba.map((s, k) => ({
    name: s.name,
    karty: vyber(s.banka, i * (k * 2 + 1) + k * 3, 1 + ((i + k) % 3), s.kolik),
  }));
  // Vodítka se střídají mezi přihrádkami, aby pořadí v nápovědě nic neprozradilo.
  const prvni = vybrane.map((v) => v.karty[0][2]);
  const druhe = vybrane.map((v) => v.karty[1][2]);
  if (i % 2 === 1) { prvni.reverse(); druhe.reverse(); }
  return cat(
    ZADANI[level],
    vybrane.map((v) => ({ name: v.name, items: v.karty.map(([t]) => t) })),
    {
      hints: [
        `Začni kartami, u kterých si položíš tyto otázky: ${prvni.join(" ")}`,
        `${PRAVIDLO[level]} U dalších karet se ptej: ${druhe.join(" ")}`,
      ],
      explanation: `${PRAVIDLO[level]} ${vybrane
        .flatMap((v) => v.karty.map(([t, proc]) => `„${t}“ patří do přihrádky ${v.name}: ${proc}.`))
        .join(" ")}`,
    },
  );
}

function gen(level: number): PracticeTask[] {
  const out = new Map<string, PracticeTask>();
  const hinty = new Set<string>();
  for (let i = 0; out.size < 24 && i < 400; i++) {
    const t = uloha(level, i);
    const klic = t.categories!.map((c) => [...c.items].sort().join("+")).join("|");
    if (out.has(klic) || hinty.has(t.hints![0]) || hinty.has(t.hints![1])) continue;
    hinty.add(t.hints![0]);
    hinty.add(t.hints![1]);
    out.set(klic, t);
  }
  return [...out.values()];
}

// ── Topic ────────────────────────────────────────────────────────────────
export const RECKE_MESTSKE_STATY: TopicMetadata[] = [
  {
    id: "g6-dej-recke-mestske-staty-6",
    rvpNodeId: "g6-dejepis-starovek-antika-recko-recke-mestske-staty-atheny-demokracie-sparta",
    displayName: "Athény a Sparta",
    title: "Řecké městské státy – Athény (demokracie), Sparta",
    studentTitle: "Athény a Sparta",
    subject: "dejepis",
    category: "Starověk",
    topic: "Antika - Řecko",
    briefDescription: "Rozliš, co patřilo k athénské demokracii a co ke spartskému vojenskému státu.",
    keywords: [
      "Athény", "Sparta", "polis", "městský stát", "demokracie", "lidové shromáždění",
      "ostrakismos", "Periklés", "heilóti", "eforové", "gerúsie", "Peloponés", "Akropolis",
    ],
    goals: [
      "Přiřadit znaky vlády, společnosti a výchovy k Athénám nebo Spartě.",
      "Z popisu situace poznat znak (výchova, ostrakismos, heilóti) a přiřadit ho státu.",
      "Rozpoznat rysy společné všem Řekům a pochopit, že athénská demokracie nedávala hlas všem.",
    ],
    boundaries: [
      "Athény a Sparta v době klasického Řecka, zjednodušeně podle učebnic 6. ročníku.",
      "Datace nejsou klíčem, uvádějí se jen orientačně.",
      "Nezahrnuje průběh řecko-perských válek a peloponéské války (samostatné téma).",
    ],
    gradeRange: [6, 6],
    inputType: "categorize",
    defaultLevel: 1,
    sessionTaskCount: 3,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Athény = demokracie, moře, obchod, divadlo a filozofie. Sparta = dva králové, rada starších, heilóti a vojenská výchova. Společné měly řečtinu, bohy, olympijské hry i nesvobodné lidi bez politických práv.",
      steps: [
        "U karty najdi znak: týká se vlády, výchovy, nesvobodných lidí, nebo hospodářství?",
        "Rozhodni, kterému státu ten znak patří.",
        "Zeptej se, jestli nešlo o věc společnou všem Řekům.",
      ],
      commonMistake: "Myslet si, že v athénské demokracii hlasovali všichni, i ženy a otroci. Hlasovali jen svobodní dospělí muži-občané.",
      example: "Ostrakismos = Athény. Heilóti = Sparta. Olympijské hry = oba státy.",
    },
  },
];
