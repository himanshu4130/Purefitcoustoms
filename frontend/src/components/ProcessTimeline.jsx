import { motion } from "framer-motion";
import { PROCESS_STEPS } from "@/lib/content";

export default function ProcessTimeline() {
  return (
    <section
      id="process"
      data-testid="process-section"
      className="relative py-28 lg:py-36 bg-[#111111] overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(11,61,46,0.6),transparent_60%)]" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-px bg-[#D4AF37]" />
            <span className="text-[#D4AF37] uppercase text-xs tracking-[0.35em]">Our Process</span>
            <div className="w-10 h-px bg-[#D4AF37]" />
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05]">
            From Idea To <span className="italic text-[#D4AF37]">Delivery</span>
          </h2>
          <p className="mt-6 text-[#F8F5EE]/70 leading-relaxed">
            A refined four-step journey, designed to feel effortless from your side.
          </p>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#D4AF37]/40 to-transparent" />

          <div className="space-y-16 lg:space-y-24">
            {PROCESS_STEPS.map((step, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={step.step}
                  data-testid={`process-step-${i + 1}`}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, delay: i * 0.1 }}
                  className="relative lg:grid lg:grid-cols-2 lg:gap-16 items-center"
                >
                  {/* Step number circle */}
                  <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-[#111111] border-2 border-[#D4AF37] items-center justify-center z-10">
                    <span className="font-serif text-[#D4AF37] text-lg">{i + 1}</span>
                  </div>

                  {isLeft ? (
                    <>
                      <div className="lg:text-right lg:pr-16">
                        <div className="font-serif text-7xl lg:text-8xl text-[#D4AF37]/15 leading-none mb-2">
                          {step.step}
                        </div>
                        <h3 className="font-serif text-3xl lg:text-4xl text-white mb-4">
                          {step.title}
                        </h3>
                        <p className="text-[#F8F5EE]/70 leading-relaxed lg:max-w-md lg:ml-auto">
                          {step.description}
                        </p>
                      </div>
                      <div />
                    </>
                  ) : (
                    <>
                      <div />
                      <div className="lg:pl-16">
                        <div className="font-serif text-7xl lg:text-8xl text-[#D4AF37]/15 leading-none mb-2">
                          {step.step}
                        </div>
                        <h3 className="font-serif text-3xl lg:text-4xl text-white mb-4">
                          {step.title}
                        </h3>
                        <p className="text-[#F8F5EE]/70 leading-relaxed lg:max-w-md">
                          {step.description}
                        </p>
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
