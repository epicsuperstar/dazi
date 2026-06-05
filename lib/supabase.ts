import { createClient } from '@supabase/supabase-js'

// The anon key is a public, RLS-protected key — it ships in the browser bundle
// by design. Env vars take priority; the fallbacks guarantee the production
// build works even if the host's environment variables aren't configured.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  'https://gjehbkluxheicvqhprtk.supabase.co'
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqZWhia2x1eGhlaWN2cWhwcnRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2MjU0OTIsImV4cCI6MjA5NjIwMTQ5Mn0.tN1lDHmVEYXrlXkItIzwUqkzBVCf7FtzsfPcDLLkx68'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          handle: string
          created_at: string
        }
        Insert: {
          id: string
          name: string
          handle: string
        }
      }
      posts: {
        Row: {
          id: string
          author_id: string
          activity: string
          location: string
          starts_at: string
          duration_min: number
          price: number | null
          cap: number | null
          status: string
          created_at: string
          author: { name: string; handle: string }
        }
        Insert: {
          id?: string
          author_id: string
          activity: string
          location: string
          starts_at: string
          duration_min: number
          price?: number | null
          cap?: number | null
        }
      }
      joins: {
        Row: {
          id: string
          post_id: string
          user_id: string
          joined_at: string
        }
        Insert: {
          post_id: string
          user_id: string
        }
      }
    }
  }
}
