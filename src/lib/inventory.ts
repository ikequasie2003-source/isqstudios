import { gsmOptions, sizes, type Gsm, type Size } from "@/lib/products";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AvailabilityStatus = "in_stock" | "low_stock" | "out_of_stock";

export const LOW_STOCK_THRESHOLD = 5;

export type Variant = {
  sku: string;           // e.g. ISQ-TEE-230-BLK-M
  productId: string;     // e.g. tee-230-black
  gsm: Gsm;
  color: string;
  size: Size;
  price: number;
  qty: number;
  weight: number;        // grams — for shipping
  barcode?: string;
  availability: AvailabilityStatus;
};

// ─── SKU helpers ──────────────────────────────────────────────────────────────

const COLOR_CODE: Record<string, string> = {
  "Black":       "BLK",
  "Sea Blue":    "SBL",
  "White":       "WHT",
  "Cream":       "CRM",
  "Khaki":       "KHK",
  "Army Green":  "AGR",
  "Pink":        "PNK",
  "Wine":        "WIN",
};

const SIZE_CODE: Record<Size, string> = {
  S: "S", M: "M", L: "L", XL: "XL",
  "2XL": "2X", "3XL": "3X", "4XL": "4X",
};

export function buildSku(gsm: Gsm, color: string, size: Size): string {
  return `ISQ-TEE-${gsm}-${COLOR_CODE[color] ?? color.toUpperCase().slice(0, 3)}-${SIZE_CODE[size]}`;
}

function buildBarcode(gsm: Gsm, color: string, size: Size): string {
  // Deterministic fake EAN-13-style barcode for demo purposes
  const base = `${gsm}${(COLOR_CODE[color] ?? "XXX").replace(/[^0-9]/g, "0").padStart(3, "0")}${sizes.indexOf(size).toString().padStart(2, "0")}`;
  return `200${base}`.padEnd(12, "0").slice(0, 12) + "0";
}

// ─── Weight per GSM (grams, S/M/L/XL/2XL/3XL/4XL) ────────────────────────────

const GSM_WEIGHT: Record<Gsm, number> = {
  "230": 180,
  "260": 210,
  "320": 260,
};

// ─── Initial stock quantities ─────────────────────────────────────────────────

type StockMap = Record<string, Partial<Record<Size, number>>>;

const INITIAL_STOCK: StockMap = {
  // ── 230 GSM ──
  "tee-230-black":      { S: 12, M: 20, L: 15, XL: 8,  "2XL": 4, "3XL": 2, "4XL": 0 },
  "tee-230-sea-blue":   { S: 6,  M: 14, L: 10, XL: 5,  "2XL": 3, "3XL": 0, "4XL": 0 },
  "tee-230-white":      { S: 18, M: 22, L: 16, XL: 9,  "2XL": 5, "3XL": 3, "4XL": 1 },
  "tee-230-cream":      { S: 8,  M: 12, L: 9,  XL: 4,  "2XL": 2, "3XL": 1, "4XL": 0 },
  "tee-230-khaki":      { S: 10, M: 16, L: 12, XL: 6,  "2XL": 3, "3XL": 1, "4XL": 0 },
  "tee-230-army-green": { S: 7,  M: 11, L: 8,  XL: 3,  "2XL": 1, "3XL": 0, "4XL": 0 },
  "tee-230-pink":       { S: 14, M: 18, L: 13, XL: 7,  "2XL": 4, "3XL": 2, "4XL": 0 },
  "tee-230-wine":       { S: 5,  M: 9,  L: 7,  XL: 3,  "2XL": 1, "3XL": 0, "4XL": 0 },
  // ── 260 GSM ──
  "tee-260-black":      { S: 20, M: 30, L: 25, XL: 12, "2XL": 8, "3XL": 4, "4XL": 2 },
  "tee-260-sea-blue":   { S: 10, M: 18, L: 14, XL: 7,  "2XL": 4, "3XL": 2, "4XL": 0 },
  "tee-260-white":      { S: 22, M: 28, L: 20, XL: 11, "2XL": 6, "3XL": 3, "4XL": 1 },
  "tee-260-cream":      { S: 12, M: 16, L: 11, XL: 5,  "2XL": 3, "3XL": 1, "4XL": 0 },
  "tee-260-khaki":      { S: 15, M: 20, L: 16, XL: 8,  "2XL": 4, "3XL": 2, "4XL": 0 },
  "tee-260-army-green": { S: 9,  M: 14, L: 10, XL: 5,  "2XL": 2, "3XL": 1, "4XL": 0 },
  "tee-260-pink":       { S: 16, M: 22, L: 17, XL: 9,  "2XL": 5, "3XL": 2, "4XL": 0 },
  "tee-260-wine":       { S: 8,  M: 12, L: 9,  XL: 4,  "2XL": 2, "3XL": 0, "4XL": 0 },
  // ── 320 GSM ──
  "tee-320-black":      { S: 14, M: 22, L: 18, XL: 10, "2XL": 6, "3XL": 3, "4XL": 1 },
  "tee-320-sea-blue":   { S: 7,  M: 12, L: 9,  XL: 4,  "2XL": 2, "3XL": 0, "4XL": 0 },
  "tee-320-white":      { S: 16, M: 20, L: 15, XL: 8,  "2XL": 4, "3XL": 2, "4XL": 0 },
  "tee-320-cream":      { S: 9,  M: 13, L: 10, XL: 5,  "2XL": 2, "3XL": 1, "4XL": 0 },
  "tee-320-khaki":      { S: 11, M: 17, L: 13, XL: 6,  "2XL": 3, "3XL": 1, "4XL": 0 },
  "tee-320-pink":       { S: 12, M: 16, L: 12, XL: 6,  "2XL": 3, "3XL": 1, "4XL": 0 },
  "tee-320-wine":       { S: 5,  M: 8,  L: 6,  XL: 2,  "2XL": 0, "3XL": 0, "4XL": 0 },
  "tee-320-brown":      { S: 10, M: 15, L: 12, XL: 6,  "2XL": 3, "3XL": 1, "4XL": 0 },
  "tee-320-grey":       { S: 12, M: 18, L: 14, XL: 7,  "2XL": 4, "3XL": 2, "4XL": 0 },
};

// ─── Build full variant catalogue ─────────────────────────────────────────────

// Colors per GSM — mirrors products.ts
const colorsByGsm: Record<Gsm, string[]> = {
  "230": ["Black", "Sea Blue", "White", "Cream", "Khaki", "Army Green", "Pink", "Wine"],
  "260": ["Black", "Sea Blue", "White", "Cream", "Khaki", "Army Green", "Pink", "Wine"],
  "320": ["Black", "White", "Cream", "Khaki", "Pink", "Wine", "Brown", "Grey"],
};

const teeColorMeta: { color: string; gsm: Gsm }[] = gsmOptions.flatMap((g) =>
  colorsByGsm[g.value].map((color) => ({ color, gsm: g.value })),
);

function computeAvailability(qty: number): AvailabilityStatus {
  if (qty <= 0) return "out_of_stock";
  if (qty <= LOW_STOCK_THRESHOLD) return "low_stock";
  return "in_stock";
}

function productId(gsm: Gsm, color: string): string {
  return `tee-${gsm}-${color.toLowerCase().replace(/\s+/g, "-")}`;
}

function buildVariants(): Map<string, Variant> {
  const map = new Map<string, Variant>();

  for (const { color, gsm } of teeColorMeta) {
    const pid = productId(gsm, color);
    const gsmMeta = gsmOptions.find((g) => g.value === gsm)!;

    for (const size of sizes) {
      const qty = INITIAL_STOCK[pid]?.[size] ?? 0;
      const sku = buildSku(gsm, color, size);

      const variant: Variant = {
        sku,
        productId: pid,
        gsm,
        color,
        size,
        price: gsmMeta.price,
        qty,
        weight: GSM_WEIGHT[gsm],
        barcode: buildBarcode(gsm, color, size),
        availability: computeAvailability(qty),
      };

      map.set(sku, variant);
    }
  }

  return map;
}

// ─── Reactive inventory store ─────────────────────────────────────────────────
// Single module-level Map — acts as an in-memory store for the session.
// In a real app this would be backed by a database / API.

const variantStore: Map<string, Variant> = buildVariants();

// ── Read ──────────────────────────────────────────────────────────────────────

export function getVariant(gsm: Gsm, color: string, size: Size): Variant | undefined {
  return variantStore.get(buildSku(gsm, color, size));
}

export function getVariantBySku(sku: string): Variant | undefined {
  return variantStore.get(sku);
}

/** All variants for a product (gsm + color), keyed by size */
export function getVariantsForProduct(
  gsm: Gsm,
  color: string,
): Record<Size, Variant> {
  return Object.fromEntries(
    sizes.map((s) => [s, getVariant(gsm, color, s)!]),
  ) as Record<Size, Variant>;
}

/** Qty for a specific variant — 0 if not found */
export function getQty(gsm: Gsm, color: string, size: Size): number {
  return getVariant(gsm, color, size)?.qty ?? 0;
}

/** Total qty across all sizes for a gsm + color */
export function getTotalQty(gsm: Gsm, color: string): number {
  return sizes.reduce((sum, s) => sum + getQty(gsm, color, s), 0);
}

/** Availability for a specific variant */
export function getAvailability(gsm: Gsm, color: string, size: Size): AvailabilityStatus {
  return getVariant(gsm, color, size)?.availability ?? "out_of_stock";
}

/** Is a variant orderable (qty > 0) */
export function isAvailable(gsm: Gsm, color: string, size: Size): boolean {
  return getQty(gsm, color, size) > 0;
}

// ── Write ─────────────────────────────────────────────────────────────────────

export type DecrementResult =
  | { ok: true; variant: Variant }
  | { ok: false; reason: "out_of_stock" | "insufficient_stock" | "not_found"; available: number };

/**
 * Decrement stock for a variant by `qty`.
 * Returns ok:false if stock is insufficient — caller should block the order.
 */
export function decrementStock(
  gsm: Gsm,
  color: string,
  size: Size,
  qty = 1,
): DecrementResult {
  const sku = buildSku(gsm, color, size);
  const variant = variantStore.get(sku);

  if (!variant) return { ok: false, reason: "not_found", available: 0 };
  if (variant.qty <= 0) return { ok: false, reason: "out_of_stock", available: 0 };
  if (variant.qty < qty) return { ok: false, reason: "insufficient_stock", available: variant.qty };

  const updated: Variant = {
    ...variant,
    qty: variant.qty - qty,
    availability: computeAvailability(variant.qty - qty),
  };

  variantStore.set(sku, updated);
  return { ok: true, variant: updated };
}

/**
 * Increment stock (e.g. order cancelled / restocked).
 */
export function incrementStock(gsm: Gsm, color: string, size: Size, qty = 1): Variant | undefined {
  const sku = buildSku(gsm, color, size);
  const variant = variantStore.get(sku);
  if (!variant) return undefined;

  const updated: Variant = {
    ...variant,
    qty: variant.qty + qty,
    availability: computeAvailability(variant.qty + qty),
  };

  variantStore.set(sku, updated);
  return updated;
}

// ── Summary helpers ───────────────────────────────────────────────────────────

export type InventorySummary = {
  totalVariants: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  totalUnits: number;
};

export function getInventorySummary(): InventorySummary {
  let inStock = 0, lowStock = 0, outOfStock = 0, totalUnits = 0;

  for (const v of variantStore.values()) {
    totalUnits += v.qty;
    if (v.availability === "in_stock") inStock++;
    else if (v.availability === "low_stock") lowStock++;
    else outOfStock++;
  }

  return {
    totalVariants: variantStore.size,
    inStock,
    lowStock,
    outOfStock,
    totalUnits,
  };
}

export function getAllVariants(): Variant[] {
  return Array.from(variantStore.values());
}
