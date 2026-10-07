// Placeholder generated-type surface. Run `npm run types:database` after the
// local database is running; the Supabase CLI will replace this file.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          avatar_url: string | null;
          preferred_language: "ti" | "en";
          role: "user" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name: string;
          avatar_url?: string | null;
          preferred_language?: "ti" | "en";
          role?: "user" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          display_name?: string;
          avatar_url?: string | null;
          preferred_language?: "ti" | "en";
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      app_role: "user" | "admin";
      profile_language: "ti" | "en";
    };
    CompositeTypes: Record<string, never>;
  };
};
