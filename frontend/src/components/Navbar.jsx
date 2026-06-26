import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/content";
import Logo from "@/components/Logo";
import useSiteContent from "@/hooks/useSiteContent";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { settings } = useSiteContent();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  return (
    <header
      data-testid="site-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#111111]/85 backdrop-blur-xl border-b border-[#D4AF37]/15 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between">
        <Logo variant="full" size="md" testid="nav-logo" settings={settings} />

        <nav className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              data-testid={l.testid}
              className="text-sm uppercase tracking-[0.18em] text-[#F8F5EE]/70 hover:text-[#D4AF37] transition-colors duration-300"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          to="/quote"
          data-testid="nav-quote-cta"
          className="hidden md:inline-flex items-center px-6 py-3 bg-[#D4AF37] text-[#111111] text-xs uppercase tracking-[0.18em] font-medium hover:bg-[#F8F5EE] transition-colors duration-300"
        >
          Get Quote
        </Link>

        <button
          data-testid="nav-mobile-toggle"
          className="md:hidden text-[#F8F5EE] p-2"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div data-testid="nav-mobile-menu" className="md:hidden bg-[#111111]/95 backdrop-blur-xl border-t border-[#D4AF37]/15 mt-3">
          <div className="px-6 py-6 flex flex-col gap-5">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                data-testid={`${l.testid}-mobile`}
                className="text-sm uppercase tracking-[0.18em] text-[#F8F5EE]/80 hover:text-[#D4AF37]"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/quote"
              data-testid="nav-quote-cta-mobile"
              className="mt-3 inline-flex items-center justify-center px-6 py-3 bg-[#D4AF37] text-[#111111] text-xs uppercase tracking-[0.18em]"
            >
              Get Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
