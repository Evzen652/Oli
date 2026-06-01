import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL_L1: PracticeTask[] = [
  { question: "Co je informační systém (IS)?", correctAnswer: "Systém pro sběr, ukládání, zpracování a vydávání informací", options: ["Systém pro sběr, ukládání, zpracování a vydávání informací", "Počítačová hra", "Typ antivirového programu", "Způsob sdílení fotek"], hints: ["IS = sbírá, ukládá a vydává informace."] },
  { question: "Jak se jmenuje typický školní informační systém pro žáky a rodiče?", correctAnswer: "Bakaláři nebo iŠkola – elektronická třídní kniha", options: ["Bakaláři nebo iŠkola – elektronická třídní kniha", "Google Mapy", "Excel", "IDOS"], hints: ["Školní IS = Bakaláři — žáci a rodiče vidí známky a rozvrh."] },
  { question: "Co umožňuje knihovní informační systém?", correctAnswer: "Vyhledávání knih podle autora, názvu nebo ISBN a správu výpůjček", options: ["Vyhledávání knih podle autora, názvu nebo ISBN a správu výpůjček", "Sledování filmů online", "Rezervaci letenek", "Kontrolu počasí"], hints: ["Knihovní IS = katalog knih + výpůjčky."] },
  { question: "Co je IDOS?", correctAnswer: "Informační systém pro vyhledávání jízdních řádů – vlaky, autobusy, MHD", options: ["Informační systém pro vyhledávání jízdních řádů – vlaky, autobusy, MHD", "Školní systém pro žáky", "Online knihovna", "Navigační systém pro auta"], hints: ["IDOS = jízdní řády online."] },
  { question: "Co je GPS navigace?", correctAnswer: "Systém, který pomocí satelitů určuje polohu a naviguje na zadané místo", options: ["Systém, který pomocí satelitů určuje polohu a naviguje na zadané místo", "Způsob hledání knih v knihovně", "Školní IS pro rozvrh", "Databáze filmů"], hints: ["GPS = Global Positioning System — navigace pomocí satelitů."] },
  { question: "K čemu slouží školní IS Bakaláři?", correctAnswer: "Žáci a rodiče vidí známky, rozvrh a mohou komunikovat s učiteli", options: ["Žáci a rodiče vidí známky, rozvrh a mohou komunikovat s učiteli", "Slouží k hraní online her", "Slouží k vyhledávání knih", "Slouží k rezervaci letenek"], hints: ["Bakaláři = škola online — známky, rozvrh, komunikace."] },
  { question: "Co je ISBN v knihovním IS?", correctAnswer: "Mezinárodní číslo pro identifikaci knihy — unikátní pro každou knihu", options: ["Mezinárodní číslo pro identifikaci knihy — unikátní pro každou knihu", "Jméno autora", "Žánr knihy", "Rok vydání knihy"], hints: ["ISBN = identifikační číslo knihy (jako rodné číslo pro knihy)."] },
  { question: "Jak najdu knihu v knihovním IS, pokud znám jen autora?", correctAnswer: "Vyhledávám podle jména autora v katalogu", options: ["Vyhledávám podle jména autora v katalogu", "Musím znát ISBN", "Procházím police fyzicky", "Hledám jen přes Google"], hints: ["Katalog umožňuje hledat podle autora, názvu nebo ISBN."] },
  { question: "Co jsou informační tabule na nádraží nebo zastávce?", correctAnswer: "Digitální zobrazovače odchodů a příjezdů vlaků nebo autobusů v reálném čase", options: ["Digitální zobrazovače odchodů a příjezdů vlaků nebo autobusů v reálném čase", "Billboardy s reklamou", "Navigační mapy", "Jízdenkové automaty"], hints: ["Informační tabule = přijíždí/odjíždí — dopravní IS."] },
  { question: "Co je zásobar (databáze) v informačním systému?", correctAnswer: "Organizované úložiště dat, ze kterého IS čerpá informace", options: ["Organizované úložiště dat, ze kterého IS čerpá informace", "Počítačový program pro psaní textu", "Navigační aplikace", "Způsob filtrování e-mailů"], hints: ["Databáze = zásobník dat pro IS."] },
  { question: "Jak se nazývá aplikace pro vyhledávání tras v dopravě (náhrada IDOS)?", correctAnswer: "Google Mapy nebo Mapy.cz", options: ["Google Mapy nebo Mapy.cz", "Google Dokumenty", "Bakaláři", "LibreOffice"], hints: ["Google Mapy = navigace + jízdní řády."] },
  { question: "Co je výpůjčka v knihovním IS?", correctAnswer: "Záznam o vypůjčení knihy — kdo si půjčil, kdy a do kdy ji musí vrátit", options: ["Záznam o vypůjčení knihy — kdo si půjčil, kdy a do kdy ji musí vrátit", "Nákup knihy online", "Rezervace místa v knihovně", "Katalog knih"], hints: ["Výpůjčka = půjčení knihy na dobu určitou."] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Jak vyhledám v knihovním IS všechny knihy od autora 'Karel Čapek'?", correctAnswer: "Zadám do vyhledávacího pole autora: Karel Čapek", options: ["Zadám do vyhledávacího pole autora: Karel Čapek", "Hledám podle ISBN", "Procházím police ručně", "Filtruji podle roku vydání"], hints: ["Katalog umožňuje hledat podle jména autora."] },
  { question: "Školní IS ukazuje, že Honzovi vyprší výpůjčka knihy za 2 dny. Co by měl Honza udělat?", correctAnswer: "Vrátit knihu nebo požádat o prodloužení výpůjčky", options: ["Vrátit knihu nebo požádat o prodloužení výpůjčky", "Nechat si knihu dál a ignorovat termín", "Zaplatit pokutu ihned", "Vrátit knihu po termínu bez upozornění"], hints: ["Vypůjčovací termín = do kdy musím vrátit."] },
  { question: "Jaký je rozdíl mezi IDOS a GPS navigací?", correctAnswer: "IDOS hledá spoje veřejnou dopravou; GPS naviguje autem nebo pěšky v reálném čase", options: ["IDOS hledá spoje veřejnou dopravou; GPS naviguje autem nebo pěšky v reálném čase", "IDOS je starší verze GPS", "GPS hledá spoje; IDOS naviguje autem", "Jsou totéž"], hints: ["IDOS = jízdní řády; GPS = navigace v reálném čase."] },
  { question: "Rodič chce zjistit, jak má syn prospěch z matematiky. Jaký IS použije?", correctAnswer: "Školní IS – Bakaláři, iŠkola — sekce známky nebo klasifikace", options: ["Školní IS – Bakaláři, iŠkola — sekce známky nebo klasifikace", "Knihovní IS", "Dopravní IS – IDOS", "Google Mapy"], hints: ["Schulní IS = rodiče vidí prospěch dítěte."] },
  { question: "Jaký je přínos informačních tabulí na nádražích oproti tištěným jízdním řádům?", correctAnswer: "Tabule zobrazují aktuální stav v reálném čase — zpoždění, změny trasy", options: ["Tabule zobrazují aktuální stav v reálném čase — zpoždění, změny trasy", "Tištěné řády jsou přesnější", "Tabule fungují jen v letní sezoně", "Tabule jsou pomalejší než tištěné řády"], hints: ["Reálný čas = tabule ukazují aktuální informace, ne jen plán."] },
  { question: "Co jsou klíčová slova při vyhledávání v IS?", correctAnswer: "Slova, která zadáš do vyhledávacího pole pro nalezení relevantního výsledku", options: ["Slova, která zadáš do vyhledávacího pole pro nalezení relevantního výsledku", "Heslo pro přihlášení", "Název databáze", "Typ IS"], hints: ["Klíčové slovo = co hledám — vložím do pole a IS najde shody."] },
  { question: "Chci zjistit, v kolik hodin jede příští vlak z Prahy do Brna. Jaký IS použiji?", correctAnswer: "IDOS nebo aplikaci Českých drah – CD", options: ["IDOS nebo aplikaci Českých drah – CD", "Bakaláři", "Google Dokumenty", "Knihovní katalog"], hints: ["Jízdní řád = IDOS nebo CD.cz."] },
  { question: "Co je rezervace knihy v knihovním IS?", correctAnswer: "Zamluvení knihy, která je právě vypůjčena — IS mě upozorní, až bude k dispozici", options: ["Zamluvení knihy, která je právě vypůjčena — IS mě upozorní, až bude k dispozici", "Trvalé zakoupení knihy přes IS", "Prodloužení výpůjčky", "Vrácení knihy online"], hints: ["Rezervace = zamluvím si knihu, až ji někdo vrátí."] },
  { question: "Proč je důležité, aby IS byl aktuální (aktualizovaný)?", correctAnswer: "Zastaralá data vedou k chybným výsledkům — např. neexistující spoj nebo nesprávná známka", options: ["Zastaralá data vedou k chybným výsledkům — např. neexistující spoj nebo nesprávná známka", "Aktualizace IS je jen kosmetická", "IS funguje správně i se zastaralými daty", "Aktualizace IS způsobuje chyby"], hints: ["Zastaralý IS = špatné informace = chybná rozhodnutí."] },
  { question: "Jak se nazývá přehled všech dostupných knih v knihovním IS?", correctAnswer: "Katalog – knihovní katalog", options: ["Katalog – knihovní katalog", "Databáze výpůjček", "Jízdní řád", "Rozvrh hodin"], hints: ["Katalog = seznam knih v knihovně."] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Proč potřebuje školní IS přihlášení (jméno + heslo)?", correctAnswer: "Každý rodič a žák vidí jen svá vlastní data — ochrana soukromí", options: ["Každý rodič a žák vidí jen svá vlastní data — ochrana soukromí", "IS funguje bez přihlášení, ale přihlášení urychlí načítání", "Přihlášení je jen pro učitele", "IS požaduje přihlášení ze zákona o daních"], hints: ["Přihlášení = každý vidí jen svá data, ne data ostatních."] },
  { question: "Jak se nazývá situace, kdy vyhledám v IS 'Čapek' a IS mi nabídne Karla i Josefa Čapka?", correctAnswer: "Výsledky vyhledávání — IS našel všechny shody s klíčovým slovem", options: ["Výsledky vyhledávání — IS našel všechny shody s klíčovým slovem", "Chyba IS", "Filtrování dat", "Duplikát záznamu"], hints: ["IS vrátí vše, co odpovídá hledanému slovu."] },
  { question: "Proč jsou digitální IS lepší než papírové záznamy pro velké knihovny?", correctAnswer: "IS umožňuje rychlé vyhledání, řazení a správu tisíců knih bez fyzického prohledávání", options: ["IS umožňuje rychlé vyhledání, řazení a správu tisíců knih bez fyzického prohledávání", "Papírové záznamy jsou přesnější", "IS je jen pro malé knihovny", "Papírové záznamy jsou rychlejší"], hints: ["Tisíce knih = papír je pomalý; IS je rychlý a prohledávatelný."] },
  { question: "Dopravní IS ukazuje zpoždění vlaku o 15 minut. Přestupní čas v Brně máš 10 minut. Co uděláš?", correctAnswer: "Hledám náhradní spoj — 15 minut zpoždění > 10 minut přestupního času", options: ["Hledám náhradní spoj — 15 minut zpoždění > 10 minut přestupního času", "Nastoupím do vlaku a doufám", "Počkám na nádraží bez hledání", "Přestup nestihnu — situace bez řešení"], hints: ["15 min zpoždění > 10 min přestup = nestihnu. Hledám náhradu."] },
  { question: "Co je autentizace v informačním systému?", correctAnswer: "Ověření totožnosti uživatele — přihlášení jménem a heslem", options: ["Ověření totožnosti uživatele — přihlášení jménem a heslem", "Způsob vyhledávání dat", "Záloha dat IS", "Typ databáze"], hints: ["Autentizace = IS ověří, kdo jsi (jméno + heslo)."] },
  { question: "Proč má každý žák v školním IS jiné přístupové údaje?", correctAnswer: "Každý žák vidí jen svá data — jiný žák nemůže vidět moje známky", options: ["Každý žák vidí jen svá data — jiný žák nemůže vidět moje známky", "Sdílené přístupy by zrychlily IS", "Přístupy jsou přiřazeny náhodně", "Všichni žáci mohou sdílet heslo"], hints: ["Unikátní přihlašovací údaje = soukromí dat každého žáka."] },
  { question: "Jaký je rozdíl mezi výpůjčkou a rezervací v knihovním IS?", correctAnswer: "Výpůjčka = kniha je fyzicky půjčena; rezervace = zamluvena pro případ vrácení", options: ["Výpůjčka = kniha je fyzicky půjčena; rezervace = zamluvena pro případ vrácení", "Jsou totéž", "Rezervace = fyzické půjčení; výpůjčka = zamluvení", "Obojí probíhá jen online"], hints: ["Výpůjčka = máš ji doma; rezervace = čekáš, až ji vrátí."] },
  { question: "Proč IDOS nebo Google Mapy zobrazují jiný čas jízdy ve špičce a mimo špičku?", correctAnswer: "Dopravní IS zohledňuje hustotu provozu — ve špičce je doprava pomalejší", options: ["Dopravní IS zohledňuje hustotu provozu — ve špičce je doprava pomalejší", "IS chybně počítá čas", "Mimo špičku jede vlak rychleji", "Čas jízdy je vždy stejný"], hints: ["Špička = dopravní zácpy = delší doba jízdy."] },
  { question: "Co se stane, pokud v IS zadám neexistující ISBN knihy?", correctAnswer: "IS nenajde žádný záznam — zobrazí 'žádné výsledky'", options: ["IS nenajde žádný záznam — zobrazí 'žádné výsledky'", "IS vytvoří nový záznam", "IS zobrazí podobné knihy automaticky", "IS spadne"], hints: ["Neexistující ISBN = žádná shoda v databázi = žádné výsledky."] },
  { question: "Proč jsou informační tabule na zastávkách MHD propojeny s centrálním IS?", correctAnswer: "Tabule zobrazují aktuální data z centrálního IS — zpoždění, změny se projeví okamžitě", options: ["Tabule zobrazují aktuální data z centrálního IS — zpoždění, změny se projeví okamžitě", "Tabule fungují nezávisle bez připojení", "Tabule zobrazují jen statický jízdní řád", "Tabule se aktualizují jen ráno"], hints: ["Propojení s IS = aktuální data v reálném čase na všech tabulích."] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const INFORMACNISYSTEMVESKOLEKNIHOVNEDOPRAVE: TopicMetadata[] = [
  {
    id: "g5-informatika-informacni-systemy-informacni-systemy-v-zivote-informacni-system-ve-skole-knihovne-doprave",
    rvpNodeId: "g5-informatika-informacni-systemy-informacni-systemy-v-zivote-informacni-system-ve-skole-knihovne-doprave",
    title: "Informační systém ve škole, knihovně, dopravě",
    studentTitle: "Informační systémy",
    subject: "informatika",
    category: "Informační systémy",
    topic: "Informační systémy v životě",
    briefDescription: "Pochopíš, jak fungují informační systémy v životě.",
    keywords: ["informační systém", "Bakaláři", "IDOS", "GPS", "knihovní katalog", "výpůjčka", "rezervace", "IS"],
    goals: [
      "Rozumí, co je informační systém a k čemu slouží.",
      "Uvede příklady IS ve škole, knihovně a dopravě.",
      "Vyhledá informace v jednoduchém IS (katalog, jízdní řád).",
    ],
    boundaries: ["Návrh databází a IS", "Programování IS", "Bezpečnost IS na úrovni serveru"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "IS = sbírá, ukládá a vydává informace. Školní IS: Bakaláři (známky, rozvrh). Knihovní IS: katalog, výpůjčky. Dopravní IS: IDOS, GPS, tabule.",
      steps: [
        "Určím, jaký typ IS potřebuji (školní, knihovní, dopravní).",
        "Přihlásím se nebo zadám klíčové slovo do vyhledávacího pole.",
        "Filtruji nebo seřadím výsledky.",
        "Použiji nalezené informace (rezervuji knihu, vyberu spoj).",
      ],
      commonMistake: "Záměna rezervace a výpůjčky — výpůjčka = mám knihu doma; rezervace = čekám, až ji někdo vrátí.",
      example: "Bakaláři: rodič zjistí známky. IDOS: žák najde vlak Praha–Brno. Knihovní IS: hledám knihu podle autora.",
    },
  },
];
