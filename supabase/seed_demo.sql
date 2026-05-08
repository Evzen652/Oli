-- ============================================================
-- DEMO SEED — spusť v Supabase SQL Editoru
-- Demo rodič:  demo@oli.app       / Demo123demo  → UUID: f0b2bf8b-39f1-4d12-a47b-46691d8472a9
-- Demo dítě:   demo-child@oli.app / Demo123demo  → UUID: 705f7c4a-9f32-4efb-9c55-e8043f0ede5e
-- Demo child row UUID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
-- ============================================================

-- ── Vyčistit staré demo záznamy (idempotentní) ───────────────
DELETE FROM skill_profiles     WHERE child_id  = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
DELETE FROM session_logs       WHERE child_id  = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
DELETE FROM parent_assignments WHERE child_id  = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
DELETE FROM children           WHERE id        = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
DELETE FROM user_roles         WHERE user_id   = 'f0b2bf8b-39f1-4d12-a47b-46691d8472a9';
DELETE FROM user_roles         WHERE user_id   = '705f7c4a-9f32-4efb-9c55-e8043f0ede5e';
DELETE FROM profiles           WHERE id        = 'f0b2bf8b-39f1-4d12-a47b-46691d8472a9';

-- ── Profil rodiče ────────────────────────────────────────────
INSERT INTO profiles (id, user_id, display_name, locale)
VALUES ('f0b2bf8b-39f1-4d12-a47b-46691d8472a9', 'f0b2bf8b-39f1-4d12-a47b-46691d8472a9', 'Demo rodič', 'cs');

-- ── Role: parent + child ─────────────────────────────────────
INSERT INTO user_roles (user_id, role)
VALUES ('f0b2bf8b-39f1-4d12-a47b-46691d8472a9', 'parent');
INSERT INTO user_roles (user_id, role)
VALUES ('705f7c4a-9f32-4efb-9c55-e8043f0ede5e', 'child');

-- ── Dítě Tomáš, 3. třída — spárovaný s demo-child účtem ──────
INSERT INTO children (id, parent_user_id, child_name, grade, pairing_code, pairing_code_expires_at, is_paired, child_user_id)
VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'f0b2bf8b-39f1-4d12-a47b-46691d8472a9', 'Tomáš', 3, 'DEMO0000', '2035-01-01', true, '705f7c4a-9f32-4efb-9c55-e8043f0ede5e');

-- ── Splněné úkoly ────────────────────────────────────────────
INSERT INTO parent_assignments (child_id, parent_user_id, skill_id, status, assigned_date) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'f0b2bf8b-39f1-4d12-a47b-46691d8472a9', 'math-add-sub-100',       'completed', NOW() - INTERVAL '14 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'f0b2bf8b-39f1-4d12-a47b-46691d8472a9', 'cz-vyjmenovana-slova-b', 'completed', NOW() - INTERVAL '10 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'f0b2bf8b-39f1-4d12-a47b-46691d8472a9', 'pr-animals',             'completed', NOW() - INTERVAL '7 days');

-- ── Zadané úkoly ─────────────────────────────────────────────
INSERT INTO parent_assignments (child_id, parent_user_id, skill_id, status, assigned_date, due_date) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'f0b2bf8b-39f1-4d12-a47b-46691d8472a9', 'math-multiply',          'pending', NOW() - INTERVAL '3 days', NOW() + INTERVAL '4 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'f0b2bf8b-39f1-4d12-a47b-46691d8472a9', 'cz-vyjmenovana-slova-l', 'pending', NOW() - INTERVAL '2 days', NOW() + INTERVAL '5 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'f0b2bf8b-39f1-4d12-a47b-46691d8472a9', 'pr-plant-parts',         'pending', NOW() - INTERVAL '1 day',  NOW() + INTERVAL '6 days');

-- ── Session logy — math-add-sub-100 ──────────────────────────
INSERT INTO session_logs (session_id, skill_id, correct, help_used, child_id, user_id, level, created_at) VALUES
  ('b1b2b3b4-0001-0000-0000-000000000001','math-add-sub-100',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '14 days'),
  ('b1b2b3b4-0001-0000-0000-000000000001','math-add-sub-100',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '14 days'+INTERVAL '1 min'),
  ('b1b2b3b4-0001-0000-0000-000000000001','math-add-sub-100',false,false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '14 days'+INTERVAL '2 min'),
  ('b1b2b3b4-0001-0000-0000-000000000001','math-add-sub-100',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '13 days'),
  ('b1b2b3b4-0001-0000-0000-000000000001','math-add-sub-100',true, true, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '13 days'+INTERVAL '1 min'),
  ('b1b2b3b4-0001-0000-0000-000000000001','math-add-sub-100',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '12 days'),
  ('b1b2b3b4-0001-0000-0000-000000000001','math-add-sub-100',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '12 days'+INTERVAL '1 min'),
  ('b1b2b3b4-0001-0000-0000-000000000001','math-add-sub-100',false,false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '12 days'+INTERVAL '2 min'),
  ('b1b2b3b4-0001-0000-0000-000000000001','math-add-sub-100',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '11 days'),
  ('b1b2b3b4-0001-0000-0000-000000000001','math-add-sub-100',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '11 days'+INTERVAL '1 min'),
  ('b1b2b3b4-0001-0000-0000-000000000001','math-add-sub-100',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '11 days'+INTERVAL '2 min'),
  ('b1b2b3b4-0001-0000-0000-000000000001','math-add-sub-100',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '11 days'+INTERVAL '3 min');

-- ── Session logy — cz-vyjmenovana-slova-b ────────────────────
INSERT INTO session_logs (session_id, skill_id, correct, help_used, child_id, user_id, level, created_at) VALUES
  ('b1b2b3b4-0002-0000-0000-000000000002','cz-vyjmenovana-slova-b',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '10 days'),
  ('b1b2b3b4-0002-0000-0000-000000000002','cz-vyjmenovana-slova-b',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '10 days'+INTERVAL '1 min'),
  ('b1b2b3b4-0002-0000-0000-000000000002','cz-vyjmenovana-slova-b',false,false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '10 days'+INTERVAL '2 min'),
  ('b1b2b3b4-0002-0000-0000-000000000002','cz-vyjmenovana-slova-b',true, true, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '9 days'),
  ('b1b2b3b4-0002-0000-0000-000000000002','cz-vyjmenovana-slova-b',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '9 days'+INTERVAL '1 min'),
  ('b1b2b3b4-0002-0000-0000-000000000002','cz-vyjmenovana-slova-b',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '8 days'),
  ('b1b2b3b4-0002-0000-0000-000000000002','cz-vyjmenovana-slova-b',false,false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '8 days'+INTERVAL '1 min'),
  ('b1b2b3b4-0002-0000-0000-000000000002','cz-vyjmenovana-slova-b',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '8 days'+INTERVAL '2 min'),
  ('b1b2b3b4-0002-0000-0000-000000000002','cz-vyjmenovana-slova-b',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '7 days'),
  ('b1b2b3b4-0002-0000-0000-000000000002','cz-vyjmenovana-slova-b',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '7 days'+INTERVAL '1 min');

-- ── Session logy — pr-animals ─────────────────────────────────
INSERT INTO session_logs (session_id, skill_id, correct, help_used, child_id, user_id, level, created_at) VALUES
  ('b1b2b3b4-0003-0000-0000-000000000003','pr-animals',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '7 days'),
  ('b1b2b3b4-0003-0000-0000-000000000003','pr-animals',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '7 days'+INTERVAL '2 min'),
  ('b1b2b3b4-0003-0000-0000-000000000003','pr-animals',true, true, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '6 days'),
  ('b1b2b3b4-0003-0000-0000-000000000003','pr-animals',false,false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '6 days'+INTERVAL '1 min'),
  ('b1b2b3b4-0003-0000-0000-000000000003','pr-animals',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '5 days'),
  ('b1b2b3b4-0003-0000-0000-000000000003','pr-animals',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '5 days'+INTERVAL '1 min'),
  ('b1b2b3b4-0003-0000-0000-000000000003','pr-animals',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '4 days'),
  ('b1b2b3b4-0003-0000-0000-000000000003','pr-animals',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '4 days'+INTERVAL '1 min');

-- ── Session logy — math-multiply ─────────────────────────────
INSERT INTO session_logs (session_id, skill_id, correct, help_used, child_id, user_id, level, created_at) VALUES
  ('b1b2b3b4-0004-0000-0000-000000000004','math-multiply',false,false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '3 days'),
  ('b1b2b3b4-0004-0000-0000-000000000004','math-multiply',true, true, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '3 days'+INTERVAL '1 min'),
  ('b1b2b3b4-0004-0000-0000-000000000004','math-multiply',false,false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '3 days'+INTERVAL '2 min'),
  ('b1b2b3b4-0004-0000-0000-000000000004','math-multiply',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '2 days'),
  ('b1b2b3b4-0004-0000-0000-000000000004','math-multiply',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '2 days'+INTERVAL '1 min'),
  ('b1b2b3b4-0004-0000-0000-000000000004','math-multiply',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '1 day');

-- ── Session logy — pr-seasons ─────────────────────────────────
INSERT INTO session_logs (session_id, skill_id, correct, help_used, child_id, user_id, level, created_at) VALUES
  ('b1b2b3b4-0005-0000-0000-000000000005','pr-seasons',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '2 days'),
  ('b1b2b3b4-0005-0000-0000-000000000005','pr-seasons',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '2 days'+INTERVAL '1 min'),
  ('b1b2b3b4-0005-0000-0000-000000000005','pr-seasons',false,true, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '1 day'),
  ('b1b2b3b4-0005-0000-0000-000000000005','pr-seasons',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '1 day'+INTERVAL '1 min'),
  ('b1b2b3b4-0005-0000-0000-000000000005','pr-seasons',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','f0b2bf8b-39f1-4d12-a47b-46691d8472a9',1, NOW()-INTERVAL '1 day'+INTERVAL '2 min');

-- ── Session logy — math-rounding (samostatné) ───────────────
INSERT INTO session_logs (session_id, skill_id, correct, help_used, child_id, user_id, level, created_at) VALUES
  ('b1b2b3b4-0006-0000-0000-000000000006','math-rounding',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '5 days'),
  ('b1b2b3b4-0006-0000-0000-000000000006','math-rounding',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '5 days'+INTERVAL '1 min'),
  ('b1b2b3b4-0006-0000-0000-000000000006','math-rounding',false,true, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '5 days'+INTERVAL '2 min'),
  ('b1b2b3b4-0006-0000-0000-000000000006','math-rounding',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '5 days'+INTERVAL '3 min'),
  ('b1b2b3b4-0006-0000-0000-000000000006','math-rounding',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '5 days'+INTERVAL '4 min'),
  ('b1b2b3b4-0006-0000-0000-000000000006','math-rounding',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '5 days'+INTERVAL '5 min');

-- ── Session logy — math-compare-natural-numbers-100 (samostatné) ──
INSERT INTO session_logs (session_id, skill_id, correct, help_used, child_id, user_id, level, created_at) VALUES
  ('b1b2b3b4-0007-0000-0000-000000000007','math-compare-natural-numbers-100',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '3 days'),
  ('b1b2b3b4-0007-0000-0000-000000000007','math-compare-natural-numbers-100',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '3 days'+INTERVAL '1 min'),
  ('b1b2b3b4-0007-0000-0000-000000000007','math-compare-natural-numbers-100',true, true, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '3 days'+INTERVAL '2 min'),
  ('b1b2b3b4-0007-0000-0000-000000000007','math-compare-natural-numbers-100',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '3 days'+INTERVAL '3 min'),
  ('b1b2b3b4-0007-0000-0000-000000000007','math-compare-natural-numbers-100',false,false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '3 days'+INTERVAL '4 min'),
  ('b1b2b3b4-0007-0000-0000-000000000007','math-compare-natural-numbers-100',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '3 days'+INTERVAL '5 min');

-- ── Session logy — cz-tvrde-mekke (samostatné) ───────────────
INSERT INTO session_logs (session_id, skill_id, correct, help_used, child_id, user_id, level, created_at) VALUES
  ('b1b2b3b4-0008-0000-0000-000000000008','cz-tvrde-mekke',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '6 days'),
  ('b1b2b3b4-0008-0000-0000-000000000008','cz-tvrde-mekke',false,true, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '6 days'+INTERVAL '1 min'),
  ('b1b2b3b4-0008-0000-0000-000000000008','cz-tvrde-mekke',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '6 days'+INTERVAL '2 min'),
  ('b1b2b3b4-0008-0000-0000-000000000008','cz-tvrde-mekke',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '6 days'+INTERVAL '3 min'),
  ('b1b2b3b4-0008-0000-0000-000000000008','cz-tvrde-mekke',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '6 days'+INTERVAL '4 min'),
  ('b1b2b3b4-0008-0000-0000-000000000008','cz-tvrde-mekke',false,false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '6 days'+INTERVAL '5 min');

-- ── Session logy — cz-velka-pismena (samostatné) ─────────────
INSERT INTO session_logs (session_id, skill_id, correct, help_used, child_id, user_id, level, created_at) VALUES
  ('b1b2b3b4-0009-0000-0000-000000000009','cz-velka-pismena',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '4 days'),
  ('b1b2b3b4-0009-0000-0000-000000000009','cz-velka-pismena',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '4 days'+INTERVAL '1 min'),
  ('b1b2b3b4-0009-0000-0000-000000000009','cz-velka-pismena',true, true, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '4 days'+INTERVAL '2 min'),
  ('b1b2b3b4-0009-0000-0000-000000000009','cz-velka-pismena',false,false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '4 days'+INTERVAL '3 min'),
  ('b1b2b3b4-0009-0000-0000-000000000009','cz-velka-pismena',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '4 days'+INTERVAL '4 min'),
  ('b1b2b3b4-0009-0000-0000-000000000009','cz-velka-pismena',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '4 days'+INTERVAL '5 min');

-- ── Session logy — pr-body-parts (samostatné) ────────────────
INSERT INTO session_logs (session_id, skill_id, correct, help_used, child_id, user_id, level, created_at) VALUES
  ('b1b2b3b4-0010-0000-0000-000000000010','pr-body-parts',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '8 days'),
  ('b1b2b3b4-0010-0000-0000-000000000010','pr-body-parts',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '8 days'+INTERVAL '1 min'),
  ('b1b2b3b4-0010-0000-0000-000000000010','pr-body-parts',true, true, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '8 days'+INTERVAL '2 min'),
  ('b1b2b3b4-0010-0000-0000-000000000010','pr-body-parts',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '8 days'+INTERVAL '3 min'),
  ('b1b2b3b4-0010-0000-0000-000000000010','pr-body-parts',false,false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '8 days'+INTERVAL '4 min'),
  ('b1b2b3b4-0010-0000-0000-000000000010','pr-body-parts',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '8 days'+INTERVAL '5 min');

-- ── Skill profiles ────────────────────────────────────────────
INSERT INTO skill_profiles (user_id, child_id, skill_id, mastery_score, attempts_total, correct_total, error_streak, success_streak, last_practiced_at, weak_pattern_flags) VALUES
  ('f0b2bf8b-39f1-4d12-a47b-46691d8472a9','a1b2c3d4-e5f6-7890-abcd-ef1234567890','math-add-sub-100',               0.83,12,10,0,3, NOW()-INTERVAL '11 days','{}'),
  ('f0b2bf8b-39f1-4d12-a47b-46691d8472a9','a1b2c3d4-e5f6-7890-abcd-ef1234567890','cz-vyjmenovana-slova-b',         0.80,10, 8,0,4, NOW()-INTERVAL '7 days', '{}'),
  ('f0b2bf8b-39f1-4d12-a47b-46691d8472a9','a1b2c3d4-e5f6-7890-abcd-ef1234567890','pr-animals',                     0.88, 8, 7,0,5, NOW()-INTERVAL '4 days', '{}'),
  ('f0b2bf8b-39f1-4d12-a47b-46691d8472a9','a1b2c3d4-e5f6-7890-abcd-ef1234567890','math-multiply',                  0.67, 6, 4,0,2, NOW()-INTERVAL '1 day',  '{}'),
  ('f0b2bf8b-39f1-4d12-a47b-46691d8472a9','a1b2c3d4-e5f6-7890-abcd-ef1234567890','pr-seasons',                     0.80, 5, 4,0,2, NOW()-INTERVAL '1 day',  '{}'),
  ('705f7c4a-9f32-4efb-9c55-e8043f0ede5e','a1b2c3d4-e5f6-7890-abcd-ef1234567890','math-rounding',                  0.83, 6, 5,0,4, NOW()-INTERVAL '5 days', '{}'),
  ('705f7c4a-9f32-4efb-9c55-e8043f0ede5e','a1b2c3d4-e5f6-7890-abcd-ef1234567890','math-compare-natural-numbers-100',0.83, 6, 5,0,3, NOW()-INTERVAL '3 days', '{}'),
  ('705f7c4a-9f32-4efb-9c55-e8043f0ede5e','a1b2c3d4-e5f6-7890-abcd-ef1234567890','cz-tvrde-mekke',                 0.67, 6, 4,1,0, NOW()-INTERVAL '6 days', '{}'),
  ('705f7c4a-9f32-4efb-9c55-e8043f0ede5e','a1b2c3d4-e5f6-7890-abcd-ef1234567890','cz-velka-pismena',               0.83, 6, 5,0,3, NOW()-INTERVAL '4 days', '{}'),
  ('705f7c4a-9f32-4efb-9c55-e8043f0ede5e','a1b2c3d4-e5f6-7890-abcd-ef1234567890','pr-body-parts',                  0.83, 6, 5,0,4, NOW()-INTERVAL '8 days', '{}'),
  ('705f7c4a-9f32-4efb-9c55-e8043f0ede5e','a1b2c3d4-e5f6-7890-abcd-ef1234567890','pr-seasons',                     0.80, 5, 4,0,2, NOW()-INTERVAL '1 day',  '{}');
