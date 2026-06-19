import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Upload, Trash2, Copy, CheckCircle2 } from "lucide-react";
import { api, buildMediaUrl } from "@/lib/api";
import { PanelHeader, Empty, Loading } from "@/pages/admin/QuotesPanel";

export default function MediaPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const fileRef = useRef(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/media");
      setItems(data);
    } catch { toast.error("Failed to load media"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const onUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        await api.post("/admin/media", fd, { headers: { "Content-Type": "multipart/form-data" } });
      }
      toast.success(`${files.length} image(s) uploaded`);
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this image? Items using it will show a broken image.")) return;
    try {
      await api.delete(`/admin/media/${id}`);
      setItems((m) => m.filter((x) => x.id !== id));
      toast.success("Image deleted");
    } catch { toast.error("Delete failed"); }
  };

  const copyId = async (id) => {
    try { await navigator.clipboard.writeText(id); } catch (_e) { /* clipboard may be unavailable */ }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div data-testid="admin-media-panel">
      <PanelHeader
        title="Media Library"
        subtitle="Upload JPG, PNG, WEBP, SVG or GIF (max 10MB). Copy ID to use anywhere."
        action={
          <label className={`inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-[#111111] text-xs uppercase tracking-[0.2em] cursor-pointer hover:bg-[#F8F5EE] ${uploading ? "opacity-60 pointer-events-none" : ""}`} data-testid="admin-media-upload-label">
            <Upload size={14} />
            {uploading ? "Uploading…" : "Upload Images"}
            <input ref={fileRef} data-testid="admin-media-upload-input" type="file" accept="image/*" multiple className="hidden" onChange={onUpload} />
          </label>
        }
      />

      {loading ? <Loading /> : items.length === 0 ? <Empty label="No media uploaded yet." /> : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((m) => (
            <div key={m.id} data-testid={`media-item-${m.id}`} className="group relative border border-[#D4AF37]/15 rounded-md overflow-hidden bg-[#0E0E0E]">
              <div className="aspect-square">
                <img src={buildMediaUrl(m.id)} alt={m.original_filename} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-3 text-xs">
                <div className="text-[#F8F5EE]/80 truncate" title={m.original_filename}>{m.original_filename}</div>
                <div className="text-[10px] text-[#F8F5EE]/40 mt-0.5">{(m.size / 1024).toFixed(1)} KB</div>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  data-testid={`media-copy-${m.id}`}
                  onClick={() => copyId(m.id)}
                  className="w-8 h-8 flex items-center justify-center bg-[#111111]/90 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#111111]"
                  title="Copy image ID"
                >
                  {copiedId === m.id ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                </button>
                <button
                  data-testid={`media-delete-${m.id}`}
                  onClick={() => remove(m.id)}
                  className="w-8 h-8 flex items-center justify-center bg-[#111111]/90 border border-red-500/40 text-red-300 hover:bg-red-500 hover:text-white"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
