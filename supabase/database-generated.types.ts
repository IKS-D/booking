export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      hosts: {
        Row: {
          bank_account: string;
          id: string;
          personal_code: string;
        };
        Insert: {
          bank_account: string;
          id: string;
          personal_code: string;
        };
        Update: {
          bank_account?: string;
          id?: string;
          personal_code?: string;
        };
        Relationships: [
          {
            foreignKeyName: "hosts_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      listing_category: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      listings: {
        Row: {
          address: string;
          category_id: number;
          city: string;
          country: string;
          creation_date: string;
          day_price: number;
          description: string;
          host_id: string;
          id: number;
          number_of_places: number;
          photos: string;
          suspension_status: boolean;
          title: string;
        };
        Insert: {
          address: string;
          category_id: number;
          city: string;
          country: string;
          creation_date: string;
          day_price: number;
          description: string;
          host_id: string;
          id?: never;
          number_of_places: number;
          photos: string;
          suspension_status: boolean;
          title: string;
        };
        Update: {
          address?: string;
          category_id?: number;
          city?: string;
          country?: string;
          creation_date?: string;
          day_price?: number;
          description?: string;
          host_id?: string;
          id?: never;
          number_of_places?: number;
          photos?: string;
          suspension_status?: boolean;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "listings_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "listing_category";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "listings_host_id_fkey";
            columns: ["host_id"];
            isOneToOne: false;
            referencedRelation: "hosts";
            referencedColumns: ["id"];
          }
        ];
      };
      messages: {
        Row: {
          id: number;
          read_time: string | null;
          received_id: string;
          received_time: string | null;
          reservation_id: number;
          sender_id: string;
          sent_time: string;
          status: number;
          text: string;
        };
        Insert: {
          id?: never;
          read_time?: string | null;
          received_id: string;
          received_time?: string | null;
          reservation_id: number;
          sender_id: string;
          sent_time: string;
          status: number;
          text: string;
        };
        Update: {
          id?: never;
          read_time?: string | null;
          received_id?: string;
          received_time?: string | null;
          reservation_id?: number;
          sender_id?: string;
          sent_time?: string;
          status?: number;
          text?: string;
        };
        Relationships: [
          {
            foreignKeyName: "messages_received_id_fkey";
            columns: ["received_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_reservation_id_fkey";
            columns: ["reservation_id"];
            isOneToOne: false;
            referencedRelation: "reservations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_sender_id_fkey";
            columns: ["sender_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_status_fkey";
            columns: ["status"];
            isOneToOne: false;
            referencedRelation: "messages_status";
            referencedColumns: ["id"];
          }
        ];
      };
      messages_status: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: number;
          reservation_id: number;
          sent_time: string;
          text: string;
          title: string;
        };
        Insert: {
          id?: never;
          reservation_id: number;
          sent_time: string;
          text: string;
          title: string;
        };
        Update: {
          id?: never;
          reservation_id?: number;
          sent_time?: string;
          text?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_reservation_id_fkey";
            columns: ["reservation_id"];
            isOneToOne: false;
            referencedRelation: "reservations";
            referencedColumns: ["id"];
          }
        ];
      };
      ordered_services: {
        Row: {
          id: number;
          reservation_id: number;
          service_id: number;
        };
        Insert: {
          id?: never;
          reservation_id: number;
          service_id: number;
        };
        Update: {
          id?: never;
          reservation_id?: number;
          service_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "ordered_services_reservation_id_fkey";
            columns: ["reservation_id"];
            isOneToOne: false;
            referencedRelation: "reservations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ordered_services_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: true;
            referencedRelation: "services";
            referencedColumns: ["id"];
          }
        ];
      };
      payments: {
        Row: {
          amount: number;
          date: string;
          first_name: string;
          id: number;
          last_name: string;
          payer_email: string;
          payment_method: string;
          payment_number: string;
          reservation_id: number;
          status: number;
        };
        Insert: {
          amount: number;
          date: string;
          first_name: string;
          id?: never;
          last_name: string;
          payer_email: string;
          payment_method: string;
          payment_number: string;
          reservation_id: number;
          status: number;
        };
        Update: {
          amount?: number;
          date?: string;
          first_name?: string;
          id?: never;
          last_name?: string;
          payer_email?: string;
          payment_method?: string;
          payment_number?: string;
          reservation_id?: number;
          status?: number;
        };
        Relationships: [
          {
            foreignKeyName: "payments_reservation_id_fkey";
            columns: ["reservation_id"];
            isOneToOne: true;
            referencedRelation: "reservations";
            referencedColumns: ["id"];
          }
        ];
      };
      photos: {
        Row: {
          id: number;
          listing_id: number;
          url: string;
        };
        Insert: {
          id?: never;
          listing_id: number;
          url: string;
        };
        Update: {
          id?: never;
          listing_id?: number;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "photos_listing_id_fkey";
            columns: ["listing_id"];
            isOneToOne: false;
            referencedRelation: "listings";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          birth_date: string;
          city: string;
          country: string;
          first_name: string;
          id: string;
          last_name: string;
          phone: string;
          photos: string;
        };
        Insert: {
          birth_date: string;
          city: string;
          country: string;
          first_name: string;
          id: string;
          last_name: string;
          phone: string;
          photos: string;
        };
        Update: {
          birth_date?: string;
          city?: string;
          country?: string;
          first_name?: string;
          id?: string;
          last_name?: string;
          phone?: string;
          photos?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      reports: {
        Row: {
          creation_date: string;
          end_date: string;
          file_url: string;
          host_id: string;
          id: number;
          listing_id: number;
          start_date: string;
          title: string;
        };
        Insert: {
          creation_date: string;
          end_date: string;
          file_url: string;
          host_id: string;
          id?: never;
          listing_id: number;
          start_date: string;
          title: string;
        };
        Update: {
          creation_date?: string;
          end_date?: string;
          file_url?: string;
          host_id?: string;
          id?: never;
          listing_id?: number;
          start_date?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reports_host_id_fkey";
            columns: ["host_id"];
            isOneToOne: false;
            referencedRelation: "hosts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reports_listing_id_fkey";
            columns: ["listing_id"];
            isOneToOne: false;
            referencedRelation: "listings";
            referencedColumns: ["id"];
          }
        ];
      };
      reservation_status: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      reservations: {
        Row: {
          creation_date: string;
          end_date: string;
          id: number;
          listing_id: number;
          start_date: string;
          status: number;
          total_price: number;
          user_id: string;
        };
        Insert: {
          creation_date: string;
          end_date: string;
          id?: never;
          listing_id: number;
          start_date: string;
          status: number;
          total_price: number;
          user_id: string;
        };
        Update: {
          creation_date?: string;
          end_date?: string;
          id?: never;
          listing_id?: number;
          start_date?: string;
          status?: number;
          total_price?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reservations_listing_id_fkey";
            columns: ["listing_id"];
            isOneToOne: false;
            referencedRelation: "listings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reservations_status_fkey";
            columns: ["status"];
            isOneToOne: false;
            referencedRelation: "reservation_status";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reservations_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      services: {
        Row: {
          description: string;
          id: number;
          listing_id: number;
          price: number;
          title: string;
        };
        Insert: {
          description: string;
          id?: never;
          listing_id: number;
          price: number;
          title: string;
        };
        Update: {
          description?: string;
          id?: never;
          listing_id?: number;
          price?: number;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "services_listing_id_fkey";
            columns: ["listing_id"];
            isOneToOne: false;
            referencedRelation: "listings";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
