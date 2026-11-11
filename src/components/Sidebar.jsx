import { useEffect, useState } from "react";
import { Sparkles, GraduationCap, X, HelpCircle, Languages, Moon, Sun, LogOut } from "lucide-react";
import { navItems } from "@/data/mockData";
import { getLanguage, setLanguage, translations, getTheme, setTheme } from "@/lib/i18n";

const sectionImages = {
  dashboard: "./icons/cropped/dashboard.png",
  generator: "./icons/cropped/ai-studio.png",
  tools: "./icons/cropped/ai-studio.png",
  students: "./icons/cropped/students.png",
  archive: "./icons/cropped/dashboard.png",
  automation: "./icons/cropped/automation.png",
  reports: "./icons/cropped/automation.png",
  settings: "./icons/cropped/dashboard.png",
};

/**
 * الشريط الجانبي للتنقل بين أقسام المنصة.
 * يدعم وضع الموبايل (يُمرّر isOpen + onClose من الأب).
 */
export default function Sidebar({ active, onSelect, onLogout, isOpen, onClose }) {
  const [language, setCurrentLanguage] = useState(getLanguage);
  const [theme, setCurrentTheme] = useState(getTheme);
  const t = translations[language];

  useEffect(() => {
    const onLanguageChange = (event) => setCurrentLanguage(event.detail);
    const onThemeChange = (event) => setCurrentTheme(event.detail);
    window.addEventListener("teacherai-language-change", onLanguageChange);
    window.addEventListener("teacherai-theme-change", onThemeChange);
    return () => {
      window.removeEventListener("teacherai-language-change", onLanguageChange);
      window.removeEventListener("teacherai-theme-change", onThemeChange);
    };
  }, []);

  const toggleLanguage = () => setLanguage(language === "ar" ? "en" : "ar");

  return (
    <>
      {/* خلفية معتمة على الموبايل */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-ink-950/70 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          "fixed lg:sticky top-0 right-0 z-40 h-screen w-72 shrink-0",
          "bg-ink-850/80 backdrop-blur-xl border-l border-white/5",
          "flex flex-col transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        {/* الشعار */}
        <div className="flex items-center justify-between gap-3 px-6 h-16 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-iris-500 flex items-center justify-center shadow-glow">
                <GraduationCap className="w-5 h-5 text-white" strokeWidth={2.2} />
              </div>
              <span className="absolute -bottom-0.5 -left-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-ink-850 animate-pulse-dot" />
            </div>
            <div className="leading-tight">
              <h1 className="font-display font-extrabold text-base text-white tracking-tight">
                Daftar AI
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">الكونية · منصة المعلم الذكية</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* عناصر التنقل */}
        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
          <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            القائمة الرئيسية
          </p>
          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelect(item.id);
                  onClose();
                }}
                className={[
                  "group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium",
                  "transition-all duration-200 relative",
                  isActive
                    ? "bg-gradient-to-l from-sky-500/15 to-transparent text-white"
                    : "text-slate-400 hover:text-white hover:bg-white/5",
                ].join(" ")}
              >
                {/* شريط مؤشر النشاط */}
                {isActive && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-7 rounded-l-full bg-gradient-to-b from-sky-400 to-iris-400" />
                )}
                <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/[0.03] transition-transform duration-300 group-hover:scale-110">
                  <img
                    src={`${sectionImages[item.id]}?v=48febf2`}
                    alt=""
                    className="icon-art icon-art-float h-11 w-11 object-contain opacity-95 transition group-hover:scale-125"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                      event.currentTarget.nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                  <span className="hidden text-lg text-sky-300" aria-hidden="true">✦</span>
                </span>
                <span>{t.nav[item.id] || item.label}</span>
                {item.id === "generator" && (
                  <span className="mr-auto text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-iris-500/20 text-iris-400">
                    AI
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* بطاقة الترقية في الأسفل */}
        <div className="p-4">
          <div className="relative overflow-hidden rounded-2xl gradient-border bg-ink-800/60 p-4">
            <div className="absolute -top-8 -left-8 w-24 h-24 bg-sky-500/20 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-bold text-white">الباقة الاحترافية</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                توليد غير محدود، تحليلات متقدمة، وأتمتة كاملة لمهامك.
              </p>
              <button className="w-full py-2 rounded-lg bg-gradient-to-l from-sky-500 to-iris-500 text-white text-xs font-bold hover:opacity-90 transition">
                ترقية الآن
              </button>
            </div>
          </div>

          <button onClick={toggleLanguage} className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-sky-300 bg-sky-500/5 border border-sky-400/10 hover:bg-sky-500/10 transition">
            <Languages className="w-4 h-4" />
            {t.switchLanguage}
          </button>

          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-500 border border-slate-300/30 hover:text-sky-500 transition">
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {theme === "dark" ? (language === "ar" ? "الوضع الفاتح" : "Light mode") : (language === "ar" ? "الخلفية الداكنة" : "Dark mode")}
          </button>

          <button className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition">
            <HelpCircle className="w-4 h-4" />
            مركز المساعدة
          </button>

          <button onClick={onLogout} className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-300 border border-rose-400/10 hover:bg-rose-400/10 transition">
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </button>
        </div>
      </aside>
    </>
  );
}
