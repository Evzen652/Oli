import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface QA { q: string; a: string; opts: string[]; e: string }

const POOL_L1: QA[] = [
  { q: "Kolik přísudků má věta 'Petr hraje a zpívá'?", a: "2 — je to souvětí", opts: ["2 — je to souvětí", "1 — věta jednoduchá", "3", "0"], e: "Přísudek je sloveso, které říká, co někdo dělá. Tady máme slovesa 'hraje' a 'zpívá', to jsou dva přísudky, a proto je z toho souvětí. Kdyby tu bylo jen jedno sloveso, šlo by o větu jednoduchou." },
  { q: "Urči druh věty: 'Šli jsme domů.'", a: "věta jednoduchá", opts: ["věta jednoduchá", "souvětí", "souvětí se dvěma větami", "nelze určit"], e: "Najdeme jen jedno sloveso 'šli jsme', tedy jeden přísudek. Jeden přísudek znamená věta jednoduchá. Pro souvětí bychom potřebovali alespoň dvě slovesa." },
  { q: "Urči druh: 'Pršelo a děti nemohly ven.'", a: "souvětí", opts: ["souvětí", "věta jednoduchá", "věta s přívlastkem", "věta rozvinutá"], e: "Ve větě jsou dvě slovesa — 'pršelo' a 'nemohly' — spojená spojkou 'a'. Dva přísudky znamenají souvětí. Věta jednoduchá by měla jen jeden přísudek." },
  { q: "Kolik vět tvoří souvětí 'Přišel jsem domů, dal jsem si svačinu a šel jsem spát.'?", a: "3 věty", opts: ["3 věty", "1 věta", "2 věty", "4 věty"], e: "Počet vět v souvětí poznáme podle počtu přísudků (sloves). Tady jsou tři: 'přišel jsem', 'dal jsem si' a 'šel jsem'. Proto jsou to tři věty." },
  { q: "Věta jednoduchá má:", a: "jeden přísudek", opts: ["jeden přísudek", "dva přísudky", "žádný přísudek", "tři přísudky"], e: "Věta jednoduchá má vždy právě jeden přísudek, tedy jedno sloveso jako základ. Jakmile přibude druhý přísudek, vznikne souvětí." },
  { q: "Souvětí má:", a: "dva nebo více přísudků", opts: ["dva nebo více přísudků", "jeden přísudek", "žádný přísudek", "vždy tři přísudky"], e: "Souvětí vznikne spojením dvou nebo více vět, a každá věta má svůj přísudek. Proto má souvětí dva a více přísudků. Není pravda, že jich musí být vždy přesně tři." },
  { q: "Urči druh: 'Kočka spí.'", a: "věta jednoduchá", opts: ["věta jednoduchá", "souvětí", "nelze určit", "věta rozvitá"], e: "Je tu jen jedno sloveso 'spí', tedy jeden přísudek. Jeden přísudek znamená věta jednoduchá. Pro souvětí by chyběl druhý přísudek." },
  { q: "Urči druh: 'Slunce svítí, ale je chladno.'", a: "souvětí", opts: ["souvětí", "věta jednoduchá", "věta s přívlastkem", "věta rozšířená"], e: "Slovesa 'svítí' a 'je' jsou dva přísudky spojené spojkou 'ale'. Dva přísudky tvoří souvětí. Věta jednoduchá by měla jen jedno sloveso." },
  { q: "Kolik přísudků má věta 'Sedím a čtu'?", a: "2", opts: ["2", "1", "3", "0"], e: "Přísudek je sloveso. Tady jsou dvě slovesa — 'sedím' a 'čtu' — spojená spojkou 'a', takže jsou to dva přísudky. Proto je to vlastně souvětí." },
  { q: "Urči druh: 'Babička peče koláč a dědeček čte noviny.'", a: "souvětí", opts: ["souvětí", "věta jednoduchá", "věta s předmětem", "věta přísudková"], e: "Najdeme dvě slovesa — 'peče' a 'čte' — spojená spojkou 'a'. Dva přísudky znamenají souvětí. Slova 'koláč' a 'noviny' jsou předměty, ne přísudky." },
  { q: "Jak se nazývají jednotlivé části souvětí?", a: "věty (věta hlavní, věta vedlejší)", opts: ["věty (věta hlavní, věta vedlejší)", "odstavce", "části", "úseky"], e: "Souvětí se skládá z vět — bývá v něm věta hlavní a věta vedlejší. Odstavce jsou větší celky textu a slova 'části' nebo 'úseky' nejsou mluvnické názvy." },
  { q: "Urči druh: 'Bratr hraje počítač.'", a: "věta jednoduchá", opts: ["věta jednoduchá", "souvětí", "věta s předmětem", "věta vedlejší"], e: "Je tu jen jedno sloveso 'hraje', tedy jeden přísudek, a to je věta jednoduchá. Slovo 'počítač' je předmět, ale druhé sloveso ve větě není, proto nejde o souvětí." },
  { q: "Urči druh: 'Nevím, kde jsou moje klíče.'", a: "souvětí", opts: ["souvětí", "věta jednoduchá", "věta tázací", "věta s příslovcem"], e: "Ve větě jsou dvě slovesa — 'nevím' a 'jsou' — oddělená čárkou, takže jde o souvětí. I když se ptáme nepřímo, počet přísudků rozhoduje o tom, že je to souvětí, ne věta jednoduchá." },
  { q: "Kolik přísudků má věta 'Ptáci zpívají.'?", a: "1", opts: ["1", "2", "3", "0"], e: "Najdeme jediné sloveso 'zpívají', a to je jeden přísudek. Jeden přísudek znamená věta jednoduchá. Slovo 'ptáci' je podmět, ne přísudek." },
  { q: "Urči druh: 'Šel do obchodu, protože neměl chléb.'", a: "souvětí", opts: ["souvětí", "věta jednoduchá", "věta dvojdílná", "věta s předmětem"], e: "Slovesa 'šel' a 'neměl' jsou dva přísudky spojené spojkou 'protože'. Dva přísudky tvoří souvětí. Věta jednoduchá by měla jen jedno sloveso." },
  { q: "Co spojuje věty v souvětí?", a: "spojky (a, ale, nebo, protože, když, že...)", opts: ["spojky (a, ale, nebo, protože, když, že...)", "přídavná jména", "příslovce", "předložky"], e: "Věty v souvětí spojují spojky jako 'a', 'ale', 'protože' nebo 'že'. Předložky (na, v, do) spojují slova, ne věty, a přídavná jména ani příslovce věty nespojují." },
];

const POOL_L2: QA[] = [
  { q: "Urči druh věty: 'Jdu do školy, protože mám hodiny.'", a: "souvětí podřadné", opts: ["souvětí podřadné", "souvětí souřadné", "věta jednoduchá", "věta přísudková"], e: "Spojka 'protože' připojuje větu vedlejší, která vysvětluje důvod — to je souvětí podřadné. U souvětí souřadného by věty byly rovnocenné (spojka a, ale, nebo)." },
  { q: "Věta 'Šli jsme na výlet a bylo krásně.' — jaký druh souvětí?", a: "souvětí souřadné (spojka a)", opts: ["souvětí souřadné (spojka a)", "souvětí podřadné", "věta jednoduchá", "věta složená"], e: "Obě věty jsou rovnocenné a spojuje je slučovací spojka 'a' — to je souvětí souřadné. U podřadného souvětí by jedna věta závisela na druhé (např. spojkou protože, že)." },
  { q: "Urči větu vedlejší v souvětí: 'Věřím, že uspěješ.'", a: "že uspěješ", opts: ["že uspěješ", "Věřím", "uspěješ", "Věřím, že"], e: "Věta vedlejší závisí na hlavní a začíná spojkou — tady 'že uspěješ'. Část 'Věřím' je věta hlavní, která může stát samostatně." },
  { q: "Urči větu hlavní v souvětí: 'Když pršelo, zůstali jsme doma.'", a: "zůstali jsme doma", opts: ["zůstali jsme doma", "Když pršelo", "pršelo", "Když pršelo, zůstali jsme"], e: "Věta hlavní dává smysl i sama o sobě — 'zůstali jsme doma'. Část 'když pršelo' začíná spojkou a sama nestojí, je to věta vedlejší." },
  { q: "Jaká spojka vyjadřuje příčinu (proto, protože)?", a: "protože, poněvadž", opts: ["protože, poněvadž", "ale, avšak", "a, i, ani", "nebo, anebo"], e: "Příčinu (proč se něco děje) vyjadřují spojky 'protože' a 'poněvadž'. Spojka 'ale' vyjadřuje protiklad, 'a, i' slučování a 'nebo' volbu mezi možnostmi." },
  { q: "Urči druh věty: 'Nevím, kam jít.'", a: "souvětí", opts: ["souvětí", "věta jednoduchá", "věta s infinitivem", "věta rozvitá"], e: "Jsou tu dvě slovesa — 'nevím' a 'jít' — oddělená čárkou, takže jde o souvětí. I když je druhé sloveso v neurčitku, tvoří samostatnou větu, proto to není věta jednoduchá." },
  { q: "Spojka 'ale' vyjadřuje:", a: "protiklad (odporovací)", opts: ["protiklad (odporovací)", "příčinu", "časový vztah", "účel"], e: "Spojka 'ale' staví dvě věci proti sobě, proto se jí říká odporovací. Příčinu vyjadřuje 'protože', čas 'když' a účel 'aby'." },
  { q: "Urči větu vedlejší: 'Čtu knihu, která je velmi zajímavá.'", a: "která je velmi zajímavá", opts: ["která je velmi zajímavá", "Čtu knihu", "Čtu", "knihu, která"], e: "Věta vedlejší začíná vztažným slovem 'která' a blíže určuje knihu — 'která je velmi zajímavá'. Část 'čtu knihu' je věta hlavní a může stát sama." },
  { q: "Urči druh souvětí: 'Pospíchám, aby mě nečekali.'", a: "souvětí podřadné (aby = účel)", opts: ["souvětí podřadné (aby = účel)", "souvětí souřadné", "věta jednoduchá", "souvětí odporovací"], e: "Spojka 'aby' připojuje větu vedlejší, která říká účel (proč pospíchám) — to je souvětí podřadné. U souřadného souvětí by byly věty rovnocenné." },
  { q: "Kolik vět je v souvětí: 'Věděl jsem, že přijdete, protože jste slíbili.'?", a: "3 věty", opts: ["3 věty", "2 věty", "1 věta", "4 věty"], e: "Počet vět určíme podle sloves: 'věděl jsem', 'přijdete' a 'jste slíbili' — to jsou tři přísudky, tedy tři věty." },
  { q: "Věta 'Přišel jsem, uviděl jsem, zvítězil jsem.' — kolik vět?", a: "3 věty", opts: ["3 věty", "2 věty", "1 věta", "4 věty"], e: "Spočítáme slovesa: 'přišel jsem', 'uviděl jsem' a 'zvítězil jsem' — tři přísudky znamenají tři věty v souvětí." },
  { q: "Urči větu hlavní: 'Ačkoliv bylo pozdě, šel jsem na procházku.'", a: "šel jsem na procházku", opts: ["šel jsem na procházku", "Ačkoliv bylo pozdě", "bylo pozdě", "ačkoliv šel"], e: "Věta hlavní dává smysl samostatně — 'šel jsem na procházku'. Část 'ačkoliv bylo pozdě' začíná spojkou a sama nestojí, je to věta vedlejší." },
  { q: "Jaká spojka vyjadřuje časový vztah?", a: "když, jakmile, zatímco", opts: ["když, jakmile, zatímco", "ale, avšak, jenže", "protože, poněvadž", "aby, ať"], e: "Čas (kdy se něco děje) vyjadřují spojky 'když', 'jakmile' a 'zatímco'. Spojka 'ale' vyjadřuje protiklad, 'protože' příčinu a 'aby' účel." },
  { q: "Urči druh: 'Nevím, jestli to zvládnu.'", a: "souvětí podřadné", opts: ["souvětí podřadné", "souvětí souřadné", "věta jednoduchá", "věta tázací"], e: "Spojka 'jestli' připojuje větu vedlejší závislou na hlavní 'nevím' — to je souvětí podřadné. U souřadného souvětí by věty byly rovnocenné a oddělené spojkou jako a, ale." },
  { q: "Čárka v souvětí odděluje:", a: "věty od sebe", opts: ["věty od sebe", "podmět od přísudku", "přívlastky", "předmět od přísudku"], e: "V souvětí čárka odděluje jednotlivé věty od sebe, abychom poznali, kde jedna končí a druhá začíná. Podmět od přísudku se čárkou neodděluje." },
  { q: "Urči větu vedlejší: 'Řekl mi, kde to je.'", a: "kde to je", opts: ["kde to je", "Řekl mi", "Řekl", "mi, kde to je"], e: "Věta vedlejší začíná spojovacím slovem 'kde' a závisí na hlavní — 'kde to je'. Část 'řekl mi' je věta hlavní a stojí samostatně." },
];

const POOL_L3: QA[] = [
  { q: "Věta vedlejší podmětná: která z vět je podmětná?", a: "Kdo chodí pozdě, spí do poledne. (podmět = kdo chodí pozdě)", opts: ["Kdo chodí pozdě, spí do poledne. (podmět = kdo chodí pozdě)", "Vím, že přijdeš.", "Šel domů, protože byl unavený.", "Jdu, abych se naučil."], e: "Věta vedlejší podmětná zastupuje podmět hlavní věty — ptáme se na ni 'kdo, co?'. Tady 'kdo chodí pozdě' odpovídá na otázku 'kdo spí do poledne'. Ostatní věty zastupují předmět nebo vyjadřují příčinu či účel." },
  { q: "Urči druh věty vedlejší: 'Věřím, že to dokážeš.'", a: "předmětná", opts: ["předmětná", "podmětná", "příslovečná časová", "přívlastková"], e: "Ptáme se 'věřím čemu?' — 'že to dokážeš'. Otázka pádem (komu, čemu) ukazuje, že jde o větu předmětnou. Na podmětnou bychom se ptali 'kdo, co'." },
  { q: "Urči druh věty vedlejší: 'Kniha, kterou jsem četl, byla zajímavá.'", a: "přívlastková", opts: ["přívlastková", "předmětná", "podmětná", "příslovečná"], e: "Věta 'kterou jsem četl' blíže určuje podstatné jméno 'kniha' a ptáme se na ni 'která kniha?'. To je věta přívlastková. Přívlastkové věty často začínají slovem 'který'." },
  { q: "Urči druh věty vedlejší: 'Šel jsem domů, když začalo pršet.'", a: "příslovečná časová", opts: ["příslovečná časová", "příslovečná příčinná", "přívlastková", "předmětná"], e: "Ptáme se 'kdy jsem šel domů?' — 'když začalo pršet'. Otázka 'kdy' znamená větu příslovečnou časovou. Kdyby vyjadřovala důvod, byla by příčinná." },
  { q: "Urči druh věty vedlejší: 'Nešel jsem ven, protože byl déšť.'", a: "příslovečná příčinná", opts: ["příslovečná příčinná", "příslovečná časová", "podmětná", "předmětná"], e: "Ptáme se 'proč jsem nešel ven?' — 'protože byl déšť'. Otázka 'proč' a spojka 'protože' ukazují větu příslovečnou příčinnou. Na časovou bychom se ptali 'kdy'." },
  { q: "Co je vzorec souvětí 'Petr hraje a Jana čte.'?", a: "V + V (souřadné)", opts: ["V + V (souřadné)", "V ← VV (podřadné)", "V → VV", "VV + V"], e: "Obě věty jsou rovnocenné a spojené spojkou 'a', proto je vzorec V + V (dvě věty vedle sebe). Šipka by znamenala, že jedna věta závisí na druhé, to je souvětí podřadné." },
  { q: "Souvětí 'Nevím, jestli přijdeš.' — jaký typ?", a: "podřadné (věta vedlejší předmětná)", opts: ["podřadné (věta vedlejší předmětná)", "souřadné", "věta jednoduchá", "podřadné podmětné"], e: "Věta 'jestli přijdeš' závisí na hlavní 'nevím' a odpovídá na 'nevím co?', proto je předmětná a souvětí je podřadné. Na podmětnou větu bychom se ptali 'kdo, co' jako na podmět." },
  { q: "Urči druh věty vedlejší: 'Trénoval, aby vyhrál.'", a: "příslovečná účelová", opts: ["příslovečná účelová", "příslovečná příčinná", "předmětná", "přívlastková"], e: "Ptáme se 'za jakým účelem trénoval?' — 'aby vyhrál'. Spojka 'aby' a otázka po účelu znamenají větu příslovečnou účelovou. Příčinná by odpovídala na 'proč' spojkou 'protože'." },
  { q: "Kolik vět je v souvětí: 'Víme, kde bydlíš, protože ti píšeme.'?", a: "3 věty", opts: ["3 věty", "2 věty", "4 věty", "1 věta"], e: "Spočítáme slovesa: 'víme', 'bydlíš' a 'píšeme' — tři přísudky znamenají tři věty v souvětí." },
  { q: "Věta vedlejší přívlastková uvozena slovem 'který'— příklad:", a: "Četl jsem knihu, která se mi líbila.", opts: ["Četl jsem knihu, která se mi líbila.", "Věřím, že uspěješ.", "Přišel, protože chtěl pomoci.", "Spím, abych byl odpočatý."], e: "Přívlastková věta blíže určuje podstatné jméno a začíná slovem 'který' — 'kniha, která se mi líbila'. Ostatní věty začínají spojkami 'že', 'protože', 'abych' a vyjadřují předmět, příčinu nebo účel." },
  { q: "Urči druh věty vedlejší: 'Nevím, jak to udělat.'", a: "předmětná", opts: ["předmětná", "podmětná", "příslovečná způsobová", "přívlastková"], e: "Ptáme se 'nevím co?' — 'jak to udělat'. Otázka pádem ukazuje větu předmětnou. Přestože je tam slovo 'jak', věta doplňuje sloveso 'nevím' jako předmět." },
  { q: "Souvětí souřadné slučovací používá spojky:", a: "a, i, ani, také", opts: ["a, i, ani, také", "ale, avšak, jenže", "nebo, anebo", "protože, poněvadž"], e: "Slučovací poměr spojuje věty, které k sobě patří a sčítají se — spojky 'a, i, ani, také'. Spojky 'ale, avšak' vyjadřují protiklad, 'nebo' volbu a 'protože' příčinu." },
  { q: "Urči druh věty vedlejší: 'Ačkoliv byl unavený, dál pracoval.'", a: "příslovečná přípustková", opts: ["příslovečná přípustková", "příslovečná příčinná", "příslovečná časová", "podmínková"], e: "Spojka 'ačkoliv' naznačuje, že se něco děje i přes překážku — 'ačkoliv byl unavený, přesto pracoval'. To je věta přípustková. Příčinná by spojkou 'protože' vysvětlovala důvod." },
  { q: "Urči druh věty vedlejší: 'Kdybys přišel, byl bych rád.'", a: "příslovečná podmínková", opts: ["příslovečná podmínková", "příslovečná přípustková", "předmětná", "časová"], e: "Spojka 'kdyby' vyjadřuje podmínku — 'pokud bys přišel'. To je věta příslovečná podmínková. Přípustková by spojkou 'ačkoliv' připouštěla překážku." },
  { q: "Věta vedlejší podmětná uvozena 'kdo': příklad:", a: "Kdo nezkoumá, neobjeví.", opts: ["Kdo nezkoumá, neobjeví.", "Přišel, kdo chtěl.", "Myslím, kdo přijde.", "Řekl mi, kdo to byl."], e: "Podmětná věta zastupuje podmět hlavní věty — ptáme se 'kdo neobjeví?' a odpovídáme 'kdo nezkoumá'. V ostatních příkladech věta s 'kdo' doplňuje jiné sloveso jako předmět, ne jako podmět." },
  { q: "Vzorec podřadného souvětí 'Vím, že přijdete.' ukazuje:", a: "věta hlavní + věta vedlejší", opts: ["věta hlavní + věta vedlejší", "věta vedlejší + věta hlavní", "dvě věty hlavní", "dvě věty vedlejší"], e: "Na začátku stojí věta hlavní 'vím', za ní následuje věta vedlejší 'že přijdete'. V podřadném souvětí je vždy jedna věta hlavní a alespoň jedna vedlejší, která na ní závisí." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "Věta jednoduchá = 1 přísudek (1 sloveso jako základ)",
      "Souvětí = 2 a více přísudků (slovese spojených spojkami)",
      "Věta hlavní může stát sama, vedlejší závisí na hlavní",
    ],
    explanation: e,
  }));
}

export const VETAJEDNODUCHAASOUVETIVZORECSOUVETI: TopicMetadata[] = [
  {
    id: "g4-cjl-jazykova-vychova-skladba-veta-jednoducha-a-souveti-vzorec-souveti",
    rvpNodeId: "g4-cjl-jazykova-vychova-skladba-veta-jednoducha-a-souveti-vzorec-souveti",
    title: "Věta jednoduchá a souvětí, vzorec souvětí",
    studentTitle: "Věta a souvětí",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Jazyková výchova",
    briefDescription: "Poznáš rozdíl mezi větou jednoduchou a souvětím a pochopíš jejich vzorec.",
    keywords: ["věta jednoduchá", "souvětí", "přísudek", "spojka", "věta hlavní", "věta vedlejší"],
    goals: [
      "Rozlišit větu jednoduchou a souvětí",
      "Určit počet vět v souvětí",
      "Pochopit roli spojek v souvětí",
    ],
    boundaries: ["Bez složitých druhů vedlejších vět pro úroveň 1", "Bez souvětí s více než 3 větami"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Věta jednoduchá = 1 přísudek; souvětí = 2+ přísudků spojených spojkami",
      steps: [
        "Spočítej slovesa (přísudky) ve větě.",
        "1 sloveso → věta jednoduchá",
        "2+ slovesa → souvětí",
        "Věty v souvětí jsou odděleny čárkou nebo spojkou.",
      ],
      commonMistake: "Záměna rozvité věty jednoduché a souvětí — přídavné jméno nebo příslovce nejsou přísudek",
      example: "'Petr hraje a zpívá.' = souvětí (hraje, zpívá = 2 přísudky); 'Unavený Petr spí.' = věta jednoduchá",
    },
  },
];
