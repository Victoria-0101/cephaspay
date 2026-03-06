import Layout from "@/components/Layout";
import { useParams } from "react-router-dom";

const pages: Record<string, { title: string; content: string }> = {
  privacy: {
    title: "Privacy Policy",
    content: "At CephasTech, we take your privacy seriously. We collect only the information necessary to process your orders and improve your shopping experience. Your personal data is never sold to third parties. We use industry-standard security measures to protect your information. For questions about our privacy practices, contact us at cephaspay1@gmail.com.",
  },
  terms: {
    title: "Terms of Service",
    content: "By using CephasTech, you agree to our terms of service. All products are subject to availability. Prices are listed in Nigerian Naira (₦) and may change without notice. We reserve the right to refuse service to anyone. Orders are confirmed only after payment verification. For the full terms, contact our support team.",
  },
  shipping: {
    title: "Shipping Information",
    content: "We deliver across Nigeria. Orders within Ile-Ife are delivered within 1-2 business days. Other locations take 3-7 business days. Shipping fees vary by location and order size. Free shipping is available on select orders. You'll receive tracking information once your order ships.",
  },
  returns: {
    title: "Returns & Exchanges",
    content: "We accept returns within 7 days of delivery for products in their original, unopened condition. To initiate a return, contact us at +234 703 083 8269 or cephaspay1@gmail.com. Refunds are processed within 3-5 business days after we receive the returned item. Damaged or defective products are replaced free of charge.",
  },
  careers: {
    title: "Careers",
    content: "Join the CephasTech team! We're always looking for passionate individuals who love technology. If you're interested in working with us, send your CV and a cover letter to cephaspay1@gmail.com with the subject line 'Career Application'.",
  },
};

const InfoPage = () => {
  const { slug } = useParams();
  const page = pages[slug || ""];

  if (!page) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
          <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
        <p className="text-muted-foreground text-base leading-relaxed">{page.content}</p>
      </div>
    </Layout>
  );
};

export default InfoPage;
