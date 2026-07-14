// Zapamatování dítěte na tomto zařízení pro rychlý re-login přes PIN.
// Ukládáme jen lehký identifikátor (žádné tajemství) — samotné přihlášení
// vyžaduje PIN ověřený serverem (edge funkce child-relogin).
//
// Záměrně se NEMAŽE při odhlášení — právě proto, aby se dítě mohlo vrátit
// jen zadáním PINu. Maže se jen explicitním „Nejsem to já" (forgetChild).

const KEY = "oli_remembered_child";

export interface RememberedChild {
  childUserId: string;
  childName: string;
  grade: number;
}

export function getRememberedChild(): RememberedChild | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<RememberedChild>;
    if (
      typeof parsed.childUserId === "string" &&
      typeof parsed.childName === "string" &&
      typeof parsed.grade === "number"
    ) {
      return parsed as RememberedChild;
    }
    return null;
  } catch {
    return null;
  }
}

export function rememberChild(child: RememberedChild): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(child));
  } catch {
    // localStorage nedostupné (privátní režim apod.) — re-login pak přes kód.
  }
}

export function forgetChild(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* no-op */
  }
}
