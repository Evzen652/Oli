-- student_skill_level
-- Ukládá aktuální difficulty level žáka per téma.
-- Adaptuje se mezi sezeními na základě sessionScore.

CREATE TABLE student_skill_level (
  student_id          uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id            text        NOT NULL,  -- TopicMetadata.id
  level               integer     NOT NULL DEFAULT 1 CHECK (level BETWEEN 1 AND 3),
  sessions_at_level   integer     NOT NULL DEFAULT 0,
  last_score          numeric(4,3),          -- poslední sessionScore (0–1)
  consecutive_good    integer     NOT NULL DEFAULT 0, -- po sobě jdoucí sezení score >= 0.8
  consecutive_bad     integer     NOT NULL DEFAULT 0, -- po sobě jdoucí sezení score <= 0.4
  updated_at          timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (student_id, topic_id)
);

-- RLS: žák vidí jen svoje záznamy
ALTER TABLE student_skill_level ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own rows"
  ON student_skill_level
  USING (student_id = auth.uid());

-- Index pro rychlé dotazy rodiče na celé dítě
CREATE INDEX student_skill_level_student_idx
  ON student_skill_level (student_id);
