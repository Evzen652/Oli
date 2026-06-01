import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL_L1: PracticeTask[] = [
  {
    question: "Co bylo cílem národního obrození?",
    correctAnswer: "Obnovit češtinu a českou kulturu",
    options: [
      "Obnovit češtinu a českou kulturu",
      "Zavést němčinu do škol",
      "Získat zpět Slezsko",
      "Vyhlásit válku Habsburkům",
    ],
    hints: ["Po Bílé hoře bylo česky psané kultuře utlačováno."],
    solutionSteps: ["Národní obrození (18.–19. stol.) usilovalo o obnovení češtiny a národní identity."],
  },
  {
    question: "Kdo sestavil první velký česko-německý slovník?",
    correctAnswer: "Josef Jungmann",
    options: ["Josef Jungmann", "František Palacký", "Karel Havlíček", "Jan Neruda"],
    hints: ["Jeho příjmení začíná na J."],
    solutionSteps: ["Josef Jungmann (1773–1847) vydal pětidílný česko-německý slovník a dějiny literatury."],
  },
  {
    question: "Jak se přezdívalo Františku Palackému?",
    correctAnswer: "Otec národa",
    options: ["Otec národa", "Učitel národů", "Hlas národa", "Syn vlasti"],
    hints: ["Napsal dějiny českého národa."],
    solutionSteps: ["Palacký byl nazýván 'Otcem národa' za své Dějiny národu českého."],
  },
  {
    question: "Čím byl František Palacký proslulý?",
    correctAnswer: "Napsal Dějiny národu českého",
    options: [
      "Napsal Dějiny národu českého",
      "Složil operu Prodaná nevesta",
      "Vydal první česky psané noviny",
      "Byl prvním prezidentem",
    ],
    hints: ["Šlo o historické dílo."],
    solutionSteps: ["Palacký sepsal monumentální Dějiny národu českého v Čechách i v Moravě."],
  },
  {
    question: "Čím byl Karel Havlíček Borovský proslulý?",
    correctAnswer: "Byl novinář a satirik, vydával Národní noviny",
    options: [
      "Byl novinář a satirik, vydával Národní noviny",
      "Byl vojenský generál",
      "Byl skladatel",
      "Byl habsburský úředník",
    ],
    hints: ["Pracoval s perem, ne se zbraní."],
    solutionSteps: ["Havlíček Borovský (1821–1856) bojoval perem — vydával noviny a psal satiry."],
  },
  {
    question: "Co se stalo Karlu Havlíčku Borovskému za jeho kritiku vlády?",
    correctAnswer: "Byl uvězněn a deportován do Brixenu v Tyrolsku",
    options: [
      "Byl uvězněn a deportován do Brixenu v Tyrolsku",
      "Byl jmenován ministrem",
      "Utekl do Paříže",
      "Dostal státní vyznamenání",
    ],
    hints: ["Kritika Habsburků měla vždy následky."],
    solutionSteps: ["Havlíček byl 1851–1855 internován v tyrolském Brixenu za kritiku absolutismu."],
  },
  {
    question: "Jakou operu složil Bedřich Smetana?",
    correctAnswer: "Prodaná nevěsta",
    options: ["Prodaná nevěsta", "Rusalka", "Libuše", "Carmen"],
    hints: ["Je to veselá opera o české vesnici."],
    solutionSteps: ["Bedřich Smetana složil Prodanou nevěstu (1866) — nejhranější českou operu."],
  },
  {
    question: "Jak se jmenuje cyklus symfonických básní Bedřicha Smetany o vlasti?",
    correctAnswer: "Má vlast",
    options: ["Má vlast", "Nová vlast", "Vltava", "Blaník"],
    hints: ["Obsahuje šest částí, z nichž nejznámější je Vltava."],
    solutionSteps: ["Má vlast (1874–1879) je cyklus 6 symfonických básní o české krajině a historii."],
  },
  {
    question: "Kdo složil Novosvětskou symfonii?",
    correctAnswer: "Antonín Dvořák",
    options: ["Antonín Dvořák", "Bedřich Smetana", "Leoš Janáček", "Zdeněk Fibich"],
    hints: ["Tato symfonie vznikla v Americe."],
    solutionSteps: ["Dvořák složil 9. symfonii 'Z Nového světa' v roce 1893 při pobytu v USA."],
  },
  {
    question: "Kdy žil Josef Jungmann?",
    correctAnswer: "1773–1847",
    options: ["1773–1847", "1592–1670", "1821–1856", "1798–1876"],
    hints: ["Narodil se v roce 1773."],
    solutionSteps: ["Josef Jungmann: 1773–1847."],
  },
  {
    question: "Proč bylo národní obrození potřebné?",
    correctAnswer: "Po Bílé hoře byla čeština potlačována germanizací",
    options: [
      "Po Bílé hoře byla čeština potlačována germanizací",
      "Čeština nikdy nebyla v ohrožení",
      "Habsburkové češtinu podporovali",
      "Češi nechtěli svůj jazyk",
    ],
    hints: ["Vzpomeň na důsledky Bílé hory 1620."],
    solutionSteps: ["Germanizace po Bílé hoře potlačila češtinu v úřadech a školách — obrození ji zachránilo."],
  },
  {
    question: "Jak se jmenuje opera Antonína Dvořáka o vodní víle?",
    correctAnswer: "Rusalka",
    options: ["Rusalka", "Prodaná nevěsta", "Libuše", "Kníže Igor"],
    hints: ["Hlavní postava žije ve vodě."],
    solutionSteps: ["Dvořák složil operu Rusalka (1900) — příběh o vodní víle a knížeti."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Proč bylo národní obrození obrannou reakcí na germanizaci?",
    correctAnswer: "Germanizace potlačila češtinu, obrození ji vědomě obnovilo v literatuře a vědě",
    options: [
      "Germanizace potlačila češtinu, obrození ji vědomě obnovilo v literatuře a vědě",
      "Germanizace češtině prospěla",
      "Obrození šlo o vojenský odpor",
      "Germanizace neexistovala",
    ],
    hints: ["Jazyk = klíč národní identity."],
    solutionSteps: ["Germanizace = nucené šíření němčiny; obrození = vědomé pěstování češtiny jako odpověď."],
  },
  {
    question: "Jak Jungmannův slovník pomohl obrozencům?",
    correctAnswer: "Ukázal bohatství češtiny a dal základ moderní vědecké terminologii",
    options: [
      "Ukázal bohatství češtiny a dal základ moderní vědecké terminologii",
      "Přeložil Bibli do němčiny",
      "Nahradil latinu jako liturgický jazyk",
      "Byl určen jen pro básníky",
    ],
    hints: ["Vědecký jazyk potřebuje přesná slova."],
    solutionSteps: ["Jungmannův česko-německý slovník obsahoval přes 120 000 hesel a pomohl budovat vědeckou češtinu."],
  },
  {
    question: "Proč je Palacký nazýván 'Otcem národa'?",
    correctAnswer: "Dal Čechům vědomí historické identity svými Dějinami",
    options: [
      "Dal Čechům vědomí historické identity svými Dějinami",
      "Byl prvním prezidentem ČSR",
      "Vyhrál válku s Pruskem",
      "Složil národní hymnu",
    ],
    hints: ["Dějiny = základ národní identity."],
    solutionSteps: ["Palackého Dějiny ukázaly, že Češi mají bohatou minulost → základ pro národ národní hrdost."],
  },
  {
    question: "Jak se lišil přístup Jungmanna a Havlíčka k obrození?",
    correctAnswer: "Jungmann obrozoval jazykově – slovník, Havlíček politicky – noviny, satira",
    options: [
      "Jungmann obrozoval jazykově (slovník), Havlíček politicky (noviny, satira)",
      "Oba se věnovali výhradně politice",
      "Jungmann psal noviny, Havlíček slovníky",
      "Neměli nic společného",
    ],
    hints: ["Uvažuj o jejich hlavním nástroji — jazyk vs. noviny."],
    solutionSteps: ["Jungmann = jazykový základ; Havlíček = politický boj perem."],
  },
  {
    question: "Jak Smetanova 'Má vlast' přispívala k národnímu vědomí?",
    correctAnswer: "Hudbou evokovala českou krajinu a historii a posilovala národní hrdost",
    options: [
      "Hudbou evokovala českou krajinu a historii a posilovala národní hrdost",
      "Byla to náboženská hudba",
      "Smetana komponoval pro habsburský dvůr",
      "Šlo o tanec bez vlasteneckého obsahu",
    ],
    hints: ["Hudba může vyjádřit to, co slova nesmí."],
    solutionSteps: ["Symfonické básně jako Vltava a Šárka zobrazovaly českou přírodu a mytologii → vlastenectví."],
  },
  {
    question: "Proč Havlíček skončil v Brixenu?",
    correctAnswer: "Kritizoval Habsburky v novinách a odmítl mlčet",
    options: [
      "Kritizoval Habsburky v novinách a odmítl mlčet",
      "Byl obviněn z krádeže",
      "Sám chtěl do Tyrolska",
      "Byl vyhnán pro špatnou češtinu",
    ],
    hints: ["Svoboda tisku neexistovala."],
    solutionSteps: ["Havlíček psal o svobodě a kritizoval absolutismus — Habsburkové ho internovali, aby umlčeli jeho hlas."],
  },
  {
    question: "Co měli společného Jungmann, Palacký a Havlíček?",
    correctAnswer: "Všichni bojovali perem za českou kulturu a národní identitu",
    options: [
      "Všichni bojovali perem za českou kulturu a národní identitu",
      "Všichni byli vojáci",
      "Všichni žili ve Vídni",
      "Všichni skládali hudbu",
    ],
    hints: ["Jejich nástrojem bylo slovo, ne meč."],
    solutionSteps: ["Slovník, dějiny, noviny — všichni tři přispívali česky psaným slovem."],
  },
  {
    question: "Proč Dvořák složil Novosvětskou symfonii v USA?",
    correctAnswer: "Byl pozván jako ředitel konzervatoře do New Yorku a inspiroval ho americký folklor",
    options: [
      "Byl pozván jako ředitel konzervatoře do New Yorku a inspiroval ho americký folklor",
      "Utekl z Čech před Habsburky",
      "USA bylo jeho rodiště",
      "Přestěhoval se natrvalo do Ameriky",
    ],
    hints: ["1892–1895 strávil Dvořák v New Yorku."],
    solutionSteps: ["Dvořák vedl 1892–1895 Národní konzervatoř v New Yorku a 9. symfonii složil tam."],
  },
  {
    question: "Jak mohla opera jako Prodaná nevěsta pomoci národnímu obrození?",
    correctAnswer: "Ukázala českou vesnici, jazyk a humor — česká kultura jako něco krásného",
    options: [
      "Ukázala českou vesnici, jazyk a humor — česká kultura jako něco krásného",
      "Opery byly zpívány německy, takže to nepomáhalo",
      "Opera sloužila jen aristokracii",
      "Smetana obrození nesouviselo",
    ],
    hints: ["Česky zpívaná opera = důkaz, že jazyk je kultivovaný."],
    solutionSteps: ["Česky zpívaná opera přiváděla do divadel vlastence a dokazovala, že čeština je rovnocenným jazykem."],
  },
  {
    question: "Co mělo v době obrození větší vliv na prostý lid — literatura nebo noviny?",
    correctAnswer: "Noviny, protože byly dostupnější a aktuálnější než knihy",
    options: [
      "Noviny, protože byly dostupnější a aktuálnější než knihy",
      "Literatura, protože noviny neexistovaly",
      "Stejný vliv — obojí bylo identické",
      "Ani jedno, lid číst neuměl",
    ],
    hints: ["Uvažuj o ceně a frekvenci vydávání."],
    solutionSteps: ["Noviny vycházely denně nebo týdně, byly levnější a dostupnější širšímu publiku."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Seřaď osobnosti národního obrození chronologicky (narozením).",
    correctAnswer: "Jungmann → Palacký → Havlíček",
    items: [
      "Josef Jungmann (1773)",
      "František Palacký (1798)",
      "Karel Havlíček Borovský (1821)",
    ],
    hints: ["Jungmann je nejstarší."],
    solutionSteps: ["Jungmann 1773 → Palacký 1798 → Havlíček 1821."],
  },
  {
    question: "Spoj osobnost s jejím hlavním přínosem.",
    correctAnswer: "Správné přiřazení",
    pairs: [
      { left: "Josef Jungmann", right: "Česko-německý slovník" },
      { left: "František Palacký", right: "Dějiny národu českého" },
      { left: "Karel Havlíček", right: "Národní noviny, satira" },
      { left: "Bedřich Smetana", right: "Má vlast, Prodaná nevěsta" },
      { left: "Antonín Dvořák", right: "Novosvětská symfonie, Rusalka" },
    ],
    hints: ["Jungmann = slovník, Palacký = dějiny."],
    solutionSteps: ["Každý obrozenci měl svou specifickou oblast — jazyk, dějiny, publicistika, hudba."],
  },
  {
    question: "Proč bylo důležité, aby Palacký napsal dějiny česky a ne německy?",
    correctAnswer: "Psaní česky samo o sobě bylo vlastenecký čin a důkaz, že čeština je vědecký jazyk",
    options: [
      "Psaní česky samo o sobě bylo vlastenecký čin a důkaz, že čeština je vědecký jazyk",
      "Německy by to nikdo nečetl",
      "Dějiny nešly napsat německy",
      "Habsburkové mu nařídili psát česky",
    ],
    hints: ["V té době se věda psala latinsky nebo německy."],
    solutionSteps: ["Psát vědecké dílo česky bylo provokací — ukázalo, že čeština dokáže vyjádřit vědu."],
  },
  {
    question: "Který výrok o národním obrození je NEPRAVDIVÝ?",
    correctAnswer: "Národní obrození usilovalo o vojenský odpor proti Habsburkům",
    options: [
      "Národní obrození usilovalo o vojenský odpor proti Habsburkům",
      "Jungmann napsal česko-německý slovník",
      "Palacký byl nazýván Otcem národa",
      "Havlíček vydával Národní noviny",
    ],
    hints: ["Obrození bylo kulturní, ne vojenské."],
    solutionSteps: ["Národní obrození bylo kulturní hnutí — perem, ne zbraní."],
  },
  {
    question: "Jak spolu souvisejí pobělohorská germanizace a národní obrození?",
    correctAnswer: "Germanizace potlačila češtinu → obrození bylo přímou reakcí a obrannou akcí",
    options: [
      "Germanizace potlačila češtinu → obrození bylo přímou reakcí a obrannou akcí",
      "Germanizace obrození způsobila zánik",
      "Obě věci jsou zcela nesouvisející",
      "Germanizace obrození podporovala",
    ],
    hints: ["Příčina → reakce."],
    solutionSteps: ["Bez pobělohorského útlaku češtiny by nebyla tak silná potřeba ji obnovit."],
  },
  {
    question: "Představ si, že žiješ v roce 1840. Jak by ses jako vlastenec mohl zapojit do obrození?",
    correctAnswer: "Číst česky psané noviny, navštěvovat česká divadla, mluvit a psát česky",
    options: [
      "Číst česky psané noviny, navštěvovat česká divadla, mluvit a psát česky",
      "Naučit se německy co nejlépe",
      "Odejít do exilu jako Komenský",
      "Vyhlásit válku Habsburkům",
    ],
    hints: ["Obrození bylo o každodenním používání češtiny."],
    solutionSteps: ["Každý, kdo mluvil, četl a psal česky a navštěvoval česká kulturní místa, přispíval k obrození."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const NARODNIOBROZENIJUNGMANNPALACKYHAVLICEK: TopicMetadata[] = [
  {
    id: "g5-vlastiveda-lide-a-cas-narodni-obrozeni-a-19-stoleti-narodni-obrozeni-jungmann-palacky-havlicek",
    rvpNodeId: "g5-vlastiveda-lide-a-cas-narodni-obrozeni-a-19-stoleti-narodni-obrozeni-jungmann-palacky-havlicek",
    title: "Národní obrození - Jungmann, Palacký, Havlíček",
    studentTitle: "Národní obrození",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "Národní obrození a 19. století",
    briefDescription: "Poznáš obrozence, kteří zachránili český jazyk a kulturu.",
    keywords: ["národní obrození", "jungmann", "palacký", "havlíček", "smetana", "dvořák", "čeština"],
    goals: [
      "Žák vysvětlí příčiny a cíle národního obrození",
      "Žák uvede přínosy Jungmanna, Palackého a Havlíčka",
      "Žák propojí kulturní dílo Smetany a Dvořáka s obrozenectvím",
    ],
    boundaries: ["Detailní jazykovědná analýza slovníku", "Hudební teorie"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "static",
    generator: gen,
    helpTemplate: {
      hint: "Jungmann = slovník, Palacký = dějiny, Havlíček = noviny.",
      steps: [
        "Příčina: germanizace po Bílé hoře",
        "Cíl: obnovit češtinu a českou kulturu",
        "Jungmann: slovník (1835–1839)",
        "Palacký: Dějiny národu českého",
        "Havlíček: Národní noviny, satira, exil v Brixenu",
      ],
      commonMistake: "Zaměňování Komenského (17. stol.) s obrozenci (18.–19. stol.).",
      example: "Palacký byl nazýván 'Otcem národa' za jeho historické dílo.",
    },
  },
];
