import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Project {
  id: string
  name: string
  email: string
  phone?: string        // <-- Add this!
  company?: string
  project_description: string
  files: any[]
  status: "new" | "reviewed" | "quoted" | "completed"
  created_at: string
  updated_at: string
}



export interface Contact {
  id: string
  name: string
  email: string
  message: string
  status: "new" | "responded" | "closed"
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  title: string
  subtitle?: string
  description: string
  features: string[]
  applications?: string
  icon?: string
  gradient?: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Application {
  id: string
  name: string
  email: string
  phone?: string
  message?: string
  files: ApplicationFile[]   // <— strongly typed now
  created_at: string
  updated_at: string
}


// One file entry inside applications.files
export interface ApplicationFile {
  name: string
  size: number
  type: string
  path: string   // storage object path, e.g. "apps/uuid_...pdf"
}


export interface CareerListing {
  // New interface for career listings managed from admin
  id: string
  title: string
  type: "job" | "internship"
  location: string
  description: string
  requirements: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}
