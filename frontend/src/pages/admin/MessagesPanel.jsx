import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { PanelHeader, Empty, Loading } from "@/pages/admin/QuotesPanel";

export default function MessagesPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/admin/messages");
        setItems(data);
      } catch { toast.error("Failed to load messages"); }
      finally { setLoading(false); }
    })();
  }, []);

  return (
    <div data-testid="admin-messages-panel">
      <PanelHeader title="Contact Messages" subtitle={`${items.length} total`} />
      {loading ? <Loading /> : items.length === 0 ? <Empty label="No messages yet." /> : (
        <div className="space-y-3">
          {items.map((m) => (
            <div key={m.id} data-testid={`admin-message-${m.id}`} className="glass-dark p-6 rounded-md">
              <div className="flex justify-between gap-4 flex-wrap mb-3">
                <div>
                  <div className="font-serif text-xl text-white">{m.name}</div>
                  <div className="text-xs text-[#F8F5EE]/50">{m.email} · {m.phone || "—"}</div>
                </div>
                <div className="text-xs text-[#F8F5EE]/50">{new Date(m.created_at).toLocaleString()}</div>
              </div>
              <div className="text-xs uppercase tracking-wider text-[#D4AF37] mb-2">{m.subject}</div>
              <p className="text-[#F8F5EE]/80 text-sm leading-relaxed whitespace-pre-wrap">{m.message}</p>
              <a
                href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || "Your inquiry")}`}
                className="mt-4 inline-block px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#111111]"
              >Reply</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
