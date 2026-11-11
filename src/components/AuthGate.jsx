import { useEffect, useState } from "react";
import { apiConfig, clearSession, decodeGoogleCredential, getSession, saveSession, signInWithFirebase, signInWithGoogle } from "@/lib/api";
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
  const [identity, setIdentity] = useState({ organization: "الكونية", appName: "Daftar AI", teacherName: "", whatsapp: "", contact: "" });
  const updateIdentity = (key, value) => setIdentity((current) => ({ ...current, [key]: value }));
  const completeSession = (result) => {
    const next = { ...result, user: { ...result.user, name: identity.teacherName || result.user?.name, organization: identity.organization, appName: identity.appName, whatsapp: identity.whatsapp, contact: identity.contact } };
    saveSession(next);
    setSession(next);
  };

  async function handleCredential(credential) {
    setBusy(true); setError("");
    const profile = decodeGoogleCredential(credential) || {};
    try {
      completeSession(await signInWithGoogle(credential));
    } catch (requestError) {
      setError(`${requestError.message}. تأكد من إعداد Google وCloudflare Worker.`);
      setSession({ token: credential, user: { name: "معلم جديد", email: profile.email || "teacher@example.com", picture: profile.picture || "" }, preview: true });
    } finally { setBusy(false); }
  }

  async function handleFirebaseLogin() {
    setBusy(true); setError("");
    if (window.AndroidAuth?.signInWithGoogle) {
      window.__daftarNativeAuth = async (rawPayload) => {
        try {
          const payload = typeof rawPayload === "string" ? JSON.parse(rawPayload) : rawPayload;
          if (payload.error) throw new Error(payload.error);
          const result = await signInWithFirebase(payload.token, { displayName: payload.user?.name, email: payload.user?.email, photoURL: payload.user?.picture }, identity);
          completeSession(result);
        } catch (loginError) {
          setError(loginError.message || "تعذر إكمال تسجيل الدخول عبر Android");
        } finally {
          window.__daftarNativeAuth = null;
          setBusy(false);
        }
      };
      window.AndroidAuth.signInWithGoogle(JSON.stringify(identity));
      return;
    }
    try {
      const result = await signInWithFirebaseGoogle();
      completeSession(await signInWithFirebase(result.token, result.user, identity));
    } catch (loginError) { setError(loginError.message); } finally { setBusy(false); }
  }

  function usePreview() {
    const demo = { token: "preview-session", user: { name: identity.teacherName || "أ. معلم جديد", email: "preview@daftar.ai", picture: "", ...identity }, preview: true };
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

  return (
    <main className="min-h-screen flex items-center justify-center px-5 py-10 bg-ink-900 text-white bg-grid">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-ink-800/80 backdrop-blur-xl p-7 sm:p-10 shadow-card text-center">
        <div className="mx-auto mb-5 w-20 h-20 rounded-3xl bg-gradient-to-br from-sky-400 to-iris-500 flex items-center justify-center shadow-lg shadow-sky-500/20"><span className="text-3xl font-black">د</span></div>
        <p className="text-sm font-bold text-sky-300">الكونية</p>
        <p className="mt-1 text-[11px] tracking-[.22em] text-slate-400 font-bold">DAFTAR AI</p>
        <h1 className="mt-3 text-2xl sm:text-3xl font-display font-extrabold">منصة المعلم الذكية</h1>
        <p className="mt-3 text-sm leading-7 text-slate-400">سجّل بحساب Google لإنشاء مساحة تعليمية باسمك وصورتك وبيانات تواصلك.</p>
        {error && <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-xs leading-6 text-amber-200">{error}</div>}
        <div className="mt-6 grid gap-3 text-right">
          <div className="grid grid-cols-2 gap-3"><label className="text-[11px] text-slate-400">اسم المؤسسة<input value={identity.organization} onChange={(e) => updateIdentity("organization", e.target.value)} className="mt-1 w-full rounded-xl border border-white/10 bg-ink-900/60 px-3 py-2.5 text-sm text-white outline-none focus:border-sky-400/50" /></label><label className="text-[11px] text-slate-400">اسم التطبيق<input value={identity.appName} onChange={(e) => updateIdentity("appName", e.target.value)} className="mt-1 w-full rounded-xl border border-white/10 bg-ink-900/60 px-3 py-2.5 text-sm text-white outline-none focus:border-sky-400/50" /></label></div>
          <label className="text-[11px] text-slate-400">اسم المعلم<input value={identity.teacherName} onChange={(e) => updateIdentity("teacherName", e.target.value)} className="mt-1 w-full rounded-xl border border-white/10 bg-ink-900/60 px-3 py-2.5 text-sm text-white outline-none focus:border-sky-400/50" placeholder="سيُستخدم اسم Google تلقائيًا إذا تُرك فارغًا" /></label>
          <div className="grid grid-cols-2 gap-3"><label className="text-[11px] text-slate-400">رقم واتساب<input value={identity.whatsapp} onChange={(e) => updateIdentity("whatsapp", e.target.value)} type="tel" dir="ltr" className="mt-1 w-full rounded-xl border border-white/10 bg-ink-900/60 px-3 py-2.5 text-sm text-white outline-none focus:border-sky-400/50" placeholder="اختياري" /></label><label className="text-[11px] text-slate-400">تواصل آخر<input value={identity.contact} onChange={(e) => updateIdentity("contact", e.target.value)} className="mt-1 w-full rounded-xl border border-white/10 bg-ink-900/60 px-3 py-2.5 text-sm text-white outline-none focus:border-sky-400/50" placeholder="اختياري" /></label></div>
        </div>
        <div className="mt-7">
          {firebaseReady ? <button onClick={handleFirebaseLogin} disabled={busy} className="w-full flex flex-col items-center justify-center gap-2 rounded-xl bg-white px-4 py-4 text-sm font-bold text-slate-800 transition hover:bg-slate-100 disabled:opacity-60"><GoogleIcon /><span>المتابعة باستخدام Google</span></button> : apiConfig.ready ? <GoogleButton onCredential={handleCredential} /> : <button onClick={usePreview} className="w-full rounded-xl bg-gradient-to-l from-sky-500 to-iris-500 px-4 py-3 text-sm font-bold transition hover:opacity-90">فتح وضع المعاينة</button>}
        </div>
        {busy && <p className="mt-3 text-xs text-slate-400">جارٍ تسجيل الدخول وإنشاء مساحة المعلم...</p>}
        <div className="mt-6 border-t border-white/10 pt-5 text-[11px] leading-6 text-slate-500">بعد الدخول ستظهر صورة البروفايل واسم المعلم في رأس التطبيق، ويمكن إضافة رقم واتساب ووسيلة تواصل أخرى من إعدادات الهوية.</div>
      </section>
    </main>
  );
}

function GoogleIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-8 w-8"><path fill="#4285F4" d="M21.35 12.23c0-.77-.07-1.52-.22-2.23H12v4.22h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.38Z"/><path fill="#34A853" d="M12 21.67c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.67Z"/><path fill="#FBBC05" d="M6.54 13.75a5.85 5.85 0 0 1 0-3.5V7.72H3.3a9.76 9.76 0 0 0 0 8.56l3.24-2.53Z"/><path fill="#EA4335" d="M12 6.22c1.43 0 2.72.49 3.73 1.46l2.8-2.8C16.84 3.29 14.63 2.33 12 2.33a9.74 9.74 0 0 0-8.7 5.39l3.24 2.53c.77-2.31 2.92-4.03 5.46-4.03Z"/></svg>;
}
