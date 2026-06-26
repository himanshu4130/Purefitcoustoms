import QuoteForm from "@/components/QuoteForm";
import { motion } from "framer-motion";

export default function Quote() {
  return (
    <main data-testid="quote-page" className="bg-[#111111] pt-28 pb-20 min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(11,61,46,0.5),transparent_60%)]" />
      <div className="relative max-w-5xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-px bg-[#D4AF37]" />
            <span className="text-[#D4AF37] uppercase text-xs tracking-[0.35em]">Request A Quote</span>
            <div className="w-10 h-px bg-[#D4AF37]" />
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.02]">
            Begin Your <span className="italic text-[#D4AF37]">Bespoke</span> Project
          </h1>
          <p className="mt-6 text-lg text-[#F8F5EE]/70 leading-relaxed">
            Share a few details and our design team will respond with a tailored proposal within 24 hours.
          </p>
        </motion.div>

        <QuoteForm />
      </div>
    </main>
  );
}
