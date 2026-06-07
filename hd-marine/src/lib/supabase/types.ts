// Otomatik üretildi: Supabase MCP generate_typescript_types (7 Haziran 2026)
// Şema değişince yeniden üretilmeli.
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
      catalog_translations: {
        Row: {
          catalog_id: string
          description: string | null
          id: string
          locale: string
          title: string
        }
        Insert: {
          catalog_id: string
          description?: string | null
          id?: string
          locale: string
          title: string
        }
        Update: {
          catalog_id?: string
          description?: string | null
          id?: string
          locale?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "catalog_translations_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "catalogs"
            referencedColumns: ["id"]
          },
        ]
      }
      catalogs: {
        Row: {
          cover_image_path: string | null
          file_path: string
          id: string
          is_active: boolean
          sort_order: number
        }
        Insert: {
          cover_image_path?: string | null
          file_path: string
          id?: string
          is_active?: boolean
          sort_order?: number
        }
        Update: {
          cover_image_path?: string | null
          file_path?: string
          id?: string
          is_active?: boolean
          sort_order?: number
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          image_path: string | null
          is_active: boolean
          parent_id: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_path?: string | null
          is_active?: boolean
          parent_id?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_path?: string | null
          is_active?: boolean
          parent_id?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      category_translations: {
        Row: {
          category_id: string
          description: string | null
          id: string
          locale: string
          meta_description: string | null
          meta_title: string | null
          name: string
          slug: string
          translation_status: string
        }
        Insert: {
          category_id: string
          description?: string | null
          id?: string
          locale: string
          meta_description?: string | null
          meta_title?: string | null
          name: string
          slug: string
          translation_status?: string
        }
        Update: {
          category_id?: string
          description?: string | null
          id?: string
          locale?: string
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          slug?: string
          translation_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_translations_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          locale: string
          message: string
          phone: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          locale?: string
          message: string
          phone?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          locale?: string
          message?: string
          phone?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      page_translations: {
        Row: {
          content: Json
          id: string
          locale: string
          meta_description: string | null
          meta_title: string | null
          page_id: string
          slug: string | null
          title: string
          translation_status: string
        }
        Insert: {
          content?: Json
          id?: string
          locale: string
          meta_description?: string | null
          meta_title?: string | null
          page_id: string
          slug?: string | null
          title: string
          translation_status?: string
        }
        Update: {
          content?: Json
          id?: string
          locale?: string
          meta_description?: string | null
          meta_title?: string | null
          page_id?: string
          slug?: string | null
          title?: string
          translation_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_translations_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          id: string
          key: string
        }
        Insert: {
          id?: string
          key: string
        }
        Update: {
          id?: string
          key?: string
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          category_id: string
          product_id: string
        }
        Insert: {
          category_id: string
          product_id: string
        }
        Update: {
          category_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_categories_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_faq_translations: {
        Row: {
          answer: string
          faq_id: string
          id: string
          locale: string
          question: string
        }
        Insert: {
          answer: string
          faq_id: string
          id?: string
          locale: string
          question: string
        }
        Update: {
          answer?: string
          faq_id?: string
          id?: string
          locale?: string
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_faq_translations_faq_id_fkey"
            columns: ["faq_id"]
            isOneToOne: false
            referencedRelation: "product_faqs"
            referencedColumns: ["id"]
          },
        ]
      }
      product_faqs: {
        Row: {
          id: string
          product_id: string
          sort_order: number
        }
        Insert: {
          id?: string
          product_id: string
          sort_order?: number
        }
        Update: {
          id?: string
          product_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_faqs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt_en: string | null
          alt_tr: string | null
          id: string
          is_primary: boolean
          product_id: string
          sort_order: number
          storage_path: string
        }
        Insert: {
          alt_en?: string | null
          alt_tr?: string | null
          id?: string
          is_primary?: boolean
          product_id: string
          sort_order?: number
          storage_path: string
        }
        Update: {
          alt_en?: string | null
          alt_tr?: string | null
          id?: string
          is_primary?: boolean
          product_id?: string
          sort_order?: number
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_spec_translations: {
        Row: {
          id: string
          label: string
          locale: string
          spec_id: string
          value: string
        }
        Insert: {
          id?: string
          label: string
          locale: string
          spec_id: string
          value: string
        }
        Update: {
          id?: string
          label?: string
          locale?: string
          spec_id?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_spec_translations_spec_id_fkey"
            columns: ["spec_id"]
            isOneToOne: false
            referencedRelation: "product_specs"
            referencedColumns: ["id"]
          },
        ]
      }
      product_specs: {
        Row: {
          id: string
          product_id: string
          sort_order: number
        }
        Insert: {
          id?: string
          product_id: string
          sort_order?: number
        }
        Update: {
          id?: string
          product_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_specs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_translations: {
        Row: {
          description: string | null
          id: string
          locale: string
          meta_description: string | null
          meta_title: string | null
          name: string
          product_id: string
          slug: string
          summary: string | null
          translation_status: string
          usage_areas: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          locale: string
          meta_description?: string | null
          meta_title?: string | null
          name: string
          product_id: string
          slug: string
          summary?: string | null
          translation_status?: string
          usage_areas?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          locale?: string
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          product_id?: string
          slug?: string
          summary?: string | null
          translation_status?: string
          usage_areas?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_translations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string | null
          created_at: string
          id: string
          is_active: boolean
          is_featured: boolean
          legacy_url: string | null
          legacy_wp_id: number | null
          primary_category_id: string
          sku: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          brand?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          is_featured?: boolean
          legacy_url?: string | null
          legacy_wp_id?: number | null
          primary_category_id: string
          sku?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          brand?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          is_featured?: boolean
          legacy_url?: string | null
          legacy_wp_id?: number | null
          primary_category_id?: string
          sku?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_primary_category_id_fkey"
            columns: ["primary_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          role: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          role?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          role?: string
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          company: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          locale: string
          message: string | null
          phone: string | null
          product_group: string | null
          product_id: string | null
          status: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          locale?: string
          message?: string | null
          phone?: string | null
          product_group?: string | null
          product_id?: string | null
          status?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          locale?: string
          message?: string | null
          phone?: string | null
          product_group?: string | null
          product_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_requests_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      redirects: {
        Row: {
          id: string
          new_path: string
          old_path: string
          status_code: number
        }
        Insert: {
          id?: string
          new_path: string
          old_path: string
          status_code?: number
        }
        Update: {
          id?: string
          new_path?: string
          old_path?: string
          status_code?: number
        }
        Relationships: []
      }
      sector_translations: {
        Row: {
          description: string | null
          id: string
          locale: string
          meta_description: string | null
          meta_title: string | null
          name: string
          sector_id: string
          slug: string
          translation_status: string
        }
        Insert: {
          description?: string | null
          id?: string
          locale: string
          meta_description?: string | null
          meta_title?: string | null
          name: string
          sector_id: string
          slug: string
          translation_status?: string
        }
        Update: {
          description?: string | null
          id?: string
          locale?: string
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          sector_id?: string
          slug?: string
          translation_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "sector_translations_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      sectors: {
        Row: {
          id: string
          image_path: string | null
          is_active: boolean
          sort_order: number
        }
        Insert: {
          id?: string
          image_path?: string | null
          is_active?: boolean
          sort_order?: number
        }
        Update: {
          id?: string
          image_path?: string | null
          is_active?: boolean
          sort_order?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
