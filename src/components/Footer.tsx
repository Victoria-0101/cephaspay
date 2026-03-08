import { useState } from "react";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import logo from "@/assets/logo.jpg";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      toast.success("Thanks for subscribing! You'll hear from us soon.");
      setEmail("");
    }
  };

  return (
    <footer className="bg-foreground text-background pb-16 md:pb-0">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Company Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={logo} alt="CephasTech" className="h-8 w-auto object-contain rounded" />
              <span className="text-lg font-bold tracking-tight">CephasTech</span>
            </div>
            <p className="text-sm text-background/60 leading-relaxed">
              Your trusted marketplace for phones, gadgets & electronics. Quality products, genuine warranties, and exceptional service since 2020.
            </p>
            <div className="space-y-2 text-xs text-background/50">
              <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 shrink-0" /> Oluere Junction, Off Sabo, Ilare, Ile-Ife, Osun State</p>
              <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 shrink-0" /> +234 703 083 8269</p>
              <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 shrink-0" /> cephaspay1@gmail.com</p>
            </div>
            <div className="flex items-center gap-3 pt-1">
              {[
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="h-9 w-9 rounded-full border border-background/20 flex items-center justify-center text-background/50 hover:text-background hover:border-background/60 luxury-transition"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Support */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-5 text-background/80">Support</h4>
            <ul className="space-y-3">
              {[
                { label: "Track Order", href: "/login" },
                { label: "FAQs", href: "/faq" },
                { label: "Shipping Policy", href: "/info/shipping" },
                { label: "Returns & Refunds", href: "/info/returns" },
                { label: "Contact Us", href: "/contact" },
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-background/50 hover:text-background luxury-transition">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-5 text-background/80">Categories</h4>
            <ul className="space-y-3">
              {[
                { label: "Smartphones", href: "/#products" },
                { label: "Laptops", href: "/#products" },
                { label: "Audio", href: "/#products" },
                { label: "Wearables", href: "/#products" },
                { label: "Accessories", href: "/#products" },
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-background/50 hover:text-background luxury-transition">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-5 text-background/80">Stay Updated</h4>
            <p className="text-sm text-background/50 mb-4 leading-relaxed">
              Get the latest deals, new arrivals, and exclusive offers delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-0">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 rounded-r-none bg-background/10 border-background/20 text-background placeholder:text-background/40 focus-visible:ring-primary text-sm"
              />
              <Button type="submit" size="icon" className="h-10 w-11 rounded-l-none shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <p className="text-[11px] text-background/30 mt-3">No spam, ever. Unsubscribe anytime.</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-background/40">© {new Date().getFullYear()} CephasTech. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-background/40">
            <a href="/info/privacy" className="hover:text-background luxury-transition">Privacy Policy</a>
            <a href="/info/terms" className="hover:text-background luxury-transition">Terms of Service</a>
            <a href="/contact" className="hover:text-background luxury-transition">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
