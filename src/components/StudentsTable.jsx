import { useState } from "react";
import {
  MoreVertical,
  Filter,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  CircleCheck,
} from "lucide-react";
import { students } from "@/data/mockData";

// ألوان مستوى الطالب
const levelStyles = {
  متقدم: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  متوسط: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  "يحتاج دعماً": "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const statusIcon = {
  active: { Icon: CircleCheck, color: "text-emerald-400", label: "نشط" },
  review: { Icon: TrendingUp, color: "text-sky-400", label: "قيد المراجعة" },
  warning: { Icon: AlertTriangle, color: "text-amber-400", label: "تنبيه" },
};

/** جدول الطلاب مع تتبع التقدّم والنتائج */
export default function StudentsTable({ data } = {}) {
  const [page, setPage] = useState(1);
  const perPage = 5;
  const rows = data?.length ? data.map((student) => ({
    ...student,
    level: student.level || "متوسط",
    progress: student.progress ?? 0,
    lastQuiz: student.lastQuiz || "لم يبدأ بعد",
    score: student.score ?? 0,
    status: student.status || "active",
  })) : students;
  const totalPages = Math.max(1, Math.ceil(rows.length / perPage));
  const pageItems = rows.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="rounded-2xl bg-ink-800/50 border border-white/5 shadow-card overflow-hidden">
      {/* رأس */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-white/5">
        <div>
          <h3 className="text-sm font-bold text-white">أحدث الطلاب</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            تتبّع أداء الطلاب ونتائج آخر اختبار
          </p>
        </div>
        <button className="flex items-center gap-1.5 text-[11px] font-medium text-slate-300 px-3 py-1.5 rounded-lg bg-ink-700/50 border border-white/5 hover:text-white hover:border-white/10 transition">
          <Filter className="w-3.5 h-3.5" />
          تصفية
        </button>
      </div>

      {/* الجدول */}
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead>
            <tr className="border-b border-white/5">
              {["الطالب", "الصف", "المستوى", "التقدّم", "آخر اختبار", "النتيجة", ""].map(
                (h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {pageItems.map((s, i) => {
              const st = statusIcon[s.status];
              return (
                <tr
                  key={s.id}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition group animate-fade-in"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  {/* الطالب */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-500/30 to-iris-500/30 border border-white/5 flex items-center justify-center text-xs font-bold text-white shrink-0">
                        {s.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-slate-100 whitespace-nowrap">
                        {s.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-400 whitespace-nowrap">
                    {s.grade}
                  </td>
                  {/* المستوى */}
                  <td className="px-5 py-3.5">
                    <span
                      className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border ${
                        levelStyles[s.level] || levelStyles["متوسط"]
                      }`}
                    >
                      {s.level}
                    </span>
                  </td>
                  {/* شريط التقدّم */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2 w-32">
                      <div className="flex-1 h-1.5 rounded-full bg-ink-700 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            s.progress >= 80
                              ? "bg-gradient-to-l from-emerald-400 to-emerald-500"
                              : s.progress >= 60
                              ? "bg-gradient-to-l from-sky-400 to-sky-500"
                              : "bg-gradient-to-l from-amber-400 to-amber-500"
                          }`}
                          style={{ width: `${s.progress}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-slate-300 tabular-nums w-8">
                        {s.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-400 whitespace-nowrap">
                    {s.lastQuiz}
                  </td>
                  {/* النتيجة */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <st.Icon className={`w-3.5 h-3.5 ${st.color}`} />
                      <span className="text-sm font-bold text-slate-100 tabular-nums">
                        {s.score}
                      </span>
                      <span className="text-[11px] text-slate-500">/ 20</span>
                    </div>
                  </td>
                  {/* قائمة */}
                  <td className="px-5 py-3.5">
                    <button className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition opacity-0 group-hover:opacity-100">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ترقيم الصفحات */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
        <p className="text-[11px] text-slate-500">
          عرض {(page - 1) * perPage + 1}–{Math.min(page * perPage, rows.length)} من{" "}
          {rows.length}
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={[
                "w-8 h-8 rounded-lg text-xs font-bold transition",
                page === n
                  ? "bg-sky-500/15 text-sky-400 border border-sky-400/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5",
              ].join(" ")}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
