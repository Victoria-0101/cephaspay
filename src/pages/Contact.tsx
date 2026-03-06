import Layout from "@/components/Layout";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
        <p className="text-muted-foreground mb-10">We'd love to hear from you. Reach out anytime!</p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <MapPin className="h-5 w-5 text-primary mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Our Address</h3>
                <p className="text-sm text-muted-foreground">Oluere Junction, Off Sabo, Ilare, Ile-Ife, Osun State, Nigeria</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="h-5 w-5 text-primary mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Phone</h3>
                <a href="tel:+2347030838269" className="text-sm text-muted-foreground hover:text-primary">+234 703 083 8269</a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="h-5 w-5 text-primary mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Email</h3>
                <a href="mailto:cephaspay1@gmail.com" className="text-sm text-muted-foreground hover:text-primary">cephaspay1@gmail.com</a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Clock className="h-5 w-5 text-primary mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Business Hours</h3>
                <p className="text-sm text-muted-foreground">Mon – Sat: 8:00 AM – 7:00 PM</p>
                <p className="text-sm text-muted-foreground">Sun: 10:00 AM – 4:00 PM</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4 bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2">Send us a message</h3>
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
            <Textarea
              placeholder="Your Message"
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />
            <Button type="submit" className="w-full">Send Message</Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
