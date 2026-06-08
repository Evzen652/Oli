import { useState, useCallback, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Per-karta „OK" stav v adminu — který konkrétní vygenerovaný příklad
 * už admin zkontroloval. Klíč = skill.id + obsah karty (otázka+odpověď),
 * takže označení drží na konkrétní kartě, ne na celém podtématu.
 *
 * Persistence: Supabase tabulka `admin_reviewed_cards` (sdílená mezi PC).
 * Optimistický update lokálního stavu + fire-and-forget zápis na server.
 * Pokud migrace ještě neproběhla / server nedostupný → UI funguje, jen se
 * stav neuloží (tichý fallback).
 */

/** Stabilní klíč karty — nezávislý na pořadí/indexu. */
export function cardKey(skillId: string, question: string, correctAnswer: string): string {
  return `${skillId}::${question}::${correctAnswer}`;
}

async function persist(key: string, willReview: boolean): Promise<void> {
  try {
    if (willReview) {
      const skillId = key.split("::")[0];
      const {
        data: { user },
      } = await supabase.auth.getUser();
      await (supabase as any)
        .from("admin_reviewed_cards")
        .upsert({ card_key: key, skill_id: skillId, reviewed_by: user?.id ?? null });
    } else {
      await (supabase as any).from("admin_reviewed_cards").delete().eq("card_key", key);
    }
  } catch {
    /* server nedostupný / migrace neproběhla — tichý fallback */
  }
}

export function useExerciseReview() {
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());
  // Ref pro spolehlivé čtení aktuálního stavu uvnitř toggle (bez stale closure).
  const reviewedRef = useRef(reviewed);
  reviewedRef.current = reviewed;

  // Načti všechny zkontrolované karty (jednou při mountu).
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data, error } = await (supabase as any)
          .from("admin_reviewed_cards")
          .select("card_key");
        if (!active || error || !data) return;
        setReviewed(new Set((data as { card_key: string }[]).map((r) => r.card_key)));
      } catch {
        /* tichý fallback */
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const toggleReviewed = useCallback((key: string) => {
    const willReview = !reviewedRef.current.has(key);
    // Optimistický update
    setReviewed((prev) => {
      const next = new Set(prev);
      if (willReview) next.add(key);
      else next.delete(key);
      return next;
    });
    // Fire-and-forget zápis na server
    void persist(key, willReview);
  }, []);

  const isReviewed = useCallback((key: string) => reviewed.has(key), [reviewed]);

  return { reviewed, toggleReviewed, isReviewed };
}
