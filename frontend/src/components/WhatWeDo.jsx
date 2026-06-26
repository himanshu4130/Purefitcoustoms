import { motion } from "framer-motion";
import { SERVICES } from "@/lib/content";

export default function WhatWeDo() {
  return (
    <section
      id="services"
      data-testid="what-we-do-section"
      className="relative py-28 lg:py-36 bg-[#0E0E0E]"
    >
      <div className="grain-overlay" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-3xl mb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-10 h-px bg-[#D4AF37]" />
            <span className="text-[#D4AF37] uppercase text-xs tracking-[0.35em]">What We Do</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05]"
          >
            Transform Water Into A <span className="italic text-[#D4AF37]">Branding</span> Experience
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-lg text-[#F8F5EE]/70 leading-relaxed"
          >
            We create personalized water bottle branding solutions that leave lasting impressions.
            From weddings and celebrations to corporate events and restaurant branding, every bottle
            becomes part of your story.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((s, i) => {
            return (
              <motion.div
                key={s.id}
                data-testid={`service-card-${s.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.07 }}
                className="group relative bg-[#111111] border border-[#D4AF37]/15 p-6 lg:p-8 hover:bg-[#0B3D2E]/30 hover:border-[#D4AF37]/50 transition-all duration-500 rounded-lg sheen overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="w-full aspect-[4/5] overflow-hidden rounded bg-[#070707] border border-[#D4AF37]/10 mb-6 flex items-center justify-center p-6 relative">
                    <img
                      src={s.image}
                      alt={s.title}
                      className="max-h-full object-contain group-hover:scale-105 transition-transform duration-700 select-none"
                    />
                    <span className="absolute top-4 right-4 font-serif text-lg text-[#D4AF37]/40 font-bold">0{i + 1}</span>
                  </div>
                  <h3 className="font-serif text-2xl text-white mb-3 leading-tight group-hover:text-[#D4AF37] transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-[#F8F5EE]/65 text-[14px] leading-relaxed">
                    {s.description}
                  </p>
                </div>
                <div className="mt-6 h-px w-12 bg-[#D4AF37] group-hover:w-full transition-all duration-500" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
