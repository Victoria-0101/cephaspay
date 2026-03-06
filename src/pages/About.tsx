import Layout from "@/components/Layout";
import logo from "@/assets/logo.jpg";

const About = () => (
  <Layout>
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <img src={logo} alt="CephasTech" className="h-12 w-auto object-contain" />
        <h1 className="text-3xl font-bold">About CephasTech</h1>
      </div>

      <div className="prose prose-sm max-w-none space-y-4 text-muted-foreground">
        <p className="text-base leading-relaxed">
          CephasTech is your trusted marketplace for phones, gadgets, and electronics based in Ile-Ife, Osun State, Nigeria. We bring you the latest tech at competitive prices with genuine warranties.
        </p>
        <p className="text-base leading-relaxed">
          Founded with a passion for making quality technology accessible, we source directly from authorized distributors to ensure every product is authentic and backed by reliable after-sales support.
        </p>
        <h2 className="text-xl font-semibold text-foreground pt-4">Why Choose Us?</h2>
        <ul className="list-disc pl-5 space-y-2 text-base">
          <li>100% genuine products with manufacturer warranty</li>
          <li>Competitive prices with flexible payment options</li>
          <li>Fast delivery across Nigeria</li>
          <li>Dedicated customer support</li>
          <li>Easy returns and exchanges</li>
        </ul>
        <h2 className="text-xl font-semibold text-foreground pt-4">Our Location</h2>
        <p className="text-base leading-relaxed">
          Visit us at Oluere Junction, Off Sabo, Ilare, Ile-Ife, Osun State, Nigeria. We're open Monday to Saturday, 8AM – 7PM and Sundays 10AM – 4PM.
        </p>
      </div>
    </div>
  </Layout>
);

export default About;
