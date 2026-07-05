import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

const SUPABASE_URL = "https://tgiedzllcimqpgudoekk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnaWVkemxsY2ltcXBndWRvZWtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxOTc0NjAsImV4cCI6MjA5ODc3MzQ2MH0.KpCge0eiNEnzUkJ8HjGIeLUP2VZYyDTOzonqTApN5Dw";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
