import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/site-chrome";
import { CartProvider } from "@/lib/cart";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <CartProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="mx-auto max-w-[1400px] px-6 py-24 lg:px-14 lg:py-32">
          <div className="eyebrow">Get In Touch</div>
          <h1 className="mt-4 font-display text-5xl md:text-7xl">Contact</h1>
          <div className="mt-12 grid grid-cols-1 gap-16 md:grid-cols-2">
            {/* Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xs uppercase tracking-[0.24em]">Email</h3>
                <a href="mailto:ikequasie2003@gmail.com" className="mt-2 block text-sm text-foreground/70 hover:text-foreground transition-colors">
                  ikequasie2003@gmail.com
                </a>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-[0.24em]">Snapchat</h3>
                <a href="https://snapchat.com/add/mr.quasie" target="_blank" rel="noreferrer" className="mt-2 block text-sm text-foreground/70 hover:text-foreground transition-colors">
                  mr.quasie
                </a>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-[0.24em]">Instagram</h3>
                <a href="https://instagram.com/he.is.mr.quasie" target="_blank" rel="noreferrer" className="mt-2 block text-sm text-foreground/70 hover:text-foreground transition-colors">
                  @he.is.mr.quasie
                </a>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-[0.24em]">Response Time</h3>
                <p className="mt-2 text-sm text-foreground/70">We typically reply within 24–48 hours.</p>
              </div>
            </div>
            {/* Form */}
            <div>
              {sent ? (
                <p className="text-sm uppercase tracking-[0.24em] text-foreground/70">Message sent. We'll be in touch.</p>
              ) : (
                <form
                  onSubmit={(e) => { e.preventDefault(); setSent(true); }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-xs uppercase tracking-[0.24em] text-foreground/60">Name</label>
                    <input required type="text" className="mt-2 w-full border-b border-border bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.24em] text-foreground/60">Email</label>
                    <input required type="email" className="mt-2 w-full border-b border-border bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground" placeholder="Your email" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.24em] text-foreground/60">Message</label>
                    <textarea required rows={4} className="mt-2 w-full border-b border-border bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground resize-none" placeholder="What's on your mind?" />
                  </div>
                  <button type="submit" className="border border-foreground px-8 py-3 text-xs uppercase tracking-[0.24em] hover:bg-foreground hover:text-background transition-colors">
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </main>
      </div>
    </CartProvider>
  );
}
