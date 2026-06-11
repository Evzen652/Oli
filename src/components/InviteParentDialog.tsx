import { useState, useEffect, useRef } from "react";
import { Loader2, Mail, MessageCircle } from "lucide-react";

interface Props {
  onClose: () => void;
  childName?: string;
  /** Pro anonymní dítě — předá se grade z localStorage. */
  anonGrade?: number;
  /** Pro přihlášené dítě — vazba na auth user. */
  childId?: string;
}

type Tab = "whatsapp" | "email";

/** Normalizuje české tel. číslo na E.164 (bez +) pro wa.me */
function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("420") && digits.length === 12) return digits;
  if (digits.startsWith("0") && digits.length === 10) return "420" + digits.slice(1);
  if (digits.length === 9) return "420" + digits;
  return null;
}

function buildWhatsAppUrl(phone: string, childName?: string, grade?: number): string {
  const name = childName ? childName : "moje dítě";
  const gradeText = grade ? ` (${grade}. třída)` : "";
  const text = `Ahoj! Procvičuji na Oli${gradeText} a chci, abys viděl/a můj pokrok. Podívej se na: https://oli-edu.com`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

/**
 * Dialog "Pozvat rodiče" — dítě iniciuje sdílení pokroku.
 *
 * Dva způsoby:
 *  1. WhatsApp — zadá telefonní číslo, otevře se WhatsApp s předvyplněnou zprávou
 *  2. Email — uloží pozvánku do DB (email integrace připravena)
 */
export function InviteParentDialog({ onClose, childName, anonGrade, childId }: Props) {
  const [tab, setTab] = useState<Tab>("whatsapp");

  // WhatsApp state
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Email state
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Abort in-flight fetch on unmount → zabraňuje setState na unmounted komponentu
  const abortRef = useRef<AbortController | null>(null);

  // Focus management — uloží focus před otevřením, vrátí ho po zavření
  const dialogRef = useRef<HTMLDivElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    prevFocusRef.current = document.activeElement as HTMLElement;
    const first = dialogRef.current?.querySelector<HTMLElement>(
      'button, input, [tabindex]:not([tabindex="-1"])',
    );
    first?.focus();
    return () => {
      abortRef.current?.abort();
      prevFocusRef.current?.focus();
    };
  }, []);

  // ── WhatsApp ──────────────────────────────────────────────────────────────
  const handleWhatsApp = () => {
    const normalized = normalizePhone(phone);
    if (!normalized) {
      setPhoneError("Zadej platné číslo (např. 777 123 456)");
      return;
    }
    const url = buildWhatsAppUrl(normalized, childName, anonGrade);
    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
  };

  // ── Email ─────────────────────────────────────────────────────────────────
  const handleEmail = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Zadej platný email");
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setEmailLoading(true);
    setEmailError(null);

    try {
      const SUPABASE_URL = "https://uusaczibimqvaazpaopy.supabase.co";
      const SUPABASE_ANON_KEY = "sb_publishable_33yUDPztgleFHYtChSvGKQ_rMlyktGV";
      const res = await fetch(`${SUPABASE_URL}/functions/v1/send-parent-invite`, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "apikey": SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          childName: childName ?? null,
          anonGrade: anonGrade ?? null,
          childId: childId ?? null,
        }),
      });
      if (controller.signal.aborted) return;
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.error) throw new Error(data.error ?? res.statusText);
      setEmailSent(true);
    } catch (e: unknown) {
      if (controller.signal.aborted) return;
      setEmailError(`Nepodařilo se odeslat: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      if (!controller.signal.aborted) setEmailLoading(false);
    }
  };

  // ── Potvrzovací obrazovka (email) ─────────────────────────────────────────
  if (emailSent) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
          <div className="text-5xl">✉️</div>
          <h3 className="text-lg font-bold text-gray-900">Skoro hotovo!</h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            Řekni rodičům, ať se zaregistrují na <strong>oli-edu.com</strong> pomocí emailu{" "}
            <strong>{email}</strong>.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-violet-600 text-white rounded-xl py-3 font-semibold hover:bg-violet-700 transition-colors"
          >
            Hotovo
          </button>
        </div>
      </div>
    );
  }

  // ── Hlavní dialog ─────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div ref={dialogRef} className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-5 shadow-2xl">

        {/* Hlavička */}
        <div className="text-center">
          <div className="text-4xl mb-2">👪</div>
          <h3 className="text-lg font-bold text-gray-900">
            Pošli rodičům odkaz, ať vidí, jak jsi šikovný!
          </h3>
        </div>

        {/* Záložky */}
        <div className="flex rounded-xl bg-gray-100 p-1 gap-1">
          <button
            onClick={() => setTab("whatsapp")}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold transition-all ${
              tab === "whatsapp"
                ? "bg-white shadow text-green-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </button>
          <button
            onClick={() => setTab("email")}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold transition-all ${
              tab === "email"
                ? "bg-white shadow text-violet-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Mail className="h-4 w-4" />
            Email
          </button>
        </div>

        {/* WhatsApp panel */}
        {tab === "whatsapp" && (
          <div className="space-y-3">
            <div>
              <label htmlFor="parent-phone" className="text-sm text-gray-600 font-medium">
                Telefonní číslo rodiče
              </label>
              <input
                id="parent-phone"
                type="tel"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setPhoneError(null); }}
                placeholder="777 123 456"
                autoComplete="off"
                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3
                           text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              {phoneError && <p className="text-xs text-red-600 mt-1.5">{phoneError}</p>}
            </div>
            <button
              onClick={handleWhatsApp}
              disabled={!phone}
              className="w-full bg-green-500 text-white rounded-xl py-3 font-semibold
                         hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed
                         transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Otevřít WhatsApp →
            </button>
            <p className="text-xs text-gray-400 text-center">
              Otevře se WhatsApp s předvyplněnou zprávou — jen ji pošleš.
            </p>
          </div>
        )}

        {/* Email panel */}
        {tab === "email" && (
          <div className="space-y-3">
            <div>
              <label htmlFor="parent-email" className="text-sm text-gray-600 font-medium">
                Email rodiče
              </label>
              <input
                id="parent-email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(null); }}
                placeholder="maminka@email.cz"
                autoComplete="off"
                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3
                           text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
              {emailError && <p className="text-xs text-red-600 mt-1.5">{emailError}</p>}
            </div>
            <button
              onClick={handleEmail}
              disabled={!email || emailLoading}
              className="w-full bg-violet-600 text-white rounded-xl py-3 font-semibold
                         hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed
                         transition-colors flex items-center justify-center gap-2"
            >
              {emailLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Ukládám…</>
              ) : (
                <>Uložit email →</>
              )}
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full text-gray-400 text-sm hover:text-gray-600 py-1 transition-colors"
        >
          Teď ne
        </button>
      </div>
    </div>
  );
}
