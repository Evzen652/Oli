-- Fix: parent_invitations UPDATE policy — USING(true) → omezit na pending→accepted
-- Původní USING(true) umožňoval komukoliv se znalostí UUID aktualizovat jakýkoliv záznam.
-- Nová politika: aktualizovat lze jen pending pozvánky, a jen na status 'accepted'.

DROP POLICY IF EXISTS "Update invitation status by id" ON public.parent_invitations;

CREATE POLICY "Update invitation status by id"
ON public.parent_invitations FOR UPDATE
USING (status = 'pending')
WITH CHECK (status = 'accepted');
