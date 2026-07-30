import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import {
  Package, AlertTriangle, XCircle, TrendingUp,
  LogOut, Search, ChevronUp, ChevronDown, Eye, EyeOff,
  RefreshCw, Download, ImagePlus, Trash2, Upload, X, Database, ShoppingBag,
} from "lucide-react";
import {
  getAllVariants, getInventorySummary, decrementStock, incrementStock,
  type Variant, type AvailabilityStatus,
} from "@/lib/inventory";
import { gsmOptions, sizes, type Gsm, type Size } from "@/lib/products";
import { isAdminAuthenticated, adminLogin, adminLogout } from "@/lib/admin-auth";
import { seedVariants, fetchOrders, updateOrderStatus, dbSetStock, uploadMediaFile, insertMedia, fetchMedia } from "@/lib/db";
import { Logo } from "@/components/logo";
import adminBg from "@/assets/lookbook/LUCES GAMER.jfif";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — ISQ Studios" }] }),
  component: AdminPage,
});

// ─── Login Screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(password)) {
      onLogin();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setPassword("");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080806]">
      {/* GPU-accelerated CSS wave background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-[-20%] left-[-20%] h-[80vh] w-[80vw] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-[#5a3800] opacity-80"
          style={{ animation: "morphWave1 12s ease-in-out infinite", filter: "blur(40px)" }} />
        <div className="absolute right-[-20%] top-[-20%] h-[70vh] w-[70vw] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-[#7a5010] opacity-70"
          style={{ animation: "morphWave2 15s ease-in-out infinite", filter: "blur(50px)" }} />
        <div className="absolute left-[-10%] top-[35%] h-[30vh] w-[120vw] rounded-[50%] bg-[#6b4a08] opacity-60"
          style={{ animation: "morphWave3 10s ease-in-out infinite", filter: "blur(30px)" }} />
        <div className="absolute left-[-10%] top-[42%] h-[6vh] w-[120vw] rounded-[50%] opacity-90"
          style={{
            background: "linear-gradient(90deg, transparent 0%, #f0d060 20%, #fff8a0 50%, #f0d060 80%, transparent 100%)",
            animation: "shineRibbon 10s ease-in-out infinite",
            filter: "blur(3px)",
          }} />
        <div className="absolute left-[-10%] top-[44%] h-[2vh] w-[120vw] rounded-[50%] opacity-60"
          style={{
            background: "linear-gradient(90deg, transparent 0%, #fffde0 30%, #ffffff 50%, #fffde0 70%, transparent 100%)",
            animation: "shineRibbon 10s ease-in-out infinite",
            filter: "blur(1px)",
          }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(0,0,0,0.75)_100%)]" />
      </div>

      <style>{`
        @keyframes morphWave1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          33%       { transform: translate(3%, -4%) rotate(8deg) scale(1.05); border-radius: 40% 60% 50% 50% / 50% 50% 40% 60%; }
          66%       { transform: translate(-3%, 3%) rotate(-5deg) scale(0.97); border-radius: 50% 50% 40% 60% / 30% 70% 50% 50%; }
        }
        @keyframes morphWave2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
          33%       { transform: translate(-4%, 3%) rotate(-6deg) scale(1.04); border-radius: 60% 40% 50% 50% / 50% 40% 70% 30%; }
          66%       { transform: translate(3%, -3%) rotate(4deg) scale(0.98); border-radius: 50% 50% 30% 70% / 60% 40% 50% 50%; }
        }
        @keyframes morphWave3 {
          0%, 100% { transform: translateY(0) scaleX(1); }
          50%       { transform: translateY(-3vh) scaleX(1.04); }
        }
        @keyframes shineRibbon {
          0%, 100% { transform: translateY(0) skewY(-1deg); }
          50%       { transform: translateY(-2.5vh) skewY(1deg); }
        }
        @keyframes flipY {
          0%   { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-8px); }
          40%      { transform: translateX(8px); }
          60%      { transform: translateX(-6px); }
          80%      { transform: translateX(6px); }
        }
      `}</style>

      {/* Glassmorphism card */}
      <div
        className={`relative z-10 w-full max-w-sm mx-4 rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-xl transition-transform ${shake ? "animate-[shake_0.4s_ease-in-out]" : ""}`}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Logo className="h-16 w-auto" style={{ animation: "flipY 12s linear infinite" }} />
          <p className="mt-3 text-[10px] uppercase tracking-[0.4em] text-white/40">Admin Portal</p>
        </div>

        {/* Welcome */}
        <h1 className="mb-8 text-center font-display text-2xl text-white">
          Welcome Back
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Password field */}
          <div>
            <label className="mb-2 block text-xs text-white/60 uppercase tracking-widest">
              Password
            </label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                placeholder="Enter your password"
                autoFocus
                className={`w-full rounded-xl border bg-white/5 px-4 py-3.5 pr-12 text-sm text-white outline-none backdrop-blur placeholder:text-white/20 transition-colors ${
                  error
                    ? "border-red-400/60 focus:border-red-400"
                    : "border-white/10 focus:border-[#b8952a]/60"
                }`}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-xs text-red-400 tracking-widest uppercase">Incorrect password</p>
            )}
          </div>

          {/* Login button */}
          <button
            type="submit"
            className="w-full rounded-xl py-3.5 text-sm font-medium uppercase tracking-[0.2em] text-white transition-all hover:opacity-90 active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #f0d080 0%, #c8992a 40%, #e8c55a 70%, #a07820 100%)",
              boxShadow: "0 4px 24px rgba(184,149,42,0.35)",
            }}
          >
            Enter
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-[10px] uppercase tracking-[0.3em] text-white/20">
          ISQ Studios · Admin Only
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-8px); }
          40%      { transform: translateX(8px); }
          60%      { transform: translateX(-6px); }
          80%      { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}

// ─── Summary Card ─────────────────────────────────────────────────────────────

function SummaryCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="border border-white/10 bg-white/5 backdrop-blur-sm p-6 rounded-2xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.32em] text-white/50">{label}</p>
          <p className={`mt-2 font-display text-3xl text-white ${color ?? ""}`}>{value}</p>
          {sub && <p className="mt-1 text-xs text-white/40">{sub}</p>}
        </div>
        <div className="rounded-sm p-2 bg-white/5">
          <Icon className={`h-5 w-5 ${color ?? "text-white/40"}`} />
        </div>
      </div>
    </div>
  );
}

// ─── Availability pill ────────────────────────────────────────────────────────

function AvailPill({ status }: { status: AvailabilityStatus }) {
  const map: Record<AvailabilityStatus, { label: string; cls: string }> = {
    in_stock:     { label: "In Stock",     cls: "bg-green-900/60  text-green-300  border-green-700"  },
    low_stock:    { label: "Low Stock",    cls: "bg-amber-900/60  text-amber-300  border-amber-700"  },
    out_of_stock: { label: "Out of Stock", cls: "bg-red-900/60    text-red-300    border-red-700"    },
  };
  const { label, cls } = map[status];
  return (
    <span className={`inline-block border px-2 py-0.5 text-[10px] uppercase tracking-widest ${cls}`}>
      {label}
    </span>
  );
}

// ─── Inline stock editor ──────────────────────────────────────────────────────

function StockEditor({ variant, onUpdate }: { variant: Variant; onUpdate: () => void }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(String(variant.qty));

  const save = () => {
    const newQty = parseInt(val, 10);
    if (isNaN(newQty) || newQty < 0) { setEditing(false); return; }
    const diff = newQty - variant.qty;
    if (diff > 0) decrementStock(variant.gsm, variant.color, variant.size, -diff); // trick: negative decrement = add
    // Use direct approach — increment or decrement to reach target
    if (diff > 0) incrementStock(variant.gsm, variant.color, variant.size, diff);
    else if (diff < 0) decrementStock(variant.gsm, variant.color, variant.size, Math.abs(diff));
    setEditing(false);
    onUpdate();
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <input
          type="number"
          min={0}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") setEditing(false); }}
          autoFocus
          className="w-16 border border-ink bg-transparent px-2 py-1 text-sm outline-none tabular-nums"
        />
        <button onClick={save} className="text-[10px] uppercase tracking-widest text-green-600 hover:underline">Save</button>
        <button onClick={() => setEditing(false)} className="text-[10px] uppercase tracking-widest text-muted-foreground hover:underline">Cancel</button>
      </div>
    );
  }

  return (
    <button
      onClick={() => { setVal(String(variant.qty)); setEditing(true); }}
      className="group flex items-center gap-1.5 tabular-nums hover:underline"
    >
      <span>{variant.qty}</span>
      <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100">edit</span>
    </button>
  );
}

// ─── Media Tab ───────────────────────────────────────────────────────────────

const MEDIA_STORAGE_KEY = "isq_admin_media";

type MediaEntry = {
  id: string;
  label: string;       // e.g. "260 GSM — Black — Front"
  category: "tee" | "cap";
  gsm?: string;
  color: string;
  angle: string;
  src: string;         // base64 data URL
  filename: string;
  uploadedAt: string;
};

function loadMedia(): MediaEntry[] {
  try { return JSON.parse(localStorage.getItem(MEDIA_STORAGE_KEY) ?? "[]"); }
  catch { return []; }
}
function saveMedia(entries: MediaEntry[]) {
  try {
    localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(entries));
    return true;
  } catch {
    return false;
  }
}

const TEE_COLORS_BY_GSM: Record<string, string[]> = {
  "230": ["Black", "Sea Blue", "White", "Cream", "Khaki", "Army Green", "Pink", "Wine"],
  "260": ["Black", "Sea Blue", "White", "Cream", "Khaki", "Army Green", "Pink", "Wine"],
  "320": ["Black", "White", "Cream", "Khaki", "Pink", "Wine", "Brown", "Grey"],
};
const TEE_COLORS = TEE_COLORS_BY_GSM["260"]; // default fallback
const CAP_COLORS = ["Onyx","Cream","Khaki","Army"];
const ANGLES = ["Front","Back","Folded","Close-up","Lifestyle"];
const GSM_VALUES = ["230","260","320"];

function DropZone({ onFiles }: { onFiles: (files: File[]) => void }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handle = useCallback((files: FileList | null) => {
    if (!files) return;
    const valid = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (valid.length) onFiles(valid);
  }, [onFiles]);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handle(e.dataTransfer.files); }}
      onClick={() => inputRef.current?.click()}
      className={`flex cursor-pointer flex-col items-center justify-center gap-3 border-2 border-dashed rounded-sm py-14 transition-colors ${
        dragging ? "border-ink bg-bone" : "border-border hover:border-ink/50 hover:bg-bone/40"
      }`}
    >
      <Upload className="h-8 w-8 text-muted-foreground" />
      <div className="text-center">
        <p className="text-sm font-medium">Drop images here or click to browse</p>
        <p className="mt-1 text-xs text-muted-foreground">PNG, JPG, WEBP — multiple files supported</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handle(e.target.files)}
      />
    </div>
  );
}

function MediaTab() {
  const [media, setMedia] = useState<MediaEntry[]>(loadMedia);
  const [pending, setPending] = useState<{ file: File; preview: string; category: "tee"|"cap"; gsm: string; color: string; angle: string }[]>([]);
  const [filterCat, setFilterCat] = useState<"all"|"tee"|"cap">("all");
  const [filterColor, setFilterColor] = useState("all");
  const [lightbox, setLightbox] = useState<MediaEntry | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Load from Supabase on mount — syncs across all devices
  useEffect(() => {
    fetchMedia().then(({ data }) => {
      if (data && data.length > 0) {
        const entries: MediaEntry[] = data.map((m) => ({
          id: m.id,
          label: m.label,
          category: m.category,
          gsm: m.gsm ?? undefined,
          color: m.color,
          angle: m.angle,
          src: m.url,
          filename: m.filename,
          uploadedAt: m.created_at,
        }));
        saveMedia(entries); // sync to localStorage as cache
        setMedia(entries);
      }
    });
  }, []);

  const handleFiles = (files: File[]) => {
    const readers = files.map(
      (file) =>
        new Promise<{ file: File; preview: string; category: "tee" | "cap"; gsm: string; color: string; angle: string }>(
          (resolve) => {
            const reader = new FileReader();
            reader.onload = (e) =>
              resolve({
                file,
                preview: e.target!.result as string,
                category: "tee",
                gsm: "260",
                color: "Black",
                angle: "Front",
              });
            reader.readAsDataURL(file);
          },
        ),
    );
    Promise.all(readers).then((newItems) => {
      setPending((prev) => [...prev, ...newItems]);
    });
  };

  const updatePending = (idx: number, patch: Partial<typeof pending[0]>) => {
    setPending((prev) => prev.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
  };

  const removePending = (idx: number) => {
    setPending((prev) => prev.filter((_, i) => i !== idx));
  };

  const saveAll = async () => {
    setSaveError(null);
    setSaving(true);

    const newEntries: MediaEntry[] = [];

    for (const p of pending) {
      // Build a clean storage path: category/color/angle-timestamp.ext
      const ext = p.file.name.split(".").pop() ?? "jpg";
      const slug = `${p.category}/${p.color.toLowerCase().replace(/\s+/g, "-")}/${p.angle.toLowerCase()}-${Date.now()}.${ext}`;

      const { url, error } = await uploadMediaFile(p.file, slug);

      if (error || !url) {
        setSaveError(`Failed to upload ${p.file.name}: ${error}`);
        setSaving(false);
        return;
      }

      newEntries.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        label: p.category === "tee"
          ? `${p.gsm} GSM — ${p.color} — ${p.angle}`
          : `Cap — ${p.color} — ${p.angle}`,
        category: p.category,
        gsm: p.category === "tee" ? p.gsm : undefined,
        color: p.color,
        angle: p.angle,
        src: url,
        filename: p.file.name,
        uploadedAt: new Date().toISOString(),
      });
    }

    // Also save to DB table for persistence
    for (const entry of newEntries) {
      await insertMedia({
        label: entry.label,
        category: entry.category,
        gsm: entry.gsm,
        color: entry.color,
        angle: entry.angle,
        url: entry.src,
        filename: entry.filename,
      });
    }

    const updated = [...media, ...newEntries];
    saveMedia(updated); // keep localStorage as cache
    setMedia(updated);
    setPending([]);
    setSaving(false);
  };

  const deleteMedia = async (id: string) => {
    // Delete from Supabase DB
    await import("@/lib/db").then(({ deleteMedia: dbDelete }) => dbDelete(id));
    const updated = media.filter((m) => m.id !== id);
    saveMedia(updated);
    setMedia(updated);
  };

  const deleteSelected = async () => {
    for (const id of Array.from(selected)) {
      await import("@/lib/db").then(({ deleteMedia: dbDelete }) => dbDelete(id));
    }
    const updated = media.filter((m) => !selected.has(m.id));
    saveMedia(updated);
    setMedia(updated);
    setSelected(new Set());
    setSelectMode(false);
  };

  const displayed = media.filter((m) => {
    if (filterCat !== "all" && m.category !== filterCat) return false;
    if (filterColor !== "all" && m.color !== filterColor) return false;
    return true;
  });

  const allColors = Array.from(new Set(media.map((m) => m.color)));

  return (
    <div className="space-y-8">
      {/* Upload area */}
      <div className="border border-border bg-background p-6">
        <h2 className="mb-4 text-xs uppercase tracking-[0.24em]">Upload Images</h2>
        <DropZone onFiles={handleFiles} />

        {/* Pending queue */}
        {pending.length > 0 && (
          <div className="mt-6 space-y-4">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              {pending.length} image{pending.length !== 1 ? "s" : ""} ready to save
            </p>
            {pending.map((p, i) => (
              <div key={i} className="flex gap-4 border border-border p-4">
                {/* Preview */}
                <img src={p.preview} alt="" className="h-24 w-20 shrink-0 object-cover" />

                {/* Metadata fields */}
                <div className="flex flex-1 flex-wrap gap-3">
                  {/* Category */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Category</label>
                    <select
                      value={p.category}
                      onChange={(e) => updatePending(i, {
                        category: e.target.value as "tee"|"cap",
                        color: e.target.value === "tee" ? "Black" : "Onyx",
                      })}
                      className="border border-border bg-transparent px-2 py-1.5 text-xs outline-none"
                    >
                      <option value="tee">T-Shirt</option>
                      <option value="cap">Cap</option>
                    </select>
                  </div>

                  {/* GSM — tees only */}
                  {p.category === "tee" && (
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground">GSM</label>
                      <select
                        value={p.gsm}
                        onChange={(e) => updatePending(i, { gsm: e.target.value })}
                        className="border border-border bg-transparent px-2 py-1.5 text-xs outline-none"
                      >
                        {GSM_VALUES.map((g) => <option key={g} value={g}>{g} GSM</option>)}
                      </select>
                    </div>
                  )}

                  {/* Color */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Color</label>
                    <select
                      value={p.color}
                      onChange={(e) => updatePending(i, { color: e.target.value })}
                      className="border border-border bg-transparent px-2 py-1.5 text-xs outline-none"
                    >
                      {(p.category === "tee" ? TEE_COLORS_BY_GSM[p.gsm] ?? TEE_COLORS : CAP_COLORS).map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Angle */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Angle</label>
                    <select
                      value={p.angle}
                      onChange={(e) => updatePending(i, { angle: e.target.value })}
                      className="border border-border bg-transparent px-2 py-1.5 text-xs outline-none"
                    >
                      {ANGLES.map((a) => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground">File</label>
                    <span className="py-1.5 text-xs text-muted-foreground">{p.file.name}</span>
                  </div>
                </div>

                {/* Remove */}
                <button onClick={() => removePending(i)} className="shrink-0 text-muted-foreground hover:text-red-500">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}

            <div className="flex gap-3">
              <button
                onClick={saveAll}
                disabled={saving}
                className="flex items-center gap-2 bg-ink px-6 py-3 text-xs uppercase tracking-[0.24em] text-cream hover:opacity-80 disabled:opacity-50"
              >
                <ImagePlus className="h-4 w-4" />
                {saving ? "Uploading…" : `Save ${pending.length} Image${pending.length !== 1 ? "s" : ""}`}
              </button>
              <button
                onClick={() => setPending([])}
                className="border border-border px-6 py-3 text-xs uppercase tracking-[0.24em] text-muted-foreground hover:text-foreground"
              >
                Clear All
              </button>
            </div>
            {saveError && (
              <p className="mt-3 text-xs text-red-500">{saveError}</p>
            )}
          </div>
        )}
      </div>

      {/* Media library */}
      <div>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h2 className="text-xs uppercase tracking-[0.24em]">Media Library</h2>
          <span className="text-xs text-muted-foreground">({media.length} images)</span>

          {/* Select mode toggle */}
          <button
            onClick={() => { setSelectMode(!selectMode); setSelected(new Set()); }}
            className={`text-xs uppercase tracking-[0.24em] border px-3 py-1.5 transition-colors ${
              selectMode ? "border-ink bg-ink text-cream" : "border-border hover:border-ink"
            }`}
          >
            {selectMode ? "Cancel" : "Select"}
          </button>

          {/* Bulk delete */}
          {selectMode && selected.size > 0 && (
            <button
              onClick={deleteSelected}
              className="flex items-center gap-1.5 border border-red-500 bg-red-500 px-3 py-1.5 text-xs uppercase tracking-[0.24em] text-white hover:bg-red-600"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete {selected.size} selected
            </button>
          )}

          {selectMode && (
            <button
              onClick={() => setSelected(new Set(displayed.map((m) => m.id)))}
              className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              Select all
            </button>
          )}

          <div className="ml-auto flex gap-2">
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value as "all"|"tee"|"cap")}
              className="border border-border bg-background px-3 py-1.5 text-xs outline-none"
            >
              <option value="all">All Categories</option>
              <option value="tee">T-Shirts</option>
              <option value="cap">Caps</option>
            </select>
            <select
              value={filterColor}
              onChange={(e) => setFilterColor(e.target.value)}
              className="border border-border bg-background px-3 py-1.5 text-xs outline-none"
            >
              <option value="all">All Colors</option>
              {allColors.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-dashed border-border py-20 text-center">
            <ImagePlus className="mb-3 h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No images uploaded yet</p>
            <p className="mt-1 text-xs text-muted-foreground/60">Use the upload area above to add product images</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {displayed.map((m) => {
              const isSelected = selected.has(m.id);
              return (
                <div
                  key={m.id}
                  className={`group relative border bg-background cursor-pointer transition-all ${
                    isSelected ? "border-ink ring-2 ring-ink" : "border-border"
                  }`}
                  onClick={() => {
                    if (selectMode) {
                      const next = new Set(selected);
                      isSelected ? next.delete(m.id) : next.add(m.id);
                      setSelected(next);
                    } else {
                      setLightbox(m);
                    }
                  }}
                >
                  {/* Checkbox in select mode */}
                  {selectMode && (
                    <div className={`absolute left-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-sm border-2 transition-colors ${
                      isSelected ? "border-ink bg-ink" : "border-white/80 bg-black/20"
                    }`}>
                      {isSelected && <span className="text-[10px] text-white font-bold">✓</span>}
                    </div>
                  )}

                  {/* Image */}
                  <div className="aspect-[4/5] overflow-hidden bg-bone">
                    <img
                      src={m.src}
                      alt={m.label}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Label */}
                  <div className="p-2">
                    <p className="truncate text-[11px] font-medium">{m.label}</p>
                    <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{m.filename}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground/60">
                      {new Date(m.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Single delete button (non-select mode) */}
                  {!selectMode && (
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteMedia(m.id); }}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center bg-background/90 text-muted-foreground opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-h-[90vh] max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.label} className="max-h-[85vh] object-contain" />
            <div className="mt-3 text-center">
              <p className="text-sm text-white">{lightbox.label}</p>
              <p className="text-xs text-white/50">{lightbox.filename}</p>
            </div>
            <button
              onClick={() => setLightbox(null)}
              className="absolute right-0 top-0 p-2 text-white/60 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Orders Tab ──────────────────────────────────────────────────────────────

function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await fetchOrders();
    if (error) setError(error.message);
    else setOrders(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const statusColors: Record<string, string> = {
    pending:   "bg-amber-50 text-amber-700 border-amber-200",
    confirmed: "bg-blue-50 text-blue-700 border-blue-200",
    shipped:   "bg-purple-50 text-purple-700 border-purple-200",
    delivered: "bg-green-50 text-green-700 border-green-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };

  const handleStatus = async (orderId: string, status: any) => {
    await updateOrderStatus(orderId, status);
    load();
  };

  if (loading) return <div className="py-20 text-center text-sm text-muted-foreground">Loading orders…</div>;
  if (error) return <div className="py-20 text-center text-sm text-red-500">{error}</div>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
        <button onClick={load} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-border py-24 text-center">
          <ShoppingBag className="mb-3 h-8 w-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No orders yet</p>
          <p className="mt-1 text-xs text-muted-foreground/60">Orders will appear here once customers checkout</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-border bg-background p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs text-muted-foreground">#{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="mt-1 text-sm font-medium">{order.customer_name ?? "Guest"}</p>
                  {order.customer_email && (
                    <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`border px-2 py-0.5 text-[10px] uppercase tracking-widest ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatus(order.id, e.target.value)}
                    className="border border-border bg-background px-2 py-1 text-xs outline-none"
                  >
                    {["pending","confirmed","shipped","delivered","cancelled"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <p className="text-sm font-medium">${order.total.toFixed(2)}</p>
                </div>
              </div>
              {/* Order items */}
              {order.order_items?.length > 0 && (
                <div className="mt-4 border-t border-border pt-4">
                  <div className="space-y-2">
                    {order.order_items.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground font-mono">{item.sku}</span>
                        <span>{item.product_name} — {item.color}{item.gsm ? ` · ${item.gsm} GSM` : ""} · {item.size}</span>
                        <span className="tabular-nums">×{item.qty} · ${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex justify-end gap-4 text-xs text-muted-foreground">
                    <span>Subtotal: ${order.subtotal.toFixed(2)}</span>
                    <span>Shipping: ${order.shipping.toFixed(2)}</span>
                    <span className="font-medium text-foreground">Total: ${order.total.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Database Tab ─────────────────────────────────────────────────────────────

function DatabaseTab() {
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<{ ok: boolean; message: string } | null>(null);

  const handleSeed = async () => {
    setSeeding(true);
    setSeedResult(null);
    const result = await seedVariants();
    setSeedResult({
      ok: result.ok,
      message: result.ok
        ? "✓ All 168 variants seeded to Supabase successfully."
        : `Error: ${result.error}`,
    });
    setSeeding(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="border border-border bg-background p-6">
        <h2 className="text-xs uppercase tracking-[0.24em]">Connection</h2>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-muted-foreground">Connected to Supabase</span>
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            https://tgiedzllcimqpgudoekk.supabase.co
          </p>
        </div>
      </div>

      <div className="border border-border bg-background p-6">
        <h2 className="text-xs uppercase tracking-[0.24em]">Setup</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Before using the database, run the SQL schema in Supabase, then seed the inventory.
        </p>
        <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="text-gold font-medium">1.</span>
            <span>
              Open the{" "}
              <a
                href="https://supabase.com/dashboard/project/tgiedzllcimqpgudoekk/sql/new"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4 hover:text-foreground"
              >
                Supabase SQL Editor
              </a>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-gold font-medium">2.</span>
            <span>Copy the contents of <code className="bg-bone px-1 py-0.5 text-xs">supabase-schema.sql</code> from your project root and run it</span>
          </li>
          <li className="flex gap-3">
            <span className="text-gold font-medium">3.</span>
            <span>Click Seed Inventory below to push all 168 variants to the database</span>
          </li>
        </ol>

        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="flex items-center gap-2 bg-ink px-6 py-3 text-xs uppercase tracking-[0.24em] text-cream transition-opacity hover:opacity-80 disabled:opacity-40"
          >
            <Database className="h-4 w-4" />
            {seeding ? "Seeding…" : "Seed Inventory to Supabase"}
          </button>
        </div>

        {seedResult && (
          <p className={`mt-4 text-sm ${seedResult.ok ? "text-green-600" : "text-red-500"}`}>
            {seedResult.message}
          </p>
        )}
      </div>

      <div className="border border-border bg-background p-6">
        <h2 className="mb-3 text-xs uppercase tracking-[0.24em]">Tables</h2>
        <div className="space-y-2 text-sm">
          {[
            { name: "variants", desc: "168 rows — GSM × Color × Size inventory" },
            { name: "orders", desc: "Customer orders" },
            { name: "order_items", desc: "Line items per order" },
            { name: "media", desc: "Product image library" },
          ].map((t) => (
            <div key={t.name} className="flex items-center justify-between border-b border-border/50 py-2 last:border-0">
              <span className="font-mono text-xs">{t.name}</span>
              <span className="text-xs text-muted-foreground">{t.desc}</span>
              <a
                href={`https://supabase.com/dashboard/project/tgiedzllcimqpgudoekk/editor`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                View
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Admin Panel ─────────────────────────────────────────────────────────

type SortKey = "sku" | "color" | "gsm" | "size" | "qty" | "price" | "availability";

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [tick, setTick] = useState(0); // force re-render after stock edits
  const [search, setSearch] = useState("");
  const [filterGsm, setFilterGsm] = useState<Gsm | "all">("all");
  const [filterColor, setFilterColor] = useState("all");
  const [filterStatus, setFilterStatus] = useState<AvailabilityStatus | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("sku");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [activeTab, setActiveTab] = useState<"inventory" | "alerts" | "media" | "orders" | "database">("inventory");

  const refresh = () => setTick((t) => t + 1);

  // Live data — re-reads store on every tick
  const allVariants = useMemo(() => getAllVariants(), [tick]);
  const summary = useMemo(() => getInventorySummary(), [tick]);

  const colors = useMemo(
    () => Array.from(new Set(allVariants.map((v) => v.color))),
    [allVariants],
  );

  const filtered = useMemo(() => {
    let result = allVariants;

    if (filterGsm !== "all") result = result.filter((v) => v.gsm === filterGsm);
    if (filterColor !== "all") result = result.filter((v) => v.color === filterColor);
    if (filterStatus !== "all") result = result.filter((v) => v.availability === filterStatus);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (v) =>
          v.sku.toLowerCase().includes(q) ||
          v.color.toLowerCase().includes(q) ||
          v.size.toLowerCase().includes(q) ||
          v.gsm.includes(q),
      );
    }

    return [...result].sort((a, b) => {
      let av: string | number = a[sortKey] as string | number;
      let bv: string | number = b[sortKey] as string | number;
      if (sortKey === "size") {
        av = sizes.indexOf(a.size as Size);
        bv = sizes.indexOf(b.size as Size);
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [allVariants, filterGsm, filterColor, filterStatus, search, sortKey, sortDir]);

  const alerts = useMemo(
    () => allVariants.filter((v) => v.availability !== "in_stock"),
    [allVariants],
  );

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const exportCsv = () => {
    const header = "SKU,GSM,Color,Size,Price,Qty,Availability,Weight,Barcode";
    const rows = allVariants.map(
      (v) =>
        `${v.sku},${v.gsm},${v.color},${v.size},$${v.price},${v.qty},${v.availability},${v.weight}g,${v.barcode ?? ""}`,
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `isq-inventory-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (
      sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
    ) : (
      <ChevronDown className="h-3 w-3 opacity-30" />
    );

  return (
    <div className="relative min-h-screen text-foreground">
      {/* ── Premium ambient background ── */}
      {/* Base dark */}
      <div className="pointer-events-none fixed inset-0 bg-[#06050a]" />

      {/* Hexagon texture — with gold filter applied directly to image */}
      <div
        className="pointer-events-none fixed inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{
          backgroundImage: `url(${adminBg})`,
          filter: "sepia(1) saturate(3) hue-rotate(5deg) brightness(0.8)",
        }}
      />

      {/* Dark overlay for readability */}
      <div className="pointer-events-none fixed inset-0 bg-black/75" />
      <div className="pointer-events-none fixed inset-0"
        style={{ background: "radial-gradient(ellipse 70% 60% at 10% 90%, rgba(180,110,0,0.35) 0%, transparent 70%)" }} />

      {/* Gold ambient glow — top right */}
      <div className="pointer-events-none fixed inset-0"
        style={{ background: "radial-gradient(ellipse 60% 50% at 95% 5%, rgba(210,150,20,0.25) 0%, transparent 65%)" }} />

      {/* Warm mid glow — centre */}
      <div className="pointer-events-none fixed inset-0"
        style={{ background: "radial-gradient(ellipse 50% 40% at 50% 55%, rgba(160,90,0,0.15) 0%, transparent 70%)" }} />

      {/* Thin gold horizon line */}
      <div className="pointer-events-none fixed left-0 right-0 h-px opacity-30"
        style={{ top: "50%", background: "linear-gradient(90deg, transparent 0%, #f0c840 20%, #fff8a0 50%, #f0c840 80%, transparent 100%)" }} />

      {/* Vignette */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_35%,_rgba(0,0,0,0.85)_100%)]" />
      <div className="relative z-10 admin-dark">
      <style>{`
        .admin-dark .bg-background { background-color: rgba(8,6,4,0.88) !important; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
        .admin-dark .bg-bone, .admin-dark .bg-bone\\/40, .admin-dark .bg-bone\\/60 { background-color: rgba(15,12,4,0.75) !important; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
        .admin-dark [class*="border border-"] { border-radius: 1rem !important; background: rgba(255,200,60,0.04) !important; backdrop-filter: blur(14px) !important; -webkit-backdrop-filter: blur(14px) !important; border-color: rgba(255,200,80,0.18) !important; }
        .admin-dark .overflow-x-auto { border-radius: 1rem !important; overflow: hidden; backdrop-filter: blur(14px); background: rgba(255,200,60,0.04) !important; }
        .admin-dark .overflow-hidden.border { border-radius: 1rem !important; backdrop-filter: blur(14px); background: rgba(255,200,60,0.04) !important; }
        .admin-dark .text-foreground { color: rgba(255,248,230,1) !important; }
        .admin-dark .text-muted-foreground { color: rgba(220,185,110,0.8) !important; }
        .admin-dark p, .admin-dark span, .admin-dark td, .admin-dark th, .admin-dark label, .admin-dark h1, .admin-dark h2, .admin-dark h3 { color: rgba(255,248,230,0.95) !important; }
        .admin-dark .text-xs, .admin-dark .text-sm, .admin-dark .text-base { color: rgba(255,248,230,0.92) !important; }
        .admin-dark table { background: transparent !important; }
        .admin-dark tbody tr:hover { background-color: rgba(180,130,0,0.1) !important; }
        .admin-dark thead tr { background-color: rgba(0,0,0,0.5) !important; }
        .admin-dark input, .admin-dark select { background-color: rgba(15,12,4,0.8) !important; color: rgba(255,248,230,0.95) !important; border-color: rgba(255,200,80,0.25) !important; }
        .admin-dark .bg-ink { background-color: #c8992a !important; }
        .admin-dark .text-cream { color: #060400 !important; }
        .admin-dark .opacity-50, .admin-dark .text-muted-foreground\\/60 { opacity: 0.8 !important; color: rgba(220,185,110,0.8) !important; }
      `}</style>
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-white/8 bg-black/50 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center">
              <Logo className="h-9 w-auto" />
            </a>
            <span className="border border-border px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-xs uppercase tracking-[0.24em] text-muted-foreground hover:text-foreground">
              ← Store
            </a>
            <button
              onClick={() => { adminLogout(); onLogout(); }}
              className="flex items-center gap-1.5 text-xs uppercase tracking-[0.24em] text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-6 py-8">
        {/* Summary cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <SummaryCard
            icon={Package}
            label="Total Variants"
            value={summary.totalVariants}
            sub={`${summary.totalUnits} total units`}
          />
          <SummaryCard
            icon={TrendingUp}
            label="In Stock"
            value={summary.inStock}
            sub="variants available"
            color="text-green-600"
          />
          <SummaryCard
            icon={AlertTriangle}
            label="Low Stock"
            value={summary.lowStock}
            sub="≤ 5 units remaining"
            color="text-amber-500"
          />
          <SummaryCard
            icon={XCircle}
            label="Out of Stock"
            value={summary.outOfStock}
            sub="variants unavailable"
            color="text-red-500"
          />
        </div>

        {/* Tabs */}
        <div className="mb-6 flex items-center justify-between border-b border-border">
          <div className="flex gap-6">
            {(["inventory", "alerts", "media", "orders", "database"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-4 text-xs uppercase tracking-[0.24em] transition-all rounded-t-lg ${
                  activeTab === tab
                    ? "border-b-2 border-[#b8952a] text-[#e8c55a] bg-[#b8952a]/10"
                    : "text-white/40 hover:text-white/70 hover:bg-white/5"
                }`}
              >
                {tab}
                {tab === "alerts" && alerts.length > 0 && (
                  <span className="ml-2 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] text-white">
                    {alerts.length}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 pb-3">
            <button
              onClick={refresh}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
            <button
              onClick={exportCsv}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <Download className="h-3.5 w-3.5" /> Export CSV
            </button>
          </div>
        </div>

        {activeTab === "alerts" && (
          <div className="space-y-2">
            {alerts.length === 0 ? (
              <p className="py-16 text-center text-sm text-muted-foreground">No alerts — all variants are in stock.</p>
            ) : (
              <>
                <p className="mb-4 text-xs text-muted-foreground">{alerts.length} variant{alerts.length !== 1 ? "s" : ""} need attention</p>
                <div className="overflow-hidden border border-border bg-background">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-bone/60">
                        <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-muted-foreground">SKU</th>
                        <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-muted-foreground">Color</th>
                        <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-muted-foreground">GSM</th>
                        <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-muted-foreground">Size</th>
                        <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-muted-foreground">Qty</th>
                        <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alerts.map((v) => (
                        <tr key={v.sku} className="border-b border-border/50 last:border-0 hover:bg-bone/40">
                          <td className="px-4 py-3 font-mono text-xs">{v.sku}</td>
                          <td className="px-4 py-3">{v.color}</td>
                          <td className="px-4 py-3">{v.gsm} GSM</td>
                          <td className="px-4 py-3">{v.size}</td>
                          <td className="px-4 py-3 tabular-nums">
                            <StockEditor variant={v} onUpdate={refresh} />
                          </td>
                          <td className="px-4 py-3"><AvailPill status={v.availability} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "inventory" && (
          <>
            {/* Filters + search */}
            <div className="mb-5 flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="flex items-center gap-2 border border-border bg-background px-3 py-2">
                <Search className="h-3.5 w-3.5 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search SKU, color, size…"
                  className="w-44 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
                />
              </div>

              {/* GSM filter */}
              <select
                value={filterGsm}
                onChange={(e) => setFilterGsm(e.target.value as Gsm | "all")}
                className="border border-border bg-background px-3 py-2 text-xs uppercase tracking-widest outline-none"
                style={{ backgroundColor: "#0a0800", color: "#fff8e0" }}
              >
                <option value="all" style={{ backgroundColor: "#0a0800", color: "#fff8e0" }}>All GSM</option>
                {gsmOptions.map((g) => (
                  <option key={g.value} value={g.value} style={{ backgroundColor: "#0a0800", color: "#fff8e0" }}>{g.label}</option>
                ))}
              </select>

              {/* Color filter */}
              <select
                value={filterColor}
                onChange={(e) => setFilterColor(e.target.value)}
                className="border border-border bg-background px-3 py-2 text-xs uppercase tracking-widest outline-none"
                style={{ backgroundColor: "#0a0800", color: "#fff8e0" }}
              >
                <option value="all" style={{ backgroundColor: "#0a0800", color: "#fff8e0" }}>All Colors</option>
                {colors.map((c) => <option key={c} value={c} style={{ backgroundColor: "#0a0800", color: "#fff8e0" }}>{c}</option>)}
              </select>

              {/* Status filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as AvailabilityStatus | "all")}
                className="border border-border bg-background px-3 py-2 text-xs uppercase tracking-widest outline-none"
                style={{ backgroundColor: "#0a0800", color: "#fff8e0" }}
              >
                <option value="all" style={{ backgroundColor: "#0a0800", color: "#fff8e0" }}>All Status</option>
                <option value="in_stock" style={{ backgroundColor: "#0a0800", color: "#fff8e0" }}>In Stock</option>
                <option value="low_stock" style={{ backgroundColor: "#0a0800", color: "#fff8e0" }}>Low Stock</option>
                <option value="out_of_stock" style={{ backgroundColor: "#0a0800", color: "#fff8e0" }}>Out of Stock</option>
              </select>

              <span className="ml-auto text-xs text-muted-foreground">
                {filtered.length} of {allVariants.length} variants
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-border bg-background">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/50">
                    {(
                      [
                        { key: "color", label: "Color" },
                        { key: "gsm", label: "GSM" },
                        { key: "size", label: "Size" },
                        { key: "price", label: "Price" },
                        { key: "qty", label: "Stock" },
                        { key: "availability", label: "Status" },
                      ] as { key: SortKey; label: string }[]
                    ).map(({ key, label }) => (
                      <th
                        key={key}
                        onClick={() => handleSort(key)}
                        className="cursor-pointer select-none px-3 py-2.5 text-left text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
                      >
                        <div className="flex items-center gap-1">
                          {label} <SortIcon k={key} />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-3 py-12 text-center text-sm text-muted-foreground">
                        No variants match your filters
                      </td>
                    </tr>
                  ) : (
                    filtered.map((v) => (
                      <tr
                        key={v.sku}
                        className={`border-b border-border/30 last:border-0 transition-colors hover:bg-white/5 ${
                          v.availability === "out_of_stock" ? "opacity-40" : ""
                        }`}
                      >
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 rounded-full shrink-0"
                              style={{
                                backgroundColor:
                                  { Black: "#111", "Sea Blue": "#5b7f8a", White: "#f5f2ea", Cream: "#e9dfc9",
                                    Khaki: "#a08b6a", "Army Green": "#4a5238", Pink: "#d8a9a3", Wine: "#5c1f28",
                                    Brown: "#6b4226", Grey: "#9e9e9e",
                                  }[v.color] ?? "#ccc",
                              }}
                            />
                            {v.color}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">{v.gsm}</td>
                        <td className="px-3 py-2 font-mono">{v.size}</td>
                        <td className="px-3 py-2 tabular-nums">${v.price}</td>
                        <td className="px-3 py-2">
                          <StockEditor variant={v} onUpdate={refresh} />
                        </td>
                        <td className="px-3 py-2"><AvailPill status={v.availability} /></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === "media" && <MediaTab />}
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "database" && <DatabaseTab />}
      </div>
      </div>
    </div>
  );
}

// ─── Route component ──────────────────────────────────────────────────────────

function AdminPage() {
  const [authed, setAuthed] = useState(isAdminAuthenticated());

  if (!authed) {
    return <LoginScreen onLogin={() => setAuthed(true)} />;
  }

  return <AdminPanel onLogout={() => setAuthed(false)} />;
}
