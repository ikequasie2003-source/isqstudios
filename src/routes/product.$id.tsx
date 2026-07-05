import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState, useCallback, useEffect } from "react";
import { Minus, Plus, ShoppingBag, Truck, RotateCcw, Shield, ChevronDown } from "lucide-react";
import { CartProvider } from "@/lib/cart";
import { Header, CartDrawer } from "@/components/site-chrome";
import { useCart } from "@/lib/cart";
import { tees, gsmOptions, sizes, type Gsm, type Size } from "@/lib/products";
import { ProductGallery } from "@/components/product-gallery";
import { getQty, getTotalQty, getAvailability, getVariant } from "@/lib/inventory";
import { resolveGalleryImages } from "@/lib/media-resolver";

export const Route = createFileRoute("/product/$id")({
  head: ({ params }) => {
    const color = params.id.split("-").slice(2).join(" ");
    return {
      meta: [
        { title: `Essential Tee — ${color} | ISQ Studios` },
        { name: "description", content: "Premium heavyweight cotton tee. Three weights. One silhouette." },
      ],
    };
  },
  loader: ({ params }) => {
    const base = tees.find(
      (t) => t.id === params.id || t.color.toLowerCase().replace(/\s+/g, "-") === params.id,
    );
    if (!base) throw notFound();
    return base;
  },
  component: ProductDetailPage,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="font-display text-3xl">Product not found</p>
        <a href="/shop" className="mt-4 inline-block text-sm underline underline-offset-4">
          Back to Shop
        </a>
      </div>
    </div>
  ),
});

function ProductDetailPage() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main>
          <ProductDetail />
        </main>
        <CartDrawer />
      </div>
    </CartProvider>
  );
}

// ─── Accordion ────────────────────────────────────────────────────────────────

function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-xs uppercase tracking-[0.24em]"
      >
        {title}
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="pb-5 text-sm leading-relaxed text-foreground/70">{children}</div>}
    </div>
  );
}

// ─── Availability badge ───────────────────────────────────────────────────────

function AvailabilityBadge({ totalStock }: { totalStock: number }) {
  if (totalStock > 10)
    return (
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">In Stock</span>
      </div>
    );
  if (totalStock > 0)
    return (
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-amber-400" />
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Low Stock — {totalStock} remaining
        </span>
      </div>
    );
  return (
    <div className="flex items-center gap-2">
      <span className="h-2 w-2 rounded-full bg-red-500" />
      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Out of Stock</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

function ProductDetail() {
  const base = Route.useLoaderData();
  const { add, setOpen } = useCart();

  const [gsm, setGsm] = useState<Gsm>((base.gsm as Gsm) ?? "260");
  const [color, setColor] = useState<string>(base.color);
  const [size, setSize] = useState<Size | null>(null);
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  // Current product record
  const product = tees.find((t) => t.gsm === gsm && t.color === color) ?? base;

  // Colors for selected GSM
  const colorsForGsm = tees
    .filter((t) => t.gsm === gsm)
    .reduce<{ color: string; swatch: string }[]>((acc, t) => {
      if (!acc.find((c) => c.color === t.color)) acc.push({ color: t.color, swatch: t.swatch });
      return acc;
    }, []);

  // Live inventory reads
  const stockForSize = useCallback((s: Size) => getQty(gsm, color, s), [gsm, color]);
  const totalStock = getTotalQty(gsm, color);
  const selectedVariant = size ? getVariant(gsm, color, size) : null;

  // Keep qty within available stock when selection changes
  useEffect(() => {
    if (size) {
      const avail = stockForSize(size);
      if (qty > avail) setQty(Math.max(1, avail));
    }
  }, [size, gsm, color, stockForSize, qty]);

  const handleGsmChange = useCallback(
    (newGsm: Gsm) => {
      setGsm(newGsm);
      setSize(null);
      setSizeError(false);
      setAddError(null);
      setQty(1);
      const available = tees.filter((t) => t.gsm === newGsm);
      if (!available.find((t) => t.color === color))
        setColor(available[0]?.color ?? color);
    },
    [color],
  );

  const handleColorChange = (c: string) => {
    setColor(c);
    setSize(null);
    setSizeError(false);
    setAddError(null);
    setQty(1);
  };

  const galleryImages = resolveGalleryImages(gsm, color);
  const currentGsm = gsmOptions.find((g) => g.value === gsm)!;

  const delivery = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    const from = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    d.setDate(d.getDate() + 4);
    const to = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return `${from} – ${to}`;
  })();

  const handleAddToCart = () => {
    if (!size) {
      setSizeError(true);
      document.getElementById("size-selector")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const result = add({ gsm, color, size, qty, name: product.name, image: product.image });

    if (!result.ok) {
      const msg =
        result.reason === "out_of_stock"
          ? "This size is sold out."
          : result.reason === "insufficient_stock"
          ? `Only ${result.available} unit${result.available !== 1 ? "s" : ""} available.`
          : "Variant not found.";
      setAddError(msg);
      return;
    }

    setAddError(null);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setOpen(true);
    }, 600);
  };

  // SKU display — use selected variant SKU or product-level ID
  const displaySku = selectedVariant?.sku ?? product.id.toUpperCase();

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-14 lg:py-16">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
        <a href="/" className="hover:text-foreground">Home</a>
        <span>/</span>
        <a href="/shop" className="hover:text-foreground">Shop</a>
        <span>/</span>
        <span className="text-foreground">Essential Tee</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
        {/* ── Gallery ── */}
        <div className="lg:col-span-7">
          <ProductGallery
            images={galleryImages}
            swatch={product.swatch}
            colorName={color}
            stockBadge={
              totalStock > 0 && totalStock <= 5 ? (
                <div className="bg-background/90 px-2.5 py-1 text-[10px] uppercase tracking-widest backdrop-blur">
                  Only {totalStock} left
                </div>
              ) : totalStock === 0 ? (
                <div className="bg-ink px-2.5 py-1 text-[10px] uppercase tracking-widest text-cream">
                  Sold Out
                </div>
              ) : undefined
            }
          />
        </div>

        {/* ── Info ── */}
        <div className="lg:col-span-5">
          <div className="eyebrow">ISQ Studios — Essential Tee</div>
          <h1 className="mt-2 font-display text-3xl leading-tight md:text-4xl">Essential Tee</h1>

          <div className="mt-2 flex flex-wrap items-baseline gap-3">
            <p className="text-2xl">${currentGsm.price * qty}</p>
            {qty > 1 && (
              <span className="text-sm text-muted-foreground">${currentGsm.price} each</span>
            )}
          </div>

          {/* SKU + weight */}
          <div className="mt-1 flex flex-wrap gap-3 text-[11px] uppercase tracking-widest text-muted-foreground">
            <span>SKU: {displaySku}</span>
            {selectedVariant && (
              <>
                <span>·</span>
                <span>{selectedVariant.weight}g</span>
                {selectedVariant.barcode && (
                  <>
                    <span>·</span>
                    <span>Barcode: {selectedVariant.barcode}</span>
                  </>
                )}
              </>
            )}
          </div>

          {/* Availability */}
          <div className="mt-3">
            <AvailabilityBadge totalStock={totalStock} />
          </div>

          <p className="mt-5 text-sm leading-relaxed text-foreground/70">
            A premium everyday tee built on a clean, boxy silhouette. Crafted from 100% ring-spun
            cotton — no blends, no shortcuts. Made to be worn daily and improve with every wash.
          </p>

          <div className="mt-8 space-y-7">
            {/* ── Step 1: GSM ── */}
            <div>
              <div className="mb-3 flex items-baseline justify-between">
                <p className="text-xs uppercase tracking-[0.24em]">
                  <span className="mr-2 text-gold">01</span> Weight
                </p>
                <span className="text-xs text-muted-foreground">{currentGsm.blurb}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {gsmOptions.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => handleGsmChange(g.value)}
                    className={`rounded-full border px-5 py-2 text-xs uppercase tracking-[0.2em] transition-colors ${
                      gsm === g.value
                        ? "border-ink bg-ink text-cream"
                        : "border-border hover:border-ink"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Step 2: Color ── */}
            <div>
              <div className="mb-3 flex items-baseline justify-between">
                <p className="text-xs uppercase tracking-[0.24em]">
                  <span className="mr-2 text-gold">02</span> Color
                </p>
                <span className="text-xs text-muted-foreground">{color}</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {colorsForGsm.map((c) => (
                  <button
                    key={c.color}
                    onClick={() => handleColorChange(c.color)}
                    title={c.color}
                    aria-label={c.color}
                    className={`h-8 w-8 rounded-full border-2 transition-all ${
                      color === c.color
                        ? "scale-110 border-ink ring-2 ring-ink ring-offset-2 ring-offset-background"
                        : "border-transparent hover:scale-105 hover:border-ink/40"
                    }`}
                    style={{ backgroundColor: c.swatch }}
                  />
                ))}
              </div>
            </div>

            {/* ── Step 3: Size ── */}
            <div id="size-selector">
              <div className="mb-3 flex items-baseline justify-between">
                <p className={`text-xs uppercase tracking-[0.24em] ${sizeError ? "text-red-500" : ""}`}>
                  <span className="mr-2 text-gold">03</span> Size
                  {sizeError && (
                    <span className="ml-2 normal-case text-red-500">— Please select a size</span>
                  )}
                </p>
                <button className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground">
                  Size guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => {
                  const avail = stockForSize(s);
                  const status = getAvailability(gsm, color, s);
                  const unavailable = avail === 0;
                  return (
                    <button
                      key={s}
                      disabled={unavailable}
                      onClick={() => { setSize(s); setSizeError(false); setAddError(null); }}
                      title={
                        unavailable
                          ? "Out of stock"
                          : status === "low_stock"
                          ? `Only ${avail} left`
                          : `${avail} in stock`
                      }
                      className={`relative h-10 min-w-10 border px-3 text-xs uppercase tracking-widest transition-colors ${
                        unavailable
                          ? "cursor-not-allowed border-border text-muted-foreground/30"
                          : size === s
                          ? "border-ink bg-ink text-cream"
                          : status === "low_stock"
                          ? "border-amber-400 hover:border-ink"
                          : "border-border hover:border-ink"
                      }`}
                    >
                      {s}
                      {/* Strikethrough for OOS */}
                      {unavailable && (
                        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                          <span className="absolute h-px w-full rotate-[-35deg] bg-border" />
                        </span>
                      )}
                      {/* Low stock dot */}
                      {!unavailable && status === "low_stock" && (
                        <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-amber-400" />
                      )}
                    </button>
                  );
                })}
              </div>
              {/* Size-level stock hint */}
              {size && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {stockForSize(size) > 5
                    ? "In stock"
                    : stockForSize(size) > 0
                    ? `Only ${stockForSize(size)} left in size ${size}`
                    : "Out of stock"}
                </p>
              )}
            </div>

            {/* ── Step 4: Quantity ── */}
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.24em]">
                <span className="mr-2 text-gold">04</span> Quantity
              </p>
              <div className="flex w-fit items-center border border-border">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-12 text-center text-sm tabular-nums">{qty}</span>
                <button
                  onClick={() =>
                    setQty((q) => Math.min(size ? stockForSize(size) || 10 : 10, q + 1))
                  }
                  className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* ── Step 5: Add to Cart (desktop) ── */}
            <div className="hidden sm:block space-y-2">
              {addError && (
                <p className="text-xs text-red-500 uppercase tracking-widest">{addError}</p>
              )}
              <button
                onClick={handleAddToCart}
                disabled={totalStock === 0}
                className={`flex w-full items-center justify-center gap-3 py-4 text-xs uppercase tracking-[0.24em] transition-all ${
                  added
                    ? "bg-green-600 text-white"
                    : totalStock === 0
                    ? "cursor-not-allowed bg-bone text-muted-foreground"
                    : "bg-ink text-cream hover:opacity-80"
                }`}
              >
                <ShoppingBag className="h-4 w-4" />
                {added
                  ? "Added to bag!"
                  : totalStock === 0
                  ? "Sold Out"
                  : `Add to Bag — $${currentGsm.price * qty}`}
              </button>
            </div>

            {/* Delivery & trust signals */}
            <div className="space-y-3 border-t border-border pt-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <Truck className="h-4 w-4 shrink-0" />
                <span>
                  Estimated delivery{" "}
                  <strong className="text-foreground">{delivery}</strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-4 w-4 shrink-0" />
                <span>Free returns within 30 days</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 shrink-0" />
                <span>Secure checkout — SSL encrypted</span>
              </div>
            </div>
          </div>

          {/* Accordions */}
          <div className="mt-8">
            <Accordion title="Product Details" defaultOpen>
              <ul className="space-y-1.5">
                <li>100% ring-spun cotton — no polyester blends</li>
                <li>Boxy, relaxed fit with dropped shoulders</li>
                <li>Reinforced double-stitched seams</li>
                <li>Ribbed crew neck collar</li>
                <li>Pre-washed to reduce shrinkage</li>
                <li>Available in {gsm} GSM weight</li>
              </ul>
            </Accordion>
            <Accordion title="Fabric Specifications">
              <div className="space-y-1.5">
                <p>
                  <strong className="text-foreground">Composition:</strong> 100% Ring-Spun Cotton
                </p>
                <p>
                  <strong className="text-foreground">Weight:</strong> {gsm} GSM
                </p>
                <p>
                  <strong className="text-foreground">Weave:</strong> Single Jersey
                </p>
                <p>
                  <strong className="text-foreground">Finish:</strong> Garment washed, pre-shrunk
                </p>
                <p>
                  <strong className="text-foreground">Origin:</strong> Made in Portugal
                </p>
                {selectedVariant && (
                  <p>
                    <strong className="text-foreground">Garment weight:</strong>{" "}
                    {selectedVariant.weight}g
                  </p>
                )}
              </div>
            </Accordion>
            <Accordion title="Care Instructions">
              <ul className="space-y-1.5">
                <li>Machine wash cold (30°C / 86°F)</li>
                <li>Do not bleach</li>
                <li>Tumble dry low or hang dry</li>
                <li>Cool iron if needed — do not iron on print</li>
                <li>Do not dry clean</li>
              </ul>
            </Accordion>
            <Accordion title="Shipping & Returns">
              <ul className="space-y-1.5">
                <li>Standard shipping: 3–7 business days</li>
                <li>Express shipping: 1–2 business days</li>
                <li>Free shipping on orders over $150</li>
                <li>Free returns within 30 days of delivery</li>
                <li>Items must be unworn and unwashed</li>
              </ul>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Sticky Add to Cart — mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background/95 p-4 backdrop-blur sm:hidden">
        {addError && (
          <p className="mb-2 text-center text-xs uppercase tracking-widest text-red-500">
            {addError}
          </p>
        )}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs font-medium">
              Essential Tee — {gsm} GSM
            </p>
            <p className="text-xs text-muted-foreground">
              {color}
              {size ? ` · ${size}` : " · Select size"}
            </p>
          </div>
          <p className="text-sm tabular-nums">${currentGsm.price * qty}</p>
          <button
            onClick={handleAddToCart}
            disabled={totalStock === 0}
            className={`flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-[0.2em] transition-all ${
              added
                ? "bg-green-600 text-white"
                : totalStock === 0
                ? "cursor-not-allowed bg-bone text-muted-foreground"
                : "bg-ink text-cream"
            }`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            {added ? "Added!" : "Add to Bag"}
          </button>
        </div>
      </div>
    </div>
  );
}
