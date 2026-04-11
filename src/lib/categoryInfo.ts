/**
 * Category-level descriptions for the TopicBrowser.
 * Each category (okruh) has a human-written summary explaining
 * what it is, why it matters, and visual aids.
 */

export interface CategoryInfo {
  /** Short catchy title for the button */
  buttonLabel: string;
  /** Full title for the dialog header */
  title: string;
  /** 1-2 sentence hook — why should the student care? */
  hook: string;
  /** What is this category about? */
  whatIsIt: string;
  /** Why do we learn/use this? Real-world motivation. */
  whyWeUseIt: string;
  /** Visual examples — simple text-based illustrations */
  visualExamples: {
    label: string;
    illustration: string; // emoji + text visual
  }[];
  /** Fun fact or visual analogy to remember */
  funFact: string;
}

/**
 * Key = `${subject}::${category}` or `${subject}::${category}::${topic}` (for topic-level overrides)
 */
export const CATEGORY_INFO: Record<string, CategoryInfo> = {
  "matematika::Čísla a operace": {
    buttonLabel: "K čemu jsou čísla?",
    title: "Čísla a operace",
    hook: "Čísla jsou všude kolem nás — od cenovek v obchodě po skóre ve hře.",
    whatIsIt:
      "Čísla a operace jsou základ celé matematiky. Učíme se s nimi počítat, porovnávat je a používat je k řešení úloh z běžného života.",
    whyWeUseIt:
      "Bez čísel bychom nemohli nakupovat, měřit vzdálenosti, vařit podle receptu ani hrát deskové hry. Porovnávání čísel ti pomůže rychle se rozhodnout — co je víc, co je míň.",
    visualExamples: [
      {
        label: "Číselná osa",
        illustration: "◀── 0 ── 10 ── 20 ── 30 ── 40 ── 50 ──▶\n         🔴 menší          větší 🟢",
      },
      {
        label: "Porovnání",
        illustration: "🍎🍎🍎 (3)   vs   🍎🍎🍎🍎🍎 (5)\n     3  <  5\n  Zobáček ukazuje k menšímu →  3 < 5",
      },
      {
        label: "V obchodě",
        illustration: "🏷️ 42 Kč   vs   🏷️ 37 Kč\n  42 > 37 → dražší je za 42 Kč",
      },
    ],
    funFact: "💡 Některé kultury, jako například starověcí Mayové, používaly mnohem složitější číselné soustavy než my, například se základem 20! 🤓",
  },

  "matematika::Zlomky": {
    buttonLabel: "K čemu jsou zlomky?",
    title: "Zlomky",
    hook: "Zlomky potkáváš každý den — půlka pizzy, čtvrt hodiny, třetina čokolády.",
    whatIsIt:
      "Zlomek popisuje část z celku. Skládá se z čitatele (kolik částí máme) a jmenovatele (na kolik částí je celek rozdělen). Například 3/4 znamená 3 části ze 4.",
    whyWeUseIt:
      "Zlomky používáme při vaření (půl lžičky), v čase (čtvrt hodiny = 15 minut), při dělení spravedlivě (rozdělit dort na stejné díly) a v mnoha dalších situacích.",
    visualExamples: [
      {
        label: "Co je zlomek",
        illustration: "Celý dort: 🟤🟤🟤🟤  (4 díly)\nSníš 3:    🟡🟡🟡⬜  = 3/4 dortu",
      },
      {
        label: "Porovnání zlomků",
        illustration: "1/2: ████░░░░  (polovina)\n3/4: ██████░░  (tři čtvrtiny)\n\n1/2 < 3/4 → tři čtvrtiny je víc",
      },
      {
        label: "Sčítání a odčítání",
        illustration: "1/4 + 2/4 = 3/4\n🟡⬜⬜⬜ + ⬜🟡🟡⬜ = 🟡🟡🟡⬜\n\n3/4 − 1/4 = 2/4 = 1/2\n🟡🟡🟡⬜ − 🟡⬜⬜⬜ = ⬜🟡🟡⬜",
      },
      {
        label: "Krácení zlomku",
        illustration: "4/8 → oba děl 4 → 1/2\n🟡🟡🟡🟡⬜⬜⬜⬜ = 🟡⬜ (stejná část!)",
      },
      {
        label: "Smíšená čísla",
        illustration: "1 celá a 3/4 = 1 3/4\n🍕 celá pizza + 🍕¾ kousků\n\nPřevod: 1 3/4 → (1×4 + 3) / 4 = 7/4\nSčítání: 1 1/3 + 2 1/3 = 3 2/3",
      },
      {
        label: "Zlomek z čísla",
        illustration: "2/5 z 20 koláčů = ?\n20 ÷ 5 = 4 (jeden díl)\n4 × 2 = 8 koláčů 🧁🧁🧁🧁🧁🧁🧁🧁\n\nOpačně: 2/5 z čísla je 8 → celek = ?  8 ÷ 2 × 5 = 20",
      },
      {
        label: "Násobení zlomku číslem",
        illustration: "3 × 2/5 = (3 × 2) / 5 = 6/5 = 1 1/5\n\n🍰🍰 🍰🍰 🍰🍰  (3× dva pětinové kousky)\n= šest pětinek = jeden celý a jedna pětinka",
      },
    ],
    funFact: "💡 Starověcí Egypťané používali zlomky už před více než 4000 lety, ale zapisovali je trochu jinak než my, většinou jako součty zlomků s čitatelem 1. 📜",
  },

  "čeština::Vyjmenovaná slova": {
    buttonLabel: "Proč vyjmenovaná slova?",
    title: "Vyjmenovaná slova",
    hook: "Proč někdy píšeme 'y' a jindy 'i'? Vyjmenovaná slova jsou klíč k pravopisu.",
    whatIsIt:
      "Vyjmenovaná slova jsou speciální skupina slov, kde se po určitých souhláskách (B, F, L, M, P, S, V, Z) píše tvrdé y/ý, i když bychom čekali měkké i/í. Tato slova se musíme naučit.",
    whyWeUseIt:
      "Díky vyjmenovaným slovům správně píšeš — a to je důležité ve škole, v dopisech, zprávách i na internetu. Kdo zná vyjmenovaná slova, dělá méně pravopisných chyb.",
    visualExamples: [
      {
        label: "Jak to funguje",
        illustration: "Po B → vyjmenované? → piš Y/Ý\n         být ✅ → bÝt\n\nPo B → NE-vyjmenované? → piš I/Í\n         bít (tlouci) ✅ → bÍt",
      },
      {
        label: "Příklady po B",
        illustration: "✅ Y/Ý: být, bydlit, bylina, kobyla, býk\n❌ I/Í: bít, bída, bič, bi̇rma",
      },
      {
        label: "Příbuzná slova",
        illustration: "být → bydlet, obyvatel, byt, příbytek\n        (všechna příbuzná → Y/Ý)\n\nbít → bitva, bič\n        (všechna příbuzná → I/Í)",
      },
    ],
    funFact: "💡 Vyjmenovaná slova jsou jako tajné klíče k psaní 'i' a 'y' ve spoustě slov, která nám pomáhají v češtině. 🔑",
  },

  "matematika::Geometrie": {
    buttonLabel: "K čemu je geometrie?",
    title: "Geometrie",
    hook: "Tvary jsou všude kolem tebe — okna, talíře, dopravní značky!",
    whatIsIt:
      "Geometrie je část matematiky, která se zabývá tvary, jejich vlastnostmi a měřením. Učíš se rozpoznat základní tvary, měřit délky a spočítat třeba obvod.",
    whyWeUseIt:
      "Geometrii používáme při stavění, kreslení, sportu i v běžném životě. Když víš, jaký tvar má hřiště, můžeš spočítat, kolik kroků ho oběhneš! A měření potřebuješ, když chceš vědět, jestli se skříň vejde do pokoje.",
    visualExamples: [
      {
        label: "Základní tvary",
        illustration: "⬜ Čtverec: 4 stejné strany\n▬ Obdélník: 2 delší + 2 kratší\n△ Trojúhelník: 3 strany\n⭕ Kruh: kulatý, žádné rohy",
      },
      {
        label: "Měření délky",
        illustration: "📏 Pravítko:\n|---|---|---|---|---|\n0   1   2   3   4   5 cm\n\n🖍️ Tužka: od 0 do 3 → délka = 3 cm\n👆 Vždy začínáme od nuly!",
      },
      {
        label: "Obvod — cesta kolem tvaru",
        illustration: "Čtverec (strana 5 cm):\n┌──5──┐\n│     │ 5\n└──5──┘\nObvod = 5+5+5+5 = 20 cm",
      },
    ],
    funFact: "💡 Vědci objevili, že včelí plástve jsou tvořeny dokonalými šestiúhelníky, což je nejpraktičtější tvar pro skladování medu! 🐝🍯",
  },

  "matematika::Geometrie::Měření délky a odhad": {
    buttonLabel: "K čemu je měření?",
    title: "Měření délky a odhad",
    hook: "Kolik je to daleko? Jak dlouhý je ten stůl? Měření ti dá odpovědi! 📏",
    whatIsIt:
      "Měření je způsob, jak přesně zjistit, jak něco je dlouhé, těžké nebo kolik se toho vejde do nádoby. Používáme k tomu jednotky — centimetry, metry, kilogramy nebo litry.",
    whyWeUseIt:
      "Měření potřebuješ každý den — když zjišťuješ, jestli se vejdeš pod stůl, kolik vody nalít do konvice, nebo kolik váží batoh. Bez měření by se nedala postavit ani jedna budova!",
    visualExamples: [
      {
        label: "Jednotky délky",
        illustration: "📏 1 cm = šířka nehtu\n📏 1 m = velký krok dospělého\n📏 1 km = 15 minut chůze\n\n1 m = 100 cm\n1 cm = 10 mm",
      },
      {
        label: "Jednotky hmotnosti",
        illustration: "⚖️ 1 g = kancelářská sponka\n⚖️ 1 kg = litr vody\n⚖️ 1 000 g = 1 kg\n\n🍎 Jablko ≈ 150 g\n📚 Školní batoh ≈ 5 kg",
      },
      {
        label: "Jednotky objemu",
        illustration: "🧪 1 ml = kapka léku\n🥛 250 ml = sklenice\n🧴 1 l = velká láhev\n\n1 l = 1 000 ml",
      },
      {
        label: "Odhad délky",
        illustration: "✏️ Tužka ≈ 18 cm\n📱 Mobil ≈ 15 cm\n📏 Pravítko = 30 cm\n🚪 Dveře ≈ 2 m\n\n💡 Porovnávej s věcmi, které znáš!",
      },
    ],
    funFact: "💡 Nejrychlejší zvíře na světě, gepard, dokáže běžet rychlostí přibližně 110 km/h, to si jen tak neodhadneš bez změření! 🐆",
  },

  "matematika::Geometrie::Geometrické tvary": {
    buttonLabel: "K čemu jsou tvary?",
    title: "Geometrické tvary",
    hook: "Tvary jsou všude — okna jsou obdélníky, kola jsou kruhy, střechy trojúhelníky! 🔷",
    whatIsIt:
      "Geometrické tvary jsou základní útvary, které mají přesně dané vlastnosti — počet stran, rohů (vrcholů) a tvar. Nejzákladnější jsou čtverec, obdélník, trojúhelník a kruh.",
    whyWeUseIt:
      "Tvary potřebuješ rozpoznat všude kolem sebe — v architektuře, v přírodě, ve sportu i v umění. Když víš, jaký tvar má předmět, můžeš ho lépe popsat, nakreslit nebo vyrobit.",
    visualExamples: [
      {
        label: "Základní tvary",
        illustration: "⬜ Čtverec: 4 stejné strany, 4 pravé úhly\n▬ Obdélník: protější strany stejné, 4 pravé úhly\n△ Trojúhelník: 3 strany, 3 vrcholy\n⭕ Kruh: žádné strany ani rohy, jen střed a poloměr",
      },
      {
        label: "Kde je potkáš",
        illustration: "🪟 Okno → obdélník\n🛑 Stopka → osmistěn\n⚽ Míč → koule (3D kruh)\n🍕 Pizza → kruh\n📐 Trojúhelníkové pravítko → trojúhelník\n🏠 Střecha → trojúhelník",
      },
      {
        label: "Vlastnosti",
        illustration: "Čtverec vs. Obdélník:\n┌──a──┐     ┌──a──┐\n│     │ a   │     │ b\n└──a──┘     └──a──┘\na = a       a ≠ b\n\nOba mají 4 pravé úhly!",
      },
    ],
    funFact: "💡 Pyramidám v Egyptě je více než 4500 let a jejich dokonalé trojúhelníkové stěny fascinují lidi dodnes. 🔺🇪🇬",
  },

  "matematika::Geometrie::Obvod": {
    buttonLabel: "K čemu je obvod?",
    title: "Obvod",
    hook: "Obvod je cesta kolem tvaru — jako bys obešel celý plot zahrady! 📏",
    whatIsIt:
      "Obvod je celková délka hranice (okraje) geometrického tvaru. Spočítáš ho tak, že sečteš délky všech stran. U čtverce je to 4× strana, u obdélníku 2× (delší + kratší strana).",
    whyWeUseIt:
      "Obvod potřebuješ, když chceš oplotit zahradu, olemovat ubrus, obehnat hřiště provázkem nebo spočítat, kolik kroků oběhneš park.",
    visualExamples: [
      {
        label: "Obvod čtverce",
        illustration: "┌──5──┐\n│     │ 5\n└──5──┘\n  5\n\nObvod = 4 × 5 = 20 cm\n(4 stejné strany)",
      },
      {
        label: "Obvod obdélníku",
        illustration: "┌────8────┐\n│         │ 3\n└────8────┘\n\nObvod = 2 × (8 + 3) = 2 × 11 = 22 cm\n(2 delší + 2 kratší strany)",
      },
      {
        label: "V praxi",
        illustration: "🏡 Plot zahrady 10 m × 6 m:\nObvod = 2 × (10 + 6) = 32 m plotu\n\n🖼️ Rám obrázku 30 cm × 20 cm:\nObvod = 2 × (30 + 20) = 100 cm lišty",
      },
    ],
    funFact: "💡 Kdybychom protáhli obvod rovníku Země, měřil by více než 40 000 kilometrů, což je jako stokrát oběhnout Českou republiku! 🌍",
  },

  "čeština::Mluvnice": {
    buttonLabel: "K čemu je mluvnice?",
    title: "Mluvnice",
    hook: "Mluvnice ti pomůže rozumět tomu, jak čeština funguje — a správně mluvit i psát!",
    whatIsIt:
      "Mluvnice je část češtiny, kde se učíš rozpoznávat slovní druhy, určovat rod a číslo, rozebírat věty a porozumět tomu, jak se slova v češtině mění a spojují.",
    whyWeUseIt:
      "Když rozumíš mluvnici, dokážeš správně tvořit věty, lépe psát slohové práce a snáz se učíš nová pravidla pravopisu.",
    visualExamples: [
      {
        label: "Slovní druhy",
        illustration: "🐕 Podstatné jméno → Kdo? Co? (pes, škola)\n🏃 Sloveso → Co dělá? (běží, spí)\n🎨 Přídavné jméno → Jaký? (velký, hezký)",
      },
      {
        label: "Rod podstatných jmen",
        illustration: "🔵 TEN pes → mužský rod\n🔴 TA kočka → ženský rod\n🟢 TO okno → střední rod",
      },
      {
        label: "Základ věty",
        illustration: "Pes štěká na dvore.\n━━━  ━━━━\nPODMĚT  PŘÍSUDEK\nKdo? → pes   Co dělá? → štěká",
      },
    ],
    funFact: "💡 Český jazyk má sedm pádů, což je mnohem více než v angličtině, a díky nim můžeme vyjádřit věci mnohem přesněji. 🤯",
  },

  "čeština::Diktát": {
    buttonLabel: "K čemu je diktát?",
    title: "Diktát",
    hook: "Diktát prověří, jestli umíš všechna pravopisná pravidla najednou!",
    whatIsIt:
      "Doplňovací diktát je cvičení, kde doplňuješ chybějící písmena do vět. Na rozdíl od ostatních cvičení nevíš předem, jaké pravidlo budeš potřebovat — musíš ho sám poznat a správně použít.",
    whyWeUseIt:
      "Ve škole i v životě píšeš celé věty, ne jen izolovaná slova. Diktát tě naučí správně psát v každé situaci — protože musíš přemýšlet nad každým slovem.",
    visualExamples: [
      {
        label: "Jak to funguje",
        illustration: "Na louce stála kob_la.\n→ Jaké pravidlo? → vyjmenované slovo po B\n→ Správně: y ✅\n\nV trávě leze ha_.\n→ Jaké pravidlo? → párová souhláska\n→ hadi → d ✅",
      },
      {
        label: "Co vše potkáš",
        illustration: "🟨 Vyjmenovaná slova: b_dlí, m_š, s_kora...\n🔤 Párové souhlásky: le_, chle_, obra_...\n🟫🟦 Tvrdé a měkké: r_by, č_slo...\n🏙️ Velká písmena: _raha, _etr...",
      },
    ],
    funFact: "💡 Nejdelší věta v literatuře má přes 4000 slov a je z románu Ullyses od Jamese Joyce – představ si ji psát! ✍️📚",
  },

  "čeština::Pravopis": {
    buttonLabel: "K čemu je pravopis?",
    title: "Pravopis",
    hook: "Správně psát je jako správně mluvit — aby ti ostatní rozuměli!",
    whatIsIt:
      "Pravopis jsou pravidla, jak správně zapisovat slova. Učíš se, které písmenko napsat, když to z výslovnosti není jasné.",
    whyWeUseIt:
      "Když píšeš správně, ostatní ti lépe rozumí. Pravopis potřebuješ ve škole, v dopisech, zprávách i na internetu.",
    visualExamples: [
      {
        label: "Párové souhlásky",
        illustration: "le_ → ledy → píšu D ✅\nchle_ → chleba → píšu B ✅\n\n💡 Zkus jiný tvar slova!",
      },
    ],
    funFact: "💡 V psaném jazyce existuje spousta různých symbolů a značek, které nám pomáhají správně vyjádřit myšlenky, třeba jako naše tečky a čárky. . , ! ? 🖊️",
  },

  // ═══════════════════════════════════════════════════════
  // PRVOUKA
  // ═══════════════════════════════════════════════════════

  "prvouka::Člověk a jeho tělo": {
    buttonLabel: "K čemu znát své tělo?",
    title: "Člověk a jeho tělo",
    hook: "Tvé tělo je úžasný stroj — a ty jsi jeho řidič! 🏎️",
    whatIsIt:
      "V tomto okruhu poznáš, jak funguje lidské tělo — hlavní orgány, smysly, trávení i oběh krve. A taky se naučíš, jak o sebe správně pečovat.",
    whyWeUseIt:
      "Když rozumíš svému tělu, víš, proč je důležitý pohyb, zdravé jídlo a dostatek spánku. A víš, co dělat, když se někdo zraní!",
    visualExamples: [
      {
        label: "Hlavní orgány",
        illustration: "🧠 Mozek — řídí celé tělo (jako kapitán lodi)\n❤️ Srdce — pumpuje krev (jako motor)\n🫁 Plíce — dýchání (vzduch dovnitř a ven)\n🟡 Žaludek — tráví jídlo (jako mixér)\n🦴 Kostra — drží tělo (jako stavebnice)",
      },
      {
        label: "5 smyslů",
        illustration: "👁️ Zrak → OČI (vidíme barvy a tvary)\n👂 Sluch → UŠI (slyšíme zvuky)\n👃 Čich → NOS (cítíme vůně)\n👅 Chuť → JAZYK (sladké, kyselé, slané)\n✋ Hmat → KŮŽE (teplé, studené, hladké)",
      },
      {
        label: "Cesta jídla",
        illustration: "👄 Ústa (žvýkání)\n  ↓\n🟤 Jícen (polknutí)\n  ↓\n🟡 Žaludek (rozmělnění)\n  ↓\n🟢 Střevo (živiny do krve)\n  ↓\n🚽 Odpadní látky ven",
      },
    ],
    funFact: "💡 Lidské tělo je jako neuvěřitelný stroj, který má více než 600 svalů a 206 kostí. 💪🦴",
  },

  "prvouka::Příroda kolem nás": {
    buttonLabel: "Co všechno žije kolem nás?",
    title: "Příroda kolem nás",
    hook: "Příroda je jako obrovská učebna — stačí se rozhlédnout! 🌳🐿️",
    whatIsIt:
      "Poznáš rostliny a jejich části, naučíš se rozlišovat skupiny zvířat, pochopíš potravní řetězec a zjistíš, jak se příroda mění během roku.",
    whyWeUseIt:
      "Když rozumíš přírodě, lépe chápeš svět kolem sebe — proč ptáci odlétají, proč padá listí, nebo proč jsou včely tak důležité.",
    visualExamples: [
      {
        label: "Části rostliny",
        illustration: "🌸 Květ (nahoře — láká hmyz)\n🍃 List (vyrábí potravu ze světla)\n🌿 Stonek (drží a vede vodu)\n🌱 Kořen (v zemi — nasává vodu)\n🍎 Plod (z květu — semena uvnitř)",
      },
      {
        label: "Skupiny zvířat",
        illustration: "🐄 SAVCI — srst, kojí mláďata\n🦅 PTÁCI — peří, zobák, vejce\n🐝 HMYZ — 6 noh, tykadla\n🐸 OBOJŽIVELNÍCI — voda i souš\n🐍 PLAZI — šupiny\n🐟 RYBY — ploutve, žábry",
      },
      {
        label: "Potravní řetězec",
        illustration: "🌿 Tráva (vyrábí potravu ze slunce)\n  ↓ jí ji\n🐰 Zajíc (býložravec)\n  ↓ jí ho\n🦊 Liška (šelma)\n  ↓ jí ji\n🦅 Orel (na vrcholu)",
      },
      {
        label: "Roční období",
        illustration: "🌸 JARO — kvete, taje, mláďata\n☀️ LÉTO — teplo, slunce, prázdniny\n🍂 PODZIM — listí, houby, zásoby\n❄️ ZIMA — sníh, mráz, zimní spánek",
      },
    ],
    funFact: "💡 V Amazonii žije tolik druhů rostlin a živočichů, že ji vědci stále ještě neprozkoumali celou! 🌳🐒",
  },

  "prvouka::Lidé a společnost": {
    buttonLabel: "Jak žijeme spolu?",
    title: "Lidé a společnost",
    hook: "Žijeme spolu v rodinách, obcích a státě — a každý má svou roli! 🏘️",
    whatIsIt:
      "Naučíš se, jak funguje rodina, obec i stát. Poznáš důležité budovy ve městě, základní fakta o České republice a pravidla slušného chování.",
    whyWeUseIt:
      "Díky tomu pochopíš, proč máme pravidla, kdo nám ve městě pomáhá a co je důležité o naší zemi vědět.",
    visualExamples: [
      {
        label: "Pravidla soužití",
        illustration: "🫂 Říkáme PROSÍM a DĚKUJI\n🤝 Nasloucháme druhým\n🧹 Pomáháme doma\n💬 Řešíme problémy mluvením\n❤️ Respektujeme jeden druhého",
      },
      {
        label: "Česká republika",
        illustration: "🏛️ Hlavní město: Praha\n🇨🇿 Vlajka: bílá, červená, modrý klín\n🦁 Znak: dvouocasý lev\n🎵 Hymna: Kde domov můj\n🪙 Měna: koruna (Kč)",
      },
      {
        label: "Důležitá místa v obci",
        illustration: "🏛️ Obecní úřad — starosta\n🏥 Nemocnice — lékaři\n🚒 Hasiči — hasí požáry\n👮 Policie — bezpečnost\n📬 Pošta — dopisy\n📚 Knihovna — knihy zdarma",
      },
    ],
    funFact: "💡 Většina lidí na světě žije v městech a vesnicích, ale na Zemi existují i lidé, kteří stále žijí jako nomádi a nemají stálý domov. 🏘️⛺",
  },

  "prvouka::Orientace v prostoru a čase": {
    buttonLabel: "Jak se vyznat ve světě?",
    title: "Orientace v prostoru a čase",
    hook: "Kompas, mapa, hodiny — nástroje, se kterými se nikdy neztratíš! 🧭",
    whatIsIt:
      "Naučíš se orientovat podle světových stran, číst jednoduchou mapu, pracovat s hodinami a kalendářem — a seřadit dny i měsíce.",
    whyWeUseIt:
      "Tyto dovednosti potřebuješ každý den — abys věděl/a, kolik je hodin, jaký je den, nebo kudy se vydat na výlet.",
    visualExamples: [
      {
        label: "Světové strany",
        illustration: "         ⬆️ SEVER (S)\n            |\nZÁPAD (Z) ←🧭→ VÝCHOD (V)\n            |\n         ⬇️ JIH (J)\n\n🌅 Slunce vychází na V, zapadá na Z",
      },
      {
        label: "Barvy na mapě",
        illustration: "🔵 Modrá → voda (řeky, jezera)\n🟢 Zelená → nížiny, louky\n🟤 Hnědá → hory a kopce\n📏 Měřítko → vzdálenosti\n📜 Legenda → vysvětlivky značek",
      },
      {
        label: "Čas",
        illustration: "⏰ Den = 24 hodin\n⏱️ Hodina = 60 minut\n📅 Týden = 7 dní\n📅 Rok = 12 měsíců = 365 dní\n\n🕐 Malá ručička → hodiny\n🕐 Velká ručička → minuty",
      },
    ],
    funFact: "💡 Vědci zjistili, že někteří stěhovaví ptáci používají magnetické pole Země, aby se orientovali během dlouhých letů. 🐦🧭",
  },

  // ═══════════════════════════════════════════════════════
  // TOPIC-LEVEL OVERRIDES (shown at subtopic level)
  // ═══════════════════════════════════════════════════════

  // ── MATEMATIKA: Čísla a operace ───────────────────────

  "matematika::Čísla a operace::Násobení a dělení": {
    buttonLabel: "K čemu je násobení a dělení?",
    title: "Násobení a dělení",
    hook: "Násobení je rychlé sčítání a dělení je spravedlivé rozdělení! ✖️➗",
    whatIsIt:
      "Násobení ti pomůže rychle spočítat, kolik je víckrát totéž. Dělení je naopak — rozdělit celek na stejné díly.",
    whyWeUseIt:
      "Násobení potřebuješ, když kupuješ 5 rohlíků po 3 Kč. Dělení, když chceš rozdělit 20 bonbónů mezi 4 kamarády spravedlivě.",
    visualExamples: [
      {
        label: "Násobení",
        illustration: "3 × 4 = ?\n🍎🍎🍎🍎\n🍎🍎🍎🍎\n🍎🍎🍎🍎\n= 12 jablek\n\n💡 3 řádky po 4 = 12",
      },
      {
        label: "Dělení",
        illustration: "12 ÷ 3 = ?\n🍎🍎🍎🍎 | 🍎🍎🍎🍎 | 🍎🍎🍎🍎\n= 4 jablka pro každého\n\n💡 Kolik skupin po 3 se vejde do 12?",
      },
    ],
    funFact: "💡 Víte, že násobení a dělení jsou vlastně jako tajné dveře v matematickém světě? Jedno dveře otevírá, druhé zavírá. 🗝️",
  },

  "matematika::Čísla a operace::Porovnávání přirozených čísel do 100": {
    buttonLabel: "K čemu porovnávat čísla?",
    title: "Porovnávání přirozených čísel do 100",
    hook: "Kdo vyhrál? Kdo má víc? Porovnávání čísel ti pomůže se rychle rozhodnout! 🏆",
    whatIsIt:
      "Porovnávání znamená zjistit, které ze dvou čísel je větší, menší, nebo jestli jsou stejná. Používáš k tomu znaménka < (menší), > (větší) a = (rovná se).",
    whyWeUseIt:
      "Porovnávání potřebuješ každý den — v obchodě (co je levnější?), ve sportu (kdo dal víc gólů?), i ve škole (který výsledek je správný?).",
    visualExamples: [
      {
        label: "Číselná osa",
        illustration: "◀── 0 ── 10 ── 20 ── 30 ── 37 ── 42 ── 50 ──▶\n                              🔴       🟢\n                           menší    větší\n\n37 je víc vlevo → je menší → 37 < 42",
      },
      {
        label: "Zobáček (krokodýl)",
        illustration: "   🐊\n 5 < 8  → zobáček ukazuje k menšímu\n12 > 7  → zobáček ukazuje k menšímu\n\n💡 Krokodýl vždycky chce sežrat to VĚTŠÍ číslo!",
      },
    ],
    funFact: "💡 Nejdelší silnice na světě, Panamerická dálnice, měří přes 48 000 kilometrů, což je mnohem, mnohem víc než jakákoli stovka, kterou si umíme představit! 🛣️",
  },

  "matematika::Čísla a operace::Sčítání a odčítání do 100": {
    buttonLabel: "K čemu je sčítání a odčítání?",
    title: "Sčítání a odčítání do 100",
    hook: "Sčítání je přidávání, odčítání je ubírání — a obojí potřebuješ každý den! ➕➖",
    whatIsIt:
      "Sčítání znamená spojit dvě čísla dohromady. Odčítání je naopak — od většího čísla ubereš menší. Procvičíš si obojí s čísly do 100, včetně přechodu přes desítku.",
    whyWeUseIt:
      "Sčítáš, když počítáš útratu v obchodě. Odčítáš, když zjišťuješ, kolik ti zbude peněz. Bez toho se neobejdeš!",
    visualExamples: [
      {
        label: "Sčítání s přechodem přes desítku",
        illustration: "28 + 5 = ?\n28 + 2 = 30  (doplníš na desítku)\n30 + 3 = 33  (přidáš zbytek)\n\n🍬🍬🍬…28 + 🍬🍬🍬🍬🍬 = 33 bonbónů",
      },
      {
        label: "Odčítání",
        illustration: "45 − 18 = ?\n45 − 10 = 35  (odečteš desítku)\n35 − 8 = 27   (odečteš zbytek)\n\n💡 Rozlož menší číslo na desítky a jednotky!",
      },
    ],
    funFact: "💡 Když sečteme všechna očka na jedné kostce, dostaneme číslo 21. Zkus to! 🎲",
  },

  "matematika::Čísla a operace::Řazení čísel": {
    buttonLabel: "K čemu řadit čísla?",
    title: "Řazení čísel",
    hook: "Seřadit čísla podle velikosti — od nejmenšího po největší, nebo naopak! 🔢",
    whatIsIt:
      "Řazení čísel znamená uspořádat je podle velikosti. Buď od nejmenšího po největší (vzestupně), nebo od největšího po nejmenší (sestupně).",
    whyWeUseIt:
      "Řazení potřebuješ, když třídíš výsledky v soutěži, hledáš nejlevnější zboží, nebo seřazuješ čísla ve škole.",
    visualExamples: [
      {
        label: "Od nejmenšího po největší",
        illustration: "Čísla: 42  15  88  3\n\n1. Nejmenší je 3 → [3]\n2. Pak 15 → [3, 15]\n3. Pak 42 → [3, 15, 42]\n4. Pak 88 → [3, 15, 42, 88] ✅",
      },
      {
        label: "Od největšího po nejmenší",
        illustration: "Čísla: 27  5  63  41\n\n1. Největší je 63 → [63]\n2. Pak 41 → [63, 41]\n3. Pak 27 → [63, 41, 27]\n4. Pak 5 → [63, 41, 27, 5] ✅",
      },
    ],
    funFact: "💡 Dinosauři žili miliony let předtím, než se objevili lidé, což je obrovské pořadí v historii Země. 🦕⏳",
  },

  "matematika::Čísla a operace::Zaokrouhlování": {
    buttonLabel: "K čemu je zaokrouhlování?",
    title: "Zaokrouhlování",
    hook: "Zaokrouhlování je jako najít nejbližší 'kulaté' číslo — je to rychlejší a přehlednější! 🎯",
    whatIsIt:
      "Zaokrouhlování znamená nahradit číslo nejbližším kulatým číslem (desítkou nebo stovkou). Rozhoduješ podle číslice vedle — je-li 5 nebo víc, zaokrouhlíš nahoru.",
    whyWeUseIt:
      "Zaokrouhlování používáš, když odhaduješ cenu nákupu, říkáš, kolik je asi lidí na koncertě, nebo rychle počítáš v hlavě.",
    visualExamples: [
      {
        label: "Na desítky",
        illustration: "       30 ─── 35 ─── 40\n                ↑\n               37\n\n37 → číslice 7 ≥ 5 → nahoru → 40\n32 → číslice 2 < 5 → dolů → 30",
      },
      {
        label: "Na stovky",
        illustration: "     300 ─── 350 ─── 400\n                 ↑\n                370\n\n370 → desítky = 7 ≥ 5 → nahoru → 400\n320 → desítky = 2 < 5 → dolů → 300",
      },
    ],
    funFact: "💡 Hmyzí společenství, jako jsou mravenci, žijí v koloniích, které mohou mít desítky tisíc nebo i miliony jedinců; pro snadnější představu se jejich počty často zaokrouhlují. 🐜",
  },

  // ── MATEMATIKA: Zlomky ────────────────────────────────

  "matematika::Zlomky::Porovnávání zlomků": {
    buttonLabel: "K čemu porovnávat zlomky?",
    title: "Porovnávání zlomků",
    hook: "Co je víc — půlka pizzy nebo třetina? Porovnávání zlomků ti dá odpověď! ⚖️",
    whatIsIt:
      "Porovnávání zlomků znamená zjistit, který zlomek je větší, menší nebo jestli jsou stejné. Se stejným jmenovatelem porovnáváš čitatele, s různým musíš zlomky nejdřív převést.",
    whyWeUseIt:
      "Potřebuješ to, když chceš vědět, kdo dostal víc dortu, nebo jestli 2/5 je víc než 1/3.",
    visualExamples: [
      {
        label: "Stejný jmenovatel",
        illustration: "3/8 vs 5/8:\n███░░░░░  vs  █████░░░\n3 < 5 → 3/8 < 5/8\n\n💡 Stejný jmenovatel = porovnej čitatele!",
      },
      {
        label: "Různý jmenovatel",
        illustration: "1/3 vs 1/4:\n████░░░░░░░░  vs  ███░░░░░░░░░\n1/3 > 1/4\n\n💡 Větší jmenovatel = menší díly!",
      },
    ],
    funFact: "💡 Představ si, že máš pizzu rozdělenou na 8 dílků a kamarád na 4 dílky; půlka tvojí pizzy (4/8) je stejně velká jako půlka jeho pizzy (2/4)! 🍕",
  },

  "matematika::Zlomky::Krácení zlomků": {
    buttonLabel: "K čemu krátit zlomky?",
    title: "Krácení zlomků",
    hook: "Krácení zlomků je jako zjednodušování — říkáš totéž, ale kratčeji! ✂️",
    whatIsIt:
      "Krácení zlomku znamená vydělit čitatele i jmenovatele stejným číslem. Zlomek se zmenší, ale jeho hodnota zůstane stejná. Například 4/8 = 1/2.",
    whyWeUseIt:
      "Zkrácený zlomek je přehlednější a snáze se s ním počítá. Ve škole se často vyžaduje výsledek v základním tvaru.",
    visualExamples: [
      {
        label: "Jak to funguje",
        illustration: "4/8 → oba děl 4 → 1/2\n████░░░░ = ████░░░░\n\n6/9 → oba děl 3 → 2/3\n\n💡 Hledej největší společný dělitel!",
      },
    ],
    funFact: "💡 Krácení zlomků je jako zmenšování obrázku, kde sice vypadá menší, ale pořád na něm je to samé, jen v jednodušší podobě. 🖼️",
  },

  "matematika::Zlomky::Rozšiřování zlomků": {
    buttonLabel: "K čemu rozšiřovat zlomky?",
    title: "Rozšiřování zlomků",
    hook: "Rozšiřování je jako zvětšování obrázku — nic se nezmění, jen je to podrobnější! 🔍",
    whatIsIt:
      "Rozšiřování zlomku znamená vynásobit čitatele i jmenovatele stejným číslem. Zlomek vypadá jinak, ale hodnota zůstává stejná. Potřebuješ to, když chceš sčítat zlomky s různým jmenovatelem.",
    whyWeUseIt:
      "Bez rozšíření nemůžeš sčítat ani odčítat zlomky s různým jmenovatelem. Je to klíčový krok!",
    visualExamples: [
      {
        label: "Jak to funguje",
        illustration: "1/3 → oba × 2 → 2/6\n████░░░░░░░░ = ████████░░░░░░░░░░░░░░░░\n\n1/4 → oba × 3 → 3/12\n\n💡 Hodnota se nemění, jen 'rozlišení'!",
      },
    ],
    funFact: "💡 Rozšiřování zlomků je jako zvětšování měřítka mapy — mapa vypadá jinak, ale krajina zůstává stejná! 🗺️🔍",
  },

  "matematika::Zlomky::Sčítání zlomků": {
    buttonLabel: "K čemu sčítat zlomky?",
    title: "Sčítání zlomků",
    hook: "Sčítání zlomků je jako skládání kousků dortu zpátky dohromady! 🍰➕🍰",
    whatIsIt:
      "Sčítání zlomků se stejným jmenovatelem je jednoduché — sečteš čitatele a jmenovatel zůstane. S různým jmenovatelem musíš nejdřív rozšířit na společný.",
    whyWeUseIt:
      "Když sníš 1/4 dortu a pak 2/4, chceš vědět, kolik jsi snědl celkem. To je sčítání zlomků!",
    visualExamples: [
      {
        label: "Stejný jmenovatel",
        illustration: "1/5 + 2/5 = 3/5\n🟡⬜⬜⬜⬜ + ⬜🟡🟡⬜⬜ = 🟡🟡🟡⬜⬜",
      },
      {
        label: "Různý jmenovatel",
        illustration: "1/2 + 1/3 = ?\n→ rozšířit na 6: 3/6 + 2/6 = 5/6\n\n💡 Najdi společného jmenovatele!",
      },
    ],
    funFact: "💡 Na zeměkouli existuje asi 1,5 milionu druhů hub, a když bychom je všechny sečetli, dostaneme obrovskou rozmanitost! 🍄",
  },

  "matematika::Zlomky::Odčítání zlomků": {
    buttonLabel: "K čemu odčítat zlomky?",
    title: "Odčítání zlomků",
    hook: "Odčítání zlomků je jako ubírání kousků z dortu — kolik zbyde? 🍰➖",
    whatIsIt:
      "Odčítání zlomků funguje podobně jako sčítání — se stejným jmenovatelem odečteš čitatele, s různým jmenovatelem musíš nejdřív rozšířit.",
    whyWeUseIt:
      "Když máš 3/4 dortu a dáš kamarádovi 1/4, potřebuješ odčítání zlomků, abys zjistil, kolik ti zbyde.",
    visualExamples: [
      {
        label: "Stejný jmenovatel",
        illustration: "3/4 − 1/4 = 2/4 = 1/2\n🟡🟡🟡⬜ − 🟡⬜⬜⬜ = ⬜🟡🟡⬜",
      },
    ],
    funFact: "💡 Když máš celé jablko a sníš z něj čtvrtinu, tak ti zbydou tři čtvrtiny, což je ukázka odčítání. 🍎➖",
  },

  "matematika::Zlomky::Smíšená čísla": {
    buttonLabel: "K čemu jsou smíšená čísla?",
    title: "Smíšená čísla",
    hook: "Když je to víc než celý kus, ale ne celé číslo — to je smíšené číslo! 🧩",
    whatIsIt:
      "Smíšené číslo je kombinace celého čísla a zlomku, například 2 3/4. Znamená to 2 celé a ještě 3/4. Umíš ho převést na zlomek a zpátky.",
    whyWeUseIt:
      "V běžném životě říkáš 'dvě a půl hodiny' nebo 'jeden a čtvrt kilogramu' — to jsou smíšená čísla! Potřebuješ je, aby ses vyjádřil přirozeně.",
    visualExamples: [
      {
        label: "Co to je",
        illustration: "2 3/4 = dvě celé a tři čtvrtiny\n🍕🍕 + 🍕¾ kousků\n\nPřevod na zlomek:\n2 3/4 → (2 × 4 + 3) / 4 = 11/4",
      },
      {
        label: "Sčítání smíšených",
        illustration: "1 1/3 + 2 1/3 = 3 2/3\ncelé: 1 + 2 = 3\nzlomky: 1/3 + 1/3 = 2/3",
      },
    ],
    funFact: "💡 Některé recepty často používají smíšená čísla, například 'dva a půl šálku mouky', abys věděl, kolik přesně přidat. 🍰",
  },

  "matematika::Zlomky::Zlomek z čísla": {
    buttonLabel: "K čemu je zlomek z čísla?",
    title: "Zlomek z čísla",
    hook: "Kolik je třetina z 12? Zlomek z čísla ti to řekne! 🍎",
    whatIsIt:
      "Zlomek z čísla znamená najít část z celku. Například 2/5 z 20 = vyděl 20 pěti (= 4) a vynásob dvěma (= 8).",
    whyWeUseIt:
      "Potřebuješ to při slevách (1/4 z ceny), dělení jídla (třetina čokolády z 12 kostek) i v receptech.",
    visualExamples: [
      {
        label: "Jak to spočítat",
        illustration: "2/5 z 20 = ?\n1) 20 ÷ 5 = 4 (jeden díl)\n2) 4 × 2 = 8 (dva díly)\n\n🍎🍎🍎🍎 | 🍎🍎🍎🍎 | 🍎🍎🍎🍎 | 🍎🍎🍎🍎 | 🍎🍎🍎🍎\n    ✅✅           (= 8 jablek)",
      },
    ],
    funFact: "💡 V lidském těle tvoří voda asi 2/3 celkové hmotnosti, což znamená, že z každých tří dílků tvé váhy jsou dva dílky voda. 💧",
  },

  "matematika::Zlomky::Násobení zlomku celým číslem": {
    buttonLabel: "K čemu násobit zlomek číslem?",
    title: "Násobení zlomku celým číslem",
    hook: "Tři čtvrtinové kousky dortu? To je násobení zlomku celým číslem! ✖️🍰",
    whatIsIt:
      "Násobení zlomku celým číslem znamená vzít zlomek vícekrát. Vynásobíš jen čitatele, jmenovatel zůstane. Například 3 × 2/5 = 6/5 = 1 1/5.",
    whyWeUseIt:
      "Když na každém talíři necháš 1/4 dortu a máš 3 talíře — kolik dortu celkem? 3 × 1/4 = 3/4.",
    visualExamples: [
      {
        label: "Jak to funguje",
        illustration: "3 × 2/5 = (3 × 2) / 5 = 6/5 = 1 1/5\n\n🟡🟡⬜⬜⬜  ×3 =\n🟡🟡🟡🟡🟡 🟡⬜⬜⬜⬜\n= jeden celý a jedna pětinka",
      },
    ],
    funFact: "💡 Násobení zlomku číslem a zlomek z čísla dávají stejný výsledek: 3 × 1/4 = 3/4, a 1/4 ze 3 = 3/4! Jsou to dvojčata. 👯",
  },

  // ── MATEMATIKA: Geometrie (already have Geometrické tvary, Obvod, Měření) ──

  // ── ČEŠTINA ───────────────────────────────────────────

  "čeština::Vyjmenovaná slova::Vyjmenovaná slova po B": {
    buttonLabel: "K čemu jsou slova po B?",
    title: "Vyjmenovaná slova po B",
    hook: "Být, bydlit, bylina — tahle slova po B píšeš s tvrdým Y! 🅱️",
    whatIsIt: "Vyjmenovaná slova po B jsou skupina slov, kde se po písmenu B píše tvrdé Y/Ý. Musíš je znát i s příbuznými slovy.",
    whyWeUseIt: "Abys správně psal/a slova jako bydlet, obyvatel, kobyla a nepletl/a si je se slovy jako bít (= tlouci).",
    visualExamples: [
      { label: "Hlavní slova", illustration: "být, bydlit, bylina, kobyla, býk,\nbystrý, Přibyslav, aby\n\n💡 + příbuzná: bydlet, obyvatel, byt, příbytek..." },
    ],
    funFact: "💡 Slavná věta Williama Shakespeara 'Být, či nebýt' začíná vyjmenovaným slovem po B — a je to nejcitovanější věta v dějinách divadla! 🎭",
  },

  "čeština::Vyjmenovaná slova::Vyjmenovaná slova po L": {
    buttonLabel: "K čemu jsou slova po L?",
    title: "Vyjmenovaná slova po L",
    hook: "Lyže, slyšet, mlýn — po L taky někdy píšeš Y! 🇱",
    whatIsIt: "Vyjmenovaná slova po L jsou slova, kde se po L píše tvrdé Y/Ý, i když vyslovuješ stejně jako I.",
    whyWeUseIt: "Abys věděl/a, že 'lyže' se píše s Y, ale 'lípa' s I.",
    visualExamples: [
      { label: "Hlavní slova", illustration: "slyšet, mlýn, blýskat se, polykat,\nplynout, plýtvat, vzlykat, lysý,\nlýko, lyže, lýtko, lžíce\n\n💡 + příbuzná: slýchat, mlynář, blýskavice..." },
    ],
    funFact: "💡 'Polykat' je vyjmenované slovo po L a představ si, že i žirafa polkne jídlo, aniž by se zadusila, díky dlouhému krku! 🦒",
  },

  "čeština::Vyjmenovaná slova::Vyjmenovaná slova po M": {
    buttonLabel: "K čemu jsou slova po M?",
    title: "Vyjmenovaná slova po M",
    hook: "My, myslet, mýlit se — po M je Y častější, než bys čekal/a! Ⓜ️",
    whatIsIt: "Vyjmenovaná slova po M obsahují slova, kde se po M píše tvrdé Y/Ý.",
    whyWeUseIt: "Abys správně psal/a slova jako 'my' (= my všichni) a nepletl/a si to s 'mi' (= mně).",
    visualExamples: [
      { label: "Hlavní slova", illustration: "my, myslet, mýlit se, hmyz, myš,\nhřmít, mýtit, zamykat, smýkat,\ndmýchat, chmýří, mýto, mykat\n\n💡 my = my všichni, mi = mně" },
    ],
    funFact: "💡 'Mýlit se' patří mezi vyjmenovaná slova po M a je v pořádku se mýlit, protože z chyb se učíme nejvíce. 🧠",
  },

  "čeština::Vyjmenovaná slova::Vyjmenovaná slova po P": {
    buttonLabel: "K čemu jsou slova po P?",
    title: "Vyjmenovaná slova po P",
    hook: "Pýcha, pytel, pyl — i po P se schová tvrdé Y! 🅿️",
    whatIsIt: "Vyjmenovaná slova po P jsou slova s tvrdým Y/Ý po písmenu P.",
    whyWeUseIt: "Abys správně zapsal/a 'pytel' (= taška) a nezaměnil/a s 'pít' (= napít se).",
    visualExamples: [
      { label: "Hlavní slova", illustration: "pýcha, pytel, pysk, netopýr, slepýš,\npyl, kopyto, klopýtat, třpytit se,\nzpytovat, pykat, pýřit se\n\n💡 + příbuzná: pytlík, pyšný, kopýtko..." },
    ],
    funFact: "💡 'Pýl' je vyjmenované slovo po P a je to malý zázrak, který pomáhá květinám tvořit semínka a ovoce. 🐝🌸",
  },

  "čeština::Vyjmenovaná slova::Vyjmenovaná slova po S": {
    buttonLabel: "K čemu jsou slova po S?",
    title: "Vyjmenovaná slova po S",
    hook: "Syn, sýr, sychravý — po S se taky občas píše Y! 🔤",
    whatIsIt: "Vyjmenovaná slova po S jsou slova, kde se po S píše tvrdé Y/Ý.",
    whyWeUseIt: "Abys nezaměnil/a 'sýr' (= jídlo) za 'sir' a správně psal/a celou rodinu příbuzných slov.",
    visualExamples: [
      { label: "Hlavní slova", illustration: "syn, sytý, sýr, syrový, sýkora,\nsychravý, usychat, sypat\n\n💡 + příbuzná: synovec, sýrový, sýkorka, nasytit..." },
    ],
    funFact: "💡 Slovo 'slyšet' je vyjmenované slovo po S, a víš, že sovy mají jedno ucho výše než druhé, aby lépe slyšely myši? 🦉👂",
  },

  "čeština::Vyjmenovaná slova::Vyjmenovaná slova po V": {
    buttonLabel: "K čemu jsou slova po V?",
    title: "Vyjmenovaná slova po V",
    hook: "Výt, vykat, vysoký — po V je Y nejčastější ze všech souhlásek! ✌️",
    whatIsIt: "Vyjmenovaná slova po V jsou nejpočetnější skupinou. Spousta slov s předponou vy-/vý- se píše s Y.",
    whyWeUseIt: "Po V se Y vyskytuje velmi často — je to nejdůležitější skupina k zapamatování.",
    visualExamples: [
      { label: "Hlavní slova", illustration: "vy, vykat, vysoký, výt, výskat,\nzvykat, žvýkat, výr, vydra,\nvyžle, povyk, výheň\n\n💡 Předpona VY-/VÝ- = vždy Y!" },
    ],
    funFact: "💡 Předpona vy-/vý- se vyskytuje v češtině u více než 500 slov — proto je po V vyjmenovaných slov úplně nejvíc ze všech souhlásek! 📚✨",
  },

  "čeština::Vyjmenovaná slova::Vyjmenovaná slova po Z": {
    buttonLabel: "K čemu jsou slova po Z?",
    title: "Vyjmenovaná slova po Z",
    hook: "Jazyk, brzy, nazývat — i po Z občas píšeš Y! 💤",
    whatIsIt: "Vyjmenovaná slova po Z jsou nejmenší skupinka — jen pár slov, ale o to důležitější je je znát.",
    whyWeUseIt: "Abys správně psal/a 'jazyk', 'brzy' a jejich příbuzná slova.",
    visualExamples: [
      { label: "Hlavní slova", illustration: "brzy, jazyk, nazývat, Ruzyně\n\n💡 + příbuzná: brzičko, jazykový,\njazykovědec, nazývaný..." },
    ],
    funFact: "💡 Slovo 'brzy' je vyjmenované slovo po Z, a brzy svítá, když slyšíme kohouta! 🐓☀️",
  },

  // ── ČEŠTINA: Pravopis ─────────────────────────────────

  "čeština::Pravopis::Párové souhlásky": {
    buttonLabel: "K čemu znát párové souhlásky?",
    title: "Párové souhlásky",
    hook: "Led nebo let? Na konci slova slyšíš totéž — ale píšeš jinak! 🔀",
    whatIsIt: "Párové souhlásky jsou dvojice hlásek (B-P, D-T, Ď-Ť, G-K, V-F, Z-S, Ž-Š, H-CH), které na konci slova nebo před jinou souhláskou zní stejně. Musíš si ověřit, kterou napsat.",
    whyWeUseIt: "Správné písmeno zjistíš změnou tvaru slova — 'led → ledy' (D), 'let → letu' (T).",
    visualExamples: [
      { label: "Jak to funguje", illustration: "le_ → ledy → D ✅\nchle_ → chleba → B ✅\nobra_ → obrazy → Z ✅\n\n💡 Zkus množné číslo nebo jiný pád!" },
    ],
    funFact: "💡 Párové souhlásky jsou jako bráchové a ségry abecedy, kteří znějí podobně, ale píší se jinak, jako třeba 'p' a 'b'. 👯‍♀️",
  },

  "čeština::Pravopis::Tvrdé a měkké souhlásky": {
    buttonLabel: "K čemu znát tvrdé a měkké?",
    title: "Tvrdé a měkké souhlásky",
    hook: "Po tvrdých píšeš Y, po měkkých I — tohle pravidlo je základ! 🧊",
    whatIsIt: "Tvrdé souhlásky (H, CH, K, R, D, T, N) se pojí s Y/Ý. Měkké souhlásky (Ž, Š, Č, Ř, C, J, Ď, Ť, Ň) se pojí s I/Í. Obojetné (B, F, L, M, P, S, V, Z) — tam rozhoduješ podle vyjmenovaných slov.",
    whyWeUseIt: "Je to základní pravopisné pravidlo — díky němu správně píšeš 'ryba' (tvrdé R → Y) a 'číše' (měkké Č → I).",
    visualExamples: [
      { label: "Přehled", illustration: "🧊 TVRDÉ: H CH K R D T N → Y/Ý\n🧸 MĚKKÉ: Ž Š Č Ř C J Ď Ť Ň → I/Í\n🔄 OBOJETNÉ: B F L M P S V Z → podle pravidel" },
    ],
    funFact: "💡 Některé jazyky, jako třeba ruština, rozlišují tvrdé a měkké souhlásky, a ty ovlivňují, jak se vyslovují, podobně jako v češtině. 🇷🇺",
  },

  "čeština::Pravopis::Psaní velkých písmen": {
    buttonLabel: "Kdy psát velké písmeno?",
    title: "Psaní velkých písmen",
    hook: "Praha, Vltava, pan Novák — vlastní jména píšeš s velkým písmenem! 🔠",
    whatIsIt: "Velké písmeno píšeš na začátku věty a u vlastních jmen — jmen osob, měst, řek, hor, zemí a dalších.",
    whyWeUseIt: "Velké písmeno říká čtenáři, že jde o konkrétní jméno, ne obyčejné slovo.",
    visualExamples: [
      { label: "Příklady", illustration: "🏙️ Praha, Brno, Ostrava (města)\n🏔️ Sněžka, Říp (hory)\n🌊 Vltava, Labe (řeky)\n👤 Petr, Anička (jména)\n🐕 Rex, Micka (jména zvířat)" },
    ],
    funFact: "💡 Ve starověku se psalo jen velkými písmeny — malá písmena vymysleli až středověcí písaři, aby psali rychleji! ✍️📜",
  },

  // ── ČEŠTINA: Mluvnice ─────────────────────────────────

  "čeština::Mluvnice::Slovní druhy": {
    buttonLabel: "K čemu jsou slovní druhy?",
    title: "Slovní druhy",
    hook: "Každé slovo v češtině má svůj druh — jako každý hráč v týmu má svou pozici! 🏷️",
    whatIsIt: "V češtině rozlišujeme 10 slovních druhů. Nejdůležitější jsou podstatná jména (Kdo? Co?), přídavná jména (Jaký?), slovesa (Co dělá?) a zájmena (kdo místo jména).",
    whyWeUseIt: "Když znáš slovní druhy, lépe rozumíš větám a správně skloňuješ a časuješ.",
    visualExamples: [
      { label: "Základní druhy", illustration: "🐕 Podstatné jméno → Kdo? Co? (pes, škola)\n🏃 Sloveso → Co dělá? (běží, spí)\n🎨 Přídavné jméno → Jaký? (velký, hezký)\n👆 Zájmeno → kdo místo jména (on, já, ten)" },
    ],
    funFact: "💡 Ve světě existuje kolem 7000 živých jazyků a každý z nich má svá vlastní pravidla pro slovní druhy. 🗣️🌍",
  },

  "čeština::Mluvnice::Rod a číslo podstatných jmen": {
    buttonLabel: "K čemu je rod a číslo?",
    title: "Rod a číslo podstatných jmen",
    hook: "TEN pes, TA kočka, TO okno — každé podstatné jméno má svůj rod! 👤",
    whatIsIt: "Podstatná jména mají rod (mužský, ženský, střední) a číslo (jednotné, množné). Rod poznáš pomocí ukazovacích zájmen ten/ta/to.",
    whyWeUseIt: "Správný rod potřebuješ, aby ti seděly koncovky přídavných jmen a sloves — 'velký pes' ale 'velká kočka'.",
    visualExamples: [
      { label: "Tři rody", illustration: "🔵 TEN pes, hrad, strom → mužský\n🔴 TA kočka, škola, ulice → ženský\n🟢 TO okno, město, moře → střední\n\n💡 Zkus si říct TEN/TA/TO + slovo!" },
    ],
    funFact: "💡 V češtině mají podstatná jména tři rody (mužský, ženský, střední), což je jako mít tři různé oblečky pro každé slovo! 👗👔👕",
  },

  "čeština::Mluvnice::Určování sloves": {
    buttonLabel: "K čemu určovat slovesa?",
    title: "Určování sloves",
    hook: "Sloveso je motor věty — říká, co se děje! Běží, spí, skáče! 🏃",
    whatIsIt: "U sloves určuješ osobu (já, ty, on...), číslo (jednotné, množné) a čas (minulý, přítomný, budoucí).",
    whyWeUseIt: "Správné určení slovesa ti pomůže tvořit gramaticky správné věty a psát správné koncovky.",
    visualExamples: [
      { label: "Osoba a číslo", illustration: "já běžím (1. os. j.č.)\nty běžíš (2. os. j.č.)\non/ona běží (3. os. j.č.)\nmy běžíme (1. os. mn.č.)\nvy běžíte (2. os. mn.č.)\noni běží (3. os. mn.č.)" },
    ],
    funFact: "💡 Slovesa jsou jako akciové hrdiny vět, protože popisují, co se děje, například když lev řve nebo slunce svítí. 🦁☀️",
  },

  "čeština::Mluvnice::Základ věty": {
    buttonLabel: "K čemu je základ věty?",
    title: "Základ věty",
    hook: "Každá věta má podmět (kdo?) a přísudek (co dělá?) — to je její základ! 📋",
    whatIsIt: "Základ věty tvoří podmět (o kom/čem věta je) a přísudek (co dělá nebo jaký je). Podmět a přísudek spolu tvoří skladební dvojici.",
    whyWeUseIt: "Když umíš najít základ věty, lépe rozumíš textu a správně tvoříš vlastní věty.",
    visualExamples: [
      { label: "Příklad", illustration: "Pes štěká na dvore.\n━━━  ━━━━\nPODMĚT  PŘÍSUDEK\nKdo? → pes   Co dělá? → štěká\n\n💡 Podmět = kdo/co, Přísudek = co dělá" },
    ],
    funFact: "💡 Základ věty je jako kostra domu, bez něj by se celá věta zřítila! 🏠🧱",
  },

  "čeština::Diktát::Doplňovací diktát": {
    buttonLabel: "Jak funguje diktát?",
    title: "Doplňovací diktát",
    hook: "Diktát je jako detektivka — najdi správné pravidlo a doplň písmenko! 🔍",
    whatIsIt: "V doplňovacím diktátu doplňuješ chybějící písmena do vět. Musíš sám poznat, jaké pravidlo použít — vyjmenovaná slova, párové souhlásky, tvrdé/měkké, nebo velká písmena.",
    whyWeUseIt: "Diktát prověří všechno najednou — jestli opravdu umíš pravidla použít v praxi.",
    visualExamples: [
      { label: "Příklad", illustration: "Na louce stála kob_la. → Y (vyjm. po B)\nV trávě leze ha_. → D (had → hadi)\nR_by plavou v ř_ce. → Y, Í (tvrdé R, měkké Ř)" },
    ],
    funFact: "💡 Mozek dokáže doplňovat chybějící informace, stejně jako ve doplňovacím diktátu, a často nám to usnadňuje čtení. 🧠🧩",
  },

  // ── PRVOUKA ───────────────────────────────────────────

  "prvouka::Člověk a jeho tělo::Lidské tělo": {
    buttonLabel: "Co všechno víš o svém těle?",
    title: "Lidské tělo",
    hook: "Tvoje tělo má přes 200 kostí a 600 svalů — je to úžasný stroj! 🦴",
    whatIsIt: "Lidské tělo se skládá z kostry, svalů, orgánů a kůže. Každá část má svůj úkol — kostra drží tělo, svaly ho pohybují a orgány zajišťují, že žiješ.",
    whyWeUseIt: "Když znáš své tělo, víš, jak o něj pečovat — proč cvičit, co jíst a proč spát.",
    visualExamples: [
      { label: "Hlavní orgány", illustration: "🧠 Mozek — řídí celé tělo\n❤️ Srdce — pumpuje krev\n🫁 Plíce — dýchání\n🟡 Žaludek — tráví jídlo\n🦴 Kostra — drží tělo\n💪 Svaly — pohyb" },
    ],
    funFact: "💡 Každý člověk má unikátní otisky prstů, stejně jako každý sněhový vločka je jiná. ❄️🖐️",
  },

  "prvouka::Člověk a jeho tělo::Smysly": {
    buttonLabel: "Jak fungují smysly?",
    title: "Smysly",
    hook: "Máš 5 smyslů — díky nim vidíš, slyšíš, cítíš vůně, chutě i dotyk! 👁️",
    whatIsIt: "Smysly jsou schopnosti, kterými vnímáš svět kolem sebe. Zrak (oči), sluch (uši), čich (nos), chuť (jazyk) a hmat (kůže).",
    whyWeUseIt: "Smysly tě chrání — díky zraku vidíš auto, díky sluchu slyšíš varování, díky hmatu ucukneš od horkého.",
    visualExamples: [
      { label: "5 smyslů", illustration: "👁️ ZRAK — barvy, tvary, vzdálenost\n👂 SLUCH — zvuky, hudba, řeč\n👃 ČICH — vůně, zápach\n👅 CHUŤ — sladké, kyselé, slané, hořké\n✋ HMAT — teplé, studené, hladké, drsné" },
    ],
    funFact: "💡 Kočky mají vynikající sluch a čich a dokážou slyšet zvuky, které jsou pro člověka neslyšitelné. 🐱👂",
  },

  "prvouka::Člověk a jeho tělo::Zdraví a hygiena": {
    buttonLabel: "Proč je hygiena důležitá?",
    title: "Zdraví a hygiena",
    hook: "Mytí rukou, čištění zubů, zdravé jídlo — malé návyky s velkým účinkem! 🧼",
    whatIsIt: "Hygiena jsou pravidla čistoty a péče o zdraví. Patří sem mytí rukou, sprchování, čištění zubů, zdravé stravování a dostatek pohybu a spánku.",
    whyWeUseIt: "Správná hygiena tě chrání před nemocemi. Mytí rukou zastaví šíření bakterií a virů.",
    visualExamples: [
      { label: "Denní návyky", illustration: "🪥 Zuby: ráno a večer, 2 minuty\n🧼 Ruce: po WC, před jídlem, po příchodu\n🚿 Sprcha: každý den\n🥗 Jídlo: ovoce, zelenina, voda\n😴 Spánek: 9-11 hodin (děti)" },
    ],
    funFact: "💡 Pravidelné mytí rukou teplou vodou a mýdlem dokáže odstranit miliony bakterií a virů a pomáhá nám zůstat zdraví. 🧼🙌",
  },

  "prvouka::Příroda kolem nás::Rostliny": {
    buttonLabel: "Co víš o rostlinách?",
    title: "Rostliny",
    hook: "Rostliny vyrábí kyslík, který dýcháš — bez nich by nebyl život! 🌱",
    whatIsIt: "Rostliny jsou živé organismy, které pomocí slunečního světla vyrábí potravu (fotosyntéza). Mají kořen, stonek, listy, květ a plod.",
    whyWeUseIt: "Rostliny nám dávají jídlo, kyslík, dřevo, léky i krásu. Je důležité je znát a chránit.",
    visualExamples: [
      { label: "Části rostliny", illustration: "🌸 Květ — láká hmyz, vzniká plod\n🍃 List — fotosyntéza (vyrábí potravu)\n🌿 Stonek — drží a vede vodu\n🌱 Kořen — nasává vodu ze země\n🍎 Plod — obsahuje semena" },
    ],
    funFact: "💡 Nejvyšší strom na světě, sekvoje z Kalifornie, měří přes 115 metrů, což je jako mít dvakrát pražský chrám svatého Víta nad sebou! 🌲⬆️",
  },

  "prvouka::Příroda kolem nás::Zvířata": {
    buttonLabel: "Co víš o zvířatech?",
    title: "Zvířata",
    hook: "Savci, ptáci, hmyz, ryby — zvířata jsou neuvěřitelně rozmanitá! 🐾",
    whatIsIt: "Zvířata dělíme do skupin podle jejich vlastností: savci (srst, kojí), ptáci (peří, zobák), hmyz (6 noh), plazi (šupiny), obojživelníci (voda i souš), ryby (ploutve, žábry).",
    whyWeUseIt: "Když rozumíš zvířatům, víš, jak se k nim chovat, proč je chránit a jak funguje příroda.",
    visualExamples: [
      { label: "Skupiny", illustration: "🐄 SAVCI — pes, kočka, medvěd\n🦅 PTÁCI — orel, sýkora, sova\n🐝 HMYZ — včela, mravenec, motýl\n🐍 PLAZI — had, ještěrka, želva\n🐸 OBOJŽIVELNÍCI — žába, mlok\n🐟 RYBY — kapr, pstruh, štika" },
    ],
    funFact: "💡 Největší zvíře, které kdy žilo na Zemi, je plejtvák obrovský, který může vážit jako 30 slonů! 🐳🐘",
  },

  "prvouka::Příroda kolem nás::Roční období a počasí": {
    buttonLabel: "Proč se mění roční období?",
    title: "Roční období a počasí",
    hook: "Jaro, léto, podzim, zima — příroda se celý rok proměňuje! 🌦️",
    whatIsIt: "Rok se dělí na 4 roční období. Každé přináší jiné počasí, teploty a změny v přírodě. Střídají se díky naklonění zemské osy.",
    whyWeUseIt: "Když znáš roční období, rozumíš, proč padá listí, proč ptáci odlétají a proč se v zimě musíš teple oblékat.",
    visualExamples: [
      { label: "4 roční období", illustration: "🌸 JARO — taje, kvete, mláďata se rodí\n☀️ LÉTO — teplo, dlouhé dny, prázdniny\n🍂 PODZIM — listí padá, houby, zásoby\n❄️ ZIMA — mráz, sníh, krátké dny" },
    ],
    funFact: "💡 Na Marsu také probíhají roční období, ale trvají dvakrát déle než na Zemi, protože oběh kolem Slunce trvá déle. 🪐☀️",
  },

  "prvouka::Lidé a společnost::Rodina a společnost": {
    buttonLabel: "K čemu je rodina?",
    title: "Rodina a společnost",
    hook: "Rodina je tvůj první tým — společně se učíte, pomáháte si a máte se rádi! 👨‍👩‍👧",
    whatIsIt: "Rodina je skupina blízkých lidí — rodiče, sourozenci, prarodiče. Ve společnosti se učíme pravidlům soužití, slušnému chování a vzájemnému respektu.",
    whyWeUseIt: "V rodině se učíš základní hodnoty — pomáhat, naslouchat, řešit problémy mluvením a respektovat druhé.",
    visualExamples: [
      { label: "Pravidla soužití", illustration: "🫂 Říkáme PROSÍM a DĚKUJI\n🤝 Nasloucháme druhým\n🧹 Pomáháme doma\n💬 Řešíme problémy mluvením\n❤️ Respektujeme jeden druhého" },
    ],
    funFact: "💡 Ve starověkém Řecku se děti učily číst a psát na voskových tabulkách, které se daly snadno smazat a použít znovu. 📜✍️",
  },

  "prvouka::Lidé a společnost::Naše země": {
    buttonLabel: "Co víš o naší zemi?",
    title: "Naše země",
    hook: "Česká republika — země hradů, piva, Smetany a dvouocasého lva! 🇨🇿",
    whatIsIt: "Naše země je Česká republika. Poznáš její hlavní město (Praha), státní symboly (vlajka, hymna, znak), důležitá místa a jak funguje obec a město.",
    whyWeUseIt: "Je důležité vědět, kde žiješ — znát svou zemi, její symboly a jak funguje správa obce.",
    visualExamples: [
      { label: "Česká republika", illustration: "🏛️ Hlavní město: Praha\n🇨🇿 Vlajka: bílá, červená, modrý klín\n🦁 Znak: dvouocasý lev\n🎵 Hymna: Kde domov můj\n🗺️ Sousedé: Německo, Polsko, Slovensko, Rakousko" },
    ],
    funFact: "💡 Pražský hrad je největší hradní komplex na světě — měří přes 570 metrů a je zapsaný v Guinnessově knize rekordů! 🏰🇨🇿",
  },

  "prvouka::Orientace v prostoru a čase::Orientace": {
    buttonLabel: "Jak se orientovat?",
    title: "Orientace v prostoru",
    hook: "Sever, jih, východ, západ — s kompasem a mapou se nikdy neztratíš! 🧭",
    whatIsIt: "Orientace v prostoru znamená umět se vyznat — znát světové strany, číst jednoduchou mapu a vědět, kde je nahoře, dole, vlevo, vpravo.",
    whyWeUseIt: "Potřebuješ to na výletě, při hledání cesty i při čtení mapy v telefonu.",
    visualExamples: [
      { label: "Světové strany", illustration: "         ⬆️ SEVER\n            |\nZÁPAD ←🧭→ VÝCHOD\n            |\n         ⬇️ JIH\n\n🌅 Slunce vychází na východě, zapadá na západě" },
    ],
    funFact: "💡 Severní polární záře, aurora borealis, je úžasný přírodní jev, který vzniká, když sluneční částice narazí na magnetické pole Země. 🌌✨",
  },

  "prvouka::Orientace v prostoru a čase::Čas": {
    buttonLabel: "Jak měříme čas?",
    title: "Čas",
    hook: "Hodiny, dny, měsíce, roky — čas plyne pořád, a ty se v něm umíš vyznat! ⏰",
    whatIsIt: "Čas měříme hodinami, kalendářem a znalostí dnů v týdnu a měsíců v roce. Naučíš se číst hodiny, řadit dny a orientovat se v kalendáři.",
    whyWeUseIt: "Bez času bys nevěděl/a, kdy jít do školy, kdy jsou narozeniny nebo kolik minut zbývá do přestávky!",
    visualExamples: [
      { label: "Jednotky času", illustration: "⏱️ 1 minuta = 60 sekund\n⏰ 1 hodina = 60 minut\n📅 1 den = 24 hodin\n📅 1 týden = 7 dní\n📅 1 rok = 12 měsíců = 365 dní" },
    ],
    funFact: "💡 Ve starověkém Egyptě se čas měřil pomocí slunečních hodin nebo vodních hodin, protože neměli naše moderní budíky. ⏰⏳",
  },

  // ═══════════════════════════════════════════════════════
  // PŘÍRODOVĚDA (4. ročník)
  // ═══════════════════════════════════════════════════════

  "přírodověda::Živá příroda": {
    buttonLabel: "Co žije kolem nás?",
    title: "Živá příroda",
    hook: "Les, rybník, louka — všude kolem nás žijí rostliny a živočichové ve vzájemných vztazích! 🌳🐿️",
    whatIsIt: "Živá příroda zahrnuje všechny organismy — rostliny, živočichy, houby i bakterie. Učíš se, jak spolu žijí v ekosystémech a kdo koho v přírodě živí.",
    whyWeUseIt: "Když pochopíš, jak příroda funguje, budeš vědět, proč je důležité chránit lesy, řeky i zvířata.",
    visualExamples: [
      { label: "Patra lesa", illustration: "🌳 Stromové patro (dub, buk, smrk)\n🌿 Keřové patro (líska, bez)\n🍀 Bylinné patro (kapradí, borůvky)\n🐛 Půdní patro (žížaly, houby)" },
      { label: "Potravní řetězec", illustration: "🌿 Tráva → 🐰 Zajíc → 🦊 Liška → 🦅 Orel\n\nKaždý článek živí další!" },
    ],
    funFact: "💡 V jednom čtverečním metru lesní půdy žije víc organismů, než je lidí na celé Zemi! 🌍🐜",
  },

  "přírodověda::Neživá příroda": {
    buttonLabel: "Z čeho je svět kolem nás?",
    title: "Neživá příroda",
    hook: "Voda, horniny, vzduch — neživá příroda tvoří základ, na kterém stojí celý život! 💧🪨",
    whatIsIt: "Neživá příroda zahrnuje vodu, vzduch, horniny, nerosty a půdu. Učíš se, jak funguje koloběh vody a z čeho se skládá zemský povrch.",
    whyWeUseIt: "Bez vody, vzduchu a půdy by na Zemi nemohl existovat žádný život. Proto je důležité chránit i neživou přírodu!",
    visualExamples: [
      { label: "Koloběh vody", illustration: "☀️ Slunce ohřívá vodu\n  ↑ vypařování\n☁️ Oblaka (pára se ochladí)\n  ↓ srážky (déšť, sníh)\n🏔️ Voda stéká do řek\n🌊 Řeky tečou do moří → znovu" },
      { label: "Skupenství vody", illustration: "🧊 Led = PEVNÉ (zmrzlá)\n💧 Voda = KAPALNÉ (teče)\n♨️ Pára = PLYNNÉ (neviditelná)" },
      { label: "Horniny vs nerosty", illustration: "🪨 Hornina = směs nerostů (žula)\n💎 Nerost = čistá látka (křemen)\n\nHornina je jako dort, nerost je ingredience!" },
    ],
    funFact: "💡 Kapka vody, kterou piješ dnes, mohla kdysi padat jako déšť na dinosaury — voda se neustále recykluje! 🦕💧",
  },

  // ═══════════════════════════════════════════════════════
  // VLASTIVĚDA (4. ročník)
  // ═══════════════════════════════════════════════════════

  "vlastivěda::Zeměpis ČR": {
    buttonLabel: "Jak vypadá naše země?",
    title: "Zeměpis ČR",
    hook: "Česká republika má 14 krajů, krásná města a rozmanitou krajinu — pojď ji objevit! 🗺️",
    whatIsIt: "Zeměpis ČR tě naučí orientovat se na mapě, znát kraje a jejich krajská města a rozumět tomu, kde co v Česku leží.",
    whyWeUseIt: "Když znáš svou zemi, víš, kam jet na výlet, kde bydlí příbuzní a jak se orientovat v mapě. To se hodí celý život!",
    visualExamples: [
      { label: "Kraje ČR", illustration: "🗺️ Západ: Karlovarský, Plzeňský\n🏙️ Střed: Praha, Středočeský\n⛰️ Sever: Ústecký, Liberecký\n🌾 Jih: Jihočeský, Vysočina\n🏭 Východ: Moravskoslezský" },
      { label: "Světové strany", illustration: "     ⬆️ SEVER\n        |\nZÁPAD ←🧭→ VÝCHOD\n        |\n     ⬇️ JIH" },
    ],
    funFact: "💡 Česká republika má přes 6000 obcí a 14 krajů — to je spousta míst k objevování! 🏘️",
  },

  "vlastivěda::Historie a kultura": {
    buttonLabel: "Co se u nás dělo?",
    title: "Historie a kultura",
    hook: "České pověsti, slavné osobnosti a státní symboly — poznej příběhy naší země! 🏰",
    whatIsIt: "V tomto okruhu se dozvíš o nejznámějších českých pověstech, historických osobnostech a státních symbolech ČR.",
    whyWeUseIt: "Znalost historie a symbolů naší země ti pomůže pochopit, odkud pocházíme a na co můžeme být hrdí.",
    visualExamples: [
      { label: "České pověsti", illustration: "⛰️ Praotec Čech → hora Říp\n👸 Kněžna Libuše → založila Prahu\n🏰 Karel IV → Karlův most, univerzita\n⚔️ Blaničtí rytíři → hora Blaník" },
      { label: "Státní symboly", illustration: "🇨🇿 Vlajka: bílá + červená + modrý klín\n🦁 Znak: dvouocasý lev\n🎵 Hymna: Kde domov můj\n🏛️ Prezident: Pražský hrad" },
    ],
    funFact: "💡 Pražský hrad je největší hradní komplex na světě — měří přes 570 metrů! 🏰",
  },

  // ═══════════════════════════════════════════════════════
  // 4. ROČNÍK — TOPIC-LEVEL OVERRIDES
  // ═══════════════════════════════════════════════════════

  // ── MATEMATIKA: Čísla do 10 000 ───────────────────────

  "matematika::Čísla a operace::Čísla do 10 000": {
    buttonLabel: "K čemu jsou čísla do 10 000?",
    title: "Čísla do 10 000",
    hook: "Tisíce, stovky, desítky, jednotky — čísla do 10 000 potkáš v cenách, vzdálenostech i sportu! 🔢",
    whatIsIt:
      "Naučíš se pracovat s čísly do deseti tisíc — porovnávat je, řadit od nejmenšího po největší a zaokrouhlovat na stovky a tisíce.",
    whyWeUseIt:
      "Velká čísla potřebuješ, když počítáš vzdálenost do jiného města, cenu většího nákupu nebo počet lidí na stadionu.",
    visualExamples: [
      {
        label: "Rozklad čísla",
        illustration: "3 527 = 3 000 + 500 + 20 + 7\n\n🟦🟦🟦 tisíce\n🟩🟩🟩🟩🟩 stovky\n🟨🟨 desítky\n🟧🟧🟧🟧🟧🟧🟧 jednotky",
      },
      {
        label: "Porovnávání",
        illustration: "4 850 vs 4 580\n→ tisíce stejné (4)\n→ stovky: 8 > 5\n→ 4 850 > 4 580 ✅\n\n💡 Porovnávej zleva — od nejvyššího řádu!",
      },
      {
        label: "Zaokrouhlování na stovky",
        illustration: "3 527 → na stovky:\ndesítky = 2 < 5 → dolů → 3 500\n\n3 572 → na stovky:\ndesítky = 7 ≥ 5 → nahoru → 3 600",
      },
    ],
    funFact: "💡 Nejvyšší hora Česka, Sněžka, měří 1 603 metrů — to je číslo do 10 000 a přesně s takovými čísly se teď naučíš pracovat! 🏔️",
  },

  // ── MATEMATIKA: Písemné sčítání a odčítání ────────────

  "matematika::Čísla a operace::Písemné sčítání a odčítání": {
    buttonLabel: "K čemu je písemné počítání?",
    title: "Písemné sčítání a odčítání",
    hook: "Když jsou čísla moc velká na hlavní počítání, pomůže ti písemný způsob — řádek pod řádkem! ✍️",
    whatIsIt:
      "Písemné sčítání a odčítání je postup, kdy si čísla zapíšeš pod sebe (jednotky pod jednotky, desítky pod desítky) a počítáš od nejnižšího řádu. Při přechodu přes desítku přenášíš jedničku.",
    whyWeUseIt:
      "Trojciferná a větší čísla se těžko sčítají zpaměti. Písemný postup ti dá jistotu, že výsledek bude správný.",
    visualExamples: [
      {
        label: "Písemné sčítání",
        illustration: "  347\n+ 285\n─────\n  632\n\n1) 7+5=12 → napíšu 2, přenesu 1\n2) 4+8+1=13 → napíšu 3, přenesu 1\n3) 3+2+1=6 → napíšu 6",
      },
      {
        label: "Písemné odčítání",
        illustration: "  523\n− 187\n─────\n  336\n\n1) 3−7 nejde → půjčím si → 13−7=6\n2) 1−8 nejde → půjčím si → 11−8=3\n3) 4−1=3",
      },
    ],
    funFact: "💡 Písemné sčítání vymysleli matematici v Indii a Arábii před více než tisíci lety — a dodnes ho používáme úplně stejně! 🧮",
  },

  // ── MATEMATIKA: Násobení a dělení (rozšíření) ─────────

  "matematika::Čísla a operace::Násobení a dělení (rozšíření)": {
    buttonLabel: "K čemu je násobení a dělení?",
    title: "Násobení a dělení (rozšíření)",
    hook: "Násobení dvojciferným číslem a dělení se zbytkem — posuň se o level výš! 🚀",
    whatIsIt:
      "Naučíš se násobit čísla dvojciferným číslem (třeba 23 × 14) a dělit se zbytkem (třeba 17 ÷ 5 = 3, zbytek 2).",
    whyWeUseIt:
      "Násobení dvojciferným číslem potřebuješ třeba při výpočtu ceny za víc kusů. Dělení se zbytkem ti řekne, kolik zbyde, když něco rozděluješ.",
    visualExamples: [
      {
        label: "Násobení dvojciferným",
        illustration: "23 × 14 = ?\n23 × 10 = 230\n23 × 4  = 92\n230 + 92 = 322 ✅\n\n💡 Rozlož druhý činitel na desítky + jednotky!",
      },
      {
        label: "Dělení se zbytkem",
        illustration: "17 ÷ 5 = ?\n5 × 3 = 15 (vejde se)\n5 × 4 = 20 (moc)\n17 − 15 = 2\n→ 17 ÷ 5 = 3 zbytek 2\n\n🍬 17 bonbónů pro 5 dětí → 3 každý, 2 zbudou",
      },
    ],
    funFact: "💡 Když rozděluješ jablka mezi kamarády a nějaké zbydou — to je přesně dělení se zbytkem v praxi! 🍎",
  },

  // ── MATEMATIKA: Úhly ──────────────────────────────────

  "matematika::Geometrie::Úhly": {
    buttonLabel: "K čemu jsou úhly?",
    title: "Úhly",
    hook: "Pravý, ostrý, tupý — úhly najdeš na každém rohu! 📐",
    whatIsIt:
      "Úhel vznikne, když se setkají dvě přímky v jednom bodě. Rozlišujeme tři základní druhy: ostrý (menší než 90°), pravý (přesně 90°) a tupý (větší než 90°).",
    whyWeUseIt:
      "Úhly potřebuješ v geometrii, při stavění, kreslení i ve sportu — třeba při odrazu míče od zdi!",
    visualExamples: [
      {
        label: "Druhy úhlů",
        illustration: "📐 Ostrý úhel: < 90°  (jako pootevřené nůžky)\n📏 Pravý úhel: = 90°  (jako roh knihy)\n📖 Tupý úhel: > 90°  (jako rozevřená kniha)\n⟲ Přímý úhel: = 180° (rovná čára)",
      },
      {
        label: "Kde je potkáš",
        illustration: "🏠 Roh pokoje → pravý úhel (90°)\n⏰ Ručičky ve 3:00 → pravý úhel\n✂️ Pootevřené nůžky → ostrý úhel\n📖 Otevřená kniha → tupý úhel",
      },
    ],
    funFact: "💡 Egyptské pyramidy mají úhly tak přesné, že i po 4 500 letech obdivujeme, jak přesně je starověcí stavitelé změřili! 📐🔺",
  },

  // ── MATEMATIKA: Osová souměrnost ──────────────────────

  "matematika::Geometrie::Osová souměrnost": {
    buttonLabel: "K čemu je souměrnost?",
    title: "Osová souměrnost",
    hook: "Motýl, sněhová vločka, tvůj obličej — příroda miluje souměrnost! 🦋",
    whatIsIt:
      "Osová souměrnost znamená, že tvar můžeš přeložit podle osy a obě poloviny se přesně překryjí. Osa souměrnosti je jako zrcadlo uprostřed.",
    whyWeUseIt:
      "Souměrnost najdeš v architektuře, přírodě, umění i designu. Pomáhá ti kreslit přesné tvary a chápat rovnováhu.",
    visualExamples: [
      {
        label: "Souměrné tvary",
        illustration: "🦋 Motýl — osa uprostřed těla\n❄️ Vločka — 6 os souměrnosti!\n⬜ Čtverec — 4 osy souměrnosti\n⭕ Kruh — nekonečně os!\n\n💡 Přelož obrázek napůl — překrývá se? → souměrný!",
      },
      {
        label: "Velká písmena",
        illustration: "Souměrná: A  H  M  O  T  U  V  W  X  Y\nNesouměrná: B  F  G  J  K  L  N  P  R  S\n\n💡 Zkus si je přeložit v duchu!",
      },
    ],
    funFact: "💡 Lidský mozek miluje souměrnost — proto nám souměrné věci přijdou krásné a harmonické! 🧠✨",
  },

  // ── ČEŠTINA: Pády podstatných jmen ────────────────────

  "čeština::Mluvnice::Pády podstatných jmen": {
    buttonLabel: "K čemu jsou pády?",
    title: "Pády podstatných jmen",
    hook: "Sedm pádů — sedm podob jednoho slova! Pes, psa, psovi, psa… 🐕",
    whatIsIt:
      "V češtině má každé podstatné jméno 7 pádů. Pád určíš pomocí pádové otázky (Kdo? Co? Koho? Čeho? atd.). Pád mění tvar slova — koncovku.",
    whyWeUseIt:
      "Správný pád potřebuješ, aby věta zněla česky. Říkáme 'vidím psa' (4. pád), ne 'vidím pes'.",
    visualExamples: [
      {
        label: "7 pádů",
        illustration: "1. Kdo? Co?     → pes\n2. Koho? Čeho?  → psa\n3. Komu? Čemu?  → psovi\n4. Koho? Co?    → psa\n5. Oslovení!    → pse!\n6. O kom? O čem? → o psovi\n7. Kým? Čím?    → psem",
      },
      {
        label: "Jak pád poznat",
        illustration: "Vidím velkého _____.\nKoho? Co? → 4. pád\n\nDám to _____.\nKomu? Čemu? → 3. pád\n\n💡 Dosaď pádovou otázku!",
      },
    ],
    funFact: "💡 Čeština má 7 pádů, finština jich má 15 a maďarština dokonce 18 — představ si to skloňování! 🤯",
  },

  // ── ČEŠTINA: Vzory podstatných jmen ───────────────────

  "čeština::Mluvnice::Vzory podstatných jmen": {
    buttonLabel: "K čemu jsou vzory?",
    title: "Vzory podstatných jmen",
    hook: "Pán, hrad, muž, stroj — vzory ti poradí, jakou koncovku napsat! 📖",
    whatIsIt:
      "Vzory jsou modelová slova, podle kterých skloňuješ ostatní podstatná jména. Každý rod má své vzory: mužský (pán, hrad, muž, stroj, předseda, soudce), ženský (žena, růže, píseň, kost), střední (město, moře, kuře, stavení).",
    whyWeUseIt:
      "Vzor ti řekne, jakou koncovku má slovo v kterém pádě. Bez vzorů bys musel/a hádat!",
    visualExamples: [
      {
        label: "Mužský rod",
        illustration: "🔵 Životné: pán, muž, předseda, soudce\n🔵 Neživotné: hrad, stroj\n\n'učitel' → jako PÁN (učitele, učiteli...)\n'les' → jako HRAD (lesa, lesu...)",
      },
      {
        label: "Ženský rod",
        illustration: "🔴 žena → škola, ulice\n🔴 růže → kůže, duše\n🔴 píseň → daň, báseň\n🔴 kost → pomoc, moc",
      },
      {
        label: "Střední rod",
        illustration: "🟢 město → jablko, okno\n🟢 moře → srdce, pole\n🟢 kuře → kotě, zvíře\n🟢 stavení — nádraží, náměstí",
      },
    ],
    funFact: "💡 Vzory v češtině fungují jako klíče — stačí najít správný vzor a odemkneš správnou koncovku pro všech 7 pádů! 🔑",
  },

  // ── ČEŠTINA: Stavba slova ─────────────────────────────

  "čeština::Mluvnice::Stavba slova": {
    buttonLabel: "Z čeho se skládají slova?",
    title: "Stavba slova",
    hook: "Každé slovo je jako stavebnice — má kořen, předponu a příponu! 🧱",
    whatIsIt:
      "Stavba slova znamená rozebrat slovo na části: kořen (základní význam), předpona (před kořenem, mění význam) a přípona (za kořenem, tvoří nové slovo).",
    whyWeUseIt:
      "Když umíš rozebrat slovo, lépe pochopíš jeho význam, snáze najdeš příbuzná slova a správně píšeš pravopis na hranici předpony a kořene.",
    visualExamples: [
      {
        label: "Části slova",
        illustration: "  pře-krásn-ý\n  ┃    ┃    ┃\n předpona kořen přípona\n\n🟡 Kořen = -krásn- (základ významu)\n🟢 Předpona = pře- (mění/zesiluje)\n🔵 Přípona = -ý (tvoří přídavné jméno)",
      },
      {
        label: "Rodina slov",
        illustration: "Kořen: -les-\n🌲 les, lesní, lesník, prales, zalesněný\n\nKořen: -vod-\n💧 voda, vodní, podvodní, vodovod, vodník",
      },
    ],
    funFact: "💡 Z jednoho kořene slova můžeš vytvořit desítky příbuzných slov — čeština je jako ohromná slovní stavebnice! 🧩",
  },

  // ── ČEŠTINA: Koncovky podstatných jmen ────────────────

  "čeština::Pravopis::Koncovky podstatných jmen": {
    buttonLabel: "K čemu jsou koncovky?",
    title: "Koncovky podstatných jmen",
    hook: "Správná koncovka = správný vzor + správný pád! 🎯",
    whatIsIt:
      "Koncovka je poslední část slova, která se mění podle pádu a čísla. Správnou koncovku zjistíš tak, že určíš rod, najdeš vzor a podíváš se na tvar ve správném pádě.",
    whyWeUseIt:
      "Koncovky rozhodují, jestli píšeš 'na stromě' nebo 'na stromu', 'o městech' nebo 'o městě'. Bez správné koncovky by tvůj text zněl špatně.",
    visualExamples: [
      {
        label: "Postup",
        illustration: "1. Urči rod: 'les' → TEN les → mužský\n2. Najdi vzor: neživotný → HRAD\n3. Určení pádu: 'v lese' → 6. pád\n4. Vzor hrad v 6. pádě → -ě/-u\n→ v lese ✅",
      },
      {
        label: "Časté chyby",
        illustration: "❌ 'na stromě' → na stromU ✅ (vzor hrad)\n❌ 'o městě' → o městĚ ✅ (vzor město)\n\n💡 Vždy si řekni vzorové slovo v tom pádě!",
      },
    ],
    funFact: "💡 Čeština má tak bohaté koncovky, že mnohdy nepotřebuje předložky ani slovosled — význam je schovaný přímo v koncovce! 🇨🇿",
  },

  // ── PŘÍRODOVĚDA: Ekosystémy ───────────────────────────

  "přírodověda::Živá příroda::Ekosystémy": {
    buttonLabel: "Co je ekosystém?",
    title: "Ekosystémy",
    hook: "Les, rybník, louka — každé místo v přírodě je svět plný vztahů! 🌳🐸",
    whatIsIt:
      "Ekosystém je společenství rostlin, živočichů a neživé přírody (voda, půda, slunce) na jednom místě. Každý organismus má svou roli — někdo vyrábí potravu, někdo ji spotřebovává.",
    whyWeUseIt:
      "Když pochopíš ekosystém, budeš vědět, proč nesmíme ničit lesy, znečisťovat rybníky ani hubit zvířata — vše spolu souvisí!",
    visualExamples: [
      {
        label: "Lesní ekosystém",
        illustration: "🌳 Stromy: dub, buk, smrk (vyrábí kyslík)\n🐿️ Veverka: živí se žaludy\n🦊 Liška: loví menší zvířata\n🍄 Houby: rozkládají odumřelé listy\n🐛 Hmyz: opyluje květy\n\n💡 Všichni se navzájem potřebují!",
      },
      {
        label: "Vodní ekosystém",
        illustration: "🌿 Vodní rostliny: rákos, leknín\n🐸 Žába: živí se hmyzem\n🐟 Ryby: kapr, štika\n🦆 Kachna: hnízdí u vody\n💧 Čistá voda = zdravý rybník",
      },
    ],
    funFact: "💡 V jedné kapce rybníkové vody žijí tisíce mikroskopických organismů — celý malý svět, který nevidíš pouhým okem! 🔬💧",
  },

  // ── PŘÍRODOVĚDA: Potravní řetězce ─────────────────────

  "přírodověda::Živá příroda::Potravní řetězce": {
    buttonLabel: "Kdo koho živí?",
    title: "Potravní řetězce",
    hook: "Tráva → zajíc → liška → orel — v přírodě je každý něčí jídlo! 🌿🐰🦊",
    whatIsIt:
      "Potravní řetězec ukazuje, kdo koho v přírodě živí. Začíná vždy rostlinou (producent), pokračuje býložravcem a končí šelmou na vrcholu.",
    whyWeUseIt:
      "Když zmizí jeden článek řetězce, ovlivní to všechny ostatní — proto je důležité chránit každý druh v přírodě.",
    visualExamples: [
      {
        label: "Potravní řetězec",
        illustration: "☀️ Slunce → 🌿 Tráva (producent)\n  → 🐛 Housenka (býložravec)\n  → 🐦 Sýkora (hmyzožravec)\n  → 🦅 Jestřáb (šelma na vrcholu)\n\nKaždý článek závisí na předchozím!",
      },
      {
        label: "Co když zmizí článek?",
        illustration: "Zmizí hmyz?\n🌿 Tráva ← nikdo ji nejí → přeroste\n🐦 Ptáci ← nemají potravu → ubývají\n🦅 Dravci ← nemají kořist → hladoví\n\n💡 Všechno spolu souvisí!",
      },
    ],
    funFact: "💡 Žraloci jsou na vrcholu oceánského potravního řetězce už více než 400 milionů let — jsou starší než dinosauři! 🦈",
  },

  // ── PŘÍRODOVĚDA: Voda a její skupenství ───────────────

  "přírodověda::Neživá příroda::Voda a její skupenství": {
    buttonLabel: "Jak se mění voda?",
    title: "Voda a její skupenství",
    hook: "Led, voda, pára — jedna látka, tři podoby! 🧊💧♨️",
    whatIsIt:
      "Voda se vyskytuje ve třech skupenstvích: pevné (led), kapalné (voda) a plynné (vodní pára). Koloběh vody je neustálý — voda se vypařuje, tvoří oblaka, padá jako déšť a teče zpět.",
    whyWeUseIt:
      "Voda je základ života — bez ní by neexistovaly rostliny, zvířata ani lidé. Proto je důležité ji chránit a neplýtvat.",
    visualExamples: [
      {
        label: "Skupenství vody",
        illustration: "🧊 PEVNÉ: led, sníh, námraza (pod 0 °C)\n💧 KAPALNÉ: voda, déšť, rosa (0–100 °C)\n♨️ PLYNNÉ: vodní pára (nad 100 °C)\n\n💡 Tání: led → voda\n💡 Var: voda → pára\n💡 Mrznutí: voda → led",
      },
      {
        label: "Koloběh vody",
        illustration: "☀️ Slunce ohřívá oceány a jezera\n  ⬆️ Voda se vypařuje\n☁️ Pára stoupá, ochlazuje se → oblaka\n  ⬇️ Déšť nebo sníh padá\n🏔️ Voda stéká do potoků a řek\n🌊 Řeky tečou do moří → a znovu!",
      },
    ],
    funFact: "💡 Na Zemi je stále stejné množství vody jako před miliony let — kapka, kterou dnes piješ, mohla padat jako déšť na dinosaury! 🦕💧",
  },

  // ── PŘÍRODOVĚDA: Horniny a nerosty ────────────────────

  "přírodověda::Neživá příroda::Horniny a nerosty": {
    buttonLabel: "Z čeho je Země?",
    title: "Horniny a nerosty",
    hook: "Žula, vápenec, křemen — pod nohama máš miliardy let historie! 🪨",
    whatIsIt:
      "Horniny jsou směsi nerostů, ze kterých se skládá zemský povrch. Nerosty jsou čisté přírodní látky s konkrétními vlastnostmi. Rozlišujeme horniny vyvřelé, usazené a přeměněné.",
    whyWeUseIt:
      "Z hornin a nerostů se staví domy, dělají šperky, vyrábí sklo a cement. Znalost hornin pomáhá geologům najít cenné suroviny.",
    visualExamples: [
      {
        label: "Hornina vs nerost",
        illustration: "🪨 Hornina = směs nerostů (jako dort z ingrediencí)\n💎 Nerost = čistá látka (jako jedna ingredience)\n\nŽula = křemen + živec + slída\nVápenec = hlavně kalcit",
      },
      {
        label: "Druhy hornin",
        illustration: "🌋 Vyvřelé: žula, čedič (z magmatu)\n🏖️ Usazené: vápenec, pískovec (z usazenin)\n🔥 Přeměněné: mramor, břidlice (tlakem a teplem)",
      },
    ],
    funFact: "💡 Diamant je nejtvrdší přírodní nerost na Zemi a vzniká z uhlíku hluboko pod zemí při obrovském tlaku a teplotě! 💎",
  },

  // ── VLASTIVĚDA: Kraje České republiky ─────────────────

  "vlastivěda::Zeměpis ČR::Kraje České republiky": {
    buttonLabel: "Kolik krajů máme?",
    title: "Kraje České republiky",
    hook: "14 krajů, 14 krajských měst — poznáš je všechny? 🗺️",
    whatIsIt:
      "Česká republika se dělí na 14 krajů. Každý kraj má své krajské město, které je jeho středem. Kraje se liší přírodou, průmyslem i památkami.",
    whyWeUseIt:
      "Znalost krajů ti pomůže orientovat se na mapě, plánovat výlety a vědět, kde co v Česku najdeš.",
    visualExamples: [
      {
        label: "Kraje a krajská města",
        illustration: "🏛️ Praha → hlavní město\n🏙️ Středočeský → (sídlo v Praze)\n🏭 Ústecký → Ústí nad Labem\n⛰️ Liberecký → Liberec\n🏔️ Královéhradecký → Hradec Králové\n🏛️ Pardubický → Pardubice\n🌾 Vysočina → Jihlava",
      },
      {
        label: "Další kraje",
        illustration: "🏙️ Jihomoravský → Brno\n🏭 Moravskoslezský → Ostrava\n🏛️ Olomoucký → Olomouc\n🌾 Zlínský → Zlín\n🏙️ Jihočeský → České Budějovice\n🏛️ Plzeňský → Plzeň\n♨️ Karlovarský → Karlovy Vary",
      },
    ],
    funFact: "💡 Nejmenší kraj je Praha — je to zároveň kraj i město. Největší rozlohou je Středočeský kraj, ale nemá vlastní krajské město! 🏛️",
  },

  // ── VLASTIVĚDA: Orientace na mapě ─────────────────────

  "vlastivěda::Zeměpis ČR::Orientace na mapě": {
    buttonLabel: "Jak číst mapu?",
    title: "Orientace na mapě",
    hook: "Sever nahoře, jih dole, legenda po straně — mapa je okno do světa! 🧭",
    whatIsIt:
      "Orientace na mapě znamená umět určit světové strany, přečíst legendu (vysvětlivky značek) a odhadnout vzdálenost pomocí měřítka.",
    whyWeUseIt:
      "Mapu potřebuješ na výletě, při plánování cesty i při zeměpisu. Kdo umí číst mapu, ten se nikdy neztratí!",
    visualExamples: [
      {
        label: "Světové strany na mapě",
        illustration: "     ⬆️ SEVER (nahoře)\n        |\nZÁPAD ←🧭→ VÝCHOD\n        |\n     ⬇️ JIH (dole)\n\n💡 Na mapě je SEVER vždy nahoře!",
      },
      {
        label: "Legenda a měřítko",
        illustration: "🟦 Modrá → voda (řeky, jezera)\n🟢 Zelená → lesy, nížiny\n🟤 Hnědá → hory, kopce\n⬛ Černá → silnice, železnice\n\n📏 Měřítko: 1 cm na mapě = 1 km ve skutečnosti",
      },
    ],
    funFact: "💡 Nejstarší známá mapa světa je babylónská hliněná destička stará přes 2 600 let — a Země je na ní kulatá jako talíř! 🗺️",
  },

  // ── VLASTIVĚDA: České pověsti a osobnosti ─────────────

  "vlastivěda::Historie a kultura::České pověsti a osobnosti": {
    buttonLabel: "Jaké máme pověsti?",
    title: "České pověsti a osobnosti",
    hook: "Praotec Čech, kněžna Libuše, Karel IV — příběhy, které formovaly naši zemi! 🏰",
    whatIsIt:
      "České pověsti jsou staré příběhy o vzniku českého národa a důležitých místech. Osobnosti jako Karel IV nebo Jan Amos Komenský změnily naši historii.",
    whyWeUseIt:
      "Pověsti a osobnosti ti pomohou pochopit, odkud pocházíme, co je pro naši zemi důležité a na co můžeme být hrdí.",
    visualExamples: [
      {
        label: "Slavné pověsti",
        illustration: "⛰️ Praotec Čech → přivedl svůj lid na horu Říp\n👸 Kněžna Libuše → předpověděla slávu Prahy\n⚔️ Blaničtí rytíři → spí v hoře Blaník\n🐉 Bruncvík → přinesl dvouocasého lva\n👩‍🌾 Bivoj → přinesl divokého kance",
      },
      {
        label: "Historické osobnosti",
        illustration: "👑 Karel IV - Otec vlasti, Karlův most, univerzita\n📖 Jan Amos Komenský - Učitel národů\n🎵 Bedřich Smetana - Má vlast, Prodaná nevěsta\n🎵 Antonín Dvořák - Novosvětská symfonie",
      },
    ],
    funFact: "💡 Karel IV nechal postavit Karlův most v roce 1357 — a most stojí dodnes, už přes 660 let! 🌉🏛️",
  },

  // ── VLASTIVĚDA: Státní symboly ČR ────────────────────

  "vlastivěda::Historie a kultura::Státní symboly ČR": {
    buttonLabel: "Jaké máme symboly?",
    title: "Státní symboly ČR",
    hook: "Vlajka, znak, hymna — symboly, které reprezentují naši zemi po celém světě! 🇨🇿",
    whatIsIt:
      "Státní symboly jsou znaky, kterými se Česká republika představuje. Patří mezi ně vlajka, státní znak (velký a malý), hymna, prezidentská standarta a státní pečeť.",
    whyWeUseIt:
      "Státní symboly uvidíš na úřadech, při sportu, na mezinárodních akcích i při svátcích. Každý občan by je měl znát!",
    visualExamples: [
      {
        label: "Hlavní symboly",
        illustration: "🇨🇿 Vlajka: bílý + červený pruh, modrý klín vlevo\n🦁 Velký státní znak: čtyři pole - český lev, moravská orlice, slezská orlice\n🎵 Hymna: Kde domov můj (1. sloka české hymny)\n🏛️ Prezidentská standarta: visí na Pražském hradě",
      },
      {
        label: "Kde je uvidíš",
        illustration: "🏛️ Na budovách úřadů\n⚽ Při sportovních zápasech\n🎉 Na státní svátky (28. říjen, 1. leden)\n📬 Na úředních dokumentech\n🌍 V zahraničí — na ambasádách",
      },
    ],
    funFact: "💡 Český dvouocasý lev je jedním z nejstarších státních symbolů na světě — používá se od 13. století! 🦁👑",
  },
};

/**
 * Lookup category info by subject + category name, optionally with topic for topic-level override.
 */
export function getCategoryInfo(subject: string, category: string, topic?: string): CategoryInfo | null {
  if (topic) {
    const topicInfo = CATEGORY_INFO[`${subject}::${category}::${topic}`];
    if (topicInfo) return topicInfo;
  }
  return CATEGORY_INFO[`${subject}::${category}`] ?? null;
}
