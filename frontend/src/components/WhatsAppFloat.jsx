import { MessageCircle } from "lucide-react";
import { CONTACT } from "@/lib/content";

export default function WhatsAppFloat() {
  const link = `https://wa.me/${CONTACT.whatsapp}?text=Hello%20PureFit%2C%20I'd%20love%20to%20discuss%20custom%20bottle%20branding.`;
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="whatsapp-float"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 group"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
      <span className="relative flex items-center gap-3 bg-[#25D366] text-white pl-4 pr-5 py-3 rounded-full shadow-2xl shadow-[#25D366]/30 hover:scale-105 transition-transform duration-300">
        <MessageCircle size={22} />
        <span className="hidden sm:inline text-sm font-medium">WhatsApp Us</span>
      </span>
    </a>
  );
}
