export default function LoadingScreen({ message = "Loading" }) {
  return (
    <div
      data-testid="loading-screen"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0A0A0A]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(11,61,46,0.6),transparent_60%)]" />
      <div className="relative">
        <div className="w-28 h-28 rounded-full bg-[#F8F5EE] flex items-center justify-center ring-1 ring-[#D4AF37]/40">
          <img src="/brand/logo.png" alt="PureFit Customs" className="w-24 h-24 object-contain p-2" />
        </div>
        <span className="absolute inset-0 rounded-full border border-[#D4AF37]/60 animate-ping" />
      </div>
      <div className="relative mt-10 flex items-center gap-3">
        <span className="w-10 h-px bg-[#D4AF37]" />
        <span className="text-[#D4AF37] text-xs uppercase tracking-[0.4em]">{message}</span>
        <span className="w-10 h-px bg-[#D4AF37]" />
      </div>
    </div>
  );
}
