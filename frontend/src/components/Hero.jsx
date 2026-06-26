import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import useSiteContent from "@/hooks/useSiteContent";
import { buildMediaUrl } from "@/lib/api";

const DEFAULT_BG = "/brand/hero_bg.png";
const DEFAULT_FEATURED = "/wedding_bottle.png";

const FALLBACK_SLIDES = [
  {
    title: "Royal Cloud Wedding Edition",
    subtitle: "Wedding Edition • Burgundy & Rose Gold Label",
    category: "Wedding",
    image_url: "/wedding_bottle.png",
  },
  {
    title: "TechNova Corporate Edition",
    subtitle: "Corporate Edition • Navy Blue & Silver Label",
    category: "Corporate",
    image_url: "/corporate_bottle.png",
  },
  {
    title: "Royal Dine Private Label",
    subtitle: "Restaurant Edition • Matte Black & Gold Foil Label",
    category: "Restaurant",
    image_url: "/restaurant_bottle.png",
  },
];

export default function Hero() {
  const { settings, hero, gallery } = useSiteContent();
  const [currentSlide, setCurrentSlide] = useState(0);

  const overline = settings.hero_overline || "Kerala's Premium Bottle Branding";
  const headline = settings.hero_headline || "Every Bottle Tells A Story";
  const subheading =
    settings.hero_subheading ||
    "Premium customized water bottle branding for weddings, celebrations, businesses, restaurants, and events across Kerala.";

  const bgUrl = settings.hero_background_image_id ? buildMediaUrl(settings.hero_background_image_id) : DEFAULT_BG;

  // Resolve slider items dynamically
  const slides = [];

  if (settings.hero_bottle_ids && settings.hero_bottle_ids.length > 0) {
    settings.hero_bottle_ids.forEach((id) => {
      const found = gallery.find((g) => g.id === id);
      if (found) {
        slides.push({
          title: found.title || "Custom Bottle Edition",
          subtitle: found.subtitle || "Client Showcase",
          category: found.category || "Customized",
          image_url: found.image_id ? buildMediaUrl(found.image_id) : DEFAULT_FEATURED,
        });
      }
    });
  }

  if (slides.length === 0) {
    const heroGallery = gallery.filter((g) => g.is_hero);
    if (heroGallery.length > 0) {
      heroGallery.forEach((g) => {
        slides.push({
          title: g.title || "Custom Bottle Edition",
          subtitle: g.subtitle || "Client Showcase",
          category: g.category || "Customized",
          image_url: g.image_id ? buildMediaUrl(g.image_id) : DEFAULT_FEATURED,
        });
      });
    }
  }

  if (slides.length === 0 && hero.length > 0) {
    hero.forEach((h) => {
      slides.push({
        title: h.title || "Custom Bottle Edition",
        subtitle: h.subtitle || "Client Showcase",
        category: h.category || "Customized",
        image_url: h.image_id ? buildMediaUrl(h.image_id) : DEFAULT_FEATURED,
      });
    });
  }

  if (slides.length === 0) {
    slides.push(...FALLBACK_SLIDES);
  }

  const autoRotate = settings.hero_auto_rotate !== false;
  const rotationSpeed = settings.hero_rotation_speed || 5;

  useEffect(() => {
    if (!autoRotate || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, rotationSpeed * 1000);
    return () => clearInterval(interval);
  }, [slides.length, autoRotate, rotationSpeed]);

  const next = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const activeSlide = slides[currentSlide] || slides[0];

  // Split headline into two lines if it contains "Tells"
  const renderHeadline = () => {
    if (headline.toLowerCase().includes("tells")) {
      const before = headline.split(/tells/i)[0].trim();
      const after = headline.split(/tells/i)[1]?.trim();
      return (
        <>
          {before}
          <br />
          <span className="italic text-[#D4AF37]">Tells</span> {after}
        </>
      );
    }
    return headline;
  };

  return (
    <section
      data-testid="hero-section"
      className="relative min-h-screen flex items-center overflow-hidden bg-[#0A0A0A]"
    >
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${bgUrl}')` }} />
      <div className="absolute inset-0 bg-gradient-to-b from-[#111111]/85 via-[#111111]/75 to-[#0B3D2E]/90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.18),transparent_50%)]" />
      <div className="grain-overlay" />

      {/* Watermark logo (subtle) */}
      <img
        src="/brand/logo.png"
        alt=""
        aria-hidden="true"
        className="absolute right-[-4rem] bottom-[-4rem] w-[28rem] opacity-[0.04] pointer-events-none select-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-28 pb-20 w-full">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left: text */}
          <div className="lg:col-span-7">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="flex items-center gap-3 mb-8">
              <div className="w-12 h-px bg-[#D4AF37]" />
              <span className="text-[#D4AF37] uppercase text-xs tracking-[0.35em]">{overline}</span>
            </motion.div>

            <motion.h1
              data-testid="hero-headline"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-[88px] leading-[1.02] text-white tracking-tight"
            >
              {renderHeadline()}
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3 }} className="mt-8 text-lg sm:text-xl text-[#F8F5EE]/75 max-w-xl leading-relaxed">
              {subheading}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.5 }} className="mt-12 flex flex-col sm:flex-row gap-4">
              <Link to="/quote" data-testid="hero-cta-quote" className="group inline-flex items-center justify-center gap-3 bg-[#D4AF37] text-[#111111] px-9 py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#F8F5EE] transition-all duration-500">
                Get Custom Quote
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#gallery" data-testid="hero-cta-designs" className="inline-flex items-center justify-center gap-3 border border-[#D4AF37]/60 text-[#D4AF37] px-9 py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#D4AF37] hover:text-[#111111] transition-all duration-500">
                View Our Designs
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }} className="mt-16 pt-8 border-t border-[#D4AF37]/15 flex flex-wrap gap-x-12 gap-y-4">
              {[
                { n: "5000+", l: "Bottles Delivered" },
                { n: "100+", l: "Events Served" },
                { n: "100%", l: "Custom Design" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-serif text-3xl text-[#D4AF37]">{s.n}</div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-[#F8F5EE]/60 mt-1">{s.l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: rotating bottle showcase slider */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, delay: 0.4 }} className="lg:col-span-5 relative hidden lg:block w-full">
            <div className="relative aspect-[3/4] overflow-hidden border border-[#D4AF37]/30 bg-[#0B0B0B] group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 flex flex-col justify-between"
                >
                  {/* The bottle image: occupy at least 70% of visual focus */}
                  <div className="relative w-full h-[78%] overflow-hidden bg-[#0A0A0A] flex items-center justify-center p-6">
                    <img
                      src={activeSlide.image_url}
                      alt={activeSlide.title}
                      className="max-h-full max-w-full object-contain filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)] transform hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/80 via-transparent to-transparent" />
                  </div>

                  {/* Brand badge overlay on bottle card */}
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-[#F8F5EE]/95 flex items-center justify-center ring-1 ring-[#D4AF37]/60 z-20">
                    <img src="/brand/logo.png" alt="PureFit Customs" className="w-10 h-10 object-contain p-0.5" />
                  </div>

                  {/* Details */}
                  <div className="p-6 pt-0 bg-gradient-to-t from-[#0A0A0A] to-transparent z-10">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] mb-1">
                      {activeSlide.category}
                    </div>
                    <h3 className="font-serif text-2xl text-white tracking-wide">
                      {activeSlide.title}
                    </h3>
                    <p className="text-xs text-[#F8F5EE]/60 mt-1 font-mono">
                      {activeSlide.subtitle}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation arrows (only visible on hover) */}
              {slides.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.preventDefault(); prev(); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-[#D4AF37]/80 text-[#D4AF37] hover:text-black border border-[#D4AF37]/20 transition-all opacity-0 group-hover:opacity-100 z-30"
                    title="Previous Slide"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={(e) => { e.preventDefault(); next(); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-[#D4AF37]/80 text-[#D4AF37] hover:text-black border border-[#D4AF37]/20 transition-all opacity-0 group-hover:opacity-100 z-30"
                    title="Next Slide"
                  >
                    <ChevronRight size={18} />
                  </button>

                  {/* Indicators / Progress bar */}
                  <div className="absolute bottom-3 right-6 flex gap-1.5 z-30">
                    {slides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => { e.preventDefault(); setCurrentSlide(idx); }}
                        className={`h-1.5 transition-all rounded-full ${
                          idx === currentSlide ? "w-6 bg-[#D4AF37]" : "w-1.5 bg-[#F8F5EE]/30"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 border border-[#D4AF37]/20 -z-10" />
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#0B3D2E]/20 -z-10" />
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#F8F5EE]/50">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-[#D4AF37] to-transparent" />
      </div>
    </section>
  );
}
