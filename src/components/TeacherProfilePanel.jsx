import { useRef, useState } from "react";
import { Camera, ImagePlus, Mail, MessageCircle, Phone, Save, ShieldCheck, UserRound } from "lucide-react";
import { useTeacher } from "@/lib/teacherContext";
import { uploadTeacherImage } from "@/lib/api";

export default function TeacherProfilePanel() {
  const { session, profile, updateProfile } = useTeacher();
  const [form, setForm] = useState({ organization: profile?.organization || "الكونية", name: profile?.name || "", picture: profile?.picture || "", logo: profile?.logo || "", whatsapp: profile?.whatsapp || "", contact: profile?.contact || "" });
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState("");
  const [error, setError] = useState("");
  const photoRef = useRef(null); const logoRef = useRef(null);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const readImage = async (file, key) => {
    if (!file) return;
    setError("");
    if (session?.preview) { const reader = new FileReader(); reader.onload = () => update(key, reader.result); reader.readAsDataURL(file); return; }
    try { setUploading(key); update(key, await uploadTeacherImage(file, key)); } catch (uploadError) { setError(uploadError.message || "تعذر رفع الصورة"); } finally { setUploading(""); }
  };
  const submit = (event) => { event.preventDefault(); updateProfile(form); setSaved(true); setTimeout(() => setSaved(false), 2200); };
  const initials = (form.name || "م").charAt(0);

  return <div className="profile-page">
    <section className="profile-hero">
      <div className="profile-cover" />
      <div className="profile-hero-content">
        <div className="avatar avatar-xl">{form.picture ? <img src={form.picture} alt={form.name || "صورة المعلم"} /> : initials}</div>
        <div className="profile-identity"><span className="eyebrow">TEACHER PROFILE</span><h2>{form.name || "اسم المعلم"}</h2><p>{profile?.email || "لا يوجد بريد مسجل"}</p></div>
        <span className="profile-status"><i /> حساب نشط</span>
      </div>
    </section>

    <div className="profile-grid">
      <section className="profile-card profile-summary">
        <div className="section-heading"><div className="section-icon"><UserRound size={18} /></div><div><h3>ملخص الحساب</h3><span>بياناتك الأساسية</span></div></div>
        <div className="summary-list">
          <div><Mail size={16} /><span>البريد الإلكتروني</span><strong>{profile?.email || "—"}</strong></div>
          <div><ShieldCheck size={16} /><span>نوع الحساب</span><strong>{profile?.role === "admin" ? "مدير" : "معلم"}</strong></div>
          <div><UserRound size={16} /><span>المؤسسة</span><strong>{form.organization || "—"}</strong></div>
        </div>
      </section>

      <section className="profile-card">
        <div className="section-heading"><div className="section-icon"><Camera size={18} /></div><div><h3>الصور والهوية</h3><span>تظهر في مساحة العمل</span></div></div>
        <div className="upload-grid">
          <button type="button" disabled={Boolean(uploading)} onClick={() => photoRef.current?.click()} className="upload-tile"><div className="upload-preview avatar avatar-lg">{form.picture ? <img src={form.picture} alt="صورة المعلم" /> : initials}</div><span>{uploading === "picture" ? "جارٍ الرفع" : "الصورة الشخصية"}</span><small>تغيير الصورة</small></button>
          <button type="button" disabled={Boolean(uploading)} onClick={() => logoRef.current?.click()} className="upload-tile"><div className="upload-preview logo-preview">{form.logo ? <img src={form.logo} alt="شعار المؤسسة" /> : <ImagePlus size={22} />}</div><span>{uploading === "logo" ? "جارٍ الرفع" : "شعار المؤسسة"}</span><small>إضافة شعار</small></button>
        </div>
        <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={(e) => readImage(e.target.files?.[0], "picture")} /><input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={(e) => readImage(e.target.files?.[0], "logo")} />
      </section>

      <section className="profile-card profile-details">
        <div className="section-heading"><div className="section-icon"><SettingsIcon /></div><div><h3>بيانات المعلم</h3><span>تعديل المعلومات الظاهرة</span></div></div>
        <form onSubmit={submit} className="profile-form">
          <label>اسم المعلم<input value={form.name} onChange={(e) => update("name", e.target.value)} required /></label>
          <label>اسم المؤسسة<input value={form.organization} onChange={(e) => update("organization", e.target.value)} /></label>
          <label><span><MessageCircle size={14} />واتساب</span><input value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} type="tel" dir="ltr" placeholder="+20 100 000 0000" /></label>
          <label><span><Phone size={14} />تواصل إضافي</span><input value={form.contact} onChange={(e) => update("contact", e.target.value)} placeholder="بريد أو رابط" /></label>
          <div className="profile-save-row"><span>{error || (session?.preview ? "وضع المعاينة" : "يتم حفظ بياناتك في حسابك")}</span><button className="primary-button" disabled={Boolean(uploading)}><Save size={15} />{saved ? "تم الحفظ" : "حفظ التغييرات"}</button></div>
        </form>
      </section>
    </div>
  </div>;
}
function SettingsIcon() { return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="m19.4 15 .1.1a2 2 0 1 1-2.8 2.8l-.1-.1a2 2 0 0 0-3.4 1.4v.3a2 2 0 1 1-4.1 0v-.2a2 2 0 0 0-3.4-1.5l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A2 2 0 0 0 3.5 12a2 2 0 0 0-1.5-3.4h-.2a2 2 0 1 1 0-4.1H2a2 2 0 0 0 1.5-3.4l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A2 2 0 0 0 9.7 3.5a2 2 0 0 0 3.4-1.5v-.2a2 2 0 1 1 4.1 0V2a2 2 0 0 0 3.4 1.5l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A2 2 0 0 0 20.5 9a2 2 0 0 0 1.5 3.4h.2a2 2 0 1 1 0 4.1H22a2 2 0 0 0-1.5 3.4l-.1.1"/></svg>}
