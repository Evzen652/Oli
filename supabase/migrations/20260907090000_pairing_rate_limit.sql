-- Omezení pokusů o uhodnutí párovacího kódu dítěte.
--
-- Proč: `pair-child` hledá dítě podle šestimístného kódu. Abeceda má 32 znaků,
-- takže prostor je 32^6 ≈ 1,07 miliardy. Kód platí 48 hodin a špatný pokus
-- nedopadne na žádný řádek, takže ho nešlo počítat u dítěte — jediné místo,
-- kde jde útok zachytit, je volající.
--
-- Bez tohohle limitu mohl útočník posílat dotazy bez omezení, dokud netrefil
-- kterýkoli živý kód; úspěch vydá relaci DĚTSKÉHO účtu. Pro srovnání: PIN pro
-- návrat dítěte zámek po pěti chybách má už dlouho (`child-relogin`). Táž
-- hrozba, dvě různé úrovně ochrany.
--
-- Ukládá se HASH adresy, ne adresa. K ničemu jinému než k počítání pokusů
-- ji nepotřebujeme a u aplikace pro děti nechceme držet víc, než je nutné.

create table if not exists public.pairing_attempts (
  ip_hash            text primary key,
  attempts           integer     not null default 0,
  window_started_at  timestamptz not null default now(),
  locked_until       timestamptz
);

comment on table public.pairing_attempts is
  'Počítadlo neúspěšných pokusů o párovací kód, klíčované hashem IP. Zapisuje jen edge funkce pair-child přes service role.';

-- Rychlé hledání řádků k úklidu.
create index if not exists pairing_attempts_window_idx
  on public.pairing_attempts (window_started_at);

-- RLS zapnuté a ZÁMĚRNĚ bez jediné policy: k tabulce se nesmí dostat žádný
-- klient, jen service role (ta RLS obchází). Kdyby si ji mohl přečíst kdokoli,
-- prozradí, kolik pokusů kdo dělá — a hashe IP by šlo proti seznamu adres
-- zkoušet zpětně.
alter table public.pairing_attempts enable row level security;
