import useSiteContent from "@/hooks/useSiteContent";
import { Phone, Mail, MapPin, MessageCircle, Navigation } from "lucide-react";

export default function GoogleMapSection() {
  const { settings } = useSiteContent();

  const businessName = settings.business_name || "PureFit Customs";
  const address = settings.business_address || "Eravimangalam (PO), Manjoor, Kerala 686613, Kottayam";
  const phone = settings.business_phone || "+91 91881 08947";
  const email = settings.business_email || "purefit2026@gmail.com";
  const whatsapp = settings.business_whatsapp || "919188108947";
  const mapEmbedUrl = settings.map_embed_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3932.327663248386!2d76.5186217!3d9.7341235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b087f9d853e3bfd%3A0x889659b85c181512!2sManjoor%2C%20Kerala%20686603!5e0!3m2!1sen!2sin!4v1716947291888!5m2!1sen!2sin";
  
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(businessName + " " + address)}`;

  return (
    <section className="relative bg-[#0E0E0E] py-20 lg:py-24 border-t border-[#D4AF37]/15">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Contact Info Card */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-px bg-[#D4AF37]" />
              <span className="text-[#D4AF37] uppercase text-xs tracking-[0.35em]">Visit Our Studio</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-white leading-tight">
              Located in the Heart of <span className="italic text-[#D4AF37]">Kerala</span>
            </h2>
          </div>

          <div className="glass-dark border border-[#D4AF37]/20 p-6 sm:p-8 rounded-lg space-y-6">
            <h3 className="font-serif text-xl text-white">{businessName}</h3>
            
            <div className="space-y-4 text-sm text-[#F8F5EE]/80">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#D4AF37] mt-0.5 shrink-0" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-[#D4AF37] shrink-0" />
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-[#D4AF37] transition-colors">{phone}</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-[#D4AF37] shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-[#D4AF37] transition-colors">{email}</a>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle size={18} className="text-[#D4AF37] shrink-0" />
                <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition-colors">WhatsApp Chat</a>
              </div>
            </div>

            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#F8F5EE] transition-colors rounded-sm"
            >
              <Navigation size={14} />
              Get Directions
            </a>
          </div>
        </div>

        {/* Map Frame (Black & Gold styled) */}
        <div className="lg:col-span-7 h-[350px] sm:h-[450px] relative rounded-lg overflow-hidden border border-[#D4AF37]/25 bg-black shadow-2xl">
          <iframe
            src={mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) grayscale(100%) contrast(120%) brightness(90%)" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Map Location"
          />
          {/* Gold border/accent overlay */}
          <div className="absolute inset-0 pointer-events-none border border-[#D4AF37]/15 rounded-lg" />
        </div>
      </div>
    </section>
  );
}
