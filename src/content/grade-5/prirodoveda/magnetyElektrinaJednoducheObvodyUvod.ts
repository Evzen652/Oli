import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// vysvětlení a zpětné vazby a na L2/L3 jen pět až sedm různých otázek. Teď:
// L1 magnet, póly, vodiče a izolanty, obvod · L2 proč to tak je (izolace,
// kompas, elektromagnet) · L3 zapojování obvodů a bezpečnost v situacích.

const L1: PracticeTask[] = [
  choice("Co přitáhne magnet?", "železný hřebík", [
    { value: "dřevěnou tužku", why: "Dřevo magnet nepřitahuje." },
    { value: "hliníkovou plechovku", why: "Hliník je kov, ale magnet ho nepřitáhne." },
    { value: "plastové pravítko", why: "Plast magnet nepřitahuje." },
  ], {
    hints: ["Magnet přitahuje jen některé kovy. Který z předmětů je z nich?", "Magnet přitahuje hlavně železo a ocel; hliník, dřevo ani plast ne. Plechovka od limonády je z hliníku, a proto ji magnet nechá být."],
    explanation: "Magnet přitahuje železo a ocel — tedy železný hřebík.",
  }),
  choice("Jak se jmenují konce magnetu, kde nejsilněji přitahuje?", "póly", [
    { value: "osy", why: "Osa je myšlená přímka, kolem které se něco otáčí." },
    { value: "elektrody", why: "Elektrody jsou vývody například u baterie." },
    { value: "polokoule", why: "Polokoule jsou poloviny koule, třeba Země." },
  ], {
    hints: ["Magnet má severní a jižní…", "Stejně se jmenují nejsevernější a nejjižnější místa Země."],
    explanation: "Konce magnetu jsou póly — severní a jižní.",
  }),
  choice("Co se stane, když k sobě přiblížíš dva severní póly magnetů?", "odpuzují se", [
    { value: "přitahují se", why: "Přitahují se jen opačné póly." },
    { value: "nic se nestane", why: "Magnety na sebe působí vždy." },
    { value: "zahřejí se", why: "Magnety se k sobě nezahřívají." },
  ], {
    hints: ["Dva severní póly — jsou stejné, nebo opačné?", "Opačné póly se přitahují, stejné póly se od sebe tlačí pryč."],
    explanation: "Stejné póly se odpuzují.",
  }),
  choice("Co se stane, když k sobě přiblížíš severní a jižní pól?", "přitahují se", [
    { value: "odpuzují se", why: "Odpuzují se stejné póly." },
    { value: "nic se nestane", why: "Magnety na sebe působí vždy." },
    { value: "rozbijí se", why: "Magnety se přitažením nerozbijí." },
  ], {
    hints: ["Severní a jižní pól — jsou stejné, nebo opačné?", "Stejné póly se od sebe tlačí pryč, opačné k sobě."],
    explanation: "Opačné póly se přitahují.",
  }),
  choice("Kam ukazuje střelka kompasu?", "k severu", [
    { value: "k jihu", why: "K jihu ukazuje opačný konec střelky." },
    { value: "ke Slunci", why: "Slunce na střelku nepůsobí." },
    { value: "k nejbližšímu kovu", why: "Blízké železo střelku vychýlí, ale bez něj ukazuje k severu." },
  ], {
    hints: ["K čemu slouží kompas v lese?", "Obarvený konec střelky se natočí vždy ke stejné světové straně — k té, kde je Polárka."],
    explanation: "Střelka kompasu je magnet a natáčí se k severu.",
  }),
  choice("Který předmět vede elektrický proud?", "měděný drát", [
    { value: "gumová rukavice", why: "Guma proud nevede, je izolant." },
    { value: "dřevěná vařečka", why: "Suché dřevo proud nevede." },
    { value: "skleněná sklenice", why: "Sklo proud nevede." },
  ], {
    hints: ["Proud vedou hlavně kovy.", "Z tohoto kovu jsou dráty uvnitř kabelů, protože vede proud velmi dobře."],
    explanation: "Měď je kov a výborně vede proud — proto jsou z ní dráty.",
  }),
  choice("Který předmět proud nevede?", "plastový obal kabelu", [
    { value: "měděný drát", why: "Měď proud vede." },
    { value: "železný klíč", why: "Železo proud vede." },
    { value: "hliníková fólie", why: "Hliník proud vede." },
  ], {
    hints: ["Hledej předmět, který není z kovu.", "Látky, které proud nevedou, se jmenují izolanty; patří k nim plast, guma nebo sklo."],
    explanation: "Plast je izolant — proto se jím obalují dráty.",
  }),
  choice("Co potřebuješ, aby se rozsvítila žárovka?", "uzavřený obvod se zdrojem", [
    { value: "jen samotnou žárovku", why: "Bez zdroje nemá žárovka odkud brát proud." },
    { value: "baterii bez drátů", why: "Proud musí mít cestu od baterie k žárovce a zpět." },
    { value: "přerušený drát", why: "Přerušeným drátem proud neteče." },
  ], {
    hints: ["Odkud žárovka bere proud a kudy k ní teče?", "Proud musí téct dokola: ze zdroje drátem do žárovky a druhým drátem zpátky."],
    explanation: "Žárovka svítí, jen když je v uzavřeném obvodu se zdrojem proudu.",
  }),
  choice("Co je zdrojem proudu v kapesní svítilně?", "baterie", [
    { value: "žárovka", why: "Žárovka proud spotřebovává." },
    { value: "vypínač", why: "Vypínač proud jen pouští, nebo zastaví." },
    { value: "kovový obal", why: "Obal proud nevyrábí." },
  ], {
    hints: ["Co se ve svítilně vyměňuje, když přestane svítit?", "Tento zdroj má na koncích plus a minus a časem se vybije. Do svítilny se vkládá jeden nebo víc kusů."],
    explanation: "Zdrojem proudu ve svítilně je baterie.",
  }),
  choice("K čemu slouží vypínač?", "spojí nebo přeruší obvod", [
    { value: "vyrábí proud", why: "Proud vyrábí zdroj, třeba baterie." },
    { value: "zesiluje světlo", why: "Vypínač světlo nezesiluje." },
    { value: "chladí žárovku", why: "Vypínač nic nechladí." },
  ], {
    hints: ["Co se stane, když vypínač cvakne?", "Vypínač je jako padací most: když je dole, proud projde, když je nahoře, cesta je přerušená."],
    explanation: "Vypínač obvod spojí (světlo svítí), nebo přeruší (zhasne).",
  }),
  choice("Proč nesmíš strkat předměty do zásuvky?", "proud ze zásuvky může zabít", [
    { value: "zásuvka by se ucpala", why: "Nejde o ucpání, ale o úraz proudem." },
    { value: "předmět by se zmagnetoval", why: "Nejde o magnetismus, ale o úraz proudem." },
    { value: "zásuvka by přestala fungovat", why: "Hlavní nebezpečí je úraz, ne porucha." },
  ], {
    hints: ["Jak silný proud je v zásuvce ve srovnání s baterií?", "Napětí v zásuvce je mnohem vyšší než v bateriích; proud by prošel tělem."],
    explanation: "Proud ze zásuvky je pro člověka smrtelně nebezpečný.",
  }),
  choice("Který kov magnet nepřitáhne?", "hliník", [
    { value: "železo", why: "Železo magnet přitahuje." },
    { value: "ocel", why: "Ocel je slitina železa a magnet ji přitahuje." },
    { value: "nikl", why: "Nikl magnet přitahuje." },
  ], {
    hints: ["Z čeho je plechovka od limonády?", "Není to železo ani ocel; plechovky z toho kovu se od sběrných magnetů neoddělí."],
    explanation: "Hliník je kov, ale magnet ho nepřitahuje.",
  }),
  choice("Čím vybereš z písku železné piliny?", "magnetem", [
    { value: "sítem", why: "Síto rozdělí podle velikosti zrn; piliny jsou drobné jako písek." },
    { value: "vodou", why: "Voda by vše jen zamíchala." },
    { value: "lupou", why: "Lupou uvidíš, ale nevybereš." },
  ], {
    hints: ["Co přitahuje železo?", "Když nad směsí přejedeš tímto předmětem, piliny se na něj přichytí a písek zůstane."],
    explanation: "Magnet přitáhne železné piliny, písek zůstane.",
  }),
];

const L2: PracticeTask[] = [
  choice("Proč je drát v kabelu obalený plastem?", "plast je izolant a chrání nás před proudem", [
    { value: "plast vede proud lépe než měď", why: "Plast proud nevede." },
    { value: "aby byl kabel těžší a držel", why: "Hmotnost není důvod." },
    { value: "plast proud zesiluje", why: "Plast proud nezesiluje." },
  ], {
    hints: ["Vede plast proud?", "Kdyby byl drát holý, mohl by proud přejít do ruky, která se ho dotkne."],
    explanation: "Plast proud nevede — je izolant — a chrání nás před úrazem.",
  }),
  choice("Obvod tvoří baterie, vypínač a žárovka. Vypínač je vypnutý. Svítí žárovka?", "ne, obvod je přerušený", [
    { value: "ano, baterie je plná", why: "Plná baterie nestačí, proud musí mít cestu." },
    { value: "ano, ale slabě", why: "Přerušeným obvodem neteče žádný proud." },
    { value: "ano, jen chvíli", why: "Neteče vůbec." },
  ], {
    hints: ["Co udělá vypnutý vypínač s cestou proudu?", "Vypnutý vypínač je jako zvednutý most: proud se přes něj nedostane dál."],
    explanation: "Vypnutý vypínač obvod přeruší a žárovka nesvítí.",
  }),
  choice("Díky čemu se střelka kompasu natočí k severu?", "Země je obrovský magnet", [
    { value: "na severu je chladněji", why: "Teplota na střelku nepůsobí." },
    { value: "přitahuje ji Polárka", why: "Hvězdy na střelku nepůsobí." },
    { value: "tak ji natočil výrobce", why: "Střelka se natáčí sama, i když s kompasem otočíš." },
  ], {
    hints: ["Střelka je magnet. Co velkého kolem ní má také magnetické pole?", "Země má magnetické póly blízko zeměpisných pólů a střelka se podle nich natočí."],
    explanation: "Země má magnetické pole; magnetická střelka se podle něj natočí k severu.",
  }),
  choice("Co je elektromagnet?", "cívka, která je magnetem jen při průchodu proudu", [
    { value: "magnet, který přitahuje i dřevo a plasty", why: "Takový magnet neexistuje." },
    { value: "přístroj, který vyrábí proud z vody", why: "To dělá turbína s generátorem v elektrárně." },
    { value: "magnet na lednici, který drží stále", why: "To je trvalý magnet." },
  ], {
    hints: ["Dá se magnet zapnout a vypnout?", "Když drátem namotaným na železe teče proud, železo přitahuje; když proud přestane, pustí."],
    explanation: "Elektromagnet je cívka s jádrem, která přitahuje jen tehdy, když jí teče proud.",
  }),
  choice("Kde se používá elektromagnet?", "v jeřábu na šrotišti", [
    { value: "v dřevěném stole", why: "Ve stole elektromagnet není." },
    { value: "ve skleněné váze", why: "Váza žádný magnet nepotřebuje." },
    { value: "v gumovém míči", why: "Míč žádný magnet nepotřebuje." },
  ], {
    hints: ["Kde je potřeba železo zvednout a pak pustit?", "Jeřáb nabere hromadu železného šrotu a po vypnutí proudu ho upustí na jiné místo."],
    explanation: "Jeřáb na šrotišti zvedá železo elektromagnetem, který se dá vypnout.",
  }),
  choice("Rozlomíš tyčový magnet napůl. Co vznikne?", "dva menší magnety, každý se dvěma póly", [
    { value: "kus jen se severním a kus jen s jižním pólem", why: "Pól nejde oddělit — každý kus má zase oba." },
    { value: "dva kusy obyčejného železa", why: "Kusy zůstanou magnetické." },
    { value: "jeden magnet a jeden nemagnetický kus", why: "Magnetické zůstanou oba kusy." },
  ], {
    hints: ["Dá se oddělit severní pól od jižního?", "Magnet je složený z drobných magnetků. Když ho rozlomíš, každý kus je zase celý magnet."],
    explanation: "Každý kus magnetu má zase severní i jižní pól — vzniknou dva menší magnety.",
  }),
  choice("Mohou se dva jižní póly přitahovat?", "ne, stejné póly se odpuzují", [
    { value: "ano, vždy", why: "Přitahují se jen opačné póly." },
    { value: "ano, ale jen pod vodou", why: "Voda na to vliv nemá." },
    { value: "ano, když jsou magnety velké", why: "Velikost pravidlo nemění." },
  ], {
    hints: ["Jsou dva jižní póly stejné, nebo opačné?", "Pravidlo platí pro všechny magnety: opačné póly k sobě, stejné od sebe."],
    explanation: "Stejné póly se vždy odpuzují.",
  }),
  choice("Který materiál je dobrý vodič proudu?", "hliník", [
    { value: "sklo", why: "Sklo je izolant." },
    { value: "porcelán", why: "Porcelán je izolant — používá se na izolátory na sloupech." },
    { value: "suché dřevo", why: "Suché dřevo je izolant." },
  ], {
    hints: ["Který z těch materiálů je kov?", "Z tohoto lehkého kovu jsou vodiče vysokého napětí mezi stožáry i plechovky."],
    explanation: "Hliník je kov a dobře vede proud.",
  }),
  choice("Proč se nesmíš dotýkat elektrických zařízení mokrýma rukama?", "voda s nečistotami vede proud", [
    { value: "voda poškodí barvu zařízení", why: "Hlavní nebezpečí je úraz proudem." },
    { value: "zařízení by zrezivělo", why: "Nejde o rez, ale o proud." },
    { value: "prsty by se přilepily", why: "Nepřilepí se; proud ale může projít tělem." },
  ], {
    hints: ["Vede voda z kohoutku proud?", "Voda obsahuje rozpuštěné látky, díky kterým jí proud projde — a pak i tvým tělem."],
    explanation: "Běžná voda vede proud; mokré ruce zvyšují riziko úrazu.",
  }),
  choice("Co udělá žárovka, když z obvodu vyndáš baterii?", "zhasne", [
    { value: "svítí dál", why: "Bez zdroje proud neteče." },
    { value: "svítí silněji", why: "Bez zdroje nesvítí vůbec." },
    { value: "začne blikat", why: "Bez zdroje nemá z čeho blikat." },
  ], {
    hints: ["Odkud žárovka bere proud?", "Když zdroj zmizí, v obvodu nic neteče."],
    explanation: "Bez baterie v obvodu neteče proud a žárovka zhasne.",
  }),
  choice("Jak se jmenují látky, které proud nevedou?", "izolanty", [
    { value: "vodiče", why: "Vodiče proud vedou." },
    { value: "magnety", why: "Magnety přitahují železo." },
    { value: "zdroje", why: "Zdroje proud dodávají." },
  ], {
    hints: ["Guma, plast a sklo patří do jedné skupiny. Jak se jmenuje?", "Tyto látky nás oddělují od proudu v drátech; odborně se tomu oddělení říká izolace."],
    explanation: "Látky, které proud nevedou, jsou izolanty.",
  }),
  choice("Magnet přitáhne sponku i přes list papíru. Co z toho plyne?", "magnetická síla projde i papírem", [
    { value: "papír je magnetický", why: "Papír magnet nepřitahuje." },
    { value: "sponka je z papíru", why: "Sponka je z oceli." },
    { value: "papír sílu magnetu zesiluje", why: "Papír sílu nezesiluje." },
  ], {
    hints: ["Zastaví papír působení magnetu?", "Magnet působí i na dálku a přes nemagnetické materiály, jako je papír nebo sklo."],
    explanation: "Magnetická síla prochází papírem, sklem i vodou.",
  }),
];

const L3: PracticeTask[] = [
  choice("Máš baterii, žárovku a dva dráty. Jak je zapojíš, aby žárovka svítila?", "každý pól baterie spojím drátem se žárovkou", [
    { value: "oba dráty připojím k jednomu pólu baterie", why: "Proud musí vyjít z jednoho pólu a vrátit se do druhého." },
    { value: "stačí jeden drát od baterie k žárovce", why: "Jedním drátem se obvod neuzavře." },
    { value: "dráty spojím spolu a žárovku nechám stranou", why: "Žárovka musí být v obvodu." },
  ], {
    hints: ["Proud musí téct dokola. Kolik cest potřebuje?", "Z jednoho pólu baterie vede drát k žárovce a z žárovky druhý drát zpět k druhému pólu."],
    explanation: "Obvod je uzavřený, když proud vede z jednoho pólu přes žárovku do druhého pólu.",
  }),
  choice("Svítilna přestala svítit. Co zkontroluješ nejdřív?", "jestli nejsou vybité baterie", [
    { value: "jestli není svítilna studená", why: "Teplota o svícení nerozhoduje." },
    { value: "jestli je venku tma", why: "Svítilna svítí i za světla." },
    { value: "jakou barvu má obal", why: "Barva obalu na svícení vliv nemá." },
  ], {
    hints: ["Která součástka svítilny se nejčastěji vyčerpá?", "Zdroj proudu se časem vybije; pak v obvodu nic neteče. Zkus nejdřív vyměnit ten."],
    explanation: "Nejčastější příčinou jsou vybité baterie.",
  }),
  choice("V misce je směs železných pilin a písku. Jak ji oddělíš?", "přejedu nad směsí magnetem", [
    { value: "zamíchám ji lžící", why: "Mícháním se nic neoddělí." },
    { value: "přeliju ji vodou", why: "Obojí klesne ke dnu." },
    { value: "zahřeju ji na plotně", why: "Teplem se piliny od písku neoddělí." },
  ], {
    hints: ["Čím se piliny liší od písku?", "Piliny jsou ze železa, a to přitahuje předmět, který znáš z kompasu."],
    explanation: "Magnet přitáhne železné piliny a písek zůstane v misce.",
  }),
  choice("Proč kompas nefunguje správně vedle velkého železného předmětu?", "železo střelku vychýlí", [
    { value: "železo střelku zahřeje", why: "Nejde o teplo, ale o magnetismus." },
    { value: "kompas se rozbije", why: "Kompas se nerozbije, jen ukáže špatně." },
    { value: "střelka přestane být magnetem", why: "Střelka zůstane magnetem, jen ji železo přitáhne." },
  ], {
    hints: ["Střelka je magnet. Co s ní udělá kus železa poblíž?", "Železo přitahuje střelku silněji než vzdálený magnetický pól Země."],
    explanation: "Blízké železo přitahuje střelku a ta pak neukazuje k severu.",
  }),
  choice("Dvě žárovky jsou zapojené za sebou v jednom okruhu. Jedna praskne. Co udělá druhá?", "zhasne také", [
    { value: "bude svítit dál", why: "Prasklá žárovka přeruší jedinou cestu proudu." },
    { value: "bude svítit silněji", why: "Proud přestane téct úplně." },
    { value: "začne blikat", why: "Proud neteče vůbec." },
  ], {
    hints: ["Kolik cest má proud, když jsou žárovky za sebou?", "Za sebou zapojené žárovky jsou na jedné cestě — když se cesta kdekoli přeruší, proud neteče nikam."],
    explanation: "U zapojení za sebou přeruší prasklá žárovka celý obvod, a zhasne i druhá.",
  }),
  choice("Proč ptáci sedící na drátech vysokého napětí nedostanou ránu?", "nedotýkají se zároveň země ani jiného drátu", [
    { value: "mají na nohou gumovou vrstvu, která je izoluje", why: "Ptačí nohy nejsou z gumy." },
    { value: "dráty vysokého napětí jsou uvnitř vypnuté", why: "Dráty jsou pod napětím." },
    { value: "ptáci jsou z látky, která proud nevede", why: "Ptačí tělo proud vede." },
  ], {
    hints: ["Proud potřebuje cestu dál. Kam by mohl z ptáka odtéct?", "Kdyby se pták dotkl zároveň drátu a sloupu nebo druhého drátu, proud by jím prošel."],
    explanation: "Pták se dotýká jen jednoho drátu, proud nemá kudy projít jeho tělem dál.",
  }),
  choice("Magnetem jsi mnohokrát přejel po ocelové jehle stále stejným směrem. Co se stalo?", "jehla se zmagnetovala", [
    { value: "jehla se rozžhavila", why: "Přejetím se jehla nezahřeje." },
    { value: "jehla zrezivěla", why: "Rez vzniká vlhkem, ne magnetem." },
    { value: "jehla přestala vést proud", why: "Ocel proud vede dál." },
  ], {
    hints: ["Co se stane s ocelí, která je dlouho u magnetu?", "Takto si můžeš vyrobit vlastní kompas: jehlu položíš na korek na vodě."],
    explanation: "Ocelová jehla se tím zmagnetovala a sama se stala magnetem.",
  }),
  choice("Proč se nesmí používat kabel s poškozenou izolací?", "proud by mohl projít do člověka", [
    { value: "kabel by se prodloužil", why: "Délka kabelu se nemění." },
    { value: "kabel by zmagnetoval okolí", why: "Nebezpečí je úraz proudem." },
    { value: "zařízení by svítilo jinou barvou", why: "Nebezpečí je úraz proudem." },
  ], {
    hints: ["K čemu je izolace na kabelu?", "Izolace odděluje vodivý drát od okolí; když je prasklá, drát je odhalený."],
    explanation: "Poškozenou izolací může proud projít do člověka — hrozí úraz.",
  }),
  choice("Který spotřebič mění elektrickou energii hlavně na teplo?", "rychlovarná konvice", [
    { value: "ventilátor", why: "Ventilátor mění elektřinu na pohyb." },
    { value: "rádio", why: "Rádio mění elektřinu na zvuk." },
    { value: "LED žárovka", why: "LED žárovka mění elektřinu hlavně na světlo." },
  ], {
    hints: ["Který spotřebič něco ohřívá?", "V tomto spotřebiči rozžhavená spirála uvaří vodu na čaj."],
    explanation: "Rychlovarná konvice mění elektřinu na teplo a ohřívá vodu.",
  }),
  choice("Který spotřebič mění elektřinu na pohyb?", "elektromotor ve vrtačce", [
    { value: "topinkovač", why: "Topinkovač mění elektřinu na teplo." },
    { value: "stolní lampa", why: "Lampa mění elektřinu na světlo." },
    { value: "rychlovarná konvice", why: "Konvice mění elektřinu na teplo." },
  ], {
    hints: ["Který spotřebič něco roztočí?", "Uvnitř je motor, který otáčí vrtákem."],
    explanation: "Elektromotor mění elektrickou energii na pohyb.",
  }),
  choice("Kde v domácnosti najdeš magnet?", "v těsnění dveří ledničky", [
    { value: "v dřevěné lžíci", why: "Dřevěná lžíce žádný magnet nemá." },
    { value: "ve skleněné váze", why: "Váza žádný magnet nemá." },
    { value: "v papírovém ubrousku", why: "Ubrousek žádný magnet nemá." },
  ], {
    hints: ["Co drží dveře ledničky zavřené?", "V gumovém okraji dveří je pružný pásek, který se přichytí k plechu skříně."],
    explanation: "V těsnění dveří ledničky je magnetický pásek, který drží dveře zavřené.",
  }),
  choice("Který obvod je uzavřený, aby žárovka svítila?", "baterie – drát – žárovka – drát – zpět k baterii", [
    { value: "baterie – drát – žárovka, druhý drát chybí", why: "Bez druhého drátu se proud nevrátí." },
    { value: "dva dráty připojené k jednomu pólu baterie", why: "Proud musí vést z jednoho pólu do druhého." },
    { value: "baterie – vypnutý vypínač – žárovka – drát", why: "Vypnutý vypínač obvod přeruší." },
  ], {
    hints: ["Musí se proud vrátit zpátky do baterie?", "Sleduj cestu prstem: z baterie, přes žárovku a zpátky — nesmí nikde chybět kus."],
    explanation: "Obvod je uzavřený, když proud oběhne celou cestu z baterie přes žárovku zpět.",
  }),
  choice("Kde jsi při bouřce nejvíc v bezpečí?", "uvnitř budovy nebo auta", [
    { value: "pod osamělým stromem", why: "Do vysokého osamělého stromu blesk udeří snadno." },
    { value: "na vrcholu kopce", why: "Na kopci jsi nejvyšší bod v okolí." },
    { value: "ve vodě", why: "Voda vede proud; z vody je potřeba vylézt." },
  ], {
    hints: ["Kam blesk nejčastěji udeří?", "Blesk hledá vysoká místa a vodu; budova s hromosvodem a auto s kovovou karoserií tě chrání."],
    explanation: "Nejbezpečněji je v budově nebo v autě; stromy, kopce a voda jsou nebezpečné.",
  }),
];

function gen(level: number): PracticeTask[] {
  return shuffle(level >= 3 ? L3 : level === 2 ? L2 : L1);
}

export const MAGNETYELEKTRINAJEDNODUCHEOBVODYUVOD: TopicMetadata[] = [
  {
    id: "g5-prirodoveda-rozmanitost-prirody-energie-a-jeji-zdroje-magnety-elektrina-jednoduche-obvody-uvod",
    rvpNodeId: "g5-prirodoveda-rozmanitost-prirody-energie-a-jeji-zdroje-magnety-elektrina-jednoduche-obvody-uvod",
    title: "Magnety, elektřina - jednoduché obvody (úvod)",
    studentTitle: "Magnety a elektřina",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Energie a její zdroje",
    briefDescription: "Poznáš, jak fungují magnety a jak sestavit jednoduchý elektrický obvod.",
    keywords: ["magnet", "elektřina", "obvod", "vodič", "izolant", "póly", "statická elektřina", "elektromagnet"],
    goals: ["Popsat vlastnosti magnetů a magnetické pole", "Vysvětlit, co je vodič a izolant", "Sestavit jednoduchý elektrický obvod"],
    boundaries: ["Neprobírá Ohmův zákon matematicky", "Neprobírá střídavý proud"],
    gradeRange: [5, 5],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Magnet: S a J pól – stejné odpuzují, různé přitahují. Obvod: zdroj + vodič + spotřebič.",
      steps: [
        "Magnet: S a J pól. Stejné = odpuzují. Různé = přitahují.",
        "Vodiče: kovy (měď, hliník). Izolanty: plast, guma.",
        "Jednoduchý obvod: baterie + vodič + žárovka (uzavřený okruh).",
        "Zkrat: obvod bez spotřebiče → nebezpečí přehřátí.",
      ],
      commonMistake: "Obvod musí být UZAVŘENÝ – přerušený obvod nefunguje.",
      example: "Baterie (1,5 V) → vodič (měď) → žárovka → zpět do baterie = svítí.",
    },
  },
];
