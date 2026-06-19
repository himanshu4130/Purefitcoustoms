import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import LoadingScreen from "@/components/LoadingScreen";

// Module-level: survives React 19 StrictMode unmount/remount (useRef does NOT).
const consumedSessions = new Set();
const inflightSessions = new Map(); // session_id -> Promise

export default function AuthCallback() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const hash = window.location.hash || "";
    const m = hash.match(/session_id=([^&]+)/);
    if (!m) {
      navigate("/login", { replace: true });
      return;
    }
    const sessionId = decodeURIComponent(m[1]);

    // Strip the hash immediately so any re-render won't re-trigger AuthCallback
    window.history.replaceState(null, "", window.location.pathname);

    if (consumedSessions.has(sessionId)) {
      // already finalised — go to admin (cookie should be set)
      navigate("/admin", { replace: true });
      return;
    }

    // De-dupe simultaneous exchanges across StrictMode double-mount
    let promise = inflightSessions.get(sessionId);
    if (!promise) {
      promise = api
        .post("/auth/session", { session_id: sessionId }, { withCredentials: true })
        .then((res) => {
          consumedSessions.add(sessionId);
          return res.data;
        })
        .finally(() => inflightSessions.delete(sessionId));
      inflightSessions.set(sessionId, promise);
    }

    promise
      .then((data) => {
        setUser(data);
        navigate("/admin", { replace: true, state: { user: data } });
      })
      .catch((err) => {
        const detail = err?.response?.data?.detail || "Authentication failed";
        navigate(`/login?error=${encodeURIComponent(detail)}`, { replace: true });
      });
  }, [navigate, setUser]);

  return <LoadingScreen message="Authorising" />;
}
