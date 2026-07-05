import { tees, caps, gsmOptions, type Product, type Gsm } from "@/lib/products";

export type SearchResult = {
  product: Product;
  matchedTerms: string[];  // what the query matched on
  score: number;
};

// Token aliases — maps user-friendly terms to canonical values
const GSM_ALIASES: Record<string, Gsm> = {
  "230": "230", "230gsm": "230", "230 gsm": "230", "light": "230", "lightweight": "230",
  "260": "260", "260gsm": "260", "260 gsm": "260", "mid": "260", "midweight": "260", "standard": "260",
  "320": "320", "320gsm": "320", "320 gsm": "320", "heavy": "320", "heavyweight": "320",
};

const COLOR_ALIASES: Record<string, string> = {
  "black": "Black", "blk": "Black",
  "sea blue": "Sea Blue", "seablue": "Sea Blue", "blue": "Sea Blue", "navy": "Sea Blue",
  "white": "White", "wht": "White",
  "cream": "Cream", "off white": "Cream", "offwhite": "Cream", "beige": "Cream",
  "khaki": "Khaki", "tan": "Khaki", "sand": "Khaki",
  "army green": "Army Green", "armygreen": "Army Green", "army": "Army Green", "green": "Army Green", "olive": "Army Green",
  "pink": "Pink", "rose": "Pink", "blush": "Pink",
  "wine": "Wine", "burgundy": "Wine", "red": "Wine", "maroon": "Wine", "bordeaux": "Wine",
};

const SIZE_ALIASES: Record<string, string> = {
  "s": "S", "small": "S",
  "m": "M", "medium": "M", "med": "M",
  "l": "L", "large": "L",
  "xl": "XL", "extralarge": "XL", "extra large": "XL",
  "2xl": "2XL", "xxl": "2XL", "2x": "2XL",
  "3xl": "3XL", "xxxl": "3XL", "3x": "3XL",
  "4xl": "4XL", "xxxxl": "4XL", "4x": "4XL",
};

const PRODUCT_ALIASES: Record<string, string> = {
  "tee": "tee", "t-shirt": "tee", "tshirt": "tee", "shirt": "tee", "top": "tee", "essential": "tee",
  "cap": "cap", "hat": "cap", "trucker": "cap", "trucker cap": "cap",
};

// Normalise a raw query string into tokens
function tokenise(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

// Try to match multi-word aliases (e.g. "army green", "sea blue")
function extractMultiWordTokens(q: string): { gsm?: Gsm; colors: string[]; sizes: string[]; category?: string } {
  const lower = q.toLowerCase();
  const result: { gsm?: Gsm; colors: string[]; sizes: string[]; category?: string } = {
    colors: [],
    sizes: [],
  };

  // Multi-word color check first
  for (const [alias, canonical] of Object.entries(COLOR_ALIASES)) {
    if (lower.includes(alias) && !result.colors.includes(canonical)) {
      result.colors.push(canonical);
    }
  }

  // GSM check
  for (const [alias, canonical] of Object.entries(GSM_ALIASES)) {
    if (lower.includes(alias)) {
      result.gsm = canonical;
      break;
    }
  }

  // Size check (whole word)
  for (const [alias, canonical] of Object.entries(SIZE_ALIASES)) {
    const re = new RegExp(`\\b${alias}\\b`);
    if (re.test(lower) && !result.sizes.includes(canonical)) {
      result.sizes.push(canonical);
    }
  }

  // Category
  for (const [alias, canonical] of Object.entries(PRODUCT_ALIASES)) {
    if (lower.includes(alias)) {
      result.category = canonical;
      break;
    }
  }

  return result;
}

export function search(query: string): SearchResult[] {
  const q = query.trim();
  if (q.length < 1) return [];

  const all: Product[] = [...tees, ...caps];
  const { gsm, colors, sizes, category } = extractMultiWordTokens(q);
  const tokens = tokenise(q);

  const results: SearchResult[] = [];

  for (const product of all) {
    let score = 0;
    const matched: string[] = [];

    // ── Category filter ──
    if (category && product.category !== category) continue;

    // ── GSM match ──
    if (gsm) {
      if (product.gsm === gsm) {
        score += 30;
        matched.push(`${gsm} GSM`);
      } else if (product.gsm !== undefined) {
        // GSM specified but doesn't match — skip
        continue;
      }
    }

    // ── Color match ──
    if (colors.length > 0) {
      const colorMatch = colors.find(
        (c) => product.color.toLowerCase() === c.toLowerCase()
      );
      if (colorMatch) {
        score += 40;
        matched.push(colorMatch);
      } else {
        // Color specified but doesn't match — skip
        continue;
      }
    }

    // ── Size match (informational — all sizes available, boost score) ──
    if (sizes.length > 0) {
      score += 10;
      matched.push(...sizes);
    }

    // ── Loose token matching for partial queries ──
    for (const token of tokens) {
      // Skip tokens already fully handled above
      const isGsmToken = Object.keys(GSM_ALIASES).some((a) => a === token);
      const isColorToken = Object.keys(COLOR_ALIASES).some((a) => a === token);
      const isSizeToken = Object.keys(SIZE_ALIASES).some((a) => a === token);
      const isCategoryToken = Object.keys(PRODUCT_ALIASES).some((a) => a === token);

      if (isGsmToken || isColorToken || isSizeToken || isCategoryToken) continue;

      // Match against product name, color, gsm
      const productText = `${product.name} ${product.color} ${product.gsm ?? ""} ${product.category}`.toLowerCase();
      if (productText.includes(token)) {
        score += 5;
        matched.push(token);
      }
    }

    // Only include products with a match
    if (score > 0 || (q.length >= 2 && matched.length > 0)) {
      results.push({ product, matchedTerms: [...new Set(matched)], score });
    }
  }

  // If no structured match, fall back to fuzzy name search
  if (results.length === 0 && q.length >= 2) {
    const lower = q.toLowerCase();
    for (const product of all) {
      const text = `${product.name} ${product.color} ${product.gsm ?? ""} ${product.category}`.toLowerCase();
      if (text.includes(lower)) {
        results.push({ product, matchedTerms: [q], score: 1 });
      }
    }
  }

  // Sort by score desc, then deduplicate by showing best variant per color+gsm
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);
}

// Generate search suggestions from a partial query
export function getSuggestions(query: string): string[] {
  const q = query.toLowerCase().trim();
  if (q.length < 1) return [];

  const suggestions = new Set<string>();

  // GSM suggestions
  for (const g of gsmOptions) {
    if (g.label.toLowerCase().includes(q) || q.includes(g.value)) {
      suggestions.add(g.label);
    }
  }

  // Color suggestions
  const colors = ["Black", "Sea Blue", "White", "Cream", "Khaki", "Army Green", "Pink", "Wine"];
  for (const c of colors) {
    if (c.toLowerCase().includes(q)) suggestions.add(c);
  }

  // Combined suggestions
  if (q.length >= 3) {
    for (const g of gsmOptions) {
      for (const c of colors) {
        const combo = `${g.label} ${c}`;
        if (combo.toLowerCase().includes(q)) suggestions.add(combo);
      }
    }
  }

  // Category suggestions
  if ("tee".includes(q) || "shirt".includes(q)) suggestions.add("Essential Tee");
  if ("cap".includes(q) || "hat".includes(q)) suggestions.add("Trucker Cap");

  return Array.from(suggestions).slice(0, 6);
}
