-- ═══════════════════════════════════════════════════════════════════════════
-- RVP seed pro 6.–9. ročník ZŠ
-- ═══════════════════════════════════════════════════════════════════════════
-- Strukturální seed: předmět → okruh → téma → dovednost.
-- Dovednosti jsou zatím BEZ custom_exercises — cvičení budou generována AI
-- přes ai-tutor edge funkci nebo seedovaná postupně.
--
-- Každá dovednost má:
--   • name         — krátký název viditelný dětem
--   • code_skill_id — unikátní slug pro kód matching
--   • brief_description — popis pro žáka (2. osoba)
--   • goals        — učební cíle podle RVP
--   • boundaries   — co se NEPROCVIČUJE (age-appropriate limits)
--   • keywords     — pro matchTopic() — jaká slova dítě napíše
--   • grade_min/max — věková platnost
--   • input_type   — typ odpovědi
--
-- NOTE: UPSERT pattern — bezpečné spouštět opakovaně.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Ensure: subject "matematika" ──────────────────────────────────────────
INSERT INTO curriculum_subjects (slug, name, sort_order)
VALUES ('matematika', 'matematika', 10)
ON CONFLICT (slug) DO NOTHING;

-- ── Ensure: subject "čeština" ─────────────────────────────────────────────
INSERT INTO curriculum_subjects (slug, name, sort_order)
VALUES ('cestina', 'čeština', 20)
ON CONFLICT (slug) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════
-- MATEMATIKA — okruhy dle RVP pro II. stupeň (6.–9.)
-- ═══════════════════════════════════════════════════════════════════════════

WITH math_subj AS (SELECT id FROM curriculum_subjects WHERE slug = 'matematika')
INSERT INTO curriculum_categories (slug, name, subject_id, description, sort_order)
SELECT slug, name, (SELECT id FROM math_subj), description, sort_order FROM (VALUES
  ('math-cisla-operace-ii',   'čísla a operace',          'Dělitelnost, desetinná čísla, celá čísla, procenta.', 100),
  ('math-zlomky-ii',          'zlomky',                   'Operace se zlomky, smíšené číslo.',                  110),
  ('math-pomer-procenta',     'poměr a procenta',         'Poměr, úměrnost, procenta, trojčlenka.',             120),
  ('math-algebra',            'algebra',                  'Výrazy, rovnice, mocniny, odmocniny, soustavy.',     130),
  ('math-geometrie-ii',       'geometrie',                'Trojúhelník, čtyřúhelník, kruh, souměrnost, tělesa.',140),
  ('math-funkce',             'funkce',                   'Pojem funkce, lineární, kvadratická, graf.',         150),
  ('math-statistika',         'statistika a pravděpodobnost', 'Průměr, medián, modus, pravděpodobnost.',        160),
  ('math-finance',            'finanční matematika',      'Úrok, úroková míra, slevy, daně.',                   170)
) AS t(slug, name, description, sort_order)
ON CONFLICT (slug) DO NOTHING;

-- ── Helper: insert topic ──
-- Skills pro 6.–9. insertujeme s kategoriemi dle RVP. Každá skill má komplet metadata.

-- ═══════════════════════════════════════════════════════════════════════════
-- 6. ROČNÍK
-- ═══════════════════════════════════════════════════════════════════════════

-- Téma: Dělitelnost (okruh: čísla a operace)
WITH cat AS (SELECT id FROM curriculum_categories WHERE slug = 'math-cisla-operace-ii')
INSERT INTO curriculum_topics (slug, name, category_id, description, sort_order)
SELECT 'math-delitelnost', 'dělitelnost', (SELECT id FROM cat),
  'Dělitelé, násobky, prvočísla, nejmenší společný násobek, největší společný dělitel.', 10
ON CONFLICT (slug) DO NOTHING;

WITH t AS (SELECT id FROM curriculum_topics WHERE slug = 'math-delitelnost')
INSERT INTO curriculum_skills (
  code_skill_id, name, topic_id, brief_description, grade_min, grade_max,
  input_type, goals, boundaries, keywords, help_hint, help_example, help_common_mistake
)
SELECT 'math-delitelnost-6', 'dělitelnost', (SELECT id FROM t),
  'Naučíš se rozpoznávat dělitele, násobky a prvočísla.', 6, 7, 'number',
  '["Určíš, zda je jedno číslo dělitelné druhým.", "Najdeš všechny dělitele daného čísla.", "Rozpoznáš prvočísla do 100."]'::jsonb,
  '["Neprobíráme NSD/NSN s velkými čísly (jen do 100).", "Neprobíráme záporná čísla jako dělitele."]'::jsonb,
  '["dělitelnost","dělitel","násobek","prvočíslo","dělitel"]'::jsonb,
  'Použij pravidla dělitelnosti: 2 (sudé), 3 (ciferný součet), 5 (končí 0/5), 10 (končí 0).',
  'Je 24 dělitelné 6? → 24 : 6 = 4, ano.',
  'Zaměnit dělitel a násobek.'
ON CONFLICT (code_skill_id) DO NOTHING;

-- Téma: Desetinná čísla
WITH cat AS (SELECT id FROM curriculum_categories WHERE slug = 'math-cisla-operace-ii')
INSERT INTO curriculum_topics (slug, name, category_id, description, sort_order)
SELECT 'math-desetinna-cisla', 'desetinná čísla', (SELECT id FROM cat),
  'Zápis, porovnávání, zaokrouhlování a operace s desetinnými čísly.', 20
ON CONFLICT (slug) DO NOTHING;

WITH t AS (SELECT id FROM curriculum_topics WHERE slug = 'math-desetinna-cisla')
INSERT INTO curriculum_skills (
  code_skill_id, name, topic_id, brief_description, grade_min, grade_max,
  input_type, goals, boundaries, keywords, help_hint, help_example, help_common_mistake
)
SELECT 'math-desetinna-scitani-6', 'sčítání a odčítání desetinných čísel', (SELECT id FROM t),
  'Naučíš se sčítat a odčítat čísla s desetinnou čárkou.', 6, 7, 'number',
  '["Zarovnáš desetinnou čárku pod sebou.", "Sečteš nebo odečteš jako u přirozených čísel."]'::jsonb,
  '["Neprobíráme násobení a dělení — to je v další dovednosti."]'::jsonb,
  '["desetinná","desetinné","čárka","sčítání desetinných"]'::jsonb,
  'Pod sebe zarovnej desetinné čárky. Chybějící místa doplň nulami.',
  '2,3 + 1,47 → 2,30 + 1,47 = 3,77',
  'Zapomenutá nula při zarovnávání.'
ON CONFLICT (code_skill_id) DO NOTHING;

-- Téma: Úhly (okruh: geometrie)
WITH cat AS (SELECT id FROM curriculum_categories WHERE slug = 'math-geometrie-ii')
INSERT INTO curriculum_topics (slug, name, category_id, description, sort_order)
SELECT 'math-uhly', 'úhly', (SELECT id FROM cat),
  'Druhy úhlů, vrcholové, vedlejší, součet úhlů v trojúhelníku.', 30
ON CONFLICT (slug) DO NOTHING;

WITH t AS (SELECT id FROM curriculum_topics WHERE slug = 'math-uhly')
INSERT INTO curriculum_skills (
  code_skill_id, name, topic_id, brief_description, grade_min, grade_max,
  input_type, goals, boundaries, keywords, help_hint, help_example, help_common_mistake
)
SELECT 'math-uhly-6', 'úhly', (SELECT id FROM t),
  'Naučíš se pojmenovávat a počítat velikosti úhlů.', 6, 7, 'number',
  '["Poznáš pravý (90°), ostrý (<90°), tupý (>90°), přímý (180°) úhel.", "Spočítáš úhly vrcholové a vedlejší.", "Využiješ, že součet úhlů v trojúhelníku je 180°."]'::jsonb,
  '["Neprobíráme goniometrické funkce (SŠ).", "Neprobíráme konstrukci úhloměrem."]'::jsonb,
  '["úhel","úhly","stupně","pravý úhel","ostrý","tupý","trojúhelník úhly"]'::jsonb,
  'Součet úhlů v trojúhelníku je vždy 180°. Vedlejší úhly dávají dohromady 180°.',
  'Trojúhelník má úhly 40° a 60°. Třetí úhel = 180° − 40° − 60° = 80°.',
  'Zapomenutí, že součet je 180°, ne 360°.'
ON CONFLICT (code_skill_id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════
-- 7. ROČNÍK (klíčové — tohle chybí nejvíc!)
-- ═══════════════════════════════════════════════════════════════════════════

-- Téma: Celá čísla
WITH cat AS (SELECT id FROM curriculum_categories WHERE slug = 'math-cisla-operace-ii')
INSERT INTO curriculum_topics (slug, name, category_id, description, sort_order)
SELECT 'math-cela-cisla', 'celá čísla', (SELECT id FROM cat),
  'Záporná čísla, absolutní hodnota, sčítání, odčítání, násobení, dělení.', 40
ON CONFLICT (slug) DO NOTHING;

WITH t AS (SELECT id FROM curriculum_topics WHERE slug = 'math-cela-cisla')
INSERT INTO curriculum_skills (
  code_skill_id, name, topic_id, brief_description, grade_min, grade_max,
  input_type, goals, boundaries, keywords, help_hint, help_example, help_common_mistake
)
SELECT 'math-cela-cisla-7', 'celá čísla', (SELECT id FROM t),
  'Naučíš se počítat se zápornými čísly.', 7, 8, 'number',
  '["Porovnáš záporná a kladná čísla.", "Sečteš a odečteš čísla se znaménky.", "Vynásobíš a vydělíš záporná čísla.", "Určíš absolutní hodnotu čísla."]'::jsonb,
  '["Neprobíráme zlomky záporné (je to později).", "Neprobíráme komplexní čísla (SŠ)."]'::jsonb,
  '["celá čísla","záporná čísla","minus","znaménko","absolutní hodnota"]'::jsonb,
  'Při sčítání stejných znamének — sečti a ponech znaménko. Při různých — odečti a použij znaménko většího.',
  '(−3) + 5 = 2 (odečtem 5−3, znaménko +), (−4) · (−2) = 8 (minus · minus = plus).',
  'Zapomenutí znaménka, chyba při různých znamenkách.'
ON CONFLICT (code_skill_id) DO NOTHING;

-- Téma: Procenta
WITH cat AS (SELECT id FROM curriculum_categories WHERE slug = 'math-pomer-procenta')
INSERT INTO curriculum_topics (slug, name, category_id, description, sort_order)
SELECT 'math-procenta', 'procenta', (SELECT id FROM cat),
  'Pojem procento, procentová část, základ, počet procent, slovní úlohy.', 10
ON CONFLICT (slug) DO NOTHING;

WITH t AS (SELECT id FROM curriculum_topics WHERE slug = 'math-procenta')
INSERT INTO curriculum_skills (
  code_skill_id, name, topic_id, brief_description, grade_min, grade_max,
  input_type, goals, boundaries, keywords, help_hint, help_example, help_common_mistake
)
SELECT 'math-procenta-7', 'procenta', (SELECT id FROM t),
  'Naučíš se počítat s procenty — kolik je X % z čísla, kolik procent tvoří část.', 7, 9, 'number',
  '["Vypočítáš procentovou část (15 % z 200).", "Vypočítáš základ (12 je 20 % z čeho?).", "Vypočítáš počet procent (15 ze 60 je kolik %?).", "Vyřešíš slovní úlohy: sleva, úrok, daň."]'::jsonb,
  '["Neprobíráme složené úročení (8./9. ročník).", "Neprobíráme promile."]'::jsonb,
  '["procenta","%","procento","sleva","úrok","část","ze sta"]'::jsonb,
  '1 % = jedna setina. 100 % = celek. X % z čísla = X/100 · číslo.',
  '15 % z 200 = 15/100 · 200 = 30. Kalhoty za 800 se slevou 25 % stojí 800 − 0,25·800 = 600.',
  'Zaměnění části a základu, počítání slevy jako 25 místo 75 %.'
ON CONFLICT (code_skill_id) DO NOTHING;

-- Téma: Poměr a úměrnost
WITH cat AS (SELECT id FROM curriculum_categories WHERE slug = 'math-pomer-procenta')
INSERT INTO curriculum_topics (slug, name, category_id, description, sort_order)
SELECT 'math-pomer', 'poměr a úměrnost', (SELECT id FROM cat),
  'Poměr dvou veličin, přímá a nepřímá úměrnost, trojčlenka.', 20
ON CONFLICT (slug) DO NOTHING;

WITH t AS (SELECT id FROM curriculum_topics WHERE slug = 'math-pomer')
INSERT INTO curriculum_skills (
  code_skill_id, name, topic_id, brief_description, grade_min, grade_max,
  input_type, goals, boundaries, keywords, help_hint, help_example, help_common_mistake
)
SELECT 'math-pomer-7', 'poměr a úměrnost', (SELECT id FROM t),
  'Naučíš se pracovat s poměrem a řešit úlohy o úměrnosti pomocí trojčlenky.', 7, 9, 'text',
  '["Zapíšeš poměr dvou veličin.", "Rozdělíš celek v daném poměru.", "Vyřešíš úlohy o přímé úměrnosti trojčlenkou.", "Rozlišíš přímou a nepřímou úměrnost."]'::jsonb,
  '["Neprobíráme měřítko map a plánů podrobně (geografie).", "Neprobíráme souměrnost s proměnlivým poměrem."]'::jsonb,
  '["poměr","úměrnost","trojčlenka","přímá úměrnost","nepřímá","rozdělit v poměru"]'::jsonb,
  'Poměr 3:5 znamená, že jedna část je trojnásobná a druhá pětinásobná stejné jednotky.',
  'Rozděl 80 v poměru 3:5. Jedna jednotka = 80 ÷ 8 = 10. Takže 30:50.',
  'Zapomenutí sečíst části poměru před dělením.'
ON CONFLICT (code_skill_id) DO NOTHING;

-- Téma: Osová a středová souměrnost
WITH cat AS (SELECT id FROM curriculum_categories WHERE slug = 'math-geometrie-ii')
INSERT INTO curriculum_topics (slug, name, category_id, description, sort_order)
SELECT 'math-soumernost', 'souměrnost', (SELECT id FROM cat),
  'Osová a středová souměrnost, obraz a vzor.', 40
ON CONFLICT (slug) DO NOTHING;

WITH t AS (SELECT id FROM curriculum_topics WHERE slug = 'math-soumernost')
INSERT INTO curriculum_skills (
  code_skill_id, name, topic_id, brief_description, grade_min, grade_max,
  input_type, goals, boundaries, keywords, help_hint, help_example, help_common_mistake
)
SELECT 'math-soumernost-7', 'souměrnost', (SELECT id FROM t),
  'Naučíš se rozpoznávat osovou a středovou souměrnost.', 7, 8, 'select_one',
  '["Rozpoznáš osu souměrnosti útvaru.", "Najdeš obraz bodu v osové souměrnosti.", "Rozpoznáš středovou souměrnost."]'::jsonb,
  '["Neprobíráme otočení o obecný úhel (9. ročník)."]'::jsonb,
  '["souměrnost","osová","středová","obraz","osa","zrcadlo"]'::jsonb,
  'Osová souměrnost je jako odraz v zrcadle. Středová je otočení o 180° kolem bodu.',
  'Čtverec má 4 osy souměrnosti. Písmeno H má 2.',
  'Záměna osové a středové souměrnosti.'
ON CONFLICT (code_skill_id) DO NOTHING;

-- Téma: Objem a povrch kvádru a krychle
WITH cat AS (SELECT id FROM curriculum_categories WHERE slug = 'math-geometrie-ii')
INSERT INTO curriculum_topics (slug, name, category_id, description, sort_order)
SELECT 'math-objem-kvadr', 'objem a povrch — kvádr a krychle', (SELECT id FROM cat),
  'Výpočty objemu a povrchu kvádru a krychle, jednotky objemu.', 50
ON CONFLICT (slug) DO NOTHING;

WITH t AS (SELECT id FROM curriculum_topics WHERE slug = 'math-objem-kvadr')
INSERT INTO curriculum_skills (
  code_skill_id, name, topic_id, brief_description, grade_min, grade_max,
  input_type, goals, boundaries, keywords, help_hint, help_example, help_common_mistake
)
SELECT 'math-objem-kvadr-7', 'objem kvádru a krychle', (SELECT id FROM t),
  'Naučíš se vypočítat objem a povrch kvádru a krychle.', 7, 8, 'number',
  '["Vypočítáš objem kvádru V = a·b·c.", "Vypočítáš objem krychle V = a³.", "Vypočítáš povrch kvádru S = 2(ab+bc+ac).", "Převedeš jednotky objemu: cm³, dm³, m³, l."]'::jsonb,
  '["Neprobíráme jehlan, kužel, kouli (8.–9. ročník)."]'::jsonb,
  '["objem","povrch","kvádr","krychle","V=abc","cm³","litr"]'::jsonb,
  '1 litr = 1 dm³ = 1000 cm³. Objem = součin tří hran.',
  'Krychle s hranou 4 cm: V = 4³ = 64 cm³. Povrch = 6 · 4² = 96 cm².',
  'Zamění se objem a povrch, nebo se zapomene ·6 u povrchu krychle.'
ON CONFLICT (code_skill_id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════
-- 8. ROČNÍK — klíčové dovednosti
-- ═══════════════════════════════════════════════════════════════════════════

-- Téma: Mocniny a odmocniny
WITH cat AS (SELECT id FROM curriculum_categories WHERE slug = 'math-algebra')
INSERT INTO curriculum_topics (slug, name, category_id, description, sort_order)
SELECT 'math-mocniny', 'mocniny a odmocniny', (SELECT id FROM cat),
  'Druhá a třetí mocnina, druhá odmocnina, pravidla pro mocniny.', 10
ON CONFLICT (slug) DO NOTHING;

WITH t AS (SELECT id FROM curriculum_topics WHERE slug = 'math-mocniny')
INSERT INTO curriculum_skills (
  code_skill_id, name, topic_id, brief_description, grade_min, grade_max,
  input_type, goals, boundaries, keywords, help_hint, help_example, help_common_mistake
)
SELECT 'math-mocniny-8', 'mocniny a odmocniny', (SELECT id FROM t),
  'Naučíš se počítat s mocninami a druhou odmocninou.', 8, 9, 'number',
  '["Spočítáš a², a³, aⁿ pro malá a.", "Využiješ pravidla pro mocniny se stejným základem.", "Odhadneš druhou odmocninu.", "Zapíšeš číslo mocninou deseti (vědecký zápis)."]'::jsonb,
  '["Neprobíráme záporné mocnitele (SŠ).", "Neprobíráme komplexní čísla."]'::jsonb,
  '["mocnina","odmocnina","druhá mocnina","třetí mocnina","√"]'::jsonb,
  'a² = a·a, a³ = a·a·a. √81 = 9, protože 9² = 81.',
  '3⁴ = 3·3·3·3 = 81. √144 = 12, protože 12² = 144.',
  'Zaměnění a² a 2·a (2² = 4, ne 4).'
ON CONFLICT (code_skill_id) DO NOTHING;

-- Téma: Pythagorova věta
WITH cat AS (SELECT id FROM curriculum_categories WHERE slug = 'math-geometrie-ii')
INSERT INTO curriculum_topics (slug, name, category_id, description, sort_order)
SELECT 'math-pythagoras', 'Pythagorova věta', (SELECT id FROM cat),
  'a² + b² = c², použití v pravoúhlém trojúhelníku.', 60
ON CONFLICT (slug) DO NOTHING;

WITH t AS (SELECT id FROM curriculum_topics WHERE slug = 'math-pythagoras')
INSERT INTO curriculum_skills (
  code_skill_id, name, topic_id, brief_description, grade_min, grade_max,
  input_type, goals, boundaries, keywords, help_hint, help_example, help_common_mistake
)
SELECT 'math-pythagoras-8', 'Pythagorova věta', (SELECT id FROM t),
  'Naučíš se Pythagorovu větu a aplikovat ji v pravoúhlém trojúhelníku.', 8, 9, 'number',
  '["Zapíšeš vztah a² + b² = c².", "Vypočítáš přeponu ze dvou odvěsen.", "Vypočítáš odvěsnu z přepony a druhé odvěsny.", "Vyřešíš slovní úlohy (úhlopříčka obdélníku atd.)."]'::jsonb,
  '["Neprobíráme goniometrické funkce (9./SŠ).", "Vztahuje se jen k pravoúhlému trojúhelníku."]'::jsonb,
  '["Pythagoras","pravoúhlý trojúhelník","přepona","odvěsna","a²+b²=c²"]'::jsonb,
  'Pythagorova věta platí JEN pro pravoúhlý trojúhelník. c je přepona (proti pravému úhlu).',
  'Odvěsny 3 a 4. Přepona: c² = 9 + 16 = 25, c = 5.',
  'Záměna přepony a odvěsny, použití na nepravoúhlý trojúhelník.'
ON CONFLICT (code_skill_id) DO NOTHING;

-- Téma: Lineární rovnice
WITH cat AS (SELECT id FROM curriculum_categories WHERE slug = 'math-algebra')
INSERT INTO curriculum_topics (slug, name, category_id, description, sort_order)
SELECT 'math-rovnice-linearni', 'lineární rovnice', (SELECT id FROM cat),
  'Rovnice s jednou neznámou, ekvivalentní úpravy, slovní úlohy.', 20
ON CONFLICT (slug) DO NOTHING;

WITH t AS (SELECT id FROM curriculum_topics WHERE slug = 'math-rovnice-linearni')
INSERT INTO curriculum_skills (
  code_skill_id, name, topic_id, brief_description, grade_min, grade_max,
  input_type, goals, boundaries, keywords, help_hint, help_example, help_common_mistake
)
SELECT 'math-rovnice-8', 'lineární rovnice', (SELECT id FROM t),
  'Naučíš se řešit rovnice s jednou neznámou a slovní úlohy.', 8, 9, 'number',
  '["Vyřešíš rovnici tvaru ax + b = c.", "Použiješ ekvivalentní úpravy (přičíst, odečíst, násobit, dělit).", "Zapíšeš slovní úlohu rovnicí a vyřešíš."]'::jsonb,
  '["Neprobíráme soustavy rovnic (9. ročník).", "Neprobíráme rovnice s neznámou ve jmenovateli (9. roč.)."]'::jsonb,
  '["rovnice","lineární","neznámá","x","řešit rovnici"]'::jsonb,
  'Cílem je na jedné straně mít jen x, na druhé číslo. Co uděláš vlevo, udělej i vpravo.',
  '2x + 6 = 14 → 2x = 8 → x = 4.',
  'Zapomenutí zachovat rovnost (úprava jen na jedné straně).'
ON CONFLICT (code_skill_id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════
-- 9. ROČNÍK
-- ═══════════════════════════════════════════════════════════════════════════

-- Téma: Soustava rovnic
WITH cat AS (SELECT id FROM curriculum_categories WHERE slug = 'math-algebra')
INSERT INTO curriculum_topics (slug, name, category_id, description, sort_order)
SELECT 'math-soustava-rovnic', 'soustava rovnic', (SELECT id FROM cat),
  'Soustava dvou lineárních rovnic o dvou neznámých — sčítací a dosazovací metoda.', 30
ON CONFLICT (slug) DO NOTHING;

WITH t AS (SELECT id FROM curriculum_topics WHERE slug = 'math-soustava-rovnic')
INSERT INTO curriculum_skills (
  code_skill_id, name, topic_id, brief_description, grade_min, grade_max,
  input_type, goals, boundaries, keywords, help_hint, help_example, help_common_mistake
)
SELECT 'math-soustava-rovnic-9', 'soustava rovnic', (SELECT id FROM t),
  'Naučíš se řešit soustavu dvou rovnic sčítací nebo dosazovací metodou.', 9, 9, 'text',
  '["Vyřešíš soustavu dvou lineárních rovnic dosazovací metodou.", "Vyřešíš soustavu sčítací metodou.", "Vyřešíš slovní úlohy přes dvě neznámé."]'::jsonb,
  '["Neprobíráme soustavy tří a více rovnic (SŠ).", "Neprobíráme nelineární soustavy (SŠ)."]'::jsonb,
  '["soustava","dvě rovnice","dvě neznámé","sčítací metoda","dosazovací metoda"]'::jsonb,
  'Dosazovací: z jedné rovnice vyjádři jednu neznámou a dosaď do druhé. Sčítací: násob rovnice tak, aby po sečtení jedna neznámá zmizela.',
  'x+y=10, x−y=2 → sečtením: 2x=12, x=6, pak y=4.',
  'Chyba při dosazení nebo zapomenuté znaménko při odčítání rovnic.'
ON CONFLICT (code_skill_id) DO NOTHING;

-- Téma: Funkce
WITH cat AS (SELECT id FROM curriculum_categories WHERE slug = 'math-funkce')
INSERT INTO curriculum_topics (slug, name, category_id, description, sort_order)
SELECT 'math-funkce-linearni', 'lineární funkce', (SELECT id FROM cat),
  'Pojem funkce, lineární funkce y = ax + b, graf, průsečík s osami.', 10
ON CONFLICT (slug) DO NOTHING;

WITH t AS (SELECT id FROM curriculum_topics WHERE slug = 'math-funkce-linearni')
INSERT INTO curriculum_skills (
  code_skill_id, name, topic_id, brief_description, grade_min, grade_max,
  input_type, goals, boundaries, keywords, help_hint, help_example, help_common_mistake
)
SELECT 'math-funkce-linearni-9', 'lineární funkce', (SELECT id FROM t),
  'Naučíš se pojem lineární funkce a její graf.', 9, 9, 'number',
  '["Určíš funkční hodnotu pro dané x.", "Určíš průsečíky grafu s osami.", "Rozpoznáš rostoucí a klesající funkci podle a."]'::jsonb,
  '["Neprobíráme kvadratické funkce podrobně (SŠ).", "Neprobíráme derivace."]'::jsonb,
  '["funkce","lineární funkce","graf","průsečík","y=ax+b"]'::jsonb,
  'a určuje sklon (a>0 → roste, a<0 → klesá), b je průsečík s osou y.',
  'y = 2x + 1. Pro x=3: y = 7. Průsečík s osou y: (0;1).',
  'Zapomenutí, že pro průsečík s osou x platí y = 0 (a naopak).'
ON CONFLICT (code_skill_id) DO NOTHING;

-- Téma: Podobnost trojúhelníků
WITH cat AS (SELECT id FROM curriculum_categories WHERE slug = 'math-geometrie-ii')
INSERT INTO curriculum_topics (slug, name, category_id, description, sort_order)
SELECT 'math-podobnost', 'podobnost trojúhelníků', (SELECT id FROM cat),
  'Pojem podobnosti, poměr podobnosti, věty o podobnosti.', 70
ON CONFLICT (slug) DO NOTHING;

WITH t AS (SELECT id FROM curriculum_topics WHERE slug = 'math-podobnost')
INSERT INTO curriculum_skills (
  code_skill_id, name, topic_id, brief_description, grade_min, grade_max,
  input_type, goals, boundaries, keywords, help_hint, help_example, help_common_mistake
)
SELECT 'math-podobnost-9', 'podobnost trojúhelníků', (SELECT id FROM t),
  'Naučíš se rozpoznávat a používat podobnost trojúhelníků.', 9, 9, 'number',
  '["Rozhodneš, zda jsou dva trojúhelníky podobné.", "Určíš poměr podobnosti.", "Využiješ podobnost k výpočtu neznámé strany."]'::jsonb,
  '["Neprobíráme podobnost obecných útvarů (SŠ).", "Neprobíráme transformace v souřadnicích."]'::jsonb,
  '["podobnost","podobné trojúhelníky","poměr","sss","sus"]'::jsonb,
  'Podobné trojúhelníky mají stejné úhly a jejich strany jsou v konstantním poměru.',
  'Trojúhelníky 3,4,5 a 6,8,10 jsou podobné — poměr 1:2.',
  'Zaměnění podobnosti a shodnosti.'
ON CONFLICT (code_skill_id) DO NOTHING;

-- Téma: Finanční matematika
WITH cat AS (SELECT id FROM curriculum_categories WHERE slug = 'math-finance')
INSERT INTO curriculum_topics (slug, name, category_id, description, sort_order)
SELECT 'math-urok', 'úrok', (SELECT id FROM cat),
  'Jistina, úrok, úroková míra, jednoduché úročení.', 10
ON CONFLICT (slug) DO NOTHING;

WITH t AS (SELECT id FROM curriculum_topics WHERE slug = 'math-urok')
INSERT INTO curriculum_skills (
  code_skill_id, name, topic_id, brief_description, grade_min, grade_max,
  input_type, goals, boundaries, keywords, help_hint, help_example, help_common_mistake
)
SELECT 'math-urok-9', 'úrok a úroková míra', (SELECT id FROM t),
  'Naučíš se počítat úrok a úrokovou míru — spoření, půjčka.', 9, 9, 'number',
  '["Vypočítáš úrok za rok z dané jistiny a úrokové míry.", "Vypočítáš úrok za část roku.", "Rozlišíš jednoduché a složené úročení."]'::jsonb,
  '["Neprobíráme složené úročení podrobně (SŠ ekonomie).", "Neprobíráme daň z úroku podrobně."]'::jsonb,
  '["úrok","jistina","úroková míra","spoření","půjčka","%"]'::jsonb,
  'Úrok za rok = jistina · úroková míra / 100. Za měsíc dělíš 12, za den 365.',
  '10000 Kč, 3% p.a. → úrok za rok = 10000 · 0,03 = 300 Kč.',
  'Zapomenutí dělit 100 nebo přepočítat období.'
ON CONFLICT (code_skill_id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════
-- DONE. Doporučený další krok:
-- Po spuštění této migrace v Supabase:
--   1. Admin projde v /admin každou novou dovednost a přidá cvičení (AI generováním)
--   2. Cvičení projdou 3vrstvou validací (format + grade + correctness) v ai-tutor
--   3. Kurátor ručně schválí 20–30 cvičení per dovednost, označí jako source='seed'
-- ═══════════════════════════════════════════════════════════════════════════
