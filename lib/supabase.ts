import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE!

if (!supabaseUrl || !supabaseServiceRole) {
  throw new Error('Missing Supabase environment variables')
}

// Server-only client with service role key
// This bypasses RLS and should only be used in server components and API routes
export const supabase = createClient(supabaseUrl, supabaseServiceRole, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Database types
export interface Database {
  public: {
    Tables: {
      quizzes: {
        Row: {
          id: string
          slug: string
          title: string
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      results: {
        Row: {
          id: string
          quiz_id: string
          key: string
          name: string
          headline: string | null
          description: string | null
          email_subject: string | null
          email_html: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          quiz_id: string
          key: string
          name: string
          headline?: string | null
          description?: string | null
          email_subject?: string | null
          email_html?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          quiz_id?: string
          key?: string
          name?: string
          headline?: string | null
          description?: string | null
          email_subject?: string | null
          email_html?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          quiz_id: string
          position: number
          title: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          quiz_id: string
          position: number
          title: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          quiz_id?: string
          position?: number
          title?: string
          created_at?: string
          updated_at?: string
        }
      }
      options: {
        Row: {
          id: string
          question_id: string
          label: string
          text: string
          result_key: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          question_id: string
          label: string
          text: string
          result_key: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          question_id?: string
          label?: string
          text?: string
          result_key?: string
          created_at?: string
          updated_at?: string
        }
      }
      submissions: {
        Row: {
          id: string
          quiz_id: string | null
          email: string
          result_key: string
          consent: boolean
          consent_ts: string | null
          ip_hash: string | null
          user_agent: string | null
          referrer: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          quiz_id?: string | null
          email: string
          result_key: string
          consent?: boolean
          consent_ts?: string | null
          ip_hash?: string | null
          user_agent?: string | null
          referrer?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          quiz_id?: string | null
          email?: string
          result_key?: string
          consent?: boolean
          consent_ts?: string | null
          ip_hash?: string | null
          user_agent?: string | null
          referrer?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      answers: {
        Row: {
          id: string
          submission_id: string
          question_id: string
          selected_label: string
          created_at: string
        }
        Insert: {
          id?: string
          submission_id: string
          question_id: string
          selected_label: string
          created_at?: string
        }
        Update: {
          id?: string
          submission_id?: string
          question_id?: string
          selected_label?: string
          created_at?: string
        }
      }
    }
  }
}
