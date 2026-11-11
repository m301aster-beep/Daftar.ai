import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import DashboardStats from "@/components/DashboardStats";
import QuickActions from "@/components/QuickActions";
import AIStudio from "@/components/AIStudio";
import SearchEngineModal from "@/components/SearchEngineModal";
import StudentsTable from "@/components/StudentsTable";
import AutomationPanel from "@/components/AutomationPanel";
import TeacherTools from "@/components/TeacherTools";
import { Sparkles, ArrowLeft, GraduationCap } from "lucide-react";
import { getLanguage, translations, getTheme } from "@/lib/i18n";
import AuthGate from "@/components/AuthGate";
import { useTeacher } from "@/lib/teacherContext";
import { loadTeacherData } from "@/lib/api";
import TeacherProfilePanel from "@/components/TeacherProfilePanel";

// عناوين الأقسام
const titles = {
  dashboard: "لوحة التحكم",
  generator: "الاستوديو الذكي",
  tools: "أدوات المدرس",
  students: "إدارة الطلاب",
  archive: "أرشيف الدروس",
  automation: "الأتمتة المجدولة",
  reports: "التقارير",
  settings: "الإعدادات",
};

function Workspace() {
  const { profile, logout } = useTeacher();
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  // أداة مختارة من بطاقة الوصول السريع
  const [selectedTool, setSelectedTool] = useState("exam");
  const [preset, setPreset] = useState(null);
  const [seedTopic, setSeedTopic] = useState("");
  // مفتاح لإجبار الاستوديو على إعادة التهيئة عند تبديل الأداة
  const [studioKey, setStudioKey] = useState(0);
  const [language, setLanguage] = useState(getLanguage);
  const [theme, setTheme] = useState(getTheme);
  const [remoteData, setRemoteData] = useState({ dashboard: null, students: [] });
  const pageTitles = translations[language].titles;

  // اختصار لوحة المفاتيح لفتح البحث (Cmd/Ctrl + K)
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    const onLanguageChange = (event) => setLanguage(event.detail);
    const onThemeChange = (event) => setTheme(event.detail);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.dataset.theme = theme;
    window.addEventListener("teacherai-language-change", onLanguageChange);
    window.addEventListener("teacherai-theme-change", onThemeChange);
    return () => {
      window.removeEventListener("teacherai-language-change", onLanguageChange);
      window.removeEventListener("teacherai-theme-change", onThemeChange);
    };
  }, [language, theme]);

  useEffect(() => {
    loadTeacherData().then(setRemoteData).catch(() => {
      // تبقى بيانات المعاينة متاحة إلى أن يكتمل إعداد مصادقة Google والـ API.
    });
  }, []);

  // عند اختيار أداة من بطاقات الوصول السريع
  const handlePickTool = (action) => {
    setSelectedTool(action.toolId);
    setPreset(action.preset ? { ...action.preset, toolId: action.toolId } : null);
    setStudioKey((k) => k + 1);
    setActive("generator");
  };

  const handlePickSeedTopic = (topic) => {
    setSeedTopic(topic);
    setActive("generator");
  };

  const handleOpenTeacherTool = (tool) => {
    if (["exam", "lesson", "worksheet"].includes(tool.id)) {
      handlePickTool({ toolId: tool.id });
      return;
    }
    if (["students", "reports"].includes(tool.id)) {
      setActive(tool.id);
      return;
    }
    setActive("tools");
  };

  return (
    <div className="flex min-h-screen bg-ink-900 text-slate-100 bg-grid">
      <div className="pointer-events-none fixed inset-0 bg-radial-fade" />

      <Sidebar
        active={active}
        onSelect={setActive}
        onLogout={logout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="relative flex-1 flex flex-col min-w-0">
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          onSearchClick={() => setSearchOpen(true)}
          title={pageTitles[active] || pageTitles.dashboard}
          profile={profile}
          onLogout={logout}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
            {/* ====== لوحة التحكم ====== */}
            {active === "dashboard" && (
              <>
                <div className="animate-fade-in-up">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                      مساعدك التعليمي الذكي
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                    أهلاً بك {profile?.name || "أيها المعلم"} في <span className="gradient-text">TeacherAI Hub</span>
                  </h1>
                  <p className="text-sm text-slate-400 mt-1.5 max-w-xl">
                    منصتك الذكية لإعداد الاختبارات، تحضير الدروس، وتصميم الأنشطة — متوافقة مع
                    المنهج المصري ومعايير وزارة التربية والتعليم.
                  </p>
                </div>

                <DashboardStats remoteStats={remoteData.dashboard?.metrics && {
                  students: remoteData.dashboard.metrics.students,
                  quizzes: remoteData.dashboard.metrics.published,
                  lessons: remoteData.dashboard.metrics.content,
                  hours: remoteData.dashboard.metrics.teachers,
                }} />

                <QuickActions onPick={handlePickTool} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <AIStudio
                      key={studioKey}
                      selectedTool={selectedTool}
                      preset={preset}
                      seedTopic={seedTopic}
                      onConsumeSeed={() => setSeedTopic("")}
                    />
                  </div>
                  <div className="lg:col-span-1">
                    <AutomationPanel />
                  </div>
                </div>

                <StudentsTable data={remoteData.students} />

                <div className="flex items-center justify-between pt-2 pb-4 text-[11px] text-slate-600">
                  <span>© 2026 TeacherAI Hub — مُصمَّم للمعلم في مصر والعالم العربي</span>
                  <button className="flex items-center gap-1 hover:text-slate-400 transition">
                    مركز المساعدة
                    <ArrowLeft className="w-3 h-3" />
                  </button>
                </div>
              </>
            )}

            {/* ====== الاستوديو الذكي ====== */}
            {active === "generator" && (
              <div className="space-y-6 animate-fade-in-up">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <GraduationCap className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                      الاستوديو التعليمي
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                    مولد المحتوى التعليمي الذكي
                  </h1>
                  <p className="text-sm text-slate-400 mt-1.5 max-w-xl">
                    اختر الأداة، أدخل بيانات الدرس، واحصل على مخرج جاهز للاستخدام المباشر —
                    اختبارًا بنموذج إجابة، أو تحضير درس متكامل، أو ورقة عمل منسقة.
                  </p>
                </div>
                <QuickActions onPick={handlePickTool} />
                <AIStudio
                  key={studioKey}
                  selectedTool={selectedTool}
                  preset={preset}
                  seedTopic={seedTopic}
                  onConsumeSeed={() => setSeedTopic("")}
                />
              </div>
            )}

            {/* ====== مركز أدوات المدرس ====== */}
            {active === "tools" && (
              <div className="animate-fade-in-up">
                <TeacherTools onOpen={handleOpenTeacherTool} language={language} />
              </div>
            )}

            {/* ====== الطلاب ====== */}
            {active === "students" && (
              <div className="space-y-6 animate-fade-in-up">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                    إدارة الطلاب
                  </h1>
                  <p className="text-sm text-slate-400 mt-1.5">
                    تتبّع أداء طلابك ودرجات أعمال السنة عبر الاختبارات المختلفة.
                  </p>
                </div>
                <DashboardStats remoteStats={remoteData.dashboard?.metrics && {
                  students: remoteData.dashboard.metrics.students,
                  quizzes: remoteData.dashboard.metrics.published,
                  lessons: remoteData.dashboard.metrics.content,
                  hours: remoteData.dashboard.metrics.teachers,
                }} />
                <StudentsTable data={remoteData.students} />
              </div>
            )}

            {/* ====== الأرشيف ====== */}
            {active === "archive" && (
              <div className="space-y-6 animate-fade-in-up">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                    أرشيف الدروس والاختبارات
                  </h1>
                  <p className="text-sm text-slate-400 mt-1.5">
                    ابحث في كل ما أنشأته من دروس، اختبارات، وأوراق عمل.
                  </p>
                </div>
                <button
                  onClick={() => setSearchOpen(true)}
                  className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl bg-ink-800/60 border border-white/5 hover:border-sky-400/30 transition text-right group"
                >
                  <Sparkles className="w-5 h-5 text-sky-400" />
                  <span className="text-sm text-slate-400 group-hover:text-white transition">
                    اضغط للبحث في الأرشيف...
                  </span>
                </button>
              </div>
            )}

            {/* ====== الأتمتة ====== */}
            {active === "automation" && (
              <div className="space-y-6 animate-fade-in-up max-w-3xl">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                    الأتمتة المجدولة
                  </h1>
                  <p className="text-sm text-slate-400 mt-1.5">
                    اجعل المهام المتكررة كإرسال التقارير ومزامنة الدرجات تعمل تلقائياً.
                  </p>
                </div>
                <AutomationPanel />
              </div>
            )}

            {/* ====== أقسام قيد الإنشاء ====== */}
            {active === "settings" && (
              <div className="space-y-6 animate-fade-in-up max-w-2xl">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">إعدادات التطبيق</h1>
                  <p className="text-sm text-slate-400 mt-1.5">خصص اسمك وصورتك وشعار المساحة التعليمية.</p>
                </div>
                <TeacherProfilePanel />
              </div>
            )}

            {active === "reports" && (
              <div className="flex flex-col items-center justify-center py-32 animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500/15 to-iris-500/15 border border-white/5 flex items-center justify-center mb-4">
                  <Sparkles className="w-7 h-7 text-sky-400" />
                </div>
                <h2 className="text-lg font-bold text-white">{pageTitles[active]}</h2>
                <p className="text-sm text-slate-400 mt-1.5">
                  هذا القسم قيد التطوير — قريباً بإذن الله.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      <SearchEngineModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}

export default function App() {
  return <AuthGate><Workspace /></AuthGate>;
}
