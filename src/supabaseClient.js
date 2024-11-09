import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kvocbwkzlwfnyyxxbmmy.supabase.co';  // URL do seu projeto
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2b2Nid2t6bHdmbnl5eHhibW15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzExODQ3NDQsImV4cCI6MjA0Njc2MDc0NH0.swp5AntenGjFwawtC-xU1dQb2pqQiEJFLmSrYIjSybI';      // Chave anon/public

export const supabase = createClient(supabaseUrl, supabaseKey);