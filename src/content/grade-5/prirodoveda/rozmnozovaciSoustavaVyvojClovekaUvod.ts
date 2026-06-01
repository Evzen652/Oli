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
  { question: "Jak se nazývá buňka, která vznikne spojením vajíčka a spermie?", correctAnswer: "Zygota", options: ["Zygota", "Embryo", "Plod", "Blastocysta"], hints: ["Zygota = první buňka nového života."] },
  { question: "Jak dlouho trvá těhotenství přibližně?", correctAnswer: "40 týdnů (přibližně 9 měsíců)", options: ["40 týdnů (přibližně 9 měsíců)", "12 měsíců", "6 měsíců", "20 týdnů"], hints: ["40 týdnů = přibližně 9 měsíců."] },
  { question: "Jak se jmenuje vývojové stadium od 2. do 8. týdne těhotenství?", correctAnswer: "Embryo", options: ["Embryo", "Zygota", "Plod", "Blastocysta"], hints: ["Embryo = první stadia vývoje po zygotě."] },
  { question: "Od kterého týdne se embryo nazývá plodem?", correctAnswer: "Od 9. týdne těhotenství", options: ["Od 9. týdne těhotenství", "Od 20. týdne", "Od 2. týdne", "Od 1. dne po oplodnění"], hints: ["Plod má již všechny základní orgány."] },
  { question: "Jak se jmenuje první menstruace u dívek?", correctAnswer: "Menarché", options: ["Menarché", "Puberta", "Ovulace", "Laktace"], hints: ["Menarché označuje začátek menstruačních cyklů."] },
  { question: "Jaké jsou základní pohlavní hormony u dívek a chlapců?", correctAnswer: "Dívky: estrogen. Chlapci: testosteron.", options: ["Dívky: estrogen. Chlapci: testosteron.", "Dívky: testosteron. Chlapci: estrogen.", "Oba: inzulín a kortizol.", "Oba: dopamin a serotonin."], hints: ["Hormony řídí pohlavní vývoj."] },
  { question: "Co je placenta?", correctAnswer: "Orgán spojující matku s plodem – přenáší živiny a kyslík a vylučuje odpadní látky plodu", options: ["Orgán spojující matku s plodem – přenáší živiny a kyslík a vylučuje odpadní látky plodu", "Orgán ve vaječnících produkující vajíčka", "Sval dělohy pomáhající při porodu", "Buňky chránící plod před bakteriemi"], hints: ["Placenta = 'zásobník' a 'odpadkový koš' plodu."] },
  { question: "Pohlavní rozmnožování člověka vyžaduje:", correctAnswer: "Vajíčko (od ženy) + spermii (od muže) → oplodnění", options: ["Vajíčko (od ženy) + spermii (od muže) → oplodnění", "Pouze vajíčko – spermie nejsou potřeba", "Pouze spermie – vajíčko se vyvine samo", "Vajíčka od obou partnerů → vytváří embryo"], hints: ["Pohlavní rozmnožování = genetický materiál od dvou rodičů."] },
  { question: "Co se stane při porodu?", correctAnswer: "Děložní svaly se stahují a vytlačují plod z dělohy ven do světa", options: ["Děložní svaly se stahují a vytlačují plod z dělohy ven do světa", "Plod se narodí sám bez pomoci matky", "Porod probíhá vždy císařským řezem", "Placenta se rozpadne a plod odpadne sám"], hints: ["Porod = konec těhotenství."] },
  { question: "Co je menstruační cyklus?", correctAnswer: "Pravidelný měsíční cyklus (přibližně 28 dní) přípravy dělohy na možné oplodnění", options: ["Pravidelný měsíční cyklus (přibližně 28 dní) přípravy dělohy na možné oplodnění", "Cyklus dívčích emocí způsobený hormony bez biologického účelu", "Ztráta vaječníků při přechodu do dospělosti", "Tvorba nových vajíček každý týden"], hints: ["Menstruace = vylití nepoužité děložní výstelky, pokud nedošlo k oplodnění."] },
  { question: "Proč jsou tělesné změny v pubertě normální?", correctAnswer: "Jsou způsobeny hormony a jsou součástí přirozeného dospívání – každý je zažívá, jen v trochu jiném čase", options: ["Jsou způsobeny hormony a jsou součástí přirozeného dospívání – každý je zažívá, jen v trochu jiném čase", "Jsou poruchou vývoje, která může být léčena léky", "Jsou výsledkem stravovacích návyků a mohou být zastaveny", "Jsou způsobeny stresem a zmizí samy bez dospívání"], hints: ["Dospívání je přirozené – nelze ho zastavit ani uspěchat."] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Jak se liší ženský a mužský pohlavní systém z hlediska funkce?", correctAnswer: "Ženský: produkuje vajíčka (ovulace) a může nést plod (děloha, placenta). Mužský: produkuje spermie (varlata) přenášené při pohlavním styku.", options: ["Ženský: produkuje vajíčka (ovulace) a může nést plod (děloha, placenta). Mužský: produkuje spermie (varlata) přenášené při pohlavním styku.", "Oba systémy jsou stejné – liší se jen anatomicky.", "Ženský systém produkuje hormony, mužský pohyb.", "Mužský systém nese plod, ženský produkuje spermie – opak."], hints: ["Pohlavní systémy mají doplňkové funkce."] },
  { question: "Co je ovulace a kdy probíhá?", correctAnswer: "Uvolnění zralého vajíčka z vaječníku – přibližně uprostřed menstruačního cyklu (14. den v 28denním cyklu)", options: ["Uvolnění zralého vajíčka z vaječníku – přibližně uprostřed menstruačního cyklu (14. den v 28denním cyklu)", "Tvorba vajíčka z buněk vaječníku – trvá 9 měsíců.", "Pohyb spermie k vajíčku v děloze.", "Vylití děložní výstelky na konci cyklu."], hints: ["Ovulace = vajíčko je 'připraveno' k oplodnění."] },
  { question: "Jak genetika ovlivňuje pohlaví dítěte?", correctAnswer: "Vajíčko vždy nese chromozom X. Spermie nese X nebo Y. Spermie s X → dívka (XX). Spermie s Y → chlapec (XY). Pohlaví určuje otec.", options: ["Vajíčko vždy nese chromozom X. Spermie nese X nebo Y. Spermie s X → dívka (XX). Spermie s Y → chlapec (XY). Pohlaví určuje otec.", "Matka určuje pohlaví dítěte – vajíčko nese X nebo Y.", "Pohlaví závisí na teplotě v děloze – teplejší → dívka.", "Chromozomy se nedědí – pohlaví se tvoří náhodně."], hints: ["XX = dívka. XY = chlapec. Pohlaví určuje chromozom spermie."] },
  { question: "Proč je zdravá výživa matky během těhotenství klíčová?", correctAnswer: "Plod přijímá všechny živiny přes placentu z krve matky. Nedostatek kyseliny listové → vady nervové trubice. Alkohol/drogy → poškození vývoje mozku plodu.", options: ["Plod přijímá všechny živiny přes placentu z krve matky. Nedostatek kyseliny listové → vady nervové trubice. Alkohol/drogy → poškození vývoje mozku plodu.", "Plod si sám vyrábí živiny – strava matky nehraje roli.", "Výživa matky ovlivňuje jen váhu dítěte při narození.", "Plod je chráněn placentou před všemi látkami z krve matky."], hints: ["Kyselina listová (B9) chrání páteř plodu."] },
  { question: "Co jsou pohlavně přenosné nemoci (STI) a jak se přenášejí?", correctAnswer: "Infekce přenášené pohlavním stykem (chlamydie, syfilis, HIV). Prevence: bezpečný sex, testování. Léčba antibiotiky (bakteriální), antivirotiky (virové).", options: ["Infekce přenášené pohlavním stykem (chlamydie, syfilis, HIV). Prevence: bezpečný sex, testování. Léčba antibiotiky (bakteriální), antivirotiky (virové).", "Pohlavně přenosné nemoci se šíří vzduchem a kašlem.", "HIV je pohlavně přenosná nemoc léčitelná penicilinem.", "Pohlavně přenosné nemoci se týkají pouze dospělých nad 25 let."], hints: ["Prevence > léčba. Kondom chrání před většinou STI."] },
  { question: "Jak se vyvíjí plod v průběhu těhotenství (po trimestrech)?", correctAnswer: "1. trimestr (1–12 týden): základní orgány. 2. trimestr (13–27): pohyby, smysly. 3. trimestr (28–40): tuk, zrání plic, příprava na porod.", options: ["1. trimestr (1–12 týden): základní orgány. 2. trimestr (13–27): pohyby, smysly. 3. trimestr (28–40): tuk, zrání plic, příprava na porod.", "Plod se vyvíjí rovnoměrně – trimestry jsou jen administrativní dělení.", "1. trimestr: pohyby. 2.: orgány. 3.: základní buněčné dělení.", "Plod je plně vyvinutý od 20. týdne – zbytek je jen růst."], hints: ["Trimester = třetina těhotenství (3 × 13 týdnů ≈ 40 týdnů)."] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Jak chromozomální odchylky (např. Downův syndrom) vznikají?", correctAnswer: "Downův syndrom: při tvorbě vajíčka nebo spermie dojde k chybě v rozdělení chromosomů → 3 kopie chromosomu 21 místo 2 (trizomie 21). Riziko stoupá s věkem matky.", options: ["Downův syndrom: při tvorbě vajíčka nebo spermie dojde k chybě v rozdělení chromosomů → 3 kopie chromosomu 21 místo 2 (trizomie 21). Riziko stoupá s věkem matky.", "Downův syndrom je způsoben virem přeneseným v těhotenství.", "Chromozomální odchylky vznikají vždy dědičností – nelze je předvídat.", "Downův syndrom má jen chlapci – dívky chromozomálními chybami netrpí."], hints: ["Trizomie 21 = 47 chromozomů místo 46."] },
  { question: "Jak epigenetika ukazuje, že geny nejsou osud?", correctAnswer: "Epigenetika studuje, jak prostředí (strava, stres, toxiny) mění aktivaci genů bez změny DNA sekvence. Geny jsou 'vypínač' – prostředí ovlivňuje, zda se gen projeví.", options: ["Epigenetika studuje, jak prostředí (strava, stres, toxiny) mění aktivaci genů bez změny DNA sekvence. Geny jsou 'vypínač' – prostředí ovlivňuje, zda se gen projeví.", "Geny jsou neměnné – prostředí je zcela nemůže ovlivnit.", "Epigenetika říká, že geny jsou jediným faktorem zdraví.", "Prostředí mění DNA sekvenci – tím způsobuje genetické nemoci."], hints: ["Jednovaječná dvojčata mají stejnou DNA, ale mohou mít různé zdravotní problémy."] },
  { question: "Proč je puberta evolučně výhodná pro druh?", correctAnswer: "Pohlavní dospělost v pubertě umožňuje rozmnožování. Prodloužené dospívání u lidí (vs. jiné primáty) dává čas na rozvoj mozku a sociální dovednosti – výhoda pro přežití skupiny.", options: ["Pohlavní dospělost v pubertě umožňuje rozmnožování. Prodloužené dospívání u lidí (vs. jiné primáty) dává čas na rozvoj mozku a sociální dovednosti – výhoda pro přežití skupiny.", "Puberta je evolučně nevýhodná – prodlužuje závislost na rodičích.", "Prodloužené dospívání je civilizační výmysl – evolučně je dospívání kratší.", "Puberta u lidí i jiných primátů je stejně dlouhá."], hints: ["Lidská puberta trvá 5–8 let. U šimpanzů 2–3 roky."] },
  { question: "Proč mohou identická dvojčata mít různé osobnosti přes stejnou DNA?", correctAnswer: "Osobnost závisí na genech + prostředí (výchova, zkušenosti, přátelé, náhoda). Identická dvojčata sdílejí DNA, ale zažívají odlišná prostředí → různé epigenetické profily → různé osobnosti.", options: ["Osobnost závisí na genech + prostředí (výchova, zkušenosti, přátelé, náhoda). Identická dvojčata sdílejí DNA, ale zažívají odlišná prostředí → různé epigenetické profily → různé osobnosti.", "Identická dvojčata mají vždy stejnou osobnost – DNA ji určuje.", "Osobnost závisí výhradně na výchově – geny nemají vliv.", "Různé osobnosti dvojčat jsou způsobeny chybami v DNA kopírování po oplodnění."], hints: ["Nature (geny) × Nurture (prostředí) = věčná debata v psychologii."] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const ROZMNOZOVACISOUSTAVAVYVOJCLOVEKAUVOD: TopicMetadata[] = [
  {
    id: "g5-prirodoveda-clovek-a-jeho-zdravi-vyvoj-cloveka-a-rozmnozovani-rozmnozovaci-soustava-vyvoj-cloveka-uvod",
    rvpNodeId: "g5-prirodoveda-clovek-a-jeho-zdravi-vyvoj-cloveka-a-rozmnozovani-rozmnozovaci-soustava-vyvoj-cloveka-uvod",
    title: "Rozmnožovací soustava, vývoj člověka (úvod)",
    studentTitle: "Vznik nového života",
    subject: "přírodověda",
    category: "Člověk a jeho zdraví",
    topic: "Vývoj člověka a rozmnožování",
    briefDescription: "Dozvíš se základy o vzniku a vývoji nového života.",
    keywords: ["oplodnění", "těhotenství", "embryo", "plod", "hormony", "menstruace", "zygota"],
    goals: ["Popsat základní fáze vývoje od zygoty po novorozence", "Vysvětlit roli hormonů v pohlavním dozrávání", "Pochopit tělesné změny v pubertě jako přirozené"],
    boundaries: ["Neprobírá sexuální chování podrobně", "Neprobírá antikoncepci podrobně"],
    gradeRange: [5, 5],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Vajíčko + spermie → zygota → embryo (1–8 týden) → plod (9–40 týden) → novorozenec.",
      steps: [
        "1. Oplodnění: vajíčko + spermie → zygota.",
        "2. Embryo: 1.–8. týden (zakládají se orgány).",
        "3. Plod: 9.–40. týden (vývoj a růst).",
        "4. Porod: přibližně ve 40. týdnu.",
        "5. Hormony puberty: estrogen (dívky), testosteron (chlapci).",
      ],
      commonMistake: "Pohlaví dítěte určuje OTEC (chromozom spermie X nebo Y), ne matka.",
      example: "Zygota se dělí → blastocysta → implantace v děloze → embryo → plod.",
    },
  },
];
