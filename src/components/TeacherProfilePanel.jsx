import { useRef, useState } from "react";
import { Camera, ImagePlus, Save, UserRound, Phone, MessageCircle } from "lucide-react";
import { useTeacher } from "@/lib/teacherContext";
import { uploadTeacherImage } from "@/lib/api";

export default function TeacherProfilePanel() {
  const { session, profile, updateProfile } = useTeacher();
  const [form, setForm] = useState({
    organization: profile?.organization || "الكونية",
    name: profile?.name || "",
    picture: profile?.picture || "",
    logo: profile?.logo || "",
    whatsapp: profile?.whatsapp || "",
    contact: profile?.contact || "",
  });
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState("");
  const [error, setError] = useState("");
  const photoRef = useRef(null); const logoRef = useRef(null);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const readImage = async (file, key) => {
    if (!file) return;
    setError("");
    if (session?.preview) {
      const reader = new FileReader(); reader.onload = () => update(key, reader.result); reader.readAsDataURL(file); return;
    }
    try {
      setUploading(key);
      update(key, await uploadTeacherImage(file, key));
    } catch (uploadError) {
      setError(uploadError.message || "تعذر رفع الصورة");
    } finally { setUploading(""); }
  };
  const submit = (event) => { event.preventDefault(); updateProfile(form); setSaved(true); setTimeout(() => setSaved(false), 2200); };

  return <section className="rounded-2xl bg-ink-800/60 border border-white/5 p-5 sm:p-6 shadow-card">
    <div className="flex items-center gap-3 mb-5"><div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400"><UserRound size={20} /></div><div><h3 className="text-sm font-bold text-white">هوية المعلم</h3><p className="text-[11px] text-slate-400">الاسم والصورة والشعار وبيانات التواصل تظهر في مساحة المعلم.</p></div></div>
    <form onSubmit={submit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="block text-xs text-slate-400">اسم المؤسسة<input value={form.organization} onChange={(e) => update("organization", e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-ink-900/60 px-3 py-2.5 text-sm text-white outline-none focus:border-sky-400/50" placeholder="الكونية" /></label>
        <label className="block text-xs text-slate-400">اسم المعلم<input value={form.name} onChange={(e) => update("name", e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-ink-900/60 px-3 py-2.5 text-sm text-white outline-none focus:border-sky-400/50" required /></label>
      </div>
      <div className="grid grid-cols-2 gap-3"><button type="button" disabled={Boolean(uploading)} onClick={() => photoRef.current?.click()} className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-white/15 bg-white/[.02] p-4 text-xs text-slate-300 hover:border-sky-400/50 disabled:opacity-50"><div className="w-16 h-16 overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500 to-iris-500 flex items-center justify-center">{form.picture ? <img src={form.picture} alt="صورة المعلم" className="w-full h-full object-cover" /> : <Camera size={22} />}</div>{uploading === "picture" ? "جارٍ الرفع..." : "صورة المعلم"}</button><button type="button" disabled={Boolean(uploading)} onClick={() => logoRef.current?.click()} className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-white/15 bg-white/[.02] p-4 text-xs text-slate-300 hover:border-sky-400/50 disabled:opacity-50"><div className="w-16 h-16 overflow-hidden rounded-2xl bg-white/10 flex items-center justify-center">{form.logo ? <img src={form.logo} alt="شعار التطبيق" className="w-full h-full object-contain" /> : <ImagePlus size={22} />}</div>{uploading === "logo" ? "جارٍ الرفع..." : "شعار التطبيق"}</button></div>
      <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={(e) => readImage(e.target.files?.[0], "picture")} /><input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={(e) => readImage(e.target.files?.[0], "logo")} />
      <div className="grid sm:grid-cols-2 gap-3"><label className="block text-xs text-slate-400"><span className="flex items-center gap-1"><MessageCircle size={13} className="text-emerald-400" />رقم واتساب</span><input value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} type="tel" dir="ltr" className="mt-2 w-full rounded-xl border border-white/10 bg-ink-900/60 px-3 py-2.5 text-sm text-white outline-none focus:border-sky-400/50" placeholder="+20 100 000 0000" /></label><label className="block text-xs text-slate-400"><span className="flex items-center gap-1"><Phone size={13} className="text-sky-400" />وسيلة تواصل أخرى <em className="text-slate-500 not-italic">(اختياري)</em></span><input value={form.contact} onChange={(e) => update("contact", e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-ink-900/60 px-3 py-2.5 text-sm text-white outline-none focus:border-sky-400/50" placeholder="بريد أو رابط تواصل" /></label></div>
      <button className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-sky-500 to-iris-500 px-4 py-3 text-xs font-bold text-white hover:opacity-90"><Save size={15} />{saved ? "تم الحفظ" : "حفظ الهوية"}</button>
    </form>
    {error && <p className="mt-3 text-xs text-rose-300">{error}</p>}
    {session?.preview && <p className="mt-4 text-[11px] leading-5 text-amber-300/80">أنت في وضع المعاينة. بعد تسجيل الدخول الحقيقي سيتم رفع الصور إلى Cloudinary وحفظ روابطها في مساحة حسابك.</p>}
  </section>;
}
