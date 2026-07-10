import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface QA { q: string; a: string; opts: string[]; e: string }

const POOL_L1: QA[] = [
  { q: "Jaký žánr je text o lišce a hroznovém víně?", a: "bajka", opts: ["bajka", "pohádka", "pověst", "povídka"], e: "Liška, která jedná a uvažuje jako člověk, je typická pro bajku — a na konci takového příběhu bývá ponaučení. Pohádka by měla kouzla a víly, pověst by se vázala na skutečné místo a povídka by měla obyčejné lidi." },
  { q: "Co je charakteristické pro pohádku?", a: "Nadpřirozené bytosti, dobro vítězí, vymyšlené, 'Byl jednou jeden...'", opts: ["Nadpřirozené bytosti, dobro vítězí, vymyšlené, 'Byl jednou jeden...'", "Váže se na skutečné místo, historický základ", "Zvířata jako lidé, morální ponaučení", "Reálné postavy, krátký příběh"], e: "Pohádka je zcela vymyšlená — vystupují v ní kouzelné bytosti a dobro nakonec zvítězí. Historický základ patří k pověsti, zvířata s ponaučením k bajce a reálné postavy k povídce." },
  { q: "Co je charakteristické pro pověst?", a: "Váže se na skutečné místo nebo osobu, historický základ", opts: ["Váže se na skutečné místo nebo osobu, historický základ", "Nadpřirozené bytosti, dobro vítězí", "Zvířata jako lidé, morální ponaučení", "Reálné postavy, krátký příběh"], e: "Pověst se opírá o skutečnost — odehrává se na opravdovém místě nebo vypráví o skutečné osobě, i když si k tomu lidé něco přidali. Tím se liší od zcela vymyšlené pohádky i od bajky se zvířaty." },
  { q: "Co je charakteristické pro bajku?", a: "Zvířata jako lidé, morální ponaučení na konci", opts: ["Zvířata jako lidé, morální ponaučení na konci", "Nadpřirozené bytosti", "Historický základ", "Reálné postavy z každodenního života"], e: "V bajce vystupují zvířata, která mluví a jednají jako lidé, a příběh vždy končí ponaučením. Nadpřirozené bytosti má pohádka a historický základ pověst." },
  { q: "Co je charakteristické pro povídku?", a: "Kratší próza, reálné postavy a děj, jeden příběh", opts: ["Kratší próza, reálné postavy a děj, jeden příběh", "Nadpřirozené bytosti", "Morální ponaučení", "Historický základ a skutečné místo"], e: "Povídka je krátké vyprávění o obyčejných lidech a věcech, které se mohly opravdu stát, bez kouzel a bez povinného ponaučení. Tím se liší od pohádky, bajky i pověsti." },
  { q: "Ezop byl starořecký autor:", a: "bajek", opts: ["bajek", "pohádek", "pověstí", "povídek"], e: "Ezop je nejznámější autor bajek — krátkých příběhů o zvířatech s ponaučením. Pohádky, pověsti ani povídky proslulé nepsal, ty psali jiní autoři." },
  { q: "Alois Jirásek napsal:", a: "Staré pověsti české", opts: ["Staré pověsti české", "pohádky pro děti", "bajky o zvířatech", "detektivní povídky"], e: "Alois Jirásek sepsal Staré pověsti české — příběhy o praotci Čechovi, Libuši či Blanických rytířích, které se vážou k naší historii. Proto je to sbírka pověstí, ne pohádek nebo bajek." },
  { q: "Pohádka začíná typicky:", a: "Byl jednou jeden...", opts: ["Byl jednou jeden...", "Vím, že bylo skutečně...", "Liška říkala vraně...", "V naší třídě žil..."], e: "Slova 'Byl jednou jeden...' jsou typický pohádkový začátek, který hned napoví, že příběh je vymyšlený. Odkaz na skutečnost by patřil k pověsti a mluvící liška k bajce." },
  { q: "Bajka o havranovi a lišce učí:", a: "morální ponaučení — nebýt marnivý nebo pozor na lichocení", opts: ["morální ponaučení — nebýt marnivý nebo pozor na lichocení", "historický příběh o lišce", "pohádkový příběh o dobru a zlu", "příběh z reálného života"], e: "V této bajce liška chválí havrana, ten začne pyšně zpívat a upustí sýr — proto nás příběh učí dát si pozor na lichocení a marnivost. Každá bajka totiž končí takovým mravním ponaučením." },
  { q: "Pověst 'Libuše a Přemysl' je příkladem:", a: "pověsti (historický základ, skutečné místo — Čechy)", opts: ["pověsti (historický základ, skutečné místo — Čechy)", "pohádky", "bajky", "povídky"], e: "Vyprávění o kněžně Libuši a Přemyslovi se váže k počátkům našeho národa a ke skutečné zemi — proto je to pověst. Nemá kouzelné bytosti jako pohádka ani mluvící zvířata jako bajka." },
  { q: "Co je ponaučení (morál) bajky?", a: "Závěrečná věta říkající, co bychom se měli naučit", opts: ["Závěrečná věta říkající, co bychom se měli naučit", "Začátek bajky s uvedením postav", "Popis prostředí", "Přímá řeč zvířat"], e: "Ponaučení (morál) je věta na konci bajky, která shrnuje, co si máme z příběhu odnést. Není to úvod ani popis prostředí — naopak příběh uzavírá." },
  { q: "Karel Čapek napsal:", a: "Povídky, romány (detektivky, sci-fi)", opts: ["Povídky, romány (detektivky, sci-fi)", "bajky", "staré pověsti", "pohádky s draky"], e: "Karel Čapek je známý jako autor povídek a románů, například detektivních příběhů nebo vědeckofantastických děl. Staré pověsti psal Jirásek a bajky Ezop." },
  { q: "Co je typické pro pohádkové prostředí?", a: "Věci se mění kouzlem, draci, víly, trpaslíci", opts: ["Věci se mění kouzlem, draci, víly, trpaslíci", "Reálná moderní Česká republika", "Historický hrad se skutečným panovníkem", "Zvířata mluví jako lidé"], e: "V pohádce funguje svět kouzelně — objevují se draci, víly a trpaslíci a věci se mění čáry. Skutečný hrad s panovníkem by ukazoval na pověst a mluvící zvířata na bajku." },
  { q: "Jak se liší pohádka od pověsti?", a: "Pohádka = zcela vymyšlená; pověst = historický základ", opts: ["Pohádka = zcela vymyšlená; pověst = historický základ", "Pohádka má historický základ; pověst je vymyšlená", "Jsou to stejné žánry", "Pohádka má ponaučení; pověst ne"], e: "Pohádka je celá vymyšlená, kdežto pověst se opírá o skutečné místo nebo událost z historie. Není to tedy obráceně a nejsou to ani stejné žánry." },
  { q: "La Fontaine byl francouzský autor:", a: "bajek", opts: ["bajek", "pohádek", "pověstí", "románů"], e: "Jean de La Fontaine je slavný francouzský autor bajek, který navázal na Ezopa. Pohádky, pověsti ani romány ho neproslavily." },
  { q: "Bajka 'Liška a vrána' — kdo jsou postavy?", a: "zvířata, která jednají jako lidé", opts: ["zvířata, která jednají jako lidé", "historické osoby", "pohádkové bytosti", "reálné moderní postavy"], e: "V bajce vystupují zvířata, která mluví a chovají se jako lidé — tady liška a vrána. Nejsou to historické osoby ani kouzelné bytosti, právě podle zvířat poznáme bajku." },
];

const POOL_L2: QA[] = [
  { q: "Urči žánr: 'V pradávných časech žil na Vyšehradě moudrý kníže Krok, otec tří dcer...'", a: "pověst (historické místo — Vyšehrad)", opts: ["pověst (historické místo — Vyšehrad)", "pohádka", "bajka", "povídka"], e: "Vyšehrad je skutečné místo a kníže Krok patří k počátkům našich dějin, proto jde o pověst. Kdyby šlo o pohádku, byly by tu kouzla, a kdyby o bajku, jednala by zvířata." },
  { q: "Urči žánr: 'Jednoho dne se liška procházela lesem a spatřila hrozny. Přemýšlela, jak se k nim dostat...'", a: "bajka (zvíře s lidskými vlastnostmi, bude ponaučení)", opts: ["bajka (zvíře s lidskými vlastnostmi, bude ponaučení)", "pohádka", "pověst", "povídka"], e: "Liška tu přemýšlí a chová se jako člověk a příběh směřuje k ponaučení — to jsou znaky bajky. Pohádka by měla kouzla, pověst skutečné místo a povídka obyčejné lidi." },
  { q: "Urči žánr: 'V malém horském městě žila žena, která každý rok v zimě pletla svetry pro sousedy...'", a: "povídka (reálné prostředí, reálné postavy)", opts: ["povídka (reálné prostředí, reálné postavy)", "pohádka", "bajka", "pověst"], e: "Příběh o obyčejné ženě, která dělá běžnou věc, se mohl opravdu stát — nemá kouzla ani mluvící zvířata, proto je to povídka. Chybí mu i historický základ, který by ukazoval na pověst." },
  { q: "Urči žánr: 'Za devatero horami žila princezna uvězněná v temné věži. Každou noc ji hlídal drak...'", a: "pohádka (nadpřirozené bytosti, za devatero horami)", opts: ["pohádka (nadpřirozené bytosti, za devatero horami)", "pověst", "bajka", "povídka"], e: "Slova 'za devatero horami' a drak hlídající princeznu jsou klasické pohádkové prvky — příběh je zcela vymyšlený. Pověst by se vázala na skutečné místo a bajka by měla zvířata s ponaučením." },
  { q: "Co mají bajka a pohádka společného?", a: "Obě mají prvky fantazie a jsou vymyšlené", opts: ["Obě mají prvky fantazie a jsou vymyšlené", "Obě mají historický základ", "Obě mají jen reálné postavy", "Obě se odehrávají v moderní době"], e: "Bajka i pohádka jsou vymyšlené a obsahují fantazii — mluvící zvířata nebo kouzla. Historický základ má naopak pověst a jen reálné postavy povídka." },
  { q: "Co mají pověst a historický román společného?", a: "Obě vychází z historických událostí a osob", opts: ["Obě vychází z historických událostí a osob", "Obě jsou vymyšlené", "Obě mají zvířecí postavy", "Obě mají pohádkové bytosti"], e: "Pověst i historický román se opírají o skutečné dějinné události a osoby, i když si k nim přidávají vyprávění. Zvířecí ani pohádkové postavy do nich nepatří." },
  { q: "Krylov byl ruský autor:", a: "bajek", opts: ["bajek", "pohádek", "pověstí", "románů"], e: "Ivan Krylov je nejznámější ruský autor bajek, podobně jako Ezop ve starém Řecku nebo La Fontaine ve Francii. Pohádky, pověsti ani romány ho neproslavily." },
  { q: "Jak bajka poučuje čtenáře?", a: "Na konci přímo říká morální ponaučení (záměrně)", opts: ["Na konci přímo říká morální ponaučení (záměrně)", "Pomocí kouzelného řešení", "Skrytě přes postavu knížete", "Prostřednictvím nadpřirozených bytostí"], e: "Bajka poučuje otevřeně — na konci přímo vysloví ponaučení, které si máme z příběhu vzít. Nedělá to kouzlem ani přes nadpřirozené bytosti, ty patří do pohádky." },
  { q: "Pověst 'Blaničtí rytíři' — co je historický základ?", a: "Rytíři čekající v hoře Blaník — symbol národní naděje", opts: ["Rytíři čekající v hoře Blaník — symbol národní naděje", "Pohádkový hrad s drakem", "Liška a havran v lese", "Moderní česká vesnice"], e: "Pověst o Blanických rytířích se váže ke skutečné hoře Blaník a vyjadřuje naději, že vlasti v nejtěžší chvíli přijde pomoc. Drak ani liška do ní nepatří, ty jsou z pohádky a bajky." },
  { q: "Povídka se od románu liší:", a: "Je kratší a soustředí se na jeden příběh nebo moment", opts: ["Je kratší a soustředí se na jeden příběh nebo moment", "Je delší a podrobnější", "Má více postav", "Je vždy pro děti"], e: "Povídka je krátká a vypráví obvykle jeden příběh nebo okamžik, kdežto román je delší a má více dějů a postav. Není to tedy delší útvar a není určená jen dětem." },
  { q: "Bajka 'Moucha a vůz' — jaká je morálka?", a: "Ten, kdo nepracuje, si přisuzuje zásluhy jiných", opts: ["Ten, kdo nepracuje, si přisuzuje zásluhy jiných", "Koně jsou silnější než mouchy", "Vozy jezdí rychle", "Mouchy jsou chytré"], e: "Moucha sedící na voze si myslí, že vůz táhne ona, ačkoli dřou koně — proto nás bajka varuje před tím, abychom si přivlastňovali zásluhy druhých. Ostatní odpovědi berou příběh doslova a míjejí jeho smysl." },
  { q: "Co je zvláštní na pohádkové logice?", a: "Věci fungují jinak než v reálném světě (kouzla, mluvící zvířata)", opts: ["Věci fungují jinak než v reálném světě (kouzla, mluvící zvířata)", "Vše je realistické a vědecky vysvětlitelné", "Vždy skončí smutně", "Nikdy se neobjevují lidé"], e: "V pohádce platí jiná pravidla než ve skutečnosti — fungují kouzla a zvířata mluví. Pohádky navíc obvykle končí dobře a lidé v nich vystupují, takže ostatní odpovědi neplatí." },
  { q: "Urči žánr: Příběh o Honzovi, který dostane tři zlaté vlasy čerta.", a: "pohádka (nadpřirozené prvky, pohádkový Honza)", opts: ["pohádka (nadpřirozené prvky, pohádkový Honza)", "pověst", "bajka", "povídka"], e: "Čert a kouzelné zlaté vlasy jsou nadpřirozené prvky a Honza je typický pohádkový hrdina — proto je to pohádka. Pověst by se vázala na historii a bajka by měla zvířata s ponaučením." },
  { q: "Pověst se od pohádky liší tím, že:", a: "Pověst má základ v historii nebo skutečném místě", opts: ["Pověst má základ v historii nebo skutečném místě", "Pověst je vždy kratší", "Pověst má vždy zvířata", "Pověst vždy skončí šťastně"], e: "Hlavní rozdíl je v pravdivém jádru: pověst vychází ze skutečného místa nebo historie, kdežto pohádka je celá vymyšlená. Délka, zvířata ani šťastný konec o žánru nerozhodují." },
  { q: "Povídka se od bajky liší tím, že:", a: "Povídka má reálné postavy, bajka zvířata s morálním ponaučením", opts: ["Povídka má reálné postavy, bajka zvířata s morálním ponaučením", "Jsou to stejné žánry", "Povídka má ponaučení, bajka ne", "Bajka je delší než povídka"], e: "V povídce vystupují skuteční lidé, kdežto v bajce jednají zvířata a příběh končí ponaučením. Nejsou to stejné žánry a ponaučení má právě bajka, ne povídka." },
];

const POOL_L3: QA[] = [
  { q: "Příběh má zvíře, které mluví, ale příběh NEKONČÍ ponaučením a odehrává se 'za devatero horami'. Je to bajka?", a: "Ne — je to spíš pohádka (nadpřirozené prostředí, chybí ponaučení bajky)", opts: ["Ne — je to spíš pohádka (nadpřirozené prostředí, chybí ponaučení bajky)", "Ano, protože zvíře mluví", "Ano, protože je to krátký příběh", "Ano, bajka nepotřebuje ponaučení"], e: "Mluvící zvíře samo o sobě bajku nedělá — bez ponaučení a s pohádkovým prostředím ('za devatero horami') jde spíš o pohádku." },
  { q: "Příběh vypráví o skutečné historické bitvě, ale přidává si smyšlené podrobnosti (např. že bojovníkovi pomohl anděl). Je to:", a: "Pověst (základ v historii, s přidanými smyšlenými prvky)", opts: ["Pověst (základ v historii, s přidanými smyšlenými prvky)", "Pohádka (celá vymyšlená)", "Bajka (chybí zvířata)", "Povídka (chybí historický základ)"], e: "Pověst se opírá o skutečnou historickou událost, ale lidé si k ní časem přidali fantastické podrobnosti — to je pro pověst typické." },
  { q: "Čím se liší bajka od pohádky, ve které také vystupují mluvící zvířata (např. Kocour v botách)?", a: "Bajka má vždy explicitní ponaučení na konci, pohádka nemusí", opts: ["Bajka má vždy explicitní ponaučení na konci, pohádka nemusí", "Bajka nemá zvířata", "Pohádka je vždy kratší", "Není mezi nimi žádný rozdíl"], e: "Mluvící zvíře může být v obou žánrech, ale jen bajka musí vždy skončit jasným ponaučením — to je hlavní rozlišovací znak." },
  { q: "Text popisuje obyčejný den dítěte ve škole — bez kouzel, bez historie, bez zvířat. Jaký žánr to nejspíš je?", a: "Povídka", opts: ["Povídka", "Pohádka", "Bajka", "Pověst"], e: "Obyčejný, reálně možný příběh bez nadpřirozených prvků, historie nebo zvířat s ponaučením je typickou povídkou." },
  { q: "Pověst o Blanických rytířích i bajka o lišce a hroznech mají něco společného. Co to je?", a: "Obě vypráví příběh s určitým smyslem/poselstvím (u pověsti národní naděje, u bajky mravní ponaučení)", opts: ["Obě vypráví příběh s určitým smyslem/poselstvím (u pověsti národní naděje, u bajky mravní ponaučení)", "Obě mají mluvící zvířata", "Obě jsou zcela vymyšlené", "Obě se odehrávají v moderní době"], e: "I když jsou pověst a bajka jinak úplně odlišné žánry, obě nesou nějaké poselství — pověst národní naději, bajka mravní ponaučení." },
  { q: "Proč se pohádka 'O třech přadlenách' řadí mezi pohádky, i když v ní nevystupují žádná zvířata?", a: "Protože obsahuje nadpřirozené bytosti a kouzelné prvky, ne kvůli zvířatům", opts: ["Protože obsahuje nadpřirozené bytosti a kouzelné prvky, ne kvůli zvířatům", "Protože je krátká", "Protože nemá žádné postavy", "Protože se odehrává ve skutečném městě"], e: "Pohádku nepoznáme podle zvířat, ale podle nadpřirozených, kouzelných prvků — přadleny s kouzelnou mocí jsou přesně takový prvek." },
  { q: "Příběh 'Krtek a autíčko' — krtek najde a opraví autíčko, na konci není žádné ponaučení, jen radost z hry. Je to bajka?", a: "Ne — chybí ponaučení, i když je hlavní postavou zvíře", opts: ["Ne — chybí ponaučení, i když je hlavní postavou zvíře", "Ano, protože krtek je zvíře", "Ano, protože má šťastný konec", "Ano, protože je to pro děti"], e: "Bez závěrečného ponaučení nejde o bajku, i když hlavní postavou je zvíře — to je klíčová chybějící podmínka." },
  { q: "Jaký je rozdíl mezi tím, jak 'pravdivá' musí být pověst a jak 'pravdivá' musí být povídka?", a: "Pověst se váže ke konkrétní historické události nebo místu (i s přikrášlením); povídka jen musí být reálně možná", opts: ["Pověst se váže ke konkrétní historické události nebo místu (i s přikrášlením); povídka jen musí být reálně možná", "Obě musí být stoprocentně pravdivé", "Obě mohou být zcela vymyšlené bez omezení", "Není mezi nimi rozdíl"], e: "Pověst potřebuje skutečné historické jádro, zatímco povídka jen musí popisovat něco, co by se reálně mohlo stát, bez nutné vazby na konkrétní historii." },
  { q: "Text vypráví o dračí bytosti žijící v jeskyni u SKUTEČNÉ hory Říp, která symbolizuje počátky českého národa. Je to:", a: "Pověst (skutečné místo spojené s národní historií, i s fantastickým prvkem draka)", opts: ["Pověst (skutečné místo spojené s národní historií, i s fantastickým prvkem draka)", "Pohádka (protože je tam drak)", "Bajka (protože je tam zvíře)", "Povídka (protože je tam místo)"], e: "Vazba na skutečné historické místo (horu Říp) a národní symboliku ukazuje na pověst, i když obsahuje fantastický prvek draka." },
  { q: "Proč nemůže být krátký vtip o dvou kamarádech, kteří si dělají legraci ve třídě, bajkou?", a: "Chybí zvířata jednající jako lidé a chybí explicitní mravní ponaučení", opts: ["Chybí zvířata jednající jako lidé a chybí explicitní mravní ponaučení", "Protože je moc krátký", "Protože kamarádi se smějí", "Protože se odehrává ve škole"], e: "Bajka potřebuje zvířata s lidskými vlastnostmi a mravní ponaučení na konci — vtip o kamarádech ve škole ani jedno z toho nemá." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "Pohádka = nadpřirozené bytosti, dobro vítězí, zcela vymyšlená",
      "Pověst = historický základ, skutečné místo nebo osoba",
      "Bajka = zvířata jako lidé, morální ponaučení na konci",
      "Povídka = kratší próza, reálné postavy, jeden příběh",
    ],
    explanation: e,
  }));
}

export const POHADKAPOVESTBAJKAPOVIDKA: TopicMetadata[] = [
  {
    id: "g4-cjl-literarni-vychova-literarni-pojmy-a-zanry-pohadka-povest-bajka-povidka",
    rvpNodeId: "g4-cjl-literarni-vychova-literarni-pojmy-a-zanry-pohadka-povest-bajka-povidka",
    displayName: "Literární žánry",
    title: "Pohádka, pověst, bajka, povídka",
    studentTitle: "Literární žánry",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Literární výchova",
    briefDescription: "Poznáš rozdíl mezi pohádkou, pověstí, bajkou a povídkou.",
    keywords: ["pohádka", "pověst", "bajka", "povídka", "literární žánr", "Ezop", "Jirásek"],
    goals: [
      "Rozlišit literární žánry: pohádku, pověst, bajku, povídku",
      "Přiřadit text k správnému žánru",
    ],
    boundaries: ["Bez románu a novely", "Bez dramatických žánrů"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: ["g4-cjl-literarni-vychova-prace-s-textem-hlavni-postavy-a-jejich-charakteristika"],
    generator: gen,
    helpTemplate: {
      hint: "Pohádka=draci+víly; Pověst=historické místo+osoby; Bajka=zvířata+ponaučení; Povídka=reální lidé+jeden příběh",
      steps: [
        "Jsou nadpřirozené bytosti? → pohádka",
        "Historické místo nebo osoby? → pověst",
        "Zvířata jako lidé + morál na konci? → bajka",
        "Reální lidé, žádná fantazie? → povídka",
      ],
      commonMistake: "Záměna pohádky a bajky — bajka má vždy morální ponaučení na konci",
      example: "Liška a hrozny (Ezop) = bajka; Libuše (Jirásek) = pověst; Červená Karkulka = pohádka",
    },
  },
];
