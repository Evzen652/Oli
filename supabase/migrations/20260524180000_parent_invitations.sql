-- Parent invitations — dítě pozývá rodiče
--
-- Princip: dítě má kontrolu nad sdílením pokroku.
-- Anonymní/registrované dítě může poslat pozvánku rodiči přes email.
-- Rodič po registraci přes invite link se automaticky propojí s dítětem.

CREATE TABLE IF NOT EXISTS public.parent_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Email rodiče
  email TEXT NOT NULL,
  -- Vazba na dítě (auth.users.id) — null pokud pozvánka pochází z anonymního módu
  child_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Jméno dítěte (přepisováno z client side pro personalizaci emailu)
  child_name TEXT,
  -- Ročník — pro anonymní pozvánky (kde child_id je null) předáváme aspoň ročník
  anon_grade INTEGER CHECK (anon_grade BETWEEN 1 AND 9),
  invited_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'expired')),
  accepted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS parent_invitations_email_idx
  ON public.parent_invitations (email, status);
CREATE INDEX IF NOT EXISTS parent_invitations_child_idx
  ON public.parent_invitations (child_id, status);

-- RLS — dítě vidí jen své pozvánky, anonymní pozvánky jsou viditelné po id
ALTER TABLE public.parent_invitations ENABLE ROW LEVEL SECURITY;

-- Dítě (přihlášené) může číst své pozvánky
CREATE POLICY "Child reads own invitations"
ON public.parent_invitations FOR SELECT
USING (child_id = auth.uid());

-- Dítě může vytvořit pozvánku pro sebe NEBO anonymní uživatel (child_id NULL)
CREATE POLICY "Anyone can create invitations"
ON public.parent_invitations FOR INSERT
WITH CHECK (child_id IS NULL OR child_id = auth.uid());

-- Update statusu — kdokoli s ID pozvánky může označit jako accepted
-- (rodič po registraci v Auth.tsx přes invite query param)
CREATE POLICY "Update invitation status by id"
ON public.parent_invitations FOR UPDATE
USING (true)
WITH CHECK (status IN ('pending', 'accepted', 'expired'));

-- Admins mají plný přístup
CREATE POLICY "Admins manage invitations"
ON public.parent_invitations FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

COMMENT ON TABLE public.parent_invitations IS
  'Pozvánky od dítěte k rodiči. Dítě má kontrolu nad sdílením pokroku.';
COMMENT ON COLUMN public.parent_invitations.anon_grade IS
  'Ročník dítěte pro anonymní pozvánky (kde child_id IS NULL).';
COMMENT ON COLUMN public.parent_invitations.status IS
  'pending = čeká na akceptaci rodičem, accepted = rodič se zaregistroval, expired = nevyzvednuto';
