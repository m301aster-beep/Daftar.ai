export const translations = {
  ar: {
    language: "العربية",
    switchLanguage: "English",
    nav: {
      dashboard: "لوحة التحكم",
      generator: "الاستوديو الذكي",
      tools: "أدوات المدرس",
      students: "الطلاب",
      archive: "الأرشيف",
      automation: "الأتمتة",
      reports: "التقارير",
      settings: "الإعدادات",
    },
    titles: {
      dashboard: "لوحة التحكم",
      generator: "الاستوديو الذكي",
      tools: "أدوات المدرس",
      students: "الطلاب",
      archive: "الأرشيف",
      automation: "الأتمتة",
      reports: "التقارير",
      settings: "الإعدادات",
    },
  },
  en: {
    language: "English",
    switchLanguage: "العربية",
    nav: {
      dashboard: "Dashboard",
      generator: "Smart Studio",
      tools: "Teacher Tools",
      students: "Students",
      archive: "Archive",
      automation: "Automation",
      reports: "Reports",
      settings: "Settings",
    },
    titles: {
      dashboard: "Dashboard",
      generator: "Smart Studio",
      tools: "Teacher Tools",
      students: "Students",
      archive: "Archive",
      automation: "Automation",
      reports: "Reports",
      settings: "Settings",
    },
  },
};

export function getLanguage() {
  if (typeof window === "undefined") return "ar";
  return window.localStorage.getItem("teacherai-language") || "ar";
}

export function setLanguage(language) {
  window.localStorage.setItem("teacherai-language", language);
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  window.dispatchEvent(new CustomEvent("teacherai-language-change", { detail: language }));
}

export function getTheme() {
  if (typeof window === "undefined") return "light";
  return window.localStorage.getItem("teacherai-theme") || "light";
}

export function setTheme(theme) {
  window.localStorage.setItem("teacherai-theme", theme);
  document.documentElement.dataset.theme = theme;
  window.dispatchEvent(new CustomEvent("teacherai-theme-change", { detail: theme }));
}
