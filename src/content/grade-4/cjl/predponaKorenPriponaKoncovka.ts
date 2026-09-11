import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 4. ročníku). Původní pool dělil slova
// chybně: „lesní“ s příponou „-ní“ (správně přípona -n-, koncovka -í),
// „hezký“ s příponou „-ký“, „učitelka“ s „-ka“, „nejkrásnější“ s kořenem
// „krásn-“, „pohádkový“ s nulovou koncovkou, „zahrada“ jednou s kořenem
// „zahrad-“ a jindy s předponou „za-“, a obsahoval vymyšlené slovo
// „přestaveníčko“. Dělení tu odpovídá školní mluvnici 1. stupně.
//
// L1 = najdi jednu část slova · L2 = rozděl slovo, příbuzná slova,
// stejná předpona · L3 = celé dělení včetně přípony a koncovky, odvozování.

const L1: PracticeTask[] = [
  choice("Jaká je předpona ve slově „nedobrý“?", "ne-", [
    { value: "dobr", why: "„Dobr“ je kořen — mají ho i slova dobrý, dobrota." },
    { value: "-ý", why: "„-ý“ je koncovka, mění se: dobrý, dobrá, dobré." },
    { value: "ned-", why: "Písmeno d už patří do kořene dobr-." },
  ], {
    hints: ["Která část slova stojí před základem, který najdeš i ve slově „dobrý“?", "Porovnej „dobrý“ a „nedobrý“. To, co přibylo na začátku a otočilo význam, je předpona."],
    explanation: "Kořen je dobr- (dobrý, dobrota). Před ním stojí předpona ne-, která mění význam na opačný: ne-dobr-ý.",
  }),
  choice("Jaká je koncovka slova „dobrá“?", "-á", [
    { value: "dobr", why: "„Dobr“ je kořen, zůstává ve všech tvarech." },
    { value: "-rá", why: "Písmeno r patří do kořene: dobr-ý, dobr-é, dobr-á." },
    { value: "-bra", why: "„Br“ patří do kořene dobr-." },
  ], {
    hints: ["Řekni slovo v jiných tvarech: dobrý, dobré, dobrou. Která část se mění?", "Co zůstává stejné, je kořen. Koncovka je jen ta část na konci, která se při změně tvaru vymění."],
    explanation: "Dobr-ý, dobr-é, dobr-á — stejný zůstává kořen dobr-, mění se jen koncovka. Tady je to -á.",
  }),
  choice("Ve kterém slově je předpona „pod-“?", "podzemní", [
    { value: "podivný", why: "Slovo souvisí s „divit se“: po-div-n-ý. Předpona je jen po-." },
    { value: "podat", why: "Slovo souvisí s „dát“: po-da-t. Předpona je jen po-." },
    { value: "pohádka", why: "Slovo začíná na po-, nikoli na pod-." },
  ], {
    hints: ["U každého slova najdi slovo příbuzné. Co zbude, když ho odebereš ze začátku?", "Předpona „pod-“ znamená, že je něco dole, pod něčím. Ve kterém slově najdeš za „pod-“ celý kořen jiného slova?"],
    explanation: "Podzemní = pod- + zem- (to, co je pod zemí). U podivný a podat patří d ke kořeni (div-, da-) a předpona je jen po-.",
  }),
  choice("Jaká je předpona ve slově „odjezd“?", "od-", [
    { value: "o-", why: "Samotné o- nestačí — d patří k předponě od- (odjet, odnést)." },
    { value: "odj-", why: "Písmeno j patří do kořene jezd- (jezdit, příjezd)." },
    { value: "jezd", why: "„Jezd“ je kořen — najdeš ho i ve slovech příjezd, jezdit." },
  ], {
    hints: ["Která příbuzná slova znáš? Příjezd, jezdit… Co mají společné?", "Společná část příbuzných slov je kořen. To, co stojí před ním, je předpona — tady znamená směr pryč."],
    explanation: "Kořen je jezd- (jezdit, příjezd), před ním předpona od- (pryč): od-jezd.",
  }),
  choice("Jaký je kořen slova „nákup“?", "kup", [
    { value: "ná-", why: "„Ná-“ je předpona, stojí před kořenem." },
    { value: "nák", why: "Písmeno k patří do kořene, ná- je předpona." },
    { value: "up", why: "Chybí písmeno k — kořen je stejný jako ve slovech koupit, kupec." },
  ], {
    hints: ["Jaké sloveso znamená, že za peníze něco dostaneš? Porovnej ho s tímto slovem.", "Příbuzná slova mají jednu část společnou. Předpona ná- do ní nepatří — odeber ji a zbude kořen, stejný jako v tom slovese."],
    explanation: "Příbuzná slova kupec, kupovat, nákup mají společné kup — to je kořen. Ná- je předpona.",
  }),
  choice("Jaká je přípona ve slově „zahradník“?", "-ník", [
    { value: "zahrad", why: "„Zahrad“ je kořen — najdeš ho i ve slově zahrada." },
    { value: "za-", why: "Zahrada není „za hradem“ — za- tu předponou není." },
    { value: "-ík", why: "Písmeno n patří k příponě -ník (lesník, zahradník)." },
  ], {
    hints: ["Z jakého slova zahradník vzniklo a co k němu přibylo?", "Kořen je stejný jako ve slově „zahrada“. Část, která za ním přibyla a udělala z věci člověka, je přípona."],
    explanation: "Zahrad-ník: kořen zahrad- (zahrada) a přípona -ník, která tvoří názvy lidí (lesník, zahradník).",
  }),
  choice("Jaká je koncovka slova „páni“?", "-i", [
    { value: "pán", why: "„Pán“ je kořen, ten se nemění." },
    { value: "-ni", why: "Písmeno n patří do kořene pán-." },
    { value: "-y", why: "Ve slově páni žádné y není. U živých jmen je v 1. pádě množného čísla -i." },
  ], {
    hints: ["Porovnej tvary pán, pána, pánovi, páni. Co se mění?", "Stejná část ve všech tvarech je kořen. To, co se na konci vyměňuje, je koncovka."],
    explanation: "Pán, pán-a, pán-ovi, pán-i — kořen pán- zůstává, mění se koncovka. Ve tvaru páni je koncovka -i.",
  }),
  choice("Jaká je koncovka slova „hrad“?", "nulová", [
    { value: "-d", why: "D patří do kořene: hrad-u, hrad-em, hrad-y." },
    { value: "-ad", why: "„Ad“ patří do kořene hrad-." },
    { value: "hrad", why: "„Hrad“ je celé kořen, ne koncovka." },
  ], {
    hints: ["Vyskloňuj: hrad, bez hradu, s hradem. Co přibývá na konci?", "V 1. pádě za kořenem nic není, v ostatních pádech se tam objeví koncovka. Jak se říká koncovce, kterou nevidíme ani neslyšíme?"],
    explanation: "Hrad-u, hrad-em — v ostatních pádech koncovka je. V 1. pádě hrad se neobjeví žádné písmeno, koncovka je nulová.",
  }),
  choice("Která slova jsou příbuzná?", "voda, vodník, vodní", [
    { value: "voda, soda, nuda", why: "Znějí podobně, ale významem nesouvisí — kořen společný nemají." },
    { value: "voda, vítr, vlna", why: "Všechna patří k přírodě, ale nemají stejný kořen." },
    { value: "vodník, víla, skřítek", why: "Všechno jsou pohádkové bytosti, ale kořen společný nemají." },
  ], {
    hints: ["Příbuzná slova spolu souvisí významem a mají stejnou část. Kde ji najdeš?", "Nestačí, že slova znějí podobně nebo patří k jednomu tématu. Hledej trojici, kde všechna slova mají stejný kořen i význam."],
    explanation: "Vod-a, vod-ník, vod-n-í mají stejný kořen vod- a všechna souvisí s vodou, proto jsou příbuzná.",
  }),
  choice("Jaká je přípona ve slově „radost“?", "-ost", [
    { value: "rad", why: "„Rad“ je kořen — je i ve slovech radovat se, rád." },
    { value: "-st", why: "Chybí o — přípona je -ost (radost, mladost)." },
    { value: "ra-", why: "„Ra“ není samostatná část, kořen je rad-." },
  ], {
    hints: ["Jaké slovo s radostí souvisí? Radovat se… Co mají společné?", "Společná část je kořen. Za ním stojí přípona, která z něj udělala název vlastnosti — stejná je ve slovech mladost, hloupost."],
    explanation: "Kořen rad- (radovat se) a přípona -ost, která tvoří názvy vlastností a pocitů: rad-ost.",
  }),
  choice("Jaká je předpona ve slově „přechod“?", "pře-", [
    { value: "při-", why: "Ve slově je pře-, ne při- (přechod × příchod)." },
    { value: "chod", why: "„Chod“ je kořen — je i ve slovech chodit, východ." },
    { value: "přech", why: "„Ch“ patří do kořene chod-." },
  ], {
    hints: ["Která slova mají stejný kořen? Chodit, východ, vchod…", "Kořen je chod-. Co před ním stojí? Pozor, jde o předponu s významem „přes“."],
    explanation: "Kořen chod- (chodit) a předpona pře- (přes): pře-chod — místo, kde se přechází.",
  }),
  choice("Která část slova se mění, když slovo skloňujeme (pán, pána, pánovi)?", "koncovka", [
    { value: "předpona", why: "Předpona stojí na začátku a při skloňování se nemění (nákup, nákupu)." },
    { value: "kořen", why: "Kořen zůstává stejný: pán, pán-a, pán-ovi." },
    { value: "přípona", why: "Přípona tvoří nová slova (zahrad-ník), při skloňování zůstává." },
  ], {
    hints: ["Porovnej pán, pána, pánovi. Kde se slova liší — na začátku, uprostřed, nebo na konci?", "Při skloňování zůstává slovo pořád stejné — stejný začátek, stejný základ — a mění se jen jeho úplně poslední část. Jak se ta část jmenuje?"],
    explanation: "Pán, pán-a, pán-ovi — stále stejné slovo, mění se jen část na konci. Tou částí je koncovka.",
  }),
  choice("Jaký je kořen slova „školák“?", "škol", [
    { value: "-ák", why: "„-ák“ je přípona, tvoří název člověka." },
    { value: "ško", why: "Chybí l — kořen je stejný jako ve slově školní." },
    { value: "školá", why: "„Á“ už patří k příponě -ák." },
  ], {
    hints: ["Kam chodí každé ráno žák, kterému se takhle říká?", "Najdi slovo pro budovu, kde se děti učí. Část, kterou má společnou s tímto slovem, je kořen; to, co je za ní, je přípona."],
    explanation: "Škol-ák, škol-ní, škol-ník — společný je kořen škol-. -ák je přípona.",
  }),
];

const L2: PracticeTask[] = [
  choice("Jaká je přípona ve slově „lesní“?", "-n-", [
    { value: "-ní", why: "í je koncovka: lesn-í, lesn-ího, lesn-ímu. Přípona je jen -n-." },
    { value: "les", why: "„Les“ je kořen." },
    { value: "-í", why: "„-í“ je koncovka, mění se podle pádu." },
  ], {
    hints: ["Vyskloňuj: lesní, lesního, lesnímu. Co se mění a co zůstává za kořenem?", "Za kořenem stojí nejdřív přípona, která slovo tvoří, a až za ní koncovka, která se mění. Koncovka je tu jen poslední písmeno."],
    explanation: "Les-n-í: kořen les-, přípona -n- (tvoří přídavné jméno) a koncovka -í (mění se: lesn-ího).",
  }),
  choice("Jaký je kořen slova „podzemní“?", "zem", [
    { value: "pod-", why: "„Pod-“ je předpona." },
    { value: "zemn", why: "N už je přípona (podzem-n-í)." },
    { value: "-í", why: "„-í“ je koncovka." },
  ], {
    hints: ["Na čem stojíme a co je pod námi, když kopeme jámu?", "Kořen je část, kterou má slovo společnou s příbuzným slovem bez předpony a přípony. Předpona je pod-, přípona -n-, koncovka -í."],
    explanation: "Pod-zem-n-í: předpona pod-, kořen zem-, přípona -n-, koncovka -í.",
  }),
  choice("Jak se správně rozdělí slovo „nedobrý“?", "ne-dobr-ý", [
    { value: "ned-obr-ý", why: "Předpona je jen ne-, d patří ke kořeni dobr-." },
    { value: "ne-dob-rý", why: "R patří ke kořeni dobr- (dobr-ota)." },
    { value: "nedobr-ý", why: "Chybí předpona ne-, která stojí před kořenem." },
  ], {
    hints: ["Jaké slovo zbude, když odebereš část, která otáčí význam?", "Najdi kořen podle slova dobrota. Před ním je předpona, za ním koncovka, která se mění (nedobrá, nedobré)."],
    explanation: "Ne- je předpona, dobr- kořen (dobrota) a -ý koncovka (nedobr-á, nedobr-é).",
  }),
  choice("Jak se správně rozdělí slovo „zahradník“?", "zahrad-ník", [
    { value: "za-hrad-ník", why: "Zahrada není „za hradem“ — za- tu předponou není, patří ke kořeni." },
    { value: "zahra-dník", why: "D patří do kořene zahrad-." },
    { value: "zahradn-ík", why: "N patří k příponě -ník (lesník, zahradník)." },
  ], {
    hints: ["Z jakého slova zahradník vzniklo?", "Kořen je stejný jako ve slově „zahrada“. Za ním je přípona, stejná jako ve slovech lesník nebo rybník."],
    explanation: "Zahrad- je kořen (zahrada), -ník přípona. Předpona tu není.",
  }),
  choice("Jak se správně rozdělí slovo „odjezd“?", "od-jezd", [
    { value: "o-djezd", why: "D patří k předponě od-." },
    { value: "odj-ezd", why: "J patří do kořene jezd- (jezdit)." },
    { value: "od-jez-d", why: "Kořen jezd- se nedělí — d k němu patří (jezdit)." },
  ], {
    hints: ["Která slova mají stejný kořen? Příjezd, jezdit…", "Kořen je část společná slovům příjezd a jezdit. Před ním stojí předpona, která znamená pryč."],
    explanation: "Od- je předpona (pryč), jezd- je kořen (jezdit, příjezd).",
  }),
  choice("Která slova mají stejný kořen jako „chodit“?", "přechod, chodník, východ", [
    { value: "chata, chatka, chatař", why: "Mají společný kořen chat-, s chozením nesouvisí." },
    { value: "chuť, chudý, chůva", why: "Začínají na ch-, ale kořen s chodit společný nemají." },
    { value: "chlad, chladno, chladit", why: "Mají společný kořen chlad-, ne chod-." },
  ], {
    hints: ["Co znamená chodit? Která slova s tím souvisí významem?", "Nestačí, že slovo začíná na ch-. Hledej slova, ve kterých je celá část chod- a která souvisí s chůzí."],
    explanation: "Pře-chod, chod-ník, vý-chod — všechna mají kořen chod- a souvisí s chůzí.",
  }),
  choice("Jaká je koncovka slova „dobrota“?", "-a", [
    { value: "-ota", why: "-ot- je přípona, koncovka je až poslední -a (dobrot-y, dobrot-ou)." },
    { value: "-ta", why: "T patří k příponě -ot-." },
    { value: "dobr", why: "„Dobr“ je kořen." },
  ], {
    hints: ["Vyskloňuj: dobrota, bez dobroty, s dobrotou. Co se mění?", "Koncovka je jen ta část, která se při skloňování vymění. Všechno před ní zůstává stejné."],
    explanation: "Dobr-ot-a, dobrot-y, dobrot-ou — mění se jen poslední část, koncovka -a.",
  }),
  choice("Jaká je předpona ve slově „vchod“?", "v-", [
    { value: "ve-", why: "Ve slově vchod žádné e není: v- + chod." },
    { value: "vch-", why: "Ch patří do kořene chod-." },
    { value: "chod", why: "„Chod“ je kořen." },
  ], {
    hints: ["Kořen najdeš i ve slově chodit. Co před ním zbude?", "Když odebereš kořen chod-, zůstane na začátku jen jedno písmeno. I jedno písmeno může být předpona."],
    explanation: "V-chod: kořen chod- (chodit) a předpona v- (dovnitř).",
  }),
  choice("Jaká je přípona ve slově „rybář“?", "-ář", [
    { value: "ryb", why: "„Ryb“ je kořen (ryba, rybník)." },
    { value: "-ř", why: "Přípona je celé -ář (rybář, kovář)." },
    { value: "-bář", why: "B patří do kořene ryb-." },
  ], {
    hints: ["Z jakého slova rybář vzniklo?", "Kořen je stejný jako ve slově ryba. Za ním je přípona, která tvoří názvy řemesel — stejná jako ve slově kovář."],
    explanation: "Ryb-ář: kořen ryb- (ryba) a přípona -ář, která tvoří názvy lidí podle práce (kovář, rybář).",
  }),
  choice("Která dvojice slov má stejnou předponu?", "odjezd – odnést", [
    { value: "odjezd – obchod", why: "Obchod má předponu ob-, ne od-." },
    { value: "přechod – příchod", why: "Přechod má pře-, příchod pří-." },
    { value: "vchod – východ", why: "Vchod má v-, východ vý-." },
  ], {
    hints: ["U každého slova odděl kořen. Co zbude na začátku?", "Předpony se liší třeba jen jedním písmenem nebo délkou samohlásky (pře- × pří-). Porovnávej je písmeno po písmenu."],
    explanation: "Od-jezd a od-nést mají stejnou předponu od- (pryč).",
  }),
  choice("Jaká je předpona ve slově „obchod“?", "ob-", [
    { value: "o-", why: "B patří k předponě ob-. Kořen je chod-." },
    { value: "obch-", why: "Ch patří do kořene chod-." },
    { value: "chod", why: "„Chod“ je kořen." },
  ], {
    hints: ["Který kořen ve slově poznáváš? Najdeš ho i ve slově chodit.", "Když odebereš kořen chod-, zůstane na začátku předpona. Má dvě písmena."],
    explanation: "Ob-chod: předpona ob- a kořen chod-.",
  }),
  choice("Ve kterém slově není předpona?", "strom", [
    { value: "odjezd", why: "Odjezd má předponu od- (od-jezd)." },
    { value: "nákup", why: "Nákup má předponu ná- (ná-kup)." },
    { value: "přechod", why: "Přechod má předponu pře- (pře-chod)." },
  ], {
    hints: ["U kterého slova nejde nic ze začátku oddělit tak, aby zbyl kořen jiného slova?", "Předponu poznáš tak, že po jejím odebrání zbude kořen, který znáš z jiných slov (jezd- z jezdit, kup- z koupit)."],
    explanation: "Strom je celý kořen (strom-ek, strom-y). Ostatní slova mají předponu od-, ná-, pře-.",
  }),
  choice("Jaký je kořen slova „vodník“?", "vod", [
    { value: "-ník", why: "„-ník“ je přípona (lesník, zahradník)." },
    { value: "vo", why: "D patří do kořene — najdeš ho ve slovech voda, vodní." },
    { value: "vodn", why: "N patří k příponě -ník." },
  ], {
    hints: ["Kde žije pohádková bytost se zeleným kabátkem a hrníčky na dušičky?", "Kořen je část společná se slovem, podle kterého se ta bytost jmenuje. Za kořenem stojí přípona, stejná jako u lesníka."],
    explanation: "Vod-ník: kořen vod- (voda) a přípona -ník.",
  }),
];

const L3: PracticeTask[] = [
  choice("Jak se slovo „podzemní“ rozdělí na předponu, kořen, příponu a koncovku?", "pod-zem-n-í", [
    { value: "pod-zem-ní", why: "„-ní“ nejsou jedna část: n je přípona, í koncovka (podzemn-ího)." },
    { value: "po-dzem-n-í", why: "D patří k předponě pod-." },
    { value: "podz-em-n-í", why: "Z patří do kořene zem-." },
  ], {
    hints: ["Začni kořenem — kde leží něco podzemního?", "Kořen je zem-. Před ním předpona, za ním přípona, která tvoří přídavné jméno, a na konci koncovka, která se mění (podzemního)."],
    explanation: "Pod- předpona, zem- kořen, -n- přípona, -í koncovka.",
  }),
  choice("Jak se slovo „přestavba“ rozdělí na předponu, kořen, příponu a koncovku?", "pře-stav-b-a", [
    { value: "pře-stavb-a", why: "B už je přípona (stav-b-a jako stav-ět)." },
    { value: "přes-tav-b-a", why: "Předpona je pře-, s patří do kořene stav-." },
    { value: "pře-sta-vba", why: "Kořen je stav- (stavět), v k němu patří." },
  ], {
    hints: ["Jaké sloveso se ve slově skrývá?", "Kořen je stejný jako ve slově stavět. Před ním předpona, za ním přípona -b- a na konci koncovka (přestavb-y)."],
    explanation: "Pře- předpona, stav- kořen (stavět), -b- přípona, -a koncovka.",
  }),
  choice("Jak se slovo „nešťastný“ rozdělí na předponu, kořen, příponu a koncovku?", "ne-šťast-n-ý", [
    { value: "neš-ťast-n-ý", why: "Předpona je jen ne-, š patří do kořene šťast-." },
    { value: "ne-šťastn-ý", why: "N je přípona, do kořene nepatří (šťast-í)." },
    { value: "ne-šťas-tný", why: "T patří do kořene šťast- (štěstí, šťastný)." },
  ], {
    hints: ["Co zbude, když odebereš část, která otáčí význam?", "Kořen je stejný jako ve slově šťastný bez předpony. Za kořenem je přípona -n- a na konci koncovka, která se mění (nešťastná)."],
    explanation: "Ne- předpona, šťast- kořen, -n- přípona, -ý koncovka.",
  }),
  choice("Jak se správně rozdělí slovo „obchodník“?", "ob-chod-ník", [
    { value: "o-bchod-ník", why: "B patří k předponě ob-, kořen je chod-." },
    { value: "obchod-ník", why: "Chybí předpona ob-, která stojí před kořenem chod-." },
    { value: "ob-chodn-ík", why: "N patří k příponě -ník." },
  ], {
    hints: ["Z jakého slova obchodník vzniklo?", "Nejdřív odděl příponu jako u lesníka, pak ze slova obchod odděl předponu před kořenem chod-."],
    explanation: "Ob- předpona, chod- kořen, -ník přípona (obchodník = ten, kdo má obchod).",
  }),
  choice("Jak se slovo „lesní“ rozdělí na kořen, příponu a koncovku?", "les-n-í", [
    { value: "les-ní", why: "„-ní“ jsou dvě části: přípona -n- a koncovka -í." },
    { value: "le-sn-í", why: "S patří do kořene les-." },
    { value: "lesn-í", why: "N není součást kořene — les je bez n." },
  ], {
    hints: ["Jaké je nejkratší příbuzné slovo?", "Kořen je celé to nejkratší slovo. Za ním je jedno písmeno přípony a pak koncovka, která se mění (lesního)."],
    explanation: "Les- kořen, -n- přípona, -í koncovka.",
  }),
  choice("Které slovo vzniklo ze slova „dobrý“ příponou?", "dobrota", [
    { value: "nedobrý", why: "Tady přibyla předpona ne-, ne přípona." },
    { value: "předobrý", why: "Tady přibyla předpona pře-." },
    { value: "dobrá", why: "To je jen jiný tvar téhož slova — změnila se koncovka." },
  ], {
    hints: ["Kde přibyla nová část — před kořenem, nebo za ním?", "Přípona stojí za kořenem a tvoří nové slovo s novým významem. Jen změna koncovky nové slovo nevytvoří."],
    explanation: "Dobr-ot-a: za kořen dobr- přibyla přípona -ot- a vzniklo nové slovo. Ne-dobrý a pře-dobrý mají předponu, dobrá je jen jiný tvar.",
  }),
  choice("Které slovo vzniklo ze slova „nést“ přidáním předpony?", "odnést", [
    { value: "nosič", why: "Tady přibyla přípona (-ič), ne předpona." },
    { value: "nesu", why: "To je jen jiný tvar slovesa nést." },
    { value: "nosit", why: "Příbuzné sloveso, ale žádná předpona nepřibyla." },
  ], {
    hints: ["Ve kterém slově přibylo něco na začátku?", "Předpona stojí před kořenem a mění význam (třeba směr: kam něco neseš). Jiný tvar slovesa ani přípona to nejsou."],
    explanation: "Od-nést: před sloveso nést přibyla předpona od- (pryč).",
  }),
  choice("Co mají společného slova „pekař, rybář, lékař“?", "stejnou příponu (-ař, -ář)", [
    { value: "stejný kořen", why: "Kořeny jsou různé: pek-, ryb-, lék-." },
    { value: "stejnou předponu", why: "Předponu nemá ani jedno z těch slov." },
    { value: "stejnou koncovku -r", why: "Ř je součást přípony a koncovka je v 1. pádě nulová." },
  ], {
    hints: ["Odděl u každého slova kořen (péct, ryba, lék). Co zbude?", "Za kořenem všech tří slov je stejná část, která dělá z činnosti nebo věci název člověka podle práce."],
    explanation: "Pek-ař, ryb-ář, lék-ař — různé kořeny, ale stejná přípona -ař/-ář, která tvoří názvy řemesel.",
  }),
  choice("Ve kterém slově je „ne-“ předponou?", "nešťastný", [
    { value: "nebe", why: "Neb- je kořen (nebeský), „ne“ tu nejde oddělit." },
    { value: "nehet", why: "Nehet je celé kořen, „het“ samo nic neznamená." },
    { value: "nerv", why: "Nerv je celé kořen, „rv“ samo nic neznamená." },
  ], {
    hints: ["Když odebereš „ne“, zbude smysluplné slovo?", "Předpona ne- otáčí význam slova v opak (dobrý × nedobrý). U ostatních slov po odebrání „ne“ zbude nesmysl."],
    explanation: "Ne-šťastný je opak slova šťastný, proto je ne- předpona. U nebe, nehet, nerv „ne“ patří ke kořeni.",
  }),
  choice("Ve kterém slově je „vy-“ předponou?", "vyjít", [
    { value: "vydra", why: "Vydra je celé kořen, „dra“ samo nic neznamená." },
    { value: "vysoký", why: "Kořen je vys- (výška, vysoko), „vy“ nejde oddělit." },
    { value: "vykat", why: "Slovo znamená říkat někomu „vy“. „Vy“ je tu kořen, ne předpona." },
  ], {
    hints: ["Když odebereš „vy“, zbude slovo, které znáš?", "Předpona vy- často znamená pohyb ven. Po jejím odebrání musí zbýt kořen, který znáš z jiného slova."],
    explanation: "Vy-jít = jít ven, po odebrání zbude sloveso jít. U vydra, vysoký a vykat „vy“ patří ke kořeni.",
  }),
  choice("Jak se slovo „nákupní“ rozdělí na předponu, kořen, příponu a koncovku?", "ná-kup-n-í", [
    { value: "ná-kupn-í", why: "N je přípona, do kořene kup- nepatří." },
    { value: "nák-up-n-í", why: "K patří do kořene kup- (koupit)." },
    { value: "ná-ku-pní", why: "P patří do kořene kup-." },
  ], {
    hints: ["Jaký kořen je ve slově koupit, kupec?", "Kořen je kup-. Před ním je předpona, za ním jedno písmeno přípony a pak koncovka, která se mění (nákupního)."],
    explanation: "Ná- předpona, kup- kořen, -n- přípona, -í koncovka.",
  }),
  choice("Jak se slovo „dobrota“ rozdělí na kořen, příponu a koncovku?", "dobr-ot-a", [
    { value: "dob-rot-a", why: "R patří do kořene dobr- (dobrý)." },
    { value: "dobro-t-a", why: "O patří k příponě -ot-." },
    { value: "dobr-ota", why: "„-ota“ jsou dvě části: přípona -ot- a koncovka -a." },
  ], {
    hints: ["Jaké slovo s dobrotou souvisí?", "Kořen je stejný jako ve slově dobrý. Za ním přípona, která tvoří nové slovo, a na konci koncovka, která se mění (dobroty)."],
    explanation: "Dobr- kořen, -ot- přípona, -a koncovka (dobrot-y, dobrot-ou).",
  }),
  choice("Která část slova nese hlavní význam a mají ji všechna příbuzná slova?", "kořen", [
    { value: "předpona", why: "Předpona jen mění význam (jít × odejít), příbuzná slova ji mít nemusí." },
    { value: "přípona", why: "Přípona tvoří nová slova, u příbuzných slov bývá různá (lesník, lesní)." },
    { value: "koncovka", why: "Koncovka jen mění tvar při skloňování." },
  ], {
    hints: ["Co mají společné slova les, lesník, lesní?", "Předpona, přípona i koncovka se u příbuzných slov mění. Jedna část ale zůstává vždycky a nese význam."],
    explanation: "Kořen je nejdůležitější část slova, nese jeho hlavní význam a mají ho všechna příbuzná slova.",
  }),
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? L3 : level === 2 ? L2 : L1;
  return shuffle(pool);
}

export const PREDPONAKORENPRIPONAKONCOVKA: TopicMetadata[] = [
  {
    id: "g4-cjl-jazykova-vychova-stavba-slova-predpona-koren-pripona-koncovka",
    rvpNodeId: "g4-cjl-jazykova-vychova-stavba-slova-predpona-koren-pripona-koncovka",
    displayName: "Části slova",
    title: "Předpona, kořen, přípona, koncovka",
    studentTitle: "Stavba slova",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Jazyková výchova",
    briefDescription: "Poznáš, jak se skládá slovo z předpony, kořene, přípony a koncovky.",
    keywords: ["předpona", "kořen", "přípona", "koncovka", "stavba slova", "morfém"],
    goals: [
      "Rozpoznat předponu, kořen, příponu a koncovku ve slovech",
      "Pochopit, jak tyto části mění nebo tvoří nová slova",
    ],
    boundaries: ["Bez pokročilé morfologické analýzy", "Bez cizích slov a přejatých morfémů"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    recommendedNext: ["g4-cjl-jazykova-vychova-stavba-slova-pravopis-predpon-vy-vy-s-z-vz"],
    generator: gen,
    helpTemplate: {
      hint: "Předpona = před kořenem, kořen = základ, přípona = za kořenem (tvoří slova), koncovka = mění tvar",
      steps: [
        "Najdi příbuzná slova — jejich společná část je kořen.",
        "Co stojí před kořenem? → předpona",
        "Co stojí za kořenem a tvoří nová slova? → přípona",
        "Co se mění při skloňování? → koncovka",
      ],
      commonMistake: "Záměna přípony a koncovky — přípona tvoří nová slova, koncovka jen mění tvar (les-n-í: přípona -n-, koncovka -í)",
      example: "ne-dobr-ý: ne=předpona, dobr=kořen, ý=koncovka; pod-zem-n-í: pod=předpona, zem=kořen, n=přípona, í=koncovka",
    },
  },
];
