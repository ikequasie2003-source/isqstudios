/**
 * Resolves product gallery images.
 * Priority: admin-uploaded images → default Unsplash fallbacks
 */
import { getGalleryImages, type ProductImage, type Gsm } from "@/lib/products";

const MEDIA_STORAGE_KEY = "isq_admin_media";

type StoredMedia = {
  id: string;
  label: string;
  category: "tee" | "cap";
  gsm?: string;
  color: string;
  angle: string;
  src: string;
  filename: string;
  uploadedAt: string;
};

function loadStoredMedia(): StoredMedia[] {
  try {
    return JSON.parse(localStorage.getItem(MEDIA_STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

/**
 * Returns the best single "hero" image for a product card.
 * Checks admin uploads first (Front angle, exact GSM match),
 * falls back to product.image, then null.
 */
export function resolveCardImage(
  category: "tee" | "cap",
  gsm: string | undefined,
  color: string,
  fallback?: string,
): string | undefined {
  const stored = loadStoredMedia();

  // Exact GSM + color + Front match
  const exactMatch = stored.find(
    (m) =>
      m.category === category &&
      m.color === color &&
      m.angle === "Front" &&
      (category === "cap" || m.gsm === gsm),
  );
  if (exactMatch) return exactMatch.src;

  return fallback;
}

/**
 * Returns 4 gallery images for a given gsm + color.
 * Checks admin-uploaded media first, falls back to defaults.
 */
export function resolveGalleryImages(gsm: Gsm, color: string): ProductImage[] {
  const stored = loadStoredMedia();
  const angles = ["Front", "Back", "Folded", "Close-up"];

  // Get defaults
  const defaults = getGalleryImages(gsm, color);

  // For each angle, check if admin uploaded an image for this gsm+color+angle
  return angles.map((angle, i) => {
    // Try exact GSM + color + angle match
    const exact = stored.find(
      (m) => m.category === "tee" && m.color === color && m.angle === angle && m.gsm === gsm,
    );
    if (exact) return { src: exact.src, label: angle };

    // Fall back to same color + angle, any GSM
    const anyGsm = stored.find(
      (m) => m.category === "tee" && m.color === color && m.angle === angle,
    );
    if (anyGsm) return { src: anyGsm.src, label: angle };

    // Fall back to default
    return defaults[i] ?? { src: null, label: angle };
  });
}

/**
 * Returns gallery images for caps.
 */
export function resolveCapGalleryImages(color: string): ProductImage[] {
  const stored = loadStoredMedia();
  const angles = ["Front", "Back", "Side", "Close-up"];

  return angles.map((angle) => {
    const match = stored.find(
      (m) => m.category === "cap" && m.color === color && m.angle === angle,
    );
    return match
      ? { src: match.src, label: angle }
      : { src: null, label: angle };
  });
}
