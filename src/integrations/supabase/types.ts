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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      children: {
        Row: {
          child_name: string
          child_user_id: string | null
          created_at: string
          grade: number
          id: string
          is_paired: boolean
          last_reminder_sent_at: string | null
          learning_notes: string | null
          pairing_code: string
          pairing_code_expires_at: string
          parent_user_id: string
        }
        Insert: {
          child_name: string
          child_user_id?: string | null
          created_at?: string
          grade?: number
          id?: string
          is_paired?: boolean
          last_reminder_sent_at?: string | null
          learning_notes?: string | null
          pairing_code?: string
          pairing_code_expires_at?: string
          parent_user_id: string
        }
        Update: {
          child_name?: string
          child_user_id?: string | null
          created_at?: string
          grade?: number
          id?: string
          is_paired?: boolean
          last_reminder_sent_at?: string | null
          learning_notes?: string | null
          pairing_code?: string
          pairing_code_expires_at?: string
          parent_user_id?: string
        }
        Relationships: []
      }
      curriculum_categories: {
        Row: {
          created_at: string
          description: string | null
          fun_fact: string | null
          id: string
          name: string
          slug: string
          sort_order: number
          subject_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          fun_fact?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
          subject_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          fun_fact?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          subject_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "curriculum_categories_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "curriculum_subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      curriculum_skills: {
        Row: {
          boundaries: Json
          brief_description: string | null
          code_skill_id: string
          created_at: string
          default_level: number
          fun_fact: string | null
          goals: Json
          grade_max: number
          grade_min: number
          help_common_mistake: string | null
          help_example: string | null
          help_hint: string | null
          help_steps: Json
          help_visual_examples: Json
          id: string
          input_type: string
          is_active: boolean
          keywords: Json
          name: string
          session_task_count: number
          sort_order: number
          topic_id: string
          updated_at: string
        }
        Insert: {
          boundaries?: Json
          brief_description?: string | null
          code_skill_id: string
          created_at?: string
          default_level?: number
          fun_fact?: string | null
          goals?: Json
          grade_max?: number
          grade_min?: number
          help_common_mistake?: string | null
          help_example?: string | null
          help_hint?: string | null
          help_steps?: Json
          help_visual_examples?: Json
          id?: string
          input_type?: string
          is_active?: boolean
          keywords?: Json
          name: string
          session_task_count?: number
          sort_order?: number
          topic_id: string
          updated_at?: string
        }
        Update: {
          boundaries?: Json
          brief_description?: string | null
          code_skill_id?: string
          created_at?: string
          default_level?: number
          fun_fact?: string | null
          goals?: Json
          grade_max?: number
          grade_min?: number
          help_common_mistake?: string | null
          help_example?: string | null
          help_hint?: string | null
          help_steps?: Json
          help_visual_examples?: Json
          id?: string
          input_type?: string
          is_active?: boolean
          keywords?: Json
          name?: string
          session_task_count?: number
          sort_order?: number
          topic_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "curriculum_skills_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "curriculum_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      curriculum_subjects: {
        Row: {
          created_at: string
          icon_url: string | null
          id: string
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          icon_url?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          icon_url?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      curriculum_topics: {
        Row: {
          category_id: string
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "curriculum_topics_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "curriculum_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_exercises: {
        Row: {
          correct_answer: string
          created_at: string
          created_by: string
          hints: Json
          id: string
          is_active: boolean
          options: Json
          question: string
          skill_id: string
          solution_steps: Json
          source: string
          updated_at: string
        }
        Insert: {
          correct_answer: string
          created_at?: string
          created_by: string
          hints?: Json
          id?: string
          is_active?: boolean
          options?: Json
          question: string
          skill_id: string
          solution_steps?: Json
          source?: string
          updated_at?: string
        }
        Update: {
          correct_answer?: string
          created_at?: string
          created_by?: string
          hints?: Json
          id?: string
          is_active?: boolean
          options?: Json
          question?: string
          skill_id?: string
          solution_steps?: Json
          source?: string
          updated_at?: string
        }
        Relationships: []
      }
      parent_assignments: {
        Row: {
          assigned_date: string
          child_id: string
          created_at: string
          due_date: string | null
          id: string
          note: string | null
          parent_user_id: string
          skill_id: string
          status: string
        }
        Insert: {
          assigned_date?: string
          child_id: string
          created_at?: string
          due_date?: string | null
          id?: string
          note?: string | null
          parent_user_id: string
          skill_id: string
          status?: string
        }
        Update: {
          assigned_date?: string
          child_id?: string
          created_at?: string
          due_date?: string | null
          id?: string
          note?: string | null
          parent_user_id?: string
          skill_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "parent_assignments_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          locale: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          locale?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          locale?: string
          user_id?: string
        }
        Relationships: []
      }
      report_settings: {
        Row: {
          child_id: string
          child_reports_enabled: boolean
          created_at: string
          id: string
          parent_frequency: string
        }
        Insert: {
          child_id: string
          child_reports_enabled?: boolean
          created_at?: string
          id?: string
          parent_frequency?: string
        }
        Update: {
          child_id?: string
          child_reports_enabled?: boolean
          created_at?: string
          id?: string
          parent_frequency?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_settings_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: true
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      session_logs: {
        Row: {
          child_id: string | null
          correct: boolean
          created_at: string
          error_type: string | null
          example_id: string | null
          help_used: boolean
          id: string
          level: number
          response_time_ms: number | null
          session_id: string
          skill_id: string
          user_id: string
        }
        Insert: {
          child_id?: string | null
          correct: boolean
          created_at?: string
          error_type?: string | null
          example_id?: string | null
          help_used?: boolean
          id?: string
          level?: number
          response_time_ms?: number | null
          session_id: string
          skill_id: string
          user_id: string
        }
        Update: {
          child_id?: string | null
          correct?: boolean
          created_at?: string
          error_type?: string | null
          example_id?: string | null
          help_used?: boolean
          id?: string
          level?: number
          response_time_ms?: number | null
          session_id?: string
          skill_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_logs_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_profiles: {
        Row: {
          attempts_total: number
          child_id: string | null
          correct_total: number
          created_at: string
          error_streak: number
          id: string
          last_practiced_at: string
          mastery_score: number
          skill_id: string
          success_streak: number
          updated_at: string
          user_id: string
          weak_pattern_flags: Json
        }
        Insert: {
          attempts_total?: number
          child_id?: string | null
          correct_total?: number
          created_at?: string
          error_streak?: number
          id?: string
          last_practiced_at?: string
          mastery_score?: number
          skill_id: string
          success_streak?: number
          updated_at?: string
          user_id: string
          weak_pattern_flags?: Json
        }
        Update: {
          attempts_total?: number
          child_id?: string | null
          correct_total?: number
          created_at?: string
          error_streak?: number
          id?: string
          last_practiced_at?: string
          mastery_score?: number
          skill_id?: string
          success_streak?: number
          updated_at?: string
          user_id?: string
          weak_pattern_flags?: Json
        }
        Relationships: [
          {
            foreignKeyName: "skill_profiles_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      generate_pairing_code: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "parent" | "child"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      app_role: ["admin", "parent", "child"],
    },
  },
} as const
