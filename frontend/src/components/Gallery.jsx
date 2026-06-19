import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GALLERY, GALLERY_CATEGORIES } from "@/lib/content";

export default function Gallery() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? GALLERY : GALLERY.filter((g) => g.category === active);

  return (
    <section
      id="gallery"
      data-testid="gallery-section"
      className="relative py-28 lg:py-36 bg-[#0E0E0E]"
    >
      <div className="grain-overlay" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-px bg-[#D4AF37]" />
            <span className="text-[#D4AF37] uppercase text-xs tracking-[0.35em]">Project Gallery</span>
            <div className="w-10 h-px bg-[#D4AF37]" />
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05]">
            A Curated <span className="italic text-[#D4AF37]">Portfolio</span>
          </h2>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-14">
          {GALLERY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              data-testid={`gallery-filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => setActive(cat)}
              className={`px-5 py-2.5 text-xs uppercase tracking-[0.2em] border transition-all duration-300 ${
                active === cat
                  ? "bg-[#D4AF37] text-[#111111] border-[#D4AF37]"
                  : "border-[#D4AF37]/30 text-[#F8F5EE]/70 hover:border-[#D4AF37] hover:text-[#D4AF37]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div
                key={`${item.title}-${i}`}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                data-testid={`gallery-item-${i}`}
                className="group relative aspect-[4/5] overflow-hidden cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/30 to-transparent" />
                <div className="absolute inset-0 border border-transparent group-hover:border-[#D4AF37]/60 transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] mb-1">{item.category}</div>
                  <h4 className="font-serif text-lg lg:text-xl text-white">{item.title}</h4>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
