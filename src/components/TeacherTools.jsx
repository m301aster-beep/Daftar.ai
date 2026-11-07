import {
  BookOpenCheck,
  ClipboardCheck,
  CalendarDays,
  MessageSquareText,
  LineChart,
  UsersRound,
  Library,
  Presentation,
  FileSpreadsheet,
  BrainCircuit,
  School,
  ShieldCheck,
} from "lucide-react";

const toolGroups = [
  {
    title: "التخطيط والتحضير",
    tools: [
      { id: "lesson", title: "محضر الدرس الذكي", desc: "نواتج تعلم، تمهيد، أنشطة وتقويم في خطة واحدة.", icon: BookOpenCheck, color: "sky" },
      { id: "activity", title: "مصمم الأنشطة", desc: "أفكار تعلم نشط وتعاوني مناسبة لزمن الحصة.", icon: BrainCircuit, color: "violet" },
      { id: "presentation", title: "مخطط العرض", desc: "هيكل عرض مبسط مع نقاط شرح وأسئلة تفاعلية.", icon: Presentation, color: "amber" },
    ],
  },
  {
    title: "التقييم والواجبات",
    tools: [
      { id: "exam", title: "مولد الاختبارات", desc: "اختبارات متنوعة مع نموذج إجابة وتوزيع درجات.", icon: ClipboardCheck, color: "sky" },
      { id: "worksheet", title: "أوراق العمل", desc: "تدريبات صفية وواجبات قابلة للطباعة.", icon: FileSpreadsheet, color: "emerald" },
      { id: "rubric", title: "سلم التقدير", desc: "معايير تقييم واضحة للمشروعات والمهارات.", icon: ShieldCheck, color: "rose" },
    ],
  },
  {
    title: "إدارة الصف والطلاب",
    tools: [
      { id: "students", title: "ملفات الطلاب", desc: "ملاحظات، مستويات، حضور ومتابعة فردية.", icon: UsersRound, color: "indigo" },
      { id: "attendance", title: "الحضور والغياب", desc: "سجل يومي سريع مع تنبيهات للمتابعة.", icon: CalendarDays, color: "amber" },
      { id: "intervention", title: "خطة الدعم", desc: "تدخلات علاجية للطلاب الذين يحتاجون مساندة.", icon: School, color: "rose" },
    ],
  },
  {
    title: "التواصل والتحليل",
    tools: [
      { id: "reports", title: "تقارير الأداء", desc: "ملخصات مفهومة للطالب وولي الأمر والإدارة.", icon: LineChart, color: "emerald" },
      { id: "communication", title: "رسائل أولياء الأمور", desc: "رسائل جاهزة ومحترمة حسب الموقف التعليمي.", icon: MessageSquareText, color: "violet" },
      { id: "resources", title: "بنك الموارد", desc: "تنظيم الروابط والملفات والمصادر حسب المادة.", icon: Library, color: "sky" },
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

const englishCopy = {
  "التخطيط والتحضير": "Planning & Preparation",
  "التقييم والواجبات": "Assessment & Homework",
  "إدارة الصف والطلاب": "Classroom & Students",
  "التواصل والتحليل": "Communication & Analytics",
  "محضر الدرس الذكي": ["Smart Lesson Plan", "Learning outcomes, warm-up, activities, and assessment in one plan."],
  "مصمم الأنشطة": ["Activity Designer", "Active and collaborative learning ideas for your lesson time."],
  "مخطط العرض": ["Presentation Planner", "A clear presentation outline with teaching notes and questions."],
  "مولد الاختبارات": ["Quiz Generator", "Mixed assessments with an answer key and mark distribution."],
  "أوراق العمل": ["Worksheets", "Printable class exercises and homework activities."],
  "سلم التقدير": ["Rubric Builder", "Clear criteria for projects, skills, and performance tasks."],
  "ملفات الطلاب": ["Student Profiles", "Notes, levels, attendance, and individual follow-up."],
  "الحضور والغياب": ["Attendance", "A quick daily register with follow-up reminders."],
  "خطة الدعم": ["Support Plan", "Targeted interventions for students who need extra support."],
  "تقارير الأداء": ["Performance Reports", "Clear summaries for students, families, and school leaders."],
  "رسائل أولياء الأمور": ["Parent Messages", "Ready-to-use, respectful messages for common situations."],
  "بنك الموارد": ["Resource Bank", "Organize links, files, and references by subject."],
};

export default function TeacherTools({ onOpen, language = "ar" }) {
  const isEnglish = language === "en";
  return (
    <section className="space-y-5">
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-l from-sky-500/10 via-ink-800/70 to-ink-800/50 p-5 sm:p-6">
        <div className="absolute -left-10 -top-16 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-[2rem] bg-sky-500/10 shadow-[0_0_45px_rgba(56,189,248,0.16)]">
            <img src="./icons/animated/ai-studio.gif?v=animated1" alt="" className="icon-art icon-art-float h-32 w-32 object-contain" />
            <BrainCircuit className="absolute h-6 w-6 text-sky-300/80" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300">{isEnglish ? "Teacher Tools Hub" : "مركز أدوات المدرس"}</span>
            <h2 className="mt-1 text-xl font-extrabold text-white">{isEnglish ? "Everything you need for teaching and follow-up" : "كل ما تحتاجه للحصة والمتابعة في مكان واحد"}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">{isEnglish ? "From planning and assessment to classroom management, communication, and analytics." : "من التخطيط والتقييم إلى إدارة الصف والتواصل والتحليل. اختر الأداة المناسبة، وسنوصلك إلى النموذج الذكي أو القسم المختص."}</p>
          </div>
        </div>
      </div>

      {toolGroups.map((group) => (
        <div key={group.title}>
          <h3 className="mb-3 text-sm font-bold text-white">{isEnglish ? englishCopy[group.title] : group.title}</h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {group.tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button key={tool.id} onClick={() => onOpen?.(tool)} className="group rounded-2xl border border-white/5 bg-ink-800/55 p-4 text-right transition hover:-translate-y-0.5 hover:border-sky-400/25 hover:bg-ink-800/80">
                  <div className="mb-3 flex items-center justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${colorClasses[tool.color]}`}><Icon className="h-5 w-5" /></div>
                    <span className="text-[10px] text-slate-600 transition group-hover:text-slate-400">فتح الأداة ←</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{isEnglish ? englishCopy[tool.title][0] : tool.title}</h4>
                  <p className="mt-1 text-[11px] leading-6 text-slate-400">{isEnglish ? englishCopy[tool.title][1] : tool.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
