import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useRef, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import ExpandOnHover from "@/components/ui/expand-cards";
import lb1 from "@/assets/lookbook/q.png";
import lb2 from "@/assets/lookbook/qa.png";
import lb3 from "@/assets/lookbook/qq.png";
import lb4 from "@/assets/lookbook/qs.png";
import lb5 from "@/assets/lookbook/qw.png";
import lb6 from "@/assets/lookbook/ChatGPT Image Jul 5, 2026, 01_38_05 PM - Copy.png";
import lb7 from "@/assets/lookbook/ChatGPT Image Jul 5, 2026, 01_40_12 PM - Copy.png";
import lb8 from "@/assets/lookbook/ChatGPT Image Jul 5, 2026, 01_42_37 PM - Copy.png";
import lbVideo from "@/assets/lookbook/qv.mp4";
import heroImg from "@/assets/hero.jpg";
import storyImg from "@/assets/story.jpg";
import teeBlack from "@/assets/tee-black.jpg";
import teeWhite from "@/assets/tee-white.jpg";
import capBlack from "@/assets/cap-black.jpg";
import capFlatlay from "@/assets/lookbook/qk.png";
import teeRack from "@/assets/lookbook/ql.png";
import { CartProvider } from "@/lib/cart";
import { Header, CartDrawer } from "@/components/site-chrome";
import { ProductCard } from "@/components/product-card";
import { tees, caps, sizes, gsmOptions, type Gsm } from "@/lib/products";
import { Logo } from "@/components/logo";

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
    <div className="bg-ink py-2 overflow-hidden text-center text-[10px] uppercase tracking-[0.32em] text-cream/90">
      <div className="flex animate-[marquee_18s_linear_infinite] gap-16 whitespace-nowrap">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} style={{ fontFamily: "'Times New Roman', Times, serif" }}>
            The Reckless Culture <span className="text-gold/60">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[500px] overflow-hidden">
      {/* Full-bleed editorial photo */}
      <img
        src={heroImg}
        alt="ISQ Studios — The Reckless Culture"
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
      {/* Dark gradient overlay — bottom heavy so text on left reads */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Content — left aligned, vertically centred */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-14">
          <div className="max-w-xl">
            <div className="eyebrow text-cream/60">Collection 001 — Essentials</div>
            <h1 className="mt-4 font-display text-[clamp(3rem,7vw,6.5rem)] leading-[0.92] text-white">
              The Reckless<br />Culture.
            </h1>
            <p className="mt-6 max-w-md text-base text-white/60">
              Minimal essentials designed for everyday expression. Heavyweight cotton, considered cuts, nothing loud.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            </div>
          </div>
        </div>
      </div>

      {/* Bottom meta bar */}
      <div className="absolute bottom-6 left-0 right-0 z-10">
        <div className="mx-auto flex max-w-[1400px] items-center gap-6 px-6 text-[10px] uppercase tracking-[0.32em] text-white/30 lg:px-14">
          <span>ISQ / Studios</span>
          <span className="flex-1 border-t border-white/10" />
          <span>MMXXVI</span>
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
  return (
    <section id="tees" className="relative overflow-hidden">
      {/* Full-bleed tee image */}
      <div className="relative h-[85vh] min-h-[560px]">
        <img
          src={teeRack}
          alt="ISQ Studios Essential Tee"
          className="absolute inset-0 h-full w-full object-cover object-center"
          style={{ animation: "teeSwing 6s ease-in-out infinite", transformOrigin: "top center" }}
        />
        <style>{`
          @keyframes teeSwing {
            0%, 100% { transform: rotate(-3deg) scale(1.05); }
            50%       { transform: rotate(3deg) scale(1.05); }
          }
        `}</style>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex h-full items-center">
          <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-14">
            <div className="max-w-lg">
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#b8952a]">Collection 001</p>
              <h2 className="mt-3 font-display text-5xl leading-[0.95] text-white md:text-6xl">
                The Tee.
              </h2>
              <p className="mt-5 max-w-xs text-sm text-white/55">
                100% ring-spun cotton. Three weights. Eight tones. One silhouette.
              </p>
              <a
                href="/shop?cat=tees"
                className="mt-8 inline-flex items-center gap-2 border border-white/30 bg-white/10 px-8 py-4 text-xs uppercase tracking-[0.24em] text-white backdrop-blur-md transition-all hover:border-[#b8952a] hover:bg-[#b8952a]/20"
              >
                Shop T-Shirts <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


function Caps() {
  return (
    <section id="caps" className="relative overflow-hidden">
      <div className="relative h-[85vh] min-h-[560px]">
        {/* Two grey caps facing opposite directions */}
        <div className="absolute inset-0 flex items-center justify-between gap-8 bg-white px-16">
          {/* Cap 1 — facing right */}
          <img
            src={capFlatlay}
            alt="Trucker Cap"
            className="h-[95%] w-auto object-contain"
            style={{ animation: "capLeft 6s ease-in-out infinite" }}
          />
          {/* Cap 2 — facing left (mirrored) */}
          <img
            src={capFlatlay}
            alt="Trucker Cap"
            className="h-[95%] w-auto object-contain"
            style={{ animation: "capRight 6s ease-in-out infinite 1s" }}
          />
        </div>
        <style>{`
          @keyframes capLeft {
            0%, 100% { transform: scaleX(-1) rotate(8deg) translateY(0); }
            50%       { transform: scaleX(-1) rotate(5deg) translateY(-10px); }
          }
          @keyframes capRight {
            0%, 100% { transform: rotate(-8deg) translateY(0); }
            50%       { transform: rotate(-5deg) translateY(-10px); }
          }
        `}</style>
        {/* Gradient — darkens bottom for text, keeps cap visible */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/5" />

        {/* Content — bottom left */}
        <div className="relative z-10 flex h-full items-end">
          <div className="mx-auto w-full max-w-[1400px] px-6 pb-14 lg:px-14 lg:pb-20">
            <div className="max-w-lg">
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#b8952a]">Collection 002</p>
              <h2 className="mt-3 font-display text-5xl leading-[0.95] text-white md:text-6xl">
                The Cap.
              </h2>
              <p className="mt-5 max-w-xs text-sm text-white/55">
                Structured six-panel. Cotton twill front, breathable mesh back. Adjustable snap.
              </p>
              <div className="mt-8">
                <a
                  href="/shop?cat=caps"
                  className="inline-flex items-center gap-2 border border-white/30 bg-white/10 px-8 py-4 text-xs uppercase tracking-[0.24em] text-white backdrop-blur-md transition-all hover:border-[#b8952a] hover:bg-[#b8952a]/20"
                >
                  Shop Caps <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
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
          images={[lb1, lb2, lb3, lb4, lb5, lb6, lb7, lb8, lb1]}
          videoIndex={8}
          videoUrl={lbVideo}
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
      {/* Social icons */}
      <div className="mt-8 flex items-center justify-center gap-5 text-muted-foreground">
        <a href="https://instagram.com/he.is.mr.quasie" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-foreground">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>
        <a href="https://twitter.com/big_H_M" target="_blank" rel="noreferrer" aria-label="X (Twitter)" className="hover:text-foreground">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.25 2.25h6.918l4.259 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
          </svg>
        </a>
        <a href="mailto:ikequasie2003@gmail.com" aria-label="Gmail" className="hover:text-foreground">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
        </a>
        <a href="https://snapchat.com/add/mr.quasie" target="_blank" rel="noreferrer" aria-label="Snapchat" className="hover:text-foreground">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.002 2C8.667 2 6.667 4.002 6.667 7.335v.668c-.668.168-1.336.502-1.336.502s-.166.5.168.668c0 0-.502.334-.502.836 0 .334.168.668.502.836 0 0-.334.668-.334 1.17 0 .334.166.668.5.836-.168.334-.668 1.002-1.336 1.17-.668.168-1.502.334-1.67.836-.166.502.502.836 1.17 1.004.668.168 1.002.334 1.17.668.166.334-.168 1.336-.336 1.67-.166.336.168.502.504.336.668-.336 1.502-.836 2.504-.836.5 0 1.002.168 1.336.334.502.334 1.004.668 1.506.668s1.002-.334 1.504-.668c.334-.166.836-.334 1.336-.334 1.002 0 1.836.5 2.506.836.334.166.668 0 .502-.336-.168-.334-.502-1.336-.336-1.67.168-.334.502-.5 1.17-.668.668-.168 1.336-.502 1.17-1.004-.166-.502-1-.668-1.67-.836-.668-.168-1.168-.836-1.336-1.17.334-.168.5-.502.5-.836 0-.502-.502-.836-.502-.836.334-.168.502-.5.502-.836 0-.502-.502-.836-.502-.836.334-.168.168-.668.168-.668s-.668-.334-1.336-.502v-.668C17.335 4.002 15.335 2 12.002 2z"/>
          </svg>
        </a>
      </div>
    </section>
  );
}

function FooterScrollIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center text-center"
      style={{ opacity: 0, transform: "translateY(32px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}
    >
      <Logo className="h-20 w-auto" />
      <p className="mt-5 max-w-sm text-sm leading-relaxed text-foreground/60">
        Minimal essentials designed for everyday expression. Built in-studio, worn in the world.
      </p>
    </div>
  );
}

function Footer() {
  return (
    <footer id="footer" className="border-t border-border bg-bone/60">
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-14">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Brand */}
          <div className="md:col-span-1">
            <Logo className="h-14 w-auto" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-foreground/60">
              Minimal essentials designed for everyday expression. Built in-studio, worn in the world.
            </p>
          </div>
          {/* Shop */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">Studio</h4>
            <ul className="mt-5 space-y-3 text-sm">
              <li><a href="#story" className="text-foreground/60 transition-colors hover:text-foreground">About</a></li>
              <li><a href="#" className="text-foreground/60 transition-colors hover:text-foreground">Contact</a></li>
              <li><a href="#" className="text-foreground/60 transition-colors hover:text-foreground">Shipping & Returns</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-14">
          <FooterScrollIn />
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1400px] items-center justify-center px-6 py-6 text-xs text-muted-foreground lg:px-14">
          <p>© {new Date().getFullYear()} ISQ Studios. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
