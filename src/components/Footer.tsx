import { MapPin, Phone, Mail } from "lucide-react";
import logo from "@/assets/logo.jpg";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-foreground text-background pb-16 md:pb-0">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-1.5 mb-3">
              <img src={logo} alt="CephasTech" className="h-7 w-auto object-contain" />
              <span className="text-base font-bold">CephasTech</span>
            </div>
            <p className="text-xs text-background/60 leading-relaxed mb-3">
              Your trusted marketplace for phones, gadgets & electronics.
            </p>
            <div className="space-y-1 text-xs text-background/50">
              <p className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Oluere Junction, Off Sabo, Ilare, Ile-Ife, Osun State, Nigeria</p>
              <p className="flex items-center gap-1"><Phone className="h-3 w-3" /> +234 703 083 8269</p>
              <p className="flex items-center gap-1"><Mail className="h-3 w-3" /> cephaspay1@gmail.com</p>
            </div>
          </div>

          {[
            { title: "Shop", links: [
              { label: "All Products", href: "/#products" },
              { label: "Phones", href: "/#products" },
              { label: "Accessories", href: "/#products" },
              { label: "Electronics", href: "/#products" },
              { label: "Deals", href: "/#products" },
            ]},
            { title: "Account", links: [
              { label: "Sign In", href: "/login" },
              { label: "Your Orders", href: "/login" },
              { label: "Wish List", href: "/login" },
              { label: "Track Order", href: "/login" },
              { label: "Returns", href: "/info/returns" },
            ]},
            { title: "Support", links: [
              { label: "Help Center", href: "/faq" },
              { label: "Contact Us", href: "/contact" },
              { label: "Shipping Info", href: "/info/shipping" },
              { label: "FAQs", href: "/faq" },
              { label: "Live Chat", href: "/contact" },
            ]},
            { title: "Company", links: [
              { label: "About Us", href: "/about" },
              { label: "Careers", href: "/info/careers" },
              { label: "Press", href: "/contact" },
              { label: "Privacy", href: "/info/privacy" },
              { label: "Terms", href: "/info/terms" },
            ]},
          ].map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-3 text-background/80">{section.title}</h4>
              <ul className="space-y-1.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-xs text-background/50 hover:text-background luxury-transition">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[10px] text-background/40">© {new Date().getFullYear()} CephasTech. All rights reserved.</p>
          <div className="flex gap-4 text-[10px] text-background/40">
            <a href="/info/privacy" className="hover:text-background luxury-transition">Privacy</a>
            <a href="/info/terms" className="hover:text-background luxury-transition">Terms</a>
            <a href="/contact" className="hover:text-background luxury-transition">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
