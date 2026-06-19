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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#D4AF37]/15">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.id}
                data-testid={`service-card-${s.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.07 }}
                className="group relative bg-[#0E0E0E] p-10 lg:p-12 hover:bg-[#0B3D2E]/40 transition-all duration-700 sheen overflow-hidden"
              >
                <div className="flex items-start justify-between mb-10">
                  <div className="w-14 h-14 border border-[#D4AF37]/40 flex items-center justify-center group-hover:border-[#D4AF37] group-hover:rotate-45 transition-all duration-500">
                    <Icon size={22} className="text-[#D4AF37] group-hover:-rotate-45 transition-transform duration-500" />
                  </div>
                  <span className="font-serif text-2xl text-[#D4AF37]/40">0{i + 1}</span>
                </div>
                <h3 className="font-serif text-2xl lg:text-3xl text-white mb-4 leading-tight">
                  {s.title}
                </h3>
                <p className="text-[#F8F5EE]/65 text-[15px] leading-relaxed">
                  {s.description}
                </p>
                <div className="mt-8 h-px w-12 bg-[#D4AF37] group-hover:w-24 transition-all duration-500" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
