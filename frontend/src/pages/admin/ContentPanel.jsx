import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Star, Eye, EyeOff, Save, X } from "lucide-react";
import { api, buildMediaUrl } from "@/lib/api";
import { PanelHeader, Empty, Loading } from "@/pages/admin/QuotesPanel";

const CATEGORIES = ["Weddings", "Corporate", "Religious Events", "Restaurants", "Catering", "Housewarming", "Funeral", "Holy Communion", "Political"];
const KINDS = [
  { value: "gallery", label: "Gallery Item" },
  { value: "hero", label: "Hero Featured Bottle" },
  { value: "testimonial", label: "Testimonial" },
];

const blank = (kind = "gallery") => ({
  kind,
  category: "Weddings",
  title: "",
  subtitle: "",
  image_id: "",
  quote: "",
  author_name: "",
  author_role: "",
  is_featured: false,
  is_active: true,
  sort_order: 0,
});

export default function ContentPanel() {
  const [items, setItems] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("gallery");
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(blank());

  const load = async () => {
    setLoading(true);
    try {
      const [a, b] = await Promise.all([api.get("/admin/site-content"), api.get("/admin/media")]);
      setItems(a.data);
      setMedia(b.data);
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
        toast.success("Created");
      } else {
        await api.patch(`/admin/site-content/${editing}`, draft);
        toast.success("Updated");
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
    } catch { toast.error("Update failed"); }
  };

  const filtered = items.filter((i) => i.kind === filter);

  return (
    <div data-testid="admin-content-panel">
      <PanelHeader
        title="Site Content"
        subtitle="Manage gallery items, hero featured bottles, and testimonials displayed on the homepage."
        action={
          <button
            data-testid="admin-content-add"
            onClick={() => startCreate(filter)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-[#111111] text-xs uppercase tracking-[0.2em] hover:bg-[#F8F5EE]"
          >
            <Plus size={14} /> Add {KINDS.find((k) => k.value === filter)?.label || "Item"}
          </button>
        }
      />

      {/* Kind filter */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-[#D4AF37]/15 pb-4">
        {KINDS.map((k) => (
          <button
            key={k.value}
            data-testid={`content-filter-${k.value}`}
            onClick={() => setFilter(k.value)}
            className={`px-5 py-2 text-xs uppercase tracking-[0.2em] border transition-colors ${
              filter === k.value ? "bg-[#D4AF37] border-[#D4AF37] text-[#111111]" : "border-[#D4AF37]/30 text-[#F8F5EE]/70 hover:border-[#D4AF37]"
            }`}
          >
            {k.label} ({items.filter((i) => i.kind === k.value).length})
          </button>
        ))}
      </div>

      {/* Editor */}
      {editing && (
        <div data-testid="admin-content-editor" className="glass-dark p-6 lg:p-8 rounded-md mb-6 border border-[#D4AF37]/30">
          <div className="flex justify-between mb-6">
            <h3 className="font-serif text-2xl text-white">
              {editing === "new" ? "New" : "Edit"} {KINDS.find((k) => k.value === draft.kind)?.label}
            </h3>
            <button onClick={cancel} className="text-[#F8F5EE]/60 hover:text-white"><X size={20} /></button>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {(draft.kind === "gallery" || draft.kind === "hero") && (
              <>
                <Field label="Title">
                  <input data-testid="content-input-title" value={draft.title || ""} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="input-luxury" placeholder="e.g., Bride &amp; Groom Edition" />
                </Field>
                <Field label="Subtitle / Tag">
                  <input data-testid="content-input-subtitle" value={draft.subtitle || ""} onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })} className="input-luxury" placeholder="e.g., Wedding Edition" />
                </Field>
                <Field label="Category">
                  <select data-testid="content-input-category" value={draft.category || ""} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className="input-luxury">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Image">
                  <ImagePicker
                    media={media}
                    value={draft.image_id}
                    onChange={(id) => setDraft({ ...draft, image_id: id })}
                  />
                </Field>
              </>
            )}

            {draft.kind === "testimonial" && (
              <>
                <Field label="Author Name">
                  <input data-testid="content-input-author-name" value={draft.author_name || ""} onChange={(e) => setDraft({ ...draft, author_name: e.target.value })} className="input-luxury" placeholder="e.g., Aishwarya &amp; Rohan" />
                </Field>
                <Field label="Author Role / Location">
                  <input data-testid="content-input-author-role" value={draft.author_role || ""} onChange={(e) => setDraft({ ...draft, author_role: e.target.value })} className="input-luxury" placeholder="e.g., Wedding, Kottayam" />
                </Field>
                <Field label="Quote" className="sm:col-span-2">
                  <textarea data-testid="content-input-quote" rows={3} value={draft.quote || ""} onChange={(e) => setDraft({ ...draft, quote: e.target.value })} className="input-luxury resize-none" />
                </Field>
              </>
            )}

            <Field label="Sort Order">
              <input data-testid="content-input-order" type="number" value={draft.sort_order || 0} onChange={(e) => setDraft({ ...draft, sort_order: parseInt(e.target.value, 10) || 0 })} className="input-luxury" />
            </Field>
            <div className="flex flex-wrap items-end gap-4">
              <label className="flex items-center gap-2 text-sm text-[#F8F5EE]/70 cursor-pointer">
                <input data-testid="content-input-featured" type="checkbox" checked={!!draft.is_featured} onChange={(e) => setDraft({ ...draft, is_featured: e.target.checked })} className="accent-[#D4AF37]" />
                Featured on homepage
              </label>
              <label className="flex items-center gap-2 text-sm text-[#F8F5EE]/70 cursor-pointer">
                <input data-testid="content-input-active" type="checkbox" checked={!!draft.is_active} onChange={(e) => setDraft({ ...draft, is_active: e.target.checked })} className="accent-[#D4AF37]" />
                Active
              </label>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button data-testid="content-save" onClick={save} className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-[#111111] text-xs uppercase tracking-[0.2em] hover:bg-[#F8F5EE]">
              <Save size={14} /> Save
            </button>
            <button onClick={cancel} className="px-6 py-3 border border-[#D4AF37]/30 text-[#F8F5EE]/70 text-xs uppercase tracking-[0.2em] hover:border-[#D4AF37]">
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? <Loading /> : filtered.length === 0 ? (
        <Empty label={`No ${KINDS.find((k) => k.value === filter)?.label.toLowerCase()} yet. Add one to override defaults.`} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div key={item.id} data-testid={`content-item-${item.id}`} className="group glass-dark rounded-md overflow-hidden">
              <div className="aspect-[4/3] bg-[#0E0E0E] relative">
                {item.image_id ? (
                  <img src={buildMediaUrl(item.image_id)} alt={item.title || item.author_name} className="w-full h-full object-cover" />
                ) : item.kind === "testimonial" ? (
                  <div className="p-6 flex items-center justify-center h-full text-center">
                    <p className="font-serif italic text-[#F8F5EE]/80 line-clamp-5">&ldquo;{item.quote}&rdquo;</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-[#F8F5EE]/30 text-xs">No image</div>
                )}
                {item.is_featured && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#D4AF37] text-[#111111] text-[10px] uppercase tracking-wide flex items-center gap-1">
                    <Star size={10} /> Featured
                  </div>
                )}
                {!item.is_active && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[#D4AF37] text-xs uppercase tracking-[0.3em]">Hidden</div>
                )}
              </div>
              <div className="p-4 text-sm">
                {item.kind === "testimonial" ? (
                  <>
                    <div className="font-serif text-white">{item.author_name}</div>
                    <div className="text-[10px] uppercase tracking-wider text-[#D4AF37]">{item.author_role}</div>
                  </>
                ) : (
                  <>
                    <div className="font-serif text-white truncate">{item.title || "Untitled"}</div>
                    <div className="text-[10px] uppercase tracking-wider text-[#D4AF37]">{item.subtitle || item.category}</div>
                  </>
                )}
                <div className="mt-3 flex gap-1">
                  <button data-testid={`content-toggle-active-${item.id}`} onClick={() => toggle(item, "is_active")} className="flex-1 py-1.5 text-[10px] uppercase tracking-wide border border-[#D4AF37]/30 text-[#F8F5EE]/70 hover:border-[#D4AF37]">
                    {item.is_active ? <Eye size={12} className="inline" /> : <EyeOff size={12} className="inline" />}
                  </button>
                  <button data-testid={`content-toggle-featured-${item.id}`} onClick={() => toggle(item, "is_featured")} className={`flex-1 py-1.5 text-[10px] uppercase tracking-wide border ${item.is_featured ? "bg-[#D4AF37] border-[#D4AF37] text-[#111111]" : "border-[#D4AF37]/30 text-[#F8F5EE]/70 hover:border-[#D4AF37]"}`}>
                    <Star size={12} className="inline" />
                  </button>
                  <button data-testid={`content-edit-${item.id}`} onClick={() => startEdit(item)} className="flex-1 py-1.5 text-[10px] uppercase tracking-wide border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#111111]">
                    Edit
                  </button>
                  <button data-testid={`content-delete-${item.id}`} onClick={() => remove(item.id)} className="py-1.5 px-2 text-[10px] uppercase tracking-wide border border-red-500/30 text-red-300 hover:bg-red-500 hover:text-white">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
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

function ImagePicker({ media, value, onChange }) {
  const [open, setOpen] = useState(false);
  const selected = media.find((m) => m.id === value);
  return (
    <div className="space-y-2">
      <button type="button" onClick={() => setOpen((o) => !o)} className="input-luxury text-left flex items-center gap-3" data-testid="content-image-picker-toggle">
        {selected ? (
          <>
            <img src={buildMediaUrl(selected.id)} alt="" className="w-10 h-10 object-cover rounded" />
            <span className="text-sm truncate flex-1">{selected.original_filename}</span>
          </>
        ) : (
          <span className="text-[#F8F5EE]/40 text-sm">Choose image from library…</span>
        )}
      </button>
      {open && (
        <div className="max-h-60 overflow-y-auto border border-[#D4AF37]/20 rounded-md p-2 grid grid-cols-4 gap-2 bg-[#0A0A0A]">
          {media.length === 0 && <div className="col-span-4 text-center text-xs text-[#F8F5EE]/40 py-6">Upload images in Media Library first.</div>}
          {media.map((m) => (
            <button
              key={m.id}
              type="button"
              data-testid={`image-picker-${m.id}`}
              onClick={() => { onChange(m.id); setOpen(false); }}
              className={`aspect-square overflow-hidden rounded border-2 transition-colors ${value === m.id ? "border-[#D4AF37]" : "border-transparent hover:border-[#D4AF37]/40"}`}
            >
              <img src={buildMediaUrl(m.id)} alt={m.original_filename} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
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
