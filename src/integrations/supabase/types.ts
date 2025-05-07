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
      focus_sessions: {
        Row: {
          completed: boolean
          created_at: string
          duration: number
          id: string
          mode: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          duration: number
          id?: string
          mode: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          duration?: number
          id?: string
          mode?: string
          user_id?: string
        }
        Relationships: []
      }
      note_tasks: {
        Row: {
          completed: boolean
          created_at: string
          id: string
          note_id: string
          text: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          id?: string
          note_id: string
          text: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          id?: string
          note_id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "note_tasks_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          color: string
          content: string | null
          created_at: string
          id: string
          party_id: string | null
          pinned: boolean
          title: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string
          content?: string | null
          created_at?: string
          id?: string
          party_id?: string | null
          pinned?: boolean
          title?: string | null
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string
          content?: string | null
          created_at?: string
          id?: string
          party_id?: string | null
          pinned?: boolean
          title?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "study_parties"
            referencedColumns: ["id"]
          },
        ]
      }
      party_members: {
        Row: {
          id: string
          joined_at: string
          party_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          party_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          party_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "party_members_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "study_parties"
            referencedColumns: ["id"]
          },
        ]
      }
      party_tasks: {
        Row: {
          completed: boolean
          created_at: string
          created_by: string
          id: string
          party_id: string
          text: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          created_by: string
          id?: string
          party_id: string
          text: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          created_by?: string
          id?: string
          party_id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "party_tasks_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "study_parties"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          id: string
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      study_parties: {
        Row: {
          code: string
          created_at: string
          created_by: string
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          created_by: string
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string
          id?: string
          name?: string
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
    Enums: {},
  },
} as const
