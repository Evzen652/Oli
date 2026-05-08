-- Add question_text and correct_answer to session_logs
-- These are stored at check-time so parents can review what exactly the child answered.
alter table session_logs
  add column if not exists question_text text,
  add column if not exists correct_answer text;
