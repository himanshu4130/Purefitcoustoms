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

        {/* Service cards — each features an actual bottle image */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className="group relative bg-[#0A0A0A] border border-[#D4AF37]/15 hover:border-[#D4AF37]/50 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
              >
                {/* Bottle image — primary visual */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/30 to-transparent" />

                  {/* PureFit brand badge on bottle */}
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-[#F8F5EE]/95 flex items-center justify-center ring-1 ring-[#D4AF37]/50 shadow-md">
                    <img src="/brand/logo.png" alt="" className="w-10 h-10 object-contain p-0.5" />
                  </div>

                  {/* Number */}
                  <span className="absolute top-4 left-4 font-serif text-2xl text-[#D4AF37]">0{i + 1}</span>

                  {/* Icon */}
                  <div className="absolute bottom-4 left-4 w-12 h-12 border border-[#D4AF37]/60 bg-[#0A0A0A]/70 backdrop-blur-md flex items-center justify-center">
                    <Icon size={20} className="text-[#D4AF37]" />
                  </div>
                </div>

                {/* Text */}
                <div className="p-7 lg:p-8">
                  <h3 className="font-serif text-2xl lg:text-3xl text-white mb-3 leading-tight">
                    {s.title}
                  </h3>
                  <p className="text-[#F8F5EE]/65 text-sm leading-relaxed">
                    {s.description}
                  </p>
                  <div className="mt-6 h-px w-12 bg-[#D4AF37] group-hover:w-24 transition-all duration-500" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
