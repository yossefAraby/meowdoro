
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qoquxgoqxkmqdvybqtox.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvcXV4Z29xeGttcWR2eWJxdG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NTI5NTYsImV4cCI6MjA2MTQyODk1Nn0.xLo_v2-svs9XvYuOoL-1zH9wGWHn80wlV2Je1j1eZa0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

// Using a more permissive type to allow working with tables not in the schema yet
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: localStorage
  }
}) as any; // Using 'any' temporarily until we update the schema
