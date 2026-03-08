import Layout from "@/components/Layout";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

const contactItems = [
  { icon: MapPin, title: "Our Address", detail: "Oluere Junction, Off Sabo, Ilare, Ile-Ife, Osun State, Nigeria" },
  { icon: Phone, title: "Phone", detail: "+234 703 083 8269", href: "tel:+2347030838269" },
  { icon: Mail, title: "Email", detail: "cephaspay1@gmail.com", href: "mailto:cephaspay1@gmail.com" },
  { icon: Clock, title: "Business Hours", detail: "Mon – Sat: 8AM – 7PM · Sun: 10AM – 4PM" },
];

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">Get in Touch</h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Have a question or need help? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            {contactItems.map(({ icon: Icon, title, detail, href }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-0.5">{title}</h3>
                  {href ? (
                    <a href={href} className="text-sm text-muted-foreground hover:text-primary luxury-transition">{detail}</a>
                  ) : (
                    <p className="text-sm text-muted-foreground">{detail}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 bg-card border border-border rounded-lg p-8 space-y-5">
            <h3 className="text-lg font-semibold text-foreground mb-1">Send us a message</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                type="email"
                placeholder="Your Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <Textarea
              placeholder="Your Message"
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />
            <Button type="submit" className="w-full h-11 font-semibold">Send Message</Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
