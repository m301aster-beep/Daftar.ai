import { useEffect, useState } from "react";
import { Bell, Menu, Moon, Search, Sun } from "lucide-react";
import { getTheme, setTheme } from "@/lib/i18n";

export default function Navbar({ onMenuClick, onSearchClick, title, profile, onLogout }) {
  const [theme, setCurrentTheme] = useState(getTheme);
  useEffect(() => {
    const onThemeChange = (event) => setCurrentTheme(event.detail);
    window.addEventListener("teacherai-theme-change", onThemeChange);
    return () => window.removeEventListener("teacherai-theme-change", onThemeChange);
  }, []);
  return <header className="app-header">
    <button className="mobile-menu" onClick={onMenuClick} aria-label="فتح القائمة"><Menu size={20} /></button>
    <div className="header-title"><span>مساحة العمل</span><h1>{title}</h1></div>
    <div className="header-actions">
      <button className="header-search" onClick={onSearchClick}><Search size={17} /><span>بحث</span><kbd>⌘ K</kbd></button>
      <button className="header-icon" aria-label="الإشعارات"><Bell size={17} /><i /></button>
      <button className="header-icon theme-button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="تبديل المظهر">{theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}</button>
      <button className="header-user" onClick={onLogout} title="تسجيل الخروج"><span>{profile?.picture ? <img src={profile.picture} alt={profile.name || "المعلم"} /> : (profile?.name || "م").charAt(0)}</span><strong>{profile?.name || "المعلم"}</strong></button>
    </div>
  </header>;
}
