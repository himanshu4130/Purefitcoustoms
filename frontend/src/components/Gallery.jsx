import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GALLERY, GALLERY_CATEGORIES } from "@/lib/content";
import useSiteContent from "@/hooks/useSiteContent";
import { buildMediaUrl } from "@/lib/api";

export default function Gallery() {
  const [active, setActive] = useState("All");
  const { gallery } = useSiteContent();

  // Merge dynamic gallery from admin with static defaults
  const items = useMemo(() => {
    const dynamic = gallery
      .filter((g) => g.image_id)
      .map((g) => ({
        category: g.category || "Weddings",
        image: buildMediaUrl(g.image_id),
        title: g.title || "Custom Bottle",
        client: g.subtitle || g.title || "Elite Client",
        quantity: g.quantity || "1000 Bottles",
      }));
    return dynamic.length > 0 ? dynamic : GALLERY;
  }, [gallery]);

  const cats = useMemo(() => {
    const cset = new Set(items.map((i) => i.category));
    return ["All", ...GALLERY_CATEGORIES.filter((c) => c !== "All" && cset.has(c)), ...[...cset].filter((c) => !GALLERY_CATEGORIES.includes(c))];
  }, [items]);

  const filtered = active === "All" ? items : items.filter((g) => g.category === active);

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

        <div className="flex flex-wrap justify-center gap-3 mb-14">
          {cats.map((cat) => (
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

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className="group relative aspect-[3/4] overflow-hidden cursor-pointer rounded-lg border border-[#D4AF37]/15 bg-[#111111] hover:border-[#D4AF37]/50 transition-all duration-500 flex flex-col"
              >
                <div className="w-full h-[65%] bg-[#070707] flex items-center justify-center p-6 relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="max-h-full object-contain transition-transform duration-[1400ms] group-hover:scale-105 select-none"
                  />
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#111111]/85 flex items-center justify-center border border-[#D4AF37]/30">
                    <span className="text-[9px] text-[#D4AF37] font-serif font-bold">PF</span>
                  </div>
                </div>
                
                <div className="h-[35%] p-4 flex flex-col justify-between bg-[#0e0e0e] border-t border-[#D4AF37]/10">
                  <div>
                    <div className="text-[9px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">{item.category}</div>
                    <h4 className="font-serif text-sm lg:text-base text-white truncate mt-0.5">{item.title}</h4>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-[#F8F5EE]/60 border-t border-[#D4AF37]/10 pt-2 font-mono">
                    <span className="truncate max-w-[120px]">{item.client}</span>
                    <span className="text-[#D4AF37] font-semibold shrink-0">{item.quantity}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
