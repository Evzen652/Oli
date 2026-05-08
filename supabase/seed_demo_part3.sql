-- ============================================================
-- DEMO SEED PART 3 — samostatné procvičování (nové záznamy)
-- Spusť SAMOSTATNĚ po části 1+2, nebo po celém seed_demo.sql
-- ============================================================

-- Vyčistit staré záznamy pro tyto skills (idempotentní)
DELETE FROM skill_profiles
  WHERE child_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
    AND skill_id IN ('math-rounding','math-compare-natural-numbers-100','cz-tvrde-mekke','cz-velka-pismena','pr-body-parts','pr-seasons');

DELETE FROM session_logs
  WHERE child_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
    AND session_id IN (
      'b1b2b3b4-0005-0000-0000-000000000005',
      'b1b2b3b4-0006-0000-0000-000000000006',
      'b1b2b3b4-0007-0000-0000-000000000007',
      'b1b2b3b4-0008-0000-0000-000000000008',
      'b1b2b3b4-0009-0000-0000-000000000009',
      'b1b2b3b4-0010-0000-0000-000000000010'
    );

-- ── pr-seasons ────────────────────────────────────────────────
INSERT INTO session_logs (session_id, skill_id, correct, help_used, child_id, user_id, level, created_at) VALUES
  ('b1b2b3b4-0005-0000-0000-000000000005','pr-seasons',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '2 days'),
  ('b1b2b3b4-0005-0000-0000-000000000005','pr-seasons',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '2 days'+INTERVAL '1 min'),
  ('b1b2b3b4-0005-0000-0000-000000000005','pr-seasons',false,true, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '1 day'),
  ('b1b2b3b4-0005-0000-0000-000000000005','pr-seasons',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '1 day'+INTERVAL '1 min'),
  ('b1b2b3b4-0005-0000-0000-000000000005','pr-seasons',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '1 day'+INTERVAL '2 min');

-- ── math-rounding ─────────────────────────────────────────────
INSERT INTO session_logs (session_id, skill_id, correct, help_used, child_id, user_id, level, created_at) VALUES
  ('b1b2b3b4-0006-0000-0000-000000000006','math-rounding',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '5 days'),
  ('b1b2b3b4-0006-0000-0000-000000000006','math-rounding',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '5 days'+INTERVAL '1 min'),
  ('b1b2b3b4-0006-0000-0000-000000000006','math-rounding',false,true, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '5 days'+INTERVAL '2 min'),
  ('b1b2b3b4-0006-0000-0000-000000000006','math-rounding',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '5 days'+INTERVAL '3 min'),
  ('b1b2b3b4-0006-0000-0000-000000000006','math-rounding',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '5 days'+INTERVAL '4 min'),
  ('b1b2b3b4-0006-0000-0000-000000000006','math-rounding',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '5 days'+INTERVAL '5 min');

-- ── math-compare-natural-numbers-100 ─────────────────────────
INSERT INTO session_logs (session_id, skill_id, correct, help_used, child_id, user_id, level, created_at) VALUES
  ('b1b2b3b4-0007-0000-0000-000000000007','math-compare-natural-numbers-100',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '3 days'),
  ('b1b2b3b4-0007-0000-0000-000000000007','math-compare-natural-numbers-100',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '3 days'+INTERVAL '1 min'),
  ('b1b2b3b4-0007-0000-0000-000000000007','math-compare-natural-numbers-100',true, true, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '3 days'+INTERVAL '2 min'),
  ('b1b2b3b4-0007-0000-0000-000000000007','math-compare-natural-numbers-100',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '3 days'+INTERVAL '3 min'),
  ('b1b2b3b4-0007-0000-0000-000000000007','math-compare-natural-numbers-100',false,false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '3 days'+INTERVAL '4 min'),
  ('b1b2b3b4-0007-0000-0000-000000000007','math-compare-natural-numbers-100',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '3 days'+INTERVAL '5 min');

-- ── cz-tvrde-mekke ────────────────────────────────────────────
INSERT INTO session_logs (session_id, skill_id, correct, help_used, child_id, user_id, level, created_at) VALUES
  ('b1b2b3b4-0008-0000-0000-000000000008','cz-tvrde-mekke',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '6 days'),
  ('b1b2b3b4-0008-0000-0000-000000000008','cz-tvrde-mekke',false,true, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '6 days'+INTERVAL '1 min'),
  ('b1b2b3b4-0008-0000-0000-000000000008','cz-tvrde-mekke',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '6 days'+INTERVAL '2 min'),
  ('b1b2b3b4-0008-0000-0000-000000000008','cz-tvrde-mekke',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '6 days'+INTERVAL '3 min'),
  ('b1b2b3b4-0008-0000-0000-000000000008','cz-tvrde-mekke',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '6 days'+INTERVAL '4 min'),
  ('b1b2b3b4-0008-0000-0000-000000000008','cz-tvrde-mekke',false,false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '6 days'+INTERVAL '5 min');

-- ── cz-velka-pismena ──────────────────────────────────────────
INSERT INTO session_logs (session_id, skill_id, correct, help_used, child_id, user_id, level, created_at) VALUES
  ('b1b2b3b4-0009-0000-0000-000000000009','cz-velka-pismena',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '4 days'),
  ('b1b2b3b4-0009-0000-0000-000000000009','cz-velka-pismena',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '4 days'+INTERVAL '1 min'),
  ('b1b2b3b4-0009-0000-0000-000000000009','cz-velka-pismena',true, true, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '4 days'+INTERVAL '2 min'),
  ('b1b2b3b4-0009-0000-0000-000000000009','cz-velka-pismena',false,false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '4 days'+INTERVAL '3 min'),
  ('b1b2b3b4-0009-0000-0000-000000000009','cz-velka-pismena',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '4 days'+INTERVAL '4 min'),
  ('b1b2b3b4-0009-0000-0000-000000000009','cz-velka-pismena',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '4 days'+INTERVAL '5 min');

-- ── pr-body-parts ─────────────────────────────────────────────
INSERT INTO session_logs (session_id, skill_id, correct, help_used, child_id, user_id, level, created_at) VALUES
  ('b1b2b3b4-0010-0000-0000-000000000010','pr-body-parts',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '8 days'),
  ('b1b2b3b4-0010-0000-0000-000000000010','pr-body-parts',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '8 days'+INTERVAL '1 min'),
  ('b1b2b3b4-0010-0000-0000-000000000010','pr-body-parts',true, true, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '8 days'+INTERVAL '2 min'),
  ('b1b2b3b4-0010-0000-0000-000000000010','pr-body-parts',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '8 days'+INTERVAL '3 min'),
  ('b1b2b3b4-0010-0000-0000-000000000010','pr-body-parts',false,false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '8 days'+INTERVAL '4 min'),
  ('b1b2b3b4-0010-0000-0000-000000000010','pr-body-parts',true, false,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','705f7c4a-9f32-4efb-9c55-e8043f0ede5e',1, NOW()-INTERVAL '8 days'+INTERVAL '5 min');

-- ── Skill profiles (samostatné) ───────────────────────────────
INSERT INTO skill_profiles (user_id, child_id, skill_id, mastery_score, attempts_total, correct_total, error_streak, success_streak, last_practiced_at, weak_pattern_flags) VALUES
  ('705f7c4a-9f32-4efb-9c55-e8043f0ede5e','a1b2c3d4-e5f6-7890-abcd-ef1234567890','math-rounding',                   0.83,6,5,0,4, NOW()-INTERVAL '5 days','{}'),
  ('705f7c4a-9f32-4efb-9c55-e8043f0ede5e','a1b2c3d4-e5f6-7890-abcd-ef1234567890','math-compare-natural-numbers-100', 0.83,6,5,0,3, NOW()-INTERVAL '3 days','{}'),
  ('705f7c4a-9f32-4efb-9c55-e8043f0ede5e','a1b2c3d4-e5f6-7890-abcd-ef1234567890','cz-tvrde-mekke',                  0.67,6,4,1,0, NOW()-INTERVAL '6 days','{}'),
  ('705f7c4a-9f32-4efb-9c55-e8043f0ede5e','a1b2c3d4-e5f6-7890-abcd-ef1234567890','cz-velka-pismena',                0.83,6,5,0,3, NOW()-INTERVAL '4 days','{}'),
  ('705f7c4a-9f32-4efb-9c55-e8043f0ede5e','a1b2c3d4-e5f6-7890-abcd-ef1234567890','pr-body-parts',                   0.83,6,5,0,4, NOW()-INTERVAL '8 days','{}'),
  ('705f7c4a-9f32-4efb-9c55-e8043f0ede5e','a1b2c3d4-e5f6-7890-abcd-ef1234567890','pr-seasons',                      0.80,5,4,0,2, NOW()-INTERVAL '1 day', '{}');
