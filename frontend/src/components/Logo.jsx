import { Link } from "react-router-dom";

const LOGO_URL = "/brand/logo.png";

/**
 * Official PureFit Customs logo with luxury presentation.
 * variant: "full" (icon + wordmark) | "mark" (icon only) | "wordmark" (text only)
 * size: "sm" | "md" | "lg" | "xl" | "2xl"
 * theme: "light" (default) for dark backgrounds | "dark" for light backgrounds
 */
export default function Logo({
  variant = "full",
  size = "md",
  asLink = true,
  className = "",
  withTagline = false,
  testid = "site-logo",
  settings = {},
}) {
  const sizes = {
    sm: { box: "h-11 w-11", img: "p-1", word: "text-lg", tag: "text-[9px]" },
    md: { box: "h-16 w-16", img: "p-1.5", word: "text-2xl", tag: "text-[10px]" },
    lg: { box: "h-20 w-20", img: "p-2", word: "text-3xl", tag: "text-[11px]" },
    xl: { box: "h-28 w-28", img: "p-2.5", word: "text-4xl", tag: "text-xs" },
    "2xl": { box: "h-40 w-40", img: "p-3", word: "text-5xl", tag: "text-sm" },
  };
  const s = sizes[size] || sizes.md;
  const logoSrc = settings?.logo_url
    ? `${process.env.REACT_APP_BACKEND_URL}${settings.logo_url}`
    : LOGO_URL;

  const inner = (
    <div data-testid={testid} className={`group inline-flex items-center gap-4 ${className}`}>
      {(variant === "full" || variant === "mark") && (
        <div className="relative shrink-0">
          {/* Outer ring with gold gradient + glow */}
          <span className="absolute -inset-1 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.45)_0%,rgba(212,175,55,0)_70%)] blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-700" aria-hidden="true" />
          <span className="absolute inset-0 rounded-full ring-1 ring-[#D4AF37]/40 group-hover:ring-[#D4AF37] transition-colors duration-700" aria-hidden="true" />
          {/* Rotating thin accent ring */}
          <span className="absolute -inset-[3px] rounded-full border border-[#D4AF37]/30 group-hover:border-[#D4AF37]/60 group-hover:rotate-180 transition-all duration-[1500ms] ease-out" aria-hidden="true" />
          {/* Logo image on cream disc */}
          <div className={`relative ${s.box} rounded-full bg-[#F8F5EE] overflow-hidden shadow-[0_8px_24px_rgba(212,175,55,0.18),0_2px_6px_rgba(0,0,0,0.4)] group-hover:shadow-[0_12px_36px_rgba(212,175,55,0.35),0_4px_10px_rgba(0,0,0,0.5)] group-hover:scale-[1.04] transition-all duration-500`}>
            <img
              src={logoSrc}
              alt="PureFit Customs"
              className={`absolute inset-0 w-full h-full object-contain ${s.img}`}
              draggable="false"
            />
          </div>
        </div>
      )}
      {(variant === "full" || variant === "wordmark") && (
        <div className="flex flex-col leading-[1.05]">
          <span className={`font-serif ${s.word} tracking-tight text-white`}>
            Pure<span className="text-[#D4AF37]">Fit</span>
          </span>
          <span className={`${s.tag} tracking-[0.4em] text-[#D4AF37]/90 uppercase mt-1`}>
            {withTagline ? "Custom Bottle Branding" : "— Customs —"}
          </span>
        </div>
      )}
    </div>
  );

  if (!asLink) return inner;
  return (
    <Link to="/" className="inline-flex items-center" data-testid={`${testid}-link`}>
      {inner}
    </Link>
  );
}
