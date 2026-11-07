import { useState } from "react";
import {
  Send,
  RefreshCw,
  BellRing,
  Plus,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { automations } from "@/data/mockData";

const iconMap = { Send, RefreshCw, BellRing };

/**
 * لوحة الأتمتة: عرض المهام المجدولة مع إمكانية تفعيل/إيقاف.
 */
export default function AutomationPanel() {
  const [items, setItems] = useState(automations);

  const toggle = (id) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, enabled: !it.enabled } : it))
    );
  };

  const activeCount = items.filter((i) => i.enabled).length;

  return (
    <div className="rounded-2xl bg-ink-800/50 border border-white/5 shadow-card overflow-hidden">
      {/* رأس */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-iris-500/20 to-sky-500/20 border border-white/5 flex items-center justify-center">
            <RefreshCw className="w-[18px] h-[18px] text-iris-400" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">الأتمتة المجدولة</h3>
            <p className="text-[11px] text-slate-400">
              {activeCount} مهمة نشطة من {items.length}
            </p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-[11px] font-bold text-white px-3 py-1.5 rounded-lg bg-gradient-to-l from-iris-500 to-sky-500 hover:opacity-90 transition">
          <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
          مهمة جديدة
        </button>
      </div>

      {/* القائمة */}
      <div className="p-3 space-y-2">
        {items.map((task, i) => {
          const Icon = iconMap[task.icon] || BellRing;
          return (
            <div
              key={task.id}
              className="group flex items-center gap-3 px-3 py-3 rounded-xl bg-ink-850/40 border border-white/5 hover:border-white/10 transition animate-fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div
                className={[
                  "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition",
                  task.enabled
                    ? "bg-iris-500/15 text-iris-400"
                    : "bg-ink-700/50 text-slate-600",
                ].join(" ")}
              >
                <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-slate-100 truncate">
                    {task.name}
                  </p>
                  {task.enabled && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {task.desc}
                </p>
                <p className="flex items-center gap-1 text-[10px] text-slate-600 mt-1">
                  <Clock className="w-3 h-3" />
                  {task.schedule}
                </p>
              </div>

              {/* مفتاح التبديل */}
              <button
                onClick={() => toggle(task.id)}
                className={[
                  "relative w-10 h-6 rounded-full transition shrink-0",
                  task.enabled
                    ? "bg-gradient-to-l from-sky-500 to-iris-500"
                    : "bg-ink-700",
                ].join(" ")}
                aria-label={task.enabled ? "إيقاف" : "تفعيل"}
              >
                <span
                  className={[
                    "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all",
                    task.enabled ? "right-0.5" : "right-[18px]",
                  ].join(" ")}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
