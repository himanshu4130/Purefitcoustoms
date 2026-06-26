import { useEffect, useState } from "react";
import { api } from "@/lib/api";

/**
 * Fetches public site content + site settings.
 * Returns { gallery, hero, testimonials, settings } and a `loading` flag.
 * Empty arrays mean the home page should use static defaults from content.js.
 */
export default function useSiteContent() {
  const [data, setData] = useState({ gallery: [], hero: [], testimonial: [], settings: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [c, s] = await Promise.all([
          api.get("/site-content"),
          api.get("/site-settings"),
        ]);
        if (!alive) return;
        setData({
          gallery: c.data.gallery || [],
          hero: c.data.hero || [],
          testimonial: c.data.testimonial || [],
          settings: s.data || {},
        });
      } catch {
        // ignore - public will fallback to defaults
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return { ...data, loading };
}

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export function mediaUrl(pathOrId) {
  if (!pathOrId) return null;
  if (pathOrId.startsWith("http")) return pathOrId;
  if (pathOrId.startsWith("/api/")) return `${BACKEND_URL}${pathOrId}`;
  return `${BACKEND_URL}/api/media/${pathOrId}`;
}
