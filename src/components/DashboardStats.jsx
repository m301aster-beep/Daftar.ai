import { useEffect, useState } from "react";
import {
  Users,
  FileText,
  Search,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { stats } from "@/data/mockData";

const iconMap = { Users, FileText, Search, Clock };

// ي hook بسيط لعدّ الأرقام تدريجياً عند الظهور
function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      // منحنى ease-out
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

function StatCard({ stat, index }) {
  const Icon = iconMap[stat.icon] || Users;
  const animated = useCountUp(stat.value);
  const isInt = Number.isInteger(stat.value);
  const display = isInt ? Math.round(animated) : animated.toFixed(1);

  return (
    <div
      className="group relative animate-fade-in-up"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="relative overflow-hidden rounded-2xl bg-ink-800/60 border border-white/5 p-5 hover:border-white/10 transition-all duration-300 shadow-card">
        {/* توهج خلفي يظهر عند المرور */}
        <div
          className={`absolute -top-12 -left-12 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${stat.accent}`}
        />
        <div className="relative flex items-start justify-between">
          <div
            className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.accent} flex items-center justify-center border border-white/5`}
          >
            <Icon className={`w-5 h-5 ${stat.iconColor}`} strokeWidth={2} />
          </div>
          <span
            className={[
              "flex items-center gap-0.5 text-[11px] font-bold px-2 py-1 rounded-lg",
              stat.changeType === "up"
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-rose-500/10 text-rose-400",
            ].join(" ")}
          >
            {stat.changeType === "up" ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {stat.change}
          </span>
        </div>
        <div className="relative mt-4">
          <p className="text-3xl font-display font-extrabold text-white tracking-tight tabular-nums">
            {display}
          </p>
          <p className="text-xs text-slate-400 mt-1 font-medium">{stat.label}</p>
        </div>
      </div>
    </div>
  );
}

/** شبكة الإحصائيات السريعة في أعلى لوحة التحكم */
export default function DashboardStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <StatCard key={s.id} stat={s} index={i} />
      ))}
    </div>
  );
}
