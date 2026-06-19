import { Link } from "react-router-dom";

const LOGO_URL = "/brand/logo.png";

/**
 * Official PureFit Customs logo.
 * variant: "full" (icon + wordmark) | "mark" (icon only) | "wordmark" (text only)
 * theme: "light" (dark background, default) | "dark" (light background)
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
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-14 w-14",
    xl: "h-20 w-20",
    "2xl": "h-32 w-32",
  };
  const imgSize = sizes[size] || sizes.md;
  const logoSrc = settings?.logo_url
    ? `${process.env.REACT_APP_BACKEND_URL}${settings.logo_url}`
    : LOGO_URL;

  const inner = (
    <div data-testid={testid} className={`inline-flex items-center gap-3 ${className}`}>
      {(variant === "full" || variant === "mark") && (
        <div className={`${imgSize} relative shrink-0 rounded-full overflow-hidden ring-1 ring-[#D4AF37]/40 bg-[#F8F5EE]`}>
          <img src={logoSrc} alt="PureFit Customs" className="absolute inset-0 w-full h-full object-contain p-1" />
        </div>
      )}
      {(variant === "full" || variant === "wordmark") && (
        <div className="flex flex-col leading-none">
          <span className="font-serif text-xl tracking-wide text-white">PureFit</span>
          <span className="text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase">
            {withTagline ? "Custom Bottle Branding" : "Customs"}
          </span>
        </div>
      )}
    </div>
  );

  if (!asLink) return inner;
  return (
    <Link to="/" className="inline-flex items-center gap-3 group" data-testid={`${testid}-link`}>
      {inner}
    </Link>
  );
}
