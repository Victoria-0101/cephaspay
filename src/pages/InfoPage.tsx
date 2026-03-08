import Layout from "@/components/Layout";
import { useParams } from "react-router-dom";
import { Truck, RotateCcw, Shield, Lock, Users, FileText } from "lucide-react";

const pages: Record<string, { title: string; icon: React.ElementType; sections: { heading: string; body: string }[] }> = {
  privacy: {
    title: "Privacy Policy",
    icon: Lock,
    sections: [
      { heading: "Information We Collect", body: "We collect only the information necessary to process your orders and improve your shopping experience — including your name, email, shipping address, and payment details." },
      { heading: "How We Use Your Data", body: "Your data is used to fulfill orders, send order updates, and improve our services. We never sell your personal information to third parties." },
      { heading: "Data Security", body: "We use industry-standard security measures including SSL encryption to protect your information. For questions about our privacy practices, contact us at cephaspay1@gmail.com." },
    ],
  },
  terms: {
    title: "Terms of Service",
    icon: FileText,
    sections: [
      { heading: "General", body: "By using CephasTech, you agree to these terms of service. All products are subject to availability. Prices are listed in Nigerian Naira (₦) and may change without notice." },
      { heading: "Orders & Payment", body: "Orders are confirmed only after payment verification. We reserve the right to cancel orders if fraud is suspected or products are unavailable." },
      { heading: "Intellectual Property", body: "All content on CephasTech, including logos, images, and text, is our property and may not be reproduced without permission." },
    ],
  },
  shipping: {
    title: "Shipping Information",
    icon: Truck,
    sections: [
      { heading: "Delivery Times", body: "Orders within Ile-Ife are delivered within 1-2 business days. Other locations across Nigeria take 3-7 business days depending on the destination." },
      { heading: "Shipping Fees", body: "Shipping fees vary by location and order size. Free shipping is available on select orders above ₦100,000. You'll see the exact fee at checkout." },
      { heading: "Tracking", body: "You'll receive tracking information via email and SMS once your order ships. Track your order anytime through your account dashboard." },
    ],
  },
  returns: {
    title: "Returns & Refunds",
    icon: RotateCcw,
    sections: [
      { heading: "Return Policy", body: "We accept returns within 7 days of delivery for products in their original, unopened condition. Items must include all original packaging and accessories." },
      { heading: "How to Return", body: "To initiate a return, contact us at +234 703 083 8269 or cephaspay1@gmail.com with your order number and reason for return." },
      { heading: "Refund Timeline", body: "Refunds are processed within 3-5 business days after we receive and inspect the returned item. Damaged or defective products are replaced free of charge." },
    ],
  },
  careers: {
    title: "Careers",
    icon: Users,
    sections: [
      { heading: "Join Our Team", body: "We're always looking for passionate individuals who love technology and want to make a difference. CephasTech offers a dynamic work environment with growth opportunities." },
      { heading: "How to Apply", body: "Send your CV and a cover letter to cephaspay1@gmail.com with the subject line 'Career Application'. We review applications on a rolling basis." },
    ],
  },
};

const InfoPage = () => {
  const { slug } = useParams();
  const page = pages[slug || ""];

  if (!page) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-2 text-foreground">Page Not Found</h1>
          <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
        </div>
      </Layout>
    );
  }

  const Icon = page.icon;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{page.title}</h1>
        </div>

        <div className="space-y-8">
          {page.sections.map((section) => (
            <div key={section.heading} className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-3">{section.heading}</h2>
              <p className="text-muted-foreground leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default InfoPage;
