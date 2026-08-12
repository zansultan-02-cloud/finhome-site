import { createClient } from '@supabase/supabase-js'

// Publishable/anon key — предназначен для использования в браузере, доступ
// на запись ограничен политиками RLS на стороне Supabase.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://icwdeezlezbbymemyhoa.supabase.co'
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_OXVrggCLcg4tqRSbl6cMfA_X7WY2c6Q'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
