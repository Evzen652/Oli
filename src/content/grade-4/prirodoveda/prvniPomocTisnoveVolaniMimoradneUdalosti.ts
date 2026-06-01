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
  { question: "Na jaké číslo zavoláš záchrannou službu (ZZS)?", correctAnswer: "155", options: ["155", "150", "158", "112"] },
  { question: "Na jaké číslo zavoláš hasiče?", correctAnswer: "150", options: ["150", "155", "158", "112"] },
  { question: "Na jaké číslo zavoláš policii?", correctAnswer: "158", options: ["158", "150", "155", "112"] },
  { question: "Jaké číslo funguje v celé EU a vždy?", correctAnswer: "112", options: ["112", "150", "155", "158"] },
  { question: "Co musíš jako první říct při tísňovém volání?", correctAnswer: "KDE se to stalo — přesná adresa nebo popis místa", options: ["KDE se to stalo — přesná adresa nebo popis místa", "Své jméno", "Kolik je ti let", "Co potřebuješ"] },
  { question: "Kdo zavěšuje jako první při tísňovém volání?", correctAnswer: "Dispečer (operátor záchranné služby) — nikdy ty", options: ["Dispečer (operátor záchranné služby) — nikdy ty", "Ty, jakmile řekneš adresu", "Oba najednou", "Záleží na situaci"] },
  { question: "Co uděláš s popáleninou?", correctAnswer: "Chladíš studenou (ne ledovou) vodou 10–20 minut", options: ["Chladíš studenou (ne ledovou) vodou 10–20 minut", "Přikryješ máslem nebo olejem", "Rozbijíš puchýř a obváž ránu", "Přiložíš led přímo na kůži"] },
  { question: "Co uděláš při silném krvácení z rány?", correctAnswer: "Přitlačíš tlakovým obvazem — přímý tlak na ránu, zvedneš končetinu", options: ["Přitlačíš tlakovým obvazem — přímý tlak na ránu, zvedneš končetinu", "Osprchujíš ránu studenou vodou", "Necháš krvácení samo zastavit", "Přiložíš led na ránu"] },
  { question: "Co uděláš, když někdo omdlí a dýchá?", correctAnswer: "Uložíš do stabilní (zotavovací) polohy na bok", options: ["Uložíš do stabilní (zotavovací) polohy na bok", "Posadíš ho vzpřímeně na židli", "Necháš ho ležet na zádech bez změny", "Vléváš mu vodu do úst"] },
  { question: "Co je KPR (kardiopulmonální resuscitace)?", correctAnswer: "Záchranné stlačování hrudníku + záchranné vdechy pro zachování oběhu", options: ["Záchranné stlačování hrudníku + záchranné vdechy pro zachování oběhu", "Masáž zad při bolesti", "Umělé dýchání bez stlačování hrudníku", "Ochlazování horečnatého pacienta"] },
  { question: "Jaký je poměr stisků hrudníku k záchranným vdechům při KPR?", correctAnswer: "30 stisků : 2 vdechy", options: ["30 stisků : 2 vdechy", "15 stisků : 1 vdech", "10 stisků : 5 vdechů", "50 stisků : 0 vdechů"] },
  { question: "Co uděláš při zlomenině kosti?", correctAnswer: "Nepohybuješ zlomenou částí, přiložíš dlahu a zavoláš 155", options: ["Nepohybuješ zlomenou částí, přiložíš dlahu a zavoláš 155", "Vyrovnáš kost do správné polohy", "Masíruješ zraněné místo", "Dáš led přímo na kost"] },
  { question: "Co je stabilní poloha?", correctAnswer: "Poloha na boku pro bezvědomého, který dýchá — udrží volné dýchací cesty", options: ["Poloha na boku pro bezvědomého, který dýchá — udrží volné dýchací cesty", "Poloha vsedě pro zraněného", "Vodorovná poloha na zádech bez ohledu na dýchání", "Poloha s nohama výše než hlava"] },
  { question: "Co uděláš při dušení (uvíznutí sousta)?", correctAnswer: "Heimlichův manévr — 5 úderů do zad, pak tlak pod hrudník (pro dospělé)", options: ["Heimlichův manévr — 5 úderů do zad, pak tlak pod hrudník (pro dospělé)", "Vléváš vodu do úst", "Dáš postiženému ulehnout na záda", "Čekáš, až sousto samo vyjde"] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Co všechno musíš říci dispečerovi při tísňovém volání?", correctAnswer: "KDE (adresa), CO se stalo, KOLIK postižených, jejich STAV, TVOJE jméno a telefon", options: ["KDE (adresa), CO se stalo, KOLIK postižených, jejich STAV, TVOJE jméno a telefon", "Jen kde a co se stalo", "Jen adresu a jméno", "Jen počet zraněných a telefon"] },
  { question: "Jak hluboko stlačovat hrudník při KPR?", correctAnswer: "Cca 5–6 cm, rychlost cca 100–120 stisků za minutu", options: ["Cca 5–6 cm, rychlost cca 100–120 stisků za minutu", "Cca 2 cm, rychlost 50 stisků za minutu", "Cca 10 cm, rychlost 60 stisků za minutu", "Cca 3 cm, rychlost 80 stisků za minutu"] },
  { question: "Proč není dobré přiložit led přímo na popáleninu?", correctAnswer: "Způsobuje poranění zmrazením — studenou voda chladí bezpečněji", options: ["Způsobuje poranění zmrazením — studenou voda chladí bezpečněji", "Led nemá chladivý efekt na popáleniny", "Led by vyvolal alergickou reakci", "Popáleniny se nechladí vůbec"] },
  { question: "Jak poznáš příznaky zlomeniny?", correctAnswer: "Bolest, otok, modřina, deformace — zraněný nemůže hýbat končetinou", options: ["Bolest, otok, modřina, deformace — zraněný nemůže hýbat končetinou", "Silné krvácení a bledost", "Svědění a vyrážka v místě úrazu", "Horečka a nevolnost bez vnějšího poranění"] },
  { question: "Co je šokový stav a jak první pomoci?", correctAnswer: "Stav selhávajícího oběhu — polož postiženého, zvedni nohy, přikryj, volej 155", options: ["Stav selhávajícího oběhu — polož postiženého, zvedni nohy, přikryj, volej 155", "Stav kdy postižený nekontrolovaně křičí — uklidni ho", "Stav kde postižený nemůže mluvit — dej mu vodu", "Šokový stav se léčí jen v nemocnici — nic nedělej"] },
  { question: "Jak správně přiložit tlakový obvaz na krvácející ránu?", correctAnswer: "Sterilní materiál na ránu, pevně ovinout, vyvýšit končetinu nad srdce", options: ["Sterilní materiál na ránu, pevně ovinout, vyvýšit končetinu nad srdce", "Ránu opláchnout vodou, volně přikrýt", "Pevně stáhnout nad ranou škrtidlem vždy", "Čistý ubrousek přitlačit bez obinadla"] },
  { question: "Co je defibrillace (AED) a kdy se používá?", correctAnswer: "Elektrický výboj obnovující srdeční rytmus — při zástavě srdce (komorová fibrilace)", options: ["Elektrický výboj obnovující srdeční rytmus — při zástavě srdce (komorová fibrilace)", "Elektrický přístroj pro měření krevního tlaku", "Masáž srdce rukami bez elektrického výboje", "Přístroj sloužící k záchranným vdechům"] },
  { question: "Jak pomoci při podezření na infarkt?", correctAnswer: "Uložit postiženého do polosedě, volat 155, klid, nepodávat jídlo ani pití", options: ["Uložit postiženého do polosedě, volat 155, klid, nepodávat jídlo ani pití", "Podat tablety a vodu", "Nechat postiženého chodit pro zlepšení krevního oběhu", "Dát postiženého do studené koupele"] },
  { question: "Jak se chovat při výbuchu a požáru v budově?", correctAnswer: "Uniknout nejbližším východem, nepoužívat výtah, zůstat nízko (kouř stoupá nahoru), volat 112/150", options: ["Uniknout nejbližším východem, nepoužívat výtah, zůstat nízko (kouř stoupá nahoru), volat 112/150", "Schovat se do výtahu a čekat na pomoc", "Otevřít okna a volat o pomoc přes okno", "Hasit požár sám bez volání záchranářů"] },
  { question: "Co je poloha při šoku s výjimkou zranění?", correctAnswer: "Na zádech s nohama zvednutými cca 30 cm — zvyšuje přísun krve k mozku a srdci", options: ["Na zádech s nohama zvednutými cca 30 cm — zvyšuje přísun krve k mozku a srdci", "Na boku jako stabilní poloha", "Vsedě s nohama svěšenými dolů", "Poloha na břiše — přirozenější pro postiženého"] },
  { question: "Jak pomoci při alergické reakci (anafylaktický šok)?", correctAnswer: "Pokud postižený má auto-injektor (EpiPen), pomoz s aplikací, volej 155 okamžitě", options: ["Pokud postižený má auto-injektor (EpiPen), pomoz s aplikací, volej 155 okamžitě", "Dej postiženému antihistaminikum z lékárničky", "Ochlazuj postiženého studenou vodou", "Čekej, zda odezní sama — alergické reakce jsou dočasné"] },
  { question: "Co je primární průzkum (ABCDE) při záchranné akci?", correctAnswer: "A-airway (průchodnost dýchacích cest), B-breathing (dýchání), C-circulation (oběh), D-disability (vědomí), E-exposure (viditelná zranění)", options: ["A-airway (průchodnost dýchacích cest), B-breathing (dýchání), C-circulation (oběh), D-disability (vědomí), E-exposure (viditelná zranění)", "Jen kontrola vědomí a volání 155", "Kontrola krvácení a zlomenin jako první krok", "Primární průzkum provádí pouze záchranáři"] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Proč je rychlost zahájení KPR klíčová pro přežití?", correctAnswer: "Každá minuta bez KPR snižuje přežití o 7–10 % — mozek odumírá bez kyslíku za 4–6 minut", options: ["Každá minuta bez KPR snižuje přežití o 7–10 % — mozek odumírá bez kyslíku za 4–6 minut", "KPR je účinná i po 30 minutách bez léčby", "Mozek vydrží bez kyslíku 30 minut bez poškození", "Rychlost KPR neovlivňuje výsledek — rozhoduje jen lék"] },
  { question: "Proč KPR provádět na tvrdé ploše?", correctAnswer: "Měkký povrch absorbuje energii stisků — na tvrdé podložce stlačíme hrudník správně do hloubky", options: ["Měkký povrch absorbuje energii stisků — na tvrdé podložce stlačíme hrudník správně do hloubky", "Tvrdá podložka je hygienicky čistší", "KPR lze provádět na jakémkoli povrchu — výsledek je stejný", "Měkký povrch brání zpětnému plnění srdce"] },
  { question: "Co je tourniquet (škrtidlo) a kdy se používá?", correctAnswer: "Páska utažená nad ránou k zastavení tepenného krvácení — použití jen při masivním, jinak nezastavitelném krvácení", options: ["Páska utažená nad ránou k zastavení tepenného krvácení — použití jen při masivním, jinak nezastavitelném krvácení", "Obvaz na menší rány místo tlakového obvazu", "Elastická bandáž na prevenci otoků", "Škrtidlo se nikdy nepoužívá — způsobuje poranění"] },
  { question: "Co je krevní tlak a proč je důležitý pro první pomoc?", correctAnswer: "Tlak krve na stěny cév — při šoku klesá (→ nedostatek kyslíku pro orgány), nutná okamžitá péče", options: ["Tlak krve na stěny cév — při šoku klesá (→ nedostatek kyslíku pro orgány), nutná okamžitá péče", "Rychlost srdeční frekvence — nad 100 je normální", "Množství kyslíku v krvi měřené pulsometrem", "Krevní tlak je irelevantní při záchranné akci"] },
  { question: "Jak se liší tepenné a žilní krvácení a jak se s každým zachází?", correctAnswer: "Tepenné: jasně červená, rytmické tryskání — škrtidlo + urgentní záchranáři. Žilní: tmavší, rovnoměrné — tlakový obvaz.", options: ["Tepenné: jasně červená, rytmické tryskání — škrtidlo + urgentní záchranáři. Žilní: tmavší, rovnoměrné — tlakový obvaz.", "Oba typy se léčí identicky — tlakový obvaz vždy.", "Žilní krvácení je vždy nebezpečnější než tepenné.", "Tepenné krvácení se zastaví samo — stačí čekat."] },
  { question: "Co je hypotermie a jak první pomoci?", correctAnswer: "Nebezpečné podchlazení těla — suchým oblečením, horkým nápojem, izotermickou fólií, 155", options: ["Nebezpečné podchlazení těla — suchým oblečením, horkým nápojem, izotermickou fólií, 155", "Přehřátí (úpal) — chladit studenou vodou", "Lehký chlad bez závažných příznaků", "Hypotermie: masáž svalů a pohyb pro zahřátí"] },
  { question: "Co je dýchací resuscitace (umělé dýchání) a kdy se provádí?", correctAnswer: "Vdechování vzduchu do plic postiženého při zástavě dechu — součást KPR (30:2)", options: ["Vdechování vzduchu do plic postiženého při zástavě dechu — součást KPR (30:2)", "Provádí se jen u tonutí, ne při KPR", "Umělé dýchání bez stisků hrudníku je účinnější než KPR", "Provádí se jen u dětí do 10 let"] },
  { question: "Proč se při popálenině NESMÍ rozbít puchýř?", correctAnswer: "Puchýř chrání ránu před infekcí — jeho prasknutí zvyšuje riziko bakteriální infekce a prodlužuje hojení", options: ["Puchýř chrání ránu před infekcí — jeho prasknutí zvyšuje riziko bakteriální infekce a prodlužuje hojení", "Prasknutí puchýře urychluje hojení tím, že odtéká tekutina", "Puchýř lze rozbit, jen když je větší než 2 cm", "Záleží na místě popáleniny — na rukou rozbij, na obličeji ne"] },
  { question: "Co je triáž při hromadném neštěstí?", correctAnswer: "Třídění zraněných podle závažnosti — rozhoduje, kdo dostane péči nejdříve (červená = okamžitě, zelená = může čekat)", options: ["Třídění zraněných podle závažnosti — rozhoduje, kdo dostane péči nejdříve (červená = okamžitě, zelená = může čekat)", "Evidování jmen a adres všech zraněných", "Přidělení záchranných týmů bez ohledu na závažnost zranění", "Triáž provádí jen lékaři s certifikací"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 45);
}

export const PRVNIPOMOCTISNOVEVOLANIMIMORADNEUDALOSTI: TopicMetadata[] = [
  {
    id: "g4-prirodoveda-clovek-a-jeho-zdravi-bezpecnost-prvni-pomoc-tisnove-volani-mimoradne-udalosti",
    rvpNodeId: "g4-prirodoveda-clovek-a-jeho-zdravi-bezpecnost-prvni-pomoc-tisnove-volani-mimoradne-udalosti",
    title: "První pomoc, tísňové volání, mimořádné události",
    studentTitle: "První pomoc",
    subject: "přírodověda",
    category: "Člověk a jeho zdraví",
    topic: "Člověk a jeho zdraví",
    briefDescription: "Naučíš se volat záchranáře a poskytnout základní první pomoc při úrazu.",
    keywords: ["první pomoc", "tísňové volání", "112", "155", "KPR", "resuscitace", "zlomenina", "krvácení", "popálenina"],
    goals: [
      "Znát tísňová čísla a vědět, co říct dispečerovi",
      "Poskytnout základní první pomoc při krvácení, popálenině a zlomenině",
      "Popsat KPR (poměr 30:2)",
      "Znát stabilní polohu a kdy ji použít",
    ],
    boundaries: ["Pokročilé záchranářské postupy nejsou náplní 4. ročníku"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Čísla: 112 (vždy, EU), 150 (hasiči), 155 (záchranáři), 158 (policie).",
      steps: [
        "1. Volání: KDE, CO, KOLIK, STAV, JMÉNO — nezavěšuj první.",
        "2. KPR: 30 stisků hrudníku + 2 vdechy, tvrdá podložka.",
        "3. Krvácení: přímý tlak, zvedni končetinu.",
        "4. Popálenina: studenou vodou 10–20 min (ne led, ne máslo).",
        "5. Zlomenina: nepohybuj, dlaha, 155.",
        "6. Bezvědomí + dýchá: stabilní poloha (na bok).",
      ],
      commonMistake: "Popálenina se NECHLADÍ ledem — jen studenou vodou 10–20 minut.",
      example: "Při silném krvácení: přitlač čistou tkaninu na ránu, zvedni paži výš než srdce, volej 155.",
    },
  },
];
