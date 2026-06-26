import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  FileText,
  MessageSquare,
  Images,
  FolderKanban,
  Star,
  CupSoda,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { api } from "@/lib/api";
import { PanelHeader, Loading } from "@/pages/admin/QuotesPanel";

export default function DashboardPanel() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    featuredProjects: 0,
    heroBottles: 0,
    messages: 0,
    quotes: 0,
    media: 0,
  });
  const [recentQuotes, setRecentQuotes] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [quotesRes, mediaRes, contentRes, messagesRes] = await Promise.all([
          api.get("/admin/quotes"),
          api.get("/admin/media"),
          api.get("/admin/site-content"),
          api.get("/admin/messages"),
        ]);

        const content = contentRes.data || [];
        const quotes = quotesRes.data || [];
        const messages = messagesRes.data || [];
        const media = mediaRes.data || [];

        setStats({
          totalProjects: content.filter((i) => i.kind === "gallery").length,
          featuredProjects: content.filter((i) => i.kind === "gallery" && i.is_featured).length,
          heroBottles: content.filter((i) => i.kind === "hero").length,
          messages: messages.length,
          quotes: quotes.length,
          media: media.length,
        });

        setRecentQuotes(quotes.slice(0, 3));
        setRecentMessages(messages.slice(0, 3));
      } catch (err) {
        toast.error("Failed to load dashboard metrics");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loading />;

  const CARDS = [
    {
      title: "Total Projects",
      count: stats.totalProjects,
      desc: "Items in your portfolio gallery",
      icon: FolderKanban,
      color: "border-[#D4AF37]/35 hover:border-[#D4AF37]",
      link: "/admin/content",
    },
    {
      title: "Featured Projects",
      count: stats.featuredProjects,
      desc: "Starred homepage project items",
      icon: Star,
      color: "border-emerald-600/35 hover:border-emerald-500",
      link: "/admin/content",
    },
    {
      title: "Hero Bottles",
      count: stats.heroBottles,
      desc: "Floating bottles in main banner",
      icon: CupSoda,
      color: "border-amber-600/35 hover:border-amber-500",
      link: "/admin/content",
    },
    {
      title: "Quote Requests",
      count: stats.quotes,
      desc: "Inquiries submitted by customers",
      icon: FileText,
      color: "border-blue-600/35 hover:border-blue-500",
      link: "/admin/quotes",
    },
    {
      title: "Messages",
      count: stats.messages,
      desc: "Contact form general submissions",
      icon: MessageSquare,
      color: "border-purple-600/35 hover:border-purple-500",
      link: "/admin/messages",
    },
    {
      title: "Media Files",
      count: stats.media,
      desc: "Images uploaded to server storage",
      icon: Images,
      color: "border-teal-600/35 hover:border-teal-500",
      link: "/admin/media",
    },
  ];

  return (
    <div data-testid="admin-dashboard-panel" className="space-y-8">
      <PanelHeader
        title="Dashboard"
        subtitle="Quick overview of your customized bottle request pipeline and brand assets."
      />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CARDS.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.title}
              to={c.link}
              className={`glass-dark border p-6 rounded-md flex justify-between items-start group transition-all duration-300 ${c.color}`}
            >
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider text-[#F8F5EE]/50 block">{c.title}</span>
                <span className="text-4xl font-bold font-serif text-white block">{c.count}</span>
                <span className="text-xs text-[#F8F5EE]/40 block">{c.desc}</span>
              </div>
              <div className="p-3 bg-[#0A0A0A] border border-[#D4AF37]/15 rounded group-hover:bg-[#0B3D2E] group-hover:border-[#D4AF37]/50 transition-colors">
                <Icon size={20} className="text-[#D4AF37]" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent submissions split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent quotes */}
        <div className="glass-dark border border-[#D4AF37]/15 rounded-md p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#D4AF37]/15">
            <h3 className="font-serif text-lg text-white flex items-center gap-2">
              <TrendingUp size={16} className="text-[#D4AF37]" />
              Recent Quote Requests
            </h3>
            <Link to="/admin/quotes" className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1">
              View All <ChevronRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentQuotes.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#F8F5EE]/40">No quotes received yet.</div>
            ) : (
              recentQuotes.map((q) => (
                <div key={q.id} className="p-3 border border-[#D4AF37]/10 bg-[#0A0A0A]/40 rounded flex justify-between items-center text-xs">
                  <div>
                    <div className="font-serif text-white text-sm">{q.name}</div>
                    <div className="text-[#F8F5EE]/50 mt-0.5">{q.event_type} · {q.bottle_size}</div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 bg-[#0B3D2E] text-[#D4AF37] border border-[#D4AF37]/20 uppercase text-[9px] tracking-wider rounded">
                      {q.status}
                    </span>
                    <div className="text-[10px] text-[#F8F5EE]/30 mt-1">{new Date(q.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent messages */}
        <div className="glass-dark border border-[#D4AF37]/15 rounded-md p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#D4AF37]/15">
            <h3 className="font-serif text-lg text-white flex items-center gap-2">
              <MessageSquare size={16} className="text-[#D4AF37]" />
              Recent Messages
            </h3>
            <Link to="/admin/messages" className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1">
              View All <ChevronRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentMessages.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#F8F5EE]/40">No messages received yet.</div>
            ) : (
              recentMessages.map((m) => (
                <div key={m.id} className="p-3 border border-[#D4AF37]/10 bg-[#0A0A0A]/40 rounded text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-serif text-white text-sm">{m.name}</span>
                    <span className="text-[10px] text-[#F8F5EE]/30">{new Date(m.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="text-[#D4AF37] text-[10px] uppercase tracking-wider">{m.subject}</div>
                  <p className="text-[#F8F5EE]/65 line-clamp-2 italic">&ldquo;{m.message}&rdquo;</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
