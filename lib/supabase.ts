import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
