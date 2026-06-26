import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight } from "lucide-react";
import { CONTACT } from "@/lib/content";

export default function CTASection() {
  return (
    <section
      data-testid="cta-section"
      className="relative py-28 lg:py-36 bg-[#111111] overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-25 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/29040997/pexels-photo-29040997.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=1600')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#111111]/95 via-[#0B3D2E]/80 to-[#111111]/95" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative max-w-4xl mx-auto px-6 lg:px-10 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-px bg-[#D4AF37]" />
          <span className="text-[#D4AF37] uppercase text-xs tracking-[0.35em]">Begin Your Story</span>
          <div className="w-10 h-px bg-[#D4AF37]" />
        </div>

        <h2 className="font-serif text-4xl sm:text-5xl lg:text-7xl text-white leading-[1.02]">
          Ready To Create
          <br />
          Something <span className="italic text-[#D4AF37]">Memorable</span> ?
        </h2>

        <p className="mt-8 text-lg sm:text-xl text-[#F8F5EE]/75 max-w-2xl mx-auto leading-relaxed">
          Let&apos;s transform your event into a premium branding experience.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/quote"
            data-testid="cta-quote-btn"
            className="group inline-flex items-center justify-center gap-3 bg-[#D4AF37] text-[#111111] px-10 py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#F8F5EE] transition-all duration-500"
          >
            Request Quote
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href={`https://wa.me/${CONTACT.whatsapp}?text=Hello%20PureFit%2C%20I%20would%20like%20to%20discuss%20custom%20bottle%20branding.`}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="cta-whatsapp-btn"
            className="group inline-flex items-center justify-center gap-3 border border-[#D4AF37]/60 text-[#D4AF37] px-10 py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#D4AF37] hover:text-[#111111] transition-all duration-500"
          >
            <MessageCircle size={16} />
            Chat On WhatsApp
          </a>
        </div>
      </motion.div>
    </section>
  );
}
