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
      listing: {
        Row: {
          address: string
          category: number
          city: string
          country: string
          creation_date: string
          daily_price: unknown
          description: string
          fk_manager: number
          id: number
          number_of_seats: number
          photos: string
          suspension_status: boolean
          title: string
        }
        Insert: {
          address: string
          category: number
          city: string
          country: string
          creation_date: string
          daily_price: unknown
          description: string
          fk_manager: number
          id: number
          number_of_seats: number
          photos: string
          suspension_status: boolean
          title: string
        }
        Update: {
          address?: string
          category?: number
          city?: string
          country?: string
          creation_date?: string
          daily_price?: unknown
          description?: string
          fk_manager?: number
          id?: number
          number_of_seats?: number
          photos?: string
          suspension_status?: boolean
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_manager"
            columns: ["fk_manager"]
            isOneToOne: false
            referencedRelation: "manager"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "listing_category"
            referencedColumns: ["id"]
          }
        ]
      }
      listing_category: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      manager: {
        Row: {
          bank_account: string
          id: number
          personal_code: string
        }
        Insert: {
          bank_account: string
          id: number
          personal_code: string
        }
        Update: {
          bank_account?: string
          id?: number
          personal_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      message: {
        Row: {
          fk_receiver: number
          fk_reservation: number
          fk_sender: number
          id: number
          read_time: string | null
          received_time: string | null
          sent_time: string
          status: number
          text: string
        }
        Insert: {
          fk_receiver: number
          fk_reservation: number
          fk_sender: number
          id: number
          read_time?: string | null
          received_time?: string | null
          sent_time: string
          status: number
          text: string
        }
        Update: {
          fk_receiver?: number
          fk_reservation?: number
          fk_sender?: number
          id?: number
          read_time?: string | null
          received_time?: string | null
          sent_time?: string
          status?: number
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_receiver"
            columns: ["fk_receiver"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_reservation"
            columns: ["fk_reservation"]
            isOneToOne: false
            referencedRelation: "reservation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_sender"
            columns: ["fk_sender"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_status_fkey"
            columns: ["status"]
            isOneToOne: false
            referencedRelation: "message_status"
            referencedColumns: ["id"]
          }
        ]
      }
      message_status: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      notification: {
        Row: {
          fk_reservation: number
          id: number
          sent_time: string
          text: string
          title: string
        }
        Insert: {
          fk_reservation: number
          id: number
          sent_time: string
          text: string
          title: string
        }
        Update: {
          fk_reservation?: number
          id?: number
          sent_time?: string
          text?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_reservation"
            columns: ["fk_reservation"]
            isOneToOne: false
            referencedRelation: "reservation"
            referencedColumns: ["id"]
          }
        ]
      }
      ordered_service: {
        Row: {
          fk_reservation: number
          fk_service: number
          id: number
        }
        Insert: {
          fk_reservation: number
          fk_service: number
          id: number
        }
        Update: {
          fk_reservation?: number
          fk_service?: number
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_reservation"
            columns: ["fk_reservation"]
            isOneToOne: false
            referencedRelation: "reservation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_service"
            columns: ["fk_service"]
            isOneToOne: true
            referencedRelation: "service"
            referencedColumns: ["id"]
          }
        ]
      }
      payment: {
        Row: {
          amount: unknown
          date: string
          first_name: string
          fk_reservation: number
          id: number
          last_name: string
          payer_email: string
          payment_method: string
          payment_number: string
          status: number
        }
        Insert: {
          amount: unknown
          date: string
          first_name: string
          fk_reservation: number
          id: number
          last_name: string
          payer_email: string
          payment_method: string
          payment_number: string
          status: number
        }
        Update: {
          amount?: unknown
          date?: string
          first_name?: string
          fk_reservation?: number
          id?: number
          last_name?: string
          payer_email?: string
          payment_method?: string
          payment_number?: string
          status?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_reservation"
            columns: ["fk_reservation"]
            isOneToOne: true
            referencedRelation: "reservation"
            referencedColumns: ["id"]
          }
        ]
      }
      photo: {
        Row: {
          fk_listing: number
          id: number
          url: string
        }
        Insert: {
          fk_listing: number
          id: number
          url: string
        }
        Update: {
          fk_listing?: number
          id?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_listing"
            columns: ["fk_listing"]
            isOneToOne: false
            referencedRelation: "listing"
            referencedColumns: ["id"]
          }
        ]
      }
      report: {
        Row: {
          creation_date: string
          end_date: string
          file_url: string
          fk_listing: number
          fk_manager: number
          id: number
          start_date: string
          title: string
        }
        Insert: {
          creation_date: string
          end_date: string
          file_url: string
          fk_listing: number
          fk_manager: number
          id: number
          start_date: string
          title: string
        }
        Update: {
          creation_date?: string
          end_date?: string
          file_url?: string
          fk_listing?: number
          fk_manager?: number
          id?: number
          start_date?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_listing"
            columns: ["fk_listing"]
            isOneToOne: false
            referencedRelation: "listing"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_manager"
            columns: ["fk_manager"]
            isOneToOne: false
            referencedRelation: "manager"
            referencedColumns: ["id"]
          }
        ]
      }
      reservation: {
        Row: {
          creation_date: string
          end_date: string
          fk_listing: number
          fk_user: number
          id: number
          start_date: string
          status: number
          total_price: unknown
        }
        Insert: {
          creation_date: string
          end_date: string
          fk_listing: number
          fk_user: number
          id: number
          start_date: string
          status: number
          total_price: unknown
        }
        Update: {
          creation_date?: string
          end_date?: string
          fk_listing?: number
          fk_user?: number
          id?: number
          start_date?: string
          status?: number
          total_price?: unknown
        }
        Relationships: [
          {
            foreignKeyName: "fk_listing"
            columns: ["fk_listing"]
            isOneToOne: false
            referencedRelation: "listing"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user"
            columns: ["fk_user"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservation_status_fkey"
            columns: ["status"]
            isOneToOne: false
            referencedRelation: "reservation_status"
            referencedColumns: ["id"]
          }
        ]
      }
      reservation_status: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      service: {
        Row: {
          description: string
          fk_listing: number
          id: number
          price: unknown
          title: string
        }
        Insert: {
          description: string
          fk_listing: number
          id: number
          price: unknown
          title: string
        }
        Update: {
          description?: string
          fk_listing?: number
          id?: number
          price?: unknown
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_listing"
            columns: ["fk_listing"]
            isOneToOne: false
            referencedRelation: "listing"
            referencedColumns: ["id"]
          }
        ]
      }
      user: {
        Row: {
          birth_date: string
          city: string
          country: string
          email: string
          first_name: string
          id: number
          last_name: string
          password: string
          phone: string
          photo: string
          registration_date: string
          update_date: string
        }
        Insert: {
          birth_date: string
          city: string
          country: string
          email: string
          first_name: string
          id: number
          last_name: string
          password: string
          phone: string
          photo: string
          registration_date: string
          update_date: string
        }
        Update: {
          birth_date?: string
          city?: string
          country?: string
          email?: string
          first_name?: string
          id?: number
          last_name?: string
          password?: string
          phone?: string
          photo?: string
          registration_date?: string
          update_date?: string
        }
        Relationships: []
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
