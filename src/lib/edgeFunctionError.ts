/**
 * Mapuje chyby z `supabase.functions.invoke()` na srozumitelné
 * české hlášky s konkrétní akční radou.
 *
 * Důvod: výchozí FunctionsFetchError vrací jen "Failed to send a
 * request to the Edge Function" — uživatel netuší, proč to nefunguje
 * ani co opravit.
 *
 * Použití:
 *   const { data, error } = await supabase.functions.invoke("ai-tutor", {...});
 *   if (error) throw new Error(friendlyEdgeFunctionError(error, "ai-tutor"));
 */

import type { FunctionsHttpError, FunctionsRelayError, FunctionsFetchError } from "@supabase/supabase-js";

type EdgeError = FunctionsHttpError | FunctionsRelayError | FunctionsFetchError | Error | unknown;

interface FriendlyOptions {
  /** Název funkce — pro deploy command v hlášce */
  functionName: string;
  /** Volitelně přečte error.context.json() pro detail (např. LOVABLE_API_KEY missing) */
  bodyJson?: Record<string, unknown> | null;
}

export async function friendlyEdgeFunctionError(
  error: EdgeError,
  functionName: string,
): Promise<string> {
  if (!error) return "Neznámá chyba";

  const err = error as { message?: string; context?: { status?: number; json?: () => Promise<Record<string, unknown>> } };
  const status = err.context?.status;

  // Pokus o získání detailu z těla odpovědi
  let body: Record<string, unknown> | null = null;
  try {
    body = (await err.context?.json?.()) ?? null;
  } catch {
    // ignore
  }
  const bodyError = typeof body?.error === "string" ? (body.error as string) : null;

  return formatMessage({ status, message: err.message, bodyError, functionName });
}

/** Synchronní varianta — když nechceš parsovat tělo */
export function friendlyEdgeFunctionErrorSync(
  error: EdgeError,
  functionName: string,
): string {
  if (!error) return "Neznámá chyba";
  const err = error as { message?: string; context?: { status?: number } };
  return formatMessage({
    status: err.context?.status,
    message: err.message,
    bodyError: null,
    functionName,
  });
}

function formatMessage({
  status,
  message,
  bodyError,
  functionName,
}: {
  status?: number;
  message?: string;
  bodyError: string | null;
  functionName: string;
}): string {
  // Network / not deployed
  if (status === 404 || message?.includes("Failed to send a request") || message?.includes("Failed to fetch")) {
    return (
      `Edge funkce "${functionName}" není dostupná. Pravděpodobné příčiny:\n` +
      `• Funkce není nasazena → spusťte: npx supabase functions deploy ${functionName}\n` +
      `• Síťový problém — zkontrolujte připojení`
    );
  }
  // Auth
  if (status === 401) return "Nejste přihlášen/a — přihlaste se prosím znovu.";
  if (status === 403) return "Nemáte oprávnění — pouze admin může používat tuto funkci.";
  // Rate limit
  if (status === 429) return "Příliš mnoho požadavků — počkejte chvíli a zkuste znovu.";
  // Server errors
  if (status === 500 || status === 502 || status === 503) {
    if (bodyError?.includes("LOVABLE_API_KEY") || bodyError?.includes("API_KEY")) {
      return (
        `AI brána není nakonfigurována. V Supabase projektu chybí API klíč ` +
        `(Settings → Edge Functions → Secrets → LOVABLE_API_KEY).`
      );
    }
    if (bodyError) return `Chyba serveru: ${bodyError}`;
    return `Chyba serveru (${status}). Zkontrolujte logy edge funkce "${functionName}" v Supabase.`;
  }
  // Fallback
  if (bodyError) return bodyError;
  if (message) return message;
  return `Nepodařilo se zavolat "${functionName}". Zkuste to prosím znovu.`;
}
