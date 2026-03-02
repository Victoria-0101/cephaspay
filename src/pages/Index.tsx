import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="container mx-auto px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-4">
            New Season Collection
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-[1.1] mb-6">
            Tech that speaks{" "}
            <span className="text-primary">for itself.</span>
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed mb-8 max-w-md">
            Curated premium devices, accessories, and electronics — designed for those who appreciate the finer details.
          </p>
          <Button className="h-11 px-6 rounded-full text-sm font-medium luxury-transition">
            Shop Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-6 lg:px-8 pb-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Featured</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Handpicked for you
            </p>
          </div>
          <a
            href="#"
            className="text-sm font-medium text-primary hover:text-primary/80 luxury-transition flex items-center gap-1"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
