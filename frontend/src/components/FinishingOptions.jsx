import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check, ArrowRight } from "lucide-react";

export default function FinishingOptions() {
  const [activeTab, setActiveTab] = useState(0);

  const finishes = [
    {
      id: "foil",
      title: "Metallic Gold Foil",
      tagline: "The Luxury Standard",
      description: "Bespoke hot foil stamping in reflective gold or silver. Creates a raised, metallic texture that catches light with every movement.",
      bestFor: "Luxury Weddings, Anniversary Events, Premium Monograms",
      specs: ["High-reflectivity metallic finish", "Raised tactile texture", "Scratch-resistant foil print"],
      color: "from-[#BF953F] via-[#FCF6BA] to-[#B38728]",
      bgImage: "/wedding_bottle.png",
    },
    {
      id: "matte",
      title: "Satin Matte",
      tagline: "Modern Sophistication",
      description: "A velvety, non-reflective soft-touch coating that diffuses light. Provides an understated, premium satin texture.",
      bestFor: "Private Dining Restaurants, Art Galleries, Corporate Boardrooms",
      specs: ["Velvety soft-touch texture", "Glare-free surface", "Anti-fingerprint coating"],
      color: "from-neutral-700 via-neutral-600 to-neutral-900",
      bgImage: "/restaurant_bottle.png",
    },
    {
      id: "gloss",
      title: "Ultra High Gloss",
      tagline: "Vibrant & Crisp",
      description: "Crystal-clear high-shine protective coating. Amplifies color saturation and contrast, making branding details razor-sharp.",
      bestFor: "Corporate Summits, Concerts, Campaign Branding",
      specs: ["Maximum color depth & saturation", "Glass-like reflective sheen", "100% waterproof protection"],
      color: "from-[#0B3D2E] via-[#1E5C47] to-[#05281E]",
      bgImage: "/corporate_bottle.png",
    }
  ];

  return (
    <section id="finishing-options" className="relative py-28 lg:py-36 bg-[#0E0E0E] overflow-hidden border-t border-[#D4AF37]/15">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_right_bottom,rgba(212,175,55,0.05),transparent_50%)]" />
      <div className="grain-overlay" />
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-3xl mb-16 lg:mb-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-px bg-[#D4AF37]" />
            <span className="text-[#D4AF37] uppercase text-xs tracking-[0.35em]">Label Artistry</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05]">
            Premium <span className="italic text-[#D4AF37]">Finishing</span> Options
          </h2>
          <p className="mt-6 text-lg text-[#F8F5EE]/70 leading-relaxed">
            We use industry-leading labels and luxury coatings. Select the perfect finish to complement your brand identity or event theme.
          </p>
        </div>

        {/* Tab System */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Side: Buttons & Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="flex flex-col gap-3">
              {finishes.map((f, index) => (
                <button
                  key={f.id}
                  onClick={() => setActiveTab(index)}
                  className={`w-full text-left p-6 border rounded-lg transition-all duration-500 relative overflow-hidden group ${
                    activeTab === index
                      ? "bg-[#0B3D2E]/20 border-[#D4AF37]/60 shadow-lg shadow-[#0B3D2E]/10"
                      : "bg-[#111111]/70 border-[#D4AF37]/10 hover:border-[#D4AF37]/35"
                  }`}
                >
                  {/* Left accent color bar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${f.color}`} />
                  
                  <div className="flex justify-between items-start gap-4 pl-2">
                    <div>
                      <span className={`text-[9px] uppercase tracking-widest ${activeTab === index ? "text-[#D4AF37]" : "text-white/40"} font-bold`}>
                        {f.tagline}
                      </span>
                      <h3 className={`font-serif text-xl sm:text-2xl mt-1 transition-colors ${activeTab === index ? "text-white" : "text-white/70 group-hover:text-white"}`}>
                        {f.title}
                      </h3>
                    </div>
                    <ArrowRight size={16} className={`text-[#D4AF37] transition-all duration-300 ${activeTab === index ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"}`} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Side: Interactive Showcase Card */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-[#111111] border border-[#D4AF37]/20 rounded-xl p-8 sm:p-12 overflow-hidden flex flex-col justify-between shadow-2xl">
              {/* Gold gradient shine element */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#D4AF37]/5 to-transparent pointer-events-none" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="h-full flex flex-col justify-between relative z-10"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center h-full">
                    {/* Specs info */}
                    <div className="md:col-span-7 space-y-6">
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold">
                          <Sparkles size={10} />
                          {finishes[activeTab].tagline}
                        </div>
                        <h4 className="font-serif text-3xl text-white">
                          {finishes[activeTab].title}
                        </h4>
                      </div>

                      <p className="text-sm text-[#F8F5EE]/75 leading-relaxed">
                        {finishes[activeTab].description}
                      </p>

                      <div className="space-y-3">
                        {finishes[activeTab].specs.map((spec, i) => (
                          <div key={i} className="flex items-center gap-2.5 text-xs text-[#F8F5EE]/80">
                            <span className="w-5 h-5 rounded-full bg-[#0B3D2E] border border-[#D4AF37]/35 flex items-center justify-center shrink-0">
                              <Check size={10} className="text-[#D4AF37]" />
                            </span>
                            <span>{spec}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 text-xs">
                        <span className="text-[#D4AF37] font-semibold">Best for: </span>
                        <span className="text-[#F8F5EE]/60">{finishes[activeTab].bestFor}</span>
                      </div>
                    </div>

                    {/* Visual Mockup Preview */}
                    <div className="md:col-span-5 flex justify-center items-center h-full max-h-[220px] md:max-h-full">
                      <div className="w-full h-full relative flex items-center justify-center bg-black/40 rounded-lg border border-[#D4AF37]/10 p-4">
                        <img
                          src={finishes[activeTab].bgImage}
                          alt={finishes[activeTab].title}
                          className="max-h-full object-contain filter drop-shadow-[0_10px_20px_rgba(212,175,55,0.15)] animate-pulse"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
