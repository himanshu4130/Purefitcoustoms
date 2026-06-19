import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section
      data-testid="hero-section"
      className="relative min-h-screen flex items-center overflow-hidden bg-[#0A0A0A]"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/4717555/pexels-photo-4717555.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=1920')",
        }}
      />
      {/* Layered overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#111111]/85 via-[#111111]/75 to-[#0B3D2E]/90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.18),transparent_50%)]" />
      <div className="grain-overlay" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-28 pb-20 w-full">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left: text */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-12 h-px bg-[#D4AF37]" />
              <span className="text-[#D4AF37] uppercase text-xs tracking-[0.35em]">
                Kerala&apos;s Premium Bottle Branding
              </span>
            </motion.div>

            <motion.h1
              data-testid="hero-headline"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-[88px] leading-[1.02] text-white tracking-tight"
            >
              Every Bottle
              <br />
              <span className="italic text-[#D4AF37]">Tells</span> A Story
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="mt-8 text-lg sm:text-xl text-[#F8F5EE]/75 max-w-xl leading-relaxed"
            >
              Premium customized water bottle branding for weddings, celebrations, businesses,
              restaurants, and events across Kerala.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5 }}
              className="mt-12 flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/quote"
                data-testid="hero-cta-quote"
                className="group inline-flex items-center justify-center gap-3 bg-[#D4AF37] text-[#111111] px-9 py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#F8F5EE] transition-all duration-500"
              >
                Get Custom Quote
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#gallery"
                data-testid="hero-cta-designs"
                className="inline-flex items-center justify-center gap-3 border border-[#D4AF37]/60 text-[#D4AF37] px-9 py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#D4AF37] hover:text-[#111111] transition-all duration-500"
              >
                View Our Designs
              </a>
            </motion.div>

            {/* Trust strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-16 pt-8 border-t border-[#D4AF37]/15 flex flex-wrap gap-x-12 gap-y-4"
            >
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

          {/* Right: featured bottle imagery */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.4 }}
            className="lg:col-span-5 relative hidden lg:block"
          >
            <div className="relative aspect-[3/4] overflow-hidden border border-[#D4AF37]/30">
              <img
                src="https://images.pexels.com/photos/6716002/pexels-photo-6716002.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=700"
                alt="Premium customized bottle"
                className="w-full h-full object-cover float-slow"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] mb-1">Featured</div>
                <div className="font-serif text-2xl text-white">Wedding Edition · 2026</div>
              </div>
            </div>

            <div className="absolute -bottom-10 -left-10 w-40 h-40 border border-[#D4AF37]/40 -z-10" />
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#0B3D2E]/40 -z-10" />
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
