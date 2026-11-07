import { useState } from "react";
import {
  FileText,
  BookOpen,
  ClipboardList,
  Clock,
  Award,
  Brain,
  CheckCircle2,
  Lightbulb,
  ListChecks,
  Target,
  Sparkles,
  ChevronDown,
} from "lucide-react";

// خريطة أيقونات حسب نوع الأداة
const typeIcons = { exam: FileText, lesson: BookOpen, worksheet: ClipboardList };
const typeAccents = {
  exam: "text-sky-400 bg-sky-500/10",
  lesson: "text-iris-400 bg-iris-500/10",
  worksheet: "text-emerald-400 bg-emerald-500/10",
};

/**
 * يعرض النتيجة المولّدة مهيكلة حسب نوع الأداة:
 * اختبار (MCQ + مقالي + نموذج إجابة) | تحضير درس | ورقة عمل
 */
export default function GeneratedResult({ result }) {
  const type = result.meta.type.includes("اختبار")
    ? "exam"
    : result.meta.type.includes("تحضير")
    ? "lesson"
    : "worksheet";
  const Icon = typeIcons[type];
  const accent = typeAccents[type];

  return (
    <div className="space-y-4">
      {/* رأس المخرج — بيانات عامة */}
      <ResultHeader meta={result.meta} icon={Icon} accent={accent} />

      {/* المحتوى بحسب النوع */}
      {type === "exam" && <ExamContent result={result} />}
      {type === "lesson" && <LessonContent result={result} />}
      {type === "worksheet" && <WorksheetContent result={result} />}

      {/* توقيع المولّد */}
      <div className="flex items-center gap-1.5 text-[10px] text-slate-600 pt-1">
        <Sparkles className="w-3 h-3" />
        مُولّد بواسطة TeacherAI Hub — متوافق مع معايير وزارة التربية والتعليم المصرية
      </div>
    </div>
  );
}

// ============ الرأس العام ============
function ResultHeader({ meta, icon: Icon, accent }) {
  return (
    <div className="rounded-xl bg-ink-800/60 border border-white/5 p-4">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${accent}`}>
          <Icon className="w-5 h-5" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-white">{meta.title}</h4>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {meta.subject}
            </span>
            <span className="text-slate-600">•</span>
            <span>{meta.grade}</span>
            {meta.difficulty && (
              <>
                <span className="text-slate-600">•</span>
                <span>المستوى: {meta.difficulty}</span>
              </>
            )}
            {meta.assessment && (
              <>
                <span className="text-slate-600">•</span>
                <span>تقويم {meta.assessment}</span>
              </>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-slate-500">
            {meta.totalMarks != null && (
              <span className="flex items-center gap-1">
                <Award className="w-3 h-3 text-amber-400" />
                الدرجة الكلية: {meta.totalMarks}
              </span>
            )}
            {meta.timeMinutes != null && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-sky-400" />
                الزمن: {meta.timeMinutes} دقيقة
              </span>
            )}
            {meta.duration && meta.timeMinutes == null && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-sky-400" />
                زمن الحصة: {meta.duration}
              </span>
            )}
            {meta.strategy && (
              <span className="flex items-center gap-1">
                <Brain className="w-3 h-3 text-iris-400" />
                {meta.strategy}
              </span>
            )}
            <span className="text-slate-600">•</span>
            <span>{meta.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ محتوى الاختبار ============
function ExamContent({ result }) {
  const [showAnswers, setShowAnswers] = useState(true);

  return (
    <div className="space-y-3">
      {/* مفتاح إظهار/إخفاء نموذج الإجابة */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
          <FileText className="w-3.5 h-3.5 text-sky-400" />
          أسئلة الاختبار ({result.mcqs.length + result.essays.length})
        </span>
        <button
          onClick={() => setShowAnswers((s) => !s)}
          className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-ink-700/50 border border-white/5 text-slate-300 hover:text-white hover:border-white/10 transition"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          {showAnswers ? "إخفاء نموذج الإجابة" : "إظهار نموذج الإجابة"}
        </button>
      </div>

      {/* أسئلة الاختيار من متعدد */}
      {result.mcqs.map((q) => (
        <McqCard key={q.number} q={q} showAnswer={showAnswers} />
      ))}

      {/* الأسئلة المقالية */}
      {result.essays.length > 0 && (
        <div className="space-y-3 pt-2">
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-iris-400">
            <Lightbulb className="w-3.5 h-3.5" />
            الأسئلة المقالية
          </span>
          {result.essays.map((q) => (
            <EssayCard key={q.number} q={q} showAnswer={showAnswers} />
          ))}
        </div>
      )}
    </div>
  );
}

// بطاقة سؤال اختيار من متعدد
function McqCard({ q, showAnswer }) {
  const labels = ["أ", "ب", "ج", "د"];
  return (
    <div className="rounded-xl bg-ink-850/40 border border-white/5 p-4">
      <div className="flex items-start gap-2 mb-3">
        <span className="text-xs font-bold text-sky-400 shrink-0 mt-0.5">
          {q.number}-
        </span>
        <div className="flex-1">
          <p className="text-[13px] text-slate-100 leading-relaxed">{q.stem}</p>
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            <Tag color="sky">{q.type}</Tag>
            <Tag color="iris">{q.bloom}</Tag>
            <Tag color="amber">{q.difficulty}</Tag>
            <Tag color="slate">{q.marks} درجة</Tag>
          </div>
        </div>
      </div>
      {/* الخيارات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mr-5">
        {q.options.map((opt, i) => {
          const isCorrect = showAnswer && i === q.correctIndex;
          return (
            <div
              key={i}
              className={[
                "flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] border transition",
                isCorrect
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : "bg-ink-800/50 border-white/5 text-slate-300",
              ].join(" ")}
            >
              <span
                className={[
                  "w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0",
                  isCorrect ? "bg-emerald-500/20 text-emerald-300" : "bg-ink-700 text-slate-400",
                ].join(" ")}
              >
                {labels[i]}
              </span>
              {opt}
              {isCorrect && <CheckCircle2 className="w-3.5 h-3.5 mr-auto text-emerald-400" />}
            </div>
          );
        })}
      </div>
      {/* نموذج الإجابة */}
      {showAnswer && (
        <div className="mt-3 mr-5 rounded-lg bg-emerald-500/5 border border-emerald-500/15 p-3 animate-fade-in">
          <p className="text-[11px] font-bold text-emerald-400 mb-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            نموذج الإجابة
          </p>
          <p className="text-[12px] text-slate-300 leading-relaxed">{q.modelAnswer}</p>
        </div>
      )}
    </div>
  );
}

// بطاقة سؤال مقالي
function EssayCard({ q, showAnswer }) {
  return (
    <div className="rounded-xl bg-ink-850/40 border border-white/5 p-4">
      <div className="flex items-start gap-2 mb-2">
        <span className="text-xs font-bold text-iris-400 shrink-0 mt-0.5">{q.number}-</span>
        <div className="flex-1">
          <p className="text-[13px] text-slate-100 leading-relaxed">{q.stem}</p>
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            <Tag color="iris">{q.type}</Tag>
            <Tag color="iris">{q.bloom}</Tag>
            <Tag color="slate">{q.marks} درجات</Tag>
          </div>
        </div>
      </div>
      {showAnswer && (
        <div className="mt-2 mr-5 rounded-lg bg-iris-500/5 border border-iris-500/15 p-3 animate-fade-in">
          <p className="text-[11px] font-bold text-iris-400 mb-1 flex items-center gap-1">
            <Lightbulb className="w-3 h-3" />
            نموذج الإجابة ومفتاح التصحيح
          </p>
          <p className="text-[12px] text-slate-300 leading-relaxed">{q.modelAnswer}</p>
        </div>
      )}
    </div>
  );
}

// ============ محتوى تحضير الدرس ============
function LessonContent({ result }) {
  const s = result.sections;
  return (
    <div className="space-y-3">
      <LessonSection icon={Target} title="نواتج التعلم (الأهداف السلوكية)" color="sky">
        <ul className="space-y-1.5">
          {s.objectives.map((o, i) => (
            <li key={i} className="flex items-start gap-2 text-[12px] text-slate-300 leading-relaxed">
              <span className="w-4 h-4 rounded-full bg-sky-500/15 text-sky-400 text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              {o}
            </li>
          ))}
        </ul>
      </LessonSection>

      <LessonSection icon={Sparkles} title="التمهيد الجاذب" color="amber">
        <p className="text-[12px] text-slate-300 leading-relaxed">{s.hook}</p>
      </LessonSection>

      <LessonSection icon={BookOpen} title="خطوات الشرح والعرض" color="iris">
        <ol className="space-y-1.5">
          {s.presentation.map((step, i) => (
            <li key={i} className="flex items-start gap-2 text-[12px] text-slate-300 leading-relaxed">
              <span className="w-4 h-4 rounded-md bg-iris-500/15 text-iris-400 text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
        <div className="mt-2 rounded-lg bg-ink-800/60 border border-white/5 p-2.5">
          <p className="text-[11px] text-slate-400 leading-relaxed">{s.strategyNote}</p>
        </div>
      </LessonSection>

      <LessonSection icon={Lightbulb} title="الأنشطة الإثرائية" color="emerald">
        <p className="text-[12px] text-slate-300 leading-relaxed">{s.enrichment}</p>
      </LessonSection>

      <LessonSection icon={ListChecks} title="التقويم الختامي" color="sky">
        <ul className="space-y-1.5">
          {s.assessment.map((a, i) => (
            <li key={i} className="flex items-start gap-2 text-[12px] text-slate-300 leading-relaxed">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
              {a}
            </li>
          ))}
        </ul>
      </LessonSection>
    </div>
  );
}

function LessonSection({ icon: Icon, title, color, children }) {
  const [open, setOpen] = useState(true);
  const colors = {
    sky: "text-sky-400 bg-sky-500/10",
    iris: "text-iris-400 bg-iris-500/10",
    amber: "text-amber-400 bg-amber-500/10",
    emerald: "text-emerald-400 bg-emerald-500/10",
  };
  return (
    <div className="rounded-xl bg-ink-850/40 border border-white/5 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-white/[0.02] transition"
      >
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${colors[color]}`}>
          <Icon className="w-4 h-4" strokeWidth={2} />
        </div>
        <span className="text-[13px] font-bold text-white flex-1 text-right">{title}</span>
        <ChevronDown
          className={`w-4 h-4 text-slate-500 transition-transform ${open ? "" : "-rotate-90"}`}
        />
      </button>
      {open && <div className="px-4 pb-4 pt-1 animate-fade-in">{children}</div>}
    </div>
  );
}

// ============ محتوى ورقة العمل ============
function WorksheetContent({ result }) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
          <ClipboardList className="w-3.5 h-3.5 text-emerald-400" />
          التدريبات والأنشطة ({result.tasks.length})
        </span>
        <span className="text-[10px] text-slate-500">
          {result.meta.duration === "واجب منزلي" ? "واجب منزلي" : `زمن الحصة: ${result.meta.duration}`}
        </span>
      </div>
      {result.tasks.map((t, i) => (
        <div key={i} className="rounded-xl bg-ink-850/40 border border-white/5 p-3.5">
          <div className="flex items-start gap-2.5">
            <span className="w-6 h-6 rounded-md bg-emerald-500/15 text-emerald-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
              {i + 1}
            </span>
            <div className="flex-1">
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                {t.kind}
              </span>
              <p className="text-[12px] text-slate-200 leading-relaxed mt-2">{t.text}</p>
              <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400/70" />
                الإجابة: {t.answer}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============ وسم صغير موحّد ============
function Tag({ children, color }) {
  const colors = {
    sky: "bg-sky-500/10 text-sky-400",
    iris: "bg-iris-500/10 text-iris-400",
    amber: "bg-amber-500/10 text-amber-400",
    emerald: "bg-emerald-500/10 text-emerald-400",
    slate: "bg-white/5 text-slate-400",
  };
  return (
    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${colors[color] || colors.slate}`}>
      {children}
    </span>
  );
}
