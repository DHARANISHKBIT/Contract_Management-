/**
 * API base for all HTTP calls. Set VITE_API_BASE_URL in production, e.g.
 * https://your-api.onrender.com  (no trailing slash)
 */
const raw = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
export const API_ORIGIN = String(raw).replace(/\/$/, "");
export const API_BASE = `${API_ORIGIN}/api`;
