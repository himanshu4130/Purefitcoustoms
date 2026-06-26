import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Star, Eye, EyeOff, Save, X, Monitor, Smartphone, Sparkles } from "lucide-react";
import { api, buildMediaUrl } from "@/lib/api";
import { PanelHeader, Empty, Loading } from "@/pages/admin/QuotesPanel";
import ImagePicker from "@/components/ImagePicker";

const CATEGORIES = [
  "Wedding",
  "Corporate",
  "Catering",
  "Holy Communion",
  "Baptism",
  "Housewarming",
  "Funeral",
  "Political",
  "Restaurant"
];

const KINDS = [
  { value: "gallery", label: "Bottle" },
  { value: "hero", label: "Hero Featured Bottle" },
  { value: "testimonial", label: "Testimonial" },
];

const blank = (kind = "gallery") => ({
  kind,
  category: "Wedding",
  title: "",
  subtitle: "",
  image_id: "",
  quote: "",
  description: "",
  quantity: "",
  author_name: "",
  author_role: "",
  is_featured: false,
  is_hero: false,
  is_slider: false,
  is_service: false,
  is_gallery: false,
  is_testimonial: false,
  is_background: false,
  is_active: true,
  sort_order: 0,
  bottle_type: "Round PET",
  image_history: [],
});

export default function ContentPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("gallery");
  const [catFilter, setCatFilter] = useState("All");
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(blank());
  const [previewMode, setPreviewMode] = useState("desktop");

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/site-content");
      setItems(data);
    } catch { toast.error("Failed to load content"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const startCreate = (kind) => {
    setEditing("new");
    setDraft(blank(kind));
  };

  const startEdit = (item) => {
    setEditing(item.id);
    setDraft({ ...item });
  };

  const cancel = () => { setEditing(null); setDraft(blank()); };

  const save = async () => {
    try {
      if (editing === "new") {
        await api.post("/admin/site-content", draft);
        toast.success("Content created successfully");
      } else {
        await api.patch(`/admin/site-content/${editing}`, draft);
        toast.success("Content updated successfully");
      }
      cancel();
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Save failed");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this item permanently?")) return;
    try {
      await api.delete(`/admin/site-content/${id}`);
      setItems((it) => it.filter((x) => x.id !== id));
      toast.success("Deleted");
    } catch { toast.error("Delete failed"); }
  };

  const toggle = async (item, field) => {
    try {
      await api.patch(`/admin/site-content/${item.id}`, { [field]: !item[field] });
      setItems((it) => it.map((x) => x.id === item.id ? { ...x, [field]: !x[field] } : x));
      toast.success("Status updated");
    } catch { toast.error("Update failed"); }
  };

  const handleSetFilter = (val) => {
    setFilter(val);
    setCatFilter("All");
  };

  const filtered = items.filter((i) => {
    if (i.kind !== filter) return false;
    if (filter === "gallery" && catFilter !== "All" && i.category !== catFilter) return false;
    return true;
  });

  return (
    <div data-testid="admin-content-panel" className="space-y-6">
      <PanelHeader
        title="Bottle Manager"
        subtitle="Create, categorize, reorder, and configure customized bottles. Feature them in categories or the homepage hero slider."
        action={
          <button
            data-testid="admin-content-add"
            onClick={() => startCreate(filter)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-[#111111] text-xs uppercase tracking-[0.2em] hover:bg-[#F8F5EE] transition-all"
          >
            <Plus size={14} /> Add {KINDS.find((k) => k.value === filter)?.label || "Item"}
          </button>
        }
      />

      {/* Kind filter */}
      <div className="flex flex-wrap gap-2 mb-4 border-b border-[#D4AF37]/15 pb-4">
        {KINDS.map((k) => (
          <button
            key={k.value}
            data-testid={`content-filter-${k.value}`}
            onClick={() => handleSetFilter(k.value)}
            className={`px-5 py-2 text-xs uppercase tracking-[0.2em] border transition-colors ${
              filter === k.value ? "bg-[#D4AF37] border-[#D4AF37] text-[#111111]" : "border-[#D4AF37]/30 text-[#F8F5EE]/70 hover:border-[#D4AF37]"
            }`}
          >
            {k.label} ({items.filter((i) => i.kind === k.value).length})
          </button>
        ))}
      </div>

      {/* Category sub-filter (only for Bottle list) */}
      {filter === "gallery" && (
        <div className="flex flex-wrap gap-2 mb-6 bg-[#111111] p-3 border border-[#D4AF37]/15 rounded-md">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]/80 font-bold px-2 py-1 shrink-0 flex items-center">
            Filter Category:
          </span>
          <button
            onClick={() => setCatFilter("All")}
            className={`px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] border rounded transition-colors ${
              catFilter === "All" ? "bg-[#D4AF37] border-[#D4AF37] text-[#111111] font-semibold" : "border-[#D4AF37]/20 text-[#F8F5EE]/60 hover:border-[#D4AF37]/50"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className={`px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] border rounded transition-colors ${
                catFilter === c ? "bg-[#D4AF37] border-[#D4AF37] text-[#111111] font-semibold" : "border-[#D4AF37]/20 text-[#F8F5EE]/60 hover:border-[#D4AF37]/50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Editor & Preview Split Panel */}
      {editing && (
        <div data-testid="admin-content-editor" className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#0E0E0E] p-6 lg:p-8 rounded-md border border-[#D4AF37]/30">
          
          {/* Left Form: Form fields */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex justify-between items-center border-b border-[#D4AF37]/15 pb-3">
              <h3 className="font-serif text-2xl text-white">
                {editing === "new" ? "New" : "Edit"} {KINDS.find((k) => k.value === draft.kind)?.label}
              </h3>
              <button onClick={cancel} className="text-[#F8F5EE]/60 hover:text-white"><X size={20} /></button>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {/* Gallery form fields */}
              {draft.kind === "gallery" && (
                <>
                  <Field label="Project Name">
                    <input data-testid="content-input-title" value={draft.title || ""} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="input-luxury" placeholder="e.g., Grand Royal Gala" />
                  </Field>
                  <Field label="Client Name">
                    <input data-testid="content-input-subtitle" value={draft.subtitle || ""} onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })} className="input-luxury" placeholder="e.g., Mr. &amp; Mrs. Sharma" />
                  </Field>
                  <Field label="Category">
                    <select data-testid="content-input-category" value={draft.category || ""} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className="input-luxury">
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="Quantity">
                    <input data-testid="content-input-quantity" value={draft.quantity || ""} onChange={(e) => setDraft({ ...draft, quantity: e.target.value })} className="input-luxury" placeholder="e.g., 500 bottles" />
                  </Field>
                  <Field label="Bottle Type">
                    <select data-testid="content-input-bottle-type" value={draft.bottle_type || "Round PET"} onChange={(e) => setDraft({ ...draft, bottle_type: e.target.value })} className="input-luxury">
                      <option value="Round PET">Round PET</option>
                      <option value="Square PET">Square PET</option>
                    </select>
                  </Field>
                  <div className="hidden"></div>
                  <Field label="Description" className="sm:col-span-2">
                    <textarea data-testid="content-input-description" rows={3} value={draft.description || ""} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="input-luxury resize-none" placeholder="Enter project description..." />
                  </Field>
                  <Field label="Upload Image" className="sm:col-span-2">
                    <ImagePicker
                      value={draft.image_id}
                      onChange={(id) => setDraft({ ...draft, image_id: id })}
                      history={draft.image_history || []}
                      sectionType="gallery"
                    />
                  </Field>
                </>
              )}

              {/* Hero Bottle form fields */}
              {draft.kind === "hero" && (
                <>
                  <Field label="Bottle Name / Title">
                    <input data-testid="content-input-title" value={draft.title || ""} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="input-luxury" placeholder="e.g., Luxury Gold Edition" />
                  </Field>
                  <Field label="Subtitle / Tag">
                    <input data-testid="content-input-subtitle" value={draft.subtitle || ""} onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })} className="input-luxury" placeholder="e.g., Wedding Special" />
                  </Field>
                  <Field label="Upload Image" className="sm:col-span-2">
                    <ImagePicker
                      value={draft.image_id}
                      onChange={(id) => setDraft({ ...draft, image_id: id })}
                      sectionType="hero"
                    />
                  </Field>
                </>
              )}

              {/* Testimonials form fields */}
              {draft.kind === "testimonial" && (
                <>
                  <Field label="Author Name">
                    <input data-testid="content-input-author-name" value={draft.author_name || ""} onChange={(e) => setDraft({ ...draft, author_name: e.target.value })} className="input-luxury" placeholder="e.g., Aishwarya &amp; Rohan" />
                  </Field>
                  <Field label="Author Role / Location">
                    <input data-testid="content-input-author-role" value={draft.author_role || ""} onChange={(e) => setDraft({ ...draft, author_role: e.target.value })} className="input-luxury" placeholder="e.g., Wedding, Kottayam" />
                  </Field>
                  <Field label="Quote" className="sm:col-span-2">
                    <textarea data-testid="content-input-quote" rows={3} value={draft.quote || ""} onChange={(e) => setDraft({ ...draft, quote: e.target.value })} className="input-luxury resize-none" placeholder="Enter guest review or testimonial..." />
                  </Field>
                </>
              )}

              {draft.kind !== "testimonial" && (
                <Field label="Sort Order">
                  <input data-testid="content-input-order" type="number" value={draft.sort_order || 0} onChange={(e) => setDraft({ ...draft, sort_order: parseInt(e.target.value, 10) || 0 })} className="input-luxury" />
                </Field>
              )}
              
              <div className="sm:col-span-2 space-y-3 pt-2">
                <span className="block text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] mb-1">Placements / Visibility</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-[#111111]/70 p-4 border border-[#D4AF37]/15 rounded-md">
                  <label className="flex items-center gap-2 text-sm text-[#F8F5EE]/70 cursor-pointer select-none">
                    <input data-testid="content-input-hero" type="checkbox" checked={!!draft.is_hero} onChange={(e) => setDraft({ ...draft, is_hero: e.target.checked })} className="accent-[#D4AF37]" />
                    Homepage Hero
                  </label>
                  <label className="flex items-center gap-2 text-sm text-[#F8F5EE]/70 cursor-pointer select-none">
                    <input data-testid="content-input-slider" type="checkbox" checked={!!draft.is_slider} onChange={(e) => setDraft({ ...draft, is_slider: e.target.checked })} className="accent-[#D4AF37]" />
                    Homepage Slider
                  </label>
                  <label className="flex items-center gap-2 text-sm text-[#F8F5EE]/70 cursor-pointer select-none">
                    <input data-testid="content-input-service" type="checkbox" checked={!!draft.is_service} onChange={(e) => setDraft({ ...draft, is_service: e.target.checked })} className="accent-[#D4AF37]" />
                    Services Section
                  </label>
                  <label className="flex items-center gap-2 text-sm text-[#F8F5EE]/70 cursor-pointer select-none">
                    <input data-testid="content-input-gallery" type="checkbox" checked={!!draft.is_gallery} onChange={(e) => setDraft({ ...draft, is_gallery: e.target.checked })} className="accent-[#D4AF37]" />
                    Gallery Section
                  </label>
                  <label className="flex items-center gap-2 text-sm text-[#F8F5EE]/70 cursor-pointer select-none">
                    <input data-testid="content-input-featured" type="checkbox" checked={!!draft.is_featured} onChange={(e) => setDraft({ ...draft, is_featured: e.target.checked })} className="accent-[#D4AF37]" />
                    Featured Projects
                  </label>
                  <label className="flex items-center gap-2 text-sm text-[#F8F5EE]/70 cursor-pointer select-none">
                    <input data-testid="content-input-testimonial" type="checkbox" checked={!!draft.is_testimonial} onChange={(e) => setDraft({ ...draft, is_testimonial: e.target.checked })} className="accent-[#D4AF37]" />
                    Testimonials
                  </label>
                  <label className="flex items-center gap-2 text-sm text-[#F8F5EE]/70 cursor-pointer select-none">
                    <input data-testid="content-input-background" type="checkbox" checked={!!draft.is_background} onChange={(e) => setDraft({ ...draft, is_background: e.target.checked })} className="accent-[#D4AF37]" />
                    Homepage Background
                  </label>
                  <label className="flex items-center gap-2 text-sm text-[#F8F5EE]/70 cursor-pointer select-none col-span-2 sm:col-span-1 pt-2 border-t sm:border-t-0 sm:pt-0 border-[#D4AF37]/10">
                    <input data-testid="content-input-active" type="checkbox" checked={!!draft.is_active} onChange={(e) => setDraft({ ...draft, is_active: e.target.checked })} className="accent-[#D4AF37]" />
                    Active / Visible
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3 border-t border-[#D4AF37]/15 pt-5">
              <button data-testid="content-save" onClick={save} className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-[#111111] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#F8F5EE] transition-all">
                <Save size={14} /> Save Content
              </button>
              <button onClick={cancel} className="px-6 py-3 border border-[#D4AF37]/30 text-[#F8F5EE]/70 text-xs uppercase tracking-[0.2em] hover:border-[#D4AF37] transition-all">
                Cancel
              </button>
            </div>
          </div>

          {/* Right Column: Live Web Preview Panel */}
          <div className="lg:col-span-5 flex flex-col space-y-4 border-l border-[#D4AF37]/15 lg:pl-8">
            <div className="flex justify-between items-center pb-2 border-b border-[#D4AF37]/15">
              <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-bold">Website Live Preview</span>
              <div className="flex bg-[#111111] border border-[#D4AF37]/25 rounded p-0.5">
                <button
                  type="button"
                  onClick={() => setPreviewMode("desktop")}
                  className={`p-1.5 rounded transition-colors ${previewMode === "desktop" ? "bg-[#D4AF37] text-black" : "text-[#F8F5EE]/60 hover:text-white"}`}
                  title="Desktop Preview"
                >
                  <Monitor size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode("mobile")}
                  className={`p-1.5 rounded transition-colors ${previewMode === "mobile" ? "bg-[#D4AF37] text-black" : "text-[#F8F5EE]/60 hover:text-white"}`}
                  title="Mobile Preview"
                >
                  <Smartphone size={14} />
                </button>
              </div>
            </div>

            {/* Preview Frame Wrapper */}
            <div className="flex-1 flex justify-center items-start bg-[#070707] p-4 rounded border border-[#D4AF37]/10 overflow-hidden min-h-[350px]">
              <div
                className={`transition-all duration-300 overflow-hidden relative bg-[#0A0A0A] border border-[#D4AF37]/20 rounded ${
                  previewMode === "mobile" ? "w-[280px] min-h-[420px]" : "w-full min-h-[250px]"
                }`}
              >
                {/* Simulated Web Header inside Frame */}
                <div className="bg-[#0E0E0E] px-3 py-2 border-b border-[#D4AF37]/10 flex justify-between items-center text-[8px] uppercase tracking-wider text-[#D4AF37]">
                  <span>PureFit Customs</span>
                  <span className="text-[6px] text-white/40">Live Preview</span>
                </div>

                {/* Preview Content */}
                <div className="p-4 space-y-4">
                  {draft.kind === "gallery" && (
                    <div className="space-y-2">
                      <div className="text-[8px] text-[#D4AF37] uppercase tracking-widest text-center border-b border-[#D4AF37]/10 pb-1">
                        Homepage Gallery Preview
                      </div>
                      <div className="group relative overflow-hidden rounded border border-[#D4AF37]/10 bg-[#0E0E0E]">
                        <div className="aspect-[4/3] relative">
                          {draft.image_id ? (
                            <img src={buildMediaUrl(draft.image_id)} alt={draft.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[#111] flex items-center justify-center text-[10px] text-white/30">
                              No Image Uploaded
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-3">
                            <span className="text-[8px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
                              {draft.category}
                            </span>
                            <h4 className="font-serif text-sm text-white leading-tight mt-0.5">
                              {draft.title || "Untitled Project"}
                            </h4>
                            <div className="flex justify-between items-center text-[8px] text-white/60 mt-1">
                              <span>Client: {draft.subtitle || "—"} ({draft.bottle_type || "Round PET"})</span>
                              <span>Qty: {draft.quantity || "—"}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-[9px] text-[#F8F5EE]/50 italic text-center px-2">
                        {draft.description || "No description provided."}
                      </p>
                    </div>
                  )}

                  {draft.kind === "hero" && (
                    <div className="space-y-3">
                      <div className="text-[8px] text-[#D4AF37] uppercase tracking-widest text-center border-b border-[#D4AF37]/10 pb-1">
                        Homepage Hero Featured Preview
                      </div>
                      <div className="grid grid-cols-12 gap-3 bg-[#0B3D2E]/10 p-3 border border-[#D4AF37]/15 rounded">
                        <div className="col-span-7 space-y-1.5">
                          <span className="text-[6px] text-[#D4AF37] uppercase tracking-widest block font-bold">
                            Featured Product
                          </span>
                          <h4 className="font-serif text-[11px] leading-tight text-white">
                            {draft.title || "Luxury Custom Bottle"}
                          </h4>
                          <span className="text-[8px] text-white/60 block">
                            {draft.subtitle || "Kerala's Finest Customized Water"}
                          </span>
                        </div>
                        <div className="col-span-5 aspect-[3/4] bg-[#0E0E0E] rounded overflow-hidden border border-[#D4AF37]/20 flex items-center justify-center">
                          {draft.image_id ? (
                            <img src={buildMediaUrl(draft.image_id)} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[6px] text-white/30">Bottle image</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {draft.kind === "testimonial" && (
                    <div className="space-y-2">
                      <div className="text-[8px] text-[#D4AF37] uppercase tracking-widest text-center border-b border-[#D4AF37]/10 pb-1">
                        Homepage Review Card Preview
                      </div>
                      <div className="bg-[#111] p-3 rounded border border-[#D4AF37]/15 relative">
                        <span className="font-serif text-[#D4AF37] text-2xl absolute top-1 left-2 leading-none">“</span>
                        <p className="text-[9px] italic text-[#F8F5EE]/80 pt-2 pb-1 pl-4 pr-2">
                          {draft.quote || "Enter quote text to see it rendered here."}
                        </p>
                        <div className="border-t border-[#D4AF37]/10 pt-2 mt-2 flex justify-between items-center text-[8px]">
                          <span className="font-semibold text-white">{draft.author_name || "Client Name"}</span>
                          <span className="text-[#D4AF37]">{draft.author_role || "Wedding, Kochi"}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Cards Grid */}
      {loading ? <Loading /> : filtered.length === 0 ? (
        <Empty label={`No ${KINDS.find((k) => k.value === filter)?.label.toLowerCase()} yet. Add one to override defaults.`} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            // Determine image badges
            const badges = [];
            if (!item.is_active) {
              badges.push({ text: "Inactive", style: "bg-red-950/80 text-red-300 border border-red-500/40" });
            } else {
              if (item.is_hero || item.kind === "hero") badges.push({ text: "Hero", style: "bg-amber-950/80 text-amber-300 border border-amber-500/40" });
              if (item.is_slider) badges.push({ text: "Slider", style: "bg-blue-950/80 text-blue-300 border border-blue-500/40" });
              if (item.is_service) badges.push({ text: "Services", style: "bg-purple-950/80 text-purple-300 border border-purple-500/40" });
              if (item.is_gallery) badges.push({ text: "Gallery", style: "bg-neutral-900/80 text-neutral-300 border border-neutral-700/50" });
              if (item.is_featured) badges.push({ text: "Featured", style: "bg-emerald-950/80 text-emerald-300 border border-[#D4AF37]" });
              if (item.is_testimonial) badges.push({ text: "Testimonial", style: "bg-teal-950/80 text-teal-300 border border-teal-500/40" });
              if (item.is_background) badges.push({ text: "Background", style: "bg-rose-950/80 text-rose-300 border border-rose-500/40" });
            }
            if (badges.length === 0) {
              badges.push({ text: "Active", style: "bg-neutral-900/80 text-neutral-300 border border-neutral-700/50" });
            }

            return (
              <div key={item.id} data-testid={`content-item-${item.id}`} className="group glass-dark rounded-md overflow-hidden border border-[#D4AF37]/10 flex flex-col justify-between">
                <div>
                  <div className="aspect-[4/3] bg-[#0E0E0E] relative border-b border-[#D4AF37]/10">
                    {item.image_id ? (
                      <img src={buildMediaUrl(item.image_id)} alt={item.title || item.author_name} className="w-full h-full object-cover" />
                    ) : item.kind === "testimonial" ? (
                      <div className="p-6 flex items-center justify-center h-full text-center">
                        <p className="font-serif italic text-[#F8F5EE]/80 line-clamp-5">&ldquo;{item.quote}&rdquo;</p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-[#F8F5EE]/30 text-xs">No image</div>
                    )}
                    
                    {/* Status Badges */}
                    <div className="absolute top-2 left-2 flex flex-wrap gap-1 max-w-[90%]">
                      {badges.map((b, bi) => (
                        <div key={bi} className={`px-1.5 py-0.5 text-[8px] uppercase tracking-wider font-semibold rounded ${b.style}`}>
                          {b.text}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-4 text-sm space-y-2">
                    {item.kind === "testimonial" ? (
                      <>
                        <div className="font-serif text-white">{item.author_name}</div>
                        <div className="text-[10px] uppercase tracking-wider text-[#D4AF37]">{item.author_role}</div>
                      </>
                    ) : (
                      <>
                        <div className="font-serif text-white truncate text-base">{item.title || "Untitled"}</div>
                        <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-[#D4AF37]">
                          <span>{item.category} • {item.bottle_type || "Round PET"}</span>
                          {item.quantity && <span className="text-white/60">Qty: {item.quantity}</span>}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="mt-3 flex gap-1 border-t border-[#D4AF37]/10 pt-3">
                    <button data-testid={`content-toggle-active-${item.id}`} onClick={() => toggle(item, "is_active")} className="flex-1 py-2 text-[10px] uppercase tracking-wide border border-[#D4AF37]/30 text-[#F8F5EE]/70 hover:border-[#D4AF37]" title={item.is_active ? "Hide" : "Show"}>
                      {item.is_active ? <Eye size={12} className="mx-auto" /> : <EyeOff size={12} className="mx-auto" />}
                    </button>
                    {item.kind === "gallery" && (
                      <>
                        <button data-testid={`content-toggle-featured-${item.id}`} onClick={() => toggle(item, "is_featured")} className={`flex-1 py-2 text-[10px] uppercase tracking-wide border ${item.is_featured ? "bg-[#D4AF37] border-[#D4AF37] text-[#111111]" : "border-[#D4AF37]/30 text-[#F8F5EE]/70 hover:border-[#D4AF37]"}`} title="Toggle Feature in Categories">
                          <Star size={12} className="mx-auto" />
                        </button>
                        <button data-testid={`content-toggle-hero-${item.id}`} onClick={() => toggle(item, "is_hero")} className={`flex-1 py-2 text-[10px] uppercase tracking-wide border ${item.is_hero ? "bg-[#D4AF37] border-[#D4AF37] text-[#111111]" : "border-[#D4AF37]/30 text-[#F8F5EE]/70 hover:border-[#D4AF37]"}`} title="Toggle Hero Carousel">
                          <Sparkles size={12} className="mx-auto" />
                        </button>
                      </>
                    )}
                    <button data-testid={`content-edit-${item.id}`} onClick={() => startEdit(item)} className="flex-2 px-3 py-2 text-[10px] uppercase tracking-wide border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#111111]">
                      Edit
                    </button>
                    <button data-testid={`content-delete-${item.id}`} onClick={() => remove(item.id)} className="py-2 px-2 text-[10px] uppercase tracking-wide border border-red-500/30 text-red-300 hover:bg-red-500 hover:text-white">
                      <Trash2 size={12} className="mx-auto" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <FormStyles />
    </div>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] mb-2">{label}</span>
      {children}
    </label>
  );
}

export function FormStyles() {
  return (
    <style>{`
      .input-luxury {
        width: 100%;
        background: rgba(17,17,17,0.6);
        border: 1px solid rgba(212,175,55,0.18);
        color: #F8F5EE;
        padding: 0.7rem 0.9rem;
        font-size: 0.9rem;
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
    `}</style>
  );
}
