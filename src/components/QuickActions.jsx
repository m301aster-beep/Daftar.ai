import { ArrowLeft } from "lucide-react";
import { quickActions } from "@/data/mockData";

const imageMap = {
  exam: "./icons/cropped/ai-studio.png",
  lesson: "./icons/cropped/dashboard.png",
  worksheet: "./icons/cropped/students.png",
  homework: "./icons/cropped/students.png",
};

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
          return (
            <button
              key={action.id}
              onClick={() => onPick(action)}
              className="group relative flex min-h-[190px] flex-col items-center justify-center overflow-hidden rounded-2xl bg-ink-800/60 border border-white/5 p-4 text-center hover:border-sky-400/30 hover:bg-ink-750/60 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-sky-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex flex-col items-center">
                <div className="mb-2 flex h-28 w-28 items-center justify-center">
                  <span className="relative mb-2 flex h-28 w-28 items-center justify-center">
                    <img
                      src={`${imageMap[action.id]}?v=cropped1`}
                      alt=""
                      className="icon-art icon-art-float h-28 w-28 object-contain transition duration-300 group-hover:scale-110"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                        event.currentTarget.nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                    <span className="hidden text-3xl text-sky-300" aria-hidden="true">✦</span>
                  </span>
                </div>
                <h4 className="text-base font-extrabold text-white">{action.title}</h4>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
