import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/site-chrome";
import { CartProvider } from "@/lib/cart";
import { ContactGradientBackground } from "@/components/contact-gradient-background";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <CartProvider>
      <ContactGradientBackground>
        <Header />
        <main className="mx-auto max-w-[1400px] px-6 py-24 text-white lg:px-14 lg:py-32">
          <div className="eyebrow text-white/60">Get In Touch</div>
          <h1 className="mt-4 font-display text-5xl md:text-7xl">Contact</h1>
          <div className="mt-12 grid grid-cols-1 gap-16 md:grid-cols-2">
            {/* Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xs uppercase tracking-[0.24em] text-white/50">Email</h3>
                <a href="mailto:ikequasie2003@gmail.com" className="mt-2 block text-sm text-white/70 hover:text-white transition-colors">
                  ikequasie2003@gmail.com
                </a>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-[0.24em] text-white/50">Snapchat</h3>
                <a href="https://snapchat.com/add/mr.quasie" target="_blank" rel="noreferrer" className="mt-2 block text-sm text-white/70 hover:text-white transition-colors">
                  mr.quasie
                </a>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-[0.24em] text-white/50">Instagram</h3>
                <a href="https://instagram.com/he.is.mr.quasie" target="_blank" rel="noreferrer" className="mt-2 block text-sm text-white/70 hover:text-white transition-colors">
                  @he.is.mr.quasie
                </a>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-[0.24em] text-white/50">Response Time</h3>
                <p className="mt-2 text-sm text-white/70">We typically reply within 24–48 hours.</p>
              </div>
            </div>
            {/* Form */}
            <div>
              {sent ? (
                <p className="text-sm uppercase tracking-[0.24em] text-white/70">Message sent. We'll be in touch.</p>
              ) : (
                <form
                  onSubmit={(e) => { e.preventDefault(); setSent(true); }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-xs uppercase tracking-[0.24em] text-white/50">Name</label>
                    <input required type="text" className="mt-2 w-full border-b border-white/20 bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/30" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.24em] text-white/50">Email</label>
                    <input required type="email" className="mt-2 w-full border-b border-white/20 bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/30" placeholder="Your email" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.24em] text-white/50">Message</label>
                    <textarea required rows={4} className="mt-2 w-full border-b border-white/20 bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/30 resize-none" placeholder="What's on your mind?" />
                  </div>
                  <button type="submit" className="border border-white/40 px-8 py-3 text-xs uppercase tracking-[0.24em] text-white hover:bg-white hover:text-black transition-colors">
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </main>
      </ContactGradientBackground>
    </CartProvider>
  );
}
