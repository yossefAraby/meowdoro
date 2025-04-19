
-- Create table for party tasks
CREATE TABLE IF NOT EXISTS public.party_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  party_id UUID NOT NULL REFERENCES public.study_parties(id) ON DELETE CASCADE,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to party_tasks
ALTER TABLE public.party_tasks ENABLE ROW LEVEL SECURITY;

-- RLS policy to allow select for party members
CREATE POLICY "Party members can view tasks" 
  ON public.party_tasks 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM party_members 
      WHERE party_members.party_id = party_tasks.party_id 
      AND party_members.user_id = auth.uid()
    )
  );

-- RLS policy to allow insert for party members
CREATE POLICY "Party members can create tasks" 
  ON public.party_tasks 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM party_members 
      WHERE party_members.party_id = party_tasks.party_id 
      AND party_members.user_id = auth.uid()
    )
  );

-- RLS policy to allow update for party members
CREATE POLICY "Party members can update tasks" 
  ON public.party_tasks 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM party_members 
      WHERE party_members.party_id = party_tasks.party_id 
      AND party_members.user_id = auth.uid()
    )
  );

-- RLS policy to allow delete for party members
CREATE POLICY "Party members can delete tasks" 
  ON public.party_tasks 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM party_members 
      WHERE party_members.party_id = party_tasks.party_id 
      AND party_members.user_id = auth.uid()
    )
  );

-- Enable realtime for study_parties and party_members tables
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
