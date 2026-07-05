/**
 * Database service — all Supabase queries live here.
 * Components import from this file, never directly from supabase.ts
 */
import { supabase } from "@/lib/supabase";
import { getAllVariants, type Variant } from "@/lib/inventory";
import type { CartItem } from "@/lib/cart";

// ─── Variants ────────────────────────────────────────────────────────────────

/** Seed all variants from the in-memory store into Supabase (run once) */
export async function seedVariants(): Promise<{ ok: boolean; error?: string }> {
  const variants = getAllVariants();
  const rows = variants.map((v) => ({
    sku: v.sku,
    product_id: v.productId,
    gsm: v.gsm,
    color: v.color,
    size: v.size,
    price: v.price,
    qty: v.qty,
    weight: v.weight,
    barcode: v.barcode ?? null,
    availability: v.availability,
  }));

  const { error } = await supabase
    .from("variants")
    .upsert(rows, { onConflict: "sku" });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** Get a single variant by SKU */
export async function fetchVariant(sku: string) {
  const { data, error } = await supabase
    .from("variants")
    .select("*")
    .eq("sku", sku)
    .single();
  return { data, error };
}

/** Get all variants */
export async function fetchAllVariants() {
  const { data, error } = await supabase
    .from("variants")
    .select("*")
    .order("sku");
  return { data, error };
}

/** Decrement stock in DB */
export async function dbDecrementStock(sku: string, qty: number) {
  const { data: variant, error: fetchErr } = await fetchVariant(sku);
  if (fetchErr || !variant) return { ok: false, error: fetchErr?.message ?? "Not found" };
  if (variant.qty < qty) return { ok: false, error: "Insufficient stock", available: variant.qty };

  const newQty = variant.qty - qty;
  const availability =
    newQty === 0 ? "out_of_stock" : newQty <= 5 ? "low_stock" : "in_stock";

  const { error } = await supabase
    .from("variants")
    .update({ qty: newQty, availability })
    .eq("sku", sku);

  return error ? { ok: false, error: error.message } : { ok: true, newQty };
}

/** Update stock qty directly (admin) */
export async function dbSetStock(sku: string, qty: number) {
  const availability =
    qty === 0 ? "out_of_stock" : qty <= 5 ? "low_stock" : "in_stock";
  const { error } = await supabase
    .from("variants")
    .update({ qty, availability })
    .eq("sku", sku);
  return error ? { ok: false, error: error.message } : { ok: true };
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export type CreateOrderParams = {
  customerEmail?: string;
  customerName?: string;
  items: CartItem[];
  subtotal: number;
  shipping?: number;
};

/** Create an order + order items in one transaction */
export async function createOrder(params: CreateOrderParams) {
  const shipping = params.shipping ?? (params.subtotal >= 150 ? 0 : 12);
  const total = params.subtotal + shipping;

  // 1. Insert order
  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .insert({
      customer_email: params.customerEmail ?? null,
      customer_name: params.customerName ?? null,
      status: "pending",
      subtotal: params.subtotal,
      shipping,
      total,
    })
    .select()
    .single();

  if (orderErr || !order) return { ok: false, error: orderErr?.message };

  // 2. Insert order items
  const itemRows = params.items.map((item) => ({
    order_id: order.id,
    sku: item.sku,
    product_name: item.name,
    color: item.color,
    size: item.size,
    gsm: item.gsm ?? null,
    price: item.price,
    qty: item.qty,
    image_url: item.image ?? null,
  }));

  const { error: itemsErr } = await supabase
    .from("order_items")
    .insert(itemRows);

  if (itemsErr) return { ok: false, error: itemsErr.message };

  // 3. Decrement stock for each item
  for (const item of params.items) {
    await dbDecrementStock(item.sku, item.qty);
  }

  return { ok: true, orderId: order.id };
}

/** Fetch all orders (admin) */
export async function fetchOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });
  return { data, error };
}

/** Update order status (admin) */
export async function updateOrderStatus(
  orderId: string,
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled",
) {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);
  return error ? { ok: false, error: error.message } : { ok: true };
}

// ─── Media ───────────────────────────────────────────────────────────────────

export async function fetchMedia() {
  const { data, error } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });
  return { data, error };
}

export async function insertMedia(entry: {
  label: string;
  category: "tee" | "cap";
  gsm?: string;
  color: string;
  angle: string;
  url: string;
  filename: string;
}) {
  const { data, error } = await supabase
    .from("media")
    .insert({ ...entry, gsm: entry.gsm ?? null })
    .select()
    .single();
  return { data, error };
}

export async function deleteMedia(id: string) {
  const { error } = await supabase.from("media").delete().eq("id", id);
  return error ? { ok: false, error: error.message } : { ok: true };
}
