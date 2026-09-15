import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site-chrome";
import { CartProvider } from "@/lib/cart";

export const Route = createFileRoute("/shipping")({
  component: ShippingPage,
});

function ShippingPage() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="mx-auto max-w-[1400px] px-6 py-24 lg:px-14 lg:py-32">
          <div className="eyebrow">Policies</div>
          <h1 className="mt-4 font-display text-5xl md:text-7xl">Shipping & Returns</h1>
          <div className="mt-12 grid grid-cols-1 gap-16 md:grid-cols-2">
            {/* Shipping */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xs uppercase tracking-[0.24em]">Processing Time</h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/70">
                  All orders are processed within 2–4 business days. You'll receive a confirmation email once your order ships.
                </p>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-[0.24em]">Domestic Shipping</h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/70">
                  Standard delivery takes 5–7 business days. Express options are available at checkout.
                </p>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-[0.24em]">International Shipping</h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/70">
                  We ship worldwide. International orders typically arrive within 10–15 business days depending on destination and customs processing.
                </p>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-[0.24em]">Tracking</h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/70">
                  A tracking number will be emailed to you once your order has been dispatched.
                </p>
              </div>
            </div>
            {/* Returns */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xs uppercase tracking-[0.24em]">Returns Policy</h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/70">
                  We accept returns within 14 days of delivery. Items must be unworn, unwashed, and in their original condition with tags attached.
                </p>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-[0.24em]">How To Return</h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/70">
                  Email us at <a href="mailto:ikequasie2003@gmail.com" className="underline hover:text-foreground transition-colors">ikequasie2003@gmail.com</a> with your order number and reason for return. We'll send you return instructions within 48 hours.
                </p>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-[0.24em]">Refunds</h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/70">
                  Once your return is received and inspected, a refund will be issued to your original payment method within 5–7 business days.
                </p>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-[0.24em]">Exchanges</h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/70">
                  We don't currently offer direct exchanges. Please return your item and place a new order for the correct size or style.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </CartProvider>
  );
}
