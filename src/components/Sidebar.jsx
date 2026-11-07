import {
  LayoutDashboard,
  Sparkles,
  Users,
  FileText,
  FolderOpen,
  Workflow,
  BarChart3,
  Settings,
  GraduationCap,
  X,
  HelpCircle,
} from "lucide-react";
import { navItems } from "@/data/mockData";

// خريطة الأيقونات لتحويل الأسماء النصية إلى مكونات
const iconMap = {
  LayoutDashboard,
  Sparkles,
  Users,
  FileText,
  FolderOpen,
  Workflow,
  BarChart3,
  Settings,
};

/**
 * الشريط الجانبي للتنقل بين أقسام المنصة.
 * يدعم وضع الموبايل (يُمرّر isOpen + onClose من الأب).
 */
export default function Sidebar({ active, onSelect, isOpen, onClose }) {
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
                TeacherAI
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">منصة المعلم الذكية</p>
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
            const Icon = iconMap[item.icon] || LayoutDashboard;
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
                <Icon
                  className={[
                    "w-[18px] h-[18px] shrink-0 transition",
                    isActive
                      ? "text-sky-400"
                      : "text-slate-500 group-hover:text-slate-300",
                  ].join(" ")}
                  strokeWidth={2}
                />
                <span>{item.label}</span>
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

          <button className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition">
            <HelpCircle className="w-4 h-4" />
            مركز المساعدة
          </button>
        </div>
      </aside>
    </>
  );
}
