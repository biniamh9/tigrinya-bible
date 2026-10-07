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
      bible_translations: {
        Row: { id: string; code: string; name: string; language: string; copyright: string | null; license_information: string | null; is_active: boolean };
        Insert: { id?: string; code: string; name: string; language: string; copyright?: string | null; license_information?: string | null; is_active?: boolean };
        Update: { code?: string; name?: string; language?: string; copyright?: string | null; license_information?: string | null; is_active?: boolean };
        Relationships: [];
      };
      bible_books: {
        Row: { id: string; canonical_order: number; testament: "old" | "new"; english_name: string; tigrinya_name: string; abbreviation: string; slug: string };
        Insert: { id?: string; canonical_order: number; testament: "old" | "new"; english_name: string; tigrinya_name: string; abbreviation: string; slug: string };
        Update: { canonical_order?: number; testament?: "old" | "new"; english_name?: string; tigrinya_name?: string; abbreviation?: string; slug?: string };
        Relationships: [];
      };
      bible_verses: {
        Row: { id: string; translation_id: string; book_id: string; chapter_number: number; verse_number: number; text: string };
        Insert: { id?: string; translation_id: string; book_id: string; chapter_number: number; verse_number: number; text: string };
        Update: { text?: string };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      app_role: "user" | "admin";
      profile_language: "ti" | "en";
      testament: "old" | "new";
    };
    CompositeTypes: Record<string, never>;
  };
};
