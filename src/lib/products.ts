import teeBlack from "@/assets/tee-black.jpg";
import teeWhite from "@/assets/tee-white.jpg";
import capBlack from "@/assets/cap-black.jpg";

export type Gsm = "230" | "260" | "320";

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

const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

export const tees: Product[] = gsmOptions.flatMap((g) =>
  teeColors.map<Product>((c) => ({
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
