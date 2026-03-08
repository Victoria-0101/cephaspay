import Layout from "@/components/Layout";
import { Shield, Truck, HeadphonesIcon, RefreshCw } from "lucide-react";
import logo from "@/assets/logo.jpg";

const values = [
  { icon: Shield, title: "100% Genuine", desc: "Every product is sourced from authorized distributors with manufacturer warranty." },
  { icon: Truck, title: "Fast Delivery", desc: "Swift delivery across Nigeria. Same-day delivery available in Ile-Ife." },
  { icon: HeadphonesIcon, title: "Dedicated Support", desc: "Our team is available 6 days a week to help with any questions." },
  { icon: RefreshCw, title: "Easy Returns", desc: "Hassle-free returns within 7 days of delivery. No questions asked." },
];

const About = () => (
  <Layout>
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-3 mb-6">
          <img src={logo} alt="CephasTech" className="h-12 w-auto object-contain rounded" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">About CephasTech</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Your trusted marketplace for phones, gadgets, and electronics based in Ile-Ife, Osun State, Nigeria. We bring you the latest tech at competitive prices with genuine warranties.
        </p>
      </div>

      {/* Story */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Our Story</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Founded with a passion for making quality technology accessible, CephasTech has grown from a small local shop to a trusted online marketplace serving customers across Nigeria.
          </p>
          <p>
            We source directly from authorized distributors to ensure every product is authentic and backed by reliable after-sales support. Our mission is simple: deliver the best technology experience at fair prices.
          </p>
        </div>
      </div>

      {/* Values grid */}
      <div className="grid sm:grid-cols-2 gap-6 mb-16">
        {values.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-card border border-border rounded-lg p-6 hover:shadow-md luxury-transition">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* Location */}
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <h2 className="text-xl font-semibold text-foreground mb-2">Visit Our Store</h2>
        <p className="text-muted-foreground mb-1">Oluere Junction, Off Sabo, Ilare, Ile-Ife, Osun State, Nigeria</p>
        <p className="text-sm text-muted-foreground">Mon – Sat: 8AM – 7PM &nbsp;·&nbsp; Sun: 10AM – 4PM</p>
      </div>
    </div>
  </Layout>
);

export default About;
