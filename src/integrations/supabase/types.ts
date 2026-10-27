export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      applications: {
        Row: {
          applied_at: string;
          company: string;
          id: string;
          kind: string;
          note: string | null;
          ref_id: string;
          resume_name: string;
          stage: string;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          applied_at?: string;
          company: string;
          id?: string;
          kind: string;
          note?: string | null;
          ref_id: string;
          resume_name?: string;
          stage?: string;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          applied_at?: string;
          company?: string;
          id?: string;
          kind?: string;
          note?: string | null;
          ref_id?: string;
          resume_name?: string;
          stage?: string;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      career_artifacts: {
        Row: {
          data: Json;
          id: string;
          kind: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          data?: Json;
          id?: string;
          kind: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          data?: Json;
          id?: string;
          kind?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      certificates: {
        Row: {
          code: string;
          grade: string;
          id: string;
          issued_on: string;
          program_id: string;
          skills: string[];
          title: string;
          user_id: string;
        };
        Insert: {
          code: string;
          grade?: string;
          id?: string;
          issued_on?: string;
          program_id?: string;
          skills?: string[];
          title: string;
          user_id: string;
        };
        Update: {
          code?: string;
          grade?: string;
          id?: string;
          issued_on?: string;
          program_id?: string;
          skills?: string[];
          title?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      course_enrollments: {
        Row: {
          course_id: string;
          enrolled_at: string;
          id: string;
          progress: number;
          title: string;
          user_id: string;
        };
        Insert: {
          course_id: string;
          enrolled_at?: string;
          id?: string;
          progress?: number;
          title?: string;
          user_id: string;
        };
        Update: {
          course_id?: string;
          enrolled_at?: string;
          id?: string;
          progress?: number;
          title?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      enrollments: {
        Row: {
          current_lesson: string;
          enrolled_at: string;
          id: string;
          program_id: string;
          progress: number;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          current_lesson?: string;
          enrolled_at?: string;
          id?: string;
          program_id: string;
          progress?: number;
          status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          current_lesson?: string;
          enrolled_at?: string;
          id?: string;
          program_id?: string;
          progress?: number;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      lesson_progress: {
        Row: {
          completed: boolean;
          completed_at: string;
          id: string;
          lesson_id: string;
          program_id: string;
          user_id: string;
        };
        Insert: {
          completed?: boolean;
          completed_at?: string;
          id?: string;
          lesson_id: string;
          program_id: string;
          user_id: string;
        };
        Update: {
          completed?: boolean;
          completed_at?: string;
          id?: string;
          lesson_id?: string;
          program_id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      mentorship_bookings: {
        Row: {
          created_at: string;
          id: string;
          mentor_id: string;
          mentor_name: string;
          slot: string;
          status: string;
          topic: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          mentor_id: string;
          mentor_name?: string;
          slot?: string;
          status?: string;
          topic?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          mentor_id?: string;
          mentor_name?: string;
          slot?: string;
          status?: string;
          topic?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          body: string;
          created_at: string;
          href: string | null;
          icon: string;
          id: string;
          read: boolean;
          title: string;
          user_id: string;
        };
        Insert: {
          body?: string;
          created_at?: string;
          href?: string | null;
          icon?: string;
          id?: string;
          read?: boolean;
          title: string;
          user_id: string;
        };
        Update: {
          body?: string;
          created_at?: string;
          href?: string | null;
          icon?: string;
          id?: string;
          read?: boolean;
          title?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          about: string;
          address: string;
          avatar: string;
          bio: string;
          career_preference: string;
          created_at: string;
          date_of_birth: string | null;
          education: Json;
          email: string;
          experience: Json;
          headline: string;
          id: string;
          links: Json;
          location: string;
          name: string;
          phone: string;
          profile_completion: number;
          resume_score: number;
          skills: string[];
          updated_at: string;
        };
        Insert: {
          about?: string;
          address?: string;
          avatar?: string;
          bio?: string;
          career_preference?: string;
          created_at?: string;
          date_of_birth?: string | null;
          education?: Json;
          email?: string;
          experience?: Json;
          headline?: string;
          id: string;
          links?: Json;
          location?: string;
          name?: string;
          phone?: string;
          profile_completion?: number;
          resume_score?: number;
          skills?: string[];
          updated_at?: string;
        };
        Update: {
          about?: string;
          address?: string;
          avatar?: string;
          bio?: string;
          career_preference?: string;
          created_at?: string;
          date_of_birth?: string | null;
          education?: Json;
          email?: string;
          experience?: Json;
          headline?: string;
          id?: string;
          links?: Json;
          location?: string;
          name?: string;
          phone?: string;
          profile_completion?: number;
          resume_score?: number;
          skills?: string[];
          updated_at?: string;
        };
        Relationships: [];
      };
      resumes: {
        Row: {
          data: Json;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          data?: Json;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          data?: Json;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      saved_items: {
        Row: {
          created_at: string;
          id: string;
          item_id: string;
          item_type: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          item_id: string;
          item_type: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          item_id?: string;
          item_type?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      user_projects: {
        Row: {
          created_at: string;
          demo_url: string | null;
          due_date: string;
          id: string;
          program: string;
          progress: number;
          project_key: string;
          repo_url: string | null;
          stack: string[];
          stage: string;
          summary: string;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          demo_url?: string | null;
          due_date?: string;
          id?: string;
          program?: string;
          progress?: number;
          project_key: string;
          repo_url?: string | null;
          stack?: string[];
          stage?: string;
          summary?: string;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          demo_url?: string | null;
          due_date?: string;
          id?: string;
          program?: string;
          progress?: number;
          project_key?: string;
          repo_url?: string | null;
          stack?: string[];
          stage?: string;
          summary?: string;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "student" | "admin" | "mentor" | "recruiter";
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
  public: {
    Enums: {
      app_role: ["student", "admin", "mentor", "recruiter"],
    },
  },
} as const;
