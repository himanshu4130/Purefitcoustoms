import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import useSiteContent from "@/hooks/useSiteContent";
import { buildMediaUrl } from "@/lib/api";
import { HERO_ROTATION } from "@/lib/content";

export default function Hero() {
  const { settings, hero } = useSiteContent();

  const overline = settings.hero_overline || "Kerala's Premium Bottle Branding";
  const headline = settings.hero_headline || "Every Bottle Tells A Story";
  const subheading =
    settings.hero_subheading ||
    "Premium customized water bottle branding for weddings, celebrations, businesses, restaurants, and events across Kerala.";

  // Build rotation slides: admin-added hero items take priority, else defaults
  const slides = hero.length > 0
    ? hero.slice(0, 6).map((h) => ({
        title: h.title || "Custom Bottle",
        subtitle: h.subtitle || h.category || "",
        image: h.image_id ? buildMediaUrl(h.image_id) : HERO_ROTATION[0].image,
      }))
    : HERO_ROTATION;

  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  const current = slides[idx];

  const renderHeadline = () => {
    if (/tells/i.test(headline)) {
      const [before, after] = headline.split(/tells/i);
      return (
        <>
          {before.trim()}
          <br />
          <span className="italic text-[#D4AF37]">Tells</span> {after.trim()}
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
      {/* Deep gradient background (no event imagery) */}
      <div className="absolute inset-0 bg-[linear-gradient(140deg,#0A0A0A_0%,#0B3D2E_50%,#0A0A0A_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.20),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(11,61,46,0.6),transparent_60%)]" />
      <div className="grain-overlay" />

      {/* Subtle giant watermark logo */}
      <img
        src="/brand/logo.png"
        alt=""
        aria-hidden="true"
        className="absolute right-[-6rem] bottom-[-6rem] w-[36rem] opacity-[0.035] pointer-events-none select-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-20 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: text */}
          <div className="lg:col-span-6">
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

          {/* Right: ROTATING BOTTLE SHOWCASE */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, delay: 0.4 }} className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] lg:aspect-[3/4] max-w-md mx-auto">
              {/* Decorative frames */}
              <div className="absolute -bottom-8 -left-8 w-40 h-40 border border-[#D4AF37]/40 -z-10" />
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-[#0B3D2E]/40 -z-10" />

              {/* Rotating bottle stack */}
              <div className="relative w-full h-full overflow-hidden border border-[#D4AF37]/30 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 1.2, ease: [0.22, 0.61, 0.36, 1] }}
                    className="absolute inset-0"
                    data-testid={`hero-slide-${idx}`}
                  >
                    <img src={current.image} alt={current.title} className="absolute inset-0 w-full h-full object-cover" />
                    {/* dark gradient for legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
                  </motion.div>
                </AnimatePresence>

                {/* PureFit brand stamp on every bottle */}
                <div className="absolute top-5 right-5 w-14 h-14 rounded-full bg-[#F8F5EE]/95 flex items-center justify-center ring-1 ring-[#D4AF37]/60 shadow-lg">
                  <img src="/brand/logo.png" alt="PureFit Customs" className="w-12 h-12 object-contain p-0.5" />
                </div>

                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                  <div className="text-[10px] uppercase tracking-[0.35em] text-[#D4AF37] mb-1">{current.subtitle}</div>
                  <div className="font-serif text-2xl lg:text-3xl text-white">{current.title}</div>
                </div>

                {/* Slide indicators */}
                <div className="absolute top-5 left-5 flex gap-1.5">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      data-testid={`hero-dot-${i}`}
                      onClick={() => setIdx(i)}
                      aria-label={`Slide ${i + 1}`}
                      className={`h-px transition-all duration-500 ${i === idx ? "w-8 bg-[#D4AF37]" : "w-4 bg-[#D4AF37]/30"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#F8F5EE]/50">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-[#D4AF37] to-transparent" />
      </div>
    </section>
  );
}
