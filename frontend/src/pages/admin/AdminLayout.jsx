import { useState } from "react";
import { Link, useLocation, useNavigate, Routes, Route, Navigate } from "react-router-dom";
import { LogOut, FileText, MessageSquare, Images, LayoutDashboard, Palette, Menu, X, ExternalLink } from "lucide-react";
import { useAuth } from "@/lib/auth";
import Logo from "@/components/Logo";
import QuotesPanel from "@/pages/admin/QuotesPanel";
import MessagesPanel from "@/pages/admin/MessagesPanel";
import MediaPanel from "@/pages/admin/MediaPanel";
import ContentPanel from "@/pages/admin/ContentPanel";
import BrandPanel from "@/pages/admin/BrandPanel";

const NAV = [
  { to: "/admin/quotes", label: "Quotes", icon: FileText, testid: "admin-nav-quotes" },
  { to: "/admin/messages", label: "Messages", icon: MessageSquare, testid: "admin-nav-messages" },
  { to: "/admin/media", label: "Media Library", icon: Images, testid: "admin-nav-media" },
  { to: "/admin/content", label: "Site Content", icon: LayoutDashboard, testid: "admin-nav-content" },
  { to: "/admin/brand", label: "Brand & Logo", icon: Palette, testid: "admin-nav-brand" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const onLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div data-testid="admin-layout" className="min-h-screen bg-[#0A0A0A] text-[#F8F5EE] flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-[#0E0E0E] border-r border-[#D4AF37]/15 transform transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b border-[#D4AF37]/15">
          <Logo variant="full" size="md" testid="admin-logo" />
        </div>
        <nav className="p-4 space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                data-testid={item.testid}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-sm ${
                  active
                    ? "bg-[#0B3D2E] text-[#D4AF37] border border-[#D4AF37]/30"
                    : "text-[#F8F5EE]/70 hover:text-[#D4AF37] hover:bg-[#0B3D2E]/40"
                }`}
              >
                <Icon size={16} />
                <span className="uppercase tracking-[0.15em] text-xs">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#D4AF37]/15">
          {user && (
            <div className="mb-3 px-4 py-3 rounded-md bg-[#0B3D2E]/30 border border-[#D4AF37]/15">
              {user.picture && (
                <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full mb-2" referrerPolicy="no-referrer" />
              )}
              <div className="text-sm text-white truncate">{user.name}</div>
              <div className="text-[10px] text-[#F8F5EE]/50 truncate">{user.email}</div>
            </div>
          )}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-[#F8F5EE]/60 hover:text-[#D4AF37] py-2"
          >
            <ExternalLink size={12} /> View Website
          </a>
          <button
            data-testid="admin-logout"
            onClick={onLogout}
            className="w-full mt-2 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-red-300/80 hover:text-red-300 py-2"
          >
            <LogOut size={12} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Backdrop mobile */}
      {open && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Content */}
      <div className="flex-1 lg:ml-0 min-w-0">
        {/* Top bar mobile */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-[#D4AF37]/15 bg-[#0E0E0E] sticky top-0 z-20">
          <button data-testid="admin-menu-toggle" onClick={() => setOpen(true)} className="p-2 text-[#D4AF37]">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Logo variant="full" size="sm" />
          <div className="w-8" />
        </div>

        <main className="p-6 lg:p-10 min-h-screen">
          <Routes>
            <Route index element={<Navigate to="quotes" replace />} />
            <Route path="quotes" element={<QuotesPanel />} />
            <Route path="messages" element={<MessagesPanel />} />
            <Route path="media" element={<MediaPanel />} />
            <Route path="content" element={<ContentPanel />} />
            <Route path="brand" element={<BrandPanel />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
