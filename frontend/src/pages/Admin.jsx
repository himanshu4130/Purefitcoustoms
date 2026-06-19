import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Mail, Phone, Calendar, Package, FileText } from "lucide-react";
import { api } from "@/lib/api";

export default function Admin() {
  const [tab, setTab] = useState("quotes");
  const [quotes, setQuotes] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [q, m] = await Promise.all([api.get("/quotes"), api.get("/contact")]);
        setQuotes(q.data);
        setMessages(m.data);
      } catch (e) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <main data-testid="admin-page" className="bg-[#111111] pt-28 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-px bg-[#D4AF37]" />
            <span className="text-[#D4AF37] uppercase text-xs tracking-[0.35em]">Internal Dashboard</span>
          </div>
          <h1 className="font-serif text-5xl text-white">Admin Panel</h1>
          <p className="mt-3 text-[#F8F5EE]/60">Quote requests & contact messages.</p>
        </div>

        <div className="flex gap-2 mb-8 border-b border-[#D4AF37]/15">
          <TabBtn active={tab === "quotes"} onClick={() => setTab("quotes")} testid="admin-tab-quotes">
            Quote Requests ({quotes.length})
          </TabBtn>
          <TabBtn active={tab === "messages"} onClick={() => setTab("messages")} testid="admin-tab-messages">
            Messages ({messages.length})
          </TabBtn>
        </div>

        {loading ? (
          <div className="text-[#F8F5EE]/60">Loading...</div>
        ) : tab === "quotes" ? (
          <div className="space-y-4">
            {quotes.length === 0 && <Empty label="No quote requests yet." />}
            {quotes.map((q) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                data-testid={`admin-quote-${q.id}`}
                className="glass-dark p-6 rounded-md grid lg:grid-cols-12 gap-4"
              >
                <div className="lg:col-span-3">
                  <div className="font-serif text-xl text-white">{q.name}</div>
                  <div className="text-xs text-[#F8F5EE]/50 mt-1">{new Date(q.created_at).toLocaleString()}</div>
                  <div className="mt-3 text-[10px] uppercase tracking-wide inline-block px-2 py-1 border border-[#D4AF37]/40 text-[#D4AF37]">{q.status}</div>
                </div>
                <div className="lg:col-span-4 space-y-1.5 text-sm text-[#F8F5EE]/80">
                  <div className="flex items-center gap-2"><Phone size={14} className="text-[#D4AF37]" /> {q.phone}</div>
                  <div className="flex items-center gap-2"><Mail size={14} className="text-[#D4AF37]" /> {q.email}</div>
                  <div className="flex items-center gap-2"><Calendar size={14} className="text-[#D4AF37]" /> {q.event_date || "—"}</div>
                </div>
                <div className="lg:col-span-3 space-y-1.5 text-sm text-[#F8F5EE]/80">
                  <div><span className="text-[#D4AF37]">Event:</span> {q.event_type}</div>
                  <div className="flex items-center gap-2"><Package size={14} className="text-[#D4AF37]" /> {q.bottle_size} · {q.quantity}</div>
                  <div className="flex gap-2 text-xs">
                    {q.has_logo && <span className="px-2 py-0.5 border border-[#D4AF37]/40 text-[#D4AF37]">Logo</span>}
                    {q.has_photo && <span className="px-2 py-0.5 border border-[#D4AF37]/40 text-[#D4AF37]">Photo</span>}
                  </div>
                </div>
                <div className="lg:col-span-2 text-sm text-[#F8F5EE]/70 text-right">
                  {q.additional_requirements ? (
                    <div className="flex items-start gap-2 text-left">
                      <FileText size={14} className="text-[#D4AF37] mt-1 shrink-0" />
                      <p className="line-clamp-3 text-xs">{q.additional_requirements}</p>
                    </div>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {messages.length === 0 && <Empty label="No messages yet." />}
            {messages.map((m) => (
              <div key={m.id} data-testid={`admin-message-${m.id}`} className="glass-dark p-6 rounded-md">
                <div className="flex justify-between gap-4 flex-wrap mb-3">
                  <div>
                    <div className="font-serif text-xl text-white">{m.name}</div>
                    <div className="text-xs text-[#F8F5EE]/50">{m.email} · {m.phone || "—"}</div>
                  </div>
                  <div className="text-xs text-[#F8F5EE]/50">{new Date(m.created_at).toLocaleString()}</div>
                </div>
                <div className="text-xs uppercase tracking-wider text-[#D4AF37] mb-2">{m.subject}</div>
                <p className="text-[#F8F5EE]/80 text-sm leading-relaxed">{m.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function TabBtn({ active, onClick, children, testid }) {
  return (
    <button
      data-testid={testid}
      onClick={onClick}
      className={`px-6 py-3 text-xs uppercase tracking-[0.2em] border-b-2 transition-colors ${
        active ? "border-[#D4AF37] text-[#D4AF37]" : "border-transparent text-[#F8F5EE]/60 hover:text-[#F8F5EE]"
      }`}
    >
      {children}
    </button>
  );
}

function Empty({ label }) {
  return <div className="text-center py-16 text-[#F8F5EE]/40">{label}</div>;
}
