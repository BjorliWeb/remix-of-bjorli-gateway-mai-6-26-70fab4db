export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          created_at: string
          cta_href: string | null
          cta_label: string | null
          ends_at: string | null
          id: string
          is_active: boolean
          label: string | null
          language: string
          level: string
          message: string
          published_at: string
          starts_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean
          label?: string | null
          language?: string
          level?: string
          message: string
          published_at?: string
          starts_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean
          label?: string | null
          language?: string
          level?: string
          message?: string
          published_at?: string
          starts_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      editor_mfa_email_codes: {
        Row: {
          attempts: number
          code_hmac: string
          consumed_at: string | null
          created_at: string
          expires_at: string
          id: string
          session_id: string
          user_id: string
        }
        Insert: {
          attempts?: number
          code_hmac: string
          consumed_at?: string | null
          created_at?: string
          expires_at: string
          id?: string
          session_id: string
          user_id: string
        }
        Update: {
          attempts?: number
          code_hmac?: string
          consumed_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          session_id?: string
          user_id?: string
        }
        Relationships: []
      }
      editor_mfa_verifications: {
        Row: {
          expires_at: string
          id: string
          method: string
          revoked_at: string | null
          session_id: string
          user_id: string
          verified_at: string
        }
        Insert: {
          expires_at: string
          id?: string
          method: string
          revoked_at?: string | null
          session_id: string
          user_id: string
          verified_at?: string
        }
        Update: {
          expires_at?: string
          id?: string
          method?: string
          revoked_at?: string | null
          session_id?: string
          user_id?: string
          verified_at?: string
        }
        Relationships: []
      }
      editor_privilege_state: {
        Row: {
          roles_changed_at: string
          user_id: string
        }
        Insert: {
          roles_changed_at?: string
          user_id: string
        }
        Update: {
          roles_changed_at?: string
          user_id?: string
        }
        Relationships: []
      }
      event_submissions: {
        Row: {
          ai_polished_description: string | null
          ai_polished_summary: string | null
          ai_quality_notes: string | null
          ai_seo_meta: string | null
          ai_seo_title: string | null
          category: string
          consent_editing: boolean
          consent_rights: boolean
          contact_name: string
          created_at: string
          description: string
          editor_notes: string | null
          email: string
          end_date: string | null
          english_approved: boolean
          english_approved_at: string | null
          english_draft_description: string | null
          english_draft_summary: string | null
          english_draft_title: string | null
          id: string
          image_urls: string[]
          language: string
          location: string
          maps_url: string | null
          organizer: string
          phone: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          show_email_public: boolean
          start_date: string
          status: Database["public"]["Enums"]["event_submission_status"]
          summary: string | null
          time_text: string | null
          title: string
          updated_at: string
          upload_token: string
          website: string | null
        }
        Insert: {
          ai_polished_description?: string | null
          ai_polished_summary?: string | null
          ai_quality_notes?: string | null
          ai_seo_meta?: string | null
          ai_seo_title?: string | null
          category: string
          consent_editing?: boolean
          consent_rights?: boolean
          contact_name: string
          created_at?: string
          description: string
          editor_notes?: string | null
          email: string
          end_date?: string | null
          english_approved?: boolean
          english_approved_at?: string | null
          english_draft_description?: string | null
          english_draft_summary?: string | null
          english_draft_title?: string | null
          id?: string
          image_urls?: string[]
          language?: string
          location: string
          maps_url?: string | null
          organizer: string
          phone?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          show_email_public?: boolean
          start_date: string
          status?: Database["public"]["Enums"]["event_submission_status"]
          summary?: string | null
          time_text?: string | null
          title: string
          updated_at?: string
          upload_token?: string
          website?: string | null
        }
        Update: {
          ai_polished_description?: string | null
          ai_polished_summary?: string | null
          ai_quality_notes?: string | null
          ai_seo_meta?: string | null
          ai_seo_title?: string | null
          category?: string
          consent_editing?: boolean
          consent_rights?: boolean
          contact_name?: string
          created_at?: string
          description?: string
          editor_notes?: string | null
          email?: string
          end_date?: string | null
          english_approved?: boolean
          english_approved_at?: string | null
          english_draft_description?: string | null
          english_draft_summary?: string | null
          english_draft_title?: string | null
          id?: string
          image_urls?: string[]
          language?: string
          location?: string
          maps_url?: string | null
          organizer?: string
          phone?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          show_email_public?: boolean
          start_date?: string
          status?: Database["public"]["Enums"]["event_submission_status"]
          summary?: string | null
          time_text?: string | null
          title?: string
          updated_at?: string
          upload_token?: string
          website?: string | null
        }
        Relationships: []
      }
      operational_status: {
        Row: {
          created_at: string
          icon: string
          id: string
          is_active: boolean
          label: string
          language: string
          metric_key: string
          sort_order: number
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          icon?: string
          id?: string
          is_active?: boolean
          label: string
          language?: string
          metric_key: string
          sort_order?: number
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          icon?: string
          id?: string
          is_active?: boolean
          label?: string
          language?: string
          metric_key?: string
          sort_order?: number
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      seo_meta: {
        Row: {
          description: string | null
          id: string
          keywords: string | null
          og_image_url: string | null
          page_slug: string
          title: string
          updated_at: string
        }
        Insert: {
          description?: string | null
          id?: string
          keywords?: string | null
          og_image_url?: string | null
          page_slug: string
          title: string
          updated_at?: string
        }
        Update: {
          description?: string | null
          id?: string
          keywords?: string | null
          og_image_url?: string | null
          page_slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      trusted_devices: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          issued_method: string
          last_used_at: string | null
          revoked_at: string | null
          token_sha256: string
          ua_digest: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          issued_method: string
          last_used_at?: string | null
          revoked_at?: string | null
          token_sha256: string
          ua_digest?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          issued_method?: string
          last_used_at?: string | null
          revoked_at?: string | null
          token_sha256?: string
          ua_digest?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      editor_mfa_pepper: { Args: never; Returns: string }
      event_submission_path_declared: {
        Args: { _path: string }
        Returns: boolean
      }
      has_current_editor_mfa: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      issue_editor_email_code_for_delivery: {
        Args: { _session_id: string; _user_id: string }
        Returns: Json
      }
      verify_editor_email_code: { Args: { _code: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      event_submission_status: "pending" | "approved" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      event_submission_status: ["pending", "approved", "rejected"],
    },
  },
} as const
