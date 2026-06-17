/**
 * DEV-ONLY widget pro reset anonymního 14denního trialu.
 *
 * Renderuje se JEN ve vývojovém režimu (`import.meta.env.DEV`) — v produkčním
 * buildu se vůbec nezahrne (mount v App.tsx je za tím flagem). Slouží k rychlému
 * testování trial flow bez ručního zásahu do konzole.
 *
 * Plovoucí pilulka vlevo dole: ukazuje aktuální den trialu a po rozbalení nabízí
 * reset na den 1, posun těsně před konec a smazání všech anon dat.
 */
import { useState } from "react";
import {
  getTrialState,
  getTrialCurrentDay,
  getTrialDaysRemaining,
  restartTrial,
  TRIAL_DAYS,
} from "@/lib/anonTrial";

export function DevTrialReset() {
  const [open, setOpen] = useState(false);

  const state = getTrialState();
  const day = state ? getTrialCurrentDay() : null;
  const remaining = state ? getTrialDaysRemaining() : null;
  const expired = state ? remaining === 0 : false;

  const reset = (daysAgo = 0) => {
    restartTrial(undefined, daysAgo);
    location.reload();
  };

  const wipe = () => {
    Object.keys(localStorage)
      .filter((k) => k.startsWith("oli_anon"))
      .forEach((k) => localStorage.removeItem(k));
    location.reload();
  };

  const label = state
    ? expired
      ? "Trial: expirován"
      : `Trial: den ${day}/${TRIAL_DAYS}`
    : "Trial: neběží";

  return (
    <div className="fixed bottom-3 left-3 z-[9999] font-mono text-xs select-none">
      {open ? (
        <div className="w-56 rounded-lg border border-dashed border-amber-400 bg-amber-50/95 p-2 shadow-lg backdrop-blur">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-semibold text-amber-900">🛠 DEV · {label}</span>
            <button
              onClick={() => setOpen(false)}
              className="rounded px-1 text-amber-700 hover:bg-amber-200"
              aria-label="Zavřít"
            >
              ✕
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => reset(0)}
              className="rounded bg-amber-500 px-2 py-1 font-semibold text-white hover:bg-amber-600"
            >
              🔄 Reset trial (14 dní)
            </button>
            <button
              onClick={() => reset(TRIAL_DAYS - 2)}
              className="rounded border border-amber-400 bg-white px-2 py-1 text-amber-800 hover:bg-amber-100"
            >
              ⏳ Posun na den {TRIAL_DAYS - 1}
            </button>
            <button
              onClick={() => reset(TRIAL_DAYS + 1)}
              className="rounded border border-amber-400 bg-white px-2 py-1 text-amber-800 hover:bg-amber-100"
            >
              💀 Nastav expirováno
            </button>
            <button
              onClick={wipe}
              className="mt-1 rounded border border-red-300 bg-white px-2 py-1 text-red-700 hover:bg-red-50"
            >
              🗑 Smazat anon data
            </button>
          </div>
          <p className="mt-2 leading-tight text-amber-700/80">
            Jen v dev módu. Po kliknutí reload.
          </p>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="rounded-full border border-dashed border-amber-400 bg-amber-50/95 px-3 py-1 text-amber-900 shadow-md hover:bg-amber-100"
          title="Dev: reset trialu"
        >
          🛠 {label}
        </button>
      )}
    </div>
  );
}
