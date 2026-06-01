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
  { question: "Jak se nazývá chyba v programu?", correctAnswer: "Bug", options: ["Bug", "Virus", "Spam", "Skript"], hints: ["Bug = anglicky chyba/brouk — programátoři tomu říkají bug."] },
  { question: "Co je ladění (debugging) programu?", correctAnswer: "Hledání a opravování chyb v programu", options: ["Hledání a opravování chyb v programu", "Spuštění programu poprvé", "Přidávání nových funkcí", "Mazání starého kódu"], hints: ["Debug = de-bug = zbavit se chyb."] },
  { question: "Program místo výsledku 10 zobrazí 5. O jaký typ chyby se pravděpodobně jedná?", correctAnswer: "Logická chyba — program běží, ale výsledek je špatný", options: ["Logická chyba — program běží, ale výsledek je špatný", "Syntaktická chyba — program se nespustí", "Runtime chyba — program spadne", "Žádná chyba — 5 je správně"], hints: ["Program běží, ale výsledek nesouhlasí = logická chyba."] },
  { question: "Co je syntaktická chyba v programu?", correctAnswer: "Chyba v zápisu příkazu — program se vůbec nespustí", options: ["Chyba v zápisu příkazu — program se vůbec nespustí", "Program běží, ale výsledek je špatný", "Program se zhroutí za běhu", "Chyba v načítání souboru"], hints: ["Syntax = pravidla zápisu. Syntaktická chyba = špatný zápis."] },
  { question: "Jak nejlépe najdu chybu v programu?", correctAnswer: "Postupně testuji jednotlivé části a hledám, kde se výsledek liší od očekávání", options: ["Postupně testuji jednotlivé části a hledám, kde se výsledek liší od očekávání", "Smažu celý program a napíšu ho znovu", "Ignoruji chybu a doufám, že zmizí", "Přidám nové bloky ke konci"], hints: ["Ladění = systematické testování po částech."] },
  { question: "Program se při spuštění okamžitě zastaví s chybou. O jaký typ chyby se jedná?", correctAnswer: "Runtime chyba — program spadne za běhu", options: ["Runtime chyba — program spadne za běhu", "Logická chyba", "Syntaktická chyba", "Chyba síťového připojení"], hints: ["Runtime = za běhu programu."] },
  { question: "Proč je důležité program testovat?", correctAnswer: "Abychom odhalili chyby a zajistili, že program dělá to, co má", options: ["Abychom odhalili chyby a zajistili, že program dělá to, co má", "Aby program byl rychlejší", "Testování není potřeba", "Abychom přidali nové funkce"], hints: ["Test = ověřím, že program funguje správně."] },
  { question: "Cyklus 'opakuj navždy' nikdy neskončí. Jak se tato chyba nazývá?", correctAnswer: "Nekonečná smyčka", options: ["Nekonečná smyčka", "Runtime chyba", "Logická chyba", "Syntaktická chyba"], hints: ["Smyčka, která nikdy neskončí = nekonečná smyčka."] },
  { question: "Co je krokování (stepping) při ladění?", correctAnswer: "Provádění programu krok po kroku, aby bylo vidět, kde se stane chyba", options: ["Provádění programu krok po kroku, aby bylo vidět, kde se stane chyba", "Rychlé spuštění celého programu", "Mazání bloků programu jeden po druhém", "Přidávání nových příkazů"], hints: ["Krok po kroku = postupné sledování chování programu."] },
  { question: "Jak se pozná logická chyba?", correctAnswer: "Program běží bez pádu, ale výsledek není správný", options: ["Program běží bez pádu, ale výsledek není správný", "Program se nespustí vůbec", "Program padá hned po spuštění", "Program nevytvoří žádný výstup"], hints: ["Logická chyba = špatná logika, program ale funguje."] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Program má vypočítat 3 + 4, ale zobrazí 34. Co je pravděpodobně špatně?", correctAnswer: "Logická chyba — čísla se spojila jako text místo sčítání", options: ["Logická chyba — čísla se spojila jako text místo sčítání", "Syntaktická chyba", "Runtime chyba", "Program je správně — 34 je správný výsledek"], hints: ["3 + 4 = 7, ale 34 vznikne, pokud se čísla spojí jako písmena."] },
  { question: "Proč je hledání chyb v kódu obtížnější, pokud nemám žádné komentáře?", correctAnswer: "Bez komentářů nevím, co má každá část dělat — těžko hledám, kde je chyba", options: ["Bez komentářů nevím, co má každá část dělat — těžko hledám, kde je chyba", "Komentáře způsobují chyby", "Komentáře program zpomalují", "Komentáře jsou jen pro začátečníky"], hints: ["Komentář = vysvětlení kódu. Pomáhá při ladění."] },
  { question: "Co by měl programátor udělat hned po opravení chyby?", correctAnswer: "Znovu otestovat program, aby se ujistil, že oprava funguje a nezpůsobila novou chybu", options: ["Znovu otestovat program, aby se ujistil, že oprava funguje a nezpůsobila novou chybu", "Okamžitě přidat nové funkce", "Smazat testovací data", "Sdílet program bez testování"], hints: ["Oprava jedné chyby může způsobit jinou — vždy testuj znovu."] },
  { question: "Jak se nazývá technika ladění, kdy přidám do kódu výpis hodnot proměnných?", correctAnswer: "Print debugging – výpis hodnot pro sledování", options: ["Print debugging – výpis hodnot pro sledování", "Krokování", "Syntaktická analýza", "Runtime testování"], hints: ["Výpis hodnoty proměnné = 'print' nebo 'vypiš' — sleduju, co se děje."] },
  { question: "Program se má zastavit po 5 krocích, ale nikdy neskončí. Co je pravděpodobně špatně?", correctAnswer: "Podmínka pro ukončení cyklu je špatně nastavena — vznikla nekonečná smyčka", options: ["Podmínka pro ukončení cyklu je špatně nastavena — vznikla nekonečná smyčka", "Program má syntaktickou chybu", "Program je správně", "Runtime chyba způsobila pád"], hints: ["Nekonečný cyklus vznikne, když podmínka ukončení nikdy nenastane."] },
  { question: "Seřaď kroky ladění: A) identifikuj chybu, B) oprav chybu, C) otestuj program, D) reprodukuj chybu.", correctAnswer: "D → A → B → C", options: ["D → A → B → C", "A → B → C → D", "C → D → A → B", "B → A → D → C"], items: ["D) reprodukuj chybu", "A) identifikuj chybu", "B) oprav chybu", "C) otestuj program"], hints: ["Nejprve musím vidět chybu, pak ji najít, opravit a ověřit."] },
  { question: "Co je testovací případ (test case)?", correctAnswer: "Konkrétní vstup a očekávaný výstup pro ověření, zda program funguje správně", options: ["Konkrétní vstup a očekávaný výstup pro ověření, zda program funguje správně", "Nový blok kódu přidaný do programu", "Typ chyby v programu", "Komentář v kódu"], hints: ["Test case = zadám vstup a porovnám výstup s očekáváním."] },
  { question: "Proč je logická chyba obtížnější najít než syntaktická?", correctAnswer: "Syntaktická chyba je vidět hned – program se nespustí , logická se projeví jen špatným výsledkem", options: ["Syntaktická chyba je vidět hned – program se nespustí , logická se projeví jen špatným výsledkem", "Logická chyba způsobí pád programu", "Syntaktická chyba je vždy skrytá", "Obě jsou stejně obtížné"], hints: ["Co se stane při každém typu chyby?"] },
  { question: "Program má vypisovat čísla 1 až 5, ale vypíše jen 1 až 4. Co je pravděpodobně špatně?", correctAnswer: "Podmínka cyklu je nastavena na 'menší než 5' místo 'menší nebo rovno 5'", options: ["Podmínka cyklu je nastavena na 'menší než 5' místo 'menší nebo rovno 5'", "Program má syntaktickou chybu", "Cyklus se opakuje příliš mnohokrát", "Program vypisuje v jiném pořadí"], hints: ["< 5 skončí při 4; <= 5 skončí při 5."] },
  { question: "Co je ladění (debugging) ve Scratchi?", correctAnswer: "Klikání na jednotlivé bloky a sledování výsledku, aby se odhalila chyba", options: ["Klikání na jednotlivé bloky a sledování výsledku, aby se odhalila chyba", "Mazání bloků programu", "Přidání zvuku do programu", "Změna pozadí scény"], hints: ["Ve Scratchi lze spustit jeden blok kliknutím a vidět výsledek."] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Program sčítá: nastav výsledek na 0; opakuj 5×: přidej 3 k výsledku. Jaký je výsledek? A program má chybu v podmínce — místo 5 krát to dělá 4krát. Jaký je pak výsledek?", correctAnswer: "Správně: 15; s chybou: 12", options: ["Správně: 15; s chybou: 12", "Správně: 15; s chybou: 9", "Správně: 20; s chybou: 16", "Správně: 15; s chybou: 15"], hints: ["5 × 3 = 15; 4 × 3 = 12."] },
  { question: "Jaký typ chyby způsobí, že program se nespustí vůbec?", correctAnswer: "Syntaktická chyba — špatný zápis příkazu", options: ["Syntaktická chyba — špatný zápis příkazu", "Logická chyba", "Runtime chyba", "Chyba připojení"], hints: ["Syntax error = program nelze ani spustit."] },
  { question: "Program porovnává: 'pokud a = 5 pak vypiš Správně'. Místo '=' použili '==' a program nevypíše nic. O jaký druh chyby jde?", correctAnswer: "Syntaktická nebo logická chyba — záleží na jazyce; ve většině jazyků = je přiřazení, == je porovnání", options: ["Syntaktická nebo logická chyba — záleží na jazyce; ve většině jazyků = je přiřazení, == je porovnání", "Runtime chyba", "Žádná chyba", "Chyba paměti"], hints: ["= přiřadí hodnotu; == porovná hodnoty — v programování je to rozdíl."] },
  { question: "Jak zjistím, v které části kódu je chyba, pokud mám program složený ze 3 podprogramů?", correctAnswer: "Testuji každý podprogram zvlášť a hledám, který vrací špatný výsledek", options: ["Testuji každý podprogram zvlášť a hledám, který vrací špatný výsledek", "Smažu celý program", "Přidám více bloků", "Testuju pouze první podprogram"], hints: ["Rozděl a panuj — testuj části zvlášť."] },
  { question: "Co je runtime chyba a kdy nastane?", correctAnswer: "Chyba za běhu programu — nastane, když program narazí na neočekávanou situaci – např. dělení nulou", options: ["Chyba za běhu programu — nastane, když program narazí na neočekávanou situaci – např. dělení nulou", "Chyba při psaní kódu", "Chyba v logice výpočtu", "Chyba připojení k internetu"], hints: ["Runtime = za běhu; program se spustí, ale pak spadne."] },
  { question: "Program má tři části: A funguje správně, B vrací špatnou hodnotu, C závisí na výsledku B. Kde opravím chybu?", correctAnswer: "V části B — tam vzniká chyba, C ji jen přebírá", options: ["V části B — tam vzniká chyba, C ji jen přebírá", "V části C", "V části A", "Ve všech třech najednou"], hints: ["Chyba vzniká v B — C ji jen zdědí."] },
  { question: "Jaký je rozdíl mezi opravou bugu a přidáním nové funkce?", correctAnswer: "Oprava bugu = program dělá to, co má; nová funkce = program dostane novou schopnost", options: ["Oprava bugu = program dělá to, co má; nová funkce = program dostane novou schopnost", "Jsou totéž", "Nová funkce opraví bug automaticky", "Bug se opraví přidáním nové funkce"], hints: ["Bug fix = opravuji; feature = přidávám nové."] },
  { question: "Program má počítat průměr ze 4 čísel. Výsledek je příliš velký. Jaká je pravděpodobná chyba?", correctAnswer: "Součet se dělí méně než 4 – např. dělí se 2 nebo 3 místo 4", options: ["Součet se dělí méně než 4 – např. dělí se 2 nebo 3 místo 4", "Součet je špatně", "Čísla se nenačetla", "Program je správně"], hints: ["Příliš velký průměr = dělí se menším číslem, než by mělo."] },
  { question: "Proč je důležité testovat program s různými vstupy, nejen jedním?", correctAnswer: "Chyba se může projevit jen pro určité hodnoty, ne pro všechny", options: ["Chyba se může projevit jen pro určité hodnoty, ne pro všechny", "Jedno testování vždy stačí", "Více testování zpomaluje program", "Různé vstupy nejsou potřeba"], hints: ["Okrajové hodnoty (0, záporná čísla) mohou odhalit skryté chyby."] },
  { question: "Co je to 'reprodukovat chybu' při ladění?", correctAnswer: "Záměrně způsobit, aby se chyba znovu projevila, aby šlo zjistit příčinu", options: ["Záměrně způsobit, aby se chyba znovu projevila, aby šlo zjistit příčinu", "Smazat chybový kód", "Spustit program potřetí", "Přidat do programu nový blok"], hints: ["Reprodukovat = znovu zopakovat chybu za kontrolovaných podmínek."] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const HLEDANICHYBVPROGRAMULADENI: TopicMetadata[] = [
  {
    id: "g5-informatika-algoritmizace-a-programovani-programovani-v-blokovem-prostredi-hledani-chyb-v-programu-ladeni",
    rvpNodeId: "g5-informatika-algoritmizace-a-programovani-programovani-v-blokovem-prostredi-hledani-chyb-v-programu-ladeni",
    title: "Hledání chyb v programu (ladění)",
    studentTitle: "Hledání chyb (debug)",
    subject: "informatika",
    category: "Algoritmizace a programování",
    topic: "Programování v blokovém prostředí",
    briefDescription: "Naučíš se najít a opravit chybu v programu.",
    keywords: ["bug", "chyba", "ladění", "debugging", "logická chyba", "syntaktická chyba", "runtime"],
    goals: [
      "Rozlišuje typy chyb: logická, syntaktická, runtime.",
      "Používá systematický přístup k hledání chyb.",
      "Testuje program s různými vstupy.",
    ],
    boundaries: ["Pokročilé debugovací nástroje", "Chyby v síťové komunikaci", "Bezpečnostní chyby"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Bug = chyba. Ladění = hledání a oprava chyb. Typy: syntaktická (program se nespustí), logická (špatný výsledek), runtime (pád za běhu).",
      steps: [
        "Spusť program a sleduj, co se stane.",
        "Porovnej výsledek s tím, co má program dělat.",
        "Najdi část kódu, kde vzniká problém.",
        "Oprav chybu a znovu otestuj.",
      ],
      commonMistake: "Opravím chybu, ale zapomenu program znovu otestovat — oprava může způsobit novou chybu.",
      example: "Program má vypisovat 1 až 5, ale vypíše jen 1 až 4 → podmínka cyklu je '< 5' místo '<= 5'. Oprava: změnim podmínku.",
    },
  },
];
