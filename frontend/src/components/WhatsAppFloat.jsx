import { CONTACT } from "@/lib/content";
import useSiteContent from "@/hooks/useSiteContent";

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
    <path d="M12.031 2c-5.502 0-9.969 4.468-9.969 9.97 0 1.758.459 3.479 1.33 5.005L2 22l5.166-1.354c1.47.8 3.119 1.224 4.865 1.224 5.502 0 9.97-4.468 9.97-9.97 0-2.658-1.034-5.157-2.91-7.034C17.18 3.034 14.686 2 12.031 2zm5.804 14.156c-.24.674-1.393 1.306-1.923 1.385-.482.072-.947.28-3.08-.553-2.73-1.066-4.49-3.843-4.627-4.024-.137-.18-1.096-1.455-1.096-2.776 0-1.32.686-1.97.93-2.23.243-.26.531-.326.708-.326.177 0 .354.004.509.01.162.008.38-.06.592.45.22.531.752 1.834.818 1.97.066.13.11.285.022.46-.088.176-.133.285-.265.44-.132.155-.278.347-.397.466-.13.13-.267.272-.115.534.153.263.678 1.118 1.457 1.81.996.888 1.836 1.163 2.102 1.295.267.133.424.11.583-.073.16-.18.686-.798.87-.1.184.696.862 2.274.928 2.404.066.13.13.26.066.39-.064.13-.24.674-.48 1.352z" />
  </svg>
);

export default function WhatsAppFloat() {
  const { settings } = useSiteContent();
  const whatsappNum = settings.business_whatsapp || CONTACT.whatsapp;
  const link = `https://wa.me/${whatsappNum}?text=Hello%20PureFit%2C%20I'd%20love%20to%20discuss%20custom%20bottle%20branding.`;
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="whatsapp-float"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 group flex items-center justify-center"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-35" />
      <span className="relative flex items-center gap-3 bg-[#25D366] text-white p-3.5 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300">
        <WhatsAppIcon />
      </span>
    </a>
  );
}
