/**
 * Resolves product gallery images.
 * Priority: admin-uploaded images (Supabase) → localStorage cache → default fallbacks
 */
import { getGalleryImages, type ProductImage, type Gsm } from "@/lib/products";
import { supabase } from "@/lib/supabase";

const MEDIA_STORAGE_KEY = "isq_admin_media";
const MEDIA_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const MEDIA_CACHE_TS_KEY = "isq_admin_media_ts";

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

// In-memory cache for the current session
let memoryCache: StoredMedia[] | null = null;

function loadLocalMedia(): StoredMedia[] {
  try {
    return JSON.parse(localStorage.getItem(MEDIA_STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveLocalMedia(entries: StoredMedia[]) {
  try {
    localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(entries));
    localStorage.setItem(MEDIA_CACHE_TS_KEY, String(Date.now()));
  } catch {
    // ignore storage errors
  }
}

function isCacheStale(): boolean {
  const ts = localStorage.getItem(MEDIA_CACHE_TS_KEY);
  if (!ts) return true;
  return Date.now() - Number(ts) > MEDIA_CACHE_TTL;
}

/**
 * Fetch media from Supabase and refresh the local cache.
 * Call this once on app start / page load.
 */
export async function refreshMediaCache(): Promise<void> {
  try {
    const { data, error } = await supabase
      .from("media")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return;

    const entries: StoredMedia[] = data.map((m) => ({
      id: m.id,
      label: m.label,
      category: m.category as "tee" | "cap",
      gsm: m.gsm ?? undefined,
      color: m.color,
      angle: m.angle,
      src: m.url,
      filename: m.filename,
      uploadedAt: m.created_at,
    }));

    memoryCache = entries;
    saveLocalMedia(entries);
  } catch {
    // fall back to localStorage
  }
}

function getMedia(): StoredMedia[] {
  if (memoryCache) return memoryCache;
  const local = loadLocalMedia();
  memoryCache = local;

  // Refresh in background if cache is stale
  if (isCacheStale()) {
    refreshMediaCache();
  }

  return local;
}

// ─── Resolvers ────────────────────────────────────────────────────────────────

export function resolveCardImage(
  category: "tee" | "cap",
  gsm: string | undefined,
  color: string,
  fallback?: string,
): string | undefined {
  const stored = getMedia();

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

export function resolveGalleryImages(gsm: Gsm, color: string): ProductImage[] {
  const stored = getMedia();
  const angles = ["Front", "Back", "Folded", "Close-up"];
  const defaults = getGalleryImages(gsm, color);

  return angles.map((angle, i) => {
    const exact = stored.find(
      (m) => m.category === "tee" && m.color === color && m.angle === angle && m.gsm === gsm,
    );
    if (exact) return { src: exact.src, label: angle };

    const anyGsm = stored.find(
      (m) => m.category === "tee" && m.color === color && m.angle === angle,
    );
    if (anyGsm) return { src: anyGsm.src, label: angle };

    return defaults[i] ?? { src: null, label: angle };
  });
}

export function resolveCapGalleryImages(color: string): ProductImage[] {
  const stored = getMedia();
  const angles = ["Front", "Back", "Side", "Close-up"];

  return angles.map((angle) => {
    const match = stored.find(
      (m) => m.category === "cap" && m.color === color && m.angle === angle,
    );
    return match ? { src: match.src, label: angle } : { src: null, label: angle };
  });
}
