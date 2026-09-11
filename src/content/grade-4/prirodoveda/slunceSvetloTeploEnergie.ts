/**
 * Přírodověda 4. ročník — Slunce, světlo, teplo, energie.
 *
 * Přepsáno 2026-09-11. Původní pool byl z velké části o sluneční soustavě
 * a vesmíru (jaderná fúze, sluneční vítr, světelný rok, astronomická
 * jednotka, heliocentrismus, proč Venuše nemá měsíce) — to je látka
 * 5. ročníku, kde má vlastní téma „Země jako planeta". Úlohy navíc neměly
 * nápovědu, vysvětlení ani diagnostiku.
 *
 * Nová verze drží jádro uzlu: Slunce jako zdroj světla a tepla, stín,
 * den a noc, roční období, barvy a teplo, využití sluneční energie.
 *
 * Gradace:
 *  • L1 — základní fakta (co je Slunce, co dává, den a noc, zdroj světla).
 *  • L2 — použití: délka a směr stínu, proč je v létě tepleji, světlé
 *         oblečení, světové strany podle Slunce.
 *  • L3 — omyly a úvahy: v lednu je Země Slunci blíž, sluneční energie
 *         v uhlí, proč ve dne nevidíme hvězdy, co kdyby se Země neotáčela.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "./_shared";

const POOL_L1: PracticeTask[] = [
  choice("Co je Slunce?", "Hvězda, která sama svítí", [
    { value: "Planeta podobná Zemi", why: "Planety samy nesvítí, jen odrážejí světlo. Slunce svítí samo." },
    { value: "Měsíc, který obíhá Zemi", why: "Kolem Země obíhá Měsíc. Slunce je mnohem větší a svítí samo." },
    { value: "Velký kámen, který odráží světlo", why: "Světlo odráží třeba Měsíc. Slunce světlo vyrábí." },
  ], {
    hints: ["Je to těleso, které samo vyrábí světlo a teplo.", "Ostatní tělesa tohoto druhu vidíš v noci jako třpytivé tečky. Tohle je tak blízko, že je vidíš ve dne jako velký kotouč."],
    explanation: "Slunce je hvězda — obrovská koule horkých plynů, která sama svítí a hřeje. Je nám nejbližší hvězdou, proto se nám zdá tak velké.",
  }),
  choice("Co Slunce dává Zemi?", "Světlo a teplo", [
    { value: "Jen světlo, teplo ne", why: "Slunce i hřeje. Proto je na slunci tepleji než ve stínu." },
    { value: "Vodu na déšť", why: "Voda na Zemi už je. Slunce ji jen ohřeje a odpaří." },
    { value: "Vzduch k dýchání", why: "Vzduch obklopuje Zemi. Kyslík do něj dodávají rostliny." },
  ], {
    hints: ["Co cítíš, když stojíš na slunci, a co vidíš?", "Ve dne je díky němu vidět a na tváři cítíš, že pálí. Jaké dvě věci ti tedy dává?"],
    explanation: "Slunce Zemi osvětluje a ohřívá. Bez jeho světla by byla věčná tma a bez tepla by celá Země zamrzla.",
  }),
  choice("Za jak dlouho Země oběhne kolem Slunce?", "Za jeden rok", [
    { value: "Za jeden den", why: "Za den se Země otočí kolem své osy. Oběh kolem Slunce trvá déle." },
    { value: "Za jeden měsíc", why: "Zhruba za měsíc oběhne Zemi Měsíc. Země kolem Slunce obíhá rok." },
    { value: "Za jednu hodinu", why: "Za hodinu se Země pootočí jen o kousek. Oběh kolem Slunce trvá rok." },
  ], {
    hints: ["Během jednoho oběhu se vystřídají všechna roční období.", "Jaro, léto, podzim, zima — a pak zase znovu. Jak dlouho to celé trvá?"],
    explanation: "Země oběhne Slunce jednou za rok. Během toho se vystřídají jaro, léto, podzim a zima.",
  }),
  choice("Za jak dlouho se Země otočí kolem své osy?", "Za jeden den", [
    { value: "Za jeden rok", why: "Za rok Země oběhne Slunce. Kolem své osy se otočí mnohem rychleji." },
    { value: "Za jeden týden", why: "Kdyby se otáčela týden, trval by den i noc několik dní." },
    { value: "Za jednu hodinu", why: "Za hodinu by se den a noc střídaly pořád dokola. Otočení trvá 24 hodin." },
  ], {
    hints: ["Při jednom otočení se na tvém místě vystřídá den a noc.", "Od jednoho rána do dalšího rána se Země otočí jednou dokola. Kolik je to hodin?"],
    explanation: "Země se kolem své osy otočí jednou za 24 hodin, tedy za jeden den. Díky tomu se střídá den a noc.",
  }),
  choice("Proč se střídá den a noc?", "Země se otáčí kolem své osy", [
    { value: "Slunce večer zhasne", why: "Slunce svítí pořád. Jen se od něj naše strana Země odvrátí." },
    { value: "Měsíc zakryje Slunce", why: "Měsíc Slunce zakryje jen vzácně při zatmění, na pár minut." },
    { value: "Slunce obíhá kolem Země", why: "Tak to vypadá, ale je to naopak — Země se otáčí." },
  ], {
    hints: ["Slunce svítí pořád. Co se tedy mění?", "Představ si míč, na který svítí baterka. Když míčem otáčíš, která strana je osvětlená?"],
    explanation: "Země se otáčí jako káča. Strana otočená ke Slunci má den, odvrácená strana má noc. Slunce přitom svítí pořád.",
  }),
  choice("Proč se nesmíš dívat přímo do Slunce?", "Silné světlo poškodí oči", [
    { value: "Oči se unaví jen na chvíli", why: "Poškození oka může být trvalé, nejen únava." },
    { value: "Zhorší se tím počasí", why: "Pohled do Slunce počasí neovlivní. Škodí ale očím." },
    { value: "Slunce by přestalo hřát", why: "Slunce hřeje, ať se díváš, nebo ne. Nebezpečí hrozí tvým očím." },
  ], {
    hints: ["Která část těla to odnese?", "Slunce svítí tak silně, že by mohlo spálit citlivou část oka. Proto se nosí sluneční brýle a do Slunce se nedívá ani přes ně."],
    explanation: "Sluneční světlo je tak silné, že může spálit sítnici uvnitř oka, a to i trvale. Do Slunce se nesmí dívat ani krátce, ani dalekohledem.",
  }),
  choice("Co potřebují zelené rostliny ze Slunce, aby rostly?", "Světlo", [
    { value: "Tmu", why: "Ve tmě rostliny blednou a hynou. Světlo potřebují." },
    { value: "Mráz", why: "Mráz rostlinám spíš škodí." },
    { value: "Měsíční svit", why: "Měsíc svítí jen odraženým světlem a slabě. Rostlinám nestačí." },
  ], {
    hints: ["Proč se květiny otáčejí k oknu?", "Zelené listy zachycují něco ze Slunce a vyrábějí si z toho potravu. Co to je?"],
    explanation: "Zelené rostliny si v listech vyrábějí potravu a potřebují k tomu sluneční světlo. Proto se natáčejí k oknu a ve tmě hynou.",
  }),
  choice("Jak se jmenuje zařízení, které mění sluneční světlo na elektřinu?", "Solární panel", [
    { value: "Větrná elektrárna", why: "Větrná elektrárna vyrábí elektřinu z větru, ne ze světla." },
    { value: "Baterie", why: "Baterie elektřinu jen uchovává, nevyrábí ji ze světla." },
    { value: "Žárovka", why: "Žárovka dělá opak — z elektřiny vyrábí světlo." },
  ], {
    hints: ["Takové tmavé desky vidíš na střechách domů.", "Tmavé lesklé desky na střeše zachytávají světlo a mění ho na proud do zásuvky. Jak se jim říká?"],
    explanation: "Solární panel mění sluneční světlo na elektřinu. Proto se dávají na střechy, kam svítí slunce nejvíc.",
  }),
  choice("Který z těchto předmětů sám vydává světlo?", "Hořící svíčka", [
    { value: "Zrcadlo", why: "Zrcadlo světlo jen odráží. Ve tmě nesvítí." },
    { value: "Měsíc", why: "Měsíc jen odráží světlo Slunce, sám nesvítí." },
    { value: "Okno", why: "Okno světlo propouští, samo ho nevydává." },
  ], {
    hints: ["Který z nich by svítil i v úplně tmavém pokoji?", "Zrcadlo i Měsíc světlo jen vracejí a okno ho propouští. Co svítí samo, protože hoří?"],
    explanation: "Hořící svíčka sama vydává světlo, stejně jako Slunce nebo žárovka. Zrcadlo a Měsíc světlo jen odrážejí a okno ho propouští.",
  }),
  choice("Proč je ve stínu chladněji než na slunci?", "Nedopadají tam sluneční paprsky", [
    { value: "Stín vyrábí chlad", why: "Stín nic nevyrábí. Jen tam nesvítí slunce, takže nehřeje." },
    { value: "Ve stínu vždycky fouká", why: "Vítr fouká všude stejně. Rozdíl dělají sluneční paprsky." },
    { value: "Stromy vyrábějí led", why: "Stromy led nevyrábějí. Jen zachytí sluneční paprsky." },
  ], {
    hints: ["Co ohřívá zem, když svítí slunce?", "Strom nebo slunečník zachytí něco, co by jinak dopadlo na tebe a hřálo. Co to je?"],
    explanation: "Sluneční paprsky ohřívají všechno, na co dopadnou. Stín vzniká tam, kam je něco nepustí — proto se tam tolik nehřeje.",
  }),
  choice("Co vznikne za předmětem, na který svítí Slunce?", "Stín", [
    { value: "Duha", why: "Duha vzniká, když slunce svítí do kapek deště." },
    { value: "Odraz", why: "Odraz vidíš v zrcadle nebo na vodě, ne za předmětem." },
    { value: "Ozvěna", why: "Ozvěna je odražený zvuk, se světlem nesouvisí." },
  ], {
    hints: ["Když jdeš po slunci, něco tmavého jde s tebou po zemi.", "Předmět nepustí světlo dál, a tak je za ním tmavé místo stejného tvaru. Jak se mu říká?"],
    explanation: "Stín vzniká za předmětem, který nepropouští světlo. Paprsky se o předmět zastaví a za ním zůstane tmavší místo.",
  }),
  choice("Ve kterém ročním období je u nás den nejdelší?", "V létě", [
    { value: "V zimě", why: "V zimě je den nejkratší — brzy se stmívá." },
    { value: "Na podzim", why: "Na podzim se dny zkracují." },
    { value: "Na jaře", why: "Na jaře se dny prodlužují, nejdelší jsou ale v létě." },
  ], {
    hints: ["Kdy chodíš spát a venku je ještě světlo?", "O prázdninách je světlo skoro do deseti večer, v prosinci je tma už ve čtyři. Ve kterém období je tedy den nejdelší?"],
    explanation: "Nejdelší den u nás je na začátku léta, kolem 21. června. V zimě je naopak den nejkratší. Proto je v létě tepleji — Slunce hřeje déle.",
  }),
  choice("Která hvězda je Zemi nejbližší?", "Slunce", [
    { value: "Polárka", why: "Polárka je hvězda, ale velmi daleko. Vidíme ji jen v noci jako malou tečku." },
    { value: "Měsíc", why: "Měsíc není hvězda — sám nesvítí a obíhá Zemi." },
    { value: "Večernice", why: "Večernice je planeta Venuše, ne hvězda." },
  ], {
    hints: ["Je to hvězda, kterou vidíš každý den.", "Ostatní hvězdy vidíš jen v noci jako tečky. Jedna je tak blízko, že ve dne svítí a hřeje."],
    explanation: "Nejbližší hvězdou je Slunce. Ostatní hvězdy jsou tak daleko, že je vidíme jen jako malé tečky na noční obloze.",
  }),
];

const POOL_L2: PracticeTask[] = [
  choice("Kdy je stín na slunci nejkratší?", "V poledne", [
    { value: "Ráno", why: "Ráno je Slunce nízko a stíny jsou dlouhé." },
    { value: "Večer", why: "Večer je Slunce zase nízko a stíny se prodlužují." },
    { value: "V noci", why: "V noci Slunce nesvítí, takže sluneční stín není vůbec." },
  ], {
    hints: ["Kdy je Slunce na obloze nejvýš?", "Čím výš je Slunce, tím kratší stín. Ve kterou denní dobu vystoupá nejvýš?"],
    explanation: "Stín je nejkratší, když je Slunce nejvýš na obloze, a to je kolem poledne. Ráno a večer je Slunce nízko a stíny jsou dlouhé.",
  }),
  choice("Ráno máš na slunci dlouhý stín. Proč?", "Slunce je nízko nad obzorem", [
    { value: "Ráno jsi vyšší", why: "Tvoje výška se přes den nemění. Mění se výška Slunce." },
    { value: "Ráno Slunce svítí slaběji", why: "Síla světla délku stínu neurčuje. Rozhoduje, jak vysoko Slunce je." },
    { value: "Stín ráno roste s tebou", why: "Stín neroste. Jen mění délku podle polohy Slunce." },
  ], {
    hints: ["Kde je Slunce ráno — vysoko, nebo nízko?", "Posviť baterkou na hrneček zboku, skoro od stolu, a pak shora. Kdy je stín delší?"],
    explanation: "Ráno je Slunce nízko nad obzorem a svítí šikmo, proto je stín dlouhý. K poledni Slunce stoupá a stín se zkracuje.",
  }),
  choice("Co je zdrojem skoro veškeré energie na Zemi?", "Slunce", [
    { value: "Měsíc", why: "Měsíc nesvítí sám a nehřeje. Energie od něj téměř nepřichází." },
    { value: "Vítr", why: "Vítr vzniká, protože Slunce ohřívá vzduch nestejně. Vítr sám zdrojem není." },
    { value: "Uhlí", why: "Uhlí vzniklo z pravěkých rostlin, které rostly díky Slunci." },
  ], {
    hints: ["Čím rostou rostliny a z čeho vzniklo uhlí?", "Rostliny rostou díky světlu, zvířata jedí rostliny a vítr fouká, protože se vzduch nestejně ohřívá. Co je za tím vším?"],
    explanation: "Slunce dává světlo a teplo. Díky němu rostou rostliny, které jedí zvířata. Ohřívá vzduch, a tak vzniká vítr. I uhlí vzniklo z rostlin, které kdysi rostly na slunci.",
  }),
  choice("Proč je v létě tepleji než v zimě?", "Slunce je výš, hřeje strměji a déle", [
    { value: "V létě je Země blíž Slunci", why: "Je to naopak — Země je Slunci nejblíž v lednu. Rozhoduje výška Slunce a délka dne." },
    { value: "Slunce v létě víc hoří", why: "Slunce svítí pořád stejně. Mění se, jak k nám paprsky dopadají." },
    { value: "V zimě Slunce nevychází", why: "V zimě Slunce vychází, jen je nízko a den je krátký." },
  ], {
    hints: ["Kde je Slunce v poledne v létě a kde v zimě?", "V létě stoupá Slunce vysoko a svítí přes 15 hodin. V zimě je nízko a svítí jen asi 8 hodin. Kdy hřeje víc?"],
    explanation: "V létě je Slunce vysoko, paprsky dopadají strmě a hřejí víc. A den je dlouhý, takže hřejí déle. V zimě je Slunce nízko a den krátký.",
  }),
  choice("Proč se v létě nosí raději světlé oblečení?", "Světlé věci odrážejí sluneční teplo", [
    { value: "Tmavé věci odrážejí víc", why: "Je to naopak. Tmavé věci teplo pohlcují, světlé ho odrážejí." },
    { value: "Světlé věci jsou lehčí", why: "Barva váhu nemění. Rozdíl je v tom, kolik tepla látka pohltí." },
    { value: "Barva na teplo vliv nemá", why: "Má. Na slunci je tmavé tričko mnohem teplejší než bílé." },
  ], {
    hints: ["Sáhni v létě na černé a bílé auto na slunci. Které pálí víc?", "Tmavá barva sluneční paprsky pohltí a zahřeje se. Co udělá s paprsky světlá barva?"],
    explanation: "Světlé věci většinu slunečních paprsků odrazí a zůstanou chladnější. Tmavé paprsky pohltí a zahřejí se. Proto je v létě příjemnější bílé tričko.",
  }),
  choice("Proč se v létě kolem poledne doporučuje být ve stínu?", "Slunce pálí nejvíc a může spálit kůži", [
    { value: "V poledne je největší zima", why: "V poledne je naopak nejtepleji." },
    { value: "Stín je v poledne nejdelší", why: "V poledne je stín nejkratší, protože je Slunce nejvýš." },
    { value: "V poledne Slunce nesvítí", why: "V poledne svítí nejsilněji." },
  ], {
    hints: ["Kdy je Slunce nejvýš a jeho paprsky nejsilnější?", "Když jsou paprsky nejsilnější, kůže zrudne a pálí. Kdy během dne je to nejhorší?"],
    explanation: "Kolem poledne je Slunce nejvýš a paprsky dopadají nejstrměji, takže nejvíc pálí a mohou spálit kůži. Proto se doporučuje stín, pokrývka hlavy a opalovací krém.",
  }),
  choice("Jak lidé využívají sluneční energii?", "Vyrábějí z ní elektřinu a ohřívají vodu", [
    { value: "Svítí s ní v noci bez baterií", why: "V noci Slunce nesvítí. Energii by museli předem uložit do baterií." },
    { value: "Hasí s ní požáry v lese", why: "Sluneční energie oheň neuhasí." },
    { value: "Vyrábějí z ní uhlí pod zemí", why: "Uhlí vzniklo z pravěkých rostlin, dnes se ze slunce nevyrábí." },
  ], {
    hints: ["Co je na střechách některých domů?", "Na střechách bývají dva druhy desek: jedny vyrábějí proud, druhé dávají teplou vodu do koupelny. Co z toho plyne?"],
    explanation: "Solární panely mění sluneční světlo na elektřinu a sluneční kolektory ohřívají vodu. Obojí využívá energii Slunce, která nic nestojí a nedochází.",
  }),
  choice("Proč rostliny ve tmavém sklepě blednou a hynou?", "Bez světla si nevyrobí potravu", [
    { value: "Ve sklepě je příliš teplo", why: "Sklep bývá spíš chladný. Rostlinám chybí světlo." },
    { value: "Sklep je moc tichý", why: "Rostliny ticho nevadí. Potřebují světlo." },
    { value: "Ve sklepě nejsou žížaly", why: "Žížaly pomáhají půdě, ale bez světla rostlina nepřežije ani s nimi." },
  ], {
    hints: ["Z čeho si zelená rostlina vyrábí potravu?", "Zelené listy pracují jen na světle. Co se stane s rostlinou, která si nemá z čeho udělat jídlo?"],
    explanation: "Zelené rostliny si potravu vyrábějí v listech a potřebují k tomu světlo. Ve tmě ztratí zelenou barvu, zeslábnou a nakonec uhynou.",
  }),
  choice("Na které straně oblohy Slunce ráno vychází?", "Na východě", [
    { value: "Na západě", why: "Na západě Slunce večer zapadá." },
    { value: "Na severu", why: "Na severu Slunce u nás nikdy nestojí vysoko. Vychází na východě." },
    { value: "Na jihu", why: "Na jihu je Slunce v poledne. Vychází na východě." },
  ], {
    hints: ["Kde je Slunce večer, když zapadá? Ráno je to opačná strana.", "Slunce vychází ráno, v poledne je na jihu a večer zapadá na západě. Kde tedy začíná?"],
    explanation: "Slunce vychází na východě, v poledne je na jihu a zapadá na západě. Podle toho se dá určit světová strana i bez kompasu.",
  }),
  choice("Na které straně oblohy je Slunce v poledne?", "Na jihu", [
    { value: "Na severu", why: "U nás je Slunce v poledne na opačné straně, na jihu." },
    { value: "Na východě", why: "Na východě Slunce ráno vychází." },
    { value: "Na západě", why: "Na západě Slunce večer zapadá." },
  ], {
    hints: ["Ráno je Slunce na východě a večer na západě. Kde je mezi tím?", "Tvůj polední stín ukazuje na sever. Slunce je vždycky na opačné straně než stín."],
    explanation: "V poledne je u nás Slunce na jihu a stíny ukazují na sever. Ráno je na východě a večer na západě.",
  }),
  choice("Proč led na slunci roztaje dřív než ve stínu?", "Sluneční paprsky ho ohřívají", [
    { value: "Na slunci je víc vzduchu", why: "Vzduchu je všude stejně. Rozdíl dělají sluneční paprsky." },
    { value: "Ve stínu led nemůže tát", why: "Ve stínu led taje taky, jen pomaleji." },
    { value: "Slunce led rozbije světlem", why: "Světlo led nerozbíjí. Ohřívá ho, a tak led taje." },
  ], {
    hints: ["Co cítíš na kůži, když stojíš na slunci?", "Na slunci se zahřeje lavička, kámen i sníh. Co se stane s ledem, když se zahřeje?"],
    explanation: "Sluneční paprsky led ohřívají. Když se ohřeje nad nulu, roztaje. Ve stínu paprsky nedopadají, a tak led taje pomaleji.",
  }),
  choice("Proč mají skleníky prosklené stěny?", "Světlo projde dovnitř a teplo zůstane", [
    { value: "Aby bylo vidět dovnitř", why: "Průhlednost pomáhá pěstiteli, ale hlavní je světlo a teplo pro rostliny." },
    { value: "Sklo chrání před deštěm", why: "Před deštěm by chránila i střecha z plechu. Sklo pouští dovnitř světlo." },
    { value: "Sklo je nejlevnější", why: "Sklo levné není. Používá se, protože propouští světlo." },
  ], {
    hints: ["Co rostliny potřebují a co jim ve skleníku dává sklo?", "Vzpomeň si na auto, které stálo na slunci. Sklem se dovnitř dostanou paprsky a uvnitř je pak horko. Proč to pěstitelům pomáhá?"],
    explanation: "Sklem projde sluneční světlo, které rostliny potřebují. Uvnitř se změní na teplo a to zůstane uvnitř. Ve skleníku je proto tepleji a rostliny rostou i na jaře a na podzim.",
  }),
  choice("Voda v zahradním bazénu se přes den ohřeje. Odkud má teplo?", "Ze slunečních paprsků", [
    { value: "Od Měsíce", why: "Měsíc nehřeje a ve dne je často vidět jen slabě." },
    { value: "Z hloubky Země", why: "Bazén stojí na povrchu. Teplo z hloubky Země ho neohřeje." },
    { value: "Z vody z vodovodu", why: "Voda z vodovodu je studená. Ohřeje ji až slunce." },
  ], {
    hints: ["Kdy je voda v bazénu nejteplejší — po slunečném, nebo po zamračeném dni?", "Když je celý den zataženo, voda zůstane studená. Co ji tedy ohřívá, když je hezky a obloha je bez mraků?"],
    explanation: "Sluneční paprsky dopadají na vodu a ohřívají ji. Po slunečném dni je voda teplá, po zamračeném zůstane studená.",
  }),
];

const POOL_L3: PracticeTask[] = [
  choice("V lednu je Země Slunci blíž než v červenci. Proč je u nás přesto v lednu zima?", "Slunce je nízko a den je krátký", [
    { value: "Slunce v lednu svítí slaběji", why: "Slunce svítí pořád stejně. Mění se, jak vysoko je a jak dlouho svítí." },
    { value: "V lednu Slunce zakrývá Měsíc", why: "Měsíc Slunce zakryje jen při vzácném zatmění na pár minut." },
    { value: "Na vzdálenosti vůbec nezáleží", why: "Vzdálenost se během roku mění jen málo. Rozhodující je výška Slunce a délka dne." },
  ], {
    hints: ["Vzdálenost od Slunce tedy roční období nezpůsobuje. Co jiného se v zimě mění?", "Podívej se v lednu v poledne, jak vysoko je Slunce, a spočítej, kolik hodin je světlo. A v červenci?"],
    explanation: "Roční období nezpůsobuje vzdálenost od Slunce. V zimě je Slunce nízko, paprsky dopadají šikmo a slabě hřejí, a den je krátký. V létě je Slunce vysoko a svítí dlouho.",
  }),
  choice("Měsíc v noci svítí. Proč přesto není hvězda?", "Jen odráží světlo Slunce", [
    { value: "Protože je menší než Země", why: "Velikost nerozhoduje. Rozhoduje, jestli těleso samo svítí." },
    { value: "Protože svítí jen v noci", why: "Hvězdy také vidíme jen v noci. Rozdíl je, že Měsíc světlo jen odráží." },
    { value: "Protože má kráter", why: "Krátery o tom nerozhodují. Hvězda sama vyrábí světlo." },
  ], {
    hints: ["Co musí umět těleso, aby bylo hvězdou?", "Hvězda svítí sama jako žárovka. Měsíc svítí jako zrcadlo, na které někdo posvítil. Kdo na něj svítí?"],
    explanation: "Hvězda sama vyrábí světlo. Měsíc sám nesvítí — jen odráží světlo Slunce jako zrcadlo. Proto vidíme jeho osvětlenou část a měnící se fáze.",
  }),
  choice("Proč se říká, že i v uhlí je uložená sluneční energie?", "Uhlí vzniklo z rostlin, které rostly díky Slunci", [
    { value: "Uhlí se vyrábí v solárních panelech", why: "Uhlí se těží ze země. Solární panely vyrábějí elektřinu." },
    { value: "Uhlí je černé a pohlcuje světlo", why: "Barva s tím nesouvisí. Jde o to, z čeho uhlí vzniklo." },
    { value: "Uhlí kdysi spadlo ze Slunce", why: "Ze Slunce nic nespadlo. Uhlí vzniklo na Zemi z rostlin." },
  ], {
    hints: ["Uhlí se těží hluboko pod zemí. Co tam kdysi bylo?", "Před milióny let rostly obrovské pralesy. Rostliny potřebovaly k růstu světlo. Co se z nich pod zemí stalo?"],
    explanation: "Uhlí vzniklo pod zemí z pravěkých rostlin. Ty rostly díky slunečnímu světlu a uložily jeho energii do svého těla. Když uhlí hoří, tahle dávná energie se uvolní jako teplo.",
  }),
  choice("Proč stín stromu během dne mění směr?", "Slunce se po obloze posouvá od východu k západu", [
    { value: "Strom se během dne otáčí", why: "Strom stojí na místě. Pohybuje se Slunce po obloze." },
    { value: "Stín odnáší vítr", why: "Vítr stín neposune. Stín se mění podle polohy Slunce." },
    { value: "Stín se mění podle teploty", why: "Teplota směr stínu neurčuje. Určuje ho, kde je Slunce." },
  ], {
    hints: ["Stín je vždycky na opačné straně než Slunce.", "Ráno je Slunce na východě, v poledne na jihu a večer na západě. Kam tedy ukazuje stín ráno a kam večer?"],
    explanation: "Stín leží vždy na opačné straně než Slunce. Slunce se během dne posouvá po obloze od východu přes jih k západu — protože se Země otáčí — a stín se otáčí s ním.",
  }),
  choice("Tmavá a světlá dlaždice leží na slunci. Která bude teplejší?", "Tmavá, protože pohltí víc světla", [
    { value: "Světlá, protože odráží světlo", why: "Odražené světlo dlaždici neohřeje. Teplejší bude ta, která světlo pohltí." },
    { value: "Obě stejně, barva nerozhoduje", why: "Barva rozhoduje. Tmavé věci se na slunci zahřejí víc." },
    { value: "Tmavá, protože je těžší", why: "Váha s tím nesouvisí. Rozhoduje, kolik světla dlaždice pohltí." },
  ], {
    hints: ["Vzpomeň si, proč se v létě nosí bílé tričko.", "Světlá barva paprsky vrací zpátky, tmavá je spolkne. Která dlaždice si tedy nechá víc tepla?"],
    explanation: "Tmavá dlaždice pohltí většinu slunečního světla a to se v ní změní na teplo. Světlá většinu světla odrazí, a tak zůstane chladnější.",
  }),
  choice("Liška rostliny nejí. Proč i ona potřebuje Slunce?", "Loví zvířata, která se živí rostlinami", [
    { value: "Liška se ohřívá na slunci", why: "Liška je teplokrevná, teplo si vyrábí sama. Slunce potřebuje kvůli potravě." },
    { value: "Liška loví jen ve dne", why: "Liška loví hlavně za soumraku a v noci. Na Slunci závisí přes potravu." },
    { value: "Liška Slunce nepotřebuje", why: "Potřebuje. Bez rostlin by nebyli zajíci ani myši, které loví." },
  ], {
    hints: ["Co liška jí a co jí to zvíře?", "Liška loví zajíce a myši. Ti se živí rostlinami. A rostliny rostou díky čemu?"],
    explanation: "Liška jí zajíce a myši, a ti se živí rostlinami. Rostliny rostou díky slunečnímu světlu. Bez Slunce by nebyly rostliny, býložravci ani lišky.",
  }),
  choice("Vyrábějí solární panely elektřinu i v noci?", "Ne, v noci na ně nesvítí Slunce", [
    { value: "Ano, stejně jako ve dne", why: "Panely potřebují světlo. V noci proud nevyrábějí." },
    { value: "Ano, svítí na ně Měsíc", why: "Měsíční svit je příliš slabý, panel z něj skoro nic nevyrobí." },
    { value: "Ne, protože v noci je zima", why: "Zima jim nevadí. Chybí jim světlo." },
  ], {
    hints: ["Z čeho panel vyrábí elektřinu?", "Panel mění světlo na proud. Kolik světla na něj dopadá o půlnoci?"],
    explanation: "Solární panely vyrábějí elektřinu jen ze světla. V noci nesvítí Slunce, a tak nevyrábějí nic. Proto se k nim dávají baterie, které elektřinu přes den uloží.",
  }),
  choice("Ráno je na trávě rosa. Proč na slunci zmizí dřív než ve stínu?", "Slunce vodu ohřeje a ta se vypaří", [
    { value: "Rosu na slunci vypije tráva", why: "Tráva rosu nevypije. Rosa se vypaří." },
    { value: "Ve stínu se rosa pořád tvoří", why: "Rosa se tvoří v noci. Ve stínu se jen pomaleji vypařuje." },
    { value: "Slunce rosu odfoukne", why: "Slunce nefouká. Ohřívá vodu, a ta se mění na páru." },
  ], {
    hints: ["Co se stane s kaluží po dešti, když vysvitne slunce?", "Teplá voda se mění na neviditelnou páru rychleji než studená. Kde se kapky rosy zahřejí dřív?"],
    explanation: "Sluneční paprsky kapky rosy ohřejí a voda se rychle vypaří. Ve stínu je chladněji, a tak se tam rosa vypařuje pomaleji.",
  }),
  choice("Proč bývají sudy na dešťovou vodu na zahradě černé?", "Černá pohltí víc tepla a voda se ohřeje", [
    { value: "Černá je nejlevnější barva", why: "Cena není důvod. Černá barva pomáhá vodu ohřát." },
    { value: "Černá voda je čistší", why: "Barva sudu čistotu vody neovlivní." },
    { value: "Černá odráží teplo, aby voda nebyla teplá", why: "Černá teplo neodráží, ale pohlcuje." },
  ], {
    hints: ["Která barva se na slunci zahřeje víc?", "Rostliny nemají rády ledovou vodu. Barva sudu může pomoci vodu zahřát. Která to je?"],
    explanation: "Černá barva pohltí většinu slunečního světla a změní ho na teplo. Voda v černém sudu se ohřeje a rostlinám pak zálivka neublíží chladem.",
  }),
  choice("Mraky zakryjí Slunce. Proč je přesto ve dne světlo?", "Světlo mraky prochází, jen slabší", [
    { value: "Mraky svítí samy", why: "Mraky jsou z kapiček vody a samy nesvítí." },
    { value: "Světlo dává Měsíc", why: "Měsíc jen odráží světlo Slunce a je slabý. Ve dne svítí Slunce skrz mraky." },
    { value: "Ve dne je světlo i bez Slunce", why: "Bez Slunce by byla tma jako v noci." },
  ], {
    hints: ["Je v zamračený den stejné světlo jako za jasného dne?", "Když podržíš proti lampě papír, světlo jím trochu prosvítá. Jak je to s mraky a Sluncem?"],
    explanation: "Mraky Slunce zakryjí, ale jeho světlo jimi zčásti prochází a rozptýlí se. Proto je i v zamračený den světlo, jen slabší než za jasného počasí.",
  }),
  choice("Proč kniha na slunci vrhá stín, ale čisté okenní sklo skoro ne?", "Kniha světlo nepropustí, sklo ano", [
    { value: "Sklo je tenčí než kniha", why: "I tenký papír vrhá stín. Nejde o tloušťku, ale o to, jestli světlo projde." },
    { value: "Kniha je těžší", why: "Váha stín nedělá. Rozhoduje, jestli předmět světlo propustí." },
    { value: "Sklo odráží všechny paprsky", why: "Kdyby sklo všechno odráželo, nebylo by skrz něj vidět. Sklo světlo propouští." },
  ], {
    hints: ["Kdy vzniká stín?", "Stín je tam, kam světlo nedoletí. Projde světlo knihou? A projde sklem?"],
    explanation: "Stín vzniká za předmětem, který světlo nepropustí. Kniha světlo zastaví, a proto má stín. Čisté sklo světlo skoro celé propustí, a tak téměř žádný stín nevrhá.",
  }),
  choice("Kdyby se Země přestala otáčet, co by se stalo se dnem a nocí?", "Na jedné straně by byl stále den, na druhé noc", [
    { value: "Den a noc by se střídaly rychleji", why: "Střídání dne a noci způsobuje právě otáčení. Bez něj by se nestřídaly vůbec." },
    { value: "Všude by byla stále noc", why: "Slunce by dál svítilo na tu stranu, která je k němu natočená." },
    { value: "Nic by se nezměnilo", why: "Den a noc se střídají jen proto, že se Země otáčí." },
  ], {
    hints: ["Čím vzniká střídání dne a noci?", "Posviť baterkou na míč a přestaň jím otáčet. Co bude pořád na osvětlené straně a co na druhé?"],
    explanation: "Den a noc se střídají, protože se Země otáčí. Kdyby se zastavila, jedna strana by byla pořád obrácená ke Slunci a měla stálý den, druhá by měla věčnou noc.",
  }),
  choice("Proč ve dne nevidíme na obloze hvězdy?", "Svítí i ve dne, ale Slunce je přezáří", [
    { value: "Hvězdy ve dne zhasnou", why: "Hvězdy svítí pořád. Jen je ve dne přes světlo Slunce nevidíme." },
    { value: "Hvězdy ve dne schová Měsíc", why: "Měsíc je malý a hvězdy nezakryje. Přezáří je Slunce." },
    { value: "Hvězdy se ve dne otočí jinam", why: "Hvězdy se neotáčejí jinam. Jsou na obloze, jen je nevidíme." },
  ], {
    hints: ["Uvidíš rozsvícenou baterku v poledne na slunci?", "Světlo slabé baterky v tmavém pokoji uvidíš hned, ale na slunci skoro vůbec. Co se děje s hvězdami ve dne?"],
    explanation: "Hvězdy svítí i ve dne. Světlo Slunce je ale tak silné, že slabé světlo vzdálených hvězd přezáří. Jakmile se setmí, hvězdy se objeví.",
  }),
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool);
}

export const SLUNCESVETLOTEPLOENERGIE: TopicMetadata[] = [
  {
    id: "g4-prirodoveda-rozmanitost-prirody-neziva-priroda-slunce-svetlo-teplo-energie",
    rvpNodeId: "g4-prirodoveda-rozmanitost-prirody-neziva-priroda-slunce-svetlo-teplo-energie",
    title: "Slunce, světlo, teplo, energie",
    studentTitle: "Slunce, světlo a teplo",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Rozmanitost přírody",
    briefDescription: "Poznáš, co nám dává Slunce a jak vzniká stín, den a noc.",
    keywords: ["Slunce", "světlo", "teplo", "stín", "den a noc", "roční období", "sluneční energie", "solární panel"],
    goals: [
      "Vysvětlit, proč je Slunce hvězda a co dává Zemi",
      "Popsat, jak vzniká stín a proč mění délku a směr",
      "Vysvětlit střídání dne a noci a ročních období",
      "Uvést, jak lidé využívají sluneční energii",
    ],
    boundaries: [
      "Planety sluneční soustavy a pohyby Země podrobně — 5. ročník (Země jako planeta)",
      "Jaderná fúze a stavba Slunce nejsou náplní 4. ročníku",
    ],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Slunce je hvězda: samo svítí a hřeje. Většina toho, co se na Zemi děje, začíná jeho světlem.",
      steps: [
        "Den a noc: Země se otočí kolem osy za 24 hodin.",
        "Rok: Země oběhne Slunce za 365 dní.",
        "Stín je na opačné straně než Slunce. V poledne je nejkratší.",
        "V létě je Slunce výš a den delší, proto je tepleji.",
      ],
      commonMistake: "Roční období nezpůsobuje vzdálenost od Slunce, ale to, jak vysoko Slunce je a jak dlouho svítí.",
      example: "Ráno je Slunce na východě a stín dlouhý, v poledne je na jihu a stín nejkratší.",
    },
  },
];
