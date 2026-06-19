import { motion } from "framer-motion";
import { WHY_FEATURES } from "@/lib/content";

export default function WhyPureFit() {
  return (
    <section
      id="why"
      data-testid="why-section"
      className="relative py-28 lg:py-36 bg-[#0E0E0E]"
    >
      <div className="grain-overlay" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-px bg-[#D4AF37]" />
              <span className="text-[#D4AF37] uppercase text-xs tracking-[0.35em]">Why PureFit</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05]">
              Why Clients <span className="italic text-[#D4AF37]">Choose</span> PureFit
            </h2>
          </div>
          <p className="lg:col-span-6 lg:col-start-7 text-[#F8F5EE]/70 leading-relaxed text-lg self-end">
            We don&apos;t just print labels — we engineer brand experiences. Every choice we make
            is built around one belief: your event deserves to look like a luxury house.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                data-testid={`why-feature-${i}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="group relative border border-[#D4AF37]/15 p-8 hover:border-[#D4AF37]/50 transition-all duration-500 hover:-translate-y-1 bg-[#0B3D2E]/10 hover:bg-[#0B3D2E]/30"
              >
                <Icon size={26} className="text-[#D4AF37] mb-6 group-hover:scale-110 transition-transform duration-500" />
                <h3 className="font-serif text-xl text-white mb-3">{f.title}</h3>
                <p className="text-sm text-[#F8F5EE]/60 leading-relaxed">{f.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
