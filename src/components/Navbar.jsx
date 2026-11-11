import { useEffect, useState } from "react";
import { Menu, Search, Bell, Plus, Command, Moon, Sun } from "lucide-react";
import { getTheme, setTheme } from "@/lib/i18n";

/**
 * الشريط العلوي: زر القائمة للموبايل، البحث الفوري،
 * الإشعارات، وزر الإنشاء السريع، وصورة الملف الشخصي.
 */
export default function Navbar({ onMenuClick, onSearchClick, title, profile, onLogout }) {
  const [theme, setCurrentTheme] = useState(getTheme);
  useEffect(() => {
    const onThemeChange = (event) => setCurrentTheme(event.detail);
    window.addEventListener("teacherai-theme-change", onThemeChange);
    return () => window.removeEventListener("teacherai-theme-change", onThemeChange);
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-ink-900/70 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-3 px-4 sm:px-6 h-16">
        {/* زر القائمة للموبايل */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition"
          aria-label="فتح القائمة"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* عنوان الصفحة */}
        <div className="hidden sm:block">
          <h2 className="font-display font-bold text-base text-white tracking-tight">
            {title}
          </h2>
          <p className="text-[11px] text-slate-500">{profile?.organization || "الكونية"} · مرحباً {profile?.name || "أيها المعلم"}</p>
        </div>

        {/* شريط البحث الفوري */}
        <button
          onClick={onSearchClick}
          className="group mr-auto flex items-center gap-2 px-3 py-2 rounded-xl bg-ink-800/70 border border-white/5 hover:border-white/10 transition w-44 sm:w-72"
        >
          <Search className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition" />
          <span className="text-xs text-slate-500 group-hover:text-slate-300 transition">
            ابحث في الأرشيف...
          </span>
          <span className="hidden sm:flex mr-auto items-center gap-0.5 text-[10px] font-mono text-slate-600 bg-ink-750 px-1.5 py-0.5 rounded">
            <Command className="w-3 h-3" /> K
          </span>
        </button>

        {/* إشعارات */}
        <button className="relative p-2.5 rounded-xl bg-ink-800/70 border border-white/5 text-slate-300 hover:text-white hover:border-white/10 transition">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-2 left-2 w-2 h-2 rounded-full bg-sky-400 animate-pulse-dot" />
        </button>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-ink-800/70 border border-white/5 text-slate-500 hover:text-sky-500 hover:border-sky-400/30 transition"
          aria-label={theme === "dark" ? "تفعيل النهار" : "تفعيل الليل"}
          title={theme === "dark" ? "الوضع النهاري" : "الوضع الليلي"}
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* إنشاء سريع */}
        <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-l from-sky-500 to-iris-500 text-white text-xs font-bold hover:opacity-90 transition glow-blue">
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          إنشاء سريع
        </button>

        {/* صورة الملف الشخصي */}
        <button className="relative shrink-0" onClick={onLogout} title="تسجيل الخروج">
          <div className="w-9 h-9 overflow-hidden rounded-xl bg-gradient-to-br from-sky-500 to-iris-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white/10 hover:ring-sky-400/40 transition">
            {profile?.picture ? <img src={profile.picture} alt={profile.name || "المعلم"} className="w-full h-full object-cover" /> : (profile?.name || "م").charAt(0)}
          </div>
          <span className="absolute -bottom-0.5 -left-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-ink-900" />
        </button>
      </div>
    </header>
  );
}
