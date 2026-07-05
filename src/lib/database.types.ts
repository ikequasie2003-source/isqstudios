export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      variants: {
        Row: {
          id: string;
          sku: string;
          product_id: string;
          gsm: string;
          color: string;
          size: string;
          price: number;
          qty: number;
          weight: number;
          barcode: string | null;
          availability: "in_stock" | "low_stock" | "out_of_stock";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["variants"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["variants"]["Insert"]>;
      };
      orders: {
        Row: {
          id: string;
          customer_email: string | null;
          customer_name: string | null;
          status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
          subtotal: number;
          shipping: number;
          total: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["orders"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          sku: string;
          product_name: string;
          color: string;
          size: string;
          gsm: string | null;
          price: number;
          qty: number;
          image_url: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["order_items"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
      };
      media: {
        Row: {
          id: string;
          label: string;
          category: "tee" | "cap";
          gsm: string | null;
          color: string;
          angle: string;
          url: string;
          filename: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["media"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["media"]["Insert"]>;
      };
    };
  };
};
