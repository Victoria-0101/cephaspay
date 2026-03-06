import Layout from "@/components/Layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "How do I place an order?", a: "Browse our products, add items to your cart, and proceed to checkout. You can pay via bank transfer or other available payment methods." },
  { q: "What payment methods do you accept?", a: "We accept bank transfers, mobile money, and card payments through our secure checkout process." },
  { q: "How long does delivery take?", a: "Delivery within Ile-Ife takes 1-2 business days. Other locations in Nigeria typically take 3-7 business days depending on your location." },
  { q: "Can I return a product?", a: "Yes, we offer returns within 7 days of delivery for products in their original condition. Contact us to initiate a return." },
  { q: "Are your products genuine?", a: "Absolutely! All products are sourced from authorized distributors and come with manufacturer warranties." },
  { q: "How can I track my order?", a: "Once your order is shipped, you'll receive a tracking number via email or SMS. You can also check your order status in your account." },
  { q: "Do you offer warranty on products?", a: "Yes, all products come with the manufacturer's warranty. The duration varies by product and brand." },
  { q: "How do I contact customer support?", a: "You can reach us via phone at +234 703 083 8269, email at cephaspay1@gmail.com, or visit our store at Oluere Junction, Off Sabo, Ilare, Ile-Ife." },
];

const FAQ = () => (
  <Layout>
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
      <p className="text-muted-foreground mb-8">Find answers to common questions about our products and services.</p>
      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-lg px-4">
            <AccordionTrigger className="text-sm font-medium">{faq.q}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </Layout>
);

export default FAQ;
