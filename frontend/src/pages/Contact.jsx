import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Phone, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { api } from "@/lib/api";
import { CONTACT } from "@/lib/content";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "General Inquiry", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/contact", form);
      toast.success("Message received. We'll be in touch shortly.");
      setForm({ name: "", email: "", phone: "", subject: "General Inquiry", message: "" });
    } catch (err) {
      toast.error("Could not send your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const mapsEmbed = `https://www.google.com/maps?q=${encodeURIComponent(CONTACT.mapsQuery)}&output=embed`;

  return (
    <main data-testid="contact-page" className="bg-[#111111] pt-28 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Heading */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-px bg-[#D4AF37]" />
            <span className="text-[#D4AF37] uppercase text-xs tracking-[0.35em]">Get In Touch</span>
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.02]">
            Let&apos;s <span className="italic text-[#D4AF37]">Create</span> Together
          </h1>
          <p className="mt-6 text-lg text-[#F8F5EE]/70 leading-relaxed">
            Tell us about your event, brand, or idea — and our design team will craft a luxury proposal tailored to you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Left: contact details + form */}
          <div className="lg:col-span-7">
            <form onSubmit={submit} data-testid="contact-form" className="space-y-6 glass-dark p-8 lg:p-10 rounded-md">
              <h3 className="font-serif text-3xl text-white mb-4">Send a Message</h3>
              <div className="grid sm:grid-cols-2 gap-5">
                <FormField label="Name *" testid="contact-name">
                  <input
                    required
                    value={form.name}
                    onChange={onChange("name")}
                    data-testid="contact-input-name"
                    className="input-luxury"
                    placeholder="Your full name"
                  />
                </FormField>
                <FormField label="Email *" testid="contact-email">
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={onChange("email")}
                    data-testid="contact-input-email"
                    className="input-luxury"
                    placeholder="you@email.com"
                  />
                </FormField>
                <FormField label="Phone" testid="contact-phone">
                  <input
                    value={form.phone}
                    onChange={onChange("phone")}
                    data-testid="contact-input-phone"
                    className="input-luxury"
                    placeholder="+91 ..."
                  />
                </FormField>
                <FormField label="Subject" testid="contact-subject">
                  <input
                    value={form.subject}
                    onChange={onChange("subject")}
                    data-testid="contact-input-subject"
                    className="input-luxury"
                    placeholder="What's it about?"
                  />
                </FormField>
              </div>
              <FormField label="Message *" testid="contact-message">
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={onChange("message")}
                  data-testid="contact-input-message"
                  className="input-luxury resize-none"
                  placeholder="Tell us about your event or project..."
                />
              </FormField>
              <button
                type="submit"
                disabled={submitting}
                data-testid="contact-submit"
                className="inline-flex items-center gap-3 bg-[#D4AF37] text-[#111111] px-8 py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#F8F5EE] transition-colors disabled:opacity-60"
              >
                {submitting ? "Sending..." : "Send Message"}
                <Send size={14} />
              </button>
            </form>
          </div>

          {/* Right: details */}
          <aside className="lg:col-span-5 space-y-6">
            <ContactItem icon={Phone} title="Call Us" testid="contact-info-phone">
              <a href={`tel:${CONTACT.phone1.replace(/\s/g, "")}`} className="block hover:text-[#D4AF37] transition-colors">{CONTACT.phone1}</a>
              <a href={`tel:${CONTACT.phone2.replace(/\s/g, "")}`} className="block hover:text-[#D4AF37] transition-colors">{CONTACT.phone2}</a>
            </ContactItem>
            <ContactItem icon={Mail} title="Email" testid="contact-info-email">
              <a href={`mailto:${CONTACT.email}`} className="hover:text-[#D4AF37] transition-colors">{CONTACT.email}</a>
            </ContactItem>
            <ContactItem icon={MessageCircle} title="WhatsApp" testid="contact-info-whatsapp">
              <a
                href={`https://wa.me/${CONTACT.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D4AF37] transition-colors"
              >
                +91 {CONTACT.whatsapp}
              </a>
            </ContactItem>
            <ContactItem icon={MapPin} title="Studio" testid="contact-info-address">
              <span className="leading-relaxed">{CONTACT.address}</span>
            </ContactItem>

            <div data-testid="contact-map" className="aspect-[4/3] border border-[#D4AF37]/20 overflow-hidden rounded-md">
              <iframe
                title="PureFit Customs Studio Location"
                src={mapsEmbed}
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(0.4) contrast(1.1)" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        .input-luxury {
          width: 100%;
          background: rgba(17,17,17,0.6);
          border: 1px solid rgba(212,175,55,0.18);
          color: #F8F5EE;
          padding: 0.875rem 1rem;
          font-size: 0.95rem;
          transition: border-color 0.3s, background 0.3s;
        }
        .input-luxury::placeholder { color: rgba(248,245,238,0.4); }
        .input-luxury:focus {
          border-color: #D4AF37;
          background: rgba(11,61,46,0.3);
        }
      `}</style>
    </main>
  );
}

function FormField({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-[0.25em] text-[#D4AF37] mb-2">{label}</span>
      {children}
    </label>
  );
}

function ContactItem({ icon: Icon, title, children, testid }) {
  return (
    <div data-testid={testid} className="glass-dark p-6 rounded-md flex gap-4">
      <div className="w-12 h-12 border border-[#D4AF37]/40 flex items-center justify-center shrink-0">
        <Icon size={18} className="text-[#D4AF37]" />
      </div>
      <div className="flex-1 text-[#F8F5EE]/80">
        <div className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] mb-2">{title}</div>
        {children}
      </div>
    </div>
  );
}
