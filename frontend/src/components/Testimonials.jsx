import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/content";
import useSiteContent from "@/hooks/useSiteContent";

export default function Testimonials() {
  const [i, setI] = useState(0);
  const { testimonial } = useSiteContent();

  const items = (testimonial && testimonial.length > 0)
    ? testimonial.map((t) => ({ name: t.author_name, role: t.author_role, quote: t.quote }))
    : TESTIMONIALS;

  const t = items[i % items.length];
  const prev = () => setI((p) => (p - 1 + items.length) % items.length);
  const next = () => setI((p) => (p + 1) % items.length);

  return (
    <section
      data-testid="testimonials-section"
      className="relative py-28 lg:py-36 bg-[#0B3D2E] overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.1),transparent_70%)]" />
      <div className="relative max-w-5xl mx-auto px-6 lg:px-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-10 h-px bg-[#D4AF37]" />
          <span className="text-[#D4AF37] uppercase text-xs tracking-[0.35em]">Client Stories</span>
          <div className="w-10 h-px bg-[#D4AF37]" />
        </div>
        <h2 className="font-serif text-4xl sm:text-5xl text-white mb-16 leading-[1.05]">
          Words From Those <span className="italic text-[#D4AF37]">We&apos;ve Served</span>
        </h2>

        <div className="relative min-h-[280px] sm:min-h-[240px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              data-testid={`testimonial-${i}`}
              className="max-w-3xl"
            >
              <Quote className="text-[#D4AF37]/40 mx-auto mb-6" size={48} />
              <p className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white leading-[1.3] italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-10">
                <div className="font-serif text-xl text-[#D4AF37]">{t.name}</div>
                <div className="text-xs uppercase tracking-[0.25em] text-[#F8F5EE]/60 mt-1">{t.role}</div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-6 mt-12">
          <button data-testid="testimonial-prev" onClick={prev} className="w-12 h-12 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#111111] transition-colors duration-300" aria-label="Previous testimonial">
            <ChevronLeft size={18} />
          </button>
          <div className="flex items-center gap-2">
            {items.map((_, idx) => (
              <button
                key={idx}
                data-testid={`testimonial-dot-${idx}`}
                onClick={() => setI(idx)}
                className={`h-px transition-all duration-500 ${idx === i ? "w-10 bg-[#D4AF37]" : "w-5 bg-[#D4AF37]/30"}`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
          <button data-testid="testimonial-next" onClick={next} className="w-12 h-12 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#111111] transition-colors duration-300" aria-label="Next testimonial">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
