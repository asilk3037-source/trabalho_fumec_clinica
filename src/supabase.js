import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://fptorrscuevjqekmvtlc.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwdG9ycnNjdWV2anFla212dGxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNTEwNjgsImV4cCI6MjA5NjYyNzA2OH0.4EdMPLfviRNLkgNFM-VpR0kp8vH0CkBJ49Vg9fHEHHc'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)