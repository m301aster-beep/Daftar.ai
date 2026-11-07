import {
  FileText,
  BookOpen,
  ClipboardList,
  House,
  ArrowLeft,
} from "lucide-react";
import { quickActions } from "@/data/mockData";

const iconMap = { FileText, BookOpen, ClipboardList, House };

/** بطاقات الوصول السريع للأدوات التعليمية الثلاث + الواجب المنزلي */
export default function QuickActions({ onPick }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-white">وصول سريع للأدوات</h3>
        <button className="text-[11px] font-medium text-sky-400 hover:text-sky-300 transition flex items-center gap-1">
          كل الأدوات
          <ArrowLeft className="w-3 h-3" />
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {quickActions.map((action, i) => {
          const Icon = iconMap[action.icon] || FileText;
          return (
            <button
              key={action.id}
              onClick={() => onPick(action)}
              className="group text-right relative overflow-hidden rounded-2xl bg-ink-800/60 border border-white/5 p-4 hover:border-sky-400/30 hover:bg-ink-750/60 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-sky-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-9 h-9 rounded-lg bg-ink-700/80 border border-white/5 flex items-center justify-center mb-3 group-hover:bg-sky-500/15 group-hover:border-sky-400/20 transition">
                  <Icon className="w-[18px] h-[18px] text-sky-400" strokeWidth={2} />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{action.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                  {action.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
