import {
  Award,
  BarChart3,
  BellRing,
  BookMarked,
  BookOpenCheck,
  BrainCircuit,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CheckSquare,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  FileSpreadsheet,
  FileText,
  FolderKanban,
  Goal,
  HeartHandshake,
  LayoutGrid,
  Library,
  ListChecks,
  MessageCircle,
  MessageSquareText,
  NotebookPen,
  PenLine,
  Presentation,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  Table2,
  UserCheck,
  UsersRound,
} from "lucide-react";
import { useMemo, useState } from "react";

const toolGroups = [
  {
    id: "planning",
    title: "التخطيط والتحضير",
    tools: [
      ["lesson", "محضر الدرس الذكي", "Smart Lesson Plan", "نواتج تعلم وتمهيد وأنشطة وتقويم في خطة واحدة.", BookOpenCheck, "sky", "الاستوديو"],
      ["unit", "خطة الوحدة", "Unit Planner", "قسّم الوحدة إلى دروس ومهارات ونواتج تعلم قابلة للقياس.", Goal, "violet", "جديد"],
      ["weekly", "المخطط الأسبوعي", "Weekly Planner", "رتّب حصصك وواجباتك وأهداف الأسبوع في جدول واضح.", CalendarClock, "amber", "جديد"],
      ["activity", "مصمم الأنشطة", "Activity Designer", "أنشطة تعلم نشط وتعاوني تناسب زمن الحصة.", BrainCircuit, "violet", "جديد"],
      ["presentation", "مخطط العرض", "Presentation Planner", "هيكل عرض مبسط مع نقاط شرح وأسئلة تفاعلية.", Presentation, "amber", "جديد"],
      ["objectives", "كاتب نواتج التعلم", "Learning Objectives", "حوّل موضوع الدرس إلى أهداف سلوكية قابلة للقياس.", ListChecks, "emerald", "جديد"],
      ["differentiation", "التعليم المتمايز", "Differentiation", "خطط أنشطة مختلفة للمتقدم والمتوسط ومن يحتاج دعمًا.", LayoutGrid, "indigo", "جديد"],
      ["substitute", "خطة المعلم البديل", "Substitute Plan", "ملف جاهز يشرح الحصة والأنشطة والتكليفات عند غيابك.", NotebookPen, "rose", "جديد"],
    ],
  },
  {
    id: "assessment",
    title: "التقييم والواجبات",
    tools: [
      ["exam", "مولد الاختبارات", "Quiz Generator", "اختبارات متنوعة مع نموذج إجابة وتوزيع درجات.", ClipboardCheck, "sky", "الاستوديو"],
      ["worksheet", "أوراق العمل", "Worksheets", "تدريبات صفية وواجبات قابلة للطباعة.", FileSpreadsheet, "emerald", "الاستوديو"],
      ["question-bank", "بنك الأسئلة", "Question Bank", "أنشئ واحفظ وصنّف الأسئلة حسب الوحدة ومستوى الصعوبة.", FolderKanban, "violet", "جديد"],
      ["rubric", "سلم التقدير", "Rubric Builder", "معايير تقييم واضحة للمشروعات والمهارات.", ShieldCheck, "rose", "جديد"],
      ["gradebook", "دفتر الدرجات", "Gradebook", "سجل الدرجات مع المتوسطات والنتائج والتحليل.", Table2, "indigo", "جديد"],
      ["exit-ticket", "بطاقة الخروج", "Exit Ticket", "أسئلة قصيرة تقيس فهم الطلاب في آخر دقائق الحصة.", CheckSquare, "amber", "جديد"],
      ["oral", "التقييم الشفهي", "Oral Assessment", "أسئلة وملاحظات لتقييم المشاركة والشرح الشفهي.", MessageCircle, "sky", "جديد"],
      ["homework", "متابع الواجبات", "Homework Tracker", "تابع التسليم والتأخير وأرسل التذكيرات بسهولة.", ClipboardList, "emerald", "جديد"],
    ],
  },
  {
    id: "classroom",
    title: "إدارة الصف والطلاب",
    tools: [
      ["students", "ملفات الطلاب", "Student Profiles", "ملاحظات ومستويات وحضور ومتابعة فردية.", UsersRound, "indigo", "الطلاب"],
      ["attendance", "الحضور والغياب", "Attendance", "سجل يومي سريع مع ملخصات وتنبيهات للمتابعة.", CalendarDays, "amber", "جديد"],
      ["behavior", "سجل السلوك", "Behavior Log", "وثّق السلوك والمواقف وخطة المتابعة بشكل مهني.", UserCheck, "rose", "جديد"],
      ["seating", "مخطط الجلوس", "Seating Chart", "رتّب أماكن الطلاب وأنشئ توزيعًا مناسبًا للصف.", LayoutGrid, "violet", "جديد"],
      ["intervention", "خطة الدعم", "Support Plan", "تدخلات علاجية للطلاب الذين يحتاجون مساندة.", HeartHandshake, "rose", "جديد"],
      ["participation", "مشاركة الطلاب", "Participation Tracker", "سجل المشاركة والتفاعل داخل الحصة.", Sparkles, "emerald", "جديد"],
      ["goals", "أهداف الطالب", "Student Goals", "أهداف فردية ومؤشرات تقدم لكل طالب.", Goal, "sky", "جديد"],
      ["class-rules", "ميثاق الصف", "Class Charter", "أنشئ قواعد الصف واتفاقيات الاحترام والتعاون.", ShieldCheck, "amber", "جديد"],
    ],
  },
  {
    id: "communication",
    title: "التواصل والتقارير",
    tools: [
      ["reports", "تقارير الأداء", "Performance Reports", "ملخصات مفهومة للطالب وولي الأمر والإدارة.", BarChart3, "emerald", "التقارير"],
      ["communication", "رسائل أولياء الأمور", "Parent Messages", "رسائل جاهزة ومحترمة حسب الموقف التعليمي.", MessageSquareText, "violet", "جديد"],
      ["announcement", "إعلانات الصف", "Class Announcements", "اكتب إعلانًا وأرسله للطلاب أو أولياء الأمور.", BellRing, "amber", "جديد"],
      ["meeting", "محضر الاجتماع", "Meeting Notes", "جدول أعمال ومحضر متابعة لاجتماعات أولياء الأمور.", NotebookPen, "sky", "جديد"],
      ["certificate", "الشهادات والتكريم", "Certificates", "شهادات إنجاز وتقدير قابلة للطباعة والمشاركة.", Award, "rose", "جديد"],
      ["progress", "ملخص التقدم", "Progress Summary", "ملخص سريع لتطور الطالب ونقاط القوة والتحسين.", FileText, "indigo", "جديد"],
    ],
  },
  {
    id: "organization",
    title: "التنظيم والموارد",
    tools: [
      ["resources", "بنك الموارد", "Resource Bank", "نظّم الروابط والملفات والمصادر حسب المادة.", Library, "sky", "جديد"],
      ["schedule", "جدول الحصص", "Class Schedule", "جدول الحصص والمهام والمواعيد في شاشة واحدة.", CalendarCheck, "emerald", "جديد"],
      ["content-calendar", "تقويم المحتوى", "Content Calendar", "خطط نشر الدروس والواجبات والاختبارات طوال الشهر.", CalendarClock, "violet", "جديد"],
      ["teacher-notes", "دفتر ملاحظات المعلم", "Teacher Notes", "أفكار وملاحظات سريعة مع تصنيف وبحث.", PenLine, "amber", "جديد"],
      ["exam-calendar", "تقويم الاختبارات", "Exam Calendar", "رتّب مواعيد الاختبارات والمراجعات بدون تعارض.", CalendarDays, "rose", "جديد"],
      ["automation", "الأتمتة", "Automation", "تذكيرات وتقارير ومزامنة تعمل في مواعيدها.", Settings2, "indigo", "الأتمتة"],
      ["time", "مخطط الوقت", "Time Planner", "وزّع وقت التصحيح والتحضير والمتابعة بذكاء.", Clock3, "emerald", "جديد"],
      ["school-report", "تقرير الإدارة", "School Report", "ملف منظم لأداء الصف والإنجازات والاحتياجات.", Send, "sky", "جديد"],
    ],
  },
];

const colorClasses = {
  sky: "bg-sky-500/10 text-sky-300 border-sky-400/20",
  violet: "bg-violet-500/10 text-violet-300 border-violet-400/20",
  amber: "bg-amber-500/10 text-amber-300 border-amber-400/20",
  emerald: "bg-emerald-500/10 text-emerald-300 border-emerald-400/20",
  rose: "bg-rose-500/10 text-rose-300 border-rose-400/20",
  indigo: "bg-indigo-500/10 text-indigo-300 border-indigo-400/20",
};

const allTeacherTools = toolGroups.flatMap((group) => group.tools.map((tool) => ({
  id: tool[0], title: tool[1], titleEn: tool[2], desc: tool[3], icon: tool[4], color: tool[5], action: tool[6], group: group.title,
})));

export default function TeacherTools({ onOpen, language = "ar", activeTool }) {
  const isEnglish = language === "en";
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const filteredGroups = useMemo(() => toolGroups.map((group) => ({
    ...group,
    tools: group.tools.filter((tool) => {
      const matchesCategory = category === "all" || category === group.id;
      const text = `${tool[1]} ${tool[2]} ${tool[3]}`.toLowerCase();
      return matchesCategory && (!query.trim() || text.includes(query.trim().toLowerCase()));
    }),
  })).filter((group) => group.tools.length), [category, query]);
  const selected = activeTool || allTeacherTools[0];

  return (
    <section className="space-y-5">
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-l from-sky-500/10 via-ink-800/70 to-ink-800/50 p-5 sm:p-6">
        <div className="absolute -left-10 -top-16 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-300 shadow-[0_0_45px_rgba(56,189,248,0.16)]"><BrainCircuit className="h-8 w-8" /></div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300">{isEnglish ? "Teacher Tools Hub" : "مركز أدوات المعلم"}</span>
            <h2 className="mt-1 text-xl font-extrabold text-white">{isEnglish ? "Every tool for your teaching day" : "كل أدوات يومك التعليمي في مكان واحد"}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-400">{isEnglish ? "Plan, teach, assess, follow up, communicate, and organize your work from one clear workspace." : "خطط، حضّر، قيّم، تابع، تواصل، ونظّم عملك من مساحة واحدة واضحة بدل التنقل بين أدوات متفرقة."}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-ink-800/45 p-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={isEnglish ? "Search teacher tools..." : "ابحث عن أداة: حضور، درجات، تقرير، واجب..."} className="w-full rounded-xl border border-white/5 bg-ink-900/60 py-3 pl-3 pr-10 text-sm text-white outline-none placeholder:text-slate-600 focus:border-sky-400/30" />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-xl border border-white/5 bg-ink-900/60 px-3 py-3 text-xs text-slate-300 outline-none">
          <option value="all">{isEnglish ? "All categories" : "كل الأقسام"}</option>
          {toolGroups.map((group) => <option key={group.id} value={group.id}>{group.title}</option>)}
        </select>
      </div>

      {activeTool && (
        <div className="flex flex-col gap-4 rounded-2xl border border-sky-400/20 bg-sky-500/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3"><div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${colorClasses[selected.color]}`}><selected.icon className="h-5 w-5" /></div><div><p className="text-sm font-bold text-white">{isEnglish ? selected.titleEn : selected.title}</p><p className="mt-1 text-xs text-slate-400">{isEnglish ? "Ready to open in the connected workspace." : "الأداة جاهزة — اختر فتحها للانتقال إلى القسم المناسب."}</p></div></div>
          <button onClick={() => onOpen?.(selected)} className="flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-sky-400">فتح الأداة <span>←</span></button>
        </div>
      )}

      {filteredGroups.map((group) => (
        <div key={group.id}>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-white"><span className="h-1.5 w-1.5 rounded-full bg-sky-400" />{group.title}<span className="text-[10px] font-normal text-slate-600">{group.tools.length} أدوات</span></h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {group.tools.map((tool) => {
              const [id, title, titleEn, desc, Icon, color, action] = tool;
              return <button key={id} onClick={() => onOpen?.({ id, title, titleEn, desc, icon: Icon, color, action, group: group.title })} className="group rounded-2xl border border-white/5 bg-ink-800/55 p-4 text-right transition hover:-translate-y-0.5 hover:border-sky-400/25 hover:bg-ink-800/80">
                <div className="mb-3 flex items-center justify-between"><div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${colorClasses[color]}`}><Icon className="h-5 w-5" /></div><span className="rounded-full bg-white/5 px-2 py-1 text-[9px] text-slate-500">{action}</span></div>
                <h4 className="text-sm font-bold text-white">{isEnglish ? titleEn : title}</h4>
                <p className="mt-1 text-[11px] leading-6 text-slate-400">{desc}</p>
              </button>;
            })}
          </div>
        </div>
      ))}
      {!filteredGroups.length && <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center text-sm text-slate-500">لا توجد أداة مطابقة للبحث الحالي.</div>}
    </section>
  );
}
