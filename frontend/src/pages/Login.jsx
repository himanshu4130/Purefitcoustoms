import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, ShieldCheck, AlertTriangle } from "lucide-react";
import Logo from "@/components/Logo";

export default function Login() {
  const [params] = useSearchParams();
  const error = params.get("error");

  // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
  const startGoogleLogin = () => {
    const redirectUrl = window.location.origin + "/admin";
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  return (
    <main data-testid="login-page" className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6 py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(11,61,46,0.6),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(212,175,55,0.08),transparent_60%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative max-w-md w-full glass-dark rounded-md p-10 lg:p-12"
      >
        <div className="flex justify-center mb-8">
          <Logo variant="mark" size="xl" asLink={false} testid="login-logo" />
        </div>

        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-px bg-[#D4AF37]" />
            <span className="text-[#D4AF37] uppercase text-[10px] tracking-[0.35em]">Admin Access</span>
            <span className="w-8 h-px bg-[#D4AF37]" />
          </div>
          <h1 className="font-serif text-4xl text-white">Sign In</h1>
          <p className="mt-3 text-[#F8F5EE]/60 text-sm leading-relaxed">
            Restricted to <span className="text-[#D4AF37]">purefit2026@gmail.com</span> only.
          </p>
        </div>

        {error && (
          <div data-testid="login-error" className="mb-6 p-4 border border-red-500/40 bg-red-500/10 rounded-md flex items-start gap-3 text-sm text-red-200">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={startGoogleLogin}
          data-testid="login-google-btn"
          className="w-full flex items-center justify-center gap-3 bg-[#D4AF37] text-[#111111] px-6 py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#F8F5EE] transition-colors"
        >
          <LogIn size={16} />
          Continue with Google
        </button>

        <div className="mt-8 pt-6 border-t border-[#D4AF37]/15 flex items-start gap-3 text-xs text-[#F8F5EE]/50">
          <ShieldCheck size={14} className="text-[#D4AF37] mt-0.5 shrink-0" />
          <p className="leading-relaxed">
            Your Google account email is checked against our allowlist. Other accounts will be rejected.
          </p>
        </div>
      </motion.div>
    </main>
  );
}
