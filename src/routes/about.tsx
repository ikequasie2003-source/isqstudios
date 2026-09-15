import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site-chrome";
import { CartProvider } from "@/lib/cart";
import { AboutBackground } from "@/components/about-background";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <CartProvider>
      <AboutBackground>
        <Header />
        <main className="mx-auto max-w-[1400px] px-6 py-24 text-white lg:px-14 lg:py-32">
          <div className="eyebrow text-yellow-400/70">Our Story</div>
          <h1 className="mt-4 font-display text-5xl md:text-7xl">About ISQ Studios</h1>
          <div className="mt-12 grid grid-cols-1 gap-16 md:grid-cols-2">
            <div className="space-y-6 text-base leading-relaxed text-white/80">
              <p>
                ISQ Studios was born out of a simple belief — that everyday essentials should feel considered. Not loud, not disposable. Just well made, worn with intention.
              </p>
              <p>
                We design minimal pieces built for real life. Heavyweight tees. Structured trucker caps. Garments you reach for every day without thinking, because they just work.
              </p>
              <p>
                Everything starts in-studio. Every fabric weight, every stitch, every silhouette is deliberate. We don't chase trends — we build the kind of wardrobe staples that outlast them.
              </p>
            </div>
            <div className="space-y-6 text-base leading-relaxed text-white/80">
              <p>
                The Reckless Culture isn't about chaos — it's about confidence. Wearing what you want, how you want, without needing validation. It's the mindset behind every piece we make.
              </p>
              <p>
                We're a small studio. That's intentional. It means every order matters, every detail gets attention, and we can keep doing things the right way — slowly, carefully, and with purpose.
              </p>
            </div>
          </div>
        </main>
      </AboutBackground>
    </CartProvider>
  );
}
