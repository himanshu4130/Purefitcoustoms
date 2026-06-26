import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save, Check, ArrowUp, ArrowDown } from "lucide-react";
import { api, buildMediaUrl } from "@/lib/api";
import { PanelHeader, Loading } from "@/pages/admin/QuotesPanel";
import { FormStyles } from "@/pages/admin/ContentPanel";
import ImagePicker from "@/components/ImagePicker";

const FIELDS = [
  { key: "hero_headline", label: "Hero Headline (homepage)", textarea: true, placeholder: "Every Bottle Tells A Story" },
  { key: "hero_subheading", label: "Hero Subheading", textarea: true, placeholder: "Premium customized water bottle branding…" },
  { key: "hero_overline", label: "Hero Overline (tiny gold caption)", placeholder: "Kerala's Premium Bottle Branding" },
];

const IMAGE_FIELDS = [
  { key: "logo_image_id", label: "Custom Logo (overrides default PureFit logo)", type: "brand-logo" },
  { key: "favicon_image_id", label: "Custom Favicon", type: "brand-logo" },
  { key: "hero_background_image_id", label: "Hero Background Image", type: "brand-bg" },
  { key: "hero_featured_image_id", label: "Hero Featured Bottle (fallback if no slider active)", type: "brand-hero" },
];

const COLOR_FIELDS = [
  { key: "primary_color", label: "Primary (Deep Forest Green)", default: "#0B3D2E" },
  { key: "secondary_color", label: "Secondary (Luxury Gold)", default: "#D4AF37" },
  { key: "accent_color", label: "Accent (Warm Cream)", default: "#F8F5EE" },
  { key: "background_color", label: "Background (Matte Black)", default: "#111111" },
];

export default function BrandPanel() {
  const [settings, setSettings] = useState({});
  const [bottles, setBottles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      const [s, c] = await Promise.all([
        api.get("/site-settings"),
        api.get("/admin/site-content")
      ]);
      setSettings(s.data || {});
      // Filter out items of kind "gallery" (which represents Bottle Manager items)
      setBottles((c.data || []).filter(item => item.kind === "gallery"));
    } catch {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onSave = async () => {
    setSaving(true);
    try {
      const payload = { ...settings };
      await api.put("/admin/site-settings", payload);
      toast.success("Brand & slider settings saved");
      await loadData();
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div data-testid="admin-brand-panel" className="pb-12">
      <PanelHeader
        title="Brand & Slider Settings"
        subtitle="Configure the public website identity, brand palette, logo, and homepage rotating bottle showcase slider."
        action={
          <button data-testid="brand-save" onClick={onSave} disabled={saving} className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-[#111111] text-xs uppercase tracking-[0.2em] hover:bg-[#F8F5EE] disabled:opacity-60 font-bold">
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

        {/* Slider settings */}
        <section className="border-t border-[#D4AF37]/15 pt-8">
          <h2 className="font-serif text-2xl text-white mb-2">Homepage Hero Slider</h2>
          <p className="text-sm text-[#F8F5EE]/50 mb-6">Select which custom bottles appear in the rotating homepage hero section, set their order, and control rotation behavior.</p>
          
          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            <label className="flex items-center gap-3 text-sm text-[#F8F5EE]/70 cursor-pointer p-4 bg-[#111]/40 border border-[#D4AF37]/15 rounded">
              <input
                type="checkbox"
                checked={settings.hero_auto_rotate !== false}
                onChange={(e) => setSettings({ ...settings, hero_auto_rotate: e.target.checked })}
                className="accent-[#D4AF37] w-4 h-4"
              />
              <div>
                <span className="block font-semibold text-white">Enable Auto Rotation</span>
                <span className="text-xs text-[#F8F5EE]/40">Automatically transition slides on the homepage</span>
              </div>
            </label>
            
            <label className="block p-4 bg-[#111]/40 border border-[#D4AF37]/15 rounded">
              <span className="block text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] mb-2 font-semibold">Rotation Speed (seconds)</span>
              <input
                type="number"
                min={2}
                max={20}
                value={settings.hero_rotation_speed || 5}
                onChange={(e) => setSettings({ ...settings, hero_rotation_speed: parseInt(e.target.value, 10) || 5 })}
                className="input-luxury"
              />
            </label>
          </div>

          <div className="space-y-4">
            <span className="block text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">Select and Order Slider Bottles</span>
            
            {bottles.length === 0 ? (
              <div className="text-xs text-[#F8F5EE]/40 p-4 border border-dashed border-[#D4AF37]/20 text-center rounded">
                No bottles found in the database. Add bottles in the <span className="underline">Bottle Manager</span> first.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {bottles.map((bottle) => {
                  const isSelected = (settings.hero_bottle_ids || []).includes(bottle.id);
                  return (
                    <div
                      key={bottle.id}
                      onClick={() => {
                        const current = settings.hero_bottle_ids || [];
                        let next;
                        if (isSelected) {
                          next = current.filter(id => id !== bottle.id);
                        } else {
                          next = [...current, bottle.id];
                        }
                        setSettings({ ...settings, hero_bottle_ids: next });
                      }}
                      className={`cursor-pointer group relative rounded border overflow-hidden transition-all bg-[#0A0A0A] ${
                        isSelected ? "border-[#D4AF37] ring-1 ring-[#D4AF37]" : "border-[#D4AF37]/15 hover:border-[#D4AF37]/35"
                      }`}
                    >
                      <div className="aspect-[4/3] relative">
                        {bottle.image_id ? (
                          <img src={buildMediaUrl(bottle.image_id)} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-white/30">No Image</div>
                        )}
                        
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-[#D4AF37] text-[#111111] p-1 rounded-full">
                            <Check size={10} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                      <div className="p-2 text-xs truncate font-serif text-white">{bottle.title || "Untitled Bottle"}</div>
                      <div className="px-2 pb-2 text-[9px] text-[#D4AF37] uppercase tracking-wider">{bottle.category}</div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* Slide Order Management */}
            {(settings.hero_bottle_ids || []).length > 0 && (
              <div className="mt-6 border border-[#D4AF37]/15 rounded-md p-4 bg-[#111]/30">
                <span className="block text-xs uppercase tracking-wider text-[#D4AF37] font-semibold mb-3">Active Slide Order</span>
                <div className="space-y-2">
                  {(settings.hero_bottle_ids || []).map((id, index) => {
                    const bottle = bottles.find(b => b.id === id);
                    if (!bottle) return null;
                    return (
                      <div key={id} className="flex justify-between items-center bg-[#070707] p-2.5 rounded border border-[#D4AF37]/10">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-[#D4AF37] font-semibold w-5">#{index + 1}</span>
                          {bottle.image_id && (
                            <img src={buildMediaUrl(bottle.image_id)} alt="" className="w-8 h-8 object-cover rounded border border-[#D4AF37]/20" />
                          )}
                          <div>
                            <span className="text-xs font-serif text-white block">{bottle.title}</span>
                            <span className="text-[9px] text-[#F8F5EE]/40 uppercase tracking-wider">{bottle.category} • {bottle.subtitle}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-1">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={(e) => {
                              e.stopPropagation();
                              const list = [...settings.hero_bottle_ids];
                              const temp = list[index];
                              list[index] = list[index - 1];
                              list[index - 1] = temp;
                              setSettings({ ...settings, hero_bottle_ids: list });
                            }}
                            className="p-1 border border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/10 disabled:opacity-30 rounded"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            type="button"
                            disabled={index === settings.hero_bottle_ids.length - 1}
                            onClick={(e) => {
                              e.stopPropagation();
                              const list = [...settings.hero_bottle_ids];
                              const temp = list[index];
                              list[index] = list[index + 1];
                              list[index + 1] = temp;
                              setSettings({ ...settings, hero_bottle_ids: list });
                            }}
                            className="p-1 border border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/10 disabled:opacity-30 rounded"
                          >
                            <ArrowDown size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Images */}
        <section className="border-t border-[#D4AF37]/15 pt-8">
          <h2 className="font-serif text-2xl text-white mb-4">Brand Images</h2>
          <p className="text-sm text-[#F8F5EE]/50 mb-6">Upload or select images directly to assign them to branding slots.</p>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
            {IMAGE_FIELDS.map((f) => (
              <div key={f.key} data-testid={`brand-image-${f.key}`} className="space-y-2">
                <div className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">{f.label}</div>
                <ImagePicker
                  value={settings[f.key]}
                  onChange={(id) => setSettings({ ...settings, [f.key]: id })}
                  sectionType={f.type}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Business, Map & SEO Settings */}
        <section className="border-t border-[#D4AF37]/15 pt-8">
          <h2 className="font-serif text-2xl text-white mb-2">Business, Map & SEO Settings</h2>
          <p className="text-sm text-[#F8F5EE]/50 mb-6">Expose business details, contact information, social links, SEO tags, and Google Maps embed URL.</p>
          
          <div className="grid sm:grid-cols-2 gap-5">
            <label className="block">
              <span className="block text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] mb-2">Business Name</span>
              <input data-testid="brand-business-name" value={settings.business_name || ""} onChange={(e) => setSettings({ ...settings, business_name: e.target.value })} className="input-luxury" placeholder="PureFit Customs" />
            </label>
            <label className="block">
              <span className="block text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] mb-2">Phone Number</span>
              <input data-testid="brand-business-phone" value={settings.business_phone || ""} onChange={(e) => setSettings({ ...settings, business_phone: e.target.value })} className="input-luxury" placeholder="+91 91881 08947" />
            </label>
            <label className="block">
              <span className="block text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] mb-2">Email Address</span>
              <input data-testid="brand-business-email" value={settings.business_email || ""} onChange={(e) => setSettings({ ...settings, business_email: e.target.value })} className="input-luxury" placeholder="purefit2026@gmail.com" />
            </label>
            <label className="block">
              <span className="block text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] mb-2">WhatsApp Contact (Number only)</span>
              <input data-testid="brand-business-whatsapp" value={settings.business_whatsapp || ""} onChange={(e) => setSettings({ ...settings, business_whatsapp: e.target.value })} className="input-luxury" placeholder="919188108947" />
            </label>
            <label className="block sm:col-span-2">
              <span className="block text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] mb-2">Business Address</span>
              <input data-testid="brand-business-address" value={settings.business_address || ""} onChange={(e) => setSettings({ ...settings, business_address: e.target.value })} className="input-luxury" placeholder="Eravimangalam (PO), Manjoor, Kerala 686613, Kottayam" />
            </label>
            <label className="block sm:col-span-2">
              <span className="block text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] mb-2">Google Maps Embed URL</span>
              <textarea data-testid="brand-map-embed-url" rows={2} value={settings.map_embed_url || ""} onChange={(e) => setSettings({ ...settings, map_embed_url: e.target.value })} className="input-luxury resize-none" placeholder="https://www.google.com/maps/embed?pb=..." />
            </label>
            <label className="block">
              <span className="block text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] mb-2">Instagram URL</span>
              <input data-testid="brand-social-instagram" value={settings.social_instagram || ""} onChange={(e) => setSettings({ ...settings, social_instagram: e.target.value })} className="input-luxury" placeholder="https://instagram.com/purefitcustoms" />
            </label>
            <label className="block">
              <span className="block text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] mb-2">Facebook URL</span>
              <input data-testid="brand-social-facebook" value={settings.social_facebook || ""} onChange={(e) => setSettings({ ...settings, social_facebook: e.target.value })} className="input-luxury" placeholder="https://facebook.com/purefitcustoms" />
            </label>
            <label className="block sm:col-span-2">
              <span className="block text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] mb-2">SEO Title</span>
              <input data-testid="brand-seo-title" value={settings.seo_title || ""} onChange={(e) => setSettings({ ...settings, seo_title: e.target.value })} className="input-luxury" placeholder="PureFit Customs - Customized Water Bottle Branding Kerala" />
            </label>
            <label className="block sm:col-span-2">
              <span className="block text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] mb-2">SEO Description</span>
              <textarea data-testid="brand-seo-description" rows={2} value={settings.seo_description || ""} onChange={(e) => setSettings({ ...settings, seo_description: e.target.value })} className="input-luxury resize-none" placeholder="Kerala's premium customized water bottle branding studio..." />
            </label>
          </div>
        </section>

        {/* Colors */}
        <section className="border-t border-[#D4AF37]/15 pt-8">
          <h2 className="font-serif text-2xl text-white mb-4">Brand Colors</h2>
          <p className="text-sm text-[#F8F5EE]/50 mb-6">Configure custom palette styling tokens.</p>
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
                    className="w-12 h-10 border border-[#D4AF37]/30 bg-transparent cursor-pointer"
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
