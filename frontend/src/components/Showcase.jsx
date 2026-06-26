import { useState } from "react";
import { motion } from "framer-motion";
import useSiteContent from "@/hooks/useSiteContent";
import { buildMediaUrl } from "@/lib/api";
import { X, ShoppingBag, Eye, Award } from "lucide-react";

export default function Showcase() {
  const { featured } = useSiteContent();
  const [selectedProject, setSelectedProject] = useState(null);

  // High-quality static fallback projects in case the DB is loading or empty
  const defaultProjects = [
    {
      id: "sc_wedding",
      title: "Royal Cloud Wedding Edition",
      subtitle: "Royal Cloud Caterers",
      image_id: "wedding_bottle",
      image_url: "/wedding_bottle.png",
      category: "Wedding Branding",
      quantity: "500 Bottles",
      bottle_type: "Square PET",
      description: "Designed with burgundy tones, rose gold highlights, and delicate floral monograms for premium wedding serving tables.",
    },
    {
      id: "sc_corporate",
      title: "TechNova Corporate Edition",
      subtitle: "TechNova Inc.",
      image_id: "corporate_bottle",
      image_url: "/corporate_bottle.png",
      category: "Corporate Branding",
      quantity: "2500 Bottles",
      bottle_type: "Round PET",
      description: "Elegant navy blue, silver, and boardroom-quality branding customized for executive board meetings and summits.",
    },
    {
      id: "sc_restaurant",
      title: "Royal Dine Restaurant Edition",
      subtitle: "Royal Dine Restaurant",
      image_id: "restaurant_bottle",
      image_url: "/restaurant_bottle.png",
      category: "Restaurant Branding",
      quantity: "750 Bottles",
      bottle_type: "Square PET",
      description: "Private-label matte black design with luxurious gold foil accents custom made for premium hospitality services.",
    },
    {
      id: "sc_catering",
      title: "Elite Catering Banquet Edition",
      subtitle: "Elite Catering Services",
      image_id: "catering_bottle",
      image_url: "/catering_bottle.png",
      category: "Catering Branding",
      quantity: "1500 Bottles",
      bottle_type: "Round PET",
      description: "Vibrant maroon and red themed labels to coordinate with luxury banquet tables and premium event serving.",
    },
    {
      id: "sc_funeral",
      title: "Gamut Events Funeral Service",
      subtitle: "Gamut Events",
      image_id: "funeral_bottle",
      image_url: "/funeral_bottle.png",
      category: "Funeral Branding",
      quantity: "1000 Bottles",
      bottle_type: "Round PET",
      description: "A respectful white, grey, and gold memorial tribute design for funeral receptions and commemorative services.",
    },
    {
      id: "sc_political",
      title: "Campaign Vote for Progress",
      subtitle: "Kerala Progress Party",
      image_id: "political_bottle",
      image_url: "/political_bottle.png",
      category: "Political Branding",
      quantity: "5000 Bottles",
      bottle_type: "Round PET",
      description: "Campaign-ready customized bulk supply printed with sharp political logo designs and official party colors.",
    }
  ];

  const projectsList = featured && featured.length > 0 ? featured : defaultProjects;

  return (
    <section
      id="featured-projects"
      data-testid="showcase-section"
      className="relative py-28 lg:py-36 bg-[#0B3D2E]/95 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08),transparent_60%)]" />
      <div className="grain-overlay" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-px bg-[#D4AF37]" />
              <span className="text-[#D4AF37] uppercase text-xs tracking-[0.35em]">Featured Bottle Projects</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05]">
              Designed To Tell <span className="italic text-[#D4AF37]">Your Story</span>
            </h2>
          </div>
          <p className="text-[#F8F5EE]/70 lg:max-w-sm leading-relaxed">
            Discover completed custom water bottle projects. Each bottle features bespoke label designs, colors, and layout representing real premium clients.
          </p>
        </div>

        {/* Featured Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsList.map((project, i) => {
            const imgSrc = buildMediaUrl(project.image_url || project.image_id) || "/wedding_bottle.png";
            return (
              <motion.div
                key={project.id || i}
                data-testid={`project-card-${project.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.08 }}
                className="group relative flex flex-col justify-between bg-[#111111]/90 border border-[#D4AF37]/15 rounded-lg hover:border-[#D4AF37]/50 hover:bg-[#0B3D2E]/25 transition-all duration-500 overflow-hidden"
              >
                <div>
                  {/* Image container (product only) */}
                  <div className="w-full aspect-[4/5] bg-black/60 relative flex items-center justify-center p-8 overflow-hidden border-b border-[#D4AF37]/10">
                    <img
                      src={imgSrc}
                      alt={project.title}
                      className="max-h-full object-contain group-hover:scale-105 transition-transform duration-[1200ms] select-none"
                    />
                    <div className="absolute top-4 right-4 bg-black/75 border border-[#D4AF37]/35 rounded px-2.5 py-0.5 text-[8px] uppercase tracking-wider text-[#D4AF37] font-semibold">
                      {project.bottle_type || "Round PET"}
                    </div>
                  </div>

                  {/* Body details */}
                  <div className="p-6 space-y-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-[#D4AF37]/80 font-bold block mb-1">
                        {project.category || "Wedding Branding"}
                      </span>
                      <h3 className="font-serif text-xl text-white group-hover:text-[#D4AF37] transition-colors leading-tight">
                        {project.subtitle || project.title}
                      </h3>
                    </div>

                    <div className="flex justify-between items-center text-xs text-[#F8F5EE]/60 pt-2 border-t border-[#D4AF37]/10">
                      <span>Quantity:</span>
                      <span className="text-white font-mono font-medium">{project.quantity || "500 Bottles"}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-[#D4AF37] hover:text-[#111111] transition-all duration-300 rounded-sm"
                  >
                    <Eye size={12} />
                    View Details
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Details Popup Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-2xl bg-[#111111] border border-[#D4AF37]/45 rounded-lg overflow-hidden relative"
          >
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 text-[#F8F5EE]/60 hover:text-white z-10 p-1 bg-black/60 rounded-full"
            >
              <X size={20} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="aspect-[4/5] bg-black/80 flex items-center justify-center p-8 border-r border-[#D4AF37]/15">
                <img
                  src={buildMediaUrl(selectedProject.image_url || selectedProject.image_id) || "/wedding_bottle.png"}
                  alt=""
                  className="max-h-full object-contain"
                />
              </div>
              <div className="p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block mb-1">
                      {selectedProject.category}
                    </span>
                    <h3 className="font-serif text-2xl text-white leading-tight">
                      {selectedProject.subtitle || selectedProject.title}
                    </h3>
                  </div>

                  <p className="text-sm text-[#F8F5EE]/75 leading-relaxed">
                    {selectedProject.description || "Every bottle is customized with high-definition printing, premium labels, and custom artwork layout."}
                  </p>

                  <div className="space-y-2 text-xs pt-4 border-t border-[#D4AF37]/10">
                    <div className="flex justify-between">
                      <span className="text-white/60">Bottle Style:</span>
                      <span className="text-white font-semibold">{selectedProject.bottle_type || "Round PET"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Minimum Order Quantity:</span>
                      <span className="text-white font-semibold">{selectedProject.quantity || "500 Bottles"}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <a
                    href={`https://wa.me/919188108947?text=Hi%20PureFit%2C%20I'm%20interested%20in%20customized%20branding%20similar%20to%20${encodeURIComponent(selectedProject.subtitle || selectedProject.title)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#F8F5EE] transition-all rounded-sm"
                  >
                    <ShoppingBag size={14} />
                    Inquire On WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
