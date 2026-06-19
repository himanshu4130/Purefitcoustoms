import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";
import { CONTACT, NAV_LINKS } from "@/lib/content";

export default function Footer() {
  return (
    <footer
      data-testid="site-footer"
      className="relative bg-[#0A0A0A] border-t border-[#D4AF37]/15"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="lg:col-span-5">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 border border-[#D4AF37]/60 flex items-center justify-center rotate-45">
                <span className="-rotate-45 font-serif text-[#D4AF37] text-xl">P</span>
              </div>
              <div className="leading-none">
                <div className="font-serif text-xl text-white">PureFit</div>
                <div className="text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase">Customs</div>
              </div>
            </Link>
            <p className="text-[#F8F5EE]/60 leading-relaxed max-w-md">
              Kerala&apos;s premium customized water bottle branding studio. We turn ordinary bottles
              into objects of memory for weddings, events, and brands.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <a
                href="#"
                data-testid="footer-instagram"
                aria-label="Instagram"
                className="w-10 h-10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#111111] transition-colors"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                data-testid="footer-facebook"
                aria-label="Facebook"
                className="w-10 h-10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#111111] transition-colors"
              >
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div className="lg:col-span-3">
            <h4 className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] mb-6">Explore</h4>
            <ul className="space-y-4">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} data-testid={`footer-${l.testid}`} className="text-[#F8F5EE]/70 hover:text-[#D4AF37] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/quote" className="text-[#F8F5EE]/70 hover:text-[#D4AF37] transition-colors">
                  Request Quote
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h4 className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] mb-6">Contact</h4>
            <ul className="space-y-4 text-[#F8F5EE]/70">
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-[#D4AF37] mt-1 shrink-0" />
                <div>
                  <a href={`tel:${CONTACT.phone1.replace(/\s/g, "")}`} className="block hover:text-[#D4AF37]">{CONTACT.phone1}</a>
                  <a href={`tel:${CONTACT.phone2.replace(/\s/g, "")}`} className="block hover:text-[#D4AF37]">{CONTACT.phone2}</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-[#D4AF37] mt-1 shrink-0" />
                <a href={`mailto:${CONTACT.email}`} className="hover:text-[#D4AF37]">{CONTACT.email}</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-[#D4AF37] mt-1 shrink-0" />
                <span className="leading-relaxed">{CONTACT.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[#D4AF37]/15 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs uppercase tracking-[0.25em] text-[#F8F5EE]/40">
            © {new Date().getFullYear()} PureFit Customs · Made in Kerala
          </p>
          <p className="text-xs uppercase tracking-[0.25em] text-[#F8F5EE]/40">
            Every Bottle Tells A Story
          </p>
        </div>
      </div>
    </footer>
  );
}
