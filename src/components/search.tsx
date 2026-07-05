import { useState, useRef, useEffect, useCallback } from "react";
import { Search, X, ArrowRight, Clock } from "lucide-react";
import { search, getSuggestions, type SearchResult } from "@/lib/search";

const RECENT_KEY = "isq_recent_searches";
const MAX_RECENT = 5;

function getRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveRecent(q: string) {
  const prev = getRecent().filter((r) => r !== q);
  localStorage.setItem(RECENT_KEY, JSON.stringify([q, ...prev].slice(0, MAX_RECENT)));
}

// ─── Result card ─────────────────────────────────────────────────────────────

function ResultCard({ result, onSelect }: { result: SearchResult; onSelect: () => void }) {
  const { product, matchedTerms } = result;
  const isLight = ["#f5f2ea", "#e9dfc9", "#d8a9a3"].includes(product.swatch);

  return (
    <a
      href={`/product/${product.id}`}
      onClick={onSelect}
      className="group flex items-center gap-4 rounded-sm px-4 py-3 transition-colors hover:bg-bone"
    >
      {/* Swatch / image */}
      <div className="relative h-14 w-11 shrink-0 overflow-hidden bg-bone">
        {product.image ? (
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center" style={{ backgroundColor: product.swatch }}>
            <svg viewBox="0 0 200 240" className={`h-3/5 w-3/5 ${isLight ? "opacity-10" : "opacity-20"}`} fill="none">
              <path
                d="M60 30 L100 15 L140 30 L175 50 L165 90 L145 82 L145 220 L55 220 L55 82 L35 90 L25 50 Z"
                stroke={isLight ? "#111" : "#fff"}
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-normal">{product.name}</p>
        <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
          {/* Color swatch dot */}
          <span
            className="h-2.5 w-2.5 rounded-full border border-border/50"
            style={{ backgroundColor: product.swatch }}
          />
          <span className="text-xs text-muted-foreground">{product.color}</span>
          {product.gsm && (
            <span className="text-xs text-muted-foreground">· {product.gsm} GSM</span>
          )}
        </div>
        {/* Matched terms */}
        {matchedTerms.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {matchedTerms.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-sm bg-gold/10 px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-gold"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Price + arrow */}
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-sm tabular-nums">${product.price}</span>
        <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </a>
  );
}

// ─── Search panel ─────────────────────────────────────────────────────────────

function SearchPanel({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    setRecent(getRecent());
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleChange = (val: string) => {
    setQuery(val);
    if (val.trim().length === 0) {
      setResults([]);
      setSuggestions([]);
      return;
    }
    setResults(search(val));
    setSuggestions(getSuggestions(val));
  };

  const handleSubmit = (q: string) => {
    if (!q.trim()) return;
    saveRecent(q.trim());
    setRecent(getRecent());
    // Navigate to shop with search param
    window.location.href = `/shop?q=${encodeURIComponent(q.trim())}`;
    onClose();
  };

  const handleSuggestion = (s: string) => {
    setQuery(s);
    setResults(search(s));
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const clearRecent = () => {
    localStorage.removeItem(RECENT_KEY);
    setRecent([]);
  };

  const showRecent = query.length === 0 && recent.length > 0;
  const showSuggestions = query.length > 0 && suggestions.length > 0;
  const showResults = query.length > 0 && results.length > 0;
  const showEmpty = query.length > 1 && results.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex flex-col" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative mx-auto w-full max-w-2xl bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(query); }}
            placeholder="Search by color, GSM, size or name…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            aria-label="Search products"
            autoComplete="off"
          />
          {query.length > 0 && (
            <button onClick={() => handleChange("")} aria-label="Clear search">
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-1 text-xs uppercase tracking-[0.24em] text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        </div>

        {/* Suggestions row */}
        {showSuggestions && (
          <div className="flex flex-wrap gap-2 border-b border-border px-5 py-3">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestion(s)}
                className="rounded-full border border-border bg-bone px-3 py-1 text-[11px] uppercase tracking-widest transition-colors hover:border-ink hover:bg-ink hover:text-cream"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto">
          {/* Recent searches */}
          {showRecent && (
            <div className="px-5 py-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Recent</p>
                <button onClick={clearRecent} className="text-[10px] text-muted-foreground underline underline-offset-4 hover:text-foreground">
                  Clear
                </button>
              </div>
              <div className="space-y-1">
                {recent.map((r) => (
                  <button
                    key={r}
                    onClick={() => handleSuggestion(r)}
                    className="flex w-full items-center gap-3 rounded-sm px-2 py-2 text-left text-sm transition-colors hover:bg-bone"
                  >
                    <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick-pick suggestions when no query */}
          {query.length === 0 && recent.length === 0 && (
            <div className="px-5 py-6">
              <p className="mb-4 text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Popular searches</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "230 GSM Black", "260 GSM White", "320 GSM", "Khaki XL",
                  "Pink 260 GSM", "Army Green", "Wine 320 GSM", "Sea Blue M",
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSuggestion(s)}
                    className="rounded-full border border-border px-3 py-1.5 text-[11px] uppercase tracking-widest transition-colors hover:border-ink"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {showResults && (
            <div className="py-2">
              <p className="px-5 pb-2 pt-2 text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                {results.length} result{results.length !== 1 ? "s" : ""}
              </p>
              <div>
                {results.map((r) => (
                  <ResultCard
                    key={r.product.id}
                    result={r}
                    onSelect={() => { saveRecent(query); onClose(); }}
                  />
                ))}
              </div>
              {/* View all */}
              <div className="border-t border-border px-5 py-4">
                <button
                  onClick={() => handleSubmit(query)}
                  className="flex w-full items-center justify-center gap-2 border border-ink py-3 text-xs uppercase tracking-[0.24em] transition-colors hover:bg-ink hover:text-cream"
                >
                  View all results for "{query}"
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Empty state */}
          {showEmpty && (
            <div className="flex flex-col items-center py-14 text-center">
              <p className="font-display text-xl">No results for "{query}"</p>
              <p className="mt-2 text-sm text-muted-foreground">Try a color, GSM, or size</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {["Black", "White", "260 GSM", "Army Green"].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSuggestion(s)}
                    className="rounded-full border border-border px-3 py-1.5 text-[11px] uppercase tracking-widest hover:border-ink"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Search trigger button (used in Header) ───────────────────────────────────

export function SearchButton() {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        onClick={handleOpen}
        aria-label="Search"
        className="flex items-center gap-1.5 text-xs uppercase tracking-[0.24em] text-foreground/80 transition-colors hover:text-foreground"
      >
        <Search className="h-4 w-4" />
      </button>
      {open && <SearchPanel onClose={handleClose} />}
    </>
  );
}
