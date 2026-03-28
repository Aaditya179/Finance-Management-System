import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://myftvviplvkkloehljyx.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_eO5EXLNXQxq5_Z3dC_KGqA_-Wgi41xd'

// Export a supabase client that the user can hook into their actual project settings
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
