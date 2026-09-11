import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "@/content/grade-3/_shared";
import { pad, pluralWithNumber } from "@/lib/czechGrammar";

// Přepsáno 2026-09-11 (inventura obsahu). Dřív 8 úloh na úroveň, jedna nápověda
// a žádná zpětná vazba. Teď tři oddělené banky:
// L1 pojmy (kdo knihu tvoří, části knihy, knihovna) · L2 použití v situaci
// (titulní strana, obsah, péče o knihu) · L3 dva kroky: čtení obsahu
// a rozsahu stran, řazení knih v knihovně podle příjmení autora.

interface Uloha {
  q: string;
  a: string;
  d: [string, string][];
  h: [string, string];
  e: string;
  emoji: string;
}

function task(u: Uloha): PracticeTask {
  if (u.d.length !== 3) throw new Error(`Úloha „${u.q}“ nemá tři chybné možnosti`);
  const wrong = u.d.map(([value, why]) => ({ value, why })) as [Distractor, Distractor, Distractor];
  return { ...choice(u.q, u.a, wrong, { hints: u.h, explanation: u.e }), emoji: u.emoji };
}

const stran = (n: number) => pad(n, "STRANA");

// ── L1: pojmy ─────────────────────────────────────────────────────────────
const POOL_L1: Uloha[] = [
  {
    q: "Jak se jmenuje člověk, který knihu napsal?", a: "spisovatel", emoji: "✍️",
    d: [
      ["ilustrátor", "Ilustrátor do knihy kreslí obrázky, text nepíše."],
      ["knihovník", "Knihovník knihy půjčuje, sám je nepíše."],
      ["čtenář", "Čtenář knihu čte, nenapsal ji."],
    ],
    h: [
      "Kdo vymyslel slova a příběh, které v knize čteš?",
      "Kniha má text a obrázky. Obrázky dělá výtvarník, knihy půjčuje člověk v knihovně. Jak se jmenuje ten, kdo vymyslí a zapíše text? Říká se mu také autor.",
    ],
    e: "Knihu napsal spisovatel. Vymyslel příběh a zapsal ho slovy.",
  },
  {
    q: "Kdo nakreslil obrázky v knize?", a: "ilustrátor", emoji: "🎨",
    d: [
      ["spisovatel", "Spisovatel píše text, obrázky obvykle kreslí někdo jiný."],
      ["knihovník", "Knihovník knihy půjčuje, nekreslí do nich."],
      ["čtenář", "Čtenář si knihu prohlíží a čte, obrázky do ní nekreslí."],
    ],
    h: [
      "Obrázek v knize se jmenuje ilustrace. Jak se jmenuje ten, kdo ji dělá?",
      "Text píše jeden člověk a obrázky k němu kreslí výtvarník. Jeho jméno bývá na obálce za slovem „ilustroval“. Z tohoto slova odvodíš i jeho název.",
    ],
    e: "Obrázky v knize kreslí ilustrátor. Obrázkům v knize říkáme ilustrace.",
  },
  {
    q: "Kdo ti v knihovně pomůže najít knihu a půjčí ti ji?", a: "knihovník", emoji: "🏛️",
    d: [
      ["spisovatel", "Spisovatel knihy píše. V knihovně je nepůjčuje."],
      ["ilustrátor", "Ilustrátor kreslí obrázky do knih, v knihovně nepracuje."],
      ["prodavač", "Prodavač knihy prodává v obchodě. V knihovně se nic neprodává."],
    ],
    h: [
      "Kdo v knihovně pracuje a sedí u pultu, kde se knihy půjčují?",
      "V knihovně pracuje člověk, který zná všechny police, zapisuje, co sis půjčil, a hlídá, kdy knihu vrátíš. Jeho název je odvozený od místa, kde pracuje.",
    ],
    e: "V knihovně pracuje knihovník (nebo knihovnice). Pomáhá najít knihy a půjčuje je.",
  },
  {
    q: "Jak se říká člověku, který si knihu čte?", a: "čtenář", emoji: "📖",
    d: [
      ["spisovatel", "Spisovatel knihu napsal. Ten, kdo ji čte, je někdo jiný."],
      ["ilustrátor", "Ilustrátor do knihy kreslí, nečte ji jako ty."],
      ["knihovník", "Knihovník knihy půjčuje. Kdo si knihu čte, má jiný název."],
    ],
    h: [
      "Když si doma otevřeš knihu a čteš, jak se ti v tu chvíli říká?",
      "Název je odvozený od slovesa „číst“. Stejně jako se tomu, kdo zpívá, říká zpěvák, má jméno i ten, kdo čte knihy. Jak zní?",
    ],
    e: "Kdo čte knihu, je čtenář. Název je odvozený od slovesa „číst“.",
  },
  {
    q: "Kde si můžeš knihu půjčit a pak ji vrátit?", a: "v knihovně", emoji: "📚",
    d: [
      ["v knihkupectví", "V knihkupectví se knihy prodávají, ne půjčují."],
      ["v papírnictví", "V papírnictví koupíš sešity a pastelky, knihy se tam nepůjčují."],
      ["v trafice", "V trafice se prodávají noviny a časopisy, knihy se tam nepůjčují."],
    ],
    h: [
      "Kam chodí čtenáři s průkazem, aby si odnesli knihu na pár týdnů?",
      "Hledáš místo, kde knihy nepatří tobě. Vezmeš si je domů, přečteš a pak je musíš přinést zpátky, aby si je mohl půjčit i někdo další. Jak se to místo jmenuje?",
    ],
    e: "Knihy se půjčují v knihovně. Po přečtení je vrátíme, aby je mohli číst i ostatní.",
  },
  {
    q: "Kde si knihu koupíš, aby ti zůstala?", a: "v knihkupectví", emoji: "🏪",
    d: [
      ["v knihovně", "V knihovně si knihu jen půjčíš, musíš ji vrátit."],
      ["v papírnictví", "Papírnictví prodává hlavně sešity a psací potřeby, ne knihy."],
      ["v trafice", "Trafika prodává noviny a časopisy, ne knihy."],
    ],
    h: [
      "Jak se jmenuje obchod, kde se prodávají hlavně knihy?",
      "Knihu můžeš půjčit, nebo koupit. Když ji chceš mít navždy, musíš jít do obchodu, kde se prodávají knihy. Jeho název začíná stejně jako slovo „kniha“.",
    ],
    e: "Knihy se prodávají v knihkupectví. Koupená kniha je tvoje, v knihovně si ji jen půjčíš.",
  },
  {
    q: "Jak se jmenuje obrázek v knize, který doplňuje text?", a: "ilustrace", emoji: "🖼️",
    d: [
      ["kapitola", "Kapitola je část textu s nadpisem, ne obrázek."],
      ["obálka", "Obálka je obal knihy. Obrázek může mít, ale obrázky uvnitř se tak nejmenují."],
      ["nadpis", "Nadpis je řádek textu nad článkem, není to obrázek."],
    ],
    h: [
      "Jak se jmenuje práce toho, kdo kreslí obrázky do knih?",
      "Výtvarník, který kreslí do knih, se jmenuje ilustrátor. Obrázek, který vytvoří, má podobný název. Vzpomeň si, jak se ten název tvoří.",
    ],
    e: "Obrázek v knize se jmenuje ilustrace. Kreslí ho ilustrátor a doplňuje jím text.",
  },
  {
    q: "Jak se jmenuje pevný obal knihy s názvem a obrázkem?", a: "obálka", emoji: "📕",
    d: [
      ["titulní strana", "Titulní strana je uvnitř knihy, není to obal."],
      ["hřbet", "Hřbet je jen úzký okraj, kde jsou listy spojené, ne celý obal."],
      ["záložka", "Záložka je proužek, kterým si značíš stránku."],
    ],
    h: [
      "Co vidíš na knize jako první, ještě než ji otevřeš?",
      "Kniha je zabalená do tvrdších desek. Na přední straně bývá velký název, jméno autora a obrázek, aby tě kniha zaujala. Jak se tomu obalu říká?",
    ],
    e: "Obálka je pevný obal knihy. Chrání listy a je na ní název, autor a obrázek.",
  },
  {
    q: "Jak se jmenuje úzká část knihy, kterou vidíš v polici?", a: "hřbet", emoji: "📚",
    d: [
      ["obálka", "Obálku v polici nevidíš celou, knihy stojí těsně vedle sebe."],
      ["titulní strana", "Titulní strana je uvnitř knihy, v polici ji nevidíš."],
      ["záložka", "Záložka je proužek mezi stránkami, ne část knihy."],
    ],
    h: [
      "Když knihy stojí v polici vedle sebe, kterou jejich část vidíš?",
      "V polici je z každé knihy vidět jen úzký proužek, kde jsou všechny listy spojené dohromady. Stejně se jmenuje i část zad u zvířete. Jak se jmenuje?",
    ],
    e: "Hřbet je úzká část knihy, kde jsou listy spojené. V polici vidíme právě hřbety.",
  },
  {
    q: "Jak se jmenuje seznam kapitol s čísly stran?", a: "obsah", emoji: "📋",
    d: [
      ["nadpis", "Nadpis je název jedné kapitoly, ne seznam všech kapitol."],
      ["titulní strana", "Na titulní straně je název a autor, ne seznam kapitol."],
      ["ilustrace", "Ilustrace je obrázek, ne seznam."],
    ],
    h: [
      "Kam se podíváš, když chceš rychle najít, kde začíná určitá kapitola?",
      "Na začátku nebo na konci knihy je stránka, kde jsou pod sebou vypsané názvy kapitol a u každé číslo strany. Prozradí ti, co všechno v knize najdeš. Jak se jmenuje?",
    ],
    e: "Obsah je seznam kapitol s čísly stran. Podle něj rychle najdeš, kde kapitola začíná.",
  },
  {
    q: "Jak se jmenuje menší část příběhu v knize s vlastním nadpisem?", a: "kapitola", emoji: "📑",
    d: [
      ["odstavec", "Odstavec je jen pár vět a vlastní nadpis nemá."],
      ["strana", "Strana je jedna strana listu, má číslo, ne nadpis."],
      ["věta", "Věta je příliš malá, nadpis nemá."],
    ],
    h: [
      "Na co je rozdělená dlouhá kniha, abys ji mohl číst po částech?",
      "Dlouhý příběh se dělí na menší celky. Každý začíná nadpisem a má několik stran. V obsahu jsou vypsané pod sebou. Jak se takový celek jmenuje?",
    ],
    e: "Kapitola je část knihy s vlastním nadpisem. Dlouhé knihy jsou rozdělené do kapitol.",
  },
  {
    q: "Co ukážeš v knihovně, když si chceš půjčit knihu?", a: "čtenářský průkaz", emoji: "🪪",
    d: [
      ["vstupenku", "Vstupenku ukazuješ v kině nebo v divadle, v knihovně ne."],
      ["účtenku", "Účtenku dostaneš v obchodě, když něco koupíš. V knihovně se nekupuje."],
      ["žákovskou knížku", "Žákovská knížka je do školy, v knihovně ji nepotřebuješ."],
    ],
    h: [
      "Jakou kartičku dostane každý, kdo se v knihovně přihlásí?",
      "Když se v knihovně přihlásíš, dostaneš kartičku se svým jménem. Podle ní knihovnice ví, kdo si knihu půjčil. Pojmenovaná je podle toho, kdo ji nosí, tedy podle toho, kdo čte.",
    ],
    e: "V knihovně ukazujeme čtenářský průkaz. Podle něj knihovnice zapíše, kdo si knihu půjčil.",
  },
  {
    q: "Jak se jmenuje první list uvnitř knihy s názvem a autorem?", a: "titulní strana", emoji: "📄",
    d: [
      ["obsah", "V obsahu jsou kapitoly a čísla stran, ne název a autor."],
      ["poslední strana", "Na poslední straně bývá konec příběhu nebo obsah, ne název knihy."],
      ["kapitola", "Kapitola je část příběhu, ne list s názvem knihy."],
    ],
    h: [
      "Otevřeš knihu. Co najdeš hned na začátku, ještě před příběhem?",
      "Hned za obálkou bývá list, kde je znovu napsaný titul knihy, tedy její název, a jméno autora a ilustrátora. Podle slova „titul“ má i svůj název. Jak se jmenuje?",
    ],
    e: "Titulní strana je na začátku knihy. Je na ní název (titul) knihy a jméno autora.",
  },
  {
    q: "Jak se jmenuje kniha, ve které najdeš pravdivá fakta o světě?", a: "encyklopedie", emoji: "🌍",
    d: [
      ["sbírka básní", "Básně vyjadřují pocity a nálady, fakta o světě nevysvětlují."],
      ["kniha pohádek", "Pohádky jsou vymyšlené příběhy, fakta v nich nenajdeš."],
      ["zpěvník", "Ve zpěvníku jsou písničky, ne fakta o světě."],
    ],
    h: [
      "Kde bys hledal, kolik váží slon nebo proč prší?",
      "Hledáš tlustou naučnou knihu, kde jsou hesla o zvířatech, rostlinách, planetách i dějinách, často s fotografiemi. Není v ní nic vymyšlené. Jak se taková kniha jmenuje?",
    ],
    e: "Encyklopedie je naučná kniha. Najdeš v ní pravdivá fakta o světě, zvířatech nebo vesmíru.",
  },
];

// ── L2: použití v konkrétní situaci ───────────────────────────────────────
const POOL_L2: Uloha[] = [
  {
    q: "Na titulní straně stojí: „Jana Nová: Kouzelná tužka. Ilustroval Karel Bříza.“ Co udělal Karel Bříza?", a: "nakreslil obrázky", emoji: "✏️",
    d: [
      ["napsal příběh", "Příběh napsala Jana Nová, její jméno stojí před názvem knihy."],
      ["půjčil knihu", "Na titulní straně nestojí ten, kdo knihu půjčil, ale ten, kdo ji vytvořil."],
      ["knihu přečetl", "Čtenáři se na titulní stranu nepíší. Karel Bříza knihu vytvářel."],
    ],
    h: [
      "Co znamená slovo „ilustroval“? Na jakou práci ukazuje?",
      "Jméno před názvem patří tomu, kdo vymyslel text, tedy Janě Nové. Za slovem „ilustroval“ stojí výtvarník knihy. Co takový výtvarník do knihy dělá?",
    ],
    e: "„Ilustroval“ znamená, že Karel Bříza nakreslil do knihy obrázky. Příběh napsala Jana Nová.",
  },
  {
    q: "Na obálce je: „Petr Hora – Pes Alík jde do školy“. Kdo je Petr Hora?", a: "autor knihy", emoji: "🐶",
    d: [
      ["hlavní postava", "Hlavní postavou je pes Alík, jeho jméno je v názvu knihy."],
      ["ilustrátor knihy", "U jména není slovo „ilustroval“. Samotné jméno na obálce patří tomu, kdo knihu napsal."],
      ["knihovník", "Jméno knihovníka se na obálku nepíše, ten knihy jen půjčuje."],
    ],
    h: [
      "Na obálce je jméno a za pomlčkou název. Čí jméno se píše před název?",
      "Za pomlčkou stojí název „Pes Alík jde do školy“, takže pes Alík je postava z příběhu. Jméno člověka před názvem patří tomu, kdo příběh vymyslel a napsal.",
    ],
    e: "Jméno před názvem knihy patří autorovi. Petr Hora knihu napsal, pes Alík je její postava.",
  },
  {
    q: "Na obálce je „Myška Pepička na výletě“ a pod tím „Lenka Dubová“. Kdo je myška Pepička?", a: "postava z příběhu", emoji: "🐭",
    d: [
      ["autorka knihy", "Autorkou je Lenka Dubová, jméno člověka stojí pod názvem."],
      ["ilustrátorka knihy", "Myška obrázky nekreslí. Ilustrátorka by byla uvedená jako člověk s příjmením."],
      ["knihovnice", "Myška Pepička je v názvu knihy, v knihovně nepracuje."],
    ],
    h: [
      "Je „Myška Pepička na výletě“ jméno člověka, nebo název knihy?",
      "Horní řádek je název knihy a říká, o kom kniha vypráví: o myšce, která jede na výlet. Dole je jméno a příjmení člověka, který knihu napsal. Kým tedy je myška?",
    ],
    e: "Myška Pepička je v názvu knihy, je to postava, o které příběh vypráví. Knihu napsala Lenka Dubová.",
  },
  {
    q: "Ilustrátor dostal od spisovatele hotový příběh. Co teď udělá?", a: "nakreslí k němu obrázky", emoji: "🖌️",
    d: [
      ["napíše konec příběhu", "Příběh je už hotový a napsal ho spisovatel. Ilustrátor text nepíše."],
      ["půjčí ho čtenářům", "Knihy čtenářům půjčuje knihovník, ne ilustrátor."],
      ["prodá ho v obchodě", "Prodávání není práce ilustrátora, ten pracuje s tužkou a barvami."],
    ],
    h: [
      "Jakou práci dělá ilustrátor, když má text hotový?",
      "Spisovatel svou práci udělal, text je hotový. Ilustrátor si ho přečte a vymyslí, jak budou vypadat postavy a místa. Pak vezme barvy. Co s nimi udělá?",
    ],
    e: "Ilustrátor si přečte hotový text a nakreslí k němu obrázky, které příběh doplní.",
  },
  {
    q: "Chceš zjistit, na které straně začíná kapitola o zimě. Kam se podíváš?", a: "do obsahu", emoji: "🔎",
    d: [
      ["na hřbet knihy", "Na hřbetu je jen název knihy a autor, kapitoly tam nejsou."],
      ["na obálku", "Na obálce je název a obrázek, ne seznam kapitol."],
      ["na titulní stranu", "Titulní strana uvádí název a autora, čísla stran kapitol ne."],
    ],
    h: [
      "Která část knihy vypisuje všechny kapitoly pod sebou?",
      "Hledáš seznam, kde je u každé kapitoly číslo strany, na které začíná. Bývá na začátku nebo na konci knihy. Jak se ta část jmenuje?",
    ],
    e: "V obsahu jsou všechny kapitoly i s čísly stran. Najdeš tam, kde začíná kapitola o zimě.",
  },
  {
    q: "Přestal jsi číst na straně 24. Jak si to místo označíš?", a: "vložím tam záložku", emoji: "🔖",
    d: [
      ["ohnu roh stránky", "Ohnutý roh stránku poškodí a zůstane na ní rýha."],
      ["podtrhnu řádek tužkou", "Do knih se nepíše, hlavně ne do půjčených."],
      ["nechám knihu otevřenou obráceně", "Kniha položená obráceně se láme v hřbetu a vypadávají z ní listy."],
    ],
    h: [
      "Jak si místo v knize označíš, aby se kniha nepoškodila?",
      "Ohnutý roh, tužka i kniha položená obráceně knihu ničí. Existuje proužek papíru nebo látky, který se vloží mezi stránky a nic nepoškodí. Jak se jmenuje?",
    ],
    e: "Záložka označí místo a knihu nepoškodí. Ohýbání, psaní i pokládání obráceně knihu ničí.",
  },
  {
    q: "Chceš se dozvědět, jak žijí sovy. Jakou knihu si vybereš?", a: "encyklopedii zvířat", emoji: "🦉",
    d: [
      ["sbírku básní", "Básně o sově vyjadřují náladu, pravdivé informace o jejím životě v nich nejsou."],
      ["knihu pohádek", "V pohádce sova může mluvit. Pravdu o tom, jak žije, se tam nedozvíš."],
      ["zpěvník", "Ve zpěvníku jsou písničky, ne informace o sovách."],
    ],
    h: [
      "Potřebuješ pravdivé informace, ne vymyšlený příběh. Jaká kniha je nabízí?",
      "Pohádky a básně jsou vymyšlené, zpěvník obsahuje písničky. Hledáš naučnou knihu s hesly a fotkami, kde se dočteš, co sova jí a kde hnízdí.",
    ],
    e: "Pravdivé informace o sovách najdeš v naučné knize, tedy v encyklopedii zvířat.",
  },
  {
    q: "Půjčenou knihu jsi dočetl. Co s ní uděláš?", a: "vrátím ji do knihovny", emoji: "↩️",
    d: [
      ["nechám si ji doma", "Půjčená kniha ti nepatří, musíš ji vrátit."],
      ["daruji ji kamarádovi", "Kniha patří knihovně, nemůžeš ji nikomu darovat."],
      ["prodám ji", "Cizí knihu prodat nesmíš, patří knihovně."],
    ],
    h: [
      "Komu patří kniha, kterou sis půjčil?",
      "Půjčená kniha není tvoje, jen ti ji na čas svěřili. Až ji dočteš, musí se dostat tam, odkud jsi ji přinesl, aby si ji mohl půjčit i další čtenář.",
    ],
    e: "Půjčená kniha patří knihovně. Po přečtení ji vrátíme, aby ji mohli číst i ostatní.",
  },
  {
    q: "Knihy stojí v polici těsně vedle sebe. Kde najdeš jejich názvy?", a: "na hřbetu", emoji: "📚",
    d: [
      ["na titulní straně", "Titulní stranu uvidíš, až knihu vytáhneš a otevřeš."],
      ["v obsahu", "Obsah je uvnitř knihy a jsou v něm kapitoly, ne název na první pohled."],
      ["na záložce", "Záložka je volný proužek, název knihy na ní nebývá."],
    ],
    h: [
      "Kterou část knihy vidíš, když stojí v polici?",
      "Z knihy stojící v polici vidíš jen úzký proužek, kde jsou listy spojené. Proto se na něj píše název a autor, abys knihu našel bez vytahování.",
    ],
    e: "V polici vidíme jen hřbety knih. Proto je na hřbetu napsaný název a autor.",
  },
  {
    q: "Kamarád ti půjčil knihu a upadla ti do bláta. Co uděláš?", a: "řeknu mu to a omluvím se", emoji: "🙏",
    d: [
      ["potichu mu ji vrátím", "Zatajit poškození není poctivé. Kamarád má právo to vědět."],
      ["vytrhnu špinavou stránku", "Vytržená stránka knihu poškodí ještě víc."],
      ["nechám si ji", "Knihu musíš vrátit, patří kamarádovi."],
    ],
    h: [
      "Jak by ses cítil ty, kdyby ti někdo vrátil zničenou knihu a nic neřekl?",
      "Kniha patří kamarádovi a stala se nehoda. Poctivé je nic netajit, přiznat, co se stalo, a domluvit se, jak škodu napravit. Která možnost to splňuje?",
    ],
    e: "Poctivé je kamarádovi nehodu přiznat a omluvit se. Pak se můžete domluvit, jak to napravit.",
  },
  {
    q: "V knize na straně 10 je velký nadpis „Jak ježek našel domov“. Co tam začíná?", a: "nová kapitola", emoji: "🦔",
    d: [
      ["obsah knihy", "Obsah je seznam kapitol, jeden velký nadpis uprostřed knihy to není."],
      ["nová kniha", "Kniha pokračuje dál, nová kniha uprostřed jiné nezačíná."],
      ["titulní strana", "Titulní strana je na úplném začátku knihy, ne na straně 10."],
    ],
    h: [
      "Co v knize začíná velkým nadpisem uprostřed stránek?",
      "Dlouhá kniha je rozdělená na části a každá část začíná svým nadpisem. Nadpis „Jak ježek našel domov“ tedy otevírá další část příběhu. Jak se ta část jmenuje?",
    ],
    e: "Velký nadpis uprostřed knihy otevírá kapitolu. Na straně 10 začíná další kapitola o ježkovi.",
  },
  {
    q: "V obsahu stojí: „Ježek na výletě … strana 12“. Co to znamená?", a: "kapitola začíná na straně 12", emoji: "📋",
    d: [
      ["kapitola končí na straně 12", "Obsah uvádí stranu, kde kapitola začíná, ne kde končí."],
      [`kapitola má ${stran(12)}`, "Číslo v obsahu není délka kapitoly, ale strana, na které začíná."],
      [`v knize je ${pluralWithNumber(12, "kapitola", "kapitoly", "kapitol")}`, "Číslo patří jen k této kapitole, neříká, kolik kapitol má kniha."],
    ],
    h: [
      "Proč je v obsahu u každého názvu napsané číslo?",
      "Obsah ti pomáhá kapitolu najít. Když otevřeš knihu na straně s tím číslem, uvidíš nadpis „Ježek na výletě“. Co se tedy na té straně děje?",
    ],
    e: "Číslo v obsahu je strana, kde kapitola začíná. Kapitola „Ježek na výletě“ začíná na straně 12.",
  },
  {
    q: "Tvůj brácha je malý a ještě neumí číst. Jakou knihu mu půjčíš?", a: "leporelo s obrázky", emoji: "🧸",
    d: [
      ["encyklopedii bez obrázků", "Bez obrázků by si brácha nic neprohlédl, neumí přečíst text."],
      ["knihu s dlouhými kapitolami", "Dlouhé kapitoly jsou pro děti, které už umějí číst."],
      ["slovník", "Slovník je seznam slov, malé dítě by v něm nic nevidělo."],
    ],
    h: [
      "Co si může prohlížet dítě, které ještě neumí číst?",
      "Malé dítě nepřečte písmena, ale pozná, co je nakreslené. Hodí se mu kniha z tvrdého kartonu, která se rozkládá jako harmonika a má na každé stránce velký obrázek.",
    ],
    e: "Leporelo má velké obrázky a pevné stránky. Malé dítě si ho prohlédne, i když neumí číst.",
  },
  {
    q: "Hledáš knihu, ale nevíš, ve které polici je. Co uděláš?", a: "zeptám se knihovnice", emoji: "💁",
    d: [
      ["zeptám se ilustrátora", "Ilustrátor v knihovně nepracuje a police nezná."],
      ["napíšu spisovateli", "Spisovatel knihu napsal, ale neví, kde stojí v této knihovně."],
      ["vezmu první knihu", "První kniha, kterou vezmeš, nejspíš nebude ta, kterou hledáš."],
    ],
    h: [
      "Kdo v knihovně ví, kde která kniha stojí?",
      "V knihovně pracuje člověk, který se o police stará a zná jejich pořadí. Právě on ti pomůže knihu najít. Kdo to je?",
    ],
    e: "Knihovnice se o police stará a ví, kde která kniha je. Proto se zeptáme jí.",
  },
];

// ── L3: dva kroky — obsah a rozsah stran, řazení podle příjmení ─────────────
interface Kapitola { nazev: string; str: number }

function obsahText(k: Kapitola[]): string {
  return `Obsah: ${k.map((x) => `${x.nazev} ${x.str}`).join(", ")}.`;
}

/** Rozsah stran kapitoly i (poslední strana = začátek další kapitoly − 1). */
function rozsahTask(k: Kapitola[], i: number, emoji: string): PracticeTask {
  const od = k[i].str, dalsi = k[i + 1].str, konec = dalsi - 1;
  const predchozi = i > 0 ? k[i - 1] : null;
  return task({
    q: `${obsahText(k)} Na kterých stranách je kapitola ${k[i].nazev}?`,
    a: `${od} až ${konec}`,
    emoji,
    d: [
      [`${od} až ${dalsi}`, `Na straně ${dalsi} už začíná kapitola ${k[i + 1].nazev}, ta do kapitoly ${k[i].nazev} nepatří.`],
      [
        predchozi ? `${predchozi.str} až ${od}` : `${od - 1} až ${konec}`,
        predchozi ? `Od strany ${predchozi.str} je kapitola ${predchozi.nazev}, ne ${k[i].nazev}.` : `Kapitola ${k[i].nazev} začíná až na straně ${od}.`,
      ],
      [`${od + 1} až ${dalsi}`, `Kapitola ${k[i].nazev} začíná už na straně ${od}, ne o stranu později.`],
    ],
    h: [
      `Kde podle obsahu začíná kapitola ${k[i].nazev} a kde začíná ta, která je za ní?`,
      `Kapitola ${k[i].nazev} začíná na straně ${od}. Končí o stranu dřív, než začne kapitola ${k[i + 1].nazev} (strana ${dalsi}). Odečti od čísla ${dalsi} jedničku a máš poslední stranu.`,
    ],
    e: `Kapitola ${k[i].nazev} začíná na straně ${od}. Na straně ${dalsi} začíná kapitola ${k[i + 1].nazev}, takže ${k[i].nazev} končí na straně ${konec}.`,
  });
}

/** Počet stran kapitoly i = začátek další − začátek této. */
function delkaTask(k: Kapitola[], i: number, emoji: string): PracticeTask {
  const od = k[i].str, dalsi = k[i + 1].str, n = dalsi - od;
  return task({
    q: `${obsahText(k)} Kolik stran má kapitola ${k[i].nazev}?`,
    a: String(n),
    emoji,
    d: [
      [String(n + 1), `Započítal jsi i stranu ${dalsi}, na které už začíná kapitola ${k[i + 1].nazev}.`],
      [String(n - 1), `Kapitola začíná už na straně ${od} a i ta se počítá.`],
      [String(dalsi), `Číslo ${dalsi} je strana, kde začíná další kapitola, ne počet stran.`],
    ],
    h: [
      `Na které straně začíná kapitola ${k[i].nazev} a na které ta další?`,
      `Kapitola ${k[i].nazev} zabírá strany od ${od} až po stranu těsně před ${dalsi}. Počet stran zjistíš, když od čísla ${dalsi} odečteš číslo ${od}.`,
    ],
    e: `Kapitola ${k[i].nazev} začíná na straně ${od} a končí na straně ${dalsi - 1}. ${dalsi} − ${od} = ${n}, má tedy ${stran(n)}.`,
  });
}

/** Na které straně kapitola končí. */
function konecTask(k: Kapitola[], i: number, emoji: string): PracticeTask {
  const od = k[i].str, dalsi = k[i + 1].str;
  return task({
    q: `${obsahText(k)} Na které straně končí kapitola ${k[i].nazev}?`,
    a: String(dalsi - 1),
    emoji,
    d: [
      [String(dalsi), `Na straně ${dalsi} už začíná kapitola ${k[i + 1].nazev}.`],
      [String(od), `Na straně ${od} kapitola ${k[i].nazev} začíná, ne končí.`],
      [String(dalsi - 2), `Strana ${dalsi - 2} ještě není poslední, kapitola pokračuje ještě o stranu dál.`],
    ],
    h: [
      `Která kapitola následuje po kapitole ${k[i].nazev} a kde začíná?`,
      `Kapitola ${k[i].nazev} trvá, dokud nezačne kapitola ${k[i + 1].nazev} na straně ${dalsi}. Poslední strana je tedy ta, která stojí těsně před číslem ${dalsi}.`,
    ],
    e: `Kapitola ${k[i + 1].nazev} začíná na straně ${dalsi}, takže kapitola ${k[i].nazev} končí o stranu dřív, na straně ${dalsi - 1}.`,
  });
}

const OBSAH_A: Kapitola[] = [{ nazev: "Jaro", str: 4 }, { nazev: "Léto", str: 10 }, { nazev: "Podzim", str: 17 }, { nazev: "Zima", str: 23 }];
const OBSAH_B: Kapitola[] = [{ nazev: "O kohoutkovi", str: 3 }, { nazev: "O slepičce", str: 9 }, { nazev: "O kůzlátkách", str: 14 }, { nazev: "O vlkovi", str: 20 }];
const OBSAH_C: Kapitola[] = [{ nazev: "Doma", str: 2 }, { nazev: "Ve škole", str: 8 }, { nazev: "Na hřišti", str: 13 }, { nazev: "U babičky", str: 21 }];

// Řazení v knihovně: podle prvního písmene PŘÍJMENÍ autora (CH je za H).
const POLICE = ["A–D", "E–K", "L–R", "S–Ž"] as const;
type Police = (typeof POLICE)[number];

interface Autor {
  jmeno: string;
  prijmeni: string;
  pismeno: string;
  a: Police;
  /** Zpětná vazba ke každé chybné polici. */
  why: Partial<Record<Police, string>>;
  zena?: boolean;
  emoji: string;
}

const AUTORI: Autor[] = [
  {
    jmeno: "Jan", prijmeni: "Mráz", pismeno: "M", a: "L–R", emoji: "❄️",
    why: {
      "E–K": "Řadil jsi podle křestního jména Jan. Rozhoduje příjmení Mráz.",
      "A–D": "Písmeno M je v abecedě až za D.",
      "S–Ž": "Písmeno M je v abecedě před S.",
    },
  },
  {
    jmeno: "Věra", zena: true, prijmeni: "Chalupová", pismeno: "CH", a: "E–K", emoji: "🏡",
    why: {
      "A–D": "CH je samostatné písmeno a stojí v abecedě za H, ne u C.",
      "S–Ž": "Řadil jsi podle křestního jména Věra. Rozhoduje příjmení Chalupová.",
      "L–R": "CH je v abecedě za H, tedy ještě před L.",
    },
  },
  {
    jmeno: "Ota", prijmeni: "Šťastný", pismeno: "Š", a: "S–Ž", emoji: "🍀",
    why: {
      "L–R": "Řadil jsi podle křestního jména Ota. Rozhoduje příjmení Šťastný.",
      "A–D": "Š je v abecedě až za S, ne na začátku.",
      "E–K": "Š je v abecedě až za S, daleko za K.",
    },
  },
  {
    jmeno: "Dana", zena: true, prijmeni: "Tichá", pismeno: "T", a: "S–Ž", emoji: "🤫",
    why: {
      "A–D": "Řadila jsi podle křestního jména Dana. Rozhoduje příjmení Tichá.",
      "L–R": "Písmeno T je v abecedě až za R.",
      "E–K": "Písmeno T je v abecedě daleko za K.",
    },
  },
  {
    jmeno: "Petr", prijmeni: "Beneš", pismeno: "B", a: "A–D", emoji: "📗",
    why: {
      "L–R": "Řadil jsi podle křestního jména Petr. Rozhoduje příjmení Beneš.",
      "E–K": "Písmeno B je v abecedě před E.",
      "S–Ž": "Písmeno B je hned na začátku abecedy, ne na konci.",
    },
  },
  {
    jmeno: "Zuzana", zena: true, prijmeni: "Adamová", pismeno: "A", a: "A–D", emoji: "📘",
    why: {
      "S–Ž": "Řadil jsi podle křestního jména Zuzana. Rozhoduje příjmení Adamová.",
      "E–K": "Písmeno A je první v abecedě, patří před E.",
      "L–R": "Písmeno A je první v abecedě, daleko před L.",
    },
  },
];

function policeTask(u: Autor): PracticeTask {
  const wrong = POLICE.filter((p) => p !== u.a).map((p) => {
    const why = u.why[p];
    if (!why) throw new Error(`Chybí zpětná vazba „${p}“ u ${u.prijmeni}`);
    return { value: p, why };
  }) as [Distractor, Distractor, Distractor];
  return {
    ...choice(
      `Knihy stojí v policích podle prvního písmene příjmení autora. Kam patří kniha, kterou ${u.zena ? "napsala" : "napsal"} ${u.jmeno} ${u.prijmeni}?`,
      u.a,
      wrong,
      {
        hints: [
          `Které ze jmen je příjmení: ${u.jmeno}, nebo ${u.prijmeni}?`,
          `Příjmení je rodinné jméno a píše se za křestním. U autora ${u.jmeno} ${u.prijmeni} je to „${u.prijmeni}“. Podívej se na jeho první písmeno a najdi v abecedě, mezi která písmena patří.`,
        ],
        explanation: `Příjmení ${u.prijmeni} začíná na ${u.pismeno}${u.pismeno === "CH" ? " (CH je v abecedě za H)" : ""}. Písmeno ${u.pismeno} patří do police ${u.a}.`,
      },
    ),
    emoji: u.emoji,
  };
}

const OSTATNI_L3: Uloha[] = [
  {
    q: "Na obálce stojí: „Tomáš Kos: Dráček Fráček. Ilustrace Tomáš Kos.“ Co víme o Tomáši Kosovi?", a: "knihu napsal i nakreslil", emoji: "🐲",
    d: [
      ["knihu jen napsal", "Jeho jméno je i za slovem „Ilustrace“, takže kreslil i obrázky."],
      ["knihu jen nakreslil", "Jeho jméno stojí i před názvem knihy, takže ji také napsal."],
      ["je hlavní postavou", "Hlavní postavou je Dráček Fráček, jeho jméno je v názvu."],
    ],
    h: [
      "Kolikrát je na obálce jméno Tomáš Kos a u čeho stojí?",
      "Jméno před názvem patří tomu, kdo text vymyslel. Jméno za slovem „Ilustrace“ patří tomu, kdo kreslil. Tady je na obou místech stejný člověk. Co z toho plyne?",
    ],
    e: "Tomáš Kos je uvedený před názvem (autor) i u ilustrací (ilustrátor). Knihu tedy napsal i nakreslil.",
  },
  {
    q: "Paní Eva nakreslila obrázky do knihy, ale příběh nevymyslela. Čí jméno ještě musí být na obálce?", a: "jméno spisovatele", emoji: "🖍️",
    d: [
      ["jméno knihovnice", "Knihovnice knihu jen půjčuje, na obálku se nepíše."],
      ["jméno prvního čtenáře", "Čtenáři se na obálku nepíší, knihu nevytvořili."],
      ["jméno prodavače", "Prodavač knihu nevytvořil, jeho jméno na obálce není."],
    ],
    h: [
      "Paní Eva je ilustrátorka. Kdo další musel na knize pracovat?",
      "Knihu vytvářejí dva lidé: jeden kreslí obrázky a druhý vymyslí a napíše příběh. Paní Eva je ten první. Čí jméno tedy na obálce ještě chybí?",
    ],
    e: "Paní Eva je ilustrátorka. Příběh napsal někdo jiný, spisovatel, a jeho jméno musí být na obálce také.",
  },
];

function genL3(): PracticeTask[] {
  return [
    rozsahTask(OBSAH_A, 1, "☀️"),
    delkaTask(OBSAH_A, 2, "🍂"),
    konecTask(OBSAH_B, 1, "🐔"),
    rozsahTask(OBSAH_B, 2, "🐐"),
    delkaTask(OBSAH_C, 1, "🏫"),
    delkaTask(OBSAH_C, 2, "⚽"),
    ...AUTORI.map(policeTask),
    ...OSTATNI_L3.map(task),
  ];
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return shuffle(POOL_L1).map(task);
  if (level === 2) return shuffle(POOL_L2).map(task);
  return shuffle(genL3());
}

export const SPISOVATELKNIHA: TopicMetadata[] = [
  {
    id: "g2-cjl-literarni-vychova-prace-s-knihou-spisovatel-ilustrator-knihovna",
    rvpNodeId: "g2-cjl-literarni-vychova-prace-s-knihou-spisovatel-ilustrator-knihovna",
    title: "Spisovatel, ilustrátor, knihovna",
    studentTitle: "Kdo tvoří knihu",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Práce s knihou",
    briefDescription: "Naučíš se, kdo tvoří knihy a kde je najít.",
    keywords: ["spisovatel", "ilustrátor", "knihovna", "obálka", "obsah", "kapitola", "čtenář"],
    goals: [
      "Vědět, kdo je spisovatel a kdo je ilustrátor.",
      "Znát funkci knihovny a knihovníka.",
      "Orientovat se v knize (obálka, obsah, kapitola).",
    ],
    boundaries: ["Bez bibliografických detailů.", "Bez nakladatelství a ISBN."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Spisovatel píše text. Ilustrátor maluje obrázky. Knihovník v knihovně půjčuje knihy.",
      steps: ["Přečti otázku.", "Jde o text, obrázky nebo místo?", "Text → spisovatel. Obrázky → ilustrátor. Místo → knihovna."],
      commonMistake: "Záměna ilustrátora a spisovatele — ilustrátor maluje, spisovatel píše.",
      example: "Pohádky o Rumcajsovi → spisovatel Václav Čtvrtek. Obrázky → ilustrátor.",
    },
  },
];
