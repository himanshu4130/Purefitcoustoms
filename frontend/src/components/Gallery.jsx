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
        client_name: g.client_name || "",
        quantity: g.quantity || "",
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
            <span className="text-[#D4AF37] uppercase text-xs tracking-[0.35em]">Recent Client Projects</span>
            <div className="w-10 h-px bg-[#D4AF37]" />
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05]">
            A Curated <span className="italic text-[#D4AF37]">Portfolio</span>
          </h2>
          <p className="mt-4 text-[#F8F5EE]/60 text-sm uppercase tracking-[0.2em]">Real bottles · Real labels · Real clients</p>
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
                key={`${item.client_name || item.title}-${i}`}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                data-testid={`gallery-item-${i}`}
                className="group bg-[#0A0A0A] border border-[#D4AF37]/15 hover:border-[#D4AF37]/60 transition-colors duration-500 overflow-hidden"
              >
                {/* Bottle image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-[#0B3D2E]/30">
                  <img
                    src={item.image}
                    alt={item.client_name || item.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-105"
                  />
                  {/* Category chip */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-[#0A0A0A]/80 backdrop-blur-sm border border-[#D4AF37]/40 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
                    {item.category}
                  </div>
                </div>

                {/* Card body */}
                <div className="p-6 border-t border-[#D4AF37]/15">
                  <h4 className="font-serif text-xl lg:text-2xl text-white leading-tight">
                    {item.client_name || item.title}
                  </h4>
                  {item.client_name && item.title && item.client_name !== item.title && (
                    <div className="text-[10px] uppercase tracking-[0.25em] text-[#F8F5EE]/40 mt-1">
                      {item.title}
                    </div>
                  )}
                  <div className="mt-4 pt-4 border-t border-[#D4AF37]/15 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-[#F8F5EE]/50">Supplied</span>
                    <span className="font-serif text-lg text-[#D4AF37]">{item.quantity || "—"}</span>
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
