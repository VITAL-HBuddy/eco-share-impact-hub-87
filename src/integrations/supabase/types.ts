export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      causes: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      donations: {
        Row: {
          category: Database["public"]["Enums"]["donation_category"]
          city: string
          claimed_at: string | null
          claimed_by: string | null
          created_at: string
          delivery_volunteer_id: string | null
          description: string | null
          donor_id: string
          expiry_date: string | null
          id: string
          item_name: string
          photo_url: string | null
          pickup_address: string
          quantity: number
          state: string
          status: Database["public"]["Enums"]["donation_status"]
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["donation_category"]
          city: string
          claimed_at?: string | null
          claimed_by?: string | null
          created_at?: string
          delivery_volunteer_id?: string | null
          description?: string | null
          donor_id: string
          expiry_date?: string | null
          id?: string
          item_name: string
          photo_url?: string | null
          pickup_address: string
          quantity?: number
          state: string
          status?: Database["public"]["Enums"]["donation_status"]
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["donation_category"]
          city?: string
          claimed_at?: string | null
          claimed_by?: string | null
          created_at?: string
          delivery_volunteer_id?: string | null
          description?: string | null
          donor_id?: string
          expiry_date?: string | null
          id?: string
          item_name?: string
          photo_url?: string | null
          pickup_address?: string
          quantity?: number
          state?: string
          status?: Database["public"]["Enums"]["donation_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "donations_claimed_by_fkey"
            columns: ["claimed_by"]
            isOneToOne: false
            referencedRelation: "ngo_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_delivery_volunteer_id_fkey"
            columns: ["delivery_volunteer_id"]
            isOneToOne: false
            referencedRelation: "volunteer_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      donor_profiles: {
        Row: {
          address: string | null
          city: string
          created_at: string
          donor_type: Database["public"]["Enums"]["donor_type"]
          id: string
          name: string
          phone_number: string | null
          state: string
        }
        Insert: {
          address?: string | null
          city: string
          created_at?: string
          donor_type: Database["public"]["Enums"]["donor_type"]
          id: string
          name: string
          phone_number?: string | null
          state: string
        }
        Update: {
          address?: string | null
          city?: string
          created_at?: string
          donor_type?: Database["public"]["Enums"]["donor_type"]
          id?: string
          name?: string
          phone_number?: string | null
          state?: string
        }
        Relationships: []
      }
      impact_notes: {
        Row: {
          created_at: string
          donation_id: string
          id: string
          impact_description: string
          ngo_id: string
          people_helped: number | null
        }
        Insert: {
          created_at?: string
          donation_id: string
          id?: string
          impact_description: string
          ngo_id: string
          people_helped?: number | null
        }
        Update: {
          created_at?: string
          donation_id?: string
          id?: string
          impact_description?: string
          ngo_id?: string
          people_helped?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "impact_notes_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "impact_notes_ngo_id_fkey"
            columns: ["ngo_id"]
            isOneToOne: false
            referencedRelation: "ngo_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          created_at: string
          donation_id: string | null
          id: string
          message: string
          read: boolean | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string
          donation_id?: string | null
          id?: string
          message: string
          read?: boolean | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          created_at?: string
          donation_id?: string | null
          id?: string
          message?: string
          read?: boolean | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
        ]
      }
      ngo_causes: {
        Row: {
          cause_id: string
          ngo_id: string
          other_description: string | null
        }
        Insert: {
          cause_id: string
          ngo_id: string
          other_description?: string | null
        }
        Update: {
          cause_id?: string
          ngo_id?: string
          other_description?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ngo_causes_cause_id_fkey"
            columns: ["cause_id"]
            isOneToOne: false
            referencedRelation: "causes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ngo_causes_ngo_id_fkey"
            columns: ["ngo_id"]
            isOneToOne: false
            referencedRelation: "ngo_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ngo_contacts: {
        Row: {
          created_at: string
          designation: string
          email: string
          id: string
          ngo_id: string
          phone_number: string
          representative_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          designation: string
          email: string
          id?: string
          ngo_id: string
          phone_number: string
          representative_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          designation?: string
          email?: string
          id?: string
          ngo_id?: string
          phone_number?: string
          representative_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ngo_contacts_ngo_id_fkey"
            columns: ["ngo_id"]
            isOneToOne: false
            referencedRelation: "ngo_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ngo_documents: {
        Row: {
          document_type: string
          file_path: string
          id: string
          ngo_id: string
          uploaded_at: string
          verified: boolean | null
        }
        Insert: {
          document_type: string
          file_path: string
          id?: string
          ngo_id: string
          uploaded_at?: string
          verified?: boolean | null
        }
        Update: {
          document_type?: string
          file_path?: string
          id?: string
          ngo_id?: string
          uploaded_at?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "ngo_documents_ngo_id_fkey"
            columns: ["ngo_id"]
            isOneToOne: false
            referencedRelation: "ngo_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ngo_needs: {
        Row: {
          category: Database["public"]["Enums"]["donation_category"]
          created_at: string
          deadline: string | null
          description: string
          event_date: string | null
          fulfilled_quantity: number | null
          id: string
          is_event: boolean | null
          ngo_id: string
          quantity_needed: number
          title: string
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["donation_category"]
          created_at?: string
          deadline?: string | null
          description: string
          event_date?: string | null
          fulfilled_quantity?: number | null
          id?: string
          is_event?: boolean | null
          ngo_id: string
          quantity_needed: number
          title: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["donation_category"]
          created_at?: string
          deadline?: string | null
          description?: string
          event_date?: string | null
          fulfilled_quantity?: number | null
          id?: string
          is_event?: boolean | null
          ngo_id?: string
          quantity_needed?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ngo_needs_ngo_id_fkey"
            columns: ["ngo_id"]
            isOneToOne: false
            referencedRelation: "ngo_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ngo_profiles: {
        Row: {
          city: string
          created_at: string
          id: string
          issuing_authority: string
          ngo_name: string
          ngo_type: Database["public"]["Enums"]["ngo_type"]
          registered_address: string
          registration_number: string
          state: string
          status: Database["public"]["Enums"]["ngo_status"]
          updated_at: string
          verified_at: string | null
          year_established: number
        }
        Insert: {
          city: string
          created_at?: string
          id: string
          issuing_authority: string
          ngo_name: string
          ngo_type: Database["public"]["Enums"]["ngo_type"]
          registered_address: string
          registration_number: string
          state: string
          status?: Database["public"]["Enums"]["ngo_status"]
          updated_at?: string
          verified_at?: string | null
          year_established: number
        }
        Update: {
          city?: string
          created_at?: string
          id?: string
          issuing_authority?: string
          ngo_name?: string
          ngo_type?: Database["public"]["Enums"]["ngo_type"]
          registered_address?: string
          registration_number?: string
          state?: string
          status?: Database["public"]["Enums"]["ngo_status"]
          updated_at?: string
          verified_at?: string | null
          year_established?: number
        }
        Relationships: []
      }
      reviews: {
        Row: {
          cleanliness: number | null
          comment: string | null
          created_at: string
          donation_id: string | null
          helpfulness: number | null
          honesty: number | null
          id: string
          punctuality: number | null
          rating: number
          reviewed_id: string
          reviewer_id: string
        }
        Insert: {
          cleanliness?: number | null
          comment?: string | null
          created_at?: string
          donation_id?: string | null
          helpfulness?: number | null
          honesty?: number | null
          id?: string
          punctuality?: number | null
          rating: number
          reviewed_id: string
          reviewer_id: string
        }
        Update: {
          cleanliness?: number | null
          comment?: string | null
          created_at?: string
          donation_id?: string | null
          helpfulness?: number | null
          honesty?: number | null
          id?: string
          punctuality?: number | null
          rating?: number
          reviewed_id?: string
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
        ]
      }
      volunteer_profiles: {
        Row: {
          address: string | null
          available: boolean | null
          city: string
          created_at: string
          id: string
          name: string
          phone_number: string
          state: string
          volunteer_type: Database["public"]["Enums"]["volunteer_type"]
        }
        Insert: {
          address?: string | null
          available?: boolean | null
          city: string
          created_at?: string
          id: string
          name: string
          phone_number: string
          state: string
          volunteer_type: Database["public"]["Enums"]["volunteer_type"]
        }
        Update: {
          address?: string | null
          available?: boolean | null
          city?: string
          created_at?: string
          id?: string
          name?: string
          phone_number?: string
          state?: string
          volunteer_type?: Database["public"]["Enums"]["volunteer_type"]
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
      donation_category:
        | "Food"
        | "Clothes"
        | "Books"
        | "Toys"
        | "Electronics"
        | "Other"
      donation_status: "Available" | "Reserved" | "Completed" | "Expired"
      donor_type:
        | "Individual"
        | "Restaurant"
        | "Home"
        | "Retailer"
        | "Corporate"
      ngo_status: "Pending" | "Verified" | "Rejected"
      ngo_type: "Trust" | "Society" | "Section 8" | "Other"
      volunteer_type: "Delivery" | "General"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      donation_category: [
        "Food",
        "Clothes",
        "Books",
        "Toys",
        "Electronics",
        "Other",
      ],
      donation_status: ["Available", "Reserved", "Completed", "Expired"],
      donor_type: ["Individual", "Restaurant", "Home", "Retailer", "Corporate"],
      ngo_status: ["Pending", "Verified", "Rejected"],
      ngo_type: ["Trust", "Society", "Section 8", "Other"],
      volunteer_type: ["Delivery", "General"],
    },
  },
} as const
