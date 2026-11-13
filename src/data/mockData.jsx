// بيانات واجهة TeacherAI Hub — متوافقة مع المنظومة التعليمية المصرية

// عناصر القائمة الجانبية
export const navItems = [
  { id: "dashboard", label: "الرئيسية", icon: "LayoutDashboard" },
  { id: "generator", label: "الاستوديو", icon: "Sparkles" },
  { id: "students", label: "الطلاب", icon: "Users" },
  { id: "archive", label: "المحفوظات", icon: "FolderOpen" },
  { id: "automation", label: "الأتمتة", icon: "Workflow" },
  { id: "settings", label: "البروفايل", icon: "UserRound" },
];

// إحصائيات سريعة للوحة التحكم
export const stats = [
  {
    id: "students",
    label: "إجمالي الطلاب",
    value: 248,
    change: "+12",
    changeType: "up",
    icon: "Users",
    accent: "from-sky-500/20 to-sky-500/5",
    iconColor: "text-sky-400",
  },
  {
    id: "quizzes",
    label: "اختبارات هذا الأسبوع",
    value: 37,
    change: "+8",
    changeType: "up",
    icon: "FileText",
    accent: "from-iris-500/20 to-iris-500/5",
    iconColor: "text-iris-400",
  },
  {
    id: "lessons",
    label: "دروس محضّرة",
    value: 64,
    change: "+15",
    changeType: "up",
    icon: "BookOpen",
    accent: "from-emerald-500/20 to-emerald-500/5",
    iconColor: "text-emerald-400",
  },
  {
    id: "hours",
    label: "ساعات موفّرة",
    value: 19.5,
    change: "+2.4",
    changeType: "up",
    icon: "Clock",
    accent: "from-amber-500/20 to-amber-500/5",
    iconColor: "text-amber-400",
  },
];

// الأدوات التعليمية الثلاث الرئيسية + مسارات سريعة إضافية
export const tools = [
  {
    id: "exam",
    title: "مولد الاختبارات",
    desc: "اختيار من متعدد بتشتتات ذكية وأسئلة مقالية مع نموذج الإجابة",
    icon: "FileText",
    accent: "from-sky-500/20 to-sky-500/5",
    iconColor: "text-sky-400",
  },
  {
    id: "lesson",
    title: "مساعد تحضير الدروس",
    desc: "تحضير متكامل بنواتج التعلم والتعلم النشط والتقويم الختامي",
    icon: "BookOpen",
    accent: "from-iris-500/20 to-iris-500/5",
    iconColor: "text-iris-400",
  },
  {
    id: "worksheet",
    title: "مولد أوراق العمل",
    desc: "أنشطة وتدريبات منسقة تناسب زمن الحصة أو كواجب منزلي",
    icon: "ClipboardList",
    accent: "from-emerald-500/20 to-emerald-500/5",
    iconColor: "text-emerald-400",
  },
];

// بطاقات الوصول السريع (تنتقل مباشرة للاستوديو بالأداة المختارة)
export const quickActions = [
  {
    id: "exam",
    title: "اختبار سريع",
    desc: "اختبار اختيار من متعدد مع نموذج الإجابة",
    icon: "FileText",
    toolId: "exam",
  },
  {
    id: "lesson",
    title: "تحضير درس",
    desc: "نواتج تعلم واستراتيجيات تعلم نشط",
    icon: "BookOpen",
    toolId: "lesson",
  },
  {
    id: "worksheet",
    title: "ورقة عمل",
    desc: "أنشطة وتدريبات جاهزة للطباعة",
    icon: "ClipboardList",
    toolId: "worksheet",
  },
  {
    id: "homework",
    title: "واجب منزلي",
    desc: "تدريبات تناسب وقت المنزل مع التصحيح",
    icon: "House",
    toolId: "worksheet",
    preset: { purpose: "واجب منزلي" },
  },
];

// قائمة الطلاب — أسماء مصرية ومدارس مصرية
export const students = [
  {
    id: 1,
    name: "أحمد محمود",
    grade: "الصف الثالث الإعدادي",
    level: "متقدم",
    progress: 92,
    lastQuiz: "الجملة الفعلية",
    score: 18,
    status: "active",
  },
  {
    id: 2,
    name: "سارة عبد الرحمن",
    grade: "الصف الثالث الإعدادي",
    level: "متقدم",
    progress: 88,
    lastQuiz: "المفاعيل",
    score: 17,
    status: "active",
  },
  {
    id: 3,
    name: "خالد إبراهيم",
    grade: "الصف الثاني الإعدادي",
    level: "متوسط",
    progress: 71,
    lastQuiz: "الجملة الفعلية",
    score: 14,
    status: "active",
  },
  {
    id: 4,
    name: "نورهان أحمد",
    grade: "الصف الثالث الإعدادي",
    level: "متوسط",
    progress: 65,
    lastQuiz: "الاسم الموصول",
    score: 13,
    status: "review",
  },
  {
    id: 5,
    name: "فهد مصطفى",
    grade: "الصف الثاني الإعدادي",
    level: "يحتاج دعماً",
    progress: 42,
    lastQuiz: "المفاعيل",
    score: 8,
    status: "warning",
  },
  {
    id: 6,
    name: "ريم خالد",
    grade: "الصف الثالث الإعدادي",
    level: "متقدم",
    progress: 95,
    lastQuiz: "الجملة الفعلية",
    score: 19,
    status: "active",
  },
];

// نتائج البحث في الأرشيف
export const archiveItems = [
  {
    id: 1,
    title: "درس: الجملة الفعلية وأنواعها",
    type: "درس",
    icon: "BookOpen",
    date: "قبل 3 أيام",
    subject: "اللغة العربية",
  },
  {
    id: 2,
    title: "اختبار تكويني: المفاعيل العشرة",
    type: "اختبار",
    icon: "FileText",
    date: "قبل أسبوع",
    subject: "اللغة العربية",
  },
  {
    id: 3,
    title: "ورقة عمل: تحليل جملة نحوية",
    type: "ورقة عمل",
    icon: "ClipboardList",
    date: "قبل 5 أيام",
    subject: "اللغة العربية",
  },
  {
    id: 4,
    title: "تحضير: وحدة النحو — أعمال السنة",
    type: "تحضير",
    icon: "Folder",
    date: "قبل أسبوعين",
    subject: "إدارة صف",
  },
  {
    id: 5,
    title: "تقرير: أداء الصف الثالث الإعدادي",
    type: "تقرير",
    icon: "BarChart3",
    date: "أمس",
    subject: "تحليلات",
  },
];

// مهام الأتمتة المجدولة
export const automations = [
  {
    id: 1,
    name: "إرسال تقارير أعمال السنة",
    desc: "تُرسل لإدارة المدرسة أسبوعيًّا كل يوم سبت",
    icon: "Send",
    schedule: "كل سبت — 8:00 ص",
    enabled: true,
  },
  {
    id: 2,
    name: "مزامنة درجات الطلاب",
    desc: "تحديث النتائج من نظام الإدارة المدرسية",
    icon: "RefreshCw",
    schedule: "يومياً — 6:30 ص",
    enabled: true,
  },
  {
    id: 3,
    name: "تذكير الواجبات",
    desc: "إشعار الطلاب بالواجبات غير المسلّمة",
    icon: "BellRing",
    schedule: "يومياً — 4:00 م",
    enabled: false,
  },
];
