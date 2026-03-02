import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import CountdownTimer from "./CountdownTimer";

const slides = [
  {
    title: "Flash Sale: Up to 30% Off",
    subtitle: "Premium headphones, chargers & more — limited time only.",
    cta: "Shop Flash Sale",
    bg: "from-primary/10 to-primary/5",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&h=400&fit=crop",
    flash: true,
  },
  {
    title: "iPhone 15 Pro Max",
    subtitle: "Titanium. A17 Pro. The most powerful iPhone ever. Starting at $1,099.",
    cta: "Shop Now",
    bg: "from-secondary to-muted",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=400&fit=crop",
    flash: false,
  },
  {
    title: "Galaxy S24 Ultra — 15% Off",
    subtitle: "Galaxy AI is here. Titanium frame. 200MP camera.",
    cta: "See the Deal",
    bg: "from-info/10 to-info/5",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=400&fit=crop",
    flash: false,
  },
];

const flashSaleEnd = new Date(Date.now() + 8 * 60 * 60 * 1000); // 8 hours from now

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative overflow-hidden">
      <div className={`bg-gradient-to-r ${slide.bg} luxury-transition`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-6 py-8 md:py-12 min-h-[280px] md:min-h-[340px]">
            <div className="flex-1 space-y-3 text-center md:text-left">
              {slide.flash && (
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                    <Zap className="h-3 w-3" /> Flash Sale
                  </span>
                  <CountdownTimer targetDate={flashSaleEnd} />
                </div>
              )}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight">
                {slide.title}
              </h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto md:mx-0">
                {slide.subtitle}
              </p>
              <Button className="h-10 px-6 rounded-full text-sm font-semibold">
                {slide.cta}
              </Button>
            </div>
            <div className="flex-shrink-0 w-48 h-48 md:w-72 md:h-72 rounded-xl overflow-hidden">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <button
        onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/80 backdrop-blur-sm text-foreground shadow hover:bg-background luxury-transition"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/80 backdrop-blur-sm text-foreground shadow hover:bg-background luxury-transition"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full luxury-transition ${i === current ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
