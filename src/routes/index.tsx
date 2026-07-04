import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Instagram, Twitter } from "lucide-react";
import ExpandOnHover from "@/components/ui/expand-cards";
import teesRack from "@/assets/tees-rack.jpeg.asset.json";
import capsFlatlay from "@/assets/caps-flatlay.jpeg.asset.json";
import teesDetail from "@/assets/tees-detail.jpeg.asset.json";
import videoFrame from "@/assets/video-frame.jpg.asset.json";
import lookbookVideo from "@/assets/lookbook-video.mp4.asset.json";
import heroImg from "@/assets/hero.jpg";
import storyImg from "@/assets/story.jpg";
import logo from "@/assets/isq-logo-new.jpeg.asset.json";
import { CartProvider } from "@/lib/cart";
import { Header, CartDrawer } from "@/components/site-chrome";
import { ProductCard } from "@/components/product-card";
import { tees, caps, sizes, gsmOptions, type Gsm } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ISQ Studios — The Reckless Culture" },
      { name: "description", content: "Premium plain t-shirts and trucker caps. Minimal essentials designed for everyday expression." },
      { property: "og:title", content: "ISQ Studios — The Reckless Culture" },
      { property: "og:description", content: "Minimal essentials designed for everyday expression." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background text-foreground">
        <TopBanner />
        <Header />
        <main>
          <Hero />
          <Marquee />
          <Tees />
          <Caps />
          <Story />
          <Lookbook />
          <Values />
          <Newsletter />
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}

function TopBanner() {
  return (
    <div className="bg-ink py-2 text-center text-[10px] uppercase tracking-[0.32em] text-cream/90">
      Complimentary shipping on orders over $150 · Est. 2024
    </div>
  );
}

function Hero() {
  return (
    <section className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="order-2 flex flex-col justify-between px-6 py-14 lg:order-1 lg:col-span-5 lg:px-14 lg:py-24">
          <div className="eyebrow">Collection 001 — Essentials</div>
          <div className="mt-10 lg:mt-0">
            <h1 className="font-display text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.95]">
              The Reckless<br />Culture.
            </h1>
            <p className="mt-6 max-w-md text-base text-foreground/70">
              Minimal essentials designed for everyday expression. Heavyweight cotton, considered cuts,
              nothing loud.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#tees" className="group inline-flex items-center justify-center gap-2 bg-ink px-8 py-4 text-xs uppercase tracking-[0.24em] text-cream">
                Shop T-Shirts <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </a>
              <a href="#caps" className="group inline-flex items-center justify-center gap-2 border border-ink px-8 py-4 text-xs uppercase tracking-[0.24em] hover:bg-ink hover:text-cream">
                Shop Caps <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
          <div className="mt-14 flex items-center gap-6 text-[10px] uppercase tracking-[0.32em] text-muted-foreground lg:mt-0">
            <span>ISQ / Studios</span>
            <span className="hairline flex-1" />
            <span>MMXXVI</span>
          </div>
        </div>
        <div className="order-1 lg:order-2 lg:col-span-7">
          <div className="relative h-[70vh] min-h-[520px] w-full lg:h-[calc(100vh-6rem)]">
            <img src={heroImg} alt="Two models wearing ISQ Studios essentials" width={1600} height={1024} className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const words = ["Heavyweight Cotton", "Garment Dyed", "Made Considered", "The Reckless Culture", "Everyday Essentials"];
  return (
    <div className="overflow-hidden border-y border-border bg-bone/40 py-4">
      <div className="flex animate-[marquee_40s_linear_infinite] gap-14 whitespace-nowrap text-xs uppercase tracking-[0.32em] text-foreground/70">
        {[...words, ...words, ...words].map((w, i) => (
          <span key={i} className="flex items-center gap-14">
            {w} <span className="text-gold">✦</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0);} to { transform: translateX(-50%);} }`}</style>
    </div>
  );
}

function Tees() {
  const [color, setColor] = useState<string>("All");
  const [size, setSize] = useState<string>("All");
  const colorOptions = ["All", ...Array.from(new Set(tees.map((t) => t.color)))];
  const filtered = useMemo(() => tees.filter((t) => color === "All" || t.color === color), [color]);
  void size;

  return (
    <section id="tees" className="mx-auto max-w-[1400px] px-6 py-24 lg:px-14 lg:py-32">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <div className="eyebrow">The Tee — 001</div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Plain, not plain.</h2>
        </div>
        <p className="max-w-sm text-sm text-foreground/70">
          A heavyweight 240 GSM cotton tee, cut boxy, finished clean. Eight tones. One silhouette.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-y border-border py-4 text-xs uppercase tracking-[0.24em]">
        <span className="text-muted-foreground">Color</span>
        {colorOptions.map((c) => (
          <button key={c} onClick={() => setColor(c)} className={`transition-colors ${color === c ? "text-foreground underline underline-offset-4" : "text-muted-foreground hover:text-foreground"}`}>
            {c}
          </button>
        ))}
        <span className="ml-auto text-muted-foreground">Size</span>
        {["All", ...sizes].map((s) => (
          <button key={s} onClick={() => setSize(s)} className={`transition-colors ${size === s ? "text-foreground underline underline-offset-4" : "text-muted-foreground hover:text-foreground"}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

function Caps() {
  return (
    <section id="caps" className="border-t border-border bg-bone/50">
      <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-14 lg:py-32">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="eyebrow">The Cap — 002</div>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Trucker, refined.</h2>
          </div>
          <p className="max-w-sm text-sm text-foreground/70">
            Structured six-panel. Cotton twill front, breathable mesh back. Adjustable snap.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-4">
          {caps.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Story() {
  return (
    <section id="story" className="mx-auto grid max-w-[1400px] grid-cols-1 gap-0 px-0 py-24 lg:grid-cols-12 lg:py-32">
      <div className="order-2 flex items-center px-6 py-10 lg:order-1 lg:col-span-6 lg:px-14 lg:py-0">
        <div>
          <div className="eyebrow">The Studio</div>
          <h2 className="mt-4 font-display text-4xl leading-[1.05] md:text-5xl">
            A culture of<br />individuality and<br />fearless expression.
          </h2>
          <p className="mt-8 max-w-lg text-base text-foreground/70">
            ISQ Studios is built around minimal designs and everyday essentials. We create pieces
            that let people express themselves without unnecessary noise — quiet garments made
            for people with something to say.
          </p>
          <a href="#tees" className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-foreground underline underline-offset-8">
            Explore the collection <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
      <div className="order-1 lg:order-2 lg:col-span-6">
        <img src={storyImg} alt="ISQ Studios lookbook" loading="lazy" width={1200} height={1400} className="h-full max-h-[720px] w-full object-cover" />
      </div>
    </section>
  );
}

function Lookbook() {
  return (
    <section className="bg-[#f5f4f3]">
      <div className="mx-auto max-w-[1400px] px-6 pt-20 lg:px-14 lg:pt-28">
        <div className="eyebrow">The Lookbook</div>
        <h2 className="mt-3 max-w-2xl font-display text-4xl md:text-5xl">
          Studio 001 — hover to expand.
        </h2>
      </div>
      <div className="pt-10 pb-20 lg:pb-28">
        <ExpandOnHover
          images={[
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=720&q=80",
            teesRack.url,
            "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=720&q=80",
            "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=720&q=80",
            capsFlatlay.url,
            teesDetail.url,
            "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=720&q=80",
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=720&q=80",
            videoFrame.url,
          ]}
          videoIndex={8}
          videoUrl={lookbookVideo.url}
        />
      </div>
    </section>
  );
}

function Values() {
  const items = [
    { n: "01", t: "Premium Fabrics", d: "Heavyweight cotton sourced for weight, drape, and honest wear." },
    { n: "02", t: "Timeless Design", d: "Silhouettes stripped of trend. Made once, made right." },
    { n: "03", t: "Everyday Comfort", d: "Cut for daily rotation. Softens with every wash." },
    { n: "04", t: "Streetwear Roots", d: "Grown from culture. Built for the street, refined for the studio." },
  ];
  return (
    <section className="border-y border-border bg-ink text-cream">
      <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-14 lg:py-28">
        <div className="eyebrow text-cream/60">Why ISQ Studios</div>
        <h2 className="mt-3 max-w-3xl font-display text-4xl text-cream md:text-5xl">
          Considered essentials, made without compromise.
        </h2>
        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-14">
          {items.map((i) => (
            <div key={i.n} className="border-t border-cream/20 pt-6">
              <div className="text-xs tracking-[0.32em] text-gold">{i.n}</div>
              <h3 className="mt-4 font-display text-2xl text-cream">{i.t}</h3>
              <p className="mt-3 text-sm text-cream/70">{i.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 text-center lg:py-32">
      <div className="eyebrow">The Newsletter</div>
      <h2 className="mt-4 font-display text-4xl md:text-6xl">Join The Reckless Culture.</h2>
      <p className="mx-auto mt-4 max-w-md text-sm text-foreground/70">
        Get first access to new drops, private collections, and studio notes. No noise.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (email) setOk(true);
        }}
        className="mx-auto mt-10 flex max-w-md items-center border-b border-ink"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="flex-1 bg-transparent px-1 py-3 text-sm outline-none placeholder:text-muted-foreground"
        />
        <button className="px-2 py-3 text-xs uppercase tracking-[0.24em]">Subscribe →</button>
      </form>
      {ok && <p className="mt-4 text-xs uppercase tracking-[0.24em] text-gold">Welcome to the culture.</p>}
    </section>
  );
}

function Footer() {
  return (
    <footer id="footer" className="border-t border-border bg-bone/60">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-10 px-6 py-16 md:grid-cols-4 lg:px-14">
        <div className="col-span-2">
          <img src={logo.url} alt="ISQ Studios" className="h-12 w-auto" />
          <p className="mt-4 text-xs uppercase tracking-[0.32em] text-muted-foreground">The Reckless Culture</p>
          <p className="mt-6 max-w-xs text-sm text-foreground/70">
            Minimal essentials designed for everyday expression. Built in-studio, worn in the world.
          </p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-[0.24em]">Shop</h4>
          <ul className="mt-4 space-y-2 text-sm text-foreground/70">
            <li><a href="#tees" className="hover:text-foreground">T-Shirts</a></li>
            <li><a href="#caps" className="hover:text-foreground">Trucker Caps</a></li>
            <li><a href="#tees" className="hover:text-foreground">New Arrivals</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-[0.24em]">Studio</h4>
          <ul className="mt-4 space-y-2 text-sm text-foreground/70">
            <li><a href="#story" className="hover:text-foreground">About</a></li>
            <li><a href="#" className="hover:text-foreground">Contact</a></li>
            <li><a href="#" className="hover:text-foreground">Shipping & Returns</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1400px] flex-col-reverse items-center justify-between gap-4 px-6 py-6 text-xs text-muted-foreground md:flex-row lg:px-14">
          <p>© {new Date().getFullYear()} ISQ Studios. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Instagram" className="hover:text-foreground"><Instagram className="h-4 w-4" /></a>
            <a href="#" aria-label="Twitter" className="hover:text-foreground"><Twitter className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
