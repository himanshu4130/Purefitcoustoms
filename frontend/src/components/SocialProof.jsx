import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { STATS } from "@/lib/content";

function Counter({ value, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.floor(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref} className="font-serif text-6xl sm:text-7xl lg:text-8xl text-[#D4AF37] leading-none">
      {n}
      <span className="text-[#D4AF37]">{suffix}</span>
    </span>
  );
}

export default function SocialProof() {
  return (
    <section
      data-testid="social-proof-section"
      className="relative py-28 lg:py-36 bg-[#111111] overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06),transparent_60%)]" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-px bg-[#D4AF37]" />
            <span className="text-[#D4AF37] uppercase text-xs tracking-[0.35em]">By The Numbers</span>
            <div className="w-10 h-px bg-[#D4AF37]" />
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl text-white">
            A Track Record That <span className="italic text-[#D4AF37]">Speaks</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-6">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              data-testid={`stat-item-${i}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className="text-center px-6"
            >
              <Counter value={s.value} suffix={s.suffix} />
              <div className="mt-6 h-px w-16 bg-[#D4AF37]/40 mx-auto" />
              <p className="mt-6 text-sm uppercase tracking-[0.25em] text-[#F8F5EE]/70">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
