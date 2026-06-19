import { motion } from "framer-motion";
import { SHOWCASE } from "@/lib/content";
import useSiteContent from "@/hooks/useSiteContent";
import { buildMediaUrl } from "@/lib/api";

export default function Showcase() {
  const { hero } = useSiteContent();

  // Use hero items from admin if available, else fall back to static showcase data
  const items = hero.length >= 3
    ? hero.slice(0, 6).map((h, i) => ({
        title: h.title || "Custom Bottle",
        subtitle: h.subtitle || h.category || "",
        image: h.image_id ? buildMediaUrl(h.image_id) : SHOWCASE[i % SHOWCASE.length].image,
        testid: `showcase-dynamic-${i}`,
      }))
    : SHOWCASE;

  // Pad to 6 items
  while (items.length < 6) items.push(SHOWCASE[items.length % SHOWCASE.length]);
  const display = items.slice(0, 6);

  return (
    <section
      id="showcase"
      data-testid="showcase-section"
      className="relative py-28 lg:py-36 bg-[#0B3D2E]/95 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08),transparent_60%)]" />
      <div className="grain-overlay" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-px bg-[#D4AF37]" />
              <span className="text-[#D4AF37] uppercase text-xs tracking-[0.35em]">Customization Showcase</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05]">
              Bottles Designed As <span className="italic text-[#D4AF37]">Objects</span> Of Memory
            </h2>
          </div>
          <p className="text-[#F8F5EE]/70 lg:max-w-sm leading-relaxed">
            A curated showcase of customizations that have made events unforgettable.
            Each label is crafted to feel like jewellery — wearable, keepable, remarkable.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          {display.map((item, i) => {
            const span =
              i === 0 ? "col-span-12 lg:col-span-7 row-span-2 aspect-[16/12] lg:aspect-auto lg:h-[600px]" :
              i === 1 ? "col-span-12 sm:col-span-6 lg:col-span-5 aspect-[4/3]" :
              i === 2 ? "col-span-12 sm:col-span-6 lg:col-span-5 aspect-[4/3]" :
                        "col-span-12 sm:col-span-4 lg:col-span-4 aspect-square";

            return (
              <motion.div
                key={`${item.title}-${i}`}
                data-testid={item.testid}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.08 }}
                className={`relative group overflow-hidden ${span} cursor-pointer`}
              >
                <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/30 to-transparent" />
                <div className="absolute inset-0 border border-transparent group-hover:border-[#D4AF37]/60 transition-colors duration-500" />

                {/* Brand stamp on showcase card */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#F8F5EE]/90 flex items-center justify-center ring-1 ring-[#D4AF37]/40 opacity-80 group-hover:opacity-100 transition-opacity">
                  <img src="/brand/logo.png" alt="PureFit" className="w-9 h-9 object-contain p-0.5" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] mb-2">{item.subtitle}</div>
                  <h3 className="font-serif text-2xl lg:text-3xl text-white">{item.title}</h3>
                  <div className="mt-3 h-px w-10 bg-[#D4AF37] group-hover:w-24 transition-all duration-500" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
