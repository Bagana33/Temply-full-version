export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'USER' | 'CREATOR' | 'ADMIN'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role: 'USER' | 'CREATOR' | 'ADMIN'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'USER' | 'CREATOR' | 'ADMIN'
          created_at?: string
          updated_at?: string
        }
      }
      templates: {
        Row: {
          id: string
          title: string
          description: string
          price: number
          thumbnail_url: string
          canva_link: string
          category: string
          tags: string[]
          status: 'PENDING' | 'APPROVED' | 'REJECTED'
          creator_id: string
          downloads_count: number
          views_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          price: number
          thumbnail_url: string
          canva_link: string
          category: string
          tags: string[]
          status?: 'PENDING' | 'APPROVED' | 'REJECTED'
          creator_id: string
          downloads_count?: number
          views_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          price?: number
          thumbnail_url?: string
          canva_link?: string
          category?: string
          tags?: string[]
          status?: 'PENDING' | 'APPROVED' | 'REJECTED'
          creator_id?: string
          downloads_count?: number
          views_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      purchases: {
        Row: {
          id: string
          user_id: string
          template_id: string
          amount: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          template_id: string
          amount: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          template_id?: string
          amount?: number
          created_at?: string
        }
      }
      downloads: {
        Row: {
          id: string
          user_id: string
          template_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          template_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          template_id?: string
          created_at?: string
        }
      }
      membership: {
        Row: {
          id: string
          user_id: string
          plan: 'BASIC' | 'PRO' | 'PREMIUM'
          status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED'
          start_date: string
          end_date: string
        }
        Insert: {
          id?: string
          user_id: string
          plan: 'BASIC' | 'PRO' | 'PREMIUM'
          status?: 'ACTIVE' | 'CANCELLED' | 'EXPIRED'
          start_date: string
          end_date: string
        }
        Update: {
          id?: string
          user_id?: string
          plan?: 'BASIC' | 'PRO' | 'PREMIUM'
          status?: 'ACTIVE' | 'CANCELLED' | 'EXPIRED'
          start_date?: string
          end_date?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          template_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          template_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          template_id?: string
          created_at?: string
        }
      }
      payouts: {
        Row: {
          id: string
          creator_id: string
          amount: number
          status: 'PENDING' | 'PAID' | 'REJECTED'
          method: string
          details: string
          created_at: string
          paid_at?: string
        }
        Insert: {
          id?: string
          creator_id: string
          amount: number
          status?: 'PENDING' | 'PAID' | 'REJECTED'
          method: string
          details: string
          created_at?: string
          paid_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          amount?: number
          status?: 'PENDING' | 'PAID' | 'REJECTED'
          method?: string
          details?: string
          created_at?: string
          paid_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          template_id: string
          rating: number
          comment: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          template_id: string
          rating: number
          comment: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          template_id?: string
          rating?: number
          comment?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}