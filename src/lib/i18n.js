export const translations = {
  ar: {
    language: "العربية",
    switchLanguage: "English",
    nav: {
      dashboard: "الرئيسية",
      generator: "الاستوديو",
      tools: "الأدوات",
      students: "الطلاب",
      archive: "المحفوظات",
      automation: "الأتمتة",
      reports: "التقارير",
      settings: "البروفايل",
    },
    titles: {
      dashboard: "الرئيسية",
      generator: "الاستوديو",
      tools: "الأدوات",
      students: "الطلاب",
      archive: "المحفوظات",
      automation: "الأتمتة",
      reports: "التقارير",
      settings: "البروفايل",
    },
  },
  en: {
    language: "English",
    switchLanguage: "العربية",
    nav: {
      dashboard: "Home",
      generator: "Studio",
      tools: "Tools",
      students: "Students",
      archive: "Saved",
      automation: "Automation",
      reports: "Reports",
      settings: "Profile",
    },
    titles: {
      dashboard: "Home",
      generator: "Studio",
      tools: "Tools",
      students: "Students",
      archive: "Saved",
      automation: "Automation",
      reports: "Reports",
      settings: "Profile",
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
