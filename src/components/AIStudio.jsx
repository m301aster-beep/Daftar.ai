import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Wand2,
  Copy,
  Check,
  Save,
  Download,
  Loader2,
  RotateCcw,
  FileText,
  BookOpen,
  ClipboardList,
} from "lucide-react";
import {
  generateContent,
  grades,
  subjects,
  assessmentTypes,
  difficultyLevels,
} from "@/lib/eduEngine";
import GeneratedResult from "@/components/GeneratedResult";

// إعدادات كل أداة (الحقول المطلوبة + العنوان)
const toolConfig = {
  exam: {
    label: "مولد الاختبارات",
    icon: FileText,
    accent: "from-sky-500/20 to-sky-500/5",
    iconColor: "text-sky-400",
    fields: { assessment: true, difficulty: true, questionCount: true, purpose: false },
  },
  lesson: {
    label: "مساعد تحضير الدروس",
    icon: BookOpen,
    accent: "from-iris-500/20 to-iris-500/5",
    iconColor: "text-iris-400",
    fields: { assessment: false, difficulty: false, questionCount: false, purpose: false },
  },
  worksheet: {
    label: "مولد أوراق العمل",
    icon: ClipboardList,
    accent: "from-emerald-500/20 to-emerald-500/5",
    iconColor: "text-emerald-400",
    fields: { assessment: false, difficulty: false, questionCount: false, purpose: true },
  },
};

const purposes = ["تدريبات حصصية", "واجب منزلي", "تقوية وتدعيم", "مراجعة نهائية"];

/**
 * الاستوديو الذكي: نموذج توليد محتوى تعليمي وفق المنهج المصري.
 * يختار المعلم الأداة، ثم يملأ بيانات الدرس فيولّد المحرك المخرج.
 */
export default function AIStudio({ selectedTool, preset, seedTopic, onConsumeSeed }) {
  const [tool, setTool] = useState(selectedTool || "exam");
  const [form, setForm] = useState({
    subject: "اللغة العربية",
    grade: "الصف الثالث الإعدادي",
    topic: "",
    assessment: "ختامي",
    difficulty: "متدرّج",
    questionCount: 5,
    purpose: "تدريبات حصصية",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const topicRef = useRef(null);

  const cfg = toolConfig[tool];

  // مزامنة الأداة المختارة من الخارج
  useEffect(() => {
    if (selectedTool) {
      setTool(selectedTool);
      setResult(null);
    }
  }, [selectedTool]);

  // تطبيق preset (مثل: واجب منزلي)
  useEffect(() => {
    if (preset) {
      setForm((f) => ({ ...f, ...preset }));
      if (preset.toolId && preset.toolId !== tool) setTool(preset.toolId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset]);

  // تعبئة الموضوع من اختصار خارجي
  useEffect(() => {
    if (seedTopic) {
      setForm((f) => ({ ...f, topic: seedTopic }));
      onConsumeSeed?.();
      topicRef.current?.focus();
    }
  }, [seedTopic, onConsumeSeed]);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleGenerate = async () => {
    if (!form.topic.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setCopied(false);
    setSaved(false);
    const out = await generateContent(tool, form);
    setResult(out);
    setLoading(false);
  };

  const handleReset = () => {
    setForm((f) => ({ ...f, topic: "" }));
    setResult(null);
    topicRef.current?.focus();
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-ink-800/50 border border-white/5 shadow-card">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-l from-transparent via-sky-400/40 to-transparent" />

      {/* رأس البطاقة */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500/20 to-iris-500/20 border border-white/5 flex items-center justify-center">
            <Sparkles className="w-[18px] h-[18px] text-sky-400" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">الاستوديو الذكي التعليمي</h3>
            <p className="text-[11px] text-slate-400">
              اختر الأداة، أدخل بيانات الدرس، وسيولّد المحرك المحتوى فورًا
            </p>
          </div>
        </div>
        <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-iris-500/15 text-iris-400 border border-iris-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-iris-400 animate-pulse-dot" />
          المحرك نشِط
        </span>
      </div>

      <div className="p-5 space-y-5">
        {/* اختيار الأداة */}
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(toolConfig).map(([id, t]) => {
            const Icon = t.icon;
            const active = tool === id;
            return (
              <button
                key={id}
                onClick={() => {
                  setTool(id);
                  setResult(null);
                }}
                className={[
                  "flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border transition text-center",
                  active
                    ? "bg-gradient-to-br " + t.accent + " border-white/10"
                    : "bg-ink-850/40 border-white/5 hover:border-white/10",
                ].join(" ")}
              >
                <Icon
                  className={["w-5 h-5", active ? t.iconColor : "text-slate-500"].join(" ")}
                  strokeWidth={2}
                />
                <span
                  className={[
                    "text-[11px] font-bold leading-tight",
                    active ? "text-white" : "text-slate-400",
                  ].join(" ")}
                >
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* النموذج */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="المادة الدراسية">
            <Select value={form.subject} onChange={(v) => update("subject", v)} options={subjects} />
          </Field>
          <Field label="الصف الدراسي">
            <Select value={form.grade} onChange={(v) => update("grade", v)} options={grades} />
          </Field>

          {/* الموضوع/الدرس — يأخذ صفًا كاملًا */}
          <div className="sm:col-span-2">
            <Field label="عنوان الدرس / الموضوع">
              <input
                ref={topicRef}
                value={form.topic}
                onChange={(e) => update("topic", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                placeholder="مثال: الجملة الفعلية — تركيبها وأحكامها"
                className="w-full rounded-xl bg-ink-900/70 border border-white/5 focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/10 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 transition outline-none"
              />
            </Field>
          </div>

          {/* حقول إضافية حسب الأداة */}
          {cfg.fields.assessment && (
            <Field label="نوع التقويم">
              <Select
                value={form.assessment}
                onChange={(v) => update("assessment", v)}
                options={assessmentTypes}
              />
            </Field>
          )}
          {cfg.fields.difficulty && (
            <Field label="مستوى الصعوبة">
              <Select
                value={form.difficulty}
                onChange={(v) => update("difficulty", v)}
                options={difficultyLevels}
              />
            </Field>
          )}
          {cfg.fields.questionCount && (
            <Field label="عدد أسئلة الاختيار">
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={form.questionCount}
                  onChange={(e) => update("questionCount", Number(e.target.value))}
                  className="flex-1 accent-sky-500"
                />
                <span className="w-8 text-center text-sm font-bold text-sky-400 tabular-nums">
                  {form.questionCount}
                </span>
              </div>
            </Field>
          )}
          {cfg.fields.purpose && (
            <div className="sm:col-span-2">
              <Field label="الغرض من ورقة العمل">
                <div className="flex flex-wrap gap-2">
                  {purposes.map((p) => (
                    <button
                      key={p}
                      onClick={() => update("purpose", p)}
                      className={[
                        "text-[11px] font-medium px-3 py-1.5 rounded-lg border transition",
                        form.purpose === p
                          ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                          : "bg-ink-850/40 border-white/5 text-slate-400 hover:text-white hover:border-white/10",
                      ].join(" ")}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          )}
        </div>

        {/* أزرار التحكم */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerate}
            disabled={!form.topic.trim() || loading}
            className={[
              "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition",
              !form.topic.trim() || loading
                ? "bg-ink-700/50 text-slate-500 cursor-not-allowed"
                : "bg-gradient-to-l from-sky-500 to-iris-500 text-white hover:opacity-90 glow-blue",
            ].join(" ")}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" strokeWidth={2.2} />}
            {loading ? "جارٍ التوليد..." : `توليد ${cfg.label}`}
          </button>
          <button
            onClick={handleReset}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 bg-ink-700/40 border border-white/5 hover:text-white hover:bg-ink-700/70 transition disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
            مسح
          </button>
        </div>

        {/* منطقة عرض النتائج */}
        {(loading || result) && (
          <div className="animate-fade-in-up">
            <div className="rounded-xl bg-ink-900/60 border border-white/5 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-ink-850/50">
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                  <FileText className="w-3.5 h-3.5 text-sky-400" />
                  المخرج التعليمي
                </div>
                {result && (
                  <div className="flex items-center gap-1">
                    <ActionBtn icon={copied ? Check : Copy} label={copied ? "نُسخ" : "نسخ"} active={copied} onClick={handleCopy} />
                    <ActionBtn
                      icon={Save}
                      label={saved ? "حُفظ" : "حفظ"}
                      active={saved}
                      onClick={() => {
                        setSaved(true);
                        setTimeout(() => setSaved(false), 1800);
                      }}
                    />
                    <ActionBtn icon={Download} label="تصدير" onClick={() => {}} />
                  </div>
                )}
              </div>
              <div className="p-5 min-h-[220px] max-h-[560px] overflow-y-auto">
                {loading ? <LoadingState tool={cfg.label} /> : <GeneratedResult result={result} />}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ مكوّنات النموذج المساعدة ============
function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-slate-400 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl bg-ink-900/70 border border-white/5 focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/10 px-4 py-2.5 text-sm text-slate-100 transition outline-none appearance-none cursor-pointer"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%2394a3b8' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left 0.9rem center",
      }}
    >
      {options.map((o) => (
        <option key={o} value={o} className="bg-ink-850 text-slate-100">
          {o}
        </option>
      ))}
    </select>
  );
}

function ActionBtn({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition",
        active ? "bg-emerald-500/15 text-emerald-400" : "text-slate-400 hover:text-white hover:bg-white/5",
      ].join(" ")}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

function LoadingState({ tool }) {
  const steps = [
    "تحليل بيانات الدرس والمادة...",
    "مطابقة نواتج التعلم بمستويات بلوم...",
    "صياغة الأسئلة والتشتتات الذكية...",
    "إعداد نموذج الإجابة ومفتاح التصحيح...",
    "التحقق من التوافق مع المنهج المصري...",
  ];
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-sky-400 mb-2">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        {tool === "مولد الاختبارات" ? "يبنى الاختبار الآن..." : tool === "مساعد تحضير الدروس" ? "يُحضّر الدرس الآن..." : "تُصمّم ورقة العمل الآن..."}
      </div>
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: `${i * 180}ms` }}>
          <div className="h-3.5 rounded-md shimmer flex-1" />
        </div>
      ))}
      <div className="text-[11px] text-slate-500 mt-2">{steps[2]}</div>
    </div>
  );
}
