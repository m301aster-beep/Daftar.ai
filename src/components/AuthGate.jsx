import { useEffect, useState } from "react";
import { apiConfig, clearSession, decodeGoogleCredential, getSession, signInWithFirebase, signInWithGoogle } from "@/lib/api";
import { TeacherContext } from "@/lib/teacherContext";
import { firebaseReady, logoutFromFirebase, signInWithFirebaseGoogle } from "@/lib/firebase";

function GoogleButton({ onCredential }) {
  useEffect(() => {
    if (!apiConfig.googleClientId) return undefined;
    const render = () => {
      window.google?.accounts.id.initialize({ client_id: apiConfig.googleClientId, callback: (response) => onCredential(response.credential) });
      const button = document.getElementById("google-signin-button");
      if (button) window.google?.accounts.id.renderButton(button, { theme: "outline", size: "large", width: 320, text: "continue_with", shape: "pill", locale: "ar" });
    };
    if (window.google?.accounts?.id) render();
    else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = render;
      document.head.appendChild(script);
      return () => script.remove();
    }
    return undefined;
  }, [onCredential]);
  return <div id="google-signin-button" className="min-h-11 flex justify-center" />;
}

export default function AuthGate({ children }) {
  const [session, setSession] = useState(getSession);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleCredential(credential) {
    setBusy(true); setError("");
    const profile = decodeGoogleCredential(credential) || {};
    try {
      const result = await signInWithGoogle(credential);
      setSession(result);
    } catch (requestError) {
      // إبقاء وضع المعاينة متاحاً إلى أن يضع المطور معرفات OAuth ويحدّث endpoint المصادقة.
      setError(`${requestError.message}. تأكد من إعداد VITE_GOOGLE_CLIENT_ID وربط /api/auth/google.`);
      setSession({ token: credential, user: { name: "معلم جديد", email: profile.email || "teacher@example.com", picture: profile.picture || "" }, preview: true });
    } finally { setBusy(false); }
  }

  async function handleFirebaseLogin() {
    setBusy(true); setError("");
    try {
      const result = await signInWithFirebaseGoogle();
      try {
        setSession(await signInWithFirebase(result.token, result.user));
      } catch {
        setSession({ token: result.token, user: { name: result.user.displayName, email: result.user.email, picture: result.user.photoURL }, preview: true });
      }
    } catch (loginError) { setError(loginError.message); } finally { setBusy(false); }
  }

  function usePreview() {
    const demo = { token: "preview-session", user: { name: "أ. معلم جديد", email: "preview@daftar.ai", picture: "" }, preview: true };
    localStorage.setItem("daftar-teacher-session", JSON.stringify(demo));
    setSession(demo);
  }

  if (session) {
    const logout = () => { logoutFromFirebase(); clearSession(); setSession(null); };
    const updateProfile = (changes) => {
      const next = { ...session, user: { ...session.user, ...changes } };
      localStorage.setItem("daftar-teacher-session", JSON.stringify(next));
      setSession(next);
    };
    return <TeacherContext.Provider value={{ session, profile: session.user, updateProfile, logout }}>{children}</TeacherContext.Provider>;
  }

  return <main className="min-h-screen flex items-center justify-center px-5 py-10 bg-ink-900 text-white bg-grid"><section className="w-full max-w-md rounded-3xl border border-white/10 bg-ink-800/80 backdrop-blur-xl p-7 sm:p-10 shadow-card text-center"><div className="mx-auto mb-5 w-20 h-20 rounded-3xl bg-gradient-to-br from-sky-400 to-iris-500 flex items-center justify-center shadow-lg shadow-sky-500/20"><span className="text-3xl font-black">د</span></div><p className="text-[11px] tracking-[.22em] text-sky-300 font-bold">DAFTAR AI</p><h1 className="mt-3 text-2xl sm:text-3xl font-display font-extrabold">مساحتك التعليمية الخاصة</h1><p className="mt-3 text-sm leading-7 text-slate-400">سجّل بحساب Google لإنشاء تطبيقك باسمك وصورتك وشعارك، مع بيانات مستقلة وآمنة.</p>{error && <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-xs leading-6 text-amber-200">{error}</div>}<div className="mt-7">{firebaseReady ? <button onClick={handleFirebaseLogin} className="w-full flex items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-100"><GoogleIcon />المتابعة باستخدام Google</button> : apiConfig.ready ? <GoogleButton onCredential={handleCredential} /> : <button onClick={usePreview} className="w-full rounded-xl bg-gradient-to-l from-sky-500 to-iris-500 px-4 py-3 text-sm font-bold transition hover:opacity-90">فتح وضع المعاينة</button>}</div>{busy && <p className="mt-3 text-xs text-slate-400">جارٍ إنشاء مساحة المعلم...</p>}<div className="mt-6 border-t border-white/10 pt-5 text-[11px] leading-6 text-slate-500">بعد إضافة إعدادات Firebase سيظهر الدخول الحقيقي، ولا تُحفظ كلمات المرور داخل التطبيق.</div></section></main>;
}

function GoogleIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5"><path fill="#4285F4" d="M21.35 12.23c0-.77-.07-1.52-.22-2.23H12v4.22h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.38Z"/><path fill="#34A853" d="M12 21.67c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.67Z"/><path fill="#FBBC05" d="M6.54 13.75a5.85 5.85 0 0 1 0-3.5V7.72H3.3a9.76 9.76 0 0 0 0 8.56l3.24-2.53Z"/><path fill="#EA4335" d="M12 6.22c1.43 0 2.72.49 3.73 1.46l2.8-2.8C16.84 3.29 14.63 2.33 12 2.33a9.74 9.74 0 0 0-8.7 5.39l3.24 2.53c.77-2.31 2.92-4.03 5.46-4.03Z"/></svg>;
}
