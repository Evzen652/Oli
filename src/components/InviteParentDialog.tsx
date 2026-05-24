import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mail } from "lucide-react";

interface Props {
  onClose: () => void;
  childName?: string;
  /** Pro anonymní dítě — předá se grade z localStorage. */
  anonGrade?: number;
  /** Pro přihlášené dítě — vazba na auth user. */
  childId?: string;
}

/**
 * Dialog "Pozvat rodiče" — dítě iniciuje sdílení pokroku.
 *
 * Princip: dítě má kontrolu. Rodič se nedostane bez pozvánky.
 * Pro anonymního uživatele se uloží pozvánka s anon_grade.
 * Pro přihlášeného se uloží s child_id.
 */
export function InviteParentDialog({ onClose, childName, anonGrade, childId }: Props) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Zadej platný email");
      return;
    }
    setLoading(true);
    setError(null);

    // TODO(email): zatím jen uložíme pozvánku do DB. Email integrace
    // (Resend/SendGrid via edge fn) přijde v separátním kroku. Mezitím
    // se rodič musí zaregistrovat ručně přes oli-edu.com a invite link.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertErr } = await (supabase as any)
      .from("parent_invitations")
      .insert({
        email: email.trim().toLowerCase(),
        child_id: childId ?? null,
        child_name: childName ?? null,
        anon_grade: anonGrade ?? null,
        status: "pending",
      });

    setLoading(false);

    if (insertErr) {
      setError(`Nepodařilo se odeslat pozvánku: ${insertErr.message}`);
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
          <div className="text-5xl">📬</div>
          <h3 className="text-lg font-bold text-gray-900">Pozvánka uložena!</h3>
          <p className="text-gray-500 text-sm">
            Řekni rodiči, ať se zaregistruje na <strong>oli-edu.com</strong> se stejným
            emailem ({email}). Pak uvidí tvůj pokrok.
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

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
        <div className="text-center">
          <div className="text-4xl mb-2">👪</div>
          <h3 className="text-lg font-bold text-gray-900">Sdílet pokrok s rodiči</h3>
          <p className="text-gray-500 text-sm mt-1">
            Rodič uvidí tvůj pokrok a může ti zadat úkoly.
            <br />
            <strong>Rozhoduješ ty — ne on.</strong>
          </p>
        </div>

        <div>
          <label htmlFor="parent-email" className="text-sm text-gray-600 font-medium flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" /> Email rodiče
          </label>
          <input
            id="parent-email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(null); }}
            placeholder="maminka@email.cz"
            autoComplete="off"
            className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3
                       text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
          />
          {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
        </div>

        <div className="space-y-2">
          <button
            onClick={handleSend}
            disabled={!email || loading}
            className="w-full bg-violet-600 text-white rounded-xl py-3 font-semibold
                       hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed
                       transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Odesílám…</>
            ) : (
              <>Poslat pozvánku →</>
            )}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full text-gray-400 text-sm hover:text-gray-600 py-2 disabled:opacity-60"
          >
            Teď ne
          </button>
        </div>
      </div>
    </div>
  );
}
