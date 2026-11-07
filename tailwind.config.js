/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans Arabic"', '"Tajawal"', "system-ui", "sans-serif"],
        display: ['"Tajawal"', '"IBM Plex Sans Arabic"', "sans-serif"],
      },
      colors: {
        // لوحة ألوان داكنة احترافية
        ink: {
          950: "#060912",
          900: "#0a0e1a",
          850: "#0d1320",
          800: "#111827",
          750: "#161f31",
          700: "#1c2638",
          600: "#283349",
          500: "#3a4660",
        },
        // أزرق رئيسي
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        sky: {
          400: "#38bdf8",
          500: "#0ea5e9",
        },
        // لون ثانوي بنفسجي مائل للأزرق (غير بنفسجي صريح)
        iris: {
          400: "#818cf8",
          500: "#6366f1",
        },
        // ألوان حالة
        success: "#34d399",
        warning: "#fbbf24",
        danger: "#f87171",
      },
      backgroundImage: {
        "radial-fade": "radial-gradient(ellipse at top, rgba(56,189,248,0.08), transparent 60%)",
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(56, 189, 248, 0.25)",
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 20px 40px -24px rgba(0,0,0,0.6)",
      },
    },
  },
  plugins: [],
};
