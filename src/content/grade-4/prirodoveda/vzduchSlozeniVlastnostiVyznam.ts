/**
 * Přírodověda 4. ročník — Vzduch: složení, vlastnosti, význam.
 *
 * Přepsáno 2026-09-11. Původní pool si v `boundaries` vylučoval chemické
 * vzorce, a přesto je měl skoro v každé odpovědi (O₂, N₂, CO₂). Dál
 * obsahoval hektopascaly, Coriolisovu sílu, troposféru a stratosféru,
 * teplotní inverzi, ozonovou vrstvu a fotochemický smog — látku
 * 2. stupně. Úlohy neměly nápovědu, vysvětlení ani diagnostiku.
 *
 * Gradace:
 *  • L1 — složení vzduchu slovy (kyslík, dusík, oxid uhličitý), vlastnosti,
 *         vítr, přístroje.
 *  • L2 — pokusy a jevy kolem nás: svíčka pod sklenicí, hašení, teplý vzduch
 *         stoupá, dýchání na horách, co mění vzduch.
 *  • L3 — úvahy: proč nedýcháme dusík, proč foukáme do ohně, co kdyby nebyly
 *         rostliny, proč je v podkroví teplo.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "./_shared";

const POOL_L1: PracticeTask[] = [
  choice("Který plyn ze vzduchu potřebujeme k dýchání?", "Kyslík", [
    { value: "Dusík", why: "Dusíku je ve vzduchu nejvíc, ale tělo ho při dýchání nevyužije." },
    { value: "Oxid uhličitý", why: "Oxid uhličitý naopak vydechujeme, tělo se ho zbavuje." },
    { value: "Vodní pára", why: "Vodní pára je ve vzduchu taky, ale k dýchání ji nepotřebujeme." },
  ], {
    hints: ["Bez tohoto plynu nevydržíš ani pár minut.", "Je to stejný plyn, který potřebuje oheň, aby hořel. Vyrábějí ho zelené rostliny."],
    explanation: "K dýchání potřebujeme kyslík. Plíce ho vezmou ze vzduchu a krev ho roznese po těle. Tvoří asi pětinu vzduchu.",
  }),
  choice("Který plyn vzniká v našem těle a vydechujeme ho?", "Oxid uhličitý", [
    { value: "Kyslík", why: "Kyslík vdechujeme, tělo ho spotřebovává." },
    { value: "Dusík", why: "Dusík vdechneme a stejně ho vydechneme. V těle nevzniká." },
    { value: "Vodík", why: "Vodík v těle nevzniká a nevydechujeme ho." },
  ], {
    hints: ["Je to odpad, kterého se tělo zbavuje dechem.", "Tenhle plyn naopak potřebují rostliny, aby si vyrobily potravu. A dělají se s ním bublinky v minerálce."],
    explanation: "Když tělo spotřebuje kyslík, vzniká oxid uhličitý. Tělo se ho zbavuje výdechem. Rostliny ho pak ze vzduchu berou.",
  }),
  choice("Jakou barvu má čistý vzduch?", "Je bezbarvý", [
    { value: "Je modrý", why: "Obloha vypadá modře kvůli rozptylu světla, ale vzduch v pokoji je bezbarvý." },
    { value: "Je bílý", why: "Bílé jsou mraky nebo mlha — to jsou kapičky vody, ne vzduch." },
    { value: "Je šedý", why: "Šedý může být znečištěný vzduch nebo kouř. Čistý vzduch barvu nemá." },
  ], {
    hints: ["Vidíš vzduch v pokoji?", "Díváš se skrz vzduch na všechno kolem a nic ti ho nezbarví. Jakou barvu tedy má?"],
    explanation: "Čistý vzduch je bezbarvý a průhledný, proto ho nevidíme. Modrá obloha vzniká tím, jak se ve vzduchu rozptyluje sluneční světlo.",
  }),
  choice("Kterého plynu je ve vzduchu nejvíc?", "Dusíku", [
    { value: "Kyslíku", why: "Kyslík tvoří jen asi pětinu vzduchu. Nejvíc je dusíku." },
    { value: "Oxidu uhličitého", why: "Oxidu uhličitého je ve vzduchu jen nepatrně." },
    { value: "Vodní páry", why: "Vodní páry je ve vzduchu málo a její množství se mění." },
  ], {
    hints: ["Není to plyn, který dýcháme.", "Tvoří skoro čtyři pětiny vzduchu, ale tělo ho nevyužije. Vdechneme ho a zase vydechneme."],
    explanation: "Nejvíc je ve vzduchu dusíku, skoro čtyři pětiny. Kyslíku je asi pětina a ostatních plynů jen trochu.",
  }),
  choice("Jaká část vzduchu je kyslík?", "Asi pětina", [
    { value: "Asi polovina", why: "Kyslíku je méně než polovina, jen asi pětina." },
    { value: "Skoro všechen", why: "Většinu vzduchu tvoří dusík, ne kyslík." },
    { value: "Jen nepatrná část", why: "Nepatrně je oxidu uhličitého. Kyslíku je asi pětina." },
  ], {
    hints: ["Rozděl vzduch v duchu na pět stejných dílů.", "Čtyři díly z pěti jsou dusík. Kolik dílů zbývá na kyslík?"],
    explanation: "Kyslík tvoří asi pětinu vzduchu. Zbylé čtyři pětiny jsou skoro celé dusík. To stačí, abychom mohli dýchat.",
  }),
  choice("Co je vítr?", "Proudící vzduch", [
    { value: "Vodní pára ve výšce", why: "Vodní pára ve výšce tvoří mraky. Vítr je pohyb vzduchu." },
    { value: "Kouř z komínů", why: "Kouř vítr jen unáší. Vítr je pohybující se vzduch." },
    { value: "Elektřina v bouřce", why: "Elektřina v bouřce je blesk. Vítr je pohyb vzduchu." },
  ], {
    hints: ["Vítr nevidíš, ale cítíš ho na tváři.", "Když se nic nehýbe, je bezvětří. Co se musí stát s tím, co dýcháš, aby ti na tváři zafoukal vítr?"],
    explanation: "Vítr je vzduch, který se pohybuje. Nevidíme ho, ale cítíme ho a vidíme, jak ohýbá stromy a žene mraky.",
  }),
  choice("Bez kterého plynu nemůže nic hořet?", "Bez kyslíku", [
    { value: "Bez dusíku", why: "Dusík hoření nepomáhá. Oheň potřebuje kyslík." },
    { value: "Bez oxidu uhličitého", why: "Oxid uhličitý oheň naopak dusí — používá se v hasicích přístrojích." },
    { value: "Bez vodní páry", why: "Voda oheň hasí, hoření nepomáhá." },
  ], {
    hints: ["Oheň potřebuje ze vzduchu totéž co ty při dýchání.", "Když svíčku přikryješ sklenicí, po chvíli zhasne. Který plyn pod sklenicí došel?"],
    explanation: "K hoření je potřeba kyslík. Proto oheň zhasne, když ho přikryjeme — kyslík se spotřebuje a nový se k ohni nedostane.",
  }),
  choice("Který plyn ze vzduchu potřebují rostliny, aby si vyrobily potravu?", "Oxid uhličitý", [
    { value: "Kyslík", why: "Kyslík rostliny při výrobě potravy naopak vydávají." },
    { value: "Dusík", why: "Dusík ze vzduchu rostliny při výrobě potravy nepoužívají." },
    { value: "Kouř", why: "Kouř rostlinám škodí." },
  ], {
    hints: ["Je to plyn, který my vydechujeme.", "Rostliny a lidé si pomáhají: my vydechujeme plyn, který rostliny potřebují, a ony vydávají plyn, který dýcháme my."],
    explanation: "Rostliny berou ze vzduchu oxid uhličitý a s vodou a světlem z něj v listech vyrábějí potravu. Přitom vydávají kyslík.",
  }),
  choice("Jak se jmenuje vzduchový obal Země?", "Atmosféra", [
    { value: "Ozvěna", why: "Ozvěna je odražený zvuk." },
    { value: "Oceán", why: "Oceán je obrovská vodní plocha, ne vzduchový obal." },
    { value: "Obzor", why: "Obzor je čára, kde se zdánlivě stýká nebe se zemí." },
  ], {
    hints: ["Je to slovo, které se často říká i o náladě („v místnosti je dobrá …“).", "Vzduch obaluje celou Zemi jako slupka. Čím výš, tím je řidší. Jak se ta vrstva jmenuje?"],
    explanation: "Atmosféra je vzduchový obal Země. Chrání nás, drží teplo a vzniká v ní počasí. Čím výš, tím je vzduch řidší.",
  }),
  choice("Dá se vzduch stlačit do menšího prostoru?", "Ano, proto se dá nafouknout míč", [
    { value: "Ne, vzduch se stlačit nedá", why: "Vzduch se stlačit dá — pumpičkou ho natlačíš do míče." },
    { value: "Jen v létě, když je teplo", why: "Vzduch se dá stlačit kdykoli." },
    { value: "Jen kyslík, ostatní plyny ne", why: "Stlačit se dají všechny plyny ve vzduchu." },
  ], {
    hints: ["Co děláš pumpičkou, když nafukuješ kolo?", "Do pneumatiky se vejde mnohem víc vzduchu, než by se zdálo. Co s ním pumpička udělá?"],
    explanation: "Vzduch se dá stlačit. Pumpička ho natlačí do míče nebo pneumatiky a stlačený vzduch pak tlačí na stěny a drží tvar.",
  }),
  choice("Čím změříš, jak teplý je venku vzduch?", "Teploměrem", [
    { value: "Barometrem", why: "Barometr měří tlak vzduchu, ne teplotu." },
    { value: "Větrnou korouhví", why: "Korouhev ukazuje, odkud fouká vítr." },
    { value: "Srážkoměrem", why: "Srážkoměr měří, kolik napršelo." },
  ], {
    hints: ["Ten přístroj ukazuje stupně Celsia.", "Visí za oknem a podle něj se rozhoduješ, jestli si vzít bundu. Jak se jmenuje?"],
    explanation: "Teplotu vzduchu měří teploměr ve stupních Celsia. Tlak měří barometr a směr větru ukazuje korouhev.",
  }),
  choice("Co v přírodě vyrábí kyslík?", "Zelené rostliny", [
    { value: "Zvířata", why: "Zvířata kyslík spotřebovávají, nevyrábějí ho." },
    { value: "Auta", why: "Auta kyslík spalují a znečišťují vzduch." },
    { value: "Kameny", why: "Kameny kyslík nevyrábějí." },
  ], {
    hints: ["Proč se říká, že lesy jsou plíce Země?", "Listy zachycují světlo a vyrábějí potravu. Přitom do vzduchu vypouštějí plyn, který dýcháme."],
    explanation: "Kyslík vyrábějí zelené rostliny — stromy, trávy i drobné řasy v moři. Při výrobě potravy ho vypouštějí do vzduchu.",
  }),
  choice("Který přístroj ukazuje, odkud fouká vítr?", "Větrná korouhev", [
    { value: "Teploměr", why: "Teploměr měří teplotu vzduchu." },
    { value: "Barometr", why: "Barometr měří tlak vzduchu." },
    { value: "Kompas", why: "Kompas ukazuje sever, ne směr větru." },
  ], {
    hints: ["Bývá na střechách a věžích a otáčí se.", "Plechový kohout nebo šipka na věži kostela se natočí podle větru. Jak se takové zařízení jmenuje?"],
    explanation: "Větrná korouhev se natočí podle toho, odkud vítr fouká. Bývá na střechách a věžích, často ve tvaru kohouta.",
  }),
];

const POOL_L2: PracticeTask[] = [
  choice("Proč svíčka pod přiklopenou sklenicí po chvíli zhasne?", "Spotřebuje kyslík, který pod sklenicí byl", [
    { value: "Sklenice ji zchladí", why: "Sklenice se naopak ohřeje. Svíčce dojde kyslík." },
    { value: "Vzduch pod sklenicí se vypaří", why: "Vzduch se nevypařuje. Oheň spotřebuje kyslík." },
    { value: "Svíčce dojde vosk", why: "Vosku zbývá dost. Svíčka zhasne kvůli kyslíku." },
  ], {
    hints: ["Co potřebuje oheň ze vzduchu?", "Pod sklenicí je jen trochu vzduchu a nový se tam nedostane. Co z něj plamen postupně spotřebuje?"],
    explanation: "Plamen spotřebovává kyslík ze vzduchu. Pod sklenicí je ho jen trochu a nový se k plameni nedostane, takže svíčka zhasne.",
  }),
  choice("Proč se malý oheň uhasí přikrytím dekou nebo pískem?", "K ohni se nedostane kyslík", [
    { value: "Deka oheň zmáčkne silou", why: "Nejde o sílu. Deka zabrání přístupu vzduchu." },
    { value: "Písek oheň navlhčí", why: "Suchý písek oheň nenavlhčí. Zakryje ho a zamezí přístupu vzduchu." },
    { value: "Deka i písek oheň zchladí ledem", why: "Deka ani písek led neobsahují. Oheň zhasne bez kyslíku." },
  ], {
    hints: ["Vzpomeň si na svíčku pod sklenicí.", "Deka i písek oheň přikryjí jako víko. Co se pak k plamenům nedostane?"],
    explanation: "Oheň potřebuje kyslík. Deka nebo písek oheň zakryjí a vzduch se k němu nedostane, takže zhasne. Proto se tak hasí třeba hořící pánev.",
  }),
  choice("Jak se liší vzduch, který vydechujeme, od vdechovaného?", "Má méně kyslíku a víc oxidu uhličitého", [
    { value: "Má víc kyslíku", why: "Kyslík tělo spotřebuje, takže ve výdechu ho je méně." },
    { value: "Je úplně stejný", why: "Tělo si z něj kyslík vezme a přidá oxid uhličitý." },
    { value: "Nemá v sobě žádný kyslík", why: "Nějaký kyslík ve výdechu zůstane, proto funguje dýchání z úst do úst." },
  ], {
    hints: ["Co si tělo ze vzduchu vezme a co do něj přidá?", "Plíce si z nádechu vezmou kyslík a vrátí do vzduchu odpad z těla. Jak se tedy výdech liší?"],
    explanation: "Tělo si ze vzduchu vezme část kyslíku a přidá do něj oxid uhličitý. Vydechovaný vzduch má proto méně kyslíku a víc oxidu uhličitého. Dusíku je v něm stejně.",
  }),
  choice("Proč teplý vzduch stoupá vzhůru?", "Je lehčí než studený vzduch", [
    { value: "Přitahuje ho Slunce", why: "Slunce vzduch nepřitahuje. Teplý vzduch je prostě lehčí." },
    { value: "Tlačí ho nahoru vítr", why: "Teplý vzduch stoupá i v bezvětří, třeba nad radiátorem." },
    { value: "Teplý klesá a studený stoupá", why: "Je to naopak. Teplý vzduch stoupá, studený klesá." },
  ], {
    hints: ["Kde je v pokoji tepleji — u stropu, nebo u podlahy?", "Nad radiátorem se vzduch ohřeje a vystoupá ke stropu, studený se drží dole. Co z toho plyne o jeho váze?"],
    explanation: "Když se vzduch ohřeje, roztáhne se a stane se lehčím. Proto stoupá vzhůru a studený vzduch klesá dolů.",
  }),
  choice("Jak vzniká vítr?", "Slunce nestejně ohřeje vzduch a ten se pohne", [
    { value: "Stromy mávají větvemi a ženou vzduch", why: "Stromy se kývají, protože fouká vítr, ne naopak." },
    { value: "Vítr vyrábějí mraky na obloze", why: "Mraky vítr nevyrábějí, vítr je unáší." },
    { value: "Vzduch roztáčí Měsíc svou silou", why: "Měsíc vítr nezpůsobuje. Způsobuje ho nestejně ohřátý vzduch." },
  ], {
    hints: ["Co dělá teplý vzduch a co studený?", "Nad slunečným polem se vzduch ohřeje a stoupá, na jeho místo se odjinud nahrne chladnější vzduch. Co cítíš?"],
    explanation: "Slunce ohřívá zem a vzduch nestejně. Teplý vzduch stoupá a na jeho místo proudí chladnější. Tento pohyb vzduchu cítíme jako vítr.",
  }),
  choice("Proč se ve vysokých horách hůř dýchá?", "Vzduch je řidší a v nádechu je méně kyslíku", [
    { value: "Na horách je vzduch jedovatý", why: "Horský vzduch bývá čistý. Jen je ho v nádechu méně." },
    { value: "Na horách je vzduch hustší", why: "Je to naopak — nahoře je vzduch řidší." },
    { value: "Na horách chybí dusík", why: "Dusík k dýchání nepotřebujeme. Problém je méně kyslíku." },
  ], {
    hints: ["Čím výš, tím je vzduchu nad námi méně. Jaký je tam?", "Na vrcholu hory je vzduchu kolem tebe méně. Když se nadechneš, naplníš plíce stejně, ale kolik kyslíku v tom nádechu je?"],
    explanation: "Čím výš, tím je vzduch řidší. Při každém nádechu se do plic dostane méně kyslíku, a tak se na vysokých horách rychleji zadýcháme.",
  }),
  choice("Co je smog?", "Znečištěný vzduch nad městem", [
    { value: "Zvláštní druh mraku", why: "Mraky jsou z kapiček vody. Smog tvoří hlavně škodliviny ve vzduchu." },
    { value: "Vzduch od moře", why: "Mořský vzduch je čistý a vlhký. Smog je znečištěný." },
    { value: "Velmi silný vítr", why: "Silný vítr smog naopak rozfouká." },
  ], {
    hints: ["Smog škodí zdraví a vzniká tam, kde jezdí mnoho aut.", "Za bezvětří se mezi domy drží šedý opar z výfuků a komínů a špatně se dýchá. Jak se mu říká?"],
    explanation: "Smog je znečištěný vzduch nad městem — výfukové plyny a kouř z komínů se za bezvětří nemají kam rozptýlit. Škodí hlavně dýchacím cestám.",
  }),
  choice("Co znečišťuje vzduch ve městech nejvíc?", "Výfuky aut a kouř z komínů", [
    { value: "Stromy v parcích", why: "Stromy vzduch naopak čistí a vyrábějí kyslík." },
    { value: "Vodní pára z řek", why: "Vodní pára vzduch neznečišťuje." },
    { value: "Déšť a sníh", why: "Déšť a sníh vzduch naopak pročistí." },
  ], {
    hints: ["Co ve městě pořád spaluje palivo?", "Auta spalují benzín a naftu a domy v zimě topí. Kam jde to, co přitom vzniká?"],
    explanation: "Vzduch ve městech znečišťují hlavně výfukové plyny aut a kouř z komínů domů a továren. Stromy a déšť ho naopak čistí.",
  }),
  choice("Jak rostliny mění vzduch?", "Berou oxid uhličitý a vydávají kyslík", [
    { value: "Berou kyslík a vydávají dusík", why: "Dusík rostliny nevydávají. Vydávají kyslík." },
    { value: "Vzduch nijak nemění", why: "Rostliny vzduch mění hodně — vyrábějí většinu kyslíku." },
    { value: "Vyrábějí z něj vodu", why: "Vodu rostliny berou kořeny. Ze vzduchu berou oxid uhličitý." },
  ], {
    hints: ["Čím si rostliny a lidé navzájem pomáhají?", "Rostlina vezme plyn, který vydechujeme, a vrátí plyn, který potřebujeme k dýchání. Který je který?"],
    explanation: "Rostliny berou ze vzduchu oxid uhličitý, vyrábějí z něj potravu a vydávají kyslík. Proto jsou lesy a parky pro vzduch tak důležité.",
  }),
  choice("Proč je důležité místnost pravidelně větrat?", "Vydýchaný vzduch se vymění za čerstvý", [
    { value: "Aby se místnost ohřála", why: "Větráním se místnost spíš ochladí. Důvod je čerstvý vzduch." },
    { value: "Aby z pokoje odešel dusík", why: "Dusík nevadí, je ho venku stejně. Vadí vydýchaný vzduch." },
    { value: "Aby kyslík odešel ven", why: "Kyslík naopak potřebujeme dovnitř." },
  ], {
    hints: ["Co se stane se vzduchem v pokoji, kde spí několik lidí a okna jsou zavřená?", "Lidé dýcháním spotřebují kyslík a přidají oxid uhličitý. Jak dostat do pokoje nový vzduch?"],
    explanation: "V zavřené místnosti ubývá kyslíku a přibývá oxidu uhličitého, začne bolet hlava a jsme unavení. Větráním vydýchaný vzduch vyměníme za čerstvý.",
  }),
  choice("Z ponořené prázdné láhve stoupají bubliny. Co dokazují?", "Že v láhvi byl vzduch", [
    { value: "Že voda vře", why: "Voda nevře, je studená. Bubliny jsou vzduch z láhve." },
    { value: "Že je láhev děravá", why: "Bubliny vycházejí hrdlem, když voda vytlačí vzduch." },
    { value: "Že voda vyrábí kyslík", why: "Voda kyslík nevyrábí. Bubliny jsou vzduch, který v láhvi byl." },
  ], {
    hints: ["Byla ta láhev opravdu prázdná?", "Voda vtéká dovnitř a něco neviditelného vytlačuje ven. Čím byla ta „prázdná“ nádoba doopravdy plná?"],
    explanation: "„Prázdná“ láhev je plná vzduchu. Když ji ponoříš, voda vtéká dovnitř a vzduch vytlačí — ten stoupá jako bubliny. Vzduch tedy zabírá místo.",
  }),
  choice("Proč se nafouknutý míč v mrazu trochu splácne?", "Studený vzduch zabere méně místa", [
    { value: "Vzduch v mrazu zmrzne na led", why: "Vzduch v běžném mrazu nezmrzne. Jen se zmenší." },
    { value: "Vzduch unikne kůží míče", why: "Míč se po zahřátí zase napne, takže vzduch neutekl." },
    { value: "Mráz míč stlačí zvenku", why: "Mráz netlačí. Vzduch uvnitř se ochladí a zmenší." },
  ], {
    hints: ["Co se stane s tím míčem, když ho doneseš zpátky do tepla?", "V teple se míč zase napne. Takže vzduch neutekl. Co se s ním v mrazu stalo?"],
    explanation: "Když se vzduch ochladí, zabere méně místa, a míč povolí. V teple se vzduch zase roztáhne a míč se napne. Proto se pneumatiky v zimě dofukují.",
  }),
  choice("Proč se roztočí lopatky větrné elektrárny?", "Proudící vzduch do nich tlačí", [
    { value: "Otáčí je elektřina ze sítě", why: "Elektrárna elektřinu vyrábí, lopatky nepohání síť." },
    { value: "Otáčí je sluneční světlo", why: "Světlo lopatky neroztočí. Tlačí do nich vítr." },
    { value: "Otáčí je voda z řeky", why: "Voda pohání vodní elektrárnu. Větrnou pohání vítr." },
  ], {
    hints: ["Kdy se lopatky netočí?", "Za bezvětří stojí. Když fouká, točí se. Co tedy do lopatek tlačí?"],
    explanation: "Vítr je proudící vzduch a má sílu. Tlačí do lopatek větrné elektrárny a roztočí je, a elektrárna z toho pohybu vyrábí elektřinu.",
  }),
];

const POOL_L3: PracticeTask[] = [
  choice("Dusíku je ve vzduchu nejvíc. Proč ho přesto nepotřebujeme k dýchání?", "Tělo ho nevyužije a zase ho vydechne", [
    { value: "Dusík je jedovatý", why: "Dusík jedovatý není, dýcháme ho celý život. Tělo ho jen nevyužije." },
    { value: "Dusíku je ve vzduchu málo", why: "Je to naopak, dusíku je ve vzduchu nejvíc." },
    { value: "Dusík dýchají jen rostliny", why: "Rostliny dusík ze vzduchu k dýchání nepoužívají." },
  ], {
    hints: ["Kolik dusíku vdechneme a kolik vydechneme?", "Ve výdechu je dusíku stejně jako v nádechu. Co to prozrazuje o tom, jestli ho tělo spotřebovalo?"],
    explanation: "Dusík vdechneme a hned zase vydechneme — tělo ho nijak nevyužije. K dýchání potřebujeme kyslík, i když ho je ve vzduchu méně.",
  }),
  choice("Proč létá horkovzdušný balón?", "Ohřátý vzduch v něm je lehčí než okolní", [
    { value: "Je naplněný kyslíkem", why: "Balón se plní obyčejným vzduchem, který se ohřeje hořákem." },
    { value: "Nahoru ho táhne vítr", why: "Vítr balón unáší do strany. Nahoru ho zvedne ohřátý vzduch." },
    { value: "Hořák ho tlačí plamenem", why: "Plamen balón netlačí, jen ohřívá vzduch uvnitř." },
  ], {
    hints: ["Co dělá teplý vzduch v pokoji?", "Hořák ohřívá vzduch uvnitř obalu. Teplý vzduch je lehčí a stoupá — a co vezme s sebou?"],
    explanation: "Hořák ohřeje vzduch v obalu balónu. Teplý vzduch je lehčí než studený kolem, a tak stoupá a zvedne balón i s košem. Když vzduch vychladne, balón klesá.",
  }),
  choice("Proč se do žhavých uhlíků fouká, když má oheň znovu vzplanout?", "K ohni se tak dostane víc kyslíku", [
    { value: "Dech oheň ochladí", why: "Ochlazení by oheň spíš uhasilo. Pomáhá přívod kyslíku." },
    { value: "Z úst jde do ohně dusík a ten hoří", why: "Dusík nehoří. Foukáním přivádíš čerstvý vzduch s kyslíkem." },
    { value: "Dech je vlhký a oheň podpoří", why: "Vlhkost oheň naopak tlumí." },
  ], {
    hints: ["Co oheň potřebuje ze vzduchu?", "Kolem uhlíků je vzduch, ze kterého oheň kyslík už spotřeboval. Co se změní, když k nim fouknutím doženeš čerstvý?"],
    explanation: "Oheň potřebuje kyslík. Foukáním doženeš k uhlíkům čerstvý vzduch a víc kyslíku, a tak oheň znovu vzplane. Proto se používá i měch.",
  }),
  choice("Proč se hasicí přístroje často plní oxidem uhličitým?", "Vytlačí od ohně kyslík, takže oheň zhasne", [
    { value: "Oxid uhličitý hoří lépe", why: "Oxid uhličitý nehoří, naopak oheň dusí." },
    { value: "Oxid uhličitý oheň rozdrtí", why: "Plyn oheň nedrtí. Zamezí přístupu kyslíku." },
    { value: "Oxid uhličitý přinese vodu", why: "Hasicí přístroj s tímto plynem vodu neobsahuje." },
  ], {
    hints: ["Co potřebuje oheň a co mu hasicí přístroj vezme?", "Plyn z přístroje obklopí oheň jako neviditelná deka. Který plyn se pak k plamenům nedostane?"],
    explanation: "Oxid uhličitý nehoří a je těžší než vzduch. Obklopí oheň a vytlačí od něj kyslík, takže oheň zhasne. Navíc ho ochladí.",
  }),
  choice("Proč musí do akvárka bublat vzduch?", "Z bublin se do vody dostává kyslík", [
    { value: "Bubliny rybky krmí", why: "Bubliny nejsou potrava. Dodávají do vody kyslík." },
    { value: "Bubliny vodu ohřívají", why: "Vodu ohřívá topítko. Bubliny přinášejí kyslík." },
    { value: "Bubliny odhánějí dusík", why: "O dusík nejde. Rybky potřebují kyslík rozpuštěný ve vodě." },
  ], {
    hints: ["Co rybky potřebují, aby mohly dýchat žábrami?", "Ryby dýchají kyslík rozpuštěný ve vodě. V malém akváriu ho brzy spotřebují. Jak ho do vody dostat?"],
    explanation: "Ryby dýchají žábrami kyslík rozpuštěný ve vodě. V akváriu ho rychle spotřebují, a tak se tam vhání vzduch — z bublin se kyslík rozpouští do vody.",
  }),
  choice("Proč jsou lesy a parky pro vzduch ve městě důležité?", "Vyrábějí kyslík a zachytí prach", [
    { value: "Vyrábějí oxid uhličitý", why: "Stromy oxid uhličitý naopak ze vzduchu berou." },
    { value: "Úplně zastaví vítr", why: "Stromy vítr zbrzdí, ale nezastaví. Hlavní je kyslík a čistý vzduch." },
    { value: "Na vzduch vliv nemají", why: "Mají velký vliv — vyrábějí kyslík a na listech zachytí prach." },
  ], {
    hints: ["Co stromy ze vzduchu berou a co do něj vracejí?", "Listy berou oxid uhličitý a vydávají kyslík. A na jejich povrchu se usazuje něco, co by jinak létalo vzduchem."],
    explanation: "Stromy berou oxid uhličitý a vyrábějí kyslík. Na listech se zachytí prach a v létě stromy ochladí okolí. Proto se ve městech vysazují parky a aleje.",
  }),
  choice("Kdyby na Zemi nebyly zelené rostliny, co by se stalo se vzduchem?", "Kyslíku by postupně ubývalo", [
    { value: "Kyslíku by přibývalo", why: "Kyslík vyrábějí rostliny. Bez nich by ho ubývalo." },
    { value: "Vzduch by se nezměnil", why: "Zvířata a oheň kyslík spotřebovávají. Bez rostlin by ho nikdo nedoplňoval." },
    { value: "Zmizel by všechen dusík", why: "Dusík by zůstal. Ubývalo by kyslíku." },
  ], {
    hints: ["Kdo kyslík vyrábí a kdo ho spotřebovává?", "Zvířata, lidé i oheň kyslík pořád spotřebovávají. Kdyby ho nikdo nedoplňoval, co by se s jeho množstvím dělo?"],
    explanation: "Kyslík do vzduchu doplňují zelené rostliny. Zvířata, lidé i oheň ho spotřebovávají. Bez rostlin by kyslíku ubývalo a život by nakonec nebyl možný.",
  }),
  choice("Proč je v létě v podkroví horko a ve sklepě chladno?", "Teplý vzduch stoupá, studený klesá", [
    { value: "Podkroví je blíž Slunci", why: "Rozdíl pár metrů od Slunce nic neznamená. Rozhoduje, kam stoupá teplý vzduch." },
    { value: "Sklep je blíž středu Země", why: "Sklep chladí okolní zem, ale hlavně tam klesá studený vzduch." },
    { value: "Ve sklepě je víc dusíku", why: "Složení vzduchu je všude stejné. Liší se teplota." },
  ], {
    hints: ["Kde je v létě v domě největší horko a kde je chladno?", "Vzpomeň si na horkovzdušný balón a na to, kde je v zimě chladno u nohou. Kde se v domě shromáždí teplo a kde chlad?"],
    explanation: "Teplý vzduch je lehčí a stoupá do nejvyššího patra, studený klesá dolů. Navíc na střechu praží slunce a sklep chladí okolní zem.",
  }),
  choice("Proč vzduch v pneumatice unese celé auto?", "Stlačený vzduch silně tlačí do stěn", [
    { value: "Pneumatika je uvnitř z kovu", why: "Pneumatika je z gumy. Auto nese stlačený vzduch." },
    { value: "Vzduch je těžší než auto", why: "Vzduch je velmi lehký. Nese auto, protože je stlačený." },
    { value: "Auto stojí jen na ráfcích", why: "Když je pneumatika prázdná, auto sedne na ráfky. Plná ho unese." },
  ], {
    hints: ["Co se stane s autem, když pneumatika spustí vzduch?", "Pumpa natlačí do pneumatiky hodně vzduchu. Ten se chce roztáhnout a tlačí do gumy ze všech stran."],
    explanation: "Do pneumatiky je natlačeno hodně stlačeného vzduchu. Ten silně tlačí do stěn ze všech stran a udrží tvar pneumatiky i pod těžkým autem.",
  }),
  choice("Proč dýcháme rychleji, když běháme?", "Svaly potřebují víc kyslíku", [
    { value: "Tělo potřebuje víc dusíku", why: "Dusík tělo nevyužije. Svaly potřebují kyslík." },
    { value: "Abychom se dechem ochladili", why: "Tělo se ochlazuje hlavně pocením. Rychlý dech přivádí kyslík." },
    { value: "Aby se vydýchal všechen vzduch", why: "Vzduch nedojde. Svaly jen spotřebují víc kyslíku." },
  ], {
    hints: ["Co svaly při běhu spotřebovávají víc než při sezení?", "Při běhu pracují nohy a ruce naplno a spotřebují hodně energie. K tomu je potřeba jeden plyn ze vzduchu. Jak ho tělo dodá víc?"],
    explanation: "Při běhu svaly pracují a spotřebují víc kyslíku. Tělo proto dýchá rychleji a srdce bije rychleji, aby kyslík ke svalům dopravilo.",
  }),
  choice("Vzduch nevidíme. Jak můžeš dokázat, že kolem nás je?", "Cítíme vítr a vzduch nafoukne balónek", [
    { value: "Vidíme ho v noci", why: "Vzduch není vidět ani v noci. Poznáme ho jinak." },
    { value: "Slyšíme, jak šumí sám od sebe", why: "Vzduch sám nešumí. Slyšíme, když se pohybuje nebo něčím hýbe." },
    { value: "Nijak, vzduch dokázat nejde", why: "Dokázat jde — cítíme vítr a vzduch zabírá místo v balónku." },
  ], {
    hints: ["Jak poznáš něco, co nevidíš?", "Vzduch sice nevidíš, ale když fouká, cítíš ho na tváři, a když foukáš do gumového pytlíku, nafoukne se. Co to dokazuje?"],
    explanation: "Vzduch nevidíme, ale cítíme ho jako vítr, nafoukne balónek a vytlačí vodu z ponořené láhve. To dokazuje, že je kolem nás a zabírá místo.",
  }),
  choice("Proč se v přeplněné třídě se zavřenými okny začne špatně soustředit?", "Ubývá kyslíku a přibývá vydýchaného vzduchu", [
    { value: "Přibývá kyslíku", why: "Lidé kyslík spotřebovávají, takže ho ubývá." },
    { value: "Lidé vydechují dusík navíc", why: "Dusíku vydechujeme stejně, kolik vdechneme." },
    { value: "Stěny pohlcují vzduch", why: "Stěny vzduch nepohlcují. Mění ho dýchání lidí." },
  ], {
    hints: ["Co dělají všichni lidé ve třídě celou dobu?", "Každý žák spotřebuje kyslík a vydechne oxid uhličitý. Co se se vzduchem v zavřené třídě po hodině stane?"],
    explanation: "Dýcháním lidé spotřebovávají kyslík a přidávají oxid uhličitý. V zavřené přeplněné třídě se vzduch zhorší, bolí hlava a hůř se soustředí. Pomůže vyvětrat.",
  }),
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool);
}

export const VZDUCHSLOZENIVLASTNOSTIVYZNAM: TopicMetadata[] = [
  {
    id: "g4-prirodoveda-rozmanitost-prirody-neziva-priroda-vzduch-slozeni-vlastnosti-vyznam",
    rvpNodeId: "g4-prirodoveda-rozmanitost-prirody-neziva-priroda-vzduch-slozeni-vlastnosti-vyznam",
    title: "Vzduch - složení, vlastnosti, význam",
    studentTitle: "Vzduch kolem nás",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Rozmanitost přírody",
    briefDescription: "Poznáš složení vzduchu a pochopíš, proč je kyslík pro nás nenahraditelný.",
    keywords: ["vzduch", "kyslík", "dusík", "oxid uhličitý", "atmosféra", "vítr", "hoření", "dýchání"],
    goals: [
      "Jmenovat hlavní složky vzduchu (dusík, kyslík, oxid uhličitý)",
      "Vysvětlit roli kyslíku pro dýchání a hoření",
      "Popsat vlastnosti vzduchu (bezbarvý, bez zápachu, stlačitelný, teplý stoupá)",
      "Vysvětlit, jak vzniká vítr a co vzduch znečišťuje",
    ],
    boundaries: [
      "Chemické vzorce (O₂, CO₂) nejsou náplní 4. ročníku",
      "Vrstvy atmosféry, tlak v hektopascalech a ozonová vrstva patří na 2. stupeň",
    ],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Vzduch je směs plynů: skoro čtyři pětiny dusíku, asi pětina kyslíku a trocha oxidu uhličitého.",
      steps: [
        "Kyslík potřebujeme k dýchání a oheň k hoření.",
        "Oxid uhličitý vydechujeme, rostliny ho berou.",
        "Teplý vzduch stoupá, studený klesá — tak vzniká vítr.",
        "Vzduch se dá stlačit a zabírá místo.",
      ],
      commonMistake: "Nejvíc je ve vzduchu dusíku, ne kyslíku.",
      example: "Svíčka pod sklenicí zhasne, protože spotřebuje kyslík.",
    },
  },
];
