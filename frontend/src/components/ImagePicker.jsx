import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Upload, Trash2, Image, Loader2, Calendar, FileText, Check, X, Scissors, Undo2, History } from "lucide-react";
import { api, buildMediaUrl } from "@/lib/api";

export default function ImagePicker({ value, onChange, sectionType = "gallery", history = [] }) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Crop state
  const [cropFile, setCropFile] = useState(null);
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropArea, setCropArea] = useState({ x: 10, y: 10, width: 80, height: 80 }); // percentage

  // Usage info
  const [items, setItems] = useState([]);
  const [settings, setSettings] = useState({});

  const fileRef = useRef(null);
  const dropRef = useRef(null);
  const cropImgRef = useRef(null);

  const loadData = async () => {
    try {
      const [mediaRes, itemsRes, settingsRes] = await Promise.all([
        api.get("/admin/media"),
        api.get("/admin/site-content"),
        api.get("/site-settings")
      ]);
      setMedia(mediaRes.data || []);
      setItems(itemsRes.data || []);
      setSettings(settingsRes.data || {});
    } catch (err) {
      console.error("Failed to load picker context data", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [value]);

  useEffect(() => {
    if (value && media.length) {
      const found = media.find((m) => m.id === value);
      setSelectedItem(found || null);
    } else {
      setSelectedItem(null);
    }
  }, [value, media]);

  // Handle upload of file
  const uploadFile = async (fileToUpload) => {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", fileToUpload);
    try {
      const { data } = await api.post("/admin/media", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("Image uploaded successfully");
      
      // Determine where visible based on sectionType
      let visibleLocs = [];
      if (sectionType === "gallery") {
        visibleLocs = ["✓ Homepage Gallery", "✓ Gallery Section"];
      } else if (sectionType === "hero" || sectionType === "brand-hero") {
        visibleLocs = ["✓ Homepage Hero Section"];
      } else if (sectionType === "brand-logo") {
        visibleLocs = ["✓ Brand Logo"];
      }
      
      if (visibleLocs.length) {
        toast.info(
          <div className="space-y-1">
            <div className="font-semibold text-xs uppercase tracking-wider text-[#D4AF37]">Visible in:</div>
            {visibleLocs.map(l => <div key={l} className="text-xs text-emerald-400">{l}</div>)}
          </div>,
          { duration: 5000 }
        );
      }

      await loadData();
      onChange(data.id);
      setShowLibrary(false);
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Drag and drop events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = (file) => {
    const ext = file.name.split(".").pop().toLowerCase();
    if (!["jpg", "jpeg", "png", "webp"].includes(ext)) {
      toast.error("Unsupported file type. Use JPG, PNG or WEBP.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File is too large (max 10MB).");
      return;
    }
    
    // Open cropping view
    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result);
      setCropFile(file);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropSave = () => {
    if (!cropImgRef.current) return;
    
    const image = cropImgRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    // Calculate actual pixel crop areas
    const naturalWidth = image.naturalWidth;
    const naturalHeight = image.naturalHeight;
    
    const cropX = (cropArea.x / 100) * naturalWidth;
    const cropY = (cropArea.y / 100) * naturalHeight;
    const cropW = (cropArea.width / 100) * naturalWidth;
    const cropH = (cropArea.height / 100) * naturalHeight;
    
    canvas.width = cropW;
    canvas.height = cropH;
    
    ctx.drawImage(
      image,
      cropX, cropY, cropW, cropH,
      0, 0, cropW, cropH
    );
    
    canvas.toBlob((blob) => {
      if (!blob) {
        toast.error("Crop failed");
        return;
      }
      const croppedFile = new File([blob], cropFile.name, { type: cropFile.type });
      setCropModalOpen(false);
      uploadFile(croppedFile);
    }, cropFile.type, 0.95);
  };

  // Usage mapping calculations
  const getUsageDetails = (id) => {
    if (!id) return null;
    const isHero = settings.hero_background_image_id === id || 
                   settings.hero_featured_image_id === id || 
                   items.some((item) => item.kind === "hero" && item.image_id === id);
    
    const isGallery = items.some((item) => item.kind === "gallery" && item.image_id === id);
    
    const isCatering = items.some(
      (item) => (item.category?.toLowerCase() === "catering" || item.category?.toLowerCase() === "caterings") && item.image_id === id
    );
    
    const isWedding = items.some(
      (item) => (item.category?.toLowerCase() === "wedding" || item.category?.toLowerCase() === "weddings") && item.image_id === id
    );
    
    const isTestimonial = items.some((item) => item.kind === "testimonial" && item.image_id === id);

    return { isHero, isGallery, isCatering, isWedding, isTestimonial };
  };

  const usage = selectedItem ? getUsageDetails(selectedItem.id) : null;

  return (
    <div className="space-y-4">
      {/* 1. Preview mode (if image is selected) */}
      {selectedItem ? (
        <div className="glass-dark border border-[#D4AF37]/30 rounded-md p-4 lg:p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-5 items-start">
            {/* Thumbnail */}
            <div className="w-full md:w-40 aspect-square overflow-hidden rounded border border-[#D4AF37]/20 bg-[#0A0A0A] relative group">
              <img src={buildMediaUrl(selectedItem.id)} alt={selectedItem.original_filename} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="px-3 py-1.5 bg-red-600 text-white text-[10px] uppercase tracking-wider rounded hover:bg-red-700"
                >
                  Change
                </button>
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 space-y-3">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">Selected Image</div>
                <div className="text-white font-serif text-lg truncate mt-1">{selectedItem.original_filename}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs text-[#F8F5EE]/60">
                <div className="flex items-center gap-1.5">
                  <FileText size={13} className="text-[#D4AF37]/75" />
                  <span>{(selectedItem.size / 1024).toFixed(1)} KB</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-[#D4AF37]/75" />
                  <span>{new Date(selectedItem.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Where will it appear */}
              <div className="p-3 border border-[#D4AF37]/15 rounded bg-[#111111]/40 text-xs space-y-2">
                <span className="font-semibold text-[#D4AF37] block">This image will appear on:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {sectionType === "gallery" && (
                    <>
                      <div className="text-emerald-400 flex items-center gap-1">✓ Homepage Gallery</div>
                      <div className="text-emerald-400 flex items-center gap-1">✓ Gallery Section</div>
                    </>
                  )}
                  {sectionType === "hero" && (
                    <div className="text-emerald-400 flex items-center gap-1">✓ Homepage Hero Section</div>
                  )}
                  {sectionType === "brand-hero" && (
                    <div className="text-emerald-400 flex items-center gap-1">✓ Homepage Hero Section</div>
                  )}
                  {sectionType === "brand-logo" && (
                    <div className="text-emerald-400 flex items-center gap-1">✓ Brand Logo</div>
                  )}
                  {sectionType === "brand-bg" && (
                    <div className="text-emerald-400 flex items-center gap-1">✓ Homepage Hero Background</div>
                  )}
                </div>
              </div>

              {/* Shopify-like Image Usage Indicator */}
              {usage && (
                <div className="p-3 border border-[#D4AF37]/15 rounded bg-[#111111]/40 text-xs">
                  <div className="font-semibold text-[#D4AF37] mb-2">{selectedItem.original_filename}</div>
                  <div className="text-[10px] uppercase tracking-wider text-[#F8F5EE]/40 mb-1">Used In:</div>
                  <div className="space-y-1 font-mono">
                    <div className={usage.isHero ? "text-emerald-400" : "text-[#F8F5EE]/40"}>
                      {usage.isHero ? "✓" : "✗"} Homepage Hero
                    </div>
                    <div className={usage.isGallery ? "text-emerald-400" : "text-[#F8F5EE]/40"}>
                      {usage.isGallery ? "✓" : "✗"} Gallery
                    </div>
                    <div className={usage.isCatering ? "text-emerald-400" : "text-[#F8F5EE]/40"}>
                      {usage.isCatering ? "✓" : "✗"} Catering Category
                    </div>
                    <div className={usage.isWedding ? "text-emerald-400" : "text-[#F8F5EE]/40"}>
                      {usage.isWedding ? "✓" : "✗"} Wedding Category
                    </div>
                    <div className={usage.isTestimonial ? "text-emerald-400" : "text-[#F8F5EE]/40"}>
                      {usage.isTestimonial ? "✓" : "✗"} Testimonials
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Version History Section */}
          {history && history.length > 0 && (
            <div className="border-t border-[#D4AF37]/15 pt-4 mt-4">
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] flex items-center gap-1.5 mb-3 font-semibold">
                <History size={12} />
                Image Version History (Undo / Restore)
              </div>
              <div className="flex flex-wrap gap-3">
                {history.map((histId, idx) => (
                  <div key={histId} className="relative group/hist flex flex-col items-center">
                    <div className="w-14 h-14 rounded border border-[#D4AF37]/25 overflow-hidden bg-black relative">
                      <img src={buildMediaUrl(histId)} alt="" className="w-full h-full object-cover opacity-75 group-hover/hist:opacity-100 transition-opacity" />
                      <button
                        type="button"
                        onClick={() => {
                          onChange(histId);
                          toast.success("Restored previous image version");
                        }}
                        className="absolute inset-0 bg-black/70 opacity-0 group-hover/hist:opacity-100 transition-opacity flex flex-col items-center justify-center text-[8px] text-[#D4AF37] font-semibold gap-1"
                        title="Restore this version"
                      >
                        <Undo2 size={12} />
                        <span>Restore</span>
                      </button>
                    </div>
                    <span className="text-[8px] text-[#F8F5EE]/40 mt-1">Version {idx + 1}</span>
                  </div>
                ))}
                
                {/* Quick Undo Button */}
                <button
                  type="button"
                  onClick={() => {
                    const prevId = history[history.length - 1];
                    onChange(prevId);
                    toast.success("Undid last image replacement");
                  }}
                  className="w-14 h-14 rounded border border-[#D4AF37]/35 border-dashed flex flex-col items-center justify-center text-[8px] text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors"
                  title="Undo Last Change"
                >
                  <Undo2 size={14} className="mb-0.5" />
                  <span>Undo</span>
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                const reader = new FileReader();
                // To allow recropping, we can fetch the image as a Blob first or just allow clearing
                onChange("");
              }}
              className="px-4 py-2 border border-red-500/30 text-red-300 rounded text-xs hover:bg-red-500 hover:text-white transition-colors"
            >
              Clear Image
            </button>
            <button
              type="button"
              onClick={() => setShowLibrary(true)}
              className="px-4 py-2 border border-[#D4AF37]/30 text-[#D4AF37] rounded text-xs hover:bg-[#D4AF37]/10 transition-colors"
            >
              Choose Different Image
            </button>
          </div>
        </div>
      ) : (
        // 2. Upload / Select mode
        <div className="space-y-3">
          <div
            ref={dropRef}
            onDragOver={handleDrag}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-[#D4AF37]/30 rounded-md p-8 text-center bg-[#0E0E0E]/40 hover:border-[#D4AF37] transition-colors cursor-pointer group"
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileSelection(e.target.files[0])}
            />
            {uploading ? (
              <div className="flex flex-col items-center justify-center py-4">
                <Loader2 size={32} className="animate-spin text-[#D4AF37] mb-2" />
                <span className="text-xs uppercase tracking-[0.2em] text-[#F8F5EE]/60">Uploading and processing…</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-2 space-y-2">
                <Upload size={32} className="text-[#D4AF37]/60 group-hover:text-[#D4AF37] transition-colors" />
                <span className="text-sm font-semibold text-white block">Upload or Select Image</span>
                <span className="text-xs text-[#F8F5EE]/45">
                  Drag & drop, or click to browse image (JPEG, PNG, WEBP up to 10MB)
                </span>
              </div>
            )}
          </div>
          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowLibrary(!showLibrary)}
              className="text-xs text-[#D4AF37] hover:underline"
            >
              {showLibrary ? "Hide Media Library" : "or Select from Media Library"}
            </button>
          </div>
        </div>
      )}

      {/* 3. Media library grid */}
      {showLibrary && (
        <div className="border border-[#D4AF37]/15 rounded-md p-4 bg-[#0E0E0E] space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-[#D4AF37]/15">
            <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">Select from Media Library</span>
            <button type="button" onClick={() => setShowLibrary(false)} className="text-[#F8F5EE]/40 hover:text-white">
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto">
            {media.length === 0 && (
              <div className="col-span-6 text-center text-xs text-[#F8F5EE]/40 py-6">No images in library. Upload one above.</div>
            )}
            {media.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  onChange(m.id);
                  setShowLibrary(false);
                }}
                className={`aspect-square overflow-hidden rounded border-2 transition-all ${
                  value === m.id ? "border-[#D4AF37] scale-95" : "border-transparent hover:border-[#D4AF37]/45"
                }`}
              >
                <img src={buildMediaUrl(m.id)} alt={m.original_filename} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. Canvas Crop Modal */}
      {cropModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0E0E0E] border border-[#D4AF37]/35 rounded-lg w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-[#D4AF37]/15 flex justify-between items-center bg-[#111111]">
              <h3 className="font-serif text-lg text-white flex items-center gap-2">
                <Scissors size={16} className="text-[#D4AF37]" />
                Crop Image before Upload
              </h3>
              <button onClick={() => setCropModalOpen(false)} className="text-[#F8F5EE]/40 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 p-6 overflow-auto bg-[#070707] flex items-center justify-center relative min-h-[300px]">
              <div className="relative inline-block max-w-full">
                <img
                  ref={cropImgRef}
                  src={cropImageSrc}
                  alt="Source"
                  className="max-h-[50vh] max-w-full select-none"
                  onLoad={() => {
                    // Reset crop area centered
                    setCropArea({ x: 15, y: 15, width: 70, height: 70 });
                  }}
                />
                
                {/* Crop overlay handle */}
                <div
                  className="absolute border-2 border-dashed border-[#D4AF37] cursor-move bg-black/20"
                  style={{
                    left: `${cropArea.x}%`,
                    top: `${cropArea.y}%`,
                    width: `${cropArea.width}%`,
                    height: `${cropArea.height}%`
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const startX = e.clientX;
                    const startY = e.clientY;
                    const startLeft = cropArea.x;
                    const startTop = cropArea.y;
                    
                    const onMouseMove = (moveEvent) => {
                      const rect = cropImgRef.current.getBoundingClientRect();
                      const deltaXPercent = ((moveEvent.clientX - startX) / rect.width) * 100;
                      const deltaYPercent = ((moveEvent.clientY - startY) / rect.height) * 100;
                      
                      setCropArea((prev) => {
                        const newX = Math.max(0, Math.min(100 - prev.width, startLeft + deltaXPercent));
                        const newY = Math.max(0, Math.min(100 - prev.height, startTop + deltaYPercent));
                        return { ...prev, x: newX, y: newY };
                      });
                    };
                    
                    const onMouseUp = () => {
                      document.removeEventListener("mousemove", onMouseMove);
                      document.removeEventListener("mouseup", onMouseUp);
                    };
                    
                    document.addEventListener("mousemove", onMouseMove);
                    document.addEventListener("mouseup", onMouseUp);
                  }}
                >
                  {/* Resize handle bottom right */}
                  <div
                    className="absolute right-0 bottom-0 w-4 h-4 bg-[#D4AF37] cursor-se-resize flex items-center justify-center text-[8px] font-bold text-black"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      const startX = e.clientX;
                      const startY = e.clientY;
                      const startW = cropArea.width;
                      const startH = cropArea.height;
                      
                      const onMouseMove = (moveEvent) => {
                        const rect = cropImgRef.current.getBoundingClientRect();
                        const deltaW = ((moveEvent.clientX - startX) / rect.width) * 100;
                        const deltaH = ((moveEvent.clientY - startY) / rect.height) * 100;
                        
                        setCropArea((prev) => {
                          const newW = Math.max(15, Math.min(100 - prev.x, startW + deltaW));
                          const newH = Math.max(15, Math.min(100 - prev.y, startH + deltaH));
                          return { ...prev, width: newW, height: newH };
                        });
                      };
                      
                      const onMouseUp = () => {
                        document.removeEventListener("mousemove", onMouseMove);
                        document.removeEventListener("mouseup", onMouseUp);
                      };
                      
                      document.addEventListener("mousemove", onMouseMove);
                      document.addEventListener("mouseup", onMouseUp);
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#D4AF37]/15 bg-[#111111] flex justify-between items-center gap-3">
              <span className="text-xs text-[#F8F5EE]/50">
                Drag crop box to position, drag yellow corner handle to resize.
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCropModalOpen(false)}
                  className="px-4 py-2 border border-[#D4AF37]/30 text-[#F8F5EE]/70 rounded text-xs uppercase tracking-wider hover:border-[#D4AF37]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCropSave}
                  className="px-4 py-2 bg-[#D4AF37] text-black rounded text-xs uppercase font-semibold tracking-wider hover:bg-[#F8F5EE]"
                >
                  Crop &amp; Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
