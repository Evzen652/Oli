/**
 * Únik řešení v nápovědě u strukturovaných úloh.
 *
 * `scripts/check-hint-leak.ts` porovnává nápovědu s `correctAnswer`. U typů
 * `match_pairs`, `categorize`, `drag_order` a `timeline` je ale `correctAnswer`
 * jen technický marker („match" / „categorize" / „order") — skutečné řešení leží
 * v `pairs` / `categories` / `items` / `timelineEvents`. Ta kontrola je na ně
 * **konstrukčně slepá** a tudy prošel únik v 5. ročníku: 696 z 1 000 úloh
 * v 17 tématech (nalezeno 2026-09-13).
 *
 * Tenhle modul drží měřítka jako **čisté funkce**, aby šly ověřit na vymyšleném
 * vstupu, ne jen spuštěním nad obsahem. Kontrola, která se neověří, je dekorace;
 * a „0 nálezů" nad živým obsahem sama o sobě nedokazuje vůbec nic — `check:hints`
 * hlásil vždy „0 nápověd" i pod vypsanými nálezy, protože se nezvyšovalo počítadlo.
 *
 * ## Společná myšlenka všech tří měřítek: **jedna kotva ano, dvě ne**
 *
 * Nápověda smí jednu položku rozebrat jako příklad („Začni tím, že Praha je
 * hlavní město Česka") — dítěti to ukáže způsob uvažování a zbytek nechá na něm.
 * Jakmile rozebere dvě, zbytek jde u malých sad dopočítat vylučováním, takže
 * úlohu lze vyřešit bez porozumění. Práh je proto všude **> 1**.
 *
 * Naopak **jmenovat položky zadání únik není**. Třídění zvířat ve 3. ročníku
 * úmyslně vypisuje znak ke každému zvířeti a rozhodnutí (znak → skupina) nechává
 * dítěti. První verze téhle kontroly to nerozlišila a nahlásila 1 241 falešných
 * nálezů. Proto se měří **vazba** (co k čemu patří, co je po čem), ne výskyt.
 *
 * ## Co se tu záměrně neměří
 *
 * **`blanks` (fill_blank).** V celém obsahu je 200 takových úloh a jejich
 * `blanks` jsou jednotlivá písmena — předložky `"s"` / `"z"`. Nápověda musí smět
 * říct „předložka s se pojí se 7. pádem", takže měřítko nad jedním písmenem by
 * buď nikdy nespadlo, nebo hlásilo šum. Až vzniknou doplňovačky s celými slovy,
 * patří sem měřítko přidat — ne dřív.
 */

/** Sjednotí mezery a uvozovky; diakritiku nechává být (je nositelem významu). */
export function norm(s: string): string {
  return s.toLowerCase().replace(/[„“"']/g, " ").replace(/\s+/g, " ").trim();
}

/** Kratší řetězce než tohle se neporovnávají — náhodný výskyt by převážil. */
const MIN_DELKA = 3;

/**
 * Hrubý kmen slova — bez něj měřítka v češtině skoro nic nechytí.
 *
 * Nápověda skoro nikdy neuvede položku v prvním pádě: skupina se jmenuje
 * „Savci", ale věta zní „Kočka patří mezi **savce**". Doslovné porovnání tam
 * shodu nenajde, takže by prošel i únik napsaný úplně přímo. Stejnou úvahou
 * pracuje i `scripts/check-hint-leak.ts`, který slova zkracuje na pět znaků.
 *
 * Useknutí je schválně mírné (dvě písmena u delších slov, jedno u pětipísmenných):
 * čeština ohýbá hlavně koncovku, a čím kratší kmen, tím větší riziko náhodné
 * shody. Krátká slova se nekrátí vůbec.
 */
function kmen(slovo: string): string {
  if (slovo.length >= 6) return slovo.slice(0, slovo.length - 2);
  if (slovo.length === 5) return slovo.slice(0, 4);
  return slovo;
}

/** Kmeny všech slov fráze, prázdná pole u příliš krátkých. */
function kmeny(fraze: string): string[] {
  return norm(fraze)
    .split(/[^\p{L}\p{N}]+/u)
    .filter((w) => w.length >= MIN_DELKA)
    .map(kmen);
}

/**
 * Nejdelší přípona, kterou čeština na kmen nalepí. Nad tím už nejde o ohnuté
 * slovo, ale o jiné slovo — a na tom měřítko uklouzlo: kmen „slun" (ze „Slunce")
 * našel „Sluneční soustavy" a udělal z toho zmínku o Slunci, takže nápověda
 * vypadala, že prozrazuje pořadí, které neprozrazovala.
 */
const MAX_KONCOVKA = 3;

/** Rozpad textu na slova — porovnává se po slovech, ne podřetězcem. */
function slova(text: string): { slovo: string; pozice: number }[] {
  const out: { slovo: string; pozice: number }[] = [];
  for (const m of norm(text).matchAll(/[\p{L}\p{N}]+/gu)) {
    out.push({ slovo: m[0], pozice: m.index ?? 0 });
  }
  return out;
}

/** Je tohle slovo ohnutý tvar toho kmene? */
function sedíNaKmen(slovo: string, k: string): boolean {
  return slovo.startsWith(k) && slovo.length <= k.length + MAX_KONCOVKA;
}

/**
 * Kde v textu fráze začíná, nebo −1.
 *
 * Fráze se považuje za zmíněnou, když se v textu vyskytnou kmeny **všech** jejích
 * slov („hlavní město" najde i „hlavního města"). Pozice = nejranější z nich,
 * tedy místo, kde zmínka začíná — na tom stojí měření pořadí.
 *
 * Porovnává se **po celých slovech** a s omezenou koncovkou, jinak kmen jednoho
 * slova najde jiné, delší slovo se stejným začátkem.
 */
export function pozicePrvniZminky(text: string, fraze: string): number {
  const ks = kmeny(fraze);
  if (ks.length === 0) return -1;
  const ws = slova(text);
  let nejdriv = Number.MAX_SAFE_INTEGER;
  for (const k of ks) {
    const nalez = ws.find((w) => sedíNaKmen(w.slovo, k));
    if (!nalez) return -1;
    if (nalez.pozice < nejdriv) nejdriv = nalez.pozice;
  }
  return nejdriv;
}

/** Obsahuje text zmínku o frázi (se skloňováním)? */
export function zminuje(text: string, fraze: string): boolean {
  return pozicePrvniZminky(text, fraze) >= 0;
}

/**
 * Dvojice, které velká nápověda spojila v jedné větě.
 *
 * **Měří se vazba, ne výskyt.** První verze počítala jmenované pravé strany
 * a hned na tom uklouzla: nápověda „U zbylých dvou rozhoduje, co se sází do
 * země: ztluštělá hlíza s očky, nebo cibulka složená z vrstev" jmenuje obě
 * pravé strany, ale ani jednu nepřiřadí — rozhodnutí (brambor → hlíza) nechává
 * dítěti, a to je přesně cíl úlohy. Naopak „Líska dává oříšky, jabloň jablka"
 * je hotové řešení dvou dvojic ze čtyř.
 *
 * Proto společný výskyt levé i pravé strany v jedné větě. Tím měřítko sedne na
 * stejnou myšlenku jako `prirazeniVeVete` u třídění.
 *
 * ⚠️ **Opis nechytí.** „Rostliny v lesním stínu mají velké listy" přiřadí
 * dvojici „Velké tenké listy → Zachytí světlo ve stínu", aniž by pravou stranu
 * vyslovilo. Na tohle je pořád potřeba kritik; měřítko chytá doslovné úniky.
 */
export function dvojiceVeVete(
  velkaNapoveda: string,
  pairs: { left: string; right: string }[],
): string[] {
  const vety = norm(velkaNapoveda).split(/[.!?]/).filter(Boolean);
  if (vety.length === 0) return [];

  const nalezene: string[] = [];
  for (const dvojice of pairs) {
    if (norm(dvojice.left).length < MIN_DELKA) continue;
    if (norm(dvojice.right).length < MIN_DELKA) continue;
    if (vety.some((v) => zminuje(v, dvojice.left) && zminuje(v, dvojice.right))) {
      nalezene.push(`${dvojice.left} → ${dvojice.right}`);
    }
  }
  return nalezene;
}

/**
 * Nejdelší skupina prvků, kterou nápověda jmenuje **ve správném pořadí**.
 *
 * U `drag_order` a `timeline` jsou názvy položek dítěti vidět (přetahuje je),
 * takže únik není jejich výskyt, ale **pořadí**. Měří se nejdelší rostoucí
 * podposloupnost pozic zmínek: když nápověda jmenuje tři položky v tom pořadí,
 * v jakém mají být, dala dítěti dva ze zbývajících rozhodovacích kroků.
 *
 * Dvě položky v pořadí jsou kotva („co se muselo stát dřív?"), a taky přesně to,
 * kam dnes dosahuje obsah 5. ročníku. Práh je proto až na třech.
 */
export function nejdelsiBehVPoradi(napoveda: string, poradi: string[]): string[] {
  const h = norm(napoveda);
  if (!h) return [];

  const zminene = poradi
    .map((prvek) => ({ prvek, pozice: pozicePrvniZminky(h, prvek) }))
    .filter((x) => x.pozice >= 0 && norm(x.prvek).length >= MIN_DELKA);
  if (zminene.length === 0) return [];

  // Nejdelší rostoucí podposloupnost podle pozice zmínky. Pole řešení je krátké
  // (jednotky prvků), takže kvadratický průchod stačí a čte se líp než binární.
  const delka = zminene.map(() => 1);
  const predchozi = zminene.map(() => -1);
  let nejlepsi = 0;
  for (let i = 0; i < zminene.length; i++) {
    for (let j = 0; j < i; j++) {
      if (zminene[j].pozice < zminene[i].pozice && delka[j] + 1 > delka[i]) {
        delka[i] = delka[j] + 1;
        predchozi[i] = j;
      }
    }
    if (delka[i] > delka[nejlepsi]) nejlepsi = i;
  }

  const vysledek: string[] = [];
  for (let i = nejlepsi; i >= 0; i = predchozi[i]) vysledek.unshift(zminene[i].prvek);
  return vysledek;
}

/**
 * Přiřazení „položka → skupina", která nápověda vyslovila v jedné větě.
 *
 * Názvy skupin bývají v zadání (jsou to cílové přihrádky), takže je nelze
 * vyloučit jako u dvojic — únikem není jejich výskyt, ale **spojení** položky se
 * skupinou. Proto se hledá společný výskyt v jedné větě: „Vlaštovka patří mezi
 * ptáky" je přiřazení, kdežto „U každé položky se ptej, podle jakého znaku do
 * skupiny patří" ani „Ptáci mají peří" přiřazení není.
 */
export function prirazeniVeVete(
  napoveda: string,
  categories: { name: string; items: string[] }[],
): string[] {
  const vsechny = norm(napoveda).split(/[.!?]/).filter(Boolean);
  if (vsechny.length === 0) return [];

  // Věta, která jmenuje VŠECHNY skupiny, je definiční výčet — obecné pravidlo,
  // ne přiřazení. „archeologie = hmotné nálezy, paleografie = čtení starého
  // písma, numismatika = mince, heraldika = erby" vysvětluje, co která věda
  // zkoumá; že se položka „Starý rukopis ke čtení" trefí do slov definice, je
  // důsledek toho, že definice je správná — ne únik. Kdyby taková věta počítala,
  // měřítko by trestalo přesně ty nápovědy, které dělají svou práci.
  const vety = categories.length >= 3
    ? vsechny.filter((v) => !categories.every((c) => zminuje(v, c.name)))
    : vsechny;
  if (vety.length === 0) return [];

  const nalezena: string[] = [];
  for (const skupina of categories) {
    if (norm(skupina.name).length < MIN_DELKA) continue;
    for (const polozka of skupina.items) {
      if (norm(polozka).length < MIN_DELKA) continue;
      if (vety.some((v) => zminuje(v, polozka) && zminuje(v, skupina.name))) {
        nalezena.push(`${polozka} → ${skupina.name}`);
      }
    }
  }
  return nalezena;
}

/** Práh společný všem třem měřítkům: jedna kotva se toleruje, dvě už ne. */
export const PRAH_KOTVY = 1;
