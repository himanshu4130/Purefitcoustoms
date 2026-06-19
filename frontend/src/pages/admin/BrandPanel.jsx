import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { api, buildMediaUrl } from "@/lib/api";
import { PanelHeader, Loading } from "@/pages/admin/QuotesPanel";
import { FormStyles } from "@/pages/admin/ContentPanel";

const FIELDS = [
  { key: "hero_headline", label: "Hero Headline (homepage)", textarea: true, placeholder: "Every Bottle Tells A Story" },
  { key: "hero_subheading", label: "Hero Subheading", textarea: true, placeholder: "Premium customized water bottle branding…" },
  { key: "hero_overline", label: "Hero Overline (tiny gold caption)", placeholder: "Kerala's Premium Bottle Branding" },
];

const IMAGE_FIELDS = [
  { key: "logo_image_id", label: "Custom Logo (overrides default PureFit logo)" },
  { key: "favicon_image_id", label: "Custom Favicon" },
  { key: "hero_background_image_id", label: "Hero Background Image" },
  { key: "hero_featured_image_id", label: "Hero Featured Bottle (right side card)" },
];

const COLOR_FIELDS = [
  { key: "primary_color", label: "Primary (Deep Forest Green)", default: "#0B3D2E" },
  { key: "secondary_color", label: "Secondary (Luxury Gold)", default: "#D4AF37" },
  { key: "accent_color", label: "Accent (Warm Cream)", default: "#F8F5EE" },
  { key: "background_color", label: "Background (Matte Black)", default: "#111111" },
];

export default function BrandPanel() {
  const [settings, setSettings] = useState({});
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [s, m] = await Promise.all([api.get("/site-settings"), api.get("/admin/media")]);
        setSettings(s.data || {});
        setMedia(m.data || []);
      } catch { toast.error("Failed to load settings"); }
      finally { setLoading(false); }
    })();
  }, []);

  const onSave = async () => {
    setSaving(true);
    try {
      const payload = {};
      for (const f of [...FIELDS, ...IMAGE_FIELDS, ...COLOR_FIELDS]) {
        if (settings[f.key] !== undefined) payload[f.key] = settings[f.key];
      }
      await api.put("/admin/site-settings", payload);
      toast.success("Brand settings saved");
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  if (loading) return <Loading />;

  return (
    <div data-testid="admin-brand-panel">
      <PanelHeader
        title="Brand & Logo"
        subtitle="Update your visible brand identity. Changes appear on the public website immediately."
        action={
          <button data-testid="brand-save" onClick={onSave} disabled={saving} className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-[#111111] text-xs uppercase tracking-[0.2em] hover:bg-[#F8F5EE] disabled:opacity-60">
            <Save size={14} /> {saving ? "Saving…" : "Save Changes"}
          </button>
        }
      />

      <div className="space-y-10">
        {/* Hero text */}
        <section>
          <h2 className="font-serif text-2xl text-white mb-4">Hero Section Text</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {FIELDS.map((f) => (
              <label key={f.key} className={`block ${f.textarea ? "sm:col-span-2" : ""}`}>
                <span className="block text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] mb-2">{f.label}</span>
                {f.textarea ? (
                  <textarea data-testid={`brand-${f.key}`} rows={2} value={settings[f.key] || ""} onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })} className="input-luxury resize-none" placeholder={f.placeholder} />
                ) : (
                  <input data-testid={`brand-${f.key}`} value={settings[f.key] || ""} onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })} className="input-luxury" placeholder={f.placeholder} />
                )}
              </label>
            ))}
          </div>
        </section>

        {/* Images */}
        <section>
          <h2 className="font-serif text-2xl text-white mb-4">Brand Images</h2>
          <p className="text-sm text-[#F8F5EE]/50 mb-6">Choose from your Media Library. Upload new images there first.</p>
          <div className="grid sm:grid-cols-2 gap-6">
            {IMAGE_FIELDS.map((f) => (
              <div key={f.key} data-testid={`brand-image-${f.key}`}>
                <div className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] mb-2">{f.label}</div>
                <ImagePickerMini
                  media={media}
                  value={settings[f.key]}
                  onChange={(id) => setSettings({ ...settings, [f.key]: id })}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Colors */}
        <section>
          <h2 className="font-serif text-2xl text-white mb-4">Brand Colors</h2>
          <p className="text-sm text-[#F8F5EE]/50 mb-6">Stored for future use (not applied to existing CSS in this version).</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {COLOR_FIELDS.map((f) => (
              <label key={f.key} className="block">
                <span className="block text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] mb-2">{f.label}</span>
                <div className="flex items-center gap-2">
                  <input
                    data-testid={`brand-color-${f.key}`}
                    type="color"
                    value={settings[f.key] || f.default}
                    onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })}
                    className="w-12 h-10 border border-[#D4AF37]/30 bg-transparent"
                  />
                  <input
                    type="text"
                    value={settings[f.key] || f.default}
                    onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })}
                    className="input-luxury flex-1"
                  />
                </div>
              </label>
            ))}
          </div>
        </section>
      </div>

      <FormStyles />
    </div>
  );
}

function ImagePickerMini({ media, value, onChange }) {
  const selected = media.find((m) => m.id === value);
  return (
    <div>
      {selected && (
        <div className="mb-3 inline-flex items-center gap-3 p-2 border border-[#D4AF37]/30 rounded-md bg-[#0B3D2E]/20">
          <img src={buildMediaUrl(selected.id)} alt="" className="w-12 h-12 object-cover rounded" />
          <span className="text-xs text-[#F8F5EE]/80 max-w-[12rem] truncate">{selected.original_filename}</span>
          <button onClick={() => onChange("")} className="text-xs text-red-300 hover:text-red-100 ml-2">Clear</button>
        </div>
      )}
      <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto border border-[#D4AF37]/15 p-2 rounded-md">
        {media.length === 0 && <div className="col-span-6 text-center text-xs text-[#F8F5EE]/40 py-4">Upload images in Media Library first.</div>}
        {media.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onChange(m.id)}
            className={`aspect-square overflow-hidden rounded border-2 ${value === m.id ? "border-[#D4AF37]" : "border-transparent hover:border-[#D4AF37]/40"}`}
          >
            <img src={buildMediaUrl(m.id)} alt={m.original_filename} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
