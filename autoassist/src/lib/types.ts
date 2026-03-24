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
      workshops: {
        Row: {
          id: string
          owner_id: string
          name: string
          email: string | null
          phone: string | null
          address: string | null
          subscription_plan: 'starter' | 'professional' | 'enterprise'
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          subscription_plan?: 'starter' | 'professional' | 'enterprise'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          subscription_plan?: 'starter' | 'professional' | 'enterprise'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          workshop_id: string
          name: string
          email: string | null
          phone: string
          address: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workshop_id: string
          name: string
          email?: string | null
          phone: string
          address?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workshop_id?: string
          name?: string
          email?: string | null
          phone?: string
          address?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vehicles: {
        Row: {
          id: string
          customer_id: string
          make: string
          model: string
          year: number
          license_plate: string
          vin: string | null
          color: string | null
          current_mileage: number | null
          next_maintenance_km: number | null
          next_maintenance_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          make: string
          model: string
          year: number
          license_plate: string
          vin?: string | null
          color?: string | null
          current_mileage?: number | null
          next_maintenance_km?: number | null
          next_maintenance_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          make?: string
          model?: string
          year?: number
          license_plate?: string
          vin?: string | null
          color?: string | null
          current_mileage?: number | null
          next_maintenance_km?: number | null
          next_maintenance_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          vehicle_id: string
          service_type: string
          description: string
          cost: number
          date: string
          mileage: number | null
          parts_used: string[] | null
          technician_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vehicle_id: string
          service_type: string
          description: string
          cost: number
          date: string
          mileage?: number | null
          parts_used?: string[] | null
          technician_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vehicle_id?: string
          service_type?: string
          description?: string
          cost?: number
          date?: string
          mileage?: number | null
          parts_used?: string[] | null
          technician_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      quotes: {
        Row: {
          id: string
          vehicle_id: string
          content: string
          total_amount: number
          pdf_url: string | null
          status: 'draft' | 'sent' | 'accepted' | 'rejected'
          valid_until: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vehicle_id: string
          content: string
          total_amount: number
          pdf_url?: string | null
          status?: 'draft' | 'sent' | 'accepted' | 'rejected'
          valid_until?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vehicle_id?: string
          content?: string
          total_amount?: number
          pdf_url?: string | null
          status?: 'draft' | 'sent' | 'accepted' | 'rejected'
          valid_until?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      reminders: {
        Row: {
          id: string
          vehicle_id: string
          reminder_type: string
          sent_at: string
          sent_via: string | null
          status: string | null
        }
        Insert: {
          id?: string
          vehicle_id: string
          reminder_type: string
          sent_at?: string
          sent_via?: string | null
          status?: string | null
        }
        Update: {
          id?: string
          vehicle_id?: string
          reminder_type?: string
          sent_at?: string
          sent_via?: string | null
          status?: string | null
        }
      }
    }
  }
}
