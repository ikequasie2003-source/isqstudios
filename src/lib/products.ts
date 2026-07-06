import teeBlack from "@/assets/tee-black.jpg";
import teeWhite from "@/assets/tee-white.jpg";
import capBlack from "@/assets/cap-black.jpg";

export type Gsm = "230" | "260" | "320";

export type ProductImage = {
  src: string | null; // null = use color swatch placeholder
  label: string;      // "Front" | "Back" | "Folded" | "Close-up"
};

export type Product = {
  id: string;
  name: string;
  color: string;
  price: number;
  swatch: string;
  image?: string;
  category: "tee" | "cap";
  gsm?: Gsm;
};

export const gsmOptions: { value: Gsm; label: string; price: number; blurb: string }[] = [
  { value: "230", label: "230 GSM", price: 42, blurb: "Lightweight — softer drape, everyday layering." },
  { value: "260", label: "260 GSM", price: 48, blurb: "Midweight — the studio standard." },
  { value: "320", label: "320 GSM", price: 58, blurb: "Heavyweight — structured, boxy, built to last." },
];

// Unsplash images per angle — curated tee lifestyle shots
const ANGLE_IMGS = {
  front_dark:  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=85",
  back_dark:   "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=900&q=85",
  folded_dark: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=900&q=85",
  closeup_dark:"https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=900&q=85",
  front_light: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=900&q=85",
  back_light:  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=900&q=85",
  folded_light:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900&q=85",
  closeup_light:"https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=900&q=85",
};

// Returns 4 gallery images for a given gsm + color
export function getGalleryImages(gsm: Gsm, color: string): ProductImage[] {
  const isLightColor = ["White", "Cream", "Pink"].includes(color);
  const hasDarkImg = ["Black", "Wine", "Army Green"].includes(color);

  if (color === "Black") {
    return [
      { src: teeBlack,              label: "Front"    },
      { src: ANGLE_IMGS.back_dark,  label: "Back"     },
      { src: ANGLE_IMGS.folded_dark,label: "Folded"   },
      { src: ANGLE_IMGS.closeup_dark,label:"Close-up" },
    ];
  }
  if (color === "White") {
    return [
      { src: teeWhite,               label: "Front"   },
      { src: ANGLE_IMGS.back_light,  label: "Back"    },
      { src: ANGLE_IMGS.folded_light,label: "Folded"  },
      { src: ANGLE_IMGS.closeup_light,label:"Close-up"},
    ];
  }
  if (isLightColor) {
    return [
      { src: ANGLE_IMGS.front_light,  label: "Front"   },
      { src: ANGLE_IMGS.back_light,   label: "Back"    },
      { src: ANGLE_IMGS.folded_light, label: "Folded"  },
      { src: ANGLE_IMGS.closeup_light,label: "Close-up"},
    ];
  }
  if (hasDarkImg) {
    return [
      { src: ANGLE_IMGS.front_dark,  label: "Front"   },
      { src: ANGLE_IMGS.back_dark,   label: "Back"    },
      { src: ANGLE_IMGS.folded_dark, label: "Folded"  },
      { src: ANGLE_IMGS.closeup_dark,label: "Close-up"},
    ];
  }
  // Mid-tones (Sea Blue, Khaki, Army Green(fallback)) — mix
  return [
    { src: ANGLE_IMGS.front_dark,  label: "Front"   },
    { src: null,                   label: "Back"    },
    { src: ANGLE_IMGS.folded_dark, label: "Folded"  },
    { src: null,                   label: "Close-up"},
  ];
}

const teeColors: { color: string; swatch: string; image?: string }[] = [
  { color: "Black", swatch: "#111111", image: teeBlack },
  { color: "Sea Blue", swatch: "#5b7f8a" },
  { color: "White", swatch: "#f5f2ea", image: teeWhite },
  { color: "Cream", swatch: "#e9dfc9" },
  { color: "Khaki", swatch: "#a08b6a" },
  { color: "Army Green", swatch: "#4a5238" },
  { color: "Pink", swatch: "#d8a9a3" },
  { color: "Wine", swatch: "#5c1f28" },
];

// Colors per GSM — 320 GSM has Brown & Grey instead of Army Green
const teeColorsByGsm: Record<string, { color: string; swatch: string; image?: string }[]> = {
  "230": teeColors,
  "260": teeColors,
  "320": [
    { color: "Black",  swatch: "#111111", image: teeBlack },
    { color: "White",  swatch: "#f5f2ea", image: teeWhite },
    { color: "Cream",  swatch: "#e9dfc9" },
    { color: "Khaki",  swatch: "#a08b6a" },
    { color: "Pink",   swatch: "#d8a9a3" },
    { color: "Wine",   swatch: "#5c1f28" },
    { color: "Brown",  swatch: "#6b4226" },
    { color: "Grey",   swatch: "#9e9e9e" },
  ],
};

const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

export const tees: Product[] = gsmOptions.flatMap((g) =>
  teeColorsByGsm[g.value].map<Product>((c) => ({
    id: `tee-${g.value}-${slug(c.color)}`,
    name: `Essential Tee — ${g.label}`,
    color: c.color,
    price: g.price,
    swatch: c.swatch,
    image: c.image,
    category: "tee",
    gsm: g.value,
  })),
);

export const caps: Product[] = [
  { id: "cap-black", name: "Trucker Cap", color: "Onyx", price: 38, swatch: "#111111", image: capBlack, category: "cap" },
  { id: "cap-cream", name: "Trucker Cap", color: "Cream", price: 38, swatch: "#e9dfc9", category: "cap" },
  { id: "cap-khaki", name: "Trucker Cap", color: "Khaki", price: 38, swatch: "#a08b6a", category: "cap" },
  { id: "cap-army", name: "Trucker Cap", color: "Army", price: 38, swatch: "#4a5238", category: "cap" },
];

export const sizes = ["S", "M", "L", "XL", "2XL", "3XL", "4XL"] as const;

export type Size = (typeof sizes)[number];

// Stock map: productId -> size -> quantity
export const stock: Record<string, Partial<Record<Size, number>>> = {
  // 230 GSM
  "tee-230-black":       { S: 12, M: 20, L: 15, XL: 8, "2XL": 4, "3XL": 2, "4XL": 0 },
  "tee-230-sea-blue":    { S: 6,  M: 14, L: 10, XL: 5, "2XL": 3, "3XL": 0, "4XL": 0 },
  "tee-230-white":       { S: 18, M: 22, L: 16, XL: 9, "2XL": 5, "3XL": 3, "4XL": 1 },
  "tee-230-cream":       { S: 8,  M: 12, L: 9,  XL: 4, "2XL": 2, "3XL": 1, "4XL": 0 },
  "tee-230-khaki":       { S: 10, M: 16, L: 12, XL: 6, "2XL": 3, "3XL": 1, "4XL": 0 },
  "tee-230-army-green":  { S: 7,  M: 11, L: 8,  XL: 3, "2XL": 1, "3XL": 0, "4XL": 0 },
  "tee-230-pink":        { S: 14, M: 18, L: 13, XL: 7, "2XL": 4, "3XL": 2, "4XL": 0 },
  "tee-230-wine":        { S: 5,  M: 9,  L: 7,  XL: 3, "2XL": 1, "3XL": 0, "4XL": 0 },
  // 260 GSM
  "tee-260-black":       { S: 20, M: 30, L: 25, XL: 12, "2XL": 8, "3XL": 4, "4XL": 2 },
  "tee-260-sea-blue":    { S: 10, M: 18, L: 14, XL: 7,  "2XL": 4, "3XL": 2, "4XL": 0 },
  "tee-260-white":       { S: 22, M: 28, L: 20, XL: 11, "2XL": 6, "3XL": 3, "4XL": 1 },
  "tee-260-cream":       { S: 12, M: 16, L: 11, XL: 5,  "2XL": 3, "3XL": 1, "4XL": 0 },
  "tee-260-khaki":       { S: 15, M: 20, L: 16, XL: 8,  "2XL": 4, "3XL": 2, "4XL": 0 },
  "tee-260-army-green":  { S: 9,  M: 14, L: 10, XL: 5,  "2XL": 2, "3XL": 1, "4XL": 0 },
  "tee-260-pink":        { S: 16, M: 22, L: 17, XL: 9,  "2XL": 5, "3XL": 2, "4XL": 0 },
  "tee-260-wine":        { S: 8,  M: 12, L: 9,  XL: 4,  "2XL": 2, "3XL": 0, "4XL": 0 },
  // 320 GSM — Brown & Grey replace Army Green
  "tee-320-black":      { S: 14, M: 22, L: 18, XL: 10, "2XL": 6, "3XL": 3, "4XL": 1 },
  "tee-320-white":      { S: 16, M: 20, L: 15, XL: 8,  "2XL": 4, "3XL": 2, "4XL": 0 },
  "tee-320-cream":      { S: 9,  M: 13, L: 10, XL: 5,  "2XL": 2, "3XL": 1, "4XL": 0 },
  "tee-320-khaki":      { S: 11, M: 17, L: 13, XL: 6,  "2XL": 3, "3XL": 1, "4XL": 0 },
  "tee-320-pink":       { S: 12, M: 16, L: 12, XL: 6,  "2XL": 3, "3XL": 1, "4XL": 0 },
  "tee-320-wine":       { S: 5,  M: 8,  L: 6,  XL: 2,  "2XL": 0, "3XL": 0, "4XL": 0 },
  "tee-320-brown":      { S: 10, M: 15, L: 12, XL: 6,  "2XL": 3, "3XL": 1, "4XL": 0 },
  "tee-320-grey":       { S: 12, M: 18, L: 14, XL: 7,  "2XL": 4, "3XL": 2, "4XL": 0 },
};

export const getStock = (productId: string, size: Size): number =>
  stock[productId]?.[size] ?? 0;
