-- Make sure the types.ts file is updated by adding an explicit publication
-- Ensure realtime is enabled for party tables
ALTER TABLE public.study_parties REPLICA IDENTITY FULL;
ALTER TABLE public.party_members REPLICA IDENTITY FULL;
ALTER TABLE public.party_tasks REPLICA IDENTITY FULL;

-- Add tables to realtime publication
BEGIN;
  -- Drop from publication if already exists to prevent errors
  ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.study_parties;
  ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.party_members;
  ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.party_tasks;
  
  -- Add to publication
  ALTER PUBLICATION supabase_realtime ADD TABLE public.study_parties;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.party_members;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.party_tasks;
COMMIT;
