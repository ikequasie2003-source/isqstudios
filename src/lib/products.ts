import teeBlack from "@/assets/tee-black.jpg";
import teeWhite from "@/assets/tee-white.jpg";
import capBlack from "@/assets/cap-black.jpg";

export type Product = {
  id: string;
  name: string;
  color: string;
  price: number;
  swatch: string; // hex/oklch value for tile
  image?: string;
  category: "tee" | "cap";
};

export const tees: Product[] = [
  { id: "tee-black", name: "Essential Tee", color: "Black", price: 48, swatch: "#111111", image: teeBlack, category: "tee" },
  { id: "tee-white", name: "Essential Tee", color: "White", price: 48, swatch: "#f5f2ea", image: teeWhite, category: "tee" },
  { id: "tee-khaki", name: "Essential Tee", color: "Khaki", price: 48, swatch: "#a08b6a", category: "tee" },
  { id: "tee-cream", name: "Essential Tee", color: "Cream", price: 48, swatch: "#e9dfc9", category: "tee" },
  { id: "tee-pink", name: "Essential Tee", color: "Pink", price: 48, swatch: "#d8a9a3", category: "tee" },
  { id: "tee-seablue", name: "Essential Tee", color: "Sea Blue", price: 48, swatch: "#5b7f8a", category: "tee" },
  { id: "tee-wine", name: "Essential Tee", color: "Wine", price: 48, swatch: "#5c1f28", category: "tee" },
  { id: "tee-army", name: "Essential Tee", color: "Army Green", price: 48, swatch: "#4a5238", category: "tee" },
];

export const caps: Product[] = [
  { id: "cap-black", name: "Trucker Cap", color: "Onyx", price: 38, swatch: "#111111", image: capBlack, category: "cap" },
  { id: "cap-cream", name: "Trucker Cap", color: "Cream", price: 38, swatch: "#e9dfc9", category: "cap" },
  { id: "cap-khaki", name: "Trucker Cap", color: "Khaki", price: 38, swatch: "#a08b6a", category: "cap" },
  { id: "cap-army", name: "Trucker Cap", color: "Army", price: 38, swatch: "#4a5238", category: "cap" },
];

export const sizes = ["S", "M", "L", "XL", "XXL"] as const;
