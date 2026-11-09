const API_URL = (import.meta.env.VITE_API_URL || "https://daftar-ai-api.m301aster-ai.workers.dev").replace(/\/$/, "");

export const apiConfig = {
  baseUrl: API_URL,
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
  ready: Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID),
};

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem("daftar-teacher-session") || "null");
  } catch {
    return null;
  }
}

export function saveSession(session) {
  localStorage.setItem("daftar-teacher-session", JSON.stringify(session));
  return session;
}

export function clearSession() {
  localStorage.removeItem("daftar-teacher-session");
}

export async function apiRequest(path, options = {}) {
  const session = getSession();
  const headers = {
    "content-type": "application/json",
    ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
    ...(options.headers || {}),
  };
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "تعذر الاتصال بالخادم");
  return body;
}

export async function signInWithGoogle(credential) {
  const response = await apiRequest("/api/auth/google", {
    method: "POST",
    body: JSON.stringify({ credential }),
  });
  return saveSession(response);
}

export async function loadTeacherData() {
  const [dashboard, students] = await Promise.all([
    apiRequest("/api/dashboard"),
    apiRequest("/api/students"),
  ]);
  return { dashboard, students: students.data || [] };
}

export function decodeGoogleCredential(credential) {
  try {
    const payload = credential.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(decodeURIComponent(atob(payload).split("").map((char) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`).join("")));
  } catch {
    return null;
  }
}
