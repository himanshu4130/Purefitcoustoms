import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Upload, Send, CheckCircle2 } from "lucide-react";
import { api, fileToBase64 } from "@/lib/api";
import { EVENT_TYPES, BOTTLE_SIZES } from "@/lib/content";

const initial = {
  name: "",
  phone: "",
  email: "",
  event_type: "",
  bottle_size: "",
  quantity: "",
  event_date: "",
  additional_requirements: "",
};

export default function QuoteForm() {
  const [form, setForm] = useState(initial);
  const [logoFile, setLogoFile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    if (!form.name || !form.phone || !form.email || !form.event_type || !form.bottle_size || !form.quantity) {
      toast.error("Please fill in all required fields.");
      return false;
    }
    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const [logoData, photoData] = await Promise.all([
        fileToBase64(logoFile),
        fileToBase64(photoFile),
      ]);
      await api.post("/quotes", {
        ...form,
        logo_data: logoData,
        logo_filename: logoFile?.name || null,
        photo_data: photoData,
        photo_filename: photoFile?.name || null,
      });
      toast.success("Quote request received. Our team will reach out within 24 hours.");
      setSuccess(true);
      setForm(initial);
      setLogoFile(null);
      setPhotoFile(null);
    } catch (err) {
      console.error(err);
      toast.error("Could not submit your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        data-testid="quote-success"
        className="glass-dark p-12 lg:p-16 text-center rounded-md"
      >
        <div className="w-20 h-20 border border-[#D4AF37] flex items-center justify-center mx-auto mb-8 rounded-full">
          <CheckCircle2 size={36} className="text-[#D4AF37]" />
        </div>
        <h3 className="font-serif text-4xl text-white mb-4">Request Received</h3>
        <p className="text-[#F8F5EE]/70 max-w-md mx-auto leading-relaxed">
          Thank you. Our design team will respond within 24 hours with a tailored proposal and label preview.
        </p>
        <button
          data-testid="quote-new-request"
          onClick={() => setSuccess(false)}
          className="mt-10 inline-flex items-center gap-3 border border-[#D4AF37]/60 text-[#D4AF37] px-8 py-3 text-xs uppercase tracking-[0.2em] hover:bg-[#D4AF37] hover:text-[#111111] transition-colors"
        >
          Submit Another Request
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} data-testid="quote-form" className="glass-dark p-8 lg:p-12 rounded-md space-y-7">
      <div className="grid sm:grid-cols-2 gap-6">
        <Field label="Name *">
          <input required value={form.name} onChange={onChange("name")} className="input-luxury" data-testid="quote-input-name" placeholder="Your full name" />
        </Field>
        <Field label="Phone *">
          <input required value={form.phone} onChange={onChange("phone")} className="input-luxury" data-testid="quote-input-phone" placeholder="+91 ..." />
        </Field>
        <Field label="Email *">
          <input required type="email" value={form.email} onChange={onChange("email")} className="input-luxury" data-testid="quote-input-email" placeholder="you@email.com" />
        </Field>
        <Field label="Event Date">
          <input type="date" value={form.event_date} onChange={onChange("event_date")} className="input-luxury" data-testid="quote-input-date" />
        </Field>
        <Field label="Event Type *">
          <select required value={form.event_type} onChange={onChange("event_type")} className="input-luxury" data-testid="quote-input-event-type">
            <option value="">Select event type</option>
            {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Bottle Size *">
          <select required value={form.bottle_size} onChange={onChange("bottle_size")} className="input-luxury" data-testid="quote-input-bottle-size">
            <option value="">Select size</option>
            {BOTTLE_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Quantity *">
          <input required value={form.quantity} onChange={onChange("quantity")} className="input-luxury" data-testid="quote-input-quantity" placeholder="e.g., 500 bottles" />
        </Field>
        <div />
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <FileField label="Upload Logo" file={logoFile} setFile={setLogoFile} testid="quote-input-logo" />
        <FileField label="Upload Photo / Reference" file={photoFile} setFile={setPhotoFile} testid="quote-input-photo" />
      </div>

      <Field label="Additional Requirements">
        <textarea
          rows={4}
          value={form.additional_requirements}
          onChange={onChange("additional_requirements")}
          className="input-luxury resize-none"
          data-testid="quote-input-requirements"
          placeholder="Tell us about colours, finish (gold foil, matte, gloss), event details, delivery location..."
        />
      </Field>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
        <p className="text-xs text-[#F8F5EE]/50 leading-relaxed">
          By submitting, you agree to our team reaching out via phone, WhatsApp or email.
        </p>
        <button
          type="submit"
          disabled={submitting}
          data-testid="quote-form-submit"
          className="inline-flex items-center gap-3 bg-[#D4AF37] text-[#111111] px-10 py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#F8F5EE] transition-colors disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit Quote Request"}
          <Send size={14} />
        </button>
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
          appearance: none;
        }
        .input-luxury::placeholder { color: rgba(248,245,238,0.4); }
        .input-luxury:focus {
          border-color: #D4AF37;
          background: rgba(11,61,46,0.3);
          outline: none;
        }
        select.input-luxury option { background: #111111; color: #F8F5EE; }
        input[type="date"].input-luxury { color-scheme: dark; }
      `}</style>
    </form>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-[0.25em] text-[#D4AF37] mb-2">{label}</span>
      {children}
    </label>
  );
}

function FileField({ label, file, setFile, testid }) {
  return (
    <label className="block cursor-pointer">
      <span className="block text-xs uppercase tracking-[0.25em] text-[#D4AF37] mb-2">{label}</span>
      <div className="flex items-center gap-3 input-luxury hover:border-[#D4AF37]/60 transition-colors">
        <Upload size={16} className="text-[#D4AF37]" />
        <span className="text-sm text-[#F8F5EE]/70 truncate flex-1">
          {file ? file.name : "Click to upload (PNG, JPG, PDF)"}
        </span>
        <input
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          data-testid={testid}
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>
    </label>
  );
}
