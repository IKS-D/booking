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
      hosts: {
        Row: {
          bank_account: string
          id: number
          personal_code: string
        }
        Insert: {
          bank_account: string
          id?: never
          personal_code: string
        }
        Update: {
          bank_account?: string
          id?: never
          personal_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      listings: {
        Row: {
          address: string
          category: number
          city: string
          country: string
          creation_date: string
          daily_price: number
          description: string
          fk_hosts: number
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
          daily_price: number
          description: string
          fk_hosts: number
          id?: never
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
          daily_price?: number
          description?: string
          fk_hosts?: number
          id?: never
          number_of_seats?: number
          photos?: string
          suspension_status?: boolean
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_hosts"
            columns: ["fk_hosts"]
            isOneToOne: false
            referencedRelation: "hosts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "listings_category"
            referencedColumns: ["id"]
          }
        ]
      }
      listings_category: {
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
      messages: {
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
          id?: never
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
          id?: never
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
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_reservations"
            columns: ["fk_reservation"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_sender"
            columns: ["fk_sender"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_status_fkey"
            columns: ["status"]
            isOneToOne: false
            referencedRelation: "messages_status"
            referencedColumns: ["id"]
          }
        ]
      }
      messages_status: {
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
      notifications: {
        Row: {
          fk_reservation: number
          id: number
          sent_time: string
          text: string
          title: string
        }
        Insert: {
          fk_reservation: number
          id?: never
          sent_time: string
          text: string
          title: string
        }
        Update: {
          fk_reservation?: number
          id?: never
          sent_time?: string
          text?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_reservations"
            columns: ["fk_reservation"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          }
        ]
      }
      ordered_services: {
        Row: {
          fk_reservation: number
          fk_service: number
          id: number
        }
        Insert: {
          fk_reservation: number
          fk_service: number
          id?: never
        }
        Update: {
          fk_reservation?: number
          fk_service?: number
          id?: never
        }
        Relationships: [
          {
            foreignKeyName: "fk_reservations"
            columns: ["fk_reservation"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_services"
            columns: ["fk_service"]
            isOneToOne: true
            referencedRelation: "services"
            referencedColumns: ["id"]
          }
        ]
      }
      payments: {
        Row: {
          amount: number
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
          amount: number
          date: string
          first_name: string
          fk_reservation: number
          id?: never
          last_name: string
          payer_email: string
          payment_method: string
          payment_number: string
          status: number
        }
        Update: {
          amount?: number
          date?: string
          first_name?: string
          fk_reservation?: number
          id?: never
          last_name?: string
          payer_email?: string
          payment_method?: string
          payment_number?: string
          status?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_reservations"
            columns: ["fk_reservation"]
            isOneToOne: true
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          }
        ]
      }
      photos: {
        Row: {
          fk_listing: number
          id: number
          url: string
        }
        Insert: {
          fk_listing: number
          id?: never
          url: string
        }
        Update: {
          fk_listing?: number
          id?: never
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_listings"
            columns: ["fk_listing"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          }
        ]
      }
      reports: {
        Row: {
          creation_date: string
          end_date: string
          file_url: string
          fk_hosts: number
          fk_listing: number
          id: number
          start_date: string
          title: string
        }
        Insert: {
          creation_date: string
          end_date: string
          file_url: string
          fk_hosts: number
          fk_listing: number
          id?: never
          start_date: string
          title: string
        }
        Update: {
          creation_date?: string
          end_date?: string
          file_url?: string
          fk_hosts?: number
          fk_listing?: number
          id?: never
          start_date?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_hosts"
            columns: ["fk_hosts"]
            isOneToOne: false
            referencedRelation: "hosts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_listings"
            columns: ["fk_listing"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          }
        ]
      }
      reservations: {
        Row: {
          creation_date: string
          end_date: string
          fk_listing: number
          fk_user: number
          id: number
          start_date: string
          status: number
          total_price: number
        }
        Insert: {
          creation_date: string
          end_date: string
          fk_listing: number
          fk_user: number
          id?: never
          start_date: string
          status: number
          total_price: number
        }
        Update: {
          creation_date?: string
          end_date?: string
          fk_listing?: number
          fk_user?: number
          id?: never
          start_date?: string
          status?: number
          total_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_listings"
            columns: ["fk_listing"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user"
            columns: ["fk_user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_status_fkey"
            columns: ["status"]
            isOneToOne: false
            referencedRelation: "reservations_status"
            referencedColumns: ["id"]
          }
        ]
      }
      reservations_status: {
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
      services: {
        Row: {
          description: string
          fk_listing: number
          id: number
          price: number
          title: string
        }
        Insert: {
          description: string
          fk_listing: number
          id?: never
          price: number
          title: string
        }
        Update: {
          description?: string
          fk_listing?: number
          id?: never
          price?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_listings"
            columns: ["fk_listing"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
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
          photos: string
          registration_date: string
          update_date: string
        }
        Insert: {
          birth_date: string
          city: string
          country: string
          email: string
          first_name: string
          id?: never
          last_name: string
          password: string
          phone: string
          photos: string
          registration_date: string
          update_date: string
        }
        Update: {
          birth_date?: string
          city?: string
          country?: string
          email?: string
          first_name?: string
          id?: never
          last_name?: string
          password?: string
          phone?: string
          photos?: string
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
