import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "@/pages/Home";
import Contact from "@/pages/Contact";
import Quote from "@/pages/Quote";
import Admin from "@/pages/Admin";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ScrollToTop from "@/components/ScrollToTop";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <Footer />
        <WhatsAppFloat />
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
      </BrowserRouter>
    </div>
  );
}

export default App;
