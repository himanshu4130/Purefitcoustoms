import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Mail, Phone, Calendar, Package, FileText, Image as ImageIcon } from "lucide-react";
import { api, buildMediaUrl } from "@/lib/api";

export default function QuotesPanel() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [detail, setDetail] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/quotes");
      setQuotes(data);
    } catch {
      toast.error("Failed to load quotes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const open = async (id) => {
    if (expanded === id) { setExpanded(null); return; }
    setExpanded(id);
    if (!detail[id]) {
      try {
        const { data } = await api.get(`/admin/quotes/${id}`);
        setDetail((d) => ({ ...d, [id]: data }));
      } catch { toast.error("Failed to load details"); }
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/quotes/${id}`, { status });
      setQuotes((q) => q.map((x) => x.id === id ? { ...x, status } : x));
      toast.success(`Marked as ${status}`);
    } catch { toast.error("Update failed"); }
  };

  return (
    <div data-testid="admin-quotes-panel">
      <PanelHeader title="Quote Requests" subtitle={`${quotes.length} total · newest first`} />
      {loading ? <Loading /> : quotes.length === 0 ? <Empty label="No quote requests yet." /> : (
        <div className="space-y-3">
          {quotes.map((q) => (
            <div key={q.id} data-testid={`admin-quote-${q.id}`} className="glass-dark rounded-md overflow-hidden">
              <button onClick={() => open(q.id)} className="w-full text-left p-5 lg:p-6 grid lg:grid-cols-12 gap-4 hover:bg-[#0B3D2E]/20 transition-colors">
                <div className="lg:col-span-3">
                  <div className="font-serif text-xl text-white">{q.name}</div>
                  <div className="text-[10px] text-[#F8F5EE]/50 mt-1">{new Date(q.created_at).toLocaleString()}</div>
                  <StatusBadge status={q.status} />
                </div>
                <div className="lg:col-span-4 space-y-1 text-sm text-[#F8F5EE]/80">
                  <div className="flex items-center gap-2"><Phone size={13} className="text-[#D4AF37]" /> {q.phone}</div>
                  <div className="flex items-center gap-2"><Mail size={13} className="text-[#D4AF37]" /> {q.email}</div>
                  <div className="flex items-center gap-2"><Calendar size={13} className="text-[#D4AF37]" /> {q.event_date || "—"}</div>
                </div>
                <div className="lg:col-span-3 space-y-1 text-sm text-[#F8F5EE]/80">
                  <div><span className="text-[#D4AF37]">Event:</span> {q.event_type}</div>
                  <div className="flex items-center gap-2"><Package size={13} className="text-[#D4AF37]" /> {q.bottle_size} · {q.quantity}</div>
                  <div className="flex gap-2 text-[10px] uppercase">
                    {q.has_logo && <span className="px-2 py-0.5 border border-[#D4AF37]/40 text-[#D4AF37]">Logo</span>}
                    {q.has_photo && <span className="px-2 py-0.5 border border-[#D4AF37]/40 text-[#D4AF37]">Photo</span>}
                  </div>
                </div>
                <div className="lg:col-span-2 text-xs text-[#F8F5EE]/60">
                  {q.additional_requirements ? (
                    <div className="flex items-start gap-2"><FileText size={13} className="text-[#D4AF37] mt-0.5 shrink-0" /><span className="line-clamp-3">{q.additional_requirements}</span></div>
                  ) : null}
                </div>
              </button>

              {expanded === q.id && detail[q.id] && (
                <div className="px-6 pb-6 pt-2 border-t border-[#D4AF37]/15">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <Asset title="Logo" data={detail[q.id].logo_data} filename={detail[q.id].logo_filename} />
                    <Asset title="Photo" data={detail[q.id].photo_data} filename={detail[q.id].photo_filename} />
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {["new", "contacted", "quoted", "won", "lost"].map((s) => (
                      <button
                        key={s}
                        data-testid={`quote-status-${s}-${q.id}`}
                        onClick={() => updateStatus(q.id, s)}
                        className={`px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] border transition-colors ${
                          q.status === s ? "bg-[#D4AF37] border-[#D4AF37] text-[#111111]" : "border-[#D4AF37]/30 text-[#F8F5EE]/70 hover:border-[#D4AF37]"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                    <a
                      href={`mailto:${detail[q.id].email}`}
                      className="ml-auto px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#111111]"
                    >Reply Email</a>
                    <a
                      href={`https://wa.me/${detail[q.id].phone.replace(/[^\d]/g, "")}`}
                      target="_blank" rel="noopener noreferrer"
                      className="px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#111111]"
                    >WhatsApp</a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    new: "border-blue-400/50 text-blue-300",
    contacted: "border-amber-400/50 text-amber-300",
    quoted: "border-purple-400/50 text-purple-300",
    won: "border-emerald-400/50 text-emerald-300",
    lost: "border-red-400/50 text-red-300",
  };
  return <div className={`mt-3 text-[10px] uppercase tracking-wide inline-block px-2 py-1 border ${colors[status] || colors.new}`}>{status}</div>;
}

function Asset({ title, data, filename }) {
  if (!data) return (
    <div className="p-4 border border-[#D4AF37]/15 rounded-md text-[#F8F5EE]/40 text-xs flex items-center gap-2">
      <ImageIcon size={14} /> {title} not uploaded
    </div>
  );
  const isImage = data.startsWith("data:image");
  return (
    <div className="p-4 border border-[#D4AF37]/15 rounded-md">
      <div className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] mb-3">{title}</div>
      {isImage ? (
        <img src={data} alt={filename || title} className="max-h-48 rounded-md border border-[#D4AF37]/15" />
      ) : (
        <a href={data} download={filename} className="text-[#D4AF37] underline text-sm">{filename || "Download"}</a>
      )}
      <div className="text-[10px] text-[#F8F5EE]/40 mt-2 truncate">{filename}</div>
    </div>
  );
}

export function PanelHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-px bg-[#D4AF37]" />
          <span className="text-[#D4AF37] uppercase text-[10px] tracking-[0.35em]">Admin</span>
        </div>
        <h1 className="font-serif text-4xl text-white">{title}</h1>
        {subtitle && <p className="text-sm text-[#F8F5EE]/60 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Empty({ label }) {
  return <div data-testid="admin-empty" className="text-center py-20 text-[#F8F5EE]/40 border border-dashed border-[#D4AF37]/15 rounded-md">{label}</div>;
}

export function Loading() {
  return <div className="text-center py-20 text-[#F8F5EE]/40">Loading…</div>;
}
