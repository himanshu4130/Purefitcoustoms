import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import LoadingScreen from "@/components/LoadingScreen";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    (async () => {
      const hash = window.location.hash || "";
      const m = hash.match(/session_id=([^&]+)/);
      if (!m) {
        navigate("/login", { replace: true });
        return;
      }
      const sessionId = m[1];
      try {
        const { data } = await api.post(
          "/auth/session",
          { session_id: sessionId },
          { withCredentials: true }
        );
        setUser(data);
        // Clean hash + redirect
        window.history.replaceState(null, "", window.location.pathname);
        navigate("/admin", { replace: true, state: { user: data } });
      } catch (err) {
        const detail = err?.response?.data?.detail || "Authentication failed";
        navigate(`/login?error=${encodeURIComponent(detail)}`, { replace: true });
      }
    })();
  }, [navigate, setUser]);

  return <LoadingScreen message="Authorising" />;
}
