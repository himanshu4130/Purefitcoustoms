import { INDUSTRIES } from "@/lib/content";

export default function Industries() {
  // duplicate for seamless marquee
  const items = [...INDUSTRIES, ...INDUSTRIES];
  return (
    <section
      id="industries"
      data-testid="industries-section"
      className="relative py-20 bg-[#0B3D2E] overflow-hidden border-y border-[#D4AF37]/15"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-px bg-[#D4AF37]" />
          <span className="text-[#D4AF37] uppercase text-xs tracking-[0.35em]">Industries We Serve</span>
        </div>
      </div>

      <div className="relative">
        {/* Side fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0B3D2E] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0B3D2E] to-transparent z-10 pointer-events-none" />

        <div className="flex gap-12 animate-marquee w-max">
          {items.map((label, i) => (
            <div
              key={`${label}-${i}`}
              data-testid={`industry-item-${i}`}
              className="flex items-center gap-12 whitespace-nowrap"
            >
              <span className="font-serif text-3xl lg:text-5xl text-white/90 hover:text-[#D4AF37] transition-colors duration-300">
                {label}
              </span>
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
