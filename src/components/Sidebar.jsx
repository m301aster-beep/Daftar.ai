import { useEffect, useState } from "react";
import { BarChart3, BookOpen, BrainCircuit, FolderOpen, GraduationCap, Languages, LayoutDashboard, LogOut, Moon, Settings, Sparkles, Sun, UserRound, Users, Workflow, X } from "lucide-react";
import { navItems } from "@/data/mockData";
import { getLanguage, setLanguage, translations, getTheme, setTheme } from "@/lib/i18n";

const icons = { LayoutDashboard, Sparkles, Users, FolderOpen, Workflow, UserRound, BookOpen, BrainCircuit, BarChart3, Settings };

export default function Sidebar({ active, onSelect, onLogout, isOpen, onClose, profile }) {
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

  return <>
    {isOpen && <button aria-label="إغلاق القائمة" className="sidebar-backdrop" onClick={onClose} />}
    <aside className={["app-sidebar", isOpen ? "is-open" : ""].join(" ")}>
      <div className="sidebar-brand">
        <div className="brand-mark"><GraduationCap size={19} /></div>
        <div><strong>Daftar AI</strong><span>مساحة المعلم</span></div>
        <button className="sidebar-close" onClick={onClose} aria-label="إغلاق"><X size={18} /></button>
      </div>
      <div className="sidebar-profile">
        <div className="avatar avatar-sm">{profile?.picture ? <img src={profile.picture} alt={profile.name || "المعلم"} /> : (profile?.name || "م").charAt(0)}</div>
        <div className="min-w-0"><strong>{profile?.name || "ملف المعلم"}</strong><span>{profile?.organization || "الكونية"}</span></div>
      </div>
      <nav className="sidebar-nav" aria-label="التنقل الرئيسي">
        <span className="sidebar-label">مساحة العمل</span>
        {navItems.map((item) => {
          const Icon = icons[item.icon] || LayoutDashboard;
          return <button key={item.id} className={active === item.id ? "active" : ""} onClick={() => { onSelect(item.id); onClose(); }}>
            <Icon size={18} strokeWidth={active === item.id ? 2.4 : 2} />
            <span>{t.nav[item.id] || item.label}</span>
            {item.id === "generator" && <small>AI</small>}
          </button>;
        })}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-actions">
          <button onClick={() => setLanguage(language === "ar" ? "en" : "ar")}><Languages size={16} />{t.switchLanguage}</button>
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="تبديل المظهر">{theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}{theme === "dark" ? "نهاري" : "ليلي"}</button>
        </div>
        <button className="sidebar-logout" onClick={onLogout}><LogOut size={16} />تسجيل الخروج</button>
      </div>
    </aside>
  </>;
}
