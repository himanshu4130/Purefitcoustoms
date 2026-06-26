import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "@/pages/Home";
import Contact from "@/pages/Contact";
import Quote from "@/pages/Quote";
import Login from "@/pages/Login";
import AuthCallback from "@/pages/AuthCallback";
import AdminLayout from "@/pages/admin/AdminLayout";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ScrollToTop from "@/components/ScrollToTop";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/lib/auth";
import useSiteContent from "@/hooks/useSiteContent";

function AppRouter() {
  const location = useLocation();
  const { settings } = useSiteContent();

  useEffect(() => {
    if (settings) {
      if (settings.seo_title) {
        document.title = settings.seo_title;
      } else {
        document.title = "PureFit Customs - Premium Customized Water Bottle Branding Kerala";
      }

      const desc = settings.seo_description || "Kerala's premium customized water bottle branding studio for weddings, events, and businesses.";
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = desc;
    }
  }, [settings]);

  // Detect OAuth callback synchronously - prevents race conditions vs useEffect
  if (location.hash?.includes("session_id=")) {
    return <AuthCallback />;
  }

  const hideChrome = location.pathname.startsWith("/admin") || location.pathname === "/login";

  return (
    <>
      <ScrollToTop />
      {!hideChrome && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/quote" element={<Quote />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requireAdmin>
              <AdminLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
      {!hideChrome && <Footer />}
      {!hideChrome && <WhatsAppFloat />}
    </>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
          <Toaster
            position="top-right"
            theme="dark"
            toastOptions={{
              style: {
                background: "#0B3D2E",
                color: "#F8F5EE",
                border: "1px solid rgba(212, 175, 55, 0.3)",
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
