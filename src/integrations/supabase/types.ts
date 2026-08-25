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
    PostgrestVersion: "14.17"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      admin_reviewed_cards: {
        Row: {
          card_key: string
          reviewed_at: string
          reviewed_by: string | null
          skill_id: string
        }
        Insert: {
          card_key: string
          reviewed_at?: string
          reviewed_by?: string | null
          skill_id: string
        }
        Update: {
          card_key?: string
          reviewed_at?: string
          reviewed_by?: string | null
          skill_id?: string
        }
        Relationships: []
      }
      anon_progress: {
        Row: {
          anon_token: string
          completed: boolean
          created_at: string
          grade: number | null
          id: string
          score: number | null
          topic_id: string
        }
        Insert: {
          anon_token: string
          completed?: boolean
          created_at?: string
          grade?: number | null
          id?: string
          score?: number | null
          topic_id: string
        }
        Update: {
          anon_token?: string
          completed?: boolean
          created_at?: string
          grade?: number | null
          id?: string
          score?: number | null
          topic_id?: string
        }
        Relationships: []
      }
      anon_trial: {
        Row: {
          anon_token: string
          grade: number | null
          started_at: string
        }
        Insert: {
          anon_token: string
          grade?: number | null
          started_at?: string
        }
        Update: {
          anon_token?: string
          grade?: number | null
          started_at?: string
        }
        Relationships: []
      }
      children: {
        Row: {
          child_name: string
          child_user_id: string | null
          created_at: string | null
          grade: number
          id: string
          is_paired: boolean
          last_reminder_sent_at: string | null
          learning_notes: string | null
          pairing_code: string | null
          pairing_code_expires_at: string | null
          parent_user_id: string
          updated_at: string | null
        }
        Insert: {
          child_name: string
          child_user_id?: string | null
          created_at?: string | null
          grade: number
          id?: string
          is_paired?: boolean
          last_reminder_sent_at?: string | null
          learning_notes?: string | null
          pairing_code?: string | null
          pairing_code_expires_at?: string | null
          parent_user_id: string
          updated_at?: string | null
        }
        Update: {
          child_name?: string
          child_user_id?: string | null
          created_at?: string | null
          grade?: number
          id?: string
          is_paired?: boolean
          last_reminder_sent_at?: string | null
          learning_notes?: string | null
          pairing_code?: string | null
          pairing_code_expires_at?: string | null
          parent_user_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      curriculum_categories: {
        Row: {
          created_at: string | null
          description: string | null
          fun_fact: string | null
          id: string
          name: string
          slug: string
          sort_order: number | null
          subject_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          fun_fact?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number | null
          subject_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          fun_fact?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number | null
          subject_id?: string
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
          boundaries: Json | null
          brief_description: string | null
          code_skill_id: string | null
          created_at: string | null
          default_level: number | null
          fun_fact: string | null
          goals: Json | null
          grade_max: number | null
          grade_min: number | null
          help_common_mistake: string | null
          help_example: string | null
          help_hint: string | null
          help_steps: Json | null
          help_visual_examples: Json | null
          id: string
          input_type: string | null
          is_active: boolean
          keywords: Json | null
          name: string
          session_task_count: number | null
          sort_order: number | null
          topic_id: string
        }
        Insert: {
          boundaries?: Json | null
          brief_description?: string | null
          code_skill_id?: string | null
          created_at?: string | null
          default_level?: number | null
          fun_fact?: string | null
          goals?: Json | null
          grade_max?: number | null
          grade_min?: number | null
          help_common_mistake?: string | null
          help_example?: string | null
          help_hint?: string | null
          help_steps?: Json | null
          help_visual_examples?: Json | null
          id?: string
          input_type?: string | null
          is_active?: boolean
          keywords?: Json | null
          name: string
          session_task_count?: number | null
          sort_order?: number | null
          topic_id: string
        }
        Update: {
          boundaries?: Json | null
          brief_description?: string | null
          code_skill_id?: string | null
          created_at?: string | null
          default_level?: number | null
          fun_fact?: string | null
          goals?: Json | null
          grade_max?: number | null
          grade_min?: number | null
          help_common_mistake?: string | null
          help_example?: string | null
          help_hint?: string | null
          help_steps?: Json | null
          help_visual_examples?: Json | null
          id?: string
          input_type?: string | null
          is_active?: boolean
          keywords?: Json | null
          name?: string
          session_task_count?: number | null
          sort_order?: number | null
          topic_id?: string
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
          ai_prompt_extra: string | null
          color_hue: number | null
          created_at: string | null
          description: string | null
          emoji: string | null
          grade_max: number | null
          grade_min: number | null
          hook: string | null
          id: string
          image_url: string | null
          name: string
          slug: string
          sort_order: number | null
        }
        Insert: {
          ai_prompt_extra?: string | null
          color_hue?: number | null
          created_at?: string | null
          description?: string | null
          emoji?: string | null
          grade_max?: number | null
          grade_min?: number | null
          hook?: string | null
          id?: string
          image_url?: string | null
          name: string
          slug: string
          sort_order?: number | null
        }
        Update: {
          ai_prompt_extra?: string | null
          color_hue?: number | null
          created_at?: string | null
          description?: string | null
          emoji?: string | null
          grade_max?: number | null
          grade_min?: number | null
          hook?: string | null
          id?: string
          image_url?: string | null
          name?: string
          slug?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      curriculum_topics: {
        Row: {
          category_id: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
          sort_order: number | null
        }
        Insert: {
          category_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number | null
        }
        Update: {
          category_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number | null
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
          blanks: Json | null
          categories: Json | null
          correct_answer: string
          correct_answers: Json | null
          created_at: string | null
          hints: Json | null
          id: string
          is_active: boolean | null
          items: Json | null
          options: Json | null
          pairs: Json | null
          question: string
          skill_id: string
          solution_steps: Json | null
          source: string | null
          status: string
        }
        Insert: {
          blanks?: Json | null
          categories?: Json | null
          correct_answer: string
          correct_answers?: Json | null
          created_at?: string | null
          hints?: Json | null
          id?: string
          is_active?: boolean | null
          items?: Json | null
          options?: Json | null
          pairs?: Json | null
          question: string
          skill_id: string
          solution_steps?: Json | null
          source?: string | null
          status?: string
        }
        Update: {
          blanks?: Json | null
          categories?: Json | null
          correct_answer?: string
          correct_answers?: Json | null
          created_at?: string | null
          hints?: Json | null
          id?: string
          is_active?: boolean | null
          items?: Json | null
          options?: Json | null
          pairs?: Json | null
          question?: string
          skill_id?: string
          solution_steps?: Json | null
          source?: string | null
          status?: string
        }
        Relationships: []
      }
      custom_illustrations: {
        Row: {
          created_at: string
          created_by: string | null
          description: string
          full_prompt: string | null
          generations: number
          key: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description: string
          full_prompt?: string | null
          generations?: number
          key: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string
          full_prompt?: string | null
          generations?: number
          key?: string
          updated_at?: string
        }
        Relationships: []
      }
      exercise_assets: {
        Row: {
          alt_text: string
          created_at: string
          created_by: string | null
          generation_prompt: string | null
          id: string
          is_active: boolean
          skill_id: string | null
          source: string
          status: string
          tags: string[]
          updated_at: string
          url: string
        }
        Insert: {
          alt_text: string
          created_at?: string
          created_by?: string | null
          generation_prompt?: string | null
          id?: string
          is_active?: boolean
          skill_id?: string | null
          source?: string
          status?: string
          tags?: string[]
          updated_at?: string
          url: string
        }
        Update: {
          alt_text?: string
          created_at?: string
          created_by?: string | null
          generation_prompt?: string | null
          id?: string
          is_active?: boolean
          skill_id?: string | null
          source?: string
          status?: string
          tags?: string[]
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      parent_assignments: {
        Row: {
          assigned_date: string
          child_id: string
          created_at: string | null
          due_date: string | null
          id: string
          note: string | null
          parent_user_id: string | null
          skill_id: string
          status: Database["public"]["Enums"]["assignment_status"] | null
          updated_at: string | null
        }
        Insert: {
          assigned_date?: string
          child_id: string
          created_at?: string | null
          due_date?: string | null
          id?: string
          note?: string | null
          parent_user_id?: string | null
          skill_id: string
          status?: Database["public"]["Enums"]["assignment_status"] | null
          updated_at?: string | null
        }
        Update: {
          assigned_date?: string
          child_id?: string
          created_at?: string | null
          due_date?: string | null
          id?: string
          note?: string | null
          parent_user_id?: string | null
          skill_id?: string
          status?: Database["public"]["Enums"]["assignment_status"] | null
          updated_at?: string | null
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
      parent_invitations: {
        Row: {
          accepted_at: string | null
          anon_grade: number | null
          anon_token: string | null
          child_id: string | null
          child_name: string | null
          email: string
          id: string
          invited_at: string
          status: string
        }
        Insert: {
          accepted_at?: string | null
          anon_grade?: number | null
          anon_token?: string | null
          child_id?: string | null
          child_name?: string | null
          email: string
          id?: string
          invited_at?: string
          status?: string
        }
        Update: {
          accepted_at?: string | null
          anon_grade?: number | null
          anon_token?: string | null
          child_id?: string | null
          child_name?: string | null
          email?: string
          id?: string
          invited_at?: string
          status?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          display_name: string | null
          id: string
          locale: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          id: string
          locale?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          id?: string
          locale?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      report_settings: {
        Row: {
          child_reports_enabled: boolean | null
          created_at: string | null
          frequency: string | null
          id: string
          user_id: string
        }
        Insert: {
          child_reports_enabled?: boolean | null
          created_at?: string | null
          frequency?: string | null
          id?: string
          user_id: string
        }
        Update: {
          child_reports_enabled?: boolean | null
          created_at?: string | null
          frequency?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      session_logs: {
        Row: {
          child_id: string | null
          correct: boolean
          correct_answer: string | null
          created_at: string | null
          error_type: string | null
          example_id: string | null
          help_used: boolean | null
          id: string
          level: number
          question_text: string | null
          response_time_ms: number | null
          session_id: string
          skill_id: string
          user_id: string | null
        }
        Insert: {
          child_id?: string | null
          correct: boolean
          correct_answer?: string | null
          created_at?: string | null
          error_type?: string | null
          example_id?: string | null
          help_used?: boolean | null
          id?: string
          level?: number
          question_text?: string | null
          response_time_ms?: number | null
          session_id: string
          skill_id: string
          user_id?: string | null
        }
        Update: {
          child_id?: string | null
          correct?: boolean
          correct_answer?: string | null
          created_at?: string | null
          error_type?: string | null
          example_id?: string | null
          help_used?: boolean | null
          id?: string
          level?: number
          question_text?: string | null
          response_time_ms?: number | null
          session_id?: string
          skill_id?: string
          user_id?: string | null
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
          attempts_total: number | null
          child_id: string | null
          correct_total: number
          created_at: string | null
          error_streak: number | null
          id: string
          last_practiced_at: string | null
          mastery_score: number | null
          skill_id: string
          success_streak: number | null
          updated_at: string | null
          user_id: string | null
          weak_pattern_flags: Json | null
        }
        Insert: {
          attempts_total?: number | null
          child_id?: string | null
          correct_total?: number
          created_at?: string | null
          error_streak?: number | null
          id?: string
          last_practiced_at?: string | null
          mastery_score?: number | null
          skill_id: string
          success_streak?: number | null
          updated_at?: string | null
          user_id?: string | null
          weak_pattern_flags?: Json | null
        }
        Update: {
          attempts_total?: number | null
          child_id?: string | null
          correct_total?: number
          created_at?: string | null
          error_streak?: number | null
          id?: string
          last_practiced_at?: string | null
          mastery_score?: number | null
          skill_id?: string
          success_streak?: number | null
          updated_at?: string | null
          user_id?: string | null
          weak_pattern_flags?: Json | null
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
      student_misconceptions: {
        Row: {
          child_id: string | null
          confidence: number
          description: string | null
          detected_at: string
          evidence_count: number
          id: string
          pattern_label: string
          resolved_at: string | null
          skill_id: string
          status: string
          suggestion: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          child_id?: string | null
          confidence?: number
          description?: string | null
          detected_at?: string
          evidence_count?: number
          id?: string
          pattern_label: string
          resolved_at?: string | null
          skill_id: string
          status?: string
          suggestion?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          child_id?: string | null
          confidence?: number
          description?: string | null
          detected_at?: string
          evidence_count?: number
          id?: string
          pattern_label?: string
          resolved_at?: string | null
          skill_id?: string
          status?: string
          suggestion?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      student_skill_level: {
        Row: {
          consecutive_bad: number
          consecutive_good: number
          last_score: number | null
          level: number
          sessions_at_level: number
          student_id: string
          topic_id: string
          updated_at: string
        }
        Insert: {
          consecutive_bad?: number
          consecutive_good?: number
          last_score?: number | null
          level?: number
          sessions_at_level?: number
          student_id: string
          topic_id: string
          updated_at?: string
        }
        Update: {
          consecutive_bad?: number
          consecutive_good?: number
          last_score?: number | null
          level?: number
          sessions_at_level?: number
          student_id?: string
          topic_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          id: string
          plan: Database["public"]["Enums"]["subscription_plan"] | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"] | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"] | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      usage_tracking: {
        Row: {
          ai_tutor_calls: number | null
          children_count: number | null
          created_at: string | null
          id: string
          month: string
          sessions_count: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_tutor_calls?: number | null
          children_count?: number | null
          created_at?: string | null
          id?: string
          month: string
          sessions_count?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_tutor_calls?: number | null
          children_count?: number | null
          created_at?: string | null
          id?: string
          month?: string
          sessions_count?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
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
      get_my_role: {
        Args: never
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: { required_role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "parent" | "child"
      assignment_status: "pending" | "completed"
      subscription_plan: "free" | "premium" | "school"
      subscription_status: "active" | "canceled" | "past_due" | "trialing"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      app_role: ["admin", "parent", "child"],
      assignment_status: ["pending", "completed"],
      subscription_plan: ["free", "premium", "school"],
      subscription_status: ["active", "canceled", "past_due", "trialing"],
    },
  },
} as const
