import { useState, useEffect, useRef, useMemo } from "react";
import {
  Search,
  X,
  BookOpen,
  FileText,
  ClipboardList,
  Folder,
  BarChart3,
  CornerDownLeft,
  Clock,
} from "lucide-react";
import { archiveItems } from "@/data/mockData";

const iconMap = {
  BookOpen,
  FileText,
  ClipboardList,
  Folder,
  BarChart3,
};

// ألوان حسب نوع العنصر
const typeStyles = {
  درس: "text-sky-400 bg-sky-500/10",
  اختبار: "text-iris-400 bg-iris-500/10",
  واجب: "text-amber-400 bg-amber-500/10",
  ملف: "text-slate-300 bg-white/5",
  تقرير: "text-emerald-400 bg-emerald-500/10",
};

/**
 * نافذة البحث المنبثقة (Command Palette) للبحث في الأرشيف.
 * تُفتح من Navbar، وتدعم الإغلاق بمفتاح Escape.
 */
export default function SearchEngineModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);

  // تركيز تلقائي عند الفتح
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // إغلاق بمفتاح Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // تصفية النتائج حسب البحث
  const results = useMemo(() => {
    if (!query.trim()) return archiveItems;
    const q = query.trim().toLowerCase();
    return archiveItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q)
    );
  }, [query]);

  // التنقل بالأسهم
  useEffect(() => {
    const handler = (e) => {
      if (!isOpen) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, results.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4 animate-fade-in">
      {/* خلفية معتمة */}
      <div
        className="absolute inset-0 bg-ink-950/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* النافذة */}
      <div className="relative w-full max-w-xl animate-scale-in">
        <div className="overflow-hidden rounded-2xl bg-ink-850/95 backdrop-blur-xl border border-white/10 shadow-2xl">
          {/* حقل البحث */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5">
            <Search className="w-5 h-5 text-sky-400 shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              placeholder="ابحث في دروسك، اختباراتك، واجباتك، وملفاتك..."
              className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 outline-none"
            />
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* النتائج */}
          <div className="max-h-[50vh] overflow-y-auto p-2">
            {results.length === 0 ? (
              <div className="py-12 text-center">
                <Search className="w-8 h-8 text-slate-700 mx-auto mb-3" />
                <p className="text-sm text-slate-500">
                  لا توجد نتائج لـ &quot;{query}&quot;
                </p>
              </div>
            ) : (
              <>
                <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  {query.trim() ? "نتائج البحث" : "عمليات بحث أخيرة"}
                </p>
                {results.map((item, i) => {
                  const Icon = iconMap[item.icon] || FileText;
                  const isActive = i === activeIndex;
                  return (
                    <button
                      key={item.id}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={[
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-right transition",
                        isActive ? "bg-sky-500/10" : "hover:bg-white/5",
                      ].join(" ")}
                    >
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          typeStyles[item.type] || typeStyles["ملف"]
                        }`}
                      >
                        <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium truncate ${
                            isActive ? "text-white" : "text-slate-200"
                          }`}
                        >
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span className="font-medium text-slate-400">
                            {item.type}
                          </span>
                          ·
                          <span>{item.subject}</span>
                          ·
                          <Clock className="w-3 h-3" />
                          {item.date}
                        </p>
                      </div>
                      {isActive && (
                        <CornerDownLeft className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </>
            )}
          </div>

          {/* تذييل بمفاتيح الاختصار */}
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/5 bg-ink-900/50">
            <div className="flex items-center gap-3 text-[10px] text-slate-500">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-ink-700 border border-white/5 font-mono">
                  ↑↓
                </kbd>
                تنقّل
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-ink-700 border border-white/5 font-mono">
                  ↵
                </kbd>
                اختيار
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-ink-700 border border-white/5 font-mono">
                  esc
                </kbd>
                إغلاق
              </span>
            </div>
            <span className="text-[10px] text-slate-600">
              {results.length} نتيجة
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
