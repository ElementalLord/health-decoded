export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      activities: {
        Row: {
          activity_type: string;
          configuration: Json;
          created_at: string;
          display_order: number;
          explanation: string | null;
          id: string;
          instructions: string;
          lesson_id: string;
          published_at: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          status: string;
          title: string;
          updated_at: string;
          version: number;
        };
        Insert: {
          activity_type: string;
          configuration?: Json;
          created_at?: string;
          display_order: number;
          explanation?: string | null;
          id?: string;
          instructions: string;
          lesson_id: string;
          published_at?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          status?: string;
          title: string;
          updated_at?: string;
          version?: number;
        };
        Update: {
          activity_type?: string;
          configuration?: Json;
          created_at?: string;
          display_order?: number;
          explanation?: string | null;
          id?: string;
          instructions?: string;
          lesson_id?: string;
          published_at?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          status?: string;
          title?: string;
          updated_at?: string;
          version?: number;
        };
        Relationships: [
          {
            foreignKeyName: "activities_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
        ];
      };
      activity_answer_keys: {
        Row: {
          activity_id: string;
          answer_config: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          activity_id: string;
          answer_config: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          activity_id?: string;
          answer_config?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "activity_answer_keys_activity_id_fkey";
            columns: ["activity_id"];
            isOneToOne: true;
            referencedRelation: "activities";
            referencedColumns: ["id"];
          },
        ];
      };
      activity_progress: {
        Row: {
          activity_id: string;
          completed_at: string | null;
          created_at: string;
          id: string;
          lesson_progress_id: string;
          result_summary: Json | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          activity_id: string;
          completed_at?: string | null;
          created_at?: string;
          id?: string;
          lesson_progress_id: string;
          result_summary?: Json | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          activity_id?: string;
          completed_at?: string | null;
          created_at?: string;
          id?: string;
          lesson_progress_id?: string;
          result_summary?: Json | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "activity_progress_activity_id_fkey";
            columns: ["activity_id"];
            isOneToOne: false;
            referencedRelation: "activities";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "activity_progress_lesson_progress_id_fkey";
            columns: ["lesson_progress_id"];
            isOneToOne: false;
            referencedRelation: "lesson_progress";
            referencedColumns: ["id"];
          },
        ];
      };
      ai_conversations: {
        Row: {
          archived_at: string | null;
          created_at: string;
          id: string;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          archived_at?: string | null;
          created_at?: string;
          id?: string;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          archived_at?: string | null;
          created_at?: string;
          id?: string;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      ai_messages: {
        Row: {
          content: string;
          conversation_id: string;
          created_at: string;
          id: string;
          role: string;
        };
        Insert: {
          content: string;
          conversation_id: string;
          created_at?: string;
          id?: string;
          role: string;
        };
        Update: {
          content?: string;
          conversation_id?: string;
          created_at?: string;
          id?: string;
          role?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ai_messages_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "ai_conversations";
            referencedColumns: ["id"];
          },
        ];
      };
      caregiver_content: {
        Row: {
          content_blocks: Json;
          conversation_prompt: string | null;
          created_at: string;
          id: string;
          journey_lesson_id: string | null;
          published_at: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          slug: string;
          status: string;
          support_tip: string | null;
          title: string;
          updated_at: string;
          version: number;
          what_not_to_say: string | null;
        };
        Insert: {
          content_blocks?: Json;
          conversation_prompt?: string | null;
          created_at?: string;
          id?: string;
          journey_lesson_id?: string | null;
          published_at?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          slug: string;
          status?: string;
          support_tip?: string | null;
          title: string;
          updated_at?: string;
          version?: number;
          what_not_to_say?: string | null;
        };
        Update: {
          content_blocks?: Json;
          conversation_prompt?: string | null;
          created_at?: string;
          id?: string;
          journey_lesson_id?: string | null;
          published_at?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          slug?: string;
          status?: string;
          support_tip?: string | null;
          title?: string;
          updated_at?: string;
          version?: number;
          what_not_to_say?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "caregiver_content_journey_lesson_id_fkey";
            columns: ["journey_lesson_id"];
            isOneToOne: false;
            referencedRelation: "journey_lessons";
            referencedColumns: ["id"];
          },
        ];
      };
      confidence_check_ins: {
        Row: {
          confidence_level: string;
          created_at: string;
          id: string;
          lesson_progress_id: string;
        };
        Insert: {
          confidence_level: string;
          created_at?: string;
          id?: string;
          lesson_progress_id: string;
        };
        Update: {
          confidence_level?: string;
          created_at?: string;
          id?: string;
          lesson_progress_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "confidence_check_ins_lesson_progress_id_fkey";
            columns: ["lesson_progress_id"];
            isOneToOne: true;
            referencedRelation: "lesson_progress";
            referencedColumns: ["id"];
          },
        ];
      };
      journey_lessons: {
        Row: {
          created_at: string;
          day_number: number;
          display_order: number;
          id: string;
          journey_id: string;
          lesson_id: string;
          prerequisite_journey_lesson_id: string | null;
          published_at: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          status: string;
          updated_at: string;
          version: number;
        };
        Insert: {
          created_at?: string;
          day_number: number;
          display_order: number;
          id?: string;
          journey_id: string;
          lesson_id: string;
          prerequisite_journey_lesson_id?: string | null;
          published_at?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          status?: string;
          updated_at?: string;
          version?: number;
        };
        Update: {
          created_at?: string;
          day_number?: number;
          display_order?: number;
          id?: string;
          journey_id?: string;
          lesson_id?: string;
          prerequisite_journey_lesson_id?: string | null;
          published_at?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          status?: string;
          updated_at?: string;
          version?: number;
        };
        Relationships: [
          {
            foreignKeyName: "journey_lessons_journey_id_fkey";
            columns: ["journey_id"];
            isOneToOne: false;
            referencedRelation: "journeys";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "journey_lessons_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "journey_lessons_prerequisite_journey_lesson_id_fkey";
            columns: ["prerequisite_journey_lesson_id"];
            isOneToOne: false;
            referencedRelation: "journey_lessons";
            referencedColumns: ["id"];
          },
        ];
      };
      journeys: {
        Row: {
          created_at: string;
          description: string | null;
          duration_days: number;
          id: string;
          published_at: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          slug: string;
          status: string;
          title: string;
          updated_at: string;
          version: number;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          duration_days: number;
          id?: string;
          published_at?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          slug: string;
          status?: string;
          title: string;
          updated_at?: string;
          version?: number;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          duration_days?: number;
          id?: string;
          published_at?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          slug?: string;
          status?: string;
          title?: string;
          updated_at?: string;
          version?: number;
        };
        Relationships: [];
      };
      lesson_progress: {
        Row: {
          completed_at: string | null;
          created_at: string;
          id: string;
          journey_lesson_id: string;
          last_viewed_block: number;
          started_at: string | null;
          status: string;
          updated_at: string;
          user_journey_id: string;
          xp_awarded: number;
        };
        Insert: {
          completed_at?: string | null;
          created_at?: string;
          id?: string;
          journey_lesson_id: string;
          last_viewed_block?: number;
          started_at?: string | null;
          status?: string;
          updated_at?: string;
          user_journey_id: string;
          xp_awarded?: number;
        };
        Update: {
          completed_at?: string | null;
          created_at?: string;
          id?: string;
          journey_lesson_id?: string;
          last_viewed_block?: number;
          started_at?: string | null;
          status?: string;
          updated_at?: string;
          user_journey_id?: string;
          xp_awarded?: number;
        };
        Relationships: [
          {
            foreignKeyName: "lesson_progress_journey_lesson_id_fkey";
            columns: ["journey_lesson_id"];
            isOneToOne: false;
            referencedRelation: "journey_lessons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lesson_progress_user_journey_id_fkey";
            columns: ["user_journey_id"];
            isOneToOne: false;
            referencedRelation: "user_journeys";
            referencedColumns: ["id"];
          },
        ];
      };
      lessons: {
        Row: {
          content_blocks: Json;
          created_at: string;
          estimated_minutes: number;
          id: string;
          key_takeaway: string | null;
          learning_objective: string;
          primary_topic: string;
          published_at: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          slug: string;
          status: string;
          subtitle: string | null;
          title: string;
          updated_at: string;
          version: number;
        };
        Insert: {
          content_blocks?: Json;
          created_at?: string;
          estimated_minutes: number;
          id?: string;
          key_takeaway?: string | null;
          learning_objective: string;
          primary_topic: string;
          published_at?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          slug: string;
          status?: string;
          subtitle?: string | null;
          title: string;
          updated_at?: string;
          version?: number;
        };
        Update: {
          content_blocks?: Json;
          created_at?: string;
          estimated_minutes?: number;
          id?: string;
          key_takeaway?: string | null;
          learning_objective?: string;
          primary_topic?: string;
          published_at?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          slug?: string;
          status?: string;
          subtitle?: string | null;
          title?: string;
          updated_at?: string;
          version?: number;
        };
        Relationships: [];
      };
      medications: {
        Row: {
          brand_names: string[];
          category: string;
          content_blocks: Json;
          created_at: string;
          generic_name: string;
          id: string;
          published_at: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          search_text: string;
          search_vector: unknown;
          slug: string;
          status: string;
          updated_at: string;
          version: number;
        };
        Insert: {
          brand_names?: string[];
          category: string;
          content_blocks?: Json;
          created_at?: string;
          generic_name: string;
          id?: string;
          published_at?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          search_text?: string;
          search_vector?: unknown;
          slug: string;
          status?: string;
          updated_at?: string;
          version?: number;
        };
        Update: {
          brand_names?: string[];
          category?: string;
          content_blocks?: Json;
          created_at?: string;
          generic_name?: string;
          id?: string;
          published_at?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          search_text?: string;
          search_vector?: unknown;
          slug?: string;
          status?: string;
          updated_at?: string;
          version?: number;
        };
        Relationships: [];
      };
      patient_stories: {
        Row: {
          content_blocks: Json;
          created_at: string;
          id: string;
          introduction: string | null;
          journey_week: number | null;
          key_takeaway: string | null;
          published_at: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          slug: string;
          status: string;
          title: string;
          updated_at: string;
          version: number;
        };
        Insert: {
          content_blocks?: Json;
          created_at?: string;
          id?: string;
          introduction?: string | null;
          journey_week?: number | null;
          key_takeaway?: string | null;
          published_at?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          slug: string;
          status?: string;
          title: string;
          updated_at?: string;
          version?: number;
        };
        Update: {
          content_blocks?: Json;
          created_at?: string;
          id?: string;
          introduction?: string | null;
          journey_week?: number | null;
          key_takeaway?: string | null;
          published_at?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          slug?: string;
          status?: string;
          title?: string;
          updated_at?: string;
          version?: number;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string;
          display_name: string | null;
          id: string;
          onboarding_completed_at: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          display_name?: string | null;
          id: string;
          onboarding_completed_at?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          display_name?: string | null;
          id?: string;
          onboarding_completed_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      reflection_entries: {
        Row: {
          created_at: string;
          id: string;
          lesson_progress_id: string;
          reflection: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          lesson_progress_id: string;
          reflection: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          lesson_progress_id?: string;
          reflection?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reflection_entries_lesson_progress_id_fkey";
            columns: ["lesson_progress_id"];
            isOneToOne: false;
            referencedRelation: "lesson_progress";
            referencedColumns: ["id"];
          },
        ];
      };
      user_journeys: {
        Row: {
          completed_at: string | null;
          created_at: string;
          current_journey_lesson_id: string | null;
          id: string;
          journey_id: string;
          last_active_at: string;
          started_at: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          completed_at?: string | null;
          created_at?: string;
          current_journey_lesson_id?: string | null;
          id?: string;
          journey_id: string;
          last_active_at?: string;
          started_at?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          completed_at?: string | null;
          created_at?: string;
          current_journey_lesson_id?: string | null;
          id?: string;
          journey_id?: string;
          last_active_at?: string;
          started_at?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_journeys_current_journey_lesson_id_fkey";
            columns: ["current_journey_lesson_id"];
            isOneToOne: false;
            referencedRelation: "journey_lessons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_journeys_journey_id_fkey";
            columns: ["journey_id"];
            isOneToOne: false;
            referencedRelation: "journeys";
            referencedColumns: ["id"];
          },
        ];
      };
      user_settings: {
        Row: {
          created_at: string;
          locale: string;
          preferred_text_scale: string;
          reduced_motion: boolean;
          timezone: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          locale?: string;
          preferred_text_scale?: string;
          reduced_motion?: boolean;
          timezone?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          locale?: string;
          preferred_text_scale?: string;
          reduced_motion?: boolean;
          timezone?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      begin_or_resume_current_lesson: {
        Args: { p_day: number };
        Returns: {
          authorized_last_viewed_block: number;
          authorized_lesson_progress_id: string;
          authorized_lesson_status: string;
        }[];
      };
      complete_current_lesson: {
        Args: { p_lesson_progress_id: string };
        Returns: {
          first_time_completion: boolean;
          journey_completed: boolean;
          lesson_completed_at: string;
          next_day: number;
          next_route: string;
          total_xp_awarded: number;
          xp_awarded: number;
        }[];
      };
      complete_onboarding: {
        Args: {
          p_display_name: string;
          p_locale: string;
          p_preferred_text_scale: string;
          p_reduced_motion: boolean;
          p_timezone: string;
        };
        Returns: boolean;
      };
      evaluate_match_pair_activity: {
        Args: {
          p_activity_id: string;
          p_lesson_progress_id: string;
          p_response: Json;
        };
        Returns: {
          feedback_message: string;
          is_complete: boolean;
          is_correct: boolean;
        }[];
      };
      initialize_current_user_journey: {
        Args: never;
        Returns: {
          initialized_journey_lesson_id: string;
          initialized_lesson_progress_id: string;
          initialized_user_journey_id: string;
        }[];
      };
      save_lesson_block_position: {
        Args: { p_block_index: number; p_lesson_progress_id: string };
        Returns: {
          saved_last_viewed_block: number;
          saved_lesson_progress_id: string;
        }[];
      };
      upsert_confidence_check_in: {
        Args: { p_confidence_level: string; p_lesson_progress_id: string };
        Returns: {
          confidence_check_in_id: string;
          saved_confidence_level: string;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
